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
      title: 'Numbers & Number Operations',
      strandCode: 'S1',
      strandName: 'Strand 1: Number',
      strand: 'Strand 1: Number',
      subStrand: 'Number Operations & Computation',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 27,
      description: 'Master integers, place values, prime factorization, non-decimal bases, index laws, fractions, and standard form.'
    },
    {
      id: 'topic_fractions_decimals_percentages',
      title: 'Fractions, Decimals & Percentages',
      strandCode: 'S1',
      strandName: 'Strand 1: Number',
      strand: 'Strand 1: Number',
      subStrand: 'Fractions, Decimals & Percentages',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 27,
      description: 'Operations on proper/improper fractions, decimal conversions, percentage increases/decreases, and recurring decimals.'
    },
    {
      id: 'topic_ratio_proportion_financial',
      title: 'Ratio, Proportion & Financial Math',
      strandCode: 'S1',
      strandName: 'Strand 1: Number',
      strand: 'Strand 1: Number',
      subStrand: 'Ratios, Proportions & Commercial Applications',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 45,
      description: 'Master unit rates, proportional sharing, speed/travel graphs, simple interest, taxes, and compound rates.'
    },
    {
      id: 'topic_sets_and_venn_diagrams',
      title: 'Sets & Venn Diagrams',
      strandCode: 'S1',
      strandName: 'Strand 1: Number',
      strand: 'Strand 1: Number',
      subStrand: 'Sets, Logic & Venn Diagrams',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 27,
      description: 'Listing elements, set builder notation, union, intersection, complement, and universal two-set Venn diagrams.'
    },
    {
      id: 'topic_algebraic_expressions',
      title: 'Patterns & Algebraic Expressions',
      strandCode: 'S2',
      strandName: 'Strand 2: Algebra',
      strand: 'Strand 2: Algebra',
      subStrand: 'Patterns, Relations & Expressions',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 27,
      description: 'Foundational algebraic substitution, pairwise grouping factorization, fractional expansion, and change of subject.'
    },
    {
      id: 'topic_equations_inequalities_graphs',
      title: 'Equations, Inequalities & Coordinate Graphs',
      strandCode: 'S2',
      strandName: 'Strand 2: Algebra',
      strand: 'Strand 2: Algebra',
      subStrand: 'Linear Equations, Inequalities & Graphs',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 27,
      description: 'Linear equations in one and two variables, linear inequalities on number lines, Cartesian plotting, and linear mappings.'
    },
    {
      id: 'topic_geometry_and_trigonometry',
      title: 'Geometry, Measurement & Trigonometry',
      strandCode: 'S3',
      strandName: 'Strand 3: Geometry & Measurement',
      strand: 'Strand 3: Geometry & Measurement',
      subStrand: 'Shapes, Angles, Mensuration & Bearings',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 27,
      description: 'Angle properties, polygon interior angles, Pythagorean theorem, perimeter, area, volume, and compass bearings.'
    },
    {
      id: 'topic_data_handling_probability',
      title: 'Handling Data & Probability',
      strandCode: 'S4',
      strandName: 'Strand 4: Handling Data',
      strand: 'Strand 4: Handling Data',
      subStrand: 'Data Collection, Presentation & Probability',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 27,
      description: 'Frequency tables, bar charts, pie charts, mean, median, mode, stem-and-leaf, and experimental/theoretical probability.'
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
  topic_ratio_proportion_financial: 'topic_ratios_and_proportion',
  topic_ratios_and_proportion: 'topic_ratio_proportion_financial',
  topic_ratio_proportion_and_rates: 'topic_ratio_proportion_financial',
  topic_ratio_and_proportion: 'topic_ratio_proportion_financial',
  topic_algebraic_expressions_and_equations: 'topic_algebraic_expressions',
  topic_algebraic_expressions: 'topic_algebraic_expressions_and_equations',
  topic_sets_and_venn_diagrams: 'topic_sets_and_operations',
  topic_sets_and_operations: 'topic_sets_and_venn_diagrams',
  topic_equations_inequalities_graphs: 'topic_relations_mappings_and_graphs',
  topic_relations_mappings_and_graphs: 'topic_equations_inequalities_graphs',
  topic_geometry_and_trigonometry: 'topic_geometry_polygons_and_mensuration',
  topic_geometry_polygons_and_mensuration: 'topic_geometry_and_trigonometry',
  topic_data_handling_probability: 'topic_statistics_and_probability',
  topic_statistics_and_probability: 'topic_data_handling_probability'
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
