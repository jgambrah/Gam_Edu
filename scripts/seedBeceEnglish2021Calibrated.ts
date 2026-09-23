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
// 100% CLEAN-ROOM ISOMORPHIC QUESTIONS (1 - 30)
// =========================================================================
const allRawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "May I borrow your ............ hat for the sunny garden excursion?",
    options: [
      "blue new straw",
      "new blue straw",
      "new straw blue",
      "straw new blue"
    ],
    correctAnswer: "new blue straw",
    hint: "Cumulative adjective ordering: Age/Condition ('new') precedes Color ('blue') which precedes Material ('straw') before the head noun.",
    workedSolution: "Standard English cumulative adjective order places age ('new') before color ('blue') followed by material origin ('straw'): 'new blue straw hat'.",
    points: 1
  },
  {
    number: 2,
    prompt: "The accountant has strictly informed us that she will not disburse ............ more allowances this week.",
    options: ["any", "even", "much", "little"],
    correctAnswer: "any",
    hint: "Following the negative particle 'not', standard English requires the non-assertive quantifier 'any'.",
    workedSolution: "In negative clauses containing 'not', the non-assertive determiner 'any' is required: 'will not give us any more money'.",
    points: 1
  },
  {
    number: 3,
    prompt: "You would be ravenously hungry during the journey if you ............ to take your breakfast.",
    options: ["are refusing", "refuse", "refused", "were refusing"],
    correctAnswer: "refused",
    hint: "Second Conditional: 'would be' in the main clause requires a simple past indicative/subjunctive verb in the if-clause.",
    workedSolution: "In a Second Conditional sentence expressing a hypothetical condition ('would be hungry'), the if-clause takes the simple past tense: 'refused'.",
    points: 1
  },
  {
    number: 4,
    prompt: "You have verified the examination index numbers on the roster, ............ you?",
    options: ["did", "didn't", "had", "haven't"],
    correctAnswer: "haven't",
    hint: "An affirmative present perfect statement with auxiliary 'have' takes the contracted negative tag 'haven't you?'.",
    workedSolution: "The auxiliary verb in the main clause is affirmative present perfect 'have'. The matching question tag must be negative: 'haven't you?'.",
    points: 1
  },
  {
    number: 5,
    prompt: "To avoid the congested city road traffic, Habib travels to the academy ............ train.",
    options: ["by", "in", "on", "with"],
    correctAnswer: "by",
    hint: "General modes of transport (train, sea, air, bus) take the preposition 'by' without an article.",
    workedSolution: "When describing standard public transportation modes without determiners, standard English uses 'by': 'by train'.",
    points: 1
  },
  {
    number: 6,
    prompt: "Aba prefers telephone calls because she does not enjoy ............ long letters.",
    options: ["to be writing", "to write", "write", "writing"],
    correctAnswer: "writing",
    hint: "The catenative verb 'like/enjoy' takes a gerund complement (verb-ing) when expressing general habitual dislike.",
    workedSolution: "Following verbs expressing general habitual preference ('does not like/enjoy'), the gerund complement 'writing' is standard: 'writing letters'.",
    points: 1
  },
  {
    number: 7,
    prompt: "You will suffer severe food poisoning if you ............ uncooked pork.",
    options: ["ate", "eat", "had eaten", "have eaten"],
    correctAnswer: "eat",
    hint: "First Conditional: Future predictive 'will + verb' in the main clause requires a simple present verb in the if-clause.",
    workedSolution: "In a First Conditional predictive sentence ('You will be ill...'), the conditional if-clause takes the simple present tense: 'eat'.",
    points: 1
  },
  {
    number: 8,
    prompt: "The judicial proceedings were conducted strictly according ............ the statutory regulations.",
    options: ["by", "of", "to", "with"],
    correctAnswer: "to",
    hint: "Identify the preposition that regularly collocates with the prepositional phrase 'according'.",
    workedSolution: "In standard English, the fixed prepositional phrase is 'according to': 'according to the rules'.",
    points: 1
  },
  {
    number: 9,
    prompt: "............ the formidable economic obstacles, our cooperative enterprise succeeded.",
    options: ["As such", "However", "In spite of", "Nevertheless"],
    correctAnswer: "In spite of",
    hint: "Prepositional phrase of concession followed directly by a noun phrase complement ('the challenges').",
    workedSolution: "The concessive prepositional phrase governing a noun phrase is 'In spite of' (meaning notwithstanding the challenges). 'However' and 'Nevertheless' are adverbs.",
    points: 1
  },
  {
    number: 10,
    prompt: "My elder brother, together with his wife and children, ............ traveling to Salaga next weekend.",
    options: ["are", "is", "was", "were"],
    correctAnswer: "is",
    hint: "Parenthetical additions introduced by 'together with / with' do not pluralize the singular subject 'My brother'.",
    workedSolution: "Parenthetical phrases ('with his wife and children') do not alter the grammatical number of the subject. The singular head 'My brother' takes the singular present auxiliary 'is'.",
    points: 1
  },
  {
    number: 11,
    prompt: "The sun is already rising; it is high time we ............ our cross-country trek.",
    options: ["are starting", "shall start", "start", "started"],
    correctAnswer: "started",
    hint: "Subjunctive past simple: 'It is high time + subject' takes a simple past verb form.",
    workedSolution: "Following the subjunctive formula 'It is high time' followed by a subject, standard grammar requires the simple past tense: 'started'.",
    points: 1
  },
  {
    number: 12,
    prompt: "Our grandmother always prefers juicy sweet oranges ............ bitter grapefruits.",
    options: ["on", "than", "to", "for"],
    correctAnswer: "to",
    hint: "The comparative verb 'prefer' takes the preposition 'to', never 'than'.",
    workedSolution: "In standard English grammar, the verb 'prefer' takes the preposition 'to': 'prefer oranges to mangoes'.",
    points: 1
  },
  {
    number: 13,
    prompt: "His paternal aunt ............ addressed our class assembly resides in Tamale.",
    options: ["that", "which", "who", "whom"],
    correctAnswer: "who",
    hint: "Subjective relative pronoun referring to human beings functioning as the grammatical subject of 'spoke'.",
    workedSolution: "When referring to a human person in the subject position of a relative clause ('spoke to us'), 'who' is standard: 'aunt who spoke to us'.",
    points: 1
  },
  {
    number: 14,
    prompt: "Because the aroma was so savory, Araba could not resist ............ the cooking pot on the stove.",
    options: ["by opening", "open", "to open", "opening"],
    correctAnswer: "opening",
    hint: "The catenative verb 'resist' requires a gerund complement (verb-ing).",
    workedSolution: "In standard English syntax, the verb 'resist' takes a gerund complement: 'resist opening'.",
    points: 1
  },
  {
    number: 15,
    prompt: "My eccentric neighbor, ............ hound barks furiously every midnight, has relocated to another town.",
    options: ["which", "who", "who's", "whose"],
    correctAnswer: "whose",
    hint: "Possessive relative pronoun showing ownership of the dog ('dog barks').",
    workedSolution: "The possessive relative pronoun modifying a noun possessed by a person is 'whose': 'neighbour, whose dog barks'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The selected classical poems in the anthology are remarkably engaging.\nChoose the word nearest in meaning to 'selected'.",
    options: ["preferred", "chosen", "prescribed", "given"],
    correctAnswer: "chosen",
    hint: "Picked out or selected from a larger group.",
    workedSolution: "'Selected' means singled out from a number of alternatives; 'chosen' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "Merely increasing patrols does not halt the proliferation of cyber fraud.\nChoose the word nearest in meaning to 'halt'.",
    options: ["avoid", "prevent", "stop", "suspend"],
    correctAnswer: "stop",
    hint: "To bring or come to an abrupt standstill or end.",
    workedSolution: "'Halt' means to bring to a stop or terminate an action; 'stop' is its exact equivalent.",
    points: 1
  },
  {
    number: 18,
    prompt: "All the lax disciplinary guidelines in the dormitory have been repealed.\nChoose the word nearest in meaning to 'lax'.",
    options: ["mild", "previous", "weak", "wrong"],
    correctAnswer: "weak",
    hint: "Not sufficiently strict, severe, or careful; loose and deficient in firmness.",
    workedSolution: "'Lax' in describing discipline or regulations means loose, careless, or 'weak'; 'weak' (or loose/mild) fits the context.",
    points: 1
  },
  {
    number: 19,
    prompt: "Disciplined youth should be guided by the fundamental principles of civic integrity.\nChoose the word nearest in meaning to 'fundamental'.",
    options: ["essential", "known", "popular", "realistic"],
    correctAnswer: "essential",
    hint: "Forming a necessary base or core; of central importance.",
    workedSolution: "'Fundamental' means serving as an original, primary, or core basis; 'essential' is its direct synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "The patient porter could no longer endure the passenger's verbal insolence.\nChoose the word nearest in meaning to 'endure'.",
    options: ["accept", "agree", "approve", "bear"],
    correctAnswer: "bear",
    hint: "To tolerate, put up with, or withstand suffering or insolence.",
    workedSolution: "'Endure' in the context of enduring hardship or abuse means to tolerate or 'bear'; 'bear' is its exact equivalent.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "Azara burned her fingers when she intervened in the bitter land dispute. This means that Azara ............",
    options: [
      "got herself into serious trouble",
      "hated her former companion",
      "demonstrated how courageous she was",
      "suffered minor physical burns"
    ],
    correctAnswer: "got herself into serious trouble",
    hint: "To suffer unpleasant consequences as a result of meddling or taking an ill-advised risk.",
    workedSolution: "The idiom 'to burn one's fingers' means to suffer harm, financial loss, or trouble as a result of meddling or reckless action.",
    points: 1
  },
  {
    number: 22,
    prompt: "A drowning man will clutch at straws to preserve his life. This means that in a crisis, an individual will ............",
    options: [
      "act with extraordinary bravery",
      "seize desperately upon any slight chance of rescue",
      "devise a cunning intellectual scheme",
      "seek assistance from hidden enemies"
    ],
    correctAnswer: "seize desperately upon any slight chance of rescue",
    hint: "To attempt any course of action, no matter how desperate or hopeless, in an emergency.",
    workedSolution: "The proverb 'to clutch at straws' means to resort to any desperate or slight expedient, however hopeless, to save oneself.",
    points: 1
  },
  {
    number: 23,
    prompt: "Gifty held her tongue throughout the heated political altercation. This means that Gifty ............",
    options: [
      "bit her tongue in pain",
      "deliberately remained silent and refrained from speaking",
      "shouted down her opponents",
      "refused to smile"
    ],
    correctAnswer: "deliberately remained silent and refrained from speaking",
    hint: "To refrain from expressing an opinion; to keep silent.",
    workedSolution: "The idiom 'to hold one's tongue' means to deliberately keep silent and refrain from speaking.",
    points: 1
  },
  {
    number: 24,
    prompt: "The regional drainage construction project is already in the pipeline. This means the project is ............",
    options: [
      "being actively planned, processed, and prepared",
      "suspended indefinitely",
      "completely abandoned",
      "stuck inside water pipes"
    ],
    correctAnswer: "being actively planned, processed, and prepared",
    hint: "In the process of being planned, developed, or produced.",
    workedSolution: "The idiom 'in the pipeline' means in the process of being dealt with, developed, or prepared for implementation.",
    points: 1
  },
  {
    number: 25,
    prompt: "Amon has always kept his treacherous rivals at arm's length. This means that Amon has ............",
    options: [
      "threatened them with physical force",
      "shunned them and avoided close familiarity",
      "challenged them openly in public",
      "trusted them with confidential files"
    ],
    correctAnswer: "shunned them and avoided close familiarity",
    hint: "To avoid intimacy, maintain emotional distance, or keep someone at a safe distance.",
    workedSolution: "The idiom 'to keep someone at arm's length' means to avoid becoming too friendly or familiar with them; to shun or keep them at a distance.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "The market stalls were temporarily evacuated during the fire drill, but reopened ...... thereafter.\nChoose the word most nearly opposite in meaning to 'temporarily'.",
    options: ["constantly", "deliberately", "legally", "permanently"],
    correctAnswer: "permanently",
    hint: "'Temporarily' means for a brief, limited period. What word denotes lasting for all time without end?",
    workedSolution: "'Temporarily' means for a limited time only. Its direct antonym is 'permanently' (enduringly or for all time).",
    points: 1
  },
  {
    number: 27,
    prompt: "Passengers alight from the bus at the terminal, whereas commuters ...... the coach at the curb.\nChoose the word most nearly opposite in meaning to 'alights'.",
    options: ["ascends", "boards", "enters", "joins"],
    correctAnswer: "boards",
    hint: "'To alight' means to get off or descend from a vehicle. What transportation verb denotes getting onto a vehicle?",
    workedSolution: "'Alight' means to step down or disembark from a bus, train, or carriage. Its direct opposite in passenger transport is 'boards' (gets on).",
    points: 1
  },
  {
    number: 28,
    prompt: "While travelers feel unsafe in the dark thicket, they feel remarkably ...... within the fortified lodge.\nChoose the word most nearly opposite in meaning to 'unsafe'.",
    options: ["afraid", "rejected", "secure", "unhappy"],
    correctAnswer: "secure",
    hint: "'Unsafe' means exposed to danger or risk. What word denotes protected, safe, and free from peril?",
    workedSolution: "'Unsafe' means dangerous or exposed to hazard. Its direct physical antonym is 'secure' (safe and protected).",
    points: 1
  },
  {
    number: 29,
    prompt: "The children laughed at his funny theatrical anecdotes, but fell silent at his ...... lectures.\nChoose the word most nearly opposite in meaning to 'funny'.",
    options: ["cheerful", "humourless", "familiar", "peculiar"],
    correctAnswer: "humourless",
    hint: "'Funny' means amusing and comical. What word denotes lacking humor, dry, and serious?",
    workedSolution: "'Funny' describes something amusing or comical. Its direct stylistic antonym is 'humourless' (devoid of wit or amusement).",
    points: 1
  },
  {
    number: 30,
    prompt: "The disciplinary master rebuked the truants, but ...... the punctual monitors.\nChoose the word most nearly opposite in meaning to 'rebuked'.",
    options: ["defended", "justified", "pardoned", "praised"],
    correctAnswer: "praised",
    hint: "'Rebuked' means scolded or reprimanded sharply. What word denotes commended or expressed warm approval?",
    workedSolution: "'Rebuked' means reprimanded or scolded. Its direct behavioral antonym is 'praised' (commended).",
    points: 1
  }
];

// Seeded Deterministic Shuffle across 30 Objective Items: Exactly 8 A, 7 B, 8 C, 7 D
const targetKeys: number[] = [
  0, 1, 2, 3, 0, 1, 2, 3, 0, 1,
  2, 3, 0, 1, 2, 3, 0, 1, 2, 3,
  0, 1, 2, 3, 0, 1, 2, 3, 0, 2
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

const assignedTargetIndices = seedShuffle(targetKeys, 202104);

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

// =========================================================================
// PAPER 2: ESSAY WRITING, COMPREHENSION & LITERATURE (THEORY SUITE)
// =========================================================================
const paper2Calibrated = {
  partA_composition: {
    title: "Part A: Essay Writing",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Formal Letter",
        prompt: "Write a formal letter to the Minister of Transport, presenting at least two practical policy recommendations for modernizing and improving the public road transit network in your country.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2021

The Honorable Minister
Ministry of Transport
Ministries Directorate, Accra

Dear Honorable Minister,

PROPOSALS FOR REFORMING AND MODERNIZING GHANA'S PUBLIC ROAD TRANSPORT SYSTEM

I respectfully submit this letter on behalf of the youth and commuters within the Bekwai Municipality to share two practical policy interventions aimed at improving the efficiency, reliability, and safety of our national road transport network.

First and foremost, the Ministry should spearhead the nationwide integration of modern, high-capacity Bus Rapid Transit (BRT) networks across all major urban and inter-city corridors. Currently, our public transport sector is heavily dominated by poorly maintained commercial minibuses (trotros), whose erratic stopping habits and overcrowding cause severe traffic gridlocks and fatal highway accidents. By deploying fleets of air-conditioned, fuel-efficient mass transit buses operating along dedicated transit lanes, the government can provide safe, affordable, and punctual commuting. Implementing digital contactless ticketing on these fleets will also eliminate extortionate, unpredictable fare hikes by opportunistic conductors.

Secondly, the Ministry must enforce rigorous statutory vehicle roadworthiness inspections and computerized speed-monitoring protocols. A substantial percentage of catastrophic highway fatalities occur because commercial vehicles operate with defective hydraulic brakes, worn-out tires, and broken tail-lights. The Ministry should establish mechanized testing stations across all district capitals and mandate the installation of automated speed limiters on all commercial passenger vehicles. Furthermore, introducing highway solar-powered surveillance cameras to penalize reckless drivers will restore discipline and drastically reduce road carnage.

I trust that your visionary leadership will prioritize these actionable reforms to protect the lives and livelihoods of Ghanaian commuters.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Youth Representative)`
      },
      {
        questionNumber: "2",
        category: "Debate Speech",
        prompt: "You are the principal speaker in an inter-schools debate competition on the motion: \"Basic and Senior High School Students Should Not Be Compelled to Wear Uniforms to School.\" Write your speech arguing against the motion.",
        modelAnswer: `AGAINST THE MOTION: "STUDENTS SHOULD NOT BE COMPELLED TO WEAR UNIFORMS TO SCHOOL"

Mr. Chairman, Distinguished Panel of Judges, Impartial Timekeeper, Worthy Opponents, and Fellow Students:

I stand firmly before you this morning to vehemently oppose the motion which asserts that: "Students should not be compelled to wear uniforms to school." While proponents argue that wearing casual clothing fosters individuality, an objective socio-economic and pedagogical analysis demonstrates that compulsory school uniforms remain an indispensable pillar of social equality, campus discipline, and academic focus.

First and foremost, school uniforms function as a magnificent social equalizer that obliterates socio-economic disparities. In any school community, students originate from radically diverse economic backgrounds; some are children of wealthy business executives, while others are children of struggling subsistence farmers. If casual mufti attire were permitted, the school environment would rapidly degenerate into a toxic fashion parade. Wealthy students would flaunt expensive designer jeans and imported sneakers, while indigent learners would endure acute psychological humiliation, shame, and inferiority complexes on account of their modest clothing. Uniforms eliminate this superficial vanity, creating a level playing field where every child is valued solely for intellectual character.

Secondly, uniforms reinforce campus security and foster institutional pride. A standardized uniform instantly identifies a student within the school compound and the wider township, deterring truancy and preventing unauthorized criminal intruders from infiltrating the school grounds unnoticed. Furthermore, dressing in smart, neatly pressed uniforms conditions young minds for professional decorum and workplace readiness.

In conclusion, school uniforms promote modesty, protect poor students from social stigmatization, and maintain institutional discipline. I urge you all to resoundingly reject the motion.

Thank you.`
      },
      {
        questionNumber: "3",
        category: "Informal Letter",
        prompt: "Write a warm, engaging letter to your cousin living in another region, inviting him or her to spend the upcoming long vacation with your grandparents in the village, giving at least two compelling reasons why he or she should pay them a visit.",
        modelAnswer: `Presbyterian Junior High School
P. O. Box 80
Begoro, Eastern Region
18th June, 2021

Dear Cousin Kofi,

I hope this letter finds you in fine health, peace of mind, and preparing hard for your upcoming examinations in Accra. I write with immense joy to invite you to join me in spending three weeks of our long vacation with our beloved grandparents at their peaceful village homestead in Kofiase. It has been over four years since you last visited them, and I present two compelling reasons why you should make this trip.

First and foremost, our grandparents are advancing in age, and spending time with them will bring them immeasurable emotional comfort and joy. Whenever I visit the village, Grandpa constantly asks about your wellbeing, while Grandma treasures your childhood photographs on her dresser. In their twilight years, there is no greater blessing we can bestow upon them than our physical presence, sharing warm meals, listening to Grandpa's captivating evening fireside folktales, and helping them with light homestead chores like harvesting ripe citrus fruits and feeding their poultry.

Secondly, spending the vacation in the serene countryside will provide you with a refreshing mental retreat from the noise, toxic pollution, and chaotic stress of metropolitan Accra. Kofiase is blessed with misty mountain waterfalls, lush cocoa plantations, and clean, unpolluted breeze. During our stay, Uncle Kwame has agreed to take us on guided forest hikes to explore natural rock caves and teach us traditional river fishing. In addition, Grandma has promised to prepare her legendary hot pounded fufu served with freshly tapped palm-nut game soup!

Please discuss this invitation with Auntie Mansa early so we can travel together. I eagerly await your arrival.

Your affectionate cousin,
[Signature]
Emmanuel Addo`
      }
    ]
  },
  partB_comprehension: {
    title: "Part B: Reading Comprehension",
    instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
    passageText: `The tiger, the cheetah, and the domestic cat belong to the identical zoological felid family. The majestic tiger represents the largest carnivorous member of this feline group. Although it remains a fierce wild predator, it is occasionally tamed and trained to assist circus acrobats in entertaining audiences. The cheetah is universally celebrated as the fastest terrestrial mammal on earth, capable of being trained to chase down game during traditional royal hunts. Domestic cats inhabit millions of human households worldwide, although wild species continue to thrive in the forests.

Although domestic felines are found in countless human homes today, humanity did not set out to domesticate them intentionally. In prehistoric eras before humanity developed the skills of systematic crop agriculture and animal husbandry, early humans depended exclusively upon wild forest plants and hunted game for sustenance.

When humans eventually learned to harvest and store cereal grains—which originated as the seeds of wild grasses—they inadvertently gathered the natural food supply of destructive rodents such as mice and field rats. These ravenous rodents followed their food indoors, infesting early human granaries. In turn, the African wildcat, the natural predatory enemy of mice and rats, tracked its prey straight into domestic granaries.

Significantly, cats did not consume the stored cereal grains that had become the staple nourishment for human communities. Consequently, early agriculturalists encouraged these agile predators to remain within their homesteads to eradicate the destructive rodent pests. Furthermore, humans discovered that cats were remarkably cleaner, neater, and quieter than domesticated dogs.

With the subsequent invention of sailing vessels and the expansion of inter-continental maritime trade, stored grains emerged as vital commercial commodities used both as travel provisions and as valuable items of barter. Inevitably, the rodents accompanied these maritime grain cargoes on long ocean voyages, closely pursued by the cats. Through this unbroken historical chain, an ecological commensalism that commenced across the ancient Mediterranean basin spread to all corners of the earth.`,
    questions: [
      {
        subQuestion: "(a)",
        question: "I. What two broad categories or types of cats are mentioned in the opening paragraph?\nII. How did the cat originally become a domestic animal living with human beings?",
        answer: "I. The two types are domestic cats and wild cats.\nII. The cat became domesticated naturally when early human grain storage attracted rodents into homes, and wild cats followed these rodents indoors to hunt them, leading humans to welcome them."
      },
      {
        subQuestion: "(b)",
        question: "State two specific reasons why early humans preferred cats to dogs around their households.",
        answer: "Early humans preferred cats because they were cleaner (neater) and quieter than dogs (and did not consume human grains)."
      },
      {
        subQuestion: "(c)",
        question: "What specific human technological and commercial activity led to the global spread of cats across the world?",
        answer: "Maritime sailing trade (the invention of sailing ships and long-distance ocean commerce involving grain transport)."
      },
      {
        subQuestion: "(d)",
        question: "I. What is specifically referred to as 'a food chain' in the context of the passage?\nII. Why were cereal grains easily transported on long voyages to all corners of the world?",
        answer: "I. 'A food chain' refers to the ecological feeding relationship where rodents eat human grains, and cats prey on rodents (Grain -> Rodents -> Cats).\nII. Grains were easily transported because they are dry, non-perishable food items that could be stored for long periods as voyage provisions and trade barter."
      },
      {
        subQuestion: "(e)",
        question: "Explain the meaning of the following expressions as used in the passage:\nI. 'the domestic granaries'\nII. 'items of barter'\nIII. 'all corners of the world'",
        answer: "I. 'the domestic granaries' means household grain barns or food storage structures built by human families.\nII. 'items of barter' means goods or commodities used directly as a medium of trade to exchange for other goods without money.\nIII. 'all corners of the world' means everywhere across the entire globe; internationally."
      },
      {
        subQuestion: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. sometimes\nII. intentionally\nIII. gathered\nIV. nourishment\nV. probably",
        answer: "I. sometimes: occasionally, periodically, now and then.\nII. intentionally: deliberately, purposely, on purpose, consciously.\nIII. gathered: collected, harvested, amassed, accumulated.\nIV. nourishment: food, sustenance, nutrition, nutriment.\nV. probably: likely, presumably, in all likelihood, perhaps."
      }
    ]
  },
  partC_literature: {
    title: "Part C: Literature in English (The Cockcrow Anthology)",
    instructions: "Answer all questions in this part based on the prescribed texts from Sackey J.A. and Darmani L. (comp.): The Cockcrow.",
    questions: [
      {
        sectionTitle: "CHARLES DICKENS: Oliver Twist",
        contextExtract: "'Mr. Bumble made Oliver miserable and the boy couldn't wait to get away from the workhouse.'",
        subItems: [
          {
            subQuestion: "5(a)",
            question: "State two specific ways through which Mr. Bumble made young Oliver miserable in the workhouse.",
            answer: "He starved him, verbally abused him, subjected him to solitary confinement, and administered brutal physical beatings with his cane."
          },
          {
            subQuestion: "5(b)",
            question: "Who is Mr. Bumble in terms of his official occupation in the parish?",
            answer: "He is the pompous, cruel parish beadle (workhouse official/church officer)."
          },
          {
            subQuestion: "5(c)",
            question: "How did Mr. Bumble attempt to get rid of Oliver Twist from the parish workhouse?",
            answer: "He offered a five-pound reward to anyone who would take Oliver as an apprentice, eventually indenturing him to Mr. Sowerberry, the undertaker."
          }
        ]
      },
      {
        sectionTitle: "KEN SARO-WIWA: Home Sweet Home",
        contextExtract: "\"They came in the usual assortment of rags: gowns picked up from the stores of second-hand clothes traders, singlets bearing the words, Oxford University, mildewed blouses. Some women wore shirts that are meant for men; one of them was in a printed cotton nightgown that had faded beyond recognition.\"",
        subItems: [
          {
            subQuestion: "5(d)",
            question: "In the story, who does the plural pronoun 'They' refer to in the extract?",
            answer: "The impoverished rural villagers / market women of Dakuna who gathered to welcome the passenger lorry."
          },
          {
            subQuestion: "5(e)",
            question: "What predominant social imagery is vividly created through this description?",
            answer: "An imagery of acute poverty, destitution, squalor, and socio-economic neglect (visual imagery of rags)."
          }
        ]
      },
      {
        sectionTitle: "AMA ATA AIDOO: The Dilemma of a Ghost",
        contextExtract: "EULALIE: Ya, I remember I bought the idea, but I got the feeling ...\nATO: Heavens, women! They are always getting feelings. First, you got the feeling you needed a couple of years to settle down and now you are obviously getting a feeling.",
        subItems: [
          {
            subQuestion: "5(f)",
            question: "What specific idea did Eulalie 'buy' (agree to) initially?",
            answer: "The agreement to use contraception (birth control) to postpone childbearing for a few years until they had settled down professionally."
          },
          {
            subQuestion: "5(g)",
            question: "What new 'feeling' has Eulalie developed now regarding children?",
            answer: "She now feels ready and desires to have a baby immediately, feeling the pressure and isolation of the African extended family."
          },
          {
            subQuestion: "5(h)",
            question: "How does Ato react to Eulalie's expressions of her feelings?",
            answer: "He reacts with irritation, exasperation, dismissiveness, and mockery, brushing aside her genuine emotional concerns."
          }
        ]
      },
      {
        sectionTitle: "V. B. AAKYE: The Colour of God",
        contextExtract: "\"How silly man is, laughs the rose\nWhy should he be black or white\nOr green or yellow or even red?\"",
        subItems: [
          {
            subQuestion: "5(i)",
            question: "Identify the literary figure of speech utilized in the expression: '... laughs the rose'.",
            answer: "Personification."
          },
          {
            subQuestion: "5(j)",
            question: "According to the profound philosophical message of the poem, what is the true 'colour of God'?",
            answer: "God has no single physical racial color; God is love, universal, and present in all colors and all humanity."
          }
        ]
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
  },
  ...paper2Calibrated.partC_literature.questions.map((sec, idx) => ({
    id: `literature_cockcrow_${idx + 1}`,
    partLabel: `Part C: Literature - ${sec.sectionTitle}`,
    contextExtract: sec.contextExtract || null,
    subItems: sec.subItems,
    marks: 10
  }))
];

async function seedBeceEnglish2021Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 2021 (Seed 202104) into Firestore...");

  // Key Balance Audit
  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  balancedPaper1.forEach((q) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log("Verified Key Balance across 30 Objective Items:", keyDist);

  const db = await getDb();
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
      hasCockcrowLiterature: true,
      passageFirstLayout: false,
      updatedAt: new Date()
    },
    questions: balancedPaper1,
    paper1: {
      title: "Paper 1: Objective Test (Lexis and Structure)",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      sections: {
        sectionA_lexis_and_structure: {
          title: "Section A: Lexis and Structure",
          questionRange: "Questions 1 to 15",
          questions: balancedPaper1.slice(0, 15)
        },
        sectionB_synonyms: {
          title: "Section B: Synonyms (Nearest in Meaning)",
          questionRange: "Questions 16 to 20",
          questions: balancedPaper1.slice(15, 20)
        },
        sectionC_idioms: {
          title: "Section C: Idiomatic Expressions",
          questionRange: "Questions 21 to 25",
          questions: balancedPaper1.slice(20, 25)
        },
        sectionD_antonyms: {
          title: "Section D: Antonyms (Opposite in Meaning)",
          questionRange: "Questions 26 to 30",
          questions: balancedPaper1.slice(25, 30)
        }
      },
      questions: balancedPaper1,
      allQuestions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Written Essay, Reading Comprehension, and Literature",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Fully Rewritten, Clean-Room BECE English 2021 successfully updated in Firestore!");
}

seedBeceEnglish2021Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2021:", err);
    process.exit(1);
  });
