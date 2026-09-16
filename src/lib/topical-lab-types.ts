/**
 * Topical Practice Labs (Unit & Strand Drills)
 * Multi-Tiered Learning Schema: JHS 1, JHS 2, JHS 3
 * Graded Practice Pools: Low, Medium, Hard
 *
 * Firestore Document Path:
 * global_curriculum/{levelId}/subjects/{subjectId}/topics/{topicDocId}
 * Example: global_curriculum/jhs/subjects/math/topics/topic_ratio_and_proportion
 */

export type TopicalLabLevelKey = 'jhs1' | 'jhs2' | 'jhs3';

export type TopicalPracticeDifficulty = 'low' | 'medium' | 'hard';

export interface WorkedExample {
  id: string;
  title: string;
  problem: string;
  steps: string[];
  finalAnswer: string;
  diagramSvg?: string;
}

export interface TopicalPracticeQuestion {
  id: string;
  difficulty: TopicalPracticeDifficulty;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
  diagramSvg?: string;
}

export interface TopicalPracticePool {
  low: TopicalPracticeQuestion[];
  medium: TopicalPracticeQuestion[];
  hard: TopicalPracticeQuestion[];
}

export interface TopicalLabLevel {
  levelTitle: string;
  summary: string;
  notes: string;
  workedExamples: WorkedExample[];
  practicePool: TopicalPracticePool;
}

export interface LinkedExamQuestion {
  setId: string;
  year: number;
  paper: number;
  questionNumber: number;
  promptSnippet: string;
}

export interface TopicalLabDocument {
  id: string;
  topicId: string;
  title: string;
  subject: string;
  tier: string;
  badge: string;
  description: string;
  totalPracticeQuestions: number;
  version: number;
  levels: Record<TopicalLabLevelKey, TopicalLabLevel>;
  linkedExamQuestions?: LinkedExamQuestion[];
  seededAt?: string;
  updatedAt: string;
}

export interface TopicManifestItem {
  id: string;
  title: string;
  strand: string;
  levelsAvailable: string[];
  status?: 'ready' | 'pending_content' | string;
  questionCount?: number;
  hasNotes: boolean;
  description?: string;
}

export interface SubjectTopicsManifest {
  subject: string;
  tier: string;
  totalTopics: number;
  topics: TopicManifestItem[];
  updatedAt?: string;
}
