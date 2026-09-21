import { SET_JHS_SCIENCE_SAMPLE_P1 } from './data/jhs-curriculum-set-70';
import { SET_JHS_SCIENCE_SAMPLE_P2 } from './data/jhs-curriculum-set-71';
import { SET_BECE_2026_SCIENCE_P1 } from './data/jhs-curriculum-set-72';
import { SET_BECE_2026_SCIENCE_P2 } from './data/jhs-curriculum-set-73';
import { SET_BECE_2014_SCIENCE_P1 } from './data/jhs-curriculum-set-74';
import { SET_BECE_2014_SCIENCE_P2 } from './data/jhs-curriculum-set-75';
import { SET_BECE_2015_SCIENCE_P1 } from './data/jhs-curriculum-set-76';
import { SET_BECE_2015_SCIENCE_P2 } from './data/jhs-curriculum-set-77';
import { SET_BECE_2016_SCIENCE_P1 } from './data/jhs-curriculum-set-78';
import { SET_BECE_2016_SCIENCE_P2 } from './data/jhs-curriculum-set-79';
import { SET_BECE_2017_SCIENCE_P1 } from './data/jhs-curriculum-set-80';
import { SET_BECE_2017_SCIENCE_P2 } from './data/jhs-curriculum-set-81';
import { SET_BECE_2018_SCIENCE_P1 } from './data/jhs-curriculum-set-84';
import { SET_BECE_2018_SCIENCE_P2 } from './data/jhs-curriculum-set-85';
import { SET_BECE_2021_SCIENCE_P1 } from './data/jhs-curriculum-set-86';
import { SET_BECE_2021_SCIENCE_P2 } from './data/jhs-curriculum-set-87';
import { SET_BECE_2022_SCIENCE_P1 } from './data/jhs-curriculum-set-88';
import { SET_BECE_2022_SCIENCE_P2 } from './data/jhs-curriculum-set-89';
import { SET_BECE_2012_SCIENCE_P1 } from './data/jhs-curriculum-set-92';
import { SET_BECE_2012_SCIENCE_P2 } from './data/jhs-curriculum-set-93';
import { SET_BECE_2011_SCIENCE_P1 } from './data/jhs-curriculum-set-94';
import { SET_BECE_2011_SCIENCE_P2 } from './data/jhs-curriculum-set-95';
import { SET_BECE_2010_SCIENCE_P1 } from './data/jhs-curriculum-set-96';
import { SET_BECE_2010_SCIENCE_P2 } from './data/jhs-curriculum-set-97';
import { SET_BECE_1990_SCIENCE_P1 } from './data/jhs-curriculum-set-98';
import { SET_BECE_1990_SCIENCE_P2 } from './data/jhs-curriculum-set-99';
import { SET_BECE_2009_SCIENCE_P1 } from './data/jhs-curriculum-set-100';
import { SET_BECE_2009_SCIENCE_P2 } from './data/jhs-curriculum-set-101';
import { SET_BECE_2008_SCIENCE_P1 } from './data/jhs-curriculum-set-102';
import { SET_BECE_2008_SCIENCE_P2 } from './data/jhs-curriculum-set-103';
import { SET_BECE_2007_SCIENCE_P1 } from './data/jhs-curriculum-set-104';
import { SET_BECE_2007_SCIENCE_P2 } from './data/jhs-curriculum-set-105';
import { SET_BECE_2006_SCIENCE_P1 } from './data/jhs-curriculum-set-106';
import { SET_BECE_2006_SCIENCE_P2 } from './data/jhs-curriculum-set-107';
import { SET_BECE_2005_SCIENCE_P1 } from './data/jhs-curriculum-set-108';
import { SET_BECE_2005_SCIENCE_P2 } from './data/jhs-curriculum-set-109';
import { SET_BECE_2004_SCIENCE_P1 } from './data/jhs-curriculum-set-110';
import { SET_BECE_2004_SCIENCE_P2 } from './data/jhs-curriculum-set-111';
import { SET_BECE_2003_SCIENCE_P1 } from './data/jhs-curriculum-set-112';
import { SET_BECE_2003_SCIENCE_P2 } from './data/jhs-curriculum-set-113';
import { SET_BECE_2001_SCIENCE_P1, SET_BECE_2001_SCIENCE_P2 } from './data/jhs-curriculum-set-114';
import { SET_BECE_2000_SCIENCE_P1, SET_BECE_2000_SCIENCE_P2 } from './data/jhs-curriculum-set-116';
import { SET_BECE_2025_SCIENCE_P1 } from './data/jhs-curriculum-set-118';
import { SET_BECE_2025_SCIENCE_P2 } from './data/jhs-curriculum-set-119';
import { SET_BECE_2024_SCIENCE_P1, SET_BECE_2024_SCIENCE_P2 } from './data/jhs-curriculum-set-120';
import { SET_BECE_2023_SCIENCE_P1, SET_BECE_2023_SCIENCE_P2 } from './data/jhs-curriculum-set-121';
import { SET_BECE_2013_SCIENCE_P1, SET_BECE_2013_SCIENCE_P2 } from './data/jhs-curriculum-set-122';
import { SET_BECE_1991_SCIENCE_P1, SET_BECE_1991_SCIENCE_P2 } from './data/jhs-curriculum-set-123';
import { SET_BECE_1992_SCIENCE_P1, SET_BECE_1992_SCIENCE_P2 } from './data/jhs-curriculum-set-124';
import { SET_BECE_2019_SCIENCE_P1 } from './data/jhs-curriculum-set-82';
import { SET_BECE_2019_SCIENCE_P2 } from './data/jhs-curriculum-set-83';
/**
 * Global Shared Curriculum Service
 *
 * Provides utilities, path resolvers, validation, and sample sets for:
 * global_curriculum/{levelId}/subjects/{subjectId}/topics/{topicId}/question_sets/{setId}
 * and
 * tenants/{tenantId}/students/{studentId}/quiz_attempts/{attemptId}
 */

import {
  GlobalCurriculumLevelId,
  VALID_CURRICULUM_LEVEL_IDS,
  CurriculumQuestionSet,
  TenantQuizAttempt
} from './global-curriculum-types';
import {
  SET_JHS_MASTERY_SERIES_58,
  SET_JHS_MASTERY_SERIES_59
} from './data/jhs-curriculum-sets-58-59';
import {
  SET_JHS_MASTERY_SERIES_60
} from './data/jhs-curriculum-set-60';
import {
  SET_JHS_MASTERY_SERIES_61
} from './data/jhs-curriculum-set-61';
import {
  SET_JHS_MASTERY_SERIES_62
} from './data/jhs-curriculum-set-62';
import {
  SET_JHS_MASTERY_SERIES_63
} from './data/jhs-curriculum-set-63';
import {
  SET_JHS_MASTERY_SERIES_64
} from './data/jhs-curriculum-set-64';
import {
  SET_JHS_MASTERY_SERIES_65
} from './data/jhs-curriculum-set-65';
import {
  SET_JHS_MASTERY_SERIES_66
} from './data/jhs-curriculum-set-66';
import {
  SET_JHS_MASTERY_SERIES_67
} from './data/jhs-curriculum-set-67';
import {
  SET_JHS_MASTERY_SERIES_01,
  SET_JHS_MASTERY_SERIES_02,
  SET_JHS_MASTERY_SERIES_03,
  SET_JHS_MASTERY_SERIES_04,
  SET_JHS_MASTERY_SERIES_05,
  SET_JHS_MASTERY_SERIES_06,
  SET_JHS_MASTERY_SERIES_07,
  SET_JHS_MASTERY_SERIES_08,
  SET_JHS_MOCK_2012_MATH
} from './data/jhs-curriculum-sets';

/**
 * Validates whether a given string is a valid GlobalCurriculumLevelId.
 */
export function isValidCurriculumLevelId(
  levelId: string
): levelId is GlobalCurriculumLevelId {
  return (VALID_CURRICULUM_LEVEL_IDS as readonly string[]).includes(levelId);
}

/**
 * Returns the Firestore collection path for question sets within a topic.
 * Structure: global_curriculum/{levelId}/subjects/{subjectId}/topics/{topicId}/question_sets
 */
export function getGlobalQuestionSetsCollectionPath(
  levelId: GlobalCurriculumLevelId,
  subjectId: string,
  topicId: string
): string {
  if (!isValidCurriculumLevelId(levelId)) {
    throw new Error(
      `Invalid levelId: "${levelId}". Must be one of: ${VALID_CURRICULUM_LEVEL_IDS.join(', ')}`
    );
  }
  return `global_curriculum/${levelId}/subjects/${subjectId}/topics/${topicId}/question_sets`;
}

/**
 * Returns the full document path for a specific question set.
 * Structure: global_curriculum/{levelId}/subjects/{subjectId}/topics/{topicId}/question_sets/{setId}
 */
export function getGlobalQuestionSetDocPath(
  levelId: GlobalCurriculumLevelId,
  subjectId: string,
  topicId: string,
  setId: string
): string {
  return `${getGlobalQuestionSetsCollectionPath(levelId, subjectId, topicId)}/${setId}`;
}

/**
 * Returns the Firestore collection path for a student's tenant-scoped quiz attempts.
 * Structure: tenants/{tenantId}/students/{studentId}/quiz_attempts
 */
export function getTenantQuizAttemptsCollectionPath(
  tenantId: string,
  studentId: string
): string {
  if (!tenantId || !studentId) {
    throw new Error('Both tenantId and studentId are required to build tenant quiz attempts path.');
  }
  return `tenants/${tenantId}/students/${studentId}/quiz_attempts`;
}

/**
 * Returns the full document path for a specific tenant-scoped quiz attempt.
 * Structure: tenants/{tenantId}/students/{studentId}/quiz_attempts/{attemptId}
 */
export function getTenantQuizAttemptDocPath(
  tenantId: string,
  studentId: string,
  attemptId: string
): string {
  return `${getTenantQuizAttemptsCollectionPath(tenantId, studentId)}/${attemptId}`;
}

/**
 * Validates that an object conforms to the CurriculumQuestionSet schema.
 */
export function validateCurriculumQuestionSet(
  data: any
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Document is not an object'] };
  }

  if (typeof data.id !== 'string' || !data.id.trim()) errors.push('Missing or invalid "id"');
  if (typeof data.title !== 'string' || !data.title.trim()) errors.push('Missing or invalid "title"');
  if (typeof data.tier !== 'string' || !data.tier.trim()) errors.push('Missing or invalid "tier"');
  if (typeof data.subject !== 'string' || !data.subject.trim()) errors.push('Missing or invalid "subject"');
  if (typeof data.topic !== 'string' || !data.topic.trim()) errors.push('Missing or invalid "topic"');
  if (data.variantType !== 'standard' && data.variantType !== 'past_paper_variant') {
    errors.push('Invalid "variantType": must be "standard" or "past_paper_variant"');
  }
  if (typeof data.totalQuestions !== 'number' || data.totalQuestions < 0) {
    errors.push('Missing or invalid "totalQuestions"');
  }
  if (typeof data.version !== 'number' || data.version < 1) {
    errors.push('Missing or invalid "version"');
  }

  if (!Array.isArray(data.questions)) {
    errors.push('"questions" must be an array');
  } else {
    data.questions.forEach((q: any, index: number) => {
      if (typeof q.id !== 'string') errors.push(`Question #${index}: missing "id"`);
      if (typeof q.prompt !== 'string') errors.push(`Question #${index}: missing "prompt"`);
      if (!Array.isArray(q.options) || q.options.length < 2) {
        errors.push(`Question #${index}: "options" must be an array with at least 2 items`);
      }
      if (typeof q.correctAnswer !== 'string') errors.push(`Question #${index}: missing "correctAnswer"`);
      if (typeof q.hint !== 'string') errors.push(`Question #${index}: missing "hint"`);
      if (typeof q.workedSolution !== 'string') errors.push(`Question #${index}: missing "workedSolution"`);
      if (typeof q.points !== 'number' || q.points < 1) errors.push(`Question #${index}: missing or invalid "points"`);
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Standard seed question sets covering all 4 valid academic levels:
 * - lower_primary
 * - upper_primary
 * - jhs
 * - shs
 */
export const SAMPLE_GLOBAL_QUESTION_SETS: Record<
  GlobalCurriculumLevelId,
  { subjectId: string; topicId: string; questionSet: CurriculumQuestionSet }[]
> = {
  lower_primary: [
    {
      subjectId: 'mathematics',
      topicId: 'visual-addition',
      questionSet: {
        id: 'lp-math-add-01',
        title: 'Visual Addition & Number Bonds (BS 1 - 3)',
        tier: 'Lower Primary (BS 1 - 3)',
        subject: 'Mathematics',
        topic: 'Visual Addition',
        variantType: 'standard',
        totalQuestions: 3,
        version: 1,
        questions: [
          {
            id: 'q1',
            prompt: 'Kojo has 4 green apples. Ama gives him 3 more apples. How many apples does Kojo have altogether?',
            options: ['6', '7', '8', '9'],
            correctAnswer: '7',
            hint: 'Count on 3 steps after 4: 5, 6, 7.',
            workedSolution: '4 + 3 = 7 apples.',
            points: 10
          },
          {
            id: 'q2',
            prompt: 'Which number makes this number sentence true? 5 + ___ = 10',
            options: ['3', '4', '5', '6'],
            correctAnswer: '5',
            hint: 'Think of 10 fingers: if you hold up 5, how many are down?',
            workedSolution: '10 - 5 = 5. So, 5 + 5 = 10.',
            points: 10
          },
          {
            id: 'q3',
            prompt: 'Count the sides: A triangle has how many straight sides?',
            options: ['2', '3', '4', '5'],
            correctAnswer: '3',
            hint: 'Tri- means three.',
            workedSolution: 'A triangle always has 3 sides and 3 corners.',
            points: 10
          }
        ]
      }
    },
    {
      subjectId: 'english',
      topicId: 'phonics-blends',
      questionSet: {
        id: 'lp-eng-phonics-01',
        title: 'Phonics, Vowel Blends & Rhymes',
        tier: 'Lower Primary (BS 1 - 3)',
        subject: 'English',
        topic: 'Phonics & Blends',
        variantType: 'standard',
        totalQuestions: 2,
        version: 1,
        questions: [
          {
            id: 'q1',
            prompt: 'Which word rhymes with "sun"?',
            options: ['Sit', 'Run', 'Pan', 'Hop'],
            correctAnswer: 'Run',
            hint: 'Listen for the ending "-un" sound.',
            workedSolution: '"Sun" and "Run" both end with the "-un" phoneme.',
            points: 10
          },
          {
            id: 'q2',
            prompt: 'Complete the sentence with the correct sight word: "The dog ___ in the yard."',
            options: ['runs', 'running', 'runned', 'raned'],
            correctAnswer: 'runs',
            hint: 'Singular subject "The dog" takes the verb ending with -s.',
            workedSolution: 'For a singular subject (dog), the simple present tense is "runs".',
            points: 10
          }
        ]
      }
    }
  ],
  upper_primary: [
    {
      subjectId: 'mathematics',
      topicId: 'fractions-decimals',
      questionSet: {
        id: 'up-math-frac-01',
        title: 'Fractions, Decimals & Basic Proportions (BS 4 - 6)',
        tier: 'Upper Primary (BS 4 - 6)',
        subject: 'Mathematics',
        topic: 'Fractions & Decimals',
        variantType: 'standard',
        totalQuestions: 3,
        version: 1,
        questions: [
          {
            id: 'q1',
            prompt: 'What is 3/4 converted into a decimal?',
            options: ['0.25', '0.50', '0.75', '0.85'],
            correctAnswer: '0.75',
            hint: 'Divide 3 by 4, or think of 3 quarters of 1 dollar.',
            workedSolution: '3 ÷ 4 = 0.75 (or 75/100).',
            points: 15
          },
          {
            id: 'q2',
            prompt: 'Calculate: 2/5 + 1/10 = ?',
            options: ['3/15', '1/2', '3/10', '4/10'],
            correctAnswer: '1/2',
            hint: 'Convert 2/5 to tenths: 2/5 = 4/10.',
            workedSolution: '4/10 + 1/10 = 5/10 = 1/2.',
            points: 15
          },
          {
            id: 'q3',
            prompt: 'A rectangle has a length of 8 cm and a width of 5 cm. What is its perimeter?',
            options: ['40 cm', '26 cm', '13 cm', '30 cm'],
            correctAnswer: '26 cm',
            hint: 'Perimeter = 2 × (length + width).',
            workedSolution: 'P = 2 × (8 + 5) = 2 × 13 = 26 cm.',
            points: 15
          }
        ]
      }
    },
    {
      subjectId: 'science',
      topicId: 'states-of-matter',
      questionSet: {
        id: 'up-sci-matter-01',
        title: 'States of Matter & Physical Changes',
        tier: 'Upper Primary (BS 4 - 6)',
        subject: 'Science',
        topic: 'States of Matter',
        variantType: 'standard',
        totalQuestions: 2,
        version: 1,
        questions: [
          {
            id: 'q1',
            prompt: 'What process occurs when liquid water changes into water vapor when heated?',
            options: ['Condensation', 'Evaporation', 'Sublimation', 'Freezing'],
            correctAnswer: 'Evaporation',
            hint: 'Think of water rising from a boiling kettle.',
            workedSolution: 'Evaporation is the transition of liquid water into a gas state.',
            points: 15
          },
          {
            id: 'q2',
            prompt: 'Which state of matter has a definite volume but takes the shape of its container?',
            options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
            correctAnswer: 'Liquid',
            hint: 'Water poured from a cup into a bowl changes shape without changing volume.',
            workedSolution: 'Liquids possess a fixed volume with fluid shape conformity.',
            points: 15
          }
        ]
      }
    }
  ],
  jhs: [
    {
      subjectId: 'science',
      topicId: 'nacca_preparatory_blueprint',
      questionSet: SET_JHS_SCIENCE_SAMPLE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'nacca_preparatory_blueprint',
      questionSet: SET_JHS_SCIENCE_SAMPLE_P1
    },
    {
      subjectId: 'science',
      topicId: 'nacca_preparatory_blueprint',
      questionSet: SET_JHS_SCIENCE_SAMPLE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'nacca_preparatory_blueprint',
      questionSet: SET_JHS_SCIENCE_SAMPLE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2026_variant',
      questionSet: SET_BECE_2026_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2026_variant',
      questionSet: SET_BECE_2026_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2026_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2026_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2026_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2026_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'nacca_preparatory_blueprint',
      questionSet: SET_BECE_2026_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'nacca_preparatory_blueprint',
      questionSet: SET_BECE_2026_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2026_variant',
      questionSet: SET_BECE_2026_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2026_variant',
      questionSet: SET_BECE_2026_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2026_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2026_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2026_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2026_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'nacca_preparatory_blueprint',
      questionSet: SET_BECE_2026_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'nacca_preparatory_blueprint',
      questionSet: SET_BECE_2026_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2014_variant',
      questionSet: SET_BECE_2014_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2014_variant',
      questionSet: SET_BECE_2014_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2014_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2014_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2014_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2014_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2014_variant',
      questionSet: SET_BECE_2014_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2014_variant',
      questionSet: SET_BECE_2014_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2014_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2014_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2014_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2014_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2015_variant',
      questionSet: SET_BECE_2015_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2015_variant',
      questionSet: SET_BECE_2015_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2015_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2015_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2015_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2015_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2015_variant',
      questionSet: SET_BECE_2015_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2015_variant',
      questionSet: SET_BECE_2015_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2015_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2015_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2015_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2015_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2016_variant',
      questionSet: SET_BECE_2016_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2016_variant',
      questionSet: SET_BECE_2016_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2016_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2016_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2016_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2016_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2016_variant',
      questionSet: SET_BECE_2016_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2016_variant',
      questionSet: SET_BECE_2016_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2016_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2016_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2016_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2016_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2017_variant',
      questionSet: SET_BECE_2017_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2017_variant',
      questionSet: SET_BECE_2017_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2017_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2017_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2017_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2017_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2017_variant',
      questionSet: SET_BECE_2017_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2017_variant',
      questionSet: SET_BECE_2017_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2017_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2017_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2017_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2017_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2019_variant',
      questionSet: SET_BECE_2019_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2019_variant',
      questionSet: SET_BECE_2019_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2019_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2019_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2019_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2019_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2018_variant',
      questionSet: SET_BECE_2018_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2018_variant',
      questionSet: SET_BECE_2018_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2018_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2018_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2018_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2018_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2018_variant',
      questionSet: SET_BECE_2018_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2018_variant',
      questionSet: SET_BECE_2018_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2018_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2018_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2018_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2018_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2021_variant',
      questionSet: SET_BECE_2021_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2021_variant',
      questionSet: SET_BECE_2021_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2021_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2021_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2021_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2021_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2021_variant',
      questionSet: SET_BECE_2021_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2022_variant',
      questionSet: SET_BECE_2022_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2022_variant',
      questionSet: SET_BECE_2022_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2022_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2022_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2022_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2022_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2022_variant',
      questionSet: SET_BECE_2022_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2022_variant',
      questionSet: SET_BECE_2022_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2022_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2022_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2022_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2022_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2013_variant',
      questionSet: SET_BECE_2013_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2013_variant',
      questionSet: SET_BECE_2013_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2013_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2013_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2013_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2013_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2013_variant',
      questionSet: SET_BECE_2013_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2013_variant',
      questionSet: SET_BECE_2013_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2013_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2013_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2013_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2013_SCIENCE_P2
    },
    // 1991 BECE Integrated Science Complete Variant (Set 123)
    {
      subjectId: 'science',
      topicId: 'bece_1991_variant',
      questionSet: SET_BECE_1991_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_1991_variant',
      questionSet: SET_BECE_1991_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_1991_variant',
      questionSet: SET_BECE_1991_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_1991_variant',
      questionSet: SET_BECE_1991_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1991_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1991_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1991_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1991_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_1991_variant_p2',
      questionSet: SET_BECE_1991_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_1991_variant_p2',
      questionSet: SET_BECE_1991_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_1991_variant_p2',
      questionSet: SET_BECE_1991_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_1991_variant_p2',
      questionSet: SET_BECE_1991_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1991_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1991_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1991_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1991_SCIENCE_P2
    },
    // 1992 BECE Integrated Science Complete Variant (Set 124)
    {
      subjectId: 'science',
      topicId: 'bece_1992_variant',
      questionSet: SET_BECE_1992_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_1992_variant',
      questionSet: SET_BECE_1992_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_1992_variant',
      questionSet: SET_BECE_1992_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_1992_variant',
      questionSet: SET_BECE_1992_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1992_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1992_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1992_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1992_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_1992_variant_p2',
      questionSet: SET_BECE_1992_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_1992_variant_p2',
      questionSet: SET_BECE_1992_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_1992_variant_p2',
      questionSet: SET_BECE_1992_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_1992_variant_p2',
      questionSet: SET_BECE_1992_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1992_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1992_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1992_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1992_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2012_variant',
      questionSet: SET_BECE_2012_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2012_variant',
      questionSet: SET_BECE_2012_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2012_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2012_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2012_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2012_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2012_variant_p2',
      questionSet: SET_BECE_2012_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2012_variant_p2',
      questionSet: SET_BECE_2012_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_2012_variant_p2',
      questionSet: SET_BECE_2012_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2012_variant_p2',
      questionSet: SET_BECE_2012_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2012_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2012_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2012_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2012_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2011_variant',
      questionSet: SET_BECE_2011_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2011_variant',
      questionSet: SET_BECE_2011_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_2011_variant',
      questionSet: SET_BECE_2011_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2011_variant',
      questionSet: SET_BECE_2011_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2011_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2011_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2011_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2011_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2011_variant_p2',
      questionSet: SET_BECE_2011_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2011_variant_p2',
      questionSet: SET_BECE_2011_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_2011_variant_p2',
      questionSet: SET_BECE_2011_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2011_variant_p2',
      questionSet: SET_BECE_2011_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2011_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2011_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2011_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2011_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2010_variant',
      questionSet: SET_BECE_2010_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2010_variant',
      questionSet: SET_BECE_2010_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_2010_variant',
      questionSet: SET_BECE_2010_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2010_variant',
      questionSet: SET_BECE_2010_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2010_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2010_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2010_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2010_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2010_variant_p2',
      questionSet: SET_BECE_2010_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2010_variant_p2',
      questionSet: SET_BECE_2010_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_2010_variant_p2',
      questionSet: SET_BECE_2010_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2010_variant_p2',
      questionSet: SET_BECE_2010_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2010_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2010_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2010_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2010_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_1990_variant',
      questionSet: SET_BECE_1990_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_1990_variant',
      questionSet: SET_BECE_1990_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_1990_variant',
      questionSet: SET_BECE_1990_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_1990_variant',
      questionSet: SET_BECE_1990_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1990_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1990_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1990_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1990_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_1990_variant_p2',
      questionSet: SET_BECE_1990_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_1990_variant_p2',
      questionSet: SET_BECE_1990_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_1990_variant_p2',
      questionSet: SET_BECE_1990_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_1990_variant_p2',
      questionSet: SET_BECE_1990_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1990_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1990_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1990_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1990_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2009_variant',
      questionSet: SET_BECE_2009_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2009_variant',
      questionSet: SET_BECE_2009_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_2009_variant',
      questionSet: SET_BECE_2009_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2009_variant',
      questionSet: SET_BECE_2009_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2009_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2009_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2009_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2009_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2009_variant_p2',
      questionSet: SET_BECE_2009_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2009_variant_p2',
      questionSet: SET_BECE_2009_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_2009_variant_p2',
      questionSet: SET_BECE_2009_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2009_variant_p2',
      questionSet: SET_BECE_2009_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2009_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2009_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2009_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2009_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2008_variant',
      questionSet: SET_BECE_2008_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2008_variant',
      questionSet: SET_BECE_2008_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_2008_variant',
      questionSet: SET_BECE_2008_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2008_variant',
      questionSet: SET_BECE_2008_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2008_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2008_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2008_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2008_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2008_variant_p2',
      questionSet: SET_BECE_2008_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2008_variant_p2',
      questionSet: SET_BECE_2008_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_2008_variant_p2',
      questionSet: SET_BECE_2008_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2008_variant_p2',
      questionSet: SET_BECE_2008_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2008_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2008_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2008_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2008_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2007_variant',
      questionSet: SET_BECE_2007_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2007_variant',
      questionSet: SET_BECE_2007_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_2007_variant',
      questionSet: SET_BECE_2007_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2007_variant',
      questionSet: SET_BECE_2007_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2007_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2007_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2007_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2007_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2007_variant_p2',
      questionSet: SET_BECE_2007_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2007_variant_p2',
      questionSet: SET_BECE_2007_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_2007_variant_p2',
      questionSet: SET_BECE_2007_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2007_variant_p2',
      questionSet: SET_BECE_2007_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2007_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2007_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2007_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2007_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2006_variant',
      questionSet: SET_BECE_2006_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2006_variant',
      questionSet: SET_BECE_2006_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_2006_variant',
      questionSet: SET_BECE_2006_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2006_variant',
      questionSet: SET_BECE_2006_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2006_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2006_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2006_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2006_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2006_variant_p2',
      questionSet: SET_BECE_2006_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2006_variant_p2',
      questionSet: SET_BECE_2006_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_2006_variant_p2',
      questionSet: SET_BECE_2006_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2006_variant_p2',
      questionSet: SET_BECE_2006_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2006_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2006_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2006_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2006_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2005_variant',
      questionSet: SET_BECE_2005_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2005_variant',
      questionSet: SET_BECE_2005_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_2005_variant',
      questionSet: SET_BECE_2005_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2005_variant',
      questionSet: SET_BECE_2005_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2005_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2005_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2005_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2005_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2005_variant_p2',
      questionSet: SET_BECE_2005_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2005_variant_p2',
      questionSet: SET_BECE_2005_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_2005_variant_p2',
      questionSet: SET_BECE_2005_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2005_variant_p2',
      questionSet: SET_BECE_2005_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2005_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2005_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2005_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2005_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2004_variant',
      questionSet: SET_BECE_2004_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2004_variant',
      questionSet: SET_BECE_2004_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_2004_variant',
      questionSet: SET_BECE_2004_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2004_variant',
      questionSet: SET_BECE_2004_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2004_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2004_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2004_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2004_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2004_variant_p2',
      questionSet: SET_BECE_2004_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2004_variant_p2',
      questionSet: SET_BECE_2004_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_2004_variant_p2',
      questionSet: SET_BECE_2004_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2004_variant_p2',
      questionSet: SET_BECE_2004_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2004_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2004_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2004_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2004_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2003_variant',
      questionSet: SET_BECE_2003_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2003_variant',
      questionSet: SET_BECE_2003_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_2003_variant',
      questionSet: SET_BECE_2003_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2003_variant',
      questionSet: SET_BECE_2003_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2003_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2003_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2003_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2003_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2003_variant_p2',
      questionSet: SET_BECE_2003_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2003_variant_p2',
      questionSet: SET_BECE_2003_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_2003_variant_p2',
      questionSet: SET_BECE_2003_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2003_variant_p2',
      questionSet: SET_BECE_2003_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2003_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2003_SCIENCE_P2
    },
    // 2001 BECE Integrated Science Paper 1 & 2 (Sets 114 & 115)
    {
      subjectId: 'science',
      topicId: 'bece_2001_variant',
      questionSet: SET_BECE_2001_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2001_variant',
      questionSet: SET_BECE_2001_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_2001_variant',
      questionSet: SET_BECE_2001_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2001_variant',
      questionSet: SET_BECE_2001_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2001_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2001_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2001_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2001_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2001_variant_p2',
      questionSet: SET_BECE_2001_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2001_variant_p2',
      questionSet: SET_BECE_2001_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_2001_variant_p2',
      questionSet: SET_BECE_2001_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2001_variant_p2',
      questionSet: SET_BECE_2001_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2001_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2001_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2001_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2001_SCIENCE_P2
    },

    // 2000 BECE Integrated Science Paper 1 & 2 (Sets 116 & 117)
    {
      subjectId: 'science',
      topicId: 'bece_2000_variant',
      questionSet: SET_BECE_2000_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2000_variant',
      questionSet: SET_BECE_2000_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_2000_variant',
      questionSet: SET_BECE_2000_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2000_variant',
      questionSet: SET_BECE_2000_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2000_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2000_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2000_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2000_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2000_variant_p2',
      questionSet: SET_BECE_2000_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2000_variant_p2',
      questionSet: SET_BECE_2000_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_2000_variant_p2',
      questionSet: SET_BECE_2000_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2000_variant_p2',
      questionSet: SET_BECE_2000_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2000_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2000_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2000_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2000_SCIENCE_P2
    },
    // Set 118: 2025 BECE Integrated Science Complete Variant
    {
      subjectId: 'science',
      topicId: 'bece_2025_variant',
      questionSet: SET_BECE_2025_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2025_variant',
      questionSet: SET_BECE_2025_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_2025_variant',
      questionSet: SET_BECE_2025_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2025_variant',
      questionSet: SET_BECE_2025_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2025_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2025_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2025_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2025_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2025_variant_p2',
      questionSet: SET_BECE_2025_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2025_variant_p2',
      questionSet: SET_BECE_2025_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_2025_variant_p2',
      questionSet: SET_BECE_2025_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2025_variant_p2',
      questionSet: SET_BECE_2025_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2025_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2025_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2025_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2025_SCIENCE_P2
    },
    // Set 120: 2024 BECE Integrated Science Complete Variant
    {
      subjectId: 'science',
      topicId: 'bece_2024_variant',
      questionSet: SET_BECE_2024_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2024_variant',
      questionSet: SET_BECE_2024_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_2024_variant',
      questionSet: SET_BECE_2024_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2024_variant',
      questionSet: SET_BECE_2024_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2024_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2024_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2024_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2024_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2024_variant_p2',
      questionSet: SET_BECE_2024_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2024_variant_p2',
      questionSet: SET_BECE_2024_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_2024_variant_p2',
      questionSet: SET_BECE_2024_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2024_variant_p2',
      questionSet: SET_BECE_2024_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2024_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2024_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2024_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2024_SCIENCE_P2
    },
    // Set 121: 2023 BECE Integrated Science Complete Variant
    {
      subjectId: 'science',
      topicId: 'bece_2023_variant',
      questionSet: SET_BECE_2023_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2023_variant',
      questionSet: SET_BECE_2023_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_2023_variant',
      questionSet: SET_BECE_2023_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2023_variant',
      questionSet: SET_BECE_2023_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2023_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2023_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2023_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2023_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2023_variant_p2',
      questionSet: SET_BECE_2023_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2023_variant_p2',
      questionSet: SET_BECE_2023_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_2023_variant_p2',
      questionSet: SET_BECE_2023_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2023_variant_p2',
      questionSet: SET_BECE_2023_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2023_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2023_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2023_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2023_SCIENCE_P2
    },
    // Set 122: 2013 BECE Integrated Science Complete Variant
    {
      subjectId: 'science',
      topicId: 'bece_2013_variant',
      questionSet: SET_BECE_2013_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2013_variant',
      questionSet: SET_BECE_2013_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_2013_variant',
      questionSet: SET_BECE_2013_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2013_variant',
      questionSet: SET_BECE_2013_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2013_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2013_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2013_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2013_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_2013_variant_p2',
      questionSet: SET_BECE_2013_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2013_variant_p2',
      questionSet: SET_BECE_2013_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_2013_variant_p2',
      questionSet: SET_BECE_2013_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_2013_variant_p2',
      questionSet: SET_BECE_2013_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2013_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2013_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2013_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2013_SCIENCE_P2
    },
    // 1991 BECE Integrated Science Complete Variant (Set 123)
    {
      subjectId: 'science',
      topicId: 'bece_1991_variant',
      questionSet: SET_BECE_1991_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_1991_variant',
      questionSet: SET_BECE_1991_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_1991_variant',
      questionSet: SET_BECE_1991_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_1991_variant',
      questionSet: SET_BECE_1991_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1991_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1991_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1991_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1991_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_1991_variant_p2',
      questionSet: SET_BECE_1991_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_1991_variant_p2',
      questionSet: SET_BECE_1991_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_1991_variant_p2',
      questionSet: SET_BECE_1991_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_1991_variant_p2',
      questionSet: SET_BECE_1991_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1991_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1991_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1991_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1991_SCIENCE_P2
    },
    // 1992 BECE Integrated Science Complete Variant (Set 124)
    {
      subjectId: 'science',
      topicId: 'bece_1992_variant',
      questionSet: SET_BECE_1992_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_1992_variant',
      questionSet: SET_BECE_1992_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'paper_1992_variant',
      questionSet: SET_BECE_1992_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_1992_variant',
      questionSet: SET_BECE_1992_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1992_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1992_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1992_SCIENCE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1992_SCIENCE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_1992_variant_p2',
      questionSet: SET_BECE_1992_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_1992_variant_p2',
      questionSet: SET_BECE_1992_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'paper_1992_variant_p2',
      questionSet: SET_BECE_1992_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'paper_1992_variant_p2',
      questionSet: SET_BECE_1992_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1992_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_1992_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1992_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_1992_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2003_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2003_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2021_variant',
      questionSet: SET_BECE_2021_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2021_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2021_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2021_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2021_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_2019_variant',
      questionSet: SET_BECE_2019_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_2019_variant',
      questionSet: SET_BECE_2019_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2019_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_BECE_2019_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2019_SCIENCE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'past_papers',
      questionSet: SET_BECE_2019_SCIENCE_P2
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_SCIENCE_SAMPLE_P1
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_SCIENCE_SAMPLE_P1
    },
    {
      subjectId: 'science',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_SCIENCE_SAMPLE_P2
    },
    {
      subjectId: 'integrated_science',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_SCIENCE_SAMPLE_P2
    },

    {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_01
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_01
    },
    {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_02
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_02
    },
    {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_03
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_03
    },
    {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_04
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_04
    },
    {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_05
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_05
    },
    {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_06
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_06
    },
    {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_07
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_07
    },
    {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_08
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_08
    },
    {
      subjectId: 'math',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MOCK_2012_MATH
    },
    {
      subjectId: 'mathematics',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MOCK_2012_MATH
    },
    {
      subjectId: 'mathematics',
      topicId: 'linear-equations',
      questionSet: {
        id: 'jhs-math-linear-01',
        title: 'BECE Mastery: Linear Equations & Inequalities',
        tier: 'Junior Secondary (JHS)',
        subject: 'Mathematics',
        topic: 'Linear Equations',
        variantType: 'past_paper_variant',
        totalQuestions: 3,
        version: 1,
        questions: [
          {
            id: 'q1',
            prompt: 'Solve for x: 3(x - 2) + 4 = 19',
            options: ['x = 5', 'x = 6', 'x = 7', 'x = 8'],
            correctAnswer: 'x = 7',
            hint: 'Expand the bracket first: 3x - 6 + 4 = 19.',
            workedSolution: '3x - 2 = 19 => 3x = 21 => x = 7.',
            points: 20
          },
          {
            id: 'q2',
            prompt: 'Find the truth set for: 2x - 5 < 7, where x is an integer.',
            options: ['{x : x < 6}', '{x : x > 6}', '{x : x ≤ 6}', '{x : x < 1}'],
            correctAnswer: '{x : x < 6}',
            hint: 'Add 5 to both sides: 2x < 12.',
            workedSolution: '2x < 12 => x < 6. Truth set: {x : x < 6}.',
            points: 20
          },
          {
            id: 'q3',
            prompt: 'In a right-angled triangle, the legs are 6 cm and 8 cm. What is the length of the hypotenuse?',
            options: ['9 cm', '10 cm', '12 cm', '14 cm'],
            correctAnswer: '10 cm',
            hint: 'Use Pythagoras theorem: a² + b² = c².',
            workedSolution: 'c² = 6² + 8² = 36 + 64 = 100 => c = 10 cm.',
            points: 20
          }
        ]
      }
    },
      {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_58
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_58
    },
    {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_59
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_59
    },
    {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_60
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_60
    },
    {
      subjectId: 'math',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MASTERY_SERIES_60
    },
    {
      subjectId: 'mathematics',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MASTERY_SERIES_60
    },
    {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_61
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_61
    },
    {
      subjectId: 'math',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MASTERY_SERIES_61
    },
    {
      subjectId: 'mathematics',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MASTERY_SERIES_61
    },
    {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_62
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_62
    },
    {
      subjectId: 'math',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MASTERY_SERIES_62
    },
    {
      subjectId: 'mathematics',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MASTERY_SERIES_62
    },
    {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_63
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_63
    },
    {
      subjectId: 'math',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MASTERY_SERIES_63
    },
    {
      subjectId: 'mathematics',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MASTERY_SERIES_63
    },
    {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_64
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_64
    },
    {
      subjectId: 'math',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MASTERY_SERIES_64
    },
    {
      subjectId: 'mathematics',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MASTERY_SERIES_64
    },
    {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_65
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_65
    },
    {
      subjectId: 'math',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MASTERY_SERIES_65
    },
    {
      subjectId: 'mathematics',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MASTERY_SERIES_65
    },
    {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_66
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_66
    },
    {
      subjectId: 'math',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MASTERY_SERIES_66
    },
    {
      subjectId: 'mathematics',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MASTERY_SERIES_66
    },
    {
      subjectId: 'math',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_67
    },
    {
      subjectId: 'mathematics',
      topicId: 'core_curriculum_mastery',
      questionSet: SET_JHS_MASTERY_SERIES_67
    },
    {
      subjectId: 'math',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MASTERY_SERIES_67
    },
    {
      subjectId: 'mathematics',
      topicId: 'bece_past_papers',
      questionSet: SET_JHS_MASTERY_SERIES_67
    },
  ],
  shs: [
    {
      subjectId: 'mathematics',
      topicId: 'calculus-differentiation',
      questionSet: {
        id: 'shs-math-calc-01',
        title: 'WASSCE Elective Math: Differential Calculus & Optimization',
        tier: 'Senior Secondary (SHS)',
        subject: 'Mathematics',
        topic: 'Differential Calculus',
        variantType: 'past_paper_variant',
        totalQuestions: 3,
        version: 1,
        questions: [
          {
            id: 'q1',
            prompt: 'Differentiate y = 3x⁴ - 5x² + 7x - 9 with respect to x.',
            options: [
              '12x³ - 10x + 7',
              '12x³ - 5x + 7',
              '7x³ - 10x',
              '12x⁴ - 10x² + 7'
            ],
            correctAnswer: '12x³ - 10x + 7',
            hint: 'Apply the power rule d/dx(xⁿ) = n·xⁿ⁻¹.',
            workedSolution: 'dy/dx = 4(3x³) - 2(5x) + 7 = 12x³ - 10x + 7.',
            points: 25
          },
          {
            id: 'q2',
            prompt: 'Find the gradient of the curve y = 2x² - 3x + 1 at the point where x = 2.',
            options: ['3', '5', '7', '8'],
            correctAnswer: '5',
            hint: 'Find dy/dx and substitute x = 2.',
            workedSolution: 'dy/dx = 4x - 3. At x = 2: 4(2) - 3 = 8 - 3 = 5.',
            points: 25
          },
          {
            id: 'q3',
            prompt: 'Find the stationary points of f(x) = x³ - 3x.',
            options: [
              'x = 1 and x = -1',
              'x = 0 and x = 3',
              'x = 3 and x = -3',
              'x = √3 only'
            ],
            correctAnswer: 'x = 1 and x = -1',
            hint: 'Stationary points occur where f\'(x) = 0.',
            workedSolution: 'f\'(x) = 3x² - 3 = 0 => 3(x² - 1) = 0 => x = ±1.',
            points: 25
          }
        ]
      }
    }
  ]
};
