import * as dns from 'dns';
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
process.env.GCLOUD_PROJECT = 'gamedu-69888475-f5783';
process.env.GOOGLE_CLOUD_PROJECT = 'gamedu-69888475-f5783';

import * as admin from 'firebase-admin';
import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function getDb() {
  const fbAdmin = (admin as any).default || admin;
  try {
    const { OAuth2Client } = req('google-auth-library');
    const { Firestore } = req('@google-cloud/firestore');
    const auth = req('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
    const account = auth.getGlobalDefaultAccount();
    if (account && account.tokens) {
      const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
      const oauthClient = new OAuth2Client();
      oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
      return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient, ignoreUndefinedProperties: true });
    }
  } catch (e) {
    console.log("Fallback to admin default credentials...", e);
  }

  if (!fbAdmin.apps?.length) {
    fbAdmin.initializeApp({
      credential: fbAdmin.credential.applicationDefault(),
    });
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

// =========================================================================
// 100% CLEAN-ROOM ISOMORPHIC QUESTIONS (1 - 30)
// =========================================================================
const allRawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "One of the prized breeding bulls ............ from the municipal ranch during the storm.",
    options: [
      "have been strayed",
      "has been strayed",
      "have strayed",
      "has strayed"
    ],
    correctAnswer: "has strayed",
    hint: "The grammatical subject head is 'One' (singular third-person), requiring an active singular present perfect verb.",
    workedSolution: "The true grammatical head is 'One' (singular) of the bulls, which takes the active singular present perfect verb 'has strayed'. ('Has been strayed' is an erroneous passive).",
    points: 1
  },
  {
    number: 2,
    prompt: "From our balcony, we saw the frightened puppy ............ across the busy avenue.",
    options: ["run", "is running", "ran", "was running"],
    correctAnswer: "run",
    hint: "Verbs of sensory perception (see, hear, watch) take a direct object followed by a bare infinitive for a completed action.",
    workedSolution: "Following verbs of sensory perception ('saw'), standard English uses a bare infinitive without 'to' ('run') to indicate witnessing the complete action.",
    points: 1
  },
  {
    number: 3,
    prompt: "To beat the morning highway gridlock, Habib commutes to school ............ train.",
    options: ["by", "on", "with", "in"],
    correctAnswer: "by",
    hint: "General modes of transport (train, bus, air, sea) take the preposition 'by' without a determiner.",
    workedSolution: "When describing standard public modes of travel without an article or determiner, standard English uses 'by': 'by train'.",
    points: 1
  },
  {
    number: 4,
    prompt: "This laptop computer does not belong to me; it is ............",
    options: [
      "mine uncle's",
      "my uncle's",
      "my uncles",
      "mine uncles"
    ],
    correctAnswer: "my uncle's",
    hint: "Possessive determiner 'my' followed by a singular possessive noun ending in 's.",
    workedSolution: "Possession is correctly indicated by combining the possessive determiner 'my' with the possessive noun 'uncle's': 'it is my uncle's'.",
    points: 1
  },
  {
    number: 5,
    prompt: "The bride looked magnificent in her ............ gown.",
    options: [
      "silk blue beautiful",
      "beautiful blue silk",
      "blue beautiful silk",
      "beautiful silk blue"
    ],
    correctAnswer: "beautiful blue silk",
    hint: "Cumulative adjective ordering: Opinion/Evaluation ('beautiful') precedes Color ('blue') which precedes Material ('silk') before the noun.",
    workedSolution: "Standard English cumulative adjective order places subjective evaluation ('beautiful') before color ('blue') followed by material origin ('silk'): 'beautiful blue silk dress'.",
    points: 1
  },
  {
    number: 6,
    prompt: "The promotional examination schedule is demanding, but I truly wish I ............ my ailing companion next weekend.",
    options: ["can visit", "am visiting", "shall visit", "could visit"],
    correctAnswer: "could visit",
    hint: "Hypothetical future wishes require the past modal auxiliary 'could'.",
    workedSolution: "When expressing a hypothetical wish regarding future possibilities that are uncertain or contrary to fact, standard English requires 'could': 'wish I could visit'.",
    points: 1
  },
  {
    number: 7,
    prompt: "In terms of personal discipline and moral character, Aba took ............ her mother in many ways.",
    options: ["after", "up", "on", "by"],
    correctAnswer: "after",
    hint: "Identify the phrasal verb meaning to resemble an older parent or ancestor in appearance or temperament.",
    workedSolution: "The phrasal verb 'to take after' means to resemble an ancestor or parent in character or appearance: 'took after her mother'.",
    points: 1
  },
  {
    number: 8,
    prompt: "The pediatric physician cautioned that the young girl is allergic ............ chalk dust.",
    options: ["with", "to", "against", "about"],
    correctAnswer: "to",
    hint: "Identify the dependent preposition that regularly collocates with the adjective 'allergic'.",
    workedSolution: "In standard English grammatical collocations, the adjective 'allergic' takes the preposition 'to': 'allergic to dust'.",
    points: 1
  },
  {
    number: 9,
    prompt: "My elder brother, together with his two children, ............ traveling to Tamale next Monday.",
    options: ["is", "are", "was", "were"],
    correctAnswer: "is",
    hint: "Parenthetical additions introduced by 'together with / with' do not pluralize the singular subject 'My elder brother'.",
    workedSolution: "Parenthetical phrases like 'with his children' do not alter the grammatical number of the subject. The singular head 'My brother' takes the singular present continuous auxiliary 'is'.",
    points: 1
  },
  {
    number: 10,
    prompt: "It is high time the municipal delegates ............ for the annual summit.",
    options: ["left", "leave", "have to leave", "will leave"],
    correctAnswer: "left",
    hint: "Subjunctive past simple: 'It is high time + subject' takes a simple past verb form.",
    workedSolution: "Following the subjunctive construction 'It is high time' with a specified subject, standard grammar requires the simple past tense: 'left'.",
    points: 1
  },
  {
    number: 11,
    prompt: "The accused contractor refused to appear before the ............ disciplinary committee.",
    options: ["five-man's", "five-man", "five-men", "five-men's"],
    correctAnswer: "five-man",
    hint: "Compound adjective modifying a noun retains the singular form and is hyphenated without possessive inflection.",
    workedSolution: "When a numeral and noun combine into a compound adjective preceding a head noun ('panel/committee'), the noun remains singular: 'five-man panel'.",
    points: 1
  },
  {
    number: 12,
    prompt: "The comical antics of the playful toddler made the entire congregation ............",
    options: ["to laugh", "laughing", "laughed", "laugh"],
    correctAnswer: "laugh",
    hint: "The causative verb 'make' (past: 'made') in the active voice takes an object followed by a bare infinitive without 'to'.",
    workedSolution: "In active causative constructions, 'make' takes an object followed by a bare infinitive without 'to': 'made her laugh'.",
    points: 1
  },
  {
    number: 13,
    prompt: "Because of acute paper scarcity, the bookstore has not stocked ............ of the two prescribed literature texts.",
    options: ["neither", "either", "none", "all"],
    correctAnswer: "either",
    hint: "In a negative clause containing 'not', use this pronoun to negate a choice between two items without creating a double negative.",
    workedSolution: "Following the negative auxiliary 'have not', standard English uses 'either' when referring to two items ('either of the two prescribed books'). 'Neither' would create an ungrammatical double negative.",
    points: 1
  },
  {
    number: 14,
    prompt: "The candidates found the advanced calculus problem ............ to solve within the time limit.",
    options: [
      "much too difficult",
      "difficult too much",
      "too much difficult",
      "very too difficult"
    ],
    correctAnswer: "much too difficult",
    hint: "Standard modifier order: 'much' modifies the degree adverb 'too', which modifies the adjective 'difficult'.",
    workedSolution: "To intensify the degree phrase 'too difficult', the adverb 'much' precedes 'too': 'much too difficult'. Forms like *too much difficult are ungrammatical.",
    points: 1
  },
  {
    number: 15,
    prompt: "The tired oxen lay resting on the bare paddock floor, ............?",
    options: ["didn't they", "don't they", "didn't it", "isn't it"],
    correctAnswer: "didn't they",
    hint: "'Oxen' is the irregular plural of 'ox', and 'lay' is the simple past tense of 'lie' (to recline), requiring a negative past tag with plural pronoun 'they'.",
    workedSolution: "The subject 'oxen' is plural (requiring pronoun 'they'), and the verb 'lay' is the simple past of 'lie'. The matching tag must be negative simple past: 'didn't they?'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The regional education directors paid a sudden unannounced visit to our school.\nChoose the word nearest in meaning to 'sudden'.",
    options: ["an usual", "a strange", "a quick", "an unexpected"],
    correctAnswer: "an unexpected",
    hint: "Occurring rapidly without prior notice or anticipation.",
    workedSolution: "'Sudden' means happening quickly without prior announcement or warning; 'an unexpected' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "Several junior pupils grumbled about the demanding compound cleaning duties.\nChoose the word nearest in meaning to 'grumbled'.",
    options: ["questioned", "talked", "complained", "bothered"],
    correctAnswer: "complained",
    hint: "Muttered in discontent; expressed dissatisfaction.",
    workedSolution: "'Grumbled' means expressed dissatisfaction or resentment in a low, muttering tone; 'complained' is its direct synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "It is considered impolite to interrupt an elder while he is addressing a gathering.\nChoose the word nearest in meaning to 'impolite'.",
    options: ["incorrect", "improper", "unwise", "rude"],
    correctAnswer: "rude",
    hint: "Lacking manners, respect, or civility.",
    workedSolution: "'Impolite' means discourteous, ill-mannered, or 'rude'.",
    points: 1
  },
  {
    number: 19,
    prompt: "The magistrate advised the feuding neighbors not to waste court time on trivial matters.\nChoose the word nearest in meaning to 'trivial'.",
    options: ["unpleasant", "unimportant", "unexciting", "unacceptable"],
    correctAnswer: "unimportant",
    hint: "Of little value, minor significance, or petty consequence.",
    workedSolution: "'Trivial' means of little worth, insignificant, or 'unimportant'.",
    points: 1
  },
  {
    number: 20,
    prompt: "The curious apprentice asked several probing questions about the electrical circuit.\nChoose the word nearest in meaning to 'curious'.",
    options: ["inquisitive", "pompous", "intelligent", "talkative"],
    correctAnswer: "inquisitive",
    hint: "Eager to learn, investigate, or inquire.",
    workedSolution: "'Curious' in the context of seeking knowledge means inquiring, prying, or 'inquisitive'.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "Araba's unannounced visit to our village was a bolt from the blue. This means her arrival was ............",
    options: [
      "a most welcome occurrence",
      "exceptionally brief",
      "a complete surprise",
      "punctual and timely"
    ],
    correctAnswer: "a complete surprise",
    hint: "A sudden, completely unexpected shock or event that comes without warning.",
    workedSolution: "The idiom 'a bolt from the blue' refers to an event that occurs completely unexpectedly and without prior warning; 'a complete surprise'.",
    points: 1
  },
  {
    number: 22,
    prompt: "My philanthropic uncle loves to cast his bread upon waters. This means that my uncle ............",
    options: [
      "behaves in an eccentric manner",
      "feeds fish in the river with bread",
      "wastes his wealth carelessly",
      "loves to help people generously without demanding immediate returns"
    ],
    correctAnswer: "loves to help people generously without demanding immediate returns",
    hint: "To do good deeds or share resources selflessly, trusting that good will return in due course.",
    workedSolution: "The biblical idiom 'to cast one's bread upon the waters' means to do good deeds, be generous, or help others selflessly without expecting immediate personal gain.",
    points: 1
  },
  {
    number: 23,
    prompt: "When his commercial enterprise collapsed, Yaro was left to sink or swim. This means that Yaro ............",
    options: [
      "fell into severe depression",
      "cried aloud for rescue",
      "secured an alternative job immediately",
      "had to survive independently on his own efforts"
    ],
    correctAnswer: "had to survive independently on his own efforts",
    hint: "To fail or succeed solely by one's own efforts without external assistance.",
    workedSolution: "The idiom 'to sink or swim' means to face a challenging situation where one must either fail completely or survive entirely through one's own efforts.",
    points: 1
  },
  {
    number: 24,
    prompt: "I was informed of the executive meeting at the eleventh hour. This means I received the information ............",
    options: [
      "instantly without delay",
      "at exactly eleven o'clock",
      "with abundant time to prepare",
      "very late when it was almost too late"
    ],
    correctAnswer: "very late when it was almost too late",
    hint: "At the very last possible moment.",
    workedSolution: "The idiom 'at the eleventh hour' means at the latest possible moment or 'very late'.",
    points: 1
  },
  {
    number: 25,
    prompt: "John had to eat his words when our underdog football team lifted the championship trophy. This means that John ............",
    options: [
      "was completely astonished",
      "humbly admitted that he had been mistaken",
      "denied his previous statements",
      "lost his appetite for food"
    ],
    correctAnswer: "humbly admitted that he had been mistaken",
    hint: "To be forced to retract a statement or admit humiliatingly that one was wrong.",
    workedSolution: "The idiom 'to eat one's words' means to be forced to admit that what one previously said was wrong, boastful, or untrue.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "While the angry student intentionally smashed the window, his classmate damaged the desk ...... .\nChoose the word most nearly opposite in meaning to 'intentionally'.",
    options: ["carelessly", "accidentally", "willingly", "foolishly"],
    correctAnswer: "accidentally",
    hint: "'Intentionally' means done on purpose deliberately. What word denotes done unintentionally by chance or error?",
    workedSolution: "'Intentionally' means deliberately or on purpose. Its direct antonym is 'accidentally' (by mistake or chance).",
    points: 1
  },
  {
    number: 27,
    prompt: "The municipal assembly initiated several infrastructure projects last year, and have now ...... them.\nChoose the word most nearly opposite in meaning to 'initiated'.",
    options: ["funded", "completed", "executed", "organized"],
    correctAnswer: "completed",
    hint: "'Initiated' means started or commenced. What word denotes finished, concluded, or brought to an end?",
    workedSolution: "'Initiated' means commenced, started, or set in motion. Its direct procedural antonym is 'completed' (finished).",
    points: 1
  },
  {
    number: 28,
    prompt: "While most sanitary regulations were observed by the food vendors, a few recalcitrant hawkers ...... them.\nChoose the word most nearly opposite in meaning to 'observed'.",
    options: ["violated", "cancelled", "lessened", "excluded"],
    correctAnswer: "violated",
    hint: "'Observed' in reference to laws or rules means obeyed and followed. What word denotes broke, infringed, or disobeyed?",
    workedSolution: "'Observed' in regulatory contexts means adhered to, respected, or obeyed. Its direct legal antonym is 'violated' (breached or broken).",
    points: 1
  },
  {
    number: 29,
    prompt: "The examination council released the verified results, but ...... the scripts of schools suspected of malpractice.\nChoose the word most nearly opposite in meaning to 'released'.",
    options: ["withheld", "confirmed", "withdrew", "cancelled"],
    correctAnswer: "withheld",
    hint: "'Released' means made public or handed out. What administrative word denotes kept back, retained, or refrained from releasing?",
    workedSolution: "'Released' means published or made available. Its direct administrative antonym is 'withheld' (kept back or restrained from publication).",
    points: 1
  },
  {
    number: 30,
    prompt: "The children found the stranger's stories humourless, whereas the clown's performance was remarkably ...... .\nChoose the word most nearly opposite in meaning to 'humourless'.",
    options: ["funny", "peculiar", "familiar", "cheerful"],
    correctAnswer: "funny",
    hint: "'Humourless' means devoid of humor, dry, and not amusing. What word denotes amusing, comical, or provoking laughter?",
    workedSolution: "'Humourless' describes something lacking wit, amusement, or comical qualities. Its direct antonym is 'funny' (humorous or amusing).",
    points: 1
  }
];

// Seeded Deterministic Shuffle across 30 Objective Items: Exactly 8 A, 7 B, 8 C, 7 D
const targetKeys: number[] = [
  0, 1, 2, 3, 0, 1, 2, 3, 0, 1,
  2, 3, 0, 1, 2, 3, 0, 1, 2, 3,
  0, 1, 2, 3, 0, 1, 2, 3, 0, 2
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

const assignedTargetIndices = seedShuffle(targetKeys, 201902);

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

// =========================================================================
// PAPER 2: ESSAY WRITING, COMPREHENSION & LITERATURE (THEORY SUITE)
// =========================================================================
const paper2Calibrated = {
  partA_composition: {
    title: "Part A: Essay Writing",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Formal Letter",
        prompt: "Write a formal letter to your Headmaster, proposing and discussing at least two competitive sporting games that should be actively encouraged and introduced among students in your school.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2019

The Headmaster
Methodist Junior High School
P. O. Box 54
Bekwai

Dear Sir,

PROPOSAL FOR THE INTRODUCTION OF VOLLEYBALL AND TABLE TENNIS IN OUR SCHOOL

I respectfully write on behalf of the student body to propose two exciting, low-cost sporting games that our school should actively introduce and promote among students: volleyball and table tennis.

First and foremost, volleyball is an exceptional team sport that fosters physical fitness, cardiovascular endurance, and strategic collaboration. Unlike football, which requires a vast, turf-covered pitch, a standard volleyball court occupies minimal space and can be constructed easily on our empty gravel compound behind the junior block using two treated wooden posts and a net. Furthermore, volleyball is inherently non-contact, drastically minimizing the incidence of fractures, sprains, and collisions commonly sustained during inter-class soccer matches. Introducing volleyball will also encourage widespread female participation in competitive school sports.

Secondly, table tennis is an ideal indoor game that sharpens reflexes, improves hand-eye coordination, and stimulates quick tactical thinking. Because it is played indoors, students can train continuously during rainy days and harsh harmattan heatwaves when outdoor sports are impossible. Fabricating two standard wooden table tennis boards through our school's technical skills workshop will require minimal expenditure, providing an engaging recreational outlet that deters students from loitering during recess.

Both sports offer fertile opportunities for our talented students to win honors at municipal sports festivals and earn secondary school athletic scholarships. I pray that you will give this proposal favorable consideration.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Sports Prefect)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in your school magazine on the topic: \"Why Every Basic and Senior High School Student Should Be Computer-Literate in the 21st Century.\"",
        modelAnswer: `THE CRITICAL NECESSITY OF COMPUTER LITERACY FOR MODERN STUDENTS
By Samuel K. Boateng, Begoro

We live in an extraordinary 21st-century technological era where digital automation, artificial intelligence, and electronic connectivity define human civilization. In contemporary society, the classical definition of literacy—the rudimentary ability to read and write on paper—is no longer sufficient. Today, possessing digital competence and computer literacy is the non-negotiable prerequisite for academic triumph and professional survival.

First and foremost, computer literacy revolutionizes academic research and independent study. In previous decades, students relied solely on limited, outdated physical textbooks in school libraries. Today, a computer-literate student can navigate electronic search engines, download updated academic journals, explore interactive digital encyclopedias, and watch practical science laboratory simulations online. This unhindered access to global knowledge clarifies abstract concepts in Mathematics and Integrated Science, fostering independent critical inquiry and enhancing performance in national examinations like the BECE.

Secondly, computer literacy is the foundation of future employment. In the modern global economy, virtually every professional enterprise—ranging from banking and medicine to engineering, corporate administration, and graphic design—demands digital proficiency. An applicant who cannot type documents, manage electronic spreadsheets, or operate communication software is rendered unemployable. Equipping students with digital skills bridges the gap between classroom instruction and market demands.

Furthermore, digital literacy sparks innovative creativity, empowering young minds to explore computer coding, software programming, and digital entrepreneurship.

In conclusion, computer literacy is not an optional hobby; it is an indispensable life skill. Every student must seize the opportunity to master the computer.

A digitally empowered student is a conqueror of the future.`
      },
      {
        questionNumber: "3",
        category: "Narrative Moral Essay",
        prompt: "Write an engaging, realistic story that concludes with the words: \"... It pays to be kind to strangers.\"",
        modelAnswer: `THE BENEVOLENT TRAVELER AND THE STRANDED DRIVER

It was a chilly, moonless Saturday evening in November, and our rural farming village was enveloped in darkness after a violent rainstorm had knocked down the municipal electrical poles. Sitting outside our family compound with my elder brother, Kofi, we noticed a heavy commercial delivery van skid off the muddy highway into an overgrown, waterlogged ditch.

The driver, a middle-aged stranger from the northern savannah region who spoke our local dialect with difficulty, was trembling with cold and anxiety. He had suffered a deep laceration on his forearm while attempting to push the vehicle, and his mechanical tools were submerged in the red mud. Several passers-by chuckled at his predicament or demanded exorbitant sums before offering aid, but my heart went out to him.

Kofi and I assisted the stranded traveler onto our veranda. We brought warm water, antiseptic soap, and clean cotton gauze from our mother's dispensary kit to dress his bleeding arm. I hurried to the kitchen, warmed a bowl of spicy pepper soup with boiled yams, and served him with hot tea. Afterward, Kofi mobilized five robust youth volunteers from our neighborhood who, armed with strong hemp ropes and wooden logs, hauled his delivery van out of the muddy ditch. Overwhelmed with gratitude, the stranger thanked us profusely, prayed for our future, and continued his journey to Takoradi.

Five months later, my father suffered an acute mechanical breakdown while transporting twenty sacks of harvested cocoa to the regional depot in a rented truck. Stranded on an isolated forest highway at midnight with armed robbers roaming the corridor, a massive refrigerated logistics truck pulled over. The driver stepped down, immediately recognized my father from the family photograph on his dashboard pass, and hauled our entire cocoa consignment to the depot free of charge, saving our family from financial ruin. It was the grateful stranger we had assisted.

Smiling at our good fortune, I realized that genuine charity is never lost. Truly, it pays to be kind to strangers.`
      }
    ]
  },
  partB_comprehension: {
    title: "Part B: Reading Comprehension",
    instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
    passageText: `True friendship is established on mutual support and unreserved loyalty whenever adversity strikes. In school environments, many individuals cultivate deep companionship that endures across several decades of adult life. The primary anchor that sustains such intimate bonds is the capacity to communicate openly without deceit and to endeavor actively to be each other's keeper. Conversely, the most toxic poison that dismantles human friendship is the emergence of mutual suspicion. This reality underscores the timeless traditional adage: "Suspicion is the bane of authentic friendship."

Human beings attend educational institutions not merely to socialize, but primarily to acquire foundational knowledge and technical competencies for gainful employment. Formal education refines human character, instills polished civic manners, and molds adolescents into responsible, productive citizens.

During our basic school days, Tono was notorious for being outside the good books of our teachers because of his unruly, insolent behavior. Initially, peers avoided his company because of his unpredictable violent temper. Worst of all, he refused to complete classroom assignments, skipped morning chores, and was a chronic latecomer.

With the passage of time, the headmaster subjected him to rigorous institutional discipline and counseling. Tono began to amend his conduct, respecting school regulations and realizing that diligent labor was the sole foundation for a bright future. Consequently, his academic performance improved by leaps and bounds.

Upon completing school, fortune separated our pathways. I secured an overseas scholarship for tertiary studies, remaining outside the country for twenty consecutive years. On my return, I visited our former school registry to collect my original basic certificate. While waiting at the administrative counter, I observed a dignified, middle-aged gentleman who had arrived on an identical mission. I could not recognize him initially, as the passage of time had eroded vivid memories of childhood acquaintances.

However, when our names were called from the official ledger, we discovered with astonishment that we were former classmates! Following a joyful conversation reflecting on our school days, Tono, now a prosperous logistics director, warmly invited me to partner with him as an executive director in his commercial enterprise.`,
    questions: [
      {
        subQuestion: "(a)",
        question: "I. State one primary factor that helps friends to stay close and sustain their relationship.\nII. How does authentic friendship get destroyed according to the passage?",
        answer: "I. The ability to communicate freely and openly among themselves (or endeavoring to be each other's keeper).\nII. Friendships get destroyed when friends become suspicious and harbor mistrust toward one another."
      },
      {
        subQuestion: "(b)",
        question: "State two principal reasons why people attend school as presented in the passage.",
        answer: "1. To acquire knowledge and skills for gainful employment.\n2. To acquire polished manners and character, becoming useful and responsible citizens."
      },
      {
        subQuestion: "(c)",
        question: "I. Why did classmates initially avoid Tono's company?\nII. State Tono's mission when he visited his former school twenty years later.",
        answer: "I. They avoided him because he was unruly, violent at times, refused to do his assignments, and was a chronic latecomer.\nII. His mission was to collect his original basic school certificate from the registry."
      },
      {
        subQuestion: "(d)",
        question: "Why could the writer not recognize Tono immediately upon seeing him at the office counter?",
        answer: "He could not recognize him because twenty years had elapsed, which had wiped off memories of his childhood classmate's physical appearance."
      },
      {
        subQuestion: "(e)",
        question: "Explain the meaning of the following idiomatic expressions as used in the passage:\nI. 'was not in the good books of the teachers'\nII. 'with the passage of time'\nIII. 'by leaps and bounds'",
        answer: "I. 'was not in the good books of the teachers' means was out of favor, disliked, and viewed with disapproval by the teachers.\nII. 'with the passage of time' means as time progressed, rolled by, or elapsed gradually.\nIII. 'by leaps and bounds' means rapidly, dramatically, and with tremendous progress."
      },
      {
        subQuestion: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. intimate\nII. adage\nIII. acquire\nIV. polished\nV. initially",
        answer: "I. intimate: close, bosom, trusted, dear.\nII. adage: proverb, saying, maxim, aphorism.\nIII. acquire: obtain, gain, attain, secure.\nIV. polished: refined, cultured, well-mannered, disciplined.\nV. initially: at first, originally, in the beginning."
      }
    ]
  },
  partC_literature: {
    title: "Part C: Literature in English (The Cockcrow Anthology)",
    instructions: "Answer all questions in this part based on the prescribed texts from Sackey J.A. and Darmani L. (comp.): The Cockcrow.",
    questions: [
      {
        sectionTitle: "CHARLES DICKENS: Oliver Twist",
        contextExtract: "\"Stop, thief!\" he shouted, thinking Oliver had robbed him. The poor boy found himself being chased by people and even dogs! Someone in the crowd, a young man with purple lips and red sores all over his hands, grabbed Oliver and knocked him down............",
        subItems: [
          {
            subQuestion: "5(a)",
            question: "Who is the character described in the crowd as 'a young man with purple lips and red sores all over his hands'?",
            answer: "A brutal, diseased chimney sweep / young apprentice ruffian in the street mob (or Bill Sikes' associate / street rogue)."
          },
          {
            subQuestion: "5(b)",
            question: "Why did the aggressive young man in the street mob want to harm and capture Oliver?",
            answer: "He wanted to join the chase for excitement, appear heroic before the crowd, and violently apprehend an alleged thief."
          },
          {
            subQuestion: "5(c)",
            question: "How did the benevolent Mr. Brownlow help Oliver Twist at the end of the narrative?",
            answer: "He officially adopted Oliver as his lawful son, cleared his name, secured his rightful inheritance, and provided him with a loving, peaceful home."
          }
        ]
      },
      {
        sectionTitle: "KEN SARO-WIWA: Home Sweet Home",
        contextExtract: "\"Bom, say, our young Miss has arrived heavily laden with all the good things of the earth. I should think Dakuna will soon float on a sea of wealth\".",
        subItems: [
          {
            subQuestion: "5(d)",
            question: "Who is referred to as 'our young Miss' in the story?",
            answer: "Duzia / the narrator, Miss Sira (who returned from the urban normal school / college to the village of Dakuna)."
          },
          {
            subQuestion: "5(e)",
            question: "Identify the literary device utilized in the expression: '... heavily laden with all the good things of the earth / float on a sea of wealth'.",
            answer: "Hyperbole (or metaphor)."
          }
        ]
      },
      {
        sectionTitle: "AMA ATA AIDOO: The Dilemma of a Ghost",
        contextExtract: "X: It was a couple of days ago that we met. What came out of the meeting is that we must come and ask you and your wife what is preventing you from giving your grandmother a great-grandchild before she leaves us.",
        subItems: [
          {
            subQuestion: "5(f)",
            question: "Which dramatic speaker is represented by 'X' in this excerpt?",
            answer: "Petu (the elder uncle and spokesman of the Odumna clan)."
          },
          {
            subQuestion: "5(g)",
            question: "According to Ato Yawson's private understanding, what was actually preventing him and his wife Eulalie from having children?",
            answer: "They had mutually decided to use modern birth control (contraception) to delay childbirth until they were financially and professionally ready."
          },
          {
            subQuestion: "5(h)",
            question: "The figure of speech utilized in the expression 'before she leaves us' to signify physical death is a/an ............",
            answer: "euphemism."
          }
        ]
      },
      {
        sectionTitle: "THERESA ENNIN: Makola",
        contextExtract: "Head bent, rags all around the upside down pan\nPicking her nose, shuffling her feet, oblivious to the bustle",
        subItems: [
          {
            subQuestion: "5(i)",
            question: "Identify one phrase from the extract that vivid brings out the theme of uncleanliness and squalor.",
            answer: "'rags all around' (or 'Picking her nose')."
          },
          {
            subQuestion: "5(j)",
            question: "The descriptive phrase 'Head bent, rags all around the upside down pan' appeals primarily to the reader's sense of ............",
            answer: "sight (visual imagery)."
          }
        ]
      }
    ]
  }
};

const flattenedPaper2Questions = [
  ...paper2Calibrated.partA_composition.questions.map((q) => ({
    id: `composition_${q.questionNumber}`,
    partLabel: `Part A (Question ${q.questionNumber}) - ${q.category}`,
    prompt: q.prompt,
    modelAnswer: q.modelAnswer,
    marks: 30
  })),
  {
    id: "comprehension_passage",
    partLabel: "Part B: Reading Comprehension",
    prompt: paper2Calibrated.partB_comprehension.passageText,
    passage: paper2Calibrated.partB_comprehension.passageText,
    subQuestions: paper2Calibrated.partB_comprehension.questions,
    marks: 30
  },
  ...paper2Calibrated.partC_literature.questions.map((sec, idx) => ({
    id: `literature_cockcrow_${idx + 1}`,
    partLabel: `Part C: Literature - ${sec.sectionTitle}`,
    contextExtract: sec.contextExtract || null,
    subItems: sec.subItems,
    marks: 10
  }))
];

async function seedBeceEnglish2019Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 2019 into Firestore...");

  // Key Balance Audit
  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  balancedPaper1.forEach((q) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log("Verified Key Balance across 30 Objective Items:", keyDist);

  const db = await getDb();
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2019");
  await docRef.set({
    year: 2019,
    title: "BECE English Language 2019 (Calibrated National Benchmark)",
    subjectId: "english",
    metadata: {
      isPastQuestion: true,
      standard: "NaCCA / WAEC BECE Standard",
      totalMarks: 100,
      totalDurationMinutes: 120,
      paper1Count: balancedPaper1.length,
      optionsBalanced: true,
      unplagiarizedPedagogicalAdaptation: true,
      hasCockcrowLiterature: true,
      passageFirstLayout: false,
      updatedAt: new Date()
    },
    questions: balancedPaper1,
    paper1: {
      title: "Paper 1: Objective Test (Lexis and Structure)",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      sections: {
        sectionA_lexis_and_structure: {
          title: "Section A: Lexis and Structure",
          questionRange: "Questions 1 to 15",
          questions: balancedPaper1.slice(0, 15)
        },
        sectionB_synonyms: {
          title: "Section B: Synonyms (Nearest in Meaning)",
          questionRange: "Questions 16 to 20",
          questions: balancedPaper1.slice(15, 20)
        },
        sectionC_idioms: {
          title: "Section C: Idiomatic Expressions",
          questionRange: "Questions 21 to 25",
          questions: balancedPaper1.slice(20, 25)
        },
        sectionD_antonyms: {
          title: "Section D: Antonyms (Opposite in Meaning)",
          questionRange: "Questions 26 to 30",
          questions: balancedPaper1.slice(25, 30)
        }
      },
      questions: balancedPaper1,
      allQuestions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Written Essay, Reading Comprehension, and Literature",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Fully Rewritten, Clean-Room BECE English 2019 successfully seeded into Firestore!");
}

seedBeceEnglish2019Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2019:", err);
    process.exit(1);
  });
