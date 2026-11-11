/**
 * Ghanaian pronunciation dictionary: types.
 *
 * RULES THIS MODEL ENFORCES
 *  - The WRITTEN spelling is never changed. A dictionary entry only changes the text sent to a speech engine
 *    (the "spoken script"). The reader, the highlight and the saved story keep the original spelling.
 *  - Dictionary entries verified prior to seeding carry `status: 'approved'` and are immediately usable for narration
 *    and published audio.
 *  - IPA (`ipa`) is optional; an engine instruction of kind 'ssml-phoneme' needs verified IPA.
 */

export type VerificationStatus =
  | 'approved' // verified prior to seeding; ready for narration and published audio
  | 'needs-native-review' // candidate guidance written by a non-native drafter: NOT usable unless allowUnverified is set
  | 'native-speaker-verified' // a named native speaker confirmed the guidance (and, if present, the IPA)
  | 'audio-verified'; // the generated audio was listened to by a native speaker and approved

export type EngineId = 'browser' | 'espeak' | 'gemini-tts' | 'cloud-tts';
export const ENGINE_IDS: readonly EngineId[] = ['browser', 'espeak', 'gemini-tts', 'cloud-tts'];

/** How one engine is told to say the entry. */
export type EngineInstruction =
  /** Replace the word in the script with this respelling (one token, no spaces). The only control browser engines offer. */
  | { kind: 'respell'; text: string; candidate: boolean }
  /** A natural-language hint for prompt-driven engines (Gemini TTS). The written word stays in the script. */
  | { kind: 'prompt-hint'; text: string; candidate: boolean }
  /** SSML <phoneme alphabet="ipa" ph="…">. Only valid once the IPA is verified. */
  | { kind: 'ssml-phoneme'; ph: string };

export type EntryKind = 'personal-name' | 'place' | 'word' | 'expression' | 'food';

export interface PronunciationEntry {
  id: string;
  /** Exact written form as it appears in stories (case-sensitive, no punctuation, no possessive). */
  written: string;
  kind: EntryKind;
  /** Language or dialect, as a person would name it. 'Akan (Twi/Fante)' when the word is shared. */
  language: string;
  meaning?: string;
  /** Cultural background that matters for pronunciation or use (e.g. day names). */
  culturalNote?: string;
  /** Plain-language guidance. */
  guidance: string;
  /** Verified IPA, when supplied. */
  ipa?: string;
  /** Engine-specific controls. Missing engines fall back to the written word. */
  engines: Partial<Record<EngineId, EngineInstruction>>;
  status: VerificationStatus;
  /** Notes for editors/reviewers. */
  reviewerNotes: string[];
  /** Required when status is 'native-speaker-verified' or 'audio-verified'. */
  verifiedBy?: { name: string; language: string; date: string };
}

export interface PronunciationDictionary {
  /** Bumped whenever any entry changes: part of every audio unit's cache key, so changed guidance regenerates audio. */
  version: number;
  entries: PronunciationEntry[];
}
