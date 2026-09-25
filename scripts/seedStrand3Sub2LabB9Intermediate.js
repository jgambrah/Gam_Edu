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
// Style: Investigative Journalistic Feature / Narrative Reportage
// Strand 3 Sub-Strand 2 B9 Intermediate Focus:
// Third Conditionals, Had/Should/Were Inversions & Mandative Subjunctive
// =========================================================================
const b9SyntaxConcordIntermediateCapstonePassage = 
`When the thunderous roar echoed across the Densu Basin at dusk, residents of the fishing enclave assumed a dynamite blast had ripped through the illegal quarries. In reality, the community's two-million-dollar irrigation aqueduct had sheared clean off its concrete pylons, releasing millions of gallons of water into the cassava fields below. Inspecting the twisted rebar the following morning, the chief forensic investigator shook his head, noting that if the project engineers had respected structural load margins, the main flume would not have collapsed under peak hydraulic pressure. He remarked grimly that had the site inspector tested the tensile strength of the imported steel rods before casting the deck, this structural catastrophe would have been averted.

At the regional police headquarters, a leaked internal memorandum from the district planning desk sparked fresh outrage among the displaced farmers. According to the document, municipal building codes demand that every licensed contractor adhere strictly to seismic and fluid-stress benchmarks without exception. The state prosecutor pointed out that should any field supervisor detect unauthorized alterations in concrete grade during construction, immediate work suspension is mandatory. Yet, interviews with the junior cement mixers revealed that uncertified quarry dust had been blended into the mortar to line private pockets.

Facing a barrage of cameras on the courthouse steps, the municipal chief executive attempted to shift accountability to the regional ministry. When asked why he ignored three consecutive stop-work petitions filed by local engineers, he retorted that were the assembly to halt major capital projects at every complaint, infrastructure development would grind to an abrupt standstill. Unmoved by the official's defense, the district magistrate insisted that the council demand that the civil contractor clear the river channel immediately before the monsoon rains trigger wider contamination.

As rescue teams worked into the night to reinforce the secondary earthen dikes, public indignation reached a boiling point. The regional bar association announced that its legal defense fund recommended that the registrar-general revoke the corporate charter of the defaulting construction consortium. Standing under the glare of mobile floodlights, the local assemblywoman reminded the community that had the regulatory authorities exercised incorruptible vigilance during early foundation work, state funds and precious peasant livelihoods would have been safeguarded for future generations.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// =========================================================================
const unique50B9SyntaxConcordIntermediateDrills = [
  {
    passage: "If the civil engineer ________ the soil compaction metrics before casting the foundation, the multi-storey edifice would not have developed structural fissures.",
    question: "Choose the correct past perfect verb form for this Third Conditional sentence:",
    options: ["had verified", "verified", "would have verified", "has verified"],
    answer: "had verified",
    hint: "The conditional protasis (if-clause) of a Third Conditional requires the Past Perfect tense (had + past participle).",
    solution: "The Third Conditional expresses an unfulfilled past condition using the formula: IF + Past Perfect ('had verified'), ... would have + Past Participle ('would not have developed'). Inserting 'would have' into the if-clause is an error.",
    target: "Third Conditional: Past Perfect Protasis"
  },
  {
    passage: "The regional director of education demanded that the compromised headmaster ________ the keys to the administrative strongroom immediately.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["surrender", "surrenders", "surrendered", "is surrendering"],
    answer: "surrender",
    hint: "Nominal that-clauses governed by suasive verbs of demand ('demanded that') take the bare uninflected base verb.",
    solution: "The suasive verb 'demanded that' triggers the mandative subjunctive mood. The verb must appear in its uninflected base form ('surrender'), suppressing the third-person singular inflection '-s'.",
    target: "Mandative Subjunctive: Suasive Verb Demand"
  },
  {
    passage: "________ the senior surveyor spotted the boundary encroachment during the preliminary audit, the protracted land litigation would have been prevented.",
    question: "Choose the correct auxiliary verb to form this inverted counterfactual condition:",
    options: ["Had", "Should", "Were", "Did"],
    answer: "Had",
    hint: "Subject-auxiliary inversion in past counterfactual conditionals replaces 'If the surveyor had spotted' with 'Had the surveyor spotted'.",
    solution: "In formal prescriptive syntax, the Third Conditional omits 'if' through subject-auxiliary inversion using 'Had': 'Had the senior surveyor spotted...'.",
    target: "Inverted Conditionals: Had-Inversion"
  },
  {
    passage: "If the commercial vessel had detected the uncharted coral reef, the helmsman ________ the ship into deeper coastal waters.",
    question: "Choose the correct modal perfect construction to complete the Third Conditional apodosis:",
    options: ["would have steered", "would steer", "will have steered", "had steered"],
    answer: "would have steered",
    hint: "The result clause (apodosis) of a Third Conditional requires [would + have + Past Participle].",
    solution: "Paired with the past perfect protasis ('had detected'), the Third Conditional result clause requires the modal perfect: 'would have steered'.",
    target: "Third Conditional: Modal Perfect Apodosis"
  },
  {
    passage: "It is mandatory that every registered building contractor ________ verified architectural blueprints before commencing site clearing.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["submit", "submits", "submitted", "is submitting"],
    answer: "submit",
    hint: "Clauses following formulaic adjectives of necessity ('It is mandatory that...') take the bare uninflected base verb.",
    solution: "The formulaic adjective of necessity 'mandatory that' commands the mandative subjunctive. The bare base form 'submit' is required, rejecting third-person singular '-s'.",
    target: "Mandative Subjunctive: Adjective Mandatory"
  },
  {
    passage: "________ any candidate observe an anomaly in the printed test booklet, alert the chief invigilator without leaving your desk.",
    question: "Choose the correct auxiliary verb to form a First Conditional inversion:",
    options: ["Should", "Had", "Were", "Could"],
    answer: "Should",
    hint: "Predictive First Conditionals invert by placing 'Should' before the subject in place of 'If you observe'.",
    solution: "A Type 1 predictive condition inverts using 'Should + Subject + Base Verb': 'Should any candidate observe...' replaces 'If any candidate observes...'.",
    target: "Inverted Conditionals: Should-Inversion"
  },
  {
    passage: "If the municipal fire station had possessed heavy-duty hydraulic ladders, the rescue team ________ the occupants trapped on the upper floors.",
    question: "Choose the correct modal perfect construction:",
    options: ["could have evacuated", "could evacuate", "can have evacuated", "had evacuated"],
    answer: "could have evacuated",
    hint: "Third Conditional apodosis expressing past ability requires [could + have + Past Participle].",
    solution: "The counterfactual condition ('had possessed') requires the modal perfect of ability 'could have evacuated' in the main clause.",
    target: "Third Conditional: Modal Perfect Ability"
  },
  {
    passage: "The presiding judge ordered that the municipal finance ledger ________ impounded by the police registrar immediately.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "The passive subjunctive form of the copula 'to be' in mandative clauses is invariably the base form 'be'.",
    solution: "Following verbs of command ('ordered that'), the passive subjunctive requires the invariant base copula 'be' ('be impounded'). Using 'is' or 'was' is non-standard.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the sovereign central bank to reduce monetary policy interest rates, commercial lending would expand nationwide.",
    question: "Choose the correct auxiliary verb to form an inverted Second Conditional:",
    options: ["Were", "Had", "Should", "Would"],
    answer: "Were",
    hint: "Hypothetical Second Conditionals invert using 'Were + Subject + To-Infinitive' in place of 'If the central bank were to reduce'.",
    solution: "The Second Conditional inverts using 'Were': 'Were the sovereign central bank to reduce...' is the formal syntactic inversion of 'If the sovereign central bank were to reduce...'.",
    target: "Inverted Conditionals: Were-Inversion"
  },
  {
    passage: "If the airport control tower had warned the incoming cargo flight about the severe windshear, the pilot ________ off the runway.",
    question: "Choose the correct negative modal perfect construction:",
    options: ["would not have skidded", "would not skid", "will not have skidded", "had not skidded"],
    answer: "would not have skidded",
    hint: "Counterfactual past result requires [would not have + Past Participle].",
    solution: "The Third Conditional formula demands: IF + Past Perfect ('had warned'), ... would not have + Past Participle ('would not have skidded').",
    target: "Third Conditional: Negative Modal Perfect Apodosis"
  },
  {
    passage: "The parliamentary public accounts committee recommended that the defaulting revenue collector ________ prosecuted for embezzlement.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "Suasive verb 'recommended that' takes the invariant base copula 'be'.",
    solution: "The verb of recommendation 'recommended that' triggers the mandative subjunctive. The passive form requires the base copula 'be': 'be prosecuted'.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the national disease control centre dispatched diagnostic reagents earlier, the viral outbreak would have been contained within forty-eight hours.",
    question: "Choose the correct auxiliary verb to begin this inverted past counterfactual sentence:",
    options: ["Had", "Should", "Were", "Did"],
    answer: "Had",
    hint: "Inversion of 'If the centre had dispatched' starts with 'Had'.",
    solution: "Inverted Third Conditionals replace 'If + Subject + had + V3' with 'Had + Subject + V3': 'Had the national disease control centre dispatched...'.",
    target: "Inverted Conditionals: Had-Inversion"
  },
  {
    passage: "If the transport union had agreed to the municipal safety audit, the operating permit ________ by the assembly.",
    question: "Choose the correct passive modal perfect completion:",
    options: ["would not have been suspended", "would not be suspended", "will not have been suspended", "had not been suspended"],
    answer: "would not have been suspended",
    hint: "Unfulfilled past condition paired with a passive result requires [would not have been + Past Participle].",
    solution: "The past counterfactual condition 'had agreed' pairs with the passive modal perfect 'would not have been suspended' in the apodosis.",
    target: "Third Conditional: Passive Modal Perfect Apodosis"
  },
  {
    passage: "It is crucial that each laboratory technician ________ the chemical waste disposal logs daily.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["maintain", "maintains", "maintained", "is maintaining"],
    answer: "maintain",
    hint: "Formulaic adjective of urgency ('It is crucial that...') governs the bare uninflected base verb.",
    solution: "The adjective 'crucial that' licenses the mandative subjunctive mood. The verb must appear as the bare base 'maintain', rejecting the third-person singular suffix '-s'.",
    target: "Mandative Subjunctive: Adjective Crucial"
  },
  {
    passage: "________ any voter encounter an irregularity on the biometric voter register, report the issue to the polling station presiding officer.",
    question: "Choose the correct auxiliary verb for this inverted First Conditional:",
    options: ["Should", "Had", "Were", "If"],
    answer: "Should",
    hint: "First Conditional inversion substitutes 'Should' for 'If'.",
    solution: "'Should any voter encounter...' is the inverted syntactic equivalent of 'If any voter encounters...'.",
    target: "Inverted Conditionals: Should-Inversion"
  },
  {
    passage: "If the appellate court had admitted the fresh documentary evidence, the plaintiff ________ the defamation lawsuit.",
    question: "Choose the correct modal perfect construction:",
    options: ["would have won", "would win", "will have won", "had won"],
    answer: "would have won",
    hint: "Past Perfect in the if-clause requires 'would have + V3' in the main clause.",
    solution: "Third Conditional pairing: IF + Past Perfect ('had admitted'), ... modal perfect ('would have won').",
    target: "Third Conditional: Modal Perfect Apodosis"
  },
  {
    passage: "The environmental protection agency decreed that all mining operations within the water buffer zone ________ ceased immediately.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "Suasive verb 'decreed that' requires the invariant base copula 'be'.",
    solution: "The verb of decree 'decreed that' governs the mandative subjunctive. The passive construction takes the base copula 'be': 'be ceased'.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the regional transit corporation to acquire modern electric buses, commuter transit times would drop by half.",
    question: "Choose the correct auxiliary verb to form this inverted hypothetical condition:",
    options: ["Were", "Had", "Should", "Would"],
    answer: "Were",
    hint: "Second Conditional hypothetical inversion follows the formula: Were + Subject + to-infinitive.",
    solution: "'Were the regional transit corporation to acquire...' is the formal inverted realization of 'If the regional transit corporation were to acquire...'.",
    target: "Inverted Conditionals: Were-Inversion"
  },
  {
    passage: "If the laboratory refrigerator had preserved the viral samples at negative eighty degrees, the live specimens ________ unusable.",
    question: "Choose the correct negative modal perfect construction:",
    options: ["would not have become", "would not become", "will not have become", "had not become"],
    answer: "would not have become",
    hint: "Unfulfilled past condition requires [would not have + Past Participle ('become')].",
    solution: "The past participle of 'become' is 'become' (become, became, become). The Third Conditional apodosis requires 'would not have become'.",
    target: "Third Conditional: Irregular Past Participle Apodosis"
  },
  {
    passage: "The medical tribunal insisted that the suspended surgeon ________ a comprehensive clinical ethics retraining program.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["undertake", "undertakes", "undertook", "is undertaking"],
    answer: "undertake",
    hint: "Suasive verb 'insisted that' commands the bare uninflected base verb.",
    solution: "The suasive verb 'insisted that' triggers the mandative subjunctive. The bare base form 'undertake' is grammatically mandatory.",
    target: "Mandative Subjunctive: Suasive Verb Insist"
  },
  {
    passage: "________ the agricultural extension division distributed the drought-tolerant maize seeds on schedule, the crop harvest would have exceeded expectations.",
    question: "Choose the correct auxiliary verb to start the inverted counterfactual clause:",
    options: ["Had", "Should", "Were", "Could"],
    answer: "Had",
    hint: "Past counterfactual condition omitting 'if' begins with 'Had'.",
    solution: "'Had the agricultural extension division distributed...' is the formal inverted equivalent of 'If the agricultural extension division had distributed...'.",
    target: "Inverted Conditionals: Had-Inversion"
  },
  {
    passage: "If the national electrical utility had upgraded the regional transmission grid, the industrial zone ________ blackouts during the peak production cycle.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have suffered", "would not suffer", "will not have suffered", "had not suffered"],
    answer: "would not have suffered",
    hint: "Third Conditional apodosis takes [would not have + Past Participle].",
    solution: "Past perfect protasis ('had upgraded') commands the negative modal perfect apodosis ('would not have suffered').",
    target: "Third Conditional: Negative Modal Perfect Apodosis"
  },
  {
    passage: "It is essential that every candidate ________ their accredited biometric identification card during the national examination.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["display", "displays", "displayed", "is displaying"],
    answer: "display",
    hint: "Adjective of necessity ('It is essential that...') requires the bare uninflected base verb.",
    solution: "The formulaic adjective 'essential that' licenses the mandative subjunctive, which requires the bare base form 'display'.",
    target: "Mandative Subjunctive: Adjective Essential"
  },
  {
    passage: "________ any passenger experience sudden respiratory distress during flight, depress the cabin crew alert switch immediately.",
    question: "Choose the correct auxiliary verb for this inverted First Conditional sentence:",
    options: ["Should", "Had", "Were", "Would"],
    answer: "Should",
    hint: "Type 1 predictive conditions invert using 'Should'.",
    solution: "'Should any passenger experience...' is the formal inverted equivalent of 'If any passenger experiences...'.",
    target: "Inverted Conditionals: Should-Inversion"
  },
  {
    passage: "If the municipal roads department had reconstructed the collapsed bridge abutment, the heavy timber lorry ________ into the ravine.",
    question: "Choose the correct negative modal perfect construction:",
    options: ["would not have plunged", "would not plunge", "will not have plunged", "had not plunged"],
    answer: "would not have plunged",
    hint: "Negative past counterfactual result requires [would not have + Past Participle].",
    solution: "Third Conditional pairing: IF + Past Perfect ('had reconstructed'), ... negative modal perfect ('would not have plunged').",
    target: "Third Conditional: Negative Modal Perfect Apodosis"
  },
  {
    passage: "The university council proposed that the revised tuition structure ________ suspended until stakeholder consultations conclude.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "Suasive verb 'proposed that' takes the invariant base copula 'be'.",
    solution: "The suasive verb 'proposed that' governs the mandative subjunctive. The passive form requires the base copula 'be': 'be suspended'.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the supreme court bench to invalidate the disputed electoral statute, the legislature would be compelled to reconvene immediately.",
    question: "Choose the correct auxiliary verb to form this inverted hypothetical condition:",
    options: ["Were", "Had", "Should", "Would"],
    answer: "Were",
    hint: "Second Conditional inversion follows the formula: Were + Subject + to-infinitive.",
    solution: "'Were the supreme court bench to invalidate...' is the formal inverted equivalent of 'If the supreme court bench were to invalidate...'.",
    target: "Inverted Conditionals: Were-Inversion"
  },
  {
    passage: "If the maritime navigation beacon had warned the cargo tanker of the shallow sandbank, the vessel ________ aground.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have run", "would not run", "will not have run", "had not run"],
    answer: "would not have run",
    hint: "Past counterfactual result requires [would not have + Past Participle ('run')].",
    solution: "The past participle of 'run' is 'run' (run, ran, run). The Third Conditional apodosis requires 'would not have run'.",
    target: "Third Conditional: Irregular Past Participle Apodosis"
  },
  {
    passage: "The statutory health regulatory council stipulated that the private diagnostic facility ________ an accredited clinical biochemist.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["employ", "employs", "employed", "is employing"],
    answer: "employ",
    hint: "Suasive verb 'stipulated that' requires the bare uninflected base verb.",
    solution: "The verb of requirement 'stipulated that' triggers the mandative subjunctive. The uninflected base verb 'employ' is mandatory.",
    target: "Mandative Subjunctive: Suasive Verb Stipulate"
  },
  {
    passage: "________ the treasury department released capital budget subventions on schedule, the national maternity wing would have opened by June.",
    question: "Choose the correct auxiliary verb to begin this inverted past counterfactual sentence:",
    options: ["Had", "Should", "Were", "Did"],
    answer: "Had",
    hint: "Past counterfactual condition omitting 'if' begins with 'Had'.",
    solution: "'Had the treasury department released...' is the inverted syntactic equivalent of 'If the treasury department had released...'.",
    target: "Inverted Conditionals: Had-Inversion"
  },
  {
    passage: "If the aviation flight crew had aborted the takeoff upon observing the engine warning, the transport plane ________ off the tarmac.",
    question: "Choose the correct negative modal perfect construction:",
    options: ["would not have skidded", "would not skid", "will not have skidded", "had not skidded"],
    answer: "would not have skidded",
    hint: "Past counterfactual result takes [would not have + Past Participle].",
    solution: "The Third Conditional apodosis requires the negative modal perfect: 'would not have skidded'.",
    target: "Third Conditional: Modal Perfect Apodosis"
  },
  {
    passage: "It is imperative that every presiding polling officer ________ the physical ballot box seals before voting commences.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["inspect", "inspects", "inspected", "is inspecting"],
    answer: "inspect",
    hint: "Adjective of urgency ('It is imperative that...') requires the bare uninflected base verb.",
    solution: "The adjective 'imperative that' commands the mandative subjunctive, requiring the uninflected base verb 'inspect'.",
    target: "Mandative Subjunctive: Adjective Imperative"
  },
  {
    passage: "________ any taxpayer identify an error on the automated revenue assessment portal, file an electronic dispute within twenty-one days.",
    question: "Choose the correct auxiliary verb for this inverted First Conditional:",
    options: ["Should", "Had", "Were", "Could"],
    answer: "Should",
    hint: "Type 1 predictive conditions invert using 'Should'.",
    solution: "'Should any taxpayer identify...' is the formal inverted equivalent of 'If any taxpayer identifies...'.",
    target: "Inverted Conditionals: Should-Inversion"
  },
  {
    passage: "If the commercial timber enterprise had replanted deforested river buffer zones, the local soil ________ unfertile.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have become", "would not become", "will not have become", "had not become"],
    answer: "would not have become",
    hint: "Counterfactual past result requires [would not have + Past Participle ('become')].",
    solution: "Third Conditional pairing: IF + Past Perfect ('had replanted'), ... modal perfect ('would not have become').",
    target: "Third Conditional: Irregular Past Participle Apodosis"
  },
  {
    passage: "The municipal assembly resolved that the dilapidated public library ________ evacuated before the rainy season.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "Suasive verb 'resolved that' takes the invariant base copula 'be'.",
    solution: "The verb of resolution 'resolved that' commands the mandative subjunctive, requiring the bare copula 'be': 'be evacuated'.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the telecommunications regulator to revoke the company's operating license, thousands of network users would migrate to competing networks.",
    question: "Choose the correct auxiliary verb to form this inverted hypothetical condition:",
    options: ["Were", "Had", "Should", "Would"],
    answer: "Were",
    hint: "Second Conditional inversion follows the formula: Were + Subject + to-infinitive.",
    solution: "'Were the telecommunications regulator to revoke...' is the formal inverted equivalent of 'If the telecommunications regulator were to revoke...'.",
    target: "Inverted Conditionals: Were-Inversion"
  },
  {
    passage: "If the border control detachment had scrutinized the vehicle manifests thoroughly, the smuggled arms shipment ________ the capital.",
    question: "Choose the correct negative modal perfect construction:",
    options: ["would not have entered", "would not enter", "will not have entered", "had not entered"],
    answer: "would not have entered",
    hint: "Unfulfilled past condition requires [would not have + Past Participle].",
    solution: "The past counterfactual condition 'had scrutinized' pairs with 'would not have entered' in the apodosis.",
    target: "Third Conditional: Counterfactual Apodosis"
  },
  {
    passage: "The public prosecutor requested that the chief bank accountant ________ the frozen commercial ledgers in open court.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["produce", "produces", "produced", "is producing"],
    answer: "produce",
    hint: "Suasive verb 'requested that' commands the bare uninflected base verb.",
    solution: "The suasive verb 'requested that' triggers the mandative subjunctive. The bare base verb 'produce' is mandatory.",
    target: "Mandative Subjunctive: Suasive Verb Request"
  },
  {
    passage: "________ the forensic accounting team detected the altered payroll vouchers early, millions of public cedis would have been recovered.",
    question: "Choose the correct auxiliary verb to begin this inverted past counterfactual sentence:",
    options: ["Had", "Should", "Were", "Did"],
    answer: "Had",
    hint: "Past counterfactual condition omitting 'if' begins with 'Had'.",
    solution: "'Had the forensic accounting team detected...' is the inverted syntactic equivalent of 'If the forensic accounting team had detected...'.",
    target: "Inverted Conditionals: Had-Inversion"
  },
  {
    passage: "If the structural engineering firm had used high-grade marine cement, the coastal breakwater ________ under wave impact.",
    question: "Choose the correct negative modal perfect construction:",
    options: ["would not have fractured", "would not fracture", "will not have fractured", "had not fractured"],
    answer: "would not have fractured",
    hint: "Third Conditional apodosis takes [would not have + Past Participle].",
    solution: "Past perfect protasis ('had used') commands the negative modal perfect apodosis ('would not have fractured').",
    target: "Third Conditional: Modal Perfect Apodosis"
  },
  {
    passage: "It is vital that every laboratory assistant ________ the chemical sterilization temperature every three hours.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["record", "records", "recorded", "is recording"],
    answer: "record",
    hint: "Adjective of necessity ('It is vital that...') requires the bare uninflected base verb.",
    solution: "The formulaic adjective 'vital that' licenses the mandative subjunctive, requiring the uninflected base verb 'record'.",
    target: "Mandative Subjunctive: Adjective Vital"
  },
  {
    passage: "________ any citizen observe illegal sand winning along the coastal shoreline, notify the environmental task force immediately.",
    question: "Choose the correct auxiliary verb for this inverted First Conditional:",
    options: ["Should", "Had", "Were", "Could"],
    answer: "Should",
    hint: "Type 1 predictive conditions invert using 'Should'.",
    solution: "'Should any citizen observe...' is the formal inverted equivalent of 'If any citizen observes...'.",
    target: "Inverted Conditionals: Should-Inversion"
  },
  {
    passage: "If the regional maritime authority had replaced the damaged navigational buoys, the oil barge ________ the submerged rocks.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have struck", "would not strike", "will not have struck", "had not struck"],
    answer: "would not have struck",
    hint: "Counterfactual past result requires [would not have + Past Participle ('struck')].",
    solution: "Third Conditional pairing: IF + Past Perfect ('had replaced'), ... modal perfect ('would not have struck').",
    target: "Third Conditional: Irregular Past Participle Apodosis"
  },
  {
    passage: "The judicial council decreed that the corrupt court registrar ________ dismissed from public service.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "Suasive verb 'decreed that' takes the invariant base copula 'be'.",
    solution: "The verb of decree 'decreed that' commands the mandative subjunctive, requiring the bare copula 'be': 'be dismissed'.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the regional administrative council to reject the annual budget proposal, municipal infrastructural development would stall.",
    question: "Choose the correct auxiliary verb to form this inverted hypothetical condition:",
    options: ["Were", "Had", "Should", "Would"],
    answer: "Were",
    hint: "Second Conditional inversion follows the formula: Were + Subject + to-infinitive.",
    solution: "'Were the regional administrative council to reject...' is the formal inverted equivalent of 'If the regional administrative council were to reject...'.",
    target: "Inverted Conditionals: Were-Inversion"
  },
  {
    passage: "If the national petroleum agency had maintained strategic buffer reserves, domestic transport fares ________ during the oil embargo.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have escalated", "would not escalate", "will not have escalated", "had not escalated"],
    answer: "would not have escalated",
    hint: "Third Conditional apodosis takes [would not have + Past Participle].",
    solution: "Past perfect protasis ('had maintained') pairs with the negative modal perfect apodosis ('would not have escalated').",
    target: "Third Conditional: Modal Perfect Apodosis"
  },
  {
    passage: "The high court judge ordered that the seized contraband merchandise ________ destroyed in public view.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "Suasive verb 'ordered that' commands the invariant base copula 'be'.",
    solution: "The suasive verb 'ordered that' triggers the mandative subjunctive, requiring the bare copula 'be': 'be destroyed'.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the agricultural credit bank granted concessionary irrigation loans, smallholder farmers would not have suffered total harvest losses.",
    question: "Choose the correct auxiliary verb to begin this inverted past counterfactual sentence:",
    options: ["Had", "Should", "Were", "If"],
    answer: "Had",
    hint: "Inverted past counterfactual condition begins with 'Had + Subject + Past Participle'.",
    solution: "'Had the agricultural credit bank granted...' is the formal inverted equivalent of 'If the agricultural credit bank had granted...'.",
    target: "Inverted Conditionals: Had-Inversion"
  },
  {
    passage: "If the district medical officer had administered the antimalarial therapy promptly, the child ________ cerebral malaria complications.",
    question: "Choose the correct negative modal perfect construction:",
    options: ["would not have developed", "would not develop", "will not have developed", "had not developed"],
    answer: "would not have developed",
    hint: "Counterfactual past result requires [would not have + Past Participle].",
    solution: "Third Conditional pairing: IF + Past Perfect ('had administered'), ... modal perfect ('would not have developed').",
    target: "Third Conditional: Negative Modal Perfect Apodosis"
  },
  {
    passage: "It is necessary that each student candidate ________ their assigned geometry instruments to the examination center.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["bring", "brings", "brought", "is bringing"],
    answer: "bring",
    hint: "Formulaic adjective of necessity ('It is necessary that...') requires the bare uninflected base verb.",
    solution: "The formulaic adjective 'necessary that' licenses the mandative subjunctive mood. The bare base verb 'bring' is mandatory, rejecting the third-person '-s'.",
    target: "Mandative Subjunctive: Adjective Necessary"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// =========================================================================
const capstone5B9SyntaxConcordIntermediateQuestions = [
  {
    questionNumber: 51,
    question: "In paragraph 1, why is the clause 'if the project engineers had respected structural load margins, the main flume would not have collapsed' grammatically correct under Third Conditional rules?",
    options: [
      "Because it expresses an unfulfilled past counterfactual condition using the Past Perfect ('had respected') in the if-clause and the modal perfect ('would not have collapsed') in the main clause",
      "Because 'structural load margins' is an irregular plural noun phrase requiring past continuous concord",
      "Because conditional sentences in news features always require 'would have' in both clauses",
      "Because the sentence functions as a passive voice indirect command"
    ],
    answer: "Because it expresses an unfulfilled past counterfactual condition using the Past Perfect ('had respected') in the if-clause and the modal perfect ('would not have collapsed') in the main clause",
    hint: "Examine the past perfect protasis and the modal perfect apodosis.",
    solution: "Third Conditionals express retrospective counterfactual events using the formula: IF + Past Perfect ('had respected'), ... would have + Past Participle ('would not have collapsed').",
    target: "Capstone Exam: Third Conditional Counterfactual Analysis"
  },
  {
    questionNumber: 52,
    question: "In paragraph 1, what advanced syntactic transformation is demonstrated by the construction 'had the site inspector tested the tensile strength of the imported steel rods, this structural catastrophe would have been averted'?",
    options: [
      "An inverted Third Conditional counterfactual where 'if' is omitted through subject-auxiliary inversion using 'Had'",
      "A predictive First Conditional inversion utilizing the auxiliary 'Should'",
      "A mandative subjunctive clause commanded by an adjective of necessity",
      "A non-restrictive relative clause qualifying the site inspector"
    ],
    answer: "An inverted Third Conditional counterfactual where 'if' is omitted through subject-auxiliary inversion using 'Had'",
    hint: "Notice that 'if' is omitted and 'Had' is fronted before the subject.",
    solution: "The clause illustrates an Inverted Third Conditional: the subordinating conjunction 'if' is omitted, triggering subject-auxiliary inversion: [Had + Subject + Past Participle (tested)].",
    target: "Capstone Exam: Inverted Third Conditional Had-Inversion"
  },
  {
    questionNumber: 53,
    question: "In paragraph 2, why does the clause 'municipal building codes demand that every licensed contractor adhere strictly to seismic and fluid-stress benchmarks' use the base verb 'adhere' instead of 'adheres'?",
    options: [
      "Because the suasive verb 'demand that' triggers the mandative subjunctive mood, which requires the bare uninflected base verb and suppresses third-person singular '-s'",
      "Because 'every licensed contractor' is treated as a plural noun phrase in journalistic English",
      "Because 'building codes' is plural and governs plural concord in the subordinate that-clause",
      "Because 'adhere' is followed by the adverb 'strictly'"
    ],
    answer: "Because the suasive verb 'demand that' triggers the mandative subjunctive mood, which requires the bare uninflected base verb and suppresses third-person singular '-s'",
    hint: "Recall the mandative subjunctive rule following suasive verbs of demand.",
    solution: "Suasive verbs such as 'demand that' license the mandative subjunctive in the dependent that-clause. The verb must appear in its bare base form ('adhere'), completely rejecting third-person singular '-s'.",
    target: "Capstone Exam: Mandative Subjunctive Suasive Verb"
  },
  {
    questionNumber: 54,
    question: "In paragraph 3, which option correctly explains the grammatical structure of the inverted conditional clause 'were the assembly to halt major capital projects at every complaint'?",
    options: [
      "It is an inverted Second Conditional hypothetical sentence where 'if' is omitted, triggering inversion using 'Were + Subject + to-infinitive'",
      "It is an inverted Third Conditional expressing an unfulfilled historical action",
      "It is a mandative subjunctive clause expressing a municipal resolution",
      "It is an indirect question governed by the district magistrate"
    ],
    answer: "It is an inverted Second Conditional hypothetical sentence where 'if' is omitted, triggering inversion using 'Were + Subject + to-infinitive'",
    hint: "Check the formula: Were + Subject + to-infinitive.",
    solution: "'Were the assembly to halt...' represents an inverted Second Conditional expressing an unreal or hypothetical present condition, replacing 'If the assembly were to halt...'.",
    target: "Capstone Exam: Inverted Second Conditional Were-Inversion"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the mandative subjunctive rule governing verbs in paragraph 2.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Mandative clauses require the bare base verb.",
      "Because demand is a suasive verb in English, verbs in that-clauses must take the base form.",
      "Using the uninflected bare base verb in English mandative subjunctive clauses.",
      "Base verbs in mandative clauses."
    ],
    answer: "Mandative clauses require the bare base verb.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Mandative clauses require the bare base verb' is exactly 7 words, forms a complete grammatical Subject-Verb-Object sentence, and articulates the rule directly. Option C is a participial fragment (0 marks), Option B has 14 words, and Option D is a phrase.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

// =========================================================================
// DEPLOYMENT LOGIC
// =========================================================================
async function deploy() {
  console.log("Connecting to Firestore via Google OAuth2...");
  const db = await getDb();

  console.log("Building 55 UNIQUE questions for Basic 9 (JHS 3) Strand 3 Sub-Strand 2 Intermediate Lab...");
  const all55Questions = [];

  // 1. Build Questions 1 to 50
  unique50B9SyntaxConcordIntermediateDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B9_S2_I_${qNum < 10 ? "0" + qNum : qNum}`,
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
      learningCompetency: "B9.3.1.2 / B9.3.2.1 / B9.3.3.1: Demonstrate intermediate grammatical mastery of Third Conditionals, inverted conditionals (Had, Should, Were), and the mandative subjunctive."
    });
  });

  // 2. Build Questions 51 to 55
  capstone5B9SyntaxConcordIntermediateQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${b9SyntaxConcordIntermediateCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B9_S2_I_${item.questionNumber}`,
      level: "B9",
      difficulty: "intermediate",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: b9SyntaxConcordIntermediateCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B9.3.1.2 / B9.3.2.1 / B9.3.3.1: Synthesize intermediate multi-paragraph contextual grammar, evaluating Third Conditionals, subjunctive inversions, mandative syntax, and concise rule summaries."
    });
  });

  // Map to TopicalPracticeQuestion format for the main doc practicePool
  const practicePoolQuestions = all55Questions.map(q => ({
    id: q.id,
    difficulty: "medium",
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: 1
  }));

  const subDocPayload = {
    level: "B9",
    difficulty: "intermediate",
    title: "Basic 9 Intermediate Lab: 50 Unique Syntax, Conditional & Subjunctive Drills + 5 Capstone Exam Questions",
    totalQuestions: all55Questions.length,
    shortDrillsCount: 50,
    capstoneExamQuestionsCount: 5,
    questions: all55Questions,
    metadata: {
      hasDuplicateQuestions: false,
      uniqueQuestionsCount: 55,
      structure: "50 Unique Short Drills (Third Conditionals, Had/Should/Were Inversions, Mandative Subjunctive) + 5 Capstone Full-Passage Questions",
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
    console.log(`🎯 Populating B9 Intermediate for: ${topicId}`);
    console.log(`======================================================`);

    // 1. Write subcollection doc
    const subDocPath = `global_curriculum/jhs/subjects/english/topical/${topicId}/practice_labs/B9_intermediate`;
    await db.doc(subDocPath).set(subDocPayload, { merge: true });
    console.log(`   ✅ Wrote subcollection doc: ${subDocPath}`);

    // 2. Update main doc's levels.b9.practicePool.medium across all parent collections
    for (const parent of parentPaths) {
      const mainDocPath = `${parent}/${topicId}`;
      const mainRef = db.doc(mainDocPath);
      const snap = await mainRef.get();
      if (snap.exists) {
        const curData = snap.data() || {};
        const curLevels = curData.levels || {};
        const curB9 = curLevels.b9 || {};
        const curPool = curB9.practicePool || { low: [], medium: [], hard: [] };

        const updatedPool = {
          ...curPool,
          medium: practicePoolQuestions
        };

        const totalQs = (curLevels.b7?.practicePool?.low?.length || 0) +
                        (curLevels.b7?.practicePool?.medium?.length || 0) +
                        (curLevels.b7?.practicePool?.hard?.length || 0) +
                        (curLevels.b8?.practicePool?.low?.length || 0) +
                        (curLevels.b8?.practicePool?.medium?.length || 0) +
                        (curLevels.b8?.practicePool?.hard?.length || 0) +
                        (updatedPool.low?.length || 0) +
                        (updatedPool.medium?.length || 0) +
                        (updatedPool.hard?.length || 0);

        await mainRef.set({
          levels: {
            ...curLevels,
            b9: {
              ...curB9,
              practicePool: updatedPool
            }
          },
          totalPracticeQuestions: totalQs,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        console.log(`   ✅ Updated main doc pool at: ${mainDocPath} (B9 Medium: ${practicePoolQuestions.length} Qs, Total: ${totalQs})`);
      }
    }
  }

  console.log("\n🎉 Basic 9 (JHS 3) Intermediate Lab successfully deployed!");
}

deploy()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("❌ Fatal Error Deploying B9 Intermediate Lab:", err);
    process.exit(1);
  });
