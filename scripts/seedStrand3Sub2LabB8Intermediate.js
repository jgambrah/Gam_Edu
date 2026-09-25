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
// Strand 3 Sub-Strand 2 B8 Intermediate Focus:
// Complex Passive Voice with Agent Omission, Embedded Reported Speech,
// First Conditional Protasis Nuance, Second Conditional Irrealis Subjunctive,
// and Universal Scientific Fact Backshift Exemptions
// =========================================================================
const b8SyntaxConcordIntermediateCapstonePassage = 
`During the municipal agricultural exhibition held at the regional trade fair centre in Kumasi, the chief extension officer conducted an advanced seminar on biotechnology and soil conservation for junior secondary scholars. Standing beside an automated soil-testing console, the officer demonstrated that when solar radiation strikes green foliage, radiant energy is absorbed by chlorophyll pigments to drive photosynthesis. He reminded the audience that this photochemical truth is confirmed by plant physiologists worldwide.

While examining the aerated compost demonstration plots, the municipal director of agriculture observed that organic foliar fertilizers were being sprayed across the trial beds by the extension apprentices. The chief agronomist inspected the distribution log and remarked that several metric tons of certified organic manure had been procured by the regional cooperative the previous month. He then addressed the student delegates and explained that if the municipal assembly allocates adequate irrigation machinery next season, the agronomy department will cultivate three cycles of hybrid sweet corn annually.

Later in the afternoon, an environmental toxicologist from the national research institute presented a paper on pesticide contamination in river ecosystems. During her lecture, she warned the assembly that if industrial agrochemicals contaminated the aquifer, subterranean drinking water would become hazardous for human consumption. In a direct interview with the student press corps, the scientist remarked, "I am inspecting your experimental plots today to evaluate biological pest controls." The editor for the school science bulletin reported that the researcher stated that she was inspecting their experimental plots that day to evaluate biological pest controls.

Before adjourning the plenary session, the seminar moderator instructed the participants to adhere strictly to all bio-security guidelines before handling chemical reagents in school laboratories. She stated that all toxic substances must be locked in ventilated reinforced steel cupboards by the designated student technicians. In his concluding assessment, the regional minister declared that whenever academic institutions promote methodical scientific experimentation, sustainable food security is achieved for the entire sovereign republic.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// =========================================================================
const unique50B8SyntaxConcordIntermediateDrills = [
  {
    passage: "The senior biochemist is calibrating the electronic centrifuge in the pathology laboratory right now.",
    question: "Choose the correct passive voice transformation of the sentence:",
    options: [
      "The electronic centrifuge is being calibrated by the senior biochemist in the pathology laboratory right now.",
      "The electronic centrifuge was being calibrated by the senior biochemist in the pathology laboratory right now.",
      "The electronic centrifuge is calibrated by the senior biochemist in the pathology laboratory right now.",
      "The electronic centrifuge has been calibrated by the senior biochemist in the pathology laboratory right now."
    ],
    answer: "The electronic centrifuge is being calibrated by the senior biochemist in the pathology laboratory right now.",
    hint: "Present Continuous active ('is calibrating') transforms into [is/are + being + Past Participle].",
    solution: "The active verb 'is calibrating' is in the present continuous aspect. The passive formula is [Subject + is/are + being + Past Participle]: 'is being calibrated'.",
    target: "Passive Voice: Present Continuous Aspect"
  },
  {
    passage: "The environmental health officer said, \"I inspected these commercial kitchens yesterday.\"",
    question: "Choose the grammatically correct reported speech sentence:",
    options: [
      "The environmental health officer said that he had inspected those commercial kitchens the day before.",
      "The environmental health officer said that he inspected these commercial kitchens yesterday.",
      "The environmental health officer said that he had inspected these commercial kitchens the day before.",
      "The environmental health officer said that he was inspecting those commercial kitchens yesterday."
    ],
    answer: "The environmental health officer said that he had inspected those commercial kitchens the day before.",
    hint: "Simple Past ('inspected') backshifts to Past Perfect ('had inspected'); 'these' becomes 'those'; 'yesterday' becomes 'the day before'.",
    solution: "In reported speech with a past-tense reporting verb, Simple Past shifts to Past Perfect ('had inspected'), proximate 'these' becomes distal 'those', and 'yesterday' shifts to 'the day before' (or 'the previous day').",
    target: "Reported Speech: Simple Past & Demonstrative Shift"
  },
  {
    passage: "If the regional electricity company ________ the faulty transformer today, power will be restored to the hospital.",
    question: "Choose the correct verb form to complete the First Conditional protasis:",
    options: ["replaces", "will replace", "replaced", "would replace"],
    answer: "replaces",
    hint: "The conditional clause (if-clause) in a First Conditional sentence takes the Simple Present tense.",
    solution: "Under the First Conditional Protasis Law, conditional clauses reject modal auxiliaries like 'will'. The Simple Present ('replaces') is syntactically mandatory when paired with 'will be restored'.",
    target: "First Conditional: Protasis Present Tense Law"
  },
  {
    passage: "If pure water ________ to zero degrees Celsius under standard atmospheric pressure, it solidifies into ice.",
    question: "Choose the correct verb form for this Zero Conditional physical fact:",
    options: ["cools", "will cool", "cooled", "would cool"],
    answer: "cools",
    hint: "Zero Conditional sentences express invariable scientific laws using the Simple Present in both clauses.",
    solution: "Zero Conditionals describe universal physical facts using the formula: IF + Simple Present, ... Simple Present. Therefore, 'cools' is correct.",
    target: "Zero Conditional: Physical Law"
  },
  {
    passage: "The municipal engineering team had constructed the concrete drainage culvert before the rainy season began.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The concrete drainage culvert had been constructed by the municipal engineering team before the rainy season began.",
      "The concrete drainage culvert was constructed by the municipal engineering team before the rainy season began.",
      "The concrete drainage culvert has been constructed by the municipal engineering team before the rainy season began.",
      "The concrete drainage culvert was being constructed by the municipal engineering team before the rainy season began."
    ],
    answer: "The concrete drainage culvert had been constructed by the municipal engineering team before the rainy season began.",
    hint: "Past Perfect active ('had constructed') converts to 'had been constructed'.",
    solution: "The active verb 'had constructed' is in the past perfect tense. The passive transformation requires [had been + Past Participle]: 'had been constructed'.",
    target: "Passive Voice: Past Perfect Aspect"
  },
  {
    passage: "The astrophysics lecturer stated, \"The planet Mercury orbits closest to the sun.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The astrophysics lecturer stated that the planet Mercury orbits closest to the sun.",
      "The astrophysics lecturer stated that the planet Mercury orbited closest to the sun.",
      "The astrophysics lecturer stated that the planet Mercury had orbited closest to the sun.",
      "The astrophysics lecturer stated that the planet Mercury was orbiting closest to the sun."
    ],
    answer: "The astrophysics lecturer stated that the planet Mercury orbits closest to the sun.",
    hint: "Permanent astronomical realities are exempt from past-tense backshifting.",
    solution: "Under the Universal Truth Backshift Exemption, statements expressing permanent celestial and scientific realities retain the simple present tense ('orbits').",
    target: "Reported Speech: Astronomical Truth Exemption"
  },
  {
    passage: "If I ________ the regional director of education, I would ensure that every rural school had a computer laboratory.",
    question: "Choose the correct subjunctive verb form for this Second Conditional sentence:",
    options: ["were", "was", "am", "would be"],
    answer: "were",
    hint: "Hypothetical contrary-to-fact statements require the invariant past subjunctive 'were' for all persons.",
    solution: "Second Conditional sentences expressing hypothetical present states mandate the invariant past subjunctive 'were' ('If I were...'), paired with 'would + base verb'.",
    target: "Second Conditional: Irrealis Subjunctive Were"
  },
  {
    passage: "The public works department must complete the bypass bridge before the annual trade fair.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The bypass bridge must be completed by the public works department before the annual trade fair.",
      "The bypass bridge must have been completed by the public works department before the annual trade fair.",
      "The bypass bridge was completed by the public works department before the annual trade fair.",
      "The bypass bridge is completed by the public works department before the annual trade fair."
    ],
    answer: "The bypass bridge must be completed by the public works department before the annual trade fair.",
    hint: "Modal auxiliaries ('must complete') transform into [modal + be + Past Participle].",
    solution: "The modal verb structure 'must complete' converts into [modal + be + Past Participle]: 'must be completed'.",
    target: "Passive Voice: Modal Auxiliary Transposition"
  },
  {
    passage: "The chief accountant said, \"We have audited all commercial bank disbursements for this fiscal quarter.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The chief accountant said that they had audited all commercial bank disbursements for that fiscal quarter.",
      "The chief accountant said that we have audited all commercial bank disbursements for this fiscal quarter.",
      "The chief accountant said that they have audited all commercial bank disbursements for that fiscal quarter.",
      "The chief accountant said that they audited all commercial bank disbursements for this fiscal quarter."
    ],
    answer: "The chief accountant said that they had audited all commercial bank disbursements for that fiscal quarter.",
    hint: "Present Perfect ('have audited') backshifts to Past Perfect ('had audited'); 'this' becomes 'that'.",
    solution: "Present Perfect shifts to Past Perfect ('had audited'), the first-person plural 'we' shifts to 'they', and the demonstrative 'this' shifts to 'that'.",
    target: "Reported Speech: Present Perfect & Demonstrative Deixis"
  },
  {
    passage: "If the agricultural cooperative ________ the mechanized tractors early, the farmers will cultivate double acreages.",
    question: "Choose the correct verb form for the First Conditional clause:",
    options: ["deploys", "will deploy", "deployed", "would deploy"],
    answer: "deploys",
    hint: "The if-clause of a First Conditional sentence takes the Simple Present tense.",
    solution: "First Conditional sentences require the Simple Present ('deploys') in the protasis, paired with 'will cultivate' in the apodosis.",
    target: "First Conditional: Protasis Present Tense"
  },
  {
    passage: "The forensic laboratory technicians were examining the forged currency notes under ultraviolet light.",
    question: "Choose the correct passive voice transformation of the sentence:",
    options: [
      "The forged currency notes were being examined by the forensic laboratory technicians under ultraviolet light.",
      "The forged currency notes were examined by the forensic laboratory technicians under ultraviolet light.",
      "The forged currency notes had been examined by the forensic laboratory technicians under ultraviolet light.",
      "The forged currency notes are being examined by the forensic laboratory technicians under ultraviolet light."
    ],
    answer: "The forged currency notes were being examined by the forensic laboratory technicians under ultraviolet light.",
    hint: "Past Continuous active ('were examining') transforms into [was/were + being + Past Participle].",
    solution: "The past continuous active verb 'were examining' converts into [were + being + Past Participle]: 'were being examined'.",
    target: "Passive Voice: Past Continuous Aspect"
  },
  {
    passage: "The marine biologist explained, \"Sharks maintain buoyancy primarily through their oil-rich livers rather than swim bladders.\"",
    question: "Choose the correct reported speech sentence:",
    options: [
      "The marine biologist explained that sharks maintain buoyancy primarily through their oil-rich livers rather than swim bladders.",
      "The marine biologist explained that sharks maintained buoyancy primarily through their oil-rich livers rather than swim bladders.",
      "The marine biologist explained that sharks had maintained buoyancy primarily through their oil-rich livers rather than swim bladders.",
      "The marine biologist explained that sharks were maintaining buoyancy primarily through their oil-rich livers rather than swim bladders."
    ],
    answer: "The marine biologist explained that sharks maintain buoyancy primarily through their oil-rich livers rather than swim bladders.",
    hint: "Invariable biological facts do not undergo past-tense backshifting.",
    solution: "Because shark anatomical function is an ongoing biological reality, the verb 'maintain' remains in the simple present tense without backshifting.",
    target: "Reported Speech: Biological Fact Exemption"
  },
  {
    passage: "If the town council ________ an emergency water treatment plant, the community would avoid seasonal cholera outbreaks.",
    question: "Choose the correct verb form for this Second Conditional sentence:",
    options: ["constructed", "constructs", "will construct", "would construct"],
    answer: "constructed",
    hint: "Pair the hypothetical consequence ('would avoid') with a Simple Past verb in the if-clause.",
    solution: "In Second Conditional sentences, hypothetical conditions are expressed using the Simple Past ('constructed'), matching 'would avoid' in the main clause.",
    target: "Second Conditional: Hypothetical Protasis"
  },
  {
    passage: "The electoral commission has published the certified parliamentary voter register.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The certified parliamentary voter register has been published by the electoral commission.",
      "The certified parliamentary voter register was published by the electoral commission.",
      "The certified parliamentary voter register had been published by the electoral commission.",
      "The certified parliamentary voter register is published by the electoral commission."
    ],
    answer: "The certified parliamentary voter register has been published by the electoral commission.",
    hint: "Present Perfect active ('has published') converts to 'has been published' for a singular patient.",
    solution: "The active present perfect verb 'has published' transforms into [has been + Past Participle]: 'has been published'.",
    target: "Passive Voice: Present Perfect Aspect"
  },
  {
    passage: "The police commander announced, \"My officers will mount intensive highway patrols tonight.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The police commander announced that his officers would mount intensive highway patrols that night.",
      "The police commander announced that my officers will mount intensive highway patrols tonight.",
      "The police commander announced that his officers will mount intensive highway patrols that night.",
      "The police commander announced that his officers would mount intensive highway patrols tonight."
    ],
    answer: "The police commander announced that his officers would mount intensive highway patrols that night.",
    hint: "'Will' shifts to 'would', 'my' shifts to 'his', and 'tonight' shifts to 'that night'.",
    solution: "Modal 'will' shifts to 'would', possessive 'my' becomes 'his', and proximate temporal deixis 'tonight' shifts to distal 'that night'.",
    target: "Reported Speech: Modal Backshift & Temporal Deixis"
  },
  {
    passage: "If you ________ an acid with a base in equal concentrations, a neutralization reaction occurs.",
    question: "Choose the correct verb form for this Zero Conditional chemical fact:",
    options: ["combine", "will combine", "combined", "would combine"],
    answer: "combine",
    hint: "Zero Conditionals describe universal scientific truths using Simple Present in both clauses.",
    solution: "Universal chemical reactions take the Simple Present in both clauses: 'If you combine... a neutralization reaction occurs'.",
    target: "Zero Conditional: Chemical Fact"
  },
  {
    passage: "The senior registrar was compiling the annual matriculation records when the network crashed.",
    question: "Choose the correct passive voice transformation of the first clause:",
    options: [
      "The annual matriculation records were being compiled by the senior registrar when the network crashed.",
      "The annual matriculation records was being compiled by the senior registrar when the network crashed.",
      "The annual matriculation records were compiled by the senior registrar when the network crashed.",
      "The annual matriculation records had been compiled by the senior registrar when the network crashed."
    ],
    answer: "The annual matriculation records were being compiled by the senior registrar when the network crashed.",
    hint: "'Records' is plural; Past Continuous passive requires 'were being compiled'.",
    solution: "The active verb 'was compiling' has a plural object ('records'). The passive form requires [were + being + Past Participle]: 'were being compiled'.",
    target: "Passive Voice: Past Continuous Plural Transposition"
  },
  {
    passage: "The physics tutor stated, \"The acceleration due to gravity on earth is approximately 9.8 meters per second squared.\"",
    question: "Choose the grammatically correct reported speech sentence:",
    options: [
      "The physics tutor stated that the acceleration due to gravity on earth is approximately 9.8 meters per second squared.",
      "The physics tutor stated that the acceleration due to gravity on earth was approximately 9.8 meters per second squared.",
      "The physics tutor stated that the acceleration due to gravity on earth had been approximately 9.8 meters per second squared.",
      "The physics tutor stated that the acceleration due to gravity on earth would be approximately 9.8 meters per second squared."
    ],
    answer: "The physics tutor stated that the acceleration due to gravity on earth is approximately 9.8 meters per second squared.",
    hint: "Universal physical constants do not backshift in reported speech.",
    solution: "Gravitational acceleration is an invariant physical constant; the verb 'is' remains in the simple present tense without backshifting.",
    target: "Reported Speech: Physical Constant Exemption"
  },
  {
    passage: "If the headmaster ________ the school library with modern reference encyclopedias, the students would perform better in debates.",
    question: "Choose the correct verb form for this Second Conditional sentence:",
    options: ["equipped", "equips", "will equip", "would equip"],
    answer: "equipped",
    hint: "Pair the hypothetical apodosis ('would perform') with a Simple Past verb in the if-clause.",
    solution: "The Second Conditional protasis requires the Simple Past ('equipped') to denote an unreal present scenario.",
    target: "Second Conditional: Hypothetical Protasis"
  },
  {
    passage: "The port customs authority confiscated twenty shipping containers of counterfeit pharmaceuticals yesterday.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "Twenty shipping containers of counterfeit pharmaceuticals were confiscated by the port customs authority yesterday.",
      "Twenty shipping containers of counterfeit pharmaceuticals was confiscated by the port customs authority yesterday.",
      "Twenty shipping containers of counterfeit pharmaceuticals are confiscated by the port customs authority yesterday.",
      "Twenty shipping containers of counterfeit pharmaceuticals had been confiscated by the port customs authority yesterday."
    ],
    answer: "Twenty shipping containers of counterfeit pharmaceuticals were confiscated by the port customs authority yesterday.",
    hint: "'Containers' is plural; Simple Past passive requires 'were confiscated'.",
    solution: "The active verb 'confiscated' is Simple Past. The promoted plural subject ('containers') takes 'were confiscated'.",
    target: "Passive Voice: Simple Past Plural Transposition"
  },
  {
    passage: "The meteorologist reported, \"Heavy monsoon downpours caused the localized flooding in the northern valley yesterday.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The meteorologist reported that heavy monsoon downpours had caused the localized flooding in the northern valley the day before.",
      "The meteorologist reported that heavy monsoon downpours caused the localized flooding in the northern valley yesterday.",
      "The meteorologist reported that heavy monsoon downpours had caused the localized flooding in the northern valley yesterday.",
      "The meteorologist reported that heavy monsoon downpours were causing the localized flooding in the northern valley the day before."
    ],
    answer: "The meteorologist reported that heavy monsoon downpours had caused the localized flooding in the northern valley the day before.",
    hint: "Simple Past ('caused') backshifts to Past Perfect ('had caused'), and 'yesterday' shifts to 'the day before'.",
    solution: "Simple Past backshifts to Past Perfect ('had caused'), and 'yesterday' shifts to 'the day before' (or 'the previous day').",
    target: "Reported Speech: Simple Past Backshift & Deixis"
  },
  {
    passage: "If you ________ an electrical circuit by disconnecting the copper switch, current ceases to flow.",
    question: "Choose the correct verb form for this Zero Conditional statement:",
    options: ["break", "will break", "broke", "would break"],
    answer: "break",
    hint: "Zero Conditional physical fact: Simple Present in both clauses.",
    solution: "Zero Conditionals describe universal electrical laws using Simple Present in both clauses: 'If you break... current ceases'.",
    target: "Zero Conditional: Electrical Circuit Law"
  },
  {
    passage: "The judicial council will inaugurate the new regional high court complex next Monday.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The new regional high court complex will be inaugurated by the judicial council next Monday.",
      "The new regional high court complex would be inaugurated by the judicial council next Monday.",
      "The new regional high court complex is inaugurated by the judicial council next Monday.",
      "The new regional high court complex will have been inaugurated by the judicial council next Monday."
    ],
    answer: "The new regional high court complex will be inaugurated by the judicial council next Monday.",
    hint: "Simple Future active ('will inaugurate') converts into 'will be + Past Participle'.",
    solution: "The active future verb 'will inaugurate' converts into [will be + Past Participle]: 'will be inaugurated'.",
    target: "Passive Voice: Simple Future Transposition"
  },
  {
    passage: "The geology teacher said, \"Diamonds are the hardest naturally occurring mineral on earth.\"",
    question: "Choose the correct reported speech version:",
    options: [
      "The geology teacher said that diamonds are the hardest naturally occurring mineral on earth.",
      "The geology teacher said that diamonds were the hardest naturally occurring mineral on earth.",
      "The geology teacher said that diamonds had been the hardest naturally occurring mineral on earth.",
      "The geology teacher said that diamonds would be the hardest naturally occurring mineral on earth."
    ],
    answer: "The geology teacher said that diamonds are the hardest naturally occurring mineral on earth.",
    hint: "Mineralogical and geological facts are exempt from backshifting in reported speech.",
    solution: "The physical hardness of diamonds is an invariant geological fact; the present tense 'are' is retained without backshifting.",
    target: "Reported Speech: Geological Fact Exemption"
  },
  {
    passage: "If the village community ________ access to clean borehole water, waterborne parasitic diseases would decrease sharply.",
    question: "Choose the correct verb form for this Second Conditional sentence:",
    options: ["had", "has", "will have", "would have"],
    answer: "had",
    hint: "Pair the hypothetical apodosis ('would decrease') with Simple Past in the if-clause.",
    solution: "The Second Conditional requires the Simple Past ('had') in the protasis to establish an unreal present condition.",
    target: "Second Conditional: Hypothetical Protasis"
  },
  {
    passage: "The municipal health task force fumigates the central wholesale market every fortnight.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The central wholesale market is fumigated by the municipal health task force every fortnight.",
      "The central wholesale market was fumigated by the municipal health task force every fortnight.",
      "The central wholesale market is being fumigated by the municipal health task force every fortnight.",
      "The central wholesale market has been fumigated by the municipal health task force every fortnight."
    ],
    answer: "The central wholesale market is fumigated by the municipal health task force every fortnight.",
    hint: "Simple Present active ('fumigates') with singular patient ('market') converts to 'is fumigated'.",
    solution: "Simple Present active ('fumigates') converts to [is + Past Participle]: 'is fumigated'.",
    target: "Passive Voice: Simple Present Aspect"
  },
  {
    passage: "The lead defense attorney said, \"My client cannot attend this court hearing today.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The lead defense attorney said that his client could not attend that court hearing that day.",
      "The lead defense attorney said that his client cannot attend this court hearing today.",
      "The lead defense attorney said that my client could not attend that court hearing that day.",
      "The lead defense attorney said that his client could not attend this court hearing today."
    ],
    answer: "The lead defense attorney said that his client could not attend that court hearing that day.",
    hint: "'Cannot' becomes 'could not'; 'my' becomes 'his'; 'this' becomes 'that'; 'today' becomes 'that day'.",
    solution: "Modal 'cannot' backshifts to 'could not', possessive 'my' becomes 'his', demonstrative 'this' becomes 'that', and temporal 'today' becomes 'that day'.",
    target: "Reported Speech: Negative Modal & Deixis Shift"
  },
  {
    passage: "If you ________ sodium metal to cold water, an exothermic hydrogen reaction takes place.",
    question: "Choose the correct verb form for this Zero Conditional chemical fact:",
    options: ["add", "will add", "added", "would add"],
    answer: "add",
    hint: "Zero Conditionals describe universal chemical reactions using Simple Present in both clauses.",
    solution: "Zero Conditionals describe universal chemical reactions using Simple Present: 'If you add... reaction takes place'.",
    target: "Zero Conditional: Chemical Reaction"
  },
  {
    passage: "The sanitation authority has evacuated several tons of solid refuse from the storm drain.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "Several tons of solid refuse have been evacuated by the sanitation authority from the storm drain.",
      "Several tons of solid refuse were evacuated by the sanitation authority from the storm drain.",
      "Several tons of solid refuse had been evacuated by the sanitation authority from the storm drain.",
      "Several tons of solid refuse are evacuated by the sanitation authority from the storm drain."
    ],
    answer: "Several tons of solid refuse have been evacuated by the sanitation authority from the storm drain.",
    hint: "'Tons' is plural; Present Perfect passive requires 'have been evacuated'.",
    solution: "Present Perfect active ('has evacuated') with a plural patient ('several tons') converts to 'have been evacuated'.",
    target: "Passive Voice: Present Perfect Plural Transposition"
  },
  {
    passage: "The astronomer explained, \"The moon causes the oceanic tides on earth through gravitational pull.\"",
    question: "Choose the correct reported speech sentence:",
    options: [
      "The astronomer explained that the moon causes the oceanic tides on earth through gravitational pull.",
      "The astronomer explained that the moon caused the oceanic tides on earth through gravitational pull.",
      "The astronomer explained that the moon had caused the oceanic tides on earth through gravitational pull.",
      "The astronomer explained that the moon was causing the oceanic tides on earth through gravitational pull."
    ],
    answer: "The astronomer explained that the moon causes the oceanic tides on earth through gravitational pull.",
    hint: "Tidal physics is an invariable universal reality exempt from tense backshifting.",
    solution: "Oceanic tidal motion is an invariable physical reality; the verb 'causes' remains in the simple present tense without backshifting.",
    target: "Reported Speech: Astronomical Fact Exemption"
  },
  {
    passage: "If the veterinary department ________ the livestock against anthrax, the pastoralists will safeguard their herds.",
    question: "Choose the correct verb form for the First Conditional clause:",
    options: ["vaccinates", "will vaccinate", "vaccinated", "would vaccinate"],
    answer: "vaccinates",
    hint: "The if-clause of a First Conditional sentence takes the Simple Present tense.",
    solution: "The First Conditional protasis requires the Simple Present ('vaccinates'), paired with 'will safeguard' in the apodosis.",
    target: "First Conditional: Protasis Present Tense"
  },
  {
    passage: "The master blacksmith forged an ornate iron gate for the royal mausoleum.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "An ornate iron gate was forged by the master blacksmith for the royal mausoleum.",
      "An ornate iron gate is forged by the master blacksmith for the royal mausoleum.",
      "An ornate iron gate had been forged by the master blacksmith for the royal mausoleum.",
      "An ornate iron gate was being forged by the master blacksmith for the royal mausoleum."
    ],
    answer: "An ornate iron gate was forged by the master blacksmith for the royal mausoleum.",
    hint: "Simple Past active ('forged') converts to 'was forged'.",
    solution: "Simple Past active ('forged') transforms into [was + Past Participle]: 'was forged'.",
    target: "Passive Voice: Simple Past Transposition"
  },
  {
    passage: "The municipal surveyor said, \"We completed the cadastral boundary demarcation yesterday.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The municipal surveyor said that they had completed the cadastral boundary demarcation the day before.",
      "The municipal surveyor said that we completed the cadastral boundary demarcation yesterday.",
      "The municipal surveyor said that they completed the cadastral boundary demarcation the day before.",
      "The municipal surveyor said that they had completed the cadastral boundary demarcation yesterday."
    ],
    answer: "The municipal surveyor said that they had completed the cadastral boundary demarcation the day before.",
    hint: "Simple Past ('completed') -> Past Perfect ('had completed'); 'we' -> 'they'; 'yesterday' -> 'the day before'.",
    solution: "Simple Past backshifts to Past Perfect ('had completed'), pronoun 'we' becomes 'they', and 'yesterday' becomes 'the day before'.",
    target: "Reported Speech: Past Tense Backshift & Deixis"
  },
  {
    passage: "If the national power grid ________ more solar energy plants, thermal fuel emissions would drop significantly.",
    question: "Choose the correct verb form for this Second Conditional sentence:",
    options: ["integrated", "integrates", "will integrate", "would integrate"],
    answer: "integrated",
    hint: "Match the hypothetical apodosis ('would drop') with Simple Past in the if-clause.",
    solution: "The Second Conditional requires the Simple Past ('integrated') in the if-clause to establish an unreal present condition.",
    target: "Second Conditional: Hypothetical Protasis"
  },
  {
    passage: "The senior botanist was cataloguing rare medicinal orchids when the herbarium lights failed.",
    question: "Choose the correct passive voice transformation of the first clause:",
    options: [
      "Rare medicinal orchids were being catalogued by the senior botanist when the herbarium lights failed.",
      "Rare medicinal orchids was being catalogued by the senior botanist when the herbarium lights failed.",
      "Rare medicinal orchids were catalogued by the senior botanist when the herbarium lights failed.",
      "Rare medicinal orchids had been catalogued by the senior botanist when the herbarium lights failed."
    ],
    answer: "Rare medicinal orchids were being catalogued by the senior botanist when the herbarium lights failed.",
    hint: "'Orchids' is plural; Past Continuous passive requires 'were being catalogued'.",
    solution: "Past Continuous active ('was cataloguing') with a plural patient ('rare medicinal orchids') transforms into [were + being + Past Participle]: 'were being catalogued'.",
    target: "Passive Voice: Past Continuous Plural Transposition"
  },
  {
    passage: "The research fellow announced, \"Our team will publish these botanical findings next month.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The research fellow announced that their team would publish those botanical findings the following month.",
      "The research fellow announced that our team will publish these botanical findings next month.",
      "The research fellow announced that their team would publish these botanical findings next month.",
      "The research fellow announced that their team will publish those botanical findings the following month."
    ],
    answer: "The research fellow announced that their team would publish those botanical findings the following month.",
    hint: "'Will' shifts to 'would'; 'our' -> 'their'; 'these' -> 'those'; 'next month' -> 'the following month'.",
    solution: "Modal 'will' shifts to 'would', possessive 'our' becomes 'their', demonstrative 'these' becomes 'those', and 'next month' becomes 'the following month'.",
    target: "Reported Speech: Modal Backshift & Deictic Shift"
  },
  {
    passage: "If you ________ green light and red light together, the human eye perceives yellow light.",
    question: "Choose the correct verb form for this Zero Conditional optical fact:",
    options: ["project", "will project", "projected", "would project"],
    answer: "project",
    hint: "Zero Conditionals describe universal optical laws using Simple Present in both clauses.",
    solution: "Zero Conditionals describe universal optical laws using Simple Present: 'If you project... eye perceives'.",
    target: "Zero Conditional: Optical Law"
  },
  {
    passage: "The postal courier service has delivered fifty confidential parcels to the supreme court.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "Fifty confidential parcels have been delivered by the postal courier service to the supreme court.",
      "Fifty confidential parcels were delivered by the postal courier service to the supreme court.",
      "Fifty confidential parcels had been delivered by the postal courier service to the supreme court.",
      "Fifty confidential parcels are delivered by the postal courier service to the supreme court."
    ],
    answer: "Fifty confidential parcels have been delivered by the postal courier service to the supreme court.",
    hint: "'Parcels' is plural; Present Perfect passive requires 'have been delivered'.",
    solution: "Present Perfect active ('has delivered') with a plural patient ('fifty confidential parcels') converts to 'have been delivered'.",
    target: "Passive Voice: Present Perfect Plural Transposition"
  },
  {
    passage: "The biology master said, \"Mammals possess mammary glands to nourish their young.\"",
    question: "Choose the correct reported speech sentence:",
    options: [
      "The biology master said that mammals possess mammary glands to nourish their young.",
      "The biology master said that mammals possessed mammary glands to nourish their young.",
      "The biology master said that mammals had possessed mammary glands to nourish their young.",
      "The biology master said that mammals were possessing mammary glands to nourish their young."
    ],
    answer: "The biology master said that mammals possess mammary glands to nourish their young.",
    hint: "Permanent anatomical definitions are exempt from backshifting in reported speech.",
    solution: "Biological definitions are permanent realities; the verb 'possess' remains in the simple present tense without backshifting.",
    target: "Reported Speech: Biological Definition Exemption"
  },
  {
    passage: "If the district assembly ________ the borehole pumps regularly, the rural clinics will enjoy uninterrupted water.",
    question: "Choose the correct verb form for the First Conditional clause:",
    options: ["services", "will service", "serviced", "would service"],
    answer: "services",
    hint: "The if-clause of a First Conditional sentence takes the Simple Present tense.",
    solution: "The First Conditional protasis requires the Simple Present ('services'), paired with 'will enjoy' in the apodosis.",
    target: "First Conditional: Protasis Present Tense"
  },
  {
    passage: "The structural engineer condemned the dilapidated classroom pavilion yesterday.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The dilapidated classroom pavilion was condemned by the structural engineer yesterday.",
      "The dilapidated classroom pavilion is condemned by the structural engineer yesterday.",
      "The dilapidated classroom pavilion had been condemned by the structural engineer yesterday.",
      "The dilapidated classroom pavilion was being condemned by the structural engineer yesterday."
    ],
    answer: "The dilapidated classroom pavilion was condemned by the structural engineer yesterday.",
    hint: "Simple Past active ('condemned') converts to 'was condemned'.",
    solution: "Simple Past active ('condemned') transforms into [was + Past Participle]: 'was condemned'.",
    target: "Passive Voice: Simple Past Transposition"
  },
  {
    passage: "Kweku said, \"I can repair this computerized electronic microscope.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "Kweku said that he could repair that computerized electronic microscope.",
      "Kweku said that he can repair this computerized electronic microscope.",
      "Kweku said that he could repair this computerized electronic microscope.",
      "Kweku said that he would repair that computerized electronic microscope."
    ],
    answer: "Kweku said that he could repair that computerized electronic microscope.",
    hint: "'Can' backshifts to 'could', and 'this' becomes 'that'.",
    solution: "Modal 'can' backshifts to 'could', pronoun 'I' becomes 'he', and demonstrative 'this' shifts to 'that'.",
    target: "Reported Speech: Modal Can & Demonstrative Shift"
  },
  {
    passage: "If the veterinary service ________ adequate serum stocks, livestock mortality would drop dramatically.",
    question: "Choose the correct verb form for this Second Conditional sentence:",
    options: ["maintained", "maintains", "will maintain", "would maintain"],
    answer: "maintained",
    hint: "Pair the hypothetical consequence ('would drop') with Simple Past in the if-clause.",
    solution: "The Second Conditional requires the Simple Past ('maintained') in the protasis to express an unreal condition.",
    target: "Second Conditional: Hypothetical Protasis"
  },
  {
    passage: "The sanitary inspector checks the food storage refrigerators every morning.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The food storage refrigerators are checked by the sanitary inspector every morning.",
      "The food storage refrigerators were checked by the sanitary inspector every morning.",
      "The food storage refrigerators are being checked by the sanitary inspector every morning.",
      "The food storage refrigerators have been checked by the sanitary inspector every morning."
    ],
    answer: "The food storage refrigerators are checked by the sanitary inspector every morning.",
    hint: "'Refrigerators' is plural; Simple Present passive requires 'are checked'.",
    solution: "Simple Present active ('checks') with a plural patient ('refrigerators') converts to [are + Past Participle]: 'are checked'.",
    target: "Passive Voice: Simple Present Plural Transposition"
  },
  {
    passage: "The headmistress instructed the prefects, \"You must inspect the school uniforms now.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The headmistress instructed the prefects that they had to inspect the school uniforms then.",
      "The headmistress instructed the prefects that they must inspect the school uniforms now.",
      "The headmistress instructed the prefects that they would inspect the school uniforms then.",
      "The headmistress instructed the prefects that you had to inspect the school uniforms then."
    ],
    answer: "The headmistress instructed the prefects that they had to inspect the school uniforms then.",
    hint: "'Must' expressing obligation becomes 'had to'; 'you' becomes 'they'; 'now' becomes 'then'.",
    solution: "Modal 'must' (obligation) backshifts to 'had to', pronoun 'you' becomes 'they', and temporal 'now' becomes 'then'.",
    target: "Reported Speech: Modal Must Obligation & Deixis"
  },
  {
    passage: "If you ________ dry sulfur in air, it burns with a characteristic pale blue flame.",
    question: "Choose the correct verb form for this Zero Conditional chemical fact:",
    options: ["ignite", "will ignite", "ignited", "would ignite"],
    answer: "ignite",
    hint: "Zero Conditionals describe universal combustion facts using Simple Present in both clauses.",
    solution: "Zero Conditionals describe universal combustion reactions using Simple Present: 'If you ignite... it burns'.",
    target: "Zero Conditional: Combustion Fact"
  },
  {
    passage: "The mechanical technician was overhauling the diesel generator when the fuel pipe burst.",
    question: "Choose the correct passive voice transformation of the first clause:",
    options: [
      "The diesel generator was being overhauled by the mechanical technician when the fuel pipe burst.",
      "The diesel generator was overhauled by the mechanical technician when the fuel pipe burst.",
      "The diesel generator is being overhauled by the mechanical technician when the fuel pipe burst.",
      "The diesel generator had been overhauled by the mechanical technician when the fuel pipe burst."
    ],
    answer: "The diesel generator was being overhauled by the mechanical technician when the fuel pipe burst.",
    hint: "Past Continuous active ('was overhauling') converts to 'was being overhauled'.",
    solution: "Past Continuous active ('was overhauling') transforms into [was + being + Past Participle]: 'was being overhauled'.",
    target: "Passive Voice: Past Continuous Aspect"
  },
  {
    passage: "The physics lecturer explained, \"Sound waves require a material medium to propagate.\"",
    question: "Choose the correct reported speech sentence:",
    options: [
      "The physics lecturer explained that sound waves require a material medium to propagate.",
      "The physics lecturer explained that sound waves required a material medium to propagate.",
      "The physics lecturer explained that sound waves had required a material medium to propagate.",
      "The physics lecturer explained that sound waves were requiring a material medium to propagate."
    ],
    answer: "The physics lecturer explained that sound waves require a material medium to propagate.",
    hint: "Acoustic physical principles are exempt from backshifting in reported speech.",
    solution: "Acoustic wave propagation is an invariant physical principle; the verb 'require' remains in the simple present tense without backshifting.",
    target: "Reported Speech: Acoustic Law Exemption"
  },
  {
    passage: "If the municipal roads agency ________ the damaged potholes, vehicular traffic will flow smoothly.",
    question: "Choose the correct verb form for the First Conditional clause:",
    options: ["patches", "will patch", "patched", "would patch"],
    answer: "patches",
    hint: "The if-clause of a First Conditional sentence takes the Simple Present tense.",
    solution: "The First Conditional protasis requires the Simple Present ('patches'), paired with 'will flow' in the apodosis.",
    target: "First Conditional: Protasis Present Tense"
  },
  {
    passage: "The security guards locked all warehouse perimeter gates before midnight.",
    question: "Choose the correct passive voice transformation of the sentence:",
    options: [
      "All warehouse perimeter gates were locked by the security guards before midnight.",
      "All warehouse perimeter gates was locked by the security guards before midnight.",
      "All warehouse perimeter gates are locked by the security guards before midnight.",
      "All warehouse perimeter gates had been locked by the security guards before midnight."
    ],
    answer: "All warehouse perimeter gates were locked by the security guards before midnight.",
    hint: "'Gates' is plural; Simple Past passive requires 'were locked'.",
    solution: "Simple Past active ('locked') with a plural patient ('perimeter gates') converts to 'were locked'.",
    target: "Passive Voice: Simple Past Plural Transposition"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// =========================================================================
const capstone5B8SyntaxConcordIntermediateQuestions = [
  {
    questionNumber: 51,
    question: "In paragraph 1, why is the present tense verb 'is absorbed' used in the clause 'when solar radiation strikes green foliage, radiant energy is absorbed by chlorophyll pigments'?",
    options: [
      "Because it expresses a Zero Conditional scientific truth where an invariable photochemical process requires the Simple Present passive in both clauses",
      "Because 'energy' is an irregular plural noun that rejects past tense verbs",
      "Because the speaker was speaking inside a closed auditorium",
      "Because conditional clauses never use passive voice in standard English"
    ],
    answer: "Because it expresses a Zero Conditional scientific truth where an invariable photochemical process requires the Simple Present passive in both clauses",
    hint: "Notice that photochemical reactions are invariant scientific realities.",
    solution: "Zero Conditionals describe universal scientific truths using Simple Present. The passive construction 'is absorbed' correctly reflects an invariant photochemical law.",
    target: "Capstone Exam: Zero Conditional Scientific Truth"
  },
  {
    questionNumber: 52,
    question: "In paragraph 2, what syntactic voice transformation is demonstrated by the clause 'organic foliar fertilizers were being sprayed across the trial beds by the extension apprentices'?",
    options: [
      "A Past Continuous passive voice construction where the plural patient ('organic foliar fertilizers') is promoted and the action is shown as ongoing in the past",
      "A Present Perfect active voice sentence emphasizing the chemical quantity",
      "An intransitive verb construction that cannot take a direct object",
      "A subjunctive mood inversion expressing an unreal wish"
    ],
    answer: "A Past Continuous passive voice construction where the plural patient ('organic foliar fertilizers') is promoted and the action is shown as ongoing in the past",
    hint: "Identify the structure [were + being + Past Participle + by + Agent].",
    solution: "The clause illustrates a textbook Past Continuous passive construction: [Plural Patient + were + being + Past Participle (sprayed) + by + Agent].",
    target: "Capstone Exam: Passive Voice Aspect Analysis"
  },
  {
    questionNumber: 53,
    question: "In paragraph 2, why is the clause 'if the municipal assembly allocates adequate irrigation machinery next season, the agronomy department will cultivate three cycles of hybrid sweet corn annually' grammatically correct under First Conditional rules?",
    options: [
      "Because the if-clause correctly uses the Simple Present ('allocates') instead of 'will allocate' to express a predictive real possibility, matching 'will cultivate' in the main clause",
      "Because 'next season' requires the Past Continuous tense in both clauses",
      "Because 'machinery' is an uncountable noun that demands a modal verb in the if-clause",
      "Because the main clause uses 'would' to show that the cultivation is impossible"
    ],
    answer: "Because the if-clause correctly uses the Simple Present ('allocates') instead of 'will allocate' to express a predictive real possibility, matching 'will cultivate' in the main clause",
    hint: "Recall the First Conditional Protasis Law regarding modal verbs in the if-clause.",
    solution: "The First Conditional Protasis Law prohibits 'will' in the if-clause. The Simple Present ('allocates') denotes the future condition, paired with 'will cultivate' in the apodosis.",
    target: "Capstone Exam: First Conditional Protasis Law"
  },
  {
    questionNumber: 54,
    question: "In paragraph 3, which option correctly explains the reported speech transformation of the scientist's direct statement: \"I am inspecting your experimental plots today to evaluate biological pest controls\"?",
    options: [
      "The reporting verb 'stated' triggers backshifting of 'am inspecting' to 'was inspecting', pronoun 'I' shifts to 'she', possessive 'your' shifts to 'their', and temporal 'today' shifts to 'that day'",
      "The sentence retains 'am inspecting' because the plots are still in Kumasi",
      "The sentence converts to 'will inspect' because the evaluation is scheduled for next year",
      "The sentence changes 'today' to 'yesterday' and uses 'had inspected'"
    ],
    answer: "The reporting verb 'stated' triggers backshifting of 'am inspecting' to 'was inspecting', pronoun 'I' shifts to 'she', possessive 'your' shifts to 'their', and temporal 'today' shifts to 'that day'",
    hint: "Check the tense backshift (Present Continuous -> Past Continuous) and temporal deixis ('today' -> 'that day').",
    solution: "With a past reporting verb ('stated'), Present Continuous shifts to Past Continuous ('was inspecting'), first-person 'I' becomes 'she', second-person possessive 'your' becomes 'their', and temporal deixis 'today' shifts to 'that day'.",
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

  console.log("Building 55 UNIQUE questions for Basic 8 (JHS 2) Strand 3 Sub-Strand 2 Intermediate Lab...");
  const all55Questions = [];

  // 1. Build Questions 1 to 50
  unique50B8SyntaxConcordIntermediateDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B8_S2_I_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B8",
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
      learningCompetency: "B8.3.1.2 / B8.3.2.1 / B8.3.3.1: Demonstrate intermediate grammatical mastery of active-to-passive voice transformations, reported speech backshifts, universal truth exemptions, and closed conditionals (Types 0, 1, 2)."
    });
  });

  // 2. Build Questions 51 to 55
  capstone5B8SyntaxConcordIntermediateQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${b8SyntaxConcordIntermediateCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B8_S2_I_${item.questionNumber}`,
      level: "B8",
      difficulty: "intermediate",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: b8SyntaxConcordIntermediateCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B8.3.1.2 / B8.3.2.1 / B8.3.3.1: Synthesize intermediate multi-paragraph contextual grammar, evaluating passive voice transpositions, reported speech deixis, conditionals, universal truth exemptions, and concise rule summaries."
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
    level: "B8",
    difficulty: "intermediate",
    title: "Basic 8 Intermediate Lab: 50 Unique Syntax, Voice & Conditional Drills + 5 Capstone Exam Questions",
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
    console.log(`🎯 Populating B8 Intermediate for: ${topicId}`);
    console.log(`======================================================`);

    // 1. Write subcollection doc
    const subDocPath = `global_curriculum/jhs/subjects/english/topical/${topicId}/practice_labs/B8_intermediate`;
    await db.doc(subDocPath).set(subDocPayload, { merge: true });
    console.log(`   ✅ Wrote subcollection doc: ${subDocPath}`);

    // 2. Update main doc's levels.b8.practicePool.medium across all parent collections
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
          medium: practicePoolQuestions
        };

        const totalQs = (curLevels.b7?.practicePool?.low?.length || 0) +
                        (curLevels.b7?.practicePool?.medium?.length || 0) +
                        (curLevels.b7?.practicePool?.hard?.length || 0) +
                        (curPool.low?.length || 0) +
                        (updatedPool.medium?.length || 0) +
                        (curPool.hard?.length || 0) +
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

        console.log(`   ✅ Updated main doc pool at: ${mainDocPath} (B8 Medium: ${practicePoolQuestions.length} Qs, Total: ${totalQs})`);
      }
    }
  }

  console.log("\n🎉 Basic 8 (JHS 2) Intermediate Lab successfully deployed!");
}

deploy()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("❌ Fatal Error Deploying B8 Intermediate Lab:", err);
    process.exit(1);
  });
