/**
 * GAM EDU — JHS Integrated Science (Discovery) Curriculum Data Models
 * All rights reserved to GAM IT Solutions (GAM EDU).
 * 
 * Firestore paths:
 * Topical Units: global_curriculum/jhs/subjects/science/topical_units/{unitId}
 * Past Papers:   global_curriculum/jhs/subjects/science/past_papers/{paperId}
 */

export interface ScienceTopicalUnit {
  id: string; // e.g. "bs7_diversity_matter_cells"
  gradeLevel: "BS7" | "BS8" | "BS9";
  strandNumber: 1 | 2 | 3 | 4 | 5;
  strandTitle: string; // e.g. "Diversity of Matter"
  subStrandTitle: string; // e.g. "Living Cells"
  order: number;
  notes: {
    summaryMarkdown: string;
    keyTerms: Array<{ term: string; definition: string }>;
    diagramSvg?: string; // Inline responsive vector SVG
  };
  sampleWorkedProblems: Array<{
    id: string;
    questionPrompt: string;
    stepByStepSolution: string;
    examinerTip: string;
  }>;
  drillQuestions: Array<{
    id: string;
    difficulty: "low" | "medium" | "high";
    type: "objective" | "structured";
    prompt: string;
    diagramSvg?: string;
    options?: string[]; // for objective items
    correctAnswer: string;
    hint: string;
    workedSolution: string;
    points: number;
  }>;
  metadata?: {
    copyright?: string;
    updatedAt?: any;
    [key: string]: any;
  };
}

export interface SciencePastPaperVariant {
  id: string; // e.g. "paper_2020_variant"
  year: number;
  setNumber: number; // e.g. Set 70 (P1) and Set 71 (P2)
  isVariant: boolean;
  subject: "Integrated Science";
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)";
  
  paper1: {
    title: "Paper 1: Objective Test (Variant)";
    durationMinutes: 45;
    totalQuestions: 40;
    questions: Array<{
      number: number;
      prompt: string;
      diagramSvg?: string;
      options: string[];
      correctAnswer: string;
      hint: string;
      workedSolution: string;
      strand: string;
      difficulty: "low" | "medium" | "high";
      points: 1;
    }>;
  };

  paper2: {
    title: "Paper 2: Practical & Theory Essay (Variant)";
    durationMinutes: 75;
    instructions: "Section A is compulsory. Answer any three questions from Section B.";
    totalQuestions: 5;
    questions: Array<{
      questionNumber: string; // "1" (Practical) or "2", "3", "4", "5" (Theory)
      isPracticalSectionA: boolean;
      subQuestions: Array<{
        subId: string; // "(a)", "(b)(i)", "(b)(ii)"
        prompt: string;
        diagramSvg?: string;
        workedSolution: string;
        rubricSteps: Array<{ criterion: string; marks: number }>;
        maxMarks: number;
      }>;
    }>;
  };

  metadata: {
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.";
    isomorphic: true;
    optionsBalanced?: boolean;
    updatedAt: any;
  };
}
