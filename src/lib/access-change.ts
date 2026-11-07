/**
 * Pure planner for school transfers and role changes (see docs/AUTHORIZATION-MODEL-PROPOSAL.md).
 * It decides WHAT must change so that nobody keeps access they should lose; a server action (not yet written)
 * would execute the plan in one batch and revoke the person's tokens. Nothing here touches Firebase.
 */
export type Kind = 'staff' | 'students' | 'parents';
export interface Profile { uid: string; usersDoc?: { schoolId?: string; role?: string } | null; staffDoc?: { schoolId?: string; role?: string } | null; studentsDoc?: { schoolId?: string } | null; parentsDoc?: { schoolId?: string; studentIds?: string[] } | null; }
export interface Actor { uid: string; isSuperAdmin: boolean; schoolId?: string; role?: string; }
export interface Change { schoolId?: string; role?: string; }
export type Write = { path: string; op: 'set' | 'delete'; data?: Record<string, any> };
export interface Plan { ok: boolean; error?: string; writes: Write[]; revokeTokens: boolean; bumpClaimsVersion: boolean; audit?: { action: string; details: string }; }

const ADMIN_ROLES = ['Director', 'Administrator', 'Admin', 'Principal', 'Headmaster', 'Headmistress', 'Head Teacher', 'Owner', 'Registrar', 'Admissions'];
const FORBIDDEN_ROLES = ['super_admin', 'Super Admin', 'superadmin'];
const isSchoolAdmin = (a: Actor, schoolId: string) => a.schoolId === schoolId && !!a.role && ADMIN_ROLES.includes(a.role) && !['Registrar', 'Admissions'].includes(a.role);
const deny = (error: string): Plan => ({ ok: false, error, writes: [], revokeTokens: false, bumpClaimsVersion: false });

export function planAccessChange(target: Profile, change: Change, actor: Actor): Plan {
  const currentSchool = target.usersDoc?.schoolId || target.staffDoc?.schoolId || target.studentsDoc?.schoolId || target.parentsDoc?.schoolId || '';
  const currentRole = target.usersDoc?.role || target.staffDoc?.role || '';
  const newSchool = change.schoolId ?? currentSchool;
  const newRole = change.role ?? currentRole;

  if (!change.schoolId && !change.role) return deny('Nothing to change.');
  if (target.uid === actor.uid && !actor.isSuperAdmin) return deny('You cannot change your own school or role.');
  if (FORBIDDEN_ROLES.includes(newRole)) return deny('That role cannot be assigned here.');
  if (!newSchool) return deny('A person must belong to a school.');

  const transfer = newSchool !== currentSchool;
  if (transfer) {
    if (!actor.isSuperAdmin) return deny('Only a platform administrator can move someone to another school.');
  } else if (!actor.isSuperAdmin) {
    if (!isSchoolAdmin(actor, currentSchool)) return deny('Only a school director can change roles at this school.');
    if (ADMIN_ROLES.includes(newRole) && actor.role !== 'Director' && actor.role !== 'Owner') return deny('Only a director can assign an administrator role.');
  }

  const writes: Write[] = [];
  const base = { schoolId: newSchool, ...(newRole ? { role: newRole } : {}) };
  writes.push({ path: `users/${target.uid}`, op: 'set', data: base });
  if (target.staffDoc) writes.push({ path: `staff/${target.uid}`, op: 'set', data: base });
  if (target.studentsDoc) writes.push({ path: `students/${target.uid}`, op: 'set', data: { schoolId: newSchool } });
  if (target.parentsDoc) {
    // A parent's links to children belong to the old school: drop them on transfer so no stale access to those pupils survives.
    writes.push({ path: `parents/${target.uid}`, op: 'set', data: { schoolId: newSchool, ...(transfer ? { studentIds: [] } : {}) } });
  }
  return {
    ok: true, writes,
    revokeTokens: true,            // old tokens/claims stop working at once
    bumpClaimsVersion: true,       // any claim-based fast path is invalidated
    audit: { action: transfer ? 'TRANSFER_SCHOOL' : 'CHANGE_ROLE', details: `${transfer ? `school ${currentSchool || '(none)'} → ${newSchool}` : ''}${transfer && newRole !== currentRole ? '; ' : ''}${newRole !== currentRole ? `role ${currentRole || '(none)'} → ${newRole}` : ''}` },
  };
}
