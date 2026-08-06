import { Assignment, Quiz, StudentSubmission, QuizAttempt } from './types';

export interface SubjectProgressSummary {
  subjectId: string;
  subjectName: string;
  completedCount: number;
  totalCount: number;
  percent: number;
  level: number;
  levelTitle: string;
  xpEarned: number;
}

export interface RoadmapNode {
  id: string;
  title: string;
  type: 'assignment' | 'quiz';
  status: 'completed' | 'in_progress' | 'locked';
  scorePercent?: number;
  dueDate?: string;
  xpReward: number;
  subjectId?: string;
  subjectName?: string;
  url?: string;
}

export function calculateLevelFromPercent(percent: number) {
  if (percent >= 90) return { level: 4, title: 'Master' };
  if (percent >= 70) return { level: 3, title: 'Expert' };
  if (percent >= 40) return { level: 2, title: 'Practitioner' };
  if (percent >= 1) return { level: 1, title: 'Novice' };
  return { level: 1, title: 'Beginner' };
}

export function calculateSubjectProgress(
  assignments: Assignment[] = [],
  submissions: StudentSubmission[] = [],
  quizzes: Quiz[] = [],
  attempts: QuizAttempt[] = []
): SubjectProgressSummary[] {
  return calculateAllSubjectsProgress(assignments, quizzes, submissions, attempts);
}

/**
 * Derives subject-level progress breakdown dynamically in-memory.
 * 0 extra Firestore reads cost overhead.
 */
export function calculateAllSubjectsProgress(
  assignments: Assignment[] = [],
  quizzes: Quiz[] = [],
  submissions: StudentSubmission[] = [],
  quizAttempts: QuizAttempt[] = []
): SubjectProgressSummary[] {
  const subjectMap = new Map<string, { name: string; completed: number; total: number; xp: number }>();

  const getOrInitSubject = (subjectId: string, subjectName: string = 'General') => {
    if (!subjectMap.has(subjectId)) {
      subjectMap.set(subjectId, { name: subjectName, completed: 0, total: 0, xp: 0 });
    }
    return subjectMap.get(subjectId)!;
  };

  const completedSubmissionSet = new Set<string>();
  submissions.forEach(s => {
    if (s.assignmentId && (s.status === 'Graded' || s.status === 'Submitted')) {
      completedSubmissionSet.add(s.assignmentId);
    }
  });

  const completedQuizSet = new Map<string, number>();
  quizAttempts.forEach(q => {
    if (q.quizId) {
      const pct = q.total > 0 ? Math.round((q.score / q.total) * 100) : 0;
      const prev = completedQuizSet.get(q.quizId) || 0;
      completedQuizSet.set(q.quizId, Math.max(prev, pct));
    }
  });

  // Process Assignments
  assignments.forEach(a => {
    const subId = a.subjectId || 'general';
    const subName = (a as any).subjectName || a.subjectId || 'General';
    const entry = getOrInitSubject(subId, subName);
    entry.total += 1;
    if (completedSubmissionSet.has(a.id)) {
      entry.completed += 1;
      entry.xp += 50; // Standard XP per assignment
    }
  });

  // Process Quizzes
  quizzes.forEach(q => {
    const subId = (q as any).subjectId || 'general';
    const subName = (q as any).subjectName || (q as any).subjectId || 'General';
    const entry = getOrInitSubject(subId, subName);
    entry.total += 1;
    if (completedQuizSet.has(q.id)) {
      entry.completed += 1;
      const score = completedQuizSet.get(q.id) || 0;
      entry.xp += score >= 90 ? 100 : 50;
    }
  });

  const result: SubjectProgressSummary[] = [];
  subjectMap.forEach((val, subjectId) => {
    const percent = val.total > 0 ? Math.round((val.completed / val.total) * 100) : 0;
    const levelInfo = calculateLevelFromPercent(percent);
    result.push({
      subjectId,
      subjectName: val.name,
      completedCount: val.completed,
      totalCount: val.total,
      percent,
      level: levelInfo.level,
      levelTitle: levelInfo.title,
      xpEarned: val.xp
    });
  });

  return result.sort((a, b) => b.percent - a.percent);
}

/**
 * Builds an interactive visual roadmap of quest nodes for a specific subject or overall curriculum.
 */
export function buildSubjectRoadmapNodes(
  assignments: Assignment[] = [],
  quizzes: Quiz[] = [],
  submissions: StudentSubmission[] = [],
  quizAttempts: QuizAttempt[] = [],
  targetSubjectId?: string
): RoadmapNode[] {
  const completedSubmissionMap = new Map<string, StudentSubmission>();
  submissions.forEach(s => {
    if (s.assignmentId) completedSubmissionMap.set(s.assignmentId, s);
  });

  const completedQuizMap = new Map<string, QuizAttempt>();
  quizAttempts.forEach(q => {
    if (q.quizId) {
      const existing = completedQuizMap.get(q.quizId);
      if (!existing || q.score > existing.score) {
        completedQuizMap.set(q.quizId, q);
      }
    }
  });

  let filteredAssignments = assignments;
  let filteredQuizzes = quizzes;

  if (targetSubjectId && targetSubjectId !== 'All') {
    filteredAssignments = assignments.filter(a => a.subjectId === targetSubjectId);
    filteredQuizzes = quizzes.filter(q => (q as any).subjectId === targetSubjectId);
  }

  const nodes: RoadmapNode[] = [];

  filteredAssignments.forEach(a => {
    const isCompleted = completedSubmissionMap.has(a.id);
    nodes.push({
      id: a.id,
      title: a.title,
      type: 'assignment',
      status: isCompleted ? 'completed' : 'in_progress',
      dueDate: a.dueDate ? new Date(a.dueDate).toLocaleDateString() : undefined,
      xpReward: 50,
      subjectId: a.subjectId,
      subjectName: (a as any).subjectName,
      url: `/dashboard/assignments`
    });
  });

  filteredQuizzes.forEach(q => {
    const attempt = completedQuizMap.get(q.id);
    const isCompleted = !!attempt;
    const scorePct = attempt ? (attempt.total > 0 ? Math.round((attempt.score / attempt.total) * 100) : 0) : undefined;
    nodes.push({
      id: q.id,
      title: q.title,
      type: 'quiz',
      status: isCompleted ? 'completed' : 'in_progress',
      scorePercent: scorePct,
      xpReward: 100,
      subjectId: (q as any).subjectId,
      subjectName: (q as any).subjectName,
      url: `/dashboard/assignments/quiz/${q.id}`
    });
  });

  // Sort nodes: completed first, then in_progress
  nodes.sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return -1;
    if (a.status !== 'completed' && b.status === 'completed') return 1;
    return 0;
  });

  // Lock nodes after the first 2 in_progress items to form a realistic visual quest line
  let inProgressCount = 0;
  return nodes.map(node => {
    if (node.status === 'in_progress') {
      inProgressCount++;
      if (inProgressCount > 2) {
        return { ...node, status: 'locked' };
      }
    }
    return node;
  });
}
