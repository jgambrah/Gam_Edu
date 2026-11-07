/**
 * A soft, generative background piano — synthesised in the browser (Web Audio), so there are no audio files to
 * download, nothing to license, and it works offline. Off by default; quiet; ducks while the narrator speaks.
 *
 * `nextPhrase()` is pure and tested: it walks a gentle C-major-pentatonic lullaby so it never sounds jarring
 * (no wrong notes are possible in a pentatonic scale) and never repeats exactly.
 */
const PENTATONIC = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]; // C D E G A C D E
export interface Note { freq: number; atMs: number; lengthMs: number; velocity: number }

/** Deterministic pseudo-random so tests are stable. */
function rng(seed: number) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); }

export function nextPhrase(seed: number, previousIndex = 3): { notes: Note[]; lastIndex: number; lengthMs: number } {
  const r = rng(seed);
  const notes: Note[] = [];
  let idx = previousIndex, t = 0;
  const count = 4 + Math.floor(r() * 3); // 4–6 notes
  for (let i = 0; i < count; i++) {
    const step = [-2, -1, -1, 0, 1, 1, 2][Math.floor(r() * 7)];           // mostly stepwise movement
    idx = Math.min(PENTATONIC.length - 1, Math.max(0, idx + step));
    const length = 900 + Math.floor(r() * 4) * 250;                          // slow: ~0.9–1.65 s per note
    notes.push({ freq: PENTATONIC[idx], atMs: Math.round(t), lengthMs: length, velocity: 0.55 + r() * 0.35 });
    t += length * 0.85;
  }
  return { notes, lastIndex: idx, lengthMs: Math.round(t + 1200) }; // a breath between phrases
}

export const MAX_GAIN = 0.12;           // hard ceiling, far below the narration
export const DEFAULT_VOLUME = 0.35;     // 0..1 of MAX_GAIN
export const DUCK_FACTOR = 0.35;        // while the narrator speaks

export class Piano {
  private ctx?: AudioContext;
  private master?: GainNode;
  private timer?: ReturnType<typeof setTimeout>;
  private playing = false;
  private volume = DEFAULT_VOLUME;
  private ducked = false;
  private seed = 7;
  private idx = 3;
  constructor(private makeContext: () => AudioContext | undefined = () => {
    const C = typeof window !== 'undefined' ? (window.AudioContext || (window as any).webkitAudioContext) : undefined;
    return C ? new C() : undefined;
  }) {}

  get supported(): boolean { return typeof window !== 'undefined' && !!(window.AudioContext || (window as any).webkitAudioContext); }
  get isPlaying() { return this.playing; }

  start(): boolean {
    if (this.playing) return true;
    this.ctx = this.ctx ?? this.makeContext();
    if (!this.ctx) return false;
    this.ctx.resume?.();
    if (!this.master) { this.master = this.ctx.createGain(); this.master.connect(this.ctx.destination); }
    this.playing = true;
    this.applyGain(0.6);
    this.schedule();
    return true;
  }
  stop(): void {
    this.playing = false;
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
    if (this.master && this.ctx) { this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4); }
  }
  setVolume(v: number) { this.volume = Math.min(1, Math.max(0, v)); this.applyGain(0.3); }
  duck(on: boolean) { this.ducked = on; this.applyGain(0.4); }
  dispose() { this.stop(); this.ctx?.close?.(); this.ctx = undefined; this.master = undefined; }

  /** The gain the master is aiming for (exposed for tests). */
  get targetGain() { return MAX_GAIN * this.volume * (this.ducked ? DUCK_FACTOR : 1); }
  private applyGain(seconds: number) { if (this.master && this.ctx) this.master.gain.setTargetAtTime(this.playing ? this.targetGain : 0, this.ctx.currentTime, seconds); }

  private schedule() {
    if (!this.playing || !this.ctx || !this.master) return;
    const phrase = nextPhrase(this.seed++, this.idx);
    this.idx = phrase.lastIndex;
    const t0 = this.ctx.currentTime + 0.05;
    for (const n of phrase.notes) this.playNote(n, t0 + n.atMs / 1000);
    this.timer = setTimeout(() => this.schedule(), phrase.lengthMs);
  }
  private playNote(n: Note, when: number) {
    const ctx = this.ctx!, out = this.master!;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(n.velocity, when + 0.02);               // soft attack
    g.gain.exponentialRampToValueAtTime(0.0001, when + n.lengthMs / 1000 + 0.6); // long, gentle decay
    g.connect(out);
    for (const [mult, level] of [[1, 1], [2, 0.25], [3, 0.08]] as const) {        // fundamental + two quiet partials ≈ piano-ish
      const o = ctx.createOscillator(); const og = ctx.createGain();
      o.type = 'sine'; o.frequency.value = n.freq * mult; og.gain.value = level;
      o.connect(og); og.connect(g);
      o.start(when); o.stop(when + n.lengthMs / 1000 + 0.7);
    }
  }
}
