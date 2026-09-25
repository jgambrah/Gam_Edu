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
// Strand 3 Sub-Strand 2 B8 Advanced Focus:
// Complex Passive Voice, Multi-Tier Reported Speech Deixis,
// First Conditional Protasis Invariable Law, Second Conditional Irrealis Subjunctive,
// and Universal Scientific Fact Backshift Exemptions
// =========================================================================
const b8SyntaxConcordAdvancedCapstonePassage = 
`During the international climate resilience colloquium convened at the Accra International Conference Centre, the chief environmental scientist delivered a keynote address on coastal erosion in the Gulf of Guinea. Standing before a plenary assembly of regional ministers and environmental fellows, the scientist demonstrated that when atmospheric temperatures rise, oceanic water expands thermally to accelerate coastal flooding. She underscored that this thermodynamic principle is corroborated by climatologists worldwide.

While reviewing the engineering dockets for municipal flood mitigation, the lead coastal engineer observed that automated tidal surge barriers were being erected along the maritime littoral by the engineering detachment. The project director inspected the geotechnical ledgers and confirmed that over fifty thousand metric tons of quarried granite armor stones had been deployed by the maritime consortium during the preceding quarter. He then informed the parliamentary delegates that if the national treasury allocates supplemental infrastructure bonds next season, the marine agency will complete the revetment wall ahead of schedule.

Later in the plenary symposium, an environmental biochemist from the atomic energy commission presented a paper on industrial heavy-metal effluent in freshwater wetlands. During her dissertation, she warned the assembly that if toxic smelting slag contaminated the municipal aquifer, subterranean water supplies would become hazardous for human consumption. In a televised interview with diplomatic correspondents, the researcher remarked, "I am presenting our laboratory findings today to demand statutory enforcement." The senior editor for the scientific gazette recorded that the researcher stated that she was presenting their laboratory findings that day to demand statutory enforcement.

Before concluding the session, the plenary chairperson directed municipal authorities to comply with all environmental mitigation protocols before issuing commercial building permits. She declared that strict zoning ordinances must be enforced by the municipal assemblies without bureaucratic compromise. In his closing valedictory address, the statutory council president proclaimed that whenever sovereign nations uphold rigorous scientific analysis, environmental degradation is mitigated for future generations.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// =========================================================================
const unique50B8SyntaxConcordAdvancedDrills = [
  {
    passage: "The senior forensic pathologist is analyzing the histological tissue specimens in the clean room right now.",
    question: "Choose the correct passive voice transformation of the sentence:",
    options: [
      "The histological tissue specimens are being analyzed by the senior forensic pathologist in the clean room right now.",
      "The histological tissue specimens were being analyzed by the senior forensic pathologist in the clean room right now.",
      "The histological tissue specimens are analyzed by the senior forensic pathologist in the clean room right now.",
      "The histological tissue specimens have been analyzed by the senior forensic pathologist in the clean room right now."
    ],
    answer: "The histological tissue specimens are being analyzed by the senior forensic pathologist in the clean room right now.",
    hint: "Present Continuous active ('is analyzing') with a plural patient ('specimens') requires 'are being analyzed'.",
    solution: "The active verb 'is analyzing' is present continuous. For a plural patient ('specimens'), the passive transformation requires [are + being + Past Participle]: 'are being analyzed'.",
    target: "Passive Voice: Present Continuous Plural Aspect"
  },
  {
    passage: "The statutory auditor said, \"I verified these procurement vouchers yesterday.\"",
    question: "Choose the grammatically correct reported speech sentence:",
    options: [
      "The statutory auditor said that he had verified those procurement vouchers the day before.",
      "The statutory auditor said that he verified these procurement vouchers yesterday.",
      "The statutory auditor said that he had verified these procurement vouchers the day before.",
      "The statutory auditor said that he was verifying those procurement vouchers yesterday."
    ],
    answer: "The statutory auditor said that he had verified those procurement vouchers the day before.",
    hint: "Simple Past ('verified') -> Past Perfect ('had verified'); 'these' -> 'those'; 'yesterday' -> 'the day before'.",
    solution: "With a past reporting verb ('said'), Simple Past shifts to Past Perfect ('had verified'), proximate 'these' becomes distal 'those', and 'yesterday' shifts to 'the day before'.",
    target: "Reported Speech: Simple Past & Demonstrative Shift"
  },
  {
    passage: "If the national telecommunications provider ________ the damaged fiber-optic trunkline today, internet connectivity will be restored across the capital.",
    question: "Choose the correct verb form to complete the First Conditional protasis:",
    options: ["repairs", "will repair", "repaired", "would repair"],
    answer: "repairs",
    hint: "In First Conditional sentences, the if-clause takes the Simple Present tense, never 'will'.",
    solution: "The First Conditional Protasis Law prohibits the modal auxiliary 'will' in the if-clause. The Simple Present ('repairs') is grammatically mandatory when paired with 'will be restored'.",
    target: "First Conditional: Protasis Present Tense Law"
  },
  {
    passage: "If saline seawater ________ below minus two degrees Celsius under standard atmospheric pressure, it crystallizes into sea ice.",
    question: "Choose the correct verb form for this Zero Conditional physical fact:",
    options: ["freezes", "will freeze", "froze", "would freeze"],
    answer: "freezes",
    hint: "Zero Conditional sentences express invariable physical laws using the Simple Present in both clauses.",
    solution: "Zero Conditionals describe universal physical facts using the formula: IF + Simple Present, ... Simple Present. Therefore, 'freezes' is the correct form.",
    target: "Zero Conditional: Physical Law"
  },
  {
    passage: "The maritime salvage crew had stabilized the leaking oil tanker before the midnight storm struck.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The leaking oil tanker had been stabilized by the maritime salvage crew before the midnight storm struck.",
      "The leaking oil tanker was stabilized by the maritime salvage crew before the midnight storm struck.",
      "The leaking oil tanker has been stabilized by the maritime salvage crew before the midnight storm struck.",
      "The leaking oil tanker was being stabilized by the maritime salvage crew before the midnight storm struck."
    ],
    answer: "The leaking oil tanker had been stabilized by the maritime salvage crew before the midnight storm struck.",
    hint: "Past Perfect active ('had stabilized') transforms into 'had been stabilized'.",
    solution: "The active verb 'had stabilized' is in the past perfect tense. The passive transformation requires [had been + Past Participle]: 'had been stabilized'.",
    target: "Passive Voice: Past Perfect Aspect"
  },
  {
    passage: "The planetary astronomer stated, \"Jupiter possesses the strongest magnetic field among all planets in the solar system.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The planetary astronomer stated that Jupiter possesses the strongest magnetic field among all planets in the solar system.",
      "The planetary astronomer stated that Jupiter possessed the strongest magnetic field among all planets in the solar system.",
      "The planetary astronomer stated that Jupiter had possessed the strongest magnetic field among all planets in the solar system.",
      "The planetary astronomer stated that Jupiter was possessing the strongest magnetic field among all planets in the solar system."
    ],
    answer: "The planetary astronomer stated that Jupiter possesses the strongest magnetic field among all planets in the solar system.",
    hint: "Permanent astronomical realities are exempt from past-tense backshifting.",
    solution: "Under the Universal Truth Backshift Exemption, statements expressing permanent celestial and scientific realities retain the simple present tense ('possesses').",
    target: "Reported Speech: Astronomical Truth Exemption"
  },
  {
    passage: "If I ________ the governor of the central bank, I would implement strict reserve ratios to halt currency depreciation.",
    question: "Choose the correct subjunctive verb form for this Second Conditional sentence:",
    options: ["were", "was", "am", "would be"],
    answer: "were",
    hint: "Hypothetical contrary-to-fact statements require the invariant past subjunctive 'were' for all persons.",
    solution: "Second Conditional sentences expressing hypothetical present states mandate the invariant past subjunctive 'were' ('If I were...'), paired with 'would + base verb'.",
    target: "Second Conditional: Irrealis Subjunctive Were"
  },
  {
    passage: "The legislative drafting bureau must publish the statutory statutory amendments before the parliamentary recess.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The statutory amendments must be published by the legislative drafting bureau before the parliamentary recess.",
      "The statutory amendments must have been published by the legislative drafting bureau before the parliamentary recess.",
      "The statutory amendments were published by the legislative drafting bureau before the parliamentary recess.",
      "The statutory amendments are published by the legislative drafting bureau before the parliamentary recess."
    ],
    answer: "The statutory amendments must be published by the legislative drafting bureau before the parliamentary recess.",
    hint: "Modal auxiliaries ('must publish') transform into [modal + be + Past Participle].",
    solution: "The modal verb structure 'must publish' converts into [modal + be + Past Participle]: 'must be published'.",
    target: "Passive Voice: Modal Auxiliary Transposition"
  },
  {
    passage: "The treasury director said, \"We have completed the forensic review of foreign currency allocations for this quarter.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The treasury director said that they had completed the forensic review of foreign currency allocations for that quarter.",
      "The treasury director said that we have completed the forensic review of foreign currency allocations for this quarter.",
      "The treasury director said that they have completed the forensic review of foreign currency allocations for that quarter.",
      "The treasury director said that they completed the forensic review of foreign currency allocations for this quarter."
    ],
    answer: "The treasury director said that they had completed the forensic review of foreign currency allocations for that quarter.",
    hint: "Present Perfect ('have completed') backshifts to Past Perfect ('had completed'); 'this' becomes 'that'.",
    solution: "Present Perfect shifts to Past Perfect ('had completed'), first-person plural 'we' becomes 'they', and the demonstrative 'this' shifts to 'that'.",
    target: "Reported Speech: Present Perfect & Demonstrative Deixis"
  },
  {
    passage: "If the commercial shipping syndicate ________ new deep-water container berths, maritime freight traffic will expand dramatically.",
    question: "Choose the correct verb form for the First Conditional clause:",
    options: ["constructs", "will construct", "constructed", "would construct"],
    answer: "constructs",
    hint: "The if-clause of a First Conditional sentence takes the Simple Present tense.",
    solution: "First Conditional sentences require the Simple Present ('constructs') in the protasis, paired with 'will expand' in the apodosis.",
    target: "First Conditional: Protasis Present Tense"
  },
  {
    passage: "The ballistics experts were test-firing the confiscated automatic rifles in the underground firing range.",
    question: "Choose the correct passive voice transformation of the sentence:",
    options: [
      "The confiscated automatic rifles were being test-fired by the ballistics experts in the underground firing range.",
      "The confiscated automatic rifles were test-fired by the ballistics experts in the underground firing range.",
      "The confiscated automatic rifles had been test-fired by the ballistics experts in the underground firing range.",
      "The confiscated automatic rifles are being test-fired by the ballistics experts in the underground firing range."
    ],
    answer: "The confiscated automatic rifles were being test-fired by the ballistics experts in the underground firing range.",
    hint: "Past Continuous active ('were test-firing') transforms into [was/were + being + Past Participle].",
    solution: "The past continuous active verb 'were test-firing' converts into [were + being + Past Participle]: 'were being test-fired'.",
    target: "Passive Voice: Past Continuous Aspect"
  },
  {
    passage: "The neurobiologist explained, \"Human motor neurons transmit electrical impulses via chemical neurotransmitters across synaptic clefts.\"",
    question: "Choose the correct reported speech sentence:",
    options: [
      "The neurobiologist explained that human motor neurons transmit electrical impulses via chemical neurotransmitters across synaptic clefts.",
      "The neurobiologist explained that human motor neurons transmitted electrical impulses via chemical neurotransmitters across synaptic clefts.",
      "The neurobiologist explained that human motor neurons had transmitted electrical impulses via chemical neurotransmitters across synaptic clefts.",
      "The neurobiologist explained that human motor neurons were transmitting electrical impulses via chemical neurotransmitters across synaptic clefts."
    ],
    answer: "The neurobiologist explained that human motor neurons transmit electrical impulses via chemical neurotransmitters across synaptic clefts.",
    hint: "Invariant neurological facts do not undergo past-tense backshifting.",
    solution: "Because neural signal transmission is an ongoing physiological reality, the verb 'transmit' remains in the simple present tense without backshifting.",
    target: "Reported Speech: Biological Fact Exemption"
  },
  {
    passage: "If the national electric utility ________ regional smart grid controllers, blackout frequencies would diminish significantly.",
    question: "Choose the correct verb form for this Second Conditional sentence:",
    options: ["installed", "installs", "will install", "would install"],
    answer: "installed",
    hint: "Pair the hypothetical consequence ('would diminish') with a Simple Past verb in the if-clause.",
    solution: "In Second Conditional sentences, hypothetical conditions are expressed using the Simple Past ('installed'), matching 'would diminish' in the main clause.",
    target: "Second Conditional: Hypothetical Protasis"
  },
  {
    passage: "The central monetary authority has issued the certified macro-economic inflation statistics.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The certified macro-economic inflation statistics have been issued by the central monetary authority.",
      "The certified macro-economic inflation statistics was issued by the central monetary authority.",
      "The certified macro-economic inflation statistics had been issued by the central monetary authority.",
      "The certified macro-economic inflation statistics are issued by the central monetary authority."
    ],
    answer: "The certified macro-economic inflation statistics have been issued by the central monetary authority.",
    hint: "'Statistics' here takes plural agreement; Present Perfect passive requires 'have been issued'.",
    solution: "The plural patient ('statistics') paired with present perfect active ('has issued') transforms into [have been + Past Participle]: 'have been issued'.",
    target: "Passive Voice: Present Perfect Aspect"
  },
  {
    passage: "The commanding general announced, \"Our armed forces will conduct combined amphibious drills along the coastal littoral tonight.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The commanding general announced that their armed forces would conduct combined amphibious drills along the coastal littoral that night.",
      "The commanding general announced that our armed forces will conduct combined amphibious drills along the coastal littoral tonight.",
      "The commanding general announced that their armed forces will conduct combined amphibious drills along the coastal littoral that night.",
      "The commanding general announced that their armed forces would conduct combined amphibious drills along the coastal littoral tonight."
    ],
    answer: "The commanding general announced that their armed forces would conduct combined amphibious drills along the coastal littoral that night.",
    hint: "'Will' shifts to 'would', 'our' becomes 'their', and 'tonight' shifts to 'that night'.",
    solution: "Modal 'will' shifts to 'would', possessive 'our' becomes 'their', and proximate temporal deixis 'tonight' shifts to distal 'that night'.",
    target: "Reported Speech: Modal Backshift & Temporal Deixis"
  },
  {
    passage: "If you ________ sodium hydroxide with hydrochloric acid in stoichiometric proportions, table salt and water are produced.",
    question: "Choose the correct verb form for this Zero Conditional chemical fact:",
    options: ["neutralize", "will neutralize", "neutralized", "would neutralize"],
    answer: "neutralize",
    hint: "Zero Conditionals describe universal scientific truths using Simple Present in both clauses.",
    solution: "Universal chemical reactions take the Simple Present in both clauses: 'If you neutralize... table salt and water are produced'.",
    target: "Zero Conditional: Chemical Fact"
  },
  {
    passage: "The judicial commission of inquiry was cross-examining the disgraced procurement director when the court recorder fainted.",
    question: "Choose the correct passive voice transformation of the first clause:",
    options: [
      "The disgraced procurement director was being cross-examined by the judicial commission of inquiry when the court recorder fainted.",
      "The disgraced procurement director was cross-examined by the judicial commission of inquiry when the court recorder fainted.",
      "The disgraced procurement director is being cross-examined by the judicial commission of inquiry when the court recorder fainted.",
      "The disgraced procurement director had been cross-examined by the judicial commission of inquiry when the court recorder fainted."
    ],
    answer: "The disgraced procurement director was being cross-examined by the judicial commission of inquiry when the court recorder fainted.",
    hint: "Past Continuous active ('was cross-examining') requires 'was being cross-examined'.",
    solution: "The active verb 'was cross-examining' is past continuous. The passive transformation requires [was + being + Past Participle]: 'was being cross-examined'.",
    target: "Passive Voice: Past Continuous Aspect"
  },
  {
    passage: "The thermodynamics researcher stated, \"Absolute zero is the theoretical temperature at which all molecular kinetic motion ceases.\"",
    question: "Choose the grammatically correct reported speech sentence:",
    options: [
      "The thermodynamics researcher stated that absolute zero is the theoretical temperature at which all molecular kinetic motion ceases.",
      "The thermodynamics researcher stated that absolute zero was the theoretical temperature at which all molecular kinetic motion ceased.",
      "The thermodynamics researcher stated that absolute zero had been the theoretical temperature at which all molecular kinetic motion ceased.",
      "The thermodynamics researcher stated that absolute zero would be the theoretical temperature at which all molecular kinetic motion ceases."
    ],
    answer: "The thermodynamics researcher stated that absolute zero is the theoretical temperature at which all molecular kinetic motion ceases.",
    hint: "Universal physical definitions and natural laws do not backshift in reported speech.",
    solution: "The concept of absolute zero is an invariant physical law; the verbs 'is' and 'ceases' remain in the simple present tense without backshifting.",
    target: "Reported Speech: Physical Constant Exemption"
  },
  {
    passage: "If the national aviation authority ________ the international runway with radar-guided instrument landing arrays, flight diversions would cease.",
    question: "Choose the correct verb form for this Second Conditional sentence:",
    options: ["outfitted", "outfits", "will outfit", "would outfit"],
    answer: "outfitted",
    hint: "Pair the hypothetical apodosis ('would cease') with a Simple Past verb in the if-clause.",
    solution: "The Second Conditional protasis requires the Simple Past ('outfitted') to denote an unreal present scenario.",
    target: "Second Conditional: Hypothetical Protasis"
  },
  {
    passage: "The maritime patrol squadron intercepted four unregistered deep-sea trawlers off the continental shelf yesterday.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "Four unregistered deep-sea trawlers were intercepted by the maritime patrol squadron off the continental shelf yesterday.",
      "Four unregistered deep-sea trawlers was intercepted by the maritime patrol squadron off the continental shelf yesterday.",
      "Four unregistered deep-sea trawlers are intercepted by the maritime patrol squadron off the continental shelf yesterday.",
      "Four unregistered deep-sea trawlers had been intercepted by the maritime patrol squadron off the continental shelf yesterday."
    ],
    answer: "Four unregistered deep-sea trawlers were intercepted by the maritime patrol squadron off the continental shelf yesterday.",
    hint: "'Trawlers' is plural; Simple Past passive requires 'were intercepted'.",
    solution: "The active verb 'intercepted' is Simple Past. The promoted plural subject ('trawlers') takes 'were intercepted'.",
    target: "Passive Voice: Simple Past Plural Transposition"
  },
  {
    passage: "The hydro-geologist reported, \"Heavy tectonic fractures diverted subterranean water channels across the rift valley yesterday.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The hydro-geologist reported that heavy tectonic fractures had diverted subterranean water channels across the rift valley the day before.",
      "The hydro-geologist reported that heavy tectonic fractures diverted subterranean water channels across the rift valley yesterday.",
      "The hydro-geologist reported that heavy tectonic fractures had diverted subterranean water channels across the rift valley yesterday.",
      "The hydro-geologist reported that heavy tectonic fractures were diverting subterranean water channels across the rift valley the day before."
    ],
    answer: "The hydro-geologist reported that heavy tectonic fractures had diverted subterranean water channels across the rift valley the day before.",
    hint: "Simple Past ('diverted') backshifts to Past Perfect ('had diverted'), and 'yesterday' shifts to 'the day before'.",
    solution: "Simple Past backshifts to Past Perfect ('had diverted'), and 'yesterday' shifts to 'the day before' (or 'the previous day').",
    target: "Reported Speech: Simple Past Backshift & Deixis"
  },
  {
    passage: "If you ________ pure liquid water to atmospheric pressure below 0.006 atmospheres, it sublimates directly between vapor and ice phases.",
    question: "Choose the correct verb form for this Zero Conditional physical fact:",
    options: ["depressurize", "will depressurize", "depressurized", "would depressurize"],
    answer: "depressurize",
    hint: "Zero Conditional physical fact: Simple Present in both clauses.",
    solution: "Zero Conditionals describe universal phase-change thermodynamic laws using Simple Present in both clauses: 'If you depressurize... it sublimates'.",
    target: "Zero Conditional: Thermodynamic Phase Law"
  },
  {
    passage: "The presidential infrastructure board will commission the offshore gas processing terminal next quarter.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The offshore gas processing terminal will be commissioned by the presidential infrastructure board next quarter.",
      "The offshore gas processing terminal would be commissioned by the presidential infrastructure board next quarter.",
      "The offshore gas processing terminal is commissioned by the presidential infrastructure board next quarter.",
      "The offshore gas processing terminal will have been commissioned by the presidential infrastructure board next quarter."
    ],
    answer: "The offshore gas processing terminal will be commissioned by the presidential infrastructure board next quarter.",
    hint: "Simple Future active ('will commission') converts into 'will be + Past Participle'.",
    solution: "The active future verb 'will commission' converts into [will be + Past Participle]: 'will be commissioned'.",
    target: "Passive Voice: Simple Future Transposition"
  },
  {
    passage: "The mineralogist stated, \"Granite is an intrusive igneous rock composed primarily of quartz and feldspar.\"",
    question: "Choose the correct reported speech version:",
    options: [
      "The mineralogist stated that granite is an intrusive igneous rock composed primarily of quartz and feldspar.",
      "The mineralogist stated that granite was an intrusive igneous rock composed primarily of quartz and feldspar.",
      "The mineralogist stated that granite had been an intrusive igneous rock composed primarily of quartz and feldspar.",
      "The mineralogist stated that granite would be an intrusive igneous rock composed primarily of quartz and feldspar."
    ],
    answer: "The mineralogist stated that granite is an intrusive igneous rock composed primarily of quartz and feldspar.",
    hint: "Geological classifications are permanent scientific realities exempt from backshifting.",
    solution: "The petrological composition of granite is an invariant geological fact; the present tense 'is' is retained without backshifting.",
    target: "Reported Speech: Geological Fact Exemption"
  },
  {
    passage: "If the national research institute ________ adequate cryogenic freezers, the scientists would preserve live cell cultures indefinite years.",
    question: "Choose the correct verb form for this Second Conditional sentence:",
    options: ["maintained", "maintains", "will maintain", "would maintain"],
    answer: "maintained",
    hint: "Pair the hypothetical apodosis ('would preserve') with Simple Past in the if-clause.",
    solution: "The Second Conditional requires the Simple Past ('maintained') in the protasis to establish an unreal present condition.",
    target: "Second Conditional: Hypothetical Protasis"
  },
  {
    passage: "The public health directorate inspects all commercial food packaging plants every month.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "All commercial food packaging plants are inspected by the public health directorate every month.",
      "All commercial food packaging plants were inspected by the public health directorate every month.",
      "All commercial food packaging plants are being inspected by the public health directorate every month.",
      "All commercial food packaging plants have been inspected by the public health directorate every month."
    ],
    answer: "All commercial food packaging plants are inspected by the public health directorate every month.",
    hint: "'Plants' is plural; Simple Present passive requires 'are inspected'.",
    solution: "Simple Present active ('inspects') with a plural patient ('plants') converts to [are + Past Participle]: 'are inspected'.",
    target: "Passive Voice: Simple Present Plural Transposition"
  },
  {
    passage: "The lead defense advocate said, \"My client cannot sign this extradition agreement today.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The lead defense advocate said that his client could not sign that extradition agreement that day.",
      "The lead defense advocate said that his client cannot sign this extradition agreement today.",
      "The lead defense advocate said that my client could not sign that extradition agreement that day.",
      "The lead defense advocate said that his client could not sign this extradition agreement today."
    ],
    answer: "The lead defense advocate said that his client could not sign that extradition agreement that day.",
    hint: "'Cannot' becomes 'could not'; 'my' becomes 'his'; 'this' becomes 'that'; 'today' becomes 'that day'.",
    solution: "Modal 'cannot' backshifts to 'could not', possessive 'my' becomes 'his', demonstrative 'this' becomes 'that', and temporal 'today' becomes 'that day'.",
    target: "Reported Speech: Negative Modal & Deixis Shift"
  },
  {
    passage: "If you ________ concentrated sulfuric acid into cold water, substantial thermal energy is liberated.",
    question: "Choose the correct verb form for this Zero Conditional chemical fact:",
    options: ["dilute", "will dilute", "diluted", "would dilute"],
    answer: "dilute",
    hint: "Zero Conditionals describe universal chemical reactions using Simple Present in both clauses.",
    solution: "Universal chemical reactions take the Simple Present in both clauses: 'If you dilute... thermal energy is liberated'.",
    target: "Zero Conditional: Chemical Reaction"
  },
  {
    passage: "The statutory anti-corruption tribunal has convicted three municipal directors for procurement embezzlement.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "Three municipal directors have been convicted by the statutory anti-corruption tribunal for procurement embezzlement.",
      "Three municipal directors were convicted by the statutory anti-corruption tribunal for procurement embezzlement.",
      "Three municipal directors had been convicted by the statutory anti-corruption tribunal for procurement embezzlement.",
      "Three municipal directors are convicted by the statutory anti-corruption tribunal for procurement embezzlement."
    ],
    answer: "Three municipal directors have been convicted by the statutory anti-corruption tribunal for procurement embezzlement.",
    hint: "'Directors' is plural; Present Perfect passive requires 'have been convicted'.",
    solution: "Present Perfect active ('has convicted') with a plural patient ('three municipal directors') converts to 'have been convicted'.",
    target: "Passive Voice: Present Perfect Plural Transposition"
  },
  {
    passage: "The climatologist explained, \"Volcanic ash clouds reflect incoming solar irradiance to cause atmospheric cooling.\"",
    question: "Choose the correct reported speech sentence:",
    options: [
      "The climatologist explained that volcanic ash clouds reflect incoming solar irradiance to cause atmospheric cooling.",
      "The climatologist explained that volcanic ash clouds reflected incoming solar irradiance to cause atmospheric cooling.",
      "The climatologist explained that volcanic ash clouds had reflected incoming solar irradiance to cause atmospheric cooling.",
      "The climatologist explained that volcanic ash clouds were reflecting incoming solar irradiance to cause atmospheric cooling."
    ],
    answer: "The climatologist explained that volcanic ash clouds reflect incoming solar irradiance to cause atmospheric cooling.",
    hint: "Atmospheric aerosol mechanics are invariable scientific realities exempt from backshifting.",
    solution: "Aerosol solar reflection is an invariant atmospheric reality; the verb 'reflect' remains in the simple present tense without backshifting.",
    target: "Reported Speech: Climatological Fact Exemption"
  },
  {
    passage: "If the municipal public works agency ________ the retaining walls before the monsoon, the highway embankment will withstand erosion.",
    question: "Choose the correct verb form for the First Conditional clause:",
    options: ["reinforces", "will reinforce", "reinforced", "would reinforce"],
    answer: "reinforces",
    hint: "The if-clause of a First Conditional sentence takes the Simple Present tense.",
    solution: "The First Conditional protasis requires the Simple Present ('reinforces'), paired with 'will withstand' in the apodosis.",
    target: "First Conditional: Protasis Present Tense"
  },
  {
    passage: "The traditional goldsmith forged a ceremonial ceremonial execution sword for the palace stool room.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "A ceremonial execution sword was forged by the traditional goldsmith for the palace stool room.",
      "A ceremonial execution sword is forged by the traditional goldsmith for the palace stool room.",
      "A ceremonial execution sword had been forged by the traditional goldsmith for the palace stool room.",
      "A ceremonial execution sword was being forged by the traditional goldsmith for the palace stool room."
    ],
    answer: "A ceremonial execution sword was forged by the traditional goldsmith for the palace stool room.",
    hint: "Simple Past active ('forged') converts to 'was forged'.",
    solution: "Simple Past active ('forged') transforms into [was + Past Participle]: 'was forged'.",
    target: "Passive Voice: Simple Past Transposition"
  },
  {
    passage: "The maritime surveyor said, \"We completed the hydrographic sonar sounding of the harbor basin yesterday.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The maritime surveyor said that they had completed the hydrographic sonar sounding of the harbor basin the day before.",
      "The maritime surveyor said that we completed the hydrographic sonar sounding of the harbor basin yesterday.",
      "The maritime surveyor said that they completed the hydrographic sonar sounding of the harbor basin the day before.",
      "The maritime surveyor said that they had completed the hydrographic sonar sounding of the harbor basin yesterday."
    ],
    answer: "The maritime surveyor said that they had completed the hydrographic sonar sounding of the harbor basin the day before.",
    hint: "Simple Past ('completed') -> Past Perfect ('had completed'); 'we' -> 'they'; 'yesterday' -> 'the day before'.",
    solution: "Simple Past backshifts to Past Perfect ('had completed'), pronoun 'we' becomes 'they', and 'yesterday' becomes 'the day before'.",
    target: "Reported Speech: Past Tense Backshift & Deixis"
  },
  {
    passage: "If the sovereign government ________ state-subsidized fertilizer depots across rural belts, agricultural productivity would surge.",
    question: "Choose the correct verb form for this Second Conditional sentence:",
    options: ["established", "establishes", "will establish", "would establish"],
    answer: "established",
    hint: "Match the hypothetical apodosis ('would surge') with Simple Past in the if-clause.",
    solution: "The Second Conditional requires the Simple Past ('established') in the if-clause to establish an unreal present condition.",
    target: "Second Conditional: Hypothetical Protasis"
  },
  {
    passage: "The senior forensic accountant was auditing the offshore petroleum escrow ledgers when the server was seized.",
    question: "Choose the correct passive voice transformation of the first clause:",
    options: [
      "The offshore petroleum escrow ledgers were being audited by the senior forensic accountant when the server was seized.",
      "The offshore petroleum escrow ledgers was being audited by the senior forensic accountant when the server was seized.",
      "The offshore petroleum escrow ledgers were audited by the senior forensic accountant when the server was seized.",
      "The offshore petroleum escrow ledgers had been audited by the senior forensic accountant when the server was seized."
    ],
    answer: "The offshore petroleum escrow ledgers were being audited by the senior forensic accountant when the server was seized.",
    hint: "'Ledgers' is plural; Past Continuous passive requires 'were being audited'.",
    solution: "Past Continuous active ('was auditing') with a plural patient ('escrow ledgers') transforms into [were + being + Past Participle]: 'were being audited'.",
    target: "Passive Voice: Past Continuous Plural Transposition"
  },
  {
    passage: "The chief geneticist announced, \"Our consortium will publish these recombinant DNA maps next month.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The chief geneticist announced that their consortium would publish those recombinant DNA maps the following month.",
      "The chief geneticist announced that our consortium will publish these recombinant DNA maps next month.",
      "The chief geneticist announced that their consortium would publish these recombinant DNA maps next month.",
      "The chief geneticist announced that their consortium will publish those recombinant DNA maps the following month."
    ],
    answer: "The chief geneticist announced that their consortium would publish those recombinant DNA maps the following month.",
    hint: "'Will' shifts to 'would'; 'our' -> 'their'; 'these' -> 'those'; 'next month' -> 'the following month'.",
    solution: "Modal 'will' shifts to 'would', possessive 'our' becomes 'their', demonstrative 'these' becomes 'those', and 'next month' becomes 'the following month'.",
    target: "Reported Speech: Modal Backshift & Deictic Shift"
  },
  {
    passage: "If you ________ an intense laser beam through a diffraction grating, a coherent interference pattern is formed.",
    question: "Choose the correct verb form for this Zero Conditional optical fact:",
    options: ["pass", "will pass", "passed", "would pass"],
    answer: "pass",
    hint: "Zero Conditionals describe universal optical laws using Simple Present in both clauses.",
    solution: "Zero Conditionals describe universal optical laws using Simple Present: 'If you pass... pattern is formed'.",
    target: "Zero Conditional: Optical Wave Law"
  },
  {
    passage: "The diplomatic courier service has delivered forty classified defense treaties to the presidential secretariat.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "Forty classified defense treaties have been delivered by the diplomatic courier service to the presidential secretariat.",
      "Forty classified defense treaties were delivered by the diplomatic courier service to the presidential secretariat.",
      "Forty classified defense treaties had been delivered by the diplomatic courier service to the presidential secretariat.",
      "Forty classified defense treaties are delivered by the diplomatic courier service to the presidential secretariat."
    ],
    answer: "Forty classified defense treaties have been delivered by the diplomatic courier service to the presidential secretariat.",
    hint: "'Treaties' is plural; Present Perfect passive requires 'have been delivered'.",
    solution: "Present Perfect active ('has delivered') with a plural patient ('forty classified defense treaties') converts to 'have been delivered'.",
    target: "Passive Voice: Present Perfect Plural Transposition"
  },
  {
    passage: "The evolutionary biologist stated, \"Avian species descended from theropod dinosaurian lineages during the Jurassic era.\"",
    question: "Choose the correct reported speech sentence:",
    options: [
      "The evolutionary biologist stated that avian species descended from theropod dinosaurian lineages during the Jurassic era.",
      "The evolutionary biologist stated that avian species had descended from theropod dinosaurian lineages during the Jurassic era.",
      "The evolutionary biologist stated that avian species have descended from theropod dinosaurian lineages during the Jurassic era.",
      "The evolutionary biologist stated that avian species were descending from theropod dinosaurian lineages during the Jurassic era."
    ],
    answer: "The evolutionary biologist stated that avian species descended from theropod dinosaurian lineages during the Jurassic era.",
    hint: "Established historical scientific facts with specific historical periods are typically preserved in Simple Past without further backshift.",
    solution: "Established scientific-historical facts tied to specific geological eras retain the simple past ('descended') in formal academic reported discourse.",
    target: "Reported Speech: Scientific Historical Fact"
  },
  {
    passage: "If the national maritime safety agency ________ the coastal radar beacons, navigational collisions will be averted.",
    question: "Choose the correct verb form for the First Conditional clause:",
    options: ["upgrades", "will upgrade", "upgraded", "would upgrade"],
    answer: "upgrades",
    hint: "The if-clause of a First Conditional sentence takes the Simple Present tense.",
    solution: "The First Conditional protasis requires the Simple Present ('upgrades'), paired with 'will be averted' in the apodosis.",
    target: "First Conditional: Protasis Present Tense"
  },
  {
    passage: "The appellate tribunal overturned the disputed land acquisition judgment yesterday.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "The disputed land acquisition judgment was overturned by the appellate tribunal yesterday.",
      "The disputed land acquisition judgment is overturned by the appellate tribunal yesterday.",
      "The disputed land acquisition judgment had been overturned by the appellate tribunal yesterday.",
      "The disputed land acquisition judgment was being overturned by the appellate tribunal yesterday."
    ],
    answer: "The disputed land acquisition judgment was overturned by the appellate tribunal yesterday.",
    hint: "Simple Past active ('overturned') converts to 'was overturned'.",
    solution: "Simple Past active ('overturned') transforms into [was + Past Participle]: 'was overturned'.",
    target: "Passive Voice: Simple Past Transposition"
  },
  {
    passage: "The petroleum engineer said, \"I can calibrate this automated blowout preventer valve.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The petroleum engineer said that he could calibrate that automated blowout preventer valve.",
      "The petroleum engineer said that he can calibrate this automated blowout preventer valve.",
      "The petroleum engineer said that he could calibrate this automated blowout preventer valve.",
      "The petroleum engineer said that he would calibrate that automated blowout preventer valve."
    ],
    answer: "The petroleum engineer said that he could calibrate that automated blowout preventer valve.",
    hint: "'Can' backshifts to 'could', and 'this' becomes 'that'.",
    solution: "Modal 'can' backshifts to 'could', pronoun 'I' becomes 'he', and demonstrative 'this' shifts to 'that'.",
    target: "Reported Speech: Modal Can & Demonstrative Shift"
  },
  {
    passage: "If the national disease surveillance center ________ adequate genomic sequencers, viral mutations would be tracked in real time.",
    question: "Choose the correct verb form for this Second Conditional sentence:",
    options: ["possessed", "possesses", "will possess", "would possess"],
    answer: "possessed",
    hint: "Pair the hypothetical consequence ('would be tracked') with Simple Past in the if-clause.",
    solution: "The Second Conditional requires the Simple Past ('possessed') in the protasis to express an unreal condition.",
    target: "Second Conditional: Hypothetical Protasis"
  },
  {
    passage: "The port health authority monitors all inbound international container manifests every week.",
    question: "Choose the correct passive voice transformation:",
    options: [
      "All inbound international container manifests are monitored by the port health authority every week.",
      "All inbound international container manifests were monitored by the port health authority every week.",
      "All inbound international container manifests are being monitored by the port health authority every week.",
      "All inbound international container manifests have been monitored by the port health authority every week."
    ],
    answer: "All inbound international container manifests are monitored by the port health authority every week.",
    hint: "'Manifests' is plural; Simple Present passive requires 'are monitored'.",
    solution: "Simple Present active ('monitors') with a plural patient ('manifests') converts to [are + Past Participle]: 'are monitored'.",
    target: "Passive Voice: Simple Present Plural Transposition"
  },
  {
    passage: "The senior state attorney warned the defendants, \"You must disclose these corporate banking ledgers now.\"",
    question: "Choose the correct reported speech transformation:",
    options: [
      "The senior state attorney warned the defendants that they had to disclose those corporate banking ledgers then.",
      "The senior state attorney warned the defendants that they must disclose these corporate banking ledgers now.",
      "The senior state attorney warned the defendants that they would disclose those corporate banking ledgers then.",
      "The senior state attorney warned the defendants that you had to disclose those corporate banking ledgers then."
    ],
    answer: "The senior state attorney warned the defendants that they had to disclose those corporate banking ledgers then.",
    hint: "'Must' expressing obligation becomes 'had to'; 'you' becomes 'they'; 'these' becomes 'those'; 'now' becomes 'then'.",
    solution: "Modal 'must' (obligation) backshifts to 'had to', pronoun 'you' becomes 'they', demonstrative 'these' becomes 'those', and temporal 'now' becomes 'then'.",
    target: "Reported Speech: Modal Must Obligation & Deixis"
  },
  {
    passage: "If you ________ pure copper in an oxidizing flame, it forms a black coating of copper oxide.",
    question: "Choose the correct verb form for this Zero Conditional chemical fact:",
    options: ["heat", "will heat", "heated", "would heat"],
    answer: "heat",
    hint: "Zero Conditionals describe universal combustion facts using Simple Present in both clauses.",
    solution: "Zero Conditionals describe universal oxidation reactions using Simple Present: 'If you heat... it forms'.",
    target: "Zero Conditional: Oxidation Reaction"
  },
  {
    passage: "The engineering crew was repairing the high-pressure gas pipeline when the safety valve tripped.",
    question: "Choose the correct passive voice transformation of the first clause:",
    options: [
      "The high-pressure gas pipeline was being repaired by the engineering crew when the safety valve tripped.",
      "The high-pressure gas pipeline was repaired by the engineering crew when the safety valve tripped.",
      "The high-pressure gas pipeline is being repaired by the engineering crew when the safety valve tripped.",
      "The high-pressure gas pipeline had been repaired by the engineering crew when the safety valve tripped."
    ],
    answer: "The high-pressure gas pipeline was being repaired by the engineering crew when the safety valve tripped.",
    hint: "Past Continuous active ('was repairing') converts to 'was being repaired'.",
    solution: "Past Continuous active ('was repairing') transforms into [was + being + Past Participle]: 'was being repaired'.",
    target: "Passive Voice: Past Continuous Aspect"
  },
  {
    passage: "The materials scientist explained, \"Graphene exhibits electrical conductivity superior to that of purified copper.\"",
    question: "Choose the correct reported speech sentence:",
    options: [
      "The materials scientist explained that graphene exhibits electrical conductivity superior to that of purified copper.",
      "The materials scientist explained that graphene exhibited electrical conductivity superior to that of purified copper.",
      "The materials scientist explained that graphene had exhibited electrical conductivity superior to that of purified copper.",
      "The materials scientist explained that graphene was exhibiting electrical conductivity superior to that of purified copper."
    ],
    answer: "The materials scientist explained that graphene exhibits electrical conductivity superior to that of purified copper.",
    hint: "Invariable material science constants are exempt from backshifting in reported speech.",
    solution: "Material conductivity properties are invariant physical realities; the verb 'exhibits' remains in the simple present tense without backshifting.",
    target: "Reported Speech: Materials Science Constant Exemption"
  },
  {
    passage: "If the national boundary commission ________ the border markers accurately, territorial conflicts will be resolved peacefully.",
    question: "Choose the correct verb form for the First Conditional clause:",
    options: ["demarcates", "will demarcate", "demarcated", "would demarcate"],
    answer: "demarcates",
    hint: "The if-clause of a First Conditional sentence takes the Simple Present tense.",
    solution: "The First Conditional protasis requires the Simple Present ('demarcates'), paired with 'will be resolved' in the apodosis.",
    target: "First Conditional: Protasis Present Tense"
  },
  {
    passage: "The special tactical detachment apprehended the international contraband syndicate before dawn.",
    question: "Choose the correct passive voice transformation of the sentence:",
    options: [
      "The international contraband syndicate was apprehended by the special tactical detachment before dawn.",
      "The international contraband syndicate were apprehended by the special tactical detachment before dawn.",
      "The international contraband syndicate is apprehended by the special tactical detachment before dawn.",
      "The international contraband syndicate had been apprehended by the special tactical detachment before dawn."
    ],
    answer: "The international contraband syndicate was apprehended by the special tactical detachment before dawn.",
    hint: "'Syndicate' is treated as a singular collective patient; Simple Past passive requires 'was apprehended'.",
    solution: "Simple Past active ('apprehended') with a singular patient ('syndicate') converts to [was + Past Participle]: 'was apprehended'.",
    target: "Passive Voice: Simple Past Transposition"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// =========================================================================
const capstone5B8SyntaxConcordAdvancedQuestions = [
  {
    questionNumber: 51,
    question: "In paragraph 1, why is the present tense verb 'expands' retained in the clause 'when atmospheric temperatures rise, oceanic water expands thermally to accelerate coastal flooding'?",
    options: [
      "Because it expresses a Zero Conditional scientific truth where an invariable thermodynamic reality requires the Simple Present in both clauses",
      "Because 'oceanic water' is a plural collective noun that rejects past tense verbs",
      "Because the conference was being held inside an air-conditioned state facility",
      "Because conditional sentences in formal speeches cannot use passive verbs"
    ],
    answer: "Because it expresses a Zero Conditional scientific truth where an invariable thermodynamic reality requires the Simple Present in both clauses",
    hint: "Notice that thermodynamic expansion under heat is an invariant scientific law.",
    solution: "Zero Conditionals describe universal scientific truths using Simple Present. The clause 'oceanic water expands' correctly reflects an invariant thermodynamic law.",
    target: "Capstone Exam: Zero Conditional Scientific Truth"
  },
  {
    questionNumber: 52,
    question: "In paragraph 2, what syntactic voice transformation is demonstrated by the clause 'automated tidal surge barriers were being erected along the maritime littoral by the engineering detachment'?",
    options: [
      "A Past Continuous passive voice construction where the plural patient ('automated tidal surge barriers') is promoted and the action is shown as ongoing in the past",
      "A Present Perfect active voice sentence emphasizing the granite armor quantity",
      "An intransitive verb construction that cannot take a direct object",
      "A subjunctive mood inversion expressing an impossible wish"
    ],
    answer: "A Past Continuous passive voice construction where the plural patient ('automated tidal surge barriers') is promoted and the action is shown as ongoing in the past",
    hint: "Identify the structure [were + being + Past Participle + by + Agent].",
    solution: "The clause illustrates a textbook Past Continuous passive construction: [Plural Patient + were + being + Past Participle (erected) + by + Agent].",
    target: "Capstone Exam: Passive Voice Aspect Analysis"
  },
  {
    questionNumber: 53,
    question: "In paragraph 2, why is the clause 'if the national treasury allocates supplemental infrastructure bonds next season, the marine agency will complete the revetment wall ahead of schedule' grammatically correct under First Conditional rules?",
    options: [
      "Because the if-clause correctly uses the Simple Present ('allocates') instead of 'will allocate' to express a predictive real possibility, matching 'will complete' in the main clause",
      "Because 'next season' requires the Past Continuous tense in both clauses",
      "Because 'infrastructure bonds' is an uncountable noun that demands a modal verb in the if-clause",
      "Because the main clause uses 'would' to indicate an unreal past outcome"
    ],
    answer: "Because the if-clause correctly uses the Simple Present ('allocates') instead of 'will allocate' to express a predictive real possibility, matching 'will complete' in the main clause",
    hint: "Recall the First Conditional Protasis Law regarding modal verbs in the if-clause.",
    solution: "The First Conditional Protasis Law prohibits 'will' in the if-clause. The Simple Present ('allocates') denotes the future condition, paired with 'will complete' in the apodosis.",
    target: "Capstone Exam: First Conditional Protasis Law"
  },
  {
    questionNumber: 54,
    question: "In paragraph 3, which option correctly explains the reported speech transformation of the biochemist's direct statement: \"I am presenting our laboratory findings today to demand statutory enforcement\"?",
    options: [
      "The reporting verb 'stated' triggers backshifting of 'am presenting' to 'was presenting', pronoun 'I' shifts to 'she', possessive 'our' shifts to 'their', and temporal 'today' shifts to 'that day'",
      "The sentence retains 'am presenting' because the findings are still physically in Accra",
      "The sentence converts to 'will present' because enforcement is expected in the future",
      "The sentence changes 'today' to 'yesterday' and uses 'had presented'"
    ],
    answer: "The reporting verb 'stated' triggers backshifting of 'am presenting' to 'was presenting', pronoun 'I' shifts to 'she', possessive 'our' shifts to 'their', and temporal 'today' shifts to 'that day'",
    hint: "Check the tense backshift (Present Continuous -> Past Continuous) and temporal deixis ('today' -> 'that day').",
    solution: "With a past reporting verb ('stated'), Present Continuous shifts to Past Continuous ('was presenting'), first-person 'I' becomes 'she', first-person plural possessive 'our' becomes 'their', and temporal deixis 'today' shifts to 'that day'.",
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

  console.log("Building 55 UNIQUE questions for Basic 8 (JHS 2) Strand 3 Sub-Strand 2 Advanced Lab...");
  const all55Questions = [];

  // 1. Build Questions 1 to 50
  unique50B8SyntaxConcordAdvancedDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B8_S2_A_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B8",
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
      learningCompetency: "B8.3.1.2 / B8.3.2.1 / B8.3.3.1: Demonstrate advanced grammatical mastery of complex passive voice transpositions, multi-tier reported speech backshifts, universal truth exemptions, and closed conditionals (Types 0, 1, 2)."
    });
  });

  // 2. Build Questions 51 to 55
  capstone5B8SyntaxConcordAdvancedQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${b8SyntaxConcordAdvancedCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B8_S2_A_${item.questionNumber}`,
      level: "B8",
      difficulty: "advanced",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: b8SyntaxConcordAdvancedCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B8.3.1.2 / B8.3.2.1 / B8.3.3.1: Synthesize advanced multi-paragraph contextual grammar, evaluating complex passive voice transpositions, reported speech deixis, conditionals, universal truth exemptions, and concise rule summaries."
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
    level: "B8",
    difficulty: "advanced",
    title: "Basic 8 Advanced Lab: 50 Unique Syntax, Voice & Conditional Drills + 5 Capstone Exam Questions",
    totalQuestions: all55Questions.length,
    shortDrillsCount: 50,
    capstoneExamQuestionsCount: 5,
    questions: all55Questions,
    metadata: {
      hasDuplicateQuestions: false,
      uniqueQuestionsCount: 55,
      structure: "50 Unique Short Drills (Complex Passive Voice, Reported Speech, Types 0/1/2 Conditionals) + 5 Capstone Full-Passage Questions",
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
    console.log(`🎯 Populating B8 Advanced for: ${topicId}`);
    console.log(`======================================================`);

    // 1. Write subcollection doc
    const subDocPath = `global_curriculum/jhs/subjects/english/topical/${topicId}/practice_labs/B8_advanced`;
    await db.doc(subDocPath).set(subDocPayload, { merge: true });
    console.log(`   ✅ Wrote subcollection doc: ${subDocPath}`);

    // 2. Update main doc's levels.b8.practicePool.hard across all parent collections
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
          hard: practicePoolQuestions
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

        console.log(`   ✅ Updated main doc pool at: ${mainDocPath} (B8 Hard: ${practicePoolQuestions.length} Qs, Total: ${totalQs})`);
      }
    }
  }

  console.log("\n🎉 Basic 8 (JHS 2) Advanced Lab successfully deployed!");
}

deploy()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("❌ Fatal Error Deploying B8 Advanced Lab:", err);
    process.exit(1);
  });
