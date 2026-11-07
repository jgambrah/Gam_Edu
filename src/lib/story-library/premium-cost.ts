/**
 * Cost model for premium narration and illustration. Pure arithmetic over DATED, SOURCED price constants.
 * Nothing here calls a service. PRICES MUST BE RE-CHECKED against the provider's page before any spending is approved;
 * several of these services are in preview and prices have changed during preview periods.
 */

export interface AudioPrice { id: string; name: string; unit: 'audio-token' | 'character'; inputPerMillion?: number; perMillion: number; freeMonthlyUnits?: number; source: string; notes: string }
export interface ImagePrice { id: string; name: string; perImageUsd: number; source: string; notes: string }

export const PRICES_AS_OF = '2026-11-07';

export const AUDIO_PRICES: AudioPrice[] = [
  { id: 'gemini-3.1-flash-tts', name: 'Gemini 3.1 Flash TTS (preview)', unit: 'audio-token', inputPerMillion: 1, perMillion: 20, source: 'https://cloud.google.com/text-to-speech/pricing', notes: 'Output audio billed at 25 tokens per second. No free tier. Style/accent by prompt; no phoneme control; no word timestamps documented. This is the model already used by generateTTSAction in junior-actions.ts.' },
  { id: 'gemini-2.5-flash-tts', name: 'Gemini 2.5 Flash TTS', unit: 'audio-token', inputPerMillion: 0.5, perMillion: 10, source: 'https://cloud.google.com/text-to-speech/pricing', notes: 'Cheaper, older. Same prompt-based control, same limits.' },
  { id: 'cloud-chirp3-hd', name: 'Cloud TTS Chirp 3 HD', unit: 'character', perMillion: 30, freeMonthlyUnits: 1_000_000, source: 'https://cloud.google.com/text-to-speech/pricing', notes: '1M characters free per month. Pronunciation controls differ by voice family: confirm what Chirp 3 HD offers for the chosen locale before relying on it.' },
  { id: 'cloud-neural2', name: 'Cloud TTS Neural2', unit: 'character', perMillion: 16, freeMonthlyUnits: 1_000_000, source: 'https://cloud.google.com/text-to-speech/pricing', notes: 'SSML <phoneme> with IPA is believed supported on this family; verify for the chosen voice. Needs verified IPA, which does not yet exist for any Ghanaian name.' },
  { id: 'cloud-wavenet', name: 'Cloud TTS WaveNet / Standard', unit: 'character', perMillion: 4, freeMonthlyUnits: 4_000_000, source: 'https://cloud.google.com/text-to-speech/pricing', notes: 'Cheapest; SSML <phoneme> with IPA believed supported; verify. More robotic.' },
];

export const IMAGE_PRICES: ImagePrice[] = [
  { id: 'gemini-3.1-flash-image-1k', name: 'Gemini 3.1 Flash Image, 1K', perImageUsd: 0.067, source: 'third-party calculation from published token counts (tokencost.app); Google footnote reported to agree', notes: 'Floor: excludes input and thinking tokens. Batch pricing reported at half.' },
  { id: 'gemini-3.1-flash-image-2k', name: 'Gemini 3.1 Flash Image, 2K', perImageUsd: 0.101, source: 'as above', notes: 'Same caveats.' },
  { id: 'imagen-4-fast', name: 'Imagen 4 Fast', perImageUsd: 0.02, source: 'pricepertoken.com (third party)', notes: 'REPORTED to be shut down from 17 Aug 2026 (earliest date); the app currently calls imagen-4.0-fast-generate-001. Treat as unavailable until verified.' },
];

export const AUDIO_TOKENS_PER_SECOND = 25;

export interface AudioJob { characters: number; seconds: number; takesPerSentence: number }

/** USD for one story's narration on one provider, including re-takes. */
export function audioCostUsd(price: AudioPrice, job: AudioJob, opts: { ignoreFreeTier?: boolean } = {}): number {
  const takes = Math.max(1, job.takesPerSentence);
  if (price.unit === 'audio-token') {
    const out = job.seconds * AUDIO_TOKENS_PER_SECOND * takes;
    const inTokens = Math.ceil((job.characters / 4) * takes) + 150 * takes; // ~4 chars per token plus a style prompt
    return (out * price.perMillion + inTokens * (price.inputPerMillion ?? 0)) / 1_000_000;
  }
  const chars = job.characters * takes;
  const billable = opts.ignoreFreeTier ? chars : Math.max(0, chars - (price.freeMonthlyUnits ?? 0));
  return (billable * price.perMillion) / 1_000_000;
}

export interface Scale { stories: number; avgCharacters: number; avgSeconds: number; takes: number; shotsPerStory: number; candidatesPerShot: number; retryRate: number; referenceImagesPerStory: number; referenceCandidates: number }

export function imagesPerStory(s: Pick<Scale, 'shotsPerStory' | 'candidatesPerShot' | 'retryRate' | 'referenceImagesPerStory' | 'referenceCandidates'>): number {
  return Math.ceil(s.shotsPerStory * s.candidatesPerShot * (1 + s.retryRate)) + s.referenceImagesPerStory * s.referenceCandidates;
}

export function programmeCost(scale: Scale, audio: AudioPrice, image: ImagePrice, opts: { audioIgnoreFreeTier?: boolean } = {}) {
  const audioPerStory = audioCostUsd(audio, { characters: scale.avgCharacters, seconds: scale.avgSeconds, takesPerSentence: scale.takes }, { ignoreFreeTier: true });
  const audioTotal = opts.audioIgnoreFreeTier === false && audio.freeMonthlyUnits
    ? audioCostUsd(audio, { characters: scale.avgCharacters * scale.stories, seconds: scale.avgSeconds * scale.stories, takesPerSentence: scale.takes })
    : audioPerStory * scale.stories;
  const imgs = imagesPerStory(scale);
  const imagesPerStoryUsd = imgs * image.perImageUsd;
  return { audioPerStory, audioTotal, imagesPerStory: imgs, imagePerStoryUsd: imagesPerStoryUsd, imageTotal: imagesPerStoryUsd * scale.stories, total: audioTotal + imagesPerStoryUsd * scale.stories };
}

/** Planning scales for the report. These are ASSUMPTIONS, not quotes. */
export const SCALES: Record<'efua' | 'catalogue65', Scale> = {
  efua: { stories: 1, avgCharacters: 3200, avgSeconds: 300, takes: 3, shotsPerStory: 13, candidatesPerShot: 3, retryRate: 0.25, referenceImagesPerStory: 8, referenceCandidates: 2 },
  catalogue65: { stories: 65, avgCharacters: 2400, avgSeconds: 220, takes: 3, shotsPerStory: 10, candidatesPerShot: 3, retryRate: 0.25, referenceImagesPerStory: 5, referenceCandidates: 2 },
};
