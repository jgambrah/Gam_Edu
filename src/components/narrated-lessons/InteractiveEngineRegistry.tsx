'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { AlertCircle, WifiOff } from 'lucide-react';
import type { LessonSlide, NarratedLesson } from '@/lib/narrated-lessons/types';
import {
  normalizeSlideInteractives,
  SUPPORTED_INTERACTIVE_ENGINES,
  validateSlideInteractiveConfig,
  type SlideInteractiveConfig,
} from '@/lib/narrated-lessons/interactive-schema';

const RegistryLoading = () => (
  <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-500">
    Loading interactive engine...
  </div>
);

// Statically analyzable next/dynamic imports (zero upfront bundle cost on non-interactive slides)
const LazyInlineCodePlayground = dynamic(
  () => import('./InlineCodePlayground').then((m) => m.InlineCodePlayground),
  { ssr: false, loading: RegistryLoading },
);

const LazyBooleanCircuitLab = dynamic(
  () => import('./BooleanCircuitLab').then((m) => m.BooleanCircuitLab),
  { ssr: false, loading: RegistryLoading },
);

const LazyRuleExplorerEngine = dynamic(
  () => import('./RuleExplorerEngine').then((m) => m.RuleExplorerEngine),
  { ssr: false, loading: RegistryLoading },
);

const LazyGraphSliderEngine = dynamic(
  () => import('./GraphSliderEngine').then((m) => m.GraphSliderEngine),
  { ssr: false, loading: RegistryLoading },
);

export interface InteractiveEngineRegistryProps {
  lesson: NarratedLesson;
  slide: LessonSlide;
  lowDataMode?: boolean;
}

function InteractiveFallbackCard({
  title,
  message,
  lowData,
  onEnableInteractive,
}: {
  title: string;
  message: string;
  lowData?: boolean;
  onEnableInteractive?: () => void;
}) {
  return (
    <div
      role="region"
      aria-label={title}
      data-interactive-fallback="true"
      className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700"
    >
      <div className="flex items-start gap-2.5">
        {lowData ? (
          <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
        ) : (
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        )}
        <div className="min-w-0 flex-1">
          <p className="font-bold text-slate-900">{title}</p>
          <p className="mt-1 leading-relaxed">{message}</p>
          {lowData && onEnableInteractive && (
            <button
              type="button"
              onClick={onEnableInteractive}
              className="mt-2.5 inline-flex items-center rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              Load interactive activity anyway
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InteractiveItemRenderer({
  rawConfig,
  lesson,
  slideId,
  lowDataMode,
}: {
  rawConfig: unknown;
  lesson: NarratedLesson;
  slideId: string;
  lowDataMode: boolean;
}) {
  const [overrideLowData, setOverrideLowData] = useState(false);

  const validation = validateSlideInteractiveConfig(rawConfig);
  if (!validation.ok || !validation.config) {
    const rawObj =
      rawConfig && typeof rawConfig === 'object' ? (rawConfig as Record<string, unknown>) : null;
    const fallbackTitle =
      typeof rawObj?.title === 'string' && rawObj.title.trim()
        ? rawObj.title
        : 'Interactive Activity Unavailable';
    const fallbackMessage =
      typeof rawObj?.fallbackText === 'string' && rawObj.fallbackText.trim()
        ? rawObj.fallbackText
        : 'This interactive activity cannot be loaded on this version of the lesson player. Continue with the slide explanation above.';
    return <InteractiveFallbackCard title={fallbackTitle} message={fallbackMessage} />;
  }

  const config: SlideInteractiveConfig = validation.config;
  const meta = SUPPORTED_INTERACTIVE_ENGINES[config.engine];

  if (!meta || !meta.implemented) {
    return (
      <InteractiveFallbackCard
        title={config.title}
        message={config.fallbackText}
      />
    );
  }

  if (lowDataMode && !overrideLowData) {
    return (
      <InteractiveFallbackCard
        title={`${config.title} (Low-Data Summary)`}
        message={config.fallbackText}
        lowData
        onEnableInteractive={() => setOverrideLowData(true)}
      />
    );
  }

  switch (config.engine) {
    case 'rule-explorer':
      return <LazyRuleExplorerEngine config={config} />;
    case 'graph-slider':
      return <LazyGraphSliderEngine config={config} />;
    case 'code-playground':
      return (
        <LazyInlineCodePlayground
          lesson={lesson}
          slideId={slideId}
          interactiveConfig={config}
        />
      );
    case 'construction-lab':
      return <LazyBooleanCircuitLab lessonId={lesson.lessonId} slideId={slideId} />;
    default:
      return <InteractiveFallbackCard title={config.title} message={config.fallbackText} />;
  }
}

/**
 * Central Reusable Interactive Engine Registry (Step 3).
 *
 * Resolves `slide.interactive` JSON declarations to lazy-loaded reusable engines.
 * - Backward compatible: renders null when `slide.interactive` is absent.
 * - Safe: validates every config via `validateSlideInteractiveConfig` before mounting.
 * - Graceful: falls back cleanly on unknown engines, unsupported schema versions,
 *   planned engines, or Low-Data Mode without crashing narration or slide navigation.
 */
export function InteractiveEngineRegistry({
  lesson,
  slide,
  lowDataMode = false,
}: InteractiveEngineRegistryProps) {
  const items = normalizeSlideInteractives(slide.interactive);
  if (items.length === 0) return null;

  return (
    <div data-interactive-registry="true" className="space-y-3">
      {items.map((item, idx) => {
        const key =
          item && typeof item === 'object' && typeof (item as { id?: unknown }).id === 'string'
            ? (item as { id: string }).id
            : `${slide.id}-interactive-${idx}`;
        return (
          <InteractiveItemRenderer
            key={key}
            rawConfig={item}
            lesson={lesson}
            slideId={slide.id}
            lowDataMode={lowDataMode}
          />
        );
      })}
    </div>
  );
}
