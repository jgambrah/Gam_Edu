/**
 * A multi-tune generative background soundtrack — synthesised in the browser (Web Audio), so there are no audio files to
 * download, nothing to license, and it works 100% offline. Quiet enough not to overpower narration, with user-adjustable
 * volume and 5 distinct musical moods, and ducks automatically while the narrator speaks.
 *
 * `nextPhrase()` is pure and tested: it walks a gentle pentatonic scale so no wrong notes are possible
 * and never repeats exactly.
 */
const PENTATONIC = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]; // C D E G A C D E

export type TuneId = 'piano' | 'kora' | 'kalimba' | 'lullaby' | 'highlife';

export interface TunePreset {
  id: TuneId;
  label: string;
  description: string;
  scales: number[];
  tempoFactor: number;
  breathMs: number;
  attackSec: number;
  decayExtraSec: number;
  partials: ReadonlyArray< readonly [number, number, OscillatorType] >;
  chordRootRatio?: number;
}

export const TUNE_PRESETS: readonly TunePreset[] = [
  {
    id: 'piano',
    label: '🎹 Warm Piano',
    description: 'Gentle C-major pentatonic acoustic piano',
    scales: PENTATONIC,
    tempoFactor: 1.0,
    breathMs: 1100,
    attackSec: 0.025,
    decayExtraSec: 0.75,
    partials: [[1, 1, 'sine'], [2, 0.32, 'triangle'], [3, 0.12, 'sine'], [0.5, 0.22, 'sine']],
    chordRootRatio: 0.5,
  },
  {
    id: 'kora',
    label: '🪕 Savannah Kora',
    description: 'Plucked West African harp-lute melody',
    scales: [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99], // D major pentatonic
    tempoFactor: 0.68,
    breathMs: 650,
    attackSec: 0.012,
    decayExtraSec: 0.45,
    partials: [[1, 1, 'triangle'], [2, 0.45, 'sine'], [3, 0.2, 'sine'], [4, 0.08, 'sine']],
    chordRootRatio: 0.5,
  },
  {
    id: 'kalimba',
    label: '✨ Starlight Kalimba',
    description: 'Sparkling thumb-piano music box',
    scales: [392.0, 440.0, 493.88, 587.33, 659.25, 783.99, 880.0, 987.77], // G major pentatonic higher register
    tempoFactor: 0.78,
    breathMs: 800,
    attackSec: 0.01,
    decayExtraSec: 0.55,
    partials: [[1, 1, 'sine'], [2.98, 0.28, 'sine'], [5.95, 0.09, 'sine']],
  },
  {
    id: 'lullaby',
    label: '🌙 Moonlight Lullaby',
    description: 'Slow, warm bedtime pad & soft chimes',
    scales: [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33], // Warm A minor / C major pentatonic
    tempoFactor: 1.35,
    breathMs: 1400,
    attackSec: 0.12,
    decayExtraSec: 1.2,
    partials: [[1, 1, 'sine'], [0.5, 0.38, 'sine'], [2, 0.18, 'sine']],
    chordRootRatio: 0.5,
  },
  {
    id: 'highlife',
    label: '🌞 Sunny Highlife',
    description: 'Cheerful Ghanaian palm-wine guitar groove',
    scales: [329.63, 369.99, 415.3, 493.88, 554.37, 659.25, 739.99, 830.61], // E major pentatonic
    tempoFactor: 0.62,
    breathMs: 550,
    attackSec: 0.015,
    decayExtraSec: 0.4,
    partials: [[1, 1, 'triangle'], [2, 0.38, 'triangle'], [3, 0.14, 'sine'], [0.5, 0.25, 'sine']],
    chordRootRatio: 0.5,
  },
] as const;

export interface Note { freq: number; atMs: number; lengthMs: number; velocity: number }

/** Deterministic pseudo-random so tests are stable. */
function rng(seed: number) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); }

export function nextPhrase(seed: number, previousIndex = 3, scale: readonly number[] = PENTATONIC, tempoFactor = 1.0, breathMs = 1200): { notes: Note[]; lastIndex: number; lengthMs: number } {
  const r = rng(seed);
  const notes: Note[] = [];
  let idx = Math.min(scale.length - 1, Math.max(0, previousIndex)), t = 0;
  const count = 4 + Math.floor(r() * 3); // 4–6 notes
  for (let i = 0; i < count; i++) {
    const step = [-2, -1, -1, 0, 1, 1, 2][Math.floor(r() * 7)];           // mostly stepwise movement
    idx = Math.min(scale.length - 1, Math.max(0, idx + step));
    const baseLength = 900 + Math.floor(r() * 4) * 250;                      // slow: ~0.9–1.65 s per note
    const length = Math.round(baseLength * tempoFactor);
    notes.push({ freq: scale[idx], atMs: Math.round(t), lengthMs: length, velocity: 0.55 + r() * 0.35 });
    t += length * 0.85;
  }
  return { notes, lastIndex: idx, lengthMs: Math.round(t + breathMs) }; // a breath between phrases
}

export const MAX_GAIN = 0.19;           // rich, clearly audible ceiling while remaining below spoken narration
export const DEFAULT_VOLUME = 0.75;     // 0..1 of MAX_GAIN (75% default so it sounds warm and clear out of the box)
export const DUCK_FACTOR = 0.45;        // while the narrator speaks

export class Piano {
  private ctx?: AudioContext;
  private master?: GainNode;
  private timer?: ReturnType<typeof setTimeout>;
  private playing = false;
  private volume = DEFAULT_VOLUME;
  private ducked = false;
  private seed = 7;
  private idx = 3;
  private tuneId: TuneId = 'piano';

  constructor(private makeContext: () => AudioContext | undefined = () => {
    const C = typeof window !== 'undefined' ? (window.AudioContext || (window as any).webkitAudioContext) : undefined;
    return C ? new C() : undefined;
  }) {}

  get supported(): boolean { return typeof window !== 'undefined' && !!(window.AudioContext || (window as any).webkitAudioContext); }
  get isPlaying() { return this.playing; }
  get currentTune(): TuneId { return this.tuneId; }
  get currentVolume(): number { return this.volume; }

  private get preset(): TunePreset {
    return TUNE_PRESETS.find((t) => t.id === this.tuneId) ?? TUNE_PRESETS[0];
  }

  start(): boolean {
    if (this.playing) return true;
    this.ctx = this.ctx ?? this.makeContext();
    if (!this.ctx) return false;
    this.ctx.resume?.();
    if (!this.master) { this.master = this.ctx.createGain(); this.master.connect(this.ctx.destination); }
    this.playing = true;
    this.applyGain(0.4);
    this.schedule();
    return true;
  }
  stop(): void {
    this.playing = false;
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
    if (this.master && this.ctx) { this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4); }
  }
  setVolume(v: number) { this.volume = Math.min(1, Math.max(0, v)); this.applyGain(0.18); }
  setTune(tune: TuneId) {
    if (this.tuneId === tune) return;
    this.tuneId = tune;
    if (this.playing) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = undefined;
      this.schedule();
    }
  }
  duck(on: boolean) { this.ducked = on; this.applyGain(0.35); }
  dispose() { this.stop(); this.ctx?.close?.(); this.ctx = undefined; this.master = undefined; }

  /** The gain the master is aiming for (exposed for tests). */
  get targetGain() { return MAX_GAIN * this.volume * (this.ducked ? DUCK_FACTOR : 1); }
  private applyGain(seconds: number) { if (this.master && this.ctx) this.master.gain.setTargetAtTime(this.playing ? this.targetGain : 0, this.ctx.currentTime, seconds); }

  private schedule() {
    if (!this.playing || !this.ctx || !this.master) return;
    const p = this.preset;
    const phrase = nextPhrase(this.seed++, this.idx, p.scales, p.tempoFactor, p.breathMs);
    this.idx = phrase.lastIndex;
    const t0 = this.ctx.currentTime + 0.05;
    phrase.notes.forEach((n, i) => {
      this.playNote(n, t0 + n.atMs / 1000, i === 0);
    });
    this.timer = setTimeout(() => this.schedule(), phrase.lengthMs);
  }
  private playNote(n: Note, when: number, isPhraseStart = false) {
    const ctx = this.ctx!, out = this.master!, p = this.preset;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(n.velocity, when + p.attackSec);
    g.gain.exponentialRampToValueAtTime(0.0001, when + n.lengthMs / 1000 + p.decayExtraSec);
    g.connect(out);
    for (const [mult, level, wave] of p.partials) {
      const o = ctx.createOscillator(); const og = ctx.createGain();
      o.type = wave; o.frequency.value = n.freq * mult; og.gain.value = level;
      o.connect(og); og.connect(g);
      o.start(when); o.stop(when + n.lengthMs / 1000 + p.decayExtraSec + 0.1);
    }
    // Add a warm bass root note on the first beat of each phrase for fullness
    if (isPhraseStart && p.chordRootRatio) {
      const bg = ctx.createGain();
      bg.gain.setValueAtTime(0.0001, when);
      bg.gain.exponentialRampToValueAtTime(n.velocity * 0.45, when + 0.05);
      bg.gain.exponentialRampToValueAtTime(0.0001, when + (n.lengthMs / 1000) * 1.6 + p.decayExtraSec);
      bg.connect(out);
      const bo = ctx.createOscillator();
      bo.type = 'sine';
      bo.frequency.value = n.freq * p.chordRootRatio;
      bo.connect(bg);
      bo.start(when);
      bo.stop(when + (n.lengthMs / 1000) * 1.6 + p.decayExtraSec + 0.15);
    }
  }
}
