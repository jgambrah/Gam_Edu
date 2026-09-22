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

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2012
const rawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 17) ---
  {
    number: 1,
    prompt: "During the highway collision, three commuters perished ............ the spot.",
    options: ["upon", "in", "on", "through"],
    correctAnswer: "on",
    hint: "Identify the standard preposition in the idiom meaning immediately at the exact scene of an event.",
    workedSolution: "The standard English idiom is 'on the spot', meaning immediately or at the exact scene of the occurrence.",
    points: 1
  },
  {
    number: 2,
    prompt: "The young apprentice fell ill ............. malaria during the harmattan season.",
    options: ["at", "by", "of", "with"],
    correctAnswer: "with",
    hint: "Which preposition collocates with 'ill' when naming a specific disease?",
    workedSolution: "In standard English usage, one falls 'ill with' a disease (whereas one dies 'of' a disease).",
    points: 1
  },
  {
    number: 3,
    prompt: "The experienced counselor gave ............ to the troubled students.",
    options: ["some good advice", "much good advices", "many good advice", "some good advices"],
    correctAnswer: "some good advice",
    hint: "'Advice' is an uncountable noun and can never take a plural '-s' or be modified by 'many'.",
    workedSolution: "'Advice' is an uncountable (mass) noun. It cannot be pluralized as 'advices' nor quantified with 'many'. 'Some good advice' is the only grammatically correct option.",
    points: 1
  },
  {
    number: 4,
    prompt: "All female choir members were instructed to wear ............. for the Speech Day anniversary.",
    options: [
      "new, white, long dresses",
      "new, long, white dresses",
      "long, white, new dresses",
      "white, new, long dresses"
    ],
    correctAnswer: "new, long, white dresses",
    hint: "Royal Order of Adjectives: Age ('new') precedes Size/Length ('long'), which precedes Color ('white').",
    workedSolution: "According to the Royal Order of Adjectives: Age ('new') comes before Dimension/Length ('long'), which comes before Color ('white'). Hence, 'new, long, white dresses' is correct.",
    points: 1
  },
  {
    number: 5,
    prompt: "\"I presume all delegates know ............. already,\" announced the chairman to the fifty participants.",
    options: ["one another", "each other", "themselves", "ourselves"],
    correctAnswer: "one another",
    hint: "Use this reciprocal pronoun when mutual interaction involves three or more individuals.",
    workedSolution: "When reciprocal action or familiarity involves more than two people ('fifty participants'), 'one another' is preferred. 'Each other' is used for two.",
    points: 1
  },
  {
    number: 6,
    prompt: "The girls verified that both missing tennis rackets were ............ property.",
    options: ["of Akologos", "Akologo's", "Akologo's own", "Akologo"],
    correctAnswer: "Akologo's",
    hint: "Use the singular possessive noun ending in apostrophe 's'.",
    workedSolution: "To indicate singular ownership belonging to Akologo, the possessive noun 'Akologo's' is grammatically correct.",
    points: 1
  },
  {
    number: 7,
    prompt: "Children usually take .............. their maternal relatives in physical appearance.",
    options: ["after", "from", "to", "up"],
    correctAnswer: "after",
    hint: "Identify the phrasal verb meaning to resemble an older parent or relative.",
    workedSolution: "The phrasal verb 'to take after' means to resemble an older relative in appearance, mannerisms, or character.",
    points: 1
  },
  {
    number: 8,
    prompt: "The boarding school hasn't received ............ maize flour this term.",
    options: ["some", "little", "any", "many"],
    correctAnswer: "any",
    hint: "Use this non-assertive quantifier with negative clauses containing 'hasn't'.",
    workedSolution: "In negative clauses containing 'not', the non-assertive quantifier 'any' is required with uncountable nouns ('any maize flour').",
    points: 1
  },
  {
    number: 9,
    prompt: "The municipal commander commended the ............ during the public demonstration.",
    options: ["policemen's behaviours", "policemen behaviour", "policemen's behaviour", "policemens' behaviour"],
    correctAnswer: "policemen's behaviour",
    hint: "'Policemen' is an irregular plural that forms its possessive with ''s'. 'Behaviour' is an uncountable noun.",
    workedSolution: "'Policemen' is an irregular plural noun; its possessive is formed by adding ''s' ('policemen's'). Furthermore, 'behaviour' functions as an uncountable noun here, ruling out 'behaviours'.",
    points: 1
  },
  {
    number: 10,
    prompt: "When the power outage occurred, I ............ my evening supper in the dining hall.",
    options: ["have eaten", "have been eating", "am eating", "was eating"],
    correctAnswer: "was eating",
    hint: "An ongoing past continuous action interrupted by a sudden simple past event ('the power went off').",
    workedSolution: "The past continuous tense ('was eating') describes an ongoing background action interrupted by a specific past event ('the power went off').",
    points: 1
  },
  {
    number: 11,
    prompt: "The doctor noted that the diabetic patient ............ if she had not strictly adhered to her medication.",
    options: ["has died", "will died", "would have died", "would die"],
    correctAnswer: "would have died",
    hint: "Third Conditional: 'If + past perfect' requires 'would have + past participle' in the main clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition ('if she had not kept...'), the main clause requires 'would have + past participle' ('would have died').",
    points: 1
  },
  {
    number: 12,
    prompt: "The passengers watched the aircraft ............ smoothly toward the runway.",
    options: ["take on", "take of", "take off", "take out"],
    correctAnswer: "take off",
    hint: "Identify the phrasal verb meaning to leave the ground and begin flight.",
    workedSolution: "The phrasal verb 'to take off' means to leave the ground and ascend into the air. 'Of' with a single 'f' is a preposition, not part of the verb.",
    points: 1
  },
  {
    number: 13,
    prompt: "There are many modern residential buildings in our neighborhood, ............?",
    options: ["isn't it", "aren't they", "weren't there", "aren't there"],
    correctAnswer: "aren't there",
    hint: "Existential clauses introduced by 'There are' take question tags with 'there'.",
    workedSolution: "When an existential sentence begins with 'There are', the negative question tag retains 'there': 'aren't there?'.",
    points: 1
  },
  {
    number: 14,
    prompt: "You have weeded the overgrown compound, ............?",
    options: ["haven't you", "did you", "didn't you", "had you"],
    correctAnswer: "haven't you",
    hint: "An affirmative present perfect clause with 'have' takes a negative tag using 'have'.",
    workedSolution: "The statement is affirmative present perfect ('have weeded'). Its tag must be negative using the same auxiliary: 'haven't you?'.",
    points: 1
  },
  {
    number: 15,
    prompt: "The construction of the regional sports stadium ............ early next year.",
    options: ["will be completed", "shall complete", "will be completing", "shall have completed"],
    correctAnswer: "will be completed",
    hint: "Future passive voice: 'will be + past participle'.",
    workedSolution: "The subject ('The construction...') receives the action. The future passive voice construction 'will be completed' is grammatically required.",
    points: 1
  },
  {
    number: 16,
    prompt: "Walking through contaminated floodwaters is dangerous, ............?",
    options: ["is not", "is it", "must not", "isn't it"],
    correctAnswer: "isn't it",
    hint: "A gerund subject ('Walking...') is treated as singular third-person neuter ('it'). Form a negative tag.",
    workedSolution: "A gerund phrase functioning as a singular affirmative subject ('Walking in the rain is...') takes the pronoun 'it' and a negative tag: 'isn't it?'.",
    points: 1
  },
  {
    number: 17,
    prompt: "Revise your examination answers carefully, ............ you?",
    options: ["do", "will", "may", "shall"],
    correctAnswer: "will",
    hint: "Imperative sentences expressing directives or instructions take a willingness tag.",
    workedSolution: "Imperative requests and instructions take the modal 'will you?' (or 'won't you?') as their standard question tag.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (18 - 22) ---
  {
    number: 18,
    prompt: "About fifty unauthorized structures were demolished to make way for the storm drain.\nChoose the word nearest in meaning to the underlined word 'demolished'.",
    options: ["removed", "attacked", "destroyed", "displayed"],
    correctAnswer: "destroyed",
    hint: "Pulled down, knocked down, or completely leveled.",
    workedSolution: "'Demolished' means torn down, razed to the ground, or dismantled completely; 'destroyed' is its closest synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "The school board took drastic disciplinary action against the examination fraudsters.\nChoose the word nearest in meaning to the underlined word 'drastic'.",
    options: ["bold", "dangerous", "necessary", "severe"],
    correctAnswer: "severe",
    hint: "Extreme, forceful, radical, and far-reaching in effect.",
    workedSolution: "'Drastic' describes measures that are forceful, radical, or extremely rigorous; 'severe' is its closest synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "Meteorologists forecast that coastal communities would experience torrential rainfall.\nChoose the word nearest in meaning to the underlined word 'forecast'.",
    options: ["deduced", "predicted", "imagined", "observed"],
    correctAnswer: "predicted",
    hint: "Stating beforehand based on scientific indicators what will happen.",
    workedSolution: "'Forecast' means to calculate or state in advance what is expected to occur; 'predicted' is its direct synonym.",
    points: 1
  },
  {
    number: 21,
    prompt: "The villagers revered the traditional ruler for his exemplary wisdom and philanthropy.\nChoose the word nearest in meaning to the underlined word 'revered'.",
    options: ["glorified", "respected", "feared", "praised"],
    correctAnswer: "respected",
    hint: "Felt deep respect, honor, or high veneration for someone.",
    workedSolution: "'Revered' means regarded with profound respect, awe, and veneration; 'respected' is its closest synonym.",
    points: 1
  },
  {
    number: 22,
    prompt: "When the travelers arrived at the national frontier, customs officers examined their travel passports.\nChoose the word nearest in meaning to the underlined word 'frontier'.",
    options: ["fence", "gate", "entrance", "border"],
    correctAnswer: "border",
    hint: "The political line or boundary separating two sovereign countries.",
    workedSolution: "'Frontier' in political geography refers to the border dividing two sovereign nations; 'border' is its exact equivalent.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (23 - 27) ---
  {
    number: 23,
    prompt: "Awuni feels at home whenever he visits our family compound. This means that Awuni ............",
    options: ["feels comfortable and relaxed", "lives permanently there", "moves freely around", "eats without permission"],
    correctAnswer: "feels comfortable and relaxed",
    hint: "Comfortable, relaxed, and at ease as if in one's own dwelling.",
    workedSolution: "The idiom 'to feel at home' means to feel comfortable, relaxed, welcome, and completely at ease.",
    points: 1
  },
  {
    number: 24,
    prompt: "The counselor urged the youth to stop building castles in the air and learn employable skills. This means they should ............",
    options: [
      "be realistic and practical",
      "not worry about architecture",
      "be wealthy and industrious",
      "avoid visiting high-rise buildings"
    ],
    correctAnswer: "be realistic and practical",
    hint: "Daydreaming about impractical, impossible schemes instead of facing reality.",
    workedSolution: "'To build castles in the air' is an idiom meaning to harbor unrealistic, daydreaming hopes or plans that have no practical foundation in reality.",
    points: 1
  },
  {
    number: 25,
    prompt: "The village chief instructed his spokesman not to beat about the bush during the arbitration. This means the spokesman must ............",
    options: ["not stammer in speech", "go straight to the point", "not wander into the bush", "cut down the shrubs"],
    correctAnswer: "go straight to the point",
    hint: "Discussing a matter directly without wasting time on evasive, irrelevant speech.",
    workedSolution: "'To beat about the bush' means to discuss a matter evasively without getting to the core issue. Not doing so means 'going straight to the point'.",
    points: 1
  },
  {
    number: 26,
    prompt: "As soon as the chairman departed, the clerk let the cat out of the bag regarding the promotions. This means that the clerk ............",
    options: ["bought a kitten", "released an animal", "resigned from the office", "revealed the confidential secret"],
    correctAnswer: "revealed the confidential secret",
    hint: "Disclosing a secret carelessly or prematurely.",
    workedSolution: "The idiom 'to let the cat out of the bag' means to reveal a secret or confidential fact, often carelessly or by mistake.",
    points: 1
  },
  {
    number: 27,
    prompt: "The senior master poured cold water on the prefects' picnic proposal. This means that the master ............",
    options: ["challenged the proposal legally", "approved the proposal warmly", "discouraged the proposal completely", "provoked the prefects"],
    correctAnswer: "discouraged the proposal completely",
    hint: "Showing cold disapproval and dampening enthusiasm for an idea.",
    workedSolution: "'To pour cold water on something' means to discourage, disparage, or dampen enthusiasm for an initiative or proposal.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (28 - 32) ---
  {
    number: 28,
    prompt: "While the graduate sought a permanent appointment in the civil service, he was offered a ...... post.",
    options: ["boring", "dull", "demanding", "temporary"],
    correctAnswer: "temporary",
    hint: "'Permanent' means lasting indefinitely. Find the word meaning lasting for a limited time.",
    workedSolution: "'Permanent' means enduring indefinitely without change. Its direct antonym in employment is 'temporary' (short-term).",
    points: 1
  },
  {
    number: 29,
    prompt: "Kofi is known for his violent temper, whereas his brother possesses a remarkably ...... disposition.",
    options: ["mild", "natural", "flexible", "pleasant"],
    correctAnswer: "mild",
    hint: "'Violent' means fierce, furious, and turbulent. Find the word meaning calm, gentle, and temperate.",
    workedSolution: "'Violent' in temperament describes turbulence and furious rage. Its direct opposite is 'mild' (gentle, calm, and temperate).",
    points: 1
  },
  {
    number: 30,
    prompt: "High political elevation made the elder statesman humble, but made his deputy ...... .",
    options: ["stubborn", "wicked", "arrogant", "selfish"],
    correctAnswer: "arrogant",
    hint: "'Humble' means having a modest estimate of one's importance. Find the word meaning boastful and proud.",
    workedSolution: "'Humble' means modest and unpretentious. Its direct antonym is 'arrogant' (haughty, conceited, and overbearing).",
    points: 1
  },
  {
    number: 31,
    prompt: "The museum curator verified that the gold artifact was genuine, but the replica was completely ...... .",
    options: ["bad", "fake", "damaged", "poor"],
    correctAnswer: "fake",
    hint: "'Genuine' means authentic and real. Find the word meaning fraudulent, counterfeit, or forged.",
    workedSolution: "'Genuine' means real, authentic, and original. Its direct antonym is 'fake' (counterfeit, forged, or spurious).",
    points: 1
  },
  {
    number: 32,
    prompt: "The mountaineer climbed the steep cliff laboriously and ...... into the valley.",
    options: ["descended", "circled", "fell off", "looked up"],
    correctAnswer: "descended",
    hint: "'Climbed' means ascended or moved upward. Find the formal word meaning moved downward.",
    workedSolution: "'Climbed' (ascended) means moved upward. Its direct directional antonym is 'descended' (moved downward).",
    points: 1
  },

  // --- PART II: LITERATURE IN ENGLISH (33 - 40) ---
  {
    number: 33,
    prompt: "The underlying central idea, message, or moral philosophy explored in a novel or play constitutes its ............",
    options: ["suspense", "plot", "gist", "theme"],
    correctAnswer: "theme",
    hint: "The central subject matter or philosophical argument of an artistic work.",
    workedSolution: "In literary analysis, the 'theme' is the central unifying idea, insight into life, or core subject explored by the writer.",
    points: 1
  },
  {
    number: 34,
    prompt: "The three traditional foundational branches or forms of literature are drama, prose, and ............",
    options: ["novel", "satire", "poetry", "prosody"],
    correctAnswer: "poetry",
    hint: "The genre written in stanzas, verses, and metered rhythm.",
    workedSolution: "The three primary genres of literature are Prose, Drama, and Poetry.",
    points: 1
  },
  {
    number: 35,
    prompt: "Read the poetic lines below:\n\"Time, like an ever-rolling stream, / Bears all its sons away.\"\nThe literary device used to compare Time to a rolling stream is a ............",
    options: ["symbol", "simile", "synecdoche", "personification"],
    correctAnswer: "simile",
    hint: "An explicit comparison between two distinct entities using the word 'like' or 'as'.",
    workedSolution: "'Simile' is a figure of speech that directly compares two different things using connective words such as 'like' or 'as' ('Time, like an ever-rolling stream').",
    points: 1
  },
  {
    number: 36,
    prompt: "Read the stanza below:\n\"Time, like an ever-rolling stream, (a)\nBears all its sons away; (b)\nThey fly forgotten, as a dream (a)\nDies at the opening day.\" (b)\nThe rhyme scheme of this traditional hymnal stanza is ............",
    options: ["abba", "bbaa", "abab", "baba"],
    correctAnswer: "abab",
    hint: "Observe the alternating end rhymes: 'stream' (a) / 'away' (b) / 'dream' (a) / 'day' (b).",
    workedSolution: "The end rhymes alternate between lines: 'stream' pairs with 'dream' (a), and 'away' pairs with 'day' (b), forming an 'abab' rhyme scheme.",
    points: 1
  },
  {
    number: 37,
    prompt: "The geographical location and historical time period during which the events of a novel or play occur constitute its ............",
    options: ["background", "setting", "scene", "atmosphere"],
    correctAnswer: "setting",
    hint: "The physical place, cultural milieu, and temporal era of a literary work.",
    workedSolution: "The 'setting' of a literary work encompasses the physical location, historical era, and social environment in which the narrative unfolds.",
    points: 1
  },
  {
    number: 38,
    prompt: "The literary technique of maintaining intense uncertainty, curiosity, and emotional anticipation in the audience regarding future events is ............",
    options: ["rhythm", "preface", "epilogue", "suspense"],
    correctAnswer: "suspense",
    hint: "A feeling of excited or anxious uncertainty about what may happen next.",
    workedSolution: "'Suspense' is the artistic creation of tension, curiosity, and keen anticipation in readers or audiences about the outcome of plot events.",
    points: 1
  },
  {
    number: 39,
    prompt: "The primary artistic function of imagery in literary writing is to enable readers to ............",
    options: [
      "appreciate the high financial costs of book publication",
      "visualize and clearly experience the ideas conveyed through sensory appeal",
      "admire how extensively educated the author is",
      "distinguish between legal and non-legal language"
    ],
    correctAnswer: "visualize and clearly experience the ideas conveyed through sensory appeal",
    hint: "Imagery appeals directly to sensory perception to make descriptions vivid and tangible.",
    workedSolution: "The core function of 'imagery' is to stimulate the reader's five senses (sight, sound, smell, taste, touch), allowing them to visualize and emotionally experience the writer's ideas.",
    points: 1
  },
  {
    number: 40,
    prompt: "The principal character in a dramatic work who opposes, competes with, or actively obstructs the protagonist is the ............",
    options: ["antagonist", "challenger", "opponent", "deuteragonist"],
    correctAnswer: "antagonist",
    hint: "The literary rival or adversary of the main hero/heroine.",
    workedSolution: "In dramatic literature, the adversary or opponent who stands in direct conflict with the central protagonist is termed the 'antagonist'.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 201201);

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
// PAPER 2: ESSAY & COMPREHENSION
// ==========================================
const paper2Calibrated = {
  sectionA_essay: {
    title: "Part A: Essay Writing",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Formal Letter",
        prompt: "Write a letter to the Member of Parliament (MP) of your constituency, drawing his or her attention to the alarming escalation of armed robbery incidents in your community and suggesting at least two practical measures to curb the menace.",
        modelAnswer: `Dormaa Junior High School\nP. O. Box 114\nDormaa Ahenkro, Bono Region\n15th May, 2012\n\nThe Member of Parliament\nDormaa Central Constituency\nParliament House, Accra\n\nDear Honorable Member,\n\nURGENT PETITION ON THE ALARMING ESCALATION OF ARMED ROBBERY AND RECOMMENDATIONS FOR ACTION\n\nI respectfully write on behalf of the youth and residents of Dormaa Central to draw your urgent attention to the alarming surge in armed robbery and violent attacks in our community, and to propose practical interventions to restore security.\n\nIn recent months, criminal gangs armed with locally manufactured and imported firearms have terrorized our neighborhood. Commercial stores have been raided in broad daylight, while residents returning from evening markets have been ambushed and robbed of cash and mobile devices. Many victims have sustained severe machete wounds. This pervasive insecurity has paralyzed economic nightlife, forced transport operators to suspend night services, and instilled constant fear among families.\n\nTo check this growing menace, I suggest that you liaise with the Ministry for the Interior and the Inspector General of Police to establish a well-equipped, permanent police barrier and rapid-response station in our suburb. Providing the local police command with operational patrol vehicles and communication gear will enable them to conduct regular nocturnal vehicular patrols on highway exits used by criminals as escape routes.\n\nSecondly, I recommend that your office allocate a portion of the MP's Common Fund to support the formation and vetting of a community neighborhood watchdog committee, and to install solar-powered streetlights along dark corridors. Illuminating dark alleyways will eliminate hiding spots for criminals and deter nocturnal ambushes.\n\nWe trust that your esteemed office will treat this security crisis with the utmost urgency to safeguard human lives.\n\nThank you.\n\nYours faithfully,\n[Signature]\nKwasi Mensah\n(Youth Secretary)`
      },
      {
        questionNumber: "2",
        category: "Narrative Essay",
        prompt: "Write an exciting, realistic story illustrating how timely intervention averted a catastrophic disaster, ending with the sentence: \"We arrived just in time to save the situation.\"",
        modelAnswer: `It was a sweltering Saturday afternoon in the dry month of February, and almost all the adults in our farming village of Asiakwa had journeyed to the district capital to attend the funeral of a revered clan elder. I was revising my Social Studies notes under the shade of an avocado tree with my two friends, Kwaku and Kofi, when a thick plume of black smoke billowed from the eastern edge of the village.\n\nDropping our books, we sprinted toward the scene and discovered, to our horror, that a bushfire sparked by a palm-wine tapper had ignited the dry grass behind Grandma Serwaa's thatched mud compound. The elderly woman, crippled by severe arthritis, was trapped inside her bedroom, coughing uncontrollably as sparks rained upon the dry thatch roof. With the fire advancing rapidly and no adults in sight, panic nearly paralyzed us.\n\nQuickly taking charge, I instructed Kofi to sprint to the village square and strike the heavy brass gong-gong to alert the remaining youth. Meanwhile, Kwaku and I grabbed buckets from a nearby well and soaked our shirts in water to cover our mouths. We kicked down the burning wooden kitchen fence that was feeding the blaze, creating an emergency firebreak. Snatching heavy tree branches, we beat the creeping flames while hurling buckets of soapy water onto the smoldering thatch eaves.\n\nJust as the flames began licking the dry wooden window frame of Grandma's bedroom, the mobilized youths arrived with water basins and dragged the weeping elderly woman through the front door to safety, extinguishing the last embers. Standing back breathless, covered in soot but filled with profound gratitude, we realized that we arrived just in time to save the situation.`
      },
      {
        questionNumber: "3",
        category: "Informal Letter",
        prompt: "Your father was recently honored as the 'National Best Farmer'. Write an engaging letter to your elder brother who resides overseas, describing the colorful award ceremony and explaining what made the day memorable.",
        modelAnswer: `Presbyterian Junior High School\nP. O. Box 55\nSunyani, Bono Region\n12th December, 2012\n\nDear Brother Yaw,\n\nI hope this letter finds you in fine health and peace of mind in London. I am overflowing with excitement as I write to share the glorious news: our father was officially crowned the National Best Farmer at the National Farmers' Day celebration held in Tamale last Friday!\n\nThe ceremony was a magnificent national spectacle attended by the President of the Republic, cabinet ministers, traditional rulers dressed in majestic kente regalia, and thousands of enthusiastic farmers from all ten regions. When Dad's name was broadcast across the public address system as the overall national winner, our entire family leapt to our feet, dancing and shouting with boundless joy. The master of ceremonies commended Dad's exemplary cocoa production, modern poultry housing, and sustainable agroforestry practices across his hundred-acre plantations.\n\nThe presentation of prizes was truly breathtaking. Dad was presented with the keys to a magnificent three-bedroom furnished house to be constructed at a location of his choice, an agricultural tractor, irrigation pumping machines, and a citation of national honor. Dad wept tears of deep joy as the President placed the sash around his neck and congratulated him for his decades of quiet toil.\n\nWhat made the occasion unforgettable was Dad's acceptance speech. He dedicated the award to Mom and to you and me, reminding the youth that farming is not a punishment for the uneducated, but an honorable and lucrative science.\n\nWe missed your presence, but we took numerous photographs and video clips that I will send to you soon. Please write back quickly.\n\nYour loving sister,\n[Signature]\nAkosua`
      }
    ]
  },
  sectionB_comprehension: {
    title: "Part B: Reading Comprehension",
    passage: `Cholera is a very dangerous disease which can kill many people within a short time. Indeed, it has ruined several communities particularly in developing countries. It must therefore be prevented at all costs.\n\nThe disease is generally spread by germs which thrive in filthy and unhygienic areas. There could be an outbreak of cholera when drinking water becomes polluted by floods after a downpour. Human carriers also cause the disease to spread from place to place. For example, a person carrying the cholera germs would vomit or pass frequent stools. Flies would then carry the germs on their hairy legs and deposit them on exposed food or in water. When a person eats this contaminated food or drinks the polluted water, he or she is likely to contract the disease unknowingly.\n\nOn the whole, the main symptoms of cholera are severe diarrhoea and vomiting, which may result in loss of weight. The stool tends to be watery. As a lot of fluid is lost from the body, the patient quickly becomes dehydrated, thin and weak. The rapid loss of body fluid can soon result in death, unless the lost fluid is replaced immediately.\n\nThe first thing for the patient to do is replenish as much fluid as is lost by taking, from time to time, boiled water which has been allowed to cool and mixed with salt and sugar. Then, he should seek medical attention.`,
    questions: [
      {
        subId: "(a)",
        question: "Where do cholera germs usually breed and multiply according to the passage?",
        answer: "In filthy, dirty, and unhygienic environments."
      },
      {
        subId: "(b)",
        question: "Mention the two main carriers responsible for spreading cholera germs from place to place.",
        answer: "1. Human carriers (infected persons who pass stools or vomit).\n2. Houseflies (which transport germs on their hairy legs to food and water)."
      },
      {
        subId: "(c)(i)",
        question: "State the two primary symptoms (signs) of cholera mentioned in the passage.",
        answer: "1. Severe watery diarrhoea.\n2. Frequent vomiting."
      },
      {
        subId: "(c)(ii)",
        question: "Give one serious physical effect that the disease inflicts on the human body.",
        answer: "Severe dehydration (or rapid weight loss, physical weakness, emaciation, or death)."
      },
      {
        subId: "(d)",
        question: "What immediate medical advice does the writer give to a cholera patient before seeking clinical treatment?",
        answer: "The patient should immediately replenish lost body fluids by drinking boiled, cooled water mixed with salt and sugar (Oral Rehydration Solution), and then seek medical attention."
      },
      {
        subId: "(e)",
        question: "Explain in your own words the following expressions as used in the passage:\n(i) it has ruined several communities;\n(ii) at all costs;\n(iii) after a downpour.",
        answer: "(i) **it has ruined several communities:** It has devastated, depopulated, or brought immense sorrow and economic destruction to many settlements.\n(ii) **at all costs:** By every possible effort / without fail / by whatever means necessary.\n(iii) **after a downpour:** Following a heavy rainfall."
      },
      {
        subId: "(f)",
        question: "For each of the following words, provide a word or phrase that means the same and can replace it in the passage without altering the meaning:\n(i) thrive;\n(ii) deposit;\n(iii) rapid;\n(iv) replenish;\n(v) seek.",
        answer: "(i) **thrive:** flourish / multiply / grow / prosper.\n(ii) **deposit:** drop / place / leave / transfer.\n(iii) **rapid:** fast / swift / quick / speedy.\n(iv) **replenish:** restore / replace / renew / refill.\n(v) **seek:** look for / consult / obtain / ask for."
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
    id: `comp_${q.subId.replace(/[()]/g, '_')}`,
    partLabel: `Part B: Comprehension ${q.subId}`,
    prompt: (idx === 0 ? `Read the passage carefully and answer the questions that follow:\n\n${paper2Calibrated.sectionB_comprehension.passage}\n\n` : '') + q.question,
    modelAnswer: q.answer,
    marks: 5
  }))
];

async function seedBeceEnglish2012Calibrated() {
  const db = await getDb();
  console.log("Seeding Calibrated & Balanced BECE English 2012 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2012");
  await docRef.set({
    year: 2012,
    title: "BECE English Language 2012 (Calibrated National Benchmark)",
    subjectId: "english",
    metadata: {
      isPastQuestion: true,
      standard: "NaCCA / WAEC BECE Standard",
      totalMarks: 100,
      totalDurationMinutes: 120,
      paper1Count: balancedPaper1.length,
      optionsBalanced: true,
      unplagiarizedPedagogicalAdaptation: true,
      sectionsPresent: ["Paper 1 (Objectives)", "Paper 2 Part A (Essay)", "Paper 2 Part B (Comprehension)"],
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
      title: "Paper 2: Essay and Reading Comprehension",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Calibrated BECE English 2012 successfully seeded into Firestore!");
}

seedBeceEnglish2012Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2012:", err);
    process.exit(1);
  });
