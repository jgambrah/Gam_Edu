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
// PASSAGE I: THE INTERRUPTED GRAMMAR LESSON
// ==========================================
const passage1Text = `It was an English lesson and our classroom was quiet. The blackboard was covered with sentences on 'if' clauses and we went through such different forms as:
1. If he comes, I shall be happy;
2. If you abused him, he would beat you;
3. Amo could have won the race if he had trained harder.

We all found it difficult to understand the formula for each sentence. We had problems with the tenses, but as our final examinations were so near, we really had to master them. We were, however, interrupted by the noise of a bucket and heavy footsteps on the veranda. Then Mr. Odumba's big head came round the door.

"Sorry to interrupt," he told our teacher. We all looked up, highly pleased at the welcomed interruption. Who knows, Mr. Odumba might fall down again, and what could be more pleasing than that in the middle of a difficult lesson?

"Can I have a word with you alone, please?" Mr. Odumba asked our teacher, who followed him to the veranda. Mr. Odumba, looking uncomfortable, took a deep breath and said that some pawpaw he had marked in the morning had been stolen from his garden.

Finally, he asked our teacher, "Would you mind if I went round to find out which of your pupils' hands smell of pawpaw?"`;

const passage1QuestionsRaw = [
  {
    number: 1,
    prompt: "In Passage I, why was the classroom exceptionally quiet during the lesson?",
    options: [
      "The pupils were anxious for the difficult period to conclude",
      "The pupils were concentrating intensely on complex conditional sentences for their impending examination",
      "The class had collectively stolen ripe pawpaw from the garden",
      "Mr. Odumba had commanded absolute silence from the veranda"
    ],
    correctAnswer: "The pupils were concentrating intensely on complex conditional sentences for their impending examination",
    hint: "Reread paragraph one and two: the board was covered with 'if' clauses and final examinations were so near that they had to master them.",
    workedSolution: "The silence was driven by serious academic concentration: the students found conditional tenses difficult but knew they had to master them for final examinations.",
    points: 1
  },
  {
    number: 2,
    prompt: "What was Mr. Odumba's actual mission when he visited the classroom in Passage I?",
    options: [
      "To administer corporal punishment to a recalcitrant student",
      "To track down and identify the culprits who had stolen ripe pawpaw from his garden",
      "To return a missing metal bucket to the school authorities",
      "To engage in a social chat with the English master"
    ],
    correctAnswer: "To track down and identify the culprits who had stolen ripe pawpaw from his garden",
    hint: "Check paragraph four and five: his marked pawpaws were stolen and he wanted to smell the students' hands.",
    workedSolution: "Mr. Odumba came to investigate the theft of ripe pawpaws from his school garden and inspect the pupils' hands for scent.",
    points: 1
  },
  {
    number: 3,
    prompt: "How did the students react emotionally to Mr. Odumba's unexpected interruption of their class?",
    options: [
      "They were terrified of being punished",
      "They were annoyed by the sudden noise",
      "They were delighted because it provided temporary relief from a difficult lesson",
      "They felt deep sympathy for his stolen fruit"
    ],
    correctAnswer: "They were delighted because it provided temporary relief from a difficult lesson",
    hint: "Look at paragraph three: 'We all looked up, highly pleased at the welcomed interruption.'",
    workedSolution: "The students welcomed the interruption with delight because it broke the monotony and mental strain of a difficult grammar lesson.",
    points: 1
  },
  {
    number: 4,
    prompt: "Which of the following statements is NOT true according to Passage I?",
    options: [
      "The pupils found grammatical formulas on conditional tenses challenging",
      "Mr. Odumba had suffered a comical fall on a previous occasion",
      "The English master initially struggled to explain the tenses simply",
      "The teacher confirmed that all the pupils' hands smelled of pawpaw"
    ],
    correctAnswer: "The teacher confirmed that all the pupils' hands smelled of pawpaw",
    hint: "Mr. Odumba merely asked permission to smell their hands; the passage never states that their hands actually smelled of pawpaw.",
    workedSolution: "The text concludes with Mr. Odumba asking to smell their hands; asserting that their hands were proven to smell of pawpaw is completely false.",
    points: 1
  },
  {
    number: 5,
    prompt: "In Passage I, the phrase 'Mr. Odumba's big head came round the door' means that he ............",
    options: [
      "peered and appeared at the doorway entrance",
      "collided his head against the wooden door",
      "blocked the entrance corridor completely",
      "pushed the door wide open with his shoulders"
    ],
    correctAnswer: "peered and appeared at the doorway entrance",
    hint: "To stick one's head round a door means to lean forward and appear at the entrance.",
    workedSolution: "The expression means he leaned forward so that his face and head appeared at the doorway to speak to the teacher.",
    points: 1
  },
  {
    number: 6,
    prompt: "In Passage I, the polite request 'Can I have a word with you?' means ............",
    options: [
      "allow me to assist you in teaching grammar",
      "permit me to speak privately with you for a brief moment",
      "let me teach your class a single vocabulary word",
      "kindly return my garden fruits immediately"
    ],
    correctAnswer: "permit me to speak privately with you for a brief moment",
    hint: "'To have a word with someone' means to speak with them briefly and privately.",
    workedSolution: "The idiom 'to have a word with someone' means to converse briefly and privately with them.",
    points: 1
  }
];

// ==========================================
// PASSAGE II: THE CANINE BATTLE
// ==========================================
const passage2Text = `Have you ever watched two dogs fighting? The scene is both interesting and terrifying. I once watched two dogs, Whisky and Sandy, fighting. Whisky was a brown dog with white hair round his eyes. This made him look very fearful. He was often running after lizards and barking at strange things and visitors. Sandy, on the other hand, was a black dog with white legs and face. He was gentle and friendly to both adults and children.

When the fight started, everybody thought Sandy would be no match for Whisky. Whisky was the first to attack. He jumped up with his fore-legs raised, mouth wide open and gripped the back of Sandy's neck with his sharp teeth. Sandy went down with Whisky on top of him. Sandy played it cool as if he did not feel any pain. The spectators believed the more aggressive Whisky had won the fight.

Suddenly, the tide turned. Sandy got hold of one of Whisky's hind legs and bit hard as if breaking a bone. Whisky felt the pain and as he opened his mouth to yelp, Sandy broke free.

As Whisky was about to attack again, Sandy jumped on his back and held his throat. Down he went on his back. The crowd then cheered, "Sandy! San-dy!! San-dy!!!"

Feeling very proud, Sandy released Whisky and he ran away with his tail between his legs. Sandy had won the fight.`;

const passage2QuestionsRaw = [
  {
    number: 7,
    prompt: "According to Passage II, witnessing a fierce physical combat between two dogs generally makes a spectator feel ............",
    options: [
      "simultaneously fascinated and terrified",
      "compelled to flee immediately in panic",
      "an urgent desire to strike them with wooden sticks",
      "compelled to shout and cheer"
    ],
    correctAnswer: "simultaneously fascinated and terrified",
    hint: "Reread the opening sentences: 'The scene is both interesting and terrifying.'",
    workedSolution: "The author observes that watching dogs fight evokes a dual reaction of fascination (interest) and fear (terror).",
    points: 1
  },
  {
    number: 8,
    prompt: "In Passage II, why did the spectators initially conclude that Whisky had won the fight?",
    options: [
      "Whisky had a proven reputation for killing lizards",
      "Whisky possessed superior tactical combat skills",
      "Whisky leaped higher into the air than Sandy",
      "Whisky launched an aggressive first strike and pinned Sandy to the ground"
    ],
    correctAnswer: "Whisky launched an aggressive first strike and pinned Sandy to the ground",
    hint: "Check paragraph two: Whisky attacked first, clamped his teeth on Sandy's neck, and pinned him down.",
    workedSolution: "Spectators thought Whisky had triumphed because he executed an overwhelming initial assault, biting Sandy's neck and pinning him beneath him.",
    points: 1
  },
  {
    number: 9,
    prompt: "How did Sandy ultimately subdue and defeat his fierce opponent in Passage II?",
    options: [
      "He relied on the cheering encouragement of the crowd",
      "He fractured Whisky's hind leg completely",
      "He leaped upon Whisky's back and pinned him down by the throat",
      "He retreated until Whisky became exhausted"
    ],
    correctAnswer: "He leaped upon Whisky's back and pinned him down by the throat",
    hint: "Look at paragraph four: Sandy jumped on Whisky's back and clamped his jaws on his throat until he surrendered.",
    workedSolution: "Sandy secured total victory by jumping onto Whisky's back and gripping his throat firmly, pinning him flat on his back.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the expression 'Sandy played it cool' means that Sandy ............",
    options: [
      "relished the violence of the encounter",
      "felt a chilling physical sensation in his body",
      "refrained from barking aloud",
      "remained remarkably calm, composed, and unruffled"
    ],
    correctAnswer: "remained remarkably calm, composed, and unruffled",
    hint: "'To play it cool' means to maintain composure and refrain from panicking under pressure.",
    workedSolution: "The idiom 'to play it cool' means to remain calm, undisturbed, and patient despite severe provocation or pain.",
    points: 1
  },
  {
    number: 11,
    prompt: "In Passage II, the phrase 'the tide turned' means that ............",
    options: [
      "the combat situation dramatically reversed in favor of the underdog",
      "a sudden violent ocean wind blew across the compound",
      "the atmospheric weather became turbulent",
      "the spectators intervened in the fight"
    ],
    correctAnswer: "the combat situation dramatically reversed in favor of the underdog",
    hint: "When 'the tide turns', an ongoing course of events undergoes a complete reversal.",
    workedSolution: "The idiom 'the tide turned' means the prevailing momentum or situation completely reversed in direction.",
    points: 1
  }
];

// ==========================================
// GENERAL LEXIS AND STRUCTURE (12 - 40)
// ==========================================
const generalQuestionsRaw = [
  // --- SECTION B: OPPOSITE IN MEANING (ANTONYMS) (12 - 15) ---
  {
    number: 12,
    prompt: "While the cooperative traders agreed to pay the municipal toll, the recalcitrant hawkers ...... .",
    options: ["tried", "struggled", "refused", "remembered"],
    correctAnswer: "refused",
    hint: "'Agreed' means consented. Find the word that denotes declining or rejecting.",
    workedSolution: "'Agreed' means gave consent. Its direct antonym in civic compliance is 'refused' (declined).",
    points: 1
  },
  {
    number: 13,
    prompt: "The champion boxer displayed great bravery in the ring, unlike his opponent who exhibited ...... .",
    options: ["speed", "cowardice", "alertness", "competence"],
    correctAnswer: "cowardice",
    hint: "'Bravery' means courage. Find the word denoting lack of courage or faint-heartedness.",
    workedSolution: "'Bravery' means courage and valor. Its direct opposite is 'cowardice' (lack of bravery).",
    points: 1
  },
  {
    number: 14,
    prompt: "It is well established that Zaibu provides accurate solutions, whereas his seatmate gives ...... answers.",
    options: ["long", "silly", "interesting", "quick"],
    correctAnswer: "silly",
    hint: "'Accurate' means correct, sound, and exact. Find the word denoting foolish, unsound, or absurd answers.",
    workedSolution: "'Accurate' implies correctness and precision. In describing the quality of academic answers, its contextual opposite is 'silly' (foolish or absurd).",
    points: 1
  },
  {
    number: 15,
    prompt: "The students rejected the prefect appointed by the staff, but enthusiastically ...... the elected candidate.",
    options: ["admired", "advised", "relied on", "accepted"],
    correctAnswer: "accepted",
    hint: "'Rejected' means turned down or dismissed. Find the word meaning received with favor.",
    workedSolution: "'Rejected' means refused to recognize or take. Its direct antonym is 'accepted' (approved or received).",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 21) ---
  {
    number: 16,
    prompt: "At the conclusion of the inquiry, the magistrate declared that the hands of the accused were clean. This means the accused was ............",
    options: [
      "commended for physical personal hygiene",
      "completely blameless, innocent, and free from guilt",
      "directed to wash his hands",
      "identified through forensic fingerprints"
    ],
    correctAnswer: "completely blameless, innocent, and free from guilt",
    hint: "To have clean hands means to be innocent and free from corruption or guilt.",
    workedSolution: "The idiom 'clean hands' signifies moral innocence, blamelessness, and freedom from wrongdoing.",
    points: 1
  },
  {
    number: 17,
    prompt: "\"It is only two o'clock, Martin; you needn't depart yet.\" This means that Martin ............",
    options: [
      "habitually stays indoors",
      "is strictly prohibited from leaving",
      "does not have an obligation to leave right now",
      "has already departed"
    ],
    correctAnswer: "does not have an obligation to leave right now",
    hint: "'Needn't' expresses absence of obligation or necessity.",
    workedSolution: "'Needn't' indicates absence of obligation ('does not need to / does not have to leave yet').",
    points: 1
  },
  {
    number: 18,
    prompt: "The boy feared that his father would inquire where he had been. This means that ............",
    options: [
      "he was terrified when his father interrogated him",
      "he would be frightened if his father were present",
      "he concealed his whereabouts out of fear",
      "he felt anxious that his father would want to know where he had been"
    ],
    correctAnswer: "he felt anxious that his father would want to know where he had been",
    hint: "'Feared that' expresses anxiety or apprehension regarding an anticipated event.",
    workedSolution: "'Feared that' denotes apprehension regarding a future possibility: he was anxious that his father would demand an explanation.",
    points: 1
  },
  {
    number: 19,
    prompt: "I dislike associating with people who blow their own trumpet. This means I dislike people who ............",
    options: [
      "make deafening noise in public",
      "boast and brag excessively about their own achievements",
      "play brass musical instruments",
      "quarrel persistently with neighbors"
    ],
    correctAnswer: "boast and brag excessively about their own achievements",
    hint: "To praise oneself excessively; to boast.",
    workedSolution: "The idiom 'to blow one's own trumpet' means to brag, boast, or promote one's own virtues and successes.",
    points: 1
  },
  {
    number: 20,
    prompt: "If Mantey had passed the final examination, his father would have bought him a bicycle. This statement implies that Mantey ............",
    options: [
      "failed the examination, so he received no bicycle",
      "routinely failed his school tests",
      "would receive a present if he passed next year",
      "was awarded a bicycle before the examination"
    ],
    correctAnswer: "failed the examination, so he received no bicycle",
    hint: "Counterfactual Third Conditional: the condition was not met in reality.",
    workedSolution: "The Third Conditional expresses an unfulfilled past condition, revealing the historical reality: Mantey failed and therefore received no gift.",
    points: 1
  },
  {
    number: 21,
    prompt: "\"Put this savings aside against a rainy day, Kwesi.\" Kwesi is being counseled ............",
    options: [
      "to reserve the money safely for future emergencies or unforeseen hardships",
      "to lock the cash until the rainy season begins",
      "to avoid spending currency while it rains",
      "to deposit all his capital into commercial banks"
    ],
    correctAnswer: "to reserve the money safely for future emergencies or unforeseen hardships",
    hint: "'Against a rainy day' means for a future time of need or financial trouble.",
    workedSolution: "The idiom 'for a rainy day' means to reserve money or resources for a future period of financial hardship or unexpected emergency.",
    points: 1
  },

  // --- SECTION D: QUESTION TAGS & GRAMMAR (22 - 33) ---
  {
    number: 22,
    prompt: "Eshun is an accomplished vocalist in the choir, ......?",
    options: ["isn't it", "wasn't he", "is he", "isn't he"],
    correctAnswer: "isn't he",
    hint: "An affirmative present statement with copula 'is' and masculine subject takes the negative tag 'isn't he?'.",
    workedSolution: "The statement is affirmative simple present using 'is' with subject 'Eshun'. The corresponding question tag must be negative: 'isn't he?'.",
    points: 1
  },
  {
    number: 23,
    prompt: "You shouldn't labor so late into the night, ......?",
    options: ["won't you", "do you", "should you", "don't you"],
    correctAnswer: "should you",
    hint: "A negative modal statement with 'shouldn't' takes an affirmative tag: 'should you?'.",
    workedSolution: "The main clause has a negative modal auxiliary ('shouldn't'). The question tag must be affirmative: 'should you?'.",
    points: 1
  },
  {
    number: 24,
    prompt: "You will travel by passenger train to Kumasi, ......?",
    options: ["won't you", "can't you", "shouldn't you", "wouldn't you"],
    correctAnswer: "won't you",
    hint: "An affirmative future clause with 'will' takes a contracted negative tag: 'won't you?'.",
    workedSolution: "The statement is affirmative future with 'will'. Its matching question tag must be negative: 'won't you?'.",
    points: 1
  },
  {
    number: 25,
    prompt: "You are not terrified of harmless garden snakes, ......?",
    options: ["aren't you", "are you", "do you", "won't you"],
    correctAnswer: "are you",
    hint: "A negative clause with 'are not' and subject 'you' takes an affirmative tag: 'are you?'.",
    workedSolution: "The main clause contains a negative auxiliary ('are not'). The question tag must be affirmative: 'are you?'.",
    points: 1
  },
  {
    number: 26,
    prompt: "I can retire to sleep now because I ...... all my homework.",
    options: ["am finishing", "will finished", "finished", "have finished"],
    correctAnswer: "have finished",
    hint: "Present Perfect tense: An action completed in the immediate past that creates a present state of freedom.",
    workedSolution: "The present state of freedom ('I can go to bed now') results from an action completed in the immediate past, requiring the Present Perfect: 'have finished'.",
    points: 1
  },
  {
    number: 27,
    prompt: "No dedicated instructor can be expected to ...... such insolent behavior from students.",
    options: ["put up with", "put in for", "put across to", "put down against"],
    correctAnswer: "put up with",
    hint: "Identify the three-word phrasal verb meaning to endure, bear, or tolerate.",
    workedSolution: "The phrasal verb 'to put up with' means to tolerate, endure, or bear unpleasant conduct.",
    points: 1
  },
  {
    number: 28,
    prompt: "The speaker's voice is so faint that I can barely hear him; I wish he ...... louder.",
    options: ["will speak", "is speaking", "would speak", "had spoken"],
    correctAnswer: "would speak",
    hint: "A wish for someone else to change their present behavior takes 'would + base verb'.",
    workedSolution: "When 'wish' conveys a desire for another person to alter their current action, English uses 'would + base verb': 'would speak'.",
    points: 1
  },
  {
    number: 29,
    prompt: "If Sampson had confessed the whole truth, the master ...... him so severely.",
    options: [
      "shouldn't have punished",
      "won't have punished",
      "wouldn't have punished",
      "wouldn't punish"
    ],
    correctAnswer: "wouldn't have punished",
    hint: "Third Conditional: 'had confessed' in the if-clause requires 'would not have + past participle' in the main clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the main clause requires 'would not have + past participle' ('wouldn't have punished').",
    points: 1
  },
  {
    number: 30,
    prompt: "The principal advised the candidates to ...... if they intended to secure distinction in the BECE.",
    options: ["sit back", "sit by", "sit on", "sit up"],
    correctAnswer: "sit up",
    hint: "Identify the phrasal verb meaning to become alert, take notice, and apply serious diligence.",
    workedSolution: "The phrasal idiom 'to sit up' (or 'sit up and take notice') means to become active, diligent, and serious in applying oneself.",
    points: 1
  },
  {
    number: 31,
    prompt: "Upon hearing the comedian's witty joke, the entire audience burst ...... spontaneous laughter.",
    options: ["burst with", "burst into", "burst for", "burst in"],
    correctAnswer: "burst into",
    hint: "Identify the preposition that collocates with 'burst' when suddenly erupting into laughter, tears, or song.",
    workedSolution: "The standard English idiomatic collocation is 'burst into laughter' (or 'burst into tears').",
    points: 1
  },
  {
    number: 32,
    prompt: "My elder brother will complete an intensive seminar before he ...... his managerial post.",
    options: ["takes to", "takes up", "takes out", "takes in"],
    correctAnswer: "takes up",
    hint: "Identify the phrasal verb meaning to assume, enter upon, or start a new job or duty.",
    workedSolution: "The phrasal verb 'to take up' means to assume or start a job, responsibility, or appointment.",
    points: 1
  },
  {
    number: 33,
    prompt: "The disciplinary master made the truant student ...... the entire assembly hall floor.",
    options: ["swept", "sweeps", "to sweep", "sweep"],
    correctAnswer: "sweep",
    hint: "The causative verb 'make' (past: 'made') takes an object followed by a bare infinitive without 'to'.",
    workedSolution: "The causative verb 'made' is followed by a direct object and a bare infinitive without 'to' ('made the boy sweep').",
    points: 1
  },

  // --- SECTION E: SYNONYMS & VOCABULARY (34 - 40) ---
  {
    number: 34,
    prompt: "It is unwise for readers to believe all sensational newspaper accounts uncritically.\nChoose the word nearest in meaning to the underlined word 'accounts'.",
    options: ["cartoons", "headlines", "reports", "jokes"],
    correctAnswer: "reports",
    hint: "Descriptions, narrations, or published reports of events.",
    workedSolution: "'Accounts' in journalistic contexts refers to published descriptions, articles, or 'reports'.",
    points: 1
  },
  {
    number: 35,
    prompt: "Every ambitious youth should cultivate a definite goal in life.\nChoose the word nearest in meaning to the underlined word 'goal'.",
    options: ["a choice", "a skill", "an opinion", "an aim"],
    correctAnswer: "an aim",
    hint: "An objective, purpose, or targeted ambition.",
    workedSolution: "'Goal' denotes an objective, target, or purpose to be achieved; 'an aim' is its direct synonym.",
    points: 1
  },
  {
    number: 36,
    prompt: "Mr. Mensah was thoroughly worn out after climbing the steep rocky hill.\nChoose the word nearest in meaning to the underlined phrase 'worn out'.",
    options: ["tired", "sweating", "hungry", "worried"],
    correctAnswer: "tired",
    hint: "Exhausted, fatigued, and drained of physical strength.",
    workedSolution: "'Worn out' means physically exhausted or fatigued; 'tired' is its closest synonym.",
    points: 1
  },
  {
    number: 37,
    prompt: "Wild forest elephants are becoming exceptionally rare in several regions of Africa.\nChoose the word nearest in meaning to the underlined word 'rare'.",
    options: ["unimportant", "uncommon", "unknown", "exposed"],
    correctAnswer: "uncommon",
    hint: "Not occurring often; seldom found; scarce.",
    workedSolution: "'Rare' means seldom occurring, scarce, or infrequent; 'uncommon' is its exact equivalent.",
    points: 1
  },
  {
    number: 38,
    prompt: "Following the physician's stern warning, Uncle Kwesi cut out smoking completely.\nChoose the word nearest in meaning to the underlined phrase 'cut out'.",
    options: ["stopped", "dismissed", "postponed", "interrupted"],
    correctAnswer: "stopped",
    hint: "To eliminate, discontinue, or cease an unhealthy habit.",
    workedSolution: "The phrasal verb 'to cut out' means to discontinue, cease, or permanently 'stop' a habit.",
    points: 1
  },
  {
    number: 39,
    prompt: "The old hunter narrated a tall story about wrestling a lion with an ordinary table spoon.\nChoose the word nearest in meaning to the underlined phrase 'a tall story'.",
    options: [
      "a sad tragedy",
      "an adventurous and highly exaggerated tale",
      "a comical fable",
      "a lengthy chronicle"
    ],
    correctAnswer: "an adventurous and highly exaggerated tale",
    hint: "An improbable, unbelievable story that exaggerates facts.",
    workedSolution: "'A tall story' is an idiom referring to an unbelievable, highly exaggerated narrative that strains credulity.",
    points: 1
  },
  {
    number: 40,
    prompt: "These colonial uniforms are outmoded; the school committee has designed modern attires.\nChoose the word nearest in meaning to the underlined word 'outmoded'.",
    options: ["worn out", "old-fashioned", "handmade", "ready-made"],
    correctAnswer: "old-fashioned",
    hint: "No longer in fashion, contemporary style, or use; obsolete.",
    workedSolution: "'Outmoded' means antiquated, no longer fashionable, or 'old-fashioned'.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199001);

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
        prompt: "Write a letter to your friend in another school, telling him or her about exciting plans your class has made for an upcoming educational excursion and warmly inviting him or her to join the trip.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Bekwai, Ashanti Region
12th May, 1990

Dear Kwaku,

I hope this letter finds you in fine health and high spirits in Kumasi. I am writing to share some exciting news and to warmly invite you to join our school's Science and Geography Club on an unforgettable educational excursion scheduled for next month.

Our class has finalized arrangements to visit the magnificent Akosombo Hydroelectric Dam and the Shai Hills Resource Reserve on Saturday, 16th June 1990. We will depart from our school compound at dawn aboard a chartered commercial bus. At Akosombo, an engineer will take us through the subterranean power chambers to observe how the rushing waters of the Volta Lake turn giant mechanical turbines to generate electricity for Ghana and neighboring nations. Touring this industrial masterpiece will transform our abstract physics and geography notes into living realities.

After exploring the dam, we will travel to the Shai Hills Game Reserve for an afternoon nature safari. We will hike through scenic inselbergs, explore bat-inhabited caves, and observe antelopes, baboons, and exotic bird species in their natural habitat. The tour will conclude with a lively picnic along the banks of the Volta River, where we will enjoy barbecue, music, and volleyball.

Our patron has reserved a seat for you. The subsidized excursion levy covers the return bus fare, site entry permits, and lunch. Please speak with your parents so you can confirm your participation early.

I cannot wait to explore these landmarks with you!

Your true friend,
[Signature]
Kwabena Mensah`
      },
      {
        questionNumber: "2",
        category: "Formal Application Letter",
        prompt: "Having completed Junior Secondary School (JSS), you wish to develop your practical talent. Write a formal letter of application to the Managing Director of a reputable engineering or technical company, seeking an apprenticeship position.",
        modelAnswer: `P. O. Box 80
Begoro, Eastern Region
18th October, 1990

The Managing Director
Suame Industrial Engineering Works
P. O. Box 412
Kumasi

Dear Sir,

APPLICATION FOR TECHNICAL APPRENTICESHIP IN AUTOMOTIVE ELECTRICAL ENGINEERING

I respectfully write to submit my application for an apprenticeship placement in Automotive Electrical Engineering at your renowned establishment, as announced on the municipal notice board.

I recently completed my Basic Education Certificate Examination (BECE) at Begoro Presbyterian Junior Secondary School, securing Grade One in Pre-Technical Skills and Integrated Science. Throughout my basic school course, I distinguished myself as the most gifted student in our technical workshop. I developed practical competence in metal fabrication, basic electrical circuit wiring, and battery maintenance, serving as our school technical workshop monitor for two years.

My ambition is to master modern automotive electrical diagnostics and commercial mechanical servicing. I have chosen your enterprise because of your unrivaled reputation for engineering precision, technical excellence, and rigorous apprenticeship mentoring across the country. Training under your master craftsmen will equip me with the technical expertise and discipline required to become an accomplished automotive engineer.

I am physically robust, punctual, and eager to learn. My former headmaster, Reverend J. K. Boateng, has kindly agreed to provide an official testimonial certifying my high moral integrity, honesty, and diligence.

I am prepared to attend an interview at your earliest convenience. Thank you for your favorable consideration of my application.

Yours faithfully,
[Signature]
Emmanuel Addo
(Index No: 0204010080)`
      },
      {
        questionNumber: "3",
        category: "Descriptive Essay",
        prompt: "Describe in vivid and structured detail what you normally do on Sundays, highlighting your spiritual, domestic, and recreational routines.",
        modelAnswer: `MY TYPICAL SUNDAY ROUTINE

Sundays are my favorite days of the week—a serene oasis of spiritual renewal, family fellowship, and mental rest that prepares me for the demanding academic week ahead.

My Sunday begins at dawn, precisely at half past five, when our mother awakens my siblings and me for morning family devotions. We join our voices in singing traditional Akan hymns, reading a passage of Scripture, and offering prayers of thanksgiving. Afterward, we attend to light domestic chores: sweeping our courtyard, polishing our Sunday shoes, and ironing our crisp white church clothes.

By eight o'clock, our entire family walks to the local Presbyterian Church for morning divine worship. The two-hour service is uplifting: the harmonious brass band melodies, the melodious choir anthems, and the pastor's thoughtful sermon provide moral direction and inner tranquility. Being among fellow worshipers reinforces our communal bond of faith and love.

The afternoon is dedicated to culinary delight and warm family fellowship. Returning home at noon, we gather around the dining table to savor our traditional Sunday lunch—steaming bowls of pounded fufu immersed in rich palm-nut soup with smoked venison and fresh river fish. Laughter and lively conversations about community events fill our dining room as we eat together.

Later in the afternoon, I enjoy two hours of quiet recreation: reading adventure storybooks under the shade of our mango tree, playing a game of oware with my elder brother, or taking a stroll to the community football field. By seven in the evening, I review my school timetable, pack my books into my knapsack, and retire to bed early, feeling thoroughly refreshed in body and spirit.`
      },
      {
        questionNumber: "4",
        category: "Narrative Essay",
        prompt: "You were resting quietly at home on a Saturday afternoon when you suddenly heard loud traditional drumming, singing, and cheering. Describe what you saw and experienced when you stepped outside.",
        modelAnswer: `A COLORFUL WARRIOR PROCESSION IN BEGORO

It was a sweltering Saturday afternoon, and I was relaxing in our living room with a novel when the tranquility was suddenly shattered by thunderous, rhythmic drumming, the shrill blowing of animal horns, and exuberant choral chanting echoing down the street. Drawn by curiosity, I dashed through our front door onto the veranda.

A dazzling spectacle met my eyes. The entire central avenue of Begoro was flooded by hundreds of citizens, dancers, and traditional warriors celebrating the victory of the local Asafo warrior company in the annual regatta contest. Leading the parade were muscular young men dressed in vibrant red smocks adorned with protective cowrie shells, animal talismans, and brass amulets. They brandished antique ceremonial swords and executed agile martial dances while singing warrior songs that made the hair on my arms stand on end.

At the center of the procession, shaded by massive, rotating velvet umbrellas embroidered with royal symbols, the Asafo captain was carried aloft in a majestic wicker palanquin. Adorned in handwoven kente and heavy gold ornaments that glinted under the blazing sun, he smiled and waved a horse-tail whisk to the cheering crowds as women spread colorful cloths along his path.

Traditional drummers beat heavy fontomfrom and atumpan drums with curved sticks, producing deep, reverberating rhythms that shook the ground. Intermittently, musketeers fired antique powder guns into the air with deafening cracks, sending plumes of fragrant blue smoke swirling toward the sky.

The exuberant crowd danced past our house, with spectators joining the rhythmic procession toward the royal palace durbar grounds. Standing there, mesmerized by the pageantry, pride, and ancient tradition, I felt a deep appreciation for the living beauty of our African cultural heritage.`
      }
    ]
  }
};

const flattenedPaper2Questions = paper2Calibrated.sectionA_essay.questions;

async function seedBeceEnglish1990Calibrated() {
  console.log("Seeding Calibrated & Passage-First BECE English 1990 into Firestore...");

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
  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_1990");
  await docRef.set({
    year: 1990,
    title: "BECE English Language 1990 (Calibrated National Benchmark)",
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
          passageTitle: "Passage I: The Interrupted Grammar Lesson",
          text: passage1Text,
          questionRange: "Questions 1 to 6",
          questions: passage1Questions
        },
        passage2: {
          passageTitle: "Passage II: The Canine Battle",
          text: passage2Text,
          questionRange: "Questions 7 to 11",
          questions: passage2Questions
        }
      },
      // Sections B - E: Antonyms, Idioms, Structure and Synonyms
      sectionB_to_E: {
        title: "Sections B - E: Antonyms, Idioms, Structure and Synonyms",
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

  console.log("✅ Calibrated & Passage-First BECE English 1990 successfully seeded into Firestore!");
}

seedBeceEnglish1990Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1990:", err);
    process.exit(1);
  });
