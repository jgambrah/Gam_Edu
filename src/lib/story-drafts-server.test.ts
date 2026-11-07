import { describe, it, expect, vi, beforeEach } from 'vitest';

const h = vi.hoisted(() => ({ docs: new Map<string, any>(), files: new Map<string, any>(), failSave: false }));
vi.mock('@/lib/firebaseAdmin', () => {
  const ref = (path: string): any => ({
    collection: (c: string) => ({ doc: (id: string) => ref(`${path}/${c}/${id}`) }),
    get: async () => ({ exists: h.docs.has(path) }),
    set: async (d: any, o?: any) => { h.docs.set(path, o?.merge ? { ...h.docs.get(path), ...d } : d); },
  });
  return { getAdminApp: () => ({}), getAdminDb: () => ({ collection: (c: string) => ({ doc: (id: string) => ref(`${c}/${id}`) }) }) };
});
vi.mock('firebase-admin/storage', () => ({
  getStorage: () => ({ bucket: () => ({ file: (p: string) => ({ save: async (b: Buffer, o: any) => { if (h.failSave) throw new Error('boom'); h.files.set(p, { b, o }); } }) }) }),
}));

import { saveStoryDraft, attachDraftCover, draftId, draftCoverPath } from './story-drafts-server';

const PNG = 'data:image/png;base64,' + Buffer.from('fakepng').toString('base64');
const D = 'schools/s1/junior_story_drafts/u1_r1';
beforeEach(() => { h.docs.clear(); h.files.clear(); h.failSave = false; vi.spyOn(console, 'error').mockImplementation(() => {}); });

describe('draft ids and paths', () => {
  it('are safe', () => {
    expect(draftId('u1', 'r1')).toBe('u1_r1');
    expect(draftId('u/1', 'r1')).toBeNull();
    expect(draftId('u1', '../x')).toBeNull();
    expect(draftCoverPath('s1', 'u1', 'r1')).toBe('schools/s1/junior_stories/drafts/u1_r1_cover.png');
    expect(draftCoverPath('s/1', 'u1', 'r1')).toBeNull();
  });
});

describe('saveStoryDraft', () => {
  it('stores the story with owner, school, status and a 30-day expiry', async () => {
    expect(await saveStoryDraft({ schoolId: 's1', uid: 'u1', requestId: 'r1', story: { title: 'T' } })).toBe(true);
    const d = h.docs.get(D);
    expect(d).toMatchObject({ uid: 'u1', schoolId: 's1', status: 'unsaved', story: { title: 'T' }, coverPath: null });
    expect(+d.expiresAt - +d.createdAt).toBe(30 * 86_400_000);
  });
  it('is idempotent for one request id (same document)', async () => {
    await saveStoryDraft({ schoolId: 's1', uid: 'u1', requestId: 'r1', story: { title: 'A' } });
    await saveStoryDraft({ schoolId: 's1', uid: 'u1', requestId: 'r1', story: { title: 'A' } });
    expect([...h.docs.keys()]).toEqual([D]);
  });
  it('refuses unsafe ids and never throws', async () => {
    expect(await saveStoryDraft({ schoolId: 's1', uid: 'u1', requestId: '../x', story: {} })).toBe(false);
    expect(h.docs.size).toBe(0);
  });
});

describe('attachDraftCover', () => {
  beforeEach(async () => { await saveStoryDraft({ schoolId: 's1', uid: 'u1', requestId: 'r1', story: { title: 'T' } }); });
  it('stores the image and links it to the draft', async () => {
    expect(await attachDraftCover({ schoolId: 's1', uid: 'u1', requestId: 'r1', dataUrl: PNG })).toBe(true);
    expect(h.files.get('schools/s1/junior_stories/drafts/u1_r1_cover.png').o.contentType).toBe('image/png');
    expect(h.docs.get(D).coverPath).toBe('schools/s1/junior_stories/drafts/u1_r1_cover.png');
    expect(h.docs.get(D).story).toEqual({ title: 'T' }); // merge, not overwrite
  });
  it('does nothing without a draft, with a non-image, or with oversize data', async () => {
    expect(await attachDraftCover({ schoolId: 's1', uid: 'u1', requestId: 'zzz', dataUrl: PNG })).toBe(false);
    expect(await attachDraftCover({ schoolId: 's1', uid: 'u1', requestId: 'r1', dataUrl: 'data:text/html;base64,AAAA' })).toBe(false);
    expect(await attachDraftCover({ schoolId: 's1', uid: 'u1', requestId: 'r1', dataUrl: 'data:image/png;base64,' + 'A'.repeat(12 * 1024 * 1024) })).toBe(false);
    expect(h.files.size).toBe(0);
  });
  it('a storage failure is swallowed (the paid story still reaches the user)', async () => {
    h.failSave = true;
    expect(await attachDraftCover({ schoolId: 's1', uid: 'u1', requestId: 'r1', dataUrl: PNG })).toBe(false);
    expect(h.docs.get(D).coverPath).toBeNull();
  });
});
