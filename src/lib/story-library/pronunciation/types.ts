/**
 * Ghanaian pronunciation dictionary: types.
 *
 * RULES THIS MODEL ENFORCES
 *  - The WRITTEN spelling is never changed. A dictionary entry only changes the text sent to a speech engine
 *    (the "spoken script"). The reader, the highlight and the saved story keep the original spelling.
 *  - Nothing here is an authoritative phonetic transcription unless `status` says a named person verified it.
 *    Candidate guidance is exactly that: a starting point for a native speaker to confirm, correct or reject.
 *  - IPA (`ipa`) is left empty until verified. An engine instruction of kind 'ssml-phoneme' needs verified IPA.
 */

export type VerificationStatus =
  | 'needs-native-review' // candidate guidance written by a non-native drafter: NOT usable for published audio
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

export type EntryKind = 'personal-name' | 'place' | 'word' | 'expression';

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
  /** Plain-language guidance, deliberately hedged until verified. */
  guidance: string;
  /** Verified IPA. Absent until a native speaker supplies or confirms it. */
  ipa?: string;
  /** Engine-specific controls. Missing engines fall back to the written word. */
  engines: Partial<Record<EngineId, EngineInstruction>>;
  status: VerificationStatus;
  /** Open questions and notes for the reviewer. */
  reviewerNotes: string[];
  /** Required when status is not 'needs-native-review'. */
  verifiedBy?: { name: string; language: string; date: string };
}

export interface PronunciationDictionary {
  /** Bumped whenever any entry changes: part of every audio unit's cache key, so changed guidance regenerates audio. */
  version: number;
  entries: PronunciationEntry[];
}
