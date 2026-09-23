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
// ISOMORPHIC PASSAGE I: KWAME BEMPAH'S AGRARIAN QUEST (CALIBRATED ORIGINAL)
// =========================================================================
const passage1Text = `When the calabashes of fresh palm wine had been drained, Kwame Bempah laid his agricultural predicament before Opanyin Danquah. "I have come to your compound to seek your assistance," he stated with quiet dignity. "You can perhaps guess my errand. I have cleared three acres of fertile loam near the river, yet I possess no seed yams to plant. I know what it means to ask a venerable elder to entrust another with his precious crop, especially in these changing times when young men flee from manual labor. But I am not afraid of toil. The hawk that plunged from the towering silk-cotton tree to the clearing said he would praise himself if no one else did. I began to fend for myself at an age when my agemates were still clinging to their mothers' cloth. If you grant me some seed yams, I shall not disappoint you."

Opanyin Danquah cleared his throat with a slow nod. "It gladdens my heart to meet a resolute youth in an age when our young people have grown fragile. Countless young men have come to me pleading for seed, yet I dismissed them because I knew they would merely bury them in the mounds and leave them to be choked by weeds. When I refuse them, they complain that I am hard-hearted. But it is not so. As our fathers observed, when the archer learns to shoot without missing, the weaverbird learns to fly without perching. I have learned to be stingy with my seed yams. But I can trust you. I recognize industry in your eyes. A ripe cob of maize announces itself by its look. I will give you four hundred seed yams. Return to your plot and prepare your farm."`;

const passage1Questions = [
  {
    number: 1,
    prompt: "In Passage I, the full grammatical form of the clause 'if no one else did' is 'if no one else .........'",
    options: ["jumped", "looked", "was afraid", "praised him"],
    correctAnswer: "praised him",
    hint: "The auxiliary 'did' functions as a pro-verb replacing the earlier predicate 'would praise himself'.",
    workedSolution: "In the sentence 'he would praise himself if no one else did', the auxiliary 'did' substitutes for 'praised him' to avoid repetition.",
    points: 1
  },
  {
    number: 2,
    prompt: "In Passage I, the expression 'I began to fend for myself' means that Kwame Bempah ............",
    options: [
      "defended his community in local disputes",
      "protected his younger siblings from bullies",
      "labored to feed and support himself independently",
      "hunted wild animals in the forest"
    ],
    correctAnswer: "labored to feed and support himself independently",
    hint: "To 'fend for oneself' means to manage, survive, and provide for one's own basic livelihood.",
    workedSolution: "The idiom 'to fend for oneself' means to look after, feed, and support oneself independently without parental aid.",
    points: 1
  },
  {
    number: 3,
    prompt: "According to Passage I, to describe a person as being 'hard-hearted' means that the individual ............",
    options: [
      "has an abnormally solid physical chest",
      "lacks compassion, kindness, and sympathy",
      "is excessively fierce in warfare",
      "habitually refuses to greet neighbors"
    ],
    correctAnswer: "lacks compassion, kindness, and sympathy",
    hint: "'Hard-hearted' denotes unfeeling, unyielding, and devoid of kindness.",
    workedSolution: "'Hard-hearted' describes someone who lacks pity, tenderness, or mercy toward others; having no kind feelings.",
    points: 1
  },
  {
    number: 4,
    prompt: "In Passage I, why did Opanyin Danquah consistently refuse to lend seed yams to many other young men?",
    options: [
      "They were habitually lazy and would allow the crops to be smothered by weeds",
      "They refused to share palm wine when visiting his compound",
      "They lacked the strength to hunt game birds with bows",
      "They were unwilling to sign formal agrarian agreements"
    ],
    correctAnswer: "They were habitually lazy and would allow the crops to be smothered by weeds",
    hint: "Paragraph two states: 'I knew they would merely bury them in the mounds and leave them to be choked by weeds.'",
    workedSolution: "Opanyin Danquah refused because the youths lacked farming diligence and would leave the seed yams to be smothered by weeds.",
    points: 1
  },
  {
    number: 5,
    prompt: "From the dialogue and characterization in Passage I, Kwame Bempah is portrayed as a ............",
    options: [
      "conceited youth who solely flatters himself",
      "resolute, industrious, and hardworking young farmer",
      "timid young man dependent on his mother",
      "reckless borrower who avoids repaying debts"
    ],
    correctAnswer: "resolute, industrious, and hardworking young farmer",
    hint: "Opanyin Danquah recognizes his determination and entrusts him with four hundred seed yams.",
    workedSolution: "Kwame Bempah is depicted as an industrious, self-reliant, and determined young farmer whose integrity earns the elder's trust.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: THE MIDNIGHT INTRUSION (CALIBRATED ORIGINAL)
// =========================================================================
const passage2Text = `We were startled from our deep sleep at dawn by the frantic shrieks of tenants residing in our compound. Father bolted instantly from his mattress and lunged for the bedroom door. Barely a minute later, we heard him cry out in agony. We sprinted into the central hall, flicked on the light switch, and found him sprawled flat on his back, clutching his forehead in pain.

In his desperate rush to unlatch the front door, he had neglected to turn on the corridor light, running headlong into the heavy concrete pillar erected in the middle of the hall. When we inspected his brow, we observed a large swelling and dark blood oozing from a laceration near his right eyebrow. Mother, a retired nursing sister, issued calm, rapid directives to fetch the domestic first-aid kit, a basin of ice cubes, and Father's towel.

When the supplies arrived, she attended immediately to the bleeding cut. Wrapping several ice cubes within the towel, she pressed the compress firmly against the wound for two minutes to constrict the ruptured vessels. Having wiped away the blood, she applied a swab of iodine gauze over the cut and secured it with a clean bandage. Turning to the swelling, she gently massaged the lump with ice, noticeably reducing the inflammation. She then unlatched the exterior door, confronting us with a pathetic scene. Stretched across the courtyard was the lifeless body of a young tenant. In a desperate attempt to resist an armed robbery gang, he had been butchered mercilessly, his body left in the middle of the compound.`;

const passage2Questions = [
  {
    number: 6,
    prompt: "According to Passage II, what initial sound woke the household from sleep at dawn?",
    options: [
      "The loud groans of the father in the hallway",
      "The frantic screams of the tenants in the compound",
      "The sudden clatter of the father springing from bed",
      "The dull thud of the father colliding with the pillar"
    ],
    correctAnswer: "The frantic screams of the tenants in the compound",
    hint: "Reread the opening sentence: the household was awakened by the shrieks of tenants in the house.",
    workedSolution: "The narrative explains that the family was awakened at dawn by the loud shrieks of tenants screaming in the compound.",
    points: 1
  },
  {
    number: 7,
    prompt: "In Passage II, why was the father discovered lying on his back holding his brow?",
    options: [
      "He had been assaulted by an armed burglar",
      "He slipped on a puddle of water in the dark",
      "He ran in total darkness and crashed headlong into the concrete pillar",
      "He collapsed from acute exhaustion and shock"
    ],
    correctAnswer: "He ran in total darkness and crashed headlong into the concrete pillar",
    hint: "Check paragraph two: forgetting to switch on the light caused him to crash into the central pillar.",
    workedSolution: "In his haste in the dark room, he forgot to turn on the light switch and collided violently with the central concrete pillar.",
    points: 1
  },
  {
    number: 8,
    prompt: "Which of the following statements is NOT true concerning the medical treatment administered by Mother in Passage II?",
    options: [
      "Mother had previously served as a nursing sister",
      "Mother utilized Father's towel to wrap ice cubes",
      "Mother dressed the cut using iodine gauze and a bandage",
      "Mother treated the swollen lump by applying boiling water"
    ],
    correctAnswer: "Mother treated the swollen lump by applying boiling water",
    hint: "Mother used ice cubes to massage the lump; boiling water was never applied.",
    workedSolution: "The passage notes that Mother used ice cubes to constrict blood vessels and reduce the swelling; she did not use boiling water.",
    points: 1
  },
  {
    number: 9,
    prompt: "According to Passage II, how did the deceased tenant meet his tragic death?",
    options: [
      "He died of shock after observing the burglary",
      "He was butchered mercilessly by armed robbers after attempting to resist",
      "He was accidentally injured by escaping neighbors",
      "He bled to death after collapsing onto the courtyard pavement"
    ],
    correctAnswer: "He was butchered mercilessly by armed robbers after attempting to resist",
    hint: "Check the final sentence: trying to resist an attack by armed robbers, he had been butchered mercilessly.",
    workedSolution: "The tenant was attacked and brutally killed by armed robbers when he bravely attempted to resist their robbery.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the word 'pathetic' in 'confronted with a pathetic scene' means ............",
    options: [
      "deeply distressing, sorrowful, and heartbreaking",
      "extremely baffling and mysterious",
      "unusually gigantic in size",
      "barbaric and bloodthirsty"
    ],
    correctAnswer: "deeply distressing, sorrowful, and heartbreaking",
    hint: "'Pathetic' in this narrative context denotes arousing profound pity, sorrow, and sadness.",
    workedSolution: "'Pathetic' refers to a sight or circumstance that arouses deep pity, grief, and compassion; 'deeply distressing, sorrowful, and heartbreaking' is its exact equivalent.",
    points: 1
  }
];

// =========================================================================
// GENERAL SECTIONS B - E: SYNONYMS, IDIOMS, ANTONYMS, STRUCTURE
// (ALL ORIGINAL REWRITES MAPPING TO 1998 TARGETS)
// =========================================================================
const generalQuestions = [
  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (11 - 15) ---
  {
    number: 11,
    prompt: "Examination candidates were advised to make their script handwriting legible.\nChoose the word nearest in meaning to 'legible'.",
    options: ["slanting", "clear", "uniform", "bold"],
    correctAnswer: "clear",
    hint: "Easily readable, plain, and decipherable.",
    workedSolution: "'Legible' means clear enough to be read without difficulty; 'clear' is its direct synonym.",
    points: 1
  },
  {
    number: 12,
    prompt: "The sports supporters gathered to jubilate after winning the championship trophy.\nChoose the word nearest in meaning to 'jubilate'.",
    options: ["parade", "rejoice", "applaud", "feast"],
    correctAnswer: "rejoice",
    hint: "Expressing great joy, triumph, and happiness.",
    workedSolution: "'Jubilate' means to feel or express great joy, triumph, or celebration; 'rejoice' is its exact equivalent.",
    points: 1
  },
  {
    number: 13,
    prompt: "Senior bullying and physical intimidation have been banned in our school.\nChoose the word nearest in meaning to 'banned'.",
    options: ["prohibited", "criticized", "debated", "curbed"],
    correctAnswer: "prohibited",
    hint: "Officially disallowed or outlawed by authority.",
    workedSolution: "'Banned' means officially forbidden or outlawed; 'prohibited' is its direct synonym.",
    points: 1
  },
  {
    number: 14,
    prompt: "The statutory penalty for examination malpractice is expulsion from the institution.\nChoose the word nearest in meaning to 'penalty'.",
    options: ["hazard", "charge", "sanction", "punishment"],
    correctAnswer: "punishment",
    hint: "A disciplinary consequence or forfeit imposed for breaking a rule.",
    workedSolution: "'Penalty' refers to a disciplinary forfeit or consequence imposed for an offense; 'punishment' is its direct equivalent.",
    points: 1
  },
  {
    number: 15,
    prompt: "The classroom murmuring ceased immediately the housemaster appeared at the doorway.\nChoose the word nearest in meaning to 'ceased'.",
    options: ["slowed down", "stopped", "subsided", "scattered"],
    correctAnswer: "stopped",
    hint: "Came to an end; halted completely.",
    workedSolution: "'Ceased' means brought to an end or discontinued; 'stopped' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 20) ---
  {
    number: 16,
    prompt: "It will serve her right if she misses the excursion bus due to chronic lateness. This means that ............",
    options: [
      "she will receive an honorable privilege",
      "she will enjoy what she likes most",
      "she will suffer a misfortune that she deservedly brought upon herself",
      "it will be her legitimate legal right to travel"
    ],
    correctAnswer: "she will suffer a misfortune that she deservedly brought upon herself",
    hint: "To get the just, deserved punishment for one's own negligence.",
    workedSolution: "The idiom 'to serve someone right' means that an unpleasant outcome is thoroughly deserved because of the person's own foolishness or misconduct.",
    points: 1
  },
  {
    number: 17,
    prompt: "Mr. Mensah appears respectable, but he leads a double life. This means that he ............",
    options: [
      "reports to the office punctually every morning",
      "toils harder than all his fellow artisans",
      "leads a dishonest private life contrasting sharply with his public image",
      "maintains two legitimate full-time employments"
    ],
    correctAnswer: "leads a dishonest private life contrasting sharply with his public image",
    hint: "Maintaining two contrasting lifestyles, one public and respectable, the other secretive and disreputable.",
    workedSolution: "The idiom 'to lead a double life' means to conduct a secret, often disreputable life that conflicts sharply with one's respectable public persona.",
    points: 1
  },
  {
    number: 18,
    prompt: "My uncle residing in the diaspora visits our village once in a blue moon. This means that he visits ............",
    options: [
      "at the close of every month",
      "very rarely on rare occasions",
      "exclusively on moonlit nights",
      "during festive occasions only"
    ],
    correctAnswer: "very rarely on rare occasions",
    hint: "Happening very seldom or on rare occasions.",
    workedSolution: "'Once in a blue moon' is an idiom meaning very rarely or on extremely infrequent occasions.",
    points: 1
  },
  {
    number: 19,
    prompt: "Academically, our Science Club is second to none in the entire municipality. This means that the club ............",
    options: [
      "invariably occupies the second position",
      "performs poorly in national competitions",
      "is unsurpassed, unrivaled, and the absolute best",
      "is the second largest student society"
    ],
    correctAnswer: "is unsurpassed, unrivaled, and the absolute best",
    hint: "Better than all others; having no equal.",
    workedSolution: "The idiom 'second to none' means unsurpassed, equal to the best, or the foremost in quality.",
    points: 1
  },
  {
    number: 20,
    prompt: "If we had sent the injured farmer to the hospital earlier, he wouldn't have died. This means that ............",
    options: [
      "we sent him to the clinic promptly",
      "we did not convey him to the hospital at all",
      "we delayed in taking him to the hospital, which caused his death",
      "the clinic physicians refused to attend to him"
    ],
    correctAnswer: "we delayed in taking him to the hospital, which caused his death",
    hint: "Counterfactual conditional: the condition was not met in time.",
    workedSolution: "The past counterfactual statement reveals the reality: they delayed in transporting the patient to the hospital, resulting in his untimely death.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "The prefect was punished for being dishonest, while his assistant was commended for being ...... .\nChoose the word most nearly opposite in meaning to 'dishonest'.",
    options: ["respectful", "truthful", "tactful", "obedient"],
    correctAnswer: "truthful",
    hint: "'Dishonest' means deceitful and fraudulent. Find the word denoting truthfulness and integrity.",
    workedSolution: "'Dishonest' means deceitful or untruthful. Its direct antonym is 'truthful' (or sincere/honest).",
    points: 1
  },
  {
    number: 22,
    prompt: "Our teachers always advised us to be humble in conduct, rather than ...... .\nChoose the word most nearly opposite in meaning to 'humble'.",
    options: ["arrogant", "severe", "indolent", "hostile"],
    correctAnswer: "arrogant",
    hint: "'Humble' means modest and unpretentious. Find the word meaning proud and haughty.",
    workedSolution: "'Humble' means modest and unpretentious. Its direct antonym is 'arrogant' (haughty, conceited, or proud).",
    points: 1
  },
  {
    number: 23,
    prompt: "Our school library has purchased modern encyclopedias and ...... the outdated volumes.\nChoose the word most nearly opposite in meaning to 'purchased'.",
    options: ["cataloged", "repaired", "sold", "borrowed"],
    correctAnswer: "sold",
    hint: "'Purchased' means bought with money. What word denotes disposing of goods for money?",
    workedSolution: "'Purchased' means bought by paying money. Its direct commercial antonym is 'sold'.",
    points: 1
  },
  {
    number: 24,
    prompt: "The beef served at the boarding hostel was tough, but the roasted chicken was remarkably ...... .\nChoose the word most nearly opposite in meaning to 'tough'.",
    options: ["fresh", "tender", "succulent", "palatable"],
    correctAnswer: "tender",
    hint: "'Tough' cooked meat is hard to chew. Find the culinary term meaning soft and easy to chew.",
    workedSolution: "'Tough' in cooked meat means hard or difficult to chew. Its direct culinary antonym is 'tender' (soft and easily chewed).",
    points: 1
  },
  {
    number: 25,
    prompt: "Natural vegetation is scanty in arid desert zones, but ...... in equatorial rainforests.\nChoose the word most nearly opposite in meaning to 'scanty'.",
    options: ["evergreen", "sprawling", "flourishing", "dense"],
    correctAnswer: "dense",
    hint: "'Scanty' means sparse or meager. Find the botanical term meaning thickly clustered together.",
    workedSolution: "'Scanty' means meager, sparse, or scarce. Its direct antonym in describing vegetation is 'dense' (thickly clustered).",
    points: 1
  },

  // --- SECTION E: STRUCTURE & QUESTION TAGS (26 - 40) ---
  {
    number: 26,
    prompt: "Anto should ...... his teeth thoroughly before taking his morning breakfast.",
    options: ["clean", "has cleaned", "cleaned", "cleans"],
    correctAnswer: "clean",
    hint: "Modal auxiliaries like 'should' are invariably followed by a bare infinitive verb.",
    workedSolution: "The modal auxiliary 'should' must be followed by the base form of the verb ('clean') without inflections.",
    points: 1
  },
  {
    number: 27,
    prompt: "Mr. Tawiah regularly ...... his evening meal late in the night.",
    options: ["eat", "eats", "eaten", "eating"],
    correctAnswer: "eats",
    hint: "Third-person singular subject ('Mr. Tawiah') taking a simple present tense verb of habitual frequency ('regularly').",
    workedSolution: "The singular subject 'Mr. Tawiah' combined with the frequency adverb 'regularly' requires the third-person singular present verb 'eats'.",
    points: 1
  },
  {
    number: 28,
    prompt: "Can you make ...... Issaka in that surging festive crowd?",
    options: ["of", "up", "out", "away"],
    correctAnswer: "out",
    hint: "Identify the phrasal verb meaning to discern, see, or distinguish someone with difficulty.",
    workedSolution: "The phrasal verb 'to make out' means to see, distinguish, or identify someone with difficulty in a crowd.",
    points: 1
  },
  {
    number: 29,
    prompt: "The earlier we ...... the agricultural project, the better for the school.",
    options: ["have done", "do", "did", "had done"],
    correctAnswer: "do",
    hint: "Correlative comparative construction referring to a general or future condition: 'The earlier we [present]..., the better...'.",
    workedSolution: "In the proportional comparative construction referring to a future or general condition, English uses the simple present: 'The earlier we do the work, the better'.",
    points: 1
  },
  {
    number: 30,
    prompt: "You will pass this national examination with distinction, ......?",
    options: ["don't you", "have you", "may you", "won't you"],
    correctAnswer: "won't you",
    hint: "An affirmative future clause with 'will' takes a contracted negative tag: 'won't you?'.",
    workedSolution: "The main clause has an affirmative future verb ('will pass'). Its corresponding question tag must be negative: 'won't you?'.",
    points: 1
  },
  {
    number: 31,
    prompt: "He showed the police the commercial bus ...... knocked down the pedestrian.",
    options: ["who", "which", "whom", "what"],
    correctAnswer: "which",
    hint: "Use the relative pronoun for inanimate objects, vehicles, or non-human entities.",
    workedSolution: "'Which' (or 'that') is the relative pronoun used to refer to non-human entities and inanimate objects like 'the commercial bus'.",
    points: 1
  },
  {
    number: 32,
    prompt: "The retired headmaster is a respected, long-time friend of ......",
    options: ["my", "me", "myself", "mine"],
    correctAnswer: "mine",
    hint: "Double possessive construction: 'a friend of' requires an absolute possessive pronoun.",
    workedSolution: "In double possessive constructions ('a friend of...'), English requires the independent possessive pronoun 'mine'.",
    points: 1
  },
  {
    number: 33,
    prompt: "The national soccer team is preparing vigorously ...... the upcoming tournament.",
    options: ["with", "by", "on", "for"],
    correctAnswer: "for",
    hint: "Identify the preposition that regularly collocates with the verb 'prepare'.",
    workedSolution: "The verb 'prepare' takes the preposition 'for' when indicating the purpose, event, or objective ('preparing for the match').",
    points: 1
  },
  {
    number: 34,
    prompt: "Search carefully around the laboratory; the missing keys must be ...... in this room.",
    options: ["somehow", "everywhere", "somewhere", "anywhere"],
    correctAnswer: "somewhere",
    hint: "Identify the indefinite locative adverb used in affirmative statements to denote an unspecified place.",
    workedSolution: "In affirmative declarative clauses, 'somewhere' denotes an unspecified location ('somewhere in this room'). 'Anywhere' is used primarily in negatives or questions.",
    points: 1
  },
  {
    number: 35,
    prompt: "The master wanted to find out who was the ...... of the two twin brothers.",
    options: ["most tall", "taller", "more tall", "tallest"],
    correctAnswer: "taller",
    hint: "When comparing exactly two persons, standard grammar requires the comparative degree preceded by 'the'.",
    workedSolution: "When comparing exactly two entities ('of the two boys'), the comparative form preceded by 'the' ('the taller') is grammatically required. 'Tallest' applies to three or more.",
    points: 1
  },
  {
    number: 36,
    prompt: "...... boys playing outside are exceptionally delighted with their new toys.",
    options: ["They", "Those", "This", "That"],
    correctAnswer: "Those",
    hint: "Plural demonstrative determiner modifying the plural noun 'boys' at a distance.",
    workedSolution: "The plural noun 'boys' requires the plural demonstrative determiner 'Those' (or 'These'). 'This' and 'That' are singular; 'They' is a personal pronoun, not a determiner.",
    points: 1
  },
  {
    number: 37,
    prompt: "Julie traveled to the regional capital to visit an elderly relative of ......",
    options: ["hers", "herself", "themselves", "ourselves"],
    correctAnswer: "hers",
    hint: "Double possessive construction: 'a relative of' requires an absolute possessive pronoun.",
    workedSolution: "In double possessive constructions ('a relative of...'), the absolute possessive pronoun 'hers' is required without an apostrophe.",
    points: 1
  },
  {
    number: 38,
    prompt: "The new visitors don't know the route to Kokrobite, ......?",
    options: ["is it", "haven't they", "do they", "isn't it"],
    correctAnswer: "do they",
    hint: "A negative present statement with 'don't' and subject 'The visitors' takes the positive tag 'do they?'.",
    workedSolution: "The statement is negative present simple ('don't know') with a plural subject. The question tag must be affirmative: 'do they?'.",
    points: 1
  },
  {
    number: 39,
    prompt: "Was it not your elder brother who ...... this deep trench yesterday?",
    options: ["has dug", "have dug", "dig", "dug"],
    correctAnswer: "dug",
    hint: "Past time adverbial 'yesterday' requires the simple past form of the irregular verb 'dig'.",
    workedSolution: "The past time indicator 'yesterday' requires the simple past tense of the irregular verb 'dig', which is 'dug'.",
    points: 1
  },
  {
    number: 40,
    prompt: "The classroom is so noisy that I can barely hear her; I wish she ...... louder.",
    options: ["was speaking", "would speak", "had spoken", "might speak"],
    correctAnswer: "would speak",
    hint: "A wish for someone else to change their current behavior takes 'would + base verb'.",
    workedSolution: "When 'wish' expresses a desire for another person to change their action or speak differently in the present/future, English requires 'would + base verb' ('would speak').",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199802);

// Attach Passage I (Q1-5) and Passage II (Q6-10) directly to questions so that
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

  if (qNum >= 1 && qNum <= 5) {
    passageTitle = "Passage I: Kwame Bempah's Agrarian Quest";
    passageText = passage1Text;
    passage = passage1Text;
  } else if (qNum >= 6 && qNum <= 10) {
    passageTitle = "Passage II: The Midnight Intrusion";
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
        prompt: "Write a letter to your friend attending another school, explaining at least three practical lifestyle habits you practice daily to maintain sound physical and mental health.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Konongo, Ashanti Region
12th May, 1998

Dear Kwaku,

I hope this letter finds you in excellent health and high spirits in Kumasi. In your recent letter, you inquired about how I manage to remain energetic and focused throughout the demanding academic term without falling ill. I am glad to share three simple but effective lifestyle habits that keep me physically strong and mentally alert.

First and foremost, I maintain strict nutritional discipline by consuming balanced, home-cooked meals and drinking abundant water. I avoid unwholesome street foods and sugary carbonated drinks that cause dental decay and lethargy. Instead, my diet consists of fresh fruits, leafy vegetables, beans, and fish, which provide vital vitamins and minerals to fight off infections. Furthermore, I drink at least eight glasses of clean water daily to stay hydrated and flush toxins from my body.

Secondly, I participate in consistent physical exercise every morning. Before bathing for school, I spend twenty minutes jogging around our compound, skipping rope, and performing push-ups. Physical exercise strengthens my cardiovascular muscles, improves blood circulation, and releases stress, allowing me to start each day with enthusiasm and mental clarity.

Finally, I observe strict sleep hygiene by ensuring I get eight hours of restful sleep every night. I switch off all lamps and retire to bed by nine o'clock, which allows my body to recuperate and sharpen my memory for the next day's lessons.

Try implementing these habits, and you will notice a remarkable boost in your well-being. Extend my warmest greetings to your parents.

Your true friend,
[Signature]
Kwabena Mensah`
      },
      {
        questionNumber: "2",
        category: "Formal Letter",
        prompt: "As the Games Prefect of your school, write a formal letter to the Chairman of the Parent-Teacher Association (PTA) complaining about the uncooperative attitude of the school administration towards sports and appealing for intervention.",
        modelAnswer: `St. Anthony's Junior Secondary School
P. O. Box 72
Nkawkaw, Eastern Region
18th June, 1998

The Chairman
Parent-Teacher Association
St. Anthony's JSS
Nkawkaw

Dear Sir,

PETITION REGARDING ADMINISTRATIVE NEGLECT OF SPORTS AND AN APPEAL FOR PTA INTERVENTION

On behalf of the sports men and women of St. Anthony's Junior Secondary School, I respectfully write to bring to your urgent notice the discouraging and uncooperative attitude of our school authorities toward sporting activities, and to appeal for your timely intervention.

Over the past two terms, the school administration has systematically neglected physical education and sports. Funds collected as sports levies have not been utilized to purchase basic equipment. Our school football team has only one deflated ball, while our volleyball and table tennis teams lack nets and standard rackets. More frustratingly, our headmaster frequently cancels scheduled training sessions and inter-school friendly matches, declaring that sports are a distraction from academic work.

This hostile posture has severely demoralized our talented athletes and undermined our performance. Education must nurture the whole child—both the intellect and the physical body. Many of our students possess raw athletic gifts that could earn them future national honors and scholarships. Neglecting sports denies them this crucial avenue for personal advancement and promotes physical inactivity.

We humbly appeal to the PTA to deliberate on this matter with the school administration. We request that your executive committee establish a dedicated sports management fund and procure standard jerseys, spiked shoes, and balls before the upcoming inter-zonal competition.

We count on your parental benevolence to restore sporting pride to our school.

Thank you.

Yours faithfully,
[Signature]
Francis Gyabaah
(Games Prefect)`
      },
      {
        questionNumber: "3",
        category: "Descriptive Narrative",
        prompt: "Describe an exciting and colorful traditional celebration that recently took place in your family.",
        modelAnswer: `A COLORFUL TRADITIONAL OUTDOORING AND NAMING CEREMONY IN OUR FAMILY

Last Saturday, our family compound in Mampong was filled with joyful laughter, beating drums, and celebration as relatives gathered from near and far to commemorate the traditional outdooring and naming ceremony of my elder sister Akosua's newborn twin boys.

The sacred ceremony commenced at the crack of dawn, precisely at six o'clock, in accordance with ancient Akan custom. Relatives and clan elders, dressed in immaculate white cloth symbolizing purity and victory, sat in a circle in our central courtyard. The family head, Grandpa Osei, held the infants in his arms and poured traditional libation of schnapps, thanking the Almighty and the ancestral spirits for safe childbirth and praying for the children's longevity, wisdom, and prosperity.

The most solemn moment was the symbolic water and wine ritual. Dipping his index finger into pure water, Grandpa placed a drop on the tongue of the first baby, saying: "When you say it is water, let it be water." He then repeated the gesture with sweet wine, adding: "When you say it is wine, let it be wine." This ancient rite instills in the growing child the supreme virtues of honesty, truthfulness, and integrity. The twins were then officially named Osei Bonsu and Osei Tutu, after our illustrious warrior ancestors.

Immediately after the naming rites, the solemnity transformed into exuberant festivities. Delicious traditional dishes—aromatic mutton palm-nut soup with hot pounded fufu, spicy jollof rice, and crispy fried plantain—were served generously to over a hundred guests. Traditional drummers beat sacred fontomfrom drums while relatives showered the smiling nursing mother with crisp banknotes. It was an unforgettable celebration that reinforced our family solidarity and cultural heritage.`
      },
      {
        questionNumber: "4",
        category: "Narrative Moral Essay",
        prompt: "Write an interesting, realistic story illustrating how thoughtless disobedience or peer pressure led to disaster, ending with the sentence: \"Never will I do that again.\"",
        modelAnswer: `It was a sweltering Saturday afternoon in the dry month of February, and my parents had traveled to the district capital, leaving strict instructions that my younger brother and I should remain on our compound and revise our notes for the upcoming mock examinations. However, my adventurous neighborhood friend, Kofi, had other ideas.

He arrived at our gate with two fishing lines and swimming shorts, urging me to accompany him to the sacred Tano River pool at the outskirts of the village. I hesitated, recalling my father's stern warning that the river was swollen and treacherous due to upstream rains. But Kofi mocked my hesitation, labeling me a timid coward who was tied to his mother's apron strings. Stung by his taunts, I abandoned my books, locked our gate, and followed him to the deep riverbank.

Disregarding the danger sign, we stripped off our shirts and plunged into the churning water. For thirty minutes, we swam excitedly. Then disaster struck. While swimming toward the center, a powerful underwater whirlpool gripped my legs, pulling me downward like an iron anchor. Panic engulfed me as I swallowed mouthfuls of muddy water, flailing my arms and screaming for help. Kofi was too terrified to swim toward me and stood screaming on the bank.

Just as my strength failed and blackness began clouding my vision, a passing palm-wine tapper heard our desperate cries. He plunged into the torrent with a long bamboo pole and dragged my limp, unconscious body ashore, where he administered vigorous resuscitation until I coughed up water.

When my father arrived at the clinic that evening, his eyes were wet with tears of relief and sorrow. Looking at his trembling hands, a wave of deep shame washed over me. Shivering under the hospital blanket, I whispered through tears: Never will I do that again.`
      }
    ]
  }
};

async function seedBeceEnglish1998Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 1998 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_1998");
  await docRef.set({
    year: 1998,
    title: "BECE English Language 1998 (Calibrated National Benchmark)",
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
          title: "Passage I: Kwame Bempah's Agrarian Quest",
          text: passage1Text,
          questionRange: "Questions 1 to 5"
        },
        {
          id: "passage_2",
          title: "Passage II: The Midnight Intrusion",
          text: passage2Text,
          questionRange: "Questions 6 to 10"
        }
      ],
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: Kwame Bempah's Agrarian Quest",
          text: passage1Text,
          questionRange: "Questions 1 to 5",
          questions: passage1Items
        },
        passage2: {
          passageTitle: "Passage II: The Midnight Intrusion",
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

  console.log("✅ Fully Rewritten, Clean-Room BECE English 1998 successfully seeded into Firestore!");
}

seedBeceEnglish1998Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1998:", err);
    process.exit(1);
  });
