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
      return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });
    }
  } catch (e) {
    console.log("Fallback to admin default credentials...");
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
}

// 40 Concept-Mapped, Original Pedagogical Adaptations
const rawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "If the national team had scored that penalty, the supporters ......",
    options: ["will have celebrated", "will celebrate", "would have celebrated", "would celebrate"],
    correctAnswer: "would have celebrated",
    hint: "Conditional Type 3: 'If + past perfect' requires 'would have + past participle' in the main clause.",
    workedSolution: "The condition 'If the national team had scored' is in the past perfect tense. In a Third Conditional sentence, the main clause requires 'would have' followed by the past participle ('would have celebrated').",
    points: 1
  },
  {
    number: 2,
    prompt: "At the wedding reception, guests were treated to a ...... dish.",
    options: ["spicy delicious local", "delicious spicy local", "local spicy delicious", "delicious local spicy"],
    correctAnswer: "delicious spicy local",
    hint: "Order of adjectives: Opinion comes before physical quality/taste, which precedes origin.",
    workedSolution: "According to the Royal Order of Adjectives: Opinion ('delicious') comes before quality/flavor ('spicy'), which precedes origin/type ('local').",
    points: 1
  },
  {
    number: 3,
    prompt: "Yaw has not purchased ...... of the two prescribed mathematics sets.",
    options: ["any", "none", "neither", "either"],
    correctAnswer: "either",
    hint: "When a negative verb ('has not') refers to two items, use 'either' to mean neither one.",
    workedSolution: "Because the sentence already contains the negative word 'not' and refers to two items, 'either' is the correct correlative word ('not ... either of the two'). Double negatives like 'not ... neither' are incorrect.",
    points: 1
  },
  {
    number: 4,
    prompt: "The new apprentice is allergic ...... cement dust.",
    options: ["about", "against", "with", "to"],
    correctAnswer: "to",
    hint: "The adjective 'allergic' always takes this specific preposition.",
    workedSolution: "In standard English, the adjective 'allergic' is followed by the preposition 'to' (e.g., 'allergic to dust').",
    points: 1
  },
  {
    number: 5,
    prompt: "The watchman noticed the trespasser ...... across the compound.",
    options: ["was running", "is running", "run", "ran"],
    correctAnswer: "run",
    hint: "Verbs of perception (saw, noticed, heard) are followed by an object and a bare infinitive or present participle.",
    workedSolution: "After verbs of sensory perception like 'noticed' or 'saw', an object takes a bare infinitive ('run') to indicate a completed action, or a present participle ('running') for an ongoing one. 'Ran' and 'was running' are grammatically incorrect here.",
    points: 1
  },
  {
    number: 6,
    prompt: "The headmaster indicated that it was high time the students ...... their revision.",
    options: ["have to begin", "began", "had to begin", "begin"],
    correctAnswer: "began",
    hint: "The structure 'It is (high) time + subject' takes a subjunctive verb in the simple past tense.",
    workedSolution: "Expressions like 'It is time' or 'It was time' followed by a subject require the simple past subjunctive form of the verb ('began') to express an overdue action.",
    points: 1
  },
  {
    number: 7,
    prompt: "The storm was raging violently, ...... the fishermen set sail into the open sea.",
    options: ["and", "so", "for", "yet"],
    correctAnswer: "yet",
    hint: "Choose the coordinating conjunction that expresses a surprising contrast.",
    workedSolution: "'Yet' functions as an adversative coordinating conjunction expressing contrast (equivalent to 'nevertheless' or 'but').",
    points: 1
  },
  {
    number: 8,
    prompt: "You haven't traveled outside the country before, ...... you?",
    options: ["hadn't", "have", "haven't", "had"],
    correctAnswer: "have",
    hint: "A negative statement takes a positive question tag using the same auxiliary verb.",
    workedSolution: "The main clause has a negative auxiliary verb ('haven't'). Therefore, the question tag must be positive: 'have you?'.",
    points: 1
  },
  {
    number: 9,
    prompt: "During the hearing, the accused faced ...... committee.",
    options: ["five-members'", "a five-member", "a five-member's", "five-members"],
    correctAnswer: "a five-member",
    hint: "When a compound number-noun acts as an adjective before a noun, it takes the singular form without an apostrophe.",
    workedSolution: "In compound adjectives modifying a noun, the unit remains singular and hyphenated: 'a five-member committee'.",
    points: 1
  },
  {
    number: 10,
    prompt: "Which of the ...... two fabrics is softer?",
    options: ["two", "one", "most", "all"],
    correctAnswer: "two",
    hint: "The comparative degree ('softer') is used when comparing exactly two items.",
    workedSolution: "Because the comparative adjective 'softer' is used, the sentence must refer specifically to 'two' fabrics. 'All' and 'most' require the superlative 'softest'.",
    points: 1
  },
  {
    number: 11,
    prompt: "Yesterday afternoon, our class observed ......",
    options: ["an eclipse of a sun", "the eclipse of a sun", "an eclipse of the sun", "the eclipse of the sun"],
    correctAnswer: "an eclipse of the sun",
    hint: "The unique celestial body 'sun' takes the definite article 'the', while an individual occurrence takes 'an'.",
    workedSolution: "Unique natural celestial bodies require the definite article ('the sun'). An individual event of its darkening is introduced as 'an eclipse of the sun'.",
    points: 1
  },
  {
    number: 12,
    prompt: "Among all the athletes who registered, Mansa arrived ...... early.",
    options: ["very", "only", "often", "most"],
    correctAnswer: "most",
    hint: "When comparing more than two participants to show the highest degree, use the superlative marker.",
    workedSolution: "In a comparison involving all participants (more than two), the superlative adverbial form 'most early' (or 'earliest') indicates the highest degree.",
    points: 1
  },
  {
    number: 13,
    prompt: "Our senior housemaster, ...... lives on campus, advised us on personal hygiene.",
    options: ["who", "whom", "that", "which"],
    correctAnswer: "who",
    hint: "Use this relative pronoun as the subject referring to a person in non-defining clauses.",
    workedSolution: "'Who' is the subjective relative pronoun referring to people ('our senior housemaster'). 'Whom' is objective; 'which' refers to things; 'that' is not used in non-defining clauses with commas.",
    points: 1
  },
  {
    number: 14,
    prompt: "\"I will deliver the parcel promptly,\" stated Baaba.\nThe correct indirect speech for this sentence is: Baaba ......",
    options: [
      "stated that she will deliver the parcel promptly.",
      "is stating that she would deliver the parcel promptly.",
      "stated that she would deliver the parcel promptly.",
      "states that she delivered the parcel promptly."
    ],
    correctAnswer: "stated that she would deliver the parcel promptly.",
    hint: "In reported speech, the modal auxiliary 'will' changes to 'would' when the reporting verb is in the past.",
    workedSolution: "Because the reporting verb 'stated' is in the simple past, the direct speech modal 'will' shifts back to 'would', and 'I' changes to 'she'.",
    points: 1
  },
  {
    number: 15,
    prompt: "The regional director awarded Serwaa a gold medal.\nIn passive voice, this sentence becomes: Serwaa ...... awarded a gold medal by the regional director.",
    options: ["is", "has been", "was", "is being"],
    correctAnswer: "was",
    hint: "The active verb 'awarded' is in the simple past tense. Use 'was' + past participle.",
    workedSolution: "The active sentence uses the simple past tense ('awarded'). In the passive voice, the singular subject 'Serwaa' takes 'was' + past participle ('was awarded').",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The young apprentice wondered why the blacksmith worked so methodically.\nChoose the word nearest in meaning to the underlined word 'wondered'.",
    options: ["was saddened that", "felt frustrated that", "was curious about why", "thought about why"],
    correctAnswer: "was curious about why",
    hint: "'To wonder' means to desire to know or feel inquisitive about something.",
    workedSolution: "'Wondered' in this context means having an eager desire to learn or investigate, making 'was curious about why' the closest equivalent.",
    points: 1
  },
  {
    number: 17,
    prompt: "The village committee unanimously embraced the elder's recommendation.\nChoose the word nearest in meaning to the underlined word 'recommendation'.",
    options: ["suggestion", "offer", "opinion", "view"],
    correctAnswer: "suggestion",
    hint: "A piece of practical advice or an idea put forward for consideration.",
    workedSolution: "A 'recommendation' or proposal is an idea presented for adoption; 'suggestion' is the direct synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "Our class teacher advised us to remain confident and outspoken whenever we speak in public.\nChoose the word nearest in meaning to the underlined word 'outspoken'.",
    options: ["muscular", "strong", "smart", "bold"],
    correctAnswer: "bold",
    hint: "Standing firm, courageous, and ready to state one's rights or opinions clearly.",
    workedSolution: "'Outspoken' (or assertive) describes someone who is courageous, forthright, and confident; 'bold' is the nearest synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "The unchecked felling of timber in the forest reserve must be halted.\nChoose the word nearest in meaning to the underlined word 'unchecked'.",
    options: ["common", "regular", "unpleasant", "uncontrolled"],
    correctAnswer: "uncontrolled",
    hint: "Spreading wildly without restraint or regulation.",
    workedSolution: "'Unchecked' (rampant) means flourishing or spreading without any restriction or limit; 'uncontrolled' is the synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "The primary arguments of the debate were carefully outlined by the principal speaker.\nChoose the word nearest in meaning to the underlined word 'primary'.",
    options: ["highlighted", "chosen", "important", "interesting"],
    correctAnswer: "important",
    hint: "Most noticeable, prominent, or of central significance.",
    workedSolution: "'Primary' (or salient) points are the main, essential, or most significant elements of a discourse; 'important' is the nearest meaning.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "The assemblyman cautioned the youth not to let excitement get the better of them. This means that they should not let excitement ......",
    options: ["divide", "sadden", "control", "deceive"],
    correctAnswer: "control",
    hint: "To get the better of someone means to overpower or dictate their actions.",
    workedSolution: "The idiom 'to get the better of someone' means to overcome, overwhelm, or gain mastery and control over a person's judgment.",
    points: 1
  },
  {
    number: 22,
    prompt: "\"Stop being a killjoy, Kwame; help your sister celebrate her sports victory,\" Mother urged. This means that Kwame ......",
    options: [
      "didn't care about his sister",
      "couldn't run fast enough",
      "was too weak to help",
      "liked to dampen enthusiasm"
    ],
    correctAnswer: "liked to dampen enthusiasm",
    hint: "A killjoy (or wet blanket) spoils other people's happiness or excitement.",
    workedSolution: "A 'killjoy' (or wet blanket) is a person who discourages enjoyment, dampens enthusiasm, or prevents others from celebrating.",
    points: 1
  },
  {
    number: 23,
    prompt: "Kofi was forced to swallow his pride when the junior team defeated his side. This means that Kofi ......",
    options: [
      "admitted that he was mistaken",
      "denied everything he had said",
      "lost his appetite completely",
      "refused to play football again"
    ],
    correctAnswer: "admitted that he was mistaken",
    hint: "Eating one's words or swallowing pride means publicly retracting an arrogant claim.",
    workedSolution: "'To swallow one's pride' or 'eat one's words' means to humbly retract an earlier boastful assertion and admit that one was wrong.",
    points: 1
  },
  {
    number: 24,
    prompt: "The swindler was finally given a taste of his own medicine. This means that he was ......",
    options: ["given bitter medicine", "swindled in the same manner", "sent to prison", "pardoned by the court"],
    correctAnswer: "swindled in the same manner",
    hint: "Experiencing the very same mistreatment or trickery that one has inflicted on others.",
    workedSolution: "'To be given a taste of one's own medicine' (or paid back in one's own coin) means to be treated in the exact harmful manner that one treated others.",
    points: 1
  },
  {
    number: 25,
    prompt: "The headmistress hit the nail on the head when she declared that discipline is the foundation of success. This means that she ......",
    options: [
      "was an expert carpenter",
      "stated the exact truth",
      "criticized the teachers unfairly",
      "threatened the students"
    ],
    correctAnswer: "stated the exact truth",
    hint: "Describing a situation or stating a fact with perfect accuracy.",
    workedSolution: "'To hit the nail on the head' means to say something that is precisely correct, accurate, and completely true.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "The clinic was closed on a temporary basis during the fumigation exercise, but it has now reopened ......",
    options: ["permanently", "legally", "deliberately", "constantly"],
    correctAnswer: "permanently",
    hint: "'Temporary' means lasting for a limited time. Find the word that means for all time.",
    workedSolution: "'Temporary' means lasting for a short time only. Its direct antonym is 'permanently', meaning lasting indefinitely.",
    points: 1
  },
  {
    number: 27,
    prompt: "Scientific principles may appear simple in theoretical formulations, but they are often difficult in ...... applications.",
    options: ["practical", "natural", "logical", "actual"],
    correctAnswer: "practical",
    hint: "'Theoretical' deals with ideas in books; find the word dealing with real-world hands-on practice.",
    workedSolution: "'Theoretical' relates to concepts and speculation. Its natural opposite in science and technology is 'practical' (hands-on execution).",
    points: 1
  },
  {
    number: 28,
    prompt: "Medical doctors emphasize that it is far wiser to ...... infections than to search for a cure afterwards.",
    options: ["prevent", "protect", "avoid", "counter"],
    correctAnswer: "prevent",
    hint: "Stopping something from happening beforehand rather than treating it after it occurs.",
    workedSolution: "'Curing' deals with treating an existing disease. The opposite preventative approach is to 'prevent' it from occurring.",
    points: 1
  },
  {
    number: 29,
    prompt: "Historians can easily identify when the ancient empire originated, but they cannot tell when it will ......",
    options: ["fall", "cease", "reside", "remain"],
    correctAnswer: "cease",
    hint: "'Originated' means began. Look for a formal word that means to stop existing or come to an end.",
    workedSolution: "'Originate' means to begin or start. Its antonym is 'cease', meaning to end, stop, or discontinue.",
    points: 1
  },
  {
    number: 30,
    prompt: "Forest zones enjoy abundant rainfall, whereas desert margins receive only ...... precipitation.",
    options: ["unpredictable", "scanty", "uncertain", "reduced"],
    correctAnswer: "scanty",
    hint: "'Abundant' means plentiful. Choose the word meaning meager, sparse, or very little.",
    workedSolution: "'Abundant' means existing in large quantities. Its direct opposite in describing rainfall and moisture is 'scanty' (meager or sparse).",
    points: 1
  },

  // --- SECTION E: CLOZE PASSAGE (31 - 35) ---
  {
    number: 31,
    prompt: "The annual meeting commenced with the reading of the minutes. A member noted that his name was omitted from the ---31--- list.",
    options: ["register", "compiled", "present", "attendance"],
    correctAnswer: "attendance",
    hint: "The formal official record tracking members present at a business meeting.",
    workedSolution: "In formal committee terminology, the record showing who attended a meeting is called the 'attendance list' (or attendance register).",
    points: 1
  },
  {
    number: 32,
    prompt: "After resolving the omission, two important ---32--- were proposed, debated, and put to a vote.",
    options: ["motions", "ideas", "decisions", "intentions"],
    correctAnswer: "motions",
    hint: "Formal proposals submitted for discussion and voting during a meeting.",
    workedSolution: "In meeting procedures, formal proposals put forward for deliberation and voting are designated as 'motions'.",
    points: 1
  },
  {
    number: 33,
    prompt: "As deliberations concluded, the chairman called upon a member to ---33--- for the closure of the meeting.",
    options: ["declare", "call", "recommend", "move"],
    correctAnswer: "move",
    hint: "The parliamentary verb used to formally propose that a meeting end.",
    workedSolution: "In formal meeting procedure, to propose a motion or the adjournment of a meeting is to 'move' for it.",
    points: 1
  },
  {
    number: 34,
    prompt: "The member did so, and his proposal was promptly ---34--- by the secretary.",
    options: ["approved", "seconded", "upheld", "supported"],
    correctAnswer: "seconded",
    hint: "Formally endorsing a motion before it can be accepted by the house.",
    workedSolution: "In parliamentary procedure, after a motion is moved, another member must formally 'second' it before it can be adopted.",
    points: 1
  },
  {
    number: 35,
    prompt: "Having completed its business, the general meeting was ---35--- to the following month.",
    options: ["adjourned", "postponed", "deferred", "shifted"],
    correctAnswer: "adjourned",
    hint: "The formal technical term for suspending or closing a sitting of a meeting.",
    workedSolution: "The specific formal verb for suspending a meeting or parliamentary session to a future date is 'adjourned'.",
    points: 1
  },

  // --- PART B: ORAL LANGUAGE - SPEECH SOUNDS (36 - 40) ---
  {
    number: 36,
    prompt: "Those two athletes are arch rivals.\nWhich of the following words has the same consonant sound as the underlined digraph 'ch' in 'arch'?",
    options: ["splash", "patch", "path", "spark"],
    correctAnswer: "patch",
    hint: "Pronounce the ending sound of 'arch' (/tʃ/). Which word shares this voiceless affricate sound?",
    workedSolution: "'Arch' ends with the voiceless palato-alveolar affricate /tʃ/. 'Patch' ends with the identical /tʃ/ sound. ('splash' has /ʃ/, 'path' has /θ/, 'spark' has /k/).",
    points: 1
  },
  {
    number: 37,
    prompt: "Mawuli is the executive chef at the hotel.\nWhich of the following words has the same initial consonant sound as the word 'chef'?",
    options: ["chord", "chair", "shield", "scheme"],
    correctAnswer: "shield",
    hint: "'Chef' is borrowed from French and begins with the /ʃ/ sound (like 'sh').",
    workedSolution: "'Chef' is pronounced /ʃef/, beginning with the voiceless postalveolar fricative /ʃ/. 'Shield' begins with the same /ʃ/ sound. ('chord' and 'scheme' start with /k/; 'chair' with /tʃ/).",
    points: 1
  },
  {
    number: 38,
    prompt: "The athlete sprang over the hurdle.\nWhich of the following words has the same initial three-consonant cluster as 'sprang'?",
    options: ["sprayed", "struck", "slew", "splashed"],
    correctAnswer: "sprayed",
    hint: "Identify the exact triple consonant cluster: /s/ + /p/ + /r/.",
    workedSolution: "'Sprang' begins with the triple consonant cluster /spr-/. 'Sprayed' begins with the identical /spr-/ cluster. ('splashed' starts with /spl-/, 'struck' with /str-/).",
    points: 1
  },
  {
    number: 39,
    prompt: "Whole grains provide rich dietary fiber.\nWhich of the following words has the same vowel sound as the word 'whole'?",
    options: ["Gill", "Goal", "Gaul", "Gaol"],
    correctAnswer: "Goal",
    hint: "'Whole' is pronounced with the /əʊ/ diphthong sound, exactly like 'hole'.",
    workedSolution: "'Whole' is pronounced /həʊl/. Its vowel sound is the diphthong /əʊ/, which perfectly matches 'goal' (/ɡəʊl/).",
    points: 1
  },
  {
    number: 40,
    prompt: "The young prince is the legitimate heir to the stool.\nWhich of the following words has the same vowel sound as the word 'heir'?",
    options: ["here", "hail", "air", "hew"],
    correctAnswer: "air",
    hint: "The letter 'h' is silent in 'heir'. It is a homophone of another atmospheric word.",
    workedSolution: "In 'heir', the initial 'h' is silent, and the word is pronounced /eər/. It is a direct homophone of 'air' (/eər/). ('here' is /hɪər/, 'hail' is /heɪl/).",
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

const assignedTargetIndices = seedShuffle(targetKeys, 202408);

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
// PAPER 2: ESSAY, COMPREHENSION & LITERATURE
// ==========================================
const paper2Calibrated = {
  sectionA_essay: {
    title: "Part A: Essay Writing",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Informal Letter",
        prompt: "Your classmate in another town has expressed frustration with school and plans to drop out to engage in street hawking. Write a letter encouraging him or her to remain in school, highlighting two aspects of school life that make education worthwhile and enjoyable.",
        modelAnswer: `Presbyterian Junior High School\nP. O. Box 88\nKoforidua, Eastern Region\n12th July, 2024\n\nDear Kwame,\n\nI received your recent letter with mixed feelings. While I understand the financial stress and academic pressures you are facing, I was deeply disturbed to learn that you are contemplating dropping out of school to become a street hawker. I am writing to urge you to reconsider your decision and stay in school.\n\nFirst, school life offers enriching co-curricular activities that relieve academic tension and discover hidden talents. In our school, Friday afternoons are reserved for sporting tournaments, cultural drumming, and debates. Being part of the school football team has not only kept me physically fit but has also taught me team discipline and leadership. These moments bring immense joy and forge lifelong memories that no street hawking can ever provide.\n\nSecondly, school exposes us to practical knowledge and technological skills that secure a brighter future. Through our computing and integrated science laboratory sessions, we conduct experiments and learn digital skills that prepare us for modern professions. Street trading may yield quick pocket money today, but it offers no job security. Completing your basic education and proceeding to Senior High School will empower you to break the cycle of poverty permanently.\n\nKwame, please do not trade your promising future for immediate, petty gains. Speak with our school guidance counselor or your church elders for assistance. I look forward to hearing that you have returned to your books.\n\nYour true friend,\n[Signature]\nKofi Mensah`
      },
      {
        questionNumber: "2",
        category: "Formal Report",
        prompt: "A teacher from your school won the first prize in the National Best Teacher Awards. As the student representative who attended the ceremony, write a formal report on the event, highlighting what you observed and discussing two key lessons you learned.",
        modelAnswer: `REPORT ON THE NATIONAL BEST TEACHER AWARDS HELD AT THE INTERNATIONAL CONFERENCE CENTRE, ACCRA\nBy Akosua Donkor (School Prefect, Anglican JHS)\n\nINTRODUCTION\nOn Friday, 5th October 2024, I had the privilege of representing Anglican Junior High School at the prestigious National Best Teacher Awards ceremony held in Accra, where our dedicated Science master, Mr. Emmanuel Osei, was crowned the National Best Teacher.\n\nPROCEEDINGS OF THE CEREMONY\nThe grand event commenced at 9:00 a.m. with an opening procession of dignitaries, including the Minister for Education and traditional rulers. Cultural troupes performed traditional dances, followed by keynote addresses commending educators across the country. The climax of the day arrived when Mr. Osei was announced as the overall winner. He was presented with a citation, a brand-new saloon car, and an educational scholarship fund. The entire auditorium erupted in deafening cheers as he walked gracefully to the podium.\n\nLESSONS LEARNED\nThe first lesson I learned from the event is that selfless diligence and commitment always receive public recognition. Mr. Osei routinely spent his weekends organizing free remedial practical lessons for underprivileged candidates. Seeing his years of quiet sacrifice rewarded before the entire nation proved to me that hard work never goes unrewarded.\n\nThe second lesson is the indispensable role teachers play in nation-building. The speeches emphasized that national economic transformation begins in the basic classroom. This realization deepened my respect for teachers and inspired me to approach my studies with greater seriousness.\n\nCONCLUSION\nThe ceremony was an inspiring and well-organized celebration. I recommend that our school organize a special welcome durbar to honor Mr. Osei and motivate the entire teaching staff.`
      },
      {
        questionNumber: "3",
        category: "Article for Publication",
        prompt: "With national general elections approaching, political campaigns have intensified. As an ambassador for peace in your community, write an article for publication in your local community newspaper, discussing two ways of maintaining peace and harmony during the campaign season.",
        modelAnswer: `SAFEGUARDING PEACE AND SOCIAL COHESION DURING ELECTION SEASONS\nBy Yaw Badu, JHS 3\n\nAs Ghana prepares for general elections, political activities have intensified across towns and villages. Political rallies, street float processions, and radio debates have become daily occurrences. While multiparty democracy encourages dynamic political choices, election periods often test the social fabric of our communities. It is therefore vital that we actively safeguard the peace and communal solidarity we have enjoyed for decades.\n\nThe primary method of maintaining peace is the responsible use of language by politicians, community members, and the youth. Party communicators and supporters must refrain from tribal bigotry, insults, and provocative hate speech during campaign rallies and on community radio stations. Difference in political opinion must never be viewed as enmity. Citizens should listen to campaign messages with maturity, debate national policies constructively, and reject any politician who incites violence.\n\nSecondly, the youth must refuse to be hired as political thugs or vigilantes. Often, self-seeking politicians exploit unemployed young people, offering them small sums of money and alcohol to disrupt opponents' rallies or destroy campaign billboards. The youth must recognize that when violence erupts, it is the vulnerable—children, women, and the youth themselves—who suffer the devastating consequences, while politicians remain safe.\n\nIn conclusion, political parties will come and go, but our community will always remain. Let us promote tolerance, embrace diversity, and remember that peaceful co-existence is the true bedrock of national development.`
      }
    ]
  },
  sectionB_comprehension: {
    title: "Part B: Reading Comprehension",
    passage: `Human migration is an ancient phenomenon driven by diverse economic and social motivations. When individuals relocate from rural villages to sprawling urban centers, their migration brings both opportunities and daunting challenges.\n\nWhen Dauda migrated to the metropolis, he left his wife, Amina, an industrious traditional baker, to manage their rural homestead and provide for their two young children. During one of his infrequent visits home, his aging father urged him to relocate his family to the city so they could stay together. Reluctantly, Dauda yielded to his father's counsel.\n\nAmina had harbored visions of residing in a modern, comfortable apartment surrounded by modern conveniences. In reality, she arrived to find that she, her husband, and their children were crammed into a single squalid wooden kiosk in a congested settlement. Basic sanitary facilities were shared with dozens of other households. To make matters worse, Dauda's monthly housekeeping remittance was so meager that preparing decent meals became an everyday struggle. Amina sought formal employment, but like countless other female migrants without modern industrial skills, her searches proved futile. She frequently worried how they would survive, remit stipends to their aged parents, and set aside savings for future emergencies.\n\nOne festive weekend, Amina decided to prepare a traditional local delicacy—spiced roasted plantain with seasoned groundnut paste—to treat her family and entertain neighbors. The mouth-watering aroma drew neighbors and passers-by, who eagerly stopped by for a taste. Her culinary expertise was an instant sensation. Soon, market women and office workers approached her to cater for family gatherings and festive celebrations. Amina established a modest catering venture that flourished rapidly. Through resilience and culinary ingenuity, she transformed her family's fortunes and achieved financial independence.`,
    questions: [
      {
        subId: "(a)",
        question: "What was Amina's occupation before she migrated to the city?",
        answer: "Amina was an industrious traditional baker in her rural village."
      },
      {
        subId: "(b)",
        question: "State two specific financial commitments migrant workers needed money for, according to the passage.",
        answer: "1. Remitting money to their aged parents in the village.\n2. Setting aside savings for future emergencies (saving for a rainy day)."
      },
      {
        subId: "(c)",
        question: "In one single adjective, describe Amina's emotional feeling upon discovering her living conditions in the city.",
        answer: "Disillusioned (or Disappointed / Dejected / Crestfallen)."
      },
      {
        subId: "(d)",
        question: "\"Reluctantly, Dauda yielded to his father's counsel.\"\nWhy was Dauda reluctant to bring his family to the city?",
        answer: "Because he was living in a single, congested room with shared facilities and knew his meager income could scarcely support a family in the expensive city."
      },
      {
        subId: "(e)",
        question: "Explain the meaning of the following figurative expressions as used in the passage:\n(i) to manage their rural homestead;\n(ii) set aside savings for future emergencies;\n(iii) was an instant sensation.",
        answer: "(i) **to manage their rural homestead:** To take full responsibility for feeding, caring for, and maintaining the family home independently.\n(ii) **set aside savings for future emergencies:** To reserve money carefully for unexpected difficulties, sickness, or hardship.\n(iii) **was an instant sensation:** Became immediately popular, widely admired, and hugely successful."
      },
      {
        subId: "(f)",
        question: "For each of the following words, provide a word or phrase that means the same and can replace it in the passage without altering the meaning:\n(i) infrequent;\n(ii) crammed;\n(iii) meager;\n(iv) flourished.",
        answer: "(i) **infrequent:** occasional / rare / irregular.\n(ii) **crammed:** packed / squeezed / crowded / accommodated tightly.\n(iii) **meager:** small / inadequate / scanty / insufficient.\n(iv) **flourished:** prospered / succeeded / expanded / thrived."
      },
      {
        subId: "(g)",
        question: "In two sentences of not more than ten words each, summarize two major challenges migrants face as described in the third paragraph.",
        answer: "(i) **First Challenge:** Migrants suffer from severe accommodation and sanitary problems. [8 words]\n(ii) **Second Challenge:** Unemployment and inadequate finances cause severe hardship. [7 words]"
      }
    ]
  },
  sectionC_literature: {
    title: "Part C: Literature in English (The Cockcrow Anthology)",
    instructions: "Answer all questions in this part based on the prescribed texts.",
    questions: [
      {
        subId: "5(a)",
        textSource: "CHARLES DICKENS: Oliver Twist",
        extract: "\"Boy, what's your name?\" snarled the gentleman in the high chair.\n\"Oliver Twist, sir,\" stammered the boy.\n\"You know you're an orphan, don't you?\"\n\"What's an orphan, sir?\"",
        question: "What does the gentleman's snarling tone reveal about his attitude toward Oliver?",
        answer: "It reveals that he is callous, harsh, intimidating, and unsympathetic toward vulnerable children."
      },
      {
        subId: "5(b)",
        textSource: "CHARLES DICKENS: Oliver Twist",
        extract: "\"What's an orphan, sir?\"",
        question: "What does Oliver's question reveal about his character and situation?",
        answer: "It shows his absolute innocence, naivety, and complete lack of parental education or worldly knowledge."
      },
      {
        subId: "5(c)",
        textSource: "KAAKYIRE AKOSOMO NYANTAKYI: The Generous Hunter",
        extract: "\"Calm down, Mr. Hunter, I come in peace. Your ability to distinguish me from my younger brother has surprised me. Many people think we are identical twins.\"",
        question: "Why did the talking animal (speaker) approach the hunter in the forest?",
        answer: "To test the hunter's integrity, show gratitude for his discernment, and reward his legendary kindness."
      },
      {
        subId: "5(d)",
        textSource: "KAAKYIRE AKOSOMO NYANTAKYI: The Generous Hunter",
        extract: "The dialogue between the mythical creature and the hunter...",
        question: "What moral lesson does the reader learn from the hunter's extraordinary experience?",
        answer: "Generosity, patience, and treating nature with respect bring unexpected blessings and honor."
      },
      {
        subId: "5(e)",
        textSource: "ROBERT FROST: A Minor Bird",
        extract: "The fault must partly have been in me\nThe bird was not to blame for his key\nAnd of course there must be something wrong\nIn wanting to silence any song",
        question: "State the rhyme scheme of the four-line stanza above.",
        answer: "aabb (me/key rhyme as 'a', and wrong/song rhyme as 'b')."
      },
      {
        subId: "5(f)",
        textSource: "ROBERT FROST: A Minor Bird",
        extract: "\"The fault must partly have been in me...\"",
        question: "What moral lesson about human nature and fault-finding is conveyed in this stanza?",
        answer: "Human irritation is often caused by our own internal intolerance rather than innocent natural expressions around us."
      },
      {
        subId: "5(g)",
        textSource: "LAWRENCE DARMANI: Scribbler's Dream",
        extract: "Tell you the truth:\nthe gold adorning the neck\nonce was lost in rocky soils\nThey dig deep who find it!",
        question: "Identify the dominant figure of speech used in the lines 'the gold adorning the neck / once was lost in rocky soils'.",
        answer: "Metaphor (comparing the refined achievement of an author's published work to refined gold extracted through hard labor)."
      },
      {
        subId: "5(h)",
        textSource: "LAWRENCE DARMANI: Scribbler's Dream",
        extract: "\"They dig deep who find it!\"",
        question: "What does the poet mean by the statement 'They dig deep who find it'?",
        answer: "Great success and literary excellence require persistent hard work, deep research, and profound sacrifice."
      },
      {
        subId: "5(i)",
        textSource: "AMA ATAA AIDOO: The Dilemma of a Ghost",
        extract: "Yes, my young woman, I shall remember you.\nI shall remember you in the hours of the night\nIn my sleep,\nIn my sleepless sleep.",
        question: "To whom does the phrase 'my young woman' refer in the play?",
        answer: "Eulalie Jawondo (the African-American graduate married to Ato Yawson)."
      },
      {
        subId: "5(j)",
        textSource: "AMA ATAA AIDOO: The Dilemma of a Ghost",
        extract: "\"In my sleepless sleep.\"",
        question: "Identify the literary device contained in the phrase 'sleepless sleep'.",
        answer: "Oxymoron (or Paradox), as 'sleepless' and 'sleep' are contradictory terms placed together."
      }
    ]
  }
};

// Flattened structured question parts for standard runner compatibility
const flattenedPaper2Questions = [
  ...paper2Calibrated.sectionA_essay.questions.map((q) => ({
    partLabel: `Part A - Question ${q.questionNumber} (${q.category})`,
    prompt: q.prompt,
    modelAnswer: q.modelAnswer,
    marks: 30
  })),
  ...paper2Calibrated.sectionB_comprehension.questions.map((q) => ({
    partLabel: `Part B - Comprehension ${q.subId}`,
    prompt: `${paper2Calibrated.sectionB_comprehension.passage}\n\n**Question:** ${q.question}`,
    modelAnswer: q.answer,
    marks: 5
  })),
  ...paper2Calibrated.sectionC_literature.questions.map((q) => ({
    partLabel: `Part C - Literature ${q.subId} (${q.textSource})`,
    prompt: `${q.extract ? `*Extract:*\n> ${q.extract}\n\n` : ''}**Question:** ${q.question}`,
    modelAnswer: q.answer,
    marks: 2
  }))
];

async function seedBeceEnglish2024Calibrated() {
  const db = await getDb();
  console.log("Seeding Calibrated & Balanced BECE English 2024 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2024");
  await docRef.set({
    year: 2024,
    title: "BECE English Language 2024 (Calibrated National Benchmark)",
    subjectId: "english",
    metadata: {
      isPastQuestion: true,
      standard: "NaCCA / WAEC BECE Standard",
      totalMarks: 100,
      totalDurationMinutes: 120,
      paper1Count: balancedPaper1.length,
      optionsBalanced: true,
      unplagiarizedPedagogicalAdaptation: true,
      sectionsPresent: ["Paper 1 (Objectives)", "Paper 2 Part A (Essay)", "Paper 2 Part B (Comprehension)", "Paper 2 Part C (Literature)"],
      status: "calibrated",
      updatedAt: new Date()
    },
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      questions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Essay, Comprehension and Literature in English",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Calibrated BECE English 2024 successfully seeded into Firestore!");
}

seedBeceEnglish2024Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2024:", err);
    process.exit(1);
  });
