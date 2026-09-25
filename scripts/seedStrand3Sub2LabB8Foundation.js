const { OAuth2Client } = require('C:\\Users\\DELL\\Documents\\GitHub\\Gam_Edu\\node_modules\\google-auth-library');
const { Firestore } = require('C:\\Users\\DELL\\Documents\\GitHub\\Gam_Edu\\node_modules\\@google-cloud\\firestore');
const auth = require('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');

async function getDb() {
  const account = auth.getGlobalDefaultAccount();
  if (!account || !account.tokens) {
    throw new Error("No default Firebase CLI account tokens found.");
  }
  const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
  const oauthClient = new OAuth2Client();
  oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
  return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });
}

// =========================================================================
// CAPSTONE MULTI-PARAGRAPH PASSAGE (QUESTIONS 51 TO 55)
// Strand 3 Sub-Strand 2 B8 Focus:
// Active to Passive Transpositions, Reported Speech Deictic & Tense Backshifts,
// Conditionals (Type 0, Type 1 & Type 2), and Universal Truth Exemptions
// =========================================================================
const b8SyntaxConcordFoundationCapstonePassage = 
`During the mid-term regional science colloquium held in Kumasi, the head of science convened a demonstration workshop for secondary school teachers and Basic 8 pupils. Standing before the assembly, the instructor announced that clean drinking water was an absolute necessity for community vitality. He conducted a simple thermal experiment, reminding the class that if water reaches one hundred degrees Celsius, it boils. He explained that this invariable physical law is verified by laboratory chemists every day.

While setting up the glass apparatus, the laboratory technician noticed that the solar water distiller was being assembled by the apprentice. The head of science inspected the assembly and remarked that the new bio-filter was purchased by the municipal education directorate last week. He then turned to the candidates and declared that if the school receives adequate funding next term, the science department will procure ten additional electronic microscopes. The pupils clapped enthusiastically upon hearing the encouraging news.

Later in the afternoon, the senior research fellow delivered a guest presentation on environmental conservation. During her address, she cautioned the students that if illegal alluvial mining contaminated the river basin, community well-water would become unusable for domestic chores. The speaker smiled and remarked, "I am visiting your school today to encourage young scientists." The junior reporter for the school newsletter recorded that the speaker said that she was visiting their school that day to encourage young scientists.

At the end of the session, the master of ceremonies reminded the pupils to review the safety protocols before entering the laboratory for future practical experiments. He emphasized that all hazardous chemicals must be stored in secure steel cabinets by the laboratory monitors. In his concluding remarks, the headmaster stated that whenever young learners practice rigorous scientific inquiry, their critical thinking skills develop rapidly.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// =========================================================================
const unique50B8SyntaxConcordFoundationDrills = [
  {
    passage: "The dedicated school gardener prunes the flowering shrubs along the pathway every Monday morning.",
    question: "Choose the correct passive voice transformation of the sentence:",
    options: [
      "The flowering shrubs along the pathway are pruned by the dedicated school gardener every Monday morning.",
      "The flowering shrubs along the pathway were pruned by the dedicated school gardener every Monday morning.",
      "The flowering shrubs along the pathway are being pruned by the dedicated school gardener every Monday morning.",
      "The flowering shrubs along the pathway have been pruned by the dedicated school gardener every Monday morning."
    ],
    answer: "The flowering shrubs along the pathway are pruned by the dedicated school gardener every Monday morning.",
    hint: "Identify the tense of the active verb 'prunes' (Simple Present) and select the corresponding passive auxiliary ('are + V3').",
    solution: "The active verb 'prunes' is in the simple present tense with a plural object ('flowering shrubs'). The passive formula is [Subject + is/are + Past Participle (V3)]: 'are pruned'.",
    target: "Passive Voice: Simple Present Transposition"
  },
  {
    passage: "Kofi said, \"I am writing my terminal English composition today.\"",
    question: "Choose the grammatically correct reported speech transformation:",
    options: [
      "Kofi said that he was writing his terminal English composition that day.",
      "Kofi said that he is writing his terminal English composition today.",
      "Kofi said that he was writing his terminal English composition today.",
      "Kofi said that he had been writing his terminal English composition that day."
    ],
    answer: "Kofi said that he was writing his terminal English composition that day.",
    hint: "Backshift the present continuous verb ('am writing' -> 'was writing') and shift the deictic time adverb ('today' -> 'that day').",
    solution: "In reported speech with a past-tense reporting verb ('said'), Present Continuous backshifts to Past Continuous ('am writing' -> 'was writing'), pronoun 'I' becomes 'he', and the deictic adverb 'today' converts to 'that day'.",
    target: "Reported Speech: Present Continuous & Deixis"
  },
  {
    passage: "If the rain ________ heavily this afternoon, the sports master will postpone the inter-house football match.",
    question: "Choose the grammatically correct verb form to complete the First Conditional clause:",
    options: ["falls", "will fall", "fell", "would fall"],
    answer: "falls",
    hint: "In First Conditional sentences, the if-clause (protasis) must take the Simple Present tense, not 'will'.",
    solution: "Under the First Conditional Protasis Law, conditional clauses cannot take the modal auxiliary 'will' to denote future time. The Simple Present ('falls') is mandatory when paired with 'will postpone'.",
    target: "First Conditional: Protasis Present Tense Law"
  },
  {
    passage: "If you heat block ice above zero degrees Celsius, it ________ into liquid water.",
    question: "Choose the correct verb form for this Zero Conditional scientific truth:",
    options: ["melts", "will melt", "melted", "would melt"],
    answer: "melts",
    hint: "Zero Conditional sentences express invariable scientific laws using Simple Present in both clauses.",
    solution: "Zero Conditionals express universal scientific realities using the formula: IF + Simple Present, ... Simple Present. Therefore, 'melts' is the correct form.",
    target: "Zero Conditional: Universal Scientific Truth"
  },
  {
    passage: "The senior carpenter constructed a sturdy mahogany dining table for the headmaster's residence.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "A sturdy mahogany dining table was constructed by the senior carpenter for the headmaster's residence.",
      "A sturdy mahogany dining table is constructed by the senior carpenter for the headmaster's residence.",
      "A sturdy mahogany dining table had been constructed by the senior carpenter for the headmaster's residence.",
      "A sturdy mahogany dining table was being constructed by the senior carpenter for the headmaster's residence."
    ],
    answer: "A sturdy mahogany dining table was constructed by the senior carpenter for the headmaster's residence.",
    hint: "The active verb 'constructed' is Simple Past; the singular passive form requires 'was + V3'.",
    solution: "The active sentence is in the simple past tense ('constructed'). For a singular patient ('table'), the passive auxiliary is 'was' plus the past participle: 'was constructed'.",
    target: "Passive Voice: Simple Past Transposition"
  },
  {
    passage: "The geography teacher stated, \"The earth revolves around the sun once every year.\"",
    question: "Choose the correct reported speech version:",
    options: [
      "The geography teacher stated that the earth revolves around the sun once every year.",
      "The geography teacher stated that the earth revolved around the sun once every year.",
      "The geography teacher stated that the earth had revolved around the sun once every year.",
      "The geography teacher stated that the earth was revolving around the sun once every year."
    ],
    answer: "The geography teacher stated that the earth revolves around the sun once every year.",
    hint: "Invariable universal truths and permanent scientific facts are exempt from tense backshifting.",
    solution: "Under the Universal Truth Backshift Exemption, statements expressing permanent scientific facts remain in the simple present tense ('revolves') in reported speech.",
    target: "Reported Speech: Universal Truth Exemption"
  },
  {
    passage: "If I ________ the senior housemaster of this school, I would abolish compulsory early morning weed cutting.",
    question: "Choose the correct subjunctive verb form for this Second Conditional sentence:",
    options: ["were", "was", "am", "would be"],
    answer: "were",
    hint: "Hypothetical contrary-to-fact statements mandate the past subjunctive 'were' for all grammatical persons.",
    solution: "Second Conditional sentences expressing hypothetical or contrary-to-fact present states require the invariant past subjunctive 'were' ('If I were...'), paired with 'would + base verb'.",
    target: "Second Conditional: Irrealis Subjunctive Were"
  },
  {
    passage: "The school choir is rehearsing the national anthem in the assembly hall right now.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The national anthem is being rehearsed by the school choir in the assembly hall right now.",
      "The national anthem was being rehearsed by the school choir in the assembly hall right now.",
      "The national anthem is rehearsed by the school choir in the assembly hall right now.",
      "The national anthem has been rehearsed by the school choir in the assembly hall right now."
    ],
    answer: "The national anthem is being rehearsed by the school choir in the assembly hall right now.",
    hint: "Present Continuous active ('is rehearsing') requires 'is/are being + V3' in the passive.",
    solution: "The active verb 'is rehearsing' is in the present continuous aspect. The passive transformation requires [is/are + being + Past Participle]: 'is being rehearsed'.",
    target: "Passive Voice: Present Continuous Transposition"
  },
  {
    passage: "Ama said, \"We have completed all our mathematics homework exercises.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "Ama said that they had completed all their mathematics homework exercises.",
      "Ama said that we have completed all our mathematics homework exercises.",
      "Ama said that they have completed all their mathematics homework exercises.",
      "Ama said that they completed all their mathematics homework exercises."
    ],
    answer: "Ama said that they had completed all their mathematics homework exercises.",
    hint: "Present Perfect ('have completed') backshifts to Past Perfect ('had completed'), and pronouns shift accordingly.",
    solution: "In reported speech, Present Perfect backshifts to Past Perfect ('had completed'), the first-person plural pronoun 'we' shifts to 'they', and the possessive 'our' becomes 'their'.",
    target: "Reported Speech: Present Perfect Backshift"
  },
  {
    passage: "If Kwame ________ his bicycle tire properly, he will ride smoothly to school.",
    question: "Choose the correct verb form for the First Conditional clause:",
    options: ["inflates", "will inflate", "inflated", "would inflate"],
    answer: "inflates",
    hint: "The if-clause in a First Conditional predictive sentence takes the Simple Present tense.",
    solution: "First Conditional sentences follow the formula: IF + Simple Present ('inflates'), ... Will + Base Verb ('will ride'). Modal auxiliaries like 'will' cannot appear in the if-clause.",
    target: "First Conditional: Protasis Structure"
  },
  {
    passage: "The municipal health inspector inspected the butcher's stall early yesterday morning.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The butcher's stall was inspected by the municipal health inspector early yesterday morning.",
      "The butcher's stall is inspected by the municipal health inspector early yesterday morning.",
      "The butcher's stall had been inspected by the municipal health inspector early yesterday morning.",
      "The butcher's stall was being inspected by the municipal health inspector early yesterday morning."
    ],
    answer: "The butcher's stall was inspected by the municipal health inspector early yesterday morning.",
    hint: "The active verb 'inspected' is in the simple past tense.",
    solution: "Simple Past active ('inspected') converts to [was/were + Past Participle]: 'was inspected by the municipal health inspector'.",
    target: "Passive Voice: Simple Past Transposition"
  },
  {
    passage: "The science master said, \"Water boils at 100°C under normal atmospheric pressure.\"",
    question: "Choose the grammatically correct reported speech sentence:",
    options: [
      "The science master said that water boils at 100°C under normal atmospheric pressure.",
      "The science master said that water boiled at 100°C under normal atmospheric pressure.",
      "The science master said that water has boiled at 100°C under normal atmospheric pressure.",
      "The science master said that water was boiling at 100°C under normal atmospheric pressure."
    ],
    answer: "The science master said that water boils at 100°C under normal atmospheric pressure.",
    hint: "Permanent laws of nature do not undergo past tense backshifting.",
    solution: "Because water boiling at 100°C is an invariant scientific law, it is exempt from backshifting; the present tense 'boils' is maintained.",
    target: "Reported Speech: Universal Truth Exemption"
  },
  {
    passage: "If Kofi ________ a laptop computer, he would type his science project effortlessly.",
    question: "Choose the correct verb form for this Second Conditional hypothetical statement:",
    options: ["had", "has", "will have", "would have"],
    answer: "had",
    hint: "Second Conditional sentences pair a Simple Past verb in the if-clause with 'would + base verb'.",
    solution: "The Second Conditional formula is: IF + Simple Past ('had'), ... Would + Base Verb ('would type'). 'Had' expresses the hypothetical condition.",
    target: "Second Conditional: Hypothetical Protasis"
  },
  {
    passage: "The school board has purchased ten modern microscopes for the science department.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "Ten modern microscopes have been purchased by the school board for the science department.",
      "Ten modern microscopes were purchased by the school board for the science department.",
      "Ten modern microscopes are purchased by the school board for the science department.",
      "Ten modern microscopes had been purchased by the school board for the science department."
    ],
    answer: "Ten modern microscopes have been purchased by the school board for the science department.",
    hint: "Present Perfect active ('has purchased') converts to 'have been purchased' for a plural patient.",
    solution: "The active verb 'has purchased' is in the present perfect. Because the promoted passive subject ('microscopes') is plural, the passive auxiliary is 'have been' + V3: 'have been purchased'.",
    target: "Passive Voice: Present Perfect Transposition"
  },
  {
    passage: "Kweku said, \"I will travel to Takoradi tomorrow morning.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "Kweku said that he would travel to Takoradi the following morning.",
      "Kweku said that he will travel to Takoradi tomorrow morning.",
      "Kweku said that he would travel to Takoradi tomorrow morning.",
      "Kweku said that he was travelling to Takoradi the following morning."
    ],
    answer: "Kweku said that he would travel to Takoradi the following morning.",
    hint: "'Will' backshifts to 'would', and 'tomorrow morning' converts to 'the following morning'.",
    solution: "The modal 'will' shifts to 'would', and the temporal deixis 'tomorrow morning' converts to 'the following morning' (or 'the next morning').",
    target: "Reported Speech: Modal Backshift & Temporal Deixis"
  },
  {
    passage: "If you ________ oil onto water, it floats on the surface.",
    question: "Choose the correct verb form for this Zero Conditional statement:",
    options: ["pour", "will pour", "poured", "would pour"],
    answer: "pour",
    hint: "Expresses a scientific fact using Simple Present in both clauses.",
    solution: "Zero Conditionals express general scientific truths using the Simple Present in both clauses: 'If you pour oil onto water, it floats'.",
    target: "Zero Conditional: Physical Law"
  },
  {
    passage: "The mason was plastering the classroom wall when the headmaster entered.",
    question: "Choose the correct passive voice transformation of the first clause:",
    options: [
      "The classroom wall was being plastered by the mason when the headmaster entered.",
      "The classroom wall was plastered by the mason when the headmaster entered.",
      "The classroom wall is being plastered by the mason when the headmaster entered.",
      "The classroom wall had been plastered by the mason when the headmaster entered."
    ],
    answer: "The classroom wall was being plastered by the mason when the headmaster entered.",
    hint: "Past Continuous active ('was plastering') requires 'was/were being + V3' in the passive.",
    solution: "The past continuous active verb 'was plastering' converts into [was/were + being + Past Participle]: 'was being plastered'.",
    target: "Passive Voice: Past Continuous Transposition"
  },
  {
    passage: "The biology teacher said, \"Green plants produce their own food through photosynthesis.\"",
    question: "Choose the grammatically acceptable reported speech sentence:",
    options: [
      "The biology teacher said that green plants produce their own food through photosynthesis.",
      "The biology teacher said that green plants produced their own food through photosynthesis.",
      "The biology teacher said that green plants had produced their own food through photosynthesis.",
      "The biology teacher said that green plants were producing their own food through photosynthesis."
    ],
    answer: "The biology teacher said that green plants produce their own food through photosynthesis.",
    hint: "Scientific biological facts do not undergo tense backshifting in reported speech.",
    solution: "Because photosynthesis in green plants is a continuous biological fact, the verb 'produce' remains in the simple present tense without backshifting.",
    target: "Reported Speech: Universal Truth Exemption"
  },
  {
    passage: "If the government ________ more technical schools, more young people would acquire practical vocational skills.",
    question: "Choose the correct verb form for this Second Conditional sentence:",
    options: ["built", "builds", "will build", "would build"],
    answer: "built",
    hint: "Pair the hypothetical apodosis ('would acquire') with a Simple Past verb in the if-clause.",
    solution: "In a Second Conditional sentence, the hypothetical condition in the if-clause is formed using the Simple Past ('built'), matching the modal apodosis 'would acquire'.",
    target: "Second Conditional: Hypothetical Condition"
  },
  {
    passage: "The invigilator collected the examination scripts at exactly eleven o'clock.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The examination scripts were collected by the invigilator at exactly eleven o'clock.",
      "The examination scripts was collected by the invigilator at exactly eleven o'clock.",
      "The examination scripts are collected by the invigilator at exactly eleven o'clock.",
      "The examination scripts have been collected by the invigilator at exactly eleven o'clock."
    ],
    answer: "The examination scripts were collected by the invigilator at exactly eleven o'clock.",
    hint: "'Scripts' is plural, requiring 'were' plus the past participle 'collected'.",
    solution: "The active verb 'collected' is Simple Past. The promoted plural subject ('examination scripts') takes 'were collected'.",
    target: "Passive Voice: Simple Past Plural Transposition"
  },
  {
    passage: "The farmer said, \"I planted these hybrid maize seeds yesterday.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The farmer said that he had planted those hybrid maize seeds the day before.",
      "The farmer said that he planted these hybrid maize seeds yesterday.",
      "The farmer said that he had planted these hybrid maize seeds yesterday.",
      "The farmer said that he was planting those hybrid maize seeds the day before."
    ],
    answer: "The farmer said that he had planted those hybrid maize seeds the day before.",
    hint: "Simple Past ('planted') backshifts to Past Perfect ('had planted'); 'these' -> 'those'; 'yesterday' -> 'the day before'.",
    solution: "In reported speech, Simple Past shifts to Past Perfect ('had planted'), the demonstrative 'these' shifts to 'those', and 'yesterday' becomes 'the day before' (or 'the previous day').",
    target: "Reported Speech: Simple Past & Demonstrative Deixis"
  },
  {
    passage: "If you ________ iron metal to moisture and air, it rusts.",
    question: "Choose the correct verb form for this Zero Conditional statement:",
    options: ["expose", "will expose", "exposed", "would expose"],
    answer: "expose",
    hint: "Invariable chemical reaction: use Simple Present in the if-clause.",
    solution: "Zero Conditionals describe universal chemical reactions using the Simple Present: 'If you expose iron... it rusts'.",
    target: "Zero Conditional: Chemical Fact"
  },
  {
    passage: "The local council will construct a concrete footbridge over the stream next month.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "A concrete footbridge will be constructed by the local council over the stream next month.",
      "A concrete footbridge would be constructed by the local council over the stream next month.",
      "A concrete footbridge is constructed by the local council over the stream next month.",
      "A concrete footbridge will have been constructed by the local council over the stream next month."
    ],
    answer: "A concrete footbridge will be constructed by the local council over the stream next month.",
    hint: "Simple Future active ('will construct') converts to 'will be + V3' in the passive.",
    solution: "The active future verb 'will construct' converts into [will be + Past Participle]: 'will be constructed'.",
    target: "Passive Voice: Simple Future Transposition"
  },
  {
    passage: "The social studies master said, \"Accra is the constitutional capital of Ghana.\"",
    question: "Choose the correct reported speech version:",
    options: [
      "The social studies master said that Accra is the constitutional capital of Ghana.",
      "The social studies master said that Accra was the constitutional capital of Ghana.",
      "The social studies master said that Accra had been the constitutional capital of Ghana.",
      "The social studies master said that Accra would be the constitutional capital of Ghana."
    ],
    answer: "The social studies master said that Accra is the constitutional capital of Ghana.",
    hint: "Permanent geographic and political facts are exempt from tense backshifting.",
    solution: "Permanent geographic and political facts do not undergo backshifting; the present tense 'is' is retained.",
    target: "Reported Speech: Geographical Truth Exemption"
  },
  {
    passage: "If the town ________ a modern fire station, the volunteer fighters would extinguish blazes more rapidly.",
    question: "Choose the correct verb form for this Second Conditional sentence:",
    options: ["had", "has", "will have", "would have"],
    answer: "had",
    hint: "Pair the hypothetical consequence ('would extinguish') with Simple Past in the if-clause.",
    solution: "The Second Conditional requires the Simple Past ('had') in the protasis to express a hypothetical present situation.",
    target: "Second Conditional: Hypothetical Protasis"
  },
  {
    passage: "The class prefect cleans the chalkboard after every lesson.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The chalkboard is cleaned by the class prefect after every lesson.",
      "The chalkboard was cleaned by the class prefect after every lesson.",
      "The chalkboard is being cleaned by the class prefect after every lesson.",
      "The chalkboard has been cleaned by the class prefect after every lesson."
    ],
    answer: "The chalkboard is cleaned by the class prefect after every lesson.",
    hint: "Simple Present active ('cleans') requires 'is + V3' for a singular patient.",
    solution: "Simple Present active ('cleans') converts to [is/are + Past Participle]: 'is cleaned'.",
    target: "Passive Voice: Simple Present Transposition"
  },
  {
    passage: "Mansa said, \"I can solve this complicated algebraic equation easily.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "Mansa said that she could solve that complicated algebraic equation easily.",
      "Mansa said that she can solve this complicated algebraic equation easily.",
      "Mansa said that she could solve this complicated algebraic equation easily.",
      "Mansa said that she would solve that complicated algebraic equation easily."
    ],
    answer: "Mansa said that she could solve that complicated algebraic equation easily.",
    hint: "The modal 'can' shifts to 'could', and 'this' converts to 'that'.",
    solution: "The modal auxiliary 'can' backshifts to 'could', the pronoun 'I' becomes 'she', and the demonstrative 'this' converts to 'that'.",
    target: "Reported Speech: Modal Auxiliary & Demonstrative Shift"
  },
  {
    passage: "If you ________ red and blue paints together, you obtain purple.",
    question: "Choose the correct verb form for this Zero Conditional statement:",
    options: ["mix", "will mix", "mixed", "would mix"],
    answer: "mix",
    hint: "Invariable optical/physical rule: use Simple Present in the if-clause.",
    solution: "Zero Conditionals describe invariable color blending outcomes using Simple Present: 'If you mix... you obtain'.",
    target: "Zero Conditional: Physical Law"
  },
  {
    passage: "The police officers have arrested three armed suspects near the junction.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "Three armed suspects have been arrested by the police officers near the junction.",
      "Three armed suspects were arrested by the police officers near the junction.",
      "Three armed suspects had been arrested by the police officers near the junction.",
      "Three armed suspects are arrested by the police officers near the junction."
    ],
    answer: "Three armed suspects have been arrested by the police officers near the junction.",
    hint: "Present Perfect active ('have arrested') converts to 'have been arrested' for a plural patient.",
    solution: "Present Perfect active ('have arrested') converts to [have been + Past Participle]: 'have been arrested'.",
    target: "Passive Voice: Present Perfect Plural Transposition"
  },
  {
    passage: "The teacher told the students, \"The sun rises in the east and sets in the west.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The teacher told the students that the sun rises in the east and sets in the west.",
      "The teacher told the students that the sun rose in the east and set in the west.",
      "The teacher told the students that the sun had risen in the east and had set in the west.",
      "The teacher told the students that the sun was rising in the east and setting in the west."
    ],
    answer: "The teacher told the students that the sun rises in the east and sets in the west.",
    hint: "Universal astronomical facts do not undergo backshifting.",
    solution: "Permanent astronomical facts do not backshift; the simple present verbs 'rises' and 'sets' are preserved.",
    target: "Reported Speech: Astronomical Truth Exemption"
  },
  {
    passage: "If Kwame ________ the examination registration fee on time, the headmaster will issue his index number.",
    question: "Choose the correct verb form for the First Conditional clause:",
    options: ["pays", "will pay", "paid", "would pay"],
    answer: "pays",
    hint: "The if-clause of a First Conditional takes the Simple Present tense.",
    solution: "The First Conditional protasis requires the Simple Present ('pays'), paired with 'will issue' in the apodosis.",
    target: "First Conditional: Protasis Present Tense"
  },
  {
    passage: "The senior prefect rang the morning assembly bell at half past seven.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The morning assembly bell was rung by the senior prefect at half past seven.",
      "The morning assembly bell was rang by the senior prefect at half past seven.",
      "The morning assembly bell is rung by the senior prefect at half past seven.",
      "The morning assembly bell had been rung by the senior prefect at half past seven."
    ],
    answer: "The morning assembly bell was rung by the senior prefect at half past seven.",
    hint: "Past participle of 'ring' is 'rung' (ring, rang, rung); singular past requires 'was rung'.",
    solution: "Simple Past active ('rang') converts to 'was' + the past participle 'rung': 'was rung'. ('Rang' is the simple past form, not the participle).",
    target: "Passive Voice: Irregular Past Participle"
  },
  {
    passage: "Ama said to her friend, \"I must submit my science project now.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "Ama told her friend that she had to submit her science project then.",
      "Ama told her friend that she must submit her science project now.",
      "Ama told her friend that she had to submit her science project now.",
      "Ama told her friend that she would submit her science project then."
    ],
    answer: "Ama told her friend that she had to submit her science project then.",
    hint: "'Must' indicating obligation backshifts to 'had to', and 'now' shifts to 'then'.",
    solution: "In reported speech, the modal 'must' (obligation) backshifts to 'had to', and the temporal adverb 'now' converts to 'then'.",
    target: "Reported Speech: Modal Must & Temporal Deixis"
  },
  {
    passage: "If I ________ you, I would consult the school guidance counsellor before choosing senior high school elective subjects.",
    question: "Choose the correct subjunctive verb form:",
    options: ["were", "was", "am", "would be"],
    answer: "were",
    hint: "Hypothetical advice ('If I were you') requires the invariant subjunctive 'were'.",
    solution: "Standard prescriptive syntax mandates the invariant past subjunctive 'were' in hypothetical conditions ('If I were you').",
    target: "Second Conditional: Formulaic Subjunctive Were"
  },
  {
    passage: "The laboratory technician was calibrating the digital scale when the power went off.",
    question: "Choose the correct passive voice transformation of the main clause:",
    options: [
      "The digital scale was being calibrated by the laboratory technician when the power went off.",
      "The digital scale was calibrated by the laboratory technician when the power went off.",
      "The digital scale is being calibrated by the laboratory technician when the power went off.",
      "The digital scale had been calibrated by the laboratory technician when the power went off."
    ],
    answer: "The digital scale was being calibrated by the laboratory technician when the power went off.",
    hint: "Past Continuous active ('was calibrating') converts to 'was being calibrated'.",
    solution: "Past Continuous active ('was calibrating') transforms into [was/were + being + Past Participle]: 'was being calibrated'.",
    target: "Passive Voice: Past Continuous Transposition"
  },
  {
    passage: "The headmaster announced, \"The school compound will be fumigated this weekend.\"",
    question: "Choose the correct reported speech version:",
    options: [
      "The headmaster announced that the school compound would be fumigated that weekend.",
      "The headmaster announced that the school compound will be fumigated this weekend.",
      "The headmaster announced that the school compound would be fumigated this weekend.",
      "The headmaster announced that the school compound was fumigated that weekend."
    ],
    answer: "The headmaster announced that the school compound would be fumigated that weekend.",
    hint: "'Will' backshifts to 'would', and 'this weekend' converts to 'that weekend'.",
    solution: "'Will' shifts to 'would', and the proximate demonstrative 'this weekend' converts to the distal 'that weekend'.",
    target: "Reported Speech: Future Modal & Demonstrative Shift"
  },
  {
    passage: "If you drop a stone from the top of a building, gravity ________ it downward toward the earth.",
    question: "Choose the correct verb form for this Zero Conditional physical fact:",
    options: ["pulls", "will pull", "pulled", "would pull"],
    answer: "pulls",
    hint: "Physical law of gravity: Simple Present in both clauses.",
    solution: "Zero Conditionals describe universal gravitational laws using the Simple Present: 'If you drop... gravity pulls'.",
    target: "Zero Conditional: Gravitational Law"
  },
  {
    passage: "The typist has typed forty official letters this afternoon.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "Forty official letters have been typed by the typist this afternoon.",
      "Forty official letters were typed by the typist this afternoon.",
      "Forty official letters had been typed by the typist this afternoon.",
      "Forty official letters are typed by the typist this afternoon."
    ],
    answer: "Forty official letters have been typed by the typist this afternoon.",
    hint: "'Letters' is plural, requiring 'have been typed' in the present perfect passive.",
    solution: "Present Perfect active ('has typed') with a plural patient ('forty official letters') converts to 'have been typed'.",
    target: "Passive Voice: Present Perfect Plural Transposition"
  },
  {
    passage: "The chemistry teacher stated, \"Pure water has a neutral pH value of seven.\"",
    question: "Choose the correct reported speech version:",
    options: [
      "The chemistry teacher stated that pure water has a neutral pH value of seven.",
      "The chemistry teacher stated that pure water had a neutral pH value of seven.",
      "The chemistry teacher stated that pure water has had a neutral pH value of seven.",
      "The chemistry teacher stated that pure water was having a neutral pH value of seven."
    ],
    answer: "The chemistry teacher stated that pure water has a neutral pH value of seven.",
    hint: "Permanent chemical facts are exempt from tense backshifting.",
    solution: "Because the pH of pure water is an invariant chemical reality, the verb 'has' remains in the simple present tense.",
    target: "Reported Speech: Universal Chemical Truth"
  },
  {
    passage: "If the candidate ________ the instructions carefully, he will answer the questions correctly.",
    question: "Choose the correct verb form for the First Conditional clause:",
    options: ["reads", "will read", "read", "would read"],
    answer: "reads",
    hint: "The if-clause of a First Conditional sentence takes the Simple Present tense.",
    solution: "First Conditional sentences require Simple Present ('reads') in the protasis, paired with 'will answer' in the apodosis.",
    target: "First Conditional: Protasis Present Tense"
  },
  {
    passage: "The apprentice repaired the broken wooden desk yesterday afternoon.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The broken wooden desk was repaired by the apprentice yesterday afternoon.",
      "The broken wooden desk is repaired by the apprentice yesterday afternoon.",
      "The broken wooden desk had been repaired by the apprentice yesterday afternoon.",
      "The broken wooden desk was being repaired by the apprentice yesterday afternoon."
    ],
    answer: "The broken wooden desk was repaired by the apprentice yesterday afternoon.",
    hint: "Simple Past active ('repaired') converts to 'was repaired'.",
    solution: "Simple Past active ('repaired') transforms into [was + Past Participle]: 'was repaired'.",
    target: "Passive Voice: Simple Past Transposition"
  },
  {
    passage: "Kofi said, \"I bought these leather sandals here in Kumasi.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "Kofi said that he had bought those leather sandals there in Kumasi.",
      "Kofi said that he bought these leather sandals here in Kumasi.",
      "Kofi said that he had bought these leather sandals there in Kumasi.",
      "Kofi said that he was buying those leather sandals there in Kumasi."
    ],
    answer: "Kofi said that he had bought those leather sandals there in Kumasi.",
    hint: "Simple Past ('bought') -> Past Perfect ('had bought'); 'these' -> 'those'; 'here' -> 'there'.",
    solution: "Simple Past backshifts to Past Perfect ('had bought'), demonstrative 'these' becomes 'those', and spatial adverb 'here' becomes 'there'.",
    target: "Reported Speech: Spatial & Demonstrative Deixis"
  },
  {
    passage: "If the agricultural cooperative ________ a tractor, the farmers would clear large acreages in fewer days.",
    question: "Choose the correct verb form for this Second Conditional sentence:",
    options: ["owned", "owns", "will own", "would own"],
    answer: "owned",
    hint: "Match the hypothetical consequence ('would clear') with Simple Past in the if-clause.",
    solution: "The Second Conditional requires the Simple Past ('owned') in the if-clause to establish an unreal present condition.",
    target: "Second Conditional: Hypothetical Protasis"
  },
  {
    passage: "The sanitation prefect sweeps the dormitory veranda every evening.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The dormitory veranda is swept by the sanitation prefect every evening.",
      "The dormitory veranda was swept by the sanitation prefect every evening.",
      "The dormitory veranda is being swept by the sanitation prefect every evening.",
      "The dormitory veranda has been swept by the sanitation prefect every evening."
    ],
    answer: "The dormitory veranda is swept by the sanitation prefect every evening.",
    hint: "Simple Present active ('sweeps') with singular patient ('veranda') converts to 'is swept'.",
    solution: "Simple Present active ('sweeps') converts to [is + Past Participle]: 'is swept'.",
    target: "Passive Voice: Simple Present Transposition"
  },
  {
    passage: "The doctor told the patient, \"You must take your medication regularly.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The doctor told the patient that he had to take his medication regularly.",
      "The doctor told the patient that he must take your medication regularly.",
      "The doctor told the patient that he would take his medication regularly.",
      "The doctor told the patient that you had to take his medication regularly."
    ],
    answer: "The doctor told the patient that he had to take his medication regularly.",
    hint: "'Must' expressing obligation backshifts to 'had to', and second-person pronouns shift to third-person.",
    solution: "In reported speech, modal 'must' (obligation) backshifts to 'had to', pronoun 'you' becomes 'he', and possessive 'your' becomes 'his'.",
    target: "Reported Speech: Modal Must Obligation"
  },
  {
    passage: "If you ________ wood to high heat in the presence of oxygen, it burns.",
    question: "Choose the correct verb form for this Zero Conditional statement:",
    options: ["subject", "will subject", "subjected", "would subject"],
    answer: "subject",
    hint: "Zero Conditional scientific fact: Simple Present in both clauses.",
    solution: "Zero Conditionals describe universal combustion facts using the Simple Present: 'If you subject... it burns'.",
    target: "Zero Conditional: Combustion Fact"
  },
  {
    passage: "The electrician was installing the ceiling fan when the circuit tripped.",
    question: "Choose the correct passive voice transformation of the first clause:",
    options: [
      "The ceiling fan was being installed by the electrician when the circuit tripped.",
      "The ceiling fan was installed by the electrician when the circuit tripped.",
      "The ceiling fan is being installed by the electrician when the circuit tripped.",
      "The ceiling fan had been installed by the electrician when the circuit tripped."
    ],
    answer: "The ceiling fan was being installed by the electrician when the circuit tripped.",
    hint: "Past Continuous active ('was installing') converts to 'was being installed'.",
    solution: "Past Continuous active ('was installing') transforms into [was + being + Past Participle]: 'was being installed'.",
    target: "Passive Voice: Past Continuous Transposition"
  },
  {
    passage: "The physics master said, \"Light travels faster than sound in a vacuum.\"",
    question: "Choose the correct reported speech version:",
    options: [
      "The physics master said that light travels faster than sound in a vacuum.",
      "The physics master said that light traveled faster than sound in a vacuum.",
      "The physics master said that light had traveled faster than sound in a vacuum.",
      "The physics master said that light was traveling faster than sound in a vacuum."
    ],
    answer: "The physics master said that light travels faster than sound in a vacuum.",
    hint: "Invariable physical facts are exempt from tense backshifting.",
    solution: "Because the speed of light versus sound is an invariable law of physics, the present tense 'travels' is retained without backshifting.",
    target: "Reported Speech: Universal Physical Fact"
  },
  {
    passage: "If the rain ________, the children will play outside in the school field.",
    question: "Choose the correct verb form for the First Conditional clause:",
    options: ["stops", "will stop", "stopped", "would stop"],
    answer: "stops",
    hint: "The if-clause of a First Conditional sentence takes the Simple Present tense.",
    solution: "The First Conditional protasis requires the Simple Present ('stops'), paired with 'will play' in the apodosis.",
    target: "First Conditional: Protasis Present Tense"
  },
  {
    passage: "The school driver locked the bus doors before walking to the staff room.",
    question: "Choose the correct passive voice transformation of the first clause:",
    options: [
      "The bus doors were locked by the school driver before walking to the staff room.",
      "The bus doors was locked by the school driver before walking to the staff room.",
      "The bus doors are locked by the school driver before walking to the staff room.",
      "The bus doors had been locked by the school driver before walking to the staff room."
    ],
    answer: "The bus doors were locked by the school driver before walking to the staff room.",
    hint: "'Bus doors' is plural, requiring 'were' plus the past participle 'locked'.",
    solution: "Simple Past active ('locked') with a plural patient ('bus doors') converts to 'were locked'.",
    target: "Passive Voice: Simple Past Plural Transposition"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// =========================================================================
const capstone5B8SyntaxConcordFoundationQuestions = [
  {
    questionNumber: 51,
    question: "In paragraph 1, why is the present tense verb 'boils' retained in the conditional clause 'if water reaches one hundred degrees Celsius, it boils'?",
    options: [
      "Because it is a Zero Conditional sentence expressing an invariable physical scientific law that requires the Simple Present in both clauses",
      "Because the word 'water' is an irregular plural noun that rejects past tense verbs",
      "Because the speaker was speaking inside a closed laboratory",
      "Because conditional sentences never use past tense verbs in English"
    ],
    answer: "Because it is a Zero Conditional sentence expressing an invariable physical scientific law that requires the Simple Present in both clauses",
    hint: "Examine the type of conditional sentence used to describe invariable scientific facts.",
    solution: "Zero Conditionals describe universal scientific truths and invariable laws of nature using the formula: IF + Simple Present, ... Simple Present. Therefore, 'boils' is grammatically mandatory.",
    target: "Capstone Exam: Zero Conditional Analysis"
  },
  {
    questionNumber: 52,
    question: "In paragraph 2, what syntactic voice transformation is demonstrated by the clause 'the new bio-filter was purchased by the municipal education directorate last week'?",
    options: [
      "A Simple Past passive voice transformation where the patient ('new bio-filter') is promoted to subject and the agent ('municipal education directorate') is introduced with 'by'",
      "A Present Perfect active voice sentence emphasizing the purchase price",
      "An intransitive verb construction that cannot take a direct object",
      "A subjunctive mood inversion expressing an unreal wish"
    ],
    answer: "A Simple Past passive voice transformation where the patient ('new bio-filter') is promoted to subject and the agent ('municipal education directorate') is introduced with 'by'",
    hint: "Identify the structure [was + Past Participle + by + Agent].",
    solution: "The clause illustrates a textbook Simple Past passive construction: [Passive Subject + was + Past Participle (purchased) + by + Agent].",
    target: "Capstone Exam: Passive Voice Transposition"
  },
  {
    questionNumber: 53,
    question: "In paragraph 2, why is the clause 'if the school receives adequate funding next term, the science department will procure ten additional electronic microscopes' grammatically correct under First Conditional rules?",
    options: [
      "Because the if-clause correctly uses the Simple Present ('receives') instead of 'will receive' to denote a real future possibility, matching 'will procure' in the main clause",
      "Because 'next term' requires the Past Continuous tense in both clauses",
      "Because 'funding' is an uncountable noun that demands a modal verb in the if-clause",
      "Because the main clause uses 'would' to show that the purchase is impossible"
    ],
    answer: "Because the if-clause correctly uses the Simple Present ('receives') instead of 'will receive' to denote a real future possibility, matching 'will procure' in the main clause",
    hint: "Recall the First Conditional Protasis Law regarding modal verbs in the if-clause.",
    solution: "The First Conditional Protasis Law prohibits the modal 'will' in the if-clause. The Simple Present ('receives') denotes the future condition, paired with 'will procure' in the apodosis.",
    target: "Capstone Exam: First Conditional Protasis Law"
  },
  {
    questionNumber: 54,
    question: "In paragraph 3, which option correctly explains the reported speech transformation of the speaker's direct statement: \"I am visiting your school today to encourage young scientists\"?",
    options: [
      "The reporting verb 'said' triggers backshifting of 'am visiting' to 'was visiting', the pronoun 'I' shifts to 'she', 'your' shifts to 'their', and 'today' shifts to 'that day'",
      "The sentence maintains 'am visiting' because the speaker is still in the school",
      "The sentence converts to 'will visit' because the visit is happening in the future",
      "The sentence changes 'today' to 'yesterday' and uses 'had visited'"
    ],
    answer: "The reporting verb 'said' triggers backshifting of 'am visiting' to 'was visiting', the pronoun 'I' shifts to 'she', 'your' shifts to 'their', and 'today' shifts to 'that day'",
    hint: "Check the tense backshift (Present Continuous -> Past Continuous) and temporal deixis ('today' -> 'that day').",
    solution: "With a past reporting verb ('said'), Present Continuous shifts to Past Continuous ('was visiting'), first-person 'I' becomes 'she', second-person possessive 'your' becomes 'their', and temporal deixis 'today' shifts to 'that day'.",
    target: "Capstone Exam: Reported Speech Deixis & Tense Shift"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the First Conditional rule governing the if-clause in paragraph 2.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Conditional clauses take the simple present tense.",
      "Because if-clauses are conditional in English, they must never use 'will' for future time.",
      "Using the simple present tense in English First Conditional clauses.",
      "Present tense in if-clauses."
    ],
    answer: "Conditional clauses take the simple present tense.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Conditional clauses take the simple present tense' is exactly 7 words, forms a complete Subject-Verb-Object sentence, and states the grammatical rule accurately. Option C is a participial fragment (0 marks), Option B has 14 words, and Option D is a phrase.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

// =========================================================================
// DEPLOYMENT LOGIC
// =========================================================================
async function deploy() {
  console.log("Connecting to Firestore via Google OAuth2...");
  const db = await getDb();

  console.log("Building 55 UNIQUE questions for Basic 8 (JHS 2) Strand 3 Sub-Strand 2 Foundation Lab...");
  const all55Questions = [];

  // 1. Build Questions 1 to 50
  unique50B8SyntaxConcordFoundationDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B8_S2_F_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B8",
      difficulty: "foundation",
      questionNumber: qNum,
      isCapstoneExamPassage: false,
      passageText: item.passage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B8.3.1.2 / B8.3.2.1 / B8.3.3.1: Demonstrate grammatical mastery of active-to-passive voice transformations, reported speech backshifts, universal truth exemptions, and closed conditionals (Types 0, 1, 2)."
    });
  });

  // 2. Build Questions 51 to 55
  capstone5B8SyntaxConcordFoundationQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${b8SyntaxConcordFoundationCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B8_S2_F_${item.questionNumber}`,
      level: "B8",
      difficulty: "foundation",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: b8SyntaxConcordFoundationCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B8.3.1.2 / B8.3.2.1 / B8.3.3.1: Synthesize multi-paragraph contextual grammar, evaluating passive voice transpositions, reported speech deixis, conditionals, universal truth exemptions, and concise rule summaries."
    });
  });

  // Map to TopicalPracticeQuestion format for the main doc practicePool
  const practicePoolQuestions = all55Questions.map(q => ({
    id: q.id,
    difficulty: "low",
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: 1
  }));

  const subDocPayload = {
    level: "B8",
    difficulty: "foundation",
    title: "Basic 8 Foundation Lab: 50 Unique Syntax, Voice & Conditional Drills + 5 Capstone Exam Questions",
    totalQuestions: all55Questions.length,
    shortDrillsCount: 50,
    capstoneExamQuestionsCount: 5,
    questions: all55Questions,
    metadata: {
      hasDuplicateQuestions: false,
      uniqueQuestionsCount: 55,
      structure: "50 Unique Short Drills (Passive Voice, Reported Speech, Types 0/1/2 Conditionals) + 5 Capstone Full-Passage Questions",
      passageVisibility: "Passage embedded both in passageText and at the top of prompt",
      curriculum: "NaCCA Common Core Programme (CCP) Standard",
      strand: "Strand 3: Grammar & Usage",
      subStrand: "Sub-Strand 2: Syntax, Clauses, Concord & Conditionals",
      updatedAt: new Date().toISOString()
    }
  };

  const targetTopics = [
    'grammar_syntax_clauses_concord',
    'grammar_syntax_clauses_concord_conditionals'
  ];

  const parentPaths = [
    'global_curriculum/jhs/subjects/english/topical',
    'global_curriculum/jhs/subjects/english/topics',
    'global_curriculum/jhs/subjects/english/topical_units'
  ];

  for (const topicId of targetTopics) {
    console.log(`\n======================================================`);
    console.log(`🎯 Populating B8 Foundation for: ${topicId}`);
    console.log(`======================================================`);

    // 1. Write subcollection doc
    const subDocPath = `global_curriculum/jhs/subjects/english/topical/${topicId}/practice_labs/B8_foundation`;
    await db.doc(subDocPath).set(subDocPayload, { merge: true });
    console.log(`   ✅ Wrote subcollection doc: ${subDocPath}`);

    // 2. Update main doc's levels.b8.practicePool.low across all parent collections
    for (const parent of parentPaths) {
      const mainDocPath = `${parent}/${topicId}`;
      const mainRef = db.doc(mainDocPath);
      const snap = await mainRef.get();
      if (snap.exists) {
        const curData = snap.data() || {};
        const curLevels = curData.levels || {};
        const curB8 = curLevels.b8 || {};
        const curPool = curB8.practicePool || { low: [], medium: [], hard: [] };

        const updatedPool = {
          ...curPool,
          low: practicePoolQuestions
        };

        const totalQs = (curLevels.b7?.practicePool?.low?.length || 0) +
                        (curLevels.b7?.practicePool?.medium?.length || 0) +
                        (curLevels.b7?.practicePool?.hard?.length || 0) +
                        (updatedPool.low?.length || 0) +
                        (updatedPool.medium?.length || 0) +
                        (updatedPool.hard?.length || 0) +
                        (curLevels.b9?.practicePool?.low?.length || 0) +
                        (curLevels.b9?.practicePool?.medium?.length || 0) +
                        (curLevels.b9?.practicePool?.hard?.length || 0);

        await mainRef.set({
          levels: {
            ...curLevels,
            b8: {
              ...curB8,
              practicePool: updatedPool
            }
          },
          totalPracticeQuestions: totalQs,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        console.log(`   ✅ Updated main doc pool at: ${mainDocPath} (B8 Low: ${practicePoolQuestions.length} Qs, Total: ${totalQs})`);
      }
    }
  }

  console.log("\n🎉 Basic 8 (JHS 2) Foundation Lab successfully deployed!");
}

deploy()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("❌ Fatal Error Deploying B8 Foundation Lab:", err);
    process.exit(1);
  });
