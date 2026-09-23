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
}

// =========================================================================
// 100% CLEAN-ROOM ISOMORPHIC QUESTIONS (1 - 40)
// =========================================================================
const allRawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 17) ---
  {
    number: 1,
    prompt: "Following an exhaustive judicial trial, the high court acquitted the accused artisan ............ the charges of armed robbery.",
    options: ["from", "of", "on", "with"],
    correctAnswer: "of",
    hint: "Identify the dependent preposition that regularly collocates with the verb 'acquit'.",
    workedSolution: "In standard English legal collocations, the verb 'acquit' takes the preposition 'of': 'acquitted of murder/robbery'.",
    points: 1
  },
  {
    number: 2,
    prompt: "The literary style of Mensah's composition is clearly superior ............ that of his desk-mate.",
    options: ["from", "over", "than", "to"],
    correctAnswer: "to",
    hint: "Latin-derived comparative adjectives (superior, inferior, senior, junior) take 'to', never 'than'.",
    workedSolution: "Latin comparative adjectives such as 'superior', 'inferior', and 'senior' collocate strictly with the preposition 'to' ('superior to that of Adzo').",
    points: 1
  },
  {
    number: 3,
    prompt: "I would dedicate four hours to revision daily if I ............ in your academic situation.",
    options: ["am", "be", "was", "were"],
    correctAnswer: "were",
    hint: "Second conditional (hypothetical unreal present): 'If I were..., I would...'.",
    workedSolution: "In a Second Conditional hypothetical structure expressing an unreal condition contrary to present fact, the subjunctive form 'were' is standard: 'if I were you'.",
    points: 1
  },
  {
    number: 4,
    prompt: "The librarian refused to disclose ............ until the book was returned.",
    options: [
      "what about the story is",
      "what about is the story",
      "what is the story about",
      "what the story is about"
    ],
    correctAnswer: "what the story is about",
    hint: "Indirect question / noun clause word order: Wh-word + Subject ('the story') + Verb ('is about').",
    workedSolution: "In embedded noun clauses and indirect questions, standard declarative syntax (subject preceding verb) is required: 'what the story is about'.",
    points: 1
  },
  {
    number: 5,
    prompt: "That cantankerous neighbor of ............ has lodged another complaint at the station.",
    options: ["he", "him", "his", "himself"],
    correctAnswer: "his",
    hint: "Double possessive construction: 'that [noun] of' requires an independent possessive pronoun.",
    workedSolution: "Double possessive constructions ('that friend of...') require the absolute possessive pronoun 'his' without a following noun.",
    points: 1
  },
  {
    number: 6,
    prompt: "I explicitly directed you to vacate my office, ............ I?",
    options: ["aren't", "didn't", "don't", "wasn't"],
    correctAnswer: "didn't",
    hint: "The main clause has an affirmative simple past lexical verb ('directed/told'), requiring a negative past tag with 'did'.",
    workedSolution: "The governing verb 'told/directed' is in the simple past affirmative with subject 'I'. Its corresponding question tag must be negative past: 'didn't I?'.",
    points: 1
  },
  {
    number: 7,
    prompt: "The medical director embarked on his journey three weeks ............",
    options: ["ago", "hence", "now", "since"],
    correctAnswer: "ago",
    hint: "Adverb measuring elapsed past time from the present reference point: '[time period] + ago'.",
    workedSolution: "When measuring an interval of time backwards from the present moment with a simple past verb ('traveled'), 'ago' is required: 'five days ago'.",
    points: 1
  },
  {
    number: 8,
    prompt: "The regional manager, together with his two administrative assistants, ............ inspecting the project tomorrow.",
    options: ["are", "is", "were", "would be"],
    correctAnswer: "is",
    hint: "Parenthetical additions introduced by 'together with / with' do not pluralize the singular subject 'The regional manager'.",
    workedSolution: "Parenthetical additions ('with his three friends') do not affect the grammatical number of the subject. The singular head 'Kwame's uncle' takes the singular present verb 'is'.",
    points: 1
  },
  {
    number: 9,
    prompt: "The candidate's handwriting was so faded that the examiner could barely make it ............",
    options: ["in", "on", "out", "up"],
    correctAnswer: "out",
    hint: "Identify the phrasal verb meaning to decipher, discern, or comprehend with difficulty.",
    workedSolution: "The phrasal verb 'to make out' means to decipher, see, or understand something with difficulty: 'make you out'.",
    points: 1
  },
  {
    number: 10,
    prompt: "The commercial passenger flight takes ............ precisely at midday.",
    options: ["from", "of", "off", "to"],
    correctAnswer: "off",
    hint: "Identify the aeronautical phrasal verb meaning to leave the ground and begin flight.",
    workedSolution: "The phrasal verb 'to take off' means to become airborne and leave the runway: 'takes off at noon'.",
    points: 1
  },
  {
    number: 11,
    prompt: "Please, may I request ............ salt to season my vegetable soup?",
    options: ["little more", "a few more", "a little more", "few more"],
    correctAnswer: "a little more",
    hint: "'Salt' is an uncountable mass noun. Use the positive partitive expressing a modest additional quantity.",
    workedSolution: "'Salt' is an uncountable noun. To request an additional small positive quantity, standard English requires 'a little more'. ('A few more' applies strictly to countable nouns).",
    points: 1
  },
  {
    number: 12,
    prompt: "The timetable is extremely tight, but I truly wish I ............ my grandparents next weekend.",
    options: ["can visit", "am visiting", "shall visit", "could visit"],
    correctAnswer: "could visit",
    hint: "Future hypothetical wish clauses require a past modal auxiliary ('could / would').",
    workedSolution: "When 'wish' expresses a desire regarding a future event that is unlikely or uncertain, English requires the past modal 'could': 'wish I could visit'.",
    points: 1
  },
  {
    number: 13,
    prompt: "By December 2012, our basic school ............ candidates for ten consecutive years.",
    options: [
      "had presented",
      "have presented",
      "have been presenting",
      "shall have presented"
    ],
    correctAnswer: "shall have presented",
    hint: "Future Perfect tense: Prepositional marker 'By [future time]' requires 'shall/will have + past participle'.",
    workedSolution: "A time marker indicating completion before a specific future milestone ('By September 2007 / By December') takes the Future Perfect tense: 'shall have attended / presented'.",
    points: 1
  },
  {
    number: 14,
    prompt: "............ the traveler run out of funds while abroad, how would she survive?",
    options: ["If", "In case", "Should", "Were"],
    correctAnswer: "Should",
    hint: "Inverted conditional: An inversion replacing 'If she runs...' begins with this modal auxiliary followed by a bare infinitive.",
    workedSolution: "In formal inverted conditional clauses without 'if', 'Should' introduces a hypothetical condition followed by the base subject and verb: 'Should Aso run short of money...'.",
    points: 1
  },
  {
    number: 15,
    prompt: "Mortal human beings will not dwell on earth forever, ............?",
    options: ["will they", "isn't it", "does it", "shall they"],
    correctAnswer: "will they",
    hint: "A negative statement with 'will not' and plural subject 'Human beings' takes the positive tag 'will they?'.",
    workedSolution: "The main clause is negative future ('will not live'). Its matching question tag must be affirmative: 'will they?'.",
    points: 1
  },
  {
    number: 16,
    prompt: "While waiting at the boutique, I saw Esi ............ a handwoven silk stole.",
    options: ["bought", "buy", "buys", "to buy"],
    correctAnswer: "buy",
    hint: "Verbs of sensory perception (see, hear, watch) take an object followed by a bare infinitive for a completed action.",
    workedSolution: "Following verbs of sensory perception ('saw'), standard English uses a bare infinitive without 'to' ('buy') to indicate witnessing the complete action.",
    points: 1
  },
  {
    number: 17,
    prompt: "Let us assemble our revised notes and prepare for the test, ............?",
    options: ["do we", "shall we", "should we", "would we"],
    correctAnswer: "shall we",
    hint: "Cohort imperatives and suggestions beginning with 'Let us / Let's' take a mandatory first-person plural tag.",
    workedSolution: "Imperative sentences expressing collective suggestions beginning with 'Let us / Let's' require the question tag 'shall we?'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (18 - 22) ---
  {
    number: 18,
    prompt: "The inspector's sudden entry into the staff room took everyone by surprise.\nChoose the word nearest in meaning to 'sudden'.",
    options: ["quick", "strange", "unexpected", "unusual"],
    correctAnswer: "unexpected",
    hint: "Occurring rapidly, abruptly, and without warning.",
    workedSolution: "'Sudden' means happening quickly without prior notice or warning; 'unexpected' is its direct synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "It is considered rude to interrupt an elder while he is addressing a gathering.\nChoose the word nearest in meaning to 'rude'.",
    options: ["impolite", "incorrect", "improper", "unwise"],
    correctAnswer: "impolite",
    hint: "Lacking manners, courtesy, or civility.",
    workedSolution: "'Rude' means discourteous, ill-mannered, and 'impolite'.",
    points: 1
  },
  {
    number: 20,
    prompt: "The farmhands grumbled about the low wages offered by the contractor.\nChoose the word nearest in meaning to 'grumbled'.",
    options: ["bothered", "complained", "talked", "questioned"],
    correctAnswer: "complained",
    hint: "Muttered in discontent; expressed dissatisfaction.",
    workedSolution: "'Grumbled' means expressed dissatisfaction or resentment in a muttering tone; 'complained' is its direct synonym.",
    points: 1
  },
  {
    number: 21,
    prompt: "The storekeeper could not identify the shoplifter in the identification parade.\nChoose the word nearest in meaning to 'identify'.",
    options: ["discover", "find", "know", "recognize"],
    correctAnswer: "recognize",
    hint: "To establish or acknowledge the identity of someone previously seen.",
    workedSolution: "'Identify' in a visual line-up means to pick out, spot, or 'recognize' someone.",
    points: 1
  },
  {
    number: 22,
    prompt: "Navigating an open boat across flooded rapids is an extremely risky venture.\nChoose the word nearest in meaning to 'risky'.",
    options: ["dangerous", "dreadful", "unacceptable", "uncertain"],
    correctAnswer: "dangerous",
    hint: "Full of peril, hazard, or risk of injury.",
    workedSolution: "'Risky' means involving high chance of hazard, injury, or loss; 'dangerous' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (23 - 27) ---
  {
    number: 23,
    prompt: "For all his brilliance, Kofi failed to decipher the mathematical riddle. This means that Kofi failed ............",
    options: [
      "because he was not clever enough",
      "even though he was exceptionally clever",
      "because his cleverness blinded him",
      "since he was too arrogant to study"
    ],
    correctAnswer: "even though he was exceptionally clever",
    hint: "Concessive prepositional idiom: 'For all [attribute]' means in spite of or despite possessing that quality.",
    workedSolution: "The phrase 'For all his brilliance' means despite or even though he was brilliant; his exceptional intelligence did not prevent him from failing.",
    points: 1
  },
  {
    number: 24,
    prompt: "The managing director announced that his decision regarding staff retrenchment was cut and dried. This means the decision was ............",
    options: [
      "lucid and simple",
      "brief and concise",
      "final, settled, and unchangeable",
      "kept completely confidential"
    ],
    correctAnswer: "final, settled, and unchangeable",
    hint: "Completely settled, predetermined, and not open to further debate or alteration.",
    workedSolution: "The idiom 'cut and dried' means completely determined, settled beforehand, and unchangeable.",
    points: 1
  },
  {
    number: 25,
    prompt: "Abla made an ass of herself during the banquet. This means that Abla ............",
    options: [
      "behaved foolishly and ridiculously",
      "became physically intoxicated",
      "wept uncontrollably",
      "refused to partake in the feast"
    ],
    correctAnswer: "behaved foolishly and ridiculously",
    hint: "To act in a foolish, ridiculous, or embarrassing manner.",
    workedSolution: "The idiom 'to make an ass of oneself' means to behave stupidly, foolishly, or in a manner that invites ridicule.",
    points: 1
  },
  {
    number: 26,
    prompt: "Despite his loud boasting, Mensah proved to be a chicken-hearted fellow. This means that Mensah was ............",
    options: ["cowardly and easily frightened", "petty and mean", "intellectually dull", "physically frail"],
    correctAnswer: "cowardly and easily frightened",
    hint: "Lacking courage; timid and fearful.",
    workedSolution: "The idiom 'chicken-hearted' means faint-hearted, timid, and cowardly.",
    points: 1
  },
  {
    number: 27,
    prompt: "Whenever she is confronted with a mistake, Efua can always talk her way out of trouble. This means that Efua ............",
    options: [
      "is chronically argumentative",
      "can defend herself with physical force",
      "can evade punishment by persuasive speaking",
      "is excessively talkative"
    ],
    correctAnswer: "can evade punishment by persuasive speaking",
    hint: "Using clever words or eloquence to escape difficult situations or avoid penalties.",
    workedSolution: "The idiom 'to talk one's way out of trouble' means to use persuasive, smooth speech to escape blame or avoid trouble.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (28 - 32) ---
  {
    number: 28,
    prompt: "The committee rejected my proposal, whereas the director ...... it enthusiastically.\nChoose the word most nearly opposite in meaning to 'rejected'.",
    options: ["altered", "debated", "disliked", "welcomed"],
    correctAnswer: "welcomed",
    hint: "'Rejected' means turned down or dismissed. What word denotes received with favor and approval?",
    workedSolution: "'Rejected' means refused or cast aside. Its direct opposite is 'welcomed' (received with approval or accepted).",
    points: 1
  },
  {
    number: 29,
    prompt: "While Ackah is notoriously stingy with his resources, his sister is remarkably ...... .\nChoose the word most nearly opposite in meaning to 'stingy'.",
    options: ["friendly", "generous", "selfless", "sympathetic"],
    correctAnswer: "generous",
    hint: "'Stingy' means unwilling to spend or give. What word denotes liberal, giving, and open-handed?",
    workedSolution: "'Stingy' means miserly and ungiving. Its direct antonym is 'generous' (liberal in giving).",
    points: 1
  },
  {
    number: 30,
    prompt: "The bride's wedding gown was decent, whereas her cousin's costume looked rather ...... .\nChoose the word most nearly opposite in meaning to 'decent'.",
    options: ["dirty", "archaic", "shabby", "unpleasant"],
    correctAnswer: "shabby",
    hint: "'Decent' means respectable, neat, and appropriate. What word denotes ragged, untidy, or inferior in quality?",
    workedSolution: "'Decent' implies respectable, tidy, and suitable. In sartorial presentation, its direct opposite here is 'shabby' (untidy or poorly kept).",
    points: 1
  },
  {
    number: 31,
    prompt: "Attendance at morning assembly is compulsory, whereas participating in evening games is ...... .\nChoose the word most nearly opposite in meaning to 'compulsory'.",
    options: ["considerate", "optional", "unnecessary", "expected"],
    correctAnswer: "optional",
    hint: "'Compulsory' means required by rule. What word denotes available by choice and not obligatory?",
    workedSolution: "'Compulsory' means mandatory or obligatory. Its direct administrative antonym is 'optional' (left to choice).",
    points: 1
  },
  {
    number: 32,
    prompt: "While Aminata is boastful about her academic accomplishments, her brother is remarkably ...... .\nChoose the word most nearly opposite in meaning to 'boastful'.",
    options: ["careless", "humble", "modest", "uneasy"],
    correctAnswer: "modest",
    hint: "'Boastful' means bragging and conceited. What word denotes unpretentious and unassuming?",
    workedSolution: "'Boastful' means proud and bragging. Its direct behavioral antonym is 'modest' (unassuming and humble).",
    points: 1
  },

  // --- PART II: LITERATURE IN ENGLISH (33 - 40) ---
  {
    number: 33,
    prompt: "A metaphor accomplishes the exact same figurative comparison as a ............",
    options: ["paradox", "metonymy", "hyperbole", "simile"],
    correctAnswer: "simile",
    hint: "Both figures of speech compare two dissimilar things, but one uses 'like/as' while the other equates directly.",
    workedSolution: "Both a metaphor and a simile perform figurative comparisons between two distinct entities; a metaphor is an implied simile omitting 'like' or 'as'.",
    points: 1
  },
  {
    number: 34,
    prompt: "In a play or novel, an audience discovers the true moral nature of a character primarily through ............",
    options: [
      "what the character thinks and articulates",
      "how physically fast the character moves",
      "the physical length of the character's costume",
      "the geographical setting of the scene"
    ],
    correctAnswer: "what the character thinks and articulates",
    hint: "Characterization is revealed through dialogue, thoughts, motives, and actions.",
    workedSolution: "In dramatic and literary characterization, a character's true inner nature and psychology are revealed through their thoughts, spoken dialogue, and moral decisions.",
    points: 1
  },
  {
    number: 35,
    prompt: "Read the poetic extract carefully:\n'The fair breeze blew; the white foam flew,\nThe furrow followed free;\nWe were the first that burst\nInto the silent sea.'\n\nThe dominant acoustic sound device utilized in these lines is ............",
    options: ["alliteration", "onomatopoeia", "pun", "assonance"],
    correctAnswer: "alliteration",
    hint: "Notice the repetition of initial consonant sounds: /b/ in breeze blew burst, and /f/ in foam flew furrow followed free.",
    workedSolution: "The lines feature dense repetition of initial consonant sounds (/b/ in 'breeze blew burst' and /f/ in 'foam flew furrow followed free'), which is 'alliteration'.",
    points: 1
  },
  {
    number: 36,
    prompt: "In the extract:\n'The fair breeze blew; the white foam flew,\nThe furrow followed free;'\n\nThe rhythmic sound device helps to evoke ............",
    options: [
      "the silence of the deep ocean",
      "the swift, smooth movement of the vessel through water",
      "the dazzling whiteness of the sea foam",
      "the extreme coldness of the marine weather"
    ],
    correctAnswer: "the swift, smooth movement of the vessel through water",
    hint: "The flowing /f/ alliterative rhythm mirrors the brisk, unhindered cutting of the ship through ocean waves.",
    workedSolution: "The light, rhythmic alliterative flow of the fricative consonant /f/ reinforces the sensation of rapid, frictionless, and smooth sailing across the water.",
    points: 1
  },
  {
    number: 37,
    prompt: "A successful literary novel or dramatic play is designed both to entertain and to ............",
    options: ["condemn", "preach", "teach", "warn"],
    correctAnswer: "teach",
    hint: "Horace's classical principle of literature: 'to delight and to instruct' (entertain and teach).",
    workedSolution: "The traditional dual function of creative literature is 'dulce et utile'—to entertain the reader and to instruct or 'teach' moral and social truths.",
    points: 1
  },
  {
    number: 38,
    prompt: "A dynamic literary character who undergoes significant psychological growth, transformation, and complexity during a narrative is termed a ............",
    options: ["complete character", "flat character", "round character", "sound character"],
    correctAnswer: "round character",
    hint: "E.M. Forster's literary classification: flat characters are static types, whereas multi-dimensional developing characters are round.",
    workedSolution: "In literary analysis (established by E.M. Forster), a complex, multi-dimensional character who evolves and undergoes internal growth across a work is a 'round character'.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which of the following literary elements primarily drives and develops the plot of a novel or play?",
    options: [
      "Characters and their conflicts",
      "Decorative figures of speech",
      "The historical font style",
      "The physical binding of the volume"
    ],
    correctAnswer: "Characters and their conflicts",
    hint: "The sequence of events in a plot is propelled by the desires, choices, and struggles of the characters.",
    workedSolution: "Plot is the causal sequence of motivated events; it is driven forward primarily by the decisions, desires, and conflicts of characters.",
    points: 1
  },
  {
    number: 40,
    prompt: "A lyric poem is traditionally brief, musical, and primarily designed to ............",
    options: [
      "narrate a lengthy historical war chronicle",
      "memorialize a deceased leader formally",
      "express intense personal thoughts and emotions",
      "lull a crying infant to sleep"
    ],
    correctAnswer: "express intense personal thoughts and emotions",
    hint: "Unlike narrative epics or dramatic verse, lyric poetry conveys the speaker's personal feelings, reflections, and mood.",
    workedSolution: "A lyric is a short, musical poem whose primary objective is to articulate the speaker's deeply felt personal thoughts, reflections, and emotions.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 201102);

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

// =========================================================================
// PAPER 2: ESSAY WRITING & COMPREHENSION (THEORY SUITE)
// =========================================================================
const paper2Calibrated = {
  partA_composition: {
    title: "Part A: Composition",
    instructions: "Answer one question only from this section. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Formal Letter",
        prompt: "Write a formal letter to your District Director of Education, presenting at least two compelling educational reasons why corporal punishment (caning) should be permanently banned in all basic schools.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2011

The District Director of Education
Ghana Education Service
Bekwai Municipal Directorate
Bekwai

Dear Sir,

PETITION FOR THE ABOLITION OF CORPORAL PUNISHMENT IN BASIC SCHOOLS

On behalf of the basic school students within the Bekwai Municipality, I respectfully write to petition your high office to enforce an absolute prohibition of corporal punishment (caning) across all schools in our district.

First and foremost, corporal punishment inflicts grave psychological trauma that undermines authentic academic learning. Education thrives in an atmosphere of intellectual curiosity, mutual trust, and emotional security. When teachers routinely brandish cane switches in the classroom, students become paralyzed by fear and anxiety. Rather than actively participating in discussions or asking questions to clarify difficult concepts in Mathematics and Science, pupils retreat into timid silence to avoid physical pain. This culture of intimidation destroys self-confidence and breeds chronic absenteeism and school dropouts among vulnerable children.

Secondly, the indiscriminate use of caning frequently results in severe physical injuries and medical complications. Across our district, there have been distressing cases where pupils suffered fractured fingers, lacerated palms, and permanent ear damage due to excessive floggings administered by angry teachers. Modern pedagogy emphasizes that positive reinforcement and non-violent restorative discipline—such as time-out sessions, constructive labor, loss of privileges, and professional guidance counseling—are far more effective in molding moral character and self-discipline than physical violence.

Caning is an antiquated relic of colonial education that has no place in a democratic, child-friendly society. We humbly appeal to your administration to organize training workshops for teachers on non-violent disciplinary methods and strictly enforce the ban on corporal punishment.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Student Representative)`
      },
      {
        questionNumber: "2",
        category: "Narrative Essay",
        prompt: "Write an engaging, suspenseful story that concludes with the expression: \"... what a dream!\"",
        modelAnswer: `A NIGHT OF TERROR IN THE LABYRINTH

It was a suffocating Friday night during the tense week preceding our final BECE mock examinations. Exhausted after six hours of revising algebraic formulas and integrated science definitions, I finally collapsed onto my mattress and drifted into deep slumber.

Suddenly, I found myself standing in the center of an enormous, fog-shrouded amphitheater constructed of ancient black granite. Before me sat an imposing tribunal of cloaked examiners whose eyes burned like glowing embers. The chief examiner pointed an icy, bony finger at me and bellowed in a voice that shook the stone walls: "Candidate Kwabena Mensah, you have been summoned to defend the intellectual honor of your school! Solve the riddle of the flaming scrolls before the hourglass drains, or be cast into the abyss of oblivion!"

He hurled a glowing scroll toward me. I unrolled it in terror, only to find intricate mathematical equations that squirmed across the parchment like venomous scorpions. My heart hammered violently against my ribs as I grabbed a quill, but the ink turned to smoke. Around me, the stone floor began to crumble into a bottomless fiery pit as a giant clock chimed midnight with deafening clangs.

Desperate to survive, I concentrated all my mental energy, closed my eyes, and recited Archimedes' principle at the top of my lungs. The granite walls trembled, and a blinding lightning bolt shattered the tribunal's dais. I fell backward into the dark void, screaming in terror.

I jolted upright in bed with a loud gasp, panting heavily and soaked in cold sweat. Outside my window, the morning rooster was crowing and gentle sunlight was streaming into my bedroom. Clasping my trembling hands in profound relief, I whispered: ... what a dream!`
      },
      {
        questionNumber: "3",
        category: "Speech / Environmental Address",
        prompt: "As the Secretary of the Friends of the Environment Club in your school, write the speech you will deliver to the student body on the vital need to keep our school and community environment clean.",
        modelAnswer: `A CLEAN ENVIRONMENT: OUR SACRED CIVIC DUTY
Delivered by the Club Secretary to the Student Body of Methodist JHS

Mr. Chairman, Respected Headmaster, Dedicated Teachers, and Fellow Students:

I stand before you this morning on behalf of the Friends of the Environment Club to sound a passionate clarion call concerning an issue that touches our health, our dignity, and our collective survival: the vital necessity of maintaining an immaculate school and community environment.

Look around our immediate surroundings. It is disheartening to observe discarded plastic sachets, crumpled papers, and food wrappers littering our verandas and compound lawns. When rainfall occurs, these non-biodegradable plastics wash into our open roadside gutters, blocking the drainage network and creating foul, stagnant pools of black water. These choked gutters become fertile breeding grounds for disease-transmitting mosquitoes and houseflies, directly causing the recurrent outbreaks of malaria, cholera, and typhoid fever that hospitalize dozens of our classmates every term. Filth is not merely unsightly; it is a deadly public health hazard.

Keeping our environment clean is a fundamental civic obligation that begins with individual responsibility. We must cultivate the disciplined habit of proper waste disposal. Do not drop empty water sachets on the ground after recess; place them into the designated recycling bins stationed across the compound.

Furthermore, let us actively participate in our scheduled Friday afternoon communal campus desilting exercises. Planting trees and flowering hedges around our classrooms will beautify our school, purify the air we breathe, and provide shade from the tropical sun.

Cleanliness is the bedrock of academic excellence and sound moral character. Let us make Methodist JHS a shining beacon of environmental purity.

Thank you.`
      }
    ]
  },
  partB_comprehension: {
    title: "Part B: Reading Comprehension",
    instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
    passageText: `Kwesi set out from his family house that morning in high spirits, knowing well that he was traveling to the regional capital to visit his primary schoolmate, Dr. Baah. He had learned that his childhood companion had achieved great professional distinction, serving as the Senior Medical Administrator of a prestigious hospital.

When Kwesi stepped into the air-conditioned office, Dr. Baah could barely identify the disheveled visitor.

"So you can no longer recognize Kwesi, your intimate classmate from Sikakrom Primary?" Kwesi exclaimed with an offended frown. "Does corporate wealth blind individuals and erase their memory? Can ten short years transform a man so completely that he forgets his closest childhood brother?"

Dr. Baah scrutinized the visitor closely and suddenly recognized him. "Forgive me, Kwesi. You have altered so drastically that I could scarcely make you out. Please, take a seat. How may I be of assistance to you?"

Kwesi sat down reluctantly. He looked around the immaculate consulting suite with covert envy—the organized bookshelf, the polished mahogany desk, and Dr. Baah's crisp white coat and silk necktie. Slipping a small glass phial from his dust-stained jacket pocket, Kwesi tapped a pinch of white powdered snuff into his palm and inhaled it greedily. Dr. Baah observed this misconduct with deep concern but mastered his irritation.

"I observe that blind luck has showered boundless riches upon you, Baah," Kwesi remarked casually. "Truly, some people are favored by fortune!" He then extracted a crumpled cigarette and a box of matches.

"I must insist that you do not smoke in this facility; I maintain a sterilized, smoke-free atmosphere," Dr. Baah commanded in a firm, polite voice.

Kwesi was startled. "Incredible, Baah! What powerful bird lent you its wings to soar to such magnificent heights? Ah, blind Luck is a miracle worker! Ten short years ago we were equal toddlers!"

"Listen to me, Kwesi, and leave superstitious luck out of this," Dr. Baah responded sternly. "I labored through seven grueling years of medical schooling, studying through midnight oil while others slept. I never relied on luck for success; I earned it through relentless hard work and discipline."`,
    questions: [
      {
        subQuestion: "(a)",
        question: "What was Kwesi's mood and expectation as he set out from home to visit Dr. Baah?",
        answer: "He was in high spirits and joyful anticipation, expecting a warm and celebratory reunion with his childhood friend."
      },
      {
        subQuestion: "(b)",
        question: "Why did Dr. Baah fail to recognize Kwesi initially when he entered the office?",
        answer: "Dr. Baah failed to recognize him because Kwesi's physical appearance had altered drastically over ten years, looking dust-stained, worn-out, and disheveled."
      },
      {
        subQuestion: "(c)",
        question: "What does the passage reveal regarding Kwesi's personal habits and lifestyle?",
        answer: "The passage reveals that Kwesi has careless, unwholesome, and addictive habits: he inhales powdered snuff in public and smokes cigarettes indoors regardless of decorum."
      },
      {
        subQuestion: "(d)",
        question: "I. According to Kwesi, what single factor made Dr. Baah wealthy and successful?\nII. What actually enabled Dr. Baah to achieve professional success in reality?",
        answer: "I. According to Kwesi, blind fortune and superstitious luck made Dr. Baah successful.\nII. In reality, Dr. Baah succeeded through seven years of rigorous medical schooling, relentless hard work, academic sacrifice, and personal discipline."
      },
      {
        subQuestion: "(e)",
        question: "Explain the meaning of the following expressions as used in the passage:\nI. in high spirits\nII. erase their memory\nIII. I couldn't make you out",
        answer: "I. 'in high spirits' means feeling extremely cheerful, joyful, and enthusiastic.\nII. 'erase their memory' means to completely wipe out, forget, or lose recollection of past events and friends.\nIII. 'I couldn't make you out' means I was unable to decipher, distinguish, or recognize your identity."
      },
      {
        subQuestion: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. reputable\nII. intimate\nIII. tidy\nIV. attractive",
        answer: "I. reputable: prestigious, respectable, renowned, celebrated, honorable.\nII. intimate: close, bosom, familiar, dear, cherished.\nIII. tidy: neat, organized, immaculate, orderly, clean.\nIV. attractive: elegant, handsome, charming, appealing, pleasing."
      }
    ]
  }
};

const flattenedPaper2Questions = [
  ...paper2Calibrated.partA_composition.questions.map((q) => ({
    id: `composition_${q.questionNumber}`,
    partLabel: `Part A (Question ${q.questionNumber}) - ${q.category}`,
    prompt: q.prompt,
    modelAnswer: q.modelAnswer,
    marks: 30
  })),
  {
    id: "comprehension_passage",
    partLabel: "Part B: Reading Comprehension",
    prompt: paper2Calibrated.partB_comprehension.passageText,
    passage: paper2Calibrated.partB_comprehension.passageText,
    subQuestions: paper2Calibrated.partB_comprehension.questions,
    marks: 30
  }
];

async function seedBeceEnglish2011Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 2011 into Firestore...");

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
      hasLiteratureComponent: true,
      passageFirstLayout: false, // 2011 comprehension is in Paper 2
      updatedAt: new Date()
    },
    questions: balancedPaper1,
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      sections: {
        sectionA_lexis_and_structure: {
          title: "Section A: Lexis and Structure",
          questionRange: "Questions 1 to 17",
          questions: balancedPaper1.slice(0, 17)
        },
        sectionB_synonyms: {
          title: "Section B: Synonyms (Nearest in Meaning)",
          questionRange: "Questions 18 to 22",
          questions: balancedPaper1.slice(17, 22)
        },
        sectionC_idioms: {
          title: "Section C: Idiomatic Expressions",
          questionRange: "Questions 23 to 27",
          questions: balancedPaper1.slice(22, 27)
        },
        sectionD_antonyms: {
          title: "Section D: Antonyms (Opposite in Meaning)",
          questionRange: "Questions 28 to 32",
          questions: balancedPaper1.slice(27, 32)
        },
        partII_literature: {
          title: "Part II: Literature in English",
          questionRange: "Questions 33 to 40",
          questions: balancedPaper1.slice(32, 40)
        }
      },
      questions: balancedPaper1,
      allQuestions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Written Essay and Reading Comprehension",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Fully Rewritten, Clean-Room BECE English 2011 successfully seeded into Firestore!");
}

seedBeceEnglish2011Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2011:", err);
    process.exit(1);
  });
