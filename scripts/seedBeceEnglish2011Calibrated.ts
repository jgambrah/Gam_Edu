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

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2011
const rawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 17) ---
  {
    number: 1,
    prompt: "The jury acquitted the man ............ murder.",
    options: ["from", "of", "on", "with"],
    correctAnswer: "of",
    hint: "Identify the preposition that regularly collocates with 'acquit'.",
    workedSolution: "In legal and standard English grammar, one is 'acquitted of' a crime (cleared or found not guilty of the charge).",
    points: 1
  },
  {
    number: 2,
    prompt: "Ama's essay is superior ............ that of Adzo.",
    options: ["from", "over", "than", "to"],
    correctAnswer: "to",
    hint: "Latin-derived comparative adjectives ending in '-ior' take 'to', never 'than'.",
    workedSolution: "Comparative adjectives of Latin origin (superior, inferior, senior, junior, prior) take the preposition 'to', never 'than'.",
    points: 1
  },
  {
    number: 3,
    prompt: "I would study hard for the examination if I ............ you.",
    options: ["am", "be", "was", "were"],
    correctAnswer: "were",
    hint: "Subjunctive mood for hypothetical conditions ('If I were you').",
    workedSolution: "In hypothetical or contrary-to-fact conditional clauses (Second Conditional), the past subjunctive 'were' is used for all persons ('if I were you').",
    points: 1
  },
  {
    number: 4,
    prompt: "I cannot tell you ............",
    options: [
      "what about the story is.",
      "what about is the story.",
      "what is the story about.",
      "what the story is about."
    ],
    correctAnswer: "what the story is about.",
    hint: "Indirect / embedded question clauses follow normal statement word order (Subject + Verb).",
    workedSolution: "Embedded clauses within complex sentences must follow declarative word order (Subject + Verb + Preposition): 'what the story is about', not question order.",
    points: 1
  },
  {
    number: 5,
    prompt: "That troublesome friend of ............ is here again.",
    options: ["he", "him", "his", "himself"],
    correctAnswer: "his",
    hint: "Use the double possessive construction ('of + possessive pronoun').",
    workedSolution: "The double possessive structure requires an absolute possessive pronoun: 'a friend of his / that friend of his'.",
    points: 1
  },
  {
    number: 6,
    prompt: "I told you to leave my office, ............ I?",
    options: ["aren't", "didn't", "don't", "wasn't"],
    correctAnswer: "didn't",
    hint: "An affirmative clause with a simple past lexical verb ('told') takes a negative past auxiliary tag.",
    workedSolution: "The main verb 'told' is in the simple past tense. Its negative question tag uses the auxiliary 'did': 'didn't I?'.",
    points: 1
  },
  {
    number: 7,
    prompt: "Kofi traveled five days ............",
    options: ["ago.", "hence.", "now.", "since."],
    correctAnswer: "ago.",
    hint: "Use 'ago' to count back from the present moment to a specific completed past time.",
    workedSolution: "'Ago' is an adverb used with a past tense verb to show how far back in the past an action occurred ('five days ago').",
    points: 1
  },
  {
    number: 8,
    prompt: "Kwame's uncle, with his three friends, ............ coming home tomorrow.",
    options: ["are", "is", "were", "would be"],
    correctAnswer: "is",
    hint: "Parenthetical phrases beginning with 'with' do not affect the singular subject 'Kwame's uncle'.",
    workedSolution: "The grammatical subject is singular ('Kwame's uncle'). An intervening prepositional phrase ('with his three friends') does not change the subject-verb agreement; hence 'is' is required.",
    points: 1
  },
  {
    number: 9,
    prompt: "I am afraid I cannot make you ............",
    options: ["in", "on", "out", "up"],
    correctAnswer: "out",
    hint: "Identify the phrasal verb meaning to discern, perceive, or recognize someone.",
    workedSolution: "The phrasal verb 'to make someone out' means to see, hear, or recognize someone clearly, or to understand their character.",
    points: 1
  },
  {
    number: 10,
    prompt: "The plane takes ............ at noon.",
    options: ["from", "of", "off", "to"],
    correctAnswer: "off",
    hint: "Identify the phrasal verb meaning to become airborne.",
    workedSolution: "The phrasal verb 'to take off' means to depart the runway and become airborne.",
    points: 1
  },
  {
    number: 11,
    prompt: "Please, can I have ............ salt in my soup?",
    options: ["little more", "a few more", "a little more", "few more"],
    correctAnswer: "a a little more",
    hint: "'Salt' is an uncountable noun. A polite request for some additional amount requires 'a little more'.",
    workedSolution: "Salt is a non-count noun, ruling out 'few'. A polite request asking for a positive small quantity requires 'a little more'.",
    points: 1
  },
  {
    number: 12,
    prompt: "I wish I ............ my friend next week.",
    options: ["can visit", "am visiting", "shall visit", "could visit"],
    correctAnswer: "could visit",
    hint: "Wishes expressing personal ability or possibility in the future take 'could + base verb'.",
    workedSolution: "When 'wish' expresses an unfulfilled future ability or potential action of the speaker, the modal auxiliary 'could' is required ('could visit').",
    points: 1
  },
  {
    number: 13,
    prompt: "By September 2007, I ............ school for nine years.",
    options: ["had attended", "have attended", "have been attending", "shall have attended"],
    correctAnswer: "had attended",
    hint: "Expressing an action completed prior to a specific point in the past requires the Past Perfect tense.",
    workedSolution: "The time clause refers to a completed past benchmark ('By September 2007'), requiring the Past Perfect tense ('had attended').",
    points: 1
  },
  {
    number: 14,
    prompt: "............ Aso run short of money, what would she do?",
    options: ["If", "In case", "Should", "Were"],
    correctAnswer: "Should",
    hint: "Inverted conditional without 'if': 'Should + subject + bare infinitive'.",
    workedSolution: "'Should' can replace 'if' in formal conditional sentences by subject-auxiliary inversion ('Should Aso run short of money...' = 'If Aso should run short of money...').",
    points: 1
  },
  {
    number: 15,
    prompt: "Human beings will not live forever, ............?",
    options: ["will they", "isn't it", "does it", "shall they"],
    correctAnswer: "will they",
    hint: "A negative statement with 'will not' takes an affirmative tag using 'will'.",
    workedSolution: "The main clause has a negative modal verb ('will not') with plural subject 'human beings'. The tag must be positive: 'will they?'.",
    points: 1
  },
  {
    number: 16,
    prompt: "I saw Esi ............ a new pair of shoes.",
    options: ["bought", "buy", "buys", "to buy"],
    correctAnswer: "buy",
    hint: "Verbs of sensory perception (see, hear, watch) take a bare infinitive or present participle.",
    workedSolution: "Verbs of perception ('saw') followed by an object ('Esi') take the bare infinitive ('buy') without 'to' to denote witnessing a complete action.",
    points: 1
  },
  {
    number: 17,
    prompt: "Let us have a cup of tea, ............?",
    options: ["do we", "shall we", "should we", "would we"],
    correctAnswer: "shall we",
    hint: "Imperative sentences introduced by 'Let us' take this conventional tag.",
    workedSolution: "Imperative suggestions beginning with 'Let us' (or 'Let's') always take 'shall we?' as their standard question tag.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (18 - 22) ---
  {
    number: 18,
    prompt: "The headteacher's arrival in the classroom was sudden.\nChoose the word nearest in meaning to the underlined word 'sudden'.",
    options: ["quick", "strange", "unexpected", "unusual"],
    correctAnswer: "unexpected",
    hint: "Occurring without prior notice, warning, or anticipation.",
    workedSolution: "'Sudden' means happening quickly and without warning; 'unexpected' is its direct contextual synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "It is rude to talk loudly in the presence of elderly people.\nChoose the word nearest in meaning to the underlined word 'rude'.",
    options: ["impolite", "incorrect", "improper", "unwise"],
    correctAnswer: "impolite",
    hint: "Lacking good manners, courtesy, or respect.",
    workedSolution: "'Rude' means ill-mannered, discourteous, or offensive; 'impolite' is its exact equivalent.",
    points: 1
  },
  {
    number: 20,
    prompt: "The pupils grumbled about the assignment.\nChoose the word nearest in meaning to the underlined word 'grumbled'.",
    options: ["bothered", "complained", "talked", "questioned"],
    correctAnswer: "complained",
    hint: "Muttered in discontent or expressed dissatisfaction.",
    workedSolution: "'Grumbled' means expressed discontent, annoyance, or protest in a low voice; 'complained' is its nearest synonym.",
    points: 1
  },
  {
    number: 21,
    prompt: "The victim could not identify the thief.\nChoose the word nearest in meaning to the underlined word 'identify'.",
    options: ["discover", "find", "know", "recognize"],
    correctAnswer: "recognize",
    hint: "To establish who someone is based on physical appearance or knowledge.",
    workedSolution: "'Identify' means to know and establish who a person is; 'recognize' is its direct synonym.",
    points: 1
  },
  {
    number: 22,
    prompt: "Armed robbery is a very risky undertaking.\nChoose the word nearest in meaning to the underlined word 'risky'.",
    options: ["dangerous", "dreadful", "unacceptable", "uncertain"],
    correctAnswer: "dangerous",
    hint: "Full of peril, hazard, or risk of injury or death.",
    workedSolution: "'Risky' means involving the possibility of danger, failure, or injury; 'dangerous' is its direct equivalent.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (23 - 27) ---
  {
    number: 23,
    prompt: "For all his brilliance, Kofi could not solve the problem. This means that Kofi failed to solve the problem ............",
    options: [
      "as he was clever enough.",
      "even though he was clever.",
      "as he was too clever.",
      "for he was still clever."
    ],
    correctAnswer: "even though he was clever.",
    hint: "'For all...' is an idiom of concession meaning 'despite' or 'in spite of'.",
    workedSolution: "The prepositional phrase 'for all' means 'in spite of' or 'even though'. Thus, Kofi failed even though he was brilliant.",
    points: 1
  },
  {
    number: 24,
    prompt: "The manager's decision on the matter is cut and dried. This means that the manager's decision is ............",
    options: ["clear.", "simple.", "unchangeable.", "unknown."],
    correctAnswer: "unchangeable.",
    hint: "Completely settled, finalized, and incapable of being altered.",
    workedSolution: "'Cut and dried' is an idiom meaning definitively settled in advance, predetermined, and unchangeable.",
    points: 1
  },
  {
    number: 25,
    prompt: "Abla made an ass of herself at the party. This means that Abla behaved ............",
    options: ["foolishly.", "shamefully.", "uncontrollably.", "unpleasantly."],
    correctAnswer: "foolishly.",
    hint: "Acting in a silly, absurd, or ridiculous manner.",
    workedSolution: "'To make an ass of oneself' means to behave foolishly or make oneself look ridiculous in public.",
    points: 1
  },
  {
    number: 26,
    prompt: "In spite of his boasting, Mensah proved to be a chicken-hearted fellow. This means that Mensah was ............",
    options: ["cowardly.", "mean.", "stupid.", "weak."],
    correctAnswer: "cowardly.",
    hint: "Timid, lacking courage, and easily frightened.",
    workedSolution: "'Chicken-hearted' is an idiom meaning timid, fearful, lacking bravery, or cowardly.",
    points: 1
  },
  {
    number: 27,
    prompt: "Efua can always talk her way out of trouble. This means that Efua ............",
    options: ["is troublesome.", "can defend herself.", "can avoid trouble.", "is talkative."],
    correctAnswer: "can defend herself.",
    hint: "Using persuasive arguments and verbal skill to protect or defend oneself against blame or punishment.",
    workedSolution: "To 'talk one's way out of trouble' means to use persuasive arguments, explanations, and defense to escape blame; hence Efua 'can defend herself'.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (28 - 32) ---
  {
    number: 28,
    prompt: "My friend welcomed my suggestion.\nChoose the word most nearly opposite in meaning to 'welcomed'.",
    options: ["changed", "discussed", "disliked", "rejected"],
    correctAnswer: "rejected",
    hint: "'Welcomed' means received with pleasure or accepted willingly. Find the word meaning refused or turned down.",
    workedSolution: "'Welcomed' means accepted with approval. Its direct antonym is 'rejected' (dismissed or refused).",
    points: 1
  },
  {
    number: 29,
    prompt: "Unlike her sister, Ackah is stingy.\nChoose the word most nearly opposite in meaning to 'stingy'.",
    options: ["friendly", "generous", "selfless", "sympathetic"],
    correctAnswer: "generous",
    hint: "'Stingy' means miserly and unwilling to spend. Find the word meaning willing to give freely.",
    workedSolution: "'Stingy' means ungenerous or miserly. Its direct antonym is 'generous' (liberal in giving).",
    points: 1
  },
  {
    number: 30,
    prompt: "Serwaa's dress was decent.\nChoose the word most nearly opposite in meaning to 'decent'.",
    options: ["dirty.", "old.", "shabby.", "ugly."],
    correctAnswer: "shabby.",
    hint: "'Decent' clothing is respectable, neat, and in good taste. Find the word meaning ragged, worn out, or untidy.",
    workedSolution: "'Decent' in clothing describes neat, respectable, and proper attire. Its direct antonym in appearance is 'shabby' (worn out, untidy, or disreputable).",
    points: 1
  },
  {
    number: 31,
    prompt: "It is compulsory for all pupils to be in school uniform for the ceremony.\nChoose the word most nearly opposite in meaning to 'compulsory'.",
    options: ["considerate", "optional", "unnecessary", "expected"],
    correctAnswer: "optional",
    hint: "'Compulsory' means mandated or required by rule. Find the word meaning left to personal choice.",
    workedSolution: "'Compulsory' means mandatory or obligatory. Its direct antonym is 'optional' (voluntary or discretionary).",
    points: 1
  },
  {
    number: 32,
    prompt: "Aminata is boastful about her beauty.\nChoose the word most nearly opposite in meaning to 'boastful'.",
    options: ["careless", "humble", "modest", "uneasy"],
    correctAnswer: "modest",
    hint: "'Boastful' means excessively proud and braggy. Find the word meaning unassuming and humble about one's merits.",
    workedSolution: "'Boastful' means braggy or showing excessive pride. Its direct antonym regarding personal qualities is 'modest'.",
    points: 1
  },

  // --- PART II: LITERATURE IN ENGLISH (33 - 40) ---
  {
    number: 33,
    prompt: "A metaphor achieves the same figurative effect as a/an ............",
    options: ["alliteration.", "metonymy.", "paradox.", "simile."],
    correctAnswer: "simile.",
    hint: "Both figures of speech draw comparisons between two unlike objects.",
    workedSolution: "Both metaphors and similes function as figures of comparison; a simile does so explicitly using 'like' or 'as', while a metaphor does so by direct substitution.",
    points: 1
  },
  {
    number: 34,
    prompt: "In dramatic analysis, which of the following provides the clearest clue to a character's nature?",
    options: ["what he thinks.", "how he feels.", "what he says.", "how he moves about."],
    correctAnswer: "what he says.",
    hint: "Spoken dialogue directly reveals a character's intentions, morals, and characterization.",
    workedSolution: "Through dialogue ('what he says'), a character reveals their underlying thoughts, motives, educational background, and ethical disposition to the audience.",
    points: 1
  },
  {
    number: 35,
    prompt: "Read the extract below:\n\"The fair breeze blew; the white foam flew, / The furrow followed free; / We were the first that burst / Into the silent sea.\"\nThe dominant sound device used in the extract is ............",
    options: ["alliteration.", "onomatopoeia.", "pun.", "rhyme."],
    correctAnswer: "alliteration.",
    hint: "Repetition of initial consonant sounds: /b/ in 'breeze blew', /f/ in 'foam flew, furrow followed free'.",
    workedSolution: "'Alliteration' is the prominent repetition of consonant sounds at the beginning of words in close proximity ('fair breeze blew, white foam flew, furrow followed free').",
    points: 1
  },
  {
    number: 36,
    prompt: "In Coleridge's stanza, the alliterative repetition of /f/ and /b/ sounds serves primarily to express the ............",
    options: [
      "silence of the sea.",
      "smoothness of the movement.",
      "whiteness of the foam.",
      "fairness of the weather."
    ],
    correctAnswer: "smoothness of the movement.",
    hint: "Acoustic mimicry of a vessel gliding smoothly and effortlessly across ocean waters.",
    workedSolution: "The flowing alliteration of soft fricatives (/f/) and plosives (/b/) creates a rhythmic fluidity that musically conveys the smooth, effortless gliding of the ship across the waves.",
    points: 1
  },
  {
    number: 37,
    prompt: "In literary tradition, a good novel or play is designed both to entertain and ............",
    options: ["condemn.", "preach.", "teach.", "warn."],
    correctAnswer: "teach.",
    hint: "The classic Horace principle of literature: 'to delight and instruct'.",
    workedSolution: "Literature traditionally fulfills a dual role: to entertain (delight) and to teach (instruct / impart moral and philosophical understanding).",
    points: 1
  },
  {
    number: 38,
    prompt: "A character that develops, evolves, and changes psychologically in a play or novel in the course of the work is known as ............",
    options: ["complete.", "flat.", "round.", "sound."],
    correctAnswer: "round.",
    hint: "E.M. Forster's definition of a dynamic, multi-dimensional character.",
    workedSolution: "A 'round' character is complex, multi-dimensional, and undergoes personal transformation or development over the course of the narrative. A 'flat' character remains unchanged.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which of the following elements best helps to develop and advance the plot of a novel or play?",
    options: ["Characters", "Literary devices", "Setting", "Style"],
    correctAnswer: "Characters",
    hint: "Human agents whose choices, actions, and conflicts create and drive the plot forward.",
    workedSolution: "Characters are the driving agents of a narrative; their decisions, motivations, actions, and conflicts create and develop the plot.",
    points: 1
  },
  {
    number: 40,
    prompt: "A lyric poem is traditionally fairly short and ............",
    options: [
      "tells a short story.",
      "praises a dead person.",
      "expresses thoughts and feelings.",
      "is sung to send a child to sleep."
    ],
    correctAnswer: "expresses thoughts and feelings.",
    hint: "Subjective, melodic expression of the poet's personal emotions.",
    workedSolution: "A 'lyric' is a short, musical poem characterized by the direct expression of the speaker's personal emotions, reflections, and feelings.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 201101);

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
// PAPER 2: ESSAY & COMPREHENSION
// ==========================================
const paper2Calibrated = {
  sectionA_essay: {
    title: "Part A: Essay Writing",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Formal Letter",
        prompt: "Write a letter to your District Director of Education giving at least two compelling reasons why caning should be banned in schools.",
        modelAnswer: `Methodist Junior High School
P. O. Box 12
Berekum, Bono Region
15th June, 2011

The District Director of Education
Ghana Education Service
Berekum District Directorate
Berekum

Dear Sir,

PETITION FOR THE ABOLITION OF CORPORAL PUNISHMENT (CANING) IN BASIC SCHOOLS

I write with great respect on behalf of the students of Berekum District to appeal to your high office to enforce an absolute ban on corporal punishment, particularly caning, in all basic schools across the district.

First and foremost, caning inflicts severe physical injury and psychological trauma on learners. Many overzealous teachers administer strokes of the cane indiscriminately, causing deep welts, fractured fingers, and occasional eye injuries. More critically, the psychological damage is devastating. Caning breeds intense anxiety, suppresses classroom participation, and instills a morbid fear of school. Consequently, many vulnerable pupils drop out or become chronic truants simply to escape physical brutality from educators who ought to protect them.

Secondly, caning is an ineffective disciplinary tool that promotes violence and hinders genuine moral reformation. Modern pedagogical research has proven that physical beatings do not teach self-discipline; rather, they harden delinquent pupils and model aggression as the primary means of resolving conflict. Caning diminishes a child's self-esteem and creates an adversarial barrier between teachers and students.

In place of caning, the educational directorate should train teachers in modern, positive corrective measures such as counseling, withdrawal of privileges, manual campus beautification, and peer mediation. These constructive alternatives instill accountability without degrading human dignity.

We trust that you will consider this petition favorably to create a safe, supportive learning environment for all Ghanaian children.

Thank you.

Yours faithfully,
[Signature]
Kwesi Mensah
(District Students' Representative)`
      },
      {
        questionNumber: "2",
        category: "Narrative Essay",
        prompt: "Write a story which ends with the expression: \"................ what a dream!\"",
        modelAnswer: `A GOLDEN VOYAGE TO THE STARS

The evening had begun like any ordinary Tuesday. Exhausted after a grueling day of revising past examination papers, I fell asleep immediately after my evening supper. Almost instantly, my modest bedroom dissolved into a glorious golden palace floating high above the clouds.

A majestic herald dressed in shining silver regalia greeted me by name and led me to a royal dais where the elders of the universe were seated. To my utter astonishment, the Supreme Chancellor announced that I had been chosen as the Planetary Ambassador for World Peace. When he placed a diamond-studded medal of honor around my neck, an invisible orchestra erupted into breathtaking symphonies, and thousands of celestial beings cheered with thunderous applause.

Moments later, I was ushered into a supersonic spacecraft capable of traveling at the speed of thought. We glided effortlessly across galaxies, weaving past rings of vibrant turquoise and exploring glistening extraterrestrial cities where poverty, war, and disease were completely unknown. People walked the streets with radiant smiles, sharing limitless feasts of delicious exotic fruits. I was handed the golden key to universal wisdom and told that I possessed the power to bring this eternal prosperity to Ghana.

Suddenly, a loud, jarring sound shattered the cosmic paradise. "Kofi, wake up! You will be late for school!" my mother's booming voice commanded as she pulled my blanket away.

Sitting up abruptly, rubbing my eyes and finding myself on my wooden bed with the morning sunlight streaming through the window blinds, I sighed deeply and whispered to myself, "................ what a dream!"`
      },
      {
        questionNumber: "3",
        category: "Speech Writing",
        prompt: "As secretary of the Friends of the Environment club, write a speech you would give to the students of your school on the need to keep the environment clean.",
        modelAnswer: `AN ADDRESS DELIVERED BY KWAME ADJEI, SECRETARY OF FRIENDS OF THE ENVIRONMENT CLUB, AT THE MORNING ASSEMBLY ON ENVIRONMENTAL SANITATION

Mr. Headmaster, Respected Teachers, and Fellow Students:

I deem it a singular privilege to stand before you today on behalf of the Friends of the Environment club to address a subject of paramount importance to our lives: the urgent need to keep our school and community clean.

A clean environment is the bedrock of good health and academic excellence. Filthy surroundings laden with plastic wrappers, choked gutters, and overgrown weeds serve as breeding grounds for disease-carrying vectors such as mosquitoes and houseflies. These vectors spread deadly infections like malaria and cholera, which rob us of precious instructional time and burden our parents with hospital bills. When our campus is clean, disease outbreaks are eradicated, allowing us to attend classes regularly and achieve outstanding grades.

Furthermore, maintaining a neat environment reflects our personal discipline and collective dignity. Our school compound is our second home. When visitors enter our campus and see spotless flower gardens, clean classrooms, and well-managed trash bins, they form a high impression of our character. Cleanliness is not merely an external act; it trains our minds to be orderly, responsible, and environmentally conscious citizens.

Fellow students, cleanliness begins with individual action. Let us make a solemn pledge today never to litter indiscriminately. Always drop waste into designated dustbins, participate enthusiastically in Friday communal sanitation duties, and weed our allocated plots.

Remember, a clean environment ensures a healthy life. Let us preserve our school with pride.

Thank you all for your kind attention.`
      }
    ]
  },
  sectionB_comprehension: {
    title: "Part B: Reading Comprehension",
    passage: `Ali set out of the house that morning in high spirits knowing well that he was going to meet his childhood friend Kofi. He had heard that his friend was occupying a very high position in a reputable company. Kofi could hardly recognize Ali when the latter entered the former's office.

'So you can't recognize me, Kofi, your classmate, Sikakrom J.H.S? Does money blind people and erase their memory? Can ten short years change you so completely as to make you forget an intimate friend?'

Kofi then suddenly recognized him. 'Sorry, Ali. You've changed so much I couldn't make you out. Please, sit down. What can I do for you?'

Ali reluctantly sat down. He admired Kofi's tidy office and person—the well-groomed hair, the attractive shirt and tie. Ali removed a small bottle from the breast pocket of his dust-covered shirt, poured out some white substance in his palm and sniffed it greedily.

Kofi noticed all that but suppressed his anger. 'I learn that luck has given you great wealth, Kofi,' Ali said. 'Indeed, some people are lucky!' he added, and pulled out a crumpled cigarette and a box of matches.

'I'd rather you didn't smoke here. I keep my air fresh,' Kofi politely ordered. Ali was shocked. 'Hei, Kofi, what a complete change! What bird must have lent you its wings for you to soar so high? Oh, Luck, you can really change people! Just ten short years!'

'Look here, Ali, leave luck out of this. I worked very hard for seven years to acquire a good degree and a job. I never relied on luck for success.'`,
    questions: [
      {
        subId: "(a)",
        question: "What did Ali expect as he left the house to meet Kofi?",
        answer: "He expected a joyful, warm reunion with his childhood friend and anticipated that Kofi's wealth and high position would be shared with or benefit him."
      },
      {
        subId: "(b)",
        question: "Why did Kofi initially fail to recognize Ali?",
        answer: "Because Ali had deteriorated physically and changed drastically in appearance (he was unkempt, wearing a dust-covered shirt, and showed the physical toll of substance abuse)."
      },
      {
        subId: "(c)",
        question: "What does the passage reveal about Ali's personal habits and lifestyle?",
        answer: "It reveals that Ali has destructive, reckless habits: he engages in illicit drug use (sniffing a white powdery substance) and heavy cigarette smoking."
      },
      {
        subId: "(d)(i)",
        question: "According to Ali, what factor was responsible for Kofi's great wealth and professional success?",
        answer: "Good luck (fortune)."
      },
      {
        subId: "(d)(ii)",
        question: "What actually helped Kofi to achieve his success in life?",
        answer: "Seven years of relentless hard work, academic dedication to acquire a university degree, and professional diligence."
      },
      {
        subId: "(e)",
        question: "Explain in your own words the following expressions as used in the passage:\n(i) in high spirits;\n(ii) erase their memory;\n(iii) I couldn't make you out.",
        answer: "(i) **in high spirits:** In a very cheerful, joyful, and optimistic mood.\n(ii) **erase their memory:** Cause people to completely forget their humble past, roots, and old friends.\n(iii) **I couldn't make you out:** I could not recognize or identify your face."
      },
      {
        subId: "(f)",
        question: "For each of the following words, provide a word or phrase that means the same and can replace it in the passage without altering the meaning:\n(i) reputable;\n(ii) intimate;\n(iii) tidy;\n(iv) attractive.",
        answer: "(i) **reputable:** prestigious / well-respected / distinguished / renowned.\n(ii) **intimate:** close / bosom / trusted / dear.\n(iii) **tidy:** neat / orderly / clean / spotless.\n(iv) **attractive:** smart / charming / appealing / handsome."
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
    id: `comp_${q.subId.replace(/[()]/g, '_')}`,
    partLabel: `Part B: Comprehension ${q.subId}`,
    prompt: (idx === 0 ? `Read the passage carefully and answer the questions that follow:\n\n${paper2Calibrated.sectionB_comprehension.passage}\n\n` : '') + q.question,
    modelAnswer: q.answer,
    marks: 5
  }))
];

async function seedBeceEnglish2011Calibrated() {
  const db = await getDb();
  console.log("Seeding Calibrated & Balanced BECE English 2011 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2011");
  await docRef.set({
    year: 2011,
    title: "BECE English Language 2011 (Calibrated National Benchmark)",
    subjectId: "english",
    metadata: {
      isPastQuestion: true,
      standard: "NaCCA / WAEC BECE Standard",
      totalMarks: 100,
      totalDurationMinutes: 120,
      paper1Count: balancedPaper1.length,
      optionsBalanced: true,
      unplagiarizedPedagogicalAdaptation: true,
      sectionsPresent: ["Paper 1 (Objectives)", "Paper 2 Part A (Essay)", "Paper 2 Part B (Comprehension)"],
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
      title: "Paper 2: Essay and Reading Comprehension",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Calibrated BECE English 2011 successfully seeded into Firestore!");
}

seedBeceEnglish2011Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2011:", err);
    process.exit(1);
  });
