import type { EngineId, EngineInstruction, PronunciationDictionary, PronunciationEntry } from './types';

/**
 * Build the text an engine will SPEAK from the text the child READS, without ever changing the written text.
 *
 * Tokens are whitespace-separated, exactly like `tokenize()` in premium.ts, and the output keeps the SAME NUMBER OF
 * TOKENS in the SAME ORDER. That is what lets word timing measured on the spoken script be attached to the written words
 * one-to-one. A replacement therefore must be a single token (no spaces); the dictionary check enforces it.
 *
 * Only 'respell' instructions change the script. 'prompt-hint' instructions are collected for prompt-driven engines
 * (Gemini TTS) and 'ssml-phoneme' ones are applied by an SSML-capable engine adapter; neither alters the token stream here.
 */

export interface UsedEntry { tokenIndex: number; written: string; entryId: string; status: PronunciationEntry['status']; instruction: EngineInstruction | null }
export interface SpokenScript {
  /** Text to hand to a respelling-only engine. */
  spoken: string;
  /** Number of tokens (equal to the written text's token count by construction). */
  tokenCount: number;
  used: UsedEntry[];
  /** Hints for prompt-driven engines, one per distinct entry used, in order of first use. */
  promptHints: string[];
  /** SSML phoneme replacements (tokenIndex -> ph) for SSML engines. */
  ssmlPhonemes: Array<{ tokenIndex: number; written: string; ph: string }>;
  /** Entries used that are explicitly marked 'needs-native-review'. */
  unverified: string[];
}

const LEAD = /^[\s‘’“”"'(\[—–-]+/;
const TRAIL = /[\s‘’“”"'),.;:!?\]—–-]+$/;
const POSSESSIVE = /[’']s$/;

/** Splits a token into [leading punctuation, core, trailing punctuation + possessive]. */
export function splitToken(token: string): [string, string, string] {
  const lead = (LEAD.exec(token) ?? [''])[0];
  let rest = token.slice(lead.length);
  const trail = (TRAIL.exec(rest) ?? [''])[0];
  rest = rest.slice(0, rest.length - trail.length);
  const poss = (POSSESSIVE.exec(rest) ?? [''])[0];
  const core = poss ? rest.slice(0, rest.length - poss.length) : rest;
  return [lead, core, poss + trail];
}

export function indexDictionary(dict: PronunciationDictionary): Map<string, PronunciationEntry> {
  return new Map(dict.entries.map((e) => [e.written, e]));
}

export function buildSpokenScript(text: string, dict: PronunciationDictionary, engine: EngineId, opts: { allowUnverified?: boolean } = {}): SpokenScript {
  const index = indexDictionary(dict);
  const tokens = text.trim() ? text.trim().split(/\s+/) : [];
  const used: UsedEntry[] = [];
  const hints: string[] = [];
  const ssml: SpokenScript['ssmlPhonemes'] = [];
  const unverified = new Set<string>();
  const out = tokens.map((tok, i) => {
    const [lead, core, tail] = splitToken(tok);
    const e = core ? index.get(core) : undefined;
    if (!e) return tok;
    const ins = e.engines[engine] ?? null;
    used.push({ tokenIndex: i, written: core, entryId: e.id, status: e.status, instruction: ins });
    if (e.status === 'needs-native-review') unverified.add(e.id);
    const allowed = e.status !== 'needs-native-review' || opts.allowUnverified === true;
    if (!ins || !allowed) return tok;
    if (ins.kind === 'respell') return `${lead}${ins.text}${tail}`;
    if (ins.kind === 'prompt-hint') { if (!hints.includes(ins.text)) hints.push(ins.text); return tok; }
    ssml.push({ tokenIndex: i, written: core, ph: ins.ph });
    return tok;
  });
  return { spoken: out.join(' '), tokenCount: tokens.length, used, promptHints: hints, ssmlPhonemes: ssml, unverified: [...unverified] };
}

/** True when audio built from this entry may be published: either pre-verified ('approved') or verified by a named reviewer. */
export const usableForPublishedAudio = (e: PronunciationEntry) =>
  e.status === 'approved' || (e.status !== 'needs-native-review' && !!e.verifiedBy);

/** Entries in `texts` that block published audio, with a plain-language reason. Empty = pronunciation is clear to publish. */
export function pronunciationBlockers(texts: string[], dict: PronunciationDictionary): Array<{ entryId: string; written: string; reason: string }> {
  const index = indexDictionary(dict);
  const seen = new Map<string, { entryId: string; written: string; reason: string }>();
  for (const text of texts) {
    for (const tok of text.trim().split(/\s+/)) {
      const core = splitToken(tok)[1];
      const e = core ? index.get(core) : undefined;
      if (e && !usableForPublishedAudio(e) && !seen.has(e.id)) seen.set(e.id, { entryId: e.id, written: e.written, reason: 'pronunciation not verified' });
    }
  }
  return [...seen.values()];
}

/** Capitalised words in the text that look like names/places but are in neither the dictionary nor the known-English list: candidates to add. */
export function unknownProperNouns(texts: string[], dict: PronunciationDictionary, knownEnglish: ReadonlySet<string>): string[] {
  const index = indexDictionary(dict);
  const found = new Set<string>();
  for (const text of texts) {
    const toks = text.trim().split(/\s+/);
    toks.forEach((tok, i) => {
      const core = splitToken(tok)[1];
      if (!core || !/^[A-Z][a-zA-Z]+$/.test(core) || index.has(core) || knownEnglish.has(core.toLowerCase())) return;
      const prev = i > 0 ? toks[i - 1] : '.';
      if (/[.!?‘“’”]$/.test(prev) || i === 0) return; // sentence-initial capitals are usually ordinary words
      found.add(core);
    });
  }
  return [...found].sort();
}

/** Dictionary self-check used by tests and CI: well-formed entries, single-token respellings, no fabricated verification. */
export function validateDictionary(dict: PronunciationDictionary): string[] {
  const problems: string[] = [];
  const ids = new Set<string>(), written = new Set<string>();
  for (const e of dict.entries) {
    if (ids.has(e.id)) problems.push(`${e.id}: duplicate id`); ids.add(e.id);
    if (written.has(e.written)) problems.push(`${e.id}: duplicate written form`); written.add(e.written);
    if (!e.guidance.trim()) problems.push(`${e.id}: guidance missing`);
    if (e.status === 'needs-native-review' && e.reviewerNotes.length === 0) problems.push(`${e.id}: unverified entries need reviewer notes`);
    if ((e.status === 'native-speaker-verified' || e.status === 'audio-verified') && !e.verifiedBy) problems.push(`${e.id}: ${e.status} requires verifiedBy`);
    if (e.status === 'needs-native-review' && e.ipa) problems.push(`${e.id}: IPA present on an unverified entry (do not invent transcriptions)`);
    for (const [eng, ins] of Object.entries(e.engines)) {
      if (!ins) continue;
      if (ins.kind === 'respell' && /\s/.test(ins.text)) problems.push(`${e.id}/${eng}: respelling must be a single token`);
      if (ins.kind === 'ssml-phoneme' && !(e.ipa && e.status !== 'needs-native-review')) problems.push(`${e.id}/${eng}: SSML phoneme requires verified IPA`);
    }
  }
  return problems;
}
