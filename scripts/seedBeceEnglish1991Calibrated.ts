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
// ISOMORPHIC PASSAGE I: TOURING THE METROPOLIS (CALIBRATED ORIGINAL)
// =========================================================================
const passage1Text = `Observing the bright, wonder-filled expressions on the faces of his young nephews, Mr. Kwame Antwi overlooked the dull throbbing in his ankles and broke into a warm smile. He had spent the entire morning and early afternoon guiding Kwabena and Kofi, who had traveled from their secluded farming hamlet, through the commercial districts of Kumasi. He took deep satisfaction in seeing their absolute delight. It was only when they finally rested on a shaded stone bench in the municipal public park that he realized just how parched, exhausted, and covered in road dust he truly was.

It had been years since he had undertaken such extensive walking. Like many thriving civil servants, Mr. Antwi had grown accustomed to traveling everywhere in his air-conditioned saloon car, so that day's walking expedition across the city had drained his physical reserves.

"Tell me, boys, what do you make of the regional capital?" he asked them gently.

"Oh, Uncle!" exclaimed Kofi with wide eyes. "It is an astonishing place!"

"I never conceived that any town could be so grand," added Kwabena. "Everything is so magnificent. The dual carriageways are extraordinarily broad, and the administrative edifices are majestic."

"Do not form a lopsided judgment, my boys," Mr. Antwi cautioned with a gentle wave of his hand. "Today you have observed only the polished commercial avenues. There are blighted peripheral suburbs riddled with decaying wooden shacks, congested gutters, and deplorable insanitary conditions. Fortunately, the city council has begun pulling down those hazardous structures to pave way for modern redevelopment."`;

const passage1Questions = [
  {
    number: 1,
    prompt: "According to Passage I, why did Mr. Antwi feel dusty, thirsty, and physically exhausted by afternoon?",
    options: [
      "He had walked all the way from the farming hamlet to bring the boys",
      "He had climbed the top tower of the regional administrative edifice",
      "He had spent long hours walking on foot to guide his nephews through the city",
      "He had personally assisted municipal laborers in clearing roadside debris"
    ],
    correctAnswer: "He had spent long hours walking on foot to guide his nephews through the city",
    hint: "Reread paragraph one and two: he had walked for hours showing them around because he normally drove everywhere.",
    workedSolution: "The narrative explains that Mr. Antwi was exhausted because he spent the entire day walking on foot with his nephews, an exertion he was unaccustomed to.",
    points: 1
  },
  {
    number: 2,
    prompt: "Where did Kwabena and Kofi live prior to their excursion in Passage I?",
    options: [
      "In the commercial quarter of Kumasi",
      "In a secluded rural farming village",
      "Near the stone benches of the public park",
      "In a suburban residential quarter"
    ],
    correctAnswer: "In a secluded rural farming village",
    hint: "Paragraph one notes they had traveled from their 'secluded farming hamlet'.",
    workedSolution: "The text explicitly states that the two young boys resided in a secluded rural farming hamlet before visiting their uncle.",
    points: 1
  },
  {
    number: 3,
    prompt: "In Passage I, the phrase 'Everything is so magnificent' means that the boys found the city to be ............",
    options: [
      "barely tolerable and crowded",
      "grand, majestic, and strikingly impressive",
      "strictly dedicated to political governance",
      "brilliantly painted in bright colors"
    ],
    correctAnswer: "grand, majestic, and strikingly impressive",
    hint: "'Magnificent' denotes splendor, grandeur, and exceptional visual beauty.",
    workedSolution: "'Magnificent' means splendid, grand, or majestically impressive; 'grand, majestic, and strikingly impressive' captures the exact meaning.",
    points: 1
  },
  {
    number: 4,
    prompt: "According to Passage I, what daily transport habit is typical of many prosperous urban professionals?",
    options: [
      "Walking extensive miles through crowded central avenues",
      "Relying on municipal passenger buses for their commutes",
      "Commuting everywhere in private vehicles rather than walking",
      "Resting frequently in landscaped public gardens"
    ],
    correctAnswer: "Commuting everywhere in private vehicles rather than walking",
    hint: "Paragraph two highlights: 'Like many thriving civil servants, Mr. Antwi had grown accustomed to traveling everywhere in his air-conditioned saloon car...'",
    workedSolution: "The author observes that affluent professionals habitually commute in private motorcars and rarely engage in long walking journeys.",
    points: 1
  },
  {
    number: 5,
    prompt: "Which of the following assertions is NOT true according to Passage I?",
    options: [
      "Every single neighborhood across the metropolis is clean and magnificent",
      "Mr. Antwi routinely drives his private automobile for personal transit",
      "Kwabena and Kofi were visiting the regional capital for the very first time",
      "The uncle and his nephews sat down to rest on a park bench"
    ],
    correctAnswer: "Every single neighborhood across the metropolis is clean and magnificent",
    hint: "Notice Mr. Antwi's warning regarding neglected suburbs and decaying shacks.",
    workedSolution: "Mr. Antwi explicitly corrects his nephews by explaining that neglected, unhygienic slums also exist in the city; claiming every neighborhood is magnificent is false.",
    points: 1
  },
  {
    number: 6,
    prompt: "In Passage I, the expression 'insanitary conditions' in the final paragraph refers to an environment that is ............",
    options: [
      "inhabited by mentally disturbed individuals",
      "filthy, unhygienic, and hazardous to public health",
      "subject to extreme atmospheric harmattan haze",
      "completely unfamiliar to visiting travelers"
    ],
    correctAnswer: "filthy, unhygienic, and hazardous to public health",
    hint: "Sanitation relates to hygiene and cleanliness. 'Insanitary' means dirty and disease-breeding.",
    workedSolution: "'Insanitary' describes dirty, unhygienic, and squalid conditions that breed diseases; 'filthy, unhygienic, and hazardous to public health' is the exact equivalent.",
    points: 1
  },
  {
    number: 7,
    prompt: "In Passage I, the word 'demolished' in 'these buildings are being demolished' means that the dilapidated structures are being ............",
    options: [
      "re-roofed with treated timber",
      "freshly whitewashed and repaired",
      "razed and pulled down to the ground",
      "advertised for commercial rental"
    ],
    correctAnswer: "razed and pulled down to the ground",
    hint: "To demolish an old building means to knock it down or tear it apart.",
    workedSolution: "'Demolished' means systematically pulled down, flattened, or razed; 'razed and pulled down to the ground' is its direct meaning.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: HYDROPOWER AND INDUSTRY (CALIBRATED ORIGINAL)
// =========================================================================
const passage2Text = `The engineering marvel of the Akosombo Hydroelectric Scheme and the sprawling inland expanse of Lake Volta enjoy worldwide acclaim. The twin strategic purposes that inspired the construction of the massive dam were the generation of abundant electrical energy and the deployment of that power to smelt high-grade aluminum from domestic bauxite deposits. Because aluminum is an indispensable industrial metal across the globe, the domestic production of both electrical energy and refined metal constitutes a cornerstone of Ghana's industrial economy.

To the uninitiated, generating electric power by blocking an open river basin may appear puzzling, yet numerous hydro dams have been erected globally on identical principles. In engineering practice, a towering reinforced concrete barrier—termed a dam—is thrown across a river gorge at an optimal narrow neck. A deep, extensive artificial reservoir then accumulates behind the barrier wall. Reinforced penstock tunnels are engineered through the base of the dam structure, allowing pressurized water from the lake to rush downward with tremendous force.

This violent hydraulic flow strikes and spins massive subterranean waterwheels known as turbines, which drive heavy generators to produce electrical current. The operational force driving the entire complex is simply the natural weight of falling water, and this raw hydraulic resource costs the operational authority nothing. Nevertheless, the initial capital required to survey the gorge, pour millions of tons of concrete, and install the imported electro-mechanical turbines represents a massive financial outlay.

While gigantic dams have been constructed across various continents, Akosombo ranks among the most formidable. More significantly, the reservoir formed behind its concrete crest remains the largest man-made lake on earth by surface area.`;

const passage2Questions = [
  {
    number: 8,
    prompt: "According to Passage II, what were the two foundational objectives that motivated the construction of the Akosombo Dam?",
    options: [
      "To produce electrical power and utilize that energy to process bauxite into aluminum",
      "To dredge the river bed and extract gold dust from submerged gravel",
      "To establish luxury vacation islands along the river basin",
      "To supply municipal treated tap water exclusively to urban ports"
    ],
    correctAnswer: "To produce electrical power and utilize that energy to process bauxite into aluminum",
    hint: "Check paragraph one: electricity generation and aluminum smelting from bauxite.",
    workedSolution: "The passage explicitly identifies the twin purposes as generating electrical energy and utilizing it to smelt aluminum from bauxite.",
    points: 1
  },
  {
    number: 9,
    prompt: "According to Passage II, what mineral ore serves as the raw material for aluminum smelting?",
    options: ["Limestone", "Bauxite", "Granite", "Bitumen"],
    correctAnswer: "Bauxite",
    hint: "Reread paragraph one: 'smelt high-grade aluminum from domestic bauxite deposits.'",
    workedSolution: "The text identifies 'bauxite' as the primary mineral ore that is refined into aluminum.",
    points: 1
  },
  {
    number: 10,
    prompt: "Across the world, concrete river dams are engineered primarily to ............",
    options: [
      "quarry industrial building stone from submerged gorges",
      "harness pressurized falling water to spin turbines and produce electricity",
      "drain inland marshes for agricultural estate development",
      "provide shallow waterways for recreational boating"
    ],
    correctAnswer: "harness pressurized falling water to spin turbines and produce electricity",
    hint: "Paragraph two details how water rushing through tunnels turns turbines to generate electricity.",
    workedSolution: "Dams are erected to create reservoirs whose rushing hydraulic force drives mechanical turbines to generate electricity.",
    points: 1
  },
  {
    number: 11,
    prompt: "Which of the following statements is NOT true according to Passage II?",
    options: [
      "The physical concrete wall at Akosombo is the single largest dam wall in existence",
      "Both aluminum smelting and electrical generation yield immense economic benefits to Ghana",
      "Pressurized reservoir water surges through engineered penstock tunnels",
      "Building a hydroelectric dam requires massive capital investment"
    ],
    correctAnswer: "The physical concrete wall at Akosombo is the single largest dam wall in existence",
    hint: "Paragraph four notes that the dam is 'among the most formidable', but the *lake* is the largest man-made lake.",
    workedSolution: "The text affirms that Lake Volta is the largest man-made lake, while the dam is only 'one of the most formidable'; asserting that the dam wall itself is the largest in existence is false.",
    points: 1
  },
  {
    number: 12,
    prompt: "According to the mechanical principles outlined in Passage II, which assertion is factually accurate?",
    options: [
      "Engineers throw dam walls across rivers at their widest alluvial plains",
      "The natural kinetic force of rushing water is captured to drive electricity generators",
      "Procuring turbine machinery and pouring dam concrete requires zero financial expenditure",
      "Hydroelectric power generation consumes millions of barrels of crude petroleum daily"
    ],
    correctAnswer: "The natural kinetic force of rushing water is captured to drive electricity generators",
    hint: "Falling water spins turbines without burning petroleum fuel.",
    workedSolution: "The passage explains that the mechanical energy of falling water turns heavy turbines to generate electricity without consuming combustible fuel.",
    points: 1
  },
  {
    number: 13,
    prompt: "Which of the following titles is most appropriate for Passage II?",
    options: [
      "The Geological Origins of Bauxite",
      "Generating Electrical Energy from Hydropower",
      "The World's Deepest Inland Waterways",
      "International Metal Smelting Technologies"
    ],
    correctAnswer: "Generating Electrical Energy from Hydropower",
    hint: "The overarching theme of the text is how river dams harness water power to produce electricity.",
    workedSolution: "The central focus is the engineering and national significance of generating electric power from dammed river water; 'Generating Electrical Energy from Hydropower' is the most accurate title.",
    points: 1
  }
];

// =========================================================================
// GENERAL SECTIONS B - D: SYNONYMS, STRUCTURE & ANTONYMS (CALIBRATED)
// =========================================================================
const generalQuestions = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (14 - 17) ---
  {
    number: 14,
    prompt: "The imported fabric you bought is inferior to our locally handwoven kente cloth.\nChoose the word nearest in meaning to 'inferior'.",
    options: ["substandard in quality", "wonderfully patterned", "delicately textured", "moderately priced"],
    correctAnswer: "substandard in quality",
    hint: "Lower in grade, durability, or quality.",
    workedSolution: "'Inferior' means lower in rank, standard, or excellence; 'substandard in quality' is its direct contextual meaning.",
    points: 1
  },
  {
    number: 15,
    prompt: "The young apprentice proved to be a spendthrift who squandered all his allowances on luxury watches.\nChoose the word nearest in meaning to 'spendthrift'.",
    options: ["an indolent youth", "a reckless gambler", "a profligate spender", "a rebellious person"],
    correctAnswer: "a profligate spender",
    hint: "A person who wastes money carelessly and extravagantly.",
    workedSolution: "'Spendthrift' denotes an individual who spends money wastefully and lavishly; 'a profligate spender' is its exact equivalent.",
    points: 1
  },
  {
    number: 16,
    prompt: "The youth of our township actively assist in communal sanitation exercises.\nChoose the word nearest in meaning to 'communal'.",
    options: ["private household", "compulsory athletic", "collective civic", "customary ceremonial"],
    correctAnswer: "collective civic",
    hint: "Undertaken collectively by members of a community for public benefit.",
    workedSolution: "'Communal' refers to activities shared or participated in by all community members; 'collective civic' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "The savory aroma of the simmering palm-nut soup made our mouths water.\nChoose the word nearest in meaning to 'aroma'.",
    options: ["appetizing scent", "excessive heat", "tangy flavor", "radiant appearance"],
    correctAnswer: "appetizing scent",
    hint: "A distinctive, pleasant, and savory fragrance of food.",
    workedSolution: "'Aroma' refers specifically to a pleasant, fragrant, or appetizing smell; 'appetizing scent' is its direct meaning.",
    points: 1
  },

  // --- SECTION C: QUESTION TAGS & STRUCTURE (18 - 35) ---
  {
    number: 18,
    prompt: "Kwaku wasn't present during the emergency council deliberation, ......?",
    options: ["wasn't he", "isn't it", "did he", "was he"],
    correctAnswer: "was he",
    hint: "A negative statement with 'wasn't' takes an affirmative tag: 'was he?'.",
    workedSolution: "The main clause has a negative auxiliary ('wasn't'). Its corresponding question tag must be affirmative: 'was he?'.",
    points: 1
  },
  {
    number: 19,
    prompt: "You don't understand the Spanish dialect spoken by the sailors, ......?",
    options: ["do you", "can you", "don't you", "won't you"],
    correctAnswer: "do you",
    hint: "A negative present statement with 'don't' takes an affirmative tag: 'do you?'.",
    workedSolution: "The statement is negative present simple ('don't understand'). The question tag must be affirmative: 'do you?'.",
    points: 1
  },
  {
    number: 20,
    prompt: "Our debating team worked diligently throughout the term, ......?",
    options: ["did we", "isn't it", "aren't we", "didn't we"],
    correctAnswer: "didn't we",
    hint: "An affirmative past simple clause ('worked') takes a negative tag using 'did'.",
    workedSolution: "The main clause contains an affirmative simple past verb ('worked') with subject 'we'. The tag must be negative: 'didn't we?'.",
    points: 1
  },
  {
    number: 21,
    prompt: "The defending champions have conceded two goals, ......?",
    options: ["didn't they", "isn't it", "haven't they", "is it"],
    correctAnswer: "haven't they",
    hint: "An affirmative present perfect clause with 'have' takes a negative tag with 'have'.",
    workedSolution: "The main clause is affirmative in the Present Perfect ('have conceded') with a plural subject. The tag is 'haven't they?'.",
    points: 1
  },
  {
    number: 22,
    prompt: "The burglar broke into the wooden chest ............",
    options: [
      "in which we kept the ceremonial regalia",
      "which we kept in the ceremonial regalia",
      "we kept the ceremonial regalia inside",
      "where we kept the ceremonial regalia inside"
    ],
    correctAnswer: "in which we kept the ceremonial regalia",
    hint: "Formal relative clause: The preposition 'in' precedes the relative pronoun 'which' modifying 'chest'.",
    workedSolution: "Formal standard English requires 'in which we kept...', correctly indicating that the regalia was stored inside the chest.",
    points: 1
  },
  {
    number: 23,
    prompt: "...... hard the apprentice labored, the master craftsman remained dissatisfied.",
    options: ["Whatever", "How", "Whenever", "However"],
    correctAnswer: "However",
    hint: "Concessive adverb of degree modifying an adverb/adjective: 'However + hard + subject + verb'.",
    workedSolution: "'However' functions as a concessive adverb of degree ('However hard the apprentice labored...'), meaning 'no matter how hard'.",
    points: 1
  },
  {
    number: 24,
    prompt: "Kofi finished the grueling cross-country race ............",
    options: [
      "even though he had sprained his ankle",
      "during which he had sprained his ankle",
      "but he had sprained his ankle",
      "for which he had sprained his ankle"
    ],
    correctAnswer: "even though he had sprained his ankle",
    hint: "Identify the subordinating conjunction of concession that introduces an adverse condition.",
    workedSolution: "'Even though' introduces a subordinate concessive clause that contrasts with the main clause achievement.",
    points: 1
  },
  {
    number: 25,
    prompt: "Visitors to the botanical gardens are strictly forbidden ............",
    options: [
      "to walk at the lawn",
      "to be walking across the lawn",
      "walking across the lawn",
      "to walk across the lawn"
    ],
    correctAnswer: "to walk across the lawn",
    hint: "The passive structure 'are forbidden' takes a full to-infinitive followed by the directional preposition 'across'.",
    workedSolution: "In standard English verb catenation, the passive 'are forbidden' takes a full to-infinitive ('to walk across the lawn').",
    points: 1
  },
  {
    number: 26,
    prompt: "The entire congregation was highly pleased ...... the visiting evangelist's sermon.",
    options: ["for", "in", "with", "at"],
    correctAnswer: "with",
    hint: "Identify the preposition that regularly collocates with the adjective 'pleased' regarding an object or sermon.",
    workedSolution: "The adjective 'pleased' takes the preposition 'with' when expressing satisfaction with something ('pleased with the sermon').",
    points: 1
  },
  {
    number: 27,
    prompt: "The headmaster warmly congratulated the senior prefect ...... his exemplary conduct.",
    options: ["on", "during", "at", "to"],
    correctAnswer: "on",
    hint: "Identify the preposition that regularly collocates with the verb 'congratulate'.",
    workedSolution: "In standard English grammar, one 'congratulates' someone 'on' an achievement, milestone, or conduct.",
    points: 1
  },
  {
    number: 28,
    prompt: "The hospital patient is steadily recovering ...... the effects of the surgical operation.",
    options: ["from", "with", "for", "during"],
    correctAnswer: "from",
    hint: "Identify the preposition that regularly collocates with the verb 'recover'.",
    workedSolution: "The verb 'recover' takes the preposition 'from' when indicating the ailment or condition being overcome.",
    points: 1
  },
  {
    number: 29,
    prompt: "The boarding pupils have lived in this hostel ...... four continuous years now.",
    options: ["since", "in", "by", "for"],
    correctAnswer: "for",
    hint: "Use 'for' to measure a period or duration of time, and 'since' for a specific starting point.",
    workedSolution: "The preposition 'for' is used to measure an elapsed duration or span of time ('for four years').",
    points: 1
  },
  {
    number: 30,
    prompt: "It would be reckless to ...... the rare privilege of pursuing university studies.",
    options: ["cast away", "cast in", "cast over", "cast by"],
    correctAnswer: "cast away",
    hint: "Identify the phrasal verb meaning to squander, discard, or waste an advantageous opportunity.",
    workedSolution: "The phrasal verb 'to cast away' (or 'throw away') means to discard, forfeit, or squander an advantageous opportunity.",
    points: 1
  },
  {
    number: 31,
    prompt: "The sudden bereavement saddened Koku deeply, but with time he will ...... the grief.",
    options: ["get along", "get on", "get by", "get over"],
    correctAnswer: "get over",
    hint: "Identify the phrasal verb meaning to recover from an illness, shock, or sorrow.",
    workedSolution: "The phrasal verb 'to get over' means to overcome, heal, or recover from emotional sorrow or illness.",
    points: 1
  },
  {
    number: 32,
    prompt: "Whenever you encounter obscure terminology, ...... the definition in an authoritative lexicon.",
    options: ["look around", "look on", "look up", "look about"],
    correctAnswer: "look up",
    hint: "Identify the phrasal verb meaning to search for information in a reference dictionary.",
    workedSolution: "The phrasal verb 'to look up' means to consult a reference book or dictionary to ascertain the meaning of a word.",
    points: 1
  },
  {
    number: 33,
    prompt: "If the candidate ...... the municipal primary election, he would have represented our district.",
    options: ["won", "has won", "had won", "should win"],
    correctAnswer: "had won",
    hint: "Third Conditional: 'would have represented' in the main clause requires 'had + past participle' in the if-clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the if-clause takes the past perfect tense: 'had won'.",
    points: 1
  },
  {
    number: 34,
    prompt: "If the young apprentice continues to apply himself, he ...... his trade certificate with ease.",
    options: ["will earn", "is earning", "has earned", "would earn"],
    correctAnswer: "will earn",
    hint: "First Conditional: Simple present in the if-clause ('continues') requires the future modal in the main clause.",
    workedSolution: "In a First Conditional sentence expressing a realistic future outcome, the main clause requires 'will + base verb': 'will earn'.",
    points: 1
  },
  {
    number: 35,
    prompt: "The sensational news broadcast on the radio ...... alarming to the entire community.",
    options: ["are", "were", "has been", "was"],
    correctAnswer: "was",
    hint: "'News' is a singular uncountable mass noun that requires a singular verb.",
    workedSolution: "'News' is singular and non-count. In a past narrative setting, it requires the singular past copula 'was'.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (36 - 40) ---
  {
    number: 36,
    prompt: "While the master carpenter produced splendid furniture, his apprentice turned out ...... products.\nChoose the word most nearly opposite in meaning to 'splendid'.",
    options: ["speedy", "onerous", "massive", "shoddy"],
    correctAnswer: "shoddy",
    hint: "'Splendid' means magnificent and of top quality. Find the word meaning poorly made or inferior.",
    workedSolution: "'Splendid' denotes work of exceptional excellence. Its direct opposite in craft quality is 'shoddy' (poorly made, inferior, or bad).",
    points: 1
  },
  {
    number: 37,
    prompt: "While reckless youths indulge in substance abuse, prudent students deliberately ...... such perilous habits.\nChoose the word most nearly opposite in meaning to 'indulge in'.",
    options: ["shun", "propagate", "condone", "tolerate"],
    correctAnswer: "shun",
    hint: "'Indulge in' means to engage in freely. Find the word meaning to avoid or steer clear of.",
    workedSolution: "'Indulge in' means to partake freely in an activity. Its direct antonym is 'shun' (to avoid or steer clear of).",
    points: 1
  },
  {
    number: 38,
    prompt: "Our grandmother prefers lean beef, whereas my father enjoys ...... cuts of meat.\nChoose the word most nearly opposite in meaning to 'lean'.",
    options: ["raw", "fatty", "decayed", "bloody"],
    correctAnswer: "fatty",
    hint: "'Lean' meat contains little or no fat. Find the word meaning rich in fat.",
    workedSolution: "'Lean' in meat describes meat having minimal or no fat. Its direct dietary antonym is 'fatty'.",
    points: 1
  },
  {
    number: 39,
    prompt: "The headmaster was hesitant to endorse the truant's petition, but ...... to assist the disciplined orphan.\nChoose the word most nearly opposite in meaning to 'hesitant'.",
    options: ["eager", "terrified", "incapable", "tentative"],
    correctAnswer: "eager",
    hint: "'Hesitant' means reluctant and slow to act. Find the word denoting keen readiness.",
    workedSolution: "'Hesitant' means reluctant or unwilling. Its direct opposite is 'eager' (keen, willing, and prompt).",
    points: 1
  },
  {
    number: 40,
    prompt: "The union executive decided to convene the scheduled congress, while management pressured them to ...... it.\nChoose the word most nearly opposite in meaning to 'convene'.",
    options: ["prolong", "adjourn", "cancel", "endorse"],
    correctAnswer: "cancel",
    hint: "'Convene' means to assemble and hold a meeting. Find the word meaning to call off completely.",
    workedSolution: "'To convene' (or hold) an assembly means to bring it together. Its direct antonym is 'cancel' (to call off entirely).",
    points: 1
  }
];

// Combine all 40 raw questions
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

const assignedTargetIndices = seedShuffle(targetKeys, 199102);

// Attach Passage I and Passage II directly to questions 1-13 so that
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

  if (qNum >= 1 && qNum <= 7) {
    passageTitle = "Passage I: Touring the Metropolis";
    passageText = passage1Text;
    passage = passage1Text;
  } else if (qNum >= 8 && qNum <= 13) {
    passageTitle = "Passage II: Hydropower and Industry";
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
const passage1Items = balancedPaper1.slice(0, 7);
const passage2Items = balancedPaper1.slice(7, 13);
const remainingItems = balancedPaper1.slice(13);

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
        category: "Formal Letter",
        prompt: "Your class teacher has punished you severely for an act of vandalism you did not commit. Write a formal letter of appeal to your Headmaster explaining the truth of what transpired and politely requesting that your disciplinary record be cleared.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 1991

The Headmaster
Methodist Junior Secondary School
P. O. Box 54
Bekwai

Dear Sir,

PETITION AGAINST UNJUST DISCIPLINARY SANCTION AND APPEAL FOR REDRESS

I respectfully write to place before your high office a formal appeal regarding a severe disciplinary punishment imposed on me by my class teacher, Mr. J. K. Mensah, for an act of vandalism of which I am entirely innocent.

Yesterday morning, during the changeover of instructional periods, an unknown person defaced the classroom blackboard with offensive drawings and damaged two dual desks in Form Two Blue. Upon entering the room, Mr. Mensah discovered the damage. In a state of intense anger, he singled me out because I was standing near the blackboard and accused me of being the culprit. Despite my respectful explanation that I had just returned from delivering laboratory exercise books to the staff room, he refused to listen and sentenced me to two days of manual labor weeding the sports park.

I wish to state categorically that I had no hand in that misconduct. My science master, Mr. Emmanuel Osei, can confirm that I was in his office sorting test scripts during the entire ten-minute recess. Furthermore, two of my classmates, Kwaku Boateng and Samuel Addo, witnessed two senior students running out of our classroom moments before the teacher arrived.

I have always upheld exemplary moral discipline, serving as our classroom library monitor without blemish. Suffering this undeserved punishment publicly stains my academic record and causes me deep emotional distress.

I humbly appeal to your benevolent office to investigate this incident, clear my name, and rescind the unwarranted sanction.

Thank you for your fatherly justice and consideration.

Yours faithfully,
[Signature]
Francisca Donkor
(Form Two Blue - Index No: 0204010054)`
      },
      {
        questionNumber: "2",
        category: "Informal / Persuasive Letter",
        prompt: "You wish to continue your education in a Senior Secondary School, but your parents, facing financial constraints, want you to terminate your education after basic school. Write a persuasive letter to an affluent relative explaining why you want to continue your studies and asking for financial sponsorship.",
        modelAnswer: `Presbyterian Junior Secondary School
P. O. Box 80
Begoro, Eastern Region
18th October, 1991

Dear Uncle Kwesi,

I hope this letter finds you in fine health, peace of mind, and thriving in your business enterprises in Accra. As I approach the completion of my final year in junior secondary school, I write to share an urgent personal crisis and to appeal for your benevolent financial sponsorship.

Recently, my parents informed me that due to recurring crop failures on our family cocoa farm, they cannot afford the financial expenditure required to enroll me in Senior Secondary School. They have suggested that I terminate my schooling and take up commercial tailoring in town. While I respect their domestic constraints, my heart is broken because academic learning is my greatest passion.

Throughout my three years at Begoro Presbyterian JSS, I have consistently achieved academic distinction, placing first in my class in Mathematics, Integrated Science, and English. In the recently conducted regional mock examinations, I secured Aggregate Six. My teachers have affirmed that I possess the scholastic aptitude to pursue the General Science programme at Prempeh College and eventually study medicine at the university.

Abandoning my schooling now would extinguish these dreams permanently. I humbly appeal to your generosity to sponsor my secondary school education—covering my boarding fees, uniforms, and textbooks. I promise to study with relentless diligence and secure distinction in the Senior Secondary Certificate Examination to justify your benevolence.

May the Almighty reward and expand your financial endeavors.

Your grateful nephew,
[Signature]
Emmanuel Addo`
      },
      {
        questionNumber: "3",
        category: "Descriptive Narrative",
        prompt: "Describe in vivid, colorful detail a bustling, crowded market scene in your town or village on an official market day.",
        modelAnswer: `A VIBRANT MARKET DAY AT BEGORO CENTRAL MARKET

Thursday is the official commercial market day in Begoro, and from the crack of dawn, our quiet rural town transforms into a kaleidoscope of radiant colors, pungent aromas, and deafening human clamor. Farmers, traders, and wholesale buyers from distant metropolises converge at the sprawling market square, eager to trade.

The market is an exhilarating sensory experience. Stalls and wooden sheds are arranged in bustling, narrow alleyways according to commodities. In the agricultural produce section, giant heaps of freshly harvested plantains, tubers of white yam, and baskets of scarlet garden eggs and tomatoes are displayed on jute sacks. Women traders with colorful headscarves shout catchy rhymes to advertise their wares, passionately haggling with buyers over the price of smoked river fish and dried bushmeat.

In another bustling lane, tailors operate rhythmic treadle sewing machines, while cloth merchants display dazzling yards of traditional kente prints and vibrant wax fabrics that flutter in the warm afternoon breeze. Head porters, popularly known as 'kayayei', balance enormous aluminum pans laden with yams on their heads, navigating the crowded passages with breathtaking balance while shouting "Agoo! Agoo!" to clear their path.

The air is filled with a rich blend of competing scents—roasted corn and groundnuts mingling with the sharp aroma of dried salted tilapia, fresh ginger, and fried plantain. Children run errands between stalls while the laughter of reunited friends echoes through the air.

As dusk settles and kerosene lanterns flicker to life, weary traders count their banknotes and pack their unsold wares. Begoro market is more than a commercial center; it is the beating heart of our community's culture and enterprise.`
      },
      {
        questionNumber: "4",
        category: "Narrative Essay",
        prompt: 'Write an engaging, realistic story that concludes with the sentence: "I suddenly woke up and realised it was all a dream."',
        modelAnswer: `It was the eve of our national sports championship, and tension hung heavily over our dormitory. In my subconscious mind that night, a thrilling drama unfolded.

In the dream, I was standing on the Olympic-standard synthetic track of an enormous sports stadium packed with over fifty thousand cheering spectators. The afternoon sun sparkled off giant silver and gold trophies arrayed on the VIP dais. I looked down and found myself wearing the golden athletic vest of Ghana, laced with sleek spiked running shoes that felt as light as air.

The stadium announcer's voice boomed through the loudspeakers: "Finals of the Men's 100-Meter World Championship!" My heart pounded with excitement as I walked to lane four alongside towering international sprint champions. We crouched into our starting blocks in absolute, breathless silence. The starter raised his pistol.

Bang! The starter's gun fired. I surged out of the blocks with the speed of a cheetah. The wind roared past my ears as the crowd erupted into a deafening wall of sound. Fifty meters... seventy meters... eighty meters! I was running neck and neck with the world record holder. Digging my spikes deep into the rubber track, I lunged forward with every fiber of my muscle and crossed the white finish line inches ahead of my rivals.

Flashbulbs exploded everywhere. The stadium rose in a standing ovation as officials draped our national flag over my shoulders and handed me the golden world championship medal. The gold felt cool and solid in my hands.

Suddenly, a loud bell began clanging relentlessly. I blinked against the morning sunlight streaming through our dormitory window, clutching my pillow tightly to my chest. The prefect was ringing the rising bell. I suddenly woke up and realised it was all a dream.`
      }
    ]
  }
};

async function seedBeceEnglish1991Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 1991 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_1991");
  await docRef.set({
    year: 1991,
    title: "BECE English Language 1991 (Calibrated National Benchmark)",
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
          title: "Passage I: Touring the Metropolis",
          text: passage1Text,
          questionRange: "Questions 1 to 7"
        },
        {
          id: "passage_2",
          title: "Passage II: Hydropower and Industry",
          text: passage2Text,
          questionRange: "Questions 8 to 13"
        }
      ],
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: Touring the Metropolis",
          text: passage1Text,
          questionRange: "Questions 1 to 7",
          questions: passage1Items
        },
        passage2: {
          passageTitle: "Passage II: Hydropower and Industry",
          text: passage2Text,
          questionRange: "Questions 8 to 13",
          questions: passage2Items
        }
      },
      sectionB_to_D: {
        title: "Sections B - D: Synonyms, Question Tags, Structure and Antonyms",
        questionRange: "Questions 14 to 40",
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

  console.log("✅ Fully Rewritten, Clean-Room BECE English 1991 successfully seeded into Firestore!");
}

seedBeceEnglish1991Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1991:", err);
    process.exit(1);
  });
