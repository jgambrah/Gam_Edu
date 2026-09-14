/**
 * Curriculum Service Module
 *
 * Provides a cached data fetching layer for the Global Shared Curriculum,
 * capping Firestore document reads at 1 read per question set and caching results
 * locally via persistent Firestore caching and TanStack Query in-memory cache.
 *
 * Document paths:
 * Global Curriculum: global_curriculum/{levelId}/subjects/{subjectId}/topics/{topicId}/question_sets/{setId}
 * Student Attempts: tenants/{tenantId}/students/{studentId}/quiz_attempts/{attemptId}
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { QueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import {
  CurriculumQuestionSet,
  TenantQuizAttempt,
  GlobalCurriculumLevelId
} from '@/lib/global-curriculum-types';
import {
  getGlobalQuestionSetsCollectionPath,
  getGlobalQuestionSetDocPath,
  getTenantQuizAttemptDocPath,
  isValidCurriculumLevelId,
  SAMPLE_GLOBAL_QUESTION_SETS
} from '@/lib/global-curriculum-service';

/**
 * Shared TanStack Query client with 24-hour cache persistence.
 * Prevents redundant Firestore reads during active student sessions.
 */
export const curriculumQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
      gcTime: Infinity,               // Cache persists in-memory for the session
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1
    }
  }
});

// Cache configuration constants
export const CACHE_CONFIG = {
  staleTime: 1000 * 60 * 60 * 24, // 24 hours
  gcTime: Infinity
} as const;

/**
 * Generates consistent cache query keys for TanStack Query.
 */
export const curriculumKeys = {
  all: ['global_curriculum'] as const,
  level: (levelId: string) => [...curriculumKeys.all, levelId] as const,
  topic: (levelId: string, subjectId: string, topicId: string) =>
    [...curriculumKeys.level(levelId), subjectId, topicId, 'question_sets'] as const,
  questionSet: (levelId: string, subjectId: string, topicId: string, setId: string) =>
    [...curriculumKeys.topic(levelId, subjectId, topicId), setId] as const,
  tenantAttempts: (tenantId: string, studentId: string) =>
    ['tenants', tenantId, 'students', studentId, 'quiz_attempts'] as const
};

// ============================================================================
// Core Fetchers (Capped at 1 Read per Document via Firestore Cache)
// ============================================================================

/**
 * Fetches the subcollection of question sets for a specific topic.
 *
 * Path: global_curriculum/{levelId}/subjects/{subjectId}/topics/{topicId}/question_sets
 */
export async function fetchTopicQuestionSetsFromFirestore(
  levelId: string,
  subjectId: string,
  topicId: string
): Promise<CurriculumQuestionSet[]> {
  const subjectAliases = subjectId === 'mathematics' ? ['mathematics', 'math'] : (subjectId === 'math' ? ['math', 'mathematics'] : [subjectId]);
  const topicAliases = topicId.includes('-')
    ? [topicId, topicId.replace(/-/g, '_')]
    : (topicId.includes('_') ? [topicId, topicId.replace(/_/g, '-')] : [topicId]);

  try {
    // Try primary path first
    for (const sId of subjectAliases) {
      for (const tId of topicAliases) {
        const colPath = getGlobalQuestionSetsCollectionPath(
          levelId as GlobalCurriculumLevelId,
          sId,
          tId
        );
        const colRef = collection(db, colPath);
        const snapshot = await getDocs(colRef);

        if (!snapshot.empty) {
          return snapshot.docs.map((d) => ({
            ...(d.data() as CurriculumQuestionSet),
            id: d.id
          }));
        }
      }
    }

    // Fallback to built-in seed dataset if Firestore is not yet populated or offline
    if (isValidCurriculumLevelId(levelId)) {
      for (const sId of subjectAliases) {
        for (const tId of topicAliases) {
          const match = SAMPLE_GLOBAL_QUESTION_SETS[levelId]?.filter(
            (item) => item.subjectId === sId && item.topicId === tId
          );
          if (match && match.length > 0) {
            const seen = new Set<string>();
            const unique: CurriculumQuestionSet[] = [];
            for (const m of match) {
              if (!seen.has(m.questionSet.id)) {
                seen.add(m.questionSet.id);
                unique.push(m.questionSet);
              }
            }
            return unique;
          }
        }
      }
    }

    return [];
  } catch (error) {
    console.warn(`[curriculumService] Error fetching question sets from Firestore (${levelId}/${subjectId}/${topicId}):`, error);
    
    // Offline/Fallback resolution
    if (isValidCurriculumLevelId(levelId)) {
      for (const sId of subjectAliases) {
        for (const tId of topicAliases) {
          const match = SAMPLE_GLOBAL_QUESTION_SETS[levelId]?.filter(
            (item) => item.subjectId === sId && item.topicId === tId
          );
          if (match && match.length > 0) {
            const seen = new Set<string>();
            const unique: CurriculumQuestionSet[] = [];
            for (const m of match) {
              if (!seen.has(m.questionSet.id)) {
                seen.add(m.questionSet.id);
                unique.push(m.questionSet);
              }
            }
            return unique;
          }
        }
      }
    }
    return [];
  }
}

/**
 * Retrieves a single question set document (strictly 1 read).
 *
 * Path: global_curriculum/{levelId}/subjects/{subjectId}/topics/{topicId}/question_sets/{setId}
 */
export async function fetchQuestionSetByIdFromFirestore(
  levelId: string,
  subjectId: string,
  topicId: string,
  setId: string
): Promise<CurriculumQuestionSet | null> {
  try {
    const docPath = getGlobalQuestionSetDocPath(
      levelId as GlobalCurriculumLevelId,
      subjectId,
      topicId,
      setId
    );
    const docRef = doc(db, docPath);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        ...(docSnap.data() as CurriculumQuestionSet),
        id: docSnap.id
      };
    }

    // Fallback to built-in seed dataset
    if (isValidCurriculumLevelId(levelId)) {
      const match = SAMPLE_GLOBAL_QUESTION_SETS[levelId]?.find(
        (item) => item.questionSet.id === setId
      );
      if (match) return match.questionSet;
    }

    return null;
  } catch (error) {
    console.warn(`[curriculumService] Error fetching single question set from Firestore (${setId}):`, error);
    
    // Offline/Fallback resolution
    if (isValidCurriculumLevelId(levelId)) {
      const match = SAMPLE_GLOBAL_QUESTION_SETS[levelId]?.find(
        (item) => item.questionSet.id === setId
      );
      if (match) return match.questionSet;
    }
    return null;
  }
}

// ============================================================================
// Cached Query Functions
// ============================================================================

/**
 * Fetches the subcollection of question sets for a topic with 24-hour caching.
 * Uses ensureQueryData so subsequent calls cost 0 Firestore reads.
 */
export async function getTopicQuestionSets(
  levelId: string,
  subjectId: string,
  topicId: string
): Promise<CurriculumQuestionSet[]> {
  const queryKey = curriculumKeys.topic(levelId, subjectId, topicId);
  return curriculumQueryClient.ensureQueryData({
    queryKey,
    queryFn: () => fetchTopicQuestionSetsFromFirestore(levelId, subjectId, topicId),
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime
  });
}

/**
 * Retrieves a single question set document (1 read maximum across session).
 * Subsequent calls resolve from memory cache with 0 Firestore reads.
 */
export async function getQuestionSetById(
  levelId: string,
  subjectId: string,
  topicId: string,
  setId: string
): Promise<CurriculumQuestionSet | null> {
  const queryKey = curriculumKeys.questionSet(levelId, subjectId, topicId, setId);
  return curriculumQueryClient.ensureQueryData({
    queryKey,
    queryFn: () => fetchQuestionSetByIdFromFirestore(levelId, subjectId, topicId, setId),
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime
  });
}

// ============================================================================
// React Hooks (TanStack Query)
// ============================================================================

/**
 * React hook to fetch and cache question sets for a topic.
 */
export function useTopicQuestionSets(
  levelId: string,
  subjectId: string,
  topicId: string
) {
  return useQuery({
    queryKey: curriculumKeys.topic(levelId, subjectId, topicId),
    queryFn: () => fetchTopicQuestionSetsFromFirestore(levelId, subjectId, topicId),
    enabled: Boolean(levelId && subjectId && topicId),
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime
  });
}

/**
 * React hook to fetch and cache a single question set by ID (1 read).
 */
export function useQuestionSetById(
  levelId: string,
  subjectId: string,
  topicId: string,
  setId: string
) {
  return useQuery({
    queryKey: curriculumKeys.questionSet(levelId, subjectId, topicId, setId),
    queryFn: () => fetchQuestionSetByIdFromFirestore(levelId, subjectId, topicId, setId),
    enabled: Boolean(levelId && subjectId && topicId && setId),
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime
  });
}

// ============================================================================
// Student Result Tracking (Multi-Tenant Isolated Path)
// ============================================================================

export interface QuizAttemptPayload {
  setId: string;
  levelId: GlobalCurriculumLevelId;
  subjectId: string;
  topicId: string;
  answers: Record<string, string>;
  score: number;
  maxScore: number;
  percentage: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  startedAt: string;
  completedAt?: string;
  timeSpentSeconds?: number;
  id?: string;
}

/**
 * Saves results strictly into the tenant's isolated path:
 * tenants/${tenantId}/students/${studentId}/quiz_attempts/${attemptId}
 *
 * Guarantees that:
 * 1. Progress writes go ONLY to the tenant's student record.
 * 2. NO tenant-identifiable or student data is EVER written back to global_curriculum.
 */
export async function recordQuizAttempt(
  tenantId: string,
  studentId: string,
  resultPayload: QuizAttemptPayload
): Promise<{ success: boolean; attemptId: string }> {
  if (!tenantId || !tenantId.trim()) {
    throw new Error('Tenant ID is required to record quiz attempt.');
  }
  if (!studentId || !studentId.trim()) {
    throw new Error('Student ID is required to record quiz attempt.');
  }

  const attemptId = resultPayload.id || `att_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const attemptPath = getTenantQuizAttemptDocPath(tenantId, studentId, attemptId);

  // Strip any accidental global curriculum references from mutating global space
  const cleanRecord: TenantQuizAttempt = {
    id: attemptId,
    tenantId,
    studentId,
    setId: resultPayload.setId,
    levelId: resultPayload.levelId,
    subjectId: resultPayload.subjectId,
    topicId: resultPayload.topicId,
    answers: resultPayload.answers || {},
    score: resultPayload.score || 0,
    maxScore: resultPayload.maxScore || 0,
    percentage: resultPayload.percentage || 0,
    status: resultPayload.status || 'completed',
    startedAt: resultPayload.startedAt || new Date().toISOString(),
    completedAt: resultPayload.completedAt || new Date().toISOString(),
    timeSpentSeconds: resultPayload.timeSpentSeconds || 0
  };

  const attemptDocRef = doc(db, attemptPath);

  await setDoc(attemptDocRef, {
    ...cleanRecord,
    recordedAt: serverTimestamp()
  });

  return { success: true, attemptId };
}

/**
 * React hook for submitting and recording student quiz attempts.
 */
export function useRecordQuizAttempt() {
  const mutation = useMutation({
    mutationFn: ({
      tenantId,
      studentId,
      resultPayload
    }: {
      tenantId: string;
      studentId: string;
      resultPayload: QuizAttemptPayload;
    }) => recordQuizAttempt(tenantId, studentId, resultPayload),
    onSuccess: (_, variables) => {
      // Invalidate student attempts cache without touching global curriculum
      curriculumQueryClient.invalidateQueries({
        queryKey: curriculumKeys.tenantAttempts(variables.tenantId, variables.studentId)
      });
    }
  });

  return {
    recordAttempt: mutation.mutateAsync,
    isRecording: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess
  };
}
