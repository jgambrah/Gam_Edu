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
// ISOMORPHIC PASSAGE I: AMADU'S LITERACY AND MISFORTUNE (CALIBRATED ORIGINAL)
// =========================================================================
const passage1Text = `Because Amadu was exceptionally sharp and attentive, he quickly absorbed all that Master Bukari taught him regarding the fundamentals of reading and writing. Before long, he began earning supplementary income by serving as an informal scribe and reader for his fellow unlettered timber laborers. The workmen placed absolute confidence in him because he never divulged a single confidential detail contained in their family correspondence.

Amadu took his greatest pleasure on Saturdays when he received his weekly wage packet, and on Monday mornings when the laborers returned from their hometowns brimming with fresh village gossip and hearty laughter. Tragically, an unforeseen calamity altered Amadu's fortunes. One morning, as he stood admiring a giant mahogany tree he had just felled, a neighboring tree cut by another logger toppled unexpectedly in his direction. A heavy branch struck him violently across the forehead, tearing deep gashes across his face and knocking him senseless to the ground. His frantic coworkers carried his limp body to the St. Martin's Catholic Hospital.

The catastrophe changed Amadu's life permanently. His handsome facial features were marred by prominent scars, his physical vigor deserted him, and he lost his timber employment. Although he initially nursed the hope that his strength would return with time, Amadu grew feebler with every passing month.`;

const passage1Questions = [
  {
    number: 1,
    prompt: "According to Passage I, what practical skill did Master Bukari impart to Amadu?",
    options: [
      "The safe handling of timber cutting equipment",
      "The technique of harvesting valuable mahogany trees",
      "The fundamental art of reading and writing",
      "The custom of entertaining laborers with folklore"
    ],
    correctAnswer: "The fundamental art of reading and writing",
    hint: "Reread the opening sentence: he absorbed all that was taught regarding reading and writing.",
    workedSolution: "The narrative opens by stating that Master Bukari taught Amadu the literacy skills of reading and writing.",
    points: 1
  },
  {
    number: 2,
    prompt: "In Passage I, Amadu generated supplementary income on the timber concession by ............",
    options: [
      "clearing giant forest logs for contractors",
      "selling emergency medications from the clinic",
      "entertaining the logging crew on Monday mornings",
      "serving as a trusted confidential scribe and reader"
    ],
    correctAnswer: "serving as a trusted confidential scribe and reader",
    hint: "Look at paragraph one: he earned extra income as an informal letter-writer and reader.",
    workedSolution: "Amadu leveraged his literacy to read and write private letters for illiterate coworkers in exchange for modest fees.",
    points: 1
  },
  {
    number: 3,
    prompt: "Why did the illiterate laborers place unconditional trust in Amadu in Passage I?",
    options: [
      "He maintained strict secrecy over the private contents of their letters",
      "He penned and read their correspondence free of charge",
      "He participated actively in their humorous village gossip",
      "He was the strongest and most skillful woodcutter in the camp"
    ],
    correctAnswer: "He maintained strict secrecy over the private contents of their letters",
    hint: "Paragraph one notes: 'because he never divulged a single confidential detail...'",
    workedSolution: "The workmen trusted him completely because he kept all personal information disclosed in their letters strictly secret.",
    points: 1
  },
  {
    number: 4,
    prompt: "What long-term consequences did the forest accident inflict on Amadu in Passage I?",
    options: [
      "He suffered permanent mental instability and disorientation",
      "He completely lost his intellectual ability to read and write",
      "He suffered severe facial scarring, loss of bodily vigor, and unemployment",
      "He was permanently paralyzed in a hospital ward"
    ],
    correctAnswer: "He suffered severe facial scarring, loss of bodily vigor, and unemployment",
    hint: "Check the final paragraph: permanent scars, loss of strength, and loss of his job.",
    workedSolution: "The text explains that the falling tree scarred his face, drained his strength, and caused him to lose his job as he grew progressively weaker.",
    points: 1
  },
  {
    number: 5,
    prompt: "According to Passage I, why did Amadu eagerly anticipate Monday mornings?",
    options: [
      "Monday signaled the start of a productive working week",
      "He reunited with his companions and enjoyed their hometown news and humor",
      "He received his weekly cash wages on Mondays",
      "He dedicated the entire day to private literary studies"
    ],
    correctAnswer: "He reunited with his companions and enjoyed their hometown news and humor",
    hint: "Reread paragraph two: laborers returned on Mondays bringing gossip and laughter from their villages.",
    workedSolution: "Amadu enjoyed Mondays because his friends returned from the weekend sharing jokes, news, and lively gossip from their respective villages.",
    points: 1
  },
  {
    number: 6,
    prompt: "In Passage I, the expression 'knocking him senseless' indicates that Amadu ............",
    options: [
      "drifted into a peaceful evening slumber",
      "became mentally deranged and irrational",
      "forfeited his self-esteem and confidence",
      "lost conscious sensory perception of his surroundings"
    ],
    correctAnswer: "lost conscious sensory perception of his surroundings",
    hint: "Knocked senseless means rendered totally unconscious by a physical blow.",
    workedSolution: "'Knocked senseless' (or falling unconscious) means being deprived of sensory awareness and environmental consciousness.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: LEADERSHIP AND FRIENDSHIP (CALIBRATED ORIGINAL)
// =========================================================================
const passage2Text = `One can maintain warm friendships over many years, but when personal loyalty clashes with official responsibility, serious complications inevitably arise.

Almost all my companions and I were prominent members of our basic school's Athletic Supporters Club. At the start of our final academic year, the club convened to elect a new executive committee. Every member had an equal opportunity to contest for office. When I was chosen as President, I realized immediately that my assignment would be delicate, as I would be exercising authority over my closest personal friends. The crucial trial presented itself when the inter-schools sports tournament commenced.

Precisely as I had feared, recurring disagreements broke out. My peers refused to heed my directives. Instead of leading organized cheering chants for our athletes on the track, they preferred roaming the stadium grounds to have idle fun. Knowing that leadership demanded both motivation and firm discipline, I enforced strict attendance rules.

Several of my companions took deep offense at this approach. While some boycotted subsequent athletic meets, others gave me the cold shoulder and refused to converse with me.

Recognizing the growing rift, I summoned an open meeting with everyone. I admitted candidly that managing the club was burdensome, but since the mandate had fallen on me, I was resolved to execute my responsibilities faithfully. I appealed to them to leave sports rivalries on the field, assuring them that our personal bond of friendship meant far more to me than temporary prestige. That frank conversation cleared the air, and harmony was restored.`;

const passage2Questions = [
  {
    number: 7,
    prompt: "Why did the narrator foresee that presiding over the Supporters Club would prove difficult?",
    options: [
      "The general membership comprised final-year candidates only",
      "He was required to enforce institutional discipline over his intimate personal friends",
      "He had never participated in school athletics before",
      "He was forced to lead a hostile group of junior pupils"
    ],
    correctAnswer: "He was required to enforce institutional discipline over his intimate personal friends",
    hint: "Paragraph two states: 'I knew it would be a tough job because I would be in charge of my closest friends.'",
    workedSolution: "The narrator anticipated friction because exercising disciplinary authority over close friends inevitably creates social awkwardness and resentment.",
    points: 1
  },
  {
    number: 8,
    prompt: "Which of the following phrases best captures the initial posture of the narrator's friends during the sports meets?",
    options: [
      "Uncooperative and unruly",
      "Malicious and envious",
      "Violently confrontational",
      "Humorous and supportive"
    ],
    correctAnswer: "Uncooperative and unruly",
    hint: "They refused to listen, neglected cheering, and wandered about for fun.",
    workedSolution: "The friends exhibited an uncooperative and unruly attitude by ignoring directives and choosing idle fun over their assigned club duties.",
    points: 1
  },
  {
    number: 9,
    prompt: "According to Passage II, what was the ultimate resolution of the interpersonal conflict?",
    options: [
      "The narrator resolved the misunderstanding through honest, transparent dialogue",
      "The narrator permanently severed ties with his childhood friends",
      "The narrator stepped down immediately as club president",
      "The school authorities dissolved the Supporters Club"
    ],
    correctAnswer: "The narrator resolved the misunderstanding through honest, transparent dialogue",
    hint: "Check the final paragraph: the frank conversation cleared the air and resolved everything.",
    workedSolution: "By convening an open meeting and frankly separating leadership responsibilities from personal friendship, the narrator successfully resolved the rift.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the word 'disagreements' in 'recurring disagreements broke out' means ............",
    options: [
      "secret domestic resentments",
      "formal academic debates",
      "verbal quarrels and disputes",
      "physical boxing matches"
    ],
    correctAnswer: "verbal quarrels and disputes",
    hint: "'Disputes' or 'disagreements' refer to verbal conflicts and arguments.",
    workedSolution: "'Disagreements' or 'disputes' refers to arguments, controversies, or verbal friction between individuals.",
    points: 1
  }
];

// =========================================================================
// GENERAL SECTIONS B - E: SYNONYMS, IDIOMS, ANTONYMS, STRUCTURE
// (ALL ORIGINAL REWRITES MAPPING TO 1993 TARGETS)
// =========================================================================
const generalQuestions = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (11 - 15) ---
  {
    number: 11,
    prompt: "The production supervisor was dismissed from the factory for gross inefficiency.\nChoose the word nearest in meaning to 'inefficiency'.",
    options: ["sloth", "dishonesty", "incompetence", "truancy"],
    correctAnswer: "incompetence",
    hint: "Inability to perform duties to the required professional standard.",
    workedSolution: "'Inefficiency' means failure to produce adequate results due to lack of ability or competence; 'incompetence' is its direct synonym.",
    points: 1
  },
  {
    number: 12,
    prompt: "Through prudent economic management, inflation has been fairly controlled.\nChoose the phrase nearest in meaning to 'controlled'.",
    options: ["kept down", "kept away", "kept off", "kept out"],
    correctAnswer: "kept down",
    hint: "Restrained, held back, or prevented from rising.",
    workedSolution: "The phrasal verb 'to keep down' means to limit, restrain, or prevent prices/inflation from escalating.",
    points: 1
  },
  {
    number: 13,
    prompt: "Make sure you look over your calculation sheet before handing it in.\nChoose the phrase nearest in meaning to 'look over'.",
    options: ["watch steadily", "look on", "supervise", "read through and verify"],
    correctAnswer: "read through and verify",
    hint: "To inspect, check, or examine written work for errors.",
    workedSolution: "'To look over' means to inspect, review, or read through something carefully to verify accuracy.",
    points: 1
  },
  {
    number: 14,
    prompt: "Although the casual laborers undertook the task, they worked reluctantly.\nChoose the word nearest in meaning to 'reluctantly'.",
    options: ["leisurely", "nervously", "unwillingly", "cautiously"],
    correctAnswer: "unwillingly",
    hint: "With hesitation, disinclination, or lack of enthusiasm.",
    workedSolution: "'Reluctantly' means in an unwilling or hesitant manner; 'unwillingly' is its direct synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "The market pickpocket was thoroughly humiliated when apprehended by the crowd.\nChoose the word nearest in meaning to 'humiliated'.",
    options: ["penalized", "cautioned", "beaten up", "disgraced"],
    correctAnswer: "disgraced",
    hint: "Subjected to public shame, loss of dignity, or dishonor.",
    workedSolution: "'Humiliated' means subjected to intense shame and loss of respect; 'disgraced' is its closest equivalent.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "I dislike chatting with Ben because he is fond of pulling my leg. This means Ben is always ............",
    options: [
      "tripping me onto the pavement",
      "spreading slanderous rumors about me",
      "teasing me playfully with falsehoods",
      "borrowing my sports footwear"
    ],
    correctAnswer: "teasing me playfully with falsehoods",
    hint: "To tease, fool, or deceive someone playfully.",
    workedSolution: "The idiom 'to pull someone's leg' means to tease or joke with them playfully by telling them something untrue.",
    points: 1
  },
  {
    number: 17,
    prompt: "The arbitrator turned a deaf ear to the contractor's flimsy excuses. This means the arbitrator ............",
    options: [
      "suffered from partial deafness",
      "deliberately ignored the contractor's excuses",
      "upheld the contractor's arguments unconditionally",
      "pretended to record the contractor's testimony"
    ],
    correctAnswer: "deliberately ignored the contractor's excuses",
    hint: "Refusing to listen to or notice a plea or excuse.",
    workedSolution: "'To turn a deaf ear' is an idiom meaning to deliberately refuse to listen to or pay attention to an appeal.",
    points: 1
  },
  {
    number: 18,
    prompt: "To avoid bankruptcy, the financial advisor urged the entrepreneur to cut his coat according to his cloth. This means he should ............",
    options: [
      "live strictly within his financial income",
      "sew his garments personally",
      "procure cheap fabric for his family",
      "wear traditional attire to the office"
    ],
    correctAnswer: "live strictly within his financial income",
    hint: "Living and spending within one's available financial means.",
    workedSolution: "The proverb 'cut your coat according to your cloth' means to adjust one's lifestyle and spending according to one's resources.",
    points: 1
  },
  {
    number: 19,
    prompt: "Were it not for the swift intervention of the lifeguards, the swimmers would have drowned. This means that ............",
    options: [
      "the lifeguards joined the swimmers in the deep pool",
      "the prompt action of the lifeguards prevented the swimmers from drowning",
      "the lifeguards arrived after the swimmers had drowned",
      "the swimmers rescued the lifeguards from the current"
    ],
    correctAnswer: "the prompt action of the lifeguards prevented the swimmers from drowning",
    hint: "Counterfactual inversion: the intervention of the lifeguards was the decisive factor that prevented disaster.",
    workedSolution: "The inverted conditional clause 'Were it not for...' indicates that the lifeguards' action successfully prevented the tragedy.",
    points: 1
  },
  {
    number: 20,
    prompt: "Kweku has been in a bad way since the vehicular collision. This means that Kweku has been ............",
    options: [
      "harshly treated by his employer",
      "destitute and unable to buy food",
      "behaving rebelliously toward relatives",
      "seriously ill and in poor health"
    ],
    correctAnswer: "seriously ill and in poor health",
    hint: "In a poor physical, medical, or financial condition.",
    workedSolution: "The idiom 'to be in a bad way' means to be critically ill, in poor physical health, or experiencing grave distress.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "While our secondary school is now famous across the district, it was formerly ...... .\nChoose the word most nearly opposite in meaning to 'famous'.",
    options: ["renowned", "anonymous", "obscure", "disregarded"],
    correctAnswer: "obscure",
    hint: "'Famous' means widely known. Find the word meaning unknown or not prominent.",
    workedSolution: "'Famous' means celebrated and widely known. Its direct antonym regarding public reputation is 'obscure' (or unknown).",
    points: 1
  },
  {
    number: 22,
    prompt: "Our new headmaster is remarkably modest in his conduct, unlike his predecessor who was ...... .\nChoose the word most nearly opposite in meaning to 'modest'.",
    options: ["cordial", "generous", "particular", "boastful"],
    correctAnswer: "boastful",
    hint: "'Modest' means humble and unassuming. Find the word meaning arrogant and bragging.",
    workedSolution: "'Modest' means humble, unassuming, and unpretentious. Its direct antonym is 'boastful' (arrogant and bragging).",
    points: 1
  },
  {
    number: 23,
    prompt: "The prefect was cautioned for being rude to the visitor, while his assistant was commended for being ...... .\nChoose the word most nearly opposite in meaning to 'rude'.",
    options: ["respectful", "courteous", "submissive", "truthful"],
    correctAnswer: "courteous",
    hint: "'Rude' means impolite and ill-mannered. Find the word denoting polite, refined manners.",
    workedSolution: "'Rude' means discourteous and impolite. Its direct behavioral antonym is 'courteous' (or polite).",
    points: 1
  },
  {
    number: 24,
    prompt: "The pedestrians walked on the smooth sidewalk and avoided the ...... surface.\nChoose the word most nearly opposite in meaning to 'smooth'.",
    options: ["solid", "rough", "coarse", "uneven"],
    correctAnswer: "rough",
    hint: "'Smooth' means even and flat. Find the word denoting uneven, coarse texture.",
    workedSolution: "'Smooth' describes an even, flat surface. Its direct physical antonym regarding pavement texture is 'rough'.",
    points: 1
  },
  {
    number: 25,
    prompt: "The tyrannical ruler was denounced by the populace, whereas the democratic leader was enthusiastically ...... .\nChoose the word most nearly opposite in meaning to 'denounced'.",
    options: ["elected", "saluted", "supported", "counseled"],
    correctAnswer: "supported",
    hint: "'Denounced' means publicly condemned. Find the word meaning backed or upheld.",
    workedSolution: "'Denounced' means publicly condemned, criticized, or disowned. Its direct political antonym is 'supported' (backed or upheld).",
    points: 1
  },

  // --- SECTION E: STRUCTURE & QUESTION TAGS (26 - 40) ---
  {
    number: 26,
    prompt: "Our ancestors have ...... to us priceless cultural values and oral traditions.",
    options: ["handed in", "passed out", "passed through", "handed down"],
    correctAnswer: "handed down",
    hint: "Identify the phrasal verb meaning to transmit heritage across generations.",
    workedSolution: "The phrasal verb 'to hand down' means to pass traditions, values, or wisdom from older to younger generations.",
    points: 1
  },
  {
    number: 27,
    prompt: "The Ministry of Health has set ...... a specialized taskforce to curb the epidemic.",
    options: ["apart", "up", "in", "by"],
    correctAnswer: "up",
    hint: "Identify the phrasal verb meaning to establish, institute, or organize a committee.",
    workedSolution: "The phrasal verb 'to set up' means to establish, inaugurate, or institute a panel, committee, or organization.",
    points: 1
  },
  {
    number: 28,
    prompt: "None of the arrested trespassers ...... his guilt before the panel.",
    options: ["admit", "admits", "are admitting", "have admitted"],
    correctAnswer: "admits",
    hint: "In formal prescriptive English concord, 'None' meaning 'not one' takes a singular verb.",
    workedSolution: "In formal prescriptive English, 'none' meaning 'not one' takes the third-person singular present verb 'admits'.",
    points: 1
  },
  {
    number: 29,
    prompt: "Kofi promised to wait patiently at the workshop until his bicycle ...... repaired.",
    options: ["has been", "will be", "was", "can be"],
    correctAnswer: "was",
    hint: "Past sequence of tenses: The past verb 'promised' governs the past passive time clause.",
    workedSolution: "To maintain sequence of tenses following the past verb 'promised', the simple past passive 'was [repaired]' is required.",
    points: 1
  },
  {
    number: 30,
    prompt: "The headmaster, together with his administrative assistant, ...... inspecting the new science block.",
    options: ["will have been", "are", "have been", "is"],
    correctAnswer: "is",
    hint: "Parenthetical additions like 'together with...' do not alter the singular subject 'The headmaster'.",
    workedSolution: "Parenthetical additions introduced by 'together with' do not pluralize the singular subject 'The headmaster', taking singular 'is'.",
    points: 1
  },
  {
    number: 31,
    prompt: "I would have informed you about the wedding if I ...... of it earlier.",
    options: ["have known", "know", "had known", "have been knowing"],
    correctAnswer: "had known",
    hint: "Third Conditional: 'would have informed' in the main clause requires 'had + past participle' in the if-clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the if-clause takes the past perfect tense: 'had known'.",
    points: 1
  },
  {
    number: 32,
    prompt: "The candidate's handwriting was so illegible that the examiner could barely make it ......",
    options: ["on", "out", "down", "in"],
    correctAnswer: "out",
    hint: "Identify the phrasal verb meaning to decipher, read, or distinguish with difficulty.",
    workedSolution: "The phrasal verb 'to make out' means to decipher, read, or understand handwriting with difficulty.",
    points: 1
  },
  {
    number: 33,
    prompt: "You will fall ill if you ...... unwashed market fruits.",
    options: ["are eating", "eat", "had eaten", "ate"],
    correctAnswer: "eat",
    hint: "First Conditional: 'will + base verb' in the main clause requires the simple present in the if-clause.",
    workedSolution: "In a First Conditional sentence expressing a realistic future outcome, the conditional if-clause takes the simple present tense: 'eat'.",
    points: 1
  },
  {
    number: 34,
    prompt: "If it ...... necessary, I shall visit your office again at five o'clock.",
    options: ["is", "had been", "is being", "was"],
    correctAnswer: "is",
    hint: "First Conditional: Main clause future modal 'shall visit' requires the simple present indicative copula in the if-clause.",
    workedSolution: "In a future real conditional sentence governed by 'shall/will', the if-clause takes the simple present indicative copula: 'is'.",
    points: 1
  },
  {
    number: 35,
    prompt: "If the town council had not demolished the unauthorized stalls, the traders ...... operating there.",
    options: [
      "shall still be",
      "will still be",
      "are still going",
      "would have still been"
    ],
    correctAnswer: "would have still been",
    hint: "Third Conditional past continuous: 'had not demolished' requires 'would have + been + verb-ing' in the main clause.",
    workedSolution: "In a counterfactual past conditional construction, the hypothetical ongoing action requires 'would have still been [operating]'.",
    points: 1
  },
  {
    number: 36,
    prompt: "Mr. Mensah has never been satisfied with his workers' output, ......?",
    options: ["hasn't he", "didn't he", "has he", "did he"],
    correctAnswer: "has he",
    hint: "The sentence contains the negative adverb 'never' and present auxiliary 'has', requiring a positive tag.",
    workedSolution: "Because the statement is rendered negative by the adverb 'never' ('has never been'), the question tag must be affirmative: 'has he?'.",
    points: 1
  },
  {
    number: 37,
    prompt: "You prefer playing football to volleyball, ......?",
    options: ["do you", "will you", "won't you", "don't you"],
    correctAnswer: "don't you",
    hint: "The main verb 'prefer' is in the simple present affirmative with subject 'you'. Form a negative tag with 'do'.",
    workedSolution: "The main clause has an affirmative simple present verb ('prefer') and subject 'you'. Its corresponding question tag must be negative: 'don't you?'.",
    points: 1
  },
  {
    number: 38,
    prompt: "The store clerk was exceptionally disrespectful to his supervisor, ......?",
    options: ["was he", "wasn't he", "did he", "didn't he"],
    correctAnswer: "wasn't he",
    hint: "An affirmative past statement with copula 'was' and masculine subject takes the negative tag 'wasn't he?'.",
    workedSolution: "The statement is affirmative past with the copular verb 'was'. The corresponding question tag must be negative: 'wasn't he?'.",
    points: 1
  },
  {
    number: 39,
    prompt: "These days, many basic school pupils are not keenly interested ...... studying agricultural science.",
    options: ["on", "about", "of", "in"],
    correctAnswer: "in",
    hint: "Identify the preposition that regularly collocates with the adjective 'interested'.",
    workedSolution: "In standard English grammar, the adjective 'interested' is followed by the preposition 'in' ('interested in studying').",
    points: 1
  },
  {
    number: 40,
    prompt: "During the annual yam festival, Kwesi consumed ...... food than anyone else at the banquet.",
    options: ["more", "most", "much", "too much"],
    correctAnswer: "more",
    hint: "Comparing two quantities of a non-count noun ('food') followed by the comparative marker 'than'.",
    workedSolution: "When followed by the comparative particle 'than', the comparative quantifier 'more' is grammatically required ('more food than').",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199302);

// Attach Passage I and Passage II directly to questions 1-10 so that
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
    passageTitle = "Passage I: Amadu's Literacy and Misfortune";
    passageText = passage1Text;
    passage = passage1Text;
  } else if (qNum >= 7 && qNum <= 10) {
    passageTitle = "Passage II: Leadership and Friendship";
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
const passage2Items = balancedPaper1.slice(6, 10);
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
        category: "Informal / Directional Letter",
        prompt: "Write a letter to a friend attending school in another town who plans to visit your school, giving him or her accurate directions to locate the school and describing at least two fascinating features he or she will see during the visit.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 1993

Dear Kwaku,

I was delighted to receive your letter informing me of your upcoming visit to my school next Friday. I am excited to host you, and to ensure you arrive safely without losing your way, I am providing detailed directions to Methodist Junior Secondary School.

When your commercial bus arrives at the Bekwai Central Lorry Station, walk out through the main gate onto the Kumasi-Bekwai paved highway. Cross the pedestrian crossing carefully to the opposite side of the road, where you will see a prominent signpost for the Municipal Government Hospital. Take the paved avenue directly beside the hospital and walk straight for approximately three hundred meters until you reach a large round-about with an ancient silk-cotton tree. At this junction, branch to your immediate right onto Mission Road. Walk two minutes down the hill, and you will see our school's imposing arched green metal gate bearing our motto: "Wisdom and Industry."

During your visit, you will be captivated by two outstanding features of our school. First, you will explore our newly established Agricultural Science agroforestry plot. Under our teacher's guidance, we have cultivated a flourishing organic vegetable garden equipped with a solar-drip irrigation system and a rabbitry that has won first prize at the district farmers' day exhibitions.

Secondly, you will see our school's historic bronze trophy monument and our beautiful floral quadrangle, shaded by royal palm trees where our award-winning cultural drumming troupe rehearses in the afternoon.

Please inform me of your exact departure time from Kumasi so I can meet you at the school gate.

Your true friend,
[Signature]
Kwabena Mensah`
      },
      {
        questionNumber: "2",
        category: "Formal Letter",
        prompt: "As the Senior Prefect of your school, write a formal petition to your District Chief Executive (DCE) highlighting three acute problems that adversely affect the welfare and learning of pupils in your school, and appealing for municipal intervention.",
        modelAnswer: `Presbyterian Junior Secondary School
P. O. Box 80
Begoro, Eastern Region
18th October, 1993

The District Chief Executive
Fanteakwa District Assembly
District Directorate, Begoro

Dear Sir,

PETITION REGARDING INFRASTRUCTURAL DEFICITS AFFECTING STUDENTS' LEARNING AND WELFARE

On behalf of the student body of Presbyterian Junior Secondary School, Begoro, I respectfully submit this petition to draw your urgent attention to three pressing challenges that severely undermine our academic progress, and to appeal for municipal intervention.

First and foremost, our school suffers from a chronic deficit of classroom furniture. Over one hundred and twenty pupils sit on bare concrete floors or squeeze three to a desk designed for a single student. Writing in such uncomfortable postures causes severe back strain, untidy handwriting, and classroom fatigue, forcing teachers to spend valuable instructional time managing congestion. We humbly request the supply of one hundred dual desks.

Secondly, our technical skills workshop is completely bare and devoid of basic woodwork and metalwork tools. Although our BECE syllabus demands practical mastery of carpentry tools and electrical circuitry, our teachers are forced to teach purely theoretically on the chalkboard. Procuring basic hand tools will enable our students to develop employable technical competencies.

Finally, our school compound lacks potable water and modern sanitation facilities. Students trek to distant public boreholes during recess, resulting in chronic lateness. The lack of standard toilet facilities poses serious health hazards to both staff and pupils.

We trust that your esteemed administration will consider our plight and allocate resources from the District Assembly Common Fund to rehabilitate our school.

Thank you for your anticipated benevolence.

Yours faithfully,
[Signature]
Emmanuel Addo
(Senior Prefect)`
      },
      {
        questionNumber: "3",
        category: "Descriptive Narrative",
        prompt: "Describe an exciting and colorful traditional festival that was recently celebrated in your community, highlighting the cultural rites, pageantry, and community impact.",
        modelAnswer: `THE CELEBRATION OF THE ODWEIRA FESTIVAL IN BEGORO

Last September, the historic town of Begoro was engulfed in vibrant pageantry, traditional drumming, and reunion as the chiefs and people celebrated our annual Odweira festival. The festival marks a sacred season of cultural thanksgiving, traditional stool cleansing, and reconciliation.

The week-long celebration began with the customary ban on noise-making, followed by the sacred journey of the paramount stool elders to the ancestral forest sanctuary to perform purification rites. The climax of the festival took place on Saturday at the royal palace durbar grounds, attracting thousands of citizens, government dignitaries, and tourists from across the country.

The procession was breathtaking. Dressed in rich, handwoven kente cloths and adorned with heavy ancestral gold regalia, the divisional chiefs were carried through cheering crowds in majestic palanquins shaded by rotating velvet umbrellas. The royal fontomfrom drums beat thunderous warrior rhythms while agile young men fired antique muskets into the air, filling the atmosphere with acrid gunpowder smoke and excitement. At the center of the dais, the Omanhene, Daasebre Awuah Kotoko II, sat in state, receiving oaths of allegiance from his sub-chiefs.

Beyond the cultural spectacle, the festival provided a platform for developmental progress. At the grand durbar, our paramount chief launched a community educational endowment fund that raised ten million cedis to build a community library. Families prepared traditional delicacies—such as spicy mashed yam with boiled eggs and hot palm-nut soup with goat meat—welcoming visitors warmly. It was an unforgettable celebration that reinforced our cultural identity and communal solidarity.`
      },
      {
        questionNumber: "4",
        category: "Narrative Essay",
        prompt: "Describe in vivid detail a terrifying or extraordinary dream you had that made a lasting impression on your mind, recounting what happened and how you felt upon waking.",
        modelAnswer: `THE NIGHTMARE IN THE ENCHANTED CAVERN

Of all the strange dreams that have passed through my subconscious mind, there is one terrifying nightmare that remains as sharp in my memory as if it occurred yesterday.

It was during the tense week preceding our final BECE mock examinations. In the dream, I found myself wandering alone through a vast, fog-shrouded subterranean forest where the trees had pale, skeletal branches that whispered in an eerie wind. Suddenly, the earth beneath my feet gave way, and I plunged into a deep, cavernous limestone pit illuminated by an eerie phosphorescent glow.

In the center of the cavern sat an enormous stone desk behind which loomed a towering, hooded figure whose face was a faceless void. The figure pointed a bony finger at me and demanded in a voice that sounded like grinding rocks: "Hand over your examination script, for time is up!" Looking down at my hands, I discovered to my horror that I held a blank examination paper, and my pen refused to release ink. I tried desperately to write, but my fingers were paralyzed.

Around me, hundreds of cloaked examiners began chanting in unison, and the stone walls of the cavern began closing inward, threatening to crush me. My heart hammered wildly against my ribs as I tried to scream for help, but no sound escaped my throat. In a frantic surge of adrenaline, I lunged toward a narrow crack of light at the ceiling of the cave.

Just as the crushing stone walls touched my shoulders, I jolted awake with a loud gasp, drenched in cold sweat and panting heavily in my bed. Outside my window, the morning cock was crowing, and the gentle sunlight of a new day was streaming into my bedroom. Clasping my hands in relief, I realized it was only a nightmare born of academic anxiety, but it taught me never to postpone my revision to the last minute.`
      }
    ]
  }
};

async function seedBeceEnglish1993Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 1993 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_1993");
  await docRef.set({
    year: 1993,
    title: "BECE English Language 1993 (Calibrated National Benchmark)",
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
          title: "Passage I: Amadu's Literacy and Misfortune",
          text: passage1Text,
          questionRange: "Questions 1 to 6"
        },
        {
          id: "passage_2",
          title: "Passage II: Leadership and Friendship",
          text: passage2Text,
          questionRange: "Questions 7 to 10"
        }
      ],
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: Amadu's Literacy and Misfortune",
          text: passage1Text,
          questionRange: "Questions 1 to 6",
          questions: passage1Items
        },
        passage2: {
          passageTitle: "Passage II: Leadership and Friendship",
          text: passage2Text,
          questionRange: "Questions 7 to 10",
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

  console.log("✅ Fully Rewritten, Clean-Room BECE English 1993 successfully seeded into Firestore!");
}

seedBeceEnglish1993Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1993:", err);
    process.exit(1);
  });
