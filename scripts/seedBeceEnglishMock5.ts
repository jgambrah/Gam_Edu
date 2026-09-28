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
// 40 OBJECTIVE QUESTIONS: LEXIS, STRUCTURE, BANKING CLOZE & ORAL PHONOLOGY
// =========================================================================
const allRawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "Had the night guards not fallen asleep at their posts, the armed burglars ............ the vault.",
    options: [
      "will not have breached",
      "would not have breached",
      "would not breach",
      "did not breach"
    ],
    correctAnswer: "would not have breached",
    hint: "Third Conditional negative inversion: 'Had the night guards not fallen asleep' requires 'would not have + past participle' in the main clause.",
    workedSolution: "In a formal inverted Third Conditional construction, the main clause requires a modal past perfect: 'would not have breached'.",
    points: 1
  },
  {
    number: 2,
    prompt: "The audit committee strictly insisted that the suspended bursar ............ his resignation forthwith.",
    options: ["tenders", "tender", "tendered", "should have tendered"],
    correctAnswer: "tender",
    hint: "Mandative Subjunctive: Verbs of demand or insistence ('insisted that') take a base bare infinitive without third-person '-s'.",
    workedSolution: "Following verbs of demanding, insisting, or recommending followed by 'that', the mandative subjunctive uses the base verb form: 'insisted that the bursar tender'.",
    points: 1
  },
  {
    number: 3,
    prompt: "The conference auditorium in ............ the international education summit took place has been renovated.",
    options: ["where", "which", "whom", "what"],
    correctAnswer: "which",
    hint: "Relative pronoun governed directly by a fronted preposition of place ('in').",
    workedSolution: "Following a preposition of location ('in'), standard prescriptive grammar strictly requires the relative pronoun 'which': 'in which the summit took place'. ('Where' cannot follow a preposition).",
    points: 1
  },
  {
    number: 4,
    prompt: "While on the savannah safari, the tourists observed a magnificent ............ of lions resting under an acacia tree.",
    options: ["pack", "herd", "pride", "flock"],
    correctAnswer: "pride",
    hint: "Identify the specific collective noun that designates a social group of lions.",
    workedSolution: "In standard English zoological collective nouns, a family group of lions is designated as a 'pride of lions'.",
    points: 1
  },
  {
    number: 5,
    prompt: "Several curious ............ stopped to assist the stranded commercial driver.",
    options: [
      "passer-bys",
      "passers-by",
      "passer-by",
      "passers-bys"
    ],
    correctAnswer: "passers-by",
    hint: "Pluralize the principal base noun in a hyphenated compound noun formed with a preposition.",
    workedSolution: "In compound nouns linked with prepositions, the plural inflection '-s' is attached to the primary base noun ('passer'): 'passers-by'.",
    points: 1
  },
  {
    number: 6,
    prompt: "The errant school prefect ............ to be cautioned by the disciplinary board.",
    options: ["need", "needs", "is needing", "has need"],
    correctAnswer: "needs",
    hint: "When 'need' functions as a lexical verb taking a to-infinitive, it takes third-person singular '-s' in the simple present.",
    workedSolution: "When used as a full lexical verb followed by a full to-infinitive ('to be cautioned'), 'need' inflects for third-person singular: 'The errant prefect needs to be cautioned'.",
    points: 1
  },
  {
    number: 7,
    prompt: "The quality of local unpolished rice is in no way inferior ............ imported brands.",
    options: ["than", "from", "to", "with"],
    correctAnswer: "to",
    hint: "Latin comparative adjectives (inferior, superior, junior, senior) collocate strictly with 'to', never 'than'.",
    workedSolution: "Comparative adjectives of Latin origin like 'inferior' strictly take the preposition 'to': 'inferior to imported brands'.",
    points: 1
  },
  {
    number: 8,
    prompt: "Neither the headmaster nor the senior subject tutors ............ present at the zonal athletic competition yesterday.",
    options: ["was", "is", "were", "are"],
    correctAnswer: "were",
    hint: "Proximity rule with 'neither... nor': In the past tense, the verb agrees in number with the nearer plural subject ('the senior subject tutors').",
    workedSolution: "When subjects are linked by 'neither... nor', the verb agrees in number with the closer subject ('senior subject tutors', plural). Governed by past time ('yesterday'), the correct verb is 'were'.",
    points: 1
  },
  {
    number: 9,
    prompt: "Active: \"The junior pupils laughed at the comical clown.\"\nPassive: \"The comical clown ............ by the junior pupils.\"",
    options: [
      "was laughed",
      "was laughed at",
      "is laughed at",
      "had been laughed at"
    ],
    correctAnswer: "was laughed at",
    hint: "Passive transformation of prepositional verbs: The dependent preposition ('at') must be retained immediately after the past participle.",
    workedSolution: "In passive voice transformations of prepositional verbs ('laughed at'), the preposition remains intact: 'The clown was laughed at by the pupils'.",
    points: 1
  },
  {
    number: 10,
    prompt: "Because of economic inflation, our family is seriously contemplating ............ to the countryside.",
    options: ["to relocate", "relocating", "relocate", "relocated"],
    correctAnswer: "relocating",
    hint: "The catenative verb 'contemplate' takes a gerund complement (verb-ing).",
    workedSolution: "In standard English syntax, the verb 'contemplate' requires a gerund complement: 'contemplating relocating to the countryside'.",
    points: 1
  },
  {
    number: 11,
    prompt: "Under no circumstances ............ disclose confidential examination papers to unauthorized persons.",
    options: [
      "you should",
      "should you",
      "you must",
      "did you"
    ],
    correctAnswer: "should you",
    hint: "Negative prepositional phrase fronting ('Under no circumstances') triggers subject-auxiliary inversion.",
    workedSolution: "When a sentence begins with an emphatic negative phrase ('Under no circumstances'), standard English requires subject-auxiliary inversion: 'should you disclose'.",
    points: 1
  },
  {
    number: 12,
    prompt: "The regional education director is a close personal confidant of ............",
    options: ["him", "his", "he", "himself"],
    correctAnswer: "his",
    hint: "Double possessive construction: 'a [noun] of' requires an absolute possessive pronoun.",
    workedSolution: "The double possessive structure ('a confidant of...') requires the independent possessive pronoun 'his': 'a close personal confidant of his'.",
    points: 1
  },
  {
    number: 13,
    prompt: "Auntie Araba seldom visits the commercial capital these days, ............ she?",
    options: ["doesn't", "does", "is", "isn't"],
    correctAnswer: "does",
    hint: "The broad negative adverb 'seldom' gives the main clause negative polarity, requiring an affirmative present question tag.",
    workedSolution: "The adverb 'seldom' makes the statement semantically negative. With simple present lexical verb 'visits', the matching tag must be affirmative: 'does she?'.",
    points: 1
  },
  {
    number: 14,
    prompt: "The museum curator showcased a ............ writing desk from the colonial era.",
    options: [
      "splendid antique mahogany",
      "antique splendid mahogany",
      "mahogany splendid antique",
      "splendid mahogany antique"
    ],
    correctAnswer: "splendid antique mahogany",
    hint: "Cumulative adjective ordering: Opinion/Evaluation ('splendid') precedes Age ('antique') which precedes Material ('mahogany') before the noun.",
    workedSolution: "Standard English cumulative adjective ordering places subjective evaluation ('splendid') before age ('antique') followed by material origin ('mahogany'): 'splendid antique mahogany writing desk'.",
    points: 1
  },
  {
    number: 15,
    prompt: "Following the high court trial, the innocent clerk was completely acquitted ............ all embezzlement charges.",
    options: ["from", "with", "of", "against"],
    correctAnswer: "of",
    hint: "Identify the dependent preposition that regularly collocates with the legal verb 'acquitted'.",
    workedSolution: "In standard legal collocations, an accused person is 'acquitted of' charges: 'acquitted of all charges'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The entire township revered the retired physician for his selfless medical charity.\nChoose the word nearest in meaning to 'revered'.",
    options: ["feared", "venerated", "praised", "flattered"],
    correctAnswer: "venerated",
    hint: "Regarded with deep respect, honor, awe, or veneration.",
    workedSolution: "'Revered' means regarded with profound respect and awe; 'venerated' is its direct literary synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "The bus came to an abrupt standstill when the stray calf darted onto the highway.\nChoose the word nearest in meaning to 'abrupt'.",
    options: ["sudden", "harsh", "violent", "awkward"],
    correctAnswer: "sudden",
    hint: "Sudden and unexpected; hasty or without warning.",
    workedSolution: "'Abrupt' means sudden, unexpected, or precipitate; 'sudden' is its direct synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "Our grandmother lived a remarkably frugal life, avoiding all frivolous spending.\nChoose the word nearest in meaning to 'frugal'.",
    options: ["stingy", "thrifty", "humble", "poor"],
    correctAnswer: "thrifty",
    hint: "Economical and prudent in the use of food and resources; sparing.",
    workedSolution: "'Frugal' means prudent, economical, and careful with resources; 'thrifty' is its positive direct synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "The repetitive manual sorting of cocoa beans proved to be a monotonous chore.\nChoose the word nearest in meaning to 'monotonous'.",
    options: ["tedious", "painful", "demanding", "difficult"],
    correctAnswer: "tedious",
    hint: "Dull, tedious, repetitious, and lacking in variety.",
    workedSolution: "'Monotonous' describes an activity that is boringly repetitious; 'tedious' is its direct synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "Navigating an unlit wooden canoe across flooded rapids places life in grave peril.\nChoose the word nearest in meaning to 'peril'.",
    options: ["danger", "fear", "misfortune", "distress"],
    correctAnswer: "danger",
    hint: "Serious and immediate danger, hazard, or jeopardy.",
    workedSolution: "'Peril' means exposed to imminent hazard, destruction, or risk; 'danger' is its exact equivalent.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "To master the demanding calculus curriculum, Kwesi decided to burn the midnight oil. This means that Kwesi ............",
    options: [
      "wasted kerosene unnecessarily",
      "studied diligently late into the night",
      "worked on the farm at night",
      "suffered from chronic insomnia"
    ],
    correctAnswer: "studied diligently late into the night",
    hint: "To work, read, or study late into the night hours.",
    workedSolution: "The idiom 'to burn the midnight oil' means to study or work hard late into the night.",
    points: 1
  },
  {
    number: 22,
    prompt: "The clan elders advised the feuding siblings to let sleeping dogs lie. This means the siblings should ............",
    options: [
      "avoid disturbing their pets",
      "avoid restarting old quarrels or disputes",
      "reconcile their differences immediately",
      "relocate to separate villages"
    ],
    correctAnswer: "avoid restarting old quarrels or disputes",
    hint: "To avoid interfering in a situation that is currently calm to prevent fresh trouble.",
    workedSolution: "The idiom 'to let sleeping dogs lie' means to leave a situation undisturbed so as not to reignite old conflicts or trouble.",
    points: 1
  },
  {
    number: 23,
    prompt: "The underdog debater threw down the gauntlet to the reigning champions. This means the debater ............",
    options: [
      "dropped his notes nervously",
      "issued an open challenge to a contest",
      "conceded defeat before the debate",
      "insulted the adjudication panel"
    ],
    correctAnswer: "issued an open challenge to a contest",
    hint: "To issue a challenge or invite someone to fight or compete.",
    workedSolution: "The idiom 'to throw down the gauntlet' derives from chivalry and means to issue an open challenge to a contest.",
    points: 1
  },
  {
    number: 24,
    prompt: "Having violated school regulations repeatedly, the truant was summoned to face the music. This means the truant had to ............",
    options: [
      "perform in the school choir",
      "accept the unpleasant consequences of his actions",
      "listen to the headmaster's radio",
      "sing before the morning assembly"
    ],
    correctAnswer: "accept the unpleasant consequences of his actions",
    hint: "To accept the unpleasant results or punishment for one's actions.",
    workedSolution: "The idiom 'to face the music' means to confront reality and accept the unpleasant consequences or punishment for what one has done.",
    points: 1
  },
  {
    number: 25,
    prompt: "By spreading malicious falsehoods about his political rival's family, the candidate hit below the belt. This means the candidate ............",
    options: [
      "physically assaulted his opponent",
      "acted or fought unfairly in violation of rules",
      "withdrew from the electoral race",
      "demanded an apology"
    ],
    correctAnswer: "acted or fought unfairly in violation of rules",
    hint: "To act unfairly or disregard the rules of fair play.",
    workedSolution: "The idiom 'to hit below the belt' originates in boxing and means to behave or attack in an unfair, dishonorable manner.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "While the veteran sentry remained vigilant throughout the storm, the novice guard was ...... .\nChoose the word most nearly opposite in meaning to 'vigilant'.",
    options: ["careful", "complacent", "fearful", "restless"],
    correctAnswer: "complacent",
    hint: "'Vigilant' means keeping careful watch for possible danger. What word denotes self-satisfied, uncritical, and careless of potential hazards?",
    workedSolution: "'Vigilant' means watchful and alert. Its direct behavioral antonym is 'complacent' (uncritical, smugly careless, and off-guard).",
    points: 1
  },
  {
    number: 27,
    prompt: "Fame in popular culture is often ephemeral, whereas artistic masterpieces are ...... .\nChoose the word most nearly opposite in meaning to 'ephemeral'.",
    options: ["eternal", "brief", "popular", "modest"],
    correctAnswer: "eternal",
    hint: "'Ephemeral' means lasting for a very short time; fleeting. What word denotes lasting forever without end?",
    workedSolution: "'Ephemeral' means fleeting or short-lived. Its direct temporal and philosophical antonym is 'eternal' (enduring forever).",
    points: 1
  },
  {
    number: 28,
    prompt: "While our grandfather was exceptionally frugal with money, his eldest son was remarkably ...... .\nChoose the word most nearly opposite in meaning to 'frugal'.",
    options: ["extravagant", "generous", "thrifty", "wealthy"],
    correctAnswer: "extravagant",
    hint: "'Frugal' means sparing and economical with money. What word denotes spending money excessively or wastefully?",
    workedSolution: "'Frugal' means economical and prudent. Its direct financial antonym is 'extravagant' (wasteful, lavish, and spendthrift).",
    points: 1
  },
  {
    number: 29,
    prompt: "The mathematics instructor's revised explanation was lucid, whereas his preliminary notes were ...... .\nChoose the word most nearly opposite in meaning to 'lucid'.",
    options: ["brief", "obscure", "complicated", "simple"],
    correctAnswer: "obscure",
    hint: "'Lucid' means expressed clearly; easy to understand. What word denotes unclear, dim, and difficult to comprehend?",
    workedSolution: "'Lucid' means clear, bright, and easy to comprehend. Its direct intellectual antonym is 'obscure' (unclear and vague).",
    points: 1
  },
  {
    number: 30,
    prompt: "The specialist verified that the tissue growth was benign, rather than ...... .\nChoose the word most nearly opposite in meaning to 'benign'.",
    options: ["painful", "malignant", "acute", "fatal"],
    correctAnswer: "malignant",
    hint: "'Benign' in clinical medicine means not harmful or non-cancerous. What word denotes infectious, invasive, and cancerous?",
    workedSolution: "In pathology and clinical medicine, the direct antonym of 'benign' (non-cancerous/harmless) is 'malignant' (cancerous and virulent).",
    points: 1
  },

  // --- SECTION E: CLOZE PASSAGE (BANKING & FINANCIAL OPERATIONS) (31 - 35) ---
  {
    number: 31,
    prompt: "Cloze Passage: \"Upon entering the commercial banking hall, the customer presented his cash deposit slip to the bank ---31--- at the service counter.\"\nChoose the most suitable word:",
    options: ["teller", "cashier", "clerk", "accountant"],
    correctAnswer: "teller",
    hint: "The specific employee in a commercial bank who receives deposits and pays out money at the counter is a teller.",
    workedSolution: "In formal commercial banking register, the staff member stationed at the customer counter handling deposits and withdrawals is the 'teller'.",
    points: 1
  },
  {
    number: 32,
    prompt: "Cloze Passage: \"The transaction was verified and recorded electronically in the bank's general ---32--- to update the account balance.\"\nChoose the most suitable word:",
    options: ["register", "ledger", "logbook", "journal"],
    correctAnswer: "ledger",
    hint: "The principal computerized or physical book of accounts in which financial transactions are recorded is the ledger.",
    workedSolution: "In financial accounting and banking, the master record containing credit and debit account balances is the 'ledger'.",
    points: 1
  },
  {
    number: 33,
    prompt: "Cloze Passage: \"When applying for a commercial loan, the borrower pledged his residential building deed as ---33--- to secure the credit.\"\nChoose the most suitable word:",
    options: ["security", "collateral", "guarantee", "mortgage"],
    correctAnswer: "collateral",
    hint: "Property or assets pledged by a borrower as security for the repayment of a loan is collateral.",
    workedSolution: "In banking and credit jurisprudence, an asset pledged to secure a loan facility is formally termed 'collateral'.",
    points: 1
  },
  {
    number: 34,
    prompt: "Cloze Passage: \"Over the five-year investment tenure, substantial compound interest had ---34--- on the fixed deposit account.\"\nChoose the most suitable word:",
    options: ["increased", "grown", "accrued", "expanded"],
    correctAnswer: "accrued",
    hint: "In financial terminology, interest or dividends that accumulate or are added over time have accrued.",
    workedSolution: "The formal financial verb for interest or monetary entitlements accumulating periodically over time is 'accrued'.",
    points: 1
  },
  {
    number: 35,
    prompt: "Cloze Passage: \"Because the trading firm failed to meet its monthly installment obligations, the enterprise ---35--- on the credit agreement.\"\nChoose the most suitable word:",
    options: ["failed", "defaulted", "declined", "breached"],
    correctAnswer: "defaulted",
    hint: "The formal banking term for failing to fulfill a financial loan obligation or debt repayment schedule.",
    workedSolution: "In banking and finance, failing to satisfy the legal terms of a loan repayment is formally termed 'defaulted': 'defaulted on the credit agreement'.",
    points: 1
  },

  // --- PART B: ORAL LANGUAGE & PHONOLOGY (36 - 40) ---
  {
    number: 36,
    prompt: "Choose the word that contains the identical voiceless palato-alveolar affricate consonant sound as the underlined sound in:\n\"We must preserve pristine **na<u>tu</u>re**.\"",
    options: ["creature", "nation", "soldier", "measure"],
    correctAnswer: "creature",
    hint: "The 'tu' in 'nature' produces the affricate consonant sound /tʃ/. 'Creature' (/ˈkriː.tʃər/) contains the exact identical /tʃ/ sound.",
    workedSolution: "The word 'nature' is pronounced /ˈneɪ.tʃər/ containing the affricate /tʃ/. 'Creature' (/ˈkriː.tʃər/) shares the identical /tʃ/ consonant sound.",
    points: 1
  },
  {
    number: 37,
    prompt: "Choose the word that contains the identical centering diphthong sound as the underlined vowel in:\n\"The students gathered to **p<u>ee</u>r** through the microscope.\"",
    options: ["fear", "pair", "pierce", "pure"],
    correctAnswer: "fear",
    hint: "The vowel in 'peer' is the centering diphthong /ɪə/. 'Fear' (/fɪə/) contains the identical diphthong sound.",
    workedSolution: "The word 'peer' is pronounced /pɪər/ with the centering diphthong /ɪə/. 'Fear' (/fɪər/) contains the exact identical vowel sound /ɪə/.",
    points: 1
  },
  {
    number: 38,
    prompt: "Choose the word that shares the identical final consonant cluster sound as:\n\"The statutory decree **exe<u>mpts</u>** registered charities from taxation.\"",
    options: ["attempts", "tents", "plants", "stamps"],
    correctAnswer: "attempts",
    hint: "'Exempts' terminates in the consonant cluster /mpts/ (or /mps/). 'Attempts' (/əˈtempts/) ends in the identical /mpts/ cluster.",
    workedSolution: "'Exempts' terminates in the complex voiceless cluster /mpts/. 'Attempts' shares the exact identical /mpts/ consonant cluster.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which of the following words contains a SILENT consonant letter that is not voiced in standard pronunciation?",
    options: ["receipt", "reptile", "rapid", "repeat"],
    correctAnswer: "receipt",
    hint: "In this commercial document confirming payment, the letter 'p' before 't' is completely silent.",
    workedSolution: "In 'receipt' (pronounced /rɪˈsiːt/), the consonant letter 'p' is completely silent.",
    points: 1
  },
  {
    number: 40,
    prompt: "When the statement \"I might agree, under certain strict conditions\" is uttered with a prominent FALL-RISE INTONATION contour (↘↗), what attitude is expressed?",
    options: [
      "Absolute certainty",
      "Reservation or conditional doubt",
      "Definite finality",
      "Aggressive anger"
    ],
    correctAnswer: "Reservation or conditional doubt",
    hint: "A fall-rise pitch contour in standard English typically communicates hesitation, reservation, or conditional agreement.",
    workedSolution: "In English suprasegmental phonology, a fall-rise intonation contour (↘↗) signals limited agreement, hesitation, reservation, or conditional doubt.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 202605);

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
        prompt: "Write a formal letter to your Municipal Chief Executive (MCE), drawing attention to the deplorable state of public sanitation and unauthorized refuse dumps in your community, and proposing at least two practical measures the municipal assembly can adopt to resolve the environmental crisis.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2026

The Municipal Chief Executive
Bekwai Municipal Assembly
Municipal Directorate, Bekwai

Dear Sir,

PETITION REGARDING DEPLORABLE COMMUNITY SANITATION AND UNAUTHORIZED DUMPSITES

On behalf of the youth, market women, and residents of the Bekwai Municipality, I respectfully submit this petition to draw your urgent attention to the alarming crisis of public sanitation and unauthorized refuse dumps in our neighborhood, and to propose two practical municipal interventions to restore environmental cleanliness.

Over the past four months, overflowing municipal garbage skips located near our commercial market squares and basic school compounds have been left uncollected for weeks. Consequently, massive mounds of decomposing domestic waste and plastic debris spill onto pedestrian walkways and open drainage ditches. During heavy downpours, this foul sludge chokes storm culverts, causing contaminated runoff to submerge residential compounds. The resulting swarm of flies and foul stench have triggered recurrent outbreaks of cholera, typhoid, and malaria, hospitalizing dozens of infants and students.

To resolve this public health menace, I suggest, first, that the Municipal Assembly enforce a Decentralized Waste Management System by contracting private waste logistics operators to conduct bi-weekly door-to-door trash collection. Placing color-coded, covered communal collection bins at designated, fenced transfer stations across every electoral area will eliminate open dumping.

Secondly, the assembly must revive and strictly enforce Municipal Environmental Sanitation Bylaws. Environmental health officers should conduct unannounced weekly sanitary inspections, imposing spot fines on recalcitrant landlords who fail to provide domestic latrines or who dump garbage into gutters. Furthermore, organizing mandatory monthly communal cleanup exercises backed by local traditional councils will restore civic pride and hygiene.

We count on your prompt leadership to safeguard our health and dignity.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Youth Secretary)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in a national daily newspaper on the topic: \"The Impact of Excessive Smartphone Screen Time on Adolescent Mental Health and Academic Performance in Ghana.\"",
        modelAnswer: `BREAKING THE DIGITAL SHACKLES: SMARTPHONES AND ADOLESCENT WELFARE
By Samuel K. Boateng, Begoro

The twenty-first century has witnessed an extraordinary revolution in handheld telecommunications, placing powerful internet-connected smartphones into the hands of millions of Ghanaian basic and secondary school students. While digital connectivity offers valuable academic research tools, the alarming addiction to excessive smartphone screen time has emerged as a severe crisis undermining adolescent mental health and scholastic performance.

The foremost tragedy resulting from digital screen addiction is the acute fragmentation of students' attention spans and academic momentum. Adolescents spend six to eight continuous hours daily scrolling through ephemeral social media videos, video games, and gossip blogs. This perpetual digital stimulation conditions young brains to crave instant gratification, eroding their capacity for sustained cognitive focus. When faced with demanding textbooks in Mathematics, English Language, or Integrated Science, addicted students experience extreme mental fatigue, restlessness, and boredom. Homework assignments are neglected or completed superficially using artificial intelligence shortcuts, directly precipitating mass failure in national examinations like the BECE.

Secondly, excessive nocturnal screen time inflicts severe psychological damage and sleep deprivation. The high-energy blue light emitted by smartphone screens suppresses melatonin secretion, preventing teenagers from achieving restorative sleep. Chronic sleep deficit causes severe mood swings, cognitive fog, social anxiety, and depressive disorders. Furthermore, constant exposure to curated, unrealistic luxury lifestyles on social media breeds toxic inferiority complexes, jealousy, and low self-esteem among vulnerable youth.

To protect our youth, parents must enforce strict household screen-time curfews, barring smartphones from bedrooms after 8:00 p.m. Schools must ban personal mobile devices on campus and revitalize library reading hours and outdoor sports.

A smartphone is a tool for empowerment, not a digital master; our adolescents must reclaim their mental freedom.`
      },
      {
        questionNumber: "3",
        category: "Narrative Moral Story",
        prompt: "Write an engaging, realistic story that illustrates the traditional proverb: \"Make hay while the sun shines.\"",
        modelAnswer: `MAKE HAY WHILE THE SUN SHINES

During our final academic year in junior high school, my childhood desk-mate, Kofi, and I were presented with an extraordinary opportunity. Our school was selected to participate in a funded preparatory scholarship clinic organized by the Municipal Education Directorate. The project provided five months of intensive weekend tutorials and free access to a modern science laboratory to prepare candidates for the national BECE.

Recognizing the immense value of this opportunity, I resolved to dedicate every ounce of my energy to it. Remembering my grandmother's timeless admonition to "make hay while the sun shines," I gave up weekend video games and social excursions, attending every Saturday tutorial punctually and completing five past examination booklets weekly.

Kofi, on the other hand, displayed reckless procrastination. He scoffed at my diligence, boasting that there was abundant time before the final examinations. He spent his Saturday afternoons loitering at commercial game centers and attending street carnivals, laughing mockingly: "The BECE is still months away; why waste your youthful energy memorizing notes in a stuffy hall?"

The day of reckoning arrived with brutal suddenness. Three weeks before the national examinations, a violent family dispute erupted in Kofi's home. His parents separated, their family shop collapsed financially, and his domestic environment turned into chaotic turmoil. Paralyzed by stress and anxiety, Kofi tried to cram the entire three-year syllabus into two sleepless weeks. His exhausted mind could not absorb the material; he experienced severe panic attacks in the examination hall, confusing basic formulas and weeping over his question papers.

When the national results were officially declared, I passed with Aggregate Six, earning an elite government scholarship to Prempeh College. Kofi failed Mathematics and Science, missing senior high school placement completely. Watching him trudge dejectedly toward an informal apprenticeship, the ancient proverb resonated in my heart: Truly, we must make hay while the sun shines.`
      }
    ]
  },
  partB_comprehension: {
    title: "Part B: Reading Comprehension",
    instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
    passageText: `In the agrarian economy of West Africa, cassava represents far more than an ordinary agricultural crop; it is the ultimate food security anchor that shields rural households from catastrophic starvation. Cultivated widely across tropical rainforest and guinea savannah belts, this hardy woody shrub possesses an extraordinary physiological capacity to thrive in impoverished soils and withstand extreme drought conditions that wither delicate cereals such as maize and rice.

The true agricultural supremacy of cassava lies in its remarkable agronomic resilience. Unlike grains that demand expensive chemical fertilizers, predictable rainfall, and meticulous pest management, cassava requires minimal capital investment. Farmers propagate the crop easily by inserting woody stem cuttings into mounds of red loam soil. Once established, its deep fibrous root system penetrates underground moisture reserves, allowing the plant to survive prolonged dry spells. Furthermore, mature cassava tubers can remain safely stored beneath the soil for up to twenty-four months without decaying, functioning as a living, underground biological storage bank that rural families harvest gradually during seasonal famines.

Beyond household sustenance, cassava serves as a dynamic catalyst for rural industrialization and commercial agro-processing. Through labor-intensive traditional techniques, rural women transform raw tubers into diverse culinary staples, such as fermented gari, kokonte flour, and fufu dough. In contemporary industrial manufacture, refined cassava starch is extracted for commercial applications in textile sizing, pharmaceutical tablet binding, paper manufacturing, and the brewing of alcoholic beverages.

However, the cassava value chain faces significant biological and logistical vulnerabilities. The foremost menace is the rampant spread of Cassava Mosaic Disease (CMD) and Cassava Brown Streak Disease (CBSD), viral epidemics transmitted by whiteflies that stunt plant growth and rot tubers before harvest. Furthermore, because harvested tubers contain eighty percent moisture, they suffer rapid post-harvest physiological deterioration, spoiling completely within forty-eight hours of excavation unless processed immediately.

Agricultural research institutes emphasize that transforming cassava from a subsistence security crop into a commercial agro-industrial powerhouse requires modern interventions. Governments must distribute disease-resistant hybrid stem cuttings to farmers, establish rural solar-powered processing hubs near farm gates, and rehabilitate eroded feeder roads to ensure swift transportation to urban factory depots.`,
    questions: [
      {
        subQuestion: "(a)",
        question: "State two specific environmental or soil conditions under which cassava can survive successfully according to the passage.",
        answer: "Cassava can thrive in impoverished (poor) soils and withstand extreme drought conditions (prolonged dry spells)."
      },
      {
        subQuestion: "(b)",
        question: "Why do agriculturalists describe mature cassava tubers as 'a living, underground biological storage bank'?",
        answer: "Because mature tubers can remain stored safely beneath the soil for up to twenty-four months without rotting, allowing families to harvest them gradually when food is scarce."
      },
      {
        subQuestion: "(c)",
        question: "Mention two industrial or commercial manufacturing uses of refined cassava starch.",
        answer: "1. Sizing in textile manufacturing.\n2. Binding agent in pharmaceutical tablets (or paper manufacturing / brewing alcoholic beverages)."
      },
      {
        subQuestion: "(d)",
        question: "What primary factor causes harvested cassava tubers to spoil within forty-eight hours of excavation?",
        answer: "Harvested tubers contain a high moisture content of eighty percent, which triggers rapid post-harvest physiological deterioration."
      },
      {
        subQuestion: "(e)",
        question: "Explain the meaning of the following expressions as used in the passage:\nI. ... food security anchor;\nII. ... with impunity;\nIII. ... living up to expectations.",
        answer: "I. 'food security anchor' means a dependable, vital agricultural safeguard that protects people from hunger and famine.\nII. 'minimal capital investment' means very little money, expenditure, or financial resources required.\nIII. 'swift transportation' means fast, prompt, and rapid conveyance of goods."
      },
      {
        subQuestion: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. resilience;\nII. propagate;\nIII. sustenance;\nIV. vulnerabilities.",
        answer: "I. resilience: toughness, endurance, hardiness, adaptability.\nII. propagate: cultivate, reproduce, breed, grow.\nIII. sustenance: food, nourishment, survival, livelihood.\nIV. vulnerabilities: weaknesses, hazards, risks, frailties."
      },
      {
        subQuestion: "(g)",
        question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the two major challenges confronting cassava production.",
        answer: "1. Destructive viral diseases stunt crop growth.\n2. Harvested tubers rot rapidly within two days."
      }
    ]
  },
  partC_literature: {
    title: "Part C: Literature in English (The Beacon of Light Anthology)",
    instructions: "Answer all questions in this part based on the prescribed selections from the NaCCA Common Core Programme anthology: The Beacon of Light.",
    questions: [
      {
        sectionTitle: "CHARLES DICKENS: Oliver Twist (Chapter 2: Oliver Asks for More)",
        contextExtract: "\"Oliver Twist's ninth birthday found him a pale, thin child, somewhat diminutive in stature, and decidedly small in circumference. But his spirit was not broken. For seven months at Mrs. Mann's baby farm, he and his juvenile companions had endured slow starvation, occasionally locked in the coal-cellar whenever an inspection was imminent.\"",
        subItems: [
          {
            subQuestion: "5(a)",
            question: "Why did Mrs. Mann lock Oliver and other pauper children in the coal-cellar when inspections were imminent?",
            answer: "To conceal their bruised, starved, and neglected condition from visiting parish authorities like Mr. Bumble, falsely pretending she was a loving, benevolent foster mother."
          },
          {
            subQuestion: "5(b)",
            question: "Identify the euphemism used by Dickens to describe Mrs. Mann's theft of parish food allowances in Chapter 2 and explain its satirical effect.",
            answer: "Euphemism: '...in her wisdom, saved most of the money for herself'. Dickens uses this mild phrasing satirically to expose her dishonest embezzlement and systemic cruelty toward helpless orphans."
          }
        ]
      },
      {
        sectionTitle: "CONTEMPORARY DRAMA: Spreading Light",
        contextExtract: "\"ASANTEWAA: (Looking up from her school science notebook) Remember our lesson on ancient trials, Iddrisu? In Act 1, Sir Nii reminded us of Noah's Ark. When waters rose, Noah didn't sit down weeping; he gathered timber and built an ark.\nIDDRISU: (Smiling, holding up a solar cell) And our village sits in darkness, so we gather silicon and wire light!\"",
        subItems: [
          {
            subQuestion: "5(c)",
            question: "Identify the literary device used by Asantewaa when referencing 'Noah's Ark' in Act 1, Scene 1.",
            answer: "Biblical Allusion. She references the biblical account of Noah's Ark to inspire practical action, resourcefulness, and resilience in solving their community's darkness."
          },
          {
            subQuestion: "5(d)",
            question: "How does the dialogue between Asantewaa and Iddrisu illustrate youth empowerment through STEM education?",
            answer: "It illustrates that education equips young rural students with critical problem-solving skills, allowing them to take active agency in engineering renewable energy solutions for their community."
          }
        ]
      },
      {
        sectionTitle: "HISTORICAL POETRY: The Golden Stool / Okomfo Anokye",
        contextExtract: "\"Okomfo Anokye stands between the earth and the heavens,\nA mystic mediator through whom ancestral favor leavens;\nWith whispered incantations, he calls from celestial halls,\nBinding dispersed Akan clans within sacred, golden walls.\"",
        subItems: [
          {
            subQuestion: "5(e)",
            question: "How is the divine-human relationship portrayed through Okomfo Anokye in the poem?",
            answer: "The divine and human worlds are portrayed as deeply interconnected, with Okomfo Anokye functioning as the high priest and mediator who bridges the physical realm with ancestral favor."
          },
          {
            subQuestion: "5(f)",
            question: "What is the historical significance of Okomfo Anokye 'binding dispersed Akan clans'?",
            answer: "It marks the foundational unification of previously divided, competing Akan chiefdoms into a single sovereign, invincible Ashanti nation centered on the Golden Stool (Sika Dwa Kofi)."
          }
        ]
      },
      {
        sectionTitle: "PHILOSOPHICAL POETRY: The Unseen Painter",
        contextExtract: "\"Cloudy humans walk the patterned floor,\nEach carrying depths that angels might adore;\nWith active stroke and purposeful design,\nThe Painter drafts each contour and each line.\"",
        subItems: [
          {
            subQuestion: "5(g)",
            question: "What does the expression 'Cloudy humans' suggest about human nature in 'The Unseen Painter'?",
            answer: "It suggests the psychological complexity, varied perspectives, and unique internal depth of the human experience."
          },
          {
            subQuestion: "5(h)",
            question: "How does the poet's use of active voice verbs ('drafts', 'paints', 'touches') emphasize divine intentionality?",
            answer: "The active voice highlights that creation is an intentional, purposeful, and dynamic artistic masterpiece crafted with deliberate care, rather than a random or accidental occurrence."
          }
        ]
      },
      {
        sectionTitle: "PROSE NARRATIVE: Beyond Light and Shadow",
        contextExtract: "\"The emergency meeting in the assembly hall reached its boiling point. Tina Bells stepped to the microphone, her voice steady. 'The mastermind who funded Ashes Flame, who bought the kerosene, and who paid boys to beat our prefects sits right here among our patrons.' She pointed across the room at Nkrabea. The hall erupted in gasps.\"",
        subItems: [
          {
            subQuestion: "5(i)",
            question: "What major plot revelation occurs during this climactic assembly scene?",
            answer: "Nkrabea is publicly unmasked as the adult criminal mastermind and financier behind the violent student cabal, Ashes Flame."
          },
          {
            subQuestion: "5(j)",
            question: "How does this dramatic exposure facilitate the ultimate revitalization of Cedar of Lebanon School?",
            answer: "Exposing Nkrabea breaks the cabal's grip of secrecy and fear, dismantling the syndicate, vindicating student victims, and allowing the school community to unite in transparency and reform."
          }
        ]
      }
    ]
  }
};

async function seedBeceEnglishMock5() {
  console.log("Seeding Isolated BECE English Mock 5 into Firestore with Beacon of Light curriculum...");

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

  // Strictly partitioned path: subjects/english/mocks/mock_5
  const docRef = db.doc("global_curriculum/jhs/subjects/english/mocks/mock_5");
  await docRef.set({
    mockId: "mock_5",
    mockNumber: 5,
    title: "BECE English Language National Mock Examination 5",
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
          title: "Section E: Banking and Financial Operations Cloze Passage",
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

  console.log("✅ BECE English Mock 5 successfully updated with Beacon of Light at subjects/english/mocks/mock_5!");
}

seedBeceEnglishMock5()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed BECE English Mock 5:", err);
    process.exit(1);
  });
