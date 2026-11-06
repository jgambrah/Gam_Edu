'use server';

import type { Firestore } from 'firebase-admin/firestore';
import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { getSessionUser, type SessionUser } from '@/lib/session-guard';
import { spendSchoolCredits } from '@/lib/credits-server';
import {
  THINK_TANK_PARADOXES,
  THINK_TANK_DETECTIVE_CASES,
  THINK_TANK_DEBATES,
  type ThinkTankTargetGroup,
} from '@/lib/think-tank-data';
import type { ThinkTankParadoxEvaluation } from '@/lib/think-tank-evaluator';

const ALLOWED_TARGET_GROUPS: ReadonlySet<ThinkTankTargetGroup> = new Set([
  'Novice (Basic 1-3)',
  'Apprentice (Basic 4-6)',
  'Scholar (JHS)',
  'Master (SHS)',
]);

const CENTRAL_PARADOX_IDS = new Set(
  THINK_TANK_PARADOXES.map((item) => item.id)
);

const CENTRAL_DETECTIVE_CASE_IDS = new Set(
  THINK_TANK_DETECTIVE_CASES.map((item) => item.id)
);

const CENTRAL_DEBATE_IDS = new Set(
  THINK_TANK_DEBATES.map((item) => item.id)
);

const AUTHORIZED_STAFF_ROLES = new Set([
  'teacher',
  'subject teacher',
  'class teacher',
  'instructor',
  'faculty',
  'head of department',
  'tutor',
  'director',
  'administrator',
  'admin',
  'principal',
  'headmaster',
  'headmistress',
  'head teacher',
  'registrar',
  'admissions',
  'owner',
  'super_admin',
]);

const NON_STAFF_ROLES = new Set(['student', 'parent', 'guardian']);

const HARDCODED_SCHOOL_BY_UID: Record<string, string> = {
  '7GVi5qCxC4YDnjKkjVwSjAYtQz73': 'oHr3BrGdK2eS5MQ5zmZU',
};

const HARDCODED_SCHOOL_BY_EMAIL: Record<string, string> = {
  'atampokaadongo@gmail.com': 'oHr3BrGdK2eS5MQ5zmZU',
};

export interface PublicSchoolParadox {
  id: string;
  schoolId: string;
  question: string;
  targetGroup: ThinkTankTargetGroup;
  difficulty: string | null;
  isCentral: false;
  createdAt: string;
}

export interface GenerateSchoolParadoxResponse {
  success: boolean;
  paradox?: PublicSchoolParadox;
  error?: string;
}

export interface DeleteSchoolParadoxResponse {
  success: boolean;
  deletedId?: string;
  error?: string;
}

export interface GeneratedParadoxPayload {
  question: string;
  answer: string;
  explanation: string;
  difficulty?: string | null;
  evaluation?: ThinkTankParadoxEvaluation | null;
}

export interface SchoolParadoxActionTestOverrides {
  db?: Firestore;
  user?: SessionUser | null;
  generator?: (input: {
    targetGroup: ThinkTankTargetGroup;
  }) => Promise<GeneratedParadoxPayload>;
  spendCredits?: (
    schoolId: string,
    cost: number
  ) => Promise<{ success: boolean; error?: string }>;
}

/**
 * Authenticates and authorizes a teacher or school administrator and resolves their
 * verified schoolId from server-side records.
 * Student-record ownership (`self`) is never sufficient to authorize school-wide
 * curriculum administration.
 */
async function resolveAuthorizedSchoolStaff(
  db: Firestore,
  user: SessionUser
): Promise<{ uid: string; verifiedSchoolId: string; role: string }> {
  if (!user?.uid) {
    throw new Error('Not authenticated.');
  }

  const [staffSnap, userSnap, studentSnap] = await Promise.all([
    db.collection('staff').doc(user.uid).get(),
    db.collection('users').doc(user.uid).get(),
    db.collection('students').doc(user.uid).get(),
  ]);

  const staffData = staffSnap.exists
    ? (staffSnap.data() as Record<string, any>)
    : null;
  const userData = userSnap.exists
    ? (userSnap.data() as Record<string, any>)
    : null;

  const staffRole =
    typeof staffData?.role === 'string' ? staffData.role.trim().toLowerCase() : '';
  const userRole =
    typeof userData?.role === 'string' ? userData.role.trim().toLowerCase() : '';
  const claimRole =
    typeof user.claims?.role === 'string'
      ? user.claims.role.trim().toLowerCase()
      : '';

  if (
    NON_STAFF_ROLES.has(staffRole) ||
    NON_STAFF_ROLES.has(userRole) ||
    NON_STAFF_ROLES.has(claimRole)
  ) {
    throw new Error(
      'Not authorized. Only teachers and school administrators can manage school paradoxes.'
    );
  }

  const effectiveRole =
    staffRole ||
    userRole ||
    claimRole ||
    (user.isSuperAdmin ? 'super_admin' : '');

  const isAuthorizedStaff =
    user.isSuperAdmin ||
    (staffSnap.exists && AUTHORIZED_STAFF_ROLES.has(staffRole)) ||
    AUTHORIZED_STAFF_ROLES.has(effectiveRole);

  if (!isAuthorizedStaff || (studentSnap.exists && !staffSnap.exists && !user.isSuperAdmin)) {
    throw new Error(
      'Not authorized. Only teachers and school administrators can manage school paradoxes.'
    );
  }

  const staffSchoolId =
    typeof staffData?.schoolId === 'string' ? staffData.schoolId.trim() : '';
  const userSchoolId =
    typeof userData?.schoolId === 'string' ? userData.schoolId.trim() : '';
  const claimSchoolId =
    typeof user.claims?.schoolId === 'string'
      ? user.claims.schoolId.trim()
      : '';
  const hardcodedSchoolId =
    HARDCODED_SCHOOL_BY_UID[user.uid] ||
    HARDCODED_SCHOOL_BY_EMAIL[user.email] ||
    '';

  if (staffSchoolId && userSchoolId && staffSchoolId !== userSchoolId) {
    throw new Error('Staff school mismatch with user profile.');
  }
  if (staffSchoolId && claimSchoolId && staffSchoolId !== claimSchoolId) {
    throw new Error('Staff school mismatch with session claims.');
  }
  if (userSchoolId && claimSchoolId && userSchoolId !== claimSchoolId) {
    throw new Error('User profile school mismatch with session claims.');
  }

  const verifiedSchoolId =
    staffSchoolId || userSchoolId || claimSchoolId || hardcodedSchoolId;

  if (!verifiedSchoolId) {
    throw new Error('Could not verify staff school membership.');
  }

  return {
    uid: user.uid,
    verifiedSchoolId,
    role: effectiveRole,
  };
}

async function generateParadoxFromAi(input: {
  targetGroup: ThinkTankTargetGroup;
}): Promise<GeneratedParadoxPayload> {
  const schema = z.object({
    question: z.string(),
    answer: z.string(),
    explanation: z.string(),
    difficulty: z.string(),
    evaluation: z.object({
      type: z.enum([
        'conceptual',
        'numeric',
        'polarity',
        'deductive',
        'self_reference_paradox',
      ]),
      acceptedExpressions: z.array(z.string()).min(1),
      partialConcepts: z.array(z.string()).min(1),
      commonTraps: z.array(z.string()).min(1),
      coachingHint: z.string(),
    }),
  });

  const complexityInstruction: Record<ThinkTankTargetGroup, string> = {
    'Novice (Basic 1-3)': 'Target audience: Kids 6-8. Simple, fun logic.',
    'Apprentice (Basic 4-6)':
      'Target audience: Kids 9-11. Wordplay, math logic.',
    'Scholar (JHS)': 'Target audience: Teens 12-15. Lateral thinking.',
    'Master (SHS)': 'Target audience: Young Adults 16+. Complex paradoxes.',
  };

  const { output } = await ai.generate({
    model: 'googleai/gemini-3-flash-preview',
    prompt: `Generate a logic paradox/puzzle with a grading rubric. ${complexityInstruction[input.targetGroup]} Output strictly JSON.`,
    output: { schema },
  });

  if (!output) {
    throw new Error('AI returned no results.');
  }

  return output;
}

function validateGeneratedParadox(raw: GeneratedParadoxPayload): {
  question: string;
  answer: string;
  explanation: string;
  difficulty: string | null;
  evaluation: ThinkTankParadoxEvaluation;
} {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Generated paradox payload is invalid.');
  }

  const question =
    typeof raw.question === 'string' ? raw.question.trim() : '';
  const answer = typeof raw.answer === 'string' ? raw.answer.trim() : '';
  const explanation =
    typeof raw.explanation === 'string' ? raw.explanation.trim() : '';
  const difficulty =
    typeof raw.difficulty === 'string' && raw.difficulty.trim()
      ? raw.difficulty.trim()
      : null;

  if (!question) {
    throw new Error('Generated paradox is missing a valid question.');
  }
  if (!answer) {
    throw new Error('Generated paradox is missing a valid answer.');
  }
  if (!explanation) {
    throw new Error('Generated paradox is missing a valid explanation.');
  }

  const evalRaw = raw.evaluation;
  if (!evalRaw || typeof evalRaw !== 'object') {
    throw new Error('Generated paradox is missing required evaluation rubric.');
  }

  const validTypes = new Set([
    'conceptual',
    'numeric',
    'polarity',
    'deductive',
    'self_reference_paradox',
  ]);
  if (typeof evalRaw.type !== 'string' || !validTypes.has(evalRaw.type)) {
    throw new Error('Generated paradox rubric has an invalid evaluation type.');
  }

  const cleanList = (arr: unknown, label: string): string[] => {
    if (!Array.isArray(arr)) {
      throw new Error(`Generated paradox rubric is missing ${label}.`);
    }
    const filtered = arr
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);
    if (filtered.length === 0) {
      throw new Error(`Generated paradox rubric must include at least one entry in ${label}.`);
    }
    return filtered;
  };

  const acceptedExpressions = cleanList(
    evalRaw.acceptedExpressions,
    'acceptedExpressions'
  );
  const partialConcepts = cleanList(evalRaw.partialConcepts, 'partialConcepts');
  const commonTraps = cleanList(evalRaw.commonTraps, 'commonTraps');
  const coachingHint =
    typeof evalRaw.coachingHint === 'string' && evalRaw.coachingHint.trim()
      ? evalRaw.coachingHint.trim()
      : 'Examine the assumptions in the prompt carefully and explain each step of your deduction.';

  return {
    question,
    answer,
    explanation,
    difficulty,
    evaluation: {
      type: evalRaw.type as ThinkTankParadoxEvaluation['type'],
      acceptedExpressions,
      partialConcepts,
      commonTraps,
      coachingHint,
      maxXp: 15,
    },
  };
}

export async function generateSchoolParadoxAction(
  input: {
    targetGroup: string;
  },
  _testOverrides?: SchoolParadoxActionTestOverrides
): Promise<GenerateSchoolParadoxResponse> {
  try {
    const user =
      _testOverrides && 'user' in _testOverrides
        ? _testOverrides.user
        : await getSessionUser();

    if (!user?.uid) {
      return {
        success: false,
        error: 'Not authenticated.',
      };
    }

    const rawGroup =
      typeof input?.targetGroup === 'string' ? input.targetGroup.trim() : '';
    if (!ALLOWED_TARGET_GROUPS.has(rawGroup as ThinkTankTargetGroup)) {
      return {
        success: false,
        error: 'Invalid target group.',
      };
    }
    const targetGroup = rawGroup as ThinkTankTargetGroup;

    const db = _testOverrides?.db ?? getAdminDb();

    // 1 & 2. Authenticate and authorize the staff member & resolve verified school
    const { verifiedSchoolId } = await resolveAuthorizedSchoolStaff(db, user);

    // Spend AI credits for the verified school
    const spendFn = _testOverrides?.spendCredits ?? spendSchoolCredits;
    const creditResult = await spendFn(verifiedSchoolId, 2);
    if (!creditResult.success) {
      return {
        success: false,
        error: creditResult.error || 'Insufficient AI credits.',
      };
    }

    // 3. Generate the complete paradox on the server
    const generator = _testOverrides?.generator ?? generateParadoxFromAi;
    const generatedRaw = await generator({ targetGroup });

    // 4. Validate the generated question, answer, explanation, and required rubric fields
    const generated = validateGeneratedParadox(generatedRaw);

    // 5. Create a new Firestore document ID
    const publicRef = db.collection('think_tank_paradoxes').doc();
    const privateRef = db
      .collection('think_tank_private_paradoxes')
      .doc(publicRef.id);

    const createdAt = new Date().toISOString();

    // 6. Build the public document using an explicit allowlist
    const publicDoc: PublicSchoolParadox = {
      id: publicRef.id,
      schoolId: verifiedSchoolId,
      question: generated.question,
      targetGroup,
      difficulty: generated.difficulty,
      isCentral: false,
      createdAt,
    };

    // 7. Build the private document containing the answer, explanation, and rubric
    const privateDoc = {
      schoolId: verifiedSchoolId,
      answer: generated.answer,
      explanation: generated.explanation,
      evaluation: generated.evaluation,
    };

    // 8. Write both documents in a single Admin SDK batch
    const batch = db.batch();
    batch.create(publicRef, publicDoc);
    batch.create(privateRef, privateDoc);
    await batch.commit();

    // Return only the sanitized public record to the browser
    return {
      success: true,
      paradox: publicDoc,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Unable to generate school paradox.',
    };
  }
}

export async function deleteSchoolParadoxAction(
  paradoxId: string,
  _testOverrides?: SchoolParadoxActionTestOverrides
): Promise<DeleteSchoolParadoxResponse> {
  try {
    const user =
      _testOverrides && 'user' in _testOverrides
        ? _testOverrides.user
        : await getSessionUser();

    if (!user?.uid) {
      return {
        success: false,
        error: 'Not authenticated.',
      };
    }

    const cleanId =
      typeof paradoxId === 'string' ? paradoxId.trim() : '';
    if (!cleanId || cleanId.includes('/')) {
      return {
        success: false,
        error: 'Invalid paradox ID.',
      };
    }

    // Reject attempts to delete central canonical paradoxes
    if (
      CENTRAL_PARADOX_IDS.has(cleanId) ||
      cleanId.startsWith('tt-paradox-')
    ) {
      return {
        success: false,
        error: 'Central canonical paradoxes cannot be deleted.',
      };
    }

    const db = _testOverrides?.db ?? getAdminDb();

    // Authenticate and authorize the staff member & resolve verified school
    const { verifiedSchoolId } = await resolveAuthorizedSchoolStaff(db, user);

    const publicRef = db.collection('think_tank_paradoxes').doc(cleanId);
    const privateRef = db
      .collection('think_tank_private_paradoxes')
      .doc(cleanId);

    await db.runTransaction(async (tx) => {
      const [publicSnap, privateSnap] = await Promise.all([
        tx.get(publicRef),
        tx.get(privateRef),
      ]);

      if (!publicSnap.exists || !privateSnap.exists) {
        throw new Error('Paradox record incomplete.');
      }

      if (
        publicSnap.data()?.schoolId !== verifiedSchoolId ||
        privateSnap.data()?.schoolId !== verifiedSchoolId
      ) {
        throw new Error('Not authorized.');
      }

      if (publicSnap.data()?.isCentral === true) {
        throw new Error('Central canonical paradoxes cannot be deleted.');
      }

      tx.delete(publicRef);
      tx.delete(privateRef);
    });

    return {
      success: true,
      deletedId: cleanId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Unable to delete school paradox.',
    };
  }
}

export interface PublicSchoolDetectiveCase {
  id: string;
  schoolId: string;
  caseType: string;
  scenario: string;
  question: string;
  options: string[];
  targetGroup: ThinkTankTargetGroup;
  isCentral: false;
  createdAt: string;
}

export interface GenerateSchoolDetectiveCaseResponse {
  success: boolean;
  detectiveCase?: PublicSchoolDetectiveCase;
  error?: string;
}

export interface DeleteSchoolDetectiveCaseResponse {
  success: boolean;
  deletedId?: string;
  error?: string;
}

export interface GeneratedDetectiveCasePayload {
  caseType: string;
  scenario: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface SchoolDetectiveCaseActionTestOverrides {
  db?: Firestore;
  user?: SessionUser | null;
  generator?: (input: {
    targetGroup: ThinkTankTargetGroup;
  }) => Promise<GeneratedDetectiveCasePayload>;
  spendCredits?: (
    schoolId: string,
    cost: number
  ) => Promise<{ success: boolean; error?: string }>;
}

async function generateDetectiveCaseFromAi(input: {
  targetGroup: ThinkTankTargetGroup;
}): Promise<GeneratedDetectiveCasePayload> {
  const schema = z.object({
    scenario: z.string(),
    question: z.string(),
    caseType: z.string(),
    options: z.array(z.string()).length(4),
    correctAnswer: z.string(),
    explanation: z.string(),
  });

  const instruction: Record<ThinkTankTargetGroup, string> = {
    'Novice (Basic 1-3)': "Activity: 'Fact vs Opinion'. Simple statements.",
    'Apprentice (Basic 4-6)': "Activity: 'Bias Hunter'.",
    'Scholar (JHS)': "Activity: 'Fake News Spotter'. Sensationalized headlines.",
    'Master (SHS)': "Activity: 'Fallacy Spotter'. Short arguments.",
  };

  const { output } = await ai.generate({
    model: 'googleai/gemini-3-flash-preview',
    prompt: `Generate a Critical Thinking 'Detective Case' with 4 distinct options where correctAnswer exactly matches one option. ${instruction[input.targetGroup]} Output strictly JSON.`,
    output: { schema },
  });

  if (!output) {
    throw new Error('AI returned no results.');
  }

  return output;
}

function validateGeneratedDetectiveCase(
  raw: GeneratedDetectiveCasePayload
): GeneratedDetectiveCasePayload {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Generated detective case payload is invalid.');
  }

  const caseType =
    typeof raw.caseType === 'string' ? raw.caseType.trim() : '';
  const scenario =
    typeof raw.scenario === 'string' ? raw.scenario.trim() : '';
  const question =
    typeof raw.question === 'string' ? raw.question.trim() : '';
  const correctAnswer =
    typeof raw.correctAnswer === 'string' ? raw.correctAnswer.trim() : '';
  const explanation =
    typeof raw.explanation === 'string' ? raw.explanation.trim() : '';

  if (!caseType || !scenario || !question || !correctAnswer || !explanation) {
    throw new Error(
      'Generated detective case is missing required fields.'
    );
  }

  if (!Array.isArray(raw.options) || raw.options.length !== 4) {
    throw new Error(
      'Generated detective case must include exactly 4 options.'
    );
  }

  const options = raw.options
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);

  if (options.length !== 4 || new Set(options).size !== 4) {
    throw new Error(
      'Generated detective case must have 4 distinct non-empty options.'
    );
  }

  if (!options.includes(correctAnswer)) {
    throw new Error(
      'Generated detective case correctAnswer must exactly match one of the 4 options.'
    );
  }

  return {
    caseType,
    scenario,
    question,
    options,
    correctAnswer,
    explanation,
  };
}

export async function generateSchoolDetectiveCaseAction(
  input: {
    targetGroup: string;
  },
  _testOverrides?: SchoolDetectiveCaseActionTestOverrides
): Promise<GenerateSchoolDetectiveCaseResponse> {
  try {
    const user =
      _testOverrides && 'user' in _testOverrides
        ? _testOverrides.user
        : await getSessionUser();

    if (!user?.uid) {
      return {
        success: false,
        error: 'Not authenticated.',
      };
    }

    const rawGroup =
      typeof input?.targetGroup === 'string' ? input.targetGroup.trim() : '';
    if (!ALLOWED_TARGET_GROUPS.has(rawGroup as ThinkTankTargetGroup)) {
      return {
        success: false,
        error: 'Invalid target group.',
      };
    }
    const targetGroup = rawGroup as ThinkTankTargetGroup;

    const db = _testOverrides?.db ?? getAdminDb();

    const { verifiedSchoolId } = await resolveAuthorizedSchoolStaff(db, user);

    const spendFn = _testOverrides?.spendCredits ?? spendSchoolCredits;
    const creditResult = await spendFn(verifiedSchoolId, 2);
    if (!creditResult.success) {
      return {
        success: false,
        error: creditResult.error || 'Insufficient AI credits.',
      };
    }

    const generator =
      _testOverrides?.generator ?? generateDetectiveCaseFromAi;
    const generatedRaw = await generator({ targetGroup });
    const generated = validateGeneratedDetectiveCase(generatedRaw);

    const publicRef = db.collection('think_tank_detective_cases').doc();
    const privateRef = db
      .collection('think_tank_private_detective_cases')
      .doc(publicRef.id);

    const createdAt = new Date().toISOString();

    const publicDoc: PublicSchoolDetectiveCase = {
      id: publicRef.id,
      schoolId: verifiedSchoolId,
      caseType: generated.caseType,
      scenario: generated.scenario,
      question: generated.question,
      options: generated.options,
      targetGroup,
      isCentral: false,
      createdAt,
    };

    const privateDoc = {
      schoolId: verifiedSchoolId,
      correctAnswer: generated.correctAnswer,
      explanation: generated.explanation,
    };

    const batch = db.batch();
    batch.create(publicRef, publicDoc);
    batch.create(privateRef, privateDoc);
    await batch.commit();

    return {
      success: true,
      detectiveCase: publicDoc,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Unable to generate school detective case.',
    };
  }
}

export async function deleteSchoolDetectiveCaseAction(
  caseId: string,
  _testOverrides?: SchoolDetectiveCaseActionTestOverrides
): Promise<DeleteSchoolDetectiveCaseResponse> {
  try {
    const user =
      _testOverrides && 'user' in _testOverrides
        ? _testOverrides.user
        : await getSessionUser();

    if (!user?.uid) {
      return {
        success: false,
        error: 'Not authenticated.',
      };
    }

    const cleanId = typeof caseId === 'string' ? caseId.trim() : '';
    if (!cleanId || cleanId.includes('/')) {
      return {
        success: false,
        error: 'Invalid detective case ID.',
      };
    }

    if (
      CENTRAL_DETECTIVE_CASE_IDS.has(cleanId) ||
      cleanId.startsWith('tt-case-')
    ) {
      return {
        success: false,
        error: 'Central canonical detective cases cannot be deleted.',
      };
    }

    const db = _testOverrides?.db ?? getAdminDb();

    const { verifiedSchoolId } = await resolveAuthorizedSchoolStaff(db, user);

    const publicRef = db.collection('think_tank_detective_cases').doc(cleanId);
    const privateRef = db
      .collection('think_tank_private_detective_cases')
      .doc(cleanId);

    await db.runTransaction(async (tx) => {
      const [publicSnap, privateSnap] = await Promise.all([
        tx.get(publicRef),
        tx.get(privateRef),
      ]);

      if (!publicSnap.exists || !privateSnap.exists) {
        throw new Error('Detective case record incomplete.');
      }

      if (
        publicSnap.data()?.schoolId !== verifiedSchoolId ||
        privateSnap.data()?.schoolId !== verifiedSchoolId
      ) {
        throw new Error('Not authorized.');
      }

      if (publicSnap.data()?.isCentral === true) {
        throw new Error('Central canonical detective cases cannot be deleted.');
      }

      tx.delete(publicRef);
      tx.delete(privateRef);
    });

    return {
      success: true,
      deletedId: cleanId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Unable to delete school detective case.',
    };
  }
}

export interface PublicSchoolDebate {
  id: string;
  schoolId: string;
  topic: string;
  context: string;
  targetGroup: ThinkTankTargetGroup;
  isCentral: false;
  createdAt: string;
}

export interface GenerateSchoolDebateResponse {
  success: boolean;
  debate?: PublicSchoolDebate;
  error?: string;
}

export interface DeleteSchoolDebateResponse {
  success: boolean;
  deletedId?: string;
  error?: string;
}

export interface GeneratedDebatePayload {
  topic: string;
  context: string;
}

export interface SchoolDebateActionTestOverrides {
  db?: Firestore;
  user?: SessionUser | null;
  generator?: (input: {
    targetGroup: ThinkTankTargetGroup;
    topic: string;
  }) => Promise<GeneratedDebatePayload>;
  spendCredits?: (
    schoolId: string,
    cost: number
  ) => Promise<{ success: boolean; error?: string }>;
}

async function generateDebateFromAi(input: {
  targetGroup: ThinkTankTargetGroup;
  topic: string;
}): Promise<GeneratedDebatePayload> {
  const schema = z.object({
    topic: z.string(),
    context: z.string(),
  });

  const { output } = await ai.generate({
    model: 'googleai/gemini-3-flash-preview',
    prompt: `The user-provided topic is: "${input.topic}". Generate a brief, neutral, one-paragraph context for a debate on this topic (${input.targetGroup}). The output JSON should include the original topic and the new context.`,
    output: { schema },
  });

  if (!output) {
    throw new Error('AI returned no results.');
  }

  return {
    topic: input.topic,
    context: output.context,
  };
}

export async function generateSchoolDebateTopicAction(
  input: {
    targetGroup: string;
    topic: string;
  },
  _testOverrides?: SchoolDebateActionTestOverrides
): Promise<GenerateSchoolDebateResponse> {
  try {
    const user =
      _testOverrides && 'user' in _testOverrides
        ? _testOverrides.user
        : await getSessionUser();

    if (!user?.uid) {
      return {
        success: false,
        error: 'Not authenticated.',
      };
    }

    const rawGroup =
      typeof input?.targetGroup === 'string' ? input.targetGroup.trim() : '';
    if (!ALLOWED_TARGET_GROUPS.has(rawGroup as ThinkTankTargetGroup)) {
      return {
        success: false,
        error: 'Invalid target group.',
      };
    }
    const targetGroup = rawGroup as ThinkTankTargetGroup;

    const cleanTopic =
      typeof input?.topic === 'string' ? input.topic.trim() : '';
    if (!cleanTopic || cleanTopic.length < 4 || cleanTopic.length > 300) {
      return {
        success: false,
        error: 'Debate motion must be between 4 and 300 characters.',
      };
    }

    const db = _testOverrides?.db ?? getAdminDb();

    const { verifiedSchoolId } = await resolveAuthorizedSchoolStaff(db, user);

    const spendFn = _testOverrides?.spendCredits ?? spendSchoolCredits;
    const creditResult = await spendFn(verifiedSchoolId, 2);
    if (!creditResult.success) {
      return {
        success: false,
        error: creditResult.error || 'Insufficient AI credits.',
      };
    }

    const generator = _testOverrides?.generator ?? generateDebateFromAi;
    const generatedRaw = await generator({ targetGroup, topic: cleanTopic });
    const cleanContext =
      typeof generatedRaw?.context === 'string'
        ? generatedRaw.context.trim()
        : '';

    if (!cleanContext) {
      throw new Error('Generated debate motion is missing valid context.');
    }

    const publicRef = db.collection('think_tank_debates').doc();
    const createdAt = new Date().toISOString();

    const publicDoc: PublicSchoolDebate = {
      id: publicRef.id,
      schoolId: verifiedSchoolId,
      topic: cleanTopic,
      context: cleanContext,
      targetGroup,
      isCentral: false,
      createdAt,
    };

    await publicRef.create(publicDoc);

    return {
      success: true,
      debate: publicDoc,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Unable to generate school debate motion.',
    };
  }
}

export async function deleteSchoolDebateTopicAction(
  debateId: string,
  _testOverrides?: SchoolDebateActionTestOverrides
): Promise<DeleteSchoolDebateResponse> {
  try {
    const user =
      _testOverrides && 'user' in _testOverrides
        ? _testOverrides.user
        : await getSessionUser();

    if (!user?.uid) {
      return {
        success: false,
        error: 'Not authenticated.',
      };
    }

    const cleanId = typeof debateId === 'string' ? debateId.trim() : '';
    if (!cleanId || cleanId.includes('/')) {
      return {
        success: false,
        error: 'Invalid debate motion ID.',
      };
    }

    if (
      CENTRAL_DEBATE_IDS.has(cleanId) ||
      cleanId.startsWith('tt-debate-')
    ) {
      return {
        success: false,
        error: 'Central canonical debate motions cannot be deleted.',
      };
    }

    const db = _testOverrides?.db ?? getAdminDb();

    const { verifiedSchoolId } = await resolveAuthorizedSchoolStaff(db, user);

    const publicRef = db.collection('think_tank_debates').doc(cleanId);

    await db.runTransaction(async (tx) => {
      const publicSnap = await tx.get(publicRef);

      if (!publicSnap.exists) {
        throw new Error('Debate motion record not found.');
      }

      if (publicSnap.data()?.schoolId !== verifiedSchoolId) {
        throw new Error('Not authorized.');
      }

      if (publicSnap.data()?.isCentral === true) {
        throw new Error('Central canonical debate motions cannot be deleted.');
      }

      tx.delete(publicRef);
    });

    return {
      success: true,
      deletedId: cleanId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Unable to delete school debate motion.',
    };
  }
}

