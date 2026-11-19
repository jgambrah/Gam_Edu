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
 * Batch 65 (African Legends, set 2: six wider-Africa legends as three stories and three articles, nine pages each, with activities), for JHS (Basic 7 to Basic 9).
 * Each piece is linked to Social Studies, English Language, Science, or Mathematics (see the teacher guide).
 * Stories list their characters; articles have none. All scenes and child characters are invented; the legends come from oral tradition and history.
 * Original text written for Ghanaian learners; each factCheck note says what to verify, and where versions of a tradition differ.
 * To verify before seeding: classIds, readingLevel, themes, genres, objectives, and ghanaianContext against ../classification.ts;
 * whether `maths` may be an empty array; and all NaCCA curriculum codes.
 */

export const BATCH_65_AFRICAN_LEGENDS_AFRICA: PilotStory[] = [
  // 1
  mk({
    key: 'the-apprentice-who-fixed-his-own-story',
    title: 'The Apprentice Who Fixed His Own Story',
    summary:
      'Twelve-year-old Kemo is a griot’s apprentice who must tell the story of Mansa Sundiata Keita to the village children. He keeps making funny mistakes and catching them, and learns why a good storyteller corrects himself.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'responsibility', 'kindness', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['african-legends', 'wider-africa', 'sundiata-keita', 'griot', 'mali-empire'],
    wpm: 125,
    paceWord: 'Lively, funny, and warm',
    palette: ['#b45309', '#0f766e'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Kemo: a twelve-year-old griot’s apprentice in Kangaba.',
      'Djeli Sidiki: Kemo’s patient master, a griot who keeps the old stories.',
      'Fanta: Djeli Sidiki’s goat, who hears every rehearsal.',
      'Mariam: a sharp-eared village girl who loves to listen.',
    ],
    music: 'Light kora-style plucking with a playful goat bleat (placeholder)',
    pages: [
      pg(
        '🐐',
        'I am Kemo, apprentice to Djeli Sidiki, a griot of Kangaba. A griot, or djeli, keeps the memory of a people in his voice. Tomorrow I must tell the story of Mansa Sundiata Keita to all the village children, and my knees are shaking like a drum skin. My master says, “Practise tonight.” So I stand before the only audience available, his goat, Fanta. Fanta chews my hat and stares. I clear my throat. “Listen, goat,” I say, “for I tell of a king who changed the world.” Fanta bleats. I decide this means “begin”.',
        'A boy in a griot’s robe rehearsing before a goat that is chewing his hat.'
      ),
      pg(
        '🧒',
        '“Prince Sundiata Keita was born, and he walked on his third day!” I announce. Fanta looks doubtful. Then my master’s voice comes from the doorway. “Is that what the story says, Kemo?” My face grows hot. “No, wait! I mean no, Master. The old tellings say that as a child he could not stand or walk for many years, and other children laughed at him.” Djeli Sidiki nods. “Good. You caught it yourself. That is the first rule. A griot who finds his own mistake keeps his honour.” I bow to the goat as well.',
        'A griot master smiling in a doorway while his apprentice and a goat look embarrassed.'
      ),
      pg(
        '💪',
        'I try again. “The tellings say that the prince at last rose to his feet. The griots add that an iron bar bent in his hands as he stood, and everyone cheered. It was shaped like a… like a banana!” Fanta chokes on the hat. “No, wait,” I say quickly. “It bent like a bow. Griots say it, but nobody can prove it. It is a tale that shows how strong his spirit became after so many years of waiting.” Djeli Sidiki lifts his eyebrows, pleased. “You said what is told, and you said it is told. That is how we separate a tradition from a proof.”',
        'A boy pretending to bend an iron bar while a goat watches in surprise.'
      ),
      pg(
        '🚶',
        '“So the prince and his mother, Sogolon, lived happily at home for ever and ever!” I say. This time I stop myself before the goat can look at me. “No, wait! They did not. Jealous people made life hard, and they left the Manden for many years, travelling from place to place. The tellings say that Prince Sundiata Keita made friends, learned from other peoples, and gathered allies. Hard times did not break him. They gave him patience and friends.” Mariam, who has crept in to listen, claps her hands. “Do you always argue with yourself, Kemo?” she asks. “Every time,” I sigh.',
        'A boy and a girl sitting under a tree while a goat rests, with a faint picture of travellers behind them.'
      ),
      pg(
        '⚔️',
        '“Then he returned,” I continue, “and fought the king of the Sosso, who was a goat farmer.” Even Fanta turns her head. “No, wait! King Soumaoro Kanté was a powerful king of the Sosso, not a goat farmer. Sorry, Fanta.” Djeli Sidiki laughs aloud. “Tell it plainly,” he says. “The tellings say that the allies met the Sosso king at a great battle at Kirina, about the year 1235. After it, Mansa Sundiata Keita was proclaimed the first mansa, the emperor, of the Mali Empire.” I repeat it slowly. The goat seems satisfied.',
        'A boy gesturing at a map drawn in the sand while his master laughs.'
      ),
      pg(
        '📜',
        '“After the victory,” I say, “Mansa Sundiata Keita sat alone and made every rule himself, and nobody was allowed to speak.” I stop. My master is shaking his head slowly, smiling. “No, wait,” I say, “you want me to be careful.” “I want you to be accurate,” he says. “Griots tell of a great gathering at Kouroukan Fouga, where leaders met and agreed on an early charter, a set of shared rules. UNESCO lists the Manden Charter today. It was kept in memory, not on paper, by griots like us.” I stand a little taller.',
        'Leaders sitting in a wide circle on a grassy plain to agree on shared rules.'
      ),
      pg(
        '🧠',
        'That night we sit by the fire. “Master,” I say, “I made eight mistakes today. Does that mean I am a poor griot?” He pokes the embers. “I made more when I was your age. A griot is not one who never slips. He is one who notices, and says, ‘Let me tell that again, properly.’ Listeners trust a storyteller who corrects himself. They stop trusting one who pretends. In 1998 griots and scholars met in Kankan to put their versions side by side. Even the old ones fix their stories.” I smile. Fanta, curled up by the fire, snores gently.',
        'A master and apprentice sitting by a fire at night, a goat asleep beside them.'
      ),
      pg(
        '🌅',
        'The next day, the clearing at Kangaba fills with children. Every year the village remembers the charter here, and today I will tell the story. My voice starts steady. “In the year 1253…” A small hand shoots up. It is Mariam. “1235, Kemo!” The children giggle. “No, wait,” I say, grinning. “Thank you, Mariam. It was about 1235. My tongue ran ahead of my head.” The children cheer instead of laughing at me. I realise that a mistake mended in public can make an audience trust you more, not less.',
        'A boy griot before a crowd of laughing, cheering children at a village clearing, one girl with her hand raised.'
      ),
      pg(
        '🌿',
        'The story ends and the children clap. Djeli Sidiki puts his hand on my shoulder. “Tomorrow, you will tell it again,” he says, “and the day after that. You will find more mistakes. That is not failure, Kemo. That is the work.” Later, I pass the goat on my way home. “Fanta,” I whisper, “next time, can you please stop eating my hat?” Fanta looks at me, calmly, and swallows the last piece. I decide to tell this part of the story as well, because it is true.',
        'A boy whispering to a calm goat in the evening light, village huts glowing behind.'
      ),
    ],
    activities: [
      {
        id: 'gg-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What does Kemo say about the iron bar that bent when the prince stood?',
        options: [
          'It is shown in a famous drawing kept at Kangaba',
          'It is told by griots, but nobody can prove it',
          'It is written about in a record from that same year',
        ],
        correctIndex: 1,
      },
      {
        id: 'gg-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'About when did the Battle of Kirina take place, according to the story?',
        options: [
          'About the year 1535',
          'About the year 1835',
          'About the year 1235',
        ],
        correctIndex: 2,
      },
      {
        id: 'gg-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'Why do listeners trust a storyteller who corrects himself?',
        options: [
          'He shows that truth matters more than looking perfect',
          'He tells the story faster than other storytellers do',
          'He never has to answer the questions that listeners ask',
        ],
        correctIndex: 0,
      },
      {
        id: 'gg-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: you read a wrong date aloud in class. What would a good griot do?',
        options: [
          'Keep going and hope that nobody noticed it at all',
          'Stop the lesson and refuse to speak ever again',
          'Say plainly, “Let me correct that,” and carry on',
        ],
        correctIndex: 2,
      },
      {
        id: 'gg-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Kemo rehearses before the goat',
          'Djeli Sidiki teaches him to separate tradition from proof',
          'Kemo learns about the great gathering at Kouroukan Fouga',
          'Mariam corrects his date at the clearing',
          'Kemo tells the goat the last part is true',
        ],
      },
      {
        id: 'gg-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'griot',
        definition: 'A West African keeper of history who tells stories, sings, and remembers family lines.',
        distractors: [
          'A kind of drum played at festivals',
          'A farmer who keeps goats in the village',
        ],
      },
    ],
    glossary: [
      {
        word: 'griot',
        definition: 'A West African keeper of history who tells stories and remembers family lines.',
        pages: [1, 2, 7],
      },
      {
        word: 'proclaimed',
        definition: 'Announced publicly and officially.',
        pages: [5],
      },
      {
        word: 'charter',
        definition: 'A written or spoken set of shared rules.',
        pages: [6],
      },
      {
        word: 'accurate',
        definition: 'Correct and true in every detail.',
        pages: [6],
      },
      {
        word: 'tradition',
        definition: 'A story or custom handed down through the generations.',
        pages: [3],
      },
      {
        word: 'allies',
        definition: 'People or groups who join together to help each other.',
        pages: [4, 5],
      },
    ],
    culturalNotes: [
      'Source and tradition: the story of Mansa Sundiata Keita’s childhood comes from the oral epic kept by griots, and different griots tell it differently. The Battle of Kirina is dated to about 1235, and the Manden Charter, proclaimed at Kouroukan Fouga, is on UNESCO’s Representative List of the Intangible Cultural Heritage of Humanity. The charter was kept orally and a version was gathered in a 1998 workshop in Kankan, Guinea. The piece calls it an early charter and does not claim more.',
      'Original piece written for Ghanaian JHS learners from well-known oral tradition and history. The scenes and child characters are invented, and it copies no published retelling or epic text.',
      'Special note: the Battle of Kirina is mentioned only by name and date, with no description of fighting. Teachers should be ready to talk about mistakes and embarrassment with care and point learners to the school counsellor or a trusted adult if they feel worried. This is not professional advice.',
    ],
    reviewQuestions: [
      'Ask a speaker of Mandinka or Malinke to confirm the words djeli, griot, Manden and Kouroukan Fouga.',
      'Check that the iron-bar episode is correctly framed as an epic tradition.',
      'Check the sums on the maths card.',
    ],
    guide: {
      overview:
        'A funny story about a griot’s apprentice who keeps correcting himself while learning to tell the tale of Mansa Sundiata Keita, and why that honesty earns trust.',
      lessonMinutes: 45,
      goals: [
        'Tell the main events of Mansa Sundiata Keita’s life in order.',
        'Explain the difference between a tradition and a proof.',
        'Say why correcting a mistake builds trust.',
        'Practise correcting a mistake politely.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: early West African empires; codes to verify)', 'The Mali Empire and the Manden Charter'],
        ['English Language (NaCCA CCP: storytelling and oral tradition; codes to verify)', 'How griots keep history'],
      ],
      before: ['Ask: who in your family or town remembers the old stories?'],
      during: ['Stop after Page 3. Ask: why does Kemo say “it is told” each time?'],
      after: ['In pairs, learners tell a short event from school life and correct one planted mistake.'],
      discussion: ['Is it more important to sound sure or to be correct?'],
      reflection: ['When did you last fix a mistake that nobody had noticed?'],
      maths: [
        {
          task: 'Kemo makes 8 mistakes on his first practice day. If he halves the number each day, how many does he make on day 3?',
          answer: 'Day 1: 8, day 2: 4, day 3: 2 mistakes.',
        },
        {
          task: 'Kangaba’s clearing seats 80 children on benches. If 12 benches each seat the same number, how many children per bench?',
          answer: '80 ÷ 12 is about 6.7, so 7 children per bench, with room to spare.',
        },
      ],
      support: ['Give sentence starters: “Let me correct that. It was…”'],
      stretch: ['Find out what the word griot is in a language you speak, and who keeps your community’s history.'],
      localise: ['Ask an elder about the okyeame, the Akan linguist, and compare the role with the griot.'],
      factCheck: ['The story is fiction around the oral epic of Mansa Sundiata Keita. Check with a Malinke or Mandinka speaker the details of the childhood tradition (not walking for many years, the iron bar), the date of Kirina (about 1235), the name Soumaoro Kanté (also written Sumanguru), the description of Kouroukan Fouga as an early charter, and the 1998 Kankan workshop.'],
    },
  }),

  // 2
  mk({
    key: 'the-radio-play-about-queen-nzinga',
    title: 'The Radio Play About Queen Nzinga',
    summary:
      'A school radio club in Accra records a play about Queen Nzinga of Ndongo and Matamba. Told as a script with sound cues, it shows a queen who negotiated, resisted and built a state, and ends on a proverb.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'responsibility', 'kindness', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['african-legends', 'wider-africa', 'queen-nzinga', 'ndongo', 'matamba'],
    wpm: 125,
    paceWord: 'Brisk and dramatic, like a radio drama',
    palette: ['#7c2d12', '#1e3a8a'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Efua: a twelve-year-old radio-club producer in Accra.',
      'Kojo: a classmate who voices Queen Nzinga.',
      'Adwoa: a classmate who voices the Portuguese governor.',
      'Mrs Owusu: the club’s teacher, who adds the closing proverb.',
    ],
    music: 'Warm talking-drum accents between scenes, with a soft drum roll at each cue (placeholder)',
    pages: [
      pg(
        '🎙️',
        '[SOUND: A school bell. A door closes.] EFUA, our producer, taps the microphone. “Quiet, please! Radio club, take one. Today’s play is about Queen Nzinga, who ruled Ndongo and Matamba, in what is now Angola, in the 1600s.” KOJO groans. “Why must I play the queen?” “Because you have the loudest voice,” says EFUA. MRS OWUSU smiles from the corner. “Remember,” she says, “we use only what historians are fairly sure about. If a story is doubtful, we leave it out, or we say it is doubtful.” EFUA nods and points. “Cue the drum.” [SOUND: Talking drum.]',
        'A school radio room with a girl at a microphone, a boy holding a script, and a teacher smiling.'
      ),
      pg(
        '📜',
        'NARRATOR (EFUA). “The year is 1622. The kingdom of Ndongo is in trouble. Portuguese forces have pushed into the land. King Mbande, who rules Ndongo, wants a peace agreement, so he sends his clever sister, Princess Nzinga, to the Portuguese town of Luanda to speak for him.” [SOUND: Footsteps, a heavy door.] ADWOA, as the GOVERNOR, grumbles, “Another visitor.” KOJO, as the PRINCESS, replies, “I am not a visitor, Governor João Correia de Sousa. I am the voice of my king. Please treat us as equals.” [SOUND: A gasp.]',
        'Two children at microphones performing a meeting between a princess and a governor.'
      ),
      pg(
        '🤝',
        'MRS OWUSU interrupts softly. “Stop, please. There is a famous story that the Governor did not offer a chair, and that she had a servant kneel so that she could sit. Is that proven?” The children shake their heads. “Historians are unsure,” says EFUA. “So we leave it out.” “Good,” says MRS OWUSU. NARRATOR (EFUA). “What we do know is that she negotiated with skill. The talks led to a treaty. During that time she was baptised, taking the Christian name Dona Ana de Sousa.” [SOUND: A bell chimes.] “She understood that talking can be as powerful as any weapon.”',
        'A teacher raising a hand to stop the recording while children think about what is proven.'
      ),
      pg(
        '👑',
        'NARRATOR (EFUA). “In 1624, Queen Nzinga took over the rule of Ndongo.” [SOUND: A drum roll.] KOJO, as QUEEN NZINGA, speaks firmly. “Portugal has broken its promises. I will not accept it.” ADWOA, as the GOVERNOR, answers, “You are a woman. What can you do?” “Watch me,” says KOJO. NARRATOR (EFUA). “Queen Nzinga stood up to the Portuguese, as her father had done before her. She moved with her people to Matamba, farther inland, and by 1631 she had made Matamba her capital, joining it to Ndongo.” [SOUND: Marching feet, fading.]',
        'A queen with a firm stance before an official, then a line of people walking inland.'
      ),
      pg(
        '🧭',
        'MRS OWUSU leans in. “Why did she leave Ndongo?” “Because staying meant giving up their freedom,” says EFUA. NARRATOR (EFUA). “From her new home in Matamba, Queen Nzinga built a strong state. She welcomed people who had fled from other places. She traded, she made alliances with others who opposed the Portuguese, and for many years she resisted. Historians say that by the time of her death, Matamba was a formidable commercial state dealing with the Portuguese on an equal footing.” [SOUND: A market bustle.] “That is a quiet kind of victory.”',
        'A busy market in a new kingdom, with traders and a queen watching over it.'
      ),
      pg(
        '🏳️',
        'NARRATOR (EFUA). “Years went by, and the queen grew old but did not give up. In 1656 a formal treaty was agreed, and for some years there was a kind of peace. Queen Nzinga died in 1663, aged about 80.” [SOUND: Slow, soft drumbeat.] Nobody speaks for a moment. Then ADWOA whispers, “I did not know she lived so long, or did so much.” “Neither did I,” says KOJO. “She was a negotiator, a leader and a builder, not just a fighter.” “Exactly,” says MRS OWUSU. “Strong leaders use their heads before anything else.”',
        'A quiet recording room where children sit still as a slow drumbeat plays.'
      ),
      pg(
        '🔎',
        'KOJO scratches his head. “But where do these stories come from, Mrs Owusu?” “From Portuguese records, Angolan oral tradition, and later historians,” she says. “Different people wrote for different reasons, so we compare them.” EFUA writes in her notebook. “So a good producer checks more than one source.” “And is honest about what is uncertain,” adds MRS OWUSU. “That is why we left out the chair story. When you are not sure, say so.” KOJO grins. “Even my loud voice has to be careful about the facts.” Everyone laughs, and ADWOA turns off the microphone, just for a moment.',
        'A teacher and three children comparing papers and notebooks around a table.'
      ),
      pg(
        '🌍',
        '[SOUND: A click. The microphone is on again.] NARRATOR (EFUA). “Why does Queen Nzinga matter to Ghanaian learners? Because Africa’s history is full of leaders who defended their people with courage and thought. When we study them, we learn that freedom was never given. It was argued for, built, and protected. In Accra, as in Luanda, young people can learn from her skill at listening, speaking, and building friendships that last.” KOJO adds softly, “And she did it when many people told her she could not.” [SOUND: Gentle drum.]',
        'A map of Africa with two cities connected by a thread, a drum at the centre.'
      ),
      pg(
        '🦁',
        'NARRATOR (EFUA). “And now, a word from our teacher.” MRS OWUSU leans toward the microphone. “There is a proverb from Ethiopia that I think Queen Nzinga would have understood. It says, ‘When spider webs unite, they can tie up a lion.’ One thread is weak, but many together are strong. A queen who united her people, her friends and her neighbours was strong too.” [SOUND: One long drumbeat, fading.] EFUA whispers, “And that is the end of our play.” KOJO adds, “Take two?” Everyone groans, and the bell rings.',
        'A teacher speaking into a microphone while children listen, with spider webs glowing in the background.'
      ),
    ],
    activities: [
      {
        id: 'gh-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why did the radio club leave out the chair story?',
        options: [
          'Historians are unsure that it really happened',
          'Everyone agreed that it was far too short to use',
          'The governor in the play flatly refused to say it',
        ],
        correctIndex: 0,
      },
      {
        id: 'gh-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did Queen Nzinga build from her new home in Matamba?',
        options: [
          'A new city that hid from all other people',
          'A strong state that traded and made alliances',
          'A large school for the children of the governor',
        ],
        correctIndex: 1,
      },
      {
        id: 'gh-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What does Mrs Owusu say a good producer does with sources?',
        options: [
          'Compares them and admits what is uncertain',
          'Uses only the one that sounds the most exciting',
          'Picks the longest book that is in the library',
        ],
        correctIndex: 0,
      },
      {
        id: 'gh-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'What does the proverb about spider webs teach?',
        options: [
          'A lion is always afraid of any spider web',
          'Many weak threads together can be strong',
          'One spider can easily do any task alone',
        ],
        correctIndex: 1,
      },
      {
        id: 'gh-s1',
        type: 'sequencing',
        prompt: 'Put the events in order.',
        items: [
          'Princess Nzinga is sent to Luanda to speak for her brother',
          'She is baptised as Dona Ana de Sousa',
          'She takes over the rule of Ndongo',
          'Matamba becomes her capital',
          'A formal treaty is agreed and she later dies',
        ],
      },
      {
        id: 'gh-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'negotiated',
        definition: 'Talked with others to reach an agreement.',
        distractors: [
          'Moved a large army across a river',
          'Built a wall around a royal town',
        ],
      },
    ],
    glossary: [
      {
        word: 'treaty',
        definition: 'A formal written agreement between two groups or countries.',
        pages: [3, 6],
      },
      {
        word: 'baptised',
        definition: 'Welcomed into the Christian faith in a ceremony.',
        pages: [3],
      },
      {
        word: 'capital',
        definition: 'The main city where a country or kingdom is governed.',
        pages: [4],
      },
      {
        word: 'resisted',
        definition: 'Held out against something instead of giving in.',
        pages: [5],
      },
      {
        word: 'alliances',
        definition: 'Agreements to support one another.',
        pages: [5],
      },
      {
        word: 'source',
        definition: 'A record, writing, or person that gives us information.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Source and history: Queen Nzinga (also Njinga) was a ruler of Ndongo and Matamba in what is now Angola. Reliable points used here: the 1622 talks in Luanda with Governor João Correia de Sousa, baptism as Dona Ana de Sousa, taking over rule in 1624, joining Matamba to Ndongo by 1631, a treaty in 1656, and death in 1663. Dates and details differ slightly between sources. The famous human-chair story is contested and is left out on purpose.',
      'Original piece written for Ghanaian JHS learners from well-known oral tradition and history. The scenes and child characters are invented, and it copies no published retelling or epic text.',
      'Special note: the piece avoids the contested chair anecdote and does not describe fighting, her brother’s death, or the slave trade in detail. A short, age-appropriate mention that Portuguese demands included the slave trade is for the teacher to make if the class asks, with care. Colonial history can be upsetting, so point learners to the school counsellor or a trusted adult if needed. This is not professional advice.',
    ],
    reviewQuestions: [
      'Check the names Ndongo, Matamba, Luanda and Nzinga (also Njinga) with a Portuguese or Kimbundu speaker.',
      'Check that the Ethiopian proverb about spider webs is correctly attributed.',
      'Confirm that it is fine to leave out her brother’s death and the slave trade at JHS level.',
    ],
    guide: {
      overview:
        'A radio play told as a script with sound cues about Queen Nzinga of Ndongo and Matamba, showing a leader who spoke, resisted and built, and a class that checks its facts.',
      lessonMinutes: 45,
      goals: [
        'Describe three things Queen Nzinga did.',
        'Explain why the club left out the chair story.',
        'Say why many sources are better than one.',
        'Explain the spider-web proverb in your own words.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: African leaders and resistance; codes to verify)', 'Queen Nzinga of Ndongo and Matamba'],
        ['English Language (NaCCA CCP: drama and scripts; codes to verify)', 'Reading and performing a radio play'],
      ],
      before: ['Ask: what do you need to make a good radio play?'],
      during: ['Stop after Page 3. Ask: why leave out a story that is famous?'],
      after: ['In groups, learners perform one page as a radio play with a sound cue.'],
      discussion: ['When is a famous story too doubtful to repeat?'],
      reflection: ['When did you last work with others to do what one person could not?'],
      maths: [
        {
          task: 'Queen Nzinga died in 1663, aged about 80. About what year was she born?',
          answer: '1663 − 80 = 1583, so about 1583.',
        },
        {
          task: 'She took over Ndongo in 1624 and died in 1663. How many years was that?',
          answer: '1663 − 1624 = 39 years.',
        },
      ],
      support: ['Give each learner one script line to practise.'],
      stretch: ['Write a one-page radio scene about another African leader, using only well-checked facts.'],
      localise: ['Compare Queen Nzinga with Nana Yaa Asantewaa, who also led her people.'],
      factCheck: ['The play is fiction around history. Check with a historian or teacher: the 1622 Luanda talks and Governor João Correia de Sousa, baptism as Dona Ana de Sousa, rule from 1624, Matamba as capital by 1631, the 1656 treaty, death in 1663 aged about 80, and the dates she was born. The Ethiopian proverb on spider webs should be checked for attribution.'],
    },
  }),

  // 3
  mk({
    key: 'nuri-the-camel-and-the-queens-road',
    title: 'Nuri the Camel and the Queen’s Road',
    summary:
      'Nuri the camel carries gifts for Queen Makeda on her long journey to meet the wise King Solomon, as told in Ethiopian tradition. A grumbling, funny camel’s eye view of curiosity, wisdom and coming home.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'responsibility', 'kindness', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['african-legends', 'wider-africa', 'queen-makeda', 'kebra-nagast', 'ethiopia'],
    wpm: 125,
    paceWord: 'Gentle, funny, and curious',
    palette: ['#c2410c', '#92400e'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Nuri: a clever, grumbling camel who tells the story.',
      'Selam: a twelve-year-old camel keeper’s daughter who looks after Nuri.',
      'Queen Makeda: the queen who sets out to find wisdom.',
      'Tamrin: the merchant who tells the queen about King Solomon.',
    ],
    music: 'Slow desert wind with a soft lyre and camel bells (placeholder)',
    pages: [
      pg(
        '🐪',
        'My name is Nuri, and I am a camel. I am not a famous camel, but I am the only one who tells the truth about this journey, because nobody else is paying attention to the luggage. I live in the kingdom of Queen Makeda, and my keeper, a twelve-year-old girl named Selam, feeds me dates and sings to me. Today, there is great excitement. The merchant Tamrin has returned from a faraway city, and the queen herself came to hear his news. I hear everything, because I am tall and I do not blink.',
        'A tall camel with a young girl feeding it dates in a caravan yard.'
      ),
      pg(
        '📖',
        'The Kebra Nagast, a 14th-century Ethiopian book, tells how the merchant Tamrin described King Solomon of Jerusalem: his wisdom, his fair judgements, his great house. I do not follow every word, but I see the queen’s face. Her eyes shine. “I want to see for myself,” she says. “A ruler must keep learning.” Tamrin bows. Selam whispers in my ear, “We are going on a journey, Nuri.” I snort. A journey? With luggage? I knew that would be the end of my peaceful life, and I was right.',
        'A queen listening to a merchant who describes a faraway king, a camel nearby listening.'
      ),
      pg(
        '🎒',
        'Packing takes days. They tie sacks of spices, jars of incense, cloths and gifts onto my back. “That is too much,” I grumble, and Selam laughs. “Nuri, you are the strongest camel in the kingdom.” I like being told that, so I stop complaining, a little. A queen does not travel lightly. There is a long caravan of camels, riders, servants, and traders, with bells jingling in the dawn. Queen Makeda, tall and calm, takes her place at the front. “Let us go,” she says. We go.',
        'A caravan of camels loaded with sacks and jars forming up at dawn, a queen at the front.'
      ),
      pg(
        '🌵',
        'The caravan road is hot, dusty and long. I walk, and walk, and walk. Selam sings about home to keep me going. At night, we camp under huge stars and the queen sits by the fire, asking Tamrin questions. “What does King Solomon ask of those who come? What does he love?” She is not afraid to travel so far to learn. At dawn, Selam wipes the sand from my eyes. “Not far now,” she says. She says that every morning, and every morning I know she is lying, but kindly.',
        'A caravan camped under a sky of stars, a queen talking by the fire.'
      ),
      pg(
        '⛰️',
        'On the hardest day, I stumble on a stony slope, and the load slips. The whole line stops. I expect to be scolded, but Queen Makeda herself steps down. She lifts the corner of the sack with her own hands. “Help the camel,” she says to the servants, “and share the load.” I did not expect a queen to care about a camel’s back. After that, I walk a little lighter, because the load is lighter, and because a ruler who notices the smallest creature is a ruler worth following.',
        'A queen helping to steady a load on a stumbling camel on a rocky slope.'
      ),
      pg(
        '🏛️',
        'At last, we reach the great city of Jerusalem. The buildings gleam. I am impressed, though I try to hide it. Queen Makeda is welcomed by King Solomon, and the two rulers talk for many days. I stand outside with Selam, chewing and listening to bits of conversation. The tradition says that the queen asked many questions and that the king answered them with great wisdom. The Bible says that King Solomon gave the queen all she desired, and she gave gifts in return. I deliver the spices, which are the only part of the conversation I understand.',
        'A queen and a king in conversation in a grand hall while a camel waits outside.'
      ),
      pg(
        '🎁',
        'While we wait, Selam and I explore the market. She buys me a sweet fig, and I forgive her for the luggage. “Nuri,” she says, “the queen travelled so far because she wanted to learn, not because she needed anything.” I think about that. “Maybe wisdom is a kind of travel,” I say, though only a camel hears it. “You go out, you ask, you listen, and then you come home different.” Selam strokes my neck. I think she understood, but she might just have been scratching.',
        'A girl and a camel in a bustling market, a fig in her hand.'
      ),
      pg(
        '🏠',
        'The journey home is easier, because the load is lighter and the destination is familiar. Back in our kingdom, Queen Makeda tells her people what she has learned. The Kebra Nagast says that she bore a son, Menelik, who in time founded a line of rulers in Ethiopia that came to be called the Solomonic dynasty. Historians note that this is tradition, and that many doubt whether the queen herself can be proved as a historical person. I do not mind. A good story can teach, even when the facts are uncertain.',
        'A caravan returning home across a golden plain toward a distant green kingdom.'
      ),
      pg(
        '⭐',
        'That evening, in the quiet stable, Selam leans against me. “Do you think the queen would have gone without us?” she asks. “She could not,” I say, in camel, which she cannot understand. “Nobody can carry a whole journey alone.” I settle down to sleep. Tomorrow I will carry something ordinary again, but I know now that even a camel who grumbles can be part of something big. And if anyone asks, tell them it was the camel who kept the spices safe. I would like that to be remembered.',
        'A camel resting in a stable at night with a sleepy girl leaning against it, stars outside.'
      ),
    ],
    activities: [
      {
        id: 'gi-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why does Queen Makeda decide to make the journey?',
        options: [
          'She wants to move her whole kingdom far abroad',
          'She has been ordered to go there by another king',
          'She wants to see King Solomon’s wisdom herself',
        ],
        correctIndex: 2,
      },
      {
        id: 'gi-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What does Queen Makeda do when the camel stumbles?',
        options: [
          'She sends the tired camel back home alone',
          'She helps lift the load and has it shared',
          'She tells the servants to hurry on faster',
        ],
        correctIndex: 1,
      },
      {
        id: 'gi-c3',
        type: 'comprehension',
        afterPage: 8,
        question: 'How does the story describe the Kebra Nagast?',
        options: [
          'As a letter written during the queen’s lifetime',
          'As a report made by the camel keepers',
          'As a 14th-century Ethiopian book of tradition',
        ],
        correctIndex: 2,
      },
      {
        id: 'gi-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: you want to learn about a skill. What would Queen Makeda do?',
        options: [
          'Seek out a wise teacher and ask good questions',
          'Wait for the skill to arrive on its own someday',
          'Say that you already know everything that matters',
        ],
        correctIndex: 0,
      },
      {
        id: 'gi-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Tamrin tells the queen about King Solomon',
          'The caravan is packed and sets off',
          'The queen helps the stumbling camel',
          'The queen and King Solomon talk in Jerusalem',
          'The caravan returns home',
        ],
      },
      {
        id: 'gi-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'caravan',
        definition: 'A group of travellers and animals journeying together, often across a desert.',
        distractors: [
          'A small boat used on a river',
          'A cloth used to carry fruit',
        ],
      },
    ],
    glossary: [
      {
        word: 'caravan',
        definition: 'A group of travellers and animals journeying together.',
        pages: [3, 4],
      },
      {
        word: 'merchant',
        definition: 'A person who buys and sells goods.',
        pages: [1, 2],
      },
      {
        word: 'wisdom',
        definition: 'Good judgement based on knowledge and experience.',
        pages: [2, 6, 7],
      },
      {
        word: 'tradition',
        definition: 'A story or custom passed down through generations.',
        pages: [6, 8],
      },
      {
        word: 'dynasty',
        definition: 'A line of rulers from the same family.',
        pages: [8],
      },
      {
        word: 'historians',
        definition: 'People who study the past.',
        pages: [8],
      },
    ],
    culturalNotes: [
      'Source and tradition: the Kebra Nagast (The Glory of the Kings) is a 14th-century Ethiopian national epic that tells of Queen Makeda’s journey to King Solomon and of their son Menelik I, who founded the Solomonic dynasty. It is told as tradition. Historians dispute whether the queen existed, and some link Sheba with ancient Saba in Yemen or with the kingdom of Aksum. The Bible, in 2 Chronicles 9, says that King Solomon gave the Queen of Sheba all she desired. The Kebra Nagast’s account of how the son was conceived is not told here.',
      'Original piece written for Ghanaian JHS learners from well-known oral tradition and history. The scenes and child characters are invented, and it copies no published retelling or epic text.',
      'Special note: this story is tradition and is presented respectfully for learners of all faiths. It does not claim that every detail is proven. Teachers should treat Christian, Muslim and Jewish traditions about the Queen of Sheba with equal respect. Camel and child characters are invented. This is not professional advice.',
    ],
    reviewQuestions: [
      'Check the spellings Makeda, Tamrin, Menelik and Kebra Nagast with an Ethiopian or Eritrean teacher if you can.',
      'Check that the description of the tradition is respectful and clearly labelled as tradition.',
      'Check the sums on the maths card.',
    ],
    guide: {
      overview:
        'A camel’s eye view of Queen Makeda’s journey to King Solomon, as told in Ethiopian tradition, about curiosity, shared loads and wisdom.',
      lessonMinutes: 45,
      goals: [
        'Retell the journey in order.',
        'Say why Queen Makeda travelled.',
        'Explain what a tradition is, and why the story is labelled as one.',
        'Describe one way to keep learning.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: African kingdoms and trade routes; codes to verify)', 'Queen Makeda and the Kebra Nagast'],
        ['English Language (NaCCA CCP: narrative point of view; codes to verify)', 'A story told by an animal'],
      ],
      before: ['Ask: who would you travel far to learn from?'],
      during: ['Stop after Page 5. Ask: what does the queen’s kindness to the camel tell us about her?'],
      after: ['Learners write a short diary entry from the camel’s point of view on another day of the journey.'],
      discussion: ['Why might a ruler leave home to learn instead of sending others?'],
      reflection: ['What would you most like to learn from someone wise?'],
      maths: [
        {
          task: 'The caravan has 24 camels. Each carries 5 sacks. How many sacks in total?',
          answer: '24 × 5 = 120 sacks.',
        },
        {
          task: 'If a caravan travels about 25 km a day for 60 days, how far does it go? (Practice numbers only.)',
          answer: '25 × 60 = 1,500 km.',
        },
      ],
      support: ['Give a map of the route to colour as the story is read.'],
      stretch: ['Compare how the story of the Queen of Sheba appears in different traditions.'],
      localise: ['Ask who in your community is known for wisdom, and what you could ask them.'],
      factCheck: ['The story is fiction around tradition. Check the Kebra Nagast details (a 14th-century Ethiopian epic; the merchant Tamrin; the son Menelik I and the Solomonic dynasty), that the Bible’s 2 Chronicles 9:12 is correctly paraphrased, and that the note that historians dispute the queen’s existence is fair. Also check how Makeda’s kingdom is described (Aksum, Saba, or Sheba) for your teaching context.'],
    },
  }),

  // 4
  mk({
    key: 'case-file-who-built-aminas-walls',
    title: 'Case File: Who Built Queen Amina’s Walls?',
    summary:
      'Queen Amina of Zazzau is remembered as a warrior and wall-builder, but historians disagree on how much is certain. A case-file article that weighs the legend against the evidence and shows how to say “we do not yet know”.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'responsibility', 'kindness', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['african-legends', 'wider-africa', 'queen-amina', 'zazzau', 'evidence'],
    wpm: 125,
    paceWord: 'Calm, curious, and careful',
    palette: ['#854d0e', '#1d4ed8'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Quiet, steady drum with a thoughtful flute, like a detective’s theme (placeholder)',
    pages: [
      pg(
        '🔍',
        'CASE FILE. Subject: Queen Amina of Zazzau, a ruler remembered in the Hausa city-state of Zazzau, today’s Zaria in northern Nigeria. Question: did a warrior queen, Queen Amina, build the walls known as ganuwar Amina, and how much of her story can we prove? A detective does not begin with the answer. A good detective sorts the clues into three kinds: what was written, what was remembered, and what can still be seen. In this article we will play the detective, listen to each witness, and keep the verdict open until the evidence is weighed.',
        'A magnifying glass over a map of northern Nigeria, with three folders labelled written, remembered and seen.'
      ),
      pg(
        '👑',
        'THE LEGEND. Tradition says Queen Amina was born around the middle of the 1500s, the daughter of a ruler of Zazzau, and that she became queen when her brother died. Many accounts give her rule as about 1576 to 1610, though some give later dates. Her name means truthful or honest. The legend says she led her armies on long campaigns, made Zazzau powerful, and built strong walls around towns. Note the words “tradition says”. A legend is a first witness, not a final proof. Now we must ask: what do the other witnesses say?',
        'A queen on horseback on a hill above a walled town, drawn like a storybook picture.'
      ),
      pg(
        '📜',
        'WITNESS ONE: WRITTEN RECORDS. The main written sources about early Zazzau, such as the Chronicle of Zaria, were composed in the early 1900s from oral tradition, about three hundred years after Queen Amina’s time. Other chronicles, such as the Kano Chronicle, mention rulers of the region too. That does not make them false, but it means the writers were not eyewitnesses. In a case like this, a written clue from far later is useful but must be handled gently. We note it, and we mark it “later source”.',
        'An old manuscript with a note reading later source pinned to it.'
      ),
      pg(
        '❓',
        'WITNESS TWO: THE MISSING NAME. Here is a surprising clue. Her name is not on the lists of rulers in the Chronicle of Abuja and two other sources. Because of this, some historians question whether she existed at all. Others say she is accepted as real, although many details of her life are in dispute. How should a detective treat a missing name? Absence is a clue, not a verdict. A name can be missing because lists were short, because later writers did not know it, or because she did not exist. We keep all three possibilities alive.',
        'A list of royal names with one line left blank and a question mark beside it.'
      ),
      pg(
        '🧱',
        'WITNESS THREE: THE WALLS. Across Hausaland, towns built high earth walls for protection, and in many places, remains of walls are called ganuwar Amina, meaning Queen Amina’s walls. The tradition says she ordered them. Here the detective must be careful. Many Hausa towns built walls over the centuries, and walls are not signed. A wall called by her name may have been started in her time, extended later, or simply named for her afterwards, because she was remembered as a builder. The walls are real. The question is who built which part, and when.',
        'A long earth wall curving around a town with farmland on either side.'
      ),
      pg(
        '⏳',
        'THE DATING PROBLEM. How could we date a wall? Scientists and archaeologists can sometimes study the soil layers, buried pieces of wood or pottery, and compare building styles, to learn roughly when a wall was made. Without such tests for each section, we cannot say that all the walls came from one reign. A long wall may have taken many years and many rulers. This is why historians say that the walls’ link to Queen Amina is tradition rather than proof. A fair detective writes “possible,” “likely,” or “unproven” beside each claim, rather than “certain.”',
        'An archaeologist measuring soil layers in a cut section of an earth wall.'
      ),
      pg(
        '🗺️',
        'THE BIG CLAIMS. Some later writers, including the Sokoto leader Muhammad Bello in the 1800s, said she conquered land as far as the area where the rivers Niger and Benue meet, and made Kano and Katsina pay tribute. Many historians today dispute these claims. Why? Because neighbouring kingdoms, such as Kano and Katsina, blocked Zazzau’s growth to the north, and the written sources are late. Still, it seems clear that Zazzau grew powerful in this period. A careful detective would say: Zazzau grew strong, and Queen Amina is remembered as its great queen.',
        'A map of northern Nigeria with two rivers meeting and question marks over disputed lands.'
      ),
      pg(
        '⚖️',
        'THE POSSIBLE VERDICTS. One: Queen Amina was a real queen, and many of the walls are hers. Two: Queen Amina was a real queen, but the walls grew over many reigns, and her name came to stand for all of them. Three: the legend blends the deeds of several rulers into one remembered queen. With the evidence we have, the first is unproven, the second is possible, and the third cannot be ruled out. A good case file does not force a verdict. It says clearly what is known, what is likely, and what remains unknown.',
        'Three scales balancing the same pile of clues, each leaning a different way.'
      ),
      pg(
        '💡',
        'CASE CLOSED, FOR NOW. Why does this matter? Because the memory of Queen Amina carries real meaning for many people: it reminds us that women led and built in African history. That meaning is true even if some details are uncertain. A good historian respects the tradition and still asks questions. Her name, which means truthful, offers a challenge to us all. Before repeating a famous story, ask three things: who said it, how long after the events, and what else supports it? The most honest sentence in history is sometimes, “We do not yet know.”',
        'A detective closing a folder labelled open, with a lamp lighting a drawing of a walled town.'
      ),
    ],
    activities: [
      {
        id: 'gj-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why must the Chronicle of Zaria be handled carefully as evidence?',
        options: [
          'It was written in a language that no one reads',
          'It was written by the queen herself in her time',
          'It was written about three hundred years later',
        ],
        correctIndex: 2,
      },
      {
        id: 'gj-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What is the best description of the walls called ganuwar Amina?',
        options: [
          'Real walls, but who built which part is unclear',
          'Imaginary walls that nobody has ever really seen at all',
          'Walls proven to be built by one queen in a single year',
        ],
        correctIndex: 0,
      },
      {
        id: 'gj-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'Why do many historians dispute the claim that she ruled as far as the Niger–Benue meeting?',
        options: [
          'The two rivers were not known to anyone in those days',
          'Sources are late and neighbours blocked growth',
          'Her army was far too big to travel so far south',
        ],
        correctIndex: 1,
      },
      {
        id: 'gj-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: you read a post that says a famous leader built a huge wall alone. What should you ask first?',
        options: [
          'Who said it, how long after, and what supports it?',
          'How many people have already shared the post today?',
          'Is the name of the leader easy for me to spell?',
        ],
        correctIndex: 0,
      },
      {
        id: 'gj-s1',
        type: 'sequencing',
        prompt: 'Put the steps of the investigation in order.',
        items: [
          'Collect the three kinds of clues',
          'Weigh the written records',
          'Note the missing name on some lists',
          'Examine the walls and the dating problem',
          'Write the possible verdicts',
        ],
      },
      {
        id: 'gj-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'evidence',
        definition: 'Facts or signs that help show whether something is true.',
        distractors: [
          'A person who is called to a court',
          'A strong wall made of earth',
        ],
      },
    ],
    glossary: [
      {
        word: 'tradition',
        definition: 'A story or custom handed down through the generations.',
        pages: [2, 5, 6],
      },
      {
        word: 'evidence',
        definition: 'Facts or signs that help show whether something is true.',
        pages: [1, 8],
      },
      {
        word: 'dispute',
        definition: 'To disagree about whether something is true.',
        pages: [4, 7],
      },
      {
        word: 'chronicle',
        definition: 'A written record of events in the order they happened.',
        pages: [3, 4],
      },
      {
        word: 'tribute',
        definition: 'Goods or payment given to a stronger ruler.',
        pages: [7],
      },
      {
        word: 'archaeologists',
        definition: 'Scientists who study the past by digging up what is left.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Source and history: Queen Amina of Zazzau (Zaria) is traditionally dated to the second half of the 1500s, often given as 1576 to 1610, though some sources give other dates and some historians question whether she existed. Her name is absent from some lists of rulers, such as the Chronicle of Abuja. The walls called ganuwar Amina are real, but dating them to her reign is tradition. The article gives her as a possible real ruler, not a proven one.',
      'Original piece written for Ghanaian JHS learners from well-known oral tradition and history. The scenes and child characters are invented, and it copies no published retelling or epic text.',
      'Special note: the piece avoids stories about her campaigns, her captives and her relationships, which are disputed and not suitable for this age. It does not describe fighting. A short note that captive-taking and the trade in people were part of the period may be added by the teacher with care. Point learners to the school counsellor or a trusted adult if they are upset. This is not professional advice.',
    ],
    reviewQuestions: [
      'Check the spelling of Zazzau, Zaria, ganuwar Amina and Hausa terms with a Hausa speaker.',
      'Check that the verdicts are fair and that the article does not overstate the doubt or the certainty.',
      'Check the sums: 1610 − 1576 = 34, and 4,000 ÷ 600 = 6.7, so 7 weeks.',
    ],
    guide: {
      overview:
        'A case-file article that weighs the legend of Queen Amina and her walls against the written, remembered and physical evidence, and teaches how to say we do not yet know.',
      lessonMinutes: 45,
      goals: [
        'Name three kinds of evidence.',
        'Explain why a late source needs care.',
        'Describe why a missing name is a clue, not a verdict.',
        'Write a fair verdict that says what is known, likely and unknown.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: sources of history; codes to verify)', 'Queen Amina of Zazzau and the evidence for her walls'],
        ['English Language (NaCCA CCP: informational and argument writing; codes to verify)', 'Weighing evidence and writing a verdict'],
      ],
      before: ['Ask: how can we know if a famous story from long ago is true?'],
      during: ['Stop after Page 4. Ask: is a missing name proof that someone did not exist?'],
      after: ['Learners write their own verdict on a famous local story using known, likely and unknown.'],
      discussion: ['Why does a story still matter if some details are uncertain?'],
      reflection: ['What claim have you repeated without checking?'],
      maths: [
        {
          task: 'Tradition gives Amina’s rule as about 1576 to 1610. How many years is that?',
          answer: '1610 − 1576 = 34 years.',
        },
        {
          task: 'A wall of 4,000 metres is dug by a team that completes 600 metres a week. How many weeks (to the next whole week) does it take? (Practice figures only.)',
          answer: '4,000 ÷ 600 = 6.7, so 7 weeks.',
        },
      ],
      support: ['Give a table with columns for known, likely, and unknown.'],
      stretch: ['Compare the evidence for Queen Amina with that for Okomfo Anokye’s sword at Kumasi.'],
      localise: ['Ask an elder about walls, forts or boundaries in your area, and how they are remembered.'],
      factCheck: ['Check with a historian or Hausa teacher: the dates of Queen Amina’s rule (about 1576 to 1610; others differ), the Chronicle of Zaria’s date (early 1900s) and its basis in oral tradition, the missing name in the Chronicle of Abuja, that ganuwar Amina walls survive in places, Muhammad Bello’s claim and its dispute, and the meaning of Amina as truthful.'],
    },
  }),

  // 5
  mk({
    key: 'many-hands-one-kingdom-king-shaka',
    title: 'Many Hands, One Kingdom: King Shaka and the Amabutho',
    summary:
      'King Shaka of the Zulu Kingdom is remembered for building unity from many small clans. An article about age-regiments, endurance, teamwork and the honest debate among historians, told without any scenes of fighting.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'responsibility', 'kindness', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['african-legends', 'wider-africa', 'king-shaka', 'zulu', 'amabutho'],
    wpm: 125,
    paceWord: 'Steady, strong, and thoughtful',
    palette: ['#14532d', '#78350f'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Slow, strong rhythmic clapping with a deep drum (placeholder)',
    pages: [
      pg(
        '🏔️',
        'In southern Africa, the hills roll green and wide. In the early 1800s, many small clans lived there, each with its own chief and cattle. Then a new kingdom grew: the Zulu Kingdom, led by King Shaka kaSenzangakhona. He lived from about 1787 to 1828 and was king from 1816. Few leaders have been written about more, and few have been argued about more. In this article we look at one theme: how a leader can help many different groups work together, using endurance, teamwork and shared rules. We do not describe fighting, and we mark clearly where historians disagree.',
        'Green hills in southern Africa with several small homesteads and a distant larger settlement.'
      ),
      pg(
        '🧒',
        'Young King Shaka did not start as a king. According to many accounts, he grew up serving others. As a young man, he joined an age-regiment under Inkosi Dingiswayo, the chief of the Mthethwa, who noticed his ability and put him in charge of a regiment. In Zulu, a regiment of this kind is called an ibutho, and many together are called amabutho. A ruler needs helpers and teachers, and King Shaka’s early years gave him both. The lesson is simple: those who lead well often learn first how to follow and to serve.',
        'A young man learning among others in a regiment in a hillside homestead.'
      ),
      pg(
        '🤝',
        'What was an ibutho? One historian describes it as an age-based group of young people who worked together under a leader. It could be called on to hunt, do labour, police, or defend. It was not only about fighting. Members who joined at the same age grew up side by side, sharing meals, work and training. This built trust across clan lines, because a young man’s closest friends were no longer only his cousins but his age-mates from many homes. When you work with the same team every day, differences get smaller.',
        'A group of same-age young people working together on a shared task near a homestead.'
      ),
      pg(
        '🏃',
        'Endurance means being able to keep going when something is difficult. Accounts say the regiments trained their fitness, for instance by running long distances, and learned discipline. King Shaka is credited with refining the regiment system, and with changing how the groups were organised and trained. Historians remind us, however, that many of his reforms built on structures that already existed. A good reformer does not throw everything away. They take what works, improve it, and ask everyone to practise. A strong team, like a strong body, is built a little each day.',
        'Young people running in a line across a hilltop at sunrise, with a leader running beside them.'
      ),
      pg(
        '🧶',
        'Unity was the king’s bigger task. Historians say King Shaka formed alliances with smaller neighbours, and used alliances and diplomacy alongside military strength. Over time, many clans became part of one kingdom. Think of weaving a mat. One reed breaks easily, but many reeds woven together make something strong that can hold a family. A leader does not have to remove differences to create unity. A leader can ask people to keep their own families and names, while sharing rules, duties and a common identity. That is much harder than it sounds.',
        'Hands weaving many reeds into a single strong mat.'
      ),
      pg(
        '⚖️',
        'Now comes the part that makes history interesting: historians argue. Some see King Shaka as a great uniter and military genius, a leader who brought order to a divided region. Others say he was more of a usurper, someone who took power from traditional rulers. Still others point out that the kingdom was shaped by many people, such as Inkosi Dingiswayo and the Mthethwa, and not by one person alone. A good reader keeps these views side by side. A single hero story is simple, but the truth is often a conversation between many voices.',
        'Three speakers at a table, each with different notes, discussing a drawing of a king.'
      ),
      pg(
        '🕯️',
        'A careful note. Historians also study the suffering of ordinary people in the years when the Zulu Kingdom grew and when the region was in upheaval, and they continue to discuss how much of it was due to King Shaka and how much to other causes. We will not describe those events here. If this part of history makes you feel sad or worried, it is healthy to talk with your teacher, the school counsellor, or a trusted adult. Learning history means making room for both pride in achievements and respect for people who suffered. This article is not professional advice.',
        'A quiet scene of a teacher sitting with a student, a candle on a table.'
      ),
      pg(
        '🌍',
        'What happened to the amabutho afterwards? In 1879, British colonial rulers outlawed them. Yet one study shows that Zulu chiefs went on forming regiments for different purposes. They became youth groups, they helped to recruit workers, they provided a way to speak about politics, and they helped to keep Zulu identity alive in a changing South Africa. An idea that helps people belong is hard to erase. Even when circumstances change, communities keep what binds them together, and adapt it. The history of the amabutho is partly a story of how a community survived.',
        'Young Zulu men in traditional dress together at a cultural gathering in modern South Africa.'
      ),
      pg(
        '🌱',
        'So what can we learn about endurance and unity? First, great things grow from many small, steady efforts, like daily practice with a team. Second, unity works best when people can keep their own identity while sharing a goal. Third, we should read about powerful leaders with open eyes, admiring what is admirable and asking questions where historians disagree. In your own class, you can try the same: choose a small daily habit that helps everyone, such as arriving on time, and keep it for a month. Endurance is a decision made again each morning.',
        'A classroom of students standing together around a shared poster, with green hills through the window.'
      ),
    ],
    activities: [
      {
        id: 'gk-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What was an ibutho?',
        options: [
          'A kind of shield carried only by senior chiefs',
          'An age-based group that worked under a leader',
          'A river that kept the neighbouring clans apart',
        ],
        correctIndex: 1,
      },
      {
        id: 'gk-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did unity mean for the clans under King Shaka, according to the article?',
        options: [
          'Giving up family names so everyone looked the same',
          'Moving every single clan into one very large town',
          'Sharing rules and duties but keeping family names',
        ],
        correctIndex: 2,
      },
      {
        id: 'gk-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'Why do historians disagree about King Shaka?',
        options: [
          'There were never any written words about him',
          'Some see a uniter and others a usurper',
          'Nobody knows where the Zulu live today',
        ],
        correctIndex: 1,
      },
      {
        id: 'gk-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: your class wants to build team spirit. What does the article suggest?',
        options: [
          'Pick a single leader and ignore everyone else here',
          'Wait for another class to organise it for them',
          'Choose a small daily habit and keep it together',
        ],
        correctIndex: 2,
      },
      {
        id: 'gk-s1',
        type: 'sequencing',
        prompt: 'Put the ideas of the article in order.',
        items: [
          'Many small clans live in the hills',
          'Shaka serves in an age-regiment under Inkosi Dingiswayo',
          'The regiments train together and build trust',
          'Shaka forms alliances and the Zulu Kingdom grows',
          'The amabutho continue in new forms after 1879',
        ],
      },
      {
        id: 'gk-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'ibutho',
        definition: 'An age-based regiment, a group of young people who worked and trained together.',
        distractors: [
          'A large grass hut for storing grain',
          'A song sung before sunrise',
        ],
      },
    ],
    glossary: [
      {
        word: 'regiment',
        definition: 'A group of people organised to work or train together under a leader.',
        pages: [2, 4],
      },
      {
        word: 'endurance',
        definition: 'The ability to keep going when something is difficult.',
        pages: [1, 4, 9],
      },
      {
        word: 'alliances',
        definition: 'Agreements to support one another.',
        pages: [5],
      },
      {
        word: 'usurper',
        definition: 'Someone who takes power that is not rightfully theirs.',
        pages: [6],
      },
      {
        word: 'historians',
        definition: 'People who study the past.',
        pages: [4, 6, 7],
      },
      {
        word: 'identity',
        definition: 'The things that make a person or group who they are.',
        pages: [5, 8, 9],
      },
    ],
    culturalNotes: [
      'Source and history: Shaka kaSenzangakhona (about 1787 to 1828) was king of the Zulu Kingdom from 1816 to 1828. He served in a regiment under Inkosi Dingiswayo of the Mthethwa and developed the ibutho (age-regiment) system with support. Historians debate whether he was a great uniter and military reformer or a usurper, and how much of the Zulu state grew from existing structures. The amabutho were outlawed by the British in 1879 and later reused in other ways. The article shows no fighting and does not present one view as settled.',
      'Original piece written for Ghanaian JHS learners from well-known oral tradition and history. The scenes and child characters are invented, and it copies no published retelling or epic text.',
      'Special note: the piece names the suffering of the period in one short, gentle page and does not describe violence. Teachers should be ready to guide learners to the school counsellor or a trusted adult, and may wish to prepare in advance, as this topic can raise strong feelings. The piece does not mention the stories of his death, family or rule, which are contested. This is not professional advice.',
    ],
    reviewQuestions: [
      'Check Zulu names and terms (Shaka kaSenzangakhona, Inkosi Dingiswayo, ibutho, amabutho) with a Zulu speaker.',
      'Check that the fair balance between admiration and debate is right for JHS.',
      'Check the sums: 120 × 6 = 720 and 5 × 6 × 4 = 120.',
    ],
    guide: {
      overview:
        'An article about King Shaka and the age-regiments that helped unite many Zulu clans, about endurance and teamwork, with an honest note about the debate among historians.',
      lessonMinutes: 45,
      goals: [
        'Describe what an ibutho was.',
        'Explain how teamwork can build unity across groups.',
        'Say why historians disagree about King Shaka.',
        'Choose a daily habit that helps a team.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: African states and leaders; codes to verify)', 'King Shaka and the Zulu Kingdom'],
        ['Physical Education (NaCCA CCP: teamwork and fitness; codes to verify)', 'Endurance and training together'],
      ],
      before: ['Ask: what makes a team trust each other?'],
      during: ['Stop after Page 6. Ask: why is it useful to hear more than one view of a leader?'],
      after: ['Learners agree a small daily class habit and plan how to track it for a week.'],
      discussion: ['Can a group be united without everyone being the same?'],
      reflection: ['What daily habit helps you keep going when it is hard?'],
      maths: [
        {
          task: 'A regiment has 120 young people. If 6 regiments train together, how many young people is that?',
          answer: '120 × 6 = 720.',
        },
        {
          task: 'A team runs 5 km a day, 6 days a week. How far do they run in 4 weeks? (Practice figures only.)',
          answer: '5 × 6 × 4 = 120 km.',
        },
      ],
      support: ['Give a simple three-column chart: known, argued, and unknown.'],
      stretch: ['Find out how another African leader brought different groups together and compare.'],
      localise: ['Ask an elder how your community brings different families together for a shared task.'],
      factCheck: ['Check with a historian or Zulu speaker: Shaka’s dates (about 1787 to 1828; king from 1816), service under Inkosi Dingiswayo of the Mthethwa, the description of the ibutho as an age-based group used for labour, hunting, policing and defence, the debate about uniter versus usurper, that many reforms built on existing structures, and that the amabutho were outlawed in 1879 and later reused.'],
    },
  }),

  // 6
  mk({
    key: 'the-ledger-of-mansa-musa',
    title: 'The Ledger of Mansa Musa: Gold, Books and Buildings',
    summary:
      'Mansa Musa of Mali is remembered as one of the richest rulers in history. This article reads his story like a ledger, with columns for gold, books and buildings, and uses simple maths to understand what wealth can do.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'responsibility', 'kindness', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['african-legends', 'wider-africa', 'mansa-musa', 'mali-empire', 'timbuktu'],
    wpm: 125,
    paceWord: 'Clear, brisk, and curious',
    palette: ['#a16207', '#0f766e'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Bright kora-style plucking with a soft coin-like chime (placeholder)',
    pages: [
      pg(
        '📒',
        'Imagine a great ledger, a book where a clerk writes what comes in and what goes out. Now imagine the ledger of Mansa Musa, the ruler of the Mali Empire in the early 1300s. Sources give his accession as around 1307 or 1312, and he is often called Hajji Mansa Musa because he made the pilgrimage to Mecca. We will open his ledger in three columns: gold, books and buildings. For each entry we will ask two questions. What do the sources say? And what can simple sums teach us about it?',
        'An open ledger with three columns labelled gold, books and buildings.'
      ),
      pg(
        '⛏️',
        'COLUMN ONE, GOLD: where did it come from? Mali controlled and taxed trade in salt from the north and gold from the gold-rich lands to the south. Traders came with camels and left gifts and taxes. Gold was panned from rivers and mined, and the empire was one of the largest producers of gold of its time. Wealth in this ledger was not a treasure chest sitting in a room. It was a flow of trade, taxes and tributes. A ruler who protects roads and markets collects a share each time something is bought or sold. That is how the numbers grew.',
        'Camels loaded with salt and gold crossing a desert market, with a clerk noting amounts.'
      ),
      pg(
        '🕌',
        'ENTRY: THE PILGRIMAGE. In 1324, Mansa Musa set out for Mecca with a huge company of people. Sources give very different numbers. One encyclopedia says tens of thousands of men and many camels carrying gold, while another account gives 8,000 courtiers, 12,000 servants and 100 loads of gold. When sources disagree, a careful reader writes “about” and “reported”. The journey crossed the Sahara and took many months. Whatever the exact numbers, the size of the caravan made people across the Muslim world talk about Mali for generations.',
        'A long caravan crossing the desert toward a faraway city.'
      ),
      pg(
        '🏙️',
        'ENTRY: CAIRO. On the way, the caravan reached Cairo, where he was received by the sultan. Accounts say he stayed about three months and gave away gold freely. Writers said the generous spending affected the value of gold in Egypt, and some say it took years to recover, though modern historians are cautious about the exact effect. This shows an important economic idea. If a lot of one thing suddenly appears in a market, each piece may be worth less. This is why the ledger tells us that gold, like anything else, depends on how much there is, and who wants it.',
        'A busy Cairo market with a visiting caravan scattering gold coins among crowds.'
      ),
      pg(
        '📚',
        'COLUMN TWO, BOOKS: what did he bring back? Sources say that Mansa Musa recruited scholars from the wider Muslim world. One was the Andalusian poet and architect Abu Ishaq al-Sahili. They helped make Timbuktu a centre of learning. Later Timbuktu was famous for scholars, libraries, and manuscripts. Gold paid for the travel, the housing and the teachers. A wise ruler understands that the best things money can buy are things that outlast the money, like knowledge. In this ledger, the books column is smaller in size but larger in lasting value.',
        'Scholars with manuscripts studying together in an early Timbuktu courtyard.'
      ),
      pg(
        '🧱',
        'COLUMN THREE, BUILDINGS: what did the gold build? Accounts connect his reign with a portion of the Djinguereber Mosque in Timbuktu, which still stands, and with mosques at Gao and a grand audience chamber at Niani. Historians caution that some details are uncertain. Buildings were made of earth and wood, and needed repairs from the community every year. This is a story of shared work, not of one ruler alone. People mixed mud, carried water, and plastered walls. A mosque, a school or a hall is a ledger entry that people can walk into.',
        'Builders plastering a mud-brick mosque wall in Timbuktu while others carry water.'
      ),
      pg(
        '🔎',
        'AUDITING THE LEDGER: how do we know? Much of what we know about Mansa Musa comes from Arabic writers, such as al-Umari and Ibn Khaldun, who gathered information after his pilgrimage, and from later Timbuktu chronicles. Oral traditions kept by griots, in contrast, tell relatively little about him. So the main sources come from outside the story’s own storytellers and from people who heard about him second-hand. A good auditor does not throw out such records, and does not trust them blindly. We cross-check, and we say “according to” each time.',
        'An auditor with a magnifying glass comparing two old manuscripts at a desk.'
      ),
      pg(
        '🧮',
        'THE MATHS PAGE. Let us practise with sample numbers, which are not real records. Suppose a caravan has 80 camels and each carries 300 pounds (about 136 kg) of gold. The total is 80 × 300 = 24,000 pounds. If 1 pound of gold buys 20 sacks of grain, that gold could buy 24,000 × 20 = 480,000 sacks. Now suppose a ruler spends half on gifts, a quarter on buildings, and the rest on books. Half and a quarter leave one quarter, so the books get 6,000 pounds. Simple fractions show how a large sum can be shared among purposes.',
        'A chalkboard with sums about camels, pounds of gold and sacks of grain.'
      ),
      pg(
        '⚖️',
        'THE BALANCE. A ledger should end with a balance, a summary of what was gained and what was spent. Gold was spent, but books and buildings remained. Mansa Musa’s name was carried to distant lands, and Mali was drawn on maps. Some stories call him the richest person in history, but historians point out that it is almost impossible to measure. What matters most is not the biggest number but the choice. He used wealth to travel, learn, and build. Ask yourself: if you had a ledger of your time, what would you put in each column?',
        'A balance scale with a gold coin on one side and a book and a small mosque on the other.'
      ),
    ],
    activities: [
      {
        id: 'gl-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What should a careful reader do when sources disagree on numbers?',
        options: [
          'Write about and note that the sources differ',
          'Pick the biggest number and state it as fact',
          'Ignore every source and say nothing about it',
        ],
        correctIndex: 0,
      },
      {
        id: 'gl-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did Mansa Musa’s recruited scholars help to build in Timbuktu?',
        options: [
          'A harbour for large ships from the Atlantic Ocean',
          'A fort to guard the salt mines in the far north',
          'A centre of learning with scholars and libraries',
        ],
        correctIndex: 2,
      },
      {
        id: 'gl-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'Where does much of the information about Mansa Musa come from?',
        options: [
          'Arabic writers and later Timbuktu chronicles',
          'Only the songs that the griots sing in Mali today',
          'Photographs taken during his long journey to Mecca',
        ],
        correctIndex: 0,
      },
      {
        id: 'gl-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: your school wants to use a small fund well. What does the ledger suggest?',
        options: [
          'Spend it all on one big party this very week',
          'Spend on lasting things like books and repairs',
          'Keep it locked in a box and never use any of it',
        ],
        correctIndex: 1,
      },
      {
        id: 'gl-s1',
        type: 'sequencing',
        prompt: 'Put the entries of the ledger in order.',
        items: [
          'Gold comes in from trade and taxes',
          'Mansa Musa sets out on pilgrimage in 1324',
          'He gives gold generously in Cairo',
          'Scholars and architects come to Mali',
          'Mosques and halls are built',
        ],
      },
      {
        id: 'gl-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'pilgrimage',
        definition: 'A journey made for religious reasons to a holy place.',
        distractors: [
          'A tax paid on salt and gold',
          'A book that records money',
        ],
      },
    ],
    glossary: [
      {
        word: 'ledger',
        definition: 'A book that records what comes in and what goes out.',
        pages: [1, 9],
      },
      {
        word: 'pilgrimage',
        definition: 'A journey made to a holy place for religious reasons.',
        pages: [1, 3],
      },
      {
        word: 'tributes',
        definition: 'Goods or payments given to a stronger ruler.',
        pages: [2],
      },
      {
        word: 'scholars',
        definition: 'People who study and teach, with deep knowledge.',
        pages: [5],
      },
      {
        word: 'chronicles',
        definition: 'Written records of events in the order they happened.',
        pages: [7],
      },
      {
        word: 'auditing',
        definition: 'Checking records carefully to see whether they are correct.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Source and history: Mansa Musa (Hajji Mansa Musa) ruled the Mali Empire from about 1307 and made the pilgrimage to Mecca in 1324, passing through Cairo. Sources, mostly Arabic writers such as al-Umari and Ibn Khaldun and later Timbuktu chronicles, give different numbers for his caravan, so the article says about and reported. Abu Ishaq al-Sahili is named as a scholar and architect who came to Mali. His link to the Djinguereber Mosque and to mosques at Gao is traditional and debated. Cairo’s gold value and the title richest person are described as reported, not proven.',
      'Original piece written for Ghanaian JHS learners from well-known oral tradition and history. The scenes and child characters are invented, and it copies no published retelling or epic text.',
      'Special note: the maths figures are invented for practice and are labelled as such. The article does not discuss the contested stories about his accession or the death of his predecessor. It also does not discuss the trade in people that was part of the period’s economy, which a teacher may raise with care. This is not professional advice.',
    ],
    reviewQuestions: [
      'Check Mali names and terms (Mansa Musa, Hajji, Niani, Djinguereber, Timbuktu, Gao) with a Malian or Mande speaker.',
      'Confirm that the “reported” wording about Cairo and about wealth is cautious enough.',
      'Check the sums: 80 × 300 = 24,000; 24,000 × 20 = 480,000; half = 12,000, quarter = 6,000, books = 6,000.',
    ],
    guide: {
      overview:
        'An article that reads the story of Mansa Musa as a ledger with columns for gold, books and buildings, with simple maths and honest notes about the sources.',
      lessonMinutes: 45,
      goals: [
        'Describe where the Mali Empire’s gold came from.',
        'Explain why sources may disagree.',
        'Name two lasting things that Mansa Musa’s wealth supported.',
        'Solve a simple multi-step sum with fractions.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: trade and empires in West Africa; codes to verify)', 'Mansa Musa and the Mali Empire'],
        ['Mathematics (NaCCA CCP: multiplication and fractions; codes to verify)', 'Sharing a large sum'],
      ],
      before: ['Ask: what do you think wealth is best used for?'],
      during: ['Stop after Page 4. Ask: why might a lot of gold in a market make each piece worth less?'],
      after: ['Learners make a ledger with three columns for how they would use their time this week.'],
      discussion: ['Is it better to spend wealth on gifts, on lasting things, or on both?'],
      reflection: ['What will still be there from your work in ten years?'],
      maths: [
        {
          task: 'A caravan has 80 camels, each carrying 300 pounds of gold. How many pounds in total? (Practice figures only.)',
          answer: '80 × 300 = 24,000 pounds.',
        },
        {
          task: 'A ruler spends half of 24,000 pounds on gifts and a quarter on buildings. How many pounds are left for books?',
          answer: 'Half = 12,000, quarter = 6,000, so 24,000 − 18,000 = 6,000 pounds.',
        },
      ],
      support: ['Give a printed ledger with sample numbers to fill in.'],
      stretch: ['Find out about the Timbuktu manuscripts and what they cover.'],
      localise: ['Compare Mali’s gold trade with the gold of the Akan kingdoms, and ask what shared trade routes existed.'],
      factCheck: ['Check with a historian: Mansa Musa’s accession (about 1307; some accounts give 1312) and pilgrimage (1324), the stay in Cairo (about three months) and the reported effect on gold value, the recruitment of Abu Ishaq al-Sahili, the Djinguereber Mosque and Gao mosque links, the sources named (al-Umari, Ibn Khaldun, later Timbuktu chronicles), and that oral tradition says relatively little about him. The caravan numbers differ between sources.'],
    },
  }),

];

export const BATCH_65_STORIES = BATCH_65_AFRICAN_LEGENDS_AFRICA;
