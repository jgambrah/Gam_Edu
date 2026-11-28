// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

// token -> claims. 'valid-<uid>' = signed in; role/school come from the token claims for these tests.
const { verifyIdToken, reserve } = vi.hoisted(() => ({
  verifyIdToken: vi.fn(async (token: string) => {
    const m = /^valid-([a-z0-9]+)(?:-role-([a-z_]+))?(?:-school-([a-z0-9]+))?$/i.exec(token);
    if (!m) throw new Error('bad token');
    return { uid: m[1], role: m[2], schoolId: m[3] };
  }),
  reserve: vi.fn(async (): Promise<any> => ({ ok: true })),
}));
vi.mock('@/lib/firebaseAdmin', () => ({
  getAdminAuth: () => ({ verifyIdToken }),
  getAdminDb: () => { throw new Error('no db in route tests'); },
}));
// No lesson found -> the handler returns 404 AFTER auth, authorisation and burst limiting, so no AI call is ever made.
vi.mock('@/lib/narrated-lessons/catalogue', () => ({ fetchLessonPackageById: vi.fn(async () => null) }));
vi.mock('@/lib/ask-teacher-guard', async (orig) => {
  const real: any = await orig();
  return { ...real, reserveSharedAiCall: reserve };
});

import { NextRequest } from 'next/server';
import { POST } from './route';

const call = (headers: Record<string, string>, question: any = 'Why does water evaporate?', raw?: string) =>
  POST(
    new NextRequest('http://localhost/api/narrated-lessons/ask', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: raw ?? JSON.stringify({ lessonId: 'x', slideId: 's1', question }),
    }),
  );
const teacher = (uid: string) => ({ Authorization: `Bearer valid-${uid}-role-teacher-school-sch1` });

describe('POST /api/narrated-lessons/ask — authentication, authorisation and limits (audit)', () => {
  beforeEach(() => { reserve.mockClear(); });

  it('rejects anonymous callers', async () => {
    expect((await call({})).status).toBe(401);
    expect((await call({ 'x-lesson-session': 'anything' })).status).toBe(401);
  });

  it('rejects an invalid or forged token', async () => {
    expect((await call({ Authorization: 'Bearer forged' })).status).toBe(401);
    expect((await call({ Authorization: 'Basic abc' })).status).toBe(401);
  });

  it('AUTHORISATION: a signed-in student is refused while Student Enrichment is Under Construction', async () => {
    const res = await call({ Authorization: 'Bearer valid-pupil1-role-student-school-sch1' });
    expect(res.status).toBe(403);
  });

  it('AUTHORISATION: a signed-in user with no school and no director role is refused', async () => {
    expect((await call({ Authorization: 'Bearer valid-nobody1-role-teacher' })).status).toBe(403);
  });

  it('staff roles are accepted (teacher, administrator, director/super_admin spellings)', async () => {
    for (const hdr of [teacher('t1'), { Authorization: 'Bearer valid-a1-role-admin-school-sch1' }, { Authorization: 'Bearer valid-d1-role-super_admin' }]) {
      expect((await call(hdr)).status).toBe(404); // past auth + authorisation + limiter; lesson mock returns null
    }
  });

  it('rate limit follows the verified uid: rotating the x-lesson-session header cannot bypass it', async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 17; i++) statuses.push((await call({ ...teacher('abuser1'), 'x-lesson-session': `rotated-${i}` })).status);
    expect(statuses.slice(0, 15).every((s) => s === 404)).toBe(true);
    expect(statuses.slice(15)).toEqual([429, 429]);
    expect((await call(teacher('other1'))).status).toBe(404);
  });

  it('request limits: oversized body 413, malformed JSON 400, bad lesson reference 400, too-long question 400', async () => {
    expect((await call(teacher('lim1'), 'x', 'x'.repeat(5000))).status).toBe(413);
    expect((await call(teacher('lim2'), 'x', '{not json')).status).toBe(400);
    expect((await call(teacher('lim3'), 'x', JSON.stringify({ lessonId: '../../etc/passwd', question: 'hello there' }))).status).toBe(400);
    expect((await call(teacher('lim4'), 'x'.repeat(401))).status).toBe(400);
    expect((await call(teacher('lim5'), 12345 as any)).status).toBe(400);
  });

  it('safeguarding disclosures still receive the protective response without any AI call or cap use', async () => {
    const res = await call({}, 'I want to kill myself');
    expect(res.status).toBe(200);
    expect((await res.json()).source).toBe('safeguarding');
    expect(reserve).not.toHaveBeenCalled();
  });
});
