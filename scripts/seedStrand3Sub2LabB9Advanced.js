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
// Style: Investigative Narrative Reportage / Forensic Journalistic Feature
// Strand 3 Sub-Strand 2 B9 Advanced Focus:
// Complex Third Conditionals, Had/Should/Were Inversions & Mandative Subjunctive
// =========================================================================
const b9SyntaxConcordAdvancedCapstonePassage = 
`When the tidal sluice gates buckled under midnight floodwaters in the Volta Estuary, residents of the riverine community awoke to find their entire fishing harbor submerged under four feet of brackish brine. Inspecting the sheared hydraulic pistons at dawn, the chief maritime forensic surveyor observed that if the private engineering contractor had reinforced the seawall foundations with high-grade marine basalt, the coastal embankment would not have collapsed under storm surges. She stated candidly to assembled community elders that had the regional supervisory inspector conducted mandatory ultrasonic stress tests on the steel bulkheads, the catastrophic failure would have been averted before the rainy season.

At the municipal police headquarters, an unredacted investigative dossier submitted by the maritime union triggered intense public outrage. According to statutory public works regulations, maritime construction bylaws demand that every licensed marine engineering firm adhere strictly to international tidal pressure thresholds. The lead state attorney explained that should any onsite safety diver discover anomalous seabed liquefaction during caisson placement, an immediate halt to all dredging operations is mandatory. However, sworn testimonies from the apprentice welders revealed that substandard recycled iron rebars had been used to artificially compress operational expenditure.

Facing hostile questioning from investigative reporters outside the regional high court, the municipal chief executive attempted to deflect institutional culpability toward the finance ministry. When asked why he disregarded three written petitions submitted by the coastal defense committee, he replied defensively that were the assembly to suspend critical infrastructural projects whenever union members complain, economic modernization would grind to an abrupt halt across the municipality. Rejecting this rationale, the presiding magistrate insisted that the regional coordinating council demand that the defaulted contractor demolish the fractured sluice structures immediately to protect human lives.

As emergency repair crews worked under generator-powered halogen lamps to secure the remaining earthen barriers, the municipal bar association announced that its civil litigation division recommended that the registrar-general revoke the engineering accreditation of the defaulting consortium. Addressing a gathering of displaced canoe fishermen beneath the floodlights, the local assemblywoman affirmed that had state regulatory authorities maintained uncompromising vigilance throughout the project's inception, millions of cedis in public revenue and precious artisanal livelihoods would have been safeguarded for future generations.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// =========================================================================
const unique50B9SyntaxConcordAdvancedDrills = [
  {
    passage: "If the geotechnical engineering firm ________ the subterranean bedrock integrity before boring the tunnel, the mountain transit highway would not have caved in.",
    question: "Choose the correct past perfect verb form for this Third Conditional sentence:",
    options: ["had evaluated", "evaluated", "would have evaluated", "has evaluated"],
    answer: "had evaluated",
    hint: "The conditional protasis (if-clause) of a Third Conditional requires the Past Perfect tense (had + past participle).",
    solution: "The Third Conditional expresses an unfulfilled past condition using the formula: IF + Past Perfect ('had evaluated'), ... would have + Past Participle ('would not have caved in'). Inserting 'would have' into the if-clause is an error.",
    target: "Third Conditional: Past Perfect Protasis"
  },
  {
    passage: "The public accounts committee demanded that the former director-general ________ all unvouched overseas expenditure logs to the investigative panel.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["surrender", "surrenders", "surrendered", "is surrendering"],
    answer: "surrender",
    hint: "Nominal that-clauses governed by suasive verbs of demand ('demanded that') take the bare uninflected base verb.",
    solution: "The suasive verb 'demanded that' triggers the mandative subjunctive mood. The verb must appear in its uninflected base form ('surrender'), completely suppressing the third-person singular inflection '-s'.",
    target: "Mandative Subjunctive: Suasive Verb Demand"
  },
  {
    passage: "________ the senior maritime surveyor identified the hull fracture during the dry-dock inspection, the disastrous cargo spill would have been averted.",
    question: "Choose the correct auxiliary verb to form this inverted counterfactual condition:",
    options: ["Had", "Should", "Were", "Did"],
    answer: "Had",
    hint: "Subject-auxiliary inversion in past counterfactual conditionals replaces 'If the surveyor had identified' with 'Had the surveyor identified'.",
    solution: "In formal prescriptive syntax, the Third Conditional omits 'if' through subject-auxiliary inversion using 'Had': 'Had the senior maritime surveyor identified...'.",
    target: "Inverted Conditionals: Had-Inversion"
  },
  {
    passage: "If the radar operator had detected the incoming storm front, the flight crew ________ the aircraft away from the severe turbulence.",
    question: "Choose the correct modal perfect construction to complete the Third Conditional apodosis:",
    options: ["would have navigated", "would navigate", "will have navigated", "had navigated"],
    answer: "would have navigated",
    hint: "The result clause (apodosis) of a Third Conditional requires [would + have + Past Participle].",
    solution: "Paired with the past perfect protasis ('had detected'), the Third Conditional result clause requires the modal perfect: 'would have navigated'.",
    target: "Third Conditional: Modal Perfect Apodosis"
  },
  {
    passage: "It is mandatory that every commercial shipping operator ________ a certified environmental safety officer aboard container vessels.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["station", "stations", "stationed", "is stationing"],
    answer: "station",
    hint: "Clauses following formulaic adjectives of necessity ('It is mandatory that...') take the bare uninflected base verb.",
    solution: "The formulaic adjective of necessity 'mandatory that' commands the mandative subjunctive. The bare base form 'station' is required, rejecting third-person singular '-s'.",
    target: "Mandative Subjunctive: Adjective Mandatory"
  },
  {
    passage: "________ any foreign vessel enter the sovereign territorial zone without prior clearance, the naval detachment will initiate interception protocols.",
    question: "Choose the correct auxiliary verb to form a First Conditional inversion:",
    options: ["Should", "Had", "Were", "Could"],
    answer: "Should",
    hint: "Predictive First Conditionals invert by placing 'Should' before the subject in place of 'If a vessel enters'.",
    solution: "A Type 1 predictive condition inverts using 'Should + Subject + Base Verb': 'Should any foreign vessel enter...' replaces 'If any foreign vessel enters...'.",
    target: "Inverted Conditionals: Should-Inversion"
  },
  {
    passage: "If the municipal hospital had maintained backup solar generators, the intensive care surgical team ________ life-support systems without interruption.",
    question: "Choose the correct modal perfect construction:",
    options: ["could have sustained", "could sustain", "can have sustained", "had sustained"],
    answer: "could have sustained",
    hint: "Third Conditional apodosis expressing past capability requires [could + have + Past Participle].",
    solution: "The counterfactual condition ('had maintained') requires the modal perfect of capability 'could have sustained' in the main clause.",
    target: "Third Conditional: Modal Perfect Ability"
  },
  {
    passage: "The presiding judge ordered that the corporate financial ledgers ________ impounded by the court bailiff immediately.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "The passive subjunctive form of the copula 'to be' in mandative clauses is invariably the base form 'be'.",
    solution: "Following verbs of command ('ordered that'), the passive subjunctive requires the invariant base copula 'be' ('be impounded'). Using 'is' or 'was' is non-standard.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the sovereign state to default on its multilateral debt obligations, institutional capital markets would suspend all future bond issues.",
    question: "Choose the correct auxiliary verb to form an inverted Second Conditional:",
    options: ["Were", "Had", "Should", "Would"],
    answer: "Were",
    hint: "Hypothetical Second Conditionals invert using 'Were + Subject + To-Infinitive' in place of 'If the state were to default'.",
    solution: "The Second Conditional inverts using 'Were': 'Were the sovereign state to default...' is the formal syntactic inversion of 'If the sovereign state were to default...'.",
    target: "Inverted Conditionals: Were-Inversion"
  },
  {
    passage: "If the airport ground radar had signaled the taxiway obstruction in time, the passenger jetliner ________ with the fuel truck.",
    question: "Choose the correct negative modal perfect construction:",
    options: ["would not have collided", "would not collide", "will not have collided", "had not collided"],
    answer: "would not have collided",
    hint: "Counterfactual past result requires [would not have + Past Participle].",
    solution: "The Third Conditional formula demands: IF + Past Perfect ('had signaled'), ... would not have + Past Participle ('would not have collided').",
    target: "Third Conditional: Negative Modal Perfect Apodosis"
  },
  {
    passage: "The environmental protection council recommended that the gold refinery ________ penalized for discharging toxic mercury into the aquifer.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "Suasive verb 'recommended that' takes the invariant base copula 'be'.",
    solution: "The verb of recommendation 'recommended that' triggers the mandative subjunctive. The passive form requires the base copula 'be': 'be penalized'.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the diagnostic epidemiological laboratory tested the water samples sooner, the cholera vector would have been neutralized before spreading.",
    question: "Choose the correct auxiliary verb to begin this inverted past counterfactual sentence:",
    options: ["Had", "Should", "Were", "Did"],
    answer: "Had",
    hint: "Inversion of 'If the laboratory had tested' starts with 'Had'.",
    solution: "Inverted Third Conditionals replace 'If + Subject + had + V3' with 'Had + Subject + V3': 'Had the diagnostic epidemiological laboratory tested...'.",
    target: "Inverted Conditionals: Had-Inversion"
  },
  {
    passage: "If the commercial transport syndicate had enforced daily breathalyzer screenings, the highway crash ________ by reckless driving.",
    question: "Choose the correct passive modal perfect completion:",
    options: ["would not have been caused", "would not be caused", "will not have been caused", "had not been caused"],
    answer: "would not have been caused",
    hint: "Unfulfilled past condition paired with a passive result requires [would not have been + Past Participle].",
    solution: "The past counterfactual condition 'had enforced' pairs with the passive modal perfect 'would not have been caused' in the apodosis.",
    target: "Third Conditional: Passive Modal Perfect Apodosis"
  },
  {
    passage: "It is crucial that each certified civil engineer ________ the structural integrity of pre-stressed concrete slabs before installation.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["certify", "certifies", "certified", "is certifying"],
    answer: "certify",
    hint: "Formulaic adjective of urgency ('It is crucial that...') governs the bare uninflected base verb.",
    solution: "The adjective 'crucial that' licenses the mandative subjunctive mood. The verb must appear as the bare base 'certify', rejecting the third-person singular suffix '-s'.",
    target: "Mandative Subjunctive: Adjective Crucial"
  },
  {
    passage: "________ any commercial bank violate the mandatory capital liquidity threshold, the central monetary authority will impose statutory sanctions.",
    question: "Choose the correct auxiliary verb for this inverted First Conditional:",
    options: ["Should", "Had", "Were", "If"],
    answer: "Should",
    hint: "First Conditional inversion substitutes 'Should' for 'If'.",
    solution: "'Should any commercial bank violate...' is the inverted syntactic equivalent of 'If any commercial bank violates...'.",
    target: "Inverted Conditionals: Should-Inversion"
  },
  {
    passage: "If the appellate court had admitted the sworn ballistic affidavit, the wrongly convicted defendant ________ his freedom immediately.",
    question: "Choose the correct modal perfect construction:",
    options: ["would have regained", "would regain", "will have regained", "had regained"],
    answer: "would have regained",
    hint: "Past Perfect in the if-clause requires 'would have + V3' in the main clause.",
    solution: "Third Conditional pairing: IF + Past Perfect ('had admitted'), ... modal perfect ('would have regained').",
    target: "Third Conditional: Modal Perfect Apodosis"
  },
  {
    passage: "The cabinet sub-committee decreed that all unlicensed quarrying along the river valley ________ terminated with immediate effect.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "Suasive verb 'decreed that' requires the invariant base copula 'be'.",
    solution: "The verb of decree 'decreed that' governs the mandative subjunctive. The passive construction takes the base copula 'be': 'be terminated'.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the agricultural development corporation to subsidize modern drip-irrigation equipment, commercial crop harvests would double across the savannah.",
    question: "Choose the correct auxiliary verb to form this inverted hypothetical condition:",
    options: ["Were", "Had", "Should", "Would"],
    answer: "Were",
    hint: "Second Conditional hypothetical inversion follows the formula: Were + Subject + to-infinitive.",
    solution: "'Were the agricultural development corporation to subsidize...' is the formal inverted realization of 'If the corporation were to subsidize...'.",
    target: "Inverted Conditionals: Were-Inversion"
  },
  {
    passage: "If the national blood bank had stored adequate plasma units, the surgical hospital ________ severely incapacitated during the disaster.",
    question: "Choose the correct negative modal perfect construction:",
    options: ["would not have become", "would not become", "will not have become", "had not become"],
    answer: "would not have become",
    hint: "Unfulfilled past condition requires [would not have + Past Participle ('become')].",
    solution: "The past participle of 'become' is 'become' (become, became, become). The Third Conditional apodosis requires 'would not have become'.",
    target: "Third Conditional: Irregular Past Participle Apodosis"
  },
  {
    passage: "The medical regulatory board insisted that the sanctioned pharmaceutical manufacturer ________ all contaminated cough syrups from commercial shelves.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["withdraw", "withdraws", "withdrew", "is withdrawing"],
    answer: "withdraw",
    hint: "Suasive verb 'insisted that' commands the bare uninflected base verb.",
    solution: "The suasive verb 'insisted that' triggers the mandative subjunctive. The bare base form 'withdraw' is grammatically mandatory.",
    target: "Mandative Subjunctive: Suasive Verb Insist"
  },
  {
    passage: "________ the regional electricity corporation overhauled the cooling fans on the step-down transformers, the widespread blackout would have been prevented.",
    question: "Choose the correct auxiliary verb to start the inverted counterfactual clause:",
    options: ["Had", "Should", "Were", "Could"],
    answer: "Had",
    hint: "Past counterfactual condition omitting 'if' begins with 'Had'.",
    solution: "'Had the regional electricity corporation overhauled...' is the formal inverted equivalent of 'If the corporation had overhauled...'.",
    target: "Inverted Conditionals: Had-Inversion"
  },
  {
    passage: "If the municipal water directorate had procured chemical coagulants in bulk, the treatment facility ________ water distribution during the harmattan.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have curtailed", "would not curtail", "will not have curtailed", "had not curtailed"],
    answer: "would not have curtailed",
    hint: "Third Conditional apodosis takes [would not have + Past Participle].",
    solution: "Past perfect protasis ('had procured') commands the negative modal perfect apodosis ('would not have curtailed').",
    target: "Third Conditional: Negative Modal Perfect Apodosis"
  },
  {
    passage: "It is essential that every prospective judicial appointee ________ a thorough background audit by the intelligence service.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["undergo", "undergoes", "underwent", "is undergoing"],
    answer: "undergo",
    hint: "Adjective of necessity ('It is essential that...') requires the bare uninflected base verb.",
    solution: "The formulaic adjective 'essential that' licenses the mandative subjunctive, which requires the bare base form 'undergo'.",
    target: "Mandative Subjunctive: Adjective Essential"
  },
  {
    passage: "________ any commercial aircraft experience mechanical depressurization in flight, emergency oxygen dispensers will deploy automatically.",
    question: "Choose the correct auxiliary verb for this inverted First Conditional sentence:",
    options: ["Should", "Had", "Were", "Would"],
    answer: "Should",
    hint: "Type 1 predictive conditions invert using 'Should'.",
    solution: "'Should any commercial aircraft experience...' is the formal inverted equivalent of 'If any commercial aircraft experiences...'.",
    target: "Inverted Conditionals: Should-Inversion"
  },
  {
    passage: "If the forestry division had mobilized mobile forest patrols along the border, illegal timber loggers ________ the sacred rosewood groves.",
    question: "Choose the correct negative modal perfect construction:",
    options: ["would not have decimated", "would not decimate", "will not have decimated", "had not decimated"],
    answer: "would not have decimated",
    hint: "Negative past counterfactual result requires [would not have + Past Participle].",
    solution: "Third Conditional pairing: IF + Past Perfect ('had mobilized'), ... negative modal perfect ('would not have decimated').",
    target: "Third Conditional: Negative Modal Perfect Apodosis"
  },
  {
    passage: "The university council proposed that the contested vice-chancellor selection process ________ annulled to restore institutional peace.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "Suasive verb 'proposed that' takes the invariant base copula 'be'.",
    solution: "The suasive verb 'proposed that' governs the mandative subjunctive. The passive form requires the base copula 'be': 'be annulled'.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the legislative assembly to amend the national mining code, multinational mining concessions would face higher royalty levies.",
    question: "Choose the correct auxiliary verb to form this inverted hypothetical condition:",
    options: ["Were", "Had", "Should", "Would"],
    answer: "Were",
    hint: "Second Conditional inversion follows the formula: Were + Subject + to-infinitive.",
    solution: "'Were the legislative assembly to amend...' is the formal inverted equivalent of 'If the legislative assembly were to amend...'.",
    target: "Inverted Conditionals: Were-Inversion"
  },
  {
    passage: "If the veterinary task force had quarantined the border cattle ranches immediately, the contagious rinderpest virus ________ across the savannah.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have spread", "would not spread", "will not have spread", "had not spread"],
    answer: "would not have spread",
    hint: "Past counterfactual result requires [would not have + Past Participle ('spread')].",
    solution: "The past participle of 'spread' is 'spread' (spread, spread, spread). The Third Conditional apodosis requires 'would not have spread'.",
    target: "Third Conditional: Irregular Past Participle Apodosis"
  },
  {
    passage: "The public procurement authority stipulated that every shortlisted construction consortium ________ a verifiable performance bond.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["provide", "provides", "provided", "is providing"],
    answer: "provide",
    hint: "Suasive verb 'stipulated that' requires the bare uninflected base verb.",
    solution: "The verb of requirement 'stipulated that' triggers the mandative subjunctive. The uninflected base verb 'provide' is mandatory.",
    target: "Mandative Subjunctive: Suasive Verb Stipulate"
  },
  {
    passage: "________ the national fire rescue service arrived with foam tenders promptly, the bulk fuel depot would not have ignited.",
    question: "Choose the correct auxiliary verb to begin this inverted past counterfactual sentence:",
    options: ["Had", "Should", "Were", "Did"],
    answer: "Had",
    hint: "Past counterfactual condition omitting 'if' begins with 'Had'.",
    solution: "'Had the national fire rescue service arrived...' is the inverted syntactic equivalent of 'If the service had arrived...'.",
    target: "Inverted Conditionals: Had-Inversion"
  },
  {
    passage: "If the locomotive engineer had applied the pneumatic emergency brakes upon hearing the track signal, the freight train ________ off the rails.",
    question: "Choose the correct negative modal perfect construction:",
    options: ["would not have derailed", "would not derail", "will not have derailed", "had not derailed"],
    answer: "would not have derailed",
    hint: "Past counterfactual result takes [would not have + Past Participle].",
    solution: "The Third Conditional apodosis requires the negative modal perfect: 'would not have derailed'.",
    target: "Third Conditional: Modal Perfect Apodosis"
  },
  {
    passage: "It is imperative that every accredited laboratory researcher ________ their chemical sterilization protocols every morning.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["verify", "verifies", "verified", "is verifying"],
    answer: "verify",
    hint: "Adjective of urgency ('It is imperative that...') requires the bare uninflected base verb.",
    solution: "The adjective 'imperative that' commands the mandative subjunctive, requiring the uninflected base verb 'verify'.",
    target: "Mandative Subjunctive: Adjective Imperative"
  },
  {
    passage: "________ any commercial passenger carrier exceed statutory highway speed limits, automated speed cameras will log the license plate for prosecution.",
    question: "Choose the correct auxiliary verb for this inverted First Conditional:",
    options: ["Should", "Had", "Were", "Could"],
    answer: "Should",
    hint: "Type 1 predictive conditions invert using 'Should'.",
    solution: "'Should any commercial passenger carrier exceed...' is the formal inverted equivalent of 'If any commercial carrier exceeds...'.",
    target: "Inverted Conditionals: Should-Inversion"
  },
  {
    passage: "If the river basin conservation authority had banned heavy dredging excavators, the artisanal fisheries ________ barren.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have become", "would not become", "will not have become", "had not become"],
    answer: "would not have become",
    hint: "Counterfactual past result requires [would not have + Past Participle ('become')].",
    solution: "Third Conditional pairing: IF + Past Perfect ('had banned'), ... modal perfect ('would not have become').",
    target: "Third Conditional: Irregular Past Participle Apodosis"
  },
  {
    passage: "The municipal assembly resolved that the dilapidated colonial post office ________ designated as a protected national heritage monument.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "Suasive verb 'resolved that' takes the invariant base copula 'be'.",
    solution: "The verb of resolution 'resolved that' commands the mandative subjunctive, requiring the bare copula 'be': 'be designated'.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the petroleum regulatory board to deregulate domestic kerosene distribution, multinational energy firms would invest heavily in local storage depots.",
    question: "Choose the correct auxiliary verb to form this inverted hypothetical condition:",
    options: ["Were", "Had", "Should", "Would"],
    answer: "Were",
    hint: "Second Conditional inversion follows the formula: Were + Subject + to-infinitive.",
    solution: "'Were the petroleum regulatory board to deregulate...' is the formal inverted equivalent of 'If the board were to deregulate...'.",
    target: "Inverted Conditionals: Were-Inversion"
  },
  {
    passage: "If the customs intelligence detachment had monitored the bonded container warehouse vigilantly, the smuggled electronic consignment ________ domestic retail markets.",
    question: "Choose the correct negative modal perfect construction:",
    options: ["would not have flooded", "would not flood", "will not have flooded", "had not flooded"],
    answer: "would not have flooded",
    hint: "Unfulfilled past condition requires [would not have + Past Participle].",
    solution: "The past counterfactual condition 'had monitored' pairs with 'would not have flooded' in the apodosis.",
    target: "Third Conditional: Counterfactual Apodosis"
  },
  {
    passage: "The state prosecutor requested that the chief forensic auditor ________ the unredacted procurement ledgers during the public hearing.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["produce", "produces", "produced", "is producing"],
    answer: "produce",
    hint: "Suasive verb 'requested that' commands the bare uninflected base verb.",
    solution: "The suasive verb 'requested that' triggers the mandative subjunctive. The bare base verb 'produce' is mandatory.",
    target: "Mandative Subjunctive: Suasive Verb Request"
  },
  {
    passage: "________ the highway patrol officers maintained constant radar surveillance on the bypass, excessive vehicular speeding would have been curtailed.",
    question: "Choose the correct auxiliary verb to begin this inverted past counterfactual sentence:",
    options: ["Had", "Should", "Were", "Did"],
    answer: "Had",
    hint: "Past counterfactual condition omitting 'if' begins with 'Had'.",
    solution: "'Had the highway patrol officers maintained...' is the inverted syntactic equivalent of 'If the officers had maintained...'.",
    target: "Inverted Conditionals: Had-Inversion"
  },
  {
    passage: "If the civil aviation board had grounded the passenger aircraft following the engine diagnostic warning, the mid-air mechanical failure ________.",
    question: "Choose the correct negative modal perfect construction:",
    options: ["would not have occurred", "would not occur", "will not have occurred", "had not occurred"],
    answer: "would not have occurred",
    hint: "Third Conditional apodosis takes [would not have + Past Participle].",
    solution: "Past perfect protasis ('had grounded') commands the negative modal perfect apodosis ('would not have occurred').",
    target: "Third Conditional: Modal Perfect Apodosis"
  },
  {
    passage: "It is vital that every forensic officer ________ the chain of custody for all physical crime scene evidence.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["document", "documents", "documented", "is documenting"],
    answer: "document",
    hint: "Adjective of necessity ('It is vital that...') requires the bare uninflected base verb.",
    solution: "The formulaic adjective 'vital that' licenses the mandative subjunctive, requiring the uninflected base verb 'document'.",
    target: "Mandative Subjunctive: Adjective Vital"
  },
  {
    passage: "________ any registered voter discover an omitted index entry on the provisional electoral roll, submit a formal claim to the registration supervisor.",
    question: "Choose the correct auxiliary verb for this inverted First Conditional:",
    options: ["Should", "Had", "Were", "Could"],
    answer: "Should",
    hint: "Type 1 predictive conditions invert using 'Should'.",
    solution: "'Should any registered voter discover...' is the formal inverted equivalent of 'If any registered voter discovers...'.",
    target: "Inverted Conditionals: Should-Inversion"
  },
  {
    passage: "If the national naval command had deployed coastal radar buoys across the maritime boundary, the illegal fishing fleet ________ the exclusive economic zone.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have breached", "would not breach", "will not have breached", "had not breached"],
    answer: "would not have breached",
    hint: "Counterfactual past result requires [would not have + Past Participle].",
    solution: "Third Conditional pairing: IF + Past Perfect ('had deployed'), ... modal perfect ('would not have breached').",
    target: "Third Conditional: Negative Modal Perfect Apodosis"
  },
  {
    passage: "The judicial council decreed that the suspended high court registrar ________ removed from public office without retirement gratuities.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "Suasive verb 'decreed that' takes the invariant base copula 'be'.",
    solution: "The verb of decree 'decreed that' commands the mandative subjunctive, requiring the bare copula 'be': 'be removed'.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the central government to devolve fiscal licensing powers to municipal assemblies, local revenue generation would expand exponentially.",
    question: "Choose the correct auxiliary verb to form this inverted hypothetical condition:",
    options: ["Were", "Had", "Should", "Would"],
    answer: "Were",
    hint: "Second Conditional inversion follows the formula: Were + Subject + to-infinitive.",
    solution: "'Were the central government to devolve...' is the formal inverted equivalent of 'If the central government were to devolve...'.",
    target: "Inverted Conditionals: Were-Inversion"
  },
  {
    passage: "If the mineral commission had verified the environmental impact assessment rigorously, the toxic tailings reservoir ________ into the drinking stream.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have leaked", "would not leak", "will not have leaked", "had not leaked"],
    answer: "would not have leaked",
    hint: "Third Conditional apodosis takes [would not have + Past Participle].",
    solution: "Past perfect protasis ('had verified') pairs with the negative modal perfect apodosis ('would not have leaked').",
    target: "Third Conditional: Modal Perfect Apodosis"
  },
  {
    passage: "The public health magistrate ordered that the contaminated poultry farm ________ quarantined under military guard.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "Suasive verb 'ordered that' commands the invariant base copula 'be'.",
    solution: "The suasive verb 'ordered that' triggers the mandative subjunctive, requiring the bare copula 'be': 'be quarantined'.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the agricultural bank provided subsidized credit to smallholder cocoa farmers, seasonal crop abandonment would have been avoided.",
    question: "Choose the correct auxiliary verb to begin this inverted past counterfactual sentence:",
    options: ["Had", "Should", "Were", "If"],
    answer: "Had",
    hint: "Inverted past counterfactual condition begins with 'Had + Subject + Past Participle'.",
    solution: "'Had the agricultural bank provided...' is the formal inverted equivalent of 'If the agricultural bank had provided...'.",
    target: "Inverted Conditionals: Had-Inversion"
  },
  {
    passage: "If the emergency response detachment had cleared the road obstruction swiftly, the injured motorists ________ from severe hemorrhagic shock.",
    question: "Choose the correct negative modal perfect construction:",
    options: ["would not have succumbed", "would not succumb", "will not have succumbed", "had not succumbed"],
    answer: "would not have succumbed",
    hint: "Counterfactual past result requires [would not have + Past Participle].",
    solution: "Third Conditional pairing: IF + Past Perfect ('had cleared'), ... modal perfect ('would not have succumbed').",
    target: "Third Conditional: Negative Modal Perfect Apodosis"
  },
  {
    passage: "It is necessary that every prospective candidate ________ their original birth certificate to the registration desk.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["present", "presents", "presented", "is presenting"],
    answer: "present",
    hint: "Formulaic adjective of necessity ('It is necessary that...') requires the bare uninflected base verb.",
    solution: "The formulaic adjective 'necessary that' licenses the mandative subjunctive mood. The bare base verb 'present' is mandatory, rejecting the third-person '-s'.",
    target: "Mandative Subjunctive: Adjective Necessary"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// =========================================================================
const capstone5B9SyntaxConcordAdvancedQuestions = [
  {
    questionNumber: 51,
    question: "In paragraph 1, why is the clause 'if the private engineering contractor had reinforced the seawall foundations with high-grade marine basalt, the coastal embankment would not have collapsed' grammatically correct under Third Conditional rules?",
    options: [
      "Because it expresses an unfulfilled past counterfactual condition using the Past Perfect ('had reinforced') in the if-clause and the modal perfect ('would not have collapsed') in the main clause",
      "Because 'seawall foundations' is an irregular plural noun phrase requiring past continuous concord",
      "Because conditional sentences in investigative features always require 'would have' in both clauses",
      "Because the sentence functions as a passive voice indirect command"
    ],
    answer: "Because it expresses an unfulfilled past counterfactual condition using the Past Perfect ('had reinforced') in the if-clause and the modal perfect ('would not have collapsed') in the main clause",
    hint: "Examine the past perfect protasis and the modal perfect apodosis.",
    solution: "Third Conditionals express retrospective counterfactual events using the formula: IF + Past Perfect ('had reinforced'), ... would have + Past Participle ('would not have collapsed').",
    target: "Capstone Exam: Third Conditional Counterfactual Analysis"
  },
  {
    questionNumber: 52,
    question: "In paragraph 1, what advanced syntactic transformation is demonstrated by the construction 'had the regional supervisory inspector conducted mandatory ultrasonic stress tests on the steel bulkheads, the catastrophic failure would have been averted'?",
    options: [
      "An inverted Third Conditional counterfactual where 'if' is omitted through subject-auxiliary inversion using 'Had'",
      "A predictive First Conditional inversion utilizing the auxiliary 'Should'",
      "A mandative subjunctive clause commanded by an adjective of necessity",
      "A non-restrictive relative clause qualifying the regional supervisory inspector"
    ],
    answer: "An inverted Third Conditional counterfactual where 'if' is omitted through subject-auxiliary inversion using 'Had'",
    hint: "Notice that 'if' is omitted and 'Had' is fronted before the subject.",
    solution: "The clause illustrates an Inverted Third Conditional: the subordinating conjunction 'if' is omitted, triggering subject-auxiliary inversion: [Had + Subject + Past Participle (conducted)].",
    target: "Capstone Exam: Inverted Third Conditional Had-Inversion"
  },
  {
    questionNumber: 53,
    question: "In paragraph 2, why does the clause 'maritime construction bylaws demand that every licensed marine engineering firm adhere strictly to international tidal pressure thresholds' use the base verb 'adhere' instead of 'adheres'?",
    options: [
      "Because the suasive verb 'demand that' triggers the mandative subjunctive mood, which requires the bare uninflected base verb and suppresses third-person singular '-s'",
      "Because 'every licensed marine engineering firm' is treated as a plural collective noun in maritime English",
      "Because 'construction bylaws' is plural and governs plural concord in the subordinate that-clause",
      "Because 'adhere' is directly followed by the adverb 'strictly'"
    ],
    answer: "Because the suasive verb 'demand that' triggers the mandative subjunctive mood, which requires the bare uninflected base verb and suppresses third-person singular '-s'",
    hint: "Recall the mandative subjunctive rule following suasive verbs of demand.",
    solution: "Suasive verbs such as 'demand that' license the mandative subjunctive in the dependent that-clause. The verb must appear in its bare base form ('adhere'), completely rejecting third-person singular '-s'.",
    target: "Capstone Exam: Mandative Subjunctive Suasive Verb"
  },
  {
    questionNumber: 54,
    question: "In paragraph 3, which option correctly explains the grammatical structure of the inverted conditional clause 'were the assembly to suspend critical infrastructural projects whenever union members complain'?",
    options: [
      "It is an inverted Second Conditional hypothetical sentence where 'if' is omitted, triggering inversion using 'Were + Subject + to-infinitive'",
      "It is an inverted Third Conditional expressing an unfulfilled historical action",
      "It is a mandative subjunctive clause expressing a municipal council decree",
      "It is an indirect question governed by the municipal chief executive"
    ],
    answer: "It is an inverted Second Conditional hypothetical sentence where 'if' is omitted, triggering inversion using 'Were + Subject + to-infinitive'",
    hint: "Check the formula: Were + Subject + to-infinitive.",
    solution: "'Were the assembly to suspend...' represents an inverted Second Conditional expressing an unreal or hypothetical present condition, replacing 'If the assembly were to suspend...'.",
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

  console.log("Building 55 UNIQUE questions for Basic 9 (JHS 3) Strand 3 Sub-Strand 2 Advanced Lab...");
  const all55Questions = [];

  // 1. Build Questions 1 to 50
  unique50B9SyntaxConcordAdvancedDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B9_S2_A_${qNum < 10 ? "0" + qNum : qNum}`,
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
      learningCompetency: "B9.3.1.2 / B9.3.2.1 / B9.3.3.1: Demonstrate advanced grammatical mastery of Third Conditionals, inverted conditionals (Had, Should, Were), and the mandative subjunctive."
    });
  });

  // 2. Build Questions 51 to 55
  capstone5B9SyntaxConcordAdvancedQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${b9SyntaxConcordAdvancedCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B9_S2_A_${item.questionNumber}`,
      level: "B9",
      difficulty: "advanced",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: b9SyntaxConcordAdvancedCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B9.3.1.2 / B9.3.2.1 / B9.3.3.1: Synthesize advanced multi-paragraph contextual grammar, evaluating Third Conditionals, subjunctive inversions, mandative syntax, and concise rule summaries."
    });
  });

  // Map to TopicalPracticeQuestion format for the main doc practicePool
  const practicePoolQuestions = all55Questions.map(q => ({
    id: q.id,
    difficulty: "hard",
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: 1
  }));

  const subDocPayload = {
    level: "B9",
    difficulty: "advanced",
    title: "Basic 9 Advanced Lab: 50 Unique Syntax, Conditional & Subjunctive Drills + 5 Capstone Exam Questions",
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
    console.log(`🎯 Populating B9 Advanced for: ${topicId}`);
    console.log(`======================================================`);

    // 1. Write subcollection doc
    const subDocPath = `global_curriculum/jhs/subjects/english/topical/${topicId}/practice_labs/B9_advanced`;
    await db.doc(subDocPath).set(subDocPayload, { merge: true });
    console.log(`   ✅ Wrote subcollection doc: ${subDocPath}`);

    // 2. Update main doc's levels.b9.practicePool.hard across all parent collections
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
          hard: practicePoolQuestions
        };

        const totalQs = (curLevels.b7?.practicePool?.low?.length || 0) +
                        (curLevels.b7?.practicePool?.medium?.length || 0) +
                        (curLevels.b7?.practicePool?.hard?.length || 0) +
                        (curLevels.b8?.practicePool?.low?.length || 0) +
                        (curLevels.b8?.practicePool?.medium?.length || 0) +
                        (curLevels.b8?.practicePool?.hard?.length || 0) +
                        (curPool.low?.length || 0) +
                        (curPool.medium?.length || 0) +
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

        console.log(`   ✅ Updated main doc pool at: ${mainDocPath} (B9 Hard: ${practicePoolQuestions.length} Qs, Total: ${totalQs})`);
      }
    }
  }

  console.log("\n🎉 Basic 9 (JHS 3) Advanced Lab successfully deployed!");
}

deploy()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("❌ Fatal Error Deploying B9 Advanced Lab:", err);
    process.exit(1);
  });
