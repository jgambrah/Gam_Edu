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

// 40 Concept-Mapped, Original Pedagogical Adaptations
const rawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "May I borrow your ............ hat for the festival?",
    options: ["blue new straw", "new blue straw", "new straw blue", "straw new blue"],
    correctAnswer: "new blue straw",
    hint: "Royal Order of Adjectives: Age ('new') comes before Color ('blue'), which precedes Material ('straw').",
    workedSolution: "Adjectives modifying a noun follow the natural order: Age ('new') + Color ('blue') + Material ('straw').",
    points: 1
  },
  {
    number: 2,
    prompt: "The treasurer will not give us ........... financial assistance this term.",
    options: ["any", "even", "much", "little"],
    correctAnswer: "any",
    hint: "Use 'any' with negative clauses ('will not give') when referring to an unstated quantity.",
    workedSolution: "In negative clauses containing 'not', the non-assertive quantifier 'any' is used ('will not give us any more money').",
    points: 1
  },
  {
    number: 3,
    prompt: "You would be exhausted if you ..... to rest after the long march.",
    options: ["are refusing", "refuse", "refused", "were refusing"],
    correctAnswer: "refused",
    hint: "Conditional Type 2: 'would be' in the main clause requires a simple past verb in the if-clause.",
    workedSolution: "A hypothetical Second Conditional sentence uses 'would + base verb' in the result clause and the simple past tense ('refused') in the conditional clause.",
    points: 1
  },
  {
    number: 4,
    prompt: "The prefects have completed the assembly roster, .... they?",
    options: ["did", "didn't", "had", "haven't"],
    correctAnswer: "haven't",
    hint: "An affirmative present perfect statement takes a negative tag using the same auxiliary verb.",
    workedSolution: "The main clause has a positive auxiliary verb ('have'). The corresponding tag must be negative: 'haven't they?'.",
    points: 1
  },
  {
    number: 5,
    prompt: "The farmers travel to the regional market ......... train.",
    options: ["by", "in", "on", "with"],
    correctAnswer: "by",
    hint: "General modes of transport (train, bus, air, sea) take the preposition 'by' without an article.",
    workedSolution: "When describing standard means of transport, English uses 'by + noun' without determiners ('by train', 'by bus', 'by air').",
    points: 1
  },
  {
    number: 6,
    prompt: "Korkor does not like ........ official reports during the weekend.",
    options: ["to be writing", "to write", "write", "writing"],
    correctAnswer: "writing",
    hint: "Verbs expressing general preference (like, dislike, enjoy) commonly take a gerund complement.",
    workedSolution: "The verb 'like' when expressing a general habitual preference takes a gerund ('writing').",
    points: 1
  },
  {
    number: 7,
    prompt: "You will fall sick if you ....... unwashed fruits from the market.",
    options: ["ate", "eat", "had eaten", "have eaten"],
    correctAnswer: "eat",
    hint: "Conditional Type 1: A future main clause ('will fall') requires a simple present verb in the if-clause.",
    workedSolution: "In a First Conditional sentence expressing a real future possibility, the condition clause uses the simple present tense ('eat').",
    points: 1
  },
  {
    number: 8,
    prompt: "The distribution of sports equipment was conducted according .......... the headmaster's guidelines.",
    options: ["by", "of", "to", "with"],
    correctAnswer: "to",
    hint: "Identify the standard preposition that forms the complex preposition 'according ...'.",
    workedSolution: "The complex preposition is always 'according to' (meaning in conformity with or as stated by).",
    points: 1
  },
  {
    number: 9,
    prompt: "............... the heavy downpour, the match officials started the game on schedule.",
    options: ["As such", "However", "In spite of", "Nevertheless"],
    correctAnswer: "In spite of",
    hint: "Which prepositional phrase expresses concession and takes a noun phrase object ('the heavy downpour')?",
    workedSolution: "'In spite of' is a prepositional phrase of concession followed directly by a noun phrase. 'However' and 'nevertheless' are conjunctive adverbs.",
    points: 1
  },
  {
    number: 10,
    prompt: "The assemblyman, together with his wife and children, ........... travelling to Tamale next weekend.",
    options: ["are", "is", "was", "were"],
    correctAnswer: "is",
    hint: "Parenthetical phrases like 'together with...' do not change the number of the singular subject ('The assemblyman').",
    workedSolution: "When a singular subject ('The assemblyman') is followed by a parenthetical phrase ('together with his wife and children'), the verb remains singular ('is').",
    points: 1
  },
  {
    number: 11,
    prompt: "It is high time the committee ...... a final decision on the petition.",
    options: ["are taking", "shall take", "take", "took"],
    correctAnswer: "took",
    hint: "The subjunctive phrase 'It is high time + subject' takes a simple past verb.",
    workedSolution: "The fixed structure 'It is high time + subject' requires a simple past subjunctive verb ('took') to express an overdue action.",
    points: 1
  },
  {
    number: 12,
    prompt: "Most rural farmers prefer cassava ........... plantain because it withstands drought.",
    options: ["on", "than", "to", "for"],
    correctAnswer: "to",
    hint: "The comparative verb 'prefer' takes the preposition 'to', never 'than'.",
    workedSolution: "The verb 'prefer' takes 'to' when comparing two choices ('prefer cassava to plantain'). Using 'than' with prefer is an error.",
    points: 1
  },
  {
    number: 13,
    prompt: "The nurse ....... treated my injured ankle lives in the next compound.",
    options: ["that", "which", "who", "whom"],
    correctAnswer: "who",
    hint: "Use the subjective relative pronoun referring to a person performing an action.",
    workedSolution: "'Who' functions as the subject relative pronoun referring to a human antecedent ('The nurse').",
    points: 1
  },
  {
    number: 14,
    prompt: "The hungry child could not resist ....... the pot of groundnut soup.",
    options: ["by opening", "open", "to open", "opening"],
    correctAnswer: "opening",
    hint: "The idiom 'cannot resist' is followed by a gerund (verb-ing).",
    workedSolution: "The expression 'could not resist' is an idiomatic verb pattern that requires a gerund complement ('opening').",
    points: 1
  },
  {
    number: 15,
    prompt: "Our neighbour, ............ pedigree dog barks every night, has traveled abroad.",
    options: ["which", "who", "who's", "whose"],
    correctAnswer: "whose",
    hint: "Identify the possessive relative pronoun indicating ownership of the dog.",
    workedSolution: "'Whose' is the possessive relative pronoun modifying 'pedigree dog'. 'Who's' is a contraction for 'who is' or 'who has'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The selected drama pieces are very relatable to youth experiences.\nChoose the word nearest in meaning to the underlined word 'selected'.",
    options: ["preferred", "chosen", "prescribed", "given"],
    correctAnswer: "chosen",
    hint: "Picked out from a larger group based on suitability.",
    workedSolution: "'Selected' means carefully picked out from a group; 'chosen' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "Deploying police patrols on highway corridors helped to halt armed robbery.\nChoose the word nearest in meaning to the underlined word 'halt'.",
    options: ["avoid", "prevent", "stop", "suspend"],
    correctAnswer: "stop",
    hint: "To bring an ongoing activity to an end.",
    workedSolution: "'Halt' means to bring to an abrupt standstill or termination; 'stop' is its direct equivalent.",
    points: 1
  },
  {
    number: 18,
    prompt: "The headmistress warned that lax enforcement of dormitory rules would not be tolerated.\nChoose the word nearest in meaning to the underlined word 'lax'.",
    options: ["mild", "previous", "weak", "wrong"],
    correctAnswer: "weak",
    hint: "Not sufficiently strict, severe, or careful.",
    workedSolution: "'Lax' means slack, careless, or lacking strictness; 'weak' is the nearest synonym in this context.",
    points: 1
  },
  {
    number: 19,
    prompt: "Good citizenship should be guided by the fundamental principles of honesty.\nChoose the word nearest in meaning to the underlined word 'fundamental'.",
    options: ["essential", "known", "popular", "realistic"],
    correctAnswer: "essential",
    hint: "Serving as an indispensable foundation, primary, or core.",
    workedSolution: "'Fundamental' means forming an essential foundation or core requirement; its synonym is 'essential'.",
    points: 1
  },
  {
    number: 20,
    prompt: "The patient could no longer endure the excruciating toothache.\nChoose the word nearest in meaning to the underlined word 'endure'.",
    options: ["accept", "agree", "approve", "bear"],
    correctAnswer: "bear",
    hint: "To tolerate, withstand, or suffer through pain without yielding.",
    workedSolution: "'Endure' means to undergo pain or hardship patiently; 'bear' is the direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "Abena burnt her fingers when she meddled in her friends' quarrel. This means that Abena ......",
    options: ["got herself into trouble", "hated her friends", "showed how brave she was", "supported her friends"],
    correctAnswer: "got herself into trouble",
    hint: "Suffering an unpleasant consequence because of meddling in other people's affairs.",
    workedSolution: "The idiom 'to burn one's fingers' means to suffer harmful consequences or get into trouble as a result of foolish or rash intervention.",
    points: 1
  },
  {
    number: 22,
    prompt: "A failing trader may clutch at straws to save his venture. This means that he may ......",
    options: ["decide to act bravely", "seize any desperate opportunity", "try all clever means", "use a secret strategy"],
    correctAnswer: "seize any desperate opportunity",
    hint: "Resorting to any small, desperate hope when facing disaster.",
    workedSolution: "'To clutch at straws' means to turn to any desperate, unlikely hope or resource in a difficult emergency.",
    points: 1
  },
  {
    number: 23,
    prompt: "The witness held her tongue throughout the sensitive dispute. This means that she ......",
    options: ["bit her tongue accidentally", "kept silent", "maintained her stand", "refused to laugh"],
    correctAnswer: "kept silent",
    hint: "Restraining oneself from speaking or giving voice to an opinion.",
    workedSolution: "The idiom 'to hold one's tongue' means to remain silent and refrain from speaking.",
    points: 1
  },
  {
    number: 24,
    prompt: "The district water expansion project is currently in the pipeline. This means that the project is ......",
    options: ["being dealt with and prepared", "being suspended indefinitely", "no longer pursued", "stuck in the pipe"],
    correctAnswer: "being dealt with and prepared",
    hint: "In the process of being planned, produced, or developed.",
    workedSolution: "'In the pipeline' is an idiom meaning being planned, developed, processed, or prepared for implementation.",
    points: 1
  },
  {
    number: 25,
    prompt: "Mensah has always kept fraudulent businessmen at arm's length. This means that Mensah ......",
    options: ["abused them publicly", "avoided intimacy with them", "threatened them with arrest", "trusted them partially"],
    correctAnswer: "avoided intimacy with them",
    hint: "Maintaining a safe distance and avoiding close familiarity.",
    workedSolution: "'To keep someone at arm's length' means to avoid close contact, intimacy, or familiar association with them.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "The health post was closed temporarily during the weekend, but it has reopened ......",
    options: ["constantly", "deliberately", "legally", "permanently"],
    correctAnswer: "permanently",
    hint: "'Temporarily' means for a short period. Find the word that denotes lasting for all time.",
    workedSolution: "'Temporarily' means lasting for a limited time. Its direct antonym is 'permanently' (lasting indefinitely).",
    points: 1
  },
  {
    number: 27,
    prompt: "Passengers normally alight from the bus at the central terminal and ...... the shuttle to the hospital.",
    options: ["ascend", "board", "enter", "join"],
    correctAnswer: "board",
    hint: "'Alight' means to step down or get off a vehicle. Find the word meaning to get on a vehicle.",
    workedSolution: "'Alight' means to dismount or step down from a vehicle. Its antonym is 'board' (to get onto a ship, train, or bus).",
    points: 1
  },
  {
    number: 28,
    prompt: "The night watchman felt unsafe in the dark compound until the floodlights made him feel ......",
    options: ["afraid", "rejected", "secure", "unhappy"],
    correctAnswer: "secure",
    hint: "'Unsafe' means exposed to danger. Find the word meaning protected and free from harm.",
    workedSolution: "'Unsafe' means exposed to danger or risk. Its direct antonym is 'secure' (safe and protected).",
    points: 1
  },
  {
    number: 29,
    prompt: "The audience laughed heartily at the amusing play, but sat through the ...... documentary.",
    options: ["cheerful", "humourless", "familiar", "peculiar"],
    correctAnswer: "humourless",
    hint: "'Amusing' or 'funny' brings laughter. Find the word meaning lacking fun or laughter.",
    workedSolution: "'Funny' (amusing) means causing laughter. Its opposite is 'humourless' (lacking humor, dull, or serious).",
    points: 1
  },
  {
    number: 30,
    prompt: "The master rebuked the truant apprentice, but ...... the punctual assistant.",
    options: ["defended", "justified", "pardoned", "praised"],
    correctAnswer: "praised",
    hint: "'Rebuked' means scolded or reprimanded. Find the word meaning commended or applauded.",
    workedSolution: "'Rebuke' means to scold or express sharp disapproval. Its antonym is 'praise' (to commend and applaud).",
    points: 1
  },

  // --- SECTION E: CLOZE TEST (31 - 35) ---
  {
    number: 31,
    prompt: "Before human societies adopted settled agriculture, hunter-gatherers depended on wild plants and game to obtain their daily ---31---.",
    options: ["nourishment", "ration", "crop", "supply"],
    correctAnswer: "nourishment",
    hint: "Food or substance necessary for growth, health, and sustaining life.",
    workedSolution: "In nutritional science and history, food necessary to sustain biological life is referred to as 'nourishment'.",
    points: 1
  },
  {
    number: 32,
    prompt: "When early man harvested wild grain grasses, rodents such as mice entered the domestic ---32--- to scavenge on stored seeds.",
    options: ["granaries", "gardens", "kitchens", "pantries"],
    correctAnswer: "granaries",
    hint: "Storage buildings or rooms specifically designed for threshed grain.",
    workedSolution: "A storehouse or structure built to keep harvested cereal grain dry and safe is a 'granary' (plural: 'granaries').",
    points: 1
  },
  {
    number: 33,
    prompt: "Because wild cats preyed upon rodents, ancient farmers did not drive them away but ---33--- them to stay.",
    options: ["encouraged", "compelled", "forced", "trained"],
    correctAnswer: "encouraged",
    hint: "To give support, confidence, or welcome conditions to an animal or person.",
    workedSolution: "'Encouraged' fits the context of tolerating and welcoming cats around dwellings without formal domestic training.",
    points: 1
  },
  {
    number: 34,
    prompt: "With the invention of sailing vessels, dried grains served as valuable items of ---34--- across maritime routes.",
    options: ["barter", "charity", "conveyance", "haulage"],
    correctAnswer: "barter",
    hint: "The direct exchange of commodities and goods for other goods without using money.",
    workedSolution: "In historical trade, trading commodities directly without currency is termed 'barter' ('items of barter').",
    points: 1
  },
  {
    number: 35,
    prompt: "In this manner, a natural predator-prey relationship expanded across all ---35--- of the globe.",
    options: ["corners", "points", "sections", "tracts"],
    correctAnswer: "corners",
    hint: "Idiomatic phrase: 'all ...... of the globe' meaning everywhere in the world.",
    workedSolution: "The standard geographical idiom is 'all corners of the globe/world' (meaning throughout every part of the earth).",
    points: 1
  },

  // --- SECTION F: ORAL LANGUAGE (36 - 40) ---
  {
    number: 36,
    prompt: "The carpenter used an adze to shape the timber.\nWhich of the following words ends with the same voiced alveolar fricative consonant sound as 'adze' (/z/)?",
    options: ["buzz", "kiss", "face", "mouse"],
    correctAnswer: "buzz",
    hint: "'Adze' is pronounced /ædz/, ending in the voiced sibilant /z/.",
    workedSolution: "'Adze' ends with the voiced alveolar fricative /z/. 'Buzz' (/bʌz/) ends with the identical /z/ sound. ('kiss', 'face', 'mouse' end with voiceless /s/).",
    points: 1
  },
  {
    number: 37,
    prompt: "The hunter shot an antelope with his bow.\nWhich of the following words has the exact same vowel sound as the word 'bow' (weapon for shooting arrows)?",
    options: ["sew", "cow", "now", "how"],
    correctAnswer: "sew",
    hint: "'Bow' (the weapon) is pronounced /bəʊ/, rhyming with 'go' and 'no'. ('Bow' as in bending the head is /baʊ/).",
    workedSolution: "The noun 'bow' (weapon) contains the diphthong /əʊ/. 'Sew' (/səʊ/) shares the identical /əʊ/ sound. ('cow', 'now', 'how' contain /aʊ/).",
    points: 1
  },
  {
    number: 38,
    prompt: "The ship dropped anchor in the harbor.\nWhich of the following words contains the same consonant sound as the digraph 'ch' in 'anchor'?",
    options: ["chemist", "church", "charcoal", "champion"],
    correctAnswer: "chemist",
    hint: "'Anchor' is pronounced /ˈæŋ.kər/, where 'ch' represents the /k/ sound.",
    workedSolution: "In 'anchor', 'ch' is pronounced as the voiceless velar plosive /k/. 'Chemist' (/ˈkem.ɪst/) shares the same /k/ sound. ('church', 'charcoal', 'champion' have /tʃ/).",
    points: 1
  },
  {
    number: 39,
    prompt: "The shepherd sheared the soft fleece of the sheep.\nWhich of the following words has the same long vowel sound as 'fleece'?",
    options: ["yield", "build", "guild", "friend"],
    correctAnswer: "yield",
    hint: "'Fleece' contains the long close front unrounded vowel /iː/.",
    workedSolution: "'Fleece' contains the long /iː/ vowel sound. 'Yield' (/jiːld/) contains the identical /iː/ sound. ('build' and 'guild' have /ɪ/; 'friend' has /e/).",
    points: 1
  },
  {
    number: 40,
    prompt: "The athlete took a deep breath before diving.\nWhich of the following words ends with the same voiceless dental fricative consonant sound as 'breath' (/θ/)?",
    options: ["faith", "breathe", "clothe", "smooth"],
    correctAnswer: "faith",
    hint: "'Breath' ends with the voiceless sound /θ/ (as in 'teeth').",
    workedSolution: "'Breath' ends with the voiceless dental fricative /θ/. 'Faith' (/feɪθ/) ends with the same /θ/ sound. ('breathe', 'clothe', 'smooth' end with voiced /ð/).",
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

const assignedTargetIndices = seedShuffle(targetKeys, 202105);

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
        category: "Formal Letter",
        prompt: "Write a letter to the Minister for Transport, discussing two major problems bedeviling the public road transport system in Ghana and suggesting two practical solutions to improve road travel for citizens.",
        modelAnswer: `St. Thomas Junior High School
P. O. Box 42
Achimota, Accra
14th July, 2021

The Minister
Ministry of Transport
Ministries, Accra

Dear Sir,

CHALLENGES IN OUR PUBLIC ROAD TRANSPORT SYSTEM AND RECOMMENDATIONS FOR IMPROVEMENT

I respectfully write as an observant basic school student to draw your attention to two pressing challenges undermining public road transportation in our country and to suggest practical remedies to enhance commuter safety.

First and foremost is the deplorable condition of our major road networks. Many feeder and arterial highways are riddled with deep potholes, unpaved surfaces, and broken shoulders. During rainy seasons, these roads degenerate into muddy gullies, causing vehicular breakdowns, severe traffic gridlock, and fatal road crashes. Commercial mini-buses (trotros) swerve recklessly around craters, endangering the lives of commuters and pedestrians daily.

Secondly, the prevalence of substandard, unroadworthy vehicles on our highways poses a grave threat to public safety. Many commercial vehicles operate with bald tires, defective braking systems, cracked windshields, and broken headlamps. Combined with driver fatigue, overloading, and reckless speeding, these moving deathtraps cause avoidable accidents daily.

To resolve these challenges, I suggest that the Ministry intensify public-private partnerships to fund the regular resurfacing and asphalt paving of major transit highways, ensuring strict drainage engineering. Secondly, the Driver and Vehicle Licensing Authority (DVLA), in collaboration with the Motor Transport and Traffic Directorate (MTTD) of the Ghana Police Service, must conduct rigorous, automated roadworthiness inspections, barring any rickety vehicle from plying commercial routes.

I trust your esteemed office will take prompt action to make our highways safer for all commuters.

Thank you.

Yours faithfully,
[Signature]
David Ankomah
(JHS 3)`
      },
      {
        questionNumber: "2",
        category: "Debate Speech",
        prompt: "You are the main speaker representing your school in an inter-schools debate on the motion: \"Students should not wear uniforms to school.\" Write your speech arguing either for or against the motion.",
        modelAnswer: `AGAINST THE MOTION: "STUDENTS SHOULD NOT WEAR UNIFORMS TO SCHOOL"

Mr. Chairman, Panel of Esteemed Judges, Accurate Timekeeper, Co-debaters, and Distinguished Audience:

I stand firmly before you to oppose the motion which states that "Students should not wear uniforms to school." School uniforms are not mere garments; they are the bedrock of school discipline, equality, and focused learning.

First, school uniforms serve as a great social equalizer. Students come from diverse socio-economic backgrounds; some are from affluent homes, while others are from economically disadvantaged families. If students are permitted to wear casual home clothes, school will become a competitive fashion parade. Wealthy students will flaunt designer wear, while underprivileged children will suffer peer ridicule, stigmatization, and deep psychological distress. Uniforms erase these visible wealth gaps, creating a level playing field where every child is identified simply as a learner.

Secondly, school uniforms promote student safety, institutional identity, and discipline. A uniform makes students easily identifiable both on campus and in the wider community. When pupils leave school compounds without permission or engage in truant behavior in town, citizens and law enforcement officers can instantly identify them by their school badge and color. Furthermore, uniforms eliminate the morning anxiety and distraction of deciding what to wear, allowing learners to focus entirely on their studies.

In conclusion, school uniforms promote humility, foster unity, and protect students from needless peer pressure. I urge you all to reject the motion resoundingly.

Thank you.`
      },
      {
        questionNumber: "3",
        category: "Informal Letter",
        prompt: "Write a letter to your cousin who attends school in another town, inviting him or her to spend the upcoming holidays with your grandparents in the village, giving two compelling reasons why the visit will be beneficial.",
        modelAnswer: `Nana Kwaku Boateng JHS
P. O. Box 112
Berekum, Bono Region
18th June, 2021

Dear Yaw,

I hope this letter finds you in good health and high spirits as you round off your end-of-term examinations. I am writing to invite you to join me in spending the upcoming long vacation with our grandparents at their village in Berekum.

First, staying with Grandpa and Grandma will afford us an invaluable opportunity to reconnect with our cultural heritage and traditional folklore. In the city, our lives are consumed by television and smartphones, leaving little room for learning our native traditions. At the village, Grandpa gathers us around the evening hearth to narrate rich Ananse tales, explain traditional proverbs, and teach us the customs of our ancestors. These storytelling sessions are both entertaining and morally enriching.

Secondly, the holiday will offer us hands-on experience in practical agriculture and healthy outdoor life. Grandpa has promised to teach us how to harvest yams, set harmless snares for grasscutters, and cultivate fresh organic vegetables on his farm by the riverside. Breathing clean forest air, drinking fresh palm wine, and eating wholesome, fresh foods will rejuvenate our bodies and prepare our minds for the demands of Form Three.

Grandma has already prepared your favorite bedroom in the old compound. Please speak with your parents immediately so we can travel together on Friday.

Your loving cousin,
[Signature]
Kwabena`
      }
    ]
  },
  sectionB_comprehension: {
    title: "Part B: Reading Comprehension",
    passage: `The tiger, the cheetah, and the domestic cat belong to the same biological family (Felidae). The tiger is the largest member of this family. Although it is a wild carnivore, it is occasionally trained to perform acrobatic feats to entertain spectators in circuses. The cheetah is the swiftest animal on land and can be trained to hunt game. Domestic cats are found in countless households across the globe, yet their wild counterparts still inhabit forests and savannahs.

Although cats are common household pets today, humans did not deliberately domesticate them. Before early humans learned to cultivate crops and rear livestock, they relied entirely on foraging wild plants and hunting bush game for subsistence. When early agrarian communities began gathering and harvesting wild grains—which were the seeds of wild grasses—they inadvertently stored the natural food supply of wild rodents such as mice and rats. These rodent populations naturally followed their food source into human settlements. The wild cat, the ancestral natural predator of rats and mice, promptly followed these rodent swarms into domestic granaries.

Significantly, cats did not consume the harvested cereal grains that were becoming the primary source of nutrition for early human settlements. Consequently, human communities encouraged cats to remain around their compounds to eradicate the destructive rodents. Early humans also discovered that cats were clean, independent, and quieter than dogs.

When ocean-going sailing ships were invented and long-distance maritime commerce expanded, grain became an indispensable trade commodity. Grains were used not only as sea rations for sailors but also as vital items of barter in foreign ports. The mice and rats inadvertently boarded the ships inside grain sacks, closely followed by the cats. In this manner, a natural food chain that originated in the fertile Mediterranean grasslands was carried aboard trade vessels to every corner of the world.`,
    questions: [
      {
        subId: "(a)(i)",
        question: "Mention the two broad types of cats referred to in the passage.",
        answer: "1. Domestic (household) cats.\n2. Wild cats."
      },
      {
        subId: "(a)(ii)",
        question: "How did the cat originally become a domestic animal according to the passage?",
        answer: "When early humans stored grain in granaries, mice followed the grain into human homes, and wild cats followed the mice to hunt them. Because cats did not eat human grain and eliminated rodents, humans encouraged them to remain around domestic dwellings."
      },
      {
        subId: "(b)",
        question: "State two reasons why early humans preferred cats to dogs around their dwellings.",
        answer: "1. Cats were neater (cleaner) than dogs.\n2. Cats were quieter than dogs."
      },
      {
        subId: "(c)",
        question: "Which specific human activity led to the global spread of cats across the world?",
        answer: "Long-distance maritime trade and shipping (ocean exploration and grain barter commerce)."
      },
      {
        subId: "(d)(i)",
        question: "\"... a food chain.\"\nWhat specific biological food chain is referred to in the passage?",
        answer: "The food chain linking: **Grain (Grass seeds) → Rodents (Mice and Rats) → Cats**."
      },
      {
        subId: "(d)(ii)",
        question: "Why do you think cereal grains were easily transported across the world in ancient trade?",
        answer: "Because dry grains do not spoil quickly, are lightweight, can be stored in sacks for long ocean voyages, and served as both food rations and valuable currency for barter."
      },
      {
        subId: "(e)",
        question: "Explain in your own words the following expressions as used in the passage:\n(i) the domestic granaries;\n(ii) items of barter;\n(iii) all corners of the world.",
        answer: "(i) **the domestic granaries:** Household storehouses or structures used for storing harvested grains in communities.\n(ii) **items of barter:** Commodities or goods exchanged directly for other goods without the use of money.\n(iii) **all corners of the world:** Everywhere on earth / every part of the globe."
      },
      {
        subId: "(f)",
        question: "For each of the following words, provide a word or phrase that means the same and can replace it in the passage without altering the meaning:\n(i) sometimes;\n(ii) intentionally;\n(iii) gathered;\n(iv) nourishment;\n(v) probably.",
        answer: "(i) **sometimes:** occasionally / periodically / from time to time.\n(ii) **intentionally:** deliberately / purposely / consciously.\n(iii) **gathered:** harvested / collected / amassed / reaped.\n(iv) **nourishment:** food / sustenance / nutrition / sustenance.\n(v) **probably:** likely / perhaps / presumably / in all likelihood."
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
        extract: "'Mr. Bumble made Oliver miserable and the boy couldn't wait to get away from the workhouse.'",
        question: "Why did Mr. Bumble make Oliver's life miserable in the workhouse?",
        answer: "Because Oliver had committed the 'unpardonable crime' of asking for more food ('Please, sir, I want some more') when the orphans were starving."
      },
      {
        subId: "5(b)",
        textSource: "CHARLES DICKENS: Oliver Twist",
        extract: "'Mr. Bumble made Oliver miserable...'",
        question: "Who is Mr. Bumble in the story?",
        answer: "The pompous, cruel, and self-important parish beadle in charge of the workhouse."
      },
      {
        subId: "5(c)",
        textSource: "CHARLES DICKENS: Oliver Twist",
        extract: "How Mr. Bumble dealt with Oliver...",
        question: "How did Mr. Bumble attempt to rid the workhouse of Oliver Twist?",
        answer: "He posted a public notice offering five pounds to anyone who would take Oliver away as an apprentice, eventually apprenticing him to the undertaker, Mr. Sowerberry."
      },
      {
        subId: "5(d)",
        textSource: "KEN SARO-WIWA: Home Sweet Home",
        extract: "\"They came in the usual assortment of rags: gowns picked up from the stores of second-hand clothes traders, singlets bearing the words, Oxford University, mildewed blouses. Some women wore shirts that are meant for men; one of them was in a printed cotton nightgown that had faded beyond recognition.\"",
        question: "To whom does the pronoun \"They\" refer in the extract?",
        answer: "The impoverished villagers and market women of Dukana who gathered to welcome the young narrator back home."
      },
      {
        subId: "5(e)",
        textSource: "KEN SARO-WIWA: Home Sweet Home",
        extract: "\"They came in the usual assortment of rags...\"",
        question: "What dominant imagery is created through the description of the villagers' clothing in this extract?",
        answer: "Visual imagery of extreme poverty, squalor, deprivation, and economic stagnation in the village."
      },
      {
        subId: "5(f)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "EULALIE: Ya, I remember I bought the idea, but I got the feeling ...\nATO: Heavens, women! They are always getting feelings. First, you got the feeling you needed a couple of years to settle down and now you are obviously getting a feeling.",
        question: "What specific idea did Eulalie agree to (\"buy\") before their marriage?",
        answer: "The decision to postpone having children during their first years of marriage to allow them to settle down and save money."
      },
      {
        subId: "5(g)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "\".. but I got the feeling ...\"",
        question: "What new \"feeling\" has Eulalie developed that is troubling her?",
        answer: "She now feels that they should start having children immediately because the family and community expect grandchildren, and she feels alienated and misunderstood by Ato's relatives."
      },
      {
        subId: "5(h)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "ATO: Heavens, women! They are always getting feelings...",
        question: "How does Ato react to Eulalie's emotional anxiety?",
        answer: "He reacts with dismissive impatience, irritation, and patriarchal condescension, brushing aside her genuine fears."
      },
      {
        subId: "5(i)",
        textSource: "V.B. AAKYE: The Colour of God",
        extract: "How silly man is, laughs the rose\nWhy should he be black or white\nOr green or yellow or even red?",
        question: "Identify the figure of speech used in the expression \"laughs the rose\".",
        answer: "Personification (attributing the human ability of laughing to a rose flower)."
      },
      {
        subId: "5(j)",
        textSource: "V.B. AAKYE: The Colour of God",
        extract: "\"Why should he be black or white...\"",
        question: "According to the central philosophical message of the poem, what is the color of God?",
        answer: "God has no single physical color; God transcends racial divisions and encompasses all creation with universal love."
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

async function seedBeceEnglish2021Calibrated() {
  const db = await getDb();
  console.log("Seeding Calibrated & Balanced BECE English 2021 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2021");
  await docRef.set({
    year: 2021,
    title: "BECE English Language 2021 (Calibrated National Benchmark)",
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

  console.log("✅ Calibrated BECE English 2021 successfully seeded into Firestore!");
}

seedBeceEnglish2021Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2021:", err);
    process.exit(1);
  });
