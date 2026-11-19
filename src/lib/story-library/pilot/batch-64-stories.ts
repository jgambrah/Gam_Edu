import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { PilotStory } from './pilot-stories';

type Page = PilotStory['pages'][number];
type Acts = PilotStory['activities'];

const pg = (
  motif: string,
  text: string,
  alt: string,
  narration = 'Warm storyteller’s voice suited for JHS learners; pause briefly at each turn of the story and before the ending.'
): Page => ({
  motif,
  text,
  alt,
  brief: `Warm hand-painted gouache folk-tale scene, landscape 4:3, following the character notes exactly. ${alt} Keep a calm, uncluttered area for text.`,
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
  factCheck?: NonNullable<PilotStory['teacherGuide']>['factCheck'] | string[];
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
        'Read stories with a distinct, natural voice for each character; read articles as one clear narrator.',
        'Pause for two seconds at each comprehension check so learners can reason first.',
        'Pronounce the names of characters and places clearly, with respect for the languages they come from.',
      ],
    },
    music: s.music,
    culturalNotes: s.culturalNotes,
    reviewQuestions: [
      'Is the language right for the stated JHS age band (Basic 7 to Basic 9) and BECE conceptual level?',
      'Is the story told with respect for the people it comes from, and is its lesson clear?',
      ...s.reviewQuestions,
    ],
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
      ...(g.factCheck ? { factCheck: g.factCheck as NonNullable<PilotStory['teacherGuide']>['factCheck'] } : {}),
    },
  };
};

/**
 * Batch 64 (African Legends, set 1: six Ghanaian legends as four stories and two articles, nine pages each, with activities), for JHS (Basic 7 to Basic 9).
 * Each piece is linked to Social Studies, English Language, Science, or Mathematics (see the teacher guide).
 * Stories list their characters; articles have none. All scenes and child characters are invented; the legends come from oral tradition and history.
 * Original text written for Ghanaian learners; each factCheck note says what to verify, and where versions of a tradition differ.
 * To verify before seeding: classIds, readingLevel, themes, genres, objectives, and ghanaianContext against ../classification.ts;
 * whether `maths` may be an empty array; and all NaCCA curriculum codes.
 */

export const BATCH_64_AFRICAN_LEGENDS_GHANA: PilotStory[] = [
  // 1
  mk({
    key: 'the-drummer-at-noon',
    title: 'The Drummer at Noon',
    summary:
      'Twelve-year-old Akwasi has one job on the biggest day in Kumasi: play the call when Okomfo Anokye lifts his hand. A real-time story about how a shared symbol and shared laws turned proud chiefs into one nation.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'responsibility', 'kindness', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['african-legends', 'ghanaian-setting', 'okomfo-anokye', 'asante', 'unity'],
    wpm: 125,
    paceWord: 'Tense, then awed, then thoughtful',
    palette: ['#b45309', '#1e3a8a'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Akwasi: a twelve-year-old apprentice drummer in Kumasi.',
      'The royal drummer: his master, whose knee is swollen.',
      'Okomfo Anokye: a priest and counsellor, calm and sharp-eyed.',
      'Nana Osei Tutu I: the Kumasihene, tall and quiet.',
      'The chiefs: proud leaders of the Akan states, each under an umbrella.',
    ],
    music: 'A single talking drum building slowly, with a long silence at noon (placeholder)',
    pages: [
      pg(
        '🥁',
        'Noon in Kumasi, and Akwasi’s hands would not stop shaking. In front of him stood the pair of great talking drums, almost as tall as his chest, and in his hands were two curved sticks. Around him sat every chief of the new Asante union, each beneath his own bright umbrella, and thousands of people packed the open ground in silence. Akwasi was only twelve years old. He was apprentice to the royal drummer, whose knee had swollen that very morning. Now the boy must play the call the moment Okomfo Anokye raised his hand. “Breathe,” whispered his master from the shade. “The drum already knows the words.” Akwasi breathed in, and out, and waited, and remembered how the day had begun.',
        'A boy with a pair of atumpan talking drums, played with two curved sticks, before a silent crowd and chiefs seated under bright umbrellas.'
      ),
      pg(
        '🌅',
        'At dawn, Kumasi had woken up nervous. Akwasi carried water for his master and heard grown-ups arguing at every corner. For years, King Ntim Gyakari of Denkyira had made the Akan states pay heavy tribute, and now their chiefs had gathered in Kumasi to break free. But Kumasi was full of worry. Every chief had his own stool, his own soldiers and his own pride. “Why should we obey Kumasi?” said some. “Why should we kneel to anyone?” said others. The old drummer shook his head as he tightened the cords of the drums. “Fear can start a war,” he told the boy. “Only agreement can win it, and keep the peace afterwards.”',
        'A boy carrying water at dawn past men arguing in a Kumasi street while an old drummer tightens a drum.'
      ),
      pg(
        '🏛️',
        'By eight o’clock, Akwasi was sent to the palace with a message. There he saw the two men whom everyone talked about in whispers. Nana Osei Tutu, the Kumasihene, was tall and calm. Beside him stood Okomfo Anokye, a priest and counsellor whose eyes seemed to count everything in the room. “Little drummer,” said Okomfo Anokye, “tell me what the people are saying in the streets.” Akwasi told him the truth, even the rude parts. Okomfo Anokye smiled. “Good. A leader who hears only praise is already lost. Today we will give these chiefs something to hold in common, something that none of them can own alone.”',
        'A boy in a palace courtyard speaking to two men, one tall and calm and one with watchful eyes.'
      ),
      pg(
        '☂️',
        'At ten o’clock, the chiefs began to arrive with their drummers, linguists and stool carriers. Akwasi counted the umbrellas until he lost track. Okomfo Anokye walked among the visitors, greeting each chief by name and asking quiet questions. He explained that a union needs more than courage in battle. It needs laws that every chief will swear to keep, a place to bring quarrels before they turn into wars, and a promise that the strong will not swallow the small. “A drum can call a crowd,” he told them, “but only an oath can keep it together.” Some chiefs nodded. Others folded their arms and waited to be impressed.',
        'Chiefs arriving under umbrellas with drummers and stool carriers while a priest greets each one.'
      ),
      pg(
        '⚡',
        'Then came noon. Okomfo Anokye raised his hand, and Akwasi struck the drums. The call rolled out across Kumasi like thunder, again and again. The sky darkened, the air grew heavy, and a deep rumble answered from above. The elders say that, on a Friday, a stool of gold came down slowly out of the clouds, wrapped in a white cloth, and settled on the knees of Nana Osei Tutu without touching the ground. Nobody breathed. Akwasi forgot his fear and kept the rhythm steady until the last beat faded. Whatever each person thought they had seen, everyone agreed on one thing: nobody in Kumasi would ever forget that noon.',
        'A golden stool, partly veiled in white cloth, descending from dark clouds toward a seated chief while a boy drums and a crowd watches in awe.'
      ),
      pg(
        '🤝',
        'Okomfo Anokye turned to the chiefs. “This is the Golden Stool, Sika Dwa Kofi, the stool that came on a Friday,” he said. “It is not the seat of one man. It holds the soul of the whole Asante nation, the living and those not yet born.” To bind every chief to it, he asked each one for a small clipping of hair or nail. These were mixed with sacred medicine and given to the stool, so that no chief could say it belonged to somebody else, and none could say he was not part of it. Akwasi watched the proudest chief step forward last. The man gave his clipping with a steady hand, and the crowd murmured.',
        'A priest addressing seated chiefs as one proud chief steps forward last to offer a small token.'
      ),
      pg(
        '🪑',
        'Okomfo Anokye then spoke the rules for the stool. Nobody may sit on it. It rests on its own small seat and never touches the earth. It is carried out only on great occasions and guarded with more care than any king’s treasure. Nana Osei Tutu himself, who now held the title Asantehene, would sit on his own stool, not on the golden one. “Why not?” a young chief asked. “If the stool belonged to one person,” Okomfo Anokye answered, “people would fight to own it. Because it belongs to everyone, they will stand together to protect it.” Akwasi turned that answer over in his mind like a coin.',
        'The Golden Stool, partly veiled in white cloth, resting on its own small chair while a young chief questions a priest.'
      ),
      pg(
        '🗡️',
        'As the sun went down, Okomfo Anokye walked to an open place in Kumasi and drove his sword into the ground. The elders say it sank deep, and that nobody has been able to pull it out since. It was a sign, he said, that the union was rooted, and that the nation would stand as long as its people stood together. Then he did something very simple. He took a bundle of thin sticks tied with cord. A single stick snapped easily, but nobody could break the whole bundle. Today people still visit the place where the sword is shown, in the grounds of the Komfo Anokye Teaching Hospital.',
        'A priest planting a sword in the ground at sunset and holding a tied bundle of sticks before the crowd.'
      ),
      pg(
        '🔥',
        'That night, Akwasi sat by the fire, his hands finally still. Okomfo Anokye passed by and stopped. “Tell me, drummer, why do you think I called down a stool and not just a speech?” Akwasi thought for a long time. “Because a nation is too big to see,” he said at last. “But a stool, you can look at.” Okomfo Anokye laughed softly and walked on into the dark. Akwasi never forgot it. Every school, town and country keeps something that stands for everyone and belongs to no one alone. What is yours? Who would be hurt if it were disrespected, and what would it take to protect it?',
        'A boy by a night fire as a priest walks away smiling into the dark.'
      ),
    ],
    activities: [
      {
        id: 'ga-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Okomfo Anokye say he wanted to give the chiefs?',
        options: [
          'A larger army for each chief to command in war',
          'A shared symbol that none could own alone',
          'A new road that joined every town to Kumasi',
        ],
        correctIndex: 1,
      },
      {
        id: 'ga-c2',
        type: 'comprehension',
        afterPage: 6,
        question: 'What does the Golden Stool stand for in the story?',
        options: [
          'The personal seat of the Asantehene',
          'The great wealth of the richest chief',
          'The soul of the whole Asante nation',
        ],
        correctIndex: 2,
      },
      {
        id: 'ga-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'Why may nobody sit on the Golden Stool?',
        options: [
          'It belongs to the nation, not one person',
          'It is too small for a grown man to use',
          'It was made only to be used at festivals',
        ],
        correctIndex: 0,
      },
      {
        id: 'ga-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: A school keeps one flag that every class respects. Using the story, why is this useful?',
        options: [
          'It helps the headteacher to decide which class is best',
          'It lets each class make its own separate set of rules',
          'It gives every class something shared, owned by none',
        ],
        correctIndex: 2,
      },
      {
        id: 'ga-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'The chiefs argue about who should obey whom',
          'Okomfo Anokye speaks about laws and a shared oath',
          'Akwasi plays the call and the stool descends',
          'Each chief gives a clipping to the stool',
          'Okomfo Anokye drives his sword into the ground',
        ],
      },
      {
        id: 'ga-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'oath',
        definition: 'A serious promise, often made before witnesses.',
        distractors: [
          'A long stick used to play a drum',
          'A cloth worn by a chief on special days',
        ],
      },
    ],
    glossary: [
      {
        word: 'union',
        definition: 'A group of states or peoples joined together.',
        pages: [1, 4],
      },
      {
        word: 'apprentice',
        definition: 'A young person learning a skill from an expert.',
        pages: [1],
      },
      {
        word: 'linguists',
        definition: 'Court officials who speak on behalf of a chief.',
        pages: [4],
      },
      {
        word: 'oath',
        definition: 'A serious promise, often made before witnesses.',
        pages: [4],
      },
      {
        word: 'soul',
        definition: 'The deep spirit of a person or a people.',
        pages: [6],
      },
      {
        word: 'Asantehene',
        definition: 'The king of the Asante.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Source and tradition: Okomfo Anokye and Nana Osei Tutu I are central figures in the founding of the Asante union, around 1701, when the Akan states united against the tribute demands of Denkyira (the Battle of Feyiase). In the Manhyia account the Golden Stool (Sika Dwa Kofi) was conjured as the seal of that union, before the war; some retellings place it after. Its descent is foundational oral tradition, told in several versions, and is not claimed as proven history.',
      'Original piece written for Ghanaian JHS learners from well-known oral tradition and history. The scenes and child characters are invented, and it copies no published retelling or epic text.',
      'Respect: the Golden Stool is sacred to the Asante. Learners must never sit on, copy, or play with a stool as if it were the Golden Stool. The clipping ritual is mentioned only briefly and is not a model to follow. Akwasi and the royal drummer are invented.',
    ],
    reviewQuestions: [
      'Ask an Asante elder or teacher to confirm that the Golden Stool story is told respectfully, and that the stool is shown as conjured before the war with Denkyira.',
      'Confirm that the sword site in the grounds of the Komfo Anokye Teaching Hospital is described correctly.',
      'Check the sums: 8 × 5 = 40 and 12 × 3 = 36.',
    ],
    guide: {
      overview:
        'A real-time story of the day the Golden Stool was called, showing how shared laws and a shared symbol held the Asante union together.',
      lessonMinutes: 45,
      goals: [
        'Retell the day in order.',
        'Explain why the chiefs needed something to hold in common.',
        'Say why nobody may sit on the Golden Stool.',
        'Name a symbol that stands for everyone in your own community.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: history, national symbols, and unity; codes to verify)', 'Symbols that unite a people'],
        ['English Language (NaCCA CCP: narrative; codes to verify)', 'A story told in real time'],
      ],
      before: ['Ask: what is something in our school that belongs to everyone and to no one alone?'],
      during: ['Stop after Page 4. Ask: what could Okomfo Anokye give the chiefs that none of them could own?'],
      after: ['Pairs list three symbols of Ghana and say what each stands for.'],
      discussion: ['Why might a nation need a symbol as well as laws?'],
      reflection: ['What would it take for you to protect something that belongs to everyone?'],
      maths: [
        {
          task: 'Akwasi sees 8 chiefs, and each has 3 stool carriers and 2 drummers with him. How many carriers and drummers is that in all?',
          answer: '8 × (3 + 2) = 8 × 5 = 40.',
        },
        {
          task: 'The drum call was played 12 times in each of 3 rounds. How many times was it played?',
          answer: '12 × 3 = 36 times.',
        },
      ],
      support: ['Provide a time line of the day: dawn, eight, ten, noon, sunset, night.'],
      stretch: ['Find out how the Asante use the Golden Stool at the Akwasidae festival, and write three sentences.'],
      localise: ['Ask an elder what symbols your own community keeps for everyone.'],
      factCheck: ['The story is fiction around known history. The union around 1701 and the sword site in Kumasi are documented; the descent of the Golden Stool is oral tradition, placed before the war with Denkyira in the Manhyia account. Akwasi is invented. Confirm the details with an Asante elder or teacher.'],
    },
  }),

  // 2
  mk({
    key: 'amas-diary-ejisu-1900',
    title: 'Ama’s Diary, Ejisu 1900',
    summary:
      'Thirteen-year-old Ama writes a diary in Ejisu in 1900, as the elders hesitate and a Queen Mother steps forward. A diary story about moral courage, and about who stands up when others hold back.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'responsibility', 'kindness', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['african-legends', 'ghanaian-setting', 'yaa-asantewaa', 'asante', 'courage'],
    wpm: 125,
    paceWord: 'Quiet, tense, and moving',
    palette: ['#7c2d12', '#166534'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Ama: a thirteen-year-old girl in Ejisu who writes the diary.',
      'Papa: her father, who serves a chief and carries news.',
      'Mama: her mother, practical and kind.',
      'Auntie Serwaa: a neighbour who speaks wisely at the stream.',
      'Nana Yaa Asantewaa: the Queen Mother of Ejisu.',
    ],
    music: 'Soft strings with a distant drum, ending in a slow, warm horn (placeholder)',
    pages: [
      pg(
        '📖',
        'Ejisu, late March 1900. Dear Diary, Papa came home from Kumasi with a face like a closed door. He ate nothing, and when I begged, he finally told me why. The new British Governor has demanded the Golden Stool, and he has even asked why he was not given it to sit on! Papa says that is like asking to sit on the soul of every Asante person who has ever lived. Mama dropped her ladle and did not pick it up. I do not understand everything yet, but I know fear when I see it, and tonight I saw it in my parents. I will write it all here so nobody can say it did not happen. Ama',
        'A girl writing in a book by lamplight while her parents sit silent beside a cooking fire.'
      ),
      pg(
        '💧',
        'Ejisu, a few days later. Dear Diary, our house is full of whispers. Since 1896, when the British took King Prempeh I and other leaders far across the sea, Asante has had no Asantehene on his stool. Papa says the chiefs are afraid to fight and afraid to do nothing. At the stream today, the women talked of nothing else. Auntie Serwaa said, “The Golden Stool is not a chair. It is our grandparents and our grandchildren sitting together.” Everyone nodded. Nobody I know can say where the Stool is hidden, and Papa says that is exactly how it should be. A secret that many people know is not a secret. Ama',
        'Women gathered at a stream with pots, speaking quietly while a girl listens.'
      ),
      pg(
        '👑',
        'Ejisu, early April. Dear Diary, today I met the Queen Mother of Ejisu, Nana Yaa Asantewaa! She walked down our lane with her stool carrier, an old woman with a straight back and quiet eyes. Everybody stood. She asked Mama for water and drank slowly, looking at the red earth. Then she asked me my name and my age. “Thirteen,” I said. “Then you will remember this year,” she said. Papa says she is a farmer and a royal counsellor, who listens first and speaks afterwards. She did not look afraid of anything. But I think she was thinking very hard. Ama',
        'An elderly queen mother with a straight back drinking water in a village lane while a girl watches.'
      ),
      pg(
        '🔥',
        'Ejisu, mid-April. Dear Diary, Papa came back from the secret meeting of the chiefs, and tonight he told us what happened, in a whisper. Many chiefs sat with their heads down. Some wanted to talk to the Governor again. Others said Asante could not win against soldiers with guns that fire so quickly. Then the Queen Mother of Ejisu stood up. Papa says she spoke plainly. She said that the brave Asante of old would never have let a stranger take the Stool, and that if the men would not go forward, then the women would go instead. For a long time, Papa says, nobody spoke. Ama',
        'A father whispering to his family around a fire about a meeting of chiefs.'
      ),
      pg(
        '🍲',
        'Ejisu, late April. Dear Diary, the chiefs have chosen the Queen Mother to lead them! Papa says it is very rare for a woman to lead an army, and he looked proud when he said it. Our village has changed in a week. Men are mending old guns and sharpening tools. Women, led by Mama, are cooking and packing food and carrying water. I was given a job too: counting baskets of roasted corn and writing the numbers on a board. Nana Yaa Asantewaa visited our compound again. She said a nation is like a big pot of soup, and everybody must bring something to it, even a child with a pencil. Ama',
        'Village women packing food and a girl counting baskets of corn on a board.'
      ),
      pg(
        '🕯️',
        'Ejisu, June. Dear Diary, the war is not like a story. It is waiting and listening. The British Governor and his soldiers are inside their fort in Kumasi, and Asante forces are all around it. We children are told to stay near the house. Food is getting short, and I have learned how to make one meal feel like two. Mama says courage is mostly ordinary jobs done on frightened days. At night I hear drums far away, and I wonder who is listening to them. I am trying not to be afraid. Some nights I succeed, and some nights I write in this diary instead. Ama',
        'A girl by a small lamp writing in her diary while distant drums are heard and her mother sleeps nearby.'
      ),
      pg(
        '💧',
        'Ejisu, July. Dear Diary, there is bad news. More soldiers have arrived from the coast, with heavier weapons, and the war has turned against us. Many families have lost people. Our neighbour, Kofi’s mother, has not spoken for two days. I cried when I heard, and Mama held me and said that tears are not weakness. They are love with nowhere to go. She also said that when news is too heavy, we must never carry it alone. So I told her how I felt, and then I told Auntie Serwaa. It helped more than I expected. Tomorrow I will take Kofi’s mother some water and sit with her. Ama',
        'A girl being held by her mother in a dim room, with a neighbour’s house visible through the doorway.'
      ),
      pg(
        '🌊',
        'Ejisu, 1921. Dear Diary, I am a grown woman now, with children of my own, and today there is news from far away. The British took the Queen Mother and other leaders across the sea to the Seychelles, a group of small islands very far from home. The Governor never sat on the Golden Stool, because the people kept it hidden and safe. Nana Yaa Asantewaa lived in exile for many years, and this year we heard that she has died there. We mourned her at home, though her grave is so far away. I cried again, as I did when I was thirteen, and I was not ashamed. Ama',
        'A grown woman at a window holding her diary, looking toward the distant horizon with her children beside her.'
      ),
      pg(
        '🌅',
        'Ejisu, 6 March 1957. Dear Diary, I am seventy, and this is my last page. Today is Ghana’s Independence Day, and I stood in the crowd with my grandchildren as the new flag rose. I told them how King Prempeh I came home from exile and made sure that the remains of Nana Yaa Asantewaa and the other exiles were brought back for a royal burial. The little ones asked why everyone was cheering for a grandmother of long ago. I said that she stood up when others hesitated. Then I wondered, as I wonder every year, whether I would have stood up too. So I ask you, whoever reads this: where in your life is somebody waiting for a brave person to speak first? Ama',
        'An old woman in a crowd with her grandchildren as a new national flag rises over a cheering crowd under a bright sky.'
      ),
    ],
    activities: [
      {
        id: 'gb-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What was Nana Yaa Asantewaa’s title in Ejisu?',
        options: [
          'Queen Mother of Ejisu',
          'Wife of the British Governor',
          'Chief linguist of the king',
        ],
        correctIndex: 0,
      },
      {
        id: 'gb-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did she say at the secret meeting of the chiefs?',
        options: [
          'The Governor should be given the Golden Stool to sit on',
          'If the men would not go forward, the women would',
          'The chiefs should wait quietly for the British to leave',
        ],
        correctIndex: 1,
      },
      {
        id: 'gb-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What helped Ama when the news was too heavy?',
        options: [
          'Telling her mother and Auntie Serwaa',
          'Keeping quiet and staying very busy',
          'Hiding in the fields until it passed',
        ],
        correctIndex: 0,
      },
      {
        id: 'gb-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: At a meeting, nobody wants to speak up about an unfair rule. What does the diary suggest?',
        options: [
          'Stay silent and hope that somebody else will speak up',
          'Speak calmly and clearly, and invite others to join',
          'Wait outside and complain to friends about it afterwards',
        ],
        correctIndex: 1,
      },
      {
        id: 'gb-s1',
        type: 'sequencing',
        prompt: 'Put the events of the diary in order.',
        items: [
          'Ama’s father brings news of the Governor’s demand',
          'Ama meets the Queen Mother in the lane',
          'The Queen Mother speaks at the secret meeting of the chiefs',
          'The chiefs choose her to lead them',
          'Ghana celebrates independence and Ama remembers the Queen Mother',
        ],
      },
      {
        id: 'gb-voc',
        type: 'vocabulary',
        afterPage: 8,
        word: 'exile',
        definition: 'Being made to live away from your home country.',
        distractors: [
          'A very long journey made on foot',
          'A meeting held in secret by chiefs',
        ],
      },
    ],
    glossary: [
      {
        word: 'Governor',
        definition: 'The person sent to rule a colony for a foreign country.',
        pages: [1],
      },
      {
        word: 'Asantehene',
        definition: 'The king of the Asante.',
        pages: [2],
      },
      {
        word: 'counsellor',
        definition: 'A person who gives wise advice to a ruler.',
        pages: [3],
      },
      {
        word: 'exile',
        definition: 'Being made to live away from your home country.',
        pages: [8],
      },
      {
        word: 'independence',
        definition: 'Freedom of a country to rule itself.',
        pages: [9],
      },
      {
        word: 'hesitated',
        definition: 'Paused because of doubt or fear.',
        pages: [9],
      },
    ],
    culturalNotes: [
      'Source and history: the Governor’s demand for the Golden Stool was made in Kumasi in March 1900, and Nana Yaa Asantewaa, Queen Mother of Ejisu, led the Asante in the War of the Golden Stool that followed. She and other leaders were exiled to the Seychelles, where she died in 1921. Sources say King Prempeh I made sure that the remains of the exiles were brought home for royal burial after his return; the year is given differently (1924 or later), so the story gives none. Ama and her family are invented.',
      'Original piece written for Ghanaian JHS learners from well-known oral tradition and history. The scenes and child characters are invented, and it copies no published retelling or epic text.',
      'Sensitive: the story mentions war, loss and grief gently. Teachers should be ready to point learners who are upset to the school counsellor or a trusted adult. This is not professional advice. The Queen Mother’s words at the meeting are paraphrased, not quoted.',
    ],
    reviewQuestions: [
      'Confirm the dates: the Governor’s demand in March 1900, the exile to the Seychelles, her death in 1921, and the return of her remains, for which sources give different years, so none is stated.',
      'Check that the diary treats the war and the loss gently enough for the age group.',
      'Check the sums: 24 × 15 = 360 and 13 + 57 = 70.',
    ],
    guide: {
      overview:
        'A diary story set in Ejisu in 1900 showing how one Queen Mother stood up when others hesitated, and what that courage meant for later generations.',
      lessonMinutes: 45,
      goals: [
        'Retell the diary in order.',
        'Explain why the Golden Stool mattered so much to the Asante.',
        'Describe what Nana Yaa Asantewaa did at the meeting.',
        'Discuss when it takes courage to speak first.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: history, resistance to colonial rule, and national heroes; codes to verify)', 'The War of the Golden Stool'],
        ['English Language (NaCCA CCP: diary writing; codes to verify)', 'Writing diary entries'],
      ],
      before: ['Ask: who is someone you admire for standing up when others stayed silent?'],
      during: ['Stop after Page 4. Ask: why might it be hard to speak first at a meeting?'],
      after: ['Learners write one diary entry from the point of view of a child in 1900.'],
      discussion: ['Why did the Queen Mother’s words matter so much at that meeting?'],
      reflection: ['Where do you need courage to speak first?'],
      maths: [
        {
          task: 'Ama counts 24 baskets of corn, each holding 15 kg. How many kilograms is that in all?',
          answer: '24 × 15 = 360 kg.',
        },
        {
          task: 'Ama was 13 in 1900. How old was she on Independence Day in 1957?',
          answer: '1957 − 1900 = 57 years; 13 + 57 = 70.',
        },
      ],
      support: ['Give a diary template: date, what happened, how I feel.'],
      stretch: ['Find out about the Seychelles and write a short fact sheet.'],
      localise: ['Ask an elder how Nana Yaa Asantewaa is remembered in your community.'],
      factCheck: ['The story is fiction around known history. The March 1900 demand, the War of the Golden Stool, the exile to the Seychelles and her death in 1921 are documented. The return of her remains home for royal burial is described without a year, because sources differ; confirm with an Asante elder or Manhyia. Ama and her family are invented.'],
    },
  }),

  // 3
  mk({
    key: 'walking-backwards-from-notsie',
    title: 'Walking Backwards from Notsie',
    summary:
      'On the shore by the lagoon, a grandmother makes her grandchildren walk backwards and read their footprints. Then she tells how the Anlo-Ewe left Notsie. A story told from the end about patience, a clever plan, and the soft place in the wall.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'responsibility', 'kindness', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['african-legends', 'ghanaian-setting', 'togbe-tsali', 'anlo-ewe', 'notsie'],
    wpm: 125,
    paceWord: 'Warm, quiet, and gradually thrilling',
    palette: ['#0e7490', '#a16207'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Nana Afi: an elder of Anloga who tells the story at the shore.',
      'Mawuena: her eleven-year-old grandson, who asks the questions.',
      'Togbe Tsali: a wise spiritual leader of the Anlo-Ewe in the story of the past.',
      'Togbe Tegli: an old man of Notsie with a clever idea.',
      'King Agorkoli: the king of Notsie, who ruled harshly.',
    ],
    music: 'Waves and a soft gourd rattle, with a low drum that returns at the end (placeholder)',
    pages: [
      pg(
        '🏖️',
        'The tide was out at the Keta Lagoon, and the sand was wet and shining. Nana Afi had brought her grandchildren to the shore for a game. “Walk across the sand to the water,” she said, “but walk backwards.” The children laughed and shuffled along with their eyes on the sky. “Now turn around,” she said, “and read your footprints.” Mawuena frowned. The prints seemed to be marching away from the water, towards the town, though he had walked the other way. “Good,” said Nana Afi. “Your feet are telling a lie. Our ancestors told the same lie, long ago, to escape from a king.”',
        'Children walking backwards on wet sand by a lagoon while an elder watches, their footprints pointing the wrong way.'
      ),
      pg(
        '🧱',
        'Nana Afi sat on an upturned canoe and began. “Many generations ago, our people lived in Notsie, a great walled town in what is now the Republic of Togo. The king, King Agorkoli, was strong, but he ruled harshly. People were made to carry heavy loads and build for him without rest, and many were afraid to speak. Families whispered at night that they must find a new home, but how? The town was ringed by a wall so thick and high that no one could pass.” Mawuena stared. “Did the wall keep enemies out, Nana, or keep our people in?” “Both,” she said.',
        'An elder seated on a canoe telling a story to children, with a faint picture of a walled town above them.'
      ),
      pg(
        '🧱',
        '“The wall,” said Nana Afi, “was built of red clay mixed with thorns, as wide as a road and taller than three men. At first it protected Notsie. In time it became a cage. Guards watched day and night, and the king’s court believed that no one could ever slip past. People were made to build, and carry, and obey, and they began to forget what it felt like to be free. But hope is stubborn, and it grows in the smallest corners.” Mawuena looked at the footprints at his feet. “So how did they get out?” “Listen, child. Great problems are sometimes solved by the smallest people, sitting quietly and thinking.”',
        'A tall thorny clay wall around a town at dusk with guards watching from above.'
      ),
      pg(
        '💦',
        '“There was an old man, Togbe Tegli,” said Nana Afi, “and in many tellings he is the first to see the way. He noticed that the wall was made of clay, and clay softens when it is wet. He told the women, ‘Every evening, pour your used water from washing and cooking at the same spot on the wall.’ Nobody in the town thought anything of it. The king’s guards saw women doing their daily work. Night after night, the water soaked in. Slowly, the clay grew soft and weak.” Mawuena’s eyes widened. “They never needed a single weapon!” “Only patience, and everyone together,” said Nana Afi.',
        'Women pouring wash water against the same section of a clay wall in the evening while guards look away.'
      ),
      pg(
        '🔮',
        '“Then came our own Togbe Tsali,” said Nana Afi. “In our Anlo tradition he was a wise hunter and spiritual leader, a man of dreams and prayers whom many trusted. He explained the plan. Everyone would leave on a dark night, carrying only what they could carry. And all would walk backwards, so that their footprints would point into Notsie, not out of it, and the king’s trackers would think visitors had come in.” The children giggled. “But the guards must not notice,” she added. “In one telling, Togbe Tsali enchanted a drum so that the court fell asleep. In another, the people drummed and danced as they always did. Other Ewe peoples tell it differently too, and we honour every telling.”',
        'A calm spiritual leader explaining a plan to a circle of listening villagers by firelight, a drum beside him.'
      ),
      pg(
        '🌑',
        '“The night came,” said Nana Afi, her voice dropping. “The moon hid behind clouds. From the dance ground came the throb of drums, the music the guards were used to hearing. Mothers tied babies on their backs. Boys led the goats by the ears. Grandfathers leaned on their sticks. Togbe Tsali raised his hand, and one by one the people turned their backs to the road and began to walk backwards towards the softened place in the wall. Nobody coughed. Nobody spoke. The wet clay gave way under the push of many hands, and a gap opened, wide enough for a family at a time. They stepped through into the dark, one slow, backward step after another.”',
        'A line of families with children, goats and bundles walking backwards through a gap in a wall under a clouded moon.'
      ),
      pg(
        '👣',
        '“At dawn, the guards found the people gone,” Nana Afi went on. “The king’s trackers searched along the wall and found hundreds of footprints, but all of them led into the town. ‘Impossible,’ they said. ‘These people are coming home!’ By the time they understood the trick, the travelling families were many hours away, crossing rivers and farmland. King Agorkoli was angry, but his anger could no longer reach them.” “Nana,” said Mawuena, “I do not think it was a trick. I think it was a very clever plan.” She smiled. “Perhaps both. You have an old head on young shoulders.”',
        'Trackers in the morning light puzzling over footprints that all point toward the town.'
      ),
      pg(
        '🌴',
        '“The road was not easy,” she said. “They crossed rivers and forests, and children grew tired and hungry. Some groups turned to other lands, and that is why Ewe people live in many places today. Our Anlo ancestors came at last to the coast, between the sea and the lagoon, where the wind is cool and the fish are plenty. They built houses and began again. They remembered Notsie in their songs and sayings, and they remembered Togbe Tsali, who had led them with wisdom. Historians think these events happened several hundred years ago, and every year the memory is kept alive in stories like this one.”',
        'Weary families arriving at a breezy coast between a lagoon and the sea, building the first houses.'
      ),
      pg(
        '🌊',
        'The tide had turned, and the water was creeping over the children’s footprints one by one. “So that is why you made us walk backwards,” said Mawuena. “So that we would remember.” Nana Afi nodded. “And to teach you something about courage. Our ancestors did not win by being stronger than the king. They won by being patient, together, and clever, and by trusting a plan. When you face something much bigger than you, what might be the soft place in the wall? And who could you ask to help you pour the water?” Mawuena looked back at the sea, thinking.',
        'A boy and his grandmother at the water’s edge as the tide covers the footprints, the boy thinking.'
      ),
    ],
    activities: [
      {
        id: 'gc-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why was it so hard for the people to leave Notsie?',
        options: [
          'The king had taken all of their canoes',
          'The rivers were too wide to cross',
          'A thick, thorny wall ringed the town',
        ],
        correctIndex: 2,
      },
      {
        id: 'gc-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'How did the women help in Togbe Tegli’s plan?',
        options: [
          'They carried the clay away from the wall in baskets',
          'They poured used water on one part of the wall',
          'They sang songs until the guards fell fast asleep',
        ],
        correctIndex: 1,
      },
      {
        id: 'gc-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'Why did the people walk backwards?',
        options: [
          'So that the guards could not see any of their faces',
          'So the children could keep a close eye on the king',
          'So their footprints would seem to enter the town',
        ],
        correctIndex: 2,
      },
      {
        id: 'gc-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: A class wants to clear a huge rubbish heap. Using the story, what is a wise way to begin?',
        options: [
          'Start small, together, with a plan everyone follows',
          'Wait for a much stronger class to come and do it',
          'Choose one pupil to do the whole task alone, quickly',
        ],
        correctIndex: 0,
      },
      {
        id: 'gc-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Nana Afi asks the children to walk backwards on the sand',
          'The people of Notsie plan to escape the walled town',
          'Women pour used water on the wall until the clay softens',
          'The people walk backwards through the gap at night',
          'The families travel and settle on the coast',
        ],
      },
      {
        id: 'gc-voc',
        type: 'vocabulary',
        afterPage: 5,
        word: 'tradition',
        definition: 'A story or custom handed down from one generation to the next.',
        distractors: [
          'A tool used for building a wall',
          'A path that runs along a river',
        ],
      },
    ],
    glossary: [
      {
        word: 'lagoon',
        definition: 'A shallow body of water separated from the sea.',
        pages: [1, 8],
      },
      {
        word: 'generations',
        definition: 'Groups of people born and living at about the same time.',
        pages: [2],
      },
      {
        word: 'harshly',
        definition: 'In a cruel and strict way.',
        pages: [2],
      },
      {
        word: 'tradition',
        definition: 'A story or custom handed down from one generation to the next.',
        pages: [5],
      },
      {
        word: 'trackers',
        definition: 'People who follow footprints and other signs.',
        pages: [5, 7],
      },
      {
        word: 'patient',
        definition: 'Able to wait calmly without giving up.',
        pages: [9],
      },
    ],
    culturalNotes: [
      'Source and tradition: the escape from Notsie is told by the Ewe people, with versions that differ. In Anlo tradition Togbe Tsali is the central spiritual leader; in other Ewe traditions the escape is credited mainly to elders such as Togbe Tegli and to leaders such as Togbe Wenya and Togbe Sri. The story says this openly. The dates are uncertain.',
      'Original piece written for Ghanaian JHS learners from well-known oral tradition and history. The scenes and child characters are invented, and it copies no published retelling or epic text.',
      'Respect and safety: the escape is peaceful and shows no violence. The footprint game is for a flat, clear space, with a partner watching. Ask an Anlo-Ewe speaker to confirm names and pronunciation (Notsie, King Agorkoli, Togbe Tsali, Togbe Tegli) and the two versions of the drums.',
    ],
    reviewQuestions: [
      'Ask an Anlo-Ewe speaker to confirm the Anlo version, the names, and the two versions of the drums (an enchanted drum and a night of drumming and dancing).',
      'Check that the story is fair to the other Ewe traditions mentioned.',
      'Check the sums: 3 × 1.7 = 5.1 and 14 ÷ 7 = 2.',
    ],
    guide: {
      overview:
        'A story told from the end about the Anlo-Ewe escape from Notsie, showing how patience, teamwork and a clever plan can overcome a wall.',
      lessonMinutes: 45,
      goals: [
        'Retell the escape in order.',
        'Explain the roles of Togbe Tegli and Togbe Tsali.',
        'Say why the footprints told a lie.',
        'Find the “soft place in the wall” in a problem of your own.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: history, migration, and our heritage; codes to verify)', 'Ewe migration from Notsie'],
        ['Science (NaCCA CCP: materials; codes to verify)', 'Why wet clay softens'],
      ],
      before: ['Ask: have you ever solved a big problem by starting with one small step?'],
      during: ['Stop after Page 4. Ask: how could water and patience beat a wall?'],
      after: ['Pairs act out the night of the escape, walking backwards slowly on a flat, clear space.'],
      discussion: ['Why might a story say both that the plan was clever and that the people were helped by their leader’s gifts?'],
      reflection: ['What is the soft place in a wall you are facing right now?'],
      maths: [
        {
          task: 'The wall was as tall as three men. If a man is 1.7 m tall, about how high was the wall?',
          answer: '3 × 1.7 = 5.1 m.',
        },
        {
          task: 'The women poured water on the wall every evening for 14 evenings. How many weeks is that?',
          answer: '14 ÷ 7 = 2 weeks.',
        },
      ],
      support: ['Give a four-picture strip: wall, water, backwards, coast.'],
      stretch: ['Find out how different Ewe towns tell the Notsie story, and compare.'],
      localise: ['Ask an Ewe elder how your family or town tells the Notsie story.'],
      factCheck: ['The story is fiction around an Ewe tradition. Versions differ across Ewe groups. In Anlo tradition Togbe Tsali is central; elsewhere Togbe Tegli, Togbe Wenya and Togbe Sri are credited. The drums are told in two ways (a drum enchanted by Togbe Tsali, or a night of drumming and dancing as cover), and the dates are uncertain; confirm with an Anlo-Ewe elder.'],
    },
  }),

  // 4
  mk({
    key: 'esi-asks-at-the-ahobaa',
    title: 'Esi Asks at the Ahobaa',
    summary:
      'On festival morning in Mankessim, eleven-year-old Esi asks her grandfather who Egya Ahor was. Their two voices take turns in a gentle story about a plague, a priest who put his people first, and how we honour him today.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'responsibility', 'kindness', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['african-legends', 'ghanaian-setting', 'egya-ahor', 'fante', 'ahobaa'],
    wpm: 125,
    paceWord: 'Warm, gentle, and reflective',
    palette: ['#9a3412', '#0369a1'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Esi: an eleven-year-old girl in Mankessim who asks the questions.',
      'Grandpa Kweku: her grandfather, a retired teacher.',
      'Egya Ahor: a revered Fante priest and leader in the old story.',
      'Maame Adjoa: a neighbour who has been ill and lives across the street.',
    ],
    music: 'Festival drums softened to a heartbeat, with a warm horn at the end (placeholder)',
    pages: [
      pg(
        '🥁',
        'ESI. The drums woke me before sunrise. It is the day of the Ahobaa Kese festival in Mankessim, and the whole town is moving like a river towards the shrine. Women carry bowls of food, and children carry little flags and run everywhere. I am eleven, and I have been to this festival every year, but this year I want to know more. I tugged Grandpa Kweku’s sleeve and asked the question I had been saving. “Grandpa, who was Egya Ahor? Everybody sings his name, but nobody tells me why.” Grandpa Kweku stopped walking, took my hand, and sat down with me on a low wall.',
        'A girl tugging her grandfather’s sleeve in a festival crowd moving toward a shrine.'
      ),
      pg(
        '🌍',
        'GRANDPA KWEKU. “Long, long ago,” I told her, “our Fante ancestors travelled from Techiman, in the north, to settle nearer the coast, and the place where they stopped became Mankessim. It was a journey of many seasons, with families, elders and priests walking together. Egya Ahor was one of those priests and leaders, a man whom people loved and trusted. He knew the herbs, the prayers and everybody’s name. Every journey has its troubles, the elders say, but this one had a terrible one.” Esi leaned closer. “What was the trouble, Grandpa?” “A sickness, child. A plague.”',
        'An old man telling a story on a low wall to a girl, with a faint picture of travellers on a long road.'
      ),
      pg(
        '😷',
        'ESI. Grandpa’s voice went quiet. “It spread from camp to camp,” he said, “and from family to family. Healers tried every herb they knew. Priests prayed day and night. Still, more people fell ill, and the travellers were frightened. They could not stay, they could not turn back, and they could not stop the sickness.” I held my breath. I thought of the time I had malaria, and how afraid Mama was. Then I tried to imagine thousands of people with no clinic, no nurse and no medicine from the pharmacy. “That is so sad,” I whispered. “Yes,” said Grandpa. “But it is also where Egya Ahor’s story begins.”',
        'A girl listening with wide eyes while her grandfather speaks gravely, a faint picture of a sad camp behind them.'
      ),
      pg(
        '🕊️',
        'GRANDPA KWEKU. “The tradition says that Egya Ahor listened to his people and prayed, and then he said something that made the whole camp go quiet. He said that if one life could save the people, he was willing to give his own. He did not say it lightly, and nobody asked it of him. The elders remember him as a man who loved his people more than his own comfort. We do not tell the rest of this part in detail, because it is very sad. We say only that the sickness weakened after that, and the people were able to travel on and found their homes.” She sat silent beside me.',
        'A gentle scene of an old priest standing among quiet travellers at dusk, his hand raised in prayer.'
      ),
      pg(
        '💭',
        'ESI. I looked at my hands for a while. “Was he afraid, Grandpa?” “I think so,” said Grandpa. “Brave people usually are. Courage is not having no fear. It is doing what is right even though you are afraid.” “But Grandpa,” I said, “that is not fair. Nobody should have to do that.” He smiled at me with wet eyes. “You are right, my child. Nobody should. In those days people understood the world differently and had no hospitals. Today, thank God, we have nurses, clean water and vaccines. We do not honour Egya Ahor by giving up our lives. We honour him by looking after each other’s lives.”',
        'A girl and her grandfather sitting close, he smiling with wet eyes, a clinic building in the background.'
      ),
      pg(
        '🥣',
        'GRANDPA KWEKU. “So how do we remember him?” I asked, to give her a happier thing to think about. “Look around you.” The procession moved past us with drums and songs. “Many families clean their homes and compounds before the festival. We share our food with neighbours, and with strangers. We visit the sick. We sing songs of thanks. The festival is a way of saying that your life matters to the whole community. Once a year the whole town reminds itself of the promise made in the old days, that nobody should have to face trouble alone.” Esi’s face grew thoughtful as the drums went by.',
        'A grandfather pointing to a procession with drums and women carrying food bowls, a girl watching.'
      ),
      pg(
        '🎶',
        'ESI. The procession reached the shrine, and I saw chiefs and elders in their finest cloth, the drummers sweating and smiling, and old women dancing slowly with their eyes closed. It was beautiful and solemn at the same time. Grandpa whispered that the festival is a time of remembering and thanksgiving, and that everybody is welcome to join in respectfully. I stood still with the crowd while the elders offered prayers for the ancestors and for the health of the town. I did not understand every word. But I understood that the whole town was holding the same thought, and that made the air feel warm.',
        'Elders in fine cloth and drummers at a shrine as a hushed crowd stands respectfully.'
      ),
      pg(
        '🏘️',
        'GRANDPA KWEKU. After the prayers, I took Esi to the edge of the crowd. “Do you want to know what I think?” I said. “Tell me,” she said. “I think a hero is not only someone who did one great thing long ago. A hero is also someone who does small things for others, again and again. Carrying water for a neighbour. Sitting with someone who is sick. Washing your hands before you cook. These are the daily versions of Egya Ahor’s promise.” Esi looked across the street to a house where a lamp burned in the window. “Maame Adjoa’s lamp,” she said. “She has been ill all week.”',
        'A grandfather and granddaughter at the edge of a crowd, looking across to a house with a lit lamp in the window.'
      ),
      pg(
        '🍚',
        'ESI. I ran home and filled a flask with warm water and took a bowl of the rice Mama had made for the festival. Grandpa walked with me. Maame Adjoa opened the door slowly, still weak, and smiled when she saw my bowl. “Egya Ahor has sent you,” she said. I laughed. “No, Maame. I came by myself, with my grandfather.” We sat with her until the drums went quiet, and we helped her to bed. It was a small action, just a bowl of rice and an hour of company. But I think Egya Ahor would have understood it.',
        'A girl bringing a bowl of rice to a weak but smiling neighbour at her door, with her grandfather behind.'
      ),
    ],
    activities: [
      {
        id: 'gd-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What problem did the Fante travellers face on their journey?',
        options: [
          'A drought that dried up every stream and river',
          'A war with the people who lived on the coast',
          'A plague that spread among the people',
        ],
        correctIndex: 2,
      },
      {
        id: 'gd-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'According to Grandpa, how do we best honour Egya Ahor today?',
        options: [
          'By looking after each other’s lives and health',
          'By walking long distances on foot every single year',
          'By keeping the whole story secret from the children',
        ],
        correctIndex: 0,
      },
      {
        id: 'gd-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What does Grandpa say the festival reminds the town?',
        options: [
          'That the old customs must never change',
          'That nobody should face trouble alone',
          'That the strongest family should always lead',
        ],
        correctIndex: 1,
      },
      {
        id: 'gd-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: A classmate has been absent with a fever. Using the story, what is a kind response?',
        options: [
          'Check on them kindly and share your notes',
          'Tell everyone that they are probably lazy',
          'Wait for them to ask you for any help',
        ],
        correctIndex: 0,
      },
      {
        id: 'gd-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Esi asks Grandpa who Egya Ahor was',
          'Grandpa tells of the plague on the journey to Mankessim',
          'Egya Ahor offers his life for his people',
          'Esi learns how the town remembers him today',
          'Esi takes food to a sick neighbour',
        ],
      },
      {
        id: 'gd-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'plague',
        definition: 'A deadly disease that spreads quickly among many people.',
        distractors: [
          'A long journey made by many families',
          'A shrine where priests say their prayers',
        ],
      },
    ],
    glossary: [
      {
        word: 'shrine',
        definition: 'A holy place where people pray and remember.',
        pages: [1, 7],
      },
      {
        word: 'plague',
        definition: 'A deadly disease that spreads quickly among many people.',
        pages: [2],
      },
      {
        word: 'priests',
        definition: 'People who lead prayers and care for sacred places.',
        pages: [2, 3],
      },
      {
        word: 'courage',
        definition: 'Doing what is right even when you are afraid.',
        pages: [5],
      },
      {
        word: 'vaccines',
        definition: 'Medicines that protect people from some diseases.',
        pages: [5],
      },
      {
        word: 'procession',
        definition: 'A line of people moving together in a ceremony.',
        pages: [6, 7],
      },
    ],
    culturalNotes: [
      'Source and tradition: according to Fante oral history, Egya Ahor was a revered priest and leader who offered his life to end a plague during the Fante migration from Techiman to Mankessim, remembered at the Ahobaa Kese festival. The story is told as tradition, not as proven history. The Effutu Aboakyer festival of Winneba is a different tradition and is not part of this story.',
      'Original piece written for Ghanaian JHS learners from well-known oral tradition and history. The scenes and child characters are invented, and it copies no published retelling or epic text.',
      'Sensitive: the story deals with sickness, death and sacrifice. The sacrifice is told gently and without detail. The story says clearly that nobody should be asked to give up their life today, and that health care and kindness are how we honour him. Teachers should be ready to point learners to the school counsellor or a trusted adult. This is not professional or medical advice.',
    ],
    reviewQuestions: [
      'Ask a Fante elder or teacher to confirm the details of the Ahobaa Kese festival and the Techiman to Mankessim migration.',
      'Check that the account of the sacrifice is gentle enough for the age group and acceptable to the community.',
      'Check the sums: 2 × 6 = 12 and 3 × 20 = 60 seconds.',
    ],
    guide: {
      overview:
        'A story told in two voices about the legend of Egya Ahor, who put his people first, and about how a community honours him through everyday care.',
      lessonMinutes: 45,
      goals: [
        'Retell the legend in order.',
        'Explain why Egya Ahor is remembered.',
        'Describe how the festival keeps his memory alive.',
        'Name a small act of care that you can do for a neighbour.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: festivals, culture, and community values; codes to verify)', 'The Ahobaa Kese festival'],
        ['Science (NaCCA CCP: health and hygiene; codes to verify)', 'How clean water and handwashing prevent illness'],
      ],
      before: ['Ask: what festival do you know that remembers an important event in your community?'],
      during: ['Stop after Page 5. Ask: why does Grandpa say we should honour Egya Ahor by looking after lives?'],
      after: ['Learners write a card for a sick neighbour or classmate.'],
      discussion: ['What is the difference between being brave and being fearless?'],
      reflection: ['What small act of care could you do for someone this week?'],
      maths: [
        {
          task: 'Esi’s bowl holds 2 cups of rice. If 6 neighbours each get one bowl, how many cups of rice are needed?',
          answer: '2 × 6 = 12 cups.',
        },
        {
          task: 'Grandpa says to wash hands for 20 seconds. How many seconds is that for 3 washes, and how many minutes?',
          answer: '3 × 20 = 60 seconds = 1 minute.',
        },
      ],
      support: ['Give sentence starters: He is remembered because… We honour him by…'],
      stretch: ['Interview an elder about how your community cares for the sick.'],
      localise: ['Ask an elder how your family or town celebrates its own festival of remembering.'],
      factCheck: ['The story is fiction around a Fante oral tradition. Details of the Ahobaa Kese festival, the Techiman to Mankessim migration and the plague tradition should be confirmed with a Fante elder or teacher. The sacrifice is told gently, and no dates are given.'],
    },
  }),

  // 5
  mk({
    key: 'the-tree-with-three-branches',
    title: 'The Tree With Three Branches',
    summary:
      'Three kingdoms in northern Ghana trace their royal roots to one ancestor, Naa Gbewaa. An article that follows the branches of his family tree and asks what it teaches about building a state, settling quarrels, and sharing a heritage.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'responsibility', 'kindness', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['african-legends', 'ghanaian-setting', 'naa-gbewaa', 'mole-dagbani', 'heritage'],
    wpm: 125,
    paceWord: 'Calm, clear, and respectful',
    palette: ['#a16207', '#166534'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Soft drum with a single reed instrument, like a slow conversation (placeholder)',
    pages: [
      pg(
        '🌳',
        'Imagine a family tree so large that its branches shade three whole kingdoms. In the north of Ghana, that tree is real. The people of Mamprugu, Dagbon and Nanung each have their own chiefs, their own capital towns and their own customs. Yet their royal stories lead back to one ancestor, a ruler called Naa Gbewaa. The word Naa means a chief or king in the languages of the area. Where did the tree start, how did it divide, and what can a family tree teach us about building a nation? This article follows the branches, with respect for the elders who keep these histories.',
        'A large baobab-like tree whose branches shade three separate towns of the northern savannah.'
      ),
      pg(
        '🗣️',
        'Who was Naa Gbewaa? Our best answer comes from oral tradition, which is history spoken aloud and remembered carefully across generations by drummers, historians and elders. They say that he was a powerful ruler who built a kingdom in the savannah of northern Ghana, several hundred years ago. He is remembered as a founder: the person who laid the first stones of a state. Traditions differ on some details, as living traditions do. Where did his family come from? Exactly where did he rule? Different tellings give different answers. What nearly all agree on is how deeply his descendants honour him.',
        'A drummer and an elder telling history to a circle of listeners under a tree on the savannah.'
      ),
      pg(
        '🏛️',
        'What does it take to build a state? A single powerful person is not enough. Someone must settle disputes, share food in hard seasons and guard the land. Messengers carry news, and drummers and singers keep the history. Chiefs in smaller villages need to feel respected, or they will go their own way. Traditions describe Naa Gbewaa as a ruler who gathered many communities into one kingdom, so that farmers, hunters, traders and craft workers could live under shared customs. A state is like a large roof: it stands only if many posts hold it up, and every post must be strong.',
        'A great thatched roof held up by many strong posts above a market of farmers, hunters and traders.'
      ),
      pg(
        '💔',
        'Naa Gbewaa died, according to tradition, at a place called Pusiga. After the death of a great ruler, a kingdom is at its most delicate, because everyone wonders who will take his place. Most Mole-Dagbani traditions agree that his sons did not at first agree about who should lead. Voices rose. Some versions speak of bitter quarrels and of tragedy within the family. Here tellers choose their words with care, because these are real families’ histories. What we can say gently is that the lack of a clear rule for succession led to a painful disagreement, and that the kingdom had to find a new way forward.',
        'A solemn gathering of men in the savannah at dusk, heads bowed, after the death of a ruler.'
      ),
      pg(
        '🌿',
        'The way forward was division. In the traditions, three sons went on to found three kingdoms. Naa Tohigu is remembered as the founder of Mamprugu. Naa Shitɔbu is remembered as the founder of Dagbon, whose ruler today is the Yaa-Naa. Naa Gmantambo is remembered as the founder of Nanung. Each branch took the customs of the old royal house and built them into a kingdom of its own. A quarrel became a family of states. That is one of the most surprising things about this story: from a painful disagreement grew three kingdoms that still exist today, each proud and independent, yet each knowing that it shares a root.',
        'A tree trunk dividing into three strong branches, each carrying the outline of a different kingdom.'
      ),
      pg(
        '🐎',
        'Another famous branch grew far to the north. Many traditions tell of Princess Yennenga, from this royal house, who was skilled on horseback. According to the Mossi tradition, she rode away on her horse, met a hunter, and raised a son, Prince Ouedraogo, who became the ancestor of the Mossi kingdoms in what is now Burkina Faso. Whether or not every detail is exact, the story shows how widely the family tree spreads. Language is another sign of the link. The languages of the Mole-Dagbani family, including Dagbani, Mampruli and Mooré, share many similarities.',
        'A princess on horseback riding north across open grassland toward the horizon.'
      ),
      pg(
        '⚖️',
        'How do you choose a new ruler fairly? This question cost the first family dearly, and each kingdom later developed its own answer. Each has elders and kingmakers, special titles, and customs that decide who may be considered and who chooses. Rules like these are a kind of national memory, made so that the pain of the first quarrel need not be repeated. Succession in some places can still be a sensitive matter, so learners should discuss it respectfully and listen to local elders rather than taking sides. A rule that is clear, known to everyone and accepted in advance is one of the strongest supports of peace.',
        'Elders and kingmakers seated in a circle in a palace courtyard, deliberating calmly.'
      ),
      pg(
        '🎉',
        'Why does shared ancestry matter today? People of the three kingdoms and their neighbours celebrate festivals such as Damba, which is kept by Dagombas, Mamprusis and Nanumba in their own ways. They marry across the boundaries, trade at the same markets and understand one another’s languages. Their histories tell them that a disagreement does not have to mean the end of a family. A shared ancestor is like the trunk of the tree: the branches may grow in different directions, but they drink from the same roots. When people forget this, quarrels grow. When they remember it, they find ways to talk.',
        'Colourful festival riders and drummers with people from three towns celebrating together in a market square.'
      ),
      pg(
        '✏️',
        'Your turn. Take a sheet of paper and draw your own family tree, starting with yourself and going back to your grandparents or great-grandparents. Ask an elder for a name or a story for each branch. Then notice something: nobody on your tree did everything alone. A saying often called an African proverb tells us that if you want to go quickly, you go alone, but if you want to go far, you go together. Think of Naa Gbewaa’s tree. What do you think this saying means for a family that has become three kingdoms? And what does it mean for your own?',
        'A pupil drawing a family tree on paper with an elder pointing to names on the branches.'
      ),
    ],
    activities: [
      {
        id: 'ge-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why does the article compare a state to a roof held up by posts?',
        options: [
          'Every kingdom builds its houses with thatched roofs',
          'It needs many strong supports, not just one ruler',
          'Rulers always live in the tallest building in town',
        ],
        correctIndex: 1,
      },
      {
        id: 'ge-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What happened after the sons of Naa Gbewaa disagreed?',
        options: [
          'One son ruled all the lands for ever after that',
          'All of the chiefs moved far away from the north',
          'Three sons went on to found three kingdoms',
        ],
        correctIndex: 2,
      },
      {
        id: 'ge-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'Why did each kingdom make clear rules for choosing a ruler?',
        options: [
          'So that the youngest son could never be a ruler',
          'So the first quarrel would not be repeated',
          'So that every new ruler would have to be a farmer',
        ],
        correctIndex: 1,
      },
      {
        id: 'ge-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: Two cousins quarrel over a family farm. What does the article suggest?',
        options: [
          'Divide up the farm in secret while the others are away',
          'Tell them never to speak to each other ever again',
          'Remember their shared roots and agree a clear rule',
        ],
        correctIndex: 2,
      },
      {
        id: 'ge-s1',
        type: 'sequencing',
        prompt: 'Put the ideas in the order the article presents them.',
        items: [
          'A family tree reaches back to Naa Gbewaa',
          'A state needs many supports, not only a ruler',
          'His sons disagree about who should lead after him',
          'Three sons found Mamprugu, Dagbon and Nanung',
          'Each kingdom builds clear rules for succession',
        ],
      },
      {
        id: 'ge-voc',
        type: 'vocabulary',
        afterPage: 1,
        word: 'ancestor',
        definition: 'A person in your family who lived long before you.',
        distractors: [
          'A tool for measuring land',
          'A kind of tree found in the savannah',
        ],
      },
    ],
    glossary: [
      {
        word: 'ancestor',
        definition: 'A person in your family who lived long before you.',
        pages: [1, 8],
      },
      {
        word: 'tradition',
        definition: 'History that is spoken and remembered, not written.',
        pages: [2],
      },
      {
        word: 'savannah',
        definition: 'A wide, grassy land with scattered trees.',
        pages: [2],
      },
      {
        word: 'succession',
        definition: 'The way a new ruler follows an old one.',
        pages: [4, 7],
      },
      {
        word: 'kingmakers',
        definition: 'Elders who have the duty of choosing a new ruler.',
        pages: [7],
      },
      {
        word: 'festivals',
        definition: 'Special celebrations held at a regular time.',
        pages: [8],
      },
    ],
    culturalNotes: [
      'Source and tradition: Naa Gbewaa is remembered as the founder of the Mole-Dagbani kingdoms of Mamprugu, Dagbon and Nanung. Traditions differ about events after his death, and the article says so. The names of his sons and the story of Princess Yennenga are given as tradition. No dates are claimed.',
      'Original piece written for Ghanaian JHS learners from well-known oral tradition and history. The scenes and child characters are invented, and it copies no published retelling or epic text.',
      'Respect: chieftaincy succession is a sensitive matter in northern Ghana. The article describes the family quarrel gently and takes no side in any present dispute. Check the spellings of names (Naa Shitɔbu, Naa Gmantambo, Princess Yennenga, Prince Ouedraogo) with a speaker of the languages concerned.',
    ],
    reviewQuestions: [
      'Ask a Mole-Dagbani elder or teacher to confirm the names, the sequence of events, and the way the quarrel is described.',
      'Check that the article takes no side in any present chieftaincy matter.',
      'Check the sums: 3 × 4 = 12 and 400 ÷ 25 = 16.',
    ],
    guide: {
      overview:
        'An article that follows the family tree of Naa Gbewaa to explain how a state is built, how a quarrel became three kingdoms, and why shared heritage matters.',
      lessonMinutes: 45,
      goals: [
        'Name the three kingdoms descended from Naa Gbewaa.',
        'Explain what a state needs besides a strong ruler.',
        'Say why clear rules for succession matter.',
        'Draw and explain your own family tree.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: history, kingdoms, and national identity; codes to verify)', 'The kingdoms of northern Ghana'],
        ['Mathematics (NaCCA CCP: multiplication and division; codes to verify)', 'Counting generations'],
      ],
      before: ['Ask: how many generations of your family can you name?'],
      during: ['Stop after Page 4. Ask: what could the family have done to avoid the quarrel?'],
      after: ['Learners draw their own family tree and share one story from a branch.'],
      discussion: ['Can a quarrel ever lead to something good? What would have to happen?'],
      reflection: ['What does it mean to share a root with people who live far away?'],
      maths: [
        {
          task: 'Suppose each of Naa Gbewaa’s three sons had 4 children. How many grandchildren is that?',
          answer: '3 × 4 = 12 grandchildren.',
        },
        {
          task: 'If one generation is about 25 years, how many generations fit into 400 years?',
          answer: '400 ÷ 25 = 16 generations.',
        },
      ],
      support: ['Give a blank family-tree template with three levels.'],
      stretch: ['Find out how the festival of Damba is celebrated in two different towns.'],
      localise: ['Ask an elder how your own family or town traces its roots.'],
      factCheck: ['The article is based on oral tradition. The names, the death at Pusiga, and the story of Princess Yennenga are given as tradition and differ between tellings. Confirm the details with a Mole-Dagbani elder or teacher. No dates are claimed. Damba is kept in several northern kingdoms and should be checked locally.'],
    },
  }),

  // 6
  mk({
    key: 'the-skin-that-travels',
    title: 'The Skin That Travels',
    summary:
      'In Gonja, the highest title does not stay with one family. An article about Sumaila Ndewura Jakpa, the founder of the Gonja kingdom, and the rotating Yagbon skin that helped many peoples share one state. It ends with a puzzle for you to solve.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'responsibility', 'kindness', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['african-legends', 'ghanaian-setting', 'ndewura-jakpa', 'gonja', 'fairness', 'skins-and-stools'],
    wpm: 125,
    paceWord: 'Clear, steady, and curious',
    palette: ['#0f766e', '#b45309'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Hand drum and a bright, rhythmic string pattern that seems to take turns (placeholder)',
    pages: [
      pg(
        '👑',
        'In southern Ghana, a ruler sits on a stool. In the north, a ruler sits on a skin, a royal animal skin, and instead of being crowned, he is enskinned. In most kingdoms, the skin stays inside one royal family. In Gonja, in the savannah of northern Ghana, something different happened. The highest title, held by the Yagbonwura, passes from one division to another, in turn. How did such a system begin, and why would anyone design it that way? To answer, we go back to a man called Sumaila Ndewura Jakpa, remembered as the founder of Gonja, and then we will test the idea with a puzzle.',
        'A folded ceremonial royal skin being passed from one pair of hands to another across a table in a savannah palace, beside a northern chief’s embroidered smock.'
      ),
      pg(
        '🐴',
        'Who was Ndewura Jakpa? According to Gonja tradition, he came from the Mande world, far to the north-west, as a warrior and a leader of horsemen. Historians do not agree on exactly when he lived. Some traditions place him in the 1500s, while historians who study the old Arabic chronicles of the region place his life in the early to mid 1600s. For this reason, an honest answer is that he lived in the sixteenth or seventeenth century. What is certain is that the state he founded is still alive today, with its own chiefs, councils and festivals, and that people across northern Ghana know its name.',
        'A leader on horseback with his followers riding across a wide savannah at sunrise.'
      ),
      pg(
        '🧭',
        'The journey was long. Tradition says that Ndewura Jakpa and his followers moved south through lands that were already home to many peoples, including farmers, hunters, traders and Muslim scholars. His horsemen and weapons gave him a strong military advantage, and the campaigns that followed brought many communities under the new Gonja state. Today we study this period carefully, because conquest meant hardship for some. It is important to remember that real people lived in these lands and that their descendants live there still. The story of Gonja is not only a story of arrival. It is also a story of how many peoples learned to live in one state.',
        'A long line of horsemen and followers moving through farmland where villagers look on.'
      ),
      pg(
        '🗺️',
        'A conquered land is hard to hold. Ndewura Jakpa understood that he could not be everywhere at once. Tradition says that he divided the land into divisions and gave each one to a trusted leader or relative, and the heads of these divisions became important chiefs in their own areas. They kept their own courts and helped settle local disputes. The senior ruler, the Yagbonwura, sat on the highest skin, the Yagbon skin. A large kingdom without good local leaders is like a big drum with no skin: it looks impressive, but it makes no sound at all.',
        'A map-like scene of a savannah divided into regions, each with a chief’s seat, linked to a central town.'
      ),
      pg(
        '🤲',
        'Peace between different peoples was a work of design. The new rulers were horsemen from the Mande world, but the land belonged to many peoples. The Gonja system gave different groups roles they could respect: ruling houses, village chiefs, Muslim scholars and teachers, and earth priests who kept the old shrines and rituals of the land. Giving every group a place was a way of saying that nobody had to disappear for the kingdom to exist. When people feel that they have a role and a voice, they are less likely to rebel. This is as true in a school class as it is in a kingdom.',
        'Different groups, a chief, a scholar with books, and an earth priest, standing together in a village square.'
      ),
      pg(
        '🔄',
        'Now to the rotating skin. In Gonja, the Yagbon skin passes in turn among five divisions: Wasipe, Kpembe, Bole, Tuluwe and Kusawgu. To see the idea, imagine a simpler model with three divisions, A, B and C. When the old king dies, the next king comes from the next division in the sequence: first A, then B, then C, then A again. The real system has its own rules and customs, which Gonja elders know best, so this is only a model. But it shows the idea. The skin moves like a visitor, staying for a time with each house and never settling for ever in one.',
        'A folded ceremonial skin moving in a circle between three houses labelled A, B and C.'
      ),
      pg(
        '⚖️',
        'Why design a kingdom this way? The first benefit is fairness: every main division knows that its turn will come, so there is less reason to fight for the skin. The second is shared ownership: each division feels that the kingdom is partly its own. The third is a long memory of peace. Rotation has costs too. A new king may bring different ideas, and the court must adjust. People must trust the rules, even when it is inconvenient. A rotating skin is a promise, and promises work only when everyone keeps them, including those whose turn has just ended.',
        'A balance scale with three equal folded skins on a table while three elders look on.'
      ),
      pg(
        '🏞️',
        'What happened to Ndewura Jakpa himself? Gonja tradition says that he continued to rule and to campaign for many years, and that he died at a place called Brumasi. Some historians put his death in the 1660s. The kingdom he founded did not die with him. It continued under his successors and later met the Asante, the British and the new state of Ghana. Today the Yagbonwura is the respected overlord of Gonja, and Gonja chiefs sit in many councils. A system that is based on shared turns can outlive its founder, which is perhaps the best sign that it was built well.',
        'A quiet river landscape at Brumasi with a distant town and a chief’s umbrella at sunset.'
      ),
      pg(
        '🧩',
        'Here is a challenge. Imagine four royal divisions, A, B, C and D, who take turns to provide a king. Each king rules for exactly six years, and Division A begins in year 0. Which division holds the skin in year 20? In which year does Division C begin to rule? And how many full cycles will be completed in 100 years? Work it out on paper, then check with a friend. Finally, ask yourself a harder question: could you use a rotation to share a responsibility in your own class or family, such as who leads the prayer, who feeds the chickens, or who decides the game?',
        'A pupil at a desk working on a rotation puzzle with four folded skins labelled A to D on the page.'
      ),
    ],
    activities: [
      {
        id: 'gf-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why does the article remind us that people already lived in these lands?',
        options: [
          'Their descendants still live there today',
          'Because Ndewura Jakpa had met all of them before',
          'Because the land was empty and was not used at all',
        ],
        correctIndex: 0,
      },
      {
        id: 'gf-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'How did the Gonja system help to keep peace among different groups?',
        options: [
          'It made everyone in the kingdom speak one language',
          'It asked each group to leave its own villages',
          'It gave each group a role it could respect',
        ],
        correctIndex: 2,
      },
      {
        id: 'gf-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What is one benefit of a rotating skin?',
        options: [
          'Every main division knows its turn will come',
          'The same family rules in every single generation',
          'The king never needs advice from any of the elders',
        ],
        correctIndex: 0,
      },
      {
        id: 'gf-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: A class has weekly chores. Using the article, what is a fair system?',
        options: [
          'The tallest pupil always decides who does the work',
          'Pupils take turns in a clear order everyone knows',
          'The first group to finish picks next week’s jobs',
        ],
        correctIndex: 1,
      },
      {
        id: 'gf-s1',
        type: 'sequencing',
        prompt: 'Put the ideas in the order the article presents them.',
        items: [
          'Ndewura Jakpa journeys into the land with his followers',
          'The land is divided among trusted leaders',
          'Different groups are given roles in the new state',
          'The highest title passes from one division to the next',
          'The kingdom outlives its founder',
        ],
      },
      {
        id: 'gf-voc',
        type: 'vocabulary',
        afterPage: 7,
        word: 'rotating',
        definition: 'Taking turns in a fixed order, one after another.',
        distractors: [
          'Growing food on the same field every year',
          'Travelling a long way to a new home',
        ],
      },
    ],
    glossary: [
      {
        word: 'enskinned',
        definition: 'Given the right to rule by sitting on the royal skin, as northern chiefs are.',
        pages: [1],
      },
      {
        word: 'chronicles',
        definition: 'Written records of events in the order they happened.',
        pages: [2],
      },
      {
        word: 'scholars',
        definition: 'People who study and teach, often through reading and writing.',
        pages: [3, 5],
      },
      {
        word: 'campaigns',
        definition: 'Planned series of military actions.',
        pages: [3],
      },
      {
        word: 'divisions',
        definition: 'Parts of a larger area or group, each with its own leader.',
        pages: [4, 6],
      },
      {
        word: 'rotating',
        definition: 'Taking turns in a fixed order, one after another.',
        pages: [6, 7],
      },
      {
        word: 'successors',
        definition: 'People who come after and take over a role.',
        pages: [8],
      },
    ],
    culturalNotes: [
      'Source and tradition: Sumaila Ndewura Jakpa is remembered as the founder of the Gonja kingdom. Sources differ on his dates (the sixteenth or seventeenth century), and the article says so. The Yagbon skin is said to pass in turn among five divisions (Wasipe, Kpembe, Bole, Tuluwe, Kusawgu); the article uses a simple three- and four-division model, not a full account of how titles pass today.',
      'Original piece written for Ghanaian JHS learners from well-known oral tradition and history. The scenes and child characters are invented, and it copies no published retelling or epic text.',
      'Respect: the article names conquest honestly but gently and does not glorify violence. It takes no side in any present chieftaincy matter. Check the details of the divisions, the earth priests and the Yagbonwura title with a Gonja elder or the Gonja traditional council.',
    ],
    reviewQuestions: [
      'Ask a Gonja elder or teacher to confirm the description of the divisions, the Yagbonwura title and the Yagbon skin, and the rotation among the five divisions.',
      'Check that the account of conquest is honest and gentle, and takes no side in any present dispute.',
      'Check the puzzle: D in year 20; a cycle is 24 years; C begins in year 12; 4 full cycles in 100 years.',
    ],
    guide: {
      overview:
        'An article about Sumaila Ndewura Jakpa and the rotating Yagbon skin of Gonja, showing how a state can share power fairly among many peoples, and ending with a rotation puzzle.',
      lessonMinutes: 45,
      goals: [
        'Explain who Ndewura Jakpa is remembered as.',
        'Describe how divisions and roles helped to hold the state together.',
        'Explain how a rotating skin works and why it can be fair.',
        'Solve a rotation puzzle.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: history, kingdoms, and governance; codes to verify)', 'The Gonja kingdom'],
        ['Mathematics (NaCCA CCP: patterns, division, and remainders; codes to verify)', 'Cycles and rotation'],
      ],
      before: ['Ask: how does your class decide who does a job each week?'],
      during: ['Stop after Page 6. Ask learners to predict who rules in the fifth reign of a three-division rotation.'],
      after: ['Learners design a fair rotation for a class job and write the rules.'],
      discussion: ['What are the benefits and the costs of taking turns at power?'],
      reflection: ['Where in your life could a fair rotation settle an argument?'],
      maths: [
        {
          task: 'Four divisions (A, B, C, D) take turns, six years each, and A starts in year 0. Which division holds the skin in year 20?',
          answer: 'Reigns: A 0–6, B 6–12, C 12–18, D 18–24, so Division D holds the skin in year 20.',
        },
        {
          task: 'How long is one full cycle, in which year does C begin, and how many full cycles are completed in 100 years?',
          answer: 'One cycle is 4 × 6 = 24 years. C begins in year 12. 100 ÷ 24 = 4 full cycles (96 years), with 4 years left over.',
        },
      ],
      support: ['Give a rotation chart with A, B, C, D in a row and the years to fill in.'],
      stretch: ['Work out which division holds the skin in year 75 under the four-division, six-year rule (75 ÷ 24 = 3 remainder 3, so Division A).'],
      localise: ['Ask a Gonja elder how the Yagbonwura is chosen and how the divisions are named.'],
      factCheck: ['The article is based on Gonja tradition and historical sources that differ. Ndewura Jakpa is placed in the sixteenth or seventeenth century, and his death at Brumasi in the 1660s should be confirmed. The rotation is a simple model, and the details of the divisions and the Yagbonwura title should be checked with a Gonja elder or the traditional council. Northern rulers are enskinned on skins, not crowned.'],
    },
  }),

];

export const BATCH_64_STORIES = BATCH_64_AFRICAN_LEGENDS_GHANA;
