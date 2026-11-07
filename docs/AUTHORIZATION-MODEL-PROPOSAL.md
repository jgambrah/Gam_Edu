# Proposal: one authorization model for Storage, Firestore and server code

Status: **proposal — not implemented, nothing deployed.** Needs your decision.

## What exists today (verified in code and by emulator tests)
| Layer | How it decides "which school / what role" | Stale or hand-set claim effect |
|---|---|---|
| Storage rules (new, this branch) | Firestore profile docs only (`users`, `staff`, `students`, `parents`); claims ignored | None — a claim grants nothing |
| Firestore rules (`getUserSchoolId`, `getUserRole`) | **Token claim first**, then `staff` → `users` → … docs | Claim **overrides** the real school/role (tests: "KNOWN ISSUE S5") |
| Server code (`session-guard.schoolsOfUser`) | **Union** of claim + hard-coded ids + all profile docs | A stale claim **adds** a school; a person can be a member of several |

Nothing in this repo ever calls `setCustomUserClaims`, so today claims are empty and all three layers agree *in practice*. The risk is future: the day someone starts setting claims (or a client SDK path sets them), the three layers diverge and a school change or demotion is honoured by one layer and ignored by another.

Also verified: Firestore helpers read `request.auth.token.email` unguarded; a token without `email` makes `isSuperAdmin()` error and denies everyone (hit by my first CI run). Real email/password logins carry an email, but phone/anonymous/custom-token logins would not.

## Recommended model: **profile documents are the source of truth; claims are an optional, verified cache**
1. **Source of truth:** `users/{uid} = { schoolId, role }`, written only by server code (`create-user.ts`, and a new `changeSchoolOrRole` action). `staff/students/parents` docs stay as role records but must agree with `users/{uid}`.
2. **Rules read documents, not claims** (Firestore rules: delete the claim branch from `getUserSchoolId`/`getUserRole`; Storage already does this). Cost: one extra `get()` per request, already paid for most paths (cached within a request).
3. **If claims are wanted later (to save reads), they must carry a version stamp** (`claimsVersion`) and rules accept them only when `claimsVersion == users/{uid}.claimsVersion`. Changing school/role bumps the doc version, so every old token is invalid immediately — no waiting for token expiry.
4. **Changing school or role is one server action** that, in one batch: updates `users/{uid}`, the role-specific doc, bumps `claimsVersion`, calls `revokeRefreshTokens(uid)`, and writes an audit-log entry. Old files stay in the old school's folders (paths are school-scoped), which is the correct behaviour.
5. **Server code and rules use the same rule:** a person belongs to exactly the school in `users/{uid}.schoolId`. Multi-school people (if any are intended) get an explicit `schoolIds` array, not an accidental union of claim + docs.
6. **Hard-coded super-admin uids/emails** move to a single `platform_admins/{uid}` document (rules + server read the same place) so access can be revoked without a rules deploy.
7. **Guard token fields** (`'email' in request.auth.token`) in every helper.

## Handling change of school / role
- Promotion/demotion/transfer takes effect on the **next request** under (2), because rules read the document. With (3) any claim-based fast path is invalidated by the version bump; `revokeRefreshTokens` forces fresh tokens.
- Leaving a school: remove or retarget `users/{uid}.schoolId`; Storage access to the old folders ends immediately (download URLs already issued do not — see below).

## Known limit unaffected by any model
Files shared as `?alt=media&token=…` download URLs stay readable by anyone holding the URL. Revoke by regenerating the token (Admin SDK) or moving the file; future uploads (Story Spark covers) should be read through rules-checked `getDownloadURL`-less paths where privacy matters (pupil photos, documents).

## Migration plan (staged, each stage reversible)
1. Run `scripts/audit-school-membership.ts` (counts only) → fix accounts lacking `users/{uid}.schoolId`.
2. Backfill `users/{uid}` where missing (additive script, dry-run first).
3. Deploy Firestore helper change behind the audit being clean; keep the old rules file for instant rollback.
4. Add `changeSchoolOrRole` action + tests; stop any other code path from editing `schoolId`/`role` directly.

---
## Update (workstream E): access-change planner and further findings

**Implemented as pure, tested code (no deployment):** `src/lib/access-change.ts` + 13 tests. It turns "change this person's school or role" into an explicit plan:
- **Who may do it:** role changes inside a school → that school's director (not a registrar); an administrator role → a director only; **school transfers → platform administrator only**; nobody can change their own school/role; `super_admin` can never be assigned this way.
- **What it writes:** every profile document (`users`, and `staff`/`students`/`parents` where present) gets the same `schoolId`/`role`, so the old school keeps no membership; a parent's `studentIds` are cleared on transfer so links to the old school's pupils don't survive.
- **What it demands of the executor:** revoke refresh tokens, bump the claims version, write an audit entry (`CHANGE_ROLE` / `TRANSFER_SCHOOL`).
The server action that executes a plan (one Firestore batch + `revokeRefreshTokens`) and the removal of the claim branch in `firestore.rules` are the remaining steps; both need your approval to ship.

**Further findings while tracing workflows for the hardening branch (not changed):**
1. `isTeacher()` in `firestore.rules` is true for **anyone with a `staff` document** (cook, cleaner, security…), so those roles currently pass "teacher" checks. The hardening branch binds every such check to the person's own school, but role granularity is still coarse; a role-aware `isStaff()` is part of this proposal (step 1: users/{uid}.role is the source of truth).
2. `getUserSchoolId()` resolves school in the order claim → staff doc → users doc → students → parents. A person with documents in two schools resolves to whichever matches first; the planner above prevents creating that state, and the membership audit reports the existing cases (`staffSchoolMismatch`).
3. Server code (`session-guard`) accepts **several** schools per person; rules accept **one**. Decide whether multi-school staff are a real requirement; if so they need an explicit `schoolIds` array that rules and server both honour.
