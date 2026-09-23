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
// ISOMORPHIC PASSAGE I: MR. ANTWI'S CLASSROOM DETECTION (CALIBRATED ORIGINAL)
// =========================================================================
const passage1Text = `The study hall was peaceful when suddenly Mr. Antwi caught a muffled snicker echoing from the back row. Over the past fortnight, he had observed that whispering and secret giggling had reared their ugly heads during afternoon study hours. This afternoon, he was firmly resolved to unearth the origin of this unruly conduct and discipline the culprits.

Feigning that he had heard nothing, he walked deliberately toward the wooden chalkboard as though intending to sketch a biology diagram, but in truth setting a clever ambush. The moment the whispering and muffled laughter flared up once more, he spun around on his heels and caught three senior boys in the back row huddled together. His turn was so swift that he caught them red-handed. He even spotted one boy hastily slipping a glossy booklet to his desk-mate.

Moving with the speed of an athlete, Mr. Antwi crossed the room, commanded the trio to stand at attention, and immediately conducted a physical search to seize the booklet. Astute as the master was, the boys proved equally resourceful, for the youth seated adjacent to the window had slipped the item through the open louvers onto the veranda flowerbed. Following a fruitless search of their pockets and desks, Mr. Antwi was on the verge of relenting.

Perhaps it had been an ordinary notebook he had seen from afar. Yet, his two decades of pedagogical experience reminded him that resourceful students frequently dispose of incriminating evidence through open windows. Leaning across the windowsill, lo and behold, there rested the unauthorized booklet among the hibiscus bushes! He retrieved it, examined the pages, and discovered that it was filled with vulgar cartoons. Mr. Antwi fumed.`;

const passage1Questions = [
  {
    number: 1,
    prompt: "According to Passage I, what was Mr. Antwi's principal objective when he heard the snickering in the hall?",
    options: [
      "To unmask the unruly pupils and administer disciplinary sanctions",
      "To draw an elaborate diagram on the wooden chalkboard",
      "To severely reprimand the entire class for general noise",
      "To have a private conversation with the three senior boys"
    ],
    correctAnswer: "To unmask the unruly pupils and administer disciplinary sanctions",
    hint: "Reread paragraph one: he was resolved to discover the cause of the naughty behavior and discipline the culprits.",
    workedSolution: "The narrative notes that the teacher was determined to track down the troublemakers who had disrupted the class and punish them.",
    points: 1
  },
  {
    number: 2,
    prompt: "In Passage I, what was the underlying cause of the students' secret giggling and whispering?",
    options: [
      "Mr. Antwi's comical gestures at the chalkboard",
      "The comical manner in which the master spun around",
      "The inappropriate and vulgar contents within the contraband booklet",
      "The student near the window accidentally dropping his notebook"
    ],
    correctAnswer: "The inappropriate and vulgar contents within the contraband booklet",
    hint: "Paragraph two and four reveal they were circulating an unauthorized booklet of vulgar cartoons.",
    workedSolution: "The boys were giggling because they were covertly circulating and viewing an unauthorized booklet of vulgar cartoons during study hour.",
    points: 1
  },
  {
    number: 3,
    prompt: "Why did the boy seated beside the window hurriedly pitch the booklet into the flowerbed in Passage I?",
    options: [
      "The boys had grown tired of reading the cartoons",
      "The open window louvers had suddenly blown shut",
      "Mr. Antwi had begun walking away toward his desk",
      "To conceal the incriminating material from the approaching teacher"
    ],
    correctAnswer: "To conceal the incriminating material from the approaching teacher",
    hint: "Check paragraph three: discarding the booklet prevented it from being found during the physical search.",
    workedSolution: "The boy threw the contraband outside so that Mr. Antwi would find nothing incriminating on their persons during his search.",
    points: 1
  },
  {
    number: 4,
    prompt: "What enabled Mr. Antwi to successfully recover the contraband material after his manual search proved fruitless?",
    options: [
      "A gust of wind blew the booklet back into the study hall",
      "His extensive years of classroom teaching experience",
      "His athletic sprint across the classroom floor",
      "One of the frightened culprits broke down and surrendered it"
    ],
    correctAnswer: "His extensive years of classroom teaching experience",
    hint: "Paragraph four explicitly highlights: 'his two decades of pedagogical experience reminded him...'",
    workedSolution: "The text directly credits his long years of teaching experience with giving him the foresight to inspect the flowerbed outside the window.",
    points: 1
  },
  {
    number: 5,
    prompt: "In Passage I, the expression 'had reared their ugly heads' means that the unruly habits had become unpleasantly ............",
    options: [
      "prevalent, frequent, and noticeable",
      "comical and entertaining to visitors",
      "physically violent and dangerous",
      "repulsive in outward appearance"
    ],
    correctAnswer: "prevalent, frequent, and noticeable",
    hint: "When a problem rears its ugly head, it becomes widespread, visible, and problematic.",
    workedSolution: "The idiom 'to rear its ugly head' means to appear, emerge, or become unpleasantly common and widespread.",
    points: 1
  },
  {
    number: 6,
    prompt: "In Passage I, the word 'fumed' in 'Mr. Antwi fumed' means that the teacher ............",
    options: [
      "shouted with laughter",
      "walked out of the school",
      "lit a kerosene lamp",
      "became exceedingly furious and indignant"
    ],
    correctAnswer: "became exceedingly furious and indignant",
    hint: "To fume means to seethe with intense, boiling anger.",
    workedSolution: "'Fumed' describes experiencing or showing intense, boiling anger; 'became exceedingly furious and indignant' is its direct meaning.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: THE TRADITIONAL OUTDOORING (CALIBRATED ORIGINAL)
// =========================================================================
const passage2Text = `The traditional outdooring and naming ceremony of Baby Kwesi on his fifteenth day was a splendid occasion to which almost the entire township of Saltpond turned out. Opanyin Mensah had formally invited only three clan elders, yet over three hundred townspeople arrived at his family compound without formal invitation.

"The customary rites will commence at dawn, precisely at half past five," Opanyin Mensah had announced to everyone who stopped by his commercial shop the previous afternoon. They had in turn passed the word along, and by five in the morning, when dawn was barely breaking, nearly eighty neighbors were already seated within the courtyard.

"Could the younger guests bring forth extra seats from the inner chambers?" Opanyin Mensah requested. The youths hurried into every room and brought out wooden chairs and benches of diverse shapes and sizes. These were arranged in a broad circle with the three presiding elders seated in the center. "Where is the newborn infant? The rites must conclude before the morning sun crests the horizon," one of the elders reminded the household.

The nursing mother presently emerged carrying the two-week-old baby wrapped in spotless white calico. A dozen scrubbed calabashes, cleansed the previous evening, were arrayed on a brass tray, looking dry and chalk-white. The senior elder took one and poured an ounce of dry gin into it. He supported the infant's neck and dipped his index finger into the liquid. Turning to the elder beside him, he inquired, "Have we settled upon the ancestral name?" "Kwesi Baidoo, alias Koo Kra," the second elder responded with a nod.`;

const passage2Questions = [
  {
    number: 7,
    prompt: "According to Passage II, what was the primary purpose of the gathering at Opanyin Mensah's compound?",
    options: [
      "To arbitrate a bitter boundary dispute between families",
      "To partake in communal drinking of imported spirits",
      "To witness a traditional infant-naming ceremony",
      "To listen to a civic address delivered by Opanyin Mensah"
    ],
    correctAnswer: "To witness a traditional infant-naming ceremony",
    hint: "Reread the opening sentence: the people assembled for Baby Kwesi's traditional outdooring on his fifteenth day.",
    workedSolution: "The gathering was organized to perform customary rites and officially confer an ancestral name upon the newborn baby.",
    points: 1
  },
  {
    number: 8,
    prompt: "In Passage II, the phrase 'chairs and benches of diverse shapes and sizes' tells us that the furniture was ............",
    options: [
      "monumentally heavy and immovable",
      "uniformly elongated in design",
      "crafted with identical carpentry specifications",
      "an assortment of varied and irregular designs"
    ],
    correctAnswer: "an assortment of varied and irregular designs",
    hint: "Diverse shapes and sizes indicates a varied, non-uniform collection of items.",
    workedSolution: "The expression means the collected seats were an assorted collection of different heights, styles, and dimensions collected from various rooms.",
    points: 1
  },
  {
    number: 9,
    prompt: "From the contextual details provided in Passage II, Opanyin Mensah earned his living as a ............",
    options: ["school headmaster", "commercial retail shopkeeper", "licensed legal practitioner", "church catechist"],
    correctAnswer: "commercial retail shopkeeper",
    hint: "Paragraph two notes that he informed everyone who stopped by his commercial shop.",
    workedSolution: "The text explicitly mentions people stopping by his commercial shop, establishing his vocation as a retail merchant or shopkeeper.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the word 'splendid' in 'was a splendid occasion' means ............",
    options: [
      "quiet and subdued",
      "somber and mournful",
      "magnificent, festive, and grand",
      "rowdy and disorderly"
    ],
    correctAnswer: "magnificent, festive, and grand",
    hint: "'Splendid' denotes impressive, grand, and celebratory in nature.",
    workedSolution: "'Splendid' in reference to social occasions means magnificent, celebratory, or grand; 'magnificent, festive, and grand' is the exact equivalent.",
    points: 1
  },
  {
    number: 11,
    prompt: "Which of the following statements is NOT true according to Passage II?",
    options: [
      "The custom required that the naming ritual be concluded prior to sunrise",
      "The presiding elder immersed the baby's entire head into the calabash of gin",
      "The first elder verified the child's ancestral name from the second elder",
      "The outdooring was attended by a massive crowd of uninvited neighbors"
    ],
    correctAnswer: "The presiding elder immersed the baby's entire head into the calabash of gin",
    hint: "The elder merely dipped his index finger into the gin to touch the baby's tongue.",
    workedSolution: "The text says the elder supported the child's head and dipped his index finger into the gin; claiming he immersed the baby's entire head into the alcohol is completely false.",
    points: 1
  }
];

// =========================================================================
// GENERAL SECTIONS B - E: SYNONYMS, IDIOMS, ANTONYMS, STRUCTURE
// (ALL ORIGINAL REWRITES MAPPING TO 1996 TARGETS)
// =========================================================================
const generalQuestions = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (12 - 15) ---
  {
    number: 12,
    prompt: "The armed burglars who raided the neighborhood stores have been rounded up.\nChoose the word nearest in meaning to 'rounded up'.",
    options: ["slain", "disciplined", "apprehended", "wounded"],
    correctAnswer: "apprehended",
    hint: "Captured, arrested, or taken into police custody.",
    workedSolution: "'Rounded up' in law enforcement contexts means tracked down, captured, or 'apprehended'.",
    points: 1
  },
  {
    number: 13,
    prompt: "Whenever you encounter an unfamiliar term, look it up in a standard dictionary.\nChoose the phrase nearest in meaning to 'look it up'.",
    options: ["examine it", "observe it", "consult a reference source for", "record its spelling"],
    correctAnswer: "consult a reference source for",
    hint: "To search for the definition or meaning of a word in a reference book.",
    workedSolution: "The phrasal verb 'to look up' a term means to search for its definition or 'consult a reference source for' its meaning.",
    points: 1
  },
  {
    number: 14,
    prompt: "The public address speaker failed to transmit sound because its amplifier was defective.\nChoose the word nearest in meaning to 'defective'.",
    options: ["soiled", "fractured", "malfunctioning", "untuned"],
    correctAnswer: "malfunctioning",
    hint: "Having a fault or failing to work properly.",
    workedSolution: "'Defective' describes an appliance or mechanism with a flaw that prevents it from working; 'malfunctioning' (or faulty) is its direct synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "Our basic school soccer team was eliminated at the semifinal stage of the municipal tournament.\nChoose the phrase nearest in meaning to 'eliminated'.",
    options: ["forgotten", "knocked out", "disbanded", "demoted"],
    correctAnswer: "knocked out",
    hint: "Removed from further competition after suffering a defeat.",
    workedSolution: "'Eliminated' in tournament athletics means disqualified or 'knocked out' from the championship.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "The apprentice, reluctant to run the errand under the hot sun, walked at a snail's pace. This means that the apprentice walked ............",
    options: ["cautiously", "with sluggish slowness", "noisily", "carelessly"],
    correctAnswer: "with sluggish slowness",
    hint: "Moving extremely slowly, like a snail.",
    workedSolution: "The idiom 'at a snail's pace' means very slowly or with sluggish slowness.",
    points: 1
  },
  {
    number: 17,
    prompt: "The day our basic school clinched the national championship trophy was a red-letter day. This means it was a ............",
    options: [
      "day marked by official postal letters",
      "day of public mourning and grief",
      "memorable occasion of celebration and honor",
      "day dedicated to administrative inspections"
    ],
    correctAnswer: "memorable occasion of celebration and honor",
    hint: "A memorable, joyful, and historically notable day.",
    workedSolution: "The idiom 'a red-letter day' refers to an especially important, memorable, or joyous occasion.",
    points: 1
  },
  {
    number: 18,
    prompt: "I have a bone to pick with my dormitory prefect for giving a false report against me. This means that I ............",
    options: [
      "wish to share my afternoon meal with the prefect",
      "must report the prefect to the housemaster",
      "must deliver an animal bone to the prefect",
      "have a grievance to resolve with the prefect"
    ],
    correctAnswer: "have a grievance to resolve with the prefect",
    hint: "Having a complaint or dispute to settle with someone.",
    workedSolution: "The idiom 'to have a bone to pick with someone' means to have a complaint, grievance, or dispute to discuss and resolve with them.",
    points: 1
  },
  {
    number: 19,
    prompt: "Kwame's dismissal from the corporate firm came completely out of the blue. This means that his dismissal was ............",
    options: [
      "predetermined by company policy",
      "widely expected by all his colleagues",
      "completely unforeseen and sudden",
      "recommended by the board"
    ],
    correctAnswer: "completely unforeseen and sudden",
    hint: "Happening totally unexpectedly without warning.",
    workedSolution: "The idiom 'out of the blue' means completely unexpected, sudden, and unforeseen.",
    points: 1
  },
  {
    number: 20,
    prompt: "Efua feels like a fish out of water whenever she enters an automotive repair workshop. This means that Efua feels ............",
    options: [
      "physically short of breath",
      "uncomfortable and out of her natural element",
      "exceptionally energetic",
      "cheerful and delighted"
    ],
    correctAnswer: "uncomfortable and out of her natural element",
    hint: "Feeling awkward and out of place in an unfamiliar setting.",
    workedSolution: "The idiom 'like a fish out of water' describes someone who feels clumsy, uneasy, or completely out of their element.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "These harvested loaves of bread are stale; please procure ...... ones from the bakery.\nChoose the word most nearly opposite in meaning to 'stale'.",
    options: ["succulent", "sweet", "fresh", "warm"],
    correctAnswer: "fresh",
    hint: "'Stale' food has lost its original quality through age. What word denotes newly baked?",
    workedSolution: "'Stale' describes baked food that is no longer good or fresh through age. Its direct antonym is 'fresh'.",
    points: 1
  },
  {
    number: 22,
    prompt: "While Moses holds a temporary appointment, his departmental supervisor occupies a ...... position.\nChoose the word most nearly opposite in meaning to 'temporary'.",
    options: ["daily", "permanent", "probationary", "weekly"],
    correctAnswer: "permanent",
    hint: "'Temporary' means lasting for a limited time. Find the word meaning lasting indefinitely.",
    workedSolution: "'Temporary' means transient or short-term. Its direct antonym in civil service employment is 'permanent'.",
    points: 1
  },
  {
    number: 23,
    prompt: "The stray fox vanished into the thicket the moment the hunting dogs appeared.\nChoose the word most nearly opposite in meaning to 'vanished'.",
    options: ["retreated", "escaped", "leaped", "appeared"],
    correctAnswer: "appeared",
    hint: "'Vanished' means disappeared from sight. What word means came into view?",
    workedSolution: "'Vanished' means passed completely out of sight. Its direct antonym is 'appeared' (came into sight).",
    points: 1
  },
  {
    number: 24,
    prompt: "While the reckless motorist sped through the crowded market, the presidential driver handled the limousine ...... .\nChoose the word most nearly opposite in meaning to 'recklessly'.",
    options: ["rapidly", "cautiously", "noisily", "slowly"],
    correctAnswer: "cautiously",
    hint: "'Recklessly' means carelessly without regard to danger. Find the word meaning with prudence and care.",
    workedSolution: "'Recklessly' means acting with complete disregard for safety. Its direct opposite is 'cautiously' (or carefully).",
    points: 1
  },
  {
    number: 25,
    prompt: "The technician demonstrated that the electrical breakers were genuine brands, not ...... replicas.\nChoose the word most nearly opposite in meaning to 'genuine'.",
    options: ["inferior", "untested", "counterfeit", "modern"],
    correctAnswer: "counterfeit",
    hint: "'Genuine' means authentic and real. Find the word meaning fraudulent, fake, or forged.",
    workedSolution: "'Genuine' means authentic and original. Its direct commercial antonym is 'counterfeit' (or fake).",
    points: 1
  },

  // --- SECTION E: STRUCTURE & QUESTION TAGS (26 - 40) ---
  {
    number: 26,
    prompt: "I am free to relax now because I ...... all my terminal examination revisions.",
    options: ["completed", "do complete", "have completed", "complete"],
    correctAnswer: "have completed",
    hint: "Present Perfect tense expresses an action completed prior to the present moment with present relevance.",
    workedSolution: "The present state of freedom ('I am free now') results from an action completed just before, requiring the Present Perfect: 'have completed'.",
    points: 1
  },
  {
    number: 27,
    prompt: "After Roderick ...... the ceremonial suit, he searched for a pair of matching leather shoes.",
    options: ["has purchased", "is purchasing", "had purchased", "was purchasing"],
    correctAnswer: "had purchased",
    hint: "Use the past perfect tense ('had + past participle') for an action completed before another past event.",
    workedSolution: "The purchasing of the suit preceded the search for matching shoes in a past narrative frame, requiring the Past Perfect tense: 'had purchased'.",
    points: 1
  },
  {
    number: 28,
    prompt: "I greeted the woodcarver while he ...... the traditional stool.",
    options: ["is polishing", "has been polishing", "was polishing", "had been polishing"],
    correctAnswer: "was polishing",
    hint: "An ongoing past continuous action ('was polishing') during which a simple past action ('greeted') took place.",
    workedSolution: "Clauses introduced by 'while' describing an extended background activity in the past take the Past Continuous tense: 'was polishing'.",
    points: 1
  },
  {
    number: 29,
    prompt: "You cannot carry this heavy sack of cocoa alone, ......?",
    options: ["can't you", "do you", "can you", "don't you"],
    correctAnswer: "can you",
    hint: "A negative statement with 'cannot' takes an affirmative tag: 'can you?'.",
    workedSolution: "The main clause contains a negative modal verb ('cannot carry'). Its corresponding question tag must be affirmative: 'can you?'.",
    points: 1
  },
  {
    number: 30,
    prompt: "Not only was the young candidate exceptionally articulate, ...... remarkably knowledgeable.",
    options: ["or", "nor", "but also", "and also"],
    correctAnswer: "but also",
    hint: "Correlative conjunction pair: 'Not only' is followed by 'but also'.",
    workedSolution: "The correlative pair in formal English syntax is 'Not only ... but also'.",
    points: 1
  },
  {
    number: 31,
    prompt: "Neither the store manager nor his administrative assistant ...... at the depot today.",
    options: ["is working", "do work", "have worked", "are working"],
    correctAnswer: "is working",
    hint: "Proximity rule: With 'neither... nor', the verb agrees in number with the subject closer to it ('assistant' - singular).",
    workedSolution: "When subjects are linked by 'neither... nor', the verb agrees with the nearer subject ('his administrative assistant', singular), taking 'is working'.",
    points: 1
  },
  {
    number: 32,
    prompt: "The grazing antelope was startled while it ...... peacefully along the edge of the forest.",
    options: ["is grazing", "is grazed", "was graze", "was grazing"],
    correctAnswer: "was grazing",
    hint: "Past continuous tense describing an ongoing action in the past.",
    workedSolution: "The continuous action in the past is expressed by the past continuous tense: 'was grazing'.",
    points: 1
  },
  {
    number: 33,
    prompt: "There were ...... commercial trucks queued along the industrial loading bay.",
    options: ["plenty", "most", "much", "many"],
    correctAnswer: "many",
    hint: "'Trucks' is a plural countable noun. Use this quantifier.",
    workedSolution: "Plural countable nouns ('trucks') require 'many'. 'Much' is used strictly for non-count mass nouns.",
    points: 1
  },
  {
    number: 34,
    prompt: "Abena is the ...... brilliant student in the graduating class.",
    options: ["much", "very much", "very more", "most"],
    correctAnswer: "most",
    hint: "Form the superlative degree of multi-syllable adjectives preceded by 'the'.",
    workedSolution: "The superlative degree of multi-syllable adjectives ('brilliant' / 'beautiful') is formed with 'most' preceded by 'the': 'the most brilliant'.",
    points: 1
  },
  {
    number: 35,
    prompt: "The diplomat is ...... to participate in partisan political rallies.",
    options: [
      "too cautious a man",
      "too a cautious man",
      "a too cautious man",
      "a man cautious too"
    ],
    correctAnswer: "too cautious a man",
    hint: "Structure: 'too + adjective + a/an + singular count noun'.",
    workedSolution: "In formal syntactic structures, the intensifier 'too' precedes the adjective, which is followed by the indefinite article and the noun: 'too cautious a man'.",
    points: 1
  },
  {
    number: 36,
    prompt: "Kofi and Kwabena greeted each other warmly and shook hands with ......",
    options: ["each other", "each one", "one another", "themselves"],
    correctAnswer: "each other",
    hint: "Reciprocal pronoun used when an action is mutually exchanged between exactly two individuals.",
    workedSolution: "'Each other' is the reciprocal pronoun used when referring to two persons ('Kofi and Kwabena'). 'One another' is preferred for three or more.",
    points: 1
  },
  {
    number: 37,
    prompt: "The science department organized an inspiring ...... practical workshop.",
    options: ["two days", "two day", "two-day", "two-days"],
    correctAnswer: "two-day",
    hint: "Compound unit adjectives preceding a noun are hyphenated and remain in the singular form.",
    workedSolution: "When a measurement phrase functions as a compound adjective preceding a noun, it takes a hyphen and retains a singular noun ('two-day practical workshop').",
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
    prompt: "In traditional wrestling, it is reckless to take ...... an opponent twice your physical size.",
    options: ["off", "in", "on", "over"],
    correctAnswer: "on",
    hint: "Identify the phrasal verb meaning to challenge, oppose, or fight against an adversary.",
    workedSolution: "The phrasal verb 'to take on' means to confront, fight, or accept a challenge against an opponent.",
    points: 1
  },
  {
    number: 40,
    prompt: "The storekeeper was certain that he had handed the receipt to ...... else in the shop.",
    options: ["anyone", "someone", "somebody", "everybody"],
    correctAnswer: "someone",
    hint: "Use 'someone' in affirmative statements to denote an unspecified person.",
    workedSolution: "In affirmative declarative sentences, 'someone' is standard when referring to an unspecified individual ('someone else'). 'Anyone' is used primarily in negatives and interrogatives.",
    points: 1
  }
];

// Combine all raw items
const allRawQuestions = [
  ...passage1Questions,
  ...passage2Questions,
  ...generalQuestions
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

const assignedTargetIndices = seedShuffle(targetKeys, 199602);

// Attach Passage I and Passage II directly to questions 1-11 so that
// the passage ALWAYS comes first before any question is displayed!
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

  const qNum = q.number;
  let passageTitle: string | undefined = undefined;
  let passageText: string | undefined = undefined;
  let passage: string | undefined = undefined;

  if (qNum >= 1 && qNum <= 6) {
    passageTitle = "Passage I: Mr. Antwi's Classroom Detection";
    passageText = passage1Text;
    passage = passage1Text;
  } else if (qNum >= 7 && qNum <= 11) {
    passageTitle = "Passage II: The Traditional Outdooring Ritual";
    passageText = passage2Text;
    passage = passage2Text;
  }

  return {
    number: q.number,
    prompt: q.prompt,
    options: options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: q.points,
    ...(passageTitle ? { passageTitle } : {}),
    ...(passageText ? { passageText } : {}),
    ...(passage ? { passage } : {})
  };
});

// Partition Questions for Passage-First UI Rendering
const passage1Items = balancedPaper1.slice(0, 6);
const passage2Items = balancedPaper1.slice(6, 11);
const remainingItems = balancedPaper1.slice(11);

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

async function seedBeceEnglish1996Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 1996 into Firestore...");

  const db = await getDb();

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
    questions: balancedPaper1,
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      passages: [
        {
          id: "passage_1",
          title: "Passage I: Mr. Antwi's Classroom Detection",
          text: passage1Text,
          questionRange: "Questions 1 to 6"
        },
        {
          id: "passage_2",
          title: "Passage II: The Traditional Outdooring Ritual",
          text: passage2Text,
          questionRange: "Questions 7 to 11"
        }
      ],
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: Mr. Antwi's Classroom Detection",
          text: passage1Text,
          questionRange: "Questions 1 to 6",
          questions: passage1Items
        },
        passage2: {
          passageTitle: "Passage II: The Traditional Outdooring Ritual",
          text: passage2Text,
          questionRange: "Questions 7 to 11",
          questions: passage2Items
        }
      },
      sectionB_to_E: {
        title: "Sections B - E: Synonyms, Idioms, Antonyms and Structure",
        questionRange: "Questions 12 to 40",
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

  console.log("✅ Fully Rewritten, Clean-Room BECE English 1996 successfully seeded into Firestore!");
}

seedBeceEnglish1996Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1996:", err);
    process.exit(1);
  });
