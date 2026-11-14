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
 * Batch 40 (8 stand-alone science articles): "Physics in Our World" series for JHS (Basic 7 to Basic 9).
 * Each article is tied to a BECE Integrated Science topic (see the first cultural note and the teacher guide).
 * These are science articles, not stories: there are no characters, so `characters` is empty and one narrator reads throughout.
 * Original text written for Ghanaian learners; facts updated to November 2026.
 */

export const BATCH_40_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'round-the-world-how-fast-is-fast',
    title: 'Round the World: How Fast Is Fast?',
    summary:
      'People have raced around the world by ship, balloon, aeroplane, and spacecraft. This article uses those journeys to explain how speed is calculated and why the fastest vehicle does not always arrive first.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['science', 'educational'],
    themes: ['technology', 'school'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Brisk, clear, and curious',
    palette: ['#0369a1', '#f59e0b'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Light, travelling guitar and shaker rhythm (placeholder)',
    pages: [
      pg(
        '🚌',
        'A VIP bus leaves Accra at six in the morning and pulls into Kumasi at one in the afternoon. The road is about 250 kilometres long, and the trip has taken 7 hours. How fast was the bus? Divide the distance by the time: 250 ÷ 7 is about 36 kilometres per hour. That is its speed. Speed tells us how far something travels in each unit of time. The same simple sum works for a snail, a sprinter, a ship, or a spacecraft. It even works for a journey all the way round the world, which is about 40,000 kilometres.',
        'A long-distance coach on the Accra to Kumasi road in early morning light, with a roadside distance sign.'
      ),
      pg(
        '🧮',
        'Scientists write the rule like this: speed = distance ÷ time. Speed is measured in metres per second (m/s) or kilometres per hour (km/h). To change metres per second into kilometres per hour, multiply by 3.6. The bus did not move at 36 km/h all the way. It crawled through the traffic at Pokuase, ran freely on the open road past Nkawkaw, and crawled again at Konongo. So 36 km/h is its average speed: the total distance divided by the total time, including every stop. When you know any two of speed, distance, and time, you can calculate the third.',
        'A simple triangle diagram linking speed, distance, and time, beside a line of vehicles in slow traffic.'
      ),
      pg(
        '⛵',
        'The first trip round the world began in 1519, when five wooden ships left Spain under Ferdinand Magellan. Storms, hunger, and fighting destroyed most of the fleet. Magellan himself was killed on the way. In September 1522, one ship, the Victoria, finally reached home with only 18 of the crew who had set out. The voyage had taken almost three years. Using 40,000 kilometres as the distance, its average speed was about 1.5 km/h. You walk to school faster than that. The ship was not really so slow. It spent months waiting in harbours, and average speed counts all the time.',
        'A small wooden sailing ship of the 1500s with patched sails arriving at a harbour.'
      ),
      pg(
        '🎈',
        'In 1873, the French writer Jules Verne imagined a traveller circling the globe in 80 days, using steamships and trains. That needs an average of about 21 km/h. Today a sailing prize is named after him. In January 2026, the French yacht Sodebo Ultim 3 won it by sailing round the world without stopping in 40 days and almost 11 hours. Others took to the air. In 2002, Steve Fossett flew alone round the world in a balloon in just over 13 days. In 2005, he did it again in a single-seat jet aeroplane, without stopping or refuelling, in 67 hours.',
        'Three ways of circling the globe shown around a small Earth: a three-hulled racing yacht, a tall silver balloon, and a slender long-winged jet aeroplane.'
      ),
      pg(
        '🛰️',
        'A passenger jet cruises at about 900 km/h. If it could fly round the world without landing, it would need about 44 hours. The fastest travellers of all are astronauts. The International Space Station orbits about 400 kilometres above the ground at roughly 28,000 km/h. That is nearly 8 kilometres every second. It circles Earth about once every 90 minutes, so its crew see the Sun rise and set about 16 times each day. From 1.5 km/h to 28,000 km/h: in five centuries, people have learned to go round the world almost twenty thousand times faster.',
        'The International Space Station with its long solar panels above the curved blue edge of Earth at sunrise.'
      ),
      pg(
        '🧰',
        'In a long race, top speed is not everything. A yacht that sails fastest may still lose if it takes a longer route, stops for repairs, or meets calm weather. What counts is average speed over the whole course. One sailor who understood this was Ellen MacArthur, who set a solo record of 71 days in 2005. Alone at sea, she had to make everything on board last. She later began working for a circular economy, in which things are designed to be repaired, reused, and recycled. The repairers of Suame Magazine in Kumasi have practised that idea for decades.',
        'A busy vehicle-repair workshop yard like Suame Magazine in Kumasi, with mechanics repairing engines and reusing metal parts.'
      ),
    ],
    activities: [
      {
        id: 'rw-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'A bus travels 120 km in 3 hours. What is its average speed?',
        options: [
          '360 km/h',
          '40 km/h',
          '123 km/h',
        ],
        correctIndex: 1,
      },
      {
        id: 'rw-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why is the bus’s speed of 36 km/h called an average speed?',
        options: [
          'It is the total distance divided by the total time, including stops',
          'The bus moved at exactly 36 km/h for the whole journey',
          'It is the highest speed the bus reached',
        ],
        correctIndex: 0,
      },
      {
        id: 'rw-c3',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why was the average speed of the Victoria so low?',
        options: [
          'The total time included long periods when the ship was not sailing',
          'The Earth was larger in 1522',
          'The ship could not move faster than a person walking',
        ],
        correctIndex: 0,
      },
      {
        id: 'rw-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Two cyclists ride from Tamale to Savelugu, about 25 km. Ama rides steadily at 20 km/h. Kojo rides at 30 km/h but stops for 40 minutes to mend a tyre. Who arrives first?',
        options: [
          'Kojo, because his speed is higher',
          'Ama, because her total time is 75 minutes and his is 90 minutes',
          'They arrive together',
        ],
        correctIndex: 1,
      },
      {
        id: 'rw-s1',
        type: 'sequencing',
        prompt: 'Arrange from slowest average speed to fastest.',
        items: [
          'The ship Victoria (1519 to 1522)',
          'Jules Verne’s imaginary traveller (80 days)',
          'The yacht Sodebo Ultim 3 (about 40 days)',
          'Steve Fossett’s jet aeroplane (67 hours)',
          'The International Space Station (about 90 minutes)',
        ],
      },
      {
        id: 'rw-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'average speed',
        definition: 'The total distance travelled divided by the total time taken.',
        distractors: [
          'The greatest speed reached during a journey',
          'The speed shown on a vehicle’s dial at one moment',
        ],
      },
    ],
    glossary: [
      {
        word: 'speed',
        definition: 'The distance travelled in each unit of time.',
        pages: [1, 2],
      },
      {
        word: 'distance',
        definition: 'How far something travels, measured in metres or kilometres.',
        pages: [1, 2, 3],
      },
      {
        word: 'average',
        definition: 'Average speed: total distance divided by total time, including stops.',
        pages: [2, 3, 4, 6],
      },
      {
        word: 'orbits',
        definition: 'Travels round a planet or star along a curved path.',
        pages: [5],
      },
      {
        word: 'circular',
        definition: 'Circular economy: a way of making and using things so that they are repaired, reused, and recycled instead of thrown away.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'BECE link: speed, distance, and time; units of speed; average speed.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Local accuracy: long journeys such as Accra to Kumasi are made by VIP or STC coach, not trotro, and usually take 6 to 8 hours. The route passes Pokuase, Amasaman, Nsawam, Nkawkaw, and Konongo, with the heaviest traffic at Pokuase and Konongo.',
    ],
    reviewQuestions: [
      'Check 250 ÷ 7 ≈ 36 km/h, 40,000 ÷ 1,920 ≈ 21 km/h, and 40,000 ÷ 67 ≈ 600 km/h.',
      'Confirm that the Jules Verne Trophy holder named on Page 4 is still current.',
    ],
    guide: {
      overview:
        'Teaches speed = distance ÷ time and average speed through a familiar coach journey and five centuries of journeys round the world.',
      lessonMinutes: 45,
      goals: [
        'State and use the equation speed = distance ÷ time.',
        'Convert between metres per second and kilometres per hour.',
        'Explain what average speed means and why stops lower it.',
        'Compare journeys by calculating their average speeds.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: forces and motion: speed, distance, and time)', 'Calculating speed and average speed'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates)', 'Division, unit conversion, and time in hours and minutes'],
      ],
      before: ['Ask: How long does it take to travel from here to the regional capital, and how far is it? Work out the average speed together.'],
      during: ['Pause on Page 2 and ask learners to name places on a journey they know where vehicles slow down or stop.'],
      after: ['Time learners walking and running 50 metres on the field and calculate each speed in m/s and km/h.'],
      discussion: ['Why can a slower but steady traveller arrive before a faster one?'],
      reflection: ['What things at home could be repaired or reused instead of thrown away?'],
      maths: [
        {
          task: 'Jules Verne’s traveller covers 40,000 km in 80 days. What is the average speed in km/h?',
          answer: '80 days = 1,920 hours; 40,000 ÷ 1,920 is about 21 km/h.',
        },
        {
          task: 'The jet aeroplane covered 40,000 km in 67 hours. What was its average speed?',
          answer: '40,000 ÷ 67 is about 600 km/h.',
        },
        {
          task: 'A sprinter runs 100 m in 10 s. What is the speed in m/s and in km/h?',
          answer: '10 m/s; 10 × 3.6 = 36 km/h.',
        },
        {
          task: 'A coach covers the 250 km from Accra to Kumasi in 8 hours on a bad day and 6 hours on a good day. Find the average speed each time.',
          answer: 'Bad day: 250 ÷ 8 is about 31 km/h. Good day: 250 ÷ 6 is about 42 km/h.',
        },
      ],
      support: ['Give learners a speed-distance-time triangle card and three worked examples to copy.'],
      stretch: ['The yacht’s official course was 40,000 km, but it actually sailed about 52,000 km to find good wind. Calculate both average speeds and explain why the crew chose the longer route.'],
      localise: ['Replace the Accra to Kumasi journey with a route your learners travel, using its real distance, usual time, and known traffic points.'],
      factCheck: [
        {
          claim: 'Sodebo Ultim 3 won the Jules Verne Trophy in January 2026 in 40 days and almost 11 hours; the International Space Station orbits at about 28,000 km/h (about 90 minutes per orbit).',
          explanation: 'Jules Verne Trophy record (Sodebo Ultim 3, 40 days 10 hours 45 minutes, January 2026) and Magellan, Fossett, and ISS orbital figures checked.',
          reference: 'WSSRC / Trophée Jules Verne records; NASA International Space Station facts.',
        },
      ],
    },
  }),

  // 2
  mk({
    key: 'the-train-in-a-tube',
    title: 'The Train in a Tube',
    summary:
      'Two forces slow every vehicle on Earth: friction and air resistance. This article explains both, shows how magnets can lift a train off its track, and tells the true story of the hyperloop, a bold idea that has not yet worked.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['science', 'educational'],
    themes: ['technology', 'school'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Clear, lively, and practical',
    palette: ['#334155', '#22c55e'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Smooth, gliding synth pulse with light percussion (placeholder)',
    pages: [
      pg(
        '📦',
        'Push a heavy box across a rough cement floor and you feel the floor pushing back. Ride a bicycle fast and you feel the air pressing against your chest. These are two forces that oppose motion. The first is friction, which acts wherever two surfaces rub together. The second is air resistance, which acts on anything moving through air. Both turn useful movement energy into heat. Rub your palms together quickly and you can feel that heat. Every car, lorry, and train burns extra fuel just to overcome these two forces.',
        'Two small scenes side by side: hands pushing a heavy box across a rough floor, and a cyclist leaning into the wind, each with an arrow showing the opposing force.'
      ),
      pg(
        '🛞',
        'Friction is not always a nuisance. Without it your sandals would slip on the ground, tyres could not grip the road, and brakes could not stop a vehicle. But where we want things to move easily, we reduce friction. We put oil or grease between moving parts. We use wheels and ball bearings so that surfaces roll instead of slide. We make surfaces smooth. Air resistance is reduced by shape. A streamlined shape, narrow and smooth like a fish or a bird, lets air slide past. That is why fast trains and aeroplanes have pointed noses.',
        'A mechanic’s hands oiling a bicycle chain, beside a streamlined fish and a pointed-nosed train drawn with smooth air-flow lines.'
      ),
      pg(
        '🧲',
        'What if a train never touched its track? Magnets make this possible. Every magnet has two poles, north and south. Like poles repel each other, and unlike poles attract. A maglev train (short for magnetic levitation) uses strong electromagnets to lift the whole train a few centimetres above the guideway. With no wheels on rails, there is almost no friction. Other magnets along the track pull the train forward from the front and push it from behind. In 2015, a test maglev train in Japan reached 603 km/h, the fastest any train has travelled.',
        'A cross-section of a maglev train floating a few centimetres above its guideway, with magnet poles marked N and S and arrows showing repulsion.'
      ),
      pg(
        '🚇',
        'A maglev train still has to push through air. At high speed, air resistance becomes the biggest force of all. In 2013, the businessman Elon Musk published a design he called the hyperloop. Small passenger pods would float on magnets inside a long sealed tube with most of the air pumped out. With almost no friction and almost no air resistance, he suggested, a pod could travel at about 1,200 km/h, close to the speed of sound. The idea was not completely new. In 1867, visitors to an exhibition in New York rode in a carriage blown through a tube by air.',
        'A cutaway of a long tube on pillars across open country with a small pod floating inside it and very few air particles shown in the tube.'
      ),
      pg(
        '🏜️',
        'Several companies tried to build it. One, called Hyperloop One, laid a 500-metre test tube in the desert of Nevada in the United States. In 2017, an empty pod reached 387 km/h there. In November 2020, two members of staff became the first passengers, travelling at 172 km/h. That was far below the promised speed, and slower than ordinary fast trains. The costs were enormous. Keeping hundreds of kilometres of tube almost empty of air, and safe for passengers, proved very difficult. At the end of 2023 the company closed. Research continues elsewhere, but no hyperloop carries passengers today.',
        'A short white test tube on supports in a dry desert landscape under a clear sky.'
      ),
      pg(
        '🚴',
        'The science behind the hyperloop is sound. Less friction and less air resistance really do mean less wasted energy. But a good idea in physics is not yet a working machine. Engineers must also make it safe, reliable, and affordable. Still, the numbers are exciting. Accra to Kumasi is about 250 kilometres. By VIP or STC bus it often takes seven hours. At the speed of Japan’s maglev it would take 25 minutes. The same forces act on you every day. A cyclist who bends low over the handlebars meets less air resistance, and a well-oiled chain wastes less of the rider’s energy.',
        'A cyclist bent low over the handlebars on a Ghanaian road, with smooth air-flow lines passing over the rider’s back.'
      ),
    ],
    activities: [
      {
        id: 'tt-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What happens to the energy that friction takes away from a moving object?',
        options: [
          'It disappears completely',
          'It is changed into magnetism',
          'It is changed into heat',
        ],
        correctIndex: 2,
      },
      {
        id: 'tt-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why does a maglev train have almost no friction with its track?',
        options: [
          'Its wheels are made of very smooth steel',
          'Magnets lift it so that it does not touch the track',
          'It travels too slowly for friction to act',
        ],
        correctIndex: 1,
      },
      {
        id: 'tt-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why would pods inside a hyperloop tube meet very little air resistance?',
        options: [
          'The pods are very heavy',
          'The tube is filled with cold air',
          'Most of the air has been pumped out of the tube',
        ],
        correctIndex: 2,
      },
      {
        id: 'tt-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A grinding mill becomes hot and noisy, and its engine uses more fuel than before. What is the most likely cause, and the best first remedy?',
        options: [
          'Too little friction; add sand to the moving parts',
          'Too much friction between moving parts; clean and oil them',
          'Too much air resistance; move the mill indoors',
        ],
        correctIndex: 1,
      },
      {
        id: 'tt-s1',
        type: 'sequencing',
        prompt: 'Arrange from the vehicle that wastes most energy on friction and air resistance to the one that would waste least.',
        items: [
          'A loaded cart dragged along the ground without wheels',
          'A lorry on wheels on a tarred road',
          'A streamlined train on steel rails',
          'A maglev train floating above its guideway',
          'A maglev pod inside a tube with the air pumped out',
        ],
      },
      {
        id: 'tt-voc',
        type: 'vocabulary',
        afterPage: 1,
        word: 'friction',
        definition: 'A force that opposes motion when two surfaces rub together.',
        distractors: [
          'A force that pulls all objects towards the Earth',
          'The push between two like magnetic poles',
        ],
      },
    ],
    glossary: [
      {
        word: 'friction',
        definition: 'A force that opposes motion when two surfaces rub together.',
        pages: [1, 2, 3, 4, 6],
      },
      {
        word: 'resistance',
        definition: 'Air resistance: a force that opposes the motion of an object through air.',
        pages: [1, 2, 4, 6],
      },
      {
        word: 'streamlined',
        definition: 'Shaped so that air or water flows past easily.',
        pages: [2],
      },
      {
        word: 'repel',
        definition: 'To push away; like magnetic poles repel each other.',
        pages: [3],
      },
      {
        word: 'maglev',
        definition: 'Magnetic levitation: using magnets to lift a vehicle above its track.',
        pages: [3, 4, 6],
      },
    ],
    culturalNotes: [
      'BECE link: forces; friction and air resistance; magnetism (like poles repel, unlike poles attract).',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Accuracy note: the hyperloop was designed for about 1,200 km/h, not the far higher figures sometimes quoted, and no passenger system exists. The article presents it as an unfinished experiment.',
    ],
    reviewQuestions: [
      'Confirm that no hyperloop passenger service has opened since this was written; if one has, update Page 5.',
      'Check 250 ÷ 600 ≈ 0.417 hours ≈ 25 minutes.',
    ],
    guide: {
      overview:
        'Explains friction and air resistance as forces that oppose motion, how they are reduced, how magnetic levitation removes rolling friction, and what the hyperloop story shows about turning physics into engineering.',
      lessonMinutes: 45,
      goals: [
        'Define friction and air resistance and give examples of each.',
        'Describe ways of reducing friction and air resistance.',
        'State the rule for magnetic poles and explain how a maglev train floats.',
        'Explain why a sound scientific idea may still fail as a working system.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: forces: friction, air resistance, and magnetism)', 'Opposing forces, reducing friction, and magnetic poles'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates)', 'Time-distance calculations and fractions'],
      ],
      before: ['Ask learners to rub their palms together for ten seconds and describe what they feel and why.'],
      during: ['Pause on Page 3 with two bar magnets: let learners feel like poles repel and unlike poles attract.'],
      after: ['Slide a book across a desk, then roll it over three round pencils. Compare the force needed and explain the difference.'],
      discussion: ['The hyperloop company spent a great deal of money and then closed. Was the effort wasted?'],
      reflection: ['Where in your home or community would less friction save effort or fuel?'],
      maths: [
        {
          task: 'Accra to Kumasi is 250 km. How long would the journey take at 600 km/h? Give your answer in minutes.',
          answer: '250 ÷ 600 = 0.417 hours, about 25 minutes.',
        },
        {
          task: 'The test pod reached 387 km/h. The design speed was about 1,200 km/h. What fraction of the design speed was reached?',
          answer: '387 ÷ 1,200 is about one third (32 per cent).',
        },
        {
          task: 'A coach takes 7 hours to cover 250 km. How many times faster than the coach is a 600 km/h maglev?',
          answer: 'The coach averages about 36 km/h; 600 ÷ 36 is about 17 times faster.',
        },
      ],
      support: ['Provide picture cards of everyday situations for learners to sort into “friction helps” and “friction wastes energy”.'],
      stretch: ['Find out why air resistance increases so quickly with speed, and why racing cyclists ride close behind one another.'],
      localise: ['Use local examples of friction: grinding mills, bicycle and motorbike chains, cart wheels, and worn tyres.'],
      factCheck: [
        {
          claim: 'Japan’s L0 Series maglev train reached 603 km/h in 2015; Hyperloop One reached 387 km/h uncrewed (2017) and 172 km/h with passengers (2020) before closing at the end of 2023.',
          explanation: 'Hyperloop One test speeds (387 km/h; 172 km/h with passengers) and closure at the end of 2023 checked alongside the Central Japan Railway maglev speed record (603 km/h, April 2015).',
          reference: 'Central Japan Railway Company (2015); Virgin Hyperloop test reports (2017, 2020).',
        },
      ],
    },
  }),

  // 3
  mk({
    key: 'the-horse-that-named-a-unit',
    title: 'The Horse That Named a Unit',
    summary:
      'In science, work and power have exact meanings. This article explains both, tells how a hard-working horse gave us the unit of horsepower, and shows where watts and kilowatts appear in Ghanaian life.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['science', 'educational'],
    themes: ['technology', 'school'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Steady, clear, and practical',
    palette: ['#92400e', '#2563eb'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Steady, working rhythm on xylophone and soft drum (placeholder)',
    pages: [
      pg(
        '🪣',
        'A girl carries a bucket of water from the standpipe up the steps to her classroom. She is tired, and she says she has worked hard. A scientist would agree. In science, work is done whenever a force moves something through a distance. Work done = force × distance moved in the direction of the force. Force is measured in newtons (N) and distance in metres (m), so work is measured in newton-metres, called joules (J). If she had stood still holding the bucket, her arms would ache, but she would have done no work on the bucket, because it did not move.',
        'A flight of school steps with a full bucket shown at the bottom and again at the top, with an arrow marking the height it was lifted.'
      ),
      pg(
        '⏱️',
        'Two students each carry a full bucket up the same steps. The bucket weighs 200 newtons and the steps rise 3 metres. Each student does 200 × 3 = 600 joules of work. But one takes 10 seconds and the other takes 30. The faster student is more powerful. Power is the rate of doing work: power = work done ÷ time taken. It is measured in joules per second, called watts (W). The first student’s power is 600 ÷ 10 = 60 watts. The second student’s is 600 ÷ 30 = 20 watts. A thousand watts make one kilowatt (kW).',
        'Two identical buckets beside two stopwatches reading 10 seconds and 30 seconds, with the calculations 60 W and 20 W written beneath.'
      ),
      pg(
        '🐴',
        'The watt is named after James Watt, a Scottish engineer who lived more than two hundred years ago. Steam engines already existed, but they wasted most of their coal. Watt redesigned the engine so that it did far more work with the same fuel. His engines soon drove pumps, mills, and factories. To sell them, he had to compare an engine with something every customer understood: a horse. One story says a brewer tested Watt’s engine against his strongest horse. Watt worked out that a strong horse could lift about 15,000 kilograms of water through 0.3 metres every minute.',
        'A strong horse walking in a circle to turn a pump, beside an early steam engine with a large beam and flywheel.'
      ),
      pg(
        '🔢',
        'Watt called that rate of working one horsepower. We can check it with the equations. A mass of 15,000 kilograms weighs about 150,000 newtons. Lifting it 0.3 metres takes 150,000 × 0.3 = 45,000 joules of work. Doing that in 60 seconds gives a power of 45,000 ÷ 60 = 750 watts. So one horsepower is about 750 watts, or three-quarters of a kilowatt. The unit is still used. The engine of a corn mill or a motorbike is often described in horsepower. A 10-horsepower engine has a power of about 7,500 watts, or 7.5 kilowatts.',
        'A corn-mill engine with a rating plate, beside a notebook page showing the calculation that one horsepower is about 750 watts.'
      ),
      pg(
        '🛠️',
        'Long before engines, people used simple machines. A simple machine does not reduce the work to be done. It lets a smaller force do the job by moving through a longer distance. Loaders roll a heavy drum up a sloping plank into a lorry instead of lifting it straight up. The plank is an inclined plane, the same idea the ancient Egyptians used when they built the pyramids. A pulley at a well changes the direction of the pull. A crowbar is a lever. A cutlass blade is a wedge. Engines and electric motors came later, to supply the force.',
        'A heavy drum being rolled up a sloping plank into the back of a lorry, with a well pulley, a crowbar, and a cutlass shown as small labelled sketches.'
      ),
      pg(
        '💡',
        'Every engine changes energy from one form into another. A steam or diesel engine turns the chemical energy stored in fuel into heat, and then into movement. An electric motor turns electrical energy into movement. No machine is perfect. Some energy is always wasted as heat and sound, and engines that burn fuel also release smoke and carbon dioxide. Look for watts on the labels around you. An LED bulb uses about 9 watts. An electric kettle uses about 2,000 watts. The generators at Akosombo Dam can supply about 1,020 megawatts of power. That is more than a thousand million watts, from falling water.',
        'Akosombo Dam with water flowing through it, and small labelled pictures of an LED bulb marked 9 W and an electric kettle marked 2,000 W.'
      ),
    ],
    activities: [
      {
        id: 'hn-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'In which case is work done on the object, in the scientific sense?',
        options: [
          'A boy leans against a wall that does not move',
          'A woman lifts a basin of yams from the ground onto her head',
          'A man stands still holding a heavy bag',
        ],
        correctIndex: 1,
      },
      {
        id: 'hn-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'Two people do the same amount of work. Who has the greater power?',
        options: [
          'The one who takes the shorter time',
          'The one who takes the longer time',
          'They always have the same power',
        ],
        correctIndex: 0,
      },
      {
        id: 'hn-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What does a simple machine such as a sloping plank do?',
        options: [
          'It reduces the total work needed to zero',
          'It allows a smaller force to be used over a longer distance',
          'It creates extra energy',
        ],
        correctIndex: 1,
      },
      {
        id: 'hn-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A pump lifts 500 N of water through 10 m in 20 s. What is its power?',
        options: [
          '100 W',
          '250 W',
          '5,000 W',
        ],
        correctIndex: 1,
      },
      {
        id: 'hn-s1',
        type: 'sequencing',
        prompt: 'Arrange from lowest power to highest.',
        items: [
          'An LED bulb (9 W)',
          'A student carrying a bucket upstairs (60 W)',
          'One horsepower (750 W)',
          'An electric kettle (2,000 W)',
          'Akosombo Dam (1,020 MW)',
        ],
      },
      {
        id: 'hn-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'power',
        definition: 'The rate of doing work: work done divided by time taken.',
        distractors: [
          'The total force needed to lift an object',
          'The energy stored in a fuel',
        ],
      },
    ],
    glossary: [
      {
        word: 'work',
        definition: 'Force multiplied by the distance moved in the direction of the force; measured in joules.',
        pages: [1, 2, 4, 5],
      },
      {
        word: 'joules',
        definition: 'The unit of work and energy; one newton moved through one metre.',
        pages: [1, 2, 4],
      },
      {
        word: 'power',
        definition: 'The rate of doing work; work done divided by time taken.',
        pages: [2, 4, 6],
      },
      {
        word: 'watts',
        definition: 'The unit of power; one joule per second.',
        pages: [2, 4, 6],
      },
      {
        word: 'horsepower',
        definition: 'An older unit of power, about 750 watts.',
        pages: [4],
      },
      {
        word: 'machine',
        definition: 'Simple machine: a device such as a lever, pulley, or inclined plane that lets a smaller force do a job.',
        pages: [5, 6],
      },
    ],
    culturalNotes: [
      'BECE link: work done (force × distance); power (work ÷ time); simple machines; energy transformation.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'The article uses 10 newtons as the weight of 1 kilogram, the value normally used at JHS level.',
    ],
    reviewQuestions: [
      'Check 15,000 kg × 10 N/kg × 0.3 m ÷ 60 s = 750 W, and 500 × 10 ÷ 20 = 250 W.',
      'Confirm that the horse story on Page 3 is presented as a story, not as established fact.',
    ],
    guide: {
      overview:
        'Defines work and power with a bucket-carrying example, derives the horsepower from James Watt’s comparison with a horse, links simple machines to reduced force, and shows watts and kilowatts in Ghanaian life.',
      lessonMinutes: 45,
      goals: [
        'Calculate work done using work = force × distance.',
        'Calculate power using power = work ÷ time, and convert watts to kilowatts.',
        'Explain how a simple machine reduces the force needed without reducing the work.',
        'Describe the energy changes in a fuel engine and in an electric motor.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: energy: work, power, and simple machines)', 'Work done, power, simple machines, and energy transformation'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates)', 'Multiplication, division, and unit conversion'],
      ],
      before: ['Ask: What do you mean when you say you have “worked hard”? Collect answers, then compare them with the scientific meaning after Page 1.'],
      during: ['Pause on Page 2 and have two volunteers time each other climbing a short flight of steps. Who is more powerful?'],
      after: ['Survey the power ratings (in watts) on five appliances at home or school and rank them.'],
      discussion: ['A ramp makes loading easier, yet the total work is no less. How can both be true?'],
      reflection: ['Which simple machines did you use today without noticing?'],
      maths: [
        {
          task: 'A loader pushes a drum with a force of 300 N along a plank 4 m long. How much work is done?',
          answer: '300 × 4 = 1,200 J.',
        },
        {
          task: 'He takes 8 seconds. What is his power?',
          answer: '1,200 ÷ 8 = 150 W.',
        },
        {
          task: 'A corn-mill engine is rated at 8 horsepower. What is that in kilowatts?',
          answer: '8 × 750 = 6,000 W = 6 kW.',
        },
        {
          task: 'How many 2,000 W kettles could Akosombo’s 1,020 MW supply at once?',
          answer: '1,020,000,000 ÷ 2,000 = 510,000 kettles.',
        },
      ],
      support: ['Give a formula card: work (J) = force (N) × distance (m); power (W) = work (J) ÷ time (s).'],
      stretch: ['Measure your own power: find your weight in newtons, climb a measured flight of steps, time it, and calculate your power in watts and in horsepower.'],
      localise: ['Use the engines learners know: corn mills, water pumps, motorbikes, and generators, and read their rating plates.'],
      factCheck: [
        {
          claim: 'One horsepower is about 750 watts; Akosombo Dam has an installed capacity of 1,020 megawatts.',
          explanation: 'Arithmetic checked (15,000 kg × 10 N/kg × 0.3 m ÷ 60 s = 750 W; mechanical horsepower is 745.7 W). Akosombo’s installed capacity is 1,020 MW.',
          reference: 'Volta River Authority (VRA) Akosombo Hydroelectric Plant specifications; SI / imperial unit conversion tables.',
        },
      ],
    },
  }),

  // 4
  mk({
    key: 'the-giant-sling',
    title: 'The Giant Sling',
    summary:
      'A see-saw, a wheelbarrow, and a giant stone-throwing machine all obey the same rule. This article explains levers and turning forces, and follows energy as it changes from stored energy into movement.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['science', 'educational'],
    themes: ['technology', 'school'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Measured, clear, and vivid',
    palette: ['#78350f', '#0f766e'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Slow wooden percussion building to a single swinging release (placeholder)',
    pages: [
      pg(
        '⚖️',
        'On a playground see-saw, a small child can balance a much bigger one. The trick is where they sit. The small child sits far from the middle, and the big child sits close to it. A see-saw is a lever: a stiff bar that turns about a fixed point called the pivot, or fulcrum. The turning effect of a force is called its moment. Moment = force × distance from the pivot. A small force far from the pivot can have the same moment as a large force close to it. That is why the see-saw balances.',
        'A wooden see-saw balanced level with a small child seated far from the pivot and a larger child seated close to it.'
      ),
      pg(
        '🔧',
        'Every lever has a pivot, a load to be moved, and an effort, which is the force you apply. Levers are grouped into three classes by which of these is in the middle. In a first-class lever, the pivot is in the middle, as in a see-saw, a crowbar, or a pair of scissors. In a second-class lever, the load is in the middle, as in a wheelbarrow or a bottle opener. In a third-class lever, the effort is in the middle, as in a pair of tongs, a fishing rod, or a broom. Your own forearm is a third-class lever, with the elbow as its pivot.',
        'Three labelled diagrams showing a crowbar, a wheelbarrow, and a pair of tongs, each marked with pivot, load, and effort.'
      ),
      pg(
        '🪨',
        'Most levers help us lift a heavy load with a small effort. But a lever can also be used the other way round: a large force moving a short distance can make the far end move a long distance, very fast. Hundreds of years ago, before cannons, armies used this idea to throw heavy stones at castle walls. The machine was called a trebuchet (say TREB-yoo-shay). It had a long wooden beam on a pivot. A very heavy box of rocks, the counterweight, hung from the short end. A sling holding a stone was tied to the long end.',
        'A labelled diagram of a wooden trebuchet showing the beam, pivot, counterweight on the short arm, and sling on the long arm.'
      ),
      pg(
        '🌀',
        'Soldiers pulled the long end down, which raised the counterweight high into the air. When they let go, the counterweight dropped and the beam swung round. Both ends of the beam turn through the same angle in the same time. But the long end travels round a much bigger circle, so it moves much faster. If the long arm is four times the length of the short arm, its tip moves four times as fast. The sling made the arm longer still. At the top of the swing the sling opened, and the stone flew off towards its target.',
        'The trebuchet beam shown in three positions as it swings, with a small arc traced by the short end and a much larger arc traced by the long end.'
      ),
      pg(
        '🔋',
        'A trebuchet is also a lesson in energy. An object lifted high above the ground stores gravitational potential energy. The heavier the object and the higher it is lifted, the more energy it stores. When the counterweight falls, this stored energy changes into kinetic energy, the energy of movement, in the beam and the stone. As the stone rises through the air it slows, and some kinetic energy becomes potential energy again. As it falls, it speeds up. When it hits the wall, its energy does work breaking the stone and is spread out as heat and sound. Energy is never destroyed. It only changes form.',
        'An energy-flow diagram with arrows: raised counterweight (potential energy), swinging beam and flying stone (kinetic energy), then heat and sound at the wall.'
      ),
      pg(
        '🚗',
        'The largest trebuchets could throw a stone as heavy as two grown men over a distance of two or three football pitches. Would a heavier stone or a faster stone do more damage? Kinetic energy depends on both mass and speed, but speed counts for more. Doubling the mass doubles the energy. Doubling the speed makes the energy four times as great. Today trebuchets are built only for sport and for physics lessons, but the rule still matters every day. A car at 100 km/h carries four times the kinetic energy of the same car at 50 km/h. That is why speeding makes crashes so deadly.',
        'Two identical cars on a road, one marked 50 km/h with a short energy bar and one marked 100 km/h with an energy bar four times as long.'
      ),
    ],
    activities: [
      {
        id: 'gs-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What is the moment of a force?',
        options: [
          'The turning effect of the force: force × distance from the pivot',
          'The time for which the force acts',
          'The weight of the lever',
        ],
        correctIndex: 0,
      },
      {
        id: 'gs-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'A wheelbarrow is a second-class lever. What lies between the pivot and the effort?',
        options: [
          'The load',
          'Nothing',
          'Another pivot',
        ],
        correctIndex: 0,
      },
      {
        id: 'gs-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What energy change takes place as the counterweight falls?',
        options: [
          'Gravitational potential energy changes into kinetic energy',
          'Heat energy changes into potential energy',
          'Kinetic energy changes into chemical energy',
        ],
        correctIndex: 0,
      },
      {
        id: 'gs-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A 20 kg child sits 3 m from the pivot of a see-saw. Where must a 30 kg child sit on the other side to balance it?',
        options: [
          '3 m from the pivot',
          '2 m from the pivot',
          '4.5 m from the pivot',
        ],
        correctIndex: 1,
      },
      {
        id: 'gs-s1',
        type: 'sequencing',
        prompt: 'Arrange the energy changes in the order they happen.',
        items: [
          'Soldiers pull the long arm down, raising the counterweight.',
          'The raised counterweight stores gravitational potential energy.',
          'The counterweight falls, changing potential into kinetic energy.',
          'The stone flies through the air with kinetic energy.',
          'The stone hits the wall, turning energy into heat and sound.',
        ],
      },
      {
        id: 'gs-voc',
        type: 'vocabulary',
        afterPage: 1,
        word: 'pivot',
        definition: 'The fixed point about which a lever turns.',
        distractors: [
          'The force applied to a lever',
          'The object a lever is used to move',
        ],
      },
    ],
    glossary: [
      {
        word: 'lever',
        definition: 'A stiff bar that turns about a fixed point.',
        pages: [1, 2, 3],
      },
      {
        word: 'pivot',
        definition: 'The fixed point about which a lever turns; also called the fulcrum.',
        pages: [1, 2, 3],
      },
      {
        word: 'moment',
        definition: 'The turning effect of a force: force × distance from the pivot.',
        pages: [1],
      },
      {
        word: 'effort',
        definition: 'The force applied to a lever.',
        pages: [2, 3],
      },
      {
        word: 'potential',
        definition: 'Gravitational potential energy: energy stored in an object because it has been raised above the ground.',
        pages: [5],
      },
      {
        word: 'kinetic',
        definition: 'Kinetic energy: the energy an object has because it is moving.',
        pages: [5, 6],
      },
    ],
    culturalNotes: [
      'BECE link: levers and their classes; turning effect of a force (moment); potential and kinetic energy; energy transformation.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Safety and sensitivity: the trebuchet is treated only as a historical machine that illustrates levers and energy. Learners must not build stone-throwing machines; model the idea with a ruler balanced on a pencil and small coins as loads.',
      'Road-safety link: Page 6 uses the same physics to explain why speeding is dangerous.',
    ],
    reviewQuestions: [
      'Check the see-saw balance: 20 × 3 = 30 × 2.',
      'Confirm that the article gives no building instructions and keeps the focus on levers, energy, and road safety.',
    ],
    guide: {
      overview:
        'Uses the see-saw to teach moments and the three classes of lever, then uses a historical throwing machine to show how a lever can multiply speed and how potential energy changes into kinetic energy, ending with a road-safety application.',
      lessonMinutes: 45,
      goals: [
        'Define a lever, pivot, load, effort, and moment.',
        'Classify common levers as first, second, or third class.',
        'Explain why the long end of a pivoted beam moves faster than the short end.',
        'Describe changes between gravitational potential energy and kinetic energy, and explain why speed greatly increases kinetic energy.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: forces and energy: levers, moments, and energy transformation)', 'Classes of lever, turning effect of a force, potential and kinetic energy'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates)', 'Simple equations and ratio'],
      ],
      before: ['Balance a ruler on a pencil. Ask: where must one coin go to balance two coins on the other side?'],
      during: ['Pause on Page 2 and have learners point to the pivot, load, and effort on scissors, a bottle opener, and a broom.'],
      after: ['List ten levers found at home or school and sort them into the three classes.'],
      discussion: ['Energy is never destroyed. So where has the stone’s energy gone after it hits the wall?'],
      reflection: ['How could what you learned on Page 6 change the way you behave as a passenger or road user?'],
      maths: [
        {
          task: 'A 600 N man sits 1 m from the pivot of a see-saw. How far from the pivot must a 200 N child sit to balance him?',
          answer: '600 × 1 = 200 × d, so d = 3 m.',
        },
        {
          task: 'The short arm of a model beam is 20 cm and the long arm is 80 cm. If the short end moves at 2 m/s, how fast does the long end move?',
          answer: 'Four times as fast: 8 m/s.',
        },
        {
          task: 'A car slows from 100 km/h to 50 km/h. By what fraction does its kinetic energy fall?',
          answer: 'To one quarter, so it loses three-quarters of its kinetic energy.',
        },
      ],
      support: ['Provide labelled pictures of six levers with the pivot already marked; learners add load and effort.'],
      stretch: ['Kinetic energy = ½ × mass × speed². Use it to compare a 1,000 kg car at 10 m/s and at 20 m/s.'],
      localise: ['Use familiar levers: the hoe, the fufu pestle, the wheelbarrow, the well sweep, and the claw hammer.'],
      factCheck: [
        {
          claim: 'Doubling the speed of a moving object quadruples its kinetic energy; moment of a force equals force multiplied by perpendicular distance from the pivot.',
          explanation: 'Arithmetic checked (20 × 3 = 30 × 2; KE = ½mv², so doubling v multiplies KE by 4). Historical trebuchet range and projectile figures are approximate.',
          reference: 'NaCCA JHS Integrated Science Curriculum (Forces and Energy).',
        },
      ],
    },
  }),

  // 5
  mk({
    key: 'the-fastest-punch-in-the-sea',
    title: 'The Fastest Punch in the Sea',
    summary:
      'A small sea animal can strike faster than the eye can follow. This article uses the mantis shrimp to explain elastic potential energy, the difference between mass and weight, and how engineers learn from living things.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['science', 'educational'],
    themes: ['technology', 'school'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Lively, precise, and full of wonder',
    palette: ['#be123c', '#0e7490'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Bright, bubbling marimba with quick percussive snaps (placeholder)',
    pages: [
      pg(
        '🪃',
        'Pull back the rubber of a catapult and hold it. Nothing is moving, yet you can feel that something is ready to happen. The stretched rubber is storing energy. Let go, and that stored energy becomes movement in an instant. Energy stored in an object that has been stretched, squashed, or bent is called elastic potential energy. A drawn bow stores it. So does a squeezed spring, a trampoline, and the tight skin of a drum. One small animal has used the same trick for millions of years, and it does it better than any catapult.',
        'A wooden catapult with its rubber stretched back, beside a drawn bow and a coiled spring.'
      ),
      pg(
        '🦐',
        'The peacock mantis shrimp lives on coral reefs in the Indian and Pacific Oceans. It is brightly coloured and only about as long as your hand. At the front of its body it carries two folded limbs that end in hard clubs. It uses them to smash open the shells of crabs and snails. The club swings out at about 23 metres per second, which is more than 80 km/h, and the whole strike is over in less than three thousandths of a second. The blow lands with a force of more than 700 newtons.',
        'A brightly coloured mantis shrimp on a coral reef, with its two folded club-like front limbs clearly visible.'
      ),
      pg(
        '🔒',
        'Muscles alone could never move that fast. So the mantis shrimp does not use its muscles to punch. It uses them to load a spring. Part of its hard outer skeleton is shaped like a saddle. Slowly, the muscles bend this saddle, and a tiny latch holds it in place. Chemical energy from the animal’s food has been changed into elastic potential energy. Then the latch lets go. In an instant, the elastic potential energy becomes kinetic energy in the club. The energy is the same, but it is released in a far shorter time. That means far greater power.',
        'A close-up diagram of the mantis shrimp’s striking limb showing the saddle-shaped spring bent and held by a small latch, then released.'
      ),
      pg(
        '⚖️',
        'How strong is a 700-newton punch? To judge, we need the difference between mass and weight. Mass is the amount of matter in an object, measured in kilograms. Weight is the force of gravity pulling on that mass, measured in newtons. On Earth, each kilogram weighs about 10 newtons. A mantis shrimp with a mass of 50 grams, or 0.05 kilograms, weighs only 0.5 newtons. Its punch is therefore more than a thousand times its own weight. A person with a mass of 60 kilograms weighs 600 newtons. The shrimp’s punch is greater than that.',
        'A balance comparing a small mantis shrimp labelled 0.5 N with a person labelled 600 N, and an arrow labelled 700 N for the punch.'
      ),
      pg(
        '🫧',
        'There is more. The club moves so fast that the water behind it cannot keep up. The pressure there drops so low that the water turns to vapour, forming tiny bubbles. A moment later the bubbles collapse with a snap, giving off heat, sound, and even a flash of light. So the prey is hit twice: once by the club and once by the collapsing bubbles. Fishers who handle mantis shrimps with bare hands risk a split thumb, and large ones kept in tanks have been known to crack the glass.',
        'The club of a mantis shrimp striking a crab shell under water, with a small burst of bubbles forming just behind the club.'
      ),
      pg(
        '🪖',
        'How does the club survive thousands of such blows without breaking? Under a microscope, it is built in layers, each one turned slightly from the one below, like a twisted pile of mats. A crack that starts cannot run straight through. Engineers are copying this pattern to make lighter, tougher helmets and aircraft parts. Designing with ideas borrowed from living things is called biomimicry. Relatives of the mantis shrimp live in the Gulf of Guinea too, and now and then one comes up in a fishing net. Nature tested these designs long before any laboratory did.',
        'A magnified cross-section of the club showing layers stacked in a twisting pattern, beside a safety helmet with the same pattern in its shell.'
      ),
    ],
    activities: [
      {
        id: 'fp-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Which of these is storing elastic potential energy?',
        options: [
          'A stone lying on the ground',
          'A pot of boiling water',
          'A bow that has been drawn back',
        ],
        correctIndex: 2,
      },
      {
        id: 'fp-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What energy change happens when the mantis shrimp’s latch lets go?',
        options: [
          'Elastic potential energy changes into kinetic energy',
          'Kinetic energy changes into chemical energy',
          'Light energy changes into elastic potential energy',
        ],
        correctIndex: 0,
      },
      {
        id: 'fp-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What is the difference between mass and weight?',
        options: [
          'There is no difference',
          'Mass is measured in newtons and weight in kilograms',
          'Mass is the amount of matter; weight is the force of gravity on it',
        ],
        correctIndex: 2,
      },
      {
        id: 'fp-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A hunter slowly draws a bow and then releases the arrow. Why does the arrow fly much faster than he could throw it by hand?',
        options: [
          'The bow adds extra energy that did not come from the hunter',
          'The energy he stored slowly in the bow is released in a very short time',
          'The arrow becomes lighter when it leaves the bow',
        ],
        correctIndex: 1,
      },
      {
        id: 'fp-s1',
        type: 'sequencing',
        prompt: 'Arrange the steps of the mantis shrimp’s strike.',
        items: [
          'The shrimp takes in chemical energy from its food.',
          'Its muscles slowly bend the saddle-shaped spring.',
          'A latch holds the spring, storing elastic potential energy.',
          'The latch releases, and the club swings out with kinetic energy.',
          'Bubbles form behind the club and collapse, striking the prey again.',
        ],
      },
      {
        id: 'fp-voc',
        type: 'vocabulary',
        afterPage: 1,
        word: 'elastic potential energy',
        definition: 'Energy stored in an object that has been stretched, squashed, or bent.',
        distractors: [
          'Energy an object has because it is moving',
          'Energy stored in food and fuels',
        ],
      },
    ],
    glossary: [
      {
        word: 'elastic',
        definition: 'Elastic potential energy: energy stored in an object that has been stretched, squashed, or bent.',
        pages: [1, 3],
      },
      {
        word: 'kinetic',
        definition: 'Kinetic energy: the energy an object has because it is moving.',
        pages: [3],
      },
      {
        word: 'mass',
        definition: 'The amount of matter in an object, measured in kilograms.',
        pages: [4],
      },
      {
        word: 'weight',
        definition: 'The force of gravity on an object, measured in newtons.',
        pages: [4],
      },
      {
        word: 'newtons',
        definition: 'The unit of force; on Earth, 1 kg weighs about 10 newtons.',
        pages: [2, 4],
      },
      {
        word: 'biomimicry',
        definition: 'Designing things by copying ideas from living organisms.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'BECE link: forms of energy (elastic potential, kinetic, chemical); energy transformation; mass and weight; force.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'The catapult on Page 1 is used only to illustrate stored energy. Remind learners that catapults must never be aimed at people or animals.',
    ],
    reviewQuestions: [
      'Check 23 × 3.6 ≈ 83 km/h and 700 ÷ 0.5 = 1,400.',
      'Confirm the mantis shrimp figures (speed, strike time, force) against a current biology source.',
    ],
    guide: {
      overview:
        'Introduces elastic potential energy with a catapult, then uses the mantis shrimp’s spring-loaded strike to teach energy transformation, the link between power and time, and the difference between mass and weight, ending with biomimicry.',
      lessonMinutes: 45,
      goals: [
        'Define elastic potential energy and give everyday examples.',
        'Describe the energy changes in a spring-loaded strike: chemical to elastic potential to kinetic.',
        'Distinguish between mass and weight and calculate weight from mass.',
        'Explain what biomimicry is and give an example.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: energy: forms of energy and energy transformation; mass and weight)', 'Elastic potential and kinetic energy, mass, weight, and force'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates)', 'Unit conversion, multiplication, and division with decimals'],
      ],
      before: ['Stretch a rubber band and ask: where is the energy now, and where will it go if I let go?'],
      during: ['Pause on Page 4 and have each learner calculate their own weight in newtons from their mass in kilograms.'],
      after: ['List five objects that store elastic potential energy and say what the energy becomes when each is released.'],
      discussion: ['The shrimp’s muscles are slow, yet its punch is fast. How does storing energy solve that problem?'],
      reflection: ['What other animal or plant has a design that people could copy?'],
      maths: [
        {
          task: 'The club moves at 23 m/s. What is that in km/h?',
          answer: '23 × 3.6 is about 83 km/h.',
        },
        {
          task: 'What is the weight of a 45 kg student on Earth?',
          answer: '45 × 10 = 450 N.',
        },
        {
          task: 'A punch of 700 N comes from an animal that weighs 0.5 N. How many times its own weight is that?',
          answer: '700 ÷ 0.5 = 1,400 times.',
        },
        {
          task: 'The same energy is released in 0.003 s instead of 0.3 s. How many times greater is the power?',
          answer: '100 times, because power = energy ÷ time.',
        },
      ],
      support: ['Use a spring or rubber band to act out “slow to load, quick to fire” before reading Page 3.'],
      stretch: ['Find out about one other fast biological movement, such as a flea’s jump or a chameleon’s tongue, and identify where the energy is stored.'],
      localise: ['Talk to local fishers about unusual animals that come up in their nets, and compare them with the mantis shrimp.'],
      factCheck: [
        {
          claim: 'The peacock mantis shrimp club reaches about 23 m/s (over 80 km/h) in under 3 milliseconds with a peak force exceeding 700 N.',
          explanation: 'Arithmetic checked (23 × 3.6 = 82.8 km/h; 700 N ÷ 0.5 N = 1,400). Stomatopod species also occur in West African coastal waters (Gulf of Guinea).',
          reference: 'Patek et al., Nature (2004), "Deadly strike mechanism of a mantis shrimp"; Weaver et al., Science (2012).',
        },
      ],
    },
  }),

  // 6
  mk({
    key: 'ice-steam-and-molten-rock',
    title: 'Ice, Steam and Molten Rock',
    summary:
      'Water changes state in every kitchen, but rock can melt too. This article explains solids, liquids, and gases, shows how pressure and temperature decide the state of a material, and asks whether melting ice can wake a volcano.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['science', 'educational'],
    themes: ['weather', 'school'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Calm, clear, and curious',
    palette: ['#0284c7', '#dc2626'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Cool, dripping kalimba notes warming into low drums (placeholder)',
    pages: [
      pg(
        '🧊',
        'By noon, the ice-block seller’s block has shrunk and a pool of water has spread around it. A lump of shea butter left in the sun goes soft and then runny. A kettle on the fire sends up a cloud. Each is a change in the state of matter. Matter exists in three common states: solid, liquid, and gas. A solid keeps its own shape. A liquid flows and takes the shape of its container. A gas spreads out to fill any space. The same material, such as water, can exist in all three.',
        'A large block of ice melting on a market table, a lump of shea butter softening in the sun, and a kettle giving off a cloud.'
      ),
      pg(
        '🔬',
        'All matter is made of tiny particles. In a solid they are packed closely in fixed positions and can only vibrate. In a liquid they are still close together but can slide past each other. In a gas they are far apart and move quickly in all directions. Heating gives particles more energy. Heat a solid enough and it melts into a liquid. Heat the liquid and it evaporates or boils into a gas. Cooling reverses the changes: a gas condenses into a liquid, and a liquid freezes into a solid. Pure water melts at 0 °C and boils at 100 °C.',
        'Three boxes showing particles packed tightly in a solid, close but disordered in a liquid, and far apart in a gas, with arrows labelled melting, boiling, condensing, and freezing.'
      ),
      pg(
        '🌋',
        'Rock seems to be the most solid thing there is. But deep inside the Earth it is extremely hot. At temperatures of around 1,000 °C, rock melts into a thick, glowing liquid called magma. Where magma forces its way to the surface, we have a volcano. Once it flows out, it is called lava. As lava cools, it freezes back into solid rock. Rocks formed this way are called igneous rocks. Granite, which builders across Ghana crush into chippings, formed from magma that cooled slowly underground long ago.',
        'A cutaway of a volcano showing glowing magma rising from deep underground and lava flowing down the outside.'
      ),
      pg(
        '🍲',
        'Temperature is not the whole story. Pressure also affects changes of state. In a pressure cooker, the high pressure keeps water liquid well above 100 °C, so beans cook faster. Inside the Earth, the enormous weight of the rock above squeezes hot rock so hard that much of it stays solid, even though it is hot enough to melt. If that pressure is reduced, some of the rock can melt without getting any hotter. Now imagine a volcano buried under a sheet of ice hundreds of metres thick. The ice is part of the weight pressing down.',
        'A pressure cooker on a stove beside a cross-section of the Earth’s crust with a thick ice sheet on top and arrows showing its weight pressing down.'
      ),
      pg(
        '🏔️',
        'Iceland, an island in the far north, has many volcanoes under glaciers. In April 2010, one of them erupted through its ice cap. The melted ice caused floods, and a cloud of ash stopped aeroplanes flying across Europe for days. Scientists have found that when Iceland’s thick ice melted at the end of the last ice age, about 12,000 years ago, eruptions became many times more frequent. With less pressure on the rock below, more rock melted. Glaciers are shrinking again today because of global warming. Researchers are studying whether this will cause more eruptions in future. No single eruption has yet been proved to result from it.',
        'A snow-covered volcano erupting through an ice cap, sending up a tall dark cloud of ash with meltwater flowing below.'
      ),
      pg(
        '🌊',
        'Ghana has no active volcanoes. The nearest is Mount Cameroon. But changes of state shape our lives all the same. Water evaporates from the sea and the Volta Lake, condenses into clouds, and falls as rain. And melting ice far away affects our coast. Gases such as carbon dioxide, released when we burn fuels and forests, trap heat in the atmosphere. This is the greenhouse effect. As the world warms, ice on land melts and seawater expands, so the sea level rises. At Keta and Ada, the sea is already taking land and homes.',
        'A stretch of Ghanaian coastline with waves reaching the foundations of houses and a sea-defence wall of rocks.'
      ),
    ],
    activities: [
      {
        id: 'im-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'How are the particles arranged in a liquid?',
        options: [
          'Far apart and moving quickly in all directions',
          'Close together but able to slide past each other',
          'Packed in fixed positions, only vibrating',
        ],
        correctIndex: 1,
      },
      {
        id: 'im-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What is the difference between magma and lava?',
        options: [
          'Magma is found only in the sea',
          'Magma is solid and lava is liquid',
          'Magma is molten rock underground; lava has reached the surface',
        ],
        correctIndex: 2,
      },
      {
        id: 'im-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why can very hot rock deep in the Earth remain solid?',
        options: [
          'It is too far from the Sun to melt',
          'It contains no particles',
          'The great pressure of the rock above keeps it solid',
        ],
        correctIndex: 2,
      },
      {
        id: 'im-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A cold bottle of water taken from a fridge becomes wet on the outside. Which change of state explains this?',
        options: [
          'Water vapour in the air condenses on the cold surface',
          'Water leaks through the plastic by melting',
          'The water inside evaporates through the bottle',
        ],
        correctIndex: 0,
      },
      {
        id: 'im-s1',
        type: 'sequencing',
        prompt: 'Arrange the steps by which melting ice could lead to an eruption.',
        items: [
          'Greenhouse gases trap more heat in the atmosphere.',
          'A glacier lying over a volcano melts and becomes thinner.',
          'The weight pressing down on the rock below is reduced.',
          'With less pressure, more hot rock melts into magma.',
          'Magma rises to the surface, and the volcano erupts.',
        ],
      },
      {
        id: 'im-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'condense',
        definition: 'To change from a gas to a liquid.',
        distractors: [
          'To change from a solid to a liquid',
          'To change from a liquid to a solid',
        ],
      },
    ],
    glossary: [
      {
        word: 'matter',
        definition: 'State of matter: one of the forms in which matter exists (solid, liquid, or gas).',
        pages: [1, 2],
      },
      {
        word: 'particles',
        definition: 'The tiny pieces that all matter is made of.',
        pages: [2],
      },
      {
        word: 'melt',
        definition: 'To change from a solid to a liquid.',
        pages: [4],
      },
      {
        word: 'condenses',
        definition: 'Changes from a gas to a liquid.',
        pages: [2, 6],
      },
      {
        word: 'magma',
        definition: 'Molten rock beneath the Earth’s surface.',
        pages: [3],
      },
      {
        word: 'pressure',
        definition: 'A measure of how strongly a force squeezes or presses on a surface.',
        pages: [4, 5],
      },
      {
        word: 'greenhouse',
        definition: 'Greenhouse effect: the trapping of heat in the atmosphere by gases such as carbon dioxide.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'BECE link: states of matter and the particle model; changes of state; the greenhouse effect and climate change.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Accuracy note: the link between melting ice and more eruptions is established for the end of the last ice age and is being studied for today’s warming. The article does not claim that the 2010 eruption was caused by melting ice.',
      'Lake Bosumtwi is not a volcano; it is a meteorite impact crater (see the article on comets).',
    ],
    reviewQuestions: [
      'Confirm that Page 5 presents the ice-and-eruption link as research in progress, not settled fact.',
      'Check 500 × 334 = 167,000 J.',
    ],
    guide: {
      overview:
        'Teaches the three states of matter and the particle model through Ghanaian examples, extends changes of state to molten rock and the role of pressure, and links melting ice to volcanoes abroad and to sea-level rise on Ghana’s coast.',
      lessonMinutes: 45,
      goals: [
        'Describe the arrangement and movement of particles in solids, liquids, and gases.',
        'Name the changes of state and state the melting and boiling points of water.',
        'Explain how pressure, as well as temperature, affects whether a material is solid or liquid.',
        'Explain the greenhouse effect and one way that global warming affects Ghana.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: diversity of matter: states of matter and changes of state; climate change)', 'Particle model, changes of state, and the greenhouse effect'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates)', 'Multiplication with large numbers'],
      ],
      before: ['Ask learners to name three solids, three liquids, and three gases found in the school compound.'],
      during: ['Pause on Page 2 and have groups of learners act as particles in a solid, a liquid, and a gas.'],
      after: ['Place one ice cube in the sun and one in the shade; time each as it melts and explain the difference.'],
      discussion: ['Shea butter, toothpaste, and gari soaked in water: is each a solid or a liquid? Why are some materials hard to classify?'],
      reflection: ['What signs of a changing climate have older people in your community noticed?'],
      maths: [
        {
          task: 'It takes about 334 joules of heat to melt 1 gram of ice at 0 °C. How much heat is needed to melt a 500 g block?',
          answer: '500 × 334 = 167,000 J.',
        },
        {
          task: 'Rock melts at about 1,000 °C and water boils at 100 °C. How many times greater is the melting temperature of rock, in degrees Celsius?',
          answer: '1,000 ÷ 100 = 10 times.',
        },
      ],
      support: ['Give a diagram of the changes of state with the arrows drawn and the names left blank for learners to fill in.'],
      stretch: ['Find out why a pressure cooker cooks food faster, and why water boils below 100 °C on a very high mountain.'],
      localise: ['Use local examples of changes of state: drying clothes, palm oil that hardens in cool weather, morning dew, and Harmattan dryness.'],
      factCheck: [
        {
          claim: 'Pure water melts at 0 °C and boils at 100 °C at standard pressure; the latent heat of fusion of ice is about 334 J/g; the April 2010 Eyjafjallajökull eruption in Iceland disrupted European air travel.',
          explanation: 'Post-glacial decompression melting in Iceland (~12,000 years ago) is well established in geology, while modern glacier retreat effects on volcanic activity remain under active study.',
          reference: 'Smithsonian Institution Global Volcanism Program; Jull & McKenzie (1996), Journal of Geophysical Research.',
        },
      ],
    },
  }),

  // 7
  mk({
    key: 'comets-friend-or-foe',
    title: 'Comets, Friend or Foe?',
    summary:
      'Comets were once feared as warnings of disaster. This article explains what they are, how their speed changes as they orbit the Sun, what happens when objects from space strike the Earth, and why Ghana has its own famous crater.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['science', 'educational'],
    themes: ['technology', 'community'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Calm, clear, and full of wonder',
    palette: ['#1e1b4b', '#fbbf24'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Soft night-sky pads with a slow rising melody (placeholder)',
    pages: [
      pg(
        '☄️',
        'Now and then, a strange light appears in the evening sky: a fuzzy star with a long, pale tail. It is a comet. In October 2024, one was bright enough to see without a telescope. A comet is a lump of ice, dust, and rock a few kilometres across, left over from the time the planets formed. Most comets stay in the cold outer Solar System. When one comes close to the Sun, its ice turns to gas. The gas and dust stream out into a tail millions of kilometres long, which always points away from the Sun.',
        'A comet with a long pale tail low in the evening sky above the silhouettes of palm trees and rooftops.'
      ),
      pg(
        '📜',
        'For most of history, comets frightened people. They appeared without warning and seemed to announce wars or the deaths of kings. Then scientists began to measure them. Around 1700, the English astronomer Edmond Halley noticed that bright comets seen in 1531, 1607, and 1682 had followed the same path. He decided they were one comet returning about every 76 years, and he predicted it would come back in 1758. It did, after his death. Halley’s Comet was last seen in 1986 and will return in 2061. Once people understood gravity, comets became predictable.',
        'An astronomer of the 1700s at a desk with a telescope and star charts, tracing a long curved path across a map of the sky.'
      ),
      pg(
        '🔄',
        'Earth’s orbit is almost a circle, so its speed hardly changes. A comet’s orbit is a long, stretched oval called an ellipse. Far from the Sun, the comet moves slowly. As the Sun’s gravity pulls it inward, it speeds up, just as a mango falling from a tree speeds up. Its gravitational potential energy is changing into kinetic energy. It whips round the Sun at its fastest. Then, as it climbs away, it slows down, like a ball thrown upward. Kinetic energy is changing back into potential energy. The total energy stays the same throughout.',
        'A diagram of the Sun with Earth’s nearly circular orbit and a comet’s long elliptical orbit, the comet marked fast near the Sun and slow far away.'
      ),
      pg(
        '🦕',
        'Comets and asteroids sometimes cross the Earth’s path. Small pieces burn up in the air as shooting stars. A large one is a different matter. About 66 million years ago, an asteroid about 10 kilometres wide struck what is now Mexico. Its enormous kinetic energy was changed into heat, light, sound, and shock waves in seconds. Dust and smoke darkened the sky for years, plants died, and most kinds of dinosaur disappeared. Yet space objects may also have helped life. Many scientists think that asteroids and comets delivered some of the water in Earth’s oceans.',
        'A large glowing asteroid streaking through the sky above an ancient landscape with dinosaurs looking up.'
      ),
      pg(
        '🏞️',
        'Ghana has its own scar from space. About one million years ago, a large meteorite struck the forest 30 kilometres south-east of where Kumasi now stands. It blasted out a crater about 10 kilometres across. Rain slowly filled it, forming Lake Bosumtwi, the only natural lake in Ghana. The impact melted rock and flung glassy droplets as far as Côte d’Ivoire, where they are still found today. For years people wondered whether the lake was an old volcano. Studies of the rocks proved that it is an impact crater, one of the best preserved in the world.',
        'An aerial view of the round Lake Bosumtwi surrounded by a ring of forested hills.'
      ),
      pg(
        '🛡️',
        'Could a large impact happen again? It is possible, but very unlikely in our lifetimes. Astronomers now search the sky every night and track thousands of asteroids and comets whose paths come near Earth. None of the large ones they have found is expected to hit us in the next hundred years. We have even begun to practise defending ourselves. In 2022, a spacecraft called DART was deliberately crashed into a small asteroid. The collision changed the asteroid’s orbit slightly. For the first time, people had changed the path of an object in space.',
        'A small box-shaped spacecraft with two long solar panels approaching a grey, boulder-covered asteroid in space.'
      ),
    ],
    activities: [
      {
        id: 'cf-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Why does a comet grow a tail when it comes near the Sun?',
        options: [
          'It catches fire in the Earth’s atmosphere',
          'The Sun’s heat turns its ice into gas, which streams away with dust',
          'It collides with other comets',
        ],
        correctIndex: 1,
      },
      {
        id: 'cf-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Where in its orbit does a comet move fastest?',
        options: [
          'When it is farthest from the Sun',
          'When it is closest to the Sun',
          'Its speed never changes',
        ],
        correctIndex: 1,
      },
      {
        id: 'cf-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'How was Lake Bosumtwi formed?',
        options: [
          'By a volcano that erupted and then collapsed',
          'By a dam built across a river',
          'By a meteorite that struck the Earth and left a crater',
        ],
        correctIndex: 2,
      },
      {
        id: 'cf-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A child on a swing is highest at each end and fastest at the bottom. Which statement matches the comet’s orbit?',
        options: [
          'The ends of the swing are like the comet close to the Sun',
          'The bottom of the swing, where speed is greatest, is like being near the Sun',
          'The swing has no potential energy at any point',
        ],
        correctIndex: 1,
      },
      {
        id: 'cf-s1',
        type: 'sequencing',
        prompt: 'Arrange from earliest to most recent.',
        items: [
          'An asteroid strikes Mexico and most dinosaurs die out (66 million years ago)',
          'A meteorite forms the Bosumtwi crater (about 1 million years ago)',
          'Halley’s predicted comet returns (1758)',
          'Halley’s Comet is last seen from Earth (1986)',
          'The DART spacecraft changes an asteroid’s orbit (2022)',
        ],
      },
      {
        id: 'cf-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'ellipse',
        definition: 'A stretched oval shape, like the orbit of a comet.',
        distractors: [
          'A perfect circle',
          'The tail of a comet',
        ],
      },
    ],
    glossary: [
      {
        word: 'comet',
        definition: 'A lump of ice, dust, and rock that grows a tail when it comes near the Sun.',
        pages: [1, 2],
      },
      {
        word: 'gravity',
        definition: 'The force that pulls objects towards each other.',
        pages: [2, 3],
      },
      {
        word: 'ellipse',
        definition: 'A stretched oval shape.',
        pages: [3],
      },
      {
        word: 'kinetic',
        definition: 'Kinetic energy: the energy an object has because it is moving.',
        pages: [3, 4],
      },
      {
        word: 'asteroid',
        definition: 'A rocky object, smaller than a planet, that orbits the Sun.',
        pages: [4, 6],
      },
      {
        word: 'crater',
        definition: 'A bowl-shaped hollow made by an impact or an explosion.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'BECE link: the Solar System; potential and kinetic energy; energy transformation; gravity.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Lake Bosumtwi (also spelled Bosomtwe) is sacred to the Asante. The scientific account of its origin can be taught respectfully alongside its cultural importance.',
      'Reassurance: Page 6 makes clear that no large known object is expected to strike Earth in the next hundred years.',
    ],
    reviewQuestions: [
      'Confirm the Bosumtwi figures: crater about 10.5 km across, about 1.07 million years old, about 30 km south-east of Kumasi.',
      'Check that the article does not frighten learners: the risk of a large impact is described as very unlikely.',
    ],
    guide: {
      overview:
        'Explains what comets are, how Halley made them predictable, how a comet’s speed changes as potential and kinetic energy are exchanged in an elliptical orbit, what large impacts have done, and how Lake Bosumtwi was formed.',
      lessonMinutes: 45,
      goals: [
        'Describe what a comet is and why it grows a tail near the Sun.',
        'Explain the changes between gravitational potential energy and kinetic energy in an elliptical orbit.',
        'Describe the effects of a large impact and the origin of Lake Bosumtwi.',
        'Explain how astronomers track and may deflect objects that come near Earth.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: the Solar System; energy transformation; gravity)', 'Comets and asteroids, potential and kinetic energy, and impact craters'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates)', 'Subtraction with dates and simple fractions'],
      ],
      before: ['Ask: What have you heard people say when a strange light appears in the sky? Is there a way to test such beliefs?'],
      during: ['Pause on Page 3 and swing a ball on a string as a pendulum: where is it fastest, and where is it highest?'],
      after: ['Draw a comet’s elliptical orbit round the Sun and label where its kinetic energy and its potential energy are greatest.'],
      discussion: ['Before Halley, comets were feared as omens. What changed people’s minds?'],
      reflection: ['Has anyone in the class visited Lake Bosumtwi? What stories are told about how it was formed?'],
      maths: [
        {
          task: 'Halley’s Comet returns about every 76 years and was last seen in 1986. How old will a learner born in 2013 be when it returns in 2061?',
          answer: '2061 − 2013 = 48 years old.',
        },
        {
          task: 'The Bosumtwi crater is about 10 km across and the lake is about 8 km across. What fraction of the crater’s width does the lake fill?',
          answer: '8 ÷ 10 = four-fifths.',
        },
        {
          task: 'A mango falls from a tree. Describe the energy change, and say where its kinetic energy is greatest.',
          answer: 'Gravitational potential energy changes into kinetic energy; it is greatest just before the mango hits the ground.',
        },
      ],
      support: ['Give a diagram of an elliptical orbit with four marked points; learners label each “fast” or “slow”.'],
      stretch: ['Find out what tektites are and why those found in Côte d’Ivoire are linked to the Bosumtwi impact.'],
      localise: ['Collect local stories and beliefs about Lake Bosumtwi and about comets, and discuss how science and tradition each explain them.'],
      factCheck: [
        {
          claim: 'Lake Bosumtwi occupies a meteorite impact crater about 10.5 km across and 1.07 million years old, 30 km south-east of Kumasi; NASA’s DART mission altered Dimorphos’s orbit in 2022.',
          explanation: 'Lake Bosumtwi crater dimensions (~10.5 km diameter, ~1.07 Myr age, Ivory Coast tektite strewn field) and Halley/DART dates verified.',
          reference: 'Koeberl et al., Meteoritics & Planetary Science (2007); NASA DART Mission (2022).',
        },
      ],
    },
  }),

  // 8
  mk({
    key: 'power-from-the-atom',
    title: 'Power from the Atom: Is Thorium the Answer?',
    summary:
      'Ghana needs more electricity every year. This article explains how nuclear power stations work, what makes the metal thorium interesting as a fuel, and why no source of energy is perfect.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['science', 'educational'],
    themes: ['technology', 'community'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Balanced, clear, and thoughtful',
    palette: ['#4d7c0f', '#7c3aed'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Thoughtful, even-paced guitar over a low hum (placeholder)',
    pages: [
      pg(
        '💡',
        'The lights go off, and the whole street groans. A few minutes later they come back, and nobody asks where the electricity came from. In Ghana, much of it comes from falling water at the Akosombo, Kpong, and Bui dams. Much of the rest comes from thermal power stations that burn natural gas or oil, and a growing share comes from solar panels. Water and sunlight are renewable sources of energy: nature replaces them. Gas and oil are non-renewable: once burnt, they are gone, and burning them releases carbon dioxide, which warms the planet.',
        'A Ghanaian street at dusk with lights coming on, and three small inset pictures of a dam, a gas power station, and a field of solar panels.'
      ),
      pg(
        '⚛️',
        'There is another source of energy, inside the atom itself. Every atom has a tiny centre called a nucleus. The nuclei of a few heavy elements, such as uranium, can be split in two. This is nuclear fission. Each split releases heat and sets off more splits, in a chain reaction. A nuclear power station controls this reaction inside a reactor. The heat boils water into steam, the steam spins a turbine, and the turbine drives a generator. The fuel is astonishingly concentrated. A pellet of uranium fuel the size of a fingertip releases about as much energy as a tonne of coal.',
        'A simple flow diagram of a nuclear power station: reactor heating water, steam turning a turbine, the turbine driving a generator, and power lines leaving.'
      ),
      pg(
        '☢️',
        'A nuclear power station releases almost no carbon dioxide while it runs, and it works day and night, in any weather. But it has serious costs. The used fuel is radioactive. It gives out harmful radiation and must be stored safely for thousands of years. Accidents are rare, but when cooling fails, a reactor can overheat and melt. That happened at Chernobyl in 1986 and at Fukushima in 2011, and large areas had to be abandoned. Nuclear stations are also very expensive and slow to build, and uranium, like oil, is non-renewable.',
        'Thick sealed steel-and-concrete storage containers in a guarded yard, marked with the radiation warning symbol.'
      ),
      pg(
        '🧂',
        'Thorium is a silvery, slightly radioactive metal, about three times as common in the Earth’s crust as uranium. On its own it cannot keep a chain reaction going. But inside a reactor it can absorb particles called neutrons and slowly change into a kind of uranium that can. One design dissolves the fuel in hot liquid salt instead of using solid rods. Because the salt is not under high pressure, the reactor cannot burst like an overheated boiler. If it gets too hot, the salt can be drained into a tank, where it cools and hardens. American scientists ran a small reactor of this kind in the 1960s.',
        'A cutaway diagram of a reactor vessel containing glowing liquid salt, with a drain pipe leading down to a safety tank below.'
      ),
      pg(
        '🧪',
        'The idea was set aside for fifty years. Then China built a small experimental thorium reactor in the Gobi Desert. It started up in 2023, and in November 2025 its scientists announced that it had turned thorium into uranium fuel while running, the first time this had been done in a reactor of this kind. But it is tiny. It produces about 2 megawatts of heat, hundreds of times less than Akosombo’s output. Hot salt corrodes metal pipes. The reactor still produces radioactive waste, though less of the longest-lasting kind. Thorium is promising, but it is not yet a proven way to light a city.',
        'A low industrial research building in a dry desert landscape, with scientists in white coats at a control desk shown in an inset.'
      ),
      pg(
        '⚖️',
        'Ghana already has experience with atoms. A small research reactor has operated at Kwabenya, near Accra, since 1994. It is used for research and training, not for electricity. The country is now planning its first nuclear power station, with Nsuban in the Western Region as the preferred site. Is that wise? Scientists do not ask whether an energy source is perfect, because none is. They compare. How much does it cost? Is it safe? What waste does it leave? Does it work at night and in the dry season? Does it warm the climate? Good decisions come from honest comparisons.',
        'A comparison chart with four columns headed hydro, gas, solar, and nuclear, and rows for cost, reliability, waste, and effect on climate.'
      ),
    ],
    activities: [
      {
        id: 'pa-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Which of these is a renewable source of energy?',
        options: [
          'Natural gas',
          'Crude oil',
          'Falling water at a dam',
        ],
        correctIndex: 2,
      },
      {
        id: 'pa-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'What is nuclear fission?',
        options: [
          'The splitting of a heavy nucleus, which releases heat',
          'The burning of uranium in air',
          'The melting of metal in a furnace',
        ],
        correctIndex: 0,
      },
      {
        id: 'pa-c3',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why must used nuclear fuel be stored with great care?',
        options: [
          'It is very cold',
          'It is radioactive and stays harmful for thousands of years',
          'It can be burnt again like charcoal',
        ],
        correctIndex: 1,
      },
      {
        id: 'pa-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A district must choose between a solar farm and a gas power station. Which question is the most scientific one to ask first?',
        options: [
          'Which one is perfect?',
          'Which one do other countries prefer?',
          'How do they compare in cost, reliability, safety, waste, and climate?',
        ],
        correctIndex: 2,
      },
      {
        id: 'pa-s1',
        type: 'sequencing',
        prompt: 'Arrange the energy changes in a nuclear power station.',
        items: [
          'Nuclei split in the reactor and release heat.',
          'The heat boils water into steam.',
          'The steam spins a turbine.',
          'The turbine drives a generator.',
          'The generator produces electricity for homes and factories.',
        ],
      },
      {
        id: 'pa-voc',
        type: 'vocabulary',
        afterPage: 1,
        word: 'non-renewable',
        definition: 'Describing an energy source that is used up and not replaced by nature in a human lifetime.',
        distractors: [
          'Describing an energy source that never runs out',
          'Describing any energy source that produces no smoke',
        ],
      },
    ],
    glossary: [
      {
        word: 'renewable',
        definition: 'Describing an energy source that nature replaces, such as sunlight or falling water.',
        pages: [1],
      },
      {
        word: 'non-renewable',
        definition: 'Describing an energy source that is used up, such as gas, oil, or uranium.',
        pages: [1, 3],
      },
      {
        word: 'nucleus',
        definition: 'The tiny centre of an atom.',
        pages: [2],
      },
      {
        word: 'fission',
        definition: 'Nuclear fission: the splitting of a heavy nucleus, releasing heat.',
        pages: [2],
      },
      {
        word: 'reaction',
        definition: 'Chain reaction: a reaction in which each step sets off the next.',
        pages: [2, 4],
      },
      {
        word: 'radioactive',
        definition: 'Giving out harmful radiation.',
        pages: [3, 4, 5],
      },
      {
        word: 'reactor',
        definition: 'The part of a nuclear power station where the chain reaction is controlled.',
        pages: [2, 3, 4, 5, 6],
      },
    ],
    culturalNotes: [
      'BECE link: sources of energy; renewable and non-renewable energy; energy transformation; generating electricity.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Balance: the article gives both the benefits and the costs of nuclear power and takes no position on whether Ghana should build a nuclear power station. Teachers should keep the discussion evidence-based.',
      'Ghana’s nuclear plans change from year to year; check the current position before teaching Page 6.',
    ],
    reviewQuestions: [
      'Confirm that the article presents nuclear power even-handedly, with benefits and costs, and makes no claim that any design is perfectly safe.',
      'Check the current status of Ghana’s nuclear power plans and of the Chinese experimental reactor before publication.',
    ],
    guide: {
      overview:
        'Sets out Ghana’s sources of electricity, explains nuclear fission and how a nuclear power station works, weighs its benefits and costs, introduces thorium and molten-salt reactors as an unfinished experiment, and models how to compare energy sources fairly.',
      lessonMinutes: 45,
      goals: [
        'Classify energy sources as renewable or non-renewable.',
        'Describe nuclear fission and the energy changes in a nuclear power station.',
        'State two advantages and two disadvantages of nuclear power.',
        'Compare energy sources using cost, reliability, safety, waste, and effect on the climate.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: energy: sources of energy and generating electricity)', 'Renewable and non-renewable sources, energy transformation, and nuclear energy'],
        ['Social Studies (NaCCA CCP: energy and national development)', 'Energy choices and their effects on communities'],
      ],
      before: ['Ask: Where does the electricity in this community come from? List every source learners can name.'],
      during: ['Pause on Page 3 and build a two-column list on the board: advantages and disadvantages of nuclear power.'],
      after: ['In groups, complete a table comparing hydro, gas, solar, and nuclear power under the headings cost, reliability, waste, and effect on climate.'],
      discussion: ['No energy source is perfect. Which two would you combine for Ghana, and why?'],
      reflection: ['What could your household do to use less electricity?'],
      maths: [
        {
          task: 'The experimental reactor produces 2 MW of heat. Akosombo can supply 1,020 MW of electricity. How many times greater is Akosombo’s output?',
          answer: '1,020 ÷ 2 = 510 times.',
        },
        {
          task: 'One fuel pellet gives about as much energy as 1 tonne of coal. How many tonnes of coal would 2,500 pellets replace?',
          answer: '2,500 tonnes.',
        },
      ],
      support: ['Provide picture cards of energy sources for learners to sort into renewable and non-renewable.'],
      stretch: ['Hold a class debate: “Ghana should build a nuclear power station.” Each side must use at least three facts from the article.'],
      localise: ['Find out which power station, dam, or solar farm is nearest to your school and what it supplies.'],
      factCheck: [
        {
          claim: 'Ghana’s GHARR-1 research reactor at Kwabenya has operated since 1994; China’s 2 MWt TMSR-LF1 experimental thorium molten-salt reactor in the Gobi Desert started up in 2023 and reported thorium-to-uranium fuel conversion in November 2025.',
          explanation: 'Checked China’s experimental reactor (2 MWt, criticality October 2023, breeding announcement November 2025), Ghana Atomic Energy Commission’s GHARR-1 research reactor (1994), and Nuclear Power Ghana’s preferred site at Nsuban (Western Region).',
          reference: 'Ghana Atomic Energy Commission (GAEC); Chinese Academy of Sciences SINAP TMSR-LF1 reports.',
        },
      ],
    },
  }),
];

