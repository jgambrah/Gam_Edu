import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { nextPhrase, Piano, MAX_GAIN, DUCK_FACTOR, DEFAULT_VOLUME, TUNE_PRESETS } from './piano';

const PENTA = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];

describe('nextPhrase (the melody)', () => {
  it('only ever uses notes of the pentatonic scale — no wrong notes are possible', () => {
    for (let seed = 0; seed < 200; seed++) nextPhrase(seed).notes.forEach((n) => expect(PENTA).toContain(n.freq));
  });
  it('is slow, gentle and stepwise', () => {
    for (let seed = 0; seed < 100; seed++) {
      const { notes } = nextPhrase(seed);
      expect(notes.length).toBeGreaterThanOrEqual(4); expect(notes.length).toBeLessThanOrEqual(6);
      notes.forEach((n) => { expect(n.lengthMs).toBeGreaterThanOrEqual(900); expect(n.velocity).toBeLessThanOrEqual(0.9); });
      for (let i = 1; i < notes.length; i++) expect(Math.abs(PENTA.indexOf(notes[i].freq) - PENTA.indexOf(notes[i - 1].freq))).toBeLessThanOrEqual(2);
    }
  });
  it('is deterministic per seed but varies between seeds', () => {
    expect(nextPhrase(5)).toEqual(nextPhrase(5));
    expect(JSON.stringify(nextPhrase(5))).not.toBe(JSON.stringify(nextPhrase(6)));
  });
  it('continues from where the last phrase ended', () => expect(PENTA).toContain(nextPhrase(1, 7).notes[0].freq));
});

// A tiny fake Web Audio graph that records what happens.
function fakeAudio() {
  const made = { osc: 0, gains: [] as any[], started: 0, closed: false, resumed: false };
  const param = () => ({ value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), setTargetAtTime: vi.fn() });
  const ctx: any = {
    currentTime: 0, destination: {}, resume: () => { made.resumed = true; }, close: () => { made.closed = true; },
    createGain: () => { const g = { gain: param(), connect: vi.fn() }; made.gains.push(g); return g; },
    createOscillator: () => { made.osc++; return { type: '', frequency: { value: 0 }, connect: vi.fn(), start: () => { made.started++; }, stop: vi.fn() }; },
  };
  return { ctx, made };
}

describe('Piano', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('is quiet by design: its loudest possible gain is far below full volume', () => {
    const { ctx } = fakeAudio(); const p = new Piano(() => ctx);
    p.setVolume(1);
    expect(p.targetGain).toBeLessThanOrEqual(MAX_GAIN);
    expect(MAX_GAIN).toBeLessThan(0.2);
  });
  it('starts playing notes, and keeps scheduling phrases until stopped', () => {
    const { ctx, made } = fakeAudio(); const p = new Piano(() => ctx);
    expect(p.start()).toBe(true);
    expect(made.resumed).toBe(true);
    const first = made.osc; expect(first).toBeGreaterThan(0);
    vi.advanceTimersByTime(12000);
    expect(made.osc).toBeGreaterThan(first);
    p.stop(); const stopped = made.osc;
    vi.advanceTimersByTime(30000);
    expect(made.osc).toBe(stopped);
    expect(p.isPlaying).toBe(false);
  });
  it('ducks under the narrator and restores afterwards', () => {
    const { ctx } = fakeAudio(); const p = new Piano(() => ctx); p.start();
    const normal = p.targetGain; p.duck(true);
    expect(p.targetGain).toBeCloseTo(normal * DUCK_FACTOR); p.duck(false);
    expect(p.targetGain).toBeCloseTo(normal);
    expect(normal).toBeCloseTo(MAX_GAIN * DEFAULT_VOLUME);
  });
  it('reports failure without audio support instead of throwing', () => {
    expect(new Piano(() => undefined).start()).toBe(false);
  });
  it('switches between the 5 background tunes while playing', () => {
    const { ctx, made } = fakeAudio(); const p = new Piano(() => ctx); p.start();
    expect(TUNE_PRESETS.length).toBeGreaterThanOrEqual(5);
    for (const preset of TUNE_PRESETS) {
      p.setTune(preset.id);
      expect(p.currentTune).toBe(preset.id);
    }
    expect(made.osc).toBeGreaterThan(0);
    p.dispose();
  });
  it('clamps volume and disposes the audio context', () => {
    const { ctx, made } = fakeAudio(); const p = new Piano(() => ctx); p.start();
    p.setVolume(5); expect(p.targetGain).toBeLessThanOrEqual(MAX_GAIN);
    p.setVolume(-1); expect(p.targetGain).toBe(0);
    p.dispose(); expect(made.closed).toBe(true);
  });
});
