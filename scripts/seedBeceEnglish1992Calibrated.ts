import * as dns from 'dns';
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
process.env.GCLOUD_PROJECT = 'gamedu-69888475-f5783';
process.env.GOOGLE_CLOUD_PROJECT = 'gamedu-69888475-f5783';

import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function getDb() {
  const fbAdmin = (admin as any).default || admin;
  try {
    const { OAuth2Client } = req('google-auth-library');
    const { Firestore } = req('@google-cloud/firestore');
    const configPath = 'C:\\Users\\DELL\\.config\\configstore\\firebase-tools.json';
    if (fs.existsSync(configPath)) {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (cfg?.tokens?.access_token) {
        const oauthClient = new OAuth2Client();
        oauthClient.setCredentials({ access_token: cfg.tokens.access_token });
        return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient, ignoreUndefinedProperties: true });
      }
    }
  } catch (e) {
    console.log("Fallback from token config:", e);
  }

  if (!fbAdmin.apps?.length) {
    fbAdmin.initializeApp({ credential: fbAdmin.credential.applicationDefault() });
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

// ==========================================
// PASSAGE I: THE BALINESE COURTSHIP RITUAL
// ==========================================
const passage1Text = `Njoman and Putu then went to a quiet spot on the path where it crossed a small stream. A few women were bathing in the stream; some were washing clothes. They joked with Njoman, for they knew why he was there. Soon they saw Ragini approaching with a basket of fruits and vegetables on her head.

"Hello, Njoman," she said, pretending not to know why he waited there with his best friend. "Hello, Ragini. What did you buy in the market?" "Mostly fruits for rudjaks" (spicy salad). "Wait, Ragini," Njoman said as he stood up. "Putu will carry them for you. It is time for us to go off together and marry." Putu took the basket; Njoman took Ragini by the hand and said, "We shall go to my cousin's house in the next village."

As they were walking off, Ragini turned to the women and feigned distress. "Njoman is taking me away. What can I do?" In this way, according to Balinese tradition, Ragini submitted to her abductor.`;

const passage1QuestionsRaw = [
  {
    number: 1,
    prompt: "In Passage I, why was Njoman waiting patiently beside the stream path?",
    options: [
      "He intended to cross the stream to trade in the market",
      "He went there to bathe in the cool stream water",
      "He was spying on the village women washing clothes",
      "He was waiting to intercept and elope with Ragini"
    ],
    correctAnswer: "He was waiting to intercept and elope with Ragini",
    hint: "Reread paragraph one and two: he waited with his best friend to meet Ragini and take her away to marry.",
    workedSolution: "Njoman waited at the stream specifically to meet Ragini according to their cultural courtship custom of marriage by capture.",
    points: 1
  },
  {
    number: 2,
    prompt: "How did Ragini behave publicly when Njoman took her by the hand in Passage I?",
    options: [
      "She pretended to be deeply distressed and helpless",
      "She spoke angrily and fiercely to the washing women",
      "She abandoned her basket and ran away into the forest",
      "She wept bitterly in genuine agony"
    ],
    correctAnswer: "She pretended to be deeply distressed and helpless",
    hint: "Check the final paragraph: 'Ragini turned to the women and feigned distress. \"Njoman is taking me away. What can I do?\"'",
    workedSolution: "Ragini acted out the required traditional ritual by pretending to be helpless and distressed, although she was willingly eloping.",
    points: 1
  },
  {
    number: 3,
    prompt: "Which of the following statements is NOT true according to Passage I?",
    options: [
      "The washing women teased and joked with Njoman",
      "Putu held Ragini by the hand and led her away",
      "The local women were aware of Njoman's real mission",
      "Njoman waited for a while before Ragini arrived from the market"
    ],
    correctAnswer: "Putu held Ragini by the hand and led her away",
    hint: "Paragraph two states that Putu carried the basket; it was Njoman who took Ragini by the hand.",
    workedSolution: "Putu merely carried her fruit basket; Njoman took her by the hand. Therefore, stating that Putu held her hand is false.",
    points: 1
  },
  {
    number: 4,
    prompt: "In Passage I, the phrase 'pretending not to know' means ............",
    options: [
      "being completely ignorant of what action to take",
      "behaving courteously after discovering a secret",
      "assuming that all spectators understood the situation",
      "acting deliberately as if one were unaware of what was happening"
    ],
    correctAnswer: "acting deliberately as if one were unaware of what was happening",
    hint: "Feigning ignorance; putting on an act that one does not know something.",
    workedSolution: "'Pretending not to know' means feigning ignorance or behaving as though one has no knowledge of an ongoing event.",
    points: 1
  },
  {
    number: 5,
    prompt: "In Passage I, the expression 'feigned distress' means that Ragini ............",
    options: [
      "fainted on the ground upon seeing the village women",
      "pretended to be upset, grieved, and in pain",
      "acted as though she was starving for food",
      "collapsed into the stream with a flushed face"
    ],
    correctAnswer: "pretended to be upset, grieved, and in pain",
    hint: "'Feigned' means simulated or pretended; 'distress' means anxiety or sorrow.",
    workedSolution: "'Feigned distress' means put on a false show of being troubled, grieved, or upset to satisfy traditional wedding theatrics.",
    points: 1
  },
  {
    number: 6,
    prompt: "In the context of the cultural marriage tradition described in Passage I, the word 'abductor' refers to ............",
    options: [
      "a common property thief",
      "a violent highway robber",
      "an airline hijacker",
      "a suitor staging a customary capture of his bride"
    ],
    correctAnswer: "a suitor staging a customary capture of his bride",
    hint: "In this Balinese marriage rite, the groom symbolically captures or takes away his consenting bride.",
    workedSolution: "In this customary context, 'abductor' refers to the groom (Njoman) carrying out the ritualized traditional 'capture' of his bride.",
    points: 1
  }
];

// ==========================================
// PASSAGE II: PROTEIN AND NUTRITIONAL HEALTH
// ==========================================
const passage2Text = `Apart from foods which supply us with energy, we need certain substances called protein to help us grow, and when we are fully grown, to maintain our strength. These proteins are found in meat, fish, eggs, milk, green vegetables and to a much lesser extent in grains like millet, wheat, guinea corn, rice, etc.

Children fed chiefly on roots will, therefore, stop growing. They often get very ill and die while children who are given milk and eggs grow well and live longer.

However, cow milk is expensive in West Africa and in many places there is a wrong tradition about eggs. Some old people say that if eggs are given to children they become liars. This is not true. Eggs do not make children either tell truth or lie. They are simply good food which will help the child to grow well. Also, the tradition that boys become thieves when they eat meat is not true. Both are bad traditions which have been repeated in some villages from one generation to another. So, the intelligent mother who wishes to bring up healthy children must discard them.`;

const passage2QuestionsRaw = [
  {
    number: 7,
    prompt: "According to Passage II, what is the primary physiological function of proteins in the human body?",
    options: [
      "They satisfy hunger cravings instantly",
      "They promote healthy physical growth and sustain bodily strength",
      "They expand body fat reserves",
      "They serve as our sole source of physical energy"
    ],
    correctAnswer: "They promote healthy physical growth and sustain bodily strength",
    hint: "Reread paragraph one: 'protein to help us grow, and when we are fully grown, to maintain our strength.'",
    workedSolution: "The passage notes that proteins are essential for building new body tissues during growth and maintaining muscular strength in adulthood.",
    points: 1
  },
  {
    number: 8,
    prompt: "Which of the following assertions is NOT true according to Passage II?",
    options: [
      "Children should be nourished solely on starchy root crops",
      "Certain village elders falsely claim meat makes boys become thieves",
      "Children who receive balanced portions of milk and eggs thrive and grow well",
      "An enlightened mother must reject harmful cultural food taboos"
    ],
    correctAnswer: "Children should be nourished solely on starchy root crops",
    hint: "Paragraph two explicitly warns that children fed chiefly on roots stop growing, fall ill, and die.",
    workedSolution: "The text warns against feeding children exclusively on starchy roots because it causes malnutrition and death; saying they should eat roots only is false.",
    points: 1
  },
  {
    number: 9,
    prompt: "In Passage II, the statement 'cow milk is expensive' means that it ............",
    options: [
      "is remarkably sweet to taste",
      "costs a high amount of money to purchase",
      "is exclusively white in appearance",
      "is chemically strong"
    ],
    correctAnswer: "costs a high amount of money to purchase",
    hint: "'Expensive' means costing a great deal of money.",
    workedSolution: "'Expensive' denotes high monetary cost; it means cow milk is costly and difficult for poor families to afford.",
    points: 1
  },
  {
    number: 10,
    prompt: "According to Passage II, what grave consequence befalls infants who are deprived of dietary protein?",
    options: [
      "They invariably become habitual liars",
      "They learn criminal thievery",
      "Their physical growth is stunted and they fall severely ill",
      "They preserve ancient ancestral customs"
    ],
    correctAnswer: "Their physical growth is stunted and they fall severely ill",
    hint: "Check paragraph two: children fed only on roots stop growing, become ill, and often die.",
    workedSolution: "Lack of protein leads to stunted growth, deficiency diseases (like kwashiorkor), chronic illness, and high infant mortality.",
    points: 1
  },
  {
    number: 11,
    prompt: "What explicit counsel does the author give to enlightened mothers regarding food taboos?",
    options: [
      "They should abandon scientific nutritional advice",
      "They must conform strictly to all ancestral village taboos",
      "They must discard harmful traditions that deny children eggs and meat",
      "They should preserve all cultural superstitions"
    ],
    correctAnswer: "They must discard harmful traditions that deny children eggs and meat",
    hint: "Look at the final sentence: 'the intelligent mother who wishes to bring up healthy children must discard them.'",
    workedSolution: "The author urges mothers to discard false superstitions that claim eggs produce liars and meat creates thieves, and feed their children nutritious foods.",
    points: 1
  }
];

// ==========================================
// GENERAL LEXIS AND STRUCTURE (12 - 40)
// ==========================================
const generalQuestionsRaw = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (12 - 16) ---
  {
    number: 12,
    prompt: "Adiza's mother prepares exceptionally palatable dishes for festive guests.\nChoose the word nearest in meaning to the underlined word 'palatable'.",
    options: ["expensive", "rich", "tasty", "colourful"],
    correctAnswer: "tasty",
    hint: "Pleasant, delicious, and savory to the taste.",
    workedSolution: "'Palatable' means pleasant-tasting or delicious; 'tasty' is its direct synonym.",
    points: 1
  },
  {
    number: 13,
    prompt: "Sindi was brought up by a very strict foster grandmother in the village.\nChoose the word nearest in meaning to the underlined phrase 'brought up'.",
    options: ["saved", "reared", "born", "taught"],
    correctAnswer: "reared",
    hint: "Raised, cared for, and nurtured from childhood to adulthood.",
    workedSolution: "The phrasal verb 'brought up' means raised, nurtured, or 'reared' to maturity.",
    points: 1
  },
  {
    number: 14,
    prompt: "Janet promised to attend to her ailing mother-in-law throughout the hospital stay.\nChoose the word nearest in meaning to the underlined phrase 'attend to'.",
    options: ["look after", "look at", "look into", "look for"],
    correctAnswer: "look after",
    hint: "To take care of, nurse, or minister to someone's needs.",
    workedSolution: "The phrasal verb 'to attend to' in medical and domestic care means to care for or 'look after' someone.",
    points: 1
  },
  {
    number: 15,
    prompt: "The newspaper printing press retains over a thousand retail agents nationwide.\nChoose the word nearest in meaning to the underlined word 'agents'.",
    options: ["vendors", "caretakers", "deputies", "correspondents"],
    correctAnswer: "vendors",
    hint: "Distributors or authorized commercial sellers of goods.",
    workedSolution: "'Agents' in commercial retail distribution refers to distributors, dealers, or 'vendors'.",
    points: 1
  },
  {
    number: 16,
    prompt: "The police commander instructed all commercial motorists to obey highway safety regulations.\nChoose the word nearest in meaning to the underlined word 'obey'.",
    options: ["understand", "notice", "recognize", "observe"],
    correctAnswer: "observe",
    hint: "To conform to, comply with, or follow established rules.",
    workedSolution: "'To obey' a regulation or law means to comply with or 'observe' it faithfully.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (17 - 21) ---
  {
    number: 17,
    prompt: "During periods of high inflation, many low-income workers struggle to make ends meet. This means they struggle to ............",
    options: [
      "undertake two jobs simultaneously",
      "reconcile labor unions and management",
      "live within their financial income",
      "provide meals for two dependents"
    ],
    correctAnswer: "live within their financial income",
    hint: "Having barely enough money to cover essential living costs.",
    workedSolution: "The idiom 'to make ends meet' means to earn just enough to cover essential living expenses or live within one's income.",
    points: 1
  },
  {
    number: 18,
    prompt: "Since the convict was discharged from prison, he has turned over a new leaf. This means he has ............",
    options: [
      "invented new burglary techniques",
      "begun cultivating ornamental flowers",
      "reformed and changed his behavior for the better",
      "grown even more rebellious"
    ],
    correctAnswer: "reformed and changed his behavior for the better",
    hint: "Beginning anew with improved moral conduct and better habits.",
    workedSolution: "The idiom 'to turn over a new leaf' means to reform one's conduct, renounce bad habits, and start behaving better.",
    points: 1
  },
  {
    number: 19,
    prompt: "When the military detachment stormed the rebel camp, all the insurgents took to their heels. This means the insurgents ............",
    options: [
      "marched boldly in the stormy weather",
      "stood motionless in terror",
      "ran away hastily in flight",
      "danced on their heels"
    ],
    correctAnswer: "ran away hastily in flight",
    hint: "Fleeing rapidly to escape capture or danger.",
    workedSolution: "The idiom 'to take to one's heels' means to turn and run away hastily from danger.",
    points: 1
  },
  {
    number: 20,
    prompt: "Berko is in two minds about resigning from his civil service appointment. This means that Berko ............",
    options: [
      "has not yet made a definitive decision",
      "has already drafted his resignation letter",
      "has firmly resolved not to resign",
      "has officially withdrawn his resignation notice"
    ],
    correctAnswer: "has not yet made a definitive decision",
    hint: "Undecided, vacillating, or torn between two choices.",
    workedSolution: "The idiom 'to be in two minds' means to be undecided, hesitant, or wavering between two conflicting choices.",
    points: 1
  },
  {
    number: 21,
    prompt: "The magistrate advised the witness not to beat about the bush during testimony. This means the witness must ............",
    options: [
      "clear the overgrown weeds",
      "chase culprits into the thicket",
      "go straight to the core point without evasion",
      "conclude the court session quickly"
    ],
    correctAnswer: "go straight to the core point without evasion",
    hint: "Speaking directly to the main matter without wasting time on evasive details.",
    workedSolution: "'To beat about the bush' means to speak evasively. Not doing so means going straight to the core truth.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (22 - 26) ---
  {
    number: 22,
    prompt: "While Uncle Kweku seldom visits the village, his brother comes ...... .",
    options: ["never", "sometimes", "rarely", "nearly"],
    correctAnswer: "sometimes",
    hint: "'Seldom' means rarely or almost never. Find the word denoting occurring at intervals or now and then.",
    workedSolution: "'Seldom' means infrequently or rarely. Its contextual antonym regarding frequency of visits is 'sometimes' (occasionally / at times).",
    points: 1
  },
  {
    number: 23,
    prompt: "The magistrate was harsh on the hardened convict, but remarkably ...... the juvenile offender.",
    options: ["soft to", "lenient with", "mild with", "cruel to"],
    correctAnswer: "lenient with",
    hint: "'Harsh' means severe and punishing. Find the formal judicial collocation meaning merciful or mild in discipline.",
    workedSolution: "'Harsh' means severely punitive. Its direct antonym in judicial sentencing is 'lenient with' (mild, merciful, and tolerant).",
    points: 1
  },
  {
    number: 24,
    prompt: "The counterfeiter was arrested for printing fake currency, while the central bank issues ...... banknotes.",
    options: ["correct", "new", "acceptable", "genuine"],
    correctAnswer: "genuine",
    hint: "'Counterfeit' means forged or fake. Find the word meaning authentic and real.",
    workedSolution: "'Counterfeit' means fraudulent or forged. Its direct monetary antonym is 'genuine' (authentic and real).",
    points: 1
  },
  {
    number: 25,
    prompt: "My uncle was a stout, heavily-built man, whereas his junior brother was remarkably ...... .",
    options: ["handsome", "short", "lean", "ill"],
    correctAnswer: "lean",
    hint: "'Stout' means corpulent, thickset, or fat. Find the word meaning thin and slender.",
    workedSolution: "'Stout' describes a bulky, thickset, or corpulent physical frame. Its direct antonym regarding body build is 'lean' (slender and thin).",
    points: 1
  },
  {
    number: 26,
    prompt: "While the committee agreed to the chairman's proposal, the disgruntled members ...... it.",
    options: ["mocked at", "stood by", "interfered with", "took in"],
    correctAnswer: "mocked at",
    hint: "'Agreed to' means accepted and approved. Find the phrase meaning treated with scorn or rejected with ridicule.",
    workedSolution: "'Agreed to' implies respectful acceptance and approval. In this behavioral contrast, its opposite is 'mocked at' (derided and rejected with scorn).",
    points: 1
  },

  // --- SECTION E: LEXIS AND STRUCTURE (27 - 40) ---
  {
    number: 27,
    prompt: "Assist the needy orphan to settle his tuition fees, ......?",
    options: ["will you", "must you", "can't you", "won't you"],
    correctAnswer: "will you",
    hint: "An imperative sentence expressing a request or directive takes the willingness modal tag 'will you?'.",
    workedSolution: "Imperative sentences requesting action or assistance take 'will you?' (or 'won't you?') as their standard question tag.",
    points: 1
  },
  {
    number: 28,
    prompt: "Kwasi, you are visiting our family farm tomorrow, ......?",
    options: ["isn't it", "aren't you", "won't you", "don't you"],
    correctAnswer: "aren't you",
    hint: "An affirmative present continuous statement with 'are' and subject 'you' takes the negative tag 'aren't you?'.",
    workedSolution: "The main clause is affirmative with auxiliary 'are' and subject 'you'. The corresponding question tag must be negative: 'aren't you?'.",
    points: 1
  },
  {
    number: 29,
    prompt: "If Mary had known the truth she wouldn't have attended the meeting, ......?",
    options: ["wasn't it", "hadn't she", "did she", "would she"],
    correctAnswer: "would she",
    hint: "The main clause contains the negative conditional modal 'wouldn't have', requiring an affirmative tag with 'would'.",
    workedSolution: "Question tags match the finite auxiliary of the main clause. The main clause contains negative 'wouldn't', so its tag must be affirmative: 'would she?'.",
    points: 1
  },
  {
    number: 30,
    prompt: "She dances with such natural elegance, ......?",
    options: ["not so", "can't she", "doesn't she", "isn't it"],
    correctAnswer: "doesn't she",
    hint: "The main verb 'dances' is in the simple present tense with a third-person singular feminine subject.",
    workedSolution: "The affirmative simple present verb 'dances' with subject 'she' requires a negative present tag formed with 'does': 'doesn't she?'.",
    points: 1
  },
  {
    number: 31,
    prompt: "Diligent basic school candidates study hard, ......?",
    options: ["don't they", "shouldn't they", "can't they", "haven't they"],
    correctAnswer: "don't they",
    hint: "The affirmative simple present verb 'study' with plural subject 'candidates' takes a negative tag with 'do'.",
    workedSolution: "The main clause has an affirmative simple present verb ('study') with plural subject ('candidates' -> 'they'). Its tag must be 'don't they?'.",
    points: 1
  },
  {
    number: 32,
    prompt: "The paramount chief, together with his royal linguists, ...... arriving at the durbar ground.",
    options: ["is", "are", "were", "have been"],
    correctAnswer: "is",
    hint: "Parenthetical additions introduced by 'together with' or 'with' do not pluralize the singular subject 'The chief'.",
    workedSolution: "Parenthetical prepositional phrases ('with his linguists') do not alter the grammatical number of the subject. The singular head 'The chief' takes 'is'.",
    points: 1
  },
  {
    number: 33,
    prompt: "Many individuals find it arduous to live up ...... their professed moral ideals.",
    options: ["by", "to", "for", "with"],
    correctAnswer: "to",
    hint: "Identify the final preposition in the three-word phrasal verb 'to live up to'.",
    workedSolution: "The phrasal verb 'to live up to' means to fulfill expectations, standards, or moral principles.",
    points: 1
  },
  {
    number: 34,
    prompt: "The inter-schools athletic championship was put ...... until next term due to heavy rains.",
    options: ["in", "out", "off", "away"],
    correctAnswer: "off",
    hint: "Identify the phrasal verb meaning to postpone or defer to a later date.",
    workedSolution: "The phrasal verb 'to put off' means to postpone or defer an event to a future time.",
    points: 1
  },
  {
    number: 35,
    prompt: "These days, several junior students are not very keen ...... practicing written English.",
    options: ["with", "of", "about", "on"],
    correctAnswer: "on",
    hint: "Identify the preposition that regularly collocates with the adjective 'keen'.",
    workedSolution: "In standard British and Ghanaian English, the adjective 'keen' takes the preposition 'on' ('keen on improving').",
    points: 1
  },
  {
    number: 36,
    prompt: "When the passenger aircraft touched down, Kwame ...... nowhere to be found in the arrival terminal.",
    options: ["will be", "had been", "was", "would have been"],
    correctAnswer: "was",
    hint: "Sequence of past narrative tenses: The past temporal clause 'When the plane arrived' requires the simple past copula.",
    workedSolution: "In a simple past narrative setting ('When the plane arrived...'), the state of being absent is expressed by the simple past copula 'was'.",
    points: 1
  },
  {
    number: 37,
    prompt: "The boarding students testified that the sports kits were rightfully ......",
    options: ["his", "theirs", "their's", "theirs'"],
    correctAnswer: "theirs",
    hint: "Absolute possessive pronouns never take an apostrophe.",
    workedSolution: "'Theirs' is the absolute third-person plural possessive pronoun and never takes an apostrophe. Forms like 'their's' or 'theirs'' are ungrammatical.",
    points: 1
  },
  {
    number: 38,
    prompt: "Unless your guardian reports at the station immediately, we ...... take disciplinary action.",
    options: ["will", "shall", "should", "would"],
    correctAnswer: "shall",
    hint: "First-person plural conditional clause expressing formal determination in the main clause.",
    workedSolution: "In formal prescriptive English, 'shall' is used with first-person subjects ('I' and 'we') to express future inevitability or firm resolution after a conditional clause.",
    points: 1
  },
  {
    number: 39,
    prompt: "The assembly warning bell will chime ...... the next ten minutes.",
    options: ["between", "under", "from within", "within"],
    correctAnswer: "within",
    hint: "Preposition meaning before the end of a specified duration of time.",
    workedSolution: "'Within' is the temporal preposition denoting inside the limits of a specified time span ('within the next ten minutes').",
    points: 1
  },
  {
    number: 40,
    prompt: "The torrential harmattan downpours have ...... unusually early this year.",
    options: ["set in", "set out", "set up", "set on"],
    correctAnswer: "set in",
    hint: "Identify the phrasal verb meaning to begin and seem likely to continue (used of weather, seasons, or disease).",
    workedSolution: "The phrasal verb 'to set in' is used of seasons, weather, or conditions to indicate that they have commenced and are established.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199201);

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

// Partition Questions for Passage-First Rendering
const passage1Questions = balancedPaper1.slice(0, 6);
const passage2Questions = balancedPaper1.slice(6, 11);
const remainingQuestions = balancedPaper1.slice(11);

// ==========================================
// PAPER 2: ESSAY WRITING (COMPOSITION)
// ==========================================
const paper2Calibrated = {
  sectionA_essay: {
    title: "Part A: Essay Writing",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Informal Letter",
        prompt: "Write a letter to your friend attending another school, describing an exciting inter-schools athletics and sports competition that was recently held in your district and explaining how your school performed.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Bekwai, Ashanti Region
12th May, 1992

Dear Kwaku,

I hope this letter finds you in fine health, peace of mind, and studying hard in Kumasi. I am writing to share with you the thrilling pageantry and competitive excitement of our annual District Inter-Schools Athletics Championship, which concluded at the Bekwai Municipal Stadium last Friday.

The atmosphere at the stadium was electrifying. Eight basic schools assembled, with spectator stands filled with cheering students waving school banners, beating traditional drums, and blowing horns. Our athletes had prepared for months, and their hard training paid off handsomely.

Our track team dominated the sprint events from the opening heats. Our lead runner, Master Kofi Smith, clinched gold in both the 100-meter and 200-meter sprints, setting a new district record of 11.3 seconds. In field events, our senior girls demonstrated remarkable skill in the high jump and javelin throw, adding two more gold medals to our tally.

The climax of the tournament was the boys' 4x100-meter relay finals. Trailing in third place at the final bend, our anchor runner received the baton, accelerated like a cheetah, and lunged across the finish line inches ahead of our arch-rivals, Anglican JSS. The entire stadium erupted in wild cheers as we carried our runners on our shoulders in a victory lap. Our school emerged as the overall champions, lifting the coveted silver trophy.

It was an unforgettable week of sporting triumph that filled our hearts with immense pride. Please write back and tell me about events in your school.

Your true friend,
[Signature]
Kwabena Mensah`
      },
      {
        questionNumber: "2",
        category: "Formal Letter",
        prompt: "You have been unable to return to school following the reopening date after vacation due to illness and financial constraints. Write a formal letter to your Headmaster explaining your absence and politely requesting permission to report late.",
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

I respectfully write to explain the circumstances surrounding my inability to report to school on the official reopening date of 14th September 1992, and to seek your permission to resume classes on Monday, 28th September 1992.

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
        prompt: "You witnessed a violent physical fight between two of your classmates on the school compound. Your class teacher has instructed you to provide an accurate, objective, and detailed written account of what transpired.",
        modelAnswer: `AN OBJECTIVE ACCOUNT OF THE PHYSICAL ALTERCATION BETWEEN MASTER KOFI DARKO AND MASTER KWAME OSEI

To: The Class Teacher, Mr. J. K. Mensah (JSS Form Two)
From: Francisca Donkor (Class Prefect)
Date: 23rd October, 1992

1. INTRODUCTION
In compliance with your directive, I submit this objective report detailing the physical fight that occurred behind the school technical workshop today, Friday, 23rd October 1992, at approximately 10:15 a.m. during the mid-morning break.

2. GENESIS AND ESCALATION OF THE DISPUTE
The altercation originated from an argument over a missing geometrical mathematical set. Master Kwame Osei discovered that his compass had disappeared from his desk and openly accused Master Kofi Darko of theft. Kofi Darko vehemently denied the accusation and demanded an immediate retraction. However, Kwame Osei repeated the allegation using abusive language, insulting Darku's family.

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
        prompt: "Write a persuasive article for publication in a national daily newspaper highlighting at least two major socio-economic problems facing your community and suggesting practical solutions to address them.",
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

const flattenedPaper2Questions = [
  ...paper2Calibrated.sectionA_essay.questions.map((q) => ({
    id: `q${q.questionNumber}`,
    questionNumber: q.questionNumber,
    section: "A",
    category: q.category,
    partLabel: `Part A (Question ${q.questionNumber}) - ${q.category}`,
    prompt: q.prompt,
    modelAnswer: q.modelAnswer,
    marks: 30
  }))
];

async function seedBeceEnglish1992Calibrated() {
  console.log("Seeding Calibrated & Passage-First BECE English 1992 into Firestore...");

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
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      // Section A: Passage-First Comprehension Architecture
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: The Balinese Courtship Ritual",
          text: passage1Text,
          questionRange: "Questions 1 to 6",
          questions: passage1Questions
        },
        passage2: {
          passageTitle: "Passage II: Protein and Nutritional Health",
          text: passage2Text,
          questionRange: "Questions 7 to 11",
          questions: passage2Questions
        }
      },
      // Sections B - E: Lexis, Synonyms, Idioms, Antonyms, and Structure
      sectionB_to_E: {
        title: "Sections B - E: Lexis, Idioms, Antonyms and Structure",
        questionRange: "Questions 12 to 40",
        questions: remainingQuestions
      },
      // Complete Flat Sequence for standard computerized test runners
      allQuestions: balancedPaper1,
      questions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Essay Writing (Composition)",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Calibrated & Passage-First BECE English 1992 successfully seeded into Firestore!");
}

seedBeceEnglish1992Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1992:", err);
    process.exit(1);
  });
