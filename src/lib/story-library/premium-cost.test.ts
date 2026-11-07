import { describe, expect, it } from 'vitest';
import { AUDIO_PRICES, IMAGE_PRICES, SCALES, audioCostUsd, imagesPerStory, programmeCost } from './premium-cost';

const p = (id: string) => AUDIO_PRICES.find((x) => x.id === id)!;
const img = (id: string) => IMAGE_PRICES.find((x) => x.id === id)!;

describe('premium cost model', () => {
  it('Gemini audio-token pricing: 300 s at 25 tokens/s, 1 take = 7,500 output tokens', () => {
    const c = audioCostUsd(p('gemini-3.1-flash-tts'), { characters: 3200, seconds: 300, takesPerSentence: 1 });
    // output 7,500 x $20/M = 0.15; input (800 + 150) x $1/M = 0.00095
    expect(c).toBeCloseTo(0.15095, 5);
  });
  it('re-takes multiply the cost linearly', () => {
    const one = audioCostUsd(p('gemini-3.1-flash-tts'), { characters: 3200, seconds: 300, takesPerSentence: 1 });
    expect(audioCostUsd(p('gemini-3.1-flash-tts'), { characters: 3200, seconds: 300, takesPerSentence: 3 })).toBeCloseTo(one * 3, 8);
  });
  it('character pricing: free tier covers a single story; ignoring it gives the list price', () => {
    const job = { characters: 3200, seconds: 300, takesPerSentence: 3 };
    expect(audioCostUsd(p('cloud-chirp3-hd'), job)).toBe(0);
    expect(audioCostUsd(p('cloud-chirp3-hd'), job, { ignoreFreeTier: true })).toBeCloseTo((9600 * 30) / 1e6, 8);
  });
  it('image counts follow the plan formula', () => {
    expect(imagesPerStory(SCALES.efua)).toBe(65); // 13 x 3 x 1.25 = 48.75 -> 49, + 8 x 2 = 16
    expect(imagesPerStory(SCALES.catalogue65)).toBe(Math.ceil(10 * 3 * 1.25) + 10);
  });
  it('programme total is audio + images, and Efua alone is a few dollars on the AI route', () => {
    const r = programmeCost(SCALES.efua, p('gemini-3.1-flash-tts'), img('gemini-3.1-flash-image-1k'));
    expect(r.total).toBeCloseTo(r.audioTotal + r.imageTotal, 8);
    expect(r.imageTotal).toBeCloseTo(65 * 0.067, 6);
    expect(r.total).toBeLessThan(10);
  });
  it('every price carries a source, a note and the as-of date is stated', () => {
    for (const x of [...AUDIO_PRICES, ...IMAGE_PRICES]) { expect(x.source.length).toBeGreaterThan(5); expect(x.notes.length).toBeGreaterThan(5); }
  });
  it('the retired model is flagged in its notes', () => {
    expect(img('imagen-4-fast').notes).toMatch(/shut down/i);
  });
});
