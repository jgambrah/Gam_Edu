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
    prompt: "Kofi has prepared and ............ a bowl of hot porridge.",
    options: ["ate", "eats", "eaten", "eating"],
    correctAnswer: "eaten",
    hint: "The auxiliary verb 'has' governs both coordinate verbs joined by 'and'. Both must be past participles.",
    workedSolution: "The auxiliary 'has' applies to both coordinated verbs ('has prepared and [has] eaten'). Therefore, the past participle 'eaten' is required.",
    points: 1
  },
  {
    number: 2,
    prompt: "My elder brother and ............ visited our sick grandmother in hospital.",
    options: ["I", "myself", "me", "ourselves"],
    correctAnswer: "I",
    hint: "Test the pronoun by removing the other person: '...... visited our sick grandmother.'",
    workedSolution: "The pronoun is part of the compound subject of the verb 'visited'. The subjective case pronoun 'I' is correct ('My elder brother and I').",
    points: 1
  },
  {
    number: 3,
    prompt: "The hunter saw the leopard ............ in wait for its prey in the bush.",
    options: ["lie", "lain", "laid", "lay"],
    correctAnswer: "lay",
    hint: "'Lie' (to recline/rest) has the simple past form 'lay'. 'Laid' is the past tense of 'lay' (to place something down).",
    workedSolution: "The intransitive verb 'lie' (to rest or recline in wait) has the simple past tense 'lay' (lie - lay - lain). 'Laid' is the past form of the transitive verb 'lay' (to place).",
    points: 1
  },
  {
    number: 4,
    prompt: "It is about time the candidates ......... revising seriously for the final examination.",
    options: ["start", "should start", "started", "are starting"],
    correctAnswer: "started",
    hint: "The structure 'It is (about/high) time + subject' requires a subjunctive verb in the simple past tense.",
    workedSolution: "Expressions like 'It is about time' followed by a subject require the simple past subjunctive form ('started') to express an overdue action.",
    points: 1
  },
  {
    number: 5,
    prompt: "Kweku now wishes he ............ his agricultural project earlier in the term.",
    options: ["began", "had begun", "begins", "has begun"],
    correctAnswer: "had begun",
    hint: "A regret or wish about a past event requires the past perfect tense ('had + past participle').",
    workedSolution: "Wishes referring to unfulfilled past actions require the past perfect tense ('had begun').",
    points: 1
  },
  {
    number: 6,
    prompt: "Honesty in leadership is exactly ............ our chief tried to emphasize.",
    options: ["all what", "all that", "something that", "something which"],
    correctAnswer: "all that",
    hint: "The indefinite pronoun 'all' is followed by the relative pronoun 'that', never 'what'.",
    workedSolution: "In standard English, 'all' is modified by the relative pronoun 'that' ('all that'), not 'what' or 'which'.",
    points: 1
  },
  {
    number: 7,
    prompt: "Would you rather we ...... the town before sunset?",
    options: ["should leave", "are leaving", "leave", "left"],
    correctAnswer: "left",
    hint: "'Would rather + subject' takes a simple past subjunctive verb.",
    workedSolution: "When 'would rather' is followed by a different subject clause ('we'), it takes the past subjunctive form of the verb ('left') to express preference.",
    points: 1
  },
  {
    number: 8,
    prompt: "Akosua is my ........... sister by two years.",
    options: ["senior", "elder", "older", "matured"],
    correctAnswer: "elder",
    hint: "When comparing the seniority of siblings within the same family, use this comparative adjective.",
    workedSolution: "'Elder' is the specific attributive adjective used to denote seniority among family members, especially brothers and sisters ('elder sister').",
    points: 1
  },
  {
    number: 9,
    prompt: "The canteen vendor could not serve porridge because she had ........... sugar left.",
    options: ["a little", "very little", "a few", "very few"],
    correctAnswer: "very little",
    hint: "'Sugar' is an uncountable noun. To show an insufficient amount with a negative meaning, use this quantifier without an article.",
    workedSolution: "'Sugar' is non-count. 'Very little' has a negative meaning indicating scarcely any, explaining why porridge could not be served. 'A little' has a positive meaning (some).",
    points: 1
  },
  {
    number: 10,
    prompt: "You must not disclose our confidential plans to ........... in the community.",
    options: ["no other", "nobody", "any other", "anyone"],
    correctAnswer: "anyone",
    hint: "A negative clause containing 'not' takes an open non-assertive pronoun to avoid a double negative.",
    workedSolution: "Because the sentence already contains the negative particle 'not', the indefinite pronoun 'anyone' must be used to avoid a double negative like 'not ... nobody'.",
    points: 1
  },
  {
    number: 11,
    prompt: "A dedicated prefect ........... bear the burden of school discipline alone.",
    options: ["needs not", "need not", "needs not to", "need not to"],
    correctAnswer: "need not",
    hint: "When 'need' functions as a semi-modal auxiliary verb in the negative, it takes no third-person '-s' and no 'to'.",
    workedSolution: "When 'need' functions as a modal auxiliary, it remains 'need not' (without the third-person singular '-s') and is followed by a bare infinitive without 'to' ('need not bear').",
    points: 1
  },
  {
    number: 12,
    prompt: "The traditional water cooler is made .......... clay.",
    options: ["with", "by", "of", "in"],
    correctAnswer: "of",
    hint: "When a material maintains its basic physical identity after manufacturing, use 'made of'.",
    workedSolution: "'Made of' is used when the basic material has not undergone a chemical transformation and is still recognizable in the finished product ('made of clay').",
    points: 1
  },
  {
    number: 13,
    prompt: "Let us go to the school farm and weed the maize plot, ..........?",
    options: ["will you", "shall we", "can you", "would you"],
    correctAnswer: "shall we",
    hint: "Proposals or suggestions beginning with 'Let's' or 'Let us' take a specific first-person plural question tag.",
    workedSolution: "Imperative sentences beginning with 'Let us' or 'Let's' express a joint proposal and invariably take the question tag 'shall we?'.",
    points: 1
  },
  {
    number: 14,
    prompt: "Ama would have passed the scholarship interview ........... she prepared thoroughly.",
    options: ["should", "had", "has", "could"],
    correctAnswer: "had",
    hint: "In an inverted Third Conditional without 'if', the auxiliary verb starts the conditional clause.",
    workedSolution: "Inverted conditional clauses replace 'if she had prepared' with the inversion 'had she prepared'.",
    points: 1
  },
  {
    number: 15,
    prompt: "The four village elders haven't spoken to ........... since the land dispute began.",
    options: ["theirself", "each another", "themselves", "one another"],
    correctAnswer: "one another",
    hint: "When reciprocal action involves more than two individuals, use this phrase.",
    workedSolution: "'One another' is preferred when reciprocal action involves more than two entities ('the four village elders'). 'Each other' is traditionally used for two.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The trembling child shook with intense terror when the thunder roared.\nChoose the word nearest in meaning to the underlined word 'terror'.",
    options: ["excitement", "cheerfulness", "hope", "fear"],
    correctAnswer: "fear",
    hint: "An unpleasant emotion caused by the threat of danger, pain, or harm.",
    workedSolution: "'Terror' (fright) refers to an overwhelming feeling of dread or alarm; 'fear' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "Community radio is a potent instrument for grassroots development in rural Ghana.\nChoose the word nearest in meaning to the underlined word 'potent'.",
    options: ["fast", "necessary", "powerful", "sound"],
    correctAnswer: "powerful",
    hint: "Having great power, influence, or effect.",
    workedSolution: "'Potent' means having great strength, efficacy, or influence; 'powerful' is its direct synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "Commercial poultry farming in peri-urban areas is a lucrative agricultural enterprise.\nChoose the word nearest in meaning to the underlined word 'lucrative'.",
    options: ["profitable", "legitimate", "desirable", "cherished"],
    correctAnswer: "profitable",
    hint: "Producing a great deal of financial gain or profit.",
    workedSolution: "'Lucrative' means producing wealth or substantial profit; 'profitable' is its exact equivalent.",
    points: 1
  },
  {
    number: 19,
    prompt: "The acute deficit of qualified mathematics teachers in rural schools is alarming.\nChoose the word nearest in meaning to the underlined word 'deficit'.",
    options: ["weakness", "shortage", "suffering", "indiscipline"],
    correctAnswer: "shortage",
    hint: "A state of being in short supply or having an inadequate amount.",
    workedSolution: "'Deficit' (scarcity) refers to an insufficiency or lack in quantity; 'shortage' is the closest synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "The young apprentice was exceptionally inquisitive, asking questions about every engine component.\nChoose the word nearest in meaning to the underlined word 'inquisitive'.",
    options: ["curious", "brilliant", "friendly", "talkative"],
    correctAnswer: "curious",
    hint: "Eager for knowledge and inquiring into details.",
    workedSolution: "'Inquisitive' means eager to know, learn, and investigate; 'curious' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "The coach made the boastful player eat his words after losing the championship match. This means that the player had to ......",
    options: ["become shocked", "be punished", "admit he was wrong", "face the consequences of his actions"],
    correctAnswer: "admit he was wrong",
    hint: "Being forced to retract an arrogant statement and acknowledge an error.",
    workedSolution: "The idiom 'to eat one's words' means to be forced to admit humbly that what one previously said was mistaken or incorrect.",
    points: 1
  },
  {
    number: 22,
    prompt: "The politician's children were born with a silver spoon in their mouths. This means that the children were born ......",
    options: ["with their mouths full of silver", "in good health", "in happy homes", "in wealth and luxury"],
    correctAnswer: "in wealth and luxury",
    hint: "Born into an affluent, prosperous family with privileged circumstances.",
    workedSolution: "'Born with a silver spoon in one's mouth' is an idiom meaning born into an inherited background of great wealth and privilege.",
    points: 1
  },
  {
    number: 23,
    prompt: "The injured driver passed out momentarily upon seeing the wreckage. This means that the driver ......",
    options: ["ran away", "died", "fainted", "vomited"],
    correctAnswer: "fainted",
    hint: "Losing consciousness temporarily due to shock or physical trauma.",
    workedSolution: "The phrasal verb 'to pass out' means to lose consciousness temporarily or faint.",
    points: 1
  },
  {
    number: 24,
    prompt: "Before the announcement of the BECE placement results, Mansa was on edge. This means that Mansa was ......",
    options: ["confused", "surprised", "nervous", "unhappy"],
    correctAnswer: "nervous",
    hint: "In a state of tense, anxious anticipation.",
    workedSolution: "The idiom 'on edge' means feeling anxious, irritable, nervous, or tense.",
    points: 1
  },
  {
    number: 25,
    prompt: "The suspects went to the police charge office like a lamb to the slaughter. This means that they went there ......",
    options: ["with their clothes removed", "without resistance", "with difficulty", "in a violent manner"],
    correctAnswer: "without resistance",
    hint: "Unaware of danger, calm, and offering no struggle or opposition.",
    workedSolution: "'Like a lamb to the slaughter' describes someone who goes quietly, calmly, and without resistance into a dangerous or fatal situation.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "The safety guidelines were strictly observed by the factory workers, but the visitors ...... them.",
    options: ["observed", "violated", "changed", "formulated"],
    correctAnswer: "violated",
    hint: "'Observed' means followed or complied with. Find the word that denotes breaking a rule.",
    workedSolution: "'Observed' means obeyed or complied with. Its direct antonym is 'violated' (infringed or broken).",
    points: 1
  },
  {
    number: 27,
    prompt: "While the conversation in the staff room was informal, the speech delivered by the headmaster was thoroughly ......",
    options: ["informal", "archaic", "formal", "modern"],
    correctAnswer: "formal",
    hint: "'Informal' (or colloquial) is casual. Find the word that denotes ceremonial or standard official usage.",
    workedSolution: "'Informal' (colloquial) refers to casual everyday speech. Its antonym is 'formal' (official, serious, and standard).",
    points: 1
  },
  {
    number: 28,
    prompt: "The girl's natural timidity made her stammer, but her elder brother spoke with remarkable ......",
    options: ["hostility", "sincerity", "boldness", "carelessness"],
    correctAnswer: "boldness",
    hint: "'Timidity' means shyness and lack of confidence. Select the word meaning courage and confidence.",
    workedSolution: "'Timidity' means shyness, hesitation, and fearfulness. Its direct opposite is 'boldness' (confidence and courage).",
    points: 1
  },
  {
    number: 29,
    prompt: "Electoral authorities replaced all opaque ballot containers with ...... glass boxes.",
    options: ["covered", "transparent", "painted", "dark"],
    correctAnswer: "transparent",
    hint: "'Opaque' means not letting light through (cannot be seen through). Find the word meaning completely clear.",
    workedSolution: "'Opaque' describes an object that cannot be seen through. Its direct scientific and linguistic antonym is 'transparent'.",
    points: 1
  },
  {
    number: 30,
    prompt: "Instead of walking briskly to the assembly ground, the reluctant student strolled along ......",
    options: ["slowly", "carefully", "reluctantly", "clumsily"],
    correctAnswer: "slowly",
    hint: "'Briskly' means quickly and energetically. Find the word denoting an unhurried, low speed.",
    workedSolution: "'Briskly' means quickly, actively, and energetically. Its direct antonym is 'slowly'.",
    points: 1
  },

  // --- SECTION E: CLOZE TEST (31 - 35) ---
  {
    number: 31,
    prompt: "In the past, students were dedicated to scholarly excellence. They understood the true ---31--- of education.",
    options: ["essence", "profit", "outcome", "reward"],
    correctAnswer: "essence",
    hint: "The fundamental nature, core quality, or most important feature of something.",
    workedSolution: "In philosophical and educational contexts, the fundamental meaning or core value of a concept is its 'essence'.",
    points: 1
  },
  {
    number: 32,
    prompt: "To attain superior grades, ambitious learners would frequently burn the midnight ---32--- reviewing their notes.",
    options: ["oil", "lamp", "candle", "light"],
    correctAnswer: "oil",
    hint: "Complete the historical idiom referring to studying or working late into the night: 'burn the midnight ......'.",
    workedSolution: "The fixed English idiomatic expression is 'to burn the midnight oil' (meaning to work or study late into the night).",
    points: 1
  },
  {
    number: 33,
    prompt: "However, excessive addiction to social networking platforms has ---33--- many youth of study hours.",
    options: ["deprived", "isolated", "removed", "refused"],
    correctAnswer: "deprived",
    hint: "To dispossess, deny, or prevent someone from possessing or enjoying something.",
    workedSolution: "The verb 'deprive' takes the preposition 'of' ('deprived of study hours') to indicate being denied a necessary resource.",
    points: 1
  },
  {
    number: 34,
    prompt: "Consequently, examination malpractices and academic failure have become the ---34--- of the day.",
    options: ["order", "custom", "habit", "rule"],
    correctAnswer: "order",
    hint: "Complete the common idiom meaning a widespread, customary, or daily occurrence.",
    workedSolution: "The standard English idiom is 'the order of the day' (referring to something very common or fashionable at a particular time).",
    points: 1
  },
  {
    number: 35,
    prompt: "Educators urge that students must remain focused in order to ---35--- the negative consequences of technology.",
    options: ["eradicate", "dismiss", "forget", "ignore"],
    correctAnswer: "eradicate",
    hint: "To destroy completely, eliminate, or root out an undesirable condition.",
    workedSolution: "'Eradicate' means to wipe out, eliminate completely, or root out a social problem or disease.",
    points: 1
  },

  // --- SECTION F: ORAL LANGUAGE (36 - 40) ---
  {
    number: 36,
    prompt: "The congregation sang a peaceful hymn.\nWhich of the following words ends with a silent consonant letter just like the letter 'n' in 'hymn'?",
    options: ["autumn", "action", "spoon", "drain"],
    correctAnswer: "autumn",
    hint: "In 'hymn' (/hɪm/), the letter 'n' is completely silent.",
    workedSolution: "'Hymn' ends with the /m/ sound; the final 'n' is silent. In 'autumn' (/ˈɔː.təm/), the final 'n' is also silent. In the other words, the 'n' is pronounced.",
    points: 1
  },
  {
    number: 37,
    prompt: "The hunter shot an arrow with his bow.\nWhich of the following words has the exact same vowel sound as 'bow' (the weapon)?",
    options: ["doe", "now", "how", "plough"],
    correctAnswer: "doe",
    hint: "'Bow' (the weapon) contains the diphthong /əʊ/ (rhyming with 'go' and 'no').",
    workedSolution: "'Bow' (the weapon) is pronounced /bəʊ/. 'Doe' (/dəʊ/) shares the identical /əʊ/ diphthong. ('now', 'how', 'plough' contain the diphthong /aʊ/).",
    points: 1
  },
  {
    number: 38,
    prompt: "The mason used a plumb line to verify the wall.\nWhich of the following words contains a silent consonant letter just like the 'b' in 'plumb'?",
    options: ["comb", "crab", "globe", "club"],
    correctAnswer: "comb",
    hint: "In 'plumb' (/plʌm/), the final letter 'b' is completely silent.",
    workedSolution: "In 'plumb', the final 'b' is silent. In 'comb' (/kəʊm/), the final 'b' is also silent. In 'crab', 'globe', and 'club', the 'b' is voiced.",
    points: 1
  },
  {
    number: 39,
    prompt: "The choir sang in four-part harmony.\nWhich of the following words begins with the same initial consonant sound as the digraph 'ch' in 'choir'?",
    options: ["chemistry", "charity", "chapel", "channel"],
    correctAnswer: "chemistry",
    hint: "'Choir' begins with the voiceless velar plosive /k/.",
    workedSolution: "'Choir' is pronounced /ˈkwaɪ.ər/, beginning with the /k/ sound. 'Chemistry' (/ˈkem.ɪ.stri/) begins with the same /k/ sound. ('charity', 'chapel', 'channel' begin with /tʃ/).",
    points: 1
  },
  {
    number: 40,
    prompt: "The doctor touched the patient's chest.\nWhich of the following words contains the same vowel sound as the word 'chest'?",
    options: ["bread", "bead", "bleed", "breeze"],
    correctAnswer: "bread",
    hint: "'Chest' contains the short front open-mid vowel sound /e/.",
    workedSolution: "'Chest' contains the short vowel sound /e/. 'Bread' (/bred/) contains the identical short /e/ sound. ('bead', 'bleed', 'breeze' contain the long /iː/ vowel sound).",
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

const assignedTargetIndices = seedShuffle(targetKeys, 202004);

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
        category: "Article for Publication",
        prompt: "Write an article for publication in a national newspaper on the topic: \"The Harmful Effects of Examination Malpractice on Students and the Nation.\"",
        modelAnswer: `THE CANCER OF EXAMINATION MALPRACTICE: A THREAT TO OUR NATION'S FUTURE
By Kofi Boakye, JHS 3

In recent years, the integrity of national examinations in Ghana has been severely undermined by the scourge of examination malpractice. From smuggling unauthorized materials into examination halls to the circulation of leaked examination papers on social media platforms, this fraudulent behavior poses grave consequences for individual students and the nation as a whole.

The primary harmful effect on students is the destruction of academic self-confidence and genuine learning habits. When learners rely on leaked questions—popularly termed 'apor'—they abandon disciplined study, critical thinking, and regular class attendance. In the long run, candidates who cheat their way into Senior High Schools and universities find themselves academically deficient, unable to cope with advanced studies. Many end up disqualified, rusticated, or dismissed in disgrace.

On a national level, examination malpractice produces incompetent professionals and degrades the international credibility of Ghanaian academic certificates. When unmerited candidates cheat their way into sensitive professions such as medicine, nursing, engineering, and teaching, the results are catastrophic: collapsing buildings, medical negligence, and substandard instruction in schools. Furthermore, international examining bodies and universities begin to doubt the authenticity of certificates issued by the West African Examinations Council (WAEC).

To arrest this menace, school administrations and parents must instill moral values into students and stop funding illegal examination syndicates. Additionally, law enforcement agencies must arrest and prosecute rogue website operators and corrupt invigilators. Let us uphold academic honesty, for a nation built on fraudulent credentials is bound to collapse.`
      },
      {
        questionNumber: "2",
        category: "Formal Letter",
        prompt: "As the senior prefect of your school, write a letter to the headmaster, discussing two reasons why the school administration should actively instill moral values into the students.",
        modelAnswer: `Methodist Junior High School
P. O. Box 80
Bekwai, Ashanti Region
12th October, 2020

The Headmaster
Methodist Junior High School
P. O. Box 80
Bekwai

Dear Sir,

THE NEED TO INTENSIFY THE INSTILLATION OF MORAL VALUES AMONG STUDENTS

On behalf of the student representative council, I respectfully write to submit two compelling reasons why our school administration should actively intensify the instillation of moral values and ethical discipline into our students.

First, instilling strong moral values fosters a disciplined and peaceful learning environment. In recent times, cases of bullying, theft of textbooks, insolence toward teachers, and vandalism of school property have risen among junior students. When our school curriculum and weekly assemblies emphasize foundational virtues such as honesty, humility, respect for authority, and empathy, students develop positive peer relations. This reduces disciplinary problems and allows teachers to concentrate on instructional delivery without constant disruptions.

Secondly, moral education produces upright, responsible future citizens who will shun corruption and social vices. Academic brilliance without moral integrity is dangerous; history teaches us that clever individuals devoid of ethics often become sophisticated fraudsters, corrupt officials, and destructive leaders. By incorporating character education, ethical debates, and peer counseling into our school life, our school will nurture well-rounded scholars who will serve their communities with patriotism and integrity.

I therefore propose that the administration introduce a weekly 'Character and Values' session during Friday assemblies and institute awards for students who demonstrate exemplary integrity.

Thank you for your continuous dedication to our welfare.

Yours faithfully,
[Signature]
Samuel Osei
(Senior Prefect)`
      },
      {
        questionNumber: "3",
        category: "Public Speech",
        prompt: "Write a speech you will deliver to the chiefs and people of your community during a town hall meeting on: \"How to Keep Our Environment Clean and Healthy.\"",
        modelAnswer: `A SPEECH DELIVERED BY YAA ADOMAH TO THE CHIEFS AND PEOPLE OF ASUKWAU COMMUNITY ON KEEPING OUR ENVIRONMENT CLEAN AND HEALTHY

Nana Chairman, Respected Chiefs and Elders, Assembly Members, Fellow Youth, and Distinguished Members of our Community:

I stand before you this morning as a youth of Asukwau to share a few thoughts on how we can collectively restore the cleanliness, beauty, and health of our beloved town.

Nananom, it is heartbreaking to observe that our streets and open gutters have been overwhelmed by plastic waste and domestic garbage. Indiscriminate littering and stagnant gutters have made our community a breeding ground for swarms of mosquitoes and houseflies, resulting in frequent outbreaks of malaria, cholera, and typhoid among our infants and aged parents. Cleanliness, as our elders say, is next to godliness, and we cannot fold our arms while filth destroys our health.

To overcome this menace, we must first revive our communal labor tradition. In the past, the sound of the 'gong-gong' mobilized every household on the first Saturday of every month to desilt gutters, clear overgrown weeds around water sources, and sweep public spaces. Our traditional council, led by Nana, should reinstate and strictly enforce these communal clean-up exercises.

Secondly, our local assembly must provide communal waste collection containers at market squares and residential quarters, and enforce sanitation bye-laws. Anyone found dumping refuse into open gutters must be fined by the unit committee. Furthermore, every household should construct a decent toilet facility to eradicate open defecation.

Let us remember that a clean community is a healthy and prosperous community. Together, we can make Asukwau a model of environmental cleanliness.

Thank you all for your kind attention!`
      }
    ]
  },
  sectionB_comprehension: {
    title: "Part B: Reading Comprehension",
    passage: `The academic performance of students in the olden days was golden. Students knew the essence of education and made efforts to achieve excellence. Reading whatever material they came across not only helped their mental development but also made them self-reliant and confident. Students burned the midnight oil in order to make grades and to come out of school as better people.

Unfortunately, the same cannot be said of students today. Whatever students achieved in the past is considered archaic. The emergence of improper technology has bedeviled the society. Students prefer staying in touch with friends and loved ones. The use of social media, such as Facebook, Twitter, WhatsApp, and Instagram, has taken over their entire being. Reading useful materials like dailies, storybooks, and others is now a thing of the past.

The negative influence of social media has deprived students of achieving excellence. Examination malpractices, mass failure in examination, and bad language have become the order of the day.

Modern technology has its own benefits. In addition to serving as a great tool for businesses, it enables students to access information easily. What is more, it enables easy interactions between friends and loved ones. As much as these are important, students should realize that, without good moral practices, education, and reading, the future remains blurred. Students can eradicate the negative effects modern technology has on them if only they remain focused on their academic work.`,
    questions: [
      {
        subId: "(a)",
        question: "State two benefits of reading mentioned in the passage.",
        answer: "1. It helped students' mental development.\n2. It made students self-reliant and confident."
      },
      {
        subId: "(b)",
        question: "For what two reasons did students study late into the night (burn the midnight oil) in the past?",
        answer: "1. In order to make good grades.\n2. To come out of school as better people."
      },
      {
        subId: "(c)",
        question: "State two benefits of modern technology mentioned in the passage.",
        answer: "1. It serves as a great tool for businesses.\n2. It enables students to access information easily (and facilitates easy interaction among friends)."
      },
      {
        subId: "(d)",
        question: "How can students get rid of the harmful influence of modern technology and social media?",
        answer: "By remaining focused on their academic work (along with maintaining good moral practices and consistent reading habits)."
      },
      {
        subId: "(e)",
        question: "Explain in your own words the following expressions as used in the passage:\n(i) Burn the midnight oil;\n(ii) Taken over their entire being;\n(iii) The order of the day.",
        answer: "(i) **Burn the midnight oil:** To study or work late into the night.\n(ii) **Taken over their entire being:** Completely dominated their attention, time, and lifestyle.\n(iii) **The order of the day:** Very common, customary, or widespread occurrences."
      },
      {
        subId: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\n(i) golden;\n(ii) excellence;\n(iii) archaic;\n(iv) blurred;\n(v) eradicate.",
        answer: "(i) **golden:** glorious / outstanding / excellent / splendid.\n(ii) **excellence:** high quality / distinction / superiority / great success.\n(iii) **archaic:** outdated / old-fashioned / antiquated / obsolete.\n(iv) **blurred:** dim / uncertain / gloomy / unclear.\n(v) **eradicate:** eliminate / wipe out / remove / destroy."
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
        extract: "\"Oliver was given a slice of bread and a simple outfit with a brown cap to wear outside. He meekly followed him outside the workhouse to his new home. Once there, he was brought before a committee of ten men\"",
        question: "Write the name of the person referred to as \"him\" in the extract.",
        answer: "Mr. Bumble (the parish beadle)."
      },
      {
        subId: "5(b)",
        textSource: "CHARLES DICKENS: Oliver Twist",
        extract: "\"Once there, he was brought before a committee of ten men...\"",
        question: "State one thing Oliver learns from the \"committee of ten men\".",
        answer: "He learns that he is an orphan and that he is to be apprenticed to Mr. Sowerberry, the undertaker, to make coffins."
      },
      {
        subId: "5(c)",
        textSource: "CHARLES DICKENS: Oliver Twist",
        extract: "Oliver before the board...",
        question: "How does Oliver react to the information and harsh treatment he receives from the committee?",
        answer: "He breaks down and weeps bitterly out of fear, loneliness, and despair."
      },
      {
        subId: "5(d)",
        textSource: "PETER PAUL ADOLINAMA: Ripples",
        extract: "\"Abi, which of your sons died recently or was it your business which collapsed?............ You have not been yourself these few days\"",
        question: "Identify the speaker of the extract above.",
        answer: "Dr. Baako (Abi's close friend and medical doctor)."
      },
      {
        subId: "5(e)",
        textSource: "PETER PAUL ADOLINAMA: Ripples",
        extract: "\"You have not been yourself these few days...\"",
        question: "What is Abi deeply worried about in the story?",
        answer: "He is distressed by complex family disputes, mysterious village rumors, and anxiety over chieftaincy succession."
      },
      {
        subId: "5(f)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "1st WOMAN: If her son gets goodly bag by the month,\nWhy has Esi Kom still not..........\n2nd WOMAN: They never ask \"Why\".\nIs it not the young man's wife?\n1st WOMAN: What has she done now?\n2nd WOMAN: Listen. I hear she swallows money\nAs a hen does corn.",
        question: "Who is referred to as \"the young man's wife\"?",
        answer: "Eulalie Jawondo (Ato Yawson's African-American wife)."
      },
      {
        subId: "5(g)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "\"Is it not the young man's wife?\"",
        question: "State the literary device used in the line \"Is it not the young man's wife?\".",
        answer: "Rhetorical question (a question asked for dramatic effect or assertion without expecting an answer)."
      },
      {
        subId: "5(h)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "\"I hear she swallows money / As a hen does corn.\"",
        question: "What is the meaning of the expression \"she swallows money as a hen does corn\"?",
        answer: "It means that she spends money recklessly, greedily, and excessively (she is a spendthrift)."
      },
      {
        subId: "5(i)",
        textSource: "A. A. AMOAKO: Sleep Without Wake",
        extract: "\"You put me through my infant paces\nOn Gold Coast Ga ShikpƆŋ\nTaa taa, tuu tuu, in your maternal steps,\nMaame Tutuaa, condolences!\"",
        question: "Identify the main literary device used in the title of the poem \"Sleep Without Wake\".",
        answer: "Euphemism (or Metaphor), using 'sleep without wake' to soften and refer to permanent physical death."
      },
      {
        subId: "5(j)",
        textSource: "A. A. AMOAKO: Sleep Without Wake",
        extract: "\"Taa taa, tuu tuu, in your maternal steps...\"",
        question: "The words 'Taa taa, tuu tuu' appeal to the reader's sense of ............",
        answer: "Sense of sound (auditory sense) or kinesthetic sense (movement of a toddler learning to walk)."
      }
    ]
  }
};

// Flattened Paper 2 Questions for Paper2ExamRunner.tsx with AI Essay Workspace
const flattenedPaper2Questions = [
  ...paper2Calibrated.sectionA_essay.questions.map((q) => ({
    id: `essay_${q.questionNumber}`,
    partLabel: `Part A (Question ${q.questionNumber}) - ${q.category}`,
    prompt: q.prompt,
    modelAnswer: q.modelAnswer,
    marks: 30
  })),
  ...paper2Calibrated.sectionB_comprehension.questions.map((q, idx) => ({
    id: `comp_${q.subId}`,
    partLabel: `Part B: Comprehension ${q.subId}`,
    prompt: (idx === 0 ? `Read the passage carefully and answer the questions that follow:\n\n${paper2Calibrated.sectionB_comprehension.passage}\n\n` : '') + q.question,
    modelAnswer: q.answer,
    marks: 5
  })),
  ...paper2Calibrated.sectionC_literature.questions.map((q) => ({
    id: `lit_${q.subId}`,
    partLabel: `Part C: Literature - ${q.textSource} [${q.subId}]`,
    prompt: (q.extract ? `Extract:\n"${q.extract}"\n\n` : '') + q.question,
    modelAnswer: q.answer,
    marks: 2
  }))
];

async function seedBeceEnglish2020Calibrated() {
  const db = await getDb();
  console.log("Seeding Calibrated & Balanced BECE English 2020 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2020");
  await docRef.set({
    year: 2020,
    title: "BECE English Language 2020 (Calibrated National Benchmark)",
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

  console.log("✅ Calibrated BECE English 2020 successfully seeded into Firestore!");
}

seedBeceEnglish2020Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2020:", err);
    process.exit(1);
  });
