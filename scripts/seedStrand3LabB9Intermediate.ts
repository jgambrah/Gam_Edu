import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

interface LabQuestion {
  id: string;
  level: "B9";
  difficulty: "intermediate";
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
// Strand 3 B9 Intermediate Focus:
// Complex Dependent Collocations, Subjunctive/Gerundial Complementation,
// Contrastive Infinitival vs. Prepositional "To", and Coordinate Objective Case
// =========================================================================
const b9GrammarIntermediateCapstonePassage = 
`The Public Accounts Committee of Parliament convened a televised public hearing in Accra on Thursday afternoon to cross-examine municipal chief executives regarding systemic financial improprieties cited in the Auditor-General's report. The committee chairman commenced the proceedings by congratulating the forensic investigation team on their unyielding diligence in uncovering fictitious procurement invoices. He remarked that statutory accountability was superior to tolerating bureaucratic impunity, emphasizing that rigorous oversight was an indispensable antidote to institutional decay.

When the lead municipal finance director took the stand, the special prosecutor formally accused him of complicity in embezzling four million cedis from the district disability fund. The director vigorously protested his innocence, insisting on presenting unverified commercial bank statements to demonstrate that his personal assets did not derive from state coffers. However, the external forensic auditor testified that the municipal administration had consistently failed to comply with statutory financial management regulations, leaving the local assembly deficient in basic operating liquidity.

The committee subsequently reviewed several questionable infrastructural allocations. The ranking member questioned why the urban roads department had prioritized an expensive dual-carriage bypass over rural feeder roads, pointing out that modern highway construction was hardly an adequate solution to rural agricultural poverty. In her response, the coordinating director stated that the assembly was looking forward to connecting agrarian communities to urban wholesale markets. She explained that regional planners had drafted the arterial blueprint with a view to stimulating trade, urging assembly members to be dedicated to supporting long-term economic transformation.

Before concluding the evidentiary sitting, the committee chairman issued a stern advisory to the regional coordinating council. He stressed that administrative discipline was incompatible with shielding corrupt subordinates, reminding the executives that public funds were entrusted to them and the sovereign citizenry. He warned that the committee would scarcely tolerate any further prevarication during subsequent sittings, concluding that the state was committed to prosecuting all culpable officers so that civil servants would be deterred from misappropriating public resources.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Strand 3 B9 Intermediate Competencies:
// 1. Multi-Clause Dependent Collocations (adjectival, verbal, nominal)
// 2. Complex Preposition + Gerund Chains (prevent from, succeed in, penalize for)
// 3. Deceptive Prepositional "To" vs. Infinitive Marker "To"
// 4. Prepositional Case Assignment across Coordinate Structures
// 5. Semantic Preposition Discrimination (differ from vs. differ with, etc.)
// =========================================================================
const unique50B9GrammarIntermediateDrills = [
  {
    passage: "The president commended the border surveillance detachment and congratulated the sector commander ________ executing the counter-smuggling operation without casualties.",
    question: "Choose the grammatically mandatory dependent preposition:",
    options: ["on", "for", "with", "about"],
    answer: "on",
    hint: "The verb 'congratulate' strictly governs a single partner preposition (or 'upon'), never 'for'.",
    solution: "The verb 'congratulate' strictly governs the dependent preposition 'on' ('congratulate someone on an achievement'). Substituting 'for' is a frequent colloquial error penalized in BECE examinations.",
    target: "Verbal Dependent Prepositions: Congratulate On"
  },
  {
    passage: "The state attorney formally charged the bank teller and accused him ________ falsifying electronic transfer ledgers to siphon corporate funds.",
    question: "Choose the correct dependent preposition:",
    options: ["of", "with", "for", "against"],
    answer: "of",
    hint: "'Accuse' is locked to one partner preposition in standard English grammar.",
    solution: "The verb 'accuse' strictly governs 'of' ('accused of a crime'). While 'charge' takes 'with', 'accuse' must take 'of'.",
    target: "Verbal Dependent Prepositions: Accuse Of"
  },
  {
    passage: "The senior physician insisted that preventive public health sanitation was far superior ________ curative clinical interventions during viral epidemics.",
    question: "Choose the correct comparative preposition:",
    options: ["to", "than", "over", "above"],
    answer: "to",
    hint: "Latin-derived comparative adjectives ending in '-ior' govern a specific preposition.",
    solution: "Latin comparative adjectives like 'superior', 'inferior', 'senior', and 'junior' strictly govern the preposition 'to', never the comparative conjunction 'than'.",
    target: "Adjectival Dependent Prepositions: Superior To"
  },
  {
    passage: "Despite persistent warnings from the audit board, the bursar insisted ________ disbursing institutional petty cash without supporting receipts.",
    question: "Choose the grammatically correct prepositional complement construction:",
    options: ["on disbursing", "to disburse", "in disbursing", "at disbursing"],
    answer: "on disbursing",
    hint: "'Insist' governs 'on', and all prepositions mandate a gerund ('V-ing').",
    solution: "The verb 'insist' governs the preposition 'on'. Prepositions assign objective case and must be complemented by a gerund ('V-ing'), making 'on disbursing' the only viable construction.",
    target: "Preposition + Gerund Mandate: Insist On"
  },
  {
    passage: "The maritime patrol vessel intercepted the foreign trawler and prevented the crew ________ dumping toxic sludge into the territorial waters.",
    question: "Choose the grammatically correct complement construction:",
    options: ["from dumping", "to dump", "from dump", "in dumping"],
    answer: "from dumping",
    hint: "'Prevent' governs 'from', followed by a gerund.",
    solution: "The verb 'prevent' governs the dependent preposition 'from', which must be complemented by a gerund: 'from dumping'. Using a to-infinitive ('to dump') is ungrammatical.",
    target: "Preposition + Gerund Mandate: Prevent From"
  },
  {
    passage: "All mining enterprises operating within the forest buffer reserve must strictly comply ________ statutory environmental reclamation guidelines.",
    question: "Choose the correct dependent preposition:",
    options: ["with", "to", "by", "on"],
    answer: "with",
    hint: "'Comply' is locked to a single partner preposition denoting conformity.",
    solution: "The verb 'comply' strictly governs the preposition 'with' ('comply with regulations'). The erroneous substitution 'comply to' is a frequent diagnostic trap.",
    target: "Verbal Dependent Prepositions: Comply With"
  },
  {
    passage: "The linguistic syntax of northern Gur languages differs fundamentally ________ the coastal Kwa language family.",
    question: "Choose the correct dependent preposition denoting dissimilarity:",
    options: ["from", "with", "to", "than"],
    answer: "from",
    hint: "When expressing contrast or non-identity between two systems, one differs '...'.",
    solution: "The verb 'differ' takes the preposition 'from' when expressing dissimilarity or contrast between entities. 'Differ with' is reserved solely for disagreement with a person's opinion.",
    target: "Verbal Dependent Prepositions: Differ From"
  },
  {
    passage: "Children who possess genetic sickle-cell traits are relatively immune ________ developing lethal cerebral malaria.",
    question: "Choose the correct dependent preposition:",
    options: ["to", "from", "against", "with"],
    answer: "to",
    hint: "'Immune' standardly governs this preposition in medical and biological contexts.",
    solution: "The adjective 'immune' strictly governs the preposition 'to' ('immune to a pathogen'). Using 'from' or 'against' is non-standard in formal syntax.",
    target: "Adjectival Dependent Prepositions: Immune To"
  },
  {
    passage: "After an exhaustive cross-examination, the magistrate pronounced the clearing agent guilty ________ forging customs clearance stamps.",
    question: "Choose the correct dependent preposition:",
    options: ["of", "for", "with", "in"],
    answer: "of",
    hint: "Both 'guilty' and 'innocent' govern the same one-syllable preposition.",
    solution: "The legal adjective 'guilty' governs the dependent preposition 'of' ('guilty of an offense'). Constructing 'guilty for' is ungrammatical.",
    target: "Adjectival Dependent Prepositions: Guilty Of"
  },
  {
    passage: "Thousands of smallholder farmers across the northern plains suffer ________ perennial crop devastation caused by armyworm infestations.",
    question: "Choose the correct dependent preposition:",
    options: ["from", "with", "of", "by"],
    answer: "from",
    hint: "Affliction by diseases, pests, or misfortunes requires this preposition after 'suffer'.",
    solution: "The verb 'suffer' governs the preposition 'from' when denoting affliction by disease, adversity, or damage.",
    target: "Verbal Dependent Prepositions: Suffer From"
  },
  {
    passage: "The public health directorate advised diabetic patients to abstain completely ________ consuming refined sugary beverages.",
    question: "Choose the correct prepositional complement construction:",
    options: ["from consuming", "to consume", "against consuming", "from consume"],
    answer: "from consuming",
    hint: "'Abstain' governs 'from', which demands an '-ing' verbal form.",
    solution: "The verb 'abstain' governs 'from'. Because prepositions require gerundial complementation, 'from consuming' is mandatory.",
    target: "Preposition + Gerund Mandate: Abstain From"
  },
  {
    passage: "The municipal engineer noted that desilting stormwater drains was an indispensable remedy ________ recurrent urban flash floods.",
    question: "Choose the correct dependent preposition governing the noun 'remedy':",
    options: ["for", "to", "against", "of"],
    answer: "for",
    hint: "A 'remedy' is provided 'for' an affliction.",
    solution: "The noun 'remedy' governs the preposition 'for' ('a remedy for an ailment or crisis').",
    target: "Nominal Dependent Prepositions: Remedy For"
  },
  {
    passage: "The agricultural extension division formulated a biological solution ________ the destructive fall armyworm plague.",
    question: "Choose the correct dependent preposition governing the noun 'solution':",
    options: ["to", "for", "of", "about"],
    answer: "to",
    hint: "A 'solution' connects directly to a problem via 'to'.",
    solution: "In standard English usage, the noun 'solution' strictly governs the preposition 'to' ('a solution to a problem'). Saying 'solution for' or 'solution of' is non-standard.",
    target: "Nominal Dependent Prepositions: Solution To"
  },
  {
    passage: "The graduating junior high school students are looking forward to ________ their secondary education at the national science academy.",
    question: "Choose the grammatically correct verbal complement:",
    options: ["pursuing", "pursue", "to pursue", "have pursued"],
    answer: "pursuing",
    hint: "In 'look forward to', 'to' is a true preposition, not an infinitive marker; prepositions demand gerunds.",
    solution: "In the idiom 'look forward to', 'to' functions as an authentic preposition rather than an infinitival particle. True prepositions must be complemented by a gerund ('pursuing').",
    target: "True Prepositional To: Look Forward To"
  },
  {
    passage: "The municipal planning committee strongly objects to ________ high-density commercial markets on preserved wetlands.",
    question: "Choose the correct verbal complement:",
    options: ["siting", "site", "to site", "be sited"],
    answer: "siting",
    hint: "'Object to' contains a true preposition requiring an '-ing' form.",
    solution: "In 'object to', 'to' is a preposition assigning objective case. It requires the gerund 'siting'.",
    target: "True Prepositional To: Object To"
  },
  {
    passage: "Having farmed in the semi-arid zone for thirty years, the peasant cultivators are accustomed to ________ erratic rainfall patterns.",
    question: "Choose the correct verbal complement:",
    options: ["navigating", "navigate", "to navigate", "be navigated"],
    answer: "navigating",
    hint: "'Be accustomed to' takes a gerund complement.",
    solution: "The verbal idiom 'be accustomed to' requires a gerundial complement ('navigating') because 'to' is a true preposition.",
    target: "True Prepositional To: Accustomed To"
  },
  {
    passage: "The ministry of finance negotiated concessionary credit facilities with a view to ________ agricultural irrigation infrastructure.",
    question: "Choose the correct verbal complement:",
    options: ["modernizing", "modernize", "to modernize", "be modernized"],
    answer: "modernizing",
    hint: "The formal idiom 'with a view to' ends in a preposition and demands a gerund.",
    solution: "The phrase 'with a view to' terminates in the preposition 'to', which demands a gerund ('modernizing') rather than an infinitive ('to modernize').",
    target: "True Prepositional To: With A View To"
  },
  {
    passage: "Under rigorous cross-examination by the investigative committee, the accountant confessed to ________ municipal payment vouchers.",
    question: "Choose the grammatically correct complement:",
    options: ["duplicating", "duplicate", "to duplicate", "have duplicated"],
    answer: "duplicating",
    hint: "'Confess to' contains a preposition governing an action; it demands 'V-ing'.",
    solution: "When 'confess to' governs an action, 'to' functions as a preposition requiring the gerund form 'duplicating'.",
    target: "True Prepositional To: Confess To"
  },
  {
    passage: "The environmental protection agency is unreservedly dedicated to ________ pristine coastal mangrove ecosystems.",
    question: "Choose the correct verbal complement:",
    options: ["restoring", "restore", "to restore", "be restored"],
    answer: "restoring",
    hint: "'Dedicated to' contains a preposition that requires a gerund.",
    solution: "The adjectival construction 'dedicated to' incorporates the preposition 'to', mandating the gerundial complement 'restoring'.",
    target: "True Prepositional To: Dedicated To"
  },
  {
    passage: "The dispute over farmland inheritance must be settled amicably between your elder brother and ________.",
    question: "Choose the correct objective pronoun to complete the prepositional phrase:",
    options: ["me", "I", "myself", "mine"],
    answer: "me",
    hint: "Prepositions assign the Objective Case ('me', never 'I') across coordinate structures.",
    solution: "Prepositions govern the Objective (Accusative) Case. The nominative pronoun 'I' is ungrammatical following 'between'. 'Between your elder brother and me' is the only correct form.",
    target: "Prepositional Case Law: Objective Pronouns"
  },
  {
    passage: "This strategic confidential briefing must remain strictly between the regional minister, the police commander, and ________.",
    question: "Choose the correct pronoun:",
    options: ["me", "I", "myself", "mine"],
    answer: "me",
    hint: "Even with multiple coordinate nominals, the preposition 'between' requires an objective pronoun.",
    solution: "Prepositions assign objective case to all coordinated pronoun complements: 'between the minister, the commander, and me'.",
    target: "Prepositional Case Law: Coordinate Pronoun Complements"
  },
  {
    passage: "The disciplinary panel summoned both the senior housemaster and ________ to account for the boarding house disturbances.",
    question: "Choose the correct objective pronoun:",
    options: ["him", "he", "his", "himself"],
    answer: "him",
    hint: "Direct objects of transitive verbs demand objective pronouns ('him', not 'he').",
    solution: "The transitive verb 'summoned' takes an objective case pronoun. The coordinate object must be 'him', not the nominative 'he'.",
    target: "Case Alignment: Coordinate Direct Objects"
  },
  {
    passage: "The headmistress handed the trophy to ________ the victorious debate team delegates.",
    question: "Choose the correct pronoun form preceding the appositive noun phrase:",
    options: ["us", "we", "our", "ourselves"],
    answer: "us",
    hint: "The preposition 'to' requires an objective pronoun before the appositive noun phrase.",
    solution: "The preposition 'to' demands the objective pronoun 'us', not the nominative 'we' ('to us the victorious debate team delegates').",
    target: "Prepositional Case Law: Appositive Pronouns"
  },
  {
    passage: "To ________ did the cabinet secretary deliver the classified intelligence memorandum?",
    question: "Choose the grammatically mandatory objective interrogative pronoun:",
    options: ["whom", "who", "which", "whose"],
    answer: "whom",
    hint: "When an interrogative pronoun directly follows a preposition ('to'), it must be in the objective case.",
    solution: "In formal prescriptive syntax, an interrogative pronoun directly governed by a fronted preposition must take the objective form 'whom': 'To whom did he deliver...'",
    target: "Prepositional Case Law: Whom vs. Who"
  },
  {
    passage: "The young apprentice was completely absorbed ________ calibrating the computerized lathe machinery.",
    question: "Choose the correct dependent preposition:",
    options: ["in", "at", "with", "on"],
    answer: "in",
    hint: "When mentally or physically engrossed in an activity, one is 'absorbed ...'.",
    solution: "The adjective/participle 'absorbed' strictly governs the preposition 'in' ('absorbed in calibrating').",
    target: "Adjectival Dependent Prepositions: Absorbed In"
  },
  {
    passage: "The resident engineer was cited for being negligent ________ conducting structural stress assessments.",
    question: "Choose the correct dependent preposition:",
    options: ["in", "of", "about", "for"],
    answer: "in",
    hint: "One is 'negligent in' executing a duty.",
    solution: "The adjective 'negligent' governs the preposition 'in' when referring to the performance of professional duties.",
    target: "Adjectival Dependent Prepositions: Negligent In"
  },
  {
    passage: "The municipal assembly expressed total confidence ________ the capability of the local contractor to execute the drainage project.",
    question: "Choose the correct dependent preposition governing the noun 'confidence':",
    options: ["in", "on", "for", "with"],
    answer: "in",
    hint: "One places or possesses 'confidence ...' a person or capability.",
    solution: "The noun 'confidence' strictly governs the preposition 'in' ('confidence in the capability').",
    target: "Nominal Dependent Prepositions: Confidence In"
  },
  {
    passage: "The forestry commissioner cautioned the tourists to beware ________ straying into the unmapped mangrove swamps.",
    question: "Choose the correct dependent preposition:",
    options: ["of", "for", "with", "from"],
    answer: "of",
    hint: "'Beware' is a cautionary verb governing a specific one-syllable preposition.",
    solution: "The verb 'beware' strictly governs the preposition 'of' ('beware of straying').",
    target: "Verbal Dependent Prepositions: Beware Of"
  },
  {
    passage: "The laboratory soil sample was critically deficient ________ organic nitrogen and soluble potassium.",
    question: "Choose the correct dependent preposition:",
    options: ["in", "of", "with", "from"],
    answer: "in",
    hint: "When lacking a vital nutrient or substance, an entity is 'deficient ...'.",
    solution: "The adjective 'deficient' governs the preposition 'in' ('deficient in minerals').",
    target: "Adjectival Dependent Prepositions: Deficient In"
  },
  {
    passage: "The regional director's private commercial interests were fundamentally incompatible ________ his statutory regulatory mandate.",
    question: "Choose the correct dependent preposition:",
    options: ["with", "to", "against", "from"],
    answer: "with",
    hint: "Things that cannot coexist harmoniously are 'incompatible ...' each other.",
    solution: "The adjective 'incompatible' strictly governs the preposition 'with'.",
    target: "Adjectival Dependent Prepositions: Incompatible With"
  },
  {
    passage: "The new guidance coordinator is extraordinarily popular ________ the student body because of her approachable demeanor.",
    question: "Choose the correct dependent preposition:",
    options: ["with", "to", "for", "by"],
    answer: "with",
    hint: "A figure enjoying widespread favor among a group is 'popular ...' them.",
    solution: "The adjective 'popular' governs the preposition 'with' (or 'among') when referring to favor within a community.",
    target: "Adjectival Dependent Prepositions: Popular With"
  },
  {
    passage: "Vigilant naval patrol units prevented the unauthorized foreign trawler from ________ in coastal artisanal fishing grounds.",
    question: "Choose the grammatically correct verbal complement following 'from':",
    options: ["trawling", "trawl", "to trawl", "having trawl"],
    answer: "trawling",
    hint: "Prepositions demand a gerund ('V-ing') complement.",
    solution: "The preposition 'from' must be complemented by the gerund 'trawling'. Using an infinitive ('to trawl') is ungrammatical.",
    target: "Preposition + Gerund Mandate"
  },
  {
    passage: "The presiding judge penalized the mining consortium for ________ industrial effluent into the municipal water reservoir.",
    question: "Choose the correct verbal complement following 'for':",
    options: ["discharging", "discharge", "to discharge", "discharged"],
    answer: "discharging",
    hint: "Prepositions assign objective case and require an '-ing' verbal form.",
    solution: "The preposition 'for' takes a gerundial complement ('discharging').",
    target: "Preposition + Gerund Mandate"
  },
  {
    passage: "Through innovative soil conditioning techniques, the cooperative succeeded in ________ double-yield maize harvests.",
    question: "Choose the correct verbal complement following 'in':",
    options: ["producing", "produce", "to produce", "produced"],
    answer: "producing",
    hint: "'Succeed in' is strictly complemented by a gerund.",
    solution: "The verb 'succeed' governs the preposition 'in', which must be complemented by the gerund 'producing'.",
    target: "Preposition + Gerund Mandate: Succeed In"
  },
  {
    passage: "The junior clerk was dismissed for repeatedly ________ classified cabinet minutes to unaccredited journalists.",
    question: "Choose the correct verbal complement following 'for':",
    options: ["leaking", "leak", "to leak", "leaked"],
    answer: "leaking",
    hint: "Prepositions cannot be complemented by bare infinitives or past tense forms.",
    solution: "The preposition 'for' requires a gerund complement ('leaking').",
    target: "Preposition + Gerund Mandate"
  },
  {
    passage: "The state security bureau arrested the foreign operative on suspicion of ________ strategic military communication towers.",
    question: "Choose the correct verbal complement following 'of':",
    options: ["sabotaging", "sabotage", "to sabotage", "sabotaged"],
    answer: "sabotaging",
    hint: "The dependent preposition 'of' following 'suspicion' requires a gerund.",
    solution: "The preposition 'of' mandates the gerundial form 'sabotaging'.",
    target: "Preposition + Gerund Mandate"
  },
  {
    passage: "The headmaster commended the sanitation prefect for ________ meticulous hygiene standards in the dining hall.",
    question: "Choose the correct verbal complement following 'for':",
    options: ["enforcing", "enforce", "to enforce", "enforced"],
    answer: "enforcing",
    hint: "Prepositions demand an '-ing' verbal form.",
    solution: "The preposition 'for' takes the gerund complement 'enforcing'.",
    target: "Preposition + Gerund Mandate"
  },
  {
    passage: "Neither the assistant headmaster nor ________ was informed about the emergency board meeting.",
    question: "Choose the correct pronoun in subject position:",
    options: ["he", "him", "his", "himself"],
    answer: "he",
    hint: "In a coordinate subject structure ('Neither X nor Y'), pronouns must be in the nominative/subjective case.",
    solution: "The pronoun functions as part of the compound subject governing the verb 'was informed', requiring the subjective case 'he'.",
    target: "Case Alignment: Subjective vs. Objective Pronouns"
  },
  {
    passage: "The municipal assembly honored both the traditional queenmother and ________ for their community leadership.",
    question: "Choose the correct pronoun in direct object position:",
    options: ["her", "she", "hers", "herself"],
    answer: "her",
    hint: "Direct object position requires an objective pronoun.",
    solution: "The transitive verb 'honored' governs the objective case, requiring 'her' ('honored both the queenmother and her').",
    target: "Case Alignment: Objective Pronouns"
  },
  {
    passage: "The confidential engineering blueprints were dispatched directly to the chief architect and ________.",
    question: "Choose the correct pronoun following the preposition 'to':",
    options: ["her", "she", "hers", "herself"],
    answer: "her",
    hint: "Prepositions demand the objective case ('her', never 'she').",
    solution: "Prepositions strictly govern objective case pronouns: 'to the chief architect and her'.",
    target: "Prepositional Case Law: Objective Pronouns"
  },
  {
    passage: "Between you and ________, the auditor's interim report contains explosive revelations of procurement fraud.",
    question: "Choose the correct pronoun to complete the prepositional phrase:",
    options: ["me", "I", "myself", "mine"],
    answer: "me",
    hint: "'Between' is a preposition; using 'I' is an erroneous hypercorrection.",
    solution: "Prepositions govern objective case pronouns. The construction 'between you and me' is grammatically mandatory.",
    target: "Prepositional Case Law: Objective Pronouns"
  },
  {
    passage: "The regional minister appointed a five-member monitoring panel comprising Kwesi, Abena, and ________.",
    question: "Choose the correct pronoun in object position:",
    options: ["me", "I", "myself", "mine"],
    answer: "me",
    hint: "'Comprising' governs objective case pronouns.",
    solution: "The transitive participle/preposition 'comprising' governs the objective case: 'Kwesi, Abena, and me'.",
    target: "Prepositional Case Law: Objective Pronouns"
  },
  {
    passage: "The youth association was commended for its dedication ________ rehabilitating dilapidated public schools.",
    question: "Choose the correct dependent preposition governing the noun 'dedication':",
    options: ["to", "for", "in", "with"],
    answer: "to",
    hint: "One shows 'dedication ...' a cause.",
    solution: "The noun 'dedication' strictly governs the preposition 'to' ('dedication to rehabilitating schools').",
    target: "Nominal Dependent Prepositions: Dedication To"
  },
  {
    passage: "The master craftsman takes immense pride ________ restoring century-old ancestral wooden artifacts.",
    question: "Choose the correct dependent preposition governing the idiom 'take pride':",
    options: ["in", "at", "for", "with"],
    answer: "in",
    hint: "One takes 'pride ...' an endeavor (contrast with 'proud of').",
    solution: "The verbal idiom 'take pride' governs the preposition 'in' ('take pride in doing something').",
    target: "Nominal Dependent Prepositions: Pride In"
  },
  {
    passage: "The newly commissioned water filtration plant is capable ________ processing ten thousand liters of river water per hour.",
    question: "Choose the correct dependent preposition governing 'capable':",
    options: ["of", "to", "for", "with"],
    answer: "of",
    hint: "'Capable' takes 'of' + gerund, whereas 'able' takes 'to' + infinitive.",
    solution: "The adjective 'capable' strictly governs the preposition 'of' followed by a gerund ('capable of processing').",
    target: "Adjectival Dependent Prepositions: Capable Of"
  },
  {
    passage: "The presiding judge was completely indifferent ________ the political status of the high-ranking defendants.",
    question: "Choose the correct dependent preposition:",
    options: ["to", "about", "for", "with"],
    answer: "to",
    hint: "When unaffected by external pressure, one is 'indifferent ...' it.",
    solution: "The adjective 'indifferent' strictly governs the preposition 'to' ('indifferent to status or criticism').",
    target: "Adjectival Dependent Prepositions: Indifferent To"
  },
  {
    passage: "The logistics director was reprimanded for being late ________ submitting the national fuel consumption ledger.",
    question: "Choose the correct dependent preposition:",
    options: ["in", "at", "for", "to"],
    answer: "in",
    hint: "When delayed in performing a specific action, one is 'late ...' doing it.",
    solution: "When referring to delay in the performance of an action, 'late' governs 'in' + gerund ('late in submitting').",
    target: "Adjectival Dependent Prepositions: Late In"
  },
  {
    passage: "The displaced flood victims expressed profound gratitude ________ the disaster relief coordinators.",
    question: "Choose the correct dependent preposition:",
    options: ["to", "for", "with", "at"],
    answer: "to",
    hint: "Gratitude is directed 'to' a benefactor.",
    solution: "One expresses gratitude 'to' a person or institution ('gratitude to the coordinators').",
    target: "Nominal Dependent Prepositions: Gratitude To"
  },
  {
    passage: "The financial analyst warned that the debt-ridden corporation was heading ________ catastrophic bankruptcy.",
    question: "Choose the correct dependent preposition:",
    options: ["for", "to", "towards", "at"],
    answer: "for",
    hint: "When moving inexorably toward a negative fate, one is 'heading ...' it.",
    solution: "The idiom 'heading for' signifies inexorable trajectory toward an inevitable negative outcome ('heading for bankruptcy').",
    target: "Verbal Dependent Prepositions: Heading For"
  },
  {
    passage: "The public library's reference department is totally deficient ________ contemporary African scientific journals.",
    question: "Choose the correct dependent preposition:",
    options: ["in", "of", "with", "from"],
    answer: "in",
    hint: "When lacking a vital component, something is 'deficient ...'.",
    solution: "The adjective 'deficient' governs the preposition 'in' ('deficient in journals/nutrients').",
    target: "Adjectival Dependent Prepositions: Deficient In"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// Strand 3 B9 Intermediate Focus:
// Dependent Prepositions, Gerundial Complementation, and Prepositional Case
// =========================================================================
const capstone5B9GrammarIntermediateQuestions = [
  {
    questionNumber: 51,
    question: "In paragraph 1, how do the collocations 'congratulating the forensic investigation team on their unyielding diligence' and 'superior to tolerating bureaucratic impunity' demonstrate dependent preposition rules?",
    options: [
      "The verb 'congratulate' strictly governs 'on', and the comparative adjective 'superior' strictly governs 'to'",
      "Both words arbitrarily govern 'for' in formal Ghanaian legislative syntax",
      "'Congratulate' takes 'for', while 'superior' takes the conjunction 'than'",
      "Prepositions in formal reports are stylistic and interchangeable"
    ],
    answer: "The verb 'congratulate' strictly governs 'on', and the comparative adjective 'superior' strictly governs 'to'",
    hint: "Identify the partner prepositions locked to 'congratulate' and 'superior' in paragraph 1.",
    solution: "Paragraph 1 illustrates two foundational BECE dependent preposition rules: the verb 'congratulate' governs 'on' (not 'for'), and the Latin comparative adjective 'superior' governs 'to' (not 'than').",
    target: "Capstone Exam: Dependent Preposition Verification"
  },
  {
    questionNumber: 52,
    question: "In paragraph 2, what dependent preposition errors did the prosecutor and forensic auditor avoid when the text states that the director was 'accused of complicity' and that the administration had 'failed to comply with statutory financial management regulations'?",
    options: [
      "They avoided constructing 'accused with/for' and avoided constructing 'comply to'",
      "They avoided constructing 'accused about' and 'comply by'",
      "They avoided using passive verbs and gerundial complements",
      "They avoided subject-verb concord errors"
    ],
    answer: "They avoided constructing 'accused with/for' and avoided constructing 'comply to'",
    hint: "Identify the incorrect prepositions commonly substituted for 'of' after 'accuse' and 'with' after 'comply'.",
    solution: "The standard collocations are 'accuse of' (avoiding 'accuse with/for') and 'comply with' (avoiding the common mother-tongue error 'comply to').",
    target: "Capstone Exam: Collocation Diagnostic"
  },
  {
    questionNumber: 53,
    question: "In paragraph 3, why is the construction 'looking forward to connecting' grammatically mandatory instead of 'looking forward to connect'?",
    options: [
      "Because in the verbal idiom 'look forward to', 'to' is a true preposition assigning objective case, requiring a gerundial complement ('V-ing')",
      "Because 'connect' is an irregular verb that rejects bare infinitives",
      "Because 'rural feeder roads' is a plural noun phrase",
      "Because 'looking forward' functions as a past participle"
    ],
    answer: "Because in the verbal idiom 'look forward to', 'to' is a true preposition assigning objective case, requiring a gerundial complement ('V-ing')",
    hint: "Recall the rule distinguishing true prepositional 'to' from the infinitive marker 'to'.",
    solution: "In 'look forward to', 'to' functions as an authentic preposition rather than an infinitival marker. Prepositions assign objective case and must be complemented by a gerund ('connecting'), never an infinitive ('to connect').",
    target: "Capstone Exam: True Prepositional To"
  },
  {
    questionNumber: 54,
    question: "In paragraph 4, why does the sentence 'public funds were entrusted to them and the sovereign citizenry' use the pronoun 'them' instead of 'they'?",
    options: [
      "Because prepositions assign the Objective Case to pronoun complements across coordinate structures",
      "Because 'they' can only be used when referring to elected parliamentarians",
      "Because 'entrusted' is an intransitive verb that rejects nominative subjects",
      "Because 'them' refers exclusively to non-living financial ledgers"
    ],
    answer: "Because prepositions assign the Objective Case to pronoun complements across coordinate structures",
    hint: "Examine the Prepositional Case Law governing pronouns governed by prepositions like 'to'.",
    solution: "Prepositions govern the Objective (Accusative) Case. Nominative pronouns like 'they' are structurally barred as prepositional complements; 'entrusted to them' is grammatically mandatory.",
    target: "Capstone Exam: Prepositional Objective Case Law"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the complementation rule governing prepositions and following verbs in the passage.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Prepositions must be followed by gerunds.",
      "Because prepositions assign objective case, following verbs must always take the '-ing' gerund form.",
      "Using gerunds after English prepositions in formal parliamentary proceedings.",
      "Prepositions govern gerunds."
    ],
    answer: "Prepositions must be followed by gerunds.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Prepositions must be followed by gerunds' is exactly 6 words, forms a complete grammatical sentence with an auxiliary and passive verb ('must be followed'), and states the rule directly. Option C is a fragment (0 marks), Option B has 13 words, and Option D is only 3 words.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployStrand3B9Intermediate() {
  console.log("Building 55 UNIQUE questions for Basic 9 (JHS 3) Strand 3 Grammar Intermediate Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B9GrammarIntermediateDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B9_G_I_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B9",
      difficulty: "intermediate",
      questionNumber: qNum,
      isCapstoneExamPassage: false,
      passageText: item.passage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B9.3.1.1: Demonstrate intermediate grammatical mastery of complex dependent preposition collocations, prepositional gerund complementation, true prepositional 'to', and prepositional objective case assignment across coordinate structures."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B9GrammarIntermediateQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${b9GrammarIntermediateCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B9_G_I_${item.questionNumber}`,
      level: "B9",
      difficulty: "intermediate",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: b9GrammarIntermediateCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B9.3.1.1 / B9.3.1.2: Synthesize intermediate multi-paragraph contextual grammar, evaluating complex dependent preposition collocations, gerundial complementation, prepositional case assignment across coordinate structures, and concise rule summaries."
    });
  });

  // 3. Write directly to Firestore using the unified canonical topic path
  const targetDoc = db.doc(
    "global_curriculum/jhs/subjects/english/topical/grammar_lexis_prepositions_and_phrasal_verbs/practice_labs/B9_intermediate"
  );

  await targetDoc.set({
    level: "B9",
    difficulty: "intermediate",
    title: "Basic 9 Intermediate Lab: 50 Unique Grammar Drills + 5 Capstone Exam Questions",
    totalQuestions: all55Questions.length,
    shortDrillsCount: 50,
    capstoneExamQuestionsCount: 5,
    questions: all55Questions,
    metadata: {
      hasDuplicateQuestions: false,
      uniqueQuestionsCount: 55,
      structure: "50 Unique Short Drills (Complex Dependent Collocations, Gerund Mandate, Coordinate Case Assignment) + 5 Capstone Full-Passage Questions",
      passageVisibility: "Passage embedded both in passageText and at the top of prompt",
      curriculum: "NaCCA Common Core Programme (CCP) Standard",
      strand: "Strand 3: Grammar & Usage",
      subStrand: "Sub-Strand 1: Parts of Speech, Phrasal Verbs & Prepositions",
      canonicalTopicPath: "global_curriculum/jhs/subjects/english/topical/grammar_lexis_prepositions_and_phrasal_verbs",
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  });

  console.log(`\n✅ SUCCESS: Deployed exactly ${all55Questions.length} unique questions to:`);
  console.log(`   ${targetDoc.path}`);
}

deployStrand3B9Intermediate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 3 B9 Intermediate Lab:", err);
    process.exit(1);
  });
