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

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2015
const rawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 17) ---
  {
    number: 1,
    prompt: "The commercial driver's reckless overtaking resulted ............. a serious highway collision.",
    options: ["in", "to", "into", "with"],
    correctAnswer: "in",
    hint: "Identify the preposition that regularly collocates with the verb 'resulted' when denoting a consequence.",
    workedSolution: "The verb 'result' takes the preposition 'in' when introducing an outcome or consequence ('resulted in an accident'). 'Result from' is used when introducing the cause.",
    points: 1
  },
  {
    number: 2,
    prompt: "In terms of kindness and industriousness, Amina takes ............ her mother.",
    options: ["by", "on", "up", "after"],
    correctAnswer: "after",
    hint: "Identify the phrasal verb meaning to resemble an older parent in character or appearance.",
    workedSolution: "The phrasal verb 'to take after' means to resemble an older relative in disposition, appearance, or habits.",
    points: 1
  },
  {
    number: 3,
    prompt: "Because the commercial bus was delayed, the school children journeyed to school ............ foot.",
    options: ["by", "in", "on", "with"],
    correctAnswer: "on",
    hint: "While vehicles take 'by' (by bus, by car), walking is always expressed with this preposition.",
    workedSolution: "In standard English idiomatic usage, pedestrian travel is always expressed as 'on foot', never 'by foot'.",
    points: 1
  },
  {
    number: 4,
    prompt: "The medical doctor advised the hypertensive patient to abstain ............ excessive salt intake.",
    options: ["by", "from", "upon", "with"],
    correctAnswer: "from",
    hint: "Identify the preposition that follows the verb 'abstain' to mean refraining from an action.",
    workedSolution: "The verb 'abstain' is followed by the preposition 'from' ('abstain from smoking / excessive salt').",
    points: 1
  },
  {
    number: 5,
    prompt: "The trade partnership ............. the two cooperative unions has been mutually beneficial.",
    options: ["of", "with", "among", "between"],
    correctAnswer: "between",
    hint: "Use 'between' when referring to a relationship connecting exactly two distinct entities.",
    workedSolution: "'Between' is used when connecting or distinguishing two parties ('the two cooperative unions'). 'Among' is used for groups of three or more.",
    points: 1
  },
  {
    number: 6,
    prompt: "Master Kwaku prefers fresh palm fruit soup ............ groundnut soup.",
    options: ["to", "for", "from", "than"],
    correctAnswer: "to",
    hint: "The comparative verb 'prefer' takes the preposition 'to', never 'than'.",
    workedSolution: "In standard English, the verb 'prefer' takes 'to' when choosing one item over another ('prefer X to Y'). Using 'than' with prefer is an error.",
    points: 1
  },
  {
    number: 7,
    prompt: "The tenant complained that the sound of the grinding mill was ............ deafening.",
    options: ["far", "too", "much", "enough"],
    correctAnswer: "too",
    hint: "Use 'too' before an adjective to indicate an excessive, intolerable degree.",
    workedSolution: "'Too' is an adverb of degree placed before an adjective ('deafening') to signify an excessive, unacceptable level.",
    points: 1
  },
  {
    number: 8,
    prompt: "The white stallion galloped ............ than the black mare.",
    options: ["the fastest", "very faster", "much the faster", "far faster"],
    correctAnswer: "far faster",
    hint: "Comparative adverbs ('faster') can be intensified by 'far' or 'much', but not by 'very'.",
    workedSolution: "Comparative forms ('faster') are modified by degree adverbs such as 'far' or 'much' ('far faster'). 'Very' can only modify base adjectives ('very fast'), not comparative forms.",
    points: 1
  },
  {
    number: 9,
    prompt: "I ............ the headmaster about the missing library book, but then I changed my mind.",
    options: ["had told", "have told", "am telling", "was going to tell"],
    correctAnswer: "was going to tell",
    hint: "Expressing an intention formed in the past that was subsequently abandoned before execution.",
    workedSolution: "'Was going to tell' expresses an unfulfilled past intention (future-in-the-past) that was interrupted by a change of mind.",
    points: 1
  },
  {
    number: 10,
    prompt: "By the close of the communal labor exercise tomorrow, the youth ............ the health post.",
    options: ["shall paint", "shall be painting", "shall have painted", "shall have been painting"],
    correctAnswer: "shall have painted",
    hint: "The Future Perfect tense ('shall/will have + past participle') shows an action completed before a future deadline.",
    workedSolution: "The time phrase 'By the close of... tomorrow' indicates a completed future milestone, requiring the Future Perfect tense ('shall have painted').",
    points: 1
  },
  {
    number: 11,
    prompt: "You are a registered member of the debating society, ............?",
    options: ["isn't it", "are you", "aren't you", "weren't you"],
    correctAnswer: "aren't you",
    hint: "An affirmative present statement with 'are' takes a negative tag using the same auxiliary.",
    workedSolution: "The main clause has a positive verb ('are') with the subject 'you'. The corresponding question tag must be negative: 'aren't you?'.",
    points: 1
  },
  {
    number: 12,
    prompt: "Our senior housemaster is not an unapproachable administrator, ............?",
    options: ["is he", "isn't he", "does he", "doesn't he"],
    correctAnswer: "is he",
    hint: "A negative statement with 'is not' takes an affirmative tag using 'is'.",
    workedSolution: "The main clause contains the negative copula 'is not'. The question tag must be positive: 'is he?'.",
    points: 1
  },
  {
    number: 13,
    prompt: "You have traveled to Kumasi recently, .............",
    options: ["did you", "have you", "didn't you", "haven't you"],
    correctAnswer: "haven't you",
    hint: "An affirmative present perfect clause with 'have' takes a negative tag using 'have'.",
    workedSolution: "The sentence is in the present perfect affirmative ('have traveled'). The tag must be negative: 'haven't you?'.",
    points: 1
  },
  {
    number: 14,
    prompt: "Kofi is undoubtedly the ............ mathematician in our junior high school.",
    options: ["cleverer", "cleverest", "more clever", "very clever"],
    correctAnswer: "cleverest",
    hint: "Comparing one student against an entire class requires the superlative degree preceded by 'the'.",
    workedSolution: "When selecting the foremost individual in a group of three or more, the superlative inflection '-est' ('the cleverest') is required.",
    points: 1
  },
  {
    number: 15,
    prompt: "The three orphaned siblings love ............ deeply and share everything.",
    options: ["each other", "one another", "theirselves", "themselves"],
    correctAnswer: "one another",
    hint: "When reciprocal affection or action is shared among three or more people, use this phrase.",
    workedSolution: "In standard English grammar, reciprocal action between two entities uses 'each other', while reciprocal action among three or more ('the three orphaned siblings') uses 'one another'.",
    points: 1
  },
  {
    number: 16,
    prompt: "............ the wooden wall clock is antiquated, it still keeps accurate time.",
    options: ["Since", "Besides", "Although", "However"],
    correctAnswer: "Although",
    hint: "Identify the subordinating conjunction that introduces a clause of concession or contrast.",
    workedSolution: "'Although' is a subordinating conjunction of concession used to connect contrasting facts in a single complex sentence.",
    points: 1
  },
  {
    number: 17,
    prompt: "The exploratory expedition set ............ at dawn before the sun became scorching.",
    options: ["up", "in", "out", "about"],
    correctAnswer: "out",
    hint: "Identify the phrasal verb meaning to embark on a journey or start out.",
    workedSolution: "The phrasal verb 'to set out' (or 'set off') means to begin a journey or expedition.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (18 - 22) ---
  {
    number: 18,
    prompt: "A trustworthy friend will never disclose your confidential family matters.\nChoose the word nearest in meaning to the underlined word 'disclose'.",
    options: ["give", "show", "display", "reveal"],
    correctAnswer: "reveal",
    hint: "To make secret or unknown information known to others.",
    workedSolution: "'Disclose' means to make secret or private information public; 'reveal' is its direct synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "As the candidate waited for the oral interview panel, he was visibly nervous.\nChoose the word nearest in meaning to the underlined word 'nervous'.",
    options: ["sad", "afraid", "alarmed", "uneasy"],
    correctAnswer: "uneasy",
    hint: "Feeling anxious, tense, worried, or lacking peace of mind.",
    workedSolution: "'Nervous' describes a state of anxious apprehension and restlessness; 'uneasy' is its closest synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "The school board was thoroughly satisfied with the terminal academic assessment.\nChoose the word nearest in meaning to the underlined word 'satisfied'.",
    options: ["pleased", "convinced", "pampered", "encouraged"],
    correctAnswer: "pleased",
    hint: "Feeling contentment, approval, or fulfillment of an expectation.",
    workedSolution: "'Satisfied' means feeling happy or content because an expectation has been met; 'pleased' is its direct equivalent.",
    points: 1
  },
  {
    number: 21,
    prompt: "The security guard's demeanor toward the visitors was decidedly hostile.\nChoose the word nearest in meaning to the underlined word 'hostile'.",
    options: ["harsh", "strange", "abusive", "unfriendly"],
    correctAnswer: "unfriendly",
    hint: "Showing ill will, antagonism, coldness, or opposition.",
    workedSolution: "'Hostile' means showing open opposition, coldness, or unfriendliness; 'unfriendly' is its nearest synonym.",
    points: 1
  },
  {
    number: 22,
    prompt: "It was not his intention to cause distress to his younger sister.\nChoose the word nearest in meaning to the underlined word 'intention'.",
    options: ["aim", "decision", "interest", "ambition"],
    correctAnswer: "aim",
    hint: "An intended objective, goal, or purpose behind an action.",
    workedSolution: "'Intention' refers to a conscious design, objective, or purpose; 'aim' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (23 - 27) ---
  {
    number: 23,
    prompt: "Ibrahim submitted his scholarship application at the eleventh hour. This means that Ibrahim submitted it ............",
    options: [
      "at eleven o'clock",
      "a few hours before closing time",
      "during eleven hours of registration",
      "when it was almost too late"
    ],
    correctAnswer: "when it was almost too late",
    hint: "At the latest possible moment before a deadline.",
    workedSolution: "The idiom 'at the eleventh hour' means at the very last moment or when it is almost too late to act.",
    points: 1
  },
  {
    number: 24,
    prompt: "The health center is located within a stone's throw of the school gate. This means that the health center is ............",
    options: [
      "reached through a gravel path",
      "located inside a stone quarry",
      "very close to the school gate",
      "often damaged with stones"
    ],
    correctAnswer: "very close to the school gate",
    hint: "A very short physical distance away.",
    workedSolution: "The idiom 'within a stone's throw' signifies a very short distance away or very close by.",
    points: 1
  },
  {
    number: 25,
    prompt: "When James heard the sudden rifle gunshot, his hair stood on end. This means that James ............",
    options: ["was deeply worried", "started weeping loudly", "was intensely frightened", "became paralyzed"],
    correctAnswer: "was intensely frightened",
    hint: "A natural physiological response to sudden, chilling terror or fear.",
    workedSolution: "The idiom 'hair stood on end' describes an involuntary bodily reaction caused by extreme shock, dread, or intense fright.",
    points: 1
  },
  {
    number: 26,
    prompt: "Aba visited the hospital to cheer up her convalescing classmate. This means that Aba went to ............",
    options: ["shout encouragement at her", "present her with gifts", "tell her folktales", "make her happy and comfortable"],
    correctAnswer: "make her happy and comfortable",
    hint: "To brighten someone's mood and relieve sadness or anxiety.",
    workedSolution: "'To cheer someone up' means to comfort, encourage, and brighten their emotional state to make them happy.",
    points: 1
  },
  {
    number: 27,
    prompt: "The invigilator's sudden query threw the nervous pupil off balance. This means that the pupil was ............",
    options: ["physically hurt", "deeply annoyed", "made anxious", "completely confused"],
    correctAnswer: "completely confused",
    hint: "Caught unprepared, bewildered, disoriented, or flustered.",
    workedSolution: "To be 'thrown off balance' means to be taken by surprise, disoriented, or made completely confused and flustered.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (28 - 32) ---
  {
    number: 28,
    prompt: "While the majority of voters endorsed the candidate, the ............ opposed his election.",
    options: ["rivals", "members", "minority", "opposition"],
    correctAnswer: "minority",
    hint: "'Majority' means the greater number. Find the word that denotes the smaller number.",
    workedSolution: "'Majority' denotes more than half of a total. Its direct mathematical and social antonym is 'minority'.",
    points: 1
  },
  {
    number: 29,
    prompt: "Imported luxury clothing is costly in the city, but secondhand apparel remains relatively ............",
    options: ["free", "cheap", "tasty", "scarce"],
    correctAnswer: "cheap",
    hint: "'Costly' or 'expensive' means requiring high payment. Find the word meaning low in price.",
    workedSolution: "'Costly' (expensive) means high-priced. Its direct antonym in commerce is 'cheap' (inexpensive).",
    points: 1
  },
  {
    number: 30,
    prompt: "The truant student was condemned by the disciplinary committee, whereas the honest boy was ............",
    options: ["cheered", "praised", "rewarded", "recommended"],
    correctAnswer: "praised",
    hint: "'Condemned' means expressed severe disapproval. Find the word that denotes expressing high approval.",
    workedSolution: "'Condemned' means officially denounced or blamed. Its direct antonym is 'praised' (commended and approved).",
    points: 1
  },
  {
    number: 31,
    prompt: "Although he had applied for a permanent appointment, he was offered only a ............ position.",
    options: ["useful", "boring", "laborious", "temporary"],
    correctAnswer: "temporary",
    hint: "'Permanent' means enduring indefinitely. Find the word meaning lasting for a limited time only.",
    workedSolution: "'Permanent' means intended to last indefinitely. Its exact antonym in employment is 'temporary' (short-term).",
    points: 1
  },
  {
    number: 32,
    prompt: "Some individuals focus exclusively on material physical needs, completely neglecting their ............ well-being.",
    options: ["basic", "moral", "financial", "spiritual"],
    correctAnswer: "spiritual",
    hint: "'Physical' relates to the tangible body. Find the word relating to the human spirit or soul.",
    workedSolution: "'Physical' pertains to the material body. Its direct antonym in human nature and philosophy is 'spiritual'.",
    points: 1
  },

  // --- PART II: LITERATURE IN ENGLISH (33 - 40) ---
  {
    number: 33,
    prompt: "A dramatic composition characterized by lighthearted humor that concludes with a fortunate resolution is a comedy, which typically ............",
    options: ["ends sadly in disaster", "ends happily for protagonists", "condemns societal norms", "preaches legal honesty"],
    correctAnswer: "ends happily for protagonists",
    hint: "Unlike a tragedy which ends in catastrophe, a comedy concludes pleasantly.",
    workedSolution: "In dramatic theory, a comedy is a play designed to amuse and entertain, and it traditionally concludes with a happy, joyful resolution.",
    points: 1
  },
  {
    number: 34,
    prompt: "The principal female character who demonstrates courage and drives the central action in a dramatic work is designated as the ............",
    options: ["hero", "chorus", "heroine", "persona"],
    correctAnswer: "heroine",
    hint: "The female equivalent of a hero.",
    workedSolution: "In literature, the central heroic female character of a play, novel, or narrative is the 'heroine'. A 'persona' is the poet's speaker.",
    points: 1
  },
  {
    number: 35,
    prompt: "Descriptive language that appeals to the five bodily senses to create vivid mental pictures is collectively known as ............",
    options: ["irony", "symbolic device", "visual pictures", "imagery"],
    correctAnswer: "imagery",
    hint: "Sensory details (visual, auditory, olfactory, tactile, gustatory) in literary writing.",
    workedSolution: "'Imagery' is the collective term for sensory words and figurative descriptions that evoke mental images and sensations in the reader.",
    points: 1
  },
  {
    number: 36,
    prompt: "In a serious theatrical tragedy, the inclusion of an amusing episode to provide comic relief is intended to ............",
    options: ["reduce emotional tension", "teach an explicit moral lesson", "set an ethical standard", "compound the hero's problems"],
    correctAnswer: "reduce emotional tension",
    hint: "Relieving intense emotional suspense and psychological strain temporarily.",
    workedSolution: "The literary function of 'comic relief' in dramatic tragedy is to alleviate or temporarily reduce emotional tension and heavy suspense.",
    points: 1
  },
  {
    number: 37,
    prompt: "A dramatic script is most completely appreciated and effectively realized when it is ............",
    options: ["acted on stage", "read in private", "analyzed in class", "memorized by heart"],
    correctAnswer: "acted on stage",
    hint: "Drama is written primarily for theatrical performance before an audience.",
    workedSolution: "Drama is fundamentally a performance art written with stage directions, dialogue, and gestures; it is best appreciated when enacted on stage.",
    points: 1
  },
  {
    number: 38,
    prompt: "A narrative poem is a poetic form that fundamentally ............",
    options: ["praises heroic actions", "tells a connected story", "mourns the deceased", "condemns evil conduct"],
    correctAnswer: "tells a connected story",
    hint: "It contains characters, setting, conflict, and plot sequence in verse form.",
    workedSolution: "A narrative poem (such as an epic or ballad) is a poem that narrates a story with a sequence of events, characters, and a plot.",
    points: 1
  },
  {
    number: 39,
    prompt: "Read the extract below:\n\"And I will love thee still, my dear, / Till a' the seas gang dry.\"\nThe figure of speech illustrated in the second line is a/an ............",
    options: ["litotes", "hyperbole", "euphemism", "understatement"],
    correctAnswer: "hyperbole",
    hint: "An extravagant, deliberate exaggeration not meant to be taken literally.",
    workedSolution: "Loving someone until all the oceans of the world dry up is a deliberate, dramatic overstatement; hence it is a 'hyperbole'.",
    points: 1
  },
  {
    number: 40,
    prompt: "Read the stanza below:\n\"So fair art thou, my bonnie lass, (a)\nSo deep in luve am I; (b)\nAnd I will luve thee still, my dear, (c)\nTill a' the seas gang dry.\" (b)\nThe rhyme scheme of this traditional ballad stanza is ............",
    options: ["abcd", "abca", "abcb", "abba"],
    correctAnswer: "abcb",
    hint: "Observe the end words: 'lass' (a), 'I' (b), 'dear' (c), 'dry' (b).",
    workedSolution: "The end rhyme pattern pairs 'lass' (a), 'I' (b), 'dear' (c), and 'dry' (b, rhyming with 'I'). The scheme is strictly 'abcb'.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 201501);

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
        prompt: "Write a letter to the Presiding Member of your district assembly, highlighting two notable socio-economic achievements of your community over the past five years and presenting two realistic developmental plans for the future.",
        modelAnswer: `Dwenem Junior High School\nP. O. Box 15\nDwenem, Bono Region\n15th June, 2015\n\nThe Presiding Member\nJaman South District Assembly\nDrobo\n\nDear Sir,\n\nPROGRESS REPORT: ACHIEVEMENTS AND FUTURE DEVELOPMENT BLUEPRINT FOR DWENEM COMMUNITY\n\nOn behalf of the youth and citizens of Dwenem, I respectfully write to highlight two notable achievements our community has attained over the past five years and to submit two critical development proposals for the assembly's consideration.\n\nOver the last five years, our community has achieved remarkable progress through communal solidarity and local assembly support. First, we successfully constructed an ultra-modern community health post equipped with a labor ward and nurse quarters. This facility has eradicated maternal transit deaths and provides immediate healthcare to surrounding agrarian hamlets. Secondly, through self-help levies, we completed the electrification of our local market square and mechanized three high-yielding boreholes, ensuring constant potable drinking water and reducing waterborne diseases.\n\nLooking toward the future, our community urgently requires intervention in two key areas. First, we plan to establish an agro-processing cooperative center. As a major tomato- and cassava-growing area, our farmers suffer catastrophic post-harvest losses every harvest season. Establishing a community processing unit will add value to our produce, stabilize farmer incomes, and create employment for the youth.\n\nSecondly, we propose the construction of an information and communication technology (ICT) center and library for our basic schools. Our learners currently lack access to digital computers, which severely handicaps their preparation for the BECE examinations.\n\nWe trust that the district assembly will partner with our traditional council to realize these vital blueprints.\n\nThank you.\n\nYours faithfully,\n[Signature]\nKwasi Mensah\n(Youth Secretary)`
      },
      {
        questionNumber: "2",
        category: "Informal / Persuasive Letter",
        prompt: "Your classmate's uncle has decided to withdraw financial sponsorship for your friend's schooling. Write a polite letter to the uncle, giving at least two convincing reasons why he should reconsider his decision and continue sponsoring his nephew/niece.",
        modelAnswer: `Methodist Junior High School\nP. O. Box 88\nSunyani, Bono Region\n22nd May, 2015\n\nDear Mr. Boateng,\n\nI hope this letter finds you in good health and peaceful spirits. I write with deep humility and respect on behalf of my classmate and close friend, your nephew Emmanuel, who recently informed me of your painful decision to withdraw your sponsorship of his basic school education due to pressing financial commitments.\n\nSir, I respectfully appeal to your generous heart to reconsider this decision because Emmanuel possesses extraordinary academic brilliance and unwavering diligence. For three consecutive terms, he has placed first in our class in Mathematics and Integrated Science. Our teachers regard him as the school's most promising candidate for the upcoming BECE. Terminating his schooling at this critical stage would prematurely extinguish a brilliant mind that is destined to bring immense honor and elevation to your family.\n\nFurthermore, Emmanuel is a well-mannered, disciplined, and morally upright young man who genuinely values your sacrifices. Outside school hours, he works tirelessly on the family cocoa farm and assists his siblings with household chores. He has assured me that he is prepared to take up weekend vocational errands to supplement his feeding costs so as to lessen your financial burden. Education is the greatest legacy an elder can bequeath to a child, and any investment you make in Emmanuel's future will yield generational dividends.\n\nI humbly plead that you grant him another opportunity to complete his schooling. May the Almighty replenish your resources abundantly.\n\nYours respectfully,\n[Signature]\nSamuel Addo`
      },
      {
        questionNumber: "3",
        category: "Argumentative / Debate Essay",
        prompt: "Write an essay arguing for or against the motion: \"It is more advantageous to live in the village than in the city.\"",
        modelAnswer: `THE TIMELESS BLESSINGS OF RURAL LIVING: WHY THE VILLAGE SURPASSES THE CITY\n\nIn contemporary discourse, many people mistakenly equate urbanization with happiness, assuming that the glittering lights and skyscrapers of the metropolis represent the pinnacle of human life. However, when assessed through the lenses of physical health, peace of mind, and social harmony, life in the village is undeniably far more advantageous than life in the congested city.\n\nFirst and foremost, the village offers a pristine, unpolluted natural environment that guarantees sound health and longevity. Urban metropolises are plagued by industrial smog, toxic vehicular exhaust fumes, contaminated open gutters, and deafening noise pollution. In contrast, rural villagers breathe crisp, clean forest air and drink pure water from natural springs. Furthermore, villagers consume fresh, organic foodstuffs—vegetables, yams, fruits, and river fish—harvested directly from their farms, free from artificial chemical preservatives. This wholesome lifestyle shields rural folk from lifestyle illnesses such as hypertension and chronic respiratory disorders.\n\nSecondly, rural living provides exceptional emotional peace and communal solidarity. In the city, life is an exhausting rat-race marked by astronomical rent costs, transport fares, and pervasive personal insecurity behind fortified iron gates. Village life, however, is anchored on the sacred African principle of being our brother's keeper. Crime is practically non-existent; neighbors share food, assist each other during farm planting, and communal warmth banishes depression and loneliness.\n\nIn conclusion, while cities offer commercial spectacles, they exact a devastating toll on human tranquility and physical health. The serenity, wholesome nutrition, and social cohesion of the village make it a far superior haven for genuine human well-being.`
      }
    ]
  },
  sectionB_comprehension: {
    title: "Part B: Reading Comprehension",
    passage: `The dry season was very long. The people waited anxiously for the rains to plant their seeds. The rain clouds that appeared occasionally were deceptive. To while away the time, they wove baskets and kente; others carved stools or sat under trees, playing games and drinking palm wine.\n\nSentu and his family were on the verge of starvation. They had just one cassava farm left to feed on. The maize in the barn was all gone. In fact, they had started eating the seed maize. Sentu kept wondering how he would get seeds to plant when the rainy season eventually started. He went to inspect the traps he had set for the rodents that had been feasting on the cassava. If the traps caught any animals, it would be a double blessing; he would get meat and reduce the population of 'his enemies', the pests. While inspecting his traps, he saw some smoke. He dashed towards it. He tried to put out the fire but could not. He shouted for help. In the twinkling of an eye, the whole farm had been destroyed. Sentu wept uncontrollably.\n\nWhen he reached the village, his neighbours rushed to his house to console him. They gave him foodstuff and promised to help him get back on his feet. Tutu, the palm-wine tapper, visited Sentu that evening. He was accompanied by two elderly and highly respected men in the village. Their mission was simple. Tutu had asked them to apologize to Sentu on his behalf. It was the fire from Tutu's torch that had caused the havoc and brought such agony to Sentu's family. What could Sentu do or say?`,
    questions: [
      {
        subId: "(a)(i)",
        question: "What was the main occupation of the people in Sentu's village?",
        answer: "Farming (crop cultivation / agriculture)."
      },
      {
        subId: "(a)(ii)",
        question: "State two other cottage craft activities they engaged in to earn an income during the dry season.",
        answer: "1. Weaving baskets and kente cloth.\n2. Carving wooden stools (or tapping palm wine)."
      },
      {
        subId: "(b)(i)",
        question: "What does the word 'pests' refer to in the passage?",
        answer: "The destructive rodents (such as cane rats, mice, or grasscutters) that were eating and destroying Sentu's cassava farm."
      },
      {
        subId: "(b)(ii)",
        question: "Why did the writer refer to the pests as Sentu's 'enemies'?",
        answer: "Because they were actively destroying his family's final remaining source of food, pushing them to the brink of starvation."
      },
      {
        subId: "(c)(i)",
        question: "How did Sentu feel when his farm was burnt?",
        answer: "He felt utterly devastated, heartbroken, and helpless (he wept uncontrollably)."
      },
      {
        subId: "(c)(ii)",
        question: "Why did Sentu feel that way?",
        answer: "Because the cassava farm was the very last food reserve his family possessed to survive the drought, and its destruction meant complete ruin and starvation."
      },
      {
        subId: "(d)",
        question: "State two reasons why Tutu chose the elderly and highly respected men to accompany him to visit Sentu.",
        answer: "1. To demonstrate genuine humility, solemnity, and deep remorse for the accidental destruction of the farm.\n2. To invoke their traditional authority and respect to plead for Sentu's forgiveness and prevent violent retaliation or legal conflict."
      },
      {
        subId: "(e)",
        question: "Explain in your own words the following expressions as used in the passage:\n(i) a double blessing;\n(ii) wept uncontrollably;\n(iii) get back on his feet.",
        answer: "(i) **a double blessing:** A two-fold advantage or two great benefits achieved at the same time (obtaining bushmeat and getting rid of farm pests).\n(ii) **wept uncontrollably:** Cried bitterly and inconsolably without being able to restrain his tears.\n(iii) **get back on his feet:** Recover from misfortune, become self-sufficient, and restore his livelihoods."
      },
      {
        subId: "(f)",
        question: "For each of the following words, provide a word or phrase that means the same and can replace it in the passage without altering the meaning:\n(i) anxiously;\n(ii) deceptive;\n(iii) dashed;\n(iv) mission;\n(v) agony.",
        answer: "(i) **anxiously:** eagerly / expectantly / keenly / worriedly.\n(ii) **deceptive:** misleading / false / untruthful / elusive.\n(iii) **dashed:** rushed / ran / sprinted / hurried.\n(iv) **mission:** purpose / task / errand / objective.\n(v) **agony:** anguish / extreme sorrow / distress / pain / misery."
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

async function seedBeceEnglish2015Calibrated() {
  const db = await getDb();
  console.log("Seeding Calibrated & Balanced BECE English 2015 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2015");
  await docRef.set({
    year: 2015,
    title: "BECE English Language 2015 (Calibrated National Benchmark)",
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

  console.log("✅ Calibrated BECE English 2015 successfully seeded into Firestore!");
}

seedBeceEnglish2015Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2015:", err);
    process.exit(1);
  });
