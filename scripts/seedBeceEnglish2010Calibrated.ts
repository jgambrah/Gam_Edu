import * as dns from 'dns';
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
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
      return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient, ignoreUndefinedProperties: true });
    }
  } catch (e) {
    console.log("Fallback to admin default credentials...", e);
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

// =========================================================================
// 100% CLEAN-ROOM ISOMORPHIC QUESTIONS (1 - 40)
// =========================================================================
const allRawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "The school bus driver arrived late at the terminal because the vehicle ............ a punctured tire.",
    options: ["had", "will have", "is having", "has"],
    correctAnswer: "had",
    hint: "Past simple tense: The sentence describes a completed past incident ('arrived late').",
    workedSolution: "The main clause expresses a completed past event ('arrived late'). The causal clause requires the simple past tense: 'had'.",
    points: 1
  },
  {
    number: 2,
    prompt: "We celebrated our graduation at a seaside eatery where I ............ grilled tilapia.",
    options: ["am enjoying", "will enjoy", "enjoyed", "would enjoy"],
    correctAnswer: "enjoyed",
    hint: "Sequence of past narrative tenses: Governed by the past tense 'celebrated'.",
    workedSolution: "To maintain narrative past tense consistency with 'We celebrated...', the simple past indicative 'enjoyed' is required.",
    points: 1
  },
  {
    number: 3,
    prompt: "The school counselor advised Mansa to choose ............ the two senior high schools.",
    options: ["among", "from", "with", "between"],
    correctAnswer: "between",
    hint: "Preposition used when distinguishing or selecting between exactly two choices.",
    workedSolution: "'Between' is used when choosing between two options or individuals. 'Among' applies to three or more.",
    points: 1
  },
  {
    number: 4,
    prompt: "Kofi contracted typhoid and is not ............ enough to write the promotional test.",
    options: ["good", "well", "fine", "free"],
    correctAnswer: "well",
    hint: "Predicative adjective describing bodily physical health and freedom from illness.",
    workedSolution: "In the context of health and recovery from sickness, 'well' functions as a predicative adjective meaning healthy: 'not well enough to write the test'.",
    points: 1
  },
  {
    number: 5,
    prompt: "The municipal brass band ............ three evenings every week.",
    options: ["practise", "are practising", "practises", "were practising"],
    correctAnswer: "practises",
    hint: "Singular collective subject ('The municipal brass band') taking a habitual simple present verb.",
    workedSolution: "The collective noun 'The municipal brass band' acts as a singular unit taking the third-person singular present verb 'practises'. (In British/Ghanaian English, 'practise' is the verb and 'practice' is the noun).",
    points: 1
  },
  {
    number: 6,
    prompt: "The sprinter ............ won the gold medal if he had trained more vigorously.",
    options: ["could have", "will have", "may have", "could"],
    correctAnswer: "could have",
    hint: "Third conditional: 'if + past perfect (`had trained`)' takes 'could have / would have + past participle'.",
    workedSolution: "In a counterfactual past conditional construction ('if he had trained...'), the main clause requires a modal past perfect: 'could have [won]'.",
    points: 1
  },
  {
    number: 7,
    prompt: "The environmental statute was drafted in conformity with established constitutional ............ .",
    options: ["cases", "principles", "rules", "issues"],
    correctAnswer: "principles",
    hint: "Formal legal doctrines, foundations, and established tenets of jurisprudence.",
    workedSolution: "The established phrase in law referring to fundamental tenets and doctrines is 'constitutional principles' (or 'legal principles').",
    points: 1
  },
  {
    number: 8,
    prompt: "The textbook, as well as several supplementary readers, ............ fascinating reading.",
    options: ["makes", "are to make", "are making", "make"],
    correctAnswer: "makes",
    hint: "Parenthetical additions introduced by 'as well as' do not alter the singular subject 'The textbook'.",
    workedSolution: "Parenthetical phrases like 'as well as several supplementary readers' do not pluralize the singular subject 'The textbook', requiring the singular verb 'makes'.",
    points: 1
  },
  {
    number: 9,
    prompt: "............ the striker clinched the winning goal, he fractured his ankle during the match.",
    options: ["But", "Nevertheless", "Although", "Furthermore"],
    correctAnswer: "Although",
    hint: "Subordinating conjunction of concession introducing a dependent contrasting clause.",
    workedSolution: "'Although' is a subordinating conjunction of concession connecting the contrasting dependent clause to the main clause.",
    points: 1
  },
  {
    number: 10,
    prompt: "Neither the class prefect nor his desk-mate ............ the algebraic equation clearly.",
    options: ["understands", "have understood", "understand", "is understanding"],
    correctAnswer: "understands",
    hint: "Proximity rule with 'neither... nor': The verb agrees with the nearer subject ('his desk-mate', singular).",
    workedSolution: "When subjects are linked by 'neither... nor', the verb agrees in number with the nearer subject ('his desk-mate', singular third-person), requiring 'understands'.",
    points: 1
  },
  {
    number: 11,
    prompt: "The new ............ vocational institute is located near the municipal gardens.",
    options: ["womens'", "woman", "womans'", "women's"],
    correctAnswer: "women's",
    hint: "'Women' is an irregular plural noun; plurals not ending in -s form their possessive with 's.",
    workedSolution: "'Women' is an irregular plural noun. Plural nouns that do not end in -s form their possessive by adding apostrophe + 's': 'women's institute'.",
    points: 1
  },
  {
    number: 12,
    prompt: "One of the bullocks ............ from the grazing enclosure.",
    options: ["has strayed", "have strayed", "have been strayed", "has been strayed"],
    correctAnswer: "has strayed",
    hint: "The true grammatical head is 'One' (singular), requiring a singular active verb.",
    workedSolution: "The subject head is 'One' (singular) of the bullocks, requiring the third-person singular present perfect active verb 'has strayed'.",
    points: 1
  },
  {
    number: 13,
    prompt: "For the annual harvest banquet, the organizers ordered a massive ............ of fruit juice.",
    options: ["count", "total", "quantity", "sum"],
    correctAnswer: "quantity",
    hint: "Mass non-count liquids and bulk beverages are measured in volume or quantity.",
    workedSolution: "Beverages and liquids are uncountable bulk items measured by volume, requiring 'quantity' ('a massive quantity of fruit juice').",
    points: 1
  },
  {
    number: 14,
    prompt: "The examination hall was so congested that it could ............ accommodate all the candidates.",
    options: ["rarely", "comfortably", "conveniently", "hardly"],
    correctAnswer: "hardly",
    hint: "Negative adverb of degree meaning scarcely or with extreme difficulty.",
    workedSolution: "'Hardly' is a negative adverb of degree meaning barely or scarcely: 'could hardly accommodate all of us'.",
    points: 1
  },
  {
    number: 15,
    prompt: "If I were the school headmaster, I ............ abolish all compulsory afternoon prep.",
    options: ["will", "shall", "would", "must"],
    correctAnswer: "would",
    hint: "Second conditional (hypothetical unreal present): 'If I were..., I would...'.",
    workedSolution: "In a Second Conditional sentence expressing an unreal or hypothetical present condition ('If I were...'), the main clause takes 'would': 'I would abolish'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "Master Darko performs creditably in all his inter-school debates.\nChoose the word nearest in meaning to 'creditably'.",
    options: ["fairly", "well", "graciously", "good"],
    correctAnswer: "well",
    hint: "In a praiseworthy, commendable manner or to a high standard.",
    workedSolution: "'Creditably' means in a manner deserving praise, honor, or doing something 'well'; 'well' is its direct adverbial synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "The traditional choir rendered some melodious anthems during the festival.\nChoose the word nearest in meaning to 'melodious'.",
    options: ["loud", "pleasant", "soft", "musical"],
    correctAnswer: "pleasant",
    hint: "Harmonious, sweet-sounding, and agreeable to the ears.",
    workedSolution: "'Melodious' means producing sweet, harmonious, and pleasing sounds; 'pleasant' is its closest synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "The senior prefect is always immaculately attired for morning parade.\nChoose the word nearest in meaning to 'immaculately'.",
    options: ["modestly", "correctly", "neatly", "scantily"],
    correctAnswer: "neatly",
    hint: "Spotlessly clean, tidy, and impeccably turned out.",
    workedSolution: "'Immaculately' means spotlessly, flawlessly, and impeccably clean; 'neatly' is its closest equivalent.",
    points: 1
  },
  {
    number: 19,
    prompt: "The coastal town was enveloped in an impenetrable harmattan haze.\nChoose the word nearest in meaning to 'enveloped'.",
    options: ["built", "put", "shaped", "covered"],
    correctAnswer: "covered",
    hint: "Wrapped up, shrouded, or submerged from sight.",
    workedSolution: "'Enveloped' means completely wrapped up, surrounded, or 'covered'.",
    points: 1
  },
  {
    number: 20,
    prompt: "The inquisitive journalist asked several probing questions at the briefing.\nChoose the word nearest in meaning to 'inquisitive'.",
    options: ["curious", "pompous", "intelligent", "cowardly"],
    correctAnswer: "curious",
    hint: "Eager for information; actively asking questions to investigate.",
    workedSolution: "'Inquisitive' means eager for knowledge, inquiring, or 'curious'.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "Whenever Yaw visits the capital city, he puts up with his grand-uncle. This means that Yaw ............",
    options: ["helps his grand-uncle", "stays with his grand-uncle", "converses with his grand-uncle", "avoids his grand-uncle"],
    correctAnswer: "stays with his grand-uncle",
    hint: "To lodge or reside temporarily with someone.",
    workedSolution: "In the context of lodging, the phrasal verb 'to put up with someone' means to lodge or 'stay with' them temporarily.",
    points: 1
  },
  {
    number: 22,
    prompt: "I glanced over the examination guidelines while commuting to school. This means that I quickly ............ the guidelines.",
    options: ["wrote", "analysed", "saw", "read"],
    correctAnswer: "read",
    hint: "To skim, review, or read through cursorily and quickly.",
    workedSolution: "'To glance over' a text means to skim through or 'read' it briefly and quickly.",
    points: 1
  },
  {
    number: 23,
    prompt: "Mother entered the hall to find her son with his eyes glued to the television screen. This means that her son was ............",
    options: [
      "smiling at the screen",
      "dismantling the set",
      "intently watching the screen",
      "dusting the television"
    ],
    correctAnswer: "intently watching the screen",
    hint: "Watching with undivided, fixed attention without looking away.",
    workedSolution: "The idiom 'eyes glued to something' means looking at or 'intently watching' it with complete, rapt attention.",
    points: 1
  },
  {
    number: 24,
    prompt: "The apprentice was dragged to the disciplinary committee like a lamb to the slaughter. This means he went ............",
    options: [
      "with immense physical difficulty",
      "quietly without offering any resistance",
      "carrying a live animal",
      "without any shoes on"
    ],
    correctAnswer: "quietly without offering any resistance",
    hint: "Submissively, helplessly, and without offering any resistance.",
    workedSolution: "The idiom 'like a lamb to the slaughter' describes going somewhere helplessly, submissively, or without offering resistance.",
    points: 1
  },
  {
    number: 25,
    prompt: "The senior boy was warned to leave the new junior pupil alone. This means the senior was instructed ............",
    options: [
      "not to accompany him home",
      "to accompany him everywhere",
      "not to disturb or tease him",
      "to coach him in athletics"
    ],
    correctAnswer: "not to disturb or tease him",
    hint: "To stop bothering, harassing, or interfering with someone.",
    workedSolution: "The idiom 'to leave someone alone' means to stop bothering, harassing, or 'disturbing' them.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 32) ---
  {
    number: 26,
    prompt: "While several patrons at the durbar were rude, the master of ceremonies was remarkably ...... .\nChoose the word most nearly opposite in meaning to 'rude'.",
    options: ["courteous", "bold", "friendly", "shy"],
    correctAnswer: "courteous",
    hint: "'Rude' means impolite and ill-mannered. What word denotes polite and well-mannered?",
    workedSolution: "'Rude' means discourteous or impolite. Its direct behavioral antonym is 'courteous' (polite).",
    points: 1
  },
  {
    number: 27,
    prompt: "The state prosecutor presented copious documentation, but the defense had only ...... records.\nChoose the word most nearly opposite in meaning to 'copious'.",
    options: ["inconsistent", "scanty", "bad", "unconvincing"],
    correctAnswer: "scanty",
    hint: "'Copious' means abundant and plentiful. What word denotes meager, scarce, or insufficient?",
    workedSolution: "'Copious' means abundant or plentiful. Its direct quantitative antonym is 'scanty' (meager or scarce).",
    points: 1
  },
  {
    number: 28,
    prompt: "A fair investigator must remain objective, rather than being swayed by ...... biases.\nChoose the word most nearly opposite in meaning to 'objective'.",
    options: ["subjective", "positive", "active", "emotive"],
    correctAnswer: "subjective",
    hint: "'Objective' means impartial, factual, and unbiased. What word denotes based on personal feelings or bias?",
    workedSolution: "'Objective' means factual, neutral, and unbiased. Its direct antonym is 'subjective' (biased by personal feelings).",
    points: 1
  },
  {
    number: 29,
    prompt: "In our dormitory, loud noise during prep hours is prohibited, while silent study is ...... .\nChoose the word most nearly opposite in meaning to 'prohibited'.",
    options: ["advised", "ignored", "permitted", "admitted"],
    correctAnswer: "permitted",
    hint: "'Prohibited' means forbidden by rule. What word denotes officially allowed?",
    workedSolution: "'Prohibited' means forbidden by regulation. Its direct antonym is 'permitted' (allowed).",
    points: 1
  },
  {
    number: 30,
    prompt: "The team strove to avoid defeat by securing a resounding ...... in the tournament.\nChoose the word most nearly opposite in meaning to 'defeat'.",
    options: ["position", "victory", "knowledge", "ability"],
    correctAnswer: "victory",
    hint: "'Defeat' means losing a contest. What word denotes triumph or winning?",
    workedSolution: "'Defeat' denotes failure or loss in a contest. Its direct opposite is 'victory' (triumph or winning).",
    points: 1
  },
  {
    number: 31,
    prompt: "Suddenly the bright morning sky turned pitch-black before the storm broke.\nChoose the word most nearly opposite in meaning to 'Suddenly'.",
    options: ["Continuously", "Gradually", "Heavily", "Immediately"],
    correctAnswer: "Gradually",
    hint: "'Suddenly' means quickly and unexpectedly. What word denotes slowly over time step-by-step?",
    workedSolution: "'Suddenly' means abruptly or unexpectedly. Its direct temporal antonym is 'Gradually' (slowly over time).",
    points: 1
  },
  {
    number: 32,
    prompt: "The goalkeeper looked dejected after conceding the goal, but his supporters remained ...... .\nChoose the word most nearly opposite in meaning to 'dejected'.",
    options: ["angry", "calm", "strong", "excited"],
    correctAnswer: "excited",
    hint: "'Dejected' means sad, downcast, and dispirited. What word denotes joyful, enthusiastic, and upbeat?",
    workedSolution: "'Dejected' means depressed, sad, or dispirited. Its direct emotional antonym among the options is 'excited' (cheerful, joyful).",
    points: 1
  },

  // --- PART II: LITERATURE IN ENGLISH (33 - 40) ---
  {
    number: 33,
    prompt: "Read the poetic extract carefully:\n'Graceful maiden, you are like\nThe silver moon that glides across the evening sky,\nA precious eagle feather in an elder's crown.'\n\nThis literary extract is an example of ............ .",
    options: ["prose", "poetry", "drama", "dialogue"],
    correctAnswer: "poetry",
    hint: "Composed in verse lines and stanzas utilizing figurative imagery.",
    workedSolution: "The literary piece is composed in metered lines and stanzas utilizing figurative imagery, which defines 'poetry'.",
    points: 1
  },
  {
    number: 34,
    prompt: "Read the poetic extract carefully:\n'Graceful maiden, you are like\nThe silver moon that glides across the evening sky,\nA precious eagle feather in an elder's crown.'\n\nThe central subject of this extract is ............ .",
    options: ["a shiny mirror", "an eagle feather", "the night sky", "a beautiful young maiden"],
    correctAnswer: "a beautiful young maiden",
    hint: "The extract directly addresses and praises this specific individual.",
    workedSolution: "The poem is an encomium directly addressing and praising 'a beautiful young maiden' using celestial and royal imagery.",
    points: 1
  },
  {
    number: 35,
    prompt: "'The silver moon that glides across the evening sky'\nThis line is an example of ............ .",
    options: ["metaphor", "hyperbole", "alliteration", "personification"],
    correctAnswer: "personification",
    hint: "Attributing human actions (gliding like a dancer) to an inanimate celestial body.",
    workedSolution: "Attributing intentional human locomotion ('glides gracefully') to an inanimate celestial entity (the moon) is 'personification'.",
    points: 1
  },
  {
    number: 36,
    prompt: "'Graceful maiden, you are like ... A precious eagle feather in an elder's crown'\nThis comparison is an example of ............ .",
    options: ["simile", "metaphor", "alliteration", "assonance"],
    correctAnswer: "simile",
    hint: "A direct figurative comparison using the connective word 'like'.",
    workedSolution: "A figure of speech making a direct comparison between two distinct things using 'like' or 'as' is a 'simile'.",
    points: 1
  },
  {
    number: 37,
    prompt: "An author who composes poems and verse literature is called ............ .",
    options: ["a novelist", "a poet", "a playwright", "an actor"],
    correctAnswer: "a poet",
    hint: "A novelist writes prose, a playwright writes plays, and this artist composes verse.",
    workedSolution: "A person who writes or composes poems is called 'a poet'.",
    points: 1
  },
  {
    number: 38,
    prompt: "'Peter picked polished pumpkins from the pantry.'\nThis sentence is an example of ............ .",
    options: ["metaphor", "simile", "alliteration", "personification"],
    correctAnswer: "alliteration",
    hint: "Repetition of the initial consonant sound /p/ across adjacent words.",
    workedSolution: "The repetition of the identical initial consonant sound (/p/) across adjacent words ('**P**eter **p**icked **p**olished **p**umpkins from the **p**antry') is 'alliteration'.",
    points: 1
  },
  {
    number: 39,
    prompt: "Read the verse carefully:\n'Twinkle, twinkle, little star,\nHow I wonder what you are!\nUp above the world so high,\nLike a diamond in the sky.'\n\nThe rhyme scheme of this verse is ............ .",
    options: ["abab", "aabc", "abcc", "aabb"],
    correctAnswer: "aabb",
    hint: "Line 1 (star) & Line 2 (are) rhyme ('aa'); Line 3 (high) & Line 4 (sky) rhyme ('bb').",
    workedSolution: "The terminal rhymes are: 'star' / 'are' (end sounds A, A) and 'high' / 'sky' (end sounds B, B), yielding an 'aabb' rhyme scheme.",
    points: 1
  },
  {
    number: 40,
    prompt: "'Afua Bonsu is the apple of my eye.'\nThis sentence is an example of ............ .",
    options: ["metaphor", "simile", "alliteration", "personification"],
    correctAnswer: "metaphor",
    hint: "Directly equating one entity to another without using 'like' or 'as'.",
    workedSolution: "A figure of speech that directly equates one entity to another without the connective words 'like' or 'as' is a 'metaphor'.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 201004);

const balancedPaper1: QuestionItem[] = allRawQuestions.map((q, idx) => {
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

// =========================================================================
// PAPER 2: ESSAY WRITING & COMPREHENSION (THEORY SUITE)
// =========================================================================
const paper2Calibrated = {
  partA_composition: {
    title: "Part A: Composition",
    instructions: "Answer one question only from this section. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Formal / Parental Permission Letter",
        prompt: "Write a letter to your father who lives in another town, asking for his permission and financial assistance to join your schoolmates on an educational excursion to the Volta Region.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Bekwai, Ashanti Region
14th May, 2010

Dear Father,

I hope this letter finds you in excellent health, peace of mind, and thriving in your business enterprises in Accra. Everyone at home is doing well, and Mother constantly sends her prayers for your safety.

I write to respectfully seek your permission and financial support to participate in an upcoming educational excursion organized by our school's Science and Social Studies Club to the Volta Region from Friday, 18th June to Sunday, 20th June 2010.

This excursion is designed to provide practical academic exposure that directly complements our final BECE curriculum. We are scheduled to tour the Akosombo Hydroelectric Dam to observe the conversion of kinetic water energy into electrical power, which is a major topic in our Integrated Science syllabus. In addition, we will visit the Tafi Atome Monkey Sanctuary and Mount Afadja to study tropical biodiversity, physical geography, and eco-tourism. Witnessing these landmarks first-hand will transform abstract classroom notes into vivid realities.

The total fee for the excursion is forty Ghana cedis (GH¢ 40.00), which covers chartered return transportation, secured dormitory accommodation at Mawuli School, meals, and facility entrance levies. Our headmaster and three senior masters will accompany the delegation to maintain strict discipline.

Knowing how deeply you value my academic advancement, I pray that you will grant your paternal blessing and remit the funds before the registration deadline on 5th June.

Thank you for your endless love and sacrifices for my education.

Your loving son,
[Signature]
Kwabena Mensah
(JHS Form Three Gold)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in a national newspaper on the topic: \"Every Basic School Should Have a Modern Library.\"",
        modelAnswer: `EVERY BASIC SCHOOL SHOULD HAVE A MODERN LIBRARY
By Samuel K. Boateng, Begoro

In the contemporary information age, education is the foundation of national socio-economic progress. While governments and communities invest heavily in constructing classrooms and procuring textbooks, one indispensable academic facility remains glaringly absent in thousands of basic schools across Ghana: a functional, well-equipped school library.

A modern school library is not an educational luxury; it is the beating intellectual heart of any serious academic institution. First and foremost, a library cultivates an enduring reading culture among young learners. In an era dominated by distracting digital media, having access to an organized sanctuary stocked with diverse literature, historical encyclopedias, and creative fiction stimulates children's curiosity and fosters independent study habits. Regular reading sharpens grammatical accuracy, expands vocabulary, and improves analytical writing skills, directly reversing the alarming decline in basic English literacy.

Secondly, a school library bridges the socio-economic inequality gap. Many children from low-income homes cannot afford expensive reference encyclopedias, supplementary readers, or past question compendiums. A stocked library democratizes access to knowledge, ensuring that every student—regardless of parental wealth—has access to the reference materials needed to excel in national examinations like the BECE.

Furthermore, integrating modern basic libraries with internet-connected computers equips students with essential digital literacy, enabling them to conduct academic research and compete with peers worldwide.

To secure Ghana's intellectual future, the Ministry of Education, municipal assemblies, and corporate organizations must partner to construct and furnish libraries in every public basic school. A school without a library is like a tree without roots.`
      },
      {
        questionNumber: "3",
        category: "Narrative Moral Essay",
        prompt: "Write an interesting, realistic story illustrating the timeless truth of the traditional saying: \"All that glitters is not gold.\"",
        modelAnswer: `ALL THAT GLITTERS IS NOT GOLD

During our final year in junior high school, my close friend, Kofi Mensah, was easily dazzled by outward appearances and material luxury. While our teachers continually emphasized humility, honest labor, and academic discipline, Kofi daydreamed about designer sneakers, expensive wristwatches, and the extravagant lifestyle of metropolitan socialites.

His obsession deepened when a smooth-talking young stranger named Patrick moved into our neighborhood. Dressed in shimmering silk suits, driving a rented sports car, and flashing stacks of crisp foreign banknotes, Patrick quickly became Kofi's hero. Patrick mocked schooling as a sluggish, pointless pathway to wealth, boasting that his lucrative "import-export brokerage" in the city earned him millions without sweat. Disregarding my warnings, Kofi began skipping morning revision classes to run private errands for Patrick, completely intoxicated by the prospect of becoming rich overnight.

One Friday evening, Patrick promised to introduce Kofi to the "big league" of his international business. He gave Kofi a locked leather briefcase and directed him to deliver it to a luxury hotel suite near the highway, promising him two thousand dollars upon successful delivery. Believing he had achieved his dream, Kofi took a taxi to the venue with his heart pounding in excitement.

However, as he stepped into the hotel lobby, a crack squad of anti-narcotics police officers swarmed him, weapons drawn. Forcing the briefcase open, the detectives uncovered bundles of illicit contraband drugs and counterfeit currency. Patrick was an undercover syndicate courier using my naive friend as a disposable decoy.

Weeping bitterly in handcuffs at the police station, Kofi realized that Patrick's dazzling glamour was a toxic facade that led straight to prison. It was a harrowing lesson: All that glitters is not gold.`
      }
    ]
  },
  partB_comprehension: {
    title: "Part B: Reading Comprehension",
    instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
    passageText: `When I was about eleven years of age, remaining stationary in one place was an impossibility for me; I was perpetually on the move across our village. Neighbors and relatives frequently declared that I was incorrigibly troublesome. Foremost among those who held this opinion was my stern aunt, Auntie Serwaa.

Auntie Serwaa was extraordinarily severe and unforgiving. She would take her seat upon a low wooden stool beneath the spreading branches of the ancient nim tree in the courtyard, waiting patiently for my return from wherever my restless feet had carried me. The moment I stepped through the entrance, she would beckon me forward and, without demanding any explanation or uttering a single greeting, grip the cartilage of my left ear between the thumb and forefinger of her right hand and execute a silent, agonizing twist. The searing pain I endured was indescribable. She would repeat the exact torment upon my right ear, declaring grimly that she was "purchasing the hours of absence I had sold away"! Often, she would seize both of my ears simultaneously with both hands and twist them in unison. I would bite my lip and grit my teeth in silent agony, knowing that if I let out the slightest cry of protest, she would immediately reach for a bundle of supple cane switches to administer a merciless flogging. Strangely enough, she never struck me with her bare palms.

Auntie Serwaa persisted in this harsh treatment because she could not fathom why I was perpetually wandering away from the compound. For my part, I lacked the courage to enlighten her, paralyzed by fear and nurturing a growing resentment toward her cruelty.

One Thursday evening, while I was enduring my customary torture under the tree, an elderly community patriarch, Opanyin Kwaw, arrived to pay his respects. Startled by the sight of my contorted, tearful face, he intervened and urged my aunt to release me, asking what grievous offense justified such punishment. Upon hearing her complaint, Opanyin Kwaw burst into hearty laughter and enlightened my aunt. He explained that I was perpetually absent not because I kept vicious company or engaged in mischief, but because I was the most dependable and willing errand boy in the entire neighborhood. I was constantly running grocery and message errands for him and several other infirm elders who relied on my swift feet. Turning to me, Opanyin Kwaw advised me gently to balance my eagerness to assist neighbors with fulfilling my domestic duties at home.`,
    questions: [
      {
        subQuestion: "(a)",
        question: "What was the writer's behaviour when he was about eleven years old?",
        answer: "He was hyperactive, restless, incapable of sitting still in one place, and constantly running about the neighborhood."
      },
      {
        subQuestion: "(b)",
        question: "What is the meaning of the expression '... I was perpetually on the move'?",
        answer: "It means that the writer was continuously active, constantly walking or running about on errands, and never remaining at home."
      },
      {
        subQuestion: "(c)",
        question: "From the passage, what is the character of Auntie Serwaa?",
        answer: "She was severe, harsh, cruel, impatient, and quick to administer harsh physical punishment without investigation."
      },
      {
        subQuestion: "(d)",
        question: "Why did Auntie Serwaa keep punishing the writer?",
        answer: "She punished him because she could not comprehend his prolonged absences from the compound, mistakenly assuming he was stubborn, unruly, and loafing in bad company."
      },
      {
        subQuestion: "(e)",
        question: "How did Opanyin Kwaw rescue the writer?",
        answer: "Opanyin Kwaw intervened by asking Auntie Serwaa to release the boy, clarified that the child was only absent because he was running helpful errands for elderly neighbors, and counseled the boy to balance his errands with his domestic responsibilities."
      },
      {
        subQuestion: "(f)",
        question: "For each of the following words, give one word or phrase which means the same:",
        subItems: [
          { word: "I. endured", answer: "suffered, bore, tolerated, underwent, experienced" },
          { word: "II. countless", answer: "innumerable, numerous, many, unnumbered, endless" }
        ]
      }
    ]
  }
};

const flattenedPaper2Questions = [
  ...paper2Calibrated.partA_composition.questions.map((q) => ({
    id: `composition_${q.questionNumber}`,
    partLabel: `Part A (Question ${q.questionNumber}) - ${q.category}`,
    prompt: q.prompt,
    modelAnswer: q.modelAnswer,
    marks: 30
  })),
  {
    id: "comprehension_passage",
    partLabel: "Part B: Reading Comprehension",
    prompt: paper2Calibrated.partB_comprehension.passageText,
    passage: paper2Calibrated.partB_comprehension.passageText,
    subQuestions: paper2Calibrated.partB_comprehension.questions,
    marks: 30
  }
];

async function seedBeceEnglish2010Calibrated() {
  console.log("Seeding Fully Rewritten, Clean-Room BECE English 2010 into Firestore...");

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

  const db = await getDb();
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
      hasLiteratureComponent: true,
      passageFirstLayout: false, // 2010 comprehension is in Paper 2
      updatedAt: new Date()
    },
    questions: balancedPaper1,
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 45,
      totalQuestions: balancedPaper1.length,
      sections: {
        sectionA_lexis_and_structure: {
          title: "Section A: Lexis and Structure",
          questionRange: "Questions 1 to 15",
          questions: balancedPaper1.slice(0, 15)
        },
        sectionB_synonyms: {
          title: "Section B: Synonyms (Nearest in Meaning)",
          questionRange: "Questions 16 to 20",
          questions: balancedPaper1.slice(15, 20)
        },
        sectionC_idioms: {
          title: "Section C: Idiomatic Expressions",
          questionRange: "Questions 21 to 25",
          questions: balancedPaper1.slice(20, 25)
        },
        sectionD_antonyms: {
          title: "Section D: Antonyms (Opposite in Meaning)",
          questionRange: "Questions 26 to 32",
          questions: balancedPaper1.slice(25, 32)
        },
        partII_literature: {
          title: "Part II: Literature in English",
          questionRange: "Questions 33 to 40",
          questions: balancedPaper1.slice(32, 40)
        }
      },
      questions: balancedPaper1,
      allQuestions: balancedPaper1
    },
    paper2: {
      title: "Paper 2: Written Essay and Reading Comprehension",
      durationMinutes: 75,
      sections: paper2Calibrated,
      questions: flattenedPaper2Questions
    }
  }, { merge: true });

  console.log("✅ Fully Rewritten, Clean-Room BECE English 2010 successfully seeded into Firestore!");
}

seedBeceEnglish2010Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2010:", err);
    process.exit(1);
  });
