process.env.GCLOUD_PROJECT = 'gamedu-69888475-f5783';
process.env.GOOGLE_CLOUD_PROJECT = 'gamedu-69888475-f5783';
import * as admin from 'firebase-admin';
import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function getDb() {
  const fbAdmin = (admin as any).default || admin;
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
    console.log("Fallback to admin default credentials...");
  }

  if (!fbAdmin.apps?.length) {
    fbAdmin.initializeApp({
      credential: fbAdmin.credential.applicationDefault(),
    });
  }
  return fbAdmin.firestore();
}

interface QuestionItem {
  number: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2010
const rawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "Our mathematics master was late for class because his vehicle ............ a punctured tyre on the way.",
    options: ["had", "will have", "is having", "has"],
    correctAnswer: "had",
    hint: "The main clause is in the simple past ('was late'), so the reason must also be in the past tense.",
    workedSolution: "Past narrative consistency: The main clause 'was late' expresses a past event. The cause ('he had a punctured tyre') must also be in the simple past tense ('had').",
    points: 1
  },
  {
    number: 2,
    prompt: "We had lunch at a popular local restaurant where I ............ delicious jollof rice.",
    options: ["am enjoying", "will enjoy", "enjoyed", "would enjoy"],
    correctAnswer: "enjoyed",
    hint: "Maintain sequence of tenses: The past action 'had lunch' governs the relative clause.",
    workedSolution: "The narrative frame is in the simple past ('We had lunch'). The past action within that setting is correctly expressed in the simple past tense ('enjoyed').",
    points: 1
  },
  {
    number: 3,
    prompt: "The headmistress asked the school prefect to choose ............ Kwame and Kofi.",
    options: ["among", "from", "with", "between"],
    correctAnswer: "between",
    hint: "Use 'between' when a choice or relationship involves exactly two entities.",
    workedSolution: "'Between' is used when distinguishing or choosing between two individuals ('Kwame and Kofi'). 'Among' is used for three or more.",
    points: 1
  },
  {
    number: 4,
    prompt: "Kweku is recovering from a fever and is not ............ enough to walk to school.",
    options: ["good", "well", "fine", "free"],
    correctAnswer: "well",
    hint: "'Well' functions as an adjective meaning healthy or free from illness.",
    workedSolution: "'Well' is an adjective denoting good physical health ('not well enough'). 'Good' refers to moral character, quality, or skill, not physical health in this context.",
    points: 1
  },
  {
    number: 5,
    prompt: "The school cadet corps ............ twice every week on the sports oval.",
    options: ["practise", "are practising", "practises", "were practising"],
    correctAnswer: "practises",
    hint: "A collective entity acting as a single unit with a habitual schedule takes a singular verb.",
    workedSolution: "The collective subject 'The school cadet corps' functions as a single singular unit and describes a regular habitual action ('twice every week'), requiring the singular verb 'practises'.",
    points: 1
  },
  {
    number: 6,
    prompt: "Philomina ............ passed the examination with distinction if she had revised more consistently.",
    options: ["could have", "will have", "may have", "could"],
    correctAnswer: "could have",
    hint: "Third Conditional: 'If + past perfect' requires 'could have / would have + past participle' in the main clause.",
    workedSolution: "In a Third Conditional sentence expressing past ability or possibility that was unfulfilled ('if she had tried harder'), the main clause takes 'could have + past participle' ('could have passed').",
    points: 1
  },
  {
    number: 7,
    prompt: "The constitutional amendment was passed in conformity with established legal .............",
    options: ["cases", "principles", "rules", "issues"],
    correctAnswer: "principles",
    hint: "Identify the formal legal collocation denoting fundamental doctrines or rules of conduct.",
    workedSolution: "In jurisprudence, fundamental tenets, doctrines, and foundational standards are formally designated as 'legal principles'.",
    points: 1
  },
  {
    number: 8,
    prompt: "The historical novel, as well as several anthologies on the shelf, ............. fascinating reading.",
    options: ["makes", "are to make", "are making", "make"],
    correctAnswer: "makes",
    hint: "Parenthetical additions like 'as well as...' do not change the number of the singular head subject ('The historical novel').",
    workedSolution: "Parenthetical additions introduced by 'as well as' do not affect the grammatical number of the subject. The singular head noun 'The historical novel' governs the singular verb 'makes'.",
    points: 1
  },
  {
    number: 9,
    prompt: "............ the striker scored the decisive goal, he sustained a severe sprain during the tackle.",
    options: ["But", "Nevertheless", "Although", "Furthermore"],
    correctAnswer: "Although",
    hint: "Identify the subordinating conjunction of concession that joins two contrasting clauses.",
    workedSolution: "'Although' is a subordinating conjunction of concession used to introduce an adverbial clause contrasting with the main clause. 'Nevertheless' is a conjunctive adverb.",
    points: 1
  },
  {
    number: 10,
    prompt: "Neither Kojo nor his classmates ............ the instructions on the examination paper clearly.",
    options: ["understands", "have understood", "understand", "is understanding"],
    correctAnswer: "understand",
    hint: "With 'neither... nor', the verb agrees in number with the subject closer to it ('classmates').",
    workedSolution: "Proximity rule of concord: When subjects of different numbers are joined by 'neither... nor', the verb agrees with the closer subject ('his classmates', plural present: 'understand').",
    points: 1
  },
  {
    number: 11,
    prompt: "The new ............ vocational training institute is located on the outskirts of the town.",
    options: ["womens'", "woman", "womans'", "women's"],
    correctAnswer: "women's",
    hint: "'Women' is an irregular plural noun that forms its possessive by adding an apostrophe and 's'.",
    workedSolution: "'Women' is an irregular plural noun. Its possessive form is constructed by adding ''s' ('women's'), not an apostrophe after 's'.",
    points: 1
  },
  {
    number: 12,
    prompt: "One of the bullocks ............ from the herd into the adjoining farm.",
    options: ["has strayed", "have strayed", "have been strayed", "has been strayed"],
    correctAnswer: "has strayed",
    hint: "The subject is 'One', not 'bullocks'. Use the singular active present perfect form.",
    workedSolution: "In 'One of the bullocks', the true head noun is the singular pronoun 'One'. It requires the singular active verb 'has strayed'. 'Stray' is an intransitive verb and cannot take a passive form.",
    points: 1
  },
  {
    number: 13,
    prompt: "At the wedding reception, the committee placed an order for a large ............ of fruit juice.",
    options: ["count", "total", "quantity", "sum"],
    correctAnswer: "quantity",
    hint: "Identify the noun used to denote an amount or volume of an uncountable liquid commodity.",
    workedSolution: "Uncountable items, bulk supplies, and liquids like fruit juice are measured by 'quantity' ('a large quantity of drinks/juice'). 'Sum' is used for money; 'count' and 'total' for discrete numbers.",
    points: 1
  },
  {
    number: 14,
    prompt: "The classroom was so congested that it could ............ accommodate all the registered pupils.",
    options: ["rarely", "comfortably", "conveniently", "hardly"],
    correctAnswer: "hardly",
    hint: "Use this negative adverb meaning scarcely or almost not at all.",
    workedSolution: "'Hardly' means scarcely or with great difficulty, fitting the context of a congested room that could barely hold everyone.",
    points: 1
  },
  {
    number: 15,
    prompt: "If I were the school dining hall prefect, I ............ ensure balanced rations for every student.",
    options: ["will", "shall", "would", "must"],
    correctAnswer: "would",
    hint: "Second Conditional: 'If + past subjunctive (were)' requires 'would + base verb' in the main clause.",
    workedSolution: "In a hypothetical Second Conditional sentence ('If I were...'), the main clause takes 'would + base verb' ('I would ensure').",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "Florence performs creditably in all her terminal examinations.\nChoose the word nearest in meaning to the underlined word 'creditably'.",
    options: ["fairly", "well", "graciously", "good"],
    correctAnswer: "well",
    hint: "In a praiseworthy, satisfactory, or commendable manner.",
    workedSolution: "'Creditably' means in a manner worthy of praise, honor, or esteem; 'well' is its closest adverbial synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "The school choir sang melodious hymns at the thanksgiving service.\nChoose the word nearest in meaning to the underlined word 'melodious'.",
    options: ["loud", "pleasant", "soft", "musical"],
    correctAnswer: "pleasant",
    hint: "Sweet-sounding, agreeable, and harmonious to the ear.",
    workedSolution: "'Melodious' means having a pleasant tune or sounding agreeable to the ear; 'pleasant' is its closest synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "The senior prefect is always immaculately dressed in her school uniform.\nChoose the word nearest in meaning to the underlined word 'immaculately'.",
    options: ["modestly", "correctly", "neatly", "scantily"],
    correctAnswer: "neatly",
    hint: "Flawlessly clean, spotless, and impeccably tidy.",
    workedSolution: "'Immaculately' means spotlessly clean, tidy, and without blemish; 'neatly' is the closest equivalent.",
    points: 1
  },
  {
    number: 19,
    prompt: "The coastal hamlet was completely enveloped in a dense morning fog.\nChoose the word nearest in meaning to the underlined word 'enveloped'.",
    options: ["built", "put", "shaped", "covered"],
    correctAnswer: "covered",
    hint: "Wrapped up, enclosed, or completely surrounded by something.",
    workedSolution: "'Enveloped' means wrapped around, covered entirely, or shrouded; 'covered' is its direct synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "The inquisitive journalist asked several probing questions during the interview.\nChoose the word nearest in meaning to the underlined word 'inquisitive'.",
    options: ["curious", "pompous", "intelligent", "cowardly"],
    correctAnswer: "curious",
    hint: "Eager to investigate, learn, or ask questions.",
    workedSolution: "'Inquisitive' means eager to acquire knowledge or investigate details; 'curious' is its direct synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "Whenever Kweku travels to Kumasi, he puts up with his uncle. This means that Kweku ............",
    options: ["helps his uncle", "stays with his uncle", "converses with his uncle", "avoids his uncle"],
    correctAnswer: "stays with his uncle",
    hint: "Lodging or being accommodated temporarily in someone's home.",
    workedSolution: "The phrasal verb 'to put up with someone' in this lodging context means to stay or lodge temporarily at their home.",
    points: 1
  },
  {
    number: 22,
    prompt: "The candidate glanced over the examination papers before handing them in. This means that the candidate ............",
    options: ["quickly wrote", "critically analyzed", "merely saw", "quickly read through"],
    correctAnswer: "quickly read through",
    hint: "Reading through something hastily without detailed scrutiny.",
    workedSolution: "'To glance over' means to read or inspect something rapidly, cursorily, or briefly.",
    points: 1
  },
  {
    number: 23,
    prompt: "The mother entered the hall to find her daughter with her eyes glued to the television. This means that the daughter was ............",
    options: ["smiling at the screen", "repairing the television", "intently watching the screen", "cleaning the screen"],
    correctAnswer: "intently watching the screen",
    hint: "Watching with fixed, undivided, and captivated visual attention.",
    workedSolution: "The idiom 'eyes glued to' means watching something with total, undivided, and concentrated attention.",
    points: 1
  },
  {
    number: 24,
    prompt: "Kojo was escorted to the disciplinary committee like a lamb to the slaughter. This means that Kojo went ............",
    options: ["with great difficulty", "without offering any resistance", "carrying a farm animal", "without any clothes on"],
    correctAnswer: "without offering any resistance",
    hint: "Going quietly, innocently, or submissively without resistance into a difficult situation.",
    workedSolution: "'Like a lamb to the slaughter' describes going quietly, submissively, and without resistance into a punitive or dangerous situation.",
    points: 1
  },
  {
    number: 25,
    prompt: "The senior master instructed the bully to leave the junior boys alone. This means that the bully was told ............",
    options: ["not to walk with them", "to accompany them everywhere", "not to disturb or tease them", "to tutor them properly"],
    correctAnswer: "not to disturb or tease them",
    hint: "Ceasing harassment, teasing, or unwanted interference.",
    workedSolution: "The idiom 'to leave someone alone' means to stop bothering, teasing, interfering with, or harassing them.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 32) ---
  {
    number: 26,
    prompt: "While some of the guests at the reception were rude, the host was remarkably ...... .",
    options: ["courteous", "bold", "friendly", "shy"],
    correctAnswer: "courteous",
    hint: "'Rude' means impolite and insolent. Find the word that denotes polite, well-mannered conduct.",
    workedSolution: "'Rude' means discourteous and ill-mannered. Its direct antonym is 'courteous' (polite and respectful).",
    points: 1
  },
  {
    number: 27,
    prompt: "The defense attorney supported his plea with copious evidence, but the prosecutor offered only ...... documentation.",
    options: ["inconsistent", "scanty", "bad", "unconvincing"],
    correctAnswer: "scanty",
    hint: "'Copious' means abundant and extensive. Find the word meaning meager or in short supply.",
    workedSolution: "'Copious' means abundant in quantity. Its direct antonym is 'scanty' (meager, sparse, or deficient).",
    points: 1
  },
  {
    number: 28,
    prompt: "To judge fairly, an arbiter must remain objective rather than ...... .",
    options: ["subjective", "positive", "active", "emotive"],
    correctAnswer: "subjective",
    hint: "'Objective' means impartial and based on facts. Find the word meaning influenced by personal feelings.",
    workedSolution: "'Objective' means unbiased and based on observable facts. Its direct philosophical and linguistic antonym is 'subjective' (based on personal feelings).",
    points: 1
  },
  {
    number: 29,
    prompt: "Leaving the dormitory after lights-out is strictly prohibited, but studying in the reading room is ...... .",
    options: ["advised", "ignored", "permitted", "admitted"],
    correctAnswer: "permitted",
    hint: "'Prohibited' means forbidden by authority. Find the word meaning officially allowed.",
    workedSolution: "'Prohibited' means officially forbidden. Its direct antonym is 'permitted' (allowed).",
    points: 1
  },
  {
    number: 30,
    prompt: "The surest way for an athletic team to avoid defeat is to strive relentlessly for ...... .",
    options: ["position", "victory", "knowledge", "ability"],
    correctAnswer: "victory",
    hint: "'Defeat' means losing a contest. Find the word meaning winning.",
    workedSolution: "'Defeat' means loss in a contest or battle. Its direct antonym is 'victory' (winning or triumph).",
    points: 1
  },
  {
    number: 31,
    prompt: "Rather than clearing suddenly, the rain clouds dispersed ...... over several hours.",
    options: ["continuously", "gradually", "heavily", "immediately"],
    correctAnswer: "gradually",
    hint: "'Suddenly' means quickly and unexpectedly. Find the word meaning slowly over time in small steps.",
    workedSolution: "'Suddenly' means quickly and abruptly. Its direct antonym is 'gradually' (slowly step-by-step over time).",
    points: 1
  },
  {
    number: 32,
    prompt: "The runner looked dejected after losing the medal, but the champion appeared utterly ...... .",
    options: ["angry", "calm", "strong", "excited"],
    correctAnswer: "excited",
    hint: "'Dejected' means sad, depressed, and crestfallen. Find the word meaning joyful and elevated in spirit.",
    workedSolution: "'Dejected' means downcast, depressed, and sad. Its opposite in this emotional context is 'excited' (elated, joyful, and thrilled).",
    points: 1
  },

  // --- PART II: LITERATURE IN ENGLISH (33 - 40) ---
  {
    number: 33,
    prompt: "Read the poetic lines below:\n\"Young lady, you are like / The moon that walks beautifully across the sky, / An eagle feather worn by a husband.\"\nThis literary extract is written in verse form and is an example of ............",
    options: ["prose", "poetry", "drama", "dialogue"],
    correctAnswer: "poetry",
    hint: "Arranged in lines, stanzas, and figurative verse rather than continuous sentences and paragraphs.",
    workedSolution: "The extract is composed in figurative verse lines and stanzas; it is an example of 'poetry'.",
    points: 1
  },
  {
    number: 34,
    prompt: "In the poem above, the poet's primary subject of praise and admiration is ............",
    options: ["a shiny mirror", "an eagle feather", "the evening moon", "a beautiful young lady"],
    correctAnswer: "a beautiful young lady",
    hint: "The direct addressee and subject of the similes.",
    workedSolution: "The poem is an encomium (song of praise) directly praising the grace, beauty, and honor of 'a beautiful young lady'.",
    points: 1
  },
  {
    number: 35,
    prompt: "In the line \"The moon that walks beautifully across the sky\", the literary device employed is ............",
    options: ["metaphor", "hyperbole", "alliteration", "personification"],
    correctAnswer: "personification",
    hint: "Giving the celestial moon the human physical action of 'walking'.",
    workedSolution: "'Personification' endows inanimate nature or non-human objects with human attributes or actions (attributing the human act of walking to the moon).",
    points: 1
  },
  {
    number: 36,
    prompt: "The figurative expression \"Young lady, you are like / An eagle feather worn by a husband\" is an example of a/an ............",
    options: ["simile", "metaphor", "alliteration", "assonance"],
    correctAnswer: "simile",
    hint: "An explicit comparison between two things using the connective word 'like'.",
    workedSolution: "A 'simile' explicitly compares two distinct entities using the comparative connective word 'like' or 'as'.",
    points: 1
  },
  {
    number: 37,
    prompt: "A literary artist who composes verse in stanzas and poetic meter is designated as ............",
    options: ["a novelist", "a poet", "a playwright", "an actor"],
    correctAnswer: "a poet",
    hint: "A writer of poems.",
    workedSolution: "A writer or creator of poetry is a 'poet'. A novelist writes prose novels, and a playwright writes dramatic plays.",
    points: 1
  },
  {
    number: 38,
    prompt: "The poetic line \"The potter puts the pots in the pans\" demonstrates the sound device called ............",
    options: ["metaphor", "simile", "alliteration", "personification"],
    correctAnswer: "alliteration",
    hint: "Repetition of the initial voiceless bilabial plosive consonant sound /p/.",
    workedSolution: "'Alliteration' is the deliberate repetition of identical initial consonant sounds in neighboring words (/p/ in 'potter puts pots pans').",
    points: 1
  },
  {
    number: 39,
    prompt: "Read the verse below:\n\"Twinkle, twinkle, little star, (a)\nHow I wonder what you are! (a)\nUp above the world so high, (b)\nLike a diamond in the sky.\" (b)\nThe rhyme scheme of this traditional stanza is ............",
    options: ["abab", "aabc", "abcc", "aabb"],
    correctAnswer: "aabb",
    hint: "Paired rhyming couplets: 'star' / 'are' (aa) and 'high' / 'sky' (bb).",
    workedSolution: "The end words form rhyming couplets: 'star' rhymes with 'are' (aa), and 'high' rhymes with 'sky' (bb), resulting in an 'aabb' rhyme scheme.",
    points: 1
  },
  {
    number: 40,
    prompt: "The expression \"Afua Bonsu is the apple of my eye\" is an example of a/an ............",
    options: ["metaphor", "simile", "alliteration", "personification"],
    correctAnswer: "metaphor",
    hint: "A direct figurative equation without using 'like' or 'as'.",
    workedSolution: "'Metaphor' directly identifies one person or thing as another without using comparison markers ('like' or 'as'). Describing someone as 'the apple of my eye' equates them directly to a cherished treasure.",
    points: 1
  }
];

// Seeded Deterministic Shuffle to Guarantee Exactly 10 A, 10 B, 10 C, 10 D
const targetKeys: number[] = [
  0, 1, 2, 3, 0, 1, 2, 3, 0, 1,
  2, 3, 0, 1, 2, 3, 0, 1, 2, 3,
  0, 1, 2, 3, 0, 1, 2, 3, 0, 1,
  2, 3, 0, 1, 2, 3, 0, 1, 2, 3
];

function seedShuffle<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  let m = arr.length, t, i;
  while (m) {
    seed = (seed * 9301 + 49297) % 233280;
    i = Math.floor((seed / 233280) * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

const assignedTargetIndices = seedShuffle(targetKeys, 201001);

const balancedPaper1 = rawQuestions.map((q, idx) => {
  const correctIdx = assignedTargetIndices[idx]; // 0=A, 1=B, 2=C, 3=D
  const options: string[] = [];
  const rawDistractors = q.options.filter(opt => opt !== q.correctAnswer);
  let dCount = 0;
  for (let pos = 0; pos < 4; pos++) {
    if (pos === correctIdx) {
      options.push(q.correctAnswer);
    } else {
      options.push(rawDistractors[dCount++]);
    }
  }
  return {
    number: q.number,
    prompt: q.prompt,
    options: options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: q.points
  };
});

// ==========================================
// PAPER 2: ESSAY & COMPREHENSION
// ==========================================
const paper2Calibrated = {
  sectionA_essay: {
    title: "Part A: Essay Writing",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Informal Letter",
        prompt: "Write a letter to your father asking for permission and financial support to join your classmates on an educational excursion to the Akosombo Hydroelectric Dam and the Volta Lake.",
        modelAnswer: `St. Anthony's Junior High School\nP. O. Box 32\nNkawkaw, Eastern Region\n14th June, 2010\n\nDear Father,\n\nI hope this letter finds you in excellent health, peaceful spirits, and thriving in your business. I am writing to formally request your kind permission and financial assistance to join my classmates on our annual school educational excursion scheduled for the end of this month.\n\nOur school Science and Social Studies clubs have organized a three-day educational tour to the Akosombo Hydroelectric Dam, the Shai Hills Resource Reserve, and the historical castles along the coast. As you know, we are currently studying energy transformations and colonial history in our BECE syllabus. Visiting the Akosombo Generating Station will provide me with a practical, first-hand understanding of how falling water turns massive turbines to generate electric power for the entire nation.\n\nFurthermore, our teachers have arranged guided lectures with electrical engineers and conservation officers, which will greatly enrich our preparation for the upcoming national examinations. The total excursion fee is sixty Ghana Cedis, which covers return transportation by commercial tour bus, safe hostel accommodation, guided site fees, and feeding for the entire duration.\n\nMy class teacher has appealed that all payments be finalized by next Friday to secure seat reservations. I promise to be on my best behavior throughout the trip and take detailed notes. I would be immensely grateful if you could send the amount through my senior housemaster.\n\nPlease extend my warmest greetings to Mother and my younger siblings.\n\nYour loving son,\n[Signature]\nKwame Osei`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in a local community newspaper on the topic: \"Why Every Basic School Should Have a Well-Stocked Library.\"",
        modelAnswer: `THE URGENT NEED FOR FUNCTIONAL LIBRARIES IN OUR BASIC SCHOOLS\nBy Gladys Arthur, JHS 3\n\nIn contemporary Ghanaian society, literacy and sound education are universally acknowledged as the bedrock of national progress. Yet, a visit to many public basic schools in our municipality reveals a heartbreaking deficiency: the total absence of functional, well-stocked libraries. Establishing modern libraries in every basic school is an urgent developmental imperative.\n\nFirst and foremost, a school library is the primary engine that cultivates a sustainable reading culture and sharpens language proficiency. Many pupils in our communities come from underprivileged homes where parents cannot afford leisure reading storybooks or reference encyclopedias. A well-stocked library bridges this socio-economic divide, granting every child equal access to fiction, poetry, and supplementary readers. Regular reading enriches vocabulary, improves spelling, and equips learners with the grammatical competence needed to write compelling essays in national examinations.\n\nSecondly, a library provides a serene environment that fosters independent learning and intellectual curiosity. True education goes beyond memorizing chalkboard notes dictated by teachers. When learners have access to historical atlases, science journals, and past examination compendiums, they learn to research questions independently. This nurtures analytical problem-solving skills and intellectual self-reliance, preparing them adequately for Senior High School education.\n\nIn conclusion, a school without a library is like a body without a soul. The Municipal Education Directorate, our Member of Parliament, and local philanthropic bodies must join hands to construct and equip libraries in all basic schools to safeguard the intellectual future of our youth.`
      },
      {
        questionNumber: "3",
        category: "Narrative Essay",
        prompt: "Write an engaging, realistic story illustrating the timeless truth of the proverb: \"All that glitters is not gold.\"",
        modelAnswer: `During the long vacation following our Form Two examinations, a stylish young man named Marcus arrived in our quiet village of Asamankese. He dressed in immaculate designer suits, wore flashy gold-plated wristwatches, and drove a sleek, customized sports saloon car. He claimed to be an international gold exporter and real estate tycoon operating from Switzerland. Within days, his free-spending generosity and dazzling promises captivated the entire village.\n\nMarcus announced that he was establishing an overseas educational scholarship fund and private gold refinery that would employ over two hundred local school leavers. He promised young school leavers lucrative overseas travel visas and luxury salaries, provided their families deposited a registration fee of five hundred Ghana Cedis each to process their travel documents. Blinded by his glittering lifestyle and polished eloquence, many villagers, including my uncle Kwadwo, sold cocoa farms and livestock to register their children. Marcus organized lavish dinners at the local guest house, displaying counterfeit visa approval letters stamped with international seals.\n\nOn the morning scheduled for the departure of the first batch of beneficiaries to the airport in Accra, the villagers gathered at the village square in festive attire, beating drums and singing songs of praise. To their utter horror, the guest house manager announced that Marcus had secretly packed his luggage and fled in the dead of night, leaving behind unpaid lodging bills and a rented car. A subsequent police investigation revealed that he was a notorious convicted swindler from the metropolis who had fabricated everything.\n\nWatching my uncle weep over his squandered farm savings, I realized the bitter truth of the ancient saying: All that glitters is not gold.`
      }
    ]
  },
  sectionB_comprehension: {
    title: "Part B: Reading Comprehension",
    passage: `When I was about eleven years old, I was unable to stay at one place for long; I was always on the move. Many people thought and said I was troublesome. Prominent among those who described me as such was my aunt, Araba Oboshea.\n\nAunt Araba was particularly mean. She would sit on her stool under the gum tree in front of the house and wait for me to return from wherever I had gone. As soon as I arrived she would call me and, without asking me any question or telling me anything, take my left ear between the forefinger and the thumb of her right hand and give my ear a silent, violent twist. I cannot describe the pain I endured. She would do the same to my right ear. She explained that she was paying for my absence that I had sold to her! Aunt Araba would continue to twist both ears of mine simultaneously with her forefingers and thumbs.\n\nI would scream silently, gritting my teeth so that I could not utter any sound because of pain. That way I was spared the next stage of being given countless strokes of any stick she could lay hands on. One strange thing about Aunt Araba was that she would never hit me with her hands.\n\nAunt Araba went on treating me this way because she could hardly understand why I was always on the move. I could also not have the courage to explain why it was so because I was afraid of her and began to hate her.\n\nOn Thursday evening when I was going through my usual ordeal, an elderly man, Agya Manu, who usually visited her, appeared on the scene. He pleaded with her to leave me, and asked for the reason for such punishment. After he had been told my 'sin', Agya Manu, who knew me very well, explained to my auntie that I was always on the move not because I was in any bad company, but because I was the favourite for errands. I had been running several errands for him and many other people. Agya Manu then advised me not to spend all my time running errands for others but rather, do all my duties at home.`,
    questions: [
      {
        subId: "(a)",
        question: "What was the writer's characteristic behavior when he was about eleven years old?",
        answer: "He was restless, hyperactive, unable to stay in one place for long, and always on the move."
      },
      {
        subId: "(b)",
        question: "\"... I was always on the move.\"\nWhat is the meaning of this expression as used in the passage?",
        answer: "He was constantly wandering about, running errands, and never staying still at home."
      },
      {
        subId: "(c)",
        question: "From the passage, describe the character of Aunt Araba.",
        answer: "She was mean, harsh, cruel, unsympathetic, impatient, and abusive in her disciplinary methods."
      },
      {
        subId: "(d)",
        question: "Why did Aunt Araba keep punishing the writer so severely?",
        answer: "Because she could not understand why he was constantly absent from home, assuming he was merely roaming about and being troublesome."
      },
      {
        subId: "(e)",
        question: "How did Agya Manu rescue the writer from his painful ordeal?",
        answer: "He pleaded with Aunt Araba to stop twisting his ears and explained the truth: that the boy was not in bad company, but had been running helpful errands for him and other community elders."
      },
      {
        subId: "(f)",
        question: "For each of the following words, give one word or phrase that means the same and can fit into the passage:\n(i) endured;\n(ii) countless.",
        answer: "(i) **endured:** suffered / bore / underwent / tolerated.\n(ii) **countless:** numerous / innumerable / many / uncounted."
      }
    ]
  }
};

// Flattened Paper 2 Questions for Paper2ExamRunner.tsx with AI Essay Workspace
const flattenedPaper2Questions = [
  ...paper2Calibrated.sectionA_essay.questions.map((q) => ({
    id: `essay_${q.questionNumber}`,
    partLabel: `Part A (Question ${q.questionNumber}) - ${q.category}`,
    prompt: q.prompt,
    modelAnswer: q.modelAnswer,
    marks: 30
  })),
  ...paper2Calibrated.sectionB_comprehension.questions.map((q, idx) => ({
    id: `comp_${q.subId.replace(/[()]/g, '_')}`,
    partLabel: `Part B: Comprehension ${q.subId}`,
    prompt: (idx === 0 ? `Read the passage carefully and answer the questions that follow:\n\n${paper2Calibrated.sectionB_comprehension.passage}\n\n` : '') + q.question,
    modelAnswer: q.answer,
    marks: 5
  }))
];

async function seedBeceEnglish2010Calibrated() {
  const db = await getDb();
  console.log("Seeding Calibrated & Balanced BECE English 2010 into Firestore...");

  // Key Balance Audit
  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  balancedPaper1.forEach((q) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log("Verified Key Balance (Exactly 10 of each):", keyDist);

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2010");
  await docRef.set({
    year: 2010,
    title: "BECE English Language 2010 (Calibrated National Benchmark)",
    subjectId: "english",
    metadata: {
      isPastQuestion: true,
      standard: "NaCCA / WAEC BECE Standard",
      totalMarks: 100,
      totalDurationMinutes: 120,
      paper1Count: balancedPaper1.length,
      optionsBalanced: true,
      unplagiarizedPedagogicalAdaptation: true,
      sectionsPresent: ["Paper 1 (Objectives)", "Paper 2 Part A (Essay)", "Paper 2 Part B (Comprehension)"],
      status: "calibrated",
      updatedAt: new Date()
    },
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      questions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Essay and Reading Comprehension",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Calibrated BECE English 2010 successfully seeded into Firestore!");
}

seedBeceEnglish2010Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2010:", err);
    process.exit(1);
  });
