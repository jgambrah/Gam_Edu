'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardCheck,
  Copy,
  Crosshair,
  Download,
  Eye,
  FileText,
  FlaskConical,
  HelpCircle,
  Maximize2,
  MessageCircleQuestion,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Send,
  Settings2,
  ShieldAlert,
  Sparkles,
  Volume2,
  VolumeX,
  WifiOff,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type {
  AssessmentItem,
  LessonCheckpoint,
  LessonSlide,
  McqItem,
  NarratedLesson,
  PointerCue,
  SequenceItem,
  TapDiagramItem,
} from '@/lib/narrated-lessons/types';
import { lessonMediaUrl } from '@/lib/narrated-lessons/types';
import type { LessonNotesPackage, LessonStage } from '@/lib/narrated-lessons/notes-types';
import { TeacherPointerOverlay } from './TeacherPointerOverlay';
import { PointerCueEditor } from './PointerCueEditor';
import { LessonNotesAndQuestions } from './LessonNotesAndQuestions';
import { InlineCodePlayground } from './InlineCodePlayground';

type PlayerStep =
  | { kind: 'intro'; id: string; label: string }
  | { kind: 'slide'; id: string; label: string; slide: LessonSlide }
  | { kind: 'checkpoint'; id: string; label: string; checkpoint: LessonCheckpoint }
  | { kind: 'mastery'; id: string; label: string }
  | { kind: 'summary'; id: string; label: string };

interface ItemProgress {
  attempts: number;
  solved: boolean;
  revealed: boolean;
  correctFirstTry?: boolean;
  lastFeedback: string | null;
  lastWasCorrect: boolean | null;
  selectedOptionId?: string;
  selectedHotspotId?: string;
}

interface ChatMessage {
  role: 'student' | 'teacher';
  text: string;
  source?: string;
}

const STORAGE_KEY_PREFIX = 'gamedu_narrated_lesson_progress_v1_';
const PRON_REVIEW_STORAGE_PREFIX = 'gamedu_narrated_lesson_pron_review_v1_';
const POINTER_ENABLED_STORAGE_KEY = 'gamedu_narrated_lesson_pointer_enabled_v1';
const CUES_STORAGE_PREFIX = 'gamedu_narrated_lesson_cues_v1_';

type SlidePronStatus = 'OK' | 'Odd' | 'Wrong' | '';

interface SlidePronEntry {
  status: SlidePronStatus;
  note: string;
}

function getSlidePronunciationTerms(slide: LessonSlide, guide: NarratedLesson['pronunciationGuide']) {
  const script = slide.narration?.script ?? '';
  return guide.filter((entry) => {
    const escaped = entry.term.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(script);
  });
}

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function deterministicShuffleIds(ids: string[]): string[] {
  // Deterministic non-correct starting order for sequence items so every learner gets a fair puzzle
  if (ids.length === 4) return [ids[2], ids[0], ids[3], ids[1]];
  return [...ids].reverse();
}

export function NarratedLessonPlayer({
  lesson,
  notes = null,
  initialStage = 'listen',
  allowReviewerTools = false,
}: {
  lesson: NarratedLesson;
  notes?: LessonNotesPackage | null;
  initialStage?: LessonStage;
  allowReviewerTools?: boolean;
}) {
  const steps = useMemo<PlayerStep[]>(() => {
    const out: PlayerStep[] = [{ kind: 'intro', id: 'intro', label: 'Start' }];
    const cpByAfter = new Map<string, LessonCheckpoint>();
    for (const cp of lesson.checkpoints) {
      const afterKey = cp.afterSlide ?? cp.afterSlideId;
      if (afterKey) cpByAfter.set(afterKey, cp);
    }
    for (const slide of lesson.slides) {
      out.push({
        kind: 'slide',
        id: slide.id,
        label: `${slide.order}`,
        slide,
      });
      const cp = cpByAfter.get(slide.id);
      if (cp) {
        out.push({
          kind: 'checkpoint',
          id: cp.id,
          label: cp.id.replace('cp', 'Check '),
          checkpoint: cp,
        });
      }
    }
    out.push({ kind: 'mastery', id: 'mastery', label: 'Mastery' });
    out.push({ kind: 'summary', id: 'summary', label: 'Wrap-Up' });
    return out;
  }, [lesson]);

  const slideById = useMemo(() => {
    const m = new Map<string, LessonSlide>();
    for (const s of lesson.slides) m.set(s.id, s);
    return m;
  }, [lesson.slides]);

  const [stepIdx, setStepIdx] = useState(0);
  const [activeStage, setActiveStage] = useState<LessonStage>(notes ? initialStage : 'listen');
  const [lowDataMode, setLowDataMode] = useState(false);

  const validSlideIds = useMemo(() => new Set(lesson.slides.map((s) => s.id)), [lesson.slides]);

  useEffect(() => {
    setActiveStage(notes ? initialStage : 'listen');
  }, [notes, initialStage]);

  const handleChangeStage = useCallback(
    (next: LessonStage) => {
      if (!notes && next !== 'listen') return;
      if (next !== 'listen' && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      setActiveStage(next);
      try {
        const url = new URL(window.location.href);
        if (next === 'listen') url.searchParams.delete('stage');
        else url.searchParams.set('stage', next);
        window.history.replaceState({}, '', url.toString());
      } catch {
        // ignore URL update errors
      }
    },
    [notes],
  );

  const handleJumpToSlide = useCallback(
    (slideId: string) => {
      const targetIdx = steps.findIndex((s) => s.kind === 'slide' && s.id === slideId);
      if (targetIdx !== -1) {
        setStepIdx(targetIdx);
        handleChangeStage('listen');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [steps, handleChangeStage],
  );
  const [pointerEnabled, setPointerEnabled] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [canUseReviewerTools, setCanUseReviewerTools] = useState(allowReviewerTools);
  const [reviewerMode, setReviewerMode] = useState(false);
  const [showReviewerPanel, setShowReviewerPanel] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showTeacherNote, setShowTeacherNote] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Pointer cue overrides & editor state
  const [customCuesBySlide, setCustomCuesBySlide] = useState<Record<string, PointerCue[]>>({});
  const [savedHashesBySlide, setSavedHashesBySlide] = useState<Record<string, string>>({});
  const [selectedCueId, setSelectedCueId] = useState<string | null>(null);
  const chipsContainerRef = useRef<HTMLDivElement | null>(null);
  const [chipsInView, setChipsInView] = useState(true);

  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCurrent, setAudioCurrent] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [audioError, setAudioError] = useState(false);

  // Assessment state
  const [itemProgress, setItemProgress] = useState<Record<string, ItemProgress>>({});
  const [sequenceOrders, setSequenceOrders] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    const allItems = [
      ...lesson.checkpoints.flatMap((cp) => cp.items),
      ...lesson.masteryCheck.items,
    ];
    for (const item of allItems) {
      if (item.type === 'sequence') {
        const list = item.steps ?? item.items ?? [];
        init[item.id] = deterministicShuffleIds(list.map((x) => x.id));
      }
    }
    return init;
  });

  // Ask Teacher drawer state
  const [askOpen, setAskOpen] = useState(false);
  const [chatBySlide, setChatBySlide] = useState<Record<string, ChatMessage[]>>({});
  const [askInput, setAskInput] = useState('');
  const [askLoading, setAskLoading] = useState(false);

  // Enlarged visual lightbox state (works for both GES / NaCCA and Cambridge slides)
  const [visualZoomOpen, setVisualZoomOpen] = useState(false);
  const [visualZoomScale, setVisualZoomScale] = useState(1);

  useEffect(() => {
    setVisualZoomOpen(false);
    setVisualZoomScale(1);
  }, [stepIdx]);

  useEffect(() => {
    if (!visualZoomOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setVisualZoomOpen(false);
      } else if (e.key === '+' || e.key === '=') {
        setVisualZoomScale((s) => Math.min(2.5, Number((s + 0.25).toFixed(2))));
      } else if (e.key === '-') {
        setVisualZoomScale((s) => Math.max(1, Number((s - 0.25).toFixed(2))));
      } else if (e.key === '0') {
        setVisualZoomScale(1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visualZoomOpen]);

  // Reviewer-mode per-slide pronunciation audit state (Step 7)
  const [pronAudit, setPronAudit] = useState<Record<string, SlidePronEntry>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PRON_REVIEW_STORAGE_PREFIX + lesson.lessonId);
      if (raw) setPronAudit(JSON.parse(raw) as Record<string, SlidePronEntry>);
    } catch {
      // ignore
    }
  }, [lesson.lessonId]);

  useEffect(() => {
    try {
      localStorage.setItem(PRON_REVIEW_STORAGE_PREFIX + lesson.lessonId, JSON.stringify(pronAudit));
    } catch {
      // ignore
    }
  }, [lesson.lessonId, pronAudit]);

  // Close Guide modal or Ask Teacher drawer on Escape key
  useEffect(() => {
    if (!showReviewerPanel && !askOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showReviewerPanel) setShowReviewerPanel(false);
        if (askOpen) setAskOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showReviewerPanel, askOpen]);

  const updateSlidePronAudit = (slideId: string, term: string, patch: Partial<SlidePronEntry>) => {
    const key = `${slideId}:${term}`;
    setPronAudit((old) => ({
      ...old,
      [key]: { status: old[key]?.status ?? '', note: old[key]?.note ?? '', ...patch },
    }));
  };

  const exportSlidePronAudit = () => {
    const rows = lesson.slides.flatMap((s) =>
      getSlidePronunciationTerms(s, lesson.pronunciationGuide).map((g) => {
        const entry = pronAudit[`${s.id}:${g.term}`];
        return {
          slideId: s.id,
          slideOrder: s.order,
          audioSource: s.narration.audioSource ?? 'tts',
          term: g.term,
          status: entry?.status || 'Unreviewed',
          note: entry?.note || '',
        };
      }),
    );
    const payload = {
      lessonId: lesson.lessonId,
      exportedAt: new Date().toISOString(),
      entries: rows,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lesson.lessonId}-slide-pronunciation-audit.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Restore pointer preference & custom cues per lesson version
  useEffect(() => {
    try {
      const pRaw = localStorage.getItem(POINTER_ENABLED_STORAGE_KEY);
      if (pRaw !== null) setPointerEnabled(pRaw === 'true');
      const cRaw = localStorage.getItem(`${CUES_STORAGE_PREFIX}${lesson.lessonId}_${lesson.schemaVersion}`);
      if (cRaw) {
        const parsed = JSON.parse(cRaw) as {
          cuesBySlide?: Record<string, PointerCue[]>;
          hashesBySlide?: Record<string, string>;
        };
        if (parsed.cuesBySlide) setCustomCuesBySlide(parsed.cuesBySlide);
        if (parsed.hashesBySlide) setSavedHashesBySlide(parsed.hashesBySlide);
      }
    } catch {
      // ignore
    }
  }, [lesson.lessonId, lesson.schemaVersion]);

  useEffect(() => {
    try {
      localStorage.setItem(POINTER_ENABLED_STORAGE_KEY, String(pointerEnabled));
    } catch {
      // ignore
    }
  }, [pointerEnabled]);

  // Observe whether the on-screen chips are visible (for the phone "↓ look below" nudge, no auto-scroll)
  useEffect(() => {
    const el = chipsContainerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]) setChipsInView(entries[0].isIntersecting);
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [stepIdx]);

  // Set browser tab title to the lesson title (improves shared links & bookmarks)
  useEffect(() => {
    const title = lesson.meta.title || lesson.slides[0]?.title || 'Narrated Lesson';
    document.title = `${title} (${lesson.meta.class} ${lesson.meta.subject}) — GAM Edu`;
  }, [lesson.meta.class, lesson.meta.subject, lesson.meta.title, lesson.slides]);

  // Restore progress from localStorage (plus optional ?slide=s03&t=18&review=1 deep-link)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('review') === '1' || allowReviewerTools) {
        setCanUseReviewerTools(true);
      }
      const qSlide = params.get('slide');
      const qTime = params.get('t');
      if (qSlide) {
        const idx = steps.findIndex((s) => s.id === qSlide);
        if (idx >= 0) {
          setStepIdx(idx);
          if (qTime && Number.isFinite(Number(qTime))) {
            setTimeout(() => setAudioCurrent(Number(qTime)), 60);
          }
          return;
        }
      }
      const raw = localStorage.getItem(STORAGE_KEY_PREFIX + lesson.lessonId);
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        stepIdx?: number;
        itemProgress?: Record<string, ItemProgress>;
        lowDataMode?: boolean;
      };
      if (typeof saved.stepIdx === 'number' && saved.stepIdx >= 0 && saved.stepIdx < steps.length) {
        setStepIdx(saved.stepIdx);
      }
      if (saved.itemProgress) setItemProgress(saved.itemProgress);
      if (typeof saved.lowDataMode === 'boolean') setLowDataMode(saved.lowDataMode);
    } catch {
      // ignore storage errors
    }
  }, [lesson.lessonId, steps]);

  // Persist progress to localStorage (zero Firestore writes)
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_PREFIX + lesson.lessonId,
        JSON.stringify({ stepIdx, itemProgress, lowDataMode }),
      );
    } catch {
      // ignore storage errors
    }
  }, [lesson.lessonId, stepIdx, itemProgress, lowDataMode]);

  const currentStep = steps[stepIdx];
  const currentAudioUrl = useMemo(() => {
    if (lowDataMode) return null;
    if (currentStep.kind === 'slide') {
      const s = currentStep.slide;
      return s.narration.audioUrl
        ? lessonMediaUrl(lesson.lessonId, s.narration.audioUrl)
        : lessonMediaUrl(lesson.lessonId, `audio/${s.id}.mp3`, s.audioHash);
    }
    if (currentStep.kind === 'summary') {
      return lesson.summary.recapAudioUrl
        ? lessonMediaUrl(lesson.lessonId, lesson.summary.recapAudioUrl)
        : lessonMediaUrl(lesson.lessonId, 'audio/recap.mp3', lesson.schemaVersion);
    }
    return null;
  }, [currentStep, lesson.lessonId, lesson.schemaVersion, lesson.summary.recapAudioUrl, lowDataMode]);

  // Reset audio and selected cue when step changes
  useEffect(() => {
    const el = audioRef.current;
    setIsPlaying(false);
    setAudioCurrent(0);
    setAudioDuration(0);
    setAudioError(false);
    setSelectedCueId(null);
    if (el) {
      el.pause();
      el.currentTime = 0;
      el.playbackRate = playbackRate;
    }
  }, [stepIdx, lowDataMode, playbackRate]);

  const togglePlay = useCallback(async () => {
    const el = audioRef.current;
    if (!el || !currentAudioUrl) return;
    if (el.paused) {
      try {
        el.playbackRate = playbackRate;
        await el.play();
        setIsPlaying(true);
      } catch {
        setAudioError(true);
      }
    } else {
      el.pause();
      setIsPlaying(false);
    }
  }, [currentAudioUrl, playbackRate]);

  const replayAudio = useCallback(async () => {
    const el = audioRef.current;
    if (!el || !currentAudioUrl) return;
    el.currentTime = 0;
    try {
      el.playbackRate = playbackRate;
      await el.play();
      setIsPlaying(true);
    } catch {
      setAudioError(true);
    }
  }, [currentAudioUrl, playbackRate]);

  const cycleSpeed = () => {
    const speeds = [0.75, 1, 1.25];
    const next = speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
    setPlaybackRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  // Current slide cues (edited override or default from JSON)
  const currentSlideCues = useMemo<PointerCue[]>(() => {
    if (currentStep.kind !== 'slide') return [];
    return customCuesBySlide[currentStep.slide.id] ?? currentStep.slide.cues ?? [];
  }, [currentStep, customCuesBySlide]);

  // Active cue locked deterministically to audioCurrent (zero drift across pause/seek/speed)
  const activeCue = useMemo<PointerCue | null>(() => {
    if (currentStep.kind !== 'slide') return null;
    if (reviewerMode && selectedCueId) {
      const selected = currentSlideCues.find((c) => c.id === selectedCueId);
      if (selected) return selected;
    }
    if (!pointerEnabled) return null;
    return currentSlideCues.find((c) => audioCurrent >= c.startSec && audioCurrent < c.endSec) ?? null;
  }, [audioCurrent, currentSlideCues, currentStep.kind, pointerEnabled, reviewerMode, selectedCueId]);

  const persistCustomCues = (nextBySlide: Record<string, PointerCue[]>, slideId: string, slideHash?: string) => {
    const nextHashes = slideHash
      ? { ...savedHashesBySlide, [slideId]: slideHash }
      : savedHashesBySlide;
    setCustomCuesBySlide(nextBySlide);
    setSavedHashesBySlide(nextHashes);
    try {
      localStorage.setItem(
        `${CUES_STORAGE_PREFIX}${lesson.lessonId}_${lesson.schemaVersion}`,
        JSON.stringify({ cuesBySlide: nextBySlide, hashesBySlide: nextHashes }),
      );
    } catch {
      // ignore
    }
  };

  const handleUpdateSlideCues = (slide: LessonSlide, next: PointerCue[]) => {
    persistCustomCues({ ...customCuesBySlide, [slide.id]: next }, slide.id, slide.audioHash);
  };

  const handleDragCueRegion = (cueId: string, region: { x: number; y: number; w: number; h: number }) => {
    if (currentStep.kind !== 'slide') return;
    const next = currentSlideCues.map((c) =>
      c.id === cueId ? { ...c, target: { type: 'region' as const, ...region } } : c,
    );
    handleUpdateSlideCues(currentStep.slide, next);
  };

  const handleExportAllCues = () => {
    const out: Record<string, { timingMethod?: string; audioHash?: string; cues: PointerCue[] }> = {};
    for (const s of lesson.slides) {
      out[s.id] = {
        timingMethod: s.timingMethod,
        audioHash: s.audioHash,
        cues: customCuesBySlide[s.id] ?? s.cues ?? [],
      };
    }
    const blob = new Blob(
      [
        JSON.stringify(
          { lessonId: lesson.lessonId, schemaVersion: lesson.schemaVersion, exportedAt: new Date().toISOString(), slides: out },
          null,
          2,
        ),
      ],
      { type: 'application/json' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lesson.lessonId}-pointer-cues.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportAllCues = (jsonText: string) => {
    try {
      const parsed = JSON.parse(jsonText) as {
        slides?: Record<string, { audioHash?: string; cues?: PointerCue[] }>;
      };
      if (!parsed.slides) return;
      const nextCues: Record<string, PointerCue[]> = { ...customCuesBySlide };
      const nextHashes: Record<string, string> = { ...savedHashesBySlide };
      for (const [sid, data] of Object.entries(parsed.slides)) {
        if (Array.isArray(data.cues)) nextCues[sid] = data.cues;
        if (data.audioHash) nextHashes[sid] = data.audioHash;
      }
      setCustomCuesBySlide(nextCues);
      setSavedHashesBySlide(nextHashes);
      localStorage.setItem(
        `${CUES_STORAGE_PREFIX}${lesson.lessonId}_${lesson.schemaVersion}`,
        JSON.stringify({ cuesBySlide: nextCues, hashesBySlide: nextHashes }),
      );
    } catch {
      // ignore invalid JSON
    }
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  // Check if current checkpoint / mastery is complete
  const isAssessmentDone = useCallback(
    (items: AssessmentItem[]) =>
      items.every((it) => {
        const p = itemProgress[it.id];
        return p && (p.solved || p.revealed);
      }),
    [itemProgress],
  );

  const canAdvance = useMemo(() => {
    if (reviewerMode) return stepIdx < steps.length - 1;
    if (currentStep.kind === 'checkpoint') {
      return isAssessmentDone(currentStep.checkpoint.items);
    }
    if (currentStep.kind === 'mastery') {
      return isAssessmentDone(lesson.masteryCheck.items);
    }
    return stepIdx < steps.length - 1;
  }, [currentStep, isAssessmentDone, lesson.masteryCheck.items, reviewerMode, stepIdx, steps.length]);

  // MCQ handler
  const handleMcqSelect = (item: McqItem, optionId: string) => {
    const prev = itemProgress[item.id];
    if (prev?.solved || prev?.revealed) return;

    const attempts = (prev?.attempts ?? 0) + 1;
    const isCorrect = optionId === item.correctOptionId;

    if (isCorrect) {
      setItemProgress((old) => ({
        ...old,
        [item.id]: {
          attempts,
          solved: true,
          revealed: false,
          correctFirstTry: attempts === 1,
          lastFeedback: `${item.onCorrect?.text ?? 'Well done!'} ${item.explanation}`,
          lastWasCorrect: true,
          selectedOptionId: optionId,
        },
      }));
    } else {
      const wrongInfo = (item.onWrong ?? []).find((w) => w.optionId === optionId);
      const revealed = attempts >= 2;
      const correctText = item.options.find((o) => o.id === item.correctOptionId)?.text ?? '';
      setItemProgress((old) => ({
        ...old,
        [item.id]: {
          attempts,
          solved: false,
          revealed,
          correctFirstTry: false,
          lastFeedback: revealed
            ? `Not quite. The correct answer is "${correctText}". ${item.explanation}`
            : wrongInfo?.hintText || 'Not quite yet — have another try!',
          lastWasCorrect: false,
          selectedOptionId: optionId,
        },
      }));
    }
  };

  // Sequence handler
  const moveSequenceItem = (itemId: string, index: number, direction: -1 | 1) => {
    const prev = itemProgress[itemId];
    if (prev?.solved || prev?.revealed) return;
    setSequenceOrders((old) => {
      const arr = [...(old[itemId] ?? [])];
      const target = index + direction;
      if (target < 0 || target >= arr.length) return old;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return { ...old, [itemId]: arr };
    });
  };

  const checkSequence = (item: SequenceItem) => {
    const prev = itemProgress[item.id];
    if (prev?.solved || prev?.revealed) return;
    const currentOrder = sequenceOrders[item.id] ?? [];
    const attempts = (prev?.attempts ?? 0) + 1;
    const isCorrect =
      currentOrder.length === item.correctOrder.length &&
      currentOrder.every((id, idx) => id === item.correctOrder[idx]);

    if (isCorrect) {
      setItemProgress((old) => ({
        ...old,
        [item.id]: {
          attempts,
          solved: true,
          revealed: false,
          correctFirstTry: attempts === 1,
          lastFeedback: `${item.onCorrect?.text ?? 'Well done!'} ${item.explanation}`,
          lastWasCorrect: true,
        },
      }));
    } else {
      const revealed = attempts >= 2;
      if (revealed) {
        setSequenceOrders((old) => ({ ...old, [item.id]: [...item.correctOrder] }));
      }
      setItemProgress((old) => ({
        ...old,
        [item.id]: {
          attempts,
          solved: false,
          revealed,
          correctFirstTry: false,
          lastFeedback: revealed
            ? `Here is the right order. ${item.explanation}`
            : item.onWrong?.[0]?.hintText || 'Check the order again and try once more!',
          lastWasCorrect: false,
        },
      }));
    }
  };

  // TapDiagram handler
  const handleTapHotspot = (item: TapDiagramItem, hotspotId: string) => {
    const prev = itemProgress[item.id];
    if (prev?.solved || prev?.revealed) return;
    const attempts = (prev?.attempts ?? 0) + 1;
    const isCorrect = hotspotId === item.correctHotspotId;

    if (isCorrect) {
      setItemProgress((old) => ({
        ...old,
        [item.id]: {
          attempts,
          solved: true,
          revealed: false,
          correctFirstTry: attempts === 1,
          lastFeedback: `${item.onCorrect?.text ?? 'Well done!'} ${item.explanation}`,
          lastWasCorrect: true,
          selectedHotspotId: hotspotId,
        },
      }));
    } else {
      const wrongInfo = (item.onWrong ?? []).find((w) => w.hotspotId === hotspotId);
      const revealed = attempts >= 2;
      const correctLabel = item.hotspots.find((h) => h.id === item.correctHotspotId)?.label ?? '';
      setItemProgress((old) => ({
        ...old,
        [item.id]: {
          attempts,
          solved: false,
          revealed,
          correctFirstTry: false,
          lastFeedback: revealed
            ? `The right answer is ${correctLabel}. ${item.explanation}`
            : wrongInfo?.hintText || 'Try tapping another part of the diagram!',
          lastWasCorrect: false,
          selectedHotspotId: hotspotId,
        },
      }));
    }
  };

  // Ask Teacher handler
  const activeSlideForAsk: LessonSlide =
    currentStep.kind === 'slide' ? currentStep.slide : lesson.slides[0];

  const handleAskFaq = (q: string, a: string) => {
    const sid = activeSlideForAsk.id;
    setChatBySlide((old) => ({
      ...old,
      [sid]: [
        ...(old[sid] ?? []),
        { role: 'student', text: q },
        { role: 'teacher', text: a, source: 'Curated Teacher FAQ' },
      ],
    }));
  };

  const handleAskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = askInput.trim();
    if (!q || askLoading) return;
    const sid = activeSlideForAsk.id;
    setAskInput('');
    setChatBySlide((old) => ({
      ...old,
      [sid]: [...(old[sid] ?? []), { role: 'student', text: q }],
    }));
    setAskLoading(true);
    try {
      let sessionId = '';
      try {
        sessionId = sessionStorage.getItem('gamedu_lesson_session_id') || '';
        if (!sessionId) {
          sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
          sessionStorage.setItem('gamedu_lesson_session_id', sessionId);
        }
      } catch {
        // ignore storage errors
      }
      const res = await fetch('/api/narrated-lessons/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { 'x-lesson-session': sessionId } : {}),
        },
        body: JSON.stringify({
          lessonId: lesson.lessonId,
          slideId: sid,
          question: q,
        }),
      });
      const data = (await res.json()) as { answer?: string; error?: string; source?: string };
      const reply = data.answer || data.error || 'Please try asking again in a moment.';
      setChatBySlide((old) => ({
        ...old,
        [sid]: [
          ...(old[sid] ?? []),
          {
            role: 'teacher',
            text: reply,
            source: data.source === 'faq' ? 'Curated Teacher FAQ' : 'AI Classroom Teacher',
          },
        ],
      }));
    } catch {
      setChatBySlide((old) => ({
        ...old,
        [sid]: [
          ...(old[sid] ?? []),
          { role: 'teacher', text: 'Could not reach the teacher right now. Please check your connection and try again.' },
        ],
      }));
    } finally {
      setAskLoading(false);
    }
  };

  const resetLesson = () => {
    setStepIdx(0);
    setItemProgress({});
    const resetSeq: Record<string, string[]> = {};
    const allItems = [
      ...lesson.checkpoints.flatMap((cp) => cp.items),
      ...lesson.masteryCheck.items,
    ];
    for (const item of allItems) {
      if (item.type === 'sequence') {
        const list = item.steps ?? item.items ?? [];
        resetSeq[item.id] = deterministicShuffleIds(list.map((x) => x.id));
      }
    }
    setSequenceOrders(resetSeq);
    try {
      localStorage.removeItem(STORAGE_KEY_PREFIX + lesson.lessonId);
    } catch {
      // ignore
    }
  };

  const masteryScore = useMemo(() => {
    return lesson.masteryCheck.items.filter((it) => itemProgress[it.id]?.solved).length;
  }, [itemProgress, lesson.masteryCheck.items]);

  const progressPct = Math.round((stepIdx / Math.max(1, steps.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hidden audio element */}
      {currentAudioUrl && (
        <audio
          ref={audioRef}
          src={currentAudioUrl}
          preload="metadata"
          onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration || 0)}
          onTimeUpdate={(e) => setAudioCurrent(e.currentTarget.currentTime || 0)}
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            setIsPlaying(false);
            setAudioError(true);
          }}
        />
      )}

      {/* Top Sticky Bar — Slim 1-row pupil header on 360px phones */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-white shadow-sm">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-bold text-slate-900">
                  {lesson.meta.title || 'Narrated Lesson'}
                </span>
                {canUseReviewerTools && (
                  <span className="hidden rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 sm:inline">
                    {lesson.schemaVersion}
                  </span>
                )}
              </div>
              <p className="truncate text-[11px] text-slate-500">
                {lesson.meta.class} {lesson.meta.subject} ·{' '}
                {lesson.meta.indicators?.length
                  ? lesson.meta.indicators.join(' · ')
                  : lesson.meta.contentStandard}
              </p>
            </div>
          </div>

          <div className="relative flex shrink-0 items-center gap-1.5">
            {/* Compact Settings button (holds Pointer On/Off & Low-Data Mode) */}
            <button
              type="button"
              onClick={() => setSettingsOpen((v) => !v)}
              aria-expanded={settingsOpen}
              aria-label="Lesson settings"
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                settingsOpen
                  ? 'border-sky-400 bg-sky-50 text-sky-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Settings2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            {/* Reviewer / Teacher tools — hidden from pupils unless ?review=1 or staff session */}
            {canUseReviewerTools && (
              <>
                <button
                  type="button"
                  onClick={() => setReviewerMode((v) => !v)}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                    reviewerMode
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Unlock free navigation, Pointer Cue Editor, and Pronunciation Audit"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{reviewerMode ? 'Reviewer: ON' : 'Reviewer'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowReviewerPanel(true)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  title="Teacher Guide & Coverage Matrix"
                >
                  <ClipboardCheck className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Guide</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-1 rounded-lg bg-sky-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-700"
                  title="Copy review link"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
                </button>
              </>
            )}

            {/* Settings Popover */}
            {settingsOpen && (
              <div className="absolute right-0 top-10 z-40 w-60 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Player Settings
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setPointerEnabled((v) => !v)}
                    aria-pressed={pointerEnabled}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                      pointerEnabled
                        ? 'border-amber-300 bg-amber-50 text-amber-950'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Crosshair className="h-3.5 w-3.5" />
                      Teacher Pointer
                    </span>
                    <span>{pointerEnabled ? 'On' : 'Off'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLowDataMode((v) => !v)}
                    aria-pressed={lowDataMode}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                      lowDataMode
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <WifiOff className="h-3.5 w-3.5" />
                      Low-Data Mode
                    </span>
                    <span>{lowDataMode ? 'On' : 'Off'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100">
          <div
            className="h-full bg-sky-600 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Stage Switcher Bar (Listen · Notes · Questions) — shown only when notes package exists */}
        {notes && (
          <div className="border-t border-slate-100 bg-slate-50/90 px-3 py-1.5 sm:px-4">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-2">
              <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleChangeStage('listen')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition ${
                    activeStage === 'listen'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Listen
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeStage('notes')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition ${
                    activeStage === 'notes'
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Notes
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeStage('questions')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition ${
                    activeStage === 'questions'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  Questions
                </button>
              </div>
              <span className="hidden text-[11px] font-medium text-slate-500 sm:inline">
                {activeStage === 'listen'
                  ? 'Narrated Lesson'
                  : activeStage === 'notes'
                    ? 'Study Notes & Summaries'
                    : 'Worked Question Series'}
              </span>
            </div>
          </div>
        )}

        {/* Reviewer Free-Jump Strip */}
        {reviewerMode && (
          <div className="border-t border-indigo-100 bg-indigo-50/70 px-4 py-2">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="mr-1 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
                  Jump:
                </span>
                {steps.map((st, idx) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStepIdx(idx)}
                    className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium transition ${
                      idx === stepIdx
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-indigo-800 hover:bg-indigo-100'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/narrated-lessons/water-cycle/pronunciation-review"
                  className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-white px-2.5 py-1 text-[11px] font-bold text-indigo-800 hover:bg-indigo-100"
                >
                  <Mic className="h-3 w-3" />
                  Test Clips Review
                </Link>
                <button
                  type="button"
                  onClick={exportSlidePronAudit}
                  className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-700"
                >
                  <Download className="h-3 w-3" />
                  Export Pronunciation Audit
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-6 pb-24">
        {notes && activeStage !== 'listen' ? (
          <LessonNotesAndQuestions
            notes={notes}
            stage={activeStage}
            onChangeStage={handleChangeStage}
            onJumpToSlide={handleJumpToSlide}
            validSlideIds={validSlideIds}
          />
        ) : (
          <>
        {/* INTRO STEP */}
        {currentStep.kind === 'intro' && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-sky-700 via-sky-600 to-teal-600 px-6 py-8 text-white">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                {lesson.meta.class} {lesson.meta.subject} ·{' '}
                {lesson.meta.curriculum === 'cambridge' ? 'Cambridge' : 'GES / NaCCA'}{' '}
                {lesson.meta.indicators.join(' & ')}
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                {lesson.meta.title || lesson.slides[0]?.title || 'Narrated Lesson'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-sky-100 sm:text-base">
                An interactive narrated lesson taught step-by-step by Teacher Kore, with pause-and-check questions and an Ask Teacher helper on every slide.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-xs font-medium text-sky-50">
                <span className="rounded-lg bg-white/15 px-3 py-1.5">
                  {lesson.slides.length} Slides
                  {lesson.sections?.length ? ` · ${lesson.sections.length} Sections` : ''}
                </span>
                <span className="rounded-lg bg-white/15 px-3 py-1.5">
                  ~{lesson.meta.estimatedNarrationMinutes} min audio · ~{lesson.meta.estimatedTotalMinutes} min total
                </span>
                <span className="rounded-lg bg-white/15 px-3 py-1.5">
                  {lesson.checkpoints.length} Checkpoints + {lesson.masteryCheck.items.length}-Item Mastery Check
                </span>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                What you will learn
              </h2>
              <ul className="mt-3 space-y-2.5">
                {lesson.learningOutcomes.map((outcome, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>

              {lesson.sections && lesson.sections.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                    Lesson Sections (play one section at a time)
                  </h2>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {lesson.sections.map((sec) => {
                      const firstSlideId = sec.slideIds[0];
                      const targetIdx = steps.findIndex((st) => st.id === firstSlideId);
                      return (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => {
                            if (targetIdx >= 0) setStepIdx(targetIdx);
                          }}
                          className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-left transition hover:border-sky-300 hover:bg-sky-50/60"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-extrabold text-sky-700">
                              Section {sec.order}: {sec.title}
                            </span>
                            {sec.estimatedMinutes && (
                              <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                ~{sec.estimatedMinutes}m
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-slate-600">{sec.goal}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                <p className="font-semibold">For Teachers &amp; Reviewers:</p>
                <p className="mt-1 leading-relaxed">
                  Play through like a Basic 7 pupil, or turn on <strong>Reviewer Mode</strong> in the top bar to jump freely between slides, inspect <strong>Teacher Notes</strong>, check <strong>NaCCA coverage</strong>, and review <strong>[VERIFY]</strong> flags.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStepIdx(1)}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-sky-700"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Start Narrated Lesson
                </button>
                {canUseReviewerTools && (
                  <button
                    type="button"
                    onClick={() => {
                      setReviewerMode(true);
                      setStepIdx(1);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="h-4 w-4" />
                    Open in Reviewer Mode
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SLIDE STEP */}
        {currentStep.kind === 'slide' && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Slide Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3.5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                    Slide {currentStep.slide.order} of {lesson.slides.length} · {currentStep.slide.indicatorIds.join(', ')}
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                    {currentStep.slide.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setAskOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2 text-xs font-bold text-sky-800 hover:bg-sky-100"
                >
                  <MessageCircleQuestion className="h-4 w-4" />
                  Ask Teacher
                </button>
              </div>

              {/* 16:9 Visual Stage */}
              <div
                onClick={() => {
                  if (reviewerMode && selectedCueId) return;
                  setVisualZoomScale(1);
                  setVisualZoomOpen(true);
                }}
                className={`group relative aspect-video w-full overflow-hidden bg-slate-100 ${
                  reviewerMode && selectedCueId ? '' : 'cursor-zoom-in'
                }`}
              >
                {currentStep.slide.visual.type === 'svg' && currentStep.slide.visual.svgCode ? (
                  <div
                    className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
                    dangerouslySetInnerHTML={{ __html: currentStep.slide.visual.svgCode }}
                  />
                ) : (
                  <img
                    src={
                      currentStep.slide.visual.imageUrl
                        ? lessonMediaUrl(lesson.lessonId, currentStep.slide.visual.imageUrl)
                        : lessonMediaUrl(lesson.lessonId, `images/${currentStep.slide.id}.webp`, lesson.schemaVersion)
                    }
                    alt={currentStep.slide.visual.altText}
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                )}

                {/* Pure HTML/CSS Teacher Pointer Overlay (never baked into SVGs or AI images) */}
                <TeacherPointerOverlay
                  cue={activeCue}
                  editable={reviewerMode && Boolean(selectedCueId)}
                  onUpdateRegion={handleDragCueRegion}
                />

                {/* Enlarge / Fullscreen Visual Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setVisualZoomScale(1);
                    setVisualZoomOpen(true);
                  }}
                  aria-label="Enlarge visual"
                  title="Enlarge for a clearer view"
                  className="absolute right-2.5 top-2.5 z-20 inline-flex items-center gap-1.5 rounded-full bg-slate-900/75 px-3 py-1.5 text-xs font-bold text-white shadow-md backdrop-blur-xs transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Enlarge</span>
                </button>

                {/* Off-screen chip nudge (no auto-scroll on phones) */}
                {activeCue?.target.type === 'chip' && !chipsInView && (
                  <div className="pointer-events-none absolute bottom-2 right-2 rounded-full border-2 border-slate-950 bg-amber-400 px-3 py-1 text-xs font-extrabold text-slate-950 shadow-md">
                    ↓ look below
                  </div>
                )}
              </div>

              {/* Compact portrait-screen zoom hint (non-intrusive; never auto-opens or forces rotation) */}
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-1.5 text-[11px] text-slate-500 sm:hidden">
                <span>Tap the visual or Enlarge to zoom up to 250% &amp; pan.</span>
              </div>

              {/* Minimal On-Screen Key Takeaways */}
              <div
                ref={chipsContainerRef}
                className="grid gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 sm:grid-cols-3"
              >
                {currentStep.slide.onScreenText.map((line, i) => {
                  const isHighlightedChip =
                    activeCue?.target.type === 'chip' && activeCue.target.index === i;
                  return (
                    <div
                      key={i}
                      data-chip-highlighted={isHighlightedChip ? 'true' : 'false'}
                      className={`rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                        isHighlightedChip
                          ? 'border-[4px] border-amber-400 bg-amber-50 text-slate-950 shadow-[0_0_0_2px_#0f172a]'
                          : 'border border-slate-200/80 bg-white text-slate-800 shadow-2xs'
                      }`}
                    >
                      {isHighlightedChip && (
                        <span className="mr-1.5 inline-block rounded bg-slate-950 px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-amber-300">
                          Look
                        </span>
                      )}
                      {line}
                    </div>
                  );
                })}
              </div>

              {/* Kore Audio Controls */}
              <div className="border-t border-slate-200 bg-white px-5 py-4">
                {lowDataMode ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-950">
                    <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-800">
                      <WifiOff className="h-3.5 w-3.5" />
                      Low-Data Mode — Reading Transcript
                    </div>
                    <p className="leading-relaxed">{currentStep.slide.narration.script}</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="inline-flex h-11 items-center gap-2 rounded-xl bg-sky-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-sky-700"
                      >
                        {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                        {isPlaying ? 'Pause Teacher' : 'Listen to Teacher'}
                      </button>

                      <button
                        type="button"
                        onClick={replayAudio}
                        className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Replay
                      </button>

                      <button
                        type="button"
                        onClick={cycleSpeed}
                        className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        title="Change voice speed"
                      >
                        {playbackRate}x
                      </button>

                      <div className="flex flex-1 items-center gap-2 min-w-[160px]">
                        <span className="w-10 text-right text-xs font-medium text-slate-500">
                          {formatTime(audioCurrent)}
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={audioDuration || currentStep.slide.narration.estSeconds}
                          step={0.2}
                          value={audioCurrent}
                          onChange={(e) => {
                            const t = Number(e.target.value);
                            if (audioRef.current) audioRef.current.currentTime = t;
                            setAudioCurrent(t);
                          }}
                          aria-label="Audio progress"
                          className="h-2 flex-1 cursor-pointer accent-sky-600"
                        />
                        <span className="w-10 text-xs font-medium text-slate-500">
                          {formatTime(audioDuration || currentStep.slide.narration.estSeconds)}
                        </span>
                      </div>
                    </div>

                    {audioError && (
                      <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                        <VolumeX className="h-4 w-4 shrink-0" />
                        Audio is still loading or unavailable on this network. Open the transcript below to read along.
                      </div>
                    )}

                    {/* Transcript & Teacher Note Toggles */}
                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setShowTranscript((v) => !v)}
                        className="inline-flex items-center gap-1 font-semibold text-sky-700 hover:underline"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        {showTranscript ? 'Hide Spoken Script' : 'Read Spoken Script'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowTeacherNote((v) => !v)}
                        className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:underline"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                        {showTeacherNote ? 'Hide Teacher Note' : 'Show Teacher Note'}
                      </button>
                    </div>

                    {showTranscript && (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-700">
                        {currentStep.slide.narration.script}
                      </div>
                    )}

                    {showTeacherNote && (
                      <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5 text-xs leading-relaxed text-indigo-950">
                        <span className="font-bold">Teacher Note: </span>
                        {currentStep.slide.teacherNote}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Collapsible Inline Runner (Pseudocode / Python / SQL) for Computer Science lessons */}
            <InlineCodePlayground lesson={lesson} slideId={currentStep.slide.id} />

            {/* Reviewer-Mode Pointer Cues Editor */}
            {reviewerMode && (
              <PointerCueEditor
                slide={currentStep.slide}
                cues={currentSlideCues}
                selectedCueId={selectedCueId}
                audioCurrent={audioCurrent}
                isAudioHashStale={Boolean(
                  savedHashesBySlide[currentStep.slide.id] &&
                    currentStep.slide.audioHash &&
                    savedHashesBySlide[currentStep.slide.id] !== currentStep.slide.audioHash,
                )}
                onSelectCue={setSelectedCueId}
                onChangeCues={(next) => handleUpdateSlideCues(currentStep.slide, next)}
                onSeekTo={(sec) => {
                  if (audioRef.current) audioRef.current.currentTime = sec;
                  setAudioCurrent(sec);
                }}
                onExportAllCues={handleExportAllCues}
                onImportAllCues={handleImportAllCues}
              />
            )}

            {/* Reviewer-Mode Pronunciation Check Panel (Step 7) */}
            {reviewerMode && (() => {
              const termsOnSlide = getSlidePronunciationTerms(currentStep.slide, lesson.pronunciationGuide);
              return (
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4 text-indigo-700" />
                      <h3 className="text-xs font-extrabold uppercase tracking-wide text-indigo-900">
                        Reviewer Pronunciation Check — Slide {currentStep.slide.id}
                      </h3>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                        audioSource: {currentStep.slide.narration.audioSource ?? 'tts'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={exportSlidePronAudit}
                      className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-white px-2.5 py-1 text-[11px] font-bold text-indigo-800 hover:bg-indigo-100"
                    >
                      <Download className="h-3 w-3" />
                      Export Results
                    </button>
                  </div>

                  {termsOnSlide.length === 0 ? (
                    <p className="mt-2 text-xs text-indigo-800/80">
                      No Ghanaian names from the pronunciation guide appear in this slide&apos;s narration.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2.5">
                      {termsOnSlide.map((entry) => {
                        const audit = pronAudit[`${currentStep.slide.id}:${entry.term}`] ?? {
                          status: '',
                          note: '',
                        };
                        return (
                          <div
                            key={entry.term}
                            className="flex flex-col gap-2 rounded-xl border border-indigo-100 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="min-w-[120px]">
                              <span className="text-sm font-bold text-slate-900">{entry.term}</span>
                              <p className="text-[11px] text-slate-500">{entry.languageOrContext}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {(['OK', 'Odd', 'Wrong'] as const).map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => updateSlidePronAudit(currentStep.slide.id, entry.term, { status: st })}
                                  className={`rounded-lg border px-2.5 py-1 text-xs font-bold transition ${
                                    audit.status === st
                                      ? st === 'OK'
                                        ? 'border-emerald-600 bg-emerald-600 text-white'
                                        : st === 'Odd'
                                          ? 'border-amber-500 bg-amber-500 text-white'
                                          : 'border-rose-600 bg-rose-600 text-white'
                                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                              <input
                                type="text"
                                value={audit.note}
                                onChange={(e) =>
                                  updateSlidePronAudit(currentStep.slide.id, entry.term, { note: e.target.value })
                                }
                                placeholder="Pronunciation note..."
                                className="w-48 rounded-lg border border-slate-200 px-2.5 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* CHECKPOINT STEP */}
        {currentStep.kind === 'checkpoint' && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Concept Check
                    {currentStep.checkpoint.coversSlides?.length
                      ? ` · Covers Slides ${currentStep.checkpoint.coversSlides.join(', ')}`
                      : currentStep.checkpoint.sectionId
                        ? ` · Section ${currentStep.checkpoint.sectionId.replace('sec', '')}`
                        : ''}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Pause &amp; Check Your Understanding
                  </h2>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-amber-900 shadow-2xs">
                  {currentStep.checkpoint.retryRule}
                </span>
              </div>
            </div>

            {currentStep.checkpoint.items.map((item, idx) => (
              <AssessmentCard
                key={item.id}
                index={idx + 1}
                item={item}
                progress={itemProgress[item.id]}
                sequenceOrder={sequenceOrders[item.id]}
                slideById={slideById}
                onSelectMcq={(optId) => handleMcqSelect(item as McqItem, optId)}
                onMoveSeq={(i, dir) => moveSequenceItem(item.id, i, dir)}
                onCheckSeq={() => checkSequence(item as SequenceItem)}
                onTapHotspot={(hid) => handleTapHotspot(item as TapDiagramItem, hid)}
              />
            ))}
          </div>
        )}

        {/* MASTERY CHECK STEP */}
        {currentStep.kind === 'mastery' && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Final Mastery Check · Pass Mark {lesson.masteryCheck.passMark} / {lesson.masteryCheck.items.length}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Show What You Know: {lesson.meta.title || 'Mastery Check'}
                  </h2>
                </div>
                <div className="rounded-xl bg-white px-3.5 py-1.5 text-sm font-extrabold text-emerald-800 shadow-2xs">
                  Score: {masteryScore} / {lesson.masteryCheck.items.length}
                </div>
              </div>
            </div>

            {lesson.masteryCheck.items.map((item, idx) => (
              <AssessmentCard
                key={item.id}
                index={idx + 1}
                item={item}
                progress={itemProgress[item.id]}
                sequenceOrder={sequenceOrders[item.id]}
                slideById={slideById}
                onSelectMcq={(optId) => handleMcqSelect(item as McqItem, optId)}
                onMoveSeq={(i, dir) => moveSequenceItem(item.id, i, dir)}
                onCheckSeq={() => checkSequence(item as SequenceItem)}
                onTapHotspot={(hid) => handleTapHotspot(item as TapDiagramItem, hid)}
              />
            ))}
          </div>
        )}

        {/* SUMMARY STEP */}
        {currentStep.kind === 'summary' && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Lesson Complete!
                  </span>
                  <h2 className="mt-2 text-2xl font-extrabold">Well Done! Lesson Completed.</h2>
                  <p className="mt-1 text-sm text-emerald-50">
                    Mastery Score: <strong>{masteryScore} / {lesson.masteryCheck.items.length}</strong>{' '}
                    {masteryScore >= lesson.masteryCheck.passMark
                      ? '— You passed the Mastery Check!'
                      : '— Review any tricky slides and try again anytime.'}
                  </p>
                </div>
                {!lowDataMode && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-800 shadow-sm hover:bg-emerald-50"
                  >
                    {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                    {isPlaying ? 'Pause Recap' : 'Listen to Recap'}
                  </button>
                )}
              </div>
              <p className="mt-4 rounded-xl bg-white/10 p-3.5 text-sm leading-relaxed text-emerald-50">
                {lesson.summary.recapScript}
              </p>
            </div>

            {/* Takeaways */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900">Three Big Ideas to Remember</h3>
              <ul className="mt-3 space-y-2.5">
                {lesson.summary.takeaways.map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-800">
                      {i + 1}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Extension Activity */}
            <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sky-900">
                <FlaskConical className="h-5 w-5" />
                <h3 className="text-base font-extrabold">Try at Home: {lesson.extensionActivity.title}</h3>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">Materials</h4>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
                    {lesson.extensionActivity.materials.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">Steps</h4>
                  <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-slate-700">
                    {lesson.extensionActivity.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                <strong>Safety Note:</strong> {lesson.extensionActivity.safetyNote}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-700">
                <strong>What to watch for:</strong> {lesson.extensionActivity.expectedObservation}
              </p>
            </div>

            {/* Vocabulary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900">Key Vocabulary</h3>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {lesson.vocabulary.map((v) => (
                  <div key={v.term} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-bold text-slate-900">{v.term}</span>
                      <span className="text-[11px] font-medium text-sky-700">{v.pronunciationNote}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{v.studentFriendlyMeaning}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Post-lesson Next Stage: Study Notes & Worked Question Series */}
            {notes && (
              <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-sky-50 to-teal-50 p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-bold text-indigo-800">
                      Next Stage · Exam Revision
                    </span>
                    <h3 className="mt-1.5 text-lg font-extrabold text-slate-900">
                      Study Notes &amp; Worked Question Series
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Review short section summaries, full study notes, and{' '}
                      {notes.questionSeries.reduce((sum, g) => sum + g.questions.length, 0)}{' '}
                      teacher-explained questions with memory tricks and common exam traps.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleChangeStage('notes');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-teal-700"
                    >
                      <FileText className="h-4 w-4" />
                      Open Study Notes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleChangeStage('questions');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-indigo-700"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Practice Question Series
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={resetLesson}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                Restart Lesson From Slide 1
              </button>
            </div>
          </div>
        )}
          </>
        )}
      </main>

      {/* Bottom Sticky Navigation Footer */}
      {activeStage === 'listen' && currentStep.kind !== 'intro' && (
        <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
              disabled={stepIdx === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <div className="text-center text-xs font-semibold text-slate-500">
              Step {stepIdx} of {steps.length - 1}
              {!canAdvance && (currentStep.kind === 'checkpoint' || currentStep.kind === 'mastery') && (
                <span className="block text-[11px] text-amber-700">
                  Complete the questions above to continue
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setStepIdx((i) => Math.min(steps.length - 1, i + 1))}
              disabled={!canAdvance || stepIdx >= steps.length - 1}
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {stepIdx === steps.length - 1 ? 'Done' : 'Continue'}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </footer>
      )}

      {/* Ask Teacher Slide-Over Drawer */}
      {askOpen && (
        <div
          className="fixed inset-0 z-[100] flex justify-end bg-slate-900/40 backdrop-blur-[1px]"
          onClick={() => setAskOpen(false)}
        >
          <div
            className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Ask Your Science Teacher</h3>
                <p className="text-xs text-slate-500">
                  Slide {activeSlideForAsk.order}: {activeSlideForAsk.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAskOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                aria-label="Close Ask Teacher"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {/* Instant Curated FAQs */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Common Questions on This Slide (Instant)
                </p>
                <div className="mt-2 space-y-2">
                  {activeSlideForAsk.askTeacherContext.seedFaqs.map((faq, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAskFaq(faq.q, faq.a)}
                      className="w-full rounded-xl border border-sky-100 bg-sky-50/70 px-3 py-2 text-left text-xs font-semibold text-sky-900 transition hover:bg-sky-100"
                    >
                      {faq.q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversation Thread */}
              <div className="space-y-3">
                {(chatBySlide[activeSlideForAsk.id] ?? []).map((msg, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'student'
                        ? 'ml-8 bg-sky-600 text-white'
                        : 'mr-6 border border-slate-200 bg-slate-50 text-slate-800'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.source && (
                      <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {msg.source}
                      </span>
                    )}
                  </div>
                ))}
                {askLoading && (
                  <div className="mr-6 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500">
                    Teacher is thinking...
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleAskSubmit} className="border-t border-slate-200 p-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={askInput}
                  onChange={(e) => setAskInput(e.target.value)}
                  placeholder="Type your question about this slide..."
                  maxLength={400}
                  className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-sky-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={askLoading || !askInput.trim()}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white hover:bg-sky-700 disabled:bg-slate-300"
                  aria-label="Send question"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enlarged Visual Lightbox Modal (GES / NaCCA & Cambridge) */}
      {visualZoomOpen && currentStep.kind === 'slide' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged visual: ${currentStep.slide.title}`}
          onClick={() => setVisualZoomOpen(false)}
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/92 backdrop-blur-sm"
        >
          {/* Top toolbar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-slate-950/80 px-4 py-3 text-white"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-200">
                  {lesson.meta.curriculum === 'cambridge' ? 'Cambridge' : 'GES / NaCCA'}
                </span>
                <h3 className="truncate text-sm font-extrabold sm:text-base">
                  {currentStep.slide.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setVisualZoomScale((s) => Math.max(1, Number((s - 0.25).toFixed(2))))}
                disabled={visualZoomScale <= 1}
                aria-label="Zoom out"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white hover:bg-white/20 disabled:opacity-40"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setVisualZoomScale(1)}
                aria-label="Reset zoom"
                title="Reset to 100%"
                className="min-w-[3.5rem] rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-center text-xs font-bold tabular-nums text-white hover:bg-white/20"
              >
                {Math.round(visualZoomScale * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setVisualZoomScale((s) => Math.min(2.5, Number((s + 0.25).toFixed(2))))}
                disabled={visualZoomScale >= 2.5}
                aria-label="Zoom in"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white hover:bg-white/20 disabled:opacity-40"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setVisualZoomOpen(false)}
                aria-label="Close enlarged view"
                className="ml-2 inline-flex h-8 items-center gap-1 rounded-lg bg-white px-2.5 text-xs font-extrabold text-slate-900 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>
          </div>

          {/* Scrollable / Pannable Enlarged Stage */}
          <div className="flex-1 overflow-auto p-3 sm:p-6">
            <div className="mx-auto flex min-h-full max-w-6xl items-center justify-center">
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ width: `${visualZoomScale * 100}%` }}
                className="relative aspect-video shrink-0 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-white/20 transition-[width] duration-150"
              >
                {currentStep.slide.visual.type === 'svg' && currentStep.slide.visual.svgCode ? (
                  <div
                    className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
                    dangerouslySetInnerHTML={{ __html: currentStep.slide.visual.svgCode }}
                  />
                ) : (
                  <img
                    src={
                      currentStep.slide.visual.imageUrl
                        ? lessonMediaUrl(lesson.lessonId, currentStep.slide.visual.imageUrl)
                        : lessonMediaUrl(lesson.lessonId, `images/${currentStep.slide.id}.webp`, lesson.schemaVersion)
                    }
                    alt={currentStep.slide.visual.altText}
                    className="h-full w-full object-contain bg-slate-900"
                  />
                )}
                <TeacherPointerOverlay cue={activeCue} editable={false} />
              </div>
            </div>
          </div>

          {/* Caption Footer */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="border-t border-white/10 bg-slate-950/80 px-4 py-2.5 text-center text-xs text-slate-300"
          >
            <p className="mx-auto max-w-4xl truncate">{currentStep.slide.visual.altText}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Use + / − to zoom up to 250% · Scroll or swipe to pan · Tap outside or press Esc to close
            </p>
          </div>
        </div>
      )}

      {/* Teacher / Reviewer Guide Modal */}
      {showReviewerPanel && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Teacher and Reviewer Guide"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[1px]"
          onClick={() => setShowReviewerPanel(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div className="min-w-0">
                <h3 className="text-base font-extrabold text-slate-900">
                  Teacher &amp; Reviewer Guide ({lesson.schemaVersion})
                </h3>
                <p className="text-xs text-slate-500">
                  {lesson.meta.class} {lesson.meta.subject} ·{' '}
                  {lesson.meta.indicators?.length
                    ? lesson.meta.indicators.join(' · ')
                    : lesson.meta.contentStandard}{' '}
                  · {lesson.meta.narrationWordCount} narration words
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewerPanel(false)}
                aria-label="Close Teacher Guide"
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
                <span>Close</span>
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto p-5 text-xs">
              {/* Coverage Matrix */}
              <section>
                <h4 className="font-bold uppercase tracking-wide text-slate-500">
                  GES / NaCCA Indicator Coverage Matrix
                </h4>
                <div className="mt-2 space-y-2">
                  {lesson.coverageMatrix.map((row) => (
                    <div key={row.indicatorId} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="font-bold text-slate-900">{row.indicatorId}</p>
                      <p className="mt-1 text-slate-600">
                        <strong>Slides:</strong> {row.slides.join(', ')}
                      </p>
                      <p className="mt-0.5 text-slate-600">
                        <strong>Assessment Items:</strong> {row.checkpointItems.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Verify Flags */}
              <section>
                <h4 className="flex items-center gap-1.5 font-bold uppercase tracking-wide text-amber-700">
                  <ShieldAlert className="h-4 w-4" />
                  Items Flagged for Teacher Verification ({lesson.verifyFlags.length})
                </h4>
                <div className="mt-2 space-y-2">
                  {lesson.verifyFlags.map((flag, i) => (
                    <div key={i} className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-950">
                      <p className="font-bold">[{flag.slideId}] {flag.claim}</p>
                      <p className="mt-1 leading-relaxed">{flag.reason}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Pronunciation Guide */}
              <section>
                <h4 className="font-bold uppercase tracking-wide text-slate-500">
                  Ghanaian Pronunciation Guide (Kore TTS)
                </h4>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {lesson.pronunciationGuide.map((p) => (
                    <div key={p.term} className="rounded-xl border border-slate-200 bg-white p-2.5">
                      <span className="font-bold text-slate-900">{p.term}</span>{' '}
                      <span className="text-sky-700">({p.respelling})</span>
                      <p className="mt-0.5 text-slate-500">{p.languageOrContext}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <div className="flex shrink-0 justify-end border-t border-slate-200 bg-slate-50 px-5 py-3">
              <button
                type="button"
                onClick={() => setShowReviewerPanel(false)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Assessment Item Card (MCQ, Sequence, TapDiagram)                           */
/* -------------------------------------------------------------------------- */

function AssessmentCard({
  index,
  item,
  progress,
  sequenceOrder,
  slideById,
  onSelectMcq,
  onMoveSeq,
  onCheckSeq,
  onTapHotspot,
}: {
  index: number;
  item: AssessmentItem;
  progress?: ItemProgress;
  sequenceOrder?: string[];
  slideById: Map<string, LessonSlide>;
  onSelectMcq: (optionId: string) => void;
  onMoveSeq: (idx: number, dir: -1 | 1) => void;
  onCheckSeq: () => void;
  onTapHotspot: (hotspotId: string) => void;
}) {
  const locked = Boolean(progress?.solved || progress?.revealed);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2 text-xs text-slate-500">
        <span className="font-bold uppercase tracking-wide text-sky-700">
          Question {index} · {item.indicatorId}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium capitalize">
          {item.type === 'tapDiagram' ? 'Tap Diagram' : item.type === 'sequence' ? 'Put in Order' : item.cognitiveLevel}
        </span>
      </div>

      {/* MCQ */}
      {item.type === 'mcq' && (
        <>
          <p className="text-base font-bold text-slate-900">{item.question ?? item.prompt}</p>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {item.options.map((opt) => {
              const isSelected = progress?.selectedOptionId === opt.id;
              const isCorrectOption = opt.id === item.correctOptionId;
              let btnStyle = 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/40 text-slate-800';
              if (locked && isCorrectOption) {
                btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
              } else if (isSelected && progress?.lastWasCorrect === false) {
                btnStyle = 'border-rose-400 bg-rose-50 text-rose-900';
              }
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={locked}
                  onClick={() => onSelectMcq(opt.id)}
                  className={`flex items-start gap-2.5 rounded-xl border-2 px-4 py-3 text-left text-sm transition ${btnStyle}`}
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold uppercase text-slate-700">
                    {opt.id}
                  </span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* SEQUENCE */}
      {item.type === 'sequence' && (() => {
        const seqList = item.steps ?? item.items ?? [];
        return (
          <>
            <p className="text-base font-bold text-slate-900">{item.prompt ?? item.question}</p>
            <div className="mt-4 space-y-2">
              {(sequenceOrder ?? seqList.map((x) => x.id)).map((id, idx, arr) => {
                const label = seqList.find((x) => x.id === id)?.text ?? id;
                return (
                  <div
                    key={id}
                    className={`flex items-center justify-between rounded-xl border-2 px-4 py-2.5 ${
                      locked ? 'border-emerald-300 bg-emerald-50/60' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-slate-900">{label}</span>
                    </div>
                    {!locked && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => onMoveSeq(idx, -1)}
                          className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                          aria-label={`Move ${label} up`}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === arr.length - 1}
                          onClick={() => onMoveSeq(idx, 1)}
                          className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                          aria-label={`Move ${label} down`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {!locked && (
              <button
                type="button"
                onClick={onCheckSeq}
                className="mt-4 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-700"
              >
                Check My Order
              </button>
            )}
          </>
        );
      })()}

      {/* TAP DIAGRAM */}
      {item.type === 'tapDiagram' && (() => {
        const diagSlide = slideById.get(item.diagramSlideId);
        return (
          <>
            <p className="text-base font-bold text-slate-900">{item.question ?? item.prompt}</p>
            <p className="mt-1 text-xs text-slate-500">
              Tap directly on the matching part of the diagram below:
            </p>
            <div className="relative mt-3 aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-sky-50">
              {diagSlide?.visual.svgCode && (
                <div
                  className="pointer-events-none h-full w-full [&>svg]:h-full [&>svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: diagSlide.visual.svgCode }}
                />
              )}
              {item.hotspots.map((hs) => {
                const isSelected = progress?.selectedHotspotId === hs.id;
                const isCorrectHs = hs.id === item.correctHotspotId;
                let ringClass = 'border-transparent hover:border-sky-500 hover:bg-sky-500/15';
                if (locked && isCorrectHs) {
                  ringClass = 'border-emerald-600 bg-emerald-500/20';
                } else if (isSelected && progress?.lastWasCorrect === false) {
                  ringClass = 'border-rose-500 bg-rose-500/20';
                }
                return (
                  <button
                    key={hs.id}
                    type="button"
                    disabled={locked}
                    onClick={() => onTapHotspot(hs.id)}
                    aria-label={hs.label}
                    style={{
                      left: `${(hs.x / 1280) * 100}%`,
                      top: `${(hs.y / 720) * 100}%`,
                      width: `${((hs.width ?? hs.w ?? 160) / 1280) * 100}%`,
                      height: `${((hs.height ?? hs.h ?? 160) / 720) * 100}%`,
                    }}
                    className={`absolute rounded-xl border-4 transition focus:outline-none focus:ring-4 focus:ring-sky-400 ${ringClass}`}
                  />
                );
              })}
            </div>
          </>
        );
      })()}

      {/* Feedback Banner */}
      {progress?.lastFeedback && (
        <div
          className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-relaxed ${
            progress.solved
              ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
              : progress.revealed
                ? 'border-amber-200 bg-amber-50 text-amber-950'
                : 'border-rose-200 bg-rose-50 text-rose-950'
          }`}
        >
          {progress.lastFeedback}
        </div>
      )}
    </div>
  );
}
