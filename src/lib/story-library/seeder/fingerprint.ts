/**
 * Duplicate detection for the story seeder. Pure, deterministic, dependency-free (runs anywhere).
 *
 *   exact       identical normalised text           -> `textHash` (sha256 is computed by the caller, see hash.ts)
 *   near        MinHash signature (64 hashes) over 5-word shingles; LSH bands (16 x 4 rows) find candidates without a
 *               pairwise scan, then the signature's estimated Jaccard similarity decides (threshold 0.85)
 *
 * Why not exact Jaccard: the signature (64 small integers) is what we can store with the story, so the index can be
 * rebuilt from stored documents and checked inside a database transaction.
 */
export const SHINGLE_WORDS = 5;
export const NUM_HASHES = 64;
export const BANDS = 16;
export const ROWS = NUM_HASHES / BANDS; // 4
export const NEAR_DUPLICATE_THRESHOLD = 0.85;

export function normalizeText(s: string): string {
  return s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
}

export function shingles(text: string): Set<string> {
  const words = normalizeText(text).split(' ').filter(Boolean);
  const out = new Set<string>();
  if (words.length === 0) return out;
  if (words.length <= SHINGLE_WORDS) { out.add(words.join(' ')); return out; }
  for (let i = 0; i + SHINGLE_WORDS <= words.length; i++) out.add(words.slice(i, i + SHINGLE_WORDS).join(' '));
  return out;
}

/** FNV-1a with a per-hash seed; 32-bit, deterministic across platforms. */
export function hash32(s: string, seed: number): number {
  let h = (0x811c9dc5 ^ seed) >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d) >>> 0; h ^= h >>> 12; h = Math.imul(h, 0x297a2d39) >>> 0; h ^= h >>> 15;
  return h >>> 0;
}

export function minhash(set: Set<string>): number[] {
  const sig = new Array<number>(NUM_HASHES).fill(0xffffffff);
  for (const sh of set) {
    for (let i = 0; i < NUM_HASHES; i++) {
      const h = hash32(sh, Math.imul(i + 1, 0x9e3779b1) >>> 0);
      if (h < sig[i]) sig[i] = h;
    }
  }
  return sig;
}

export function signatureOf(text: string): number[] { return minhash(shingles(text)); }

export function estimateJaccard(a: number[], b: number[]): number {
  let same = 0;
  for (let i = 0; i < NUM_HASHES; i++) if (a[i] === b[i]) same++;
  return same / NUM_HASHES;
}

/**
 * Compact 256-byte (344-char base64) encoding of a 64-hash MinHash signature.
 * Cuts Firestore LSH band bucket entry size by >2x vs storing a 64-element integer array,
 * doubling per-bucket capacity as the corpus scales past 5,000+ stories.
 */
export function packSignature(sig: number[]): string {
  const bytes = new Uint8Array(sig.length * 4);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < sig.length; i++) view.setUint32(i * 4, sig[i] >>> 0, true);
  if (typeof Buffer !== 'undefined') return Buffer.from(bytes).toString('base64');
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

/** Decodes either a compact base64 signature string or a legacy `number[]` signature array. */
export function unpackSignature(raw: string | number[]): number[] {
  if (Array.isArray(raw)) return raw;
  const bytes = typeof Buffer !== 'undefined'
    ? new Uint8Array(Buffer.from(raw, 'base64'))
    : Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
  const count = Math.floor(bytes.byteLength / 4);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const out = new Array<number>(count);
  for (let i = 0; i < count; i++) out[i] = view.getUint32(i * 4, true);
  return out;
}

/** One bucket id per band. Two stories sharing any bucket are candidates. */
export function bandKeys(sig: number[]): string[] {
  const keys: string[] = [];
  for (let b = 0; b < BANDS; b++) {
    let h = 0x811c9dc5 ^ b;
    for (let r = 0; r < ROWS; r++) h = Math.imul(h ^ sig[b * ROWS + r], 0x01000193) >>> 0;
    keys.push(`b${b}_${h.toString(16).padStart(8, '0')}`);
  }
  return keys;
}

export function titleSlug(title: string): string {
  return normalizeText(title).replace(/ /g, '-').slice(0, 80);
}
