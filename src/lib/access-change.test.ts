import { describe, it, expect } from 'vitest';
import { planAccessChange, type Actor, type Profile } from './access-change';

const superAdmin: Actor = { uid: 'root', isSuperAdmin: true };
const directorA: Actor = { uid: 'dirA', isSuperAdmin: false, schoolId: 'A', role: 'Director' };
const registrarA: Actor = { uid: 'regA', isSuperAdmin: false, schoolId: 'A', role: 'Registrar' };
const directorB: Actor = { uid: 'dirB', isSuperAdmin: false, schoolId: 'B', role: 'Director' };
const teacher = (): Profile => ({ uid: 't1', usersDoc: { schoolId: 'A', role: 'Teacher' }, staffDoc: { schoolId: 'A', role: 'Teacher' } });
const parent = (): Profile => ({ uid: 'p1', usersDoc: { schoolId: 'A', role: 'Parent' }, parentsDoc: { schoolId: 'A', studentIds: ['s1', 's2'] } });

describe('role changes inside a school', () => {
  it('a director can promote a teacher; every profile document agrees and tokens are revoked', () => {
    const p = planAccessChange(teacher(), { role: 'Accountant' }, directorA);
    expect(p.ok).toBe(true);
    expect(p.writes).toEqual([
      { path: 'users/t1', op: 'set', data: { schoolId: 'A', role: 'Accountant' } },
      { path: 'staff/t1', op: 'set', data: { schoolId: 'A', role: 'Accountant' } },
    ]);
    expect(p).toMatchObject({ revokeTokens: true, bumpClaimsVersion: true, audit: { action: 'CHANGE_ROLE' } });
  });
  it('another school’s director cannot', () => expect(planAccessChange(teacher(), { role: 'Accountant' }, directorB).ok).toBe(false));
  it('a registrar cannot change roles', () => expect(planAccessChange(teacher(), { role: 'Accountant' }, registrarA).ok).toBe(false));
  it('only a director may hand out an administrator role', () => {
    expect(planAccessChange(teacher(), { role: 'Director' }, directorA).ok).toBe(true);
    expect(planAccessChange(teacher(), { role: 'Director' }, { ...directorA, role: 'Principal' }).ok).toBe(false);
  });
  it('nobody can assign a super-admin role this way, super admin included', () => {
    expect(planAccessChange(teacher(), { role: 'super_admin' }, superAdmin).ok).toBe(false);
    expect(planAccessChange(teacher(), { role: 'Super Admin' }, directorA).ok).toBe(false);
  });
  it('a director cannot change their own role (no self-escalation)', () => {
    const self: Profile = { uid: 'dirA', usersDoc: { schoolId: 'A', role: 'Director' }, staffDoc: { schoolId: 'A', role: 'Director' } };
    expect(planAccessChange(self, { role: 'Owner' }, directorA).ok).toBe(false);
  });
});

describe('school transfers', () => {
  it('only a platform administrator can transfer', () => {
    expect(planAccessChange(teacher(), { schoolId: 'B' }, directorA).ok).toBe(false);
    expect(planAccessChange(teacher(), { schoolId: 'B' }, directorB).ok).toBe(false);
    expect(planAccessChange(teacher(), { schoolId: 'B' }, superAdmin).ok).toBe(true);
  });
  it('updates every profile document so the old school keeps no membership', () => {
    const p = planAccessChange(teacher(), { schoolId: 'B' }, superAdmin);
    for (const w of p.writes) expect(w.data?.schoolId).toBe('B');
    expect(p.writes.map(w => w.path).sort()).toEqual(['staff/t1', 'users/t1']);
    expect(p.audit?.details).toContain('A → B');
  });
  it('drops a parent’s links to pupils of the old school', () => {
    const p = planAccessChange(parent(), { schoolId: 'B' }, superAdmin);
    expect(p.writes.find(w => w.path === 'parents/p1')?.data).toEqual({ schoolId: 'B', studentIds: [] });
  });
  it('keeps a parent’s pupils when only the role/school is unchanged', () => {
    const p = planAccessChange(parent(), { role: 'Parent' }, directorA);
    expect(p.writes.find(w => w.path === 'parents/p1')?.data).toEqual({ schoolId: 'A' });
  });
  it('a transfer plus role change is recorded as one audited step', () => {
    const p = planAccessChange(teacher(), { schoolId: 'B', role: 'Accountant' }, superAdmin);
    expect(p.audit).toEqual({ action: 'TRANSFER_SCHOOL', details: 'school A → B; role Teacher → Accountant' });
  });
});

describe('guards', () => {
  it('rejects empty changes and people with no school', () => {
    expect(planAccessChange(teacher(), {}, superAdmin).ok).toBe(false);
    expect(planAccessChange({ uid: 'x' }, { role: 'Teacher' }, superAdmin).ok).toBe(false);
  });
  it('every successful plan revokes tokens (a stale token must not outlive a change)', () => {
    for (const [c, a] of [[{ role: 'Cook' }, directorA], [{ schoolId: 'B' }, superAdmin]] as const)
      expect(planAccessChange(teacher(), c, a)).toMatchObject({ ok: true, revokeTokens: true, bumpClaimsVersion: true });
  });
});
