/**
 * Global Shared Curriculum Repository & Multi-Tenant Types
 *
 * Path structure:
 * global_curriculum/{levelId}/subjects/{subjectId}/topics/{topicId}/question_sets/{setId}
 */

export type GlobalCurriculumLevelId = 'lower_primary' | 'upper_primary' | 'jhs' | 'shs';

export const VALID_CURRICULUM_LEVEL_IDS: readonly GlobalCurriculumLevelId[] = [
  'lower_primary',
  'upper_primary',
  'jhs',
  'shs'
] as const;

export const CURRICULUM_LEVEL_METADATA: Record<
  GlobalCurriculumLevelId,
  { label: string; grades: string; description: string }
> = {
  lower_primary: {
    label: 'Lower Primary',
    grades: 'BS 1 - 3',
    description: 'Foundational numeracy, literacy, phonics, and sensory discovery'
  },
  upper_primary: {
    label: 'Upper Primary',
    grades: 'BS 4 - 6',
    description: 'Core concepts in mathematics, reading comprehension, and natural sciences'
  },
  jhs: {
    label: 'Junior Secondary',
    grades: 'JHS 1 - 3',
    description: 'Algebraic foundations, composition writing, and integrated scientific inquiry'
  },
  shs: {
    label: 'Senior Secondary',
    grades: 'SHS 1 - 3',
    description: 'Advanced mathematics, literature mastery, elective science, and WAEC exam prep'
  }
};

export type QuestionSetVariantType = 'standard' | 'past_paper_variant';

export interface CurriculumQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

export interface CurriculumQuestionSet {
  id: string;
  title: string;
  tier: string;
  subject: string;
  topic: string;
  variantType: QuestionSetVariantType;
  totalQuestions: number;
  version: number;
  questions: CurriculumQuestion[];
}

/**
 * Tenant-Specific Quiz Attempt
 * Stored at: /tenants/{tenantId}/students/{studentId}/quiz_attempts/{attemptId}
 */
export interface TenantQuizAttempt {
  id: string;
  tenantId: string;
  studentId: string;
  setId: string;
  levelId: GlobalCurriculumLevelId;
  subjectId: string;
  topicId: string;
  answers: Record<string, string>; // questionId -> selected option
  score: number;
  maxScore: number;
  percentage: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  startedAt: string;
  completedAt?: string;
  timeSpentSeconds?: number;
  clientMetadata?: {
    platform?: string;
    userAgent?: string;
  };
}
