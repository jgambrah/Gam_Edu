// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/firebaseAdmin', () => ({ getAdminAuth: () => ({}), getAdminDb: () => ({}) }));

import {
  ASK_TEACHER_CAPS,
  canonicalEnrichmentRole,
  mayUseAskTeacher,
  reserveSharedAiCall,
} from './ask-teacher-guard';

/** Minimal in-memory Firestore stand-in with transactions, enough to prove the cap logic is atomic and shared. */
function fakeDb() {
  const store = new Map<string, any>();
  const ref = (id: string) => ({ id });
  const db: any = {
    store,
    collection: () => ({ doc: (id: string) => ref(id) }),
    runTransaction: async (fn: (tx: any) => Promise<any>) => {
      const pendingWrites: Array<[string, any]> = [];
      const tx = {
        get: async (r: any) => ({ exists: store.has(r.id), data: () => store.get(r.id) }),
        set: (r: any, v: any, o?: any) => pendingWrites.push([r.id, o?.merge ? { ...(store.get(r.id) ?? {}), ...v } : v]),
      };
      const result = await fn(tx);
      pendingWrites.forEach(([k, v]) => store.set(k, v));
      return result;
    },
  };
  return db;
}

afterEach(() => { delete process.env.ASK_TEACHER_USER_DAILY_CAP; delete process.env.ASK_TEACHER_SCHOOL_DAILY_CAP; });

describe('Ask Teacher guard', () => {
  it('maps the role spellings in use onto the release-gate roles', () => {
    expect(canonicalEnrichmentRole('super_admin')).toBe('Director');
    expect(canonicalEnrichmentRole('Head Teacher')).toBe('Administrator');
    expect(canonicalEnrichmentRole('TEACHER')).toBe('Teacher');
    expect(canonicalEnrichmentRole('student')).toBe('student');
    expect(canonicalEnrichmentRole(null)).toBeNull();
  });

  it('while Under Construction only staff roles with a school (or a director) may use it', () => {
    expect(mayUseAskTeacher({ uid: 'a', role: 'Teacher', schoolId: 's1' })).toEqual({ allowed: true });
    expect(mayUseAskTeacher({ uid: 'a', role: 'student', schoolId: 's1' })).toMatchObject({ allowed: false });
    expect(mayUseAskTeacher({ uid: 'a', role: 'parent', schoolId: 's1' })).toMatchObject({ allowed: false });
    expect(mayUseAskTeacher({ uid: 'a', role: 'Teacher', schoolId: null })).toMatchObject({ allowed: false, reason: 'no-school' });
    expect(mayUseAskTeacher({ uid: 'a', role: 'super_admin', schoolId: null })).toEqual({ allowed: true });
    expect(mayUseAskTeacher({ uid: 'a', role: null, schoolId: 's1' })).toMatchObject({ allowed: false });
  });

  it('shared per-user daily cap holds across calls (and therefore across serverless instances)', async () => {
    process.env.ASK_TEACHER_USER_DAILY_CAP = '3';
    const db = fakeDb();
    const caller = { uid: 'u1', role: 'Teacher', schoolId: 's1' };
    const day = new Date('2026-11-29T10:00:00Z');
    const results = [];
    for (let i = 0; i < 5; i++) results.push(await reserveSharedAiCall(caller, day, db));
    expect(results.map((r) => r.ok)).toEqual([true, true, true, false, false]);
    expect((results[3] as any).reason).toBe('user-cap');
    // another user is unaffected, and the next day resets
    expect((await reserveSharedAiCall({ uid: 'u2', role: 'Teacher', schoolId: 's1' }, day, db)).ok).toBe(true);
    expect((await reserveSharedAiCall(caller, new Date('2026-11-30T00:00:01Z'), db)).ok).toBe(true);
  });

  it('shared per-school cap stops a whole school even when each user is under their own cap', async () => {
    process.env.ASK_TEACHER_USER_DAILY_CAP = '10';
    process.env.ASK_TEACHER_SCHOOL_DAILY_CAP = '4';
    const db = fakeDb();
    const day = new Date('2026-11-29T10:00:00Z');
    const ok: boolean[] = [];
    for (let i = 0; i < 6; i++) ok.push((await reserveSharedAiCall({ uid: `u${i}`, role: 'Teacher', schoolId: 's1' }, day, db)).ok);
    expect(ok).toEqual([true, true, true, true, false, false]);
    expect((await reserveSharedAiCall({ uid: 'x', role: 'Teacher', schoolId: 's2' }, day, db)).ok).toBe(true); // other school unaffected
  });

  it('a refused reservation consumes nothing (no counter drift)', async () => {
    process.env.ASK_TEACHER_USER_DAILY_CAP = '1';
    const db = fakeDb();
    const caller = { uid: 'u1', role: 'Teacher', schoolId: 's1' };
    const day = new Date('2026-11-29T10:00:00Z');
    await reserveSharedAiCall(caller, day, db);
    await reserveSharedAiCall(caller, day, db);
    await reserveSharedAiCall(caller, day, db);
    expect(db.store.get('u_u1_2026-11-29').count).toBe(1);
    expect(db.store.get('s_s1_2026-11-29').count).toBe(1);
  });

  it('FAILS CLOSED when the counter store is unavailable (budget is protected)', async () => {
    const broken: any = { collection: () => ({ doc: () => ({}) }), runTransaction: async () => { throw new Error('firestore down'); } };
    expect(await reserveSharedAiCall({ uid: 'u', role: 'Teacher', schoolId: 's' }, new Date(), broken)).toEqual({ ok: false, reason: 'unavailable' });
  });

  it('default caps are conservative and configurable', () => {
    expect(ASK_TEACHER_CAPS.perUserPerDay()).toBe(30);
    expect(ASK_TEACHER_CAPS.perSchoolPerDay()).toBe(1000);
    process.env.ASK_TEACHER_USER_DAILY_CAP = '7';
    expect(ASK_TEACHER_CAPS.perUserPerDay()).toBe(7);
  });
});
