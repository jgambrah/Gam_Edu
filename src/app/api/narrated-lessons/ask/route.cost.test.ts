// @vitest-environment node
/** Route-level cost control: mocked Gemini only (no paid AI is ever called). */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { reserve, release } = vi.hoisted(() => ({
  reserve: vi.fn(async (): Promise<any> => ({ ok: true })),
  release: vi.fn(async () => undefined),
}));
vi.mock('@/lib/firebaseAdmin', () => ({
  getAdminAuth: () => ({ verifyIdToken: async () => ({ uid: 't1', role: 'teacher', schoolId: 'sch1' }) }),
  getAdminDb: () => { throw new Error('no db'); },
}));
vi.mock('@/lib/narrated-lessons/catalogue', () => ({
  fetchLessonPackageById: vi.fn(async () => ({
    lesson: {
      lessonId: 'x',
      meta: { title: 'Water cycle', class: 'JHS 1', subject: 'Science', contentStandard: 'NaCCA' },
      slides: [{ id: 's1', title: 'Evaporation', keyIdeas: ['heat makes water vapour'], askTeacherContext: { summary: 'Water becomes vapour.', outOfScopeRule: 'Please ask about the lesson.', seedFaqs: [{ q: 'What is evaporation?', a: 'Liquid water turning to vapour.' }] } }],
    },
  })),
}));
vi.mock('@/lib/ask-teacher-guard', async (orig) => {
  const real: any = await orig();
  return { ...real, reserveSharedAiCall: reserve, releaseSharedAiCall: release };
});

import { NextRequest } from 'next/server';
import { POST } from './route';

const call = (question: string) =>
  POST(new NextRequest('http://localhost/api/narrated-lessons/ask', {
    method: 'POST',
    headers: { 'content-type': 'application/json', Authorization: 'Bearer valid' },
    body: JSON.stringify({ lessonId: 'x', slideId: 's1', question }),
  }));

const geminiOk = (text: string) => ({ ok: true, status: 200, json: async () => ({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text }] } }] }) });
let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  process.env.GEMINI_API_KEY = 'test-key-not-real';
  reserve.mockClear(); release.mockClear();
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => { vi.unstubAllGlobals(); delete process.env.GEMINI_API_KEY; });

describe('Ask Teacher cost control (mocked model)', () => {
  it('curated FAQ answers cost nothing: no reservation, no model call', async () => {
    const res = await call('What is evaporation?');
    expect((await res.json()).source).toBe('faq');
    expect(reserve).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('a normal AI answer reserves exactly once, calls the model once and does not release', async () => {
    fetchMock.mockResolvedValueOnce(geminiOk('Heat from the sun turns water into vapour.'));
    const res = await call('Why does the sun matter for evaporation here?');
    const body = await res.json();
    expect(body.answer).toContain('vapour');
    expect(reserve).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(release).not.toHaveBeenCalled();
  });

  it('when the cap is reached the model is NEVER called (429, no paid usage)', async () => {
    reserve.mockResolvedValueOnce({ ok: false, reason: 'user-cap' });
    const res = await call('Explain condensation in another way please');
    expect(res.status).toBe(429);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('when the counter store is unavailable the model is NEVER called (fail closed)', async () => {
    reserve.mockResolvedValueOnce({ ok: false, reason: 'unavailable' });
    const res = await call('Tell me about rain clouds in this lesson');
    expect(res.status).toBe(429);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('model failure on every configured model releases the slot and still answers from the curated FAQ', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 503, json: async () => ({}) });
    const res = await call('Why does water vapour matter in this lesson?');
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(['faq-fallback', 'fallback']).toContain(body.source);
    expect(release).toHaveBeenCalledTimes(1);
  });

  it('a safety block still counts as a used call (the provider processed the prompt)', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ promptFeedback: { blockReason: 'SAFETY' }, candidates: [] }) });
    const res = await call('Describe how to be dangerous in this lesson');
    expect((await res.json()).source).toBe('safeguarding');
    expect(release).not.toHaveBeenCalled();
  });

  it('rejected requests (oversized, invalid) never touch the counter or the model', async () => {
    const big = await POST(new NextRequest('http://localhost/api/narrated-lessons/ask', { method: 'POST', headers: { 'content-type': 'application/json', Authorization: 'Bearer valid' }, body: 'x'.repeat(5000) }));
    expect(big.status).toBe(413);
    expect((await call('x'.repeat(401))).status).toBe(400);
    expect(reserve).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
