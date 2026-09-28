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
// 40 OBJECTIVE QUESTIONS: LEXIS, STRUCTURE, IT CLOZE & ORAL PHONOLOGY
// =========================================================================
const allRawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "Had it not been for the coastguard's prompt alert, the passenger ferry ............ on the rocky reef.",
    options: [
      "will have grounded",
      "would have grounded",
      "would ground",
      "grounded"
    ],
    correctAnswer: "would have grounded",
    hint: "Inverted Third Conditional: 'Had it not been for...' in the counterfactual condition requires 'would have + past participle' in the main clause.",
    workedSolution: "In a counterfactual past conditional construction, an unfulfilled past condition takes a modal past perfect in the main clause: 'would have grounded'.",
    points: 1
  },
  {
    number: 2,
    prompt: "The parliamentary minority demanded that the forensic audit report ............ published in the national daily papers.",
    options: ["is", "be", "was", "should have"],
    correctAnswer: "be",
    hint: "Mandative Subjunctive: Clauses introduced by verbs of demanding or insisting ('demanded that') take a base bare infinitive 'be' in the passive.",
    workedSolution: "Following verbs of demanding, insisting, or mandating followed by 'that', the mandative subjunctive uses the base verb form 'be': 'demanded that the report be published'.",
    points: 1
  },
  {
    number: 3,
    prompt: "The brilliant young scientist ............ the international medal was awarded to delivered a memorable keynote address.",
    options: ["who", "whom", "which", "whose"],
    correctAnswer: "whom",
    hint: "Objective relative pronoun governed by the preposition 'to' located at the end of the relative clause.",
    workedSolution: "The relative pronoun functions as the grammatical object of the preposition 'to' (the medal was awarded to him), requiring objective case 'whom'.",
    points: 1
  },
  {
    number: 4,
    prompt: "The regional summit adopted all the five international ............ recommendations.",
    options: [
      "secretaries-general's",
      "secretary-generals'",
      "secretaries'-general",
      "secretary-general's"
    ],
    correctAnswer: "secretaries-general's",
    hint: "Compound noun plural possessive: Form the plural of the base noun ('secretaries-general') and append apostrophe + 's' to the final element.",
    workedSolution: "The plural of 'secretary-general' is 'secretaries-general'. Its possessive form is formed by adding apostrophe + 's' to the end: 'secretaries-general's recommendations'.",
    points: 1
  },
  {
    number: 5,
    prompt: "Applicants possessing accredited technical diplomas ............ sit for the preliminary entrance aptitude test.",
    options: ["need not", "needs not", "need not to", "needs not to"],
    correctAnswer: "need not",
    hint: "When 'need' functions as a semi-modal auxiliary in the negative, it takes no third-person '-s' and is followed by a bare infinitive without 'to'.",
    workedSolution: "When used as a modal auxiliary in the negative, 'need' takes a bare infinitive without 'to': 'need not sit'.",
    points: 1
  },
  {
    number: 6,
    prompt: "Prior ............ his formal enlistment in the naval academy, Kwame completed a certified navigation course.",
    options: ["than", "from", "to", "before"],
    correctAnswer: "to",
    hint: "Identify the dependent preposition that regularly collocates with the comparative adjective 'prior'.",
    workedSolution: "In standard English collocations, the adjective 'prior' strictly takes the preposition 'to': 'prior to his formal enlistment'.",
    points: 1
  },
  {
    number: 7,
    prompt: "Neither the headmaster nor the senior invigilators ............ present in the examination hall during the morning briefing.",
    options: ["was", "is", "were", "are"],
    correctAnswer: "were",
    hint: "Proximity concord with 'neither... nor': In the past tense, the verb agrees in number with the nearer plural subject ('the senior invigilators').",
    workedSolution: "When subjects are linked by 'neither... nor', the verb agrees in number with the closer subject ('senior invigilators', plural). In the past tense, the correct verb is 'were'.",
    points: 1
  },
  {
    number: 8,
    prompt: "Active: \"The night watchman saw the trespasser discard a suspicious parcel.\"\nPassive: \"The trespasser was seen ............ a suspicious parcel by the night watchman.\"",
    options: [
      "discard",
      "to discard",
      "discarded",
      "discarding of"
    ],
    correctAnswer: "to discard",
    hint: "Passive transformation of sensory verbs: Verbs of perception taking a bare infinitive in the active voice require a full to-infinitive in the passive voice.",
    workedSolution: "While sensory verbs take a bare infinitive in the active voice ('saw him discard'), their passive equivalents require a full to-infinitive: 'was seen to discard'.",
    points: 1
  },
  {
    number: 9,
    prompt: "The senior mathematics tutor detests ............ while solving complex algebraic equations on the chalkboard.",
    options: [
      "to interrupt",
      "being interrupted",
      "interrupting",
      "having interrupted"
    ],
    correctAnswer: "being interrupted",
    hint: "The catenative verb 'detest' takes a gerund complement. When the subject is the recipient of the action, use the passive gerund ('being + past participle').",
    workedSolution: "'Detest' takes a gerund complement. Expressing a passive experience requires the passive gerund: 'detests being interrupted'.",
    points: 1
  },
  {
    number: 10,
    prompt: "Under no circumstances ............ a candidate leave the examination room without the chief invigilator's permission.",
    options: [
      "should",
      "a candidate should",
      "must a candidate to",
      "did a candidate"
    ],
    correctAnswer: "should",
    hint: "Fronted negative prepositional phrase ('Under no circumstances') triggers subject-auxiliary inversion.",
    workedSolution: "When a sentence begins with an emphatic negative phrase ('Under no circumstances'), standard English requires subject-auxiliary inversion: 'should a candidate leave'.",
    points: 1
  },
  {
    number: 11,
    prompt: "The newly promoted logistics manager is an esteemed childhood companion of ............",
    options: ["her", "hers", "she", "herself"],
    correctAnswer: "hers",
    hint: "Double possessive construction: 'a [noun] of' requires an absolute possessive pronoun.",
    workedSolution: "In double possessive constructions ('a companion of...'), standard grammar requires the independent possessive pronoun 'hers': 'a childhood companion of hers'.",
    points: 1
  },
  {
    number: 12,
    prompt: "She seldom complains about demanding household chores, ............ she?",
    options: ["doesn't", "does", "did", "didn't"],
    correctAnswer: "does",
    hint: "The broad negative adverb 'seldom' gives the main clause negative polarity, requiring an affirmative present question tag.",
    workedSolution: "'Seldom' carries negative polarity, requiring an affirmative tag. With simple present lexical verb 'complains', the matching tag is 'does she?'.",
    points: 1
  },
  {
    number: 13,
    prompt: "The palace elders preserved a ............ chest in the ancestral stool room.",
    options: [
      "massive antique Ghanaian mahogany",
      "antique massive Ghanaian mahogany",
      "Ghanaian massive antique mahogany",
      "massive Ghanaian antique mahogany"
    ],
    correctAnswer: "massive antique Ghanaian mahogany",
    hint: "Cumulative adjective ordering: Size ('massive') precedes Age ('antique') which precedes Origin ('Ghanaian') followed by Material ('mahogany').",
    workedSolution: "Standard English cumulative adjective ordering places size ('massive') before age ('antique') followed by origin ('Ghanaian') and material ('mahogany'): 'massive antique Ghanaian mahogany chest'.",
    points: 1
  },
  {
    number: 14,
    prompt: "The rebellious apprentice was arraigned before the disciplinary master and charged ............ gross insubordination.",
    options: ["for", "with", "of", "against"],
    correctAnswer: "with",
    hint: "Identify the dependent preposition that regularly collocates with the passive verb 'charged' in legal and disciplinary accusations.",
    workedSolution: "In standard disciplinary and legal collocations, an accused individual is 'charged with' an offense: 'charged with gross insubordination'.",
    points: 1
  },
  {
    number: 15,
    prompt: "The school library was ............ packed with students that many were forced to study in the courtyard.",
    options: ["too", "very", "so", "much"],
    correctAnswer: "so",
    hint: "Correlative clause of result: 'so + adjective + that + consequence'.",
    workedSolution: "The degree adverb 'so' pairs correlatively with 'that' to introduce an adverbial clause of result: 'so packed with students that...'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The forensic auditor was remarkably scrupulous in verifying every receipt.\nChoose the word nearest in meaning to 'scrupulous'.",
    options: ["meticulous", "quick", "casual", "brief"],
    correctAnswer: "meticulous",
    hint: "Diligent, thorough, and extremely attentive to details; careful.",
    workedSolution: "'Scrupulous' means showing great care, thoroughness, and attention to detail; 'meticulous' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "A reliable electrical supply is indispensable for operating modern life-support equipment.\nChoose the word nearest in meaning to 'indispensable'.",
    options: ["crucial", "helpful", "desirable", "expensive"],
    correctAnswer: "crucial",
    hint: "Absolutely necessary; essential.",
    workedSolution: "'Indispensable' means absolutely essential and necessary; 'crucial' is its direct synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "The agrarian community demonstrated immense courage during periods of economic adversity.\nChoose the word nearest in meaning to 'adversity'.",
    options: ["misfortune", "conflict", "danger", "hostility"],
    correctAnswer: "misfortune",
    hint: "Difficulties, hardship, or misfortune.",
    workedSolution: "'Adversity' refers to a state of severe hardship, suffering, or 'misfortune'; 'misfortune' is its direct synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "The mining executive resided in an affluent suburban neighborhood.\nChoose the word nearest in meaning to 'affluent'.",
    options: ["opulent", "humble", "spacious", "peaceful"],
    correctAnswer: "opulent",
    hint: "Having a great deal of money; wealthy; luxurious.",
    workedSolution: "'Affluent' means wealthy or rich; 'opulent' is its closest literary synonym denoting lavish wealth.",
    points: 1
  },
  {
    number: 20,
    prompt: "The headmistress gave a candid assessment of the students' academic indiscipline.\nChoose the word nearest in meaning to 'candid'.",
    options: ["frank", "harsh", "polite", "careless"],
    correctAnswer: "frank",
    hint: "Truthful and straightforward; outspoken.",
    workedSolution: "'Candid' means truthful, straightforward, and sincere; 'frank' is its exact equivalent.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "To pass the national BECE with distinction, Mensah was burning the midnight oil throughout the term. This means Mensah ............",
    options: [
      "wasted kerosene carelessly",
      "studied diligently late into the night",
      "worked on the farm at night",
      "suffered from sleeplessness"
    ],
    correctAnswer: "studied diligently late into the night",
    hint: "To work or study late into the night.",
    workedSolution: "The idiom 'to burn the midnight oil' means to study or work hard late into the night hours.",
    points: 1
  },
  {
    number: 22,
    prompt: "The traditional elders counseled the feuding brothers to let sleeping dogs lie. This means the brothers should ............",
    options: [
      "avoid disturbing their pets",
      "avoid restarting old disputes or grievances",
      "reconcile their differences immediately",
      "relocate to separate villages"
    ],
    correctAnswer: "avoid restarting old disputes or grievances",
    hint: "To avoid interfering in a situation that is currently calm to prevent fresh trouble.",
    workedSolution: "The idiom 'to let sleeping dogs lie' means to leave a situation undisturbed so as not to reignite old conflicts or trouble.",
    points: 1
  },
  {
    number: 23,
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
    number: 24,
    prompt: "After being cautioned by the magistrate, the young truant resolved to turn over a new leaf. This means he decided to ............",
    options: [
      "abandon his old ways and reform his conduct",
      "relocate to another town",
      "read new textbooks",
      "take up forestry work"
    ],
    correctAnswer: "abandon his old ways and reform his conduct",
    hint: "To start behaving in a better, more responsible manner; reform oneself.",
    workedSolution: "The idiom 'to turn over a new leaf' means to reform one's moral behavior and start anew responsibly.",
    points: 1
  },
  {
    number: 25,
    prompt: "Faced with acute fee arrears, the indigent student decided to bite the bullet. This means the student decided to ............",
    options: [
      "face a grim situation with fortitude and resolve",
      "abandon schooling completely",
      "seek financial charity",
      "complain to the headmaster"
    ],
    correctAnswer: "face a grim situation with fortitude and resolve",
    hint: "To force oneself to perform an unpleasant or difficult task with courage and resignation.",
    workedSolution: "The idiom 'to bite the bullet' means to face a painful, grim, or difficult inevitability with stoic courage.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "While the junior housemaster was remarkably lenient, the senior headmaster enforced ...... sanctions.\nChoose the word most nearly opposite in meaning to 'lenient'.",
    options: ["drastic", "mild", "friendly", "simple"],
    correctAnswer: "drastic",
    hint: "'Lenient' means mild, merciful, and tolerant in punishment. What word denotes severe, harsh, and radical?",
    workedSolution: "'Lenient' means mild or tolerant. Its direct disciplinary antonym in punitive contexts is 'drastic' (or severe/harsh).",
    points: 1
  },
  {
    number: 27,
    prompt: "The defense lawyer's account was fictitious, whereas the forensic report was entirely ...... .\nChoose the word most nearly opposite in meaning to 'fictitious'.",
    options: ["factual", "complex", "lengthy", "interesting"],
    correctAnswer: "factual",
    hint: "'Fictitious' means fabricated, invented, or false. What word denotes based on or containing facts; real?",
    workedSolution: "'Fictitious' means invented or untrue. Its direct antonym is 'factual' (authentic or based on real facts).",
    points: 1
  },
  {
    number: 28,
    prompt: "Under high temperatures, gases will expand, but in freezing conditions they will ...... .\nChoose the word most nearly opposite in meaning to 'expand'.",
    options: ["shrink", "burst", "fall", "collapse"],
    correctAnswer: "shrink",
    hint: "'Expand' means to become larger in size or volume. What word denotes to become smaller in size or decrease in volume?",
    workedSolution: "In physical science, the direct antonym of 'expand' (increase in size/volume) is 'shrink' (or contract).",
    points: 1
  },
  {
    number: 29,
    prompt: "The instructor's preliminary explanation was obscure, but his summary was remarkably ...... .\nChoose the word most nearly opposite in meaning to 'obscure'.",
    options: ["lucid", "brief", "loud", "useful"],
    correctAnswer: "lucid",
    hint: "'Obscure' means unclear, dim, and difficult to comprehend. What word denotes clear, transparent, and easily understood?",
    workedSolution: "'Obscure' means vague, unclear, or difficult to understand. Its direct intellectual antonym is 'lucid' (clear and transparent).",
    points: 1
  },
  {
    number: 30,
    prompt: "The novice driver was condemned for being reckless, but his mentor was praised for being ...... .\nChoose the word most nearly opposite in meaning to 'reckless'.",
    options: ["cautious", "slow", "fearful", "obedient"],
    correctAnswer: "cautious",
    hint: "'Reckless' means heedless of danger or rash. What word denotes careful to avoid potential hazards?",
    workedSolution: "'Reckless' means heedless of danger or careless. Its direct behavioral antonym is 'cautious' (prudent and careful).",
    points: 1
  },

  // --- SECTION E: CLOZE PASSAGE (SOFTWARE ENGINEERING REGISTER) (31 - 35) ---
  {
    number: 31,
    prompt: "Cloze Passage: \"The enterprise application stores and retrieves records securely from a cloud-hosted relational ---31---.\"\nChoose the most suitable word:",
    options: ["database", "drive", "folder", "register"],
    correctAnswer: "database",
    hint: "An organized collection of structured data stored electronically in a computer system is a database.",
    workedSolution: "In software engineering, the structured electronic data storage engine is formally designated as a 'database'.",
    points: 1
  },
  {
    number: 32,
    prompt: "Cloze Passage: \"To safeguard sensitive user credentials from cyber-attacks, the network enforces end-to-end cryptographic ---32---.\"\nChoose the most suitable word:",
    options: ["locking", "encryption", "firewall", "coding"],
    correctAnswer: "encryption",
    hint: "The process of converting information or data into a code, especially to prevent unauthorized access, is encryption.",
    workedSolution: "In digital cybersecurity, transforming plaintext data into secure ciphertext is 'encryption'.",
    points: 1
  },
  {
    number: 33,
    prompt: "Cloze Passage: \"The software development team analyzed error logs and successfully ---33--- the system crash.\"\nChoose the most suitable word:",
    options: ["repaired", "debugged", "mended", "restored"],
    correctAnswer: "debugged",
    hint: "The process of identifying and removing errors from computer hardware or software is debugging.",
    workedSolution: "In software programming, identifying and resolving software defects or bugs is termed 'debugged'.",
    points: 1
  },
  {
    number: 34,
    prompt: "Cloze Passage: \"All source code revisions are committed to a distributed version control ---34---.\"\nChoose the most suitable word:",
    options: ["repository", "depot", "warehouse", "archive"],
    correctAnswer: "repository",
    hint: "A central location where data, software packages, or source code files are stored and managed is a repository.",
    workedSolution: "In software engineering, a storage space where code files and project histories reside is a 'repository' (repo).",
    points: 1
  },
  {
    number: 35,
    prompt: "Cloze Passage: \"The frontend software engineers designed an intuitive user ---35--- that simplifies navigation on mobile screens.\"\nChoose the most suitable word:",
    options: ["screen", "interface", "platform", "portal"],
    correctAnswer: "interface",
    hint: "The visual elements and controls through which a user interacts with a software application is the user interface (UI).",
    workedSolution: "In computer science and digital design, the layout through which users operate an application is the 'interface' (UI).",
    points: 1
  },

  // --- PART B: ORAL LANGUAGE & PHONOLOGY (36 - 40) ---
  {
    number: 36,
    prompt: "Choose the word that contains the identical voiced post-alveolar fricative consonant sound as the underlined sound in:\n\"The artist had an extraordinary **vi<u>si</u>on**.\"",
    options: ["measure", "pressure", "action", "nation"],
    correctAnswer: "measure",
    hint: "The sound in 'vision' is the voiced post-alveolar fricative /ʒ/. 'Measure' (/ˈmeʒ.ər/) contains the exact identical /ʒ/ sound.",
    workedSolution: "The word 'vision' contains the voiced fricative /ʒ/ (/ˈvɪʒ.ən/). 'Measure' (/ˈmeʒ.ər/) contains the identical /ʒ/ sound, whereas 'pressure', 'action', and 'nation' contain voiceless /ʃ/.",
    points: 1
  },
  {
    number: 37,
    prompt: "Choose the word that contains the identical diphthong sound as the underlined vowel in:\n\"The railway tracks were laid **str<u>aigh</u>t**.\"",
    options: ["freight", "bite", "flight", "beat"],
    correctAnswer: "freight",
    hint: "'Straight' contains the closing diphthong /eɪ/. 'Freight' (/freɪt/) contains the exact identical /eɪ/ diphthong.",
    workedSolution: "The word 'straight' is pronounced /streɪt/ containing the diphthong /eɪ/. 'Freight' (/freɪt/) shares the exact identical /eɪ/ sound.",
    points: 1
  },
  {
    number: 38,
    prompt: "Choose the word that shares the identical final consonant cluster sound as:\n\"The literature master scrutinized the prescribed **te<u>xts</u>**.\"",
    options: ["desks", "tests", "masks", "next"],
    correctAnswer: "desks",
    hint: "'Texts' terminates in the complex voiceless cluster /ksts/. 'Desks' (/desks/) shares the voiceless plosive-fricative cluster ending.",
    workedSolution: "'Texts' terminates in the cluster /ksts/. 'Desks' (/desks/) shares the plosive-fricative cluster ending.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which of the following words contains a SILENT consonant letter that is not voiced in standard pronunciation?",
    options: ["knack", "kick", "king", "kite"],
    correctAnswer: "knack",
    hint: "In this word meaning an acquired skill or trick, the letter 'k' before 'n' is completely silent.",
    workedSolution: "In 'knack' (pronounced /næk/), the initial consonant letter 'k' is completely silent.",
    points: 1
  },
  {
    number: 40,
    prompt: "When the open polar question \"Did you submit the term report to the director?\" is uttered in standard English, what intonation contour is normally used?",
    options: [
      "Rising intonation",
      "Falling intonation",
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

const assignedTargetIndices = seedShuffle(targetKeys, 202610);

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
        prompt: "Write a formal letter to your Municipal Chief Executive (MCE), drawing attention to the menace of unauthorized speed ramps constructed from raw logs and red mud by youth across your community's roads, and proposing at least two practical engineering interventions to ensure highway safety.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2026

The Municipal Chief Executive
Bekwai Municipal Assembly
Municipal Directorate, Bekwai

Dear Sir,

PETITION REGARDING UNAUTHORIZED ROAD BLOCKS AND SPEED RAMPS

On behalf of the youth, commercial transport drivers, and emergency health services within the Bekwai Municipality, I respectfully submit this petition to draw your urgent attention to the perilous obstruction created by unauthorized crude speed ramps erected along our township roads, and to propose practical engineering measures to protect lives.

Over the past three months, disgruntled youths in several residential quarters have taken the law into their own hands by constructing crude, unstandardized speed barriers across our asphalt corridors using jagged granite rocks, heavy timber logs, and mounds of red mud. While these residents claim to deter speeding vehicles, these jagged structures severely damage vehicular exhaust systems and wheel alignments. More catastrophically, ambulances rushing critically ill patients and pregnant women to the municipal hospital are violently jolted or forced to slow to a crawl, resulting in avoidable deaths. Furthermore, because these crude barriers are unpainted and unlit, motorcycle riders crash into them at night, sustaining fatal head injuries.

To permanently restore traffic safety, I suggest, first, that the Municipal Assembly deploy the municipal roads task force to immediately dismantle all unauthorized mud mounds and timber barriers along our thoroughfares.

Secondly, the Department of Urban Roads should construct certified, standardized asphalt speed humps equipped with retro-reflective thermoplastic zebra stripes near all basic schools, hospital zones, and busy market crossings. Complementing these with clear advance warning signs and solar streetlights will calm traffic scientifically without endangering commuters.

We count on your prompt executive leadership to ensure our roads are safe and orderly.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Youth Secretary)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in a national daily newspaper on the topic: \"The Menace of Substance Abuse Among Basic and Senior High School Students in Ghana, and Urgent Pathways to Save Our Youth.\"",
        modelAnswer: `SAVING OUR FUTURE: COMBATING SUBSTANCE ABUSE AMONG GHANAIAN STUDENTS
By Samuel K. Boateng, Begoro

In contemporary Ghanaian society, the greatest wealth of our republic resides in the boundless intellectual and creative potential of our youth. Regrettably, an alarming, insidious social pandemic is systematically destroying thousands of promising basic and senior high school students across our districts: the rampant abuse of illicit substances, notably tramadol, marijuana, and potent alcohol-laced energy drinks.

The foremost catalyst fueling this tragedy is peer pressure, compounded by the misleading glamorization of narcotics on digital social media networks. Vulnerable adolescents, seeking social acceptance or false academic energy to cram for examinations, are lured into consuming synthetic stimulants peddled by unscrupulous pharmacy chemical shops and street hawkers. Far from enhancing alertness, these psychoactive drugs trigger severe neurological damage, cognitive memory loss, and acute psychosis. Students who fall into addiction descend into chronic truancy, violent campus vandalism, theft, and examination failure, completely truncating their academic aspirations.

Secondly, substance abuse inflicts irreversible physiological harm and tears families apart. The metabolic toxicity of unprescribed tramadol and synthetic opioids precipitates acute liver failure, respiratory depression, and sudden cardiac arrest among teenagers. Furthermore, the psychological agony endured by parents watching their brilliant children degenerate into street vagrants is immeasurable.

To eradicate this menace, the Food and Drugs Authority (FDA) and the Police Service must conduct aggressive, unannounced raids on chemical shops, revoking licenses and prosecuting merchants who sell prescription opioids to minors. Secondly, basic schools must establish certified Guidance and Counseling Psychological Clinics, offering confidential drug rehabilitation and therapy rather than merely expelling addicted pupils into the streets.

Our youth are our sacred trust; we must unite to break the chains of substance abuse today.`
      },
      {
        questionNumber: "3",
        category: "Narrative Moral Story",
        prompt: "Write an engaging, realistic story that illustrates the traditional proverb: \"A stitch in time saves nine.\"",
        modelAnswer: `A STITCH IN TIME SAVES NINE

During our final academic term in junior high school, my childhood desk-mate, Kofi, was assigned as the student caretaker of our school's newly established science laboratory. He was an intelligent boy, but he possessed a chronic habit of procrastination, habitually brushing aside minor maintenance defects with the careless excuse that there was abundant time to fix them later.

One Friday afternoon, while cleaning the laboratory prep room, Kofi noticed a slight, hairline crack in the primary PVC water inlet pipe connecting our high-pressure rooftop water tank. A tiny, steady drip of water seeped onto the concrete floor. Our laboratory technician, Master Addo, noticed it and advised Kofi immediately: "Replace that connecting joint before leaving today, Kofi; a stitch in time saves nine." Kofi nodded casually, but seeing that it was closing time, he mumbled to himself that a tiny drip posed no danger and hurried home to play football, promising to fix it on Monday morning.

Disaster struck with catastrophic fury over the weekend. A sudden surge in municipal water pressure cracked the weakened PVC joint wide open. By Saturday midnight, five thousand liters of high-pressure water burst from the pipe, completely flooding the entire laboratory building.

When the headmaster unlocked the science block on Monday morning, a horrific sight met his eyes. Water had submerged the electrical wiring conduits, destroying fifty brand-new digital student microscopes, soaking hundreds of imported chemistry reference textbooks, and short-circuiting our costly computer server. The financial damage totaled over eighty thousand Ghana cedis.

Kofi stood weeping in bitter humiliation before the school board. A simple five-cedi pipe joint, neglected out of laziness, had caused immense destruction. Looking at the ruined equipment, the ancient proverb echoed forever in my memory: Truly, a stitch in time saves nine.`
      }
    ]
  },
  partB_comprehension: {
    title: "Part B: Reading Comprehension",
    instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
    passageText: `In the global economy of the twenty-first century, cocoa represents far more than an ordinary agricultural commodity; it is the economic backbone and sacred lifeblood of Ghana. Cultivated across the lush forest belts of Ashanti, Western, and Eastern regions, this golden bean has sustained millions of rural households, funded basic infrastructural developments, and earned vital foreign exchange for the republic for over a century.

However, an existential environmental crisis is threatening to extinguish this historic agricultural legacy: the rampant proliferation of illegal alluvial gold mining, popularly termed galamsey. Driven by the lure of immediate wealth and backed by heavily armed criminal syndicates, illegal miners have invaded pristine cocoa plantations, deploying mechanized excavators to fell hundreds of thousands of productive, mature cocoa trees. Fertile agricultural topsoil, developed over decades of organic cultivation, is ruthlessly stripped away to unearth alluvial gold deposits, leaving behind cratered, barren wastelands where crops can never grow again.

Even more catastrophic is the widespread chemical contamination of water bodies and soils within cocoa-growing belts. To extract fine gold particles from dredged river slurries, miners utilize lethal quantities of liquid mercury and sodium cyanide. These non-biodegradable heavy metals seep into the water table and are absorbed through the root systems of surviving cocoa trees. International food safety regulators have begun warning that detectable trace levels of toxic heavy metals in exported cocoa beans could lead to international import bans, which would spell total economic collapse for Ghana's export revenues.

Furthermore, illegal mining has triggered an acute rural labor crisis. Cocoa farming is traditionally labor-intensive, requiring manual weeding, pruning, and harvesting. Today, young rural men and adolescents have abandoned farm labor to work in lucrative, dangerous mining pits. Aging cocoa farmers, unable to afford manual laborers, are frequently intimidated or coerced by local chiefs and syndicates into selling their family farmlands to miners for meager sums.

Agronomic scientists conclude that saving Ghana's cocoa sector requires decisive national action. The central government must enforce a total military ban on surface mining in all agricultural cocoa basins, reclaim poisoned lands, and provide guaranteed pension funds and subsidized fertilizers to motivate young farmers to preserve cocoa production.`,
    questions: [
      {
        subQuestion: "(a)",
        question: "State two economic contributions of cocoa to Ghana mentioned in the opening paragraph of the passage.",
        answer: "1. Sustaining millions of rural households.\n2. Funding infrastructural developments (or earning foreign exchange for the nation)."
      },
      {
        subQuestion: "(b)",
        question: "Mention two destructive physical activities carried out by illegal gold miners on cocoa farmlands.",
        answer: "1. Cutting down (felling) hundreds of thousands of productive cocoa trees.\n2. Stripping away fertile agricultural topsoil with excavators, leaving behind barren craters."
      },
      {
        subQuestion: "(c)",
        question: "State two toxic chemicals used by miners that threaten Ghana's cocoa export market.",
        answer: "Mercury and sodium cyanide."
      },
      {
        subQuestion: "(d)",
        question: "Why are aging cocoa farmers unable to maintain their farms according to the fourth paragraph?",
        answer: "Because young rural laborers have abandoned farming to work in mining pits, leaving farmers with an acute labor shortage and unable to afford manual workers."
      },
      {
        subQuestion: "(e)",
        question: "Explain the meaning of the following expressions as used in the passage:\nI. ... sacred lifeblood;\nII. ... unearth alluvial gold deposits;\nIII. ... acute rural labor crisis.",
        answer: "I. 'sacred lifeblood' means the indispensable, vital foundation that provides life, sustenance, and survival.\nII. 'unearth alluvial gold deposits' means excavate, dig up, or uncover gold minerals from riverbanks and earth.\nIII. 'acute rural labor crisis' means an extreme, severe shortage of available workers in farming communities."
      },
      {
        subQuestion: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. proliferation;\nII. ruthlessly;\nIII. coerced;\nIV. decisive.",
        answer: "I. proliferation: spread, rapid increase, expansion, growth.\nII. ruthlessly: mercilessly, cruelly, harshly, brutally.\nIII. coerced: forced, compelled, pressured, intimidated.\nIV. decisive: firm, resolute, bold, conclusive."
      },
      {
        subQuestion: "(g)",
        question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the two major interventions needed to save the cocoa sector.",
        answer: "1. Government must ban mining in cocoa basins.\n2. Farmers must receive subsidized fertilizers and pensions."
      }
    ]
  },
  partC_literature: {
    title: "Part C: Literature in English (The Beacon of Light Anthology)",
    instructions: "Answer all questions in this part based on the prescribed selections from the NaCCA Common Core Programme anthology: The Beacon of Light.",
    questions: [
      {
        sectionTitle: "CHARLES DICKENS: Oliver Twist (Chapter 2: Oliver Asks for More)",
        contextExtract: "\"The master aimed a blow at Oliver’s head with the ladle; pinioned him in his arms; and shrieked aloud for the beadle. The assistants stood paralyzed with horror; the boys with fear. 'That boy will be hung,' said the gentleman in the white waistcoat. 'I know that boy will be hung.'\"",
        subItems: [
          {
            subQuestion: "5(a)",
            question: "What dramatic crisis takes place in this extract, and how does the master react physically to Oliver's request?",
            answer: "Oliver walks up to ask for an extra portion of gruel, prompting the master to turn pale with astonishment, strike him violently on the head with the ladle, pin him down, and scream for the beadle."
          },
          {
            subQuestion: "5(b)",
            question: "How does the gentleman in the white waistcoat's repeated assertion that Oliver 'will be hung' illustrate the social satire of the Victorian workhouse system?",
            answer: "It satirizes the callousness of the parish authorities, who viewed poverty as an inherent criminal flaw, treating a starving orphan child's plea for basic food as a capital crime deserving the gallows."
          }
        ]
      },
      {
        sectionTitle: "CONTEMPORARY DRAMA: Spreading Light",
        contextExtract: "\"SIR NII: (Looking at the illuminated village square in Act 6) When we teach our children to use their hands and minds to solve our problems, darkness has no place to hide. The solar light shining tonight is the work of our own youth.\"",
        subItems: [
          {
            subQuestion: "5(c)",
            question: "What central theme regarding education is underscored by Sir Nii's address?",
            answer: "The theme of practical, problem-solving STEM education empowering youth to transform their community and overcome rural neglect."
          },
          {
            subQuestion: "5(d)",
            question: "How do Asantewaa and Iddrisu's collaborative efforts demonstrate the value of teamwork and mutual respect in community development?",
            answer: "They combine their complementary skills, support each other against sabotage and prejudice, and work as equals to deliver renewable energy to their village."
          }
        ]
      },
      {
        sectionTitle: "HISTORICAL POETRY: The Golden Stool / Okomfo Anokye",
        contextExtract: "\"The Golden Stool descends through twilight's hush,\nA sacred bond no earthly sword can crush;\nA treasure trove, of stories yet untold,\nForging a nation in its shining gold.\"",
        subItems: [
          {
            subQuestion: "5(e)",
            question: "Explain the historical and cultural significance of the Stool 'forging a nation'.",
            answer: "It signifies Okomfo Anokye's invocation of the Golden Stool (Sika Dwa Kofi) to unite previously divided Akan states into a single sovereign, cohesive Ashanti Kingdom."
          },
          {
            subQuestion: "5(f)",
            question: "What does the line 'A sacred bond no earthly sword can crush' convey about national unity?",
            answer: "It conveys that true spiritual, cultural, and communal unity is enduring and indestructible, transcending physical warfare, division, and military force."
          }
        ]
      },
      {
        sectionTitle: "PHILOSOPHICAL POETRY: The Unseen Painter",
        contextExtract: "\"God must be a painter,\nMixing every shade of skin\nTo show that in His gallery,\nAll hues belong within.\"",
        subItems: [
          {
            subQuestion: "5(g)",
            question: "Identify the primary figure of speech in 'God must be a painter' and explain its meaning.",
            answer: "Metaphor. It depicts the Creator as an intentional, benevolent artist who crafts the natural universe and all human beings as a harmonious masterpiece."
          },
          {
            subQuestion: "5(h)",
            question: "What profound philosophical message regarding racial and ethnic equality is delivered through the phrase 'All hues belong within'?",
            answer: "It affirms that all racial complexions and cultures possess equal inherent dignity, purpose, and worth on the shared canvas of human existence."
          }
        ]
      },
      {
        sectionTitle: "PROSE NARRATIVE: Beyond Light and Shadow",
        contextExtract: "\"The school’s transformation was like a phoenix rising from the ashes, forged in the hearts of its students. Mrs. Acquah's unwavering faith and Benson's courageous redemption had broken the dark grip of Ashes Flame, proving that light will always overcome shadow.\"",
        subItems: [
          {
            subQuestion: "5(i)",
            question: "Identify the simile in the extract and explain how it reflects the journey of Cedar of Lebanon School.",
            answer: "Simile: 'like a phoenix rising from the ashes'. It reflects how the school emerged reborn, purified, and revitalized out of the decay, extortion, and chaos caused by the Ashes Flame syndicate."
          },
          {
            subQuestion: "5(j)",
            question: "What final moral lesson does the narrative impart regarding leadership and collective courage in confronting institutional evil?",
            answer: "It teaches that overcoming systemic intimidation requires resolute, selfless leadership by personal example, supported by student moral courage, transparency, and communal unity."
          }
        ]
      }
    ]
  }
};

async function seedBeceEnglishMock10() {
  console.log("Seeding Isolated BECE English Mock 10 (Capstone Examination) into Firestore with Beacon of Light curriculum...");

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

  // Strictly partitioned path: subjects/english/mocks/mock_10
  const docRef = db.doc("global_curriculum/jhs/subjects/english/mocks/mock_10");
  await docRef.set({
    mockId: "mock_10",
    mockNumber: 10,
    title: "BECE English Language National Mock Examination 10 (Capstone Examination)",
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
          title: "Section E: Software Engineering Cloze Passage",
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

  console.log("✅ BECE English Mock 10 successfully updated with Beacon of Light at subjects/english/mocks/mock_10!");
}

seedBeceEnglishMock10()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed BECE English Mock 10:", err);
    process.exit(1);
  });
