export type AssignmentPaperType = 1 | 2;
export type SubmissionStatus = 'not_started' | 'in_progress' | 'completed';

export interface SchoolAssignment {
  id: string;
  schoolId: string;
  title: string;              // e.g., "Weekend Task: BECE 2020 Mathematics Paper 2 (Set 61)"
  examId: string;             // e.g., "paper_2020_variant"
  paperType: AssignmentPaperType; // 1 for Objective (CBT), 2 for Theory (Essay)
  targetClass: string;        // e.g., "JHS 2", "JHS 2 - Gold", or "ALL_JHS"
  dueDate: any;               // Firestore Timestamp or ISO string
  isTimed: boolean;
  timeLimitMinutes?: number;  // e.g., 60
  maxAttempts: number;        // e.g., 1
  assignedByUid: string;
  assignedByName: string;     // e.g., "Director James"
  totalAssigned: number;      // count of targeted students
  completedCount: number;     // incremented via transaction on student submit
  createdAt: any;
  instructions?: string;
  subject?: string;
}

export interface StudentAssignmentSubmission {
  id?: string;
  studentUid: string;
  studentName: string;
  studentClass: string;
  status: SubmissionStatus;
  startedAt: any | null;
  submittedAt: any | null;
  score: number | null;
  maxScore: number | null;
  percentage: number | null;
  answers?: any;
  aiGradedResults?: Array<{
    questionNumber: string;
    subId: string;
    partLabel?: string;
    prompt?: string;
    studentText?: string;
    awardedMarks: number;
    maxMarks: number;
    feedback?: string;
    breakdown?: Array<{
      step: string;
      awarded: number;
      max: number;
      feedback?: string;
    }>;
  }>;
  nudgedAt?: any;
}

export interface AssignmentExamOption {
  id: string;
  title: string;
  year?: number;
  setNumber?: number;
  paperType: 1 | 2;
  subject: string;
  badge: string;
}
