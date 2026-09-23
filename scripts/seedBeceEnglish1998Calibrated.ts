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
// PASSAGE I: OKONKWO AND NWAKIBIE
// ==========================================
const passage1Text = `After the palm wine had been drunk, Okonkwo laid his difficulties before Nwakibie. "I have come to you for help," he said. "Perhaps you can already guess what it is. I have cleared a farm but have no yams to sow. I know what it is to ask a man to trust another with his yams, especially these days when young men are afraid of hard work. I am not afraid of work. The lizard that jumped from the high iroko tree to the ground said he would praise himself if no one else did. I began to fend for myself at an age when most people still suck at their mothers' breast. If you give me some yam seeds I shall not fail you."

Nwakibie cleared his throat. "It pleases me to see a determined young man like you these days when our youth have gone so soft. Many young men have come to me to ask for yams but I have refused because I knew they would just dump them in the earth and leave them to be choked by weeds. When I say no to them they think I am hard-hearted. But it is not so. Eneke the bird says that since men have learnt to shoot without missing, he has learnt to fly without perching. I have learnt to be stingy with my yams. But I can trust you. I know it as I look at you. As our fathers said, you can tell a ripe corn by its look. I shall give you four hundred yams. Go ahead and prepare your farm."`;

const passage1QuestionsRaw = [
  {
    number: 1,
    prompt: "In Passage I, the full grammatical form of the clause 'if no one else did' is 'if no one else .........'",
    options: ["jumped", "looked", "was afraid", "praised him"],
    correctAnswer: "praised him",
    hint: "The auxiliary 'did' acts as a pro-verb substituting for the preceding predicate phrase 'would praise himself'.",
    workedSolution: "In the sentence 'he would praise himself if no one else did', the auxiliary 'did' substitutes for 'praised him' to avoid repetition.",
    points: 1
  },
  {
    number: 2,
    prompt: "In Passage I, the expression 'I began to fend for myself' means that Okonkwo ............",
    options: ["defended his village in war", "protected his siblings", "worked to support and feed himself independently", "cleared farms for neighbors"],
    correctAnswer: "worked to support and feed himself independently",
    hint: "To 'fend for oneself' means to manage, survive, and provide for one's own needs without external assistance.",
    workedSolution: "The idiom 'to fend for oneself' means to look after, feed, and provide for one's own physical livelihood independently.",
    points: 1
  },
  {
    number: 3,
    prompt: "According to Passage I, to describe a person as being 'hard-hearted' means that the individual ............",
    options: ["has a solid physical heart", "lacks kindness, pity, or sympathy", "is fierce and wild in battle", "never smiles at children"],
    correctAnswer: "lacks kindness, pity, or sympathy",
    hint: "Unsympathetic, unyielding, and devoid of compassion.",
    workedSolution: "'Hard-hearted' describes a person who lacks compassion, tenderness, or mercy toward others; having no kind feelings.",
    points: 1
  },
  {
    number: 4,
    prompt: "In Passage I, why did Nwakibie consistently refuse to lend seed yams to most other young men in the village?",
    options: [
      "They were habitually lazy and would leave their farms to be overgrown with weeds",
      "They were excessively stingy with farm tools",
      "They were incapable of hunting with guns",
      "They refused to trust his counsel"
    ],
    correctAnswer: "They were habitually lazy and would leave their farms to be overgrown with weeds",
    hint: "Check paragraph two: 'I knew they would just dump them in the earth and leave them to be choked by weeds.'",
    workedSolution: "Nwakibie refused because the other youths lacked work ethic and would allow the seed yams to be choked to death by weeds.",
    points: 1
  },
  {
    number: 5,
    prompt: "From the dialogue and characterization in Passage I, Okonkwo is revealed as a ............",
    options: [
      "boastful young man who only sings his own praises",
      "determined, hardworking, and resolute young farmer",
      "cowardly youth who relies on his mother",
      "greedy and dishonest debtor"
    ],
    correctAnswer: "determined, hardworking, and resolute young farmer",
    hint: "Nwakibie recognizes his industry and commits four hundred seed yams to him.",
    workedSolution: "Okonkwo is portrayed as an industrious, persevering, and fiercely independent young farmer whose commitment wins Nwakibie's trust.",
    points: 1
  }
];

// ==========================================
// PASSAGE II: MIDNIGHT EMERGENCY
// ==========================================
const passage2Text = `We were suddenly awakened at dawn by the screams of the tenants in the house. Daddy quickly jumped from his bed and made for the door. Not long after, we heard him screaming. We ran to the hall, switched on the light and saw him lying flat on his back, holding his forehead.

In his haste to get to the hall door, he must have forgotten to switch on the light, thus running straight and crashing his head against the pillar in the middle of the hall. When we examined his forehead, we saw a big lump and blood oozing from a deep cut near his eyebrow. Mother, a retired nursing sister, shouted instructions at me to get the first aid box, some ice cubes and Daddy's towel.

When the items were brought, she then set to work first on the cut. She put some ice cubes in the towel and pressed them on the cut for about two minutes. She then wiped the blood gently. Afterwards, she put a little iodine on gauze, placed it on the cut and bandaged it. Then turning to the lump, she massaged it with some ice cubes, which reduced the swelling. She then opened the door and we were confronted with a pathetic scene. Lying in the middle of the house was the body of one of the tenants. Trying to resist an attack by armed robbers, he had been butchered mercilessly and his body left in the middle of the house.`;

const passage2QuestionsRaw = [
  {
    number: 6,
    prompt: "According to Passage II, what initial noise woke the family members from sleep at dawn?",
    options: [
      "The loud noise made by the father in the corridor",
      "The frantic screams of the tenants in the compound",
      "The father's sudden leap from his bed",
      "The sound of the father crashing into the pillar"
    ],
    correctAnswer: "The frantic screams of the tenants in the compound",
    hint: "Reread the opening sentence: 'We were suddenly awakened at dawn by the screams of the tenants in the house.'",
    workedSolution: "The household was awakened by the loud screams of tenants in the house who were being attacked by armed intruders.",
    points: 1
  },
  {
    number: 7,
    prompt: "In Passage II, why was the father found lying on his back holding his forehead?",
    options: [
      "He was running away from robbers",
      "He slipped on the wet floor tiles",
      "He failed to put on the light and collided with the pillar",
      "He was struck by an armed robber"
    ],
    correctAnswer: "He failed to put on the light and collided with the pillar",
    hint: "Check paragraph two: running in the dark caused him to crash directly into the pillar.",
    workedSolution: "In his rush in the dark hall, he forgot to turn on the light and crashed violently into the central concrete pillar.",
    points: 1
  },
  {
    number: 8,
    prompt: "Which of the following statements is NOT true regarding the medical treatment administered by the mother in Passage II?",
    options: [
      "Mother was a retired nursing sister",
      "Mother wrapped ice cubes in Daddy's towel",
      "Mother applied iodine and ice cubes to treat the injury",
      "Mother applied warm boiling water to soothe the swelling"
    ],
    correctAnswer: "Mother applied warm boiling water to soothe the swelling",
    hint: "Mother used ice cubes to arrest bleeding and massage the lump; warm water was never used.",
    workedSolution: "The passage notes that Mother used ice cubes to constrict blood vessels and reduce swelling; she did not apply warm water.",
    points: 1
  },
  {
    number: 9,
    prompt: "According to Passage II, how did the deceased tenant meet his tragic death?",
    options: [
      "He collapsed from a sudden stroke",
      "He was butchered mercilessly by armed robbers after resisting them",
      "He was accidentally shot by his neighbors",
      "He died of shock after witnessing the burglary"
    ],
    correctAnswer: "He was butchered mercilessly by armed robbers after resisting them",
    hint: "Reread the final sentence: 'Trying to resist an attack by armed robbers, he had been butchered mercilessly...'",
    workedSolution: "The tenant was attacked and brutally killed by armed robbers when he attempted to resist their robbery.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the word 'pathetic' in 'confronted with a pathetic scene' means ............",
    options: ["deeply sad and distressing", "unusually strange", "exceptionally mighty", "merciless and cruel"],
    correctAnswer: "deeply sad and distressing",
    hint: "Evoking deep sorrow, pity, compassion, and grief.",
    workedSolution: "'Pathetic' refers to a sight or circumstance that arouses profound pity, sorrow, or sympathy; 'deeply sad and distressing' is the direct meaning.",
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
    prompt: "Candidates were advised to make their handwriting legible.\nChoose the word nearest in meaning to the underlined word 'legible'.",
    options: ["crooked", "clear", "straight", "deep"],
    correctAnswer: "clear",
    hint: "Easily readable, plain, and decipherable.",
    workedSolution: "'Legible' means clear enough to be read easily; 'clear' is its direct synonym.",
    points: 1
  },
  {
    number: 12,
    prompt: "The supporters assembled to jubilate after winning the championship.\nChoose the word nearest in meaning to the underlined word 'jubilate'.",
    options: ["embrace the supporters", "reward the players", "rejoice", "feast"],
    correctAnswer: "rejoice",
    hint: "Expressing great joy, triumph, and happiness.",
    workedSolution: "'Jubilate' means to feel or express great joy or triumph; 'rejoice' is its exact equivalent.",
    points: 1
  },
  {
    number: 13,
    prompt: "Bullying and senior intimidation have been banned in our basic school.\nChoose the word nearest in meaning to the underlined word 'banned'.",
    options: ["encouraged", "forbidden", "discussed", "introduced"],
    correctAnswer: "forbidden",
    hint: "Officially prohibited or disallowed by authority.",
    workedSolution: "'Banned' means officially prohibited or outlawed; 'forbidden' is its direct synonym.",
    points: 1
  },
  {
    number: 14,
    prompt: "The prescribed penalty for examination fraud is expulsion from the institution.\nChoose the word nearest in meaning to the underlined word 'penalty'.",
    options: ["trouble", "cause", "foul", "punishment"],
    correctAnswer: "punishment",
    hint: "A sanction or forfeiture imposed for breaking a law or rule.",
    workedSolution: "'Penalty' refers to a sanction or disciplinary consequence imposed for an offense; 'punishment' is its direct equivalent.",
    points: 1
  },
  {
    number: 15,
    prompt: "The commotion ceased immediately the senior housemaster stepped into the hall.\nChoose the word nearest in meaning to the underlined word 'ceased'.",
    options: ["changed over", "dragged on", "stopped", "increased"],
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
      "she will have what she likes",
      "it will be an extraordinary privilege",
      "she will suffer what she deservedly brought upon herself",
      "it will be her legal right to travel"
    ],
    correctAnswer: "she will suffer what she deservedly brought upon herself",
    hint: "To get the just, deserved punishment for one's own foolishness or negligence.",
    workedSolution: "The idiom 'to serve someone right' means that an unpleasant consequence is thoroughly deserved because of the person's own misconduct.",
    points: 1
  },
  {
    number: 17,
    prompt: "Mr. Mensah appears respectable, but he leads a double life. This means that he ............",
    options: [
      "arrives at work punctually",
      "works harder than all his peers",
      "leads a dishonest private life contrasting with his public image",
      "holds two legitimate daytime jobs"
    ],
    correctAnswer: "leads a dishonest private life contrasting with his public image",
    hint: "Maintaining two contrasting lifestyles, one public and respectable, the other secretive and disreputable.",
    workedSolution: "The idiom 'to lead a double life' means to conduct a secret life (often immoral or criminal) that conflicts sharply with one's respectable public persona.",
    points: 1
  },
  {
    number: 18,
    prompt: "My uncle in the diaspora visits our village once in a blue moon. This means that he visits ............",
    options: ["at the close of every month", "very rarely", "during moonlit nights", "on a daily basis"],
    correctAnswer: "very rarely",
    hint: "Happening very seldom or on rare occasions.",
    workedSolution: "'Once in a blue moon' is an idiom meaning very rarely or on extremely infrequent occasions.",
    points: 1
  },
  {
    number: 19,
    prompt: "Academically, our Science Club is second to none in the entire municipality. This means that the club ............",
    options: [
      "always takes the second position",
      "does not perform well in competitions",
      "is the absolute best and superior to all others",
      "is the second largest group"
    ],
    correctAnswer: "is the absolute best and superior to all others",
    hint: "Better than all others; having no equal.",
    workedSolution: "The idiom 'second to none' means unsurpassed, equal to the best, or the foremost in quality.",
    points: 1
  },
  {
    number: 20,
    prompt: "If we had sent the patient to the hospital earlier, he wouldn't have died. This means that ............",
    options: [
      "we sent him to the clinic promptly",
      "we did not send him to the hospital at all",
      "we sent him to the hospital late, resulting in his death",
      "we were warned not to take him to the hospital"
    ],
    correctAnswer: "we sent him to the hospital late, resulting in his death",
    hint: "Counterfactual conditional: the condition was not met in time.",
    workedSolution: "The past counterfactual statement implies the reality: they delayed in sending the patient to the hospital, which caused his untimely death.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (21 - 25) ---
  {
    number: 21,
    prompt: "The prefect was punished for being dishonest, while his assistant was commended for being ...... .",
    options: ["rough", "respectful", "sincere", "tactful"],
    correctAnswer: "sincere",
    hint: "'Dishonest' means deceitful and untruthful. Find the word denoting truthfulness and honesty.",
    workedSolution: "'Dishonest' means deceitful or fraudulent. Its direct antonym is 'sincere' (honest, truthful, and genuine).",
    points: 1
  },
  {
    number: 22,
    prompt: "Our teachers always advised us to be humble, rather than ...... .",
    options: ["arrogant", "gentle", "hardworking", "wicked"],
    correctAnswer: "arrogant",
    hint: "'Humble' means modest and unpretentious. Find the word meaning proud and haughty.",
    workedSolution: "'Humble' means showing a modest estimate of one's importance. Its direct antonym is 'arrogant' (haughty, conceited, and overbearing).",
    points: 1
  },
  {
    number: 23,
    prompt: "Our headmaster has purchased modern encyclopedias for the library and ...... the outdated volumes.",
    options: ["selected", "collected", "sold", "lent"],
    correctAnswer: "sold",
    hint: "'Purchased' means bought. Find the word that denotes disposing of property for money.",
    workedSolution: "'Purchased' means bought by paying money. Its direct commercial antonym is 'sold'.",
    points: 1
  },
  {
    number: 24,
    prompt: "The beef served at the hostel was tough, but the roasted chicken was remarkably ...... .",
    options: ["big", "soft", "slippery", "rough"],
    correctAnswer: "soft",
    hint: "'Tough' in cooked meat means hard to chew. Find the word meaning tender and easily chewed.",
    workedSolution: "'Tough' in culinary texture means hard or difficult to chew. Its direct culinary antonym is 'soft' (or tender).",
    points: 1
  },
  {
    number: 25,
    prompt: "Natural vegetation is scanty in arid desert zones, but ...... in equatorial rain forests.",
    options: ["green", "dry", "little", "dense"],
    correctAnswer: "dense",
    hint: "'Scanty' means meager, sparse, or scarce. Find the word meaning thick and closely packed together.",
    workedSolution: "'Scanty' means meager, sparse, or barely sufficient. Its direct antonym in describing vegetation is 'dense' (thickly clustered).",
    points: 1
  },

  // --- SECTION E: LEXIS AND STRUCTURE (26 - 40) ---
  {
    number: 26,
    prompt: "Anto should ...... his teeth before taking his morning breakfast.",
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
    hint: "Singular third-person subject ('Mr. Tawiah') taking a simple present tense verb of habitual frequency ('regularly').",
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
    hint: "Parallel correlative structure with present meaning: 'The earlier we [present]..., the better...'.",
    workedSolution: "In the proportional comparative construction referring to a future or general condition, English uses the simple present: 'The earlier we do the work, the better'.",
    points: 1
  },
  {
    number: 30,
    prompt: "You will pass this national examination with distinction, ......?",
    options: ["don't you", "have you", "may you", "won't you"],
    correctAnswer: "won't you",
    hint: "An affirmative future clause with 'will' takes a negative tag with 'will not' (contracted to 'won't').",
    workedSolution: "The main clause has an affirmative future verb ('will pass'). Its corresponding question tag must be negative: 'won't you?'.",
    points: 1
  },
  {
    number: 31,
    prompt: "He showed the police the commercial bus ...... knocked down the pedestrian.",
    options: ["who", "which", "whom", "what"],
    correctAnswer: "which",
    hint: "Use the relative pronoun for inanimate objects, vehicles, or animals.",
    workedSolution: "'Which' (or 'that') is the relative pronoun used to refer to non-human entities and inanimate objects like 'the car/bus'.",
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
    prompt: "The national soccer team is preparing vigorously ...... the upcoming continental tournament.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199801);

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
const passage1Questions = balancedPaper1.slice(0, 5);
const passage2Questions = balancedPaper1.slice(5, 10);
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

Just as my strength failed and blackness began clouding my vision, a passing palm-wine tapper, heard our desperate cries. He plunged into the torrent with a long bamboo pole and dragged my limp, unconscious body ashore, where he administered vigorous resuscitation until I coughed up water.

When my father arrived at the clinic that evening, his eyes were wet with tears of relief and sorrow. Looking at his trembling hands, a wave of deep shame washed over me. Shivering under the hospital blanket, I whispered through tears: Never will I do that again.`
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

async function seedBeceEnglish1998Calibrated() {
  console.log("Seeding Calibrated & Passage-First BECE English 1998 into Firestore...");

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
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      // Section A: Passage-First Comprehension Architecture
      sectionA_comprehension: {
        title: "Section A: Reading Comprehension",
        instructions: "Read the following passages carefully and answer the questions that follow each passage.",
        passage1: {
          passageTitle: "Passage I: Okonkwo and Nwakibie",
          text: passage1Text,
          questionRange: "Questions 1 to 5",
          questions: passage1Questions
        },
        passage2: {
          passageTitle: "Passage II: The Midnight Emergency",
          text: passage2Text,
          questionRange: "Questions 6 to 10",
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

  console.log("✅ Calibrated & Passage-First BECE English 1998 successfully seeded into Firestore!");
}

seedBeceEnglish1998Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1998:", err);
    process.exit(1);
  });
