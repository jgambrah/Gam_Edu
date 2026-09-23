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
// ISOMORPHIC PASSAGE I: COURTSHIP AT THE STREAM (CALIBRATED ORIGINAL)
// =========================================================================
const passage1Text = `Kofi and his companion, Yaw, strolled to a secluded bend along the bush path where the footway crossed a clear, shallow stream. Several women from the village were washing clothes on flat stones, while others bathed in the cool water downstream. They teased Kofi with good-natured laughter, for his presence at that particular hour was an open secret. Before long, Mansa came into view, balancing an earthen bowl filled with sweet mangoes and cassava on her head.

"Greetings, Kofi," she remarked, pretending not to understand why he lingered there with his trusted friend.

"Greetings, Mansa. What supplies did you procure from the market?"

"A few ripe fruits for our evening meal," she answered softly.

"Set the bowl down, Mansa," Kofi declared, stepping forward with a decisive smile. "Yaw will convey the provisions for you. The hour has arrived for us to leave together and seal our marriage."

Yaw promptly took charge of the basket. Kofi took Mansa firmly by the hand and announced, "We are departing for my uncle's compound in the neighboring settlement."

As they began their journey, Mansa turned toward the gathered women and feigned distress with hands raised in the air. "Kofi is carrying me away against my wishes! What will become of me?" In this theatrical manner, according to the ancient courtship custom of the clan, Mansa ritually submitted to her abductor.`;

const passage1Questions = [
  {
    number: 1,
    prompt: "According to Passage I, why did Kofi station himself near the stream crossing?",
    options: [
      "He intended to cross the water to purchase farm produce",
      "He went there to bathe in the cool stream with his companion",
      "He was monitoring the village women washing their clothes",
      "He was waiting to intercept and formally elope with Mansa"
    ],
    correctAnswer: "He was waiting to intercept and formally elope with Mansa",
    hint: "Reread the opening paragraphs: Kofi and Yaw waited specifically for Mansa to arrive so they could go off together.",
    workedSolution: "The narrative explains that Kofi waited at the stream path specifically to carry out the customary courtship ritual of eloping with Mansa.",
    points: 1
  },
  {
    number: 2,
    prompt: "In Passage I, how did Mansa react publicly when Kofi took her hand to lead her away?",
    options: [
      "She put on a theatrical display of helplessness and panic",
      "She angrily scolded the women washing in the stream",
      "She dropped her provisions and bolted into the deep forest",
      "She wept with genuine agony and terror"
    ],
    correctAnswer: "She put on a theatrical display of helplessness and panic",
    hint: "Look at the final paragraph: she turned to the women and feigned distress.",
    workedSolution: "Mansa conformed to traditional custom by feigning distress and pretending she was being taken away against her will.",
    points: 1
  },
  {
    number: 3,
    prompt: "Which of the following statements is NOT true according to Passage I?",
    options: [
      "The women washing clothes joked with Kofi at the stream",
      "Yaw held Mansa's hand while leading her to the next village",
      "The washing women were fully aware of Kofi's intentions",
      "Kofi waited beside the stream for some time before Mansa arrived"
    ],
    correctAnswer: "Yaw held Mansa's hand while leading her to the next village",
    hint: "Paragraph five specifies that Yaw carried the basket; it was Kofi who held Mansa's hand.",
    workedSolution: "The text states that Yaw carried the bowl of fruits, while Kofi held Mansa's hand. Stating that Yaw held her hand is false.",
    points: 1
  },
  {
    number: 4,
    prompt: "In Passage I, the phrase 'pretending not to understand' means that Mansa was ............",
    options: [
      "completely confused about what steps to take next",
      "behaving courteously after discovering an unexpected secret",
      "acting as though everyone in the village had planned the meeting",
      "acting deliberately as if she were unaware of the true situation"
    ],
    correctAnswer: "acting deliberately as if she were unaware of the true situation",
    hint: "'Pretending not to know' means feigning total ignorance.",
    workedSolution: "The expression means feigning ignorance or putting on an act that one does not know what is going on.",
    points: 1
  },
  {
    number: 5,
    prompt: "In Passage I, the expression 'feigned distress' indicates that Mansa ............",
    options: [
      "collapsed unconscious upon noticing the washing women",
      "simulated pain, anxiety, and sorrow for the sake of custom",
      "became violently hungry upon viewing the fruits",
      "tripped and fell into the stream bed"
    ],
    correctAnswer: "simulated pain, anxiety, and sorrow for the sake of custom",
    hint: "'Feigned' means pretended or simulated; 'distress' denotes suffering or upset.",
    workedSolution: "'Feigned distress' means putting on a false appearance of sorrow or panic to satisfy customary theatrical wedding expectations.",
    points: 1
  },
  {
    number: 6,
    prompt: "In the cultural context of Passage I, the word 'abductor' refers to ............",
    options: [
      "a convicted property thief",
      "a violent armed highwayman",
      "a bandit fleeing from the authorities",
      "a suitor conducting a traditional capture of his bride"
    ],
    correctAnswer: "a suitor conducting a traditional capture of his bride",
    hint: "In this courtship ritual, the 'abduction' is a consensual, customary marriage practice.",
    workedSolution: "In this traditional marriage setting, 'abductor' refers to the prospective husband carrying out the customary, staged capture of his consenting bride.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: NUTRITION AND DIETARY TRADITIONS (CALIBRATED)
// =========================================================================
const passage2Text = `Beyond dietary items that merely provide our bodies with quick calories, human beings require essential organic nutrients known as proteins to promote physical growth and to repair and sustain muscular strength once we attain adulthood. High-value proteins are found in fish, meat, eggs, milk, legumes, and to a much smaller degree in cereal grains such as sorghum, millet, and polished rice.

Infants nourished exclusively on starchy root tubers like cassava and cocoyam will inevitably suffer stunted growth. Deprived of essential amino acids, they often contract severe nutritional diseases and succumb to early mortality, whereas children who regularly receive modest portions of milk, eggs, or fish develop robust immunity and thrive.

Nevertheless, commercial dairy milk remains costly in several developing communities, and widespread traditional superstitions continue to surround eggs. Some village elders stubbornly insist that feeding eggs to toddlers turns them into chronic liars. This belief is entirely groundless. Eggs possess no moral power to produce truthfulness or falsehood in human behavior; they are simply wholesome food that provides the building blocks for physical development. Similarly, the ancient taboo claiming that boys who eat meat will grow into thieves is a harmful myth. Both fallacies are backward traditions passed down through generations without scientific basis. An enlightened mother who desires to raise vigorous, healthy children must resolutely abandon such taboos.`;

const passage2Questions = [
  {
    number: 7,
    prompt: "According to Passage II, what is the primary role of proteins in human biological health?",
    options: [
      "They rapidly satisfy sudden hunger pangs",
      "They stimulate healthy physical growth and maintain bodily strength",
      "They produce excess fat deposits beneath the skin",
      "They provide the body's sole source of quick energy"
    ],
    correctAnswer: "They stimulate healthy physical growth and maintain bodily strength",
    hint: "Reread paragraph one: 'proteins to promote physical growth and to repair and sustain muscular strength...'",
    workedSolution: "The passage notes that proteins are critical for building body tissues during childhood and sustaining muscular strength into adulthood.",
    points: 1
  },
  {
    number: 8,
    prompt: "Which of the following assertions is NOT true according to Passage II?",
    options: [
      "Children ought to be nourished exclusively on starchy root crops",
      "Certain village elders falsely claim that eating meat turns boys into thieves",
      "Children who consume eggs and milk regularly grow well and build immunity",
      "An enlightened parent must discard unfounded nutritional taboos"
    ],
    correctAnswer: "Children ought to be nourished exclusively on starchy root crops",
    hint: "Paragraph two explicitly warns that a diet composed only of roots causes stunted growth and illness.",
    workedSolution: "The text warns against feeding children exclusively on starchy roots because it causes malnutrition; claiming they should eat only roots is false.",
    points: 1
  },
  {
    number: 9,
    prompt: "In Passage II, the observation that dairy milk is 'costly' means that it ............",
    options: [
      "is remarkably sweet and flavorful",
      "demands a high amount of money to purchase",
      "is excessively scarce in rural markets",
      "is chemically potent in flavor"
    ],
    correctAnswer: "demands a high amount of money to purchase",
    hint: "'Costly' is synonymous with expensive; requiring substantial monetary expenditure.",
    workedSolution: "'Costly' means expensive; dairy milk requires more money than low-income families can easily afford.",
    points: 1
  },
  {
    number: 10,
    prompt: "According to Passage II, what grave condition affects toddlers who are deprived of dietary protein?",
    options: [
      "They grow into dishonest adults",
      "They invariably develop into petty thieves",
      "Their growth is severely stunted and they fall critically ill",
      "They become exceptionally loyal to ancestral traditions"
    ],
    correctAnswer: "Their growth is severely stunted and they fall critically ill",
    hint: "Check paragraph two: children fed only on starchy roots stop growing, get sick, and often die.",
    workedSolution: "Deprivation of protein leads to stunted physical development, severe deficiency diseases, and life-threatening illnesses.",
    points: 1
  },
  {
    number: 11,
    prompt: "What explicit guidance does the author offer to mothers regarding dietary superstitions?",
    options: [
      "They must conform strictly to all traditional food taboos",
      "They should reject scientific dietary recommendations",
      "They ought to discard harmful myths that deprive children of eggs and meat",
      "They should consult village elders before introducing new foods"
    ],
    correctAnswer: "They ought to discard harmful myths that deprive children of eggs and meat",
    hint: "Look at the final sentence: the enlightened mother must discard these myths to raise healthy children.",
    workedSolution: "The author explicitly urges mothers to abandon groundless food superstitions and provide their children with nutritious protein sources.",
    points: 1
  }
];

// =========================================================================
// GENERAL SECTIONS B - E: SYNONYMS, IDIOMS, ANTONYMS, STRUCTURE
// (ALL ORIGINAL REWRITES MAPPING TO 1992 TARGETS)
// =========================================================================
const generalQuestions = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (12 - 16) ---
  {
    number: 12,
    prompt: "Auntie Araba serves exceptionally palatable stews at her chop bar.\nChoose the word nearest in meaning to 'palatable'.",
    options: ["costly", "oily", "appetizing", "spiced"],
    correctAnswer: "appetizing",
    hint: "Pleasant, tasty, or savory to eat.",
    workedSolution: "'Palatable' means tasty, pleasant, or delicious to eat; 'appetizing' is its direct synonym.",
    points: 1
  },
  {
    number: 13,
    prompt: "The orphaned boy was brought up by a remarkably strict disciplinarian.\nChoose the word nearest in meaning to 'brought up'.",
    options: ["rescued", "reared", "protected", "mentored"],
    correctAnswer: "reared",
    hint: "Nurtured and raised from childhood to maturity.",
    workedSolution: "The phrasal verb 'brought up' means nurtured and raised through childhood; 'reared' is its exact equivalent.",
    points: 1
  },
  {
    number: 14,
    prompt: "The dedicated nurse promised to attend to the ailing patient throughout the night.\nChoose the word nearest in meaning to 'attend to'.",
    options: ["nurse", "examine", "comfort", "medicate"],
    correctAnswer: "nurse",
    hint: "To take care of or minister to someone's medical needs.",
    workedSolution: "'To attend to' an invalid means to care for, look after, or 'nurse' them.",
    points: 1
  },
  {
    number: 15,
    prompt: "The publishing house employs over fifty commercial agents across the region.\nChoose the word nearest in meaning to 'agents'.",
    options: ["distributors", "caretakers", "supervisors", "canvassers"],
    correctAnswer: "distributors",
    hint: "Commercial representatives or authorized vendors.",
    workedSolution: "'Agents' in commercial trade refers to accredited dealers, vendors, or 'distributors'.",
    points: 1
  },
  {
    number: 16,
    prompt: "Commercial drivers are required to obey all municipal speed-limit regulations.\nChoose the word nearest in meaning to 'obey'.",
    options: ["comprehend", "verify", "acknowledge", "comply with"],
    correctAnswer: "comply with",
    hint: "To follow, observe, or conform to an established rule.",
    workedSolution: "'To obey' a rule or statute means to follow, observe, or 'comply with' it.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (17 - 21) ---
  {
    number: 17,
    prompt: "With rising utility tariffs, many low-income artisans struggle to make ends meet. This means they find it difficult to ............",
    options: [
      "operate two commercial workshops at once",
      "reconcile labor disputes with landlords",
      "live within their financial earnings",
      "provide banquet meals for their extended families"
    ],
    correctAnswer: "live within their financial earnings",
    hint: "Having barely enough income to cover necessary living expenses.",
    workedSolution: "The idiom 'to make ends meet' means to earn just enough money to pay for one's essential living costs.",
    points: 1
  },
  {
    number: 18,
    prompt: "Since leaving the correctional facility, the youth has turned over a new leaf. This means he has ............",
    options: [
      "devised cleverer methods of stealing",
      "taken up landscaping and horticulture",
      "reformed his conduct and adopted honest habits",
      "become even more defiant toward authority"
    ],
    correctAnswer: "reformed his conduct and adopted honest habits",
    hint: "Starting afresh with improved moral behavior.",
    workedSolution: "The idiom 'to turn over a new leaf' means to abandon bad habits and reform one's conduct for the better.",
    points: 1
  },
  {
    number: 19,
    prompt: "When the anti-smuggling patrol raided the warehouse, all the suspects took to their heels. This means the suspects ............",
    options: [
      "marched boldly in the stormy weather",
      "froze in terror and surrendered quietly",
      "fled rapidly in flight to escape arrest",
      "scuffled with the officers on the floor"
    ],
    correctAnswer: "fled rapidly in flight to escape arrest",
    hint: "To run away as fast as possible to escape capture.",
    workedSolution: "The idiom 'to take to one's heels' means to turn and run away in hasty flight.",
    points: 1
  },
  {
    number: 20,
    prompt: "Kweku is in two minds about accepting the overseas employment offer. This means that Kweku ............",
    options: [
      "remains undecided and hesitant between choices",
      "has already drafted his formal acceptance letter",
      "has resolutely declined the appointment",
      "has formally resigned his previous position"
    ],
    correctAnswer: "remains undecided and hesitant between choices",
    hint: "Torn between two options; not yet resolved.",
    workedSolution: "The idiom 'to be in two minds' means to be undecided, wavering, or uncertain about a course of action.",
    points: 1
  },
  {
    number: 21,
    prompt: "The presiding arbitrator advised the witness not to beat about the bush during cross-examination. This means the witness was urged to ............",
    options: [
      "clear the weeds surrounding the courthouse",
      "avoid accusing innocent bystanders",
      "address the core matter directly without evasion",
      "bring the legal arbitration to a swift close"
    ],
    correctAnswer: "address the core matter directly without evasion",
    hint: "To avoid beating about the bush means going straight to the point.",
    workedSolution: "'To beat about the bush' means speaking evasively. Being advised not to do so means speaking directly to the point.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (22 - 26) ---
  {
    number: 22,
    prompt: "While our uncle seldom attends town meetings, his younger brother attends ...... .\nChoose the word most nearly opposite in meaning to 'seldom'.",
    options: ["never", "frequently", "infrequently", "barely"],
    correctAnswer: "frequently",
    hint: "'Seldom' means rarely. What word means happening very often?",
    workedSolution: "'Seldom' means rarely or almost never. Its direct antonym regarding frequency is 'frequently' (often).",
    points: 1
  },
  {
    number: 23,
    prompt: "The headmaster was harsh on the unruly truant, but remarkably ...... the repentant junior pupil.\nChoose the phrase most nearly opposite in meaning to 'harsh on'.",
    options: ["indifferent to", "lenient towards", "cautious with", "antagonistic to"],
    correctAnswer: "lenient towards",
    hint: "'Harsh' means severely punitive. What phrase denotes mercy and mildness in discipline?",
    workedSolution: "'Harsh' denotes severe discipline. Its direct antonym in disciplinary contexts is 'lenient towards' (mild, merciful, or tolerant).",
    points: 1
  },
  {
    number: 24,
    prompt: "The currency forger was convicted for printing counterfeit banknotes, while the central bank issues ...... currency.\nChoose the word most nearly opposite in meaning to 'counterfeit'.",
    options: ["recent", "valuable", "certified", "authentic"],
    correctAnswer: "authentic",
    hint: "'Counterfeit' means forged or fake. What word denotes genuine or real currency?",
    workedSolution: "'Counterfeit' means forged or fake. Its direct antonym in commercial currency is 'authentic' (or genuine).",
    points: 1
  },
  {
    number: 25,
    prompt: "The wrestler had a stout and heavy physical frame, whereas his sparring partner was exceptionally ...... .\nChoose the word most nearly opposite in meaning to 'stout'.",
    options: ["athletic", "slender", "vigorous", "short"],
    correctAnswer: "slender",
    hint: "'Stout' means thickset or corpulent. Find the word that denotes a lean, thin build.",
    workedSolution: "'Stout' describes a thickset or bulky body build. Its direct physical antonym is 'slender' (lean or thin).",
    points: 1
  },
  {
    number: 26,
    prompt: "While the council agreed to the elder's proposed budget, the rebellious faction ...... it.\nChoose the phrase most nearly opposite in meaning to 'agreed to'.",
    options: ["scorned", "defended", "analyzed", "moderated"],
    correctAnswer: "scorned",
    hint: "'Agreed to' implies respectful acceptance. Find the word denoting rejection with contempt.",
    workedSolution: "'Agreed to' denotes acceptance and approval. In this contrast of responses, its antonym is 'scorned' (derided, rejected with contempt).",
    points: 1
  },

  // --- SECTION E: QUESTION TAGS & STRUCTURE (27 - 40) ---
  {
    number: 27,
    prompt: "Assist the elderly market woman with her load, ......?",
    options: ["will you", "must you", "can't you", "won't you"],
    correctAnswer: "will you",
    hint: "An imperative sentence expressing a polite request takes the willingness tag 'will you?'.",
    workedSolution: "Imperative sentences requesting assistance or cooperation take 'will you?' (or 'won't you?') as their standard question tag.",
    points: 1
  },
  {
    number: 28,
    prompt: "Kwame, you are accompanying your father to the farm tomorrow, ......?",
    options: ["isn't it", "aren't you", "won't you", "don't you"],
    correctAnswer: "aren't you",
    hint: "An affirmative present continuous clause with 'are' and subject 'you' takes the negative tag 'aren't you?'.",
    workedSolution: "The main clause has an affirmative auxiliary ('are') with subject 'you'. The corresponding question tag must be negative: 'aren't you?'.",
    points: 1
  },
  {
    number: 29,
    prompt: "If Efua had recognized the danger she wouldn't have walked there alone, ......?",
    options: ["wasn't it", "hadn't she", "did she", "would she"],
    correctAnswer: "would she",
    hint: "The main clause contains the negative conditional modal 'wouldn't', requiring an affirmative tag.",
    workedSolution: "Question tags echo the finite auxiliary of the main clause. Negative 'wouldn't' pairs with the affirmative tag: 'would she?'.",
    points: 1
  },
  {
    number: 30,
    prompt: "She recites poetry with extraordinary passion, ......?",
    options: ["not so", "can't she", "doesn't she", "isn't it"],
    correctAnswer: "doesn't she",
    hint: "The affirmative simple present verb 'recites' with subject 'she' takes a negative tag formed with 'does'.",
    workedSolution: "The main clause has an affirmative simple present verb ('recites') with third-person singular subject 'she'. The tag must be 'doesn't she?'.",
    points: 1
  },
  {
    number: 31,
    prompt: "Disciplined basic school candidates study diligently, ......?",
    options: ["don't they", "shouldn't they", "can't they", "haven't they"],
    correctAnswer: "don't they",
    hint: "The affirmative simple present verb 'study' with plural subject 'candidates' takes a negative tag with 'do'.",
    workedSolution: "The main clause has an affirmative present simple verb ('study') with plural subject ('candidates' -> 'they'). The tag is 'don't they?'.",
    points: 1
  },
  {
    number: 32,
    prompt: "The divisional chief, together with his royal elders, ...... arriving at the durbar pavilion.",
    options: ["is", "are", "were", "have been"],
    correctAnswer: "is",
    hint: "Parenthetical additions introduced by 'together with' or 'with' do not pluralize the singular subject.",
    workedSolution: "Parenthetical phrases like 'together with his royal elders' do not alter the grammatical number of the subject 'The divisional chief', taking singular 'is'.",
    points: 1
  },
  {
    number: 33,
    prompt: "Responsible leaders always strive to live up ...... their ethical commitments.",
    options: ["by", "to", "for", "with"],
    correctAnswer: "to",
    hint: "Identify the terminal preposition in the three-word phrasal verb 'to live up to'.",
    workedSolution: "The phrasal verb 'to live up to' means to fulfill expectations or standards.",
    points: 1
  },
  {
    number: 34,
    prompt: "The municipal soccer finals have been put ...... until next Saturday.",
    options: ["in", "out", "off", "away"],
    correctAnswer: "off",
    hint: "Identify the phrasal verb meaning to defer or postpone an event.",
    workedSolution: "The phrasal verb 'to put off' means to postpone or delay an event to a future time.",
    points: 1
  },
  {
    number: 35,
    prompt: "These days, several junior pupils are not very keen ...... practicing algebra.",
    options: ["with", "of", "about", "on"],
    correctAnswer: "on",
    hint: "Identify the preposition that regularly collocates with the adjective 'keen'.",
    workedSolution: "In standard English grammar, the adjective 'keen' takes the preposition 'on' ('keen on practicing').",
    points: 1
  },
  {
    number: 36,
    prompt: "When the headmaster inspected the dormitory, Kwame ...... nowhere to be seen.",
    options: ["will be", "had been", "was", "would have been"],
    correctAnswer: "was",
    hint: "Sequence of past narrative tenses: 'When the headmaster inspected...' requires the simple past copula.",
    workedSolution: "In a simple past narrative setting ('When the headmaster inspected...'), the state of being absent takes the simple past indicative copula 'was'.",
    points: 1
  },
  {
    number: 37,
    prompt: "The boys insisted that the football jerseys on the bench were rightfully ......",
    options: ["his", "theirs", "their's", "theirs'"],
    correctAnswer: "theirs",
    hint: "Absolute possessive pronouns never take an apostrophe.",
    workedSolution: "'Theirs' is the absolute third-person plural possessive pronoun and never takes an apostrophe.",
    points: 1
  },
  {
    number: 38,
    prompt: "Unless the contractor completes the road by Friday, we ...... all be penalized.",
    options: ["will", "shall", "should", "would"],
    correctAnswer: "shall",
    hint: "In formal British/Ghanaian English, first-person plural 'we' expresses future consequence with 'shall'.",
    workedSolution: "In prescriptive formal English, 'shall' is used with first-person subjects ('we' / 'I') to express future inevitability after a conditional clause.",
    points: 1
  },
  {
    number: 39,
    prompt: "The school siren will sound ...... the next ten minutes.",
    options: ["between", "under", "from within", "within"],
    correctAnswer: "within",
    hint: "Preposition meaning before the end of a stated duration of time.",
    workedSolution: "'Within' is the temporal preposition indicating inside the limits of a given time period ('within the next ten minutes').",
    points: 1
  },
  {
    number: 40,
    prompt: "The torrential seasonal downpours have ...... unusually early this year.",
    options: ["set in", "set out", "set up", "set on"],
    correctAnswer: "set in",
    hint: "Identify the phrasal verb meaning to begin and become established (used of seasons or weather).",
    workedSolution: "The phrasal verb 'to set in' is used of weather patterns or seasons to mean they have begun and are established.",
    points: 1
  }
];

// Combine all raw items
const allRawQuestions = [
  ...passage1Questions,
  ...passage2Questions,
  ...generalQuestions
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

const assignedTargetIndices = seedShuffle(targetKeys, 199202);

// Attach Passage I and Passage II directly to questions 1-11 so that
// the passage ALWAYS comes first before any question is displayed!
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

  const qNum = q.number;
  let passageTitle: string | undefined = undefined;
  let passageText: string | undefined = undefined;
  let passage: string | undefined = undefined;

  if (qNum >= 1 && qNum <= 6) {
    passageTitle = "Passage I: Courtship at the Stream";
    passageText = passage1Text;
    passage = passage1Text;
  } else if (qNum >= 7 && qNum <= 11) {
    passageTitle = "Passage II: Nutrition and Dietary Traditions";
    passageText = passage2Text;
    passage = passage2Text;
  }

  return {
    number: q.number,
    prompt: q.prompt,
    options: options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: q.points,
    ...(passageTitle ? { passageTitle } : {}),
    ...(passageText ? { passageText } : {}),
    ...(passage ? { passage } : {})
  };
});

// Partition Questions for Passage-First UI Rendering
const passage1Items = balancedPaper1.slice(0, 6);
const passage2Items = balancedPaper1.slice(6, 11);
const remainingItems = balancedPaper1.slice(11);

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
        prompt: "Write a letter to your friend attending another school, describing an exciting inter-schools athletics and sports championship recently held in your district and explaining how your school emerged victorious.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Bekwai, Ashanti Region
12th May, 1992

Dear Kwaku,

I hope this letter finds you in fine health and high spirits in Kumasi. I am writing to share with you the thrilling pageantry and athletic excitement of our annual District Inter-Schools Athletics Championship, which concluded at the Bekwai Municipal Stadium last Friday.

The atmosphere at the stadium was electrifying. Eight basic schools assembled, with spectator stands packed with cheering students waving school banners, beating traditional drums, and blowing horns. Our athletes had trained rigorously for months, and their hard work paid off handsomely.

Our track team dominated the sprint events from the opening heats. Our lead runner, Master Kofi Smith, clinched gold in both the 100-meter and 200-meter sprints, setting a new district record of 11.3 seconds. In field events, our senior girls demonstrated remarkable technique in the high jump and javelin throw, adding two more gold medals to our tally.

The climax of the tournament was the boys' 4x100-meter relay finals. Trailing in third place at the final bend, our anchor runner received the baton, accelerated like a cheetah, and lunged across the finish line inches ahead of our arch-rivals, Anglican JSS. The entire stadium erupted in wild cheers as we carried our runners on our shoulders in a victory lap. Our school emerged as the overall champions, lifting the coveted silver trophy.

It was an unforgettable week of sporting triumph that filled our hearts with immense pride. Please write back and tell me about events in your school.

Your true friend,
[Signature]
Kwabena Mensah`
      },
      {
        questionNumber: "2",
        category: "Formal Letter",
        prompt: "You have been unable to return to school following the reopening date after vacation due to severe illness and family financial constraints. Write a formal letter to your Headmaster explaining your absence and politely requesting permission to report late.",
        modelAnswer: `Presbyterian Junior Secondary School
P. O. Box 80
Begoro, Eastern Region
18th September, 1992

The Headmaster
Presbyterian Junior Secondary School
P. O. Box 80
Begoro

Dear Sir,

EXPLANATION OF PROLONGED ABSENCE AND HUMBLE REQUEST FOR EXTENSION OF REPORTING DATE

I respectfully write to explain the circumstances surrounding my inability to report to school on the official reopening date of 14th September 1992, and to seek your kind permission to resume classes on Monday, 28th September 1992.

Two weeks before school resumed, I fell critically ill with acute typhoid fever complicated by severe malaria. I was admitted to the Begoro District Hospital, where I spent ten days undergoing intensive intravenous therapy. Although the attending physician has discharged me, he placed me on a mandatory two-week convalescence period to regain my physical strength, as I still experience dizziness and fatigue. A formal medical certificate issued by Dr. K. O. Mensah is attached to this letter for your verification.

Furthermore, my prolonged hospitalization drained my parents' modest financial savings. My father, who is a cocoa farmer, is currently harvesting his minor season crop to mobilize funds to settle my outstanding textbook levies and purchase my school supplies.

I am studying my notebooks at home during my recovery to avoid falling behind in my coursework. I assure you that I will report promptly on the requested date and submit all outstanding assignments.

Thank you for your fatherly understanding and consideration.

Yours faithfully,
[Signature]
Emmanuel Addo
(Form Two Blue - Index No: 0204010080)`
      },
      {
        questionNumber: "3",
        category: "Descriptive / Disciplinary Report",
        prompt: "You witnessed a violent physical altercation between two of your classmates on the school compound. Your class teacher has instructed you to provide an accurate, objective, and detailed written account of what transpired.",
        modelAnswer: `AN OBJECTIVE ACCOUNT OF THE PHYSICAL ALTERCATION BETWEEN MASTER KOFI DARKO AND MASTER KWAME OSEI

To: The Class Teacher, Mr. J. K. Mensah (JSS Form Two)
From: Francisca Donkor (Class Prefect)
Date: 23rd October, 1992

1. INTRODUCTION
In compliance with your directive, I submit this objective report detailing the physical fight that occurred behind the school technical workshop today, Friday, 23rd October 1992, at approximately 10:15 a.m. during the mid-morning break.

2. GENESIS AND ESCALATION OF THE DISPUTE
The altercation originated from an argument over a missing geometrical mathematical set. Master Kwame Osei discovered that his compass had disappeared from his desk and openly accused Master Kofi Darko of theft. Kofi Darko vehemently denied the accusation and demanded an immediate retraction. However, Kwame Osei repeated the allegation using abusive language, insulting Darko's family.

Enraged by the insult, Kofi Darko shoved Kwame Osei against the wooden workshop partition. Kwame retaliated by striking Darko across the face with his fist. A violent fistfight ensued, attracting a large crowd of cheering students who formed a tight ring around them instead of separating the combatants.

3. PHYSICAL CASUALTIES AND INTERVENTION
During the struggle, Kofi Darko picked up a broken piece of lumber from the carpentry refuse pile and struck Kwame on his left shoulder, inflicting a deep abrasion. Kwame sustained a swollen left eye and bleeding lips, while Darko had his school uniform torn to shreds.

Hearing the commotion, the senior prefect and I forced our way through the crowd, restrained both boys, and escorted the bleeding Kwame Osei to the school dispensary for first-aid treatment.

4. CONCLUSION
Both students violated school rules against verbal harassment, violence, and weapon usage. I recommend that the matter be referred to the Disciplinary Committee for appropriate sanctions to maintain order.

Respectfully submitted.`
      },
      {
        questionNumber: "4",
        category: "Article for Publication",
        prompt: "Write a persuasive article for publication in a national daily newspaper highlighting at least two major socio-economic challenges facing your community and suggesting practical solutions to address them.",
        modelAnswer: `CHRONIC WATER SHORTAGE AND YOUTH UNEMPLOYMENT: A CALL FOR ACTION IN BEGORO
By Samuel K. Boateng, Begoro

In contemporary Ghana, the socio-economic advancement of our rural communities is the bedrock upon which national prosperity rests. Yet, a close examination of Begoro in the Fanteakwa District reveals two chronic, crippling challenges that demand urgent intervention: the acute scarcity of potable drinking water and rising youth unemployment.

First and foremost, our township is crippled by a perennial water crisis. For over eight months, municipal taps have run completely dry due to siltation at the primary water treatment plant and broken distribution mains. Consequently, women and school children walk four kilometers daily to fetch untreated water from contaminated streams shared with grazing livestock. This situation exposes residents to deadly waterborne epidemics like cholera and dysentery, while robbing students of essential morning study hours.

To resolve this crisis, the District Assembly, in partnership with the Community Water and Sanitation Agency, must allocate funds from the District Assembly Common Fund to rehabilitate the municipal pumping station and drill mechanized commercial boreholes equipped with solar-powered overhead storage tanks across electoral areas.

Secondly, youth unemployment has reached alarming proportions. Hundreds of basic and secondary school leavers wander our streets without employable skills, leading to rising petty theft and alcoholism. I suggest that the central government collaborate with traditional authorities to establish an integrated rural vocational training center. Equipping youths with practical carpentry, metal fabrication, and modern agribusiness skills will convert idle hands into productive wealth creators.

The potential of Begoro is immense. Addressing these two bottlenecks will transform our community into a vibrant commercial hub. Let our leaders act now.`
      }
    ]
  }
};

async function seedBeceEnglish1992Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 1992 into Firestore...");

  const db = await getDb();

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_1992");
  await docRef.set({
    year: 1992,
    title: "BECE English Language 1992 (Calibrated National Benchmark)",
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
          title: "Passage I: Courtship at the Stream",
          text: passage1Text,
          questionRange: "Questions 1 to 6"
        },
        {
          id: "passage_2",
          title: "Passage II: Nutrition and Dietary Traditions",
          text: passage2Text,
          questionRange: "Questions 7 to 11"
        }
      ],
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: Courtship at the Stream",
          text: passage1Text,
          questionRange: "Questions 1 to 6",
          questions: passage1Items
        },
        passage2: {
          passageTitle: "Passage II: Nutrition and Dietary Traditions",
          text: passage2Text,
          questionRange: "Questions 7 to 11",
          questions: passage2Items
        }
      },
      sectionB_to_E: {
        title: "Sections B - E: Synonyms, Idioms, Antonyms and Structure",
        questionRange: "Questions 12 to 40",
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

  console.log("✅ Fully Rewritten, Clean-Room BECE English 1992 successfully seeded into Firestore!");
}

seedBeceEnglish1992Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1992:", err);
    process.exit(1);
  });
