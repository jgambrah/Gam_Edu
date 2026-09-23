import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

export const MOCK_7_PAYLOAD = {
  "mockId": "mock_7",
  "mockNumber": 7,
  "title": "BECE English Language National Mock Examination 7",
  "subjectId": "english",
  "examType": "mock",
  "metadata": {
    "isPastQuestion": false,
    "isMockExam": true,
    "standard": "NaCCA / WAEC BECE Standard",
    "totalMarks": 100,
    "totalDurationMinutes": 135,
    "paper1Count": 40,
    "optionsBalanced": true,
    "unplagiarizedPedagogicalAdaptation": true,
    "hasCockcrowLiterature": true,
    "hasOralLanguageComponent": true,
    "strictSubjectIsolation": "english_only",
    "updatedAt": "2026-09-23T18:30:36.258Z"
  },
  "paper1": {
    "title": "Paper 1: Objective Test (Lexis, Structure, Cloze, and Oral Language)",
    "durationMinutes": 45,
    "totalQuestions": 40,
    "sections": {
      "sectionA_lexis_and_structure": {
        "title": "Section A: Lexis and Structure",
        "questionRange": "Questions 1 to 15",
        "questions": [
          {
            "number": 1,
            "prompt": "Had the commercial driver obeyed the statutory speed limit, the vehicle ............ off the embankment.",
            "options": [
              "would not skid",
              "would not have skidded",
              "will not have skidded",
              "did not skid"
            ],
            "correctAnswer": "would not have skidded",
            "hint": "Inverted Third Conditional: 'Had the commercial driver obeyed' in the conditional clause requires 'would not have + past participle' in the main clause.",
            "workedSolution": "In a Third Conditional inverted construction, an unfulfilled past condition takes a modal past perfect in the main clause: 'would not have skidded'.",
            "points": 1
          },
          {
            "number": 2,
            "prompt": "The scholarship guidelines stipulated that every candidate ............ an authentic birth certificate.",
            "options": [
              "submits",
              "submitted",
              "submit",
              "should have submitted"
            ],
            "correctAnswer": "submit",
            "hint": "Mandative Subjunctive: Clauses introduced by verbs of requirement or regulation ('stipulated that') take a base bare infinitive without third-person '-s'.",
            "workedSolution": "Following verbs of decreeing, requiring, or stipulating followed by 'that', the mandative subjunctive requires the base verb form: 'stipulated that every candidate submit'.",
            "points": 1
          },
          {
            "number": 3,
            "prompt": "The new academic curriculum, ............ aims at developing practical skills, has been introduced.",
            "options": [
              "who",
              "which",
              "whom",
              "whose"
            ],
            "correctAnswer": "which",
            "hint": "Non-defining relative clause modifying an inanimate noun phrase ('The new academic curriculum').",
            "workedSolution": "In non-defining relative clauses modifying non-human antecedents, standard prescriptive grammar requires 'which': 'curriculum, which aims at...'.",
            "points": 1
          },
          {
            "number": 4,
            "prompt": "A sudden ............ of rain forced the outdoor soccer tournament to pause momentarily.",
            "options": [
              "sheet",
              "torrent",
              "gust",
              "shower"
            ],
            "correctAnswer": "shower",
            "hint": "Identify the standard partitive noun indicating a brief, light to moderate fall of rain.",
            "workedSolution": "In standard English meteorological collocations, a brief fall of rain is partitively termed 'a shower of rain'.",
            "points": 1
          },
          {
            "number": 5,
            "prompt": "The ceremonial parade featured the three ............ swords glittering in the morning sunlight.",
            "options": [
              "commander-in-chief's",
              "commanders'-in-chief",
              "commanders-in-chiefs'",
              "commanders-in-chief's"
            ],
            "correctAnswer": "commanders-in-chief's",
            "hint": "Compound noun plural possessive: Form the plural of the base noun ('commanders-in-chief') and add apostrophe + 's' to the final element.",
            "workedSolution": "The plural form of 'commander-in-chief' is 'commanders-in-chief'. To form the possessive case of a compound noun, add apostrophe + 's' to the end: 'commanders-in-chief's swords'.",
            "points": 1
          },
          {
            "number": 6,
            "prompt": "............ we worry about the delay since the train is already approaching the terminal?",
            "options": [
              "Needs",
              "Need",
              "Do we need",
              "Must we need"
            ],
            "correctAnswer": "Need",
            "hint": "When 'need' functions as a semi-modal auxiliary in questions, it takes a bare infinitive without 'to' and does not take 'do'.",
            "workedSolution": "As a modal auxiliary in questions, 'Need' precedes the subject without auxiliary 'do': 'Need we worry...?'.",
            "points": 1
          },
          {
            "number": 7,
            "prompt": "The craftsmanship of our local joiners is undeniably superior ............ imported fiberboard furniture.",
            "options": [
              "than",
              "from",
              "against",
              "to"
            ],
            "correctAnswer": "to",
            "hint": "Comparative adjectives of Latin origin (superior, inferior, senior, junior) strictly collocate with 'to', never 'than'.",
            "workedSolution": "Latin comparative adjectives like 'superior' take the preposition 'to': 'superior to imported furniture'.",
            "points": 1
          },
          {
            "number": 8,
            "prompt": "Either the senior prefect or his assistants ............ responsible for organizing the library books yesterday.",
            "options": [
              "was",
              "is",
              "are",
              "were"
            ],
            "correctAnswer": "were",
            "hint": "Proximity concord with 'either... or': The verb agrees in number with the nearer plural subject ('his assistants') in the past tense.",
            "workedSolution": "When subjects are linked by 'either... or', the verb agrees with the closer subject ('his assistants', plural). In the past tense, the correct verb is 'were'.",
            "points": 1
          },
          {
            "number": 9,
            "prompt": "Active: \"The headmaster made the recalcitrant student sweep the assembly hall.\"\nPassive: \"The recalcitrant student was made ............ the assembly hall by the headmaster.\"",
            "options": [
              "sweep",
              "swept",
              "sweeping",
              "to sweep"
            ],
            "correctAnswer": "to sweep",
            "hint": "Causative verb 'make': In the active voice it takes a bare infinitive, but in the passive voice it requires a full to-infinitive.",
            "workedSolution": "In passive voice transformations of causative 'make', the verb takes a full to-infinitive: 'was made to sweep'.",
            "points": 1
          },
          {
            "number": 10,
            "prompt": "The defaulting shopkeeper admitted ............ the missing consignment from the depot.",
            "options": [
              "stealing",
              "steal",
              "to steal",
              "having stolen of"
            ],
            "correctAnswer": "stealing",
            "hint": "The catenative verb 'admit' takes a gerund complement (verb-ing).",
            "workedSolution": "In standard English syntax, the verb 'admit' requires a gerund complement: 'admitted stealing the consignment'.",
            "points": 1
          },
          {
            "number": 11,
            "prompt": "Nowhere in the entire district ............ such dedicated community volunteerism.",
            "options": [
              "can one find",
              "one can find",
              "one could find",
              "did one found"
            ],
            "correctAnswer": "can one find",
            "hint": "Fronted negative adverbial of place ('Nowhere') triggers subject-auxiliary inversion.",
            "workedSolution": "When a restrictive or negative adverbial ('Nowhere') begins a sentence, standard English requires subject-auxiliary inversion: 'can one find'.",
            "points": 1
          },
          {
            "number": 12,
            "prompt": "The visiting physician is a trusted childhood companion of ............",
            "options": [
              "hers",
              "her",
              "she",
              "herself"
            ],
            "correctAnswer": "hers",
            "hint": "Double possessive construction: 'a [noun] of' requires an absolute possessive pronoun.",
            "workedSolution": "The double possessive construction ('a companion of...') requires the independent possessive pronoun 'hers': 'a companion of hers'.",
            "points": 1
          },
          {
            "number": 13,
            "prompt": "Nobody in the assembly hall complained about the ventilation, ............ they?",
            "options": [
              "didn't",
              "was",
              "did",
              "weren't"
            ],
            "correctAnswer": "did",
            "hint": "The indefinite pronoun 'Nobody' carries negative polarity and is referred to by plural pronoun 'they' with an affirmative question tag.",
            "workedSolution": "'Nobody' is semantically negative and is referenced by plural pronoun 'they'. The matching question tag must have affirmative polarity in the simple past: 'did they?'.",
            "points": 1
          },
          {
            "number": 14,
            "prompt": "The archaeologists uncovered an ............ monument near the ancient riverbank.",
            "options": [
              "triangular ancient stone",
              "stone ancient triangular",
              "ancient triangular stone",
              "ancient stone triangular"
            ],
            "correctAnswer": "ancient triangular stone",
            "hint": "Cumulative adjective ordering: Age ('ancient') precedes Shape ('triangular') which precedes Material ('stone') before the head noun.",
            "workedSolution": "Standard English cumulative adjective ordering places age ('ancient') before shape ('triangular') followed by material origin ('stone'): 'ancient triangular stone monument'.",
            "points": 1
          },
          {
            "number": 15,
            "prompt": "The commission of inquiry completely absolved the security guard ............ all complicity in the theft.",
            "options": [
              "of",
              "with",
              "against",
              "from"
            ],
            "correctAnswer": "from",
            "hint": "Identify the dependent preposition that regularly collocates with the verb 'absolved' when releasing someone from blame or guilt.",
            "workedSolution": "In standard English legal collocations, an accused individual is 'absolved from' blame, liability, or guilt: 'absolved from all complicity'.",
            "points": 1
          }
        ]
      },
      "sectionB_synonyms": {
        "title": "Section B: Synonyms (Nearest in Meaning)",
        "questionRange": "Questions 16 to 20",
        "questions": [
          {
            "number": 16,
            "prompt": "The forensic auditor scrutinized the financial ledgers for hours.\nChoose the word nearest in meaning to 'scrutinized'.",
            "options": [
              "collected",
              "copied",
              "examined",
              "arranged"
            ],
            "correctAnswer": "examined",
            "hint": "Examined or inspected closely and thoroughly.",
            "workedSolution": "'Scrutinized' means examined closely and thoroughly; 'examined' is its direct synonym.",
            "points": 1
          },
          {
            "number": 17,
            "prompt": "The traditional elders maintained a cordial relationship with the visiting delegates.\nChoose the word nearest in meaning to 'cordial'.",
            "options": [
              "friendly",
              "formal",
              "cautious",
              "strict"
            ],
            "correctAnswer": "friendly",
            "hint": "Warm and friendly; pleasant and polite.",
            "workedSolution": "'Cordial' means warm, courteous, and 'friendly'; 'friendly' is its exact equivalent.",
            "points": 1
          },
          {
            "number": 18,
            "prompt": "The displaced farming community proved remarkably resilient in the face of disaster.\nChoose the word nearest in meaning to 'resilient'.",
            "options": [
              "fearful",
              "stubborn",
              "restless",
              "tough"
            ],
            "correctAnswer": "tough",
            "hint": "Able to withstand or recover quickly from difficult conditions; hardy or tough.",
            "workedSolution": "'Resilient' means capable of enduring hardship and recovering quickly; 'tough' is its closest synonym.",
            "points": 1
          },
          {
            "number": 19,
            "prompt": "The science tutor presented a lucid explanation of electromagnetic induction.\nChoose the word nearest in meaning to 'lucid'.",
            "options": [
              "simple",
              "brief",
              "clear",
              "loud"
            ],
            "correctAnswer": "clear",
            "hint": "Expressed clearly; easy to understand; transparent.",
            "workedSolution": "'Lucid' means expressed with clarity and easy to comprehend; 'clear' is its direct synonym.",
            "points": 1
          },
          {
            "number": 20,
            "prompt": "The indolent apprentice was cautioned repeatedly for neglecting his daily duties.\nChoose the word nearest in meaning to 'indolent'.",
            "options": [
              "lazy",
              "clumsy",
              "disobedient",
              "arrogant"
            ],
            "correctAnswer": "lazy",
            "hint": "Wanting to avoid activity or exertion; lazy.",
            "workedSolution": "'Indolent' means habitually inactive or idle; 'lazy' is its direct synonym.",
            "points": 1
          }
        ]
      },
      "sectionC_idioms": {
        "title": "Section C: Idiomatic Expressions",
        "questionRange": "Questions 21 to 25",
        "questions": [
          {
            "number": 21,
            "prompt": "By investing his entire life savings in a single unproven venture, Kwesi put all his eggs in one basket. This means Kwesi ............",
            "options": [
              "purchased a poultry farm",
              "risked everything on a single venture",
              "diversified his commercial assets",
              "wasted his savings carelessly"
            ],
            "correctAnswer": "risked everything on a single venture",
            "hint": "To risk all of one's resources or hopes on a single venture or course of action.",
            "workedSolution": "The idiom 'to put all one's eggs in one basket' means to stake all of one's fortunes on a single enterprise, risking total ruin if it fails.",
            "points": 1
          },
          {
            "number": 22,
            "prompt": "The witness was beating around the bush during cross-examination. This means the witness was ............",
            "options": [
              "avoiding addressing the main topic directly",
              "walking through the countryside",
              "insulting the defense counsel",
              "weeping before the court"
            ],
            "correctAnswer": "avoiding addressing the main topic directly",
            "hint": "To discuss a matter without coming directly to the central point; procrastinating.",
            "workedSolution": "The idiom 'to beat around the bush' means to talk about unnecessary details in order to avoid answering directly or addressing the main point.",
            "points": 1
          },
          {
            "number": 23,
            "prompt": "Procuring genuine spare parts for that vintage tractor cost an arm and a leg. This means the parts were ............",
            "options": [
              "extremely expensive",
              "physically dangerous",
              "unavailable locally",
              "poorly manufactured"
            ],
            "correctAnswer": "extremely expensive",
            "hint": "Very expensive; requiring an exorbitant amount of money.",
            "workedSolution": "The idiom 'to cost an arm and a leg' means to be exorbitantly or extremely expensive.",
            "points": 1
          },
          {
            "number": 24,
            "prompt": "By carefully reading between the lines of the minister's address, the reporter discerned the truth. This means the reporter ............",
            "options": [
              "understood the hidden or implied meaning",
              "read through the text quickly",
              "corrected the typographical errors",
              "criticized the formal grammar"
            ],
            "correctAnswer": "understood the hidden or implied meaning",
            "hint": "To find hidden meaning in something; discern what is implied rather than stated openly.",
            "workedSolution": "The idiom 'to read between the lines' means to perceive the underlying, unspoken, or hidden meaning behind explicit statements.",
            "points": 1
          },
          {
            "number": 25,
            "prompt": "The detective resolved to leave no stone unturned in tracing the abducted infant. This means the detective resolved to ............",
            "options": [
              "make every possible effort to achieve the objective",
              "excavate the riverbank",
              "seek assistance from village elders",
              "abandon the investigation"
            ],
            "correctAnswer": "make every possible effort to achieve the objective",
            "hint": "To try every possible course of action in order to achieve something.",
            "workedSolution": "The idiom 'to leave no stone unturned' means to utilize every available resource and make every possible effort to accomplish an aim.",
            "points": 1
          }
        ]
      },
      "sectionD_antonyms": {
        "title": "Section D: Antonyms (Opposite in Meaning)",
        "questionRange": "Questions 26 to 30",
        "questions": [
          {
            "number": 26,
            "prompt": "During the prolonged drought, food supplies were scarce, but after the harvest they became ...... .\nChoose the word most nearly opposite in meaning to 'scarce'.",
            "options": [
              "fresh",
              "expensive",
              "plentiful",
              "wholesome"
            ],
            "correctAnswer": "plentiful",
            "hint": "'Scarce' means in short supply; rare. What word denotes existing in copious, abundant supply?",
            "workedSolution": "'Scarce' means insufficient or rare. Its direct quantitative antonym is 'plentiful' (abundant).",
            "points": 1
          },
          {
            "number": 27,
            "prompt": "While the junior magistrate was remarkably lenient, the appellate judge was exceptionally ...... .\nChoose the word most nearly opposite in meaning to 'lenient'.",
            "options": [
              "arrogant",
              "unfair",
              "severe",
              "impatient"
            ],
            "correctAnswer": "severe",
            "hint": "'Lenient' means tolerant, mild, or merciful in discipline. What word denotes harsh, strict, and unsparing?",
            "workedSolution": "'Lenient' means merciful or mild. Its direct judicial and disciplinary antonym is 'severe' (or strict/harsh).",
            "points": 1
          },
          {
            "number": 28,
            "prompt": "The primary banner was conspicuous at the entrance, while the warning notice was completely ...... .\nChoose the word most nearly opposite in meaning to 'conspicuous'.",
            "options": [
              "tattered",
              "small",
              "illegible",
              "hidden"
            ],
            "correctAnswer": "hidden",
            "hint": "'Conspicuous' means clearly visible; standing out. What word denotes concealed or kept out of sight?",
            "workedSolution": "'Conspicuous' means clearly noticeable and visible. Its direct visual antonym is 'hidden' (concealed or inconspicuous).",
            "points": 1
          },
          {
            "number": 29,
            "prompt": "Our grandmother maintained a frugal kitchen, whereas her visiting relatives were remarkably ...... .\nChoose the word most nearly opposite in meaning to 'frugal'.",
            "options": [
              "greedy",
              "lavish",
              "wealthy",
              "careless"
            ],
            "correctAnswer": "lavish",
            "hint": "'Frugal' means economical and sparing with resources. What word denotes profuse, extravagant, and generous to excess?",
            "workedSolution": "'Frugal' means economical and thrifty. Its direct financial and domestic antonym is 'lavish' (extravagant and spendthrift).",
            "points": 1
          },
          {
            "number": 30,
            "prompt": "The turbulent waters of the ocean surf contrast sharply with the ...... waters of the sheltered lagoon.\nChoose the word most nearly opposite in meaning to 'turbulent'.",
            "options": [
              "deep",
              "calm",
              "clean",
              "narrow"
            ],
            "correctAnswer": "calm",
            "hint": "'Turbulent' means characterized by violent motion or agitation. What word denotes serene, quiet, and without agitation?",
            "workedSolution": "'Turbulent' means wildly agitated or stormy. Its direct physical antonym describing water is 'calm' (or tranquil).",
            "points": 1
          }
        ]
      },
      "sectionE_cloze_passage": {
        "title": "Section E: Maritime and Fisheries Cloze Passage",
        "questionRange": "Questions 31 to 35",
        "questions": [
          {
            "number": 31,
            "prompt": "Cloze Passage: \"The commercial fishing crew prepared their mechanized deep-sea ---31--- for a three-week expedition into international waters.\"\nChoose the most suitable word:",
            "options": [
              "trawler",
              "canoe",
              "ferry",
              "barge"
            ],
            "correctAnswer": "trawler",
            "hint": "A large commercial fishing vessel designed to operate by dragging a net through the water is a trawler.",
            "workedSolution": "In marine fisheries terminology, an industrial ocean-going fishing boat equipped with nets is a 'trawler'.",
            "points": 1
          },
          {
            "number": 32,
            "prompt": "Cloze Passage: \"Before dawn, the vessel steered away from the sheltered quay inside the municipal ---32--- and headed out to sea.\"\nChoose the most suitable word:",
            "options": [
              "beach",
              "harbour",
              "shore",
              "estuary"
            ],
            "correctAnswer": "harbour",
            "hint": "A sheltered body of water where ships, boats, and barges can be docked or anchored safely is a harbour.",
            "workedSolution": "The formal maritime term for a safe, sheltered port facility for ships is a 'harbour'.",
            "points": 1
          },
          {
            "number": 33,
            "prompt": "Cloze Passage: \"The experienced helmsman ---33--- the vessel through the perilous rocky channel using radar and nautical charts.\"\nChoose the most suitable word:",
            "options": [
              "pushed",
              "guided",
              "navigated",
              "drove"
            ],
            "correctAnswer": "navigated",
            "hint": "To plan, direct, and steer the course of a ship or vehicle using marine instruments is to navigate.",
            "workedSolution": "The standard maritime technical verb for steering and directing a vessel across water is 'navigated'.",
            "points": 1
          },
          {
            "number": 34,
            "prompt": "Cloze Passage: \"Using modern sonar fish-finders, the captain located vast ---34--- of tuna moving along the continental shelf.\"\nChoose the most suitable word:",
            "options": [
              "flocks",
              "shoals",
              "packs",
              "crowds"
            ],
            "correctAnswer": "shoals",
            "hint": "A large number of fish swimming together is termed a shoal (or school).",
            "workedSolution": "In marine biological and fishing register, a large collective gathering of fish is a 'shoal' of fish.",
            "points": 1
          },
          {
            "number": 35,
            "prompt": "Cloze Passage: \"Having hauled thirty metric tons of catch into the refrigerated holds, the crew returned to port and securely ---35--- the ship.\"\nChoose the most suitable word:",
            "options": [
              "tied",
              "stopped",
              "parked",
              "anchored"
            ],
            "correctAnswer": "anchored",
            "hint": "To moor or secure a ship firmly to the seabed using a heavy metal device is to anchor.",
            "workedSolution": "The formal nautical term for securing a vessel in position in the water is 'anchored'.",
            "points": 1
          }
        ]
      },
      "partB_oral_language": {
        "title": "Part B: Oral Language & Phonology",
        "questionRange": "Questions 36 to 40",
        "questions": [
          {
            "number": 36,
            "prompt": "Choose the word that contains the identical voiceless velar plosive consonant sound as the underlined sound in:\n\"The apprentice suffered from a sharp **stoma<u>ch</u>** ache.\"",
            "options": [
              "church",
              "machine",
              "monarch",
              "charity"
            ],
            "correctAnswer": "monarch",
            "hint": "The digraph 'ch' in 'stomach' produces the voiceless velar plosive /k/. 'Monarch' (/ˈmɒn.ək/) ends with the identical /k/ sound.",
            "workedSolution": "The final sound in 'stomach' is /k/. 'Monarch' terminates in the identical /k/ sound, unlike 'church' (/tʃ/), 'machine' (/ʃ/), and 'charity' (/tʃ/).",
            "points": 1
          },
          {
            "number": 37,
            "prompt": "Choose the word that contains the identical long front vowel sound as the underlined vowel in:\n\"The ferry berthed alongside the concrete **q<u>uay</u>**.\"",
            "options": [
              "play",
              "scene",
              "tray",
              "pay"
            ],
            "correctAnswer": "scene",
            "hint": "'Quay' is pronounced /kiː/ with the long vowel /iː/. 'Scene' (/siːn/) contains the identical long vowel /iː/.",
            "workedSolution": "The word 'quay' is pronounced /kiː/. Among the options, 'scene' (/siːn/) contains the identical /iː/ monophthong, whereas 'play', 'tray', and 'pay' contain the diphthong /eɪ/.",
            "points": 1
          },
          {
            "number": 38,
            "prompt": "Choose the word that shares the identical final consonant cluster sound as:\n\"The historian wrote a treatise on ancient **des<u>pots</u>**.\"",
            "options": [
              "cliffs",
              "roads",
              "paths",
              "tents"
            ],
            "correctAnswer": "tents",
            "hint": "'Despots' ends in the voiceless plosive-alveolar cluster /ts/. 'Tents' (/tents/) ends in the identical alveolar cluster /ts/.",
            "workedSolution": "'Despots' terminates in the voiceless consonant cluster /ts/. 'Tents' shares the identical /ts/ cluster ending.",
            "points": 1
          },
          {
            "number": 39,
            "prompt": "Which of the following words contains a SILENT consonant letter that is not sounded in standard pronunciation?",
            "options": [
              "sing",
              "sign",
              "song",
              "ring"
            ],
            "correctAnswer": "sign",
            "hint": "In this word meaning a mark, gesture, or notice, the letter 'g' before 'n' is completely silent.",
            "workedSolution": "In 'sign' (pronounced /saɪn/), the consonant letter 'g' is completely silent.",
            "points": 1
          },
          {
            "number": 40,
            "prompt": "When an alternative question like \"Would you prefer cold water, or hot tea?\" is spoken in standard English, what intonation contour pattern is used on the two choices?",
            "options": [
              "Falling on 'water', and rising on 'tea'",
              "Falling on both 'water' and 'tea'",
              "Rising on 'water', and falling on 'tea'",
              "Rising on both 'water' and 'tea'"
            ],
            "correctAnswer": "Rising on 'water', and falling on 'tea'",
            "hint": "Standard alternative questions in English rise on the first option and fall on the final option.",
            "workedSolution": "In English suprasegmental phonology, an alternative question featuring choices presents a rising pitch contour (↗) on the non-final choice and a falling pitch contour (↘) on the final choice.",
            "points": 1
          }
        ]
      }
    },
    "allQuestions": [
      {
        "number": 1,
        "prompt": "Had the commercial driver obeyed the statutory speed limit, the vehicle ............ off the embankment.",
        "options": [
          "would not skid",
          "would not have skidded",
          "will not have skidded",
          "did not skid"
        ],
        "correctAnswer": "would not have skidded",
        "hint": "Inverted Third Conditional: 'Had the commercial driver obeyed' in the conditional clause requires 'would not have + past participle' in the main clause.",
        "workedSolution": "In a Third Conditional inverted construction, an unfulfilled past condition takes a modal past perfect in the main clause: 'would not have skidded'.",
        "points": 1
      },
      {
        "number": 2,
        "prompt": "The scholarship guidelines stipulated that every candidate ............ an authentic birth certificate.",
        "options": [
          "submits",
          "submitted",
          "submit",
          "should have submitted"
        ],
        "correctAnswer": "submit",
        "hint": "Mandative Subjunctive: Clauses introduced by verbs of requirement or regulation ('stipulated that') take a base bare infinitive without third-person '-s'.",
        "workedSolution": "Following verbs of decreeing, requiring, or stipulating followed by 'that', the mandative subjunctive requires the base verb form: 'stipulated that every candidate submit'.",
        "points": 1
      },
      {
        "number": 3,
        "prompt": "The new academic curriculum, ............ aims at developing practical skills, has been introduced.",
        "options": [
          "who",
          "which",
          "whom",
          "whose"
        ],
        "correctAnswer": "which",
        "hint": "Non-defining relative clause modifying an inanimate noun phrase ('The new academic curriculum').",
        "workedSolution": "In non-defining relative clauses modifying non-human antecedents, standard prescriptive grammar requires 'which': 'curriculum, which aims at...'.",
        "points": 1
      },
      {
        "number": 4,
        "prompt": "A sudden ............ of rain forced the outdoor soccer tournament to pause momentarily.",
        "options": [
          "sheet",
          "torrent",
          "gust",
          "shower"
        ],
        "correctAnswer": "shower",
        "hint": "Identify the standard partitive noun indicating a brief, light to moderate fall of rain.",
        "workedSolution": "In standard English meteorological collocations, a brief fall of rain is partitively termed 'a shower of rain'.",
        "points": 1
      },
      {
        "number": 5,
        "prompt": "The ceremonial parade featured the three ............ swords glittering in the morning sunlight.",
        "options": [
          "commander-in-chief's",
          "commanders'-in-chief",
          "commanders-in-chiefs'",
          "commanders-in-chief's"
        ],
        "correctAnswer": "commanders-in-chief's",
        "hint": "Compound noun plural possessive: Form the plural of the base noun ('commanders-in-chief') and add apostrophe + 's' to the final element.",
        "workedSolution": "The plural form of 'commander-in-chief' is 'commanders-in-chief'. To form the possessive case of a compound noun, add apostrophe + 's' to the end: 'commanders-in-chief's swords'.",
        "points": 1
      },
      {
        "number": 6,
        "prompt": "............ we worry about the delay since the train is already approaching the terminal?",
        "options": [
          "Needs",
          "Need",
          "Do we need",
          "Must we need"
        ],
        "correctAnswer": "Need",
        "hint": "When 'need' functions as a semi-modal auxiliary in questions, it takes a bare infinitive without 'to' and does not take 'do'.",
        "workedSolution": "As a modal auxiliary in questions, 'Need' precedes the subject without auxiliary 'do': 'Need we worry...?'.",
        "points": 1
      },
      {
        "number": 7,
        "prompt": "The craftsmanship of our local joiners is undeniably superior ............ imported fiberboard furniture.",
        "options": [
          "than",
          "from",
          "against",
          "to"
        ],
        "correctAnswer": "to",
        "hint": "Comparative adjectives of Latin origin (superior, inferior, senior, junior) strictly collocate with 'to', never 'than'.",
        "workedSolution": "Latin comparative adjectives like 'superior' take the preposition 'to': 'superior to imported furniture'.",
        "points": 1
      },
      {
        "number": 8,
        "prompt": "Either the senior prefect or his assistants ............ responsible for organizing the library books yesterday.",
        "options": [
          "was",
          "is",
          "are",
          "were"
        ],
        "correctAnswer": "were",
        "hint": "Proximity concord with 'either... or': The verb agrees in number with the nearer plural subject ('his assistants') in the past tense.",
        "workedSolution": "When subjects are linked by 'either... or', the verb agrees with the closer subject ('his assistants', plural). In the past tense, the correct verb is 'were'.",
        "points": 1
      },
      {
        "number": 9,
        "prompt": "Active: \"The headmaster made the recalcitrant student sweep the assembly hall.\"\nPassive: \"The recalcitrant student was made ............ the assembly hall by the headmaster.\"",
        "options": [
          "sweep",
          "swept",
          "sweeping",
          "to sweep"
        ],
        "correctAnswer": "to sweep",
        "hint": "Causative verb 'make': In the active voice it takes a bare infinitive, but in the passive voice it requires a full to-infinitive.",
        "workedSolution": "In passive voice transformations of causative 'make', the verb takes a full to-infinitive: 'was made to sweep'.",
        "points": 1
      },
      {
        "number": 10,
        "prompt": "The defaulting shopkeeper admitted ............ the missing consignment from the depot.",
        "options": [
          "stealing",
          "steal",
          "to steal",
          "having stolen of"
        ],
        "correctAnswer": "stealing",
        "hint": "The catenative verb 'admit' takes a gerund complement (verb-ing).",
        "workedSolution": "In standard English syntax, the verb 'admit' requires a gerund complement: 'admitted stealing the consignment'.",
        "points": 1
      },
      {
        "number": 11,
        "prompt": "Nowhere in the entire district ............ such dedicated community volunteerism.",
        "options": [
          "can one find",
          "one can find",
          "one could find",
          "did one found"
        ],
        "correctAnswer": "can one find",
        "hint": "Fronted negative adverbial of place ('Nowhere') triggers subject-auxiliary inversion.",
        "workedSolution": "When a restrictive or negative adverbial ('Nowhere') begins a sentence, standard English requires subject-auxiliary inversion: 'can one find'.",
        "points": 1
      },
      {
        "number": 12,
        "prompt": "The visiting physician is a trusted childhood companion of ............",
        "options": [
          "hers",
          "her",
          "she",
          "herself"
        ],
        "correctAnswer": "hers",
        "hint": "Double possessive construction: 'a [noun] of' requires an absolute possessive pronoun.",
        "workedSolution": "The double possessive construction ('a companion of...') requires the independent possessive pronoun 'hers': 'a companion of hers'.",
        "points": 1
      },
      {
        "number": 13,
        "prompt": "Nobody in the assembly hall complained about the ventilation, ............ they?",
        "options": [
          "didn't",
          "was",
          "did",
          "weren't"
        ],
        "correctAnswer": "did",
        "hint": "The indefinite pronoun 'Nobody' carries negative polarity and is referred to by plural pronoun 'they' with an affirmative question tag.",
        "workedSolution": "'Nobody' is semantically negative and is referenced by plural pronoun 'they'. The matching question tag must have affirmative polarity in the simple past: 'did they?'.",
        "points": 1
      },
      {
        "number": 14,
        "prompt": "The archaeologists uncovered an ............ monument near the ancient riverbank.",
        "options": [
          "triangular ancient stone",
          "stone ancient triangular",
          "ancient triangular stone",
          "ancient stone triangular"
        ],
        "correctAnswer": "ancient triangular stone",
        "hint": "Cumulative adjective ordering: Age ('ancient') precedes Shape ('triangular') which precedes Material ('stone') before the head noun.",
        "workedSolution": "Standard English cumulative adjective ordering places age ('ancient') before shape ('triangular') followed by material origin ('stone'): 'ancient triangular stone monument'.",
        "points": 1
      },
      {
        "number": 15,
        "prompt": "The commission of inquiry completely absolved the security guard ............ all complicity in the theft.",
        "options": [
          "of",
          "with",
          "against",
          "from"
        ],
        "correctAnswer": "from",
        "hint": "Identify the dependent preposition that regularly collocates with the verb 'absolved' when releasing someone from blame or guilt.",
        "workedSolution": "In standard English legal collocations, an accused individual is 'absolved from' blame, liability, or guilt: 'absolved from all complicity'.",
        "points": 1
      },
      {
        "number": 16,
        "prompt": "The forensic auditor scrutinized the financial ledgers for hours.\nChoose the word nearest in meaning to 'scrutinized'.",
        "options": [
          "collected",
          "copied",
          "examined",
          "arranged"
        ],
        "correctAnswer": "examined",
        "hint": "Examined or inspected closely and thoroughly.",
        "workedSolution": "'Scrutinized' means examined closely and thoroughly; 'examined' is its direct synonym.",
        "points": 1
      },
      {
        "number": 17,
        "prompt": "The traditional elders maintained a cordial relationship with the visiting delegates.\nChoose the word nearest in meaning to 'cordial'.",
        "options": [
          "friendly",
          "formal",
          "cautious",
          "strict"
        ],
        "correctAnswer": "friendly",
        "hint": "Warm and friendly; pleasant and polite.",
        "workedSolution": "'Cordial' means warm, courteous, and 'friendly'; 'friendly' is its exact equivalent.",
        "points": 1
      },
      {
        "number": 18,
        "prompt": "The displaced farming community proved remarkably resilient in the face of disaster.\nChoose the word nearest in meaning to 'resilient'.",
        "options": [
          "fearful",
          "stubborn",
          "restless",
          "tough"
        ],
        "correctAnswer": "tough",
        "hint": "Able to withstand or recover quickly from difficult conditions; hardy or tough.",
        "workedSolution": "'Resilient' means capable of enduring hardship and recovering quickly; 'tough' is its closest synonym.",
        "points": 1
      },
      {
        "number": 19,
        "prompt": "The science tutor presented a lucid explanation of electromagnetic induction.\nChoose the word nearest in meaning to 'lucid'.",
        "options": [
          "simple",
          "brief",
          "clear",
          "loud"
        ],
        "correctAnswer": "clear",
        "hint": "Expressed clearly; easy to understand; transparent.",
        "workedSolution": "'Lucid' means expressed with clarity and easy to comprehend; 'clear' is its direct synonym.",
        "points": 1
      },
      {
        "number": 20,
        "prompt": "The indolent apprentice was cautioned repeatedly for neglecting his daily duties.\nChoose the word nearest in meaning to 'indolent'.",
        "options": [
          "lazy",
          "clumsy",
          "disobedient",
          "arrogant"
        ],
        "correctAnswer": "lazy",
        "hint": "Wanting to avoid activity or exertion; lazy.",
        "workedSolution": "'Indolent' means habitually inactive or idle; 'lazy' is its direct synonym.",
        "points": 1
      },
      {
        "number": 21,
        "prompt": "By investing his entire life savings in a single unproven venture, Kwesi put all his eggs in one basket. This means Kwesi ............",
        "options": [
          "purchased a poultry farm",
          "risked everything on a single venture",
          "diversified his commercial assets",
          "wasted his savings carelessly"
        ],
        "correctAnswer": "risked everything on a single venture",
        "hint": "To risk all of one's resources or hopes on a single venture or course of action.",
        "workedSolution": "The idiom 'to put all one's eggs in one basket' means to stake all of one's fortunes on a single enterprise, risking total ruin if it fails.",
        "points": 1
      },
      {
        "number": 22,
        "prompt": "The witness was beating around the bush during cross-examination. This means the witness was ............",
        "options": [
          "avoiding addressing the main topic directly",
          "walking through the countryside",
          "insulting the defense counsel",
          "weeping before the court"
        ],
        "correctAnswer": "avoiding addressing the main topic directly",
        "hint": "To discuss a matter without coming directly to the central point; procrastinating.",
        "workedSolution": "The idiom 'to beat around the bush' means to talk about unnecessary details in order to avoid answering directly or addressing the main point.",
        "points": 1
      },
      {
        "number": 23,
        "prompt": "Procuring genuine spare parts for that vintage tractor cost an arm and a leg. This means the parts were ............",
        "options": [
          "extremely expensive",
          "physically dangerous",
          "unavailable locally",
          "poorly manufactured"
        ],
        "correctAnswer": "extremely expensive",
        "hint": "Very expensive; requiring an exorbitant amount of money.",
        "workedSolution": "The idiom 'to cost an arm and a leg' means to be exorbitantly or extremely expensive.",
        "points": 1
      },
      {
        "number": 24,
        "prompt": "By carefully reading between the lines of the minister's address, the reporter discerned the truth. This means the reporter ............",
        "options": [
          "understood the hidden or implied meaning",
          "read through the text quickly",
          "corrected the typographical errors",
          "criticized the formal grammar"
        ],
        "correctAnswer": "understood the hidden or implied meaning",
        "hint": "To find hidden meaning in something; discern what is implied rather than stated openly.",
        "workedSolution": "The idiom 'to read between the lines' means to perceive the underlying, unspoken, or hidden meaning behind explicit statements.",
        "points": 1
      },
      {
        "number": 25,
        "prompt": "The detective resolved to leave no stone unturned in tracing the abducted infant. This means the detective resolved to ............",
        "options": [
          "make every possible effort to achieve the objective",
          "excavate the riverbank",
          "seek assistance from village elders",
          "abandon the investigation"
        ],
        "correctAnswer": "make every possible effort to achieve the objective",
        "hint": "To try every possible course of action in order to achieve something.",
        "workedSolution": "The idiom 'to leave no stone unturned' means to utilize every available resource and make every possible effort to accomplish an aim.",
        "points": 1
      },
      {
        "number": 26,
        "prompt": "During the prolonged drought, food supplies were scarce, but after the harvest they became ...... .\nChoose the word most nearly opposite in meaning to 'scarce'.",
        "options": [
          "fresh",
          "expensive",
          "plentiful",
          "wholesome"
        ],
        "correctAnswer": "plentiful",
        "hint": "'Scarce' means in short supply; rare. What word denotes existing in copious, abundant supply?",
        "workedSolution": "'Scarce' means insufficient or rare. Its direct quantitative antonym is 'plentiful' (abundant).",
        "points": 1
      },
      {
        "number": 27,
        "prompt": "While the junior magistrate was remarkably lenient, the appellate judge was exceptionally ...... .\nChoose the word most nearly opposite in meaning to 'lenient'.",
        "options": [
          "arrogant",
          "unfair",
          "severe",
          "impatient"
        ],
        "correctAnswer": "severe",
        "hint": "'Lenient' means tolerant, mild, or merciful in discipline. What word denotes harsh, strict, and unsparing?",
        "workedSolution": "'Lenient' means merciful or mild. Its direct judicial and disciplinary antonym is 'severe' (or strict/harsh).",
        "points": 1
      },
      {
        "number": 28,
        "prompt": "The primary banner was conspicuous at the entrance, while the warning notice was completely ...... .\nChoose the word most nearly opposite in meaning to 'conspicuous'.",
        "options": [
          "tattered",
          "small",
          "illegible",
          "hidden"
        ],
        "correctAnswer": "hidden",
        "hint": "'Conspicuous' means clearly visible; standing out. What word denotes concealed or kept out of sight?",
        "workedSolution": "'Conspicuous' means clearly noticeable and visible. Its direct visual antonym is 'hidden' (concealed or inconspicuous).",
        "points": 1
      },
      {
        "number": 29,
        "prompt": "Our grandmother maintained a frugal kitchen, whereas her visiting relatives were remarkably ...... .\nChoose the word most nearly opposite in meaning to 'frugal'.",
        "options": [
          "greedy",
          "lavish",
          "wealthy",
          "careless"
        ],
        "correctAnswer": "lavish",
        "hint": "'Frugal' means economical and sparing with resources. What word denotes profuse, extravagant, and generous to excess?",
        "workedSolution": "'Frugal' means economical and thrifty. Its direct financial and domestic antonym is 'lavish' (extravagant and spendthrift).",
        "points": 1
      },
      {
        "number": 30,
        "prompt": "The turbulent waters of the ocean surf contrast sharply with the ...... waters of the sheltered lagoon.\nChoose the word most nearly opposite in meaning to 'turbulent'.",
        "options": [
          "deep",
          "calm",
          "clean",
          "narrow"
        ],
        "correctAnswer": "calm",
        "hint": "'Turbulent' means characterized by violent motion or agitation. What word denotes serene, quiet, and without agitation?",
        "workedSolution": "'Turbulent' means wildly agitated or stormy. Its direct physical antonym describing water is 'calm' (or tranquil).",
        "points": 1
      },
      {
        "number": 31,
        "prompt": "Cloze Passage: \"The commercial fishing crew prepared their mechanized deep-sea ---31--- for a three-week expedition into international waters.\"\nChoose the most suitable word:",
        "options": [
          "trawler",
          "canoe",
          "ferry",
          "barge"
        ],
        "correctAnswer": "trawler",
        "hint": "A large commercial fishing vessel designed to operate by dragging a net through the water is a trawler.",
        "workedSolution": "In marine fisheries terminology, an industrial ocean-going fishing boat equipped with nets is a 'trawler'.",
        "points": 1
      },
      {
        "number": 32,
        "prompt": "Cloze Passage: \"Before dawn, the vessel steered away from the sheltered quay inside the municipal ---32--- and headed out to sea.\"\nChoose the most suitable word:",
        "options": [
          "beach",
          "harbour",
          "shore",
          "estuary"
        ],
        "correctAnswer": "harbour",
        "hint": "A sheltered body of water where ships, boats, and barges can be docked or anchored safely is a harbour.",
        "workedSolution": "The formal maritime term for a safe, sheltered port facility for ships is a 'harbour'.",
        "points": 1
      },
      {
        "number": 33,
        "prompt": "Cloze Passage: \"The experienced helmsman ---33--- the vessel through the perilous rocky channel using radar and nautical charts.\"\nChoose the most suitable word:",
        "options": [
          "pushed",
          "guided",
          "navigated",
          "drove"
        ],
        "correctAnswer": "navigated",
        "hint": "To plan, direct, and steer the course of a ship or vehicle using marine instruments is to navigate.",
        "workedSolution": "The standard maritime technical verb for steering and directing a vessel across water is 'navigated'.",
        "points": 1
      },
      {
        "number": 34,
        "prompt": "Cloze Passage: \"Using modern sonar fish-finders, the captain located vast ---34--- of tuna moving along the continental shelf.\"\nChoose the most suitable word:",
        "options": [
          "flocks",
          "shoals",
          "packs",
          "crowds"
        ],
        "correctAnswer": "shoals",
        "hint": "A large number of fish swimming together is termed a shoal (or school).",
        "workedSolution": "In marine biological and fishing register, a large collective gathering of fish is a 'shoal' of fish.",
        "points": 1
      },
      {
        "number": 35,
        "prompt": "Cloze Passage: \"Having hauled thirty metric tons of catch into the refrigerated holds, the crew returned to port and securely ---35--- the ship.\"\nChoose the most suitable word:",
        "options": [
          "tied",
          "stopped",
          "parked",
          "anchored"
        ],
        "correctAnswer": "anchored",
        "hint": "To moor or secure a ship firmly to the seabed using a heavy metal device is to anchor.",
        "workedSolution": "The formal nautical term for securing a vessel in position in the water is 'anchored'.",
        "points": 1
      },
      {
        "number": 36,
        "prompt": "Choose the word that contains the identical voiceless velar plosive consonant sound as the underlined sound in:\n\"The apprentice suffered from a sharp **stoma<u>ch</u>** ache.\"",
        "options": [
          "church",
          "machine",
          "monarch",
          "charity"
        ],
        "correctAnswer": "monarch",
        "hint": "The digraph 'ch' in 'stomach' produces the voiceless velar plosive /k/. 'Monarch' (/ˈmɒn.ək/) ends with the identical /k/ sound.",
        "workedSolution": "The final sound in 'stomach' is /k/. 'Monarch' terminates in the identical /k/ sound, unlike 'church' (/tʃ/), 'machine' (/ʃ/), and 'charity' (/tʃ/).",
        "points": 1
      },
      {
        "number": 37,
        "prompt": "Choose the word that contains the identical long front vowel sound as the underlined vowel in:\n\"The ferry berthed alongside the concrete **q<u>uay</u>**.\"",
        "options": [
          "play",
          "scene",
          "tray",
          "pay"
        ],
        "correctAnswer": "scene",
        "hint": "'Quay' is pronounced /kiː/ with the long vowel /iː/. 'Scene' (/siːn/) contains the identical long vowel /iː/.",
        "workedSolution": "The word 'quay' is pronounced /kiː/. Among the options, 'scene' (/siːn/) contains the identical /iː/ monophthong, whereas 'play', 'tray', and 'pay' contain the diphthong /eɪ/.",
        "points": 1
      },
      {
        "number": 38,
        "prompt": "Choose the word that shares the identical final consonant cluster sound as:\n\"The historian wrote a treatise on ancient **des<u>pots</u>**.\"",
        "options": [
          "cliffs",
          "roads",
          "paths",
          "tents"
        ],
        "correctAnswer": "tents",
        "hint": "'Despots' ends in the voiceless plosive-alveolar cluster /ts/. 'Tents' (/tents/) ends in the identical alveolar cluster /ts/.",
        "workedSolution": "'Despots' terminates in the voiceless consonant cluster /ts/. 'Tents' shares the identical /ts/ cluster ending.",
        "points": 1
      },
      {
        "number": 39,
        "prompt": "Which of the following words contains a SILENT consonant letter that is not sounded in standard pronunciation?",
        "options": [
          "sing",
          "sign",
          "song",
          "ring"
        ],
        "correctAnswer": "sign",
        "hint": "In this word meaning a mark, gesture, or notice, the letter 'g' before 'n' is completely silent.",
        "workedSolution": "In 'sign' (pronounced /saɪn/), the consonant letter 'g' is completely silent.",
        "points": 1
      },
      {
        "number": 40,
        "prompt": "When an alternative question like \"Would you prefer cold water, or hot tea?\" is spoken in standard English, what intonation contour pattern is used on the two choices?",
        "options": [
          "Falling on 'water', and rising on 'tea'",
          "Falling on both 'water' and 'tea'",
          "Rising on 'water', and falling on 'tea'",
          "Rising on both 'water' and 'tea'"
        ],
        "correctAnswer": "Rising on 'water', and falling on 'tea'",
        "hint": "Standard alternative questions in English rise on the first option and fall on the final option.",
        "workedSolution": "In English suprasegmental phonology, an alternative question featuring choices presents a rising pitch contour (↗) on the non-final choice and a falling pitch contour (↘) on the final choice.",
        "points": 1
      }
    ]
  },
  "paper2": {
    "title": "Paper 2: Written Essay, Reading Comprehension, and Literature",
    "durationMinutes": 90,
    "sections": {
      "partA_composition": {
        "title": "Part A: Writing (Composition)",
        "instructions": "Answer one question only from this part. Your composition should be about 250 words long.",
        "questions": [
          {
            "questionNumber": "1",
            "category": "Formal Letter",
            "prompt": "Write a formal letter to your Municipal Chief Executive (MCE), drawing attention to the menace of unregulated commercial advertising billboards erected dangerously near pedestrian crossings and road junctions in your municipality, and proposing at least two practical regulatory measures to avert traffic accidents.",
            "modelAnswer": "Methodist Junior High School\nP. O. Box 54\nBekwai, Ashanti Region\n14th May, 2026\n\nThe Municipal Chief Executive\nBekwai Municipal Assembly\nMunicipal Directorate, Bekwai\n\nDear Sir,\n\nPETITION REGARDING UNREGULATED COMMERCIAL BILLBOARDS ON TRAFFIC CORRIDORS\n\nOn behalf of the youth, pedestrians, and commercial drivers within the Bekwai Municipality, I respectfully submit this petition to draw your urgent attention to the perilous obstruction created by unregulated commercial advertising billboards along our main highway corridors, and to propose practical regulatory measures to protect lives.\n\nOver the past four months, private advertising agencies and local businesses have indiscriminately erected massive steel billboards immediately adjacent to busy intersections, roundabout junctions, and pedestrian zebra crossings. These oversized structures severely obstruct the line of sight for oncoming motorists, preventing drivers from spotting crossing school children and turning vehicles. Furthermore, during recent torrential windstorms, several poorly anchored wooden billboards collapsed directly onto pedestrian walkways, narrowly missing passers-by. If left unchecked, this hazard will cause fatal vehicular collisions.\n\nTo permanently resolve this public safety menace, I suggest, first, that the Municipal Assembly enforce a Comprehensive Billboard Demarcation and Permitting Policy. The assembly's spatial planning and engineering department must establish strict statutory setback standards, prohibiting the erection of commercial billboards within fifty meters of any road curve, junction, or pedestrian crossing.\n\nSecondly, the municipal task force should immediately dismantle and confiscate all unapproved, structurally defective billboards. Heavy punitive fines must be imposed on advertising companies that mount unauthorized signs. Furthermore, advertising permits should mandate regular structural safety inspections, ensuring that billboards are constructed with certified wind-resistant steel frames.\n\nWe count on your prompt leadership to make our roads safe for all citizens.\n\nThank you.\n\nYours faithfully,\n[Signature]\nKwabena Mensah\n(Youth Secretary)"
          },
          {
            "questionNumber": "2",
            "category": "Article for Publication",
            "prompt": "Write an article for publication in a national daily newspaper on the topic: \"The Vital Necessity of Mental Health Education and Counseling Support Services in Ghanaian Basic Schools.\"",
            "modelAnswer": "NURTURING YOUNG MINDS: THE URGENT NEED FOR MENTAL HEALTH SERVICES IN BASIC SCHOOLS\nBy Samuel K. Boateng, Begoro\n\nIn Ghana's basic education discourse, national attention is overwhelmingly directed toward textbook supplies, classroom infrastructure, and academic examination performance. While cognitive learning is crucial, an invisible, deeply agonizing crisis continues to undermine thousands of adolescent learners across our country: the acute deficit of professional mental health education and psychological counseling support in basic schools.\n\nThe foremost reality confronting contemporary students is the crushing weight of adolescent emotional stress and social anxiety. Young learners navigate intense pressures, including extreme academic expectations, broken homes, domestic violence, bullying, and the toxic influence of peer comparison on digital social media networks. Because traditional society frequently trivializes adolescent distress as ordinary stubbornness or spiritual attacks, troubled pupils bottle up their depression and grief. Deprived of a safe, confidential environment to express their trauma, many descend into chronic truancy, self-harm, violent aggression, and teenage pregnancy, truncating their academic aspirations.\n\nSecondly, unresolved emotional trauma directly impairs cognitive concentration and scholastic learning. A child afflicted with severe anxiety or post-traumatic stress cannot absorb mathematical formulas or understand science lessons. When schools lack guidance coordinators, struggling students are dismissed as unintelligent or lazy, leading to unnecessary dropouts. Introducing certified guidance and counseling coordinators in every basic school cluster will provide early psychological screening, emotional therapy, and suicide prevention.\n\nFurthermore, integrating mental health awareness into the national basic curriculum will dismantle societal stigmatization, teaching children that seeking emotional help is a sign of wisdom, not weakness.\n\nA nation that educates the brain while neglecting the emotional wellness of the heart prepares a fragile future; our basic schools must prioritize mental health today."
          },
          {
            "questionNumber": "3",
            "category": "Narrative Moral Story",
            "prompt": "Write an engaging, realistic story that illustrates the traditional proverb: \"Every cloud has a silver lining.\"",
            "modelAnswer": "EVERY CLOUD HAS A SILVER LINING\n\nDuring our final academic term in junior high school, my childhood desk-mate, Kofi, was the undisputed star sprinter of our district. He had spent three rigorous years training for the National Basic Schools 100-Meter Athletics Championship, harboring the cherished dream of winning a secondary school athletic scholarship to realize his ambition of becoming a sports physician.\n\nTragedy struck barely a week before the national championship. While assisting his mother to haul a basin of cassava on their farm, Kofi slipped on a wet mossy log, suffering a severe triple compound fracture of his right ankle. The municipal orthopedic surgeon cast his leg in heavy plaster, declaring with finality that Kofi could not walk without crutches for six months. Devastated and heartbroken, Kofi broke down in bitter tears, believing his future was completely extinguished. I reminded him gently of our grandmother's favorite saying, \"Every cloud has a silver lining,\" but he turned his face to the wall in deep despair.\n\nUnable to run, Kofi was appointed as the school team's student analyst and tactical coordinator. Sitting on the sidelines with his crutches, he focused his sharp mind on studying sprint biomechanics, pacing techniques, and baton exchange coordination. Utilizing a donated tablet computer, he recorded training sessions, identifying technical flaws in our relay squad's running posture and designing optimized sprint drills.\n\nUnder Kofi's brilliant technical coaching, our underdog 4x100-meter relay team set a breathtaking new national record at the championship! During the awards ceremony, the National Sports Authority was so impressed by Kofi's tactical data analysis that they awarded him a full STEM scholarship to study Sports Science and Biomechanics at the University of Ghana.\n\nWeeping with joy as he received his scholarship letter, Kofi embraced me warmly, realizing that his broken bone had opened the door to his true destiny: Truly, every cloud has a silver lining."
          }
        ]
      },
      "partB_comprehension": {
        "title": "Part B: Reading Comprehension",
        "instructions": "Read the following passage carefully and answer all the questions that follow in your own words as far as possible.",
        "passageText": "In contemporary public discourse on economic modernization, tourism is universally celebrated as a non-polluting \"smokeless industry\" capable of generating foreign exchange, stimulating infrastructural development, and creating millions of service jobs. Developing nations across tropical regions aggressively market their pristine sandy beaches, historical castles, and exotic game reserves to affluent foreign travelers, viewing tourism as a golden shortcut to national prosperity.\n\nHowever, an objective socio-economic and ecological appraisal reveals that mass tourism represents a precarious double-edged sword. When left unregulated by rigorous statutory guidelines, the rapid expansion of commercial tourism can extract a devastating toll on indigenous cultures and fragile ecological habitats.\n\nThe most insidious consequence of uncontrolled tourism is the commodification and degradation of indigenous cultural heritage. Traditional sacred festivals, ritual dances, and spiritual ceremonies—which originally possessed deep religious and cosmological significance for local communities—are frequently degraded into cheap, superficial entertainment spectacles packaged for vacationing tourists. Sacred shrines are commercialized, and pristine cultural taboos are violated by visitors who display open disrespect for local customs. Furthermore, the massive influx of affluent tourists often sparks acute cultural contamination among local youth, encouraging substance abuse, juvenile prostitution, and the erosion of indigenous linguistic identity.\n\nEcologically, the footprint of mass tourism is often disastrous. The construction of sprawling luxury beach resorts, golf courses, and access highways frequently leads to the ruthless destruction of vital coastal mangrove wetlands and tropical forests. Luxury hotels consume astronomical volumes of fresh water and generate mountains of non-biodegradable plastic waste, while municipal lagoons and coral reefs are poisoned by raw sewage discharges. Furthermore, in many developing enclaves, the promised economic benefits fail to materialize for the local populace; luxury hotels are owned by foreign multinational conglomerates, meaning that over seventy percent of tourism revenues are repatriated overseas, leaving host communities to bear the social and ecological costs.\n\nEnvironmental economists conclude that the salvation of the industry lies in ecotourism—a sustainable model that prioritizes environmental conservation, respects local cultural autonomy, and ensures that financial revenues remain directly within community-owned enterprises.",
        "questions": [
          {
            "subQuestion": "(a)",
            "question": "State two economic benefits of tourism mentioned in the opening paragraph of the passage.",
            "answer": "1. Generating foreign exchange.\n2. Stimulating infrastructural development (or creating service jobs)."
          },
          {
            "subQuestion": "(b)",
            "question": "How does uncontrolled tourism lead to the degradation of indigenous cultural heritage?",
            "answer": "Traditional sacred festivals, ritual dances, and spiritual ceremonies are turned into cheap, commercialized entertainment spectacles for tourists, and local customs are disrespected."
          },
          {
            "subQuestion": "(c)",
            "question": "Mention two specific ecological problems caused by luxury hotel resorts in coastal areas.",
            "answer": "1. Destruction of vital coastal mangrove wetlands and forests.\n2. Poisoning of lagoons and coral reefs with raw sewage (or consumption of huge amounts of water and generation of plastic waste)."
          },
          {
            "subQuestion": "(d)",
            "question": "Why do local communities in many developing regions fail to benefit financially from mass tourism?",
            "answer": "Because luxury hotels are owned by foreign multinational conglomerates that send over seventy percent of the tourism revenues overseas."
          },
          {
            "subQuestion": "(e)",
            "question": "Explain the meaning of the following expressions as used in the passage:\nI. ... smokeless industry;\nII. ... double-edged sword;\nIII. ... repatriated overseas.",
            "answer": "I. 'smokeless industry' means an economic enterprise or trade that generates wealth without the industrial factory smoke and physical air pollution associated with manufacturing.\nII. 'double-edged sword' means a situation, choice, or development that has both favorable advantages and dangerous, unfavorable consequences simultaneously.\nIII. 'repatriated overseas' means sent back, transferred, or returned to one's own foreign country."
          },
          {
            "subQuestion": "(f)",
            "question": "For each of the following words, give another word or phrase that means the same and can fit into the passage:\nI. appraisal;\nII. commodification;\nIII. influx;\nIV. autonomy.",
            "answer": "I. appraisal: evaluation, assessment, analysis, review.\nII. commodification: commercialization, turning into merchandise, marketing.\nIII. influx: arrival, inflow, rush, stream, surge.\nIV. autonomy: self-determination, independence, sovereignty, freedom."
          },
          {
            "subQuestion": "(g)",
            "question": "In two concise sentences of NOT MORE THAN EIGHT WORDS EACH, summarize the two major negative impacts of uncontrolled tourism discussed in the passage.",
            "answer": "1. Tourism degrades sacred local cultural traditions.\n2. Resort construction destroys fragile coastal environments."
          }
        ]
      },
      "partC_literature": {
        "title": "Part C: Literature in English (The Cockcrow Anthology)",
        "instructions": "Answer all questions in this part based on the prescribed texts from Sackey J.A. and Darmani L. (comp.): The Cockcrow.",
        "questions": [
          {
            "sectionTitle": "CHARLES DICKENS: Oliver Twist",
            "contextExtract": "\"Crackit threw Oliver over his shoulder and ran. 'The boy's been shot!' screamed Sikes. 'Leave him in the ditch or they'll capture us both!'\"",
            "subItems": [
              {
                "subQuestion": "5(a)",
                "question": "During which criminal operation was Oliver Twist shot and wounded?",
                "answer": "The attempted nighttime burglary of Mrs. Maylie's house at Chertsey."
              },
              {
                "subQuestion": "5(b)",
                "question": "What contrasting moral reactions did Bill Sikes and the Maylie household demonstrate toward the wounded boy?",
                "answer": "Bill Sikes abandoned Oliver callously in a muddy ditch to save his own life, whereas Mrs. Maylie and Rose took Oliver in, nursed him tenderly, and protected him from the police."
              }
            ]
          },
          {
            "sectionTitle": "AMA ATA AIDOO: The Dilemma of a Ghost",
            "contextExtract": "ATO: \"Eulalie, you don't seem to understand. My people expect a grandchild. It is not our custom to postpone childbearing like this!\"\nEULALIE: \"Custom! Custom! That's all I hear in this place! What about our plan, Ato?\"",
            "subItems": [
              {
                "subQuestion": "5(c)",
                "question": "What central conflict between African tradition and Western modernism is exposed in this dialogue?",
                "answer": "The clash between the traditional African expectation of immediate childbearing to sustain lineage versus modern Western family planning/contraception."
              },
              {
                "subQuestion": "5(d)",
                "question": "How does Ato's inability to bridge this cultural communication gap make him a 'ghost'?",
                "answer": "He is paralyzed, culturally alienated, and unable to belong fully either to his ancestral African tradition or to the modern Western culture he learned abroad."
              }
            ]
          },
          {
            "sectionTitle": "KAAKYIRE AKOSOMO NYANTAKYI: Tell My Son to Hold On to His Gun",
            "contextExtract": "\"The darkness of the virgin forest closed around me. The hooting of owls and the crackle of dry twigs underfoot sent shivers down my spine. But I held tightly to my father's gun.\"",
            "subItems": [
              {
                "subQuestion": "5(e)",
                "question": "What atmosphere or mood is vividly established in this descriptive extract?",
                "answer": "A terrifying, suspenseful, tense, and ominous atmosphere."
              },
              {
                "subQuestion": "5(f)",
                "question": "What psychological source of courage enabled Kwame to press forward despite his intense fear?",
                "answer": "His late father's dying words ('Kwame, be courageous!') and the hunting gun symbolizing his paternal heritage."
              }
            ]
          },
          {
            "sectionTitle": "KEN SARO-WIWA: Home Sweet Home",
            "contextExtract": "\"They came in the usual assortment of rags: gowns picked up from the stores of second-hand clothes traders, singlets bearing the words, Oxford University, mildewed blouses.\"",
            "subItems": [
              {
                "subQuestion": "5(g)",
                "question": "What predominant social picture of rural village life in Dakuna is painted in this extract?",
                "answer": "A picture of acute poverty, squalor, economic destitution, and societal neglect."
              },
              {
                "subQuestion": "5(h)",
                "question": "What is ironic about the villagers wearing singlets bearing the words 'Oxford University'?",
                "answer": "It is deeply ironic that illiterate, impoverished rural villagers wear the emblem of one of the world's most elite universities without knowing what it means."
              }
            ]
          },
          {
            "sectionTitle": "KOBENA EYI ACQUAH: A Wreath of Tears",
            "contextExtract": "\"from the garden of memory\nsuddenly blooming as with first rains\nwe weave this wreath\"",
            "subItems": [
              {
                "subQuestion": "5(i)",
                "question": "What literary device is used in the expression: 'the garden of memory'?",
                "answer": "Metaphor."
              },
              {
                "subQuestion": "5(j)",
                "question": "What is the symbolic 'wreath' that the mourners weave for the departed mentor?",
                "answer": "A spiritual wreath composed of cherished memories, tears of grief, and enduring tributes to his noble life."
              }
            ]
          }
        ]
      }
    }
  }
};

async function seedBeceEnglishMock7() {
  console.log("Seeding Isolated BECE English Mock 7 into Firestore...");
  const docRef = db.doc("global_curriculum/jhs/subjects/english/mocks/mock_7");
  await docRef.set(MOCK_7_PAYLOAD, { merge: true });
  console.log("✅ Seeded mock_7");
}

if (require.main === module) {
  seedBeceEnglishMock7()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
