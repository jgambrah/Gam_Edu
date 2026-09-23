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
  passageTitle?: string;
  passageText?: string;
  passage?: string;
}

// =========================================================================
// ISOMORPHIC PASSAGE I: AMMA'S SATURDAY MALADY (CALIBRATED ORIGINAL)
// =========================================================================
const passage1Title = "Passage I: Amma's Saturday Malady";
const passage1Text = `"Amma, Amma, rise from your mat and sweep the compound clean!" MaaTee hollered from the outdoor kitchen. However, Amma had privately resolved that she would not lift a broom that Saturday morning.

"What excuse can I invent to evade these tedious domestic chores?" Amma whispered to herself under the blanket. "I shall pretend to be gripped by a fever; then Mama cannot possibly compel me to scrub the verandas. This is an ingenious scheme. I am not so daft after all," she concluded with a quiet chuckle.

When Amma staggered into the kitchen groaning about a blinding headache and body chills, MaaTee suspended her dough-kneading immediately, seized with maternal panic, and ordered her daughter to get dressed for the municipal clinic. Poor Amma—her clever plot had completely backfired!

Throughout the trek to the clinic, Amma prayed fervently that the consulting physician would be off duty, but fortune deserted her that morning. The doctor examined Amma thoroughly, checked her temperature, and found her as fit as a fiddle. Shrewd and experienced, he deduced instantly that the young girl had feigned illness simply to dodge her routine Saturday morning sweeping.

"I am truly sorry, MaaTee," the doctor remarked with a deadpan expression. "Amma is critically ill. Escort her immediately to the injection room for three deep, painful injections. They will..."

Before the physician could finish his sentence, Amma shot out of the consulting room with the speed of an antelope, sprinting down the hospital lane without stopping until she dashed into her family house. The doctor smiled knowingly at MaaTee and burst into hearty laughter, telling the relieved mother to return home. By the time MaaTee arrived back at the compound, Amma had swept every corner, washed the breakfast dishes, and fetched water from the standpipe.`;

const passage1QuestionsRaw = [
  {
    number: 1,
    prompt: "Why did MaaTee suspend all her domestic kitchen chores in Passage I?",
    options: [
      "She suspected that Amma was fabricating a deliberate falsehood",
      "She was deeply annoyed by Amma's rebellious conduct",
      "She was eager to take Amma to the hospital for medical treatment",
      "Amma pleaded with her to visit the consulting clinic"
    ],
    correctAnswer: "She was eager to take Amma to the hospital for medical treatment",
    hint: "Reread paragraph three: when Amma reported a headache, MaaTee stopped everything to get her ready for the hospital.",
    workedSolution: "MaaTee dropped her work because she was genuinely concerned about her daughter's health and wanted to rush her to the hospital immediately.",
    points: 1
  },
  {
    number: 2,
    prompt: "In Passage I, the word 'daft' in 'I am not so daft after all' means ............",
    options: [
      "disobedient and stubborn",
      "admirable and virtuous",
      "strange and queer",
      "unintelligent, foolish, or silly"
    ],
    correctAnswer: "unintelligent, foolish, or silly",
    hint: "'Daft' means silly, foolish, or lacking intelligence.",
    workedSolution: "'Daft' is an informal adjective meaning foolish, stupid, or silly; 'unintelligent, foolish, or silly' is its direct meaning.",
    points: 1
  },
  {
    number: 3,
    prompt: "What does the passage establish regarding Amma's true physical condition?",
    options: [
      "She was suffering from an acute medical ailment",
      "She was genuinely healthy and not sick at all",
      "She enjoyed performing domestic household chores",
      "She was allergic to the morning sweepings"
    ],
    correctAnswer: "She was genuinely healthy and not sick at all",
    hint: "The doctor examined her and found her 'as fit as a fiddle'—she was feigning illness.",
    workedSolution: "The clinical examination revealed that Amma was 'as fit as a fiddle'; she was entirely healthy and merely pretending to be sick.",
    points: 1
  },
  {
    number: 4,
    prompt: "From the narrative development in Passage I, MaaTee is demonstrated to be a ............",
    options: [
      "harsh and demanding parent",
      "deeply loving and caring mother",
      "physically weak and fragile woman",
      "careless and indifferent guardian"
    ],
    correctAnswer: "deeply loving and caring mother",
    hint: "She dropped all her work immediately to take her child to the clinic upon hearing she had a headache.",
    workedSolution: "MaaTee's immediate willingness to suspend her work and rush Amma to the hospital proves that she was a deeply affectionate and caring mother.",
    points: 1
  },
  {
    number: 5,
    prompt: "Why did Amma bolt out of the consulting room with lightning speed?",
    options: [
      "She was terrified of receiving three painful injections",
      "She remembered that her chores at home were unfinished",
      "She was struck by sudden remorse for her mother",
      "She disliked the doctor's consulting room"
    ],
    correctAnswer: "She was terrified of receiving three painful injections",
    hint: "The moment the doctor prescribed three injections, she bolted to escape the needle.",
    workedSolution: "Amma fled in terror because she was deathly afraid of the prescribed injections and preferred doing chores to getting injected.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: GRANDPA'S CENTENNIAL WISDOM (CALIBRATED ORIGINAL)
// =========================================================================
const passage2Title = "Passage II: Grandpa's Centennial Wisdom";
const passage2Text = `Grandpa is a remarkably robust centenarian. Even at one hundred years of age, his eyesight is as clear as a child's and his intellectual memory remains razor-sharp. We have frequently marveled at what secret regimen has preserved his vigor over such a vast span of time. "I live by a simple philosophical theory of life," is the smiling reply he offers to anyone who inquires.

Grandpa's theory is, in truth, elementary when he explains its tenets. He speaks first of maintaining an unshakeable, joyful attitude toward daily existence. He insists that authentic joy generates enthusiasm and an inspiring urge to uplift others. He never turns away anyone seeking assistance, even though Grandpa could never be classified as a wealthy man.

Furthermore, Grandpa maintains that human society acts as an impartial mirror. The mirror merely reflects the exact image presented before it. Consequently, if we treat others with malice and cruelty, the world will reflect hostility back to us; but if we walk in honesty and benevolence, we shall live without suspicion and earn the goodwill of our neighbors.

The core principle that Grandpa treasures most dearly is his devotion to truth. He argues that speaking the truth liberates a human being from mental tension, anxiety, and guilt. "Let your 'no' remain 'no'," he cautions whenever he discovers any of us attempting to spin a falsehood to avoid trouble. He reminds us that once a person tells a single lie, they are compelled to invent a dozen more lies to cover the initial deceit. Truth, by contrast, is eternal and never alters.

Grandpa never concludes his counsel without rolling his bright eyes excitedly and admonishing us to be true to our inner conscience so that we can never be false to our fellow men.`;

const passage2QuestionsRaw = [
  {
    number: 6,
    prompt: "Which of the following descriptions is factually true of Grandpa according to Passage II?",
    options: [
      "He is a lonely, isolated recluse",
      "He is a bedridden, sickly invalid",
      "He is an exceptionally aged centenarian",
      "He is an affluent merchant possessing vast gold"
    ],
    correctAnswer: "He is an exceptionally aged centenarian",
    hint: "Paragraph one explicitly introduces him as a 'robust centenarian' (someone who is one hundred years old).",
    workedSolution: "The opening sentence identifies Grandpa as a centenarian (a person who is 100 years of age or older), confirming he is an exceptionally old man.",
    points: 1
  },
  {
    number: 7,
    prompt: "How do relatives and neighbors generally regard Grandpa in Passage II?",
    options: [
      "They fear his stern disciplinary reprimands",
      "They deeply admire and respect his wisdom and longevity",
      "They resent his philosophical lectures",
      "They tolerate his eccentric habits with annoyance"
    ],
    correctAnswer: "They deeply admire and respect his wisdom and longevity",
    hint: "The narrator notes they marvel at him, seek his advice, and hold him in high regard.",
    workedSolution: "Grandpa is an object of widespread veneration, wonder, and admiration due to his enduring health, generosity, and wisdom.",
    points: 1
  },
  {
    number: 8,
    prompt: "In Passage II, the phrase 'devoid of' in 'live a free life devoid of stress' means ............",
    options: [
      "contrary to",
      "completely free from or without",
      "in spite of",
      "in opposition to"
    ],
    correctAnswer: "completely free from or without",
    hint: "'Devoid of' means entirely lacking or free from something.",
    workedSolution: "'Devoid of' means entirely lacking, empty of, or 'without'; 'completely free from or without' is its direct meaning.",
    points: 1
  },
  {
    number: 9,
    prompt: "According to the analogy in Passage II, human society functions like a mirror because it ............",
    options: [
      "distorts the reality of human intentions",
      "magnifies personal faults and weaknesses",
      "faithfully reproduces and reflects what a person puts into it",
      "hides moral flaws beneath a shiny surface"
    ],
    correctAnswer: "faithfully reproduces and reflects what a person puts into it",
    hint: "Paragraph three notes: 'The mirror merely reflects what is before it. So if we are wicked...'",
    workedSolution: "The author uses the mirror analogy to show that society reflects back whatever behavior, kindness, or malice we project into it.",
    points: 1
  },
  {
    number: 10,
    prompt: "Why does Grandpa urge his grandchildren to be true to themselves in Passage II?",
    options: [
      "To amass material riches in the city",
      "To avoid living deceitful lives and telling lies to others",
      "To ensure they outlive their contemporaries",
      "To prove that they are mature adults"
    ],
    correctAnswer: "To avoid living deceitful lives and telling lies to others",
    hint: "Look at the concluding sentence: 'be true to ourselves so that we can't be false to others.'",
    workedSolution: "Grandpa emphasizes inner truthfulness so that one avoids hypocrisy, deceit, and falsehood toward others.",
    points: 1
  }
];

// =========================================================================
// GENERAL SECTIONS B - E: SYNONYMS, IDIOMS, ANTONYMS, STRUCTURE
// =========================================================================
const generalQuestionsRaw = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (11 - 15) ---
  {
    number: 11,
    prompt: "The basic school candidates are exceptionally skillful at computer programming.\nChoose the word nearest in meaning to 'skillful'.",
    options: ["diligent", "enthusiastic", "expert", "eager"],
    correctAnswer: "expert",
    hint: "Possessing high-level competence, proficiency, or dexterity.",
    workedSolution: "'Skillful' means having or showing the knowledge, ability, or training to do something well; 'expert' is its direct synonym.",
    points: 1
  },
  {
    number: 12,
    prompt: "The benefactor who donated new science equipment requested to remain anonymous.\nChoose the word nearest in meaning to 'anonymous'.",
    options: ["humble", "unknown", "quiet", "unheralded"],
    correctAnswer: "unknown",
    hint: "Having no revealed name; unidentified.",
    workedSolution: "'Anonymous' means not identified by name, nameless, or 'unknown'.",
    points: 1
  },
  {
    number: 13,
    prompt: "Mr. Osei is the most popular community leader in our district.\nChoose the word nearest in meaning to 'popular'.",
    options: ["respected", "liked", "wealthy", "influential"],
    correctAnswer: "liked",
    hint: "Liked, admired, or favored by many people.",
    workedSolution: "'Popular' means widely admired, approved, or 'liked' by many people.",
    points: 1
  },
  {
    number: 14,
    prompt: "The annual general meeting of the Parent-Teacher Association has been postponed.\nChoose the word nearest in meaning to 'postponed'.",
    options: ["delayed", "adjourned", "cancelled", "convened"],
    correctAnswer: "delayed",
    hint: "Put off to a later date or deferred.",
    workedSolution: "'Postponed' means arranged to take place at a time later than originally scheduled; 'delayed' (or put off) is its direct synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "While Kwesi is modest, his elder brother is thoroughly arrogant.\nChoose the word nearest in meaning to 'arrogant'.",
    options: ["haughty", "proud", "defiant", "boisterous"],
    correctAnswer: "proud",
    hint: "Having or revealing an exaggerated sense of one's own importance or abilities.",
    workedSolution: "'Arrogant' means having an exaggerated sense of one's superiority; 'proud' (or haughty) is its closest synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "While my uncle's saloon car was expensive, my father bought his for a song. This means my father's car was ............",
    options: [
      "purchased as a brand-new vehicle",
      "bought very cheaply at a bargain price",
      "presented to him as a choral award",
      "repaired by a mechanical technician"
    ],
    correctAnswer: "bought very cheaply at a bargain price",
    hint: "To buy something for a song means to purchase it for very little money.",
    workedSolution: "The idiom 'for a song' means very cheaply or for an extraordinarily low price.",
    points: 1
  },
  {
    number: 17,
    prompt: "Fatimah cautioned her brother that his friend had a loose tongue. This means his friend ............",
    options: [
      "could not keep secrets confidential",
      "spoke with a noticeable stammer",
      "talked with a very loud voice",
      "habitually avoided eye contact"
    ],
    correctAnswer: "could not keep secrets confidential",
    hint: "Habitually indiscreet in speech; unable to keep confidential matters secret.",
    workedSolution: "The idiom 'to have a loose tongue' means to be indiscreet and unable to keep secrets from leaking to others.",
    points: 1
  },
  {
    number: 18,
    prompt: "Adzo's chronic dishonesty and insolence make her the black sheep of the family. This means Adzo is ............",
    options: [
      "a source of shame and disgrace to her relatives",
      "the youngest child in the household",
      "the most rebellious pastoral herdsman",
      "a child who avoids manual chores"
    ],
    correctAnswer: "a source of shame and disgrace to her relatives",
    hint: "A disreputable or disgraced member of a family or group.",
    workedSolution: "The idiom 'the black sheep' refers to a member of a family or group who is considered a disgrace, embarrassment, or failure.",
    points: 1
  },
  {
    number: 19,
    prompt: "When I traveled to Accra, Mr. Asah put me up for the night. This means Mr. Asah ............",
    options: [
      "welcomed me at the bus terminal",
      "entertained me lavishly with beverages",
      "provided me with a bed and overnight lodging",
      "reprimanded me for visiting unannounced"
    ],
    correctAnswer: "provided me with a bed and overnight lodging",
    hint: "To provide someone with temporary overnight accommodation.",
    workedSolution: "The phrasal verb 'to put someone up' means to provide them with temporary overnight lodging or accommodation.",
    points: 1
  },
  {
    number: 20,
    prompt: "In the national budget allocation, the Education Ministry takes the lion's share of the revenues. This means the ministry ............",
    options: [
      "utilizes all the treasury funds completely",
      "receives the largest portion or share of the money",
      "is allocated the smallest fraction of resources",
      "borrows funds from commercial banks"
    ],
    correctAnswer: "receives the largest portion or share of the money",
    hint: "The major, largest, or disproportionately greatest part of something.",
    workedSolution: "The idiom 'the lion's share' refers to the largest, predominant, or greatest portion of something being distributed.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "The morning committee session was fruitful, but the afternoon debate proved completely ...... .\nChoose the word most nearly opposite in meaning to 'fruitful'.",
    options: ["lengthy", "useless", "hasty", "turbulent"],
    correctAnswer: "useless",
    hint: "'Fruitful' means productive and yielding good results. What word denotes unproductive or of no value?",
    workedSolution: "'Fruitful' means productive or successful. Its direct opposite is 'useless' (unproductive or futile).",
    points: 1
  },
  {
    number: 22,
    prompt: "Mensa complained that de-husking the maize was tedious, while roasting the cobs was remarkably ...... .\nChoose the word most nearly opposite in meaning to 'tedious'.",
    options: ["laborious", "monotonous", "easy", "complex"],
    correctAnswer: "easy",
    hint: "'Tedious' means tiresome, wearisome, and burdensome. What word denotes effortless and simple?",
    workedSolution: "'Tedious' describes a tiresome, demanding, or boring task. Its direct practical antonym is 'easy' (or simple/effortless).",
    points: 1
  },
  {
    number: 23,
    prompt: "While incoming visitors rushed toward the main entrance, departing guests moved toward the ...... .\nChoose the word most nearly opposite in meaning to 'entrance'.",
    options: ["passageway", "gateway", "exit", "threshold"],
    correctAnswer: "exit",
    hint: "'Entrance' is the way into a building. What word denotes the way out?",
    workedSolution: "'Entrance' refers to the point of entry or opening into a building. Its direct spatial antonym is 'exit' (the way out).",
    points: 1
  },
  {
    number: 24,
    prompt: "The magistrate pronounced the first suspect guilty, but declared his companion ...... .\nChoose the word most nearly opposite in meaning to 'guilty'.",
    options: ["ignorant", "unaware", "innocent", "forgiven"],
    correctAnswer: "innocent",
    hint: "'Guilty' means convicted of a crime. What word denotes free from guilt, blameless, or not guilty?",
    workedSolution: "'Guilty' means responsible for a criminal wrong. Its direct judicial antonym is 'innocent' (free from guilt).",
    points: 1
  },
  {
    number: 25,
    prompt: "Mrs. Addo acted as the hostess for the cultural gala, while the regional minister was the guest of honor.\nChoose the word most nearly opposite in meaning to 'hostess'.",
    options: ["guest", "patron", "speaker", "organizer"],
    correctAnswer: "guest",
    hint: "A 'hostess' welcomes and entertains people. What word denotes the person who is invited and entertained?",
    workedSolution: "'Hostess' refers to a person who entertains or receives visitors. Its direct reciprocal antonym is 'guest' (one who is entertained).",
    points: 1
  },

  // --- SECTION E: STRUCTURE & QUESTION TAGS (26 - 40) ---
  {
    number: 26,
    prompt: "Mary and Comfort are ...... arriving by the evening train from Takoradi.",
    options: ["both", "all", "either", "neither"],
    correctAnswer: "both",
    hint: "Use the dual pronoun/determiner referring to two persons simultaneously in an affirmative clause.",
    workedSolution: "When referring to two specific individuals ('Mary and Comfort') acting affirmatively together, standard English requires 'both'. 'All' applies to three or more.",
    points: 1
  },
  {
    number: 27,
    prompt: "Abukari prefers playing football ...... swimming in the lagoon.",
    options: ["by", "for", "than", "to"],
    correctAnswer: "to",
    hint: "The comparative verb 'prefer' takes the preposition 'to', never 'than'.",
    workedSolution: "In standard English verb grammar, 'prefer' takes the preposition 'to' when comparing two activities: 'prefers playing football to swimming'.",
    points: 1
  },
  {
    number: 28,
    prompt: "All ...... the witness stated under oath is completely true.",
    options: ["what", "that", "which", "as"],
    correctAnswer: "that",
    hint: "Following the universal quantifier 'all' referring to inanimate speech or things, standard grammar requires the relative pronoun 'that'.",
    workedSolution: "When the antecedent is 'all', standard grammar requires the relative pronoun 'that': 'All that you are saying is true'.",
    points: 1
  },
  {
    number: 29,
    prompt: "The supervisor remarked that the apprentice was ...... slow for his liking.",
    options: ["much", "much slow", "slower", "too"],
    correctAnswer: "too",
    hint: "Use the degree adverb expressing an excessive degree beyond what is desirable: 'too + adjective'.",
    workedSolution: "The degree modifier 'too' indicates an excessive or undesirable quality beyond an acceptable limit: 'too slow for his liking'.",
    points: 1
  },
  {
    number: 30,
    prompt: "Panyin is ...... taller than his twin brother, Kakra.",
    options: ["more", "much", "so", "too"],
    correctAnswer: "much",
    hint: "Comparative adjectives with '-er' are intensified by 'much' or 'far', never by 'more' or 'too'.",
    workedSolution: "To intensify a comparative adjective ('taller'), English uses 'much' or 'far' ('much taller than'). Double comparatives like *more taller are ungrammatical.",
    points: 1
  },
  {
    number: 31,
    prompt: "The stray puppy has been missing from our compound ...... last Saturday.",
    options: ["since", "from", "until", "for"],
    correctAnswer: "since",
    hint: "Use 'since' with the Present Perfect tense to denote a specific starting point in past time.",
    workedSolution: "The preposition 'since' indicates a specific starting point in the past from which an ongoing action continues into the present: 'since Saturday'.",
    points: 1
  },
  {
    number: 32,
    prompt: "\"Akua, could you please ...... me your English textbook for the weekend?\"",
    options: ["lend", "borrow", "afford", "buy"],
    correctAnswer: "lend",
    hint: "'Lend' means to give something temporarily to someone; 'borrow' means to receive something temporarily from someone.",
    workedSolution: "'Lend' means to grant temporary possession of an item to another person. ('Borrow' means to take or receive temporarily). The correct request is 'lend me your book'.",
    points: 1
  },
  {
    number: 33,
    prompt: "The master builder insisted ...... painting the classroom walls himself.",
    options: ["in", "at", "on", "with"],
    correctAnswer: "on",
    hint: "Identify the preposition that regularly collocates with the verb 'insist'.",
    workedSolution: "In standard English grammar, the verb 'insist' takes the preposition 'on' followed by a gerund: 'insisted on painting'.",
    points: 1
  },
  {
    number: 34,
    prompt: "This dictionary belongs to me, and that notebook on the desk is ......",
    options: ["your", "yours'", "your's", "yours"],
    correctAnswer: "yours",
    hint: "Absolute possessive pronouns never take an apostrophe.",
    workedSolution: "'Yours' is an absolute possessive pronoun and never takes an apostrophe. Forms like 'your's' or 'yours'' are ungrammatical.",
    points: 1
  },
  {
    number: 35,
    prompt: "If Asi had traveled to Beseasi yesterday, she ...... her grandmother.",
    options: [
      "would meet",
      "would have met",
      "will meet",
      "had met"
    ],
    correctAnswer: "would have met",
    hint: "Third Conditional: 'had traveled' in the if-clause requires 'would have + past participle' in the main clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the main clause requires 'would have + past participle': 'would have met'.",
    points: 1
  },
  {
    number: 36,
    prompt: "You had a massive portion of fufu for lunch, ......?",
    options: ["didn't you", "don't you", "haven't you", "isn't it"],
    correctAnswer: "didn't you",
    hint: "The main verb 'had' is used here as a lexical verb in the simple past tense, requiring a question tag formed with 'did'.",
    workedSolution: "When 'had' is the main lexical verb in the simple past ('had too much to eat'), its tag is formed with the past auxiliary 'did': 'didn't you?'.",
    points: 1
  },
  {
    number: 37,
    prompt: "He knocked and entered the office while I ...... my midday meal.",
    options: ["am having", "had", "have", "was having"],
    correctAnswer: "was having",
    hint: "Past Continuous tense expressing an ongoing background action in the past interrupted by a sudden past simple event ('entered').",
    workedSolution: "An ongoing background activity in the past introduced by 'while' takes the Past Continuous tense: 'was having'.",
    points: 1
  },
  {
    number: 38,
    prompt: "The recalcitrant prisoner would neither speak ...... eat his breakfast.",
    options: ["yet", "but", "or", "nor"],
    correctAnswer: "nor",
    hint: "Identify the negative correlative conjunction that pairs with 'neither'.",
    workedSolution: "In correlative coordination, 'neither' pairs strictly with 'nor' ('neither talk nor eat'). 'Either' pairs with 'or'.",
    points: 1
  },
  {
    number: 39,
    prompt: "Afote was generous enough to give his classmate ...... of his bread.",
    options: ["little", "few", "some", "any"],
    correctAnswer: "some",
    hint: "Use an affirmative partitive determiner with non-count nouns ('bread') expressing an unspecified positive quantity.",
    workedSolution: "In positive affirmative declarative statements, 'some' is used to denote an unspecified positive quantity of a mass noun: 'some of his bread'.",
    points: 1
  },
  {
    number: 40,
    prompt: "John and Anita have been companions since childhood; they have always loved ......",
    options: ["each other", "one another", "themselves", "each one"],
    correctAnswer: "each other",
    hint: "Reciprocal pronoun used when an action is mutually exchanged between exactly two individuals.",
    workedSolution: "'Each other' is the reciprocal pronoun used when referring to two persons ('John and Anita'). 'One another' is preferred for three or more.",
    points: 1
  }
];

// Combine raw items
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

const assignedTargetIndices = seedShuffle(targetKeys, 200602);

const balancedPaper1: QuestionItem[] = allRawQuestions.map((q, idx) => {
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

  let passageTitle: string | undefined = undefined;
  let passageText: string | undefined = undefined;
  let passage: string | undefined = undefined;

  if (idx < 5) {
    passageTitle = passage1Title;
    passageText = passage1Text;
    passage = passage1Text;
  } else if (idx < 10) {
    passageTitle = passage2Title;
    passageText = passage2Text;
    passage = passage2Text;
  }

  const item: QuestionItem = {
    number: q.number,
    prompt: q.prompt,
    options: options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: q.points
  };

  if (passageTitle) {
    item.passageTitle = passageTitle;
    item.passageText = passageText;
    item.passage = passage;
  }

  return item;
});

// Partition Questions for Passage-First UI Rendering
const passage1Items = balancedPaper1.slice(0, 5);
const passage2Items = balancedPaper1.slice(5, 10);
const remainingItems = balancedPaper1.slice(10);

// =========================================================================
// PAPER 2: ESSAY WRITING (COMPOSITION) - FULL ORIGINAL SUITE
// =========================================================================
const paper2Calibrated = {
  sectionA_essay: {
    title: "Part A: Essay Writing",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Formal Letter",
        prompt: "Write a letter to your local Assemblyman suggesting three practical ways in which students and community youth can actively help improve environmental sanitation in your electoral area.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Bekwai, Ashanti Region
12th May, 2006

The Assemblyman
Bekwai Central Electoral Area
Municipal Assembly, Bekwai

Dear Sir,

PROPOSALS FOR YOUTH INVOLVEMENT IN IMPROVING COMMUNITY SANITATION

I respectfully write to commend your exemplary leadership in our electoral area and to present three practical initiatives through which basic school students and community youth can actively partner with the local assembly to eradicate filth and enhance sanitation.

First and foremost, our youth association can spearhead bi-weekly communal clean-up exercises across all residential zones. Armed with rakes, brooms, and wheelbarrows, students can desilt choked open gutters, clear overgrown weeds around public standpipes, and sweep commercial lorry terminals. Regular clearing of drainage ditches prevents stagnant wastewater from breeding disease-carrying mosquitoes, dramatically reducing the incidence of malaria in our neighborhood.

Secondly, students can establish a Community Waste Segregation and Anti-Littering Volunteer Campaign. In collaboration with local environmental health officers, youth volunteers can go door-to-door educating residents and market women on separating degradable organic waste from non-biodegradable plastics and polythene bags. Furthermore, we can fabricate modest wooden dustbins and place them along market avenues to discourage indiscriminate littering.

Finally, we propose the formation of an Environmental Sanitation Monitoring Club in our basic schools. This youth task force will monitor illegal dumping sites and report recalcitrant residents who dispose of domestic waste into streams to the Town Development Committee for corrective sanctions.

We are ready to mobilize our peers to transform our community into a beacon of cleanliness. We look forward to discussing these proposals with you.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Youth Secretary)`
      },
      {
        questionNumber: "2",
        category: "Informal Letter",
        prompt: "Write a letter to your elder brother who is working or studying in another region of your country, informing him about the latest interesting news, family milestones, and community developments at home.",
        modelAnswer: `Presbyterian Junior Secondary School
P. O. Box 80
Begoro, Eastern Region
18th October, 2006

Dear Brother Kwaku,

I hope this letter finds you in fine health, peace of mind, and excelling in your university studies at the University of Cape Coast. Everyone at home is in good health, and Mother always mentions your name in her evening prayers. I am writing to update you on the exciting developments and latest news in our family and community.

The biggest family news is that our elder sister, Akosua, gave birth to a bouncy baby boy last Wednesday at the Begoro District Hospital. Both mother and newborn are doing wonderfully, and our compound has been filled with joyful relatives bringing gifts of baby clothes and white calico. Father has announced that the traditional outdooring and naming ceremony will take place next Saturday, and we are praying that your weekend schedule permits you to attend.

In addition, our father's minor cocoa harvest yielded exceptional returns this season. With the proceeds, he has successfully roofed our new four-room family annex and connected our house to the national electricity grid. You will no longer need to study with kerosene hurricane lamps when you return home for the vacation!

In the wider community, the District Assembly has finally completed the asphalt tarring of our main township road and installed solar-powered streetlights along the market boulevard, completely transforming Begoro at night.

We miss your lively humor at the dinner table. Please write back soon and let us know when to expect your visit.

Your loving brother,
[Signature]
Emmanuel Addo`
      },
      {
        questionNumber: "3",
        category: "Debate Speech",
        prompt: "You are the principal speaker in an inter-schools debate competition on the topic: \"Television is doing more harm than good to students.\" Write your speech for or against the motion.",
        modelAnswer: `AGAINST THE MOTION: "TELEVISION IS DOING MORE HARM THAN GOOD TO STUDENTS"

Mr. Chairman, Distinguished Panel of Judges, Impartial Timekeeper, Worthy Opponents, and Fellow Students:

I stand firmly before you this afternoon to vehemently oppose the motion that: "Television is doing more harm than good to students." While detractors routinely portray television as an intellectual distraction, an objective analysis demonstrates that modern television broadcasting is an indispensable medium of education, enlightenment, and global awareness.

First and foremost, television serves as a powerful audio-visual classroom that simplifies complex academic concepts. Visual learning significantly enhances comprehension and memory retention. Through dedicated educational channels and documentary broadcasts like the National Science and Maths Quiz, National Geographic, and Discovery Channel, students observe practical scientific experiments, historical recreations, and geographic phenomena that under-resourced school laboratories cannot provide. Abstract textbook formulas are transformed into living realities, inspiring young learners to pursue careers in medicine, aviation, and engineering.

Secondly, television cultivates civic consciousness and global literacy. Watching national and international news broadcasts keeps students informed about contemporary geopolitical events, environmental conservation, and social policies. This broadens their worldview and equips them with critical insights that enhance their performance in English comprehension and Social Studies examinations.

Furthermore, television is a versatile teacher of language and oratorical eloquence. Listening to professional broadcasters and debate panels sharpens students' pronunciation, expands their vocabulary, and improves their spoken English.

In conclusion, television is merely a technological tool; the fault lies not in the medium, but in undisciplined viewing habits. When guided by responsible parental supervision, television is a beacon of intellectual enlightenment. I urge you all to resoundingly reject the motion.

Thank you.`
      },
      {
        questionNumber: "4",
        category: "Descriptive / Nomination Essay",
        prompt: "Your Parent-Teacher Association (PTA) has instituted an annual Best Teacher Award Scheme in your school. Which of your teachers would you nominate for the award and why? Write an essay stating at least three compelling reasons for your choice.",
        modelAnswer: `NOMINATION OF MR. EMMANUEL OSEI FOR THE ANNUAL BEST TEACHER AWARD

I enthusiastically nominate our Integrated Science master, Mr. Emmanuel Osei, for the prestigious Best Teacher Award instituted by our Parent-Teacher Association. In an academic institution blessed with dedicated educators, Mr. Osei stands out as an exceptional teacher, moral mentor, and selfless community builder who has revolutionized learning in our school.

First and foremost, Mr. Osei exhibits unrivaled pedagogical excellence and innovative teaching methods. Before his arrival, science was widely feared as a difficult, abstract subject. Mr. Osei transformed our classroom into an active laboratory. In the absence of a modern science complex, he uses his personal financial resources to construct creative improvisational teaching models from local clay, bamboo, and recycled materials. He organizes weekly field trips around the school environment to observe ecological systems, making challenging topics like photosynthesis and genetics simple and enjoyable. Under his guidance, our school achieved a one hundred percent pass rate in Integrated Science in the BECE for three consecutive years.

Secondly, Mr. Osei demonstrates boundless selflessness and pastoral care for struggling learners. He voluntarily sacrifices his free afternoons and Saturday mornings to organize free remedial tutorials for academically weak pupils. Furthermore, he quietly purchases textbooks and mathematical sets for indigent orphans whose parents cannot afford school supplies, ensuring that poverty never truncates a child's education.

Finally, his personal integrity, punctuality, and humility inspire us to cultivate upright moral character. He treats every student with fatherly dignity and never uses abusive language.

Mr. Osei is not merely an instructor; he is a beacon of hope and an embodiment of true teaching nobility. He deserves this honor unconditionally.`
      }
    ]
  }
};

async function seedBeceEnglish2006Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 2006 into Firestore...");

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
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2006");
  await docRef.set({
    year: 2006,
    title: "BECE English Language 2006 (Calibrated National Benchmark)",
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
    questions: balancedPaper1,
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      passages: [
        {
          id: "passage_1",
          title: passage1Title,
          text: passage1Text,
          questionRange: "Questions 1 to 5",
          questions: passage1Items
        },
        {
          id: "passage_2",
          title: passage2Title,
          text: passage2Text,
          questionRange: "Questions 6 to 10",
          questions: passage2Items
        }
      ],
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: passage1Title,
          text: passage1Text,
          questionRange: "Questions 1 to 5",
          questions: passage1Items
        },
        passage2: {
          passageTitle: passage2Title,
          text: passage2Text,
          questionRange: "Questions 6 to 10",
          questions: passage2Items
        }
      },
      sectionB_to_E: {
        title: "Sections B - E: Synonyms, Idioms, Antonyms and Structure",
        questionRange: "Questions 11 to 40",
        questions: remainingItems
      },
      questions: balancedPaper1,
      allQuestions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Essay Writing (Composition)",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: paper2Calibrated.sectionA_essay.questions
    }
  }, { merge: true });

  console.log("✅ Fully Rewritten, Clean-Room BECE English 2006 successfully seeded into Firestore!");
}

seedBeceEnglish2006Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2006:", err);
    process.exit(1);
  });
