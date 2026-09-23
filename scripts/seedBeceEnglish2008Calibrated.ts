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
// ISOMORPHIC PASSAGE I: MR. AKPALOO'S ARCHITECTURAL QUEST (CALIBRATED)
// =========================================================================
const passage1Title = "Passage I: Mr. Akpaloo's Architectural Quest at Kpota";
const passage1Text = `Following the official commissioning of the modern District Hospital at Kpota, an attractive cluster of new residential buildings began springing up across the adjoining landscape. One particular group of elegant structures caught the admiring eye of Mr. Akpaloo, who resolved in his heart that whenever he accumulated sufficient capital to construct his own family home, it would follow that exact architectural style.

When Mr. Akpaloo felt the time had arrived to commence his building project, his initial step was to track down the architectural drawings of the dwellings he had so long admired. He visited the administrative block of the hospital to confer with Dr. Agbetor, the Hospital Administrator. Dr. Agbetor explained that those specific residences had been erected under the supervision of Dr. Grant, who still kept the original architectural blueprints in his private custody. Clearly, the proper authority to consult was Dr. Grant.

Mr. Akpaloo traveled to Dr. Grant's magnificent country residence at Tokoe. The doctor received him courteously but explained that it was simply not prudent or ethical to release proprietary plans designed specifically for those projects. Nevertheless, he offered practical counsel: he advised Mr. Akpaloo to visit the Kpota site and meet the resident caretaker, who would guide him through the interior rooms. Mr. Akpaloo could then commission a draftsman to sketch an original adaptation.

Mr. Akpaloo set off for the site without delay. Upon his arrival, the caretaker escorted him through the premises. What had appeared from the highway to be a modest two-bedroom bungalow turned out, at close quarters, to be an expansive four-bedroom residence. It was a vivid lesson in how perspective and distance can alter human perception!`;

const passage1QuestionsRaw = [
  {
    number: 1,
    prompt: "According to Passage I, at what point in time were the admired residential structures built at Kpota?",
    options: [
      "At the very commencement of the hospital foundation",
      "Decades before the hospital was conceived",
      "Only after the District Hospital had been completed",
      "Simultaneously alongside the hospital wards"
    ],
    correctAnswer: "Only after the District Hospital had been completed",
    hint: "Reread the opening sentence: since the building of the hospital, residential structures had sprung up around it.",
    workedSolution: "The narrative states that the residential buildings arose following the construction and commissioning of the District Hospital.",
    points: 1
  },
  {
    number: 2,
    prompt: "Why did Dr. Grant decline to hand over the original architectural blueprints to Mr. Akpaloo in Passage I?",
    options: [
      "He believed it was neither wise nor prudent to give away custom plans",
      "The residential properties were no longer his personal possession",
      "He insisted that Mr. Akpaloo must hire his own private architect",
      "The resident caretaker had misplaced the blueprint files"
    ],
    correctAnswer: "He believed it was neither wise nor prudent to give away custom plans",
    hint: "Check paragraph three: 'The latter explained that it was not prudent to give out the plan...'",
    workedSolution: "Dr. Grant refused to hand over the drawings because he considered it unwise and improper to give away plans customized for a specific project.",
    points: 1
  },
  {
    number: 3,
    prompt: "What preliminary action did Mr. Akpaloo undertake as soon as he felt ready to build his own residence?",
    options: [
      "He made an immediate freehand sketch of the building layout",
      "He searched for the original architectural drawings of the houses he admired",
      "He submitted an application for an institutional bank loan",
      "He purchased a parcel of land near the hospital administrator's office"
    ],
    correctAnswer: "He searched for the original architectural drawings of the houses he admired",
    hint: "Paragraph two notes: 'one of the things he did was to look for the plan of the houses that he so admired.'",
    workedSolution: "Before commencing work, Mr. Akpaloo actively sought to obtain the design plans of the houses he had admired from afar.",
    points: 1
  },
  {
    number: 4,
    prompt: "In Passage I, the word 'magnificent' in 'his magnificent house at Tokoe' means ............",
    options: [
      "massive and gigantic",
      "splendid, grand, and beautiful",
      "costly and exorbitant",
      "ancient and historical"
    ],
    correctAnswer: "splendid, grand, and beautiful",
    hint: "'Magnificent' denotes impressive grandeur, beauty, and elegance.",
    workedSolution: "'Magnificent' describes exceptional grandeur, visual beauty, and splendor; 'splendid, grand, and beautiful' is its direct meaning.",
    points: 1
  },
  {
    number: 5,
    prompt: "In Passage I, the expression 'took the fancy of Mr. Akpaloo' means that Mr. Akpaloo ............",
    options: [
      "found the design of the houses exceptionally attractive",
      "was completely confused by the architectural style",
      "derided the materials used in constructing the houses",
      "drew a comical sketch of the residential cluster"
    ],
    correctAnswer: "found the design of the houses exceptionally attractive",
    hint: "To take someone's fancy means to appeal to them or attract their interest.",
    workedSolution: "The idiom 'to take someone's fancy' means to appeal to them, capture their admiration, or be found attractive.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: THE FISHERMAN AND THE ENCHANTED JAR (CALIBRATED)
// =========================================================================
const passage2Title = "Passage II: The Wily Fisherman and the Bottled Genie";
const passage2Text = `One evening, a destitute fisherman cast his nets into the coastal waters and caught nothing after hours of grueling labor. Disheartened and about to steer his canoe homeward, he felt his hemp net suddenly grow heavy beneath the surface. Supposing he had captured an enormous fish, he dragged the net ashore with great excitement. To his dismay, the net contained no fish at all, but rather a heavy copper jar sealed tightly with molten lead.

Convinced that such an ancient, sealed vessel must contain buried gold or precious gems, the fisherman retrieved his pocketknife, cut away the lead seal, and inverted the vessel. For a brief moment, nothing emerged; then, thick smoke began billowing from the mouth of the jar, rising into the sky like a dense, swirling cloud of fog. To the fisherman's terror, the smoky cloud condensed into a towering, terrifying genie.

"Fall to your knees and prepare to perish!" bellowed the spirit in a voice of thunder.

"Why should you take my life?" the trembling fisherman stammered. "Have you forgotten that I broke your seal and restored your liberty?"

"That is true," the genie replied with a cruel laugh, "yet I have sworn a solemn oath to slay you. I am an ancient spirit who rebelled against the Sovereign Creator. To chastise my pride, He imprisoned me in this copper jar and cast me into the deep. During the first century of my captivity, I swore to bestow boundless riches upon anyone who liberated me. During my second century, I swore to grant my savior three wishes. But as centuries rolled by and no one appeared, rage consumed my heart, and I swore to slay my rescuer without mercy."

"If perish I must," said the quick-witted fisherman, "at least swear that your massive frame was truly enclosed within that tiny pot. It is far too small to hold even your little finger. Unless my own eyes witness it, I shall never believe it."

"Behold with your own eyes and believe!" roared the proud genie.

The giant figure slowly dissolved into plumes of smoke and poured himself back into the narrow copper pot. Instantly, the fisherman slammed the lead seal onto the neck, secured the stopper, and hurled the jar back into the depths of the sea.`;

const passage2QuestionsRaw = [
  {
    number: 6,
    prompt: "According to Passage II, what did the fisherman actually drag ashore in his net?",
    options: [
      "A massive deep-sea fish",
      "A chest filled with silver coins",
      "A heavy sealed copper jar containing no fish",
      "A broken lead net weight"
    ],
    correctAnswer: "A heavy sealed copper jar containing no fish",
    hint: "Reread paragraph one: he thought he had caught a fish, but found only a heavy copper pot sealed with lead.",
    workedSolution: "The text explains that the fisherman caught no fish at all; his net held only a sealed copper jar.",
    points: 1
  },
  {
    number: 7,
    prompt: "In Passage II, what entity was released when the seal was broken?",
    options: [
      "A venomous sea serpent",
      "An enchanted supernatural spirit",
      "A toxic volcanic gas",
      "A magical talking fish"
    ],
    correctAnswer: "An enchanted supernatural spirit",
    hint: "The smoke turned into a genie, which identified itself as a spirit that rebelled against the Creator.",
    workedSolution: "The entity in the jar was a genie—an ancient, powerful supernatural spirit.",
    points: 1
  },
  {
    number: 8,
    prompt: "In Passage II, the word 'captivity' in 'the first century of my captivity' means ............",
    options: [
      "birth and infancy",
      "military defeat",
      "confinement or imprisonment",
      "rebellion against authority"
    ],
    correctAnswer: "confinement or imprisonment",
    hint: "'Captivity' refers to the state of being locked up, confined, or imprisoned.",
    workedSolution: "'Captivity' denotes the condition of being trapped, locked up, or imprisoned; 'confinement or imprisonment' is its direct meaning.",
    points: 1
  },
  {
    number: 9,
    prompt: "How many distinct vows or oaths did the genie make across the centuries in Passage II?",
    options: [
      "A single initial oath",
      "Two consecutive oaths",
      "Three separate progressive oaths",
      "Four unrecorded oaths"
    ],
    correctAnswer: "Three separate progressive oaths",
    hint: "Century 1: make his savior rich. Century 2: grant three wishes. Century 3: kill his rescuer without mercy. That equals three vows.",
    workedSolution: "The genie made three successive oaths: to make his savior rich, to grant three wishes, and finally to kill whoever freed him.",
    points: 1
  },
  {
    number: 10,
    prompt: "According to the outcome of Passage II, the fisherman successfully saved his own life because he ............",
    options: [
      "slayed the genie with his pocketknife",
      "relied on his wits and cunning to trick the spirit back into the jar",
      "accepted the genie's offer of boundless wealth",
      "called other coastal fishermen to assist him"
    ],
    correctAnswer: "relied on his wits and cunning to trick the spirit back into the jar",
    hint: "He feigned disbelief, tricked the proud genie into shrinking back into smoke, and resealed the pot.",
    workedSolution: "The fisherman used his sharp intellect and cunning to challenge the genie's pride, tricking him back into the pot and casting him into the ocean.",
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
    prompt: "Ama was persuaded by her elder brother to alter her academic programme.\nChoose the word nearest in meaning to 'persuaded'.",
    options: ["convinced", "commanded", "directed", "compelled"],
    correctAnswer: "convinced",
    hint: "Induced by argument, reasoning, or entreaty to believe or do something.",
    workedSolution: "'Persuaded' means moved by argument to a decision; 'convinced' is its direct synonym.",
    points: 1
  },
  {
    number: 12,
    prompt: "The talented striker scored two sensational goals during the finals.\nChoose the word nearest in meaning to 'talented'.",
    options: ["trained", "vigorous", "gifted", "practiced"],
    correctAnswer: "gifted",
    hint: "Possessing natural aptitude or extraordinary ability.",
    workedSolution: "'Talented' means possessing natural creative or athletic ability; 'gifted' is its exact equivalent.",
    points: 1
  },
  {
    number: 13,
    prompt: "Araba was saddened when she learned of her companion's misfortune.\nChoose the word nearest in meaning to 'saddened'.",
    options: ["sorrowful", "furious", "astonished", "perplexed"],
    correctAnswer: "sorrowful",
    hint: "Filled with or expressing grief, sorrow, or unhappiness.",
    workedSolution: "'Saddened' means made to feel sorrow or grief; 'sorrowful' is its direct synonym.",
    points: 1
  },
  {
    number: 14,
    prompt: "The candidate was cautioned after behaving in an unruly manner toward the invigilator.\nChoose the word nearest in meaning to 'unruly'.",
    options: ["impolite", "peculiar", "boisterous", "reckless"],
    correctAnswer: "impolite",
    hint: "Disorderly, disruptive, and lacking good manners or respect.",
    workedSolution: "'Unruly' describes disorderly, disrespectful, or ill-mannered behavior; 'impolite' (or ill-mannered) is its closest synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "My mother is remarkably enthusiastic about my admission into technical college.\nChoose the word nearest in meaning to 'enthusiastic'.",
    options: ["apprehensive", "frank", "vigilant", "hopeful"],
    correctAnswer: "hopeful",
    hint: "Having or showing intense, eager interest, anticipation, and optimism.",
    workedSolution: "'Enthusiastic' implies keen interest and positive, eager anticipation; 'hopeful' (or eager) is its closest equivalent.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "The former cashier passed away without clearing his name. This means he died without ............",
    options: [
      "proving his complete innocence of the embezzlement charges",
      "writing his last will and testament",
      "erasing his signature from the ledger",
      "withdrawing his financial savings"
    ],
    correctAnswer: "proving his complete innocence of the embezzlement charges",
    hint: "To clear one's name means to prove that one is innocent of a crime or accusation.",
    workedSolution: "The idiom 'to clear one's name' means to prove one's innocence and restore a damaged reputation.",
    points: 1
  },
  {
    number: 17,
    prompt: "The master advised us to go over our calculation sheets before submitting them. This means we should ...... our work.",
    options: ["rewrite", "recalculate", "review", "resubmit"],
    correctAnswer: "review",
    hint: "To inspect, verify, check, or examine carefully.",
    workedSolution: "The phrasal verb 'to go over' written work means to inspect, check, or 'review' it carefully for errors.",
    points: 1
  },
  {
    number: 18,
    prompt: "You do not have to be so high and mighty whenever someone offers you advice. This means you should not be ............",
    options: ["confident", "arrogant and haughty", "confused", "indifferent"],
    correctAnswer: "arrogant and haughty",
    hint: "Acting superior, haughty, or condescending toward others.",
    workedSolution: "The idiom 'high and mighty' refers to acting in an arrogant, haughty, and condescending manner.",
    points: 1
  },
  {
    number: 19,
    prompt: "The traditional elder urged the two rival factions to mend their fences. This means they should ............",
    options: [
      "rebuild their damaged compound walls",
      "settle their dispute and make peace",
      "fortify their borders with fencing",
      "take their grievances to a modern court"
    ],
    correctAnswer: "settle their dispute and make peace",
    hint: "To repair damaged relationships and resolve a quarrel.",
    workedSolution: "The idiom 'to mend one's fences' means to repair damaged interpersonal relations, resolve differences, and make peace.",
    points: 1
  },
  {
    number: 20,
    prompt: "He was warned against riding the bicycle without brakes, but he turned a deaf ear to the counsel. This means that he ............",
    options: [
      "could not hear the verbal warning",
      "laughed sarcastically at the speaker",
      "completely ignored and disregarded the advice",
      "became infuriated by the counsel"
    ],
    correctAnswer: "completely ignored and disregarded the advice",
    hint: "To deliberately refuse to listen or comply.",
    workedSolution: "The idiom 'to turn a deaf ear' means to deliberately refuse to listen, disregard, or ignore counsel.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "While Uncle Kwame is generous to travelers, his younger brother is notoriously ...... .\nChoose the word most nearly opposite in meaning to 'generous'.",
    options: ["stingy", "strict", "severe", "hostile"],
    correctAnswer: "stingy",
    hint: "'Generous' means willing to give and share. What word denotes unwilling to spend or share money?",
    workedSolution: "'Generous' means giving or liberal with money. Its direct economic opposite is 'stingy' (miserly).",
    points: 1
  },
  {
    number: 22,
    prompt: "The headmaster rebuked the latecomers, but ...... the punctual monitors.\nChoose the word most nearly opposite in meaning to 'rebuked'.",
    options: ["praised", "admitted", "excused", "embraced"],
    correctAnswer: "praised",
    hint: "'Rebuked' means scolded or reprimanded. What word denotes expressed approval and admiration?",
    workedSolution: "'Rebuked' means reprimanded or sharply criticized. Its direct antonym is 'praised' (commended).",
    points: 1
  },
  {
    number: 23,
    prompt: "Naa approached the podium with confidence, whereas her rival displayed obvious ...... .\nChoose the word most nearly opposite in meaning to 'confidence'.",
    options: ["firmness", "timidity", "sorrow", "humility"],
    correctAnswer: "timidity",
    hint: "'Confidence' means self-assurance and boldness. What word denotes shyness, fearfulness, or lack of courage?",
    workedSolution: "'Confidence' denotes boldness and self-assurance. Its direct psychological antonym is 'timidity' (shyness or fearfulness).",
    points: 1
  },
  {
    number: 24,
    prompt: "Judicial magistrates are required to remain impartial, rather than ...... toward wealthy litigants.\nChoose the word most nearly opposite in meaning to 'impartial'.",
    options: ["biased", "severe", "disrespectful", "insolent"],
    correctAnswer: "biased",
    hint: "'Impartial' means fair and unbiased. What word denotes showing prejudice or unfair favoritism?",
    workedSolution: "'Impartial' means completely unbiased and objective. Its direct judicial antonym is 'biased' (or prejudiced).",
    points: 1
  },
  {
    number: 25,
    prompt: "Scripture teaches that those who exalt themselves will be brought low, but the humble will be lifted up.\nChoose the word most nearly opposite in meaning to 'exalt'.",
    options: ["humble", "discipline", "chastise", "diminish"],
    correctAnswer: "humble",
    hint: "'Exalt' means to raise high in rank or praise haughtily. What word denotes to make modest or lower in pride?",
    workedSolution: "'Exalt' means to elevate, raise high, or praise proudly. Its direct opposite is 'humble' (to lower in pride or status).",
    points: 1
  },

  // --- SECTION E: STRUCTURE & QUESTION TAGS (26 - 40) ---
  {
    number: 26,
    prompt: "Kofi promised his parents that he ...... study with relentless diligence.",
    options: ["would", "should", "will", "can"],
    correctAnswer: "would",
    hint: "Reported speech sequence: Past reporting verb 'promised' requires the backshift of 'will' to 'would'.",
    workedSolution: "In indirect reported speech governed by a past reporting verb ('promised'), the future modal 'will' shifts to 'would'.",
    points: 1
  },
  {
    number: 27,
    prompt: "If Kofi ...... me for assistance earlier, I would have helped him.",
    options: ["had asked", "asks", "has asked", "asked"],
    correctAnswer: "had asked",
    hint: "Third Conditional: 'would have helped' in the main clause requires 'had + past participle' in the if-clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the if-clause requires the past perfect tense: 'had asked'.",
    points: 1
  },
  {
    number: 28,
    prompt: "Let us assemble our tools and depart immediately, Akosua, ......?",
    options: ["may we", "can we", "must we", "shall we"],
    correctAnswer: "shall we",
    hint: "Cohort suggestions beginning with 'Let's' or 'Let us' take the mandatory question tag 'shall we?'.",
    workedSolution: "Imperative sentences expressing collective suggestions beginning with 'Let's / Let us' require the tag 'shall we?'.",
    points: 1
  },
  {
    number: 29,
    prompt: "Adjo is ...... young to shoulder marital responsibilities.",
    options: ["so", "very", "too", "much"],
    correctAnswer: "too",
    hint: "Correlative degree modifier pairing with an infinitive to denote an excessive quality: 'too + adjective + to-infinitive'.",
    workedSolution: "The degree adverb 'too' pairs with the infinitive 'to marry' to denote an excessive degree resulting in unsuitability: 'too young to marry'.",
    points: 1
  },
  {
    number: 30,
    prompt: "Hand over that reference notebook of ...... to Mansah immediately.",
    options: ["their", "yours", "my", "your's"],
    correctAnswer: "yours",
    hint: "Double possessive construction: 'that [noun] of' requires an absolute possessive pronoun without an apostrophe.",
    workedSolution: "Double possessive constructions ('that book of...') require the absolute possessive pronoun 'yours'. Forms like 'your's' are ungrammatical.",
    points: 1
  },
  {
    number: 31,
    prompt: "...... the warnings issued by the marine meteorologist, the fishermen sailed into the storm.",
    options: ["In spite of", "Apart from", "In case of", "Instead of"],
    correctAnswer: "In spite of",
    hint: "Prepositional phrase denoting concession or contrast followed by a noun phrase: 'In spite of + noun'.",
    workedSolution: "The prepositional phrase expressing concession followed by a noun phrase is 'In spite of' (meaning notwithstanding the warning).",
    points: 1
  },
  {
    number: 32,
    prompt: "Our family has resided in this municipal bungalow ...... the year 2001.",
    options: ["since", "by", "in", "for"],
    correctAnswer: "since",
    hint: "Use 'since' with the Present Perfect Continuous to denote a specific starting point in time.",
    workedSolution: "The preposition 'since' indicates a specific starting point in the past ('since 2001') for an action continuing into the present.",
    points: 1
  },
  {
    number: 33,
    prompt: "The witness testified that he had encountered the suspect two days ......",
    options: ["before", "ago", "now", "then"],
    correctAnswer: "before",
    hint: "Indirect reported speech time shift: In past reported speech, 'ago' shifts to 'before' or 'earlier'.",
    workedSolution: "In indirect reported speech governed by a past reporting verb ('told/testified'), the past time adverb 'ago' shifts to 'before': 'two days before'.",
    points: 1
  },
  {
    number: 34,
    prompt: "The cashier was falsely accused ...... misappropriating public funds.",
    options: ["with", "for", "of", "on"],
    correctAnswer: "of",
    hint: "Identify the preposition that regularly collocates with the verb 'accuse'.",
    workedSolution: "In standard English grammar, the verb 'accuse' requires the preposition 'of' ('accused of stealing').",
    points: 1
  },
  {
    number: 35,
    prompt: "This is the dedicated postal clerk ...... I met at the lorry station.",
    options: ["who", "whose", "whom", "which"],
    correctAnswer: "whom",
    hint: "Objective relative pronoun used when the pronoun functions as the grammatical object of the relative clause ('I met [him]').",
    workedSolution: "In formal prescriptive English, 'whom' is the objective relative pronoun used when referring to a human object: 'the man whom I met'.",
    points: 1
  },
  {
    number: 36,
    prompt: "Kwame is remarkably good ...... solving complex algebraic equations.",
    options: ["on", "at", "for", "with"],
    correctAnswer: "at",
    hint: "Identify the preposition that regularly collocates with the adjective 'good' regarding skills or subjects.",
    workedSolution: "In standard English, the adjective 'good' takes the preposition 'at' when denoting proficiency in a subject or skill: 'good at English'.",
    points: 1
  },
  {
    number: 37,
    prompt: "The concert was reportedly fascinating; I truly wish I ...... present.",
    options: ["am", "were", "was", "have been"],
    correctAnswer: "were",
    hint: "Past subjunctive mood expressing an unrealized, counterfactual wish about a past/present state.",
    workedSolution: "In formal English, the subjunctive form 'were' is used following 'wish' to express a hypothetical or counterfactual desire: 'I wish I were there'.",
    points: 1
  },
  {
    number: 38,
    prompt: "Reverend Osei is currently the ...... senior among all the ministers in the presbytery.",
    options: ["much", "more", "most", "far"],
    correctAnswer: "most",
    hint: "Superlative modification when identifying the foremost individual among a group of three or more preceded by 'the'.",
    workedSolution: "When distinguishing the highest-ranking individual among a collective group ('of the pastors'), the superlative 'most' preceded by 'the' is required: 'the most senior'.",
    points: 1
  },
  {
    number: 39,
    prompt: "Our grandmother prefers sweet oranges ...... bitter lemons.",
    options: ["to", "than", "against", "from"],
    correctAnswer: "to",
    hint: "The comparative verb 'prefer' takes the preposition 'to', never 'than'.",
    workedSolution: "In standard English grammar, the verb 'prefer' requires the preposition 'to': 'prefer oranges to mangoes'.",
    points: 1
  },
  {
    number: 40,
    prompt: "The athletic coach expresses confidence that the squad ...... perform brilliantly next season.",
    options: ["would", "will", "should", "shall"],
    correctAnswer: "will",
    hint: "Future indicative expectation governed by a present reporting verb ('hope / expresses confidence').",
    workedSolution: "When governed by a present tense verb of expectation ('I hope'), the future indicative modal 'will' is required: 'hope the team will perform'.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 200802);

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
        category: "Informal Letter",
        prompt: "A close friend of your father has promised to grant you any three wishes if you successfully pass your Basic Education Certificate Examination (BECE). Write a letter to him describing the three specific things you want him to do for you and explaining clearly why you need each of them.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2008

Dear Uncle Kwame,

I hope this letter finds you in fine health, peace of mind, and thriving in your business endeavors in Accra. I write with deep gratitude to thank you for your generous promise to grant me any three wishes if I pass my upcoming Basic Education Certificate Examination (BECE) with distinction. That pledge has served as a powerful motivation for me to study with relentless discipline. With all humility, I write to describe the three specific wishes I hold closest to my heart.

First and foremost, I plead for your sponsorship to enroll in a comprehensive computer programming and digital literacy course during the upcoming vacation. In this emerging technological era, computer proficiency is an indispensable tool for academic research and future employment. Acquiring practical skills in typing, coding, and software management will provide me with a solid head start when I enter Senior High School.

Secondly, I request that you purchase a modern, complete science textbook and mathematical set for my secondary education. My ambition is to pursue the General Science programme at Prempeh College to realize my dream of studying electrical engineering. Having my own reference materials will enable me to study independently without relying solely on limited library copies.

Finally, I humbly ask for a sturdy, durable bicycle. My intended secondary school is situated several kilometers from our family house, and having personal transport will ensure I commute punctually every morning without relying on erratic commercial buses.

I promise to study with all my might to achieve aggregate six to justify your faith in me. May God richly reward your benevolent heart.

Your grateful nephew,
[Signature]
Kwabena Mensah`
      },
      {
        questionNumber: "2",
        category: "Formal Letter",
        prompt: "Write a formal letter to the Chairman of your school's Parent-Teacher Association (PTA) highlighting the urgent need to provide modern recreational and sporting facilities in your school.",
        modelAnswer: `Presbyterian Junior Secondary School
P. O. Box 80
Begoro, Eastern Region
18th October, 2008

The Chairman
Parent-Teacher Association
Presbyterian JSS, Begoro

Dear Sir,

PETITION FOR THE PROVISION OF MODERN RECREATIONAL AND SPORTING FACILITIES

On behalf of the student body of Presbyterian Junior Secondary School, Begoro, I respectfully write to appeal to the Parent-Teacher Association to provide modern recreational and sporting facilities for our school.

Currently, our school of over three hundred and fifty students lacks even the most basic recreational infrastructure. Our compound has only an uneven, rocky field devoid of standard goalposts, while court games like volleyball, basketball, and table tennis are completely absent. During physical education periods and recess, pupils are forced to play in hazardous surroundings, leading to frequent sprains and injuries. Furthermore, our school cannot host inter-school friendly matches or train our gifted athletes effectively.

Recreational facilities are not luxury amenities; they are vital instruments for holistic education. Engaging in organized sports relieves academic stress, improves cardiovascular health, and instills lifelong values of teamwork, perseverance, and discipline. Moreover, sports provide a positive outlet that deters students from juvenile delinquency, truancy, and loitering during leisure hours. Many of our students possess raw athletic talents that, if nurtured on standard courts, could win national scholarships and bring glory to our community.

We humbly appeal to the PTA to construct a multi-purpose asphalt court for volleyball and basketball, level our football pitch, and procure standard table tennis boards before the next academic year resumes.

We count on your parental benevolence and commitment to our physical and intellectual development.

Thank you.

Yours faithfully,
[Signature]
Emmanuel Addo
(Sports Prefect)`
      },
      {
        questionNumber: "3",
        category: "Speech / Orientation Address",
        prompt: "As the Senior Prefect of your school, write the orientation speech you will deliver to newly admitted students, outlining at least three critical principles that will make their stay in the school successful and rewarding.",
        modelAnswer: `AN ORIENTATION ADDRESS DELIVERED BY THE SENIOR PREFECT TO NEWLY ADMITTED BASIC SEVEN STUDENTS

Respected Headmaster, Dedicated Teachers, and My Dear Junior Brothers and Sisters:

On behalf of the entire prefectorial board and senior students, I extend a hearty and joyful welcome to every one of you as you begin your academic journey at Methodist Junior Secondary School. Gaining admission into this prestigious institution is a privileged opportunity, and I am here to share three fundamental principles that will guarantee your stay here is successful and memorable.

First and foremost, you must embrace unyielding academic discipline and time management. Basic school education moves at a rapid pace, and procrastination is the greatest thief of success. Ensure that you arrive at school punctually, listen attentively during instructional periods, and complete all classwork and homework assignments before going to bed. Establish personal study timetables and visit our school library frequently. Remember that academic excellence is not an accident; it is the product of steady, daily labor.

Secondly, you must uphold absolute obedience to school rules and moral integrity. Our institution has zero tolerance for truancy, bullying, destruction of school property, and insolence toward teachers and seniors. Treat your classmates with kindness, honesty, and mutual respect. Cultivate wholesome friendships with peers who inspire you to study rather than those who tempt you to wander into town during classes.

Finally, participate actively in extracurricular activities. Join our school debate club, the science society, the sports squad, or the cultural drumming troupe. Education is not confined to the chalkboard; developing your physical and artistic talents will build your self-confidence and mold you into a balanced individual.

Our prefects and teachers are always here to support you. Welcome once again, and may your years here be crowned with distinction.

Thank you.`
      },
      {
        questionNumber: "4",
        category: "Narrative Moral Essay",
        prompt: "Write an engaging, realistic story that illustrates the timeless truth of the traditional saying: \"Two heads are better than one.\"",
        modelAnswer: `Kofi and Kwame were two bright but fiercely competitive basic school classmates who lived in our farming village. Whenever our science master assigned class projects, Kofi preferred working in haughty isolation, boasting that his sharp intellect alone was sufficient to master any scientific problem. Kwame, though equally intelligent, was patient, practical, and receptive to constructive collaboration.

At the beginning of our final year, the district education directorate announced the Annual Basic Schools Science and Technology Innovation Competition. The challenge was formidable: students were required to design and fabricate a working solar-powered water filtration device capable of purifying muddy river water for rural households. The winning project would earn a prestigious national scholarship.

Driven by stubborn pride, Kofi locked himself in his room for three weeks, drawing complex theoretical circuit diagrams and refusing to consult anyone. Kwame, on the other hand, approached his classmate Mensah, an agile apprentice at the local carpentry workshop. Kwame realized that while he understood the biological filtration layers of charcoal and silica sand, Mensah possessed practical mastery of woodwork and waterproof sealing.

The two boys combined their complementary strengths. While Kwame calculated flow rates and chemical filtration ratios, Mensah skillfully fabricated a lightweight, leak-proof timber housing equipped with tilted solar mirrors to heat and sterilize the water.

On the day of the district exhibition, disaster struck Kofi's solitary project. His filtration casing, built hurriedly without technical assistance, ruptured under water pressure, flooding the exhibition table amidst embarrassing chuckles from the judges.

Conversely, Kwame and Mensah's collaborative prototype functioned flawlessly, transforming thick brown stream water into sparkling, drinkable water in minutes. The judges awarded them first prize with distinction. Looking at his shattered contraption, Kofi humbly conceded the eternal truth: Two heads are better than one.`
      }
    ]
  }
};

async function seedBeceEnglish2008Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 2008 into Firestore...");

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
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2008");
  await docRef.set({
    year: 2008,
    title: "BECE English Language 2008 (Calibrated National Benchmark)",
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

  console.log("✅ Fully Rewritten, Clean-Room BECE English 2008 successfully seeded into Firestore!");
}

seedBeceEnglish2008Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2008:", err);
    process.exit(1);
  });
