/**
 * JHS Curriculum Data - BECE English Language Mock 1
 * Standardized Isomorphic Examination Suite (Paper 1 CBT + Paper 2 Theory)
 *
 * Proprietary Content © GAM IT Solutions (GAM EDU). All rights reserved.
 */

export interface QuestionItem {
  number: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

export const allRawEnglishMock1Questions: QuestionItem[] = [
  // --- SECTION A: LEXIS AND STRUCTURE (1 - 15) ---
  {
    number: 1,
    prompt: "Had the referee spotted the intentional handball, he ............ a penalty kick without hesitation.",
    options: [
      "will award",
      "will have awarded",
      "would have awarded",
      "would award"
    ],
    correctAnswer: "would have awarded",
    hint: "Third Conditional: 'Had the referee spotted' in the if-clause requires 'would have + past participle' in the main clause.",
    workedSolution: "In a Third Conditional sentence expressing an unfulfilled past condition, the main clause requires a modal past perfect: 'would have awarded'.",
    points: 1
  },
  {
    number: 2,
    prompt: "The school board procured a ............ desk for the newly refurbished staff common room.",
    options: [
      "mahogany handsome rectangular",
      "handsome rectangular mahogany",
      "rectangular handsome mahogany",
      "handsome mahogany rectangular"
    ],
    correctAnswer: "handsome rectangular mahogany",
    hint: "Cumulative adjective ordering: Opinion/Evaluation ('handsome') precedes Shape ('rectangular') which precedes Material ('mahogany') before the noun.",
    workedSolution: "Standard English cumulative adjective ordering places subjective evaluation ('handsome') before shape ('rectangular') followed by material origin ('mahogany'): 'handsome rectangular mahogany desk'.",
    points: 1
  },
  {
    number: 3,
    prompt: "The librarian announced that neither of the two shortlisted candidates ............ returned the encyclopedia.",
    options: ["have", "are", "has", "were"],
    correctAnswer: "has",
    hint: "Indefinite pronoun concord: 'Neither of the two' functions as a singular subject taking a third-person singular verb.",
    workedSolution: "The grammatical subject head is 'Neither' (singular), requiring the third-person singular present perfect auxiliary 'has': 'neither of the two candidates has returned'.",
    points: 1
  },
  {
    number: 4,
    prompt: "The pediatrician observed that the infant is remarkably sensitive ............ sudden climatic changes.",
    options: ["to", "with", "about", "against"],
    correctAnswer: "to",
    hint: "Identify the dependent preposition that regularly collocates with the adjective 'sensitive'.",
    workedSolution: "In standard English collocations, the adjective 'sensitive' takes the preposition 'to': 'sensitive to sudden climatic changes'.",
    points: 1
  },
  {
    number: 5,
    prompt: "While standing on the footbridge, we observed the thief ............ into the mangrove thicket.",
    options: ["dived", "dive", "was diving", "is diving"],
    correctAnswer: "dive",
    hint: "Verbs of sensory perception (observe, see, watch) take a direct object followed by a bare infinitive for a completed action.",
    workedSolution: "Following verbs of sensory perception ('observed'), standard English uses a bare infinitive without 'to' ('dive') to indicate witnessing the complete action.",
    points: 1
  },
  {
    number: 6,
    prompt: "The rainy season has peaked; it is high time the municipal authorities ............ the choked storm drains.",
    options: ["desilted", "desilt", "should desilt", "are desilting"],
    correctAnswer: "desilted",
    hint: "Subjunctive past simple: 'It is high time + subject' requires a simple past verb form.",
    workedSolution: "Following the subjunctive formula 'It is high time' followed by a subject, standard grammar requires the simple past tense: 'desilted'.",
    points: 1
  },
  {
    number: 7,
    prompt: "The harmattan wind was bitterly cold, ............ the fishermen sailed into the deep sea.",
    options: ["so", "and", "yet", "for"],
    correctAnswer: "yet",
    hint: "Adversative coordinating conjunction expressing concession or surprise between two contrasting clauses.",
    workedSolution: "The coordinating conjunction expressing concession and contrast between the freezing storm and the fishermen's daring departure is 'yet' (meaning nevertheless).",
    points: 1
  },
  {
    number: 8,
    prompt: "You have never traveled across the Volta estuary on a passenger ferry, ............ you?",
    options: ["haven't", "had", "hadn't", "have"],
    correctAnswer: "have",
    hint: "The negative adverb 'never' gives the main clause negative polarity; the matching question tag must be affirmative.",
    workedSolution: "The statement is negative due to 'never' with present perfect auxiliary 'have'. The question tag must be affirmative: 'have you?'.",
    points: 1
  },
  {
    number: 9,
    prompt: "The university council established ............ committee to audit the infrastructure grant.",
    options: [
      "an eight-man",
      "an eight-men",
      "eight-mans'",
      "eight-men's"
    ],
    correctAnswer: "an eight-man",
    hint: "Compound adjective modifying a singular noun retains the singular form and is preceded by an indefinite article.",
    workedSolution: "When a numeral and noun combine into a compound modifier preceding a singular noun ('committee'), the modifier remains singular: 'an eight-man committee'.",
    points: 1
  },
  {
    number: 10,
    prompt: "Between the two applicants interviewed yesterday, which one is ............ qualified?",
    options: ["the most", "most", "more", "much"],
    correctAnswer: "more",
    hint: "When comparing exactly two entities, standard English requires the comparative degree rather than the superlative.",
    workedSolution: "The comparative degree ('more qualified') is strictly required when contrasting exactly two entities. 'Most' is reserved for three or more.",
    points: 1
  },
  {
    number: 11,
    prompt: "Last Friday, the astronomy club gathered on the hill to observe ............",
    options: [
      "an eclipse of a moon",
      "an eclipse of the moon",
      "the eclipse of a moon",
      "eclipse of moon"
    ],
    correctAnswer: "an eclipse of the moon",
    hint: "A single occurrence of an occultation takes indefinite 'an eclipse', while the unique lunar body takes definite 'the moon'.",
    workedSolution: "In standard English astronomical usage, an individual event takes 'an eclipse', while our unique celestial satellite requires the definite article: 'an eclipse of the moon'.",
    points: 1
  },
  {
    number: 12,
    prompt: "Among all the junior contestants in the inter-schools debate, Mansa spoke ............",
    options: ["much", "most", "very", "more"],
    correctAnswer: "most",
    hint: "Superlative adverbial modification comparing one contestant against an entire group: 'most persuasively'.",
    workedSolution: "When comparing an adverb across an entire group of three or more contestants, 'most' functions as the superlative degree modifier: 'spoke most persuasively'.",
    points: 1
  },
  {
    number: 13,
    prompt: "The senior physician, ............ private clinic is situated near the post office, treated the accident victims.",
    options: ["who", "whom", "which", "whose"],
    correctAnswer: "whose",
    hint: "Possessive relative pronoun modifying the noun 'clinic' to show ownership by the physician.",
    workedSolution: "The possessive relative pronoun indicating ownership of the clinic by the human antecedent ('senior physician') is 'whose': 'whose clinic is situated...'.",
    points: 1
  },
  {
    number: 14,
    prompt: "\"I will submit my assignment before noon,\" promised Kweku.\nThe correct reported speech for this sentence is: Kweku promised that ............",
    options: [
      "he will submit his assignment before noon",
      "he would submit his assignment before noon",
      "I would submit my assignment before noon",
      "he submits his assignment before noon"
    ],
    correctAnswer: "he would submit his assignment before noon",
    hint: "Reported speech shifts: First-person 'I' shifts to third-person 'he', and future modal 'will' backshifts to past modal 'would'.",
    workedSolution: "In indirect reported speech with a past reporting verb ('promised'), pronoun 'I' changes to 'he', possessive 'my' changes to 'his', and modal 'will' backshifts to 'would': 'he would submit his assignment before noon'.",
    points: 1
  },
  {
    number: 15,
    prompt: "Active: \"The school board awarded Sarah a full scholarship.\"\nPassive: \"Sarah ............ a full scholarship by the school board.\"",
    options: [
      "is awarded",
      "has been awarded",
      "was awarded",
      "had awarded"
    ],
    correctAnswer: "was awarded",
    hint: "Simple past passive: was/were + past participle (awarded -> was awarded).",
    workedSolution: "The active verb 'awarded' is in the simple past tense. In converting the indirect recipient ('Sarah', singular) to the passive subject, the form is 'was awarded': 'Sarah was awarded a full scholarship'.",
    points: 1
  },

  // --- SECTION B: NEAREST IN MEANING (SYNONYMS) (16 - 20) ---
  {
    number: 16,
    prompt: "The headmistress was appalled by the students' insolent behavior during the assembly.\nChoose the word nearest in meaning to 'appalled'.",
    options: ["shocked", "saddened", "annoyed", "puzzled"],
    correctAnswer: "shocked",
    hint: "Greatly dismayed, horrified, or deeply shocked.",
    workedSolution: "'Appalled' means filled with dismay, horror, or being thoroughly 'shocked'; 'shocked' is its direct synonym.",
    points: 1
  },
  {
    number: 17,
    prompt: "The minister outlined the salient features of the newly passed education bill.\nChoose the word nearest in meaning to 'salient'.",
    options: ["interesting", "prominent", "complicated", "popular"],
    correctAnswer: "prominent",
    hint: "Most noticeable, primary, important, or conspicuous.",
    workedSolution: "'Salient' points are the most conspicuous, primary, and 'prominent' aspects of a matter; 'prominent' is its direct synonym.",
    points: 1
  },
  {
    number: 18,
    prompt: "To excel in competitive sport, an athlete must remain resolute during training.\nChoose the word nearest in meaning to 'resolute'.",
    options: ["stubborn", "calm", "determined", "aggressive"],
    correctAnswer: "determined",
    hint: "Admirably purposeful, unwavering, and steadfast in resolve.",
    workedSolution: "'Resolute' means admirably purposeful, unwavering, and 'determined'; 'determined' is its exact equivalent.",
    points: 1
  },
  {
    number: 19,
    prompt: "The market women vehemently rejected the increase in daily municipal stall tolls.\nChoose the word nearest in meaning to 'vehemently'.",
    options: ["angrily", "tearfully", "secretly", "forcefully"],
    correctAnswer: "forcefully",
    hint: "In a passionate, intense, and powerfully assertive manner.",
    workedSolution: "'Vehemently' means showing strong feeling, passion, or intense force; 'forcefully' is its direct synonym.",
    points: 1
  },
  {
    number: 20,
    prompt: "The master carpenter manufactured a working replica of the antique royal stool.\nChoose the word nearest in meaning to 'replica'.",
    options: ["model", "painting", "photograph", "piece"],
    correctAnswer: "model",
    hint: "An exact copy, duplicate, or working model of something.",
    workedSolution: "'Replica' refers to an exact copy, duplicate, or working 'model'; 'model' is its closest synonym.",
    points: 1
  },

  // --- SECTION C: IDIOMS & FIGURATIVE EXPRESSIONS (21 - 25) ---
  {
    number: 21,
    prompt: "When the midnight fire alarm sounded, the dormitory prefects kept their heads. This means that the prefects ............",
    options: [
      "bowed down in prayer",
      "remained calm and composed",
      "covered their heads with clothing",
      "ran frantically for safety"
    ],
    correctAnswer: "remained calm and composed",
    hint: "To remain calm, sensible, and composed during a crisis.",
    workedSolution: "The idiom 'to keep one's head' means to remain calm, sensible, and emotionally controlled in an emergency.",
    points: 1
  },
  {
    number: 22,
    prompt: "The boastful sprinter had to eat humble pie after placing last in the 100-meter dash. This means the sprinter ............",
    options: [
      "refused to eat after the race",
      "was disqualified by the judges",
      "admitted his inferiority and apologized",
      "celebrated his opponent's victory"
    ],
    correctAnswer: "admitted his inferiority and apologized",
    hint: "To be forced to admit one's errors, swallow one's pride, and apologize.",
    workedSolution: "The idiom 'to eat humble pie' means to be forced to admit that one was defeated or wrong and humbly apologize.",
    points: 1
  },
  {
    number: 23,
    prompt: "Akosua was in the dark concerning the surprise send-off reception planned by her colleagues. This means that Akosua ............",
    options: [
      "was locked in an unlit room",
      "was completely uninformed and unaware of the plan",
      "felt frightened by the arrangements",
      "refused to attend the reception"
    ],
    correctAnswer: "was completely uninformed and unaware of the plan",
    hint: "To be uninformed about something; ignorant of facts.",
    workedSolution: "The idiom 'in the dark' means entirely uninformed, unaware, and ignorant of current facts or arrangements.",
    points: 1
  },
  {
    number: 24,
    prompt: "The managing director warned the accountant not to play with fire. This means the accountant was warned not to ............",
    options: [
      "tamper with electrical cables",
      "take dangerous and foolish risks",
      "argue with subordinate staff",
      "destroy audit vouchers"
    ],
    correctAnswer: "take dangerous and foolish risks",
    hint: "To do something that is full of danger or likely to cause severe trouble.",
    workedSolution: "The idiom 'to play with fire' means to take reckless, dangerous, or foolish risks that could result in severe disaster.",
    points: 1
  },
  {
    number: 25,
    prompt: "Kwame's benevolent uncle decided to foot the bill for his university education. This means that his uncle ............",
    options: [
      "promised to purchase only his footwear",
      "tore up the fee prospectus",
      "settled all the required educational expenses",
      "verified the arithmetic of the fees"
    ],
    correctAnswer: "settled all the required educational expenses",
    hint: "To pay the bill or assume financial responsibility for expenses.",
    workedSolution: "The idiom 'to foot the bill' means to pay the full cost or expenses incurred for something.",
    points: 1
  },

  // --- SECTION D: OPPOSITE IN MEANING (ANTONYMS) (26 - 30) ---
  {
    number: 26,
    prompt: "While the junior pupil was timid before the interview panel, the senior prefect was remarkably ...... .\nChoose the word most nearly opposite in meaning to 'timid'.",
    options: ["bold", "respectful", "arrogant", "careless"],
    correctAnswer: "bold",
    hint: "'Timid' means shy, hesitant, and fearful. What word denotes confident, courageous, and daring?",
    workedSolution: "'Timid' means fearful or shy. Its direct behavioral antonym is 'bold' (confident and courageous).",
    points: 1
  },
  {
    number: 27,
    prompt: "The ancient footpath was crooked, whereas the newly surveyed bypass was perfectly ...... .\nChoose the word most nearly opposite in meaning to 'crooked'.",
    options: ["level", "straight", "smooth", "broad"],
    correctAnswer: "straight",
    hint: "'Crooked' means winding, bent, or curving. What geometrical word denotes extending continuously in the same direction without curving?",
    workedSolution: "'Crooked' means winding or bent. Its direct geometrical and spatial antonym is 'straight'.",
    points: 1
  },
  {
    number: 28,
    prompt: "The municipal assembly passed a bylaw to prohibit illegal sand-winning, but decided to ...... regulated quarrying.\nChoose the word most nearly opposite in meaning to 'prohibit'.",
    options: ["reward", "admit", "encourage", "permit"],
    correctAnswer: "permit",
    hint: "'Prohibit' means formally forbid or outlaw by regulation. What administrative word denotes officially allow?",
    workedSolution: "'Prohibit' means formally forbid by law. Its direct regulatory antonym is 'permit' (allow).",
    points: 1
  },
  {
    number: 29,
    prompt: "The honest eyewitness gave an authentic account of the robbery, but the suspect presented a ...... statement.\nChoose the word most nearly opposite in meaning to 'authentic'.",
    options: ["confusing", "fabricated", "brief", "boring"],
    correctAnswer: "fabricated",
    hint: "'Authentic' means genuine, truthful, and real. What word denotes invented, forged, or made up deceitfully?",
    workedSolution: "'Authentic' means genuine and truthful. Its direct evidentiary antonym is 'fabricated' (fictitious or invented).",
    points: 1
  },
  {
    number: 30,
    prompt: "Although rainfall was scanty during the harmattan, it was remarkably ...... during the planting season.\nChoose the word most nearly opposite in meaning to 'scanty'.",
    options: ["heavy", "endless", "abundant", "stormy"],
    correctAnswer: "abundant",
    hint: "'Scanty' means meager, scarce, or insufficient. What word denotes existing in copious, plentiful quantities?",
    workedSolution: "'Scanty' means meager or scarce. Its direct quantitative and agricultural antonym is 'abundant' (plentiful).",
    points: 1
  },

  // --- SECTION E: CLOZE PASSAGE (MEETING PROTOCOL) (31 - 35) ---
  {
    number: 31,
    prompt: "Cloze Passage: \"The emergency sitting of the School Disciplinary Committee began promptly at nine o'clock. The secretary read the ---31--- of the previous sitting, which were adopted after minor corrections.\"\nChoose the most suitable word:",
    options: ["records", "reports", "minutes", "notes"],
    correctAnswer: "minutes",
    hint: "The formal official written record of proceedings at an administrative sitting is termed the minutes.",
    workedSolution: "In meeting protocol, the formal written record of business transacted is designated as the 'minutes'.",
    points: 1
  },
  {
    number: 32,
    prompt: "Cloze Passage: \"A formal ---32--- was proposed by the senior housemaster to suspend the chronic truants for two weeks.\"\nChoose the most suitable word:",
    options: ["motion", "speech", "decree", "query"],
    correctAnswer: "motion",
    hint: "A formal proposal put forward in a meeting to be debated and voted upon is called a motion.",
    workedSolution: "In parliamentary decorum, a formal proposal submitted for debate and vote by members is a 'motion'.",
    points: 1
  },
  {
    number: 33,
    prompt: "Cloze Passage: \"The housemaster's proposal was immediately ---33--- by the sports master before discussion commenced.\"\nChoose the most suitable word:",
    options: ["confirmed", "seconded", "verified", "cheered"],
    correctAnswer: "seconded",
    hint: "In formal meeting procedure, after a motion is moved by one member, it must be formally supported by another.",
    workedSolution: "In meeting protocol, a motion moved by one member must be formally 'seconded' before it can be discussed or voted on.",
    points: 1
  },
  {
    number: 34,
    prompt: "Cloze Passage: \"Having concluded deliberations, the committee conducted a confidential vote by secret ---34---.\"\nChoose the most suitable word:",
    options: ["trial", "debate", "count", "ballot"],
    correctAnswer: "ballot",
    hint: "A formal democratic voting process conducted confidentially using slips of paper is a ballot.",
    workedSolution: "The formal parliamentary term for confidential paper voting in a committee is a secret 'ballot'.",
    points: 1
  },
  {
    number: 35,
    prompt: "Cloze Passage: \"Having arrived at a unanimous decision, the sitting was formally ---35--- until the following academic term.\"\nChoose the most suitable word:",
    options: ["adjourned", "canceled", "postponed", "shifted"],
    correctAnswer: "adjourned",
    hint: "The official parliamentary term for closing a meeting session to resume at a specified future date.",
    workedSolution: "In meeting procedure, concluding a sitting to reconvene at a future date is formally termed 'adjourned'.",
    points: 1
  },

  // --- PART B: ORAL LANGUAGE & PHONOLOGY (36 - 40) ---
  {
    number: 36,
    prompt: "Choose the word that contains the identical vowel sound as the underlined vowel in:\n\"The school wall clock struck **t<u>e</u>n**.\"",
    options: ["pain", "bread", "bean", "pan"],
    correctAnswer: "bread",
    hint: "The vowel in 'ten' is the short front open-mid vowel /e/. 'Bread' (/bred/) contains the identical short /e/ vowel sound.",
    workedSolution: "The word 'ten' contains the short monophthong /e/. 'Bread' shares the exact same vowel sound /bred/.",
    points: 1
  },
  {
    number: 37,
    prompt: "Choose the word that contains the identical consonant sound as the underlined digraph in:\n\"The choristers were singing in the **<u>ch</u>urch**.\"",
    options: ["machine", "chemist", "match", "character"],
    correctAnswer: "match",
    hint: "The digraph 'ch' in 'church' produces the voiceless palato-alveolar affricate /tʃ/, identical to 'match'.",
    workedSolution: "The digraph 'ch' in 'church' is pronounced /tʃ/. 'Match' (/mætʃ/) contains the identical affricate sound /tʃ/.",
    points: 1
  },
  {
    number: 38,
    prompt: "Choose the word that shares the identical initial consonant cluster sound as:\n\"The cat **<u>scr</u>atched** the timber door.\"",
    options: ["scream", "stream", "splash", "sprout"],
    correctAnswer: "scream",
    hint: "Identify the word beginning with the identical three-consonant cluster /skr/.",
    workedSolution: "The word 'scratched' begins with the three-consonant cluster /skr/. 'Scream' begins with the exact same /skr/ cluster.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which of the following words contains a SILENT consonant letter that is not voiced?",
    options: ["plumber", "timber", "member", "slumber"],
    correctAnswer: "plumber",
    hint: "In this word for a pipe-fitting tradesperson, the letter 'b' following 'm' is completely silent.",
    workedSolution: "In 'plumber' (pronounced /ˈplʌm.ər/), the letter 'b' is completely silent, unlike in 'timber', 'member', and 'slumber' where /b/ is sounded.",
    points: 1
  },
  {
    number: 40,
    prompt: "When the declarative statement \"The train has arrived\" is uttered with a prominent RISING INTONATION contour (↗), what emotional attitude is communicated?",
    options: [
      "Sarcasm",
      "Inquiry or surprise",
      "Finality",
      "Command"
    ],
    correctAnswer: "Inquiry or surprise",
    hint: "Applying a terminal rising tone to a declarative sentence converts it into an expression of surprise, disbelief, or question.",
    workedSolution: "In English suprasegmental phonology, a rising intonation on a statement signals questioning, disbelief, or 'inquiry or surprise'.",
    points: 1
  }
];

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

const assignedTargetIndices = seedShuffle(targetKeys, 202601);

export const balancedMock1EnglishP1: QuestionItem[] = allRawEnglishMock1Questions.map((q, idx) => {
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

export const paper2EnglishMock1Calibrated = {
  partA_composition: {
    title: "Part A: Writing (Composition)",
    instructions: "Answer one question only from this part. Your composition should be about 250 words long.",
    questions: [
      {
        questionNumber: "1",
        category: "Formal Letter",
        prompt: "Write a formal letter to the District Chief Executive (DCE) of your district, describing the deplorable condition of the road connecting your village to the district capital, and explaining at least two major economic hardships the road causes to farmers and traders.",
        modelAnswer: `Methodist Junior High School
P. O. Box 54
Keta-Nkwanta
14th May, 2026

The District Chief Executive
Anloga District Assembly
District Directorate, Anloga

Dear Sir,

PETITION REGARDING THE DEPLORABLE ROAD NETWORK AND ITS ECONOMIC IMPACT

On behalf of the youth, farmers, and market women of Keta-Nkwanta, I respectfully submit this petition to draw your urgent administrative attention to the deplorable, impassable state of our five-kilometer feeder road connecting our agrarian community to the municipal highway.

Constructed over two decades ago, our sole access road has completely deteriorated into a perilous network of deep gullies, exposed rocks, and waterlogged craters. During the rainy season, large culverts collapse, cutting off our village from the rest of the district for weeks. Commercial minibus operators and truck drivers consistently refuse to ply the route, citing severe damage to their axles and tires.

This infrastructural decay inflicts two devastating economic hardships on our people. First, it causes catastrophic post-harvest losses for our local farmers. Keta-Nkwanta produces metric tons of tomatoes, shallots, and fresh cassava every week. Because transport trucks cannot reach our farms, harvested perishable produce rots under farm sheds, impoverishing rural households and plunging families into severe debt.

Secondly, the deplorable road cripples local commerce by triggering exorbitant freight charges. The few daring tricycle operators charge double fares, drastically inflating the prices of essential goods in our local market. Furthermore, pregnant women and critically ill citizens cannot access the district hospital in emergencies, resulting in avoidable deaths.

We humbly appeal to the District Assembly to deploy graders and culverts to rehabilitate our road before the major rains resume.

Thank you.

Yours faithfully,
[Signature]
Kwabena Mensah
(Youth Secretary)`
      },
      {
        questionNumber: "2",
        category: "Article for Publication",
        prompt: "Write an article for publication in a national daily newspaper on the topic: \"Why Teenage Pregnancy Remains a Threat to Girl-Child Education in Ghana, and How Communities Can Eradicate It.\"",
        modelAnswer: `WHY TEENAGE PREGNANCY THREATENS GIRL-CHILD EDUCATION IN GHANA
By Samuel K. Boateng, Begoro

In contemporary Ghanaian society, education is universally recognized as the engine of personal empowerment and national progress. However, an insidious social menace continues to thwart the academic aspirations of thousands of promising young girls across our districts: the persistent epidemic of teenage pregnancy. This crisis truncates the potentials of vulnerable adolescents, perpetuates cycles of generational poverty, and demands concerted community intervention.

The foremost devastating effect of teenage pregnancy is the premature termination of formal schooling. When an adolescent girl becomes pregnant, social stigmatization, physical changes, and maternal domestic demands invariably compel her to abandon classroom instruction. While progressive educational guidelines permit young mothers to re-enter school after childbirth, severe economic deprivation and the lack of childcare support prevent over eighty percent of them from ever returning. Deprived of basic literacy and professional qualifications, these young mothers are condemned to low-income, precarious street trading, while their male counterparts advance to senior high school and tertiary universities.

Secondly, teenage pregnancy carries grave public health and psychological complications. Physiologically immature adolescent bodies face high risks of obstetric fistulae, pre-eclampsia, and infant mortality during labor. The psychological trauma of societal rejection and parental abandonment often plunges young girls into severe chronic depression and feelings of worthlessness.

To eradicate this menace, communities must take decisive action. First, traditional councils and municipal assemblies must rigorously enforce child protection laws, prosecuting adult men who impregnate schoolgirls. Secondly, parents and schools must dismantle cultural taboos surrounding sex education, providing adolescents with comprehensive reproductive health counseling.

Empowering the girl-child is non-negotiable. We must protect our girls today to secure Ghana's tomorrow.`
      },
      {
        questionNumber: "3",
        category: "Narrative Moral Story",
        prompt: "Write an interesting and realistic story that illustrates the traditional proverb: \"A patient dog eats the fattest bone.\"",
        modelAnswer: `A PATIENT DOG EATS THE FATTEST BONE

During our final year in junior high school, my childhood desk-mate, Kofi, was notoriously restless, impulsive, and obsessed with acquiring quick money. While our teachers continually reminded us that enduring success requires patient preparation, Kofi daydreamed about owning luxury sneakers and smartphones.

His impatience reached a boiling point when a flamboyant stranger named Patrick visited our village. Patrick claimed to run a lucrative digital investment agency in Accra, promising that anyone who invested two hundred cedis would receive a thousand cedis within fourteen days without doing any manual labor. Dazzled by this prospect, Kofi resolved to drop out of school. He emptied his mother's petty-trading savings box, abandoned his books, and handed the money to Patrick, mocking those of us who spent our afternoons solving mathematical equations. He urged me to join him, but remembering my grandfather's admonition that "a patient dog eats the fattest bone," I declined and concentrated on my studies.

Three weeks later, while I was sitting for our regional mock examinations, tragic news shattered our neighborhood. Patrick was an undercover fraudster who had vanished with over fifty thousand cedis belonging to gullible villagers. Kofi's mother collapsed from hypertension upon discovering her savings were gone, while Kofi was arrested as an accomplice. Weeping in handcuffs at the police station, Kofi realized that his thirst for instant wealth had destroyed his dignity.

Two months later, our BECE results were officially released. I passed with distinction, securing Aggregate Six and winning a full government scholarship to study General Science at Prempeh College. Standing on the podium on Speech Day, looking at my scholarship certificate, the timeless truth echoed in my heart: Truly, a patient dog eats the fattest bone.`
      }
    ]
  },
  partB_comprehension: {
    title: "Part B: Reading Comprehension",
    instructions: "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
    passageText: `For nearly three decades, the serene fishing settlement of Keta-Nkwanta thrived in harmony with the sea. Its inhabitants were industrious fishermen and clam-harvesters who built beautiful coconut-thatched homes along the sand spit. The Atlantic Ocean was not only their geographical neighbor; it was the sacred lifeblood that sustained their families and schooled their children.

However, over the past five years, the relationship between the villagers and the ocean turned into a nightmare. Driven by rising global sea levels and destructive storm surges, the Atlantic began aggressively swallowing the shoreline. At first, high tidal waves washed over the beach only during the equinox. But soon, the sea breached the protective sand dunes during ordinary high tides.

One terrifying Friday midnight, a ferocious tidal surge struck while the community was asleep. Enormous waves, towering three meters high, smashed through coastal coconut groves, demolishing thirty houses within an hour. Fishing canoes were shattered against palm trunks, while outboard motors and expensive nylon fishing nets were dragged into the ocean abyss. Families scrambled onto higher ground in total darkness, clutching shivering children and weeping over the sudden loss of their life savings.

At daybreak, the once-bustling beach presented a desolate picture of ruin. Salty brown water submerged the main street, while household belongings—mattresses, cooking pots, and school uniforms—floated like flotsam. The community primary school and the sole borehole supplying potable water had both been inundated with brine.

The District Disaster Management Organisation (NADMO) arrived with relief tents, sacks of rice, and blankets. However, the assemblyman for the area pointed out during a town durbar that temporary relief was merely a cosmetic bandage on a gaping wound. He argued passionately that unless the central government constructed a permanent coastal sea-defense wall of heavy granite boulders, Keta-Nkwanta would be wiped off the map of Ghana within two years.`,
    questions: [
      {
        subQuestion: "(a)",
        question: "State the primary occupation of the inhabitants of Keta-Nkwanta before the coastal crisis began.",
        answer: "The inhabitants were fishermen and clam-harvesters (engaged in marine and estuarine fishing)."
      },
      {
        subQuestion: "(b)",
        question: "In what specific way did the behavior of the Atlantic Ocean change over the past five years?",
        answer: "The ocean became violent and destructive, aggressively eroding the shoreline and washing over the sand dunes during ordinary high tides rather than only during the equinox."
      },
      {
        subQuestion: "(c)",
        question: "Mention two specific items of fishing equipment that were destroyed or swept away by the midnight tidal surge.",
        answer: "Wooden fishing canoes, outboard motors, and nylon fishing nets."
      },
      {
        subQuestion: "(d)",
        question: "Why did the assemblyman describe the relief items brought by NADMO as 'a cosmetic bandage on a gaping wound'?",
        answer: "The assemblyman meant that the blankets and food supplies provided by NADMO were only temporary, superficial relief measures that could not solve the underlying existential danger of ocean erosion."
      },
      {
        subQuestion: "(e)",
        question: "Explain the meaning of the following expressions as used in the passage:\nI. ... swallowing the shoreline;\nII. ... total darkness;\nIII. ... wiped off the map.",
        answer: "I. 'swallowing the shoreline' means rapidly eroding, submerging, and washing away the coastal land.\nII. 'total darkness' means complete absence of light or illumination; pitch-black conditions.\nIII. 'wiped off the map' means completely demolished, obliterated, submerged, and erased from existence."
      },
      {
        subQuestion: "(f)",
        question: "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. serene;\nII. aggressively;\nIII. desolate;\nIV. inundated.",
        answer: "I. serene: tranquil, calm, peaceful, quiet.\nII. aggressively: fiercely, violently, forcefully, relentlessly.\nIII. desolate: ruined, bleak, devastated, deserted.\nIV. inundated: flooded, submerged, soaked, overwhelmed with water."
      },
      {
        subQuestion: "(g)",
        question: "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize two major losses suffered by the villagers.",
        answer: "1. Thirty coastal homes were completely demolished.\n2. Expensive fishing equipment was entirely destroyed."
      }
    ]
  },
  partC_literature: {
    title: "Part C: Literature in English (The Cockcrow Anthology)",
    instructions: "Answer all questions in this part based on the prescribed texts from Sackey J.A. and Darmani L. (comp.): The Cockcrow.",
    questions: [
      {
        sectionTitle: "CHARLES DICKENS: Oliver Twist",
        contextExtract: "\"Please, sir, I want some more.\"\nThe master was a fat, healthy man; but he turned very pale. He gazed in stupefied astonishment on the small rebel for some seconds, and then clung for support to the copper.",
        subItems: [
          {
            subQuestion: "5(a)",
            question: "What specific item was Oliver asking for 'more' of?",
            answer: "He was asking for more food/gruel (thin porridge)."
          },
          {
            subQuestion: "5(b)",
            question: "How did the workhouse board punish Oliver for making this request?",
            answer: "He was confined in a dark solitary room, beaten by Mr. Bumble, and offered as an apprentice with a five-pound reward to get rid of him."
          }
        ]
      },
      {
        sectionTitle: "AMA ATA AIDOO: The Girl Who Can",
        contextExtract: "\"Nana was saying: 'Ah, ah, you school people. You know everything. But tell me, what can a girl do with legs that are as thin as reeds?'\"",
        subItems: [
          {
            subQuestion: "5(c)",
            question: "Who is the narrator possessing the 'legs as thin as reeds'?",
            answer: "Adjoa (the seven-year-old disabled girl)."
          },
          {
            subQuestion: "5(d)",
            question: "How did the narrator eventually prove Nana's skepticism wrong?",
            answer: "She was selected to run for her school and won the cup in the district sports competition, proving her thin legs were useful for running."
          }
        ]
      },
      {
        sectionTitle: "AMA ATA AIDOO: The Dilemma of a Ghost",
        contextExtract: "1st WOMAN: If her son gets a goodly bag by the month,\nWhy has Esi Kom still not...\n2nd WOMAN: They never ask 'Why'.\nIs it not the young man's wife?\nShe swallows money as a hen does corn.",
        subItems: [
          {
            subQuestion: "5(e)",
            question: "Who is referred to as 'the young man's wife'?",
            answer: "Eulalie Rush (Ato Yawson's African-American wife)."
          },
          {
            subQuestion: "5(f)",
            question: "Identify the literary device in: 'She swallows money as a hen does corn.'",
            answer: "Simile."
          }
        ]
      },
      {
        sectionTitle: "LADE WOSORNU: Desert Rivers",
        contextExtract: "\"These run their unwitnessed course\nTo their unwitnessed end.\nWithout a sound\nThey gush into bowels of seas\nFar, far away from unaided human eyes.\"",
        subItems: [
          {
            subQuestion: "5(g)",
            question: "What do the hidden 'Desert Rivers' symbolize in the poem?",
            answer: "Unrecognized human potential, hidden talents, inner resilience, and suppressed suffering."
          },
          {
            subQuestion: "5(h)",
            question: "What central theme is highlighted by the line: 'Far, far away from unaided human eyes'?",
            answer: "The theme of unnoticed greatness, quiet endurance, and hidden life struggles."
          }
        ]
      },
      {
        sectionTitle: "LAWRENCE DARMANI: Scribbler's Dream",
        contextExtract: "\"Scribbler,\nThe dream in your mind fills the shelf.\nWhen upon the shelf you gaze,\nA vacuum stares at you.\"",
        subItems: [
          {
            subQuestion: "5(i)",
            question: "What does the word 'vacuum' symbolize in the extract?",
            answer: "Emptiness, unwritten books, wasted potential, and lack of literary productivity."
          },
          {
            subQuestion: "5(j)",
            question: "Identify the literary device used in 'A vacuum stares at you'.",
            answer: "Personification."
          }
        ]
      }
    ]
  }
};

export const flattenedEnglishMock1Paper2Questions = [
  ...paper2EnglishMock1Calibrated.partA_composition.questions.map((q: any, idx: number) => ({
    number: idx + 1,
    questionNumber: q.questionNumber,
    section: "Part A: Writing (Composition)",
    category: q.category,
    prompt: q.prompt,
    modelAnswer: q.modelAnswer,
    points: 30
  })),
  {
    number: 4,
    questionNumber: "4",
    section: "Part B: Reading Comprehension",
    instructions: paper2EnglishMock1Calibrated.partB_comprehension.instructions,
    passageText: paper2EnglishMock1Calibrated.partB_comprehension.passageText,
    subQuestions: paper2EnglishMock1Calibrated.partB_comprehension.questions,
    points: 30
  },
  ...paper2EnglishMock1Calibrated.partC_literature.questions.map((q: any, idx: number) => ({
    number: 5 + idx,
    questionNumber: `5${String.fromCharCode(97 + idx)}`,
    section: "Part C: Literature in English (The Cockcrow)",
    textTitle: q.sectionTitle,
    contextExtract: q.contextExtract,
    subQuestions: q.subItems,
    points: 2
  }))
];

export const SET_BECE_MOCK_1_ENGLISH_P1 = {
  year: "Mock 1",
  isMock: true,
  setNumber: 1,
  subject: "English Language",
  examination: "WAEC BECE English Language (National Mock 1)",
  title: "Paper 1: Objective Test (Mock 1)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: balancedMock1EnglishP1,
  allQuestions: balancedMock1EnglishP1
};

export const SET_BECE_MOCK_1_ENGLISH_P2 = {
  year: "Mock 1",
  isMock: true,
  setNumber: 1,
  subject: "English Language",
  examination: "WAEC BECE English Language (National Mock 1)",
  title: "Paper 2: Written Essay, Comprehension & Literature (Mock 1)",
  durationMinutes: 90,
  totalQuestions: 9,
  instructions: "Answer three questions in all: one from Part A, all questions in Part B, and all questions in Part C.",
  sections: paper2EnglishMock1Calibrated,
  questions: flattenedEnglishMock1Paper2Questions
};

export const SET_BECE_MOCK_1_ENGLISH_COMPLETE = {
  year: "Mock 1",
  isMock: true,
  setNumber: 1,
  subject: "English Language",
  examination: "WAEC BECE English Language (National Mock 1)",
  paper1: SET_BECE_MOCK_1_ENGLISH_P1,
  paper2: SET_BECE_MOCK_1_ENGLISH_P2
};
