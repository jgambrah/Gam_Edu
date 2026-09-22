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
        return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });
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

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2006
const rawQuestions = [
  // --- PART I: SECTION A - READING COMPREHENSION PASSAGES (1 - 10) ---
  {
    number: 1,
    prompt: "According to Passage I, why did MaaTee suspend her morning domestic chores immediately Amma spoke?",
    options: [
      "She doubted the truth of Amma's complaint",
      "Amma had provoked her to anger",
      "She wanted to take Amma to the hospital for medical treatment",
      "Amma pleaded to be taken to the clinic"
    ],
    correctAnswer: "She wanted to take Amma to the hospital for medical treatment",
    hint: "Notice MaaTee's immediate protective reaction upon hearing her child complain of a headache.",
    workedSolution: "The narrative explains that MaaTee dropped her chores because of maternal care, ordering Amma to prepare immediately for the hospital.",
    points: 1
  },
  {
    number: 2,
    prompt: "In Passage I, the word 'daft' in 'I'm not so daft after all' means ............",
    options: ["disobedient", "good-natured", "strange", "unintelligent"],
    correctAnswer: "unintelligent",
    hint: "Foolish, stupid, or lacking cleverness.",
    workedSolution: "'Daft' is an informal adjective meaning foolish, stupid, or silly; 'unintelligent' is its direct equivalent.",
    points: 1
  },
  {
    number: 3,
    prompt: "According to Passage I, what was Amma's real physical condition when examined by the doctor?",
    options: [
      "She was suffering from severe malaria",
      "She was genuinely as fit as a fiddle and not ill",
      "She enjoyed sweeping the house",
      "She was exhausted from doing chores"
    ],
    correctAnswer: "She was genuinely as fit as a fiddle and not ill",
    hint: "The doctor discovered she was 'as fit as a fiddle' and had only feigned illness.",
    workedSolution: "The clinical examination revealed that Amma was perfectly healthy ('as fit as a fiddle') and was only pretending to be sick to dodge chores.",
    points: 1
  },
  {
    number: 4,
    prompt: "From the description in Passage I, what kind of parent was MaaTee?",
    options: ["A neglectful mother", "A caring and protective mother", "An overly strict parent", "A weak-willed mother"],
    correctAnswer: "A caring and protective mother",
    hint: "She dropped everything immediately to seek medical care for her child.",
    workedSolution: "MaaTee's prompt suspension of her work to take her complaining daughter to the hospital demonstrates that she was a loving and caring mother.",
    points: 1
  },
  {
    number: 5,
    prompt: "In Passage I, why did Amma sprint out of the doctor's consulting room with lightning speed?",
    options: [
      "She was terrified of receiving injections",
      "She remembered her unfinished sweeping at home",
      "She took pity on her anxious mother",
      "The doctor threatened to punish her"
    ],
    correctAnswer: "She was terrified of receiving injections",
    hint: "As soon as the doctor prescribed 'three injections', she bolted out the door.",
    workedSolution: "Amma fled because she had an overwhelming fear of medical needle injections prescribed to cure her 'feigned' illness.",
    points: 1
  },
  {
    number: 6,
    prompt: "According to Passage II, what remarkable biographical fact is true about Grandpa?",
    options: [
      "He is an impoverished invalid",
      "He is a frail and sickly elder",
      "He is an exceptionally old centenarian with clear eyesight",
      "He lives an isolated and lonely life"
    ],
    correctAnswer: "He is an exceptionally old centenarian with clear eyesight",
    hint: "A centenarian is someone who has attained 100 years of age.",
    workedSolution: "The passage opens by identifying Grandpa as a 'robust centenarian' (at least 100 years old) with sharp memory and clear vision.",
    points: 1
  },
  {
    number: 7,
    prompt: "According to Passage II, what general attitude do people in the community have toward Grandpa?",
    options: [
      "They fear his supernatural powers",
      "They deeply admire his vigor and wisdom",
      "They dislike his constant advice",
      "They barely tolerate his presence"
    ],
    correctAnswer: "They deeply admire his vigor and wisdom",
    hint: "People regularly ask him for the secret of his long, healthy life.",
    workedSolution: "The text explains that people marvel at Grandpa's longevity and seek his counsel, demonstrating broad admiration and respect.",
    points: 1
  },
  {
    number: 8,
    prompt: "In Passage II, the phrase 'devoid of' in 'live a free life devoid of stress' means ............",
    options: ["unless", "despite", "against", "completely without"],
    correctAnswer: "completely without",
    hint: "Free from, entirely lacking, or empty of something.",
    workedSolution: "'Devoid of' is a prepositional phrase meaning entirely lacking, empty of, or 'completely without'.",
    points: 1
  },
  {
    number: 9,
    prompt: "According to Grandpa's philosophy in Passage II, what function does a mirror perform in relation to human character?",
    options: [
      "It merely reflects and reproduces what is placed before it",
      "It alters a person's moral flaws",
      "It exaggerates human virtues",
      "It hides deceit from the world"
    ],
    correctAnswer: "It merely reflects and reproduces what is placed before it",
    hint: "Grandpa explains: 'The mirror merely reflects what is before it'.",
    workedSolution: "Grandpa uses the metaphor of the mirror to illustrate that how we treat others is simply reflected back to us by society.",
    points: 1
  },
  {
    number: 10,
    prompt: "Why does Grandpa advise his grandchildren to remain strictly truthful to themselves?",
    options: [
      "To amass physical wealth",
      "To gain political influence",
      "To avoid the trap of inventing more lies to cover falsehood",
      "To become fearless fighters"
    ],
    correctAnswer: "To avoid the trap of inventing more lies to cover falsehood",
    hint: "He explains that 'if we tell lies, we will have to create more lies to cover them'.",
    workedSolution: "Grandpa teaches that telling the truth keeps life free from anxiety, because one lie inevitably requires a web of further falsehoods to sustain.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (11 - 15) ---
  {
    number: 11,
    prompt: "All the junior pupils are skillful at assembling electronic components in the science club.\nChoose the word nearest in meaning to the underlined word 'skillful'.",
    options: ["interested", "lazy", "expert", "happy"],
    correctAnswer: "expert",
    hint: "Having or showing the knowledge, ability, or training to perform a task well.",
    workedSolution: "'Skillful' means having or showing expertise, dexterity, and competence; 'expert' is its direct synonym.",
    points: 1
  },
  {
    number: 12,
    prompt: "The benefactor who provided thirty dual desks to the school chose to remain anonymous.\nChoose the word nearest in meaning to the underlined word 'anonymous'.",
    options: ["quiet", "rich", "unimportant", "unknown"],
    correctAnswer: "unknown",
    hint: "Having an undisclosed name or unidentified authorship.",
    workedSolution: "'Anonymous' means nameless, unidentified, or undisclosed in identity; 'unknown' is its direct synonym.",
    points: 1
  },
  {
    number: 13,
    prompt: "Mr. Mensah is the most popular farmer in the district.\nChoose the word nearest in meaning to the underlined word 'popular'.",
    options: ["wanted", "respected", "liked", "feared"],
    correctAnswer: "liked",
    hint: "Admired, enjoyed, or favored by a great number of people.",
    workedSolution: "'Popular' means liked, admired, or supported by many people; 'liked' is its closest synonym.",
    points: 1
  },
  {
    number: 14,
    prompt: "The emergency Parent-Teacher Association meeting has been postponed.\nChoose the word nearest in meaning to the underlined word 'postponed'.",
    options: ["delayed", "cancelled", "announced", "held"],
    correctAnswer: "delayed",
    hint: "Deferred, put off to a later time or future date.",
    workedSolution: "'Postponed' means arranged to take place at a later date or time; 'delayed' (or deferred) is its closest equivalent.",
    points: 1
  },
  {
    number: 15,
    prompt: "While the elder brother is gentle, his sister is remarkably arrogant.\nChoose the word nearest in meaning to the underlined word 'arrogant'.",
    options: ["shy", "proud", "clever", "tough"],
    correctAnswer: "proud",
    hint: "Having an exaggerated sense of one's own importance and showing contempt for others.",
    workedSolution: "'Arrogant' means haughty, conceited, and overbearing; 'proud' is its direct synonym in this context.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "Your bicycle was costly, but my father bought his for a song. This means that my father's bicycle was ............",
    options: ["a secondhand item", "very cheap and inexpensive", "exceptionally beautiful", "an unconditional gift"],
    correctAnswer: "very cheap and inexpensive",
    hint: "Acquired at an extraordinarily low, bargain price.",
    workedSolution: "The idiom 'for a song' means very cheaply or at a remarkably low, bargain price.",
    points: 1
  },
  {
    number: 17,
    prompt: "Fatimah cautioned her brother that his friend had a loose tongue. This means that his friend ............",
    options: [
      "could not keep quiet",
      "could not be trusted to keep secrets",
      "had a severe speech defect",
      "was completely dishonest"
    ],
    correctAnswer: "could not be trusted to keep secrets",
    hint: "Habitually talking indiscreetly and revealing confidential secrets.",
    workedSolution: "A person with a 'loose tongue' is indiscreet, talks carelessly, and cannot be trusted to keep confidential matters secret.",
    points: 1
  },
  {
    number: 18,
    prompt: "Adzo's chronic theft and bad manners make her the black sheep of the family. This means that Adzo is a ............",
    options: ["neighborhood bully", "destructive person", "disgrace and embarrassment", "habitual liar"],
    correctAnswer: "disgrace and embarrassment",
    hint: "An odd, disreputable member who brings shame to an honorable family.",
    workedSolution: "The idiom 'the black sheep of the family' refers to a disreputable member of a family or group who brings shame or disgrace upon the rest.",
    points: 1
  },
  {
    number: 19,
    prompt: "When I arrived in Accra for the interview, Mr. Asah put me up for the night. This means that Mr. Asah ............",
    options: [
      "welcomed me at the station",
      "entertained me lavishly",
      "provided me with temporary lodging to sleep",
      "cautioned me against lateness"
    ],
    correctAnswer: "provided me with temporary lodging to sleep",
    hint: "Accommodating someone overnight in one's home.",
    workedSolution: "The phrasal verb 'to put someone up' means to provide them with temporary food and lodging in one's home.",
    points: 1
  },
  {
    number: 20,
    prompt: "Basic education takes the lion's share of the municipal budget. This means that basic education ............",
    options: [
      "exhausts all the funds completely",
      "is allocated the largest portion of the funds",
      "receives the smallest fraction of money",
      "depends on external bank loans"
    ],
    correctAnswer: "is allocated the largest portion of the funds",
    hint: "Receiving the greatest, disproportionately largest part of a shared resource.",
    workedSolution: "The idiom 'the lion's share' refers to the largest, majority, or predominant portion of something being distributed.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "The committee members were joyful because they held a fruitful deliberation, unlike the ...... meeting last week.",
    options: ["long", "useless", "short", "frank"],
    correctAnswer: "useless",
    hint: "'Fruitful' means productive and yielding good results. Find the word denoting barren, unproductive, or futile outcomes.",
    workedSolution: "'Fruitful' means productive and yielding beneficial results. Its direct antonym is 'useless' (unproductive, futile, or ineffective).",
    points: 1
  },
  {
    number: 22,
    prompt: "The apprentice complained that weeding the rocky plot was tedious, but painting the fence was ...... .",
    options: ["boring", "dirty", "good", "easy"],
    correctAnswer: "easy",
    hint: "'Tedious' means tiresome, laborious, and exhausting. Find the word meaning simple and effortless.",
    workedSolution: "'Tedious' means tiresome, laborious, and difficult. Its direct antonym regarding manual labor is 'easy' (effortless and simple).",
    points: 1
  },
  {
    number: 23,
    prompt: "The audience entered through the main entrance and departed through the rear ...... .",
    options: ["closure", "opening", "exit", "departure"],
    correctAnswer: "exit",
    hint: "'Entrance' is the way into a building. Find the word that denotes the way out.",
    workedSolution: "'Entrance' refers to the doorway or passage used for entering. Its direct architectural and directional antonym is 'exit' (the way out).",
    points: 1
  },
  {
    number: 24,
    prompt: "The magistrate ruled that the accused suspect was not guilty of the theft, but entirely ...... .",
    options: ["ignorant", "aware", "innocent", "careless"],
    correctAnswer: "innocent",
    hint: "'Guilty' means blameworthy of a crime. Find the word meaning free from legal culpability.",
    workedSolution: "'Guilty' means legally culpable for an offense. Its direct legal and ethical antonym is 'innocent' (free from blame).",
    points: 1
  },
  {
    number: 25,
    prompt: "Mrs. Addo acted as our gracious hostess for the dinner, while the visiting director was the chief ...... .",
    options: ["guest", "speaker", "guide", "sponsor"],
    correctAnswer: "guest",
    hint: "'Hostess' is the person who entertains others. Find the word for the person being entertained.",
    workedSolution: "'Hostess' is a woman who receives and entertains visitors. Her direct social counterpart and antonym is 'guest' (the visitor being entertained).",
    points: 1
  },

  // --- SECTION E: LEXIS AND STRUCTURE (26 - 40) ---
  {
    number: 26,
    prompt: "Mary and Comfort are ...... arriving by the evening passenger train.",
    options: ["both", "all", "either", "neither"],
    correctAnswer: "both",
    hint: "Use this pronoun when referring to the two persons collectively in an affirmative sentence.",
    workedSolution: "When referring to two specific individuals ('Mary and Comfort') together in an affirmative clause, 'both' is required. 'All' refers to three or more.",
    points: 1
  },
  {
    number: 27,
    prompt: "Abukari prefers playing football ...... swimming in the river.",
    options: ["by", "for", "than", "to"],
    correctAnswer: "to",
    hint: "The comparative verb 'prefer' takes the preposition 'to', never 'than'.",
    workedSolution: "In standard English, the verb 'prefer' takes 'to' when expressing a preference between two activities ('prefers X to Y').",
    points: 1
  },
  {
    number: 28,
    prompt: "All ...... you have testified before the commission is completely accurate.",
    options: ["what", "that", "which", "as"],
    correctAnswer: "that",
    hint: "The indefinite pronoun 'all' is followed by the relative pronoun 'that', never 'what'.",
    workedSolution: "In standard English relative clauses, the quantifier 'all' is modified by 'that' ('All that you are saying...'). Using 'what' here is a common grammatical error.",
    points: 1
  },
  {
    number: 29,
    prompt: "The master carpenter complained that the apprentice was ...... for his liking.",
    options: ["slow", "much slow", "slower", "too slow"],
    correctAnswer: "too slow",
    hint: "Identify the degree adverb that signifies an unacceptable, excessive defect.",
    workedSolution: "'Too slow' uses the adverb 'too' to express an excessive degree that causes dissatisfaction or falls below required standards.",
    points: 1
  },
  {
    number: 30,
    prompt: "Panyin is ...... taller than her twin sister Kakra.",
    options: ["more", "much", "so", "too"],
    correctAnswer: "much",
    hint: "Comparative adjectives ('taller') are intensified by 'much' or 'far', not 'more' or 'too'.",
    workedSolution: "Comparative adjectives like 'taller' are modified by degree adverbs such as 'much' or 'far' ('much taller'). Using 'more taller' is an error (double comparative).",
    points: 1
  },
  {
    number: 31,
    prompt: "The stray sheep has been missing from the kraal ...... last Saturday.",
    options: ["since", "from", "until", "for"],
    correctAnswer: "since",
    hint: "Use 'since' to denote the specific historical starting point of an ongoing condition.",
    workedSolution: "The preposition 'since' is used with the Present Perfect tense to denote a specific starting point in past time ('since Saturday') continuing to the present.",
    points: 1
  },
  {
    number: 32,
    prompt: "Akua, could you please ...... me your English dictionary for the weekend?",
    options: ["lend", "borrow", "afford", "buy"],
    correctAnswer: "lend",
    hint: "To give something temporarily is to 'lend'; to receive something temporarily is to 'borrow'.",
    workedSolution: "'Lend' means to grant temporary use of something expecting it back. 'Borrow' means to receive temporary use of an object.",
    points: 1
  },
  {
    number: 33,
    prompt: "Kofi insisted ...... painting the classroom walls without taking any wage.",
    options: ["in", "at", "on", "with"],
    correctAnswer: "on",
    hint: "Identify the preposition that regularly collocates with the verb 'insisted'.",
    workedSolution: "In standard English grammar, the verb 'insist' is followed by the preposition 'on' (or 'upon') and a gerund ('insisted on painting').",
    points: 1
  },
  {
    number: 34,
    prompt: "This exercise book is mine and that dictionary on the shelf is ......",
    options: ["your", "yours'", "your's", "yours"],
    correctAnswer: "yours",
    hint: "Absolute possessive pronouns never take apostrophes.",
    workedSolution: "'Yours' is an absolute possessive pronoun and never takes an apostrophe. Forms such as 'your's' or 'yours'' are completely non-standard.",
    points: 1
  },
  {
    number: 35,
    prompt: "If Asi had traveled to Beseasi yesterday, she ...... her grandmother.",
    options: ["would meet", "would have met", "will meet", "had met"],
    correctAnswer: "would have met",
    hint: "Third Conditional: 'If + past perfect' requires 'would have + past participle' in the main clause.",
    workedSolution: "In a Third Conditional sentence expressing a counterfactual past condition ('If Asi had gone'), the main clause takes 'would have + past participle' ('would have met').",
    points: 1
  },
  {
    number: 36,
    prompt: "You ate too much heavy food at the party, ......?",
    options: ["didn't you?", "don't you?", "haven't you?", "isn't it?"],
    correctAnswer: "didn't you?",
    hint: "The main verb 'ate' is in the simple past affirmative. The question tag must be past negative using 'did'.",
    workedSolution: "The main clause has an affirmative simple past verb ('ate'). Its corresponding question tag must be negative and use 'did': 'didn't you?'.",
    points: 1
  },
  {
    number: 37,
    prompt: "The visitor walked into the hall while I ...... my evening meal.",
    options: ["am having", "had", "have", "was having"],
    correctAnswer: "was having",
    hint: "An ongoing past continuous action ('was having') during which another past event occurred.",
    workedSolution: "The past continuous tense ('was having') is used after 'while' to describe an extended background action in the past interrupted by a simple past event ('came in').",
    points: 1
  },
  {
    number: 38,
    prompt: "The recalcitrant prisoner would neither speak ...... eat throughout the interrogation.",
    options: ["yet", "but", "or", "nor"],
    correctAnswer: "nor",
    hint: "Correlative pair: 'Neither' is always paired with 'nor'.",
    workedSolution: "The negative correlative conjunction 'neither' is invariably paired with 'nor' ('neither speak nor eat'). 'Either' pairs with 'or'.",
    points: 1
  },
  {
    number: 39,
    prompt: "Afote kindly offered his hungry seatmate ...... of his loaf of bread.",
    options: ["little", "few", "some", "any"],
    correctAnswer: "some",
    hint: "Use 'some' in affirmative statements to denote an unspecified positive amount of a mass noun.",
    workedSolution: "'Some' is used in affirmative declarative statements with uncountable nouns ('some of his bread'). 'Any' is used primarily in questions or negative statements.",
    points: 1
  },
  {
    number: 40,
    prompt: "Kwame and Anita are a devoted couple who have always loved ......",
    options: ["each other", "one another", "themselves", "each one"],
    correctAnswer: "each other",
    hint: "Reciprocal pronoun used when an action is mutually exchanged between two individuals.",
    workedSolution: "'Each other' is the reciprocal pronoun used when referring to two persons ('Kwame and Anita'). 'One another' is preferred for three or more.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 200601);

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
// PAPER 2: ESSAY WRITING (COMPOSITION)
// ==========================================
const paper2Calibrated = {
  sectionA_essay: {
    title: "Part A: Essay Writing",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Formal Letter",
        prompt: "Write a letter to your local Assemblyman suggesting three practical ways in which the youth and residents can collaborate to improve environmental sanitation and hygiene in your community.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Konongo, Ashanti Region
12th June, 2006

The Assemblyman
Konongo Central Electoral Area
Municipal Assembly, Konongo

Dear Sir,

PROPOSALS FOR COLLABORATIVE COMMUNITY ACTION TO IMPROVE SANITATION IN OUR ELECTORAL AREA

I respectfully write on behalf of the youth of Konongo Central to congratulate you on your civic leadership and to suggest three practical strategies through which our community can actively resolve the worsening sanitation crisis in our neighborhood.

First, I suggest the reinstatement of mandatory monthly communal clean-up exercises. In the past, communal labor effectively kept our public spaces clean. Through your office, our unit committee should designate the first Saturday of every month for clearing overgrown bushes, desilting choked storm drains, and sweeping public markets. The youth are fully prepared to mobilize wheelbarrows, rakes, and shovels to spearhead this communal effort.

Secondly, our electoral area urgently needs the placement of designated communal refuse containers at strategic locations. Currently, due to the lack of central waste disposal points, residents dump domestic refuse into open gutters, causing severe flooding and mosquito breeding during rainy seasons. Partnering with the municipal environmental health department to provide covered communal bins will eliminate illegal roadside dumps.

Finally, we must establish a vigorous public education campaign coupled with the strict enforcement of municipal sanitation bye-laws. Community health volunteers should visit households and churches to educate families on sorting waste, covering drinking water containers, and maintaining clean surroundings. Concurrently, environmental inspectors should fine recalcitrant residents caught disposing of human or domestic waste in unauthorized spaces.

We trust that your esteemed office will consider these recommendations to make Konongo clean, healthy, and prosperous.

Thank you.

Yours faithfully,
[Signature]
Kwaku Mensah
(Youth Secretary)`
      },
      {
        questionNumber: "2",
        category: "Informal Letter",
        prompt: "Write a letter to your elder brother who is working or studying in another region of Ghana, updating him on the latest exciting family and community news at home.",
        modelAnswer: `P. O. Box 22
Mampong, Ashanti Region
18th October, 2006

Dear Brother Yaw,

I hope this letter finds you in fine health, peace of mind, and thriving in your studies in Tamale. Life at home has been peaceful and eventful, and I am excited to share the latest family and community news with you.

First, you will be delighted to learn that our elder sister, Akosua, successfully gave birth to a bouncy baby boy last month! The christening ceremony was a joyful family occasion held at our family compound, attended by dozens of relatives and church members. Father named the child after Grandpa, and Mother has been pampering both mother and baby with delicious traditional nursing broths. We only missed your lively presence during the celebratory dancing.

Secondly, Father's cocoa harvest this main season has been phenomenal. Because of the new fertilizer methods introduced by the extension officers, our family plantation recorded its highest yield in a decade. Father has already used part of the proceeds to plaster our family house and connect electricity to all our bedrooms, meaning we no longer read under hurricane kerosene lamps at night!

In our community, the municipal assembly has finally completed the construction of the new asphalt road linking our village to the commercial market center. Commercial trotros now ply our route smoothly, cutting travel time in half.

Everyone at home sends their warm love and blessings. Please write back soon and inform us when you will be coming home for the Christmas holidays.

Your loving brother,
[Signature]
Kofi`
      },
      {
        questionNumber: "3",
        category: "Debate Speech",
        prompt: "You are the principal speaker in an inter-school debate on the motion: \"Television is doing more harm than good to students.\" Write your speech arguing either for or against the motion.",
        modelAnswer: `FOR THE MOTION: "TELEVISION IS DOING MORE HARM THAN GOOD TO STUDENTS"

Mr. Chairman, Distinguished Panel of Judges, Impartial Timekeeper, Worthy Opponents, and Fellow Students:

I stand firmly before you this afternoon to support the motion that: "Television is doing more harm than good to basic school students." While television was conceived as an informative medium, its unrestricted consumption has become an intellectual and moral hazard to our youth.

First and foremost, television viewing is the primary culprit behind the collapse of reading habits and poor academic performance among students. Basic education requires hours of dedicated study, reading comprehension, and problem solving. Unfortunately, countless students rush home after school only to spend five to six uninterrupted hours watching soap operas, cartoons, and musical videos. This excessive screen time causes chronic mental fatigue, displaces homework time, and results in widespread failures in national examinations like the BECE.

Secondly, television broadcasts expose impressionable young minds to moral degradation and violent antisocial behavior. Many television stations broadcast unrated foreign movies featuring violent crime, vulgar language, and immoral lifestyles that conflict with our cherished African values of modesty and respect. Gullible youths imitate these televised vices, leading to rising cases of school indiscipline, teenage delinquency, and substance abuse. Furthermore, prolonged sitting in front of television sets fosters physical inactivity, leading to childhood obesity and eye defects.

In conclusion, television has transformed our classrooms into sanctuaries of distraction and eroded the moral discipline of our youth. To safeguard our academic future and moral character, we must acknowledge that television currently causes far more harm than good to students.

Thank you.`
      },
      {
        questionNumber: "4",
        category: "Formal Nomination Letter",
        prompt: "Your school's Parent-Teacher Association (PTA) has instituted an annual Best Teacher Award Scheme. Write a letter to the PTA Committee nominating one of your teachers for the award and giving convincing reasons why he or she deserves the honor.",
        modelAnswer: `Presbyterian Junior High School
P. O. Box 104
Sunyani, Bono Region
25th November, 2006

The Chairman
Best Teacher Award Selection Committee
Parent-Teacher Association
Presbyterian JHS, Sunyani

Dear Sir,

NOMINATION OF MR. EMMANUEL OSEI FOR THE ANNUAL BEST TEACHER AWARD

I respectfully write on behalf of the student body to formally nominate our Integrated Science master, Mr. Emmanuel Osei, for the prestigious PTA Best Teacher Award for this academic year.

Mr. Osei is an extraordinarily dedicated educator whose passion for teaching has revolutionized science education in our school. In a school where we lack an elaborate modern science laboratory, Mr. Osei regularly uses his personal resources to improvise local teaching aids. He constructs clay models of human body organs, collects soil and plant specimens, and organizes practical field trips that make abstract scientific concepts tangible and easy to understand. Through his innovative pedagogy, our school's pass rate in Integrated Science rose from sixty percent to an unprecedented ninety-five percent in the recent mock examinations.

Furthermore, Mr. Osei's commitment to student welfare extends far beyond normal classroom contact hours. He organizes free remedial classes every Saturday morning for struggling students and candidates preparing for the BECE. Beyond academics, he serves as our patron for the Science and Debating Club and provides fatherly guidance to students facing domestic hardships, counseling them to stay focused on their education. His patience, moral integrity, and punctuality serve as a living model of excellence for both staff and pupils.

For his selfless dedication, pedagogical brilliance, and profound moral impact on our lives, Mr. Emmanuel Osei is richly deserving of the Best Teacher Award.

Thank you for instituting this noble scheme to reward educational excellence.

Yours faithfully,
[Signature]
Francisca Donkor
(School Prefect)`
      }
    ]
  }
};

const flattenedPaper2Questions = [
  ...paper2Calibrated.sectionA_essay.questions.map((q) => ({
    id: `essay_${q.questionNumber}`,
    partLabel: `Part A (Question ${q.questionNumber}) - ${q.category}`,
    prompt: q.prompt,
    modelAnswer: q.modelAnswer,
    marks: 30
  }))
];

async function seedBeceEnglish2006Calibrated() {
  console.log("Seeding Calibrated & Balanced BECE English 2006 into Firestore...");

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
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2006");
  await docRef.set({
    year: 2006,
    title: "BECE English Language 2006 (Calibrated National Benchmark)",
    subjectId: "english",
    metadata: {
      isPastQuestion: true,
      standard: "NaCCA / WAEC BECE Standard",
      totalMarks: 100,
      totalDurationMinutes: 120,
      paper1Count: balancedPaper1.length,
      optionsBalanced: true,
      unplagiarizedPedagogicalAdaptation: true,
      updatedAt: new Date()
    },
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      questions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Essay Writing (Composition)",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Calibrated BECE English 2006 successfully seeded into Firestore!");
}

seedBeceEnglish2006Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2006:", err);
    process.exit(1);
  });
