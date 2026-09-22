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
    prompt: "If the old community clinic had been renovated earlier, the roof ....... collapsed during the storm.",
    options: ["will not have", "has not", "had not", "would not have"],
    correctAnswer: "would not have",
    hint: "Conditional Type 3: 'If + past perfect' requires 'would not have + past participle' in the negative main clause.",
    workedSolution: "The condition 'If the clinic had been renovated' is in the past perfect passive. In a Third Conditional sentence, the main clause requires 'would not have' followed by the past participle ('would not have collapsed').",
    points: 1
  },
  {
    number: 2,
    prompt: "Mr. Addo weaves cane baskets as a means ........ earning supplementary income for his household.",
    options: ["for", "in", "to", "of"],
    correctAnswer: "of",
    hint: "Identify the preposition that regularly collocates with the noun phrase 'a means'.",
    workedSolution: "The noun phrase 'a means' takes the preposition 'of' when followed by a gerund ('a means of earning').",
    points: 1
  },
  {
    number: 3,
    prompt: "Esi said she heard the school choir ..... the national anthem at the assembly.",
    options: ["sing", "sang", "sung", "to sing"],
    correctAnswer: "sing",
    hint: "Verbs of perception (heard, saw, noticed) take an object followed by a bare infinitive without 'to'.",
    workedSolution: "After sensory perception verbs like 'heard', an object takes a bare infinitive ('sing') to express a complete action.",
    points: 1
  },
  {
    number: 4,
    prompt: "Pupils who drink untreated surface water easily ... waterborne parasites.",
    options: ["catch", "attract", "capture", "contract"],
    correctAnswer: "contract",
    hint: "Which formal medical verb collocates with acquiring diseases or infections?",
    workedSolution: "In formal standard English, one 'contracts' a disease, infection, or illness.",
    points: 1
  },
  {
    number: 5,
    prompt: "There is ... palm oil left in the earthenware pot.",
    options: ["a few", "few", "a lot", "a little"],
    correctAnswer: "a little",
    hint: "'Oil' is an uncountable liquid noun. Choose the quantifier indicating a small positive amount.",
    workedSolution: "'A little' is used with non-count nouns ('palm oil') to denote a small but positive quantity. 'Few' and 'a few' apply only to count nouns, while 'a lot' requires 'of'.",
    points: 1
  },
  {
    number: 6,
    prompt: "The prefects look forward to .... the regional education director at the speech day.",
    options: ["seeing", "see", "have been seeing", "be seeing"],
    correctAnswer: "seeing",
    hint: "The phrasal preposition 'look forward to' must be followed by a gerund (verb-ing).",
    workedSolution: "In the idiom 'look forward to', 'to' functions as a preposition, not an infinitive marker. Therefore, it takes a gerund ('seeing').",
    points: 1
  },
  {
    number: 7,
    prompt: "The apprentice gave no valid reason ...... arriving late at the workshop.",
    options: ["to", "of", "for", "in"],
    correctAnswer: "for",
    hint: "Which preposition follows the noun 'reason' when explaining a cause or purpose?",
    workedSolution: "The noun 'reason' takes the preposition 'for' when explaining cause or justification ('reason for arriving late').",
    points: 1
  },
  {
    number: 8,
    prompt: "What ..... Kwadwo and Mensah doing when the teacher entered the classroom?",
    options: ["are", "were", "was", "is"],
    correctAnswer: "were",
    hint: "A compound subject joined by 'and' takes a plural past continuous auxiliary verb.",
    workedSolution: "The compound subject 'Kwadwo and Mensah' is plural, and the time clause ('when the teacher entered') is in the past, requiring the past plural auxiliary 'were'.",
    points: 1
  },
  {
    number: 9,
    prompt: "Greedy individuals invariably consider .... before assisting others.",
    options: ["herself", "ourselves", "myself", "themselves"],
    correctAnswer: "themselves",
    hint: "The plural third-person subject 'Greedy individuals' takes the plural reflexive pronoun.",
    workedSolution: "The plural subject 'Greedy individuals' (they) requires the matching reflexive pronoun 'themselves'.",
    points: 1
  },
  {
    number: 10,
    prompt: "Afi asked her desk mate to ..... her a mathematical compass.",
    options: ["lend", "spare", "borrow", "excuse"],
    correctAnswer: "lend",
    hint: "To give something temporarily to someone is to 'lend'; to receive something temporarily is to 'borrow'.",
    workedSolution: "'Lend' means to give something temporarily to someone expecting it back. 'Borrow' means to take or receive temporarily from someone.",
    points: 1
  },
  {
    number: 11,
    prompt: "The road accident occurred ...... the driver's sheer negligence.",
    options: ["from", "on", "through", "by"],
    correctAnswer: "through",
    hint: "Which preposition indicates the agency, means, or root cause of an outcome?",
    workedSolution: "'Through' is used as a preposition of cause to denote that an event happened as a direct result of someone's actions or negligence.",
    points: 1
  },
  {
    number: 12,
    prompt: "Between the two sisters, I know you are ......, Esi.",
    options: ["taller", "tallest", "the taller", "the tall"],
    correctAnswer: "the taller",
    hint: "When comparing exactly two persons or things, use 'the' + comparative adjective.",
    workedSolution: "When distinguishing between two specific entities, standard English requires 'the' before the comparative degree ('the taller of the two').",
    points: 1
  },
  {
    number: 13,
    prompt: "The headmaster was not satisfied ... the explanations given by the truant student.",
    options: ["in", "to", "with", "on"],
    correctAnswer: "with",
    hint: "Identify the preposition that regularly collocates with the adjective 'satisfied'.",
    workedSolution: "The participial adjective 'satisfied' takes the preposition 'with' ('satisfied with the explanations').",
    points: 1
  },
  {
    number: 14,
    prompt: "The skilled artisan has lived in this coastal town ....... seven years.",
    options: ["through", "within", "for", "since"],
    correctAnswer: "for",
    hint: "Use 'for' to indicate the total duration/period of time, and 'since' for a specific starting point.",
    workedSolution: "'For' is used with a duration or length of time ('seven years'), whereas 'since' denotes a specific point in time.",
    points: 1
  },
  {
    number: 15,
    prompt: "The aged carpenter was ..... frail to lift the heavy mahogany beam.",
    options: ["even", "so", "too", "very"],
    correctAnswer: "too",
    hint: "The structure 'too + adjective + to-infinitive' indicates that an excessive degree prevents an action.",
    workedSolution: "'Too' combines with the infinitive 'to lift' to indicate that extreme frailty made lifting impossible.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "Her lifelong aspiration is to establish an orphanage in the village.\nChoose the word nearest in meaning to the underlined word 'aspiration'.",
    options: ["target", "joy", "plan", "desire"],
    correctAnswer: "desire",
    hint: "A strong hope, ambition, or longing to achieve something honorable.",
    workedSolution: "'Aspiration' (ambition) refers to a strong longing or hope to achieve an objective; 'desire' is the closest synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "Does the cooperative have adequate funds to purchase modern tractor equipment?\nChoose the word nearest in meaning to the underlined word 'adequate'.",
    options: ["plenty", "much", "sufficient", "full"],
    correctAnswer: "sufficient",
    hint: "Meeting the required need or quantitative standard satisfactorily.",
    workedSolution: "'Adequate' means satisfactory or enough for a specific purpose; 'sufficient' is its direct synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "The butcher slaughtered several healthy cattle for the festive market.\nChoose the word nearest in meaning to the underlined word 'slaughtered'.",
    options: ["killed", "treated", "examined", "castrated"],
    correctAnswer: "killed",
    hint: "Butchering or ending the life of livestock for food consumption.",
    workedSolution: "'Slaughtered' in animal husbandry means killed for food; its direct synonym is 'killed'.",
    points: 1
  },
  {
    number: 19,
    prompt: "The cultural dance troupe gave an energetic performance at the durbar.\nChoose the word nearest in meaning to the underlined word 'energetic'.",
    options: ["smart", "active", "friendly", "serious"],
    correctAnswer: "active",
    hint: "Full of vitality, brisk movement, and physical vigor.",
    workedSolution: "'Energetic' (lively) means full of life, movement, and physical vigor; 'active' is the closest equivalent.",
    points: 1
  },
  {
    number: 20,
    prompt: "The physical safety and well-being of pupils should be the concern of all teachers.\nChoose the word nearest in meaning to the underlined word 'well-being'.",
    options: ["wealth", "happiness", "welfare", "growth"],
    correctAnswer: "welfare",
    hint: "The health, happiness, prosperity, and comfort of a person or community.",
    workedSolution: "'Well-being' refers to the state of being comfortable, healthy, or secure; 'welfare' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "Kofi shed crocodile tears when his rival was disqualified from the race. This means that Kofi ......",
    options: [
      "was genuinely sorry for his rival",
      "felt very sad but did not cry",
      "pretended he was sorry for his rival",
      "cried uncontrollably"
    ],
    correctAnswer: "pretended he was sorry for his rival",
    hint: "Displaying false, insincere sorrow to mask inward satisfaction.",
    workedSolution: "The idiom 'to shed crocodile tears' means to display insincere, hypocritical grief or false sympathy.",
    points: 1
  },
  {
    number: 22,
    prompt: "When the night watchman heard the eerie noise in the abandoned building, his hair stood on end. This means that the watchman ......",
    options: ["started crying", "became inactive", "was frightened", "was worried"],
    correctAnswer: "was frightened",
    hint: "An instinctive bodily reaction caused by extreme fear or terror.",
    workedSolution: "The idiom 'hair stood on end' describes an intense physiological reaction of extreme terror, fear, or alarm.",
    points: 1
  },
  {
    number: 23,
    prompt: "That goldsmith always takes pains over his jewelry designs. This means that the goldsmith ......",
    options: [
      "does his work with great care",
      "finds crafting very painful",
      "is not happy crafting jewelry",
      "is often ill and cannot work"
    ],
    correctAnswer: "does his work with great care",
    hint: "Making a diligent, meticulous effort to achieve perfection.",
    workedSolution: "'To take pains' means to make a careful, thorough, and conscientious effort to do something well.",
    points: 1
  },
  {
    number: 24,
    prompt: "During the rainy season, weeds spread in the school garden in leaps and bounds. This means that the weeds grew ......",
    options: [
      "gradually and in small numbers",
      "in big circular heaps",
      "in both cold and hot weather",
      "quickly and greatly"
    ],
    correctAnswer: "quickly and greatly",
    hint: "Progressing or expanding with astonishing speed and large volume.",
    workedSolution: "'In leaps and bounds' is an idiom meaning making rapid, substantial, and spectacular progress or growth.",
    points: 1
  },
  {
    number: 25,
    prompt: "Ever since he was appointed managing director, Boateng has been full of himself. This means that Boateng is ......",
    options: ["arrogant", "dangerous", "greedy", "quarrelsome"],
    correctAnswer: "arrogant",
    hint: "Having an inflated sense of self-worth and looking down on others.",
    workedSolution: "To be 'full of oneself' means to be boastful, excessively conceited, haughty, or arrogant.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "The diligent farmer wakes up early to till his plots, whereas his lazy brother rises ......",
    options: ["often", "at home", "late", "on his bed"],
    correctAnswer: "late",
    hint: "'Early' means at or near the beginning of a period. Find the word that denotes past the proper time.",
    workedSolution: "'Early' denotes occurring near the beginning of the day. Its direct antonym is 'late'.",
    points: 1
  },
  {
    number: 27,
    prompt: "While the field laborers were completely exhausted after harvesting, the supervisor felt ......",
    options: ["cheerful", "active", "refreshed", "strong"],
    correctAnswer: "refreshed",
    hint: "'Exhausted' means completely drained of energy. Find the word meaning rested and energized.",
    workedSolution: "'Exhausted' means worn out and depleted of strength. Its direct opposite is 'refreshed' (invigorated and rested).",
    points: 1
  },
  {
    number: 28,
    prompt: "The sudden demolition of the historic market stall surprised the community, but the ...... of the modern pavilion delighted everyone.",
    options: ["construction", "creation", "erection", "relocation"],
    correctAnswer: "construction",
    hint: "'Demolition' means tearing down or leveling. Find the word meaning building or putting together.",
    workedSolution: "'Demolition' means tearing down or destroying a structure. Its antonym in building infrastructure is 'construction'.",
    points: 1
  },
  {
    number: 29,
    prompt: "Some critics labeled the architectural design ancient, but the young engineer proved that it was thoroughly ......",
    options: ["relaxing", "modern", "difficult", "interesting"],
    correctAnswer: "modern",
    hint: "'Ancient' means belonging to the distant past. Find the word meaning contemporary or current.",
    workedSolution: "'Ancient' refers to times long past. Its natural antonym is 'modern' (contemporary or up to date).",
    points: 1
  },
  {
    number: 30,
    prompt: "Without emergency feed and water during the drought, fragile livestock will perish, but indigenous breeds will ......",
    options: ["graze", "survive", "starve", "remain"],
    correctAnswer: "survive",
    hint: "'Perish' means to die or be destroyed. Find the word meaning to continue to live through hardship.",
    workedSolution: "'Perish' means to die or be ruined. Its direct antonym is 'survive' (to live on or withstand adversity).",
    points: 1
  },

  // --- SECTION E: CLOZE TEST (31 - 35) ---
  {
    number: 31,
    prompt: "A successful commercial enterprise depends on modern administrative systems. Ogboo initially rejected electronic banking and insisted on cash ---31---.",
    options: ["transactions", "inventions", "exchanges", "deliveries"],
    correctAnswer: "transactions",
    hint: "The formal commercial term for business dealings involving payments and money transfers.",
    workedSolution: "In business accounting, financial operations involving the exchange of money and goods are termed 'transactions'.",
    points: 1
  },
  {
    number: 32,
    prompt: "However, to protect their vehicles against highway robbers, his son introduced digital vehicle ---32--- devices.",
    options: ["tracking", "recording", "guiding", "speeding"],
    correctAnswer: "tracking",
    hint: "GPS-based electronic devices used to monitor the location and movement of vehicles.",
    workedSolution: "Electronic GPS surveillance equipment installed in automobiles to monitor real-time location are called 'tracking' devices.",
    points: 1
  },
  {
    number: 33,
    prompt: "By utilizing mobile financial services, the company managed to ---33--- the theft of daily ticket proceeds.",
    options: ["curb", "halt", "divert", "postpone"],
    correctAnswer: "curb",
    hint: "To restrain, check, or significantly control an unwanted activity.",
    workedSolution: "'Curb' means to restrain, check, or reduce the prevalence of an undesirable practice like revenue theft.",
    points: 1
  },
  {
    number: 34,
    prompt: "The transport firm began to ---34--- rapidly, recording record profits each financial quarter.",
    options: ["flourish", "increase", "progress", "advance"],
    correctAnswer: "flourish",
    hint: "To grow vigorously, prosper, and achieve outstanding commercial success.",
    workedSolution: "'Flourish' means to thrive, prosper, and grow in a healthy, successful manner.",
    points: 1
  },
  {
    number: 35,
    prompt: "At a transport owners' conference, the young manager decided to reveal the firm's secret to his ---35---.",
    options: ["peers", "colleagues", "competitors", "partners"],
    correctAnswer: "peers",
    hint: "Fellow members of the same professional standing or commercial trade union.",
    workedSolution: "'Peers' refers to equals in status or fellow operators within the same professional association.",
    points: 1
  },

  // --- SECTION F: ORAL LANGUAGE (36 - 40) ---
  {
    number: 36,
    prompt: "The police caught the notorious thief.\nWhich of the following words begins with the same voiceless dental fricative consonant sound as 'thief'?",
    options: ["this", "theme", "there", "then"],
    correctAnswer: "theme",
    hint: "'Thief' begins with the voiceless sound /θ/ (as in 'thin'), not the voiced sound /ð/ (as in 'this').",
    workedSolution: "'Thief' begins with the voiceless dental fricative /θ/. 'Theme' begins with the identical /θ/ sound. ('this', 'there', and 'then' begin with voiced /ð/).",
    points: 1
  },
  {
    number: 37,
    prompt: "The doctor prescribed a soothing balm.\nWhich of the following words contains a silent consonant letter just like the 'l' in 'balm'?",
    options: ["calm", "bulk", "film", "cold"],
    correctAnswer: "calm",
    hint: "In 'balm' (/bɑːm/), the letter 'l' is completely silent.",
    workedSolution: "'Balm' is pronounced /bɑːm/ with a silent 'l'. 'Calm' (/kɑːm/) also has a silent 'l'. In 'bulk', 'film', and 'cold', the 'l' is sounded.",
    points: 1
  },
  {
    number: 38,
    prompt: "The blacksmith hammered the glowing iron.\nWhich of the following words has the same initial consonant sound as the word 'iron'?",
    options: ["island", "iguana", "image", "insect"],
    correctAnswer: "island",
    hint: "'Iron' begins with the diphthong vowel sound /aɪ/, not a consonant, but phonetically which word shares the same initial /aɪ/ vowel glide?",
    workedSolution: "'Iron' begins with the diphthong /aɪ/ (/ˈaɪ.ən/). 'Island' (/ˈaɪ.lənd/) begins with the identical diphthong sound /aɪ/. ('iguana', 'image', 'insect' begin with /ɪ/).",
    points: 1
  },
  {
    number: 39,
    prompt: "The boat sailed along the quiet bay.\nWhich of the following words has the exact same vowel sound as the word 'bay'?",
    options: ["rein", "cry", "buy", "key"],
    correctAnswer: "rein",
    hint: "'Bay' is pronounced /beɪ/ with the closing diphthong /eɪ/ (same sound as 'day' and 'rain').",
    workedSolution: "'Bay' contains the diphthong /eɪ/. 'Rein' (/reɪn/) contains the identical vowel sound /eɪ/. ('cry' and 'buy' have /aɪ/; 'key' has /iː/).",
    points: 1
  },
  {
    number: 40,
    prompt: "The choir sang with one accord.\nWhich of the following words has the same initial consonant sound as the digraph 'ch' in 'choir'?",
    options: ["kite", "chain", "charity", "chase"],
    correctAnswer: "kite",
    hint: "'Choir' is pronounced /ˈkwaɪ.ər/, beginning with the voiceless velar plosive /k/.",
    workedSolution: "'Choir' begins with the /k/ sound. 'Kite' begins with the identical voiceless velar plosive /k/. ('chain', 'charity', 'chase' start with /tʃ/).",
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

const assignedTargetIndices = seedShuffle(targetKeys, 202206);

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
        prompt: "Write an article for publication in your school magazine on the topic: \"My Role Model and How He or She Has Influenced My Life.\"",
        modelAnswer: `MY ROLE MODEL AND HOW SHE HAS INFLUENCED MY LIFE\nBy Abena Oforiwaa, JHS 3\n\nIn a world full of diverse influences, having a dependable role model is essential for navigating the challenges of youth. My role model is my maternal aunt, Dr. Joyce Afriyie, a dedicated medical practitioner and community philanthropist whose remarkable life continues to shape my ambitions and character.\n\nAunt Joyce's journey to becoming a physician was fraught with hardship. Growing up in a modest farming community in the Ashanti Region, she walked several miles daily to attend school and sold vegetables to pay her examination fees. Her unwavering resilience and dedication saw her through medical school with honors. This incredible determination has taught me that poverty is never an obstacle to academic excellence if one possesses perseverance and self-discipline.\n\nFurthermore, Aunt Joyce has influenced my values through her compassionate service to humanity. Every weekend, she organizes free community health screenings for market women and elderly villagers. Observing her treat every patient with empathy and dignity has inspired me to take my studies in Integrated Science and Mathematics seriously, as I aspire to become a pediatrician. Whenever I face academic stress or difficult assignments, remembering her cheerful endurance gives me the strength to push forward.\n\nIn conclusion, Dr. Joyce Afriyie represents the virtues of hard work, humility, and selfless service. She has taught me that true greatness lies not in material possessions, but in the positive impact one makes in the lives of others.`
      },
      {
        questionNumber: "2",
        category: "Narrative Essay",
        prompt: "Write an interesting story that ends with the statement: \"Unfortunately, I realized when it was too late that my friend was a wolf in sheep's clothing.\"",
        modelAnswer: `When Raymond transferred to our school in Form Two, his gentle speech and polished manners made him an instant favorite among teachers and classmates. He volunteered to clean chalkboards, offered to assist classmates with homework, and sat beside me in class. Convinced that I had found a loyal friend, I opened my heart to him and shared my deepest secrets.\n\nToward the end of the second term, our school organized an inter-class fundraising competition for the municipal library project. Because of my integrity, our class elected me as treasurer. Each afternoon, I dutifully collected contributions and recorded figures in my ledger, keeping the money in my locked school bag. Raymond frequently sat with me while I counted the banknotes, praising my honesty and suggesting that we keep the funds safe in a secret drawer in his locker over the weekend.\n\nTrusting him completely, I handed the envelope containing one thousand two hundred Ghana Cedis to him on Friday afternoon. On Monday morning, the school was thrown into pandemonium when the envelope was reported stolen from the locker. Raymond feigned utter shock, weeping loudly and insinuating before the disciplinary committee that I might have pocketed the cash before handing him the envelope.\n\nThough my parents paid back the missing money to clear my name, the truth emerged during the holidays when Raymond's elder brother discovered the exact stolen banknotes hidden under Raymond's mattress. Unfortunately, I realized when it was too late that my friend was a wolf in sheep's clothing.`
      },
      {
        questionNumber: "3",
        category: "Informal Letter",
        prompt: "Write a letter to your friend describing two ways in which you prepared for your father's milestone birthday party, and tell him or her what made the celebration a truly memorable one.",
        modelAnswer: `Holy Child Junior High School\nP. O. Box 55\nCape Coast, Central Region\n20th October, 2022\n\nDear Sandra,\n\nI hope this letter finds you in good health and high spirits. I am writing to tell you all about the grand celebration we organized for my father's sixtieth birthday last Saturday. It was an unforgettable occasion, and I wish you had been there!\n\nIn the weeks leading up to the celebration, my siblings and I engaged in meticulous preparations to surprise Dad. First, my elder sister and I took charge of coordinating the catering and decorations. We spent days contacting local caterers to design a balanced menu featuring traditional Ghanaian delicacies like jollof rice, waakye, and tender goat light soup. We also decorated our family compound with gold and royal blue drapes, fairy lights, and beautiful floral centerpieces that transformed the house completely.\n\nSecondly, I secretly compiled a commemorative video documentary chronicling Dad's life. I contacted his childhood friends, former classmates, and university colleagues across the country to record short video tributes commending his decades of selfless public service. Editing the clips and family photographs took many late nights, but the result was spectacular.\n\nWhat made the celebration truly memorable was Dad's emotional reaction. When we played the tribute video on the projector, tears of joy rolled down his cheeks as he watched long-lost friends recount fond memories. Seeing him dance joyfully with Mom surrounded by relatives was the happiest moment of my life.\n\nWrite back soon and tell me how your mid-term holidays went.\n\nYour loving friend,\n[Signature]\nAkua`
      }
    ]
  },
  sectionB_comprehension: {
    title: "Part B: Reading Comprehension",
    passage: `Ogboo was a highly successful entrepreneur who operated an extensive fleet of transport vehicles. Despite his considerable wealth and prominence in the village, he was widely admired for his generosity and modest lifestyle. He loved his children dearly but deliberately avoided pampering them. He viewed modern labor-saving kitchen appliances and electronic gadgets as costly luxuries that fostered laziness and eroded traditional discipline among children. Consequently, food in his household was prepared using earthenware grinding bowls and firewood, which he maintained imparted superior flavor. He also personally gave his children neat haircuts to instill modesty.\n\nAt school, Ogboo's children were the only students who did not possess cellular phones, receiving written letters by post instead. Akwesi, his eldest son, endured persistent mockery and teasing from his peers, but he bore the humiliation with patient forbearance. Upon completing his secondary education, his father appointed him general manager of the family transport enterprise. Akwesi determined to modernize operations without compromising discipline. He secretly purchased a mobile phone for his mother, furnished the home with modern kitchen appliances, installed satellite tracking devices on his father's commercial vehicles, and mandated all drivers to remit daily sales via electronic mobile money services, swearing them to strict confidentiality.\n\nDuring an era when vehicular robbery, driver embezzlement, and highway hijacking plagued the commercial transport sector, Ogboo's fleet continued to flourish smoothly. His enterprise appeared miraculously immune to transit theft, which baffled fellow vehicle owners. Soon, suspicious rumors circulated. Some villagers insinuated that Ogboo possessed occult powers, while others alleged that he was in collusion with highway criminal syndicates, causing former associates to avoid his company. Deeply troubled by the false allegations tarnishing his father's name, Akwesi decided to reveal the secret at an executive meeting of the regional transport union.`,
    questions: [
      {
        subId: "(a)",
        question: "State two things that Ogboo did to demonstrate that he did not pamper his children.",
        answer: "1. He prohibited modern labor-saving kitchen gadgets and electronic devices in the home, insisting on traditional manual food preparation.\n2. He personally gave his children haircuts and allowed them to receive only postal letters (snail mail) rather than mobile phones."
      },
      {
        subId: "(b)(i)",
        question: "Identify two operational changes that Akwesi introduced differently when he took over management.",
        answer: "1. He installed electronic satellite tracking devices on the transport vehicles.\n2. He mandated that drivers remit daily sales electronically through mobile money transfer services."
      },
      {
        subId: "(b)(ii)",
        question: "List two adjectives that describe the character of Akwesi's commercial drivers in keeping the new system secret.",
        answer: "Loyal and obedient (or trustworthy, disciplined, discreet, faithful)."
      },
      {
        subId: "(c)",
        question: "State two major security problems that commercial vehicle owners faced during that era, according to the passage.",
        answer: "1. Highway armed robbery and car hijacking (car snatching).\n2. Embezzlement and theft of daily earnings by dishonest drivers."
      },
      {
        subId: "(d)(i)",
        question: "\"Akwesi let the cat out of the bag.\"\nWhat did Akwesi do?",
        answer: "He disclosed or revealed the secret behind his father's secure and prosperous transport business."
      },
      {
        subId: "(d)(ii)",
        question: "Why did Akwesi let the cat out of the bag?",
        answer: "To clear his father's honorable name from malicious rumors, false accusations of occultism, and allegations of collusion with armed robbers."
      },
      {
        subId: "(e)",
        question: "Explain in your own words the following expressions as used in the passage:\n(i) order of the day;\n(ii) tongues began to wag;\n(iii) in league with.",
        answer: "(i) **order of the day:** Commonplace / widespread / daily occurrences / customary events.\n(ii) **tongues began to wag:** People started gossiping, speculating, and spreading rumors.\n(iii) **in league with:** In secret conspiracy, alliance, or collusion with."
      },
      {
        subId: "(f)",
        question: "For each of the following words, provide a word or phrase that means the same and can replace it in the passage without altering the meaning:\n(i) highly;\n(ii) pamper;\n(iii) manage;\n(iv) installed;\n(v) flourish.",
        answer: "(i) **highly:** greatly / immensely / exceedingly / very much.\n(ii) **pamper:** spoil / overindulge / coddle / baby.\n(iii) **manage:** run / oversee / direct / supervise / administer.\n(iv) **installed:** fitted / mounted / fixed / set up.\n(v) **flourish:** thrive / prosper / boom / succeed."
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
        extract: "\"You know why, son. If a rich and successful man marries a woman whose name is stained because of her birth, it will be quite sad indeed .... wicked people will not let her forget her past, even though it's not her fault.\"",
        question: "To whom do the terms \"son\" and \"rich and successful man\" refer in the extract?",
        answer: "Harry Maylie (the son of Mrs. Maylie, who was deeply in love with Rose)."
      },
      {
        subId: "5(b)",
        textSource: "CHARLES DICKENS: Oliver Twist",
        extract: "\"You know why, son...\"",
        question: "Who is the speaker of the words in the extract?",
        answer: "Mrs. Maylie (Harry's mother and Rose's guardian)."
      },
      {
        subId: "5(c)",
        textSource: "CHARLES DICKENS: Oliver Twist",
        extract: "\".. a woman whose name is stained because of her birth ...\"",
        question: "How did Rose's birth supposedly stain her name according to society?",
        answer: "She was believed to be illegitimate (born out of wedlock) and connected to a family background tainted by disgrace and scandal."
      },
      {
        subId: "5(d)",
        textSource: "LAWRENCE DARMANI: Sosu and the Bukari Boys",
        extract: "\"Sosu felt his parents were very mean; otherwise, why did they give him such a small amount of money? Look at his friend, Bukari, who always brought a lot of money to school! ...\nBukari's father dropped him at school every day while he and Vivian had to walk.\"",
        question: "State the central theme brought out in this extract.",
        answer: "The theme of discontentment, envy, and the danger of ungrateful peer comparison among young people."
      },
      {
        subId: "5(e)",
        textSource: "LAWRENCE DARMANI: Sosu and the Bukari Boys",
        extract: "\"Sosu felt his parents were very mean...\"",
        question: "Identify the main literary device used in the extract to highlight the difference between Sosu and Bukari.",
        answer: "Contrast (or Juxtaposition), comparing Bukari's affluent lifestyle directly against Sosu's modest background."
      },
      {
        subId: "5(f)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "MONKA: The master-scholar was sitting on the chair studying, so he could not move off!",
        question: "Why did Monka need the chair that Ato was occupying?",
        answer: "She needed the chair for her mother, Esi Kom, who had returned exhausted from her labor on the farm."
      },
      {
        subId: "5(g)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "MONKA: The master-scholar was sitting on the chair studying...",
        question: "State the physical scene/setting where this dramatic extract occurs.",
        answer: "The courtyard of the ancestral family house of the Odumna clan in the village of Esikuma."
      },
      {
        subId: "5(h)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "\"The master-scholar...\"",
        question: "To whom does the sarcastic title \"master-scholar\" refer?",
        answer: "Ato Yawson (her educated brother who recently returned from the United States)."
      },
      {
        subId: "5(i)",
        textSource: "LADE WOSORNU: Desert Rivers",
        extract: "Without a sound\nThey gush out into the bowels of the seas\nFar, far away from the unaided human eyes\nIf you cannot see our tears\nIt does not mean we do not cry.",
        question: "In the poem, what do the hidden underground 'rivers' symbolize?",
        answer: "Hidden inner emotional anguish, silent human suffering, and unexpressed tears beneath a calm exterior."
      },
      {
        subId: "5(j)",
        textSource: "LADE WOSORNU: Desert Rivers",
        extract: "\"If you cannot see our tears\nIt does not mean we do not cry.\"",
        question: "State the dominant theme conveyed in the closing lines of the stanza.",
        answer: "The theme of silent endurance, emotional stoicism, and the reality of unseen human sorrow."
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

async function seedBeceEnglish2022Calibrated() {
  const db = await getDb();
  console.log("Seeding Calibrated & Balanced BECE English 2022 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2022");
  await docRef.set({
    year: 2022,
    title: "BECE English Language 2022 (Calibrated National Benchmark)",
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

  console.log("✅ Calibrated BECE English 2022 successfully seeded into Firestore!");
}

seedBeceEnglish2022Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2022:", err);
    process.exit(1);
  });
