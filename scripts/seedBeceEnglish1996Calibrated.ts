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
        return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient, ignoreUndefinedProperties: true });
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

// ==========================================
// PASSAGE I: MR. MENSAH'S CLASSROOM DETECTION
// ==========================================
const passage1Text = `The class was very quiet when suddenly Mr. Mensah heard a giggle from the back of the classroom. Of late he had observed that giggling and murmuring had reared their ugly heads in the class. This time he was determined to find the cause of this naughty behaviour and discipline the culprits.

Pretending not to have heard the noise, he moved to the blackboard as if to write something on it but in reality to set a trap. Immediately the giggling and murmuring resumed, he turned and spotted three big boys at the back of the class chattering. His turning was so quick that he caught them right in the act. He also saw one of the boys passing on a magazine to the boy next to him.

With the speed of lightning, Mr. Mensah got there, asked the three boys to stand up and then searched them in order to seize the magazine. Smart though he was, the boys were even smarter, for the boy sitting next to the window had thrown the magazine onto the veranda. After a thorough search Mr. Mensah nearly gave up.

It was, perhaps, an exercise book he had seen and not a magazine. However, his long years of teaching experience suggested to him that the boys could have thrown the magazine outside. When he looked through the window, lo and behold, there lay the magazine! He retrieved it, flipped through it and saw that it was full of obscenities. Mr. Mensah fumed.`;

const passage1QuestionsRaw = [
  {
    number: 1,
    prompt: "According to Passage I, what was Mr. Mensah's primary objective when he heard the classroom noise?",
    options: [
      "To unmask the troublemakers and administer discipline",
      "To write complex notes on the blackboard",
      "To insult the entire class for indiscipline",
      "To converse privately with the three big boys"
    ],
    correctAnswer: "To unmask the troublemakers and administer discipline",
    hint: "Reread paragraph one: 'determined to find the cause of this naughty behaviour and discipline the culprits.'",
    workedSolution: "The author notes that the teacher was determined to uncover the perpetrators of the recurrent giggling and chatter and punish them.",
    points: 1
  },
  {
    number: 2,
    prompt: "In Passage I, what was the underlying cause of the students' giggling and whispers?",
    options: [
      "Mr. Mensah turned to write on the blackboard",
      "Mr. Mensah exhibited comical mannerisms",
      "The inappropriate and obscene contents in the contraband magazine",
      "The boy seated near the window hurled the book outside"
    ],
    correctAnswer: "The inappropriate and obscene contents in the contraband magazine",
    hint: "Paragraph two and four reveal they were reading and passing around an obscene magazine.",
    workedSolution: "The students were giggling because they were covertly circulating and viewing an unauthorized, obscene magazine during class hours.",
    points: 1
  },
  {
    number: 3,
    prompt: "Why did the boy seated beside the window hurriedly discard the magazine onto the veranda?",
    options: [
      "They had grown tired of reading it",
      "The window had accidentally swung open",
      "Mr. Mensah walked away from them",
      "To conceal the incriminating evidence from the approaching teacher"
    ],
    correctAnswer: "To conceal the incriminating evidence from the approaching teacher",
    hint: "Check paragraph three: discarding the magazine was a desperate attempt to avoid detection during the physical search.",
    workedSolution: "The boy threw the magazine out the window so that when Mr. Mensah searched them, the contraband would not be found on their bodies.",
    points: 1
  },
  {
    number: 4,
    prompt: "What enabled Mr. Mensah to successfully recover the contraband material after his initial physical search failed?",
    options: [
      "The wind blew the pages onto the teacher's desk",
      "His extensive years of classroom teaching experience",
      "His swift sprint to the rear of the classroom",
      "One of the frightened culprits surrendered the item"
    ],
    correctAnswer: "His extensive years of classroom teaching experience",
    hint: "Look at paragraph four: 'his long years of teaching experience suggested to him that the boys could have thrown the magazine outside.'",
    workedSolution: "The passage explicitly credits his long professional teaching experience with providing the insight to check outside the window.",
    points: 1
  },
  {
    number: 5,
    prompt: "In Passage I, the expression 'have reared their ugly heads' means that the unruly habits have become unpleasantly ............",
    options: [
      "common and prevalent",
      "comical and entertaining",
      "dangerously violent",
      "repulsive in physical appearance"
    ],
    correctAnswer: "common and prevalent",
    hint: "When a problem 'rears its ugly head', it emerges openly and becomes frequent.",
    workedSolution: "The idiom 'to rear its ugly head' means to appear, emerge, or become frequent and widespread in an unpleasant way; 'common and prevalent' is the accurate definition.",
    points: 1
  },
  {
    number: 6,
    prompt: "In Passage I, the word 'fumed' in 'Mr. Mensah fumed' means that he ............",
    options: [
      "shouted aloud in joy",
      "walked out of the school",
      "lit a cigarette",
      "became exceedingly furious and angry"
    ],
    correctAnswer: "became exceedingly furious and angry",
    hint: "To fume means to seethe with silent or intense anger.",
    workedSolution: "'Fumed' describes experiencing or showing boiling, intense rage; 'became exceedingly furious and angry' is its direct meaning.",
    points: 1
  }
];

// ==========================================
// PASSAGE II: KWADWO'S NAMING CEREMONY
// ==========================================
const passage2Text = `Kwadwo's naming ceremony on the fifteenth day was a grand occasion to which everyone at Elmina had come. Aboagye had specifically invited only the three elders but over three hundred people had come to the ceremony without any invitation.

"The ceremony will start at 5:30 a.m.", Aboagye told everyone who passed his shop the previous day. They in turn went and told others and at 5 a.m., when the ceremony was about to begin, there were about seventy people already in the house.

"Will you bring chairs from the rooms?" Aboagye requested the young ones among the guests. They entered every room in the house and brought out chairs and benches of all shapes and sizes. They were placed in a circle with the three elders sitting in the centre. "Where is the child? The ceremony should be completed before the sun rises," one of them said.

The mother soon brought the two-week-old baby. Twelve calabashes scrubbed the previous day were brought. They looked white and dry. The old man took one and poured some of the gin into it. He raised the head of the child and dipped his finger into the gin. He turned and asked the second elder sitting next to him, "Have you got the name?" "Agyepong, alias Koo Kra."`;

const passage2QuestionsRaw = [
  {
    number: 7,
    prompt: "According to Passage II, what was the primary purpose of the gathering at Mr. Aboagye's residence?",
    options: [
      "To adjudicate a bitter land dispute",
      "To consume alcoholic beverages",
      "To witness a traditional child-naming ceremony",
      "To listen to a political address by Mr. Aboagye"
    ],
    correctAnswer: "To witness a traditional child-naming ceremony",
    hint: "Reread the opening sentence: the people gathered for Kwadwo's naming ceremony on his fifteenth day.",
    workedSolution: "The gathering was an outdooring and traditional naming ritual to confer a name upon the newborn baby.",
    points: 1
  },
  {
    number: 8,
    prompt: "In Passage II, the expression 'chairs and benches of all shapes and sizes' indicates that the seating furniture was ............",
    options: [
      "monumentally heavy",
      "uniformly elongated",
      "measured with architectural precision",
      "of varied, diverse types and designs"
    ],
    correctAnswer: "of varied, diverse types and designs",
    hint: "Diverse, assorted, and non-uniform in design.",
    workedSolution: "The phrase indicates that the gathered seats were an assortment of different designs, heights, and forms gathered hastily from different rooms.",
    points: 1
  },
  {
    number: 9,
    prompt: "From the details provided in Passage II, Mr. Aboagye was a ............",
    options: ["classroom teacher", "commercial shopkeeper or trader", "legal barrister", "church elder"],
    correctAnswer: "commercial shopkeeper or trader",
    hint: "Paragraph two notes that Aboagye informed 'everyone who passed his shop the previous day.'",
    workedSolution: "The text explicitly mentions people passing his shop, establishing his vocation as a commercial trader or shopkeeper.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the word 'grand' in 'was a grand occasion' means ............",
    options: [
      "smooth and calm",
      "solemn and sad",
      "magnificent and elaborate",
      "noisy and chaotic"
    ],
    correctAnswer: "magnificent and elaborate",
    hint: "Impressive, stately, and large-scale in celebration.",
    workedSolution: "'Grand' in reference to social occasions denotes magnificent, elaborate, stately, or splendid; 'magnificent and elaborate' is its exact equivalent.",
    points: 1
  },
  {
    number: 11,
    prompt: "Which of the following statements is NOT true according to Passage II?",
    options: [
      "The custom mandated that the naming rites conclude before sunrise",
      "The presiding elder dipped the baby's entire head into the calabash of gin",
      "The first elder had to verify the child's chosen name from the second elder",
      "The event attracted a large, enthusiastic gathering of townsfolk"
    ],
    correctAnswer: "The presiding elder dipped the baby's entire head into the calabash of gin",
    hint: "The elder only dipped his finger into the gin and placed it on the child's tongue.",
    workedSolution: "The text says the elder raised the child's head and dipped his finger into the liquid; stating that he dipped the child's head into the alcohol is completely false.",
    points: 1
  }
];

// ==========================================
// GENERAL LEXIS AND STRUCTURE (12 - 40)
// ==========================================
const generalQuestionsRaw = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (12 - 15) ---
  {
    number: 12,
    prompt: "The armed burglars who raided the neighborhood last night have been rounded up.\nChoose the word nearest in meaning to the underlined phrase 'rounded up'.",
    options: ["killed", "beaten", "arrested", "wounded"],
    correctAnswer: "arrested",
    hint: "Apprehended, gathered, and placed into lawful police custody.",
    workedSolution: "'Rounded up' in criminal law enforcement means tracked down and captured or arrested; 'arrested' is its direct synonym.",
    points: 1
  },
  {
    number: 13,
    prompt: "Whenever you encounter an unfamiliar term, look it up in a standard dictionary.\nChoose the word nearest in meaning to the underlined phrase 'look it up'.",
    options: ["examine it", "observe it", "find the meaning", "record the spelling"],
    correctAnswer: "find the meaning",
    hint: "To search for information or meaning in a reference source.",
    workedSolution: "The phrasal verb 'to look up' a word means to consult a reference book to ascertain its meaning.",
    points: 1
  },
  {
    number: 14,
    prompt: "The audio loudspeaker will not transmit sound because its amplifier is defective.\nChoose the word nearest in meaning to the underlined word 'defective'.",
    options: ["dirty", "broken", "faulty", "tuned"],
    correctAnswer: "faulty",
    hint: "Imperfect, malfunctioning, or having a flaw.",
    workedSolution: "'Defective' describes an appliance or mechanism that has a flaw and fails to function properly; 'faulty' is its direct synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "Our football squad was eliminated at the semifinal stage of the municipal tournament.\nChoose the word nearest in meaning to the underlined word 'eliminated'.",
    options: ["forgotten", "kicked out", "wiped off", "promoted"],
    correctAnswer: "kicked out",
    hint: "Knocked out, disqualified, or expelled from a competition.",
    workedSolution: "'Eliminated' in competitive tournaments means knocked out or removed from further rounds; 'kicked out' is its closest informal equivalent.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "The apprentice, reluctant to run the errand, walked at a snail's pace. This means that the apprentice walked ............",
    options: ["cautiously", "extremely slowly", "noisily", "carelessly"],
    correctAnswer: "extremely slowly",
    hint: "Moving with minimal speed, mimicking the slow movement of a snail.",
    workedSolution: "The idiom 'at a snail's pace' means very slowly or with sluggish speed.",
    points: 1
  },
  {
    number: 17,
    prompt: "The day our school won the National Science Quiz was a red-letter day. This means it was a ............",
    options: [
      "day marked by a written letter",
      "day of public mourning",
      "memorable and momentous day of joy",
      "day of legal inspection"
    ],
    correctAnswer: "memorable and momentous day of joy",
    hint: "A memorable, joyful, and historically significant holiday or occasion.",
    workedSolution: "'A red-letter day' is an idiom derived from calendar rubrics denoting an especially important, memorable, or happy occasion.",
    points: 1
  },
  {
    number: 18,
    prompt: "I have a bone to pick with my class prefect for submitting a false report. This means that I ............",
    options: [
      "wish to share lunch with the prefect",
      "must report the prefect to the master",
      "must deliver an animal bone to the prefect",
      "have a grievance to settle with the prefect"
    ],
    correctAnswer: "have a grievance to settle with the prefect",
    hint: "Having a complaint or matter of disagreement to discuss or settle.",
    workedSolution: "The idiom 'to have a bone to pick with someone' means to have an annoyance, complaint, or dispute to discuss and resolve with them.",
    points: 1
  },
  {
    number: 19,
    prompt: "Kofi's failure in the promotional examination came out of the blue. This means that his failure was ............",
    options: [
      "inevitably destined",
      "clearly obvious to all",
      "completely unexpected and surprising",
      "divinely ordained"
    ],
    correctAnswer: "completely unexpected and surprising",
    hint: "Occurring totally without prior warning or anticipation.",
    workedSolution: "'Out of the blue' is an idiom meaning completely unexpected, sudden, and surprising.",
    points: 1
  },
  {
    number: 20,
    prompt: "Efua behaves like a fish out of water whenever she enters a mechanics workshop. This means that Efua ............",
    options: [
      "gasps for breath",
      "feels uncomfortable and out of place",
      "swims with great skill",
      "displays cheerful happiness"
    ],
    correctAnswer: "feels uncomfortable and out of place",
    hint: "Feeling awkward, uneasy, or unaccustomed in an unfamiliar setting.",
    workedSolution: "The idiom 'like a fish out of water' describes a person who feels clumsy, uncomfortable, or completely out of their natural element.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "These harvested oranges are stale; please procure ...... ones from the farm.",
    options: ["juicy", "sour", "fresh", "sweet"],
    correctAnswer: "fresh",
    hint: "'Stale' means no longer fresh, dried out, or decaying. Find the word meaning newly gathered.",
    workedSolution: "'Stale' describes foodstuffs that have lost their freshness through age. Its direct antonym regarding agricultural produce is 'fresh'.",
    points: 1
  },
  {
    number: 22,
    prompt: "While Moses is currently serving on a temporary contract, his supervisor holds a ...... post.",
    options: ["daily", "permanent", "probationary", "weekly"],
    correctAnswer: "permanent",
    hint: "'Temporary' means lasting for a limited time. Find the word meaning lasting indefinitely.",
    workedSolution: "'Temporary' means short-term or transient. Its direct antonym in civil service employment is 'permanent'.",
    points: 1
  },
  {
    number: 23,
    prompt: "The stray intruder vanished into the forest when the guards appeared.",
    options: ["showed", "defected", "jumped", "appeared"],
    correctAnswer: "appeared",
    hint: "'Vanished' means disappeared suddenly from sight. Find the word meaning came into view.",
    workedSolution: "'Vanished' means passed completely out of sight. Its direct visual antonym is 'appeared' (came into sight).",
    points: 1
  },
  {
    number: 24,
    prompt: "While the reckless motorist drove through the crowd, the presidential chauffeur handled the limousine ...... .",
    options: ["speedily", "carefully", "noisily", "leisurely"],
    correctAnswer: "carefully",
    hint: "'Recklessly' means carelessly without caution. Find the word denoting caution and attentiveness.",
    workedSolution: "'Recklessly' means acting with complete disregard for danger. Its direct opposite in vehicular operation is 'carefully'.",
    points: 1
  },
  {
    number: 25,
    prompt: "The technician proved that the machine components were genuine brands, not ...... replicas.",
    options: ["fine", "tested", "fake", "new"],
    correctAnswer: "fake",
    hint: "'Genuine' means real and authentic. Find the word meaning counterfeit or forged.",
    workedSolution: "'Genuine' means authentic, original, and true. Its direct commercial antonym is 'fake' (counterfeit).",
    points: 1
  },

  // --- SECTION E: LEXIS AND STRUCTURE (26 - 40) ---
  {
    number: 26,
    prompt: "I am free to rest now, for I ...... all my terminal examination revisions.",
    options: ["completed", "do complete", "have completed", "complete"],
    correctAnswer: "have completed",
    hint: "Present Perfect tense: An action completed in the immediate past that has a direct present result ('I am free now').",
    workedSolution: "The present state of freedom ('I am free now') is the direct result of a completed past action, requiring the Present Perfect tense ('have completed').",
    points: 1
  },
  {
    number: 27,
    prompt: "After Roderick ...... the ceremonial suit, he searched for a pair of matching shoes.",
    options: ["has bought", "is buying", "had bought", "was buying"],
    correctAnswer: "had bought",
    hint: "Use the past perfect tense ('had + past participle') for an action completed before another past event.",
    workedSolution: "The purchasing of the suit preceded the search for matching shoes in a past narrative frame, requiring the Past Perfect tense ('had bought').",
    points: 1
  },
  {
    number: 28,
    prompt: "I greeted the tailor while he ...... the traditional kente cloth.",
    options: ["is folding", "has been folding", "was folding", "had been folding"],
    correctAnswer: "was folding",
    hint: "An ongoing past continuous action ('was folding') during which a simple past action ('greeted') occurred.",
    workedSolution: "Clauses introduced by 'while' describing an extended background activity in the past take the Past Continuous tense ('was folding').",
    points: 1
  },
  {
    number: 29,
    prompt: "You cannot consume this entire bowl of soup alone, ......?",
    options: ["can't you", "do you", "can you", "don't you"],
    correctAnswer: "can you",
    hint: "A negative statement with 'cannot' takes an affirmative tag: 'can you?'.",
    workedSolution: "The main clause contains a negative modal verb ('cannot eat'). Its corresponding question tag must be affirmative: 'can you?'.",
    points: 1
  },
  {
    number: 30,
    prompt: "Not only was the young candidate exceptionally elegant, ...... remarkably brilliant.",
    options: ["or", "nor", "but also", "and also"],
    correctAnswer: "but also",
    hint: "Correlative conjunction pair: 'Not only' is followed by 'but also'.",
    workedSolution: "The correlative pair in formal English syntax is 'Not only ... but also'.",
    points: 1
  },
  {
    number: 31,
    prompt: "Neither the headmaster nor his administrative assistant ...... at the office today.",
    options: ["is working", "do work", "have worked", "are working"],
    correctAnswer: "is working",
    hint: "Proximity rule: With 'neither... nor', the verb agrees in number with the subject closer to it ('assistant' - singular).",
    workedSolution: "When subjects are linked by 'neither... nor', the verb agrees with the nearer subject ('his administrative assistant', singular), taking 'is working'.",
    points: 1
  },
  {
    number: 32,
    prompt: "The grazing antelope was startled while it ...... by the edge of the thicket.",
    options: ["is eating", "is eaten", "was ate", "was eating"],
    correctAnswer: "was eating",
    hint: "Past continuous tense describing an ongoing action in the past.",
    workedSolution: "The continuous action in the past is expressed by the past continuous tense: 'was eating'.",
    points: 1
  },
  {
    number: 33,
    prompt: "There were ...... commercial vehicles parked along the coastal beach resort.",
    options: ["plenty", "most", "much", "many"],
    correctAnswer: "many",
    hint: "'Vehicles/cars' is a plural countable noun. Use this quantifier.",
    workedSolution: "Plural countable nouns ('cars') require 'many'. 'Much' is used strictly for non-count mass nouns.",
    points: 1
  },
  {
    number: 34,
    prompt: "Lucy is the ...... accomplished scholar in the graduating class.",
    options: ["much", "very much", "very more", "most"],
    correctAnswer: "most",
    hint: "Form the superlative degree of multi-syllable adjectives preceded by 'the'.",
    workedSolution: "The superlative degree of multi-syllable adjectives ('accomplished' / 'beautiful') is formed with 'most' preceded by 'the'.",
    points: 1
  },
  {
    number: 35,
    prompt: "The philosopher is ...... to engage in reckless public arguments.",
    options: [
      "too wise a man",
      "too a wise man",
      "a too wise man",
      "a man wise too"
    ],
    correctAnswer: "too wise a man",
    hint: "Structure: 'too + adjective + a/an + singular count noun'.",
    workedSolution: "In formal syntactic structures, the intensifier 'too' precedes the adjective, which is followed by the indefinite article and the noun: 'too wise a man'.",
    points: 1
  },
  {
    number: 36,
    prompt: "Mantey and Kofi greeted each other warmly and shook hands with ......",
    options: ["each other", "each one", "one another", "themselves"],
    correctAnswer: "each other",
    hint: "Reciprocal pronoun used when an action is mutually exchanged between exactly two individuals.",
    workedSolution: "'Each other' is the reciprocal pronoun used when referring to two persons ('Mantey and Kofi'). 'One another' is preferred for three or more.",
    points: 1
  },
  {
    number: 37,
    prompt: "The creative arts department organized an inspiring ...... cultural exhibition.",
    options: ["two days", "two day", "two-day", "two-days"],
    correctAnswer: "two-day",
    hint: "Compound unit adjectives preceding a noun are hyphenated and remain in the singular form.",
    workedSolution: "When a measurement phrase functions as a compound adjective preceding a noun, it takes a hyphen and retains a singular noun ('two-day exhibition').",
    points: 1
  },
  {
    number: 38,
    prompt: "The generous village elder informed the stranded stranger that he would put him ...... for the night.",
    options: ["down", "up", "on", "over"],
    correctAnswer: "up",
    hint: "Identify the phrasal verb meaning to provide someone with food and temporary shelter.",
    workedSolution: "The phrasal verb 'to put someone up' means to provide them with temporary overnight lodging.",
    points: 1
  },
  {
    number: 39,
    prompt: "In traditional wrestling, it is reckless to take ...... a combatant twice your physical size.",
    options: ["off", "in", "on", "over"],
    correctAnswer: "on",
    hint: "Identify the phrasal verb meaning to challenge, oppose, or fight against an adversary.",
    workedSolution: "The phrasal verb 'to take on' means to confront, fight, or accept a challenge against an opponent.",
    points: 1
  },
  {
    number: 40,
    prompt: "The storekeeper was certain that he had handed the change to ...... else in the shop.",
    options: ["anyone", "someone", "somebody", "everybody"],
    correctAnswer: "someone",
    hint: "Use 'someone' in affirmative statements to denote an unspecified person.",
    workedSolution: "In affirmative declarative sentences, 'someone' is standard when referring to an unspecified individual ('someone else'). 'Anyone' is used primarily in negatives and interrogatives.",
    points: 1
  }
];

// Combine all 40 raw questions
const allRawQuestions = [
  ...passage1QuestionsRaw,
  ...passage2QuestionsRaw,
  ...generalQuestionsRaw
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

const assignedTargetIndices = seedShuffle(targetKeys, 199601);

const balancedPaper1 = allRawQuestions.map((q, idx) => {
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

// Partition Questions for Passage-First Rendering
const passage1Questions = balancedPaper1.slice(0, 6);
const passage2Questions = balancedPaper1.slice(6, 11);
const remainingQuestions = balancedPaper1.slice(11);

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
        prompt: "Write a letter to your friend in another town, explaining at least three specific academic or vocational goals you plan to pursue after completing your Basic Education Certificate Examination (BECE).",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 42
Konongo, Ashanti Region
14th June, 1996

Dear Kwaku,

I hope this letter finds you in fine health and high spirits as we conclude our final mock examinations. It has been a demanding term, but I am excited about the future. In your recent letter, you asked about my educational plans after the BECE. I am delighted to share three specific goals I intend to pursue.

First and foremost, I plan to enroll in a Senior Secondary School to pursue the General Science programme, specializing in Physics, Chemistry, Biology, and Elective Mathematics. My lifelong dream is to study biomedical engineering at the university to design medical diagnostic equipment that can serve rural hospitals in Ghana. Pursuing this secondary school course is the essential foundation I need to realize this professional ambition.

Secondly, I intend to undertake an intensive computer programming and typing apprenticeship during the long vacation. In this emerging technological age, computer literacy is indispensable for academic research and future employment. Acquiring practical skills in word processing, basic coding, and database management will give me a significant advantage over my peers when secondary school resumes.

Finally, I plan to assist my uncle at his commercial agroforestry farm to master modern irrigation techniques. Gaining hands-on knowledge in agribusiness will teach me financial self-reliance and practical skills in food security.

I would love to know what you plan to do after the examinations. Please write back soon.

Your true friend,
[Signature]
Kwabena Osei`
      },
      {
        questionNumber: "2",
        category: "Formal Letter",
        prompt: "Despite securing excellent grades in your BECE, none of the secondary schools you selected offered you admission. Write a formal petition to your District Education Officer explaining this unfair predicament and politely requesting intervention.",
        modelAnswer: `Presbyterian Junior Secondary School
P. O. Box 80
Begoro, Eastern Region
18th October, 1996

The District Education Officer
Ghana Education Service
Fanteakwa District Directorate
Begoro

Dear Sir,

PETITION REGARDING UNFAIR PLACEMENT DENIAL DESPITE OUTSTANDING BECE PERFORMANCE

I respectfully write to draw your urgent attention to an acute injustice in the computerized secondary school placement exercise and to appeal for your administrative intervention.

In the recently released Basic Education Certificate Examination (BECE) results, I secured Aggregate Seven, scoring Grade One in Integrated Science, Mathematics, English Language, and Pre-Technical Skills. My official result slip, verified by my headmaster, attests to my scholastic competence. In accordance with Ghana Education Service guidelines, I selected three recognized public secondary schools whose cut-off thresholds for General Science ranged from Aggregate Eight to Twelve.

Regrettably, to my utter dismay and the shock of my teachers, none of my selected choices offered me admission. Even more perplexing, several classmates with weaker aggregates—ranging from Aggregate Ten to Fourteen—were successfully admitted into the identical programmes and institutions I chose. This unexpected denial has left me emotionally devastated and threatens to truncate my academic progression.

My former headmaster has forwarded an official endorsement affirming my high moral character and academic excellence. Since my parents are subsistence cocoa farmers who cannot afford private secondary tuition, I humbly appeal to your high office to review my placement portfolio and allocate me an admission placement in one of my selected schools.

Thank you for your anticipated intervention in ensuring justice.

Yours faithfully,
[Signature]
Emmanuel Addo
(Index Number: 0204010080)`
      },
      {
        questionNumber: "3",
        category: "Narrative Essay",
        prompt: "Describe in vivid detail the happiest and most memorable day of your life, recounting the events that made it unforgettable.",
        modelAnswer: `THE DAY DREAMS TURNED INTO REALITY

Among all the days of my childhood, Friday, the 12th of April 1996, stands out as the happiest and most unforgettable milestone of my life. It was the day our basic school debating team won the prestigious National Inter-Schools Independence Debate Championship held at the National Theatre in Accra.

The journey to the finals had been grueling. For six months, my teammate, Akosua, and I spent late nights in our school library researching contemporary economic policies under the guidance of our English master, Mr. Mensah. As representatives of an underprivileged rural basic school in the Eastern Region, few spectators gave us a chance against well-endowed urban academies.

When we stepped onto the brightly lit stage before a packed auditorium of dignitaries, judges, and hundreds of students, my knees trembled slightly. However, as the debate commenced on the motion "Industrialization is the Sole Pathway to African Economic Independence," a surge of calm confidence swept over me. We delivered our arguments with eloquence, dismantling our opponents' points with statistical facts and oratorical power that drew deafening applause from the auditorium.

The defining moment came during the declaration of results. When the Chief Judge stepped to the microphone and announced our school as the overall national champions, our entire school delegation leapt to their feet in ecstatic tears. Holding the golden championship trophy aloft, while receiving a full secondary school scholarship, filled my heart with boundless joy.

Arriving back in our village that evening, the paramount chief and villagers welcomed our bus with traditional fontomfrom drumming. It was a glorious day that proved that with dedication, humble origins are never a barrier to excellence.`
      },
      {
        questionNumber: "4",
        category: "Narrative Essay",
        prompt: "Give an engaging and suspenseful account of a terrifying experience you had or witnessed, explaining how you survived the ordeal.",
        modelAnswer: `CAUGHT IN THE MIDNIGHT FLOODWATERS

It was a stormy Tuesday night in June when our tranquil farming village along the banks of the Densu River was struck by an unprecedented natural disaster. Torrential rain had been pounding our corrugated iron roof for eight continuous hours without ceasing.

Around two o'clock in the morning, a deafening roaring sound, resembling a hundred approaching locomotives, shook our four-room family house. Before my father could light the hurricane lamp, an icy wall of muddy water burst through our wooden front door with terrifying force. Within seconds, the dark room was flooded up to my waist. Screams of terror echoed across the compound as floating furniture, kitchen utensils, and broken planks crashed around us in the pitch-dark swirling torrent.

Panic threatened to paralyze me as the water level surged higher toward our necks. My father acted with extraordinary heroism. Shouting above the thunderous roar, he hoisted my younger sister onto his shoulders and assisted Mother and me to scramble through a back window onto the lower branches of an ancient mango tree growing beside our compound wall.

Shivering violently in the freezing rain, soaked to the bone and clinging to the slippery branches for four agonizing hours, we watched in horror as the raging floodwaters swept away livestock, collapsed mud kitchens, and submerged our entire village. Every minute felt like an eternity as lightning flashes illuminated the swirling brown sea below us.

At dawn, relief finally arrived. Brave village fishermen navigating large wooden canoes arrived through the flooded streets and rescued us from the tree branches. Although our home was destroyed, stepping onto dry ground with my family intact filled me with profound gratitude for our survival.`
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

async function seedBeceEnglish1996Calibrated() {
  console.log("Seeding Calibrated & Passage-First BECE English 1996 into Firestore...");

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
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_1996");
  await docRef.set({
    year: 1996,
    title: "BECE English Language 1996 (Calibrated National Benchmark)",
    subjectId: "english",
    metadata: {
      isPastQuestion: true,
      standard: "NaCCA / WAEC BECE Standard",
      totalMarks: 100,
      totalDurationMinutes: 120,
      paper1Count: balancedPaper1.length,
      optionsBalanced: true,
      unplagiarizedPedagogicalAdaptation: true,
      passageFirstLayout: true,
      updatedAt: new Date()
    },
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      // Section A: Passage-First Comprehension Architecture
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: Mr. Mensah's Classroom Detection",
          text: passage1Text,
          questionRange: "Questions 1 to 6",
          questions: passage1Questions
        },
        passage2: {
          passageTitle: "Passage II: Kwadwo's Traditional Naming Ceremony",
          text: passage2Text,
          questionRange: "Questions 7 to 11",
          questions: passage2Questions
        }
      },
      // Sections B - E: Lexis, Synonyms, Idioms, Antonyms, and Structure
      sectionB_to_E: {
        title: "Sections B - E: Lexis, Idioms, Antonyms and Structure",
        questionRange: "Questions 12 to 40",
        questions: remainingQuestions
      },
      // Complete Flat Sequence for standard computerized test runners
      allQuestions: balancedPaper1,
      questions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Essay Writing (Composition)",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Calibrated & Passage-First BECE English 1996 successfully seeded into Firestore!");
}

seedBeceEnglish1996Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1996:", err);
    process.exit(1);
  });
