import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { PilotStory } from './pilot-stories';

type Page = PilotStory['pages'][number];
type Acts = PilotStory['activities'];

const pg = (
  motif: string,
  text: string,
  alt: string,
  narration = 'Measured, engaging voice suited for JHS learners; pause briefly after key scientific and moral insights.',
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
      notes: [
        'Read dialogue with distinct, natural voices for each JHS student, teacher, and elder.',
        'Pause for two seconds at each comprehension check so learners can reason before answering.',
        'Give clear weight to the distinction between suspended mud, living germs, and dissolved heavy metals.',
      ],
    },
    music: s.music,
    culturalNotes: s.culturalNotes,
    reviewQuestions: [
      'Is the language right for the stated JHS age band and BECE conceptual level?',
      'Is anything here scientifically inaccurate, stereotyped, or unsafe for adolescents?',
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
 * Batch 34 — Integrated JHS Story (Basic 7 to Basic 9 / JHS 1 to 3):
 * Bridges NaCCA Common Core Programme (CCP) Science (B8.1.1.1: Mixtures, suspensions, filtration, and limits of water
 * purification), Social Studies (B7.1.1.1, B8.1.1.1: Environmental degradation, water pollution from illegal mining,
 * and river buffer zones), and RME (B8.1.2.1, B9.1.2.1: Stewardship of God's creation across Christianity, Islam, and
 * African Traditional Religion). British Standard English verified for WAEC/BECE alignment.
 */

export const BATCH_34_STORIES: PilotStory[] = [
  mk({
    key: 'clear-water-is-not-enough',
    title: 'What the Filter Cannot Catch',
    summary:
      'When high river turbidity shuts down their town’s water supply, JHS classmates Adwoa, Kwesi, and Musa test river water in the science lab, uncover why filtration and boiling cannot remove toxic heavy metals like mercury, and unite Science, Social Studies, and RME to protect their river’s buffer zone.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['science', 'educational', 'school-life'],
    themes: ['community', 'health-and-wellbeing', 'school'],
    objectives: ['scientific-curiosity', 'environmental-awareness', 'reasoning', 'problem-solving', 'responsibility', 'citizenship'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'village-life'],
    wpm: 125,
    paceWord: 'Thoughtful, clear, and investigative',
    palette: ['#b45309', '#0284c7'],
    voice:
      'Thoughtful teen voices for Adwoa, Kwesi, and Musa; crisp, precise teacher voice for Mr Boateng; dignified elder voice for Nana Ofori',
    characters: [
      'Adwoa: a fourteen-year-old Ghanaian JHS 2 girl with neat braided hair tied back, wearing a yellow shirt and brown pinafore school uniform, carrying a plain unlabelled notebook.',
      'Kwesi: her thirteen-year-old Ghanaian classmate with short-cropped hair in a yellow uniform shirt and khaki-brown shorts, wearing blue protective nitrile gloves during lab scenes.',
      'Musa: their fourteen-year-old Ghanaian classmate in a yellow uniform shirt and khaki-brown trousers, thoughtful and articulate.',
      'Mr Boateng: the Ghanaian JHS Integrated Science teacher in his late thirties with short neat hair and spectacles, wearing a crisp white lab coat over a blue collared shirt.',
      'Nana Ofori: a respected elderly Ghanaian community elder with grey-flecked hair, draped in rich green-and-gold traditional kente-patterned cloth.',
    ],
    music: 'Gentle acoustic guitar with flowing river ambience transitioning to a steady, hopeful marimba pulse (placeholder)',
    pages: [
      pg(
        '🌊',
        'On Monday morning, the standpipe at Assin Nsuta JHS ran completely dry. Crossing the bridge earlier, Adwoa, Kwesi, and Musa had seen why: River Subin, once clear enough to show smooth pebbles on its bed, churned thick and yellowish-brown like cocoa drink. At assembly, the headteacher announced that illegal alluvial mining upstream had pushed the river’s turbidity so high that the district water treatment plant had shut its intake pumps to protect its machinery.',
        'Three Ghanaian JHS students in yellow-and-brown uniforms stand safely on a concrete bridge looking down at a thick, yellowish-brown river.',
      ),
      pg(
        '🔬',
        'During Science, Mr Boateng placed a sealed jar of the muddy river water on the demonstration bench. Wearing gloves, Adwoa observed how fine clay and silt hung in the water. “Because insoluble solid particles are dispersed throughout the liquid without dissolving, this heterogeneous mixture is a suspension,” Mr Boateng explained. After letting the heaviest grit settle by sedimentation, Kwesi carefully decanted the cloudy top layer through a folded filter paper into a conical flask. Brown residue stayed on the paper, while clear liquid, the filtrate, dripped steadily below.',
        'In a Ghanaian JHS science lab, Mr Boateng watches gloved Adwoa and Kwesi pour cloudy water through filter paper in a funnel into a conical flask.',
      ),
      pg(
        '⚗️',
        'Kwesi held the flask up to the window. “Sir, the filtrate looks crystal clear! If we boil it to kill germs, is it safe to drink?” Mr Boateng shook his head firmly. “Never assume clear water is pure water, Kwesi. Filtration only traps insoluble suspended solids. Boiling destroys living pathogens such as cholera and typhoid bacteria, but it cannot destroy dissolved chemical pollutants or toxic heavy metals like mercury and lead used in illegal mining. Worse still, boiling evaporates pure water as steam and leaves dissolved heavy metals even more concentrated in the pot.”',
        'Mr Boateng in a white lab coat holds up a warning finger beside a flask of clear filtrate and a wordless chalkboard icon diagram of droplets.',
      ),
      pg(
        '🗺️',
        'In Social Studies that afternoon, the class traced the wider cost of river degradation across Ghana. When excavators strip away riverbanks and wash soil directly into streams, farmers downstream lose fertile cocoa and vegetable floodplains, fish habitats collapse, and towns spend far more public money on coagulants like alum to treat domestic water. Musa pointed to the district map: “Destroying a river for quick gold transfers massive health and economic costs onto innocent communities downstream.”',
        'Musa, Adwoa, and Kwesi gather around a painted wordless classroom map of a winding river basin showing farms, fish, and a water station downstream.',
      ),
      pg(
        '🤝',
        'On Wednesday, the school’s Environmental Club invited Nana Ofori to an RME forum on caring for creation. “Every moral tradition in Ghana teaches accountability for the Earth,” Musa noted. “Christianity teaches stewardship, that God entrusted creation to humans to tend and protect, and Islam teaches that we are Khalifah, trustees of Allah’s Earth who must never corrupt clean water.” Nana Ofori nodded warmly. “And our ancestors forbade farming or digging along riverbanks and set sacred rest days for rivers. Those taboos were not empty superstition; they preserved vegetated buffer zones that held the soil in place and filtered rainwater naturally.”',
        'Nana Ofori in traditional cloth speaks with Adwoa, Kwesi, and Musa under a shady school tree beside wordless nature paintings of trees and clear streams.',
      ),
      pg(
        '🌱',
        'Understanding the science, civic impact, and moral duty changed how the students acted. Working safely on dry school land with the Forestry Commission officer and local elders, never confronting illegal miners themselves, the club planted native trees and clumping bamboo fifty metres back from the town’s tributary stream to restore its protective buffer zone. At their Friday science exhibition, Adwoa shared a message the whole school remembered: “Filtration clears mud, and boiling kills germs, but only responsible stewardship keeps poison out of our water.”',
        'Adwoa, Kwesi, Musa, Nana Ofori, and a forestry officer in green khaki plant young bamboo and tree seedlings along a lush green stream buffer zone.',
      ),
    ],
    activities: [
      {
        id: 'wf-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why is muddy river water classified as a suspension rather than a solution?',
        options: [
          'Insoluble solid particles hang in the water and can settle or be filtered',
          'All the soil has chemically bonded with water to form a new compound',
          'It contains only pure distilled water and dissolved oxygen gas',
        ],
        correctIndex: 0,
      },
      {
        id: 'wf-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why does boiling clear, filtered river water NOT make it safe if illegal mining chemicals are present?',
        options: [
          'Boiling kills germs, but dissolved heavy metals like mercury stay behind',
          'Boiling turns insoluble sand particles back into thick brown mud',
          'Filter paper adds toxic mercury to the water before it boils',
        ],
        correctIndex: 0,
      },
      {
        id: 'wf-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What ecological purpose did traditional riverbank taboos share with modern environmental laws?',
        options: [
          'Both protect vegetated buffer zones that stop riverbank erosion and mud',
          'Both encourage digging closer to the riverbed during the dry season',
          'Both allow waste disposal in streams on sacred rest days',
        ],
        correctIndex: 0,
      },
      {
        id: 'wf-s1',
        type: 'sequencing',
        afterPage: 6,
        prompt: 'Put the scientific investigation and community action steps in chronological order.',
        items: [
          'High river turbidity forces the district water plant to shut its pumps.',
          'Students separate silt by sedimentation, decantation, and filtration.',
          'Mr Boateng explains why filtration and boiling leave heavy metals behind.',
          'Students work with elders and forestry officers to replant a buffer zone.',
        ],
      },
      {
        id: 'wf-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'filtrate',
        definition: 'The clear liquid that passes through a filter after solid residue is trapped.',
        distractors: [
          'The solid brown mud left behind on top of the filter paper',
          'A chemical coagulant added to settle fine clay particles',
        ],
      },
    ],
    glossary: [
      {
        word: 'turbidity',
        definition: 'The cloudiness of water caused by large numbers of suspended particles such as silt and clay.',
        pages: [1],
      },
      {
        word: 'suspension',
        definition: 'A heterogeneous mixture in which insoluble solid particles hang in a liquid and settle on standing.',
        pages: [2],
      },
      {
        word: 'filtrate',
        definition: 'The clear liquid collected after a mixture passes through a filter, which may still hold dissolved substances.',
        pages: [2, 3],
      },
      {
        word: 'pathogens',
        definition: 'Disease-causing microorganisms, such as certain bacteria and viruses, destroyed by boiling or chlorination.',
        pages: [3],
      },
      {
        word: 'stewardship',
        definition: 'The moral duty to care for and protect God’s creation and natural resources for future generations.',
        pages: [5, 6],
      },
    ],
    culturalNotes: [
      'Curriculum Integration: Directly aligns with NaCCA Common Core Programme (CCP) JHS Science (B8.1.1.1: Mixtures and scientific separation methods; Strand 5: Understanding the Environment), Social Studies (B7.1.1.1, B8.1.1.1: Environmental challenges, water pollution, and illegal mining / galamsey), and RME (B8.1.2.1, B9.1.2.1: Caring for God’s creation across Christianity, Islam, and African Traditional Religion).',
      'Scientific Accuracy Guardrail: Emphasises a vital BECE distinction—sedimentation and filtration remove insoluble suspended matter (residue), and boiling kills biological pathogens, but neither removes dissolved toxic heavy metals (such as mercury or lead). Heating mercury-contaminated water in enclosed spaces can also pose vapour hazards, and evaporation concentrates non-volatile dissolved salts and metal ions.',
      'RME & Indigenous Knowledge Respect: Presents Christian stewardship, Islamic Khalifah (trusteeship), and Akan/Ghanaian traditional river buffer taboos side by side as complementary moral frameworks, showing learners the sound ecological reasoning behind indigenous conservation practices.',
      'Adolescent Safety Rule: JHS learners must never visit active mining pits, handle polluted river water without gloves, taste laboratory samples, or confront illegal miners; civic action focuses on supervised buffer-zone tree planting and public education.',
    ],
    reviewQuestions: [
      'Verify that the distinction between residue, filtrate, suspended solids, pathogens, and dissolved heavy-metal ions aligns strictly with NaCCA B8.1.1.1.',
      'Check that all three religions in NaCCA RME (Christianity, Islam, and African Traditional Religion) are represented accurately and respectfully.',
    ],
    guide: {
      overview:
        'An integrated JHS lesson linking chemistry (suspensions, filtration, and dissolved pollutants), civic environmental management (turbidity, water treatment costs, and buffer zones), and comparative religious ethics (stewardship of creation). Designed to prevent persistent misconceptions about water purification before BECE.',
      lessonMinutes: 45,
      goals: [
        'Distinguish clearly between a suspension and a solution, and identify residue and filtrate in laboratory filtration.',
        'Explain accurately why filtration and boiling cannot make heavy-metal-polluted water safe to drink.',
        'Analyse the socio-economic impacts of river siltation and illegal mining on downstream communities and water treatment plants.',
        'Compare Christian, Islamic, and African Traditional Religion teachings on environmental stewardship and river conservation.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP B8.1.1.1)', 'Mixtures: Suspensions, filtration, and limits of purification'],
        ['Social Studies (NaCCA CCP B7.1.1.1, B8.1.1.1)', 'Environmental issues, water pollution, and sustainable resource use'],
        ['Religious & Moral Education (NaCCA CCP B8.1.2.1, B9.1.2.1)', 'Stewardship of God’s creation across the three major religions'],
      ],
      before: [
        'Show two jars: one with clean tap water mixed with clean garden soil, and one with salt dissolved in clear water. Ask: if we pass both through filter paper, what stays behind and what passes through?',
        'Ask learners what happens to town taps when river turbidity rises too high during heavy rains or upstream mining.',
      ],
      during: [
        'Pause after Page 2 and ask learners to define suspension, residue, and filtrate in their own words.',
        'Pause after Page 3 and challenge learners: "Why is Kwesi’s assumption—that clear, boiled filtrate is always safe—dangerous when chemical pollutants are present?"',
        'Pause after Page 5 to connect RME concepts (stewardship, Khalifah, and sacred buffer-zone taboos) to modern Water Resources Commission buffer-zone rules.',
      ],
      after: [
        'Safe Lab Practical: Prepare a safe classroom suspension using clean tap water and clean washed sand/clay (never polluted river water). Perform sedimentation, decantation, and filtration, labelling the apparatus, residue, and filtrate.',
        'Draw a three-column comparison table showing what (a) Filtration, (b) Boiling/Chlorination, and (c) Source Protection each prevent or remove.',
      ],
      discussion: [
        'Why does preventing heavy-metal pollution at the river source cost society far less than trying to remove dissolved heavy metals at a treatment plant?',
        'How did indigenous riverbank taboos achieve the same ecological outcome as modern Riparian Buffer Zone policies?',
      ],
      reflection: [
        'What daily habit in your home, school, or community affects stream and drain cleanliness downstream?',
      ],
      maths: [
        {
          task: 'A district water treatment plant normally supplies 12,000 cubic metres of clean water per day. High river turbidity forces engineers to reduce output by 35%. How many cubic metres of water are supplied per day now?',
          answer: '7,800 cubic metres (35% of 12,000 = 4,200 m³ reduction; 12,000 − 4,200 = 7,800 m³).',
        },
        {
          task: 'In a laboratory test, 500 mL of muddy water leaves 15 g of dry residue on the filter paper. Calculate the concentration of suspended solids in grams per litre (g/L).',
          answer: '30 g/L (500 mL = 0.5 L; 15 g ÷ 0.5 L = 30 g/L).',
        },
      ],
      support: [
        'Provide a labelled diagram of a funnel, filter paper, residue, conical flask, and filtrate with colour-coded particle icons showing large clay particles trapped and tiny dissolved ions passing through.',
      ],
      stretch: [
        'Research how Ghana Water Limited uses coagulation, flocculation (with alum), sedimentation, rapid sand filtration, and chlorination—and explain why raw water above critical Nephelometric Turbidity Units (NTU) still forces plant shutdowns.',
      ],
      localise: [
        'Substitute River Subin with the major river basin serving your district (e.g., Pra, Offin, Birim, Ankobra, Densu, White Volta, or Oti).',
        'Use only clean tap water mixed with clean soil/chalk dust for classroom filtration experiments; never collect water from polluted drains or mining-affected streams.',
      ],
      factCheck: [
        {
          claim: 'Filtration removes insoluble suspended solids, and boiling kills biological pathogens, but neither removes dissolved heavy metals such as mercury or lead.',
          explanation: 'Dissolved heavy-metal ions pass straight through filter paper pores and remain non-volatile in water when boiled (with evaporation increasing their concentration in the remaining liquid).',
          reference: 'NaCCA Common Core Programme (CCP) Integrated Science Curriculum for Basic 7–9 (B8.1.1.1) & WHO Guidelines for Drinking-water Quality.',
        },
        {
          claim: 'Vegetated riparian buffer zones stabilise riverbanks and reduce sediment and runoff entering streams.',
          explanation: 'Ghana’s Riparian Buffer Zone Policy (Water Resources Commission) and traditional Ghanaian riverbank taboos both maintain tree/bamboo root networks along stream corridors to prevent bank collapse and siltation.',
          reference: 'NaCCA CCP Social Studies (B7.1.1.1, B8.1.1.1), RME (B8.1.2.1, B9.1.2.1), & Ghana Water Resources Commission Riparian Buffer Zone Policy.',
        },
      ],
    },
  }),
];

