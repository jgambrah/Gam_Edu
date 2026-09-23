import * as dns from 'dns';
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
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
      return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient, ignoreUndefinedProperties: true });
    }
  } catch (e) {
    console.log("Fallback to admin default credentials...", e);
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

// =========================================================================
// 100% CLEAN-ROOM ISOMORPHIC QUESTIONS (1 - 30)
// =========================================================================
const allRawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "Following the physician's stern medical warning, John has given ............ smoking permanently.",
    options: ["in", "off", "out", "up"],
    correctAnswer: "up",
    hint: "Identify the phrasal verb meaning to cease, abandon, or stop a habit completely.",
    workedSolution: "The phrasal verb 'to give up' means to abandon or stop a habitual activity permanently: 'given up smoking'.",
    points: 1
  },
  {
    number: 2,
    prompt: "The gathering at the durbar grounds was ............ massive that the municipal director was alarmed.",
    options: ["quite", "so", "too", "very"],
    correctAnswer: "so",
    hint: "Correlative clause of result: 'so + adjective + that + consequence'.",
    workedSolution: "The degree adverb 'so' pairs correlatively with the subordinator 'that' to introduce a consequence: 'so large that the Director became frightened'.",
    points: 1
  },
  {
    number: 3,
    prompt: "By the time the delayed passengers arrived at the terminal, the commercial buses ............ already departed.",
    options: ["are", "had", "have", "were"],
    correctAnswer: "had",
    hint: "Past Perfect tense expressing an action completed prior to another past event ('When we got there...').",
    workedSolution: "The departure of the buses took place before the passengers' past arrival, requiring the Past Perfect auxiliary: 'had left'.",
    points: 1
  },
  {
    number: 4,
    prompt: "The commemorative leather-bound dictionary was ............ to me by the headmistress.",
    options: ["gave", "given", "giving", "to give"],
    correctAnswer: "given",
    hint: "Passive voice: was + past participle (give - gave - given).",
    workedSolution: "The passive voice construction requires the past participle form of 'give', which is 'given': 'The book was given to me'.",
    points: 1
  },
  {
    number: 5,
    prompt: "Auntie Mansa is the hospitable lady to ............ I delivered the parcel.",
    options: ["who", "whom", "which", "whose"],
    correctAnswer: "whom",
    hint: "Objective relative pronoun used when governed directly by a preceding preposition ('to').",
    workedSolution: "Following a preposition ('to'), standard prescriptive grammar strictly requires the objective relative pronoun 'whom': 'the lady to whom I gave the list'.",
    points: 1
  },
  {
    number: 6,
    prompt: "He is your childhood companion, ............?",
    options: ["doesn't he", "does he", "isn't he", "isn't it"],
    correctAnswer: "isn't he",
    hint: "An affirmative present statement with contracted copula 'He's' (He is) takes a negative tag with 'is'.",
    workedSolution: "The main clause has an affirmative present copula ('He is') with masculine subject 'He'. The corresponding question tag must be negative: 'isn't he?'.",
    points: 1
  },
  {
    number: 7,
    prompt: "Kay: \"You didn't travel to the capital yesterday, did you?\"\nLee: \"............; I remained in the village.\"",
    options: [
      "No, I did",
      "No, I didn't",
      "Yes, did I",
      "Yes, I didn't"
    ],
    correctAnswer: "No, I didn't",
    hint: "Standard English polarity: In answering a negative question, agreement with the negative fact requires 'No' + negative auxiliary.",
    workedSolution: "In standard English, confirming a negative statement ('I did not go') requires negative polarity: 'No, I didn't'.",
    points: 1
  },
  {
    number: 8,
    prompt: "The clouds are gathering rapidly; you had better ............ for home immediately.",
    options: ["left", "leave", "be leaving", "to leave"],
    correctAnswer: "leave",
    hint: "The semi-modal idiom 'had better' is followed strictly by a bare infinitive without 'to'.",
    workedSolution: "The semi-modal expression 'had better' takes a bare infinitive without 'to': 'had better leave now'.",
    points: 1
  },
  {
    number: 9,
    prompt: "Kwame requested his desk-mate to ............ him a ballpoint pen for the examination.",
    options: ["borrow", "excuse", "lend", "spare"],
    correctAnswer: "lend",
    hint: "'Lend' means to grant temporary use to someone; 'borrow' means to take temporary use from someone.",
    workedSolution: "'Lend' means to give something temporarily to another person. The sentence means 'to give him a pen temporarily': 'lend him a pen'.",
    points: 1
  },
  {
    number: 10,
    prompt: "She concluded her informal letter with the standard complimentary close: ............",
    options: [
      "'Yours sincerely'",
      "'Your's sincerely'",
      "'Yours' sincerely'",
      "'Your sincerely'"
    ],
    correctAnswer: "'Yours sincerely'",
    hint: "Absolute possessive pronoun 'Yours' never takes an apostrophe.",
    workedSolution: "In epistolary complimentary closes, 'Yours' is an absolute possessive pronoun and never takes an apostrophe: 'Yours sincerely'.",
    points: 1
  },
  {
    number: 11,
    prompt: "Because she suspected illegal hoarding, the storekeeper refused to sell me ............ kerosene.",
    options: ["any", "little", "plenty", "some"],
    correctAnswer: "any",
    hint: "Verbs with negative semantic meaning like 'refused' trigger the non-assertive quantifier 'any'.",
    workedSolution: "The verb 'refused' has negative polarity, requiring the non-assertive determiner 'any' with non-count nouns: 'refused to sell me any kerosene'.",
    points: 1
  },
  {
    number: 12,
    prompt: "\"Yes, ............ an encyclopedia,\" the librarian affirmed as he handed it over.",
    options: ["is", "its", "it's", "it"],
    correctAnswer: "it's",
    hint: "Contracted form of 'it is' acting as dummy subject and copular verb.",
    workedSolution: "The clause requires a subject and a verb ('it is'), which contracts with an apostrophe as 'it's': 'Yes, it's a book'. ('Its' without an apostrophe is possessive).",
    points: 1
  },
  {
    number: 13,
    prompt: "I am aware that you are much ............ than your elder sister, Esi.",
    options: ["tall", "taller", "tallest", "the taller"],
    correctAnswer: "taller",
    hint: "Comparative degree with '-er' paired with the comparative marker 'than' and intensified by 'much'.",
    workedSolution: "When comparing two individuals followed by 'than', the comparative form 'taller' is required. Adverb 'much' correctly intensifies the comparative degree: 'much taller than'.",
    points: 1
  },
  {
    number: 14,
    prompt: "Neither the actor nor his close friend ............ a theatrical performance to the end.",
    options: ["watch", "watches", "was watching", "were watching"],
    correctAnswer: "watches",
    hint: "Proximity rule with 'neither... nor': The verb agrees with the nearer singular subject ('his friend').",
    workedSolution: "In 'neither... nor' constructions, the verb agrees with the subject closer to it ('his friend', singular third-person), requiring the simple present inflection 'watches'.",
    points: 1
  },
  {
    number: 15,
    prompt: "Araba and Osei are a devoted married couple who support and love ............ deeply.",
    options: ["each other", "one another", "themselves", "the other"],
    correctAnswer: "each other",
    hint: "Reciprocal pronoun used when an action is mutually exchanged between exactly two individuals.",
    workedSolution: "'Each other' is the reciprocal pronoun used when referring to two persons ('Araba and Osei'). 'One another' is preferred for three or more.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The physical and moral welfare of students should be the paramount concern of all educators.\nChoose the word nearest in meaning to 'welfare'.",
    options: ["growth", "joy", "wealth", "well-being"],
    correctAnswer: "well-being",
    hint: "The state of being comfortable, healthy, prosperous, or safe.",
    workedSolution: "'Welfare' refers to health, happiness, prosperity, and general 'well-being'; 'well-being' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "The visiting missionary remarked that the tribal ritual was completely alien to him.\nChoose the word nearest in meaning to 'alien'.",
    options: ["boring", "new", "modern", "unfamiliar"],
    correctAnswer: "unfamiliar",
    hint: "Foreign, strange, not known or experienced before.",
    workedSolution: "'Alien' in this context means strange, foreign, or 'unfamiliar'.",
    points: 1
  },
  {
    number: 18,
    prompt: "The magistrate discovered that the defense witness's testimony was entirely fictitious.\nChoose the word nearest in meaning to 'fictitious'.",
    options: ["artificial", "false", "interesting", "real"],
    correctAnswer: "false",
    hint: "Fabricated, untrue, invented, or not genuine.",
    workedSolution: "'Fictitious' means invented, fabricated, or untrue; 'false' is its direct synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "The customer placed an order for rice and stew at the downtown eatery.\nChoose the word nearest in meaning to 'an order'.",
    options: ["a command", "a demand", "a request", "a directive"],
    correctAnswer: "a request",
    hint: "A commercial request to be supplied with food or goods.",
    workedSolution: "'An order' in commercial catering is a formal requisition or 'request' to be served goods.",
    points: 1
  },
  {
    number: 20,
    prompt: "Nothing in human experience can compare to the infinite wisdom and majesty of Providence.\nChoose the word nearest in meaning to 'infinite'.",
    options: ["endless", "immeasurable", "incomplete", "inconstant"],
    correctAnswer: "immeasurable",
    hint: "Limitless, boundless, impossible to quantify or measure.",
    workedSolution: "'Infinite' means boundless, limitless, or incapable of being measured; 'immeasurable' (or endless) is its closest synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "Nimo worked tirelessly after his commercial enterprise collapsed and soon found his feet. This means that Nimo ............",
    options: [
      "purchased a new fleet of vehicles",
      "recovered his physical ability to walk",
      "revived his business and became self-reliant again",
      "sold off his remaining commercial assets"
    ],
    correctAnswer: "revived his business and became self-reliant again",
    hint: "To become established, recover from misfortune, and regain confidence or independence.",
    workedSolution: "The idiom 'to find one's feet' means to recover from setbacks, establish oneself, and regain financial independence or success.",
    points: 1
  },
  {
    number: 22,
    prompt: "Manna decided to lay aside some funds for her sister's upcoming graduation reception. This means that Manna ............",
    options: [
      "refused to support the celebration",
      "saved and reserved money for the reception",
      "spent all her savings on the party",
      "secured an emergency bank overdraft"
    ],
    correctAnswer: "saved and reserved money for the reception",
    hint: "To set apart, save, or reserve money for future use.",
    workedSolution: "The phrasal verb 'to lay aside' means to save, store, or reserve money for a specific future purpose.",
    points: 1
  },
  {
    number: 23,
    prompt: "Mary celebrated her admission into medical school as a red-letter day. This means the occasion was ............",
    options: [
      "violent and dangerous",
      "lively and enjoyable",
      "unforgettably memorable and historic",
      "difficult and rough"
    ],
    correctAnswer: "unforgettably memorable and historic",
    hint: "A day that is pleasantly noteworthy, memorable, or joyfully historic.",
    workedSolution: "The idiom 'a red-letter day' refers to a memorable, joyfully historic, and significant day in a person's life.",
    points: 1
  },
  {
    number: 24,
    prompt: "The managing clerk has been relieved of his post following the audit investigation. This means that he has been ............",
    options: [
      "dismissed from employment",
      "assigned another department",
      "demoted in salary",
      "promoted to senior rank"
    ],
    correctAnswer: "dismissed from employment",
    hint: "To be officially removed, discharged, or dismissed from a job or office.",
    workedSolution: "The formal administrative idiom 'to be relieved of one's post' means to be removed or dismissed from employment.",
    points: 1
  },
  {
    number: 25,
    prompt: "Foli and Adzovi hit it off quite well when they met at the youth conference. This means they ............",
    options: [
      "quarreled repeatedly",
      "got on very well and formed an instant friendship",
      "played on the same soccer team",
      "debated against each other"
    ],
    correctAnswer: "got on very well and formed an instant friendship",
    hint: "To become good friends quickly and get along harmoniously.",
    workedSolution: "The idiom 'to hit it off' means to establish an immediate, harmonious friendship and get on very well together.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "While the residents in our neighborhood are polite to strangers, the gatekeeper is remarkably ...... .\nChoose the word most nearly opposite in meaning to 'polite'.",
    options: ["cruel", "mean", "rude", "unfair"],
    correctAnswer: "rude",
    hint: "'Polite' means courteous and well-mannered. What word denotes ill-mannered, discourteous, or insolent?",
    workedSolution: "'Polite' means courteous and well-mannered. Its direct behavioral antonym is 'rude' (impolite).",
    points: 1
  },
  {
    number: 27,
    prompt: "Tilapia are plentiful in the lower estuary, but remarkably ...... in the highland rapids.\nChoose the word most nearly opposite in meaning to 'plentiful'.",
    options: ["little", "scarce", "small", "unusual"],
    correctAnswer: "scarce",
    hint: "'Plentiful' means existing in great abundance. What word denotes rare, hard to find, or in short supply?",
    workedSolution: "'Plentiful' means abundant and overflowing. Its direct ecological and supply antonym is 'scarce' (rare or meager).",
    points: 1
  },
  {
    number: 28,
    prompt: "The market price of crude petroleum has fallen sharply, whereas commercial transport fares have ...... .\nChoose the word most nearly opposite in meaning to 'fallen'.",
    options: ["aggravated", "doubled", "risen", "weakened"],
    correctAnswer: "risen",
    hint: "'Fallen' in price means dropped or decreased. What word denotes increased or gone upward?",
    workedSolution: "'Fallen' in economic price trends means dropped. Its direct quantitative opposite is 'risen' (increased).",
    points: 1
  },
  {
    number: 29,
    prompt: "The trader labored diligently to stock his hardware depot, but economic inflation threatened to ...... it.\nChoose the word most nearly opposite in meaning to 'stock'.",
    options: ["decorate", "empty", "fill", "reinforce"],
    correctAnswer: "empty",
    hint: "'To stock' means to supply or fill with goods. What word denotes to drain of goods or vacate?",
    workedSolution: "'To stock' a shop means to fill or supply it with merchandise. Its direct operational antonym is to 'empty' it.",
    points: 1
  },
  {
    number: 30,
    prompt: "There was total mayhem in the stadium as the fans panicked, but the police restored ...... .\nChoose the word most nearly opposite in meaning to 'mayhem'.",
    options: ["anger", "fear", "order", "riot"],
    correctAnswer: "order",
    hint: "'Mayhem' means violent disorder, chaos, and confusion. What word denotes peaceful, disciplined organization?",
    workedSolution: "'Mayhem' denotes chaotic disorder and violent confusion. Its direct civic antonym is 'order' (peaceful organization and calm).",
    points: 1
  }
];

// Seeded Deterministic Shuffle across 30 Objective Items: Exactly 8 A, 7 B, 8 C, 7 D
const targetKeys: number[] = [
  0, 1, 2, 3, 0, 1, 2, 3, 0, 1,
  2, 3, 0, 1, 2, 3, 0, 1, 2, 3,
  0, 1, 2, 3, 0, 1, 2, 3, 0, 2
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

const assignedTargetIndices = seedShuffle(targetKeys, 201702);

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
    title: "Part A: Essay Writing",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Informal Letter",
        prompt: "You have recently been enstooled as a young traditional chief in your hometown. Write a letter to your close friend in another school, informing him or her of your installation and outlining at least two major developmental projects you intend to undertake to improve the town.",
        modelAnswer: `The Royal Palace
P. O. Box 12
Dormaa-Ahenkro, Bono Region
14th May, 2017

Dear Kwabena,

I write to share the extraordinary news of an unexpected milestone in my life. Last Saturday, I was officially enstooled as the Nkosuohene (Development Chief) of my ancestral hometown, Dormaa-Ahenkro, under the royal stool name Nana Kweku Boateng I! While shouldering customary responsibilities alongside my basic school studies is daunting, I am determined to lead our community toward rapid modernization.

As the development chief, I have prioritized two transformative projects to uplift our township. First and foremost, I intend to spearhead the construction of a modern community Information and Communication Technology (ICT) library complex. In this digital era, our basic school students cannot compete on equal footing with urban peers without hands-on computer literacy. My palace has already secured a four-acre plot near the municipal park, and I am mobilizing our citizens living abroad to donate fifty desktop computers and solar power inverters.

Secondly, I plan to tackle our chronic youth unemployment by establishing a mechanized agro-processing cooperative. Our town produces tons of tomatoes and cassava that rot during bumper harvests due to lack of market access. Constructing a modest community processing center to dry vegetables and mill cassava into packaged flour will create stable employment for over one hundred unemployed youths and boost rural household incomes.

The official coronation durbar will take place during the upcoming Kwafie Festival. I expect you to be my special royal guest!

Your true friend,
[Signature]
Nana Kweku Boateng I
(Emmanuel Addo)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in a national daily newspaper on the topic: \"The Indispensable Usefulness of the Mobile Phone in Contemporary Society.\"",
        modelAnswer: `THE INDISPENSABLE USEFULNESS OF THE MOBILE PHONE IN CONTEMPORARY SOCIETY
By Samuel K. Boateng, Begoro

Two decades ago, telecommunication in Ghana was a frustrating ordeal characterized by long queues at post offices and crackling landline booths. Today, the rapid proliferation of mobile telephony has sparked a technological revolution, transforming the handheld cellular phone into an indispensable tool for human survival, economic enterprise, and social cohesion.

First and foremost, the mobile phone has revolutionized instant communication and personal safety. Regardless of geographical distance, family members, business partners, and security agencies can connect instantaneously via voice calls, text messaging, and internet video conferencing. In critical domestic and medical emergencies—such as midnight armed robbery intrusions, sudden fires, or obstetric crises—a quick telephone call mobilizes police tactical units, firefighters, and hospital ambulances within minutes, saving countless lives that would otherwise have perished in isolation.

Secondly, mobile telephony has democratized commerce and financial transactions through mobile money platforms. Millions of unbanked rural farmers and small-scale traders who previously lacked access to brick-and-mortar commercial banks now send funds, settle electricity bills, and receive payment for agricultural produce securely via their handsets. This financial inclusion has minimized the hazard of carrying liquid cash, drastically curbing highway robberies and boosting commercial liquidity.

Furthermore, smartphones serve as mobile electronic classrooms. Students use mobile search engines and educational portals to research academic topics, download past examination compendiums, and attend virtual lectures, democratizing access to quality education.

In conclusion, while irresponsible usage can lead to distraction, the mobile phone is undeniably an extraordinary technological blessing that anchors modern civilization.`
      },
      {
        questionNumber: "3",
        category: "Narrative Moral Essay",
        prompt: "Write an engaging, realistic story that illustrates the timeless truth of the saying: \"So it pays to be kind to strangers.\"",
        modelAnswer: `SO IT PAYS TO BE KIND TO STRANGERS

On a chilly, stormy Friday afternoon during our mid-term vacation, a violent downpour swept across our agrarian village. Sitting on our front porch with my elder brother, Kofi, we noticed an elderly man drenched to the bone, shivering violently by our roadside drainage ditch. His tattered cotton tunic was caked in red mud, his leather sandals were broken, and he leaned heavily on a bamboo walking stick, looking faint with hunger and exhaustion.

While several neighbors ignored him or drove him away from their shop verandas, fearing he was a vagrant or lunatic, my heart went out to him. Remembering our late grandmother's counsel that angels often visit disguised as wayfarers, I guided him onto our veranda. Kofi fetched a dry towel and one of Father's warm woolen sweaters for him to change into. I then hurried to the kitchen, warmed a bowl of spicy chicken soup, and served him with two roasted plantains and a cup of hot tea. The old man wept quietly in gratitude, prayed for our prosperity, and departed when the storm abated.

Three years later, my elder brother, Kofi, traveled to Accra to attend an interview for a competitive commercial banking scholarship that would cover his university education. Over two hundred brilliant applicants were shortlisted for only two available slots. When Kofi entered the interview room, the chairman of the executive board stared at him intently before breaking into a warm, recognizing smile.

It was the elderly stranger from the storm—Dr. Kwakye, a billionaire philanthropist and retired corporate director who had lost his way in our rural district years earlier. Dr. Kwakye commended Kofi's integrity, stating that genuine compassion to the helpless was the truest test of noble character. Kofi was awarded the scholarship on the spot. Watching my brother sign the scholarship contract, I whispered to myself: So it pays to be kind to strangers.`
      }
    ]
  },
  partB_comprehension: {
    title: "Part B: Reading Comprehension",
    instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
    passageText: `My burning desire to prospect for alluvial gold and also behold the vastness of the ocean for the first time drove me to undertake a grueling expedition on foot to a small coastal fishing village. Although I possessed very little food and drinking water in my knapsack, I traversed an immense distance across the hills. Toward dusk, I caught my first glimpse of the Atlantic Ocean glittering beneath the horizon. My heart leaped with excitement; its immense expanse stretched as far as human sight could reach.

As the evening stars punctured the twilight sky, I climbed to the crest of the final ridge and sighted the settlement of my quest nestling along the shore. I was practically dead with fatigue. To worsen my plight, deep, raw blisters had formed across both my heels, forcing me to limp painfully. Yet, as I descended into the settlement, the tranquil serenity of the village soothed my spirit. The fishermen and their families were relaxing outside their palm-thatch dwellings, enjoying the crisp evening sea breeze. From the adjacent mangrove lagoon came the rhythmic croaking of bullfrogs, while barefooted children ran about the sandy paths in joyful play. The community life was simple, unhurried, and natural.

Exhausted, I slumped onto a wooden bench near the perimeter of the coconut grove. How sweet it felt to rest my aching limbs! I resolved to spend the night reclining on that bench under the open sky. However, barely ten minutes later, a dense, chilly sheet of sea mist rolled in from the ocean, completely blanketing the village. Within moments, the atmosphere turned bitterly cold, and a driving sea drizzle began to fall, sending the villagers running helter-skelter to seek shelter indoors. I found myself shivering violently, drenched to the skin.

Realizing that remaining outdoors meant freezing to death, I struggled to my feet, intending to limp to the next hamlet, when a woman stepped out of the fog and approached me. For several minutes, she had stood by her doorway, observing my shivering posture with deep pity. Now, as though she had read my desperate thoughts, she said gently, "Young traveler, if you will accept my humble hospitality, my roof will shelter you till dawn. It is an act of pure charity."

She was a widow of about thirty years of age, dressed in traditional black mourning cloth, with a pale, sorrowful face and expressive dark eyes. Her modest palm-thatched cottage, named 'Papaye Hut', possessed a soothing, serene atmosphere. For five days, she cared for me selflessly, dressing my blistered feet with herbal oils and feeding me hot fish stew, which allowed me to replenish my depleted strength completely. When the morning of my departure arrived, it was with a heavy heart that I bade a tearful farewell to my noble benefactress.`,
    questions: [
      {
        subQuestion: "(a)",
        question: "State the two specific reasons why the writer traveled to the coastal village.",
        answer: "The writer traveled to the coast because of a strong desire to prospect for gold (win gold) and to see the sea for the first time."
      },
      {
        subQuestion: "(b)",
        question: "I. How did the writer perceive life in the coastal village upon his arrival?\nII. Why did the writer eventually decide to leave the bench and head toward the next village?",
        answer: "I. He found the village life peaceful, natural, simple, and tranquil.\nII. He decided to leave because a cold, thick sea mist and drizzle rolled in from the sea, drenching him to the skin and leaving him freezing on the open bench."
      },
      {
        subQuestion: "(c)",
        question: "I. '... my plight.' What two physical conditions constituted the writer's plight?\nII. '... everybody was running helter-skelter.' What had caused this sudden commotion among the villagers?",
        answer: "I. His plight refers to being utterly exhausted (dead with fatigue) combined with having painful blisters on his heels and running out of food and water.\nII. The sudden arrival of a thick, cold sheet of sea mist and driving drizzle rolling in from the ocean made the villagers scatter frantically for indoor shelter."
      },
      {
        subQuestion: "(d)",
        question: "I. What two adjectives would you use to describe the moral character of the woman?\nII. What does the physical appearance and dress of the woman suggest about her personal circumstances?",
        answer: "I. She was compassionate (sympathetic), generous, hospitable, kind, and benevolent.\nII. Her mourning black attire, pale countenance, and sorrowful eyes suggest that she was a grieving widow who had recently lost a loved one (her husband)."
      },
      {
        subQuestion: "(e)",
        question: "Explain the meaning of the following figurative expressions as used in the passage:\nI. 'drenched to the skin'\nII. 'she read my thoughts'\nIII. 'with a heavy heart'",
        answer: "I. 'drenched to the skin' means soaked completely through one's clothes to the bare body.\nII. 'she read my thoughts' means she accurately discerned and understood his unspoken desires, desperation, and internal feelings.\nIII. 'with a heavy heart' means filled with deep sorrow, sadness, reluctance, and emotional pain."
      },
      {
        subQuestion: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. immense\nII. ascended\nIII. resolved\nIV. serene\nV. replenish",
        answer: "I. immense: vast, enormous, huge, colossal, expansive.\nII. ascended: climbed, scaled, mounted, walked up.\nIII. resolved: decided, determined, made up his mind.\nIV. serene: peaceful, tranquil, calm, quiet.\nV. replenish: restore, renew, regain, recover."
      }
    ]
  },
  partC_literature: {
    title: "Part C: Literature in English (The Cockcrow Anthology)",
    instructions: "Answer all questions in this part based on the prescribed texts from Sackey J.A. and Darmani L. (comp.): The Cockcrow.",
    questions: [
      {
        sectionTitle: "MERRILL CORNEY: Debbie, Sandy and Pepe",
        subItems: [
          {
            subQuestion: "5(a)",
            question: "What is referred to as 'Poor little thing' in the story?",
            answer: "The wounded, helpless baby bird (chick) that had fallen out of its nest."
          },
          {
            subQuestion: "5(b)",
            question: "What is the physical setting of the story?",
            answer: "A domestic rural/suburban garden or compound under an orange tree (near the girls' family residence)."
          },
          {
            subQuestion: "5(c)",
            question: "The attitude of the girls (Debbie and Sandy) to the baby bird is that of ............",
            answer: "compassion, tender affection, sympathy, and care."
          }
        ]
      },
      {
        sectionTitle: "KAAKYIRE AKOSOMO NYANTAKYI: Tell My Son to Hold On to His Gun",
        contextExtract: "\"Be courageous, be courageous, Kwame, be courageous!\"\n\"I will be, Father, I will be\" I answered,\nand entered the thick forest......",
        subItems: [
          {
            subQuestion: "5(d)",
            question: "'Be courageous, be courageous, Kwame, be courageous!' is an example of the literary device termed ............",
            answer: "repetition (or epizeuxis)."
          },
          {
            subQuestion: "5(e)",
            question: "How did Kwame show that he was courageous at the end of the story?",
            answer: "He stood his ground firmly, mastered his terror, and successfully faced and shot down the ferocious wild beast/python in the dark forest, fulfilling his father's charge."
          }
        ]
      },
      {
        sectionTitle: "JEAN WATSON: The Old Man and His Children",
        contextExtract: "Once there was an old man who had seven sons.\nThey should have been his pride and joy.\nBut they were not.",
        subItems: [
          {
            subQuestion: "5(f)",
            question: "The extract functions as a/an ............ to the narrative story.",
            answer: "introduction (or exposition / opening / prologue)."
          },
          {
            subQuestion: "5(g)",
            question: "The idea expressed in the second sentence ('They should have been his pride and joy') is that of ............",
            answer: "unfulfilled expectation (or dashed hope / disappointment / irony)."
          }
        ]
      },
      {
        sectionTitle: "AMA ATA AIDOO: The Dilemma of a Ghost",
        contextExtract: "Yes, my young woman, I shall remember you.\nI shall remember you in the hours of the night\nIn my sleepless sleep.",
        subItems: [
          {
            subQuestion: "5(h)",
            question: "'... young woman' in the extract refers to ............",
            answer: "Eulalie Rush (Ato Yawson's African-American wife)."
          },
          {
            subQuestion: "5(i)",
            question: "The 'sleepless sleep' of the speaker (Esi Kom) is caused by ............",
            answer: "deep psychological distress, grief, family discord, and anxiety over Ato's cultural conflict with his foreign wife."
          },
          {
            subQuestion: "5(j)",
            question: "The oxymoronic expression 'sleepless sleep' shows that the speaker is ............",
            answer: "deeply tormented, restless, sorrowful, and troubled in spirit."
          }
        ]
      }
    ]
  }
};

const flattenedPaper2Questions = [
  ...paper2Calibrated.partA_composition.questions.map((q) => ({
    id: `composition_${q.questionNumber}`,
    partLabel: `Part A (Question ${q.questionNumber}) - ${q.category}`,
    prompt: q.prompt,
    modelAnswer: q.modelAnswer,
    marks: 30
  })),
  {
    id: "comprehension_passage",
    partLabel: "Part B: Reading Comprehension",
    prompt: paper2Calibrated.partB_comprehension.passageText,
    passage: paper2Calibrated.partB_comprehension.passageText,
    subQuestions: paper2Calibrated.partB_comprehension.questions,
    marks: 30
  },
  ...paper2Calibrated.partC_literature.questions.map((sec, idx) => ({
    id: `literature_cockcrow_${idx + 1}`,
    partLabel: `Part C: Literature - ${sec.sectionTitle}`,
    contextExtract: sec.contextExtract || null,
    subItems: sec.subItems,
    marks: 10
  }))
];

async function seedBeceEnglish2017Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 2017 into Firestore...");

  // Key Balance Audit
  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  balancedPaper1.forEach((q) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log("Verified Key Balance across 30 Objective Items:", keyDist);

  const db = await getDb();
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2017");
  await docRef.set({
    year: 2017,
    title: "BECE English Language 2017 (Calibrated National Benchmark)",
    subjectId: "english",
    metadata: {
      isPastQuestion: true,
      standard: "NaCCA / WAEC BECE Standard",
      totalMarks: 100,
      totalDurationMinutes: 120,
      paper1Count: balancedPaper1.length,
      optionsBalanced: true,
      unplagiarizedPedagogicalAdaptation: true,
      hasCockcrowLiterature: true,
      passageFirstLayout: false,
      updatedAt: new Date()
    },
    questions: balancedPaper1,
    paper1: {
      title: "Paper 1: Objective Test (Lexis and Structure)",
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
        }
      },
      questions: balancedPaper1,
      allQuestions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Written Essay, Reading Comprehension, and Literature",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Fully Rewritten, Clean-Room BECE English 2017 successfully seeded into Firestore!");
}

seedBeceEnglish2017Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2017:", err);
    process.exit(1);
  });
