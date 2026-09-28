import * as admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

async function getFirestoreDb(): Promise<admin.firestore.Firestore> {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const adminInst = (admin as any)?.apps ? admin : ((admin as any)?.default || require('firebase-admin'));
    if (!adminInst?.apps?.length) {
      adminInst.initializeApp({
        credential: adminInst.credential.applicationDefault(),
        projectId: 'gamedu-69888475-f5783'
      });
    }
    return adminInst.firestore();
  }

  // Use Firebase CLI OAuth credentials when running locally
  const { OAuth2Client } = require('google-auth-library');
  const { Firestore } = require('@google-cloud/firestore');
  const auth = require('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
  const account = auth.getGlobalDefaultAccount();
  const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
  const oauthClient = new OAuth2Client();
  oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
  return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient }) as any;
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
// 40 OBJECTIVE QUESTIONS: LEXIS, STRUCTURE, AVIATION CLOZE & ORAL PHONOLOGY
// =========================================================================
const allRawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "The rescue task force ............ for the missing mountaineers for four hours when the fog finally lifted.",
    options: [
      "has been searching",
      "had been searching",
      "have searched",
      "was searching"
    ],
    correctAnswer: "had been searching",
    hint: "Past Perfect Progressive: An ongoing action occurring over a duration prior to another past event ('when the fog lifted').",
    workedSolution: "The temporal marker 'for four hours when the fog lifted' denotes a continuing action prior to a completed past milestone, requiring the Past Perfect Progressive: 'had been searching'.",
    points: 1
  },
  {
    number: 2,
    prompt: "Barely had the referee sounded the whistle ............ the jubilant supporters invaded the pitch.",
    options: ["than", "then", "when", "before"],
    correctAnswer: "when",
    hint: "Correlative negative time inversion: 'Barely had...' and 'Hardly had...' strictly pair with 'when'.",
    workedSolution: "In standard English correlative temporal inversions, 'Barely had...' is strictly paired with 'when' (not 'than', which belongs to 'no sooner').",
    points: 1
  },
  {
    number: 3,
    prompt: "Our national sports contingent was led by an agile, ............",
    options: [
      "tall young Ghanaian athlete",
      "Ghanaian tall young athlete",
      "young tall Ghanaian athlete",
      "tall Ghanaian young athlete"
    ],
    correctAnswer: "tall young Ghanaian athlete",
    hint: "Cumulative adjective ordering: Size/Dimension ('tall') precedes Age ('young') which precedes Origin/Nationality ('Ghanaian') before the noun.",
    workedSolution: "Standard English cumulative adjective ordering places size ('tall') before age ('young') followed by nationality ('Ghanaian'): 'tall young Ghanaian athlete'.",
    points: 1
  },
  {
    number: 4,
    prompt: "Diplomatic personnel and their nuclear families are completely exempt ............ paying municipal property taxes.",
    options: ["against", "of", "from", "with"],
    correctAnswer: "from",
    hint: "Identify the dependent preposition that regularly collocates with the adjective 'exempt'.",
    workedSolution: "In standard English collocations, the adjective 'exempt' takes the preposition 'from': 'exempt from paying taxes'.",
    points: 1
  },
  {
    number: 5,
    prompt: "A sudden violent ............ of wind blew off the rusted zinc roof of the junior laboratory.",
    options: ["blow", "gust", "burst", "sheet"],
    correctAnswer: "gust",
    hint: "Identify the specific partitive noun that collocates naturally with sudden blasts of wind.",
    workedSolution: "In standard English idiomatic usage, a sudden, brief rush of wind is partitively measured as a 'gust of wind'.",
    points: 1
  },
  {
    number: 6,
    prompt: "The senior master ............ the award was presented to gave an inspiring address.",
    options: ["who", "whom", "which", "whose"],
    correctAnswer: "whom",
    hint: "Objective relative pronoun governed by the preposition 'to' positioned at the end of the relative clause.",
    workedSolution: "The relative pronoun functions as the object of the preposition 'to' (the award was presented to him), requiring objective case 'whom': 'The senior master whom the award was presented to...'.",
    points: 1
  },
  {
    number: 7,
    prompt: "Supposing the presidential candidate ............ the election, what would be his party's next plan?",
    options: ["lost", "loses", "has lost", "will lose"],
    correctAnswer: "lost",
    hint: "Hypothetical conditional: 'Supposing' introducing an unreal or hypothetical situation takes a simple past subjunctive verb.",
    workedSolution: "Following 'Supposing' introducing a hypothetical scenario with 'would' in the main clause, standard grammar requires the simple past tense: 'Supposing the candidate lost...'.",
    points: 1
  },
  {
    number: 8,
    prompt: "The selection committee ............ sharply divided in their individual assessments of the candidates.",
    options: ["was", "were", "is", "has been"],
    correctAnswer: "were",
    hint: "Collective noun concord: When individual members of a collective group act separately (emphasized by 'their individual assessments'), the verb is plural.",
    workedSolution: "The plural possessive determiner 'their' and the context of internal disagreement indicate that the collective noun 'committee' is viewed as individuals, requiring plural 'were'.",
    points: 1
  },
  {
    number: 9,
    prompt: "Before embarking on the cross-country cycling tour, Kwesi had his road bicycle ............ by the mechanic.",
    options: ["service", "servicing", "serviced", "to service"],
    correctAnswer: "serviced",
    hint: "Causative structure: have + object + past participle (passive causative indicating an action done by another person).",
    workedSolution: "In passive causative constructions expressing an action performed by someone else ('had + object'), the past participle is required: 'had his bicycle serviced'.",
    points: 1
  },
  {
    number: 10,
    prompt: "Not only did the candidates excel in the written papers, ............ they also swept all the sports trophies.",
    options: ["and", "so", "but", "yet"],
    correctAnswer: "but",
    hint: "Correlative coordinating conjunction pairing: 'Not only...' is strictly completed by 'but also'.",
    workedSolution: "The standard English correlative conjunction formula is 'Not only ... but also': 'Not only did they excel, but they also swept...'.",
    points: 1
  },
  {
    number: 11,
    prompt: "The reclusive artisan hardly speaks to visitors, ............ he?",
    options: ["doesn't", "does", "did", "didn't"],
    correctAnswer: "does",
    hint: "Semi-negative adverbs like 'hardly' give the main clause negative polarity, requiring an affirmative present question tag.",
    workedSolution: "The adverb 'hardly' renders the clause semantically negative. With simple present lexical verb 'speaks', the corresponding tag must be affirmative: 'does he?'.",
    points: 1
  },
  {
    number: 12,
    prompt: "On his way to the market, the farmer stopped ............ the village chief at the palace.",
    options: ["greeting", "to greet", "greet", "greeted"],
    correctAnswer: "to greet",
    hint: "The verb 'stop' followed by a to-infinitive indicates pausing an action in order to perform another action.",
    workedSolution: "'Stop + to-infinitive' indicates interrupting an activity in order to do something else: 'stopped to greet the chief'. ('Stop greeting' would mean ceasing the act of greeting).",
    points: 1
  },
  {
    number: 13,
    prompt: "Every pupil in the examination hall was instructed to bring ............ own mathematical set.",
    options: ["their", "his or her", "its", "our"],
    correctAnswer: "their",
    hint: "Standard modern and WAEC usage employs the gender-neutral singular pronoun 'their' to refer back to distributive indefinite pronouns like 'Every pupil'.",
    workedSolution: "In contemporary standard English and modern WAEC examination rubrics, singular distributive antecedents like 'Every pupil' are referenced by singular epicene 'their': 'bring their own mathematical set'.",
    points: 1
  },
  {
    number: 14,
    prompt: "............ I in your circumstances, I would decline the offer without hesitating.",
    options: ["Was", "Were", "Am", "Be"],
    correctAnswer: "Were",
    hint: "Inverted Second Conditional: 'Were I...' replaces 'If I were...', expressing a hypothetical counterfactual state.",
    workedSolution: "In formal inverted Second Conditional clauses without 'if', the subjunctive form 'Were' moves before the subject: 'Were I in your circumstances...'.",
    points: 1
  },
  {
    number: 15,
    prompt: "The headmistress deeply sympathized ............ the bereaved family during the memorial service.",
    options: ["for", "with", "at", "about"],
    correctAnswer: "with",
    hint: "Identify the dependent preposition that regularly collocates with the verb 'sympathize'.",
    workedSolution: "In standard English grammatical collocations, the verb 'sympathize' takes the preposition 'with': 'sympathized with the bereaved family'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The senior prefect's disciplinary record throughout his three years was impeccable.\nChoose the word nearest in meaning to 'impeccable'.",
    options: ["flawless", "popular", "remarkable", "attractive"],
    correctAnswer: "flawless",
    hint: "Free from fault or blame; perfect in standard and execution.",
    workedSolution: "'Impeccable' means without defect, error, or fault; 'flawless' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "The distinguished novelist was known as a prolific writer across West Africa.\nChoose the word nearest in meaning to 'prolific'.",
    options: ["creative", "productive", "famous", "wealthy"],
    correctAnswer: "productive",
    hint: "Producing much fruit, foliage, or intellectual works in large quantities.",
    workedSolution: "'Prolific' describes an author or artist who produces abundant work; 'productive' is its exact equivalent.",
    points: 1
  },
  {
    number: 18,
    prompt: "All members of the arbitration panel concurred with the chairman's recommendation.\nChoose the word nearest in meaning to 'concurred'.",
    options: ["argued", "disagreed", "agreed", "hesitated"],
    correctAnswer: "agreed",
    hint: "Be of the same opinion; agree with another party.",
    workedSolution: "'Concurred' means shared the identical opinion or harmonized; 'agreed' is its direct synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "A dependable supply of clean water is indispensable for hospital sanitation.\nChoose the word nearest in meaning to 'indispensable'.",
    options: ["vital", "helpful", "desirable", "expensive"],
    correctAnswer: "vital",
    hint: "Absolutely necessary; essential and incapable of being omitted.",
    workedSolution: "'Indispensable' means absolutely essential and necessary; 'vital' is its direct synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "The candidates were apprehensive about the impending release of the national examination results.\nChoose the word nearest in meaning to 'apprehensive'.",
    options: ["curious", "anxious", "doubtful", "unhappy"],
    correctAnswer: "anxious",
    hint: "Anxious or fearful that something bad or unpleasant will happen.",
    workedSolution: "'Apprehensive' means feeling nervous, fearful, or 'anxious' about future developments; 'anxious' is its exact synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "By accusing the bursar of the missing stationery, the prefect was barking up the wrong tree. This means the prefect was ............",
    options: [
      "making excessive noise on campus",
      "pursuing a completely mistaken line of thought or accusation",
      "demanding an audit investigation",
      "hiding behind the classroom trees"
    ],
    correctAnswer: "pursuing a completely mistaken line of thought or accusation",
    hint: "To pursue a mistaken line of thought or be wrong about the cause or person responsible.",
    workedSolution: "The idiom 'to bark up the wrong tree' means to follow a false trail, pursue a mistaken course of action, or accuse the wrong person.",
    points: 1
  },
  {
    number: 22,
    prompt: "After fighting against bankruptcy for two years, the commercial farmer threw in the towel. This means the farmer ............",
    options: [
      "bought new towels for his laborers",
      "surrendered and admitted defeat",
      "relocated his poultry pens",
      "appealed to the commercial bank for loans"
    ],
    correctAnswer: "surrendered and admitted defeat",
    hint: "To admit defeat or quit trying in the face of insurmountable difficulties.",
    workedSolution: "The idiom 'to throw in the towel' derives from boxing and means to give up, surrender, or admit defeat.",
    points: 1
  },
  {
    number: 23,
    prompt: "When the headmaster discovered the shattered library louvers, he hit the ceiling. This means the headmaster ............",
    options: [
      "jumped up in sports jubilation",
      "became violently and uncontrollably angry",
      "ordered immediate carpentry repairs",
      "climbed a ladder to inspect the roof"
    ],
    correctAnswer: "became violently and uncontrollably angry",
    hint: "To explode with extreme anger or fly into a furious rage.",
    workedSolution: "The idiom 'to hit the ceiling' (or hit the roof) means to become intensely, violently angry.",
    points: 1
  },
  {
    number: 24,
    prompt: "Aba promised to keep the examination scholarship news under her hat. This means Aba resolved to ............",
    options: [
      "conceal the information in secret",
      "purchase a new ceremonial hat",
      "write the news on a piece of paper",
      "disclose the story to her parents only"
    ],
    correctAnswer: "conceal the information in secret",
    hint: "To keep something secret and confidential.",
    workedSolution: "The idiom 'to keep something under one's hat' means to keep information confidential and strictly secret.",
    points: 1
  },
  {
    number: 25,
    prompt: "To pass the national BECE with distinction, Mensah burned the midnight oil throughout the term. This means Mensah ............",
    options: [
      "wasted kerosene lanterns carelessly",
      "studied diligently late into the night",
      "worked on the farm at night",
      "suffered from sleeplessness"
    ],
    correctAnswer: "studied diligently late into the night",
    hint: "To work or study late into the night.",
    workedSolution: "The idiom 'to burn the midnight oil' means to study or work hard late into the night hours.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "While the junior boys accepted the chores reluctantly, the volunteers worked ...... .\nChoose the word most nearly opposite in meaning to 'reluctantly'.",
    options: ["eagerly", "boldly", "calmly", "proudly"],
    correctAnswer: "eagerly",
    hint: "'Reluctantly' means with hesitation, unwillingness, or disinclination. What word denotes with keen enthusiasm and willingness?",
    workedSolution: "'Reluctantly' means unwillingly. Its direct behavioral antonym is 'eagerly' (with enthusiasm and readiness).",
    points: 1
  },
  {
    number: 27,
    prompt: "During the severe dry spell, clean water was scarce, but after the cloudburst it became ...... .\nChoose the word most nearly opposite in meaning to 'scarce'.",
    options: ["pure", "fresh", "plentiful", "accessible"],
    correctAnswer: "plentiful",
    hint: "'Scarce' means insufficient, rare, or hard to find. What word denotes existing in copious, abundant supply?",
    workedSolution: "'Scarce' means in short supply. Its direct quantitative antonym is 'plentiful' (abundant).",
    points: 1
  },
  {
    number: 28,
    prompt: "The turbulent waters of the coastal estuary contrast sharply with the ...... lake.\nChoose the word most nearly opposite in meaning to 'turbulent'.",
    options: ["tranquil", "shallow", "clean", "narrow"],
    correctAnswer: "tranquil",
    hint: "'Turbulent' means stormy, violently agitated, or rough. What word denotes peaceful, quiet, and calm?",
    workedSolution: "'Turbulent' means violently agitated or rough. Its direct physical antonym describing water or conditions is 'tranquil' (calm and peaceful).",
    points: 1
  },
  {
    number: 29,
    prompt: "While the prefect was quick to praise good conduct, he did not hesitate to ...... misconduct.\nChoose the word most nearly opposite in meaning to 'praise'.",
    options: ["punish", "censure", "ignore", "report"],
    correctAnswer: "censure",
    hint: "'Praise' means to express warm approval or admiration. What formal word denotes to express severe disapproval or reprimand?",
    workedSolution: "'Praise' means to commend. Its direct formal antonym in moral evaluation is 'censure' (to criticize harshly or condemn).",
    points: 1
  },
  {
    number: 30,
    prompt: "The old regulations were unyielding and rigid, whereas the new policies are remarkably ...... .\nChoose the word most nearly opposite in meaning to 'rigid'.",
    options: ["lenient", "flexible", "mild", "simple"],
    correctAnswer: "flexible",
    hint: "'Rigid' means strict, inflexible, and unalterable. What word denotes adaptable to new circumstances and pliable?",
    workedSolution: "'Rigid' in policy contexts means unbending or inflexible. Its direct administrative antonym is 'flexible' (adaptable).",
    points: 1
  },

  // --- SECTION E: CLOZE PASSAGE (AVIATION & AIR TRAVEL REGISTER) (31 - 35) ---
  {
    number: 31,
    prompt: "Cloze Passage: \"The overseas delegation arrived at the international airport's departure ---31--- three hours before the scheduled flight.\"\nChoose the most suitable word:",
    options: ["terminal", "hangar", "depot", "station"],
    correctAnswer: "terminal",
    hint: "The main building at an airport where passenger departures and arrivals are processed is the terminal.",
    workedSolution: "In civil aviation, the passenger processing complex is designated as the airport 'terminal'.",
    points: 1
  },
  {
    number: 32,
    prompt: "Cloze Passage: \"After presenting their passports, the passengers received their official ---32--- showing their assigned seat rows and departure gates.\"\nChoose the most suitable word:",
    options: ["tickets", "boarding passes", "flight receipts", "vouchers"],
    correctAnswer: "boarding passes",
    hint: "The official card or document issued at check-in permitting a passenger to board an aircraft is a boarding pass.",
    workedSolution: "The specific document authorizing entry onto the aircraft at the gate is the 'boarding pass'.",
    points: 1
  },
  {
    number: 33,
    prompt: "Cloze Passage: \"The airline ground attendants weighed their heavy baggage, which was officially ---33--- into the cargo hold of the aircraft.\"\nChoose the most suitable word:",
    options: ["loaded", "checked in", "registered", "locked"],
    correctAnswer: "checked in",
    hint: "The formal aviation term for surrendering luggage to an airline for carriage in the aircraft hold: 'checked in'.",
    workedSolution: "In airline passenger processing, baggage delivered for hold carriage is formally 'checked in'.",
    points: 1
  },
  {
    number: 34,
    prompt: "Cloze Passage: \"The passengers boarded the shuttle bus that transported them across the wide asphalt ---34--- to the waiting jetliner.\"\nChoose the most suitable word:",
    options: ["runway", "apron", "tarmac", "corridor"],
    correctAnswer: "tarmac",
    hint: "The paved area at an airport outside the gates where airplanes park and passengers embark is commonly called the tarmac.",
    workedSolution: "The paved ground surface at an airport where aircraft are parked and boarded is standardly designated as the 'tarmac' (or apron).",
    points: 1
  },
  {
    number: 35,
    prompt: "Cloze Passage: \"Shortly after takeoff, the commercial aircraft leveled out smoothly at its assigned ---35--- of 35,000 feet.\"\nChoose the most suitable word:",
    options: ["speed", "cruising altitude", "flight distance", "elevation"],
    correctAnswer: "cruising altitude",
    hint: "The steady, level flight height maintained by an airplane during the middle portion of a flight: cruising altitude.",
    workedSolution: "In aviation terminology, the designated level flight height maintained by an aircraft in transit is its 'cruising altitude'.",
    points: 1
  },

  // --- PART B: ORAL LANGUAGE & PHONOLOGY (36 - 40) ---
  {
    number: 36,
    prompt: "Choose the word that contains the identical voiced post-alveolar fricative consonant sound as the underlined sound in:\n\"The artist had an extraordinary **vi<u>si</u>on**.\"",
    options: ["measure", "pressure", "action", "nation"],
    correctAnswer: "measure",
    hint: "The sound in 'vision' is the voiced post-alveolar fricative /ʒ/. 'Measure' (/ˈmeʒ.ər/) contains the exact identical /ʒ/ sound.",
    workedSolution: "The word 'vision' contains the voiced fricative /ʒ/ (/ˈvɪʒ.ən/). Among the options, 'measure' (/ˈmeʒ.ər/) contains the identical /ʒ/ sound, whereas the others contain voiceless /ʃ/.",
    points: 1
  },
  {
    number: 37,
    prompt: "Choose the word that contains the identical diphthong sound as the underlined vowel in:\n\"The merchant dropped a golden **c<u>oi</u>n** into the chest.\"",
    options: ["boy", "cone", "dawn", "bone"],
    correctAnswer: "boy",
    hint: "The vowel in 'coin' is the closing diphthong /ɔɪ/. 'Boy' (/bɔɪ/) contains the identical /ɔɪ/ diphthong.",
    workedSolution: "'Coin' is pronounced /kɔɪn/ with the diphthong /ɔɪ/. 'Boy' shares the exact identical /ɔɪ/ diphthong.",
    points: 1
  },
  {
    number: 38,
    prompt: "Choose the word that shares the identical final consonant cluster sound as:\n\"The students arranged their wooden **de<u>sks</u>**.\"",
    options: ["masks", "masts", "clasps", "paths"],
    correctAnswer: "masks",
    hint: "'Desks' ends in the voiceless velar-alveolar consonant cluster /sks/. 'Masks' (/mɑːsks/) ends in the identical /sks/ cluster.",
    workedSolution: "'Desks' terminates in the consonant cluster /sks/. 'Masks' shares the exact identical /sks/ cluster.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which of the following words contains a SILENT consonant letter that is not sounded in standard pronunciation?",
    options: ["calm", "cold", "clam", "cult"],
    correctAnswer: "calm",
    hint: "In this word meaning peaceful or quiet, the letter 'l' preceding 'm' is completely silent.",
    workedSolution: "In 'calm' (pronounced /kɑːm/), the consonant letter 'l' is completely silent, unlike in 'cold', 'clam', and 'cult' where /l/ is fully voiced.",
    points: 1
  },
  {
    number: 40,
    prompt: "When the polar question \"Did you lock the administrative offices?\" is asked in standard English, what intonation contour is normally used?",
    options: [
      "Falling intonation",
      "Rising intonation",
      "Rise-fall intonation",
      "Level intonation"
    ],
    correctAnswer: "Rising intonation",
    hint: "Standard Yes/No questions in English normally terminate with a rising pitch contour (↗).",
    workedSolution: "In English suprasegmental phonology, open polar questions expecting a 'yes' or 'no' response normally conclude with a terminal rising intonation contour (↗).",
    points: 1
  }
];

// Seeded Deterministic Shuffle across 40 Objective Items: Exactly 10 A, 10 B, 10 C, 10 D
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

const assignedTargetIndices = seedShuffle(targetKeys, 202604);

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
    title: "Part A: Writing (Composition)",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Formal Letter",
        prompt: "Write a formal letter to your District Police Commander, complaining about the increasing incidents of cyber-fraud and theft within your community, and proposing at least two practical measures the police service can implement to protect residents.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2026

The District Police Commander
Ghana Police Service
District Police Headquarters, Bekwai

Dear Sir,

PETITION REGARDING ESCALATING CYBER-FRAUD AND THEFT IN OUR COMMUNITY

On behalf of the students, small-scale traders, and residents of the Bekwai Municipality, I respectfully submit this petition to draw your urgent attention to the alarming surge in digital mobile money fraud and burglary in our neighborhood, and to suggest two practical police interventions to curb the menace.

Over the past three months, several organized criminal syndicates have targeted vulnerable rural citizens within our municipality. Deceitful scammers impersonate telecommunication network agents, systematically hacking into mobile money wallets and draining the life savings of elderly pensioners and illiterate petty traders. Furthermore, coordinated break-ins targeting mobile phone retail kiosks and internet communication cafes have become rampant after midnight, creating an atmosphere of widespread anxiety and financial devastation.

To effectively combat this modern criminal enterprise, I suggest, first, that the District Police Command establish a Specialized Cyber-Crime and Mobile Fraud Intelligence Unit. This unit should partner with telecommunication network operators to rapidly track and block flagged mobile money numbers, freeze fraudulent bank accounts, and apprehend perpetrators before stolen funds can be laundered.

Secondly, the police service should intensify nocturnal foot and vehicular patrols across commercial centers and residential avenues. Establishing prominent police visibility checkpoints near mobile money vendor clusters and dark street junctions will deter burglars and reassure citizens. Additionally, conducting bi-weekly public sensitization campaigns at local market squares and community radio stations will educate residents on securing their confidential transaction PINs.

We count on your prompt leadership to restore security and peace of mind in our community.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Youth Secretary)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in your school magazine on the topic: \"The Impact of Artificial Intelligence and Modern Educational Software on Student Learning in Junior High Schools.\"",
        modelAnswer: `HARNESSING ARTIFICIAL INTELLIGENCE FOR EDUCATIONAL EXCELLENCE
By Samuel K. Boateng, Begoro

The twenty-first century is witnessing an extraordinary technological transformation driven by Artificial Intelligence (AI) and modern digital educational applications. In previous generations, basic school students relied exclusively on physical textbooks and teacher-delivered lectures. Today, the integration of interactive digital software into junior high education offers revolutionary opportunities to democratize learning and accelerate student comprehension.

First and foremost, AI-powered learning applications provide personalized, self-paced academic tutoring. In a traditional basic classroom containing fifty or more pupils, teachers cannot possibly cater to the unique cognitive learning speed of every child. Digital educational platforms solve this handicap by automatically assessing a learner's strengths and weaknesses in subjects like Mathematics and Integrated Science. If a student struggles with algebraic equations, the software provides tailored step-by-step interactive drills, instant feedback, and visual diagrams until mastery is achieved. This individualized instruction builds student confidence and eliminates the fear of quantitative subjects.

Secondly, digital educational tools make abstract scientific concepts vivid and accessible. Through virtual laboratory simulations, students can observe chemical reactions, explore internal cellular biology in three dimensions, and simulate planetary orbits without requiring expensive physical apparatus. This practical immersion stimulates inquisitive curiosity, sharpens analytical problem-solving skills, and prepares young minds for STEM careers.

However, to prevent digital software from becoming a distraction, school authorities must guide students to use AI tools responsibly as intellectual tutors rather than shortcuts for plagiarizing homework assignments.

Artificial Intelligence is not a replacement for human educators; it is a powerful catalyst that, when harnessed with discipline, unlocks boundless intellectual potential.`
      },
      {
        questionNumber: "3",
        category: "Narrative Moral Story",
        prompt: "Write an engaging, realistic story that illustrates the traditional proverb: \"Pride goes before a fall.\"",
        modelAnswer: `PRIDE GOES BEFORE A FALL

In our basic school, my classmate, Richmond, was blessed with exceptional academic brilliance and athletic speed. He topped our class in all subjects and anchored our school relay team to multiple regional victories. However, Richmond's outstanding talents were completely overshadowed by his unbearable pride, arrogance, and contempt for others.

He strutted around the compound boasting that he was an invincible genius who did not require revision or teacher guidance. He mocked struggling classmates, ridiculed our hardworking teachers' chalkboard notes, and refused to participate in morning preparatory studies, scoffing arrogantly: "Examinations are for ordinary minds; champions like me pass without breaking a sweat!" Our wise class tutor, Master Asiedu, continually warned him that "pride goes before a fall," but Richmond dismissed the counsel with disdain.

The day of reckoning arrived during the Annual Inter-District Academic and Track Championships. Overconfident and arrogant, Richmond spent the night before the event playing video games on his phone, skipping dinner, and drinking ice water. When he arrived at the stadium, he refused to warm up with the squad, openly sneering at his competitors.

During the final 400-meter sprint, the starting pistol sounded. Richmond surged ahead, looking back mockingly to laugh at his pursuers. Suddenly, fifty meters from the finish line, violent muscle cramps seized his dehydrated legs. His knees buckled, and he collapsed headlong onto the cinder track with a sickening thud, groaning in agony as his humble competitors sprinted past him to the finish line.

Carried off the track on a stretcher amidst the pitying glances of onlookers, Richmond wept bitter tears of humiliation. His arrogance had cost him the national trophy. Sitting quietly by his dispensary bed, the ancient truth resonated in my heart: Truly, pride goes before a fall.`
      }
    ]
  },
  partB_comprehension: {
    title: "Part B: Reading Comprehension",
    instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
    passageText: `In the contemporary era of global commerce and technological convenience, plastics have become an ubiquitous fixture of human existence. From grocery sachets and drinking bottles to industrial packaging and domestic containers, this versatile synthetic material offers lightweight, waterproof, and inexpensive solutions for packaging commodities. However, this modern convenience has extracted a devastating environmental price, transforming plastic pollution into one of the most perilous ecological crises of the twenty-first century.

The primary root of this crisis lies in the chemical composition of plastics. Because standard plastics are manufactured from synthetic petroleum polymers, they are non-biodegradable. Unlike organic waste such as plantain peels or paper that decompose naturally within weeks, a single plastic bottle requires over four hundred years to break down. Consequently, virtually every piece of plastic ever produced still persists somewhere on our planet.

In developing urban settlements across West Africa, the consequences of improper plastic disposal are catastrophic. Municipal gutters, storm culverts, and natural waterways are severely choked with millions of single-use black polythene bags and water sachets. Whenever torrential downpours strike, stormwater cannot drain through these plastic-clogged arteries. The resulting flash floods submerge residential roads, destroy commercial infrastructure, and cause tragic loss of human lives. Furthermore, stagnant water trapped in discarded plastic containers creates prolific breeding nurseries for mosquitoes, triggering acute outbreaks of malaria and cholera.

The crisis is equally devastating in marine and aquatic ecosystems. Thousands of metric tons of plastic waste are washed into ocean lagoons annually. Marine animals—such as sea turtles, dolphins, and coastal seabirds—frequently mistake translucent polythene bags for jellyfish, ingesting them with fatal consequences. Over time, physical ocean waves break large plastic debris down into microscopic particles known as microplastics. These toxic particles are swallowed by fish, entering the human food chain and posing grave hazards of cellular toxicity and malignant cancers to consumers.

Environmental scientists emphasize that relying solely on volunteer beach clean-ups is merely scratching the surface. To avert catastrophe, governments must enact strict legislation banning single-use non-essential plastics, mandate corporate producers to take back plastic packaging, and subsidize eco-friendly, biodegradable alternatives derived from cassava starch and plant fibers.`,
    questions: [
      {
        subQuestion: "(a)",
        question: "State two distinct properties of plastics that make them popular in global commerce according to the passage.",
        answer: "Plastics are lightweight, waterproof, inexpensive, and versatile."
      },
      {
        subQuestion: "(b)",
        question: "Why does plastic waste remain in the natural environment for centuries without disappearing?",
        answer: "Because plastics are manufactured from synthetic petroleum polymers that are non-biodegradable and cannot decompose naturally."
      },
      {
        subQuestion: "(c)",
        question: "Mention two major urban hazards caused by plastic-clogged gutters during heavy rainfall.",
        answer: "1. Destructive flash floods that submerge roads and destroy infrastructure.\n2. Creation of stagnant water breeding grounds for disease-carrying mosquitoes."
      },
      {
        subQuestion: "(d)",
        question: "How do plastic pollutants enter the human food chain according to the fourth paragraph?",
        answer: "Plastic debris breaks down into microplastics in the ocean, which are ingested by fish that humans subsequently catch and consume."
      },
      {
        subQuestion: "(e)",
        question: "Explain the meaning of the following expressions as used in the passage:\nI. ... ubiquitous fixture;\nII. ... scratching the surface;\nIII. ... avert catastrophe.",
        answer: "I. 'ubiquitous fixture' means present everywhere; extremely common and widespread.\nII. 'scratching the surface' means dealing only with a tiny, superficial part of a deep, complicated problem.\nIII. 'avert catastrophe' means to prevent, avoid, or turn away a disastrous outcome."
      },
      {
        subQuestion: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. versatile;\nII. perilous;\nIII. arteries;\nIV. legislation.",
        answer: "I. versatile: adaptable, multi-purpose, flexible, all-round.\nII. perilous: dangerous, hazardous, risky, treacherous.\nIII. arteries: channels, conduits, waterways, passages.\nIV. legislation: laws, statutes, acts, regulations."
      },
      {
        subQuestion: "(g)",
        question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the two major interventions needed to solve plastic pollution.",
        answer: "1. Governments must ban single-use plastics strictly.\n2. Industries must adopt biodegradable plant alternatives."
      }
    ]
  },
  partC_literature: {
    title: "Part C: Literature in English (The Beacon of Light Anthology)",
    instructions: "Answer all questions in this part based on the prescribed selections from the NaCCA Common Core Programme anthology: The Beacon of Light.",
    questions: [
      {
        sectionTitle: "CHARLES DICKENS: Oliver Twist (Chapter 2: Oliver Asks for More)",
        contextExtract: "\"The master aimed a blow at Oliver’s head with the ladle; pinioned him in his arms; and shrieked aloud for the beadle. An animated discussion then took place. Oliver was ordered into instant confinement; and a bill was next morning pasted on the outside of the gate, offering a reward of five pounds to anybody who would take Oliver Twist off the hands of the parish.\"",
        subItems: [
          {
            subQuestion: "5(a)",
            question: "What physical punishment was immediately inflicted on Oliver by the workhouse master?",
            answer: "The master struck him violently on the head with the ladle and pinned him in his arms before shouting for Mr. Bumble the beadle."
          },
          {
            subQuestion: "5(b)",
            question: "What does the parish offering a five-pound reward on the gate reveal about their attitude toward pauper orphans?",
            answer: "It reveals that the parish authorities viewed pauper children as unwanted financial burdens and nuisances to be disposed of as cheap labor rather than cared for."
          }
        ]
      },
      {
        sectionTitle: "CONTEMPORARY DRAMA: Spreading Light",
        contextExtract: "\"UNCLE ATO: (Looking at the solar panel setup in the compound, scratching his head) She’s the brain behind this? A young girl from this village wired the whole inverter?\nSIR NII: The hope and future of this village lies in her hands, Uncle Ato. When we empower our daughters with tools and books, darkness flees our homes.\"",
        subItems: [
          {
            subQuestion: "5(c)",
            question: "Identify the hyperbole used by Uncle Ato in describing Asantewaa's influence.",
            answer: "Hyperbole: 'The hope and future of this village lies in her hands' (exaggerating her individual role to emphasize the transformative power of her leadership)."
          },
          {
            subQuestion: "5(d)",
            question: "How does Asantewaa's technological success challenge traditional gender stereotypes in her rural community?",
            answer: "She shatters the prejudice that electrical engineering and STEM innovation are reserved for men, demonstrating that young rural women can lead technical solutions."
          }
        ]
      },
      {
        sectionTitle: "HISTORICAL POETRY: The Golden Stool / Okomfo Anokye",
        contextExtract: "\"With whispered incantations, he calls\nA treasure from the celestial halls;\n'Treasure of infinite worth,' the elders cry,\nA 'symbol of power beyond them all' descending from the sky.\"",
        subItems: [
          {
            subQuestion: "5(e)",
            question: "Identify the figure of speech used in the phrase 'Treasure of infinite worth' and explain its meaning.",
            answer: "Hyperbole. It deliberately exaggerates the Golden Stool's value to convey that its spiritual, historical, and unifying importance is boundless and beyond material calculation."
          },
          {
            subQuestion: "5(f)",
            question: "What did the Golden Stool symbolize for the dispersed Akan states assembled at Kumasi?",
            answer: "It symbolized supreme authority, political unity, ancestral protection, and the collective soul (Sunsum) binding all Akan clans into a unified nation."
          }
        ]
      },
      {
        sectionTitle: "PHILOSOPHICAL POETRY: The Unseen Painter",
        contextExtract: "\"A pregnant woman in the sun\nOr a woman with a cuddled child in the sun;\nThe divine artist touches the canvas of life,\nWeaving generation to generation through love and strife.\"",
        subItems: [
          {
            subQuestion: "5(g)",
            question: "What do the images of 'A pregnant woman' and 'a cuddled child' symbolize in the poem?",
            answer: "They symbolize fertility, maternal care, generational continuity, and the ongoing creation of new life orchestrated by the Creator."
          },
          {
            subQuestion: "5(h)",
            question: "What is the tone of the speaker in this excerpt?",
            answer: "Reverent, contemplative, tender, and celebratory of life's sacred design."
          }
        ]
      },
      {
        sectionTitle: "PROSE NARRATIVE: Beyond Light and Shadow",
        contextExtract: "\"Benson’s eyes, once bright with hope, dimmed with the realization that his secrets had destroyed the bond they shared. The school compound was silent, yet inside him, the whispers of Ashes Flame sounded like rattling chains.\"",
        subItems: [
          {
            subQuestion: "5(i)",
            question: "What internal conflict is Benson experiencing in this scene?",
            answer: "He is torn between his genuine affection and respect for Tina Bells and the guilt of his secret complicity as an operative within the Ashes Flame cabal."
          },
          {
            subQuestion: "5(j)",
            question: "Explain the simile 'the whispers of Ashes Flame sounded like rattling chains'.",
            answer: "It compares the psychological control of the student cabal to heavy prison chains, emphasizing that his criminal secrets were entrapping and enslaving his conscience."
          }
        ]
      }
    ]
  }
};

async function seedBeceEnglishMock4() {
  console.log("Seeding Isolated BECE English Mock 4 into Firestore with Beacon of Light curriculum...");

  // Key Balance Audit
  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  balancedPaper1.forEach((q) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log("Verified Key Balance across 40 Objective Items (Exactly 10 each):", keyDist);

  const db = await getFirestoreDb();

  // Strictly partitioned path: subjects/english/mocks/mock_4
  const docRef = db.doc("global_curriculum/jhs/subjects/english/mocks/mock_4");
  await docRef.set({
    mockId: "mock_4",
    mockNumber: 4,
    title: "BECE English Language National Mock Examination 4",
    subjectId: "english",
    examType: "mock",
    metadata: {
      isPastQuestion: false,
      isMockExam: true,
      standard: "NaCCA / WAEC BECE Standard",
      totalMarks: 100,
      totalDurationMinutes: 135,
      paper1Count: balancedPaper1.length,
      optionsBalanced: true,
      unplagiarizedPedagogicalAdaptation: true,
      hasBeaconOfLightLiterature: true,
      hasOralLanguageComponent: true,
      strictSubjectIsolation: "english_only",
      updatedAt: new Date()
    },
    paper1: {
      title: "Paper 1: Objective Test (Lexis, Structure, Cloze, and Oral Language)",
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
        },
        sectionE_cloze_passage: {
          title: "Section E: Aviation and Air Travel Cloze Passage",
          questionRange: "Questions 31 to 35",
          questions: balancedPaper1.slice(30, 35)
        },
        partB_oral_language: {
          title: "Part B: Oral Language & Phonology",
          questionRange: "Questions 36 to 40",
          questions: balancedPaper1.slice(35, 40)
        }
      },
      allQuestions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Written Essay, Reading Comprehension, and Literature",
      durationMinutes: 90,
      sections: paper2Calibrated
    }
  }, { merge: true });

  console.log("✅ BECE English Mock 4 successfully updated with Beacon of Light at subjects/english/mocks/mock_4!");
}

seedBeceEnglishMock4()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed BECE English Mock 4:", err);
    process.exit(1);
  });
