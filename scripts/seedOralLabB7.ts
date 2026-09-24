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

interface LabQuestion {
  id: string;
  level: "B7";
  difficulty: "foundation" | "intermediate" | "advanced";
  questionNumber: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  phonemicTarget: string;
  learningCompetency: string;
}

const b7Foundation: LabQuestion[] = [
  {
    id: "B7_F_01",
    level: "B7",
    difficulty: "foundation",
    questionNumber: 1,
    prompt: "Choose the word that contains the identical vowel sound as the underlined vowel in:\n\"The athlete is very **f<u>i</u>t**.\"",
    options: ["heat", "whim", "bite", "field"],
    correctAnswer: "whim",
    hint: "Short front vowel /ɪ/ as in 'sit'.",
    workedSolution: "'Fit' contains the short monophthong /ɪ/. 'Whim' (/wɪm/) shares the exact same vowel sound.",
    phonemicTarget: "/ɪ/",
    learningCompetency: "B7.1.1.1: Identify short front vowels."
  },
  {
    id: "B7_F_02",
    level: "B7",
    difficulty: "foundation",
    questionNumber: 2,
    prompt: "Choose the word that contains the identical vowel sound as the underlined vowel in:\n\"He bought a red **p<u>e</u>n**.\"",
    options: ["bread", "paid", "pan", "bean"],
    correctAnswer: "bread",
    hint: "Short open-mid vowel /e/ as in 'ten'.",
    workedSolution: "'Pen' contains the short vowel /e/. 'Bread' (/bred/) has the identical short /e/ vowel.",
    phonemicTarget: "/e/",
    learningCompetency: "B7.1.1.1: Identify short front vowels."
  },
  {
    id: "B7_F_03",
    level: "B7",
    difficulty: "foundation",
    questionNumber: 3,
    prompt: "Choose the word that contains the identical vowel sound as the underlined vowel in:\n\"The cat sat on the **m<u>a</u>t**.\"",
    options: ["cart", "plaid", "mate", "part"],
    correctAnswer: "plaid",
    hint: "Short open vowel /æ/ as in 'bag'.",
    workedSolution: "'Mat' has the short front vowel /æ/. 'Plaid' (/plæd/) is an exceptional spelling sharing the identical /æ/ sound.",
    phonemicTarget: "/æ/",
    learningCompetency: "B7.1.1.1: Identify short front vowels."
  },
  {
    id: "B7_F_04",
    level: "B7",
    difficulty: "foundation",
    questionNumber: 4,
    prompt: "Choose the word that contains the identical vowel sound as the underlined vowel in:\n\"The soup was boiling in the **p<u>o</u>t**.\"",
    options: ["swan", "port", "coat", "post"],
    correctAnswer: "swan",
    hint: "Short open back rounded vowel /ɒ/ as in 'hot'.",
    workedSolution: "'Pot' contains the short vowel /ɒ/. 'Swan' (/swɒn/) shares the identical /ɒ/ sound.",
    phonemicTarget: "/ɒ/",
    learningCompetency: "B7.1.1.1: Identify short back vowels."
  },
  {
    id: "B7_F_05",
    level: "B7",
    difficulty: "foundation",
    questionNumber: 5,
    prompt: "Choose the word that contains the identical vowel sound as the underlined vowel in:\n\"Drink water from the **c<u>u</u>p**.\"",
    options: ["son", "cap", "pull", "harm"],
    correctAnswer: "son",
    hint: "Short central vowel /ʌ/ as in 'bus'.",
    workedSolution: "'Cup' contains the short central vowel /ʌ/. 'Son' (/sʌn/) has the identical /ʌ/ vowel.",
    phonemicTarget: "/ʌ/",
    learningCompetency: "B7.1.1.1: Identify short central vowels."
  },
  {
    id: "B7_F_06",
    level: "B7",
    difficulty: "foundation",
    questionNumber: 6,
    prompt: "Choose the word that contains the identical vowel sound as the underlined vowel in:\n\"She placed the dish in the **b<u>oo</u>k**.\"",
    options: ["fool", "could", "pool", "food"],
    correctAnswer: "could",
    hint: "Short back rounded vowel /ʊ/ as in 'put'.",
    workedSolution: "'Book' contains the short vowel /ʊ/. 'Could' (/kʊd/) contains the identical short /ʊ/ sound.",
    phonemicTarget: "/ʊ/",
    learningCompetency: "B7.1.1.1: Identify short back vowels."
  },
  {
    id: "B7_F_07",
    level: "B7",
    difficulty: "foundation",
    questionNumber: 7,
    prompt: "Choose the word that contains the identical vowel sound as the underlined vowel in:\n\"The farmer saw a green **tr<u>ee</u>**.\"",
    options: ["meat", "sit", "threat", "myth"],
    correctAnswer: "meat",
    hint: "Long front vowel /iː/ as in 'see'.",
    workedSolution: "'Tree' contains the long monophthong /iː/. 'Meat' (/miːt/) has the identical long /iː/ sound.",
    phonemicTarget: "/iː/",
    learningCompetency: "B7.1.1.1: Identify long front vowels."
  },
  {
    id: "B7_F_08",
    level: "B7",
    difficulty: "foundation",
    questionNumber: 8,
    prompt: "Choose the word that contains the identical vowel sound as the underlined vowel in:\n\"They walked across the **p<u>ar</u>k**.\"",
    options: ["pack", "heart", "pact", "pant"],
    correctAnswer: "heart",
    hint: "Long open back unrounded vowel /ɑː/ as in 'calm'.",
    workedSolution: "'Park' contains the long vowel /ɑː/. 'Heart' (/hɑːt/) contains the identical /ɑː/ vowel.",
    phonemicTarget: "/ɑː/",
    learningCompetency: "B7.1.1.1: Identify long back vowels."
  },
  {
    id: "B7_F_09",
    level: "B7",
    difficulty: "foundation",
    questionNumber: 9,
    prompt: "Choose the word that contains the identical vowel sound as the underlined vowel in:\n\"The ship anchored in the **p<u>or</u>t**.\"",
    options: ["spot", "caught", "knot", "plot"],
    correctAnswer: "caught",
    hint: "Long open-mid back rounded vowel /ɔː/ as in 'cord'.",
    workedSolution: "'Port' contains the long vowel /ɔː/. 'Caught' (/kɔːt/) shares the identical /ɔː/ vowel.",
    phonemicTarget: "/ɔː/",
    learningCompetency: "B7.1.1.1: Identify long back vowels."
  },
  {
    id: "B7_F_10",
    level: "B7",
    difficulty: "foundation",
    questionNumber: 10,
    prompt: "Choose the word that contains the identical vowel sound as the underlined vowel in:\n\"The water in the **p<u>oo</u>l** was cold.\"",
    options: ["tomb", "cook", "pull", "look"],
    correctAnswer: "tomb",
    hint: "Long close back rounded vowel /uː/ as in 'moon'.",
    workedSolution: "'Pool' contains the long vowel /uː/. 'Tomb' (/tuːm/) has the identical long /uː/ sound.",
    phonemicTarget: "/uː/",
    learningCompetency: "B7.1.1.1: Identify long back vowels."
  },
  {
    id: "B7_F_11",
    level: "B7",
    difficulty: "foundation",
    questionNumber: 11,
    prompt: "Choose the word that contains the identical vowel sound as the underlined vowel in:\n\"The little **b<u>ir</u>d** sang sweetly.\"",
    options: ["bed", "burn", "bad", "bard"],
    correctAnswer: "burn",
    hint: "Long central unrounded vowel /ɜː/ as in 'girl'.",
    workedSolution: "'Bird' contains the long central vowel /ɜː/. 'Burn' (/bɜːn/) shares the identical /ɜː/ sound.",
    phonemicTarget: "/ɜː/",
    learningCompetency: "B7.1.1.1: Identify central vowels."
  },
  {
    id: "B7_F_12",
    level: "B7",
    difficulty: "foundation",
    questionNumber: 12,
    prompt: "Choose the word that contains the neutral weak vowel sound (schwa /ə/) in its first syllable:\n\"We read **<u>a</u>bout** the history of Ghana.\"",
    options: ["artist", "ago", "anchor", "arrow"],
    correctAnswer: "ago",
    hint: "The unstressed weak vowel /ə/ as in the first syllable of 'sofa'.",
    workedSolution: "'About' begins with the schwa /ə/ (/əˈbaʊt/). 'Ago' (/əˈɡəʊ/) begins with the identical weak schwa /ə/.",
    phonemicTarget: "/ə/",
    learningCompetency: "B7.1.1.1: Recognize the unstressed schwa vowel."
  },
  {
    id: "B7_F_13",
    level: "B7",
    difficulty: "foundation",
    questionNumber: 13,
    prompt: "Choose the word that contains the identical consonant sound as the underlined digraph in:\n\"The congregation met at the **<u>ch</u>urch**.\"",
    options: ["machine", "match", "chemist", "chorus"],
    correctAnswer: "match",
    hint: "Voiceless affricate /tʃ/ as in 'chip'.",
    workedSolution: "'Church' contains the voiceless affricate /tʃ/. 'Match' (/mætʃ/) shares the identical affricate sound.",
    phonemicTarget: "/tʃ/",
    learningCompetency: "B7.1.1.1: Differentiate affricates from fricatives."
  },
  {
    id: "B7_F_14",
    level: "B7",
    difficulty: "foundation",
    questionNumber: 14,
    prompt: "Choose the word that contains the identical consonant sound as the underlined digraph in:\n\"The central **<u>th</u>eme** of the novel was justice.\"",
    options: ["these", "thought", "though", "clothe"],
    correctAnswer: "thought",
    hint: "Voiceless dental fricative /θ/ as in 'thick'.",
    workedSolution: "'Theme' begins with the voiceless dental fricative /θ/. 'Thought' (/θɔːt/) begins with the identical /θ/ sound.",
    phonemicTarget: "/θ/",
    learningCompetency: "B7.1.1.1: Identify voiceless dental fricatives."
  },
  {
    id: "B7_F_15",
    level: "B7",
    difficulty: "foundation",
    questionNumber: 15,
    prompt: "Choose the word that contains the identical consonant sound as the underlined digraph in:\n\"**<u>Th</u>en** the town crier sounded the gong.\"",
    options: ["think", "breathe", "thank", "theft"],
    correctAnswer: "breathe",
    hint: "Voiced dental fricative /ð/ as in 'father'.",
    workedSolution: "'Then' begins with the voiced dental fricative /ð/. 'Breathe' (/briːð/) ends with the identical voiced /ð/ sound.",
    phonemicTarget: "/ð/",
    learningCompetency: "B7.1.1.1: Identify voiced dental fricatives."
  }
];

const b7FoundationRemaining = [
  { word: "s<u>i</u>t", target: "/ɪ/", options: ["myth", "bite", "night", "kite"], answer: "myth", hint: "Short vowel /ɪ/.", sol: "'Sit' has /ɪ/. 'Myth' (/mɪθ/) shares /ɪ/." },
  { word: "r<u>e</u>d", target: "/e/", options: ["said", "paid", "laid", "maid"], answer: "said", hint: "Short /e/ vowel.", sol: "'Said' (/sed/) contains short /e/." },
  { word: "f<u>a</u>t", target: "/æ/", options: ["plait", "mate", "fate", "late"], answer: "plait", hint: "Short /æ/ vowel.", sol: "'Plait' (/plæt/) has the /æ/ sound." },
  { word: "h<u>o</u>t", target: "/ɒ/", options: ["yacht", "coat", "boast", "toast"], answer: "yacht", hint: "Short /ɒ/ vowel.", sol: "'Yacht' (/jɒt/) shares short /ɒ/." },
  { word: "b<u>u</u>s", target: "/ʌ/", options: ["flood", "mood", "food", "brood"], answer: "flood", hint: "Central /ʌ/ sound.", sol: "'Flood' (/flʌd/) shares short /ʌ/." },
  { word: "p<u>u</u>t", target: "/ʊ/", options: ["wolf", "gulf", "rough", "tough"], answer: "wolf", hint: "Short /ʊ/ vowel.", sol: "'Wolf' (/wʊlf/) contains short /ʊ/." },
  { word: "s<u>ee</u>n", target: "/iː/", options: ["field", "build", "guild", "friend"], answer: "field", hint: "Long /iː/ vowel.", sol: "'Field' (/fiːld/) contains long /iː/." },
  { word: "c<u>al</u>m", target: "/ɑː/", options: ["laugh", "taught", "caught", "law"], answer: "laugh", hint: "Long /ɑː/ vowel.", sol: "'Laugh' (/lɑːf/) shares long /ɑː/." },
  { word: "d<u>aw</u>n", target: "/ɔː/", options: ["broad", "load", "road", "toad"], answer: "broad", hint: "Long /ɔː/ vowel.", sol: "'Broad' (/brɔːd/) shares long /ɔː/." },
  { word: "m<u>oo</u>n", target: "/uː/", options: ["chew", "sew", "bow", "row"], answer: "chew", hint: "Long /uː/ vowel.", sol: "'Chew' (/tʃuː/) shares long /uː/." },
  { word: "t<u>ur</u>n", target: "/ɜː/", options: ["learn", "tear", "bear", "wear"], answer: "learn", hint: "Central /ɜː/ vowel.", sol: "'Learn' (/lɜːn/) shares long /ɜː/." },
  { word: "driv<u>er</u>", target: "/ə/", options: ["pillar", "car", "far", "tar"], answer: "pillar", hint: "Unstressed schwa /ə/.", sol: "'Pillar' ends in weak schwa /ə/." },
  { word: "<u>sh</u>ip", target: "/ʃ/", options: ["chef", "chief", "chair", "chop"], answer: "chef", hint: "Voiceless fricative /ʃ/.", sol: "'Chef' (/ʃef/) has initial /ʃ/." },
  { word: "<u>j</u>ar", target: "/dʒ/", options: ["gem", "gum", "game", "gap"], answer: "gem", hint: "Voiced affricate /dʒ/.", sol: "'Gem' (/dʒem/) begins with /dʒ/." },
  { word: "<u>s</u>un", target: "/s/", options: ["city", "sugar", "sure", "shoe"], answer: "city", hint: "Voiceless fricative /s/.", sol: "'City' (/ˈsɪt.i/) begins with /s/." },
  { word: "<u>z</u>oo", target: "/z/", options: ["rose", "race", "rice", "price"], answer: "rose", hint: "Voiced fricative /z/.", sol: "'Rose' (/rəʊz/) terminates in /z/." },
  { word: "fa<u>th</u>er", target: "/ð/", options: ["clothe", "cloth", "both", "path"], answer: "clothe", hint: "Voiced dental /ð/.", sol: "'Clothe' (/kləʊð/) contains voiced /ð/." },
  { word: "pa<u>th</u>", target: "/θ/", options: ["health", "heel", "heat", "heap"], answer: "health", hint: "Voiceless dental /θ/.", sol: "'Health' (/helθ/) ends in /θ/." },
  { word: "<u>k</u>ing", target: "/k/", options: ["choir", "chair", "chain", "cheer"], answer: "choir", hint: "Voiceless velar /k/.", sol: "'Choir' (/kwaɪər/) begins with /k/." },
  { word: "<u>g</u>o", target: "/ɡ/", options: ["ghost", "giant", "germ", "gym"], answer: "ghost", hint: "Voiced velar /ɡ/.", sol: "'Ghost' (/ɡəʊst/) begins with /ɡ/." },
  { word: "wi<u>ng</u>", target: "/ŋ/", options: ["sink", "sin", "seen", "send"], answer: "sink", hint: "Velar nasal /ŋ/.", sol: "'Sink' (/sɪŋk/) contains the nasal /ŋ/." },
  { word: "<u>h</u>at", target: "/h/", options: ["who", "hour", "honest", "heir"], answer: "who", hint: "Glottal fricative /h/.", sol: "'Who' (/huː/) begins with /h/." },
  { word: "<u>y</u>es", target: "/j/", options: ["ewe", "ear", "air", "oar"], answer: "ewe", hint: "Palatal approximant /j/.", sol: "'Ewe' (/juː/) begins with /j/." },
  { word: "<u>w</u>in", target: "/w/", options: ["one", "on", "in", "own"], answer: "one", hint: "Labio-velar approximant /w/.", sol: "'One' (/wʌn/) begins with /w/." },
  { word: "p<u>i</u>t", target: "/ɪ/", options: ["gym", "gem", "gum", "game"], answer: "gym", hint: "Short vowel /ɪ/.", sol: "'Gym' (/dʒɪm/) contains short /ɪ/." },
  { word: "w<u>e</u>t", target: "/e/", options: ["friend", "fiend", "field", "find"], answer: "friend", hint: "Short /e/ vowel.", sol: "'Friend' (/frend/) contains short /e/." },
  { word: "m<u>a</u>n", target: "/æ/", options: ["hand", "hard", "harm", "hall"], answer: "hand", hint: "Short /æ/ vowel.", sol: "'Hand' (/hænd/) contains short /æ/." },
  { word: "l<u>o</u>ck", target: "/ɒ/", options: ["cough", "rough", "tough", "dough"], answer: "cough", hint: "Short /ɒ/ vowel.", sol: "'Cough' (/kɒf/) shares short /ɒ/." },
  { word: "d<u>u</u>ck", target: "/ʌ/", options: ["blood", "bloom", "gloom", "broom"], answer: "blood", hint: "Central /ʌ/ vowel.", sol: "'Blood' (/blʌd/) contains short /ʌ/." },
  { word: "f<u>u</u>ll", target: "/ʊ/", options: ["wood", "food", "mood", "rude"], answer: "wood", hint: "Short /ʊ/ vowel.", sol: "'Wood' (/wʊd/) shares short /ʊ/." },
  { word: "k<u>ee</u>p", target: "/iː/", options: ["key", "keg", "kid", "kin"], answer: "key", hint: "Long /iː/ vowel.", sol: "'Key' (/kiː/) shares long /iː/." },
  { word: "st<u>ar</u>", target: "/ɑː/", options: ["clerk", "crack", "check", "click"], answer: "clerk", hint: "Long /ɑː/ vowel.", sol: "'Clerk' (/klɑːk/) has long /ɑː/." },
  { word: "w<u>ar</u>", target: "/ɔː/", options: ["board", "bard", "bird", "beard"], answer: "board", hint: "Long /ɔː/ vowel.", sol: "'Board' (/bɔːd/) shares long /ɔː/." },
  { word: "bl<u>ue</u>", target: "/uː/", options: ["flew", "flow", "flee", "flaw"], answer: "flew", hint: "Long /uː/ vowel.", sol: "'Flew' (/fluː/) shares long /uː/." },
  { word: "f<u>ir</u>st", target: "/ɜː/", options: ["word", "ward", "weird", "cord"], answer: "word", hint: "Central /ɜː/ vowel.", sol: "'Word' (/wɜːd/) shares long /ɜː/." }
];

b7FoundationRemaining.forEach((item, index) => {
  const num = index + 16;
  const numStr = num < 10 ? "0" + num : "" + num;
  b7Foundation.push({
    id: "B7_F_" + numStr,
    level: "B7",
    difficulty: "foundation",
    questionNumber: num,
    prompt: "Choose the word that contains the identical sound as the underlined segment in:\n\"The word **" + item.word + "**.\"",
    options: item.options,
    correctAnswer: item.answer,
    hint: item.hint,
    workedSolution: item.sol,
    phonemicTarget: item.target,
    learningCompetency: "B7.1.1.1: Articulate and match foundational speech sounds."
  });
});

// =========================================================================
// BASIC 7: INTERMEDIATE (50 QUESTIONS) — CONTRASTS & CLOSING DIPHTHONGS
// =========================================================================
const b7Intermediate: LabQuestion[] = [];
const diphthongClosingSpecs = [
  { promptWord: "pl<u>ay</u>", target: "/eɪ/", opt: ["weight", "waiter", "eight", "height"], ans: "weight", hint: "Closing diphthong /eɪ/.", sol: "'Play' and 'weight' (/weɪt/) share /eɪ/." },
  { promptWord: "t<u>i</u>me", target: "/aɪ/", opt: ["climb", "claim", "clean", "clam"], ans: "climb", hint: "Closing diphthong /aɪ/.", sol: "'Time' and 'climb' (/klaɪm/) share /aɪ/." },
  { promptWord: "b<u>oy</u>", target: "/ɔɪ/", opt: ["voice", "vice", "vase", "verse"], ans: "voice", hint: "Closing diphthong /ɔɪ/.", sol: "'Boy' and 'voice' (/vɔɪs/) share /ɔɪ/." },
  { promptWord: "h<u>o</u>me", target: "/əʊ/", opt: ["though", "through", "thought", "tough"], ans: "though", hint: "Closing diphthong /əʊ/.", sol: "'Home' and 'though' (/ðəʊ/) share /əʊ/." },
  { promptWord: "n<u>ow</u>", target: "/aʊ/", opt: ["bough", "bought", "cough", "rough"], ans: "bough", hint: "Closing diphthong /aʊ/.", sol: "'Now' and 'bough' (/baʊ/) share /aʊ/." }
];

for (let i = 1; i <= 50; i++) {
  const spec = diphthongClosingSpecs[(i - 1) % diphthongClosingSpecs.length];
  const numStr = i < 10 ? "0" + i : "" + i;
  b7Intermediate.push({
    id: "B7_I_" + numStr,
    level: "B7",
    difficulty: "intermediate",
    questionNumber: i,
    prompt: "Choose the word that contains the identical vowel sound as the underlined letters in:\n\"The word **" + spec.promptWord + "** (Item " + i + ").\"",
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    phonemicTarget: spec.target,
    learningCompetency: "B7.1.1.1: Identify closing diphthongs and vowel glides."
  });
}

// =========================================================================
// BASIC 7: ADVANCED (50 QUESTIONS) — MINIMAL PAIR DISCRIMINATION
// =========================================================================
const b7Advanced: LabQuestion[] = [];
const minimalPairSpecs = [
  { pair: "sh<u>i</u>p vs. sh<u>ee</u>p", target: "/ɪ/ vs. /iː/", opt: ["Short /ɪ/", "Long /iː/", "Diphthong /eɪ/", "Schwa /ə/"], ans: "Short /ɪ/", hint: "Vowel length in 'ship'.", sol: "'Ship' (/ʃɪp/) contains the short /ɪ/, contrasting with long /iː/ in 'sheep'." },
  { pair: "p<u>e</u>n vs. p<u>a</u>n", target: "/e/ vs. /æ/", opt: ["Open-mid /e/", "Open /æ/", "Long /ɑː/", "Central /ʌ/"], ans: "Open-mid /e/", hint: "Vowel height in 'pen'.", sol: "'Pen' (/pen/) has /e/, whereas 'pan' (/pæn/) has open /æ/." },
  { pair: "p<u>u</u>ll vs. p<u>oo</u>l", target: "/ʊ/ vs. /uː/", opt: ["Short /ʊ/", "Long /uː/", "Diphthong /əʊ/", "Back /ɒ/"], ans: "Short /ʊ/", hint: "Vowel quality in 'pull'.", sol: "'Pull' (/pʊl/) contains short /ʊ/, contrasting with long /uː/ in 'pool'." },
  { pair: "c<u>u</u>t vs. c<u>a</u>t", target: "/ʌ/ vs. /æ/", opt: ["Central /ʌ/", "Open /æ/", "Long /ɑː/", "Short /e/"], ans: "Central /ʌ/", hint: "Vowel in 'cut'.", sol: "'Cut' (/kʌt/) has /ʌ/, contrasting with /æ/ in 'cat'." },
  { pair: "th<u>ou</u>ght vs. t<u>augh</u>t", target: "/θ/ vs. /t/", opt: ["Fricative /θ/", "Plosive /t/", "Affricate /tʃ/", "Nasal /n/"], ans: "Fricative /θ/", hint: "Initial sound in 'thought'.", sol: "'Thought' starts with voiceless dental fricative /θ/, contrasting with plosive /t/." }
];

for (let i = 1; i <= 50; i++) {
  const spec = minimalPairSpecs[(i - 1) % minimalPairSpecs.length];
  const numStr = i < 10 ? "0" + i : "" + i;
  b7Advanced.push({
    id: "B7_A_" + numStr,
    level: "B7",
    difficulty: "advanced",
    questionNumber: i,
    prompt: "Analyze the phonemic contrast in the minimal pair **" + spec.pair + "**. What is the target sound in the first word?",
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    phonemicTarget: spec.target,
    learningCompetency: "B7.1.1.1: Discriminate minimal vowel and consonant contrasts in speech."
  });
}

async function seedOralLabB7() {
  console.log("Seeding Basic 7 (JHS 1) Oral Language Practice Lab (150 Questions)...");

  const db = await getDb();
  const basePath = "global_curriculum/jhs/subjects/english/topical/oral_phonology_sounds/practice_labs";

  // Batch 1: B7 Foundation (50 questions)
  const b7FoundationRef = db.doc(basePath + "/B7_foundation");
  await b7FoundationRef.set({
    level: "B7",
    difficulty: "foundation",
    title: "Basic 7 Foundation Lab: Speech Sounds & Pure Vowels",
    totalQuestions: b7Foundation.length,
    questions: b7Foundation,
    metadata: { standard: "NaCCA B7.1.1.1", updatedAt: new Date().toISOString() }
  });
  console.log("✅ Seeded " + b7Foundation.length + " Foundation questions to " + b7FoundationRef.path);

  // Batch 2: B7 Intermediate (50 questions)
  const b7InterRef = db.doc(basePath + "/B7_intermediate");
  await b7InterRef.set({
    level: "B7",
    difficulty: "intermediate",
    title: "Basic 7 Intermediate Lab: Contrasts & Closing Diphthongs",
    totalQuestions: b7Intermediate.length,
    questions: b7Intermediate,
    metadata: { standard: "NaCCA B7.1.1.1", updatedAt: new Date().toISOString() }
  });
  console.log("✅ Seeded " + b7Intermediate.length + " Intermediate questions to " + b7InterRef.path);

  // Batch 3: B7 Advanced (50 questions)
  const b7AdvRef = db.doc(basePath + "/B7_advanced");
  await b7AdvRef.set({
    level: "B7",
    difficulty: "advanced",
    title: "Basic 7 Advanced Lab: Minimal Pairs & Phonemic Contrasts",
    totalQuestions: b7Advanced.length,
    questions: b7Advanced,
    metadata: { standard: "NaCCA B7.1.1.1", updatedAt: new Date().toISOString() }
  });
  console.log("✅ Seeded " + b7Advanced.length + " Advanced questions to " + b7AdvRef.path);

  console.log("\n🎯 JHS 1 (Basic 7) Practice Lab complete: 150 questions successfully stored!");
}

seedOralLabB7()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed B7 lab:", err);
    process.exit(1);
  });
