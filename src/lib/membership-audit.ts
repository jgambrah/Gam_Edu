/** Pure classification logic for scripts/audit-school-membership.ts (kept separate so it can be unit-tested). */
export type Profile = { schoolId?: string | null; role?: string | null };
export type Snapshot = {
  users: Map<string, Profile>; staff: Map<string, Profile>; students: Map<string, Profile>; parents: Map<string, Profile>;
  schoolIds: Set<string>;
};
export type Finding = { kind: string; collection: string; uid: string; detail?: string };

export function classifyMembership(s: Snapshot): Finding[] {
  const out: Finding[] = [];
  for (const [uid, p] of s.staff) {
    const u = s.users.get(uid);
    if (!u) out.push({ kind: 'staffWithoutUsersDoc', collection: 'staff', uid });
    else if (u.schoolId && p.schoolId && u.schoolId !== p.schoolId)
      out.push({ kind: 'staffSchoolMismatch', collection: 'staff', uid, detail: 'users.schoolId differs from staff.schoolId' });
  }
  for (const [name, m] of [['users', s.users], ['staff', s.staff], ['students', s.students], ['parents', s.parents]] as const)
    for (const [uid, p] of m) {
      if (!p.schoolId) out.push({ kind: 'emptySchoolId', collection: name, uid });
      else if (!s.schoolIds.has(p.schoolId)) out.push({ kind: 'unknownSchool', collection: name, uid });
    }
  return out;
}

/**
 * Safety check before the audit touches anything: the project the credentials point at must be the one the operator
 * explicitly confirmed on the command line. Returns an error message, or null when it is safe to proceed.
 */
export function checkProjectConfirmation(resolvedProjectId: string | undefined, confirmArg: string | undefined, opts: { emulator: boolean }): string | null {
  if (opts.emulator) return null; // emulator runs hold no real data
  if (!resolvedProjectId) return 'Could not determine which Firebase project these credentials belong to. Set FIREBASE_PROJECT_ID.';
  if (!confirmArg) return `Refusing to run: pass --confirm-project=${resolvedProjectId} to confirm this is the project you mean to audit.`;
  if (confirmArg !== resolvedProjectId) return `Refusing to run: you confirmed "${confirmArg}" but the credentials belong to "${resolvedProjectId}".`;
  return null;
}
