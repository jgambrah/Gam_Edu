import * as dns from 'dns';
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
process.env.GCLOUD_PROJECT = 'gamedu-69888475-f5783';
process.env.GOOGLE_CLOUD_PROJECT = 'gamedu-69888475-f5783';

import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function getDb() {
  const fbAdmin = (admin as any).default || admin;
  try {
    const { OAuth2Client } = req('google-auth-library');
    const { Firestore } = req('@google-cloud/firestore');
    const configPath = 'C:\\Users\\DELL\\.config\\configstore\\firebase-tools.json';
    if (fs.existsSync(configPath)) {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (cfg?.tokens?.access_token) {
        const oauthClient = new OAuth2Client();
        oauthClient.setCredentials({ access_token: cfg.tokens.access_token });
        return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient, ignoreUndefinedProperties: true });
      }
    }
  } catch (e) {
    console.log("Fallback from token config:", e);
  }

  if (!fbAdmin.apps?.length) {
    fbAdmin.initializeApp({ credential: fbAdmin.credential.applicationDefault() });
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
}

// 40 Concept-Mapped, Calibrated Items for BECE English June 2026
const rawQuestions = [
  // --- PART A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "After the bitter domestic dispute, Awo refused to reconcile ...... her elder brother.",
    options: ["to", "with", "by", "for"],
    correctAnswer: "with",
    hint: "Identify the preposition that regularly collocates with the verb 'reconcile' when referring to a person.",
    workedSolution: "In standard English grammar, one reconciles 'with' another person ('reconcile with her brother').",
    points: 1
  },
  {
    number: 2,
    prompt: "The neighbor's hunting dog ...... quietly in our kitchen throughout last night.",
    options: ["lain", "lied", "laid", "lay"],
    correctAnswer: "lay",
    hint: "Past tense of the intransitive verb 'lie' (to rest or recline): lie - lay - lain. ('Laid' is the past of transitive 'lay' - to place something down).",
    workedSolution: "The verb 'lie' (meaning to recline or rest horizontally) has the principal parts: lie - lay - lain. In the simple past tense, the correct form is 'lay'.",
    points: 1
  },
  {
    number: 3,
    prompt: "Your parents' social status is not inferior ...... mine in any way.",
    options: ["to", "with", "from", "than"],
    correctAnswer: "to",
    hint: "Latin comparative adjectives ending in '-ior' (inferior, superior, senior, junior) take 'to', never 'than'.",
    workedSolution: "Adjectives of Latin origin ending in '-ior' (such as 'inferior', 'superior') take the preposition 'to', never 'than'.",
    points: 1
  },
  {
    number: 4,
    prompt: "Following the police investigation, it turned ...... that the suspect was the pastor's son.",
    options: ["out", "up", "around", "down"],
    correctAnswer: "out",
    hint: "Identify the phrasal verb meaning to be revealed or prove to be the case.",
    workedSolution: "The phrasal verb 'to turn out' means to prove to be the case or be revealed in the end ('it turned out that...').",
    points: 1
  },
  {
    number: 5,
    prompt: "Nobody will live on this physical earth forever, ......?",
    options: ["will they", "won't they", "do they", "don't they"],
    correctAnswer: "will they",
    hint: "Negative indefinite pronouns ('nobody', 'no one') make the statement negative and take the plural pronoun 'they' with an affirmative tag.",
    workedSolution: "'Nobody' is grammatically negative and is replaced by the pronoun 'they' in question tags. A negative statement takes an affirmative tag: 'will they?'.",
    points: 1
  },
  {
    number: 6,
    prompt: "Most contemporary travelers now enjoy ...... by commercial air flights.",
    options: ["travelled", "travelling", "to travel", "to travelling"],
    correctAnswer: "travelling",
    hint: "The transitive verb 'enjoy' requires a gerund complement (verb-ing), not an infinitive.",
    workedSolution: "In standard English verb catenation, the verb 'enjoy' is followed by a gerund ('enjoy travelling').",
    points: 1
  },
  {
    number: 7,
    prompt: "A persistently crying infant does not allow its nursing parents ...... enough restful sleep.",
    options: ["to have", "to have had", "had", "have"],
    correctAnswer: "to have",
    hint: "The verb 'allow' takes an object followed by a full to-infinitive.",
    workedSolution: "The catenative pattern for 'allow' when taking an object is 'allow + object + to-infinitive' ('allow its parents to have').",
    points: 1
  },
  {
    number: 8,
    prompt: "The young scholar received a national academic prize ............",
    options: [
      "the very first for time",
      "very first for the time",
      "first for the very time",
      "for the very first time"
    ],
    correctAnswer: "for the very first time",
    hint: "Identify the standard prepositional phrase idiom indicating an unprecedented occurrence.",
    workedSolution: "The standard English idiomatic prepositional phrase is 'for the very first time'.",
    points: 1
  },
  {
    number: 9,
    prompt: "May I please have ...... sugar in my morning corn porridge?",
    options: ["few more", "little more", "a few more", "a little more"],
    correctAnswer: "a little more",
    hint: "'Sugar' is an uncountable non-count noun. In a polite request seeking a positive small amount, use 'a little'.",
    workedSolution: "'Sugar' is an uncountable mass noun. 'A little more' expresses a positive, modest additional quantity. 'Few' applies only to countable nouns.",
    points: 1
  },
  {
    number: 10,
    prompt: "I wish our school bus driver ...... earlier than usual today.",
    options: ["returned", "returns", "has returned", "is returning"],
    correctAnswer: "returned",
    hint: "Subjunctive mood: An unfulfilled hypothetical wish regarding a present/future state requires the simple past tense.",
    workedSolution: "Following 'wish' to express an unrealized desire in the present, English requires the past subjunctive form ('returned').",
    points: 1
  },
  {
    number: 11,
    prompt: "All registered candidates will ...... the national entrance examination next month.",
    options: ["sit", "sitting", "seat", "set"],
    correctAnswer: "sit",
    hint: "The future modal auxiliary 'will' is followed by the bare base verb 'sit' (to sit for / sit an examination).",
    workedSolution: "The modal auxiliary 'will' takes a bare infinitive. One 'sits' an examination. 'Seat' is a transitive verb meaning to cause someone to sit.",
    points: 1
  },
  {
    number: 12,
    prompt: "The herd of oxen ...... peacefully in the green pasture since early morning.",
    options: [
      "have been grazing",
      "is being grazed",
      "are being grazed",
      "has been grazing"
    ],
    correctAnswer: "have been grazing",
    hint: "'Oxen' is an irregular plural noun (plural of 'ox'). An ongoing action from morning to now requires the Present Perfect Continuous plural.",
    workedSolution: "'Oxen' is an irregular plural noun. Combined with 'since morning', it requires the plural Present Perfect Continuous auxiliary: 'have been grazing'.",
    points: 1
  },
  {
    number: 13,
    prompt: "...... the candidate arrived late at the examination hall, he was admitted by the supervisor.",
    options: ["Since", "Though", "As", "Even"],
    correctAnswer: "Though",
    hint: "Identify the subordinating conjunction of concession that introduces a contrasting clause.",
    workedSolution: "'Though' (or 'Although') is a concessive conjunction introducing a subordinate clause contrasting with the main clause.",
    points: 1
  },
  {
    number: 14,
    prompt: "Choose the correct reported speech for:\n\"I can't help you now, but I'll call later,\" Afua informed Ayuba.\nAfua informed Ayuba that she couldn't help ............",
    options: [
      "him now but would call him later",
      "him then but would call him later",
      "you now but will call you later",
      "you then but would call you later"
    ],
    correctAnswer: "him then but would call him later",
    hint: "In reported speech, 'can't' becomes 'couldn't', 'you' becomes 'him', 'now' shifts to 'then', and 'will' shifts to 'would'.",
    workedSolution: "In indirect reported speech governed by the past verb 'informed', pronouns shift to third person ('him'), time shifts from 'now' to 'then', and 'will' backshifts to 'would'.",
    points: 1
  },
  {
    number: 15,
    prompt: "Choose the correct passive voice transformation for:\n\"The teacher gave the pupils their marked books.\"",
    options: [
      "Their marked books had been given to the pupils by the teacher",
      "Their marked books have been given to the pupils by the teacher",
      "The pupils are given their marked books by the teacher",
      "The pupils were given their marked books by the teacher"
    ],
    correctAnswer: "The pupils were given their marked books by the teacher",
    hint: "The active verb 'gave' is in the simple past tense. Its passive equivalent using the indirect object as subject is 'were given'.",
    workedSolution: "The active sentence is simple past ('gave'). When the indirect object 'The pupils' becomes the grammatical subject, the passive form is 'were given their marked books by the teacher'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "Gold and salt trade flourished throughout ancient Ghana.\nChoose the word nearest in meaning to the underlined word 'flourished'.",
    options: ["spread", "started", "boomed", "increased"],
    correctAnswer: "boomed",
    hint: "Thrived, prospered, and grew vigorously with great economic success.",
    workedSolution: "'Flourished' means grew vigorously, thrived, or prospered; 'boomed' is its closest synonym in economic trade contexts.",
    points: 1
  },
  {
    number: 17,
    prompt: "Basic school candidates should strive to achieve academic excellence.\nChoose the word nearest in meaning to the underlined word 'strive'.",
    options: ["steal", "work", "endeavour", "endure"],
    correctAnswer: "endeavour",
    hint: "To make strenuous, determined efforts toward an objective.",
    workedSolution: "'Strive' means to make great, earnest efforts to achieve something; 'endeavour' is its exact equivalent.",
    points: 1
  },
  {
    number: 18,
    prompt: "The union supporters vehemently protested against their leader's unlawful detention.\nChoose the word nearest in meaning to the underlined word 'vehemently'.",
    options: ["forcefully", "loudly", "angrily", "dangerously"],
    correctAnswer: "forcefully",
    hint: "In a forceful, passionate, intense, or vigorous manner.",
    workedSolution: "'Vehemently' means showing strong, passionate, or forceful conviction and intensity; 'forcefully' is its direct synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "It is my lifelong ambition to become a biomedical engineer in Ghana.\nChoose the word nearest in meaning to the underlined word 'ambition'.",
    options: ["calling", "decision", "aspiration", "career"],
    correctAnswer: "aspiration",
    hint: "A strong desire, yearning, or aim to achieve something honorable.",
    workedSolution: "'Ambition' refers to a strong desire or goal to achieve success or distinction; 'aspiration' is its exact synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "The agitated factory workers scheduled an emergency meeting to address wage cuts.\nChoose the word nearest in meaning to the underlined word 'agitated'.",
    options: ["tired", "upset", "excited", "suffering"],
    correctAnswer: "upset",
    hint: "Troubled, disturbed, flustered, or emotionally stirred up.",
    workedSolution: "'Agitated' means feeling or appearing troubled, nervous, or emotionally stirred up; 'upset' is its closest synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "Joe is notorious for always building castles in the air. This means that Joe always ............",
    options: [
      "expresses his political views openly and frankly",
      "has unrealistic goals that are impossible to achieve",
      "performs extraordinary deeds that everyone talks about",
      "chooses to travel exclusively by aircraft"
    ],
    correctAnswer: "has unrealistic goals that are impossible to achieve",
    hint: "Indulging in daydreaming and unrealistic fantasies.",
    workedSolution: "The idiom 'to build castles in the air' means to create daydreams, impractical plans, or goals that cannot be realized.",
    points: 1
  },
  {
    number: 22,
    prompt: "Disciplined individuals should not allow anger to have the better of them. This means we should not let anger ............",
    options: ["deceive us", "divide us", "keep us sad", "control us"],
    correctAnswer: "control us",
    hint: "To gain dominance, control, or mastery over someone.",
    workedSolution: "The idiom 'to have the better of someone' means to overcome, defeat, or gain mastery and control over them.",
    points: 1
  },
  {
    number: 23,
    prompt: "The military patrol's visit to the border town kept all residents on their toes. This means the visit ............",
    options: [
      "made them run into the forest",
      "motivated them to clear their farms",
      "caused them to be watchful, vigilant, and alert",
      "filled them with wild excitement"
    ],
    correctAnswer: "caused them to be watchful, vigilant, and alert",
    hint: "Alert, watchful, and prepared for immediate action.",
    workedSolution: "The idiom 'on one's toes' means alert, watchful, vigilant, and ready for any eventuality.",
    points: 1
  },
  {
    number: 24,
    prompt: "Foli and Asare decided to bury the hatchet after years of dispute. This means they decided to ............",
    options: [
      "hide their true emotional feelings",
      "keep their future plans secret",
      "end their quarrel and become peaceful friends again",
      "fight in a duel to determine the victor"
    ],
    correctAnswer: "end their quarrel and become peaceful friends again",
    hint: "To make peace, resolve differences, and settle a dispute.",
    workedSolution: "The idiom 'to bury the hatchet' means to settle grievances, cease hostilities, and make peace.",
    points: 1
  },
  {
    number: 25,
    prompt: "The senior prefect showed his true colours immediately after his election. This means that he ............",
    options: [
      "delivered an impressive victory address",
      "revealed his real, authentic character and intentions",
      "became excessively conceited and proud",
      "began working with extra dedication"
    ],
    correctAnswer: "revealed his real, authentic character and intentions",
    hint: "Revealing one's genuine character, motives, or disposition.",
    workedSolution: "The idiom 'to show one's true colours' means to reveal one's true nature, character, or hidden attitudes.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "The obsolete mechanical equipment should be disposed of forthwith, instead of ...... .",
    options: ["next", "suddenly", "immediately", "later"],
    correctAnswer: "later",
    hint: "'Forthwith' means immediately, without delay. Find the temporal antonym meaning at a subsequent time.",
    workedSolution: "'Forthwith' means without delay or immediately. Its direct temporal antonym is 'later' (at a subsequent time).",
    points: 1
  },
  {
    number: 27,
    prompt: "It was difficult to ascertain when the torrential storm began or where it ...... .",
    options: ["remained", "resided", "ceased", "felled"],
    correctAnswer: "ceased",
    hint: "'Began' means started. Find the word that denotes stopped or came to an end.",
    workedSolution: "'Began' means started or commenced. Its direct antonym regarding occurrence is 'ceased' (stopped or terminated).",
    points: 1
  },
  {
    number: 28,
    prompt: "The fiscal measures introduced by the municipal assembly have adverse rather than ...... effects on traders.",
    options: ["positive", "profitable", "beneficial", "harmless"],
    correctAnswer: "beneficial",
    hint: "'Adverse' means harmful, unfavorable, or detrimental. Find the word meaning advantageous and favorable.",
    workedSolution: "'Adverse' means harmful or unfavorable. Its direct antonym in describing policy outcomes is 'beneficial' (advantageous).",
    points: 1
  },
  {
    number: 29,
    prompt: "Ecological zones with abundant rainfall differ sharply from semi-arid lands having ...... moisture.",
    options: ["scanty", "uncertain", "negative", "reduced"],
    correctAnswer: "scanty",
    hint: "'Abundant' means plentiful. Find the word meaning scarce, meager, or barely sufficient.",
    workedSolution: "'Abundant' means existing in plentiful supply. Its direct antonym in measurement is 'scanty' (meager, sparse, or scarce).",
    points: 1
  },
  {
    number: 30,
    prompt: "Certain engineering formulas seem simple in theoretical calculations, but exceedingly complex in ...... execution.",
    options: ["natural", "practical", "actual", "logical"],
    correctAnswer: "practical",
    hint: "'Theoretical' deals with abstract ideas. Find the word denoting real-world application and practice.",
    workedSolution: "'Theoretical' relates to concepts and ideas. Its direct antonym in scientific disciplines is 'practical' (dealing with hands-on practice).",
    points: 1
  },

  // --- CLOZE PASSAGE: ICT & SOCIAL MEDIA (31 - 35) ---
  {
    number: 31,
    prompt: "In the cloze passage:\n'One ---31--- that makes access to social media very easy is the mobile phone.'\nChoose the most suitable word:",
    options: ["tool", "gadget", "infrastructure", "facility"],
    correctAnswer: "gadget",
    hint: "A small mechanical or electronic device with a practical use.",
    workedSolution: "A smartphone or mobile telephone is specifically classified as an electronic 'gadget' or handheld device.",
    points: 1
  },
  {
    number: 32,
    prompt: "In the cloze passage:\n'A common ---32--- used is WhatsApp.'\nChoose the most suitable word:",
    options: ["basic", "framework", "page", "platform"],
    correctAnswer: "platform",
    hint: "A major software architecture, service, or digital environment on which applications run.",
    workedSolution: "WhatsApp and social networks operate as digital communication 'platforms'.",
    points: 1
  },
  {
    number: 33,
    prompt: "In the cloze passage:\n'One can read ---33--- from friends and family here.'\nChoose the most suitable word:",
    options: ["messages", "jokes", "chats", "reports"],
    correctAnswer: "messages",
    hint: "Dispatches, communications, or SMS text sent between individuals.",
    workedSolution: "Textual communications received from contacts on messaging applications are formally known as 'messages'.",
    points: 1
  },
  {
    number: 34,
    prompt: "In the cloze passage:\n'One can also watch videos of ---34---, but then...'\nChoose the most suitable word:",
    options: ["serials", "adverts", "events", "games"],
    correctAnswer: "events",
    hint: "Public occasions, celebrations, ceremonies, or happenings recorded on video.",
    workedSolution: "Videos circulating on social networks typically document real-world occasions, ceremonies, and 'events'.",
    points: 1
  },
  {
    number: 35,
    prompt: "In the cloze passage:\n'...but then, one must have ---35--- connection to enjoy these.'\nChoose the most suitable word:",
    options: ["credit", "bundle", "internet", "units"],
    correctAnswer: "internet",
    hint: "The global telecommunication network connecting computers and mobile phones.",
    workedSolution: "Accessing digital video streams and web services requires an active 'internet' connection.",
    points: 1
  },

  // --- PART B: ORAL LANGUAGE & PHONOLOGY (36 - 40) ---
  {
    number: 36,
    prompt: "Choose the word which has the same vowel sound as the underlined word in:\n'The athletes were fit and ready for the games.' (Word: fit /ɪ/)",
    options: ["riot", "whim", "heat", "laid"],
    correctAnswer: "whim",
    hint: "Short close front unrounded vowel /ɪ/, as in 'bit', 'sit', 'fit', and 'whim'.",
    workedSolution: "'Fit' contains the short monophthong vowel /ɪ/. Among the options, 'whim' (/wɪm/) has the exact same /ɪ/ vowel sound. ('Riot' has /aɪə/, 'heat' has /iː/, 'laid' has /eɪ/).",
    points: 1
  },
  {
    number: 37,
    prompt: "Choose the word which has the same vowel sound as the underlined word in:\n'The march to the Revolution Square was a slow one.' (Word: march /ɑː/)",
    options: ["huts", "chap", "batch", "heart"],
    correctAnswer: "heart",
    hint: "Long open back unrounded vowel /ɑː/, as in 'car', 'part', 'march', and 'heart'.",
    workedSolution: "'March' has the long vowel sound /ɑː/. 'Heart' (/hɑːt/) contains the identical /ɑː/ sound. ('Huts' has /ʌ/, 'chap' and 'batch' have /æ/).",
    points: 1
  },
  {
    number: 38,
    prompt: "Choose the word which has the same final consonant cluster sound as the underlined word in:\n'Salts of different textures were on display.' (Final sound: /-lts/)",
    options: ["sands", "stalls", "carts", "cults"],
    correctAnswer: "cults",
    hint: "Consonant cluster consisting of lateral /l/ + voiceless alveolar plosive /t/ + voiceless alveolar fricative /s/: /-lts/.",
    workedSolution: "'Salts' ends with the consonant cluster /-lts/. Among the options, 'cults' (/kʌlts/) terminates in the identical final cluster /-lts/. ('Carts' ends in /-ts/, 'stalls' in /-lz/).",
    points: 1
  },
  {
    number: 39,
    prompt: "Choose the word which has the same final consonant cluster sound as the underlined word in:\n'Nenyi is good in sprints.' (Final sound: /-nts/)",
    options: ["stints", "skills", "shrills", "springs"],
    correctAnswer: "stints",
    hint: "Consonant cluster consisting of nasal /n/ + plosive /t/ + fricative /s/: /-nts/.",
    workedSolution: "'Sprints' terminates in the consonant cluster /-nts/. 'Stints' (/stɪnts/) possesses the identical final consonant sound cluster /-nts/.",
    points: 1
  },
  {
    number: 40,
    prompt: "In spoken English, when the declarative utterance \"He is here.\" is delivered using a prominent rising tone, what speaker attitude is conveyed?",
    options: ["Determination", "Emphasis", "Certainty", "Doubt"],
    correctAnswer: "Doubt",
    hint: "A declarative clause spoken with a rising pitch contour typically functions as an echo question expressing surprise, disbelief, or doubt.",
    workedSolution: "In English intonation, applying a rising tone to a declarative statement transforms it into a question indicating disbelief, skepticism, query, or 'Doubt'.",
    points: 1
  }
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

const assignedTargetIndices = seedShuffle(targetKeys, 202606);

const balancedPaper1 = rawQuestions.map((q, idx) => {
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

// ==========================================
// PAPER 2: THEORY, COMPREHENSION & LITERATURE
// ==========================================
const paper2Calibrated = {
  partA_writing: {
    title: "Part A: Essay Writing [30 Marks]",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Informal Letter",
        prompt: "You are not allowed to watch television after seven o'clock in the evening, but your favorite educational program is broadcast at that time. Write a persuasive letter to your father asking for an extension of the curfew and giving two distinct benefits you will gain from the program.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Bekwai, Ashanti Region
12th June, 2026

Dear Father,

I hope this letter finds you in fine health and peace of mind after your busy work schedule. I write with deep humility and respect to appeal for an adjustment to our household evening schedule, specifically requesting a thirty-minute extension of my television curfew on Wednesday evenings from 7:00 p.m. to 7:30 p.m.

I am fully mindful of your rule forbidding television viewing after seven o'clock to ensure my siblings and I concentrate on evening private studies. However, the Ghana Broadcasting Corporation telecasts the National Junior Science and Mathematics Challenge precisely between 7:00 p.m. and 7:30 p.m. every Wednesday. This program offers immense academic benefits that directly support my preparation for the Basic Education Certificate Examination (BECE).

First, the program demonstrates practical laboratory experiments and simplifies complex topics in Integrated Science and Mathematics, such as genetics, chemical equations, and plane geometry. Watching top students solve complex quiz questions under timed conditions has sharpened my mental speed and boosted my confidence in solving quantitative problems.

Secondly, the program features a specialized career segment where medical practitioners, software engineers, and agricultural scientists discuss emerging career paths and mentor viewers. Since my dream is to study biomedical engineering at the university, this segment provides invaluable guidance on secondary school subject selection.

I promise to complete all my domestic chores and school homework before 6:30 p.m. on Wednesdays and resume private reading immediately at 7:30 p.m.

Thank you for your fatherly consideration and continuous investment in my education.

Your loving son,
[Signature]
Kwaku Mensah Boateng`
      },
      {
        questionNumber: "2",
        category: "Debate Speech",
        prompt: "Your school has qualified for the 2026 National Debate Competition. As the main speaker of your school's debate team, write your speech for or against the motion: \"The Basic Education Certificate Examination (BECE) should be abolished.\"",
        modelAnswer: `AGAINST THE MOTION: "THE BASIC EDUCATION CERTIFICATE EXAMINATION SHOULD BE ABOLISHED"

Mr. Chairman, Distinguished Panel of Judges, Impartial Timekeeper, Worthy Opponents, and Fellow Students:

I stand firmly before you this morning to vehemently oppose the motion that: "The Basic Education Certificate Examination (BECE) should be abolished." National standardized assessment is the indispensable anchor of academic accountability and meritocracy in our educational system.

First and foremost, the BECE serves as an objective, centralized national benchmark for evaluating learning outcomes across basic schools. Without a standardized national examination conducted by the West African Examinations Council (WAEC), it would be impossible to assess whether schools in remote rural districts and well-endowed urban academies meet the National Pre-tertiary Curriculum Framework standards. Relying solely on internal, school-based assessments would open the floodgates to subjective grading, institutional favoritism, and rampant grade inflation, making fair placement into Senior High Schools completely impossible.

Secondly, the BECE instills scholastic discipline, rigorous revision habits, and intellectual resilience in learners. Preparing for an external examination compels students to read extensively, complete past questions, and master core competencies in numeracy and literacy. Abolishing the examination would foster academic lethargy, leading to a catastrophic collapse in reading habits and student effort.

Furthermore, the examination acts as an equitable, merit-based selection filter for secondary school placement through the Computerized School Selection and Placement System (CSSPS), guaranteeing that a brilliant peasant farmer's child earns admission into premier secondary institutions purely on academic merit.

In conclusion, standardized testing provides the quality assurance our educational architecture requires. Rather than abolishing the BECE, we should modernize and digitize its delivery. I urge you all to reject the motion resoundingly.

Thank you.`
      },
      {
        questionNumber: "3",
        category: "Descriptive Narrative",
        prompt: "Your best vacation was when you visited a friend in another part of the country. Describe two major cultural, environmental, or infrastructural differences you noticed between his or her community and your own.",
        modelAnswer: `AN ENLIGHTENING HOLIDAY IN COASTAL CAPE COAST

During the recent Easter vacation, I had the privilege of traveling from my home in the agrarian forest town of Mampong in the Ashanti Region to visit my friend, Kwesi, in the historic coastal municipality of Cape Coast. That holiday remains the most memorable vacation of my life because of two striking environmental and cultural contrasts between his coastal community and my inland hometown.

The most dramatic difference was the physical landscape and prevailing economic vocation. While Mampong is surrounded by undulating hills, emerald cocoa plantations, and freshwater streams where farming is the dominant occupation, Cape Coast greeted me with the majestic Atlantic Ocean, vast sandy beaches, and coconut groves. The air was cool and salty, filled with the roar of crashing surf. Instead of tractors and farm barns, Cape Coast's shoreline was crowded with hundreds of colorful wooden canoes. I spent mornings watching fishermen haul heavy fishing nets and listening to rhythmic Fante sea songs—a marine livelihood totally alien to our farming hamlet.

Secondly, the architectural heritage and historical atmosphere presented a profound contrast. In Mampong, our buildings are modern brick structures arranged around traditional family courtyards. In Cape Coast, however, the town center is a living museum of colonial history, dotted with 17th-century European stone buildings, merchant quarters, and the imposing white ramparts of Cape Coast Castle. Walking along ancient cobblestone streets surrounded by historical Asafo warrior company shrines gave the town a solemn, historical grandeur that broadened my understanding of Ghanaian history.

That visit taught me that Ghana's true beauty lies in the rich diversity of our landscapes and heritage.`
      }
    ]
  },

  partB_reading_comprehension: {
    title: "Part B: Reading Comprehension & Summary [20 Marks]",
    passageText: `There is a very interesting debate going on in the society. It is between two main groups: the older and younger generations. The former claim that they are not happy with the behaviour and general comportment of the latter.

According to the older generation, the mode of dressing and the mannerisms of the younger ones are appalling. They cite the case of the male youngsters who wear their trousers so low as to expose their pants and waists. They also say that the case of the young females is even worse as they wear dresses which expose their vital parts. This, according to the older generation, usually gets them into trouble. In sum, the accusation against the younger ones is that they lead carefree lives and snub the advice of their parents and guardians.

The younger generation reply to all these criticisms rather politely, for obvious reasons. Their argument is that the members of the older generation are not being fair to them. Their main point is that their parents and guardians should accept the fact that times have changed and the days of the older generation are gone. They even make fun of the hairstyles and clothes of their parents and guardians in family albums. However, they are quick to admit that the mode of dressing and haircuts was acceptable in those days.

All said and done, the difference between the two generations will always be there; and it should not create any problem. Parents and guardians will just have to continue to give advice and directions to the young ones to save them from all sorts of vices. The plea of the youth is that the elders should be patient enough to give them good reasons and explanations for pieces of advice they give.`,
    questions: [
      {
        questionId: "4(a)",
        prompt: "According to the older generation, what could be the effect of the young females' mode of dressing?",
        answer: "According to the older generation, wearing dresses that expose their vital parts usually gets the young females into serious trouble (such as sexual harassment, social victimization, and moral danger)."
      },
      {
        questionId: "4(b)",
        prompt: "How do the younger ones tease their elders?",
        answer: "The younger generation tease their elders by making fun of the outdated hairstyles and old-fashioned clothes worn by their parents and guardians in old family photograph albums."
      },
      {
        questionId: "4(c)",
        prompt: "In what two ways do the younger ones defend themselves against what the older ones say against them?",
        answer: "First, they argue that times have evolved and the era of the older generation is gone. Second, they assert that the elders' criticisms are unfair and plead that elders should provide logical reasons and explanations rather than rigid commands."
      },
      {
        questionId: "4(d)",
        prompt: "\"The difference ... will always be there\"\nWhat does this statement mean for the future?",
        answer: "This means that the generation gap in perspectives, fashion, and social attitudes between the old and the young is a permanent, natural reality that will continue to exist in every human era."
      },
      {
        questionId: "4(e)",
        prompt: "Explain in your own words the following expressions as used in the passage:\n(i) the mode of dressing;\n(ii) obvious reasons;\n(iii) all said and done.",
        answer: "(i) the mode of dressing: the style, manner, or fashion of wearing clothes.\n(ii) obvious reasons: clear, self-evident considerations (such as cultural respect for elders and filial dependence).\n(iii) all said and done: when everything has been considered, weighed, or concluded."
      },
      {
        questionId: "4(f)",
        prompt: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\n(i) appalling;\n(ii) expose;\n(iii) vital;\n(iv) snub.",
        answer: "(i) appalling: shocking, dreadful, terrible, disgusting, or repulsive.\n(ii) expose: reveal, uncover, bare, or display.\n(iii) vital: sensitive, intimate, private, or delicate.\n(iv) snub: ignore, disregard, reject, scorn, or brush aside."
      },
      {
        questionId: "4(g)",
        prompt: "In two sentences of not more than eight words each, summarize the accusations against the younger generation.",
        answer: "Sentence 1: The youth dress indecently and provocatively. (7 words)\nSentence 2: They live recklessly and ignore parental advice. (7 words)"
      }
    ]
  },

  partC_literature: {
    title: "Part C: Literature-in-English [10 Marks]",
    instructions: "Answer all questions in this part based on the prescribed text 'The Cockcrow'.",
    questions: [
      {
        questionId: "5(a)",
        textSource: "AMA ATAA AIDOO: The Dilemma of a Ghost",
        prompt: "What are Petu, Akroma and the gong man doing in the extract?",
        answer: "They are performing an ancient ancestral spiritual cleansing, purification, and libation ritual to sanctify the family house and welcome the ancestors."
      },
      {
        questionId: "5(b)",
        textSource: "AMA ATAA AIDOO: The Dilemma of a Ghost",
        prompt: "The extract in brackets is an example of dramatic instructions called ............",
        answer: "Stage directions."
      },
      {
        questionId: "5(c)",
        textSource: "MERRILE CORNEY: Debbie, Sandy and Pepe\n\"Are not five sparrows sold for two pennies? Yet not one of them is forgotten by God.\"",
        prompt: "Where are the above words written?",
        answer: "The words are written in the Holy Bible (in the Gospel of Saint Luke, Chapter 12, Verse 6)."
      },
      {
        questionId: "5(d)",
        textSource: "MERRILE CORNEY: Debbie, Sandy and Pepe",
        prompt: "How does reading the words in the extract affect Debbie?",
        answer: "Reading the words comforts Debbie, giving her reassurance and spiritual peace that God cares for all creatures, including her little orphaned bird, Pepe."
      },
      {
        questionId: "5(e)",
        textSource: "THERESA ENNIN: Makola\n\"The runny-nose baby at her back is supported with a faded ATL cloth.\"",
        prompt: "Whose baby is mentioned in the above expression?",
        answer: "The baby of a poor, struggling market head porter ('kayayo' or street vendor mother) in Makola Market."
      },
      {
        questionId: "5(f)",
        textSource: "THERESA ENNIN: Makola",
        prompt: "A picture of ............ is painted in the above expression.",
        answer: "Poverty, economic deprivation, struggle, and urban hardship."
      },
      {
        questionId: "5(g)",
        textSource: "KOBENA EYI ACQUAH: A Wreath of Tears",
        prompt: "The poem is a tribute to ............",
        answer: "A departed friend, relative, or fallen comrade who died prematurely."
      },
      {
        questionId: "5(h)",
        textSource: "KOBENA EYI ACQUAH: A Wreath of Tears\n\"from the garden of memory suddenly blooming as with first rains\"",
        prompt: "What does the underlined phrase refer to?",
        answer: "It refers to the vivid, sudden resurgence of fond memories and thoughts of the deceased brought back into the poet's consciousness."
      },
      {
        questionId: "5(i)",
        textSource: "KAAKYIRE AKOSOMO NYANTAKYI: The Generous Hunter\n\"'Come with me, Mr Hunter,' the snake said. Asempa obeyed. The snake showed him a yellowish-green leaf.\"",
        prompt: "How did the yellowish-green leaf help Asempa at the end of the story?",
        answer: "Asempa used the medicinal juice squeezed from the yellowish-green leaf to neutralize snake venom and cure the poisoned chief's daughter, saving her life and earning freedom and immense royal wealth."
      },
      {
        questionId: "5(j)",
        textSource: "KAAKYIRE AKOSOMO NYANTAKYI: The Generous Hunter\n\"the snake said\"",
        prompt: "The literary device used in 'the snake said' is ............",
        answer: "Personification."
      }
    ]
  }
};

const flattenedPaper2Questions = [
  ...paper2Calibrated.partA_writing.questions,
  ...paper2Calibrated.partB_reading_comprehension.questions,
  ...paper2Calibrated.partC_literature.questions
];

async function seedBeceEnglish2026Calibrated() {
  console.log("Seeding Calibrated BECE English Language June 2026 into Firestore...");

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
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2026");
  await docRef.set({
    year: 2026,
    month: "June",
    title: "BECE English Language June 2026 (Calibrated National Benchmark)",
    subjectId: "english",
    metadata: {
      isPastQuestion: true,
      standard: "NaCCA / WAEC BECE Standard",
      totalMarks: 100,
      totalDurationMinutes: 120,
      paper1Count: balancedPaper1.length,
      optionsBalanced: true,
      unplagiarizedPedagogicalAdaptation: true,
      oralLanguageIncluded: true,
      literatureCockcrowIncluded: true,
      updatedAt: new Date()
    },
    paper1: {
      title: "Paper 1: Objective Test & Oral Language",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      sectionA_lexis_and_structure: {
        title: "Part A: Lexis, Structure, Antonyms and Cloze",
        questionRange: "Questions 1 to 35",
        questions: balancedPaper1.slice(0, 35)
      },
      sectionB_oral_language: {
        title: "Part B: Oral Language and Phonology",
        questionRange: "Questions 36 to 40",
        questions: balancedPaper1.slice(35, 40)
      },
      allQuestions: balancedPaper1,
      questions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Essay Writing, Reading Comprehension & Literature",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Calibrated BECE English June 2026 successfully seeded into Firestore!");
}

seedBeceEnglish2026Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English June 2026:", err);
    process.exit(1);
  });
