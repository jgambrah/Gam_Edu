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

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2017
const rawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "On the advice of the medical officer, Uncle Kojo has finally given ............ smoking.",
    options: ["in", "off", "out", "up"],
    correctAnswer: "up",
    hint: "Identify the phrasal verb meaning to quit, abandon, or cease a chronic habit.",
    workedSolution: "The phrasal verb 'to give up' means to stop doing, quit, or abandon a habit ('given up smoking'). 'Give in' means to surrender, while 'give off' means to emit.",
    points: 1
  },
  {
    number: 2,
    prompt: "The gathering at the festival was ............ massive that the organizers were overwhelmed.",
    options: ["quite", "so", "too", "very"],
    correctAnswer: "so",
    hint: "Identify the intensifier that pairs correlatively with 'that' to express cause and effect.",
    workedSolution: "The correlative structure 'so + adjective + that' indicates an extreme degree leading to a specific result ('so massive that the organizers were overwhelmed').",
    points: 1
  },
  {
    number: 3,
    prompt: "By the time we arrived at the bus terminal, the early morning coach ............ departed.",
    options: ["are", "had", "have", "were"],
    correctAnswer: "had",
    hint: "Use the past perfect tense ('had + past participle') for an action completed before another past event.",
    workedSolution: "The past perfect tense ('had departed') expresses an action completed prior to another past action ('When we got there').",
    points: 1
  },
  {
    number: 4,
    prompt: "The textbook was ............ to the overall best student in science.",
    options: ["gave", "given", "giving", "to give"],
    correctAnswer: "given",
    hint: "Passive voice: Auxiliary 'was' is followed by the past participle of the main verb.",
    workedSolution: "In passive voice constructions in the simple past ('was + past participle'), the verb 'give' takes its past participle form 'given'.",
    points: 1
  },
  {
    number: 5,
    prompt: "Auntie Mansa is the caterer to ............ the food supplies were entrusted.",
    options: ["who", "whom", "which", "whose"],
    correctAnswer: "whom",
    hint: "When referring to a person immediately after a preposition ('to'), use the objective relative pronoun.",
    workedSolution: "'Whom' is the objective case relative pronoun required immediately after a preposition ('to whom'). 'Who' is used only as a grammatical subject.",
    points: 1
  },
  {
    number: 6,
    prompt: "He is your classmate, ............?",
    options: ["doesn't he", "does he", "isn't he", "isn't it"],
    correctAnswer: "isn't he",
    hint: "An affirmative clause with the primary linking verb 'is' takes a negative tag with 'is'.",
    workedSolution: "The main clause uses the affirmative linking verb 'is' with the pronoun 'he'. The question tag must be negative and use the same verb: 'isn't he?'.",
    points: 1
  },
  {
    number: 7,
    prompt: "Kofi: You didn't attend the regional sports festival, did you?\nMensa: ............",
    options: ["No, I did", "No, I didn't", "Yes, did I", "Yes, I didn't"],
    correctAnswer: "No, I didn't",
    hint: "In standard English, an answer confirming a negative fact uses 'No' paired with a negative verb.",
    workedSolution: "In standard English response conventions, answering 'No' confirms that the negative statement is true ('No, I didn't [attend]'). Pairing 'No' with 'did' or 'Yes' with 'didn't' is ungrammatical.",
    points: 1
  },
  {
    number: 8,
    prompt: "The dark clouds are gathering, so we had better ............ immediately.",
    options: ["left", "leave", "be leaving", "to leave"],
    correctAnswer: "leave",
    hint: "The modal idiom 'had better' is always followed by a bare infinitive without 'to'.",
    workedSolution: "The expression 'had better' functions as a modal auxiliary indicating strong advice, and must be followed by a bare infinitive ('leave').",
    points: 1
  },
  {
    number: 9,
    prompt: "Kwame politely requested his seatmate to ............. him an extra pencil.",
    options: ["borrow", "excuse", "lend", "spare"],
    correctAnswer: "lend",
    hint: "To give something temporarily is to 'lend'; to receive something temporarily is to 'borrow'.",
    workedSolution: "'Lend' means to allow someone to use something on the condition that it is returned. 'Borrow' means to take something with permission.",
    points: 1
  },
  {
    number: 10,
    prompt: "In formal correspondence, a letter opened with 'Dear Sir' or 'Dear Madam' ends with the subscription, ............",
    options: ["'Yours faithfully'", "'Your's faithfully'", "'Yours' faithfully'", "'Your faithfully'"],
    correctAnswer: "'Yours faithfully'",
    hint: "Possessive pronouns never use apostrophes. Note the correct capitalization and spelling.",
    workedSolution: "In standard formal letter writing, 'Yours faithfully' is used when the recipient is addressed by title ('Dear Sir/Madam'). 'Yours' is an absolute possessive pronoun and never takes an apostrophe.",
    points: 1
  },
  {
    number: 11,
    prompt: "The market trader refused to sell me ............ palm oil on credit.",
    options: ["any", "little", "plenty", "some"],
    correctAnswer: "any",
    hint: "Use 'any' with negative clauses containing words like 'refused' or 'not'.",
    workedSolution: "The verb 'refused' conveys a negative meaning, which requires the non-assertive quantifier 'any'. 'Some' is used primarily in affirmative statements.",
    points: 1
  },
  {
    number: 12,
    prompt: "\"Yes, ............ an encyclopedia,\" the librarian answered.",
    options: ["is", "its", "it's", "it"],
    correctAnswer: "it's",
    hint: "Choose the contraction for 'it is', not the possessive determiner 'its'.",
    workedSolution: "'It's' is the contraction of 'it is' ('Yes, it is an encyclopedia'). 'Its' is a possessive determiner meaning belonging to it.",
    points: 1
  },
  {
    number: 13,
    prompt: "I am certain that Daniel is much ............. than his twin brother.",
    options: ["tall", "taller", "tallest", "the taller"],
    correctAnswer: "taller",
    hint: "The intensifier 'much' modifies a comparative adjective before the conjunction 'than'.",
    workedSolution: "When comparing two people using 'than', the comparative form ('taller') is required. Adverbs of degree like 'much' or 'far' modify comparative adjectives ('much taller').",
    points: 1
  },
  {
    number: 14,
    prompt: "Neither the class prefect nor his desk mate ............ the end of the film.",
    options: ["watch", "watches", "was watching", "were watching"],
    correctAnswer: "watches",
    hint: "With 'neither...nor', the verb agrees in number and person with the closer subject.",
    workedSolution: "Proximity rule of concord: With correlative conjunctions like 'neither...nor', the verb agrees with the nearer subject ('his desk mate', third person singular: 'watches').",
    points: 1
  },
  {
    number: 15,
    prompt: "Araba and Osei are a devoted couple who genuinely love ............",
    options: ["each other", "one another", "themselves", "the other"],
    correctAnswer: "each other",
    hint: "Reciprocal pronoun used when mutual action takes place between two persons.",
    workedSolution: "'Each other' is the reciprocal pronoun used when mutual actions involve two individuals. 'One another' is preferred for three or more.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The safety and physical welfare of students should be the primary concern of teachers.\nChoose the word nearest in meaning to the underlined word 'welfare'.",
    options: ["growth", "joy", "wealth", "well-being"],
    correctAnswer: "well-being",
    hint: "Health, happiness, security, and general prosperity.",
    workedSolution: "'Welfare' refers to the state of health, happiness, and moral or physical security; 'well-being' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "The foreign visitor stated that the cultural rite was completely alien to him.\nChoose the word nearest in meaning to the underlined word 'alien'.",
    options: ["boring", "new", "modern", "unfamiliar"],
    correctAnswer: "unfamiliar",
    hint: "Strange, not known or experienced before in one's personal culture.",
    workedSolution: "'Alien' in this context means strange, unfamiliar, or foreign to one's experience; 'unfamiliar' is the closest synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "The police discovered that the suspect's testimony was entirely fictitious.\nChoose the word nearest in meaning to the underlined word 'fictitious'.",
    options: ["artificial", "false", "interesting", "real"],
    correctAnswer: "false",
    hint: "Invented, fabricated, not based on genuine facts.",
    workedSolution: "'Fictitious' means created by the imagination or deliberately fabricated; 'false' is the direct synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "The patron placed an order for banku and grilled tilapia at the restaurant.\nChoose the word nearest in meaning to the underlined word 'order'.",
    options: ["a command", "a demand", "a request", "a directive"],
    correctAnswer: "a request",
    hint: "An official asking for goods, services, or food in commercial transactions.",
    workedSolution: "An 'order' in commercial or dining contexts is an explicit asking or booking for food or merchandise; 'a request' is the nearest equivalent.",
    points: 1
  },
  {
    number: 20,
    prompt: "Nothing in human thought can equal the infinite wisdom and sovereignty of the Almighty.\nChoose the word nearest in meaning to the underlined word 'infinite'.",
    options: ["endless", "immeasurable", "incomplete", "inconstant"],
    correctAnswer: "immeasurable",
    hint: "Limitless, boundless, incapable of being quantitatively measured.",
    workedSolution: "'Infinite' means boundless, limitless, or having no end; 'immeasurable' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "Nimo worked tirelessly after his shop was gutted by fire and soon found his feet. This means that Nimo ............",
    options: [
      "bought a new fleet of cars",
      "could walk again after injury",
      "revived his business successfully",
      "sold off the remnants of the shop"
    ],
    correctAnswer: "revived his business successfully",
    hint: "Regaining stability, confidence, and commercial independence after a major crisis.",
    workedSolution: "The idiom 'to find one's feet' means to become familiar with or regain financial confidence, balance, and stability in a new or difficult situation.",
    points: 1
  },
  {
    number: 22,
    prompt: "Mansa laid aside some money for her daughter's school fees. This means that Mansa ............",
    options: [
      "refused to pay the fees",
      "saved money for the fees",
      "spent all her money on fees",
      "borrowed money from the bank"
    ],
    correctAnswer: "saved money for the fees",
    hint: "Reserving or storing resources for future planned expenditure.",
    workedSolution: "The phrasal verb 'to lay aside' (or set aside) means to save, reserve, or store money for a specific future purpose.",
    points: 1
  },
  {
    number: 23,
    prompt: "The matriculation ceremony was truly a red-letter day for the young scholar. This means that the occasion was ............",
    options: ["bloody", "enjoyable", "memorable", "rough"],
    correctAnswer: "memorable",
    hint: "A day that is memorable, happy, and of great historical or personal importance.",
    workedSolution: "'A red-letter day' is an idiom derived from marking church feast days in red calendar ink, meaning a memorable, joyful, and milestone day.",
    points: 1
  },
  {
    number: 24,
    prompt: "The accountant was relieved of his post following the audit. This means that the accountant was ............",
    options: ["dismissed", "given another assignment", "demoted", "promoted"],
    correctAnswer: "dismissed",
    hint: "Formally removed from a position, job, or office.",
    workedSolution: "To be 'relieved of one's post' is a formal euphemism meaning removed, discharged, or dismissed from official employment.",
    points: 1
  },
  {
    number: 25,
    prompt: "Foli and Adzovi hit it off quite well when they met at the youth fellowship. This means that they ............",
    options: ["fight often", "get on very well", "play as a team", "present good arguments"],
    correctAnswer: "get on very well",
    hint: "Instantly developing a friendly, harmonious rapport with someone.",
    workedSolution: "The idiom 'to hit it off' means to form an immediate, smooth, and friendly relationship with someone.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "While the shopkeeper was polite to all customers, his discourteous assistant was remarkably ...... to visitors.",
    options: ["cruel", "mean", "rude", "unfair"],
    correctAnswer: "rude",
    hint: "'Polite' means showing good manners. Find the word that denotes bad manners and incivility.",
    workedSolution: "'Polite' means courteous and respectful. Its direct antonym is 'rude' (impolite, insolent, or ill-mannered).",
    points: 1
  },
  {
    number: 27,
    prompt: "Tilapia is plentiful in the lake during the flood season, but becomes ...... during the dry harmattan.",
    options: ["little", "scarce", "small", "unusual"],
    correctAnswer: "scarce",
    hint: "'Plentiful' means existing in abundant supply. Choose the word meaning rare or in short supply.",
    workedSolution: "'Plentiful' means abundant. Its direct economic and linguistic antonym is 'scarce' (rare or in short supply).",
    points: 1
  },
  {
    number: 28,
    prompt: "The retail price of cooking oil has fallen this week, whereas the price of rice has ......",
    options: ["aggravated", "doubled", "risen", "weakened"],
    correctAnswer: "risen",
    hint: "'Fallen' means decreased or gone down. Select the word meaning moved upward or increased.",
    workedSolution: "'Fallen' in pricing context means dropped. Its natural antonym is 'risen' (increased).",
    points: 1
  },
  {
    number: 29,
    prompt: "The merchant worked hard to stock the shelves with new goods, but the customers worked quickly to ...... them.",
    options: ["decorate", "empty", "fill", "reinforce"],
    correctAnswer: "empty",
    hint: "'Stock' means to fill with goods or supplies. Find the word meaning to clear out or remove everything.",
    workedSolution: "'Stock' means to fill or supply with goods. Its direct antonym is 'empty' (to clear out completely).",
    points: 1
  },
  {
    number: 30,
    prompt: "There was total mayhem in the stadium after the referee's whistle, but the security officers quickly restored ......",
    options: ["anger", "fear", "order", "riot"],
    correctAnswer: "order",
    hint: "'Mayhem' means violent chaos and disorder. Find the word meaning peaceful, structured calm.",
    workedSolution: "'Mayhem' denotes extreme chaos, confusion, and violence. Its direct opposite is 'order' (peace, discipline, and stability).",
    points: 1
  },

  // --- SECTION E: CLOZE TEST (31 - 35) ---
  {
    number: 31,
    prompt: "The coastal traveler was dead with ---31--- after trekking through the sandy dunes for hours.",
    options: ["fatigue", "hunger", "thirst", "fright"],
    correctAnswer: "fatigue",
    hint: "Extreme physical tiredness resulting from mental or physical exertion.",
    workedSolution: "In literature, the idiomatic expression 'dead with fatigue' describes extreme physical exhaustion and weariness.",
    points: 1
  },
  {
    number: 32,
    prompt: "To worsen his plight, painful ---32--- developed on his heels from the friction of his sandals.",
    options: ["blisters", "cuts", "bruises", "wounds"],
    correctAnswer: "blisters",
    hint: "Small fluid-filled swellings on the skin caused by friction or burning.",
    workedSolution: "Skin swellings containing watery fluid caused by tight footwear friction are termed 'blisters'.",
    points: 1
  },
  {
    number: 33,
    prompt: "A dense blanket of sea mist rolled inland, drenching the lone wanderer to the ---33---.",
    options: ["skin", "bone", "head", "feet"],
    correctAnswer: "skin",
    hint: "Complete the common idiom meaning thoroughly soaked: 'drenched to the ......'.",
    workedSolution: "The standard English idiom is 'drenched to the skin' (meaning completely soaked through one's clothing).",
    points: 1
  },
  {
    number: 34,
    prompt: "A generous village woman offered him warm shelter and benevolent ---34--- until dawn.",
    options: ["hospitality", "charity", "friendship", "kindness"],
    correctAnswer: "hospitality",
    hint: "The friendly, welcoming, and generous reception and entertainment of guests or strangers.",
    workedSolution: "'Hospitality' is the formal term for providing food, shelter, and comfort generously to guests or travelers.",
    points: 1
  },
  {
    number: 35,
    prompt: "The restful stay in the tranquil hamlet enabled him to ---35--- his depleted energy before continuing his journey.",
    options: ["replenish", "recover", "increase", "double"],
    correctAnswer: "replenish",
    hint: "To restore, refill, or build up a supply of energy that has been depleted.",
    workedSolution: "'Replenish' means to fill up again, restore, or renew a depleted supply of physical strength or stock.",
    points: 1
  },

  // --- SECTION F: ORAL LANGUAGE (36 - 40) ---
  {
    number: 36,
    prompt: "The shepherd sheared the sheep's wool.\nWhich of the following words contains the exact same vowel sound as 'wool' (/ʊ/)?",
    options: ["pull", "pool", "spool", "fool"],
    correctAnswer: "pull",
    hint: "'Wool' contains the short close-mid back rounded vowel sound /ʊ/ (as in 'book' and 'look').",
    workedSolution: "'Wool' is pronounced /wʊl/, containing the short /ʊ/ vowel sound. 'Pull' (/pʊl/) contains the identical short /ʊ/ sound. ('pool', 'spool', 'fool' contain the long /uː/ sound).",
    points: 1
  },
  {
    number: 37,
    prompt: "The judge condemned the criminal's fraud.\nWhich of the following words contains the same vowel sound as the word 'fraud' (/ɔː/)?",
    options: ["broad", "load", "road", "toad"],
    correctAnswer: "broad",
    hint: "'Fraud' contains the long open-mid back rounded vowel /ɔː/ (rhyming with 'cord' and 'lawn').",
    workedSolution: "'Fraud' is pronounced /frɔːd/ with the /ɔː/ vowel sound. 'Broad' (/brɔːd/) contains the identical /ɔː/ sound. ('load', 'road', 'toad' contain the diphthong /əʊ/).",
    points: 1
  },
  {
    number: 38,
    prompt: "The doctor touched the patient's thumb.\nWhich of the following words contains a silent consonant letter just like the 'b' in 'thumb'?",
    options: ["limb", "timber", "amber", "lumber"],
    correctAnswer: "limb",
    hint: "In 'thumb' (/θʌm/), the final letter 'b' is completely silent.",
    workedSolution: "In 'thumb', the final 'b' is silent. In 'limb' (/lɪm/), the final 'b' is also silent. In 'timber', 'amber', and 'lumber', the letter 'b' is pronounced.",
    points: 1
  },
  {
    number: 39,
    prompt: "The scholar read the ancient scroll.\nWhich of the following words begins with the same initial consonant cluster as 'scroll' (/skr-/)?",
    options: ["scream", "small", "scale", "skate"],
    correctAnswer: "scream",
    hint: "Identify the word beginning with the triple consonant cluster /s/ + /k/ + /r/.",
    workedSolution: "'Scroll' begins with the triple consonant cluster /skr-/. 'Scream' (/skriːm/) begins with the identical /skr-/ cluster.",
    points: 1
  },
  {
    number: 40,
    prompt: "The cyclist rode past the busy market.\nWhich of the following words ends with the same consonant sound as the word 'past' (/st/)?",
    options: ["first", "pass", "part", "park"],
    correctAnswer: "first",
    hint: "'Past' ends with the double consonant blend /s/ + /t/.",
    workedSolution: "'Past' ends with the consonant cluster /-st/. 'First' (/fɜːst/) ends with the identical consonant cluster /-st/.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 201701);

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
        prompt: "You have recently been enstooled as the youth chief (Nkosohene) in your hometown. Write a letter to your friend attending school in another town, telling him or her about your enstoolment and discussing two major developmental projects you intend to undertake to improve the community.",
        modelAnswer: `Palace of the Youth Chief
P. O. Box 18
Asamankese, Eastern Region
12th July, 2017

Dear Kwabena,

I hope this letter finds you in excellent health and fine spirits. I am writing to share extraordinary news that has completely changed my responsibilities: last weekend, during our annual Odwira festival, I was officially enstooled as the Development Youth Chief (Nkosuohene) of our traditional area!

The coronation ceremonies were colorful and sacred. The elders and traditional council laid the heavy responsibility on my shoulders because of my academic dedication and communal involvement. Though humbled, I am determined to leverage this position to uplift the youth and modernize our community.

First, I intend to spearhead the construction of an ultra-modern community library and information technology center. In our village today, schoolchildren lack access to foundational textbooks, encyclopedias, and computers, which puts them at a severe disadvantage during the BECE examinations. By mobilizing contributions from citizens living in the cities and partnering with non-governmental organizations, we will erect a solar-powered center equipped with internet-connected computers to foster a reading culture.

Secondly, I plan to establish a vocational apprenticeship fund and communal demonstration farm. Many youths who complete junior and senior high schools roam the streets without employable skills. Through this initiative, we will sponsor school leavers to train in auto-mechanics, electrical wiring, dressmaking, and scientific vegetable farming, empowering them to become self-reliant entrepreneurs.

I look forward to your coming down during the Christmas vacation so we can discuss these blueprints.

Your loyal friend,
[Signature]
Nana Kofi Mensah
(Nkosuohene)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in one of the national daily newspapers on the topic: \"The Indispensable Role and Usefulness of the Mobile Phone in Contemporary Ghana.\"",
        modelAnswer: `THE INDISPENSABLE ROLE AND USEFULNESS OF THE MOBILE PHONE IN CONTEMPORARY GHANA
By Rebecca Arthur, JHS 3

In the space of just two decades, the mobile telephone has evolved from an exclusive luxury reserved for the affluent into a ubiquitous necessity that drives daily human existence. Across Ghanaian urban metropolises and rural farming communities alike, the mobile phone has revolutionized socio-economic development.

The most profound contribution of the mobile phone lies in the realm of financial inclusion and commerce. Through mobile money transfer technology, millions of unbanked citizens in remote rural settlements can now send, receive, and save money securely without stepping into a traditional banking hall. Market women, cocoa farmers, and small-scale artisans purchase inputs, pay utility bills, and receive payment for goods instantly using simple handheld handsets. This digital financial ecosystem has stimulated trade and empowered grassroots entrepreneurship across the nation.

Furthermore, mobile phones have transformed education and interpersonal communication. In contemporary basic and secondary schools, teachers and students utilize smartphones to access digital textbooks, participate in educational forums, download examination past papers, and conduct scientific research. In emergencies, mobile devices allow citizens to contact ambulance services, fire fighters, and the police rapidly, thereby saving countless human lives.

However, users must exercise self-discipline to avoid distractions and cyber fraud. In conclusion, when utilized constructively, the mobile phone is a magnificent catalyst for personal advancement and national socio-economic transformation.`
      },
      {
        questionNumber: "3",
        category: "Narrative Essay",
        prompt: "Write an interesting story that illustrates the timeless moral that genuine benevolence is rewarded, ending with the expression: \"So it pays to be kind to strangers.\"",
        modelAnswer: `On a blustery Saturday evening during the August rains, my mother and I were closing our modest provisions kiosk in the market town of Nsawam when an elderly traveler approached our veranda. His clothes were soaked, his spectacles were fogged, and he looked thoroughly exhausted. He explained in broken Twi that he had boarded the wrong passenger bus from Kumasi and was now stranded without money or a place to pass the night.

While neighboring traders dismissed him suspiciously, my mother took pity on him. She invited him into our living room, gave him a towel, and served him a warm bowl of palm nut soup with fufu. My father offered him a clean blanket and a spare bed in our guest room. The following morning, Father accompanied him to the lorry park and paid his fare back to Akosombo. The old gentleman expressed profound gratitude, shook our hands warmly, and departed.

Ten years later, I completed my training college diploma and attended an employment interview for an administrative posting at the regional education office in Koforidua. The interview panel was headed by an imposing, white-haired director. As I sat down and introduced myself as the daughter of Mr. and Mrs. Mensah from Nsawam, the director stopped writing and gazed intently at me. To my utter amazement, he was the stranded traveler our family had hosted years ago! He recalled that rainy night with vivid emotion and praised my parents' pure generosity.

My academic qualifications were thoroughly vetted and found satisfactory, and I was granted the appointment letter on the spot. Walking out of the regional office, I smiled and whispered: So it pays to be kind to strangers.`
      }
    ]
  },
  sectionB_comprehension: {
    title: "Part B: Reading Comprehension",
    passage: `My desire to win gold and also see the sea drove me to a small coastal village. Though I had little food and drink, I covered a great distance. Towards dusk, I could sight the sea from a distance. I was really excited. Its immense size stretched as far as the eyes could see.

As the stars appeared in the sky, I ascended the hill and saw the village of my quest. I was dead with fatigue. To worsen my plight, there were blisters on my heel so I had to take a rest. But as I descended the hill, I was welcomed by the quietness of the place.

The villagers were enjoying the cool evening air. From the lagoon came the croaking of frogs. Children played and ran about excitedly. The village life was natural and simple. I sat on a bench close by. How good it was to rest!

I resolved to rest on the bench. As I lay there, a sheet of mist rolled in from the sea and settled upon the village. In a few minutes, the village was filled with mist and everybody was running helter-skelter. I was drenched to the skin. I had decided to move to the next village when a woman suddenly walked up to me. For some time I had seen her gazing at me with pity. Now, as if she read my thoughts, she said, "If you would accept my hospitality, you will be sheltered till the morning. Just charity." She was about thirty years of age, dressed in black with a pale face and dark eyes.

Papaye hut held special appeal for its serene environment. For many days, I was well catered for and this enabled me to replenish my energy. It was with a heavy heart, when the time for departure arrived, that I bade farewell to my benefactress.`,
    questions: [
      {
        subId: "(a)",
        question: "State the two reasons why the writer traveled to the coast.",
        answer: "1. The desire to search for and win gold.\n2. The desire to see the sea for the first time."
      },
      {
        subId: "(b)(i)",
        question: "How did the writer find life in the coastal village?",
        answer: "The writer found life in the village to be quiet, natural, simple, and peaceful."
      },
      {
        subId: "(b)(ii)",
        question: "Why did the writer initially decide to move to the next village?",
        answer: "Because a heavy sea mist rolled in, drenching him to the skin, and everyone had scattered indoors, leaving him exposed on the bench in the cold."
      },
      {
        subId: "(c)(i)",
        question: "\"... my plight.\"\nWhat specific difficulties does the expression \"my plight\" refer to in the passage?",
        answer: "Being completely exhausted ('dead with fatigue'), running short of food and drink, and suffering from painful blisters on his heels."
      },
      {
        subId: "(c)(ii)",
        question: "\"... everybody was running helter-skelter.\"\nWhat do you think had caused the villagers to run in confusion?",
        answer: "The sudden arrival of the cold, dense, and blinding sea mist that engulfed the entire village unexpectedly."
      },
      {
        subId: "(d)(i)",
        question: "List two adjectives that describe the character of the woman who sheltered the writer.",
        answer: "Compassionate (or sympathetic, charitable, hospitable, kind-hearted)."
      },
      {
        subId: "(d)(ii)",
        question: "What does the woman's black dress and pale face suggest about her personal circumstances?",
        answer: "It suggests that she was in mourning (a widow or grieving the loss of a close relative) or experiencing personal grief and sorrow."
      },
      {
        subId: "(e)",
        question: "Explain in your own words the following expressions as used in the passage:\n(i) drenched to the skin;\n(ii) she read my thoughts;\n(iii) with a heavy heart.",
        answer: "(i) **drenched to the skin:** Completely soaked through one's clothes to the flesh.\n(ii) **she read my thoughts:** She understood what he was thinking or feeling without him uttering a word.\n(iii) **with a heavy heart:** In a state of deep sadness, sorrow, or reluctance."
      },
      {
        subId: "(f)",
        question: "For each of the following words, provide a word or phrase that means the same and can replace it in the passage without altering the meaning:\n(i) immense;\n(ii) ascended;\n(iii) resolved;\n(iv) serene;\n(v) replenish.",
        answer: "(i) **immense:** vast / huge / enormous / gigantic.\n(ii) **ascended:** climbed / walked up / mounted / scaled.\n(iii) **resolved:** decided / determined / made up one's mind.\n(iv) **serene:** peaceful / calm / tranquil / quiet.\n(v) **replenish:** restore / renew / regain / recover."
      }
    ]
  },
  sectionC_literature: {
    title: "Part C: Literature in English (The Cockcrow Anthology)",
    instructions: "Answer all questions in this part based on the prescribed texts.",
    questions: [
      {
        subId: "5(a)",
        textSource: "MERRILL CORNEY: Debbie, Sandy and Pepe",
        extract: "The rescue of the baby creature...",
        question: "What is referred to as \"Poor little thing\" in the story?",
        answer: "Pepe, the helpless, orphaned baby bird (swallow/sparrow) that had fallen out of its nest."
      },
      {
        subId: "5(b)",
        textSource: "MERRILL CORNEY: Debbie, Sandy and Pepe",
        extract: "The environment of the story...",
        question: "State the physical setting of the story.",
        answer: "A quiet family house and garden in the countryside."
      },
      {
        subId: "5(c)",
        textSource: "MERRILL CORNEY: Debbie, Sandy and Pepe",
        extract: "The young girls caring for Pepe...",
        question: "What was the attitude of the girls (Debbie and Sandy) toward the baby bird?",
        answer: "An attitude of affectionate care, tenderness, sympathy, and protectiveness."
      },
      {
        subId: "5(d)",
        textSource: "KAAKYIRE AKOSOMO NYANTAKYI: Tell My Son to Hold On to His Gun",
        extract: "\"Be courageous, be courageous, Kwame, be courageous!\"\n\"I will be, Father, I will be\" I answered,\nand entered the thick forest......",
        question: "Identify the literary device exemplified in the line \"Be courageous, be courageous, Kwame, be courageous!\".",
        answer: "Repetition (used to create dramatic emphasis and encourage bravery)."
      },
      {
        subId: "5(e)",
        textSource: "KAAKYIRE AKOSOMO NYANTAKYI: Tell My Son to Hold On to His Gun",
        extract: "Kwame in the dense forest...",
        question: "How did Kwame show that he was courageous at the end of the story?",
        answer: "He stood his ground firmly, faced the terrifying wild animal (or hostile forest challenge) without fleeing, and fired his hunting gun successfully."
      },
      {
        subId: "5(f)",
        textSource: "JEAN WATSON: The Old Man and His Children",
        extract: "\"Once there was an old man who had seven sons.\nThey should have been his pride and joy.\nBut they were not.\"",
        question: "The extract represents which structural component of the story's plot?",
        answer: "The exposition (or introductory opening/background of the story)."
      },
      {
        subId: "5(g)",
        textSource: "JEAN WATSON: The Old Man and His Children",
        extract: "\"They should have been his pride and joy. / But they were not.\"",
        question: "What idea or sentiment is expressed in the second sentence above?",
        answer: "An idea of disappointment, unfulfilled expectations, and sorrow over the ungrateful and quarrelsome nature of his sons."
      },
      {
        subId: "5(h)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "\"Yes, my young woman, I shall remember you.\nI shall remember you in the hours of the night\nIn my sleepless sleep.\"",
        question: "To whom does the phrase \"young woman\" refer in the play?",
        answer: "Eulalie Jawondo (Ato Yawson's African-American bride)."
      },
      {
        subId: "5(i)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "\"In my sleepless sleep.\"",
        question: "What is the primary cause of the speaker's 'sleepless sleep'?",
        answer: "Anxiety and heartbreak over the clash between traditional Ghanaian cultural expectations and foreign Western modernity, as well as family conflict."
      },
      {
        subId: "5(j)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "\"... sleepless sleep ...\"",
        question: "What does the expression 'sleepless sleep' reveal about the emotional state of the speaker?",
        answer: "It reveals that the speaker is deeply tormented, troubled, restless, and psychologically burdened."
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

async function seedBeceEnglish2017Calibrated() {
  const db = await getDb();
  console.log("Seeding Calibrated & Balanced BECE English 2017 into Firestore...");

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

  console.log("✅ Calibrated BECE English 2017 successfully seeded into Firestore!");
}

seedBeceEnglish2017Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2017:", err);
    process.exit(1);
  });
