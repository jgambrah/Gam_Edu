"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onAssessmentWriteForSummary = exports.ACADEMIC_SUMMARY = void 0;
exports.markPart = markPart;
exports.contribution = contribution;
/**
 * Academic summary per school and term, kept by the server from every mark (assessments/{id}).
 *
 *   academicSummary/{schoolId}__{termId} = {
 *     schoolId, termId,
 *     totals:   { s, c, p }                         s = sum of % scores, c = marks, p = marks ≥ 50%
 *     classes:  { <classId>:   { s, c, p } }
 *     subjects: { <subjectId>: { s, c, p, name } }
 *     teachers: { <teacherId>: { s, c, p } }
 *     students: { <studentId>: { s, c, name, classId, f: { <subjectId>: marks below 50% } } }
 *   }
 *
 * The Director's Academic Affairs page reads ONE of these documents for the term (plus the last few
 * terms for the trend line) instead of a random sample of 50 marks, so its averages, rankings and
 * at-risk list cover every mark entered. Kept by increments (no reads); rebuild-academic-summary.js
 * builds it once from existing marks.
 */
const firestore_1 = require("firebase-functions/v2/firestore");
const app_1 = require("firebase-admin/app");
const firestore_2 = require("firebase-admin/firestore");
const term_utils_1 = require("./term-utils");
if (!(0, app_1.getApps)().length)
    (0, app_1.initializeApp)();
const db = (0, firestore_2.getFirestore)();
const ACADEMIC_SUMMARY = (schoolId, termId) => db.collection('academicSummary').doc(`${schoolId}__${termId}`);
exports.ACADEMIC_SUMMARY = ACADEMIC_SUMMARY;
const safeKey = (v) => String(v || '').replace(/[.\/\[\]#$*`~]/g, '_').slice(0, 120);
/** What one mark contributes, or null if it is not a usable mark. */
function markPart(a) {
    if (!a || !a.schoolId || !a.studentId)
        return null;
    const score = Number(a.score);
    const max = Number(a.maxScore);
    if (!Number.isFinite(score) || !(max > 0))
        return null;
    const pct = Math.max(0, Math.min(100, (score / max) * 100));
    const st = (0, term_utils_1.termStampOfRecord)(a);
    return {
        schoolId: String(a.schoolId),
        termId: (st === null || st === void 0 ? void 0 : st.termId) || 'unknown',
        pct,
        pass: pct >= 50 ? 1 : 0,
        classId: safeKey(a.classId),
        subjectId: safeKey(a.subjectId || a.subjectName || 'general'),
        subjectName: String(a.subjectName || ''),
        teacherId: safeKey(a.teacherId),
        studentId: safeKey(a.studentId),
        studentName: String(a.studentName || ''),
    };
}
/** Adds (sign 1) or removes (sign -1) one mark's contribution — as a nested update object. */
function contribution(m, sign, inc) {
    const sp = inc(sign * m.pct), c1 = inc(sign), p1 = inc(sign * m.pass);
    const out = {
        schoolId: m.schoolId,
        termId: m.termId,
        totals: { s: sp, c: c1, p: p1 },
        students: {
            [m.studentId]: Object.assign(Object.assign(Object.assign({ s: sp, c: c1 }, (sign > 0 && m.studentName ? { name: m.studentName } : {})), (sign > 0 && m.classId ? { classId: m.classId } : {})), (m.pass ? {} : { f: { [m.subjectId]: c1 } })),
        },
    };
    if (m.classId)
        out.classes = { [m.classId]: { s: sp, c: c1, p: p1 } };
    if (m.subjectId)
        out.subjects = { [m.subjectId]: Object.assign({ s: sp, c: c1, p: p1 }, (sign > 0 && m.subjectName ? { name: m.subjectName } : {})) };
    if (m.teacherId)
        out.teachers = { [m.teacherId]: { s: sp, c: c1, p: p1 } };
    return out;
}
exports.onAssessmentWriteForSummary = (0, firestore_1.onDocumentWritten)('assessments/{assessmentId}', async (event) => {
    var _a, _b, _c, _d;
    const before = markPart(((_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before) === null || _b === void 0 ? void 0 : _b.exists) ? event.data.before.data() : null);
    const after = markPart(((_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.after) === null || _d === void 0 ? void 0 : _d.exists) ? event.data.after.data() : null);
    if (!before && !after)
        return;
    // Nothing that matters changed (e.g. only a remark was edited).
    if (before && after && JSON.stringify(before) === JSON.stringify(after))
        return;
    const inc = (n) => firestore_2.FieldValue.increment(n);
    const writes = [];
    if (before)
        writes.push((0, exports.ACADEMIC_SUMMARY)(before.schoolId, before.termId).set(Object.assign(Object.assign({}, contribution(before, -1, inc)), { updatedAt: firestore_2.FieldValue.serverTimestamp() }), { merge: true }));
    if (after)
        writes.push((0, exports.ACADEMIC_SUMMARY)(after.schoolId, after.termId).set(Object.assign(Object.assign({}, contribution(after, 1, inc)), { updatedAt: firestore_2.FieldValue.serverTimestamp() }), { merge: true }));
    await Promise.all(writes).catch(e => console.warn('[academicSummary] update failed:', e === null || e === void 0 ? void 0 : e.message));
});
//# sourceMappingURL=academic-summary.js.map