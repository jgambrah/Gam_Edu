"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onParentDocWriteSyncClaims = exports.onStudentDocWriteSyncClaims = exports.onUserDocWriteSyncClaims = exports.onStaffWriteSyncClaims = void 0;
exports.isCustomClaimsEnabled = isCustomClaimsEnabled;
exports.resolveCanonicalClaimsForUid = resolveCanonicalClaimsForUid;
exports.syncUserCustomClaims = syncUserCustomClaims;
/**
 * Custom Auth Claims Sync (`{ role, schoolId }`) — gated behind `ENABLE_CUSTOM_CLAIMS === 'true'`.
 *
 * Why: Without custom claims on the Firebase ID token, every Firestore request evaluates `exists()` + `get()`
 * against `staff/{uid}`, `users/{uid}`, `students/{uid}`, and `parents/{uid}` inside `firestore.rules`
 * (2-4 billed reads per request). When `ENABLE_CUSTOM_CLAIMS=true`, custom claims `{ role, schoolId }` are
 * stamped on login and whenever a profile document changes, dropping rule lookup cost to 0 reads while
 * keeping the full Firestore document fallback in `firestore.rules` for accounts without claims.
 */
const firestore_1 = require("firebase-functions/v2/firestore");
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const firestore_2 = require("firebase-admin/firestore");
if (!(0, app_1.getApps)().length)
    (0, app_1.initializeApp)();
const MERCY_ADMIN_UID = '7GVi5qCxC4YDnjKkjVwSjAYtQz73';
const MERCY_ADMIN_EMAIL = 'atampokaadongo@gmail.com';
const MERCY_SCHOOL_ID = 'oHr3BrGdK2eS5MQ5zmZU';
function isCustomClaimsEnabled() {
    return (process.env.ENABLE_CUSTOM_CLAIMS === 'true' ||
        process.env.NEXT_PUBLIC_ENABLE_CUSTOM_CLAIMS === 'true');
}
/**
 * Resolves `{ role, schoolId }` using the exact same precedence as `getUserRole()` & `getUserSchoolId()`
 * in `firestore.rules` (`staff/{uid}` -> `users/{uid}` -> `students/{uid}` -> `parents/{uid}`).
 */
async function resolveCanonicalClaimsForUid(store, uid, email) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (uid === MERCY_ADMIN_UID || cleanEmail === MERCY_ADMIN_EMAIL) {
        return { role: 'Director', schoolId: MERCY_SCHOOL_ID };
    }
    const [staffSnap, userSnap, studentSnap, parentSnap] = await Promise.all([
        store.collection('staff').doc(uid).get(),
        store.collection('users').doc(uid).get(),
        store.collection('students').doc(uid).get(),
        store.collection('parents').doc(uid).get(),
    ]);
    const staff = staffSnap.exists ? staffSnap.data() : null;
    const user = userSnap.exists ? userSnap.data() : null;
    const student = studentSnap.exists ? studentSnap.data() : null;
    const parent = parentSnap.exists ? parentSnap.data() : null;
    const schoolId = ((staff === null || staff === void 0 ? void 0 : staff.schoolId) ? String(staff.schoolId) : '') ||
        ((user === null || user === void 0 ? void 0 : user.schoolId) ? String(user.schoolId) : '') ||
        ((student === null || student === void 0 ? void 0 : student.schoolId) ? String(student.schoolId) : '') ||
        ((parent === null || parent === void 0 ? void 0 : parent.schoolId) ? String(parent.schoolId) : '') ||
        null;
    const role = ((staff === null || staff === void 0 ? void 0 : staff.role) ? String(staff.role) : '') ||
        ((user === null || user === void 0 ? void 0 : user.role) ? String(user.role) : '') ||
        (student ? 'Student' : '') ||
        (parent ? 'Parent' : '') ||
        null;
    return { role, schoolId };
}
/**
 * Stamps `{ role, schoolId }` onto Firebase Auth custom claims while preserving all unrelated claims
 * (such as `story_publisher`, `super_admin`, etc.). Clears `role` / `schoolId` if the profile was removed.
 */
async function syncUserCustomClaims(params) {
    var _a, _b;
    const enabled = params.forceWhenFlagOff === true || isCustomClaimsEnabled();
    if (!enabled) {
        return { enabled: false, updated: false, role: null, schoolId: null };
    }
    const auth = params.auth || (0, auth_1.getAuth)();
    const store = params.store || (0, firestore_2.getFirestore)();
    const authUser = await auth.getUser(params.uid);
    const existingClaims = Object.assign({}, (authUser.customClaims || {}));
    const { role, schoolId } = await resolveCanonicalClaimsForUid(store, params.uid, authUser.email);
    const prevRole = (_a = existingClaims.role) !== null && _a !== void 0 ? _a : null;
    const prevSchoolId = (_b = existingClaims.schoolId) !== null && _b !== void 0 ? _b : null;
    if (prevRole === role && prevSchoolId === schoolId) {
        return { enabled: true, updated: false, role, schoolId };
    }
    const nextClaims = Object.assign({}, existingClaims);
    if (role)
        nextClaims.role = role;
    else
        delete nextClaims.role;
    if (schoolId)
        nextClaims.schoolId = schoolId;
    else
        delete nextClaims.schoolId;
    await auth.setCustomUserClaims(params.uid, nextClaims);
    return { enabled: true, updated: true, role, schoolId };
}
function didClaimFieldsChange(before, after) {
    if (!before || !after)
        return true;
    return String(before.role || '') !== String(after.role || '') ||
        String(before.schoolId || '') !== String(after.schoolId || '');
}
async function handleProfileClaimTrigger(uid, before, after) {
    if (!isCustomClaimsEnabled())
        return;
    if (!uid || !didClaimFieldsChange(before, after))
        return;
    try {
        await syncUserCustomClaims({ uid });
    }
    catch (err) {
        // Non-Auth placeholder roster docs (whose doc id is not a Firebase Auth UID) raise auth/user-not-found — safe to ignore
        if ((err === null || err === void 0 ? void 0 : err.code) === 'auth/user-not-found')
            return;
        console.warn('[authClaims] Failed to sync claims for', uid, err === null || err === void 0 ? void 0 : err.message);
    }
}
exports.onStaffWriteSyncClaims = (0, firestore_1.onDocumentWritten)('staff/{uid}', async (event) => {
    var _a, _b, _c, _d;
    const before = ((_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before) === null || _b === void 0 ? void 0 : _b.exists) ? event.data.before.data() : null;
    const after = ((_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.after) === null || _d === void 0 ? void 0 : _d.exists) ? event.data.after.data() : null;
    await handleProfileClaimTrigger(event.params.uid, before, after);
});
exports.onUserDocWriteSyncClaims = (0, firestore_1.onDocumentWritten)('users/{uid}', async (event) => {
    var _a, _b, _c, _d;
    const before = ((_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before) === null || _b === void 0 ? void 0 : _b.exists) ? event.data.before.data() : null;
    const after = ((_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.after) === null || _d === void 0 ? void 0 : _d.exists) ? event.data.after.data() : null;
    await handleProfileClaimTrigger(event.params.uid, before, after);
});
exports.onStudentDocWriteSyncClaims = (0, firestore_1.onDocumentWritten)('students/{uid}', async (event) => {
    var _a, _b, _c, _d;
    const before = ((_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before) === null || _b === void 0 ? void 0 : _b.exists) ? event.data.before.data() : null;
    const after = ((_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.after) === null || _d === void 0 ? void 0 : _d.exists) ? event.data.after.data() : null;
    await handleProfileClaimTrigger(event.params.uid, before, after);
});
exports.onParentDocWriteSyncClaims = (0, firestore_1.onDocumentWritten)('parents/{uid}', async (event) => {
    var _a, _b, _c, _d;
    const before = ((_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before) === null || _b === void 0 ? void 0 : _b.exists) ? event.data.before.data() : null;
    const after = ((_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.after) === null || _d === void 0 ? void 0 : _d.exists) ? event.data.after.data() : null;
    await handleProfileClaimTrigger(event.params.uid, before, after);
});
//# sourceMappingURL=auth-claims.js.map