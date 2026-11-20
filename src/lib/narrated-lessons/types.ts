export interface LessonMeta {
  title?: string;
  class: string;
  subject: string;
  term: number;
  contentStandard: string;
  indicators: string[];
  narrationWordCount: number;
  estimatedNarrationMinutes: number;
  estimatedTotalMinutes: number;
}

export interface PronunciationEntry {
  term: string;
  respelling: string;
  languageOrContext: string;
  slides: string[];
}

export interface VocabularyEntry {
  term: string;
  studentFriendlyMeaning: string;
  pronunciationNote: string;
  firstUsedInSlide: string;
}

export interface MisconceptionEntry {
  misconception: string;
  slideId: string;
  howAddressed: string;
}

export interface SlideVisual {
  type: 'svg' | 'illustration';
  description: string;
  labels: string[];
  altText: string;
  svgCode: string | null;
  imagePrompt: string | null;
  imageUrl?: string;
}

export type AudioSource = 'tts' | 'human';

export interface SlideNarration {
  ttsStyleInstruction: string;
  script: string;
  ttsText?: string;
  audioSource?: AudioSource;
  audioUrl?: string;
  estSeconds: number;
  pauseCues: string[];
}

export interface SeedFaq {
  q: string;
  a: string;
}

export interface AskTeacherContext {
  summary: string;
  seedFaqs: SeedFaq[];
  outOfScopeRule: string;
}

export type CueStyle = 'ring' | 'arrow' | 'spotlight' | 'chip';

export type CueTarget =
  | { type: 'region'; x: number; y: number; w: number; h: number }
  | { type: 'chip'; index: number };

export interface PointerCue {
  id: string;
  sentenceIndex: number;
  startSec: number;
  endSec: number;
  style: CueStyle;
  target: CueTarget;
  label?: string;
  needsHumanCheck?: boolean;
}

export type TimingMethod = 'forced-align' | 'silence-detect' | 'estimated';

export interface LessonSection {
  id: string;
  order: number;
  title: string;
  goal: string;
  indicatorIds: string[];
  slideIds: string[];
  stopPoints?: string[];
  checkpointId?: string | null;
  masteryCheck?: boolean;
  estimatedMinutes?: number;
  resumable?: boolean;
}

export interface LessonSlide {
  id: string;
  order: number;
  sectionId?: string;
  title: string;
  purpose: string;
  onScreenText: string[];
  visual: SlideVisual;
  narration: SlideNarration;
  keyIdeas: string[];
  indicatorIds: string[];
  askTeacherContext: AskTeacherContext;
  teacherNote: string;
  timingMethod?: TimingMethod;
  audioHash?: string;
  cues?: PointerCue[];
}

export interface WrongFeedback {
  optionId?: string;
  hotspotId?: string;
  condition?: string;
  hintText: string;
  misconceptionTargeted: string;
}

export interface McqItem {
  id: string;
  type: 'mcq';
  question?: string;
  prompt?: string;
  options: Array<{ id: string; text: string }>;
  correctOptionId: string;
  explanation: string;
  onCorrect?: { text: string };
  onWrong: WrongFeedback[];
  indicatorId: string;
  cognitiveLevel: string;
}

export interface SequenceItem {
  id: string;
  type: 'sequence';
  prompt?: string;
  question?: string;
  items?: Array<{ id: string; text: string }>;
  steps?: Array<{ id: string; text: string }>;
  correctOrder: string[];
  explanation: string;
  onCorrect?: { text: string };
  onWrong: WrongFeedback[];
  indicatorId: string;
  cognitiveLevel: string;
}

export interface TapDiagramHotspot {
  id: string;
  label: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  w?: number;
  h?: number;
}

export interface TapDiagramItem {
  id: string;
  type: 'tapDiagram';
  diagramSlideId: string;
  playerNote?: string;
  question?: string;
  prompt?: string;
  hotspots: TapDiagramHotspot[];
  correctHotspotId: string;
  explanation: string;
  onCorrect?: { text: string };
  onWrong: WrongFeedback[];
  indicatorId: string;
  cognitiveLevel: string;
}

export type AssessmentItem = McqItem | SequenceItem | TapDiagramItem;

export interface LessonCheckpoint {
  id: string;
  sectionId?: string;
  afterSlide?: string;
  afterSlideId?: string;
  coversSlides?: string[];
  retryRule: string;
  items: AssessmentItem[];
}

export interface MasteryCheck {
  sectionId?: string;
  passMark: number;
  items: AssessmentItem[];
}

export interface LessonSummary {
  recapScript: string;
  recapAudioUrl?: string;
  takeaways: string[];
}

export interface ExtensionActivity {
  title: string;
  materials: string[];
  steps: string[];
  safetyNote: string;
  expectedObservation: string;
}

export interface CoverageMatrixRow {
  indicatorId: string;
  slides: string[];
  checkpointItems: string[];
}

export interface VerifyFlag {
  claim: string;
  slideId: string;
  reason: string;
}

export interface NarratedLesson {
  lessonId: string;
  schemaVersion: string;
  schemaExtensions?: string[];
  meta: LessonMeta;
  learningOutcomes: string[];
  sections?: LessonSection[];
  pronunciationGuide: PronunciationEntry[];
  vocabulary: VocabularyEntry[];
  misconceptionsAddressed: MisconceptionEntry[];
  slides: LessonSlide[];
  checkpoints: LessonCheckpoint[];
  masteryCheck: MasteryCheck;
  summary: LessonSummary;
  extensionActivity: ExtensionActivity;
  coverageMatrix: CoverageMatrixRow[];
  verifyFlags: VerifyFlag[];
}

export const NARRATED_LESSON_CDN_BUCKET = 'gamedu-69888475-f5783.firebasestorage.app';
export const NARRATED_LESSON_CDN_PREFIX = 'story-spark-preview/narrated-lessons';

export function lessonMediaUrl(lessonId: string, relPath: string, versionHash?: string): string {
  const objectPath = `${NARRATED_LESSON_CDN_PREFIX}/${lessonId}/${relPath.replace(/^\/+/, '')}`;
  const vParam = versionHash ? `&v=${encodeURIComponent(versionHash)}` : '';
  return `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(NARRATED_LESSON_CDN_BUCKET)}/o/${encodeURIComponent(objectPath)}?alt=media${vParam}`;
}
