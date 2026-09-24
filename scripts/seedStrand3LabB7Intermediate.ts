import * as admin from 'firebase-admin';
import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function getDb() {
  const fbAdmin: any = (admin as any).default || admin;
  try {
    const { OAuth2Client } = req('google-auth-library');
    const { Firestore } = req('@google-cloud/firestore');
    const auth = req('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
    const account = auth.getGlobalDefaultAccount();
    if (account && account.tokens) {
      const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
      const oauthClient = new OAuth2Client();
      oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
      return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });
    }
  } catch (e) {
    console.warn("OAuth fallback failed, trying default admin credential:", e);
  }

  if (!fbAdmin.apps?.length) {
    try {
      fbAdmin.initializeApp({ credential: fbAdmin.credential.applicationDefault() });
    } catch (e) {}
  }
  return fbAdmin.firestore();
}

interface LabQuestion {
  id: string;
  level: "B7";
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
// Strand 3 Focus: Complex Countability, Deficit Quantification,
// Genitive Reciprocals, and Inherent Negative Polarity Triggers
// =========================================================================
const b7GrammarIntermediateCapstonePassage = 
`The municipal health inspector arrived at the central food market early on Tuesday morning to conduct a comprehensive sanitary audit. Stepping cautiously past the drainage channels, she noted that the butchers had installed several modern stainless-steel slabs, but the general market infrastructure remained severely dilapidated. She warned the executives that an inspection of this nature was no mere formality; reliable information gathered from regional clinics revealed that food contamination had risen sharply. She insisted that each trader must procure adequate cleaning equipment to maintain basic hygiene.

During the inspection of the grain stalls, the chairwoman and the secretary of the market women's association walked beside the inspector. Because the two leaders bore exclusive constitutional responsibility for domestic disputes in the market, they consulted each other's handwritten registers to verify whether daily waste dues had been collected. The inspector praised their vigilance, remarking that when civic executives respect each other's administrative duties, communal order is easily maintained.

Further down the lane, the team inspected the dry-goods section. The inspector noted with concern that the storekeepers had very little potable water stored in their overhead tanks, leaving the washing basins almost dry. To mitigate the emergency, the market committee promptly provided five large drums of treated water, twelve bars of carbolic soap, and several rolls of disposable towels. When a vendor asked if there were any disinfectant sprays available in the central dispensary, the storekeeper replied that there were a few bottles reserved on the upper tier.

Before departing, the inspector addressed all eighty stallholders gathered in the open shed. She commended the diverse commodity groups for cooperating with one another throughout the morning exercise. However, she issued a stern caution: the health directorate would barely tolerate any sanitary infractions during the upcoming festive season. She urged the traders to live in harmony and respect one another's designated vending boundaries so that no shopkeeper would suffer any legal penalties.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Intermediate B7 Competencies: Invariable Mass Concord, Partitive Nuances,
// Genitive Reciprocals (each other's vs. one another's), Little/Few Deficits,
// and Inherent/Semi-Negative Polarity (scarcely, hardly, barely, without)
// =========================================================================
const unique50B7GrammarIntermediateDrills = [
  {
    passage: "The information provided by the three intelligence officers ________ verified by the regional commander before the military operation began.",
    question: "Choose the grammatically correct auxiliary verb to fill the blank:",
    options: ["was", "were", "are", "have been"],
    answer: "was",
    hint: "'Information' is an uncountable noun and strictly governs singular subject-verb concord.",
    solution: "'Information' is an invariable non-count noun. Despite the mention of 'three intelligence officers', the true head of the subject noun phrase is 'information', requiring the singular auxiliary 'was'.",
    target: "Non-Count Invariables: Subject-Verb Concord"
  },
  {
    passage: "The two rival tennis champions accidentally picked up ________ rackets from the bench after the grueling final match.",
    question: "Choose the correct genitive reciprocal pronoun form:",
    options: ["each other's", "each others'", "one another's", "one anothers'"],
    answer: "each other's",
    hint: "Two players are involved, and the possessive case requires an apostrophe followed by 's'.",
    solution: "Reciprocal pronoun duality requires 'each other'. The genitive (possessive) form is constructed by adding an apostrophe and 's' ('each other's').",
    target: "Reciprocal Pronouns: Genitive Dual Form"
  },
  {
    passage: "The nurse carefully measured out three ________ of antiseptic lotion to clean the patient's wound.",
    question: "Choose the correct partitive quantifier for liquid lotion:",
    options: ["fluid ounces", "bars", "loaves", "sheets"],
    answer: "fluid ounces",
    hint: "Antiseptic lotion is a medicinal liquid measured in volumetric liquid units.",
    solution: "Liquid volume in clinical contexts is measured in partitive units such as 'fluid ounces' or 'milliliters'. Bars, loaves, and sheets are inappropriate for liquids.",
    target: "Partitive Quantifiers: Volumetric Units"
  },
  {
    passage: "The stranded motorists had ________ fuel left in the vehicle, so they were compelled to push it up the steep embankment.",
    question: "Choose the quantifier indicating an extreme negative deficit for the non-count noun 'fuel':",
    options: ["little", "a little", "few", "a few"],
    answer: "little",
    hint: "'Fuel' is non-count, and being forced to push the car indicates an almost total absence of petrol.",
    solution: "'Little' conveys a negative deficit ('almost none') for uncountable mass nouns. 'A little' would imply a positive small amount sufficient to keep driving.",
    target: "Determiners: Little vs. A Little"
  },
  {
    passage: "The criminal managed to cross the international frontier without ________ border guard detecting his forged passport.",
    question: "Choose the grammatically mandatory determiner:",
    options: ["any", "some", "much", "many"],
    answer: "any",
    hint: "The preposition 'without' functions as an inherent negative polarity trigger.",
    solution: "'Without' inherently establishes a negative syntactic environment, requiring the non-assertive determiner 'any'.",
    target: "Polarity Determiners: Inherent Negatives"
  },
  {
    passage: "The laboratory equipment imported from Germany ________ tested by the standards authority yesterday.",
    question: "Choose the correct singular verb form:",
    options: ["was", "were", "have been", "are"],
    answer: "was",
    hint: "'Equipment' is an uncountable noun regardless of the quantity imported.",
    solution: "'Equipment' is an invariable mass noun and governs singular verb concord ('was tested').",
    target: "Non-Count Invariables: Subject-Verb Concord"
  },
  {
    passage: "All fifty delegates at the youth conference applauded ________ speeches during the plenary session.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["one another's", "one anothers'", "each other's", "each others'"],
    answer: "one another's",
    hint: "Fifty delegates (three or more) are interacting mutually, and possession is indicated.",
    solution: "For three or more participants, the reciprocal pronoun is 'one another'. The possessive form takes an apostrophe and 's' ('one another's').",
    target: "Reciprocal Pronouns: Genitive Plural Form"
  },
  {
    passage: "The structural engineer requested four ________ of galvanized iron to reinforce the warehouse roof.",
    question: "Choose the appropriate partitive noun:",
    options: ["sheets", "loaves", "bars", "grains"],
    answer: "sheets",
    hint: "Galvanized iron used for roofing is manufactured in wide, flat, rectangular panels.",
    solution: "Flat, broad materials like metal, paper, and glass are measured partitively in 'sheets'.",
    target: "Partitive Quantifiers: Industrial Materials"
  },
  {
    passage: "Because he was quiet and arrogant, the new boy made ________ friends during his first term at the boarding school.",
    question: "Choose the quantifier expressing an unfortunate scarcity for count plural nouns:",
    options: ["few", "a few", "little", "a little"],
    answer: "few",
    hint: "'Friends' is a plural count noun, and the boy's unpleasant traits resulted in almost no friends.",
    solution: "'Few' without an article conveys a negative deficit ('hardly any / almost none') when modifying countable plural nouns.",
    target: "Determiners: Few vs. A Few"
  },
  {
    passage: "Scarcely ________ spectator remained seated when the national team scored the decisive winning goal.",
    question: "Choose the correct non-assertive determiner:",
    options: ["any", "some", "no", "many"],
    answer: "any",
    hint: "'Scarcely' is a semi-negative adverb that triggers non-assertive polarity.",
    solution: "Semi-negative adverbs like 'scarcely', 'hardly', and 'barely' create non-assertive syntactic environments, demanding 'any'.",
    target: "Polarity Determiners: Semi-Negatives"
  },
  {
    passage: "The stationery delivered to the district education offices ________ five hundred reams of duplicating paper.",
    question: "Choose the correct verb form:",
    options: ["includes", "include", "are including", "have included"],
    answer: "includes",
    hint: "'Stationery' is an uncountable noun and requires a third-person singular verb.",
    solution: "'Stationery' is an invariable non-count noun and governs singular concord ('includes').",
    target: "Non-Count Invariables: Subject-Verb Concord"
  },
  {
    passage: "The co-authors dedicated the historical monograph to ________ wives for their enduring patience during the research.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["each other's", "each others'", "one another's", "one anothers'"],
    answer: "each other's",
    hint: "'Co-authors' denotes exactly two collaborating authors.",
    solution: "Dual reference (two co-authors) strictly requires 'each other'. The possessive form is 'each other's'.",
    target: "Reciprocal Pronouns: Genitive Dual Form"
  },
  {
    passage: "The mason mixed three ________ of coarse gravel with two bags of lime for the foundation trench.",
    question: "Choose the appropriate partitive container noun:",
    options: ["headpans", "loaves", "bars", "sheets"],
    answer: "headpans",
    hint: "Identify the traditional shallow metal container used on West African construction sites to carry aggregate.",
    solution: "'Headpan' is a recognized partitive container unit for granular construction materials like gravel and mortar.",
    target: "Partitive Quantifiers: Local Container Units"
  },
  {
    passage: "Fortunately, the surgeon had ________ time to sterilize the scalpel before the emergency delivery commenced.",
    question: "Choose the quantifier indicating a reassuring, positive small amount for non-count nouns:",
    options: ["a little", "little", "few", "a few"],
    answer: "a little",
    hint: "'Time' is uncountable, and 'fortunately' signals that the available time was sufficient.",
    solution: "'A little' denotes a positive, sufficient small quantity ('some') for mass non-count nouns.",
    target: "Determiners: Little vs. A Little"
  },
  {
    passage: "The police searched the vehicle but found ________ concealed weapons under the passenger seat.",
    question: "Choose the correct determiner to maintain standard negative syntax without creating a double negative:",
    options: ["no", "any", "some", "none"],
    answer: "no",
    hint: "The verb 'found' is affirmative, so a negative determiner is needed to express the absence of weapons.",
    solution: "'No' functions as a negative determiner preceding the noun 'weapons'. Using 'any' would require 'did not find'.",
    target: "Determiners: Negative Determiner 'No'"
  },
  {
    passage: "The luggage belonging to the transit passengers ________ transferred to the connecting domestic flight.",
    question: "Choose the correct auxiliary verb:",
    options: ["was", "were", "are", "have been"],
    answer: "was",
    hint: "The head noun of the subject is 'luggage', which is uncountable.",
    solution: "'Luggage' is non-count and invariable, taking the singular verb 'was transferred'.",
    target: "Non-Count Invariables: Subject-Verb Concord"
  },
  {
    passage: "During the debate tournament, the four competing schools scrutinized ________ arguments for logical fallacies.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["one another's", "one anothers'", "each other's", "each others'"],
    answer: "one another's",
    hint: "Four schools are in mutual competition.",
    solution: "Reciprocal interaction among three or more entities in the possessive case requires 'one another's'.",
    target: "Reciprocal Pronouns: Genitive Plural Form"
  },
  {
    passage: "The goldsmith melted a small ________ of pure bullion to forge the traditional royal ring.",
    question: "Choose the correct partitive noun for molded precious metals:",
    options: ["ingot", "loaf", "sheet", "slice"],
    answer: "ingot",
    hint: "Precious metals like gold and silver cast into rectangular blocks are termed...",
    solution: "An 'ingot' is the technical and partitive term for a block of cast metal, especially gold or steel.",
    target: "Partitive Quantifiers: Metals"
  },
  {
    passage: "Although the examination was demanding, ________ candidates managed to achieve distinction grades.",
    question: "Choose the quantifier indicating a positive small number of countable individuals:",
    options: ["a few", "few", "little", "a little"],
    answer: "a few",
    hint: "'Candidates' is countable, and achieving distinctions is a positive outcome.",
    solution: "'A few' modifies count nouns in a positive sense, indicating that several individuals succeeded.",
    target: "Determiners: Few vs. A Few"
  },
  {
    passage: "The recluse lives in complete isolation and rarely receives ________ visitors at his forest cottage.",
    question: "Choose the correct determiner:",
    options: ["any", "some", "much", "little"],
    answer: "any",
    hint: "The frequency adverb 'rarely' creates a semi-negative polarity environment.",
    solution: "'Rarely' acts as a negative trigger, making the non-assertive determiner 'any' obligatory.",
    target: "Polarity Determiners: Semi-Negatives"
  },
  {
    passage: "The machinery installed in the textile mill ________ round-the-clock maintenance to prevent overheating.",
    question: "Choose the correct singular present-tense verb:",
    options: ["requires", "require", "are requiring", "have required"],
    answer: "requires",
    hint: "'Machinery' is an uncountable noun and requires a singular verb ending in '-s'.",
    solution: "'Machinery' is an invariable non-count noun and takes the third-person singular present verb 'requires'.",
    target: "Non-Count Invariables: Subject-Verb Concord"
  },
  {
    passage: "The husband and wife listened patiently to ________ grievances before signing the reconciliation agreement.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["each other's", "each others'", "one another's", "one anothers'"],
    answer: "each other's",
    hint: "Exactly two spouses are resolving their differences.",
    solution: "Dual reference in the genitive case requires 'each other's'.",
    target: "Reciprocal Pronouns: Genitive Dual Form"
  },
  {
    passage: "The artist purchased five ________ of primed canvas to paint the historical murals.",
    question: "Choose the appropriate partitive unit for rolled or stretched fabric:",
    options: ["bolts", "bars", "loaves", "grains"],
    answer: "bolts",
    hint: "Fabric or canvas stored in long commercial rolls is measured in...",
    solution: "A 'bolt' is the standard commercial partitive measure for continuous rolls of textile fabric or canvas.",
    target: "Partitive Quantifiers: Textiles"
  },
  {
    passage: "There is ________ hope of rescuing the sunken trawler because the ocean trench is five thousand meters deep.",
    question: "Choose the quantifier denoting an extreme negative deficit ('almost none'):",
    options: ["little", "a little", "few", "a few"],
    answer: "little",
    hint: "'Hope' is an abstract uncountable noun, and the extreme depth makes rescue practically impossible.",
    solution: "'Little' expresses a near-total absence or negative deficit for non-count nouns.",
    target: "Determiners: Little vs. Few"
  },
  {
    passage: "The suspect denied having ________ connection with the international counterfeit syndicate.",
    question: "Choose the correct determiner following the negative verb 'denied':",
    options: ["any", "some", "much", "many"],
    answer: "any",
    hint: "'Denied' has inherently negative semantics, equivalent to 'stated that he had no...'",
    solution: "Verbs with negative semantics like 'deny', 'refuse', or 'forbid' license non-assertive determiners like 'any'.",
    target: "Polarity Determiners: Inherent Negatives"
  },
  {
    passage: "The traffic on the George Walker Bush Highway during the evening rush hour ________ completely stationary.",
    question: "Choose the correct singular auxiliary verb:",
    options: ["was", "were", "are", "have been"],
    answer: "was",
    hint: "'Traffic' is an uncountable mass noun.",
    solution: "'Traffic' is non-count and governs singular verb agreement ('was stationary').",
    target: "Non-Count Invariables: Subject-Verb Concord"
  },
  {
    passage: "The three executive directors inspected ________ departmental audit files before the board meeting.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["one another's", "one anothers'", "each other's", "each others'"],
    answer: "one another's",
    hint: "Three directors are involved in mutual inspection.",
    solution: "For three entities possessing items mutually, 'one another's' is the standard grammatical form.",
    target: "Reciprocal Pronouns: Genitive Plural Form"
  },
  {
    passage: "The laboratory assistant accidentally spilled a ________ of concentrated hydrochloric acid on the tiled counter.",
    question: "Choose the appropriate partitive unit for a small falling volume of liquid:",
    options: ["drop", "sheet", "loaf", "bar"],
    answer: "drop",
    hint: "A tiny spherical particle of liquid falling from a container is called a...",
    solution: "The minimal partitive measure for an uncontained liquid is a 'drop' of acid/water.",
    target: "Partitive Quantifiers: Liquids"
  },
  {
    passage: "The committee abandoned the rural electrification proposal because ________ citizens attended the public forum.",
    question: "Choose the quantifier indicating an insufficient attendance of countable people:",
    options: ["few", "a few", "little", "a little"],
    answer: "few",
    hint: "'Citizens' is countable plural, and their non-attendance caused the project to be abandoned.",
    solution: "'Few' indicates a negative deficit ('not enough / very few') for countable plural nouns.",
    target: "Determiners: Few vs. A Few"
  },
  {
    passage: "Barely ________ rainfall was recorded in the district throughout the five months of drought.",
    question: "Choose the correct determiner triggered by the semi-negative adverb 'barely':",
    options: ["any", "some", "much", "many"],
    answer: "any",
    hint: "'Barely' negates the clause's polarity, demanding a non-assertive determiner.",
    solution: "'Barely' creates a non-assertive syntactic context, necessitating 'any'.",
    target: "Polarity Determiners: Semi-Negatives"
  },
  {
    passage: "The advice provided by the elder statesmen ________ published in the national daily newspapers.",
    question: "Choose the correct singular verb form:",
    options: ["was", "were", "are", "have been"],
    answer: "was",
    hint: "The subject head is 'advice', an uncountable noun.",
    solution: "'Advice' is an invariable non-count noun, governing the singular auxiliary 'was'.",
    target: "Non-Count Invariables: Subject-Verb Concord"
  },
  {
    passage: "The two sparring partners studied ________ footwork intently during the boxing training session.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["each other's", "each others'", "one another's", "one anothers'"],
    answer: "each other's",
    hint: "Two boxers are observing each other's feet.",
    solution: "Dual reciprocity in the possessive case requires 'each other's'.",
    target: "Reciprocal Pronouns: Genitive Dual Form"
  },
  {
    passage: "The carpenter planed down a thick ________ of mahogany timber to construct the heavy door frame.",
    question: "Choose the appropriate partitive noun for shaped structural wood:",
    options: ["plank", "loaf", "sheet", "grain"],
    answer: "plank",
    hint: "A long, flat, rectangular piece of sawn timber is termed a...",
    solution: "A solid cut length of timber is partitively designated as a 'plank' (or 'beam/board').",
    target: "Partitive Quantifiers: Timber"
  },
  {
    passage: "With ________ patience and diligent coaching, the slow reader eventually caught up with his peers.",
    question: "Choose the quantifier indicating a positive small volume of an abstract mass noun:",
    options: ["a little", "little", "few", "a few"],
    answer: "a little",
    hint: "'Patience' is uncountable, and his eventual success shows that positive patience was exercised.",
    solution: "'A little' conveys a positive quantity ('some amount of') when modifying non-count nouns.",
    target: "Determiners: Little vs. A Little"
  },
  {
    passage: "The headmistress refused to grant ________ concession to students who skipped the practical exams.",
    question: "Choose the correct determiner licensed by the negative verb 'refused':",
    options: ["any", "some", "no", "many"],
    answer: "any",
    hint: "'Refused' contains inherent negative semantics, equivalent to 'would not grant'.",
    solution: "Inherently negative verbs like 'refuse' take non-assertive determiners like 'any'.",
    target: "Polarity Determiners: Inherent Negatives"
  },
  {
    passage: "The jewelry discovered in the archaeological tomb ________ valued at over two million cedis.",
    question: "Choose the correct singular verb form:",
    options: ["was", "were", "are", "have been"],
    answer: "was",
    hint: "'Jewelry' is an uncountable collective noun.",
    solution: "'Jewelry' is non-count and invariable, taking the singular verb 'was'.",
    target: "Non-Count Invariables: Subject-Verb Concord"
  },
  {
    passage: "The seven regional coordinators reviewed ________ performance metrics during the annual appraisal.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["one another's", "one anothers'", "each other's", "each others'"],
    answer: "one another's",
    hint: "Seven coordinators (more than two) are exchanging reviews.",
    solution: "Three or more entities interacting in the possessive case require 'one another's'.",
    target: "Reciprocal Pronouns: Genitive Plural Form"
  },
  {
    passage: "The patient was instructed to dissolve one ________ of effervescent vitamin C in a glass of water.",
    question: "Choose the correct partitive unit for compressed medicinal powder:",
    options: ["tablet", "loaf", "bar", "sheet"],
    answer: "tablet",
    hint: "A small, hard, compressed disk of medicine is a...",
    solution: "A solid compressed unit of medicine is partitively designated as a 'tablet' (or 'pill').",
    target: "Partitive Quantifiers: Medicine"
  },
  {
    passage: "The library had to close down because ________ patrons borrowed books during the semester.",
    question: "Choose the quantifier indicating an unsustainable deficit of count entities:",
    options: ["few", "a few", "little", "a little"],
    answer: "few",
    hint: "'Patrons' is countable, and the closure proves that the number was critically low.",
    solution: "'Few' denotes a severe negative scarcity ('hardly any') for countable nouns.",
    target: "Determiners: Few vs. A Few"
  },
  {
    passage: "She left the conference hall before ________ member could raise an objection to the proposed constitutional amendment.",
    question: "Choose the correct non-assertive determiner:",
    options: ["any", "some", "much", "little"],
    answer: "any",
    hint: "The preposition/conjunction 'before' introduces a non-assertive, non-realized temporal clause.",
    solution: "Clauses introduced by 'before' often operate as non-assertive contexts, requiring 'any'.",
    target: "Polarity Determiners: Non-Assertive Contexts"
  },
  {
    passage: "The garbage accumulated in the market bins ________ evacuated by the waste management company yesterday.",
    question: "Choose the correct singular auxiliary verb:",
    options: ["was", "were", "are", "have been"],
    answer: "was",
    hint: "'Garbage' is an uncountable collective noun.",
    solution: "'Garbage' is an invariable non-count noun and takes the singular verb 'was evacuated'.",
    target: "Non-Count Invariables: Subject-Verb Concord"
  },
  {
    passage: "The two business partners signed ________ contract copies in the presence of their legal counsel.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["each other's", "each others'", "one another's", "one anothers'"],
    answer: "each other's",
    hint: "Two partners exchanging signed copies.",
    solution: "Dual reference in the possessive case mandates 'each other's'.",
    target: "Reciprocal Pronouns: Genitive Dual Form"
  },
  {
    passage: "The mechanic applied a heavy ________ of industrial grease to lubricate the wheel bearings.",
    question: "Choose the appropriate partitive unit for a thick semi-solid layer:",
    options: ["coating", "loaf", "sheet", "grain"],
    answer: "coating",
    hint: "A continuous surface layer of grease or paint is termed a...",
    solution: "A layer of semi-solid substance like grease or paint is partitively termed a 'coating' (or 'dab/smear').",
    target: "Partitive Quantifiers: Semi-Solids"
  },
  {
    passage: "The rural clinic has ________ vials of snake antivenom left, so doctors are pleading for immediate restocking.",
    question: "Choose the quantifier indicating a dangerous deficit of countable containers:",
    options: ["few", "a few", "little", "a little"],
    answer: "few",
    hint: "'Vials' is a plural count noun, and the doctors' alarm indicates a severe shortage.",
    solution: "'Few' expresses a negative deficit ('not enough') for count nouns.",
    target: "Determiners: Few vs. A Few"
  },
  {
    passage: "He passed the rigorous military physical examination without ________ signs of exhaustion.",
    question: "Choose the correct determiner licensed by the preposition 'without':",
    options: ["any", "some", "much", "little"],
    answer: "any",
    hint: "'Without' is an inherent negative trigger.",
    solution: "The negative environment triggered by 'without' requires 'any'.",
    target: "Polarity Determiners: Inherent Negatives"
  },
  {
    passage: "The software installed on all twenty school computers ________ regular security updates.",
    question: "Choose the correct singular verb form:",
    options: ["requires", "require", "are requiring", "have required"],
    answer: "requires",
    hint: "'Software' is an uncountable mass noun regardless of how many computers it is on.",
    solution: "'Software' is an invariable non-count noun and governs the singular verb 'requires'.",
    target: "Non-Count Invariables: Subject-Verb Concord"
  },
  {
    passage: "All twelve prefects pledged to support ________ initiatives to improve school discipline.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["one another's", "one anothers'", "each other's", "each others'"],
    answer: "one another's",
    hint: "Twelve prefects (three or more) supporting initiatives mutually.",
    solution: "Possessive reciprocity among three or more entities requires 'one another's'.",
    target: "Reciprocal Pronouns: Genitive Plural Form"
  },
  {
    passage: "The chef garnished the roasted mutton with a fresh ________ of aromatic rosemary.",
    question: "Choose the correct botanical partitive unit for small leafy plant stems:",
    options: ["sprig", "bar", "sheet", "loaf"],
    answer: "sprig",
    hint: "A small shoot or stem of an herb with leaves is termed a...",
    solution: "The standard partitive measure for fresh culinary herbs is a 'sprig' (e.g., 'a sprig of rosemary/thyme').",
    target: "Partitive Quantifiers: Herbs"
  },
  {
    passage: "There were ________ survivors from the catastrophic aviation crash, bringing profound grief to the nation.",
    question: "Choose the quantifier expressing an extreme lack of countable survivors:",
    options: ["few", "a few", "little", "a little"],
    answer: "few",
    hint: "'Survivors' is a plural count noun, and the national grief indicates almost no one survived.",
    solution: "'Few' expresses an extreme negative scarcity ('hardly any') when modifying count plural nouns.",
    target: "Determiners: Few vs. A Few"
  },
  {
    passage: "The police inspector would scarcely allow ________ spectator to cross the cordon around the crime scene.",
    question: "Choose the correct non-assertive determiner triggered by 'scarcely':",
    options: ["any", "some", "no", "many"],
    answer: "any",
    hint: "'Scarcely' is a semi-negative adverb that requires a non-assertive determiner.",
    solution: "'Scarcely' acts as a negative polarity trigger, requiring the non-assertive determiner 'any'.",
    target: "Polarity Determiners: Semi-Negatives"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// Strand 3 Focus: Complex Countability, Deficit Quantification,
// Genitive Reciprocals, and Inherent Negative Polarity Triggers
// =========================================================================
const capstone5B7GrammarIntermediateQuestions = [
  {
    questionNumber: 51,
    question: "In paragraph 1, what morphological and syntactic rule is demonstrated by the terms 'infrastructure', 'information', and 'equipment'?",
    options: [
      "They are non-count mass nouns that govern singular verb concord and must never be suffixed with plural '-s'",
      "They are irregular count nouns that pluralize with internal vowel changes",
      "They are adjectives functioning as nominal heads",
      "They are borrowed Latin nouns that pluralize with '-a'"
    ],
    answer: "They are non-count mass nouns that govern singular verb concord and must never be suffixed with plural '-s'",
    hint: "Notice how these words are constructed without plural endings and take singular determiners or modifiers.",
    solution: "Paragraph 1 highlights invariable non-count nouns ('infrastructure', 'information', 'equipment') which retain singular morphology and reject plural '-s'.",
    target: "Capstone Exam: Non-Count Nominal Syntax"
  },
  {
    questionNumber: 52,
    question: "In paragraph 2, why is the genitive reciprocal construction 'each other's' used when referring to the market registers?",
    options: [
      "Because exactly two executives (chairwoman and secretary) are mutually consulting registers belonging to them",
      "Because 'each other's' is used whenever women are speaking in public",
      "Because the registers were printed in two different languages",
      "Because the market has two main entry gates"
    ],
    answer: "Because exactly two executives (chairwoman and secretary) are mutually consulting registers belonging to them",
    hint: "Identify the number of leaders involved and note the possessive relationship to 'registers'.",
    solution: "Paragraph 2 specifies dual leadership (chairwoman and secretary). Dual reciprocal possession requires 'each other's'.",
    target: "Capstone Exam: Genitive Reciprocal Duality"
  },
  {
    questionNumber: 53,
    question: "In paragraph 3, what semantic distinction is illustrated between 'very little potable water' and 'a few bottles reserved'?",
    options: [
      "'Very little' expresses an extreme negative deficit for an uncountable noun (water), while 'a few' expresses a positive small number for a countable noun (bottles)",
      "'Very little' means a massive flood, while 'a few' means an empty shelf",
      "Both terms are interchangeable and refer exclusively to countable units",
      "'Very little' modifies count nouns, while 'a few' modifies non-count nouns"
    ],
    answer: "'Very little' expresses an extreme negative deficit for an uncountable noun (water), while 'a few' expresses a positive small number for a countable noun (bottles)",
    hint: "Check which noun is uncountable (water) versus countable (bottles), and consider the positive/negative tone of each.",
    solution: "'Water' is non-count; 'very little' indicates a dangerous scarcity ('almost none'). 'Bottles' is count plural; 'a few' indicates a positive small reserve ('some').",
    target: "Capstone Exam: Quantitative Deficit Analysis"
  },
  {
    questionNumber: 54,
    question: "In paragraph 4, why does the sentence 'the health directorate would barely tolerate any sanitary infractions' require the determiner 'any' instead of 'some'?",
    options: [
      "Because the adverb 'barely' is a semi-negative trigger that mandates a non-assertive determiner",
      "Because 'infractions' is an uncountable mass noun",
      "Because the inspector was speaking to more than eighty people",
      "Because 'some' can never be used in spoken English"
    ],
    answer: "Because the adverb 'barely' is a semi-negative trigger that mandates a non-assertive determiner",
    hint: "Identify the negative or semi-negative force of the adverb 'barely'.",
    solution: "'Barely' has semi-negative polarity. In standard English, negative and semi-negative triggers license the non-assertive determiner 'any'.",
    target: "Capstone Exam: Semi-Negative Polarity Licensing"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the reciprocal rule governing the eighty stallholders in paragraph 4.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Plural groups of three or more use 'one another'.",
      "Because there were eighty traders gathered together, they used 'one another' correctly.",
      "Using reciprocal pronouns for plural groups containing three or more entities in English.",
      "Plural reciprocal pronouns."
    ],
    answer: "Plural groups of three or more use 'one another'.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Plural groups of three or more use 'one another'' is exactly 8 words, forms a complete Subject-Verb-Object sentence, and states the reciprocal rule directly. Option C is a fragment (0 marks), and Option B has 14 words.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployStrand3B7Intermediate() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Building 55 UNIQUE questions for Basic 7 (JHS 1) Strand 3 Grammar Intermediate Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B7GrammarIntermediateDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B7_G_I_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B7",
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
      learningCompetency: "B7.3.1.1: Demonstrate intermediate mastery of invariable noun concord, genitive reciprocal pronouns, deficit quantifiers (little vs. few), and semi-negative polarity determiners."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B7GrammarIntermediateQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${b7GrammarIntermediateCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B7_G_I_${item.questionNumber}`,
      level: "B7",
      difficulty: "intermediate",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: b7GrammarIntermediateCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B7.3.1.1 / B7.3.1.2: Synthesize intermediate multi-paragraph contextual grammar, evaluating subject-verb concord with mass nouns, genitive reciprocals, deficit quantifiers, and concise rule summaries."
    });
  });

  // 3. Write directly to Firestore subcollections across all parent paths
  const topicId = "grammar_lexis_prepositions_and_phrasal_verbs";
  const parentPaths = [
    "global_curriculum/jhs/subjects/english/topical",
    "global_curriculum/jhs/subjects/english/topics",
    "global_curriculum/jhs/subjects/english/topical_units"
  ];

  console.log("\nWriting to subcollections (practice_labs/B7_intermediate)...");
  for (const parent of parentPaths) {
    const subDocRef = db.doc(`${parent}/${topicId}/practice_labs/B7_intermediate`);
    await subDocRef.set({
      level: "B7",
      difficulty: "intermediate",
      title: "Basic 7 Intermediate Lab: 50 Unique Grammar Drills + 5 Capstone Exam Questions",
      totalQuestions: all55Questions.length,
      shortDrillsCount: 50,
      capstoneExamQuestionsCount: 5,
      questions: all55Questions,
      metadata: {
        hasDuplicateQuestions: false,
        uniqueQuestionsCount: 55,
        structure: "50 Unique Short Drills (Invariable Concord, Genitive Reciprocals, Deficits, Polarity) + 5 Capstone Full-Passage Questions",
        passageVisibility: "Passage embedded both in passageText and at the top of prompt",
        curriculum: "NaCCA Common Core Programme (CCP) Standard",
        strand: "Strand 3: Grammar & Usage",
        subStrand: "Sub-Strand 1: Parts of Speech, Phrasal Verbs & Prepositions",
        canonicalTopicPath: `${parent}/${topicId}`,
        updatedAt: new Date().toISOString()
      }
    }, { merge: true });
    console.log(`✅ Subcollection updated at: ${subDocRef.path}`);
  }

  // 4. Synchronize into main document practicePool.medium for b7
  console.log("\nSynchronizing main document practicePool.medium for b7...");
  const mappedMediumQuestions = all55Questions.map(q => ({
    id: q.id,
    difficulty: 'medium' as const,
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: 1
  }));

  for (const parent of parentPaths) {
    const mainRef = db.doc(`${parent}/${topicId}`);
    const snap = await mainRef.get();
    if (snap.exists) {
      const data = snap.data() || {};
      const existingLevels = data.levels || {};
      const b7Level = existingLevels.b7 || {};

      const updatedLevels: any = {
        ...existingLevels,
        b7: {
          ...b7Level,
          practicePool: {
            ...(b7Level.practicePool || {}),
            medium: mappedMediumQuestions
          }
        }
      };

      await mainRef.set({
        ...data,
        levels: updatedLevels,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log(`✅ Updated main document practicePool.medium at: ${mainRef.path}`);
    }
  }

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all55Questions.length} unique questions to Strand 3 B7 Intermediate Lab!`);
}

deployStrand3B7Intermediate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 3 B7 Intermediate Lab:", err);
    process.exit(1);
  });
