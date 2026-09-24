import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

interface LabQuestion {
  id: string;
  level: "B8";
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
// Strand 3 B8 Focus: Complex Cumulative Stacking, Prepositional Particle
// Discrimination, Separability Nuance & Multi-Word Phrasal Idioms
// =========================================================================
const b8GrammarIntermediateCapstonePassage = 
`The regional archaeological museum in Cape Coast recently commissioned the restoration of an invaluable historical archive salvaged from an eighteenth-century trading fort. Resting upon a central pedestal in the exhibition gallery was an astonishing massive antique oval dark-brown Ashanti brass-inlaid document chest that had survived three centuries of coastal humidity. Flanking this centerpiece, the curatorial staff arranged four charming tall modern rectangular jet-black Ghanaian ebony display cabinets designed to house fragile parchment manuscripts.

During the installation of the climate-control units, the senior conservator observed that the electrical dehumidifier was generating excessive mechanical vibration, threatening the glass vitrines. She directed her assistant to turn the humming compressor off before structural damage occurred. Because the junior technician had his hands full of wiring harness clips, he stepped over to the control panel and switched it off with a rubber stylus. The head curator commended his vigilance, reiterating that junior technicians must never look down on rudimentary safety protocols when handling irreplaceable national treasures.

Shortly before the scheduled press preview, the logistics contractor arrived with the remaining consignments of protective silica gel and mounting mounts. However, the transport operations faced an immediate impediment: the contractor's heavy delivery van suffered fuel-line contamination and broke down directly across the entrance ramp, obstructing the security gates. Realizing that the scheduled launch could not proceed under such encumbrance, the executive board resolved to call off the media conference until the following morning.

To compensate for the temporary hiatus, the curatorial team conducted an impromptu workshop on conservation methodology. The senior archivist advised the interns that historical preservation requires technicians who can put up with meticulous documentation routines without complaint. She warned them that the laboratory would run out of archival adhesives unless the supply officer accounted for every used canister. By nightfall, a mobile recovery crane had towed the disabled van away, ensuring that the public exhibition would open without further delays.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Strand 3 B8 Intermediate Competencies:
// 1. Multi-Rank Cumulative Adjective Inversions (4-5 adjective stacks)
// 2. Transitive Separable vs. Inseparable Structural Sorting
// 3. Pronoun Placement in Phrasal Predications with Coordinate Objects
// 4. Idiomatic Semantic Decoding of Triadic Phrasal-Prepositional Verbs
// =========================================================================
const unique50B8GrammarIntermediateDrills = [
  {
    passage: "The royal linguist carried an ________ staff during the state opening of the traditional council.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "elaborate tall antique cylindrical golden ceremonial",
      "tall elaborate cylindrical antique golden ceremonial",
      "ceremonial elaborate tall antique golden cylindrical",
      "antique elaborate tall cylindrical golden ceremonial"
    ],
    answer: "elaborate tall antique cylindrical golden ceremonial",
    hint: "Apply OSASCOMP: Opinion (elaborate) -> Size (tall) -> Age (antique) -> Shape (cylindrical) -> Colour/Material (golden) -> Purpose (ceremonial).",
    solution: "The OSASCOMP hierarchy mandates Opinion ('elaborate'), followed by Size ('tall'), Age ('antique'), Shape ('cylindrical'), Colour/Material ('golden'), and Purpose ('ceremonial'). Zero commas may intervene.",
    target: "Cumulative Adjectives: Multi-Rank Stacking"
  },
  {
    passage: "The classroom fan was rattling loudly against the ceiling joists, so the teacher asked the class prefect to ________.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "switch it off",
      "switch off it",
      "switch out it",
      "switch off them"
    ],
    answer: "switch it off",
    hint: "The direct object is the personal pronoun 'it', which must sit between the verb and the particle.",
    solution: "The Pronoun Movement Law mandates that transitive separable phrasal verbs split when their object is a personal pronoun: 'switch it off'. Placing the particle before the pronoun ('switch off it') is a severe error.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The master weaver exhibited a ________ kente tapestry at the international trade pavilion.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "magnificent broad new multicolored Ashanti silk",
      "Ashanti magnificent broad new multicolored silk",
      "new broad magnificent multicolored silk Ashanti",
      "silk broad new magnificent multicolored Ashanti"
    ],
    answer: "magnificent broad new multicolored Ashanti silk",
    hint: "OSASCOMP order: Opinion (magnificent) -> Size (broad) -> Age (new) -> Colour (multicolored) -> Origin (Ashanti) -> Material (silk).",
    solution: "Opinion ('magnificent') precedes Size ('broad'), Age ('new'), Colour ('multicolored'), Origin ('Ashanti'), and Material ('silk').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The public health directorate resolved to ________ all unauthorized drainage channels discharging chemical waste into the lagoon.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'to permanently eliminate or abolish':",
    options: [
      "do away with",
      "put up with",
      "look down on",
      "run out of"
    ],
    answer: "do away with",
    hint: "'Do away with' is an inseparable triadic idiom meaning to abolish, destroy, or terminate.",
    solution: "The three-part phrasal-prepositional verb 'do away with' idiomatically signifies the complete eradication or abolition of an undesirable element.",
    target: "Phrasal-Prepositional Verbs: Do Away With"
  },
  {
    passage: "The museum conservator unlocked a ________ display vitrine to inspect the ancient parchment.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "splendid heavy antique rectangular brass",
      "brass splendid heavy antique rectangular",
      "rectangular antique heavy splendid brass",
      "heavy splendid antique brass rectangular"
    ],
    answer: "splendid heavy antique rectangular brass",
    hint: "OSASCOMP: Opinion (splendid) -> Size/Weight (heavy) -> Age (antique) -> Shape (rectangular) -> Material (brass).",
    solution: "Opinion ('splendid') comes first, followed by Size/Weight ('heavy'), Age ('antique'), Shape ('rectangular'), and Material ('brass').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "When the auditor discovered the accounting discrepancies, she requested the accountant to ________.",
    question: "Choose the grammatically acceptable construction:",
    options: [
      "clear them up",
      "clear up them",
      "clear out it",
      "clear down them"
    ],
    answer: "clear them up",
    hint: "'Discrepancies' is plural (pronoun 'them'), which must precede the particle 'up'.",
    solution: "'Clear up' is a separable transitive verb. Pronominal direct objects must split the verb and particle: 'clear them up'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The palace guard stood beside an ________ gateway leading to the inner royal sanctuary.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "imposing massive ancient arched stone",
      "stone imposing massive ancient arched",
      "ancient imposing massive stone arched",
      "arched massive imposing ancient stone"
    ],
    answer: "imposing massive ancient arched stone",
    hint: "OSASCOMP: Opinion (imposing) -> Size (massive) -> Age (ancient) -> Shape (arched) -> Material (stone).",
    solution: "Opinion ('imposing') -> Size ('massive') -> Age ('ancient') -> Shape ('arched') -> Material ('stone').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The homicide squad had to ________ several fresh eyewitness leads before submitting their dossier to the state prosecutor.",
    question: "Choose the correct inseparable transitive phrasal verb meaning 'to investigate systematically':",
    options: [
      "look into",
      "look after",
      "look up to",
      "look down on"
    ],
    answer: "look into",
    hint: "'Look into' requires the object to follow the preposition directly; it cannot be split.",
    solution: "'Look into' is an inseparable verb meaning to investigate or examine the underlying facts of a case.",
    target: "Phrasal Verbs: Inseparable Transitive Verbs"
  },
  {
    passage: "The artisan polished a ________ calabash bowl for serving palm wine at the harvest banquet.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "delightful large circular brown Ghanaian",
      "Ghanaian delightful large circular brown",
      "brown delightful large circular Ghanaian",
      "large circular delightful brown Ghanaian"
    ],
    answer: "delightful large circular brown Ghanaian",
    hint: "OSASCOMP: Opinion (delightful) -> Size (large) -> Shape (circular) -> Colour (brown) -> Origin (Ghanaian).",
    solution: "Opinion ('delightful') -> Size ('large') -> Shape ('circular') -> Colour ('brown') -> Origin ('Ghanaian').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The secretary finished typing the confidential circular and immediately ________ to the headmaster.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "handed it over",
      "handed over it",
      "handed out them",
      "handed over them"
    ],
    answer: "handed it over",
    hint: "'Circular' is singular (pronoun 'it'), which must sit between 'handed' and 'over'.",
    solution: "In separable phrasal verbs, pronoun objects must intervene between the base verb and the adverbial particle: 'handed it over'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The foreign delegation presented a ________ vase to the municipal assembly.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "valuable miniature antique conical Chinese porcelain",
      "Chinese miniature antique valuable conical porcelain",
      "porcelain valuable miniature antique conical Chinese",
      "valuable Chinese miniature antique conical porcelain"
    ],
    answer: "valuable miniature antique conical Chinese porcelain",
    hint: "OSASCOMP: Opinion (valuable) -> Size (miniature) -> Age (antique) -> Shape (conical) -> Origin (Chinese) -> Material (porcelain).",
    solution: "Opinion ('valuable') -> Size ('miniature') -> Age ('antique') -> Shape ('conical') -> Origin ('Chinese') -> Material ('porcelain').",
    target: "Cumulative Adjectives: Multi-Rank Stacking"
  },
  {
    passage: "The headmistress warned that she would not ________ any open defiance of the school's prefectorial authority.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'to tolerate or endure patiently':",
    options: [
      "put up with",
      "look down on",
      "run out of",
      "cut down on"
    ],
    answer: "put up with",
    hint: "'Put up with' signifies bearing or tolerating an unpleasant state of affairs.",
    solution: "'Put up with' is an inseparable triadic idiom synonymous with 'tolerate' or 'endure'.",
    target: "Phrasal-Prepositional Verbs: Put Up With"
  },
  {
    passage: "The hunter repaired his ________ leather scabbard before venturing into the forest reserve.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "sturdy long narrow black Nigerian",
      "Nigerian sturdy long narrow black",
      "black sturdy long narrow Nigerian",
      "long narrow sturdy black Nigerian"
    ],
    answer: "sturdy long narrow black Nigerian",
    hint: "OSASCOMP: Opinion (sturdy) -> Size/Length (long) -> Shape/Width (narrow) -> Colour (black) -> Origin (Nigerian).",
    solution: "Opinion ('sturdy') -> Length ('long') -> Shape/Width ('narrow') -> Colour ('black') -> Origin ('Nigerian').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The damp firewood was smoking excessively, so the cook used a wet sack and ________.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "put it out",
      "put out it",
      "put out them",
      "put them out"
    ],
    answer: "put it out",
    hint: "'Fire' is treated as a singular mass/object here, requiring 'it' positioned before 'out'.",
    solution: "The separable phrasal verb 'put out' (meaning extinguish) must be split by the singular pronoun object 'it': 'put it out'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The cabinet minister unveiled a ________ dining suite crafted for the state banquet hall.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "magnificent large modern oval mahogany",
      "mahogany modern magnificent large oval",
      "large oval modern magnificent mahogany",
      "magnificent modern large mahogany oval"
    ],
    answer: "magnificent large modern oval mahogany",
    hint: "OSASCOMP: Opinion (magnificent) -> Size (large) -> Age (modern) -> Shape (oval) -> Material (mahogany).",
    solution: "Opinion ('magnificent') -> Size ('large') -> Age ('modern') -> Shape ('oval') -> Material ('mahogany').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The electrical generator ________ in the middle of the surgical procedure, triggering the auxiliary battery bank.",
    question: "Choose the correct intransitive phrasal verb meaning 'abruptly ceased operating':",
    options: [
      "broke down",
      "broke in",
      "broke off",
      "broke through"
    ],
    answer: "broke down",
    hint: "Mechanical units that fail spontaneously are said to...",
    solution: "'Break down' is an intransitive phrasal verb denoting the unexpected mechanical cessation of a device.",
    target: "Phrasal Verbs: Intransitive Verbs"
  },
  {
    passage: "The botanical researcher collected specimens in a ________ specimen jar.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "neat small cylindrical transparent glass",
      "glass small cylindrical neat transparent",
      "transparent neat small cylindrical glass",
      "cylindrical neat small glass transparent"
    ],
    answer: "neat small cylindrical transparent glass",
    hint: "OSASCOMP: Opinion (neat) -> Size (small) -> Shape (cylindrical) -> Colour/Clarity (transparent) -> Material (glass).",
    solution: "Opinion ('neat') precedes Size ('small'), Shape ('cylindrical'), Clarity/Colour ('transparent'), and Material ('glass').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The old library cards had become brittle and illegible, so the librarian ________ and filed the new microfiches.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "threw them away",
      "threw away them",
      "threw it away",
      "threw away it"
    ],
    answer: "threw them away",
    hint: "'Cards' is plural, requiring 'them' positioned between 'threw' and 'away'.",
    solution: "Transitive separable verbs require pronominal direct objects to precede the adverbial particle: 'threw them away'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The goldsmith hammered a ________ bracelet to adorn the paramount chief's wrist.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "striking heavy antique circular gold",
      "gold antique striking heavy circular",
      "circular striking heavy antique gold",
      "heavy striking circular antique gold"
    ],
    answer: "striking heavy antique circular gold",
    hint: "OSASCOMP: Opinion (striking) -> Weight/Size (heavy) -> Age (antique) -> Shape (circular) -> Material (gold).",
    solution: "Opinion ('striking') -> Size/Weight ('heavy') -> Age ('antique') -> Shape ('circular') -> Material ('gold').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "Because the student lacked formal qualifications, the arrogant senior clerks were prone to ________ his contributions.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'to treat with contempt':",
    options: [
      "look down on",
      "look forward to",
      "run out of",
      "put up with"
    ],
    answer: "look down on",
    hint: "'Look down on' expresses social disdain or condescension.",
    solution: "'Look down on' is an inseparable triadic verb signifying arrogant condescension or contempt.",
    target: "Phrasal-Prepositional Verbs: Look Down On"
  },
  {
    passage: "The forest guards patrolled the boundary in an ________ cross-country vehicle.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "efficient sturdy new olive-green Japanese",
      "Japanese olive-green new sturdy efficient",
      "new efficient sturdy olive-green Japanese",
      "olive-green sturdy efficient new Japanese"
    ],
    answer: "efficient sturdy new olive-green Japanese",
    hint: "OSASCOMP: Opinion (efficient sturdy) -> Age (new) -> Colour (olive-green) -> Origin (Japanese).",
    solution: "Opinion adjectives ('efficient sturdy') precede Age ('new'), followed by Colour ('olive-green') and Origin ('Japanese').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The boy spilled water over the examination guidelines, so the supervisor instructed him to ________ before continuing.",
    question: "Choose the grammatically correct construction:",
    options: [
      "dry them off",
      "dry off them",
      "dry it off",
      "dry off it"
    ],
    answer: "dry them off",
    hint: "'Guidelines' is plural, requiring 'them' splitting 'dry' and 'off'.",
    solution: "'Guidelines' is a plural count noun replaced by 'them'; the pronoun must precede the particle 'off': 'dry them off'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The palace courtyard featured a ________ fountain carved from single granite blocks.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "magnificent tall modern octagonal stone",
      "stone magnificent tall modern octagonal",
      "modern octagonal magnificent tall stone",
      "tall octagonal modern magnificent stone"
    ],
    answer: "magnificent tall modern octagonal stone",
    hint: "OSASCOMP: Opinion (magnificent) -> Size (tall) -> Age (modern) -> Shape (octagonal) -> Material (stone).",
    solution: "Opinion ('magnificent') -> Size ('tall') -> Age ('modern') -> Shape ('octagonal') -> Material ('stone').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The municipal hospital nearly ________ anaesthetic supplies during the prolonged border blockade.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'exhausted the available inventory':",
    options: [
      "ran out of",
      "put up with",
      "looked down on",
      "cut back to"
    ],
    answer: "ran out of",
    hint: "'Run out of' denotes the complete exhaustion of an inventory or resource.",
    solution: "The three-part verb 'run out of' idiomatically means to completely deplete a supply or store of a necessary commodity.",
    target: "Phrasal-Prepositional Verbs: Run Out Of"
  },
  {
    passage: "The seamstress designed a ________ dress for the independence anniversary ball.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "gorgeous flowing new crimson silk",
      "silk crimson new flowing gorgeous",
      "crimson new gorgeous flowing silk",
      "flowing gorgeous new silk crimson"
    ],
    answer: "gorgeous flowing new crimson silk",
    hint: "OSASCOMP: Opinion (gorgeous) -> Shape/Style (flowing) -> Age (new) -> Colour (crimson) -> Material (silk).",
    solution: "Opinion ('gorgeous') precedes Physical Style/Shape ('flowing'), Age ('new'), Colour ('crimson'), and Material ('silk').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The teacher noticed several spelling errors in the student's chalkboard summary and told her to ________.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "rub them out",
      "rub out them",
      "rub out it",
      "rub it out"
    ],
    answer: "rub them out",
    hint: "'Errors' is plural (pronoun 'them'), which must sit between 'rub' and 'out'.",
    solution: "The plural pronoun 'them' must sit between the base verb 'rub' and the particle 'out': 'rub them out'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The museum archives preserved a ________ manuscript containing early missionary correspondence.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "fascinating fragile century-old rectangular paper",
      "paper century-old fascinating fragile rectangular",
      "century-old fascinating rectangular fragile paper",
      "rectangular fragile fascinating century-old paper"
    ],
    answer: "fascinating fragile century-old rectangular paper",
    hint: "OSASCOMP: Opinion (fascinating fragile) -> Age (century-old) -> Shape (rectangular) -> Material (paper).",
    solution: "Opinion adjectives ('fascinating fragile') precede Age ('century-old'), Shape ('rectangular'), and Material ('paper').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "Due to a severe budget deficit, the regional sports authority had to ________ training allowances for junior coaches.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'to curtail or reduce expenditures':",
    options: [
      "cut down on",
      "put up with",
      "look down on",
      "run out of"
    ],
    answer: "cut down on",
    hint: "'Cut down on' means to reduce or curtail consumption or expenditure.",
    solution: "'Cut down on' is an inseparable triadic idiom meaning to retrench, diminish, or reduce expenditure/consumption.",
    target: "Phrasal-Prepositional Verbs: Cut Down On"
  },
  {
    passage: "The agricultural cooperative purchased an ________ processing plant to mill parboiled rice.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "expensive massive modern Indian industrial",
      "Indian modern expensive massive industrial",
      "industrial modern expensive Indian massive",
      "massive expensive Indian modern industrial"
    ],
    answer: "expensive massive modern Indian industrial",
    hint: "OSASCOMP: Opinion (expensive) -> Size (massive) -> Age (modern) -> Origin (Indian) -> Purpose (industrial).",
    solution: "Opinion ('expensive') -> Size ('massive') -> Age ('modern') -> Origin ('Indian') -> Purpose ('industrial').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "Before returning the library textbooks to the counter, the students ________ into their respective book bags.",
    question: "Choose the grammatically correct construction:",
    options: [
      "packed them up",
      "packed up them",
      "packed it up",
      "packed up it"
    ],
    answer: "packed them up",
    hint: "'Textbooks' is plural (pronoun 'them'), which must sit between 'packed' and 'up'.",
    solution: "The plural pronoun 'them' must intervene between the verb 'packed' and the particle 'up': 'packed them up'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The chief hunter brandished a ________ spear adorned with cowrie shells.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "formidable long antique pointed iron",
      "iron pointed long antique formidable",
      "pointed long iron antique formidable",
      "antique long formidable pointed iron"
    ],
    answer: "formidable long antique pointed iron",
    hint: "OSASCOMP: Opinion (formidable) -> Size (long) -> Age (antique) -> Shape (pointed) -> Material (iron).",
    solution: "Opinion ('formidable') precedes Size ('long'), Age ('antique'), Shape ('pointed'), and Material ('iron').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The state prosecutor determined to ________ the suspect's claim of an alibi with telephone cell-tower records.",
    question: "Choose the correct inseparable phrasal verb meaning 'to verify through thorough checking':",
    options: [
      "check up on",
      "look down on",
      "give up on",
      "put up with"
    ],
    answer: "check up on",
    hint: "'Check up on' means to investigate or verify the veracity of a person or claim.",
    solution: "'Check up on' is an inseparable three-part verb meaning to examine, inspect, or verify records or alibis.",
    target: "Phrasal-Prepositional Verbs: Check Up On"
  },
  {
    passage: "The laboratory was equipped with an ________ optical microscope.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "exceptional compact new German precision",
      "German compact new exceptional precision",
      "new compact precision exceptional German",
      "precision exceptional compact German new"
    ],
    answer: "exceptional compact new German precision",
    hint: "OSASCOMP: Opinion (exceptional) -> Size (compact) -> Age (new) -> Origin (German) -> Purpose/Type (precision).",
    solution: "Opinion ('exceptional') -> Size ('compact') -> Age ('new') -> Origin ('German') -> Purpose/Type ('precision').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The junior typist accidentally deleted the master file, but the network administrator managed to ________ from the backup cloud.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "bring it back",
      "bring back it",
      "bring them back",
      "bring back them"
    ],
    answer: "bring it back",
    hint: "'File' is singular (pronoun 'it'), which must precede the particle 'back'.",
    solution: "The singular pronoun 'it' must separate the verb 'bring' and the particle 'back': 'bring it back'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The village council convened under an ________ tree in the centre of the town square.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "extraordinary giant ancient spreading baobab",
      "baobab giant ancient extraordinary spreading",
      "ancient spreading giant extraordinary baobab",
      "spreading ancient extraordinary giant baobab"
    ],
    answer: "extraordinary giant ancient spreading baobab",
    hint: "OSASCOMP: Opinion (extraordinary) -> Size (giant) -> Age (ancient) -> Shape/Form (spreading) before the noun head.",
    solution: "Opinion ('extraordinary') precedes Size ('giant'), Age ('ancient'), and Shape/Form ('spreading').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "After months of rigorous physical therapy, the injured sprinter managed to ________ his training squad.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'to attain the same level as':",
    options: [
      "catch up with",
      "look down on",
      "run out of",
      "put up with"
    ],
    answer: "catch up with",
    hint: "'Catch up with' means to reach parity after trailing behind.",
    solution: "'Catch up with' is an inseparable triadic idiom meaning to reach the same level, speed, or standard as others.",
    target: "Phrasal-Prepositional Verbs: Catch Up With"
  },
  {
    passage: "The royal treasury preserved an ________ ceremonial sword with a carved ivory pommel.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "exquisite short curved gold",
      "gold short curved exquisite",
      "curved short exquisite gold",
      "exquisite gold short curved"
    ],
    answer: "exquisite short curved gold",
    hint: "OSASCOMP: Opinion (exquisite) -> Size (short) -> Shape (curved) -> Material (gold).",
    solution: "Opinion ('exquisite') -> Size ('short') -> Shape ('curved') -> Material ('gold').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The flood waters swept away the footbridge, so the villagers had to ________ before the next market day.",
    question: "Choose the grammatically correct construction:",
    options: [
      "build it up",
      "build up it",
      "build them up",
      "build up them"
    ],
    answer: "build it up",
    hint: "'Footbridge' is singular (pronoun 'it'), which must precede the particle 'up'.",
    solution: "The singular pronoun 'it' must sit between the verb and particle in separable constructions: 'build it up'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The trader displayed a ________ rug on the showroom platform.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "luxurious large circular scarlet Persian",
      "Persian large circular luxurious scarlet",
      "circular scarlet large luxurious Persian",
      "luxurious Persian large circular scarlet"
    ],
    answer: "luxurious large circular scarlet Persian",
    hint: "OSASCOMP: Opinion (luxurious) -> Size (large) -> Shape (circular) -> Colour (scarlet) -> Origin (Persian).",
    solution: "Opinion ('luxurious') -> Size ('large') -> Shape ('circular') -> Colour ('scarlet') -> Origin ('Persian').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The candidate refused to ________ to intimidation from rival political activists.",
    question: "Choose the correct intransitive phrasal verb meaning 'to succumb or surrender':",
    options: [
      "give in",
      "give out",
      "give off",
      "give over"
    ],
    answer: "give in",
    hint: "'Give in' means to surrender or yield under pressure.",
    solution: "'Give in' is an intransitive phrasal verb meaning to capitulate, yield, or surrender to external demands.",
    target: "Phrasal Verbs: Intransitive Verbs"
  },
  {
    passage: "The military engineers erected a ________ watchtower along the sensitive frontier.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "formidable tall new hexagonal steel",
      "steel tall new formidable hexagonal",
      "hexagonal formidable new steel tall",
      "tall steel new formidable hexagonal"
    ],
    answer: "formidable tall new hexagonal steel",
    hint: "OSASCOMP: Opinion (formidable) -> Size (tall) -> Age (new) -> Shape (hexagonal) -> Material (steel).",
    solution: "Opinion ('formidable') -> Size ('tall') -> Age ('new') -> Shape ('hexagonal') -> Material ('steel').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The security cameras captured the suspect's license plate, but the computer glitched before the officer could ________.",
    question: "Choose the grammatically correct construction:",
    options: [
      "note it down",
      "note down it",
      "note down them",
      "note them down"
    ],
    answer: "note it down",
    hint: "'License plate' is singular (pronoun 'it'), which must sit between 'note' and 'down'.",
    solution: "In separable phrasal verbs, the pronoun 'it' must precede the adverbial particle: 'note it down'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The traditional carver manufactured a ________ mortar for pounding fufu.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "heavy deep cylindrical wooden",
      "wooden deep heavy cylindrical",
      "cylindrical heavy wooden deep",
      "deep cylindrical wooden heavy"
    ],
    answer: "heavy deep cylindrical wooden",
    hint: "OSASCOMP: Opinion/Weight (heavy) -> Depth/Size (deep) -> Shape (cylindrical) -> Material (wooden).",
    solution: "Weight/Opinion ('heavy') precedes Depth/Size ('deep'), Shape ('cylindrical'), and Material ('wooden').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "Young scholars are traditionally encouraged to ________ elder stateswomen who have distinguished themselves in public service.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'to admire and respect deeply':",
    options: [
      "look up to",
      "look down on",
      "put up with",
      "run out of"
    ],
    answer: "look up to",
    hint: "'Look up to' means to regard with reverence and admiration.",
    solution: "'Look up to' is an inseparable triadic idiom signifying deep respect and admiration for a role model.",
    target: "Phrasal-Prepositional Verbs: Look Up To"
  },
  {
    passage: "The interior decorator selected an ________ chandelier for the grand ballroom.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "opulent massive antique circular crystal",
      "crystal opulent massive antique circular",
      "circular massive opulent antique crystal",
      "antique circular crystal massive opulent"
    ],
    answer: "opulent massive antique circular crystal",
    hint: "OSASCOMP: Opinion (opulent) -> Size (massive) -> Age (antique) -> Shape (circular) -> Material (crystal).",
    solution: "Opinion ('opulent') precedes Size ('massive'), Age ('antique'), Shape ('circular'), and Material ('crystal').",
    target: "Cumulative Adjectives: Multi-Rank Stacking"
  },
  {
    passage: "The laboratory glassware was contaminated with bacteria, so the technician ________ in the autoclave.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "boiled it out",
      "boiled out it",
      "boiled out them",
      "boiled down them"
    ],
    answer: "boiled it out",
    hint: "'Glassware' is treated as a collective singular non-count mass noun, requiring 'it' preceding 'out'.",
    solution: "'Glassware' is non-count and pronominalized as 'it'; the pronoun must sit between 'boiled' and 'out': 'boiled it out'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The estate developer designed an ________ residential complex near the oceanfront.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "impressive sprawling modern multi-storey concrete",
      "concrete modern impressive sprawling multi-storey",
      "multi-storey modern concrete sprawling impressive",
      "modern concrete impressive sprawling multi-storey"
    ],
    answer: "impressive sprawling modern multi-storey concrete",
    hint: "OSASCOMP: Opinion (impressive) -> Size (sprawling) -> Age (modern) -> Structural Form (multi-storey) -> Material (concrete).",
    solution: "Opinion ('impressive') -> Size ('sprawling') -> Age ('modern') -> Form ('multi-storey') -> Material ('concrete').",
    target: "Cumulative Adjectives: Multi-Rank Stacking"
  },
  {
    passage: "The witness began to recount the horrific armed robbery, but broke down and could not ________ with her testimony.",
    question: "Choose the correct phrasal verb meaning 'to proceed or continue':",
    options: [
      "go on",
      "go off",
      "go through",
      "go by"
    ],
    answer: "go on",
    hint: "'Go on' functions as a phrasal verb meaning to proceed or continue speaking.",
    solution: "'Go on' is an intransitive phrasal verb synonymous with 'continue' or 'proceed'.",
    target: "Phrasal Verbs: Semantic Identification"
  },
  {
    passage: "The palace historian displayed a ________ manuscript chest preserved in the stool room.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "magnificent compact antique square cedar",
      "cedar compact magnificent antique square",
      "square antique magnificent compact cedar",
      "antique square compact cedar magnificent"
    ],
    answer: "magnificent compact antique square cedar",
    hint: "OSASCOMP: Opinion (magnificent) -> Size (compact) -> Age (antique) -> Shape (square) -> Material (cedar).",
    solution: "Opinion ('magnificent') -> Size ('compact') -> Age ('antique') -> Shape ('square') -> Material ('cedar').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The headmaster drafted the revised examination timetable and asked the clerk to ________ on the noticeboard.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "pin it up",
      "pin up it",
      "pin up them",
      "pin out it"
    ],
    answer: "pin it up",
    hint: "'Timetable' is singular (pronoun 'it'), which must precede the particle 'up'.",
    solution: "The singular personal pronoun 'it' must intervene between the verb 'pin' and the particle 'up': 'pin it up'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// Strand 3 B8 Focus: OSASCOMP Adjective Hierarchy & Phrasal Verbs
// =========================================================================
const capstone5B8GrammarIntermediateQuestions = [
  {
    questionNumber: 51,
    question: "In paragraph 1, how does the phrase 'an astonishing massive antique oval dark-brown Ashanti brass-inlaid document chest' adhere to the OSASCOMP cumulative adjective rule?",
    options: [
      "It rigorously observes OSASCOMP order: Opinion, Size, Age, Shape, Colour, Origin, Material, Purpose/Type without commas",
      "It arranges adjectives alphabetically to satisfy formal cataloguing standards",
      "It relies on coordinate adjectives that should each be separated by semicolons",
      "It places material before age and origin before shape"
    ],
    answer: "It rigorously observes OSASCOMP order: Opinion, Size, Age, Shape, Colour, Origin, Material, Purpose/Type without commas",
    hint: "Check the order of modifiers: astonishing (Opinion), massive (Size), antique (Age), oval (Shape), dark-brown (Colour), Ashanti (Origin), brass-inlaid (Material), document (Type/Purpose).",
    solution: "The phrase represents a complete 8-tier realization of the OSASCOMP hierarchy: Opinion -> Size -> Age -> Shape -> Colour -> Origin -> Material -> Type/Purpose without commas.",
    target: "Capstone Exam: Complex OSASCOMP Stacking"
  },
  {
    questionNumber: 52,
    question: "In paragraph 2, why is the construction 'switched it off' used instead of 'switched off it' when the technician manipulates the control panel?",
    options: [
      "Because the Pronoun Movement Law dictates that a pronoun direct object ('it') must split a transitive separable phrasal verb",
      "Because 'off' is a preposition governing the objective noun 'panel'",
      "Because 'switched off' is an intransitive verb phrase that cannot take a complement",
      "Because 'it' refers to the technician rather than the compressor"
    ],
    answer: "Because the Pronoun Movement Law dictates that a pronoun direct object ('it') must split a transitive separable phrasal verb",
    hint: "Recall the structural rule that governs separable phrasal verbs when the object is pronominal.",
    solution: "Transitive separable verbs like 'switch off' must place personal pronoun direct objects ('it') between the verb stem and the particle: 'switched it off'.",
    target: "Capstone Exam: Pronoun Movement Law"
  },
  {
    questionNumber: 53,
    question: "In paragraph 3, what syntactic classification applies to the multi-word verb 'broke down' in the clause 'suffered fuel-line contamination and broke down directly across the entrance ramp'?",
    options: [
      "An intransitive phrasal verb expressing mechanical failure, taking no direct object",
      "A transitive separable phrasal verb taking 'fuel-line' as its object",
      "A three-part phrasal-prepositional verb governing 'entrance ramp'",
      "A copular linking verb followed by an adverbial predicate"
    ],
    answer: "An intransitive phrasal verb expressing mechanical failure, taking no direct object",
    hint: "Determine whether 'broke down' transfers action to an object noun phrase or functions independently.",
    solution: "'Break down' functions intransitively: it expresses the complete mechanical failure of the van without taking a direct nominal object.",
    target: "Capstone Exam: Phrasal Verb Classification"
  },
  {
    questionNumber: 54,
    question: "In paragraph 4, what is the meaning and grammatical structure of the phrase 'put up with meticulous documentation routines'?",
    options: [
      "A three-part phrasal-prepositional verb meaning to tolerate or endure demanding procedures patiently",
      "A separable phrasal verb meaning to file documents in an overhead cabinet",
      "An intransitive verb phrase meaning to terminate research operations",
      "A passive participle modifying the archivist"
    ],
    answer: "A three-part phrasal-prepositional verb meaning to tolerate or endure demanding procedures patiently",
    hint: "Identify the triadic composition (Verb + Particle + Preposition) and its idiomatic sense of tolerance.",
    solution: "'Put up with' is a classic three-part phrasal-prepositional verb (Verb: put + Particle: up + Preposition: with) meaning to endure or tolerate without complaint.",
    target: "Capstone Exam: Phrasal-Prepositional Verbs"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the punctuation rule for cumulative adjectives in paragraph 1.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Cumulative adjectives must never take separating commas.",
      "Because adjectives stack cumulatively before nouns, they should not be written with commas.",
      "Never separate cumulative adjectives with commas in English sentences.",
      "No commas allowed."
    ],
    answer: "Cumulative adjectives must never take separating commas.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Cumulative adjectives must never take separating commas' is exactly 7 words, forms a complete grammatical sentence, and articulates the zero-comma rule precisely. Option C is an imperative instruction, Option B has 12 words, and Option D is a phrase.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployStrand3B8Intermediate() {
  console.log("Building 55 UNIQUE questions for Basic 8 (JHS 2) Strand 3 Grammar Intermediate Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B8GrammarIntermediateDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B8_G_I_${qNum < 10 ? "0" + qNum : qNum}`,
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
      learningCompetency: "B8.3.1.1: Demonstrate intermediate grammatical mastery of cumulative adjective sequences (OSASCOMP), transitive separable phrasal verb movement, intransitive verbal idioms, and three-part phrasal-prepositional structures."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B8GrammarIntermediateQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${b8GrammarIntermediateCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B8_G_I_${item.questionNumber}`,
      level: "B8",
      difficulty: "intermediate",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: b8GrammarIntermediateCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B8.3.1.1 / B8.3.1.2: Synthesize multi-paragraph contextual grammar, evaluating high-rank cumulative adjective stacking without commas, phrasal particle distribution laws, and concise rule summaries."
    });
  });

  // 3. Write directly to Firestore using the unified canonical topic path
  const targetDoc = db.doc(
    "global_curriculum/jhs/subjects/english/topical/grammar_lexis_prepositions_and_phrasal_verbs/practice_labs/B8_intermediate"
  );

  await targetDoc.set({
    level: "B8",
    difficulty: "intermediate",
    title: "Basic 8 Intermediate Lab: 50 Unique Grammar Drills + 5 Capstone Exam Questions",
    totalQuestions: all55Questions.length,
    shortDrillsCount: 50,
    capstoneExamQuestionsCount: 5,
    questions: all55Questions,
    metadata: {
      hasDuplicateQuestions: false,
      uniqueQuestionsCount: 55,
      structure: "50 Unique Short Drills (OSASCOMP Stacking, Pronoun Movement Law, Triadic Idioms) + 5 Capstone Full-Passage Questions",
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

deployStrand3B8Intermediate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 3 B8 Intermediate Lab:", err);
    process.exit(1);
  });
