/**
 * Topical Lab Service Module
 *
 * Provides cached data fetching for Topical Practice Labs (Unit & Strand Drills).
 * Adheres to:
 * 1. Strict 1-Document Read Guarantee (Each topic document contains all tiers, notes, examples, and practice pools).
 * 2. 24-hour TanStack Query in-memory cache to prevent redundant reads.
 * 3. Fallback support when offline.
 */

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { curriculumQueryClient, CACHE_CONFIG } from './curriculumService';
import {
  TopicalLabDocument,
  SubjectTopicsManifest
} from '@/lib/topical-lab-types';

export const topicalLabKeys = {
  all: ['topical_labs'] as const,
  manifest: (levelId: string, subjectId: string) =>
    [...topicalLabKeys.all, levelId, subjectId, 'manifest'] as const,
  topicDoc: (levelId: string, subjectId: string, topicDocId: string) =>
    [...topicalLabKeys.all, levelId, subjectId, topicDocId] as const
};

/**
 * Fallback manifest representing the 8 core Ghanaian JHS Mathematics strands/topics.
 */
export const DEFAULT_JHS_MATH_MANIFEST: SubjectTopicsManifest = {
  subject: 'Mathematics',
  tier: 'Junior Secondary (JHS)',
  totalTopics: 8,
  topics: [
    {
      id: 'topic_ratio_and_proportion',
      title: 'Ratio, Proportion & Rates',
      strand: 'Strand 1: Number & Numeration',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      questionCount: 45,
      hasNotes: true,
      description: 'Master foundational direct comparison, multi-tier sharing, inverse proportions, and compound commercial rates.'
    },
    {
      id: 'topic_algebraic_expressions',
      title: 'Algebraic Expressions & Equations',
      strand: 'Strand 2: Patterns & Algebra',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      questionCount: 45,
      hasNotes: true,
      description: 'Algebraic terminology, simplification, linear equations, factorization, and change of subject.'
    },
    {
      id: 'topic_numbers_and_numeration',
      title: 'Integers, Decimals & Fractions',
      strand: 'Strand 1: Number & Numeration',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      questionCount: 45,
      hasNotes: true,
      description: 'Operations on integers, place value, rounding, prime factorization, and rational fraction arithmetic.'
    },
    {
      id: 'topic_linear_equations_and_inequalities',
      title: 'Linear Equations & Inequalities',
      strand: 'Strand 2: Patterns & Algebra',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      questionCount: 45,
      hasNotes: true,
      description: 'Single-variable linear inequalities, truth sets, number line graphs, and word problem modeling.'
    },
    {
      id: 'topic_geometry_and_construction',
      title: 'Plane Geometry & Geometric Construction',
      strand: 'Strand 3: Geometry & Measurement',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      questionCount: 45,
      hasNotes: true,
      description: 'Angles, parallel lines, compass triangle constructions, mediators, and circumcircles.'
    },
    {
      id: 'topic_mensuration_perimeter_area_volume',
      title: 'Mensuration: Perimeter, Area & Volume',
      strand: 'Strand 3: Geometry & Measurement',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      questionCount: 45,
      hasNotes: true,
      description: 'Polygons, circles, surface areas of prisms, cylinders, and volumetric displacement.'
    },
    {
      id: 'topic_data_handling_and_probability',
      title: 'Data Handling, Statistics & Probability',
      strand: 'Strand 4: Data & Statistics',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      questionCount: 45,
      hasNotes: true,
      description: 'Frequency tables, bar charts, pie charts, mean, median, mode, and simple experimental probability.'
    },
    {
      id: 'topic_sets_and_operations',
      title: 'Set Theory, Operations & Venn Modeling',
      strand: 'Strand 1: Number & Numeration',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      questionCount: 45,
      hasNotes: true,
      description: 'Listing elements, set builder notation, union, intersection, and universal two-set Venn diagrams.'
    }
  ]
};

/**
 * Fetches the subject topics manifest document.
 * Path: global_curriculum/{levelId}/subjects/{subjectId}
 * Costs exactly 1 Firestore document read.
 */
export async function fetchSubjectTopicsManifest(
  levelId: string = 'jhs',
  subjectId: string = 'math'
): Promise<SubjectTopicsManifest> {
  try {
    const manifestRef = doc(db, 'global_curriculum', levelId, 'subjects', subjectId);
    const snap = await getDoc(manifestRef);

    if (snap.exists()) {
      const data = snap.data() as SubjectTopicsManifest;
      return {
        ...DEFAULT_JHS_MATH_MANIFEST,
        ...data,
        topics: data.topics && data.topics.length > 0 ? data.topics : DEFAULT_JHS_MATH_MANIFEST.topics
      };
    }
  } catch (err) {
    console.warn(`[topicalLabService] Error reading manifest (${levelId}/${subjectId}), using fallback:`, err);
  }

  return DEFAULT_JHS_MATH_MANIFEST;
}

/**
 * Cached getter for the subject topics manifest (24h cache).
 */
export async function getSubjectTopicsManifest(
  levelId: string = 'jhs',
  subjectId: string = 'math'
): Promise<SubjectTopicsManifest> {
  const queryKey = topicalLabKeys.manifest(levelId, subjectId);
  return curriculumQueryClient.ensureQueryData({
    queryKey,
    queryFn: () => fetchSubjectTopicsManifest(levelId, subjectId),
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime
  });
}

/**
 * Fetches a single Topical Lab document containing all tiered levels and question pools.
 * Path: global_curriculum/{levelId}/subjects/{subjectId}/topics/{topicDocId}
 * Strictly 1 Firestore document read.
 */
export async function fetchTopicalLabDoc(
  topicDocId: string,
  levelId: string = 'jhs',
  subjectId: string = 'math'
): Promise<TopicalLabDocument | null> {
  try {
    const topicRef = doc(db, 'global_curriculum', levelId, 'subjects', subjectId, 'topics', topicDocId);
    const snap = await getDoc(topicRef);

    if (snap.exists()) {
      return {
        ...(snap.data() as TopicalLabDocument),
        id: snap.id
      };
    }
    return null;
  } catch (err) {
    console.warn(`[topicalLabService] Error reading topic lab document (${topicDocId}):`, err);
    return null;
  }
}

/**
 * Cached getter for a Topical Lab document (24h cache, 1 read per session).
 */
export async function getTopicalLabDoc(
  topicDocId: string,
  levelId: string = 'jhs',
  subjectId: string = 'math'
): Promise<TopicalLabDocument | null> {
  const queryKey = topicalLabKeys.topicDoc(levelId, subjectId, topicDocId);
  return curriculumQueryClient.ensureQueryData({
    queryKey,
    queryFn: () => fetchTopicalLabDoc(topicDocId, levelId, subjectId),
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime
  });
}

/**
 * Invalidates cached topical lab queries.
 */
export function invalidateTopicalLabCache(topicDocId?: string) {
  if (topicDocId) {
    curriculumQueryClient.invalidateQueries({
      queryKey: topicalLabKeys.topicDoc('jhs', 'math', topicDocId)
    });
  } else {
    curriculumQueryClient.invalidateQueries({
      queryKey: topicalLabKeys.all
    });
  }
}

/**
 * Merges updates into an existing topic lab document.
 * Adheres to the Extensibility & Add-on Guarantee.
 */
export async function updateTopicalLabDoc(
  topicDocId: string,
  updates: Partial<TopicalLabDocument>,
  levelId: string = 'jhs',
  subjectId: string = 'math'
): Promise<void> {
  const topicRef = doc(db, 'global_curriculum', levelId, 'subjects', subjectId, 'topics', topicDocId);
  await setDoc(
    topicRef,
    {
      ...updates,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
  invalidateTopicalLabCache(topicDocId);
}
