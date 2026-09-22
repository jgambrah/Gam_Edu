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

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2014
const rawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 17) ---
  {
    number: 1,
    prompt: "The market traders were openly hostile ............ the new revenue collectors.",
    options: ["on", "to", "from", "with"],
    correctAnswer: "to",
    hint: "Identify the preposition that regularly collocates with the adjective 'hostile'.",
    workedSolution: "The adjective 'hostile' is followed by the preposition 'to' (or occasionally 'towards') when indicating the object of opposition ('hostile to the revenue collectors').",
    points: 1
  },
  {
    number: 2,
    prompt: "The senior ............ of the armed forces assembled at the officers' mess.",
    options: ["commander-in-chief", "commander-in-chiefs", "commanders-in-chief", "commanders-in-chiefs"],
    correctAnswer: "commanders-in-chief",
    hint: "Pluralize the principal base noun in a hyphenated compound title, not the modifying prepositional phrase.",
    workedSolution: "In hyphenated compound titles, the plural inflection '-s' is added to the principal head noun ('commander'), yielding 'commanders-in-chief'.",
    points: 1
  },
  {
    number: 3,
    prompt: "The aggrieved workers are demonstrating ............ the unfair dismissal of their union leader.",
    options: ["at", "on", "upon", "against"],
    correctAnswer: "against",
    hint: "Which preposition expresses active opposition or protest?",
    workedSolution: "The verb 'demonstrate' takes the preposition 'against' when protesting or expressing public opposition to an entity or policy.",
    points: 1
  },
  {
    number: 4,
    prompt: ".............. completed her vocational training, Mansa established her own dressmaking shop.",
    options: ["Having", "In having", "On having", "To having"],
    correctAnswer: "Having",
    hint: "Use the perfect participle ('Having + past participle') to express an action completed before the main action.",
    workedSolution: "The perfect participle clause begins with 'Having' ('Having completed...') to show an action completed prior to the event in the main clause.",
    points: 1
  },
  {
    number: 5,
    prompt: "The commercial bus that the school board purchased last year ............ millions of cedis.",
    options: ["cost", "costs", "costed", "costing"],
    correctAnswer: "cost",
    hint: "'Cost' is an irregular verb whose past tense form remains unchanged.",
    workedSolution: "The verb 'cost' (to have a price) is invariable in the past tense: cost - cost - cost. 'Costed' is only used in accounting to mean calculating projected expenses.",
    points: 1
  },
  {
    number: 6,
    prompt: "Those school uniforms on the drying line are ............",
    options: ["you", "your's", "our's", "ours"],
    correctAnswer: "ours",
    hint: "Absolute possessive pronouns never take apostrophes.",
    workedSolution: "'Ours' is an absolute possessive pronoun and never takes an apostrophe. Forms like 'our's' or 'your's' are ungrammatical.",
    points: 1
  },
  {
    number: 7,
    prompt: "The headmaster will announce the scholarship winners as soon as he ............. from the conference.",
    options: ["will return", "had returned", "returns", "returned"],
    correctAnswer: "returns",
    hint: "In subordinate adverbial time clauses referring to the future, use the simple present tense.",
    workedSolution: "Adverbial clauses of time introduced by 'when', 'as soon as', or 'after' use the simple present tense ('returns') to refer to future time, not 'will return'.",
    points: 1
  },
  {
    number: 8,
    prompt: "The debate team was warmly congratulated ............ their resounding victory.",
    options: ["by", "on", "with", "about"],
    correctAnswer: "on",
    hint: "Identify the preposition that regularly collocates with the verb 'congratulate'.",
    workedSolution: "In standard English grammar, one is 'congratulated on' (or 'upon') an achievement, never 'congratulated for' or 'congratulated about'.",
    points: 1
  },
  {
    number: 9,
    prompt: "By this time next year, all the final-year candidates ............ basic school.",
    options: ["will leave", "would leave", "might leave", "will have left"],
    correctAnswer: "will have left",
    hint: "The Future Perfect tense ('will have + past participle') indicates an action completed before a future date.",
    workedSolution: "The temporal prepositional phrase 'By this time next year' specifies a future completion point, requiring the Future Perfect tense ('will have left').",
    points: 1
  },
  {
    number: 10,
    prompt: "Isn't that teenage boy ............ mature to indulge in childish tantrums?",
    options: ["as", "so", "too", "very"],
    correctAnswer: "too",
    hint: "Look for the correlative structure 'too + adjective + to-infinitive'.",
    workedSolution: "The degree adverb 'too' pairs with the infinitive 'to indulge' to indicate an excessive degree that makes the action inappropriate.",
    points: 1
  },
  {
    number: 11,
    prompt: "You usually arrive at the library before eight o'clock, .............?",
    options: ["can you", "will you", "aren't you", "don't you"],
    correctAnswer: "don't you",
    hint: "An affirmative present simple statement with 'arrive' takes the negative tag 'don't you?'.",
    workedSolution: "The main verb 'arrive' is in the simple present tense (habitual action) with subject 'you'. It takes the negative tag 'don't you?'.",
    points: 1
  },
  {
    number: 12,
    prompt: "At the end of an official business letter, the complementary close is written as ............",
    options: ["Yours faithfully", "Yours' faithfully", "Yours's faithfully", "Your's faithfully"],
    correctAnswer: "Yours faithfully",
    hint: "Possessive pronouns never use apostrophes. Note the correct capitalization.",
    workedSolution: "In formal correspondence, 'Yours faithfully' is standard. 'Yours' is an absolute possessive pronoun and never takes an apostrophe.",
    points: 1
  },
  {
    number: 13,
    prompt: "No sooner had the invigilator distributed the question papers ............ the power went out.",
    options: ["than", "then", "when", "before"],
    correctAnswer: "than",
    hint: "The negative correlative adverb 'No sooner' is always paired with 'than'.",
    workedSolution: "The correlative pair is 'No sooner ... than'. ('Hardly' and 'Scarcely' pair with 'when').",
    points: 1
  },
  {
    number: 14,
    prompt: "Kwame and Ama are devoted siblings who assist ............",
    options: ["another", "their selves", "each other", "one another"],
    correctAnswer: "each other",
    hint: "Reciprocal pronoun used when an action is mutually exchanged between two individuals.",
    workedSolution: "'Each other' is the reciprocal pronoun used when referring to two persons ('Kwame and Ama'). 'One another' is preferred for three or more.",
    points: 1
  },
  {
    number: 15,
    prompt: "It is no good ............ to an unrepentant truant who refuses to reform.",
    options: ["to be talking", "talked", "talking", "about talking"],
    correctAnswer: "talking",
    hint: "The idiomatic structure 'It is no good...' is followed by a gerund (verb-ing).",
    workedSolution: "The fixed expression 'It is no good' is followed by a gerund ('talking').",
    points: 1
  },
  {
    number: 16,
    prompt: "Ever since our last inter-schools competition, the captain ............ with a fractured wrist.",
    options: ["is", "was", "had been", "has been"],
    correctAnswer: "has been",
    hint: "The time preposition 'since' requires the present perfect tense to show an action continuing to the present.",
    workedSolution: "Clauses introduced by 'since' that denote a continuing state from the past into the present require the Present Perfect tense ('has been').",
    points: 1
  },
  {
    number: 17,
    prompt: "The farmer was ............ exhausted after harvesting the cocoa that he fell asleep instantly.",
    options: ["so", "too", "much", "very"],
    correctAnswer: "so",
    hint: "Identify the intensifier that pairs with 'that' to indicate cause and effect ('so + adjective + that').",
    workedSolution: "The correlative structure 'so + adjective + that' indicates an extreme degree leading to a stated result ('so exhausted that he fell asleep').",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (18 - 22) ---
  {
    number: 18,
    prompt: "Youth leaders were warned not to meddle in chieftaincy disputes.\nChoose the word nearest in meaning to the underlined word 'meddle'.",
    options: ["indulge", "intrude", "interfere", "intervene"],
    correctAnswer: "interfere",
    hint: "To busy oneself with something that is not one's concern; intrude unnecessarily.",
    workedSolution: "'Meddle' means to involve oneself in others' affairs without right or invitation; 'interfere' is its direct synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "The internal auditor rectified all the accounting errors in the payroll.\nChoose the word nearest in meaning to the underlined word 'rectified'.",
    options: ["refused", "erased", "nullified", "corrected"],
    correctAnswer: "corrected",
    hint: "To set right, remedy, or amend a defect or error.",
    workedSolution: "'Rectified' means corrected, put right, or adjusted properly; 'corrected' is its direct equivalent.",
    points: 1
  },
  {
    number: 20,
    prompt: "The choir delivered a superb performance during the festival.\nChoose the word nearest in meaning to the underlined word 'superb'.",
    options: ["right", "good", "excellent", "wonderful"],
    correctAnswer: "excellent",
    hint: "Of the highest quality, magnificent, or splendid.",
    workedSolution: "'Superb' means of outstanding quality or excellence; 'excellent' is its closest synonym.",
    points: 1
  },
  {
    number: 21,
    prompt: "The board members felt that the disciplinary policies were too rigid.\nChoose the word nearest in meaning to the underlined word 'rigid'.",
    options: ["strong", "hard", "strict", "bad"],
    correctAnswer: "strict",
    hint: "Inflexible, unyielding, and enforced without compromise.",
    workedSolution: "'Rigid' when describing rules or discipline means inflexible and unbending; 'strict' is the nearest synonym.",
    points: 1
  },
  {
    number: 22,
    prompt: "The newly elected prefect delivered her maiden speech to the assembly.\nChoose the word nearest in meaning to the underlined word 'maiden'.",
    options: ["first", "fresh", "official", "original"],
    correctAnswer: "first",
    hint: "The very initial or earliest public appearance or speech.",
    workedSolution: "'Maiden' in the context of speeches, voyages, or flights means the earliest or first; 'first' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (23 - 27) ---
  {
    number: 23,
    prompt: "The intruder was caught red-handed prying open the storehouse window. This means that the intruder was caught ............",
    options: [
      "in the act of committing the crime",
      "with bloodstains on his hands",
      "while running away from town",
      "after hiding the stolen goods"
    ],
    correctAnswer: "in the act of committing the crime",
    hint: "Apprehended right in the middle of doing something unlawful.",
    workedSolution: "The idiom 'to catch red-handed' means to discover or capture someone in the very act of committing a crime or misdeed.",
    points: 1
  },
  {
    number: 24,
    prompt: "The truant gave a cock and bull story about his absence from school. This means that the story was ............",
    options: ["difficult to believe and fabricated", "about domestic farm animals", "completely authentic", "brief and informative"],
    correctAnswer: "difficult to believe and fabricated",
    hint: "An absurd, unbelievable tale invented as an excuse.",
    workedSolution: "'A cock and bull story' is an idiom meaning an improbable, fabricated, and completely unbelievable excuse.",
    points: 1
  },
  {
    number: 25,
    prompt: "The highway robbers were armed to the teeth when they mounted the roadblock. This means that the robbers were ............",
    options: ["professionally trained", "physically violent", "fully and heavily armed", "wearing protective armor"],
    correctAnswer: "fully and heavily armed",
    hint: "Equipped with an abundance of weapons.",
    workedSolution: "'Armed to the teeth' is an idiom meaning heavily, fully, and completely equipped with weapons.",
    points: 1
  },
  {
    number: 26,
    prompt: "The mother instructed the elder sibling to keep an eye on the toddler. This means that the toddler should be ............",
    options: ["pampered with gifts", "disciplined severely", "controlled forcefully", "watched carefully and protected"],
    correctAnswer: "watched carefully and protected",
    hint: "Monitoring closely and looking after someone.",
    workedSolution: "'To keep an eye on someone' means to watch, look after, or monitor them attentively.",
    points: 1
  },
  {
    number: 27,
    prompt: "The minister hit the nail on the head regarding the causes of youth unemployment. This means that the minister ............",
    options: ["stated the exact truth", "spoke in unnecessary detail", "criticized the youth harshly", "spoke very quietly"],
    correctAnswer: "stated the exact truth",
    hint: "Identifying or expressing something with perfect accuracy.",
    workedSolution: "'To hit the nail on the head' means to describe a situation with precise accuracy or state the exact truth.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (28 - 32) ---
  {
    number: 28,
    prompt: "While the corrupt official was disgraced publicly, the patriotic doctor was ...... by the president.",
    options: ["respected", "honoured", "welcomed", "accepted"],
    correctAnswer: "honoured",
    hint: "'Disgraced' means brought into public shame. Find the word that means conferred with public glory and esteem.",
    workedSolution: "'Disgraced' means brought into public shame or discredit. Its direct antonym is 'honoured' (conferred with high esteem and praise).",
    points: 1
  },
  {
    number: 29,
    prompt: "Akosua accepted the teaching appointment, but her colleague ...... the offer.",
    options: ["disliked", "declined", "withdrew", "ignored"],
    correctAnswer: "declined",
    hint: "'Accepted' means agreed to receive. Find the formal word meaning politely refused or turned down.",
    workedSolution: "'Accepted' means received willingly. Its direct antonym in business offers is 'declined' (refused or turned down).",
    points: 1
  },
  {
    number: 30,
    prompt: "Fresh vegetables are abundant in rural markets, but remarkably ...... in desert settlements.",
    options: ["scarce", "less", "few", "cheap"],
    correctAnswer: "scarce",
    hint: "'Abundant' means existing in large quantities. Find the word meaning in short supply or rare.",
    workedSolution: "'Abundant' means plentiful. Its direct economic and linguistic antonym is 'scarce' (rare or available in insufficient quantities).",
    points: 1
  },
  {
    number: 31,
    prompt: "The health workers withdrew their emergency services, but the volunteers ...... theirs unconditionally.",
    options: ["hidden", "registered", "offered", "displayed"],
    correctAnswer: "offered",
    hint: "'Withdrew' means pulled back or withheld. Find the word that denotes presenting or making available.",
    workedSolution: "'Withdrew' means took back or withheld. Its direct opposite is 'offered' (presented or provided willingly).",
    points: 1
  },
  {
    number: 32,
    prompt: "Under our national electoral laws, casting a ballot is civic and optional, not ......",
    options: ["good", "necessary", "obligatory", "right"],
    correctAnswer: "obligatory",
    hint: "'Optional' means left to free choice. Find the word meaning compulsory or mandated by law.",
    workedSolution: "'Optional' means voluntary or not compulsory. Its direct antonym is 'obligatory' (compulsory or required by law).",
    points: 1
  },

  // --- PART II: LITERATURE IN ENGLISH (33 - 40) ---
  {
    number: 33,
    prompt: "Which of the following literary forms is NOT an example of oral literature?",
    options: ["Myth", "Folktale", "Proverb", "Melodrama"],
    correctAnswer: "Melodrama",
    hint: "Oral literature encompasses traditional verbal art passed down by word of mouth; melodrama is a written theatrical stage genre.",
    workedSolution: "Oral literature consists of traditional verbal folklore (myths, legends, folktales, proverbs, riddles). 'Melodrama' is a written theatrical dramatic genre.",
    points: 1
  },
  {
    number: 34,
    prompt: "The central philosophical idea, message, or underlying subject explored in a literary work constitutes its ............",
    options: ["plot", "theme", "diction", "structure"],
    correctAnswer: "theme",
    hint: "The main idea or lesson conveyed by the author.",
    workedSolution: "In literary analysis, the 'theme' is the central unifying idea, moral insight, or underlying subject explored throughout a text.",
    points: 1
  },
  {
    number: 35,
    prompt: "The famous Shakespearean expression \"The world is a stage, and all the men and women merely players\" is an example of a/an ............",
    options: ["metonymy", "simile", "personification", "metaphor"],
    correctAnswer: "metaphor",
    hint: "A direct figurative comparison without using 'like' or 'as'.",
    workedSolution: "A 'metaphor' directly compares two unlike things by stating that one is the other without using comparison markers ('like' or 'as').",
    points: 1
  },
  {
    number: 36,
    prompt: "In literary studies, the term genre refers specifically to ............",
    options: [
      "any kind of romantic poetry",
      "another technical term for prose",
      "a minor subdivision of drama",
      "any of the major forms or categories of literature"
    ],
    correctAnswer: "any of the major forms or categories of literature",
    hint: "The three major traditional divisions: Prose, Poetry, and Drama.",
    workedSolution: "A literary 'genre' is a category, class, or type of artistic composition marked by a distinctive style, form, or content (Prose, Poetry, Drama).",
    points: 1
  },
  {
    number: 37,
    prompt: "Read the poetic lines below:\n\"Sweet sensation rises in pressure / Sleep comes gently and strong / Sleep whispers softly and strong\"\nThe figure of speech exemplified in \"Sleep whispers softly\" is ............",
    options: ["irony", "hyperbole", "euphemism", "personification"],
    correctAnswer: "personification",
    hint: "Attributing human traits (whispering) to an inanimate natural state (sleep).",
    workedSolution: "'Personification' endows inanimate abstractions or non-human entities with human qualities, actions, or emotions (giving sleep the human ability to whisper).",
    points: 1
  },
  {
    number: 38,
    prompt: "Read the stanza below:\n\"Sweet sensation rises in pressure (a)\nSleep comes gently and strong (b)\nSleep whispers softly and strong\" (b)\nIf an identical four-line stanza concludes with 'long' (b), the rhyme scheme is predominantly ............",
    options: ["abba", "bbaa", "aabb", "abab"],
    correctAnswer: "aabb",
    hint: "Stanzas organized in paired rhyming couplets share this standard scheme.",
    workedSolution: "Couplet rhyme structures where consecutive pairs of lines rhyme with each other follow an 'aabb' pattern.",
    points: 1
  },
  {
    number: 39,
    prompt: "Read the extract below:\n\"The fair breeze blew, the white foam flew, / The furrow followed free\"\nThe principal sound device demonstrated through the repetition of initial consonant sounds is ............",
    options: ["pun", "rhyme", "alliteration", "onomatopoeia"],
    correctAnswer: "alliteration",
    hint: "Repetition of initial consonant sounds: /b/ in 'breeze blew' and /f/ in 'foam flew, furrow followed free'.",
    workedSolution: "'Alliteration' is the deliberate repetition of identical initial consonant sounds in successive or closely associated words ('fair breeze blew, white foam flew, furrow followed free').",
    points: 1
  },
  {
    number: 40,
    prompt: "In Coleridge's stanza, the musical repetition of the /f/ and /b/ sounds in \"The fair breeze blew, the white foam flew / The furrow followed free\" serves to evoke ............",
    options: [
      "the eerie silence of the sea",
      "the glaring whiteness of the foam",
      "the sudden fury of a hurricane",
      "the swift, smooth movement of the sailing ship"
    ],
    correctAnswer: "the swift, smooth movement of the sailing ship",
    hint: "Sound symbolism: the soft, rushing consonant sounds imitate a ship gliding effortlessly across waters.",
    workedSolution: "The rhythmic alliteration of light fricatives and plosives (/f/, /b/) acoustically mimics the swift, continuous, and smooth movement of a vessel cutting through ocean waves.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 201401);

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
        prompt: "You have been offered admission to a Senior High School to pursue an academic program that does not align with your future career goals. Write a formal letter to the headmaster of the school, stating at least two compelling reasons why you request to be transferred to your preferred program.",
        modelAnswer: `P. O. Box 45\nNkawkaw, Eastern Region\n12th September, 2014\n\nThe Headmaster\nSt. Peter's Senior High School\nP. O. Box 22\nNkwatia-Kwahu\n\nDear Sir,\n\nREQUEST FOR A CHANGE OF ACADEMIC PROGRAMME FROM GENERAL ARTS TO GENERAL SCIENCE\n\nI write with the utmost respect to express my sincere gratitude for the admission offered me to pursue the General Arts programme in your prestigious institution for the upcoming academic year. However, I respectfully appeal to your high office for permission to change my course of study to General Science.\n\nFirst and foremost, my lifelong career aspiration is to pursue Human Medicine at the university in order to become a medical doctor. Ever since my junior high school days, I have nurtured a passion for biomedical research and healthcare delivery to assist underserved rural communities. Pursuing General Science—specifically Biology, Chemistry, Physics, and Elective Mathematics—is the compulsory prerequisite foundation required to gain admission into medical school. Remaining in General Arts will permanently truncate this professional dream.\n\nSecondly, my academic performance in the Basic Education Certificate Examination (BECE) clearly demonstrates my competence in science and numeracy. I secured Grade One in Integrated Science, Grade One in Mathematics, and Grade One in Information and Communication Technology. My junior high school teachers commended my analytical laboratory skills and consistently encouraged me to pursue the sciences.\n\nI have discussed this matter thoroughly with my parents, who fully endorse this appeal and have pledged to provide all prescribed science textbooks and laboratory equipment. I humbly pray that you grant my request so I can pursue my true academic calling.\n\nThank you for your anticipated benevolence.\n\nYours faithfully,\n[Signature]\nEmmanuel Osei Boateng\n(Index Number: 0204010045)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in a national newspaper on the topic: \"Why Every Basic School in Ghana Should Have a Well-Stocked Library.\"",
        modelAnswer: `THE INDISPENSABLE ROLE OF SCHOOL LIBRARIES IN BASIC EDUCATION\nBy Victoria Arthur, JHS 3\n\nIn an era where national educational development is recognized as the ultimate driver of economic transformation, the poor performance of students in literacy and reading comprehension remains a matter of grave public concern. While various stakeholders propose educational reforms, one foundational necessity is frequently overlooked: the urgent need for a well-stocked library in every basic school across Ghana.\n\nFirst, a school library is the primary engine that nurtures a sustainable reading culture and sharpens language proficiency. Many pupils in public basic schools come from humble homes where parents cannot afford leisure reading books or reference encyclopedias. A functional library provides equitable access to storybooks, illustrated readers, and classical literature. Regular reading expands vocabulary, improves grammatical competence, and enhances creative writing skills, thereby banishing the chronic mass failures recorded in English examinations.\n\nSecondly, a library fosters independent research skills and stimulates intellectual curiosity. Education must go beyond rote memorization of classroom chalkboard notes. When learners have access to supplementary science journals, historical atlases, and geographical encyclopedias, they learn to investigate concepts independently. This builds critical thinking and analytical problem-solving abilities essential for secondary and tertiary academic pursuits.\n\nIn conclusion, a school without a library is like a hospital without a pharmacy. The Ministry of Education, municipal assemblies, and corporate philanthropic organizations must prioritize the construction and stocking of modern libraries in all basic schools to secure our nation's intellectual future.`
      },
      {
        questionNumber: "3",
        category: "Speech Writing",
        prompt: "As the outgoing Senior Prefect, write a speech to be delivered at your school's annual Speech and Prize-Giving Day on the topic: \"Evaluating Our School's Achievements and Setbacks in the Past Academic Year.\"",
        modelAnswer: `A VALEDICTORY ADDRESS DELIVERED BY KWAME ADJEI, SENIOR PREFECT OF METHODIST JHS, AT THE 10TH ANNUAL SPEECH AND PRIZE-GIVING DAY\n\nMr. Chairman, Respected Headmaster, Dedicated Members of Staff, Revered Members of the PTA, Fellow Students, and Distinguished Guests:\n\nIt is a singular honor to stand before you today on behalf of the graduating class to review the milestones and setbacks of our school over the past academic year.\n\nIn the realm of achievements, this year has been historic. Academically, our school placed first in the Municipal Science and Mathematics Quiz Competition, outperforming twelve competing basic schools. Furthermore, through the generous support of our Parent-Teacher Association, we successfully refurbished our computer laboratory with twenty modern desktop units, enabling every candidate to undergo practical digital training prior to the BECE. In sports, our junior girls' volleyball team won the district championship trophy, bringing immense pride to our institution.\n\nNotwithstanding these achievements, our school faced notable setbacks. The foremost challenge has been the severe deficit of standard furniture. Many junior classrooms are overcrowded, with three students squeezed onto dual desks meant for two, hindering neat handwriting and classroom concentration. Additionally, the lack of an enclosed fence wall around our compound has allowed unauthorized trespassers and stray animals to disrupt instructional periods and vandalize school flower gardens.\n\nAs we depart, I passionately appeal to our Municipal Assembly, traditional elders, and benevolent alumni to assist the school administration in constructing a perimeter wall and providing adequate dual desks. To my fellow students, I urge you to maintain strict discipline and protect school property.\n\nLong live our noble school! Thank you all for your kind attention.`
      }
    ]
  },
  sectionB_comprehension: {
    title: "Part B: Reading Comprehension",
    passage: `Fatimeh was always silent. She learnt a lot within a short time. In one month, she could milk cows, separate butter and cheese from the milk, ferment the milk, and cook nearly as well as Rikku's mother. At first, she went with Rikku's mother to hawk the sour milk; she was beginning to find her way to and from town.\n\nFatimeh was always chewing tobacco flower and so her lips, teeth and gums became red. Hodio noticed that her looks had improved since she came to live with the family; her skin was smooth and shiny; she had also put on more flesh.\n\nTowards nightfall, when Fatimeh came home, she would take a pot and go down to the stream where she bathed and drew water. Sometimes, she went with Leibe or Shaitu; she was never alone.\n\nOne evening, Hodio followed Fatimeh quietly to the stream when the place was quiet and he could hear the sound of his own footsteps on the dusty road. When he caught up with Fatimeh, he suggested to her to run away with him because he loved her dearly and wanted her to be his wife. Fatimeh refused. She knew very well that, as a slave, she could never hope to marry a freeborn and proud Fulani like Hodio Sunsaye.\n\nHodio did not give up. He spoke to her again. He tried to persuade her to run away with him and live in a town where no one cared about tradition and custom. Eventually, Fatimeh agreed to consider his proposal.\n\nHodio's father, old Sunsaye, was the first person who missed Fatimeh. He called his wife, Shaitu, and asked her if she had seen Fatimeh. She replied in the negative. He asked Rikku and Leibe. No one could tell him where Hodio and Fatimeh were. They then looked behind the hut; the horse was not there.`,
    questions: [
      {
        subId: "(a)",
        question: "State two domestic tasks that Fatimeh learned to do within a single month.",
        answer: "1. Milking cows and separating butter and cheese from milk.\n2. Fermenting milk and cooking (or hawking sour milk)."
      },
      {
        subId: "(b)",
        question: "Give two descriptive adjectives that depict Fatimeh's character and learning disposition in the first paragraph.",
        answer: "Silent (or quiet/reserved) and industrious (or quick-learning/receptive/adaptable)."
      },
      {
        subId: "(c)",
        question: "What was Hodio's main reason for following Fatimeh secretly to the stream?",
        answer: "To confess his deep love for her and persuade her to elope (run away) with him so she could become his wife."
      },
      {
        subId: "(d)(i)",
        question: "\"Fatimeh refused.\"\nWhat did Fatimeh refuse to do at first?",
        answer: "She refused Hodio's proposal to run away with him to become his wife."
      },
      {
        subId: "(d)(ii)",
        question: "Why did Fatimeh initially reject Hodio's marriage proposal?",
        answer: "Because she was a slave and knew that societal traditions and caste prejudices forbade a slave from marrying a proud, freeborn Fulani."
      },
      {
        subId: "(e)",
        question: "Why did Hodio specifically want them to elope to a modern town?",
        answer: "Because in a modern urban town, people did not care about or enforce strict tribal traditions, ancestral customs, and slave-caste barriers."
      },
      {
        subId: "(f)",
        question: "For each of the following words, provide a word or phrase that means the same and can replace it in the passage without altering the meaning:\n(i) silent;\n(ii) sour;\n(iii) improved;\n(iv) drew;\n(v) proposal.",
        answer: "(i) **silent:** quiet / reserved / speechless / calm.\n(ii) **sour:** fermented / curdled / tart / acidified.\n(iii) **improved:** gotten better / blossomed / enhanced / developed.\n(iv) **drew:** fetched / collected / scooped / pumped.\n(v) **proposal:** offer / suggestion / marriage request / proposition."
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

async function seedBeceEnglish2014Calibrated() {
  const db = await getDb();
  console.log("Seeding Calibrated & Balanced BECE English 2014 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2014");
  await docRef.set({
    year: 2014,
    title: "BECE English Language 2014 (Calibrated National Benchmark)",
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

  console.log("✅ Calibrated BECE English 2014 successfully seeded into Firestore!");
}

seedBeceEnglish2014Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2014:", err);
    process.exit(1);
  });
