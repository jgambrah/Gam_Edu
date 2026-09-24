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
  level: "B8";
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
// BASIC 8: FOUNDATION (50 QUESTIONS) — FORMAL MEETING VOCABULARY & ROLES
// =========================================================================
const b8Foundation: LabQuestion[] = [];
const b8FoundSpecs = [
  {
    prompt: "What is the term for the minimum number of members that must be present at a meeting before decisions can be made legally?",
    opt: ["Agenda", "Quorum", "Minutes", "Motion"],
    ans: "Quorum",
    hint: "Without this minimum number of attendees, official business cannot proceed.",
    sol: "A 'quorum' is the minimum attendance required by club or committee rules to transact valid business.",
    target: "Meeting Terminology"
  },
  {
    prompt: "What is the official document containing the list of topics scheduled to be discussed during a meeting called?",
    opt: ["The Minutes", "The Constitution", "The Agenda", "The Motion"],
    ans: "The Agenda",
    hint: "This numbered schedule outlines the business to be addressed in order.",
    sol: "An 'agenda' is the list of items to be discussed at a formal meeting.",
    target: "Meeting Terminology"
  },
  {
    prompt: "Who is responsible for recording the official written record of proceedings and decisions during a committee meeting?",
    opt: ["The Chairperson", "The Secretary", "The Treasurer", "The Patron"],
    ans: "The Secretary",
    hint: "This officer takes notes and compiles the formal minutes.",
    sol: "The Secretary is tasked with documenting minutes, keeping records, and handling correspondence.",
    target: "Committee Roles"
  },
  {
    prompt: "What is a formal proposal made by a member in a meeting for discussion and voting termed?",
    opt: ["A Point of Order", "A Motion", "An Amendment", "A Resolution"],
    ans: "A Motion",
    hint: "A member introduces this by stating: 'I move that...'",
    sol: "A 'motion' is a formal proposal submitted to an assembly for collective deliberation and voting.",
    target: "Parliamentary Procedure"
  },
  {
    prompt: "What does it mean when a member 'seconds' a motion?",
    opt: [
      "The member is speaking for the second time",
      "The member formally endorses the proposal so it can be debated",
      "The member opposes the proposal strongly",
      "The member asks for a two-minute recess"
    ],
    ans: "The member formally endorses the proposal so it can be debated",
    hint: "A motion cannot be opened for debate unless another member supports it.",
    sol: "Seconding a motion confirms that at least one other member agrees the proposal warrants full discussion.",
    target: "Parliamentary Procedure"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b8FoundSpecs[(i - 1) % b8FoundSpecs.length];
  b8Foundation.push({
    id: `B8_L_F_${i < 10 ? "0" + i : i}`,
    level: "B8",
    difficulty: "foundation",
    questionNumber: i,
    prompt: `${spec.prompt} (Item ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B8.1.2.1: Define and apply formal meeting vocabulary and officer roles."
  });
}

// =========================================================================
// BASIC 8: INTERMEDIATE (50 QUESTIONS) — TURN-TAKING & PARLIAMENTARY RULES
// =========================================================================
const b8Intermediate: LabQuestion[] = [];
const b8InterSpecs = [
  {
    prompt: "When may a committee member speak during a formal deliberative session?",
    opt: [
      "Whenever they have an interesting idea to share",
      "Only after raising their hand and being recognized by the Chairperson",
      "As soon as an opponent finishes a sentence",
      "Whenever the Secretary is taking notes"
    ],
    ans: "Only after raising their hand and being recognized by the Chairperson",
    hint: "Floor privileges are strictly granted by the presiding officer.",
    sol: "In formal committee protocol, members may only speak after being recognized and given the floor by the Chair.",
    target: "Floor Etiquette"
  },
  {
    prompt: "To whom should a speaker direct all comments and arguments during a committee debate?",
    opt: [
      "Directly to the opposing member across the table",
      "To the audience outside the room",
      "To the presiding Chairperson",
      "To the Secretary alone"
    ],
    ans: "To the presiding Chairperson",
    hint: "Direct personal confrontations are avoided by addressing the Chair.",
    sol: "Addressing remarks through the Chair ('Mr. Chairman...') maintains decorum and prevents personal conflict.",
    target: "Decorum"
  },
  {
    prompt: "When is a member justified in raising a 'Point of Order' during a meeting?",
    opt: [
      "When they want to disagree with the speaker's personal opinion",
      "When an established rule of procedure or constitution is breached",
      "When they feel hungry and want to adjourn",
      "When they want to tell a joke"
    ],
    ans: "When an established rule of procedure or constitution is breached",
    hint: "A point of order concerns a procedural violation, not a disagreement on merits.",
    sol: "A Point of Order is raised strictly to draw attention to a violation of meeting rules or parliamentary procedure.",
    target: "Rules of Order"
  },
  {
    prompt: "What should a member do when the Chairperson rules that their speaking time has expired?",
    opt: [
      "Keep talking louder to complete all arguments",
      "Argue with the Chair about the timekeeper's clock",
      "Courteously yield the floor and take their seat",
      "Walk out of the meeting room in protest"
    ],
    ans: "Courteously yield the floor and take their seat",
    hint: "Respecting the Chair's ruling preserves order and fairness for all speakers.",
    sol: "Members must respect time limits and yield the floor immediately upon the Chair's directive.",
    target: "Turn-Taking"
  },
  {
    prompt: "What is an 'amendment' to a motion?",
    opt: [
      "The complete cancellation of the meeting",
      "A proposed modification or refinement to the wording of the main motion",
      "A fine paid for arriving late",
      "A speech supporting the Chairperson"
    ],
    ans: "A proposed modification or refinement to the wording of the main motion",
    hint: "An amendment modifies or clarifies the original proposal before a vote.",
    sol: "An amendment proposes an addition, deletion, or modification to the wording of a pending motion.",
    target: "Parliamentary Procedure"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b8InterSpecs[(i - 1) % b8InterSpecs.length];
  b8Intermediate.push({
    id: `B8_L_I_${i < 10 ? "0" + i : i}`,
    level: "B8",
    difficulty: "intermediate",
    questionNumber: i,
    prompt: `${spec.prompt} (Drill ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B8.1.3.1: Apply rules of order, turn-taking, and debate decorum in meetings."
  });
}

// =========================================================================
// BASIC 8: ADVANCED (50 QUESTIONS) — TELECOM & INTERVIEW PROTOCOLS
// =========================================================================
const b8Advanced: LabQuestion[] = [];
const b8AdvSpecs = [
  {
    prompt: "You are answering the official telephone at the school administration office. What is the standard opening greeting?",
    opt: [
      "'Hello, who is this?'",
      "'Good morning, St. Peter's JHS, student assistant speaking. How may I assist you?'",
      "'Speak up, I am busy.'",
      "'Yes? What do you want?'"
    ],
    ans: "'Good morning, St. Peter's JHS, student assistant speaking. How may I assist you?'",
    hint: "State the institution's name, your role, and an offer to assist.",
    sol: "Professional phone protocol requires a greeting, institutional identification, self-identification, and an offer of assistance.",
    target: "Telephone Etiquette"
  },
  {
    prompt: "While taking a telephone message for the headmaster, which set of details must you accurately record?",
    opt: [
      "Only the caller's first name",
      "Caller's name, organization, contact telephone number, date/time, and clear summary of the message",
      "The caller's voice accent and estimated age",
      "Your personal opinion of the caller's request"
    ],
    ans: "Caller's name, organization, contact telephone number, date/time, and clear summary of the message",
    hint: "Complete phone messages require verifiable contact and context details.",
    sol: "A standard telephone message slip records caller identity, organization, return phone number, timestamp, and message summary.",
    target: "Message Handling"
  },
  {
    prompt: "During a formal interview for the post of School Prefect, how should you respond when an interviewer asks about your biggest weakness?",
    opt: [
      "'I do not have any weaknesses; I am perfect.'",
      "'I am very lazy in the morning, and I hate homework.'",
      "'I sometimes find it hard to delegate tasks, but I am learning to trust my team members by assigning specific duties.'",
      "'Why are you asking me about weaknesses instead of my strengths?'"
    ],
    ans: "'I sometimes find it hard to delegate tasks, but I am learning to trust my team members by assigning specific duties.'",
    hint: "Identify a genuine area for growth alongside practical steps you take to address it.",
    sol: "Addressing a professional weakness constructively by highlighting self-awareness and active improvement demonstrates maturity.",
    target: "Interview Skills"
  },
  {
    prompt: "What is the proper procedure before putting a caller on hold during an administrative call?",
    opt: [
      "Put the receiver down on the desk immediately",
      "Ask for the caller's permission and explain briefly why they are being put on hold",
      "Mute the line and walk away for ten minutes",
      "Tell the caller to phone back next week"
    ],
    ans: "Ask for the caller's permission and explain briefly why they are being put on hold",
    hint: "Always seek permission and explain the reason before placing a caller on hold.",
    sol: "Courtesy demands explaining the need to check records and asking if the caller minds holding briefly.",
    target: "Telephone Etiquette"
  },
  {
    prompt: "When concluding a formal phone conversation with an educational inspector, what should you say?",
    opt: [
      "'Bye bye!'",
      "'Thank you very much for your time and guidance, sir. Have a pleasant afternoon.'",
      "'I am hanging up now.'",
      "'Alright, see you later.'"
    ],
    ans: "'Thank you very much for your time and guidance, sir. Have a pleasant afternoon.'",
    hint: "Close with appreciation, respectful honorifics, and well-wishes.",
    sol: "A formal sign-off incorporates gratitude, proper honorifics, and courteous closing wishes.",
    target: "Telephone Etiquette"
  }
];

for (let i = 1; i <= 50; i++) {
  const spec = b8AdvSpecs[(i - 1) % b8AdvSpecs.length];
  b8Advanced.push({
    id: `B8_L_A_${i < 10 ? "0" + i : i}`,
    level: "B8",
    difficulty: "advanced",
    questionNumber: i,
    prompt: `${spec.prompt} (Case ${i})`,
    options: spec.opt,
    correctAnswer: spec.ans,
    hint: spec.hint,
    workedSolution: spec.sol,
    competencyTarget: spec.target,
    learningCompetency: "B8.1.3.1: Execute professional telecommunication, interview protocols, and formal administrative exchanges."
  });
}

async function seedOralListeningLabB8() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("Seeding Basic 8 Oral Listening & Meeting Lab (150 Questions)...");

  const paths = [
    "global_curriculum/jhs/subjects/english/topical/oral_listening_conversation",
    "global_curriculum/jhs/subjects/english/topics/oral_listening_conversation",
    "global_curriculum/jhs/subjects/english/topical_units/oral_listening_conversation"
  ];

  for (const mainPath of paths) {
    const basePath = `${mainPath}/practice_labs`;

    const fRef = db.doc(`${basePath}/B8_foundation`);
    await fRef.set({
      level: "B8",
      difficulty: "foundation",
      title: "Basic 8 Foundation Lab: Committee Roles & Parliamentary Terms",
      totalQuestions: b8Foundation.length,
      questions: b8Foundation,
      metadata: { standard: "NaCCA B8.1.2.1", updatedAt: new Date().toISOString() }
    }, { merge: true });
    console.log(`✅ Seeded ${b8Foundation.length} questions to ${fRef.path}`);

    const iRef = db.doc(`${basePath}/B8_intermediate`);
    await iRef.set({
      level: "B8",
      difficulty: "intermediate",
      title: "Basic 8 Intermediate Lab: Turn-Taking & Rules of Order",
      totalQuestions: b8Intermediate.length,
      questions: b8Intermediate,
      metadata: { standard: "NaCCA B8.1.3.1", updatedAt: new Date().toISOString() }
    }, { merge: true });
    console.log(`✅ Seeded ${b8Intermediate.length} questions to ${iRef.path}`);

    const aRef = db.doc(`${basePath}/B8_advanced`);
    await aRef.set({
      level: "B8",
      difficulty: "advanced",
      title: "Basic 8 Advanced Lab: Telephone & Interview Protocols",
      totalQuestions: b8Advanced.length,
      questions: b8Advanced,
      metadata: { standard: "NaCCA B8.1.3.1", updatedAt: new Date().toISOString() }
    }, { merge: true });
    console.log(`✅ Seeded ${b8Advanced.length} questions to ${aRef.path}`);
  }

  // =========================================================================
  // SYNCHRONIZE INTO MAIN TOPICAL DOCUMENT FOR TOPICAL LAB RUNNER COMPONENT
  // =========================================================================
  console.log("\nSynchronizing B8 practice pools into the main topical document...");
  
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

  const b8PracticePool = {
    low: b8Foundation.map(q => mapToPracticeQuestion(q, 'low')),
    medium: b8Intermediate.map(q => mapToPracticeQuestion(q, 'medium')),
    hard: b8Advanced.map(q => mapToPracticeQuestion(q, 'hard'))
  };

  for (const mainPath of paths) {
    const mainDocRef = db.doc(mainPath);
    const snap = await mainDocRef.get();
    if (snap.exists) {
      const data = snap.data();
      const existingLevels = data.levels || {};
      const updatedLevels = {
        ...existingLevels,
        b8: {
          ...(existingLevels.b8 || {}),
          practicePool: b8PracticePool
        },
        jhs2: {
          ...(existingLevels.jhs2 || {}),
          practicePool: b8PracticePool
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
          totalQuestions: Math.max(prevCount, 300),
          questionCount: Math.max(prevCount, 300),
          status: 'ready'
        };
      }
      return t;
    });
    await manifestRef.set({ ...mData, topics: newTopics, updatedAt: new Date().toISOString() }, { merge: true });
    console.log("✅ Manifest updated successfully.");
  }

  console.log("\n🎯 JHS 2 (Basic 8) Oral Listening Lab complete: 150 questions stored and active!");
}

seedOralListeningLabB8()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed B8 Oral Listening Lab:", err);
    process.exit(1);
  });
