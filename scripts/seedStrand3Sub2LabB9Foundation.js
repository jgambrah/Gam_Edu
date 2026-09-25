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
// Strand 3 Sub-Strand 2 B9 Focus:
// Third Conditionals (Counterfactuals), Inverted Subjunctive Conditionals
// (Had-Inversion, Should-Inversion, Were-Inversion), and the Mandative Subjunctive
// =========================================================================
const b9SyntaxConcordFoundationCapstonePassage = 
`The special investigative panel on municipal infrastructure failure convened a public hearing in the regional capital to evaluate the catastrophic collapse of the new central transit terminal. The presiding engineer commenced the session by observing that if the structural contractors had complied with the approved engineering blueprints, the load-bearing columns would not have buckled under the weight of the roof. She emphasized that had the resident supervisor conducted routine core-strength stress tests, the structural flaw would have been identified prior to commissioning.

During the examination of the procurement records, the state attorney reviewed the statutory construction directives issued by the urban development board. He noted that municipal building regulations demand that every registered contractor adhere strictly to seismic load standards without unauthorized deviation. The attorney pointed out that should any contractor encounter anomalous soil liquefaction during foundation excavations, immediate geological intervention is mandatory. However, testimony from the site technicians revealed that uncertified sand mixtures had been substituted to reduce expenditures.

The panel subsequently cross-examined the municipal chief executive regarding administrative oversight failures. The presiding officer asked the chief executive why he failed to stop the project when the engineering union filed an emergency petition. The officer remarked that were the municipal assembly to enforce its statutory stop-work notices promptly, commercial buildings would not collapse across urban centers. She insisted that the local authority demand that the contractor demolish the remaining defective pavilions immediately to protect public safety.

Before adjourning the hearing, the panel chairperson issued a stern regulatory warning to all commercial real estate developers in the municipality. She stressed that the ministerial council recommended that the municipal assembly revoke the licenses of all non-compliant building contractors. The chairperson concluded by declaring that had the municipal inspectors exercised incorruptible vigilance from the inception of the works, state resources and precious human lives would have been safeguarded for future generations.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// =========================================================================
const unique50B9SyntaxConcordFoundationDrills = [
  {
    passage: "If the structural engineer ________ the foundation soil thoroughly, the heavy concrete wall would not have collapsed during the downpour.",
    question: "Choose the correct past perfect verb form for this Third Conditional sentence:",
    options: ["had tested", "tested", "would have tested", "has tested"],
    answer: "had tested",
    hint: "The Third Conditional protasis (if-clause) strictly requires the Past Perfect tense (had + past participle).",
    solution: "The Third Conditional expresses an unfulfilled past condition. The formula is: IF + Past Perfect (had tested), ... would have + Past Participle (would not have collapsed). Inserting 'would have' into the if-clause is an error.",
    target: "Third Conditional: Past Perfect Protasis"
  },
  {
    passage: "The headmistress insisted that every student ________ the ceremonial crest on their school uniform.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["wear", "wears", "wore", "is wearing"],
    answer: "wear",
    hint: "Nominal that-clauses governed by suasive verbs of demand ('insisted that') require the bare uninflected base verb.",
    solution: "The suasive verb 'insisted that' triggers the mandative subjunctive mood. The verb must appear in its uninflected base form ('wear'), completely suppressing the third-person singular suffix '-s'.",
    target: "Mandative Subjunctive: Suasive Verb Insist"
  },
  {
    passage: "________ the agricultural extension officer warned the farmers earlier, the tomato crop would have been saved from the viral blight.",
    question: "Choose the correct inverted conditional auxiliary verb:",
    options: ["Had", "Should", "Were", "If had"],
    answer: "Had",
    hint: "Subject-auxiliary inversion in past counterfactual conditionals replaces 'If the officer had warned' with 'Had the officer warned'.",
    solution: "In formal syntax, the Third Conditional can omit 'if' through subject-auxiliary inversion using 'Had': 'Had the agricultural extension officer warned...'.",
    target: "Inverted Conditionals: Had-Inversion"
  },
  {
    passage: "If the commercial bus driver had observed the mandatory speed limit, he ________ the fatal collision on the bypass.",
    question: "Choose the correct modal perfect construction to complete the Third Conditional apodosis:",
    options: ["would have averted", "would avert", "will have averted", "had averted"],
    answer: "would have averted",
    hint: "The result clause (apodosis) of a Third Conditional requires [would + have + Past Participle].",
    solution: "Paired with the past perfect protasis ('had observed'), the Third Conditional result clause requires the modal perfect: 'would have averted'.",
    target: "Third Conditional: Modal Perfect Apodosis"
  },
  {
    passage: "It is mandatory that the municipal revenue collector ________ all cash receipts to the treasury before noon.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["submit", "submits", "submitted", "is submitting"],
    answer: "submit",
    hint: "Clauses following formulaic adjectives of necessity ('It is mandatory that...') take the bare uninflected base verb.",
    solution: "The formulaic adjective of necessity 'mandatory that' commands the mandative subjunctive. The bare base form 'submit' is mandatory, rejecting third-person singular '-s'.",
    target: "Mandative Subjunctive: Adjective Mandatory"
  },
  {
    passage: "________ you encounter any technical malfunction during the practical examination, notify the computer lab supervisor immediately.",
    question: "Choose the correct auxiliary verb to form a First Conditional inversion:",
    options: ["Should", "Had", "Were", "Could"],
    answer: "Should",
    hint: "Predictive First Conditionals invert by placing 'Should' before the subject in place of 'If you encounter'.",
    solution: "A Type 1 predictive condition inverts using 'Should + Subject + Base Verb': 'Should you encounter...' replaces 'If you encounter...'.",
    target: "Inverted Conditionals: Should-Inversion"
  },
  {
    passage: "If the fire department had received the distress call immediately, the warehouse ________ to the ground.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have burnt", "would not burn", "will not have burnt", "had not burnt"],
    answer: "would not have burnt",
    hint: "Third Conditional apodosis takes [would have + Past Participle].",
    solution: "The counterfactual condition ('had received') requires the negative modal perfect 'would not have burnt' in the main clause.",
    target: "Third Conditional: Negative Modal Perfect Apodosis"
  },
  {
    passage: "The presiding judge ordered that the commercial bank ________ all frozen transaction ledgers to the forensic accountants.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["release", "releases", "released", "is releasing"],
    answer: "release",
    hint: "Suasive verb 'ordered that' requires the bare base form of the following verb.",
    solution: "The verb of command 'ordered that' triggers the mandative subjunctive, which mandates the uninflected base verb 'release'.",
    target: "Mandative Subjunctive: Suasive Verb Order"
  },
  {
    passage: "________ the government to increase cocoa producer prices, rural youth would return to commercial agriculture.",
    question: "Choose the correct auxiliary verb to form an inverted Second Conditional:",
    options: ["Were", "Had", "Should", "Would"],
    answer: "Were",
    hint: "Hypothetical Second Conditionals invert using 'Were + Subject + To-Infinitive' in place of 'If the government were to increase'.",
    solution: "The Second Conditional inverts using 'Were': 'Were the government to increase...' is the formal syntactic inversion of 'If the government were to increase...'.",
    target: "Inverted Conditionals: Were-Inversion"
  },
  {
    passage: "If the clinic had stocked adequate antivenom vials, the farmer ________ from the snakebite.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have died", "would not die", "will not have died", "had not died"],
    answer: "would not have died",
    hint: "Counterfactual past result requires [would not have + Past Participle].",
    solution: "The Third Conditional formula demands: IF + Past Perfect ('had stocked'), ... would have + Past Participle ('would not have died').",
    target: "Third Conditional: Apodosis Structure"
  },
  {
    passage: "The public health directorate recommended that the butcher's stall ________ fumigated before reopening.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "The subjunctive form of the copula 'to be' in mandative clauses is invariably the base form 'be'.",
    solution: "Following verbs of recommendation ('recommended that'), the passive subjunctive requires the invariant base copula 'be' ('be fumigated'). Using 'is' or 'was' is non-standard.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the maintenance team inspected the hydraulic brakes yesterday, the delivery lorry would not have crashed into the barrier.",
    question: "Choose the correct auxiliary verb to begin this inverted past counterfactual sentence:",
    options: ["Had", "Should", "Were", "Did"],
    answer: "Had",
    hint: "Inversion of 'If the maintenance team had inspected' starts with 'Had'.",
    solution: "Inverted Third Conditionals replace 'If + Subject + had + V3' with 'Had + Subject + V3': 'Had the maintenance team inspected...'.",
    target: "Inverted Conditionals: Had-Inversion"
  },
  {
    passage: "If Kwame had listened to his parents' counsel, he ________ his school fees on gambling.",
    question: "Choose the correct modal perfect completion:",
    options: ["would not have squandered", "would not squander", "will not have squandered", "had not squandered"],
    answer: "would not have squandered",
    hint: "Unfulfilled past condition requires [would not have + Past Participle].",
    solution: "The past counterfactual condition 'had listened' pairs with 'would not have squandered' in the apodosis.",
    target: "Third Conditional: Counterfactual Apodosis"
  },
  {
    passage: "It is crucial that the laboratory assistant ________ protective goggles before handling concentrated nitric acid.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["wear", "wears", "wore", "is wearing"],
    answer: "wear",
    hint: "Adjective of urgency ('It is crucial that...') governs the bare uninflected base verb.",
    solution: "The adjective 'crucial that' licenses the mandative subjunctive mood. The verb must appear as the bare base 'wear', rejecting the third-person '-s'.",
    target: "Mandative Subjunctive: Adjective Crucial"
  },
  {
    passage: "________ any candidate arrive late to the examination center, the chief invigilator will record an incident report.",
    question: "Choose the correct auxiliary verb for this inverted First Conditional:",
    options: ["Should", "Had", "Were", "If"],
    answer: "Should",
    hint: "First Conditional inversion substitutes 'Should' for 'If'.",
    solution: "'Should any candidate arrive late...' is the inverted syntactic equivalent of 'If any candidate arrives late...'.",
    target: "Inverted Conditionals: Should-Inversion"
  },
  {
    passage: "If the state prosecutor had produced the biometric evidence earlier, the jury ________ the suspect on the first day.",
    question: "Choose the correct modal perfect construction:",
    options: ["would have convicted", "would convict", "will have convicted", "had convicted"],
    answer: "would have convicted",
    hint: "Past Perfect in the if-clause requires 'would have + V3' in the main clause.",
    solution: "Third Conditional pairing: IF + Past Perfect ('had produced'), ... modal perfect ('would have convicted').",
    target: "Third Conditional: Modal Perfect Apodosis"
  },
  {
    passage: "The town planning authority decreed that the unauthorized commercial structure ________ demolished immediately.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "Suasive verb 'decreed that' requires the invariant base copula 'be'.",
    solution: "The verb of decree 'decreed that' governs the mandative subjunctive. The passive construction takes the base form 'be': 'be demolished'.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the senior technician to discover an electrical fault in the turbine, the backup generator would engage automatically.",
    question: "Choose the correct auxiliary verb to form this inverted hypothetical condition:",
    options: ["Were", "Had", "Should", "Would"],
    answer: "Were",
    hint: "Second Conditional hypothetical inversion follows the formula: Were + Subject + to-infinitive.",
    solution: "'Were the senior technician to discover...' is the standard inverted realization of 'If the senior technician were to discover...'.",
    target: "Inverted Conditionals: Were-Inversion"
  },
  {
    passage: "If the maritime navigation system had signaled the shoal reef, the container ship ________ aground.",
    question: "Choose the correct modal perfect verb construction:",
    options: ["would not have run", "would not run", "will not have run", "had not run"],
    answer: "would not have run",
    hint: "Unfulfilled past condition requires [would not have + Past Participle ('run')].",
    solution: "The past participle of 'run' is 'run' (run, ran, run). The Third Conditional apodosis requires 'would not have run'.",
    target: "Third Conditional: Irregular Past Participle Apodosis"
  },
  {
    passage: "The medical council demanded that the fraudulent practitioner ________ his operational license to the registry.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["surrender", "surrenders", "surrendered", "is surrendering"],
    answer: "surrender",
    hint: "Suasive verb 'demanded that' commands the bare uninflected base verb.",
    solution: "The suasive verb 'demanded that' triggers the mandative subjunctive. The bare base form 'surrender' is grammatically mandatory.",
    target: "Mandative Subjunctive: Suasive Verb Demand"
  },
  {
    passage: "________ the flight captain detected the hydraulic leak before takeoff, the emergency landing would not have occurred.",
    question: "Choose the correct auxiliary verb to start the inverted counterfactual clause:",
    options: ["Had", "Should", "Were", "Could"],
    answer: "Had",
    hint: "Past counterfactual condition omitting 'if' begins with 'Had'.",
    solution: "'Had the flight captain detected...' is the formal inverted equivalent of 'If the flight captain had detected...'.",
    target: "Inverted Conditionals: Had-Inversion"
  },
  {
    passage: "If the research scientists had received the international grant, they ________ their clinical trial on sickle-cell anemia.",
    question: "Choose the correct modal perfect construction:",
    options: ["would have expanded", "would expand", "will have expanded", "had expanded"],
    answer: "would have expanded",
    hint: "Third Conditional apodosis takes [would have + Past Participle].",
    solution: "Past perfect protasis ('had received') commands the modal perfect apodosis ('would have expanded').",
    target: "Third Conditional: Modal Perfect Apodosis"
  },
  {
    passage: "It is essential that every candidate ________ their national examination index card to the hall daily.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["bring", "brings", "brought", "is bringing"],
    answer: "bring",
    hint: "Adjective of necessity ('It is essential that...') requires the bare uninflected base verb.",
    solution: "The formulaic adjective 'essential that' licenses the mandative subjunctive, which requires the bare base form 'bring'.",
    target: "Mandative Subjunctive: Adjective Essential"
  },
  {
    passage: "________ you witness any examination malpractice in the pavilion, report the infraction to the invigilator immediately.",
    question: "Choose the correct auxiliary verb for this inverted First Conditional sentence:",
    options: ["Should", "Had", "Were", "Would"],
    answer: "Should",
    hint: "Type 1 predictive conditions invert using 'Should'.",
    solution: "'Should you witness...' is the formal inverted equivalent of 'If you witness...'.",
    target: "Inverted Conditionals: Should-Inversion"
  },
  {
    passage: "If the municipal sanitation board had cleared the drainage trenches, the flash flood ________ the market stalls.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have submerged", "would not submerge", "will not have submerged", "had not submerged"],
    answer: "would not have submerged",
    hint: "Negative past counterfactual result requires [would not have + Past Participle].",
    solution: "Third Conditional pairing: IF + Past Perfect ('had cleared'), ... negative modal perfect ('would not have submerged').",
    target: "Third Conditional: Negative Modal Perfect Apodosis"
  },
  {
    passage: "The committee chairman proposed that the regional sports festival ________ postponed until the dry season.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "Suasive verb 'proposed that' takes the invariant base copula 'be'.",
    solution: "The suasive verb 'proposed that' governs the mandative subjunctive. The passive form requires the base copula 'be': 'be postponed'.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the sovereign state to default on its multilateral debt obligations, foreign investment would contract sharply.",
    question: "Choose the correct auxiliary verb to form this inverted hypothetical condition:",
    options: ["Were", "Had", "Should", "Would"],
    answer: "Were",
    hint: "Second Conditional inversion follows the formula: Were + Subject + to-infinitive.",
    solution: "'Were the sovereign state to default...' is the formal inverted equivalent of 'If the sovereign state were to default...'.",
    target: "Inverted Conditionals: Were-Inversion"
  },
  {
    passage: "If the botanical research garden had conserved the rare orchid species, it ________ extinct in the wild.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have become", "would not become", "will not have become", "had not become"],
    answer: "would not have become",
    hint: "Past counterfactual result requires [would not have + Past Participle ('become')].",
    solution: "The past participle of 'become' is 'become' (become, became, become). The Third Conditional apodosis requires 'would not have become'.",
    target: "Third Conditional: Irregular Past Participle Apodosis"
  },
  {
    passage: "The school board stipulated that every newly appointed tutor ________ a probationary teaching evaluation.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["undergo", "undergoes", "underwent", "is undergoing"],
    answer: "undergo",
    hint: "Suasive verb 'stipulated that' requires the bare uninflected base verb.",
    solution: "The verb of requirement 'stipulated that' triggers the mandative subjunctive. The uninflected base verb 'undergo' is mandatory.",
    target: "Mandative Subjunctive: Suasive Verb Stipulate"
  },
  {
    passage: "________ the agricultural ministry distributed the subsidized fertilizer on schedule, the crop yield would have doubled.",
    question: "Choose the correct auxiliary verb to begin this inverted past counterfactual sentence:",
    options: ["Had", "Should", "Were", "Did"],
    answer: "Had",
    hint: "Past counterfactual condition omitting 'if' begins with 'Had'.",
    solution: "'Had the agricultural ministry distributed...' is the inverted syntactic equivalent of 'If the agricultural ministry had distributed...'.",
    target: "Inverted Conditionals: Had-Inversion"
  },
  {
    passage: "If the apprentice had tightened the vehicle's wheel lug nuts correctly, the tire ________ off on the highway.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have flown", "would not fly", "will not have flown", "had not flown"],
    answer: "would not have flown",
    hint: "Past counterfactual result takes [would not have + Past Participle ('flown')].",
    solution: "The past participle of 'fly' is 'flown' (fly, flew, flown). The Third Conditional apodosis requires 'would not have flown'.",
    target: "Third Conditional: Irregular Past Participle Apodosis"
  },
  {
    passage: "It is imperative that the pharmacy inspector ________ the cold-chain vaccine log every morning.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["verify", "verifies", "verified", "is verifying"],
    answer: "verify",
    hint: "Adjective of urgency ('It is imperative that...') requires the bare uninflected base verb.",
    solution: "The adjective 'imperative that' commands the mandative subjunctive, requiring the uninflected base verb 'verify'.",
    target: "Mandative Subjunctive: Adjective Imperative"
  },
  {
    passage: "________ any passenger require emergency medical assistance during the flight, press the cabin attendant call button.",
    question: "Choose the correct auxiliary verb for this inverted First Conditional:",
    options: ["Should", "Had", "Were", "Could"],
    answer: "Should",
    hint: "Type 1 predictive conditions invert using 'Should'.",
    solution: "'Should any passenger require...' is the formal inverted equivalent of 'If any passenger requires...'.",
    target: "Inverted Conditionals: Should-Inversion"
  },
  {
    passage: "If the mining conglomerate had complied with environmental reclamation bylaws, the river ________ toxic.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have turned", "would not turn", "will not have turned", "had not turned"],
    answer: "would not have turned",
    hint: "Counterfactual past result requires [would not have + Past Participle].",
    solution: "Third Conditional pairing: IF + Past Perfect ('had complied'), ... modal perfect ('would not have turned').",
    target: "Third Conditional: Modal Perfect Apodosis"
  },
  {
    passage: "The university senate resolved that the cheating student ________ expelled immediately.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "Suasive verb 'resolved that' takes the invariant base copula 'be'.",
    solution: "The verb of resolution 'resolved that' commands the mandative subjunctive, requiring the bare copula 'be': 'be expelled'.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the regional minister to resign his cabinet portfolio, the president would appoint an interim administrator.",
    question: "Choose the correct auxiliary verb to form this inverted hypothetical condition:",
    options: ["Were", "Had", "Should", "Would"],
    answer: "Were",
    hint: "Second Conditional inversion follows the formula: Were + Subject + to-infinitive.",
    solution: "'Were the regional minister to resign...' is the formal inverted equivalent of 'If the regional minister were to resign...'.",
    target: "Inverted Conditionals: Were-Inversion"
  },
  {
    passage: "If the coast guard patrol had intercepted the smugglers' vessel in territorial waters, the contraband ________ the market.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have reached", "would not reach", "will not have reached", "had not reached"],
    answer: "would not have reached",
    hint: "Unfulfilled past condition requires [would not have + Past Participle].",
    solution: "The past counterfactual condition 'had intercepted' pairs with 'would not have reached' in the apodosis.",
    target: "Third Conditional: Counterfactual Apodosis"
  },
  {
    passage: "The director of public prosecutions requested that the court bailiff ________ the witness summons in person.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["serve", "serves", "served", "is serving"],
    answer: "serve",
    hint: "Suasive verb 'requested that' commands the bare uninflected base verb.",
    solution: "The suasive verb 'requested that' triggers the mandative subjunctive. The bare base verb 'serve' is mandatory.",
    target: "Mandative Subjunctive: Suasive Verb Request"
  },
  {
    passage: "________ the hospital administration installed an auxiliary solar inverter, the incubators would have remained powered.",
    question: "Choose the correct auxiliary verb to begin this inverted past counterfactual sentence:",
    options: ["Had", "Should", "Were", "Did"],
    answer: "Had",
    hint: "Past counterfactual condition omitting 'if' begins with 'Had'.",
    solution: "'Had the hospital administration installed...' is the inverted syntactic equivalent of 'If the hospital administration had installed...'.",
    target: "Inverted Conditionals: Had-Inversion"
  },
  {
    passage: "If the masonry contractor had utilized high-tensile steel rods, the multi-storey structure ________ during the tremor.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have collapsed", "would not collapse", "will not have collapsed", "had not collapsed"],
    answer: "would not have collapsed",
    hint: "Third Conditional apodosis takes [would not have + Past Participle].",
    solution: "Past perfect protasis ('had utilized') commands the negative modal perfect apodosis ('would not have collapsed').",
    target: "Third Conditional: Modal Perfect Apodosis"
  },
  {
    passage: "It is vital that the school dispensary nurse ________ sterile disposable gloves before dressing the wound.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["wear", "wears", "wore", "is wearing"],
    answer: "wear",
    hint: "Adjective of necessity ('It is vital that...') requires the bare uninflected base verb.",
    solution: "The formulaic adjective 'vital that' licenses the mandative subjunctive, requiring the uninflected base verb 'wear'.",
    target: "Mandative Subjunctive: Adjective Vital"
  },
  {
    passage: "________ any citizen discover an unexploded ordnance on the farmland, keep clear and contact the police immediately.",
    question: "Choose the correct auxiliary verb for this inverted First Conditional:",
    options: ["Should", "Had", "Were", "Could"],
    answer: "Should",
    hint: "Type 1 predictive conditions invert using 'Should'.",
    solution: "'Should any citizen discover...' is the formal inverted equivalent of 'If any citizen discovers...'.",
    target: "Inverted Conditionals: Should-Inversion"
  },
  {
    passage: "If the petroleum pipeline technicians had detected the corrosion early, the oil spill ________ the mangrove estuary.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have devastated", "would not devastate", "will not have devastated", "had not devastated"],
    answer: "would not have devastated",
    hint: "Counterfactual past result requires [would not have + Past Participle].",
    solution: "Third Conditional pairing: IF + Past Perfect ('had detected'), ... modal perfect ('would not have devastated').",
    target: "Third Conditional: Negative Modal Perfect Apodosis"
  },
  {
    passage: "The electoral commission decreed that every political party ________ its audited financial statements before the election.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["publish", "publishes", "published", "is publishing"],
    answer: "publish",
    hint: "Suasive verb 'decreed that' takes the bare uninflected base verb.",
    solution: "The verb of decree 'decreed that' commands the mandative subjunctive, requiring the bare base form 'publish'.",
    target: "Mandative Subjunctive: Suasive Verb Decree"
  },
  {
    passage: "________ the judicial bench to overturn the disputed verdict, legal commentators would analyze the constitutional precedent for decades.",
    question: "Choose the correct auxiliary verb to form this inverted hypothetical condition:",
    options: ["Were", "Had", "Should", "Would"],
    answer: "Were",
    hint: "Second Conditional inversion follows the formula: Were + Subject + to-infinitive.",
    solution: "'Were the judicial bench to overturn...' is the formal inverted equivalent of 'If the judicial bench were to overturn...'.",
    target: "Inverted Conditionals: Were-Inversion"
  },
  {
    passage: "If the rural electrification agency had installed lightning arresters on the transformer, the power grid ________ intact.",
    question: "Choose the correct modal perfect construction:",
    options: ["would have remained", "would remain", "will have remained", "had remained"],
    answer: "would have remained",
    hint: "Third Conditional apodosis takes [would have + Past Participle].",
    solution: "Past perfect protasis ('had installed') pairs with the modal perfect apodosis ('would have remained').",
    target: "Third Conditional: Modal Perfect Apodosis"
  },
  {
    passage: "The high court judge ordered that the fraudulent land title registration ________ cancelled immediately.",
    question: "Choose the correct passive mandative subjunctive verb form:",
    options: ["be", "is", "was", "must be"],
    answer: "be",
    hint: "Suasive verb 'ordered that' commands the invariant base copula 'be'.",
    solution: "The suasive verb 'ordered that' triggers the mandative subjunctive, requiring the bare copula 'be': 'be cancelled'.",
    target: "Mandative Subjunctive: Passive Copula Be"
  },
  {
    passage: "________ the naval surveillance aircraft spotted the drifting lifeboat, the marooned fishermen would have perished in the gale.",
    question: "Choose the correct negative auxiliary verb to begin this inverted past counterfactual sentence:",
    options: ["Had not", "Should not", "Were not", "If not"],
    answer: "Had not",
    hint: "Inverted negative past counterfactual condition begins with 'Had not + Subject + Past Participle'.",
    solution: "'Had not the naval surveillance aircraft spotted...' is the formal inverted equivalent of 'If the naval surveillance aircraft had not spotted...'.",
    target: "Inverted Conditionals: Negative Had-Inversion"
  },
  {
    passage: "If the commercial airline pilot had aborted the landing in the windshear, the passenger aircraft ________ off the runway.",
    question: "Choose the correct modal perfect construction:",
    options: ["would not have skidded", "would not skid", "will not have skidded", "had not skidded"],
    answer: "would not have skidded",
    hint: "Counterfactual past result requires [would not have + Past Participle].",
    solution: "Third Conditional pairing: IF + Past Perfect ('had aborted'), ... modal perfect ('would not have skidded').",
    target: "Third Conditional: Negative Modal Perfect Apodosis"
  },
  {
    passage: "It is necessary that each student ________ their assigned geometry instruments to the practical mathematics paper.",
    question: "Choose the correct mandative subjunctive verb form:",
    options: ["bring", "brings", "brought", "is bringing"],
    answer: "bring",
    hint: "Adjective of necessity ('It is necessary that...') requires the bare uninflected base verb.",
    solution: "The formulaic adjective 'necessary that' licenses the mandative subjunctive mood. The bare base verb 'bring' is mandatory, rejecting the third-person '-s'.",
    target: "Mandative Subjunctive: Adjective Necessary"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// =========================================================================
const capstone5B9SyntaxConcordFoundationQuestions = [
  {
    questionNumber: 51,
    question: "In paragraph 1, why is the clause 'if the structural contractors had complied with the approved engineering blueprints, the load-bearing columns would not have buckled' grammatically correct under Third Conditional rules?",
    options: [
      "Because it expresses an unfulfilled past counterfactual condition using the Past Perfect ('had complied') in the if-clause and the modal perfect ('would not have buckled') in the main clause",
      "Because 'engineering blueprints' is an irregular plural noun that requires the Past Continuous tense",
      "Because conditional sentences in formal judicial reports always use 'would have' in both clauses",
      "Because the sentence is in the passive voice"
    ],
    answer: "Because it expresses an unfulfilled past counterfactual condition using the Past Perfect ('had complied') in the if-clause and the modal perfect ('would not have buckled') in the main clause",
    hint: "Examine the past perfect protasis and the modal perfect apodosis.",
    solution: "Third Conditionals express retrospective counterfactual events using the formula: IF + Past Perfect (had complied), ... would have + Past Participle (would not have buckled).",
    target: "Capstone Exam: Third Conditional Counterfactual Analysis"
  },
  {
    questionNumber: 52,
    question: "In paragraph 1, what advanced syntactic transformation is demonstrated by the construction 'had the resident supervisor conducted routine core-strength stress tests, the structural flaw would have been identified prior to commissioning'?",
    options: [
      "An inverted Third Conditional counterfactual where 'if' is omitted through subject-auxiliary inversion using 'Had'",
      "A First Conditional inversion using the predictive modal 'Should'",
      "A mandative subjunctive clause triggered by an adjective of necessity",
      "A coordinate relative clause modifying the resident supervisor"
    ],
    answer: "An inverted Third Conditional counterfactual where 'if' is omitted through subject-auxiliary inversion using 'Had'",
    hint: "Notice that 'if' is absent and 'Had' is fronted before the subject.",
    solution: "The clause illustrates a textbook Inverted Third Conditional: the subordinating conjunction 'if' is omitted, triggering subject-auxiliary inversion: [Had + Subject + Past Participle (conducted)].",
    target: "Capstone Exam: Inverted Third Conditional Had-Inversion"
  },
  {
    questionNumber: 53,
    question: "In paragraph 2, why does the clause 'municipal building regulations demand that every registered contractor adhere strictly to seismic load standards' use 'adhere' instead of 'adheres'?",
    options: [
      "Because the suasive verb 'demand that' triggers the mandative subjunctive mood, which requires the bare uninflected base verb and suppresses third-person singular '-s'",
      "Because 'every registered contractor' is treated as a plural noun phrase in Ghanaian English",
      "Because 'regulations' is plural and commands plural concord in the following clause",
      "Because 'strictly' is an adverb of manner that cannot touch inflected verbs"
    ],
    answer: "Because the suasive verb 'demand that' triggers the mandative subjunctive mood, which requires the bare uninflected base verb and suppresses third-person singular '-s'",
    hint: "Recall the mandative subjunctive rule following suasive verbs of demand.",
    solution: "Suasive verbs such as 'demand that' license the mandative subjunctive in the dependent that-clause. The verb must appear in its bare base form ('adhere'), completely rejecting third-person singular '-s'.",
    target: "Capstone Exam: Mandative Subjunctive Suasive Verb"
  },
  {
    questionNumber: 54,
    question: "In paragraph 3, which option correctly explains the grammatical structure of the inverted conditional clause 'were the municipal assembly to enforce its statutory stop-work notices promptly'?",
    options: [
      "It is an inverted Second Conditional hypothetical sentence where 'if' is omitted, triggering inversion using 'Were + Subject + to-infinitive'",
      "It is an inverted Third Conditional expressing an unfulfilled past action",
      "It is a mandative subjunctive clause expressing a judicial decree",
      "It is an indirect question governed by the presiding officer"
    ],
    answer: "It is an inverted Second Conditional hypothetical sentence where 'if' is omitted, triggering inversion using 'Were + Subject + to-infinitive'",
    hint: "Check the formula: Were + Subject + to-infinitive.",
    solution: "'Were the municipal assembly to enforce...' represents an inverted Second Conditional expressing an unreal or hypothetical present condition, replacing 'If the municipal assembly were to enforce...'.",
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

  console.log("Building 55 UNIQUE questions for Basic 9 (JHS 3) Strand 3 Sub-Strand 2 Foundation Lab...");
  const all55Questions = [];

  // 1. Build Questions 1 to 50
  unique50B9SyntaxConcordFoundationDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B9_S2_F_${qNum < 10 ? "0" + qNum : qNum}`,
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
      learningCompetency: "B9.3.1.2 / B9.3.2.1 / B9.3.3.1: Demonstrate grammatical mastery of Third Conditionals, inverted conditionals (Had, Should, Were), and the mandative subjunctive."
    });
  });

  // 2. Build Questions 51 to 55
  capstone5B9SyntaxConcordFoundationQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${b9SyntaxConcordFoundationCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B9_S2_F_${item.questionNumber}`,
      level: "B9",
      difficulty: "foundation",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: b9SyntaxConcordFoundationCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B9.3.1.2 / B9.3.2.1 / B9.3.3.1: Synthesize multi-paragraph contextual grammar, evaluating Third Conditionals, subjunctive inversions, mandative syntax, and concise rule summaries."
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
    level: "B9",
    difficulty: "foundation",
    title: "Basic 9 Foundation Lab: 50 Unique Syntax, Conditional & Subjunctive Drills + 5 Capstone Exam Questions",
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
    console.log(`🎯 Populating B9 Foundation for: ${topicId}`);
    console.log(`======================================================`);

    // 1. Write subcollection doc
    const subDocPath = `global_curriculum/jhs/subjects/english/topical/${topicId}/practice_labs/B9_foundation`;
    await db.doc(subDocPath).set(subDocPayload, { merge: true });
    console.log(`   ✅ Wrote subcollection doc: ${subDocPath}`);

    // 2. Update main doc's levels.b9.practicePool.low across all parent collections
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
          low: practicePoolQuestions
        };

        const totalQs = (curLevels.b7?.practicePool?.low?.length || 0) +
                        (curLevels.b7?.practicePool?.medium?.length || 0) +
                        (curLevels.b7?.practicePool?.hard?.length || 0) +
                        (curLevels.b8?.practicePool?.low?.length || 0) +
                        (curLevels.b8?.practicePool?.medium?.length || 0) +
                        (curLevels.b8?.practicePool?.hard?.length || 0) +
                        (updatedPool.low?.length || 0) +
                        (curPool.medium?.length || 0) +
                        (curPool.hard?.length || 0);

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

        console.log(`   ✅ Updated main doc pool at: ${mainDocPath} (B9 Low: ${practicePoolQuestions.length} Qs, Total: ${totalQs})`);
      }
    }
  }

  console.log("\n🎉 Basic 9 (JHS 3) Foundation Lab successfully deployed!");
}

deploy()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("❌ Fatal Error Deploying B9 Foundation Lab:", err);
    process.exit(1);
  });
