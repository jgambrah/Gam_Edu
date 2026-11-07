import { describe, it, expect } from 'vitest';
import { MODES, MODE_ORDER, defaultModeForTier, defaultSpeedForTier, isReadingMode } from './reading-modes';

describe('reading modes', () => {
  it('there are exactly three, in a friendly order', () => expect(MODE_ORDER).toEqual(['listen', 'follow', 'solo']));
  it('Read to me narrates and turns pages itself; Read with me narrates but waits; I read stays quiet', () => {
    expect(MODES.listen).toMatchObject({ autoNarrate: true, autoAdvance: true, highlight: true });
    expect(MODES.follow).toMatchObject({ autoNarrate: true, autoAdvance: false, highlight: true });
    expect(MODES.solo).toMatchObject({ autoNarrate: false, autoAdvance: false });
  });
  it('every mode lets a child tap a word for help', () => MODE_ORDER.forEach((m) => expect(MODES[m].tapWords).toBe(true)));
  it('younger children start with Read to me, and slower speech', () => {
    expect(defaultModeForTier('ages2-3')).toBe('listen');
    expect(defaultModeForTier('ages4-5')).toBe('follow');
    expect(defaultModeForTier(undefined)).toBe('follow');
    expect(defaultSpeedForTier('ages2-3')).toBe('slow');
    expect(defaultSpeedForTier('ages5-6')).toBe('normal');
  });
  it('validates stored values', () => { expect(isReadingMode('solo')).toBe(true); expect(isReadingMode('x')).toBe(false); });
});
