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
 * Batch 39 (5 stand-alone science articles): "We Are Here" space series for JHS (Basic 7 to Basic 9).
 * These are science articles, not stories: there are no characters, so `characters` is empty and one narrator reads throughout.
 * Original text written for Ghanaian learners; facts updated to November 2026.
 * Teacher-guide fact checks are structured { claim, explanation, reference } objects.
 */

export const BATCH_39_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'how-far-is-far-measuring-space',
    title: 'How Far Is Far? Measuring Space',
    summary:
      'Kilometres are too small for space. This article explains the two units astronomers use, the astronomical unit and the light-year, and uses them to work out our address in the universe.',
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
    paceWord: 'Calm, clear, and curious',
    palette: ['#1e3a8a', '#f59e0b'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Soft, spacious marimba and synth pads suggesting distance and wonder (placeholder)',
    pages: [
      pg(
        '🚐',
        'The lights go out across the neighbourhood, and suddenly the sky is full of stars. How far away are they? Accra to Tamale is about 600 kilometres by road. A kilometre is a good unit for that journey. It is a poor unit for space. The Sun is about 150 million kilometres from Earth. Imagine a trotro that could drive there at a steady 100 kilometres an hour, with no stops for passengers. The trip would take about 171 years. And the Sun is our nearest star. For everything farther away, the numbers in kilometres become too long to read. Astronomers needed bigger units. They use two: the astronomical unit and the light-year.',
        'A trotro on a long empty road at dusk beneath a huge glowing Sun low on the horizon.'
      ),
      pg(
        '📏',
        'An astronomical unit, or AU, is the average distance between Earth and the Sun: about 150 million kilometres. So Earth is 1 AU from the Sun. This makes distances inside the Solar System easy to compare. Mercury, the closest planet, is about 0.4 AU from the Sun. Mars is about 1.5 AU. Jupiter is about 5 AU. Neptune, the farthest planet, is about 30 AU. You can see at once that Neptune is thirty times as far from the Sun as we are. Try saying that in kilometres: 4,500,000,000.',
        'A simple diagram of the Sun on the left with Mercury, Earth, Mars, Jupiter, and Neptune spaced along a ruler marked 0.4, 1, 1.5, 5, and 30 AU.'
      ),
      pg(
        '💡',
        'Nothing travels faster than light. The speed of light in empty space is about 300,000 kilometres every second. That is fast enough to circle Earth more than seven times in one second. Even so, space is so large that light needs time to cross it. Sunlight takes about 8 minutes and 20 seconds to reach us. When you watch the Sun set over the sea at Cape Coast, you are seeing light that left the Sun more than eight minutes earlier. Light from Neptune takes about four hours to arrive.',
        'Sunset over the sea at Cape Coast with a faint dotted beam of light running from the Sun to the shore, labelled 8 minutes 20 seconds.'
      ),
      pg(
        '✨',
        'A light-year is the distance light travels in one year. It is a unit of distance, not of time. One light-year is about 9.5 trillion kilometres (9.5 million million), or about 63,000 AU. Astronomers use light-years for the distances between stars. The nearest star to the Sun is a small red star called Proxima Centauri. It is about 4.2 light-years away. Its two bright neighbours, Alpha Centauri A and B, are about 4.4 light-years away. The light you see from them tonight began its journey more than four years ago. Looking far into space always means looking back in time.',
        'The night sky with the Sun as a small yellow dot linked by a dotted line to a small red star labelled Proxima Centauri, 4.2 light-years, beside a bright pair labelled Alpha Centauri A and B.'
      ),
      pg(
        '🏠',
        'With these units we can write our full address. We live on Earth, a planet in the Solar System. The Sun is one of at least 100 billion stars in a galaxy called the Milky Way, which is about 100,000 light-years across. The Milky Way belongs to a small cluster of galaxies called the Local Group. And the Local Group is one tiny part of the observable universe, which holds hundreds of billions of galaxies. Some estimates go as high as two trillion. Earth, Solar System, Milky Way, Local Group, universe: that is where we are.',
        'Five nested frames zooming outward: Earth, the Solar System, the spiral Milky Way, a cluster of galaxies labelled Local Group, and a field of countless galaxies.'
      ),
      pg(
        '⚽',
        'To feel these distances, shrink them. Let 1 metre stand for 1 AU. Put the Sun on the goal line of a football pitch. Earth is one step away. Jupiter is about 5 metres out. Neptune is 30 metres out, still short of the halfway line. Voyager 1, the most distant spacecraft ever launched, would be about 173 metres away, well beyond the far goal. And the nearest star? On this scale it is about 270 kilometres away. If your Sun is in Accra, the next star is beyond Kumasi. Between them lies almost nothing at all.',
        'A football pitch seen from above with a yellow ball on one goal line as the Sun and small markers at 1 m, 5 m, and 30 m labelled Earth, Jupiter, and Neptune.'
      ),
    ],
    activities: [
      {
        id: 'hf-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Jupiter is about 5 AU from the Sun. What does that tell you?',
        options: [
          'Jupiter is 5 million kilometres from the Sun',
          'Jupiter is about five times as far from the Sun as Earth is',
          'Light takes five years to reach Jupiter',
        ],
        correctIndex: 1,
      },
      {
        id: 'hf-c2',
        type: 'comprehension',
        afterPage: 4,
        question: 'What does a light-year measure?',
        options: [
          'The time sunlight takes to reach Earth',
          'The distance light travels in one year',
          'How bright a star is',
        ],
        correctIndex: 1,
      },
      {
        id: 'hf-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'A star is 10 light-years away. When did the light you see tonight leave it?',
        options: [
          'Tonight',
          'About 10 years ago',
          'About 10 million years ago',
        ],
        correctIndex: 1,
      },
      {
        id: 'hf-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: On the scale 1 metre = 1 AU, Saturn is about 9.5 AU from the Sun. Where should you place it?',
        options: [
          'About 9.5 metres from the Sun',
          'About 95 metres from the Sun',
          'About 9.5 kilometres from the Sun',
        ],
        correctIndex: 0,
      },
      {
        id: 'hf-s1',
        type: 'sequencing',
        prompt: 'Arrange from smallest to largest.',
        items: [
          'Earth',
          'The Solar System',
          'The Milky Way',
          'The Local Group',
          'The observable universe',
        ],
      },
      {
        id: 'hf-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'astronomical unit',
        definition: 'The average distance between Earth and the Sun, about 150 million kilometres.',
        distractors: [
          'The distance light travels in one year',
          'A tool for measuring the brightness of stars',
        ],
      },
    ],
    glossary: [
      {
        word: 'AU',
        definition: 'Short for astronomical unit: the average Earth to Sun distance, about 150 million km.',
        pages: [2],
      },
      {
        word: 'light-year',
        definition: 'The distance light travels in one year, about 9.5 trillion km.',
        pages: [1, 4],
      },
      {
        word: 'galaxy',
        definition: 'A huge collection of stars, gas, and dust held together by gravity.',
        pages: [5],
      },
      {
        word: 'universe',
        definition: 'Everything that exists; the observable part is what light has had time to reach us.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Original article written for Ghanaian JHS learners. It covers the same topic as a published book but copies none of its text, comparisons, or activities.',
      'Road distances are approximate: Accra to Tamale about 600 km; Accra to Kumasi about 250 km.',
    ],
    reviewQuestions: [
      'Confirm the trotro calculation: 150,000,000 km ÷ 100 km/h = 1,500,000 hours, about 171 years.',
      'Confirm that the Voyager 1 distance on Page 6 is still current (it grows by about 3.5 AU a year).',
    ],
    guide: {
      overview:
        'Introduces the two distance units of astronomy, the astronomical unit and the light-year, through Ghanaian reference points, and uses them to place Earth in the Solar System, the Milky Way, the Local Group, and the observable universe.',
      lessonMinutes: 45,
      goals: [
        'Define the astronomical unit and the light-year and state which distances each is used for.',
        'Explain why light from distant objects shows them as they were in the past.',
        'State Earth’s position in the Solar System, the Milky Way, the Local Group, and the universe.',
        'Use ratio to build a scale model of distances in the Solar System.',
      ],
      subjects: [
        ['Science (NaCCA CCP Integrated Science, Strand 3 Systems: The Solar System)', 'Units of distance in space and Earth’s place in the universe'],
        ['Mathematics (NaCCA CCP Mathematics: number, ratio, and rates)', 'Scale models, large numbers, and time-distance calculations'],
      ],
      before: ['Ask: How long would it take to drive from your town to Accra? Then ask how anyone could measure the distance to the Sun.'],
      during: ['Pause on Page 4 and ask: Is a light-year a time or a distance? Have learners explain in their own words.'],
      after: ['Pace out the Page 6 model on the school field with markers for the Sun, Earth (1 m), Mars (1.5 m), Jupiter (5 m), Saturn (9.5 m), and Neptune (30 m).'],
      discussion: ['Why do scientists invent new units instead of using kilometres for everything?'],
      reflection: ['How does knowing the size of the universe change the way you think about Earth?'],
      maths: [
        {
          task: 'Neptune is 30 AU from the Sun, and 1 AU is 150 million km. How far is Neptune in kilometres?',
          answer: '30 × 150 million = 4,500 million km, or 4.5 billion km.',
        },
        {
          task: 'Sunlight takes about 500 seconds to travel 1 AU. How long does it take to reach Jupiter, 5.2 AU away?',
          answer: '5.2 × 500 = 2,600 seconds, about 43 minutes.',
        },
        {
          task: 'A trotro travels at 100 km/h without stopping. How many years would it take to cover 150 million km? (One year is about 8,760 hours.)',
          answer: '150,000,000 ÷ 100 = 1,500,000 hours; 1,500,000 ÷ 8,760 is about 171 years.',
        },
      ],
      support: ['Give learners a table of planet distances in AU so they can place the markers without calculating.'],
      stretch: ['One light-year is about 63,000 AU. On the scale 1 metre = 1 AU, how many kilometres away is a star 10 light-years from the Sun? (About 630 km.)'],
      localise: ['Replace Accra, Kumasi, Tamale, and Cape Coast with towns your learners know, keeping the distances roughly the same.'],
      factCheck: [
        {
          claim: 'One astronomical unit is about 150 million km; one light-year is about 9.5 trillion km (about 63,000 AU); light travels about 300,000 km per second.',
          explanation: 'One AU is 149.6 million km. Light covers about 9.46 trillion km in a year. Sunlight takes 8 minutes 20 seconds to reach Earth. At 100 km/h, 150 million km takes about 171 years.',
          reference: 'International Astronomical Union definition of the astronomical unit (2012); NASA Solar System Exploration.',
        },
        {
          claim: 'Voyager 1 is about 173 AU from the Sun (one light-day) in November 2026.',
          explanation: 'NASA calculated that Voyager 1 would reach one light-day from Earth (about 25.9 billion km) on 18 November 2026. It moves away by about 3.5 AU a year, so update the figure yearly.',
          reference: 'NASA Jet Propulsion Laboratory, Voyager mission status.',
        },
      ],
    },
  }),

  // 2
  mk({
    key: 'the-sun-and-its-family',
    title: 'The Sun and Its Family',
    summary:
      'The Sun is an ordinary star, yet its gravity rules everything around it. This article explains what the Sun is, how gravity keeps eight planets in orbit, and why Pluto is no longer counted among them.',
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
    paceWord: 'Warm, clear, and steady',
    palette: ['#ea580c', '#1e293b'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Warm, slow kalimba and soft strings suggesting sunrise (placeholder)',
    pages: [
      pg(
        '☀️',
        'By noon, the zinc roof is too hot to touch and the shadows have almost disappeared. The cause is 150 million kilometres away. The Sun is a star. It looks different from the other stars only because it is so close. It is a huge ball of hot, glowing gas, mostly hydrogen and helium. About 1.3 million Earths would fit inside it, and it holds 99.8 per cent of all the mass in the Solar System. Its surface is about 5,500 °C. Its centre is far hotter, about 15 million °C. There, hydrogen nuclei are squeezed together to make helium. This process is called nuclear fusion. It releases the energy that reaches us as light and heat. Never look straight at the Sun. It can damage your eyes in seconds.',
        'A cutaway view of the Sun showing its glowing surface and very bright core, with a tiny blue Earth beside it for scale.'
      ),
      pg(
        '🌟',
        'Astronomers classify stars by temperature, colour, and brightness. The hottest stars shine blue-white. Cooler stars shine orange or red. The Sun is in between. Its class is written G2V, and stars of this kind are often called yellow dwarfs. The Sun is about 4.6 billion years old, roughly halfway through its life. Is it a big star? That depends on what you compare it with. Most stars in our galaxy are red dwarfs, which are smaller and dimmer than the Sun. But giant stars exist too. The red supergiant Betelgeuse is hundreds of times wider than the Sun.',
        'A row of stars compared by size and colour: a small red dwarf, the yellow Sun, a blue-white star, and the curved edge of an enormous red supergiant.'
      ),
      pg(
        '🧲',
        'Gravity is a force that pulls objects towards each other. The more mass an object has, the stronger its pull. Because the Sun is so massive, its gravity controls everything around it. Each planet is moving sideways at great speed. Earth travels about 30 kilometres every second. Without the Sun’s gravity, a planet would fly off in a straight line. With it, the planet’s path bends into a curve around the Sun. That curved path is called an orbit. To revolve is to travel once around an orbit. Earth takes one year to revolve around the Sun.',
        'Earth on its curved orbit around the Sun, with one arrow pointing along its direction of travel and another arrow pointing towards the Sun labelled gravity.'
      ),
      pg(
        '🪐',
        'Eight planets orbit the Sun. The four nearest are small and rocky: Mercury, Venus, Earth, and Mars. Beyond Mars lies the asteroid belt, a ring of rocky bodies. Then come two gas giants, Jupiter and Saturn, and two ice giants, Uranus and Neptune. To remember the order, try this sentence: My Very Energetic Mother Just Sold Us Nkatie. Most planets have moons. A moon is a natural satellite: an object that orbits a planet. Earth has one. Saturn has the most. In 2025, astronomers confirmed 128 more, bringing its total to 274.',
        'The eight planets in order from the Sun, each labelled: four small rocky planets, the asteroid belt, two gas giants, and two ice giants.'
      ),
      pg(
        '❄️',
        'Pluto was discovered in 1930 and was called the ninth planet for 76 years. Then astronomers began finding other icy worlds beyond Neptune. One of them, Eris, has even more mass than Pluto. Was Eris a tenth planet? In 2006, the International Astronomical Union agreed on a definition. A planet must orbit the Sun. It must be massive enough for its own gravity to pull it into a round shape. And it must have cleared other objects out of its orbit. Pluto passes the first two tests but fails the third. It was reclassified as a dwarf planet.',
        'Small, round, pale-brown Pluto with its heart-shaped plain, surrounded by many faint icy objects sharing the same region of space.'
      ),
      pg(
        '🛰️',
        'We are still learning about our star. In 2018, NASA launched the Parker Solar Probe to study the Sun from close up. On 24 December 2024, it flew through the Sun’s outer atmosphere, only about 6 million kilometres above the surface. No spacecraft has ever been closer. At that moment it was moving at about 690,000 kilometres an hour, faster than any other object people have built. Its measurements help scientists understand the solar wind, a stream of charged particles that the Sun blows out in all directions. The solar wind matters on Earth. Strong bursts can disturb satellites, radio signals, and power lines.',
        'A small spacecraft with a white heat shield flying through the glowing outer atmosphere of the Sun, with streams of particles flowing outward.'
      ),
    ],
    activities: [
      {
        id: 'sf-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Where does the Sun’s energy come from?',
        options: [
          'Coal and gas burning inside it',
          'Nuclear fusion, in which hydrogen nuclei join to make helium',
          'Light reflected from the planets',
        ],
        correctIndex: 1,
      },
      {
        id: 'sf-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why does Earth not fly off into space in a straight line?',
        options: [
          'The Sun’s gravity bends Earth’s path into an orbit',
          'Earth is not moving',
          'The Moon pushes Earth towards the Sun',
        ],
        correctIndex: 0,
      },
      {
        id: 'sf-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'Why is Pluto classified as a dwarf planet?',
        options: [
          'It does not orbit the Sun',
          'It is not round',
          'It has not cleared other objects out of its orbit',
        ],
        correctIndex: 2,
      },
      {
        id: 'sf-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Astronomers find a round, icy object orbiting the Sun in a zone crowded with similar objects. How should it be classified?',
        options: [
          'As a planet',
          'As a dwarf planet',
          'As a moon',
        ],
        correctIndex: 1,
      },
      {
        id: 'sf-s1',
        type: 'sequencing',
        prompt: 'Arrange from nearest the Sun to farthest.',
        items: [
          'Venus',
          'Earth',
          'The asteroid belt',
          'Saturn',
          'Neptune',
        ],
      },
      {
        id: 'sf-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'orbit',
        definition: 'The curved path one object follows around another because of gravity.',
        distractors: [
          'The spinning of a planet on its own axis',
          'The outer atmosphere of the Sun',
        ],
      },
    ],
    glossary: [
      {
        word: 'fusion',
        definition: 'Nuclear fusion: light nuclei, such as hydrogen, join to form heavier ones and release energy.',
        pages: [1],
      },
      {
        word: 'gravity',
        definition: 'A force that pulls objects towards each other; more mass means a stronger pull.',
        pages: [3, 5],
      },
      {
        word: 'orbit',
        definition: 'The curved path of one object around another.',
        pages: [3, 4, 5],
      },
      {
        word: 'satellite',
        definition: 'An object that orbits a planet; a moon is a natural satellite.',
        pages: [4],
      },
    ],
    culturalNotes: [
      'Original article written for Ghanaian JHS learners. It covers the same topic as a published book but copies none of its text, comparisons, or activities.',
      'Safety: remind learners never to look directly at the Sun, even during an eclipse, without certified eclipse glasses.',
      'Nkatie is the Akan word for groundnuts; it supplies the N for Neptune in the memory sentence.',
    ],
    reviewQuestions: [
      'Check the planet definition against the 2006 International Astronomical Union resolution.',
      'Confirm the Page 1 figures: 1.3 million Earths by volume, 99.8 per cent of the mass, 5,500 °C surface, 15 million °C core.',
    ],
    guide: {
      overview:
        'Explains the Sun as a star powered by nuclear fusion, how gravity keeps the eight planets in orbit, the 2006 definition of a planet, and what the Parker Solar Probe is teaching us.',
      lessonMinutes: 45,
      goals: [
        'Describe the Sun as a star and name the process that produces its energy.',
        'Explain how gravity and sideways motion together produce an orbit.',
        'Name the eight planets in order and group them as rocky planets, gas giants, and ice giants.',
        'State the three conditions for a planet and explain why Pluto is a dwarf planet.',
      ],
      subjects: [
        ['Science (NaCCA CCP B8.3.2.1, Integrated Science, Strand 3 Systems: The Solar System)', 'The Sun, gravity, orbits, and the planets'],
        ['Mathematics (NaCCA CCP Mathematics: number, ratio, and rates)', 'Division with large numbers and speed-time calculations'],
      ],
      before: ['Ask learners to name the planets in order, then ask why Pluto is no longer on the list.'],
      during: ['Pause on Page 3 and swing a soft ball on a string in a circle. Ask: what does the string stand for, and what would the ball do if the string were let go?'],
      after: ['Have learners invent their own sentence for remembering the order of the planets, using Ghanaian words.'],
      discussion: ['Scientists changed their minds about Pluto. Is changing your mind a weakness or a strength in science?'],
      reflection: ['What in your daily life depends on energy from the Sun?'],
      maths: [
        {
          task: 'The Sun is about 1,390,000 km wide. Earth is about 12,700 km wide. About how many Earths would fit side by side across the Sun?',
          answer: '1,390,000 ÷ 12,700 is about 109.',
        },
        {
          task: 'Earth moves about 30 km every second in its orbit. How far does it travel in one hour?',
          answer: '30 × 3,600 = 108,000 km.',
        },
        {
          task: 'The height of Polaris, the North Star, above the horizon equals your latitude: about 6° in Accra and about 11° in Bawku. Why is it so hard to see from Ghana?',
          answer: 'It sits very low in the northern sky, where haze, trees, and buildings hide it.',
        },
      ],
      support: ['Provide eight planet cards for learners to arrange in order before reading Page 4.'],
      stretch: ['Research why Saturn has so many small moons and what an “irregular moon” is.'],
      localise: ['Replace “Nkatie” in the memory sentence with another local word beginning with N, or let learners choose their own.'],
      factCheck: [
        {
          claim: 'The Sun is powered by nuclear fusion of hydrogen into helium and holds 99.8 per cent of the Solar System’s mass.',
          explanation: 'Core temperature is about 15 million °C and the surface about 5,500 °C. About 1.3 million Earths would fit inside the Sun by volume.',
          reference: 'NASA Sun fact sheet.',
        },
        {
          claim: 'A planet must orbit the Sun, be round, and have cleared its orbit; Pluto is a dwarf planet.',
          explanation: 'The International Astronomical Union adopted this definition in 2006. Saturn’s confirmed moon count reached 274 in March 2025 and may change. Parker Solar Probe passed about 6 million km from the Sun on 24 December 2024.',
          reference: 'International Astronomical Union Resolution B5 (2006); NASA Parker Solar Probe mission.',
        },
      ],
    },
  }),

  // 3
  mk({
    key: 'where-does-the-solar-system-end',
    title: 'Where Does the Solar System End?',
    summary:
      'The Solar System does not stop at the last planet. This article travels outwards through the Kuiper Belt, the heliosphere, and the Oort Cloud, following the Voyager spacecraft, to ask where the edge really is.',
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
    paceWord: 'Steady, exploring, and clear',
    palette: ['#0f172a', '#38bdf8'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Slow, spacious synth pads with a soft pulse suggesting a long journey (placeholder)',
    pages: [
      pg(
        '🧊',
        'A football sails over the school wall and out of sight. Where does the field really end? Astronomers ask the same question about the Solar System. Neptune is the farthest planet from the Sun. It orbits at about 30 astronomical units. One astronomical unit, or AU, is the distance from Earth to the Sun, about 150 million kilometres. But the Solar System does not stop at Neptune. Beyond it lies the Kuiper Belt (say KY-per), a wide ring of icy objects stretching from about 30 to 50 AU. These objects are leftovers from the time the planets formed, 4.6 billion years ago. Pluto is the best known of them. In 2015, the New Horizons spacecraft flew past Pluto and sent back the first close-up pictures of its mountains of ice.',
        'Neptune in the foreground with a wide, faint ring of scattered icy bodies beyond it and the Sun as a bright distant star.'
      ),
      pg(
        '🔵',
        'A dwarf planet orbits the Sun and is round, but it shares its orbit with many other objects. Five are officially recognised. Ceres lies in the asteroid belt, between Mars and Jupiter. The other four, Pluto, Haumea, Makemake, and Eris, lie beyond Neptune. Eris surprised astronomers when it was found in 2005. It is slightly smaller than Pluto but has about a quarter more mass. Its orbit is a long, stretched oval. It swings from 38 AU out to 98 AU and takes about 560 years to go round once. Astronomers expect to confirm more dwarf planets as telescopes improve.',
        'Five small round worlds side by side, labelled Ceres, Pluto, Haumea, Makemake, and Eris, with Earth’s Moon shown beside them for scale.'
      ),
      pg(
        '🫧',
        'The Sun does not only give out light. It also blows out a stream of charged particles called the solar wind. This wind rushes past all the planets and pushes back the thin gas that drifts between the stars. The result is a giant bubble around the Solar System, called the heliosphere. The name comes from helios, the Greek word for Sun. The outer edge of the bubble is the heliopause. It lies about 120 AU from the Sun, four times as far as Neptune. Inside it, the Sun’s wind is in charge. Outside it is interstellar space: the space between the stars.',
        'A comet-shaped bubble surrounding the Sun and planets, with arrows of solar wind flowing outward and meeting thin gas from between the stars at the edge of the bubble.'
      ),
      pg(
        '📡',
        'Only two spacecraft have ever crossed the heliopause. Voyager 1 and Voyager 2 were launched in 1977 to study the giant planets. They never stopped. Voyager 1 entered interstellar space in August 2012. Voyager 2 followed in November 2018. Both still send faint radio signals home. NASA calculated that on 18 November 2026 Voyager 1 would be one light-day from Earth. That is about 25.9 billion kilometres, or 173 AU. A radio signal travels at the speed of light, yet it needs a full day to reach the spacecraft. Voyager 1 is the most distant object people have ever made.',
        'The Voyager spacecraft with its large dish antenna crossing the edge of the Sun’s bubble into dark space scattered with distant stars.'
      ),
      pg(
        '☄️',
        'Far beyond the heliopause, astronomers think there is a vast shell of icy bodies surrounding the whole Solar System. It is called the Oort Cloud, after the Dutch astronomer Jan Oort, who predicted it in 1950. Nobody has seen it directly. Its objects are too small, too dark, and too far away. The evidence comes from comets. Some comets fall towards the Sun from enormous distances and from every direction, as if from a giant shell. The Oort Cloud may begin about 1,000 AU from the Sun and stretch to 100,000 AU. Voyager 1 covers about 3.5 AU a year. Even so, it will need more than 200 years to reach the inner edge.',
        'A vast faint spherical shell of tiny icy bodies surrounding a small bright dot at the centre, with one comet falling inward on a long path.'
      ),
      pg(
        '🗺️',
        'The answer depends on what you mean by edge. If you mean the last planet, the Solar System ends at Neptune, 30 AU out. If you mean the reach of the solar wind, it ends at the heliopause, about 120 AU out. If you mean the reach of the Sun’s gravity, it ends at the outer Oort Cloud, perhaps 100,000 AU away. That is more than a third of the way to the nearest star. And the map is not finished. Some astronomers suspect that an undiscovered planet orbits far beyond Neptune. A powerful new telescope in Chile, the Vera C. Rubin Observatory, began scanning the southern sky in 2025. It may settle the question.',
        'A distance scale running outward from the Sun with three markers: Neptune at 30 AU, the heliopause at 120 AU, and the outer Oort Cloud at 100,000 AU.'
      ),
    ],
    activities: [
      {
        id: 'se-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What is the Kuiper Belt?',
        options: [
          'A belt of rocky asteroids between Mars and Jupiter',
          'The rings around Saturn',
          'A wide ring of icy objects beyond Neptune, from about 30 to 50 AU',
        ],
        correctIndex: 2,
      },
      {
        id: 'se-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What creates the heliosphere?',
        options: [
          'The solar wind pushing back the thin gas between the stars',
          'Sunlight reflecting off the planets',
          'Earth’s magnetic field',
        ],
        correctIndex: 0,
      },
      {
        id: 'se-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'Nobody has seen the Oort Cloud. Why do astronomers think it exists?',
        options: [
          'Voyager 1 photographed it',
          'Some comets arrive from enormous distances and from every direction',
          'It can be seen without a telescope on dark nights',
        ],
        correctIndex: 1,
      },
      {
        id: 'se-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A spacecraft is 150 AU from the Sun. Which statement is true?',
        options: [
          'It is still inside the Kuiper Belt',
          'It has passed the nearest star',
          'It has left the heliosphere but has not reached the Oort Cloud',
        ],
        correctIndex: 2,
      },
      {
        id: 'se-s1',
        type: 'sequencing',
        prompt: 'Arrange from nearest the Sun to farthest.',
        items: [
          'Neptune’s orbit (30 AU)',
          'The Kuiper Belt (30 to 50 AU)',
          'The heliopause (about 120 AU)',
          'Voyager 1 (about 173 AU)',
          'The Oort Cloud (about 1,000 to 100,000 AU)',
        ],
      },
      {
        id: 'se-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'heliosphere',
        definition: 'The giant bubble around the Solar System made by the solar wind.',
        distractors: [
          'The hot surface of the Sun',
          'The layer of air around Earth',
        ],
      },
    ],
    glossary: [
      {
        word: 'Kuiper',
        definition: 'The Kuiper Belt: a wide ring of icy objects beyond Neptune, from about 30 to 50 AU.',
        pages: [1],
      },
      {
        word: 'heliosphere',
        definition: 'The bubble around the Solar System created by the solar wind.',
        pages: [3],
      },
      {
        word: 'heliopause',
        definition: 'The outer edge of the heliosphere, about 120 AU from the Sun.',
        pages: [3, 4, 5, 6],
      },
      {
        word: 'interstellar',
        definition: 'Interstellar space: the space between the stars, outside the heliosphere.',
        pages: [3, 4],
      },
      {
        word: 'Oort',
        definition: 'The Oort Cloud: a predicted shell of icy bodies far beyond the planets; the source of many comets.',
        pages: [5, 6],
      },
    ],
    culturalNotes: [
      'Original article written for Ghanaian JHS learners. It covers the same topic as a published book but copies none of its text, comparisons, or activities.',
      'The inner edge of the Oort Cloud is uncertain; published estimates range from about 1,000 to 5,000 AU. The article uses 1,000 AU.',
    ],
    reviewQuestions: [
      'Confirm that Voyager 1 passed one light-day from Earth on 18 November 2026, and adjust the tense on Page 4 if needed.',
      'Check the Oort Cloud arithmetic: (1,000 − 173) ÷ 3.5 is about 236 years.',
    ],
    guide: {
      overview:
        'Follows the Solar System outward past Neptune, through the Kuiper Belt, the dwarf planets, the heliosphere, and the predicted Oort Cloud, and shows that “the edge” depends on the definition used.',
      lessonMinutes: 45,
      goals: [
        'Describe the Kuiper Belt and name the five recognised dwarf planets.',
        'Explain how the solar wind creates the heliosphere and what the heliopause is.',
        'Describe the Voyager missions and what interstellar space means.',
        'Explain how scientists can infer the Oort Cloud from evidence without seeing it.',
      ],
      subjects: [
        ['Science (NaCCA CCP B8.3.2.1, Integrated Science, Strand 3 Systems: The Solar System)', 'The outer Solar System, the solar wind, and space exploration'],
        ['Mathematics (NaCCA CCP Mathematics: number, ratio, and rates)', 'Rates, subtraction and division with large numbers'],
      ],
      before: ['Ask: Where do you think the Solar System ends? Record the answers and return to them after reading.'],
      during: ['Pause on Page 5 and ask: How can scientists be fairly confident about something nobody has seen?'],
      after: ['Draw a labelled distance line from the Sun to the Oort Cloud, marking Neptune, the Kuiper Belt, the heliopause, and Voyager 1.'],
      discussion: ['Page 6 gives three different answers to one question. Can all three be correct?'],
      reflection: ['Voyager 1 was launched in 1977 and is still working. What would you want a spacecraft to tell another world about Ghana?'],
      maths: [
        {
          task: 'Voyager 1 is about 173 AU from the Sun and covers about 3.5 AU a year. About how many years will it take to reach 1,000 AU?',
          answer: '(1,000 − 173) ÷ 3.5 is about 236 years.',
        },
        {
          task: 'Eris takes about 560 years to orbit the Sun once. It was discovered in 2005. In what year will it finish one full orbit since its discovery?',
          answer: '2005 + 560 = 2565.',
        },
        {
          task: 'A radio signal takes 24 hours to reach Voyager 1. If engineers send a command and the spacecraft replies at once, how long do they wait for the reply?',
          answer: '48 hours: one day out and one day back.',
        },
      ],
      support: ['Give the five regions on cards, with their distances, for learners to put in order.'],
      stretch: ['Find out what is recorded on the Voyager Golden Record and suggest one sound from Ghana that you would add.'],
      localise: ['Compare the solar wind to the Harmattan: a steady wind from one source that carries material a very long way.'],
      factCheck: [
        {
          claim: 'The Kuiper Belt lies from about 30 to 50 AU, and the heliopause is about 120 AU from the Sun.',
          explanation: 'Voyager 1 crossed the heliopause in August 2012 and Voyager 2 in November 2018. The Oort Cloud is predicted, not observed, and its inner edge is uncertain (about 1,000 to 5,000 AU). Eris orbits between about 38 and 98 AU and takes about 560 years to go round.',
          reference: 'NASA Voyager and New Horizons mission pages; to be confirmed by a science reviewer.',
        },
      ],
    },
  }),

  // 4
  mk({
    key: 'our-galaxy-the-milky-way',
    title: 'Our Galaxy, the Milky Way',
    summary:
      'Every star you can see at night belongs to one galaxy, the Milky Way. This article explains its shape, the black hole at its centre, the puzzle of dark matter, and the neighbouring galaxies around us.',
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
    paceWord: 'Quiet, clear, and full of wonder',
    palette: ['#4c1d95', '#fbbf24'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Gentle night-time kora and soft pads under a wide, starry feel (placeholder)',
    pages: [
      pg(
        '🌌',
        'On a clear night with no Moon, far from town lights, a pale band of light stretches across the sky. People in many cultures have told stories about it. The ancient Greeks thought it looked like spilt milk, and that is where the name Milky Way comes from. In 1610, Galileo pointed a telescope at the band and saw that it is made of countless faint stars. We now know that it is our own galaxy, seen from the inside. A galaxy is an enormous collection of stars, gas, dust, and dark matter, all held together by gravity.',
        'The band of the Milky Way arching over a dark Ghanaian savanna landscape with a baobab tree in silhouette.'
      ),
      pg(
        '🌀',
        'The Milky Way holds at least 100 billion stars, and perhaps as many as 400 billion. It is shaped like a flat disc with a bulge in the middle, about 100,000 light-years across. A light-year is the distance light travels in one year, about 9.5 trillion kilometres. Curved arms of stars wind out from the centre, so astronomers call it a spiral galaxy. The Sun sits in one of the smaller arms, about 26,000 light-years from the centre. The whole Solar System is orbiting the centre of the galaxy at about 800,000 kilometres an hour. Even at that speed, one trip round takes about 230 million years.',
        'The Milky Way seen from above as a barred spiral of stars, with a small marker labelled Sun in one arm about halfway out from the centre.'
      ),
      pg(
        '⚫',
        'At the centre of the Milky Way sits a supermassive black hole called Sagittarius A* (say “Sagittarius A-star”). A black hole is not an empty hole. It is a huge amount of matter squeezed into a tiny space. Its gravity is so strong that nothing that comes too close can escape, not even light. Sagittarius A* has about four million times the mass of the Sun. Astronomers showed it was there by tracking stars that whip around it, work that won a Nobel Prize in 2020. In 2022, a worldwide network of radio telescopes produced the first picture of the glowing gas around it. Earth is in no danger. We are 26,000 light-years away.',
        'A dark circle surrounded by a ring of glowing orange gas, with a few stars tracing tight curved orbits around it.'
      ),
      pg(
        '❓',
        'Here is a puzzle. Stars near the edge of a galaxy orbit much faster than they should. The gravity of all the stars and gas we can see is too weak to hold them in. Something else must be adding gravity. Astronomers call it dark matter. It gives out no light, so no telescope can see it directly. We know it only by its pull. Measurements suggest that about 85 per cent of all the matter in the universe is dark matter. Nobody yet knows what it is made of. It is one of the biggest unsolved questions in science.',
        'A spiral galaxy with a large faint halo drawn around it in dotted lines to show unseen dark matter, and arrows showing fast-moving stars at its edge.'
      ),
      pg(
        '🔭',
        'The Milky Way is one galaxy among a vast number, and they do not all look alike. Astronomers sort them into four main shapes. Spiral galaxies, like ours, are flat discs with curved arms. Elliptical galaxies are smooth and rounded, like a ball or an egg, with no arms. Lenticular galaxies are in between: a disc with a central bulge, shaped like a lens, but without clear arms. Irregular galaxies have no regular shape at all. Many of them were pulled out of shape by the gravity of a larger neighbour.',
        'Four galaxies in a row, each labelled: a spiral with arms, a smooth elliptical, a lens-shaped lenticular, and a ragged irregular.'
      ),
      pg(
        '🌠',
        'The Milky Way belongs to a cluster of galaxies called the Local Group. It has three large spiral galaxies, the Milky Way, Andromeda, and Triangulum, and dozens of small ones. The whole group is about 10 million light-years across. Andromeda is about 2.5 million light-years away. On a very dark night you can see it without a telescope, as a faint smudge. It is the most distant thing the human eye can see. Andromeda is moving towards us. Astronomers used to predict a certain collision in about 4.5 billion years. A 2025 study found the chance is only about 50 per cent in the next 10 billion years.',
        'Two large spiral galaxies labelled Milky Way and Andromeda, a smaller spiral labelled Triangulum, and many small faint galaxies scattered around them.'
      ),
    ],
    activities: [
      {
        id: 'mw-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Which statement best describes the Milky Way?',
        options: [
          'A spiral galaxy containing at least 100 billion stars, including the Sun',
          'A planet with a ring of dust',
          'A cloud high in Earth’s atmosphere',
        ],
        correctIndex: 0,
      },
      {
        id: 'mw-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why can light not escape from a black hole?',
        options: [
          'The black hole is completely empty',
          'Its gravity is too strong',
          'It is too cold for light to exist',
        ],
        correctIndex: 1,
      },
      {
        id: 'mw-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How do astronomers know that dark matter exists?',
        options: [
          'They have photographed it through large telescopes',
          'It glows faintly at night',
          'Its gravity affects how fast stars orbit in galaxies',
        ],
        correctIndex: 2,
      },
      {
        id: 'mw-c4',
        type: 'comprehension',
        afterPage: 5,
        question: 'Apply it: A telescope picture shows a smooth, rounded ball of stars with no disc and no arms. What type of galaxy is it?',
        options: [
          'Spiral',
          'Elliptical',
          'Irregular',
        ],
        correctIndex: 1,
      },
      {
        id: 'mw-s1',
        type: 'sequencing',
        prompt: 'Arrange from smallest to largest.',
        items: [
          'The Sun',
          'The Solar System',
          'One spiral arm of the Milky Way',
          'The Milky Way',
          'The Local Group',
        ],
      },
      {
        id: 'mw-voc',
        type: 'vocabulary',
        afterPage: 1,
        word: 'galaxy',
        definition: 'An enormous collection of stars, gas, dust, and dark matter held together by gravity.',
        distractors: [
          'A single star with planets orbiting it',
          'The path of a planet around the Sun',
        ],
      },
    ],
    glossary: [
      {
        word: 'galaxy',
        definition: 'An enormous collection of stars, gas, dust, and dark matter held together by gravity.',
        pages: [1, 2, 5],
      },
      {
        word: 'light-year',
        definition: 'The distance light travels in one year, about 9.5 trillion km.',
        pages: [2, 6],
      },
      {
        word: 'spiral',
        definition: 'A spiral galaxy is shaped like a flat disc with curved arms of stars.',
        pages: [2, 5, 6],
      },
      {
        word: 'supermassive',
        definition: 'A supermassive black hole: matter squeezed so tightly that nothing escapes, not even light.',
        pages: [3],
      },
      {
        word: 'dark',
        definition: 'Dark matter: invisible matter detected only by its gravity; about 85 per cent of all matter.',
        pages: [1, 4],
      },
      {
        word: 'Andromeda',
        definition: 'The large spiral galaxy about 2.5 million light-years away, in the Local Group.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Original article written for Ghanaian JHS learners. It covers the same topic as a published book but copies none of its text, comparisons, or activities.',
      'Dark-sky note: the Milky Way and Andromeda can be seen only away from town lights, and Harmattan haze can hide them.',
    ],
    reviewQuestions: [
      'Check that black holes are described as matter under extreme gravity, not as empty holes.',
      'Confirm 4,600 ÷ 230 = 20 and 200,000 ÷ 31.5 is about 6,300.',
    ],
    guide: {
      overview:
        'Presents the Milky Way as our home galaxy: its size and spiral shape, the Sun’s position and orbit, the black hole Sagittarius A*, the evidence for dark matter, the four galaxy shapes, and the Local Group.',
      lessonMinutes: 45,
      goals: [
        'Define a galaxy and describe the shape and size of the Milky Way.',
        'State where the Sun is in the galaxy and how long it takes to orbit the centre.',
        'Explain what a black hole is and how dark matter is detected.',
        'Classify galaxies as spiral, elliptical, lenticular, or irregular.',
      ],
      subjects: [
        ['Science (NaCCA CCP Integrated Science, Strand 3 Systems: The Solar System)', 'Galaxies, gravity, and the structure of the Milky Way'],
        ['Mathematics (NaCCA CCP Mathematics: number, ratio, and rates)', 'Division with millions and billions, and estimation'],
      ],
      before: ['Ask: Has anyone seen a pale band of light across the night sky, in a village or on a journey? What did people say it was?'],
      during: ['Pause on Page 4 and ask: What is the difference between “we cannot see it” and “it does not exist”?'],
      after: ['Sketch the four galaxy shapes from Page 5 and label each one.'],
      discussion: ['The 2025 study changed a prediction that textbooks had repeated for years. What does that tell you about scientific knowledge?'],
      reflection: ['What stories do people in your community tell about the stars or the Milky Way?'],
      maths: [
        {
          task: 'The Sun is about 4.6 billion years old and takes about 230 million years to orbit the galaxy once. About how many orbits has it completed?',
          answer: '4,600 million ÷ 230 million = 20 orbits.',
        },
        {
          task: 'Andromeda is 2.5 million light-years away. How long ago did the light you see from it tonight begin its journey?',
          answer: 'About 2.5 million years ago, long before modern humans existed.',
        },
        {
          task: 'If the Milky Way has 200 billion stars and you could count one star every second, how many years would counting take? (One year is about 31.5 million seconds.)',
          answer: '200,000 million ÷ 31.5 million is about 6,300 years.',
        },
      ],
      support: ['Use a plate (disc), a ball (elliptical), and a coin seen edge-on (lens shape) as hand-held models of galaxy shapes.'],
      stretch: ['Find out how the Event Horizon Telescope links radio dishes across the world to act as one Earth-sized telescope.'],
      localise: ['Collect local names and stories for the Milky Way and bright stars from elders, and compare them with the scientific account.'],
      factCheck: [
        {
          claim: 'The Milky Way holds at least 100 billion stars, is about 100,000 light-years across, and has a black hole, Sagittarius A*, of about four million solar masses at its centre.',
          explanation: 'The Sun is about 26,000 light-years from the centre and orbits it in about 230 million years. The 2020 Nobel Prize in Physics recognised the evidence for Sagittarius A*. The first image was released in 2022.',
          reference: 'NASA and European Southern Observatory galaxy pages; Nobel Prize in Physics 2020.',
        },
        {
          claim: 'The chance of a Milky Way and Andromeda collision in the next 10 billion years is about 50 per cent.',
          explanation: 'A 2025 study by Sawala and colleagues found that the earlier prediction of a certain collision in about 4.5 billion years is not supported.',
          reference: 'Sawala et al., Nature Astronomy, June 2025.',
        },
      ],
    },
  }),

  // 5
  mk({
    key: 'a-growing-universe',
    title: 'A Growing Universe, and Is Anyone Out There?',
    summary:
      'The universe is expanding, and telescopes now see almost back to its beginning. This article explains the expansion, the discovery of planets around other stars, the careful search for life, and Ghana’s own part in astronomy.',
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
    paceWord: 'Thoughtful, clear, and hopeful',
    palette: ['#0c4a6e', '#16a34a'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Open, hopeful highlife-tinged guitar over soft pads (placeholder)',
    pages: [
      pg(
        '♾️',
        'On a warm night, a child lies on a mat outside, looks up, and asks how much is out there. It is one of the oldest questions people have asked. The universe is everything that exists: all of space and time, and all the matter and energy in them. Evidence from many kinds of observation shows that it is about 13.8 billion years old. It began in an extremely hot, dense state and has been expanding and cooling ever since. Scientists call that beginning the Big Bang. The name is a little misleading. It was not an explosion at one place in space. Space itself began to stretch, everywhere at once. Over time, gravity pulled gas together to form the first stars and galaxies.',
        'A timeline band running from a bright glowing start on the left, through the first stars and galaxies, to the present-day sky on the right.'
      ),
      pg(
        '🍞',
        'In the 1920s, astronomers measured the light from distant galaxies and made a discovery. Almost all of them are moving away from us, and the farther away a galaxy is, the faster it moves. Think of raisins in bread dough. As the dough rises, every raisin moves away from every other raisin. No raisin is the centre. In the same way, the space between groups of galaxies is stretching. Galaxies inside one group are held together by gravity and do not drift apart. In 1998, astronomers found that the expansion of the universe is speeding up. The unknown cause is called dark energy.',
        'A loaf of rising dough with raisins moving apart, beside a matching sketch of groups of galaxies moving apart as space stretches.'
      ),
      pg(
        '🔭',
        'To see farther, we build better telescopes. The Hubble Space Telescope, launched in 1990, orbits above Earth’s blurring air. Astronomers once pointed it at a patch of sky that looked empty, far smaller than the full Moon, and collected light for more than eleven days. The picture showed about 10,000 galaxies. The James Webb Space Telescope, launched in December 2021, has a mirror 6.5 metres wide. It sees infrared light, which has a longer wavelength than the light our eyes detect. It has found galaxies whose light set out less than 300 million years after the Big Bang. That light has travelled for more than 13 billion years.',
        'Two space telescopes, the tube-shaped Hubble and the James Webb with its gold hexagonal mirror and kite-shaped sunshield, against a field of tiny galaxies.'
      ),
      pg(
        '🪐',
        'A planet that orbits a star other than the Sun is called an exoplanet. The first one orbiting a Sun-like star was found in 1995. By September 2025, NASA’s list of confirmed exoplanets had passed 6,000, with thousands more waiting to be checked. Astronomers find most of them by watching a star dim slightly when a planet passes in front of it. Some exoplanets orbit in the habitable zone of their star. That is the range of distances where a planet could be warm enough, but not too hot, for liquid water. Liquid water is essential for life as we know it.',
        'A star with several planets, one planet crossing the face of the star, and a green band around the star labelled habitable zone.'
      ),
      pg(
        '🔬',
        'So far, the honest answer is that we do not know. No life has been confirmed anywhere beyond Earth. But the search is serious science. Researchers look for biosignatures: chemicals or patterns that living things could produce. In 2025, scientists reported that a rock drilled on Mars by NASA’s Perseverance rover contains minerals that might have been made by ancient microbes. Ordinary chemistry might also explain them. Only laboratory tests on Earth could decide. This is how science works. An exciting claim is not accepted until the evidence is strong and other explanations have been ruled out.',
        'A six-wheeled rover on the reddish surface of Mars beside a pale rock marked with small dark spots.'
      ),
      pg(
        '🇬🇭',
        'Ghana is part of this search for knowledge. At Kuntunse, near Accra, stands a dish 32 metres wide. It was built to carry telephone and television signals by satellite. Ghanaian and South African engineers converted it into a radio telescope, and the Ghana Radio Astronomy Observatory opened in 2017. It studies radio waves from space and can link with telescopes in other countries to act as one giant instrument. In the same year, GhanaSat-1, a small satellite built at All Nations University in Koforidua, was released into orbit. The next discoveries will need new scientists and engineers. Some of them may be reading this.',
        'The large white 32-metre dish of the Ghana Radio Astronomy Observatory at Kuntunse pointing at a starry sky, with a small cube-shaped satellite orbiting above.'
      ),
    ],
    activities: [
      {
        id: 'gu-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What does it mean to say that the universe is expanding?',
        options: [
          'Earth is slowly getting bigger',
          'The space between groups of galaxies is stretching, so they move apart',
          'Every star is swelling',
        ],
        correctIndex: 1,
      },
      {
        id: 'gu-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why is looking at a very distant galaxy like looking back in time?',
        options: [
          'Its light took billions of years to reach us',
          'Telescopes travel faster than light',
          'Distant galaxies are younger than Earth',
        ],
        correctIndex: 0,
      },
      {
        id: 'gu-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What is the habitable zone of a star?',
        options: [
          'Any planet where people live',
          'The hottest region, closest to the star',
          'The range of distances where a planet could have liquid water',
        ],
        correctIndex: 2,
      },
      {
        id: 'gu-c4',
        type: 'comprehension',
        afterPage: 5,
        question: 'Apply it: A headline says, "Gas that may be a sign of life found on a distant planet." What is the most scientific response?',
        options: [
          'Accept that alien life has been found',
          'Treat it as a possibility and wait for more evidence',
          'Ignore it, because life elsewhere is impossible',
        ],
        correctIndex: 1,
      },
      {
        id: 'gu-s1',
        type: 'sequencing',
        prompt: 'Arrange from earliest to most recent.',
        items: [
          'The Big Bang, about 13.8 billion years ago',
          'The first stars and galaxies form',
          'The Sun and Earth form, about 4.6 billion years ago',
          'The Hubble Space Telescope is launched (1990)',
          'The James Webb Space Telescope is launched (2021)',
        ],
      },
      {
        id: 'gu-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'exoplanet',
        definition: 'A planet that orbits a star other than the Sun.',
        distractors: [
          'A planet that has left its orbit',
          'A dwarf planet in the Kuiper Belt',
        ],
      },
    ],
    glossary: [
      {
        word: 'universe',
        definition: 'Everything that exists: all space, time, matter, and energy.',
        pages: [1, 2],
      },
      {
        word: 'Bang',
        definition: 'The Big Bang: the hot, dense beginning of the universe, about 13.8 billion years ago.',
        pages: [1, 3],
      },
      {
        word: 'dark',
        definition: 'Dark energy: the unknown cause of the speeding-up of the universe’s expansion.',
        pages: [2],
      },
      {
        word: 'infrared',
        definition: 'Light with a longer wavelength than the eye can see.',
        pages: [3],
      },
      {
        word: 'exoplanet',
        definition: 'A planet that orbits a star other than the Sun.',
        pages: [4],
      },
      {
        word: 'habitable',
        definition: 'The habitable zone: distances from a star where liquid water could exist on a planet.',
        pages: [4],
      },
      {
        word: 'biosignatures',
        definition: 'Chemicals or patterns that living things could produce.',
        pages: [5],
      },
      {
        word: 'radio',
        definition: 'A radio telescope collects radio waves from space instead of visible light.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Original article written for Ghanaian JHS learners. It covers the same topic as a published book but copies none of its text, comparisons, or activities.',
      'This article gives the scientific account of the origin of the universe. Many learners also hold religious beliefs about creation; teachers can acknowledge this respectfully while keeping the lesson on the scientific evidence.',
      'The search-for-life page deliberately makes no claim that life has been found anywhere beyond Earth.',
    ],
    reviewQuestions: [
      'Confirm that Page 5 makes no claim that life has been found, and that the Mars finding is described as unconfirmed.',
      'Check 6,000 ÷ 30 = 200 and 13.8 − 4.6 = 9.2.',
    ],
    guide: {
      overview:
        'Explains the age and expansion of the universe, how the Hubble and James Webb telescopes look back in time, the discovery of exoplanets, how scientists test claims about life beyond Earth, and Ghana’s contribution to astronomy.',
      lessonMinutes: 45,
      goals: [
        'State the approximate age of the universe and describe what “expanding” means.',
        'Explain why observing distant galaxies shows the early universe.',
        'Define exoplanet, habitable zone, and biosignature.',
        'Explain why scientific claims need strong evidence, and describe Ghana’s radio telescope and first satellite.',
      ],
      subjects: [
        ['Science (NaCCA CCP Integrated Science, Strand 3 Systems: The Solar System)', 'The universe, telescopes, exoplanets, and scientific evidence'],
        ['Mathematics (NaCCA CCP Mathematics: number, ratio, and rates)', 'Averages and subtraction with large numbers'],
      ],
      before: ['Ask: Do you think there is life anywhere else in the universe? What evidence would convince you?'],
      during: ['Pause on Page 2: mark dots on a balloon and inflate it slowly. Ask learners which dot is the centre of the expansion.'],
      after: ['Write a five-sentence news report on one discovery from the article, saying what is known and what is still uncertain.'],
      discussion: ['Why is “we do not know yet” a respectable answer in science?'],
      reflection: ['Which job in space science would you like to do, and what would you need to study?'],
      maths: [
        {
          task: 'The first exoplanet around a Sun-like star was found in 1995. By 2025 about 6,000 were confirmed. What is the average number confirmed per year?',
          answer: '6,000 ÷ 30 = 200 per year.',
        },
        {
          task: 'The universe is about 13.8 billion years old and the Sun is about 4.6 billion years old. How old was the universe when the Sun formed?',
          answer: '13.8 − 4.6 = 9.2 billion years.',
        },
        {
          task: 'The dish at Kuntunse is 32 metres wide. Why do radio telescopes need such large dishes?',
          answer: 'Radio signals from space are extremely weak, so a large dish is needed to collect enough of them.',
        },
      ],
      support: ['Provide the five timeline events on cards for learners to put in order.'],
      stretch: ['Research the Square Kilometre Array and explain how telescopes in different African countries can work together.'],
      localise: ['If your school is within reach of Accra or Koforidua, enquire about an educational visit to the Ghana Radio Astronomy Observatory or to All Nations University.'],
      factCheck: [
        {
          claim: 'The universe is about 13.8 billion years old and its expansion is speeding up.',
          explanation: 'Evidence includes galaxy redshifts and the 1998 supernova observations that led to the idea of dark energy. The James Webb Space Telescope has found galaxies whose light left less than 300 million years after the Big Bang.',
          reference: 'NASA Webb and Hubble mission pages.',
        },
        {
          claim: 'More than 6,000 exoplanets were confirmed by September 2025; no life has been confirmed beyond Earth.',
          explanation: 'The Perseverance Mars rock result is reported as a possible biosignature that has not been confirmed. The Ghana Radio Astronomy Observatory at Kuntunse opened in 2017.',
          reference: 'NASA Exoplanet Archive; NASA Perseverance mission; Ghana Space Science and Technology Institute.',
        },
      ],
    },
  }),
];

