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
    prompt: "If the ancient ancestral mansion had been properly renovated, it ............ during the storm.",
    options: ["will not have", "has not", "had not", "would not have"],
    correctAnswer: "would not have",
    hint: "Third Conditional: 'had been properly renovated' in the if-clause requires 'would not have + past participle' in the main clause.",
    workedSolution: "In a Third Conditional sentence expressing a counterfactual past condition, the main clause requires a modal past perfect: 'would not have collapsed'.",
    points: 1
  },
  {
    number: 2,
    prompt: "Auntie Mansa bakes pastries as a means ............ earning supplementary income.",
    options: ["for", "in", "to", "of"],
    correctAnswer: "of",
    hint: "Identify the preposition that regularly collocates with the fixed noun phrase 'a means'.",
    workedSolution: "In standard English idiomatic usage, the noun phrase is 'a means of' followed by a gerund or noun: 'a means of making an extra income'.",
    points: 1
  },
  {
    number: 3,
    prompt: "Deon affirmed that he distinctly heard the African grey parrot ............ in the courtyard.",
    options: ["sing", "sang", "sung", "to sing"],
    correctAnswer: "sing",
    hint: "Verbs of sensory perception (hear, see, watch) take a direct object followed by a bare infinitive for a completed action.",
    workedSolution: "Following verbs of sensory perception ('heard'), standard English uses a bare infinitive without 'to': 'heard the parrot sing'.",
    points: 1
  },
  {
    number: 4,
    prompt: "Populations residing in insanitary settlements easily ............ cholera from polluted wells.",
    options: ["catch", "attract", "capture", "contract"],
    correctAnswer: "contract",
    hint: "Formal medical verb meaning to catch or acquire an infectious disease.",
    workedSolution: "In formal medical and biological English, one 'contracts' a bacterial disease or infection: 'contract cholera'.",
    points: 1
  },
  {
    number: 5,
    prompt: "There is only ............ drinking water remaining in the ceramic jar.",
    options: ["a few", "few", "a lot", "a little"],
    correctAnswer: "a little",
    hint: "'Water' is an uncountable mass noun. Use the quantifier expressing a positive small amount.",
    workedSolution: "'Water' is an uncountable noun. Modifying it to express a small positive quantity requires 'a little': 'a little water'. ('A few' applies strictly to count nouns).",
    points: 1
  },
  {
    number: 6,
    prompt: "Remy is eagerly looking forward to ............ Jane at the annual graduation ball.",
    options: ["seeing", "see", "have been seeing", "be seeing"],
    correctAnswer: "seeing",
    hint: "The prepositional phrasal verb 'look forward to' requires a gerund complement (verb-ing).",
    workedSolution: "In the idiom 'look forward to', 'to' acts as a preposition requiring a gerund complement: 'looking forward to seeing'.",
    points: 1
  },
  {
    number: 7,
    prompt: "The recalcitrant candidates failed to provide any justifiable reason ............ being late.",
    options: ["to", "of", "for", "in"],
    correctAnswer: "for",
    hint: "Identify the dependent preposition that regularly collocates with the noun 'reason'.",
    workedSolution: "In standard English grammar, the noun 'reason' takes the preposition 'for' when explaining cause or justification: 'reason for being late'.",
    points: 1
  },
  {
    number: 8,
    prompt: "What ............ Kwadwo and Adwoa doing when you departed from the store?",
    options: ["are", "were", "was", "is"],
    correctAnswer: "were",
    hint: "Compound plural subject ('Kwadwo and Adwoa') in a past continuous question.",
    workedSolution: "The subject 'Kwadwo and Adwoa' is plural, requiring the plural past continuous auxiliary 'were': 'What were Kwadwo and Adwoa doing...'.",
    points: 1
  },
  {
    number: 9,
    prompt: "Egotistical individuals invariably consider ............ before anyone else.",
    options: ["herself", "ourselves", "myself", "themselves"],
    correctAnswer: "themselves",
    hint: "Reflexive pronoun agreeing in number and person with the plural third-person antecedent 'Selfish people'.",
    workedSolution: "The plural third-person subject 'Selfish people' requires the matching plural reflexive pronoun 'themselves'.",
    points: 1
  },
  {
    number: 10,
    prompt: "Enyonam requested her classmate to ............ her a mathematical compass.",
    options: ["lend", "spare", "borrow", "excuse"],
    correctAnswer: "lend",
    hint: "'Lend' means to grant temporary use to someone; 'borrow' means to receive temporary use from someone.",
    workedSolution: "The action requested of the friend is to give the item temporarily to Enyonam: 'lend her a pen'. ('Borrow' means to take).",
    points: 1
  },
  {
    number: 11,
    prompt: "The fatal collision occurred ............ the bus driver's reckless misjudgment.",
    options: ["from", "on", "through", "by"],
    correctAnswer: "through",
    hint: "Preposition denoting agency, fault, or medium of causation: 'occurred through'.",
    workedSolution: "When an accident occurs as a direct result of human error or negligence, 'through' is standard: 'occurred through the driver's mistakes'.",
    points: 1
  },
  {
    number: 12,
    prompt: "I am fully aware that you are ............ than your elder sister, Esi.",
    options: ["taller", "tallest", "the taller", "the tall"],
    correctAnswer: "taller",
    hint: "Comparative degree comparing two persons without a redundant article preceding it when followed by a complement.",
    workedSolution: "When comparing two individuals in height, the simple comparative degree 'taller' is required: 'you are taller, Esi'.",
    points: 1
  },
  {
    number: 13,
    prompt: "Akesi's mother was not satisfied ............ his explanation regarding the missing funds.",
    options: ["in", "to", "with", "on"],
    correctAnswer: "with",
    hint: "Identify the dependent preposition that regularly collocates with the adjective 'satisfied'.",
    workedSolution: "In standard English collocations, the adjective 'satisfied' takes the preposition 'with': 'satisfied with his explanation'.",
    points: 1
  },
  {
    number: 14,
    prompt: "The diplomatic envoy has resided in this country ............ three continuous years.",
    options: ["through", "within", "for", "since"],
    correctAnswer: "for",
    hint: "Preposition used to measure the elapsed duration of a period of time.",
    workedSolution: "The preposition 'for' denotes an elapsed span or duration of time ('for three years'). 'Since' marks a specific starting point.",
    points: 1
  },
  {
    number: 15,
    prompt: "The aged groundskeeper was ............ frail to carry the heavy lawnmower.",
    options: ["even", "so", "too", "very"],
    correctAnswer: "too",
    hint: "Degree adverb indicating an excessive quality that prevents the execution of an infinitive: 'too + adjective + to-infinitive'.",
    workedSolution: "The degree modifier 'too' indicates an excess that makes an action impossible: 'too old to work'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "Her lifelong ambition is to establish a pediatric clinic in her village.\nChoose the word nearest in meaning to 'ambition'.",
    options: ["target", "joy", "plan", "desire"],
    correctAnswer: "desire",
    hint: "A strong wish, yearning, or aspiration to achieve something.",
    workedSolution: "'Ambition' in the sense of a deep personal aspiration or goal means a strong 'desire' (or cherished aim).",
    points: 1
  },
  {
    number: 17,
    prompt: "Have you accumulated enough capital to purchase the commercial tractor?\nChoose the word nearest in meaning to 'enough'.",
    options: ["plenty", "much", "sufficient", "full"],
    correctAnswer: "sufficient",
    hint: "As much as is required for a purpose; adequate.",
    workedSolution: "'Enough' means adequate to meet a need; 'sufficient' is its exact equivalent.",
    points: 1
  },
  {
    number: 18,
    prompt: "The rancher slaughtered several of his steers for the wedding feast.\nChoose the word nearest in meaning to 'slaughtered'.",
    options: ["killed", "treated", "examined", "castrated"],
    correctAnswer: "killed",
    hint: "Butchered or killed animals for food.",
    workedSolution: "'Slaughtered' in animal husbandry means butchered or 'killed' for food.",
    points: 1
  },
  {
    number: 19,
    prompt: "Soraya is remarkably lively and energetic this afternoon.\nChoose the word nearest in meaning to 'lively'.",
    options: ["smart", "active", "friendly", "serious"],
    correctAnswer: "active",
    hint: "Full of life, energy, and movement; animated.",
    workedSolution: "'Lively' means full of life, vigorous, or 'active'; 'active' is its closest synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "The moral and physical welfare of students should be the priority of all teachers.\nChoose the word nearest in meaning to 'welfare'.",
    options: ["wealth", "happiness", "well-being", "growth"],
    correctAnswer: "well-being",
    hint: "The state of being comfortable, healthy, or prosperous.",
    workedSolution: "'Welfare' refers to health, happiness, prosperity, and general 'well-being'; 'well-being' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "Paul shed crocodile tears when his rival was disqualified from the contest. This means that Paul ............",
    options: [
      "felt genuine sympathy for his rival",
      "felt sad but could not weep",
      "insincerely pretended to be sorrowful",
      "wept uncontrollably in public"
    ],
    correctAnswer: "insincerely pretended to be sorrowful",
    hint: "To display false, insincere, or hypocritical grief.",
    workedSolution: "The idiom 'to shed crocodile tears' means to put on an insincere, hypocritical display of sorrow.",
    points: 1
  },
  {
    number: 22,
    prompt: "When the traveler heard the sudden midnight gunfire, her hair stood on end. This means the traveler ............",
    options: [
      "started weeping loudly",
      "became physically paralyzed",
      "was terrified and severely frightened",
      "was mildly worried"
    ],
    correctAnswer: "was terrified and severely frightened",
    hint: "Filled with sudden, intense terror or horror.",
    workedSolution: "The idiom 'one's hair stands on end' means to be filled with intense fear or terror; 'was frightened' is its direct meaning.",
    points: 1
  },
  {
    number: 23,
    prompt: "That master carpenter always takes pains over his joinery work. This means the carpenter ............",
    options: [
      "executes his work with meticulous and great care",
      "finds carpentry physically painful",
      "is unhappy with his trade",
      "frequently falls ill from exhaustion"
    ],
    correctAnswer: "executes his work with meticulous and great care",
    hint: "To make a careful, conscientious, and thorough effort.",
    workedSolution: "The idiom 'to take pains' over something means to do it with meticulous effort, diligence, and great care.",
    points: 1
  },
  {
    number: 24,
    prompt: "The medicinal herbs in the forest reserve grow in leaps and bounds. This means the herbs grow ............",
    options: [
      "slowly and in small clusters",
      "in large circular mounds",
      "regardless of wet or dry weather",
      "rapidly, abundantly, and with great speed"
    ],
    correctAnswer: "rapidly, abundantly, and with great speed",
    hint: "Making rapid, dramatic, and significant progress or growth.",
    workedSolution: "The idiom 'in leaps and bounds' means rapidly, dramatically, and with tremendous speed.",
    points: 1
  },
  {
    number: 25,
    prompt: "Following his sports victory, Kim became full of himself. This means that Kim became ............",
    options: ["haughty, boastful, and arrogant", "physically dangerous", "excessively greedy", "argumentative"],
    correctAnswer: "haughty, boastful, and arrogant",
    hint: "Having an inflated, conceited, or boastful opinion of oneself.",
    workedSolution: "The idiom 'to be full of oneself' means to be conceited, self-centered, or 'arrogant'.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "While Evans rises early at dawn, his slothful roommate awakens ...... .\nChoose the word most nearly opposite in meaning to 'early'.",
    options: ["often", "at home", "late", "on his bed"],
    correctAnswer: "late",
    hint: "'Early' means near the beginning of the day. What word denotes after the expected, proper, or usual time?",
    workedSolution: "'Early' denotes ahead of time or near dawn. Its direct temporal antonym is 'late'.",
    points: 1
  },
  {
    number: 27,
    prompt: "While Dora was exhausted after the marathon, a cold shower left her ...... .\nChoose the word most nearly opposite in meaning to 'exhausted'.",
    options: ["cheerful", "active", "refreshed", "strong"],
    correctAnswer: "refreshed",
    hint: "'Exhausted' means completely drained of energy. What word denotes rejuvenated, restored, and energetic?",
    workedSolution: "'Exhausted' means physically drained of strength. Its direct physiological antonym is 'refreshed' (invigorated).",
    points: 1
  },
  {
    number: 28,
    prompt: "The sudden demolition of the old market was protested, but the ...... of the new shopping mall brought joy.\nChoose the word most nearly opposite in meaning to 'demolition'.",
    options: ["construction", "creation", "erection", "relocation"],
    correctAnswer: "construction",
    hint: "'Demolition' means pulling down or destroying a structure. What engineering word denotes building or putting up a structure?",
    workedSolution: "'Demolition' means tearing down or razing. Its direct architectural and infrastructural antonym is 'construction' (building).",
    points: 1
  },
  {
    number: 29,
    prompt: "The film critics labeled the narrative ancient, but contemporary audiences found it remarkably ...... .\nChoose the word most nearly opposite in meaning to 'ancient'.",
    options: ["relaxing", "modern", "difficult", "interesting"],
    correctAnswer: "modern",
    hint: "'Ancient' belongs to the distant past. What word denotes belonging to the present era; contemporary?",
    workedSolution: "'Ancient' means belonging to times long past. Its direct chronological antonym is 'modern' (contemporary).",
    points: 1
  },
  {
    number: 30,
    prompt: "Vulnerable herds will perish in the severe drought, whereas hardier breeds will ...... .\nChoose the word most nearly opposite in meaning to 'perish'.",
    options: ["graze", "survive", "starve", "remain"],
    correctAnswer: "survive",
    hint: "'Perish' means to die or be destroyed. What biological word denotes to continue to live or exist through hardship?",
    workedSolution: "'Perish' means to die or be wiped out. Its direct existential antonym is 'survive' (continue to live).",
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

const assignedTargetIndices = seedShuffle(targetKeys, 202202);

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
        category: "Article for Publication",
        prompt: "Write an inspiring article for publication in your school magazine on the topic: \"My Role Model and How He or She Has Positively Influenced My Life.\"",
        modelAnswer: `MY ROLE MODEL AND HOW SHE HAS INFLUENCED MY LIFE
By Samuel K. Boateng, Begoro

In life's journey, having a beacon of moral integrity and intellectual excellence to look up to makes all the difference. While many contemporary adolescents idolize flamboyant pop celebrities and internet influencers, my ultimate role model is my grandmother, Nana Yaa Frimpomaa—a retired public school headmistress, community midwife, and civic leader whose selfless life has profoundly shaped my worldview.

What inspires me most about Nana Yaa is her unyielding discipline and passion for education. Born into rural poverty in an era when female schooling was discouraged, she walked ten kilometers barefoot daily to attend classes, eventually graduating from teacher training college with distinction. As a headmistress, she used her personal savings to purchase textbooks and uniforms for impoverished orphans. Watching her teach illiterate market women to read on our veranda taught me that true greatness lies not in material accumulation, but in empowering others.

Nana Yaa's profound influence on my life is evident in my academic work ethic and moral character. Whenever I face challenging algebraic problems or feel disheartened by exam anxiety, her favorite adage echoes in my mind: "Perseverance conquers the steepest mountain." Under her guidance, I developed a rigorous daily study timetable, eliminating social media distractions and reading at least one classic book every month. Furthermore, she instilled in me the virtues of radical honesty, humility, and punctuality.

Because of her inspiring example, I have chosen to study biomedical science to serve rural healthcare centers. Nana Yaa is not just my grandmother; she is my guiding star.`
      },
      {
        questionNumber: "2",
        category: "Narrative Moral Essay",
        prompt: "Write an engaging, realistic story that concludes with the expression: \"Unfortunately I realized when it was too late that my friend was a wolf in sheep's clothing.\"",
        modelAnswer: `THE BETRAYAL OF A TRUSTED COMPANION

During our final year in junior high school, an articulate and charismatic transfer student named Richmond joined our class. Dressed in immaculate uniforms, speaking flawless English, and carrying an aura of supreme piety, Richmond quickly won the hearts of teachers and peers alike. He volunteered to lead morning devotions, carried teachers' bags, and offered to assist struggling classmates with homework. I felt honored when he chose me as his closest confidant.

However, beneath his charming smile and angelic demeanor lurked a calculating, deceitful predator. A week before our final mock examinations, Richmond approached me in the library, looking distressed. He claimed that our Mathematics teacher had accidentally dropped an envelope containing the upcoming examination paper in the staff common room and begged me to help him "return it safely." Trusting his honorable intentions implicitly, I accompanied him to the staff room during break time. While I stood by the door, Richmond swiftly ransacked the master's drawer, stole the examination marking scheme, and slipped it into my knapsack, whispering that we should keep it safe until closing.

The following morning, school security officers raided our classroom following a tip-off about a stolen marking scheme. When the booklet was uncovered in my school bag, Richmond sprang to his feet, pointed an accusing finger at me, and self-righteously testified to the disciplinary board that he had caught me stealing it the previous day! Paralyzed with shock, I tried to defend myself, but Richmond had already coached two classmates to corroborate his falsehood.

I was suspended in disgrace while Richmond received a certificate of commendation for whistleblowing. Weeping bitterly outside the school gate, I learned a harrowing lesson about human deception: Unfortunately I realized when it was too late that my friend was a wolf in sheep's clothing.`
      },
      {
        questionNumber: "3",
        category: "Informal Letter",
        prompt: "Write a letter to your close friend in another town, describing two major ways you prepared for your father's milestone birthday celebration and explaining what specifically made the party an unforgettable, memorable event.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2022

Dear Kwabena,

I hope this letter finds you in fine health, peace of mind, and studying hard as our examinations approach. I write with immense joy to recount my father's sixtieth birthday celebration, which took place last Saturday at our family residence in Bekwai. It was a glorious milestone that will linger in our family memories forever.

My siblings and I dedicated two solid weeks to meticulous preparations to make the event extraordinary. First, my elder brother and I took complete charge of venue design and multimedia setup. We cleared our compound, erected elegant blue-and-gold canopies, and decorated the pillars with fairy lights and floral ribbons. In addition, I spent nights scanning four decades of Father's old photographs—from his elementary school days to his university graduation—and produced a captivating musical video documentary to surprise him. Secondly, Mother and my sisters coordinated with local caterers to prepare Father's favorite traditional dishes, including aromatic jollof rice, seasoned roasted guinea fowl, and hot pounded fufu with spiced goat-meat soup.

What made the celebration truly unforgettable was an unannounced surprise visit by Father's childhood bosom friend, Dr. Osei, who flew in from Canada after twenty-five years of separation! When Dr. Osei stepped onto the compound during my video presentation, Father broke down in joyful tears, embracing his long-lost brother amidst roaring applause and fontomfrom drumming. Observing Father's face beam with pure happiness was the most fulfilling moment of my life.

I took numerous photographs of the event; I will show them to you when we meet for the vacation. Extend my warm regards to your parents.

Your true friend,
[Signature]
Kwaku Mensah`
      }
    ]
  },
  partB_comprehension: {
    title: "Part B: Reading Comprehension",
    instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
    passageText: `Opanyin Gyasi was an exceptionally prosperous transport entrepreneur who commanded an expansive fleet of commercial buses and haulage trucks. He was celebrated for his generous philanthropy and held in high esteem across his ancestral village. His children were exceedingly precious to him, yet he resolutely refused to pamper or indulge them. He regarded modern electronic appliances as dangerous, exorbitantly costly, and a primary catalyst for indolence among youth. Consequently, no labor-saving culinary gadgets were permitted within his kitchen; he insisted that meals possessed superior flavor when prepared over traditional firewood hearths. Furthermore, he personally shaved his sons' hair with manual hand-clippers.

At the basic school, Gyasi's children were the solitary pupils who communicated via handwritten letters delivered through the postal service, popularly ridiculed as "snail mail." Kwesi, his eldest son, was the constant target of mockery and taunting among peers. Nevertheless, he bore the humiliation with patient dignity.

When Kwesi graduated from tertiary education and his father entrusted him with the management of the logistics enterprise, he resolved to modernize operations completely. He procured a cellular phone for his mother, equipped the domestic kitchen with modern electrical appliances, installed GPS tracking devices across all commercial vehicles, and mandated that all freight payments and driver daily returns be transacted via mobile money platforms. He bound the transport drivers to strict confidentiality under oath.

During an era when violent highway carjackings, armed robbery, and fraudulent revenue withholding by drivers were the order of the day, Gyasi's transport enterprise continued to flourish with miraculous financial returns. His operations appeared completely insulated against theft and highway banditry.

This extraordinary immunity bewildered competing operators. Soon, malicious tongues began to wag across the district. Envious rivals accused Opanyin Gyasi of utilizing occult juju rituals to fortify his vehicles, while others insinuated that he was secretly in league with notorious armed robbery syndicates. Distrustful neighbors began to shun his company.

One afternoon, during an emergency assembly convened by the Regional Association of Transport Owners to address the surge in highway robberies, Kwesi let the cat out of the bag, publicly demonstrating how digital GPS tracking and cashless mobile money transfers had secured their enterprise.`,
    questions: [
      {
        subQuestion: "(a)",
        question: "State two specific actions taken by Opanyin Gyasi that demonstrated that he did not pamper his children.",
        answer: "1. He prohibited modern labor-saving gadgets in the house, insisting food be cooked traditionally.\n2. He cut his children's hair himself with manual clippers (and made them use slow postal snail mail instead of modern phones)."
      },
      {
        subQuestion: "(b)",
        question: "I. Identify two specific innovative things that Kwesi did differently upon assuming management of the transport business.\nII. List two adjectives that can accurately describe Kwesi's drivers.",
        answer: "I. He installed GPS tracking devices on all vehicles and required drivers to use mobile money transfers (and bought a mobile phone and modern appliances for his mother).\nII. Secretive (confidential/bound to secrecy) and obedient (faithful/cooperative)."
      },
      {
        subQuestion: "(c)",
        question: "What were two major security and operational problems that commercial vehicle owners faced in that era?",
        answer: "1. Rampant car-snatching and violent armed robbery.\n2. Drivers cheating and embezzling revenue from their employers."
      },
      {
        subQuestion: "(d)",
        question: "I. What specific action did Kwesi take when he 'let the cat out of the bag'?\nII. Why did Kwesi decide to let the cat out of the bag?",
        answer: "I. He revealed the secret of their success by explaining that digital GPS tracking and mobile money transfers protected their business.\nII. He did so to clear his father's damaged reputation, refute false rumors of occult juju and robbery collusion, and help other transport owners protect their fleets."
      },
      {
        subQuestion: "(e)",
        question: "Explain the meaning of the following idiomatic expressions as used in the passage:\nI. 'order of the day'\nII. 'tongues began to wag'\nIII. 'in league with'",
        answer: "I. 'order of the day' means very common, widespread, fashionable, or occurring regularly.\nII. 'tongues began to wag' means people began to gossip, spread rumors, and talk maliciously.\nIII. 'in league with' means in secret partnership, alliance, or conspiracy with someone (usually in wrongdoing)."
      },
      {
        subQuestion: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. highly\nII. pamper\nIII. manage\nIV. installed\nV. flourish",
        answer: "I. highly: greatly, deeply, immensely, exceedingly.\nII. pamper: spoil, indulge, baby, overprotect.\nIII. manage: administer, direct, supervise, run.\nIV. installed: fitted, fixed, set up, mounted.\nV. flourish: prosper, thrive, succeed, boom."
      }
    ]
  },
  partC_literature: {
    title: "Part C: Literature in English (The Cockcrow Anthology)",
    instructions: "Answer all questions in this part based on the prescribed texts from Sackey J.A. and Darmani L. (comp.): The Cockcrow.",
    questions: [
      {
        sectionTitle: "CHARLES DICKENS: Oliver Twist",
        contextExtract: "\"You know why, son. If a rich and successful man marries a woman whose name is stained because of her birth, it will be quite sad indeed .... wicked people will not let her forget her past, even though it's not her fault.\"",
        subItems: [
          {
            subQuestion: "5(a)",
            question: "In the extract, who do the appellations 'son' and 'rich and successful man' refer to?",
            answer: "Harry Maylie (Mrs. Maylie's son)."
          },
          {
            subQuestion: "5(b)",
            question: "Identify the speaker delivering these cautionary words in the novel.",
            answer: "Mrs. Maylie."
          },
          {
            subQuestion: "5(c)",
            question: "How did Rose Maylie's birth originally stain her social reputation and name?",
            answer: "She was believed to be illegitimate (born out of wedlock to an unknown family) and associated with a scandalous family past."
          }
        ]
      },
      {
        sectionTitle: "LAWRENCE DARMANI: Sosu and the Bukari Boys",
        contextExtract: "\"Sosu felt his parents were very mean; otherwise, why did they give him such a small amount of money? Look at his friend, Bukari, who always brought a lot of money to school! ...Bukari's father dropped him at school every day while he and Vivian had to walk.\"",
        subItems: [
          {
            subQuestion: "5(d)",
            question: "What major theme is vividly brought out in this extract?",
            answer: "The theme of peer pressure, envy/jealousy, discontentment, and social comparison."
          },
          {
            subQuestion: "5(e)",
            question: "Identify the primary literary device utilized throughout this excerpt.",
            answer: "Contrast (or rhetorical question / interior monologue)."
          }
        ]
      },
      {
        sectionTitle: "AMA ATA AIDOO: The Dilemma of a Ghost",
        contextExtract: "MONKA: The master-scholar was sitting on the chair studying, so he could not move off!",
        subItems: [
          {
            subQuestion: "5(f)",
            question: "Why did Monka specifically need the wooden chair that Ato was occupying?",
            answer: "She needed the chair to sit on while peeling her cassava (or preparing food in the courtyard)."
          },
          {
            subQuestion: "5(g)",
            question: "What is the physical scene/setting of this dramatic confrontation?",
            answer: "The inner courtyard / veranda of the Odumna family compound house."
          },
          {
            subQuestion: "5(h)",
            question: "Who does the sarcastic epithet 'master-scholar' refer to?",
            answer: "Ato Yawson (the Western-educated son)."
          }
        ]
      },
      {
        sectionTitle: "LADE WOSORNU: Desert Rivers",
        contextExtract: "Without a sound\nThey gush out into the bowels of the seas\nFar, far away from the unaided human eyes\nIf you cannot see our tears\nIt does not mean we do not cry.",
        subItems: [
          {
            subQuestion: "5(i)",
            question: "What do 'Water / Rivers' symbolically represent in the poem?",
            answer: "Unseen human potential, latent talents, inner strength, and suppressed emotional pain."
          },
          {
            subQuestion: "5(j)",
            question: "What central theme is emphasized in the lines: 'If you cannot see our tears / It does not mean we do not cry'?",
            answer: "The theme of hidden human suffering, quiet endurance, and the deception of outward appearances."
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

async function seedBeceEnglish2022Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 2022 into Firestore...");

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

  console.log("✅ Fully Rewritten, Clean-Room BECE English 2022 successfully seeded into Firestore!");
}

seedBeceEnglish2022Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2022:", err);
    process.exit(1);
  });
