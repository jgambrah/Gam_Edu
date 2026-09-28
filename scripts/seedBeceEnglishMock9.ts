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
// 40 OBJECTIVE QUESTIONS: LEXIS, STRUCTURE, PUBLISHING CLOZE & ORAL PHONOLOGY
// =========================================================================
const allRawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "I would rather you ............ me before submitting the petition to the board yesterday.",
    options: [
      "informed",
      "had informed",
      "have informed",
      "would inform"
    ],
    correctAnswer: "had informed",
    hint: "Past counterfactual preference: 'would rather + different subject' referring to an unfulfilled past action requires the past perfect.",
    workedSolution: "When 'would rather' refers to a past situation concerning a different person, standard English requires the past perfect: 'would rather you had informed me'.",
    points: 1
  },
  {
    number: 2,
    prompt: "The two feuding boundary owners finally agreed to settle their land disputes with ............",
    options: [
      "themselves",
      "one another",
      "each other",
      "theirselves"
    ],
    correctAnswer: "each other",
    hint: "Reciprocal pronoun used when mutual action is exchanged between exactly two individuals ('The two feuding boundary owners').",
    workedSolution: "'Each other' is the reciprocal pronoun used when referring to two persons. 'One another' is preferred for three or more.",
    points: 1
  },
  {
    number: 3,
    prompt: "The indigent student ............ the scholarship was conferred on expressed profound gratitude.",
    options: ["who", "whom", "which", "whose"],
    correctAnswer: "whom",
    hint: "Objective relative pronoun governed by the preposition 'on' located at the end of the relative clause.",
    workedSolution: "The relative pronoun functions as the object of the preposition 'on' (the scholarship was conferred on him), requiring objective case 'whom'.",
    points: 1
  },
  {
    number: 4,
    prompt: "All editorial staff must strictly adhere to the five national ............ guidelines.",
    options: [
      "editor-in-chiefs'",
      "editors-in-chief's",
      "editors'-in-chief",
      "editors-in-chiefs'"
    ],
    correctAnswer: "editors-in-chief's",
    hint: "Compound noun plural possessive: Form the plural of the base noun ('editors-in-chief') and append apostrophe + 's' to the final element.",
    workedSolution: "The plural form of 'editor-in-chief' is 'editors-in-chief'. Its possessive form appends apostrophe + 's' to the end: 'editors-in-chief's guidelines'.",
    points: 1
  },
  {
    number: 5,
    prompt: "The ministerial inquiry recommended that the interim committee ............ dissolved without delay.",
    options: ["is", "be", "was", "should have"],
    correctAnswer: "be",
    hint: "Mandative Subjunctive: Verbs of recommending or proposing followed by 'that' take the base form 'be' in the passive.",
    workedSolution: "Following verbs of recommending, proposing, or mandating followed by 'that', the mandative subjunctive uses the base verb form 'be': 'recommended that the committee be dissolved'.",
    points: 1
  },
  {
    number: 6,
    prompt: "You ............ submit a duplicate report since the original file is already on record.",
    options: ["need not", "needs not", "need not to", "needs not to"],
    correctAnswer: "need not",
    hint: "As a semi-modal auxiliary in the negative, 'need' takes no third-person '-s' and is followed by a bare infinitive without 'to'.",
    workedSolution: "When used as a modal auxiliary in the negative, 'need' has no '-s' and takes a bare infinitive: 'need not submit'.",
    points: 1
  },
  {
    number: 7,
    prompt: "The candidate had secured clearance prior ............ sitting for the national competitive examination.",
    options: ["than", "to", "from", "before"],
    correctAnswer: "to",
    hint: "Identify the dependent preposition that regularly collocates with the adjective 'prior'.",
    workedSolution: "In standard English collocations, the comparative adjective 'prior' strictly takes the preposition 'to': 'prior to sitting'.",
    points: 1
  },
  {
    number: 8,
    prompt: "Neither the headmaster nor the subject masters ............ aware of the inspection timetable yesterday.",
    options: ["was", "is", "were", "are"],
    correctAnswer: "were",
    hint: "Proximity rule with 'neither... nor': In the past tense, the verb agrees in number with the nearer plural subject ('the subject masters').",
    workedSolution: "When subjects are linked by 'neither... nor', the verb agrees with the closer subject ('subject masters', plural). In the past tense, the correct verb is 'were'.",
    points: 1
  },
  {
    number: 9,
    prompt: "Active: \"The prefect saw the truant scale the campus perimeter wall.\"\nPassive: \"The truant was seen ............ the campus perimeter wall by the prefect.\"",
    options: ["scale", "to scale", "scaled", "scaling of"],
    correctAnswer: "to scale",
    hint: "Passive transformation of sensory verbs: Verbs of perception taking a bare infinitive in the active require a full to-infinitive in the passive.",
    workedSolution: "While sensory verbs take a bare infinitive in the active voice ('saw him scale'), their passive equivalents require a full to-infinitive: 'was seen to scale'.",
    points: 1
  },
  {
    number: 10,
    prompt: "The senior master detests ............ while delivering a physics demonstration.",
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
    number: 11,
    prompt: "At no time ............ that he had tampered with the laboratory inventory.",
    options: [
      "the technician admitted",
      "did the technician admit",
      "the technician did admit",
      "had the technician admits"
    ],
    correctAnswer: "did the technician admit",
    hint: "Fronted negative prepositional phrase ('At no time') triggers subject-auxiliary inversion in the simple past.",
    workedSolution: "When a sentence begins with an emphatic negative phrase ('At no time'), standard English requires subject-auxiliary inversion: 'did the technician admit'.",
    points: 1
  },
  {
    number: 12,
    prompt: "The newly appointed regional education officer is an old classmate of ............",
    options: ["me", "mine", "myself", "my"],
    correctAnswer: "mine",
    hint: "Double possessive construction: 'a [noun] of' requires an absolute possessive pronoun.",
    workedSolution: "In double possessive constructions ('a classmate of...'), standard grammar requires the independent possessive pronoun 'mine'.",
    points: 1
  },
  {
    number: 13,
    prompt: "She scarcely complains about the demanding compound cleaning duties, ............ she?",
    options: ["doesn't", "does", "did", "didn't"],
    correctAnswer: "does",
    hint: "The semi-negative adverb 'scarcely' makes the main clause semantically negative, requiring an affirmative present question tag.",
    workedSolution: "'Scarcely' carries negative polarity, requiring an affirmative tag. With simple present lexical verb 'complains', the matching tag is 'does she?'.",
    points: 1
  },
  {
    number: 14,
    prompt: "The museum conservators excavated a ............ slab from the archaeological mound.",
    options: [
      "large ancient Egyptian granite",
      "ancient large Egyptian granite",
      "Egyptian large ancient granite",
      "large Egyptian ancient granite"
    ],
    correctAnswer: "large ancient Egyptian granite",
    hint: "Cumulative adjective ordering: Size ('large') precedes Age ('ancient') which precedes Origin ('Egyptian') followed by Material ('granite').",
    workedSolution: "Standard English adjective order places size ('large') before age ('ancient') followed by origin ('Egyptian') and material ('granite'): 'large ancient Egyptian granite slab'.",
    points: 1
  },
  {
    number: 15,
    prompt: "The reckless driver was arraigned before the magistrate and charged ............ manslaughter.",
    options: ["for", "with", "of", "against"],
    correctAnswer: "with",
    hint: "Identify the dependent preposition that regularly collocates with the legal verb 'charged'.",
    workedSolution: "In standard legal collocations, an accused person is 'charged with' a criminal offense: 'charged with manslaughter'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The external auditor conducted a thorough inspection of the financial balance sheets.\nChoose the word nearest in meaning to 'thorough'.",
    options: ["meticulous", "quick", "casual", "brief"],
    correctAnswer: "meticulous",
    hint: "Complete with regard to every detail; not superficial or partial.",
    workedSolution: "'Thorough' means carried out with great care and attention to detail; 'meticulous' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "A trustworthy arbitrator must deliver an unbiased verdict.\nChoose the word nearest in meaning to 'unbiased'.",
    options: ["friendly", "impartial", "strict", "popular"],
    correctAnswer: "impartial",
    hint: "Showing no prejudice for or against something; impartial and fair.",
    workedSolution: "'Unbiased' means free from prejudice or favoritism; 'impartial' is its direct synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "Commercial vegetable cultivation during the dry harmattan proved highly gainful.\nChoose the word nearest in meaning to 'gainful'.",
    options: ["lucrative", "demanding", "perilous", "convenient"],
    correctAnswer: "lucrative",
    hint: "Serving to increase wealth or produce a financial profit.",
    workedSolution: "'Gainful' describes an activity that produces substantial financial profit; 'lucrative' is its exact equivalent.",
    points: 1
  },
  {
    number: 19,
    prompt: "The coastal village suffered from the perpetual pounding of heavy ocean surf.\nChoose the word nearest in meaning to 'perpetual'.",
    options: ["incessant", "violent", "seasonal", "sudden"],
    correctAnswer: "incessant",
    hint: "Never ending or changing; occurring continually without interruption.",
    workedSolution: "'Perpetual' means continuing without pause or interruption; 'incessant' is its direct synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "Trekking through the dense mangrove swamp at night is a treacherous journey.\nChoose the word nearest in meaning to 'treacherous'.",
    options: ["perilous", "tiring", "fearful", "tedious"],
    correctAnswer: "perilous",
    hint: "Hazardous because of hidden, unpredictable, or unpredictable dangers.",
    workedSolution: "'Treacherous' in describing physical terrain or journeys means hazardous or 'perilous'; 'perilous' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "By insulting his employer publicly, Kwesi burned his boats. This means that Kwesi ............",
    options: [
      "damaged his commercial canoes",
      "committed himself irreversibly by eliminating all retreat",
      "resigned to take up farming",
      "relocated to another district"
    ],
    correctAnswer: "committed himself irreversibly by eliminating all retreat",
    hint: "To destroy all possible ways of going back to a former situation or relationship.",
    workedSolution: "The idiom 'to burn one's boats' means to commit oneself decisively to a course of action by making retreat or reconciliation impossible.",
    points: 1
  },
  {
    number: 22,
    prompt: "We warned Yaw not to spill the beans about the scholarship award. This means we warned Yaw not to ............",
    options: [
      "waste the celebratory dinner",
      "divulge confidential information prematurely",
      "decline the scholarship offer",
      "misplace his school certificates"
    ],
    correctAnswer: "divulge confidential information prematurely",
    hint: "To disclose a secret prematurely or indiscreetly.",
    workedSolution: "The idiom 'to spill the beans' means to reveal secret or confidential information prematurely.",
    points: 1
  },
  {
    number: 23,
    prompt: "The union representatives and the managing director do not see eye to eye on wage restructuring. This means they ............",
    options: [
      "refuse to attend board meetings",
      "do not share identical views or agree with each other",
      "stare at each other aggressively",
      "cannot see each other clearly"
    ],
    correctAnswer: "do not share identical views or agree with each other",
    hint: "To have the same opinion or agree completely.",
    workedSolution: "The idiom 'to see eye to eye' means to agree completely; saying they do not see eye to eye means they hold conflicting views.",
    points: 1
  },
  {
    number: 24,
    prompt: "After being cautioned by the magistrate, the young truant resolved to turn over a new leaf. This means he decided to ............",
    options: [
      "abandon his old habits and reform his conduct",
      "relocate to another town",
      "read new textbooks",
      "take up forestry work"
    ],
    correctAnswer: "abandon his old habits and reform his conduct",
    hint: "To start behaving in a better, more responsible manner; reform oneself.",
    workedSolution: "The idiom 'to turn over a new leaf' means to reform one's behavior and start afresh responsibly.",
    points: 1
  },
  {
    number: 25,
    prompt: "By challenging the corrupt town council alone, the young clerk was skating on thin ice. This means the clerk was ............",
    options: [
      "taking dangerous risks in a precarious position",
      "traveling across frozen lakes",
      "acting with extreme cowardice",
      "wasting municipal time"
    ],
    correctAnswer: "taking dangerous risks in a precarious position",
    hint: "To be in a risky, precarious, or dangerous situation.",
    workedSolution: "The idiom 'skating on thin ice' means putting oneself in a precarious situation or taking dangerous risks.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "While the junior housemaster was remarkably lenient, the senior headmaster enforced ...... penalties.\nChoose the word most nearly opposite in meaning to 'lenient'.",
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
    prompt: "Under high temperatures, gases will expand, but in cold conditions they will ...... .\nChoose the word most nearly opposite in meaning to 'expand'.",
    options: ["shrink", "burst", "fall", "collapse"],
    correctAnswer: "shrink",
    hint: "'Expand' means to become larger in size or volume. What word denotes to become smaller in size or decrease in volume?",
    workedSolution: "In physical science, the direct antonym of 'expand' (increase in size/volume) is 'shrink' (or contract).",
    points: 1
  },
  {
    number: 29,
    prompt: "The instructor's preliminary explanation was obscure, but his summary was remarkably ...... .\nChoose the word most nearly opposite in meaning to 'obscure'.",
    options: ["transparent", "brief", "loud", "useful"],
    correctAnswer: "transparent",
    hint: "'Obscure' means unclear, dim, and difficult to comprehend. What word denotes clear, lucid, and easily understood?",
    workedSolution: "'Obscure' means vague or difficult to understand. Its direct intellectual antonym is 'transparent' (or lucid/clear).",
    points: 1
  },
  {
    number: 30,
    prompt: "The novice driver was condemned for being reckless, but his mentor was praised for being ...... .\nChoose the word most nearly opposite in meaning to 'reckless'.",
    options: ["prudent", "slow", "fearful", "obedient"],
    correctAnswer: "prudent",
    hint: "'Reckless' means heedless of danger or rash. What word denotes acting with care and thought for the future?",
    workedSolution: "'Reckless' means careless and rash. Its direct behavioral antonym is 'prudent' (cautious, sensible, and careful).",
    points: 1
  },

  // --- SECTION E: CLOZE PASSAGE (PUBLISHING & PRINTING REGISTER) (31 - 35) ---
  {
    number: 31,
    prompt: "Cloze Passage: \"The novelist submitted the completed author's ---31--- to the editorial director for evaluation.\"\nChoose the most suitable word:",
    options: ["script", "manuscript", "draft", "document"],
    correctAnswer: "manuscript",
    hint: "An author's text that has not yet been published is a manuscript.",
    workedSolution: "In publishing terminology, the original unpublished text submitted by an author is the 'manuscript'.",
    points: 1
  },
  {
    number: 32,
    prompt: "Cloze Passage: \"After the initial editorial appraisal, the text was forwarded to the composing department for digital ---32---.\"\nChoose the most suitable word:",
    options: ["typing", "typesetting", "printing", "arrangement"],
    correctAnswer: "typesetting",
    hint: "The process of setting text onto a page or screen layout for printing is typesetting.",
    workedSolution: "In printing and publishing, arranging and formatting text characters for reproduction is 'typesetting'.",
    points: 1
  },
  {
    number: 33,
    prompt: "Cloze Passage: \"The galley proofs were meticulously examined by a senior ---33--- to eliminate typographical and grammatical errors.\"\nChoose the most suitable word:",
    options: ["critic", "proofreader", "journalist", "reporter"],
    correctAnswer: "proofreader",
    hint: "A person whose job is to read printer's proofs and mark errors for correction is a proofreader.",
    workedSolution: "The publishing professional dedicated to identifying typographical and grammatical errors on proofs is the 'proofreader'.",
    points: 1
  },
  {
    number: 34,
    prompt: "Cloze Passage: \"Once certified, the pages were transferred onto offset lithographic ---34--- for high-speed mechanical printing.\"\nChoose the most suitable word:",
    options: ["sheets", "plates", "rollers", "boards"],
    correctAnswer: "plates",
    hint: "In offset printing, the thin metal or plastic sheets that carry the image to be printed are plates.",
    workedSolution: "In industrial offset printing, the image carriers mounted onto printing presses are formally termed 'plates'.",
    points: 1
  },
  {
    number: 35,
    prompt: "Cloze Passage: \"The commercial publisher released five thousand copies of the revised paperback ---35--- to bookshops nationwide.\"\nChoose the most suitable word:",
    options: ["volume", "edition", "issue", "version"],
    correctAnswer: "edition",
    hint: "The form in which a book is published, or the total number of copies printed from one set of type, is an edition.",
    workedSolution: "In book publishing, a distinct printing or revised publication run is designated as an 'edition'.",
    points: 1
  },

  // --- PART B: ORAL LANGUAGE & PHONOLOGY (36 - 40) ---
  {
    number: 36,
    prompt: "Choose the word that contains the identical voiced dental fricative consonant sound as the underlined digraph in:\n\"The **wea<u>th</u>er** was inclement.\"",
    options: ["leather", "healthy", "wealthy", "method"],
    correctAnswer: "leather",
    hint: "'Weather' contains the voiced dental fricative /ð/. 'Leather' (/ˈleð.ər/) contains the exact identical voiced /ð/ sound.",
    workedSolution: "The digraph 'th' in 'weather' is pronounced /ð/. 'Leather' contains the identical voiced sound /ð/, whereas 'healthy', 'wealthy', and 'method' contain voiceless /θ/.",
    points: 1
  },
  {
    number: 37,
    prompt: "Choose the word that contains the identical centering diphthong sound as the underlined vowel in:\n\"The sentry continued to **st<u>are</u>** across the bay.\"",
    options: ["pear", "fear", "pierce", "pure"],
    correctAnswer: "pear",
    hint: "'Stare' is pronounced /steər/ with the centering diphthong /eə/. 'Pear' (/peər/) contains the identical diphthong sound.",
    workedSolution: "The word 'stare' contains the diphthong /eə/. 'Pear' shares the exact identical /eə/ sound, whereas 'fear' and 'pierce' contain /ɪə/.",
    points: 1
  },
  {
    number: 38,
    prompt: "Choose the word that shares the identical final consonant cluster sound as:\n\"The committee **acce<u>pts</u>** your proposal.\"",
    options: ["intercepts", "aspect", "plants", "stamps"],
    correctAnswer: "intercepts",
    hint: "'Accepts' terminates in the voiceless plosive-fricative cluster /pts/. 'Intercepts' (/ˌɪn.təˈsepts/) ends in the identical /pts/ cluster.",
    workedSolution: "'Accepts' terminates in the consonant cluster /pts/. 'Intercepts' shares the identical /pts/ consonant cluster ending.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which of the following words contains a SILENT consonant letter that is not voiced in standard pronunciation?",
    options: ["indict", "predict", "verdict", "strict"],
    correctAnswer: "indict",
    hint: "In this legal word meaning to formally accuse or charge with a serious crime, the letter 'c' is completely silent.",
    workedSolution: "In 'indict' (pronounced /ɪnˈdaɪt/), the consonant letter 'c' is completely silent, unlike in 'predict', 'verdict', and 'strict' where /k/ is sounded.",
    points: 1
  },
  {
    number: 40,
    prompt: "When an echo question expressing surprise or disbelief (such as \"He has resigned?\") is spoken in standard English, what intonation contour is normally used?",
    options: [
      "Falling intonation",
      "Rising intonation",
      "Rise-fall intonation",
      "Level intonation"
    ],
    correctAnswer: "Rising intonation",
    hint: "Echo questions and declarative statements transformed into questions to express surprise terminate with a rising pitch contour (↗).",
    workedSolution: "In English suprasegmental phonology, an echo question uttered to register surprise, disbelief, or request confirmation terminates with a prominent rising intonation contour (↗).",
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

const assignedTargetIndices = seedShuffle(targetKeys, 202609);

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
        prompt: "Write a formal letter to your Municipal Chief Executive (MCE), drawing attention to the deplorable condition of the public library in your municipality, and proposing at least two practical measures the municipal assembly can adopt to modernize the facility for students.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2026

The Municipal Chief Executive
Bekwai Municipal Assembly
Municipal Directorate, Bekwai

Dear Sir,

PETITION REGARDING THE DEPLORABLE STATE OF THE MUNICIPAL PUBLIC LIBRARY

On behalf of the students, basic school teachers, and reading enthusiasts of the Bekwai Municipality, I respectfully submit this petition to draw your urgent attention to the deplorable, neglected condition of our municipal public library, and to propose practical interventions to modernize the facility.

Constructed over three decades ago, our sole community library has fallen into complete disrepair. The roof leaks profusely during downpours, soaking rare reference encyclopedias and damaging wooden reading carrels. Furthermore, over eighty percent of the books on the shelves are obsolete, tattered colonial-era manuals that bear no relevance to the modern Basic Education curriculum. The facility completely lacks computer workstations, internet connectivity, and adequate lighting, rendering it virtually useless for candidates preparing for competitive national examinations like the BECE. Consequently, student patronage has dropped catastrophically, while youth loitering in town has surged.

To revitalize this critical academic sanctuary, I suggest, first, that the Municipal Assembly allocate development funds to completely reroof and rewire the library complex. Partnering with the Ghana Library Authority to restock the reading halls with modern science, mathematics, and literature textbooks will immediately restore student interest.

Secondly, the assembly should transform a section of the library into a Digital Learning and E-Resource Hub equipped with twenty desktop computers, solar backup inverters, and high-speed fiber-optic internet. This digital access will allow indigent rural students who cannot afford home computers to conduct online research and access virtual learning materials freely.

We count on your visionary leadership to invest in the intellectual future of our youth.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Students' Representative)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in a national daily newspaper on the topic: \"The Menace of Unregulated Commercial Sand-Winning in Rural Communities and Urgent Steps to Prevent Ecological Collapse in Ghana.\"",
        modelAnswer: `HEALING OUR SCARRED LAND: THE SCOURGE OF UNREGULATED SAND-WINNING
By Samuel K. Boateng, Begoro

The rapid expansion of the construction industry across Ghana's urban and peri-urban centers has ignited an insatiable demand for fine sand and gravel. While infrastructural development is vital for national progress, the unregulated, predatory extraction of sand across rural communities has unleashed an environmental catastrophe that threatens rural agriculture, water security, and human survival.

The foremost tragedy of commercial sand-winning is the ruthless destruction of fertile arable topsoil. Excavators and heavy earth-moving bulldozers strip away nutrient-rich topsoil across thousands of acres of cultivated farmland, felling productive cocoa plantations, oil palm groves, and cassava farms. Peasant farming families, who depend entirely on subsistence agriculture for survival, are displaced and left destitute without compensation. The scarred land is transformed into barren, cratered wastelands where crops can never grow again.

Secondly, illegal sand-winners excavate riverbeds and coastal sand dunes, triggering catastrophic erosion. Stripping riverbanks of their natural vegetative cover causes heavy siltation that chokes pristine freshwater streams, turning drinking water into murky sludge. Furthermore, excavated sand-winning trenches are abandoned uncovered. During torrential downpours, these deep craters fill with stagnant rainwater, becoming death traps where school children drown, as well as prolific breeding nurseries for malaria-carrying mosquitoes.

To avert total ecological collapse, the Environmental Protection Agency (EPA) and the Minerals Commission must enforce strict licensing protocols, revoking the permits of contractors who excavate without environmental reclamation bonds. Secondly, local traditional councils must stop selling communal lands to illegal sand-mining syndicates.

Our land is our sacred heritage; we must halt this environmental destruction before our fertile earth turns into a desert.`
      },
      {
        questionNumber: "3",
        category: "Narrative Moral Story",
        prompt: "Write an engaging, realistic story that illustrates the traditional proverb: \"Honesty is the best policy.\"",
        modelAnswer: `HONESTY IS THE BEST POLICY

During our final term in junior high school, my family was plunged into severe financial distress. My father had lost his job following a factory closure, and our household struggled to afford basic meals, let alone pay my final BECE registration and mock examination fees. The school bursar issued a final deadline: pay within forty-eight hours or be barred from writing the examination.

On a rainy Tuesday afternoon, while walking home from school along the muddy market road, I noticed a bulky, black leather bag lying near a drainage ditch. Picking it up and unzipping it under a shop veranda, my breath caught in my throat: the bag contained fifty thousand Ghana cedis in clean banknotes, alongside biometric passport documents and an official corporate pass belonging to a prominent commercial logistics director, Mr. Mensah.

A tempting thought flashed through my mind. This money could instantly settle my school fees, buy new uniforms, and provide food for my family for a year. No one had seen me pick it up. However, the voice of my late grandmother echoed in my conscience: "A good name is better than ill-gotten riches; honesty is always the best policy." Resolutely, I walked two kilometers to the municipal police headquarters and handed the bag to the station commander.

Two hours later, Mr. Mensah, who had lost the money while changing a flat tire, rushed into the station in tears. When the police presented his intact bag, he was overwhelmed with astonished gratitude. Moved by my integrity and learning about my family's financial hardship, Mr. Mensah did not merely give me a cash reward; he formally adopted my educational sponsorship, paying my basic and secondary school fees in full!

Walking home with my registration receipt safely in hand, my heart sang with joy. Truly, honesty is the best policy.`
      }
    ]
  },
  partB_comprehension: {
    title: "Part B: Reading Comprehension",
    instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
    passageText: `In the global economic landscape of the twenty-first century, renewable energy is universally heralded as the clean, inexhaustible salvation that will rescue human civilization from the catastrophic clutches of fossil fuel-driven climate change. Governments across the globe invest billions of dollars constructing massive solar photovoltaic arrays, offshore wind turbine farms, and geothermal power stations, aiming to drastically cut carbon dioxide emissions and decarbonize national industrial grids.

However, an objective technological and ecological appraisal reveals that the global transition to green energy harbors its own profound environmental paradox. While renewable energy sources emit virtually zero greenhouse gases during electrical power generation, the manufacturing of clean energy technology requires astronomical quantities of critical minerals and rare earth metals—most notably lithium, cobalt, nickel, and copper.

The ecological epicenter of this clean energy paradox is found in the mineral-rich tropical regions of the developing world, particularly in countries like the Democratic Republic of Congo, which produces over seventy percent of the world's commercial cobalt used in rechargeable electric vehicle batteries. Here, the insatiable global demand for battery minerals has unleashed severe environmental degradation and human suffering. Vast tracts of ancient tropical rainforests are cleared to excavate open-cast cobalt and copper mines. Acidic mine runoff and heavy metals contaminate major river basins, exterminating aquatic fauna and poisoning municipal drinking water used by rural agricultural communities.

Furthermore, the mining sector in these enclaves is heavily tainted by acute social injustice and human rights violations. Tens of thousands of artisanal miners, including impoverished adolescent boys, labor under hazardous conditions in unventilated underground tunnels without safety helmets or protective gear. Hand-digging toxic cobalt ore for meager wages, these young workers suffer frequent tunnel cave-ins, chronic respiratory diseases, and permanent physical disabilities, while foreign multinational conglomerates reap astronomical commercial profits.

Environmental ethicists conclude that a truly green energy revolution cannot be built upon the ecological destruction and human exploitation of the developing world. To achieve authentic sustainability, international manufacturers must develop closed-loop battery recycling technologies and enforce strict ethical supply-chain certifications that guarantee fair wages, safety standards, and environmental restoration at mine sites.`,
    questions: [
      {
        subQuestion: "(a)",
        question: "State two renewable energy sources mentioned in the opening paragraph of the passage.",
        answer: "Solar photovoltaic energy, offshore wind energy, and geothermal energy."
      },
      {
        subQuestion: "(b)",
        question: "What constitutes the central environmental paradox of green energy technology according to the second paragraph?",
        answer: "While renewable energy generates zero greenhouse gases during operation, manufacturing its equipment requires huge quantities of critical minerals whose extraction causes severe environmental destruction."
      },
      {
        subQuestion: "(c)",
        question: "Mention two specific hazards endured by young artisanal miners laboring in cobalt mines.",
        answer: "1. Fatal underground tunnel cave-ins.\n2. Chronic respiratory illnesses (or permanent physical disabilities from working without protective equipment)."
      },
      {
        subQuestion: "(d)",
        question: "According to the final paragraph, how can international manufacturers achieve authentic sustainability in battery production?",
        answer: "By developing closed-loop battery recycling technologies and enforcing strict ethical supply-chain certifications that ensure fair wages, safety, and environmental restoration."
      },
      {
        subQuestion: "(e)",
        question: "Explain the meaning of the following expressions as used in the passage:\nI. ... inexhaustible salvation;\nII. ... environmental paradox;\nIII. ... closed-loop battery recycling.",
        answer: "I. 'inexhaustible salvation' means a boundless, permanent solution or rescue that will never run out or be depleted.\nII. 'environmental paradox' means a contradictory situation where an initiative designed to protect the environment simultaneously causes environmental harm.\nIII. 'closed-loop battery recycling' means an industrial system where all spent battery materials are recovered and completely reused to manufacture new batteries without creating waste."
      },
      {
        subQuestion: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. heralded;\nII. insatiable;\nIII. tracts;\nIV. tainted.",
        answer: "I. heralded: proclaimed, announced, celebrated, acclaimed.\nII. insatiable: unquenchable, voracious, impossible to satisfy, boundless.\nIII. tracts: expanses, areas, regions, stretches.\nIV. tainted: stained, polluted, corrupted, marred."
      },
      {
        subQuestion: "(g)",
        question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the two major negative consequences of battery mineral mining discussed in the passage.",
        answer: "1. Mineral mining destroys rainforests and water sources.\n2. Artisanal miners endure hazardous, exploitative working conditions."
      }
    ]
  },
  partC_literature: {
    title: "Part C: Literature in English (The Beacon of Light Anthology)",
    instructions: "Answer all questions in this part based on the prescribed selections from the NaCCA Common Core Programme anthology: The Beacon of Light.",
    questions: [
      {
        sectionTitle: "CHARLES DICKENS: Oliver Twist (Chapter 2: Oliver Asks for More)",
        contextExtract: "\"Satire: the author uses sharp observations and suggestions to depict the hypocrisy of Mrs Mann, and the pride and poor judgment of the workhouse authorities. While innocent children starved, officials debated administrative rules with great self-satisfaction.\"",
        subItems: [
          {
            subQuestion: "5(a)",
            question: "How does Dickens use sharp satire to expose the hypocrisy of Mrs. Mann in Chapter 2?",
            answer: "He portrays her pretending affection and deep maternal tenderness in front of Mr. Bumble while privately embezzling the parish maintenance money and starving the orphans."
          },
          {
            subQuestion: "5(b)",
            question: "What does the board's reaction to Oliver asking for more gruel reveal about their judgment?",
            answer: "It reveals their absurd and callous judgment, treating a starving nine-year-old child's cry for basic nourishment as a treasonous act of rebellion that will lead to the gallows."
          }
        ]
      },
      {
        sectionTitle: "CONTEMPORARY DRAMA: Spreading Light",
        contextExtract: "\"SIR NII: (Addressing the gathering in the illuminated classroom square) Tonight, the darkness in our pathways has been pushed back, not by spells or complaints, but by the dedication of our own pupils.\nUNCLE ATO: We doubted them because they were young, but their light shines for us all.\"",
        subItems: [
          {
            subQuestion: "5(c)",
            question: "What major transformation in community attitude occurs during this closing scene of the play?",
            answer: "The village elders move from initial skepticism and gender bias to full respect and gratitude for youth-led scientific innovation."
          },
          {
            subQuestion: "5(d)",
            question: "What does Sir Nii mean when he states that darkness was pushed back 'not by spells or complaints, but by dedication'?",
            answer: "He means that practical societal development requires empirical scientific action, hard work, and persistence rather than passive complaints or traditional superstitions."
          }
        ]
      },
      {
        sectionTitle: "HISTORICAL POETRY: The Golden Stool / Okomfo Anokye",
        contextExtract: "\"It bridged the ancient feuds of clan and crown,\nA sacred bond descending softly down;\nNo longer scattered voices in the night,\nOne nation forged in ancestral light.\"",
        subItems: [
          {
            subQuestion: "5(e)",
            question: "How did the Golden Stool function as an instrument of conflict resolution according to these lines?",
            answer: "It dissolved historical rivalries and tribal feuds among competing Akan clans by providing a shared, sacred symbol that bound all chiefs into a single united confederacy."
          },
          {
            subQuestion: "5(f)",
            question: "Explain the metaphor 'One nation forged in ancestral light'.",
            answer: "It compares the founding of the unified Ashanti Kingdom to metal forged in a furnace, illuminated and legitimized by ancestral spiritual favor."
          }
        ]
      },
      {
        sectionTitle: "PHILOSOPHICAL POETRY: The Unseen Painter",
        contextExtract: "\"Mixing every shade of skin\nTo show that in His gallery,\nAll hues belong within;\nNo single brushstroke claims the light,\nNo pigment owns the frame.\"",
        subItems: [
          {
            subQuestion: "5(g)",
            question: "Deconstruct the extended metaphor comparing human society to an art gallery.",
            answer: "Humanity is depicted as an expansive art exhibition where diverse ethnic and racial groups are intentional, harmonious colors placed on the same canvas by the Creator."
          },
          {
            subQuestion: "5(h)",
            question: "What social justice principle is communicated by the line: 'No single brushstroke claims the light'?",
            answer: "The principle of universal human equality: no single race, ethnic group, or social class holds a monopoly on human dignity, truth, or divine favor."
          }
        ]
      },
      {
        sectionTitle: "PROSE NARRATIVE: Beyond Light and Shadow",
        contextExtract: "\"The school’s transformation was like a phoenix rising from the ashes, forged in the hearts of its students. The shadow of Ashes Flame was broken, and Cedar of Lebanon stood tall once again, bathed in the light of truth and renewal.\"",
        subItems: [
          {
            subQuestion: "5(i)",
            question: "Identify the simile in the extract and explain what it illustrates about Cedar of Lebanon School.",
            answer: "Simile: 'like a phoenix rising from the ashes'. It illustrates the school's complete moral and institutional rebirth out of the ruin and corruption caused by the Ashes Flame syndicate."
          },
          {
            subQuestion: "5(j)",
            question: "How does the final revitalization of the school fulfill the overarching title of the narrative?",
            answer: "It completes the journey from the 'shadow' of fear, intimidation, and secrecy into the 'light' of truth, courage, community empowerment, and academic renewal."
          }
        ]
      }
    ]
  }
};

async function seedBeceEnglishMock9() {
  console.log("Seeding Isolated BECE English Mock 9 into Firestore with Beacon of Light curriculum...");

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

  // Strictly partitioned path: subjects/english/mocks/mock_9
  const docRef = db.doc("global_curriculum/jhs/subjects/english/mocks/mock_9");
  await docRef.set({
    mockId: "mock_9",
    mockNumber: 9,
    title: "BECE English Language National Mock Examination 9",
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
          title: "Section E: Publishing and Printing Cloze Passage",
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

  console.log("✅ BECE English Mock 9 successfully updated with Beacon of Light at subjects/english/mocks/mock_9!");
}

seedBeceEnglishMock9()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed BECE English Mock 9:", err);
    process.exit(1);
  });
