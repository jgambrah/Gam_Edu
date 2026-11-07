import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Narrator, pickVoice } from './narration';

class FakeUtterance { text: string; rate = 1; pitch = 1; voice: any = null; lang = ''; onboundary: any; onend: any; onerror: any; onstart: any; constructor(t: string) { this.text = t; } }
const makeSynth = () => {
  const spoken: FakeUtterance[] = [];
  return { spoken, speak: vi.fn((u: FakeUtterance) => spoken.push(u)), cancel: vi.fn(), pause: vi.fn(), resume: vi.fn() };
};
const voice = (name: string, lang: string) => ({ name, lang }) as SpeechSynthesisVoice;

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('pickVoice', () => {
  it('prefers a natural English voice, then Ghana/Nigeria/UK English', () => {
    const v = [voice('Alex', 'en-US'), voice('Google UK English Female', 'en-GB'), voice('Amélie', 'fr-FR'), voice('Microsoft Natural Female', 'en-NG')];
    expect(pickVoice(v)!.name).toBe('Microsoft Natural Female');
  });
  it('honours a chosen voice, ignores non-English when English exists, and copes with none', () => {
    const v = [voice('Alex', 'en-US'), voice('Amélie', 'fr-FR')];
    expect(pickVoice(v, 'Amélie')!.name).toBe('Amélie');
    expect(pickVoice(v)!.name).toBe('Alex');
    expect(pickVoice([])).toBeNull();
  });
});

describe('Narrator', () => {
  it('reports unsupported browsers instead of throwing', () => {
    const n = new Narrator(undefined as any, undefined as any);
    const onError = vi.fn();
    n.speak('Hi', { rate: 1, onError });
    expect(n.supported).toBe(false);
    expect(onError).toHaveBeenCalled();
  });

  it('speaks with the chosen rate/voice and reports the word at each boundary, then ends', () => {
    const synth = makeSynth(); const n = new Narrator(synth as any, FakeUtterance as any);
    const onWord = vi.fn(), onEnd = vi.fn();
    n.speak('The little fox ran.', { rate: 0.7, voice: voice('V', 'en-GB'), onWord, onEnd });
    const u = synth.spoken[0];
    expect(u.rate).toBe(0.7); expect(u.lang).toBe('en-GB');
    u.onboundary({ charIndex: 0, name: 'word' }); u.onboundary({ charIndex: 4, name: 'word' }); u.onboundary({ charIndex: 11, name: 'word' });
    expect(onWord.mock.calls.map((c) => c[0])).toEqual([0, 1, 2]);
    u.onend();
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it('ignores sentence-level boundaries', () => {
    const synth = makeSynth(); const n = new Narrator(synth as any, FakeUtterance as any);
    const onWord = vi.fn();
    n.speak('Hi there.', { rate: 1, onWord });
    synth.spoken[0].onboundary({ charIndex: 0, name: 'sentence' });
    expect(onWord).not.toHaveBeenCalled();
  });

  it('falls back to timed highlighting when the browser sends no boundary events', () => {
    const synth = makeSynth(); const n = new Narrator(synth as any, FakeUtterance as any);
    const onWord = vi.fn();
    n.speak('One two three four.', { rate: 1, onWord });
    synth.spoken[0].onstart();
    vi.advanceTimersByTime(6000);
    expect(onWord.mock.calls.map((c) => c[0])).toEqual([0, 1, 2, 3]);
  });

  it('does NOT also run the timer when real boundary events arrive', () => {
    const synth = makeSynth(); const n = new Narrator(synth as any, FakeUtterance as any);
    const onWord = vi.fn();
    n.speak('One two three.', { rate: 1, onWord });
    synth.spoken[0].onstart();
    synth.spoken[0].onboundary({ charIndex: 0, name: 'word' });
    vi.advanceTimersByTime(6000);
    expect(onWord).toHaveBeenCalledTimes(1);
  });

  it('a new speak() cancels the old one: late events from the old utterance are ignored', () => {
    const synth = makeSynth(); const n = new Narrator(synth as any, FakeUtterance as any);
    const onWordA = vi.fn(), onEndA = vi.fn();
    n.speak('First page.', { rate: 1, onWord: onWordA, onEnd: onEndA });
    const a = synth.spoken[0];
    n.speak('Second page.', { rate: 1 });
    a.onboundary({ charIndex: 0, name: 'word' }); a.onend();
    expect(onWordA).not.toHaveBeenCalled();
    expect(onEndA).not.toHaveBeenCalled();
    expect(synth.cancel).toHaveBeenCalled();
  });

  it('cancelling is not an error; real errors are reported once', () => {
    const synth = makeSynth(); const n = new Narrator(synth as any, FakeUtterance as any);
    const onError = vi.fn();
    n.speak('Hi.', { rate: 1, onError });
    synth.spoken[0].onerror({ error: 'canceled' });
    expect(onError).not.toHaveBeenCalled();
    synth.spoken[0].onerror({ error: 'synthesis-failed' });
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('pause/resume/cancel pass through', () => {
    const synth = makeSynth(); const n = new Narrator(synth as any, FakeUtterance as any);
    n.pause(); n.resume(); n.cancel();
    expect(synth.pause).toHaveBeenCalled(); expect(synth.resume).toHaveBeenCalled(); expect(synth.cancel).toHaveBeenCalled();
  });
});
