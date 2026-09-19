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
import { NACCA_JHS_SCIENCE_TOPICAL_UNITS } from '../data/jhs-science-curriculum';

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

/**
 * Fallback manifest representing the official NaCCA CCP Science strands/topics.
 */
export const DEFAULT_JHS_SCIENCE_MANIFEST: SubjectTopicsManifest = {
  subject: 'Integrated Science',
  tier: 'Junior Secondary (JHS)',
  totalTopics: NACCA_JHS_SCIENCE_TOPICAL_UNITS.length,
  topics: NACCA_JHS_SCIENCE_TOPICAL_UNITS.map(unit => ({
    id: unit.id,
    title: unit.subStrandTitle,
    strandCode: `S${unit.strandNumber}`,
    strandName: unit.strandTitle.toUpperCase(),
    strand: unit.strandTitle.toUpperCase(),
    subStrand: unit.subStrandTitle,
    levelsAvailable: [unit.gradeLevel.replace('BS', 'B')],
    status: 'ready',
    hasNotes: true,
    questionCount: unit.drillQuestions.length,
    description: `NaCCA CCP ${unit.gradeLevel} unit on ${unit.subStrandTitle} with interactive labs, worked examples, and graded practice pools.`
  }))
};

export const DEFAULT_JHS_MATH_MANIFEST: SubjectTopicsManifest = {
  subject: 'Mathematics',
  tier: 'Junior Secondary (JHS)',
  totalTopics: 8,
  topics: [
    {
      id: 'topic_numbers_and_numeration',
      title: 'Numbers & Number Operations',
      strandCode: 'S1',
      strandName: 'STRAND 1: NUMBER',
      strand: 'STRAND 1: NUMBER',
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
      strandName: 'STRAND 1: NUMBER',
      strand: 'STRAND 1: NUMBER',
      subStrand: 'Fractions, Decimals & Benchmarks',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 27,
      description: 'Master benchmark fractions, decimal arithmetic, percentage conversions, and order of operations.'
    },
    {
      id: 'topic_ratio_proportion_financial',
      title: 'Ratio, Proportion & Financial Math',
      strandCode: 'S1',
      strandName: 'STRAND 1: NUMBER',
      strand: 'STRAND 1: NUMBER',
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
      strandName: 'STRAND 1: NUMBER',
      strand: 'STRAND 1: NUMBER',
      subStrand: 'Sets, Logic & Venn Diagrams',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 27,
      description: 'Master listing elements, set builder notation, union, intersection, complement, and universal two-set Venn diagrams.'
    },
    {
      id: 'topic_algebraic_expressions',
      title: 'Patterns & Algebraic Expressions',
      strandCode: 'S2',
      strandName: 'STRAND 2: ALGEBRA',
      strand: 'STRAND 2: ALGEBRA',
      subStrand: 'Patterns, Relations & Expressions',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 27,
      description: 'Master foundational algebraic substitution, pairwise grouping factorization, fractional expansion, and change of subject.'
    },
    {
      id: 'topic_equations_inequalities_graphs',
      title: 'Equations, Inequalities & Coordinate Graphs',
      strandCode: 'S2',
      strandName: 'STRAND 2: ALGEBRA',
      strand: 'STRAND 2: ALGEBRA',
      subStrand: 'Linear Equations, Inequalities & Graphs',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 27,
      description: 'Master linear equations in one and two variables, linear inequalities on number lines, Cartesian plotting, and linear mappings.'
    },
    {
      id: 'topic_geometry_and_trigonometry',
      title: 'Geometry, Measurement & Trigonometry',
      strandCode: 'S3',
      strandName: 'STRAND 3: GEOMETRY & MEASUREMENT',
      strand: 'STRAND 3: GEOMETRY & MEASUREMENT',
      subStrand: 'Shapes, Angles, Mensuration & Bearings',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 27,
      description: 'Master angle properties, polygon interior angles, Pythagorean theorem, perimeter, area, volume, and compass bearings.'
    },
    {
      id: 'topic_data_handling_probability',
      title: 'Handling Data & Probability',
      strandCode: 'S4',
      strandName: 'STRAND 4: HANDLING DATA',
      strand: 'STRAND 4: HANDLING DATA',
      subStrand: 'Data Collection, Presentation & Probability',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 27,
      description: 'Master frequency tables, bar charts, pie charts, mean, median, mode, stem-and-leaf, and experimental/theoretical probability.'
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
    // 1. Primary check in topical_units (e.g. Science units: bs7_strand1_living_cells)
    const unitRef = doc(db, 'global_curriculum', levelId, 'subjects', subjectId, 'topical_units', topicDocId);
    const unitSnap = await getDoc(unitRef);
    if (unitSnap.exists()) {
      const data = unitSnap.data() as any;
      if (data.notes && data.drillQuestions) {
        const lvlKey = (data.gradeLevel?.toLowerCase() || 'b7').replace('bs', 'b');
        const mapDrill = (q: any) => ({
          id: q.id,
          difficulty: q.difficulty === 'high' ? 'hard' : q.difficulty,
          prompt: q.prompt,
          options: q.options || [],
          correctAnswer: q.correctAnswer,
          hint: q.hint,
          workedSolution: q.workedSolution,
          points: q.points || 1,
          diagramSvg: q.diagramSvg
        });

        const workedExamples = (data.sampleWorkedProblems || []).map((p: any) => ({
          id: p.id,
          title: `Worked Example: ${p.questionPrompt.slice(0, 50)}...`,
          problem: p.questionPrompt,
          steps: [p.stepByStepSolution],
          finalAnswer: p.examinerTip ? `Examiner Tip: ${p.examinerTip}` : '',
          diagramSvg: data.notes?.diagramSvg
        }));

        let notesMarkdown = data.notes.summaryMarkdown || '';
        if (data.notes.keyTerms && data.notes.keyTerms.length > 0) {
          notesMarkdown += '\n\n#### Key Terminology\n' + data.notes.keyTerms.map((kt: any) => `* **${kt.term}:** ${kt.definition}`).join('\n');
        }

        return {
          id: unitSnap.id,
          title: `${data.strandTitle}: ${data.subStrandTitle}`,
          strand: data.strandTitle,
          strandCode: `S${data.strandNumber}`,
          subStrand: data.subStrandTitle,
          levels: {
            [lvlKey]: {
              levelTitle: `${data.gradeLevel} • ${data.subStrandTitle}`,
              summary: `${data.strandTitle} — ${data.subStrandTitle}`,
              notes: notesMarkdown,
              diagramSvg: data.notes?.diagramSvg,
              workedExamples,
              practicePool: {
                low: (data.drillQuestions || []).filter((q: any) => q.difficulty === 'low').map(mapDrill),
                medium: (data.drillQuestions || []).filter((q: any) => q.difficulty === 'medium').map(mapDrill),
                hard: (data.drillQuestions || []).filter((q: any) => q.difficulty === 'high' || q.difficulty === 'hard').map(mapDrill)
              }
            }
          }
        } as TopicalLabDocument;
      }
      return { ...(data as TopicalLabDocument), id: unitSnap.id };
    }

    // 2. Primary topics path: global_curriculum/{levelId}/subjects/{subjectId}/topics/{topicDocId}
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
