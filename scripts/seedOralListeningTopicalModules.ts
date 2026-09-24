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
  } catch (e) {}

  if (!fbAdmin.apps?.length) {
    try {
      fbAdmin.initializeApp({ credential: fbAdmin.credential.applicationDefault() });
    } catch (e) {}
  }
  return fbAdmin.firestore();
}

// =========================================================================
// TEXTBOOK-GRADE NACCA CONCEPT NOTES (MARKDOWN FOR TAB 1)
// =========================================================================

const B7_NOTES_MARKDOWN = `### 1. Active Listening Mechanics & Barriers to Communication (Basic 7)

Active listening is a dynamic, disciplined cognitive process distinct from passive physiological hearing.

#### A. The Five Sequential Stages of Active Listening
1. **Hearing (Physiological Reception):** Physical sensory reception of auditory sound waves via the ear canal and tympanic membrane without automatic comprehension.
2. **Attending (Selective Focus):** Actively filtering ambient environmental noise to focus cognitive attention solely on the speaker's vocal stream.
3. **Interpreting (Decoding & Semantics):** Assigning accurate linguistic meaning to words while reading non-verbal kinesics (facial expressions, body posture, gestures).
4. **Evaluating (Critical Appraisal):** Distinguishing empirical factual evidence from emotional bias, prejudice, and unsubstantiated personal claims.
5. **Responding (Feedback Loop):** Offering timely feedback, reflective paraphrasing, clarifying questions, and appropriate non-verbal nodding.

#### B. The SOLER Framework for Non-Verbal Attending
* **S — Square:** Sit or stand squarely facing the speaker to communicate direct personal engagement.
* **O — Open Posture:** Maintain uncrossed arms and legs to signify welcoming receptivity.
* **L — Lean Forward:** Subtly lean toward the interlocutor to demonstrate active cognitive interest.
* **E — Eye Contact:** Sustain respectful, culturally appropriate eye contact without aggressive staring.
* **R — Relaxed Attitude:** Project composed calmness to put the speaker at psychological ease.

#### C. Polite Registers & Modal Auxiliaries
Formal discourse requires modal softening (*could*, *would*, *may*, *might*) rather than bald imperatives.

| Communication Goal | Informal / Inappropriate Register | Formal / Polite NaCCA Register |
| :--- | :--- | :--- |
| **Seeking Clarification** | *"What did you say?"* / *"Say it again."* | *"Pardon me, sir/madam, could you kindly repeat that point?"* |
| **Making a Request** | *"Give me that book."* / *"Hand it over."* | *"Would you mind lending me that reference book for a few minutes?"* |
| **Expressing Disagreement** | *"You are totally wrong."* | *"I respect your perspective; however, I see this matter differently because..."* |
| **Offering Assistance** | *"Want some help?"* | *"May I be of assistance to you with those packages, please?"* |
`;

const B8_NOTES_MARKDOWN = `### 1. Parliamentary Meeting Decorum & Telecom Protocols (Basic 8)

Formal institutional meetings operate under strict parliamentary rules of order and established communicative conventions.

#### A. Key Parliamentary & Meeting Terminology
* **Quorum:** The mandatory minimum number of voting members required to be physically or virtually present for proceedings to be legally valid.
* **Agenda:** The standardized, numbered schedule of business items arranged in order of deliberation.
* **Minutes:** The formal, objective historical record of decisions, resolutions, and motions ratified from a prior sitting.
* **Motion:** A formal verbal proposal placed before the assembly beginning with the formula: *"I move that..."*
* **Seconding:** The formal endorsement by a second member enabling the motion to be opened for debate.
* **Point of Order:** An immediate procedural objection raised when meeting regulations, constitution, or standing orders are breached.
* **Adjournment:** The formal suspension or termination of a sitting until a subsequent scheduled date.

#### B. Protocol for Conversational Turn-Taking
1. **Addressing the Chair:** All remarks, questions, and rejoinders must be directed to the presiding Chairperson (*"Mr./Madam Chairperson..."*), never directly across the floor to an opponent.
2. **Floor Recognition:** A member must catch the Chairperson's eye and await official recognition before addressing the gathering.
3. **Yielding the Floor:** Speakers must yield gracefully upon the sounding of the gavel or when their allotted speaking time expires.

#### C. Telecommunication Etiquette in Institutional Contexts
* **Incoming Business Calls:** Professional greeting + Organization identifier + Personal name + Courteous offer of service.
  * *Example:* *"Good morning, St. Peter's Junior High School, Kweku Mensah speaking. How may I direct your call?"*
* **Outgoing Official Calls:** Immediate self-identification + Statement of purpose + Inquiring if the recipient has time to speak + Respectful sign-off.
`;

const B9_NOTES_MARKDOWN = `### 1. Rhetorical Public Speaking & Formal Debate Elocution (Basic 9)

Formal competitive debates and persuasive oratorical addresses are governed by structured logic and classical rhetorical appeals.

#### A. The Classical Rhetorical Triangle
Effective public addresses balance three interconnected appeals formulated by Aristotle:
1. **Ethos (Credibility & Character):** Establishing speaker integrity, moral authority, calm composure, and balanced respect for opponents.
2. **Logos (Logical Reasoning):** Providing coherent deductive/inductive logic, statistical data, verified historical precedents, and causal evidence.
3. **Pathos (Emotional & Moral Resonance):** Inspiring empathy, civic duty, shared values, and compassion without resorting to deceptive manipulation.

#### B. Parliamentary Debate Structure & Team Allocations
* **Proposition / Affirmative:**
  * Defines the key terms of the motion within reasonable real-world contexts.
  * Constructs the prime substantive arguments using the **PEEL** structure (*Point, Explanation, Evidence, Link*).
* **Opposition:**
  * Rebuts and exposes flaws, factual inaccuracies, and unsupported premises in the Proposition's case.
  * Builds an alternative counter-constructive model proving why the motion produces net harm.

#### C. Mandatory Formal Salutation Protocol
Before presenting arguments, every competitive debater must address the assembly in strict hierarchical order:
> *"Mr. Chairman, Esteemed Panel of Adjudicators, Accurate Timekeeper, Impartial Co-debaters, Worthy Opponents, Ladies and Gentlemen..."*

#### D. The Step-by-Step Method for Oral Questions
* **Step 1:** Analyze the context (Interpersonal peer, institutional meeting, formal debate, or telecommunication).
* **Step 2:** Identify the social distance and required register (Informal, consultative, or formal parliamentary).
* **Step 3:** Eliminate bald imperatives, accusatory personal statements, and jargon.
* **Step 4:** Select the option using polite modal auxiliaries (*could*, *would*, *may*), proper parliamentary terminology, or classical oratorical salutations.
`;

// =========================================================================
// STEP-BY-STEP WORKED EXAMPLES
// =========================================================================

const B7_WORKED_EXAMPLES = [
  {
    id: "we_b7_oral_01",
    title: "Worked Example 1: Formulating a Polite Request to an Authority",
    problem: "You need to borrow a reference dictionary from the school librarian for class research. Formulate the most appropriate and polite spoken request.",
    steps: [
      "Analyze the social dynamic: The librarian is an adult authority figure in an academic institution, requiring a formal, respectful register.",
      "Evaluate tone: Commands such as 'Give me that dictionary' or blunt statements like 'I want that dictionary' are impolite and breach institutional etiquette.",
      "Employ modal softening: Use the polite modal auxiliary 'Could I please' or 'Would you mind if I borrowed', preceded by a polite attention-getter ('Excuse me, Madam/Sir').",
      "Confirm complete utterance: 'Excuse me, Madam, could I please borrow that reference dictionary for my class research?'"
    ],
    finalAnswer: "'Excuse me, Madam, could I please borrow that reference dictionary for a few minutes?'"
  },
  {
    id: "we_b7_oral_02",
    title: "Worked Example 2: Distinguishing Hearing from Active Listening",
    problem: "A student sits in class and perceives the teacher's voice as sound vibrations while daydreaming about football. Explain whether active listening took place.",
    steps: [
      "Define physiological hearing: The ear received auditory waves, which constitutes hearing.",
      "Check active listening criteria: Active listening requires attending (focusing attention), interpreting (decoding meaning), and evaluating.",
      "Conclude: Because cognitive attention was absent, only hearing occurred; active listening did not take place."
    ],
    finalAnswer: "No active listening occurred; only physiological hearing took place because the student failed to focus selective attention and interpret meaning."
  }
];

const B8_WORKED_EXAMPLES = [
  {
    id: "we_b8_oral_01",
    title: "Worked Example 1: Applying Parliamentary Meeting Terminology",
    problem: "During an official SRC meeting, a representative proposes that the school establish a debate club. What is the correct parliamentary term for this proposal, and how should it be phrased?",
    steps: [
      "Identify the formal procedure: A formal proposal introduced for debate in an official sitting is termed a 'motion'.",
      "Identify the mover's standardized phrasing: In parliamentary decorum, motions begin with 'I move that...'",
      "Identify the required next step: Before the motion can be debated by the floor, it must be 'seconded' by another member."
    ],
    finalAnswer: "The proposal is a 'motion', formally stated as: 'Mr. Chairman, I move that an SRC Debate Club be established.'"
  },
  {
    id: "we_b8_oral_02",
    title: "Worked Example 2: Institutional Telephone Answering Protocol",
    problem: "You are assigned to answer incoming calls at the school administration office. Outline the standard professional response.",
    steps: [
      "Include a time-appropriate greeting ('Good morning' / 'Good afternoon').",
      "Identify the institution ('Wesley Junior High School').",
      "Identify the speaker clearly ('Kofi Mensah speaking').",
      "Offer courteous assistance ('How may I assist you today?')."
    ],
    finalAnswer: "'Good morning, Wesley Junior High School, Kofi Mensah speaking. How may I assist you today?'"
  }
];

const B9_WORKED_EXAMPLES = [
  {
    id: "we_b9_oral_01",
    title: "Worked Example 1: Crafting the Mandatory Debate Salutation",
    problem: "Write the correct hierarchical salutation for a competitive JHS inter-school debate.",
    steps: [
      "Identify the highest authority present: The presiding Chairperson ('Mr./Madam Chairman').",
      "Acknowledge the judges: 'Esteemed Panel of Adjudicators / Judges'.",
      "Acknowledge the official timekeeper: 'Accurate Timekeeper'.",
      "Acknowledge fellow debaters and opponents: 'My Co-debaters and Worthy Opponents'.",
      "Address the wider audience: 'Ladies and Gentlemen.'"
    ],
    finalAnswer: "'Mr. Chairman, Esteemed Panel of Adjudicators, Accurate Timekeeper, Co-debaters, Worthy Opponents, Ladies and Gentlemen...'"
  },
  {
    id: "we_b9_oral_02",
    title: "Worked Example 2: Structuring a Persuasive Point Using PEEL",
    problem: "Construct a debate point supporting the motion that 'Smartphones should be utilized for classroom learning' using the PEEL method.",
    steps: [
      "Point (P): Smartphones provide immediate access to digital reference materials.",
      "Explanation (E): When students encounter unfamiliar concepts in science or geography, internet connectivity allows instant visualization.",
      "Evidence (E): A UNESCO 2023 study found a 24% increase in student engagement when digital research was integrated into STEM classes.",
      "Link (L): Therefore, integrating smartphones directly strengthens classroom academic outcomes."
    ],
    finalAnswer: "Point: Instant access to research. Explanation: Broadens concept clarity. Evidence: 24% UNESCO engagement gain. Link: Reaffirms that smartphones enhance classroom learning."
  }
];

// =========================================================================
// PRACTICE LAB QUESTION POOLS (B7, B8, B9 GRADED POOLS)
// =========================================================================

const B7_QUESTIONS = [
  // Low (Foundational)
  {
    id: "b7_oral_low_01",
    difficulty: "low",
    level: "B7",
    prompt: "You need to borrow a reference dictionary from the school librarian. Which expression is the most polite and appropriate?",
    options: [
      "Give me that dictionary on your table.",
      "I want to take that dictionary now.",
      "Excuse me, madam, could I please borrow that dictionary for a few minutes?",
      "Is that dictionary yours to keep?"
    ],
    correctAnswer: "Excuse me, madam, could I please borrow that dictionary for a few minutes?",
    hint: "Polite requests to authority use modal auxiliaries like 'could' and respectful honorifics.",
    workedSolution: "Option C employs appropriate attention-getting ('Excuse me'), respectful honorifics ('madam'), and polite modal auxiliary phrasing ('could I please').",
    points: 1,
    learningCompetency: "B7.1.3.1: Demonstrate polite registers in formal school interactions."
  },
  {
    id: "b7_oral_low_02",
    difficulty: "low",
    level: "B7",
    prompt: "Which component of the SOLER framework represents keeping an open posture without crossed arms?",
    options: ["S (Square)", "O (Open posture)", "L (Lean forward)", "E (Eye contact)"],
    correctAnswer: "O (Open posture)",
    hint: "O stands for Open posture.",
    workedSolution: "In the SOLER active listening model, 'O' denotes maintaining an open posture to signal psychological receptivity.",
    points: 1,
    learningCompetency: "B7.1.2.1: Apply non-verbal attending cues during interpersonal conversations."
  },
  {
    id: "b7_oral_low_03",
    difficulty: "low",
    level: "B7",
    prompt: "What is the physiological stage of receiving sound waves without necessarily understanding their meaning called?",
    options: ["Evaluating", "Interpreting", "Hearing", "Responding"],
    correctAnswer: "Hearing",
    hint: "The physical sensory reception of sound.",
    workedSolution: "Hearing is the purely biological reception of auditory vibrations, whereas listening requires cognitive processing.",
    points: 1,
    learningCompetency: "B7.1.2.1: Distinguish between physiological hearing and active listening."
  },
  // Medium (Intermediate)
  {
    id: "b7_oral_med_01",
    difficulty: "medium",
    level: "B7",
    prompt: "During a collaborative group project, a classmate presents an opinion you strongly disagree with. Which spoken response best demonstrates active listening and civility?",
    options: [
      "Be quiet, that makes no sense at all.",
      "I see your point regarding cost; however, have we considered the environmental consequences?",
      "You always come up with the worst ideas.",
      "Let us ignore everything you just said and move on."
    ],
    correctAnswer: "I see your point regarding cost; however, have we considered the environmental consequences?",
    hint: "Validate the speaker's contribution before offering a constructive alternative.",
    workedSolution: "Option B demonstrates active listening by acknowledging the peer's point ('I see your point') while introducing a counter-consideration politely.",
    points: 1,
    learningCompetency: "B7.1.3.1: Engage constructively in collaborative peer discussions."
  },
  {
    id: "b7_oral_med_02",
    difficulty: "medium",
    level: "B7",
    prompt: "What active listening technique involves restating the speaker's main idea in your own words to verify mutual understanding?",
    options: ["Eavesdropping", "Paraphrasing", "Interrupting", "Cross-examination"],
    correctAnswer: "Paraphrasing",
    hint: "Restating content in different words.",
    workedSolution: "Paraphrasing reflects back the core essence of the message in the listener's own phrasing to eliminate miscommunication.",
    points: 1,
    learningCompetency: "B7.1.2.1: Apply paraphrasing techniques to confirm comprehension."
  },
  // Hard (Advanced)
  {
    id: "b7_oral_hard_01",
    difficulty: "hard",
    level: "B7",
    prompt: "Which barrier to effective listening occurs when a listener rejects an argument solely because of personal dislike toward the speaker's background?",
    options: ["Environmental noise", "Physiological fatigue", "Emotional bias / prejudice", "Semantic ambiguity"],
    correctAnswer: "Emotional bias / prejudice",
    hint: "Judging the speaker rather than evaluating the logic of the message.",
    workedSolution: "Emotional bias and prejudice prevent objective evaluation of arguments by substituting personal prejudice for rational analysis.",
    points: 1,
    learningCompetency: "B7.1.2.1: Identify cognitive and emotional barriers to effective listening."
  }
];

const B8_QUESTIONS = [
  // Low (Foundational)
  {
    id: "b8_oral_low_01",
    difficulty: "low",
    level: "B8",
    prompt: "During a formal committee meeting, a member wishes to propose a new policy. What is the correct term for this formal proposal?",
    options: ["An agenda", "A motion", "The minutes", "A quorum"],
    correctAnswer: "A motion",
    hint: "A formal proposal placed before an assembly for debate and voting.",
    workedSolution: "In parliamentary procedure, a formal proposal introduced for debate is termed a 'motion'.",
    points: 1,
    learningCompetency: "B8.1.3.1: Apply formal committee vocabulary and meeting procedures."
  },
  {
    id: "b8_oral_low_02",
    difficulty: "low",
    level: "B8",
    prompt: "What is the term for the mandatory minimum number of members required to be present before a meeting can legitimately transact business?",
    options: ["Majority", "Quorum", "Consensus", "Plurality"],
    correctAnswer: "Quorum",
    hint: "The minimum attendance threshold.",
    workedSolution: "A quorum is the statutory minimum number of members needed to make meeting proceedings legally binding.",
    points: 1,
    learningCompetency: "B8.1.3.1: Master formal meeting protocols and vocabulary."
  },
  // Medium (Intermediate)
  {
    id: "b8_oral_med_01",
    difficulty: "medium",
    level: "B8",
    prompt: "In a formal meeting, to whom must all member arguments and questions be addressed?",
    options: [
      "Directly to the member with whom you disagree",
      "To the general audience",
      "To the presiding Chairperson",
      "To the recording secretary"
    ],
    correctAnswer: "To the presiding Chairperson",
    hint: "Members address the chair to prevent direct interpersonal confrontation.",
    workedSolution: "Addressing the presiding Chairperson maintains decorum and prevents personal conflict on the floor.",
    points: 1,
    learningCompetency: "B8.1.3.1: Apply parliamentary turn-taking decorum."
  },
  {
    id: "b8_oral_med_02",
    difficulty: "medium",
    level: "B8",
    prompt: "When receiving a professional telephone call on behalf of an institution, which element should be stated FIRST?",
    options: [
      "Your personal cell phone number",
      "A courteous greeting and institutional identity",
      "Inquiring how much money the caller has",
      "A demand that the caller hang up"
    ],
    correctAnswer: "A courteous greeting and institutional identity",
    hint: "Greeting + Institutional identity.",
    workedSolution: "Professional telecommunication mandates greeting the caller and stating the organization's name immediately.",
    points: 1,
    learningCompetency: "B8.1.2.1: Execute professional telephone etiquette."
  },
  // Hard (Advanced)
  {
    id: "b8_oral_hard_01",
    difficulty: "hard",
    level: "B8",
    prompt: "A member notices that the Chairperson has skipped item 4 on the adopted agenda without approval. What formal procedural step should the member take?",
    options: [
      "Shout across the room to stop the meeting",
      "Raise a Point of Order politely to draw attention to the breach of agenda order",
      "Walk out of the meeting immediately in protest",
      "Interrupt another speaker mid-sentence"
    ],
    correctAnswer: "Raise a Point of Order politely to draw attention to the breach of agenda order",
    hint: "An objection raised when meeting rules are breached.",
    workedSolution: "A 'Point of Order' is the formal mechanism to notify the chair that procedural rules are being violated.",
    points: 1,
    learningCompetency: "B8.1.3.1: Implement parliamentary points of order correctly."
  }
];

const B9_QUESTIONS = [
  // Low (Foundational)
  {
    id: "b9_oral_low_01",
    difficulty: "low",
    level: "B9",
    prompt: "In a formal debate, what is the primary purpose of delivering a structured rebuttal?",
    options: [
      "To insult the opposing speakers personally",
      "To systematically dismantle and invalidate opposing claims with logical evidence",
      "To consume the allocated time limit without presenting arguments",
      "To agree with the opponents and concede defeat"
    ],
    correctAnswer: "To systematically dismantle and invalidate opposing claims with logical evidence",
    hint: "Rebuttals attack the substance and logic of the opponent's case.",
    workedSolution: "A formal rebuttal aims to expose logical fallacies and dismantle opposing arguments with factual evidence, strengthening the speaker's core thesis.",
    points: 1,
    learningCompetency: "B9.1.3.1: Construct structured arguments and rebuttals in competitive debate."
  },
  {
    id: "b9_oral_low_02",
    difficulty: "low",
    level: "B9",
    prompt: "Which component of Aristotle's Rhetorical Triangle focuses on speaker credibility, moral integrity, and authority?",
    options: ["Ethos", "Logos", "Pathos", "Kairos"],
    correctAnswer: "Ethos",
    hint: "Ethos pertains to ethics, character, and credibility.",
    workedSolution: "Ethos establishes the speaker's moral authority, trustworthiness, and expertise before the audience.",
    points: 1,
    learningCompetency: "B9.1.2.1: Apply rhetorical appeals (Ethos, Pathos, Logos) in persuasive speeches."
  },
  // Medium (Intermediate)
  {
    id: "b9_oral_med_01",
    difficulty: "medium",
    level: "B9",
    prompt: "Which of the following represents the correct hierarchical opening salutation for an inter-school debate?",
    options: [
      "Hello everyone, let me tell you why my opponents are wrong.",
      "Mr. Chairman, Esteemed Panel of Adjudicators, Accurate Timekeeper, Impartial Co-debaters, Ladies and Gentlemen...",
      "To whom it may concern, I am here to speak today.",
      "My friends and family, thank you for coming to my speech."
    ],
    correctAnswer: "Mr. Chairman, Esteemed Panel of Adjudicators, Accurate Timekeeper, Impartial Co-debaters, Ladies and Gentlemen...",
    hint: "Chairman -> Judges -> Timekeeper -> Co-debaters -> Audience.",
    workedSolution: "Option B respects the exact parliamentary and oratorical protocol recognized in Ghanaian and West African competitive debate standards.",
    points: 1,
    learningCompetency: "B9.1.3.1: Deliver formal oratorical salutations adhering to protocol."
  },
  {
    id: "b9_oral_med_02",
    difficulty: "medium",
    level: "B9",
    prompt: "In the PEEL argumentative model used in persuasive public speaking, what does the second 'E' represent?",
    options: ["Emotion", "Evidence", "Exaggeration", "Entertainment"],
    correctAnswer: "Evidence",
    hint: "Point, Explanation, Evidence, Link.",
    workedSolution: "PEEL stands for Point, Explanation, Evidence, and Link. The second 'E' refers to empirical evidence (statistics, studies, examples).",
    points: 1,
    learningCompetency: "B9.1.3.1: Structure persuasive arguments using PEEL."
  },
  // Hard (Advanced)
  {
    id: "b9_oral_hard_01",
    difficulty: "hard",
    level: "B9",
    prompt: "In a formal speech arguing for community sanitation reform, a speaker cites municipal disease statistics alongside medical research. Which rhetorical appeal is primarily being utilized?",
    options: ["Pathos", "Logos", "Ethos", "Mythos"],
    correctAnswer: "Logos",
    hint: "Appeal to logic, data, and verified factual evidence.",
    workedSolution: "Using verified empirical statistics and peer-reviewed medical data appeals directly to rational logic (Logos).",
    points: 1,
    learningCompetency: "B9.1.2.1: Deploy Logos effectively in persuasive civic speeches."
  }
];

// All questions aggregated
const ALL_ORAL_LISTENING_QUESTIONS = [
  ...B7_QUESTIONS,
  ...B8_QUESTIONS,
  ...B9_QUESTIONS
];

// =========================================================================
// UNIFIED TOPICAL LAB PAYLOAD
// =========================================================================

const oralListeningPayload = {
  id: "oral_listening_conversation",
  topicId: "oral_listening_conversation",
  subjectId: "english",
  subject: "English Language",
  tier: "Junior Secondary (JHS)",
  strandId: "strand_1_oral_language",
  strandCode: "S1",
  strandName: "STRAND 1: ORAL LANGUAGE",
  strand: "STRAND 1: ORAL LANGUAGE",
  subStrandTitle: "Conversation, Listening & Dialogue",
  subStrand: "Conversation, Listening & Dialogue",
  topicTitle: "Listening Comprehension & Public Speaking",
  title: "Listening Comprehension & Public Speaking",
  badge: "NaCCA Common Core Programme (CCP)",
  summary: "Comprehensive NaCCA-aligned curriculum module covering active listening mechanics, polite modal registers, meeting decorum, telecommunication protocols, debate elocution, and rhetorical delivery for Basic 7 to Basic 9.",
  description: "Master active listening mechanics, polite modal registers, meeting decorum, telecommunication protocols, debate elocution, and rhetorical delivery across Basic 7, Basic 8, and Basic 9.",
  gradeLevels: ["B7 (JHS 1)", "B8 (JHS 2)", "B9 (JHS 3)"],
  levelsAvailable: ["B7", "B8", "B9"],
  curriculumIndicators: ["B7.1.2.1", "B7.1.3.1", "B8.1.2.1", "B8.1.3.1", "B9.1.2.1", "B9.1.3.1"],
  totalQuestions: ALL_ORAL_LISTENING_QUESTIONS.length,
  totalPracticeQuestions: ALL_ORAL_LISTENING_QUESTIONS.length,
  questionCount: ALL_ORAL_LISTENING_QUESTIONS.length,
  version: 1,

  // Concept Notes for Legacy Compatibility
  conceptNotes: {
    b7_overview: B7_NOTES_MARKDOWN,
    b8_progression: B8_NOTES_MARKDOWN,
    b9_mastery: B9_NOTES_MARKDOWN,
    module1_foundational_interpersonal: {
      title: "Module 1: Foundational Interpersonal Discourse (B7 - JHS 1)",
      description: "Active listening mechanics, barriers to effective communication, and polite modal registers."
    },
    module2_interactive_meetings: {
      title: "Module 2: Interactive Meeting & Telecom Protocols (B8 - JHS 2)",
      description: "Conversational turn-taking, formal committee vocabulary, and professional telephone communication."
    },
    module3_rhetorical_debates: {
      title: "Module 3: Rhetorical Public Speaking & Formal Debate (B9 - JHS 3)",
      description: "Anatomy of parliamentary debates, team roles, mandatory salutations, and rhetorical appeals."
    }
  },

  // Raw Questions for Standard Adapters
  questions: ALL_ORAL_LISTENING_QUESTIONS,

  // Tiered Level Structure for TopicalLabRunner (Tab 1 Notes + Worked Examples & Tab 2 Practice Pools)
  levels: {
    b7: {
      levelTitle: "Basic 7 (JHS 1) • Interpersonal Discourse & Active Listening",
      summary: "Master active listening mechanics, the SOLER framework, and polite modal auxiliaries.",
      notes: B7_NOTES_MARKDOWN,
      workedExamples: B7_WORKED_EXAMPLES,
      practicePool: {
        low: B7_QUESTIONS.filter(q => q.difficulty === 'low'),
        medium: B7_QUESTIONS.filter(q => q.difficulty === 'medium'),
        hard: B7_QUESTIONS.filter(q => q.difficulty === 'hard')
      }
    },
    b8: {
      levelTitle: "Basic 8 (JHS 2) • Parliamentary Decorum & Telecom Protocols",
      summary: "Master meeting vocabulary (quorum, motions, minutes), turn-taking rules, and official telephone protocols.",
      notes: B8_NOTES_MARKDOWN,
      workedExamples: B8_WORKED_EXAMPLES,
      practicePool: {
        low: B8_QUESTIONS.filter(q => q.difficulty === 'low'),
        medium: B8_QUESTIONS.filter(q => q.difficulty === 'medium'),
        hard: B8_QUESTIONS.filter(q => q.difficulty === 'hard')
      }
    },
    b9: {
      levelTitle: "Basic 9 (JHS 3) • Oratory, Classical Rhetoric & Formal Debate",
      summary: "Master parliamentary debate roles, the Aristotelian rhetorical triangle (Ethos, Logos, Pathos), and PEEL persuasive structuring.",
      notes: B9_NOTES_MARKDOWN,
      workedExamples: B9_WORKED_EXAMPLES,
      practicePool: {
        low: B9_QUESTIONS.filter(q => q.difficulty === 'low'),
        medium: B9_QUESTIONS.filter(q => q.difficulty === 'medium'),
        hard: B9_QUESTIONS.filter(q => q.difficulty === 'hard')
      }
    },
    // Aliases for compatibility
    jhs1: {
      levelTitle: "Basic 7 (JHS 1) • Interpersonal Discourse & Active Listening",
      summary: "Master active listening mechanics, the SOLER framework, and polite modal auxiliaries.",
      notes: B7_NOTES_MARKDOWN,
      workedExamples: B7_WORKED_EXAMPLES,
      practicePool: {
        low: B7_QUESTIONS.filter(q => q.difficulty === 'low'),
        medium: B7_QUESTIONS.filter(q => q.difficulty === 'medium'),
        hard: B7_QUESTIONS.filter(q => q.difficulty === 'hard')
      }
    },
    jhs2: {
      levelTitle: "Basic 8 (JHS 2) • Parliamentary Decorum & Telecom Protocols",
      summary: "Master meeting vocabulary (quorum, motions, minutes), turn-taking rules, and official telephone protocols.",
      notes: B8_NOTES_MARKDOWN,
      workedExamples: B8_WORKED_EXAMPLES,
      practicePool: {
        low: B8_QUESTIONS.filter(q => q.difficulty === 'low'),
        medium: B8_QUESTIONS.filter(q => q.difficulty === 'medium'),
        hard: B8_QUESTIONS.filter(q => q.difficulty === 'hard')
      }
    },
    jhs3: {
      levelTitle: "Basic 9 (JHS 3) • Oratory, Classical Rhetoric & Formal Debate",
      summary: "Master parliamentary debate roles, the Aristotelian rhetorical triangle (Ethos, Logos, Pathos), and PEEL persuasive structuring.",
      notes: B9_NOTES_MARKDOWN,
      workedExamples: B9_WORKED_EXAMPLES,
      practicePool: {
        low: B9_QUESTIONS.filter(q => q.difficulty === 'low'),
        medium: B9_QUESTIONS.filter(q => q.difficulty === 'medium'),
        hard: B9_QUESTIONS.filter(q => q.difficulty === 'hard')
      }
    }
  },

  metadata: {
    isEnglishLanguage: true,
    curriculum: "NaCCA Common Core Programme (CCP) Standard",
    framework: "National Standards for JHS 1 - JHS 3",
    difficultyLevels: ["foundation", "intermediate", "advanced"],
    hasPracticeLab: true,
    updatedAt: new Date().toISOString()
  }
};

async function seedOralListeningTopicalModules() {
  console.log("Connecting to Firestore database...");
  const db = await getDb();

  console.log("1. Writing full topical document to primary path:");
  console.log("   global_curriculum/jhs/subjects/english/topical/oral_listening_conversation");
  await db.doc("global_curriculum/jhs/subjects/english/topical/oral_listening_conversation").set(oralListeningPayload, { merge: true });

  console.log("2. Writing full topical document to secondary alias path:");
  console.log("   global_curriculum/jhs/subjects/english/topics/oral_listening_conversation");
  await db.doc("global_curriculum/jhs/subjects/english/topics/oral_listening_conversation").set(oralListeningPayload, { merge: true });

  console.log("3. Writing full topical document to topical_units path:");
  console.log("   global_curriculum/jhs/subjects/english/topical_units/oral_listening_conversation");
  await db.doc("global_curriculum/jhs/subjects/english/topical_units/oral_listening_conversation").set(oralListeningPayload, { merge: true });

  console.log("4. Updating English manifests/topical_labs document...");
  const manifestRef = db.doc("global_curriculum/jhs/subjects/english/manifests/topical_labs");
  const mSnap = await manifestRef.get();
  if (mSnap.exists) {
    const mData = mSnap.data();
    const newTopics = mData.topics.map((t: any) => {
      if (t.id === 'oral_listening_conversation' || t.topicId === 'oral_listening_conversation') {
        return {
          ...t,
          totalQuestions: ALL_ORAL_LISTENING_QUESTIONS.length,
          questionCount: ALL_ORAL_LISTENING_QUESTIONS.length,
          hasNotes: true,
          status: 'ready'
        };
      }
      return t;
    });
    await manifestRef.set({ ...mData, topics: newTopics, updatedAt: new Date().toISOString() }, { merge: true });
    console.log("   Manifest updated successfully.");
  }

  console.log("\n✅ SUCCESS! Oral Listening & Conversation module deployed with rich notes, worked examples, and practice pools!");
}

seedOralListeningTopicalModules()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed Oral Listening notes:", err);
    process.exit(1);
  });
