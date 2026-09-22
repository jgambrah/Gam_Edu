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

// 40 Concept-Mapped, Original Pedagogical Adaptations for BECE English 2013
const rawQuestions = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 17) ---
  {
    number: 1,
    prompt: "The leopard ............ under the dense thicket waiting patiently for its prey.",
    options: ["lie", "lain", "lay", "laid"],
    correctAnswer: "lay",
    hint: "'Lie' (to rest or recline) has the simple past form 'lay'. 'Laid' is the past tense of 'lay' (to place something down).",
    workedSolution: "The intransitive verb 'lie' (to recline or stay in a resting position) has the principal parts lie - lay - lain. In the simple past tense, the correct form is 'lay'. 'Laid' is the past tense of the transitive verb 'lay' (e.g., 'he laid the book on the desk').",
    points: 1
  },
  {
    number: 2,
    prompt: "I wish my elder brother ............. visit us during the upcoming holidays.",
    options: ["will", "is to", "would", "may"],
    correctAnswer: "would",
    hint: "Wishes expressing a future desire or request for someone else to act take the modal 'would'.",
    workedSolution: "When using 'wish' to express a desire for another person's future action or willingness, English grammar requires 'would + base verb' ('would visit').",
    points: 1
  },
  {
    number: 3,
    prompt: "It is high time the farmers ............ their harvested cocoa beans to the shed.",
    options: ["move", "are moving", "moved", "were moving"],
    correctAnswer: "moved",
    hint: "'It is high time + subject' takes a simple past subjunctive verb.",
    workedSolution: "The fixed idiom 'It is high time + subject' requires a simple past subjunctive verb ('moved') to denote an overdue action.",
    points: 1
  },
  {
    number: 4,
    prompt: "This small bag of gari is all ............ I have left for the journey.",
    options: ["what", "that", "which", "this"],
    correctAnswer: "that",
    hint: "The indefinite pronoun 'all' is followed by the relative pronoun 'that', never 'what'.",
    workedSolution: "In standard English relative clauses, the pronoun 'all' is modified by 'that' ('all that I have left'), not 'what' or 'which'.",
    points: 1
  },
  {
    number: 5,
    prompt: "The more attentively you listen in class, ............ your understanding of the concepts.",
    options: ["the great", "greater", "greatest", "the greater"],
    correctAnswer: "the greater",
    hint: "Parallel comparative correlative structure: 'The + comparative..., the + comparative...'.",
    workedSolution: "In proportional correlative clauses, English requires 'the + comparative clause..., the + comparative clause...' ('The more attentively..., the greater...').",
    points: 1
  },
  {
    number: 6,
    prompt: "Please, I would rather you ............ not interrupt the guest speaker.",
    options: ["did", "will", "may", "do"],
    correctAnswer: "did",
    hint: "'Would rather + different subject' takes a simple past subjunctive auxiliary verb.",
    workedSolution: "When 'would rather' is followed by a different subject clause ('you'), it takes the past subjunctive form ('did not interrupt') to express polite preference.",
    points: 1
  },
  {
    number: 7,
    prompt: "Kwame's leather sandals are completely worn ............. after months of trekking.",
    options: ["in", "out", "into", "on"],
    correctAnswer: "out",
    hint: "Identify the phrasal verb meaning damaged or eroded through long, continuous usage.",
    workedSolution: "The phrasal verb 'worn out' means damaged, frayed, or rendered unusable through prolonged wear and friction.",
    points: 1
  },
  {
    number: 8,
    prompt: "The candidate is looking forward to ............ the final BECE results next month.",
    options: ["receive", "be receiving", "receiving", "have received"],
    correctAnswer: "receiving",
    hint: "The phrasal preposition 'look forward to' must be followed by a gerund (verb-ing).",
    workedSolution: "In 'look forward to', 'to' functions as a preposition, requiring a gerund complement ('receiving').",
    points: 1
  },
  {
    number: 9,
    prompt: "The regional commander is my ............ brother by three years.",
    options: ["senior", "older", "elder", "junior"],
    correctAnswer: "elder",
    hint: "Use this attributive comparative adjective when referring to seniority among family members.",
    workedSolution: "'Elder' is the specific attributive adjective used to denote seniority of birth among family members ('elder brother'). 'Senior' is used for official rank or followed by 'to'.",
    points: 1
  },
  {
    number: 10,
    prompt: "We have ............ drinking water left in the barrel, so we cannot prepare meals today.",
    options: ["a few", "little", "few", "a little"],
    correctAnswer: "little",
    hint: "'Water' is an uncountable noun. To indicate an insufficient quantity with a negative sense, omit the article.",
    workedSolution: "'Water' is a non-count noun. 'Little' (without an article) has a negative meaning indicating scarcely any, explaining why meals cannot be prepared. 'A little' has a positive meaning (some).",
    points: 1
  },
  {
    number: 11,
    prompt: "This secret must be kept confidential; I wouldn't disclose it to ............ in the school.",
    options: ["no other", "any other", "nobody", "anyone else"],
    correctAnswer: "anyone else",
    hint: "A negative clause containing 'wouldn't' takes an open non-assertive pronoun to avoid a double negative.",
    workedSolution: "Because the clause already contains the negative contraction 'wouldn't', the pronoun 'anyone else' is required to avoid an ungrammatical double negative like 'wouldn't ... nobody'.",
    points: 1
  },
  {
    number: 12,
    prompt: "This traditional water goblet is made ............ clay.",
    options: ["on", "of", "with", "by"],
    correctAnswer: "of",
    hint: "When a material preserves its physical identity in the finished product, use 'made of'.",
    workedSolution: "'Made of' is used when the source material has not undergone a complete chemical alteration and is still physically recognizable in the finished object ('made of clay').",
    points: 1
  },
  {
    number: 13,
    prompt: "The doting mother was completely blind ............ the misconduct of her spoiled son.",
    options: ["on", "over", "to", "by"],
    correctAnswer: "to",
    hint: "Which preposition follows 'blind' when it means unwilling to notice or acknowledge faults?",
    workedSolution: "The figurative idiom 'blind to' means unwilling or unable to perceive, recognize, or acknowledge reality ('blind to the faults of her children').",
    points: 1
  },
  {
    number: 14,
    prompt: "Mansah was absent from the science practical test yesterday, ............?",
    options: ["isn't she", "has she", "didn't she", "wasn't she"],
    correctAnswer: "wasn't she",
    hint: "An affirmative clause with the past linking verb 'was' takes a negative tag using 'was'.",
    workedSolution: "The main statement is affirmative and uses the past copular verb 'was'. The corresponding question tag must be negative: 'wasn't she?'.",
    points: 1
  },
  {
    number: 15,
    prompt: "Come and assist me with the harvest tomorrow morning, ............?",
    options: ["shall you", "will you", "may you", "don't you"],
    correctAnswer: "will you",
    hint: "Imperative sentences expressing polite directives or invitations take a willingness tag.",
    workedSolution: "Imperative requests and invitations take 'will you?' (or 'won't you?') as their standard question tag.",
    points: 1
  },
  {
    number: 16,
    prompt: "If Kofi had revised his notes diligently, he ............ his promotional examination.",
    options: ["would pass", "would be passing", "will be passing", "would have passed"],
    correctAnswer: "would have passed",
    hint: "Conditional Type 3: 'If + past perfect' requires 'would have + past participle' in the main clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past hypothesis ('If Kofi had revised'), the main clause requires 'would have + past participle' ('would have passed').",
    points: 1
  },
  {
    number: 17,
    prompt: "The hunter was accompanied by his ............ hunting dog.",
    options: ["little pretty brown", "pretty brown little", "pretty little brown", "brown little pretty"],
    correctAnswer: "pretty little brown",
    hint: "Order of adjectives: Opinion ('pretty') comes before Size ('little'), which precedes Color ('brown').",
    workedSolution: "According to the Royal Order of Adjectives: Opinion ('pretty') precedes Size ('little'), which precedes Color ('brown'). Thus, 'pretty little brown dog' is correct.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (18 - 22) ---
  {
    number: 18,
    prompt: "Television broadcast is a potent medium for promoting national literacy.\nChoose the word nearest in meaning to the underlined word 'potent'.",
    options: ["necessary", "powerful", "widespread", "sound"],
    correctAnswer: "powerful",
    hint: "Having great power, efficacy, or influence.",
    workedSolution: "'Potent' means having great strength, influence, or dynamic force; 'powerful' is its direct synonym.",
    points: 1
  },
  {
    number: 19,
    prompt: "Aba won the overall academic prize because she is exceptionally industrious.\nChoose the word nearest in meaning to the underlined word 'industrious'.",
    options: ["polite", "hardworking", "intelligent", "funny"],
    correctAnswer: "hardworking",
    hint: "Diligent, hardworking, and constantly applying effort.",
    workedSolution: "'Industrious' means diligent, hard-working, and devoted to labor; 'hardworking' is its exact equivalent.",
    points: 1
  },
  {
    number: 20,
    prompt: "Commercial snail farming can be a lucrative venture for young school leavers.\nChoose the word nearest in meaning to the underlined word 'lucrative'.",
    options: ["easy", "profitable", "necessary", "good"],
    correctAnswer: "profitable",
    hint: "Yielding monetary profit, wealth, or financial reward.",
    workedSolution: "'Lucrative' describes an enterprise that produces substantial financial gain or profit; 'profitable' is its direct synonym.",
    points: 1
  },
  {
    number: 21,
    prompt: "The utter recklessness of the speeding driver caused the fatal collision.\nChoose the word nearest in meaning to the underlined word 'recklessness'.",
    options: ["drunkenness", "arrogance", "carelessness", "ignorance"],
    correctAnswer: "carelessness",
    hint: "Acting without thought, caution, or regard for the safety of others.",
    workedSolution: "'Recklessness' means lack of regard for danger or consequences; 'carelessness' is its closest synonym.",
    points: 1
  },
  {
    number: 22,
    prompt: "The hospital management discussed the chronic scarcity of clinical staff in the rural clinic.\nChoose the word nearest in meaning to the underlined word 'scarcity'.",
    options: ["indiscipline", "love", "shortage", "efficiency"],
    correctAnswer: "shortage",
    hint: "A state of being in short supply or deficient in quantity.",
    workedSolution: "'Scarcity' refers to a state of insufficiency or lack of adequate resources; 'shortage' is its direct equivalent.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (23 - 27) ---
  {
    number: 23,
    prompt: "Adzo takes after her mother in her culinary talents and patience. This means that Adzo ............",
    options: ["likes her", "resembles her", "is unlike her", "always follows her"],
    correctAnswer: "resembles her",
    hint: "Showing similar characteristics, appearance, or behavior to an older family relative.",
    workedSolution: "The phrasal idiom 'to take after' means to resemble an older relative in appearance, character, or disposition.",
    points: 1
  },
  {
    number: 24,
    prompt: "The assembly members were paid a uniform sitting allowance across the board. This means that ............",
    options: [
      "every member receives the exact same allowance",
      "some members receive allowances",
      "allowances are paid on a wooden board",
      "only executive members are given allowances"
    ],
    correctAnswer: "every member receives the exact same allowance",
    hint: "Applying universally to all members without exception.",
    workedSolution: "The idiom 'across the board' means applying equally to everyone or to all members in a given category.",
    points: 1
  },
  {
    number: 25,
    prompt: "The senior master warned the prefects not to poke their noses into private family disputes. This means they should not ............",
    options: ["interfere", "enter", "speak", "believe"],
    correctAnswer: "interfere",
    hint: "Meddling in affairs that do not concern one.",
    workedSolution: "'To poke one's nose into' (or stick one's nose into) means to meddle or interfere uninvited in other people's private business.",
    points: 1
  },
  {
    number: 26,
    prompt: "During the lecture on constitutional law, Kojo was miles away. This means that Kojo ............",
    options: ["was self-conscious", "had traveled abroad", "had fallen asleep", "was absent-minded"],
    correctAnswer: "was absent-minded",
    hint: "Lost in private thoughts and not paying attention to immediate surroundings.",
    workedSolution: "To be 'miles away' is an idiom meaning deeply daydreaming, distracted, or completely absent-minded.",
    points: 1
  },
  {
    number: 27,
    prompt: "When the unexpected breakdown occurred in the deep forest, the driver was at his wits' end. This means that the driver ............",
    options: [
      "was collecting his ideas together",
      "had finished his speech",
      "did not know what to do next",
      "did not have much to do"
    ],
    correctAnswer: "did not know what to do next",
    hint: "Completely baffled, desperate, and overwhelmed by a crisis with no remaining ideas.",
    workedSolution: "'At one's wits' end' means so perplexed, distressed, or desperate that one has no idea what further action to take.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (28 - 32) ---
  {
    number: 28,
    prompt: "We were astonished by the villagers' hostility toward the travelers, as we had expected warmth and ...... .",
    options: ["faithfulness", "attitude", "manner", "friendliness"],
    correctAnswer: "friendliness",
    hint: "'Hostility' means cold antagonism and ill will. Find the word that denotes warmth and goodwill.",
    workedSolution: "'Hostility' means open antagonism or unfriendliness. Its direct antonym is 'friendliness'.",
    points: 1
  },
  {
    number: 29,
    prompt: "While the junior pupil answered the queries timidly, the senior prefect responded ...... .",
    options: ["boldly", "calmly", "angrily", "smilingly"],
    correctAnswer: "boldly",
    hint: "'Timidly' means with fear and hesitation. Find the word denoting courage and confidence.",
    workedSolution: "'Timidly' means with hesitation, fear, or shyness. Its direct opposite is 'boldly' (courageously and confidently).",
    points: 1
  },
  {
    number: 30,
    prompt: "While the assemblywoman was sincere in her promises, her rival was remarkably ...... .",
    options: ["unrealistic", "uncertain", "dissatisfied", "dishonest"],
    correctAnswer: "dishonest",
    hint: "'Sincere' means genuine and truthful. Find the word meaning deceitful or untrue.",
    workedSolution: "'Sincere' means honest and truthful. Its direct antonym in character description is 'dishonest'.",
    points: 1
  },
  {
    number: 31,
    prompt: "The national flag was hoisted at dawn and ...... at sunset.",
    options: ["sunk", "dipped", "lowered", "dropped"],
    correctAnswer: "lowered",
    hint: "'Hoisted' means raised or hauled up. Find the word meaning brought down.",
    workedSolution: "'Hoisted' means raised up on a staff or pole. Its direct technical opposite in flag protocol is 'lowered'.",
    points: 1
  },
  {
    number: 32,
    prompt: "Transparent ballot containers replaced the old ...... wooden boxes.",
    options: ["dark", "opaque", "coated", "painted"],
    correctAnswer: "opaque",
    hint: "'Transparent' means allowing light through so objects can be seen. Find the word meaning not see-through.",
    workedSolution: "'Transparent' describes a material through which objects can be clearly seen. Its direct scientific and linguistic antonym is 'opaque'.",
    points: 1
  },

  // --- PART II: LITERATURE IN ENGLISH (33 - 40) ---
  {
    number: 33,
    prompt: "The sequential arrangement and structural progression of interrelated events in a novel or play is designated as the ............",
    options: ["theme", "plot", "conflict", "resolution"],
    correctAnswer: "plot",
    hint: "The storyline or order of dramatic actions from beginning to end.",
    workedSolution: "In literary analysis, the 'plot' is the systematic sequence of connected events that make up the storyline of a drama or novel.",
    points: 1
  },
  {
    number: 34,
    prompt: "A dramatic speech delivered by a character who is alone on stage, revealing his or her innermost private thoughts, is a ............",
    options: ["monologue", "dialogue", "apostrophe", "soliloquy"],
    correctAnswer: "soliloquy",
    hint: "Speaking aloud to oneself while alone on stage.",
    workedSolution: "A 'soliloquy' is a dramatic device where a character speaks their innermost thoughts aloud while alone on stage. A 'monologue' is an extended speech delivered to other listeners.",
    points: 1
  },
  {
    number: 35,
    prompt: "Read the poetic extract below:\n\"O incomprehensible God!\nShall my pilot be\nMy inborn stars to that\nFinal call to thee?\"\nDirectly addressing an absent entity, deity, or personified concept as if present is a/an ............",
    options: ["sermon", "apostrophe", "dirge", "sonnet"],
    correctAnswer: "apostrophe",
    hint: "A rhetorical figure of speech directly addressing a detached or divine presence ('O incomprehensible God!').",
    workedSolution: "'Apostrophe' is a poetic figure of speech in which the speaker directly addresses an absent person, deity, or personified abstraction as if present.",
    points: 1
  },
  {
    number: 36,
    prompt: "In the lines \"O incomprehensible God! / Shall my pilot be / My inborn stars to that / Final call to thee?\", the central theme explored is ............",
    options: ["life", "neglect", "war", "death"],
    correctAnswer: "death",
    hint: "The poetic expression 'that Final call to thee' refers to the end of human earthly life.",
    workedSolution: "The poem reflects on mortality, cosmic guidance, and the transition of the human soul to eternity, centering on the theme of 'death'.",
    points: 1
  },
  {
    number: 37,
    prompt: "Which of the following phrases from the extract most directly conveys the theme of mortality?",
    options: ["'incomprehensible God'", "'inborn stars'", "'Final call'", "'my pilot'"],
    correctAnswer: "'Final call'",
    hint: "A traditional euphemism for the summoning of the soul at death.",
    workedSolution: "The phrase 'Final call' is a metaphorical expression denoting physical death and the soul's ultimate summons to the Creator.",
    points: 1
  },
  {
    number: 38,
    prompt: "The principal, central character around whom the entire plot of a literary narrative revolves is termed the ............",
    options: ["hero", "villain", "dramatist", "antagonist"],
    correctAnswer: "hero",
    hint: "The primary protagonist or main figure.",
    workedSolution: "The central leading character of a literary work is the 'hero' (or protagonist). The opponent is the 'antagonist', while a bad character is the 'villain'.",
    points: 1
  },
  {
    number: 39,
    prompt: "A spoken verbal exchange between two or more characters in a play or story is known as a ............",
    options: ["dialogue", "monologue", "aside", "soliloquy"],
    correctAnswer: "dialogue",
    hint: "A two-way conversational exchange.",
    workedSolution: "'Dialogue' refers to a conversational verbal exchange between two or more characters in dramatic literature.",
    points: 1
  },
  {
    number: 40,
    prompt: "In theatrical stagecraft, the artistic practice of miming refers specifically to ............",
    options: [
      "the use of song in drama",
      "acting exclusively through gestures and bodily movement without words",
      "imitating another character's vocal accent",
      "the use of rapid dialogue in acting"
    ],
    correctAnswer: "acting exclusively through gestures and bodily movement without words",
    hint: "Pantomime: conveying action, emotion, and story strictly through silent physical movement.",
    workedSolution: "'Miming' (or pantomime) is the theatrical technique of portraying characters, actions, or narratives entirely through bodily gestures, facial expressions, and physical movement without spoken words.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 201301);

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
        prompt: "Write a letter to your friend who attends school in a rural district, explaining three practical ways in which computer technology has made learning easier and more engaging for students.",
        modelAnswer: `Anglican Junior High School\nP. O. Box 72\nKonongo, Ashanti Region\n12th June, 2013\n\nDear Emmanuel,\n\nI was delighted to receive your letter last week. I am happy to learn that your school has recently connected electricity to its main block. In your letter, you asked how computers have transformed our classroom studies. I am excited to share three major ways this technology has made learning easier and far more interesting.\n\nFirst, computers provide instant access to vast educational resources through the internet. In the past, whenever our school library lacked specific reference materials, we struggled through homework. Today, using search engines and digital encyclopedias like Encarta, we can look up scientific explanations, historical maps, and past examination papers in a matter of seconds. This makes independent research effortless and enjoyable.\n\nSecondly, computer simulations and visual software simplify complex scientific concepts. In our Integrated Science lessons, rather than merely imagining how the human circulatory system or the solar system functions from flat chalkboard drawings, our teacher plays animated video simulations. Seeing organs pump blood and planets orbit the sun in real time helps us understand and remember concepts easily.\n\nFinally, word processors and typing software help us produce clean, error-free work. Features like automatic spell-checkers and grammar assistants highlight spelling mistakes and guide us to write grammatically correct compositions. Preparing projects on the computer saves time and teaches us essential typing skills for our future careers.\n\nI hope your school acquires computers soon so that you can enjoy these benefits. Extend my warm regards to your parents.\n\nYour true friend,\n[Signature]\nKwaku Mensah`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in a national newspaper discussing at least two compelling reasons why basic school students should cultivate a consistent habit of reading.",
        modelAnswer: `THE TRANSFORMATIVE POWER OF READING: WHY EVERY STUDENT MUST CULTIVATE THE READING HABIT\nBy Beatrice Arthur, JHS 3\n\nIn contemporary Ghanaian society, the pervasive influence of television entertainment and social media distractions has steadily eroded the reading culture among basic school learners. Many pupils read only when forced by imminent examinations. However, cultivating a dedicated, lifelong habit of reading is the most reliable path to academic distinction and intellectual maturity.\n\nFirst and foremost, consistent reading sharpens language proficiency and expands vocabulary. Language is the medium through which all other academic subjects—including Science, Social Studies, and Mathematics—are taught and examined. When students read classical literature, newspapers, and storybooks, they naturally absorb sophisticated vocabulary, correct sentence structures, and idiomatic expressions. This broad linguistic exposure directly improves their spelling, boosts reading comprehension, and empowers them to write compelling essays in national examinations.\n\nSecondly, reading broadens mental horizons and fosters critical thinking. Books take learners on mental journeys across diverse cultures, historical eras, and scientific frontiers without leaving their classrooms. Regular readers develop empathy, analytical reasoning, and creative problem-solving skills because they regularly evaluate characters' choices and narrative conflicts. Conversely, a student who does not read remains intellectually narrow and easily swayed by misinformation.\n\nIn conclusion, reading is to the mind what physical exercise is to the body. Parents, teachers, and school authorities must establish functional classroom reading corners and encourage children to read at least one storybook every fortnight. A reading nation is a winning nation.`
      },
      {
        questionNumber: "3",
        category: "Descriptive / Analytical Essay",
        prompt: "Describe one memorable national event that took place in your country recently, and discuss at least two notable effects it had on the people living in your locality.",
        modelAnswer: `THE CELEBRATION OF GHANA'S INDEPENDENCE DAY AND ITS IMPACT ON OUR COMMUNITY\n\nOn the 6th of March this year, our nation marked its Independence Anniversary with magnificent parades across all regional and municipal capitals. In our municipality of Bekwai, the historic event was commemorated at the newly renovated municipal stadium, bringing together traditional rulers, security contingents, civic groups, and hundreds of school contingents in a vibrant display of patriotism.\n\nThe celebration commenced at eight o'clock in the morning with the arrival of the Municipal Chief Executive and the Paramount Chief of the traditional area. The central spectacle was the competitive march-past by twenty selected primary and junior high schools. Dressed in crisp school uniforms, school bands beat rhythmic drums while contingent commanders saluted the dais with military precision. Cultural troupes performed energetic traditional dances that drew deafening applause from the packed terraces.\n\nThis historic celebration exerted two significant effects on our locality. First, it stimulated local commerce and boosted the livelihoods of small-scale entrepreneurs. Street food vendors, mineral water sellers, photographers, and local transport operators recorded record sales, as thousands of visitors thronged the town to witness the festivities.\n\nSecondly, the event rekindled communal pride, patriotism, and social cohesion among the youth. Listening to the commemorative addresses detailing the sacrifices of our founding fathers inspired students to rededicate themselves to academic excellence and civic responsibility. Furthermore, seeing different ethnic groups celebrate harmoniously under the national flag strengthened peaceful coexistence in our community. It was truly an inspiring milestone that will linger in our memories for years to come.`
      }
    ]
  },
  sectionB_comprehension: {
    title: "Part B: Reading Comprehension",
    passage: `Nobody wanted Ananse to succeed in drinking the cup of hot water and win Adiefe, the Chief's beautiful daughter.\n\nAnanse grabbed the cup of hot water, bowed as gracefully as possible, and smiled confidently. He lifted the cup and said, slowly and calmly, "Nana, look...................!" Nana Apo barked, "Yes, it's hot. Drink it right now!" But Ananse kept a cool head. Then, in the full glare of all present, he shook the cup vigorously for some time in order to cool its contents. After this, he began to sip the now-lukewarm water as if it was still hot. Between the sips, the pain he seemed to be going through made him frown. He shut his left eye and his right eye shone brightly. He deliberately let his left hand drop loosely by his side.\n\nNana Apo smiled. Queen Amola grinned. Adiefe giggled—all in happy anticipation of Ananse's failure.\n\nSuddenly Ananse began to drink the warm water more quickly and noisily. Soon, all was gone. He turned the cup upside down towards Nana and, indeed, there was not a single drop in it. Lo and behold, Kweku Ananse, the notorious trickster, had succeeded where all others had failed. There was complete silence. Even the wind seemed to have stopped blowing. The impossible had happened and people's expectation that Kweku Ananse would lose the contest had failed. Eventually, Kweku Ananse's victory had won him the hand of the pretty Princess, Adiefe.\n\nNana Apo and Queen Amola, with great reluctance, led their daughter, Adiefe, and handed her over to victorious Kweku Ananse.`,
    questions: [
      {
        subId: "(a)",
        question: "What was the general attitude of the spectators and royalty present before the contest commenced?",
        answer: "They were hostile, prejudiced, and eager to see Ananse fail (they did not want him to succeed)."
      },
      {
        subId: "(b)",
        question: "Why do you think Ananse shook the cup vigorously in the full glare of the crowd?",
        answer: "To cool down the boiling hot water into lukewarm water so he could drink it safely without scalding his mouth."
      },
      {
        subId: "(c)",
        question: "State the three theatrical tricks Ananse used to pretend that he was enduring agonizing pain while drinking.",
        answer: "1. He frowned between sips.\n2. He shut his left eye while keeping his right eye shining brightly.\n3. He deliberately let his left hand drop loosely by his side."
      },
      {
        subId: "(d)(i)",
        question: "Why did Ananse turn the cup upside down toward Nana Apo?",
        answer: "To prove conclusively to the Chief and the assembled crowd that he had drunk every single drop and that the cup was completely empty."
      },
      {
        subId: "(d)(ii)",
        question: "What was the emotional mood of Nana Apo and Queen Amola at the conclusion of the contest?",
        answer: "They were disappointed, stunned, crestfallen, and filled with great reluctance."
      },
      {
        subId: "(e)",
        question: "Explain in your own words the following expressions as used in the passage:\n(i) 'Ananse kept a cool head';\n(ii) 'all was gone';\n(iii) 'The impossible had happened'.",
        answer: "(i) **'Ananse kept a cool head':** Ananse remained calm, composed, patient, and unruffled.\n(ii) **'all was gone':** Every drop of the water was completely finished (drunk).\n(iii) **'The impossible had happened':** An extraordinary feat that everyone believed could never occur had actually taken place."
      },
      {
        subId: "(f)",
        question: "For each of the following words, provide a word or phrase that means the same and can replace it in the passage without altering the meaning:\n(i) grabbed;\n(ii) barked;\n(iii) deliberately;\n(iv) eventually;\n(v) pretty.",
        answer: "(i) **grabbed:** took / seized / snatched / grasped.\n(ii) **barked:** shouted / snapped / bellowed / roared.\n(iii) **deliberately:** intentionally / purposely / consciously / on purpose.\n(iv) **eventually:** ultimately / finally / in the end / at last.\n(v) **pretty:** beautiful / attractive / lovely / gorgeous."
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

async function seedBeceEnglish2013Calibrated() {
  const db = await getDb();
  console.log("Seeding Calibrated & Balanced BECE English 2013 into Firestore...");

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

  const docRef = db.doc("global_curriculum/jhs/subjects/english/past_questions/bece_2013");
  await docRef.set({
    year: 2013,
    title: "BECE English Language 2013 (Calibrated National Benchmark)",
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

  console.log("✅ Calibrated BECE English 2013 successfully seeded into Firestore!");
}

seedBeceEnglish2013Calibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Calibrated BECE English 2013:", err);
    process.exit(1);
  });
