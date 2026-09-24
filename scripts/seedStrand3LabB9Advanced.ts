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
// Strand 3 B9 Advanced Focus:
// Complex Forensic Collocations, Gerundial Complementation,
// Contrastive Infinitival vs. Prepositional "To", and Coordinate Objective Case
// =========================================================================
const b9GrammarAdvancedCapstonePassage = 
`The special presidential commission of inquiry on state land allocation convened its valedictory plenary session in Accra to deliver its forensic findings on municipal real-estate expropriations. Delivering the executive summary, the presiding appellate justice began by congratulating the forensic land survey task force on their incorruptible vigilance in uncovering fraudulent title registrations. She remarked that institutional transparency was superior to tolerating bureaucratic venality, reiterating that unbending statutory oversight was an indispensable antidote to administrative graft.

When the former chief town planner took the stand, the lead investigator formally accused him of complicity in facilitating the illegal rezoning of environmentally protected coastal wetlands. The former director vigorously defended his professional conduct, insisting on introducing disputed cadastral blueprints to demonstrate that his zoning determinations did not differ from those of past ministerial regimes. However, the senior state counsel presented incontrovertible evidence showing that the municipal department had consistently failed to comply with statutory spatial planning directives, leaving the coastal biosphere deficient in vital natural flood defenses.

The commission subsequently interrogated several contentious commercial leases. The lead legal counsel questioned why the planning secretariat had prioritized luxury waterfront resorts over drainage infrastructure, noting that constructing gated enclaves was hardly an acceptable solution to systemic municipal flooding. In her testimony, the coordinating municipal director stated that the commercial division was looking forward to commissioning an integrated marine revetment wall. She explained that civil engineers had designed the sea-defense works with a view to protecting vulnerable fishing enclaves, asserting that the administration was committed to restoring ecological equilibrium.

Before concluding the final sitting, the commission chairperson issued a stern statutory directive to the lands commission secretariat. She stressed that administrative fidelity was incompatible with shielding corrupt surveyors, reminding the assembled directors that public land administration had been entrusted to them and the sovereign republic. She warned that the judicial service would scarcely tolerate any further falsification of registry records, affirming that the state was dedicated to prosecuting all compromised officials so that civil servants would be deterred from misappropriating public patrimony.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Strand 3 B9 Advanced Competencies:
// 1. High-Register Dependent Collocations (verbal, adjectival, nominal)
// 2. Preposition + Gerund Chains in Complex Embedded Syntax
// 3. Deceptive Prepositional "To" vs. Infinitival Marker "To"
// 4. Prepositional Case Law across Complex Coordinate Nominal Structures
// 5. Semantic Preposition Discrimination in Legal/Academic Registers
// =========================================================================
const unique50B9GrammarAdvancedDrills = [
  {
    passage: "The judicial council convened an emergency session and congratulated the senior state prosecutor ________ securing the landmark anti-corruption conviction.",
    question: "Choose the grammatically mandatory dependent preposition:",
    options: ["on", "for", "with", "about"],
    answer: "on",
    hint: "The verb 'congratulate' strictly governs 'on' (or 'upon'), never 'for'.",
    solution: "The verb 'congratulate' governs the dependent preposition 'on' in formal English ('congratulate someone on something'). Substituting 'for' is an erroneous colloquialism.",
    target: "Verbal Dependent Prepositions: Congratulate On"
  },
  {
    passage: "The public prosecutor filed a formal indictment and accused the former accountant-general ________ laundering state treasury subventions through offshore shell corporations.",
    question: "Choose the correct dependent preposition:",
    options: ["of", "with", "for", "against"],
    answer: "of",
    hint: "'Accuse' is locked to one partner preposition in formal jurisprudence.",
    solution: "The verb 'accuse' strictly governs the preposition 'of' ('accused of an offense'). Constructing 'accused for' or 'accused with' is ungrammatical.",
    target: "Verbal Dependent Prepositions: Accuse Of"
  },
  {
    passage: "The academic board demonstrated that the revised competency-based science curriculum was far superior ________ the discarded rote-memorization syllabus.",
    question: "Choose the correct comparative preposition:",
    options: ["to", "than", "over", "above"],
    answer: "to",
    hint: "Latin-derived comparative adjectives ending in '-ior' govern 'to', never 'than'.",
    solution: "Latin comparative adjectives such as 'superior', 'inferior', 'senior', and 'junior' govern the preposition 'to', never the comparative conjunction 'than'.",
    target: "Adjectival Dependent Prepositions: Superior To"
  },
  {
    passage: "Despite repeated injunctions from the municipal planning authority, the developer insisted ________ erecting commercial warehouses within the designated green belt.",
    question: "Choose the grammatically correct prepositional complement construction:",
    options: ["on erecting", "to erect", "in erecting", "at erecting"],
    answer: "on erecting",
    hint: "'Insist' governs 'on', and all prepositions mandate a gerund ('V-ing').",
    solution: "The verb 'insist' governs the preposition 'on'. Prepositions assign objective case and must be complemented by a gerund ('V-ing'), making 'on erecting' the only viable construction.",
    target: "Preposition + Gerund Mandate: Insist On"
  },
  {
    passage: "Vigilant naval patrol squadrons intercepted the foreign industrial trawler and prevented the crew ________ depleting endangered demersal fish stocks.",
    question: "Choose the grammatically correct complement construction:",
    options: ["from depleting", "to deplete", "from deplete", "in depleting"],
    answer: "from depleting",
    hint: "'Prevent' governs 'from', followed by a gerund.",
    solution: "The verb 'prevent' governs the dependent preposition 'from', which must be complemented by a gerund ('from depleting'). Constructing an infinitive ('to deplete') is ungrammatical.",
    target: "Preposition + Gerund Mandate: Prevent From"
  },
  {
    passage: "All international maritime freight carriers navigating the Gulf of Guinea must strictly comply ________ environmental ballast-water discharge protocols.",
    question: "Choose the correct dependent preposition:",
    options: ["with", "to", "by", "on"],
    answer: "with",
    hint: "'Comply' is locked to a single partner preposition denoting conformity.",
    solution: "The verb 'comply' strictly governs the preposition 'with' ('comply with protocols'). The erroneous substitution 'comply to' is a common diagnostic trap.",
    target: "Verbal Dependent Prepositions: Comply With"
  },
  {
    passage: "The morphological structure of the Volta-Comoe linguistic branch differs substantially ________ the Mande language family of the upper Niger basin.",
    question: "Choose the correct dependent preposition denoting dissimilarity:",
    options: ["from", "with", "to", "than"],
    answer: "from",
    hint: "When expressing contrast or non-identity between two systems, one differs '...'.",
    solution: "The verb 'differ' takes the preposition 'from' when expressing dissimilarity or contrast between entities. 'Differ with' is reserved solely for interpersonal disagreement.",
    target: "Verbal Dependent Prepositions: Differ From"
  },
  {
    passage: "Populations residing in endemic river basins who have received prophylactic inoculation are effectively immune ________ contracting virulent yellow fever.",
    question: "Choose the correct dependent preposition:",
    options: ["to", "from", "against", "with"],
    answer: "to",
    hint: "'Immune' standardly governs this preposition in medical and biological contexts.",
    solution: "The adjective 'immune' strictly governs the preposition 'to' ('immune to an infection'). Using 'from' or 'against' is non-standard in formal syntax.",
    target: "Adjectival Dependent Prepositions: Immune To"
  },
  {
    passage: "Following an unannounced forensic audit, the high court justice pronounced the procurement coordinator guilty ________ collusive bid-rigging.",
    question: "Choose the correct dependent preposition:",
    options: ["of", "for", "with", "in"],
    answer: "of",
    hint: "Both 'guilty' and 'innocent' govern the same one-syllable preposition.",
    solution: "The legal adjective 'guilty' governs the dependent preposition 'of' ('guilty of an offense'). Constructing 'guilty for' is ungrammatical.",
    target: "Adjectival Dependent Prepositions: Guilty Of"
  },
  {
    passage: "Hundreds of artisanal cocoa producers in the deciduous forest belt suffer ________ systemic post-harvest crop losses due to black-pod fungal blight.",
    question: "Choose the correct dependent preposition:",
    options: ["from", "with", "of", "by"],
    answer: "from",
    hint: "Affliction by diseases, blights, or adversities requires this preposition after 'suffer'.",
    solution: "The verb 'suffer' governs the preposition 'from' when denoting affliction by disease, adversity, or damage.",
    target: "Verbal Dependent Prepositions: Suffer From"
  },
  {
    passage: "The chief medical officer advised recovering cardiac patients to abstain rigorously ________ ingesting saturated trans-fatty culinary oils.",
    question: "Choose the correct prepositional complement construction:",
    options: ["from ingesting", "to ingest", "against ingesting", "from ingest"],
    answer: "from ingesting",
    hint: "'Abstain' governs 'from', which demands an '-ing' verbal form.",
    solution: "The verb 'abstain' governs 'from'. Because prepositions require gerundial complementation, 'from ingesting' is mandatory.",
    target: "Preposition + Gerund Mandate: Abstain From"
  },
  {
    passage: "The civil engineering advisory board stressed that constructing retention reservoirs was the only permanent remedy ________ catastrophic municipal storm surges.",
    question: "Choose the correct dependent preposition governing the noun 'remedy':",
    options: ["for", "to", "against", "of"],
    answer: "for",
    hint: "A 'remedy' is provided 'for' an affliction.",
    solution: "The noun 'remedy' governs the preposition 'for' ('a remedy for an ongoing hazard or illness').",
    target: "Nominal Dependent Prepositions: Remedy For"
  },
  {
    passage: "The national environmental task force developed an innovative biotechnological solution ________ toxic heavy-metal contamination in artisanal mining waterways.",
    question: "Choose the correct dependent preposition governing the noun 'solution':",
    options: ["to", "for", "of", "about"],
    answer: "to",
    hint: "A 'solution' connects directly to a problem via 'to'.",
    solution: "In standard English usage, the noun 'solution' strictly governs the preposition 'to' ('a solution to a technical problem'). Saying 'solution for' or 'solution of' is non-standard.",
    target: "Nominal Dependent Prepositions: Solution To"
  },
  {
    passage: "The research fellows at the atomic energy commission are looking forward to ________ the experimental nuclear fusion reactor.",
    question: "Choose the grammatically correct verbal complement:",
    options: ["commissioning", "commission", "to commission", "have commissioned"],
    answer: "commissioning",
    hint: "In 'look forward to', 'to' is a true preposition, not an infinitive marker; prepositions demand gerunds.",
    solution: "In the idiom 'look forward to', 'to' functions as an authentic preposition rather than an infinitival particle. True prepositions must be complemented by a gerund ('commissioning').",
    target: "True Prepositional To: Look Forward To"
  },
  {
    passage: "The environmental protection council vigorously objects to ________ commercial petroleum refineries within designated coastal mangrove sanctuaries.",
    question: "Choose the correct verbal complement:",
    options: ["siting", "site", "to site", "be sited"],
    answer: "siting",
    hint: "'Object to' contains a true preposition requiring an '-ing' form.",
    solution: "In 'object to', 'to' is a preposition assigning objective case. It requires the gerund 'siting'.",
    target: "True Prepositional To: Object To"
  },
  {
    passage: "Having conducted ethnological field studies in the Sahara for three decades, the anthropologists are accustomed to ________ acute diurnal temperature fluctuations.",
    question: "Choose the correct verbal complement:",
    options: ["enduring", "endure", "to endure", "be endured"],
    answer: "enduring",
    hint: "'Be accustomed to' takes a gerund complement.",
    solution: "The verbal idiom 'be accustomed to' requires a gerundial complement ('enduring') because 'to' is a true preposition.",
    target: "True Prepositional To: Accustomed To"
  },
  {
    passage: "The central monetary authority restructured foreign reserve allocations with a view to ________ macroeconomic exchange-rate stability.",
    question: "Choose the correct verbal complement:",
    options: ["stabilizing", "stabilize", "to stabilize", "be stabilized"],
    answer: "stabilizing",
    hint: "The formal idiom 'with a view to' ends in a preposition and demands a gerund.",
    solution: "The phrase 'with a view to' terminates in the preposition 'to', which demands a gerund ('stabilizing') rather than an infinitive ('to stabilize').",
    target: "True Prepositional To: With A View To"
  },
  {
    passage: "Under unrelenting forensic cross-examination, the disgraced municipal treasurer confessed to ________ municipal expenditure sub-warrants.",
    question: "Choose the grammatically correct complement:",
    options: ["forging", "forge", "to forge", "have forged"],
    answer: "forging",
    hint: "'Confess to' contains a preposition governing an action; it demands 'V-ing'.",
    solution: "When 'confess to' governs an action, 'to' functions as a preposition requiring the gerund form 'forging'.",
    target: "True Prepositional To: Confess To"
  },
  {
    passage: "The international public health consortium is unreservedly committed to ________ communicable river-blindness across sub-Saharan Africa.",
    question: "Choose the correct verbal complement:",
    options: ["eradicating", "eradicate", "to eradicate", "be eradicated"],
    answer: "eradicating",
    hint: "'Committed to' contains a preposition that requires a gerund.",
    solution: "The adjectival construction 'committed to' incorporates the preposition 'to', mandating the gerundial complement 'eradicating'.",
    target: "True Prepositional To: Committed To"
  },
  {
    passage: "The proprietary intellectual patent rights must be apportioned strictly between the lead biomedical researcher and ________.",
    question: "Choose the correct objective pronoun to complete the prepositional phrase:",
    options: ["me", "I", "myself", "mine"],
    answer: "me",
    hint: "Prepositions assign the Objective Case ('me', never 'I') across coordinate structures.",
    solution: "Prepositions govern the Objective (Accusative) Case. The nominative pronoun 'I' is ungrammatical following 'between'. 'Between the lead researcher and me' is the only correct form.",
    target: "Prepositional Case Law: Objective Pronouns"
  },
  {
    passage: "This strategic counter-intelligence dossier must remain confidential between the sector director, the attorney-general, and ________.",
    question: "Choose the correct pronoun:",
    options: ["me", "I", "myself", "mine"],
    answer: "me",
    hint: "Even with multiple coordinate nominals, the preposition 'between' requires an objective pronoun.",
    solution: "Prepositions assign objective case to all coordinated pronoun complements: 'between the director, the attorney-general, and me'.",
    target: "Prepositional Case Law: Coordinate Pronoun Complements"
  },
  {
    passage: "The independent judicial inquiry summoned both the former cabinet minister and ________ to clarify disputed disbursement ledgers.",
    question: "Choose the correct objective pronoun:",
    options: ["him", "he", "his", "himself"],
    answer: "him",
    hint: "Direct objects of transitive verbs demand objective pronouns ('him', not 'he').",
    solution: "The transitive verb 'summoned' takes an objective case pronoun. The coordinate object must be 'him', not the nominative 'he'.",
    target: "Case Alignment: Coordinate Direct Objects"
  },
  {
    passage: "The appellate bench delivered the landmark constitutional judgment to ________ the accredited human rights advocates.",
    question: "Choose the correct pronoun form preceding the appositive noun phrase:",
    options: ["us", "we", "our", "ourselves"],
    answer: "us",
    hint: "The preposition 'to' requires an objective pronoun before the appositive noun phrase.",
    solution: "The preposition 'to' demands the objective pronoun 'us', not the nominative 'we' ('to us the accredited advocates').",
    target: "Prepositional Case Law: Appositive Pronouns"
  },
  {
    passage: "To ________ did the presidential chief of staff deliver the classified national defense briefing?",
    question: "Choose the grammatically mandatory objective interrogative pronoun:",
    options: ["whom", "who", "which", "whose"],
    answer: "whom",
    hint: "When an interrogative pronoun directly follows a preposition ('to'), it must be in the objective case.",
    solution: "In formal prescriptive syntax, an interrogative pronoun directly governed by a fronted preposition must take the objective form 'whom': 'To whom did he deliver...'",
    target: "Prepositional Case Law: Whom vs. Who"
  },
  {
    passage: "The senior forensic pathologist was completely absorbed ________ examining microscopic tissue sections from the homicide victim.",
    question: "Choose the correct dependent preposition:",
    options: ["in", "at", "with", "on"],
    answer: "in",
    hint: "When mentally or physically engrossed in an activity, one is 'absorbed ...'.",
    solution: "The adjective/participle 'absorbed' strictly governs the preposition 'in' ('absorbed in examining').",
    target: "Adjectival Dependent Prepositions: Absorbed In"
  },
  {
    passage: "The resident supervising engineer was reprimanded for being negligent ________ monitoring the structural foundation pour.",
    question: "Choose the correct dependent preposition:",
    options: ["in", "of", "about", "for"],
    answer: "in",
    hint: "One is 'negligent in' executing a duty.",
    solution: "The adjective 'negligent' governs the preposition 'in' when referring to the performance of professional duties.",
    target: "Adjectival Dependent Prepositions: Negligent In"
  },
  {
    passage: "The board of governors expressed total confidence ________ the academic provost's capability to restructure university governance.",
    question: "Choose the correct dependent preposition governing the noun 'confidence':",
    options: ["in", "on", "for", "with"],
    answer: "in",
    hint: "One places or possesses 'confidence ...' an institution or leader.",
    solution: "The noun 'confidence' strictly governs the preposition 'in' ('confidence in the provost's capability').",
    target: "Nominal Dependent Prepositions: Confidence In"
  },
  {
    passage: "The botanical park ranger cautioned the visiting researchers to beware ________ entering the unmapped primary rain-forest canopy.",
    question: "Choose the correct dependent preposition:",
    options: ["of", "for", "with", "from"],
    answer: "of",
    hint: "'Beware' is a cautionary verb governing a specific one-syllable preposition.",
    solution: "The verb 'beware' strictly governs the preposition 'of' ('beware of entering').",
    target: "Verbal Dependent Prepositions: Beware Of"
  },
  {
    passage: "The agrarian soil assay revealed that the savannah loam was critically deficient ________ organic phosphorus and micronutrients.",
    question: "Choose the correct dependent preposition:",
    options: ["in", "of", "with", "from"],
    answer: "in",
    hint: "When lacking a vital nutrient or substance, an entity is 'deficient ...'.",
    solution: "The adjective 'deficient' governs the preposition 'in' ('deficient in minerals').",
    target: "Adjectival Dependent Prepositions: Deficient In"
  },
  {
    passage: "The commercial director's personal equity holdings were demonstrably incompatible ________ his statutory oversight responsibilities.",
    question: "Choose the correct dependent preposition:",
    options: ["with", "to", "against", "from"],
    answer: "with",
    hint: "Things that cannot coexist harmoniously are 'incompatible ...' each other.",
    solution: "The adjective 'incompatible' strictly governs the preposition 'with'.",
    target: "Adjectival Dependent Prepositions: Incompatible With"
  },
  {
    passage: "The newly elected student representative president is exceptionally popular ________ the entire junior secondary school electorate.",
    question: "Choose the correct dependent preposition:",
    options: ["with", "to", "for", "by"],
    answer: "with",
    hint: "A figure enjoying widespread favor among a group is 'popular ...' them.",
    solution: "The adjective 'popular' governs the preposition 'with' (or 'among') when referring to favor within a community.",
    target: "Adjectival Dependent Prepositions: Popular With"
  },
  {
    passage: "Vigilant environmental task-force rangers prevented the illegal timber consortium from ________ century-old rosewood trees in the river reserve.",
    question: "Choose the grammatically correct verbal complement following 'from':",
    options: ["harvesting", "harvest", "to harvest", "having harvest"],
    answer: "harvesting",
    hint: "Prepositions demand a gerund ('V-ing') complement.",
    solution: "The preposition 'from' must be complemented by the gerund 'harvesting'. Using an infinitive ('to harvest') is ungrammatical.",
    target: "Preposition + Gerund Mandate"
  },
  {
    passage: "The high court justice penalized the commercial shipping enterprise for ________ raw industrial effluent into the territorial bay.",
    question: "Choose the correct verbal complement following 'for':",
    options: ["discharging", "discharge", "to discharge", "discharged"],
    answer: "discharging",
    hint: "Prepositions assign objective case and require an '-ing' verbal form.",
    solution: "The preposition 'for' takes a gerundial complement ('discharging').",
    target: "Preposition + Gerund Mandate"
  },
  {
    passage: "Through innovative zero-tillage agricultural techniques, the agronomy department succeeded in ________ double-yield sorghum crops.",
    question: "Choose the correct verbal complement following 'in':",
    options: ["cultivating", "cultivate", "to cultivate", "cultivated"],
    answer: "cultivating",
    hint: "'Succeed in' is strictly complemented by a gerund.",
    solution: "The verb 'succeed' governs the preposition 'in', which must be complemented by the gerund 'cultivating'.",
    target: "Preposition + Gerund Mandate: Succeed In"
  },
  {
    passage: "The senior administrative officer was dismissed for repeatedly ________ classified cabinet minutes to foreign intelligence operatives.",
    question: "Choose the correct verbal complement following 'for':",
    options: ["transmitting", "transmit", "to transmit", "transmitted"],
    answer: "transmitting",
    hint: "Prepositions cannot be complemented by bare infinitives or past tense forms.",
    solution: "The preposition 'for' requires a gerund complement ('transmitting').",
    target: "Preposition + Gerund Mandate"
  },
  {
    passage: "The military high command arrested the renegade officer on suspicion of ________ strategic telecommunication repeater stations.",
    question: "Choose the correct verbal complement following 'of':",
    options: ["sabotaging", "sabotage", "to sabotage", "sabotaged"],
    answer: "sabotaging",
    hint: "The dependent preposition 'of' following 'suspicion' requires a gerund.",
    solution: "The preposition 'of' mandates the gerundial form 'sabotaging'.",
    target: "Preposition + Gerund Mandate"
  },
  {
    passage: "The director-general commended the environmental compliance division for ________ uncompromising statutory standards across all mining concessions.",
    question: "Choose the correct verbal complement following 'for':",
    options: ["enforcing", "enforce", "to enforce", "enforced"],
    answer: "enforcing",
    hint: "Prepositions demand an '-ing' verbal form.",
    solution: "The preposition 'for' takes the gerund complement 'enforcing'.",
    target: "Preposition + Gerund Mandate"
  },
  {
    passage: "Neither the vice-chancellor nor ________ was consulted before the university council passed the revised tuition statutes.",
    question: "Choose the correct pronoun in subject position:",
    options: ["she", "her", "hers", "herself"],
    answer: "she",
    hint: "In a coordinate subject structure ('Neither X nor Y'), pronouns must be in the nominative/subjective case.",
    solution: "The pronoun functions as part of the compound subject governing the verb 'was consulted', requiring the subjective case 'she'.",
    target: "Case Alignment: Subjective vs. Objective Pronouns"
  },
  {
    passage: "The state protocol secretariat honored both the paramount traditional ruler and ________ for their stabilizing national diplomacy.",
    question: "Choose the correct pronoun in direct object position:",
    options: ["her", "she", "hers", "herself"],
    answer: "her",
    hint: "Direct object position requires an objective pronoun.",
    solution: "The transitive verb 'honored' governs the objective case, requiring 'her' ('honored both the ruler and her').",
    target: "Case Alignment: Objective Pronouns"
  },
  {
    passage: "The official diplomatic credentials from the foreign embassy were delivered directly to the foreign minister and ________.",
    question: "Choose the correct pronoun following the preposition 'to':",
    options: ["him", "he", "his", "himself"],
    answer: "him",
    hint: "Prepositions demand the objective case ('him', never 'he').",
    solution: "Prepositions strictly govern objective case pronouns: 'to the foreign minister and him'.",
    target: "Prepositional Case Law: Objective Pronouns"
  },
  {
    passage: "Between you and ________, the forensic accounting inquiry has uncovered systemic manipulation of the state pension fund.",
    question: "Choose the correct pronoun to complete the prepositional phrase:",
    options: ["me", "I", "myself", "mine"],
    answer: "me",
    hint: "'Between' is a preposition; using 'I' is an erroneous hypercorrection.",
    solution: "Prepositions govern objective case pronouns. The construction 'between you and me' is grammatically mandatory.",
    target: "Prepositional Case Law: Objective Pronouns"
  },
  {
    passage: "The cabinet secretariat established an extraordinary task force comprising Kwame, Mansa, and ________.",
    question: "Choose the correct pronoun in object position:",
    options: ["me", "I", "myself", "mine"],
    answer: "me",
    hint: "'Comprising' governs objective case pronouns.",
    solution: "The transitive participle/preposition 'comprising' governs the objective case: 'Kwame, Mansa, and me'.",
    target: "Prepositional Case Law: Objective Pronouns"
  },
  {
    passage: "The civic regeneration consortium was praised for its unswerving dedication ________ reconstructing decayed municipal educational facilities.",
    question: "Choose the correct dependent preposition governing the noun 'dedication':",
    options: ["to", "for", "in", "with"],
    answer: "to",
    hint: "One shows 'dedication ...' a cause.",
    solution: "The noun 'dedication' strictly governs the preposition 'to' ('dedication to reconstructing facilities').",
    target: "Nominal Dependent Prepositions: Dedication To"
  },
  {
    passage: "The master goldsmith takes immense professional pride ________ restoring ancient royal Ashanti ceremonial regalia.",
    question: "Choose the correct dependent preposition governing the idiom 'take pride':",
    options: ["in", "at", "for", "with"],
    answer: "in",
    hint: "One takes 'pride ...' an endeavor (contrast with 'proud of').",
    solution: "The verbal idiom 'take pride' governs the preposition 'in' ('take pride in doing something').",
    target: "Nominal Dependent Prepositions: Pride In"
  },
  {
    passage: "The newly commissioned automated desalination plant is fully capable ________ producing fifty million gallons of potable water daily.",
    question: "Choose the correct dependent preposition governing 'capable':",
    options: ["of", "to", "for", "with"],
    answer: "of",
    hint: "'Capable' takes 'of' + gerund, whereas 'able' takes 'to' + infinitive.",
    solution: "The adjective 'capable' strictly governs the preposition 'of' followed by a gerund ('capable of producing').",
    target: "Adjectival Dependent Prepositions: Capable Of"
  },
  {
    passage: "The supreme court bench remained completely indifferent ________ the political status of the corporate magnates facing prosecution.",
    question: "Choose the correct dependent preposition:",
    options: ["to", "about", "for", "with"],
    answer: "to",
    hint: "When unaffected by external pressure, one is 'indifferent ...' it.",
    solution: "The adjective 'indifferent' strictly governs the preposition 'to' ('indifferent to status or criticism').",
    target: "Adjectival Dependent Prepositions: Indifferent To"
  },
  {
    passage: "The director of public prosecutions was reprimanded for being late ________ filing the state's responding legal memorandum.",
    question: "Choose the correct dependent preposition:",
    options: ["in", "at", "for", "to"],
    answer: "in",
    hint: "When delayed in performing a specific action, one is 'late ...' doing it.",
    solution: "When referring to delay in the performance of an action, 'late' governs 'in' + gerund ('late in filing').",
    target: "Adjectival Dependent Prepositions: Late In"
  },
  {
    passage: "The displaced riparian communities expressed profound gratitude ________ the international humanitarian agency for providing relief.",
    question: "Choose the correct dependent preposition:",
    options: ["to", "for", "with", "at"],
    answer: "to",
    hint: "Gratitude is directed 'to' a benefactor.",
    solution: "One expresses gratitude 'to' a person or institution ('gratitude to the agency').",
    target: "Nominal Dependent Prepositions: Gratitude To"
  },
  {
    passage: "The macroeconomist warned that the heavily indebted national airline was heading ________ irreversible insolvency.",
    question: "Choose the correct dependent preposition:",
    options: ["for", "to", "towards", "at"],
    answer: "for",
    hint: "When moving inexorably toward a negative fate, one is 'heading ...' it.",
    solution: "The idiom 'heading for' signifies inexorable trajectory toward an inevitable negative outcome ('heading for insolvency').",
    target: "Verbal Dependent Prepositions: Heading For"
  },
  {
    passage: "The national research library's science archive was found to be totally deficient ________ peer-reviewed biotechnology literature.",
    question: "Choose the correct dependent preposition:",
    options: ["in", "of", "with", "from"],
    answer: "in",
    hint: "When lacking a vital component, something is 'deficient ...'.",
    solution: "The adjective 'deficient' governs the preposition 'in' ('deficient in literature/minerals').",
    target: "Adjectival Dependent Prepositions: Deficient In"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// Strand 3 B9 Advanced Focus:
// Complex Forensic Dependent Prepositions, Gerundial Complementation,
// and Coordinate Objective Case Rules
// =========================================================================
const capstone5B9GrammarAdvancedQuestions = [
  {
    questionNumber: 51,
    question: "In paragraph 1, how do the collocations 'congratulating the forensic land survey task force on their incorruptible vigilance' and 'superior to tolerating bureaucratic venality' demonstrate standard dependent preposition rules?",
    options: [
      "The verb 'congratulate' strictly governs 'on', and the Latin comparative adjective 'superior' strictly governs 'to'",
      "Both words arbitrarily govern 'for' in formal Ghanaian legislative syntax",
      "'Congratulate' takes 'for', while 'superior' takes the conjunction 'than'",
      "Prepositions in formal reports are stylistic and interchangeable"
    ],
    answer: "The verb 'congratulate' strictly governs 'on', and the Latin comparative adjective 'superior' strictly governs 'to'",
    hint: "Identify the partner prepositions locked to 'congratulate' and 'superior' in paragraph 1.",
    solution: "Paragraph 1 illustrates two foundational BECE dependent preposition rules: the verb 'congratulate' governs 'on' (not 'for'), and the Latin comparative adjective 'superior' governs 'to' (not 'than').",
    target: "Capstone Exam: Dependent Preposition Verification"
  },
  {
    questionNumber: 52,
    question: "In paragraph 2, what dependent preposition errors did the commission counsel avoid when the passage states that the former director was 'accused of complicity' and that the department had 'failed to comply with statutory spatial planning directives'?",
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
    question: "In paragraph 3, why is the construction 'looking forward to commissioning' grammatically mandatory instead of 'looking forward to commission'?",
    options: [
      "Because in the verbal idiom 'look forward to', 'to' is a true preposition assigning objective case, requiring a gerundial complement ('V-ing')",
      "Because 'commission' is an irregular verb that rejects bare infinitives",
      "Because 'integrated marine revetment wall' is a singular noun phrase",
      "Because 'looking forward' functions as a past participle"
    ],
    answer: "Because in the verbal idiom 'look forward to', 'to' is a true preposition assigning objective case, requiring a gerundial complement ('V-ing')",
    hint: "Recall the rule distinguishing true prepositional 'to' from the infinitive marker 'to'.",
    solution: "In 'look forward to', 'to' functions as an authentic preposition rather than an infinitival marker. Prepositions assign objective case and must be complemented by a gerund ('commissioning'), never an infinitive ('to commission').",
    target: "Capstone Exam: True Prepositional To"
  },
  {
    questionNumber: 54,
    question: "In paragraph 4, why does the sentence 'public land administration had been entrusted to them and the sovereign republic' use the pronoun 'them' instead of 'they'?",
    options: [
      "Because prepositions assign the Objective Case to pronoun complements across coordinate structures",
      "Because 'they' can only be used when referring to elected parliamentarians",
      "Because 'entrusted' is an intransitive verb that rejects nominative subjects",
      "Because 'them' refers exclusively to inanimate planning records"
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
async function deployStrand3B9Advanced() {
  console.log("Building 55 UNIQUE questions for Basic 9 (JHS 3) Strand 3 Grammar Advanced Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B9GrammarAdvancedDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B9_G_A_${qNum < 10 ? "0" + qNum : qNum}`,
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
      learningCompetency: "B9.3.1.1 / B9.3.1.2: Demonstrate advanced grammatical mastery of high-register dependent preposition collocations, complex prepositional gerund complementation, true prepositional 'to', and prepositional objective case assignment across coordinate structures."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B9GrammarAdvancedQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${b9GrammarAdvancedCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B9_G_A_${item.questionNumber}`,
      level: "B9",
      difficulty: "advanced",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: b9GrammarAdvancedCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B9.3.1.1 / B9.3.1.2: Synthesize advanced multi-paragraph contextual grammar, evaluating high-register dependent preposition collocations, gerundial complementation, prepositional case assignment across coordinate structures, and concise rule summaries."
    });
  });

  // 3. Write directly to Firestore using the unified canonical topic path
  const targetDoc = db.doc(
    "global_curriculum/jhs/subjects/english/topical/grammar_lexis_prepositions_and_phrasal_verbs/practice_labs/B9_advanced"
  );

  await targetDoc.set({
    level: "B9",
    difficulty: "advanced",
    title: "Basic 9 Advanced Lab: 50 Unique Grammar Drills + 5 Capstone Exam Questions",
    totalQuestions: all55Questions.length,
    shortDrillsCount: 50,
    capstoneExamQuestionsCount: 5,
    questions: all55Questions,
    metadata: {
      hasDuplicateQuestions: false,
      uniqueQuestionsCount: 55,
      structure: "50 Unique Short Drills (High-Register Dependent Collocations, Gerund Mandate, Coordinate Case Assignment) + 5 Capstone Full-Passage Questions",
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

deployStrand3B9Advanced()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 3 B9 Advanced Lab:", err);
    process.exit(1);
  });
