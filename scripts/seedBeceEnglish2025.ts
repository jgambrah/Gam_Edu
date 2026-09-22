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

// ==========================================
// PAPER 1: OBJECTIVE TEST (40 QUESTIONS)
// ==========================================
const paper1Questions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "Our dog ...... barking since the stranger entered the house.",
    options: ["has been", "is", "was", "would be"],
    correctAnswer: "has been",
    hint: "Notice the time word 'since'. It shows an action that started in the past and is still happening right now.",
    workedSolution: "We use the Present Perfect Continuous tense ('has been' + verb-ing) with the time marker 'since' to show an action that began in the past and continues into the present.",
    points: 1
  },
  {
    number: 2,
    prompt: "Enrolment has increased ...... the new classroom was built.",
    options: ["since", "until", "when", "while"],
    correctAnswer: "since",
    hint: "Choose the conjunction used to point back to the specific time a past event occurred.",
    workedSolution: "'Since' connects a present result ('enrolment has increased') back to a specific starting point in the past ('the new classroom was built').",
    points: 1
  },
  {
    number: 3,
    prompt: "To ...... did you deliver the message?",
    options: ["who", "whoever", "whom", "whomever"],
    correctAnswer: "whom",
    hint: "When a pronoun comes directly after a preposition like 'to', 'for', or 'with', it takes its object form.",
    workedSolution: "'Whom' is the objective pronoun used following prepositions (e.g., 'to whom', 'with whom', 'for whom'). 'Who' is used as a subject.",
    points: 1
  },
  {
    number: 4,
    prompt: "Put the books on the shelf, ......?",
    options: ["do you", "have you", "will you", "may you"],
    correctAnswer: "will you",
    hint: "For polite commands or requests (imperative sentences), the standard question tag asks for willingness.",
    workedSolution: "Imperative sentences (commands or requests) take 'will you?' (or 'won't you?') as their correct question tag.",
    points: 1
  },
  {
    number: 5,
    prompt: "Amina prepared a delicious meal for her ......",
    options: ["sisters-in-law", "sister's-in-law", "sisters-in-laws", "sisters'-in-law"],
    correctAnswer: "sisters-in-law",
    hint: "To make a compound noun with hyphens plural, add 's' to the main head word, not the prepositional ending.",
    workedSolution: "In compound nouns joined by hyphens, the primary noun ('sister') takes the plural 's'. Thus, 'sisters-in-law' is the correct plural form.",
    points: 1
  },
  {
    number: 6,
    prompt: "We always ...... the lights before going to bed.",
    options: ["off", "put off", "put out", "out"],
    correctAnswer: "put out",
    hint: "'Off' is not a verb. To extinguish or turn off a light, we use the proper phrasal verb.",
    workedSolution: "'Put out' means to extinguish a light or a fire. 'Put off' means to postpone or delay an event.",
    points: 1
  },
  {
    number: 7,
    prompt: "We saw ...... people in the room.",
    options: ["a little", "much", "plenty", "many"],
    correctAnswer: "many",
    hint: "'People' is a countable plural noun. Choose the quantifier that goes with countable plural nouns.",
    workedSolution: "'Many' is used with countable plural nouns ('people'). 'Much' and 'a little' are used with uncountable nouns, while 'plenty' needs 'of' ('plenty of people').",
    points: 1
  },
  {
    number: 8,
    prompt: "The laptop is ...... than the other two.",
    options: ["expensive more rather", "expensive rather more", "more expensive rather", "rather more expensive"],
    correctAnswer: "rather more expensive",
    hint: "The qualifying adverb 'rather' comes before the comparative marker 'more'.",
    workedSolution: "The modifying adverb 'rather' correctly precedes the comparative adjective phrase 'more expensive'.",
    points: 1
  },
  {
    number: 9,
    prompt: "The gardener was ..... old to work.",
    options: ["even", "so", "too", "very"],
    correctAnswer: "too",
    hint: "Look for the pattern 'too ... to [verb]', which means an extreme degree prevents an action.",
    workedSolution: "The correlative structure 'too + adjective + to + infinitive' expresses a negative outcome (the gardener was so old that he could not work).",
    points: 1
  },
  {
    number: 10,
    prompt: "The coach advised the two players to cooperate with ......",
    options: ["each other", "each one", "ourselves", "themselves"],
    correctAnswer: "each other",
    hint: "We use 'each other' for two people and 'one another' for more than two.",
    workedSolution: "'Each other' is the reciprocal pronoun used when referring to two individuals. 'One another' is preferred for three or more.",
    points: 1
  },
  {
    number: 11,
    prompt: "If it rained, the farmer ...... his seeds.",
    options: ["will have sowed", "will sow", "would have sowed", "would sow"],
    correctAnswer: "would sow",
    hint: "This is a Conditional Type 2 sentence: 'If + simple past verb', then 'would + base verb'.",
    workedSolution: "The condition 'If it rained' is in the simple past tense. A Second Conditional sentence completes its main clause with 'would + base verb' ('would sow').",
    points: 1
  },
  {
    number: 12,
    prompt: "Although there were ten beautiful bags in the shop, Sandra liked ...... of them.",
    options: ["both", "each", "neither", "none"],
    correctAnswer: "none",
    hint: "'Both' and 'neither' are strictly for two items. For three or more items, choose the negative word.",
    workedSolution: "Because there were ten bags (more than two), we use 'none' to show that not a single one was chosen. 'Neither' applies only when choosing between two items.",
    points: 1
  },
  {
    number: 13,
    prompt: "Selfish people always consider ...... first.",
    options: ["herself", "myself", "ourselves", "themselves"],
    correctAnswer: "themselves",
    hint: "The subject 'Selfish people' is third person plural (they). Match it with the right reflexive pronoun.",
    workedSolution: "The subject 'Selfish people' is plural. The matching reflexive pronoun for 'they/people' is 'themselves'.",
    points: 1
  },
  {
    number: 14,
    prompt: "Amarh asked Tettey, \"did you see the new student yesterday?\"\nAmarh asked Tettey ......",
    options: [
      "did he see the new student the previous day",
      "whether he saw the new student yesterday",
      "if he had seen the new student the previous day",
      "if he had seen the new student yesterday"
    ],
    correctAnswer: "if he had seen the new student the previous day",
    hint: "In reported questions, simple past ('did you see') changes to past perfect ('had seen'), and 'yesterday' changes to 'the previous day'.",
    workedSolution: "When changing yes/no questions into reported speech: (1) Use 'if' or 'whether', (2) Change simple past 'did you see' to past perfect 'had seen', and (3) Change the time word 'yesterday' to 'the previous day' or 'the day before'.",
    points: 1
  },
  {
    number: 15,
    prompt: "Had they completed the project before the deadline?\n...... the project been completed by them before the deadline?",
    options: ["Were", "Has", "Had", "Was"],
    correctAnswer: "Had",
    hint: "When turning past perfect ('Had they completed') into passive voice, keep the auxiliary verb 'Had'.",
    workedSolution: "Past perfect questions in the passive voice follow the structure: 'Had + object + been + past participle'. Thus, 'Had the project been completed...' is correct.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "His dubious attitude has made him lose all his good friends.\nChoose the word nearest in meaning to the underlined word 'dubious'.",
    options: ["deceitful", "disrespectful", "untrue", "unforgiving"],
    correctAnswer: "deceitful",
    hint: "A dubious person is dishonest and cannot be trusted.",
    workedSolution: "'Dubious' means dishonest, suspicious, or untrustworthy. Therefore, 'deceitful' is the closest in meaning.",
    points: 1
  },
  {
    number: 17,
    prompt: "The boy's account of the incident was elaborate.\nChoose the word nearest in meaning to the underlined word 'elaborate'.",
    options: ["clear.", "detailed.", "interesting.", "realistic."],
    correctAnswer: "detailed.",
    hint: "An elaborate story gives every single step and small point.",
    workedSolution: "'Elaborate' means containing many well-explained parts or thorough specifics. Hence, 'detailed' is the nearest synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "Nobody paid any attention to the workers' demands.\nChoose the word nearest in meaning to the underlined word 'demands'.",
    options: ["agitations.", "complaints.", "objections.", "requests."],
    correctAnswer: "requests.",
    hint: "Demands are claims or things people ask for firmly.",
    workedSolution: "In this context, 'demands' refers to the formal terms or claims put forward by workers to their employers, making 'requests' the nearest synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "It was forecast that there would be thunderstorm in the evening.\nChoose the word nearest in meaning to the underlined word 'forecast'.",
    options: ["broadcast", "calculated", "observed", "predicted"],
    correctAnswer: "predicted",
    hint: "To forecast the weather means to tell what will happen in the future.",
    workedSolution: "'Forecast' means to state beforehand what is expected to happen based on present signs; its synonym is 'predicted'.",
    points: 1
  },
  {
    number: 20,
    prompt: "Paul purposely left the door open.\nChoose the word nearest in meaning to the underlined word 'purposely'.",
    options: ["carelessly", "hurriedly", "intentionally", "occasionally"],
    correctAnswer: "intentionally",
    hint: "Doing something with clear intent, not by accident.",
    workedSolution: "'Purposely' means done on purpose or deliberate. The closest word is 'intentionally'.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "On seeing the angry mob approaching the school, our school prefect told us to take to our heels. This means that the prefect told us to ......",
    options: ["hurry up", "join them", "run away", "walk gracefully"],
    correctAnswer: "run away",
    hint: "Think about what people do when danger appears suddenly.",
    workedSolution: "The idiom 'to take to one's heels' means to turn and run away swiftly from danger or trouble.",
    points: 1
  },
  {
    number: 22,
    prompt: "The two boys have often been at loggerheads with each other. This means that they ......",
    options: [
      "are usually seen walking together",
      "have often exchanged ideas",
      "have often had strong disagreements",
      "usually have the same views on issues"
    ],
    correctAnswer: "have often had strong disagreements",
    hint: "When two people are at loggerheads, they cannot agree on anything.",
    workedSolution: "The idiomatic expression 'at loggerheads' describes two people who are in direct conflict, quarreling or having strong disagreements.",
    points: 1
  },
  {
    number: 23,
    prompt: "I learnt to paddle my own canoe. This means that I ......",
    options: [
      "am independent and need no help from others",
      "do not interfere in other people's matters",
      "have no help in my fishing business",
      "work hard to feed myself and my family"
    ],
    correctAnswer: "am independent and need no help from others",
    hint: "Paddling your own canoe means taking control of your own life by yourself.",
    workedSolution: "'To paddle one's own canoe' means to act independently, rely on one's own efforts, and manage without depending on others.",
    points: 1
  },
  {
    number: 24,
    prompt: "She tried to throw dust in our eyes. This means that she tried to ......",
    options: ["cheat us", "deceive us", "fight us", "make us blind"],
    correctAnswer: "deceive us",
    hint: "Throwing dust in someone's eyes prevents them from seeing the real truth.",
    workedSolution: "The idiom 'to throw dust in someone's eyes' means to mislead, trick, or deceive someone to keep them from discovering the truth.",
    points: 1
  },
  {
    number: 25,
    prompt: "Aminu is full of himself. This means that Aminu is ......",
    options: ["arrogant", "dangerous", "greedy", "quarrelsome"],
    correctAnswer: "arrogant",
    hint: "A person who is full of himself thinks he is better and more important than everyone else.",
    workedSolution: "To be 'full of oneself' means to have an overly high opinion of oneself; being proud, conceited, or arrogant.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "He loves taking hasty decisions so he never makes ...... moves.",
    options: ["calculated", "smart", "delayed", "final"],
    correctAnswer: "calculated",
    hint: "'Hasty' means hurried and careless. Find a word that means well planned and thoughtful.",
    workedSolution: "'Hasty' means rushed and thoughtless. The opposite is 'calculated', which means carefully considered, deliberate, and planned.",
    points: 1
  },
  {
    number: 27,
    prompt: "Though we expected ......, the judge handled the case with partiality.",
    options: ["fairness", "happiness", "patience", "seriousness"],
    correctAnswer: "fairness",
    hint: "'Partiality' means favoring one side unfairly (bias). Look for the word that means treating everyone equally.",
    workedSolution: "'Partiality' means unfair bias or favoritism. Its direct opposite is 'fairness' (impartiality and justice).",
    points: 1
  },
  {
    number: 28,
    prompt: "The policeman was reported to have concealed the evidence, but ...... it to the Jury.",
    options: ["disclosed", "gathered", "found", "planted"],
    correctAnswer: "disclosed",
    hint: "'Concealed' means hid from view. Find the word that means revealed or made known.",
    workedSolution: "'Concealed' means kept secret or hidden. The opposite is 'disclosed', which means revealed or made known publicly.",
    points: 1
  },
  {
    number: 29,
    prompt: "The minister publicly rebukes his assistant and always ...... his secretary.",
    options: ["advises", "commends", "embraces", "harasses"],
    correctAnswer: "commends",
    hint: "'Rebukes' means criticizes sharply or scolds. What is the word for praising someone?",
    workedSolution: "'Rebuke' means to scold or express sharp disapproval. The opposite is 'commend', which means to praise and approve.",
    points: 1
  },
  {
    number: 30,
    prompt: "Those children think their uncle is miserly yet he is ...... to strangers.",
    options: ["friendly", "generous", "strict", "wicked"],
    correctAnswer: "generous",
    hint: "A 'miserly' person hates spending money or sharing. Look for a word that means ready to give freely.",
    workedSolution: "'Miserly' means stingy, tight-fisted, and unwilling to share. The opposite is 'generous', meaning open-handed and willing to give.",
    points: 1
  },

  // --- SECTION E: CLOZE PASSAGE (31 - 35) ---
  {
    number: 31,
    prompt: "Akuba was trained as an accountant. After graduation, she went out to ---31--- employment.",
    options: ["seek", "request", "search", "look"],
    correctAnswer: "seek",
    hint: "In professional English, the formal collocation with 'employment' or 'a job' is to '...... employment'.",
    workedSolution: "The standard formal phrase used in English is 'to seek employment' (meaning to look for a job).",
    points: 1
  },
  {
    number: 32,
    prompt: "She visited several firms but was ---32--- in securing a job.",
    options: ["unlucky", "disappointed", "unfortunate", "unsuccessful"],
    correctAnswer: "unsuccessful",
    hint: "Look at the preposition 'in' that follows the blank: '... was ...... in securing a job'.",
    workedSolution: "The adjective 'unsuccessful' correctly pairs with the preposition 'in' followed by a gerund ('unsuccessful in securing a job').",
    points: 1
  },
  {
    number: 33,
    prompt: "Afiba, her friend, finally advised her to read the newspapers for ---33--- of vacant positions.",
    options: ["advertisements", "announcements", "information", "notices"],
    correctAnswer: "advertisements",
    hint: "Commercial notices published in newspapers inviting job applications are called ......",
    workedSolution: "Open job vacancies printed in newspapers are called 'job advertisements' (or job adverts).",
    points: 1
  },
  {
    number: 34,
    prompt: "Fortunately, a reputable company was looking for a ---34--- accountant who was proficient in financial reporting.",
    options: ["professional", "certified", "skilled", "responsible"],
    correctAnswer: "certified",
    hint: "An accountant who has passed formal qualifying board examinations is a ...... accountant.",
    workedSolution: "In accounting, a fully qualified practitioner recognized by an official professional body is designated as a 'certified' (or chartered) accountant.",
    points: 1
  },
  {
    number: 35,
    prompt: "who was ---35--- in financial reporting. Akuba immediately submitted her application...",
    options: ["proficient", "specialized", "knowledgeable", "competent"],
    correctAnswer: "proficient",
    hint: "Which adjective meaning skilled takes the preposition 'in'?",
    workedSolution: "'Proficient' pairs with the preposition 'in' (e.g., 'proficient in financial reporting') to indicate high skill and expertise.",
    points: 1
  },

  // --- PART B: ORAL LANGUAGE - SPEECH SOUNDS (36 - 40) ---
  {
    number: 36,
    prompt: "She received a beautiful psalm.\nChoose the word that has the same initial consonant sound as the underlined word 'psalm'.",
    options: ["shall", "palm", "sand", "page"],
    correctAnswer: "sand",
    hint: "The letter 'p' in 'psalm' is silent. Say the word aloud: what sound starts it?",
    workedSolution: "In 'psalm', the letter 'p' is silent; the word is pronounced /sɑːm/. It begins with the voiceless alveolar fricative consonant sound /s/, the same initial sound as in 'sand' (/sænd/).",
    points: 1
  },
  {
    number: 37,
    prompt: "The car sped around the curve.\nChoose the word that has the same initial consonant sound as the underlined word 'curve'.",
    options: ["chain", "cell", "ciao", "colonel"],
    correctAnswer: "colonel",
    hint: "The 'c' in 'curve' makes a /k/ sound. Which option also begins with a /k/ sound?",
    workedSolution: "The word 'curve' begins with the voiceless velar plosive /k/. In English, 'colonel' is pronounced /ˈkɜː.nəl/, which also begins with the /k/ sound. ('cell' starts with /s/, 'chain' with /tʃ/).",
    points: 1
  },
  {
    number: 38,
    prompt: "We won the game easily.\nChoose the word that has the same initial consonant sound as the underlined word 'game'.",
    options: ["giant", "general", "gentle", "goat"],
    correctAnswer: "goat",
    hint: "The word 'game' begins with a hard 'g' sound (/ɡ/).",
    workedSolution: "The initial sound in 'game' is the voiced velar plosive /ɡ/. 'Goat' also begins with the hard /ɡ/ sound. ('giant', 'general', and 'gentle' all start with the soft /dʒ/ sound).",
    points: 1
  },
  {
    number: 39,
    prompt: "The city grew quieter with each passing hour.\nChoose the word that has the same vowel sound as the underlined word 'hour'.",
    options: ["bowl", "your", "tour", "owl"],
    correctAnswer: "owl",
    hint: "The 'h' in 'hour' is silent. It begins with the triphthong/diphthong sound /aʊ/.",
    workedSolution: "In 'hour', the letter 'h' is silent and it is pronounced /aʊər/. Its core vowel sound is the /aʊ/ sound, which matches the vowel sound in 'owl' (/aʊl/).",
    points: 1
  },
  {
    number: 40,
    prompt: "The queue moved slowly, yet no one seemed to mind.\nChoose the word that has the same vowel sound as the underlined word 'queue'.",
    options: ["fee", "cool", "quest", "few"],
    correctAnswer: "few",
    hint: "The word 'queue' is pronounced /kjuː/. Match the vowel sound /juː/.",
    workedSolution: "The word 'queue' is pronounced /kjuː/, containing the /juː/ sound. The word 'few' is pronounced /fjuː/, sharing the identical vowel-glide sound.",
    points: 1
  }
];

// ==========================================
// PAPER 2: ESSAY, COMPREHENSION & LITERATURE
// ==========================================
const paper2Content = {
  sectionA_essay: {
    title: "Part A: Writing (Composition)",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Formal Letter",
        prompt: "A new curriculum has been introduced for Junior High Schools, but your school offers only a limited number of subjects. Write a letter to your headteacher suggesting two new subjects that should be taught in your school. Give two reasons for your choices.",
        modelAnswer: `St. Peter's Junior High School\nP. O. Box 45\nNkawkaw, Eastern Region\n15th October, 2025\n\nThe Headteacher\nSt. Peter's Junior High School\nP. O. Box 45\nNkawkaw\n\nDear Sir,\n\nSUGGESTION FOR THE INCLUSION OF COMPUTING AND FRENCH IN OUR SCHOOL CURRICULUM\n\nI write respectfully on behalf of the student body to draw your attention to our current subject offerings under the new Common Core Programme curriculum and to suggest the addition of two vital subjects: Computing and French.\n\nFirst and foremost, I recommend Computing (Information and Communication Technology). We live in a modern digital world where almost every profession requires basic computer literacy. Learning Computing will equip us with essential skills like word processing, internet research, and foundational coding. These skills will not only help us prepare for the BECE practical papers but will also prepare us to compete fairly with students in urban schools.\n\nSecondly, I suggest that our school introduces French. Ghana is surrounded by French-speaking neighboring countries, including Togo, Côte d'Ivoire, and Burkina Faso. Learning French will make our students bilingual, opening up wider trade, educational, and employment opportunities across the West African sub-region in the future. Moreover, being proficient in a second international language broadens our mental horizons and enhances communication.\n\nIn conclusion, offering Computing and French will enrich our academic foundation and prepare us adequately for Senior High School education. I trust that you will consider these recommendations favorably for the benefit of all students.\n\nThank you.\n\nYours faithfully,\n[Signature]\nKwame Mensah\n(School Prefect)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "The government has announced the addition of new public holidays. Write an article to be published in a national newspaper on two effects of public holidays on teaching and learning.",
        modelAnswer: `THE IMPACT OF FREQUENT PUBLIC HOLIDAYS ON BASIC EDUCATION IN GHANA\nBy Akosua Serwaa Boateng, JHS 3\n\nRecently, the government announced the declaration of additional public statutory holidays in the country. While public holidays provide citizens with time to rest, commemorate historical milestones, and enjoy family gatherings, their frequent occurrence has raised serious concerns among educators regarding their impact on school teaching and learning.\n\nThe first noticeable effect is the disruption of instructional time and syllabus coverage. The academic calendar designed by the Ghana Education Service is structured with specific weekly contact hours to allow teachers to finish the curriculum. When holidays fall on school weekdays, teachers lose valuable instructional periods. In subjects like Mathematics, Science, and English where daily practice is essential, these interruptions break the flow of learning, leaving many teachers rushed toward the end of term and unable to cover critical topics before national examinations.\n\nOn the other hand, a positive effect of public holidays is that they offer well-deserved physical and mental rest for both teachers and students. Junior High School life is demanding, with long hours of classwork, co-curricular duties, and continuous assessments. A mid-term holiday relieves mental fatigue and prevents burnout. Students return to the classroom rejuvenated, with renewed energy and better concentration for academic tasks.\n\nIn conclusion, although public holidays afford much-needed rest and foster national unity, the education ministry and school authorities should devise effective make-up schedules to ensure that academic progress is not compromised.`
      },
      {
        questionNumber: "3",
        category: "Narrative Essay",
        prompt: "You once doubted your abilities, but an experience changed your mindset completely. Write your story, ending with the statement, \"I will never compare myself with anyone again.\"",
        modelAnswer: `Growing up in the quiet town of Kibi, I was plagued by self-doubt. My desk mate in Form Two, Daniel, was gifted in Mathematics; he could solve complex algebraic equations in seconds while I struggled through simple arithmetic. Whenever test results were announced, his name was showered with praises while I shrank into my seat, convinced that I was untalented and foolish.\n\nEverything changed during the Inter-Schools Creative Arts and Essay Competition. Our English teacher, Madam Faustina, noticed my quiet love for writing stories and selected me to represent our school. Fear gripped me immediately. I told myself that students from the prestigious regional schools would easily outshine me. On the day of the contest at the district assembly hall, seeing over forty confident contestants almost made me withdraw.\n\nHowever, once the prompt was unveiled on the chalkboard, something clicked inside me. I remembered my grandmother's folktales by the evening fireside. I poured my heart into describing rural life, weaving rich proverbs and vivid imagery onto the lined pages. For two unbroken hours, my pen flowed without looking at anyone else.\n\nA week later, our headmaster announced the results at morning assembly. To my disbelief, I had won first place in the entire municipality, earning a trophy and scholarship books for our library. That memorable victory taught me that everyone possesses a unique gift that blooms at its own time. I walked back to my classroom with newfound dignity and promised myself: I will never compare myself with anyone again.`
      }
    ]
  },
  sectionB_comprehension: {
    title: "Part B: Reading Comprehension",
    passage: `I was twelve years when I came across the words "loyalty" and "decorum". I asked my father to explain them to me. His explanation impressed me so I resolved to make them my hallmarks. I tried to be as good as my words. Anytime I was rude or showed disloyalty to someone, I promptly regretted it. Soon, loyalty and decorum became characteristic of me.\n\nHaving completed Junior High School, my uncle, Gidi, approached my father and requested that I lived with him temporarily as his children were in America in search of greener pastures. With Daddy's consent, I went and stayed with him. However, he refused to let me return to my parents after Senior High School. Why? Daddy impressed on me the value of hardwork so I lived up to expectation.\n\nUncle decided to visit his children for the best part of a year and left his mansion and other properties under the stewardship of Lugu, his security man and me due to the trust he reposed in us. This notwithstanding, Lugu suggested we connive with some miscreants to burgle Uncle Gidi's house and share the proceeds with them. Though he persistently attempted to persuade me, I never bought into that idea. Eventually, he fled the mansion sensing I might expose him as a traitor.\n\nUncle returned and heard about Lugu's plan which I did not succumb to and promised to reward me substantially. However, this never materialized until the unexpected happened. His children returned and told me that when Uncle Gidi was about to go to eternity, he instructed them to reward me with a three-bedroom house and a car. All I said was "oh! loyalty."`,
    questions: [
      {
        subId: "(a)",
        question: "What is the difference between the narrator and Lugu, according to the passage?",
        answer: "The narrator was honest, trustworthy, and loyal to Uncle Gidi, whereas Lugu was dishonest, treacherous, and disloyal."
      },
      {
        subId: "(b)",
        question: "Why didn't the narrator's uncle let him or her go back to his or her parents' house after Senior High School?",
        answer: "Because the narrator was hardworking, dependable, and lived up to the uncle's expectations in managing the household."
      },
      {
        subId: "(c)",
        question: "Why didn't the narrator agree to Lugu's suggestion?",
        answer: "Because the narrator was committed to the values of loyalty and decorum taught by his/her father and refused to betray his uncle's trust."
      },
      {
        subId: "(d)",
        question: "\"Until the unexpected happened\"\nWhat do you think happened?",
        answer: "Uncle Gidi passed away (died)."
      },
      {
        subId: "(e)",
        question: "Explain in your own words the following expressions as used in the passage:\n(i) Be as good as my words;\n(ii) in search of greener pastures;\n(iii) the best part of a year.",
        answer: "(i) **Be as good as my words:** To keep one's promises or live according to one's principles.\n(ii) **in search of greener pastures:** Seeking better living conditions, greater wealth, or better employment opportunities abroad.\n(iii) **the best part of a year:** Most of the year (more than half a year / nearly an entire year)."
      },
      {
        subId: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\n(i) promptly;\n(ii) stewardship;\n(iii) burgle;\n(iv) substantially.",
        answer: "(i) **promptly:** immediately / quickly / instantly.\n(ii) **stewardship:** care / management / custody / supervision.\n(iii) **burgle:** rob / break into / steal from.\n(iv) **substantially:** generously / handsomely / greatly / hugely."
      },
      {
        subId: "(g)",
        question: "In two sentences of not more than ten words each,\n(i) summarize a lesson the narrator learnt based on the last paragraph;\n(ii) give a suitable title to the passage.",
        answer: "(i) **Lesson:** Loyalty brings rich rewards in the end. [7 words]\n(ii) **Title:** The Reward of True Loyalty. [5 words]"
      }
    ]
  },
  sectionC_literature: {
    title: "Part C: Literature in English (The Cockcrow Anthology)",
    instructions: "Answer all questions in this part based on the prescribed texts.",
    questions: [
      {
        subId: "5(a)",
        textSource: "AMA ATAA AIDOO: The Dilemma of a Ghost",
        extract: "Nana: Yes, I am sitting here. So you thought I was dead?\nNo, I am not. Go home, good neighbours and\nsave your tears for my funeral. It cannot be long now ...",
        question: "Who are the good neighbours?",
        answer: "The fellow villagers / members of the Odumna clan of the village of Esikuma who came to sympathize with the family."
      },
      {
        subId: "5(b)",
        textSource: "AMA ATAA AIDOO: The Dilemma of a Ghost",
        extract: "It cannot be long now ...",
        question: "Why does Nana think she will die soon?",
        answer: "Because she is very old, frail, and feels that her life on earth is almost over."
      },
      {
        subId: "5(c)",
        textSource: "AMA ATAA AIDOO: The Dilemma of a Ghost",
        extract: "Nana: Yes, I am sitting here. So you thought I was dead? ...",
        question: "Nana is in a/an ...... mood.",
        answer: "sarcastic / somber / reflective mood."
      },
      {
        subId: "5(d)",
        textSource: "KOBENA EYI ACQUAH: A Wreath of Tears",
        extract: "Your funeral\nwas so quiet, and small-\nalmost too small, it is said\nfor a man your stature\nYou must\nHave preferred it that way",
        question: "This poem is an example of a/an ......",
        answer: "dirge / elegy (a poem of mourning for the dead)."
      },
      {
        subId: "5(e)",
        textSource: "KOBENA EYI ACQUAH: A Wreath of Tears",
        extract: "You must\nHave preferred it that way",
        question: "The above lines show that the dead person was ......",
        answer: "humble / modest / unassuming / a lover of simple, quiet things despite his greatness."
      },
      {
        subId: "5(f)",
        textSource: "EVELYN TOOLEY HUNT: Mama is a Sunrise",
        extract: "When she come slip-footing through the door,\nshe kindles us\nlike lump coal lighted\nand we wake up glowing.\nShe puts a spark even in Papa's eyes\nand turns out all our darkness.",
        question: "The literary device in 'turns out all our darkness' is ......",
        answer: "Metaphor."
      },
      {
        subId: "5(g)",
        textSource: "EVELYN TOOLEY HUNT: Mama is a Sunrise",
        extract: "Mama is a Sunrise",
        question: "'Mama is a Sunrise' is an example of which literary device?",
        answer: "Metaphor (comparing Mama directly to the sunrise without using 'like' or 'as')."
      },
      {
        subId: "5(h)",
        textSource: "ERNEST HEMINGWAY: A Day's Wait",
        extract: "I thought perhaps he was a little light-headed\nand after giving him the prescribed capsules\nat eleven o'clock, I went out for a while.",
        question: "One thing that made Schatz's father think the boy was a little light-headed is ......",
        answer: "The boy stared straight ahead with a strange, detached expression and refused to sleep or relax because he thought he was dying."
      },
      {
        subId: "5(i)",
        textSource: "ERNEST HEMINGWAY: A Day's Wait",
        extract: "I went out for a while.",
        question: "What exactly did the writer do when he \"went out for a while\"?",
        answer: "He went quail hunting in the countryside with his Irish setter dog."
      },
      {
        subId: "5(j)",
        textSource: "ERNEST HEMINGWAY: A Day's Wait",
        extract: "The final resolution of the story...",
        question: "How did Schatz feel at the end of the story?",
        answer: "He felt deeply relieved, though emotionally exhausted and overwhelmed to learn that he was not going to die."
      }
    ]
  }
};

async function seedBeceEnglish2025() {
  const db = await getDb();
  console.log("🚀 Seeding BECE English Language 2025 into global_curriculum/jhs/subjects/english/past_questions/bece_2025...");

  const targetDoc = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2025");
  const now = new Date();

  await targetDoc.set({
    year: 2025,
    title: "BECE English Language 2025 Past Examination",
    subjectId: "english",
    metadata: {
      isPastQuestion: true,
      standard: "NaCCA / WAEC BECE Standard",
      totalMarks: 100,
      totalDurationMinutes: 120,
      paper1Count: paper1Questions.length,
      sectionsPresent: ["Paper 1 (Objectives)", "Paper 2 Part A (Essay)", "Paper 2 Part B (Comprehension)", "Paper 2 Part C (Literature)"],
      status: "calibrated",
      updatedAt: now
    },
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: paper1Questions.length,
      questions: paper1Questions
    },
    paper2: {
      title: "Paper 2: Essay, Comprehension and Literature in English",
      durationMinutes: 75,
      sections: paper2Content
    }
  }, { merge: true });

  console.log("✅ Successfully seeded BECE English 2025 into Firestore!");
}

seedBeceEnglish2025()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed BECE English 2025:", err);
    process.exit(1);
  });
