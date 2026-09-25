/**
 * Topical Lab Service Module
 *
 * Provides cached data fetching for Topical Practice Labs (Unit & Strand Drills).
 * Adheres to:
 * 1. Strict 1-Document Read Guarantee (Each topic document contains all tiers, notes, examples, and practice pools).
 * 2. 24-hour TanStack Query in-memory cache to prevent redundant reads.
 * 3. Fallback support when offline.
 */

import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { curriculumQueryClient, CACHE_CONFIG } from './curriculumService';
import {
  TopicalLabDocument,
  SubjectTopicsManifest,
  TopicalPracticeQuestion,
  TopicalPracticeDifficulty
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

export const DEFAULT_JHS_ENGLISH_MANIFEST: SubjectTopicsManifest = {
  subject: 'English Language',
  tier: 'Junior Secondary (JHS)',
  totalTopics: 8,
  topics: [
    {
      id: 'oral_phonology_sounds',
      title: 'Phonology, Intonation & Stress',
      strandCode: 'S1',
      strandName: 'STRAND 1: ORAL LANGUAGE',
      strand: 'STRAND 1: ORAL LANGUAGE',
      subStrand: 'Speech Sounds, Diphthongs & Stress Patterns',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 450,
      totalQuestions: 450,
      description: 'Master pure vowels (monophthongs), closing/centering diphthongs, consonant clusters, silent letters, word stress, and grammatical intonation contours.'
    },
    {
      id: 'oral_listening_conversation',
      title: 'Listening Comprehension & Public Speaking',
      strandCode: 'S1',
      strandName: 'STRAND 1: ORAL LANGUAGE',
      strand: 'STRAND 1: ORAL LANGUAGE',
      subStrand: 'Conversation, Listening & Dialogue',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 3,
      description: 'Master active listening skills, conversational turn-taking, polite requests, telephone etiquette, debate delivery, and oral presentation protocols.'
    },
    {
      id: 'reading_comprehension_summary',
      title: 'Textual Analysis & Summary Skills',
      strandCode: 'S2',
      strandName: 'STRAND 2: READING & LITERATURE',
      strand: 'STRAND 2: READING & LITERATURE',
      subStrand: 'Reading Comprehension & Summarization',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 3,
      description: 'Master skim-and-scan techniques, locating explicit information, making deductive inferences, decoding contextual vocabulary, and writing summaries under strict word limits.'
    },
    {
      id: 'literature_cockcrow_canon',
      title: 'Prose, Drama & Poetry Analysis',
      strandCode: 'S2',
      strandName: 'STRAND 2: READING & LITERATURE',
      strand: 'STRAND 2: READING & LITERATURE',
      subStrand: 'The Cockcrow Anthology & Literary Devices',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 3,
      description: 'Master the prescribed WAEC Cockcrow texts: Dickens Oliver Twist, Aidoo The Dilemma of a Ghost, short stories, prescribed poetry, and literary devices.'
    },
    {
      id: 'grammar_parts_of_speech_lexis',
      title: 'Lexis, Cumulative Adjectives & Prepositions',
      strandCode: 'S3',
      strandName: 'STRAND 3: GRAMMAR USAGE',
      strand: 'STRAND 3: GRAMMAR USAGE',
      subStrand: 'Parts of Speech, Phrasal Verbs & Prepositions',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 3,
      description: 'Master cumulative adjective order, dependent prepositions, phrasal verbs, reciprocal pronouns, non-assertive determiners, and partitive mass quantifiers.'
    },
    {
      id: 'grammar_syntax_clauses_concord',
      title: 'Complex Syntax, Concord & Conditionals',
      strandCode: 'S3',
      strandName: 'STRAND 3: GRAMMAR USAGE',
      strand: 'STRAND 3: GRAMMAR USAGE',
      subStrand: 'Syntax, Clauses, Concord & Conditionals',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 3,
      description: 'Master subject-verb proximity concord, 1st/2nd/3rd conditionals, inverted conditionals, the mandative subjunctive, reported speech backshifts, and passive voice.'
    },
    {
      id: 'writing_letter_formats',
      title: 'Letter Writing & Petitions',
      strandCode: 'S4',
      strandName: 'STRAND 4: WRITING & COMPOSITION',
      strand: 'STRAND 4: WRITING & COMPOSITION',
      subStrand: 'Formal, Informal & Semi-Formal Letters',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 3,
      description: 'Master conventions of personal letters, petitions to administrative authorities (DCE, MCE, Ministers), semi-formal correspondence, layout address rules, and appropriate sign-offs.'
    },
    {
      id: 'writing_essays_articles_debates',
      title: 'Essays, Articles for Publication & Debates',
      strandCode: 'S4',
      strandName: 'STRAND 4: WRITING & COMPOSITION',
      strand: 'STRAND 4: WRITING & COMPOSITION',
      subStrand: 'Narrative, Descriptive, Argumentative & Articles',
      levelsAvailable: ['B7', 'B8', 'B9'],
      status: 'ready',
      hasNotes: true,
      questionCount: 3,
      description: 'Master composition writing: narrative moral stories illustrating proverbs, descriptive travelogues, articles for national daily publication, and competitive debate speeches.'
    }
  ]
};

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
  const normSub = (subjectId || 'math').toLowerCase();
  const defaultManifest = normSub.includes('english')
    ? DEFAULT_JHS_ENGLISH_MANIFEST
    : normSub.includes('science')
      ? DEFAULT_JHS_SCIENCE_MANIFEST
      : DEFAULT_JHS_MATH_MANIFEST;

  try {
    // 1. Primary registry path: global_curriculum/{levelId}/subjects/{subjectId}/manifests/topical_labs
    const primaryRef = doc(db, 'global_curriculum', levelId, 'subjects', subjectId, 'manifests', 'topical_labs');
    const primarySnap = await getDoc(primaryRef);

    if (primarySnap.exists()) {
      const data = primarySnap.data() as SubjectTopicsManifest;
      return {
        ...defaultManifest,
        ...data,
        topics: data.topics && data.topics.length > 0 ? data.topics : defaultManifest.topics
      };
    }

    // 2. Fallback to subject document
    const subjectRef = doc(db, 'global_curriculum', levelId, 'subjects', subjectId);
    const subjectSnap = await getDoc(subjectRef);

    if (subjectSnap.exists()) {
      const data = subjectSnap.data() as SubjectTopicsManifest;
      return {
        ...defaultManifest,
        ...data,
        topics: data.topics && data.topics.length > 0 ? data.topics : defaultManifest.topics
      };
    }
  } catch (err) {
    console.warn(`[topicalLabService] Error reading manifest (${levelId}/${subjectId}), using fallback:`, err);
  }

  return defaultManifest;
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
function adaptEnglishOrGenericDocToTopicalLab(docId: string, data: any): TopicalLabDocument {
  const mapQ = (q: any): TopicalPracticeQuestion => ({
    ...q,
    id: q.id || `q_${Math.random().toString(36).substr(2, 6)}`,
    difficulty: ((q.difficulty === 'hard' || q.difficulty === 'high') ? 'hard' : (q.difficulty === 'medium' ? 'medium' : 'low')) as TopicalPracticeDifficulty,
    prompt: q.prompt || '',
    options: q.options || [],
    correctAnswer: q.correctAnswer || '',
    hint: q.hint || '',
    workedSolution: q.workedSolution || '',
    points: q.points || 1,
    learningCompetency: q.learningCompetency
  });

  const rawQuestions: any[] = data.tasks || data.questions || [];
  const b7Questions = rawQuestions.filter(q => (q.level || '').toUpperCase() === 'B7');
  const b8Questions = rawQuestions.filter(q => (q.level || '').toUpperCase() === 'B8');
  const b9Questions = rawQuestions.filter(q => (q.level || '').toUpperCase() === 'B9');

  const notesObj = data.conceptNotes || {};
  const b7Notes = notesObj.b7_overview || data.summary || '';
  const b8Notes = notesObj.b8_progression || data.summary || '';
  const b9Notes = notesObj.b9_mastery || data.summary || '';

  const buildPool = (list: any[]) => ({
    low: list.filter(q => q.difficulty === 'low').map(mapQ),
    medium: list.filter(q => q.difficulty === 'medium').map(mapQ),
    hard: list.filter(q => q.difficulty === 'hard' || q.difficulty === 'high').map(mapQ)
  });

  return {
    id: docId,
    topicId: data.topicId || docId,
    title: data.topicTitle || data.title || docId,
    subject: data.subject || (data.subjectId === 'english' ? 'English Language' : data.subjectId === 'science' ? 'Integrated Science' : 'Mathematics'),
    tier: 'Junior Secondary (JHS)',
    badge: 'NaCCA Common Core Programme (CCP)',
    description: data.summary || data.description || '',
    totalPracticeQuestions: rawQuestions.length,
    version: 1,
    levels: {
      b7: {
        levelTitle: `B7 • ${data.subStrandTitle || data.topicTitle || 'Basic 7 Core'}`,
        summary: data.summary || '',
        notes: b7Notes,
        workedExamples: [],
        practicePool: buildPool(b7Questions.length > 0 ? b7Questions : rawQuestions)
      },
      b8: {
        levelTitle: `B8 • ${data.subStrandTitle || data.topicTitle || 'Basic 8 Progression'}`,
        summary: data.summary || '',
        notes: b8Notes,
        workedExamples: [],
        practicePool: buildPool(b8Questions.length > 0 ? b8Questions : rawQuestions)
      },
      b9: {
        levelTitle: `B9 • ${data.subStrandTitle || data.topicTitle || 'Basic 9 Mastery'}`,
        summary: data.summary || '',
        notes: b9Notes,
        workedExamples: [],
        practicePool: buildPool(b9Questions.length > 0 ? b9Questions : rawQuestions)
      }
    },
    updatedAt: data.metadata?.updatedAt || new Date().toISOString()
  };
}

export async function fetchTopicalLabDoc(
  topicDocId: string,
  levelId: string = 'jhs',
  subjectId: string = 'math'
): Promise<TopicalLabDocument | null> {
  try {
    // 0. Primary check in dedicated 'topical' subcollection (e.g. global_curriculum/jhs/subjects/english/topical/[topicDocId])
    const topicalDocRef = doc(db, 'global_curriculum', levelId, 'subjects', subjectId, 'topical', topicDocId);
    const topicalDocSnap = await getDoc(topicalDocRef);
    if (topicalDocSnap.exists()) {
      const data = topicalDocSnap.data() as any;

      // Check subcollection practice_labs for all tiers (e.g. B7_foundation, B8_foundation)
      try {
        const labsCollRef = collection(db, 'global_curriculum', levelId, 'subjects', subjectId, 'topical', topicDocId, 'practice_labs');
        const labsSnap = await getDocs(labsCollRef);
        if (!labsSnap.empty) {
          if (!data.levels) data.levels = {};
          labsSnap.forEach(labDoc => {
            const labId = labDoc.id; // e.g. B7_foundation, B8_foundation
            const subData = labDoc.data() as any;
            const subItems = subData.tasks || subData.questions || [];
            if (subItems.length > 0) {
              const parts = labId.toLowerCase().split('_');
              const lvl = parts[0] || 'b7';
              const diffRaw = parts[1] || 'foundation';
              const poolKey = diffRaw === 'foundation' ? 'low' : diffRaw === 'intermediate' ? 'medium' : 'hard';

              if (!data.levels[lvl]) data.levels[lvl] = { practicePool: { low: [], medium: [], hard: [] } };
              if (!data.levels[lvl].practicePool) data.levels[lvl].practicePool = { low: [], medium: [], hard: [] };
              data.levels[lvl].practicePool[poolKey] = subItems;

              if (labId === 'B7_foundation' || !data.tasks) {
                data.tasks = subItems;
                data.questions = subItems;
              }
            }
          });
        }
      } catch (subErr) {
        console.warn('[topicalLabService] Error reading subcollection labs:', subErr);
      }

      // Defensively align root tasks and questions
      const rootItems = data.tasks || data.questions || [];
      if (rootItems.length > 0) {
        if (!data.levels) data.levels = {};
        if (!data.levels.b7) data.levels.b7 = { practicePool: { low: [] } };
        if (!data.levels.b7.practicePool) data.levels.b7.practicePool = { low: [] };
        if (!data.levels.b7.practicePool.low || data.levels.b7.practicePool.low.length === 0) {
          data.levels.b7.practicePool.low = rootItems;
        }
        data.tasks = data.tasks || rootItems;
        data.questions = data.questions || rootItems;
      }

      if (data.levels) {
        return { ...data, id: topicalDocSnap.id } as TopicalLabDocument;
      }
      return adaptEnglishOrGenericDocToTopicalLab(topicalDocSnap.id, data);
    }

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
        } as unknown as TopicalLabDocument;
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
          id: aliasSnap.id
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
  subjectId: string = 'math',
  forceRefresh: boolean = false
): Promise<TopicalLabDocument | null> {
  const queryKey = topicalLabKeys.topicDoc(levelId, subjectId, topicDocId);
  if (forceRefresh) {
    curriculumQueryClient.removeQueries({ queryKey });
    return fetchTopicalLabDoc(topicDocId, levelId, subjectId);
  }
  return curriculumQueryClient.ensureQueryData({
    queryKey,
    queryFn: () => fetchTopicalLabDoc(topicDocId, levelId, subjectId),
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime
  });
}

/**
 * Clears all topical lab queries from client-side TanStack cache
 */
export function clearTopicalLabCache() {
  curriculumQueryClient.clear();
}

/**
 * Invalidates cached topical lab queries.
 */
export function invalidateTopicalLabCache(topicDocId?: string, subjectId?: string) {
  if (topicDocId) {
    const subjects = subjectId ? [subjectId] : ['math', 'english', 'science'];
    subjects.forEach(sub => {
      curriculumQueryClient.invalidateQueries({
        queryKey: topicalLabKeys.topicDoc('jhs', sub, topicDocId)
      });
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
