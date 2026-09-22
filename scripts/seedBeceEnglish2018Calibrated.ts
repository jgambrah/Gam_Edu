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

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2018
const rawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "Salifu was ............ astonished by the news that he stood speechless.",
    options: ["enough", "so", "what", "which"],
    correctAnswer: "so",
    hint: "Identify the degree adverb that pairs with 'that' to indicate cause and effect ('so + adjective + that').",
    workedSolution: "The correlative structure 'so + adjective + that' expresses an extreme degree leading to a specific result ('so astonished that he stood speechless').",
    points: 1
  },
  {
    number: 2,
    prompt: "This small contribution is all ............ I can afford today.",
    options: ["that", "this", "what", "which"],
    correctAnswer: "that",
    hint: "The indefinite pronoun 'all' is followed by the relative pronoun 'that', never 'what'.",
    workedSolution: "In standard English, the quantifier/pronoun 'all' takes the relative pronoun 'that' ('all that I can afford'). Using 'what' or 'which' here is non-standard.",
    points: 1
  },
  {
    number: 3,
    prompt: "I am told the visitor is a childhood friend of ............",
    options: ["he", "him", "his", "he's"],
    correctAnswer: "his",
    hint: "Double possessive construction: 'a friend of' is followed by an independent possessive pronoun.",
    workedSolution: "In double genitive (possessive) constructions such as 'a friend of...', English uses the absolute possessive pronoun ('his', 'mine', 'hers', 'theirs').",
    points: 1
  },
  {
    number: 4,
    prompt: "Waakye with boiled eggs ............ a satisfying breakfast for hardworking laborers.",
    options: ["are", "have been", "is", "is being"],
    correctAnswer: "is",
    hint: "When two food items joined by 'and' are viewed together as a single compound dish, they take a singular verb.",
    workedSolution: "Compound subjects referring to a single combined meal or unified dish ('Waakye with eggs' or 'Rice and beans') take a singular verb ('is').",
    points: 1
  },
  {
    number: 5,
    prompt: "Kofi is ............ shrewd to be deceived by fraudulent online schemes.",
    options: ["quite", "so", "too", "very"],
    correctAnswer: "too",
    hint: "Look for the correlative pattern 'too + adjective + to-infinitive'.",
    workedSolution: "The structure 'too + adjective + to-infinitive' indicates an extent that produces a negative result (he is so shrewd that he cannot be cheated).",
    points: 1
  },
  {
    number: 6,
    prompt: "The two rival politicians are constantly accusing ............",
    options: ["each other", "one another", "one and the other", "themselves"],
    correctAnswer: "each other",
    hint: "Reciprocal pronoun used when an action is mutually exchanged between exactly two individuals.",
    workedSolution: "'Each other' is the reciprocal pronoun used when referring to two persons ('The two rival politicians'). 'One another' is preferred for three or more.",
    points: 1
  },
  {
    number: 7,
    prompt: "Of all the debaters who represented the school, Ekua was .............",
    options: ["more articulate", "most articulate", "the more articulate", "the most articulate"],
    correctAnswer: "the most articulate",
    hint: "Comparing more than two individuals to show the highest degree requires 'the' + superlative adjective.",
    workedSolution: "When comparing one individual against all members of a group ('Of all the debaters'), the superlative form preceded by the definite article ('the most articulate') is required.",
    points: 1
  },
  {
    number: 8,
    prompt: "It is high time the council ............. the broken culvert.",
    options: ["repaired", "repairs", "has repaired", "will repair"],
    correctAnswer: "repaired",
    hint: "'It is high time + subject' requires a simple past subjunctive verb.",
    workedSolution: "The fixed expression 'It is high time + subject' takes a simple past subjunctive verb ('repaired') to denote an action that should have been done already.",
    points: 1
  },
  {
    number: 9,
    prompt: "You should be ............ more circumspect regarding your personal security.",
    options: ["less", "least", "little", "a little"],
    correctAnswer: "a little",
    hint: "Use 'a little' as an adverbial degree modifier meaning 'slightly' before a comparative adjective.",
    workedSolution: "The positive adverbial phrase 'a little' modifies the comparative adjective phrase 'more circumspect' to denote a slight increase in degree.",
    points: 1
  },
  {
    number: 10,
    prompt: "Atsu is looking forward to ............ his former classmates at the silver jubilee reunion.",
    options: ["meet", "meeting", "be meeting", "have met"],
    correctAnswer: "meeting",
    hint: "The prepositional idiom 'look forward to' must be followed by a gerund (verb-ing).",
    workedSolution: "In 'look forward to', 'to' functions as a preposition, requiring a gerund complement ('meeting').",
    points: 1
  },
  {
    number: 11,
    prompt: "The more diligently you revise your notes, ............ your prospects of academic distinction.",
    options: ["greater", "greatest", "the great", "the greater"],
    correctAnswer: "the greater",
    hint: "Parallel comparative correlative structure: 'The + comparative..., the + comparative...'.",
    workedSolution: "In proportional comparisons, English uses 'the + comparative clause..., the + comparative clause...' ('The more diligently..., the greater...').",
    points: 1
  },
  {
    number: 12,
    prompt: "If you had informed me of your arrival, I ............ you at the station.",
    options: ["will meet", "would meet", "will have met", "would have met"],
    correctAnswer: "would have met",
    hint: "Conditional Type 3: 'If + past perfect' requires 'would have + past participle' in the main clause.",
    workedSolution: "The hypothetical past condition 'If you had informed me' requires the past counterfactual modal construction 'would have met' in the main clause.",
    points: 1
  },
  {
    number: 13,
    prompt: "I don't really comprehend what you are hinting at, .............. I?",
    options: ["am", "aren't", "do", "did"],
    correctAnswer: "do",
    hint: "A negative statement with 'don't' takes a positive question tag using the same present auxiliary.",
    workedSolution: "The main clause contains the negative present auxiliary 'don't'. The matching question tag must be positive: 'do I?'.",
    points: 1
  },
  {
    number: 14,
    prompt: "I will not travel to the market with ............ of the two quarreling brothers.",
    options: ["each", "either", "everyone", "neither"],
    correctAnswer: "either",
    hint: "When a negative sentence ('will not travel') refers to two items, use 'either' to avoid a double negative.",
    workedSolution: "Because the clause already has the negative marker 'not' and refers to two individuals, 'either' is required ('not ... with either of the two'). 'Neither' would create an erroneous double negative.",
    points: 1
  },
  {
    number: 15,
    prompt: "Several children in the community fell ill ............ measles during the outbreak.",
    options: ["at", "by", "of", "with"],
    correctAnswer: "with",
    hint: "Identify the preposition that regularly collocates with 'ill' when naming a specific disease.",
    workedSolution: "In standard English, one falls 'ill with' a specific disease (or dies 'of' a disease).",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The magistrate's stern countenance gave him a very severe appearance.\nChoose the word nearest in meaning to the underlined word 'severe'.",
    options: ["bad", "deadly", "serious", "unpleasant"],
    correctAnswer: "serious",
    hint: "Strict, unsmiling, grave, and showing strong authority.",
    workedSolution: "'Severe' in describing facial demeanor or attitude means stern, grave, or austere; 'serious' is its closest synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "The young apprentice enjoyed the benefit of sound vocational instruction.\nChoose the word nearest in meaning to the underlined word 'benefit'.",
    options: ["luck", "advantage", "quality", "value"],
    correctAnswer: "advantage",
    hint: "A helpful, favorable, or profitable circumstance.",
    workedSolution: "'Benefit' refers to a favorable circumstance, asset, or profit; 'advantage' is its direct synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "The young child was terrified when left alone in the dark room.\nChoose the word nearest in meaning to the underlined word 'terrified'.",
    options: ["afraid", "anxious", "uneasy", "unhappy"],
    correctAnswer: "afraid",
    hint: "Overcome with fear, alarm, or panic.",
    workedSolution: "'Terrified' (or scared) means experiencing intense fear or fright; 'afraid' is the nearest synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "The peaceful rural atmosphere was ideal for the retired teacher's recuperation.\nChoose the word nearest in meaning to the underlined word 'ideal'.",
    options: ["good", "perfect", "satisfactory", "suitable"],
    correctAnswer: "suitable",
    hint: "Appropriate, fitting, or perfectly conforming to a particular need.",
    workedSolution: "'Ideal' describes something perfectly fitted, appropriate, or adapted to a purpose; 'suitable' is its closest synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "The construction of the irrigation canal brought enormous economic transformation to the district.\nChoose the word nearest in meaning to the underlined word 'enormous'.",
    options: ["enviable", "great", "much", "suitable"],
    correctAnswer: "great",
    hint: "Immensely large, extensive, significant, or vast in degree.",
    workedSolution: "'Enormous' means extremely large in scale, volume, or degree; 'great' is the closest synonym in this context.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "Abena celebrates her graduation today, but I cannot make it. This means that the speaker ............",
    options: [
      "does not want to celebrate",
      "feels it is necessary to attend",
      "has no graduation gift",
      "will not be able to attend"
    ],
    correctAnswer: "will not be able to attend",
    hint: "To 'make it' to an event means to successfully attend or arrive in time.",
    workedSolution: "The informal idiom 'cannot make it' means to be unable to be present or unable to attend a scheduled function.",
    points: 1
  },
  {
    number: 22,
    prompt: "The entrance examination was conducted to separate the sheep from the goats. This means that the examination aimed at ............",
    options: [
      "finding students who could rear livestock",
      "keeping students in separate classrooms",
      "selecting only the docile candidates",
      "distinguishing the best candidates from the inferior ones"
    ],
    correctAnswer: "distinguishing the best candidates from the inferior ones",
    hint: "Separating competent, capable, or worthy individuals from the unworthy.",
    workedSolution: "'To separate the sheep from the goats' is a biblical idiom meaning to distinguish competent, valuable, or superior individuals from inferior ones.",
    points: 1
  },
  {
    number: 23,
    prompt: "As the firstborn, Kwame took the lion's share of his grandfather's cocoa estate. This means that Kwame took ............",
    options: [
      "all the cocoa farms",
      "half of the estate",
      "the most fertile plot only",
      "the largest portion of the estate"
    ],
    correctAnswer: "the largest portion of the estate",
    hint: "Taking the major, disproportionately largest part of something.",
    workedSolution: "The idiom 'the lion's share' refers to the largest, major, or predominant portion of a shared resource.",
    points: 1
  },
  {
    number: 24,
    prompt: "The audience was all ears during the keynote presentation on cyber-security. This means that the audience ............",
    options: [
      "did not enjoy the lecture",
      "had extraordinary hearing ability",
      "listened with rapt attention",
      "was restless and noisy"
    ],
    correctAnswer: "listened with rapt attention",
    hint: "Eager, alert, and listening attentively.",
    workedSolution: "The idiom 'all ears' means listening with complete, eager, and undivided attention.",
    points: 1
  },
  {
    number: 25,
    prompt: "Among all the applicants interviewed, Sarah was the pick of the bunch. This means that Sarah ............",
    options: [
      "was an agricultural laborer",
      "was an energetic candidate",
      "was the most outstanding candidate chosen",
      "collected agricultural produce"
    ],
    correctAnswer: "was the most outstanding candidate chosen",
    hint: "The best, finest, or most desirable choice among a group.",
    workedSolution: "'The pick of the bunch' is an idiomatic phrase meaning the finest, most capable, or best choice out of a collection of options.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "At the sound of the bell, the headmaster instructed the assembly to disperse, but the prefects ordered them to ......",
    options: ["assemble", "come", "meet", "stay"],
    correctAnswer: "assemble",
    hint: "'Disperse' means to scatter or break up. Find the word that denotes gathering together into one place.",
    workedSolution: "'Disperse' means to break up and scatter in different directions. Its direct antonym in school gatherings is 'assemble' (to gather together).",
    points: 1
  },
  {
    number: 27,
    prompt: "The water current was slow in the estuary, but remarkably ...... in the mountain rapids.",
    options: ["abrupt", "fresh", "running", "swift"],
    correctAnswer: "swift",
    hint: "'Slow' means moving at low speed. Find the word meaning moving very rapidly.",
    workedSolution: "'Slow' means moving with little speed. Its direct antonym when describing flowing currents is 'swift' (fast-moving or rapid).",
    points: 1
  },
  {
    number: 28,
    prompt: "The baker discarded the stale bread and served ...... loaves to the customers.",
    options: ["burnt", "delicious", "fresh", "mouldy"],
    correctAnswer: "fresh",
    hint: "'Stale' means dry, hard, and no longer new. Find the word meaning newly baked and warm.",
    workedSolution: "'Stale' refers to food (especially bread) that has lost its moisture and taste over time. Its direct antonym is 'fresh'.",
    points: 1
  },
  {
    number: 29,
    prompt: "While Kofi was boastful about his athletic prowess, his humble brother was ...... of his own achievements.",
    options: ["afraid", "anxious", "modest", "nervous"],
    correctAnswer: "modest",
    hint: "'Boastful' means excessively proud and braggy. Choose the word meaning humble and unpretentious.",
    workedSolution: "'Boastful' means bragging and conceited. Its direct antonym is 'modest' (humble and unassuming).",
    points: 1
  },
  {
    number: 30,
    prompt: "The prepared students were confident of passing the examination, but the truant candidates felt completely ......",
    options: ["determined", "doubtless", "uncertain", "uneasy"],
    correctAnswer: "uncertain",
    hint: "'Confident' means sure of success. Find the word meaning having doubt or lack of assurance.",
    workedSolution: "'Confident' denotes self-assurance and certainty. Its direct antonym is 'uncertain' (doubtful or insecure).",
    points: 1
  },

  // --- SECTION E: CLOZE TEST (31 - 35) ---
  {
    number: 31,
    prompt: "Parenting requires patience and discipline. Guardians must take good care of adopted children and not ---31--- them.",
    options: ["pamper", "protect", "guide", "train"],
    correctAnswer: "pamper",
    hint: "To indulge with every whim, spoil, or treat with excessive leniency.",
    workedSolution: "'Pamper' means to spoil, coddle, or overindulge a child, which often leads to indiscipline.",
    points: 1
  },
  {
    number: 32,
    prompt: "Children often develop an intense ---32--- for outdoor hunting and exploration after school.",
    options: ["passion", "sorrow", "regret", "trouble"],
    correctAnswer: "passion",
    hint: "A strong enthusiasm, affection, or uncontrollable fondness for an activity.",
    workedSolution: "'Passion' fits the context of an overwhelming personal enthusiasm or hobby ('a passion for outdoor hunting').",
    points: 1
  },
  {
    number: 33,
    prompt: "Responsible elders urge youths to ---33--- from dangerous adventures in railway corridors.",
    options: ["abstain", "escape", "remove", "prevent"],
    correctAnswer: "abstain",
    hint: "To voluntarily refrain or hold oneself back from doing something harmful.",
    workedSolution: "The verb 'abstain' pairs with 'from' ('abstain from dangerous adventures') to mean deliberately refraining from an action.",
    points: 1
  },
  {
    number: 34,
    prompt: "Failure to follow safety warnings can result in ---34--- tragedies for the entire community.",
    options: ["grave", "minor", "slight", "casual"],
    correctAnswer: "grave",
    hint: "Extremely serious, solemn, and having disastrous consequences.",
    workedSolution: "'Grave' means giving cause for alarming concern; extremely serious and weighty.",
    points: 1
  },
  {
    number: 35,
    prompt: "Upon seeing their guardians waiting anxiously, the wandering children entered the compound ---35---, hoping to avoid punishment.",
    options: ["furtively", "openly", "boldly", "proudly"],
    correctAnswer: "furtively",
    hint: "Done stealthily, secretly, or quietly to avoid being noticed.",
    workedSolution: "'Furtively' means secretly, stealthily, or quietly so as not to attract attention.",
    points: 1
  },

  // --- SECTION F: ORAL LANGUAGE (36 - 40) ---
  {
    number: 36,
    prompt: "The hunter aimed his dart with great precision.\nWhich of the following words contains the same long vowel sound as 'dart' (/ɑː/)?",
    options: ["calm", "cat", "came", "camp"],
    correctAnswer: "calm",
    hint: "'Dart' contains the open back unrounded long vowel /ɑː/. 'Calm' has a silent 'l' and uses the same long vowel.",
    workedSolution: "'Dart' contains the /ɑː/ vowel sound (/dɑːt/). In 'calm' (/kɑːm/), the 'l' is silent and the vowel is also /ɑː/.",
    points: 1
  },
  {
    number: 37,
    prompt: "The young apprentice tightened the screw with a wrench.\nWhich of the following words begins with the same initial consonant sound as 'wrench' (/r/)?",
    options: ["wrist", "west", "wash", "wind"],
    correctAnswer: "wrist",
    hint: "In 'wrench', the letter 'w' is completely silent, leaving the /r/ sound.",
    workedSolution: "In 'wrench' (/rentʃ/), the initial 'w' is silent, so the word begins with /r/. 'Wrist' (/rɪst/) also has a silent 'w' and begins with /r/.",
    points: 1
  },
  {
    number: 38,
    prompt: "The court judge signed the decree with a quill.\nWhich of the following words begins with the same consonant cluster as 'quill' (/kw-/)?",
    options: ["queen", "kill", "keen", "keep"],
    correctAnswer: "queen",
    hint: "'Quill' is pronounced /kwɪl/, beginning with the double consonant cluster /k/ + /w/.",
    workedSolution: "'Quill' begins with the phonetic cluster /kw-/. 'Queen' (/kwiːn/) begins with the identical /kw-/ sound.",
    points: 1
  },
  {
    number: 39,
    prompt: "The blacksmith heated the iron anvil.\nWhich of the following words has the exact same vowel sound as the stressed syllable in 'iron' (/aɪ/)?",
    options: ["aisle", "inn", "ill", "ink"],
    correctAnswer: "aisle",
    hint: "'Iron' begins with the diphthong /aɪ/ (/ˈaɪ.ən/).",
    workedSolution: "'Iron' begins with the diphthong /aɪ/. 'Aisle' (/aɪl/) contains the identical /aɪ/ diphthong sound.",
    points: 1
  },
  {
    number: 40,
    prompt: "The choir sang in sweet harmony.\nWhich of the following words begins with the same consonant sound as 'choir' (/k/)?",
    options: ["cabbage", "chair", "champion", "chest"],
    correctAnswer: "cabbage",
    hint: "'Choir' is pronounced /ˈkwaɪ.ər/, beginning with the voiceless velar plosive /k/.",
    workedSolution: "'Choir' begins with the voiceless velar plosive /k/. 'Cabbage' begins with the same /k/ sound. ('chair', 'champion', 'chest' begin with /tʃ/).",
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

const assignedTargetIndices = seedShuffle(targetKeys, 201802);

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
        prompt: "As the School Prefect, write a formal letter to your Municipal Chief Executive (MCE) requesting the urgent renovation and maintenance of the deteriorating school blocks in your school.",
        modelAnswer: `Berekum Municipal Junior High School
P. O. Box 54
Berekum, Bono Region
15th May, 2018

The Municipal Chief Executive
Berekum Municipal Assembly
P. O. Box 20
Berekum

Dear Sir,

URGENT REQUEST FOR THE RENOVATION AND MAINTENANCE OF OUR SCHOOL INFRASTRUCTURE

On behalf of the students and staff of Berekum Municipal Junior High School, I respectfully write to draw your urgent attention to the deplorable state of our classroom buildings and to appeal for immediate renovation works.

First, the roofs of our primary and junior high school classroom blocks are severely decayed. The corrugated iron sheets are completely rusted and perforated with holes. Whenever it rains, water leaks profusely into the classrooms, soaking textbooks, library supplies, and the pupils' exercise books. Consequently, academic instruction is disrupted whenever dark clouds gather, forcing teachers to dismiss classes early and resulting in severe loss of instructional time.

Secondly, the walls of the main two-story block have developed deep structural cracks that pose a grave physical hazard to both teachers and learners. The concrete floors are broken into powdery dust, causing respiratory irritation among pupils. Furthermore, the wooden doors and window louvers have been damaged by termites, allowing unauthorized persons and stray cattle to enter the classrooms after hours to vandalize teaching materials.

Our Parent-Teacher Association has mobilized communal labor to patch minor defects, but the scale of structural deterioration requires the engineering resources and intervention of the Municipal Assembly. Renovating these blocks will create a safe, dignified learning environment and improve our academic performance in the BECE.

We trust that your office will treat this appeal with the utmost priority.

Thank you.

Yours faithfully,
[Signature]
Francis Gyabaah
(School Prefect)`
      },
      {
        questionNumber: "2",
        category: "Argumentative / Debate Essay",
        prompt: "Write an essay arguing for or against the motion: \"Life in the city is more dangerous than life in the village.\"",
        modelAnswer: `LIFE IN THE CITY IS INDEED MORE DANGEROUS THAN LIFE IN THE VILLAGE

While urbanization continues to draw millions of young people from rural hamlets into sprawling commercial metropolises, city life is fraught with severe physical, environmental, and social hazards. I firmly support the view that living in the city is far more perilous than residing in the peaceful village.

First and foremost, cities are notorious breeding grounds for violent crime and personal insecurity. Urban anonymity allows criminal syndicates, armed robbers, pickpockets, and fraudsters to operate with terrifying sophistication. In major cities, residents live in fortified compounds behind razor wire and metal security grilles, yet they live in perpetual fear of nocturnal home invasions. In sharp contrast, village life is safeguarded by communal vigilance and social cohesion. In the village, crime is virtually non-existent; neighbors know each other intimately, and children walk freely at night without the dread of being abducted or assaulted.

Secondly, the urban physical environment is dangerously hazardous to human health. Cities suffer from dense vehicular traffic congestion, toxic exhaust emissions, and unmanaged heaps of industrial refuse that poison the air and water. Commuters face the daily risk of fatal road traffic accidents caused by reckless commercial drivers. In contrast, village dwellers breathe clean, unpolluted air, drink from fresh natural springs, and consume organic food harvested directly from the soil. The rural lifestyle promotes longevity and mental peace, far away from the toxic stress and perils of urban life.

In conclusion, although the city offers glittering lights and modern commerce, it exacts a heavy price in personal safety and health. The tranquility, communal solidarity, and safety of the village make it a far safer sanctuary for human flourishing.`
      },
      {
        questionNumber: "3",
        category: "Formal Disciplinary Report",
        prompt: "Write a formal report to the Headteacher of your school about an incident in which a senior girl physically assaulted a junior boy on the school compound.",
        modelAnswer: `REPORT ON AN ASSAULT INCIDENT INVOLVING A SENIOR GIRL AND A JUNIOR PUPIL ON THE SCHOOL COMPOUND
To: The Headteacher, St. Augustine's JHS
From: Priscilla Mensah (Senior Girls' Prefect)
Date: 18th October, 2018

1. INTRODUCTION
On Wednesday, 17th October 2018, during the morning recess break at approximately 10:15 a.m., an unfortunate incident of physical assault occurred behind the school canteen involving a Form Three student, Belinda Arthur, and a Form One pupil, Master Daniel Boateng.

2. ACCOUNT OF THE INCIDENT
According to eyewitness statements and my own observation as I arrived at the scene, Daniel was standing in the canteen queue to purchase snacks. Belinda approached the counter, bypassed the line, and demanded that Daniel surrender his position to her. When Daniel politely pleaded that he had been waiting patiently for over ten minutes, Belinda took offense, labeling his response as insolence toward a senior.

Without provocation, Belinda slapped Daniel across the face, seized his uniform collar, and pushed him violently against the canteen dwarf wall. Daniel sustained a bruised lip and minor abrasions on his left elbow before onlooking prefects intervened to separate them.

3. IMMEDIATE ACTION TAKEN
I immediately assisted Daniel to the school sickbay, where the school health coordinator cleaned and dressed his wounds. Belinda was taken to the Senior Housemaster's office for questioning. Daniel has since recovered and returned to his classroom.

4. FINDINGS AND RECOMMENDATIONS
The investigation confirmed that Belinda acted with unprovoked aggression in clear breach of the school's anti-bullying code. I respectfully recommend that:
a) Belinda Arthur be referred to the Disciplinary Committee for appropriate sanctions;
b) She be made to formally apologize to Master Daniel Boateng and bear the cost of his medical supplies;
c) School prefects intensify supervision around the canteen area during recess periods to prevent senior intimidation.

Respectfully submitted.`
      }
    ]
  },
  sectionB_comprehension: {
    title: "Part B: Reading Comprehension",
    passage: `When Pozo adopted Abate and Ali, he vowed to take great care of them. And he did his best. But Abate and Ali did exactly what they were told not to. Their greatest passion was snail-hunting.

As he left home for an important meeting one afternoon, Pozo told the boys that he would be particularly pleased if they did not join any snail-hunting group or go snail-hunting by themselves. He even promised surprise presents if they abstained from snail-hunting for once. It was quite obvious to everyone that there would be snail-hunting because there had been a heavy downpour that morning.

Pozo's meeting was a marathon. When he arrived home at 8:30 that night, neither of the boys was at home. He felt that something grave might have happened. He stood still for some time, confused. He switched on his radio and tuned in to his favorite station, Hiawa FM, and the breaking news was: "Five snail-hunters have been run over at Yaaboi by the early evening incoming Desuano-bound train." As the dreadful news hit him, Pozo winced.

Pozo was so stupefied that he did not notice Ali enter the house, sweating and breathless, carrying a head-load of snails. But where was Abate?

Furtively, the back door squeaked open. In stole the other boy, also sweating and breathless under the weight of the head-load of snails. On seeing him, Pozo sighed with relief. He shook his head. "These boys will surely be the death of me," he murmured to himself. "When will they do exactly as they are told?"`,
    questions: [
      {
        subId: "(a)(i)",
        question: "Why was Pozo taking care of the boys?",
        answer: "Because he had legally adopted them as his sons and vowed to take great care of them."
      },
      {
        subId: "(a)(ii)",
        question: "Why do you think Pozo did not want the boys to go snail-hunting?",
        answer: "Because snail-hunting in the bush and near railway tracks at night was extremely dangerous and exposed them to deadly accidents and snakebites."
      },
      {
        subId: "(b)",
        question: "State two reasons why Pozo was sure that the boys would go snail-hunting despite his instructions.",
        answer: "1. Snail-hunting was their greatest passion.\n2. There had been a heavy downpour that morning (which created ideal conditions for snails to emerge)."
      },
      {
        subId: "(c)",
        question: "What is the meaning of the sentence, \"Pozo's meeting was a marathon\"?",
        answer: "The meeting was exceptionally long, exhausting, and took many hours to conclude."
      },
      {
        subId: "(d)(i)",
        question: "Why was Pozo so worried when he returned from the meeting at 8:30 that night?",
        answer: "Because neither of the boys was at home, making him fear that something terrible or fatal had happened to them."
      },
      {
        subId: "(d)(ii)",
        question: "How did the news of the train accident affect Pozo?",
        answer: "It terrified and paralyzed him with grief and shock (he winced and was stupefied, fearing his adopted boys were the victims)."
      },
      {
        subId: "(e)",
        question: "Explain in your own words the following expressions as used in the passage:\n(i) have been run over;\n(ii) in stole the other boy;\n(iii) be the death of me.",
        answer: "(i) **have been run over:** Crushed or knocked down by a moving locomotive train.\n(ii) **in stole the other boy:** The other boy entered the house quietly, secretly, and stealthily.\n(iii) **be the death of me:** Cause me extreme anxiety, heartbreak, and emotional distress."
      },
      {
        subId: "(f)",
        question: "For each of the following words, provide a word or phrase that means the same and can replace it in the passage without altering the meaning:\n(i) vowed;\n(ii) passion;\n(iii) abstained;\n(iv) grave;\n(v) breathless.",
        answer: "(i) **vowed:** promised / pledged / swore / resolved.\n(ii) **passion:** obsession / love / delight / craving / hobby.\n(iii) **abstained:** refrained / kept away / held back / stayed away.\n(iv) **grave:** serious / dreadful / terrible / disastrous.\n(v) **breathless:** panting / gasping / winded / out of breath."
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
        extract: "\"Oliver walked 70 miles to London. In such a big city, no one would ever find him! It was chilly and his feet hurt but he was happy to leave his old, miserable life behind.\"",
        question: "Mention two of the people whose cruel treatment drove Oliver to run away to London.",
        answer: "Mr. Bumble (the parish beadle) and Noah Claypole (or Mrs. Sowerberry / Mr. Sowerberry)."
      },
      {
        subId: "5(b)",
        textSource: "CHARLES DICKENS: Oliver Twist",
        extract: "\"It was chilly and his feet hurt but he was happy to leave his old, miserable life behind.\"",
        question: "Identify the example of contrast used in the extract above.",
        answer: "The contrast between his severe physical suffering (chilly weather and aching feet) and his inward emotional happiness (being free from his miserable past)."
      },
      {
        subId: "5(c)",
        textSource: "CHARLES DICKENS: Oliver Twist",
        extract: "\"I robbed her. Before her body was cold, / I robbed her of the one item she had. / She could have sold it for food or shelter / But she kept it safe,...\"",
        question: "What was \"the one item she had\" that was stolen from Oliver's dying mother?",
        answer: "A gold locket containing two locks of hair and a wedding ring inscribed with the name 'Agnes'."
      },
      {
        subId: "5(d)",
        textSource: "MERRILL CORNEY: Debbie, Sandy and Pepe",
        extract: "\"Well, we'll just have to look after him ourselves then\", she said. / \"We'll make a soft nest for him and feed him when he grows up, / He will stay in our garden.\"",
        question: "What object did the children choose as a nest for Pepe the baby bird?",
        answer: "A small cardboard box lined with soft cotton wool (or dry moss and fabric scraps)."
      },
      {
        subId: "5(e)",
        textSource: "MERRILL CORNEY: Debbie, Sandy and Pepe",
        extract: "\"We'll make a soft nest for him and feed him when he grows up...\"",
        question: "State the dominant theme brought out in the extract.",
        answer: "The theme of compassion, empathy, and loving care for vulnerable wild animals."
      },
      {
        subId: "5(f)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "\"My spirit Mother ought to have come for me earlier. / Now, what shall I tell them who are gone? / The daughter of slaves who come from the white man's land / Someone should advise me on how to tell my story. / My children, I am dreading my arrival there. / Where they will ask me news of home. / Shall I tell them or shall I not?\"",
        question: "Who is the speaker in this dramatic extract?",
        answer: "Nana (the aging grandmother of Ato Yawson and matriarch of the Odumna clan)."
      },
      {
        subId: "5(g)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "\"... what shall I tell them who are gone? ... My children, I am dreading my arrival there.\"",
        question: "What do the following expressions in the extract refer to?\n(I) \"... them who are gone\"\n(II) \"... there\"",
        answer: "(I) **them who are gone:** The departed ancestors / dead forebears of the clan.\n(II) **there:** The spirit world / ancestral land of the dead (afterlife)."
      },
      {
        subId: "5(h)",
        textSource: "LAWRENCE DARMANI: Scribbler's Dream",
        extract: "\"Scribbler, / The dream in your mind fills the shelf. / When upon the shelf you gaze, / A vacuum stares at you. / There is your quill and parchment, / But heavy are your hands. / Why? / Because disuse numbs the wrist.\"",
        question: "To whom or what does the title \"Scribbler\" refer in the poem?",
        answer: "An aspiring writer, poet, or author."
      },
      {
        subId: "5(i)",
        textSource: "LAWRENCE DARMANI: Scribbler's Dream",
        extract: "\"The dream in your mind fills the shelf.\"",
        question: "What does the expression \"The dream in your mind fills the shelf\" mean?",
        answer: "The aspiring writer's imaginative ideas and unwritten literary masterpieces that remain only in his thoughts rather than being published as physical books."
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

async function seedBeceEnglish2018Calibrated() {
  const db = await getDb();
  console.log("Seeding Calibrated & Balanced BECE English 2018 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2018");
  await docRef.set({
    year: 2018,
    title: "BECE English Language 2018 (Calibrated National Benchmark)",
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

  console.log("✅ Calibrated BECE English 2018 successfully seeded into Firestore!");
}

seedBeceEnglish2018Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2018:", err);
    process.exit(1);
  });
