// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';

const verifyIdToken = vi.fn(async (token: string) => {
  if (token.startsWith('valid-')) return { uid: token.slice('valid-'.length) };
  throw new Error('bad token');
});
vi.mock('@/lib/firebaseAdmin', () => ({ getAdminAuth: () => ({ verifyIdToken }) }));
// No lesson found -> the handler returns 404 AFTER auth and rate-limiting, so no network / AI call is ever made.
vi.mock('@/lib/narrated-lessons/catalogue', () => ({ fetchLessonPackageById: vi.fn(async () => null) }));

import { NextRequest } from 'next/server';
import { POST } from './route';

const call = (headers: Record<string, string>, question = 'Why does water evaporate?') =>
  POST(
    new NextRequest('http://localhost/api/narrated-lessons/ask', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify({ lessonId: 'x', slideId: 's1', question }),
    }),
  );

describe('POST /api/narrated-lessons/ask — authentication and abuse limits (audit)', () => {
  it('rejects anonymous callers (no spending of the shared AI budget)', async () => {
    expect((await call({})).status).toBe(401);
    expect((await call({ 'x-lesson-session': 'anything' })).status).toBe(401);
  });

  it('rejects an invalid or forged token', async () => {
    expect((await call({ Authorization: 'Bearer forged' })).status).toBe(401);
    expect((await call({ Authorization: 'Basic abc' })).status).toBe(401);
  });

  it('a signed-in user passes authentication', async () => {
    const res = await call({ Authorization: 'Bearer valid-uid-pass' });
    expect(res.status).toBe(404); // got past auth + rate limit; lesson mock returns null
  });

  it('rate limit follows the verified uid: rotating the x-lesson-session header cannot bypass it', async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 17; i++) {
      const res = await call({ Authorization: 'Bearer valid-uid-abuser', 'x-lesson-session': `rotated-${i}` });
      statuses.push(res.status);
    }
    expect(statuses.slice(0, 15).every((s) => s === 404)).toBe(true);
    expect(statuses.slice(15)).toEqual([429, 429]);
    // a different, well-behaved pupil is unaffected
    expect((await call({ Authorization: 'Bearer valid-uid-other' })).status).toBe(404);
  });

  it('safeguarding disclosures still receive the protective response without any AI call', async () => {
    const res = await call({}, 'I want to kill myself');
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.source).toBe('safeguarding');
  });
});
