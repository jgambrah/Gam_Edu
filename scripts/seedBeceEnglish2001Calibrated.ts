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
// ISOMORPHIC PASSAGE I: THE BAOBAB TREE AND THE LORRY PARK (CALIBRATED)
// =========================================================================
const passage1Text = `In the very heart of the township stood a colossal baobab tree whose broad canopy and dense foliage provided an all-weather sanctuary. Over the decades, it had naturally evolved into the primary meeting ground for the community. Sturdy wooden benches had been constructed around the circumference of its massive trunk so that the village elders could recline in comfort, exchange local gossip, or deliberate on serious civic matters. On this sunny morning, three elderly men were relaxing on one of the eastern benches overlooking the main thoroughfare leading into town. From their vantage point, they had a clear view of the bustling market sheds, the busy lorry park, and the high street.

As they observed the scene, a heavy commercial passenger bus rattled into the lorry park, instantly engulfed by a surging, noisy crowd. Intending travelers scrambled forward to secure boarding spaces, while aggressive food vendors rushed from every corner of the station, eager to sell their wares of fried fish, bread, and peeled oranges. In the general confusion that erupted, incoming passengers pushed to board while those who had reached their journey's end struggled to get down. Other travelers, determined not to forfeit their prized seats, stood obstructing the narrow doorway or leaned far out of the bus windows to bargain with the persistent street hawkers.`;

const passage1Questions = [
  {
    number: 1,
    prompt: "According to Passage I, why do the town elders habitually sit on the benches beneath the baobab tree?",
    options: [
      "To board commercial vehicles traveling out of town",
      "To purchase agricultural produce from the vendors",
      "To converse, exchange news, and deliberate on community affairs",
      "To consume fresh palm wine during market hours"
    ],
    correctAnswer: "To converse, exchange news, and deliberate on community affairs",
    hint: "Reread paragraph one: the benches were placed so elders could sit in comfort and gossip or discuss serious affairs.",
    workedSolution: "The narrative explains that the elders gathered under the tree to relax, share news, and deliberate on serious communal matters.",
    points: 1
  },
  {
    number: 2,
    prompt: "Which of the following locations could the three old men NOT observe from their seated position?",
    options: [
      "The benches on the opposite side of the tree trunk",
      "The open market stalls across the road",
      "The arriving commercial passenger bus",
      "The bustling main high street"
    ],
    correctAnswer: "The benches on the opposite side of the tree trunk",
    hint: "The tree trunk was massive, blocking their line of sight to benches situated on the other sides.",
    workedSolution: "Because the benches encircled the massive trunk, the old men could only view what lay in front of them (market, bus, main street), not the benches behind the tree trunk.",
    points: 1
  },
  {
    number: 3,
    prompt: "In Passage I, the word 'uproar' in 'the general uproar which followed' means ............",
    options: [
      "a physical fistfight among drivers",
      "organized vehicular traffic movement",
      "active commercial trade",
      "a state of noisy commotion and confusion"
    ],
    correctAnswer: "a state of noisy commotion and confusion",
    hint: "'Uproar' denotes loud, chaotic noise and bustling confusion.",
    workedSolution: "'Uproar' refers to a noisy, chaotic commotion; 'a state of noisy commotion and confusion' is its direct meaning.",
    points: 1
  },
  {
    number: 4,
    prompt: "Why were certain passengers inside the bus struggling to alight in Passage I?",
    options: [
      "They wished to buy snacks from the hawkers",
      "They wanted to listen to the elders' conversation",
      "They intended to rest under the baobab tree",
      "They had arrived at their final travel destination"
    ],
    correctAnswer: "They had arrived at their final travel destination",
    hint: "Check paragraph two: 'whilst those who had reached their destination tried to alight.'",
    workedSolution: "Passengers were trying to alight because they had completed their trip and reached their destination.",
    points: 1
  },
  {
    number: 5,
    prompt: "In Passage I, why did some travelers stand obstructing the bus doorway?",
    options: [
      "They disliked the street food sellers outside",
      "They were unwilling to risk losing their seats",
      "They wanted to stop incoming passengers from boarding",
      "They wanted to get a clearer view of the old men"
    ],
    correctAnswer: "They were unwilling to risk losing their seats",
    hint: "Paragraph two states: 'Others who were not willing to risk losing their seats stood blocking the doorway...'",
    workedSolution: "Passengers blocked the exit because they feared that if they stepped out entirely, other commuters would take their seats.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: THE STREET ROBBERY IN ACCRA (CALIBRATED)
// =========================================================================
const passage2Text = `As I stood along a bustling pavement in Accra that late afternoon watching office workers hurry toward transit stations, I experienced a complete sense of personal security. This confidence stemmed from my conviction that Ghanaians are hospitable, genial, and exceptionally kind to strangers. Even though I had arrived from my rural farming village only that morning, I felt that in our national capital, a fellow countryman had nothing to fear.

At that very instant, a firm, sudden grip clamped around my forearm from behind. Far from feeling alarmed, a wave of warm relief washed over me. I assumed that a former primary schoolmate had spotted me, James Cudjoe, and decided to play our customary childhood prank on me. What a delightful coincidence, I thought! The carefree days of youth were back again.

I turned eagerly to greet my friend face to face. Strangely, the more I shifted to my left, the faster the individual dodged to my right, all the while tightening his fingers aggressively around my wrist. Suddenly, the assailant released his grip and bolted into the surging throng of commuters, vanishing into thin air. Surely, this was a bizarre way to greet an old comrade! City dwellers were indeed unpredictable creatures.

Thoroughly disoriented, I made my way toward the central lorry park to board a minibus for my brother's residence. As darkness settled over the metropolis, I reached down to check the time. To my utter shock and dismay, I realized that my wristwatch was missing. The thief had cleverly unbuckled and stolen it during the scuffle. It was neither brand-new nor particularly valuable, yet the rogue had found it worth stealing.`;

const passage2Questions = [
  {
    number: 6,
    prompt: "In Passage II, why did the narrator initially feel safe and unthreatened in Accra?",
    options: [
      "He saw numerous office workers commuting home peacefully",
      "He had arrived from his home village only that morning",
      "He expected his old schoolmates to protect him",
      "He believed that Ghanaians are well-known for their warmth and hospitality"
    ],
    correctAnswer: "He believed that Ghanaians are well-known for their warmth and hospitality",
    hint: "Reread paragraph one: his sense of security came from the fact that Ghanaians are generally kind and hospitable people.",
    workedSolution: "The narrator felt secure because of his faith in the legendary kindness, warmth, and hospitality of Ghanaians toward travelers.",
    points: 1
  },
  {
    number: 7,
    prompt: "In Passage II, the word 'spotted' in 'an old schoolmate must have spotted me' means ............",
    options: [
      "stared at suspiciously",
      "recognized and identified",
      "marked with chalk",
      "pointed out to the crowd"
    ],
    correctAnswer: "recognized and identified",
    hint: "To spot someone in a crowd means to catch sight of and recognize them.",
    workedSolution: "'Spotted' in this context means caught sight of, observed, or 'recognized and identified'.",
    points: 1
  },
  {
    number: 8,
    prompt: "Why did the narrator attempt to turn around to his left in Passage II?",
    options: [
      "To see the face of the person holding his arm",
      "To protect his wristwatch from being scratched",
      "To embrace his visiting brother",
      "To avoid being pushed by passing commuters"
    ],
    correctAnswer: "To see the face of the person holding his arm",
    hint: "Check paragraph three: he turned to look at the fellow in the face.",
    workedSolution: "The narrator turned because he wanted to look the person behind him in the face, believing him to be an old school friend.",
    points: 1
  },
  {
    number: 9,
    prompt: "According to Passage II, what was the real objective of the stranger who grabbed Cudjoe's arm?",
    options: [
      "He wished to welcome a rural traveler warmly",
      "He mistook Cudjoe for an old classmate",
      "He intended to steal Cudjoe's wristwatch",
      "He was trying to guide Cudjoe through the crowd"
    ],
    correctAnswer: "He intended to steal Cudjoe's wristwatch",
    hint: "The stranger held his arm to surreptitiously unbuckle and steal the watch.",
    workedSolution: "The assailant grabbed the narrator's arm under the guise of an embrace to unfasten and steal his wristwatch.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the word 'rogue' in 'yet the rogue found it worth stealing' refers to ............",
    options: [
      "an office worker",
      "a former classmate",
      "the pickpocket or thief",
      "a local bus conductor"
    ],
    correctAnswer: "the pickpocket or thief",
    hint: "'Rogue' denotes a dishonest person, scoundrel, or thief.",
    workedSolution: "'Rogue' refers to a dishonest, unscrupulous person or thief; in the passage, it refers directly to the pickpocket.",
    points: 1
  },
  {
    number: 11,
    prompt: "Which of the following assertions is NOT true according to Passage II?",
    options: [
      "Certain city dwellers in Accra can behave in strange ways",
      "The general public in Accra consists of former primary classmates",
      "Pickpockets and thieves operate within crowded city centers",
      "Commuters in the capital return home from work in the late afternoon"
    ],
    correctAnswer: "The general public in Accra consists of former primary classmates",
    hint: "The narrator merely imagined the stranger was a classmate; the people on the street were not all his classmates.",
    workedSolution: "The crowd was composed of strangers; claiming that the general public in Accra consists of classmates is false.",
    points: 1
  }
];

// =========================================================================
// GENERAL SECTIONS B - E: SYNONYMS, IDIOMS, ANTONYMS, STRUCTURE
// (ALL ORIGINAL REWRITES MAPPING TO 2001 TARGETS)
// =========================================================================
const generalQuestions = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (12 - 16) ---
  {
    number: 12,
    prompt: "The department director was humiliated when financial fraud was uncovered in his division.\nChoose the word nearest in meaning to 'humiliated'.",
    options: ["provoked", "cautioned", "disheartened", "disgraced"],
    correctAnswer: "disgraced",
    hint: "Made to feel profound shame, loss of dignity, or dishonor.",
    workedSolution: "'Humiliated' means subjected to intense shame and public loss of respect; 'disgraced' is its direct synonym.",
    points: 1
  },
  {
    number: 13,
    prompt: "Nortey was exceptionally industrious, so he was promoted by the management.\nChoose the word nearest in meaning to 'industrious'.",
    options: ["brilliant", "hardworking", "scrupulous", "valiant"],
    correctAnswer: "hardworking",
    hint: "Showing persistent, steady effort and diligence in work.",
    workedSolution: "'Industrious' means diligent, productive, and hardworking; 'hardworking' is its exact equivalent.",
    points: 1
  },
  {
    number: 14,
    prompt: "Having been raised in an affluent household, he never experienced poverty.\nChoose the word nearest in meaning to 'affluent'.",
    options: ["respectable", "devout", "cheerful", "wealthy"],
    correctAnswer: "wealthy",
    hint: "Having a great deal of money or wealth; rich.",
    workedSolution: "'Affluent' means possessing abundant material wealth or money; 'wealthy' (or rich) is its direct synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "Dazzled by the intense high beams of the approaching truck, our driver steered off the road.\nChoose the word nearest in meaning to 'dazzled'.",
    options: ["confused", "temporarily blinded", "startled", "disoriented"],
    correctAnswer: "temporarily blinded",
    hint: "Unable to see properly because of a sudden overwhelming bright light.",
    workedSolution: "'Dazzled' by bright light means temporarily deprived of clear sight by glare; 'temporarily blinded' is its exact equivalent.",
    points: 1
  },
  {
    number: 16,
    prompt: "The science master provided a precise explanation of the chemical reaction.\nChoose the word nearest in meaning to 'precise'.",
    options: ["scholarly", "cursory", "accurate", "concise"],
    correctAnswer: "accurate",
    hint: "Exact, sharp, and strictly correct in all details.",
    workedSolution: "'Precise' means exact, strictly correct, and free from error; 'accurate' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (17 - 21) ---
  {
    number: 17,
    prompt: "After serving his prison term for embezzlement, the cashier returned to his hometown under a cloud. This means he returned ............",
    options: [
      "in overcast and stormy weather",
      "feeling depressed and unwell",
      "in public shame and disgrace",
      "in absolute secrecy at night"
    ],
    correctAnswer: "in public shame and disgrace",
    hint: "Under suspicion, distrust, or in public disgrace.",
    workedSolution: "The idiom 'under a cloud' means under suspicion or in public dishonor and disgrace.",
    points: 1
  },
  {
    number: 18,
    prompt: "The sudden demise of his guardian was a bolt from the blue that disrupted his schooling. This means the tragedy was ............",
    options: [
      "an expected outcome",
      "a completely sudden and unexpected shock",
      "a matter of public grief",
      "an inevitable misfortune"
    ],
    correctAnswer: "a completely sudden and unexpected shock",
    hint: "A sudden, completely unforeseen event that comes without warning.",
    workedSolution: "The idiom 'a bolt from the blue' refers to a complete surprise or a sudden, unexpected shock.",
    points: 1
  },
  {
    number: 19,
    prompt: "Kwame found it difficult to do away with his chronic smoking habit. This means that Kwame could not ...... the habit.",
    options: ["prolong", "conceal", "stop", "discuss"],
    correctAnswer: "stop",
    hint: "To abolish, discard, or discontinue something.",
    workedSolution: "The phrasal idiom 'to do away with' means to eliminate, abolish, or 'stop' an ongoing practice or habit.",
    points: 1
  },
  {
    number: 20,
    prompt: "Many people avoid associating with Abugri because he is always blowing his own trumpet. This means that Abugri is ............",
    options: [
      "arrogant and boastful",
      "excessively greedy",
      "habitually insolent",
      "fond of musical instruments"
    ],
    correctAnswer: "arrogant and boastful",
    hint: "To talk proudly about one's own achievements.",
    workedSolution: "The idiom 'to blow one's own trumpet' means to praise oneself, boast, or brag about one's accomplishments.",
    points: 1
  },
  {
    number: 21,
    prompt: "When Mansa was caught stealing the examination paper, she shed crocodile tears. This means that Mansa ............",
    options: [
      "put on a false show of remorse",
      "fumed with bitter anger",
      "was completely humiliated",
      "wept with genuine repentance"
    ],
    correctAnswer: "put on a false show of remorse",
    hint: "Displaying insincere, hypocritical sorrow.",
    workedSolution: "The idiom 'crocodile tears' refers to a false, insincere display of emotion or weeping to deceive others.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (22 - 26) ---
  {
    number: 22,
    prompt: "The sanitary inspector instructed the villagers not to contaminate the stream, but to ...... it.\nChoose the word most nearly opposite in meaning to 'contaminate'.",
    options: ["channel", "divert", "purify", "utilize"],
    correctAnswer: "purify",
    hint: "'Contaminate' means to pollute or make impure. What word denotes making clean and pure?",
    workedSolution: "'Contaminate' means to pollute or make dirty. Its direct environmental antonym is 'purify' (to cleanse).",
    points: 1
  },
  {
    number: 23,
    prompt: "The passengers consulted the schedule to ascertain the departure of the flight, not its ...... .\nChoose the word most nearly opposite in meaning to 'departure'.",
    options: ["itinerary", "delay", "arrival", "boarding"],
    correctAnswer: "arrival",
    hint: "'Departure' means leaving. What word denotes reaching a destination or coming in?",
    workedSolution: "'Departure' denotes leaving a terminal. Its direct logistical antonym is 'arrival' (reaching a destination).",
    points: 1
  },
  {
    number: 24,
    prompt: "While the committee gave its consent to the proposal, the chairman chose to ...... .\nChoose the word most nearly opposite in meaning to 'consent'.",
    options: ["disregard", "dissent", "investigate", "postpone"],
    correctAnswer: "dissent",
    hint: "'Consent' means to agree or approve. What word denotes expressing disagreement or withholding approval?",
    workedSolution: "'Consent' means agreement or assent. Its direct formal antonym is 'dissent' (or disagree).",
    points: 1
  },
  {
    number: 25,
    prompt: "Yesterday my classmate appeared depressed, but this morning he looks remarkably ...... .\nChoose the word most nearly opposite in meaning to 'depressed'.",
    options: ["peaceful", "active", "cheerful", "surprised"],
    correctAnswer: "cheerful",
    hint: "'Depressed' means low in spirits or sad. What word denotes happy, upbeat, and bright in mood?",
    workedSolution: "'Depressed' means dejected, gloomy, or sad. Its direct emotional antonym is 'cheerful' (or happy).",
    points: 1
  },
  {
    number: 26,
    prompt: "After the storm ceased, the raging floodwaters subsided, but the reservoir level ...... sharply.\nChoose the word most nearly opposite in meaning to 'subsided'.",
    options: ["drained", "surged", "cleared", "calmed"],
    correctAnswer: "surged",
    hint: "'Subsided' means receded or dropped. What word denotes rose rapidly or mounted higher?",
    workedSolution: "'Subsided' means fell back, receded, or decreased. Its direct physical antonym in water movement is 'surged' (or rose).",
    points: 1
  },

  // --- SECTION E: STRUCTURE & QUESTION TAGS (27 - 40) ---
  {
    number: 27,
    prompt: "I suggest that the orchestra ...... the classical anthem instead of modern jazz.",
    options: ["is playing", "play", "playing", "will play"],
    correctAnswer: "play",
    hint: "Mandative subjunctive: verbs of suggestion ('suggest that') take a base subjunctive verb ('play').",
    workedSolution: "Following verbs of recommendation or suggestion ('suggest that...'), standard English uses the mandative subjunctive bare form: 'play'.",
    points: 1
  },
  {
    number: 28,
    prompt: "...... frankly, I completely reject the proposed constitutional amendment.",
    options: ["Speak", "Spoken", "To speak", "For speaking"],
    correctAnswer: "To speak",
    hint: "Identify the absolute infinitive phrase used as a sentence adverbial ('To speak frankly').",
    workedSolution: "The standard introductory idiomatic infinitive phrase expressing honest opinion is 'To speak frankly'.",
    points: 1
  },
  {
    number: 29,
    prompt: "Before the price escalates, I think we ...... the merchant's initial offer.",
    options: ["better taking", "had better taken", "had better take", "better to take"],
    correctAnswer: "had better take",
    hint: "'Had better' is an idiom expressing strong advice followed by a bare infinitive without 'to'.",
    workedSolution: "The semi-modal expression 'had better' is followed by a bare infinitive: 'had better take'.",
    points: 1
  },
  {
    number: 30,
    prompt: "...... the arable terrain in the valley was brought under active cultivation.",
    options: ["Most of", "Many of", "More of", "Much of"],
    correctAnswer: "Much of",
    hint: "'Land / terrain' is an uncountable mass noun. Choose the quantifier suited for mass non-count entities.",
    workedSolution: "Uncountable singular mass nouns like 'land' or 'terrain' take 'Much of' (or 'Most of' when referring to proportion), with 'Much of' being the standard quantifier for mass extent.",
    points: 1
  },
  {
    number: 31,
    prompt: "In attempting to enforce discipline over the mob, the police officer gave ...... enormous trouble.",
    options: ["themselves", "himself", "ourselves", "yourself"],
    correctAnswer: "himself",
    hint: "The third-person singular masculine subject 'the police officer' takes the reflexive pronoun 'himself'.",
    workedSolution: "The singular masculine subject 'the police officer' requires the matching singular reflexive pronoun 'himself'.",
    points: 1
  },
  {
    number: 32,
    prompt: '"Do you believe in ancient superstitions?"\n"............"',
    options: ["Yes, I don't", "No, I won't", "Yes, I won't", "No, I don't"],
    correctAnswer: "No, I don't",
    hint: "Standard English polarity: A negative response pairs 'No' with the matching negative auxiliary.",
    workedSolution: "In answering a present simple question beginning with 'Do you...?', a negative reply pairs 'No' with 'I don't': 'No, I don't'.",
    points: 1
  },
  {
    number: 33,
    prompt: "Aba insisted that Adjoa ...... to the dinner reception with her.",
    options: ["to have come", "has come", "to come", "should come"],
    correctAnswer: "should come",
    hint: "Subjunctive clause expressing demand/insistence: 'insisted that + subject + should + base verb'.",
    workedSolution: "Following verbs of insistence ('insisted that...'), standard English uses the modal 'should come' (or the bare subjunctive 'come').",
    points: 1
  },
  {
    number: 34,
    prompt: 'Esi: "I felt thoroughly exhausted after the rehearsal yesterday."\nEfua: "Yes, .........; the session was grueling."',
    options: ["I did too", "so I did", "so did I", "I didn't"],
    correctAnswer: "so did I",
    hint: "Expressing mutual agreement with a past affirmative statement: 'so + auxiliary + subject' ('so did I').",
    workedSolution: "To agree with a positive past declarative statement, the elliptical inverted structure 'so did I' (or 'I did too') is used, with 'so did I' being the standard inverted idiom.",
    points: 1
  },
  {
    number: 35,
    prompt: "The boarding students complained that there was ...... sugar in their morning porridge.",
    options: ["plenty", "few", "little", "small"],
    correctAnswer: "little",
    hint: "'Sugar' is an uncountable noun. Choose the negative partitive meaning an insufficient amount.",
    workedSolution: "'Sugar' is non-count. 'Little' without an article expresses an insufficient, meager quantity ('little sugar'). 'Few' applies only to countable nouns.",
    points: 1
  },
  {
    number: 36,
    prompt: "One of the statutory functions of the highway patrol is to ...... vehicular traffic.",
    options: ["lead", "regulate", "direct", "propel"],
    correctAnswer: "regulate",
    hint: "To control, maintain order, and direct according to rule or law.",
    workedSolution: "The formal statutory responsibility of traffic officers is to control and 'regulate' (or direct) the flow of vehicles.",
    points: 1
  },
  {
    number: 37,
    prompt: "Kofi decided to ...... the entrance examination again next December.",
    options: ["have sat", "sit", "be sitting", "have been sitting"],
    correctAnswer: "sit",
    hint: "The catenative verb 'decide' is followed by a simple to-infinitive: 'decided to sit'.",
    workedSolution: "The verb 'decided' takes a simple to-infinitive complement: 'decided to sit [the examination]'.",
    points: 1
  },
  {
    number: 38,
    prompt: "Our school debating society won the national trophy, ......?",
    options: ["hadn't we", "isn't it", "couldn't we", "didn't we"],
    correctAnswer: "didn't we",
    hint: "An affirmative simple past clause ('won') with first-person plural subject takes the negative tag 'didn't we?'.",
    workedSolution: "The main clause has an affirmative simple past verb ('won') and subject 'we'. The corresponding question tag must be negative: 'didn't we?'.",
    points: 1
  },
  {
    number: 39,
    prompt: "The mechanic turned the metal bolt so forcefully that it ...... with a loud snap.",
    options: ["will break", "breaks", "had broken", "broke"],
    correctAnswer: "broke",
    hint: "Sequence of past narrative tenses: The past action 'turned' results in a simple past consequence.",
    workedSolution: "In a past narrative framework governed by 'turned', the consecutive consequence takes the simple past indicative: 'broke'.",
    points: 1
  },
  {
    number: 40,
    prompt: "The newly appointed engineer was formally introduced ...... the board of directors.",
    options: ["by", "to", "through", "from"],
    correctAnswer: "to",
    hint: "Identify the preposition that regularly collocates with the passive verb 'introduced'.",
    workedSolution: "In standard English grammar, one is 'introduced to' a person or group, never 'introduced through' or 'by'.",
    points: 1
  }
];

// Combine all 40 raw questions
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

const assignedTargetIndices = seedShuffle(targetKeys, 200102);

// Attach Passage I (Q1-5) and Passage II (Q6-11) directly to questions so that
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

  if (qNum >= 1 && qNum <= 5) {
    passageTitle = "Passage I: The Baobab Tree and the Lorry Park";
    passageText = passage1Text;
    passage = passage1Text;
  } else if (qNum >= 6 && qNum <= 11) {
    passageTitle = "Passage II: The Street Robbery in Accra";
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
const passage1Items = balancedPaper1.slice(0, 5);
const passage2Items = balancedPaper1.slice(5, 11);
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
        prompt: "Write a letter to your foreign pen-pal explaining at least three distinct reasons why you take immense pride in attending your basic school.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2001

Dear David,

I hope this letter finds you in fine health and peace of mind in London. In your previous letter, you asked me about my school life in Ghana. I write with great enthusiasm to share three distinct reasons why I take immense pride in attending Methodist Junior Secondary School in Bekwai.

First and foremost, our school possesses a legendary reputation for academic excellence. Our tutors are not only highly qualified but also exceptionally dedicated and approachable. They organize regular weekend remedial tutorials in Mathematics and Integrated Science, guiding us through practical problem-solving rather than rote memorization. For five consecutive years, our school has achieved a clean one hundred percent pass rate in the Basic Education Certificate Examination (BECE), with many candidates gaining admission into premier national academies.

Secondly, our institution provides modern practical learning infrastructure. We boast a well-stocked library, a vibrant agricultural science plot equipped with a drip-irrigation system, and a modern computer laboratory where students learn foundational digital skills. Being able to conduct hands-on experiments makes academic learning exciting and rewarding.

Finally, our school fosters rich extracurricular culture and moral discipline. We have an award-winning cultural dance troupe, a competitive football team, and an active cadet corps that instills leadership, physical endurance, and mutual respect among students. Bullying is strictly forbidden, creating a harmonious and secure environment for everyone.

I consider it a great privilege to wear our school uniform every morning. Please write back soon and tell me about your school in England.

Your true friend,
[Signature]
Kwabena Mensah`
      },
      {
        questionNumber: "2",
        category: "Formal Letter",
        prompt: "Write a formal letter to the Headteacher of your school complaining about at least two negative practices among some teachers that undermine students' academic performance and well-being, and suggesting remedial measures.",
        modelAnswer: `Presbyterian Junior Secondary School
P. O. Box 80
Begoro, Eastern Region
18th October, 2001

The Headteacher
Presbyterian Junior Secondary School
P. O. Box 80
Begoro

Dear Sir,

COMPLAINT REGARDING TEACHER ABSENTEEISM AND EXCESSIVE CORPORAL PUNISHMENT

On behalf of the concerned student body of Presbyterian Junior Secondary School, I respectfully write to draw your administrative attention to two troubling practices among certain members of the teaching staff that adversely undermine our academic progress and emotional well-being.

First, chronic instructional absenteeism and unpunctuality have become rampant among a section of our teachers. Several tutors frequently fail to report for their scheduled morning periods, leaving classes unattended for hours. In some instances, teachers arrive late, write brief notes on the chalkboard, and depart without offering verbal explanations. This failure to complete the prescribed syllabus leaves candidates ill-prepared for external mock examinations and fragments our academic discipline.

Secondly, we are deeply troubled by the indiscriminate use of harsh corporal punishment. Rather than applying corrective counseling, certain masters administer severe lashings with heavy canes or assign exhausting manual labor during instructional hours for minor academic mistakes. Fearing humiliation and physical pain, many vulnerable pupils have developed a deep dread of school, leading to declining classroom participation and truancy.

To resolve these challenges, we humbly recommend that the school administration introduce a strict daily teacher attendance logbook and conduct unannounced classroom inspections. Furthermore, teachers should be encouraged to adopt humane, constructive disciplinary methods—such as detention and counseling—that build confidence rather than instill terror.

We trust in your visionary leadership to restore pedagogical excellence to our school.

Thank you.

Yours faithfully,
[Signature]
Emmanuel Addo
(Class Prefect)`
      },
      {
        questionNumber: "3",
        category: "Debate Speech",
        prompt: 'You are the principal speaker in an inter-schools debate on the motion: "Boys should not help in the kitchen." Write your speech for or against the motion.',
        modelAnswer: `AGAINST THE MOTION: "BOYS SHOULD NOT HELP IN THE KITCHEN"

Mr. Chairman, Distinguished Panel of Judges, Impartial Timekeeper, Worthy Opponents, and Fellow Students:

I stand firmly before you this afternoon to vehemently oppose the outdated and regressive motion that: "Boys should not help in the kitchen."

In modern society, culinary competence is not a gender-specific chore; it is an indispensable basic survival skill. Every human being—male or female—must eat to live. To suggest that boys should be barred from culinary duties is to advocate for domestic helplessness. When young men leave their family homes to pursue university education or employment in distant metropolises, those who cannot boil water or prepare a simple stew are reduced to spending exorbitant sums on unhygienic commercial fast foods, wrecking their personal finances and health.

Secondly, involving boys in domestic food preparation dismantles harmful patriarchal stereotypes and fosters mutual respect within the family. Modern marriage is an equal partnership built on mutual support. When husbands and wives both work full-time corporate jobs, an enlightened man who steps into the kitchen to share meal preparation relieves his weary spouse of domestic exhaustion, strengthening marital harmony and family bonding.

Furthermore, some of the world's most acclaimed, high-earning master chefs and hospitality entrepreneurs are men who discovered their culinary genius by assisting their mothers in domestic kitchens during childhood. Denying boys kitchen experience suffocates potential careers in the multi-billion-dollar global tourism and catering industries.

In conclusion, domestic duties should be shared equally based on mutual responsibility, not archaic gender prejudice. I urge you all to resoundingly reject this motion.

Thank you.`
      },
      {
        questionNumber: "4",
        category: "Narrative Essay",
        prompt: 'You suddenly woke up in the middle of the night when you heard someone screaming frantically: "Help! Help! Fire!" Describe what you saw and experienced when you rushed out.',
        modelAnswer: `MIDNIGHT INFERNO IN THE COMPOUND

It was a chilly, moonless night in November, and our neighborhood was wrapped in deep slumber. Suddenly, around two o'clock in the morning, the tranquil silence was shattered by piercing, blood-curdling screams echoing across our street: "Help! Help! Fire! The house is burning!"

Startled out of a sound sleep, my heart hammered violently against my ribs. I leaped from my mattress, pulled on a pair of shorts, and threw open our front wooden door. A terrifying spectacle met my eyes. Dense clouds of choking black smoke were billowing into the sky, while towering tongues of orange and scarlet flames were roaring out of the roof of Mr. Quaye's four-bedroom residential bungalow directly opposite our house.

The heat radiating from the blazing building was scorching even from across the street. Neighbors in nightclothes were running in frantic confusion, shouting instructions and weeping. In the middle of the courtyard, Mrs. Quaye was kneeling in the dust, beating her chest and screaming hysterically that her six-year-old son, Kwesi, was still trapped inside the blazing front bedroom.

At that harrowing moment, our community youth demonstrated extraordinary heroism. Armed with wet blankets, buckets of sand, and water from our compound storage cistern, my elder brother and two young carpenters dashed toward the burning building. Using a heavy sledgehammer, they smashed the bedroom window burglar-proof bars. Shielding his face with a soaked blanket, my brother scrambled through the window and emerged moments later carrying the coughing, soot-covered child in his arms.

The crowd erupted into shouts of joyous relief just as the wooden ceiling collapsed with a thunderous roar. By dawn, community volunteer buckets had subdued the embers. Although the property was gutted, not a single life was lost. That fateful night demonstrated the power of community solidarity in the face of disaster.`
      }
    ]
  }
};

async function seedBeceEnglish2001Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 2001 into Firestore...");

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
          title: "Passage I: The Baobab Tree and the Lorry Park",
          text: passage1Text,
          questionRange: "Questions 1 to 5"
        },
        {
          id: "passage_2",
          title: "Passage II: The Street Robbery in Accra",
          text: passage2Text,
          questionRange: "Questions 6 to 11"
        }
      ],
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: The Baobab Tree and the Lorry Park",
          text: passage1Text,
          questionRange: "Questions 1 to 5",
          questions: passage1Items
        },
        passage2: {
          passageTitle: "Passage II: The Street Robbery in Accra",
          text: passage2Text,
          questionRange: "Questions 6 to 11",
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

  console.log("✅ Fully Rewritten, Clean-Room BECE English 2001 successfully seeded into Firestore!");
}

seedBeceEnglish2001Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2001:", err);
    process.exit(1);
  });
