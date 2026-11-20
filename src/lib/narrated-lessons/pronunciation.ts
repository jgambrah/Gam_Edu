import { createHash } from 'node:crypto';
import type { LessonSlide, PronunciationEntry } from './types';

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds the voice-only `ttsText` from on-screen `script` using `pronunciationGuide`
 * as the single source of truth.
 *
 * - Case-insensitive, whole-word replacement (`\b...\b`)
 * - Longest terms first to avoid partial substring collisions
 * - Falls back to `script` untouched when guide is empty
 */
export function buildTtsText(script: string, guide: readonly PronunciationEntry[]): string {
  if (!script || !guide || guide.length === 0) return script;

  const sorted = [...guide]
    .filter((entry) => entry.term.trim().length > 0 && entry.respelling.trim().length > 0)
    .sort((a, b) => b.term.length - a.term.length);

  let out = script;
  for (const entry of sorted) {
    const pattern = new RegExp(`\\b${escapeRegExp(entry.term.trim())}\\b`, 'gi');
    out = out.replace(pattern, entry.respelling.trim());
  }
  return out;
}

/**
 * Computes a deterministic content hash from `ttsText` (+ style instruction + voice)
 * so changing a respelling regenerates ONLY the affected slide(s).
 */
export function computeTtsCacheKey(
  ttsText: string,
  ttsStyleInstruction: string,
  voiceName = 'Kore',
): string {
  return createHash('sha256')
    .update(`${voiceName}\n${ttsStyleInstruction.trim()}\n${ttsText.trim()}`, 'utf8')
    .digest('hex')
    .slice(0, 16);
}

/**
 * Finds which `pronunciationGuide` terms appear in a given slide's narration script.
 */
export function findGuideTermsInScript(
  script: string,
  guide: readonly PronunciationEntry[],
): PronunciationEntry[] {
  if (!script) return [];
  return guide.filter((entry) => {
    const pattern = new RegExp(`\\b${escapeRegExp(entry.term.trim())}\\b`, 'i');
    return pattern.test(script);
  });
}

/**
 * Curated watch-list of Ghanaian place/cultural terms that must be registered in
 * `pronunciationGuide` whenever they appear in any slide's narration script.
 */
export const KNOWN_GHANAIAN_TERMS_WATCHLIST: readonly string[] = [
  'Bosomtwe',
  'Akosombo',
  'Harmattan',
  'Volta',
  'kenkey',
  'Kumasi',
  'Accra',
  'Tamale',
  'Takoradi',
  'Sekondi',
  'Koforidua',
  'Sunyani',
  'Ho',
  'Bolgatanga',
  'Wa',
  'Cape Coast',
  'Asante',
  'Ashanti',
  'Okomfo',
  'Anokye',
  'Adinkra',
  'Kente',
  'fufu',
  'banku',
  'waakye',
];

export interface PronunciationValidationResult {
  ok: boolean;
  errors: string[];
}

/**
 * Build-time validation:
 * 1. Fails loudly if any watched Ghanaian term appears in a slide's `narration.script`
 *    without an entry in `pronunciationGuide`.
 * 2. Fails loudly if any `pronunciationGuide` entry is missing a non-empty `respelling`.
 * 3. Fails loudly if any `pronunciationGuide` entry lists a slide ID where the term
 *    does not actually appear in `narration.script` (or omits a slide where it does).
 * 4. Fails loudly if any voice-only respelling leaks into on-screen `narration.script`
 *    or `onScreenText`.
 */
export function validatePronunciationCoverage(
  slides: readonly LessonSlide[],
  guide: readonly PronunciationEntry[],
  extraWatchedTerms: readonly string[] = [],
): PronunciationValidationResult {
  const errors: string[] = [];
  const guideTermsLower = new Set(guide.map((g) => g.term.trim().toLowerCase()));
  const watchedTerms = [...new Set([...KNOWN_GHANAIAN_TERMS_WATCHLIST, ...extraWatchedTerms])];

  // 1. Check for missing respellings
  for (const entry of guide) {
    if (!entry.term?.trim() || !entry.respelling?.trim()) {
      errors.push(`pronunciationGuide entry "${entry.term || '(empty)'}" is missing a non-empty respelling.`);
    }
  }

  // 2. Check every slide script for unwatched/missing guide terms & leaked respellings
  const actualSlidesByTerm = new Map<string, string[]>();
  for (const entry of guide) {
    actualSlidesByTerm.set(entry.term.trim().toLowerCase(), []);
  }

  for (const slide of slides) {
    const script = slide.narration?.script ?? '';

    for (const term of watchedTerms) {
      const pattern = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i');
      if (pattern.test(script) && !guideTermsLower.has(term.toLowerCase())) {
        errors.push(
          `Slide ${slide.id} narration.script uses "${term}", which is MISSING from pronunciationGuide.`,
        );
      }
    }

    for (const entry of guide) {
      const termPattern = new RegExp(`\\b${escapeRegExp(entry.term.trim())}\\b`, 'i');
      if (termPattern.test(script)) {
        actualSlidesByTerm.get(entry.term.trim().toLowerCase())?.push(slide.id);
      }

      // Never allow voice-only respellings to leak on screen
      const resp = entry.respelling.trim();
      if (resp.toLowerCase() !== entry.term.trim().toLowerCase()) {
        if (script.includes(resp)) {
          errors.push(`Slide ${slide.id} narration.script contains voice-only respelling "${resp}".`);
        }
        for (const line of slide.onScreenText ?? []) {
          if (line.includes(resp)) {
            errors.push(`Slide ${slide.id} onScreenText contains voice-only respelling "${resp}".`);
          }
        }
      }
    }
  }

  // 3. Verify slide lists in pronunciationGuide match actual narration usage
  for (const entry of guide) {
    const actual = actualSlidesByTerm.get(entry.term.trim().toLowerCase()) ?? [];
    for (const sid of actual) {
      if (!entry.slides.includes(sid)) {
        errors.push(
          `pronunciationGuide term "${entry.term}" appears in slide ${sid} narration.script but "${sid}" is not listed in its slides array.`,
        );
      }
    }
  }

  return { ok: errors.length === 0, errors };
}

export function assertPronunciationCoverage(
  slides: readonly LessonSlide[],
  guide: readonly PronunciationEntry[],
  extraWatchedTerms: readonly string[] = [],
): void {
  const result = validatePronunciationCoverage(slides, guide, extraWatchedTerms);
  if (!result.ok) {
    throw new Error(
      `Pronunciation coverage check FAILED (${result.errors.length} issue(s)):\n - ${result.errors.join('\n - ')}`,
    );
  }
}
