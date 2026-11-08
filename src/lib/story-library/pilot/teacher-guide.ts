/** A short teacher's guide that ships with a premium story. Plain data, reviewed with the story. */
export interface TeacherGuide {
  overview: string;
  /** Minutes for a full lesson using the story plus the activities. */
  lessonMinutes: number;
  learningGoals: string[];
  /** Subject areas this supports. Alignment to specific curriculum strands/codes is NOT claimed: a curriculum reviewer must verify. */
  subjectLinks: Array<{ subject: string; link: string; status: 'to-verify' }>;
  beforeReading: string[];
  whileReading: string[];
  afterReading: string[];
  discussion: string[];
  /** Real-life application and reflection questions. */
  reflection: string[];
  /** Worked numeracy extension with answers, so the teacher can check. */
  mathsExtension: Array<{ task: string; answer: string }>;
  differentiation: { support: string[]; stretch: string[] };
  culturalNotes: string[];
  /** Things the teacher should confirm locally (prices, foods, names). */
  localiseThis: string[];
  /** For science stories: fact-check sheet listing key claims, reliable references and any analogies that need explanation. */
  factCheck?: Array<{
    claim: string;
    explanation: string;
    reference: string;
    analogyNote?: string;
  }>;
}
