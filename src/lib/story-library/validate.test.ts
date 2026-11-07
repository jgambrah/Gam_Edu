import { describe, it, expect } from 'vitest';
import { validateCatalogueEntry, validateStoryPackage, canTransition, packagePathFor, assetPathFor } from './validate';
import { makeSyntheticPackage } from './lazy-loader';
import { STORY_SPEC } from './lazy-measurement';
import { ADMIN_STATUSES, ADMIN_TRANSITIONS } from './types';

const H = (c: string) => `sha256:${c.repeat(64)}`;
const entry = (over: Record<string, unknown> = {}) => ({
  storyKey: 'gam-0001', version: 1, packageVersion: 1, status: 'published', title: 'The Brave Little Kite', ageTiers: ['3-4'],
  pageCount: 10, packagePath: packagePathFor('story_0001', 1), packageHash: H('a'), contentHash: H('b'), publishedBy: 'publisher1', ...over,
});
const msgs = (p: { path: string }[]) => p.map((x) => x.path);

describe('catalogue entry', () => {
  it('accepts a compact, valid entry', () => {
    expect(validateCatalogueEntry('story_0001', entry())).toEqual([]);
  });
  it('is far below the 2 KB compactness limit', () => {
    expect(new TextEncoder().encode(JSON.stringify(entry())).length).toBeLessThan(600);
  });
  it('rejects a draft (drafts never live in the school-readable catalogue)', () => {
    expect(msgs(validateCatalogueEntry('story_0001', entry({ status: 'draft' })))).toContain('status');
  });
  it('rejects any field outside the allow-list, e.g. a school id or page text', () => {
    const p = msgs(validateCatalogueEntry('story_0001', entry({ schoolId: 'schoolA', pages: [] })));
    expect(p).toContain('schoolId');
    expect(p).toContain('pages');
  });
  it('requires the core fields', () => {
    const e: Record<string, unknown> = entry(); delete e.packageHash; delete e.title;
    expect(msgs(validateCatalogueEntry('story_0001', e))).toEqual(expect.arrayContaining(['packageHash', 'title']));
  });
  it('rejects a package path that does not match the story id and version', () => {
    expect(msgs(validateCatalogueEntry('story_0001', entry({ packagePath: packagePathFor('other', 1) })))).toContain('packagePath');
    expect(msgs(validateCatalogueEntry('story_0001', entry({ packageVersion: 2 })))).toContain('packagePath');
  });
  it('rejects bad ids, page counts, hashes and oversize entries', () => {
    expect(msgs(validateCatalogueEntry('a/b', entry()))).toContain('storyId');
    expect(msgs(validateCatalogueEntry('story_0001', entry({ pageCount: 41 })))).toContain('pageCount');
    expect(msgs(validateCatalogueEntry('story_0001', entry({ contentHash: 'abc' })))).toContain('contentHash');
    expect(msgs(validateCatalogueEntry('story_0001', entry({ summary: 'x'.repeat(3000) })))).toContain('');
  });
});

describe('story package', () => {
  const good = () => makeSyntheticPackage(STORY_SPEC).pkg as unknown as Record<string, any>;
  it('accepts a well-formed package', () => {
    expect(validateStoryPackage(good())).toEqual([]);
  });
  it('rejects unknown keys at package and page level (no personal or school data by construction)', () => {
    const p = good(); p.schoolId = 'schoolA'; p.pages[0].studentName = 'Ama';
    expect(msgs(validateStoryPackage(p))).toEqual(expect.arrayContaining(['schoolId', 'pages[0].studentName']));
  });
  it('rejects pages that reference media missing from assets, or are out of order', () => {
    const p = good(); p.pages[1].image = H('9'); p.pages[2].n = 7;
    expect(msgs(validateStoryPackage(p))).toEqual(expect.arrayContaining(['pages[1].image', 'pages[2].n']));
  });
  it('requires asset paths to be content-addressed under the published prefix', () => {
    const p = good(); const k = Object.keys(p.assets)[0]; p.assets[k].path = 'somewhere/else.webp';
    expect(msgs(validateStoryPackage(p))).toContain(`assets.${k}.path`);
  });
  it('builds content-addressed asset paths and refuses malformed hashes', () => {
    expect(assetPathFor(H('a'), 'webp')).toBe(`story_library/published/assets/aa/${'a'.repeat(64)}.webp`);
    expect(assetPathFor('sha256:zz', 'webp')).toBeNull();
  });
});

describe('workflow transitions', () => {
  const ok = { actor: 'p5', createdBy: 'p1', lastEditedBy: 'p2', submittedBy: 'p3', reviewerIds: ['p4'], premiumReady: true };
  const serverOnly = (from: string, to: string) => to === 'published' || (from === 'published' && to === 'archived');
  it('only the documented transitions are allowed, and publishing/withdrawing are server-side only', () => {
    for (const from of ADMIN_STATUSES) for (const to of ADMIN_STATUSES) {
      const r = canTransition(from, to, ok);
      expect(r.ok).toBe(ADMIN_TRANSITIONS[from].includes(to) && !serverOnly(from, to));
    }
  });
  it('approval needs a person independent of creator, last editor, submitter and every reviewer', () => {
    for (const who of ['p1', 'p2', 'p3', 'p4']) expect(canTransition('review', 'approved', { ...ok, actor: who }).ok).toBe(false);
    expect(canTransition('review', 'approved', ok).ok).toBe(true);
  });
  it('a machine-created draft (creator and last editor are the seeder) still needs an independent approver', () => {
    const c = { actor: 'seeder-bot', createdBy: 'seeder-bot', lastEditedBy: 'seeder-bot', submittedBy: 'p3', premiumReady: true };
    expect(canTransition('review', 'approved', c).ok).toBe(false);
    expect(canTransition('review', 'approved', { ...c, actor: 'p9' }).ok).toBe(true);
  });
  it('approval needs a submitted version and premium readiness for the current content', () => {
    expect(canTransition('review', 'approved', { ...ok, submittedBy: undefined }).reason).toMatch(/not been submitted/);
    expect(canTransition('review', 'approved', { ...ok, premiumReady: false }).reason).toMatch(/premium-ready/);
    expect(canTransition('review', 'approved', { ...ok, premiumReady: undefined }).ok).toBe(false);
  });
  it('a draft cannot be published directly, and nobody can publish by editing', () => {
    expect(canTransition('draft', 'published', ok).ok).toBe(false);
    expect(canTransition('approved', 'published', ok).reason).toMatch(/publication service/);
  });
});
