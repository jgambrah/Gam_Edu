import * as admin from 'firebase-admin';
import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function getDb() {
  const fbAdmin: any = (admin as any).default || admin;
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
    console.warn("OAuth fallback failed, trying default admin credential:", e);
  }

  if (!fbAdmin.apps?.length) {
    try {
      fbAdmin.initializeApp({ credential: fbAdmin.credential.applicationDefault() });
    } catch (e) {}
  }
  return fbAdmin.firestore();
}

interface LabQuestion {
  id: string;
  level: "B9";
  difficulty: "advanced";
  questionNumber: number;
  isCapstoneExamPassage: boolean;
  passageText: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  competencyTarget: string;
  learningCompetency: string;
}

// =========================================================================
// CAPSTONE MULTI-PARAGRAPH PASSAGE (QUESTIONS 51 TO 55)
// =========================================================================
const agbogbloshieFullPassage = 
`Sprawled along the banks of the Korle Lagoon in central Accra, the Agbogbloshie scrap yard historically emerged as one of the world's most notorious epicenters of informal electronic waste management. Tens of thousands of obsolete desktop computers, cathode-ray televisions, discarded mobile phones, and industrial refrigeration compressors—shipped from industrialized nations under the guise of reusable second-hand consumer electronics—were dismantled daily by informal scrap salvagers. Equipped with crude chisels, sledgehammers, and bare hands, energetic youths extracted valuable non-ferrous metals, primarily copper, aluminum, and brass.

However, the primitive recovery methods practiced at the site triggered an acute environmental and epidemiological catastrophe. To strip plastic polymer insulation from copper telecommunication wiring, scrap workers burned bundles of electrical cables on open bonfire hearths fueled by discarded vehicular rubber tires. The resultant combustion generated towering plumes of acrid black smoke loaded with highly carcinogenic brominated dioxins, furans, and toxic particulate matter. Heavy lead and cadmium aerosols settled across adjacent vegetable markets, while corrosive runoff turned the Korle Lagoon into a biologically dead, stygian sewer devoid of aquatic life.

Epidemiologists investigating the site documented alarming concentrations of systemic heavy metal poisoning among the scrap salvagers and surrounding residents. Blood serum samples revealed lead and cadmium levels exceeding international safety thresholds by over thirty-fold. Chronic exposure to these atmospheric and waterborne neurotoxins produced irreversible renal failure, chronic obstructive pulmonary disorders, severe cardiovascular damage, and spontaneous miscarriages among riverside populations.

To eliminate this human and ecological tragedy, the municipal administration and international development agencies dismantled the crude open-air burning hearths, initiating a transition toward formal, mechanized e-waste recycling. Engineered shredding facilities equipped with pneumatic density separators and magnetic sorters now recover copper and precious metals cleanly without combustion. Establishing structured statutory buy-back depots and providing safe technical training for informal workers ensures that electronic scrap recycling drives circular industrial manufacturing without sacrificing human lives.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// =========================================================================
const unique50B9AdvancedDrills = [
  {
    passage: "Passage: 'In mineral-rich forest basins, illegal alluvial mining has devastated local ecosystems. Heavy excavators tear down mature cocoa trees, and miners wash dredged slurries with toxic liquid mercury directly in rivers, destroying vital water bodies that sustain thousands of rural households.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the primary environmental danger of illegal mining.\nWhich candidate answer qualifies for FULL MARKS under WAEC/NaCCA rules?",
    options: [
      "Destruction of vital river bodies and farmlands.",
      "Illegal mining destroys vital water bodies.",
      "Because of illegal mining, pristine agricultural farmlands and community river bodies are heavily contaminated.",
      "Illegal mining is very destructive."
    ],
    answer: "Illegal mining destroys vital water bodies.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Illegal mining destroys vital water bodies' is exactly 6 words, possesses complete Subject-Verb-Object syntax, and directly answers the prompt. Option A is a fragment (lacks finite verb = 0 marks), Option C has 14 words (violates ceiling), and Option D is too vague.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'The National Road Safety Authority reports that reckless overtaking and nocturnal driver fatigue account for over sixty percent of highway fatalities. To eliminate this carnage, the transport ministry must repair dilapidated highway corridors, install speed-monitoring cameras, and mandate emergency vehicle towing.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the author's primary infrastructural solution to highway carnage.\nWhich candidate answer qualifies for FULL MARKS without penalties?",
    options: [
      "Government must repair dilapidated highway corridors.",
      "Installing speed cameras and repairing bad roads.",
      "To prevent fatal accidents, authorities should definitely install computerized speed cameras on all major highways.",
      "Accidents kill many passengers annually."
    ],
    answer: "Government must repair dilapidated highway corridors.",
    hint: "Ensure the sentence contains an active Subject, Finite Verb, and does not exceed 8 words.",
    solution: "'Government must repair dilapidated highway corridors' is exactly 6 words, grammatically complete, and addresses the prompt. Option B is an unattached fragment (0 marks), Option C has 14 words.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'Smallholder agrarian communities across the arid savannah face severe seasonal water scarcity. In response, public health agencies recommend that district assemblies construct decentralized solar-powered boreholes to supply uninterrupted potable groundwater to clinics and basic schools.'",
    question: "Why is the summary submission 'Constructing solar-powered boreholes in rural communities' awarded ZERO MARKS under WAEC marking rules?",
    options: [
      "Because the word count is too short",
      "Because it is an incomplete grammatical fragment lacking a finite verb",
      "Because boreholes are expensive to drill",
      "Because solar energy is an unproven technology"
    ],
    answer: "Because it is an incomplete grammatical fragment lacking a finite verb",
    hint: "A participle ('Constructing...') starting a phrase without an auxiliary or subject cannot stand as an independent sentence.",
    solution: "In WAEC marking criteria, summary answers that are phrases or dependent fragments lacking a finite verb are penalized for grammatical incompleteness and receive zero (0) marks.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'Deforestation severely reduces global carbon sequestration. Tropical rainforests serve as planetary carbon sinks; when living canopies are preserved, trees absorb carbon dioxide from the atmosphere during photosynthesis, drastically lowering greenhouse gas warming.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state how trees help combat climate change.\nWhich submission strictly obeys both grammatical and length rules?",
    options: [
      "Trees absorb carbon dioxide from the atmosphere.",
      "Absorbing carbon dioxide from the atmosphere daily.",
      "Because trees are green, they absorb carbon dioxide greenhouse gases from our air.",
      "Planting trees across the country."
    ],
    answer: "Trees absorb carbon dioxide from the atmosphere.",
    hint: "Count the words: exactly 7 words, Subject ('Trees') + Verb ('absorb') + Object.",
    solution: "'Trees absorb carbon dioxide from the atmosphere' is exactly 7 words, grammatically complete, and scientifically accurate. Option B is a fragment, Option C is 12 words, and Option D is a phrase.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'Candidates frequently misunderstand summary instructions by copying long clauses directly from the reading text. For instance, when asked to state a solution in eight words, copying a twenty-five-word sentence verbatim demonstrates a lack of synthesis and synthesis discipline.'",
    question: "What penalty is applied by WAEC examiners when a student copies an entire 25-word sentence verbatim from the text for an 8-word summary item?",
    options: [
      "Full marks are awarded because the sentence is from the passage.",
      "Heavy deductions for mindless lifting and complete forfeiture of marks for exceeding the word ceiling.",
      "The examiner shortens the sentence for the candidate.",
      "The candidate is asked to retake the test."
    ],
    answer: "Heavy deductions for mindless lifting and complete forfeiture of marks for exceeding the word ceiling.",
    hint: "WAEC penalizes both verbatim copying ('lifting') and word count violations.",
    solution: "Verbatim copying incurs expression penalties, and exceeding the prescribed length ceiling by more than 3 words results in a score of zero (0) for that item.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'To eliminate malaria in urban settlements, municipal authorities must drain stagnant surface ditches and spray biological larvicides across swampy breeding depressions every fortnight.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the primary municipal action to curb malaria.\nWhich answer qualifies for full marks?",
    options: [
      "Authorities must spray biological larvicides on swamps.",
      "Draining stagnant surface ditches and spraying larvicides fortnightly.",
      "Because mosquitoes bite residents, the municipal assembly should definitely drain ditches.",
      "Draining surface ditches."
    ],
    answer: "Authorities must spray biological larvicides on swamps.",
    hint: "Must be an active sentence with Subject and Finite Verb, 8 words or fewer.",
    solution: "'Authorities must spray biological larvicides on swamps' is exactly 7 words, complete in syntax, and directly addresses the prompt.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'Why is the candidate answer 'Because of poverty, parents cannot afford secondary school fees' rejected as a valid summary sentence when asked to state why children drop out of school?'",
    question: "What grammatical defect causes this candidate answer to be marked down?",
    options: [
      "It contains too few words",
      "It is a subordinate dependent clause that cannot stand alone as a sentence",
      "It uses the word 'parents'",
      "It discusses secondary school"
    ],
    answer: "It is a subordinate dependent clause that cannot stand alone as a sentence",
    hint: "A clause starting with the subordinating conjunction 'Because' without a main clause is dependent.",
    solution: "Starting an answer with 'Because...' creates a dependent adverbial clause fragment. Without an independent main clause, it is grammatically incomplete.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'Commercial poultry farmers must administer prophylactic Newcastle disease vaccines to day-old chicks to eliminate fatal epidemic mortality during the harmattan season.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what poultry farmers must do to protect chicks.\nWhich summary earns full marks?",
    options: [
      "Farmers must vaccinate chicks against Newcastle disease.",
      "Administering prophylactic Newcastle disease vaccines to chicks.",
      "Vaccinating chicks to prevent fatal epidemic mortality during harmattan.",
      "Vaccines for chicks."
    ],
    answer: "Farmers must vaccinate chicks against Newcastle disease.",
    hint: "Count words: exactly 7 words, complete Subject-Verb-Object syntax.",
    solution: "'Farmers must vaccinate chicks against Newcastle disease' is exactly 7 words, active, and grammatically complete.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'In evaluating summary submissions, examiners encounter students who write: 'To plant cover crops to stop soil erosion.' Why does this answer receive zero marks?'",
    question: "Identify the technical grammatical violation committed by this submission.",
    options: [
      "It is an infinitive phrase fragment lacking an active subject and finite verb",
      "It has too many capital letters",
      "It discusses agriculture instead of technology",
      "The word 'erosion' is spelled incorrectly"
    ],
    answer: "It is an infinitive phrase fragment lacking an active subject and finite verb",
    hint: "An infinitive ('To plant...') cannot serve as the finite verb of an independent sentence.",
    solution: "Beginning with 'To plant...' forms an infinitive phrase fragment. Without an explicit subject and finite verb, it receives zero marks for grammatical incompleteness.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'To prevent severe coastal flooding, engineering ministries must construct reinforced concrete sea revetments along rapidly receding shorelines.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state how engineers can prevent coastal flooding.\nWhich answer qualifies for full marks?",
    options: [
      "Engineers must construct concrete sea revetments.",
      "Constructing reinforced concrete sea revetments along receding shorelines.",
      "Because sea waves are strong, engineers should definitely build revetments.",
      "Building sea revetments."
    ],
    answer: "Engineers must construct concrete sea revetments.",
    hint: "Count words: exactly 6 words, active Subject + Modal Verb + Object.",
    solution: "'Engineers must construct concrete sea revetments' is exactly 6 words and grammatically complete. Option B is an unattached fragment.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'Examiners frequently penalize candidates for 'mindless lifting'. What does this penalty signify in an English summary examination?'",
    question: "What does 'mindless lifting' mean in summary marking?",
    options: [
      "Lifting heavy examination desks in the hall",
      "Copying long clauses verbatim from the passage without personal synthesis",
      "Writing with a fountain pen",
      "Asking the invigilator for extra paper"
    ],
    answer: "Copying long clauses verbatim from the passage without personal synthesis",
    hint: "Verbatim copying of original passage text without rephrasing or condensation.",
    solution: "'Lifting' refers to copying sentences word-for-word from the passage without demonstrating synthesis or personal expression.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'The forestry commission ought to enforce mandatory replanting quotas on commercial timber logging companies to halt national forest depletion.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what the commission must enforce on timber companies.\nWhich submission earns full marks?",
    options: [
      "Commission must enforce mandatory tree replanting quotas.",
      "Enforcing mandatory replanting quotas on logging companies.",
      "Mandatory replanting quotas to halt national forest depletion.",
      "Replanting trees."
    ],
    answer: "Commission must enforce mandatory tree replanting quotas.",
    hint: "Count words: exactly 7 words, complete Subject-Verb-Object syntax.",
    solution: "'Commission must enforce mandatory tree replanting quotas' has 7 words and complete grammatical structure.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'A candidate submitted the following 12-word answer to a question with a strict 8-word ceiling: 'The ministry must provide clean potable drinking water to all rural villages.' How is this evaluated?'",
    question: "What penalty will the examiner apply to this submission?",
    options: [
      "Award bonus marks for providing extra words",
      "Deduct marks for violating the word ceiling, potentially forfeiting all marks for substantial excess",
      "Ignore the word limit and award full marks",
      "Shorten the sentence for the candidate"
    ],
    answer: "Deduct marks for violating the word ceiling, potentially forfeiting all marks for substantial excess",
    hint: "Exceeding the ceiling by 4 words triggers severe word-count penalties.",
    solution: "Writing 12 words when the limit is 8 triggers length deductions; exceeding limits by 3+ words frequently forfeits all marks under WAEC rules.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'Municipal water boards should install digital smart meters in residential estates to curb unaccounted water losses and revenue leakage.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what water boards should install.\nWhich answer qualifies for full marks?",
    options: [
      "Boards should install digital smart meters.",
      "Installing digital smart meters in residential estates.",
      "Digital smart meters to curb revenue leakage.",
      "Smart meters for water."
    ],
    answer: "Boards should install digital smart meters.",
    hint: "Count words: exactly 6 words, Subject ('Boards') + Verb ('should install') + Object.",
    solution: "'Boards should install digital smart meters' is exactly 6 words and grammatically complete.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'When asked to state the cause of fire outbreaks, a student wrote: 'Careless disposal of lighted cigarette butts in dry brush.' Why is this awarded zero marks?'",
    question: "What is the structural defect of this candidate answer?",
    options: [
      "It is a noun phrase fragment lacking a finite verb",
      "It does not mention the fire service",
      "Cigarettes are not dangerous",
      "It is written in English"
    ],
    answer: "It is a noun phrase fragment lacking a finite verb",
    hint: "The answer consists of a noun phrase with modifiers but has no finite action verb.",
    solution: "The submission is an expanded noun phrase fragment. Because it lacks a finite verb, it is grammatically incomplete and receives zero marks.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'Agricultural banks must provide low-interest credit facilities to certified seed growers to boost national grain production.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what banks must provide.\nWhich answer qualifies for full marks?",
    options: [
      "Banks must provide low-interest agricultural credit.",
      "Providing low-interest credit facilities to certified seed growers.",
      "Low-interest credit facilities to boost national grain production.",
      "Credit for farmers."
    ],
    answer: "Banks must provide low-interest agricultural credit.",
    hint: "Count words: exactly 6 words, complete Subject-Verb-Object syntax.",
    solution: "'Banks must provide low-interest agricultural credit' is exactly 6 words and grammatically sound.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'Why must a summary answer always end with a terminal full stop (period)?'",
    question: "What is the grammatical importance of the terminal full stop in summary scoring?",
    options: [
      "It makes the paper look artistic",
      "It formally marks the end of a complete grammatical sentence",
      "Examiners require ink spots on every line",
      "It counts as an additional word"
    ],
    answer: "It formally marks the end of a complete grammatical sentence",
    hint: "A sentence is not orthographically complete without terminal punctuation.",
    solution: "A sentence must begin with a capital letter and end with terminal punctuation (full stop). Omitting it is a mechanical punctuation error.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'The food and drugs authority must confiscate unwholesome imported canned meats from commercial supermarkets to protect public health.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what the authority must confiscate.\nWhich submission qualifies for full marks?",
    options: [
      "Authority must confiscate unwholesome canned meats.",
      "Confiscating unwholesome imported canned meats from supermarkets.",
      "Unwholesome imported canned meats in commercial supermarkets.",
      "Bad canned meats."
    ],
    answer: "Authority must confiscate unwholesome canned meats.",
    hint: "Count words: exactly 6 words, Subject ('Authority') + Verb ('must confiscate') + Object.",
    solution: "'Authority must confiscate unwholesome canned meats' is exactly 6 words, active, and complete.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'A student answered: 'That the government should build more hospitals.' Why is the introductory word 'That' penalized in summary writing?'",
    question: "Why should introductory complementizer words like 'That...' be avoided in summary answers?",
    options: [
      "Because 'That' is a noun",
      "Because it turns an independent statement into a dependent noun clause fragment",
      "Because examiners dislike four-letter words",
      "Because 'That' changes the tense of verbs"
    ],
    answer: "Because it turns an independent statement into a dependent noun clause fragment",
    hint: "Prefacing a sentence with 'That' subordinates the entire clause into a dependent fragment.",
    solution: "Starting with 'That...' creates a subordinate noun clause fragment. It cannot stand alone as an independent grammatical sentence.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'To safeguard public highways from nocturnal collisions, transport authorities must mandate reflective safety tape on cargo haulage trucks.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what authorities must mandate.\nWhich answer earns full marks?",
    options: [
      "Authorities must mandate reflective truck tape.",
      "Mandating reflective safety tape on cargo haulage trucks.",
      "Reflective safety tape on cargo haulage trucks.",
      "Tape on trucks."
    ],
    answer: "Authorities must mandate reflective truck tape.",
    hint: "Count words: exactly 6 words, active Subject + Modal Verb + Object.",
    solution: "'Authorities must mandate reflective truck tape' is exactly 6 words, complete, and answers the prompt directly.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'A student wrote the following answer: 'Vaccination of infants against measles, polio, and yellow fever.' How many marks will WAEC award this submission?'",
    question: "What score will this submission receive under WAEC summary marking rules?",
    options: [
      "Full marks because it lists the three diseases",
      "Zero (0) marks because it is an incomplete noun phrase lacking a finite verb",
      "Half marks for good handwriting",
      "Bonus marks for medical vocabulary"
    ],
    answer: "Zero (0) marks because it is an incomplete noun phrase lacking a finite verb",
    hint: "Answers that are noun phrases without a finite verb are awarded zero marks for grammatical incompleteness.",
    solution: "The submission is a noun phrase without a finite verb. In WAEC marking schemes, incomplete grammatical fragments receive zero (0) marks.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'Community assemblies must construct public storm drains along commercial roads to avert perennial rainwater flooding.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what assemblies must construct.\nWhich summary qualifies for full marks?",
    options: [
      "Assemblies must construct public storm drains.",
      "Constructing public storm drains along commercial roads.",
      "Public storm drains to avert rainwater flooding.",
      "Building storm drains."
    ],
    answer: "Assemblies must construct public storm drains.",
    hint: "Count words: exactly 6 words, complete Subject-Verb-Object syntax.",
    solution: "'Assemblies must construct public storm drains' is exactly 6 words, active, and complete.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'When asked to summarize in one sentence, a candidate wrote two separate sentences separated by a full stop: 'The assembly must build drains. They must also pave roads.' How will this be penalized?'",
    question: "What penalty applies when a student writes two sentences instead of one?",
    options: [
      "Both sentences are marked and added together",
      "The examiner marks only the first sentence and ignores or penalizes the second for breaching the one-sentence rule",
      "Full marks are awarded automatically",
      "The candidate is given extra examination time"
    ],
    answer: "The examiner marks only the first sentence and ignores or penalizes the second for breaching the one-sentence rule",
    hint: "Writing two sentences breaches the instruction 'In ONE sentence'.",
    solution: "When the instruction explicitly specifies 'In ONE sentence', submitting two sentences breaches instructions; examiners mark only the first and penalize the violation.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'The ministry of health should deploy mobile clinical vans to remote villages to deliver essential primary healthcare services.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what the ministry should deploy.\nWhich summary earns full marks?",
    options: [
      "Ministry must deploy mobile clinical vans.",
      "Deploying mobile clinical vans to remote villages.",
      "Mobile clinical vans for primary healthcare services.",
      "Vans for healthcare."
    ],
    answer: "Ministry must deploy mobile clinical vans.",
    hint: "Count words: exactly 6 words, complete Subject ('Ministry') + Verb ('must deploy') + Object.",
    solution: "'Ministry must deploy mobile clinical vans' has 6 words and complete grammatical structure.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'A candidate submitted: 'Government should definitely, absolutely, and without any delay construct culverts.' Why is this poorly formulated?'",
    question: "What stylistic defect weakens this candidate's summary?",
    options: [
      "It uses unnecessary adverbial padding that wastes precious words under the ceiling",
      "It has no finite verb",
      "It is written in the past tense",
      "It does not have a capital letter"
    ],
    answer: "It uses unnecessary adverbial padding that wastes precious words under the ceiling",
    hint: "Words like 'definitely, absolutely, without any delay' add word count without adding meaning.",
    solution: "Stacking redundant adverbs wastes words under strict limits without adding substantive meaning.",
    target: "Summary Stylistic Auditing"
  },
  {
    passage: "Passage: 'The wildlife division ought to establish buffer zones around national parks to eliminate poaching incursions.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what the division must establish.\nWhich answer qualifies for full marks?",
    options: [
      "Division must establish park buffer zones.",
      "Establishing buffer zones around national parks.",
      "Park buffer zones to eliminate poaching incursions.",
      "Buffer zones against poaching."
    ],
    answer: "Division must establish park buffer zones.",
    hint: "Count words: exactly 6 words, Subject ('Division') + Verb ('must establish') + Object.",
    solution: "'Division must establish park buffer zones' is exactly 6 words, grammatically complete, and concise.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'Why does an answer like 'Because illegal miners pollute rivers' receive zero marks in a summary test?'",
    question: "What grammatical defect renders this submission unacceptable?",
    options: [
      "It is an adverbial clause fragment lacking an independent main clause",
      "It has too few letters",
      "It uses the word 'rivers'",
      "It is written in the active voice"
    ],
    answer: "It is an adverbial clause fragment lacking an independent main clause",
    hint: "A clause introduced by 'Because' is dependent and cannot stand alone as a sentence.",
    solution: "Starting with 'Because...' creates a subordinate adverbial clause fragment. Without a main independent clause, it receives zero marks.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'Agricultural cooperatives should procure mechanized corn shellers to accelerate post-harvest processing for smallholders.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what cooperatives should procure.\nWhich summary earns full marks?",
    options: [
      "Cooperatives should procure mechanized corn shellers.",
      "Procuring mechanized corn shellers for smallholder farmers.",
      "Mechanized corn shellers to accelerate processing.",
      "Corn shellers for farmers."
    ],
    answer: "Cooperatives should procure mechanized corn shellers.",
    hint: "Count words: exactly 6 words, Subject ('Cooperatives') + Verb ('should procure') + Object.",
    solution: "'Cooperatives should procure mechanized corn shellers' has 6 words and complete syntax.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'A student writes: 'The assembly must build drains and pave roads and build schools and hire guards.' What flaw is present here?'",
    question: "What structural flaw characterizes this candidate submission?",
    options: [
      "Polysyndeton / Run-on sentence padding that violates word limits and sentence focus",
      "It is an incomplete fragment lacking a verb",
      "It uses the passive voice",
      "It has no direct object"
    ],
    answer: "Polysyndeton / Run-on sentence padding that violates word limits and sentence focus",
    hint: "Connecting multiple actions with repeated 'and' creates an unfocused run-on sentence.",
    solution: "Stringing multiple independent clauses together with repetitive 'and' creates a run-on sentence that breaches length constraints.",
    target: "Summary Stylistic Auditing"
  },
  {
    passage: "Passage: 'The maritime authority must inspect passenger ferry lifejackets before vessels depart lake harbors to prevent drowning fatalities.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what the authority must inspect.\nWhich answer qualifies for full marks?",
    options: [
      "Authority must inspect passenger ferry lifejackets.",
      "Inspecting passenger ferry lifejackets before departure.",
      "Passenger ferry lifejackets to prevent drowning fatalities.",
      "Lifejackets on lake ferries."
    ],
    answer: "Authority must inspect passenger ferry lifejackets.",
    hint: "Count words: exactly 6 words, complete Subject-Verb-Object syntax.",
    solution: "'Authority must inspect passenger ferry lifejackets' is exactly 6 words and grammatically complete.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'Why does WAEC penalize candidates who include parenthetical brackets like '(e.g., roads, clinics)' in summary answers?'",
    question: "What is the objection to using parenthetical lists in summary sentences?",
    options: [
      "Brackets are illustrative padding that violates conciseness and wastes words",
      "Brackets are not permitted in the English alphabet",
      "Examiners cannot read words in brackets",
      "Brackets change the spelling of words"
    ],
    answer: "Brackets are illustrative padding that violates conciseness and wastes words",
    hint: "Summaries require generalized propositions without parenthetical examples.",
    solution: "Parenthetical illustrations indicate failure to synthesize; they waste words under strict ceilings and are penalized as illustrative padding.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'Forestry guards must extinguish illegal charcoal kilns inside forest reserves to protect timber trees from wildfires.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what guards must do.\nWhich summary earns full marks?",
    options: [
      "Guards must extinguish illegal charcoal kilns.",
      "Extinguishing illegal charcoal kilns inside forest reserves.",
      "Illegal charcoal kilns to protect timber trees.",
      "Putting out charcoal fires."
    ],
    answer: "Guards must extinguish illegal charcoal kilns.",
    hint: "Count words: exactly 6 words, Subject ('Guards') + Verb ('must extinguish') + Object.",
    solution: "'Guards must extinguish illegal charcoal kilns' has 6 words and complete Subject-Verb-Object syntax.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'A candidate submitted: 'To definitely stop the spread of cholera.' Why is this awarded zero marks?'",
    question: "Identify the grammatical failure in this submission.",
    options: [
      "It is an infinitive phrase fragment lacking an active subject and finite verb",
      "It mentions cholera",
      "It is written in red ink",
      "It has too many vowels"
    ],
    answer: "It is an infinitive phrase fragment lacking an active subject and finite verb",
    hint: "An infinitive phrase ('To stop...') cannot function as an independent sentence.",
    solution: "The submission is an infinitive fragment without a subject or finite verb, receiving zero marks for grammatical incompleteness.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'Veterinary officers should inoculate cattle against bovine pleuropneumonia to prevent widespread livestock mortality.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what officers should do.\nWhich answer qualifies for full marks?",
    options: [
      "Officers must inoculate cattle against pneumonia.",
      "Inoculating cattle against bovine pleuropneumonia to prevent mortality.",
      "Bovine pleuropneumonia inoculation for livestock.",
      "Inoculating cattle against disease."
    ],
    answer: "Officers must inoculate cattle against pneumonia.",
    hint: "Count words: exactly 6 words, complete Subject-Verb-Object syntax.",
    solution: "'Officers must inoculate cattle against pneumonia' is exactly 6 words, active, and complete.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'What is the consequence of failing to include a finite verb in a summary answer?'",
    question: "How do WAEC BECE marking guidelines treat summary answers lacking a finite verb?",
    options: [
      "Award half marks for effort",
      "Award ZERO (0) marks for grammatical incompleteness",
      "Award full marks if the meaning is understood",
      "Deduct only one mark"
    ],
    answer: "Award ZERO (0) marks for grammatical incompleteness",
    hint: "A sentence without a finite verb is a fragment and receives no marks.",
    solution: "Under WAEC marking schemes, any summary answer that is a phrase or fragment lacking a finite verb receives zero (0) marks.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'The urban roads authority must pave pedestrian walkways with concrete slabs to protect walkers from vehicular collisions.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what the authority must pave.\nWhich summary qualifies for full marks?",
    options: [
      "Authority must pave pedestrian walkways with slabs.",
      "Paving pedestrian walkways with concrete slabs.",
      "Pedestrian walkways with concrete slabs against collisions.",
      "Paving walkways for pedestrians."
    ],
    answer: "Authority must pave pedestrian walkways with slabs.",
    hint: "Count words: exactly 7 words, complete Subject ('Authority') + Verb ('must pave') + Object.",
    solution: "'Authority must pave pedestrian walkways with slabs' is exactly 7 words, active, and complete.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'A student copied a full thirty-word sentence verbatim from the text and claimed it was the best summary answer. What will the examiner do?'",
    question: "How will this thirty-word copied sentence be graded under an 8-word instruction?",
    options: [
      "Award full marks because it is accurate to the text",
      "Award zero marks due to severe word-ceiling violation and mindless lifting penalties",
      "Select the best eight words and score them",
      "Ask the student to rewrite it"
    ],
    answer: "Award zero marks due to severe word-ceiling violation and mindless lifting penalties",
    hint: "Exceeding the ceiling by 22 words and lifting verbatim leads to zero marks.",
    solution: "Submitting 30 words when 8 were requested violates the ceiling massively; combined with verbatim lifting, it receives zero marks.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'Public health agencies ought to fumigate open refuse dumps periodically to suppress housefly vectors and disease transmission.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what agencies should fumigate.\nWhich answer earns full marks?",
    options: [
      "Agencies must fumigate open refuse dumps.",
      "Fumigating open refuse dumps periodically to suppress houseflies.",
      "Open refuse dumps against disease transmission.",
      "Fumigating refuse dumps."
    ],
    answer: "Agencies must fumigate open refuse dumps.",
    hint: "Count words: exactly 6 words, Subject ('Agencies') + Verb ('must fumigate') + Object.",
    solution: "'Agencies must fumigate open refuse dumps' is exactly 6 words and grammatically complete.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'Why is an answer like 'The eradication of malaria in rural communities' scored zero marks in a summary question requiring a sentence?'",
    question: "Identify the grammatical fault in this candidate submission.",
    options: [
      "It is a bare noun phrase lacking a finite verb",
      "It is too short",
      "It uses the word 'malaria'",
      "It has no adjectives"
    ],
    answer: "It is a bare noun phrase lacking a finite verb",
    hint: "The phrase has a head noun ('eradication') but lacks a finite verb.",
    solution: "The answer is a noun phrase without a finite verb. Without a finite verb, it is not a grammatical sentence and receives zero marks.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'Secondary school administrations must install digital CCTV cameras across campuses to curb vandalism and unauthorized night exits.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what administrations must install.\nWhich summary qualifies for full marks?",
    options: [
      "Administrations must install campus CCTV cameras.",
      "Installing digital CCTV cameras across school campuses.",
      "Digital CCTV cameras to curb campus vandalism.",
      "CCTV cameras in schools."
    ],
    answer: "Administrations must install campus CCTV cameras.",
    hint: "Count words: exactly 6 words, complete Subject-Verb-Object syntax.",
    solution: "'Administrations must install campus CCTV cameras' is exactly 6 words, active, and complete.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'A candidate begins a summary sentence with: 'According to the author of the passage in paragraph two...' Why is this poor practice?'",
    question: "Why should introductory attribution phrases be avoided in constrained summaries?",
    options: [
      "They waste 10 words on useless attribution before the answer even begins",
      "The author does not like being mentioned",
      "Paragraph numbers are confidential",
      "Attribution is illegal in examinations"
    ],
    answer: "They waste 10 words on useless attribution before the answer even begins",
    hint: "Under an 8-word limit, a 10-word attribution clause breaches the ceiling before stating the answer.",
    solution: "Introductory attributions consume words needlessly; under an 8-word limit, such phrases breach the ceiling before stating the core point.",
    target: "Summary Stylistic Auditing"
  },
  {
    passage: "Passage: 'The meteorological agency must upgrade radar warning systems to provide timely alerts on severe monsoon downpours.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what the agency must upgrade.\nWhich answer earns full marks?",
    options: [
      "Agency must upgrade radar warning systems.",
      "Upgrading radar warning systems for monsoon downpours.",
      "Radar warning systems for timely weather alerts.",
      "Upgrading weather radars."
    ],
    answer: "Agency must upgrade radar warning systems.",
    hint: "Count words: exactly 6 words, Subject ('Agency') + Verb ('must upgrade') + Object.",
    solution: "'Agency must upgrade radar warning systems' has 6 words and complete syntax.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'A student wrote: 'Government must build roads; also, government must build schools.' Why is this compound sentence penalized?'",
    question: "What rule violation is committed by this compound submission?",
    options: [
      "It wastes words through unnecessary coordination when a single unified sentence was required",
      "It has no verbs",
      "It does not mention roads",
      "It is written in the passive voice"
    ],
    answer: "It wastes words through unnecessary coordination when a single unified sentence was required",
    hint: "Duplicating subjects and verbs wastes words under tight ceilings.",
    solution: "Using clumsy compound coordination duplicates subjects and verbs, wasting words under tight limits.",
    target: "Summary Stylistic Auditing"
  },
  {
    passage: "Passage: 'Community water committees should service motorized borehole pumps periodically to ensure uninterrupted domestic water supply.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what committees should service.\nWhich answer qualifies for full marks?",
    options: [
      "Committees should service motorized borehole pumps.",
      "Servicing motorized borehole pumps periodically for water.",
      "Motorized borehole pumps for domestic water supply.",
      "Servicing water pumps."
    ],
    answer: "Committees should service motorized borehole pumps.",
    hint: "Count words: exactly 6 words, complete Subject-Verb-Object syntax.",
    solution: "'Committees should service motorized borehole pumps' is exactly 6 words and grammatically complete.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'Why does an examiner penalize an answer that replaces words with mathematical symbols like '&', '+', or 'w/' in an English summary test?'",
    question: "What is the penalty for using informal shorthand symbols in formal summary exams?",
    options: [
      "Deductions for informal abbreviation and mechanical inaccuracy",
      "Awarding extra points for mathematical creativity",
      "The examiner converts symbols into words without penalty",
      "Symbols count as five words each"
    ],
    answer: "Deductions for informal abbreviation and mechanical inaccuracy",
    hint: "Formal English examinations forbid informal shorthand symbols like '&' or 'w/'.",
    solution: "Using informal symbols in formal exams violates mechanical accuracy standards and results in expression deductions.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'The road safety authority must enforce speed governor installation on commercial freight trucks to lower accident fatalities.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what the authority must enforce.\nWhich answer earns full marks?",
    options: [
      "Authority must enforce truck speed governors.",
      "Enforcing speed governor installation on freight trucks.",
      "Speed governor installation on commercial freight trucks.",
      "Speed governors on trucks."
    ],
    answer: "Authority must enforce truck speed governors.",
    hint: "Count words: exactly 6 words, Subject ('Authority') + Verb ('must enforce') + Object.",
    solution: "'Authority must enforce truck speed governors' is exactly 6 words, active, and complete.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'A candidate wrote: 'Building concrete culverts across drainage channels.' Why did the examiner mark this with zero?'",
    question: "Identify the grammatical fault in this candidate submission.",
    options: [
      "It is a participial phrase fragment lacking an active subject and finite verb",
      "It has too many prepositions",
      "Culverts are not made of concrete",
      "It is written in capital letters"
    ],
    answer: "It is a participial phrase fragment lacking an active subject and finite verb",
    hint: "A participle ('Building...') without an auxiliary or subject cannot form a complete sentence.",
    solution: "Beginning with 'Building...' forms a participial fragment. Without a subject or finite verb, it is grammatically incomplete and receives zero marks.",
    target: "Summary Penalty Diagnostics"
  },
  {
    passage: "Passage: 'The forestry commission should deploy satellite monitoring drones to detect unauthorized illegal logging within forest reserves.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what the commission should deploy.\nWhich answer qualifies for full marks?",
    options: [
      "Commission should deploy forest monitoring drones.",
      "Deploying satellite monitoring drones in forest reserves.",
      "Satellite monitoring drones against illegal logging.",
      "Drones in forests."
    ],
    answer: "Commission should deploy forest monitoring drones.",
    hint: "Count words: exactly 6 words, complete Subject-Verb-Object syntax.",
    solution: "'Commission should deploy forest monitoring drones' is exactly 6 words and grammatically complete.",
    target: "8-Word Rule Compliance"
  },
  {
    passage: "Passage: 'What is the golden rule of WAEC summary sentence formulation?'",
    question: "Which formula represents the golden standard for scoring full marks in summary writing?",
    options: [
      "Subject + Finite Verb + Object within word limits",
      "A long list of quoted phrases from the text",
      "A dependent clause beginning with 'Because...'",
      "An infinitive phrase beginning with 'To...'"
    ],
    answer: "Subject + Finite Verb + Object within word limits",
    hint: "An independent clause with an explicit subject and finite verb, adhering to length limits.",
    solution: "The gold standard is a complete independent sentence (Subject + Finite Verb + Object) within the prescribed word ceiling.",
    target: "Summary Compliance Standard"
  },
  {
    passage: "Passage: 'Environmental protection agencies must mandate effluent filtration plants in chemical manufacturing factories to prevent toxic river pollution.'",
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state what agencies must mandate.\nWhich answer earns full marks?",
    options: [
      "Agencies must mandate factory effluent plants.",
      "Mandating effluent filtration plants in chemical factories.",
      "Effluent filtration plants to prevent river pollution.",
      "Filtration plants in factories."
    ],
    answer: "Agencies must mandate factory effluent plants.",
    hint: "Count words: exactly 6 words, Subject ('Agencies') + Verb ('must mandate') + Object.",
    solution: "'Agencies must mandate factory effluent plants' is exactly 6 words, complete, and answers the prompt directly.",
    target: "8-Word Rule Compliance"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH AGBOGBLOSHIE PASSAGE (51 TO 55)
// =========================================================================
const capstone5B9AdvancedQuestions = [
  {
    questionNumber: 51,
    question: "According to paragraph 2, what crude method was used by scrap workers to strip plastic insulation from copper wires?",
    options: [
      "Submerging wires in cold saltwater tanks",
      "Burning bundles of electrical cables on open bonfires fueled by discarded rubber tires",
      "Stripping insulation with mechanical wire strippers",
      "Dissolving plastic with acid in clay pots"
    ],
    answer: "Burning bundles of electrical cables on open bonfires fueled by discarded rubber tires",
    hint: "Scan paragraph 2 for the open burning method using vehicular tires.",
    solution: "Paragraph 2 states that workers 'burned bundles of electrical cables on open bonfire hearths fueled by discarded vehicular rubber tires.'",
    target: "Capstone Exam: Literal Fact Retrieval"
  },
  {
    questionNumber: 52,
    question: "What figure of speech is used in describing the Korle Lagoon as 'a stygian sewer devoid of aquatic life' in paragraph 2, and what does it mean?",
    options: [
      "Simile; meaning the lagoon looks like clear spring water",
      "Metaphor (with Classical Allusion); meaning a dark, polluted, death-like river of waste",
      "Personification; meaning the lagoon can speak to residents",
      "Hyperbole; meaning the lagoon has turned into solid gold"
    ],
    answer: "Metaphor (with Classical Allusion); meaning a dark, polluted, death-like river of waste",
    hint: "'Stygian' alludes to the River Styx in the underworld; describing the lagoon as a sewer is a direct comparison.",
    solution: "Calling the lagoon a 'stygian sewer' is a metaphor alluding to the mythical dark River Styx, emphasizing lethal pollution and decay.",
    target: "Capstone Exam: Figurative Language & Allusion"
  },
  {
    questionNumber: 53,
    question: "As used in paragraph 3, what does the word 'spontaneous' mean ('spontaneous miscarriages among riverside populations')?",
    options: [
      "Planned in advance by medical doctors",
      "Occurring naturally, suddenly, and without external premeditation or intent",
      "Extremely pleasant and cheerful",
      "Caused by lack of sleep"
    ],
    answer: "Occurring naturally, suddenly, and without external premeditation or intent",
    hint: "In medical pathology, a spontaneous condition occurs naturally and involuntarily as a result of toxic disease.",
    solution: "In medical terminology, 'spontaneous' describes physiological events that occur naturally, involuntarily, and suddenly due to disease.",
    target: "Capstone Exam: Contextual Vocabulary"
  },
  {
    questionNumber: 54,
    question: "What does the passage imply about the international trade in 'reusable second-hand consumer electronics' mentioned in paragraph 1?",
    options: [
      "Developed nations send brand-new computers as generous humanitarian gifts",
      "Developed nations use the second-hand electronics label as a pretext to dump hazardous electronic waste in Africa",
      "African countries ban all imported electronic computers",
      "All imported second-hand televisions function perfectly for twenty years"
    ],
    answer: "Developed nations use the second-hand electronics label as a pretext to dump hazardous electronic waste in Africa",
    hint: "Notice the phrase 'under the guise of reusable second-hand consumer electronics'.",
    solution: "The phrase 'under the guise of...' implies deception: shipping obsolete waste masked as usable goods to bypass international waste disposal treaties.",
    target: "Capstone Exam: Critical Deduction & Subtext"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state how modern recycling plants recover metals safely in paragraph 4.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Modern facilities recover metals cleanly through shredding.",
      "Recovering metals cleanly without combustion using engineered shredding facilities.",
      "Because burning causes toxic smoke, modern factories recover metals through mechanized shredders.",
      "Shredding facilities."
    ],
    answer: "Modern facilities recover metals cleanly through shredding.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Modern facilities recover metals cleanly through shredding' is exactly 7 words, possesses complete Subject-Verb-Object syntax, and answers the prompt directly. Option B is an unattached fragment (0 marks).",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

async function deployUniqueB9Advanced() {
  console.log("Building 55 UNIQUE questions for Basic 9 Advanced...");

  const all55Questions: LabQuestion[] = [];

  // 1. Add Questions 1 to 50 (Short drills with unique passages)
  unique50B9AdvancedDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B9_A_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B9",
      difficulty: "advanced",
      questionNumber: qNum,
      isCapstoneExamPassage: false,
      passageText: item.passage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B9.2.2.1: Enforce strict 8-word ceilings, audit grammatical completeness, diagnose fragment errors, and prevent lifting penalties."
    });
  });

  // 2. Add Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B9AdvancedQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${agbogbloshieFullPassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B9_A_${item.questionNumber}`,
      level: "B9",
      difficulty: "advanced",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: agbogbloshieFullPassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B9.2.1.1 / B9.2.2.1: Comprehensive multi-paragraph textual analysis, classical allusion decoding, and constrained 8-word summary formulation."
    });
  });

  const db = await getDb();

  const paths = [
    "global_curriculum/jhs/subjects/english/topical/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topics/reading_comprehension_summary",
    "global_curriculum/jhs/subjects/english/topical_units/reading_comprehension_summary"
  ];

  // 3. Write to subcollection B9_advanced across all paths
  for (const mainPath of paths) {
    const targetDoc = db.doc(`${mainPath}/practice_labs/B9_advanced`);
    await targetDoc.set({
      level: "B9",
      difficulty: "advanced",
      title: "Basic 9 Advanced Lab: 50 Unique Summary Compliance Drills + 5 Capstone Exam Questions",
      totalQuestions: all55Questions.length,
      shortDrillsCount: 50,
      capstoneExamQuestionsCount: 5,
      questions: all55Questions,
      metadata: {
        hasDuplicateQuestions: false,
        uniqueQuestionsCount: 55,
        structure: "50 Unique Short Drills (8-Word Ceilings & Penalty Audits) + 5 Capstone Full-Passage Questions",
        passageVisibility: "Passage embedded both in passageText and at the top of prompt",
        updatedAt: new Date().toISOString()
      }
    }, { merge: true });
    console.log(`✅ Subcollection updated at: ${targetDoc.path}`);
  }

  // 4. Synchronize into main topical document practicePool.hard for TopicalLabRunner (level: b9)
  console.log("\nSynchronizing main topical document practicePool.hard for b9 (keeping b7, b8, b9 only)...");
  const mappedHardQuestions = all55Questions.map(q => ({
    id: q.id,
    difficulty: 'hard' as const,
    prompt: q.prompt,
    passageText: q.passageText,
    isCapstoneExamPassage: q.isCapstoneExamPassage,
    options: q.options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: 1,
    learningCompetency: q.learningCompetency
  }));

  for (const mainPath of paths) {
    const mainRef = db.doc(mainPath);
    const snap = await mainRef.get();
    if (snap.exists) {
      const data = snap.data();
      const existingLevels = data.levels || {};
      
      const cleanLevels: Record<string, any> = {
        b7: existingLevels.b7 || {},
        b8: existingLevels.b8 || {},
        b9: {
          ...(existingLevels.b9 || {}),
          practicePool: {
            ...(existingLevels.b9?.practicePool || {}),
            hard: mappedHardQuestions
          }
        }
      };

      const { questions, ...cleanData } = data;

      await mainRef.set({
        ...cleanData,
        levels: cleanLevels,
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Updated main document practicePool.hard for b9 at: ${mainPath}`);
    }
  }

  console.log(`\n✅ SUCCESS: Deployed exactly ${all55Questions.length} unique questions to B9 Advanced!`);
}

deployUniqueB9Advanced()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy B9 Advanced:", err);
    process.exit(1);
  });
