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

// 40 Concept-Mapped, Non-Plagiarized Questions
const rawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "The school choir ...... rehearsing their anthem since daybreak.",
    options: ["has been", "is", "was", "would be"],
    correctAnswer: "has been",
    hint: "The time marker 'since' indicates an action that started in the past and continues into the present.",
    workedSolution: "We use the Present Perfect Continuous tense ('has been' + verb-ing) with 'since' to describe an ongoing action initiated in the past.",
    points: 1
  },
  {
    number: 2,
    prompt: "Vegetable harvests have multiplied ...... the community irrigation dam was constructed.",
    options: ["since", "until", "when", "while"],
    correctAnswer: "since",
    hint: "Identify the subordinating conjunction indicating the starting point of an ongoing condition.",
    workedSolution: "'Since' links a present perfect outcome ('harvests have multiplied') to a specific historical starting point in the past.",
    points: 1
  },
  {
    number: 3,
    prompt: "To ...... was the registered parcel addressed?",
    options: ["who", "whoever", "whom", "whomever"],
    correctAnswer: "whom",
    hint: "Pronouns following prepositions like 'to', 'for', and 'from' take the objective case.",
    workedSolution: "'Whom' is the objective relative/interrogative pronoun required immediately after a preposition ('to whom').",
    points: 1
  },
  {
    number: 4,
    prompt: "Arrange the chairs neatly in the hall, ......?",
    options: ["do you", "have you", "will you", "may you"],
    correctAnswer: "will you",
    hint: "Imperative sentences expressing polite directives or instructions take a willingness tag.",
    workedSolution: "Commands and requests (imperatives) form question tags using 'will you?' (or 'won't you?').",
    points: 1
  },
  {
    number: 5,
    prompt: "Abena bought lovely handwoven kente cloths for her three ......",
    options: ["sisters-in-law", "sister's-in-law", "sisters-in-laws", "sisters'-in-law"],
    correctAnswer: "sisters-in-law",
    hint: "Pluralize the principal head noun in a hyphenated compound noun, not the prepositional phrase.",
    workedSolution: "In hyphenated compound nouns, the plural inflection '-s' is attached to the primary base noun ('sister'), resulting in 'sisters-in-law'.",
    points: 1
  },
  {
    number: 6,
    prompt: "Students are instructed to always ...... the hurricane lanterns before leaving the dormitory.",
    options: ["off", "put off", "put out", "out"],
    correctAnswer: "put out",
    hint: "Identify the correct phrasal verb meaning to extinguish a light or a flame.",
    workedSolution: "'Put out' means to extinguish a flame or light. 'Put off' means to postpone.",
    points: 1
  },
  {
    number: 7,
    prompt: "There were ...... spectators at the district football finals.",
    options: ["a little", "much", "plenty", "many"],
    correctAnswer: "many",
    hint: "'Spectators' is a countable plural noun.",
    workedSolution: "'Many' qualifies plural countable nouns ('spectators'). 'Much' and 'a little' apply strictly to non-count nouns.",
    points: 1
  },
  {
    number: 8,
    prompt: "The new textbook is ...... than the old edition.",
    options: ["expensive more rather", "expensive rather more", "more expensive rather", "rather more expensive"],
    correctAnswer: "rather more expensive",
    hint: "The modifying adverb of degree precedes the comparative adjective construction.",
    workedSolution: "The degree adverb 'rather' naturally modifies and precedes the comparative adjective 'more expensive'.",
    points: 1
  },
  {
    number: 9,
    prompt: "The bridge was ..... narrow for two heavy trucks to pass simultaneously.",
    options: ["even", "so", "too", "very"],
    correctAnswer: "too",
    hint: "Look for the correlative structure indicating an excessive degree that causes an impossible outcome.",
    workedSolution: "The pattern 'too + adjective + to [infinitive]' conveys that an extreme quality prevents an action.",
    points: 1
  },
  {
    number: 10,
    prompt: "The master urged both prefects to resolve disputes and cooperate with ......",
    options: ["each other", "each one", "ourselves", "themselves"],
    correctAnswer: "each other",
    hint: "Use this reciprocal pronoun when an action is shared between exactly two parties.",
    workedSolution: "'Each other' is used when referring to two individuals. 'One another' is used for groups of three or more.",
    points: 1
  },
  {
    number: 11,
    prompt: "If the river overflowed its banks, the villagers ...... their low-lying farms.",
    options: ["will have abandoned", "will abandon", "would have abandoned", "would abandon"],
    correctAnswer: "would abandon",
    hint: "Second Conditional: 'If + past simple verb', followed by 'would + base verb'.",
    workedSolution: "The hypothetical past condition 'If the river overflowed' requires 'would + base verb' ('would abandon') in the main clause.",
    points: 1
  },
  {
    number: 12,
    prompt: "Out of the eight candidates interviewed for the library position, the committee found ...... suitable.",
    options: ["both", "each", "neither", "none"],
    correctAnswer: "none",
    hint: "When rejecting every option among three or more items, choose this negative quantifier.",
    workedSolution: "'None' is used to negate three or more entities. 'Neither' is strictly reserved for a choice between two.",
    points: 1
  },
  {
    number: 13,
    prompt: "Conceited individuals continually boast about ...... in public gatherings.",
    options: ["herself", "myself", "ourselves", "themselves"],
    correctAnswer: "themselves",
    hint: "Match the plural third-person subject ('individuals') with its corresponding reflexive pronoun.",
    workedSolution: "The plural third-person noun phrase 'Conceited individuals' takes the reflexive pronoun 'themselves'.",
    points: 1
  },
  {
    number: 14,
    prompt: "Kweku asked Kofi, \"Did you visit the regional museum yesterday?\"\nIn indirect speech, this becomes: Kweku asked Kofi ......",
    options: [
      "did he visit the regional museum the previous day",
      "whether he visited the regional museum yesterday",
      "if he had visited the regional museum the previous day",
      "if he had visited the regional museum yesterday"
    ],
    correctAnswer: "if he had visited the regional museum the previous day",
    hint: "Past simple shifts to past perfect ('had visited') and 'yesterday' becomes 'the previous day'.",
    workedSolution: "In indirect yes/no questions, the reporting conjunction 'if/whether' is introduced, the simple past 'did visit' shifts to past perfect 'had visited', and 'yesterday' becomes 'the previous day'.",
    points: 1
  },
  {
    number: 15,
    prompt: "Had the masons completed the classroom block before the rainy season?\nIn passive voice, this becomes: ...... the classroom block been completed by the masons before the rainy season?",
    options: ["Were", "Has", "Had", "Was"],
    correctAnswer: "Had",
    hint: "Retain the past perfect auxiliary 'Had' at the beginning of the inverted passive question.",
    workedSolution: "The passive transformation of a past perfect question retains the auxiliary 'Had' + subject + 'been' + past participle.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "His deceptive business dealings made investors distrust him.\nChoose the word nearest in meaning to 'deceptive'.",
    options: ["deceitful", "disrespectful", "untrue", "unforgiving"],
    correctAnswer: "deceitful",
    hint: "Misleading others deliberately to gain an unfair advantage.",
    workedSolution: "'Deceptive' means intending to mislead or trick; 'deceitful' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "The eyewitness gave a comprehensive account of the traffic accident.\nChoose the word nearest in meaning to 'comprehensive'.",
    options: ["clear", "detailed", "interesting", "realistic"],
    correctAnswer: "detailed",
    hint: "Covering all essential facts, items, and aspects thoroughly.",
    workedSolution: "'Comprehensive' means complete, inclusive, and thorough; 'detailed' is the closest synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "Management rejected all the formal appeals submitted by the workers' union.\nChoose the word nearest in meaning to 'appeals'.",
    options: ["agitations", "complaints", "objections", "requests"],
    correctAnswer: "requests",
    hint: "Formal submissions asking for assistance, relief, or changes.",
    workedSolution: "'Appeals' in this context refers to formal applications or solicitations, making 'requests' the nearest equivalent.",
    points: 1
  },
  {
    number: 19,
    prompt: "Meteorologists anticipated that heavy rainfall would flood the coastal basin.\nChoose the word nearest in meaning to 'anticipated'.",
    options: ["broadcast", "calculated", "observed", "predicted"],
    correctAnswer: "predicted",
    hint: "Stating or expecting an event prior to its occurrence.",
    workedSolution: "'Anticipated' means expected or foretold based on evidence; its synonym is 'predicted'.",
    points: 1
  },
  {
    number: 20,
    prompt: "The mischievous boy deliberately spilled ink on the clean tablecloth.\nChoose the word nearest in meaning to 'deliberately'.",
    options: ["carelessly", "hurriedly", "intentionally", "occasionally"],
    correctAnswer: "intentionally",
    hint: "Done on purpose rather than by accident.",
    workedSolution: "'Deliberately' means done with full intent and conscious choice; 'intentionally' is the synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "Upon hearing the siren of the approaching patrol team, the illegal miners took to their heels. This means that the miners ......",
    options: ["hurried up", "joined them", "run away", "walked gracefully"],
    correctAnswer: "run away",
    hint: "Fleeing rapidly from perceived danger.",
    workedSolution: "The idiom 'to take to one's heels' means to flee or run away quickly in fear.",
    points: 1
  },
  {
    number: 22,
    prompt: "The two assembly members are constantly at loggerheads over community development projects. This means that they ......",
    options: [
      "are usually seen walking together",
      "have often exchanged ideas",
      "have often had strong disagreements",
      "usually have the same views on issues"
    ],
    correctAnswer: "have often had strong disagreements",
    hint: "Engaged in persistent conflict and sharp opposition.",
    workedSolution: "To be 'at loggerheads' means to be in strong disagreement, dispute, or conflict.",
    points: 1
  },
  {
    number: 23,
    prompt: "After losing his inheritance, Kwame determined to paddle his own canoe. This means that Kwame ......",
    options: [
      "is independent and needs no help from others",
      "does not interfere in other people's matters",
      "has no help in his fishing business",
      "works hard to feed myself and my family"
    ],
    correctAnswer: "is independent and needs no help from others",
    hint: "Relying strictly on your own personal efforts and resources.",
    workedSolution: "'To paddle one's own canoe' means to be self-reliant, self-sufficient, and independent.",
    points: 1
  },
  {
    number: 24,
    prompt: "The fraudulent trader attempted to pull wool over our eyes regarding the real price. This means that the trader tried to ......",
    options: ["cheat us", "deceive us", "fight us", "make us blind"],
    correctAnswer: "deceive us",
    hint: "Hiding the truth behind false appearances.",
    workedSolution: "'To pull wool over someone's eyes' (or throw dust in their eyes) means to mislead or deceive someone.",
    points: 1
  },
  {
    number: 25,
    prompt: "Ever since he was appointed senior prefect, Mensah has been full of himself. This means that Mensah is ......",
    options: ["arrogant", "dangerous", "greedy", "quarrelsome"],
    correctAnswer: "arrogant",
    hint: "Having an inflated, proud opinion of one's own importance.",
    workedSolution: "To be 'full of oneself' means to be boastful, excessively proud, conceited, or arrogant.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "While some leaders make impetuous choices, statesmanlike leaders make ...... moves.",
    options: ["calculated", "smart", "delayed", "final"],
    correctAnswer: "calculated",
    hint: "'Impetuous' means rash and hasty. Select a word meaning carefully thought out and planned.",
    workedSolution: "'Impetuous' means impulsive and hasty. Its opposite is 'calculated', meaning deliberate and planned.",
    points: 1
  },
  {
    number: 27,
    prompt: "The school administration acted with strict fairness, but the arbiter handled the dispute with ......",
    options: ["fairness", "happiness", "patience", "partiality"],
    correctAnswer: "partiality",
    hint: "'Fairness' means justice for all. Choose a word that denotes bias or favoritism.",
    workedSolution: "The antonym of 'fairness' (impartiality) is 'partiality' (bias or unfair favoritism).",
    points: 1
  },
  {
    number: 28,
    prompt: "The suspect concealed the stolen documents, but his accomplice ...... them to the police.",
    options: ["disclosed", "gathered", "found", "planted"],
    correctAnswer: "disclosed",
    hint: "'Concealed' means hid from sight. Choose a word meaning made known or revealed.",
    workedSolution: "'Concealed' means kept secret or hidden. The opposite is 'disclosed', meaning revealed or made public.",
    points: 1
  },
  {
    number: 29,
    prompt: "The headmaster publicly condemned the rowdy pupils but ...... the disciplined prefects.",
    options: ["advised", "commended", "embraced", "harassed"],
    correctAnswer: "commended",
    hint: "'Condemned' means criticized severely. Find the word that denotes praise.",
    workedSolution: "'Condemned' means censured or denounced. Its antonym is 'commended', meaning praised officially.",
    points: 1
  },
  {
    number: 30,
    prompt: "The landlord is notoriously stingy toward his tenants, yet he is ...... toward charity homes.",
    options: ["friendly", "generous", "strict", "wicked"],
    correctAnswer: "generous",
    hint: "'Stingy' means tight-fisted. Choose the word meaning open-handed and giving freely.",
    workedSolution: "'Stingy' means reluctant to give or spend. Its direct antonym is 'generous'.",
    points: 1
  },

  // --- SECTION E: CLOZE PASSAGE (31 - 35) ---
  {
    number: 31,
    prompt: "Korkor completed her vocational diploma in catering. Armed with her certificate, she set out to ---31--- gainful employment.",
    options: ["seek", "request", "search", "look"],
    correctAnswer: "seek",
    hint: "Identify the formal verb that collocates with 'employment'.",
    workedSolution: "The standard English collocation is 'to seek employment' (meaning to look for a job).",
    points: 1
  },
  {
    number: 32,
    prompt: "She submitted resumes to numerous hotel establishments but was ---32--- in securing an immediate placement.",
    options: ["unlucky", "disappointed", "unfortunate", "unsuccessful"],
    correctAnswer: "unsuccessful",
    hint: "Which adjective pairs with the preposition 'in' plus a gerund ('in securing')?",
    workedSolution: "'Unsuccessful' correctly takes the preposition 'in' followed by a gerund ('unsuccessful in securing').",
    points: 1
  },
  {
    number: 33,
    prompt: "Her elder brother advised her to check the national dailies daily for ---33--- of vacant positions.",
    options: ["advertisements", "announcements", "information", "notices"],
    correctAnswer: "advertisements",
    hint: "Notices published in print media inviting job applications.",
    workedSolution: "Published listings of vacant job posts are termed 'advertisements' (or job adverts).",
    points: 1
  },
  {
    number: 34,
    prompt: "Eventually, a five-star resort announced an opening for a ---34--- pastry chef with recognized trade diplomas.",
    options: ["professional", "certified", "skilled", "responsible"],
    correctAnswer: "certified",
    hint: "An individual holding formal accredited qualifications.",
    workedSolution: "A practitioner with official credentials and accredited training is described as 'certified'.",
    points: 1
  },
  {
    number: 35,
    prompt: "The resort required a candidate who was ---35--- in French culinary methods.",
    options: ["proficient", "specialized", "knowledgeable", "competent"],
    correctAnswer: "proficient",
    hint: "Which adjective meaning highly skilled pairs with the preposition 'in'?",
    workedSolution: "'Proficient' collocates with 'in' (e.g., 'proficient in French culinary methods') to indicate competence.",
    points: 1
  },

  // --- PART B: ORAL LANGUAGE - SPEECH SOUNDS (36 - 40) ---
  {
    number: 36,
    prompt: "The congregation sang a solemn psalm.\nWhich of the following words has the same initial consonant sound as the word 'psalm'?",
    options: ["shall", "palm", "sand", "page"],
    correctAnswer: "sand",
    hint: "The letter 'p' is silent in 'psalm' (/sɑːm/). Focus on the starting sound /s/.",
    workedSolution: "'Psalm' is pronounced /sɑːm/, beginning with the voiceless alveolar fricative /s/. 'Sand' (/sænd/) begins with the same sound.",
    points: 1
  },
  {
    number: 37,
    prompt: "The vehicle skidded along the dangerous curve.\nWhich of the following words has the same initial consonant sound as the word 'curve'?",
    options: ["chain", "cell", "ciao", "colonel"],
    correctAnswer: "colonel",
    hint: "The 'c' in 'curve' represents the /k/ sound. Note that 'colonel' is pronounced /ˈkɜːnəl/.",
    workedSolution: "'Curve' begins with the voiceless velar plosive /k/. 'Colonel' is pronounced /ˈkɜːnəl/, beginning with the identical /k/ sound.",
    points: 1
  },
  {
    number: 38,
    prompt: "Our school team won the championship game.\nWhich of the following words has the same initial consonant sound as the word 'game'?",
    options: ["giant", "general", "gentle", "goat"],
    correctAnswer: "goat",
    hint: "'Game' begins with a hard 'g' sound (/ɡ/), not a soft 'j' sound (/dʒ/).",
    workedSolution: "'Game' starts with the voiced velar plosive /ɡ/. 'Goat' begins with the same /ɡ/ sound. The others start with /dʒ/.",
    points: 1
  },
  {
    number: 39,
    prompt: "The children rested under the shade for an hour.\nWhich of the following words has the same vowel sound as the word 'hour'?",
    options: ["bowl", "your", "tour", "owl"],
    correctAnswer: "owl",
    hint: "'Hour' has a silent 'h' and is pronounced with the diphthong/glide /aʊ/.",
    workedSolution: "'Hour' is pronounced /aʊər/. Its core vowel sound is /aʊ/, which matches the vowel sound in 'owl' (/aʊl/).",
    points: 1
  },
  {
    number: 40,
    prompt: "Shoppers stood patiently in the long queue.\nWhich of the following words has the same vowel sound as the word 'queue'?",
    options: ["fee", "cool", "quest", "few"],
    correctAnswer: "few",
    hint: "'Queue' is pronounced /kjuː/. Match the vowel glide /juː/.",
    workedSolution: "'Queue' is pronounced /kjuː/, containing the /juː/ sound. 'Few' is pronounced /fjuː/, sharing the identical vowel-glide sound.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 202609);

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
    title: "Part A: Writing (Composition)",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Formal Letter",
        prompt: "Under the new Basic School curriculum, schools are encouraged to expand their practical course offerings. Write a letter to your headteacher suggesting two practical subjects that should be introduced in your school, giving two convincing reasons for each choice.",
        modelAnswer: `Methodist Junior High School\nP. O. Box 112\nEffiduase, Ashanti Region\n18th October, 2025\n\nThe Headteacher\nMethodist Junior High School\nP. O. Box 112\nEffiduase\n\nDear Sir,\n\nREQUEST FOR THE INTRODUCTION OF COMPUTING AND AGRICULTURAL SCIENCE\n\nI respectfully write on behalf of the student body to commend your leadership and to suggest the addition of two practical subjects to our school's curriculum: Computing and Agricultural Science.\n\nFirst, introducing Computing will equip us with essential digital skills. We live in an era where modern vocations and further studies require computer literacy. Offering practical Computing classes will enable students to develop proficiency in word processing, basic programming, and internet research. This training will not only improve our performance in the BECE but also prepare us to compete effectively in our technologically advancing society.\n\nSecondly, I recommend Agricultural Science. Our community is endowed with fertile arable land, yet many youth lack modern farming knowledge. Through practical agriculture, we can learn scientific crop cultivation, modern vegetable production, and poultry keeping. The food produced from our school demonstration farm could supplement our canteen feeding, while teaching students viable entrepreneurial agricultural skills for the future.\n\nIn conclusion, offering Computing and Agricultural Science will broaden our educational foundation and make our school experience more practical. I trust you will consider this request favorably.\n\nThank you.\n\nYours faithfully,\n[Signature]\nKofi Boateng\n(School Prefect)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "The government has recently added new statutory public holidays to the national calendar. Write an article for publication in a national newspaper discussing two effects of frequent public holidays on teaching and learning in basic schools.",
        modelAnswer: `THE IMPACT OF FREQUENT PUBLIC HOLIDAYS ON BASIC EDUCATION IN GHANA\nBy Patricia Arthur, JHS 3\n\nStatutory public holidays are gazetted to commemorate historical milestones, honor national patriots, and afford workers rest. However, when these holidays recur too frequently during the school term, they exert noticeable effects on instructional delivery across basic schools in Ghana.\n\nThe primary negative impact is the reduction of instructional contact hours and disruption of syllabus completion. The basic school academic calendar is strictly programmed with termly schemes of work. When holidays fall on weekdays, teachers lose valuable teaching periods. In foundational subjects such as Mathematics and Science, where sequential understanding is necessary, these breaks disrupt learners' concentration, forcing teachers to rush through syllabuses as national examinations approach.\n\nConversely, a positive effect is that public holidays provide essential mental relaxation for teachers and learners. The demands of continuous assessment, club activities, and long daily commuting often cause pupil burnout. A mid-week or long-weekend break allows students to recharge their mental faculties, revise their notes at home, and return to school with renewed vigor and enhanced attention.\n\nTo maximize benefits and minimize disruption, school administrations should organize scheduled remedial classes to compensate for lost instructional time whenever holidays occur.`
      },
      {
        questionNumber: "3",
        category: "Narrative Essay",
        prompt: "Write a story about an experience that cured you of feelings of inferiority and taught you to value your own unique talents, ending with the statement: \"I will never compare myself with anyone again.\"",
        modelAnswer: `For years, I lived under the heavy shadow of self-doubt. My classmate and closest friend, Yaw, was celebrated as the academic genius of our school; he solved difficult mathematical problems effortlessly and earned top marks in every examination. Watching him receive continuous applause from teachers made me feel inadequate, slow, and worthless.\n\nMy turnaround came during the annual inter-school creative arts and storytelling festival. My English master, Mr. Mensah, recognized my passion for writing and persuaded me to represent our school in the creative writing contest. Seeing contestants from prominent urban academies armed with elaborate reference books intimidated me. My hands shook as I picked up my pen.\n\nWhen the writing prompt was revealed, however, all anxiety dissolved. I drew from the rich traditional folklore told by my grandfather by the hearth. I crafted an imaginative narrative detailing rural courage, using vivid descriptive imagery and traditional proverbs. For two uninterrupted hours, words flowed onto my paper without hesitation.\n\nA week later at morning assembly, our headmaster announced that our school had won first place in the entire municipal district. Hearing my name announced as the overall winner brought tears of joy to my eyes. That victory taught me that human gifts are diverse and incomparable. I walked back to my classroom with self-assurance, promising myself: I will never compare myself with anyone again.`
      }
    ]
  },
  sectionB_comprehension: {
    title: "Part B: Reading Comprehension",
    passage: `At twelve, my father introduced me to the virtues of integrity and diligence. He emphasized that a person's good name is worth far more than material riches, and I resolved to make honesty my guiding principle. Whenever I failed to speak the truth, my conscience rebuked me until I made amends. Soon, integrity became my defining quality.\n\nAfter completing Junior High School, my uncle, Kwadwo, invited me to live with him in the city to manage his household, as his older children had migrated overseas in search of greener pastures. Impressed by my reliability and tidiness, he insisted that I remain with him through my Senior High School education.\n\nLater, Uncle Kwadwo traveled abroad for the best part of a year to visit his family, placing his residence and bank deposits under the care of his security officer, Braimah, and me. Shortly after his departure, Braimah approached me with a corrupt scheme: we should stage a fake robbery with local burglars, plunder the house, and divide the stolen valuables. Despite his threats and cajoling, I vehemently refused to betray my uncle's trust. Fearing exposure, Braimah abandoned his post and fled.\n\nWhen Uncle Kwadwo returned and discovered my steadfastness, he promised a handsome reward. Although years elapsed without any visible gift, my loyalty bore fruit when the unexpected happened. Following his peaceful passing, his children revealed that their father had bequeathed a modern dwelling and an educational fund to me. Reflecting on my journey, I realized that uprightness always reaps enduring rewards.`,
    questions: [
      {
        subId: "(a)",
        question: "State the main moral difference between the narrator and Braimah as depicted in the passage.",
        answer: "The narrator was upright, trustworthy, and loyal, whereas Braimah was corrupt, treacherous, and dishonest."
      },
      {
        subId: "(b)",
        question: "Why did Uncle Kwadwo insist on keeping the narrator with him after Senior High School?",
        answer: "Because the narrator was hardworking, dependable, and consistently met the uncle's expectations in managing the household."
      },
      {
        subId: "(c)",
        question: "Why did the narrator reject Braimah's plan to stage a robbery?",
        answer: "Because the narrator was devoted to the principles of integrity taught by his father and refused to compromise his conscience."
      },
      {
        subId: "(d)",
        question: "\"Following his peaceful passing, his children revealed...\"\nWhat does this show happened to Uncle Kwadwo?",
        answer: "Uncle Kwadwo passed away (died)."
      },
      {
        subId: "(e)",
        question: "Explain the meaning of the following expressions as used in the passage:\n(i) in search of greener pastures;\n(ii) for the best part of a year;\n(iii) made amends.",
        answer: "(i) **in search of greener pastures:** Seeking better economic opportunities, higher wages, or better living conditions abroad.\n(ii) **for the best part of a year:** For most of the year (more than half a year).\n(iii) **made amends:** Corrected his mistakes or apologized and put things right."
      },
      {
        subId: "(f)",
        question: "For each of the following words, provide a synonym that can replace it in the passage without altering the meaning:\n(i) diligence;\n(ii) vehemently;\n(iii) bequeathed;\n(iv) enduring.",
        answer: "(i) **diligence:** hard work / dedication / industriousness.\n(ii) **vehemently:** strongly / firmly / forcefully.\n(iii) **bequeathed:** willed / granted / gifted / left.\n(iv) **enduring:** lasting / permanent / lifelong."
      },
      {
        subId: "(g)",
        question: "In two sentences of not more than ten words each,\n(i) summarize the main moral lesson of the story;\n(ii) provide a suitable title for the passage.",
        answer: "(i) **Lesson:** Honesty and loyalty bring lasting rewards in life. [8 words]\n(ii) **Title:** The Enduring Triumph of Integrity. [5 words]"
      }
    ]
  },
  sectionC_literature: {
    title: "Part C: Literature in English (The Cockcrow Anthology)",
    instructions: "Answer all questions in this part based on the prescribed texts.",
    questions: [
      {
        subId: "5(a)",
        textSource: "AMA ATAA AIDOO: The Dilemma of a Ghost",
        extract: "Nana: Yes, I am sitting here. So you thought I was dead?\nNo, I am not. Go home, good neighbours and\nsave your tears for my funeral. It cannot be long now ...",
        question: "Who are the \"good neighbours\" addressed in the extract?",
        answer: "The sympathizing clan members and villagers of the Odumna family in Esikuma."
      },
      {
        subId: "5(b)",
        textSource: "AMA ATAA AIDOO: The Dilemma of a Ghost",
        extract: "It cannot be long now ...",
        question: "Why does Nana express the view that her death is imminent?",
        answer: "She is frail, burdened by old age, and feels worn down by family worries."
      },
      {
        subId: "5(c)",
        textSource: "AMA ATAA AIDOO: The Dilemma of a Ghost",
        extract: "Nana's opening address...",
        question: "Identify the dominant mood of Nana in this extract.",
        answer: "A somber, sarcastic, and reflective mood."
      },
      {
        subId: "5(d)",
        textSource: "KOBENA EYI ACQUAH: A Wreath of Tears",
        extract: "Your funeral\nwas so quiet, and small-\nalmost too small, it is said\nfor a man your stature\nYou must\nHave preferred it that way",
        question: "Classify this poem according to its poetic genre.",
        answer: "An elegy (or dirge), which is a poem of mourning and tribute to a deceased person."
      },
      {
        subId: "5(e)",
        textSource: "KOBENA EYI ACQUAH: A Wreath of Tears",
        extract: "You must\nHave preferred it that way",
        question: "What character trait of the deceased is revealed in these lines?",
        answer: "Humility, modesty, and a preference for simplicity over ostentation."
      },
      {
        subId: "5(f)",
        textSource: "EVELYN TOOLEY HUNT: Mama is a Sunrise",
        extract: "When she come slip-footing through the door,\nshe kindles us\nlike lump coal lighted\nand we wake up glowing.\nShe puts a spark even in Papa's eyes\nand turns out all our darkness.",
        question: "Name the literary device used in the line 'and turns out all our darkness'.",
        answer: "Metaphor."
      },
      {
        subId: "5(g)",
        textSource: "EVELYN TOOLEY HUNT: Mama is a Sunrise",
        extract: "Mama is a Sunrise",
        question: "Identify the figure of speech used in the title of the poem.",
        answer: "Metaphor (directly equating Mama's warmth and radiance to the rising sun without using 'as' or 'like')."
      },
      {
        subId: "5(h)",
        textSource: "ERNEST HEMINGWAY: A Day's Wait",
        extract: "I thought perhaps he was a little light-headed\nand after giving him the prescribed capsules\nat eleven o'clock, I went out for a while.",
        question: "What behavior exhibited by Schatz led his father to suspect he was light-headed?",
        answer: "Schatz sat in bed with a rigid, detached stare, refusing to sleep because he mistakenly believed his high fever meant imminent death."
      },
      {
        subId: "5(i)",
        textSource: "ERNEST HEMINGWAY: A Day's Wait",
        extract: "I went out for a while.",
        question: "What activity did the father undertake while he was away?",
        answer: "He went hunting for quail in the snowy countryside with his dog."
      },
      {
        subId: "5(j)",
        textSource: "ERNEST HEMINGWAY: A Day's Wait",
        extract: "Resolution of Schatz's misconception...",
        question: "Describe Schatz's emotional state once the misunderstanding between Fahrenheit and Celsius was explained.",
        answer: "He experienced profound relief, though he remained emotionally exhausted from the burden of anticipating his own death."
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

async function seedBeceEnglish2025Calibrated() {
  const db = await getDb();
  console.log("Seeding Calibrated & Balanced BECE English 2025 into Firestore...");

  // Key Balance Audit
  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  balancedPaper1.forEach((q) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log("Verified Key Balance (10 of each):", keyDist);

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2025");
  await docRef.set({
    year: 2025,
    title: "BECE English Language 2025 (Calibrated National Benchmark)",
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

  console.log("✅ Calibrated BECE English 2025 successfully seeded into Firestore.");
}

seedBeceEnglish2025Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2025:", err);
    process.exit(1);
  });
