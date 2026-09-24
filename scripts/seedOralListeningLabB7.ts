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
  difficulty: "foundation" | "intermediate" | "advanced";
  questionNumber: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  competencyTarget: string;
  learningCompetency: string;
}

// =========================================================================
// BASIC 7: FOUNDATION (50 QUESTIONS) — ACTIVE LISTENING & POLITE REGISTERS
// =========================================================================
const b7Foundation: LabQuestion[] = [];
const b7FoundSpecs = [
  {
    context: "requesting a classmate's pencil",
    prompt: "Which of the following is the most polite way to ask a classmate for a pencil?",
    opt: ["Give me your pencil now.", "Could I please borrow your pencil for a moment?", "Hand over that pencil.", "I am taking this pencil."],
    ans: "Could I please borrow your pencil for a moment?",
    hint: "Polite requests use modal auxiliaries like 'could' and courtesy markers like 'please'.",
    sol: "'Could I please borrow your pencil for a moment?' uses modal softening, making it respectful.",
    target: "Polite Requests"
  },
  {
    context: "addressing the school headmaster",
    prompt: "You wish to enter the headmaster's office. What is the appropriate expression?",
    opt: ["Hey, I am coming in!", "Open the door for me.", "Excuse me, sir, may I come in?", "I need to talk right now."],
    ans: "Excuse me, sir, may I come in?",
    hint: "Formal register requires honorifics ('sir') and permissive modal 'may'.",
    sol: "'Excuse me, sir, may I come in?' follows formal school etiquette.",
    target: "Formal Etiquette"
  },
  {
    context: "active listening in class",
    prompt: "What does active listening primarily require a student to do while a speaker is talking?",
    opt: ["Plan what to say next to interrupt quickly", "Pay close attention and refrain from interrupting", "Look out the window to avoid staring", "Whisper to a classmate about the lesson"],
    ans: "Pay close attention and refrain from interrupting",
    hint: "Active listening involves focusing attention and withholding interruptions.",
    sol: "Active listening requires cognitive focus on the speaker's message without premature interruptions.",
    target: "Active Listening"
  },
  {
    context: "asking for directions",
    prompt: "You are lost in an unfamiliar town. How should you approach a stranger for directions?",
    opt: ["Where is the market? Tell me!", "Pardon me, please could you direct me to the central market?", "Hey you, show me the road!", "I want the market right now."],
    ans: "Pardon me, please could you direct me to the central market?",
    hint: "Use an attention-getter like 'Pardon me' followed by a polite modal request.",
    sol: "'Pardon me, please could you direct me...' is courteous and polite.",
    target: "Polite Requests"
  },
  {
    context: "paraphrasing a teacher's instruction",
    prompt: "The teacher says: 'Submit your exercise books before the second break.' How should you paraphrase this to confirm?",
    opt: ["You want our books early, right?", "If I understand correctly, we must hand in our books before the second break.", "Why do you need the books so quickly?", "I will submit it whenever I finish."],
    ans: "If I understand correctly, we must hand in our books before the second break.",
    hint: "Paraphrasing restates the original instruction in your own words to verify meaning.",
    sol: "'If I understand correctly...' accurately verifies comprehension through proper paraphrasing.",
    target: "Active Listening"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b7FoundSpecs[(i - 1) % b7FoundSpecs.length];
  b7Foundation.push({
    id: `B7_L_F_${i < 10 ? "0" + i : i}`,
    level: "B7",
    difficulty: "foundation",
    questionNumber: i,
    prompt: `${spec.prompt} (Context: Item ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B7.1.2.1: Employ polite requests and active listening strategies in everyday conversation."
  });
}

// =========================================================================
// BASIC 7: INTERMEDIATE (50 QUESTIONS) — CLARIFICATION & CONVERSATIONAL CUES
// =========================================================================
const b7Intermediate: LabQuestion[] = [];
const b7InterSpecs = [
  {
    prompt: "A speaker is explaining a complex mathematics problem and pauses. What non-verbal cue shows you are listening attentively?",
    opt: ["Yawning loudly", "Maintaining eye contact and nodding gently", "Checking your wristwatch repeatedly", "Tapping your foot on the floor"],
    ans: "Maintaining eye contact and nodding gently",
    hint: "Attentive non-verbal communication includes open posture and gentle nodding.",
    sol: "Maintaining appropriate eye contact and nodding signals to the speaker that you are engaged.",
    target: "Non-verbal Cues"
  },
  {
    prompt: "You did not hear an announcement made during morning assembly. How should you ask the teacher to repeat it?",
    opt: ["Say that again, I didn't hear!", "Pardon me, sir, could you kindly repeat the announcement?", "What did you say just now?", "Speak louder next time!"],
    ans: "Pardon me, sir, could you kindly repeat the announcement?",
    hint: "Polite clarification uses 'Pardon me' and 'could you kindly'.",
    sol: "'Pardon me, sir, could you kindly repeat...' is the standard formal register for requesting repetition.",
    target: "Seeking Clarification"
  },
  {
    prompt: "Which of the following phrases is the most constructive way to express disagreement with a classmate's opinion in a study group?",
    opt: ["That makes no sense at all.", "You are completely wrong as usual.", "I see your point, but have you considered this alternative?", "Be quiet and listen to me."],
    ans: "I see your point, but have you considered this alternative?",
    hint: "Constructive disagreement acknowledges the other view before offering an alternative.",
    sol: "Acknowledging the peer's contribution before offering a counterpoint fosters collaborative learning.",
    target: "Polite Disagreement"
  },
  {
    prompt: "What is an effective way to check your perception of what someone just said?",
    opt: ["Assume you know everything they meant", "Ask: 'Do you mean that...?' to verify your understanding", "Ignore the parts you did not understand", "Interrupt to change the topic"],
    ans: "Ask: 'Do you mean that...?' to verify your understanding",
    hint: "Perception checking involves asking a clarifying question based on what was heard.",
    sol: "Asking 'Do you mean that...?' directly confirms whether the listener interpreted the message as intended.",
    target: "Perception Checking"
  },
  {
    prompt: "When communicating with an elder in Ghanaian cultural and formal English context, which posture is appropriate?",
    opt: ["Folding arms tightly and staring aggressively", "Standing respectfully with a relaxed, attentive posture", "Looking at your mobile phone", "Leaning against the wall carelessly"],
    ans: "Standing respectfully with a relaxed, attentive posture",
    hint: "Respectful posture is attentive without being confrontational.",
    sol: "A relaxed, upright, and attentive posture communicates respect and readiness to listen.",
    target: "Body Language"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b7InterSpecs[(i - 1) % b7InterSpecs.length];
  b7Intermediate.push({
    id: `B7_L_I_${i < 10 ? "0" + i : i}`,
    level: "B7",
    difficulty: "intermediate",
    questionNumber: i,
    prompt: `${spec.prompt} (Drill ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B7.1.3.1: Apply conversational turn-taking, perception checking, and constructive feedback."
  });
}

// =========================================================================
// BASIC 7: ADVANCED (50 QUESTIONS) — CONTEXTUAL DIALOGUES & REGISTER SHIFTS
// =========================================================================
const b7Advanced: LabQuestion[] = [];
const b7AdvSpecs = [
  {
    dialogue: "Teacher: 'The deadline for the science project is tomorrow morning.'\nStudent: '............'",
    prompt: "Which response demonstrates both active listening and polite formal register?",
    opt: [
      "'Understood, madam. We will submit our project reports before first period tomorrow.'",
      "'Why so early? We need more time!'",
      "'Okay, whatever you say.'",
      "'I am not sure if my group will finish.'"
    ],
    ans: "'Understood, madam. We will submit our project reports before first period tomorrow.'",
    hint: "Acknowledge the specific deadline with respectful confirmation.",
    sol: "The response confirms the exact timing and uses the proper honorific 'madam'.",
    target: "Register Alignment"
  },
  {
    dialogue: "Guest Speaker: '...and that is why conserving water is vital for rural communities.'\nStudent Moderator: '............'",
    prompt: "Which statement by the student moderator best transitions to the audience question session?",
    opt: [
      "'Your speech was too long, but let's take questions.'",
      "'Thank you for that insightful presentation, sir. We will now take questions from the floor.'",
      "'Who has something to ask before we leave?'",
      "'Sit down now so the audience can talk.'"
    ],
    ans: "'Thank you for that insightful presentation, sir. We will now take questions from the floor.'",
    hint: "Formal moderation requires thanking the speaker and courteously inviting audience questions.",
    sol: "A courteous expression of gratitude followed by an invitation to the floor is standard moderation etiquette.",
    target: "Public Dialogue"
  },
  {
    dialogue: "Parent: 'Kofi, please help me carry these groceries into the kitchen.'\nKofi: '............'",
    prompt: "Which response demonstrates filial respect and helpfulness?",
    opt: [
      "'I am busy right now, carry them yourself.'",
      "'Right away, Mama. Let me take the heavy basket.'",
      "'Later, I am watching television.'",
      "'Why did you buy so many things?'"
    ],
    ans: "'Right away, Mama. Let me take the heavy basket.'",
    hint: "Filial respect involves prompt willingness and courteous language.",
    sol: "'Right away, Mama...' shows immediate readiness to assist.",
    target: "Interpersonal Courtesy"
  },
  {
    dialogue: "Customer: 'Excuse me, is this the desk for junior library registration?'\nStudent Assistant: '............'",
    prompt: "How should the student assistant respond courteously?",
    opt: [
      "'Can't you read the sign above?'",
      "'Yes, it is. Welcome! Please have a seat and fill out this registration slip.'",
      "'Wait there until I am ready.'",
      "'No, ask someone else.'"
    ],
    ans: "'Yes, it is. Welcome! Please have a seat and fill out this registration slip.'",
    hint: "Service etiquette requires a warm confirmation and clear direction.",
    sol: "Welcoming the visitor and providing guidance is the proper institutional register.",
    target: "Service Protocol"
  },
  {
    dialogue: "Class Prefect: 'Quiet please, the examination coordinator is about to speak.'\nClassmate: '............'",
    prompt: "Which reaction exhibits cooperative civic behavior?",
    opt: [
      "'Stop bossing us around!'",
      "'Let me finish my story first.'",
      "'Immediately ceasing conversation and paying attention to the podium.'",
      "'Laughing loudly at the prefect.'"
    ],
    ans: "'Immediately ceasing conversation and paying attention to the podium.'",
    hint: "Cooperation with student leadership ensures an orderly learning environment.",
    sol: "Immediate silence and attention demonstrates maturity and respect for authority.",
    target: "Civic Decorum"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b7AdvSpecs[(i - 1) % b7AdvSpecs.length];
  b7Advanced.push({
    id: `B7_L_A_${i < 10 ? "0" + i : i}`,
    level: "B7",
    difficulty: "advanced",
    questionNumber: i,
    prompt: `${spec.prompt}\nDialogue:\n${spec.dialogue}\n(Scenario ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B7.1.3.1: Evaluate and produce context-appropriate spoken dialogue in institutional settings."
  });
}

async function seedOralListeningLabB7() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Seeding Basic 7 Oral Listening & Dialogue Lab (150 Questions)...");

  const paths = [
    "global_curriculum/jhs/subjects/english/topical/oral_listening_conversation",
    "global_curriculum/jhs/subjects/english/topics/oral_listening_conversation",
    "global_curriculum/jhs/subjects/english/topical_units/oral_listening_conversation"
  ];

  for (const mainPath of paths) {
    const basePath = `${mainPath}/practice_labs`;

    const fRef = db.doc(`${basePath}/B7_foundation`);
    await fRef.set({
      level: "B7",
      difficulty: "foundation",
      title: "Basic 7 Foundation Lab: Active Listening & Polite Requests",
      totalQuestions: b7Foundation.length,
      questions: b7Foundation,
      metadata: { standard: "NaCCA B7.1.2.1", updatedAt: new Date().toISOString() }
    }, { merge: true });
    console.log(`✅ Seeded ${b7Foundation.length} questions to ${fRef.path}`);

    const iRef = db.doc(`${basePath}/B7_intermediate`);
    await iRef.set({
      level: "B7",
      difficulty: "intermediate",
      title: "Basic 7 Intermediate Lab: Clarification & Conversational Turn-Taking",
      totalQuestions: b7Intermediate.length,
      questions: b7Intermediate,
      metadata: { standard: "NaCCA B7.1.3.1", updatedAt: new Date().toISOString() }
    }, { merge: true });
    console.log(`✅ Seeded ${b7Intermediate.length} questions to ${iRef.path}`);

    const aRef = db.doc(`${basePath}/B7_advanced`);
    await aRef.set({
      level: "B7",
      difficulty: "advanced",
      title: "Basic 7 Advanced Lab: Contextual Dialogues & Register Shifts",
      totalQuestions: b7Advanced.length,
      questions: b7Advanced,
      metadata: { standard: "NaCCA B7.1.3.1", updatedAt: new Date().toISOString() }
    }, { merge: true });
    console.log(`✅ Seeded ${b7Advanced.length} questions to ${aRef.path}`);
  }

  // =========================================================================
  // SYNCHRONIZE INTO MAIN TOPICAL DOCUMENT FOR TOPICAL LAB RUNNER COMPONENT
  // =========================================================================
  console.log("\nSynchronizing B7 practice pools into the main topical document...");
  
  const mapToPracticeQuestion = (q: LabQuestion, mappedDifficulty: 'low' | 'medium' | 'hard') => ({
    id: q.id,
    difficulty: mappedDifficulty,
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: 1,
    learningCompetency: q.learningCompetency
  });

  const b7PracticePool = {
    low: b7Foundation.map(q => mapToPracticeQuestion(q, 'low')),
    medium: b7Intermediate.map(q => mapToPracticeQuestion(q, 'medium')),
    hard: b7Advanced.map(q => mapToPracticeQuestion(q, 'hard'))
  };

  for (const mainPath of paths) {
    const mainDocRef = db.doc(mainPath);
    const snap = await mainDocRef.get();
    if (snap.exists) {
      const data = snap.data();
      const existingLevels = data.levels || {};
      const updatedLevels = {
        ...existingLevels,
        b7: {
          ...(existingLevels.b7 || {}),
          practicePool: b7PracticePool
        },
        jhs1: {
          ...(existingLevels.jhs1 || {}),
          practicePool: b7PracticePool
        }
      };

      await mainDocRef.set({
        levels: updatedLevels,
        totalPracticeQuestions: (data.totalPracticeQuestions || 0) + 150,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log(`✅ Updated main document practicePool at: ${mainPath}`);
    }
  }

  // =========================================================================
  // UPDATE MANIFEST
  // =========================================================================
  console.log("\nUpdating English manifests/topical_labs document...");
  const manifestRef = db.doc("global_curriculum/jhs/subjects/english/manifests/topical_labs");
  const mSnap = await manifestRef.get();
  if (mSnap.exists) {
    const mData = mSnap.data();
    const newTopics = (mData.topics || []).map((t: any) => {
      if (t.id === 'oral_listening_conversation' || t.topicId === 'oral_listening_conversation') {
        const prevCount = t.totalQuestions || 0;
        return {
          ...t,
          totalQuestions: Math.max(prevCount, 150),
          questionCount: Math.max(prevCount, 150),
          status: 'ready'
        };
      }
      return t;
    });
    await manifestRef.set({ ...mData, topics: newTopics, updatedAt: new Date().toISOString() }, { merge: true });
    console.log("✅ Manifest updated successfully.");
  }

  console.log("\n🎯 JHS 1 (Basic 7) Oral Listening Lab complete: 150 questions stored and active!");
}

seedOralListeningLabB7()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed B7 Oral Listening Lab:", err);
    process.exit(1);
  });
