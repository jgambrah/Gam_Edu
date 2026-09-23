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
// PASSAGE I: BAKO'S MISFORTUNE
// ==========================================
const passage1Text = `Bako was both intelligent and hardworking, so he soon learnt all that Garba taught him of the art of reading and writing. Now he was able to earn a little extra income as a letter-writer and reader to his fellow illiterate labourers. All the people trusted him because he never revealed any information he got from the letters to anyone.

Bako's happiest moments came on Saturdays when he received his pay and on Mondays when the labourers returned to work bringing with them all the gossip and laughter of their villages. Unfortunately, a misfortune befell Bako. One day, as he stood gazing proudly at a big tree which he had just felled, another tree being cut down by a fellow labourer struck him on the head. The branches tore his face and he fell unconscious. His friends carried him to Adom Hospital.

The accident changed Bako's life. His handsome face became permanently scarred. He lost his strength and his job. At first, he hoped that in time he would regain his strength, but Bako grew weaker and weaker.`;

const passage1QuestionsRaw = [
  {
    number: 1,
    prompt: "According to Passage I, what valuable skill did Garba teach Bako?",
    options: [
      "How to use a sharp machete properly",
      "How to fell commercial timber trees",
      "The practical art of reading and writing",
      "How to entertain laborers with village gossip"
    ],
    correctAnswer: "The practical art of reading and writing",
    hint: "Reread the opening sentence: 'learnt all that Garba taught him of the art of reading and writing.'",
    workedSolution: "The passage explicitly opens by stating that Garba instructed Bako in the literacy skills of reading and writing.",
    points: 1
  },
  {
    number: 2,
    prompt: "In Passage I, Bako earned supplementary income among the timber workers by ............",
    options: [
      "felling giant trees in the forest",
      "selling medications from the hospital",
      "entertaining his companions on Mondays",
      "serving as a confidential letter-writer and reader"
    ],
    correctAnswer: "serving as a confidential letter-writer and reader",
    hint: "Check paragraph one: 'earn a little extra income as a letter-writer and reader to his fellow illiterate labourers.'",
    workedSolution: "Bako capitalized on his literacy to read and draft personal correspondence for his illiterate coworkers for a fee.",
    points: 1
  },
  {
    number: 3,
    prompt: "Why did the illiterate laborers place absolute trust in Bako in Passage I?",
    options: [
      "He kept their confidential private matters strictly secret",
      "He read and penned their letters free of charge",
      "He joined them in laughing and sharing gossip",
      "He was the strongest timber cutter on the site"
    ],
    correctAnswer: "He kept their confidential private matters strictly secret",
    hint: "Look at paragraph one: 'because he never revealed any information he got from the letters to anyone.'",
    workedSolution: "Bako earned their complete confidence by maintaining strict confidentiality over the private secrets disclosed in their letters.",
    points: 1
  },
  {
    number: 4,
    prompt: "What devastating long-term impact did the logging accident inflict on Bako in Passage I?",
    options: [
      "He lost his mental reasoning and sanity",
      "He completely lost the ability to read and write",
      "He suffered permanent physical weakness, severe facial scarring, and unemployment",
      "He was permanently confined to a hospital bed"
    ],
    correctAnswer: "He suffered permanent physical weakness, severe facial scarring, and unemployment",
    hint: "Check paragraph three: 'His handsome face became permanently scarred. He lost his strength and job... grew weaker and weaker.'",
    workedSolution: "The tragic accident cost him his physical strength, scarred his handsome features, and resulted in the loss of his livelihood.",
    points: 1
  },
  {
    number: 5,
    prompt: "According to Passage I, why were Monday mornings particularly enjoyable for Bako?",
    options: [
      "Monday represented the start of the working week",
      "He reunited with his fellow laborers and enjoyed their village gossip and humor",
      "He received his weekly wages on Mondays",
      "He spent the entire day reading literature"
    ],
    correctAnswer: "He reunited with his fellow laborers and enjoyed their village gossip and humor",
    hint: "Paragraph two notes that on Mondays the laborers returned bringing gossip and laughter.",
    workedSolution: "Bako loved Mondays because his coworkers returned from their villages sharing joyful news, humor, and lively stories.",
    points: 1
  },
  {
    number: 6,
    prompt: "In Passage I, the expression 'he fell unconscious' means that Bako ............",
    options: [
      "drifted into a deep restful sleep",
      "became mentally deranged",
      "lost all his personal self-confidence",
      "lost physical awareness and sensation of his surroundings"
    ],
    correctAnswer: "lost physical awareness and sensation of his surroundings",
    hint: "To be knocked out cold; lacking conscious sensory perception.",
    workedSolution: "'Unconscious' describes a comatose state of lacking sensory perception and environmental awareness caused by physical trauma.",
    points: 1
  }
];

// ==========================================
// PASSAGE II: FRIENDSHIP AND LEADERSHIP DUTY
// ==========================================
const passage2Text = `We can have close friends for a very long time. But when friendship and duty come into conflict, as I once experienced, many problems may occur.

Almost all my friends and I were leading members of our school's Supporters Club. In the beginning of our final year, it was time to elect new officers for the club. Everyone stood the chance of being elected. When I was elected as President, I knew it would be a tough job because I would be in charge of my closest friends. The real test would come when the sports season started.

Just as I had imagined, there were many disputes. No one listened to what I said. Everyone just wanted to have fun instead of cheering our athletes. I knew I had to motivate them and use discipline, and that was exactly what I did.

Many of my friends could not understand this. While some of them stopped coming to the games, others were not talking to me at all.

I finally decided to have a talk with everyone. I frankly admitted that I did not like the job, but since I had it, I was determined to do my best. I also told them to leave sports matters on the field because my friends were more important to me than the job. From that little talk, I had everything resolved.`;

const passage2QuestionsRaw = [
  {
    number: 7,
    prompt: "Why did the writer anticipate that serving as Supporters Club President would be exceptionally challenging?",
    options: [
      "The other club members were all final-year candidates",
      "He would be required to enforce discipline over his own intimate friends",
      "He lacked prior organizational leadership experience",
      "He was forced to lead unfamiliar junior students"
    ],
    correctAnswer: "He would be required to enforce discipline over his own intimate friends",
    hint: "Paragraph two states: 'I knew it would be a tough job because I would be in charge of my closest friends.'",
    workedSolution: "The narrator recognized that exerting authority and enforcing rules over close personal friends creates interpersonal friction.",
    points: 1
  },
  {
    number: 8,
    prompt: "Which of the following adjectives best characterizes the initial conduct of the writer's friends during the sports season?",
    options: ["Uncooperative and unruly", "Envious and malicious", "Openly abusive and hostile", "Humorous and helpful"],
    correctAnswer: "Uncooperative and unruly",
    hint: "They refused to listen, neglected cheering, and boycotted games.",
    workedSolution: "The friends refused to follow instructions, preferred idle fun, and boycotted activities, showing uncooperative behavior.",
    points: 1
  },
  {
    number: 9,
    prompt: "According to Passage II, which of the following statements is true regarding the final outcome?",
    options: [
      "The writer successfully resolved the misunderstanding through open, honest dialogue",
      "The writer permanently severed communication with his friends",
      "The writer lost all his intimate childhood friends",
      "The writer resigned immediately as club president"
    ],
    correctAnswer: "The writer successfully resolved the misunderstanding through open, honest dialogue",
    hint: "Check the final paragraph: 'From that little talk, I had everything resolved.'",
    workedSolution: "By convening a frank meeting and distinguishing between leadership duty and personal friendship, the writer amicably settled the rift.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the word 'disputes' in 'there were many disputes' means ............",
    options: [
      "secret misgivings",
      "formal academic debates",
      "verbal disagreements and quarrels",
      "physical combat"
    ],
    correctAnswer: "verbal disagreements and quarrels",
    hint: "Arguments, controversies, or heated disagreements.",
    workedSolution: "'Disputes' refers to arguments, conflicts, or verbal disagreements between parties; 'verbal disagreements and quarrels' is its direct meaning.",
    points: 1
  }
];

// ==========================================
// GENERAL LEXIS AND STRUCTURE (11 - 40)
// ==========================================
const generalQuestionsRaw = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (11 - 15) ---
  {
    number: 11,
    prompt: "The transport manager was dismissed from service for gross inefficiency.\nChoose the word nearest in meaning to the underlined word 'inefficiency'.",
    options: ["laziness", "dishonesty", "incompetence", "misconduct"],
    correctAnswer: "incompetence",
    hint: "Inability to perform work or duties satisfactorily.",
    workedSolution: "'Inefficiency' means failure to produce desired results due to lack of competence or skill; 'incompetence' is its direct synonym.",
    points: 1
  },
  {
    number: 12,
    prompt: "Through government subsidies, the retail prices of essential commodities have been fairly controlled.\nChoose the word nearest in meaning to the underlined phrase 'controlled'.",
    options: ["kept down", "kept away", "kept off", "kept out"],
    correctAnswer: "kept down",
    hint: "Restrained, held back, or prevented from escalating.",
    workedSolution: "The phrasal verb 'to keep down' means to limit, restrain, or prevent prices from rising.",
    points: 1
  },
  {
    number: 13,
    prompt: "Candidates are strongly reminded to look over their scripts before submitting.\nChoose the word nearest in meaning to the underlined phrase 'look over'.",
    options: ["watch carefully", "look on", "oversee", "read through and inspect"],
    correctAnswer: "read through and inspect",
    hint: "To examine, review, or check through written work.",
    workedSolution: "'To look over' means to inspect, review, or read through something carefully to detect mistakes.",
    points: 1
  },
  {
    number: 14,
    prompt: "Although the casual laborers agreed to weed the compound, they worked reluctantly.\nChoose the word nearest in meaning to the underlined word 'reluctantly'.",
    options: ["leisurely", "nervously", "unwillingly", "sparingly"],
    correctAnswer: "unwillingly",
    hint: "With hesitation, disinclination, or lack of enthusiasm.",
    workedSolution: "'Reluctantly' means in an unwilling or hesitant manner; 'unwillingly' is its direct synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "The petty shoplifter was thoroughly humiliated when apprehended in the market.\nChoose the word nearest in meaning to the underlined word 'humiliated'.",
    options: ["sentenced", "cautioned", "beaten up", "disgraced"],
    correctAnswer: "disgraced",
    hint: "Made to feel profound shame, dishonor, or public embarrassment.",
    workedSolution: "'Humiliated' means subjected to public shame and loss of pride; 'disgraced' is its closest equivalent.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "I dislike associating with Ben because he is fond of pulling my legs. This means Ben is always ............",
    options: [
      "tripping me onto the floor",
      "spreading malicious gossip about me",
      "teasing me playfully with falsehoods",
      "borrowing my personal shoes"
    ],
    correctAnswer: "teasing me playfully with falsehoods",
    hint: "To fool, tease, or joke with someone by telling untrue stories.",
    workedSolution: "The idiom 'to pull someone's leg' means to tease or deceive them playfully as a practical joke.",
    points: 1
  },
  {
    number: 17,
    prompt: "The judge turned a deaf ear to the plea of the hardened armed robber. This means the judge ............",
    options: [
      "suffered from acute hearing loss",
      "deliberately ignored what the convict pleaded",
      "favored the convict unconditionally",
      "pretended to take detailed notes"
    ],
    correctAnswer: "deliberately ignored what the convict pleaded",
    hint: "Refusing to listen, notice, or grant consideration to a request.",
    workedSolution: "'To turn a deaf ear' is an idiom meaning to deliberately refuse to listen to, notice, or grant attention to a statement.",
    points: 1
  },
  {
    number: 18,
    prompt: "To avoid chronic debt, the accountant advised us to cut our coat according to our cloth. This means we should ............",
    options: [
      "live strictly within our financial income",
      "tailor our clothes personally",
      "purchase fabric before sowing",
      "wear traditional cloths and coats"
    ],
    correctAnswer: "live strictly within our financial income",
    hint: "Living and spending within one's available means and resources.",
    workedSolution: "The proverb 'cut your coat according to your cloth' means to adjust one's lifestyle and spending according to one's financial capacity.",
    points: 1
  },
  {
    number: 19,
    prompt: "Were it not for the timely arrival of the police, the demonstrators would have rioted. From this statement we know that ............",
    options: [
      "the police joined the rioting workers",
      "the police intervention prevented the demonstration from turning into a riot",
      "the police encouraged the workers to riot",
      "the workers assaulted the police detachment"
    ],
    correctAnswer: "the police intervention prevented the demonstration from turning into a riot",
    hint: "Counterfactual inversion: the intervention of the police successfully stopped the riot.",
    workedSolution: "The inverted conditional clause 'Were it not for...' indicates that the presence of the police was the decisive factor that prevented the riot from happening.",
    points: 1
  },
  {
    number: 20,
    prompt: "Razak has been in a bad way since the bus accident. This means that Razak has been ............",
    options: [
      "harshly treated by his peers",
      "unable to find food for days",
      "misbehaving toward his elders",
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
    prompt: "While our secondary school is now famous across the country, it was previously ...... .",
    options: ["popular", "anonymous", "unknown", "irrelevant"],
    correctAnswer: "unknown",
    hint: "'Famous' means widely known and celebrated. Find the word meaning not known to the public.",
    workedSolution: "'Famous' means widely known and recognized. Its direct antonym regarding public reputation is 'unknown' (obscure).",
    points: 1
  },
  {
    number: 22,
    prompt: "Our resident pastor is exceptionally modest in his demeanor, unlike his predecessor who was ...... .",
    options: ["friendly", "kind", "particular", "boastful"],
    correctAnswer: "boastful",
    hint: "'Modest' means humble and unpretentious. Find the word meaning proud and bragging.",
    workedSolution: "'Modest' means humble, reserved, and unpretentious. Its direct antonym is 'boastful' (arrogant and bragging).",
    points: 1
  },
  {
    number: 23,
    prompt: "Issa was severely cautioned for being rude to the matron, but his brother remained ...... .",
    options: ["respectful", "polite", "obedient", "truthful"],
    correctAnswer: "polite",
    hint: "'Rude' means impolite and ill-mannered. Find the word that denotes refined, courteous manners.",
    workedSolution: "'Rude' means impolite and discourteous. Its direct behavioral antonym is 'polite' (or courteous).",
    points: 1
  },
  {
    number: 24,
    prompt: "The children walked along the smooth walkway and avoided the ...... gravel path.",
    options: ["hard", "rough", "coarse", "slippery"],
    correctAnswer: "rough",
    hint: "'Smooth' means having an even surface. Find the word denoting an uneven, coarse surface.",
    workedSolution: "'Smooth' describes an even, flat surface. Its direct physical antonym regarding pavement texture is 'rough'.",
    points: 1
  },
  {
    number: 25,
    prompt: "The military dictator was denounced by the populace, but the democratic leader was ...... .",
    options: ["elected", "welcomed", "supported", "advised"],
    correctAnswer: "supported",
    hint: "'Denounced' means publicly condemned or opposed. Find the word meaning backed, upheld, or approved.",
    workedSolution: "'Denounced' means publicly condemned, criticized, or disowned. Its direct political antonym is 'supported' (backed or upheld).",
    points: 1
  },

  // --- SECTION E: LEXIS AND STRUCTURE (26 - 40) ---
  {
    number: 26,
    prompt: "Our ancestors have ...... to us rich cultural heritage and oral folklore.",
    options: ["handed in", "passed out", "passed through", "handed down"],
    correctAnswer: "handed down",
    hint: "Identify the phrasal verb meaning to transmit traditions or knowledge across generations.",
    workedSolution: "The phrasal verb 'to hand down' means to pass traditions, values, or wisdom from older to younger generations.",
    points: 1
  },
  {
    number: 27,
    prompt: "The Ministry of Education has set ...... an expert committee on basic school curriculum reform.",
    options: ["apart", "up", "in", "by"],
    correctAnswer: "up",
    hint: "Identify the phrasal verb meaning to establish, institute, or organize a committee.",
    workedSolution: "The phrasal verb 'to set up' means to establish, inaugurate, or institute a panel, committee, or organization.",
    points: 1
  },
  {
    number: 28,
    prompt: "None of the arrested burglary suspects ...... his involvement in the crime.",
    options: ["admit", "admits", "are admitting", "have admitted"],
    correctAnswer: "admits",
    hint: "In formal prescriptive English concord, the indefinite pronoun 'None' followed by of-phrase takes a singular verb.",
    workedSolution: "In formal English, 'none' meaning 'not one' takes the third-person singular present verb 'admits'.",
    points: 1
  },
  {
    number: 29,
    prompt: "Amidu promised to remain patient in the workshop until his damaged bicycle ...... repaired.",
    options: ["has been", "will be", "was", "can be"],
    correctAnswer: "was",
    hint: "Past sequence of tenses: The past reporting verb 'promised' governs the past passive time clause.",
    workedSolution: "To maintain sequence of tenses following the past verb 'promised', the simple past passive 'was [repaired]' is required.",
    points: 1
  },
  {
    number: 30,
    prompt: "The Headmaster, together with his administrative assistant, ...... inspecting the new science block.",
    options: ["will have been", "are", "have been", "is"],
    correctAnswer: "is",
    hint: "Parenthetical phrases like 'together with...' do not affect the singular head noun 'The Headmaster'.",
    workedSolution: "Parenthetical additions introduced by 'together with' or 'with' do not pluralize the singular subject 'The Headmaster', requiring the singular verb 'is'.",
    points: 1
  },
  {
    number: 31,
    prompt: "I would have informed you about the wedding date if I ...... of it earlier.",
    options: ["have known", "know", "had known", "have been knowing"],
    correctAnswer: "had known",
    hint: "Third Conditional: 'would have + past participle' in the main clause requires 'had + past participle' in the if-clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the if-clause must use the past perfect tense: 'had known'.",
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
    prompt: "You will fall ill if you ...... unwashed street food.",
    options: ["are eating", "eat", "had eaten", "ate"],
    correctAnswer: "eat",
    hint: "First Conditional: 'will + base verb' in the main clause requires the simple present in the if-clause.",
    workedSolution: "In a First Conditional sentence expressing a realistic future outcome ('You will be ill'), the conditional if-clause takes the simple present tense: 'eat'.",
    points: 1
  },
  {
    number: 34,
    prompt: "If it ...... necessary, I shall visit your office again at six o'clock.",
    options: ["is", "had been", "is being", "was"],
    correctAnswer: "is",
    hint: "First Conditional: The main clause future modal 'shall see' requires the simple present copula in the if-clause.",
    workedSolution: "In a future real conditional sentence governed by 'shall/will', the if-clause takes the simple present indicative copula: 'is'.",
    points: 1
  },
  {
    number: 35,
    prompt: "If the municipal assembly had not demolished the unauthorized stalls, the traders ...... operating there.",
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
    prompt: "Mr. Adu has never been satisfied with his children's terminal performance, ......?",
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
    prompt: "The cashier was exceptionally disrespectful to his supervisor, ......?",
    options: ["was he", "wasn't he", "did he", "didn't he"],
    correctAnswer: "wasn't he",
    hint: "An affirmative past statement with the linking verb 'was' and masculine subject takes the negative tag 'wasn't he?'.",
    workedSolution: "The statement is affirmative past with the copular verb 'was'. The corresponding question tag must be negative: 'wasn't he?'.",
    points: 1
  },
  {
    number: 39,
    prompt: "These days, many basic school pupils are not keenly interested ...... learning French.",
    options: ["on", "about", "of", "in"],
    correctAnswer: "in",
    hint: "Identify the preposition that regularly collocates with the adjective 'interested'.",
    workedSolution: "In standard English grammar, the adjective 'interested' is followed by the preposition 'in' ('interested in improving').",
    points: 1
  },
  {
    number: 40,
    prompt: "During the harvest festival, Kofi consumed ...... food than anyone else at the banquet.",
    options: ["more", "most", "much", "too much"],
    correctAnswer: "more",
    hint: "Comparing two quantities of a non-count noun ('food') followed by the comparative marker 'than'.",
    workedSolution: "When followed by the comparative particle 'than', the comparative quantifier 'more' is grammatically required ('more food than').",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199301);

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

// Partition Questions for Passage-First UI Rendering
const passage1Questions = balancedPaper1.slice(0, 6);
const passage2Questions = balancedPaper1.slice(6, 10);
const remainingQuestions = balancedPaper1.slice(10);

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

async function seedBeceEnglish1993Calibrated() {
  console.log("Seeding Calibrated & Passage-First BECE English 1993 into Firestore...");

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
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      // Section A: Passage-First Comprehension Architecture
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: Bako's Misfortune",
          text: passage1Text,
          questionRange: "Questions 1 to 6",
          questions: passage1Questions
        },
        passage2: {
          passageTitle: "Passage II: Friendship and Leadership Duty",
          text: passage2Text,
          questionRange: "Questions 7 to 10",
          questions: passage2Questions
        }
      },
      // Sections B - E: Lexis, Synonyms, Idioms, Antonyms, and Structure
      sectionB_to_E: {
        title: "Sections B - E: Lexis, Idioms, Antonyms and Structure",
        questionRange: "Questions 11 to 40",
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

  console.log("✅ Calibrated & Passage-First BECE English 1993 successfully seeded into Firestore!");
}

seedBeceEnglish1993Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1993:", err);
    process.exit(1);
  });
