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
    prompt: "A stitch in time saves nine, ......?",
    options: ["shan't it", "isn't it", "doesn't it", "can't it"],
    correctAnswer: "doesn't it",
    hint: "Proverbs treated as singular statements in the present simple tense take the auxiliary 'does'.",
    workedSolution: "The proverb is an affirmative statement in the simple present tense with a singular subject ('A stitch in time saves...'). It takes the negative tag 'doesn't it?'.",
    points: 1
  },
  {
    number: 2,
    prompt: "You cannot cross the swollen river alone, ...... you?",
    options: ["couldn't", "can", "don't", "did"],
    correctAnswer: "can",
    hint: "A negative statement with 'cannot' takes an affirmative tag with the same modal auxiliary.",
    workedSolution: "The sentence contains the negative modal 'cannot'. The corresponding question tag must be positive: 'can you?'.",
    points: 1
  },
  {
    number: 3,
    prompt: "It is no use ...... over lost opportunities.",
    options: ["cry", "of crying", "crying", "to cry"],
    correctAnswer: "crying",
    hint: "The idiomatic structure 'It is no use...' is followed by a gerund (verb-ing).",
    workedSolution: "The fixed expression 'It is no use' regularly takes a gerund ('crying').",
    points: 1
  },
  {
    number: 4,
    prompt: "Some of the wild mangoes are ...... bitter to be eaten.",
    options: ["more so", "more too", "much too", "much so"],
    correctAnswer: "much too",
    hint: "Use 'much too' before an adjective to intensify an excessive negative degree.",
    workedSolution: "'Much too' modifies an adjective ('bitter') before an infinitive ('to be eaten') to show an excessive degree.",
    points: 1
  },
  {
    number: 5,
    prompt: "......, students must obey school regulations.",
    options: ["The last but not least", "The last but not the least", "Last but not least", "Last but not the least"],
    correctAnswer: "Last but not least",
    hint: "Identify the standard English idiom without redundant articles.",
    workedSolution: "The idiomatic transitional phrase is 'Last but not least'. Adding 'the' is non-standard.",
    points: 1
  },
  {
    number: 6,
    prompt: "Where ...... Kwame and Kweku spending their long vacation?",
    options: ["is", "are", "were", "was"],
    correctAnswer: "are",
    hint: "Two singular subjects joined by 'and' require a plural verb referring to an upcoming future event.",
    workedSolution: "Compound subjects joined by 'and' ('Kwame and Kweku') take the plural auxiliary verb 'are' when expressing future arrangements.",
    points: 1
  },
  {
    number: 7,
    prompt: "The librarian did not ...... any damaged books on the shelf.",
    options: ["find", "found", "finds", "finding"],
    correctAnswer: "find",
    hint: "The negative auxiliary 'did not' is always followed by the base form of the verb.",
    workedSolution: "After 'did not', the main verb must appear in its bare infinitive/base form ('find').",
    points: 1
  },
  {
    number: 8,
    prompt: "Esi lives in her ...... compound house.",
    options: ["father-in-laws'", "fathers-in-laws'", "father's-in-law's", "father-in-law's"],
    correctAnswer: "father-in-law's",
    hint: "To show singular possession in a hyphenated compound noun, add ''s' to the final word.",
    workedSolution: "Singular possessive of compound nouns is formed by attaching ''s' to the last element: 'father-in-law's'.",
    points: 1
  },
  {
    number: 9,
    prompt: "The bride wore a ...... gown to the thanksgiving service.",
    options: ["beautiful silk white gown", "silk white beautiful gown", "white beautiful silk gown", "beautiful white silk gown"],
    correctAnswer: "beautiful white silk gown",
    hint: "Order of adjectives: Opinion ('beautiful') comes before color ('white'), which precedes material ('silk').",
    workedSolution: "Adjective order: Opinion ('beautiful') + Color ('white') + Material ('silk').",
    points: 1
  },
  {
    number: 10,
    prompt: "It was ...... dark to venture into the forest without a torchlight.",
    options: ["too", "very", "much", "so"],
    correctAnswer: "too",
    hint: "Look for the correlative structure 'too + adjective + to-infinitive'.",
    workedSolution: "'Too' pairs with the infinitive 'to venture' to indicate that the degree of darkness prevented the action.",
    points: 1
  },
  {
    number: 11,
    prompt: "This is the brave volunteer ...... saved the drowning child.",
    options: ["whose", "which", "whom", "who"],
    correctAnswer: "who",
    hint: "Use the subjective relative pronoun referring to a person performing an action.",
    workedSolution: "'Who' functions as the subject pronoun referring to a person ('the brave volunteer').",
    points: 1
  },
  {
    number: 12,
    prompt: "The doctor made the patient ...... the bitter herbal mixture.",
    options: ["drink", "drank", "drunk", "to drink"],
    correctAnswer: "drink",
    hint: "Causative verbs like 'made' take an object followed by a bare infinitive without 'to'.",
    workedSolution: "The causative verb 'make' (in the past, 'made') takes a bare infinitive ('drink') without 'to'.",
    points: 1
  },
  {
    number: 13,
    prompt: "It is difficult to determine ...... handwriting this is.",
    options: ["who", "whom", "who's", "whose"],
    correctAnswer: "whose",
    hint: "Use the possessive relative/interrogative pronoun.",
    workedSolution: "'Whose' indicates possession ('whose handwriting'). 'Who's' is a contraction for 'who is' or 'who has'.",
    points: 1
  },
  {
    number: 14,
    prompt: "Neither the teachers nor the headmaster ..... present at the durbar yesterday.",
    options: ["are", "is", "were", "was"],
    correctAnswer: "was",
    hint: "With 'neither...nor', the verb agrees in number with the closer subject.",
    workedSolution: "Proximity rule: In 'neither...nor' constructions, the verb agrees with the subject closest to it ('the headmaster', singular past: 'was').",
    points: 1
  },
  {
    number: 15,
    prompt: "The classroom would look brighter if the pupils ...... the windows.",
    options: ["will clean", "cleans", "cleaned", "would clean"],
    correctAnswer: "cleaned",
    hint: "Conditional Type 2: 'would + base verb' in the main clause requires a simple past verb in the if-clause.",
    workedSolution: "Second Conditional: 'would look' pairs with a simple past verb ('cleaned') in the conditional clause.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "We will not permit anyone to dampen our enthusiasm for the cultural festival.\nChoose the word nearest in meaning to the underlined word 'dampen'.",
    options: ["suppress", "break", "destroy", "lower"],
    correctAnswer: "lower",
    hint: "To dampen enthusiasm means to diminish or reduce its level.",
    workedSolution: "'Dampen' means to make less strong, depress, or reduce; 'lower' is the closest synonym in this context.",
    points: 1
  },
  {
    number: 17,
    prompt: "The disturbance in the market was entirely avoidable.\nChoose the word nearest in meaning to the underlined word 'disturbance'.",
    options: ["trouble", "confusion", "issue", "violence"],
    correctAnswer: "confusion",
    hint: "A noisy state of disorder, agitation, or uproar.",
    workedSolution: "'Disturbance' (commotion) refers to a state of noisy uproar and disorder; 'confusion' is its closest synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "What occurred during the secret deliberation remains confidential.\nChoose the word nearest in meaning to the underlined word 'occurred'.",
    options: ["manifested", "translated", "existed", "happened"],
    correctAnswer: "happened",
    hint: "Taking place or coming to pass.",
    workedSolution: "'Occurred' (transpired) means took place; 'happened' is the direct equivalent.",
    points: 1
  },
  {
    number: 19,
    prompt: "The prefect spends valuable time debating insignificant issues.\nChoose the word nearest in meaning to the underlined word 'insignificant'.",
    options: ["unimportant", "unpleasant", "unacceptable", "unexciting"],
    correctAnswer: "unimportant",
    hint: "Matters of little value, worth, or consequence.",
    workedSolution: "'Insignificant' (trivial) means of small importance or negligible value; 'unimportant' is the synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "The burglars ransacked the entire office building.\nChoose the word nearest in meaning to the underlined word 'ransacked'.",
    options: ["torched", "destroyed", "invaded", "looted"],
    correctAnswer: "looted",
    hint: "Searching thoroughly and stealing items, leaving disorder.",
    workedSolution: "'Ransacked' means searched through a place in a disorderly way and stole valuables; 'looted' is the nearest synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "The captain was informed at the eleventh hour about the change in travel plans. This means the captain was informed ......",
    options: ["very late", "at eleven o'clock", "immediately", "in good time"],
    correctAnswer: "very late",
    hint: "At the latest possible moment before an event.",
    workedSolution: "'At the eleventh hour' means at the very last moment or very late.",
    points: 1
  },
  {
    number: 22,
    prompt: "Despite our amusing jokes, the headmaster kept a straight face. This means that the headmaster ......",
    options: ["did not listen to us", "looked straight ahead", "refused to laugh", "cried all the more"],
    correctAnswer: "refused to laugh",
    hint: "Maintaining a serious expression despite comedic efforts.",
    workedSolution: "'To keep a straight face' means to maintain a serious, composed expression and refrain from laughing or smiling.",
    points: 1
  },
  {
    number: 23,
    prompt: "When the tenant vacated the premises, he left bag and baggage. This means that the tenant left ......",
    options: [
      "leaving all his children",
      "leaving all his belongings",
      "without informing anyone",
      "with all his belongings"
    ],
    correctAnswer: "with all his belongings",
    hint: "Carrying all personal possessions entirely.",
    workedSolution: "'Bag and baggage' means completely, taking all one's personal belongings.",
    points: 1
  },
  {
    number: 24,
    prompt: "The greedy trader can see no further than his nose. This means that the trader ......",
    options: ["lacks foresight", "is easily deceived", "has a long nose", "cannot think"],
    correctAnswer: "lacks foresight",
    hint: "Failing to consider future consequences; short-sighted.",
    workedSolution: "'To see no further than one's nose' means to be narrow-minded and lack foresight or consideration for the future.",
    points: 1
  },
  {
    number: 25,
    prompt: "After his business failed, Kojo was left to sink or swim. This means that Kojo ......",
    options: [
      "had to find another job",
      "shouted for help",
      "had to survive on his own",
      "was depressed"
    ],
    correctAnswer: "had to survive on his own",
    hint: "Forced to survive by personal efforts without outside assistance.",
    workedSolution: "'To sink or swim' means to face failure or success entirely by one's own efforts without outside help.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "The apprentice tore the blueprint accidentally, but his partner folded his ......",
    options: ["intentionally", "willingly", "carelessly", "foolishly"],
    correctAnswer: "intentionally",
    hint: "'Accidentally' means by chance. Find the word meaning on purpose.",
    workedSolution: "'Accidentally' means unintentionally. Its direct antonym is 'intentionally'.",
    points: 1
  },
  {
    number: 27,
    prompt: "While the initial chapter was written in simple terms, the concluding section was remarkably ......",
    options: ["foreign", "strange", "local", "complex"],
    correctAnswer: "complex",
    hint: "'Simple' means easy to understand. Find the word meaning complicated or intricate.",
    workedSolution: "'Simple' means clear and uncomplicated. Its opposite is 'complex'.",
    points: 1
  },
  {
    number: 28,
    prompt: "The proud leader was replaced by a ...... public servant.",
    options: ["respectful", "obedient", "modest", "sympathetic"],
    correctAnswer: "modest",
    hint: "'Proud' or 'arrogant' denotes self-importance. Choose the word meaning humble.",
    workedSolution: "'Arrogant/proud' means conceited. Its opposite is 'modest' (humble).",
    points: 1
  },
  {
    number: 29,
    prompt: "The assembly finished several building projects last term and ...... fresh initiatives this month.",
    options: ["initiated", "concluded", "stopped", "organized"],
    correctAnswer: "initiated",
    hint: "'Finished' means concluded. Select the word meaning started or begun.",
    workedSolution: "'Finished' means brought to an end. Its opposite is 'initiated' (started).",
    points: 1
  },
  {
    number: 30,
    prompt: "The adverse weather disrupted travel, but the following morning brought ...... conditions.",
    options: ["beautiful", "pleasant", "cool", "promising"],
    correctAnswer: "pleasant",
    hint: "'Adverse/unfavourable' means harsh and disagreeable. Find the word meaning agreeable and mild.",
    workedSolution: "'Adverse/unfavourable' means disagreeable and harsh. Its antonym is 'pleasant'.",
    points: 1
  },

  // --- SECTION E: CLOZE TEST (31 - 35) ---
  {
    number: 31,
    prompt: "The session commenced with an inspection of the ---31--- register by the secretary.",
    options: ["attendance", "compiled", "present", "roll"],
    correctAnswer: "attendance",
    hint: "The formal official record tracking members present at an assembly.",
    workedSolution: "In formal committee terminology, the official record of members present is the 'attendance' register.",
    points: 1
  },
  {
    number: 32,
    prompt: "After minor amendments, two formal ---32--- were presented to the house for debate.",
    options: ["motions", "ideas", "decisions", "intentions"],
    correctAnswer: "motions",
    hint: "Formal proposals introduced in a meeting for deliberation and voting.",
    workedSolution: "In meeting procedure, formal proposals debated and voted upon are designated as 'motions'.",
    points: 1
  },
  {
    number: 33,
    prompt: "As time elapsed, a member was called upon to ---33--- the closure of the debate.",
    options: ["move", "call", "recommend", "declare"],
    correctAnswer: "move",
    hint: "The parliamentary verb used to formally propose an action in a sitting.",
    workedSolution: "In parliamentary procedure, to propose a proposal or adjournment is to 'move' it.",
    points: 1
  },
  {
    number: 34,
    prompt: "The proposal was formally ---34--- by a senior colleague.",
    options: ["approved", "seconded", "upheld", "supported"],
    correctAnswer: "seconded",
    hint: "Formally endorsing a motion before voting.",
    workedSolution: "In formal meetings, once a motion is moved, another member must 'second' it before debate closes.",
    points: 1
  },
  {
    number: 35,
    prompt: "The assembly was subsequently ---35--- to convene the following fortnight.",
    options: ["adjourned", "postponed", "deferred", "shifted"],
    correctAnswer: "adjourned",
    hint: "The formal term for closing a meeting session until a future date.",
    workedSolution: "The specific term for closing or suspending a formal sitting to a future time is 'adjourned'.",
    points: 1
  },

  // --- SECTION F: ORAL LANGUAGE (36 - 40) ---
  {
    number: 36,
    prompt: "The two boxers are arch rivals.\nWhich word contains the same consonant sound as the underlined digraph 'ch' in 'arch'?",
    options: ["patch", "splash", "path", "spark"],
    correctAnswer: "patch",
    hint: "Pronounce the final sound of 'arch' (/tʃ/).",
    workedSolution: "'Arch' ends with the voiceless palato-alveolar affricate /tʃ/. 'Patch' ends with the identical /tʃ/ sound.",
    points: 1
  },
  {
    number: 37,
    prompt: "Kofi is the head chef at the restaurant.\nWhich word has the same initial consonant sound as 'chef'?",
    options: ["shield", "chord", "chair", "scheme"],
    correctAnswer: "shield",
    hint: "'Chef' is borrowed from French and begins with the /ʃ/ sound (like 'sh').",
    workedSolution: "'Chef' is pronounced /ʃef/, beginning with /ʃ/. 'Shield' begins with the same /ʃ/ sound.",
    points: 1
  },
  {
    number: 38,
    prompt: "The cat sprang across the fence.\nWhich word shares the same initial consonant cluster as 'sprang'?",
    options: ["sprayed", "struck", "slew", "splashed"],
    correctAnswer: "sprayed",
    hint: "Look for the triple consonant cluster /s/ + /p/ + /r/.",
    workedSolution: "'Sprang' begins with the cluster /spr-/. 'Sprayed' begins with the identical /spr-/ cluster.",
    points: 1
  },
  {
    number: 39,
    prompt: "Eat whole grains for breakfast.\nWhich word contains the same vowel sound as 'whole'?",
    options: ["Goal", "Gill", "Gaul", "Gaol"],
    correctAnswer: "Goal",
    hint: "'Whole' is pronounced /həʊl/ with the /əʊ/ diphthong sound.",
    workedSolution: "'Whole' is pronounced /həʊl/. Its vowel sound is the diphthong /əʊ/, matching 'goal' (/ɡəʊl/).",
    points: 1
  },
  {
    number: 40,
    prompt: "The prince is the lawful heir to the throne.\nWhich word has the exact same vowel sound as 'heir'?",
    options: ["air", "here", "hail", "hew"],
    correctAnswer: "air",
    hint: "The 'h' is silent in 'heir'. It is a homophone of an everyday atmospheric word.",
    workedSolution: "'Heir' has a silent 'h' and is pronounced /eər/, which is a homophone of 'air'.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 202307);

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
        category: "Formal Letter",
        prompt: "Write a letter to the District Director of Health, discussing two ways in which the unhygienic practices of some street food vendors affect the health of residents in your community, and suggest one practical solution to the problem.",
        modelAnswer: `Beso Junior High School\nP. O. Box 24\nBeso, Central Region\n14th June, 2023\n\nThe District Director of Health\nGhana Health Service\nDistrict Health Directorate\nBeso\n\nDear Sir,\n\nTHE UNHYGIENIC PRACTICES OF STREET FOOD VENDORS AND THEIR EFFECTS ON PUBLIC HEALTH\n\nI respectfully write as a concerned student of Beso Junior High School to draw your attention to the unhygienic practices of certain street food vendors in our community and their detrimental effects on the health of residents.\n\nFirst, many food vendors display cooked food in uncovered containers along dusty roadsides and near open gutters. Flies settle on waste materials and transfer pathogens directly onto uncovered foods such as waakye and roasted plantain. Consuming this contaminated food has led to recurrent outbreaks of food-borne illnesses, notably cholera, typhoid fever, and acute dysentery among schoolchildren.\n\nSecondly, some food handlers operate without basic personal hygiene. Many do not wash their hands with soap and running water after handling currency notes or visiting the washroom. Furthermore, food is often served in substandard plastic bags or prepared with unwholesome water from untreated wells, exposing consumers to parasitic worm infections and chronic stomach disorders.\n\nTo curb this growing health hazard, I suggest that the District Health Directorate, in collaboration with the Environmental Health Unit, make it mandatory for all food vendors to undergo medical screening and acquire valid health certificates before operating. Additionally, health inspectors should conduct routine, unannounced inspections of food stalls, penalizing or closing down vendors who fail to maintain strict hygiene standards.\n\nI trust that you will treat this matter with the urgency it deserves to safeguard community health.\n\nThank you.\n\nYours faithfully,\n[Signature]\nEsi Mensah\n(Health Prefect)`
      },
      {
        questionNumber: "2",
        category: "Narrative Essay",
        prompt: "Narrate an interesting story about a community initiative or personal effort that overcame great challenges, ending with the statement: \"Indeed, it was a great achievement.\"",
        modelAnswer: `Our village of Beso was once trapped in stagnation and poor health. Every rainy season, large excavated pits left behind by sand winners filled with stagnant water, turning our surroundings into breeding grounds for swarms of mosquitoes. Malaria cases soared, children fell ill regularly, and our school registered the lowest BECE pass rate in the district due to student absenteeism.\n\nWhen our new headmistress, Mrs. Agnes Appiah, assumed office, she refused to accept the situation. During a general Parent-Teacher Association meeting, she displayed health records demonstrating how malaria was sabotaging our education. She passionately appealed to parents and chiefs to reclaim the land. Inspired by her leadership, the community rallied together.\n\nDuring the dry season, community members mobilized. Armed with shovels, wheelbarrows, and earth-moving trucks donated by a local contractor, everyone worked tirelessly under the blazing sun. Youth groups carted gravel, market women provided meals, and students helped plant eucalyptus seedlings and ornamental hedges over the reclaimed soil.\n\nWithin four months, the mosquito-infested pits were transformed into a vibrant community sports park and school demonstration farm. By the following year, malaria cases dropped by eighty percent, classroom attendance stabilized, and Beso JHS produced the best academic results in the entire municipality. Standing before the green park during the commissioning durbar, the village chief smiled and declared: Indeed, it was a great achievement.`
      },
      {
        questionNumber: "3",
        category: "Article for Publication",
        prompt: "Write an article for publication in a national newspaper discussing two effects of poor domestic waste disposal on community life, and suggest two practical ways of solving the problem.",
        modelAnswer: `COMBATING THE CRISIS OF POOR WASTE DISPOSAL IN OUR COMMUNITIES\nBy Emmanuel Kwakye, JHS 3\n\nIn many towns across Ghana, the indiscriminate disposal of domestic refuse and plastic waste has reached alarming proportions. Piles of uncollected garbage choke street corners, while plastic sachets block gutters. This irresponsible practice poses grave consequences for public health and community well-being.\n\nThe most severe effect of indiscriminate waste disposal is the outbreak of epidemic diseases. Choked gutters and rotting waste heaps create ideal breeding habitats for mosquitoes and houseflies, which transmit malaria, cholera, and typhoid. During heavy downpours, blocked drains cause urban flooding, displacing families, damaging property, and polluting domestic shallow wells.\n\nFurthermore, heaps of decomposing garbage produce offensive odors and release toxic leachate into local water bodies, degrading community aesthetics and posing respiratory hazards to nearby residents.\n\nTo address this challenge effectively, municipal assemblies must establish reliable, routine waste collection services. Providing strategically placed, color-coded communal refuse bins for sorting plastics, paper, and organic waste will prevent residents from dumping trash in storm drains. Secondly, district authorities must enforce sanitation bye-laws rigorously. Environmental health officers should apprehend and fine individuals caught dumping refuse illegally.\n\nIn conclusion, maintaining a clean environment is a shared civic responsibility. Through strict law enforcement and efficient waste infrastructure, our communities can overcome the menace of filth.`
      }
    ]
  },
  sectionB_comprehension: {
    title: "Part B: Reading Comprehension",
    passage: `The new Headmistress of Beso Junior High School was impressed with the infrastructure and equipment in the school. She was also pleased with the staff and student population. However, one thing puzzled her. The students' performance was very poor, according to the records. She had a discussion with the staff who complained of student absenteeism due to ill health. A nurse in the community told her that the children were often under the weather.\n\nThey had malaria, although every family had been given insecticide-treated mosquito nets. It seemed however that the people did not use these nets as they should and therefore the numerous mosquitoes in the environment continued to bite them. While visiting some of the sick children in the community, the Headmistress noticed that there were several pits filled with water. At a general PTA meeting, she explained how mosquitoes could breed in the stagnant water in the pits. She also pointed out the effects of the poor health of the children on their academic performance. She then appealed for help to destroy the breeding places of the mosquitoes so that the children would become healthier and perform better in school.\n\nAlthough some of the parents did not understand the connection between the water in the pits and the performance of the students, they agreed to help her. During the next dry season, work started. All hands were on deck. The people worked very hard and the pits were filled. Trees and flowers were planted on the reclaimed land. The community now looked more beautiful than before. Soon, the children's health improved and, later, their performance in the final examinations became better.`,
    questions: [
      {
        subId: "(a)",
        question: "Mention two things that the Headmistress liked about the school upon assuming duty.",
        answer: "1. The infrastructure and equipment in the school.\n2. The staff and student population."
      },
      {
        subId: "(b)",
        question: "In which two ways did the children's poor health affect them according to the passage?",
        answer: "1. It caused frequent absenteeism from school.\n2. It led to very poor academic performance in their examinations."
      },
      {
        subId: "(c)",
        question: "Why did the Headmistress involve the parents in solving the problem?",
        answer: "Because the stagnant water pits were located within the wider community where the families lived, and community labor was required to fill the pits and destroy mosquito breeding grounds."
      },
      {
        subId: "(d)(i)",
        question: "What made the community succeed in filling the pits?",
        answer: "Unity and collective communal effort (all hands were on deck and everyone worked very hard together)."
      },
      {
        subId: "(d)(ii)",
        question: "State two benefits that the filling of the pits brought to the community.",
        answer: "1. The reclaimed land was planted with trees and flowers, making the community more beautiful.\n2. The children's health improved and their academic performance in final examinations became better."
      },
      {
        subId: "(e)",
        question: "Explain in your own words the following expressions as used in the passage:\n(i) ... one thing puzzled her;\n(ii) ... often under the weather;\n(iii) All hands were on deck.",
        answer: "(i) **... one thing puzzled her:** One situation confused or baffled her because she could not understand it.\n(ii) **... often under the weather:** Frequently sick, unwell, or indisposed.\n(iii) **All hands were on deck:** Everyone participated fully and worked together collectively."
      },
      {
        subId: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\n(i) noticed;\n(ii) pits;\n(iii) appealed;\n(iv) perform;\n(v) connection.",
        answer: "(i) **noticed:** observed / saw / spotted / discovered.\n(ii) **pits:** holes / trenches / craters / hollows.\n(iii) **appealed:** begged / pleaded / requested / called for assistance.\n(iv) **perform:** do / score / achieve / deliver results.\n(v) **connection:** link / relationship / association / bond."
      }
    ]
  },
  sectionC_literature: {
    title: "Part C: Literature in English (The Cockcrow Anthology)",
    instructions: "Answer all questions in this part based on the prescribed texts.",
    questions: [
      {
        subId: "5(a)",
        textSource: "KEN SARO-WIWA: Home Sweet Home",
        extract: "\"My friend, Sira, was Waale's only daughter. As I said, we had grown up together, and had attended school together. She had not been able to complete her elementary schooling, although she was a brilliant girl.\"",
        question: "Who is Waale in the story?",
        answer: "Waale is a respected elder and prominent villager in the community, and the mother of Sira."
      },
      {
        subId: "5(b)",
        textSource: "KEN SARO-WIWA: Home Sweet Home",
        extract: "\"She had not been able to complete her elementary schooling...\"",
        question: "Why was Sira unable to complete her elementary schooling?",
        answer: "She became pregnant while still in school, which led to her dropping out according to village customs."
      },
      {
        subId: "5(c)",
        textSource: "KEN SARO-WIWA: Home Sweet Home",
        extract: "Sira was not among the people who came to welcome the writer...",
        question: "Why was Sira absent from the crowd welcoming the narrator back home?",
        answer: "She felt ashamed, stigmatized, and humiliated by her teenage pregnancy and ostracism by the villagers."
      },
      {
        subId: "5(d)",
        textSource: "AMA ATA AIDOO: The Girl Who Can",
        extract: "\"They say that I was born in Hasodzi; and it is a very big village in the Central Region of our country, Ghana ......\"",
        question: "The extract represents which part of the plot structure of the story?",
        answer: "The exposition (or introduction / opening background of the story)."
      },
      {
        subId: "5(e)",
        textSource: "AMA ATA AIDOO: The Girl Who Can",
        extract: "\"They say that I was born ......\"",
        question: "What does the expression 'They say that I was born' show about the narrator?",
        answer: "It shows that she was too young to remember her own birth and relies on what older relatives and villagers told her."
      },
      {
        subId: "5(f)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "MONKA [To herself]: I remember the time he was preparing to go to the white man's land ...... The money ...... the money ...... This is something which no one should hear anything about.",
        question: "According to Monka, what was the secret that no one should hear about?",
        answer: "The family's financial sacrifice and heavy debts incurred to sponsor Ato's university education in America."
      },
      {
        subId: "5(g)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "MONKA [To herself]...",
        question: "Identify the dramatic technique exemplified by Monka speaking aloud to herself on stage.",
        answer: "Soliloquy (or aside)."
      },
      {
        subId: "5(h)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "\"The money ...... the money ......\"",
        question: "Name the literary device illustrated in the repetition of 'the money'.",
        answer: "Repetition (used for emphasis to highlight the family's financial distress)."
      },
      {
        subId: "5(i)",
        textSource: "EVELYN TOOLEY HUNT: Mama Is a Sunrise",
        extract: "When she comes slip-footing through the door,\nshe kindles us\nlike lump coal lighted\nand we wake up glowing.",
        question: "State the dominant theme illustrated in this stanza.",
        answer: "The theme of motherly love, warmth, and the uplifting influence of a mother on her family."
      },
      {
        subId: "5(j)",
        textSource: "EVELYN TOOLEY HUNT: Mama Is a Sunrise",
        extract: "... she kindles us\nlike lump coal lighted ...",
        question: "Name the figure of speech used in the comparison above.",
        answer: "Simile (comparing her awakening effect on the family to lighting coal using the word 'like')."
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

async function seedBeceEnglish2023Calibrated() {
  const db = await getDb();
  console.log("Seeding Calibrated & Balanced BECE English 2023 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2023");
  await docRef.set({
    year: 2023,
    title: "BECE English Language 2023 (Calibrated National Benchmark)",
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

  console.log("✅ Calibrated BECE English 2023 successfully seeded into Firestore!");
}

seedBeceEnglish2023Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2023:", err);
    process.exit(1);
  });
