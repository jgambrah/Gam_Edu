'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Volume2, RotateCcw, Wand2, Sparkles, Trophy, ArrowRight, ArrowLeft,
  Check, Play, Pause, ChevronRight, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  LetterData, LetterStroke, StrokeWaypoint,
  getLetterHandwritingData
} from '@/lib/handwriting-ece-data';

interface GuidedTracingLabProps {
  selectedLetter: string;
  onLetterChange: (letter: string) => void;
  alphabet?: string[];
  mergedDict?: Record<string, { word: string; emoji: string; phonic: string }[]>;
}

// Distance between 2 normalized points (0-100 scale)
function getDistance(p1: StrokeWaypoint, p2: StrokeWaypoint): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

// Project point p onto segment a-b
function projectPointOntoSegment(
  p: StrokeWaypoint,
  a: StrokeWaypoint,
  b: StrokeWaypoint
): { point: StrokeWaypoint; t: number; distance: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) {
    return { point: a, t: 0, distance: getDistance(p, a) };
  }
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const proj = { x: a.x + t * dx, y: a.y + t * dy };
  return { point: proj, t, distance: getDistance(p, proj) };
}

// Draw natural smooth Bézier curve across sequence of points
function drawSmoothBezierStroke(
  ctx: CanvasRenderingContext2D,
  pts: StrokeWaypoint[],
  scaleX: number,
  scaleY: number
) {
  if (pts.length === 0) return;
  if (pts.length === 1) {
    ctx.moveTo(pts[0].x * scaleX, pts[0].y * scaleY);
    ctx.lineTo(pts[0].x * scaleX, pts[0].y * scaleY);
    return;
  }
  if (pts.length === 2) {
    ctx.moveTo(pts[0].x * scaleX, pts[0].y * scaleY);
    ctx.lineTo(pts[1].x * scaleX, pts[1].y * scaleY);
    return;
  }

  // Draw continuous smooth spline using midpoint quadratic Béziers
  ctx.moveTo(pts[0].x * scaleX, pts[0].y * scaleY);
  for (let i = 1; i < pts.length - 1; i++) {
    const curr = pts[i];
    const next = pts[i + 1];
    const midX = ((curr.x + next.x) / 2) * scaleX;
    const midY = ((curr.y + next.y) / 2) * scaleY;
    ctx.quadraticCurveTo(curr.x * scaleX, curr.y * scaleY, midX, midY);
  }
  // Connect to final waypoint
  const last = pts[pts.length - 1];
  ctx.lineTo(last.x * scaleX, last.y * scaleY);
}

export function GuidedTracingLab({
  selectedLetter,
  onLetterChange,
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  mergedDict = {}
}: GuidedTracingLabProps) {
  // Mode: Uppercase vs. Infant Lowercase (single-story ɑ, hooked t, etc.)
  const [caseMode, setCaseMode] = useState<'upper' | 'lower'>('upper');
  
  // Active Letter Data
  const letterData: LetterData = useMemo(() => {
    return getLetterHandwritingData(selectedLetter, caseMode);
  }, [selectedLetter, caseMode]);

  // Stroke Progression State
  const [activeStrokeIndex, setActiveStrokeIndex] = useState<number>(0);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState<number>(0);
  const [completedStrokes, setCompletedStrokes] = useState<StrokeWaypoint[][]>([]);
  const [currentStrokeInk, setCurrentStrokeInk] = useState<StrokeWaypoint[]>([]);
  
  // Interaction & Guidance States
  const [isTracing, setIsTracing] = useState<boolean>(false);
  const [isStrokeActive, setIsStrokeActive] = useState<boolean>(false);
  const [corridorWarning, setCorridorWarning] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Touch circle 1 to begin!');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isDemonstrating, setIsDemonstrating] = useState<boolean>(false);
  const [idleHelperProgress, setIdleHelperProgress] = useState<number>(0);
  const [showIdleMascot, setShowIdleMascot] = useState<boolean>(false);

  // Canvas & Audio Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeLetterRef = useRef<HTMLButtonElement | null>(null);
  const letterTrayRef = useRef<HTMLDivElement | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const demoAnimationRef = useRef<number | null>(null);
  const idleAnimationRef = useRef<number | null>(null);

  // Word & Sound for Current Letter
  const currentWord = useMemo(() => {
    const upper = selectedLetter.toUpperCase();
    return mergedDict[upper]?.[0] || { word: upper === 'A' ? 'Apple' : upper, emoji: '✨', phonic: letterData.phonemeSound };
  }, [selectedLetter, mergedDict, letterData]);

  // Synthesized Web Audio Helpers
  const playSound = useCallback((type: 'start' | 'chime' | 'victory' | 'warning') => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      if (type === 'start') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'chime') {
        // 2-note ascending stroke complete chime
        [523.25, 659.25].forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          const t = now + idx * 0.09;
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.3);
        });
      } else if (type === 'victory') {
        // 4-note victory arpeggio: C5, E5, G5, C6
        [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          const t = now + idx * 0.08;
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.25, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.42);
        });
      } else if (type === 'warning') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch {
      // Audio context policy catch
    }
  }, []);

  const speakText = useCallback((text: string, rate = 0.9) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = rate;
      window.speechSynthesis.speak(u);
    } catch {
      // Speech policy catch
    }
  }, []);

  // Reset letter tracing state
  const handleResetLetter = useCallback(() => {
    setActiveStrokeIndex(0);
    setCurrentWaypointIndex(0);
    setCompletedStrokes([]);
    setCurrentStrokeInk([]);
    setIsStrokeActive(false);
    setIsTracing(false);
    setCorridorWarning(false);
    setIsCompleted(false);
    setIsDemonstrating(false);
    setShowIdleMascot(false);
    setStatusMessage(`Touch circle 1 to trace ${letterData.char}!`);

    if (demoAnimationRef.current) {
      cancelAnimationFrame(demoAnimationRef.current);
      demoAnimationRef.current = null;
    }
  }, [letterData.char]);

  // Reset when letter or case changes
  useEffect(() => {
    handleResetLetter();
  }, [selectedLetter, caseMode, handleResetLetter]);

  // Auto-scroll bottom tray to keep active letter centered
  useEffect(() => {
    if (activeLetterRef.current) {
      activeLetterRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedLetter]);

  // Reset Idle Mascot Timer (> 2.5s idle activates helper animation)
  const resetIdleTimer = useCallback(() => {
    if (showIdleMascot) setShowIdleMascot(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    if (!isCompleted && !isDemonstrating) {
      idleTimerRef.current = setTimeout(() => {
        setShowIdleMascot(true);
      }, 2500);
    }
  }, [isCompleted, isDemonstrating, showIdleMascot]);

  // Handle Mascot Loop Animation along current active stroke
  useEffect(() => {
    if (showIdleMascot && !isCompleted && !isDemonstrating) {
      let start: number | null = null;
      const duration = 2200; // 2.2s per stroke loop

      const animateMascot = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = (elapsed % duration) / duration;
        setIdleHelperProgress(progress);
        idleAnimationRef.current = requestAnimationFrame(animateMascot);
      };

      idleAnimationRef.current = requestAnimationFrame(animateMascot);
      return () => {
        if (idleAnimationRef.current) cancelAnimationFrame(idleAnimationRef.current);
      };
    } else {
      if (idleAnimationRef.current) cancelAnimationFrame(idleAnimationRef.current);
    }
  }, [showIdleMascot, isCompleted, isDemonstrating]);

  // Calculate coordinates for idle mascot along active stroke points
  const activeStroke = letterData.strokes[activeStrokeIndex];
  const mascotPosition = useMemo(() => {
    if (!activeStroke || activeStroke.points.length === 0) return { x: 50, y: 50 };
    const pts = activeStroke.points;
    const totalSegments = pts.length - 1;
    if (totalSegments <= 0) return pts[0];

    const scaledProgress = idleHelperProgress * totalSegments;
    const segmentIdx = Math.min(totalSegments - 1, Math.floor(scaledProgress));
    const segmentT = scaledProgress - segmentIdx;

    const pA = pts[segmentIdx];
    const pB = pts[segmentIdx + 1];
    return {
      x: pA.x + (pB.x - pA.x) * segmentT,
      y: pA.y + (pB.y - pA.y) * segmentT
    };
  }, [activeStroke, idleHelperProgress]);

  // Ergonomics & Safety: Prevent mobile/tablet scrolling, pull-to-refresh, or accidental panning
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventTouchScroll = (e: TouchEvent) => {
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    // Use { passive: false } so preventDefault() stops browser gesture actions reliably
    canvas.addEventListener('touchstart', preventTouchScroll, { passive: false });
    canvas.addEventListener('touchmove', preventTouchScroll, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', preventTouchScroll);
      canvas.removeEventListener('touchmove', preventTouchScroll);
    };
  }, []);

  // High-DPI Canvas Rendering
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();

    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const scaleX = rect.width / 100;
    const scaleY = rect.height / 100;

    // 1. Draw Completed Strokes (vibrant emerald ink with glossy highlight)
    completedStrokes.forEach((strokePts) => {
      if (strokePts.length < 2) return;

      // Base solid stroke with smooth natural curves
      ctx.beginPath();
      drawSmoothBezierStroke(ctx, strokePts, scaleX, scaleY);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Soft gloss center line with smooth natural curves
      ctx.beginPath();
      drawSmoothBezierStroke(ctx, strokePts, scaleX, scaleY);
      ctx.strokeStyle = '#6ee7b7';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });

    // 2. Draw Currently Active Tracing Ink (ocean blue ink)
    if (currentStrokeInk.length >= 2) {
      ctx.beginPath();
      drawSmoothBezierStroke(ctx, currentStrokeInk, scaleX, scaleY);
      ctx.strokeStyle = corridorWarning ? '#f59e0b' : '#0284c7';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Inner gloss with smooth natural curves
      ctx.beginPath();
      drawSmoothBezierStroke(ctx, currentStrokeInk, scaleX, scaleY);
      ctx.strokeStyle = corridorWarning ? '#fde68a' : '#7dd3fc';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    ctx.restore();
  }, [completedStrokes, currentStrokeInk, corridorWarning]);

  // Re-render canvas whenever strokes change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Convert client touch/mouse event to normalized 0-100 coordinates
  const getNormalizedPoint = (e: React.TouchEvent | React.MouseEvent): StrokeWaypoint | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const normX = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const normY = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    return { x: normX, y: normY };
  };

  // TOUCH START: Stroke Order & Starting Waypoint Enforcement (tolerance <= 14%)
  const handlePointerDown = (e: React.TouchEvent | React.MouseEvent) => {
    if (isCompleted || isDemonstrating) return;
    resetIdleTimer();
    const pt = getNormalizedPoint(e);
    if (!pt) return;

    const stroke = letterData.strokes[activeStrokeIndex];
    if (!stroke || stroke.points.length === 0) return;

    const startPoint = stroke.points[0];
    const distToStart = getDistance(pt, startPoint);

    // Preschool starting tolerance radius: <= 16% of normalized box (generous envelope for early learner tremor)
    if (distToStart <= 16) {
      setIsTracing(true);
      setIsStrokeActive(true);
      setCorridorWarning(false);
      setCurrentWaypointIndex(1);
      setCurrentStrokeInk([startPoint]);
      playSound('start');
      setStatusMessage(`Follow stroke ${stroke.order} to the end!`);
    } else {
      // Check if child touched near a future stroke
      const otherStrokes = letterData.strokes.slice(activeStrokeIndex + 1);
      const touchedFuture = otherStrokes.some(s => getDistance(pt, s.points[0]) <= 16);
      if (touchedFuture) {
        playSound('warning');
        setStatusMessage(`Start at circle ${stroke.order} first!`);
      } else {
        setStatusMessage(`Start inside circle ${stroke.order}!`);
      }
    }
  };

  // TOUCH MOVE: Preschool Corridor Snapping (+-20% to 22% generous tolerance envelope) & Completion Detection
  const handlePointerMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isTracing || !isStrokeActive || isCompleted || isDemonstrating) return;
    resetIdleTimer();
    const pt = getNormalizedPoint(e);
    if (!pt) return;

    const stroke = letterData.strokes[activeStrokeIndex];
    if (!stroke || stroke.points.length === 0) return;

    const pts = stroke.points;
    const targetIdx = Math.min(pts.length - 1, currentWaypointIndex);
    const prevIdx = Math.max(0, targetIdx - 1);
    const pA = pts[prevIdx];
    const pB = pts[targetIdx];

    // Compute orthogonal distance to active segment
    const { point: snappedPt, t, distance: distToSegment } = projectPointOntoSegment(pt, pA, pB);

    // Preschool Corridor Snapping: generous +-20% envelope (prevents false failures from finger tremors)
    if (distToSegment <= 20) {
      setCorridorWarning(false);

      // Append snapped point to smooth ink line
      setCurrentStrokeInk((prev) => {
        const last = prev[prev.length - 1];
        if (!last || getDistance(last, snappedPt) >= 1.5) {
          return [...prev, snappedPt];
        }
        return prev;
      });

      // Advance waypoint if finger is near or past next waypoint (generous radius <= 14)
      const distToNext = getDistance(pt, pB);
      if (t >= 0.70 || distToNext <= 14) {
        const nextIdx = currentWaypointIndex + 1;

        // Completion Detection: must have progressed through waypoints (at least penultimate waypoint reached)
        // and either stepped past the final index or finger is within 10% of stroke end
        const isNearFinalPoint = getDistance(pt, pts[pts.length - 1]) <= 10;
        const hasPassedIntermediateCheckpoints = currentWaypointIndex >= pts.length - 2;

        if (nextIdx >= pts.length || (hasPassedIntermediateCheckpoints && isNearFinalPoint)) {
          // STROKE COMPLETED!
          playSound('chime');
          const finalStrokeInk = [...currentStrokeInk, pts[pts.length - 1]];
          setCompletedStrokes((prev) => [...prev, finalStrokeInk]);
          setCurrentStrokeInk([]);
          setIsStrokeActive(false);
          setIsTracing(false);

          const nextStrokeIdx = activeStrokeIndex + 1;
          if (nextStrokeIdx >= letterData.strokes.length) {
            // ENTIRE LETTER COMPLETED!
            setIsCompleted(true);
            playSound('victory');
            confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
            setStatusMessage(`You wrote letter ${letterData.char}! Super Star! 🌟`);
            speakText(`Awesome! You traced letter ${letterData.char}! ${currentWord.word}!`);
          } else {
            setActiveStrokeIndex(nextStrokeIdx);
            setCurrentWaypointIndex(0);
            setStatusMessage(`Awesome! Now trace stroke ${letterData.strokes[nextStrokeIdx].order}!`);
          }
        } else {
          setCurrentWaypointIndex(nextIdx);
        }
      }
    } else {
      // Straying outside +-18% corridor: non-punitive gentle cue
      setCorridorWarning(true);
      setStatusMessage('Stay close to the dotted line!');
    }
  };

  // TOUCH END: If stroke was not completed, reset active ink gracefully
  const handlePointerUp = () => {
    if (!isTracing) return;
    setIsTracing(false);
    resetIdleTimer();

    if (isStrokeActive) {
      setIsStrokeActive(false);
      setCorridorWarning(false);
      setCurrentStrokeInk([]);
      setStatusMessage(`Try stroke ${letterData.strokes[activeStrokeIndex]?.order} again from circle ${letterData.strokes[activeStrokeIndex]?.order}!`);
    }
  };

  // AUTO-TRACE / DEMONSTRATE: Educational Demonstration Mode
  const handleDemonstrate = () => {
    if (isDemonstrating) return;
    handleResetLetter();
    setIsDemonstrating(true);
    setStatusMessage(`Watch carefully how letter ${letterData.char} is written! ✏️`);
    speakText(`Watch how to trace ${letterData.char}!`);

    let currentStrokeNum = 0;
    const allStrokes = letterData.strokes;

    const runStrokeDemo = (strokeIdx: number) => {
      if (strokeIdx >= allStrokes.length) {
        setIsDemonstrating(false);
        playSound('victory');
        setStatusMessage(`Now it's your turn to trace letter ${letterData.char}! 🌟`);
        speakText(`Now you try!`);
        return;
      }

      const stroke = allStrokes[strokeIdx];
      const pts = stroke.points;
      let step = 0;
      const totalSteps = 24; // ~1.2s per stroke

      const animateDemoStroke = () => {
        step++;
        const progress = step / totalSteps;
        const totalSegments = pts.length - 1;
        const scaled = progress * totalSegments;
        const segIdx = Math.min(totalSegments - 1, Math.floor(scaled));
        const segT = scaled - segIdx;

        const pA = pts[segIdx];
        const pB = pts[segIdx + 1] || pA;
        const currPt = {
          x: pA.x + (pB.x - pA.x) * segT,
          y: pA.y + (pB.y - pA.y) * segT
        };

        setCurrentStrokeInk(prev => [...prev, currPt]);

        if (step < totalSteps) {
          demoAnimationRef.current = requestAnimationFrame(animateDemoStroke);
        } else {
          // Finish stroke
          playSound('chime');
          setCompletedStrokes(prev => [...prev, pts]);
          setCurrentStrokeInk([]);
          setActiveStrokeIndex(strokeIdx + 1);

          setTimeout(() => {
            runStrokeDemo(strokeIdx + 1);
          }, 350);
        }
      };

      demoAnimationRef.current = requestAnimationFrame(animateDemoStroke);
    };

    setTimeout(() => {
      runStrokeDemo(0);
    }, 400);
  };

  // Letter navigation
  const currentIndex = alphabet.findIndex(l => l.toUpperCase() === selectedLetter.toUpperCase());
  const handlePrevLetter = () => {
    const prevIdx = (currentIndex - 1 + alphabet.length) % alphabet.length;
    onLetterChange(alphabet[prevIdx]);
  };
  const handleNextLetter = () => {
    const nextIdx = (currentIndex + 1) % alphabet.length;
    onLetterChange(alphabet[nextIdx]);
  };

  return (
    <div className="w-full flex flex-col items-center select-none space-y-1.5 sm:space-y-2">
      {/* 1. ERGONOMIC TOP TOOLBAR (PALM-PROOF: ABOVE DRAWING CANVAS) */}
      <div className="w-full flex flex-wrap items-center justify-between gap-1.5 p-1.5 sm:p-2 bg-amber-50/90 rounded-2xl border border-amber-200 shadow-xs">
        {/* Letter Navigator with Quick Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <Button
            size="icon"
            variant="outline"
            onClick={handlePrevLetter}
            title="Previous Letter"
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-white border-amber-200 text-amber-900 hover:bg-amber-100"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Button>

          {/* Current Letter Badge */}
          <div className="px-2.5 py-0.5 sm:py-1 bg-white rounded-xl border border-amber-300 shadow-xs flex items-center gap-1.5 font-school">
            <span className="text-lg sm:text-xl font-black text-emerald-600 leading-none">
              {caseMode === 'upper' ? selectedLetter.toUpperCase() : (selectedLetter.toLowerCase() === 'a' ? 'ɑ' : selectedLetter.toLowerCase())}
            </span>
            <span className="text-[10px] font-bold text-slate-400">/</span>
            <span className="text-[11px] font-bold text-slate-600">{letterData.phonemeSound}</span>
          </div>

          <Button
            size="icon"
            variant="outline"
            onClick={handleNextLetter}
            title="Next Letter"
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-white border-amber-200 text-amber-900 hover:bg-amber-100"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Case Toggle: Upper vs. Infant Lowercase */}
        <div className="flex items-center bg-white p-0.5 rounded-xl border border-amber-200 shadow-inner">
          <button
            onClick={() => setCaseMode('upper')}
            className={cn(
              "px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-black transition-all",
              caseMode === 'upper'
                ? "bg-emerald-500 text-white shadow-xs"
                : "text-slate-600 hover:text-emerald-700"
            )}
          >
            ABC
          </button>
          <button
            onClick={() => setCaseMode('lower')}
            className={cn(
              "px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-black font-school transition-all",
              caseMode === 'lower'
                ? "bg-emerald-500 text-white shadow-xs"
                : "text-slate-600 hover:text-emerald-700"
            )}
          >
            ɑbc
          </button>
        </div>

        {/* Audio, Demonstrate & Erase Action Buttons */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => speakText(`${selectedLetter}! ${currentWord.word}!`)}
            className="h-7 sm:h-8 px-2 rounded-xl bg-white border-amber-200 text-amber-900 hover:bg-amber-100 font-bold text-xs flex items-center gap-1"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Sound</span>
          </Button>

          <Button
            size="sm"
            onClick={handleDemonstrate}
            disabled={isDemonstrating}
            className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs flex items-center gap-1 shadow-xs active:scale-95"
          >
            <Wand2 className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{isDemonstrating ? 'Showing...' : 'Auto-Trace'}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleResetLetter}
            className="h-7 sm:h-8 px-2 rounded-xl bg-white border-slate-200 text-slate-600 hover:text-slate-900 font-bold text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Erase</span>
          </Button>
        </div>
      </div>

      {/* 2. THE HANDWRITING CANVAS SLATE (WOODEN CLASSROOM DESK FRAME) */}
      <div
        ref={containerRef}
        className="relative bg-amber-100/90 p-2 sm:p-3 rounded-3xl sm:rounded-[32px] border-4 sm:border-6 border-amber-800 shadow-xl flex flex-col items-center justify-center w-full max-w-[340px] sm:max-w-[370px] aspect-square select-none overflow-hidden"
      >
        {/* Wooden frame corner pegs */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-amber-900/40"></div>
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-amber-900/40"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-amber-900/40"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-amber-900/40"></div>

        {/* Tracing Drawing Surface */}
        <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden shadow-inner border border-amber-900/20 touch-none">
          {/* THREE-LINE CLASSROOM HANDWRITING GUIDE BACKGROUND */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
          >
            {/* Top Line: Sky Line (blue) */}
            <line x1="0" y1="20" x2="100" y2="20" stroke="#7dd3fc" strokeWidth="1" />
            <text x="2" y="18" fill="#0284c7" fontSize="3.5" fontWeight="bold">☁️ Sky</text>

            {/* Midline: Belt Line (amber dashed) */}
            <line x1="0" y1="50" x2="100" y2="50" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 3" />
            <text x="2" y="48" fill="#d97706" fontSize="3.5" fontWeight="bold">✈️ Belt</text>

            {/* Baseline: Ground / Grass Line (emerald solid) */}
            <line x1="0" y1="80" x2="100" y2="80" stroke="#22c55e" strokeWidth="1.5" />
            <text x="2" y="78" fill="#16a34a" fontSize="3.5" fontWeight="bold">🌸 Grass</text>

            {/* Descender: Worm Line (stone dotted) */}
            <line x1="0" y1="95" x2="100" y2="95" stroke="#a8a29e" strokeWidth="0.8" strokeDasharray="2 2" />
            <text x="2" y="93" fill="#78716c" fontSize="3" fontWeight="bold">🪱 Worm</text>
          </svg>

          {/* SVG STROKE GUIDELINES & NUMBERED DIRECTIONAL MARKERS */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <defs>
              {/* Arrow Marker for Directions */}
              <marker
                id="stroke-arrow"
                viewBox="0 0 6 6"
                refX="3"
                refY="3"
                markerWidth="3"
                markerHeight="3"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 6 3 L 0 6 z" fill="#0284c7" />
              </marker>
            </defs>

            {/* 1. Render all stroke guidelines */}
            {letterData.strokes.map((stroke, idx) => {
              const isStrokeFinished = completedStrokes.length > idx;
              const isCurrentActive = activeStrokeIndex === idx;

              if (isStrokeFinished) {
                // Completed stroke is rendered on Canvas
                return null;
              }

              return (
                <path
                  key={stroke.id}
                  d={stroke.guidePath}
                  fill="none"
                  stroke={isCurrentActive ? (corridorWarning ? '#f59e0b' : '#38bdf8') : '#e2e8f0'}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={isCurrentActive ? '4 5' : '2 4'}
                  className={cn(
                    "transition-colors duration-300",
                    isCurrentActive && "opacity-90",
                    !isCurrentActive && "opacity-40"
                  )}
                />
              );
            })}

            {/* 2. Numbered Directional Markers at starting waypoints */}
            {letterData.strokes.map((stroke, idx) => {
              const isStrokeFinished = completedStrokes.length > idx;
              const isCurrentActive = activeStrokeIndex === idx;
              const startPt = stroke.points[0];

              if (isStrokeFinished) {
                // Completed: green badge with checkmark
                return (
                  <g key={`badge-${stroke.id}`} transform={`translate(${startPt.x}, ${startPt.y})`}>
                    <circle r="4" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                    <text
                      textAnchor="middle"
                      dy="1.4"
                      fontSize="3.8"
                      fill="#ffffff"
                      fontWeight="bold"
                    >
                      ✓
                    </text>
                  </g>
                );
              }

              if (isCurrentActive) {
                // Active stroke starting badge: pulsing amber ring + directional pointer
                return (
                  <g key={`badge-${stroke.id}`} transform={`translate(${startPt.x}, ${startPt.y})`}>
                    {/* Animated Pulsing Ring */}
                    <circle
                      r="6.5"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.2"
                      className="animate-ping opacity-75"
                    />
                    {/* Badge Core */}
                    <circle
                      r="4.5"
                      fill="#fbbf24"
                      stroke="#b45309"
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      dy="1.5"
                      fontSize="4.2"
                      fill="#78350f"
                      fontWeight="900"
                    >
                      {stroke.startLabel}
                    </text>

                    {/* Directional Arrow Tip */}
                    {stroke.arrowAngle !== undefined && (
                      <g transform={`rotate(${stroke.arrowAngle}) translate(7.5, 0)`}>
                        <polygon points="0,-2 4,0 0,2" fill="#d97706" />
                      </g>
                    )}
                  </g>
                );
              }

              // Locked upcoming stroke starting badge
              return (
                <g key={`badge-${stroke.id}`} transform={`translate(${startPt.x}, ${startPt.y})`}>
                  <circle r="3.5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.8" />
                  <text
                    textAnchor="middle"
                    dy="1.3"
                    fontSize="3.5"
                    fill="#94a3b8"
                    fontWeight="bold"
                  >
                    {stroke.startLabel}
                  </text>
                </g>
              );
            })}

            {/* 3. Idle Helper Mascot Animation (Demonstrating path if idle > 2.5s) */}
            {showIdleMascot && !isCompleted && !isDemonstrating && (
              <g
                transform={`translate(${mascotPosition.x}, ${mascotPosition.y})`}
                className="transition-transform duration-75"
              >
                <circle r="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" className="animate-pulse" />
                <text textAnchor="middle" dy="1.4" fontSize="3.5">
                  ✏️
                </text>
              </g>
            )}
          </svg>

          {/* HIGH-DPI INTERACTIVE DRAWING CANVAS */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full touch-none cursor-crosshair select-none"
            style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          />
        </div>
      </div>

      {/* 3. STATUS BAR & MULTI-SENSORY FEEDBACK */}
      <div className="w-full max-w-sm flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center shadow-xs">
        <div className="flex items-center gap-1.5 text-left">
          <span className="text-base">{isCompleted ? '🏆' : corridorWarning ? '⚠️' : '🎯'}</span>
          <p className={cn(
            "text-xs font-black",
            corridorWarning ? "text-amber-700" : isCompleted ? "text-emerald-800" : "text-slate-700"
          )}>
            {statusMessage}
          </p>
        </div>

        {/* Stroke Progress Stars */}
        <div className="flex items-center gap-1 shrink-0">
          {letterData.strokes.map((s, idx) => (
            <span
              key={s.id}
              className={cn(
                "text-sm transition-transform",
                completedStrokes.length > idx ? "text-amber-500 scale-110" : "text-slate-300"
              )}
            >
              {completedStrokes.length > idx ? '★' : '☆'}
            </span>
          ))}
        </div>
      </div>

      {/* Quick Letter Carousel (Jump to any letter instantly, smooth touch-scrolling across all 26 letters in single horizontal row) */}
      <div 
        ref={letterTrayRef}
        className="w-full max-w-md overflow-x-auto overflow-y-hidden flex flex-row flex-nowrap items-center gap-2 py-1.5 px-2 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-inner no-scrollbar scrollbar-none scroll-smooth shrink-0"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {alphabet.map((letter) => {
          const isCurrent = letter.toUpperCase() === selectedLetter.toUpperCase();
          return (
            <button
              key={letter}
              ref={isCurrent ? activeLetterRef : null}
              onClick={() => onLetterChange(letter)}
              className={cn(
                "h-8 w-8 min-w-[32px] rounded-xl text-xs font-black shrink-0 transition-all font-school flex items-center justify-center border",
                isCurrent
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400 scale-110 z-10"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 active:scale-95"
              )}
            >
              {caseMode === 'upper' ? letter.toUpperCase() : (letter.toLowerCase() === 'a' ? 'ɑ' : letter.toLowerCase())}
            </button>
          );
        })}
      </div>
    </div>
  );
}
