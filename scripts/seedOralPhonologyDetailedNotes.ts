process.env.GCLOUD_PROJECT = 'gamedu-69888475-f5783';
process.env.GOOGLE_CLOUD_PROJECT = 'gamedu-69888475-f5783';
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
    // fallback
  }

  if (!fbAdmin.apps?.length) {
    try {
      fbAdmin.initializeApp({
        credential: fbAdmin.credential.applicationDefault(),
      });
    } catch (e) {}
  }
  return fbAdmin.firestore();
}

const oralPhonologyPayload = {
  topicId: "oral_phonology_sounds",
  subjectId: "english",
  strandId: "strand_1_oral_language",
  strandName: "STRAND 1: ORAL LANGUAGE",
  subStrandTitle: "Speech Sounds, Diphthongs & Stress Patterns",
  topicTitle: "Phonology, Intonation & Stress",
  summary: "Comprehensive NaCCA-aligned curriculum module covering pure vowels (monophthongs), closing/centering diphthongs, consonant contrasts, clusters, silent letters, grammatical noun-verb stress shifts, and intonation contours.",
  gradeLevels: ["B7 (JHS 1)", "B8 (JHS 2)", "B9 (JHS 3)"],
  curriculumIndicators: ["B7.1.1.1", "B8.1.1.1", "B8.1.1.2", "B9.1.1.1", "B9.1.2.1"],

  // -------------------------------------------------------------------------
  // DETAILED NACCA TEACHING & CONCEPT NOTES (B7 - B9)
  // -------------------------------------------------------------------------
  conceptNotes: {
    b7_overview: "Distinguishing voiced vs. voiceless consonants (/θ/ vs. /ð/, /s/ vs. /z/) and short vs. long vowels (/ɪ/ vs. /iː/, /ʊ/ vs. /uː/).",
    b8_progression: "Mastering complex initial and final consonant clusters (/str-/, /-sks/, /-mpts/) and identifying silent letters (debt, subtle, receipt, knight, sword).",
    b9_mastery: "Syllabic stress placement on polysyllabic nouns vs. verbs (RE-cord vs. re-CORD) and terminal intonation contours (falling on declarative statements/Wh-questions; rising on polar Yes/No questions and echo questions).",
    module1_vowel_system: {
      title: "Module 1: The Vowel System (Segmental Phonology)",
      description: "Standard English features 20 distinct vowel phonemes: 12 pure vowels (monophthongs) and 8 gliding vowels (diphthongs).",
      monophthongs: {
        total: 12,
        classification: [
          { phoneme: "/ɪ/", type: "Short", description: "Near-close, near-front unrounded", spelling: ["i", "y"], examples: ["sit", "rhythm", "bid"], minimalPair: "ship /ʃɪp/ vs. sheep /ʃiːp/" },
          { phoneme: "/iː/", type: "Long", description: "Close, front unrounded", spelling: ["ee", "ea", "ie", "ei"], examples: ["meet", "meat", "chief", "receive"], minimalPair: "fit /fɪt/ vs. feet /fiːt/" },
          { phoneme: "/e/", type: "Short", description: "Open-mid, front unrounded", spelling: ["e", "ea"], examples: ["bed", "ten", "bread"], minimalPair: "pen /pen/ vs. pan /pæn/" },
          { phoneme: "/æ/", type: "Short", description: "Open, front unrounded", spelling: ["a"], examples: ["cat", "bat", "lack", "bad"], minimalPair: "bad /bæd/ vs. bard /bɑːd/" },
          { phoneme: "/ɑː/", type: "Long", description: "Open, back unrounded", spelling: ["ar", "al", "a"], examples: ["park", "calm", "father", "palm"], minimalPair: "pack /pæk/ vs. park /pɑːk/" },
          { phoneme: "/ɒ/", type: "Short", description: "Open, back rounded", spelling: ["o", "a"], examples: ["pot", "swan", "wash"], minimalPair: "pot /pɒt/ vs. port /pɔːt/" },
          { phoneme: "/ɔː/", type: "Long", description: "Open-mid, back rounded", spelling: ["or", "aw", "au", "ore"], examples: ["cord", "law", "caught", "court"], minimalPair: "cot /kɒt/ vs. court /kɔːt/" },
          { phoneme: "/ʊ/", type: "Short", description: "Near-close, near-back rounded", spelling: ["u", "oo", "ou"], examples: ["put", "book", "could", "foot"], minimalPair: "pull /pʊl/ vs. pool /puːl/" },
          { phoneme: "/uː/", type: "Long", description: "Close, back rounded", spelling: ["oo", "ew", "ue", "ou"], examples: ["moon", "grew", "blue", "tomb"], minimalPair: "look /lʊk/ vs. Luke /luːk/" },
          { phoneme: "/ʌ/", type: "Short", description: "Open-mid, central-back unrounded", spelling: ["u", "o", "ou"], examples: ["cup", "son", "blood"], minimalPair: "cup /kʌp/ vs. cap /kæp/" },
          { phoneme: "/ɜː/", type: "Long", description: "Mid, central unrounded", spelling: ["ir", "ur", "er", "ear"], examples: ["bird", "burn", "fern", "heard"], minimalPair: "bird /bɜːd/ vs. bed /bed/" },
          { phoneme: "/ə/", type: "Schwa", description: "Mid, central unrounded (neutral/weak)", spelling: ["Unstressed syllables"], examples: ["sofa", "about", "doctor", "banana"], minimalPair: "Unstressed reduction" }
        ]
      },
      diphthongs: {
        total: 8,
        closing: [
          { phoneme: "/eɪ/", glide: "Glides from /e/ to /ɪ/", spelling: ["a", "ai", "ay", "eigh"], examples: ["pain", "rate", "say", "weight", "gauge"] },
          { phoneme: "/aɪ/", glide: "Glides from /a/ to /ɪ/", spelling: ["i", "y", "ie", "igh"], examples: ["time", "bite", "cry", "pie", "high", "climb"] },
          { phoneme: "/ɔɪ/", glide: "Glides from /ɔː/ to /ɪ/", spelling: ["oi", "oy"], examples: ["boy", "coin", "boil", "voice", "destroy"] },
          { phoneme: "/əʊ/", glide: "Glides from /ə/ to /ʊ/", spelling: ["o", "oa", "ow", "ou"], examples: ["go", "home", "road", "soul", "though"] },
          { phoneme: "/aʊ/", glide: "Glides from /a/ to /ʊ/", spelling: ["ou", "ow"], examples: ["now", "sound", "plough", "bough", "house"] }
        ],
        centering: [
          { phoneme: "/ɪə/", glide: "Glides from /ɪ/ to /ə/", spelling: ["ear", "eer", "ere", "ier"], examples: ["fear", "hear", "peer", "pier", "clear"] },
          { phoneme: "/eə/", glide: "Glides from /e/ to /ə/", spelling: ["air", "are", "ear", "eir"], examples: ["pair", "pear", "stare", "hair", "bear", "there"] },
          { phoneme: "/ʊə/", glide: "Glides from /ʊ/ to /ə/", spelling: ["oor", "ure", "our"], examples: ["tour", "poor", "cure", "sure"] }
        ]
      }
    },

    module2_consonant_system: {
      title: "Module 2: Consonants, Clusters & Silent Letters (Combinatory Phonology)",
      diagnosticContrasts: [
        {
          contrast: "/θ/ vs. /t/",
          phonemes: "Voiceless dental fricative vs. Voiceless alveolar plosive",
          guidance: "Tongue tip placed between teeth releasing continuous air (/θ/), not tapped on alveolar ridge (/t/).",
          pairs: ["thought /θɔːt/ vs. taught /tɔːt/", "thick /θɪk/ vs. tick /tɪk/", "theme /θiːm/ vs. team /tiːm/"]
        },
        {
          contrast: "/ð/ vs. /d/",
          phonemes: "Voiced dental fricative vs. Voiced alveolar plosive",
          guidance: "Vocal cords vibrate while tongue tip touches upper front teeth (/ð/).",
          pairs: ["then /ðen/ vs. den /den/", "breathe /briːð/ vs. breed /briːd/", "clothe /kləʊð/ vs. cloud /klaʊd/"]
        },
        {
          contrast: "/ʃ/ vs. /tʃ/",
          phonemes: "Voiceless post-alveolar fricative vs. Voiceless palato-alveolar affricate",
          guidance: "/ʃ/ is continuous friction; /tʃ/ begins with complete plosive stoppage followed by sharp friction.",
          pairs: ["ship /ʃɪp/ vs. chip /tʃɪp/", "wash /wɒʃ/ vs. watch /wɒtʃ/", "share /ʃeər/ vs. chair /tʃeər/"]
        },
        {
          contrast: "/dʒ/ vs. /ʒ/",
          phonemes: "Voiced post-alveolar affricate vs. Voiced post-alveolar fricative",
          guidance: "/dʒ/ has an initial stop explosion (judge, soldier); /ʒ/ is pure uninterrupted friction (vision, measure).",
          pairs: ["legion /ˈliː.dʒən/ vs. lesion /ˈliː.ʒən/", "pledge /pledʒ/ vs. pleasure /ˈpleʒ.ər/"]
        }
      ],
      consonantClusters: {
        initialThree: [
          { cluster: "/str-/", examples: ["strike", "straight", "street", "strive", "strand"] },
          { cluster: "/spr-/", examples: ["spray", "spring", "spread", "sprout"] },
          { cluster: "/skr-/", examples: ["scream", "scratch", "script", "scroll"] },
          { cluster: "/spl-/", examples: ["splash", "split", "splendid"] }
        ],
        finalComplex: [
          { cluster: "/-sks/", examples: ["desks", "masks", "flasks", "tasks"] },
          { cluster: "/-sts/", examples: ["tests", "posts", "lists", "masts"] },
          { cluster: "/-pts/", examples: ["accepts", "intercepts"] },
          { cluster: "/-mpts/", examples: ["attempts", "exempts", "prompts"] },
          { cluster: "/-ksts/", examples: ["texts", "contexts"] }
        ]
      },
      silentLetters: [
        { letter: "b", rules: "Silent after 'm' at word/syllable end; silent before 't'", examples: ["comb", "bomb", "tomb", "climb", "lamb", "debt", "doubt", "subtle"] },
        { letter: "k", rules: "Silent initially before 'n'", examples: ["knight", "knee", "knot", "knife", "knack", "know"] },
        { letter: "w", rules: "Silent initially before 'r'; silent in historical words", examples: ["write", "wrist", "wrap", "wrong", "sword", "two"] },
        { letter: "l", rules: "Silent before 'm', 'k', 'd', 'f'", examples: ["calm", "palm", "chalk", "talk", "would", "could", "half", "calf"] },
        { letter: "p", rules: "Silent initially before 's', 't', 'n'; silent in 'receipt'", examples: ["psalm", "receipt", "psychology", "pneumonia", "corps"] },
        { letter: "g", rules: "Silent before 'n'", examples: ["sign", "reign", "foreign", "gnaw", "design", "campaign"] },
        { letter: "t", rules: "Silent in '-sten' and '-stle' clusters", examples: ["listen", "fasten", "castle", "whistle", "wrestle", "soften"] },
        { letter: "c", rules: "Silent in 'indict'", examples: ["indict", "indictment"] }
      ]
    },

    module3_suprasegmental_stress: {
      title: "Module 3: Word Stress & Syllable Architecture (Suprasegmental Phonology)",
      phoneticProperties: [
        "Higher fundamental frequency (pitch)",
        "Longer duration (held longer in time)",
        "Greater acoustic loudness (intensity)",
        "Fully articulated, unreduced vowel nucleus"
      ],
      nounVerbStressShifts: [
        { word: "RECORD", nounForm: "RE-cord /ˈrek.ɔːd/ (Stress on 1st syllable)", verbForm: "re-CORD /rɪˈkɔːd/ (Stress on 2nd syllable)" },
        { word: "PRESENT", nounForm: "PRE-sent /ˈprez.ənt/ (Stress on 1st syllable)", verbForm: "pre-SENT /prɪˈzent/ (Stress on 2nd syllable)" },
        { word: "PROTEST", nounForm: "PRO-test /ˈprəʊ.test/ (Stress on 1st syllable)", verbForm: "pro-TEST /prəˈtest/ (Stress on 2nd syllable)" },
        { word: "REBEL", nounForm: "RE-bel /ˈreb.əl/ (Stress on 1st syllable)", verbForm: "re-BEL /rɪˈbel/ (Stress on 2nd syllable)" },
        { word: "EXPORT", nounForm: "EX-port /ˈek.spɔːt/ (Stress on 1st syllable)", verbForm: "ex-PORT /ɪkˈspɔːt/ (Stress on 2nd syllable)" },
        { word: "CONDUCT", nounForm: "CON-duct /ˈkɒn.dʌkt/ (Stress on 1st syllable)", verbForm: "con-DUCT /kənˈdʌkt/ (Stress on 2nd syllable)" },
        { word: "IMPORT", nounForm: "IM-port /ˈɪm.pɔːt/ (Stress on 1st syllable)", verbForm: "im-PORT /ɪmˈpɔːt/ (Stress on 2nd syllable)" }
      ],
      suffixStressRules: [
        { type: "Stress-Attracting", rule: "The suffix itself carries primary stress", suffixes: ["-ee (refu'gee, trai'nee)", "-eer (volun'teer, engi'neer)"] },
        { type: "Stress-Neutral", rule: "Base word retains original root stress", suffixes: ["-ful ('careful)", "-less ('hopeless)", "-ly ('quickly)", "-ness ('kindness)"] },
        { type: "Penultimate Shifter", rule: "Shifts stress to the syllable immediately preceding suffix", suffixes: ["-ic (e'lectric, dra'matic)", "-tion (edu'cation, prepa'ration)", "-sion (de'cision, ex'pansion)"] },
        { type: "Antepenultimate Shifter", rule: "Shifts stress three syllables from the end", suffixes: ["-ity (curi'osity, a'bility)", "-phy (bi'ography, pho'tography)"] }
      ]
    },

    module4_intonation_contours: {
      title: "Module 4: Grammatical Intonation Contours",
      contours: [
        {
          name: "Falling Intonation (↘)",
          pitchMovement: "Pitch descends from high to low on the nuclear tonic syllable",
          functions: [
            "Declarative statements expressing certainty (The students passed their examinations ↘)",
            "Wh-questions seeking specific information (Where did the clerk file the records? ↘)",
            "Imperative commands and firm instructions (Submit your answer sheets immediately ↘)",
            "Tag questions expecting confirmation or agreement (It is very hot today, isn't it? ↘)"
          ]
        },
        {
          name: "Rising Intonation (↗)",
          pitchMovement: "Pitch ascends from low to high on the nuclear tonic syllable",
          functions: [
            "Polar (Yes/No) questions (Have you finished your homework? ↗)",
            "Non-final items in a list or enumeration (We bought books ↗, pens ↗, and rulers ↘)",
            "Echo questions expressing surprise or disbelief (He failed the test? ↗)",
            "Tag questions expressing genuine doubt or uncertainty (You locked the gate, didn't you? ↗)"
          ]
        },
        {
          name: "Fall-Rise Intonation (↘↗)",
          pitchMovement: "Pitch falls then rises within the same tone unit",
          functions: [
            "Hesitation, reservation, or conditional agreement (I might agree, under certain strict terms ↘↗)",
            "Polite warning or caution (Be careful with those glass test-tubes ↘↗)"
          ]
        }
      ]
    },

    studentSolvingMethodology: {
      title: "Step-by-Step Student Method for Handling Oral Questions",
      soundMatchingPaper1: [
        "Step 1: Isolate the target sound in the prompt word (write out its phonetic transcription).",
        "Step 2: Determine articulatory properties (vowel length, voicing, place of articulation).",
        "Step 3: Pronounce all 4 options sub-vocally to identify their actual phonetic segments.",
        "Step 4: Discard distractor traps (words with identical letters but different sounds).",
        "Step 5: Confirm the match with the exact phonetic symbol."
      ],
      intonationClassification: [
        "Step 1: Identify clause syntax (statement, command, Wh-question, Yes/No question, or tag).",
        "Step 2: Check punctuation and communicative intent (incredulity, finality, inquiry).",
        "Step 3: Apply the rule: Yes/No -> Rise (↗); Wh-question / Statement / Command -> Fall (↘); Uncertain Tag -> Rise (↗); Agreeing Tag -> Fall (↘)."
      ]
    }
  },

  // -------------------------------------------------------------------------
  // GRADUATED PRACTICE LAB ITEMS (B7 LOW -> B8 MEDIUM -> B9 HARD)
  // -------------------------------------------------------------------------
  questions: [
    {
      id: "oral_lab_01_low",
      level: "B7",
      difficulty: "low",
      prompt: "Choose the word that contains the identical vowel sound as the underlined vowel in:\n\"The boy fell into a deep **p<u>oo</u>l**.\"",
      options: ["book", "tomb", "foot", "cook"],
      correctAnswer: "tomb",
      hint: "The underlined vowel in 'pool' is the long back close rounded vowel /uː/.",
      workedSolution: "'Pool' is pronounced /puːl/ with the long monophthong /uː/. Among the options, 'tomb' is pronounced /tuːm/ with the identical long /uː/ vowel sound. 'Book', 'foot', and 'cook' all contain the short vowel /ʊ/.",
      learningCompetency: "B7.1.1.1: Discriminate and articulate pure long vs. short vowels in single-syllable words."
    },
    {
      id: "oral_lab_02_low",
      level: "B7",
      difficulty: "low",
      prompt: "Which of the following words contains the identical voiceless dental fricative consonant sound as the underlined digraph in:\n\"The central **<u>th</u>eme** of the drama was unity.\"",
      options: ["these", "thought", "though", "breathe"],
      correctAnswer: "thought",
      hint: "'Theme' begins with the voiceless dental fricative /θ/. Look for the option where the vocal cords do not vibrate.",
      workedSolution: "'Theme' begins with the voiceless dental fricative /θ/. 'Thought' (/θɔːt/) begins with the identical /θ/ sound. 'These', 'though', and 'breathe' all feature the voiced dental fricative /ð/.",
      learningCompetency: "B7.1.1.1: Distinguish between voiced and voiceless dental fricatives (/θ/ vs. /ð/)."
    },
    {
      id: "oral_lab_03_med",
      level: "B8",
      difficulty: "medium",
      prompt: "Which of the following words contains a SILENT consonant letter that is not sounded in standard English speech?",
      options: ["timber", "member", "subtle", "slumber"],
      correctAnswer: "subtle",
      hint: "In this word meaning delicate, understated, or clever, the letter 'b' precedes 't' and is unvoiced.",
      workedSolution: "In 'subtle' (pronounced /ˈsʌt.əl/), the consonant letter 'b' is completely silent. In 'timber', 'member', and 'slumber', the /b/ plosive is articulated following the nasal /m/.",
      learningCompetency: "B8.1.1.2: Recognize and pronounce words containing silent consonants accurately."
    },
    {
      id: "oral_lab_04_med",
      level: "B8",
      difficulty: "medium",
      prompt: "Choose the word that shares the identical final consonant cluster sound as:\n\"The students arranged their wooden **de<u>sks</u>**.\"",
      options: ["masks", "masts", "clasps", "paths"],
      correctAnswer: "masks",
      hint: "'Desks' terminates in the voiceless velar-alveolar consonant cluster /sks/.",
      workedSolution: "'Desks' ends with the voiceless consonant cluster /sks/. 'Masks' (/mɑːsks/) terminates in the exact identical /sks/ cluster. 'Masts' ends in /sts/, 'clasps' in /sps/, and 'paths' in /θs/.",
      learningCompetency: "B8.1.1.1: Articulate and identify complex final consonant clusters in English."
    },
    {
      id: "oral_lab_05_hard",
      level: "B9",
      difficulty: "hard",
      prompt: "Complete the sentence correctly with regard to grammatical syllable stress:\n\"The student union scheduled an official ............ to challenge the administrative directive.\"",
      options: [
        "PRO-test (Noun: primary stress on first syllable)",
        "pro-TEST (Verb: primary stress on second syllable)",
        "pro-test (Equal stress on both syllables)",
        "PRO-TEST-ing (Stress on inflection)"
      ],
      correctAnswer: "PRO-test (Noun: primary stress on first syllable)",
      hint: "Determine the part of speech required in the gap. Two-syllable nouns take stress on the first syllable ('σσ).",
      workedSolution: "The indefinite article 'an' and adjective 'official' demand a singular noun. Under standard English stress shift rules, two-syllable nouns take stress on the first syllable: 'PRO-test' (/ˈprəʊ.test/). The verb is 'pro-TEST' (/prəˈtest/).",
      learningCompetency: "B9.1.1.1: Apply stress rules systematically to distinguish homographic nouns and verbs."
    },
    {
      id: "oral_lab_06_hard",
      level: "B9",
      difficulty: "hard",
      prompt: "When the declarative sentence \"You passed your entrance examination\" is spoken with a prominent RISING INTONATION contour (↗), what communicative attitude is expressed?",
      options: [
        "A definite, authoritative command",
        "Disbelief, surprise, or an echo question",
        "Unquestionable certainty and finality",
        "Emotional indifference"
      ],
      correctAnswer: "Disbelief, surprise, or an echo question",
      hint: "Applying a terminal rising tone to a declarative structure converts the statement pragmatically into an echo question.",
      workedSolution: "In English suprasegmental phonology, applying a rising terminal pitch (↗) to a declarative clause signals surprise, incredulity, or an implicit request for confirmation ('Did you really pass?'). A falling tone (↘) signals certainty.",
      learningCompetency: "B9.1.2.1: Analyze the communicative effects of varied intonation contours in connected speech."
    }
  ],

  metadata: {
    isEnglishLanguage: true,
    curriculum: "NaCCA Common Core Programme (CCP) Standard",
    framework: "National Standards for JHS 1 - JHS 3",
    difficultyLevels: ["low", "medium", "hard"],
    hasPracticeLab: true,
    updatedAt: new Date().toISOString()
  }
};

async function seedOralPhonologyDetailedNotes() {
  console.log("Seeding detailed NaCCA Oral Phonology notes and lab questions into Firestore...");
  
  const db = await getDb();
  const docRef = db.doc("global_curriculum/jhs/subjects/english/topical/oral_phonology_sounds");
  await docRef.set(oralPhonologyPayload, { merge: true });

  console.log("✅ Successfully deployed NaCCA detailed notes & Practice Lab to:");
  console.log("   global_curriculum/jhs/subjects/english/topical/oral_phonology_sounds");
}

seedOralPhonologyDetailedNotes()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Oral Phonology detailed notes:", err);
    process.exit(1);
  });
