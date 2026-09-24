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
// Strand 3 Focus: Count vs. Non-Count, Partitives, Reciprocals & Determiners
// =========================================================================
const b7GrammarFoundationCapstonePassage = 
`At the beginning of the academic term, the headmistress addressed the newly admitted Basic 7 pupils in the assembly hall. She announced that the school board had procured several new pieces of furniture and modern laboratory equipment to enhance practical science lessons. She emphasized that every pupil was required to handle the school property with supreme care, noting that a single piece of advice taken seriously could prevent costly damage to the new apparatus.

Before classes commenced, the class prefect and the assistant prefect met in the library to coordinate their morning duties. Because only the two of them were assigned to oversee the assembly line, they assisted each other in arranging the registers and inspecting the pupils' uniforms. The headmistress observed their mutual cooperation and praised the two student leaders for supporting each other so selflessly.

Later that afternoon, the science master brought the class into the courtyard for a field experiment on soil composition. He cautioned the pupils that they did not have much time before the afternoon rains began. He distributed two bars of yellow soap, four buckets of clean water, and several sheets of absorbent paper so that the lab groups could clean their apparatus immediately after testing the samples. When a pupil asked if there were any spare glass slides in the cupboard, the teacher confirmed that there were a few left on the bottom shelf.

At the close of the day, all forty pupils in the class gathered in a wide circle to tidy up the classroom. Working together enthusiastically, the students encouraged one another to finish sweeping before the final bell rang. As they packed their bags, the teacher reminded them to review their notes at home so that no pupil would face any difficulty during the diagnostic quiz the following morning.`;

// =========================================================================
// 50 UNIQUE SHORT-PASSAGE READING DRILLS (QUESTIONS 1 TO 50)
// Strand 3 B7 Competencies: Count vs Non-Count, Invariables, Partitive
// Quantifiers, Reciprocals (each other vs one another), Assertive/Non-Assertive
// =========================================================================
const unique50B7GrammarFoundationDrills = [
  {
    passage: "The headmaster ordered new wooden desks for the school because the old ________ in the staff common room had broken down.",
    question: "Choose the grammatically correct option to complete the sentence:",
    options: ["furnitures", "furniture", "pieces of furnitures", "item of furnitures"],
    answer: "furniture",
    hint: "'Furniture' is an invariable non-count mass noun and cannot take an '-s'.",
    solution: "The noun 'furniture' is non-count and has no plural form with '-s'. Therefore, 'furniture' is the only correct choice.",
    target: "Non-Count Invariables: Furniture"
  },
  {
    passage: "Kofi and his twin brother Kwame promised to assist ________ with their mathematics homework every evening.",
    question: "Choose the correct reciprocal pronoun to fill the blank:",
    options: ["each other", "one another", "themselves", "theirselves"],
    answer: "each other",
    hint: "The sentence refers to exactly TWO people (Kofi and Kwame).",
    solution: "'Each other' is strictly used for dual reference (two entities), whereas 'one another' refers to three or more entities.",
    target: "Reciprocal Pronouns: Dual Reference"
  },
  {
    passage: "Mother bought two ________ of geisha soap from the provision kiosk at the junction.",
    question: "Choose the correct partitive quantifier to complete the phrase:",
    options: ["bars", "sheets", "slices", "grains"],
    answer: "bars",
    hint: "Think about the standard physical shape and unit of soap.",
    solution: "The standard partitive measure for molded soap is 'bar' (e.g., 'two bars of soap').",
    target: "Partitive Quantifiers: Soap"
  },
  {
    passage: "Although the investigator searched the room thoroughly, he could not discover ________ incriminating evidence against the suspect.",
    question: "Choose the correct determiner to complete the sentence:",
    options: ["some", "any", "no", "many"],
    answer: "any",
    hint: "The sentence contains the negative marker 'could not'.",
    solution: "In syntactically negative clauses containing 'not', the non-assertive determiner 'any' is required instead of 'some'.",
    target: "Polarity Determiners: Some vs. Any"
  },
  {
    passage: "The guidance coordinator gave the candidates a valuable ________ before they entered the examination hall.",
    question: "Choose the grammatically acceptable noun construction:",
    options: ["piece of advice", "advice", "advices", "many advice"],
    answer: "piece of advice",
    hint: "'Advice' is a mass noun and cannot be preceded directly by 'a' or pluralized.",
    solution: "'Advice' is an uncountable noun. To refer to a single instance, we use the partitive phrase 'a piece of advice'.",
    target: "Partitive Quantifiers: Advice"
  },
  {
    passage: "The teacher instructed the eleven football players on the pitch to pass the ball to ________.",
    question: "Choose the correct reciprocal pronoun:",
    options: ["each other", "one another", "each others", "one anothers"],
    answer: "one another",
    hint: "There are eleven players (three or more entities).",
    solution: "When the antecedent consists of three or more participants, the reciprocal pronoun 'one another' is required.",
    target: "Reciprocal Pronouns: Plural Reference"
  },
  {
    passage: "The carpenter requires three ________ of paper to draw the structural elevation of the wooden wardrobe.",
    question: "Choose the correct partitive noun:",
    options: ["sheets", "loaves", "bars", "grains"],
    answer: "sheets",
    hint: "Paper is measured in flat, thin rectangular units.",
    solution: "The standard partitive unit for paper is 'sheet' (e.g., 'three sheets of paper').",
    target: "Partitive Quantifiers: Paper"
  },
  {
    passage: "We have very ________ kerosene remaining in the lantern, so we must extinguish it before midnight.",
    question: "Choose the correct quantifier for the non-count mass noun 'kerosene':",
    options: ["few", "little", "many", "a few"],
    answer: "little",
    hint: "Kerosene is an uncountable liquid, and the context indicates an extreme negative deficit.",
    solution: "'Little' is used with non-count nouns to denote an extreme deficit ('almost none'). 'Few' is used only with count nouns.",
    target: "Determiners: Little vs. Few"
  },
  {
    passage: "The travelers were stranded at the station because their ________ was too heavy for the small taxi boot.",
    question: "Choose the grammatically correct invariable noun:",
    options: ["luggage", "luggages", "piece of luggages", "items of luggages"],
    answer: "luggage",
    hint: "'Luggage' denotes baggage as a collective mass and cannot be pluralized with '-s'.",
    solution: "'Luggage' is an invariable mass noun and never takes the plural '-s'.",
    target: "Non-Count Invariables: Luggage"
  },
  {
    passage: "The two rival debaters shook hands with ________ at the conclusion of the contest.",
    question: "Choose the correct pronoun:",
    options: ["each other", "one another", "one other", "themselves"],
    answer: "each other",
    hint: "Notice the numeral 'two' referring to the debaters.",
    solution: "Because exactly two participants are involved, 'each other' is the grammatically mandatory reciprocal form.",
    target: "Reciprocal Pronouns: Dual Reference"
  },
  {
    passage: "The baker sliced the fresh ________ of bread into twenty equal portions for breakfast.",
    question: "Choose the correct partitive unit:",
    options: ["loaf", "bar", "sheet", "grain"],
    answer: "loaf",
    hint: "Bread baked in a single whole rectangular shape is called a...",
    solution: "An entire shaped unit of baked bread is a 'loaf'. Individual cuts are 'slices'.",
    target: "Partitive Quantifiers: Bread"
  },
  {
    passage: "Would you like ________ hot cocoa to warm yourself up after walking through the rain?",
    question: "Choose the correct determiner for this polite offer:",
    options: ["some", "any", "many", "few"],
    answer: "some",
    hint: "In polite offers or requests expecting a positive 'Yes', we use 'some' rather than 'any'.",
    solution: "Although this is an interrogative clause, polite offers and requests that expect an affirmative response take the assertive determiner 'some'.",
    target: "Polarity Determiners: Polite Offers"
  },
  {
    passage: "The technical institute installed modern ________ in the electrical engineering workshop.",
    question: "Choose the grammatically correct noun form:",
    options: ["equipment", "equipments", "an equipment", "pieces of equipments"],
    answer: "equipment",
    hint: "'Equipment' is an uncountable noun in English.",
    solution: "'Equipment' is non-count and cannot take plural '-s' or the indefinite article 'an'.",
    target: "Non-Count Invariables: Equipment"
  },
  {
    passage: "The four village elders greeted ________ with traditional handshakes beneath the baobab tree.",
    question: "Choose the correct reciprocal pronoun:",
    options: ["one another", "each other", "each others", "themselves"],
    answer: "one another",
    hint: "Four elders are participating (greater than two).",
    solution: "For reciprocal interaction among three or more entities (here, four elders), 'one another' is the standard grammatical choice.",
    target: "Reciprocal Pronouns: Plural Reference"
  },
  {
    passage: "The mason mixed two ________ of sand with one bag of grey cement.",
    question: "Choose the appropriate partitive container noun:",
    options: ["wheelbarrows", "bars", "sheets", "slices"],
    answer: "wheelbarrows",
    hint: "Consider the construction tool used to transport sand on a building site.",
    solution: "'Wheelbarrow' functions as a partitive container unit for loose aggregates like sand or gravel.",
    target: "Partitive Quantifiers: Sand"
  },
  {
    passage: "There are ________ pupils absent today because of the heavy dawn downpour.",
    question: "Choose the correct determiner for the plural count noun 'pupils':",
    options: ["many", "much", "little", "a little"],
    answer: "many",
    hint: "'Pupils' is a countable plural noun.",
    solution: "'Many' modifies plural countable nouns, whereas 'much' and 'little' modify non-count mass nouns.",
    target: "Determiners: Much vs. Many"
  },
  {
    passage: "The journalist gathered accurate ________ from three eyewitnesses before writing the report.",
    question: "Choose the grammatically correct noun form:",
    options: ["information", "informations", "an information", "pieces of informations"],
    answer: "information",
    hint: "'Information' is an uncountable abstract noun.",
    solution: "'Information' is an invariable non-count noun and must never be suffixed with '-s'.",
    target: "Non-Count Invariables: Information"
  },
  {
    passage: "The twin calves licked ________ clean immediately after their birth.",
    question: "Choose the correct reciprocal pronoun:",
    options: ["each other", "one another", "themselves", "each others"],
    answer: "each other",
    hint: "'Twin' specifies exactly two animals.",
    solution: "Dual reference (two twin calves) strictly requires the reciprocal pronoun 'each other'.",
    target: "Reciprocal Pronouns: Dual Reference"
  },
  {
    passage: "The tailor purchased five ________ of cotton thread to sew the school uniforms.",
    question: "Choose the correct partitive unit:",
    options: ["spools", "bars", "loaves", "grains"],
    answer: "spools",
    hint: "Thread wound around a cylinder is measured in...",
    solution: "The standard commercial partitive unit for wound thread is a 'spool' (or 'reel').",
    target: "Partitive Quantifiers: Thread"
  },
  {
    passage: "She walked out of the market without ________ fresh tomatoes because prices had doubled.",
    question: "Choose the correct determiner:",
    options: ["any", "some", "much", "little"],
    answer: "any",
    hint: "The preposition 'without' creates a syntactically negative polarity environment.",
    solution: "The word 'without' functions as a negative trigger, requiring the non-assertive determiner 'any'.",
    target: "Polarity Determiners: Inherent Negatives"
  },
  {
    passage: "The laboratory technician warned us that the chemical ________ in the cabinet was extremely fragile.",
    question: "Choose the correct form:",
    options: ["apparatus", "apparatuses", "an apparatuses", "apparati"],
    answer: "apparatus",
    hint: "'Apparatus' is treated collectively as non-count when referring to laboratory equipment.",
    solution: "'Apparatus' functions as an invariable mass noun in standard British/WAEC English when referring to collective scientific gear.",
    target: "Non-Count Invariables: Apparatus"
  },
  {
    passage: "During the cultural festival, all the members of the dancing troupe smiled at ________.",
    question: "Choose the correct reciprocal pronoun:",
    options: ["one another", "each other", "each others", "one other"],
    answer: "one another",
    hint: "'Members of the dancing troupe' denotes a group of three or more performers.",
    solution: "A collective group consisting of more than two participants requires 'one another'.",
    target: "Reciprocal Pronouns: Plural Reference"
  },
  {
    passage: "The nurse gave the feverish child two ________ of paracetamol syrup after lunch.",
    question: "Choose the correct partitive measurement unit:",
    options: ["spoonfuls", "bars", "sheets", "slices"],
    answer: "spoonfuls",
    hint: "Liquid medicine administered using a spoon is measured in...",
    solution: "The standard unit for liquid medicine measured with a spoon is 'spoonfuls'.",
    target: "Partitive Quantifiers: Medicine"
  },
  {
    passage: "The farmer was worried because there was ________ pasture grass left for his cattle during the dry harmattan.",
    question: "Choose the correct quantifier indicating an extreme deficit:",
    options: ["little", "few", "a few", "many"],
    answer: "little",
    hint: "'Pasture grass' is an uncountable noun, and the farmer is distressed by its near-total absence.",
    solution: "'Little' is used with non-count nouns to indicate scarcity or an extreme negative deficit ('hardly any').",
    target: "Determiners: Little vs. Few"
  },
  {
    passage: "The government official delivered a stern warning regarding the illegal mining ________ seized by the task force.",
    question: "Choose the grammatically correct noun form:",
    options: ["machinery", "machineries", "a machinery", "items of machineries"],
    answer: "machinery",
    hint: "'Machinery' refers collectively to industrial machines and is non-count.",
    solution: "'Machinery' is an invariable non-count noun; pluralizing it as 'machineries' is ungrammatical.",
    target: "Non-Count Invariables: Machinery"
  },
  {
    passage: "The husband and wife congratulated ________ on their twentieth wedding anniversary.",
    question: "Choose the correct reciprocal pronoun:",
    options: ["each other", "one another", "theirselves", "themselves"],
    answer: "each other",
    hint: "A husband and wife comprise exactly two individuals.",
    solution: "Two persons acting mutually require 'each other'.",
    target: "Reciprocal Pronouns: Dual Reference"
  },
  {
    passage: "Can you please fetch a clean ________ of water from the courtyard tap?",
    question: "Choose the correct partitive container noun:",
    options: ["bucket", "sheet", "bar", "loaf"],
    answer: "bucket",
    hint: "Identify the vessel used for carrying water.",
    solution: "'Bucket' functions as a container partitive for liquids such as water.",
    target: "Partitive Quantifiers: Water"
  },
  {
    passage: "Does the library have ________ novels written by Ghanaian authors?",
    question: "Choose the correct determiner for this general question:",
    options: ["any", "some", "much", "little"],
    answer: "any",
    hint: "Open questions without an expectation of a positive answer take the non-assertive form.",
    solution: "In open, non-assertive interrogative clauses, 'any' is standardly used with plural count nouns.",
    target: "Polarity Determiners: Questions"
  },
  {
    passage: "The school secretary purchased three packets of writing ________ from the bookstore.",
    question: "Choose the correctly spelled, grammatically invariable noun:",
    options: ["stationery", "stationeries", "stationary", "stationaries"],
    answer: "stationery",
    hint: "Writing materials are spelled with an 'e' (stationery) and are uncountable.",
    solution: "'Stationery' (with an 'e') denotes writing materials and is an uncountable mass noun that never takes an '-s'.",
    target: "Non-Count Invariables: Stationery"
  },
  {
    passage: "The three business partners trusted ________ completely with the company bank accounts.",
    question: "Choose the correct reciprocal pronoun:",
    options: ["one another", "each other", "one others", "themselves"],
    answer: "one another",
    hint: "Three partners are involved.",
    solution: "For three or more entities, 'one another' is the standard reciprocal pronoun in formal English.",
    target: "Reciprocal Pronouns: Plural Reference"
  },
  {
    passage: "The chef sprinkled a tiny ________ of salt into the boiling groundnut soup.",
    question: "Choose the correct partitive noun:",
    options: ["pinch", "loaf", "sheet", "bar"],
    answer: "pinch",
    hint: "The small amount of powder held between thumb and forefinger is called a...",
    solution: "A small quantity of granular substance like salt is measured as a 'pinch'.",
    target: "Partitive Quantifiers: Salt"
  },
  {
    passage: "He had ________ coins in his pocket, so he was able to pay for the bus fare.",
    question: "Choose the quantifier indicating a positive small number:",
    options: ["a few", "few", "little", "a little"],
    answer: "a few",
    hint: "'Coins' is countable, and he had enough to afford the fare (positive sense).",
    solution: "'A few' modifies countable plural nouns and conveys a positive meaning ('some, a sufficient small number').",
    target: "Determiners: Few vs. A Few"
  },
  {
    passage: "The evening television ________ broadcast by the national network was very informative.",
    question: "Choose the correct singular nominal construction:",
    options: ["news", "newes", "a news", "news item"],
    answer: "news",
    hint: "'News' looks plural because of the '-s', but takes singular concord.",
    solution: "'News' is an uncountable noun ending in '-s' that governs singular verbs in English.",
    target: "Non-Count Invariables: News"
  },
  {
    passage: "The driver and the mechanic examined ________ with mutual respect after repairing the tractor.",
    question: "Choose the correct pronoun:",
    options: ["each other", "one another", "themselves", "theirselves"],
    answer: "each other",
    hint: "Exactly two individuals: the driver and the mechanic.",
    solution: "Two distinct persons require 'each other' to express reciprocity.",
    target: "Reciprocal Pronouns: Dual Reference"
  },
  {
    passage: "A single ________ of lightning illuminated the dark night sky for a brief second.",
    question: "Choose the correct partitive noun:",
    options: ["flash", "loaf", "grain", "bar"],
    answer: "flash",
    hint: "Lightning is measured in momentary bursts of light called...",
    solution: "A discrete occurrence of lightning is partitively termed a 'flash' (or 'stroke') of lightning.",
    target: "Partitive Quantifiers: Lightning"
  },
  {
    passage: "Hardly ________ student arrived late to the morning assembly today.",
    question: "Choose the correct non-assertive determiner:",
    options: ["any", "some", "many", "much"],
    answer: "any",
    hint: "'Hardly' is a semi-negative adverb that requires a non-assertive determiner.",
    solution: "Semi-negative adverbs like 'hardly', 'scarcely', and 'barely' trigger the non-assertive determiner 'any'.",
    target: "Polarity Determiners: Semi-Negatives"
  },
  {
    passage: "The queen wore expensive gold ________ during the grand durbar celebration.",
    question: "Choose the grammatically correct invariable noun:",
    options: ["jewelry", "jewelries", "item of jewelries", "a jewelries"],
    answer: "jewelry",
    hint: "'Jewelry' represents precious ornaments collectively and is uncountable.",
    solution: "'Jewelry' (or 'jewellery') is non-count and cannot be pluralized with '-s'.",
    target: "Non-Count Invariables: Jewelry"
  },
  {
    passage: "The five prefects assisted ________ in organizing the school library books.",
    question: "Choose the correct reciprocal pronoun:",
    options: ["one another", "each other", "each others", "themselves"],
    answer: "one another",
    hint: "There are five prefects (more than two).",
    solution: "For more than two agents, 'one another' is the standard reciprocal pronoun.",
    target: "Reciprocal Pronouns: Plural Reference"
  },
  {
    passage: "The boy asked for a thin ________ of roast beef to put inside his sandwich.",
    question: "Choose the correct partitive noun:",
    options: ["slice", "bar", "sheet", "grain"],
    answer: "slice",
    hint: "A broad, flat, thin piece cut from meat or bread is a...",
    solution: "A thin portion sliced from meat or bread is termed a 'slice'.",
    target: "Partitive Quantifiers: Meat"
  },
  {
    passage: "If you have ________ questions regarding the science project, raise your hand.",
    question: "Choose the correct determiner for this conditional clause:",
    options: ["any", "some", "much", "little"],
    answer: "any",
    hint: "Conditional clauses introduced by 'if' standardly take non-assertive determiners.",
    solution: "Conditional 'if'-clauses represent open, non-assertive contexts that require 'any'.",
    target: "Polarity Determiners: Conditionals"
  },
  {
    passage: "The factory worker suffered serious burns from boiling ________ that splashed from the tank.",
    question: "Choose the correct non-count noun form:",
    options: ["oil", "oils", "an oil", "oiles"],
    answer: "oil",
    hint: "'Oil' is a liquid substance and an uncountable mass noun.",
    solution: "'Oil' is an uncountable noun and cannot take an indefinite article or plural '-s' in this context.",
    target: "Non-Count Invariables: Oil"
  },
  {
    passage: "The boxer and his coach understood ________ perfectly without exchanging words.",
    question: "Choose the correct pronoun:",
    options: ["each other", "one another", "one other", "themselves"],
    answer: "each other",
    hint: "The interaction is strictly between two persons.",
    solution: "'Each other' expresses mutual understanding between two participants.",
    target: "Reciprocal Pronouns: Dual Reference"
  },
  {
    passage: "The hungry child ate three ________ of ripe plantain fried in palm oil.",
    question: "Choose the correct partitive unit:",
    options: ["slices", "bars", "sheets", "grains"],
    answer: "slices",
    hint: "Cut portions of plantain are referred to as...",
    solution: "Plantains cut into flat portions before frying are 'slices'.",
    target: "Partitive Quantifiers: Plantain"
  },
  {
    passage: "We did not see ________ stray animals on the highway during our trip to Kumasi.",
    question: "Choose the correct determiner:",
    options: ["any", "some", "much", "little"],
    answer: "any",
    hint: "Notice the negative auxiliary 'did not'.",
    solution: "The negative construction 'did not see' requires the non-assertive determiner 'any'.",
    target: "Polarity Determiners: Negatives"
  },
  {
    passage: "The market women complained that the local council had neglected the town's sanitary ________.",
    question: "Choose the correct nominal form:",
    options: ["infrastructure", "infrastructures", "an infrastructure", "items of infrastructures"],
    answer: "infrastructure",
    hint: "'Infrastructure' denotes public installations collectively and is uncountable.",
    solution: "'Infrastructure' is an invariable non-count noun when referring generally to public facilities.",
    target: "Non-Count Invariables: Infrastructure"
  },
  {
    passage: "The members of the parliamentary committee debated vigorously with ________ for three hours.",
    question: "Choose the correct reciprocal pronoun:",
    options: ["one another", "each other", "each others", "themselves"],
    answer: "one another",
    hint: "A committee consists of multiple members (three or more).",
    solution: "'One another' is appropriate for reciprocal actions among multiple committee members.",
    target: "Reciprocal Pronouns: Plural Reference"
  },
  {
    passage: "The scientist examined a tiny ________ of pollen under the electron microscope.",
    question: "Choose the correct partitive unit:",
    options: ["grain", "loaf", "bar", "sheet"],
    answer: "grain",
    hint: "Microscopic, powdery particles of pollen or sand are measured as...",
    solution: "Individual minute particles of pollen, sand, or salt are partitively designated as 'grains'.",
    target: "Partitive Quantifiers: Pollen"
  },
  {
    passage: "There was ________ traffic on the bypass, so we arrived at school thirty minutes early.",
    question: "Choose the correct quantifier for the non-count noun 'traffic':",
    options: ["little", "few", "many", "a few"],
    answer: "little",
    hint: "'Traffic' is uncountable, and their early arrival means there was almost no congestion.",
    solution: "'Traffic' is a mass noun; 'little' indicates an extreme deficit of congestion, allowing early arrival.",
    target: "Determiners: Little vs. Few"
  },
  {
    passage: "The storekeeper ordered fifty bags of ________ for the construction project.",
    question: "Choose the correct non-count noun form:",
    options: ["cement", "cements", "a cement", "cements item"],
    answer: "cement",
    hint: "'Cement' is a binding powder and an uncountable mass noun.",
    solution: "'Cement' is an invariable mass noun; quantification is handled by the partitive 'bags of'.",
    target: "Non-Count Invariables: Cement"
  },
  {
    passage: "The two village hunters warned ________ about the leopard footprints near the stream.",
    question: "Choose the correct reciprocal pronoun:",
    options: ["each other", "one another", "each others", "themselves"],
    answer: "each other",
    hint: "Only two hunters are involved.",
    solution: "Dual reference strictly dictates the use of 'each other'.",
    target: "Reciprocal Pronouns: Dual Reference"
  }
];

// =========================================================================
// 5 CAPSTONE QUESTIONS ON FULL-LENGTH CAPSTONE PASSAGE (51 TO 55)
// Strand 3 Focus: Count vs. Non-Count, Partitives, Reciprocals & Determiners
// =========================================================================
const capstone5B7GrammarFoundationQuestions = [
  {
    questionNumber: 51,
    question: "In paragraph 1, how does the headmistress correctly quantify the uncountable mass nouns 'furniture', 'equipment', and 'advice'?",
    options: [
      "She pluralized them directly as 'furnitures', 'equipments', and 'advices'",
      "She used partitive constructions: 'pieces of furniture', 'laboratory equipment', and 'a piece of advice'",
      "She added the indefinite article directly: 'a furniture' and 'an advice'",
      "She treated them as count nouns by preceding them with numerals: 'three equipments'"
    ],
    answer: "She used partitive constructions: 'pieces of furniture', 'laboratory equipment', and 'a piece of advice'",
    hint: "Scan paragraph 1 for the partitive phrases modifying 'furniture', 'equipment', and 'advice'.",
    solution: "Paragraph 1 illustrates standard non-count usage by employing partitive phrases ('pieces of furniture', 'a piece of advice') and keeping 'equipment' invariable.",
    target: "Capstone Exam: Non-Count Partitive Synthesis"
  },
  {
    questionNumber: 52,
    question: "In paragraph 2, why is the reciprocal pronoun 'each other' used to describe the cooperation between the prefects?",
    options: [
      "Because 'each other' is used when exactly two persons (the prefect and assistant prefect) interact mutually",
      "Because 'each other' is required for any group larger than twenty people",
      "Because the headmistress was also helping them carry the registers",
      "Because the library had two doors"
    ],
    answer: "Because 'each other' is used when exactly two persons (the prefect and assistant prefect) interact mutually",
    hint: "Count how many prefects were coordinating in the library.",
    solution: "Paragraph 2 specifies that only two leaders were present; dual reciprocity requires 'each other'.",
    target: "Capstone Exam: Reciprocal Pronoun Duality"
  },
  {
    questionNumber: 53,
    question: "According to paragraph 3, which option correctly lists the three partitive quantifier constructions used by the science master?",
    options: [
      "'two bars of soap', 'four buckets of water', and 'several sheets of paper'",
      "'two soaps', 'four waters', and 'several papers'",
      "'two loaves of soap', 'four bottles of water', and 'several grains of paper'",
      "'two pieces of soap', 'four slices of water', and 'several bars of paper'"
    ],
    answer: "'two bars of soap', 'four buckets of water', and 'several sheets of paper'",
    hint: "Identify the partitive nouns paired with soap, water, and paper in paragraph 3.",
    solution: "Paragraph 3 explicitly uses the standard partitives: 'two bars of yellow soap', 'four buckets of clean water', and 'several sheets of absorbent paper'.",
    target: "Capstone Exam: Partitive Quantifier Identification"
  },
  {
    questionNumber: 54,
    question: "In paragraph 4, why does the author switch to the reciprocal pronoun 'one another' when describing the pupils cleaning the classroom?",
    options: [
      "Because all forty pupils in the class (three or more entities) were cooperating together",
      "Because the teacher left the room and only two pupils remained",
      "Because 'one another' is only used at the end of a school day",
      "Because the pupils were speaking a different language"
    ],
    answer: "Because all forty pupils in the class (three or more entities) were cooperating together",
    hint: "Check the number of pupils in the circle in paragraph 4.",
    solution: "For reciprocal interaction among three or more entities (here, forty pupils), 'one another' is the grammatically mandatory form.",
    target: "Capstone Exam: Reciprocal Pronoun Plurality"
  },
  {
    questionNumber: 55,
    question: "In ONE sentence of NOT MORE THAN EIGHT WORDS, state the grammatical rule governing 'furniture' and 'equipment' in the passage.\nWhich candidate answer qualifies for FULL MARKS under WAEC rules?",
    options: [
      "Non-count nouns cannot take plural suffixes.",
      "Because furniture and equipment are mass nouns, they can never be written with an 's'.",
      "Using partitives to measure non-count mass nouns in English sentences.",
      "Uncountable nouns."
    ],
    answer: "Non-count nouns cannot take plural suffixes.",
    hint: "Must be a complete grammatical sentence with an active verb, not exceeding 8 words.",
    solution: "'Non-count nouns cannot take plural suffixes' is exactly 7 words, forms a complete Subject-Verb-Object sentence, and states the grammatical rule accurately. Option C is a fragment (0 marks), and Option B has 15 words.",
    target: "Capstone Exam: 8-Word Summary Rule"
  }
];

// =========================================================================
// DEPLOYMENT ORCHESTRATION FUNCTION
// =========================================================================
async function deployStrand3B7Foundation() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Building 55 UNIQUE questions for Basic 7 (JHS 1) Strand 3 Grammar Foundation Lab...");

  const all55Questions: LabQuestion[] = [];

  // 1. Build Questions 1 to 50 (Short drills with unique passages)
  unique50B7GrammarFoundationDrills.forEach((item, index) => {
    const qNum = index + 1;
    const formattedPrompt = 
`📖 PASSAGE:
"${item.passage}"

❓ QUESTION:
${item.question}`;

    all55Questions.push({
      id: `B7_G_F_${qNum < 10 ? "0" + qNum : qNum}`,
      level: "B7",
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
      learningCompetency: "B7.3.1.1: Demonstrate grammatical mastery of count vs. non-count noun classes, partitive mass quantifiers, reciprocal pronouns, and polarity determiners."
    });
  });

  // 2. Build Questions 51 to 55 (Capstone Full Exam Questions)
  capstone5B7GrammarFoundationQuestions.forEach((item) => {
    const formattedPrompt = 
`📖 FULL EXAM PASSAGE:
"${b7GrammarFoundationCapstonePassage}"

❓ QUESTION ${item.questionNumber}:
${item.question}`;

    all55Questions.push({
      id: `B7_G_F_${item.questionNumber}`,
      level: "B7",
      difficulty: "foundation",
      questionNumber: item.questionNumber,
      isCapstoneExamPassage: true,
      passageText: b7GrammarFoundationCapstonePassage,
      prompt: formattedPrompt,
      options: item.options,
      correctAnswer: item.answer,
      hint: item.hint,
      workedSolution: item.solution,
      competencyTarget: item.target,
      learningCompetency: "B7.3.1.1 / B7.3.1.2: Synthesize multi-paragraph contextual grammar, evaluating nominal invariables, partitives, reciprocal dual vs. plural distinctions, and concise grammatical summary formulation."
    });
  });

  // 3. Write directly to Firestore subcollections across both topical and topics paths
  const topicId = "grammar_lexis_prepositions_and_phrasal_verbs";
  const parentPaths = [
    "global_curriculum/jhs/subjects/english/topical",
    "global_curriculum/jhs/subjects/english/topics",
    "global_curriculum/jhs/subjects/english/topical_units"
  ];

  console.log("\nWriting to subcollections (practice_labs/B7_foundation)...");
  for (const parent of parentPaths) {
    const subDocRef = db.doc(`${parent}/${topicId}/practice_labs/B7_foundation`);
    await subDocRef.set({
      level: "B7",
      difficulty: "foundation",
      title: "Basic 7 Foundation Lab: 50 Unique Grammar Drills + 5 Capstone Exam Questions",
      totalQuestions: all55Questions.length,
      shortDrillsCount: 50,
      capstoneExamQuestionsCount: 5,
      questions: all55Questions,
      metadata: {
        hasDuplicateQuestions: false,
        uniqueQuestionsCount: 55,
        structure: "50 Unique Short Drills (Count/Non-Count, Partitives, Reciprocals, Determiners) + 5 Capstone Full-Passage Questions",
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

  // 4. Synchronize into main document practicePool.low for b7
  console.log("\nSynchronizing main document practicePool.low for b7...");
  const mappedLowQuestions = all55Questions.map(q => ({
    id: q.id,
    difficulty: 'low' as const,
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
            low: mappedLowQuestions
          }
        }
      };

      await mainRef.set({
        ...data,
        levels: updatedLevels,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log(`✅ Updated main document practicePool.low at: ${mainRef.path}`);
    }
  }

  console.log(`\n🎉 SUCCESS: Deployed exactly ${all55Questions.length} unique questions to Strand 3 B7 Foundation Lab!`);
}

deployStrand3B7Foundation()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to deploy Strand 3 B7 Foundation Lab:", err);
    process.exit(1);
  });
