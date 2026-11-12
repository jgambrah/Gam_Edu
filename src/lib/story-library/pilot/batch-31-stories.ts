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
 * Batch 31: Science and life skills for young minds. Eight stories for kindergarten to primary 4: shadows, floating and
 * sinking, magnets, the heart and exercise, why we need sleep, a fair test, saving money, and settling a disagreement.
 * Each story is built on one clear idea, gives one real activity that is safe to try, and keeps the language simple.
 */

export const BATCH_31_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'dufie-and-the-long-shadow',
    title: 'Dufie and the Long Shadow',
    summary: 'Dufie and her little brother Kpakpo find out how shadows are made and why they are long in the morning and short at noon.',
    classIds: ['kg-2', 'primary-1'], ageMin: 5, ageMax: 7, readingLevel: 'early', difficulty: 1,
    genres: ['science', 'educational', 'family'], themes: ['family', 'school', 'weather'], objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'reading-comprehension'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Curious and bright, slowing for the explanations', palette: ['#f59e0b', '#475569'],
    voice: 'A bright big-sister voice for Dufie; a small curious voice for Kpakpo',
    characters: [
      'Dufie: a cheerful seven-year-old Ghanaian girl with neat braided plaits tied with yellow ribbons, wearing a sunny amber blouse, denim skirt, and brown sandals.',
      'Kpakpo: her wide-eyed four-year-old little brother with short curly hair, wearing a sky-blue T-shirt, khaki shorts, and sandals.',
    ],
    music: 'A light xylophone, rising in the morning and softer at noon (placeholder)',
    pages: [
      pg('🏡', 'On Saturday morning, Dufie took her little brother Kpakpo into the yard. “Look!” said Kpakpo. “Something dark is following us!” Dufie laughed. “That is our shadow.”', 'In warm morning sunlight, Dufie and little Kpakpo stand in their sandy compound yard pointing happily at two long dark shadows stretching beside them.'),
      pg('✋', 'Dufie held up her hand in the sunlight. A dark shape appeared on the ground. “A shadow is made when something blocks the light,” she said. “The light cannot go through my hand.” She was careful never to look straight at the sun.', 'Dufie holds one open hand up in the morning sun, casting a crisp hand-shaped shadow onto the warm earth while Kpakpo crouches to look.'),
      pg('🪨', 'Dufie put a stone, a green leaf, and a clear plastic cup on the ground. The stone made a dark shadow. The leaf made a lighter shadow. The clear cup made almost no shadow, because the light passed right through it.', 'Close view on sunlit ground showing a grey stone casting a dark shadow, a green leaf casting a soft translucent shadow, and a clear cup letting light pass through.'),
      pg('🌞', 'They checked their shadows in the morning, at noon, and in the afternoon. In the morning, their shadows were long. At noon, when the sun was high overhead, their shadows were very short. In the afternoon, they grew long again.', 'Bright midday scene in the sunny yard where Dufie and Kpakpo look down in wonder at their tiny, short noon shadows right beneath their sandals.'),
      pg('🔦', 'At night, Kpakpo could not find his shadow. “It has gone!” he cried. Dufie shone a hand torch toward his arm, and a shadow appeared on the wall. “Here it is,” she said. “A shadow needs light. Without light, there is no shadow.”', 'Inside a cosy dim room at night, Dufie shines a bright hand torch onto Kpakpo’s raised arm, casting a clear arm shadow onto the plain wall.'),
      pg('👏', 'Dufie summed up what they had learned: a shadow is made when light is blocked, shadows are long in the morning and afternoon and short at noon, and every shadow needs light. Kpakpo clapped his hands. “Now we can teach Mama!”', 'Kpakpo clapping joyfully beside smiling Dufie on their warmly lit veranda in the evening.'),
    ],
    activities: [
      { id: 'dl-c1', type: 'comprehension', afterPage: 2, question: 'When is a shadow made?', options: ['When something blocks the light', 'When it is cold', 'When it rains'], correctIndex: 0 },
      { id: 'dl-c2', type: 'comprehension', afterPage: 4, question: 'When are shadows shortest?', options: ['At noon', 'In the morning', 'At night'], correctIndex: 0 },
      { id: 'dl-s1', type: 'sequencing', prompt: 'Put the shadow day in order.', items: ['Long shadows in the morning.', 'Short shadows at noon.', 'Long shadows in the afternoon.', 'No shadow without light.'] },
      { id: 'dl-voc', type: 'vocabulary', afterPage: 2, word: 'shadow', definition: 'A dark shape made when something blocks the light.', distractors: ['A kind of cloud', 'A loud noise'] },
    ],
    glossary: [
      { word: 'shadow', definition: 'A dark shape made when something blocks the light.', pages: [1, 2] },
      { word: 'blocks', definition: 'Stops something from going through.', pages: [2] },
      { word: 'torch', definition: 'A small hand lamp that makes light.', pages: [5] },
    ],
    culturalNotes: ['Children in many Ghanaian schools learn about shadows in Integrated Science. The story uses a compound yard and a hand torch that many children know.', 'The story keeps eye safety in view by reminding readers that Dufie never looks straight at the sun.'],
    reviewQuestions: ['Check that near noon the shadows are shortest in the area where the story is read (they are very short in the tropics).', 'Check that the idea “a leaf makes a lighter shadow” is clear for young children.'],
    guide: {
      overview: 'A first look at how shadows are made. It teaches that a shadow needs light and an object that blocks it, and that the length of a shadow changes during the day. Activity: trace a shadow in the morning, at noon, and in the afternoon.',
      lessonMinutes: 25, goals: ['Say how a shadow is made.', 'Say when shadows are longest and shortest.', 'Test which objects make dark, light, or almost no shadows.'],
      subjects: [['Integrated Science', 'Light and shadows'], ['English Language', 'Describing what we see']],
      before: ['Ask: where have you seen your shadow? Step outside safely and look at it on the ground.'], during: ['Hold up a hand in front of a torch to show how a shadow forms.'],
      after: ['Trace a shadow with chalk three times a day with an adult watching.', 'Test five objects in the sunlight and sort them: dark shadow, lighter shadow, or almost no shadow.'],
      discussion: ['Why is there no shadow in a completely dark room?', 'Why is your shadow long in the morning and short at noon?'], reflection: ['What did you learn today that you can teach someone at home?'],
      support: ['Use a torch and a hand against a plain wall so children can see the shadow clearly.'], stretch: ['Predict where the shadow will fall in the afternoon and check it later.'],
      localise: ['Use a familiar compound yard, shade tree, or school block for the shadow walk.', 'Remind children never to look straight at the sun.'],
      factCheck: [{ claim: 'Shadows are longest in the morning and late afternoon and shortest near noon.', explanation: 'When the sun is low in the sky, blocked light casts a long shadow; when the sun is high overhead near midday, the shadow falls closely beneath the object.', reference: 'NaCCA Ghana Primary Integrated Science Curriculum (Light and Shadows)' }],
    },
  }),

  // 2
  mk({
    key: 'rahina-and-the-foil-boat',
    title: 'Rahina and the Foil Boat',
    summary: 'Rahina and her cousin Ameyaw test what floats and what sinks. They discover that the same piece of foil sinks as a tight ball, yet floats when shaped into a boat.',
    classIds: ['primary-1', 'primary-2'], ageMin: 6, ageMax: 8, readingLevel: 'early', difficulty: 2,
    genres: ['science', 'educational', 'family'], themes: ['family', 'school', 'technology'], objectives: ['scientific-curiosity', 'reasoning', 'problem-solving', 'counting'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Curious and steady, building to the surprise', palette: ['#0ea5e9', '#94a3b8'],
    voice: 'A quick, curious voice for Rahina; a cheerful voice for Ameyaw; calm for the mother',
    characters: [
      'Rahina: an inquisitive eight-year-old Ghanaian girl wearing a soft sky-blue headscarf and a neat yellow-and-blue patterned dress.',
      'Ameyaw: her cheerful nine-year-old cousin with short hair, wearing an orange polo shirt and navy shorts.',
      'Their mother: a warm Ghanaian woman in a blue-and-gold African-print wrapper cloth and headwrap, watching kindly from a carved wooden stool.',
    ],
    music: 'A playful tune with water-drop sounds (placeholder)',
    pages: [
      pg('🥣', 'Rahina and her cousin Ameyaw filled a wide basin with clean water. “Which things will float?” asked Rahina. Beside the basin lay five small objects: a cork, a coin, a green leaf, a smooth stone, and a square of kitchen foil.', 'Rahina and Ameyaw kneeling beside a wide basin of clear water on a courtyard mat, with a cork, a coin, a green leaf, a pebble, and a flat square of silver foil beside them.'),
      pg('🧪', 'First they guessed, and then they tested each one. The cork floated, and the leaf floated too. The coin sank, and the stone sank. Next, Ameyaw squeezed the foil into a tight little ball, and it sank to the bottom.', 'Close view of the clear water basin: the cork and green leaf float on top while the coin, smooth stone, and tightly balled silver foil rest on the bottom.'),
      pg('⛵', 'Rahina had an idea. She folded a matching square of foil into a little boat with high sides. When she placed it gently on the water, it floated! “It is the same kind of foil,” said Ameyaw, “so why does it float now?”', 'Rahina gently setting a neat little silver foil boat onto the water surface where it floats smoothly as Ameyaw watches in amazement.'),
      pg('💡', 'Rahina remembered what her teacher had explained. “A boat’s wide shape pushes aside plenty of water, and the water pushes back up,” she said. “The boat also holds air inside, so it stays light for its size.”', 'Close sunlit view of the hollow silver foil boat sitting high and buoyant on the sparkling water while Rahina cups her hands to explain its shape to Ameyaw.'),
      pg('🪨', 'They placed small stones into the foil boat, one by one, counting together. On the eighth stone, water rushed in and the boat sank! “Every boat can carry only so much,” said Rahina. “That is why real boats have a safe load limit.”', 'Ameyaw adding a tiny pebble to the stone-filled silver foil boat just as it tips below the water surface while Rahina watches closely.'),
      pg('🛟', 'Their mother smiled from her stool. “A basin is safe for testing, yet never play near a river or deep water without a grown-up,” she reminded them. Afterwards, the cousins wiped the floor dry and drew pictures of the floaters and sinkers.', 'Rahina and Ameyaw drying splashes around the basin with a cloth while their smiling mother sits nearby on her wooden stool.'),
    ],
    activities: [
      { id: 'rf-c1', type: 'comprehension', afterPage: 3, question: 'What was special about the foil boat?', options: ['It floated, even though the tight foil ball sank', 'It sank like a stone at once', 'It melted in the water'], correctIndex: 0 },
      { id: 'rf-c2', type: 'comprehension', afterPage: 5, question: 'How many stones did the boat carry safely before it sank on the eighth?', options: ['Seven', 'Eight', 'Two'], correctIndex: 0, explanation: 'It sank when the eighth stone went in, so it carried seven stones safely.' },
      { id: 'rf-pr', type: 'prediction', afterPage: 1, prompt: 'What do you think will happen when the coin is placed in the water?', options: ['It will sink', 'It will float', 'It will bounce out'] },
      { id: 'rf-voc', type: 'vocabulary', afterPage: 3, word: 'float', definition: 'To stay on top of water without sinking.', distractors: ['To fall to the bottom', 'To make a loud noise'] },
    ],
    glossary: [
      { word: 'float', definition: 'To stay on top of water without sinking.', pages: [1, 3] },
      { word: 'sank', definition: 'Went down to the bottom of the water.', pages: [2, 5] },
      { word: 'basin', definition: 'A wide, open bowl used for holding water.', pages: [1, 6] },
    ],
    culturalNotes: ['Many Ghanaian children live near rivers, lagoons, Lake Volta, or the sea, where wooden canoes are part of daily life. The story pairs a safe basin experiment with a clear rule about deep water.', 'Local fishing canoes, ferries, and life jackets make vivid classroom examples.'],
    reviewQuestions: ['Check that the explanation of floating (the boat pushes aside water, and the water pushes back up; the hollow shape holds air) suits Primary 1–2.', 'Check that the foil ball is squeezed tightly so no trapped air keeps it afloat.'],
    guide: {
      overview: 'A hands-on basin investigation showing that shape determines whether foil floats or sinks. Learners practise predicting, testing, counting load capacity, and following water-safety rules.',
      lessonMinutes: 30, goals: ['Sort tested objects into floaters and sinkers.', 'Explain simply why a hollow foil boat floats while a tight foil ball sinks.', 'State a clear safety rule for rivers and deep water.'],
      subjects: [['Integrated Science', 'Floating and sinking'], ['Mathematics', 'Counting and recording']],
      before: ['Show five classroom objects and ask learners to predict which ones will float.'], during: ['Test one object at a time in a basin and compare with the class predictions.'],
      after: ['Fold small foil boats in groups and count how many pebbles each boat holds before sinking.', 'Draw a two-column picture chart of objects that floated and objects that sank.'],
      discussion: ['Why did the same material sink as a tight ball yet float as a boat?', 'Why must every canoe or ferry respect its load limit?'], reflection: ['What safety rules keep us safe near rivers, lagoons, or the sea?'],
      maths: [{ task: 'The foil boat carried 7 stones safely. Suppose a wider boat carries 3 more stones; how many stones is that in all?', answer: '10 stones' }, { task: 'Count the five tested items: cork, leaf, coin, stone, tight foil ball. How many sank?', answer: '3 (coin, stone, tight foil ball)' }],
      support: ['Test three objects together and sort them onto two picture mats.'], stretch: ['Design two foil boats with different floor widths and test which shape carries more pebbles.'],
      localise: ['Connect the lesson to canoes and boats in your community.', 'Reinforce water safety: never go near deep water without a trusted adult and a life jacket.'],
      factCheck: [{ claim: 'A hollow foil boat floats even though the same foil squeezed into a tight ball sinks.', explanation: 'Shaping the foil into a wide hollow hull encloses air and displaces more water, lowering overall average density so upward water push supports its weight.', reference: 'NaCCA Ghana Primary Integrated Science Curriculum (Forces: Floating and Sinking)' }],
    },
  }),

  // 3
  mk({
    key: 'zaara-and-the-magnet',
    title: 'Zaara and the Magnet',
    summary: 'Zaara and Worla test what a magnet can pick up, find that it pulls iron and steel rather than wood, plastic, or glass, and discover how magnet ends pull and push.',
    classIds: ['primary-1', 'primary-2'], ageMin: 6, ageMax: 8, readingLevel: 'early', difficulty: 2,
    genres: ['science', 'school-life', 'educational'], themes: ['school', 'friendship', 'technology'], objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'reading-comprehension'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Curious and clear, with a crisp click for each pull', palette: ['#dc2626', '#2563eb'],
    voice: 'An excited voice for Zaara; a calm voice for Worla; a kind, clear teacher voice for Madam Salamatu',
    characters: [
      'Zaara: an eight-year-old Ghanaian girl in a neat blue-and-yellow school uniform and tidy white headscarf, holding a red-and-blue magnet.',
      'Worla: her eight-year-old male classmate with short neat hair in a matching yellow uniform shirt and blue shorts, holding an exercise book and pencil.',
      'Madam Salamatu: their warm Ghanaian class teacher wearing a bright emerald-and-gold African-print dress.',
    ],
    music: 'A light bouncing tune with a small click sound for each pull (placeholder)',
    pages: [
      pg('🧲', 'Madam Salamatu gave each pair of pupils a magnet and a cloth bag of everyday items. “Let us find out what the magnet can pick up,” she said. Zaara and Worla opened their notebook ready to record what happened.', 'At a wooden classroom desk, Zaara holds a red-and-blue magnet while Worla opens a plain notebook beside a cloth bag of small classroom objects as Madam Salamatu smiles nearby.'),
      pg('🔩', 'First, they tested an iron nail. Click! It jumped straight onto the magnet. A paper clip jumped up too, and so did a steel pin. “They all have iron in them,” explained Madam Salamatu. “Steel is made mainly from iron.”', 'Close view on the wooden desk as Zaara’s red-and-blue magnet lifts an iron nail, a silver paper clip, and a small steel pin together.'),
      pg('🪵', 'Next, they tested a pencil, a green leaf, a plastic spoon, a wooden stick, and a smooth glass marble. None of them moved at all. “A magnet pulls only certain metals,” said Madam Salamatu. “Even shiny aluminium foil does not stick to it.”', 'Zaara holds the magnet near a yellow pencil, green leaf, blue plastic spoon, small wooden stick, glass marble, and piece of foil resting motionless on the desk.'),
      pg('📄', 'Then Zaara placed a sheet of paper over the iron nail and held the magnet just above the paper. The nail slid right along with the magnet! “Magnets can pull through thin paper,” she said happily.', 'Zaara moves the red-and-blue magnet above a plain white sheet of paper while Worla points happily at the iron nail sliding underneath.'),
      pg('↔️', 'Next, they tested two bar magnets together. When opposite ends met, they pulled close with a snap. When Worla turned one magnet around, the matching ends pushed apart. “Opposite ends pull,” said Worla, “and same ends push.”', 'Zaara and Worla holding two red-and-blue bar magnets face-to-face above their desk, feeling the invisible push between two matching red ends.'),
      pg('⚠️', 'Before collecting the magnets, Madam Salamatu shared an important safety rule. “Magnets are science tools, not toys for toddlers,” she said. “Never put a magnet near your mouth, because swallowing one is very dangerous. Always store magnets safely away from little children.”', 'Madam Salamatu carefully placing the red-and-blue magnets into a sturdy lidded storage box on her high teacher’s desk while Zaara and Worla nod attentively.'),
    ],
    activities: [
      { id: 'zm-c1', type: 'comprehension', afterPage: 2, question: 'What do the nail, paper clip, and steel pin all have in them?', options: ['Iron', 'Wood', 'Glass'], correctIndex: 0 },
      { id: 'zm-c2', type: 'comprehension', afterPage: 3, question: 'Which of these did the magnet NOT pick up?', options: ['A wooden stick', 'An iron nail', 'A steel pin'], correctIndex: 0 },
      { id: 'zm-s1', type: 'sequencing', prompt: 'Put the magnet tests in order.', items: ['Test an iron nail and a paper clip.', 'Test a pencil, a leaf, and a plastic spoon.', 'Pull a nail through a sheet of paper.', 'Test how two magnets pull and push.'] },
      { id: 'zm-voc', type: 'vocabulary', afterPage: 5, word: 'opposite', definition: 'Completely different or facing the other way.', distractors: ['Exactly the same', 'Very loud'] },
    ],
    glossary: [
      { word: 'magnet', definition: 'An object that pulls things made of iron or steel.', pages: [1, 2, 3, 4] },
      { word: 'iron', definition: 'A hard grey metal that magnets pull.', pages: [2, 4] },
      { word: 'steel', definition: 'A strong metal made mainly from iron.', pages: [2] },
    ],
    culturalNotes: ['Magnets appear in many Ghanaian classrooms and homes—for example inside refrigerator door seals and radio speakers.', 'The safety warning against putting magnets near the mouth or leaving them near toddlers is essential classroom guidance.'],
    reviewQuestions: ['Confirm that classroom paper clips and pins used in demonstrations are steel rather than brass or plastic-coated aluminium.', 'Confirm that the magnet safety message is clear, calm, and age-appropriate.'],
    guide: {
      overview: 'A hands-on classroom magnet investigation showing that magnets attract iron and steel, leave non-magnetic materials unmoved, act through thin paper, and either attract or repel another magnet.',
      lessonMinutes: 30, goals: ['Sort everyday objects into magnetic and non-magnetic.', 'Demonstrate that opposite magnet ends pull together and matching ends push apart.', 'State why magnets must never go near the mouth or small children.'],
      subjects: [['Integrated Science', 'Forces and magnets'], ['English Language', 'Recording investigation results']],
      before: ['Hold up a magnet and ask learners to predict which items on your table it will pick up.'], during: ['Pause on page 3 to emphasize that not every shiny metal is magnetic (for example, aluminium foil).'],
      after: ['Test eight safe classroom objects in pairs and draw them in two picture columns.', 'Count how many magnets the teacher hands out and count them all back into the storage box.'],
      discussion: ['Do magnets attract every metal?', 'Why do we count and lock away magnets after science class?'], reflection: ['How do you help keep science tools safe in your classroom?'],
      support: ['Provide four safe test items per group and sort them onto two coloured trays.'], stretch: ['Predict first, then test whether a magnet can pull a paper clip through card, cloth, and a thin book.'],
      localise: ['Point out everyday magnets in radio speakers, handbag clasps, and fridge doors.', 'Always store strong magnets out of reach of younger siblings and toddlers.'],
      factCheck: [{ claim: 'Magnets attract iron and steel rather than aluminium, wood, plastic, or glass, and opposite poles attract while like poles repel.', explanation: 'Ferromagnetic metals such as iron and steel respond strongly to magnetic fields, whereas everyday aluminium, wood, plastic, and glass do not.', reference: 'NaCCA Ghana Primary Integrated Science Curriculum (Forces and Magnets)' }],
    },
  }),

  // 4
  mk({
    key: 'adoley-and-the-racing-heart',
    title: 'Adoley and the Racing Heart',
    summary: 'After running on the spot for one minute, Adoley wonders why her heart is racing. Her PE teacher explains how the heart, lungs, and muscles work together during exercise.',
    classIds: ['primary-2', 'primary-3'], ageMin: 7, ageMax: 9, readingLevel: 'developing', difficulty: 2,
    genres: ['science', 'school-life', 'educational'], themes: ['school', 'health-and-wellbeing'], objectives: ['scientific-curiosity', 'reasoning', 'responsibility', 'reading-comprehension'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Brisk during the run, calm in the explanations', palette: ['#ef4444', '#0ea5e9'],
    voice: 'A lively girl’s voice for Adoley; a warm, clear PE teacher’s voice for Mr Kotei',
    characters: [
      'Adoley: an energetic nine-year-old Ghanaian girl with neat cornrows, wearing a bright red-and-gold school PE T-shirt, navy athletic shorts, and white trainers.',
      'Mr Kotei: her warm, athletic Ghanaian PE teacher wearing a royal-blue tracksuit with white stripes, trainers, and a silver whistle on a neck cord.',
    ],
    music: 'A steady drum that speeds up during the run and slows down at rest (placeholder)',
    pages: [
      pg('💓', 'During Physical Education on the school field, Mr Kotei asked the class to place one hand over their chests. “Stand still and feel your heartbeat,” he said. Adoley felt a calm, steady beat: thump, thump, thump.', 'On a sunny grassy Ghanaian school field, Adoley and her classmates in red-and-gold PE kit stand calmly with one hand over their chests as Mr Kotei demonstrates.'),
      pg('🏃', '“Now run on the spot for one full minute!” called Mr Kotei. Adoley pumped her arms and knees as briskly as she could. When the whistle blew to stop, her chest rose and fell rapidly. Her heart was thumping fast, and she was breathing hard.', 'Adoley running energetically on the spot with knees high on the school field while Mr Kotei times the class with his whistle ready.'),
      pg('❓', '“Why is my heart racing?” Adoley asked. “When you run, your leg muscles work hard and need extra oxygen,” explained Mr Kotei. “Your lungs breathe faster to take in fresh air, and your heart pumps faster to carry oxygen in your blood to those muscles.”', 'Mr Kotei placing one hand over his chest and gesturing kindly toward his legs as he explains how lungs, heart, and muscles work together to curious Adoley.'),
      pg('🪑', 'The class sat together in the shade of a mango tree to rest. After a few quiet minutes, Adoley checked her heartbeat again; it had slowed right down. “It is steady again,” she smiled. “Yes,” said Mr Kotei. “Your body adjusts to what you need.”', 'Under the cool shade of a large mango tree by the field, Adoley and her classmates sit resting on the grass with a hand over her calm chest.'),
      pg('🏅', '“Running, skipping, and active games help your heart and muscles grow strong,” said Mr Kotei. “School-age children need about an hour of active play every day, and plenty of clean water to drink.”', 'Cheerful schoolyard scene where pupils skip with ropes, pass a football, and drink clean water from reusable bottles.'),
      pg('🛑', '“However, if you ever feel dizzy, have pain in your chest, or struggle to breathe, stop right away and tell a grown-up,” Mr Kotei added. Adoley nodded. She decided to skip with her rope for ten minutes every evening.', 'Adoley holding a colourful skipping rope and nodding attentively to Mr Kotei beside the school veranda.'),
    ],
    activities: [
      { id: 'ar-c1', type: 'comprehension', afterPage: 3, question: 'Why does the heart beat faster when we run?', options: ['Our working muscles need more oxygen', 'The heart wants to sleep', 'The wind pushes it'], correctIndex: 0 },
      { id: 'ar-c2', type: 'comprehension', afterPage: 6, question: 'What should you do at once if you feel dizzy or have chest pain during play?', options: ['Stop and tell a grown-up', 'Run even faster', 'Keep it a secret'], correctIndex: 0 },
      { id: 'ar-s1', type: 'sequencing', prompt: 'Put the PE investigation in order.', items: ['Adoley feels her steady heartbeat at rest.', 'She runs on the spot for one minute.', 'Her heart and breathing speed up.', 'She rests in the shade and her heartbeat slows down.'] },
      { id: 'ar-voc', type: 'vocabulary', afterPage: 3, word: 'oxygen', definition: 'A gas in the air that our bodies need to live and move.', distractors: ['A kind of snack', 'A loud whistle'] },
    ],
    glossary: [
      { word: 'heartbeat', definition: 'The steady thump you feel when your heart pumps blood.', pages: [1, 4] },
      { word: 'oxygen', definition: 'A gas in the air that our bodies need.', pages: [3] },
      { word: 'muscles', definition: 'Parts of the body that pull on bones to help us move.', pages: [3, 5] },
    ],
    culturalNotes: ['PE lessons, ampe, skipping, and football are part of everyday school life across Ghana.', 'World Health Organization guidelines recommend an average of 60 minutes per day of moderate-to-vigorous physical activity for children and adolescents aged 5–17.'],
    reviewQuestions: ['Confirm the grade-level clarity of how lungs, blood, heart, and muscles work together during exercise.', 'Confirm the 60-minute daily physical activity recommendation with Ghana Health Service / WHO guidance.'],
    guide: {
      overview: 'An active science story connecting Physical Education with how the heart, lungs, and muscles work together, paired with hydration and safety awareness.',
      lessonMinutes: 30, goals: ['Explain why breathing and heart rate speed up during exercise.', 'Name the roles of the lungs, heart, and muscles.', 'State two safety habits for active play (drinking water and stopping if dizzy or in pain).'],
      subjects: [['Integrated Science', 'Human body systems'], ['Physical Education', 'Active living and safety'], ['Mathematics', 'Counting beats and comparing numbers']],
      before: ['Have learners sit quietly, place a hand on their chest or wrist, and notice their resting beat.'], during: ['Pause on page 3 so pairs can retell the air-to-lungs-to-heart-to-muscles link in their own words.'],
      after: ['March or jog gently on the spot for 30–60 seconds (for learners who are well) and compare resting vs. active heartbeats.', 'List three favourite active games that keep our hearts strong.'],
      discussion: ['Why did Adoley’s heartbeat slow down again in the shade?', 'Why is drinking clean water important when we play in warm weather?'], reflection: ['Which active game will you play for movement today?'],
      maths: [{ task: 'Suppose a resting pulse is 20 beats in 15 seconds. Multiply by 4 to find beats in 1 minute.', answer: '80 beats per minute' }, { task: 'Suppose a pulse is 80 beats per minute at rest and 120 after running. How many more beats per minute is that?', answer: '40 more beats per minute' }],
      support: ['Tap a slow desk beat for rest and a quicker beat for running so learners can hear the difference.'], stretch: ['Write three sentences explaining how oxygen reaches leg muscles during a football match.'],
      localise: ['Include local games such as ampe, pilolo, skipping, and football.', 'Excuse any unwell learner from vigorous movement and remind all pupils to report dizziness immediately.'],
      factCheck: [{ claim: 'School-age children need about 60 minutes of active physical play each day, and heart and breathing rates rise during exercise to deliver oxygen to working muscles.', explanation: 'Active muscles consume oxygen faster, prompting faster breathing and cardiac output; daily moderate-to-vigorous movement strengthens cardiovascular health.', reference: 'World Health Organization (2020) Guidelines on Physical Activity and Sedentary Behaviour (ages 5–17)' }],
    },
  }),

  // 5
  mk({
    key: 'ohenewaa-and-the-sleepy-morning',
    title: 'Ohenewaa and the Sleepy Morning',
    summary: 'Ohenewaa stays up too late and feels tired and cross at school. With Mama’s help, she builds a calm bedtime routine and learns why sleep helps us learn, grow, and be kind.',
    classIds: ['kg-2', 'primary-1'], ageMin: 5, ageMax: 7, readingLevel: 'early', difficulty: 1,
    genres: ['educational', 'family', 'school-life'], themes: ['family', 'school', 'health-and-wellbeing'], objectives: ['responsibility', 'emotional-intelligence', 'scientific-curiosity', 'vocabulary'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Heavy and yawning at the start, bright at the end', palette: ['#4338ca', '#fde68a'],
    voice: 'A yawning, grumpy voice at first for Ohenewaa; a bright voice at the end; a kind voice for Mama and Madam Salamatu',
    characters: [
      'Ohenewaa: a sweet six-year-old Ghanaian girl with two neat braided puffs, wearing a lavender-and-yellow school dress by day and soft yellow pyjamas at bedtime.',
      'Mama: her caring Ghanaian mother wearing an indigo-and-gold African-print wrapper cloth and matching headwrap.',
      'Madam Salamatu: her gentle class teacher in a bright emerald-and-gold patterned dress.',
    ],
    music: 'A slow, sleepy lullaby tune that brightens in the morning (placeholder)',
    pages: [
      pg('🥱', 'One night, Ohenewaa stayed up much too late watching a film. In the morning, Mama called gently, “Wake up, Ohenewaa!” Her eyelids felt heavy, and she yawned all the way to school.', 'Sleepy little Ohenewaa in her lavender-and-yellow school dress rubbing her eyes and yawning wide as she walks along a sunny morning path beside Mama.'),
      pg('😠', 'In class, Ohenewaa could not remember the new letter sounds. When her friend leaned over to ask a question, Ohenewaa answered crossly, “Leave me alone!” Almost at once, she felt sorry.', 'At a wooden classroom desk, tired Ohenewaa frowns with her chin in her hand while her classmate looks hurt beside her.'),
      pg('💭', 'Madam Salamatu knelt beside her desk and asked softly, “Did you sleep well last night?” Ohenewaa shook her head. “Sleep is when your body rests and grows,” said Madam Salamatu, “and when your brain stores what you have learned.”', 'Kind Madam Salamatu kneeling beside Ohenewaa’s desk and speaking gently with a warm, reassuring smile.'),
      pg('🌙', 'That evening, Ohenewaa and Mama planned a calm bedtime routine: eat supper early, switch screens off, wash, brush teeth, share a short story, and turn lights out at the same time each night. School-age children need about nine to twelve hours of sleep.', 'Cosy Ghanaian bedroom at evening where Ohenewaa in soft yellow pyjamas sits happily on her bed while Mama reads a picture book beside a warm bedside lamp.'),
      pg('☀️', 'The next morning, Ohenewaa woke up bright and refreshed. In class, she remembered her letter sounds and clapped happily as she sang with her friends. She felt cheerful and strong.', 'Radiant, well-rested Ohenewaa clapping and singing joyfully alongside her smiling classmates in the bright morning classroom.'),
      pg('😴', 'After school, Ohenewaa hugged her little cousin and said, “A good sleep helps us learn, helps us grow, and helps us be kind.” Her cousin gave a big yawn. “Then I should go to bed early too!” Everyone laughed.', 'On the sunny family veranda, cheerful Ohenewaa hugs her yawning little cousin while Mama laughs warmly nearby.'),
    ],
    activities: [
      { id: 'os-c1', type: 'comprehension', afterPage: 3, question: 'What does sleep help our body and brain do?', options: ['Rest, grow, and store what we learn', 'Stay awake all night', 'Forget our friends'], correctIndex: 0 },
      { id: 'os-c2', type: 'comprehension', afterPage: 4, question: 'What did Ohenewaa and Mama plan for the evening?', options: ['A calm bedtime routine at the same time each night', 'Watching another late film', 'Skipping supper'], correctIndex: 0 },
      { id: 'os-s1', type: 'sequencing', prompt: 'Put Ohenewaa’s bedtime routine in order.', items: ['Eat supper early and switch screens off.', 'Wash and brush teeth.', 'Share a short bedtime story.', 'Turn lights out for sleep.'] },
      { id: 'os-sel', type: 'sel', afterPage: 6, prompt: 'How do you feel in the morning after a good night’s sleep?', feelingOptions: ['Rested', 'Happy', 'Strong', 'Kind'] },
    ],
    glossary: [
      { word: 'yawned', definition: 'Opened the mouth wide and breathed in deeply because of tiredness.', pages: [1] },
      { word: 'sleep', definition: 'The quiet rest at night when the body and brain recover and grow.', pages: [3, 4, 6] },
      { word: 'routine', definition: 'Helpful steps we follow in the same order each day.', pages: [4] },
    ],
    culturalNotes: ['Many Ghanaian households share evening routines together; the story models gentle adult guidance without shaming a tired child.', 'The American Academy of Sleep Medicine (via CDC Healthy Schools) recommends 9–12 hours of sleep per 24 hours for children aged 6–12 (and 10–13 hours including naps for ages 3–5), along with consistent bedtimes and turning screens off before bed.'],
    reviewQuestions: ['Verify that the 9–12 hours sleep guidance for school-age children (6–12 years) aligns with health guidance.', 'Confirm that the tone remains warm and supportive for families sharing sleeping spaces.'],
    guide: {
      overview: 'A warm, relatable story for young learners showing how enough sleep supports memory, growth, and kindness, and modelling a simple screen-free bedtime routine.',
      lessonMinutes: 20, goals: ['Give three reasons why sleep is important.', 'Order four steps of a healthy bedtime routine.', 'Choose one calm habit to practise before bed tonight.'],
      subjects: [['Our World Our People', 'Healthy daily habits'], ['Integrated Science', 'Keeping the body healthy']],
      before: ['Ask: how does your body feel in the morning when you go to bed early versus very late?'], during: ['Let learners stretch and pretend to yawn on page 1, then sit tall and smile brightly on page 5.'],
      after: ['Draw four small pictures showing your own evening bedtime routine.', 'Share your favourite bedtime story or lullaby from home.'],
      discussion: ['Why was Ohenewaa cross with her friend on page 2?', 'How did switching screens off early help her?'], reflection: ['What is one calm thing you can do before bed tonight?'],
      support: ['Sequence four picture cards: supper, toothbrushing, story, sleep.'], stretch: ['Tell a younger sibling or cousin three reasons why our brains love sleep.'],
      localise: ['Include familiar evening habits such as bathing with warm water, family prayers or songs, and oral stories.', 'Be sensitive to children who share rooms and do not set household light times alone.'],
      factCheck: [{ claim: 'School-age children aged 6–12 need about 9 to 12 hours of sleep per night.', explanation: 'Adequate nightly sleep supports physical growth, emotional regulation, attention, and memory consolidation in school-age learners.', reference: 'American Academy of Sleep Medicine / CDC Healthy Schools Sleep Guidelines (ages 6–12: 9–12 hours; ages 3–5: 10–13 hours)' }],
    },
  }),

  // 6
  mk({
    key: 'akrofi-and-the-sugar-test',
    title: 'Akrofi and the Sugar Test',
    summary: 'Akrofi wants to know whether sugar dissolves faster in warm or cold water. When his first test is unfair, he learns to change only one thing at a time and repeat his test.',
    classIds: ['primary-3', 'primary-4'], ageMin: 8, ageMax: 10, readingLevel: 'developing', difficulty: 3,
    genres: ['science', 'school-life', 'educational'], themes: ['school', 'friendship'], objectives: ['scientific-curiosity', 'reasoning', 'problem-solving', 'perseverance'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Thoughtful and clear, with a pause at each step', palette: ['#0d9488', '#f59e0b'],
    voice: 'A curious voice for Akrofi; a patient, clear teacher voice for Madam Salamatu; a friendly voice for Lekettey',
    characters: [
      'Akrofi: a curious nine-year-old Ghanaian boy with short neat hair, wearing a teal-and-khaki primary uniform shirt and khaki shorts, with a notebook and pencil.',
      'Lekettey: his friendly nine-year-old classmate in a matching uniform shirt, wearing a simple black wristwatch.',
      'Madam Salamatu: their encouraging science teacher in an emerald-and-gold African-print dress.',
    ],
    music: 'A light, curious tune with a ticking clock (placeholder)',
    pages: [
      pg('❓', 'During science class, Akrofi asked, “Does sugar dissolve faster in warm water or in cold water?” Madam Salamatu smiled. “That is a great question to investigate, Akrofi. Let us test it—and make sure our test is fair.”', 'At a science table with two clear cups, Akrofi looks curiously toward Madam Salamatu while Lekettey stands beside him.'),
      pg('🥄', 'Akrofi’s first try was not fair. He put a heaped spoonful of sugar into warm water and a tiny pinch into cold water, and he stirred only the warm cup for a long time. “The sugar in the warm cup vanished first,” he said, “yet I cannot tell why.”', 'Akrofi stirring a cup of water vigorously while a heaped spoon, a tiny pinch of sugar, and an unstirred second cup sit unevenly on the desk.'),
      pg('☝️', 'Madam Salamatu held up one finger. “You changed three things at once: the amount of sugar, the stirring, and the warmth of the water,” she explained. “In a fair test, we change only one thing and keep everything else the same.”', 'Madam Salamatu smiling kindly and holding up exactly one index finger as Akrofi and Lekettey listen closely.'),
      pg('🧪', 'Akrofi tried again carefully. He poured the exact same amount of water into two matching clear cups—one with warm tap water and one with cold water. He added one level spoonful of sugar to each cup and stirred both ten times while Lekettey timed them with his watch.', 'Akrofi measuring two identical clear cups of water with equal level spoons of sugar while Lekettey checks his wristwatch beside him.'),
      pg('🔁', 'The sugar in the warm tap water disappeared first. Akrofi did the exact same test three times, and the warm cup won every single time. “Repeating a test makes us much more sure of our answer,” said Madam Salamatu.', 'On the classroom table stand three neat pairs of matching clear cups, with Akrofi and Lekettey smiling as Madam Salamatu nods approvingly.'),
      pg('📝', 'In his notebook, Akrofi recorded that sugar dissolves faster in warm water than in cold water. “My first try did not work,” he smiled, “yet it taught me how to do a fair test!” Remember: children use warm tap water, and hot water is only for adults.', 'Akrofi writing neatly with his pencil in an unlabelled open notebook at his desk, beaming with pride beside Lekettey.'),
    ],
    activities: [
      { id: 'as-c1', type: 'comprehension', afterPage: 3, question: 'Why was Akrofi’s first test unfair?', options: ['He changed three things at once', 'He used clear cups', 'Lekettey wore a watch'], correctIndex: 0 },
      { id: 'as-c2', type: 'comprehension', afterPage: 5, question: 'Why did Akrofi do the fair test three times?', options: ['Repeating a test makes us more sure', 'He forgot what happened', 'He wanted to spill the water'], correctIndex: 0 },
      { id: 'as-s1', type: 'sequencing', prompt: 'Put the steps of a fair test in order.', items: ['Ask a clear question.', 'Change only one thing.', 'Keep everything else the same.', 'Repeat the test and record the result.'] },
      { id: 'as-voc', type: 'vocabulary', afterPage: 1, word: 'dissolve', definition: 'To mix completely into a liquid until the grains can no longer be seen.', distractors: ['To freeze into ice', 'To float on top'] },
    ],
    glossary: [
      { word: 'dissolve', definition: 'To mix completely into a liquid until you can no longer see it.', pages: [1] },
      { word: 'fair', definition: 'Done properly by changing only one thing and keeping everything else equal.', pages: [1, 2, 3, 6] },
      { word: 'repeating', definition: 'Doing an investigation again in the exact same way to check the result.', pages: [5] },
    ],
    culturalNotes: ['Everyday materials such as sugar, salt, spoons, and clear cups make fair-test investigations practical in any Ghanaian classroom.', 'Safety rule: pupils use safe warm tap water or sun-warmed water; boiling or very hot water is handled only by adults.'],
    reviewQuestions: ['Check the science: equal amounts of sugar with equal stirring dissolve faster in warmer water than in colder water.', 'Verify that the safety reminder restricting hot water to adults is prominent.'],
    guide: {
      overview: 'An inquiry-science story introducing controlled (“fair”) testing and repeatability, while showing learners that an imperfect first try is a valuable step in scientific thinking.',
      lessonMinutes: 40, goals: ['Explain why changing three things at once makes a test unfair.', 'Identify the one variable changed and the variables kept the same.', 'Carry out and repeat a safe dissolving test using warm and cold tap water.'],
      subjects: [['Integrated Science', 'Scientific investigation and dissolving'], ['English Language', 'Recording conclusions clearly']],
      before: ['Ask: if two runners start at different places, is the race fair? Connect that idea to a science test.'], during: ['Pause after page 2 and let learners spot all three mistakes in Akrofi’s first test before turning to page 3.'],
      after: ['Run the two-cup sugar test in groups using safe warm tap water and cool water.', 'Complete the sentence frame: “We changed ___. We kept ___ and ___ the same.”'],
      discussion: ['Why was Akrofi’s first mistake actually helpful?', 'Why do scientists test three times instead of stopping after one try?'], reflection: ['Tell about a time when a mistake helped you do something better on your second try.'],
      maths: [{ task: 'Akrofi repeated the two-cup test 3 times, using 1 level spoon of sugar per cup each time. How many level spoons of sugar did he use in all?', answer: '6 spoons (2 cups × 3 trials)' }, { task: 'If the warm cup dissolved sugar in 25 seconds and the cold cup took 45 seconds (suppose), how many seconds faster was the warm cup?', answer: '20 seconds faster' }],
      support: ['Provide a three-box planning card: Change ONE thing / Keep the SAME / Measure.'], stretch: ['Design a fair test to find out whether fine salt or coarse salt dissolves faster in room-temperature water.'],
      localise: ['Use granulated sugar or salt and clear reusable plastic cups.', 'Never allow pupils to pour or carry boiling water; use warm tap or sun-warmed water only.'],
      factCheck: [{ claim: 'Sugar dissolves faster in warm water than in cold water when all other variables are kept constant.', explanation: 'Higher water temperature increases molecular motion and collision frequency, speeding up the rate of dissolving in a controlled fair test.', reference: 'NaCCA Ghana Upper Primary Integrated Science Curriculum (Mixtures, Dissolving, and Fair Testing)' }],
    },
  }),

  // 7
  mk({
    key: 'lekettey-and-the-kite-tin',
    title: 'Lekettey and the Kite Tin',
    summary: 'Lekettey wants a new kite. With his grandmother’s guidance, he tells needs from wants, earns small Saturday rewards for extra chores, saves in a tin, and reaches his goal. All prices are supposed numbers for learning.',
    classIds: ['primary-2', 'primary-3', 'primary-4'], ageMin: 7, ageMax: 10, readingLevel: 'developing', difficulty: 2,
    genres: ['realistic-fiction', 'educational', 'family'], themes: ['family', 'community', 'food'], objectives: ['financial-literacy', 'perseverance', 'responsibility', 'reasoning'],
    ghanaianContext: 'central', culturalTags: ['local-names', 'market'], wpm: 90, paceWord: 'Warm and steady, with a clear count on page 4', palette: ['#16a34a', '#f59e0b'],
    voice: 'A hopeful boy’s voice for Lekettey; a wise, warm voice for his grandmother',
    characters: [
      'Lekettey: a cheerful nine-year-old Ghanaian boy with short hair, wearing a bright green polo shirt, brown shorts, and sandals.',
      'Grandmother: his loving older Ghanaian grandmother wearing a gold-and-green African-print wrapper cloth and matching headscarf.',
      'Shopkeeper: a friendly Ghanaian market stallholder standing beside colourful diamond kites.',
    ],
    music: 'A light coin-jingle tune with a steady beat (placeholder)',
    pages: [
      pg('🪁', 'Lekettey admired a bright kite at a neighbourhood stall. “Suppose it costs ten cedis,” he told his grandmother, “and I have no money.” “Then let us make a plan,” she said. “First, is a kite a need or a want?” Lekettey thought carefully. “It is a want.”', 'Lekettey and his grandmother standing beside a cheerful market stall looking up at colourful diamond kites hanging under the shade roof.'),
      pg('🧹', 'Grandmother nodded. “Needs come first, while wants can wait. Suppose I give you two cedis each Saturday when you finish extra jobs at home.” Lekettey gladly agreed to sweep the compound and wash the bowls.', 'In a sunny Ghanaian courtyard, Lekettey sweeps neatly with a traditional broom while his grandmother watches with a warm, encouraging nod.'),
      pg('🥫', 'Together they cleaned an empty tin with a lid, and Grandmother safely made a narrow slot in the top. Each Saturday, Lekettey dropped his two cedis inside. Once, he passed a sweet stall and wanted to spend a coin, yet he asked himself, “Is a sweet worth delaying my kite?” He kept his savings safe.', 'Inside his tidy room, Lekettey drops shiny coins into a clean slotted tin on a wooden shelf, smiling with quiet determination.'),
      pg('🔢', 'After five Saturdays, Lekettey opened the tin at the table with Grandmother and counted his coins in twos: “Two, four, six, eight, ten—ten cedis!” He had reached his goal.', 'At a wooden table beside Grandmother, Lekettey points happily at five neat pairs of coins arranged in a row.'),
      pg('🛍️', 'Back at the stall, the kite cost ten cedis, just as Lekettey had supposed. He paid with his own saved coins and held the kite proudly. Grandmother smiled. “You worked steadily and you waited patiently,” she said. “That is how savings grow.”', 'Lekettey handing his coins to the smiling shopkeeper and holding his bright green-and-gold diamond kite while Grandmother beams.'),
      pg('🎯', 'Lekettey had learned four helpful steps: set a goal, make a plan, save a little at a time, and wait patiently. As he set up a tin for his next goal, Grandmother added, “A trusted adult or a bank can also keep savings safe—we can ask about that together.”', 'On a breezy open hill, Lekettey holds his colourful kite and a fresh saving tin while his grandmother stands proudly beside him.'),
    ],
    activities: [
      { id: 'lk-c1', type: 'comprehension', afterPage: 2, question: 'What is the difference between a need and a want?', options: ['A need is essential for living; a want is nice to have and can wait', 'They mean the exact same thing', 'Wants must always come before food and water'], correctIndex: 0 },
      { id: 'lk-c2', type: 'comprehension', afterPage: 4, question: 'How many Saturdays did it take Lekettey to save ten cedis at two cedis each Saturday?', options: ['Five', 'Two', 'Ten'], correctIndex: 0 },
      { id: 'lk-s1', type: 'sequencing', prompt: 'Put Lekettey’s saving journey in order.', items: ['Decide on a clear goal.', 'Make a plan to earn and save.', 'Save two cedis each Saturday without spending it.', 'Count to ten cedis and buy the kite.'] },
      { id: 'lk-voc', type: 'vocabulary', afterPage: 5, word: 'savings', definition: 'Money that you set aside safely for a future goal instead of spending right away.', distractors: ['Money that gets lost', 'Things you borrow without asking'] },
    ],
    glossary: [
      { word: 'cedis', definition: 'The unit of money used in Ghana.', pages: [1, 2, 3, 4, 5] },
      { word: 'goal', definition: 'Something specific you plan and work toward achieving.', pages: [4, 6] },
      { word: 'savings', definition: 'Money kept safely aside for later.', pages: [3, 5, 6] },
    ],
    culturalNotes: ['All cedi amounts in this story are hypothetical (“suppose”) numbers chosen for clear skip-counting in twos.', 'Many Ghanaian families teach saving with a slotted tin (“susu” box) at home before introducing formal savings accounts with a parent or guardian.', 'Lekettey’s light Saturday household chores take place safely at home with his grandmother, never as child labour.'],
    reviewQuestions: ['Confirm that the text clearly frames the prices and rewards as supposed learning numbers.', 'Confirm that no specific commercial bank or financial product is promoted.'],
    guide: {
      overview: 'A practical financial-literacy story teaching the difference between needs and wants, delayed gratification, and skip-counting in twos using hypothetical cedi amounts.',
      lessonMinutes: 30, goals: ['Distinguish everyday needs from wants.', 'Count in twos to reach a savings target.', 'Create a simple four-step saving plan for a classroom or personal goal.'],
      subjects: [['Mathematics', 'Skip-counting in twos and simple division'], ['Our World Our People', 'Responsible choices and saving']],
      before: ['Name four everyday items (water, school shoes, a kite, sweets) and ask learners which are needs and which are wants.'], during: ['Chant the skip-count “Two, four, six, eight, ten!” together on page 4.'],
      after: ['Draw a simple goal card showing a goal picture, a supposed cost, weekly savings, and number of weeks.', 'Act out the moment Lekettey chooses his long-term goal over an impulse sweet.'],
      discussion: ['Why did Lekettey decide not to buy the sweet on page 3?', 'Why does Grandmother say needs come before wants?'], reflection: ['What is one goal—in learning, sport, or saving—that is worth waiting and working for?'],
      maths: [{ task: 'Suppose a storybook costs 12 cedis and you save 3 cedis each week. How many weeks will it take?', answer: '4 weeks' }, { task: 'Count in twos from 2 to 10. How many pairs of two make 10?', answer: '5 pairs' }],
      support: ['Use ten bottle tops arranged in five pairs so learners can touch and count in twos.'], stretch: ['Plan two different weekly saving schedules for a supposed 20-cedi football (for example, 4 cedis vs. 5 cedis a week).'],
      localise: ['Relate the tin to familiar family susu boxes while reminding pupils that real money decisions always involve parents or guardians.'],
    },
  }),

  // 8
  mk({
    key: 'zaara-and-akrofi-share-the-poster',
    title: 'Zaara and Akrofi Share the Poster',
    summary: 'Zaara and Akrofi want different colours for their plant poster. By stopping, breathing, sharing feelings calmly, and listening, they find a solution that includes both ideas.',
    classIds: ['primary-1', 'primary-2', 'primary-3'], ageMin: 6, ageMax: 9, readingLevel: 'early', difficulty: 2,
    genres: ['school-life', 'friendship', 'realistic-fiction'], themes: ['school', 'friendship', 'citizenship'], objectives: ['emotional-intelligence', 'teamwork', 'problem-solving', 'kindness'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Quick at the start, then calm, steady, and warm', palette: ['#16a34a', '#2563eb'],
    voice: 'Lively at the start; calm and clear during the peace-making; a warm teacher voice for Madam Salamatu',
    characters: [
      'Zaara: an eight-year-old Ghanaian girl in a blue-and-yellow school uniform and tidy white headscarf, holding a blue colouring marker.',
      'Akrofi: her nine-year-old classmate in a matching yellow uniform shirt and blue shorts, holding a green colouring marker.',
      'Madam Salamatu: their kind class teacher in an emerald-and-gold African-print dress.',
    ],
    music: 'Two lively tunes that merge into one calm tune (placeholder)',
    pages: [
      pg('🎨', 'Zaara and Akrofi were drawing a science poster about plants. “We must use green!” said Akrofi. “No, blue!” said Zaara. Their voices grew louder and louder until classmates nearby stopped working to stare.', 'At a shared classroom table, Akrofi holds up a green marker and Zaara holds up a blue marker with cross faces over a large blank sheet of paper while classmates look over.'),
      pg('🌬️', 'Zaara stopped. She closed her eyes, took a slow, deep breath, and counted to five. “I feel cross,” she thought, “yet shouting will not help.” Her heart slowed down, and her mind felt clearer.', 'Close view of Zaara with her eyes gently closed and one hand resting calmly over her chest as she takes a slow, steadying breath.'),
      pg('🗣️', 'Calmly, she said, “Akrofi, I feel upset when we both shout. I would like us to listen to each other.” Akrofi blinked in surprise; he had expected more shouting. Slowly, he lowered his shoulders and nodded.', 'Zaara speaking calmly with open hands to Akrofi across the poster paper while Akrofi lowers his marker and nods thoughtfully.'),
      pg('👂', 'Zaara listened carefully first. “I chose green because leaves and stems are green,” explained Akrofi. Then Akrofi listened. “I chose blue because rain and rivers give plants water,” said Zaara. Both reasons were good.', 'Akrofi and Zaara leaning across their desk in friendly conversation, listening respectfully to each other’s ideas.'),
      pg('💡', 'They thought of three choices: green only, blue only, or using both colours together. Smiling, they chose both—Akrofi drew lush green leaves and stems, while Zaara added bright blue raindrops and a flowing stream.', 'Overhead classroom view of Zaara and Akrofi happily colouring one vibrant picture-only plant drawing together with green leaves and blue raindrops.'),
      pg('🙌', 'Madam Salamatu smiled proudly as they hung their artwork on the wall. “You solved that wisely,” she said. “Whenever we disagree, we can stop, breathe, say how we feel, listen, think of choices, and choose together.”', 'Zaara and Akrofi smiling side by side beside their colourful plant artwork on the classroom wall while Madam Salamatu applauds warmly.'),
    ],
    activities: [
      { id: 'zp-c1', type: 'comprehension', afterPage: 2, question: 'What did Zaara do first to calm down?', options: ['Stopped, breathed slowly, and counted to five', 'Shouted even louder', 'Tore the paper'], correctIndex: 0 },
      { id: 'zp-c2', type: 'comprehension', afterPage: 5, question: 'How did Zaara and Akrofi settle their disagreement?', options: ['They combined both colours fairly', 'Zaara gave up completely', 'Akrofi walked out'], correctIndex: 0 },
      { id: 'zp-s1', type: 'sequencing', prompt: 'Put the peace-making steps in order.', items: ['Stop and take a slow breath.', 'Say how you feel without shouting.', 'Listen carefully to the other person.', 'Think of choices and choose together.'] },
      { id: 'zp-sel', type: 'sel', afterPage: 6, prompt: 'How do you feel when you and a friend solve a disagreement kindly?', feelingOptions: ['Proud', 'Calm', 'Friendly', 'Relieved'] },
    ],
    glossary: [
      { word: 'poster', definition: 'A large picture sheet made to share an idea on a wall.', pages: [1] },
      { word: 'disagree', definition: 'To hold a different idea or wish from someone else.', pages: [6] },
      { word: 'listen', definition: 'To pay quiet, careful attention to what someone is saying.', pages: [3, 6] },
    ],
    culturalNotes: ['Group work and shared art supplies are everyday parts of Ghanaian classrooms; learning calm conflict resolution helps every child feel heard without one child always giving way.', 'The six peace-making steps work in English and in every local Ghanaian language.'],
    reviewQuestions: ['Confirm that neither child is forced to surrender their idea unfairly and that both contributions are valued.', 'Confirm that the “I feel … when …” phrasing sounds natural for Primary 1–3 learners.'],
    guide: {
      overview: 'A social-emotional classroom story teaching six practical steps for resolving everyday peer disagreements fairly: stop, breathe, say how you feel, listen, think of choices, and choose together.',
      lessonMinutes: 25, goals: ['Name the six steps for settling a disagreement calmly.', 'Practise using a calm “I feel … when …” sentence.', 'Work with a partner to combine two ideas fairly.'],
      subjects: [['Our World Our People', 'Peaceful living and cooperation'], ['English Language', 'Speaking, listening, and polite expression']],
      before: ['Ask: have you and a friend ever wanted to play two different games at break time? What happened?'], during: ['Practise taking one slow breath and counting silently to five together on page 2.'],
      after: ['Role-play a calm disagreement over sharing crayons or choosing a game using the six steps.', 'Create a shared pair drawing where each partner chooses one colour and explains why.'],
      discussion: ['Why did shouting stop Zaara and Akrofi from hearing each other’s good reasons?', 'How did using both colours make their plant picture even better scientifically?'], reflection: ['Which step—stopping to breathe or listening first—will help you most this week?'],
      support: ['Display six simple gesture cues (hand up to stop, deep breath, hand on heart, hand by ear, thinking finger, handshake).'], stretch: ['Write a four-line dialogue showing two friends solving a disagreement on the football pitch.'],
      localise: ['Practise polite peace-making phrases in learners’ home languages alongside English.', 'Remind learners to ask a teacher or trusted adult immediately if anyone is being hurt or bullied.'],
    },
  }),
];
