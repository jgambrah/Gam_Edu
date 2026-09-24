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
  difficulty: "foundation";
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
// Strand 3 B9 Foundation Focus:
// Dependent Prepositions, Preposition + Gerund Law, True Prepositional "To",
// and Prepositional Objective Case Assignment
// =========================================================================
const b9GrammarFoundationCapstonePassage = 
`The municipal assembly convened an emergency town hall meeting on Wednesday morning to address widespread concerns regarding water pollution in the Densu River. The presiding officer opened the session by congratulating the community youth task force on their vigilance in apprehending unauthorized sand winners. She commended the volunteers for acting swiftly, emphasizing that their prompt action had prevented the illegal miners from devastating the municipal water intake works. She noted that safeguarding communal water bodies was superior to treating waterborne epidemics after outbreaks occurred.

During the evidentiary hearing, the municipal legal counsel read out formal charges against three local dredging contractors. The prosecutor accused the prime contractor of discharging untreated effluent directly into the river without municipal clearance. In his cross-examination, the contractor insisted on presenting his provincial mining permit, arguing that his firm's operations did not differ from those of previous concession holders. However, the environmental health inspector testified that the company had repeatedly failed to comply with statutory waste disposal bylaws, rendering the surrounding soil toxic.

The presiding officer then addressed the community elders regarding the upcoming environmental remediation campaign. She announced that the district assembly was looking forward to commissioning a modern bio-filtration plant by the end of the dry season. She urged the market women and fishmongers to abstain from dumping domestic plastic refuse along the riverbanks, reminding all citizens that keeping the buffer zone clean was an indispensable remedy for annual flooding.

Before adjourning the meeting, the assembly director called the youth leader and the women's organizer forward to hand over monitoring logs and safety helmets. Because the assignment required absolute discretion and personal accountability, the director emphasized that tactical coordination must remain strictly between them and the police commander. He concluded by urging the assembly members to be dedicated to protecting the environment so that the district could look forward to enjoying clean drinking water for generations to come.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Strand 3 B9 Foundation Competencies:
// 1. Core Verbal Dependent Prepositions (congratulate on, accuse of, insist on, etc.)
// 2. Core Adjectival Dependent Prepositions (superior to, guilty of, immune to, etc.)
// 3. Preposition + Gerund (V-ing) Mandate
// 4. True Prepositional "To" vs. Infinitive Marker "To" (look forward to + V-ing)
// 5. Prepositional Case Law (Objective Pronouns following prepositions)
// =========================================================================
const unique50B9GrammarFoundationDrills = [
  {
    passage: "The headmistress warmly congratulated the brilliant school girl ________ her winning the national presidential essay competition.",
    question: "Choose the correct dependent preposition to complete the sentence:",
    options: ["on", "for", "with", "about"],
    answer: "on",
    hint: "The verb 'congratulate' strictly governs a specific preposition (or 'upon'), never 'for'.",
    solution: "In standard English syntax, the verb 'congratulate' governs the dependent preposition 'on' (e.g., 'congratulate someone on something'). Using 'for' is an erroneous colloquial substitution.",
    target: "Verbal Dependent Prepositions: Congratulate On"
  },
  {
    passage: "The High Court prosecutor formally accused the timber merchant ________ felling endangered mahogany trees in the national forest reserve.",
    question: "Choose the grammatically correct preposition:",
    options: ["of", "for", "with", "about"],
    answer: "of",
    hint: "'Accuse' is locked to one partner preposition in English legal and standard grammar.",
    solution: "The verb 'accuse' strictly governs the dependent preposition 'of' ('accused of a crime'). Constructing 'accused for' or 'accused with' is ungrammatical.",
    target: "Verbal Dependent Prepositions: Accuse Of"
  },
  {
    passage: "Kwame repeatedly stated that he prefers fresh roasted plantains ________ boiled white rice.",
    question: "Choose the correct preposition to complete the comparison:",
    options: ["to", "than", "over", "against"],
    answer: "to",
    hint: "Latin-derived comparative verbs like 'prefer' take 'to', not the conjunction 'than'.",
    solution: "The verb 'prefer' takes the preposition 'to' to mark the rejected alternative ('prefer X to Y'). Using 'than' or 'over' is a common diagnostic error in BECE Section A.",
    target: "Comparative Prepositions: Prefer To"
  },
  {
    passage: "The structural engineer demonstrated that the newly manufactured cement blocks were far superior ________ the sun-dried mud bricks.",
    question: "Choose the correct preposition:",
    options: ["to", "than", "over", "above"],
    answer: "to",
    hint: "Adjectives of Latin origin ending in '-ior' (superior, inferior, senior, junior) govern 'to'.",
    solution: "Comparative adjectives like 'superior' and 'inferior' strictly govern the preposition 'to', never 'than'.",
    target: "Adjectival Dependent Prepositions: Superior To"
  },
  {
    passage: "Despite the conductor's objections, the stubborn passenger insisted ________ paying his transport fare with a torn banknote.",
    question: "Choose the correct dependent preposition:",
    options: ["on", "in", "at", "to"],
    answer: "on",
    hint: "'Insist' takes a specific preposition meaning firmly persisting.",
    solution: "The verb 'insist' governs the dependent preposition 'on' (or 'upon'). Saying 'insisted in' or 'insisted to pay' is non-standard.",
    target: "Verbal Dependent Prepositions: Insist On"
  },
  {
    passage: "Torrential downpours and flooded culverts prevented the inter-city express bus ________ reaching Kumasi on schedule.",
    question: "Choose the grammatically correct prepositional complement construction:",
    options: ["from reaching", "to reach", "from reach", "in reaching"],
    answer: "from reaching",
    hint: "'Prevent' governs the preposition 'from', which must be complemented by a gerund ('V-ing').",
    solution: "The verb 'prevent' governs the preposition 'from'. Because prepositions demand gerundial verb forms, 'from reaching' is the only viable option.",
    target: "Preposition + Gerund Mandate: Prevent From"
  },
  {
    passage: "All registered pharmaceutical pharmacies must strictly comply ________ the drug safety regulations issued by the food authority.",
    question: "Choose the correct dependent preposition:",
    options: ["with", "to", "by", "on"],
    answer: "with",
    hint: "'Comply' pairs with the preposition indicating agreement or accompaniment.",
    solution: "The verb 'comply' strictly governs the preposition 'with' ('comply with rules'). Constructing 'comply to' is a common mother-tongue interference error.",
    target: "Verbal Dependent Prepositions: Comply With"
  },
  {
    passage: "Our local Akan dialects differ substantially ________ the coastal languages in vocabulary and intonation.",
    question: "Choose the correct dependent preposition:",
    options: ["from", "with", "to", "than"],
    answer: "from",
    hint: "When two entities are not identical, one differs '...' the other.",
    solution: "The verb 'differ' takes the preposition 'from' when denoting dissimilarity or contrast. 'Differ with' is reserved only for disagreeing with a person's opinion.",
    target: "Verbal Dependent Prepositions: Differ From"
  },
  {
    passage: "Children who have completed the full immunization schedule are virtually immune ________ the measles virus.",
    question: "Choose the correct dependent preposition:",
    options: ["to", "from", "against", "with"],
    answer: "to",
    hint: "'Immune' takes the preposition 'to' when referring to biological or legal exemption.",
    solution: "The adjective 'immune' standardly governs the preposition 'to' in medical contexts ('immune to a disease').",
    target: "Adjectival Dependent Prepositions: Immune To"
  },
  {
    passage: "After deliberating for three hours, the jury found the rogue financial officer guilty ________ fraudulent embezzlement.",
    question: "Choose the correct dependent preposition:",
    options: ["of", "for", "with", "about"],
    answer: "of",
    hint: "Both 'guilty' and 'innocent' govern the same one-syllable preposition.",
    solution: "The legal adjectives 'guilty' and 'innocent' govern the preposition 'of' ('guilty of an offence'). Using 'for' is grammatically incorrect.",
    target: "Adjectival Dependent Prepositions: Guilty Of"
  },
  {
    passage: "Many smallholder cocoa farmers in the damp rainforest belt suffer ________ chronic seasonal rheumatism.",
    question: "Choose the correct dependent preposition:",
    options: ["from", "with", "of", "by"],
    answer: "from",
    hint: "When afflicted by a medical disease or pain, one suffers '...'.",
    solution: "The verb 'suffer' governs the preposition 'from' when referring to diseases, conditions, or physical afflictions.",
    target: "Verbal Dependent Prepositions: Suffer From"
  },
  {
    passage: "The medical officer advised the hypertensive patient to abstain ________ consuming heavily salted canned foods.",
    question: "Choose the correct preposition:",
    options: ["from", "against", "to", "with"],
    answer: "from",
    hint: "Verbs of restraint (abstain, refrain, desist) govern 'from'.",
    solution: "The verb 'abstain' governs the dependent preposition 'from' ('abstain from smoking/drinking').",
    target: "Verbal Dependent Prepositions: Abstain From"
  },
  {
    passage: "The district sanitation director reminded the assembly that constructing concrete gutters was the only permanent remedy ________ urban flooding.",
    question: "Choose the correct dependent preposition governing the noun 'remedy':",
    options: ["for", "to", "against", "of"],
    answer: "for",
    hint: "A 'remedy' is intended 'for' an ailment, whereas a 'solution' is 'to' a problem.",
    solution: "The noun 'remedy' governs the preposition 'for' ('a remedy for an illness/problem').",
    target: "Nominal Dependent Prepositions: Remedy For"
  },
  {
    passage: "The school library committee has finally found an effective solution ________ the chronic shortage of supplementary reading books.",
    question: "Choose the correct dependent preposition governing the noun 'solution':",
    options: ["to", "for", "of", "about"],
    answer: "to",
    hint: "A 'solution' is directional and attaches to the problem with 'to'.",
    solution: "In standard English usage, the noun 'solution' governs the preposition 'to' ('the solution to the puzzle'). Saying 'solution of' or 'solution for' is non-standard.",
    target: "Nominal Dependent Prepositions: Solution To"
  },
  {
    passage: "All the Basic 9 candidates are eagerly looking forward to ________ their final BECE examination.",
    question: "Choose the grammatically correct verbal complement:",
    options: ["writing", "write", "be write", "have written"],
    answer: "writing",
    hint: "In the idiom 'look forward to', 'to' is a true preposition, not an infinitive marker; true prepositions demand a gerund.",
    solution: "In the idiom 'look forward to', 'to' is an authentic preposition, not an infinitive marker. Prepositions must be complemented by a gerund ('V-ing'), making 'writing' obligatory.",
    target: "True Prepositional To: Look Forward To"
  },
  {
    passage: "The community elders object to ________ a commercial entertainment bar directly opposite the primary school.",
    question: "Choose the correct verbal complement:",
    options: ["building", "build", "be built", "have built"],
    answer: "building",
    hint: "'Object to' contains a true preposition demanding the gerundial form.",
    solution: "In 'object to', 'to' is a true preposition governing a gerund. Therefore, 'building' is grammatically mandatory.",
    target: "True Prepositional To: Object To"
  },
  {
    passage: "Having lived in the northern savanna for two decades, the cattle herdsmen are accustomed to ________ the scorching harmattan heat.",
    question: "Choose the correct verbal complement:",
    options: ["enduring", "endure", "be endured", "have endured"],
    answer: "enduring",
    hint: "'Be accustomed to' is followed by a gerund ('V-ing').",
    solution: "The verbal idiom 'be accustomed to' requires a gerund ('enduring') because 'to' is a true preposition assigning objective case.",
    target: "True Prepositional To: Accustomed To"
  },
  {
    passage: "The agricultural development bank granted loans to the farmers with a view to ________ domestic maize cultivation.",
    question: "Choose the correct verbal complement:",
    options: ["expanding", "expand", "be expanded", "have expanded"],
    answer: "expanding",
    hint: "The idiom 'with a view to' ends in a preposition and requires a gerund.",
    solution: "The formal idiom 'with a view to' ends in the preposition 'to', which demands a gerund ('expanding') rather than a bare or to-infinitive.",
    target: "True Prepositional To: With A View To"
  },
  {
    passage: "Under intense police interrogation, the notorious burglar confessed to ________ the church safe.",
    question: "Choose the grammatically correct complement:",
    options: ["robbing", "rob", "have rob", "be robbed"],
    answer: "robbing",
    hint: "'Confess to' contains a preposition that requires 'V-ing'.",
    solution: "When 'confess to' governs an action, 'to' functions as a preposition requiring the gerund form 'robbing'.",
    target: "True Prepositional To: Confess To"
  },
  {
    passage: "The dedicated staff nurse is completely committed to ________ malnourished infants in the emergency pediatric ward.",
    question: "Choose the correct verbal complement:",
    options: ["saving", "save", "have save", "be saved"],
    answer: "saving",
    hint: "'Committed to' is followed by a gerund.",
    solution: "The adjectival phrase 'committed to' contains a preposition that must be complemented by a gerund ('saving').",
    target: "True Prepositional To: Committed To"
  },
  {
    passage: "The headmaster shared the new textbooks between Kofi and ________ before classes commenced.",
    question: "Choose the correct pronoun to complete the prepositional phrase:",
    options: ["me", "I", "myself", "mine"],
    answer: "me",
    hint: "Prepositions assign the Objective Case ('me', not 'I') to all following pronouns.",
    solution: "Prepositions govern the Objective (Accusative) Case. The nominative pronoun 'I' is ungrammatical following the preposition 'between'. 'Between Kofi and me' is the only correct form.",
    target: "Prepositional Case Law: Objective Pronouns"
  },
  {
    passage: "This confidential scholarship deliberation must remain strictly between you and ________.",
    question: "Choose the correct pronoun:",
    options: ["me", "I", "myself", "mine"],
    answer: "me",
    hint: "Never use the subject pronoun 'I' after a preposition.",
    solution: "Prepositions assign objective case to pronouns. The standard construction is 'between you and me'. Constructing 'between you and I' is a penalized hypercorrection.",
    target: "Prepositional Case Law: Objective Pronouns"
  },
  {
    passage: "The disciplinary committee summoned both the class captain and ________ to testify regarding the examination malpractice.",
    question: "Choose the correct pronoun:",
    options: ["him", "he", "his", "himself"],
    answer: "him",
    hint: "'Summoned' is a transitive verb governing objective case, and coordinate objects must match.",
    solution: "Direct objects of transitive verbs and prepositional complements require objective case pronouns ('him', not 'he').",
    target: "Case Alignment: Objective Pronouns"
  },
  {
    passage: "The sports master distributed the new football jerseys to ________ the school team players.",
    question: "Choose the correct pronoun form:",
    options: ["us", "we", "our", "ourselves"],
    answer: "us",
    hint: "Preposition 'to' requires an objective case pronoun before the appositive noun phrase.",
    solution: "The preposition 'to' demands the objective pronoun 'us', not the nominative 'we' ('to us the school team players').",
    target: "Prepositional Case Law: Appositive Pronouns"
  },
  {
    passage: "To ________ did the municipal chief executive address that official reprimand letter?",
    question: "Choose the grammatically correct interrogative pronoun:",
    options: ["whom", "who", "which", "whose"],
    answer: "whom",
    hint: "When an interrogative pronoun directly follows a preposition ('to'), it must be in the objective case.",
    solution: "In formal prescriptive grammar, when an interrogative pronoun directly follows a preposition, the objective form 'whom' is mandatory ('To whom was it sent?').",
    target: "Prepositional Case Law: Whom vs. Who"
  },
  {
    passage: "The young apprentice was completely absorbed ________ reading the technical electrical wiring manual.",
    question: "Choose the correct dependent preposition:",
    options: ["in", "at", "with", "on"],
    answer: "in",
    hint: "When mentally or physically immersed in an activity, one is 'absorbed ...' it.",
    solution: "The participle/adjective 'absorbed' governs the preposition 'in' ('absorbed in a book').",
    target: "Adjectival Dependent Prepositions: Absorbed In"
  },
  {
    passage: "The school driver was convicted of and fined for being negligent ________ his professional driving duties.",
    question: "Choose the correct dependent preposition:",
    options: ["in", "of", "about", "for"],
    answer: "in",
    hint: "One is 'negligent in' discharging a duty or responsibility.",
    solution: "The adjective 'negligent' standardly governs the preposition 'in' when referring to performance of duties.",
    target: "Adjectival Dependent Prepositions: Negligent In"
  },
  {
    passage: "The village assembly members expressed complete confidence ________ the newly appointed female headmistress.",
    question: "Choose the correct dependent preposition:",
    options: ["in", "on", "for", "with"],
    answer: "in",
    hint: "One has 'confidence ...' a person or system.",
    solution: "The noun 'confidence' governs the preposition 'in' ('confidence in the leadership').",
    target: "Nominal Dependent Prepositions: Confidence In"
  },
  {
    passage: "The laboratory technician cautioned the pupils to beware ________ touching bare electrical wires.",
    question: "Choose the correct dependent preposition:",
    options: ["of", "for", "with", "from"],
    answer: "of",
    hint: "'Beware' is a cautionary verb governing a specific one-syllable preposition.",
    solution: "The verb 'beware' strictly governs the preposition 'of' ('beware of the dog / beware of danger').",
    target: "Verbal Dependent Prepositions: Beware Of"
  },
  {
    passage: "The rural clinic's medicine supply was deficient ________ essential pediatric antibiotic syrups.",
    question: "Choose the correct dependent preposition:",
    options: ["in", "of", "with", "from"],
    answer: "in",
    hint: "When lacking a vital component, something is 'deficient ...' it.",
    solution: "The adjective 'deficient' governs the preposition 'in' ('deficient in vitamins/supplies').",
    target: "Adjectival Dependent Prepositions: Deficient In"
  },
  {
    passage: "The minister's private lifestyle was completely incompatible ________ the ethical code of his high public office.",
    question: "Choose the correct dependent preposition:",
    options: ["with", "to", "against", "from"],
    answer: "with",
    hint: "Things that cannot harmonize together are 'incompatible ...' each other.",
    solution: "The adjective 'incompatible' strictly governs the preposition 'with'.",
    target: "Adjectival Dependent Prepositions: Incompatible With"
  },
  {
    passage: "The school guidance counsellor is very popular ________ the junior secondary pupils because of her kindness.",
    question: "Choose the correct dependent preposition:",
    options: ["with", "to", "for", "by"],
    answer: "with",
    hint: "A person admired by a group is 'popular ...' them.",
    solution: "The adjective 'popular' takes the preposition 'with' (or 'among') when referring to favor within a group.",
    target: "Adjectival Dependent Prepositions: Popular With"
  },
  {
    passage: "The security guards prevented the unruly mob from ________ into the administrative block.",
    question: "Choose the grammatically correct verbal form following the preposition 'from':",
    options: ["breaking", "break", "to break", "having break"],
    answer: "breaking",
    hint: "Prepositions assign objective case and demand a gerund ('V-ing').",
    solution: "The preposition 'from' must be complemented by the gerund 'breaking'. Using a bare infinitive ('break') or to-infinitive ('to break') violates prepositional complementation rules.",
    target: "Preposition + Gerund Mandate"
  },
  {
    passage: "The magistrate fined the commercial bus driver for ________ the red traffic light at the busy crossroad.",
    question: "Choose the correct verbal complement following the preposition 'for':",
    options: ["running", "run", "to run", "ran"],
    answer: "running",
    hint: "Prepositions cannot take past-tense or bare infinitive verb forms.",
    solution: "The preposition 'for' requires a gerundial complement ('running').",
    target: "Preposition + Gerund Mandate"
  },
  {
    passage: "The school team succeeded in ________ the regional inter-district football trophy.",
    question: "Choose the grammatically correct verbal complement following 'in':",
    options: ["winning", "win", "to win", "won"],
    answer: "winning",
    hint: "The preposition 'in' requires an '-ing' verbal form.",
    solution: "The verb 'succeed' governs the preposition 'in', which must take a gerund complement ('winning'). Constructing 'succeeded to win' is an error.",
    target: "Preposition + Gerund Mandate: Succeed In"
  },
  {
    passage: "The stubborn schoolboy was penalized for constantly ________ his class teachers.",
    question: "Choose the correct verbal complement:",
    options: ["disobeying", "disobey", "to disobey", "disobeyed"],
    answer: "disobeying",
    hint: "Prepositions demand the gerund form of following verbs.",
    solution: "The preposition 'for' must be followed by the gerund 'disobeying'.",
    target: "Preposition + Gerund Mandate"
  },
  {
    passage: "The police arrested the suspect on suspicion of ________ a commercial cargo van.",
    question: "Choose the correct verbal complement following 'of':",
    options: ["stealing", "steal", "to steal", "stole"],
    answer: "stealing",
    hint: "The preposition 'of' demands a gerund.",
    solution: "The dependent preposition 'of' following 'suspicion' mandates the gerund 'stealing'.",
    target: "Preposition + Gerund Mandate"
  },
  {
    passage: "The minister was praised for ________ transparency throughout the public procurement process.",
    question: "Choose the correct verbal complement following 'for':",
    options: ["maintaining", "maintain", "to maintain", "maintained"],
    answer: "maintaining",
    hint: "'For' is a preposition and must be followed by a gerund.",
    solution: "The preposition 'for' takes the gerund complement 'maintaining'.",
    target: "Preposition + Gerund Mandate"
  },
  {
    passage: "Neither the class prefect nor ________ was permitted to enter the staff room after hours.",
    question: "Choose the correct pronoun:",
    options: ["he", "him", "his", "himself"],
    answer: "he",
    hint: "In subject position, coordinating conjunctions ('neither... nor') join subjective pronouns.",
    solution: "In a coordinate subject structure ('Neither X nor Y'), pronouns must be in the nominative/subjective case: 'Neither the class prefect nor he was permitted'.",
    target: "Case Alignment: Subjective vs. Objective Pronouns"
  },
  {
    passage: "The headmistress invited both his elder brother and ________ to attend the speech day ceremony.",
    question: "Choose the correct pronoun in object position:",
    options: ["him", "he", "his", "himself"],
    answer: "him",
    hint: "Direct object position requires an objective pronoun.",
    solution: "The transitive verb 'invited' takes an objective case pronoun ('him').",
    target: "Case Alignment: Objective Pronouns"
  },
  {
    passage: "The parcel containing the science laboratory manuals was delivered directly to Kwame and ________.",
    question: "Choose the correct pronoun following the preposition 'to':",
    options: ["her", "she", "hers", "herself"],
    answer: "her",
    hint: "The preposition 'to' requires the objective case ('her', not 'she').",
    solution: "Prepositions strictly govern objective case pronouns ('to Kwame and her'). Constructing 'to Kwame and she' is an error.",
    target: "Prepositional Case Law: Objective Pronouns"
  },
  {
    passage: "Between you and ________, the new school bus driver is far more careful than the previous one.",
    question: "Choose the correct pronoun to complete the prepositional phrase:",
    options: ["me", "I", "myself", "mine"],
    answer: "me",
    hint: "'Between' is a preposition; never use 'I' after it.",
    solution: "'Between' is a preposition that governs objective case pronouns: 'between you and me'.",
    target: "Prepositional Case Law: Objective Pronouns"
  },
  {
    passage: "The headmaster appointed a committee comprising Kofi, Ama, and ________ to organize the cultural festival.",
    question: "Choose the correct pronoun in object position:",
    options: ["me", "I", "myself", "mine"],
    answer: "me",
    hint: "'Comprising' functions as a preposition or transitive participle governing objective case.",
    solution: "The verbal participle/preposition 'comprising' takes objective case pronouns: 'Kofi, Ama, and me'.",
    target: "Prepositional Case Law: Objective Pronouns"
  },
  {
    passage: "The municipal assembly praised the community elders for their dedication ________ promoting rural sanitation.",
    question: "Choose the correct dependent preposition governing the noun 'dedication':",
    options: ["to", "for", "in", "with"],
    answer: "to",
    hint: "One shows 'dedication ...' a cause.",
    solution: "The noun 'dedication' governs the preposition 'to' ('dedication to promoting sanitation').",
    target: "Nominal Dependent Prepositions: Dedication To"
  },
  {
    passage: "The young apprentice took great pride ________ mastering the art of traditional kente weaving.",
    question: "Choose the correct dependent preposition governing the noun 'pride':",
    options: ["in", "at", "for", "with"],
    answer: "in",
    hint: "One takes 'pride ...' an accomplishment (compare with 'proud of').",
    solution: "The idiom 'take pride' governs the preposition 'in' ('take pride in something'). Note that the adjective 'proud' takes 'of' ('proud of something').",
    target: "Nominal Dependent Prepositions: Pride In"
  },
  {
    passage: "The newly installed solar water pumping station is capable ________ supplying the entire village with potable water.",
    question: "Choose the correct dependent preposition governing 'capable':",
    options: ["of", "to", "for", "with"],
    answer: "of",
    hint: "'Capable' takes 'of' + gerund, while 'able' takes 'to' + infinitive.",
    solution: "The adjective 'capable' strictly governs the preposition 'of' followed by a gerund ('capable of supplying'). Note the contrast: 'able to supply'.",
    target: "Adjectival Dependent Prepositions: Capable Of"
  },
  {
    passage: "The regional education director was completely indifferent ________ the complaints raised by the partisan group.",
    question: "Choose the correct dependent preposition:",
    options: ["to", "about", "for", "with"],
    answer: "to",
    hint: "When unconcerned or unaffected by something, one is 'indifferent ...' it.",
    solution: "The adjective 'indifferent' strictly governs the preposition 'to' ('indifferent to criticism').",
    target: "Adjectival Dependent Prepositions: Indifferent To"
  },
  {
    passage: "The school driver was reprimanded for being late ________ collecting the day students from the bus terminal.",
    question: "Choose the correct dependent preposition:",
    options: ["in", "at", "for", "to"],
    answer: "in",
    hint: "One is 'late in' doing a scheduled activity.",
    solution: "When referring to delay in performing an action, 'late' takes the preposition 'in' + gerund ('late in collecting').",
    target: "Adjectival Dependent Prepositions: Late In"
  },
  {
    passage: "The rural farmers expressed profound gratitude ________ the district assembly for building a modern market shed.",
    question: "Choose the correct dependent preposition:",
    options: ["to", "for", "with", "at"],
    answer: "to",
    hint: "Gratitude is expressed 'to' a person/institution 'for' a favor.",
    solution: "One expresses gratitude 'to' someone ('gratitude to the assembly').",
    target: "Nominal Dependent Prepositions: Gratitude To"
  },
  {
    passage: "The juvenile court judge warned the reckless teenager that he was heading ________ serious legal trouble.",
    question: "Choose the correct dependent preposition:",
    options: ["for", "to", "towards", "at"],
    answer: "for",
    hint: "When moving toward an inevitable negative outcome, one is 'heading ...' it.",
    solution: "The idiom 'heading for' means moving toward an inevitable situation or catastrophe ('heading for trouble').",
    target: "Verbal Dependent Prepositions: Heading For"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// Strand 3 B9 Foundation Focus: Dependent Prepositions, Gerundial Syntax,
// True Prepositional "To", and Prepositional Case Assignment
// =========================================================================
const capstone5B9GrammarFoundationQuestions = [
  {
    questionNumber: 51,
    question: "In paragraph 1, how do the phrases 'congratulating the community youth task force on their vigilance' and 'superior to treating waterborne epidemics' illustrate dependent preposition rules?",
    options: [
      "The verb 'congratulate' strictly governs 'on', and the Latin comparative adjective 'superior' strictly governs 'to'",
      "Both words govern 'for' in standard British English",
      "'Congratulate' takes 'for', while 'superior' takes the conjunction 'than'",
      "Prepositions are chosen at random based on speaker preference"
    ],
    answer: "The verb 'congratulate' strictly governs 'on', and the Latin comparative adjective 'superior' strictly governs 'to'",
    hint: "Examine the partner prepositions locked to 'congratulate' and 'superior' in paragraph 1.",
    solution: "Paragraph 1 illustrates two foundational BECE dependent preposition rules: the verb 'congratulate' governs 'on' (not 'for'), and the comparative adjective 'superior' governs 'to' (not 'than').",
    target: "Capstone Exam: Dependent Preposition Verification"
  },
  {
    questionNumber: 52,
    question: "In paragraph 2, what dependent preposition errors did the prime contractor avoid when the passage states he 'insisted on presenting his permit' and that his operations 'did not differ from those of previous concession holders'?",
    options: [
      "He avoided using 'insisted in/to' and avoided using 'differ with/than'",
      "He avoided using 'insisted for' and 'differ about'",
      "He avoided using past tense verbs",
      "He avoided using subject-verb concord"
    ],
    answer: "He avoided using 'insisted in/to' and avoided using 'differ with/than'",
    hint: "Identify the incorrect prepositions commonly substituted for 'on' after 'insist' and 'from' after 'differ'.",
    solution: "The standard collocations are 'insist on' (avoiding 'insist in/to') and 'differ from' when denoting contrast (avoiding 'differ with/than').",
    target: "Capstone Exam: Collocation Diagnostic"
  },
  {
    questionNumber: 53,
    question: "In paragraph 3, why is the construction 'looking forward to commissioning' grammatically correct instead of 'looking forward to commission'?",
    options: [
      "Because in the verbal idiom 'look forward to', 'to' is a true preposition, and all prepositions must be complemented by a gerund ('V-ing')",
      "Because 'commission' is an irregular verb that cannot take a bare infinitive",
      "Because 'dry season' is a temporal prepositional phrase",
      "Because 'looking forward' is a past participle"
    ],
    answer: "Because in the verbal idiom 'look forward to', 'to' is a true preposition, and all prepositions must be complemented by a gerund ('V-ing')",
    hint: "Review the rule governing true prepositional 'to' versus the infinitive marker 'to'.",
    solution: "In 'look forward to', 'to' is an authentic preposition, not an infinitive marker. Under standard English prepositional complementation rules, a preposition must take a gerund ('commissioning'), never an infinitive ('to commission').",
    target: "Capstone Exam: True Prepositional To"
  },
  {
    questionNumber: 54,
    question: "In paragraph 4, why does the sentence state that tactical coordination 'must remain strictly between them and the police commander' instead of 'between they and the police commander'?",
    options: [
      "Because prepositions assign the Objective Case to following pronouns, requiring 'them' rather than the nominative 'they'",
      "Because 'they' can only be used when referring to police officers",
      "Because 'between' is a coordinating conjunction that takes plural verbs",
      "Because 'them' refers to inanimate monitoring logs"
    ],
    answer: "Because prepositions assign the Objective Case to following pronouns, requiring 'them' rather than the nominative 'they'",
    hint: "Recall the Prepositional Case Law governing pronouns following prepositions like 'between'.",
    solution: "Prepositions govern the Objective (Accusative) Case. Nominative pronouns like 'they' are structurally barred as prepositional complements; 'between them' is grammatically mandatory.",
    target: "Capstone Exam: Prepositional Objective Case Law"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the complementation rule governing prepositions and following verbs in the passage.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Prepositions must be followed by gerunds.",
      "Because prepositions assign objective case, following verbs must always take the '-ing' gerund form.",
      "Using gerunds after English prepositions in formal writing.",
      "Prepositions take gerunds."
    ],
    answer: "Prepositions must be followed by gerunds.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Prepositions must be followed by gerunds' is exactly 6 words, forms a complete grammatical sentence with a modal auxiliary and active verb ('must be followed'), and articulates the rule directly. Option C is a fragment (0 marks), Option B contains 13 words, and Option D is only 4 words.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployStrand3B9Foundation() {
  console.log("Building 55 UNIQUE questions for Basic 9 (JHS 3) Strand 3 Grammar Foundation Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B9GrammarFoundationDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B9_G_F_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B9",
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
      learningCompetency: "B9.3.1.1: Demonstrate grammatical mastery of dependent prepositions (verbal, adjectival, nominal), prepositional gerund complementation, true prepositional 'to', and prepositional objective case assignment."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B9GrammarFoundationQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${b9GrammarFoundationCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B9_G_F_${item.questionNumber}`,
      level: "B9",
      difficulty: "foundation",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: b9GrammarFoundationCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B9.3.1.1 / B9.3.1.2: Synthesize multi-paragraph contextual grammar, evaluating dependent preposition regimes, gerundial complementation, prepositional case assignment, and concise rule summaries."
    });
  });

  // 3. Write directly to Firestore using the unified canonical topic path
  const targetDoc = db.doc(
    "global_curriculum/jhs/subjects/english/topical/grammar_lexis_prepositions_and_phrasal_verbs/practice_labs/B9_foundation"
  );

  await targetDoc.set({
    level: "B9",
    difficulty: "foundation",
    title: "Basic 9 Foundation Lab: 50 Unique Grammar Drills + 5 Capstone Exam Questions",
    totalQuestions: all55Questions.length,
    shortDrillsCount: 50,
    capstoneExamQuestionsCount: 5,
    questions: all55Questions,
    metadata: {
      hasDuplicateQuestions: false,
      uniqueQuestionsCount: 55,
      structure: "50 Unique Short Drills (Dependent Prepositions, Gerund Mandate, Case Law) + 5 Capstone Full-Passage Questions",
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

deployStrand3B9Foundation()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 3 B9 Foundation Lab:", err);
    process.exit(1);
  });
