import { estimateWordTimings, tokenizeWords, wordIndexAtChar } from './reader-text';

/** Pick the friendliest available English voice; prefer natural/neural voices, then British/Ghanaian/Nigerian English, then any English. */
export function pickVoice(voices: SpeechSynthesisVoice[], preferredName?: string): SpeechSynthesisVoice | null {
  if (!voices.length) return null;
  if (preferredName) { const p = voices.find((v) => v.name === preferredName); if (p) return p; }
  const en = voices.filter((v) => /^en([-_]|$)/i.test(v.lang));
  const pool = en.length ? en : voices;
  const score = (v: SpeechSynthesisVoice) =>
    (/natural|neural|online|google|enhanced|premium/i.test(v.name) ? 4 : 0) +
    (/^en[-_](GH|NG)/i.test(v.lang) ? 3 : /^en[-_]GB/i.test(v.lang) ? 2 : /^en[-_]/i.test(v.lang) ? 1 : 0) +
    (/female|samantha|kate|serena|google uk english female|zira|aria|jenny/i.test(v.name) ? 1 : 0);
  return [...pool].sort((a, b) => score(b) - score(a))[0] ?? null;
}

export interface SpeakOptions {
  rate: number;
  pitch?: number;
  voice?: SpeechSynthesisVoice | null;
  /** Called with the index of the word now being spoken. */
  onWord?: (wordIndex: number) => void;
  onEnd?: () => void;
  onError?: () => void;
}

/**
 * Narrates text through the browser's speech engine and reports the spoken word.
 * Uses real `boundary` events when the engine sends them; otherwise falls back to estimated timing so the
 * highlight still moves (some mobile browsers never fire `boundary`). Every call cancels the previous one.
 */
export class Narrator {
  private token = 0;
  private timers: ReturnType<typeof setTimeout>[] = [];
  constructor(private synth: SpeechSynthesis | undefined = typeof window !== 'undefined' ? window.speechSynthesis : undefined,
              private Utterance: typeof SpeechSynthesisUtterance | undefined = typeof window !== 'undefined' ? (window as any).SpeechSynthesisUtterance : undefined) {}

  get supported(): boolean { return !!this.synth && !!this.Utterance; }

  speak(text: string, o: SpeakOptions): void {
    if (!this.supported) { o.onError?.(); return; }
    this.cancel();
    const my = ++this.token;
    const words = tokenizeWords(text);
    const u = new this.Utterance!(text);
    u.rate = o.rate; u.pitch = o.pitch ?? 1.05;
    if (o.voice) { u.voice = o.voice; u.lang = o.voice.lang; }
    let gotBoundary = false;
    let finished = false;
    const finish = () => { if (finished || my !== this.token) return; finished = true; this.clearTimers(); o.onEnd?.(); };
    u.onboundary = (e: SpeechSynthesisEvent) => {
      if (my !== this.token || (e as any).name === 'sentence') return;
      gotBoundary = true;
      const i = wordIndexAtChar(words, e.charIndex);
      if (i >= 0) o.onWord?.(i);
    };
    u.onend = finish;
    u.onerror = (e: any) => { if (my !== this.token) return; if (e?.error === 'canceled' || e?.error === 'interrupted') return; this.clearTimers(); o.onError?.(); };
    u.onstart = () => {
      // Fallback highlight by estimated time if no boundary event arrives shortly after the voice starts.
      this.timers.push(setTimeout(() => {
        if (gotBoundary || my !== this.token || finished) return;
        const wpm = 150 * o.rate;
        estimateWordTimings(words, wpm).forEach((t, i) => this.timers.push(setTimeout(() => { if (!gotBoundary && my === this.token && !finished) o.onWord?.(i); }, t)));
      }, 350));
    };
    this.synth!.speak(u);
  }

  pause(): void { this.synth?.pause(); }
  resume(): void { this.synth?.resume(); }
  cancel(): void { this.token++; this.clearTimers(); this.synth?.cancel(); }
  private clearTimers() { this.timers.forEach(clearTimeout); this.timers = []; }
}
