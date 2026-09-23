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

// =========================================================================
// ISOMORPHIC PASSAGE I: THE INTERRUPTED LESSON (CALIBRATED ORIGINAL)
// Tests: Conditional grammar context, surprise visitor, missing orchard fruit,
// and teacher-visitor private consultation.
// =========================================================================
const passage1Text = `A deep hush had settled over the Form Three classroom during the mid-morning French lesson. On the wooden chalkboard, Mr. Antwi had written out three distinct conditional sentences to illustrate the sequence of tenses:
1. If the rain falls, our maize crop will flourish;
2. If you insulted the elder, he would report you to the chief;
3. Kwasi could have gained admission if he had studied diligently.

Most of us found the formulas baffling. Tense agreements had always been our greatest stumbling block, but with the regional promotional examinations only weeks away, we had no choice but to master them. Suddenly, our concentration was broken by the clatter of a metal watering can and hurried footsteps on the gravel veranda. A moment later, Master Gyasi's broad face appeared at the door.

"Pardon the intrusion," he said softly to our teacher. We all raised our heads, immensely grateful for the unexpected distraction. Master Gyasi was known for his clumsy steps, and the prospect of him tripping over the doorsill was far more entertaining than grappling with third conditional clauses.

"May I speak with you privately for a moment?" Master Gyasi whispered, beckoning Mr. Antwi to step outside. Leaning against the veranda railing, Master Gyasi explained with an anxious frown that three large, ripe pineapples he had marked with twine had been stolen from the school agricultural garden during recess.

Before returning to his plot, he turned to our teacher and inquired, "Would you object if I inspected the boys' palms to check whose hands smell of fresh pineapple juice?"`;

const passage1Questions = [
  {
    number: 1,
    prompt: "According to Passage I, why was the Form Three classroom quiet before the visitor arrived?",
    options: [
      "The students were eagerly waiting for the closing bell to ring",
      "The students were focusing on difficult grammar rules for their upcoming examination",
      "The class had been cautioned for eating stolen fruit during the lesson",
      "Master Gyasi had commanded complete silence from the corridor"
    ],
    correctAnswer: "The students were focusing on difficult grammar rules for their upcoming examination",
    hint: "Notice why the pupils felt compelled to study the complex rules despite finding them difficult.",
    workedSolution: "The narrative explains that the room was quiet because the students were concentrating hard on mastering challenging conditional sentences for their impending examination.",
    points: 1
  },
  {
    number: 2,
    prompt: "Why did Master Gyasi come to the classroom in Passage I?",
    options: [
      "To cane an unruly pupil who had insulted him",
      "To investigate the theft of ripe fruit taken from his garden",
      "To return an empty watering can to the science laboratory",
      "To discuss the upcoming French examination with Mr. Antwi"
    ],
    correctAnswer: "To investigate the theft of ripe fruit taken from his garden",
    hint: "Look at what Master Gyasi reported to the teacher on the veranda.",
    workedSolution: "Master Gyasi came to report that marked pineapples had been stolen from the school plot and to seek permission to inspect the pupils' hands.",
    points: 1
  },
  {
    number: 3,
    prompt: "How did the pupils feel when Master Gyasi interrupted their lesson?",
    options: [
      "They were terrified that he would punish the entire class",
      "They were irritated because he broke their train of thought",
      "They were pleased because it offered a break from a difficult topic",
      "They felt deep pity for his stolen garden crops"
    ],
    correctAnswer: "They were pleased because it offered a break from a difficult topic",
    hint: "Reread paragraph three: 'We all raised our heads, immensely grateful for the unexpected distraction.'",
    workedSolution: "The students welcomed the interruption with relief because it paused a tedious, mentally exhausting grammar drill.",
    points: 1
  },
  {
    number: 4,
    prompt: "Which of the following statements is NOT true according to Passage I?",
    options: [
      "The pupils had difficulty understanding the rules governing conditional tenses",
      "Master Gyasi had previously fallen or slipped in an amusing way",
      "The French teacher had successfully cleared up all confusion about the tenses",
      "Master Gyasi wanted to check whether any pupil's hands had the scent of pineapple"
    ],
    correctAnswer: "The French teacher had successfully cleared up all confusion about the tenses",
    hint: "Check whether the passage ever claims the pupils had mastered the formulas.",
    workedSolution: "The passage notes that the pupils found the formulas baffling and were still struggling with them; claiming the teacher had cleared up all confusion is incorrect.",
    points: 1
  },
  {
    number: 5,
    prompt: "In Passage I, the clause 'Master Gyasi's broad face appeared at the door' means that he ............",
    options: [
      "poked his head into view at the classroom entrance",
      "hit his forehead against the heavy wooden frame",
      "blocked the entire doorway so nobody could leave",
      "flung the door open with an aggressive push"
    ],
    correctAnswer: "poked his head into view at the classroom entrance",
    hint: "To appear round or at a door means leaning in so one's face can be seen.",
    workedSolution: "The expression means he leaned in from the veranda so that his face became visible at the entrance.",
    points: 1
  },
  {
    number: 6,
    prompt: "In Passage I, the phrase 'May I speak with you privately?' means ............",
    options: [
      "allow me to co-teach the grammar lesson with you",
      "give me permission to have a brief, confidential talk with you",
      "let me explain the meaning of a French word to your class",
      "hand over the culprits to my custody immediately"
    ],
    correctAnswer: "give me permission to have a brief, confidential talk with you",
    hint: "'To have a word with someone privately' means speaking one-on-one out of earshot.",
    workedSolution: "The polite expression is a request for a short, confidential one-on-one discussion.",
    points: 1
  }
];

// =========================================================================
// ISOMORPHIC PASSAGE II: THE ANIMAL COMBAT (CALIBRATED ORIGINAL)
// Tests: Canine physical confrontation, initial dominance, sudden turnaround,
// and idiomatic expressions ('played it cool', 'tide turned').
// =========================================================================
const passage2Text = `Few spectacles are as gripping and alarming as watching two territorial dogs lock horns. I once stood by an open field and witnessed a fierce clash between Bruno and Tiger. Bruno was a sturdy, tan mastiff with dark patches surrounding his eyes, giving him an intimidating scowl. He spent his days chasing stray goats and lunging aggressively at unfamiliar passersby. Tiger, by contrast, was a lean black mongrel with white paws and a calm temperament. He was exceptionally gentle around children and rarely barked without cause.

When the two animals clashed near the community tap, the onlookers assumed Tiger would be swiftly demolished. Bruno lunged first with a ferocious snarl, rearing up on his hindquarters before clamping his jaws onto the scruff of Tiger's neck. Tiger was slammed to the dust with the heavier dog pinning him down. Yet Tiger remained remarkably composed, absorbing the initial shock without panicking. The crowd concluded that the aggressive mastiff had already carried the day.

Suddenly, the momentum shifted. Tiger twisted his torso beneath his rival, sank his teeth deep into Bruno's right hind leg, and clamped down with crushing force. Bruno yelped in agony, loosening his hold. Tiger broke free in an instant.

Before Bruno could recover his balance, Tiger sprang onto his back, sinking his teeth into Bruno's throat and driving him flat against the gravel. A cheer rose from the onlookers: "Tiger! Ti-ger!! Ti-ger!!!"

Recognizing his total victory, Tiger released his grip. Bruno scrambled to his feet and scurried down the alley with his tail tucked between his legs. Tiger stood tall, the undisputed victor.`;

const passage2Questions = [
  {
    number: 7,
    prompt: "According to Passage II, a bystander observing two dogs in combat usually feels ............",
    options: [
      "both fascinated and deeply frightened",
      "eager to intervene and separate them with a baton",
      "completely indifferent to the outcome of the struggle",
      "compelled to flee in panic without looking back"
    ],
    correctAnswer: "both fascinated and deeply frightened",
    hint: "Reread the opening line: 'Few spectacles are as gripping and alarming...'",
    workedSolution: "The text opens by explaining that the scene is simultaneously gripping (fascinating) and alarming (terrifying).",
    points: 1
  },
  {
    number: 8,
    prompt: "In Passage II, why did the spectators initially believe Bruno had won the encounter?",
    options: [
      "He had a long history of hunting down stray animals",
      "He leaped over the fence with greater agility",
      "He launched a fierce opening strike and pinned Tiger to the ground",
      "The onlookers actively cheered for his victory"
    ],
    correctAnswer: "He launched a fierce opening strike and pinned Tiger to the ground",
    hint: "Look at paragraph two: Bruno attacked first and forced Tiger beneath him into the dirt.",
    workedSolution: "Spectators thought Bruno was victorious because his initial aggressive attack drove Tiger down into the dust beneath him.",
    points: 1
  },
  {
    number: 9,
    prompt: "How did Tiger ultimately turn the tables and defeat his opponent in Passage II?",
    options: [
      "He relied on stones thrown by the cheering spectators",
      "He broke Bruno's leg and forced him to run away",
      "He leapt onto Bruno's back and pinned him down by the throat",
      "He dodged Bruno's attacks until the heavier dog collapsed from exhaustion"
    ],
    correctAnswer: "He leapt onto Bruno's back and pinned him down by the throat",
    hint: "Reread paragraph four: Tiger jumped onto Bruno's back and seized his throat.",
    workedSolution: "Tiger won by leaping onto Bruno's back, seizing his throat, and pinning the larger dog flat against the ground.",
    points: 1
  },
  {
    number: 10,
    prompt: "In Passage II, the phrase 'Tiger remained remarkably composed' indicates that Tiger ............",
    options: [
      "enjoyed the physical pain of the struggle",
      "became rigid with cold and could not move",
      "stayed calm, alert, and patient under heavy pressure",
      "refused to bite back because he was afraid"
    ],
    correctAnswer: "stayed calm, alert, and patient under heavy pressure",
    hint: "'Composed' means showing self-control and staying calm in a crisis.",
    workedSolution: "The phrase indicates that Tiger kept his nerve and did not panic despite being pinned beneath his aggressive opponent.",
    points: 1
  },
  {
    number: 11,
    prompt: "In Passage II, the expression 'the momentum shifted' means that ............",
    options: [
      "a sudden gust of wind swept across the field",
      "the direction of the fight reversed in favor of the underdog",
      "the spectators intervened to rescue the injured dog",
      "both animals lost their footing in the loose gravel"
    ],
    correctAnswer: "the direction of the fight reversed in favor of the underdog",
    hint: "A shift in momentum means an ongoing advantage reverses to the other side.",
    workedSolution: "The expression means the course of the battle changed completely, giving the advantage to Tiger, who had previously been pinned down.",
    points: 1
  }
];

// =========================================================================
// GENERAL SECTIONS B - E (CALIBRATED ORIGINAL ITEMS)
// Fully rewritten stems testing the exact 1990 grammatical/lexical targets.
// =========================================================================
const generalQuestions = [
  // --- SECTION B: OPPOSITE IN MEANING (ANTONYMS) (12 - 15) ---
  {
    number: 12,
    prompt: "While the cooperative shopkeepers agreed to pay the sanitary levy, the illegal hawkers ...... to contribute.\nChoose the word most nearly opposite in meaning to 'agreed'.",
    options: ["attempted", "struggled", "refused", "hesitated"],
    correctAnswer: "refused",
    hint: "'Agreed' means consented. What is the direct word for declining or saying no?",
    workedSolution: "'Agreed' means consented to do something. Its direct antonym is 'refused' (declined to comply).",
    points: 1
  },
  {
    number: 13,
    prompt: "The young soldier showed remarkable courage during the rescue operation, while his partner displayed shameful ...... .\nChoose the word most nearly opposite in meaning to 'courage'.",
    options: ["haste", "cowardice", "sluggishness", "carelessness"],
    correctAnswer: "cowardice",
    hint: "'Courage' means bravery. Find the word that denotes a total lack of bravery.",
    workedSolution: "'Courage' means bravery and valor. Its direct opposite is 'cowardice' (fearfulness and lack of courage).",
    points: 1
  },
  {
    number: 14,
    prompt: "Baaba is known for providing accurate financial calculations, whereas her assistant often makes ...... errors.\nChoose the word most nearly opposite in meaning to 'accurate'.",
    options: ["tedious", "foolish", "lengthy", "hasty"],
    correctAnswer: "foolish",
    hint: "'Accurate' means correct and sound. Find the word describing absurd or unsound work.",
    workedSolution: "'Accurate' implies precision and soundness. In describing the quality of answers or figures, its opposite in this context is 'foolish' (senseless or silly).",
    points: 1
  },
  {
    number: 15,
    prompt: "The club members rejected the harsh constitutional amendment, but gladly ...... the welfare proposal.\nChoose the word most nearly opposite in meaning to 'rejected'.",
    options: ["admired", "endorsed", "accepted", "reviewed"],
    correctAnswer: "accepted",
    hint: "'Rejected' means turned down. Find the word meaning received with agreement.",
    workedSolution: "'Rejected' means refused to adopt. Its direct antonym is 'accepted' (approved or embraced).",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (16 - 21) ---
  {
    number: 16,
    prompt: "After an extensive audit of the treasury, the committee declared that the accountant's hands were clean. This means that the accountant was ............",
    options: [
      "commended for maintaining personal cleanliness",
      "completely innocent and blameless of corruption",
      "instructed to wash his hands before entering the office",
      "identified solely by his fingerprint records"
    ],
    correctAnswer: "completely innocent and blameless of corruption",
    hint: "To have clean hands in financial matters means one is free of guilt.",
    workedSolution: "The idiom 'clean hands' denotes moral blamelessness, integrity, and total innocence of corrupt practice.",
    points: 1
  },
  {
    number: 17,
    prompt: "\"It is barely three o'clock, Kofi; you needn't depart so early.\" This means that Kofi ............",
    options: [
      "is forbidden from leaving the premises",
      "has no obligation or urgent need to leave right now",
      "habitually remains indoors until sunset",
      "has already missed his scheduled transport"
    ],
    correctAnswer: "has no obligation or urgent need to leave right now",
    hint: "'Needn't' expresses absence of necessity or obligation.",
    workedSolution: "'Needn't' indicates that an action is not compulsory; Kofi does not have to leave at this moment.",
    points: 1
  },
  {
    number: 18,
    prompt: "The girl was anxious that her mother would discover where she had hidden the money. This means that ............",
    options: [
      "she felt terrified when her mother discovered the hiding place",
      "she was worried that her mother might locate the money",
      "she refused to tell her mother where the money was kept",
      "she would be punished if she spoke to her mother"
    ],
    correctAnswer: "she was worried that her mother might locate the money",
    hint: "'Anxious that' conveys apprehension about a potential future event.",
    workedSolution: "Being 'anxious that' indicates worry or fear that an unwelcome event might happen.",
    points: 1
  },
  {
    number: 19,
    prompt: "I find it difficult to respect leaders who constantly blow their own trumpet. This means I dislike people who ............",
    options: [
      "make unnecessary noise in public gatherings",
      "boast and brag endlessly about their own virtues",
      "play brass musical instruments loudly",
      "quarrel with their subordinates without reason"
    ],
    correctAnswer: "boast and brag endlessly about their own virtues",
    hint: "To blow one's own trumpet means to sing one's own praises.",
    workedSolution: "The idiom 'to blow one's own trumpet' means to boast, brag, and promote one's own abilities or accomplishments.",
    points: 1
  },
  {
    number: 20,
    prompt: "If Adwoa had passed the interview, she would have been awarded the overseas scholarship. This means that Adwoa ............",
    options: [
      "failed the interview, so she did not receive the scholarship",
      "routinely performed poorly in competitive interviews",
      "will be considered for the scholarship next year",
      "received the scholarship before attending the interview"
    ],
    correctAnswer: "failed the interview, so she did not receive the scholarship",
    hint: "Third conditional sentences indicate that the condition did not occur in reality.",
    workedSolution: "The third conditional indicates a counterfactual past reality: Adwoa did not pass, and therefore she did not get the scholarship.",
    points: 1
  },
  {
    number: 21,
    prompt: "\"Set aside a portion of your harvest earnings against a rainy day, Mensah.\" Mensah is being advised to ............",
    options: [
      "save money carefully to handle future unforeseen emergencies",
      "lock up his cash until the major wet season begins",
      "avoid spending any money while rainfall continues",
      "transfer all his earnings into government treasury bonds"
    ],
    correctAnswer: "save money carefully to handle future unforeseen emergencies",
    hint: "A 'rainy day' is a metaphor for a future period of need or hardship.",
    workedSolution: "The idiom 'to save for a rainy day' means to reserve money or resources for an unexpected future crisis.",
    points: 1
  },

  // --- SECTION D: STRUCTURE & QUESTION TAGS (22 - 33) ---
  {
    number: 22,
    prompt: "Akosua is an outstanding student in our class, ......?",
    options: ["isn't it", "wasn't she", "is she", "isn't she"],
    correctAnswer: "isn't she",
    hint: "An affirmative present statement with copula 'is' and a feminine subject takes the negative tag 'isn't she?'.",
    workedSolution: "The main clause is affirmative in the simple present tense with 'is' and subject 'Akosua'. The tag must be negative: 'isn't she?'.",
    points: 1
  },
  {
    number: 23,
    prompt: "You shouldn't walk alone along that dark alley, ......?",
    options: ["won't you", "do you", "should you", "don't you"],
    correctAnswer: "should you",
    hint: "A negative statement with modal 'shouldn't' takes an affirmative tag using the same modal.",
    workedSolution: "The auxiliary in the main clause is negative ('shouldn't'). The question tag must be affirmative: 'should you?'.",
    points: 1
  },
  {
    number: 24,
    prompt: "The travelers will arrive by the afternoon bus, ......?",
    options: ["won't they", "can't they", "shouldn't they", "wouldn't they"],
    correctAnswer: "won't they",
    hint: "An affirmative statement with 'will' takes the negative contraction 'won't'.",
    workedSolution: "The future modal 'will' in an affirmative clause pairs with the negative contracted tag 'won't they?'.",
    points: 1
  },
  {
    number: 25,
    prompt: "You are not intimidated by their threats, ......?",
    options: ["aren't you", "are you", "do you", "won't you"],
    correctAnswer: "are you",
    hint: "A negative statement with 'are not' and subject 'you' takes an affirmative tag.",
    workedSolution: "The main clause has a negative auxiliary ('are not'). The corresponding tag must be affirmative: 'are you?'.",
    points: 1
  },
  {
    number: 26,
    prompt: "The student can hand in his paper now because he ...... all the comprehension questions.",
    options: ["am finishing", "will finished", "finished", "have finished"],
    correctAnswer: "have finished",
    hint: "Present Perfect tense expresses an action completed prior to the present moment with present relevance.",
    workedSolution: "The present ability to submit ('can hand in now') is the result of an action completed just before, requiring the Present Perfect: 'have finished'.",
    points: 1
  },
  {
    number: 27,
    prompt: "No reasonable teacher can be expected to ...... such insolent behavior in the classroom.",
    options: ["put up with", "put in for", "put across to", "put down against"],
    correctAnswer: "put up with",
    hint: "Identify the three-word phrasal verb meaning to endure or tolerate.",
    workedSolution: "The phrasal verb 'to put up with' means to tolerate or endure difficult or unpleasant behavior.",
    points: 1
  },
  {
    number: 28,
    prompt: "The speaker's voice is rather faint; I wish he ...... into the microphone.",
    options: ["will speak", "is speaking", "would speak", "had spoken"],
    correctAnswer: "would speak",
    hint: "Expressing a wish for someone else to change their current behavior takes 'would + base verb'.",
    workedSolution: "When using 'wish' to convey a desire for another person to change their action, standard English requires 'would + base verb': 'would speak'.",
    points: 1
  },
  {
    number: 29,
    prompt: "If the motorist had observed the speed limit, the police officer ...... him a fine.",
    options: [
      "shouldn't have given",
      "won't have given",
      "wouldn't have given",
      "wouldn't give"
    ],
    correctAnswer: "wouldn't have given",
    hint: "Third Conditional: 'had observed' in the if-clause requires 'would not have + past participle' in the main clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the main clause requires 'would not have + past participle' ('wouldn't have given').",
    points: 1
  },
  {
    number: 30,
    prompt: "The headmaster urged the final-year candidates to ...... and revise systematically if they wanted to pass.",
    options: ["sit back", "sit by", "sit on", "sit up"],
    correctAnswer: "sit up",
    hint: "Identify the phrasal verb meaning to pay close attention and apply serious effort.",
    workedSolution: "The phrasal idiom 'to sit up' means to become alert, apply oneself, and take tasks seriously.",
    points: 1
  },
  {
    number: 31,
    prompt: "Upon hearing the comedian's witty joke, the entire hall burst ...... laughter.",
    options: ["burst with", "burst into", "burst for", "burst in"],
    correctAnswer: "burst into",
    hint: "Identify the preposition that collocates with 'burst' when suddenly erupting into laughter or tears.",
    workedSolution: "The standard English idiomatic collocation is 'burst into laughter' (or 'burst into tears').",
    points: 1
  },
  {
    number: 32,
    prompt: "My elder brother plans to complete an orientation workshop before he ...... his duties as site supervisor.",
    options: ["takes to", "takes up", "takes out", "takes in"],
    correctAnswer: "takes up",
    hint: "Identify the phrasal verb meaning to assume or start a new job or role.",
    workedSolution: "The phrasal verb 'to take up' means to assume or start a job, responsibility, or appointment.",
    points: 1
  },
  {
    number: 33,
    prompt: "The compound prefect made the truant student ...... the entire assembly hall floor.",
    options: ["swept", "sweeps", "to sweep", "sweep"],
    correctAnswer: "sweep",
    hint: "The causative verb 'make' (past: 'made') takes an object followed by a bare infinitive without 'to'.",
    workedSolution: "Causative 'make' is followed by a direct object and a bare infinitive without 'to' ('made the boy sweep').",
    points: 1
  },

  // --- SECTION E: SYNONYMS & VOCABULARY (34 - 40) ---
  {
    number: 34,
    prompt: "It is imprudent to believe all sensational news accounts without verifying the facts.\nChoose the word nearest in meaning to 'accounts'.",
    options: ["cartoons", "headlines", "reports", "rumors"],
    correctAnswer: "reports",
    hint: "Descriptions, narrations, or published records of an event.",
    workedSolution: "'Accounts' in journalistic and informational contexts refers to published descriptions, chronicles, or 'reports'.",
    points: 1
  },
  {
    number: 35,
    prompt: "Every ambitious young person should define a clear goal for the future.\nChoose the word nearest in meaning to 'goal'.",
    options: ["preference", "talent", "opinion", "aim"],
    correctAnswer: "aim",
    hint: "A targeted objective, intention, or ambition.",
    workedSolution: "'Goal' denotes a target or objective one strives to achieve; 'an aim' is its direct synonym.",
    points: 1
  },
  {
    number: 36,
    prompt: "The farmer was completely worn out after weeding three acres of land under the hot sun.\nChoose the word nearest in meaning to 'worn out'.",
    options: ["exhausted", "sweating", "hungry", "distressed"],
    correctAnswer: "exhausted",
    hint: "Drained of physical strength and energy.",
    workedSolution: "'Worn out' means physically depleted of energy; 'exhausted' (or tired) is its direct synonym.",
    points: 1
  },
  {
    number: 37,
    prompt: "Certain species of forest antelopes are becoming exceedingly rare in our national parks.\nChoose the word nearest in meaning to 'rare'.",
    options: ["fragile", "uncommon", "unnoticed", "vulnerable"],
    correctAnswer: "uncommon",
    hint: "Seldom found, scarce, or infrequent.",
    workedSolution: "'Rare' means seldom occurring or found; 'uncommon' (scarce) is its exact equivalent.",
    points: 1
  },
  {
    number: 38,
    prompt: "On the cardiologist's strict advice, Uncle Kofi decided to cut out fatty foods entirely.\nChoose the word nearest in meaning to 'cut out'.",
    options: ["stopped", "reduced", "postponed", "delayed"],
    correctAnswer: "stopped",
    hint: "To eliminate, cease, or discontinue a habit or consumption completely.",
    workedSolution: "The phrasal verb 'to cut out' means to discontinue or permanently 'stop' eating or doing something.",
    points: 1
  },
  {
    number: 39,
    prompt: "The village hunter entertained us with a tall story about wrestling a leopard with his bare hands.\nChoose the word nearest in meaning to 'a tall story'.",
    options: [
      "a tragic tragedy",
      "an exaggerated and improbable tale",
      "a comical fable",
      "a historical account"
    ],
    correctAnswer: "an exaggerated and improbable tale",
    hint: "An improbable, unbelievable story that stretches credulity.",
    workedSolution: "'A tall story' is an idiom referring to a boastful, highly exaggerated narrative that is hard to believe.",
    points: 1
  },
  {
    number: 40,
    prompt: "The old manual typewriters in the secretarial office are completely outmoded.\nChoose the word nearest in meaning to 'outmoded'.",
    options: ["shabby", "old-fashioned", "inexpensive", "fragile"],
    correctAnswer: "old-fashioned",
    hint: "No longer in contemporary style, fashion, or modern use; obsolete.",
    workedSolution: "'Outmoded' means obsolete, antiquated, or 'old-fashioned'.",
    points: 1
  }
];

// Combine all raw items
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

const assignedTargetIndices = seedShuffle(targetKeys, 199001);

// Attach Passage I and Passage II directly to questions 1-11 so that
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

  if (qNum >= 1 && qNum <= 6) {
    passageTitle = "Passage I: The Interrupted Grammar Lesson";
    passageText = passage1Text;
  } else if (qNum >= 7 && qNum <= 11) {
    passageTitle = "Passage II: The Animal Combat";
    passageText = passage2Text;
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
    ...(passageText ? { passageText } : {})
  };
});

// Partition Questions for Passage-First UI Rendering
const passage1Items = balancedPaper1.slice(0, 6);
const passage2Items = balancedPaper1.slice(6, 11);
const remainingItems = balancedPaper1.slice(11);

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
        prompt: "Write a letter to your friend in another town, telling him or her about exciting plans your class has made for an upcoming educational excursion and warmly inviting him or her to join the trip.",
        modelAnswer: `Methodist Junior Secondary School
P. O. Box 54
Bekwai, Ashanti Region
12th May, 1990

Dear Kwaku,

I hope this letter finds you in good health and studying diligently in Kumasi. I am writing to share some thrilling news and to warmly invite you to join our school's Science and Geography Club on an upcoming educational excursion scheduled for next month.

Our class has finalized arrangements to visit the magnificent Akosombo Hydroelectric Dam and the Shai Hills Resource Reserve on Saturday, 16th June 1990. We will depart from our school compound at dawn aboard a chartered commercial bus. At Akosombo, a resident engineer will guide us through the subterranean power chambers to observe how the rushing waters of the Volta Lake turn giant turbines to generate electricity. Seeing this engineering landmark in person will make our physics and geography notes far easier to understand.

After exploring the dam, we will travel to the Shai Hills Game Reserve for an afternoon nature safari. We will hike through scenic rocky inselbergs, explore bat-inhabited caves, and observe antelopes, baboons, and exotic bird species in their natural habitat. The tour will conclude with a lively picnic along the banks of the Volta River, where we will enjoy barbecue, music, and volleyball.

Our patron has reserved a seat for you. The subsidized excursion levy covers the return bus fare, site entry permits, and lunch. Please speak with your parents so you can confirm your participation early.

I look forward to exploring these landmarks with you!

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

I respectfully write to submit my application for an apprenticeship placement in Automotive Electrical Engineering at your establishment, as advertised on the municipal notice board.

I recently completed my Basic Education Certificate Examination (BECE) at Begoro Presbyterian Junior Secondary School, securing Grade One in Pre-Technical Skills and Integrated Science. Throughout my basic school course, I took a keen interest in our technical workshop. I developed practical competence in basic electrical circuit wiring, metal fabrication, and battery maintenance, serving as our school technical workshop monitor for two years.

My ambition is to master modern automotive electrical diagnostics and mechanical servicing. I have chosen your enterprise because of your unrivaled reputation for engineering precision, technical excellence, and rigorous apprenticeship mentoring. Training under your master craftsmen will equip me with the technical expertise and discipline required to build a solid career in automotive technology.

I am physically robust, punctual, and eager to learn. My former headmaster, Reverend J. K. Boateng, has agreed to provide an official testimonial certifying my high moral integrity, honesty, and diligence.

I am prepared to attend an interview at your earliest convenience. Thank you for considering my application.

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

Sundays are my favorite days of the week—a restful break of spiritual renewal, family fellowship, and mental rest that prepares me for the demanding academic week ahead.

My Sunday begins at dawn, precisely at half past five, when my mother awakens my siblings and me for morning family devotions. We join our voices in singing traditional Akan hymns, reading a passage of Scripture, and offering prayers of thanksgiving. Afterward, we attend to light domestic chores: sweeping our courtyard, polishing our Sunday shoes, and ironing our church clothes.

By eight o'clock, our entire family walks to the local Presbyterian Church for morning divine worship. The two-hour service is uplifting: the harmonious brass band melodies, the choir anthems, and the pastor's thoughtful sermon provide moral direction and inner tranquility. Being among fellow worshipers reinforces our shared sense of community.

The afternoon is dedicated to a hearty meal and warm family fellowship. Returning home at noon, we gather around the dining table to savor our traditional Sunday lunch—steaming bowls of pounded fufu immersed in rich palm-nut soup with smoked venison and fresh river fish. Laughter and lively conversations about community events fill our dining room as we eat together.

Later in the afternoon, I enjoy two hours of quiet recreation: reading adventure storybooks under the shade of our mango tree, playing a game of oware with my elder brother, or taking a stroll to the community football field. By seven in the evening, I review my school timetable, pack my books into my knapsack, and retire to bed early, feeling refreshed in body and spirit.`
      },
      {
        questionNumber: "4",
        category: "Narrative Essay",
        prompt: "You were resting quietly at home on a Saturday afternoon when you suddenly heard loud traditional drumming, singing, and cheering. Describe what you saw and experienced when you stepped outside.",
        modelAnswer: `A COLORFUL WARRIOR PROCESSION IN BEGORO

It was a warm Saturday afternoon, and I was relaxing in our living room with a novel when the tranquility was suddenly shattered by thunderous, rhythmic drumming, the shrill blowing of animal horns, and exuberant choral chanting echoing down the street. Drawn by curiosity, I dashed through our front door onto the veranda.

A dazzling spectacle met my eyes. The entire central avenue of Begoro was filled with citizens, dancers, and traditional warriors celebrating the victory of the local Asafo company in the annual regatta contest. Leading the parade were muscular young men dressed in vibrant red smocks adorned with protective cowrie shells, animal talismans, and brass amulets. They brandished ceremonial swords and executed agile martial dances while singing warrior songs that made the hair on my arms stand on end.

At the center of the procession, shaded by massive, rotating velvet umbrellas embroidered with royal symbols, the Asafo captain was carried aloft in a majestic palanquin. Adorned in handwoven kente and heavy gold ornaments that glinted under the sun, he smiled and waved a horse-tail whisk to the cheering crowds as women spread colorful cloths along his path.

Traditional drummers beat heavy fontomfrom and atumpan drums with curved sticks, producing deep, reverberating rhythms that shook the ground. Intermittently, musketeers fired antique powder guns into the air with deafening cracks, sending plumes of fragrant blue smoke swirling toward the sky.

The exuberant crowd danced past our house, with spectators joining the rhythmic procession toward the palace durbar grounds. Standing there, mesmerized by the pageantry, pride, and ancient tradition, I felt a deep appreciation for the living beauty of our cultural heritage.`
      }
    ]
  }
};

const flattenedPaper2Questions = paper2Calibrated.sectionA_essay.questions.map(q => ({
  id: `q${q.questionNumber}`,
  number: parseInt(q.questionNumber, 10),
  title: `${q.category}: Question ${q.questionNumber}`,
  prompt: q.prompt,
  category: q.category,
  modelAnswer: q.modelAnswer,
  format: 'structured_essay' as const,
  totalMarks: 50,
  points: 50
}));

async function seedBeceEnglish1990Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 1990 into Firestore...");

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
          questions: passage1Items
        },
        passage2: {
          passageTitle: "Passage II: The Animal Combat",
          text: passage2Text,
          questionRange: "Questions 7 to 11",
          questions: passage2Items
        }
      },
      // Sections B - E: Antonyms, Idioms, Structure and Synonyms
      sectionB_to_E: {
        title: "Sections B - E: Antonyms, Idioms, Structure and Synonyms",
        questionRange: "Questions 12 to 40",
        questions: remainingItems
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

  console.log("✅ Fully Rewritten, Clean-Room BECE English 1990 with PASSAGE-FIRST architecture successfully seeded into Firestore!");
}

seedBeceEnglish1990Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 1990:", err);
    process.exit(1);
  });
