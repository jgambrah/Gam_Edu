/**
 * The three reading modes (Story Spark 2.0 spec §3).
 *  listen — "Read to me": the story reads itself, pages turn on their own, words light up. For the youngest.
 *  follow — "Read with me": one page at a time; the voice reads it, then waits; the child taps ▶ / words. Builds word recognition.
 *  solo   — "I read": no narration unless the child asks (tap a word to hear it, ▶ to hear a page). For confident readers.
 */
export type ReadingMode = 'listen' | 'follow' | 'solo';

export interface ModeConfig {
  id: ReadingMode;
  label: string;
  hint: string;
  autoNarrate: boolean;   // narrate a page as soon as it appears
  autoAdvance: boolean;   // turn to the next page when narration ends
  highlight: boolean;     // light up the spoken word
  tapWords: boolean;      // tapping a word speaks it
  largeText: boolean;
}

export const MODES: Record<ReadingMode, ModeConfig> = {
  listen: { id: 'listen', label: 'Read to me', hint: 'The story reads itself and turns the pages.', autoNarrate: true, autoAdvance: true, highlight: true, tapWords: true, largeText: true },
  follow: { id: 'follow', label: 'Read with me', hint: 'I read a page, then you tap to go on. Tap any word to hear it.', autoNarrate: true, autoAdvance: false, highlight: true, tapWords: true, largeText: true },
  solo: { id: 'solo', label: 'I read', hint: 'You read by yourself. Tap a word or ▶ if you want help.', autoNarrate: false, autoAdvance: false, highlight: false, tapWords: true, largeText: false },
};
export const MODE_ORDER: ReadingMode[] = ['listen', 'follow', 'solo'];

/** Sensible starting mode for each age band used in Nursery Bloom. */
export function defaultModeForTier(tier: string | undefined): ReadingMode {
  switch (tier) {
    case 'ages2-3': return 'listen';
    case 'ages3-4': return 'listen';
    case 'ages4-5': return 'follow';
    case 'ages5-6': return 'follow';
    default: return 'follow';
  }
}
export const isReadingMode = (v: unknown): v is ReadingMode => v === 'listen' || v === 'follow' || v === 'solo';

/** Speech speed choices (SpeechSynthesis `rate`); slower for younger children. */
export const SPEEDS = [{ id: 'slow', label: 'Slow', rate: 0.7 }, { id: 'normal', label: 'Normal', rate: 0.9 }, { id: 'quick', label: 'Quick', rate: 1.1 }] as const;
export type SpeedId = typeof SPEEDS[number]['id'];
export function defaultSpeedForTier(tier: string | undefined): SpeedId { return tier === 'ages2-3' || tier === 'ages3-4' ? 'slow' : 'normal'; }
