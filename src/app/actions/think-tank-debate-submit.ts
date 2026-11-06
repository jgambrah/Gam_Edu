'use server';

import type { Firestore } from 'firebase-admin/firestore';
import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { getSessionUser, type SessionUser } from '@/lib/session-guard';
import { spendSchoolCredits } from '@/lib/credits-server';
import { resolveThinkTankStudent } from '@/lib/resolve-think-tank-student';
import { MAX_SELF_XP_PER_DAY } from '@/lib/think-tank-xp';
import { getTrustedDebate } from '@/lib/think-tank-server-curriculum';

export type DebateMessage = {
  role: 'user' | 'model';
  text: string;
};

export interface DebateEvaluationScorecard {
  logicScore: number;
  clarityScore: number;
  rebuttalScore: number;
  feedback: string;
  keyStrength: string;
  areaForImprovement: string;
}

export interface StartDebateSessionResult {
  success: boolean;
  sessionId?: string;
  debateId?: string;
  status?: 'active' | 'evaluating' | 'completed';
  revision?: number;
  messages?: DebateMessage[];
  resumed?: boolean;
  error?: string;
}

export interface SubmitDebateTurnResult {
  success: boolean;
  sessionId?: string;
  revision?: number;
  userMessage?: DebateMessage;
  aiMessage?: DebateMessage;
  messages?: DebateMessage[];
  error?: string;
}

export interface DebateSubmissionResult {
  success: boolean;
  sessionId?: string;
  debateId?: string;
  evaluation?: DebateEvaluationScorecard;
  awardedXp?: number;
  alreadyCompleted?: boolean;
  thinkTankScore?: number;
  totalPoints?: number;
  xpEarnedToday?: number;
  error?: string;
}

export interface DebateActionTestDeps {
  db?: Firestore;
  user?: SessionUser | null;
  todayOverride?: string;
  reset?: boolean;
  spendCredits?: (
    schoolId: string,
    cost: number
  ) => Promise<{ success: boolean; error?: string }>;
  opponentGenerator?: (input: {
    topic: string;
    history: DebateMessage[];
    lastMessage: string;
  }) => Promise<string>;
  judgeEvaluator?: (input: {
    topic: string;
    messages: DebateMessage[];
  }) => Promise<DebateEvaluationScorecard>;
}

const MAX_MESSAGE_LENGTH = 2000;
const MIN_USER_MESSAGE_LENGTH = 3;
const MAX_SESSION_MESSAGES = 40;
const MIN_TOTAL_MESSAGES_TO_CONCLUDE = 3;
const MIN_TOTAL_USER_CHARS_TO_CONCLUDE = 10;

const INACTIVE_STATUSES = new Set([
  'inactive',
  'transferred',
  'withdrawn',
  'suspended',
  'graduated',
]);

function isStudentRecordActive(student: Record<string, any>): boolean {
  if (student.isActive === false) return false;
  if (
    typeof student.status === 'string' &&
    INACTIVE_STATUSES.has(student.status.toLowerCase())
  ) {
    return false;
  }
  if (
    typeof student.enrollmentStatus === 'string' &&
    INACTIVE_STATUSES.has(student.enrollmentStatus.toLowerCase())
  ) {
    return false;
  }
  return true;
}

async function getVerifiedStudentSchoolId(
  db: Firestore,
  user: SessionUser
): Promise<string> {
  if (!user?.uid) {
    throw new Error('Missing authenticated user.');
  }

  const [userSnap, directStudentSnap, linkedStudentsSnap] = await Promise.all([
    db.collection('users').doc(user.uid).get(),
    db.collection('students').doc(user.uid).get(),
    db.collection('students').where('uid', '==', user.uid).get(),
  ]);

  const activeStudentSchools = new Set<string>();

  const collectFromStudentDoc = (data?: Record<string, any>) => {
    if (!data) return;
    if (data.uid && data.uid !== user.uid) return;
    if (!isStudentRecordActive(data)) return;
    if (typeof data.schoolId === 'string' && data.schoolId.trim()) {
      activeStudentSchools.add(data.schoolId.trim());
    }
  };

  if (directStudentSnap.exists) {
    collectFromStudentDoc(directStudentSnap.data() as Record<string, any>);
  }
  linkedStudentsSnap.docs.forEach((docSnap) => {
    if (docSnap.exists) {
      collectFromStudentDoc(docSnap.data() as Record<string, any>);
    }
  });

  if (activeStudentSchools.size > 1) {
    throw new Error(
      'Multiple active schools found for student account. Administrator reconciliation required.'
    );
  }

  const userProfileSchoolId =
    userSnap.exists && typeof userSnap.data()?.schoolId === 'string'
      ? userSnap.data()!.schoolId.trim()
      : '';
  const claimSchoolId =
    typeof user.claims?.schoolId === 'string'
      ? user.claims.schoolId.trim()
      : '';

  const studentSchoolId =
    activeStudentSchools.size === 1
      ? Array.from(activeStudentSchools)[0]
      : '';

  if (
    studentSchoolId &&
    userProfileSchoolId &&
    studentSchoolId !== userProfileSchoolId
  ) {
    throw new Error('Student school mismatch with user profile.');
  }

  if (studentSchoolId && claimSchoolId && studentSchoolId !== claimSchoolId) {
    throw new Error('Student school mismatch with session claims.');
  }

  const resolved = studentSchoolId || userProfileSchoolId || claimSchoolId;
  if (!resolved) {
    throw new Error('Could not verify student school membership.');
  }

  return resolved;
}

function validateStoredCounter(
  raw: unknown,
  fieldName: string,
  maxAllowed?: number
): number {
  if (raw === undefined || raw === null) {
    return 0;
  }
  if (
    typeof raw !== 'number' ||
    !Number.isFinite(raw) ||
    raw < 0 ||
    !Number.isInteger(raw)
  ) {
    throw new Error(`Invalid persisted counter for ${fieldName}.`);
  }
  if (maxAllowed !== undefined && raw > maxAllowed) {
    throw new Error(
      `Persisted counter ${fieldName} exceeds maximum allowed (${maxAllowed}).`
    );
  }
  return raw;
}

function validateStringArray(raw: unknown, fieldName: string): string[] {
  if (raw === undefined || raw === null) {
    return [];
  }
  if (!Array.isArray(raw) || !raw.every((item) => typeof item === 'string')) {
    throw new Error(`Invalid persisted array for ${fieldName}.`);
  }
  return raw;
}

function validateSessionMessages(raw: unknown): DebateMessage[] {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_SESSION_MESSAGES) {
    throw new Error('Invalid persisted debate transcript.');
  }
  const validated: DebateMessage[] = [];
  for (const item of raw) {
    if (
      !item ||
      typeof item !== 'object' ||
      (item.role !== 'user' && item.role !== 'model') ||
      typeof item.text !== 'string' ||
      !item.text.trim() ||
      item.text.length > MAX_MESSAGE_LENGTH
    ) {
      throw new Error('Malformed message in debate transcript.');
    }
    validated.push({
      role: item.role,
      text: item.text.trim(),
    });
  }
  return validated;
}

function validateJudgeScorecard(raw: unknown): DebateEvaluationScorecard {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('AI Judge returned malformed evaluation object.');
  }
  const obj = raw as Record<string, unknown>;

  const checkScore = (val: unknown, name: string): number => {
    if (
      typeof val !== 'number' ||
      !Number.isFinite(val) ||
      val < 1 ||
      val > 10
    ) {
      throw new Error(`Invalid AI Judge score for ${name}.`);
    }
    return Math.round(val * 10) / 10;
  };

  const checkText = (val: unknown, name: string): string => {
    if (typeof val !== 'string' || !val.trim() || val.length > 3000) {
      throw new Error(`Invalid AI Judge text field for ${name}.`);
    }
    return val.trim();
  };

  return {
    logicScore: checkScore(obj.logicScore, 'logicScore'),
    clarityScore: checkScore(obj.clarityScore, 'clarityScore'),
    rebuttalScore: checkScore(obj.rebuttalScore, 'rebuttalScore'),
    feedback: checkText(obj.feedback, 'feedback'),
    keyStrength: checkText(obj.keyStrength, 'keyStrength'),
    areaForImprovement: checkText(
      obj.areaForImprovement,
      'areaForImprovement'
    ),
  };
}

async function defaultOpponentGenerator(input: {
  topic: string;
  history: DebateMessage[];
  lastMessage: string;
}): Promise<string> {
  const historyText = input.history
    .map((m) => `${m.role === 'user' ? 'Debater' : 'Opponent'}: ${m.text}`)
    .join('\n');

  const prompt = `
    You are a skilled Debate Coach and Opponent.
    TOPIC: "${input.topic}"

    GOAL: Challenge the user's arguments logically. Play "Devil's Advocate".

    INSTRUCTIONS:
    1. Concise response (max 3 sentences).
    2. End with ONE probing question.
    3. Maintain context.

    HISTORY:
    ${historyText}

    USER ARGUMENT: "${input.lastMessage}"

    YOUR COUNTER:
  `;

  const response = await ai.generate({ prompt });
  const text = typeof response?.text === 'string' ? response.text.trim() : '';
  if (!text) {
    throw new Error('AI opponent returned an empty response.');
  }
  return text.slice(0, MAX_MESSAGE_LENGTH);
}

const JudgeEvaluationSchema = z.object({
  logicScore: z.number().describe('Score out of 10 for logical consistency'),
  clarityScore: z.number().describe('Score out of 10 for clarity of expression'),
  rebuttalScore: z.number().describe('Score out of 10 for ability to counter-argue'),
  feedback: z.string().describe("Constructive feedback on the user's performance"),
  keyStrength: z.string().describe('One specific thing the user did well'),
  areaForImprovement: z.string().describe('One specific thing to improve'),
});

async function defaultJudgeEvaluator(input: {
  topic: string;
  messages: DebateMessage[];
}): Promise<DebateEvaluationScorecard> {
  const transcript = input.messages
    .map((m) => {
      const speaker = m.role === 'user' ? '[[STUDENT]]' : '[[OPPONENT]]';
      return `${speaker}: ${m.text}`;
    })
    .join('\n\n');

  const prompt = `
    Act as an impartial, expert Debate Judge.
    DEBATE MOTION: "${input.topic}"

    Your task is to evaluate the performance of the **[[STUDENT]]** in the following debate transcript on the motion above.
    Ignore the performance of the [[OPPONENT]].

    TRANSCRIPT START:
    ${transcript}
    TRANSCRIPT END.

    CRITERIA (1 to 10):
    1. Logic: Did the STUDENT make coherent arguments relevant to the motion?
    2. Clarity: Was the STUDENT's language clear?
    3. Rebuttal: Did the STUDENT actually answer the OPPONENT's questions?
  `;

  const { output } = await ai.generate({
    prompt,
    output: { schema: JudgeEvaluationSchema },
  });

  return validateJudgeScorecard(output);
}

function buildOpeningGreeting(topic: string): DebateMessage {
  return {
    role: 'model',
    text: `Welcome to the debate! The motion is: "${topic}". \n\nI will represent the opposing view. Are you For or Against this motion? State your stance to begin!`,
  };
}

export async function startThinkTankDebateAction(
  debateId: string,
  deps?: DebateActionTestDeps
): Promise<StartDebateSessionResult> {
  const user =
    deps && 'user' in deps ? deps.user : await getSessionUser();

  if (!user?.uid) {
    return {
      success: false,
      error: 'Not authenticated.',
    };
  }

  const cleanDebateId =
    typeof debateId === 'string' ? debateId.trim() : '';
  if (!cleanDebateId || cleanDebateId.includes('/')) {
    return {
      success: false,
      error: 'Invalid debate ID.',
    };
  }

  try {
    const db = deps?.db ?? getAdminDb();
    const verifiedSchoolId = await getVerifiedStudentSchoolId(db, user);
    await resolveThinkTankStudent(db, user.uid, verifiedSchoolId);

    const debateTopic = await getTrustedDebate(
      cleanDebateId,
      verifiedSchoolId,
      { db }
    );

    if (!debateTopic) {
      return {
        success: false,
        error: 'Debate topic not found.',
      };
    }

    const sessionId = `${user.uid}__${cleanDebateId}`;
    const sessionRef = db
      .collection('think_tank_debate_sessions')
      .doc(sessionId);

    const outcome = await db.runTransaction(async (tx) => {
      const snap = await tx.get(sessionRef);
      if (snap.exists && !deps?.reset) {
        const existing = snap.data() as Record<string, any>;
        if (
          existing.studentUid === user.uid &&
          existing.schoolId === verifiedSchoolId &&
          existing.debateId === cleanDebateId &&
          existing.status === 'active'
        ) {
          const messages = validateSessionMessages(existing.messages);
          const revision = validateStoredCounter(
            existing.revision ?? 1,
            'revision'
          );
          return {
            sessionId,
            debateId: cleanDebateId,
            status: 'active' as const,
            revision,
            messages,
            resumed: true,
          };
        }
      }

      const initialMessages: DebateMessage[] = [
        buildOpeningGreeting(debateTopic.topic),
      ];
      const nowIso = new Date().toISOString();

      tx.set(sessionRef, {
        sessionId,
        studentUid: user.uid,
        schoolId: verifiedSchoolId,
        debateId: cleanDebateId,
        status: 'active',
        revision: 1,
        turnInProgress: false,
        messages: initialMessages,
        createdAt: nowIso,
        updatedAt: nowIso,
      });

      return {
        sessionId,
        debateId: cleanDebateId,
        status: 'active' as const,
        revision: 1,
        messages: initialMessages,
        resumed: false,
      };
    });

    return {
      success: true,
      ...outcome,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Could not start debate session.',
    };
  }
}

export async function submitThinkTankDebateTurnAction(
  input: {
    sessionId: string;
    message: string;
    expectedRevision?: number;
  },
  deps?: DebateActionTestDeps
): Promise<SubmitDebateTurnResult> {
  const user =
    deps && 'user' in deps ? deps.user : await getSessionUser();

  if (!user?.uid) {
    return {
      success: false,
      error: 'Not authenticated.',
    };
  }

  if (
    !input ||
    typeof input !== 'object' ||
    typeof input.sessionId !== 'string' ||
    typeof input.message !== 'string'
  ) {
    return {
      success: false,
      error: 'Invalid debate turn input.',
    };
  }

  const cleanSessionId = input.sessionId.trim();
  const cleanMessage = input.message.trim();

  if (!cleanSessionId || cleanSessionId.includes('/')) {
    return {
      success: false,
      error: 'Invalid session ID.',
    };
  }

  if (
    cleanMessage.length < MIN_USER_MESSAGE_LENGTH ||
    cleanMessage.length > MAX_MESSAGE_LENGTH ||
    !/[\p{L}\p{N}]/u.test(cleanMessage)
  ) {
    return {
      success: false,
      error: 'Debate message must be between 3 and 2000 characters.',
    };
  }

  const db = deps?.db ?? getAdminDb();
  let lockAcquired = false;
  const sessionRef = db
    .collection('think_tank_debate_sessions')
    .doc(cleanSessionId);

  try {
    const verifiedSchoolId = await getVerifiedStudentSchoolId(db, user);
    await resolveThinkTankStudent(db, user.uid, verifiedSchoolId);

    // Phase 1: Acquire optimistic turn lock & read current transcript
    const preState = await db.runTransaction(async (tx) => {
      const snap = await tx.get(sessionRef);
      if (!snap.exists) {
        throw new Error('Debate session not found.');
      }

      const session = snap.data() as Record<string, any>;
      if (
        session.studentUid !== user.uid ||
        session.schoolId !== verifiedSchoolId
      ) {
        throw new Error('Not authorized to access this debate session.');
      }

      if (session.status !== 'active') {
        throw new Error('Debate session is no longer active.');
      }

      if (session.turnInProgress === true) {
        throw new Error(
          'Another turn is currently being processed for this session.'
        );
      }

      const currentRevision = validateStoredCounter(
        session.revision ?? 1,
        'revision'
      );

      if (
        input.expectedRevision !== undefined &&
        currentRevision !== input.expectedRevision
      ) {
        throw new Error('Debate session revision mismatch.');
      }

      const messages = validateSessionMessages(session.messages);
      if (messages.length + 2 > MAX_SESSION_MESSAGES) {
        throw new Error('Maximum debate turns reached for this session.');
      }

      const debateId =
        typeof session.debateId === 'string' ? session.debateId.trim() : '';
      if (!debateId) {
        throw new Error('Debate session is missing debateId.');
      }

      tx.update(sessionRef, {
        turnInProgress: true,
        updatedAt: new Date().toISOString(),
      });

      return {
        debateId,
        currentRevision,
        messages,
      };
    });

    lockAcquired = true;

    // Phase 2: Load canonical topic, spend AI credits, and generate AI reply outside transaction
    const debateTopic = await getTrustedDebate(
      preState.debateId,
      verifiedSchoolId,
      { db }
    );
    if (!debateTopic) {
      throw new Error('Debate topic not found.');
    }

    const spendFn = deps?.spendCredits ?? spendSchoolCredits;
    const creditRes = await spendFn(verifiedSchoolId, 2);
    if (!creditRes.success) {
      throw new Error(
        creditRes.error || 'You are out of AI credits for this debate.'
      );
    }

    const opponentGen = deps?.opponentGenerator ?? defaultOpponentGenerator;
    const rawReply = await opponentGen({
      topic: debateTopic.topic,
      history: preState.messages,
      lastMessage: cleanMessage,
    });

    const cleanReply = typeof rawReply === 'string' ? rawReply.trim() : '';
    if (!cleanReply) {
      throw new Error('AI opponent returned an invalid response.');
    }

    const userMsg: DebateMessage = { role: 'user', text: cleanMessage };
    const aiMsg: DebateMessage = {
      role: 'model',
      text: cleanReply.slice(0, MAX_MESSAGE_LENGTH),
    };

    // Phase 3: Commit both messages with optimistic revision check
    const committed = await db.runTransaction(async (tx) => {
      const snap = await tx.get(sessionRef);
      if (!snap.exists) {
        throw new Error('Debate session disappeared during turn.');
      }
      const session = snap.data() as Record<string, any>;
      if (
        session.studentUid !== user.uid ||
        session.schoolId !== verifiedSchoolId ||
        session.status !== 'active'
      ) {
        throw new Error('Debate session state changed unexpectedly.');
      }

      const currentRevision = validateStoredCounter(
        session.revision ?? 1,
        'revision'
      );
      if (currentRevision !== preState.currentRevision) {
        throw new Error('Concurrent modification detected on debate session.');
      }

      const nextMessages = [...preState.messages, userMsg, aiMsg];
      const nextRevision = currentRevision + 1;

      tx.update(sessionRef, {
        messages: nextMessages,
        revision: nextRevision,
        turnInProgress: false,
        updatedAt: new Date().toISOString(),
      });

      return {
        revision: nextRevision,
        messages: nextMessages,
      };
    });

    lockAcquired = false;

    return {
      success: true,
      sessionId: cleanSessionId,
      revision: committed.revision,
      userMessage: userMsg,
      aiMessage: aiMsg,
      messages: committed.messages,
    };
  } catch (err: any) {
    if (lockAcquired) {
      try {
        await db.runTransaction(async (tx) => {
          const snap = await tx.get(sessionRef);
          if (snap.exists && snap.data()?.studentUid === user.uid) {
            tx.update(sessionRef, {
              turnInProgress: false,
              updatedAt: new Date().toISOString(),
            });
          }
        });
      } catch {
        // Ignore cleanup failure
      }
    }
    return {
      success: false,
      error: err?.message || 'Could not submit debate turn.',
    };
  }
}

export async function concludeThinkTankDebateAction(
  sessionId: string,
  deps?: DebateActionTestDeps
): Promise<DebateSubmissionResult> {
  const user =
    deps && 'user' in deps ? deps.user : await getSessionUser();

  if (!user?.uid) {
    return {
      success: false,
      error: 'Not authenticated.',
    };
  }

  const cleanSessionId =
    typeof sessionId === 'string' ? sessionId.trim() : '';
  if (!cleanSessionId || cleanSessionId.includes('/')) {
    return {
      success: false,
      error: 'Invalid session ID.',
    };
  }

  const db = deps?.db ?? getAdminDb();
  const sessionRef = db
    .collection('think_tank_debate_sessions')
    .doc(cleanSessionId);
  let evaluatingLockAcquired = false;

  try {
    const verifiedSchoolId = await getVerifiedStudentSchoolId(db, user);
    const studentRef = await resolveThinkTankStudent(
      db,
      user.uid,
      verifiedSchoolId
    );

    // Phase 1: Verify ownership, participation threshold, and acquire 'evaluating' lock
    const preEval = await db.runTransaction(async (tx) => {
      const snap = await tx.get(sessionRef);
      if (!snap.exists) {
        throw new Error('Debate session not found.');
      }

      const session = snap.data() as Record<string, any>;
      if (
        session.studentUid !== user.uid ||
        session.schoolId !== verifiedSchoolId
      ) {
        throw new Error('Not authorized to conclude this debate session.');
      }

      if (session.turnInProgress === true) {
        throw new Error('Cannot conclude while a debate turn is in progress.');
      }

      if (session.status === 'completed') {
        const existingEval = validateJudgeScorecard(session.evaluation);
        return {
          alreadyConcludedSession: true as const,
          debateId: String(session.debateId),
          evaluation: existingEval,
          messages: validateSessionMessages(session.messages),
        };
      }

      if (session.status === 'evaluating') {
        throw new Error('Debate evaluation is already in progress.');
      }

      if (session.status !== 'active') {
        throw new Error('Invalid debate session status.');
      }

      const debateId =
        typeof session.debateId === 'string' ? session.debateId.trim() : '';
      if (!debateId) {
        throw new Error('Debate session is missing debateId.');
      }

      const messages = validateSessionMessages(session.messages);
      const userTurns = messages.filter((m) => m.role === 'user');
      const totalUserChars = userTurns.reduce(
        (sum, m) => sum + m.text.trim().length,
        0
      );

      if (
        messages.length < MIN_TOTAL_MESSAGES_TO_CONCLUDE ||
        userTurns.length < 1 ||
        totalUserChars < MIN_TOTAL_USER_CHARS_TO_CONCLUDE
      ) {
        throw new Error(
          'Insufficient debate participation. Submit at least one substantive argument before concluding.'
        );
      }

      tx.update(sessionRef, {
        status: 'evaluating',
        updatedAt: new Date().toISOString(),
      });

      return {
        alreadyConcludedSession: false as const,
        debateId,
        messages,
      };
    });

    if (preEval.alreadyConcludedSession) {
      return {
        success: true,
        sessionId: cleanSessionId,
        debateId: preEval.debateId,
        evaluation: preEval.evaluation,
        awardedXp: 0,
        alreadyCompleted: true,
      };
    }

    evaluatingLockAcquired = true;

    // Phase 2: Load canonical debate topic, spend credits, and evaluate via AI Judge
    const debateTopic = await getTrustedDebate(
      preEval.debateId,
      verifiedSchoolId,
      { db }
    );
    if (!debateTopic) {
      throw new Error('Debate topic not found.');
    }

    const spendFn = deps?.spendCredits ?? spendSchoolCredits;
    const creditRes = await spendFn(verifiedSchoolId, 2);
    if (!creditRes.success) {
      throw new Error(
        creditRes.error || 'Not enough AI credits to evaluate debate.'
      );
    }

    const judgeFn = deps?.judgeEvaluator ?? defaultJudgeEvaluator;
    const rawEval = await judgeFn({
      topic: debateTopic.topic,
      messages: preEval.messages,
    });
    const validatedEval = validateJudgeScorecard(rawEval);

    // Phase 3: Commit completion and one-time XP award atomically
    const progressRef = db.collection('student_progress').doc(user.uid);
    const today =
      deps?.todayOverride ?? new Date().toISOString().slice(0, 10);

    const txOutcome = await db.runTransaction(async (tx) => {
      const [sessionSnap, progressSnap, studentSnap] = await Promise.all([
        tx.get(sessionRef),
        tx.get(progressRef),
        tx.get(studentRef),
      ]);

      if (!sessionSnap.exists || !studentSnap.exists) {
        throw new Error('Required session or student record unavailable.');
      }

      const session = sessionSnap.data() as Record<string, any>;
      const progress = (progressSnap.data() ?? {}) as Record<string, any>;
      const student = (studentSnap.data() ?? {}) as Record<string, any>;

      if (
        session.studentUid !== user.uid ||
        session.schoolId !== verifiedSchoolId ||
        session.status !== 'evaluating'
      ) {
        throw new Error('Debate session state invalid for completion.');
      }

      if (
        student.schoolId !== verifiedSchoolId ||
        (student.uid && student.uid !== user.uid) ||
        !isStudentRecordActive(student)
      ) {
        throw new Error('Student identity mismatch.');
      }

      const debateCompletedIds = validateStringArray(
        progress.thinkTankDebateCompletedIds,
        'thinkTankDebateCompletedIds'
      );
      const completedIds = validateStringArray(
        progress.thinkTankCompleted,
        'thinkTankCompleted'
      );
      const currentThinkTankScore = validateStoredCounter(
        progress.thinkTankScore,
        'thinkTankScore'
      );
      const currentTotalPoints = validateStoredCounter(
        student.totalPoints,
        'totalPoints'
      );
      const storedEarnedToday = validateStoredCounter(
        student.xpEarnedToday,
        'xpEarnedToday',
        MAX_SELF_XP_PER_DAY
      );

      const alreadyCompleted =
        debateCompletedIds.includes(preEval.debateId) ||
        completedIds.includes(preEval.debateId);

      const earnedToday =
        student.xpEarnedDay === today ? storedEarnedToday : 0;
      const remainingDailyAllowance = Math.max(
        0,
        MAX_SELF_XP_PER_DAY - earnedToday
      );

      const calculatedXp = Math.max(
        30,
        Math.min(100, Math.floor(validatedEval.logicScore) + 10)
      );
      const requestedXp = !alreadyCompleted ? calculatedXp : 0;
      const awardedXp = Math.min(requestedXp, remainingDailyAllowance);
      const newDailyEarned = earnedToday + awardedXp;

      const nextThinkTankScore = currentThinkTankScore + awardedXp;
      const nextTotalPoints = currentTotalPoints + awardedXp;
      const nowIso = new Date().toISOString();

      tx.update(sessionRef, {
        status: 'completed',
        evaluation: validatedEval,
        awardedXp,
        completedAt: nowIso,
        updatedAt: nowIso,
      });

      if (!alreadyCompleted) {
        const nextDebateCompletedIds = debateCompletedIds.includes(
          preEval.debateId
        )
          ? debateCompletedIds
          : [...debateCompletedIds, preEval.debateId];

        const nextCompletedIds = completedIds.includes(preEval.debateId)
          ? completedIds
          : [...completedIds, preEval.debateId];

        tx.set(
          progressRef,
          {
            thinkTankDebateCompletedIds: nextDebateCompletedIds,
            thinkTankCompleted: nextCompletedIds,
            thinkTankScore: nextThinkTankScore,
          },
          { merge: true }
        );

        if (awardedXp > 0) {
          tx.update(studentRef, {
            totalPoints: nextTotalPoints,
            xpEarnedDay: today,
            xpEarnedToday: newDailyEarned,
          });
        }
      }

      return {
        awardedXp,
        alreadyCompleted,
        thinkTankScore: nextThinkTankScore,
        totalPoints: nextTotalPoints,
        xpEarnedToday: newDailyEarned,
      };
    });

    evaluatingLockAcquired = false;

    return {
      success: true,
      sessionId: cleanSessionId,
      debateId: preEval.debateId,
      evaluation: validatedEval,
      awardedXp: txOutcome.awardedXp,
      alreadyCompleted: txOutcome.alreadyCompleted,
      thinkTankScore: txOutcome.thinkTankScore,
      totalPoints: txOutcome.totalPoints,
      xpEarnedToday: txOutcome.xpEarnedToday,
    };
  } catch (err: any) {
    if (evaluatingLockAcquired) {
      try {
        await db.runTransaction(async (tx) => {
          const snap = await tx.get(sessionRef);
          if (
            snap.exists &&
            snap.data()?.studentUid === user.uid &&
            snap.data()?.status === 'evaluating'
          ) {
            tx.update(sessionRef, {
              status: 'active',
              updatedAt: new Date().toISOString(),
            });
          }
        });
      } catch {
        // Ignore rollback cleanup failure
      }
    }
    return {
      success: false,
      error: err?.message || 'Could not conclude debate session.',
    };
  }
}

/**
 * Trusted Debate submission action that verifies any submitted history against
 * the authoritative server-owned debate session before concluding.
 * Rejects fabricated or unverified client transcripts.
 */
export async function submitThinkTankDebateAction(
  input: {
    debateId: string;
    history: DebateMessage[];
  },
  deps?: DebateActionTestDeps
): Promise<DebateSubmissionResult> {
  const user =
    deps && 'user' in deps ? deps.user : await getSessionUser();

  if (!user?.uid) {
    return {
      success: false,
      error: 'Not authenticated.',
    };
  }

  const cleanDebateId =
    typeof input?.debateId === 'string' ? input.debateId.trim() : '';
  if (!cleanDebateId || cleanDebateId.includes('/')) {
    return {
      success: false,
      error: 'Invalid debate ID.',
    };
  }

  try {
    const submittedMessages = validateSessionMessages(input?.history);
    const db = deps?.db ?? getAdminDb();
    const verifiedSchoolId = await getVerifiedStudentSchoolId(db, user);

    const sessionId = `${user.uid}__${cleanDebateId}`;
    const sessionSnap = await db
      .collection('think_tank_debate_sessions')
      .doc(sessionId)
      .get();

    if (!sessionSnap.exists) {
      return {
        success: false,
        error: 'No verified server debate session found for this topic.',
      };
    }

    const session = sessionSnap.data() as Record<string, any>;
    if (
      session.studentUid !== user.uid ||
      session.schoolId !== verifiedSchoolId ||
      session.debateId !== cleanDebateId
    ) {
      return {
        success: false,
        error: 'Not authorized for this debate session.',
      };
    }

    const serverMessages = validateSessionMessages(session.messages);
    if (
      serverMessages.length !== submittedMessages.length ||
      serverMessages.some(
        (m, idx) =>
          m.role !== submittedMessages[idx].role ||
          m.text !== submittedMessages[idx].text
      )
    ) {
      return {
        success: false,
        error:
          'Submitted transcript does not match the verified server debate session.',
      };
    }

    return concludeThinkTankDebateAction(sessionId, deps);
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Invalid debate submission.',
    };
  }
}

