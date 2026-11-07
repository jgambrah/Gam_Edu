import { describe, it, expect } from 'vitest';
import { classifyMembership, type Snapshot } from './membership-audit';

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
