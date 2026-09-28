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
// 40 OBJECTIVE QUESTIONS: LEXIS, STRUCTURE, CLINICAL CLOZE & ORAL PHONOLOGY
// =========================================================================
const allRawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "............ you require any clarification on the examination guidelines, kindly consult the supervisor.",
    options: ["Were", "Had", "Should", "Would"],
    correctAnswer: "Should",
    hint: "Inverted First Conditional: Formal inversion replacing 'If you require...' begins with this modal auxiliary followed by bare subject and verb.",
    workedSolution: "In formal conditional sentences, 'Should' introduces an inverted conditional clause replacing 'If you require': 'Should you require any clarification...'.",
    points: 1
  },
  {
    number: 2,
    prompt: "The young apprentice talks as though he ............ the entire mechanical layout of the diesel engine.",
    options: ["knows", "knew", "has known", "is knowing"],
    correctAnswer: "knew",
    hint: "Following 'as though / as if' describing an unreal or hypothetical state contrary to fact, standard English requires the subjunctive past simple.",
    workedSolution: "The conjunction 'as though' introducing an unreal comparison contrary to present fact takes the subjunctive simple past: 'talks as though he knew'.",
    points: 1
  },
  {
    number: 3,
    prompt: "Neither the classroom monitor nor the senior prefects ............ satisfied with the inspection results.",
    options: ["was", "is", "were", "has been"],
    correctAnswer: "were",
    hint: "Proximity rule with 'neither... nor': The verb agrees in number with the nearer plural subject ('the senior prefects').",
    workedSolution: "When subjects are joined by 'neither... nor', the verb agrees with the closer subject ('senior prefects', plural third-person), requiring past plural 'were'.",
    points: 1
  },
  {
    number: 4,
    prompt: "The displaced farming households were unjustly deprived ............ their ancestral cocoa lands.",
    options: ["with", "from", "of", "off"],
    correctAnswer: "of",
    hint: "Identify the dependent preposition that regularly collocates with the verb 'deprived'.",
    workedSolution: "In standard English grammatical collocations, the verb 'deprive' takes the preposition 'of': 'deprived of their ancestral lands'.",
    points: 1
  },
  {
    number: 5,
    prompt: "Those newly procured sports kits do not belong to our squad; they are ............",
    options: ["their's", "theirs", "theirs'", "them"],
    correctAnswer: "theirs",
    hint: "Absolute possessive pronouns never take an apostrophe.",
    workedSolution: "'Theirs' is an independent absolute possessive pronoun and never takes an apostrophe. Forms like 'their's' or 'theirs'' are ungrammatical.",
    points: 1
  },
  {
    number: 6,
    prompt: "The recalcitrant trespassers dare not ............ the demarcated forest reserve after sunset.",
    options: ["entered", "entering", "enter", "to enter"],
    correctAnswer: "enter",
    hint: "When 'dare' functions as a modal auxiliary in negative constructions with 'not', it takes a bare infinitive without 'to'.",
    workedSolution: "When used as a semi-modal auxiliary in the negative ('dare not'), it is followed by a bare infinitive without 'to': 'dare not enter'.",
    points: 1
  },
  {
    number: 7,
    prompt: "Seldom ............ such breathtaking intellectual brilliance from a junior pupil.",
    options: [
      "we witness",
      "do we witness",
      "we do witness",
      "did we witnessed"
    ],
    correctAnswer: "do we witness",
    hint: "Negative adverb fronting ('Seldom') triggers subject-auxiliary inversion in the present simple.",
    workedSolution: "When a restrictive or negative adverbial ('Seldom') begins a sentence, standard English requires subject-auxiliary inversion: 'Seldom do we witness...'.",
    points: 1
  },
  {
    number: 8,
    prompt: "The long-distance commercial coach travels ............ faster than the local cargo train.",
    options: ["far", "very", "more", "most"],
    correctAnswer: "far",
    hint: "Comparative adjectives with '-er' are intensified using 'far' or 'much', never 'very'.",
    workedSolution: "To intensify a comparative degree adjective or adverb ('faster'), standard English uses 'far' or 'much': 'far faster than'.",
    points: 1
  },
  {
    number: 9,
    prompt: "Whenever an unexpected crisis occurs, the committee members habitually blame ............",
    options: ["one another", "theirselves", "each another", "ourselves"],
    correctAnswer: "one another",
    hint: "Reciprocal pronoun used when referring to mutual interaction among three or more entities ('committee members').",
    workedSolution: "Referring to reciprocal actions among a plural collective group of three or more requires 'one another': 'blame one another'.",
    points: 1
  },
  {
    number: 10,
    prompt: "The transit surveyor refused to reveal where ............",
    options: [
      "does the new bypass lead",
      "the new bypass leads",
      "leads the new bypass",
      "did the new bypass lead"
    ],
    correctAnswer: "the new bypass leads",
    hint: "Noun clause word order: Connective ('where') + Subject ('the new bypass') + Verb ('leads').",
    workedSolution: "In indirect questions and embedded noun clauses, standard declarative word order (subject preceding verb) is mandatory: 'where the new bypass leads'.",
    points: 1
  },
  {
    number: 11,
    prompt: "Few delegates attended the emergency consultative meeting, ............ they?",
    options: ["didn't", "did", "haven't", "weren't"],
    correctAnswer: "did",
    hint: "'Few' without an article is semantically negative, requiring an affirmative question tag in the simple past.",
    workedSolution: "The quantifier 'Few' has negative polarity ('scarcely anyone attended'), requiring a positive question tag in the past simple: 'did they?'.",
    points: 1
  },
  {
    number: 12,
    prompt: "The dilapidated wooden footbridge ............ before the onset of the torrential rains.",
    options: [
      "should have been repaired",
      "should be repairing",
      "should have repaired",
      "should repair"
    ],
    correctAnswer: "should have been repaired",
    hint: "Past unfulfilled modal passive: The inanimate footbridge required repairs that were not carried out ('should have been + past participle').",
    workedSolution: "An action that was morally advisable but unfulfilled in the past applied to a passive subject requires 'should have been repaired'.",
    points: 1
  },
  {
    number: 13,
    prompt: "From the terminal lighthouse, the watchman watched the cargo vessel ............ gracefully across the bay.",
    options: ["sailed", "sailing", "to sail", "to sailing"],
    correctAnswer: "sailing",
    hint: "Verbs of sensory perception (watch, see, observe) take an object followed by a present participle (-ing) to emphasize an action in progress.",
    workedSolution: "Following sensory perception verbs ('watched'), a present participle ('sailing') emphasizes witnessing the continuous movement in progress.",
    points: 1
  },
  {
    number: 14,
    prompt: "There was scarcely a ............ of truth in the defaulting clerk's convoluted testimony.",
    options: ["drop", "grain", "piece", "loaf"],
    correctAnswer: "grain",
    hint: "Identify the standard figurative partitive noun used idiomatically with 'truth'.",
    workedSolution: "In standard English idiomatic usage, an infinitesimal amount of truth is partitively measured as 'a grain of truth'.",
    points: 1
  },
  {
    number: 15,
    prompt: "The magistrate found the defendant guilty ............ fraudulent conversion of public property.",
    options: ["with", "for", "of", "in"],
    correctAnswer: "of",
    hint: "Identify the dependent preposition that regularly collocates with the adjective 'guilty'.",
    workedSolution: "In standard legal and grammatical collocations, the adjective 'guilty' takes the preposition 'of': 'guilty of fraudulent conversion'.",
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
    prompt: "By insulting his employer publicly, Kwesi burned his bridges. This means that Kwesi ............",
    options: [
      "damaged his domestic premises",
      "destroyed all pathways for future return or reconciliation",
      "relocated to another municipality",
      "lost his valuable belongings"
    ],
    correctAnswer: "destroyed all pathways for future return or reconciliation",
    hint: "To destroy all possible ways of going back to a former situation or relationship.",
    workedSolution: "The idiom 'to burn one's bridges' means to take an irreversible step that makes reconciliation or return to a previous position impossible.",
    points: 1
  },
  {
    number: 22,
    prompt: "Following the sudden resignation of the manager, the office was at sixes and sevens. This means the office was ............",
    options: [
      "plunged into total confusion and disorganization",
      "closed by the police",
      "celebrating a victory",
      "operating with few staff"
    ],
    correctAnswer: "plunged into total confusion and disorganization",
    hint: "In a state of total confusion, disarray, or disorganization.",
    workedSolution: "The idiom 'at sixes and sevens' describes a condition of total disarray, bewilderment, or disorganization.",
    points: 1
  },
  {
    number: 23,
    prompt: "The stubborn truant turned a deaf ear to the headmaster's counsel. This means the truant ............",
    options: [
      "suffered from a physical ear infection",
      "deliberately ignored and refused to listen to the advice",
      "pretended to be asleep",
      "pleaded for forgiveness"
    ],
    correctAnswer: "deliberately ignored and refused to listen to the advice",
    hint: "To refuse to listen to or ignore a statement or warning.",
    workedSolution: "The idiom 'to turn a deaf ear' means to deliberately refuse to listen to, heed, or acknowledge what someone says.",
    points: 1
  },
  {
    number: 24,
    prompt: "The corrupt treasurer utilized union subscriptions to feather his own nest. This means the treasurer ............",
    options: [
      "constructed a poultry barn",
      "enriched himself dishonestly using public funds",
      "invested in real estate legitimately",
      "purchased decorative domestic furniture"
    ],
    correctAnswer: "enriched himself dishonestly using public funds",
    hint: "To make oneself wealthy, especially by taking dishonest advantage of one's position.",
    workedSolution: "The idiom 'to feather one's nest' means to enrich oneself dishonestly or accumulate illicit wealth while in a position of public trust.",
    points: 1
  },
  {
    number: 25,
    prompt: "Faced with severe budget deficits, the municipal board resolved to bite the bullet. This means the board resolved to ............",
    options: [
      "face an inevitable difficult situation with fortitude",
      "surrender to political pressure",
      "seek military intervention",
      "cancel all upcoming infrastructure projects"
    ],
    correctAnswer: "face an inevitable difficult situation with fortitude",
    hint: "To force oneself to perform an unpleasant or difficult task with courage and resignation.",
    workedSolution: "The idiom 'to bite the bullet' means to face a painful, grim, or difficult inevitability with stoic courage.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "While the bright fluorescent signage was conspicuous, the hidden side door was remarkably ...... .\nChoose the word most nearly opposite in meaning to 'conspicuous'.",
    options: ["dark", "inconspicuous", "shabby", "narrow"],
    correctAnswer: "inconspicuous",
    hint: "'Conspicuous' means clearly visible, noticeable, or standing out. What word denotes not clearly visible or attracting attention?",
    workedSolution: "'Conspicuous' means attracting attention or easily seen. Its direct antonym formed by prefixation is 'inconspicuous' (unobtrusive).",
    points: 1
  },
  {
    number: 27,
    prompt: "Attendance at the promotional examination is mandatory, whereas attending the cultural gala is ...... .\nChoose the word most nearly opposite in meaning to 'mandatory'.",
    options: ["voluntary", "enjoyable", "unnecessary", "delightful"],
    correctAnswer: "voluntary",
    hint: "'Mandatory' means required by law or rule; compulsory. What word denotes done of one's own free will; optional?",
    workedSolution: "'Mandatory' means compulsory or obligatory. Its direct administrative antonym is 'voluntary' (optional or elective).",
    points: 1
  },
  {
    number: 28,
    prompt: "Without proper nutritional care, the patient's condition will deteriorate, but sound therapy will cause it to ...... .\nChoose the word most nearly opposite in meaning to 'deteriorate'.",
    options: ["transform", "recover", "improve", "flourish"],
    correctAnswer: "improve",
    hint: "'Deteriorate' means to become progressively worse. What medical word denotes to become better in health?",
    workedSolution: "'Deteriorate' means to decline or worsen. Its direct clinical and qualitative antonym is 'improve' (get better).",
    points: 1
  },
  {
    number: 29,
    prompt: "While the border guards were hostile toward refugees, the relief volunteers were remarkably ...... .\nChoose the word most nearly opposite in meaning to 'hostile'.",
    options: ["amicable", "generous", "courteous", "respectful"],
    correctAnswer: "amicable",
    hint: "'Hostile' means antagonistic, aggressive, or unfriendly. What word denotes friendly, good-natured, and peaceable?",
    workedSolution: "'Hostile' means unfriendly, antagonistic, or aggressive. Its direct relational antonym is 'amicable' (friendly and peaceable).",
    points: 1
  },
  {
    number: 30,
    prompt: "During the drought, potable well water was scarce, but after the rains it became ...... .\nChoose the word most nearly opposite in meaning to 'scarce'.",
    options: ["plentiful", "clear", "fresh", "drinkable"],
    correctAnswer: "plentiful",
    hint: "'Scarce' means insufficient for the demand; hard to find. What word denotes existing in great abundance?",
    workedSolution: "'Scarce' means in short supply or rare. Its direct quantitative and environmental antonym is 'plentiful' (abundant).",
    points: 1
  },

  // --- SECTION E: CLOZE PASSAGE (CLINICAL MEDICINE REGISTER) (31 - 35) ---
  {
    number: 31,
    prompt: "Cloze Passage: \"The feverish child was rushed to the municipal hospital and immediately ---31--- to the pediatric ward for clinical care.\"\nChoose the most suitable word:",
    options: ["admitted", "checked", "confined", "lodged"],
    correctAnswer: "admitted",
    hint: "The formal hospital administration term for officially registering a patient for stay and treatment in a ward.",
    workedSolution: "In clinical hospital protocol, registering a sick person into a ward for treatment is formally termed 'admitted'.",
    points: 1
  },
  {
    number: 32,
    prompt: "Cloze Passage: \"The resident medical officer carefully examined the clinical ---32---, noting the high temperature and severe vomiting.\"\nChoose the most suitable word:",
    options: ["signs", "symptoms", "complaints", "conditions"],
    correctAnswer: "symptoms",
    hint: "Physical or mental features indicating a condition of disease noticed by or presented in a patient are symptoms.",
    workedSolution: "In medical terminology, the physical manifestations and bodily sensations indicative of an illness are termed 'symptoms'.",
    points: 1
  },
  {
    number: 33,
    prompt: "Cloze Passage: \"Following comprehensive blood and stool culture assays, the laboratory technician ---33--- acute salmonella septicemia.\"\nChoose the most suitable word:",
    options: ["discovered", "diagnosed", "determined", "declared"],
    correctAnswer: "diagnosed",
    hint: "To identify the nature of an illness by examination of the symptoms and medical test results is to diagnose.",
    workedSolution: "The formal medical verb for identifying the exact disease through diagnostic tests is 'diagnosed'.",
    points: 1
  },
  {
    number: 34,
    prompt: "Cloze Passage: \"The specialist physician ---34--- a seven-day course of intravenous antibiotics alongside oral rehydration therapy.\"\nChoose the most suitable word:",
    options: ["directed", "demanded", "prescribed", "advised"],
    correctAnswer: "prescribed",
    hint: "To authorize or recommend the use of a medicine or treatment in writing is to prescribe.",
    workedSolution: "In pharmaceutical and medical protocol, an authorized order for drug administration is 'prescribed'.",
    points: 1
  },
  {
    number: 35,
    prompt: "Cloze Passage: \"Having responded favorably to chemotherapy and regained bodily vigor, the convalescing child was fully ---35--- from the hospital.\"\nChoose the most suitable word:",
    options: ["released", "discharged", "dismissed", "liberated"],
    correctAnswer: "discharged",
    hint: "The formal medical term for officially allowing a patient to leave the hospital upon recovery.",
    workedSolution: "In hospital administration, officially permitting a recovered patient to return home is termed 'discharged'.",
    points: 1
  },

  // --- PART B: ORAL LANGUAGE & PHONOLOGY (36 - 40) ---
  {
    number: 36,
    prompt: "Choose the word that contains the identical voiceless dental fricative consonant sound as the underlined digraph in:\n\"The central **<u>th</u>eme** of the novel was justice.\"",
    options: ["these", "thought", "though", "clothe"],
    correctAnswer: "thought",
    hint: "'Theme' begins with the voiceless dental fricative /θ/. 'Thought' (/θɔːt/) begins with the identical voiceless /θ/ sound. ('These', 'though', and 'clothe' have voiced /ð/).",
    workedSolution: "The digraph 'th' in 'theme' is pronounced with the voiceless dental fricative /θ/. Among the options, 'thought' (/θɔːt/) shares the identical /θ/ sound.",
    points: 1
  },
  {
    number: 37,
    prompt: "Choose the word that contains the identical vowel sound as the underlined vowel in:\n\"The mountaineers began to **cl<u>i</u>mb** the ridge.\"",
    options: ["bright", "film", "bridge", "tin"],
    correctAnswer: "bright",
    hint: "The vowel in 'climb' (/klaɪm/) is the closing diphthong /aɪ/. 'Bright' (/braɪt/) contains the identical diphthong /aɪ/.",
    workedSolution: "The word 'climb' contains the diphthong /aɪ/. 'Bright' shares the exact same diphthong /braɪt/.",
    points: 1
  },
  {
    number: 38,
    prompt: "Choose the word that shares the identical initial consonant cluster sound as:\n\"A thick **<u>str</u>and** of hemp rope was secured.\"",
    options: ["stroll", "spread", "shrink", "sprawl"],
    correctAnswer: "stroll",
    hint: "Identify the word beginning with the three-consonant cluster /str/.",
    workedSolution: "The word 'strand' begins with the three-consonant cluster /str/. 'Stroll' begins with the identical /str/ cluster.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which of the following words contains a SILENT consonant letter that is not sounded in speech?",
    options: ["wrist", "west", "frost", "nest"],
    correctAnswer: "wrist",
    hint: "In this word for the joint connecting the hand with the forearm, the initial letter 'w' is completely silent.",
    workedSolution: "In 'wrist' (pronounced /rɪst/), the initial consonant letter 'w' is completely silent.",
    points: 1
  },
  {
    number: 40,
    prompt: "When the imperative command \"Close the laboratory windows immediately!\" is uttered firmly, what intonation contour is standardly used?",
    options: [
      "Rising intonation",
      "Falling intonation",
      "Level intonation",
      "Rise-fall intonation"
    ],
    correctAnswer: "Falling intonation",
    hint: "Definite, firm commands and imperative orders in standard English terminate with a falling pitch contour (↘).",
    workedSolution: "In English suprasegmental phonology, firm imperative commands, instructions, and prohibitions terminate on a falling intonation contour (↘).",
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

const assignedTargetIndices = seedShuffle(targetKeys, 202603);

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
        prompt: "Write a formal letter to your Municipal Chief Executive (MCE), drawing attention to the menace of stray domestic livestock on public streets and markets in your municipality, and suggesting at least two practical bylaws to restore urban sanity.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2026

The Municipal Chief Executive
Bekwai Municipal Assembly
Municipal Directorate, Bekwai

Dear Sir,

PETITION ON THE MENACE OF STRAY DOMESTIC LIVESTOCK IN BEKWAI MUNICIPALITY

On behalf of the concerned youth, commercial traders, and pedestrians of the Bekwai Municipality, I respectfully submit this petition to draw your urgent administrative attention to the dangerous nuisance posed by stray livestock and to propose actionable municipal bylaws to restore public health and order.

Over the past four months, our municipal commercial avenues, market squares, and school compounds have been heavily overrun by roaming goats, sheep, and stray cattle. These animals roam through busy traffic corridors, causing fatal vehicular and motorcycle collisions on our main asphalt highway. Furthermore, they invade open market stalls, consuming fresh vegetables and spreading fecal sludge across pedestrian walkways. During rainfall, this animal waste washes into open roadside drains, triggering acute fly infestations and severe outbreaks of diarrheal diseases that threaten public health.

To permanently eradicate this environmental nuisance, I suggest, first, that the Municipal Assembly enact and strictly enforce an Anti-Stray Livestock Bylaw. Livestock owners must be mandated to construct secured, fenced kraals or pens outside town boundaries to confine their animals.

Secondly, the assembly should establish a Municipal Livestock Impoundment Task Force equipped with holding facilities. Any cattle, sheep, or goat found unattended in public corridors should be impounded, and owner penalties must include heavy spot fines and compounding storage fees. Unclaimed livestock should be auctioned to generate revenue for municipal sanitation services.

We count on your prompt executive leadership to ensure our streets are safe, sanitary, and orderly.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Youth Secretary)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in a national daily newspaper on the topic: \"The Dangers of Self-Medication and the Need for Professional Clinical Care in Ghana.\"",
        modelAnswer: `THE PERILOUS HABIT OF SELF-MEDICATION: A THREAT TO PUBLIC HEALTH
By Samuel K. Boateng, Begoro

In contemporary Ghanaian society, visiting a certified hospital or consulting a registered medical practitioner is frequently viewed as a cumbersome chore. Driven by impatience, the desire to avoid clinical consultation fees, and the widespread availability of over-the-counter pharmaceuticals, millions of citizens resort to self-medication whenever they experience bodily discomfort. This dangerous practice constitutes an insidious public health threat that silently claims hundreds of lives annually.

The foremost catastrophe resulting from self-medication is the alarming escalation of antimicrobial resistance (AMR). Whenever individuals experience common colds, headaches, or slight fever, they purchase potent broad-spectrum antibiotics from unregulated chemical stores without undergoing laboratory diagnosis. Taking incorrect dosages or abandoning antibiotic courses halfway allows bacteria to mutate and develop resistance to conventional therapies. Consequently, standard, inexpensive medications lose their efficacy against lethal infections like typhoid, pneumonia, and tuberculosis, leaving doctors powerless during severe clinical emergencies.

Secondly, self-medication frequently causes irreversible organ toxicity and fatal misdiagnoses. Many over-the-counter pain relievers and unregulated herbal concoctions place intense metabolic strain on the human liver and kidneys. Chronic consumption of unprescribed analgesics is a leading cause of acute kidney failure and toxic hepatitis among young Ghanaians. Furthermore, self-medicating masks early diagnostic symptoms of malignant pathologies like diabetes, hypertension, and cancer until they advance to terminal stages.

To avert this crisis, the Pharmacy Council and the Food and Drugs Authority (FDA) must rigorously clamp down on unlicensed chemical shops and hawkers peddling prescription medicines. Public health campaigns must educate citizens that visiting a clinic is not an optional luxury, but a vital life-saving necessity.

Your health is your greatest treasure; do not gamble with unprescribed medicine.`
      },
      {
        questionNumber: "3",
        category: "Narrative Moral Story",
        prompt: "Write an engaging, realistic story that illustrates the traditional proverb: \"A tree cannot make a forest.\"",
        modelAnswer: `A TREE CANNOT MAKE A FOREST

During our final year in junior high school, our basic school qualified for the prestigious National Inter-Schools Green Ghana Agriculture Trophy. The national competition required schools to cultivate a three-acre commercial vegetable farm within six months, evaluated on yield, crop quality, and ecological pest management.

Our class captain, Kwame, was exceptionally brilliant in agricultural science but possessed an arrogant, individualistic temperament. He firmly believed that personal genius was superior to group consultation. Appointed as the project coordinator, Kwame refused to delegate responsibilities or listen to his classmates' suggestions. He drew the irrigation layout alone, selected the seeds without consulting the agricultural master, and boasted openly that he alone would win the national trophy for our school, shouting arrogantly: "I have the vision; the rest of you should simply obey!" Our class teacher reminded him gently that "a tree cannot make a forest," but Kwame scoffed at the ancient proverb.

Disaster struck three weeks before the national inspection team's arrival. A ferocious armyworm infestation broke out across the two-acre tomato plot, while the main irrigation pump suffered an acute mechanical breakdown. Working alone, Kwame tried to spray the entire acreage with a hand-pump while clearing overgrown weeds, but exhaustion overwhelmed him. Within five days, half the tomato plants withered, and Kwame collapsed from heat exhaustion, weeping in despair.

Swallowing their hurt pride, our classmates mobilized immediately. We organized ourselves into specialized volunteer teams: the science club formulated an organic neem-seed pesticide that wiped out the armyworms; the technical skills boys repaired the irrigation pump using spare parts; and the sports teams cleared the perimeter drains in two afternoons.

When the national inspectors arrived, our flourishing, green tomato fields won the First National Trophy! Standing on the dais holding the silver cup together with his classmates, Kwame wept in profound humility, declaring to the school: Truly, a tree cannot make a forest.`
      }
    ]
  },
  partB_comprehension: {
    title: "Part B: Reading Comprehension",
    instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
    passageText: `In traditional African societies, wildlife conservation was not an abstract academic theory; it was a deeply sacred cultural covenant woven into customary ethics and daily existence. Indigenous communities recognized that human survival was inextricably linked to the vitality of the natural ecosystem. Consequently, traditional authorities instituted sacred groves, totemic prohibitions, and seasonal hunting bans to preserve biodiversity and protect vital river catchments from ecological devastation.

Central to this indigenous conservation philosophy was the institution of the sacred grove. These were pristine virgin forests surrounding shrines, ancestral burial mounds, and the headwaters of vital rivers. Customary bylaws strictly prohibited farming, tree felling, and hunting within these sanctuaries. Violators faced severe customary fines, public humiliation, and spiritual cleansing rituals. Biologically, these sacred groves functioned as indispensable botanical refuges where endangered timber species, medicinal herbs, and rare fauna multiplied undisturbed, replenishing adjacent degraded zones.

Furthermore, traditional ethnic clans adopted specific animal species as their sacred emblems or totems. For example, clans affiliated with the leopard, the hornbill, or the python held these creatures in profound spiritual veneration. Harming, killing, or consuming one's totemic animal was regarded as an abominable sacrilege capable of bringing ancestral curses upon the offender's lineage. This totemic taboo fostered widespread psychological reverence for wildlife, creating an invisible, highly effective barrier against the indiscriminate extermination of fauna.

Regrettably, modern rapid urbanization, economic materialism, and religious skepticism have severely eroded these traditional ecological values. Commercial timber loggers and unauthorized sand-winners invade sacred groves with impunity, felling majestic centuries-old mahogany trees and polluting pristine headwaters with petrochemical waste. Indigenous totems are mercilessly butchered for commercial bushmeat in roadside chop-bars.

The catastrophic consequences of this cultural collapse are now glaringly evident: once-mighty rivers have dried up into rocky ditches, rare medicinal flora have vanished, and perennial droughts devastate agricultural livelihoods. Cultural conservationists argue passionately that unless contemporary society integrates these ancestral taboos into statutory environmental protection policies, our precious biological heritage will be lost forever.`,
    questions: [
      {
        subQuestion: "(a)",
        question: "State two customary practices mentioned in the passage that traditional societies used to preserve biodiversity.",
        answer: "1. Instituting sacred groves.\n2. Establishing totemic prohibitions / taboos (or enforcing seasonal hunting bans)."
      },
      {
        subQuestion: "(b)",
        question: "Mention two vital environmental functions performed by sacred groves in traditional communities.",
        answer: "1. Protecting the headwaters of vital rivers and streams.\n2. Functioning as botanical refuges for endangered timber species, medicinal herbs, and rare animals."
      },
      {
        subQuestion: "(c)",
        question: "What happened to a clan member who harmed or killed his or her totemic animal?",
        answer: "The offender was viewed as committing an abominable sacrilege and faced ancestral curses upon his or her lineage."
      },
      {
        subQuestion: "(d)",
        question: "State two modern factors that have contributed to the destruction of traditional ecological values.",
        answer: "Rapid urbanization, economic materialism, and religious skepticism (or commercial timber logging and illegal sand-winning)."
      },
      {
        subQuestion: "(e)",
        question: "Explain the meaning of the following expressions as used in the passage:\nI. ... sacred cultural covenant;\nII. ... with impunity;\nIII. ... lost forever.",
        answer: "I. 'sacred cultural covenant' means a holy, solemn, and binding traditional agreement or commitment.\nII. 'with impunity' means without fear of punishment, penalty, or retribution.\nIII. 'lost forever' means permanently extinguished, destroyed, and vanished beyond recovery."
      },
      {
        subQuestion: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. inextricably;\nII. sanctuaries;\nIII. veneration;\nIV. pristine.",
        answer: "I. inextricably: inseparably, completely, closely, permanently.\nII. sanctuaries: refuges, havens, reserves, shelters.\nIII. veneration: reverence, deep respect, honor, awe.\nIV. pristine: pure, untouched, clean, unpolluted, immaculate."
      },
      {
        subQuestion: "(g)",
        question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the environmental consequences of the collapse of traditional conservation values.",
        answer: "1. Perennial rivers have dried into rocky ditches.\n2. Rare medicinal plants and animals have vanished."
      }
    ]
  },
  partC_literature: {
    title: "Part C: Literature in English (The Beacon of Light Anthology)",
    instructions: "Answer all questions in this part based on the prescribed selections from the NaCCA Common Core Programme anthology: The Beacon of Light.",
    questions: [
      {
        sectionTitle: "CHARLES DICKENS: Oliver Twist (Chapter 2: Oliver Asks for More)",
        contextExtract: "\"The room in which the boys were fed was a large stone hall, with a copper at one end: out of which the master, dressed in an apron for the purpose, and assisted by one or two women, ladled the gruel at meal-times. Lots were cast who should walk up to the master after supper that evening, and ask for more; and it fell to Oliver Twist.\"",
        subItems: [
          {
            subQuestion: "5(a)",
            question: "Why did the hungry boys in the workhouse dining hall cast lots?",
            answer: "They cast lots to choose one boy who would walk up to the master after supper and dare to ask for an extra portion of gruel on behalf of the starving apprentices."
          },
          {
            subQuestion: "5(b)",
            question: "What physical detail in the extract illustrates the cold, institutional deprivation of the workhouse dining hall?",
            answer: "The 'large stone hall' containing only a single copper vat, bare furniture, and minimal warmth, emphasizing institutional cheerlessness and physical hunger."
          }
        ]
      },
      {
        sectionTitle: "PROSE NARRATIVE: A Calabash of Saha",
        contextExtract: "\"Abubakar and Abidatu held up the polished calabash fitted with locally assembled UV tubes. When they demonstrated clear, drinkable water flowing from the basin, the hall in Accra erupted in applause. Their innovation was a drop of water in the ocean, yet it had stirred an entire nation.\"",
        subItems: [
          {
            subQuestion: "5(c)",
            question: "What does the combination of the traditional calabash and modern UV tubes symbolize in the story?",
            answer: "It symbolizes the harmonious integration of indigenous African cultural vessels with modern STEM technology to solve community health challenges."
          },
          {
            subQuestion: "5(d)",
            question: "Explain the metaphor 'Their innovation was a drop of water in the ocean'.",
            answer: "It means that although their single local water filtration machine was a small contribution toward solving a vast regional problem, its proof-of-concept held transformative national significance."
          }
        ]
      },
      {
        sectionTitle: "MODERN POETRY: The Monday Breeze",
        contextExtract: "\"Blurring horns\nScreaming voice\nRunning legs\nWomen\nThey always forget their purse\nI am late, Daddy yells\nIf you had helped me, we would have been gone\nchildren settle in van\"",
        subItems: [
          {
            subQuestion: "5(e)",
            question: "Why is the title 'The Monday Breeze' situationally ironic in relation to the events depicted in the poem?",
            answer: "The title suggests a gentle, cooling, and peaceful atmosphere, which sharply contradicts the hectic rushing, blaring horns, domestic friction, and commuter panic portrayed in the text."
          },
          {
            subQuestion: "5(f)",
            question: "What social reality regarding domestic responsibilities is highlighted by Mummy's retort: 'If you had helped me, we would have been gone'?",
            answer: "It highlights the unequal domestic division of labor, exposing how mothers shoulder the unassisted burden of morning household preparation while fathers demand punctuality."
          }
        ]
      },
      {
        sectionTitle: "PROSE NOVELLA: A Beacon of Light",
        contextExtract: "\"Osmond stepped before the microphone, his handwoven Kente cloth draped over his shoulder. Ms. Adjei gave him a reassuring nod from the control booth. When he opened his mouth, the heartfelt melody of 'Someone to Lean On' filled the auditorium, carrying the hopes and trials of Obane into the heart of Accra.\"",
        subItems: [
          {
            subQuestion: "5(g)",
            question: "What central moral message does Osmond's signature song, 'Someone to Lean On', communicate?",
            answer: "It communicates gratitude, interdependence, mutual human compassion, and the necessity of supporting others during adversity."
          },
          {
            subQuestion: "5(h)",
            question: "How does Osmond's journey from Obane to the national stage in Accra illustrate the novella's titular theme?",
            answer: "His breakthrough demonstrates that resilience, hard work, and dedicated mentorship can transform a disadvantaged rural youth into a shining beacon of hope and inspiration for his community."
          }
        ]
      },
      {
        sectionTitle: "PROSE NARRATIVE: Beyond Light and Shadow",
        contextExtract: "\"Mrs. Acquah stood firmly by the assembly hall doorway. Beside her stood her biological daughter, Tina Bells, in the school uniform. In the shadows of the corridor, Benson stared at the new girl, feeling the dark grip of Ashes Flame pulling at his conscience.\"",
        subItems: [
          {
            subQuestion: "5(i)",
            question: "Why was Mrs. Janet Acquah's decision to enroll her own daughter, Tina Bells, a crucial turning point for Cedar of Lebanon School?",
            answer: "It was a courageous act of leadership by personal example and sacrifice that demonstrated genuine faith in the school's potential, breaking the cycle of parental fear and distrust."
          },
          {
            subQuestion: "5(j)",
            question: "What was 'Ashes Flame', and how did it affect life at Cedar of Lebanon School before Mrs. Acquah's intervention?",
            answer: "Ashes Flame was a clandestine rogue student cabal backed by adult benefactors that terrorized the school through bullying, extortion, chaos, and a pervasive culture of fear."
          }
        ]
      }
    ]
  }
};

async function seedBeceEnglishMock3() {
  console.log("Seeding Isolated BECE English Mock 3 into Firestore with Beacon of Light curriculum...");

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

  // Strictly partitioned path: subjects/english/mocks/mock_3
  const docRef = db.doc("global_curriculum/jhs/subjects/english/mocks/mock_3");
  await docRef.set({
    mockId: "mock_3",
    mockNumber: 3,
    title: "BECE English Language National Mock Examination 3",
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
          title: "Section E: Clinical Medicine Cloze Passage",
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

  console.log("✅ BECE English Mock 3 successfully updated with Beacon of Light at subjects/english/mocks/mock_3!");
}

seedBeceEnglishMock3()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed BECE English Mock 3:", err);
    process.exit(1);
  });
