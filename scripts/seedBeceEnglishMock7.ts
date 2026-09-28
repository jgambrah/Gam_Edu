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
// 40 OBJECTIVE QUESTIONS: LEXIS, STRUCTURE, MARITIME CLOZE & ORAL PHONOLOGY
// =========================================================================
const allRawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "Had the commercial driver obeyed the statutory speed limit, the vehicle ............ off the embankment.",
    options: [
      "would not skid",
      "would not have skidded",
      "will not have skidded",
      "did not skid"
    ],
    correctAnswer: "would not have skidded",
    hint: "Inverted Third Conditional: 'Had the commercial driver obeyed' in the conditional clause requires 'would not have + past participle' in the main clause.",
    workedSolution: "In a Third Conditional inverted construction, an unfulfilled past condition takes a modal past perfect in the main clause: 'would not have skidded'.",
    points: 1
  },
  {
    number: 2,
    prompt: "The scholarship guidelines stipulated that every candidate ............ an authentic birth certificate.",
    options: ["submits", "submit", "submitted", "should have submitted"],
    correctAnswer: "submit",
    hint: "Mandative Subjunctive: Clauses introduced by verbs of requirement or regulation ('stipulated that') take a base bare infinitive without third-person '-s'.",
    workedSolution: "Following verbs of decreeing, requiring, or stipulating followed by 'that', the mandative subjunctive requires the base verb form: 'stipulated that every candidate submit'.",
    points: 1
  },
  {
    number: 3,
    prompt: "The new academic curriculum, ............ aims at developing practical skills, has been introduced.",
    options: ["who", "whom", "which", "whose"],
    correctAnswer: "which",
    hint: "Non-defining relative clause modifying an inanimate noun phrase ('The new academic curriculum').",
    workedSolution: "In non-defining relative clauses modifying non-human antecedents, standard prescriptive grammar requires 'which': 'curriculum, which aims at...'.",
    points: 1
  },
  {
    number: 4,
    prompt: "A sudden ............ of rain forced the outdoor soccer tournament to pause momentarily.",
    options: ["shower", "sheet", "torrent", "gust"],
    correctAnswer: "shower",
    hint: "Identify the standard partitive noun indicating a brief, light to moderate fall of rain.",
    workedSolution: "In standard English meteorological collocations, a brief fall of rain is partitively termed 'a shower of rain'.",
    points: 1
  },
  {
    number: 5,
    prompt: "The ceremonial parade featured the three ............ swords glittering in the morning sunlight.",
    options: [
      "commanders-in-chief's",
      "commander-in-chief's",
      "commanders'-in-chief",
      "commanders-in-chiefs'"
    ],
    correctAnswer: "commanders-in-chief's",
    hint: "Compound noun plural possessive: Form the plural of the base noun ('commanders-in-chief') and add apostrophe + 's' to the final element.",
    workedSolution: "The plural form of 'commander-in-chief' is 'commanders-in-chief'. To form the possessive case of a compound noun, add apostrophe + 's' to the end: 'commanders-in-chief's swords'.",
    points: 1
  },
  {
    number: 6,
    prompt: "............ we worry about the delay since the train is already approaching the terminal?",
    options: ["Need", "Needs", "Do we need", "Must we need"],
    correctAnswer: "Need",
    hint: "When 'need' functions as a semi-modal auxiliary in questions, it takes a bare infinitive without 'to' and does not take 'do'.",
    workedSolution: "As a modal auxiliary in questions, 'Need' precedes the subject without auxiliary 'do': 'Need we worry...?'.",
    points: 1
  },
  {
    number: 7,
    prompt: "The craftsmanship of our local joiners is undeniably superior ............ imported fiberboard furniture.",
    options: ["than", "from", "to", "against"],
    correctAnswer: "to",
    hint: "Comparative adjectives of Latin origin (superior, inferior, senior, junior) strictly collocate with 'to', never 'than'.",
    workedSolution: "Latin comparative adjectives like 'superior' take the preposition 'to': 'superior to imported furniture'.",
    points: 1
  },
  {
    number: 8,
    prompt: "Either the senior prefect or his assistants ............ responsible for organizing the library books yesterday.",
    options: ["was", "is", "were", "are"],
    correctAnswer: "were",
    hint: "Proximity concord with 'either... or': The verb agrees in number with the nearer plural subject ('his assistants') in the past tense.",
    workedSolution: "When subjects are linked by 'either... or', the verb agrees with the closer subject ('his assistants', plural). In the past tense, the correct verb is 'were'.",
    points: 1
  },
  {
    number: 9,
    prompt: "Active: \"The headmaster made the recalcitrant student sweep the assembly hall.\"\nPassive: \"The recalcitrant student was made ............ the assembly hall by the headmaster.\"",
    options: ["sweep", "to sweep", "swept", "sweeping"],
    correctAnswer: "to sweep",
    hint: "Causative verb 'make': In the active voice it takes a bare infinitive, but in the passive voice it requires a full to-infinitive.",
    workedSolution: "In passive voice transformations of causative 'make', the verb takes a full to-infinitive: 'was made to sweep'.",
    points: 1
  },
  {
    number: 10,
    prompt: "The defaulting shopkeeper admitted ............ the missing consignment from the depot.",
    options: ["steal", "stealing", "to steal", "having stolen of"],
    correctAnswer: "stealing",
    hint: "The catenative verb 'admit' takes a gerund complement (verb-ing).",
    workedSolution: "In standard English syntax, the verb 'admit' requires a gerund complement: 'admitted stealing the consignment'.",
    points: 1
  },
  {
    number: 11,
    prompt: "Nowhere in the entire district ............ such dedicated community volunteerism.",
    options: [
      "one can find",
      "can one find",
      "one could find",
      "did one found"
    ],
    correctAnswer: "can one find",
    hint: "Fronted negative adverbial of place ('Nowhere') triggers subject-auxiliary inversion.",
    workedSolution: "When a restrictive or negative adverbial ('Nowhere') begins a sentence, standard English requires subject-auxiliary inversion: 'can one find'.",
    points: 1
  },
  {
    number: 12,
    prompt: "The visiting physician is a trusted childhood companion of ............",
    options: ["her", "hers", "she", "herself"],
    correctAnswer: "hers",
    hint: "Double possessive construction: 'a [noun] of' requires an absolute possessive pronoun.",
    workedSolution: "The double possessive construction ('a companion of...') requires the independent possessive pronoun 'hers': 'a companion of hers'.",
    points: 1
  },
  {
    number: 13,
    prompt: "Nobody in the assembly hall complained about the ventilation, ............ they?",
    options: ["didn't", "did", "was", "weren't"],
    correctAnswer: "did",
    hint: "The indefinite pronoun 'Nobody' carries negative polarity and is referred to by plural pronoun 'they' with an affirmative question tag.",
    workedSolution: "'Nobody' is semantically negative and is referenced by plural pronoun 'they'. The matching question tag must have affirmative polarity in the simple past: 'did they?'.",
    points: 1
  },
  {
    number: 14,
    prompt: "The archaeologists uncovered an ............ monument near the ancient riverbank.",
    options: [
      "ancient triangular stone",
      "triangular ancient stone",
      "stone ancient triangular",
      "ancient stone triangular"
    ],
    correctAnswer: "ancient triangular stone",
    hint: "Cumulative adjective ordering: Age ('ancient') precedes Shape ('triangular') which precedes Material ('stone') before the head noun.",
    workedSolution: "Standard English cumulative adjective ordering places age ('ancient') before shape ('triangular') followed by material origin ('stone'): 'ancient triangular stone monument'.",
    points: 1
  },
  {
    number: 15,
    prompt: "The commission of inquiry completely absolved the security guard ............ all complicity in the theft.",
    options: ["of", "from", "with", "against"],
    correctAnswer: "from",
    hint: "Identify the dependent preposition that regularly collocates with the verb 'absolved' when releasing someone from blame or guilt.",
    workedSolution: "In standard English legal collocations, an accused individual is 'absolved from' blame, liability, or guilt: 'absolved from all complicity'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The forensic auditor scrutinized the financial ledgers for hours.\nChoose the word nearest in meaning to 'scrutinized'.",
    options: ["examined", "collected", "copied", "arranged"],
    correctAnswer: "examined",
    hint: "Examined or inspected closely and thoroughly.",
    workedSolution: "'Scrutinized' means examined closely and thoroughly; 'examined' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "The traditional elders maintained a cordial relationship with the visiting delegates.\nChoose the word nearest in meaning to 'cordial'.",
    options: ["formal", "friendly", "cautious", "strict"],
    correctAnswer: "friendly",
    hint: "Warm and friendly; pleasant and polite.",
    workedSolution: "'Cordial' means warm, courteous, and 'friendly'; 'friendly' is its exact equivalent.",
    points: 1
  },
  {
    number: 18,
    prompt: "The displaced farming community proved remarkably resilient in the face of disaster.\nChoose the word nearest in meaning to 'resilient'.",
    options: ["fearful", "stubborn", "tough", "restless"],
    correctAnswer: "tough",
    hint: "Able to withstand or recover quickly from difficult conditions; hardy or tough.",
    workedSolution: "'Resilient' means capable of enduring hardship and recovering quickly; 'tough' is its closest synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "The science tutor presented a lucid explanation of electromagnetic induction.\nChoose the word nearest in meaning to 'lucid'.",
    options: ["simple", "clear", "brief", "loud"],
    correctAnswer: "clear",
    hint: "Expressed clearly; easy to understand; transparent.",
    workedSolution: "'Lucid' means expressed with clarity and easy to comprehend; 'clear' is its direct synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "The indolent apprentice was cautioned repeatedly for neglecting his daily duties.\nChoose the word nearest in meaning to 'indolent'.",
    options: ["clumsy", "lazy", "disobedient", "arrogant"],
    correctAnswer: "lazy",
    hint: "Wanting to avoid activity or exertion; lazy.",
    workedSolution: "'Indolent' means habitually inactive or idle; 'lazy' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "By investing his entire life savings in a single unproven venture, Kwesi put all his eggs in one basket. This means Kwesi ............",
    options: [
      "purchased a poultry farm",
      "risked everything on a single venture",
      "diversified his commercial assets",
      "wasted his savings carelessly"
    ],
    correctAnswer: "risked everything on a single venture",
    hint: "To risk all of one's resources or hopes on a single venture or course of action.",
    workedSolution: "The idiom 'to put all one's eggs in one basket' means to stake all of one's fortunes on a single enterprise, risking total ruin if it fails.",
    points: 1
  },
  {
    number: 22,
    prompt: "The witness was beating around the bush during cross-examination. This means the witness was ............",
    options: [
      "walking through the countryside",
      "avoiding addressing the main topic directly",
      "insulting the defense counsel",
      "weeping before the court"
    ],
    correctAnswer: "avoiding addressing the main topic directly",
    hint: "To discuss a matter without coming directly to the central point; procrastinating.",
    workedSolution: "The idiom 'to beat around the bush' means to talk about unnecessary details in order to avoid answering directly or addressing the main point.",
    points: 1
  },
  {
    number: 23,
    prompt: "Procuring genuine spare parts for that vintage tractor cost an arm and a leg. This means the parts were ............",
    options: [
      "extremely expensive",
      "physically dangerous",
      "unavailable locally",
      "poorly manufactured"
    ],
    correctAnswer: "extremely expensive",
    hint: "Very expensive; requiring an exorbitant amount of money.",
    workedSolution: "The idiom 'to cost an arm and a leg' means to be exorbitantly or extremely expensive.",
    points: 1
  },
  {
    number: 24,
    prompt: "By carefully reading between the lines of the minister's address, the reporter discerned the truth. This means the reporter ............",
    options: [
      "read through the text quickly",
      "understood the hidden or implied meaning",
      "corrected the typographical errors",
      "criticized the formal grammar"
    ],
    correctAnswer: "understood the hidden or implied meaning",
    hint: "To find hidden meaning in something; discern what is implied rather than stated openly.",
    workedSolution: "The idiom 'to read between the lines' means to perceive the underlying, unspoken, or hidden meaning behind explicit statements.",
    points: 1
  },
  {
    number: 25,
    prompt: "The detective resolved to leave no stone unturned in tracing the abducted infant. This means the detective resolved to ............",
    options: [
      "excavate the riverbank",
      "make every possible effort to achieve the objective",
      "seek assistance from village elders",
      "abandon the investigation"
    ],
    correctAnswer: "make every possible effort to achieve the objective",
    hint: "To try every possible course of action in order to achieve something.",
    workedSolution: "The idiom 'to leave no stone unturned' means to utilize every available resource and make every possible effort to accomplish an aim.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "During the prolonged drought, food supplies were scarce, but after the harvest they became ...... .\nChoose the word most nearly opposite in meaning to 'scarce'.",
    options: ["fresh", "plentiful", "expensive", "wholesome"],
    correctAnswer: "plentiful",
    hint: "'Scarce' means in short supply; rare. What word denotes existing in copious, abundant supply?",
    workedSolution: "'Scarce' means insufficient or rare. Its direct quantitative antonym is 'plentiful' (abundant).",
    points: 1
  },
  {
    number: 27,
    prompt: "While the junior magistrate was remarkably lenient, the appellate judge was exceptionally ...... .\nChoose the word most nearly opposite in meaning to 'lenient'.",
    options: ["severe", "arrogant", "unfair", "impatient"],
    correctAnswer: "severe",
    hint: "'Lenient' means tolerant, mild, or merciful in discipline. What word denotes harsh, strict, and unsparing?",
    workedSolution: "'Lenient' means merciful or mild. Its direct judicial and disciplinary antonym is 'severe' (or strict/harsh).",
    points: 1
  },
  {
    number: 28,
    prompt: "The primary banner was conspicuous at the entrance, while the warning notice was completely ...... .\nChoose the word most nearly opposite in meaning to 'conspicuous'.",
    options: ["tattered", "hidden", "small", "illegible"],
    correctAnswer: "hidden",
    hint: "'Conspicuous' means clearly visible; standing out. What word denotes concealed or kept out of sight?",
    workedSolution: "'Conspicuous' means clearly noticeable and visible. Its direct visual antonym is 'hidden' (concealed or inconspicuous).",
    points: 1
  },
  {
    number: 29,
    prompt: "Our grandmother maintained a frugal kitchen, whereas her visiting relatives were remarkably ...... .\nChoose the word most nearly opposite in meaning to 'frugal'.",
    options: ["greedy", "lavish", "wealthy", "careless"],
    correctAnswer: "lavish",
    hint: "'Frugal' means economical and sparing with resources. What word denotes profuse, extravagant, and generous to excess?",
    workedSolution: "'Frugal' means economical and thrifty. Its direct financial and domestic antonym is 'lavish' (extravagant and spendthrift).",
    points: 1
  },
  {
    number: 30,
    prompt: "The turbulent waters of the ocean surf contrast sharply with the ...... waters of the sheltered lagoon.\nChoose the word most nearly opposite in meaning to 'turbulent'.",
    options: ["calm", "deep", "clean", "narrow"],
    correctAnswer: "calm",
    hint: "'Turbulent' means characterized by violent motion or agitation. What word denotes serene, quiet, and without agitation?",
    workedSolution: "'Turbulent' means wildly agitated or stormy. Its direct physical antonym describing water is 'calm' (or tranquil).",
    points: 1
  },

  // --- SECTION E: CLOZE PASSAGE (MARITIME & FISHERIES REGISTER) (31 - 35) ---
  {
    number: 31,
    prompt: "Cloze Passage: \"The commercial fishing crew prepared their mechanized deep-sea ---31--- for a three-week expedition into international waters.\"\nChoose the most suitable word:",
    options: ["canoe", "trawler", "ferry", "barge"],
    correctAnswer: "trawler",
    hint: "A large commercial fishing vessel designed to operate by dragging a net through the water is a trawler.",
    workedSolution: "In marine fisheries terminology, an industrial ocean-going fishing boat equipped with nets is a 'trawler'.",
    points: 1
  },
  {
    number: 32,
    prompt: "Cloze Passage: \"Before dawn, the vessel steered away from the sheltered quay inside the municipal ---32--- and headed out to sea.\"\nChoose the most suitable word:",
    options: ["harbour", "beach", "shore", "estuary"],
    correctAnswer: "harbour",
    hint: "A sheltered body of water where ships, boats, and barges can be docked or anchored safely is a harbour.",
    workedSolution: "The formal maritime term for a safe, sheltered port facility for ships is a 'harbour'.",
    points: 1
  },
  {
    number: 33,
    prompt: "Cloze Passage: \"The experienced helmsman ---33--- the vessel through the perilous rocky channel using radar and nautical charts.\"\nChoose the most suitable word:",
    options: ["pushed", "guided", "navigated", "drove"],
    correctAnswer: "navigated",
    hint: "To plan, direct, and steer the course of a ship or vehicle using marine instruments is to navigate.",
    workedSolution: "The standard maritime technical verb for steering and directing a vessel across water is 'navigated'.",
    points: 1
  },
  {
    number: 34,
    prompt: "Cloze Passage: \"Using modern sonar fish-finders, the captain located vast ---34--- of tuna moving along the continental shelf.\"\nChoose the most suitable word:",
    options: ["flocks", "shoals", "packs", "crowds"],
    correctAnswer: "shoals",
    hint: "A large number of fish swimming together is termed a shoal (or school).",
    workedSolution: "In marine biological and fishing register, a large collective gathering of fish is a 'shoal' of fish.",
    points: 1
  },
  {
    number: 35,
    prompt: "Cloze Passage: \"Having hauled thirty metric tons of catch into the refrigerated holds, the crew returned to port and securely ---35--- the ship.\"\nChoose the most suitable word:",
    options: ["anchored", "tied", "stopped", "parked"],
    correctAnswer: "anchored",
    hint: "To moor or secure a ship firmly to the seabed using a heavy metal device is to anchor.",
    workedSolution: "The formal nautical term for securing a vessel in position in the water is 'anchored'.",
    points: 1
  },

  // --- PART B: ORAL LANGUAGE & PHONOLOGY (36 - 40) ---
  {
    number: 36,
    prompt: "Choose the word that contains the identical voiceless velar plosive consonant sound as the underlined sound in:\n\"The apprentice suffered from a sharp **stoma<u>ch</u>** ache.\"",
    options: ["monarch", "church", "machine", "charity"],
    correctAnswer: "monarch",
    hint: "The digraph 'ch' in 'stomach' produces the voiceless velar plosive /k/. 'Monarch' (/ˈmɒn.ək/) ends with the identical /k/ sound.",
    workedSolution: "The final sound in 'stomach' is /k/. 'Monarch' terminates in the identical /k/ sound, unlike 'church' (/tʃ/), 'machine' (/ʃ/), and 'charity' (/tʃ/).",
    points: 1
  },
  {
    number: 37,
    prompt: "Choose the word that contains the identical long front vowel sound as the underlined vowel in:\n\"The ferry berthed alongside the concrete **q<u>uay</u>**.\"",
    options: ["scene", "play", "tray", "pay"],
    correctAnswer: "scene",
    hint: "'Quay' is pronounced /kiː/ with the long vowel /iː/. 'Scene' (/siːn/) contains the identical long vowel /iː/.",
    workedSolution: "The word 'quay' is pronounced /kiː/. Among the options, 'scene' (/siːn/) contains the identical /iː/ monophthong, whereas 'play', 'tray', and 'pay' contain the diphthong /eɪ/.",
    points: 1
  },
  {
    number: 38,
    prompt: "Choose the word that shares the identical final consonant cluster sound as:\n\"The historian wrote a treatise on ancient **des<u>pots</u>**.\"",
    options: ["cliffs", "roads", "tents", "paths"],
    correctAnswer: "tents",
    hint: "'Despots' ends in the voiceless plosive-alveolar cluster /ts/. 'Tents' (/tents/) ends in the identical alveolar cluster /ts/.",
    workedSolution: "'Despots' terminates in the voiceless consonant cluster /ts/. 'Tents' shares the identical /ts/ cluster ending.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which of the following words contains a SILENT consonant letter that is not sounded in standard pronunciation?",
    options: ["sign", "sing", "song", "ring"],
    correctAnswer: "sign",
    hint: "In this word meaning a mark, gesture, or notice, the letter 'g' before 'n' is completely silent.",
    workedSolution: "In 'sign' (pronounced /saɪn/), the consonant letter 'g' is completely silent.",
    points: 1
  },
  {
    number: 40,
    prompt: "When an alternative question like \"Would you prefer cold water, or hot tea?\" is spoken in standard English, what intonation contour pattern is used on the two choices?",
    options: [
      "Rising on 'water', and falling on 'tea'",
      "Falling on 'water', and rising on 'tea'",
      "Falling on both 'water' and 'tea'",
      "Rising on both 'water' and 'tea'"
    ],
    correctAnswer: "Rising on 'water', and falling on 'tea'",
    hint: "Standard alternative questions in English rise on the first option and fall on the final option.",
    workedSolution: "In English suprasegmental phonology, an alternative question featuring choices presents a rising pitch contour (↗) on the non-final choice and a falling pitch contour (↘) on the final choice.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 202607);

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
        prompt: "Write a formal letter to your Municipal Chief Executive (MCE), drawing attention to the menace of unregulated commercial advertising billboards erected dangerously near pedestrian crossings and road junctions in your municipality, and proposing at least two practical regulatory measures to avert traffic accidents.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2026

The Municipal Chief Executive
Bekwai Municipal Assembly
Municipal Directorate, Bekwai

Dear Sir,

PETITION REGARDING UNREGULATED COMMERCIAL BILLBOARDS ON TRAFFIC CORRIDORS

On behalf of the youth, pedestrians, and commercial drivers within the Bekwai Municipality, I respectfully submit this petition to draw your urgent attention to the perilous obstruction created by unregulated commercial advertising billboards along our main highway corridors, and to propose practical regulatory measures to protect lives.

Over the past four months, private advertising agencies and local businesses have indiscriminately erected massive steel billboards immediately adjacent to busy intersections, roundabout junctions, and pedestrian zebra crossings. These oversized structures severely obstruct the line of sight for oncoming motorists, preventing drivers from spotting crossing school children and turning vehicles. Furthermore, during recent torrential windstorms, several poorly anchored wooden billboards collapsed directly onto pedestrian walkways, narrowly missing passers-by. If left unchecked, this hazard will cause fatal vehicular collisions.

To permanently resolve this public safety menace, I suggest, first, that the Municipal Assembly enforce a Comprehensive Billboard Demarcation and Permitting Policy. The assembly's spatial planning and engineering department must establish strict statutory setback standards, prohibiting the erection of commercial billboards within fifty meters of any road curve, junction, or pedestrian crossing.

Secondly, the municipal task force should immediately dismantle and confiscate all unapproved, structurally defective billboards. Heavy punitive fines must be imposed on advertising companies that mount unauthorized signs. Furthermore, advertising permits should mandate regular structural safety inspections, ensuring that billboards are constructed with certified wind-resistant steel frames.

We count on your prompt leadership to make our roads safe for all citizens.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Youth Secretary)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in a national daily newspaper on the topic: \"The Vital Necessity of Mental Health Education and Counseling Support Services in Ghanaian Basic Schools.\"",
        modelAnswer: `NURTURING YOUNG MINDS: THE URGENT NEED FOR MENTAL HEALTH SERVICES IN BASIC SCHOOLS
By Samuel K. Boateng, Begoro

In Ghana's basic education discourse, national attention is overwhelmingly directed toward textbook supplies, classroom infrastructure, and academic examination performance. While cognitive learning is crucial, an invisible, deeply agonizing crisis continues to undermine thousands of adolescent learners across our country: the acute deficit of professional mental health education and psychological counseling support in basic schools.

The foremost reality confronting contemporary students is the crushing weight of adolescent emotional stress and social anxiety. Young learners navigate intense pressures, including extreme academic expectations, broken homes, domestic violence, bullying, and the toxic influence of peer comparison on digital social media networks. Because traditional society frequently trivializes adolescent distress as ordinary stubbornness or spiritual attacks, troubled pupils bottle up their depression and grief. Deprived of a safe, confidential environment to express their trauma, many descend into chronic truancy, self-harm, violent aggression, and teenage pregnancy, truncating their academic aspirations.

Secondly, unresolved emotional trauma directly impairs cognitive concentration and scholastic learning. A child afflicted with severe anxiety or post-traumatic stress cannot absorb mathematical formulas or understand science lessons. When schools lack guidance coordinators, struggling students are dismissed as unintelligent or lazy, leading to unnecessary dropouts. Introducing certified guidance and counseling coordinators in every basic school cluster will provide early psychological screening, emotional therapy, and suicide prevention.

Furthermore, integrating mental health awareness into the national basic curriculum will dismantle societal stigmatization, teaching children that seeking emotional help is a sign of wisdom, not weakness.

A nation that educates the brain while neglecting the emotional wellness of the heart prepares a fragile future; our basic schools must prioritize mental health today.`
      },
      {
        questionNumber: "3",
        category: "Narrative Moral Story",
        prompt: "Write an engaging, realistic story that illustrates the traditional proverb: \"Every cloud has a silver lining.\"",
        modelAnswer: `EVERY CLOUD HAS A SILVER LINING

During our final academic term in junior high school, my childhood desk-mate, Kofi, was the undisputed star sprinter of our district. He had spent three rigorous years training for the National Basic Schools 100-Meter Athletics Championship, harboring the cherished dream of winning a secondary school athletic scholarship to realize his ambition of becoming a sports physician.

Tragedy struck barely a week before the national championship. While assisting his mother to haul a basin of cassava on their farm, Kofi slipped on a wet mossy log, suffering a severe triple compound fracture of his right ankle. The municipal orthopedic surgeon cast his leg in heavy plaster, declaring with finality that Kofi could not walk without crutches for six months. Devastated and heartbroken, Kofi broke down in bitter tears, believing his future was completely extinguished. I reminded him gently of our grandmother's favorite saying, "Every cloud has a silver lining," but he turned his face to the wall in deep despair.

Unable to run, Kofi was appointed as the school team's student analyst and tactical coordinator. Sitting on the sidelines with his crutches, he focused his sharp mind on studying sprint biomechanics, pacing techniques, and baton exchange coordination. Utilizing a donated tablet computer, he recorded training sessions, identifying technical flaws in our relay squad's running posture and designing optimized sprint drills.

Under Kofi's brilliant technical coaching, our underdog 4x100-meter relay team set a breathtaking new national record at the championship! During the awards ceremony, the National Sports Authority was so impressed by Kofi's tactical data analysis that they awarded him a full STEM scholarship to study Sports Science and Biomechanics at the University of Ghana.

Weeping with joy as he received his scholarship letter, Kofi embraced me warmly, realizing that his broken bone had opened the door to his true destiny: Truly, every cloud has a silver lining.`
      }
    ]
  },
  partB_comprehension: {
    title: "Part B: Reading Comprehension",
    instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
    passageText: `In contemporary public discourse on economic modernization, tourism is universally celebrated as a non-polluting "smokeless industry" capable of generating foreign exchange, stimulating infrastructural development, and creating millions of service jobs. Developing nations across tropical regions aggressively market their pristine sandy beaches, historical castles, and exotic game reserves to affluent foreign travelers, viewing tourism as a golden shortcut to national prosperity.

However, an objective socio-economic and ecological appraisal reveals that mass tourism represents a precarious double-edged sword. When left unregulated by rigorous statutory guidelines, the rapid expansion of commercial tourism can extract a devastating toll on indigenous cultures and fragile ecological habitats.

The most insidious consequence of uncontrolled tourism is the commodification and degradation of indigenous cultural heritage. Traditional sacred festivals, ritual dances, and spiritual ceremonies—which originally possessed deep religious and cosmological significance for local communities—are frequently degraded into cheap, superficial entertainment spectacles packaged for vacationing tourists. Sacred shrines are commercialized, and pristine cultural taboos are violated by visitors who display open disrespect for local customs. Furthermore, the massive influx of affluent tourists often sparks acute cultural contamination among local youth, encouraging substance abuse, juvenile prostitution, and the erosion of indigenous linguistic identity.

Ecologically, the footprint of mass tourism is often disastrous. The construction of sprawling luxury beach resorts, golf courses, and access highways frequently leads to the ruthless destruction of vital coastal mangrove wetlands and tropical forests. Luxury hotels consume astronomical volumes of fresh water and generate mountains of non-biodegradable plastic waste, while municipal lagoons and coral reefs are poisoned by raw sewage discharges. Furthermore, in many developing enclaves, the promised economic benefits fail to materialize for the local populace; luxury hotels are owned by foreign multinational conglomerates, meaning that over seventy percent of tourism revenues are repatriated overseas, leaving host communities to bear the social and ecological costs.

Environmental economists conclude that the salvation of the industry lies in ecotourism—a sustainable model that prioritizes environmental conservation, respects local cultural autonomy, and ensures that financial revenues remain directly within community-owned enterprises.`,
    questions: [
      {
        subQuestion: "(a)",
        question: "State two economic benefits of tourism mentioned in the opening paragraph of the passage.",
        answer: "1. Generating foreign exchange.\n2. Stimulating infrastructural development (or creating service jobs)."
      },
      {
        subQuestion: "(b)",
        question: "How does uncontrolled tourism lead to the degradation of indigenous cultural heritage?",
        answer: "Traditional sacred festivals, ritual dances, and spiritual ceremonies are turned into cheap, commercialized entertainment spectacles for tourists, and local customs are disrespected."
      },
      {
        subQuestion: "(c)",
        question: "Mention two specific ecological problems caused by luxury hotel resorts in coastal areas.",
        answer: "1. Destruction of vital coastal mangrove wetlands and forests.\n2. Poisoning of lagoons and coral reefs with raw sewage (or consumption of huge amounts of water and generation of plastic waste)."
      },
      {
        subQuestion: "(d)",
        question: "Why do local communities in many developing regions fail to benefit financially from mass tourism?",
        answer: "Because luxury hotels are owned by foreign multinational conglomerates that send over seventy percent of the tourism revenues overseas."
      },
      {
        subQuestion: "(e)",
        question: "Explain the meaning of the following expressions as used in the passage:\nI. ... smokeless industry;\nII. ... double-edged sword;\nIII. ... repatriated overseas.",
        answer: "I. 'smokeless industry' means an economic enterprise or trade that generates wealth without the industrial factory smoke and physical air pollution associated with manufacturing.\nII. 'double-edged sword' means a situation, choice, or development that has both favorable advantages and dangerous, unfavorable consequences simultaneously.\nIII. 'repatriated overseas' means sent back, transferred, or returned to one's own foreign country."
      },
      {
        subQuestion: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. appraisal;\nII. commodification;\nIII. influx;\nIV. autonomy.",
        answer: "I. appraisal: evaluation, assessment, analysis, review.\nII. commodification: commercialization, turning into merchandise, marketing.\nIII. influx: arrival, inflow, rush, stream, surge.\nIV. autonomy: self-determination, independence, sovereignty, freedom."
      },
      {
        subQuestion: "(g)",
        question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the two major negative impacts of uncontrolled tourism discussed in the passage.",
        answer: "1. Tourism degrades sacred local cultural traditions.\n2. Resort construction destroys fragile coastal environments."
      }
    ]
  },
  partC_literature: {
    title: "Part C: Literature in English (The Beacon of Light Anthology)",
    instructions: "Answer all questions in this part based on the prescribed selections from the NaCCA Common Core Programme anthology: The Beacon of Light.",
    questions: [
      {
        sectionTitle: "CHARLES DICKENS: Oliver Twist (Chapter 2: Oliver Asks for More)",
        contextExtract: "\"When Oliver Twist is advised to pray for the people who take care of him, the author suggests that caretakers should lead by showing how a Christian or good person should behave. Instead, parish funds were pocketed, and children were left in misery.\"",
        subItems: [
          {
            subQuestion: "5(a)",
            question: "What moral contradiction in the behavior of the parish caretakers is highlighted in this excerpt?",
            answer: "The hypocrisy of parish authorities advising orphans to pray for them while systematically neglecting their duty of care, embezzling relief funds, and subjecting children to starvation."
          },
          {
            subQuestion: "5(b)",
            question: "How does Dickens use satire to expose the false piety of Mrs. Mann and Mr. Bumble?",
            answer: "He portrays them as using outward religious language and demanding respect while callously abusing, starving, and exploiting the vulnerable orphans under their supervision."
          }
        ]
      },
      {
        sectionTitle: "CONTEMPORARY DRAMA: Spreading Light",
        contextExtract: "\"ASANTEWAA: The light is for the whole village, Sir Nii. Kwansah hid the panels, but he could not hide the truth.\nSIR NII: When we shine light upon dishonesty on the public path, the entire village learns what true character means.\"",
        subItems: [
          {
            subQuestion: "5(c)",
            question: "What dual symbolic meaning does 'light' carry in this dramatic exchange?",
            answer: "It symbolizes both physical electrical illumination from the solar panels and the moral truth that exposes hidden deceit and corruption."
          },
          {
            subQuestion: "5(d)",
            question: "Why was the public path an appropriate setting for resolving the conflict of Kwansah's theft?",
            answer: "The public path represents communal life and collective accountability, ensuring that justice, parental complicity, and restoration were witnessed by the whole village."
          }
        ]
      },
      {
        sectionTitle: "HISTORICAL POETRY: The Golden Stool / Okomfo Anokye",
        contextExtract: "\"A treasure trove, of stories yet untold,\nForging a nation in its shining gold;\nThrough twilight's hush the sacred vessel came,\nTo kindle in each heart a lasting flame.\"",
        subItems: [
          {
            subQuestion: "5(e)",
            question: "Explain the metaphor 'A treasure trove, of stories yet untold'.",
            answer: "It compares the Golden Stool to a boundless repository that holds the unwritten history, ancestral sacrifices, cultural memory, and future destiny of the Ashanti people."
          },
          {
            subQuestion: "5(f)",
            question: "What is the 'lasting flame' kindled in the hearts of the Akan people?",
            answer: "An enduring spirit of national unity, cultural pride, patriotism, and collective identity that binds the chiefdoms together."
          }
        ]
      },
      {
        sectionTitle: "PHILOSOPHICAL POETRY: The Unseen Painter",
        contextExtract: "\"In the vast gallery of earth,\nWhere varied forms reside,\nThe Painter mocks our petty walls,\nAnd shames our racial pride.\"",
        subItems: [
          {
            subQuestion: "5(g)",
            question: "Deconstruct the personification 'The Painter mocks our petty walls'.",
            answer: "The Creator is depicted as viewing man-made social, ethnic, and racial boundaries with scorn, revealing that human prejudice is artificial and contradicts the harmony of divine creation."
          },
          {
            subQuestion: "5(h)",
            question: "What message does the poem convey regarding 'racial pride'?",
            answer: "It condemns racial pride and supremacy as foolish arrogance, asserting that all human complexions are intentional, equal brushstrokes on God's universal canvas."
          }
        ]
      },
      {
        sectionTitle: "PROSE NARRATIVE: Beyond Light and Shadow",
        contextExtract: "\"MRS. ACQUAH: You built this school with mortar and stone, but you allowed fear to rot the roof. When Nkrabea pays a boy to break a window, he is not buying glass; he is buying your silence.\nBENSON: (Stepping forward, head bowed) The silence ends today, Nana. I am ready to speak.\"",
        subItems: [
          {
            subQuestion: "5(i)",
            question: "Explain Mrs. Acquah's metaphor: 'you allowed fear to rot the roof'.",
            answer: "She means that while the school had physical stone buildings, the community's cowardice and submission to intimidation had ruined its moral protection and institutional integrity."
          },
          {
            subQuestion: "5(j)",
            question: "What does Benson's decision to speak out represent in his personal character arc?",
            answer: "It marks his moral transformation and redemption: overcoming fear and complicity in Ashes Flame to take courageous responsibility as a true leader."
          }
        ]
      }
    ]
  }
};

async function seedBeceEnglishMock7() {
  console.log("Seeding Isolated BECE English Mock 7 into Firestore with Beacon of Light curriculum...");

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

  // Strictly partitioned path: subjects/english/mocks/mock_7
  const docRef = db.doc("global_curriculum/jhs/subjects/english/mocks/mock_7");
  await docRef.set({
    mockId: "mock_7",
    mockNumber: 7,
    title: "BECE English Language National Mock Examination 7",
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
          title: "Section E: Maritime and Fisheries Cloze Passage",
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

  console.log("✅ BECE English Mock 7 successfully updated with Beacon of Light at subjects/english/mocks/mock_7!");
}

seedBeceEnglishMock7()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed BECE English Mock 7:", err);
    process.exit(1);
  });
