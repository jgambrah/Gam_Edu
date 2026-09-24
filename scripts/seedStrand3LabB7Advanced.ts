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
// Strand 3 Focus: Complex Nominal Morphology, Invariable Concord,
// Reciprocal Case Transformations, and Advanced Polarity Triggers
// =========================================================================
const b7GrammarAdvancedCapstonePassage = 
`The parliamentary select committee on technical education conducted an unannounced oversight audit of three regional vocational institutes in southern Ghana. Presenting their preliminary memorandum, the rapporteurs underscored that several state-of-the-art pieces of machinery and diagnostic equipment procured under the bilateral industrial grant remained locked inside the bonded warehouse. The report noted that while administrative stationery was in short supply, misleading information concerning distribution logistics had exacerbated institutional delays across the polytechnic grid.

During the joint inspection of the engineering foundry, the director-general and the principal auditor examined the inventory ledgers side by side. Because both constitutional officers were co-signatories to the disbursement warrant, they cross-referenced each other's documentation with meticulous care before endorsing the clearance certificates. In their executive debriefing, the committee commended the administrative synergy, observing that when statutory regulators audit each other's expenditures transparently, institutional malfeasance is curtailed.

The delegation subsequently assessed the industrial metallurgy workshop. The supervising engineer lamented that the laboratory had little electrical coolant remaining in the main reservoir, forcing the precision milling turbines to operate at dangerously elevated temperatures. To avert catastrophic mechanical failure, the logistics coordinator promptly requisitioned five metric tons of specialized lubricating grease, twenty ingots of cast bronze, and thirty rolls of asbestos shielding. When an apprentice enquired whether there were any spare diamond-tipped cutting bits stored in the secure vault, the storekeeper affirmed that there were a few left in the emergency cabinet.

In their concluding assembly with the faculty deans, the committee addressed all seventy senior lecturers gathered in the council chamber. The chairman commended the diverse departmental heads for collaborating with one another throughout the rigorous institutional appraisal. Nevertheless, he issued an unyielding policy directive: the statutory council would scarcely tolerate any fraudulent manipulation of equipment logs during the subsequent fiscal cycle. He urged the academic leadership to preserve institutional cohesion and safeguard one another's professional integrity so that no faculty member would incur statutory disciplinary sanctions.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Advanced B7 Competencies: Morphosyntactic Countability, Invariable Mass
// Concord in Complex Subject NP Structures, Genitive Reciprocal Case
// Transformations, Submerged Negatives & High-Register Partitive Systems
// =========================================================================
const unique50B7GrammarAdvancedDrills = [
  {
    passage: "The comprehensive financial information, compiled painstakingly across eighteen municipal districts, ________ submitted to the auditor-general yesterday.",
    question: "Choose the grammatically correct singular auxiliary verb:",
    options: ["was", "were", "are", "have been"],
    answer: "was",
    hint: "Identify the true head of the complex subject noun phrase, ignoring the intervening prepositional phrase.",
    solution: "The grammatical subject head is the non-count noun 'information', not the plural noun 'districts'. Invariable non-count nouns govern singular concord ('was').",
    target: "Complex NP Concord: Invariable Mass Noun"
  },
  {
    passage: "The two rival defense attorneys challenged ________ constitutional interpretations during the landmark Supreme Court hearing.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["each other's", "each others'", "one another's", "one anothers'"],
    answer: "each other's",
    hint: "Two attorneys are involved, and the modifier indicates possession of interpretations.",
    solution: "Dual reciprocal reference mandates 'each other'. The genitive case is formed by suffixing an apostrophe and 's' ('each other's').",
    target: "Reciprocal Pronouns: Genitive Dual Form"
  },
  {
    passage: "The silversmith melted four ________ of refined bullion to cast the ceremonial mace for parliament.",
    question: "Choose the precise technical partitive noun for molded precious metals:",
    options: ["ingots", "bars", "sheets", "loaves"],
    answer: "ingots",
    hint: "Heavy blocks of cast precious metal are technically designated as...",
    solution: "An 'ingot' is the formal metallurgical and partitive term for a mass of metal cast into a convenient shape for storage or refinement.",
    target: "Technical Partitive Systems: Metallurgy"
  },
  {
    passage: "The drought-stricken community had ________ potable water stored in the subterranean reservoir, triggering an immediate humanitarian crisis.",
    question: "Choose the quantifier denoting a perilous, extreme negative deficit for the non-count noun 'water':",
    options: ["little", "a little", "few", "a few"],
    answer: "little",
    hint: "'Water' is non-count, and the resulting crisis proves that the available volume was virtually non-existent.",
    solution: "'Little' conveys a negative deficit ('almost none') when modifying uncountable mass nouns. 'A little' would imply a sufficient small supply.",
    target: "Determiners: Little vs. A Little"
  },
  {
    passage: "The renegade minister escaped across the sovereign border without ________ intelligence operative detecting his disguised departure.",
    question: "Choose the grammatically mandatory non-assertive determiner licensed by the preposition 'without':",
    options: ["any", "some", "much", "many"],
    answer: "any",
    hint: "'Without' inherently establishes a negative polarity environment.",
    solution: "The preposition 'without' functions as an inherent negative trigger, obligatorily selecting the non-assertive determiner 'any'.",
    target: "Polarity Licensing: Inherent Negatives"
  },
  {
    passage: "The specialized electronic equipment, including three oscilloscopes and ten spectrum analyzers, ________ damaged during transit.",
    question: "Choose the correct singular verb form:",
    options: ["was", "were", "are", "have been"],
    answer: "was",
    hint: "Parenthetical prepositional phrases introduced by 'including' do not alter the singular agreement of the head noun 'equipment'.",
    solution: "'Equipment' is an invariable non-count noun. The intervening parenthetical phrase does not affect concord; the singular auxiliary 'was' is required.",
    target: "Complex NP Concord: Equipment with Prepositional Modifiers"
  },
  {
    passage: "All thirty-two African Union heads of state ratified ________ bilateral trade treaties at the diplomatic summit.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["one another's", "one anothers'", "each other's", "each others'"],
    answer: "one another's",
    hint: "Thirty-two sovereign leaders (three or more entities) are in mutual possession.",
    solution: "For reciprocal interaction among three or more entities in the possessive case, 'one another's' is the standard form.",
    target: "Reciprocal Pronouns: Genitive Plural Form"
  },
  {
    passage: "The aircraft manufacturer imported twenty ________ of structural titanium alloy to construct the fuselage ribs.",
    question: "Choose the appropriate industrial partitive noun for rolled or flat metal:",
    options: ["sheets", "loaves", "bars", "grains"],
    answer: "sheets",
    hint: "Broad, flat structural metals used in aerospace manufacture are measured in...",
    solution: "Broad, uniform industrial planes of metal, glass, and composite material are partitively classified as 'sheets'.",
    target: "Partitive Quantifiers: Industrial Alloys"
  },
  {
    passage: "Because the candidate indulged in vitriolic personal attacks, he secured ________ votes during the student representative council elections.",
    question: "Choose the quantifier indicating an acute negative scarcity for countable plural nouns:",
    options: ["few", "a few", "little", "a little"],
    answer: "few",
    hint: "'Votes' is a countable plural noun, and his offensive behavior resulted in almost no electoral support.",
    solution: "'Few' without an indefinite article conveys a negative deficit ('virtually none') when modifying count plural nouns.",
    target: "Determiners: Few vs. A Few"
  },
  {
    passage: "Scarcely ________ delegate raised an objection when the constitutional amendments were tabled before the assembly.",
    question: "Choose the correct non-assertive determiner licensed by 'scarcely':",
    options: ["any", "some", "no", "many"],
    answer: "any",
    hint: "'Scarcely' is a semi-negative adverb that triggers non-assertive polarity.",
    solution: "Semi-negative adverbs ('scarcely', 'hardly', 'barely') trigger non-assertive polarity, requiring 'any'.",
    target: "Polarity Determiners: Semi-Negatives"
  },
  {
    passage: "The office stationery ordered by the procurement directorate, including thirty boxes of letterheads and ledger cards, ________ arrived.",
    question: "Choose the correct singular present-perfect auxiliary:",
    options: ["has", "have", "are", "were"],
    answer: "has",
    hint: "The subject head is 'stationery', an uncountable noun.",
    solution: "'Stationery' is an invariable mass noun and governs the singular auxiliary 'has'.",
    target: "Non-Count Invariables: Subject-Verb Concord"
  },
  {
    passage: "The two presidential candidates debated intensely, constantly rebutting ________ economic projections.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["each other's", "each others'", "one another's", "one anothers'"],
    answer: "each other's",
    hint: "Dual reciprocity with possessive modification of 'economic projections'.",
    solution: "Dual reciprocal reference in the possessive case requires 'each other's'.",
    target: "Reciprocal Pronouns: Genitive Dual Form"
  },
  {
    passage: "The pharmacist dispensed two ________ of concentrated liquid penicillin for the pediatric patient.",
    question: "Choose the precise pharmaceutical partitive container noun:",
    options: ["vials", "loaves", "bars", "sheets"],
    answer: "vials",
    hint: "Small sealed glass or plastic vessels containing injectable liquid medicines are called...",
    solution: "A 'vial' (or 'ampoule') is the specialized partitive container for sterile liquid medications.",
    target: "Partitive Quantifiers: Pharmaceuticals"
  },
  {
    passage: "The stranded explorers rejoiced when they discovered ________ edible berries along the river bank, sustaining them until dawn.",
    question: "Choose the quantifier expressing a reassuring, positive small number:",
    options: ["a few", "few", "little", "a little"],
    answer: "a few",
    hint: "'Berries' is countable, and finding them saved the explorers from starvation (positive sense).",
    solution: "'A few' denotes a positive small number ('several/some') for countable plural nouns.",
    target: "Determiners: Few vs. A Few"
  },
  {
    passage: "The high court judge noted that the plaintiff had produced ________ documentary evidence to substantiate his claim.",
    question: "Choose the negative determiner that maintains standard syntax with an affirmative verb:",
    options: ["no", "any", "none", "neither"],
    answer: "no",
    hint: "The sentence requires a determiner to directly modify the uncountable noun 'evidence' following the affirmative verb 'produced'.",
    solution: "'No' functions as a negative determiner modifying the noun 'evidence'. 'Any' would require an auxiliary negative ('had not produced any').",
    target: "Determiners: Negative Determiner 'No'"
  },
  {
    passage: "The heavy machinery deployed across the three open-pit bauxite mines ________ constant hydraulic calibration.",
    question: "Choose the correct singular verb form:",
    options: ["requires", "require", "are requiring", "have required"],
    answer: "requires",
    hint: "The head noun is 'machinery', which is uncountable.",
    solution: "'Machinery' is an invariable non-count noun and governs third-person singular present verb agreement ('requires').",
    target: "Non-Count Invariables: Subject-Verb Concord"
  },
  {
    passage: "The five permanent members of the United Nations Security Council frequently veto ________ resolutions.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["one another's", "one anothers'", "each other's", "each others'"],
    answer: "one another's",
    hint: "Five members (three or more entities) are in mutual action.",
    solution: "Reciprocal interaction among three or more entities in the possessive case demands 'one another's'.",
    target: "Reciprocal Pronouns: Genitive Plural Form"
  },
  {
    passage: "The textile merchant unrolled a sixty-meter ________ of hand-woven kente cloth before the royal delegation.",
    question: "Choose the correct commercial partitive noun for continuous fabric:",
    options: ["bolt", "bar", "sheet", "loaf"],
    answer: "bolt",
    hint: "A complete commercial roll of finished fabric is technically called a...",
    solution: "A 'bolt' is the standard partitive and commercial term for a roll of fabric.",
    target: "Partitive Quantifiers: Textiles"
  },
  {
    passage: "The hospital director expressed grave concern because there was ________ oxygen remaining in the intensive care cylinders.",
    question: "Choose the quantifier denoting a dangerous, life-threatening deficit for a non-count noun:",
    options: ["little", "a little", "few", "a few"],
    answer: "little",
    hint: "'Oxygen' is an uncountable gas, and the director's alarm signals a critical shortage.",
    solution: "'Little' modifies non-count nouns to denote an extreme negative deficit ('almost none').",
    target: "Determiners: Little vs. Few"
  },
  {
    passage: "The accused corporation denied having ________ knowledge of the toxic waste dumping.",
    question: "Choose the correct determiner licensed by the inherently negative verb 'denied':",
    options: ["any", "some", "much", "many"],
    answer: "any",
    hint: "'Denied' has inherent negative polarity, meaning 'asserted that they had no...'",
    solution: "Inherently negative verbs like 'deny', 'forbid', or 'refuse' license the non-assertive determiner 'any'.",
    target: "Polarity Licensing: Inherent Negatives"
  },
  {
    passage: "The luggage, consisting of four heavy trunks and two leather suitcases, ________ impounded by customs officers.",
    question: "Choose the correct singular auxiliary verb:",
    options: ["was", "were", "are", "have been"],
    answer: "was",
    hint: "The subject head is 'luggage', an uncountable noun.",
    solution: "'Luggage' is non-count and invariable. The intervening parenthetical phrase does not alter concord; 'was' is required.",
    target: "Complex NP Concord: Luggage with Appositive Modifiers"
  },
  {
    passage: "The two autonomous municipal assemblies inspected ________ boundary demarcation lines to prevent territorial disputes.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["each other's", "each others'", "one another's", "one anothers'"],
    answer: "each other's",
    hint: "Exactly two assemblies are involved.",
    solution: "Dual reference in the genitive case requires 'each other's'.",
    target: "Reciprocal Pronouns: Genitive Dual Form"
  },
  {
    passage: "The civil engineer specified thirty ________ of structural steel to build the suspension bridge towers.",
    question: "Choose the appropriate industrial partitive noun for solid steel beams:",
    options: ["girders", "loaves", "sheets", "grains"],
    answer: "girders",
    hint: "Large iron or steel beams used in building bridges are called...",
    solution: "A 'girder' functions as a structural partitive unit for manufactured steel beams.",
    target: "Technical Partitive Systems: Structural Engineering"
  },
  {
    passage: "With ________ tact and diplomatic poise, the mediator resolved the protracted chieftaincy impasse.",
    question: "Choose the quantifier indicating a positive small volume of an abstract mass noun:",
    options: ["a little", "little", "few", "a few"],
    answer: "a little",
    hint: "'Tact' is uncountable, and successful resolution implies that a positive, effective amount was exercised.",
    solution: "'A little' expresses a positive small amount ('some') when modifying uncountable mass nouns.",
    target: "Determiners: Little vs. A Little"
  },
  {
    passage: "The border control task force allowed no cargo vehicles to pass without ________ valid customs manifests.",
    question: "Choose the correct non-assertive determiner licensed by 'without':",
    options: ["any", "some", "much", "many"],
    answer: "any",
    hint: "'Without' inherently establishes a negative polarity environment modifying plural nouns.",
    solution: "The preposition 'without' functions as an inherent negative trigger, selecting the non-assertive determiner 'any'.",
    target: "Polarity Licensing: Inherent Negatives"
  },
  {
    passage: "The traffic congestion on the coastal highway, compounded by heavy torrential downpours, ________ unmanageable for the transit police.",
    question: "Choose the correct singular verb form:",
    options: ["was", "were", "are", "have been"],
    answer: "was",
    hint: "'Traffic' or 'congestion' is the non-count head noun.",
    solution: "'Traffic congestion' is non-count; the intervening participial phrase does not change the singular requirement ('was').",
    target: "Non-Count Invariables: Subject-Verb Concord"
  },
  {
    passage: "The four competing telecommunications networks monitored ________ tariff reductions with intense commercial scrutiny.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["one another's", "one anothers'", "each other's", "each others'"],
    answer: "one another's",
    hint: "Four networks are mutually monitoring one another.",
    solution: "Three or more entities interacting in the possessive case require 'one another's'.",
    target: "Reciprocal Pronouns: Genitive Plural Form"
  },
  {
    passage: "The bio-chemist placed a single ________ of bacterial culture onto the nutrient agar plate.",
    question: "Choose the precise partitive unit for microscopic biological samples:",
    options: ["smear", "bar", "loaf", "sheet"],
    answer: "smear",
    hint: "A thin film of tissue or bacterial fluid applied to a slide is termed a...",
    solution: "A 'smear' is the specialized laboratory partitive for a thin specimen spread on a glass slide.",
    target: "Partitive Quantifiers: Laboratory Science"
  },
  {
    passage: "The remote island clinic had ________ ampoules of tetanus vaccine in stock, necessitating an emergency airlift.",
    question: "Choose the quantifier denoting a critical scarcity of countable medical units:",
    options: ["few", "a few", "little", "a little"],
    answer: "few",
    hint: "'Ampoules' is a plural count noun, and the emergency airlift confirms a dangerous deficit.",
    solution: "'Few' expresses an acute negative deficit ('almost none') for countable plural nouns.",
    target: "Determiners: Few vs. A Few"
  },
  {
    passage: "Barely ________ citizen cast a ballot in the disputed local government re-run elections.",
    question: "Choose the non-assertive determiner licensed by the semi-negative adverb 'barely':",
    options: ["any", "some", "no", "many"],
    answer: "any",
    hint: "'Barely' triggers non-assertive polarity.",
    solution: "'Barely' negates clausal polarity, demanding the non-assertive determiner 'any'.",
    target: "Polarity Determiners: Semi-Negatives"
  },
  {
    passage: "The advice rendered by the constitutional experts, though criticized by partisan commentators, ________ sound.",
    question: "Choose the correct singular verb form:",
    options: ["was", "were", "are", "have been"],
    answer: "was",
    hint: "The subject head is 'advice', an uncountable abstract noun.",
    solution: "'Advice' is an invariable non-count noun and takes the singular auxiliary 'was'.",
    target: "Non-Count Invariables: Subject-Verb Concord"
  },
  {
    passage: "The co-defendants conferred in whispers, synchronizing ________ alibis before entering the witness box.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["each other's", "each others'", "one another's", "one anothers'"],
    answer: "each other's",
    hint: "'Co-defendants' denotes two defendants coordinating together.",
    solution: "Dual reciprocal possession requires 'each other's'.",
    target: "Reciprocal Pronouns: Genitive Dual Form"
  },
  {
    passage: "The master builder requisitioned two hundred ________ of kiln-fired clay to complete the acoustic auditorium.",
    question: "Choose the correct partitive unit for compressed building masonry:",
    options: ["blocks", "sheets", "loaves", "bars"],
    answer: "blocks",
    hint: "Rectangular masses of clay or concrete for construction are termed...",
    solution: "Masonry clay or concrete units are partitively designated as 'blocks' (or 'bricks').",
    target: "Partitive Quantifiers: Masonry"
  },
  {
    passage: "The research team made ________ progress initially, but persistent funding cuts halted the trial.",
    question: "Choose the quantifier indicating a positive but small amount of non-count progress:",
    options: ["a little", "little", "few", "a few"],
    answer: "a little",
    hint: "'Progress' is uncountable, and 'initially' signals that tangible, positive advancement occurred.",
    solution: "'A little' denotes a positive, reassuring small quantity for non-count nouns.",
    target: "Determiners: Little vs. A Little"
  },
  {
    passage: "The university senate refused to enter into ________ negotiation with the unauthorized student syndicate.",
    question: "Choose the correct non-assertive determiner following 'refused':",
    options: ["any", "some", "no", "many"],
    answer: "any",
    hint: "'Refused' contains inherent negative semantics.",
    solution: "Inherently negative verbs like 'refuse' mandate non-assertive determiners like 'any'.",
    target: "Polarity Licensing: Inherent Negatives"
  },
  {
    passage: "The jewelry confiscated from the international smuggler's safe ________ five diamond-encrusted tiaras.",
    question: "Choose the correct singular verb form:",
    options: ["includes", "include", "are including", "have included"],
    answer: "includes",
    hint: "'Jewelry' is a collective non-count noun.",
    solution: "'Jewelry' is an invariable non-count noun governing the third-person singular present verb 'includes'.",
    target: "Non-Count Invariables: Subject-Verb Concord"
  },
  {
    passage: "The ten member states of the regional economic bloc honored ________ sovereign extradition treaties.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["one another's", "one anothers'", "each other's", "each others'"],
    answer: "one another's",
    hint: "Ten states (three or more) are in mutual compliance.",
    solution: "Possessive reciprocity among three or more entities mandates 'one another's'.",
    target: "Reciprocal Pronouns: Genitive Plural Form"
  },
  {
    passage: "The jeweler mounted a flawless ________ of calibrated diamond onto the platinum crown.",
    question: "Choose the precise partitive unit for gemstones:",
    options: ["carat", "bar", "sheet", "loaf"],
    answer: "carat",
    hint: "A unit of mass for gemstones and pearls, equal to 200 milligrams, is a...",
    solution: "A 'carat' is the specific technical partitive measurement for precious gemstones.",
    target: "Partitive Quantifiers: Gemstones"
  },
  {
    passage: "Because the candidate lacked charismatic appeal, he attracted ________ supporters to the political rally.",
    question: "Choose the quantifier indicating an acute scarcity of countable supporters:",
    options: ["few", "a few", "little", "a little"],
    answer: "few",
    hint: "'Supporters' is a plural count noun, and his poor appeal caused low attendance.",
    solution: "'Few' expresses a negative deficit ('not many / almost none') for countable plural nouns.",
    target: "Determiners: Few vs. A Few"
  },
  {
    passage: "The diplomat concluded the treaty before ________ delegate could table a counter-motion.",
    question: "Choose the non-assertive determiner licensed in non-realized temporal clauses introduced by 'before':",
    options: ["any", "some", "much", "little"],
    answer: "any",
    hint: "'Before' establishes a non-assertive, unactualized temporal environment.",
    solution: "Non-realized temporal clauses introduced by 'before' take the non-assertive determiner 'any'.",
    target: "Polarity Determiners: Non-Assertive Contexts"
  },
  {
    passage: "The garbage dumped along the coastal littoral ________ hazardous hospital syringes and clinical waste.",
    question: "Choose the correct singular verb form:",
    options: ["contains", "contain", "are containing", "have contained"],
    answer: "contains",
    hint: "The subject head is 'garbage', an uncountable mass noun.",
    solution: "'Garbage' is non-count and invariable, governing the singular verb 'contains'.",
    target: "Non-Count Invariables: Subject-Verb Concord"
  },
  {
    passage: "The two trading banks guaranteed ________ credit risk during the sovereign bond syndication.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["each other's", "each others'", "one another's", "one anothers'"],
    answer: "each other's",
    hint: "Exactly two institutions are involved in mutual risk guaranteeing.",
    solution: "Dual reciprocal reference in the possessive case requires 'each other's'.",
    target: "Reciprocal Pronouns: Genitive Dual Form"
  },
  {
    passage: "The vulcanizer applied a thick ________ of synthetic rubber paste to seal the tire puncture.",
    question: "Choose the appropriate partitive noun for a spread semi-solid layer:",
    options: ["patch", "loaf", "sheet", "grain"],
    answer: "patch",
    hint: "A piece of material placed over a hole or applied as a protective layer is a...",
    solution: "A 'patch' (or 'coating/layer') is the functional partitive unit for repairing rubber surfaces.",
    target: "Partitive Quantifiers: Industrial Maintenance"
  },
  {
    passage: "The remote island community has ________ teachers for its three hundred schoolchildren.",
    question: "Choose the quantifier indicating an unsustainable, severe deficit of professionals:",
    options: ["few", "a few", "little", "a little"],
    answer: "few",
    hint: "'Teachers' is countable plural, and 300 pupils with an acute teacher shortage indicates severe deficit.",
    solution: "'Few' denotes an extreme negative deficit ('hardly any') when modifying countable plural nouns.",
    target: "Determiners: Few vs. A Few"
  },
  {
    passage: "The border control task force permitted no cargo to enter the sovereign republic without ________ customs declaration.",
    question: "Choose the correct non-assertive determiner licensed by 'without':",
    options: ["any", "some", "much", "many"],
    answer: "any",
    hint: "'Without' inherently establishes negative polarity.",
    solution: "'Without' licenses the non-assertive determiner 'any' when modifying non-count or non-specific nouns.",
    target: "Polarity Licensing: Inherent Negatives"
  },
  {
    passage: "The software running on the automated airport radar servers ________ constant debugging.",
    question: "Choose the correct singular verb form:",
    options: ["requires", "require", "are requiring", "have required"],
    answer: "requires",
    hint: "'Software' is an uncountable noun.",
    solution: "'Software' is an invariable non-count noun and takes the singular verb 'requires'.",
    target: "Non-Count Invariables: Subject-Verb Concord"
  },
  {
    passage: "All fifteen divisional chiefs in the traditional council respected ________ ancestral land boundaries.",
    question: "Choose the correct genitive reciprocal pronoun:",
    options: ["one another's", "one anothers'", "each other's", "each others'"],
    answer: "one another's",
    hint: "Fifteen traditional chiefs (three or more entities) are respecting boundaries mutually.",
    solution: "Possessive reciprocity among three or more entities requires 'one another's'.",
    target: "Reciprocal Pronouns: Genitive Plural Form"
  },
  {
    passage: "The herbalist administered a single ________ of crushed neem bark to reduce the fever.",
    question: "Choose the botanical and pharmaceutical partitive unit:",
    options: ["dose", "bar", "sheet", "loaf"],
    answer: "dose",
    hint: "A quantity of medicine taken at one time is a...",
    solution: "A 'dose' is the medical partitive unit for measured quantities of medicine.",
    target: "Partitive Quantifiers: Medicine"
  },
  {
    passage: "Because the candidate presented an incoherent economic plan, ________ voters cast their ballots in his favor.",
    question: "Choose the quantifier indicating an acute lack of countable voters:",
    options: ["few", "a few", "little", "a little"],
    answer: "few",
    hint: "'Voters' is countable, and an incoherent plan resulted in almost no votes.",
    solution: "'Few' denotes a severe negative scarcity ('virtually none') for countable plural nouns.",
    target: "Determiners: Few vs. A Few"
  },
  {
    passage: "The military checkpoint commander would scarcely permit ________ civilian vehicle to enter the combat zone.",
    question: "Choose the non-assertive determiner licensed by 'scarcely':",
    options: ["any", "some", "no", "many"],
    answer: "any",
    hint: "'Scarcely' is a semi-negative trigger.",
    solution: "'Scarcely' creates a non-assertive polarity environment, demanding 'any'.",
    target: "Polarity Determiners: Semi-Negatives"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// Strand 3 Focus: Complex Countability, Invariable Mass Concord,
// Reciprocal Case Transformations, and Advanced Polarity Triggers
// =========================================================================
const capstone5B7GrammarAdvancedQuestions = [
  {
    questionNumber: 51,
    question: "In paragraph 1, what morphosyntactic rule is demonstrated by the treatment of 'machinery', 'equipment', and 'stationery'?",
    options: [
      "They are invariable non-count nouns that govern singular verb agreement and cannot be pluralized with '-s'",
      "They are collective nouns that always take plural verb concord",
      "They are irregular count nouns that pluralize with internal vowel mutations",
      "They are borrowed Latin nouns that pluralize with '-a'"
    ],
    answer: "They are invariable non-count nouns that govern singular verb agreement and cannot be pluralized with '-s'",
    hint: "Notice that these nouns appear without plural suffixes and take singular grammatical agreement.",
    solution: "Paragraph 1 illustrates standard non-count syntax: 'machinery', 'equipment', and 'stationery' possess invariable singular morphology and reject plural '-s'.",
    target: "Capstone Exam: Invariable Non-Count Morphology"
  },
  {
    questionNumber: 52,
    question: "In paragraph 2, why is the genitive reciprocal construction 'each other's' used when referring to the inventory ledgers?",
    options: [
      "Because exactly two constitutional officers (director-general and principal auditor) are mutually auditing records belonging to them",
      "Because 'each other's' is required for any joint audit involving government funds",
      "Because the ledgers were written in two different colors of ink",
      "Because the inspection occurred over two days"
    ],
    answer: "Because exactly two constitutional officers (director-general and principal auditor) are mutually auditing records belonging to them",
    hint: "Count how many constitutional officers are conducting the audit.",
    solution: "Paragraph 2 specifies dual leadership (director-general and principal auditor). Dual reciprocal possession requires 'each other's'.",
    target: "Capstone Exam: Genitive Reciprocal Duality"
  },
  {
    questionNumber: 53,
    question: "In paragraph 3, what semantic distinction is illustrated between 'little electrical coolant' and 'a few left in the emergency cabinet'?",
    options: [
      "'Little' denotes an acute negative deficit for an uncountable noun (coolant), while 'a few' denotes a positive, reassuring small number for a countable noun (cutting bits)",
      "'Little' means a massive surplus, while 'a few' means completely empty",
      "Both terms are interchangeable and refer exclusively to countable units",
      "'Little' modifies count nouns, while 'a few' modifies non-count nouns"
    ],
    answer: "'Little' denotes an acute negative deficit for an uncountable noun (coolant), while 'a few' denotes a positive, reassuring small number for a countable noun (cutting bits)",
    hint: "Check which noun is uncountable (coolant) versus countable (cutting bits), and evaluate the positive/negative tone of each.",
    solution: "'Coolant' is non-count; 'little' indicates a dangerous scarcity ('almost none'). 'Cutting bits' is count plural; 'a few' indicates a positive small reserve ('some').",
    target: "Capstone Exam: Quantitative Deficit Analysis"
  },
  {
    questionNumber: 54,
    question: "In paragraph 4, why does the sentence 'the statutory council would scarcely tolerate any fraudulent manipulation' require the determiner 'any' instead of 'some'?",
    options: [
      "Because the semi-negative adverb 'scarcely' functions as a polarity trigger licensing the non-assertive determiner 'any'",
      "Because 'manipulation' is an irregular plural noun",
      "Because the chairman was addressing more than seventy faculty members",
      "Because 'some' is grammatically forbidden in formal legal English"
    ],
    answer: "Because the semi-negative adverb 'scarcely' functions as a polarity trigger licensing the non-assertive determiner 'any'",
    hint: "Examine the grammatical polarity established by the adverb 'scarcely'.",
    solution: "'Scarcely' has semi-negative polarity. In standard English, negative and semi-negative adverbs trigger non-assertive polarity, mandating 'any'.",
    target: "Capstone Exam: Semi-Negative Polarity Licensing"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the reciprocal pronoun rule governing the seventy senior lecturers in paragraph 4.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Plural groups of three or more use 'one another'.",
      "Because there were seventy lecturers gathered together, they used 'one another' correctly.",
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
async function deployStrand3B7Advanced() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Building 55 UNIQUE questions for Basic 7 (JHS 1) Strand 3 Grammar Advanced Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B7GrammarAdvancedDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B7_G_A_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B7",
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
      learningCompetency: "B7.3.1.1 / B7.3.1.2: Demonstrate advanced grammatical mastery of complex NP countability, invariable mass concord, genitive reciprocal case transformations, and non-assertive polarity licensing."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B7GrammarAdvancedQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${b7GrammarAdvancedCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B7_G_A_${item.questionNumber}`,
      level: "B7",
      difficulty: "advanced",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: b7GrammarAdvancedCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B7.3.1.1 / B7.3.1.2: Synthesize advanced multi-paragraph contextual grammar, evaluating complex subject-verb concord with mass nouns, reciprocal case transformations, and concise grammatical rule formulation."
    });
  });

  // 3. Write directly to Firestore subcollections across all parent paths
  const topicId = "grammar_lexis_prepositions_and_phrasal_verbs";
  const parentPaths = [
    "global_curriculum/jhs/subjects/english/topical",
    "global_curriculum/jhs/subjects/english/topics",
    "global_curriculum/jhs/subjects/english/topical_units"
  ];

  console.log("\nWriting to subcollections (practice_labs/B7_advanced)...");
  for (const parent of parentPaths) {
    const subDocRef = db.doc(`${parent}/${topicId}/practice_labs/B7_advanced`);
    await subDocRef.set({
      level: "B7",
      difficulty: "advanced",
      title: "Basic 7 Advanced Lab: 50 Unique Grammar Drills + 5 Capstone Exam Questions",
      totalQuestions: all55Questions.length,
      shortDrillsCount: 50,
      capstoneExamQuestionsCount: 5,
      questions: all55Questions,
      metadata: {
        hasDuplicateQuestions: false,
        uniqueQuestionsCount: 55,
        structure: "50 Unique Short Drills (Complex Concord, Genitive Reciprocals, Industrial Partitives, Polarity) + 5 Capstone Full-Passage Questions",
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

  // 4. Synchronize into main document practicePool.hard for b7
  console.log("\nSynchronizing main document practicePool.hard for b7...");
  const mappedHardQuestions = all55Questions.map(q => ({
    id: q.id,
    difficulty: 'hard' as const,
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
            hard: mappedHardQuestions
          }
        }
      };

      await mainRef.set({
        ...data,
        levels: updatedLevels,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log(`✅ Updated main document practicePool.hard at: ${mainRef.path}`);
    }
  }

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all55Questions.length} unique questions to Strand 3 B7 Advanced Lab!`);
}

deployStrand3B7Advanced()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 3 B7 Advanced Lab:", err);
    process.exit(1);
  });
