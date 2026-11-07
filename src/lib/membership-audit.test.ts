import { describe, it, expect } from 'vitest';
import { classifyMembership, checkProjectConfirmation, type Snapshot } from './membership-audit';

const snap = (o: Partial<Snapshot>): Snapshot => ({
  users: new Map(), staff: new Map(), students: new Map(), parents: new Map(), schoolIds: new Set(['A', 'B']), ...o,
});
const kinds = (s: Snapshot) => classifyMembership(s).map(f => `${f.kind}:${f.uid}`).sort();

describe('classifyMembership', () => {
  it('a clean school has no findings', () => {
    expect(kinds(snap({
      users: new Map([['t1', { schoolId: 'A' }]]), staff: new Map([['t1', { schoolId: 'A' }]]),
      students: new Map([['s1', { schoolId: 'A' }]]),
    }))).toEqual([]);
  });
  it('flags staff with no users document (would still work, but is the older shape)', () => {
    expect(kinds(snap({ staff: new Map([['t1', { schoolId: 'A' }]]) }))).toEqual(['staffWithoutUsersDoc:t1']);
  });
  it('flags a staff/users school mismatch (the case where token-vs-document rules disagree)', () => {
    expect(kinds(snap({ users: new Map([['t1', { schoolId: 'B' }]]), staff: new Map([['t1', { schoolId: 'A' }]]) })))
      .toEqual(['staffSchoolMismatch:t1']);
  });
  it('flags empty and unknown school ids', () => {
    expect(kinds(snap({ users: new Map([['u1', { schoolId: '' }], ['u2', { schoolId: 'ghost' }]]) })))
      .toEqual(['emptySchoolId:u1', 'unknownSchool:u2']);
  });
});

describe('checkProjectConfirmation (the audit must not run against the wrong project)', () => {
  it('accepts an exact match', () => expect(checkProjectConfirmation('proj-a', 'proj-a', { emulator: false })).toBeNull());
  it('refuses without a confirmation, naming the project to confirm', () =>
    expect(checkProjectConfirmation('proj-a', undefined, { emulator: false })).toContain('--confirm-project=proj-a'));
  it('refuses a mismatch', () => expect(checkProjectConfirmation('proj-a', 'proj-b', { emulator: false })).toContain('proj-b'));
  it('refuses when the project is unknown', () => expect(checkProjectConfirmation(undefined, 'x', { emulator: false })).toContain('FIREBASE_PROJECT_ID'));
  it('does not require confirmation for the emulator', () => expect(checkProjectConfirmation('demo', undefined, { emulator: true })).toBeNull());
});
