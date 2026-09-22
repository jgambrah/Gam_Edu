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

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2019
const rawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "One of the heifers ...... from the cattle kraal into the forest.",
    options: ["have been strayed", "has been strayed", "have strayed", "has strayed"],
    correctAnswer: "has strayed",
    hint: "The subject is 'One', not 'heifers'. An active intransitive verb takes 'has + past participle'.",
    workedSolution: "In the subject phrase 'One of the heifers', the true head noun is the singular pronoun 'One'. It requires the singular active verb 'has strayed'. 'Stray' is an intransitive verb and cannot take the passive form ('has been strayed').",
    points: 1
  },
  {
    number: 2,
    prompt: "Kofi saw the monkey .......... swiftly up the baobab tree.",
    options: ["climb", "is climbing", "climbed", "was climbing"],
    correctAnswer: "climb",
    hint: "Verbs of sensory perception (saw, heard, watched) take an object followed by a bare infinitive.",
    workedSolution: "After sensory verbs of perception like 'saw', an object is followed by a bare infinitive ('climb') to show a complete action, or a present participle ('climbing') for an ongoing one. 'Climbed' and 'was climbing' are grammatically incorrect in this pattern.",
    points: 1
  },
  {
    number: 3,
    prompt: "Kwame travels to the regional capital each weekend ............ train.",
    options: ["by", "on", "with", "in"],
    correctAnswer: "by",
    hint: "General modes of transport (train, bus, boat, plane) take the preposition 'by' without an article.",
    workedSolution: "When referring to a means of travel without determiners or articles, standard English uses 'by + vehicle' ('by train', 'by bus', 'by air').",
    points: 1
  },
  {
    number: 4,
    prompt: "This bicycle is not mine; it is ............ property.",
    options: ["mine uncle's", "my uncle's", "my uncles", "mine uncles"],
    correctAnswer: "my uncle's",
    hint: "Use the possessive adjective 'my' before a singular possessive noun ending in ''s'.",
    workedSolution: "The possessive determiner 'my' precedes the singular possessive noun 'uncle's' to modify 'property'. 'Mine' is a possessive pronoun and cannot modify a noun.",
    points: 1
  },
  {
    number: 5,
    prompt: "Adjoa wore a ............ dress to the anniversary thanksgiving service.",
    options: ["silk blue beautiful", "beautiful blue silk", "blue beautiful silk", "beautiful silk blue"],
    correctAnswer: "beautiful blue silk",
    hint: "Order of adjectives: Opinion ('beautiful') comes before Color ('blue'), which precedes Material ('silk').",
    workedSolution: "According to the Royal Order of Adjectives: Opinion ('beautiful') precedes Color ('blue'), which precedes Material ('silk'). Therefore, 'beautiful blue silk dress' is the correct sequence.",
    points: 1
  },
  {
    number: 6,
    prompt: "I wish I ............ my ailing grandmother in Tamale next weekend.",
    options: ["can visit", "am visiting", "shall visit", "could visit"],
    correctAnswer: "could visit",
    hint: "A wish about an unreal or uncertain future event takes the modal 'could'.",
    workedSolution: "Wishes expressing future desires that are contrary to current reality or uncertain take 'could + base verb' ('could visit').",
    points: 1
  },
  {
    number: 7,
    prompt: "In terms of temperament and patience, Abena took ............ her grandmother.",
    options: ["after", "up", "on", "by"],
    correctAnswer: "after",
    hint: "Identify the phrasal verb meaning to resemble an older relative in appearance or character.",
    workedSolution: "The phrasal verb 'to take after' means to resemble an older family member in character, habits, or physical features.",
    points: 1
  },
  {
    number: 8,
    prompt: "The young apprentice is allergic ............ sawdust and paint fumes.",
    options: ["with", "to", "against", "about"],
    correctAnswer: "to",
    hint: "The adjective 'allergic' regularly collocates with this specific preposition.",
    workedSolution: "In standard English grammar, the adjective 'allergic' is followed by the preposition 'to' ('allergic to sawdust').",
    points: 1
  },
  {
    number: 9,
    prompt: "The assemblyman, together with his children, ............ travelling to Kumasi tomorrow.",
    options: ["is", "are", "was", "were"],
    correctAnswer: "is",
    hint: "Parenthetical additions like 'together with...' do not alter the singular subject 'The assemblyman'.",
    workedSolution: "When a singular subject ('The assemblyman') is followed by a parenthetical phrase introduced by 'together with', the subject remains singular. For an upcoming event ('tomorrow'), the singular present continuous auxiliary 'is' is required.",
    points: 1
  },
  {
    number: 10,
    prompt: "It is high time the debating club ............ its executive officers.",
    options: ["elected", "elect", "have to elect", "will elect"],
    correctAnswer: "elected",
    hint: "The structure 'It is high time + subject' takes a simple past subjunctive verb.",
    workedSolution: "The fixed idiom 'It is high time + subject' requires a simple past subjunctive verb ('elected') to express an action that is long overdue.",
    points: 1
  },
  {
    number: 11,
    prompt: "The headmaster refused to address the petition before a ...... delegation.",
    options: ["five-man's", "five-man", "five-men", "five-men's"],
    correctAnswer: "five-man",
    hint: "When a compound number-noun acts as an adjective before a noun, it takes the singular form without an apostrophe.",
    workedSolution: "When a compound noun functions attributively as an adjective before another noun ('delegation'), the unit is hyphenated and singular: 'a five-man delegation'.",
    points: 1
  },
  {
    number: 12,
    prompt: "The hilarious folktale told by the elder made the children ......",
    options: ["to laugh", "laughing", "laughed", "laugh"],
    correctAnswer: "laugh",
    hint: "The causative verb 'made' takes an object followed by a bare infinitive without 'to'.",
    workedSolution: "The causative verb 'make' (past: 'made') is followed by an object and a bare infinitive ('laugh') without 'to'.",
    points: 1
  },
  {
    number: 13,
    prompt: "The school has not received ............ of the two consignment trucks.",
    options: ["neither", "either", "none", "all"],
    correctAnswer: "either",
    hint: "When a negative clause ('has not received') refers to two items, use 'either' to avoid a double negative.",
    workedSolution: "Because the sentence already contains the negative particle 'not' and refers specifically to two items, 'either' is required ('not ... either of the two'). 'Neither' would create a double negative.",
    points: 1
  },
  {
    number: 14,
    prompt: "The junior students found the mathematics theorem ...... to solve.",
    options: ["much too difficult", "difficult too much", "too much difficult", "so difficult too much"],
    correctAnswer: "much too difficult",
    hint: "Use 'much too' before an adjective to intensify an excessive degree.",
    workedSolution: "'Much too' modifies an adjective ('difficult') followed by an infinitive ('to solve') to indicate an excessive degree. 'Too much' is used before uncountable nouns, not adjectives.",
    points: 1
  },
  {
    number: 15,
    prompt: "The cattle lay peacefully under the neem shade, ............",
    options: ["didn't they", "don't they", "didn't it", "isn't it"],
    correctAnswer: "didn't they",
    hint: "'Cattle' is a plural noun, and 'lay' is the simple past tense of 'lie'. Form a past negative tag.",
    workedSolution: "'Cattle' is a plural noun (referred to as 'they'). The verb 'lay' is the simple past tense of 'lie' (to recline). The sentence is affirmative in the past simple, requiring the negative past tag 'didn't they?'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The education director paid an abrupt visit to the school compound.\nChoose the word nearest in meaning to the underlined word 'abrupt'.",
    options: ["an usual", "a strange", "a quick", "an unexpected"],
    correctAnswer: "an unexpected",
    hint: "Happening suddenly and without prior warning or preparation.",
    workedSolution: "'Abrupt' (or sudden) means happening without warning or notice; 'an unexpected' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "Several candidates muttered complaints about the length of the examination paper.\nChoose the word nearest in meaning to the underlined word 'muttered complaints'.",
    options: ["questioned", "talked", "complained", "bothered"],
    correctAnswer: "complained",
    hint: "Expressing discontent, dissatisfaction, or grumbling in a low voice.",
    workedSolution: "'Grumbled' (or muttered complaints) means expressed dissatisfaction in a low, resentful tone; 'complained' is the direct synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "It is discourteous to interrupt an elder while he is speaking at a gathering.\nChoose the word nearest in meaning to the underlined word 'discourteous'.",
    options: ["incorrect", "improper", "unwise", "rude"],
    correctAnswer: "rude",
    hint: "Lacking good manners, civility, or respect.",
    workedSolution: "'Discourteous' (or impolite) means lacking manners or respect for others; 'rude' is its direct equivalent.",
    points: 1
  },
  {
    number: 19,
    prompt: "The prefect spends valuable study time arguing over petty matters.\nChoose the word nearest in meaning to the underlined word 'petty'.",
    options: ["unpleasant", "unimportant", "unexciting", "unacceptable"],
    correctAnswer: "unimportant",
    hint: "Of little value, weight, or significance.",
    workedSolution: "'Petty' (or trivial) means having little real worth or consequence; 'unimportant' is its direct synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "The young apprentice was remarkably inquisitive, inspecting every gear in the workshop.\nChoose the word nearest in meaning to the underlined word 'inquisitive'.",
    options: ["inquisitive", "pompous", "intelligent", "talkative"],
    correctAnswer: "inquisitive",
    hint: "Eager to investigate and acquire knowledge about how things work.",
    workedSolution: "'Inquisitive' (or curious) describes someone with an eager desire to learn and investigate; 'inquisitive' is the exact synonym for 'curious'.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "The news of the headmaster's sudden transfer came like a bolt from the blue. This means that the news was ............",
    options: ["a most welcome one", "short and brief", "a complete surprise", "timely"],
    correctAnswer: "a complete surprise",
    hint: "Happening completely unexpectedly, like lightning from a clear blue sky.",
    workedSolution: "The idiom 'a bolt from the blue' refers to an event that happens totally unexpectedly and causes great surprise.",
    points: 1
  },
  {
    number: 22,
    prompt: "Our grandmother loved to cast her bread upon the waters by feeding destitute strangers. This means that she ............",
    options: ["behaved strangely", "fed fish with bread", "was wasteful", "loved to help people generously"],
    correctAnswer: "loved to help people generously",
    hint: "Doing good deeds selflessly without expecting immediate return.",
    workedSolution: "'To cast one's bread upon the waters' is a biblical idiom meaning to do good and generous deeds freely without seeking personal benefit.",
    points: 1
  },
  {
    number: 23,
    prompt: "When his enterprise collapsed, Kwaku was left to sink or swim. This means that Kwaku ............",
    options: ["was depressed", "shouted for help", "had to find another job", "had to survive on his own"],
    correctAnswer: "had to survive on his own",
    hint: "Left to fail or succeed entirely by one's own efforts without outside support.",
    workedSolution: "'To sink or swim' means to face a challenging situation where one must rely entirely on personal efforts to survive without external help.",
    points: 1
  },
  {
    number: 24,
    prompt: "The candidates were informed at the eleventh hour that the venue had been changed. This means they were informed ............",
    options: ["immediately", "at eleven o'clock", "in good time", "very late"],
    correctAnswer: "very late",
    hint: "At the latest possible moment before an event occurs.",
    workedSolution: "'At the eleventh hour' is an idiom meaning at the very last moment or very late.",
    points: 1
  },
  {
    number: 25,
    prompt: "Kweku had to eat his words when the underdog school won the soccer championship. This means that Kweku ............",
    options: ["became very much surprised", "admitted he was wrong", "denied all that he had said", "lost his appetite"],
    correctAnswer: "admitted he was wrong",
    hint: "Retracting a boastful prediction and admitting an error.",
    workedSolution: "'To eat one's words' means to be forced to admit that an earlier statement, prediction, or boast was wrong.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "The apprentice tore the blueprint accidentally, but his supervisor handled his copy ......",
    options: ["carelessly", "intentionally", "willingly", "foolishly"],
    correctAnswer: "intentionally",
    hint: "'Accidentally' means by chance without meaning to. Find the word that means done on purpose.",
    workedSolution: "'Accidentally' means happening by chance. Its direct antonym is 'intentionally' (or deliberately).",
    points: 1
  },
  {
    number: 27,
    prompt: "The municipal assembly initiated three major sanitation projects last year and ...... two older ones this morning.",
    options: ["funded", "completed", "executed", "organized"],
    correctAnswer: "completed",
    hint: "'Initiated' means started or commenced. Find the word that denotes finishing or bringing to an end.",
    workedSolution: "'Initiated' means started or launched. Its antonym is 'completed' (finished).",
    points: 1
  },
  {
    number: 28,
    prompt: "While the junior boys observed all school regulations, the truant students ...... them.",
    options: ["violated", "cancelled", "lessened", "excluded"],
    correctAnswer: "violated",
    hint: "'Observed' means obeyed or complied with. Find the word that means broken or infringed.",
    workedSolution: "'Observed' in reference to rules means complied with or obeyed. Its direct antonym is 'violated' (broken).",
    points: 1
  },
  {
    number: 29,
    prompt: "The examination council released the results for compliant schools, but ...... the grades of centers under investigation.",
    options: ["withheld", "confirmed", "withdrew", "cancelled"],
    correctAnswer: "withheld",
    hint: "'Released' means made public or given out. Find the word that means retained or held back.",
    workedSolution: "'Released' means made available or published. Its antonym is 'withheld' (kept back or restrained).",
    points: 1
  },
  {
    number: 30,
    prompt: "The audience laughed heartily at the comedian's amusing anecdotes, but found the speaker's remarks completely ......",
    options: ["funny", "humourless", "familiar", "cheerful"],
    correctAnswer: "humourless",
    hint: "'Amusing' or 'funny' brings laughter. Find the word meaning lacking fun, serious, or dry.",
    workedSolution: "'Funny' (amusing) means causing laughter. Its direct antonym is 'humourless' (lacking humor, dull, or dry).",
    points: 1
  },

  // --- SECTION E: CLOZE TEST (31 - 35) ---
  {
    number: 31,
    prompt: "True friendship requires trust. What destroys camaraderie most often is friends being ---31--- of each other.",
    options: ["suspicious", "proud", "envious", "afraid"],
    correctAnswer: "suspicious",
    hint: "Having or showing a cautious distrust of someone's motives.",
    workedSolution: "'Suspicious' fits the context of distrust undermining the foundation of true friendship.",
    points: 1
  },
  {
    number: 32,
    prompt: "A popular adage teaches that lack of faith is the ---32--- of harmonious companionship.",
    options: ["bane", "loss", "end", "fault"],
    correctAnswer: "bane",
    hint: "A cause of great distress, ruin, or destruction ('the ...... of friendship').",
    workedSolution: "The literary noun 'bane' means a cause of continuous misery, ruin, or destruction.",
    points: 1
  },
  {
    number: 33,
    prompt: "Students attend school not only to make acquaintances but also to ---33--- practical skills for livelihood.",
    options: ["acquire", "seize", "gather", "catch"],
    correctAnswer: "acquire",
    hint: "To gain knowledge, skills, or habits through study or experience.",
    workedSolution: "In educational terminology, one 'acquires' knowledge, competencies, and vocational skills through instruction.",
    points: 1
  },
  {
    number: 34,
    prompt: "Through rigorous character training, learners become thoroughly ---34--- in their speech and civic manners.",
    options: ["polished", "bright", "famous", "trained"],
    correctAnswer: "polished",
    hint: "Refined, cultured, and showing polite, dignified social conduct.",
    workedSolution: "'Polished' describes manners that are refined, courteous, cultured, and elegant.",
    points: 1
  },
  {
    number: 35,
    prompt: "With disciplined persistence, a student's academic standing can improve by leaps and ---35---.",
    options: ["bounds", "steps", "marks", "turns"],
    correctAnswer: "bounds",
    hint: "Complete the fixed idiom denoting rapid and spectacular progress: 'by leaps and ......'.",
    workedSolution: "The standard English idiom is 'by leaps and bounds' (meaning with rapid, remarkable progress).",
    points: 1
  },

  // --- SECTION F: ORAL LANGUAGE (36 - 40) ---
  {
    number: 36,
    prompt: "The farmer harvested ripe maize from the field.\nWhich of the following words has the exact same vowel sound as 'ripe' (/aɪ/)?",
    options: ["kite", "clip", "ship", "drip"],
    correctAnswer: "kite",
    hint: "'Ripe' contains the open-to-close diphthong /aɪ/ (rhyming with 'pipe' and 'light').",
    workedSolution: "'Ripe' is pronounced /raɪp/, containing the diphthong /aɪ/. 'Kite' (/kaɪt/) shares the identical /aɪ/ vowel sound.",
    points: 1
  },
  {
    number: 37,
    prompt: "The soldier blew the brass trumpet.\nWhich of the following words begins with the same initial consonant cluster as 'brass' (/br-/)?",
    options: ["brick", "bark", "bake", "bank"],
    correctAnswer: "brick",
    hint: "Identify the word starting with the double consonant cluster /b/ + /r/.",
    workedSolution: "'Brass' begins with the double consonant cluster /br-/. 'Brick' begins with the identical /br-/ cluster.",
    points: 1
  },
  {
    number: 38,
    prompt: "The chef cooked a pot of seasoned broth.\nWhich of the following words contains the same vowel sound as 'pot' (/ɒ/)?",
    options: ["lock", "look", "luck", "lake"],
    correctAnswer: "lock",
    hint: "'Pot' contains the short open back rounded vowel /ɒ/.",
    workedSolution: "'Pot' contains the short vowel sound /ɒ/. 'Lock' (/lɒk/) contains the exact same /ɒ/ sound.",
    points: 1
  },
  {
    number: 39,
    prompt: "The bride walked gracefully down the aisle.\nWhich of the following words contains a silent consonant letter just like the 's' in 'aisle'?",
    options: ["island", "simple", "silent", "sister"],
    correctAnswer: "island",
    hint: "In 'aisle' (/aɪl/), the letter 's' is completely silent.",
    workedSolution: "In 'aisle', the letter 's' is silent. In 'island' (/ˈaɪ.lənd/), the letter 's' is also completely silent.",
    points: 1
  },
  {
    number: 40,
    prompt: "The mechanic repaired the lorry's engine.\nWhich of the following words contains the same consonant sound as the digraph 'ch' in 'mechanic' (/k/)?",
    options: ["school", "church", "chain", "cheese"],
    correctAnswer: "school",
    hint: "'Mechanic' has a 'ch' pronounced as the voiceless velar plosive /k/.",
    workedSolution: "In 'mechanic', 'ch' is pronounced as /k/. In 'school' (/skuːl/), 'ch' represents the same voiceless velar plosive /k/.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 201903);

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
        prompt: "Write a letter to your headmaster discussing two sporting games that should be actively encouraged among students in your school, giving two convincing reasons for your suggestions.",
        modelAnswer: `Anglican Junior High School
P. O. Box 104
Mampong, Ashanti Region
12th June, 2019

The Headmaster
Anglican Junior High School
P. O. Box 104
Mampong

Dear Sir,

PROPOSAL FOR THE INTRODUCTION OF TABLE TENNIS AND VOLLEYBALL IN OUR SCHOOL

On behalf of the Sports Committee of the Student Representative Council, I respectfully write to suggest two sporting games that should be actively promoted in our school: Table Tennis and Volleyball.

First, I recommend Table Tennis (ping-pong). Unlike football, which requires a vast open field and gets interrupted during the rainy season, table tennis can be played indoors in our assembly hall regardless of the weather. It is an inexpensive, fast-paced sport that sharpens hand-eye coordination, quickens mental reflexes, and improves tactical concentration. Introducing table tennis will encourage quiet and less physically aggressive students, who often shy away from soccer, to participate actively in school sports.

Secondly, I suggest the promotion of Volleyball. Volleyball is an exceptional non-contact sport that instills discipline, communication, and collective teamwork. It requires minimal space and inexpensive equipment: only two upright posts, a net, and a ball. Because volleyball does not involve violent physical collisions, it has a very low risk of player injuries, making it safe and enjoyable for both male and female pupils.

Promoting these two sports will diversify our co-curricular program and uncover hidden sporting talents for inter-schools competitions. I hope you will consider these recommendations favorably.

Thank you for your continuous support for student development.

Yours faithfully,
[Signature]
Kwame Owusu
(Sports Prefect)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in your school magazine on the topic: \"Why Every Junior High School Student Should Be Computer-Literate.\"",
        modelAnswer: `THE IMPERATIVE OF COMPUTER LITERACY FOR JUNIOR HIGH SCHOOL LEARNERS
By Janet Asantewaa, JHS 3

We live in a fast-paced, twenty-first-century global village driven by information and communication technology. From banking and agriculture to healthcare and governance, digital technology has transformed human existence. In this modern era, computer literacy is no longer a luxury; it is a fundamental educational necessity for every basic school student.

First, computer literacy revolutionizes independent academic research and learning. Textbooks in our school libraries are often limited in number and quickly become outdated. A computer-literate student with access to the internet can explore encyclopedias, watch educational science simulations, and download past examination papers. Digital proficiency empowers learners to conduct in-depth research, type neat assignments, and prepare effectively for national assessments.

Secondly, mastering computers equips students with vital vocational and career skills for the future. Almost all modern workplaces require employees to be proficient in word processing, data spreadsheets, and digital communication. Learning foundational computing at the basic level prepares students for Senior High School STEM education and tertiary training in software engineering, digital media, and business administration. Conversely, a student without computer skills is severely disadvantaged in the modern job market.

In conclusion, our school administration and Parent-Teacher Association must continue investing in a well-equipped computer laboratory. Every student must embrace computing with enthusiasm, for digital literacy is the key to personal and national transformation.`
      },
      {
        questionNumber: "3",
        category: "Narrative Essay",
        prompt: "Write an interesting story that illustrates the value of benevolence, ending with the statement: \"It pays to be kind to strangers.\"",
        modelAnswer: `One rainy Friday afternoon, while returning home from school in the farming town of Kade, I noticed an elderly man sitting helplessly under a leaky bus shed. His clothes were soaked, his bare feet were coated in mud, and he was shivering from the biting cold. Commuters hurried past him without a second glance, but pity stirred in my heart.

I approached him and discovered that he was a stranger from the northern region who had traveled to visit an estranged relative, only to find the compound locked. He had exhausted his travel money and had not eaten all day. Without hesitating, I used my pocket allowance to buy him a warm plate of rice and offered him my umbrella to shelter him as I guided him to my parents' compound. My mother welcomed him warmly, provided dry clothing, and prepared a warm bath. The following morning, my father bought his return bus ticket back to Bolgatanga. The old man wept tears of gratitude and pronounced blessings upon our household.

Eight years later, I completed my diploma and attended an interview for an administrative officer position at a reputable multinational firm in Accra. Over sixty qualified applicants competed for a single vacancy. As I entered the managing director's office, the elderly executive behind the mahogany desk stared intently at me. To my astonishment, it was the same stranded traveler we had assisted years ago in Kade; he had relocated to head the corporation.

He remembered my face instantly and recalled our family's kindness. After assessing my academic credentials, he hired me on the spot. Walking out of the skyscraper, I smiled and whispered: It pays to be kind to strangers.`
      }
    ]
  },
  sectionB_comprehension: {
    title: "Part B: Reading Comprehension",
    passage: `Friends are meant to support each other when the need arises. At school, young people develop friendly relationships which often endure throughout their adult lives. One thing which helps people to stay together as intimate friends is the ability to communicate freely among themselves and endeavor to be each other's keeper. What destroys friendships mostly is friends being suspicious of each other. That is why a popular adage says, "Suspicion is the bane of friendship."

People attend school not only because they want to make friends but also to acquire knowledge and skills for employment. Education helps people to be polished in their manners. The school prepares its students to become useful, disciplined citizens.

At school, Tono was not in the good books of the teachers because he behaved in an unruly manner. Initially, everyone avoided his company; he could be violent at times. Worst of all, he would refuse to do his assignments and was a habitual latecomer. With the passage of time, he was subjected to strict discipline by the school authorities. He began to amend his ways and obey the school's rules and regulations. He realized the need to work diligently in order to have a bright future. His academic work thereafter improved by leaps and bounds.

Fortune eventually separated us. I traveled abroad for further studies and stayed away for two decades. On my return, I went to my former school to collect my certificate. There, I met a middle-aged gentleman who had also come to the headmaster's office for the same purpose. I could not recognize him because time had wiped off all physical memories of school days. However, the names on the certificates revealed that we were classmates. After a warm discussion, Tono invited me to become his business partner.`,
    questions: [
      {
        subId: "(a)(i)",
        question: "State one thing which helps people to maintain a close, lasting friendship according to the passage.",
        answer: "The ability to communicate freely among themselves (or striving to be each other's keeper)."
      },
      {
        subId: "(a)(ii)",
        question: "How does friendship get destroyed according to the passage?",
        answer: "Friendship gets destroyed when friends become suspicious of each other (mutual distrust)."
      },
      {
        subId: "(b)",
        question: "Give two reasons why people go to school as stated in the second paragraph.",
        answer: "1. To acquire knowledge and skills for employment.\n2. To become polished in their manners and develop into useful citizens."
      },
      {
        subId: "(c)(i)",
        question: "Why did people avoid Tono's company initially?",
        answer: "Because he was unruly, violent at times, refused to do his assignments, and was a habitual latecomer."
      },
      {
        subId: "(c)(ii)",
        question: "State Tono's reason for visiting his former school after twenty years.",
        answer: "He visited the school to collect his school certificate."
      },
      {
        subId: "(d)",
        question: "Why could the writer not recognize Tono when they met in the office?",
        answer: "Because twenty years (two decades) had elapsed, changing his appearance and wiping away memories of school days."
      },
      {
        subId: "(e)",
        question: "Explain in your own words the following expressions as used in the passage:\n(i) was not in the good books of the teachers;\n(ii) with the passage of time;\n(iii) by leaps and bounds.",
        answer: "(i) **was not in the good books of the teachers:** Was disliked or viewed with disfavor and disapproval by the teachers.\n(ii) **with the passage of time:** As time went by / as days and months progressed.\n(iii) **by leaps and bounds:** Rapidly / with great and remarkable progress."
      },
      {
        subId: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\n(i) intimate;\n(ii) adage;\n(iii) acquire;\n(iv) polished;\n(v) initially.",
        answer: "(i) **intimate:** close / devoted / bosom / dear.\n(ii) **adage:** proverb / saying / maxim / wise saying.\n(iii) **acquire:** gain / obtain / learn / attain.\n(iv) **polished:** refined / cultured / well-mannered / polite.\n(v) **initially:** at first / originally / in the beginning."
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
        extract: "\"Stop, thief!\" he shouted, thinking Oliver had robbed him. The poor boy found himself being chased by people and even dogs! Someone in the crowd, a young man with purple lips and red sores all over his hands, grabbed Oliver and knocked him down............\"",
        question: "Who is the young man with purple lips and red sores all over his hands?",
        answer: "A brutal, rough bystander in the London mob (or an associate of the criminal underworld in London)."
      },
      {
        subId: "5(b)",
        textSource: "CHARLES DICKENS: Oliver Twist",
        extract: "\"Someone in the crowd... grabbed Oliver and knocked him down...\"",
        question: "Why did the young man in the crowd want to harm Oliver?",
        answer: "He joined the shouting mob out of malice and cruelty, eager to punish a defenseless boy falsely accused of pickpocketing."
      },
      {
        subId: "5(c)",
        textSource: "CHARLES DICKENS: Oliver Twist",
        extract: "The resolution of Oliver's ordeal...",
        question: "How did Mr. Brownlow help Oliver at the end of the story?",
        answer: "He officially adopted Oliver as his son, provided him with a loving home, education, and secured his rightful family inheritance."
      },
      {
        subId: "5(d)",
        textSource: "KEN SARO-WIWA: Home Sweet Home",
        extract: "\"Bom, say, our young Miss has arrived heavily laden with all the good things of the earth. I should think Dukana will soon float on a sea of wealth.\"",
        question: "Who is referred to as \"our young Miss\" in the extract?",
        answer: "The narrator (the educated young woman returning to her village of Dukana after her schooling)."
      },
      {
        subId: "5(e)",
        textSource: "KEN SARO-WIWA: Home Sweet Home",
        extract: "\"... heavily laden with all the good things of the earth...\"",
        question: "Identify the literary device used in the underlined expression.",
        answer: "Hyperbole (or Exaggeration), describing her ordinary travel luggage as carrying all the riches of the world."
      },
      {
        subId: "5(f)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "\"X: It was a couple of days ago that we met. What came out of the meeting is that we must come and ask you and your wife what is preventing you from giving your grandmother a great-grandchild before she leaves us.\"",
        question: "Who is the speaker represented by 'X' in the extract?",
        answer: "Petu (the elder uncle of Ato Yawson and head of the Odumna family)."
      },
      {
        subId: "5(g)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "\"... what is preventing you from giving your grandmother a great-grandchild...\"",
        question: "According to the real secret shared between Ato and Eulalie, what was preventing them from having children?",
        answer: "They had mutually agreed to use birth control to postpone childbearing, but Ato concealed this from his family."
      },
      {
        subId: "5(h)",
        textSource: "AMA ATA AIDOO: The Dilemma of a Ghost",
        extract: "\"... before she leaves us.\"",
        question: "Identify the figure of speech used in the expression \"before she leaves us\".",
        answer: "Euphemism (softening the harsh reality of physical death by saying 'leaves us')."
      },
      {
        subId: "5(i)",
        textSource: "THERESA ENNIN: Makola",
        extract: "\"Head bent, rags all around the upside down pan\nPicking her nose, shuffling her feet, oblivious to the bustle\"",
        question: "Write down one group of words in the extract that highlights the theme of uncleanliness or poverty.",
        answer: "\"rags all around\" (or \"Picking her nose\")."
      },
      {
        subId: "5(j)",
        textSource: "THERESA ENNIN: Makola",
        extract: "\"Head bent, rags all around the upside down pan...\"",
        question: "The words 'Head bent, rags all around the upside down pan' appeal to the reader's sense of ............",
        answer: "Sense of sight (visual imagery)."
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

async function seedBeceEnglish2019Calibrated() {
  const db = await getDb();
  console.log("Seeding Calibrated & Balanced BECE English 2019 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2019");
  await docRef.set({
    year: 2019,
    title: "BECE English Language 2019 (Calibrated National Benchmark)",
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

  console.log("✅ Calibrated BECE English 2019 successfully seeded into Firestore!");
}

seedBeceEnglish2019Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2019:", err);
    process.exit(1);
  });
