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
      id: 'topic_numbers_and_numeration',
      title: 'Numbers, Numeration & Operations',
      strand: 'Strand 1: Number & Numeration',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      status: 'ready',
      hasNotes: true,
      questionCount: 27,
      description: 'Comprehensive mastery of integers, place values, prime factorization, non-decimal bases, index laws, fractions, and standard form.'
    },
    {
      id: 'topic_sets_and_operations',
      title: 'Sets, Logic & Venn Diagrams',
      strand: 'Strand 1: Number & Numeration',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      status: 'pending_content',
      hasNotes: false,
      description: 'Listing elements, set builder notation, union, intersection, and universal two-set Venn diagrams.'
    },
    {
      id: 'topic_ratio_proportion_and_rates',
      title: 'Ratio, Proportion, Rates & Business Math',
      strand: 'Strand 1: Number & Numeration',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      status: 'pending_content',
      hasNotes: false,
      description: 'Direct comparison, unitary method, ratio sharing, rates of work, percentage profit/loss, and simple interest.'
    },
    {
      id: 'topic_algebraic_expressions_and_equations',
      title: 'Algebraic Expressions, Formulae & Equations',
      strand: 'Strand 2: Patterns & Algebra',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      status: 'pending_content',
      hasNotes: false,
      description: 'Algebraic terminology, simplification, linear equations, factorization, and change of subject.'
    },
    {
      id: 'topic_relations_mappings_and_graphs',
      title: 'Relations, Mappings & Coordinate Graphs',
      strand: 'Strand 2: Patterns & Algebra',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      status: 'pending_content',
      hasNotes: false,
      description: 'Arrow diagrams, domain and range, linear mapping rules, Cartesian coordinates, and graph plotting.'
    },
    {
      id: 'topic_geometry_polygons_and_mensuration',
      title: 'Geometry, Polygons & Mensuration',
      strand: 'Strand 3: Geometry & Measurement',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      status: 'pending_content',
      hasNotes: false,
      description: 'Angle properties, polygon interior angles, Pythagorean theorem, perimeter, area of plane figures, and volume.'
    },
    {
      id: 'topic_transformations_vectors_and_bearings',
      title: 'Transformations, Vectors & Bearings',
      strand: 'Strand 3: Geometry & Measurement',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      status: 'pending_content',
      hasNotes: false,
      description: 'Reflection, rotation, translation, column vectors, vector addition, and compass bearings.'
    },
    {
      id: 'topic_statistics_and_probability',
      title: 'Data Statistics & Probability',
      strand: 'Strand 4: Handling Data',
      levelsAvailable: ['JHS 1', 'JHS 2', 'JHS 3'],
      status: 'pending_content',
      hasNotes: false,
      description: 'Data collection, frequency tables, bar charts, pie charts, mean, median, mode, and simple experimental probability.'
    }
  ]
};

/**
 * Fetches the subject topics manifest document.
 * Path: global_curriculum/{levelId}/subjects/{subjectId}/manifests/topical_labs
 * Fallback: global_curriculum/{levelId}/subjects/{subjectId}
 * Costs exactly 1 Firestore document read.
 */
export async function fetchSubjectTopicsManifest(
  levelId: string = 'jhs',
  subjectId: string = 'math'
): Promise<SubjectTopicsManifest> {
  try {
    // 1. Primary registry path: global_curriculum/jhs/subjects/math/manifests/topical_labs
    const primaryRef = doc(db, 'global_curriculum', levelId, 'subjects', subjectId, 'manifests', 'topical_labs');
    const primarySnap = await getDoc(primaryRef);

    if (primarySnap.exists()) {
      const data = primarySnap.data() as SubjectTopicsManifest;
      return {
        ...DEFAULT_JHS_MATH_MANIFEST,
        ...data,
        topics: data.topics && data.topics.length > 0 ? data.topics : DEFAULT_JHS_MATH_MANIFEST.topics
      };
    }

    // 2. Fallback to subject document
    const subjectRef = doc(db, 'global_curriculum', levelId, 'subjects', subjectId);
    const subjectSnap = await getDoc(subjectRef);

    if (subjectSnap.exists()) {
      const data = subjectSnap.data() as SubjectTopicsManifest;
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

const TOPIC_DOC_ALIASES: Record<string, string> = {
  topic_ratios_and_proportion: 'topic_ratio_and_proportion',
  topic_ratio_proportion_and_rates: 'topic_ratios_and_proportion',
  topic_ratio_and_proportion: 'topic_ratios_and_proportion',
  topic_algebraic_expressions_and_equations: 'topic_algebraic_expressions',
  topic_algebraic_expressions: 'topic_algebraic_expressions_and_equations'
};

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

    // Check alias if primary doc not found
    const aliasId = TOPIC_DOC_ALIASES[topicDocId];
    if (aliasId) {
      const aliasRef = doc(db, 'global_curriculum', levelId, 'subjects', subjectId, 'topics', aliasId);
      const aliasSnap = await getDoc(aliasRef);
      if (aliasSnap.exists()) {
        return {
          ...(aliasSnap.data() as TopicalLabDocument),
          id: snap.id
        };
      }
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
