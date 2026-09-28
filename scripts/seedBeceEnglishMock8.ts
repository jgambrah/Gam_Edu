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
// 40 OBJECTIVE QUESTIONS: LEXIS, STRUCTURE, ENERGY CLOZE & ORAL PHONOLOGY
// =========================================================================
const allRawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "The senior prefect ............ the leadership retreat, but he fell severely ill on the morning of departure.",
    options: [
      "ought to attend",
      "ought to have attended",
      "must attend",
      "should attend"
    ],
    correctAnswer: "ought to have attended",
    hint: "Past unfulfilled moral obligation: 'ought to have + past participle' expresses an action that was desirable in the past but did not occur.",
    workedSolution: "An action that was an obligation in the past but failed to take place requires the past modal perfect: 'ought to have attended'.",
    points: 1
  },
  {
    number: 2,
    prompt: "Tired ............ the athletes were, they completed the grueling marathon under the scorching sun.",
    options: ["although", "as", "even", "though"],
    correctAnswer: "as",
    hint: "Fronted concessive adjective structure: 'Adjective + as + subject + verb' introduces a concessive clause.",
    workedSolution: "When an adjective is placed at the beginning of a clause to express concession, 'as' is standard: 'Tired as the athletes were...'.",
    points: 1
  },
  {
    number: 3,
    prompt: "It was exactly noon ............ the school assembly bell chimed for closing.",
    options: ["where", "when", "which", "that"],
    correctAnswer: "when",
    hint: "Relative adverb modifying a specific temporal antecedent ('noon').",
    workedSolution: "When the antecedent is a specific time or hour ('noon'), the relative adverb of time 'when' is required: 'noon when the school assembly bell chimed'.",
    points: 1
  },
  {
    number: 4,
    prompt: "A sudden deafening ............ of thunder rattled the wooden window frames across the dormitory.",
    options: ["clap", "strike", "blast", "sheet"],
    correctAnswer: "clap",
    hint: "Identify the standard partitive noun that collocates idiomatically with thunder.",
    workedSolution: "In standard English idiomatic collocations, a loud, sharp explosive sound of thunder is partitively measured as a 'clap of thunder'.",
    points: 1
  },
  {
    number: 5,
    prompt: "The regional convention will be attended by all the three ............ delegates.",
    options: [
      "attorney-generals'",
      "attorneys-general's",
      "attorney's-generals",
      "attorneys'-generals"
    ],
    correctAnswer: "attorneys-general's",
    hint: "Compound noun plural possessive: Form the plural of the base noun ('attorneys-general') and add apostrophe + 's' to the final element.",
    workedSolution: "The plural form of 'attorney-general' is 'attorneys-general'. Its possessive form is constructed by appending apostrophe + 's' to the end: 'attorneys-general's delegates'.",
    points: 1
  },
  {
    number: 6,
    prompt: "The junior clerk dare not ............ the auditor's official queries without permission.",
    options: ["answer", "answered", "answering", "to answer"],
    correctAnswer: "answer",
    hint: "When 'dare' functions as a modal auxiliary in the negative with 'not', it takes a bare infinitive without 'to'.",
    workedSolution: "In negative semi-modal constructions ('dare not'), the verb takes a bare infinitive without 'to': 'dare not answer'.",
    points: 1
  },
  {
    number: 7,
    prompt: "In terms of administrative ranking, Mr. Mensah is senior ............ all other officers in the department.",
    options: ["than", "to", "from", "above"],
    correctAnswer: "to",
    hint: "Comparative adjectives of Latin origin (senior, junior, superior, inferior) strictly take 'to', never 'than'.",
    workedSolution: "Latin comparative adjectives like 'senior' strictly collocate with the preposition 'to': 'senior to all other officers'.",
    points: 1
  },
  {
    number: 8,
    prompt: "Neither the headmaster nor the bursar ............ available in the administrative block yesterday.",
    options: ["were", "are", "was", "is"],
    correctAnswer: "was",
    hint: "Proximity concord with 'neither... nor': In the past tense, the verb agrees in number with the nearer singular subject ('the bursar').",
    workedSolution: "When subjects are linked by 'neither... nor', the verb agrees in number with the closer subject ('the bursar', singular). Governed by past time ('yesterday'), the correct verb is 'was'.",
    points: 1
  },
  {
    number: 9,
    prompt: "Before driving to Tamale, the logistics director had his vehicle ............ by an auto technician.",
    options: ["service", "serviced", "servicing", "to service"],
    correctAnswer: "serviced",
    hint: "Passive causative structure: have + object + past participle (indicating an action performed by someone else).",
    workedSolution: "In passive causative constructions expressing an action performed by another party ('had + object'), the past participle is required: 'had his vehicle serviced'.",
    points: 1
  },
  {
    number: 10,
    prompt: "Due to the sudden rainstorm, the electoral commission postponed ............ the student union elections.",
    options: ["hold", "to hold", "holding", "held"],
    correctAnswer: "holding",
    hint: "The catenative verb 'postpone' takes a gerund complement (verb-ing).",
    workedSolution: "In standard English syntax, the verb 'postpone' requires a gerund complement: 'postponed holding the elections'.",
    points: 1
  },
  {
    number: 11,
    prompt: "Scarcely ............ the platform when the locomotive sounded its departure horn.",
    options: [
      "the train had reached",
      "had the train reached",
      "the train reached",
      "did the train reached"
    ],
    correctAnswer: "had the train reached",
    hint: "Fronted negative temporal adverbial ('Scarcely') triggers subject-auxiliary inversion in the past perfect.",
    workedSolution: "When a restrictive temporal adverbial ('Scarcely') begins a sentence, standard English requires subject-auxiliary inversion: 'had the train reached'.",
    points: 1
  },
  {
    number: 12,
    prompt: "The new sports master is a close maternal cousin of ............",
    options: ["their", "theirs", "them", "themselves"],
    correctAnswer: "theirs",
    hint: "Double possessive construction: 'a [noun] of' requires an absolute possessive pronoun.",
    workedSolution: "The double possessive structure ('a cousin of...') requires the independent possessive pronoun 'theirs': 'a maternal cousin of theirs'.",
    points: 1
  },
  {
    number: 13,
    prompt: "He rarely participates in communal volunteer activities, ............ he?",
    options: ["doesn't", "does", "is", "isn't"],
    correctAnswer: "does",
    hint: "The broad negative adverb 'rarely' gives the main clause negative polarity, requiring an affirmative present question tag.",
    workedSolution: "The adverb 'rarely' makes the statement semantically negative. With simple present lexical verb 'participates', the matching tag must be affirmative: 'does he?'.",
    points: 1
  },
  {
    number: 14,
    prompt: "The palace elders gathered around a ............ table during the royal council sitting.",
    options: [
      "splendid antique mahogany",
      "antique splendid mahogany",
      "mahogany splendid antique",
      "splendid mahogany antique"
    ],
    correctAnswer: "splendid antique mahogany",
    hint: "Cumulative adjective ordering: Opinion/Evaluation ('splendid') precedes Age ('antique') which precedes Material ('mahogany') before the head noun.",
    workedSolution: "Standard English cumulative adjective ordering places subjective evaluation ('splendid') before age ('antique') followed by material origin ('mahogany'): 'splendid antique mahogany table'.",
    points: 1
  },
  {
    number: 15,
    prompt: "The corrupt procurement official was formally indicted ............ multiple counts of financial embezzlement.",
    options: ["with", "for", "of", "against"],
    correctAnswer: "for",
    hint: "Identify the dependent preposition that regularly collocates with the legal passive verb 'indicted' when naming the charges.",
    workedSolution: "In standard legal collocations, an accused individual is 'indicted for' an offense: 'indicted for multiple counts of embezzlement'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The forensic investigator was remarkably scrupulous in verifying every financial transaction.\nChoose the word nearest in meaning to 'scrupulous'.",
    options: ["meticulous", "quick", "generous", "hesitant"],
    correctAnswer: "meticulous",
    hint: "Diligent, thorough, and extremely attentive to details; scrupulously careful.",
    workedSolution: "'Scrupulous' means showing great care, thoroughness, and attention to detail; 'meticulous' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "The belligerent youth provoked a violent brawl outside the sports stadium.\nChoose the word nearest in meaning to 'belligerent'.",
    options: ["cowardly", "aggressive", "proud", "impatient"],
    correctAnswer: "aggressive",
    hint: "Hostile and aggressive; warlike or eager to fight.",
    workedSolution: "'Belligerent' means hostile, pugnacious, and ready to fight; 'aggressive' is its direct synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "The lakeside botanical garden was admired for its tranquil atmosphere.\nChoose the word nearest in meaning to 'tranquil'.",
    options: ["serene", "fertile", "spacious", "bright"],
    correctAnswer: "serene",
    hint: "Free from disturbance; calm, quiet, and peaceful.",
    workedSolution: "'Tranquil' means peaceful, quiet, and undisturbed; 'serene' is its direct synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "The slothful apprentice neglected his morning workshop assignments.\nChoose the word nearest in meaning to 'slothful'.",
    options: ["careless", "indolent", "clumsy", "foolish"],
    correctAnswer: "indolent",
    hint: "Lazy, sluggish, and habitually disinclined to work.",
    workedSolution: "'Slothful' means habitually idle and inactive; 'indolent' (or lazy) is its exact synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "The science master delivered an intelligible lecture on nuclear fission.\nChoose the word nearest in meaning to 'intelligible'.",
    options: ["lucid", "lengthy", "complex", "formal"],
    correctAnswer: "lucid",
    hint: "Able to be understood; clear and transparent to the intellect.",
    workedSolution: "'Intelligible' means capable of being easily understood or clear; 'lucid' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "Throughout the revision week, Kwabena was burning the candle at both ends. This means that Kwabena was ............",
    options: [
      "wasting study candles carelessly",
      "working exhaustingly from early dawn until late night",
      "suffering from severe visual impairment",
      "disturbing his roommates at night"
    ],
    correctAnswer: "working exhaustingly from early dawn until late night",
    hint: "To exhaust oneself by doing too much, waking up early and staying up late to work.",
    workedSolution: "The idiom 'to burn the candle at both ends' means to overwork oneself exhaustingly from early morning until late at night.",
    points: 1
  },
  {
    number: 22,
    prompt: "We cautioned Kofi not to spill the beans regarding the secret anniversary gift. This means we warned Kofi not to ............",
    options: [
      "waste the celebratory food",
      "disclose confidential information prematurely",
      "damage the anniversary wrapping",
      "arrive late to the reception"
    ],
    correctAnswer: "disclose confidential information prematurely",
    hint: "To disclose a secret prematurely or indiscreetly.",
    workedSolution: "The idiom 'to spill the beans' means to reveal secret or confidential information prematurely.",
    points: 1
  },
  {
    number: 23,
    prompt: "The obstinate boy turned a deaf ear to his mother's advice. This means the boy ............",
    options: [
      "developed an ear defect",
      "deliberately refused to listen to or heed the counsel",
      "pretended to be fast asleep",
      "asked his mother to repeat her words"
    ],
    correctAnswer: "deliberately refused to listen to or heed the counsel",
    hint: "To refuse to listen to or ignore advice or a warning.",
    workedSolution: "The idiom 'to turn a deaf ear' means to deliberately refuse to listen to, heed, or acknowledge what someone says.",
    points: 1
  },
  {
    number: 24,
    prompt: "The corrupt municipal treasurer utilized public market funds to feather his own nest. This means the treasurer ............",
    options: [
      "renovated his poultry pens",
      "enriched himself dishonestly using public funds",
      "distributed loans to market women",
      "built a luxury rest house for travelers"
    ],
    correctAnswer: "enriched himself dishonestly using public funds",
    hint: "To make oneself wealthy, especially by taking dishonest advantage of one's position.",
    workedSolution: "The idiom 'to feather one's nest' means to enrich oneself dishonestly or accumulate illicit wealth while in a position of public trust.",
    points: 1
  },
  {
    number: 25,
    prompt: "Having broken school regulations repeatedly, the truant had to face the music. This means the truant had to ............",
    options: [
      "sing before the morning assembly",
      "accept the unpleasant consequences of his actions",
      "participate in the school band",
      "listen to the headmaster's radio"
    ],
    correctAnswer: "accept the unpleasant consequences of his actions",
    hint: "To accept the unpleasant results or punishment for one's actions.",
    workedSolution: "The idiom 'to face the music' means to confront reality and accept the unpleasant consequences or punishment for what one has done.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "While popular trends on social media are ephemeral, core moral values are ...... .\nChoose the word most nearly opposite in meaning to 'ephemeral'.",
    options: ["brief", "permanent", "popular", "modest"],
    correctAnswer: "permanent",
    hint: "'Ephemeral' means lasting for a very short time; fleeting. What word denotes lasting or intended to last indefinitely?",
    workedSolution: "'Ephemeral' means short-lived or fleeting. Its direct temporal antonym is 'permanent' (lasting indefinitely).",
    points: 1
  },
  {
    number: 27,
    prompt: "The main entrance was conspicuous, but the emergency escape route was remarkably ...... .\nChoose the word most nearly opposite in meaning to 'conspicuous'.",
    options: ["inconspicuous", "shabby", "narrow", "distant"],
    correctAnswer: "inconspicuous",
    hint: "'Conspicuous' means clearly visible; attracting attention. What word denotes not clearly visible or attracting attention?",
    workedSolution: "'Conspicuous' means easily seen or noticeable. Its direct antonym formed by prefixation is 'inconspicuous' (unobtrusive).",
    points: 1
  },
  {
    number: 28,
    prompt: "The previous administration was lenient with defaulters, whereas the new council enforces ...... sanctions.\nChoose the word most nearly opposite in meaning to 'lenient'.",
    options: ["draconian", "mild", "friendly", "simple"],
    correctAnswer: "draconian",
    hint: "'Lenient' means mild, merciful, and tolerant in punishment. What word denotes excessively harsh, severe, and rigorous?",
    workedSolution: "'Lenient' means mild and merciful. Its direct disciplinary antonym is 'draconian' (excessively harsh and severe).",
    points: 1
  },
  {
    number: 29,
    prompt: "The affluent landlord owned estates in three cities, whereas his tenants were completely ...... .\nChoose the word most nearly opposite in meaning to 'affluent'.",
    options: ["destitute", "humble", "modest", "fearful"],
    correctAnswer: "destitute",
    hint: "'Affluent' means wealthy and having great wealth. What word denotes without the basic necessities of life; extremely poor?",
    workedSolution: "'Affluent' means wealthy. Its direct socio-economic antonym is 'destitute' (extremely impoverished).",
    points: 1
  },
  {
    number: 30,
    prompt: "The turbulent rapids gave way to a ...... pool of fresh water.\nChoose the word most nearly opposite in meaning to 'turbulent'.",
    options: ["shallow", "peaceful", "narrow", "swift"],
    correctAnswer: "peaceful",
    hint: "'Turbulent' means characterized by conflict, disorder, or violent agitation. What word denotes calm, untroubled, and tranquil?",
    workedSolution: "'Turbulent' means violently agitated or stormy. Its direct antonym describing water is 'peaceful' (calm or tranquil).",
    points: 1
  },

  // --- SECTION E: CLOZE PASSAGE (RENEWABLE ENERGY REGISTER) (31 - 35) ---
  {
    number: 31,
    prompt: "Cloze Passage: \"The offshore wind energy station utilizes massive wind ---31--- with rotating blades to convert kinetic energy into electricity.\"\nChoose the most suitable word:",
    options: ["engines", "turbines", "pumps", "motors"],
    correctAnswer: "turbines",
    hint: "A machine for producing continuous power in which a wheel or rotor revolves by a fast-moving flow of water, steam, gas, or air is a turbine.",
    workedSolution: "In renewable energy generation, wind-driven rotors that drive electrical generators are formally designated as 'turbines'.",
    points: 1
  },
  {
    number: 32,
    prompt: "Cloze Passage: \"The power generated from the solar and wind plants is transmitted into the national electrical ---32--- for distribution.\"\nChoose the most suitable word:",
    options: ["network", "grid", "channel", "circuit"],
    correctAnswer: "grid",
    hint: "An interconnected network for delivering electricity from producers to consumers is the national power grid.",
    workedSolution: "In electrical engineering and public utilities, the national electricity distribution infrastructure is standardly termed the 'grid'.",
    points: 1
  },
  {
    number: 33,
    prompt: "Cloze Passage: \"Because solar panels generate direct current (DC), an electronic ---33--- is required to convert it into alternating current (AC).\"\nChoose the most suitable word:",
    options: ["inverter", "transformer", "resistor", "switch"],
    correctAnswer: "inverter",
    hint: "An electronic device or circuitry that changes direct current (DC) to alternating current (AC) is an inverter.",
    workedSolution: "In solar energy systems, the apparatus that converts DC electrical power into AC electrical power is an 'inverter'.",
    points: 1
  },
  {
    number: 34,
    prompt: "Cloze Passage: \"The rooftop solar arrays are constructed using advanced ---34--- cells that absorb solar radiation directly.\"\nChoose the most suitable word:",
    options: ["thermal", "photovoltaic", "chemical", "magnetic"],
    correctAnswer: "photovoltaic",
    hint: "Relating to the production of electric current at the junction of two substances exposed to light: photovoltaic cells.",
    workedSolution: "In solar technology, semiconductor cells that convert light directly into electrical energy are 'photovoltaic' cells.",
    points: 1
  },
  {
    number: 35,
    prompt: "Cloze Passage: \"During cloudy seasons, a high-capacity diesel ---35--- serves as an emergency standby power source.\"\nChoose the most suitable word:",
    options: ["battery", "generator", "dynamo", "alternator"],
    correctAnswer: "generator",
    hint: "A machine that converts mechanical energy into electrical energy, often driven by a combustion engine, is a generator.",
    workedSolution: "In power systems, an auxiliary engine-driven machine generating emergency electricity is standardly termed a 'generator'.",
    points: 1
  },

  // --- PART B: ORAL LANGUAGE & PHONOLOGY (36 - 40) ---
  {
    number: 36,
    prompt: "Choose the word that contains the identical voiced post-alveolar affricate consonant sound as the underlined sound in:\n\"The travelers reached a peaceful **vi<u>ll</u>age**.\"",
    options: ["soldier", "pleasure", "vision", "garage"],
    correctAnswer: "soldier",
    hint: "The ending of 'village' produces the voiced affricate consonant /dʒ/. 'Soldier' (/ˈsəʊl.dʒər/) contains the exact identical /dʒ/ sound.",
    workedSolution: "The word 'village' ends with the voiced affricate /dʒ/ (/ˈvɪl.ɪdʒ/). 'Soldier' contains the identical /dʒ/ consonant sound, whereas the others contain fricative /ʒ/.",
    points: 1
  },
  {
    number: 37,
    prompt: "Choose the word that contains the identical long back vowel sound as the underlined vowel in:\n\"The ancient pharaoh was laid in a stone **t<u>o</u>mb**.\"",
    options: ["fool", "book", "foot", "hook"],
    correctAnswer: "fool",
    hint: "'Tomb' is pronounced /tuːm/ with the long vowel /uː/. 'Fool' (/fuːl/) contains the identical long /uː/ sound.",
    workedSolution: "'Tomb' contains the long monophthong /uː/. 'Fool' shares the exact identical /uː/ sound, whereas 'book', 'foot', and 'hook' contain the short /ʊ/.",
    points: 1
  },
  {
    number: 38,
    prompt: "Choose the word that shares the identical final consonant cluster sound as:\n\"The literature master scrutinized the prescribed **te<u>xts</u>**.\"",
    options: ["tests", "desks", "masks", "next"],
    correctAnswer: "desks",
    hint: "'Texts' ends in the complex voiceless cluster /ksts/ (or /kts/). 'Desks' (/desks/) shares the voiceless plosive-fricative cluster ending.",
    workedSolution: "'Texts' terminates in the consonant cluster /ksts/. Among the options, 'desks' (/desks/) shares the plosive-fricative cluster.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which of the following words contains a SILENT consonant letter that is not voiced in standard pronunciation?",
    options: ["sword", "sweet", "swift", "sweep"],
    correctAnswer: "sword",
    hint: "In this weapon consisting of a long metal blade, the letter 'w' is completely silent.",
    workedSolution: "In 'sword' (pronounced /sɔːd/), the consonant letter 'w' is completely silent.",
    points: 1
  },
  {
    number: 40,
    prompt: "When a question tag expecting confirmation or agreement (such as \"It's a hot afternoon, isn't it?\") is spoken in standard English, what intonation contour is normally used on the tag?",
    options: [
      "Rising intonation",
      "Falling intonation",
      "Rise-fall intonation",
      "Level intonation"
    ],
    correctAnswer: "Falling intonation",
    hint: "Question tags that expect agreement or confirmation (where the speaker is not really asking a question) terminate with a falling pitch contour (↘).",
    workedSolution: "In English suprasegmental phonology, question tags expecting confirmation or agreement conclude with a falling intonation contour (↘). (A rising tag is used when the speaker is genuinely unsure).",
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

const assignedTargetIndices = seedShuffle(targetKeys, 202608);

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
        prompt: "Write a formal letter to your District Director of Agriculture, drawing attention to the menace of fall armyworms destroying grain crops across farming communities in your district, and suggesting at least two practical interventions the directorate can implement to support affected smallholder farmers.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2026

The District Director of Agriculture
Ministry of Food and Agriculture
Bekwai Municipal Directorate, Bekwai

Dear Sir,

PETITION REGARDING FALL ARMYWORM INFESTATION AND PROPOSED AGRICULTURAL INTERVENTIONS

On behalf of the youth, agrarian households, and smallholder farmers of the Bekwai Municipality, I respectfully submit this petition to draw your urgent attention to the devastating invasion of fall armyworms across our maize and cereal farms, and to propose practical interventions to avert widespread food insecurity.

Over the past three weeks, swarms of voracious fall armyworm caterpillars have invaded several farming enclaves within our district, including Asanso, Poano, and Kokotro. The destructive pests burrow into the tender growing whorls of young maize plants, consuming foliage and leaving behind ragged, skeletonized stalks. In several communities, over sixty percent of cultivated acreage has been decimated within days. Because peasant farmers lack certified pesticides and spraying equipment, many watch helplessly as their primary livelihood and life savings are destroyed. If left unchecked, this infestation will trigger acute local famine and soaring grain prices.

To combat this agricultural crisis, I suggest, first, that the District Directorate of Agriculture immediately deploy Agricultural Extension Plant Protection Teams to affected farming clusters. These teams should distribute subsidized, certified bio-rational pesticides alongside motorized knapsack sprayers directly to registered farmer cooperatives to eradicate the pests before they pupate.

Secondly, the directorate should conduct emergency field sensitization clinics to educate farmers on early biological control methods. Teaching smallholders how to intercrop maize with repellent desmodium legumes and handpick egg masses will provide sustainable, eco-friendly protection against recurring pest cycles.

We count on your prompt leadership to safeguard our district's food security.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Youth Representative)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in a national daily newspaper on the topic: \"The Menace of Road Accidents in Ghana and Practical Measures to Ensure Highway Safety.\"",
        modelAnswer: `ARRESTING THE CARNAGE: URGENT PATHWAYS TO HIGHWAY SAFETY IN GHANA
By Samuel K. Boateng, Begoro

The asphalt highways connecting Ghana's major cities and regional economic hubs should serve as vital lifelines for commerce, national integration, and social connectivity. Regrettably, our roads have transformed into perilous slaughterhouses, where fatal vehicular collisions claim thousands of precious human lives annually. This perennial carnage leaves shattered families, orphaned children, and massive economic losses in its wake, demanding decisive national intervention.

The foremost catalyst of highway fatalities is human error, characterized by reckless speeding, drunk driving, and dangerous overtaking on blind curves. Many commercial minibus (trotro) and heavy haulage truck drivers operate under severe physical exhaustion, consuming illicit alcoholic bitters and stimulants to stay awake during nocturnal journeys. This reckless indiscipline impairs sensory reflexes, turning passenger vehicles into lethal weapons. Furthermore, the total absence of highway streetlights and reflective road signs along major corridors plunges drivers into pitch darkness, making stationary, broken-down vehicles invisible until collision occurs.

Secondly, the proliferation of unroadworthy vehicles severely compromises vehicular safety. Thousands of commercial vehicles ply national routes with bald tires, defective hydraulic brakes, and cracked windshields, having procured fraudulent roadworthiness certificates from corrupt inspection agents.

To end this carnage, the National Road Safety Authority (NRSA) and the Motor Traffic and Transport Department (MTTD) must install computerized speed-monitoring cameras along accident-prone corridors, revoking the licenses of reckless speedsters. Secondly, the government must enforce mandatory towing policies to clear disabled vehicles from highways within one hour of breakdown.

Highway safety is a collective civic responsibility; our nation must act decisively to preserve human life.`
      },
      {
        questionNumber: "3",
        category: "Narrative Moral Story",
        prompt: "Write an engaging, realistic story that illustrates the traditional proverb: \"Look before you leap.\"",
        modelAnswer: `LOOK BEFORE YOU LEAP

During our final term in junior high school, my close friend, Kweku, was notoriously impulsive, impatient, and prone to making hasty decisions without reflecting on their potential consequences. Our wise class tutor, Master Asiedu, continually cautioned him that "it is better to look before you leap," because rash actions often bring irreversible regret. Kweku, however, viewed deliberation as a sign of cowardice.

His impulsiveness reached a dangerous climax during our mid-term sports break. A slick, charismatic stranger named Derrick arrived in our village, claiming to represent an international talent recruitment agency that scouted young footballers for European academies. Derrick announced that he had two slots remaining for an upcoming training tour in Spain, demanding an immediate non-refundable registration fee of one thousand cedis from interested applicants within twenty-four hours.

Dazzled by the glamorous prospect of European football stardom, Kweku resolved to seize the offer immediately. Without verifying Derrick's credentials or consulting his parents, Kweku broke open his mother's trade savings box, stole the required sum, and handed it to Derrick behind the community center, mocking those of us who advised him to exercise caution. He packed his sports bag, boasting that he would soon sign multi-million-dollar contracts.

The illusion shattered the following morning. Arriving at the municipal transit terminal, Kweku found ten other stranded youths weeping in distress. Derrick was a notorious con artist who had switched off his mobile phone and vanished with their money. Overwhelmed by shame and terror, Kweku collapsed in tears as his mother discovered the theft and collapsed from hypertension.

Working under the scorching sun for three months weeding farms to repay the stolen money, Kweku learned a bitter, permanent life lesson: Truly, one must look before you leap.`
      }
    ]
  },
  partB_comprehension: {
    title: "Part B: Reading Comprehension",
    instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
    passageText: `In the modern technological landscape, electronic waste, popularly termed e-waste, has emerged as one of the fastest-growing and most hazardous environmental crises globally. Driven by the rapid obsolescence of digital devices and consumer demand for the latest smartphones, computers, and televisions, humanity generates over fifty million metric tons of discarded electronics annually. Rather than being safely recycled within developed nations of origin, vast shipments of obsolete equipment are exported to developing countries under the dubious pretext of "reusable second-hand donations."

The epicenter of this global electronic dumping ground is found in commercial scrap hubs across West Africa, most notoriously in urban enclaves like Agbogbloshie in Accra. Here, thousands of impoverished youth and adolescent migrants from rural areas labor under perilous conditions to recover precious metals—such as copper, gold, and aluminum—from discarded computer motherboards and electrical cables.

Because these informal scrap workers lack modern dismantling technology and protective gear, they resort to rudimentary, lethal techniques. Workers burn bundles of insulated electrical cables over open fires stoked with discarded automobile tires to melt away the plastic coating and retrieve the bare copper wires inside. This uncontrolled open-air combustion discharges thick plumes of black, acrid smoke laden with lethal toxins, including heavy metals like lead, cadmium, and mercury, as well as highly carcinogenic dioxins.

The public health consequences are horrific. Inhaling these toxic fumes causes chronic respiratory disorders, severe skin lesions, neurological damage, and premature death among young workers. Furthermore, heavy rainstorms wash the toxic residue into adjacent river catchments, contaminating municipal lagoons and exterminating aquatic fauna. Toxic lead and mercury seep into the groundwater table, entering the food chain through vegetables cultivated along urban fringes.

Environmental epidemiologists emphasize that solving the e-waste crisis requires global legislative accountability. Developed nations must enforce strict bans against exporting hazardous electronic scrap, while host governments must establish mechanized, state-of-the-art recycling facilities that protect workers' health and extract precious metals safely.`,
    questions: [
      {
        subQuestion: "(a)",
        question: "State two underlying factors driving the rapid increase in electronic waste globally according to the first paragraph.",
        answer: "1. The rapid obsolescence of digital devices.\n2. Consumer demand for the latest electronics (or shipments of obsolete equipment exported under the pretext of second-hand donations)."
      },
      {
        subQuestion: "(b)",
        question: "Why do informal scrap workers burn electrical cables over open fires?",
        answer: "To melt away the protective plastic coating in order to retrieve the valuable bare copper wires inside."
      },
      {
        subQuestion: "(c)",
        question: "Mention two lethal toxic substances released into the atmosphere during the open combustion of e-waste.",
        answer: "Lead, cadmium, mercury, or carcinogenic dioxins."
      },
      {
        subQuestion: "(d)",
        question: "How do toxic heavy metals from e-waste enter the human food chain according to the fourth paragraph?",
        answer: "Rainstorms wash toxic residue into groundwater and lagoons, which seeps into water sources and contaminates fish and vegetables cultivated along urban fringes that humans consume."
      },
      {
        subQuestion: "(e)",
        question: "Explain the meaning of the following expressions as used in the passage:\nI. ... dubious pretext;\nII. ... scratching the surface;\nIII. ... premature death.",
        answer: "I. 'dubious pretext' means a dishonest, false, or questionable excuse used to conceal the true motive.\nII. 'perilous conditions' means highly dangerous, hazardous, and life-threatening working environments.\nIII. 'premature death' means dying too soon or before reaching the expected normal life span."
      },
      {
        subQuestion: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. hazardous;\nII. obsolete;\nIII. rudimentary;\nIV. residue.",
        answer: "I. hazardous: dangerous, perilous, risky, harmful.\nII. obsolete: outdated, disused, superseded, archaic.\nIII. rudimentary: primitive, basic, crude, unsophisticated.\nIV. residue: remains, waste, sediment, remnants."
      },
      {
        subQuestion: "(g)",
        question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the two major interventions needed to solve the e-waste menace.",
        answer: "1. Developed countries must ban exporting electronic scrap.\n2. Governments must build mechanized recycling facilities."
      }
    ]
  },
  partC_literature: {
    title: "Part C: Literature in English (The Beacon of Light Anthology)",
    instructions: "Answer all questions in this part based on the prescribed selections from the NaCCA Common Core Programme anthology: The Beacon of Light.",
    questions: [
      {
        sectionTitle: "CHARLES DICKENS: Oliver Twist (Chapter 2: Oliver Asks for More)",
        contextExtract: "\"Oliver was pale, thin, not tall, and definitely not fat. He stood before the gentlemen of the board, trembling in his worn clothes. Across from him sat Mr. Limbkins in the high chair, his very round, red face glowing with comfortable health, flanked by the gentleman in the white waistcoat.\"",
        subItems: [
          {
            subQuestion: "5(a)",
            question: "How does Dickens use visual contrast to expose the inequality between Oliver and the workhouse board members?",
            answer: "He contrasts Oliver's pale, thin, and emaciated physical frame with the board members' comfortable obesity, round red faces, and luxurious white waistcoats, visually highlighting the cruelty of well-fed officials starving pauper children."
          },
          {
            subQuestion: "5(b)",
            question: "What does the elevated 'high chair' occupied by Mr. Limbkins symbolize in the courtroom-like setting?",
            answer: "It symbolizes unbending institutional hierarchy, detached authoritarian power, and the systemic oppression exercised over helpless orphans."
          }
        ]
      },
      {
        sectionTitle: "CONTEMPORARY DRAMA: Spreading Light",
        contextExtract: "\"ASANTEWAA: (Adjusting the copper contacts on the solar panel) Some people believe our place is only in the kitchen peeling cassava, Iddrisu. But when the night falls, everyone needs light, no matter who wired the system.\nIDDRISU: And no one in this village can deny whose hands brought this light to life.\"",
        subItems: [
          {
            subQuestion: "5(c)",
            question: "What traditional gender expectation does Asantewaa critique in this dialogue?",
            answer: "She critiques the patriarchal stereotype that confines women and young girls exclusively to domestic chores like cooking, rather than technical STEM innovation and intellectual leadership."
          },
          {
            subQuestion: "5(d)",
            question: "What is Iddrisu's attitude toward Asantewaa's technical achievement in this scene?",
            answer: "Respectful, supportive, admiring, and affirming of her competence as an equal collaborator and innovator."
          }
        ]
      },
      {
        sectionTitle: "HISTORICAL POETRY: The Golden Stool / Okomfo Anokye",
        contextExtract: "\"Cast in untarnished gold, the sacred throne descended,\nA covenant of unity where ancestral spirits blended;\nNo earthly rust can touch its sovereign frame,\nNo passing season dim its holy flame.\"",
        subItems: [
          {
            subQuestion: "5(e)",
            question: "What does the incorruptible nature of 'untarnished gold' symbolize in the poem?",
            answer: "It symbolizes the purity, eternal sovereignty, and spiritual permanence of the Ashanti nation, asserting that its collective soul (Sunsum) cannot decay or be destroyed by time."
          },
          {
            subQuestion: "5(f)",
            question: "Identify the rhyme scheme in these four lines and comment on its poetic effect.",
            answer: "AABB (descended/blended, frame/flame). The paired rhyming couplets create a dignified, memorable musicality fitting for an epic tribute to ancestral heritage."
          }
        ]
      },
      {
        sectionTitle: "PHILOSOPHICAL POETRY: The Unseen Painter",
        contextExtract: "\"The Artist remains unseen behind the veil,\nYet nowhere does His living glory fail;\nIn every leaf, in every creature's breath,\nHis brushstrokes conquer emptiness and death.\"",
        subItems: [
          {
            subQuestion: "5(g)",
            question: "Explain the central paradox in the expression: 'The Artist remains unseen... Yet nowhere does His living glory fail'.",
            answer: "The paradox lies in the Creator being physically invisible to the human eye, yet His existence, power, and benevolence are clearly visible through the beauty and order of the physical world."
          },
          {
            subQuestion: "5(h)",
            question: "Identify the figure of speech in 'His brushstrokes conquer emptiness and death' and state its meaning.",
            answer: "Metaphor. It portrays the act of divine creation as artistic brushstrokes that bring purposeful life, order, and meaning to what was once barren void."
          }
        ]
      },
      {
        sectionTitle: "PROSE NARRATIVE: Beyond Light and Shadow",
        contextExtract: "\"Benson’s battered body, stained with the crimson hue of betrayal, lay motionless on the ground. Ashes Flame had exacted its vengeance for his defection, yet as Mrs. Acquah and Tina knelt beside him, a faint smile crossed his bruised lips. He was broken in body, but his soul was finally free.\"",
        subItems: [
          {
            subQuestion: "5(i)",
            question: "Why was Benson brutally attacked and left battered on the school ground?",
            answer: "Because he defected from the Ashes Flame cabal, surrendered their secret records to Mrs. Janet Acquah, and broke his criminal allegiance to Nkrabea."
          },
          {
            subQuestion: "5(j)",
            question: "Explain the thematic significance of the statement: 'He was broken in body, but his soul was finally free'.",
            answer: "It underscores the theme of moral redemption and courage; although Benson endured physical violence, his decision to confess and reject corruption liberated his conscience from guilt and fear."
          }
        ]
      }
    ]
  }
};

async function seedBeceEnglishMock8() {
  console.log("Seeding Isolated BECE English Mock 8 into Firestore with Beacon of Light curriculum...");

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

  // Strictly partitioned path: subjects/english/mocks/mock_8
  const docRef = db.doc("global_curriculum/jhs/subjects/english/mocks/mock_8");
  await docRef.set({
    mockId: "mock_8",
    mockNumber: 8,
    title: "BECE English Language National Mock Examination 8",
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
          title: "Section E: Renewable Energy Cloze Passage",
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

  console.log("✅ BECE English Mock 8 successfully updated with Beacon of Light at subjects/english/mocks/mock_8!");
}

seedBeceEnglishMock8()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed BECE English Mock 8:", err);
    process.exit(1);
  });
