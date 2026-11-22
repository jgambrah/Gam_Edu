export type LessonStage = 'listen' | 'notes' | 'questions';

export interface SectionSummary {
  sectionId: string;
  title: string;
  points: string[];
}

export interface NoteKeyTerm {
  term: string;
  meaning: string;
}

export interface NoteExampleTable {
  caption?: string;
  columns: string[];
  rows: string[][];
}

export interface ComprehensiveNoteBlock {
  id: string;
  sectionId: string;
  heading: string;
  paragraphs: string[];
  keyTerms?: NoteKeyTerm[];
  enrichment?: boolean;
  exampleTable?: NoteExampleTable;
}

export type WorkedQuestionType = 'recall' | 'understand' | 'apply' | 'why' | 'trap' | string;

export interface WorkedQuestion {
  id: string;
  type: WorkedQuestionType;
  prompt: string;
  tryFirstHint?: string;
  answer: string;
  teacherExplanation: string[];
  memoryAid?: string;
  commonConfusion?: string;
  misconceptionRef?: string;
  enrichment?: boolean;
  /** Internal author review flag — NEVER rendered to pupils. */
  verify?: string;
}

export interface QuestionSeriesGroup {
  exemplarId: string;
  exemplarText: string;
  slideIds?: string[];
  questions: WorkedQuestion[];
}

export interface LessonNotesPackage {
  lessonId: string;
  schemaVersion: string;
  lessonSchemaVersion?: string;
  language?: string;
  title: string;
  indicatorIds?: string[];
  sectionSummaries: SectionSummary[];
  comprehensiveNotes: ComprehensiveNoteBlock[];
  questionSeries: QuestionSeriesGroup[];
  /** Reserved for future strand-level summaries; null/undefined is treated as absent. */
  strandSummary?: Record<string, unknown> | null;
  /** Internal author review flags — NEVER rendered to pupils. */
  verifyFlags?: Array<{ claim: string; reason: string }>;
}
