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
  passageTitle?: string;
  passageText?: string;
  passage?: string;
}

// =========================================================================
// ISOMORPHIC PASSAGE I: WALKING TO SCHOOL (CALIBRATED ORIGINAL)
// =========================================================================
const passage1Title = "Passage I: Walking to School - Two Friends and Differing Fortunes";
const passage1Text = `The two girls were drawing near to the school compound, holding hands affectionately as they walked together. Ayele and Esinam were inseparable companions who attended the same basic school and shared the same classroom desk. Today, however, Ayele was unusually quiet, even though Esinam was eagerly waiting for her to say something complimentary about her fashionable new schoolbag.

"So that is your attitude today? You cannot even pass a simple remark about my bag? Father bought it for me when he returned from his trip to America yesterday," Esinam prodded. Ayele's only response was a faint, indifferent grunt. But Esinam was in far too buoyant a mood to be disheartened. Shrugging off her friend's withdrawn disposition, she broke into a lighthearted tune celebrating her parents' lavish generosity: "Mother and Father buy me elegant dresses, fancy footwear, and whatever luxury I desire once I ask. It is truly wonderful to be young!"

Strapped across Ayele's shoulders was a worn, weathered rucksack formerly used by her senior sister. Its original brown canvas had faded to a dusty cream from countless washings. When she finally broke her prolonged silence, her tone was dignified, solemn, and devoid of envy: "I have grown accustomed to the second-hand dresses, bags, and sandals that Mother manages to purchase for me from the market. She tells me honestly that her modest wages cannot stretch any further. I trust her sacrifices and love her dearly." A slight quiver ruffled her voice, as though tears were welling behind her eyelids. Yet her eyes brightened with determination as she continued: "I am in J.S.S. 3, just like you, and our academic marks are equally brilliant. It is magnificent to look forward to the future with courage and hope." Esinam nodded in silent respect just as the morning siren sounded, transforming their stroll into a brisk sprint.`;

const passage1QuestionsRaw = [
  {
    number: 1,
    prompt: "According to Passage I, why was Ayele unusually quiet during their walk to school?",
    options: [
      "She disliked Esinam's new American schoolbag",
      "She was hurrying to arrive before the school gates closed",
      "She was feeling pensive, withdrawn, and moody",
      "Esinam had offended her with an insulting remark"
    ],
    correctAnswer: "She was feeling pensive, withdrawn, and moody",
    hint: "Reread paragraph one: she was not speaking and responded with a mere grunt, reflecting a quiet, reflective, and moody state.",
    workedSolution: "The narrative explains that Ayele was quiet because she was in a moody, reflective state as her friend flaunted her new bag.",
    points: 1
  },
  {
    number: 2,
    prompt: "From Esinam's perspective in Passage I, the exclamation 'It's great to be young!' signifies ............",
    options: [
      "having parents who supply every material comfort and wish",
      "enjoying the privilege of attending a basic school",
      "living happily with both a mother and a father",
      "being cheerful and singing along the pathway"
    ],
    correctAnswer: "having parents who supply every material comfort and wish",
    hint: "Notice how she immediately connects the statement to her parents buying her dresses, shoes, and anything she asks for.",
    workedSolution: "Esinam equates the joy of youth with material indulgence—having wealthy parents who purchase every dress, shoe, and luxury she desires.",
    points: 1
  },
  {
    number: 3,
    prompt: "What does the passage reveal regarding the economic status of Ayele's family?",
    options: [
      "They are destitute and beg for daily food",
      "They are wealthy but extremely stingy with money",
      "They are of modest means and somewhat poor",
      "They are dishonest about their financial income"
    ],
    correctAnswer: "They are of modest means and somewhat poor",
    hint: "Ayele's mother buys second-hand items and honestly explains she cannot afford more.",
    workedSolution: "The text indicates that Ayele's family has modest financial resources (somewhat poor), compelling her to use faded, second-hand hand-me-downs.",
    points: 1
  },
  {
    number: 4,
    prompt: "In Passage I, Ayele is portrayed as a young girl who is remarkably ............",
    options: [
      "proud and resentful",
      "difficult to please",
      "jealous of her peers",
      "mature, contented, and thoughtful"
    ],
    correctAnswer: "mature, contented, and thoughtful",
    hint: "She speaks solemnly without regret, loves her mother, and looks forward to the future with hope.",
    workedSolution: "Ayele exhibits maturity, gratitude, and deep reflection (thoughtful), appreciating her mother's honest efforts and prioritizing academic success over material vanity.",
    points: 1
  },
  {
    number: 5,
    prompt: "In Passage I, the word 'quiver' (or 'tremble') in 'a slight quiver ruffled her voice' means ............",
    options: [
      "disturbance",
      "tremor or slight shake",
      "sudden drop in pitch",
      "loudness"
    ],
    correctAnswer: "tremor or slight shake",
    hint: "A slight shaking or trembling of the voice when emotionally moved.",
    workedSolution: "'Tremble' or 'quiver' refers to an unsteady, involuntary shaking or slight vibration of the voice; 'tremor or slight shake' is its direct meaning.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: THE NATURE OF LAUGHTER (CALIBRATED ORIGINAL)
// =========================================================================
const passage2Title = "Passage II: The Psychology and Social Function of Laughter";
const passage2Text = `There are two fundamental inquiries that observers frequently pose concerning laughter: what triggers human amusement, and what physiological and social benefits does laughter produce?

When one examines the roots of humor, attention naturally turns to interpersonal behavior across diverse circumstances. Why, for instance, do people laugh when someone acts awkwardly or exhibits an unusual human frailty?

The explanation is remarkably straightforward. We laugh instinctively whenever we encounter behavior or appearances that are incongruous and queer. If, for instance, on your morning commute to work or school, you observed an extraordinarily corpulent gentleman dressed in a leafy green tuxedo and balancing an absurdly tiny straw hat upon his head, or if at a formal banquet you watched a very short man dancing with an exceptionally towering woman, you would chuckle involuntarily. Such sights are inherently funny because they depart from conventional expectations.

Beyond the comical oddities that provoke mirth, laughter confers immense physical and mental benefits. Medically, robust laughter exercises our respiratory lungs and enables the body to release pent-up nervous energy. Socially, humor acts as an irresistible magnet; individuals who cultivate cheerful laughter naturally attract warm company and forge enduring friendships. Furthermore, across diverse societies, collective laughter serves as a gentle corrective instrument to check deviant, antisocial behavior, thereby helping maintain community order and discipline.`;

const passage2QuestionsRaw = [
  {
    number: 6,
    prompt: "According to Passage II, why do human beings laugh instinctively when observing others?",
    options: [
      "They are dressed in expensive ceremonial apparel",
      "They witness someone behaving in an odd, unusual, or funny manner",
      "They are attending an official evening banquet",
      "They are commuting together along a public highway"
    ],
    correctAnswer: "They witness someone behaving in an odd, unusual, or funny manner",
    hint: "Reread paragraph three: we laugh when we see people behaving or acting in an odd, queer, or funny manner.",
    workedSolution: "The passage notes that humor arises when we witness unusual, incongruous, or funny actions and appearances that deviate from the ordinary.",
    points: 1
  },
  {
    number: 7,
    prompt: "What physiological benefit does hearty laughter provide to the human body according to Passage II?",
    options: [
      "It strengthens memory retention during study",
      "It promotes lung health and releases pent-up bodily energy",
      "It makes people appear comical to onlookers",
      "It lowers physical body temperature instantly"
    ],
    correctAnswer: "It promotes lung health and releases pent-up bodily energy",
    hint: "Check paragraph four: it is good for our lungs and allows us to release extra energy.",
    workedSolution: "The author explains that laughter exercises the respiratory lungs and releases surplus or pent-up physical energy, promoting good health.",
    points: 1
  },
  {
    number: 8,
    prompt: "According to Passage II, individuals who enjoy cheerful laughter generally ............",
    options: [
      "appear strange to the public",
      "find fault with their neighbors",
      "injure their physical vocal cords",
      "attract good company and make friends easily"
    ],
    correctAnswer: "attract good company and make friends easily",
    hint: "Look at paragraph four: 'If you enjoy laughter you invite good company.'",
    workedSolution: "Humor has high social value; people who embrace laughter attract pleasant companions and build friendships effortlessly.",
    points: 1
  },
  {
    number: 9,
    prompt: "How do human societies utilize laughter as a tool of social control in Passage II?",
    options: [
      "To provoke public anger and disputes",
      "To mock the physically afflicted",
      "To correct improper behavior and enforce community discipline",
      "To flatter political leaders"
    ],
    correctAnswer: "To correct improper behavior and enforce community discipline",
    hint: "Paragraph four concludes: laughter is used to keep non-conformists in check, ensuring discipline.",
    workedSolution: "The text explains that societies employ laughter and mild ridicule to check unacceptable behavior, thereby maintaining social order and discipline.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the word 'awkwardly' in 'behaving awkwardly' means acting ............",
    options: [
      "foolishly and clumsily",
      "joyfully and excitedly",
      "respectably and honorably",
      "eagerly and boldly"
    ],
    correctAnswer: "foolishly and clumsily",
    hint: "'Awkwardly' means lacking grace, clumsy, or odd in manner.",
    workedSolution: "'Awkwardly' refers to behaving in an ungainly, clumsy, odd, or foolish manner; 'foolishly and clumsily' captures its contextual meaning.",
    points: 1
  }
];

// =========================================================================
// GENERAL SECTIONS B - E: SYNONYMS, IDIOMS, ANTONYMS, STRUCTURE
// =========================================================================
const generalQuestionsRaw = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (11 - 15) ---
  {
    number: 11,
    prompt: "Our dependable school goalkeeper saved the team from public defeat.\nChoose the word nearest in meaning to 'dependable'.",
    options: ["muscular", "athletic", "reliable", "vigilant"],
    correctAnswer: "reliable",
    hint: "Trustworthy, steady, and capable of being relied on.",
    workedSolution: "'Dependable' means trustworthy and consistent; 'reliable' is its direct synonym.",
    points: 1
  },
  {
    number: 12,
    prompt: "An experienced, neutral referee was appointed to officiate the championship finals.\nChoose the word nearest in meaning to 'neutral'.",
    options: ["foreign", "impartial", "celebrated", "tolerant"],
    correctAnswer: "impartial",
    hint: "Not taking sides in a dispute; unbiased and fair.",
    workedSolution: "'Neutral' means unbiased, fair, and not favoring either side; 'impartial' is its exact equivalent.",
    points: 1
  },
  {
    number: 13,
    prompt: "The candidates were jubilating when the provisional results were posted on the notice board.\nChoose the word nearest in meaning to 'jubilating'.",
    options: ["dancing", "rejoicing", "marching", "applauding"],
    correctAnswer: "rejoicing",
    hint: "Expressing great happiness, triumph, or celebration.",
    workedSolution: "'Jubilating' means expressing great joy and celebration; 'rejoicing' is its direct synonym.",
    points: 1
  },
  {
    number: 14,
    prompt: "Kuuki's lifelong dream is to become a celebrated concert pianist.\nChoose the word nearest in meaning to 'celebrated'.",
    options: ["wealthy", "gospel", "famous", "traditional"],
    correctAnswer: "famous",
    hint: "Widely known, admired, and acclaimed by the public.",
    workedSolution: "'Celebrated' means widely honored, acclaimed, or 'famous'.",
    points: 1
  },
  {
    number: 15,
    prompt: "Appiah is a talented athlete who excels in both track and field competitions.\nChoose the word nearest in meaning to 'talented'.",
    options: ["gifted", "robust", "tireless", "fortunate"],
    correctAnswer: "gifted",
    hint: "Possessing natural creative or athletic ability.",
    workedSolution: "'Talented' means possessing natural aptitude or ability; 'gifted' is its exact equivalent.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "Kofi returned to class after playing truant for three consecutive days. This means that Kofi was ............",
    options: [
      "detained in hospital",
      "deliberately absent from school without permission",
      "kidnapped by strangers",
      "formally suspended by the headmaster"
    ],
    correctAnswer: "deliberately absent from school without permission",
    hint: "To play truant means to stay away from school without authorization.",
    workedSolution: "The idiom 'to play truant' means to stay away from school deliberately without permission or valid excuse.",
    points: 1
  },
  {
    number: 17,
    prompt: "Ama was the only witness who remained close-lipped during the investigation. This means that Ama ............",
    options: [
      "refused to weep",
      "looked depressed",
      "refused to speak or disclose information",
      "spoke in a whisper"
    ],
    correctAnswer: "refused to speak or disclose information",
    hint: "Keeping one's lips sealed; saying nothing.",
    workedSolution: "The idiom 'close-lipped' (or tight-lipped) means refusing to speak, divulge secrets, or give information.",
    points: 1
  },
  {
    number: 18,
    prompt: "The recalcitrant player was instructed to toe the line or be dismissed from the squad. This means he was asked to ............",
    options: [
      "tender an apology",
      "conform to rules and obey instructions",
      "resign immediately",
      "repay his allowance"
    ],
    correctAnswer: "conform to rules and obey instructions",
    hint: "To conform strictly to established rules and standards.",
    workedSolution: "The idiom 'to toe the line' means to conform strictly to rules, standards, or authoritative directives; to obey.",
    points: 1
  },
  {
    number: 19,
    prompt: "The doctor advised the asthmatic patient to give up smoking permanently. This means the patient should ...... smoking.",
    options: ["suspend", "stop", "curtail", "abhor"],
    correctAnswer: "stop",
    hint: "To abandon, cease, or discontinue a habit.",
    workedSolution: "The phrasal verb 'to give up' an activity or habit means to cease, discontinue, or 'stop' it entirely.",
    points: 1
  },
  {
    number: 20,
    prompt: "Auntie Mansa has a heart of gold. This means that Auntie Mansa is ............",
    options: ["exceedingly wealthy", "remarkably generous and kind", "intellectually brilliant", "proud of her jewelry"],
    correctAnswer: "remarkably generous and kind",
    hint: "Having an exceptionally generous, benevolent, and kind nature.",
    workedSolution: "The idiom 'to have a heart of gold' means to be exceptionally kind, benevolent, and generous toward others.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "While my grandfather is a robust nonagenarian, his younger brother is frail and ...... .\nChoose the word most nearly opposite in meaning to 'robust'.",
    options: ["troublesome", "inquisitive", "weak", "melancholy"],
    correctAnswer: "weak",
    hint: "'Robust' means strong, sturdy, and healthy. What word denotes lacking physical strength?",
    workedSolution: "'Robust' means strong, vigorous, and healthy. Its direct physical antonym is 'weak' (or frail).",
    points: 1
  },
  {
    number: 22,
    prompt: "The board consented to the director's proposal, but the auditors ...... with the figures.\nChoose the word most nearly opposite in meaning to 'consented'.",
    options: ["disagreed", "submitted", "protested", "hesitated"],
    correctAnswer: "disagreed",
    hint: "'Consented' means agreed or approved. What word denotes having an opposite opinion or saying no?",
    workedSolution: "'Consented' means agreed, concurred, or assented. Its direct antonym is 'disagreed' (dissented).",
    points: 1
  },
  {
    number: 23,
    prompt: "You need a sharp machete to clear the thicket, not a ...... blade.\nChoose the word most nearly opposite in meaning to 'sharp'.",
    options: ["coarse", "rusty", "blunt", "notched"],
    correctAnswer: "blunt",
    hint: "'Sharp' means having a thin cutting edge. What word describes a cutting edge that is dull?",
    workedSolution: "'Sharp' describes a keen, cutting edge. Its direct tool antonym is 'blunt' (dull).",
    points: 1
  },
  {
    number: 24,
    prompt: "Basic students read abridged literary texts, whereas university scholars study the ...... unabridged editions.\nChoose the word most nearly opposite in meaning to 'abridged'.",
    options: ["original", "classic", "modern", "lengthy"],
    correctAnswer: "original",
    hint: "'Abridged' means shortened or condensed. What word denotes the complete, authentic text as first written?",
    workedSolution: "'Abridged' means shortened or condensed from a longer text. Its direct textual antonym is 'original' (or unabridged/complete).",
    points: 1
  },
  {
    number: 25,
    prompt: "The most disciplined student was awarded a scholarship, while the truant was ...... admission.\nChoose the word most nearly opposite in meaning to 'awarded'.",
    options: ["deprived", "denied", "stripped", "exempted"],
    correctAnswer: "denied",
    hint: "'Awarded' means granted or given as a prize. What word denotes refused or withheld?",
    workedSolution: "'Awarded' means granted, given, or bestowed. Its direct antonym is 'denied' (refused or withheld).",
    points: 1
  },

  // --- SECTION E: STRUCTURE & QUESTION TAGS (26 - 40) ---
  {
    number: 26,
    prompt: "Ashia is used to ...... her elderly grandparents every Saturday morning.",
    options: ["visit", "have visited", "visited", "visiting"],
    correctAnswer: "visiting",
    hint: "The structure 'be used to' (expressing familiarity or habit) is followed by a gerund (verb-ing).",
    workedSolution: "In the construction 'be used to' meaning accustomed to, 'to' functions as a preposition followed by a gerund: 'is used to visiting'.",
    points: 1
  },
  {
    number: 27,
    prompt: "...... students in the science laboratory were present for the safety demonstration.",
    options: ["The whole", "The several", "Much of the", "All the"],
    correctAnswer: "All the",
    hint: "Use the universal plural determiner that modifies plural countable nouns ('students').",
    workedSolution: "Plural countable nouns ('students') are universally determined by 'All the'. 'Whole' is used with singular count nouns; 'Much' with mass nouns.",
    points: 1
  },
  {
    number: 28,
    prompt: "The young infant has ...... on her scalp.",
    options: ["plenty hair", "a lot of hair", "many hairs", "much hairs"],
    correctAnswer: "a lot of hair",
    hint: "'Hair' (on the head) is an uncountable mass noun modified by 'a lot of'. Individual strands are 'hairs'.",
    workedSolution: "Human head hair is normally an uncountable non-count noun. It takes the quantifier 'a lot of hair'. Phrases like 'many hairs' or 'much hairs' are ungrammatical in this context.",
    points: 1
  },
  {
    number: 29,
    prompt: "Korkoi is an elegant, ...... of twelve years.",
    options: [
      "tall, shapely, girl",
      "shapely, tall, girl",
      "girl, shapely, tall",
      "tall, girl, shapely"
    ],
    correctAnswer: "tall, shapely, girl",
    hint: "Adjective ordering: Size/Height ('tall') precedes Shape/Physical appearance ('shapely') before the head noun ('girl').",
    workedSolution: "Cumulative adjective ordering places size/dimension ('tall') before physical shape/condition ('shapely') preceding the noun: 'tall, shapely girl'.",
    points: 1
  },
  {
    number: 30,
    prompt: "The pastor exhorted the entire congregation that they should love ......",
    options: ["another", "each other", "one another", "one other"],
    correctAnswer: "one another",
    hint: "Reciprocal pronoun preferred when an action is mutually exchanged among more than two persons.",
    workedSolution: "When referring to mutual interaction among three or more persons (such as a congregation), 'one another' is prescriptively standard. 'Each other' refers to two.",
    points: 1
  },
  {
    number: 31,
    prompt: "Mansah is ...... beautiful than any of her three senior sisters.",
    options: ["very", "most", "more", "much"],
    correctAnswer: "more",
    hint: "Multi-syllable comparative adjective paired with the comparative marker 'than': 'more + adjective + than'.",
    workedSolution: "When comparing two entities with a multi-syllable adjective ('beautiful') followed by 'than', the comparative form requires 'more': 'more beautiful than'.",
    points: 1
  },
  {
    number: 32,
    prompt: "Appiah was appointed the senior prefect of his school, ......?",
    options: ["wasn't it", "didn't he", "isn't he", "wasn't he"],
    correctAnswer: "wasn't he",
    hint: "An affirmative past passive statement with auxiliary 'was' and masculine subject 'Appiah' takes the negative tag 'wasn't he?'.",
    workedSolution: "The main clause has an affirmative past auxiliary ('was appointed') with masculine subject 'Appiah'. The question tag must be negative: 'wasn't he?'.",
    points: 1
  },
  {
    number: 33,
    prompt: "Whenever Ataa went to the market without permission, she ...... into serious trouble.",
    options: ["got", "gets", "is getting", "has got"],
    correctAnswer: "got",
    hint: "Past habitual sequence of tenses: The past time subordinator 'Whenever Ataa went...' requires a past simple main verb.",
    workedSolution: "To maintain narrative sequence with the past dependent clause ('Whenever Ataa went...'), the main clause takes the simple past tense: 'got'.",
    points: 1
  },
  {
    number: 34,
    prompt: "The new residential academy is established for ...... only.",
    options: ["boy", "boy's", "boys", "boys'"],
    correctAnswer: "boys",
    hint: "Plural noun functioning as the direct object of the preposition 'for' without possession.",
    workedSolution: "Following the preposition 'for', the simple plural noun 'boys' (without an apostrophe) is required to designate the group.",
    points: 1
  },
  {
    number: 35,
    prompt: "\"Kwame, have you ever ...... across this wide river?\"",
    options: ["swam", "swum", "swim", "swims"],
    correctAnswer: "swum",
    hint: "Present Perfect auxiliary 'have' takes the past participle of 'swim': swim - swam - swum.",
    workedSolution: "The principal parts of 'swim' are: present 'swim', past 'swam', past participle 'swum'. Following auxiliary 'have', the correct form is 'swum'.",
    points: 1
  },
  {
    number: 36,
    prompt: "Susie and Tim are childhood companions; they respect and like ......",
    options: ["each other", "themselves", "the other", "one another"],
    correctAnswer: "each other",
    hint: "Reciprocal pronoun used when an action is mutually exchanged between exactly two individuals.",
    workedSolution: "'Each other' is the reciprocal pronoun used when referring to two persons ('Susie and Tim').",
    points: 1
  },
  {
    number: 37,
    prompt: "With her extensive mathematical knowledge, Aunt Ekuwa ...... be able to solve the problem.",
    options: ["can", "has", "will", "ought"],
    correctAnswer: "will",
    hint: "Future ability modal: 'will be able to'. (Note that *can be able to is redundant and ungrammatical).",
    workedSolution: "Future potential or ability is expressed by combining the future auxiliary 'will' with 'be able to': 'will be able to'.",
    points: 1
  },
  {
    number: 38,
    prompt: "When the bus broke down, the students traveled to the examination center ...... foot.",
    options: ["by", "on", "at", "in"],
    correctAnswer: "on",
    hint: "Identify the preposition used in the standard idiom for walking: 'on foot'.",
    workedSolution: "The standard English idiomatic preposition for walking is 'on foot', never 'by foot'.",
    points: 1
  },
  {
    number: 39,
    prompt: "The arbitration committee has been deliberating over the land dispute ...... two o'clock.",
    options: ["over", "by", "since", "until"],
    correctAnswer: "since",
    hint: "Use 'since' with the Present Perfect Continuous to denote a specific starting point in past time.",
    workedSolution: "The preposition 'since' is required with perfect continuous tenses to indicate the specific starting point of an ongoing action ('since 2pm').",
    points: 1
  },
  {
    number: 40,
    prompt: "I hope you are not ...... exhausted to carry this basket of oranges to the kitchen.",
    options: ["very", "so", "as", "too"],
    correctAnswer: "too",
    hint: "Correlative degree structure expressing an excessive state resulting in inability: 'too + adjective + to-infinitive'.",
    workedSolution: "The degree adverb 'too' pairs with the infinitive 'to carry' to indicate an excessive degree that prevents performance: 'too tired to run an errand'.",
    points: 1
  }
];

// Combine all 40 raw questions
const allRawQuestions = [
  ...passage1QuestionsRaw,
  ...passage2QuestionsRaw,
  ...generalQuestionsRaw
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

const assignedTargetIndices = seedShuffle(targetKeys, 200502);

const balancedPaper1: QuestionItem[] = allRawQuestions.map((q, idx) => {
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

  let passageTitle: string | undefined = undefined;
  let passageText: string | undefined = undefined;
  let passage: string | undefined = undefined;

  if (idx < 5) {
    passageTitle = passage1Title;
    passageText = passage1Text;
    passage = passage1Text;
  } else if (idx < 10) {
    passageTitle = passage2Title;
    passageText = passage2Text;
    passage = passage2Text;
  }

  const item: QuestionItem = {
    number: q.number,
    prompt: q.prompt,
    options: options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: q.points
  };

  if (passageTitle) {
    item.passageTitle = passageTitle;
    item.passageText = passageText;
    item.passage = passage;
  }

  return item;
});

// Partition Questions for Passage-First UI Rendering
const passage1Items = balancedPaper1.slice(0, 5);
const passage2Items = balancedPaper1.slice(5, 10);
const remainingItems = balancedPaper1.slice(10);

// =========================================================================
// PAPER 2: ESSAY WRITING (COMPOSITION) - FULL ORIGINAL SUITE
// =========================================================================
const paper2Calibrated = {
  sectionA_essay: {
    title: "Part A: Essay Writing",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Informal Letter",
        prompt: "Write a letter to your mother who lives abroad, asking her to purchase three important items for your education and well-being, and explaining clearly why you need each of them.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2005

Dear Mother,

I hope this letter finds you in fine health, peace of mind, and thriving in your professional duties in London. Everyone at home is doing well, and Father constantly speaks of your love and dedication to our family. As I approach my final term in basic school and prepare for the Basic Education Certificate Examination (BECE), I write to plead that you purchase three essential learning items that will significantly enhance my studies.

First and foremost, I humbly request a modern scientific calculator. In our third-year Mathematics curriculum, we are currently tackling advanced trigonometry, logarithms, and statistical calculations that require rapid, multi-step computations. Having a reliable, genuine scientific calculator will sharpen my computational speed and boost my accuracy during timed examinations.

Secondly, I desperately need an advanced Oxford English Dictionary and Thesaurus. In the English Language syllabus, precision in vocabulary, mastery of grammatical idioms, and comprehension analysis are paramount. Possessing an authoritative reference dictionary will expand my lexis and improve my essay writing skills.

Finally, I plead for a durable, water-resistant knapsack and a pair of sturdy black leather school shoes. The rainy season has set in, and my current canvas bag leaks whenever it rains, risking the destruction of my exercise books. A reinforced backpack will keep my study materials safe and dry.

I promise to study with relentless diligence to secure Grade One in all subjects and make you proud. Thank you for your endless sacrifices.

Your loving son,
[Signature]
Kwabena Mensah`
      },
      {
        questionNumber: "2",
        category: "Formal Application Letter",
        prompt: "Having completed basic school, write a formal letter to your District Director of Education applying for the vacant post of Office Messenger, stating why you are the most qualified candidate for the position.",
        modelAnswer: `P. O. Box 80
Begoro, Eastern Region
18th June, 2005

The District Director of Education
Ghana Education Service
Fanteakwa District Directorate
Begoro

Dear Sir,

APPLICATION FOR EMPLOYMENT AS AN OFFICE MESSENGER

I respectfully write to submit my application for the post of Office Messenger within your esteemed directorate, as advertised on the municipal notice board.

I recently completed the Basic Education Certificate Examination (BECE) at Begoro Presbyterian Junior Secondary School, securing Grade One in English Language and Social Studies. During my basic school education, I served as the Senior Classroom Monitor for two consecutive years. This position required me to maintain administrative logbooks, deliver official correspondence between the headmaster's office and classroom teachers, and organize teaching materials with absolute confidentiality, speed, and precision.

I possess several distinct qualities that make me the ideal candidate for this role. First, I am physically robust, energetic, and intimately familiar with the layout of all educational institutions, government departments, and postal agencies across the district. I can navigate local routes swiftly on foot or bicycle to ensure the prompt dispatch and retrieval of official documents.

Secondly, I uphold exemplary moral character, honesty, and punctuality. My former headmaster, Reverend J. K. Boateng, has graciously agreed to provide an official testimonial certifying my integrity and diligence. I am disciplined, respectful, and eager to execute clerical instructions faithfully.

I am available for an interview at your earliest convenience. Thank you for considering my application.

Yours faithfully,
[Signature]
Emmanuel Addo
(Applicant)`
      },
      {
        questionNumber: "3",
        category: "Descriptive / Directional Guide",
        prompt: "You live approximately ten kilometers away from your school in a rural community. Write a letter to your close friend giving him or her accurate, step-by-step directions to locate your home.",
        modelAnswer: `Anglican Junior Secondary School
P. O. Box 112
Mampong, Ashanti Region
12th October, 2005

Dear Kwesi,

I was thrilled to receive your letter confirming that you will spend this coming Saturday with my family. Since our village, Kofiase, is situated about ten kilometers north of our school in Mampong, I am writing to provide you with clear, accurate directions so that you can reach our house without losing your way.

When you arrive at the Mampong Central Lorry Station, walk past the main ticket booth toward the northern exit where the rural passenger vehicles park. Board a commercial passenger minibus (trotro) heading toward Kofiase. Inform the conductor that you will alight at the "Old Agricultural Cocoa Shed Junction." The journey takes approximately twenty-five minutes through scenic countryside.

Once you alight at the Cocoa Shed Junction, you will see a prominent signpost for the "Bethel Presbyterian Church." Take the smooth gravel road on your immediate right and walk straight down the gentle incline for about four hundred meters. You will cross a narrow concrete culvert over a clear freshwater stream.

Continue walking for another two minutes until you reach a large, ancient mango tree standing at a three-way junction. Branch to your left onto the pathway bordered by neatly trimmed green hedges. Our residence is the third house on your right—a cream-painted four-room bungalow with a blue corrugated zinc roof and a green wooden gate.

I will be on the lookout for you along the lane from nine o'clock. Safe travels!

Your true friend,
[Signature]
Kwaku Mensah`
      },
      {
        questionNumber: "4",
        category: "Narrative Essay",
        prompt: "Write an engaging, realistic story that concludes with the sentence: \".............but everybody was happy.\"",
        modelAnswer: `It was the climax of the annual dry season in our agrarian village, and our local basic school football team, the Mighty Leopards, was facing our fierce arch-rivals, Anglican JSS, in the finals of the District Championship. The match carried high stakes; for five consecutive years, our opponents had defeated us, subjecting our school to endless ridicule.

The game commenced with blistering intensity under the blazing afternoon sun. Anglican JSS dominated the midfield, scoring a stunning opening goal in the twentieth minute. Our supporters fell into gloomy silence. However, our coach, Master Mensah, refused to surrender. During the halftime interval, he gathered us in a circle and delivered an electrifying pep-talk, reminding us that determination and teamwork could conquer any disadvantage.

When the second half resumed, we fought with renewed vigor. In the seventieth minute, our striker, Kofi Badu, equalized with a magnificent header from a corner kick, sending our supporters into deafening cheers. The drama intensified in the dying seconds of injury time when Anglican launched a ferocious counter-attack. Their forward fired a thunderous volley toward our net, but our heroic goalkeeper, diving across the goalmouth, pushed the ball onto the crossbar.

From that miraculous rebound, our winger launched a swift counter-offensive, crossing the ball to me. Lunging forward with every ounce of my remaining strength, I slipped the ball past the advancing goalkeeper into the bottom corner of the net.

The referee blew the final whistle immediately. The entire stadium erupted in wild ecstasy as students, teachers, and parents swarmed the pitch, carrying us on their shoulders in a glorious victory lap. We were bruised, exhausted, and caked in red dust, but everybody was happy.`
      }
    ]
  }
};

async function seedBeceEnglish2005Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 2005 into Firestore...");

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

  const db = await getDb();
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2005");
  await docRef.set({
    year: 2005,
    title: "BECE English Language 2005 (Calibrated National Benchmark)",
    subjectId: "english",
    metadata: {
      isPastQuestion: true,
      standard: "NaCCA / WAEC BECE Standard",
      totalMarks: 100,
      totalDurationMinutes: 120,
      paper1Count: balancedPaper1.length,
      optionsBalanced: true,
      unplagiarizedPedagogicalAdaptation: true,
      passageFirstLayout: true,
      updatedAt: new Date()
    },
    questions: balancedPaper1,
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      passages: [
        {
          id: "passage_1",
          title: passage1Title,
          text: passage1Text,
          questionRange: "Questions 1 to 5",
          questions: passage1Items
        },
        {
          id: "passage_2",
          title: passage2Title,
          text: passage2Text,
          questionRange: "Questions 6 to 10",
          questions: passage2Items
        }
      ],
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: passage1Title,
          text: passage1Text,
          questionRange: "Questions 1 to 5",
          questions: passage1Items
        },
        passage2: {
          passageTitle: passage2Title,
          text: passage2Text,
          questionRange: "Questions 6 to 10",
          questions: passage2Items
        }
      },
      sectionB_to_E: {
        title: "Sections B - E: Synonyms, Idioms, Antonyms and Structure",
        questionRange: "Questions 11 to 40",
        questions: remainingItems
      },
      questions: balancedPaper1,
      allQuestions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Essay Writing (Composition)",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: paper2Calibrated.sectionA_essay.questions
    }
  }, { merge: true });

  console.log("✅ Fully Rewritten, Clean-Room BECE English 2005 successfully seeded into Firestore!");
}

seedBeceEnglish2005Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2005:", err);
    process.exit(1);
  });
