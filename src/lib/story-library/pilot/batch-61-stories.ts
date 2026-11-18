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
      'Is the tale retold with respect for the people it comes from, and is its lesson clear?',
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
      ...(g.factCheck ? { factCheck: g.factCheck } : {}),
    },
  };
};

/**
 * Batch 61 (5 original Life Lessons stories, nine pages each, with activities), for JHS (Basic 7 to Basic 9).
 * Each article is linked to Social Studies, Career Technology, Science, or Computing (see the first cultural note and the teacher guide).
 * These are original stories and articles, each teaching one idea from a well-known book. Stories list their characters; articles have none.
 * Original text written for Ghanaian learners; each factCheck note names the book behind the idea and what to verify.
 */

export const BATCH_61_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'the-missing-phone',
    title: 'The Missing Phone',
    summary:
      'A teacher’s phone goes missing and the whole class is sure that Kwabena took it. Akua sees something that does not fit, and she must choose between staying quiet with the crowd and speaking up. A story about moral courage and fairness.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'courage', 'fairness', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Tense, then steady',
    palette: ['#1d4ed8', '#b45309'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Akua: a JHS 2 girl who notices details.',
      'Kwabena: a quiet boy who is often blamed.',
      'Madam Serwaa: the class teacher.',
      'Esi: Akua’s close friend, who follows the crowd.',
    ],
    music: 'Quiet drumbeat with a low flute (placeholder)',
    pages: [
      pg(
        '📱',
        'On Monday morning, Madam Serwaa could not find her phone. She had left it on her desk during assembly, and now it was gone. The class buzzed with whispers. “It was Kwabena,” said one boy. “He was the last one in the room.” Others nodded. Kwabena was quiet, wore a faded uniform, and was often blamed when things went wrong. He stared at his desk. His ears were red, but he said nothing at all.',
        'A class whispering while a quiet boy stares at his desk.'
      ),
      pg(
        '🗣️',
        'By break, everyone had decided. “He took it. Everybody knows.” Esi said it too, and so did most of the class. Akua felt uneasy. She had also seen Kwabena in the room after assembly, but she had seen something else, too. She tried to remember clearly. In her mind, she saw Kwabena at the desk of the boy who sat behind her. He had been picking up fallen exercise books from the floor, not touching the teacher’s desk. Or was she wrong?',
        'A girl thinking hard while classmates talk behind her.'
      ),
      pg(
        '⚖️',
        'Akua thought about it all through break. If she spoke up, the class might turn on her, and Esi might stop talking to her. If she stayed silent, Kwabena might be punished for something he had not done. She remembered what her father said. “The fact that many people believe something does not make it true.” She decided to check her memory against the evidence. She asked a boy who had been near the door, and he said, “Yes, I saw Kwabena picking up the books.” That helped her feel sure.',
        'A girl talking quietly to a boy near the classroom door.'
      ),
      pg(
        '😰',
        'Akua’s heart pounded as she walked to Madam Serwaa’s desk after lunch. “Madam,” she said, “I do not know who took your phone. But I do not think it was Kwabena. I saw him picking up books after assembly, not near your desk. And another pupil saw it too.” Madam Serwaa looked at her carefully. “Thank you, Akua. That took courage. I will think about it.” Behind her, Akua heard a whisper: “She is defending the thief.”',
        'A girl speaking quietly to a teacher at her desk while others watch.'
      ),
      pg(
        '🥶',
        'The next day, Esi did not sit beside Akua. A few pupils muttered as she walked by. Akua felt lonely and a little afraid. She wondered if she had made a mistake. But at break, Kwabena came to her. “Thank you,” he said in a low voice. “Nobody has ever spoken for me before.” Akua smiled. “I do not know if I am right about everything,” she said, “but I could not stay quiet about what I saw.” They sat together and shared her groundnuts.',
        'A girl sitting with a boy under a tree sharing groundnuts.'
      ),
      pg(
        '🔎',
        'Madam Serwaa did not decide in a hurry. She asked pupils quietly, one by one, what they had actually seen, not what they believed. She also called the cleaner and checked the staff room. On Thursday, she found the phone in the pocket of her own handbag, where she had put it during assembly and forgotten. Nobody had stolen it at all. She stood before the class with a serious face. “I owe an apology,” she said. “And so do many of you.”',
        'A teacher holding up her phone in front of a quiet class.'
      ),
      pg(
        '🙇',
        'The class was silent. Madam Serwaa spoke slowly. “Several of you decided that Kwabena was guilty without any evidence. Why? Because he is quiet, because his uniform is old, and because it was easy to agree with the crowd. That is how people are treated unfairly.” She turned to Kwabena. “I am sorry that I let it go so far.” Kwabena nodded. One by one, other pupils apologised. Esi came to Akua, too. “I am sorry,” she said. “I did not want to be alone.”',
        'A teacher apologising to a boy while the class looks down.'
      ),
      pg(
        '💭',
        'That evening, Akua thought about what had happened. She had been afraid, and she was still not sure she had been entirely right, since the truth was only found later. But she realised that courage is not the absence of fear. It is speaking up for fairness even when your voice shakes. And she also realised something else. She had not known whether Kwabena was innocent. She had only known that nobody had checked. Asking for a fair look is not the same as knowing the answer.',
        'A girl on a veranda at evening looking thoughtful.'
      ),
      pg(
        '📝',
        'Akua wrote in her notebook. “One: Many people believing something does not make it true. Two: Ask what I have actually seen, and ask others what they have seen. Three: Speak up, politely and calmly, for fair treatment, even when it is hard. Four: Ask why a person is being blamed, and whether we are being fair to them.” Try it! Has anyone in your class been blamed without proof? What could you say or do, calmly and fairly? Whom could you ask for help?',
        'A girl writing four lines in a notebook with a friend beside her.'
      ),
    ],
    activities: [
      {
        id: 'yk-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Akua do before speaking up?',
        options: [
          'She checked her memory by asking another pupil',
          'She ignored it',
          'She told everyone',
        ],
        correctIndex: 0,
      },
      {
        id: 'yk-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'How did Akua feel after speaking up?',
        options: [
          'Lonely and a little afraid, but she did not regret it',
          'Happy that everyone agreed',
          'Angry at Kwabena',
        ],
        correctIndex: 0,
      },
      {
        id: 'yk-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What did Madam Serwaa say about how people are treated unfairly?',
        options: [
          'People agree with the crowd without evidence',
          'People always lie',
          'It never happens',
        ],
        correctIndex: 0,
      },
      {
        id: 'yk-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: A classmate is being blamed without proof. Using the story, what should you do?',
        options: [
          'Join the crowd',
          'Calmly ask what is actually known and speak up for a fair check',
          'Say nothing',
        ],
        correctIndex: 1,
      },
      {
        id: 'yk-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'The teacher’s phone goes missing and the class blames Kwabena',
          'Akua remembers what she actually saw',
          'She speaks to Madam Serwaa and loses some friends',
          'The phone is found in the teacher’s own bag',
          'The teacher and pupils apologise',
        ],
      },
      {
        id: 'yk-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'evidence',
        definition: 'Facts that show whether something is true.',
        distractors: [
          'A type of phone',
          'A school rule',
        ],
      },
    ],
    glossary: [
      {
        word: 'uneasy',
        definition: 'Worried or uncomfortable.',
        pages: [2],
      },
      {
        word: 'evidence',
        definition: 'Facts that show whether something is true.',
        pages: [3, 7],
      },
      {
        word: 'courage',
        definition: 'The strength to do something frightening.',
        pages: [4, 8],
      },
      {
        word: 'apologised',
        definition: 'Said sorry.',
        pages: [7],
      },
      {
        word: 'innocent',
        definition: 'Not guilty of doing wrong.',
        pages: [8],
      },
      {
        word: 'unfairly',
        definition: 'In a way that is not just or equal.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Big idea: Moral courage means speaking up for fair treatment even when most people disagree, and checking what is actually known before judging someone. The idea is explored further in “To Kill a Mockingbird” by Harper Lee (1960). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story is invented, with new characters and a school setting. It does not use the book’s plot, characters, or its trial, and it avoids its themes of race and violence, which are better studied through the book itself at a suitable age.',
    ],
    reviewQuestions: [
      'Check that the school setting and the apology scene are suitable.',
      'Check the sums: 30/40 = 3/4; Monday to Thursday = 3 days.',
    ],
    guide: {
      overview:
        'A story about speaking up fairly when the whole class has already decided someone is guilty.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain why Akua checked what she had seen.',
        'Say why many people believing something does not make it true.',
        'Plan a calm way to speak up.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: fairness and justice; codes to verify)', 'Treating people fairly'],
        ['English Language (NaCCA CCP: speaking up; codes to verify)', 'Speaking politely and clearly'],
      ],
      before: ['Ask: when have you seen someone blamed without proof?'],
      during: ['Stop after Page 3. Ask: what should Akua do?'],
      after: ['Learners role-play a calm way to ask for a fair check.'],
      discussion: ['Why was it easy for the class to blame Kwabena?'],
      reflection: ['When have you gone along with a crowd? What would you do now?'],
      maths: [
        {
          task: 'The class has 40 pupils. 30 of them believed Kwabena took the phone. What fraction believed it, in simplest form?',
          answer: '30/40 = 3/4.',
        },
        {
          task: 'The phone went missing on Monday and was found on Thursday. How many days was it missing?',
          answer: 'Monday to Thursday is 3 days.',
        },
      ],
      support: ['Provide sentence starters: ‘I saw… I do not know… but we should check.’'],
      stretch: ['Write what a fair way to investigate a missing item looks like.'],
      localise: ['How do elders in your community make sure everyone is heard in a dispute?'],
      factCheck: ['The story is fiction. The book’s title, author, and year are given from general knowledge. The book deals with serious themes, including racism and violence, and nothing from it is retold.'],
    },
  }),

  // 2
  mk({
    key: 'opanin-mensahs-canoe',
    title: 'Opanin Mensah’s Canoe',
    summary:
      'Opanin Mensah, a respected fisherman, refuses to change his old ways even after a near accident. His grandson Kojo helps him learn that pride and rigid habits can be dangerous, and that traditions can grow without being lost.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'pride', 'change', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Steady, with a sea rhythm',
    palette: ['#0369a1', '#a16207'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Opanin Mensah: a respected fisherman of sixty-five years.',
      'Kojo: his grandson, a JHS 2 boy.',
      'Mr Appiah: a fisheries officer who visits the beach.',
      'Nana Aba: the chief fisherman’s wife, who keeps the village records.',
    ],
    music: 'Slow drum with sounds of waves (placeholder)',
    pages: [
      pg(
        '⛵',
        'Opanin Mensah had fished off the coast for fifty years. He knew the tides, the stars, and the moods of the sea. People came to him for advice. He carved his own canoe and painted it red and white, as his father had done. “The old ways are the best,” he liked to say. “They have kept us alive for generations.” His grandson Kojo, in JHS 2, listened proudly. He loved sitting in the canoe at dawn, learning his grandfather’s skills.',
        'An old fisherman beside a painted canoe at dawn while a boy listens.'
      ),
      pg(
        '📣',
        'One morning, Mr Appiah, a fisheries officer, came to the beach. He asked all the fishermen to wear life jackets and to check the weather forecast on a small radio before going to sea. “The weather can change faster than it did in the old days,” he said. “And life jackets save lives.” Most fishermen nodded and thanked him. But Opanin Mensah snorted. “I have never needed a life jacket. I know the sea better than any radio.”',
        'A fisheries officer speaking to fishermen on a beach with life jackets.'
      ),
      pg(
        '😤',
        'Kojo felt torn. He loved his grandfather and trusted his skill. But he had also read that many fishermen on the coast had lost their lives. He tried to speak. “Grandfather, maybe we could try the life jackets…” Opanin Mensah frowned. “Are you saying that I am a fool?” The old man’s pride was wounded. He turned away and began repairing a net. Kojo said nothing more, but he put a life jacket quietly in the bottom of the canoe, just in case.',
        'A boy and his grandfather by a canoe, the old man turning away.'
      ),
      pg(
        '🌩️',
        'A few weeks later, the sky was clear at dawn, and Opanin Mensah and Kojo paddled out. By midday, dark clouds rolled in quickly. The wind rose, and the waves grew tall. A big wave hit the canoe, and it tipped sharply. Opanin Mensah shouted, but a second wave threw him into the water. Kojo, shaking, grabbed the life jacket from the bottom of the canoe and threw it to him. The old man gripped it with both hands.',
        'A small canoe in rough waves with an old man holding a life jacket in the water.'
      ),
      pg(
        '🚤',
        'Other fishermen, who had been warned by their radios, were already heading back. They saw the canoe and helped. Two men pulled Opanin Mensah and Kojo into their boat and towed the canoe to shore. Everyone was safe. On the beach, Opanin Mensah sat on the sand, wet and silent. His hands shook. For the first time in his life, he felt very small before the sea. “I could have died,” he said quietly, “and taken my grandson with me.”',
        'Fishermen pulling an old man and a boy from the water into a boat.'
      ),
      pg(
        '🤔',
        'That night, Opanin Mensah did not sleep. He thought about his pride. He had loved the old ways so much that he had refused to look at anything new. Was that wisdom, or was it fear of being wrong? He realised that his father had not used a life jacket, because there were none. His father had used the best knowledge of his time. “Perhaps,” the old man murmured, “the old ways were wise because they kept learning. I stopped learning.”',
        'An old man sitting alone at night thinking, with a lamp beside him.'
      ),
      pg(
        '🗣️',
        'In the morning, Opanin Mensah spoke in front of everyone on the beach. “I was wrong,” he said plainly. “I was proud, and my pride nearly cost the life of my grandson. Mr Appiah, please teach us all about the radio and the life jackets.” The fishermen were quiet. It is hard for an elder to say such words, and everyone knew it. Nana Aba spoke up. “It takes a strong person to say that. We honour you more today, not less.”',
        'An old man speaking to the fishermen while a woman nods in respect.'
      ),
      pg(
        '🎨',
        'After that, Opanin Mensah checked the weather each morning and wore a life jacket. He did not drop any old customs. Every fisherman still poured a little water for the ancestors at the start of the season, and he still painted his canoe in red and white. But he also taught the young men to read the sky, the stars, and the radio. “The old ways and the new can walk together,” he said, “as long as we keep learning and keep each other safe.”',
        'An old man teaching young fishermen beside a painted canoe and a radio.'
      ),
      pg(
        '📝',
        'Kojo wrote in his notebook. “One: Pride can stop us from learning. Two: Traditions are strong when they can grow and keep what is good. Three: It takes courage to say, ‘I was wrong.’ Four: If something puts people in danger, change it, and keep the customs that matter.” Try it! Is there something you do only because ‘we have always done it this way’? Is it still safe and helpful? What would you keep, and what would you change? Ask an elder what they think.',
        'A boy writing four lines in a notebook beside the painted canoe.'
      ),
    ],
    activities: [
      {
        id: 'yl-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why did Kojo put a life jacket in the canoe?',
        options: [
          'Just in case, because he worried about safety',
          'He wanted to sell it',
          'He forgot it was there',
        ],
        correctIndex: 0,
      },
      {
        id: 'yl-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What happened to the canoe?',
        options: [
          'A storm tipped it and the fishermen were rescued',
          'It sank and nobody was saved',
          'It was stolen',
        ],
        correctIndex: 0,
      },
      {
        id: 'yl-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What did Opanin Mensah say to the fishermen?',
        options: [
          'That he was wrong and asked to learn about life jackets and the radio',
          'That they should stop fishing',
          'That Kojo was wrong',
        ],
        correctIndex: 0,
      },
      {
        id: 'yl-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: A custom in your family is no longer safe. Using the story, what is wise?',
        options: [
          'Keep it exactly',
          'Keep the good parts, change what is unsafe, and talk with elders',
          'Throw all customs away',
        ],
        correctIndex: 1,
      },
      {
        id: 'yl-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'The fisheries officer asks fishermen to use life jackets and radios',
          'Opanin Mensah refuses out of pride',
          'A storm tips the canoe',
          'He admits he was wrong in front of everyone',
          'He keeps customs but learns new safety methods',
        ],
      },
      {
        id: 'yl-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'pride',
        definition: 'A feeling that you are better than others, or a refusal to admit a mistake.',
        distractors: [
          'A kind of fish',
          'A type of net',
        ],
      },
    ],
    glossary: [
      {
        word: 'tides',
        definition: 'The regular rises and falls of the sea.',
        pages: [1],
      },
      {
        word: 'forecast',
        definition: 'A statement of what the weather will probably be.',
        pages: [2],
      },
      {
        word: 'pride',
        definition: 'A feeling of being too sure of oneself.',
        pages: [3, 6],
      },
      {
        word: 'towed',
        definition: 'Pulled along behind a boat.',
        pages: [5],
      },
      {
        word: 'customs',
        definition: 'Traditional ways of doing things.',
        pages: [8],
      },
      {
        word: 'ancestors',
        definition: 'Family members who lived long ago.',
        pages: [8],
      },
    ],
    culturalNotes: [
      'Big idea: Pride and rigid habits can lead to harm; we are strong when we are accountable, willing to change, and still respect what is good in our traditions. The idea is explored further in “Things Fall Apart” by Chinua Achebe (1958). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story is invented, with a fishing village and made-up characters. It does not use the novel’s plot, characters, or setting, and it does not retell its events.',
    ],
    reviewQuestions: [
      'Check with a fisheries officer that the safety advice (life jackets, weather forecast) is correct for your coast.',
      'Check that the story respects elders and customs.',
      'Check the sums: 65 - 50 = 15 and 8 + 6 = 14.',
    ],
    guide: {
      overview:
        'A story about an elder who learns that pride and rigid habits are dangerous, while keeping the best of his traditions.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain why Opanin Mensah was wrong.',
        'Say how he kept tradition and also changed.',
        'Think of a custom that could safely grow.',
      ],
      subjects: [
        ['Our World Our People (NaCCA CCP: customs and change; codes to verify)', 'Tradition and change'],
        ['Social Studies (NaCCA CCP: safety and responsibility; codes to verify)', 'Taking responsibility'],
      ],
      before: ['Ask: what are some customs in your family that are very old?'],
      during: ['Stop after Page 3. Ask: why is Opanin Mensah refusing to change?'],
      after: ['Learners list one thing to keep and one thing that could safely change.'],
      discussion: ['Is it a weakness or a strength to say, “I was wrong”?'],
      reflection: ['When has pride stopped you from learning something?'],
      maths: [
        {
          task: 'Opanin Mensah has fished for 50 years and is 65 years old. How old was he when he began?',
          answer: '65 - 50 = 15 years old.',
        },
        {
          task: 'A boat takes 8 fishermen and a second takes 6. How many fishermen can the two boats carry together?',
          answer: '8 + 6 = 14.',
        },
      ],
      support: ['Provide a two-column chart: keep and change.'],
      stretch: ['Interview an elder about a time they changed a way of working.'],
      localise: ['How do fishermen or farmers near you balance tradition and new safety methods?'],
      factCheck: ['The story is fiction. The safety advice should be confirmed by a fisheries officer. The book’s title, author, and year are given from general knowledge, and nothing from the novel is retold.'],
    },
  }),

  // 3
  mk({
    key: 'the-right-amount',
    title: 'The Right Amount',
    summary:
      'Kwaku gives away everything he has, while his cousin Fosua keeps everything for herself. Their teacher helps them see that goodness is often a matter of finding the right amount, and that it grows by practice. A story about balance and habit.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'virtue', 'balance', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Light, then thoughtful',
    palette: ['#15803d', '#a21caf'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Kwaku: a JHS 1 boy who gives away all he has.',
      'Fosua: his cousin, who never shares.',
      'Madam Asare: the teacher who explains virtue.',
      'Mama Yaa: their grandmother.',
    ],
    music: 'Soft highlife with a balanced two-note rhythm (placeholder)',
    pages: [
      pg(
        '🎁',
        'Kwaku was the most generous boy in school. If someone asked for a pencil, he gave it. If someone asked for his lunch, he gave it. If someone had no money for a bus, he handed over his own. “It feels so good to give,” he said. His friends loved him. But by Thursday each week, Kwaku had no pencil, no lunch, and no bus fare. He walked home hungry, and he could not do his homework. “Maybe I did not give enough,” he thought.',
        'A boy handing his lunch to a friend while his own bag is empty.'
      ),
      pg(
        '🔒',
        'His cousin Fosua was the opposite. She guarded everything she owned. She kept her sweets in a locked box and never lent her ruler. “If I give things away, I will have nothing,” she said. At home, she ate alone in her room. Her classmates did not invite her to play. Fosua was never hungry and never short of a pencil, but she often felt lonely. “Maybe I just need to guard my things more carefully,” she thought.',
        'A girl keeping a locked box of sweets while others play outside.'
      ),
      pg(
        '👩🏫',
        'One afternoon, Madam Asare noticed both children. She drew a line on the board. At one end she wrote: Gives nothing. At the other end she wrote: Gives everything. “Many good qualities are like this,” she said. “At one end, there is too little. At the other, there is too much. The best place is usually somewhere in the middle, and it depends on the situation.” She asked the class, “Where on this line is the best giving?” Kwaku and Fosua looked at the board and then at each other.',
        'A teacher drawing a line with two extremes on the board.'
      ),
      pg(
        '⚖️',
        '“Take generosity,” said Madam Asare. “Giving all you have leaves you with nothing, and then you cannot help anyone, not even yourself. Giving nothing leaves you alone. The wise person gives the right amount, to the right person, at the right time, for the right reason.” Kwaku bit his lip. He saw that his giving was kind but careless. Fosua looked at her hands. She saw that her keeping was safe but lonely. “Good giving is a matter of balance. How do we find the right amount?” asked Kwaku.',
        'A class listening while a teacher points to the middle of a line.'
      ),
      pg(
        '🏋️',
        '“By practice,” said Madam Asare. “We become good by doing good things again and again, in small ways, until they become habits. It is like learning to play the drum. You do not begin as a master. You practise a little each day.” She gave them a task. “Kwaku, each day, give one thing, but keep what you need for yourself. Fosua, each day, share one small thing with someone. Write down what happens.” Both children agreed, though it felt strange.',
        'A teacher giving two pupils notebooks and a small task.'
      ),
      pg(
        '🌱',
        'The first days were awkward. Kwaku kept his lunch and shared only a piece of his bread. His friend frowned, but then understood. Fosua shared one sweet with a girl called Ama, who thanked her warmly. Both found their tasks hard, and both made mistakes. On Wednesday, Kwaku gave away his bus fare again, out of habit. “Never mind,” said Madam Asare. “Notice it, and try again tomorrow.” By the second week, the right amount was beginning to feel natural.',
        'A boy sharing a piece of bread while a girl hands a sweet to a friend.'
      ),
      pg(
        '🍲',
        'Mama Yaa watched at home. Kwaku now ate his lunch and gave a few biscuits to a hungry classmate. Fosua opened her locked box and shared one sweet at lunch. “You are both finding the middle path,” Mama Yaa said. “My own mother used to say that a good life is like a good soup. Too much salt spoils it, and too little salt makes it tasteless. The right amount takes care and practice.” The children laughed, because they could taste the soup she was cooking.',
        'A grandmother stirring a pot while two children laugh.'
      ),
      pg(
        '🌈',
        'After a month, things had changed. Kwaku had a pencil every day, and he had enough lunch and enough bus fare, and he still helped friends. Fosua had been invited to play by Ama, and she was learning to laugh with others. She still kept her special things, but she no longer locked everything away. “I thought generosity meant losing,” said Fosua. “And I thought keeping meant safety,” said Kwaku. “We were both a little right and a little wrong,” Kwaku added. “Now we are finding some balance.”',
        'Two cousins smiling together beside friends in a schoolyard.'
      ),
      pg(
        '📝',
        'Madam Asare asked them to write what they had learned. Kwaku wrote: “One: Good things have too little and too much, and the best is in the middle. Two: The right amount depends on the person and the time. Three: I become good by practising small good acts every day. Four: Notice mistakes without shame, and try again.” Try it! Think of one good quality you want, such as courage, kindness, or honesty. What would too little look like? What would too much look like? What small thing could you practise this week?',
        'A boy writing four lines in a notebook while his cousin reads over his shoulder.'
      ),
    ],
    activities: [
      {
        id: 'ym-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Madam Asare draw on the board?',
        options: [
          'A line with too little at one end and too much at the other',
          'A map',
          'A picture of a drum',
        ],
        correctIndex: 0,
      },
      {
        id: 'ym-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'How does Madam Asare say we become good?',
        options: [
          'By practising good things in small ways until they become habits',
          'By reading about them',
          'By being born good',
        ],
        correctIndex: 0,
      },
      {
        id: 'ym-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What did Mama Yaa compare a good life to?',
        options: [
          'A good soup with the right amount of salt',
          'A long road',
          'A strong tree',
        ],
        correctIndex: 0,
      },
      {
        id: 'ym-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: You are too shy to speak in class. Using the story, what could you do?',
        options: [
          'Never speak',
          'Practise one small act, such as asking one question each day',
          'Shout at everyone',
        ],
        correctIndex: 1,
      },
      {
        id: 'ym-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Kwaku gives everything away and Fosua gives nothing',
          'Madam Asare draws the line with two extremes',
          'She asks them to practise small acts each day',
          'Both make mistakes and try again',
          'Both find a better balance',
        ],
      },
      {
        id: 'ym-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'balance',
        definition: 'A state in which things are in the right amounts.',
        distractors: [
          'A kind of scales',
          'A school rule',
        ],
      },
    ],
    glossary: [
      {
        word: 'generous',
        definition: 'Willing to give and share.',
        pages: [1],
      },
      {
        word: 'guarded',
        definition: 'Kept safe and did not share.',
        pages: [2],
      },
      {
        word: 'careless',
        definition: 'Not careful enough.',
        pages: [4],
      },
      {
        word: 'habit',
        definition: 'Something you do so often that it becomes natural.',
        pages: [6],
      },
      {
        word: 'balance',
        definition: 'A state in which things are in the right amounts.',
        pages: [4, 8],
      },
      {
        word: 'practise',
        definition: 'To do something again and again to get better.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Big idea: Good qualities are often found between two extremes, and we become good by practising small good actions until they become habits. The idea is explored further in “The Nicomachean Ethics” by Aristotle (written in the 4th century BCE). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story is invented. It uses the idea of a middle path between extremes, which many cultures also teach. It does not quote the book.',
    ],
    reviewQuestions: [
      'Check that the story does not suggest that learners should not help others in need.',
      'Check the sums: 3/12 = 1/4 and 1 × 20 = 20.',
    ],
    guide: {
      overview:
        'A story about finding the right balance in giving and building good habits by practice.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain “too little” and “too much” for generosity.',
        'Say how habits build good qualities.',
        'Choose a small good habit to practise.',
      ],
      subjects: [
        ['Our World Our People (NaCCA CCP: values and character; codes to verify)', 'Generosity and balance'],
        ['Mathematics (NaCCA CCP: fractions; codes to verify)', 'Sharing'],
      ],
      before: ['Ask: when is it good to share, and when might it be too much?'],
      during: ['Stop after Page 4. Ask: where is the right place on the line?'],
      after: ['Learners draw a line for one quality, such as courage or honesty, and mark too little, too much, and the middle.'],
      discussion: ['Why does the right amount depend on the person and time?'],
      reflection: ['Which good quality would you like to practise?'],
      maths: [
        {
          task: 'Kwaku has 12 biscuits and shares 3. What fraction did he share, in simplest form?',
          answer: '3/12 = 1/4.',
        },
        {
          task: 'Fosua shared 1 sweet a day for 20 school days. How many sweets did she share?',
          answer: '1 × 20 = 20 sweets.',
        },
      ],
      support: ['Provide a line template to fill in.'],
      stretch: ['Write a proverb about balance from your community.'],
      localise: ['What sayings does your community have about sharing and keeping?'],
      factCheck: ['The story is fiction. The book’s title, author, and approximate date are given from general knowledge, and nothing from it is quoted.'],
    },
  }),

  // 4
  mk({
    key: 'madam-doras-final-lesson',
    title: 'Madam Dora’s Final Lesson',
    summary:
      'Madam Dora is retiring after thirty years of teaching, and she gives her class one last lesson. It is about obstacles, helping others reach their dreams, and being grateful. A story about passing on what we have been given.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'dreams', 'gratitude', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Warm and reflective',
    palette: ['#b45309', '#1d4ed8'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Madam Dora: a JHS teacher retiring after thirty years.',
      'Kofi: a pupil who dreams of becoming an engineer.',
      'Adwoa: a pupil who wants to be a nurse.',
      'Mr Quaye: the headteacher.',
    ],
    music: 'Gentle strings with a soft chime (placeholder)',
    pages: [
      pg(
        '🏫',
        'After thirty years of teaching, Madam Dora was retiring at the end of the term. On her last Friday, the class expected a party. Instead, she said, “Today I will give you one last lesson. I will not give you a test on it. But I hope you will remember it when you are my age.” Kofi, who loved science, sat up. Adwoa, who wanted to be a nurse, put down her pencil. The room grew quiet. Even the fan seemed to hum more softly.',
        'A teacher standing before a quiet class on her last day.'
      ),
      pg(
        '🚪',
        '“When I was your age,” said Madam Dora, “I wanted to be a teacher, but my family could not pay my school fees. I was told, ‘It is impossible.’ I felt that the door was locked.” She smiled. “But a door that is locked is not always a wall. Sometimes it is a test of how much we want something. I found a way. I worked on a farm to earn money, and I studied at night by a small lamp. It was slow. But the door opened in the end.”',
        'A teacher telling a story with a faded photo of a girl on a farm.'
      ),
      pg(
        '🎯',
        '“Here is my first lesson,” said Madam Dora. “Obstacles are not always signs to stop. Sometimes they show how badly we want something. When something is difficult, ask, ‘How much do I want it? And who could help me find a way?’” Kofi raised his hand. “Madam, my father says engineering is not for people from our village. We have no equipment.” Madam Dora nodded. “That is a real obstacle. Let us not pretend it is small. Let us see what can be done.”',
        'A boy raising his hand in class while the teacher listens.'
      ),
      pg(
        '🤝',
        '“My second lesson,” said Madam Dora, “is about helping others reach their dreams. When I became a teacher, I found that my greatest joy was not in my own success. It was in watching a child suddenly understand something, or achieve something she thought impossible. If you want a happy life, find ways to help other people’s dreams come true.” She turned to Kofi. “I have a friend who is an engineer in Kumasi. I will write to her. She may be able to help you.”',
        'A teacher handing a boy a folded letter.'
      ),
      pg(
        '✍️',
        'She turned to Adwoa next. “You want to be a nurse. Do you know what you must study?” Adwoa shook her head. “Then we shall find out,” said Madam Dora. “Mr Quaye, may I ask the class to bring one question each about their dreams? I will ask my friends and former pupils to answer them.” Mr Quaye, standing at the door, smiled. “It would be an honour,” he said. The class cheered, and a dozen hands went up with questions.',
        'A headteacher standing at the door while pupils raise their hands.'
      ),
      pg(
        '🙏',
        '“My third lesson,” said Madam Dora, “is about thanks. I could not have become a teacher without the people who helped me: the farm owner who paid my wages on time, the headmaster who lent me books, and my mother who walked six miles to bring me food. Nobody succeeds alone. Be grateful, and show it, before it is too late.” She took a small notebook from her bag. “This is a list of the people who helped me. I thank them in my heart each morning.”',
        'A teacher holding a small notebook full of names.'
      ),
      pg(
        '🌟',
        'Adwoa put her hand up. “Madam, who will thank you?” Madam Dora laughed. “Perhaps you, one day, when you help someone else.” She continued, “I do not ask you to repay me. I ask you to pass it on. Every person who helps you has given you something. The best way to thank them is to give the same thing to someone else.” Several pupils wiped their eyes. Kofi wrote in his notebook: ‘Pass it on.’ He underlined it twice.',
        'Pupils listening and a boy writing in a notebook.'
      ),
      pg(
        '📬',
        'A month later, a reply came from Madam Dora’s friend, the engineer. She invited Kofi to spend a day at her workshop during the holidays and sent him a book on bridges. Adwoa received a letter from a retired nurse who explained what subjects she would need. The class had all sent questions, and many got answers. Madam Dora, who was now retired, smiled when she heard. “That,” she said, “is the best retirement present I could have asked for.”',
        'A boy opening a letter and a book on bridges.'
      ),
      pg(
        '📝',
        'On the last day of term, Kofi wrote in his notebook. “One: A difficulty is not always a wall. Ask how much I want it and who can help. Two: Help other people’s dreams come true, as well as my own. Three: Be grateful to the people who helped me, and thank them. Four: Pass it on.” Try it! What dream do you have? Who could help you with it? Whose dream could you help this year? Whom do you want to thank, and how will you do it?',
        'A boy writing four lines in a notebook with a book on bridges beside him.'
      ),
    ],
    activities: [
      {
        id: 'yn-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Madam Dora say about obstacles?',
        options: [
          'They can show how badly we want something and are not always signs to stop',
          'They always mean stop',
          'They are not real',
        ],
        correctIndex: 0,
      },
      {
        id: 'yn-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did Madam Dora offer to do for the class?',
        options: [
          'Ask her friends to answer their questions about dreams',
          'Give them homework',
          'Take them on a trip',
        ],
        correctIndex: 0,
      },
      {
        id: 'yn-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What did Madam Dora ask her pupils to do instead of repaying her?',
        options: [
          'Pass on the help to someone else',
          'Give her money',
          'Forget her',
        ],
        correctIndex: 0,
      },
      {
        id: 'yn-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: You received help from a teacher. Using the story, what is a good way to thank them?',
        options: [
          'Say nothing',
          'Thank them and help someone else in the same way',
          'Ask for more',
        ],
        correctIndex: 1,
      },
      {
        id: 'yn-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Madam Dora announces her last lesson',
          'She tells how she overcame an obstacle',
          'She offers to help Kofi and Adwoa with their dreams',
          'She teaches the class to say thanks and pass it on',
          'Letters arrive for the pupils',
        ],
      },
      {
        id: 'yn-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'obstacle',
        definition: 'Something that blocks the way or makes progress difficult.',
        distractors: [
          'A kind of book',
          'A school desk',
        ],
      },
    ],
    glossary: [
      {
        word: 'retiring',
        definition: 'Stopping work because of age.',
        pages: [1],
      },
      {
        word: 'obstacle',
        definition: 'Something that blocks the way or makes progress difficult.',
        pages: [3],
      },
      {
        word: 'engineer',
        definition: 'A person who designs and builds things such as bridges and machines.',
        pages: [4, 8],
      },
      {
        word: 'grateful',
        definition: 'Feeling thankful.',
        pages: [6],
      },
      {
        word: 'equipment',
        definition: 'Tools and machines needed for a job.',
        pages: [3],
      },
      {
        word: 'wages',
        definition: 'Money paid for work.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Big idea: Obstacles can be met with effort and help; we find joy in helping others reach their dreams; and we should be grateful and pass on the help we receive. The idea is explored further in “The Last Lecture” by Randy Pausch and Jeffrey Zaslow (2008). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story is invented. The teacher is retiring and is not ill. It does not retell the book or its author’s illness and does not use its examples.',
    ],
    reviewQuestions: [
      'Check that the retirement setting is suitable.',
      'Check the sums: 25 + 30 = 55 and 12 × 2 = 24.',
    ],
    guide: {
      overview:
        'A story about a retiring teacher’s last lesson on obstacles, helping others’ dreams, and gratitude.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain how Madam Dora looked at obstacles.',
        'Say how she wanted her pupils to thank her.',
        'Plan to help someone’s dream.',
      ],
      subjects: [
        ['Our World Our People (NaCCA CCP: careers and aspirations; codes to verify)', 'Dreams and careers'],
        ['English Language (NaCCA CCP: letters; codes to verify)', 'Writing to ask for help'],
      ],
      before: ['Ask: who has helped you reach something you wanted?'],
      during: ['Stop after Page 3. Ask: what could Kofi do about his obstacle?'],
      after: ['Learners write a short thank-you note to someone who helped them.'],
      discussion: ['Why did Madam Dora say “pass it on”?'],
      reflection: ['Whom could you help this year?'],
      maths: [
        {
          task: 'Madam Dora taught for 30 years. If she began at age 25, how old is she now?',
          answer: '25 + 30 = 55 years old.',
        },
        {
          task: 'A dozen pupils asked questions. If 12 asked 2 questions each, how many questions were there?',
          answer: '12 × 2 = 24.',
        },
      ],
      support: ['Provide a thank-you note template.'],
      stretch: ['Write a letter asking a professional about their job.'],
      localise: ['Who in your community has helped young people reach their dreams?'],
      factCheck: ['The story is fiction. The book’s title, authors, and year are given from general knowledge, and the author’s illness and examples are not used.'],
    },
  }),

  // 5
  mk({
    key: 'the-pitch-between-two-classes',
    title: 'The Pitch Between Two Classes',
    summary:
      'JHS 2A and JHS 2B both want the only football pitch at break, and a fight is brewing. Nii does not shout or fight. He prepares, listens, and finds a way that avoids a fight. A story about preparation, understanding the other side, and avoiding unnecessary conflict.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'conflict', 'leadership', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Brisk, then calm',
    palette: ['#15803d', '#b91c1c'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Nii: a JHS 2A pupil and class prefect.',
      'Selorm: the prefect of JHS 2B.',
      'Mr Tetteh: the games teacher.',
      'Fiifi: a hot-headed classmate of Nii.',
    ],
    music: 'Marching drum that softens into a calm flute (placeholder)',
    pages: [
      pg(
        '⚽',
        'The school had only one football pitch, and both JHS 2A and JHS 2B wanted it at break. Every day there was shouting. “It is our turn!” “No, it is ours!” One Tuesday, a boy from 2B pushed Fiifi from 2A, and Fiifi pushed back. Teachers rushed over, but the fight grew. By evening, both classes were angry. “Tomorrow we will take the pitch by force,” Fiifi told Nii. “We are stronger, and there are more of us.”',
        'Two groups of boys glaring at each other across a football pitch.'
      ),
      pg(
        '🤔',
        'Nii was the class prefect, and he did not want a fight. He thought about it that night. If 2A and 2B fought, someone might be hurt, the teachers would punish everyone, and nobody would play football at all. Even if 2A won, they would still have to share the school with 2B for another year. “A fight might be won,” he thought. “But it would cost too much.” He decided to find a way to settle the conflict without fighting.',
        'A boy sitting at a desk at night thinking carefully.'
      ),
      pg(
        '📝',
        'Nii prepared. First, he found out the facts. Using a notebook, he asked teachers, pupils, and the prefects what the real problem was. He learned that the pitch could be used for only thirty minutes each break, that 2A had forty pupils and 2B thirty-eight, and that both classes had a sports day coming. He also learned something else. Many of the pupils in 2B did not even want to play football. They wanted a place to sit and chat.',
        'A boy interviewing pupils and writing in a notebook.'
      ),
      pg(
        '👂',
        'Next, he looked at himself and his own class. He asked, “What do we really want?” Most of 2A said they wanted to play football for at least twenty minutes a day, and to be ready for sports day. “So we do not need the whole pitch for the whole break,” Nii wrote. Then he visited Selorm, the prefect of 2B, on his own. He did not come to argue. He came to listen. “What does 2B want?” he asked. Selorm was surprised. “Nobody has asked us before,” he said.',
        'Two prefects sitting together and talking calmly.'
      ),
      pg(
        '💡',
        'Selorm told him that 2B wanted a part of the pitch for practising for the sports day relay, and a shady corner for those who did not play football. “We never wanted to take the whole pitch,” he said. “We got angry because we thought you wanted to push us out.” Nii nodded. “And we thought you wanted to push us out.” They both laughed in embarrassment. Nii said, “Then it seems that we are both afraid of the same thing, and we both want less than we are fighting over.”',
        'Two boys laughing together as they study a drawing of the pitch.'
      ),
      pg(
        '📋',
        'Together, they drew a plan. On Mondays, Wednesdays, and Fridays, 2A would play football on half of the pitch from the beginning of break. 2B would use the other half for relay practice. On Tuesdays and Thursdays, they would swap. A shady corner of the pitch would be kept for those who wanted to sit and talk. They wrote the plan on a sheet of paper and took it to Mr Tetteh, the games teacher, with the signatures of both prefects.',
        'Two boys presenting a hand-drawn plan to a teacher.'
      ),
      pg(
        '🧑🏫',
        'Mr Tetteh read the plan twice and smiled. “Who thought of this?” he asked. “Both of us, sir,” said Nii. “We just asked each other what we wanted.” Mr Tetteh nodded. “I have seen many fights between classes,” he said, “and most of them were avoidable. The best way to win a conflict is often to prevent it. You have both shown real leadership.” He pinned the plan on the notice board, and he asked both classes to follow it for a month.',
        'A teacher pinning a plan on a notice board while two boys watch.'
      ),
      pg(
        '🤝',
        'On Wednesday, Fiifi grumbled. “We should have taken the whole pitch,” he said. But when break began, 2A played football on their half, and the game was good. On the other half, 2B’s relay runners practised. In the shade, some pupils chatted happily. Nobody pushed anybody. By the end of the month, 2A and 2B were joined in a mixed match on sports day, and the whole school cheered. Fiifi, to his own surprise, was grinning among his old rivals.',
        'Two classes playing and practising side by side on a school pitch.'
      ),
      pg(
        '📝',
        'Nii wrote in his notebook. “One: Prepare before any big decision. Find out the facts. Two: Understand what I really want and what the other side wants. Three: Often both sides want less than they are fighting over. Four: The best victory is often the one where nobody gets hurt.” Try it! Is there a quarrel in your class or home? What facts do you need? What does each side really want? Is there a way to settle it that is fair to both, without a fight?',
        'A boy writing four lines in a notebook while both classes play behind him.'
      ),
    ],
    activities: [
      {
        id: 'yo-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What was the first thing Nii did to prepare?',
        options: [
          'He found out the facts by asking teachers and pupils',
          'He challenged 2B to a fight',
          'He ignored the problem',
        ],
        correctIndex: 0,
      },
      {
        id: 'yo-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did Selorm say that surprised Nii?',
        options: [
          '2B never wanted the whole pitch and had feared being pushed out too',
          'He wanted to fight',
          'He did not want to talk',
        ],
        correctIndex: 0,
      },
      {
        id: 'yo-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What did Mr Tetteh say about conflicts?',
        options: [
          'The best way to win a conflict is often to prevent it',
          'Fights are the best way',
          'Conflicts are never avoidable',
        ],
        correctIndex: 0,
      },
      {
        id: 'yo-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: Two groups in your class argue over a shared space. Using the story, what is a good first step?',
        options: [
          'Fight',
          'Find the facts and ask what each side really wants',
          'Ignore it',
        ],
        correctIndex: 1,
      },
      {
        id: 'yo-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Both classes argue over the pitch and a fight is near',
          'Nii finds the facts and thinks about what his class wants',
          'He listens to Selorm, who explains what 2B wants',
          'They draw a plan to share the pitch',
          'Both classes play together on sports day',
        ],
      },
      {
        id: 'yo-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'prefect',
        definition: 'A senior pupil who helps to keep order at school.',
        distractors: [
          'A kind of football',
          'A teacher',
        ],
      },
    ],
    glossary: [
      {
        word: 'prefect',
        definition: 'A senior pupil who helps to keep order at school.',
        pages: [2],
      },
      {
        word: 'conflict',
        definition: 'A serious disagreement or fight.',
        pages: [2, 7],
      },
      {
        word: 'prepared',
        definition: 'Got ready in advance.',
        pages: [3],
      },
      {
        word: 'relay',
        definition: 'A race in which a team passes a baton from one runner to the next.',
        pages: [5],
      },
      {
        word: 'signatures',
        definition: 'People’s names written by themselves.',
        pages: [6],
      },
      {
        word: 'avoidable',
        definition: 'Able to be prevented.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Big idea: Prepare well, understand what you and the other side really want, and often you can settle a quarrel without a fight. The idea is explored further in “The Art of War” by Sun Tzu (ancient China; exact date uncertain). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story is invented and peaceful. The book is a military text, and only the idea of preparation, understanding, and avoiding unnecessary conflict is used. It does not retell the book or use its examples.',
    ],
    reviewQuestions: [
      'Check that the story does not glorify fighting.',
      'Check the sums: 40 + 38 = 78 and 30 × 3 = 90.',
    ],
    guide: {
      overview:
        'A story about preparing, listening to the other side, and avoiding an unnecessary fight.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain how Nii prepared.',
        'Say why listening helped.',
        'Plan how to settle a quarrel fairly.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: conflict resolution; codes to verify)', 'Settling quarrels peacefully'],
        ['Physical Education (NaCCA CCP: sharing facilities; codes to verify)', 'Fair use of the pitch'],
      ],
      before: ['Ask: how do your classes share spaces at school?'],
      during: ['Stop after Page 4. Ask: what might each side really want?'],
      after: ['Learners role-play two sides finding a fair plan.'],
      discussion: ['Why did both sides want less than they were fighting over?'],
      reflection: ['Whom could you listen to in a quarrel today?'],
      maths: [
        {
          task: '2A has 40 pupils and 2B has 38. How many pupils are there in all?',
          answer: '40 + 38 = 78.',
        },
        {
          task: 'Break lasts 30 minutes and each class gets half the pitch for all of it. If football is played on half the pitch for 30 minutes, how many minutes of football does 2A play in a week of 3 days?',
          answer: '30 × 3 = 90 minutes.',
        },
      ],
      support: ['Provide a two-column chart: what I want and what they want.'],
      stretch: ['Write a timetable that shares a space fairly.'],
      localise: ['How do elders in your community settle a quarrel between two groups?'],
      factCheck: ['The story is fiction. The book’s title, author, and date are given from general knowledge, and nothing from the military text is retold.'],
    },
  }),
];

export const BATCH_61_LIFE_LESSONS = BATCH_61_STORIES;
