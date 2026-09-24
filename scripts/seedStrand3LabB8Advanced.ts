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
// Strand 3 B8 Advanced Focus: Multi-Tier OSASCOMP Stacking (Full 8-Tier),
// Pronoun Movement Law in Complex Coordinate Structures, Triadic Phrasal-
// Prepositional Verbs & Zero-Comma Rule Verification
// =========================================================================
const b8GrammarAdvancedCapstonePassage = 
`The Ministry of Tourism, Arts and Culture recently unveiled the restored regalia chamber at the Manhyia Palace Museum in Kumasi. Occupying the central granite dais was an awe-inspiring massive antique circular jet-black Ghanaian bronze-cast ceremonial state stool that had been sanctified by royal ancestral priests over two centuries ago. The gleaming metal exhibited intricate zoomorphic engravings that captivated every visiting diplomat. To complement this sovereign centerpiece, master craftsmen arranged eight magnificent tall modern rectangular dark-brown Ashanti mahogany council chairs upholstered in ceremonial crimson velvet.

During the preliminary testing of the environmental security apparatus, the chief conservator observed that the industrial dehumidifier was discharging excessive acoustic reverberation, threatening to shatter the antique glass vitrines. She immediately instructed her technical apprentice to turn the vibrating compressor down before harmonic resonance damaged the historical relics. Because the young technician had both hands occupied holding a fragile padded support bracket, he stepped toward the wall console and switched it off with his elbow. The director-general commended the rapid intervention, noting that museum personnel must never look down on rudimentary safety regulations when handling irreplaceable cultural heritage.

Shortly before the formal arrival of foreign emissaries, the municipal transport convoy arrived with the secondary consignments of climate-controlled display cases. However, the logistical deployment suffered an acute impediment: the heavy articulated flatbed hauler developed an abrupt hydraulic breach and broke down directly across the palace gates, barricading the royal avenue. Recognizing that the state ceremonial procession could not proceed under such physical obstruction, the executive planning committee resolved to call off the afternoon press preview until an army recovery vehicle cleared the entrance.

To utilize the involuntary operational hiatus productively, the curatorial board convened an intensive symposium on material conservation standards. The senior archivist reminded the curatorial fellows that historical custodianship demands professionals who can put up with rigorous cataloguing protocols without compromise. She cautioned the workshop that the restoration laboratory would run out of imported archival solvent unless inventory officers accounted for every milliliter. By twilight, municipal engineers had towed the disabled transporter away, allowing the historic exhibition to open on schedule with unimpeachable institutional elegance.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Strand 3 B8 Advanced Competencies:
// 1. Full 5-to-8 Tier OSASCOMP Adjective Sequences with Zero-Comma Enforcement
// 2. Transitive Separable vs. Inseparable Structural Sorting
// 3. Pronoun Movement Law with Pronominal Objects in Embedded Clauses
// 4. Advanced Three-Part Phrasal-Prepositional Verbs & Lexical Inversions
// =========================================================================
const unique50B8GrammarAdvancedDrills = [
  {
    passage: "The diplomatic corps admired the ________ state banquet table in the newly commissioned presidential villa.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "magnificent large modern oval dark-brown Ghanaian mahogany dining",
      "Ghanaian magnificent large modern oval dark-brown mahogany dining",
      "modern large magnificent dark-brown oval Ghanaian mahogany dining",
      "magnificent oval large dark-brown modern Ghanaian dining mahogany"
    ],
    answer: "magnificent large modern oval dark-brown Ghanaian mahogany dining",
    hint: "Apply full OSASCOMP: Opinion (magnificent) -> Size (large) -> Age (modern) -> Shape (oval) -> Colour (dark-brown) -> Origin (Ghanaian) -> Material (mahogany) -> Purpose (dining).",
    solution: "The OSASCOMP hierarchy mandates Opinion ('magnificent'), Size ('large'), Age ('modern'), Shape ('oval'), Colour ('dark-brown'), Origin ('Ghanaian'), Material ('mahogany'), and Purpose ('dining'). Zero commas are permitted.",
    target: "Cumulative Adjectives: Full-Scale OSASCOMP Stacking"
  },
  {
    passage: "The surveillance drone was emitting a high-frequency whistle over the airfield, so the flight controller instructed the radar operator to ________ immediately.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "shut it down",
      "shut down it",
      "shut down them",
      "shut them down it"
    ],
    answer: "shut it down",
    hint: "The direct object is the singular pronoun 'it', which must sit between the verb and the particle.",
    solution: "The Pronoun Movement Law mandates that transitive separable phrasal verbs split when their direct object is a personal pronoun: 'shut it down'. Placing the particle before the pronoun ('shut down it') is ungrammatical.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The master jeweler fashioned an ________ pectoral disc for the paramount chief's coronation durbar.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "astonishing broad antique circular golden Ashanti ceremonial",
      "Ashanti astonishing broad antique circular golden ceremonial",
      "golden broad antique astonishing circular Ashanti ceremonial",
      "astonishing golden broad circular antique Ashanti ceremonial"
    ],
    answer: "astonishing broad antique circular golden Ashanti ceremonial",
    hint: "OSASCOMP order: Opinion (astonishing) -> Size (broad) -> Age (antique) -> Shape (circular) -> Colour/Material (golden) -> Origin (Ashanti) -> Purpose (ceremonial).",
    solution: "Opinion ('astonishing') precedes Size ('broad'), Age ('antique'), Shape ('circular'), Colour/Material ('golden'), Origin ('Ashanti'), and Purpose ('ceremonial').",
    target: "Cumulative Adjectives: Complex Stacking"
  },
  {
    passage: "The judicial council resolved to ________ all antiquated colonial statutory enactments that infringed on fundamental human rights.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'to officially abolish or eliminate':",
    options: [
      "do away with",
      "put up with",
      "look down on",
      "run out of"
    ],
    answer: "do away with",
    hint: "'Do away with' is an inseparable triadic idiom signifying total abolition.",
    solution: "The three-part verb 'do away with' idiomatically means to abolish, repeal, or eliminate obsolete statutory laws.",
    target: "Phrasal-Prepositional Verbs: Do Away With"
  },
  {
    passage: "The naval architect inspected a ________ bulkhead reinforcing the warship's hull.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "formidable massive new curved steel marine",
      "steel massive new formidable curved marine",
      "marine formidable massive curved new steel",
      "curved massive formidable new steel marine"
    ],
    answer: "formidable massive new curved steel marine",
    hint: "OSASCOMP: Opinion (formidable) -> Size (massive) -> Age (new) -> Shape (curved) -> Material (steel) -> Purpose (marine).",
    solution: "Opinion ('formidable') precedes Size ('massive'), Age ('new'), Shape ('curved'), Material ('steel'), and Purpose ('marine').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The audit revealed extensive data corruption in the ledger files, compelling the systems administrator to ________ from the off-site server.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "restore them back",
      "restore back them",
      "bring them back",
      "bring back them"
    ],
    answer: "bring them back",
    hint: "'Files' is plural (pronoun 'them'), which must intervene between 'bring' and 'back'.",
    solution: "With separable transitive phrasal verbs ('bring back'), the pronoun direct object ('them') must precede the adverbial particle: 'bring them back'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The museum conservator unlocked a ________ reliquary box containing ancient gold dust.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "priceless small antique rectangular bronze Ashanti",
      "Ashanti priceless small antique rectangular bronze",
      "bronze priceless small rectangular antique Ashanti",
      "antique small priceless rectangular bronze Ashanti"
    ],
    answer: "priceless small antique rectangular bronze Ashanti",
    hint: "OSASCOMP: Opinion (priceless) -> Size (small) -> Age (antique) -> Shape (rectangular) -> Material (bronze) -> Origin (Ashanti).",
    solution: "Opinion ('priceless') leads the sequence, followed by Size ('small'), Age ('antique'), Shape ('rectangular'), Material ('bronze'), and Origin ('Ashanti').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The parliamentary intelligence committee was tasked to ________ allegations of covert electoral interference.",
    question: "Choose the correct inseparable transitive phrasal verb meaning 'to investigate systematically':",
    options: [
      "look into",
      "look after",
      "look down on",
      "look up to"
    ],
    answer: "look into",
    hint: "'Look into' is an inseparable verb governing an object directly; it cannot be split.",
    solution: "'Look into' is an inseparable phrasal verb meaning to investigate, probe, or systematically examine the facts of a matter.",
    target: "Phrasal Verbs: Inseparable Transitive Verbs"
  },
  {
    passage: "The ceremonial guard held an ________ shield during the royal funeral dirge.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "imposing broad antique convex buffalo-hide ceremonial",
      "buffalo-hide imposing broad convex antique ceremonial",
      "ceremonial imposing broad antique convex buffalo-hide",
      "broad imposing convex antique buffalo-hide ceremonial"
    ],
    answer: "imposing broad antique convex buffalo-hide ceremonial",
    hint: "OSASCOMP: Opinion (imposing) -> Size (broad) -> Age (antique) -> Shape (convex) -> Material (buffalo-hide) -> Purpose (ceremonial).",
    solution: "Opinion ('imposing') -> Size ('broad') -> Age ('antique') -> Shape ('convex') -> Material ('buffalo-hide') -> Purpose ('ceremonial').",
    target: "Cumulative Adjectives: Multi-Rank Stacking"
  },
  {
    passage: "The technician diagnosed an electrical short-circuit in the cooling tower and immediately ________ before the transformer exploded.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "shut it off",
      "shut off it",
      "shut out it",
      "shut down them it"
    ],
    answer: "shut it off",
    hint: "'Cooling tower / circuit' is pronominalized as 'it', which must sit between 'shut' and 'off'.",
    solution: "The Pronoun Movement Law mandates that the pronoun 'it' must separate the base verb 'shut' and the particle 'off': 'shut it off'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The visual artist displayed a ________ sculpture representing maternal sacrifice.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "mesmerizing tall modern slender black ebony",
      "ebony modern mesmerizing tall slender black",
      "slender tall modern black mesmerizing ebony",
      "black mesmerizing tall modern slender ebony"
    ],
    answer: "mesmerizing tall modern slender black ebony",
    hint: "OSASCOMP: Opinion (mesmerizing) -> Size (tall slender) -> Age (modern) -> Colour (black) -> Material (ebony).",
    solution: "Opinion ('mesmerizing') -> Size/Stature ('tall slender') -> Age ('modern') -> Colour ('black') -> Material ('ebony').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The high school headmaster refused to ________ chronic absenteeism among senior faculty members.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'to tolerate or condone':",
    options: [
      "put up with",
      "look down on",
      "run out of",
      "catch up with"
    ],
    answer: "put up with",
    hint: "'Put up with' signifies bearing or tolerating an offensive practice.",
    solution: "'Put up with' is an inseparable triadic idiom meaning to tolerate, endure, or condone patiently without protest.",
    target: "Phrasal-Prepositional Verbs: Put Up With"
  },
  {
    passage: "The traditional goldsmith forged an ________ scabbard for the state execution sword.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "exquisite long antique curved golden Ashanti ceremonial",
      "Ashanti exquisite long antique curved golden ceremonial",
      "golden exquisite long curved antique Ashanti ceremonial",
      "ceremonial long antique curved golden exquisite Ashanti"
    ],
    answer: "exquisite long antique curved golden Ashanti ceremonial",
    hint: "OSASCOMP: Opinion (exquisite) -> Size (long) -> Age (antique) -> Shape (curved) -> Material (golden) -> Origin (Ashanti) -> Purpose (ceremonial).",
    solution: "Opinion ('exquisite') -> Size ('long') -> Age ('antique') -> Shape ('curved') -> Material ('golden') -> Origin ('Ashanti') -> Purpose ('ceremonial').",
    target: "Cumulative Adjectives: Multi-Rank Stacking"
  },
  {
    passage: "The emergency generator running the hospital's life-support machinery ________ during the catastrophic electrical storm.",
    question: "Choose the correct intransitive phrasal verb meaning 'spontaneously ceased functioning':",
    options: [
      "broke down",
      "broke up",
      "broke through",
      "broke in"
    ],
    answer: "broke down",
    hint: "'Broke down' is intransitive and indicates complete mechanical failure.",
    solution: "'Break down' is an intransitive phrasal verb meaning to fail mechanically without taking a direct nominal object.",
    target: "Phrasal Verbs: Intransitive Verbs"
  },
  {
    passage: "The curator catalogued an ________ map depicting transatlantic trade routes.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "invaluable large eighteenth-century rectangular Dutch navigational",
      "Dutch invaluable large eighteenth-century rectangular navigational",
      "eighteenth-century large invaluable rectangular Dutch navigational",
      "navigational large eighteenth-century rectangular Dutch invaluable"
    ],
    answer: "invaluable large eighteenth-century rectangular Dutch navigational",
    hint: "OSASCOMP: Opinion (invaluable) -> Size (large) -> Age (eighteenth-century) -> Shape (rectangular) -> Origin (Dutch) -> Purpose (navigational).",
    solution: "Opinion ('invaluable') -> Size ('large') -> Age ('eighteenth-century') -> Shape ('rectangular') -> Origin ('Dutch') -> Purpose ('navigational').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The typist realized the draft decree contained classified leaks, so the security officer commanded him to ________ immediately.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "tear it up",
      "tear up it",
      "tear out them",
      "tear up them"
    ],
    answer: "tear it up",
    hint: "'Decree' is singular (pronoun 'it'), which must precede the particle 'up'.",
    solution: "The Pronoun Movement Law mandates that the pronoun object 'it' must split the separable verb 'tear up': 'tear it up'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The interior decorator installed a ________ ceiling panel in the diplomatic lounge.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "luxurious expansive modern square acoustic timber",
      "timber modern luxurious expansive square acoustic",
      "square luxurious expansive modern acoustic timber",
      "acoustic expansive modern square luxurious timber"
    ],
    answer: "luxurious expansive modern square acoustic timber",
    hint: "OSASCOMP: Opinion (luxurious) -> Size (expansive) -> Age (modern) -> Shape (square) -> Purpose (acoustic) -> Material (timber).",
    solution: "Opinion ('luxurious') -> Size ('expansive') -> Age ('modern') -> Shape ('square') -> Purpose ('acoustic') -> Material ('timber').",
    target: "Cumulative Adjectives: Multi-Rank Stacking"
  },
  {
    passage: "Because the young researcher came from an unaccredited college, the senior fellows were inclined to ________ her empirical findings.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'to treat with disdain or condescension':",
    options: [
      "look down on",
      "look up to",
      "run out of",
      "do away with"
    ],
    answer: "look down on",
    hint: "'Look down on' signifies viewing someone or their work with contempt.",
    solution: "'Look down on' is an inseparable triadic idiom meaning to regard with condescension, arrogance, or disdain.",
    target: "Phrasal-Prepositional Verbs: Look Down On"
  },
  {
    passage: "The traditional carver manufactured an ________ drum for royal ceremonies.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "extraordinary giant antique cylindrical wooden Akan",
      "Akan extraordinary giant antique cylindrical wooden",
      "wooden antique giant extraordinary cylindrical Akan",
      "cylindrical extraordinary giant antique wooden Akan"
    ],
    answer: "extraordinary giant antique cylindrical wooden Akan",
    hint: "OSASCOMP: Opinion (extraordinary) -> Size (giant) -> Age (antique) -> Shape (cylindrical) -> Material (wooden) -> Origin (Akan).",
    solution: "Opinion ('extraordinary') -> Size ('giant') -> Age ('antique') -> Shape ('cylindrical') -> Material ('wooden') -> Origin ('Akan').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The environmental health directorate warned the chemical refinery to ________ toxic emissions by forty percent.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'to reduce or curtail':",
    options: [
      "cut down on",
      "put up with",
      "look down on",
      "run out of"
    ],
    answer: "cut down on",
    hint: "'Cut down on' means to curtail or diminish consumption or discharge.",
    solution: "'Cut down on' is an inseparable triadic idiom synonymous with 'reduce' or 'diminish'.",
    target: "Phrasal-Prepositional Verbs: Cut Down On"
  },
  {
    passage: "The jeweler mounted a ________ diamond onto the platinum tiara.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "flawless tiny antique spherical South-African",
      "South-African flawless tiny antique spherical",
      "tiny flawless spherical antique South-African",
      "spherical tiny antique flawless South-African"
    ],
    answer: "flawless tiny antique spherical South-African",
    hint: "OSASCOMP: Opinion (flawless) -> Size (tiny) -> Age (antique) -> Shape (spherical) -> Origin (South-African).",
    solution: "Opinion ('flawless') precedes Size ('tiny'), Age ('antique'), Shape ('spherical'), and Origin ('South-African').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The examination council discovered that three unauthorized candidate index numbers were logged in the portal, so the registrar ordered the programmer to ________.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "delete them out",
      "wipe them out",
      "wipe out them",
      "delete out them"
    ],
    answer: "wipe them out",
    hint: "'Index numbers' is plural (pronoun 'them'), which must sit between 'wipe' and 'out'.",
    solution: "The plural pronoun 'them' must intervene between the verb 'wipe' and the particle 'out': 'wipe them out'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The archaeological excavation unearthed a ________ vessel used in ancestral libation rituals.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "magnificent broad ancient circular terracotta ritual",
      "terracotta magnificent broad ancient circular ritual",
      "ancient magnificent broad circular terracotta ritual",
      "circular magnificent ancient broad terracotta ritual"
    ],
    answer: "magnificent broad ancient circular terracotta ritual",
    hint: "OSASCOMP: Opinion (magnificent) -> Size (broad) -> Age (ancient) -> Shape (circular) -> Material (terracotta) -> Purpose (ritual).",
    solution: "Opinion ('magnificent') -> Size ('broad') -> Age ('ancient') -> Shape ('circular') -> Material ('terracotta') -> Purpose ('ritual').",
    target: "Cumulative Adjectives: Multi-Rank Stacking"
  },
  {
    passage: "The remote district clinic unfortunately ________ antivenom ampoules during the seasonal flood disaster.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'completely exhausted supply':",
    options: [
      "ran out of",
      "put up with",
      "looked down on",
      "caught up with"
    ],
    answer: "ran out of",
    hint: "'Ran out of' denotes the total exhaustion of an essential commodity.",
    solution: "'Run out of' is an inseparable triadic verb meaning to deplete or completely exhaust one's supply of a resource.",
    target: "Phrasal-Prepositional Verbs: Run Out Of"
  },
  {
    passage: "The state protocol officer presented a ________ sword to the foreign defense attaché.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "dazzling long new curved silver ceremonial",
      "ceremonial dazzling long new curved silver",
      "silver dazzling long new curved ceremonial",
      "new dazzling long curved silver ceremonial"
    ],
    answer: "dazzling long new curved silver ceremonial",
    hint: "OSASCOMP: Opinion (dazzling) -> Size (long) -> Age (new) -> Shape (curved) -> Material (silver) -> Purpose (ceremonial).",
    solution: "Opinion ('dazzling') -> Size ('long') -> Age ('new') -> Shape ('curved') -> Material ('silver') -> Purpose ('ceremonial').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The old library registers had become thoroughly waterlogged and mildewed, so the archives clerk ________.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "threw them away",
      "threw away them",
      "threw out them",
      "threw it away"
    ],
    answer: "threw them away",
    hint: "'Registers' is plural (pronoun 'them'), which must precede the particle 'away'.",
    solution: "The plural pronoun 'them' must precede the adverbial particle 'away' in separable constructions: 'threw them away'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The royal palace featured a ________ portico supported by twelve pillars.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "majestic towering nineteenth-century arched marble",
      "marble majestic towering nineteenth-century arched",
      "arched majestic towering nineteenth-century marble",
      "nineteenth-century towering majestic arched marble"
    ],
    answer: "majestic towering nineteenth-century arched marble",
    hint: "OSASCOMP: Opinion (majestic) -> Size (towering) -> Age (nineteenth-century) -> Shape (arched) -> Material (marble).",
    solution: "Opinion ('majestic') -> Size ('towering') -> Age ('nineteenth-century') -> Shape ('arched') -> Material ('marble').",
    target: "Cumulative Adjectives: Multi-Rank Stacking"
  },
  {
    passage: "Young scholars are taught to ________ distinguished elder statesmen who exemplified integrity in public office.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'to admire and revere deeply':",
    options: [
      "look up to",
      "look down on",
      "put up with",
      "run out of"
    ],
    answer: "look up to",
    hint: "'Look up to' signifies holding someone in deep respect or viewing them as an ethical role model.",
    solution: "'Look up to' is an inseparable triadic idiom meaning to admire, respect, or revere someone.",
    target: "Phrasal-Prepositional Verbs: Look Up To"
  },
  {
    passage: "The metallurgist examined an ________ specimen of meteoritic rock.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "extraordinary dense ancient irregular iron",
      "iron extraordinary dense ancient irregular",
      "dense extraordinary ancient irregular iron",
      "irregular ancient dense extraordinary iron"
    ],
    answer: "extraordinary dense ancient irregular iron",
    hint: "OSASCOMP: Opinion (extraordinary) -> Physical Property/Weight (dense) -> Age (ancient) -> Shape (irregular) -> Material (iron).",
    solution: "Opinion ('extraordinary') -> Property/Size ('dense') -> Age ('ancient') -> Shape ('irregular') -> Material ('iron').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The teacher noticed that the classroom radio was playing loudly during study hour and asked the monitor to ________.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "turn it down",
      "turn down it",
      "turn down them",
      "turn them down it"
    ],
    answer: "turn it down",
    hint: "'Radio' is singular (pronoun 'it'), which must precede 'down'.",
    solution: "The singular pronoun 'it' must intervene between the verb 'turn' and the particle 'down': 'turn it down'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The military museum acquired an ________ artillery piece used during the Anglo-Ashanti wars.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "imposing heavy antique cylindrical bronze British",
      "British imposing heavy antique cylindrical bronze",
      "bronze imposing heavy antique cylindrical British",
      "heavy imposing cylindrical antique bronze British"
    ],
    answer: "imposing heavy antique cylindrical bronze British",
    hint: "OSASCOMP: Opinion (imposing) -> Weight/Size (heavy) -> Age (antique) -> Shape (cylindrical) -> Material (bronze) -> Origin (British).",
    solution: "Opinion ('imposing') -> Weight ('heavy') -> Age ('antique') -> Shape ('cylindrical') -> Material ('bronze') -> Origin ('British').",
    target: "Cumulative Adjectives: Multi-Rank Stacking"
  },
  {
    passage: "The detective visited the registry to ________ the suspect's claim of continuous employment.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'to investigate and verify the truth of':",
    options: [
      "check up on",
      "look down on",
      "put up with",
      "do away with"
    ],
    answer: "check up on",
    hint: "'Check up on' means to investigate or verify someone's claims or background.",
    solution: "'Check up on' is an inseparable triadic verb meaning to investigate, audit, or verify the veracity of an account.",
    target: "Phrasal-Prepositional Verbs: Check Up On"
  },
  {
    passage: "The queen was presented with a ________ tiara by the visiting monarch.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "dazzling slender new semicircular diamond",
      "diamond dazzling slender new semicircular",
      "semicircular dazzling slender new diamond",
      "new dazzling slender semicircular diamond"
    ],
    answer: "dazzling slender new semicircular diamond",
    hint: "OSASCOMP: Opinion (dazzling) -> Size (slender) -> Age (new) -> Shape (semicircular) -> Material (diamond).",
    solution: "Opinion ('dazzling') -> Size ('slender') -> Age ('new') -> Shape ('semicircular') -> Material ('diamond').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The laboratory glassware was coated with dangerous chemical residue, so the technician ________ before re-use.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "washed it out",
      "washed out it",
      "washed out them",
      "washed them down it"
    ],
    answer: "washed it out",
    hint: "'Glassware' is treated as an uncountable mass noun (pronoun 'it'), which must precede 'out'.",
    solution: "The singular non-count pronoun 'it' must sit between 'washed' and 'out': 'washed it out'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The agricultural firm constructed a ________ storage silo to safeguard the bumper maize harvest.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "formidable towering modern cylindrical galvanized-steel",
      "galvanized-steel formidable towering modern cylindrical",
      "cylindrical modern towering formidable galvanized-steel",
      "modern formidable towering cylindrical galvanized-steel"
    ],
    answer: "formidable towering modern cylindrical galvanized-steel",
    hint: "OSASCOMP: Opinion (formidable) -> Size (towering) -> Age (modern) -> Shape (cylindrical) -> Material (galvanized-steel).",
    solution: "Opinion ('formidable') -> Size ('towering') -> Age ('modern') -> Shape ('cylindrical') -> Material ('galvanized-steel').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "Despite trailing by forty meters in the final lap, the Ghanaian runner managed to ________ the leading athlete.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'to reach parity with':",
    options: [
      "catch up with",
      "look down on",
      "put up with",
      "run out of"
    ],
    answer: "catch up with",
    hint: "'Catch up with' means to draw level with an advancing opponent.",
    solution: "'Catch up with' is an inseparable triadic idiom meaning to reach the same position or standard as an opponent.",
    target: "Phrasal-Prepositional Verbs: Catch Up With"
  },
  {
    passage: "The traditional carver manufactured a ________ ceremonial mortar for palace banquets.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "splendid massive antique flared-rim mahogany",
      "mahogany splendid massive antique flared-rim",
      "flared-rim antique splendid massive mahogany",
      "massive splendid flared-rim antique mahogany"
    ],
    answer: "splendid massive antique flared-rim mahogany",
    hint: "OSASCOMP: Opinion (splendid) -> Size (massive) -> Age (antique) -> Shape (flared-rim) -> Material (mahogany).",
    solution: "Opinion ('splendid') -> Size ('massive') -> Age ('antique') -> Shape ('flared-rim') -> Material ('mahogany').",
    target: "Cumulative Adjectives: Multi-Rank Stacking"
  },
  {
    passage: "The library book had several dog-eared pages, but the archivist carefully ________ before rebinding the volume.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "flattened them out",
      "flattened out them",
      "flattened out it",
      "flattened it out"
    ],
    answer: "flattened them out",
    hint: "'Pages' is plural (pronoun 'them'), which must sit between 'flattened' and 'out'.",
    solution: "The plural pronoun 'them' must intervene between the verb and particle: 'flattened them out'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The mineral exploration company surveyed a ________ mining concession in the Western Region.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "promising vast new rectangular gold-bearing",
      "gold-bearing vast new promising rectangular",
      "rectangular promising vast new gold-bearing",
      "new promising vast rectangular gold-bearing"
    ],
    answer: "promising vast new rectangular gold-bearing",
    hint: "OSASCOMP: Opinion (promising) -> Size (vast) -> Age (new) -> Shape (rectangular) -> Purpose/Type (gold-bearing).",
    solution: "Opinion ('promising') -> Size ('vast') -> Age ('new') -> Shape ('rectangular') -> Purpose/Type ('gold-bearing').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "Under relentless cross-examination by the state prosecutor, the corrupt witness finally ________ and confessed his perjury.",
    question: "Choose the correct intransitive phrasal verb meaning 'succumbed or surrendered':",
    options: [
      "gave in",
      "gave out",
      "gave off",
      "gave away"
    ],
    answer: "gave in",
    hint: "'Gave in' is intransitive and signifies capitulation under pressure.",
    solution: "'Give in' is an intransitive phrasal verb meaning to surrender, yield, or capitulate.",
    target: "Phrasal Verbs: Intransitive Verbs"
  },
  {
    passage: "The botanical garden featured a ________ palm tree brought from Madagascar.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "delightful towering century-old fan-shaped",
      "century-old delightful towering fan-shaped",
      "fan-shaped towering delightful century-old",
      "towering delightful fan-shaped century-old"
    ],
    answer: "delightful towering century-old fan-shaped",
    hint: "OSASCOMP: Opinion (delightful) -> Size (towering) -> Age (century-old) -> Shape (fan-shaped).",
    solution: "Opinion ('delightful') -> Size ('towering') -> Age ('century-old') -> Shape ('fan-shaped').",
    target: "Cumulative Adjectives: OSASCOMP Order"
  },
  {
    passage: "The auditor found several fraudulent expense claims and immediately ________ in red ink.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "crossed them out",
      "crossed out them",
      "crossed out it",
      "crossed it out"
    ],
    answer: "crossed them out",
    hint: "'Claims' is plural (pronoun 'them'), which must precede the particle 'out'.",
    solution: "The plural pronoun 'them' must sit between 'crossed' and 'out': 'crossed them out'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The royal treasury preserved an ________ chest for storing sovereign state documents.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "exquisite compact antique rectangular ebony Ashanti",
      "Ashanti exquisite compact antique rectangular ebony",
      "ebony compact antique exquisite rectangular Ashanti",
      "rectangular exquisite compact antique ebony Ashanti"
    ],
    answer: "exquisite compact antique rectangular ebony Ashanti",
    hint: "OSASCOMP: Opinion (exquisite) -> Size (compact) -> Age (antique) -> Shape (rectangular) -> Material (ebony) -> Origin (Ashanti).",
    solution: "Opinion ('exquisite') -> Size ('compact') -> Age ('antique') -> Shape ('rectangular') -> Material ('ebony') -> Origin ('Ashanti').",
    target: "Cumulative Adjectives: Multi-Rank Stacking"
  },
  {
    passage: "The municipal assembly warned unauthorized roadside vendors that law enforcement officers would ________ all unregistered wooden kiosks.",
    question: "Choose the correct three-part phrasal-prepositional verb meaning 'to demolish or abolish':",
    options: [
      "do away with",
      "look down on",
      "put up with",
      "run out of"
    ],
    answer: "do away with",
    hint: "'Do away with' signifies complete elimination or removal.",
    solution: "'Do away with' is an inseparable triadic idiom meaning to eradicate, eliminate, or abolish completely.",
    target: "Phrasal-Prepositional Verbs: Do Away With"
  },
  {
    passage: "The aviation museum restored a ________ biplane constructed during the inter-war period.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "splendid miniature vintage twin-winged wooden British",
      "British splendid miniature vintage twin-winged wooden",
      "vintage splendid miniature twin-winged British wooden",
      "wooden miniature vintage splendid twin-winged British"
    ],
    answer: "splendid miniature vintage twin-winged wooden British",
    hint: "OSASCOMP: Opinion (splendid) -> Size (miniature) -> Age (vintage) -> Shape/Type (twin-winged) -> Material (wooden) -> Origin (British).",
    solution: "Opinion ('splendid') -> Size ('miniature') -> Age ('vintage') -> Shape/Type ('twin-winged') -> Material ('wooden') -> Origin ('British').",
    target: "Cumulative Adjectives: Multi-Rank Stacking"
  },
  {
    passage: "The examination paper contained an ambiguous question, so the invigilator asked the chief examiner to ________ to the candidates.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "explain it out",
      "make it out",
      "clear it up",
      "clear up it"
    ],
    answer: "clear it up",
    hint: "'Question/ambiguity' is singular (pronoun 'it'), which must sit between 'clear' and 'up'.",
    solution: "The separable phrasal verb 'clear up' (meaning clarify) must be split by the singular pronoun 'it': 'clear it up'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  },
  {
    passage: "The sovereign regalia included an ________ crown worn exclusively during royal enstoolment rites.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "opulent tall antique conical gold Akan ceremonial",
      "Akan opulent tall antique conical gold ceremonial",
      "gold opulent tall antique conical Akan ceremonial",
      "ceremonial opulent tall antique conical gold Akan"
    ],
    answer: "opulent tall antique conical gold Akan ceremonial",
    hint: "OSASCOMP: Opinion (opulent) -> Size (tall) -> Age (antique) -> Shape (conical) -> Material (gold) -> Origin (Akan) -> Purpose (ceremonial).",
    solution: "Opinion ('opulent') -> Size ('tall') -> Age ('antique') -> Shape ('conical') -> Material ('gold') -> Origin ('Akan') -> Purpose ('ceremonial').",
    target: "Cumulative Adjectives: Multi-Rank Stacking"
  },
  {
    passage: "The laboratory ran out of reagents because the inventory manager failed to ________ before the weekend.",
    question: "Choose the correct phrasal verb meaning 'to order fresh inventory':",
    options: [
      "stock up",
      "stock out",
      "stock off",
      "stock through"
    ],
    answer: "stock up",
    hint: "'Stock up' means to amass or purchase supplies in quantity.",
    solution: "'Stock up' is a phrasal verb meaning to replenish inventory or accumulate stores.",
    target: "Phrasal Verbs: Semantic Identification"
  },
  {
    passage: "The paramount palace courtyard showcased an ________ stone altar.",
    question: "Choose the correct cumulative adjective sequence:",
    options: [
      "impressive massive ancient octagonal granite sacrificial",
      "granite impressive massive ancient octagonal sacrificial",
      "sacrificial impressive massive ancient octagonal granite",
      "octagonal impressive massive ancient granite sacrificial"
    ],
    answer: "impressive massive ancient octagonal granite sacrificial",
    hint: "OSASCOMP: Opinion (impressive) -> Size (massive) -> Age (ancient) -> Shape (octagonal) -> Material (granite) -> Purpose (sacrificial).",
    solution: "Opinion ('impressive') -> Size ('massive') -> Age ('ancient') -> Shape ('octagonal') -> Material ('granite') -> Purpose ('sacrificial').",
    target: "Cumulative Adjectives: Multi-Rank Stacking"
  },
  {
    passage: "The legal draft contained several typographical errors, so the senior advocate instructed the paralegal to ________ before filing.",
    question: "Choose the grammatically correct phrasal verb construction:",
    options: [
      "correct them out",
      "type them out",
      "sort them out",
      "sort out them"
    ],
    answer: "sort them out",
    hint: "'Errors' is plural (pronoun 'them'), which must sit between 'sort' and 'out'.",
    solution: "The separable phrasal verb 'sort out' (meaning resolve or rectify) must be split by the pronoun object: 'sort them out'.",
    target: "Phrasal Verbs: Pronoun Movement Law"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// Strand 3 B8 Advanced Focus: Multi-Tier OSASCOMP Stacking, Separability
// & The Pronoun Movement Law
// =========================================================================
const capstone5B8GrammarAdvancedQuestions = [
  {
    questionNumber: 51,
    question: "In paragraph 1, how does the description 'an awe-inspiring massive antique circular jet-black Ghanaian bronze-cast ceremonial state stool' demonstrate the full OSASCOMP cumulative adjective rule?",
    options: [
      "It rigorously executes all eight OSASCOMP ranks: Opinion, Size, Age, Shape, Colour, Origin, Material, and Purpose without a single separating comma",
      "It places material before colour and origin before shape to create a rhythmic cadence",
      "It uses coordinate adjectives that require separating semicolons under formal British orthography",
      "It inverts the order to prioritize national origin above subjective observation"
    ],
    answer: "It rigorously executes all eight OSASCOMP ranks: Opinion, Size, Age, Shape, Colour, Origin, Material, and Purpose without a single separating comma",
    hint: "Examine the order: awe-inspiring (Opinion) -> massive (Size) -> antique (Age) -> circular (Shape) -> jet-black (Colour) -> Ghanaian (Origin) -> bronze-cast (Material) -> ceremonial (Purpose).",
    solution: "The phrase represents a comprehensive eight-tier realization of the OSASCOMP cumulative adjective hierarchy without separating commas, precisely conforming to NaCCA and WAEC structural standards.",
    target: "Capstone Exam: Full 8-Tier OSASCOMP Stacking"
  },
  {
    questionNumber: 52,
    question: "In paragraph 2, why is the construction 'switched it off' grammatically mandatory instead of 'switched off it' when the technician disables the compressor?",
    options: [
      "Because the Pronoun Movement Law dictates that a pronoun direct object ('it') must split a transitive separable phrasal verb",
      "Because 'off' is a spatial preposition that cannot govern inanimate pronouns",
      "Because 'switched off' is an intransitive verbal compound that rejects nominal complements",
      "Because 'it' refers to the technician's elbow rather than the compressor"
    ],
    answer: "Because the Pronoun Movement Law dictates that a pronoun direct object ('it') must split a transitive separable phrasal verb",
    hint: "Recall the mandatory particle movement rule that applies whenever the direct object of a separable verb is a personal pronoun.",
    solution: "Transitive separable verbs like 'switch off' must be split by personal pronoun direct objects ('it'): 'switched it off'. Placing the particle before a personal pronoun ('switched off it') violates standard English syntax.",
    target: "Capstone Exam: Pronoun Movement Law"
  },
  {
    questionNumber: 53,
    question: "In paragraph 3, what syntactic classification applies to the multi-word verb 'broke down' in the clause 'developed an abrupt hydraulic breach and broke down directly across the palace gates'?",
    options: [
      "An intransitive phrasal verb expressing mechanical failure, taking no direct object",
      "A transitive separable phrasal verb governing 'gates' as its direct object",
      "A three-part phrasal-prepositional verb governing 'hydraulic breach'",
      "A copular linking verb followed by a locative predicate"
    ],
    answer: "An intransitive phrasal verb expressing mechanical failure, taking no direct object",
    hint: "Does 'broke down' act upon an immediate direct object, or does it describe an autonomous failure?",
    solution: "'Break down' functions as an intransitive phrasal verb: it describes the autonomous mechanical failure of the hauler without transferring action to a direct object.",
    target: "Capstone Exam: Phrasal Verb Classification"
  },
  {
    questionNumber: 54,
    question: "In paragraph 4, what is the meaning and structural composition of the verbal idiom 'put up with' in the phrase 'put up with rigorous cataloguing protocols'?",
    options: [
      "An inseparable three-part phrasal-prepositional verb meaning to tolerate or endure demanding procedures without complaint",
      "A separable phrasal verb meaning to store documents in an elevated cabinet",
      "An intransitive verb phrase signifying the termination of archival duties",
      "A passive participle qualifying the archivist"
    ],
    answer: "An inseparable three-part phrasal-prepositional verb meaning to tolerate or endure demanding procedures without complaint",
    hint: "Examine the triadic structure (Verb + Particle + Preposition) and its idiomatic sense of patient endurance.",
    solution: "'Put up with' is an inseparable three-part phrasal-prepositional verb (Verb: put + Adverbial Particle: up + Preposition: with) meaning to tolerate or endure demanding tasks patiently.",
    target: "Capstone Exam: Triadic Phrasal-Prepositional Verbs"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the punctuation rule for cumulative adjectives in paragraph 1.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Cumulative adjectives must never take separating commas.",
      "Because cumulative adjectives build meaning, they should never be written with commas between them.",
      "Never separate cumulative adjectives with commas in English sentences.",
      "Zero commas allowed."
    ],
    answer: "Cumulative adjectives must never take separating commas.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Cumulative adjectives must never take separating commas' is exactly 7 words, forms a complete grammatical sentence with an active verb ('must take'), and articulates the rule directly. Option C is an imperative instruction, Option B contains 13 words, and Option D is a phrase.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployStrand3B8Advanced() {
  console.log("Building 55 UNIQUE questions for Basic 8 (JHS 2) Strand 3 Grammar Advanced Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B8GrammarAdvancedDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B8_G_A_${qNum < 10 ? "0" + qNum : qNum}`,
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
      learningCompetency: "B8.3.1.1 / B8.3.1.2: Demonstrate advanced grammatical mastery of full-scale cumulative adjective hierarchies (OSASCOMP), transitive separable phrasal verb mechanics, the Pronoun Movement Law, and triadic phrasal-prepositional idioms."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B8GrammarAdvancedQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${b8GrammarAdvancedCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B8_G_A_${item.questionNumber}`,
      level: "B8",
      difficulty: "advanced",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: b8GrammarAdvancedCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B8.3.1.1 / B8.3.1.2: Synthesize advanced multi-paragraph contextual grammar, evaluating full 8-tier cumulative adjective stacking without commas, pronoun movement mechanics in embedded structures, and concise rule summaries."
    });
  });

  // 3. Write directly to Firestore using the unified canonical topic path
  const targetDoc = db.doc(
    "global_curriculum/jhs/subjects/english/topical/grammar_lexis_prepositions_and_phrasal_verbs/practice_labs/B8_advanced"
  );

  await targetDoc.set({
    level: "B8",
    difficulty: "advanced",
    title: "Basic 8 Advanced Lab: 50 Unique Grammar Drills + 5 Capstone Exam Questions",
    totalQuestions: all55Questions.length,
    shortDrillsCount: 50,
    capstoneExamQuestionsCount: 5,
    questions: all55Questions,
    metadata: {
      hasDuplicateQuestions: false,
      uniqueQuestionsCount: 55,
      structure: "50 Unique Short Drills (Full OSASCOMP Stacking, Pronoun Movement Law, Triadic Phrasal-Prepositional Verbs) + 5 Capstone Full-Passage Questions",
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

deployStrand3B8Advanced()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 3 B8 Advanced Lab:", err);
    process.exit(1);
  });
