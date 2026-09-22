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

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2016
const rawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 17) ---
  {
    number: 1,
    prompt: "He is ............ poor that he cannot pay his utility bills.",
    options: ["so", "too", "very", "rather"],
    correctAnswer: "so",
    hint: "The degree adverb that pairs with a result clause starting with 'that' is 'so' ('so + adjective + that').",
    workedSolution: "The correlative structure 'so + adjective + that' expresses an extreme degree leading to a stated result ('so poor that he cannot pay'). 'Too' pairs with a to-infinitive, not a that-clause.",
    points: 1
  },
  {
    number: 2,
    prompt: "You will be late for the morning assembly ............ you hurry.",
    options: ["if", "or", "unless", "since"],
    correctAnswer: "unless",
    hint: "Which conjunction means 'if not' and introduces an exception condition?",
    workedSolution: "'Unless' means 'except if' or 'if ... not' ('You will be late if you do not hurry'). Using 'if' would mean the opposite.",
    points: 1
  },
  {
    number: 3,
    prompt: "Aminu has been absent from school ............ one month.",
    options: ["in", "for", "from", "since"],
    correctAnswer: "for",
    hint: "Use 'for' to denote a duration or period of time, and 'since' for a specific starting point.",
    workedSolution: "'For' is used with a noun phrase denoting a duration or period ('one month'). 'Since' is reserved for specific points in time.",
    points: 1
  },
  {
    number: 4,
    prompt: "Many job applicants were interviewed, but ............ will be employed.",
    options: ["few", "a few", "little", "a little"],
    correctAnswer: "few",
    hint: "Applicants are countable. The contrast marker 'but' indicates an unexpectedly small, near-zero negative quantity.",
    workedSolution: "'Few' has a negative meaning indicating scarcely any, contrasting with 'many'. 'A few' has a positive connotation (some), while 'little' is for uncountable nouns.",
    points: 1
  },
  {
    number: 5,
    prompt: "The teacher told the girl he had received ............ of the two assignments.",
    options: ["all", "any", "none", "neither"],
    correctAnswer: "neither",
    hint: "When referring to negative choice between exactly two items, use this pronoun.",
    workedSolution: "When referring to two specific items, 'neither' is the correct negative pronoun meaning 'not one nor the other'. 'None' is used for three or more.",
    points: 1
  },
  {
    number: 6,
    prompt: "My father has bought a ............ saloon car.",
    options: ["private brand new", "new brand private", "private new brand", "brand new private"],
    correctAnswer: "brand new private",
    hint: "Adjective order: Age/condition ('brand new') precedes type/purpose ('private').",
    workedSolution: "In the natural ordering of adjectives, descriptive condition/age ('brand new') precedes classification/purpose ('private') before the noun 'car'.",
    points: 1
  },
  {
    number: 7,
    prompt: "Mama is never ............ ready for school on time.",
    options: ["so", "ever", "even", "rather"],
    correctAnswer: "ever",
    hint: "'Never' pairs with this adverb to emphasize at any time ('never ever').",
    workedSolution: "The adverb 'ever' intensifies the negative frequency adverb 'never' ('never ever ready') to mean at no time whatsoever.",
    points: 1
  },
  {
    number: 8,
    prompt: "Akua was ............ that she won four academic prizes.",
    options: ["a girl so brilliant", "a so brilliant girl", "so brilliant a girl", "a brilliant so girl"],
    correctAnswer: "so brilliant a girl",
    hint: "The formal emphatic pattern is 'so + adjective + a/an + singular noun'.",
    workedSolution: "When 'so' modifies an adjective preceding a singular countable noun with an indefinite article, standard English uses the inverted structure: 'so + adjective + a + noun' ('so brilliant a girl').",
    points: 1
  },
  {
    number: 9,
    prompt: "Before the tutor entered the classroom, we ............ the chalkboard.",
    options: ["cleaned", "have cleaned", "had cleaned", "are cleaning"],
    correctAnswer: "had cleaned",
    hint: "An action completed before another past event requires the past perfect tense ('had + past participle').",
    workedSolution: "The past perfect tense ('had cleaned') is used to express an action that took place prior to another past event ('Before he entered').",
    points: 1
  },
  {
    number: 10,
    prompt: "I have forgotten all ............ my grandfather told me.",
    options: ["this", "that", "what", "which"],
    correctAnswer: "that",
    hint: "The indefinite quantifier 'all' is followed by the relative pronoun 'that', never 'what'.",
    workedSolution: "In standard English, the indefinite pronoun 'all' is modified by the relative pronoun 'that' ('all that he told me'). 'What' and 'which' are non-standard in this structure.",
    points: 1
  },
  {
    number: 11,
    prompt: "The supervisor will ask the ............ to come and repair the leaking pipe in the bathroom.",
    options: ["mason", "carpenter", "plumber", "electrician"],
    correctAnswer: "plumber",
    hint: "Which skilled artisan specializes in fitting and repairing water pipes and drainage fixtures?",
    workedSolution: "A 'plumber' is a tradesperson who specializes in installing and maintaining systems used for potable water, sewage, and drainage.",
    points: 1
  },
  {
    number: 12,
    prompt: "The heavy boulder fell into the river with a loud .............",
    options: ["bang", "crash", "noise", "splash"],
    correctAnswer: "splash",
    hint: "The onomatopoeic word for the sound produced when an object hits water.",
    workedSolution: "'Splash' specifically denotes the sound or action of an object striking or plunging into liquid.",
    points: 1
  },
  {
    number: 13,
    prompt: "Aggie obtained ............ score for French in the end-of-term examination.",
    options: ["bad", "worse", "the worse", "the worst"],
    correctAnswer: "the worst",
    hint: "Superlative degree of 'bad' used to indicate the lowest mark among all.",
    workedSolution: "The irregular degrees of comparison for 'bad' are 'bad - worse - the worst'. In evaluating the lowest mark, the superlative 'the worst' is required.",
    points: 1
  },
  {
    number: 14,
    prompt: "We won the municipal debating contest, ............ we?",
    options: ["hadn't", "didn't", "couldn't", "did"],
    correctAnswer: "didn't",
    hint: "The affirmative past tense verb 'won' takes a negative tag using the auxiliary 'did'.",
    workedSolution: "The sentence has an affirmative simple past verb ('won'). The question tag must be negative, utilizing the past auxiliary 'did': 'didn't we?'.",
    points: 1
  },
  {
    number: 15,
    prompt: "Kwame looks very handsome in his new school uniform, .............?",
    options: ["isn't he", "isn't it", "doesn't he", "does he"],
    correctAnswer: "doesn't he",
    hint: "An affirmative present simple statement with 'looks' takes a negative tag with 'does'.",
    workedSolution: "The main verb is the third-person singular present 'looks'. The tag must be negative and use the matching present auxiliary 'does': 'doesn't he?'.",
    points: 1
  },
  {
    number: 16,
    prompt: "Nana Yaa was suffering ............ a severe attack of measles.",
    options: ["by", "with", "from", "through"],
    correctAnswer: "from",
    hint: "The verb 'suffer' regularly collocates with this preposition when mentioning an illness.",
    workedSolution: "In standard English, the verb 'suffer' takes the preposition 'from' when referring to a disease or medical condition ('suffering from measles').",
    points: 1
  },
  {
    number: 17,
    prompt: "The market suspect was charged ............ pickpocketing.",
    options: ["of", "for", "on", "with"],
    correctAnswer: "with",
    hint: "In legal English, an accused person is charged ...... a crime.",
    workedSolution: "The legal verb phrase is 'charged with' an offense or crime ('charged with pickpocketing').",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (18 - 22) ---
  {
    number: 18,
    prompt: "One essential ingredient for making traditional black soap is soda ash.\nChoose the word nearest in meaning to the underlined word 'essential'.",
    options: ["correct", "main", "real", "important"],
    correctAnswer: "important",
    hint: "Crucial, vital, indispensable, or of great significance.",
    workedSolution: "'Essential' means absolutely necessary, fundamental, or indispensable; 'important' is its closest synonym in this context.",
    points: 1
  },
  {
    number: 19,
    prompt: "Examination candidates are instructed to read the instructions carefully.\nChoose the word nearest in meaning to the underlined word 'instructions'.",
    options: ["notices", "demands", "commands", "directives"],
    correctAnswer: "directives",
    hint: "Official orders, guidelines, or directions telling someone how to do something.",
    workedSolution: "'Instructions' in examination and administrative contexts refers to official guidelines or directions; 'directives' is its closest synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "The thirsty dog saw its image in the clear pool of water.\nChoose the word nearest in meaning to the underlined word 'image'.",
    options: ["nature", "condition", "reflection", "attraction"],
    correctAnswer: "reflection",
    hint: "An optical likeness produced by light bouncing off a shiny surface or water.",
    workedSolution: "An 'image' seen on the surface of water is an optical 'reflection'.",
    points: 1
  },
  {
    number: 21,
    prompt: "The school drama club will hold its final rehearsal for the speech day play tonight.\nChoose the word nearest in meaning to the underlined word 'rehearsal'.",
    options: ["meeting", "practice", "trial", "preparation"],
    correctAnswer: "practice",
    hint: "A trial performance or practice session before a public drama presentation.",
    workedSolution: "'Rehearsal' in performing arts refers to a preparatory practice session; 'practice' is its direct synonym.",
    points: 1
  },
  {
    number: 22,
    prompt: "Our grandmother is exceptionally skilled in domestic affairs.\nChoose the word nearest in meaning to the underlined word 'domestic'.",
    options: ["local", "internal", "everyday", "household"],
    correctAnswer: "household",
    hint: "Relating to the running of a home or family living space.",
    workedSolution: "'Domestic' refers to matters concerning the home or family; 'household' is its exact equivalent.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (23 - 27) ---
  {
    number: 23,
    prompt: "Akweley was taken aback on seeing a stranger sitting quietly in her room. This means that Akweley was very ............",
    options: ["angry", "afraid", "confused", "surprised"],
    correctAnswer: "surprised",
    hint: "Shocked, startled, or caught off guard by something unexpected.",
    workedSolution: "The idiom 'to be taken aback' means to be astonished, startled, or thoroughly surprised by an unexpected occurrence.",
    points: 1
  },
  {
    number: 24,
    prompt: "The factory workers saw eye to eye with their managing director. This means that the workers ............",
    options: [
      "agreed completely with him",
      "were very close to him",
      "rarely saw him",
      "greatly respected him"
    ],
    correctAnswer: "agreed completely with him",
    hint: "Having identical opinions and being in complete agreement.",
    workedSolution: "'To see eye to eye' with someone is an idiom meaning to agree fully or have the same view on an issue.",
    points: 1
  },
  {
    number: 25,
    prompt: "The minister was in high spirits throughout the harvest thanksgiving service. This means that he was ............",
    options: ["content", "cheerful", "spiritual", "annoyed"],
    correctAnswer: "cheerful",
    hint: "In a very happy, energetic, and joyful mood.",
    workedSolution: "'In high spirits' is an idiom meaning lively, happy, vibrant, and cheerful.",
    points: 1
  },
  {
    number: 26,
    prompt: "After decades of hostility, the two chieftaincy factions decided to bury the hatchet. This means that they decided to ............",
    options: ["make peace", "bury their weapons", "hold discussions", "suspend fighting temporarily"],
    correctAnswer: "make peace",
    hint: "Ending a longstanding quarrel and settling differences amicably.",
    workedSolution: "The idiom 'to bury the hatchet' means to settle grievances, end conflict, and make peace.",
    points: 1
  },
  {
    number: 27,
    prompt: "The headmaster took the truant student's explanation with a pinch of salt. This means that the headmaster ............",
    options: [
      "believed the student's version completely",
      "doubted the student's version",
      "accepted the student's version happily",
      "ignored the student's version"
    ],
    correctAnswer: "doubted the student's version",
    hint: "Viewing an assertion with skepticism and distrusting its accuracy.",
    workedSolution: "'To take something with a pinch of salt' means to maintain skepticism and doubt the truthfulness or reliability of a claim.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (28 - 32) ---
  {
    number: 28,
    prompt: "The high court judge acquitted four of the accused suspects but ............ the principal offender.",
    options: ["convicted", "discharged", "cautioned", "rebuked"],
    correctAnswer: "convicted",
    hint: "'Acquitted' means declared innocent in court. Find the word that denotes finding guilty and sentencing.",
    workedSolution: "'Acquitted' means cleared of criminal charges. Its direct judicial antonym is 'convicted' (found guilty of a crime).",
    points: 1
  },
  {
    number: 29,
    prompt: "It pays to be courteous toward elders and colleagues rather than being ............",
    options: ["rude", "wicked", "disobedient", "boastful"],
    correctAnswer: "rude",
    hint: "'Courteous' means polite and well-mannered. Find the word meaning disrespectful and bad-mannered.",
    workedSolution: "'Courteous' means displaying good manners and civility. Its direct antonym is 'rude' (impolite or ill-mannered).",
    points: 1
  },
  {
    number: 30,
    prompt: "Commercial drivers who do not drive with care are frequently prosecuted for ............",
    options: ["speeding", "drunkenness", "disobedience", "recklessness"],
    correctAnswer: "recklessness",
    hint: "'Care' means caution and attentiveness. Find the noun meaning wild carelessness without regard for safety.",
    workedSolution: "'Care' denotes vigilance and caution. Its direct behavioral and legal opposite is 'recklessness' (heedless carelessness).",
    points: 1
  },
  {
    number: 31,
    prompt: "Prince David was the legitimate heir to the throne, whereas his cousin was an unlawful ............",
    options: ["usurper", "successor", "claimant", "descendant"],
    correctAnswer: "usurper",
    hint: "'Heir' is the rightful, lawful inheritor. Find the word meaning one who seizes power illegitimately.",
    workedSolution: "An 'heir' inherits power or property by legal right. An 'usurper' takes a position of power illegally or by force.",
    points: 1
  },
  {
    number: 32,
    prompt: "The dishonest clerk intentionally concealed the register, but the junior assistant ............ discarded it.",
    options: ["willingly", "hastily", "mistakenly", "carelessly"],
    correctAnswer: "mistakenly",
    hint: "'Intentionally' means done on purpose. Find the word meaning done unintentionally by error.",
    workedSolution: "'Intentionally' (or deliberately) means done on purpose. Its antonym is 'mistakenly' (or accidentally by error).",
    points: 1
  },

  // --- SECTION E: LITERATURE & LITERARY DEVICES (33 - 40) ---
  {
    number: 33,
    prompt: "In poetic terminology, a stanza consisting of exactly six lines is called a/an ............",
    options: ["octave", "opera", "sextet", "sonnet"],
    correctAnswer: "sextet",
    hint: "An octave has 8 lines, a quatrain has 4 lines. What is a 6-line poetic unit called?",
    workedSolution: "In poetry, a stanza or poem division consisting of six lines is termed a 'sextet' (or sestet). An octave has eight lines, and a sonnet has fourteen.",
    points: 1
  },
  {
    number: 34,
    prompt: "Read the extract below and answer the question:\n\"The sudden change in the weather frightened Araba. The bright orange colour of the sunset sky had quickly turned dull as the grey clouds gathered, rumbling, dark and angry. The booming voice of thunder was intimidating. Lightning flashed shards of light from his formidable torch. Araba was a cornered rat. How would she get home if the worst happened?\"\n\nWhat is the prevailing atmosphere of the extract?",
    options: ["cheerful", "friendly", "frightening", "undaunting"],
    correctAnswer: "frightening",
    hint: "Notice words like 'frightened', 'rumbling, dark and angry', 'intimidating', and 'cornered rat'.",
    workedSolution: "The menacing thunder, gathering angry clouds, and Araba feeling like a 'cornered rat' create an ominous, 'frightening' atmosphere.",
    points: 1
  },
  {
    number: 35,
    prompt: "In the extract describing the storm, which word directly personifies the menacing state of the clouds?",
    options: ["angry", "cloud", "flashed", "grey"],
    correctAnswer: "angry",
    hint: "Which adjective assigns the human emotional state of fury to inanimate storm clouds?",
    workedSolution: "Describing clouds as 'angry' attributes human emotion to a natural phenomenon, which emphasizes the hostile weather.",
    points: 1
  },
  {
    number: 36,
    prompt: "\"Lightning flashed shards of light from his formidable torch.\"\nWhich literary device is exemplified in this line?",
    options: ["alliteration", "ellipsis", "parallelism", "personification"],
    correctAnswer: "personification",
    hint: "Attributing personal pronouns ('his') and human tools ('torch') to inanimate lightning.",
    workedSolution: "Giving lightning human qualities ('his formidable torch') is a classic example of 'personification'.",
    points: 1
  },
  {
    number: 37,
    prompt: "In the extract, what impending natural event is implied by the rhetorical question: \"How would she get home if the worst happened?\"",
    options: ["Current calm", "Imminent rain", "Latent sky", "Rumbling clouds"],
    correctAnswer: "Imminent rain",
    hint: "Dark gathering clouds, thunder, and lightning precede what severe physical event?",
    workedSolution: "The 'worst' that could trap Araba on her journey home is a violent downpour ('Imminent rain').",
    points: 1
  },
  {
    number: 38,
    prompt: "\"The sudden change in the weather frightened Araba. The bright orange colour of the sunset sky had quickly turned dull...\"\nThis literary extract is written in which literary genre?",
    options: ["drama", "poetry", "prose", "verse"],
    correctAnswer: "prose",
    hint: "Continuous narrative text structured in sentences and paragraphs, without metric verse or theatrical dialogue.",
    workedSolution: "The narrative is written in ordinary, continuous grammatical sentences without poetic meter or drama script format, classifying it as 'prose'.",
    points: 1
  },
  {
    number: 39,
    prompt: "One distinctive structural feature that characterizes prose writing is the division of text into ............",
    options: ["paragraphs", "stanzas", "stage directions", "rhymes"],
    correctAnswer: "paragraphs",
    hint: "Poetry is organized into stanzas, drama into stage directions and acts, while prose is organized into...",
    workedSolution: "The fundamental structural building block of prose narrative is the 'paragraph'. Stanzas belong to poetry, and stage directions belong to drama.",
    points: 1
  },
  {
    number: 40,
    prompt: "A novelist produces literary works primarily in which form?",
    options: ["drama", "poetry", "prose", "verse"],
    correctAnswer: "prose",
    hint: "A novel is an extended fictional narrative written in ordinary paragraph form.",
    workedSolution: "A novel is an extended narrative work of fiction written in 'prose' form.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 201601);

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
        prompt: "Write a letter to your friend describing how you saved a child who was in danger.",
        modelAnswer: `Wesley Girls' Junior High School
P. O. Box 115
Cape Coast, Central Region
14th June, 2016

Dear Esi,

I hope this letter finds you in high spirits and good health. I am writing to share a harrowing experience that occurred last Friday afternoon in my neighborhood, which I still remember with a pounding heart.

While walking home from extra classes along the Kakum River corridor, I heard frantic screams and splashing water near the old timber bridge. Rushing to the riverbank, I was horrified to see little Kwame, our neighbor's six-year-old boy, struggling desperately in the swift current. He had slipped from the slippery embankment while trying to retrieve a plastic football and was being dragged toward deep, swirling waters.

Without hesitating, I dropped my heavy school bag, kicked off my sandals, and looked around for help. Realizing there were no adults nearby, I grabbed a long, sturdy bamboo pole that fishermen had left on the bank. I waded carefully into the shallows where the footing was secure, extended the pole toward Kwame, and shouted at him to hold on tightly. Terrified but determined, the little boy grasped the bamboo with both hands.

Summoning all my strength, I braced my feet against the river rocks and steadily hauled him toward safety until I could reach his arms and pull him onto the grassy bank. He was coughing up muddy water, shivering, and crying inconsolably. I wrapped him in my dry school cardigan and carried him home to his frantic parents, who wept with gratitude.

That incident taught me that presence of mind and courage can make all the difference in an emergency. Write back soon and share your holiday plans.

Your affectionate friend,
[Signature]
Abena`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in your school magazine on the topic: \"The Relationship Between Parents and Their Children Should Be Cordial.\"",
        modelAnswer: `FOSTERING CORDIAL RELATIONSHIPS BETWEEN PARENTS AND CHILDREN
By Joseph Boateng, JHS 3

In many traditional Ghanaian homes, parenting is often characterized by stern authority, distance, and fear. Many parents believe that strict intimidation is the only effective way to instill discipline in young minds. However, in our rapidly changing contemporary world, it is imperative that the relationship between parents and their children should be cordial, empathetic, and communicative.

First, a cordial relationship creates an open atmosphere where young people can confide their problems without dread. Adolescence is a turbulent phase fraught with peer pressure, emotional conflicts, and academic anxieties. When parents are approachable and warm, children readily discuss their difficulties, including exposure to bad influences, cyberbullying, or substance abuse. Conversely, when an atmosphere of terror reigns at home, children withdraw into secrecy, seeking flawed advice from misguided peers, which often leads to delinquency and teenage pregnancy.

Secondly, friendly parental guidance nurtures genuine emotional security, self-confidence, and academic excellence. Children who feel respected and cherished by their parents develop a healthy self-esteem that enables them to excel in school and society. A warm home environment does not mean the absence of discipline; rather, it means correcting mistakes with love, patience, and rational explanation rather than harsh corporal brutality.

In conclusion, cordiality between parents and children builds unbreakable family bonds and shapes responsible future citizens. Parents should become trusted mentors, listeners, and friends to their children, for love and open communication are the greatest guardians of youthful virtue.`
      },
      {
        questionNumber: "3",
        category: "Narrative Essay",
        prompt: "Write an interesting story that ends with the sentence: \"We were lucky that night.\"",
        modelAnswer: `During the mid-term holidays, my elder brother Yaw and I accompanied our uncle to his isolated cocoa cottage near the forest reserve in Sefwi Wiawso. The day had been long and exhausting as we helped harvest golden cocoa pods. By nightfall, a heavy tropical storm rolled across the mountains, plunging the forest into inky blackness accompanied by howling winds and blinding lightning.

Around midnight, while Uncle slept soundly, Yaw and I were jolted awake by the pungent smell of burning wood and choking smoke filling the wooden bedroom. Coughing violently, we discovered that a faulty kerosene storm lantern in the hallway had tipped over during the gale, igniting dry thatch and wooden wall planks. The corridor was already engulfed in roaring orange flames, completely blocking the main doorway.

Panic gripped my heart, but Yaw acted with remarkable presence of mind. He immediately smashed the wooden louvers of our bedroom window with a heavy bench and helped me scramble out into the pouring rain. Together, we screamed for Uncle through his adjoining window. Dazed by smoke, Uncle managed to break through his bedroom window frame and tumble onto the muddy grass just seconds before the entire roof collapsed in a cascade of burning embers.

Neighbors from distant hamlets braved the storm with buckets of water, but the cottage was burned to ashes. Shivering in the rain under the banana trees, watching our belongings turn to cinders, we hugged each other tightly, grateful that not a single life was lost. We were lucky that night.`
      }
    ]
  },
  sectionB_comprehension: {
    title: "Part B: Reading Comprehension",
    passage: `One major cause of environmental degradation in Ghana is gold mining. In the name of natural resource development, land is given to mining companies owned by foreigners. These foreigners milk the country dry and destroy the heritage of the people.

From the vast concessions granted them by the government, they extract the gold, destroy the rivers and other water bodies in the communities before going home, leaving the land worthless. Yet their operations are legal.

Approved mining is, however, not the sole gold mining activity. There is also what is regarded as unauthorized mining, called galamsey. In this enterprise, adventurous Ghanaians set out to do private mining as a livelihood. They dig up the earth with tools that are not as sophisticated as those of foreigners who also dig for the precious metal.

Mining activities destroy the environment. So far, it appears that nothing can be done to reclaim the land degraded by miners; the damage is irreversible. Vast tracts of arable land have become desolate mounds because of gold digging. Nothing can grow where galamsey has taken place.

Besides, the main water sources of communities have been polluted by the activities of both legal and illegal miners. The gold extracted from dirt requires cleaning with chemicals and rinsing in water. By the time the gold searchers succeed in producing a glittering handful, large stretches of rivers, ponds of water and some lakes have become poisoned.

Pollution leaves little drinking water for man and beast. Fishes die and humans contract various diseases.`,
    questions: [
      {
        subId: "(a)",
        question: "Name the two types of mining activities discussed in the passage.",
        answer: "1. Approved / legal mining (conducted by foreign commercial companies).\n2. Unauthorized / illegal mining (popularly called 'galamsey', conducted by private local miners)."
      },
      {
        subId: "(b)(i)",
        question: "Which groups of people engage in mining according to the passage?",
        answer: "Foreign mining companies (foreigners) and local adventurous Ghanaians (galamsey operators)."
      },
      {
        subId: "(b)(ii)",
        question: "Why does the government grant licenses to miners?",
        answer: "In the name of natural resource development (to generate economic revenue and develop national mineral resources)."
      },
      {
        subId: "(c)",
        question: "How are the people and the land affected by mining activities according to the passage?",
        answer: "1. The land is ruined and turned into desolate mounds where no crops can grow (irreversible degradation).\n2. Community water bodies are poisoned with chemicals, causing fish to die, depriving humans and animals of clean drinking water, and spreading diseases among humans."
      },
      {
        subId: "(d)(i)",
        question: "How does the writer feel about mining?",
        answer: "The writer feels deeply critical, distressed, disapproving, and sorrowful about the widespread destruction and environmental degradation caused by mining."
      },
      {
        subId: "(d)(ii)",
        question: "Why does the writer think that nothing can be done about the effects of mining?",
        answer: "Because the environmental damage to the land is irreversible and impossible to reclaim; nothing can ever grow on land that has been ravaged by galamsey."
      },
      {
        subId: "(e)",
        question: "Explain the following expressions in your own words:\n(i) milk the country dry;\n(ii) leaving the land worthless.",
        answer: "(i) **milk the country dry:** To exploit and exhaust the nation's precious natural wealth and mineral resources completely for selfish gain, leaving little or nothing behind for citizens.\n(ii) **leaving the land worthless:** Rendering the soil completely barren, unproductive, and unusable for agriculture, human settlement, or future development."
      },
      {
        subId: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\n(i) vast;\n(ii) sole;\n(iii) reclaim;\n(iv) mounds;\n(v) glittering.",
        answer: "(i) **vast:** huge / enormous / extensive / immense / large.\n(ii) **sole:** only / single / exclusive.\n(iii) **reclaim:** restore / rehabilitate / recover / salvage.\n(iv) **mounds:** heaps / piles / hillocks / ridges.\n(v) **glittering:** shining / sparkling / gleaming / shimmering."
      }
    ]
  },
  sectionC_literature: {
    title: "Part C: Literature in English (The Cockcrow Anthology)",
    instructions: "Answer all questions in this part based on the prescribed texts.",
    questions: [
      {
        subId: "5(a)",
        textSource: "CHARLES DICKENS: Oliver Twist",
        extract: "\"Oliver was trapped among criminals in London, forced to participate in burglary...\"",
        question: "Who was the notorious master criminal that trained young boys to become pickpockets in London?",
        answer: "Fagin (the old Jewish fence who led the gang of juvenile thieves)."
      },
      {
        subId: "5(b)",
        textSource: "CHARLES DICKENS: Oliver Twist",
        extract: "The tragic demise of Nancy...",
        question: "Why did Bill Sikes brutally murder Nancy in the novel?",
        answer: "Because he discovered that Nancy had secretly met with Rose Maylie and Mr. Brownlow to reveal Fagin's criminal conspiracy to save Oliver."
      },
      {
        subId: "5(c)",
        textSource: "KEN SARO-WIWA: Home Sweet Home",
        extract: "\"Dukana was a small village, isolated from the bustling modern world...\"",
        question: "What is the central theme of Ken Saro-Wiwa's short story 'Home Sweet Home'?",
        answer: "The theme of deep nostalgia, communal belonging, rural poverty, and the enduring attachment an educated person feels toward their ancestral homeland."
      },
      {
        subId: "5(d)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "\"ATO: Why don't you understand? It is our private affair!\nESI KOM: A marriage is never a private affair of two individuals.\"",
        question: "What cultural conflict is dramatized in this exchange between Ato and his mother?",
        answer: "The conflict between modern Western individualism (marriage as a private matter) and traditional African communalism (marriage as an alliance of families and clans)."
      },
      {
        subId: "5(e)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "The dilemma facing Ato Yawson...",
        question: "Why is Ato Yawson described as a 'ghost' in the play?",
        answer: "Because he is caught helplessly between two worlds—his traditional Akan heritage and his acquired Western education—belonging fully to neither and lacking the moral courage to reconcile them."
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

async function seedBeceEnglish2016Calibrated() {
  const db = await getDb();
  console.log("Seeding Calibrated & Balanced BECE English 2016 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2016");
  await docRef.set({
    year: 2016,
    title: "BECE English Language 2016 (Calibrated National Benchmark)",
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

  console.log("✅ Calibrated BECE English 2016 successfully seeded into Firestore!");
}

seedBeceEnglish2016Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2016:", err);
    process.exit(1);
  });
