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
// 40 OBJECTIVE QUESTIONS: LEXIS, STRUCTURE, TELECOM CLOZE & ORAL PHONOLOGY
// =========================================================================
const allRawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "Aba now bitterly wishes she ............ to her mother's counsel before embarking on the journey.",
    options: [
      "listened",
      "had listened",
      "listens",
      "would listen"
    ],
    correctAnswer: "had listened",
    hint: "Past counterfactual wish: Regretting a past failure to act requires the past perfect tense ('had + past participle').",
    workedSolution: "When 'wish' expresses regret concerning an event that did not take place in the past, standard English requires the past perfect: 'wishes she had listened'.",
    points: 1
  },
  {
    number: 2,
    prompt: "Not only ............ the delicate wood carving, but he also polished the surface to perfection.",
    options: [
      "the artisan crafted",
      "did the artisan craft",
      "the artisan had crafted",
      "crafted the artisan"
    ],
    correctAnswer: "did the artisan craft",
    hint: "Correlative negative adverbial fronting: 'Not only' at the beginning of a clause triggers subject-auxiliary inversion.",
    workedSolution: "When 'Not only' begins a sentence, standard English requires subject-auxiliary inversion: 'did the artisan craft'.",
    points: 1
  },
  {
    number: 3,
    prompt: "The careless apprentice was severely blamed ............ the loss of the workshop tools.",
    options: ["about", "of", "for", "with"],
    correctAnswer: "for",
    hint: "Identify the dependent preposition that regularly collocates with the verb 'blamed' when specifying the cause or wrongdoing.",
    workedSolution: "In standard English collocations, one is 'blamed for' an action or loss: 'blamed for the loss of the workshop tools'.",
    points: 1
  },
  {
    number: 4,
    prompt: "The school secretary purchased a ............ of bond paper for printing examination scripts.",
    options: ["sheet", "bale", "ream", "pad"],
    correctAnswer: "ream",
    hint: "Identify the specific partitive noun that designates a standardized package of paper (typically 500 sheets).",
    workedSolution: "In commercial and standard English stationery collocations, paper is measured partitively in 'reams': 'a ream of paper'.",
    points: 1
  },
  {
    number: 5,
    prompt: "The family durbar was attended by all the three ............ families.",
    options: [
      "brothers-in-law's",
      "brother-in-laws'",
      "brothers'-in-law",
      "brother's-in-law"
    ],
    correctAnswer: "brothers-in-law's",
    hint: "Compound noun plural possessive: Form the plural of the base noun ('brothers-in-law') and append apostrophe + 's' to the final element.",
    workedSolution: "The plural form of 'brother-in-law' is 'brothers-in-law'. Its possessive form is formed by adding apostrophe + 's' to the final word: 'brothers-in-law's families'.",
    points: 1
  },
  {
    number: 6,
    prompt: "Candidates who have paid their statutory registration fees ............ purchase supplementary vouchers.",
    options: ["need not", "needs not", "need not to", "needs not to"],
    correctAnswer: "need not",
    hint: "As a semi-modal auxiliary in the negative, 'need' takes no third-person '-s' and is followed by a bare infinitive without 'to'.",
    workedSolution: "When used as a modal auxiliary in the negative, 'need' takes a bare infinitive without 'to': 'need not purchase'.",
    points: 1
  },
  {
    number: 7,
    prompt: "Our grandmother always prefers commuting by train ............ boarding commercial minibuses.",
    options: ["than", "to", "against", "from"],
    correctAnswer: "to",
    hint: "The comparative verb 'prefer' takes the preposition 'to', never 'than'.",
    workedSolution: "In standard English syntax, the verb 'prefer' requires the preposition 'to': 'prefers commuting by train to boarding minibuses'.",
    points: 1
  },
  {
    number: 8,
    prompt: "Neither the headmaster nor the bursar ............ present at the zonal athletic festival yesterday.",
    options: ["were", "are", "was", "is"],
    correctAnswer: "was",
    hint: "Proximity concord with 'neither... nor': In the past tense, the verb agrees in number with the nearer singular subject ('the bursar').",
    workedSolution: "When subjects are linked by 'neither... nor', the verb agrees in number with the closer subject ('the bursar', singular). In the past tense, the correct verb is 'was'.",
    points: 1
  },
  {
    number: 9,
    prompt: "Before embarking on the cross-country tour, the director had his diesel vehicle ............ by an engineer.",
    options: ["overhaul", "overhauled", "overhauling", "to overhaul"],
    correctAnswer: "overhauled",
    hint: "Passive causative structure: have + object + past participle (indicating an action performed by someone else).",
    workedSolution: "In passive causative constructions expressing an action performed by another party ('had + object'), the past participle is required: 'had his vehicle overhauled'.",
    points: 1
  },
  {
    number: 10,
    prompt: "The defaulting accountant admitted ............ the confidential financial registers from the strongroom.",
    options: [
      "misplace",
      "having misplace",
      "misplacing",
      "to misplace"
    ],
    correctAnswer: "misplacing",
    hint: "The catenative verb 'admit' takes a gerund complement (verb-ing).",
    workedSolution: "In standard English syntax, the verb 'admit' takes a gerund complement: 'admitted misplacing the confidential registers'.",
    points: 1
  },
  {
    number: 11,
    prompt: "Only when the final assembly bell chimed ............ the examination scripts.",
    options: [
      "the invigilators collected",
      "did the invigilators collect",
      "the invigilators had collected",
      "collected the invigilators"
    ],
    correctAnswer: "did the invigilators collect",
    hint: "Fronted restrictive time phrase ('Only when...') triggers subject-auxiliary inversion in the main clause.",
    workedSolution: "When a sentence begins with an emphatic restrictive temporal phrase ('Only when...'), standard English requires subject-auxiliary inversion: 'did the invigilators collect'.",
    points: 1
  },
  {
    number: 12,
    prompt: "The newly posted agricultural extension officer is an esteemed childhood companion of ............",
    options: ["him", "his", "he", "himself"],
    correctAnswer: "his",
    hint: "Double possessive construction: 'a [noun] of' requires an absolute possessive pronoun.",
    workedSolution: "In double possessive constructions ('a companion of...'), standard grammar requires the independent possessive pronoun 'his': 'a childhood companion of his'.",
    points: 1
  },
  {
    number: 13,
    prompt: "He hardly speaks during morning devotions, ............ he?",
    options: ["doesn't", "does", "did", "didn't"],
    correctAnswer: "does",
    hint: "The semi-negative adverb 'hardly' gives the main clause negative polarity, requiring an affirmative present question tag.",
    workedSolution: "'Hardly' carries negative polarity, requiring an affirmative tag. With simple present lexical verb 'speaks', the matching tag is 'does he?'.",
    points: 1
  },
  {
    number: 14,
    prompt: "The paramount chief wore a ............ cloth to the grand durbar.",
    options: [
      "splendid antique Ghanaian ceremonial kente",
      "antique splendid Ghanaian ceremonial kente",
      "Ghanaian splendid antique ceremonial kente",
      "splendid Ghanaian antique ceremonial kente"
    ],
    correctAnswer: "splendid antique Ghanaian ceremonial kente",
    hint: "Cumulative adjective ordering: Opinion/Evaluation ('splendid') precedes Age ('antique') which precedes Origin ('Ghanaian') followed by Purpose ('ceremonial').",
    workedSolution: "Standard English cumulative adjective ordering places evaluation ('splendid') before age ('antique') followed by origin ('Ghanaian') and purpose ('ceremonial'): 'splendid antique Ghanaian ceremonial kente cloth'.",
    points: 1
  },
  {
    number: 15,
    prompt: "Following the high court trial, the innocent clerk was completely acquitted ............ all criminal charges.",
    options: ["from", "with", "of", "against"],
    correctAnswer: "of",
    hint: "Identify the dependent preposition that regularly collocates with the legal verb 'acquitted'.",
    workedSolution: "In standard legal collocations, an accused person is 'acquitted of' charges: 'acquitted of all criminal charges'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The internal auditor was remarkably scrupulous in verifying every payment voucher.\nChoose the word nearest in meaning to 'scrupulous'.",
    options: ["meticulous", "quick", "casual", "brief"],
    correctAnswer: "meticulous",
    hint: "Diligent, thorough, and extremely attentive to details; careful.",
    workedSolution: "'Scrupulous' means showing great care, thoroughness, and attention to detail; 'meticulous' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "The mathematics instructor gave a lucid demonstration of geometric theorems.\nChoose the word nearest in meaning to 'lucid'.",
    options: ["transparent", "lengthy", "complex", "formal"],
    correctAnswer: "transparent",
    hint: "Expressed clearly; easy to understand; clear and lucid.",
    workedSolution: "'Lucid' means expressed with clarity and easy to comprehend; 'transparent' (in the sense of clear and plain) is its closest synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "Felling timber in the dense equatorial rainforest is an arduous occupation.\nChoose the word nearest in meaning to 'arduous'.",
    options: ["strenuous", "tedious", "perilous", "slow"],
    correctAnswer: "strenuous",
    hint: "Involving or requiring strenuous effort; difficult and tiring.",
    workedSolution: "'Arduous' means requiring immense physical or mental exertion; 'strenuous' is its direct synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "The headmistress gave a candid appraisal of the school's performance.\nChoose the word nearest in meaning to 'candid'.",
    options: ["frank", "harsh", "polite", "careless"],
    correctAnswer: "frank",
    hint: "Truthful and straightforward; outspoken.",
    workedSolution: "'Candid' means truthful, straightforward, and sincere; 'frank' is its exact equivalent.",
    points: 1
  },
  {
    number: 20,
    prompt: "The agrarian community proved remarkably resilient despite the severe drought.\nChoose the word nearest in meaning to 'resilient'.",
    options: ["tough", "fearful", "stubborn", "restless"],
    correctAnswer: "tough",
    hint: "Able to withstand or recover quickly from difficult conditions; hardy.",
    workedSolution: "'Resilient' means capable of enduring hardship and recovering quickly; 'tough' is its closest synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "Failing the promotion examination was a bitter pill to swallow for the ambitious clerk. This means the failure was ............",
    options: [
      "a physical medicine to be ingested",
      "an unpleasant reality that had to be accepted",
      "a minor issue that was quickly forgotten",
      "a source of joyful amusement"
    ],
    correctAnswer: "an unpleasant reality that had to be accepted",
    hint: "An unpleasant, humiliating, or painful fact or outcome that one must accept.",
    workedSolution: "The idiom 'a bitter pill to swallow' refers to an unpleasant, harsh, or painful reality that must be accepted despite discomfort.",
    points: 1
  },
  {
    number: 22,
    prompt: "The candidate was informed at the eleventh hour about the rescheduling of the interview. This means the news was received ............",
    options: [
      "at exactly eleven o'clock",
      "at the very latest possible moment",
      "with generous advance notice",
      "instantly without delay"
    ],
    correctAnswer: "at the very latest possible moment",
    hint: "At the latest possible moment; almost too late.",
    workedSolution: "The idiom 'at the eleventh hour' means at the very last moment or when it is almost too late.",
    points: 1
  },
  {
    number: 23,
    prompt: "By repeating unverified rumors, Kwame was merely adding fuel to the fire. This means Kwame was ............",
    options: [
      "supplying firewood to the kitchen",
      "worsening an already bad or tense situation",
      "resolving the community conflict",
      "preventing further arguments"
    ],
    correctAnswer: "worsening an already bad or tense situation",
    hint: "To make an argument, conflict, or bad situation even worse.",
    workedSolution: "The idiom 'to add fuel to the fire' means to exacerbate, inflame, or worsen an already hostile or difficult situation.",
    points: 1
  },
  {
    number: 24,
    prompt: "The evasive witness was beating around the bush during cross-examination. This means the witness was ............",
    options: [
      "clearing the courthouse lawn",
      "avoiding answering the main question directly",
      "insulting the presiding magistrate",
      "weeping before the assembly"
    ],
    correctAnswer: "avoiding answering the main question directly",
    hint: "To discuss a matter without coming directly to the central point; procrastinating.",
    workedSolution: "The idiom 'to beat around the bush' means to talk about unnecessary details in order to avoid answering directly or addressing the main point.",
    points: 1
  },
  {
    number: 25,
    prompt: "The senior prefect hit the nail on the head when he diagnosed the cause of campus indiscipline. This means the prefect ............",
    options: [
      "practiced carpentry skills",
      "described the exact truth of the situation with precision",
      "misunderstood the students' concerns",
      "criticized the tutors unfairly"
    ],
    correctAnswer: "described the exact truth of the situation with precision",
    hint: "To describe exactly what is causing a situation or state the precise truth.",
    workedSolution: "The idiom 'to hit the nail on the head' means to describe a situation with exact accuracy or state the precise truth.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "While potable water was plentiful in the forest zone, it was remarkably ...... across the arid savannah.\nChoose the word most nearly opposite in meaning to 'plentiful'.",
    options: ["scanty", "fresh", "clean", "polluted"],
    correctAnswer: "scanty",
    hint: "'Plentiful' means existing in large amounts; abundant. What word denotes meager, scarce, or insufficient in quantity?",
    workedSolution: "'Plentiful' means abundant. Its direct quantitative and environmental antonym is 'scanty' (meager or insufficient).",
    points: 1
  },
  {
    number: 27,
    prompt: "The new administration repealed the draconian penalties and instituted ...... guidelines.\nChoose the word most nearly opposite in meaning to 'draconian'.",
    options: ["lenient", "severe", "complex", "costly"],
    correctAnswer: "lenient",
    hint: "'Draconian' means excessively harsh, rigorous, and severe. What word denotes tolerant, mild, and merciful in discipline?",
    workedSolution: "'Draconian' means excessively severe or harsh. Its direct disciplinary antonym is 'lenient' (mild, merciful, and tolerant).",
    points: 1
  },
  {
    number: 28,
    prompt: "The main notice board was conspicuous, whereas the directional signboard was completely ...... .\nChoose the word most nearly opposite in meaning to 'conspicuous'.",
    options: ["hidden", "tattered", "small", "illegible"],
    correctAnswer: "hidden",
    hint: "'Conspicuous' means clearly visible; standing out. What word denotes kept out of sight or concealed?",
    workedSolution: "'Conspicuous' means easily seen or noticeable. Its direct antonym is 'hidden' (concealed or inconspicuous).",
    points: 1
  },
  {
    number: 29,
    prompt: "While our grandfather was exceptionally thrifty with money, his eldest son was remarkably ...... .\nChoose the word most nearly opposite in meaning to 'thrifty'.",
    options: ["extravagant", "generous", "wealthy", "careful"],
    correctAnswer: "extravagant",
    hint: "'Thrifty' means economical, prudent, and sparing with resources. What word denotes spending money excessively or wastefully?",
    workedSolution: "'Thrifty' means frugal and economical. Its direct financial antonym is 'extravagant' (wasteful and lavish).",
    points: 1
  },
  {
    number: 30,
    prompt: "The turbulent waters of the ocean surf contrast sharply with the ...... waters of the sheltered bay.\nChoose the word most nearly opposite in meaning to 'turbulent'.",
    options: ["tranquil", "shallow", "clean", "narrow"],
    correctAnswer: "tranquil",
    hint: "'Turbulent' means characterized by violent motion or agitation. What word denotes calm, serene, and undisturbed?",
    workedSolution: "'Turbulent' means wildly agitated or stormy. Its direct physical antonym describing water is 'tranquil' (calm and peaceful).",
    points: 1
  },

  // --- SECTION E: CLOZE PASSAGE (TELECOMMUNICATIONS & NETWORK REGISTER) (31 - 35) ---
  {
    number: 31,
    prompt: "Cloze Passage: \"High-speed digital telecommunications require immense network ---31--- to transmit multimedia data without delay.\"\nChoose the most suitable word:",
    options: ["bandwidth", "frequency", "volume", "capacity"],
    correctAnswer: "bandwidth",
    hint: "The maximum data transfer rate of a network or internet connection is bandwidth.",
    workedSolution: "In telecommunications, the data-carrying capacity of a transmission medium is formally designated as 'bandwidth'.",
    points: 1
  },
  {
    number: 32,
    prompt: "Cloze Passage: \"Excessive network congestion results in frustrating transmission ---32---, causing severe buffering during video calls.\"\nChoose the most suitable word:",
    options: ["pause", "latency", "stoppage", "interference"],
    correctAnswer: "latency",
    hint: "The time delay between the transmission and receipt of a digital data signal is latency.",
    workedSolution: "In network engineering, time delay in data transmission is technically termed 'latency'.",
    points: 1
  },
  {
    number: 33,
    prompt: "Cloze Passage: \"Underground ---33--- cables utilize light pulses through glass strands to achieve ultra-fast data speeds.\"\nChoose the most suitable word:",
    options: ["copper", "fiber-optic", "aluminum", "metallic"],
    correctAnswer: "fiber-optic",
    hint: "Technology that uses glass or plastic threads to transmit data as light waves: fiber-optic cables.",
    workedSolution: "Cables that transmit data as pulses of light through glass strands are designated as 'fiber-optic' cables.",
    points: 1
  },
  {
    number: 34,
    prompt: "Cloze Passage: \"Specialized hardware devices called ---34--- inspect data headers to forward traffic along optimal pathways.\"\nChoose the most suitable word:",
    options: ["terminals", "routers", "adapters", "connectors"],
    correctAnswer: "routers",
    hint: "A networking device that forwards data packets between computer networks is a router.",
    workedSolution: "In network architecture, hardware devices that direct and route digital traffic are 'routers'.",
    points: 1
  },
  {
    number: 35,
    prompt: "Cloze Passage: \"Before transmission, digital files are broken down into discrete units of data termed a ---35---.\"\nChoose the most suitable word:",
    options: ["slice", "packet", "fragment", "block"],
    correctAnswer: "packet",
    hint: "A basic unit of data grouped together and transferred over a computer network is a data packet.",
    workedSolution: "In digital communications, structured segments of transmitted data are formally termed 'packets'.",
    points: 1
  },

  // --- PART B: ORAL LANGUAGE & PHONOLOGY (36 - 40) ---
  {
    number: 36,
    prompt: "Choose the word that contains the identical voiceless dental fricative consonant sound as the underlined sound in:\n\"The **au<u>th</u>or** published a novel.\"",
    options: ["method", "feather", "weather", "clothe"],
    correctAnswer: "method",
    hint: "The sound in 'author' is the voiceless dental fricative /θ/. 'Method' (/ˈmeθ.əd/) contains the exact identical /θ/ sound.",
    workedSolution: "The word 'author' contains the voiceless fricative /θ/ (/ˈɔː.θər/). Among the options, 'method' (/ˈmeθ.əd/) contains the identical /θ/ sound, whereas 'feather', 'weather', and 'clothe' contain voiced /ð/.",
    points: 1
  },
  {
    number: 37,
    prompt: "Choose the word that contains the identical diphthong sound as the underlined vowel in:\n\"The farmer guided the oxen to **pl<u>ough</u>** the field.\"",
    options: ["bough", "rough", "tough", "though"],
    correctAnswer: "bough",
    hint: "'Plough' contains the closing diphthong /aʊ/. 'Bough' (/baʊ/) contains the exact identical /aʊ/ sound.",
    workedSolution: "'Plough' is pronounced /plaʊ/ containing the diphthong /aʊ/. 'Bough' (/baʊ/) shares the identical /aʊ/ sound, whereas 'rough' and 'tough' have /ʌ/, and 'though' has /əʊ/.",
    points: 1
  },
  {
    number: 38,
    prompt: "Choose the word that shares the identical final consonant cluster sound as:\n\"The chemist washed the laboratory **fla<u>sks</u>**.\"",
    options: ["masks", "masts", "clasps", "paths"],
    correctAnswer: "masks",
    hint: "'Flasks' terminates in the voiceless velar-alveolar consonant cluster /sks/. 'Masks' (/mɑːsks/) ends in the identical /sks/ cluster.",
    workedSolution: "'Flasks' terminates in the consonant cluster /sks/. 'Masks' shares the exact identical /sks/ cluster.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which of the following words contains a SILENT consonant letter that is not voiced in standard pronunciation?",
    options: ["subtle", "table", "bubble", "marble"],
    correctAnswer: "subtle",
    hint: "In this word meaning delicate, precise, or understated, the letter 'b' before 't' is completely silent.",
    workedSolution: "In 'subtle' (pronounced /ˈsʌt.əl/), the consonant letter 'b' is completely silent, unlike in 'table', 'bubble', and 'marble' where /b/ is sounded.",
    points: 1
  },
  {
    number: 40,
    prompt: "When the information question \"Where did you keep the official receipt booklet?\" is uttered in standard English, what intonation contour is normally used?",
    options: [
      "Falling intonation",
      "Rising intonation",
      "Rise-fall intonation",
      "Level intonation"
    ],
    correctAnswer: "Falling intonation",
    hint: "Standard Wh-questions in English normally conclude with a falling pitch contour (↘).",
    workedSolution: "In English suprasegmental phonology, standard information-seeking Wh-questions conclude with a terminal falling intonation contour (↘).",
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

const assignedTargetIndices = seedShuffle(targetKeys, 202611);

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
        prompt: "Write a formal letter to your District Director of Health Services, drawing attention to the acute shortage of potable drinking water in basic schools within your district, and proposing at least two practical public health interventions to prevent waterborne disease outbreaks among students.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2026

The District Director of Health Services
Ghana Health Service
Municipal Health Directorate, Bekwai

Dear Sir,

PETITION REGARDING ACUTE WATER SHORTAGE IN BASIC SCHOOLS AND PROPOSED INTERVENTIONS

On behalf of the students, teachers, and school health coordinators within the Bekwai Municipality, I respectfully submit this petition to draw your urgent attention to the acute scarcity of clean drinking water in our basic schools, and to propose practical public health interventions to avert catastrophic disease outbreaks.

Across more than ten basic schools in our rural hinterlands, students endure entire instructional days without access to safe drinking water. School boreholes have either broken down mechanically or dried up due to the prolonged dry season. Consequently, thirsty pupils are forced to drink from untreated, stagnant streams shared with grazing cattle, or purchase uncertified, unhygienic water sachets from informal roadside vendors. Over the past two months, municipal clinics have recorded an alarming surge in student hospitalizations due to acute gastroenteritis, typhoid fever, and dysentery. If left unresolved, this sanitary crisis will severely disrupt the upcoming national BECE examinations.

To combat this public health emergency, I suggest, first, that the District Health Directorate collaborate with the Municipal Assembly and Community Water and Sanitation Agency to construct Mechanized Solar-Powered Boreholes equipped with biological sand-filtration systems in every affected school cluster.

Secondly, the health directorate should supply water-purification chemical tablets and commercial ceramic water filters directly to school kitchens and classrooms. Establishing active School Health and Sanitation Committees to test water quality weekly will ensure that every child drinks safe, clean water.

We count on your prompt leadership to safeguard our lives and education.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Health and Sanitation Prefect)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in your school magazine on the topic: \"The Menace of Cyber-Bullying Among Adolescents and Practical Ways Students Can Promote Digital Kindness.\"",
        modelAnswer: `BREAKING THE TOXIC SCREEN: CONQUERING CYBER-BULLYING AMONG ADOLESCENTS
By Samuel K. Boateng, Begoro

The twenty-first century digital revolution has transformed telecommunications, placing smartphones and social media networks into the hands of millions of Ghanaian basic and secondary school students. While digital connectivity offers valuable educational research tools, an insidious, deeply damaging social pandemic has emerged across social media platforms: the rampant escalation of cyber-bullying.

Cyber-bullying manifests through malicious insults, defamatory rumors, the unauthorized sharing of private photographs, and organized digital exclusion targeted at vulnerable classmates. Unlike traditional compound teasing that ends with the closing bell, online harassment follows victims into their private bedrooms, operating twenty-four hours a day. The anonymity afforded by internet messaging applications emboldens cruel individuals to inflict deep emotional wounds without fear of immediate adult reprimand. Victims suffer from chronic anxiety, severe depression, sleep deprivation, and acute feelings of worthlessness, which frequently precipitate academic decline and school dropouts.

To eradicate this menace, students must deliberately champion digital kindness and online empathy. First, learners must adopt the Golden Rule of the internet: never type or share any message online that you would not speak with kindness face-to-face. When classmates post creative works or academic achievements, let us encourage them with uplifting comments rather than sarcastic ridicule.

Secondly, students must become courageous upstanders rather than passive bystanders. If you witness a classmate being mocked or harassed in a group chat, refuse to like or forward the toxic message; report the behavior to school guidance counselors or platform administrators immediately.

The internet should be a sanctuary for inspiration, not a digital slaughterhouse; let us choose kindness with every tap of our screens.`
      },
      {
        questionNumber: "3",
        category: "Narrative Moral Story",
        prompt: "Write an engaging, realistic story that illustrates the traditional proverb: \"Actions speak louder than words.\"",
        modelAnswer: `ACTIONS SPEAK LOUDER THAN WORDS

During our final academic year in junior high school, our basic school faced an environmental crisis. The torrential rains had caused massive erosion along our school's frontage, creating deep, dangerous gullies that threatened to undermine the foundation of our junior classroom block. The headmaster convened an emergency assembly, appealing for student leadership to address the hazard.

Two candidates stood out. Richmond, our articulate class captain, was a master of eloquent rhetoric. He mounted the assembly podium, delivering an impassioned speech full of grandiose promises. He vowed that he would single-handedly organize municipal earth-movers, petition international donor agencies, and construct magnificent retaining walls, declaring proudly: "With my connections, I shall transform this compound into a modern paradise within one week!" The students cheered his flowery promises wildly.

Kwame, a quiet, humble boy from an indigent farming family, made no speeches. Instead, while Richmond spent his afternoon recreation hours boasting at the canteen, Kwame mobilized five disciplined classmates. Armed with pickaxes, wheelbarrows, and woven wicker baskets, Kwame led his small team to the riverbank every day after closing. They gathered heavy granite boulders, filled hundreds of discarded cocoa sacks with gravel, and carefully built a sturdy, terraced stone-and-earth revetment across the eroded slope. By Friday afternoon, Kwame and his team had stabilized the entire embankment and planted vetiver grass to halt further soil wash.

When the municipal engineers arrived the following Monday, they commended Kwame's practical engineering brilliance, awarding him a full secondary school technical scholarship, while Richmond's empty promises became the laughingstock of the school. Standing before the preserved school block, the ancient truth shone brightly: Truly, actions speak louder than words.`
      }
    ]
  },
  partB_comprehension: {
    title: "Part B: Reading Comprehension",
    instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
    passageText: `In the contemporary era of rapid industrialization and urban expansion, noise pollution has emerged as one of the most pervasive yet chronically overlooked environmental hazards affecting public health. Across thriving urban commercial centers and peri-urban settlements in West Africa, city residents are perpetually inundated by an acoustic barrage of blaring automobile horns, unregulated open-air religious loudspeakers, commercial advertising sound systems, and roaring diesel generators.

Traditional perceptions have long trivialized noise as merely a minor, temporary inconvenience of city life. However, modern physiological and epidemiological research demonstrates that chronic exposure to excessive acoustic levels represents a lethal public health threat. The human auditory system is biologically evolved to perceive sounds at moderate intensities; continuous exposure to sound levels exceeding eighty-five decibels causes irreversible damage to the delicate sensory hair cells in the cochlea, resulting in permanent sensorineural hearing loss and chronic tinnitus.

Beyond auditory impairment, excessive environmental noise inflicts devastating systemic physiological damage on the human body. When subjected to unpredictable, loud noise, the human brain automatically interprets the acoustic shock as an existential threat, triggering the nervous system to release high surges of stress hormones, notably adrenaline and cortisol. This chronic physiological arousal leads to arterial constriction, elevated heart rates, and chronic hypertension. Cardiologists have established a direct, alarming correlation between long-term residential noise exposure and the rising incidence of fatal myocardial infarctions and cerebrovascular strokes among urban populations.

Furthermore, noise pollution wreaks havoc on cognitive performance and psychological well-being. School children whose classrooms are situated near busy commercial transit corridors or loud industrial workshops suffer significant impairments in reading comprehension, memory retention, and speech perception. Chronically deprived of tranquil nocturnal rest by blaring religious all-night vigils, students experience daytime drowsiness, behavioral irritability, and severe academic underperformance.

Environmental epidemiologists conclude that curbing this insidious menace requires aggressive statutory regulation. Municipal authorities must enforce strict acoustic zoning bylaws, ban high-decibel commercial advertising speakers in residential corridors, and establish quiet zones around educational institutions and hospitals.`,
    questions: [
      {
        subQuestion: "(a)",
        question: "State two common sources of excessive noise in urban centers mentioned in the first paragraph.",
        answer: "Blaring automobile horns, unregulated open-air religious loudspeakers, commercial advertising sound systems, and roaring diesel generators."
      },
      {
        subQuestion: "(b)",
        question: "How does chronic exposure to excessive noise cause permanent damage to human hearing?",
        answer: "Continuous exposure to sound levels exceeding eighty-five decibels irreversibly damages the delicate sensory hair cells in the cochlea."
      },
      {
        subQuestion: "(c)",
        question: "Mention two cardiovascular or heart-related diseases linked to long-term noise pollution in the third paragraph.",
        answer: "Chronic hypertension, fatal myocardial infarctions (heart attacks), and cerebrovascular strokes."
      },
      {
        subQuestion: "(d)",
        question: "In what two ways does noise pollution impair the academic performance of school children?",
        answer: "1. It impairs reading comprehension, memory retention, and speech perception.\n2. It deprives children of restful sleep, causing daytime drowsiness and behavioral irritability."
      },
      {
        subQuestion: "(e)",
        question: "Explain the meaning of the following expressions as used in the passage:\nI. ... acoustic barrage;\nII. ... existential threat;\nIII. ... quiet zones.",
        answer: "I. 'acoustic barrage' means a continuous, overwhelming, and heavy onslaught of loud sounds.\nII. 'existential threat' means a grave danger that threatens human survival or life itself.\nIII. 'quiet zones' means designated geographical areas where noise levels are strictly regulated and kept low by law."
      },
      {
        subQuestion: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. pervasive;\nII. trivialized;\nIII. constriction;\nIV. statutory.",
        answer: "I. pervasive: widespread, ubiquitous, prevalent, rampant.\nII. trivialized: dismissed, minimized, downplayed, disregarded.\nIII. constriction: narrowing, tightening, squeezing, contracting.\nIV. statutory: legal, lawful, mandatory, regulatory."
      },
      {
        subQuestion: "(g)",
        question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the two major statutory measures needed to curb noise pollution.",
        answer: "1. Assemblies must enforce strict acoustic bylaws.\n2. Authorities must establish quiet educational zones."
      }
    ]
  },
  partC_literature: {
    title: "Part C: Literature in English (The Beacon of Light Anthology)",
    instructions: "Answer all questions in this part based on the prescribed selections from the NaCCA Common Core Programme anthology: The Beacon of Light.",
    questions: [
      {
        sectionTitle: "CHARLES DICKENS: Oliver Twist (Chapter 2: Oliver Asks for More)",
        contextExtract: "\"The board decided to make the workhouse uncomfortable, in order to discourage poor people from coming there. As a result, the boys were always hungry, and Oliver was driven to ask for more gruel.\"",
        subItems: [
          {
            subQuestion: "5(a)",
            question: "How does Dickens use satire in the board's decision to make the workhouse 'uncomfortable'?",
            answer: "He exposes the cold, calculated cruelty of the Victorian Poor Law authorities, who disguised deliberate starvation and mistreatment as a well-meaning policy to discourage reliance on parish relief."
          },
          {
            subQuestion: "5(b)",
            question: "What immediate action did the hunger-stricken boys take that led to Oliver walking up to the master?",
            answer: "Driven to desperation by starvation, the boys held a council and cast lots to decide who should approach the master after supper to ask for more food, and the lot fell upon Oliver."
          }
        ]
      },
      {
        sectionTitle: "CONTEMPORARY DRAMA: Spreading Light",
        contextExtract: "\"SIR NII: (Addressing the pupils gathered in the classroom square) Science is not a set of dead rules in a foreign book. It is the power to see the darkness in your village and light it with your own hands.\nASANTEWAA: (Looking at her circuit diagram) Then we will build this solar lamp, Sir Nii, even if others laugh at us.\"",
        subItems: [
          {
            subQuestion: "5(c)",
            question: "What is Sir Nii's pedagogical philosophy regarding science education in this scene?",
            answer: "He believes science should be practical, creative, and service-oriented—empowering rural pupils to apply knowledge directly to solve local challenges rather than merely memorizing abstract theory."
          },
          {
            subQuestion: "5(d)",
            question: "What character trait does Asantewaa demonstrate in her response to Sir Nii?",
            answer: "Determination, resilience, courage, and unwavering focus on her goal despite the threat of peer ridicule and skepticism."
          }
        ]
      },
      {
        sectionTitle: "HISTORICAL POETRY: The Golden Stool / Okomfo Anokye",
        contextExtract: "\"With whispered incantations, he calls\nA treasure from the celestial halls;\nThe Golden Stool descends through twilight's hush,\nA sacred bond no earthly sword can crush.\"",
        subItems: [
          {
            subQuestion: "5(e)",
            question: "What is the symbolic significance of Okomfo Anokye using 'whispered incantations' rather than loud commands?",
            answer: "It reflects serene spiritual composure, humility, and genuine divine authority, showing that sacred power operates through quiet spiritual communion rather than physical force or theatrical display."
          },
          {
            subQuestion: "5(f)",
            question: "How does the poem present the descent of the Golden Stool as a unifying spiritual event?",
            answer: "It portrays the Stool descending from the heavens as an ancestral covenant that united disparate, competing Akan clans into an invincible, unified Ashanti nation."
          }
        ]
      },
      {
        sectionTitle: "PHILOSOPHICAL POETRY: The Unseen Painter",
        contextExtract: "\"The very white canvas\nSuddenly turned darker;\nWith deliberate stroke and master hand,\nLight and shade divide the land.\"",
        subItems: [
          {
            subQuestion: "5(g)",
            question: "What does the transition from white canvas to dark background represent in the poem?",
            answer: "It represents the emergence of balanced cosmic order out of bare void, establishing the contrast of night and day necessary for life to flourish."
          },
          {
            subQuestion: "5(h)",
            question: "How does the poet use the metaphor of painting to explain the creation of the universe?",
            answer: "The universe is depicted as an intentional artistic masterpiece where stars, planets, landscapes, and diverse human beings are deliberate brushstrokes crafted by the divine Painter."
          }
        ]
      },
      {
        sectionTitle: "PROSE NARRATIVE: Beyond Light and Shadow",
        contextExtract: "\"Mrs. Acquah stood firmly by the assembly hall doorway. Beside her stood her biological daughter, Tina Bells, in the school uniform. Looking across the compound, she declared: 'A shepherd does not abandon her flock to wolves; we face this together.'\"",
        subItems: [
          {
            subQuestion: "5(i)",
            question: "Explain the biblical allusion in Mrs. Acquah's statement: 'A shepherd does not abandon her flock to wolves'.",
            answer: "She alludes to the biblical archetype of the Good Shepherd, emphasizing her protective duty, moral courage, and willingness to share risks to defend her students from the predatory Ashes Flame cabal."
          },
          {
            subQuestion: "5(j)",
            question: "Why was Mrs. Acquah's decision to enroll her own daughter, Tina Bells, essential to reforming Cedar of Lebanon School?",
            answer: "It demonstrated leadership by personal example and sacrifice, proving to skeptical parents that she had complete faith in the school's revival and inspiring the community to break their silence."
          }
        ]
      }
    ]
  }
};

async function seedBeceEnglishMock11() {
  console.log("Seeding Isolated BECE English Mock 11 into Firestore with Beacon of Light curriculum...");

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

  // Strictly partitioned path: subjects/english/mocks/mock_11
  const docRef = db.doc("global_curriculum/jhs/subjects/english/mocks/mock_11");
  await docRef.set({
    mockId: "mock_11",
    mockNumber: 11,
    title: "BECE English Language National Mock Examination 11",
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
          title: "Section E: Telecommunications and Network Engineering Cloze Passage",
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

  console.log("✅ BECE English Mock 11 successfully updated with Beacon of Light at subjects/english/mocks/mock_11!");
}

seedBeceEnglishMock11()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed BECE English Mock 11:", err);
    process.exit(1);
  });
