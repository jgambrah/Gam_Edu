import * as dns from 'dns';
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
process.env.GCLOUD_PROJECT = 'gamedu-69888475-f5783';
process.env.GOOGLE_CLOUD_PROJECT = 'gamedu-69888475-f5783';

import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function getDb() {
  const fbAdmin = (admin as any).default || admin;
  try {
    const { OAuth2Client } = req('google-auth-library');
    const { Firestore } = req('@google-cloud/firestore');
    const configPath = 'C:\\Users\\DELL\\.config\\configstore\\firebase-tools.json';
    if (fs.existsSync(configPath)) {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (cfg?.tokens?.access_token) {
        const oauthClient = new OAuth2Client();
        oauthClient.setCredentials({ access_token: cfg.tokens.access_token });
        return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });
      }
    }
  } catch (e) {
    console.log("Fallback from token config:", e);
  }

  if (!fbAdmin.apps?.length) {
    fbAdmin.initializeApp({ credential: fbAdmin.credential.applicationDefault() });
  }
  return fbAdmin.firestore();
}

interface QuestionItem {
  number: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2001
const rawQuestions = [
  // --- PART I: SECTION A - READING COMPREHENSION PASSAGES (1 - 11) ---
  {
    number: 1,
    prompt: "According to Passage I, why did the town elders regularly sit on the wooden benches beneath the ancient tree?",
    options: [
      "To wait for commercial buses heading outside town",
      "To engage in market buying and selling",
      "To deliberate upon serious community affairs and converse",
      "To consume freshly tapped palm wine together"
    ],
    correctAnswer: "To deliberate upon serious community affairs and converse",
    hint: "Check paragraph one: 'so that the elders of the town might sit in comfort and gossip or talk about serious affairs of the town.'",
    workedSolution: "The passage explicitly explains that benches were built around the tree trunk to allow elders to sit in comfort and discuss town affairs or engage in informal conversation.",
    points: 1
  },
  {
    number: 2,
    prompt: "From their vantage position under the tree in Passage I, which of the following landmarks could the old men NOT observe directly?",
    options: [
      "The market square",
      "The bus station and lorry park",
      "The busy main street",
      "The wooden benches situated on the opposite side of the trunk"
    ],
    correctAnswer: "The wooden benches situated on the opposite side of the trunk",
    hint: "Paragraph one notes they sat on the side overlooking the road, viewing the market, lorry park, and Main Street.",
    workedSolution: "The text states they could view the market, lorry park, and Main Street; they could not see the benches situated behind the giant tree trunk.",
    points: 1
  },
  {
    number: 3,
    prompt: "In Passage I, the word 'uproar' in 'In the general uproar which followed' means ............",
    options: [
      "a physical fist fight",
      "rapid physical movement",
      "commercial trading",
      "a noisy state of commotion and confusion"
    ],
    correctAnswer: "a noisy state of commotion and confusion",
    hint: "A chaotic, noisy condition created by shouting crowds and rushing passengers.",
    workedSolution: "'Uproar' refers to a state of noisy tumult, confusion, and clamor; 'a noisy state of commotion and confusion' is the exact equivalent.",
    points: 1
  },
  {
    number: 4,
    prompt: "Why did some passengers on the bus attempt to alight as soon as it parked in Passage I?",
    options: [
      "They had arrived at their destination and wanted to go home",
      "They wanted to purchase food from street hawkers",
      "They wished to converse with the village elders",
      "They desired to rest under the shaded tree"
    ],
    correctAnswer: "They had arrived at their destination and wanted to go home",
    hint: "Look at paragraph two: 'whilst those who had reached their destination tried to alight.'",
    workedSolution: "The narrative notes that passengers who had reached their destination were attempting to get down from the bus to head home.",
    points: 1
  },
  {
    number: 5,
    prompt: "According to Passage I, why did certain passengers obstruct the doorway of the bus?",
    options: [
      "They disliked the street food vendors",
      "They feared losing their occupied seats to incoming travelers",
      "They wanted to prevent new passengers from boarding",
      "They wanted to gaze at the resting elders"
    ],
    correctAnswer: "They feared losing their occupied seats to incoming travelers",
    hint: "Reread the final sentence: 'Others who were not willing to risk losing their seats stood blocking the doorway...'",
    workedSolution: "Continuing passengers stood in the doorway or leaned out of windows to bargain with vendors without forfeiting their seats to boarding passengers.",
    points: 1
  },
  {
    number: 6,
    prompt: "In Passage II, why did the writer feel completely secure while standing on a busy street in Accra?",
    options: [
      "He saw workers rushing home from their offices",
      "He had just arrived safely from his home village",
      "He believed fellow Ghanaians were naturally kind and hospitable to strangers",
      "He was surrounded by uniformed police officers"
    ],
    correctAnswer: "He believed fellow Ghanaians were naturally kind and hospitable to strangers",
    hint: "Reread paragraph one: 'My sense of security came from the fact that Ghanaians are generally kind and hospitable people...'",
    workedSolution: "The narrator felt safe because of his belief in the legendary warmth and hospitality of Ghanaians toward visitors and strangers.",
    points: 1
  },
  {
    number: 7,
    prompt: "In Passage II, the word 'spotted' as used in 'an old schoolmate must have spotted me' means ............",
    options: ["looked at casually", "identified and recognized", "marked with a pen", "pointed out to the crowd"],
    correctAnswer: "identified and recognized",
    hint: "To catch sight of and recognize someone in a crowd.",
    workedSolution: "'Spotted' in this context means caught sight of, recognized, or identified someone from afar.",
    points: 1
  },
  {
    number: 8,
    prompt: "Why did the writer turn toward his left when he felt a grip from behind in Passage II?",
    options: [
      "He wanted to look the person in the face and greet his presumed friend",
      "He wanted to hide his wristwatch safely",
      "He planned to strike the person",
      "He wanted to run to the lorry station"
    ],
    correctAnswer: "He wanted to look the person in the face and greet his presumed friend",
    hint: "Paragraph three begins: 'I turned to look at the fellow in the face...'",
    workedSolution: "Believing an old school friend was playing a prank, the writer turned around eagerly to identify and embrace him.",
    points: 1
  },
  {
    number: 9,
    prompt: "According to Passage II, what was the real objective of the stranger who gripped Cudjoe's arm?",
    options: [
      "He wanted to embrace an old classmate",
      "He recognized a former friend",
      "He wanted to steal Cudjoe's wristwatch",
      "He needed directions to the bus station"
    ],
    correctAnswer: "He wanted to steal Cudjoe's wristwatch",
    hint: "As Cudjoe turned, the stranger tightened his grip on the wristwatch and bolted.",
    workedSolution: "The stranger was an opportunistic pickpocket whose sole intention was to snatch Cudjoe's wristwatch in the crowded street.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the word 'rogue' as used in 'the rogue found it worth stealing' refers to ............",
    options: ["an office commuter", "an old schoolfellow", "the crafty street thief", "a resident of the village"],
    correctAnswer: "the crafty street thief",
    hint: "A dishonest, unprincipled person or thief.",
    workedSolution: "'Rogue' refers to a dishonest, unscrupulous person or thief; here it denotes the street pickpocket who stole the wristwatch.",
    points: 1
  },
  {
    number: 11,
    prompt: "Which of the following statements is NOT true according to Passage II?",
    options: [
      "Some city dwellers engage in deceptive criminal acts",
      "All people residing in Accra were former classmates of the writer",
      "Pickpockets and petty thieves operate in crowded capital streets",
      "Workers in Accra commute home in the late afternoon"
    ],
    correctAnswer: "All people residing in Accra were former classmates of the writer",
    hint: "The writer mistakenly assumed a stranger was a former classmate.",
    workedSolution: "The assertion that people in Accra were his classmates is completely false; it was merely a naive assumption that cost him his watch.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (12 - 16) ---
  {
    number: 12,
    prompt: "The bank manager was humiliated when the embezzlement scheme was uncovered.\nChoose the word nearest in meaning to the underlined word 'humiliated'.",
    options: ["angered", "cautioned", "discouraged", "disgraced"],
    correctAnswer: "disgraced",
    hint: "Made to feel extreme shame, loss of respect, or public dishonor.",
    workedSolution: "'Humiliated' means subjected to intense shame, embarrassment, or loss of dignity; 'disgraced' is its direct synonym.",
    points: 1
  },
  {
    number: 13,
    prompt: "Nortey was exceptionally industrious throughout his apprenticeship, so he was rewarded.\nChoose the word nearest in meaning to the underlined word 'industrious'.",
    options: ["intelligent", "hardworking", "careful", "courageous"],
    correctAnswer: "hardworking",
    hint: "Constantly, regularly, or habitually active and diligent in work.",
    workedSolution: "'Industrious' means diligent, hard-working, and devoted to labor; 'hardworking' is its exact equivalent.",
    points: 1
  },
  {
    number: 14,
    prompt: "Born and nurtured in an affluent household, he never experienced poverty.\nChoose the word nearest in meaning to the underlined word 'affluent'.",
    options: ["respectable", "religious", "happy", "rich"],
    correctAnswer: "rich",
    hint: "Having an abundance of wealth, property, or material riches.",
    workedSolution: "'Affluent' means wealthy, prosperous, or rich; 'rich' is its direct synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "Dazzled by the intense high-beam headlights of the approaching lorry, the driver swerved.\nChoose the word nearest in meaning to the underlined word 'dazzled'.",
    options: ["disturbed", "worried", "temporarily blinded", "discouraged"],
    correctAnswer: "temporarily blinded",
    hint: "Blinded momentarily by an overpowering brightness of light.",
    workedSolution: "'Dazzled' means blinded temporarily by looking at an extremely bright light; 'temporarily blinded' is the accurate definition.",
    points: 1
  },
  {
    number: 16,
    prompt: "The mathematics instructor gave a precise definition of the geometric theorem.\nChoose the word nearest in meaning to the underlined word 'precise'.",
    options: ["learned", "hasty", "accurate", "short"],
    correctAnswer: "accurate",
    hint: "Exact, strictly correct, and free from error.",
    workedSolution: "'Precise' means exact, strictly correct, and free from vagueness; 'accurate' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (17 - 21) ---
  {
    number: 17,
    prompt: "After serving his prison sentence, the disgraced official returned home under a cloud. This means he returned ............",
    options: ["in rainy, overcast weather", "in a state of public disgrace and suspicion", "very secretly at night", "in total depression"],
    correctAnswer: "in a state of public disgrace and suspicion",
    hint: "Under suspicion, disfavor, or the shadow of disgrace.",
    workedSolution: "The idiom 'under a cloud' means under suspicion, in disfavor, or carrying the shame and dishonor of past wrongdoing.",
    points: 1
  },
  {
    number: 18,
    prompt: "The headmaster's sudden transfer was a bolt from the blue to the staff. This means the news was ............",
    options: ["a disastrous calamity", "a complete surprise", "a mournful tragedy", "a blessing in disguise"],
    correctAnswer: "a complete surprise",
    hint: "Happening totally unexpectedly and causing great astonishment.",
    workedSolution: "'A bolt from the blue' is an idiom referring to an event that occurs completely unexpectedly and produces great surprise.",
    points: 1
  },
  {
    number: 19,
    prompt: "Kofi Mensah found it difficult to do away with his childhood habits. This means he could not ............ them.",
    options: ["continue", "conceal", "stop", "discuss"],
    correctAnswer: "stop",
    hint: "To discard, eliminate, or abolish an action or practice.",
    workedSolution: "The phrasal verb 'to do away with' means to abolish, discard, eliminate, or stop a habit.",
    points: 1
  },
  {
    number: 20,
    prompt: "Many people avoid Abugri because he is fond of blowing his own trumpet. This means that Abugri is ............",
    options: ["boastful", "greedy", "disrespectful", "shameful"],
    correctAnswer: "boastful",
    hint: "Bragging, singing one's own praises, and boasting about one's achievements.",
    workedSolution: "The idiom 'to blow one's own trumpet' means to boast excessively about one's own skills, successes, or virtues.",
    points: 1
  },
  {
    number: 21,
    prompt: "When caught in the act of pilfering, the girl shed crocodile tears. This means that she ............",
    options: ["displayed insincere, pretend grief", "became furious", "was deeply embarrassed", "wept genuine tears of sorrow"],
    correctAnswer: "displayed insincere, pretend grief",
    hint: "Feigning sorrow or crying insincerely to manipulate others.",
    workedSolution: "The idiom 'crocodile tears' refers to false, hypocritical, or insincere displays of sorrow or remorse.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (22 - 26) ---
  {
    number: 22,
    prompt: "The health inspector warned the community not to contaminate the drinking well, but to ...... it.",
    options: ["fetch", "store", "purify", "use"],
    correctAnswer: "purify",
    hint: "'Contaminate' means to make impure or pollute. Find the word that denotes making clean and pure.",
    workedSolution: "'Contaminate' means to pollute, taint, or make impure. Its direct antonym regarding water supply is 'purify' (to cleanse or make pure).",
    points: 1
  },
  {
    number: 23,
    prompt: "Theresa inquired about the scheduled arrival of the passenger train and its subsequent ...... .",
    options: ["scheme", "routine", "departure", "boarding"],
    correctAnswer: "departure",
    hint: "'Arrival' means reaching a destination. Find the word meaning leaving or going away.",
    workedSolution: "'Arrival' denotes the act of reaching a destination. Its direct logistical and linguistic antonym is 'departure' (leaving).",
    points: 1
  },
  {
    number: 24,
    prompt: "While the elder agreed to consent to the land pact, his younger brother chose to ...... .",
    options: ["ignore", "question", "disagree", "react"],
    correctAnswer: "disagree",
    hint: "'Consent' means to grant permission or agreement. Find the word meaning to express dissent.",
    workedSolution: "'Consent' means to agree, comply, or give assent. Its direct antonym is 'disagree' (or dissent/refuse).",
    points: 1
  },
  {
    number: 25,
    prompt: "Yesterday the defeated candidate looked depressed, but today he appears remarkably ...... .",
    options: ["contented", "active", "surprised", "happy"],
    correctAnswer: "happy",
    hint: "'Depressed' means sad and downcast. Find the word denoting cheerfulness and joy.",
    workedSolution: "'Depressed' means in a state of deep sadness and gloom. Its direct emotional antonym is 'happy' (cheerful and joyful).",
    points: 1
  },
  {
    number: 26,
    prompt: "During the drought, the river water subsided, but after the torrential rains, the level ...... rapidly.",
    options: ["outflowed", "ascended", "enlarged", "rose"],
    correctAnswer: "rose",
    hint: "'Subsided' means receded or went down. Find the word meaning increased in height or moved upward.",
    workedSolution: "'Subsided' in reference to floodwaters means receded, dropped, or decreased in volume. Its direct opposite is 'rose' (increased in level).",
    points: 1
  },

  // --- SECTION E: LEXIS AND STRUCTURE (27 - 40) ---
  {
    number: 27,
    prompt: "The music master suggested that the choir members ...... the traditional anthem instead.",
    options: ["are playing", "play", "praying", "will play"],
    correctAnswer: "play",
    hint: "Mandative subjunctive: Verbs of suggestion ('suggest that...') require the bare base form of the verb.",
    workedSolution: "In formal mandative subjunctive clauses following verbs like 'suggest that', English requires the base form of the verb ('play'), without modal auxiliaries or '-s'.",
    points: 1
  },
  {
    number: 28,
    prompt: "...... frankly, I completely dislike the proposed school timetable.",
    options: ["Speak", "Spoken", "To speak", "For speaking"],
    correctAnswer: "To speak",
    hint: "Use an infinitive phrase as an introductory adverbial discourse marker ('To speak frankly...').",
    workedSolution: "The standard introductory parenthetical infinitive phrase used to introduce an honest opinion is 'To speak frankly'.",
    points: 1
  },
  {
    number: 29,
    prompt: "The committee thinks we ...... Kwesi's generous sponsorship offer.",
    options: ["better taking", "had better taken", "had better take", "better to take"],
    correctAnswer: "had better take",
    hint: "The modal idiom 'had better' is always followed by a bare infinitive without 'to'.",
    workedSolution: "The expression 'had better' conveys strong recommendation and takes a bare infinitive ('had better take').",
    points: 1
  },
  {
    number: 30,
    prompt: "...... the fertile communal land was placed under commercial crop cultivation.",
    options: ["Most of", "Many of", "More of", "Much of"],
    correctAnswer: "Most of",
    hint: "'Land' functions as a collective singular non-count noun referring to the majority portion.",
    workedSolution: "'Most of' correctly quantifies the majority proportion of uncountable or collective singular nouns ('Most of the arable land'). 'Many of' applies strictly to plural countable nouns.",
    points: 1
  },
  {
    number: 31,
    prompt: "In attempting to enforce discipline in the dormitory, the housemaster gave ...... unnecessary anxiety.",
    options: ["themselves", "himself", "ourselves", "yourself"],
    correctAnswer: "himself",
    hint: "The singular masculine subject 'the housemaster' takes the third-person masculine reflexive pronoun.",
    workedSolution: "The singular masculine subject 'the housemaster' requires the matching singular reflexive pronoun 'himself'.",
    points: 1
  },
  {
    number: 32,
    prompt: "\"Do you believe in ancient superstition?\"\n\"............\"",
    options: ["Yes, I don't", "No, I won't", "Yes, I won't", "No, I don't"],
    correctAnswer: "No, I don't",
    hint: "A negative response to a present simple question with 'Do you...?' takes 'No, I don't'.",
    workedSolution: "Standard English polarity: A negative response to 'Do you believe...?' consistently pairs 'No' with the negative present auxiliary: 'No, I don't'.",
    points: 1
  },
  {
    number: 33,
    prompt: "Aba insisted that Adjoa ...... to the anniversary thanksgiving service.",
    options: ["to have come", "has come", "to come", "should come"],
    correctAnswer: "should come",
    hint: "In reported mandative structures, 'insisted that' takes a clause with 'should + base verb' or a bare subjunctive.",
    workedSolution: "Clauses following 'insisted that' express a directive and take 'should + base verb' ('should come') or the bare subjunctive ('come').",
    points: 1
  },
  {
    number: 34,
    prompt: "Esi: \"I felt rather exhausted after yesterday's athletic competition.\"\nEfua: \"Yes, ............, I had to sleep immediately.\"",
    options: ["I did too", "so I did", "so did I", "I didn't"],
    correctAnswer: "so did I",
    hint: "To express affirmative agreement with someone's past simple statement, use 'so did I'.",
    workedSolution: "The standard inverted formula expressing affirmative agreement with a preceding simple past statement is 'so + auxiliary + subject' ('so did I').",
    points: 1
  },
  {
    number: 35,
    prompt: "The boarding pupils complained that there was ...... sugar in their morning tea.",
    options: ["plenty", "few", "little", "small"],
    correctAnswer: "little",
    hint: "'Sugar' is an uncountable noun. To indicate an insufficient quantity with negative connotation, use this quantifier.",
    workedSolution: "'Sugar' is a non-count noun. 'Little' without an article conveys a negative meaning of insufficiency ('hardly any sugar'). 'Few' applies only to count nouns.",
    points: 1
  },
  {
    number: 36,
    prompt: "A principal statutory duty of the motor traffic police is to ...... vehicular movement.",
    options: ["lead", "regulate", "direct", "move"],
    correctAnswer: "regulate",
    hint: "To control, maintain order, and direct traffic systematically according to law.",
    workedSolution: "In formal public administration, law enforcement officers 'regulate' (or direct) vehicular traffic flow to ensure safety.",
    points: 1
  },
  {
    number: 37,
    prompt: "The candidate decided to ...... the competitive entrance examination next academic year.",
    options: ["have sat", "sit", "be sitting", "have been sitting"],
    correctAnswer: "sit",
    hint: "The catenative verb 'decided' takes a full to-infinitive with base verb: 'to sit'.",
    workedSolution: "The verb 'decide' is followed by a to-infinitive taking a simple base verb ('decided to sit').",
    points: 1
  },
  {
    number: 38,
    prompt: "Our school debating team won the regional championship trophy, ......?",
    options: ["hadn't we", "isn't it", "couldn't we", "didn't we"],
    correctAnswer: "didn't we",
    hint: "The main verb 'won' is in the simple past affirmative. Form a negative tag with 'did'.",
    workedSolution: "The main clause has an affirmative simple past verb ('won') with subject 'We'. The question tag must be negative and use 'did': 'didn't we?'.",
    points: 1
  },
  {
    number: 39,
    prompt: "The plumber turned the rusted iron valve so forcefully that it ......",
    options: ["will break", "breaks", "had broken", "broke"],
    correctAnswer: "broke",
    hint: "Sequence of past narrative tenses: The past action 'turned' results in a simple past consequence.",
    workedSolution: "The past narrative verb 'turned' requires the simple past tense 'broke' to complete the cause-and-effect clause in the past.",
    points: 1
  },
  {
    number: 40,
    prompt: "The newly hired accountant was formally introduced ...... the board of directors.",
    options: ["by", "to", "through", "from"],
    correctAnswer: "to",
    hint: "Identify the preposition that regularly collocates with the verb 'introduced' when presenting someone.",
    workedSolution: "In standard English usage, one is 'introduced to' an audience, board, or person.",
    points: 1
  }
];

// Seeded Deterministic Shuffle to Guarantee Exactly 10 A, 10 B, 10 C, 10 D
const targetKeys: number[] = [
  0, 1, 2, 3, 0, 1, 2, 3, 0, 1,
  2, 3, 0, 1, 2, 3, 0, 1, 2, 3,
  0, 1, 2, 3, 0, 1, 2, 3, 0, 1,
  2, 3, 0, 1, 2, 3, 0, 1, 2, 3
];

function seedShuffle<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  let m = arr.length, t, i;
  while (m) {
    seed = (seed * 9301 + 49297) % 233280;
    i = Math.floor((seed / 233280) * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

const assignedTargetIndices = seedShuffle(targetKeys, 200101);

const balancedPaper1 = rawQuestions.map((q, idx) => {
  const correctIdx = assignedTargetIndices[idx]; // 0=A, 1=B, 2=C, 3=D
  const options: string[] = [];
  const rawDistractors = q.options.filter(opt => opt !== q.correctAnswer);
  let dCount = 0;
  for (let pos = 0; pos < 4; pos++) {
    if (pos === correctIdx) {
      options.push(q.correctAnswer);
    } else {
      options.push(rawDistractors[dCount++]);
    }
  }
  return {
    number: q.number,
    prompt: q.prompt,
    options: options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: q.points
  };
});

// ==========================================
// PAPER 2: ESSAY WRITING (COMPOSITION)
// ==========================================
const paper2Calibrated = {
  sectionA_essay: {
    title: "Part A: Essay Writing",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Informal Letter",
        prompt: "Write a letter to your pen-pal who attends school in another country, giving at least three convincing reasons why you take immense pride in your school.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Bekwai, Ashanti Region
14th June, 2001

Dear Michael,

I hope this letter finds you in fine health and high spirits in Australia. In your last letter, you inquired about my school life and environment. I am thrilled to share three compelling reasons why I take immense pride in attending Methodist Junior High School.

First and foremost, our school maintains a legendary reputation for academic brilliance. Our dedicated teachers do not simply lecture; they guide us through practical problem-solving in Mathematics and Integrated Science. Because of our rigorous mock tests and disciplined study sessions, our school has consistently recorded a one hundred percent pass rate in the Basic Education Certificate Examination (BECE) for five consecutive years. Being part of an institution of high achievers inspires me to aim for academic distinction.

Secondly, our school is endowed with a vibrant co-curricular program that nurtures diverse talents. We have an outstanding brass band, an energetic cultural dance troupe, and a competitive football team that recently clinched the municipal championship trophy. Participating in the debating club has boosted my public speaking confidence and sharpened my critical thinking skills.

Finally, our school compound is exceptionally serene, green, and disciplined. Surrounded by majestic shade trees, neatly manicured flower lawns, and clean walkways, our school provides a tranquil atmosphere that makes learning enjoyable and stress-free.

I am proud to belong to this noble family of scholars. Tell me about your school when you reply.

Your pen-pal,
[Signature]
Kwabena Osei`
      },
      {
        questionNumber: "2",
        category: "Formal Letter",
        prompt: "Write a formal letter to the Headteacher of your school complaining about two unprofessional habits among some teachers that disrupt learning, and suggesting practical remedies.",
        modelAnswer: `Presbyterian Junior High School
P. O. Box 112
Begoro, Eastern Region
18th October, 2001

The Headteacher
Presbyterian Junior High School
Begoro

Dear Sir,

PETITION REGARDING UNPROFESSIONAL PRACTICES AFFECTING CLASSROOM INSTRUCTION

On behalf of the student representative council, I respectfully write to bring to your urgent attention two unprofessional habits among certain teachers that severely disrupt our academic progress, and to submit constructive remedies.

First, habitual lateness and absenteeism to scheduled instructional periods by some subject teachers have become deeply concerning. On several occasions, teachers arrive fifteen to twenty minutes late to forty-minute periods or fail to show up entirely without prior notice. Consequently, syllabus coverage is chronically delayed, leaving students poorly prepared for internal and external examinations. During these unsupervised periods, classes become rowdy, disrupting adjoining classrooms.

Secondly, the excessive use of mobile phones and social chats during lesson delivery undermines instructional quality. Certain teachers receive non-emergency phone calls or browse messages while students copy chalkboard notes, failing to explain difficult concepts or provide immediate feedback on exercises.

To resolve these lapses, I suggest that the school administration introduce a daily teacher period-attendance logbook in every classroom, signed by class prefects at the conclusion of every lesson. Furthermore, teachers should be mandated to switch off or deposit personal cellular phones in the staff common room during teaching contact hours.

We trust that your esteemed office will address these issues to safeguard our academic future.

Thank you.

Yours faithfully,
[Signature]
Emmanuel Addo
(School Prefect)`
      },
      {
        questionNumber: "3",
        category: "Debate Speech",
        prompt: "You are the principal speaker in an inter-schools debate on the motion: \"Boys should not help in the kitchen.\" Write your speech arguing either for or against the motion.",
        modelAnswer: `AGAINST THE MOTION: "BOYS SHOULD NOT HELP IN THE KITCHEN"

Mr. Chairman, Distinguished Panel of Judges, Impartial Timekeeper, Worthy Opponents, and Fellow Students:

I stand before you this morning to vehemently oppose the motion that: "Boys should not help in the kitchen." In a progressive, modern society, domestic culinary skills are essential life survival tools, not gender-restricted burdens.

First and foremost, hunger and nutrition know no gender. Cooking is a fundamental human survival skill that every independent individual must master. When male students transition to boarding schools, universities, or live independently as bachelors pursuing careers, those who were barred from the kitchen suffer severe nutritional neglect or waste excessive money on commercial food. A boy who can cook nutritious meals is self-reliant, financially disciplined, and prepared for independent adult life.

Secondly, relegating kitchen chores exclusively to female children perpetuates unfair domestic oppression and gender inequality. In many households, girls spend three exhausting hours fetching water, pounding fufu, and scrubbing pots while their male siblings play football or watch television. This domestic overburden leaves female students mentally drained, stealing their evening study hours and causing them to underperform academically. Sharing kitchen duties fosters domestic harmony, mutual respect, and marital cooperation in future homes.

Furthermore, the world's most renowned and wealthy executive chefs are men. Why then should we stigmatize boys who work in the kitchen?

In conclusion, the kitchen is a workshop for developing character, cleanliness, and self-reliance. I urge you all to reject the outdated motion resoundingly.

Thank you.`
      },
      {
        questionNumber: "4",
        category: "Narrative Essay",
        prompt: "You suddenly woke up in the dead of night when you heard someone shouting frantically: \"Help! Help! Fire!\" Describe vividly what you saw and experienced when you rushed out.",
        modelAnswer: `It was a chilly, moonless midnight in January, and our entire farming hamlet was blanketed in peaceful slumber. Suddenly, piercing screams of "Help! Help! Fire!" shattered the silence. Jolted from my sleep, my heart thudded against my ribs like a frightened bird. Banging doors and panicked footsteps echoed across our family compound. Slipping into my sandals, I rushed into the dark yard.

Outside, the darkness was violently pierced by towering, crackling sheets of orange flames leaping from the thatched roof of our neighbor, Papa Mensah's cocoa storehouse. A thick, suffocating cloud of black smoke billowed into the night sky, raining sparks upon neighboring wooden structures.

The sight was terrifying. Papa Mensah and his family were scrambling to drag heavy jute bags of dried cocoa beans and furniture into the open street, while women wept loudly and children ran about in sheer confusion. Seeing that the flames were rapidly advancing toward the adjoining residential bedroom where an elderly bedridden grandmother slept, panic threatened to paralyze the bystanders.

Fortunately, communal solidarity took over. The village youth mobilized with astonishing speed. Forming a human chain from the community borehole to the burning compound, we hurled buckets of water and shovels of loose earth onto the roaring flames. Two brave young men broke down the bedroom window and carried the coughing grandmother wrapped in wet blankets to safety.

After two grueling hours of fierce struggle, we finally extinguished the smoldering embers. We were exhausted, soaked, and covered in black soot, but filled with immense gratitude that not a single human life was lost.`
      }
    ]
  }
};

const flattenedPaper2Questions = [
  ...paper2Calibrated.sectionA_essay.questions.map((q) => ({
    id: `q${q.questionNumber}`,
    questionNumber: q.questionNumber,
    section: "A",
    category: q.category,
    partLabel: `Part A (Question ${q.questionNumber}) - ${q.category}`,
    prompt: q.prompt,
    modelAnswer: q.modelAnswer,
    marks: 30
  }))
];

async function seedBeceEnglish2001Calibrated() {
  console.log("Seeding Calibrated & Balanced BECE English 2001 into Firestore...");

  // Key Balance Audit
  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  balancedPaper1.forEach((q) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log("Verified Key Balance (Exactly 10 of each):", keyDist);

  const db = await getDb();
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2001");
  await docRef.set({
    year: 2001,
    title: "BECE English Language 2001 (Calibrated National Benchmark)",
    subjectId: "english",
    metadata: {
      isPastQuestion: true,
      standard: "NaCCA / WAEC BECE Standard",
      totalMarks: 100,
      totalDurationMinutes: 120,
      paper1Count: balancedPaper1.length,
      optionsBalanced: true,
      unplagiarizedPedagogicalAdaptation: true,
      updatedAt: new Date()
    },
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      questions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Essay Writing (Composition)",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Calibrated BECE English 2001 successfully seeded into Firestore!");
}

seedBeceEnglish2001Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2001:", err);
    process.exit(1);
  });
