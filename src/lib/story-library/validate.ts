/**
 * Pure validators for the central library. Used by the seeder (Stage 2) before anything is uploaded, and by tests.
 * They mirror the Firestore rules' field checks, so a story that passes here will not be refused by the rules for shape.
 * No I/O, no Firebase, no clock.
 */
import {
  CATALOGUE_ALLOWED_KEYS, CATALOGUE_REQUIRED_KEYS, CATALOGUE_STATUSES, MAX_CATALOGUE_ENTRY_BYTES,
  MAX_PAGES_PER_STORY, PACKAGE_ALLOWED_KEYS, PAGE_ALLOWED_KEYS, PUBLISHED_PREFIX, ADMIN_TRANSITIONS,
  type AdminStatus, type CatalogueEntry, type StoryPackage,
} from './types';

export const STORY_ID_RE = /^[A-Za-z0-9_-]{3,64}$/;
export const HASH_RE = /^sha256:[0-9a-f]{64}$/;

export interface Problem { path: string; message: string }

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

export function packagePathFor(storyId: string, version: number): string {
  return `${PUBLISHED_PREFIX}packages/${storyId}/v${version}/package.json`;
}

/** Assets are content-addressed: `story_library/published/assets/ab/<64 hex>.<ext>`. */
export function assetPathFor(hash: string, ext: 'webp' | 'png' | 'jpg' | 'opus' | 'ogg' | 'mp3'): string | null {
  if (!HASH_RE.test(hash)) return null;
  const hex = hash.slice('sha256:'.length);
  return `${PUBLISHED_PREFIX}assets/${hex.slice(0, 2)}/${hex}.${ext}`;
}

export function validateCatalogueEntry(storyId: string, e: unknown): Problem[] {
  const out: Problem[] = [];
  const bad = (path: string, message: string) => out.push({ path, message });
  if (!STORY_ID_RE.test(storyId)) bad('storyId', 'must be 3-64 characters of letters, digits, _ or -');
  if (!isObj(e)) return [...out, { path: '', message: 'entry must be an object' }];

  for (const k of CATALOGUE_REQUIRED_KEYS) if (!(k in e)) bad(k, 'required');
  for (const k of Object.keys(e)) if (!(CATALOGUE_ALLOWED_KEYS as readonly string[]).includes(k)) bad(k, 'field not allowed in the catalogue');

  if ('status' in e && !(CATALOGUE_STATUSES as readonly string[]).includes(e.status as string)) bad('status', 'must be published or archived');
  if ('title' in e && !(typeof e.title === 'string' && e.title.length >= 1 && e.title.length <= 120)) bad('title', '1-120 characters');
  if ('ageTiers' in e && !(Array.isArray(e.ageTiers) && e.ageTiers.length >= 1 && e.ageTiers.length <= 6)) bad('ageTiers', '1-6 entries');
  if ('pageCount' in e && !(Number.isInteger(e.pageCount) && (e.pageCount as number) >= 1 && (e.pageCount as number) <= MAX_PAGES_PER_STORY)) bad('pageCount', `1-${MAX_PAGES_PER_STORY}`);
  for (const k of ['version', 'packageVersion'] as const) {
    if (k in e && !(Number.isInteger(e[k]) && (e[k] as number) >= 1)) bad(k, 'integer >= 1');
  }
  for (const k of ['categories', 'themes', 'objectives'] as const) {
    if (k in e && !(Array.isArray(e[k]) && (e[k] as unknown[]).length <= 20)) bad(k, 'at most 20 entries');
  }
  for (const k of ['packageHash', 'contentHash'] as const) {
    if (k in e && !(typeof e[k] === 'string' && HASH_RE.test(e[k] as string))) bad(k, 'must be sha256:<64 hex>');
  }
  if (typeof e.packagePath === 'string' && STORY_ID_RE.test(storyId) && Number.isInteger(e.packageVersion)) {
    const expect = packagePathFor(storyId, e.packageVersion as number);
    if (e.packagePath !== expect) bad('packagePath', `must be ${expect}`);
  }
  const bytes = new TextEncoder().encode(JSON.stringify(e)).length;
  if (bytes > MAX_CATALOGUE_ENTRY_BYTES) bad('', `entry is ${bytes} bytes; the compact catalogue limit is ${MAX_CATALOGUE_ENTRY_BYTES}`);
  return out;
}

export function validateStoryPackage(p: unknown): Problem[] {
  const out: Problem[] = [];
  const bad = (path: string, message: string) => out.push({ path, message });
  if (!isObj(p)) return [{ path: '', message: 'package must be an object' }];
  for (const k of Object.keys(p)) {
    if (!(PACKAGE_ALLOWED_KEYS as readonly string[]).includes(k)) bad(k, 'field not allowed (packages hold story content only)');
  }
  if (p.schemaVersion !== 1) bad('schemaVersion', 'must be 1');
  if (!(typeof p.storyId === 'string' && STORY_ID_RE.test(p.storyId))) bad('storyId', 'invalid');
  if (!(typeof p.contentHash === 'string' && HASH_RE.test(p.contentHash))) bad('contentHash', 'must be sha256:<64 hex>');
  const assets = isObj(p.assets) ? p.assets : {};
  if (!isObj(p.assets)) bad('assets', 'required object');
  if (!Array.isArray(p.pages) || p.pages.length < 1 || p.pages.length > MAX_PAGES_PER_STORY) {
    bad('pages', `1-${MAX_PAGES_PER_STORY} pages`);
    return out;
  }
  p.pages.forEach((pg: unknown, i: number) => {
    const at = `pages[${i}]`;
    if (!isObj(pg)) return bad(at, 'must be an object');
    for (const k of Object.keys(pg)) if (!(PAGE_ALLOWED_KEYS as readonly string[]).includes(k)) bad(`${at}.${k}`, 'field not allowed');
    if (pg.n !== i + 1) bad(`${at}.n`, `must be ${i + 1}`);
    if (!(typeof pg.text === 'string' && pg.text.trim().length > 0)) bad(`${at}.text`, 'required');
    if (pg.image !== undefined && !(typeof pg.image === 'string' && pg.image in assets)) bad(`${at}.image`, 'not listed in assets');
    if (isObj(pg.audio)) {
      if (!(typeof pg.audio.hash === 'string' && pg.audio.hash in assets)) bad(`${at}.audio.hash`, 'not listed in assets');
    } else if (pg.audio !== undefined) bad(`${at}.audio`, 'must be an object');
  });
  for (const [hash, a] of Object.entries(assets)) {
    if (!HASH_RE.test(hash)) bad(`assets.${hash}`, 'key must be sha256:<64 hex>');
    if (!isObj(a) || typeof a.path !== 'string' || !a.path.startsWith(`${PUBLISHED_PREFIX}assets/`)) bad(`assets.${hash}.path`, 'must be under story_library/published/assets/');
    else if (HASH_RE.test(hash) && !a.path.includes(hash.slice('sha256:'.length))) bad(`assets.${hash}.path`, 'path must contain the content hash');
  }
  return out;
}

/** Is a workflow change allowed, and who may make it? Approval must be by someone other than the author. */
export function canTransition(from: AdminStatus, to: AdminStatus, ctx: { actor: string; createdBy: string }): { ok: boolean; reason?: string } {
  if (!ADMIN_TRANSITIONS[from]?.includes(to)) return { ok: false, reason: `${from} -> ${to} is not allowed` };
  if (to === 'approved' && ctx.actor === ctx.createdBy) return { ok: false, reason: 'the author cannot approve their own story' };
  return { ok: true };
}

export type { CatalogueEntry, StoryPackage };
