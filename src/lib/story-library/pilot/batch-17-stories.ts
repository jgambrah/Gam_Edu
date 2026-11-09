/**
 * Batch 17: Ghana's history and heritage, told as eight stories about where our peoples and places come from:
 * Elmina Castle, Cape Coast Castle, the Ewe exodus from Notsé, Homowo of the Ga, the Asante union, the origins of
 * Dagbon, Bono Manso, and the flag and independence of 1957.
 *
 * Rules: as Batches 13 to 15. Every sentence is original. Facts are paraphrased from the sources named in each
 * story's fact-check list. Where sources disagree on a date, the story shows the competing dates as claims and does
 * not choose one. Oral traditions are labelled as traditions ("people say", "the drummers tell"), never as settled
 * facts. Stories about peoples and sacred matters (Ewe, Ga, Asante, Dagbon, Bono) are flagged for review by those
 * communities before release. The stories about the trade in enslaved people are written with dignity, avoid graphic
 * detail and carry a teacher note on handling the subject with care. All stories are drafts awaiting review.
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

export const BATCH_17_STORIES: PilotStory[] = [

  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-castle-built-for-gold',
    title: 'The Castle Built for Gold',
    summary: 'Maaya and Paa visit Elmina Castle with their teacher. They learn why the Portuguese built it in 1482, how it changed hands, what it became, which dates historians still argue about, and why Ghana keeps it today.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2'],
    ageMin: 11,
    ageMax: 14,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['historical', 'informational', 'educational'],
    themes: ['community', 'identity', 'citizenship'],
    objectives: ['cultural-heritage', 'critical-thinking', 'reasoning', 'respect'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Steady and clear, slower on the hard part of the story',
    palette: ['#1d4ed8', '#e5e7eb'],
    voice: 'Calm, clear storyteller voice; Madam Ankrah is warm and exact',
    characters: [
      'Maaya: a 13-year-old girl in a school uniform, with a notebook and pencil.',
      'Paa: her classmate, 13, in a white shirt and navy shorts, always asking questions.',
      'Madam Ankrah: their history teacher, in a green dress, carrying a folder of maps.',
      'Elmina Castle: a large white fort beside the blue sea, with palm trees and fishing boats nearby.',
    ],
    music: 'Gentle waves and a slow, low drum; a quiet, respectful tune for the hard part (placeholder)',
    pages: [
      pg('🏰', 'Maaya pressed her face to the bus window. The sea flashed blue between the palm trees, and then a huge white fort rose up beside the road. “That is Elmina Castle,” said Madam Ankrah. “It is one of the oldest European buildings outside Europe. Today we find out why it was built here, and what it became.”', 'A school bus drives past a large white fort beside the blue sea.'),
      pg('🗺️', 'In the courtyard, Madam Ankrah showed them a map. “In 1471, Portuguese sailors reached this coast,” she said. “They heard about gold, and they came back to trade for it. People here already had gold and already knew how to trade. The Portuguese king decided to build a fort to protect his ships and his trade.”', 'A teacher points to a map of the coast while pupils look on.'),
      pg('📅', '“Their fleet arrived on 19 January 1482,” said Madam Ankrah. “Building began the next morning. A captain named Diogo de Azambuja led the fleet, and King John II of Portugal gave the order. They named it São Jorge da Mina, which means Saint George of the Mine. The town that grew beside it became known as Elmina.”', 'A drawing of ships landing and workers unloading stone near a rocky shore.'),
      pg('⚖️', '“So it was a shop with walls,” said Paa. “Partly,” said Madam Ankrah. “It stored trade goods and guarded them from rival European ships. Cloth and other goods came in, and gold went out. Then, over time, something else was traded here: people. Enslaved men, women and children were bought and sold. That is the hardest part of this story.”', 'Two pupils listen quietly as the teacher speaks with a serious face.'),
      pg('🌊', '“In 1637, Dutch forces captured the castle from the Portuguese,” said Madam Ankrah. “They had tried once before, in 1596, and failed. Under the Dutch, the castle was used to hold enslaved Africans before ships carried them across the Atlantic. The Dutch trade in enslaved people went on until 1814.” Maaya wrote the dates down carefully and underlined 1637.', 'A pupil writes dates in a notebook beside a drawing of a Dutch flag and a ship.'),
      pg('❓', '“Not every date is easy,” said Madam Ankrah. “Most books say the Dutch took the castle in 1637, but some give 1642 for the end of the whole Portuguese Gold Coast. And some historians think a young Christopher Columbus may have sailed on a Portuguese voyage in 1481. Others doubt it. When experts disagree, we say so.” Paa grinned. “Even castles have mysteries.”', 'A chart with three question marks beside the dates 1637, 1642 and 1481.'),
      pg('🏛️', 'In the evening light, the guide spoke to the class. “In 1979, UNESCO listed this castle and other forts and castles along our coast as World Heritage Sites,” he said. “Today Elmina Castle is a museum run by Ghanaians. We do not keep it because the trade was good. We keep it so that nobody forgets what happened, and so that everyone can learn the truth.”', 'A museum guide speaks to pupils in front of the white castle walls at sunset.'),
      pg('✅', 'On the bus home, Maaya did a sum. “2026 take away 1482 is 544 years,” she said. “Five hundred and forty-four years, and the walls are still here.” “Then it is our job to tell the story truthfully,” said Paa. Madam Ankrah smiled. “That is what history is for.” The end.', 'Two pupils on a bus with a notebook showing a subtraction sum, the castle fading behind.'),
    ],
    activities: [
      { id: 'elm-c1', type: 'comprehension', afterPage: 3, question: 'Why did the Portuguese king order the fort to be built?', options: ['To protect his ships and the trade in gold', 'To store fish', 'To build a school'], correctIndex: 0 },
      { id: 'elm-p1', type: 'prediction', afterPage: 4, prompt: 'The castle changed hands over time. What do you think happened to the people who ran it?', options: ['Different European powers took turns controlling it', 'The same people ran it for ever', 'It was never used'] },
      { id: 'elm-c2', type: 'comprehension', afterPage: 6, question: 'What does Madam Ankrah say we should do when experts disagree?', options: ['Say that they disagree', 'Pick the date we like best', 'Ignore the question'], correctIndex: 0 },
      { id: 'elm-voc', type: 'vocabulary', afterPage: 4, word: 'rival', definition: 'A person or group that competes with another.', distractors: ['A kind of ship', 'A type of cloth'] },
      { id: 'elm-s1', type: 'sequencing', prompt: 'Put the Elmina Castle story in order.', items: ['Portuguese sailors reached the coast in 1471.', 'Building of the castle began in January 1482.', 'Dutch forces captured the castle in 1637.', 'UNESCO listed the castle in 1979.'] },
      { id: 'elm-sel', type: 'sel', afterPage: 8, prompt: 'Some history is hard to hear. How can we learn about painful things with respect?', feelingOptions: ['Serious', 'Respectful', 'Curious', 'Thoughtful'] },
    ],
    glossary: [
      { word: 'fort', definition: 'A strong building with thick walls, used for defence.', pages: [1] },
      { word: 'rival', definition: 'Someone who competes with you.', pages: [4] },
      { word: 'enslaved', definition: 'Forced to work for others without freedom or pay.', pages: [5] },
      { word: 'museum', definition: 'A place that keeps and shows important objects and stories.', pages: [7] },
      { word: 'historians', definition: 'People who study the past.', pages: [6] },
    ],
    culturalNotes: ['Elmina Castle is a World Heritage Site and a national museum. This story uses published accounts and invented pupils and teachers.', 'The story is plain about the trade in enslaved people and avoids graphic detail. Teachers should be ready to answer questions calmly and truthfully.', 'The story shows that people on this coast were already trading gold before the Portuguese came, so that Ghanaians are not shown only as people things happened to.'],
    reviewQuestions: ['Check against named sources: Portuguese arrival in 1471; fleet arrived 19 January 1482 and building began the next day; Diogo de Azambuja; King John II; the Dutch attempt in 1596; capture in 1637; Dutch trade in enslaved people until 1814; UNESCO inscription in 1979.', 'The meaning “Saint George of the Mine” and the origin of the name “Elmina” should be confirmed against a published source before release.', 'The Columbus claim is contested and is shown as such; check the wording with a historian.', 'Ask the Ghana Museums and Monuments Board or a local guide to review the story.'],
    guide: {
      overview: 'A history story about one building and three centuries of change. It teaches that a place can have more than one purpose, that evidence has gaps, and that remembering hard history is a form of respect.',
      lessonMinutes: 50,
      goals: ['Explain why Elmina Castle was built and how its use changed.', 'Place events on a timeline and calculate time between them.', 'Explain how historians handle conflicting dates.'],
      subjects: [['Social Studies / History', 'Europeans on the Gold Coast and the trade in enslaved people'], ['Mathematics', 'Subtraction and timelines'], ['English Language', 'Reading informational text']],
      before: ['Ask: what building in your town has more than one history? Who might know it?'],
      during: ['At page 6, ask learners to list the three uncertain dates and say how they would find out more.'],
      after: ['Draw a timeline from 1471 to 2026 with the dates in the story.', 'Write three questions you would ask a museum guide.'],
      discussion: ['Why does it matter that gold trade existed here before the fort?', 'Why keep a building linked to painful history?'],
      reflection: ['What is one thing from our past that we should never forget?'],
      maths: [
        { task: 'From 1482 to 2026 is how many years?', answer: '2026 − 1482 = 544 years.' },
        { task: 'From the Dutch capture in 1637 to the end of their trade in enslaved people in 1814 is how many years?', answer: '1814 − 1637 = 177 years.' },
        { task: 'The Portuguese reached the coast in 1471 and began building in 1482. How many years passed?', answer: '1482 − 1471 = 11 years.' },
      ],
      support: ['Give learners a blank timeline with the five dates to place.'],
      stretch: ['Find out how gold reached the coast from inland and who carried it.'],
      localise: ['Link to a local fort, castle or old building if one is nearby.', 'Invite a museum guide or elder to answer learners’ questions.'],
      discoveryStatus: {
        whatWeKnow: ['The castle was begun by the Portuguese in January 1482 and was later held by the Dutch.', 'It was used in the trade in enslaved people.', 'It is a UNESCO World Heritage Site and a museum.'],
        whatWeAreStillDiscovering: ['The exact dates of some transfers of power, which sources give differently.', 'Whether Christopher Columbus sailed on a 1481 voyage.'],
      },
      factCheck: [
        { claim: 'The Portuguese built the castle; the fleet arrived on 19 January 1482 and building began the next morning; Diogo de Azambuja led the fleet; King John II ordered the fort; the Dutch tried in 1596 and captured it in 1637; the Dutch continued the trade in enslaved people until 1814; UNESCO inscribed the site in 1979.', explanation: 'From Wikipedia’s Elmina Castle article, which also notes that some sources give 1642 for the Dutch takeover of the Portuguese Gold Coast and that the Columbus claim is not settled.', reference: 'Wikipedia, “Elmina Castle”. Check also scholarly histories of Elmina and the Ghana Museums and Monuments Board.' },
        { claim: 'The site “Forts and Castles, Volta, Greater Accra, Central and Western Regions” has 24 locations, including Elmina Castle and Cape Coast Castle.', explanation: 'From the World Heritage Site listing.', reference: 'UNESCO World Heritage List (via worldheritagesite.org), “Forts and Castles, Volta, Greater Accra, Central and Western Regions”.' },
      ],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-door-and-the-dungeon',
    title: 'The Door and the Dungeon',
    summary: 'Tawia and Rosina visit Cape Coast Castle. Their teacher tells how it changed from a small trading post to a castle, where people were held before being taken across the Atlantic, and why it is a museum today.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 5,
    genres: ['historical', 'informational', 'educational'],
    themes: ['community', 'identity', 'citizenship'],
    objectives: ['cultural-heritage', 'respect', 'critical-thinking', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 115,
    paceWord: 'Slow, quiet and respectful, with room to pause',
    palette: ['#44403c', '#0f766e'],
    voice: 'Quiet, steady voice with long pauses; Mr Konney speaks softly and carefully',
    characters: [
      'Tawia: a 14-year-old boy in a white shirt and grey trousers, with a notebook.',
      'Rosina: his classmate, 14, in a school uniform with a headband, listening closely.',
      'Mr Konney: their history teacher, in a plain shirt and spectacles, walking slowly.',
      'Cape Coast Castle: a white castle on a rocky shore, with cannons facing the sea and a narrow doorway in its wall.',
    ],
    music: 'Very soft strings and distant waves; near silence for the dungeon page (placeholder)',
    pages: [
      pg('🚪', 'Mr Konney stopped the class at the gate of Cape Coast Castle. “This is a serious place,” he said. “Some of what we hear today is sad. We will walk quietly and listen. If anyone needs a moment, step outside and tell me. There is no shame in that.” Tawia nodded. Rosina held her notebook close.', 'A teacher speaks quietly to pupils standing at the gate of a white castle.'),
      pg('📜', '“This place began as a Portuguese trading post in 1555,” said Mr Konney. “Later, a Swedish company built a wooden lodge here and named it Carolusborg, for King Charles X. Books give the year as 1652 or 1653. The Dutch took over, and in 1664 the English captured it and called it Cape Coast Castle.”', 'A timeline with a small wooden lodge, a Dutch flag and an English flag.'),
      pg('⛓️', '“For many years, one of the main trades here was in enslaved people,” said Mr Konney. “Captured men, women and children were held in this castle until ships came to take them across the Atlantic. Below us is a dungeon. One source says it was built by 1682 and could hold about a thousand people. Historians are not sure of the date, and the number is an estimate.”', 'A staircase leading down into a dim stone room, drawn without any people in it.'),
      pg('🌅', 'The guide led them to a narrow doorway that opened toward the sea. “This is called the Door of No Return,” he said quietly. “It was the last step before the ships.” Nobody spoke. Rosina looked at the sea beyond the door, blue and wide and very quiet.', 'A narrow stone doorway with the sea and sky visible beyond it.'),
      pg('🧍', '“Notice the words we use,” said Mr Konney. “We say enslaved people, not slaves. Those who were held here were not defined by what was done to them. They were human beings with names, families, farms, songs and skills. Using the right words reminds us of that.” Tawia crossed out a word in his notebook and wrote it again.', 'A pupil corrects a word in his notebook while the teacher watches.'),
      pg('🛠️', '“After the trade ended, the castle was kept and mended over the years,” said Mr Konney. “The British Public Works Department repaired it in the 1920s. In 1957 it passed to the Ghana Museums and Monuments Board. It was restored again in the early 1990s with help from the Ghanaian government and international partners. UNESCO listed it in 1979 with other forts and castles on our coast.”', 'Workers repair a stone wall with scaffolding beside a white castle.'),
      pg('🤔', '“Why do we not knock it down?” asked Rosina. Mr Konney thought for a while. “Because forgetting does not heal anything,” he said. “A place like this lets us tell the truth, honour the people who suffered, and teach children who were not there. Many visitors come simply to stand in silence and remember.”', 'Pupils stand quietly in a courtyard while the teacher answers a question.'),
      pg('🌿', 'On the way out, they passed through the same doorway. “Some people now also speak of a Door of Return,” said the guide, “to welcome the descendants of those who were taken, and to say: you are not forgotten.” Tawia and Rosina stepped out into the sunshine together. For a long time neither of them said anything. The end.', 'Two pupils step through a doorway into bright light, with the castle behind them.'),
    ],
    activities: [
      { id: 'cape-c1', type: 'comprehension', afterPage: 3, question: 'What was held in Cape Coast Castle until ships came?', options: ['Enslaved people', 'Cocoa beans', 'Fish for sale'], correctIndex: 0 },
      { id: 'cape-p1', type: 'prediction', afterPage: 5, prompt: 'Mr Konney uses the words “enslaved people”. Why might he choose those words?', options: ['They remind us these were human beings', 'They are shorter', 'They sound nicer'] },
      { id: 'cape-c2', type: 'comprehension', afterPage: 7, question: 'Why does Mr Konney say we should not knock the castle down?', options: ['It lets us tell the truth and honour those who suffered', 'It is too tall', 'It is very old'], correctIndex: 0 },
      { id: 'cape-voc', type: 'vocabulary', afterPage: 3, word: 'dungeon', definition: 'A dark underground room in a castle, used for holding prisoners.', distractors: ['A kind of drum', 'A garden wall'] },
      { id: 'cape-s1', type: 'sequencing', prompt: 'Put the Cape Coast Castle story in order.', items: ['It began as a Portuguese trading post.', 'A Swedish company built a wooden lodge.', 'The English captured it in 1664.', 'It became a museum under the Ghana Museums and Monuments Board.'] },
      { id: 'cape-sel', type: 'sel', afterPage: 8, prompt: 'Some places hold sad memories. How can we visit them with care and respect?', feelingOptions: ['Respectful', 'Sad', 'Thoughtful', 'Calm'] },
    ],
    glossary: [
      { word: 'dungeon', definition: 'A dark underground room used for holding prisoners.', pages: [3] },
      { word: 'Atlantic', definition: 'The large ocean between Africa and the Americas.', pages: [3] },
      { word: 'descendants', definition: 'People who come from the same family line, later in time.', pages: [8] },
      { word: 'restored', definition: 'Repaired and brought back to a good condition.', pages: [6] },
      { word: 'Portuguese', definition: 'From Portugal, a country in Europe.', pages: [2] },
    ],
    culturalNotes: ['Cape Coast Castle is a World Heritage Site and a museum. This story uses published accounts and an invented teacher and pupils.', 'This is a serious subject. The story avoids graphic detail and shows learners using respectful language. Teachers should prepare for strong feelings and allow any learner to step out.', 'The names “Door of No Return” and “Door of Return” are used by guides and visitors; wording may differ between sources.'],
    reviewQuestions: ['Check against named sources: Portuguese post in 1555 (Cabo Corso); Swedish lodge Carolusborg (1652 or 1653, sources differ); English capture in 1664; the dungeon by 1682 and its capacity (an estimate); restoration in the 1920s and early 1990s; Ghana Museums and Monuments Board from 1957; UNESCO 1979.', 'Ask the castle’s museum staff or the Ghana Museums and Monuments Board to review the wording, especially the “Door of Return” sentence.', 'Check that no sentence could read as blaming or shaming present-day learners or visitors.'],
    guide: {
      overview: 'A history story that treats the trade in enslaved people with dignity. It teaches respectful language, how historians handle uncertain dates and numbers, and why societies keep difficult places.',
      lessonMinutes: 50,
      goals: ['Describe how Cape Coast Castle changed hands and uses.', 'Explain why respectful language matters in history.', 'Explain why places of hard memory are kept.'],
      subjects: [['Social Studies / History', 'The Gold Coast and the Atlantic trade'], ['Religious and Moral Education', 'Dignity and respect'], ['English Language', 'Word choice and tone']],
      before: ['Tell learners the story deals with a painful subject, that they may step out at any time, and that you will answer questions honestly.'],
      during: ['At page 5, discuss why the words we choose change how we think.'],
      after: ['Write a short, respectful sentence a visitor might write in a museum book.', 'Draw a timeline of the castle’s owners.'],
      discussion: ['Why is it important to say “enslaved people” and not only “slaves”?', 'What does it mean to honour people from long ago?'],
      reflection: ['How would you want a painful part of your own family’s past to be remembered?'],
      maths: [
        { task: 'From the English capture in 1664 to Ghana’s independence in 1957 is how many years?', answer: '1957 − 1664 = 293 years.' },
        { task: 'The Swedish lodge dates are given as 1652 or 1653. How many years to 2026 for each?', answer: '2026 − 1652 = 374 years; 2026 − 1653 = 373 years.' },
      ],
      support: ['Give learners a short list of respectful words and let them practise using them aloud.'],
      stretch: ['Research how other countries remember places linked to the trade in enslaved people.'],
      localise: ['Check whether a local guide or school counsellor can support the lesson.', 'Allow quiet time after the story.'],
      discoveryStatus: {
        whatWeKnow: ['The castle was held in turn by the Portuguese, Swedes, Dutch and English.', 'It was used to hold enslaved people before they were shipped across the Atlantic.', 'It is a museum and a World Heritage Site.'],
        whatWeAreStillDiscovering: ['The exact date of the dungeon and the numbers it held at different times.', 'The year of the Swedish lodge, which sources give as 1652 or 1653.'],
      },
      factCheck: [
        { claim: 'Cape Coast Castle began as a Portuguese trading post in 1555; the Swedish Africa Company built the Carolusborg lodge in 1653 (another passage says 1652); the English captured it in 1664; it was a major holding site for enslaved Africans; the dungeon is estimated to date from 1682 and could hold about a thousand people; it was restored in the 1920s and early 1990s, and passed to the Ghana Museums and Monuments Board in 1957.', explanation: 'From Wikipedia’s Cape Coast Castle article, which itself flags the 1652 or 1653 uncertainty and says the dungeon’s date and capacity are estimates from secondary sources.', reference: 'Wikipedia, “Cape Coast Castle”. Check also the Ghana Museums and Monuments Board and scholarly histories.' },
        { claim: 'The castle is part of the UNESCO site “Forts and Castles, Volta, Greater Accra, Central and Western Regions”, inscribed in 1979.', explanation: 'From the World Heritage Site listing.', reference: 'UNESCO World Heritage List (via worldheritagesite.org).' },
      ],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-wall-of-notse',
    title: 'The Wall of Notsé',
    summary: 'In the week of the Hogbetsotso festival, Worlanyo and Ayele ask their grandfather how the Ewe came to the Volta Region. He tells the tradition of the wall of Notsé, and they discover what historians say, which dates are disputed and why both stories matter.',
    classIds: ['primary-5', 'primary-6', 'jhs-1'],
    ageMin: 10,
    ageMax: 13,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['historical', 'cultural', 'folktale'],
    themes: ['identity', 'family', 'festivals'],
    objectives: ['cultural-heritage', 'critical-thinking', 'reasoning', 'oral-language'],
    ghanaianContext: 'central',
    culturalTags: ['festival', 'local-names'],
    wpm: 120,
    paceWord: 'Warm and storytelling, slower when Grandfather tells the tradition',
    palette: ['#15803d', '#a16207'],
    voice: 'Warm elder’s voice for Grandfather Dotse; curious young voices for Worlanyo and Ayele',
    characters: [
      'Worlanyo: a 12-year-old boy in a checked shirt and shorts, holding a small notebook.',
      'Ayele: his sister, 11, in a yellow dress with beaded bracelets.',
      'Grandfather Dotse: an elderly man in a patterned cloth, seated on a low stool beneath a tree.',
      'The wall of Notsé: a tall, thick mud wall around an old town (story picture).',
    ],
    music: 'Gentle drumming and a soft rattle, rising to a bright, proud rhythm at the end (placeholder)',
    pages: [
      pg('🥁', 'It was the week of Hogbetsotso, the festival the Anlo celebrate on the first Sunday of November. Drums sounded in the distance. Worlanyo and Ayele sat beside Grandfather Dotse under the tree. “Grandfather,” said Ayele, “this festival remembers a journey. Please tell us how our people came here.”', 'Two children sit beside their grandfather under a tree while drums are heard in the distance.'),
      pg('🧱', '“Long ago,” said Grandfather, “many Ewe people lived in a walled town called Notsé, in what is now Togo. Its ruler was called Agokoli, or Agorkoli, because the spelling changes from book to book. The people say he ruled harshly, and that the wall around the town became a prison.”', 'An old walled town with a tall mud wall and a ruler on a stool.'),
      pg('💧', '“The people wanted to leave,” said Grandfather, “but the wall was thick and guarded. So the story says the women poured their washing water in the same place on the wall, again and again. Slowly the mud grew soft. At last a gap opened, and the people slipped out into the night.”', 'Women pour water at one spot on a tall mud wall as the sky grows dark.'),
      pg('👣', '“There was one more trick,” said Grandfather. “To confuse anyone who followed, they walked backwards. Their footprints seemed to lead into the town, not away from it.” Ayele laughed. “That is clever!” “That is the tradition,” said Grandfather gently. “Now ask me what the historians say.”', 'Footprints in sand appear to point towards a town while people walk away backwards.'),
      pg('🔍', '“Archaeologists have studied the remains at Notsé,” said Grandfather. “They think the great enclosure was a sacred and symbolic wall, not a fort. Some historians doubt the part about breaking through it, because the wall may never have been finished. But almost everyone agrees that a large movement of people from Notsé really happened.”', 'A pair of archaeologists measure the remains of an old wall in a field.'),
      pg('📆', '“And when did it happen?” asked Worlanyo. “Books do not agree,” said Grandfather. “Some put it in the fifteenth century, others in the sixteenth or the seventeenth. One writer gives Agokoli’s reign as 1670 to 1720. We say: dates uncertain, event likely.” Worlanyo wrote that down carefully, with a question mark.', 'A notebook page with three centuries listed and a question mark beside them.'),
      pg('🗺️', '“After they left, the people split into groups,” said Grandfather. “Some went north and west, to places like Hohoe, Kpando and Peki. Some settled near Ho. Others went south and west to the coast. The Anlo settled along the sea.” Ayele traced the route on a map with her finger. “That is how a single story became many towns.”', 'A map of the Volta Region with arrows leaving Notsé towards different towns.'),
      pg('🌅', '“So is Notsé where the Ewe began?” asked Ayele. “Many Ewe say so,” said Grandfather. “Historians say the Ewe lived in this region before Notsé, so it may be a story of a great journey and not the very first beginning. Both can be true. A people can remember a moment that made them who they are.” The drums grew louder. “Come. The festival is starting.” The end.', 'The children and their grandfather walk toward a crowd with drums and bright cloth.'),
    ],
    activities: [
      { id: 'notse-c1', type: 'comprehension', afterPage: 3, question: 'In the tradition, how did the people weaken the wall?', options: ['Women poured water on one place until the mud softened', 'They knocked it down with drums', 'They climbed over with ladders'], correctIndex: 0 },
      { id: 'notse-p1', type: 'prediction', afterPage: 4, prompt: 'Grandfather says the historians have a different view of the wall. What might they say?', options: ['That the wall may have been sacred and unfinished', 'That the wall never existed at all', 'That there was no town'] },
      { id: 'notse-c2', type: 'comprehension', afterPage: 6, question: 'What does Grandfather say about the dates?', options: ['Books do not agree', 'Everyone agrees on one date', 'Nobody has written about it'], correctIndex: 0 },
      { id: 'notse-voc', type: 'vocabulary', afterPage: 5, word: 'tradition', definition: 'A story or custom passed down from one generation to the next.', distractors: ['A kind of cloth', 'A type of wall'] },
      { id: 'notse-s1', type: 'sequencing', prompt: 'Put the tradition in order.', items: ['The people lived in a walled town.', 'Women poured water on one place in the wall.', 'The people slipped out and walked backwards.', 'They settled in different places in what is now Ghana.'] },
      { id: 'notse-sel', type: 'sel', afterPage: 8, prompt: 'A story can be a tradition and also be studied by historians. How do you feel about learning both?', feelingOptions: ['Curious', 'Proud', 'Thoughtful', 'Excited'] },
    ],
    glossary: [
      { word: 'tradition', definition: 'A story or custom passed down over many years.', pages: [4] },
      { word: 'archaeologists', definition: 'Scientists who study the past by digging up and examining old remains.', pages: [5] },
      { word: 'historians', definition: 'People who study the past from written records and other evidence.', pages: [5, 8] },
      { word: 'enclosure', definition: 'An area surrounded by a wall or fence.', pages: [5] },
      { word: 'festival', definition: 'A special celebration, often held each year.', pages: [1] },
    ],
    culturalNotes: ['Hogbetsotso is celebrated by the Anlo Ewe, usually on the first Sunday in November. The story is told in a family voice. The family and children are invented.', 'The story separates oral tradition from what historians and archaeologists have found, and shows both with respect.', 'Spellings (Agokoli or Agorkoli, Notsé or Notsie) vary between sources.'],
    reviewQuestions: ['Check against named sources: the exodus from Notsé; Agokoli as ruler; the wall interpreted as a sacred enclosure; the dates (15th, 16th or 17th century; Agokoli’s reign given as 1670 to 1720 by one source); the groups that dispersed; Hogbetsotso on the first Sunday of November.', 'Have Ewe elders, the Anlo traditional authorities or an Ewe teacher review the story, especially the wording about the wall, the footprints and the origin question.', 'The wet-wall and backward-walking details come from a festival article that calls them tradition, not documented history; keep that label.'],
    guide: {
      overview: 'A story that shows how a people remembers its past through tradition and how historians test it. It teaches the difference between a story told by a community, evidence from archaeology, and a date that is still uncertain.',
      lessonMinutes: 50,
      goals: ['Retell the Ewe tradition of Notsé.', 'Explain what archaeologists and historians add to a tradition.', 'Explain why a date may be uncertain.'],
      subjects: [['Social Studies / History', 'Peoples and migration'], ['Ghanaian Language / Culture', 'Festivals and oral tradition'], ['English Language', 'Fact, tradition and opinion']],
      before: ['Ask: who tells the history of your family? Is it written or spoken?'],
      during: ['At page 4, ask learners to name one detail that is tradition and one that is evidence.'],
      after: ['Interview an elder about a family story and note which details are certain and which are told differently by different people.', 'Draw the groups leaving Notsé on a map.'],
      discussion: ['Why might two accounts of the same event differ?', 'Why is it useful to keep both the tradition and the evidence?'],
      reflection: ['What story do you carry that tells people where you come from?'],
      maths: [
        { task: 'If Agokoli’s reign is given as 1670 to 1720, how many years is that?', answer: '1720 − 1670 = 50 years.' },
        { task: 'From the fifteenth century (1400s) to now is at least how many years? Use 1400 and 2026.', answer: '2026 − 1400 = 626 years or more.' },
      ],
      support: ['Provide a two-column chart: Tradition / Evidence.'],
      stretch: ['Research another people’s story of migration in Ghana and compare how it is told.'],
      localise: ['Invite an Ewe elder or cultural officer to tell the tradition in their own words.', 'Use local place names for the dispersal map.'],
      discoveryStatus: {
        whatWeKnow: ['A large movement of people from Notsé is widely accepted.', 'Archaeologists have found the remains of an enclosure at Notsé and read it as sacred and symbolic.', 'The Anlo celebrate Hogbetsotso, the festival of the exodus.'],
        whatWeAreStillDiscovering: ['The exact date of the exodus.', 'Whether the wall was broken through, since the enclosure may not have been finished.', 'Whether Notsé was the true beginning of the Ewe or one great journey in a longer history.'],
      },
      factCheck: [
        { claim: 'The exodus of the Ewe from Notsé is generally placed in the 16th to 17th centuries; Agokoli’s reign is given as 1670 to 1720; archaeologists read the enclosure as sacred and symbolic; some historians doubt the breach story because the enclosure may be unfinished; the dispersal produced groups that settled around Hohoe, Kpando, Peki, Ho and the coast.', explanation: 'From Wikipedia’s article on the exodus, which also notes that historians question whether Notsé was the true origin of the Ewe and that colonial scholars and missionaries shaped how the story spread.', reference: 'Wikipedia, “Exodus of the Ewe from Notsé”. Check also scholarly work and Ewe cultural authorities.' },
        { claim: 'Hogbetsotso is celebrated by the Anlo on the first Sunday of November; tradition says women poured water to weaken the wall and the people walked backwards to mislead pursuers.', explanation: 'From a Ghana travel article that describes these details as custom and tradition, not documented history.', reference: 'Ghana Travel (ghanatrvl.com), “Hogbetsotso Festival”.' },
        { claim: 'Another account places the Notsé period in the 15th or 16th century and names different Ewe groups and journeys.', explanation: 'From a community site on Ghanaian place names, which notes that these accounts rest largely on oral tradition and secondary sources.', reference: 'Ghana place names (sites.google.com/site/ghanaplacenames), “Ewe”.' },
      ],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'hooting-at-hunger',
    title: 'Hooting at Hunger',
    summary: 'In Jamestown during Homowo, Lante and Naadu learn from their grandmother why the Ga “hoot at hunger”, what the quiet weeks are for, how the festival food is made and shared, and why the dates change from year to year.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'fluent',
    difficulty: 3,
    genres: ['cultural', 'historical', 'educational'],
    themes: ['festivals', 'food', 'family'],
    objectives: ['cultural-heritage', 'vocabulary', 'reading-comprehension', 'respect'],
    ghanaianContext: 'central',
    culturalTags: ['festival', 'local-food', 'local-names'],
    wpm: 115,
    paceWord: 'Warm and rhythmic, brighter at the food and the hooting',
    palette: ['#b91c1c', '#facc15'],
    voice: 'Warm, humorous grandmother’s voice for Grandma Ablade; cheerful children’s voices',
    characters: [
      'Lante: a 10-year-old boy in a white shirt and shorts, with a big smile.',
      'Naadu: his sister, 9, in a white dress with a white headband.',
      'Grandma Ablade: a grandmother in a bright wrapper, stirring a large wooden bowl.',
      'Kpokpoi: a steaming dish of golden-brown steamed dough with palm-oil sauce, shown in a big shared bowl.',
    ],
    music: 'Cheerful Ga drumming with clapping and a playful whooping chorus (placeholder)',
    pages: [
      pg('🌅', 'Before dawn, Lante woke to the smell of woodsmoke. It was Homowo day in Jamestown. His grandmother, Grandma Ablade, was already at work. “Come and see,” she said. “Today we hoot at hunger. But first, you must know why.”', 'A boy wakes to the smell of smoke while his grandmother works in the early morning light.'),
      pg('📣', '“The word Homowo comes from two Ga words,” said Grandma Ablade. “Homo means hunger, and wo means to hoot or jeer. So it means hooting at hunger. We laugh at hunger because we are not afraid of it any more.” Naadu giggled and hooted, and Grandma hooted back.', 'A grandmother and her granddaughter laugh and hoot together in a kitchen yard.'),
      pg('🌾', '“Here is the story,” said Grandma. “Long ago, when the Ga people were on their long journey, a time of hunger came, and many people suffered. They prayed and poured libation and asked the ancestors and the gods for help. In time, good harvests came back. So every year we remember the hunger and give thanks for the food.” She added, “Some say it happened during the journey, and some say in the early days here. The tellers do not all agree.”', 'People pray with a bowl of water beside a field of ripening grain.'),
      pg('🤫', '“Before the festival there is a time of quiet,” said Grandma. “For about four weeks, the noise ban is kept while the first grain is sown. People do not play loud drums or music in the streets. It is a way to show respect while the crops are planted.” Lante put a finger to his lips. “So the hooting comes after the hush.”', 'A quiet street with a farmer sowing grain at the edge of town and no musicians.'),
      pg('🍲', 'Grandma showed them the bowl. “This is kpokpoi,” she said. “We steam dough made from ground grain and knead it in a wooden bowl. Some tell it with millet and some with corn. Then we stir in palm oil and serve it with okra soup and fish. Today we cooked from about four o’clock, so that it would be ready by seven.”', 'A grandmother kneads golden dough in a wooden bowl beside a pot of soup.'),
      pg('🥄', 'Then Grandma took a little kpokpoi in her hand. “First we sprinkle some on the ground,” she said. “That is for the ancestors. We say thank you for their care, and we ask them to stay close to us.” She scattered it gently and poured a little drink. Lante and Naadu watched silently, learning how to be respectful.', 'A grandmother gently sprinkles food on the ground while the children watch.'),
      pg('👯', '“The Friday before, we celebrate the twins,” said Grandma. “Twins wear white and eat yam in the Twins Yam Festival. And on Saturday, everyone shares food with their neighbours. Relatives from other towns come home too. Many Ga people living far away hold Homowo as well, so the hooting goes round the world.”', 'Twins in white eat from a shared dish while neighbours bring bowls of food.'),
      pg('📆', '“And when is Homowo?” asked Naadu. “It is not on a fixed day,” said Grandma. “The Ga calendar is set by the priests and elders, so the date can shift by a week or two. It is usually in August, but sometimes in July or September.” Lante laughed. “So we hoot when the elders say!” “Exactly,” said Grandma, and passed him a big bowl. The end.', 'The children receive a bowl of kpokpoi from their grandmother in the morning sun.'),
    ],
    activities: [
      { id: 'homo-c1', type: 'comprehension', afterPage: 3, question: 'What does Homowo mean?', options: ['Hooting at hunger', 'Dancing in the rain', 'Harvest of gold'], correctIndex: 0 },
      { id: 'homo-p1', type: 'prediction', afterPage: 4, prompt: 'Grandma says there is a time of quiet before the festival. Why might people keep quiet while the first grain is sown?', options: ['It is a way of showing respect for the crops and the season', 'Because nobody likes noise', 'Because the drums are broken'] },
      { id: 'homo-c2', type: 'comprehension', afterPage: 6, question: 'What do the Ga sprinkle on the ground first?', options: ['A little kpokpoi, for the ancestors', 'Water for the plants', 'Sand for the road'], correctIndex: 0 },
      { id: 'homo-voc', type: 'vocabulary', afterPage: 3, word: 'libation', definition: 'A drink poured out as a prayer or offering.', distractors: ['A type of drum', 'A kind of cloth'] },
      { id: 'homo-s1', type: 'sequencing', prompt: 'Put the Homowo season in order.', items: ['The first grain is sown and a quiet time is kept.', 'The Twins Yam Festival is held on Friday.', 'Families sprinkle kpokpoi for the ancestors.', 'Neighbours share food on the Saturday.'] },
      { id: 'homo-sel', type: 'sel', afterPage: 8, prompt: 'Sharing food with neighbours is part of Homowo. How does sharing make a community feel?', feelingOptions: ['Joyful', 'Grateful', 'Generous', 'Proud'] },
    ],
    glossary: [
      { word: 'libation', definition: 'A drink poured out as a prayer or offering.', pages: [3] },
      { word: 'ancestors', definition: 'Family members who lived long ago.', pages: [3, 6] },
      { word: 'sown', definition: 'Planted by scattering seeds in the soil.', pages: [4] },
      { word: 'kpokpoi', definition: 'A festival food of steamed dough served with palm oil and soup.', pages: [5] },
      { word: 'twins', definition: 'Two children born to the same mother at the same time.', pages: [7] },
    ],
    culturalNotes: ['Homowo is the festival of the Ga people of Greater Accra. The family is invented. The details of rites and food come from published accounts and vary between Ga towns and families.', 'The origin of the festival is told as tradition, and accounts differ on whether the famine happened during the migration or in early settlement.', 'The date follows the Ga calendar and is announced by the priests and elders; it is usually in August, sometimes July or September.'],
    reviewQuestions: ['Check against named sources: meaning of Homowo (hunger and hoot); famine tradition; the noise ban (about four weeks and two days); kpokpoi (millet or corn, palm oil, okra); the Twins Yam Festival on the Friday before; sprinkling for ancestors; usual month.', 'Have Ga Mashie cultural authorities or a Ga teacher review the story, especially the origin tradition, the grain and the rites.', 'The story says the festival is usually in August; confirm the wording and add the local announcement practice.'],
    guide: {
      overview: 'A festival story that explains why the Ga “hoot at hunger” and how food, quiet, family and thanks fit together. It teaches that traditions have a meaning, and that accounts of origin can differ.',
      lessonMinutes: 40,
      goals: ['Explain what Homowo means and why it is celebrated.', 'Describe how the festival food is prepared and shared.', 'Explain why the date can change from year to year.'],
      subjects: [['Social Studies / History', 'Festivals and heritage'], ['Home Economics', 'Local food'], ['English Language', 'Reading informational stories']],
      before: ['Ask: what festival does your family celebrate? What does it remember?'],
      during: ['At page 3, ask learners what the story says and what the tellers disagree about.'],
      after: ['Draw the stages of the Homowo season in order.', 'Interview an adult about a festival in your community.'],
      discussion: ['Why is it important to share food during a festival?', 'Why might a date not be fixed?'],
      reflection: ['What would you hoot at, to show you are no longer afraid of it?'],
      maths: [
        { task: 'The noise ban lasts four weeks and two days. How many days is that?', answer: '4 × 7 + 2 = 30 days.' },
        { task: 'Cooking begins at about 4 a.m. and the food is ready by about 7 a.m. How long is that?', answer: '3 hours.' },
      ],
      support: ['Provide pictures of the stages and ask learners to put them in order.'],
      stretch: ['Compare Homowo with a harvest festival from another part of Ghana.'],
      localise: ['Use the local Ga announcements and customs; invite a Ga elder or cultural officer.', 'Follow local rules about food, libation and photographs.'],
      discoveryStatus: {
        whatWeKnow: ['Homowo is a Ga festival linked to hunger, harvest and thanksgiving.', 'The date follows the Ga calendar and changes slightly each year.'],
        whatWeAreStillDiscovering: ['Where and when the famine in the origin story took place.', 'Which grain the dish was first made from, since accounts mention millet and corn.'],
      },
      factCheck: [
        { claim: 'Homowo is traced to famine during the Ga migration; the name combines homo (hunger) and wo (hoot); kpokpoi is made from steamed dough mixed with palm oil and okra; each family sprinkles some on the ground for the ancestors; there is a noise ban of four weeks and two days; the Twins Yam Festival is the Friday before; the festival is usually in August, occasionally in July or September.', explanation: 'From Wikipedia’s Homowo article, which itself notes that dates vary, that origin accounts differ and that several sources are informal.', reference: 'Wikipedia, “Homowo”. Check also Ga cultural authorities and scholarly sources.' },
      ],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'many-sticks-one-bundle',
    title: 'Many Sticks, One Bundle',
    summary: 'In Kumasi, Kwadwo and Esther learn how several Akan states joined together against Denkyira to form the Asante union. They also discover that sources give two different years for the decisive battle of Feyiase, and what the union’s symbols mean.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2'],
    ageMin: 11,
    ageMax: 14,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['historical', 'informational', 'educational'],
    themes: ['leadership', 'community', 'citizenship'],
    objectives: ['cultural-heritage', 'critical-thinking', 'reasoning', 'teamwork'],
    ghanaianContext: 'central',
    culturalTags: ['proverb', 'local-names'],
    wpm: 120,
    paceWord: 'Strong and clear, slowing at the dates',
    palette: ['#92400e', '#ca8a04'],
    voice: 'Strong, steady teacher’s voice for Mr Anim; eager young voices for Kwadwo and Esther',
    characters: [
      'Kwadwo: a 12-year-old boy in a white shirt and brown shorts, holding a bundle of thin sticks.',
      'Esther: his classmate, 12, in a school uniform with plaits, taking notes.',
      'Mr Anim: their history teacher, in a kente-print shirt, holding up a single stick.',
      'The Asante union: a story picture of several chiefs standing together in front of a stool.',
    ],
    music: 'Strong talking drums building slowly, with a steady, proud rhythm (placeholder)',
    pages: [
      pg('🪵', 'Mr Anim gave Kwadwo a single thin stick. “Break it,” he said. Snap! It broke easily. Then he handed Kwadwo a tight bundle of sticks tied together. “Now break this.” Kwadwo pushed and pulled, but the bundle would not break. “That,” said Mr Anim, “is the story of the Asante union.”', 'A teacher watches a boy trying to break a bundle of sticks in front of a class.'),
      pg('👑', '“By the 1680s, several large Akan kingdoms had grown up in the forest,” said Mr Anim. “In the last years of the seventeenth century, a powerful state called Denkyira conquered them and ruled them harshly. The smaller states were strong alone, but not strong enough to resist.”', 'A map of the forest region with a large kingdom in the middle and smaller ones around it.'),
      pg('🤝', '“Around Kwaaman, which became Kumasi, a group of Oyoko clans had settled,” said Mr Anim. “A leader named Osei Tutu and his priest and adviser, Okomfo Anokye, led them in bringing the states together. They agreed to stand as one, under a shared law and a shared symbol, to throw off Denkyira rule.”', 'Chiefs and elders stand in a circle in front of a shared stool.'),
      pg('📖', '“There is a saying that the name Asante means because of war,” said Mr Anim. Esther raised her hand. “Is that certain?” “It is one explanation people give,” he said. “Names often have more than one story. I will tell you what I know and tell you when I am not sure.”', 'A pupil raises her hand as the teacher writes a name on the board.'),
      pg('⚔️', '“The decisive fight took place at Feyiase,” said Mr Anim. “The Denkyira king, Ntim Gyakari, was killed, and the Asante captured the cannons Denkyira had brought. The Asante had few firearms of their own, but they won. Denkyira rule was broken. And here is a puzzle: one source gives the date as August 1701, and another says 1700. I will not choose for you.”', 'Warriors with a captured cannon on a field while a teacher’s chalk dates 1700 and 1701 appear above.'),
      pg('🪑', '“The Golden Stool, Sika Dwa Kofi, became the seal of the union,” said Mr Anim. “Asante tradition says Okomfo Anokye called it down from the sky. We learned last term that this belongs to tradition, and that we handle it with respect. What matters here is that it stood for all the member states together, not for one town.”', 'A golden stool, drawn respectfully on its own cloth, with chiefs standing around it.'),
      pg('📚', '“The union also had rules,” said Mr Anim. “It had a council and an army arranged in wings, each state with its own duties. There was an annual festival called Odwira. A strict law forbade people to bring up the old conquests and origins of member states, because the leaders wanted unity to be more important than old quarrels.”', 'A council of elders discuss around a table while soldiers line up in five wings.'),
      pg('✅', '“Between 1700 and 1750,” said Mr Anim, “the union grew until it covered an area bigger than modern Ghana.” Kwadwo held up the bundle. “One stick breaks, but many together do not.” “That is the lesson, and the history,” said Mr Anim. Esther added, “And also: always check the date.” Everyone laughed. The end.', 'The class stands around a teacher who holds up a bundle of sticks as a map of the region is shown.'),
    ],
    activities: [
      { id: 'asu-c1', type: 'comprehension', afterPage: 3, question: 'Why did the states join together?', options: ['To free themselves from Denkyira rule', 'To trade cocoa', 'To build a road'], correctIndex: 0 },
      { id: 'asu-p1', type: 'prediction', afterPage: 4, prompt: 'Mr Anim says he will tell the class when he is not sure. Why is that a good habit for a historian?', options: ['It keeps the story honest', 'It makes the lesson shorter', 'It avoids questions'] },
      { id: 'asu-c2', type: 'comprehension', afterPage: 5, question: 'What puzzle does Mr Anim give about Feyiase?', options: ['Sources give two different years', 'Nobody knows where it was', 'The battle never happened'], correctIndex: 0 },
      { id: 'asu-voc', type: 'vocabulary', afterPage: 3, word: 'union', definition: 'A group of people or states joined together for a shared purpose.', distractors: ['A kind of stool', 'A type of weapon'] },
      { id: 'asu-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Denkyira conquered the smaller Akan states.', 'The states agreed to stand together in a union.', 'The union defeated Denkyira at Feyiase.', 'The union grew to cover a large area.'] },
      { id: 'asu-sel', type: 'sel', afterPage: 8, prompt: 'Many people working together can do what one cannot. When did you last succeed by working with others?', feelingOptions: ['Proud', 'Grateful', 'Strong', 'Happy'] },
    ],
    glossary: [
      { word: 'union', definition: 'A group of states or people joined together for a shared purpose.', pages: [1, 6] },
      { word: 'conquered', definition: 'Took control of a place or people by force.', pages: [2] },
      { word: 'decisive', definition: 'Settling the matter; deciding who wins.', pages: [5] },
      { word: 'seal', definition: 'A sign or symbol that confirms an agreement.', pages: [6] },
      { word: 'bundle', definition: 'Several things tied or held together.', pages: [1] },
    ],
    culturalNotes: ['The Asante union is a major part of Ghana’s history. This story uses published accounts and an invented teacher and pupils. The Golden Stool is sacred; the story refers to it briefly and with respect.', 'The saying about one stick and a bundle is told in many parts of Africa and is used here as a classroom teaching device, not as a quotation from a particular source.', 'The meaning of the name Asante is told as an explanation people give, not as settled fact.'],
    reviewQuestions: ['Check against named sources: Denkyira dominance in the late 1600s; Osei Tutu and Okomfo Anokye; Feyiase as the decisive battle; Ntim Gyakari killed; the cannons; the date given as August 1701 by one source and 1700 by another; Odwira; expansion between 1700 and 1750.', 'Have Asante cultural authorities, Manhyia or an Asante history teacher review the wording, especially about the Golden Stool and the origin of the name.', 'The number of captured cannons is unclear in sources and is not stated; keep it out.'],
    guide: {
      overview: 'A story about unity and about how historians work. It teaches how small states joined against a larger power, why symbols matter and why two sources can give different dates.',
      lessonMinutes: 50,
      goals: ['Explain why the states joined together and how.', 'Describe the union’s symbols and rules.', 'Compare two dates for the same event and explain why they might differ.'],
      subjects: [['Social Studies / History', 'Kingdoms and unions before colonial rule'], ['Mathematics', 'Subtraction and timelines'], ['Citizenship', 'Unity and cooperation']],
      before: ['Do the stick demonstration with learners before reading.'],
      during: ['At page 5, ask learners to write both dates and give two reasons they might differ.'],
      after: ['Make a bundle of sticks or straws and explain the lesson to a partner.', 'Write a short speech urging cooperation, in the voice of a leader at the union’s founding.'],
      discussion: ['Why was a shared symbol important?', 'What can go wrong in a union, and how can leaders prevent it?'],
      reflection: ['How can your class become like a bundle?'],
      maths: [
        { task: 'If Feyiase was in 1700, how many years ago was it from 2026? And if 1701?', answer: '2026 − 1700 = 326 years; 2026 − 1701 = 325 years.' },
        { task: 'The union expanded between 1700 and 1750. How many years is that?', answer: '50 years.' },
      ],
      support: ['Give learners a two-column chart: What we know / What we are unsure about.'],
      stretch: ['Find out how the Asante later organised their army and government.'],
      localise: ['Invite a local historian or a member of the community to speak.', 'Follow local custom when speaking about chiefs and the Golden Stool.'],
      discoveryStatus: {
        whatWeKnow: ['Denkyira dominated its neighbours in the late 1600s and was defeated by the Asante union at Feyiase.', 'The Golden Stool became a symbol of unity.'],
        whatWeAreStillDiscovering: ['The exact year of Feyiase, which one source gives as August 1701 and another as 1700.', 'The details of how Denkyira’s king died, which accounts describe differently.'],
      },
      factCheck: [
        { claim: 'Osei Tutu and Okomfo Anokye founded the Asante kingdom around the end of the 17th century; Denkyira conquered neighbouring kingdoms in the last decade of the century; the union’s victory at Feyiase in 1700 ended Denkyira rule; the Golden Stool is the seal of the union; Odwira and a politico-military constitution were set up; between 1700 and 1750 the union grew to cover an area larger than modern Ghana.', explanation: 'From the Manhyia Palace Archives’ account of the Asante union, which says Anokye “is believed” to have called the stool and gives many dates as approximate.', reference: 'Manhyia Palace Museum / Archives, “History of Asante Union”.' },
        { claim: 'The Battle of Feyiase took place in August 1701 between the Asante (under Osei Tutu) and Denkyira (under Ntim Gyakari); Denkyira had a few Dutch cannons; Ntim Gyakari was killed; the Asante captured the cannons.', explanation: 'From Wikipedia’s article on the battle, which cites academic sources and notes uncertainty about the cannon count and the account of the king’s death.', reference: 'Wikipedia, “Battle of Feyiase”.' },
      ],
    },
  }),

  // 6 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-red-hunter-and-the-drummers',
    title: 'The Red Hunter and the Drummers',
    summary: 'In Dagbon, Sulemana and Zuwera ask an elder how the kingdom began. He tells what the drummers say about the Red Hunter, Naa Gbewa and his children, and explains why dates and details differ between tellers.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2'],
    ageMin: 11,
    ageMax: 14,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['historical', 'cultural', 'folktale'],
    themes: ['identity', 'leadership', 'family'],
    objectives: ['cultural-heritage', 'critical-thinking', 'oral-language', 'respect'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 115,
    paceWord: 'Slow and rhythmic, like a drummer telling a long history',
    palette: ['#b45309', '#7f1d1d'],
    voice: 'Deep, steady voice for Elder Mahama; curious voices for Sulemana and Zuwera',
    characters: [
      'Sulemana: a 13-year-old boy in a smock, with a small notebook.',
      'Zuwera: his cousin, 12, in a long dress and headscarf.',
      'Elder Mahama: an old man in a long smock and a cap, seated near a drum.',
      'The Lunsi drummers: men with hourglass-shaped drums held under the arm (story picture).',
    ],
    music: 'Low, steady hourglass-drum rhythm with a call-and-response chorus (placeholder)',
    pages: [
      pg('🥁', 'At the edge of Yendi, Sulemana and Zuwera sat before Elder Mahama. Beside him stood a drum shaped like an hourglass. “In Dagbon, drummers keep our history,” he said. “They are called the Lunsi. They remember the names of kings and the stories of our people, and they sing them. I will tell you what the drummers tell.”', 'Two children sit before an elder who rests a hand on an hourglass drum.'),
      pg('🏹', '“The drummers begin with a hunter called Tohazie, the Red Hunter,” said Elder Mahama. “He was a brave man and a great hunter, and the story says he came from far away. When he reached a village in need, he helped its people, and he married the chief’s daughter. From their family came the line of rulers that later formed the kingdoms of Dagbon, Mamprugu and Nanung.”', 'A hunter with a bow stands before a village while elders welcome him.'),
      pg('👑', '“In one account, Naa Gbewa, a descendant of the Red Hunter, set up a chieftaincy at a place called Pusiga,” said Elder Mahama. “Naa means chief. His sons and daughters became the ancestors of many ruling houses. Tellers do not all agree on the names, or on who came first. That is why you ask more than one person.”', 'A chief on a skin stool at Pusiga with several children around him.'),
      pg('⚖️', '“Then came a disagreement about who should take the skin, the seat of rule,” said Elder Mahama. “In one account, a son named Tohagu left and founded Mamprugu. Another son, Shitobu, took the skin and became the first Ya-Na, which some also spell Yaa-Naa. The title means king of Dagbon, and the spelling changes with the writer.”', 'Two brothers part ways, one leaving the town while the other sits on a skin stool.'),
      pg('🏘️', '“Later, a ruler named Naa Nyagse moved the capital to a place called Yani-Dabari, which means abandoned Yendi,” said Elder Mahama. “Today the king still lives in Yendi, and the royal house is still famous for the drummers who praise its kings. Both the king and the drummers keep our history alive.”', 'A small walled town with a palace and drummers beside it.'),
      pg('📆', '“And when did all this happen?” asked Zuwera. “One writer places the ancestors of the kingdom’s rulers after the fall of the old Ghana empire, at the end of the thirteenth century,” said Elder Mahama. “Another says the sons of Naa Gbewa went their separate ways around the fourteenth century. Another gives a reign for Naa Nyagse of 1416 to 1432. The drummers do not give year numbers.”', 'A timeline with dates for the thirteenth century and the fourteenth century and a question mark.'),
      pg('🌍', '“There are people older than the kings,” said Elder Mahama. “They are called the Tindaamba, the earth priests. They are chosen by an oracle, not by the king, and they still lead many sacred rites. Their place in our story reminds us that the land and its keepers were here first.”', 'An earth priest stands on a hill with a bowl of water and a staff.'),
      pg('✅', '“So how do we know what is true?” asked Sulemana. “We listen to the drummers, to the elders and to the writers, and we ask whether they agree,” said Elder Mahama. “Some parts are tradition and cannot be tested. Some can be checked. Ask permission before you record a drummer. These histories belong to Dagbon.” Zuwera nodded. The drum began to speak. The end.', 'The children listen as the drummer begins to play, with the elder smiling beside them.'),
    ],
    activities: [
      { id: 'dag-c1', type: 'comprehension', afterPage: 3, question: 'Who keeps the history of Dagbon in the story?', options: ['The Lunsi drummers', 'Visiting traders', 'School clocks'], correctIndex: 0 },
      { id: 'dag-p1', type: 'prediction', afterPage: 4, prompt: 'Elder Mahama says “ask more than one person”. Why?', options: ['Tellers may remember different details', 'Because one person is never enough to talk', 'Because he is tired'] },
      { id: 'dag-c2', type: 'comprehension', afterPage: 6, question: 'What do the dates show about this history?', options: ['Writers do not agree on when it happened', 'It happened last year', 'Everyone agrees on one year'], correctIndex: 0 },
      { id: 'dag-voc', type: 'vocabulary', afterPage: 3, word: 'chieftaincy', definition: 'The office or rule of a chief.', distractors: ['A type of drum', 'A kind of cloth'] },
      { id: 'dag-s1', type: 'sequencing', prompt: 'Put the drummers’ account in order.', items: ['A hunter called Tohazie arrived and married the chief’s daughter.', 'Naa Gbewa set up a chieftaincy.', 'Sons and daughters became ancestors of ruling houses.', 'A ruler moved the capital to a place that became Yendi.'] },
      { id: 'dag-sel', type: 'sel', afterPage: 8, prompt: 'Whose stories do you want to keep safe for the future?', feelingOptions: ['Respectful', 'Curious', 'Proud', 'Thoughtful'] },
    ],
    glossary: [
      { word: 'chieftaincy', definition: 'The office or rule of a chief.', pages: [3] },
      { word: 'descendant', definition: 'A person who comes from a particular ancestor.', pages: [3] },
      { word: 'oracle', definition: 'A person or object through which people believe they receive guidance from the spirits.', pages: [7] },
      { word: 'capital', definition: 'The main town or city where a ruler lives.', pages: [5] },
      { word: 'drummers', definition: 'People who play drums, sometimes keeping history by memory.', pages: [1, 5] },
    ],
    culturalNotes: ['This story is about the origins of Dagbon as told by the drummers and in published accounts. The elder and children are invented. Many parts are oral tradition, and tellers differ on names, order and dates.', 'The spellings Ya-Na and Yaa-Naa are both used in sources.', 'Dagbon’s traditions belong to its people. Permission should be sought from Dagbon traditional authorities before this story is published.'],
    reviewQuestions: ['Check against named sources: Tohazie (the Red Hunter); Naa Gbewa; the sons including Tohagu (Mamprugu) and Shitobu (first Yaa-Naa); Naa Nyagse and the move to Yendi; the Tindaamba (earth priests); the dates (end of the 13th century, the 14th century, 1416 to 1432).', 'This account draws on a Dagbon community website and an encyclopedia-style page that disagree in places; both are secondary sources. Have Dagbon traditional authorities, the Lunsi or a Dagbon historian review the story before release.', 'The Red Hunter’s origin and travels are told in many ways; the story keeps them vague on purpose.'],
    guide: {
      overview: 'A story about oral history. It teaches that drummers and elders keep a record, that accounts can differ, and that some stories belong to the community that keeps them.',
      lessonMinutes: 50,
      goals: ['Retell the drummers’ account of the origin of Dagbon in simple order.', 'Explain why different sources give different names and dates.', 'Explain why permission matters when recording a community’s history.'],
      subjects: [['Social Studies / History', 'Kingdoms of northern Ghana'], ['Ghanaian Language / Culture', 'Oral history and drumming'], ['English Language', 'Comparing sources']],
      before: ['Ask: if a story is only spoken, how can it be kept for hundreds of years?'],
      during: ['At page 6, ask learners to list the three dates and say why they differ.'],
      after: ['Make a family tree for the story with the names given.', 'Practise asking permission to record an elder.'],
      discussion: ['Who should decide how a community’s history is told?', 'How can a story be both tradition and a source for historians?'],
      reflection: ['Which story from your own family do you want to keep alive?'],
      maths: [
        { task: 'Naa Nyagse’s reign is given as 1416 to 1432. How many years is that?', answer: '1432 − 1416 = 16 years.' },
        { task: 'From 1416 to 2026 is how many years?', answer: '2026 − 1416 = 610 years.' },
      ],
      support: ['Provide a simple family-tree outline to fill in.'],
      stretch: ['Compare this account with the way another kingdom in Ghana remembers its beginning.'],
      localise: ['Invite a drummer or elder, with permission, to share how history is kept.', 'Use local spellings of names and titles.'],
      discoveryStatus: {
        whatWeKnow: ['Dagbon’s history is kept by drummers and elders and has been written down by researchers.', 'Sources agree that Dagbon, Mamprugu and Nanung are closely linked.'],
        whatWeAreStillDiscovering: ['The dates of the kingdom’s beginnings, which sources place in the 13th or 14th century.', 'The details of the Red Hunter’s story, which are told in different ways.'],
      },
      factCheck: [
        { claim: 'Tohazie (the Red Hunter), Naa Gbewa at Pusiga, the quarrel over the skin, Tohagu founding Mamprugu, Shitobu becoming Yaa-Naa, Naa Nyagse moving the capital to Yani-Dabari, the breakaway placed “around the 14th century” and Naa Nyagse’s reign given as 1416 to 1432.', explanation: 'From a Dagbon history page that retells oral tradition from older written sources (Tauxier, Cardinall) and gives dates without independent evidence.', reference: 'Dagbon Kingdom website, “History of Mole-Dagbon State”.' },
        { claim: 'Naa Gbewa is described as the founder of the Dagbon kingdom; ancestors are said to have come from around Lake Chad after the Ghana Empire broke up at the end of the 13th century; the Tindaamba are earth priests chosen by an oracle; Yendi is the capital; the Tohazie legend and the drummers’ oral histories are tradition.', explanation: 'From an encyclopedia-style page that is internally inconsistent in places and presents several claims as tradition.', reference: 'Cavacopedia, “Dagomba people” (mirror of Wikipedia); check also scholarly histories of Dagbon.' },
      ],
    },
  }),

  // 7 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-gold-road-to-manso',
    title: 'The Gold Road to Manso',
    summary: 'Akwasi and Josephine visit Bono Manso near Techiman. They learn what archaeologists say about this very old Akan town, how gold and kola linked it to Timbuktu and Djenné, why it fell in 1723, and how to question a sign that claims too much.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2'],
    ageMin: 11,
    ageMax: 14,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['historical', 'informational', 'educational'],
    themes: ['money-and-enterprise', 'identity', 'community'],
    objectives: ['cultural-heritage', 'critical-thinking', 'scientific-curiosity', 'reasoning'],
    ghanaianContext: 'central',
    culturalTags: ['market', 'local-names'],
    wpm: 120,
    paceWord: 'Clear and curious, slowing at the evidence',
    palette: ['#a16207', '#166534'],
    voice: 'Curious, clear guide’s voice for Mr Sarpong; lively voices for Akwasi and Josephine',
    characters: [
      'Akwasi: a 13-year-old boy in a school shirt and shorts, carrying a water bottle.',
      'Josephine: his classmate, 13, in a school uniform and a sun hat, with a small notebook.',
      'Mr Sarpong: their teacher and guide, in a khaki shirt and cap, with a trowel.',
      'Bono Manso: green savanna-forest land with old mounds, a signpost, and a long road leading north (story picture).',
    ],
    music: 'Gentle talking drums with a light flute, a steady travelling rhythm (placeholder)',
    pages: [
      pg('🛣️', 'The bus bumped along a red road north of Techiman. “Welcome to Bono Manso,” said Mr Sarpong. “This quiet place was once a busy capital. Today we look for clues about it, and I want you to question everything, even the signs.” Akwasi raised an eyebrow. Josephine opened her notebook.', 'A school bus on a red road passes savanna-forest toward a quiet village.'),
      pg('⛏️', 'Mr Sarpong knelt by a trench. “Archaeologists date the founding of this town to about the year 1000,” he said. “They also found older traces in nearby rock shelters, about six hundred years earlier. Local tradition and archaeology together suggest that the people of Manso descended from the early Akan who lived there.”', 'A teacher kneels by a neat trench in the ground where pottery is showing.'),
      pg('🏛️', '“Manso was the capital of the Bono state,” said Mr Sarpong, “from the eleventh century until 1723. By the fourteenth and fifteenth centuries it was an important centre of trade and ritual. People often call Bono the earliest of the Akan states, but that is a claim we should always check against more than one source.”', 'A map of the Bono state with a town in the middle and roads running outward.'),
      pg('🪙', '“Why was it so busy?” asked Josephine. “Gold,” said Mr Sarpong. “The Akan goldfields lay to the south. Traders carried the gold north, along with kola nuts, and brought back salt, leather and cloth. Merchants called Juula, many of them Muslims, were part of this trade. The road reached markets such as Djenné and Timbuktu, far away in the Sahel.”', 'Traders with donkeys and head-loaded goods walk a long road with gold, kola and salt.'),
      pg('🏪', '“There was a large market called Dwabirem, to the southwest,” said Mr Sarpong. “It brought together people from the forest and the savanna. It is a good reminder that Ghana’s history is not only about the coast. Long before ships came, trade roads linked the interior to the Sahara and beyond.”', 'A bustling open-air market with traders from the forest and from the north.'),
      pg('🔥', '“In 1723, Opoku Ware I of the Asante destroyed Bono Manso,” said Mr Sarpong. “After that, the town of Techiman became the regional centre. Techiman remained under Asante until the late nineteenth century.” Akwasi was quiet for a moment. “So a whole capital can disappear in a single year,” he said. “And its story is still here,” said Mr Sarpong, “in the soil and in memory.”', 'A town on fire in the distance with people watching from a hill.'),
      pg('🪧', 'At the village entrance, they read a faded sign. “It says Manso was a major slave market for the Atlantic trade,” said Josephine. Mr Sarpong frowned. “Careful,” he said. “Some tourism signs say that. But historians who have studied the evidence say there is no proof that Manso was a major market for the Atlantic slave trade. It may have played a small part in local trade. When a sign makes a big claim, ask: where is the evidence?”', 'Two pupils read a worn signpost while the teacher shakes his head slowly.'),
      pg('✅', 'On the bus back, Akwasi counted on his fingers. “If it was founded about the year 1000, it is about a thousand years since then. That is a very long time.” “And it is still teaching us,” said Josephine. Mr Sarpong smiled. “Then you are already doing what archaeologists do,” he said. “You are asking, checking, and writing down what you do not yet know.” The end.', 'The bus heads home with pupils holding notebooks full of questions as the sun sets.'),
    ],
    activities: [
      { id: 'bono-c1', type: 'comprehension', afterPage: 3, question: 'About when do archaeologists date the founding of Bono Manso?', options: ['About the year 1000', 'About the year 1900', 'About the year 1700'], correctIndex: 0 },
      { id: 'bono-p1', type: 'prediction', afterPage: 4, prompt: 'Traders brought gold north. What might they have carried south?', options: ['Salt, leather and cloth', 'Bicycles', 'Printed books'] },
      { id: 'bono-c2', type: 'comprehension', afterPage: 7, question: 'What does Mr Sarpong tell the pupils to ask when a sign makes a big claim?', options: ['Where is the evidence?', 'Who painted the sign?', 'How big is the sign?'], correctIndex: 0 },
      { id: 'bono-voc', type: 'vocabulary', afterPage: 2, word: 'archaeologists', definition: 'Scientists who study the past by digging up and examining old remains.', distractors: ['People who sell gold', 'Drummers who keep history'] },
      { id: 'bono-s1', type: 'sequencing', prompt: 'Put the Bono Manso story in order.', items: ['People lived in rock shelters nearby.', 'Bono Manso was founded about the year 1000.', 'Trade in gold and kola linked Manso to far-off markets.', 'Opoku Ware I destroyed Bono Manso in 1723.'] },
      { id: 'bono-sel', type: 'sel', afterPage: 8, prompt: 'Asking “where is the evidence?” is a brave habit. When is it hard to ask?', feelingOptions: ['Curious', 'Nervous', 'Confident', 'Determined'] },
    ],
    glossary: [
      { word: 'archaeologists', definition: 'Scientists who study the past by digging up and examining old remains.', pages: [2] },
      { word: 'kola', definition: 'A bitter nut from a tree, traded and shared as a gift.', pages: [4] },
      { word: 'evidence', definition: 'Facts or signs that help show whether something is true.', pages: [7] },
      { word: 'capital', definition: 'The main town where a ruler or government is based.', pages: [3] },
    ],
    culturalNotes: ['Bono Manso is a historic site in the Bono East Region of Ghana. This story uses published accounts and invented pupils and a guide.', 'The story separates what archaeologists date, what is called a claim (“earliest Akan state”) and what has little evidence (slave market claims).', 'Spellings and names vary: Bono Manso, Manso or Maaso; Bono or Brong.'],
    reviewQuestions: ['Check against named sources: founding about 1000 CE; rock shelters about 600 years earlier; capital of the Bono state from the 11th century to 1723; trade in gold, kola, salt, leather and cloth; Juula merchants; Djenné and Timbuktu; the Dwabirem market; destruction by Opoku Ware I in 1723; Techiman as successor.', 'Have the Techiman traditional authorities, the University of Ghana archaeology department or a local historian review the story.', 'The statement that there is no evidence of a major Atlantic slave market at Manso comes from one summary; confirm with archaeological sources before release.'],
    guide: {
      overview: 'A story about how archaeologists and historians reconstruct a lost capital. It teaches that Ghana’s inland trade is old, that claims need evidence and that a place can fall and still be remembered.',
      lessonMinutes: 50,
      goals: ['Explain what archaeologists found at Bono Manso and what they date.', 'Describe the trade that linked Manso to the Sahel.', 'Practise asking for evidence when a claim sounds exciting.'],
      subjects: [['Social Studies / History', 'Early states and trade'], ['Integrated Science', 'Evidence and observation'], ['English Language', 'Reading for evidence']],
      before: ['Ask: how can people today know what happened a thousand years ago?'],
      during: ['At page 7, ask learners to list what a good sign should say and what it should not claim without proof.'],
      after: ['Draw the trade road with goods going north and south.', 'Write a short sign for Bono Manso that is accurate and careful.'],
      discussion: ['Why do exciting claims often spread faster than evidence?', 'Why is the interior of Ghana important in its history?'],
      reflection: ['What is one claim you have heard that you would like to check?'],
      maths: [
        { task: 'If Bono Manso was founded about the year 1000 and destroyed in 1723, about how long did it last?', answer: '1723 − 1000 = 723 years.' },
        { task: 'The rock-shelter traces are about 600 years before 1000. What year is that?', answer: '1000 − 600 = about the year 400.' },
      ],
      support: ['Provide a timeline strip with the dates to fill in.'],
      stretch: ['Research how gold from the Akan goldfields reached Timbuktu and Djenné.'],
      localise: ['Visit a local site or museum, or talk to an elder about trade routes through your area.', 'Compare with a trade road near your school.'],
      discoveryStatus: {
        whatWeKnow: ['Archaeology and tradition place a town at Bono Manso from about the year 1000.', 'It was a centre of trade and the capital of the Bono state until 1723.'],
        whatWeAreStillDiscovering: ['How big the town and its market were.', 'Whether the claim that Bono was the very first Akan state is the best way to describe it.', 'What role, if any, Manso played in the trade in enslaved people.'],
      },
      factCheck: [
        { claim: 'Bono Manso, north of Techiman, was founded about 1000 CE by descendants of proto-Akan people from nearby rock shelters about 600 years earlier; it was capital of the Bono state from the 11th century to 1723; the Bono state is described as the earliest of the Akan states; it linked the Akan goldfields to markets such as Djenné and Timbuktu; goods included gold, kola, salt, leather and cloth; Juula merchants took part; the Dwabirem market lay to the southwest; Opoku Ware I destroyed it in 1723 and Techiman became the regional centre; there is no evidence it was a major Atlantic slave market despite tourism claims.', explanation: 'From Wikipedia’s Bono Manso article, which notes differing founding dates between archaeology and tradition and the tourism claim.', reference: 'Wikipedia, “Bono Manso”. Check also the University of Michigan Techiman project pages and scholarly archaeology.' },
      ],
    },
  }),

  // 8 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-teacher-who-drew-the-flag',
    title: 'The Teacher Who Drew the Flag',
    summary: 'Ato and Ofosua paint the Ghana flag for Independence Day. Their teacher tells them who designed it, what the colours and the black star stand for, why people give slightly different meanings, and how a flag came to stand for a nation on 6 March 1957.',
    classIds: ['primary-5', 'primary-6', 'jhs-1'],
    ageMin: 10,
    ageMax: 13,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['historical', 'biography', 'educational'],
    themes: ['citizenship', 'identity', 'school'],
    objectives: ['cultural-heritage', 'citizenship', 'reading-comprehension', 'reasoning'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Proud and clear, brighter at the colours',
    palette: ['#dc2626', '#16a34a'],
    voice: 'Bright, proud teacher’s voice for Mr Bortey; eager young voices for Ato and Ofosua',
    characters: [
      'Ato: an 11-year-old boy in a school uniform, with paint on his fingers.',
      'Ofosua: his classmate, 11, in a school uniform with a red ribbon in her hair.',
      'Mr Bortey: their teacher, in a white shirt and tie, holding a paintbrush and a small flag.',
      'Theodosia Okoh: a woman artist and teacher in a plain dress, seated at a desk drawing the flag (story picture).',
    ],
    music: 'Bright highlife brass and drums building to a proud, open finish (placeholder)',
    pages: [
      pg('🎨', 'On the Friday before Independence Day, Ato and Ofosua painted a large flag on a sheet of paper. Ofosua did the red stripe, Ato did the green, and they argued about the gold. “Where does the star go?” asked Ato. “In the middle,” said Ofosua. “Black, and with five points.” Mr Bortey came over to look.', 'Two children paint a large flag on paper in a bright classroom.'),
      pg('👩🏫', '“Do you know who first drew the flag you are painting?” asked Mr Bortey. “A teacher and artist named Theodosia Okoh designed it in 1957,” he said. “She was the one who put the stripes and the star together. A flag is a picture that a whole country agrees to share, and a teacher helped make it.”', 'A woman at a desk draws stripes of red, gold and green on a large sheet.'),
      pg('🔴', '“Look at the colours,” said Mr Bortey. “People often say red stands for the blood of those who died for the country’s freedom. Gold stands for the mineral wealth of the land, such as gold and diamonds. Green stands for the forests and farms. These are the most widely told meanings, but you may hear other readings too.”', 'A flag with three stripes and small pictures of a farm, a mine and a crowd of people.'),
      pg('⭐', '“And the black star?” asked Ofosua. “The black star stands for the freedom of Africa and for unity against colonial rule,” said Mr Bortey. “It is linked to the Black Star Line, a shipping company started by a man named Marcus Garvey. That is also why our national football team is called the Black Stars.” Ato whispered, “So the football team and the flag share a star.”', 'A black star over a ship and a football team wearing black stars on their shirts.'),
      pg('🌅', '“The flag was first raised on 6 March 1957,” said Mr Bortey. “That was the day the Gold Coast became Ghana, a free country, with Kwame Nkrumah as its leader. People call Ghana the first country in sub-Saharan Africa to win independence from European colonial rule. We chose the name Ghana from an older empire, as we learned in our lesson last term.”', 'A crowd waves flags at a ceremony as a flag is raised.'),
      pg('🔄', '“There is one more twist,” said Mr Bortey. “For a few years in the 1960s the flag was changed. Gold was replaced with white. After Nkrumah left power in 1966, the original design came back. Books do not agree on every date, so we say: in the 1960s, then restored.” Ofosua laughed. “Even flags have their stories.”', 'Two flags side by side, one with gold and one with white in the middle stripe.'),
      pg('🤔', '“Why does a flag matter?” asked Ato. “It is a symbol,” said Mr Bortey. “It is not only cloth. When people stand under it, they remember that they belong together, and that others fought, spoke, wrote and taught so that they could. We do not worship a flag. We honour what it stands for.”', 'Children stand in a line before a flagpole as the teacher speaks quietly.'),
      pg('✅', 'On Monday, the whole school stood in the yard. As the flag went up, Ato counted on his fingers. “2026 take away 1957 is 69 years,” he whispered. “Sixty-nine,” said Ofosua. “And a teacher helped begin it.” Mr Bortey smiled and nodded. When the anthem ended, the two friends held their painted flag high. The end.', 'A school assembly with children saluting as the flag rises above the yard.'),
    ],
    activities: [
      { id: 'flag-c1', type: 'comprehension', afterPage: 3, question: 'Who designed the Ghana flag?', options: ['Theodosia Okoh', 'Kwame Nkrumah', 'Okomfo Anokye'], correctIndex: 0 },
      { id: 'flag-p1', type: 'prediction', afterPage: 4, prompt: 'The football team is called the Black Stars. Where might the name come from?', options: ['From the black star on the flag', 'From the colour of the pitch', 'From the stadium lights'] },
      { id: 'flag-c2', type: 'comprehension', afterPage: 6, question: 'What does Mr Bortey say when books do not agree on a date?', options: ['We say what we know and say which dates differ', 'We choose the date we like', 'We stop learning'], correctIndex: 0 },
      { id: 'flag-voc', type: 'vocabulary', afterPage: 3, word: 'symbol', definition: 'A picture or sign that stands for an idea.', distractors: ['A kind of paint', 'A type of cloth'] },
      { id: 'flag-s1', type: 'sequencing', prompt: 'Put the flag story in order.', items: ['Theodosia Okoh designed the flag.', 'The flag was first raised on 6 March 1957.', 'The flag was changed for a few years in the 1960s.', 'The original design was restored after 1966.'] },
      { id: 'flag-sel', type: 'sel', afterPage: 8, prompt: 'When the flag goes up and the anthem plays, how do you feel?', feelingOptions: ['Proud', 'Grateful', 'Thoughtful', 'Excited'] },
    ],
    glossary: [
      { word: 'symbol', definition: 'A picture or sign that stands for an idea.', pages: [7] },
      { word: 'independence', definition: 'Freedom from the control of another country.', pages: [5] },
      { word: 'colonial', definition: 'Related to a time when one country ruled another.', pages: [4] },
      { word: 'designed', definition: 'Planned and drew how something should look.', pages: [2] },
      { word: 'anthem', definition: 'The official song of a country.', pages: [8] },
    ],
    culturalNotes: ['The Ghana flag was adopted on 6 March 1957. This story uses published accounts and an invented teacher and pupils.', 'The meanings of the colours and star are widely taught; sources and speakers sometimes give slightly different readings, and the story says so.', 'The story names a real designer, Theodosia Okoh, as a person of achievement and does not describe her private life.'],
    reviewQuestions: ['Check against named sources: adopted 6 March 1957; designed by Theodosia Okoh, an artist and teacher; the colours; the black star and its link to the Black Star Line; the 1960s change and the restoration (sources give 1962 to 1966 and 1966; confirm).', 'The claim that Ghana was the first country in sub-Saharan Africa to win independence from European colonial rule is widely stated but disputed at the edges; confirm the wording or soften it.', 'Check that the portrayal of Kwame Nkrumah is fair and brief, and ask a Ghanaian historian to review.'],
    guide: {
      overview: 'A story about the flag as a symbol and about the real person who designed it. It teaches the meaning of national symbols, how widely told meanings can still vary, and how historians handle a change of dates.',
      lessonMinutes: 40,
      goals: ['Name the designer, colours and star of the Ghana flag and explain their meanings.', 'Explain why a flag is a symbol.', 'Calculate years since independence.'],
      subjects: [['Social Studies / History', 'Independence and national symbols'], ['Creative Arts', 'Colour and design'], ['Mathematics', 'Subtraction and timelines']],
      before: ['Ask: why does every country have a flag? What does yours say about the people?'],
      during: ['At page 3, ask learners to match each colour to its meaning.'],
      after: ['Design a flag for your class and explain each colour and shape.', 'Write a short paragraph about Theodosia Okoh as a person who made something that lasts.'],
      discussion: ['Why might two people give different meanings to the same colour?', 'What does a flag need so that everyone can recognise it?'],
      reflection: ['What would your class flag say about you?'],
      maths: [
        { task: 'From 6 March 1957 to 2026 is how many years?', answer: '2026 − 1957 = 69 years.' },
        { task: 'The flag has three stripes. If each is 20 cm tall, how tall is the flag?', answer: '3 × 20 = 60 cm.' },
      ],
      support: ['Give learners a flag outline and labels to place.'],
      stretch: ['Compare the Ghana flag with the flags of two other African countries and discuss shared colours.'],
      localise: ['Link to national days and school assemblies; follow school rules on handling the flag.'],
      discoveryStatus: {
        whatWeKnow: ['Theodosia Okoh designed the flag adopted on 6 March 1957.', 'The flag was later changed for a few years and then restored in the 1960s.'],
        whatWeAreStillDiscovering: ['The exact years of the change, which sources give differently.', 'Whether every detail of the colour meanings is official or has grown in popular teaching.'],
      },
      factCheck: [
        { claim: 'The flag was adopted on 6 March 1957; Theodosia Okoh, an artist and teacher, designed it; red, gold and green stripes with a black star; the star is linked to Marcus Garvey’s Black Star Line and to the national football team’s nickname; the flag was changed in the 1960s and the original reinstated in 1966.', explanation: 'From Wikipedia’s Flag of Ghana article, which itself carries a tone notice and has weak support for the colour meanings, and whose dates for the 1960s change are inconsistent.', reference: 'Wikipedia, “Flag of Ghana”. Check also the Ghana Museums and Monuments Board and national archives.' },
        { claim: 'Ghana gained independence from Britain on 6 March 1957 under Kwame Nkrumah; the flag was designed by Theodosia Salome Okoh; red stands for those who died for independence, gold for mineral wealth, green for the land and the black star for the people and African emancipation.', explanation: 'From South African History Online, which also calls Ghana the first to gain independence from European colonialism.', reference: 'South African History Online, “Gold Coast (Ghana) gains independence”.' },
      ],
    },
  }),
];

