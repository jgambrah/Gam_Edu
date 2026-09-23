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
// ISOMORPHIC PASSAGE I: THE MIDNIGHT RESCUE (CALIBRATED ORIGINAL)
// =========================================================================
const passage1Title = "Passage I: The Midnight Rescue";
const passage1Text = `"Help! Help! Fire!" These piercing cries, accompanied by the violent slamming of wooden shutters and crunching footsteps along the gravel path, jolted Barimah awake.

"An emergency has occurred; something must be done immediately," he declared to his wife, Fosua, who had already sat up in terror. Pulling on his trousers and shirt in haste, he unlatched the front door and instructed his wife firmly not to step outside into the night.

It was pitch-black outside; the only illumination came from the roaring inferno consuming Agya Atta's residential compound across the road. By the time Barimah dashed to the scene, the roof was enveloped in blazing sheets of fire. A frantic crowd of neighbors had already assembled, hurriedly hauling metal buckets of water and mounds of sand to pour over the leaping flames. Everyone was laboring desperately to put out the blaze.

Meanwhile, a few courageous youths had managed to drag out a small bundle of personal belongings from the front veranda. To protect these salvaged items from being looted by opportunistic bystanders in the dark, Barimah directed that they be transferred immediately to his own secure compound. He then escorted Agya Atta's weeping wife and trembling children into his living room for shelter before sprinting back to rejoin the bucket line fighting the fire.

Araba, Agya Atta's wife, had won the affection of the entire township through her benevolence, humility, and countless good deeds. It was therefore heartbreaking for the community to witness her lose all her household property and the beautiful dwelling that she and her husband had toiled for decades to erect.`;

const passage1QuestionsRaw = [
  {
    number: 1,
    prompt: "In Passage I, why did Barimah instruct his wife, Fosua, to remain indoors?",
    options: [
      "People were running in chaotic confusion along the lane",
      "A deafening and frightening noise was echoing outside",
      "He suspected that severe danger and peril lurked in the dark",
      "The compound surroundings were enveloped in thick darkness"
    ],
    correctAnswer: "He suspected that severe danger and peril lurked in the dark",
    hint: "Reread paragraph one and two: he told her not to leave because he sensed an emergency and suspected danger outside.",
    workedSolution: "Barimah ordered his wife to stay inside for her safety because he realized an unpredictable, dangerous emergency was unfolding outside.",
    points: 1
  },
  {
    number: 2,
    prompt: "What scene met Barimah's eyes the moment he stepped outside his house?",
    options: [
      "Araba frantically hauling buckets of water to fight the flames",
      "Neighbors gathering household belongings along the roadside",
      "People screaming and running aimlessly in the street",
      "Agya Atta's residential house burning furiously in the dark"
    ],
    correctAnswer: "Agya Atta's residential house burning furiously in the dark",
    hint: "Paragraph two states: the only light came from the flaming house of Agya Atta, which was truly in flames.",
    workedSolution: "Upon stepping out, the only illumination in the pitch darkness came from Agya Atta's residence engulfed in blazing flames.",
    points: 1
  },
  {
    number: 3,
    prompt: "In Passage I, the phrasal verb 'put out' in 'to put out the fire' means to ............",
    options: ["control", "extinguish", "suppress", "dismantle"],
    correctAnswer: "extinguish",
    hint: "To quench or stop a fire from burning.",
    workedSolution: "The phrasal verb 'to put out' a fire means to quench, douse, or 'extinguish' the flames completely.",
    points: 1
  },
  {
    number: 4,
    prompt: "From the actions described in Passage I, what can we infer regarding the relationship between the Barimahs and the Agya Attas?",
    options: [
      "They were former primary school classmates",
      "They were caring, helpful, and dependable neighbors",
      "They were related through marriage as in-laws",
      "They were members of the same age-grade society"
    ],
    correctAnswer: "They were caring, helpful, and dependable neighbors",
    hint: "Barimah risked his life to fight the fire, protected their salvaged property, and sheltered their family.",
    workedSolution: "Barimah's readiness to protect their property, shelter their family, and fight the flames shows that they were compassionate, reliable neighbors.",
    points: 1
  },
  {
    number: 5,
    prompt: "Why did the gathered townspeople feel profound sympathy and grief for Araba?",
    options: [
      "She had been abandoned by her husband in the burning house",
      "She had labored alongside her husband to build the house",
      "She was an exceptionally kind, virtuous, and benevolent woman",
      "She was weeping bitterly in Barimah's living room"
    ],
    correctAnswer: "She was an exceptionally kind, virtuous, and benevolent woman",
    hint: "Check the final paragraph: Araba had won the hearts of many people by her good deeds and kindness.",
    workedSolution: "The community sympathized deeply with Araba because her personal kindness, generosity, and good deeds had earned the love and respect of everyone.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: THE TOBACCO MENACE (CALIBRATED ORIGINAL)
// =========================================================================
const passage2Title = "Passage II: The Tobacco Menace";
const passage2Text = `Numerous habitual smokers deliberately disregard the medical warnings concerning the grave hazards of tobacco, despite sustained national campaigns organized to curb the habit. Indeed, the United Nations, through the World Health Organization, has designated an annual global day of observance to educate humanity against this fatal addiction.

Consider the tragic account of a promising young artisan who succumbed to smoking. Within a few short years, he developed chronic pulmonary complications and died in excruciating agony, plunging his surviving widow and infant children into sudden destitution. Rigorous scientific research demonstrates that a habitual smoker is exponentially more prone to contract, if not perish from, lethal pathologies like malignant lung cancer and cardiovascular heart failure compared to a non-smoker.

Furthermore, medical evidence confirms that smoking during pregnancy produces devastating obstetric outcomes. Expectant mothers who inhale tobacco smoke frequently deliver severely underweight infants. They are also significantly more prone to suffer spontaneous miscarriages, deliver stillborn babies, or lose their newborns to infant respiratory distress. Even when such vulnerable infants survive to school-going age, they frequently suffer cognitive deficits and struggle academically.

Perhaps the most infuriating dimension of the tobacco menace is the severe jeopardy inflicted upon passive smokers. Innocent non-smokers who involuntarily inhale second-hand fumes drifting from nearby cigarettes, pipes, or cigars face identical risks of contracting the deadly cardiovascular and respiratory diseases that plague active smokers. If smokers truly grasped the deep resentment and revulsion non-smokers feel toward them, they would discard the habit. The unrepentant smoker is widely regarded as a selfish social misfit—an individual who recklessly sacrifices the public health and welfare of others to indulge his personal craving.`;

const passage2QuestionsRaw = [
  {
    number: 6,
    prompt: "According to Passage II, what collective action has organized society taken against tobacco smoking?",
    options: [
      "It has arrested and prosecuted all smokers in legal tribunals",
      "It has provided free psychiatric therapy to tobacco vendors",
      "It has largely ignored the habit as a private domestic affair",
      "It has actively opposed, campaigned against, and condemned the habit"
    ],
    correctAnswer: "It has actively opposed, campaigned against, and condemned the habit",
    hint: "Paragraph one notes there is a national campaign against the habit and a UN day set aside against it.",
    workedSolution: "Society, through national campaigns and UN global observances, has actively opposed, condemned, and campaigned against smoking.",
    points: 1
  },
  {
    number: 7,
    prompt: "According to medical evidence presented in Passage II, which of the following fatal diseases is directly caused by smoking?",
    options: [
      "Acute cerebral malaria",
      "Infectious childhood measles",
      "Malignant cancer of the lungs",
      "Severe amoebic dysentery"
    ],
    correctAnswer: "Malignant cancer of the lungs",
    hint: "Paragraph two explicitly mentions lung cancer and heart failure as fatal diseases caused by tobacco.",
    workedSolution: "The text identifies malignant lung cancer and heart failure as primary fatal pathologies caused by smoking.",
    points: 1
  },
  {
    number: 8,
    prompt: "Which of the following medical outcomes is true regarding pregnant women who smoke in Passage II?",
    options: [
      "They are highly prone to deliver stillborn or dead babies",
      "They permanently lose the physical capability to breastfeed",
      "They frequently deliver healthy identical twins",
      "They gain excessive bodily weight during pregnancy"
    ],
    correctAnswer: "They are highly prone to deliver stillborn or dead babies",
    hint: "Check paragraph three: women who smoke are likely to miscarry, have still-born babies, or deliver underweight infants.",
    workedSolution: "The passage notes that pregnant smokers are at high risk of having stillborn (dead) babies, miscarrying, or delivering underweight infants.",
    points: 1
  },
  {
    number: 9,
    prompt: "In Passage II, who are 'passive smokers'?",
    options: [
      "Individuals who maintain close friendships with smokers",
      "Addicts who smoke mild herbal cigarettes occasionally",
      "Non-smokers who involuntarily breathe in smoke from other people's cigarettes",
      "Smokers who have successfully given up the addiction"
    ],
    correctAnswer: "Non-smokers who involuntarily breathe in smoke from other people's cigarettes",
    hint: "Reread paragraph four: passive smokers are non-smokers breathing in smoke from other people's cigarettes, pipes, and cigars.",
    workedSolution: "Passive smokers are non-smoking bystanders who involuntarily inhale the second-hand tobacco smoke exhaled by active smokers.",
    points: 1
  },
  {
    number: 10,
    prompt: "How does the passage characterize habitual smokers who smoke indiscriminately in public?",
    options: [
      "Courageous and fearless",
      "Selfish, inconsiderate, and indifferent to the welfare of others",
      "Proud of their personal independence",
      "Ignorant of basic personal hygiene"
    ],
    correctAnswer: "Selfish, inconsiderate, and indifferent to the welfare of others",
    hint: "The final sentence describes the smoker as a social misfit who considers only his own interest and ignores the welfare of others.",
    workedSolution: "The author characterizes public smokers as selfish social misfits who disregard the health and comfort of surrounding people to satisfy their addiction.",
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
    prompt: "Senyo pleaded in vain to dissuade his companion from stealing the orchard oranges.\nChoose the word nearest in meaning to 'in vain'.",
    options: ["angrily", "timidly", "unsuccessfully", "vigorously"],
    correctAnswer: "unsuccessfully",
    hint: "Without producing the desired result; fruitlessly.",
    workedSolution: "'In vain' means fruitlessly or without success; 'unsuccessfully' is its direct synonym.",
    points: 1
  },
  {
    number: 12,
    prompt: "With disciplined persistence and teamwork, we can overcome any engineering challenge.\nChoose the word nearest in meaning to 'overcome'.",
    options: ["solve", "avoid", "contain", "endure"],
    correctAnswer: "solve",
    hint: "To conquer, master, or find a solution to a problem.",
    workedSolution: "'Overcome' a problem means to surmount, master, or 'solve' it successfully.",
    points: 1
  },
  {
    number: 13,
    prompt: "Auntie Araba prepared a delicious pot of groundnut soup for the festive reception.\nChoose the word nearest in meaning to 'delicious'.",
    options: ["nutritious", "tasty", "wholesome", "sweet"],
    correctAnswer: "tasty",
    hint: "Highly pleasant to the taste; delectable.",
    workedSolution: "'Delicious' means having a highly pleasing flavor; 'tasty' (or palatable) is its direct synonym.",
    points: 1
  },
  {
    number: 14,
    prompt: "The enthusiastic spectators applauded the actors at the end of the dramatic presentation.\nChoose the word nearest in meaning to 'applauded'.",
    options: ["cheered", "rewarded", "saluted", "welcomed"],
    correctAnswer: "cheered",
    hint: "Expressed praise or approval by clapping hands and shouting.",
    workedSolution: "'Applauded' means showed approval by clapping or shouting acclaim; 'cheered' is its closest synonym.",
    points: 1
  },
  {
    number: 15,
    prompt: "Jasper lamented the tragic loss of his loyal hunting hound.\nChoose the word nearest in meaning to 'lamented'.",
    options: ["mourned", "regretted", "recalled", "confessed"],
    correctAnswer: "mourned",
    hint: "Expressed passionate grief, sorrow, or mourning for someone lost.",
    workedSolution: "'Lamented' means expressed deep grief or sorrow over a loss; 'mourned' is its exact equivalent.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "John always remains light-hearted despite his domestic financial constraints. This means that John is always ............",
    options: ["careless", "cheerful and carefree", "quiet and reserved", "arrogant"],
    correctAnswer: "cheerful and carefree",
    hint: "Carefree, cheerful, and unburdened by gloom.",
    workedSolution: "The idiom 'light-hearted' describes someone who is cheerful, buoyant, and free from gloomy anxiety.",
    points: 1
  },
  {
    number: 17,
    prompt: "Following the vehicular collision, Ayorkor has really gone through the mill. This means Ayorkor has ............",
    options: [
      "reformed her daily lifestyle",
      "become much wiser in judgment",
      "endured intense suffering and hardship",
      "received substantial monetary compensation"
    ],
    correctAnswer: "endured intense suffering and hardship",
    hint: "To experience a grueling, painful, or difficult ordeal.",
    workedSolution: "The idiom 'to go through the mill' means to undergo a difficult, painful, and grueling ordeal; 'endured intense suffering and hardship' is its exact meaning.",
    points: 1
  },
  {
    number: 18,
    prompt: "Moro felt completely at home during his vacation at his roommate's family residence. This means Moro was ............",
    options: [
      "comfortable, relaxed, and at ease",
      "familiar with the architectural floor plan",
      "treated like an employee",
      "longing to return to his own village"
    ],
    correctAnswer: "comfortable, relaxed, and at ease",
    hint: "To feel as comfortable as if one were in one's own house.",
    workedSolution: "The idiom 'at home' means relaxed, comfortable, and feeling at ease in one's surroundings.",
    points: 1
  },
  {
    number: 19,
    prompt: "The basic school candidates were all ears throughout the career guidance lecture. This means the students ............",
    options: [
      "raised difficult questions",
      "observed the speaker intently",
      "listened with rapt, undivided attention",
      "sat with their hands over their ears"
    ],
    correctAnswer: "listened with rapt, undivided attention",
    hint: "Listening eagerly and attentively.",
    workedSolution: "The idiom 'all ears' means listening eagerly, intently, and with complete attention.",
    points: 1
  },
  {
    number: 20,
    prompt: "It took the newly appointed house prefect several weeks before he could find his feet. This means it took him weeks before he ............",
    options: [
      "knew every student by name",
      "became confident and accustomed to his duties",
      "won the principal's prize",
      "became popular across the school"
    ],
    correctAnswer: "became confident and accustomed to his duties",
    hint: "To become confident and comfortable in a new situation.",
    workedSolution: "The idiom 'to find one's feet' means to become confident, established, and familiar with a new environment or role.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "While our Assemblyman is generous and assists the needy, the previous representative was ...... .\nChoose the word most nearly opposite in meaning to 'generous'.",
    options: ["unkind", "proud", "talkative", "insolent"],
    correctAnswer: "unkind",
    hint: "'Generous' means showing kindness and readiness to give. What word denotes harsh, ungiving, or mean?",
    workedSolution: "'Generous' means benevolent, liberal, and giving. Its direct antonym in personal disposition is 'unkind' (or stingy/mean).",
    points: 1
  },
  {
    number: 22,
    prompt: "If you remain indolent, you will fail; but if you are ......, you will achieve distinction.\nChoose the word most nearly opposite in meaning to 'indolent'.",
    options: ["hard working", "respectful", "honest", "cautious"],
    correctAnswer: "hard working",
    hint: "'Indolent' means lazy and avoiding physical exertion. What word denotes industrious and diligent?",
    workedSolution: "'Indolent' means lazy, idle, or sluggish. Its direct antonym is 'hard working' (or industrious).",
    points: 1
  },
  {
    number: 23,
    prompt: "The magistrate pronounced the ringleader guilty, while releasing his accomplice as ...... .\nChoose the word most nearly opposite in meaning to 'guilty'.",
    options: ["surprised", "innocent", "fearful", "absent"],
    correctAnswer: "innocent",
    hint: "'Guilty' means responsible for a crime. What word denotes free from guilt, blameless, or not guilty?",
    workedSolution: "'Guilty' means convicted of a wrongful offense. Its direct judicial antonym is 'innocent'.",
    points: 1
  },
  {
    number: 24,
    prompt: "Handle the porcelain vase with care, for it is fragile, unlike the brass urn which is ...... .\nChoose the word most nearly opposite in meaning to 'fragile'.",
    options: ["unbreakable", "rigid", "polished", "dull"],
    correctAnswer: "unbreakable",
    hint: "'Fragile' means easily broken or delicate. What word denotes resistant to breaking?",
    workedSolution: "'Fragile' describes an object easily broken or damaged. Its direct physical antonym is 'unbreakable' (or durable/tough).",
    points: 1
  },
  {
    number: 25,
    prompt: "Certain traditional farming practices are old-fashioned, but mechanized irrigation methods are ...... .\nChoose the word most nearly opposite in meaning to 'old-fashioned'.",
    options: ["modern", "attractive", "complex", "costly"],
    correctAnswer: "modern",
    hint: "'Old-fashioned' means antiquated or belonging to the past. What word denotes contemporary and up-to-date?",
    workedSolution: "'Old-fashioned' means out of date or antiquated. Its direct antonym is 'modern' (or contemporary).",
    points: 1
  },

  // --- SECTION E: STRUCTURE & QUESTION TAGS (26 - 40) ---
  {
    number: 26,
    prompt: "Of all the five Brown brothers, Ato is undeniably ......",
    options: ["the short", "the shorter", "the shortest", "shortest"],
    correctAnswer: "the shortest",
    hint: "When comparing three or more entities, standard English requires the superlative degree preceded by 'the'.",
    workedSolution: "Comparing five individuals requires the superlative form of the one-syllable adjective ('short') preceded by 'the': 'the shortest'.",
    points: 1
  },
  {
    number: 27,
    prompt: "Amma was so terrified by the violent thunderstorm ...... she fainted.",
    options: ["so", "as", "then", "that"],
    correctAnswer: "that",
    hint: "Correlative result clause: 'so + adjective + that + consequence'.",
    workedSolution: "The degree adverb 'so' pairs correlatively with the subordinator 'that' to introduce a clause of result: 'so frightened that she fainted'.",
    points: 1
  },
  {
    number: 28,
    prompt: "Grandmother is lonely, yet she has ...... trusted friends who regularly visit her.",
    options: ["few", "much", "a little", "a few"],
    correctAnswer: "a few",
    hint: "'Friends' is a plural countable noun. Use the positive quantifier meaning a small number.",
    workedSolution: "Plural countable nouns ('friends') take 'a few' to express a positive small number. 'Few' without an article has a negative meaning (almost none); 'much/little' apply to non-count nouns.",
    points: 1
  },
  {
    number: 29,
    prompt: "Kofi is the disciplined scholar to ...... I presented the science encyclopedia.",
    options: ["whose", "which", "whom", "who"],
    correctAnswer: "whom",
    hint: "Formal relative pronoun: Following a preposition ('to'), use the objective relative pronoun for persons.",
    workedSolution: "When preceded by a preposition ('to'), standard prescriptive grammar requires the objective relative pronoun 'whom': 'to whom I gave the pen'.",
    points: 1
  },
  {
    number: 30,
    prompt: "You are feeling thoroughly exhausted after the football match, ......?",
    options: ["aren't you", "don't you", "isn't it", "not so"],
    correctAnswer: "aren't you",
    hint: "An affirmative present statement with copula 'are' and subject 'you' takes the negative tag 'aren't you?'.",
    workedSolution: "The statement is affirmative present using 'are' with subject 'you'. The corresponding question tag must be negative: 'aren't you?'.",
    points: 1
  },
  {
    number: 31,
    prompt: "The visiting lecturer promised that he ...... attend our speech-and-prize ceremony.",
    options: ["will", "would", "has", "have"],
    correctAnswer: "would",
    hint: "Reported speech backshift: Past reporting verb 'promised' requires the past modal 'would'.",
    workedSolution: "In indirect reported speech governed by a past reporting verb ('said/promised'), the future modal 'will' shifts to its past form 'would'.",
    points: 1
  },
  {
    number: 32,
    prompt: "By the time Father arrived home from the farm, Mother ...... preparing the evening meal.",
    options: ["has", "had", "have", "having"],
    correctAnswer: "had",
    hint: "Use the past perfect auxiliary 'had' for an action completed before another past event ('arrived').",
    workedSolution: "The completion of cooking preceded Father's past arrival, requiring the Past Perfect tense: 'had [finished cooking]'.",
    points: 1
  },
  {
    number: 33,
    prompt: "The marathon runner was ...... exhausted that he collapsed before the finish line.",
    options: ["much", "too", "so", "very"],
    correctAnswer: "so",
    hint: "Correlative structure introducing a result clause with 'that': 'so + adjective + that'.",
    workedSolution: "The result clause introduced by 'that' requires the intensifier 'so' ('so tired that he couldn't finish'). 'Too' pairs with 'to-infinitive', not 'that'.",
    points: 1
  },
  {
    number: 34,
    prompt: "While clearing the overgrown orchard, the farmer was ...... by a venomous viper.",
    options: ["bitten", "beaten", "bit", "beat"],
    correctAnswer: "bitten",
    hint: "Passive voice of 'bite': was + past participle (bite - bit - bitten).",
    workedSolution: "The passive voice construction requires the past participle form of 'bite', which is 'bitten': 'was bitten by a poisonous snake'.",
    points: 1
  },
  {
    number: 35,
    prompt: "You have added far too ...... sugar to my morning tea.",
    options: ["many", "much", "few", "small"],
    correctAnswer: "much",
    hint: "'Sugar' is an uncountable non-count noun. Use the quantifier of excessive quantity.",
    workedSolution: "'Sugar' is an uncountable mass noun. Following 'too', it takes the non-count quantifier 'much' ('too much sugar'). 'Many' applies only to count nouns.",
    points: 1
  },
  {
    number: 36,
    prompt: "Our new physical education instructor is a ......",
    options: [
      "handsome, tall man",
      "handsome man tall",
      "tall, handsome man",
      "man, tall, handsome"
    ],
    correctAnswer: "tall, handsome man",
    hint: "Cumulative adjective ordering: Physical dimension/Height ('tall') precedes General opinion/Evaluation ('handsome') before the head noun ('man').",
    workedSolution: "Standard English adjective order places size/height dimension ('tall') before subjective evaluation ('handsome') preceding the noun: 'tall, handsome man'.",
    points: 1
  },
  {
    number: 37,
    prompt: "Living in a rural village, I am ...... to walking long distances every morning.",
    options: ["using", "uses", "use", "used"],
    correctAnswer: "used",
    hint: "Habitual state structure: 'be used to + gerund/noun' expressing familiarity or habit.",
    workedSolution: "The idiomatic structure expressing established familiarity is 'am used to' followed by a gerund ('used to walking').",
    points: 1
  },
  {
    number: 38,
    prompt: "After working all afternoon, the auto mechanic succeeded ...... the faulty diesel generator.",
    options: [
      "at repairing",
      "in repairing",
      "to repair",
      "with repairing"
    ],
    correctAnswer: "in repairing",
    hint: "Identify the preposition that regularly collocates with the verb 'succeed': 'succeed in + gerund'.",
    workedSolution: "In standard English grammar, the verb 'succeed' takes the preposition 'in' followed by a gerund: 'succeeded in repairing'.",
    points: 1
  },
  {
    number: 39,
    prompt: "If I ...... with my grandparents in the village, I would have learned traditional drumming.",
    options: [
      "had lived",
      "have lived",
      "have been living",
      "am living"
    ],
    correctAnswer: "had lived",
    hint: "Third Conditional: 'would have learned' in the main clause requires 'had + past participle' in the if-clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the if-clause takes the past perfect tense: 'had lived'.",
    points: 1
  },
  {
    number: 40,
    prompt: "Following the physician's stern medical warning, Atia has given ...... smoking entirely.",
    options: ["off", "out", "up", "in"],
    correctAnswer: "up",
    hint: "Identify the phrasal verb meaning to cease, abandon, or discontinue a habit.",
    workedSolution: "The phrasal verb 'to give up' means to discontinue, cease, or abandon an addiction or habit: 'given up smoking'.",
    points: 1
  }
];

// Combine raw items
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

const assignedTargetIndices = seedShuffle(targetKeys, 200702);

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
        prompt: "Write a letter to your pen-pal living abroad, describing in vivid detail how Ghana's Independence Day is celebrated annually across the country.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2007

Dear Sarah,

I hope this letter finds you in fine health and peace of mind in London. In your recent letter, you inquired about Ghana's national holidays and how we celebrate our national identity. I write with great pride to share with you how we commemorate our Independence Day every year on the sixth of March.

Independence Day marks the momentous occasion in 1957 when Ghana became the first sub-Saharan African nation to break free from British colonial rule. Across all regional capitals and district townships, the day is celebrated with colorful ceremonial pageantry and patriotic fervor. The national celebration takes place at the historic Black Star Square in Accra, presided over by the President of the Republic.

The highlight of the day is the grand parade. Smartly attired contingents of the Ghana Armed Forces, the Police Service, and the Fire Service march past the presidential dais in crisp, coordinated formations, accompanied by stirring brass band anthems. Following the security services, hundreds of basic and secondary school students—including school cadet corps and cultural dance troupes—march proudly, waving miniature red, gold, and green national flags bearing our iconic black star.

In our district in Bekwai, the celebrations conclude with exhilarating cultural performances, school sports tournaments, and festive family picnics. Street vendors sell savory Ghanaian delicacies like spicy jollof rice, roasted plantain, and fried tilapia, while traditional drummers fill the air with pulsating rhythms. It is an inspiring national celebration that unites all Ghanaians in gratitude and patriotism.

Please write back soon and share how national holidays are marked in England.

Your true friend,
[Signature]
Kwabena Mensah`
      },
      {
        questionNumber: "2",
        category: "Formal Letter",
        prompt: "Write a formal letter to your District Chief Executive (DCE) drawing his attention to the acute shortage of potable drinking water in your community, and suggesting at least two practical measures to solve the crisis.",
        modelAnswer: `Presbyterian Junior Secondary School
P. O. Box 80
Begoro, Eastern Region
18th October, 2007

The District Chief Executive
Fanteakwa District Assembly
Municipal Directorate, Begoro

Dear Sir,

PETITION REGARDING ACUTE WATER SHORTAGE IN BEGORO AND PROPOSALS FOR INTERVENTION

On behalf of the residents, market traders, and basic school students of the Begoro municipality, I respectfully submit this petition to draw your urgent attention to the perennial scarcity of potable drinking water in our community and to propose two practical interventions.

For over five continuous months, municipal taps in our township have run completely dry due to broken pumping mains and heavy siltation at the primary treatment headworks. Consequently, women and school children are forced to trek more than four kilometers every morning to fetch untreated water from stagnant streams shared with grazing livestock. This crisis severely disrupts basic education, as pupils arrive at school exhausted after carrying heavy water basins, missing crucial morning instructional periods. Even more alarming, our municipal hospital has recorded a sharp increase in waterborne diseases such as cholera, bilharzia, and dysentery.

To resolve this crisis, I suggest, first, that the District Assembly allocate funds from the District Assembly Common Fund to drill and mechanize four industrial boreholes equipped with solar-powered pumps and high-capacity overhead storage tanks across major electoral zones. This will provide immediate, decentralized access to safe drinking water.

Secondly, the assembly should partner with the Community Water and Sanitation Agency to dredge the silted municipal reservoir and replace rusted distribution pipes to restore pipe-borne water supply permanently.

We count on your executive leadership to end our long-suffering water crisis.

Thank you.

Yours faithfully,
[Signature]
Emmanuel Addo
(Youth Secretary)`
      },
      {
        questionNumber: "3",
        category: "Speech / Public Address",
        prompt: "As the Senior Prefect of your school, write the valedictory speech you will deliver at your school's Annual Speech and Prize-Giving Day.",
        modelAnswer: `A SPEECH DELIVERED BY THE SENIOR PREFECT ON THE OCCASION OF THE 2007 SPEECH AND PRIZE-GIVING DAY

Mr. Chairman, Respected District Director of Education, Dedicated Headmaster, Inspiring Teachers, Esteemed Parents, and Fellow Students:

It is a profound honor and privilege to stand before you today on behalf of the graduating Class of 2007 to reflect on our three-year basic school journey, celebrate our collective triumphs, and express our heartfelt gratitude to those who molded our minds and character.

Three years ago, we walked through the gates of Methodist Junior Secondary School as timid, uncertain children. Today, we stand before you as disciplined, confident, and ambitious young scholars equipped to conquer the future. Our stay here has been characterized by academic excellence, athletic glory, and moral growth. In the recently released national mock examinations, our school achieved the highest distinction in the district, a testament to the unyielding dedication of our teaching staff.

To our headmaster and dedicated teachers, words are inadequate to express our gratitude. You were not merely academic tutors; you were patient mentors and compassionate parents who sacrificed your free afternoons to provide remedial tutorials and instill in us the virtues of integrity, punctuality, and hard work. You taught us to view challenges not as stumbling blocks, but as stepping stones to excellence.

To our beloved parents, thank you for your financial sacrifices, your moral counsel, and your unconditional love. We promise to justify your investments by excelling in the upcoming BECE and gaining admission into premier secondary academies.

To my fellow graduating students, as we step out into the wider world, let us remember our school motto: "Knowledge and Industry." Let us carry the banner of integrity high wherever we go.

Thank you, and may God bless our school.`
      },
      {
        questionNumber: "4",
        category: "Descriptive / Instructional Guide",
        prompt: "Write a letter to your close friend in another school, describing in clear, structured steps how your favorite outdoor game or sport is played.",
        modelAnswer: `Anglican Junior Secondary School
P. O. Box 112
Mampong, Ashanti Region
12th June, 2007

Dear Kwesi,

I hope this letter finds you in fine health and peace of mind in Kumasi. In your previous letter, you mentioned that you wanted to learn a new, exciting outdoor sport to play during recess. I am thrilled to introduce you to my absolute favorite outdoor game: volleyball. It is a thrilling, fast-paced team sport that builds physical agility, cardiovascular endurance, and teamwork.

Volleyball is played on a rectangular court eighteen meters long and nine meters wide, divided equally by a raised central net. Two teams of six players face each other on opposite sides. The primary objective is to hit a lightweight leather ball over the net and ground it within the opponent's court boundaries while preventing the opposing team from doing the same.

The game commences with a service. A player stands behind the baseline and strikes the ball over the net into the opponent's half. The receiving team is allowed a maximum of three consecutive touches to return the ball across the net. Typically, the first player executes a "bump" or forearm pass to absorb the serve; the second player executes an overhead "set" to loft the ball near the net; and the third player performs a powerful jumping "spike" to smash the ball into the opponent's court.

A team scores a point whenever the opponent fails to return the ball, hits it out of bounds, touches the net, or commits a ball-handling fault. A standard set is won by the first team to reach twenty-five points with a two-point advantage.

Try forming a team at your school; I am certain you will fall in love with the game!

Your true friend,
[Signature]
Kwaku Mensah`
      }
    ]
  }
};

async function seedBeceEnglish2007Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 2007 into Firestore...");

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
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2007");
  await docRef.set({
    year: 2007,
    title: "BECE English Language 2007 (Calibrated National Benchmark)",
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

  console.log("✅ Fully Rewritten, Clean-Room BECE English 2007 successfully seeded into Firestore!");
}

seedBeceEnglish2007Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2007:", err);
    process.exit(1);
  });
