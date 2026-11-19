"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flushDirtyClassSeriesProfiles = exports.onAssessmentWriteForSummary = exports.CLASS_SERIES_PROFILES = exports.CLASS_AVERAGES = exports.ACADEMIC_SUMMARY = exports.MAX_DIRTY_ATTEMPTS = exports.MAX_SCHEDULED_RECOMPUTES = exports.LEASE_WINDOW_MS = exports.INSTANCE_COOLDOWN_MS = void 0;
exports.resetAcademicSummaryMemoryCacheForTests = resetAcademicSummaryMemoryCacheForTests;
exports.isServerGradedQuizRecord = isServerGradedQuizRecord;
exports.isNoOpForProfileAndVersion = isNoOpForProfileAndVersion;
exports.computeCaProfilesForClassSubject = computeCaProfilesForClassSubject;
exports.classContribution = classContribution;
exports.markPart = markPart;
exports.contribution = contribution;
exports.processAssessmentWriteEvent = processAssessmentWriteEvent;
exports.runFlushDirtyProfiles = runFlushDirtyProfiles;
/**
 * Academic summary per school and term, kept by the server from every mark (assessments/{id}).
 *
 *   academicSummary/{schoolId}__{termId} = {
 *     schoolId, termId,
 *     totals:   { s, c, p }                         s = sum of % scores, c = marks, p = marks >= 50%
 *     classes:  { <classId>:   { s, c, p } }
 *     subjects: { <subjectId>: { s, c, p, name } }
 *     teachers: { <teacherId>: { s, c, p } }
 *     students: { <studentId>: { s, c, name, classId, f: { <subjectId>: marks below 50% } } }
 *   }
 *
 * Read-cost architecture for `classSeriesProfiles`:
 *   1. Server-graded quiz marks (`gradedOnServer: true` or `quizId`) never trigger CA profile scans.
 *   2. Archival-only mutations (term close / term unlock) skip profile scans completely (0 reads).
 *   3. Per-instance 60s cooldown Map exits BEFORE the lease transaction (0 reads during bursts).
 *   4. Lease window (5 min) marks `dirty.<safeSubId> = true` + `hasDirtyProfiles = true` (0-read merge)
 *      when writes trickle in too soon, and `flushDirtyClassSeriesProfiles` (every 5 minutes) recomputes
 *      each dirty subject ONCE and clears the flag.
 */
const firestore_1 = require("firebase-functions/v2/firestore");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const app_1 = require("firebase-admin/app");
const firestore_2 = require("firebase-admin/firestore");
const term_utils_1 = require("./term-utils");
if (!(0, app_1.getApps)().length)
    (0, app_1.initializeApp)();
const defaultDb = (0, firestore_2.getFirestore)();
exports.INSTANCE_COOLDOWN_MS = 60000;
exports.LEASE_WINDOW_MS = 5 * 60000;
exports.MAX_SCHEDULED_RECOMPUTES = 200;
exports.MAX_DIRTY_ATTEMPTS = 5;
const instanceCooldowns = new Map();
function resetAcademicSummaryMemoryCacheForTests() {
    instanceCooldowns.clear();
}
const ACADEMIC_SUMMARY = (schoolId, termId, store = defaultDb) => store.collection('academicSummary').doc(`${schoolId}__${termId}`);
exports.ACADEMIC_SUMMARY = ACADEMIC_SUMMARY;
const CLASS_AVERAGES = (schoolId, termId, classId, store = defaultDb) => store.collection('classAverages').doc(`${schoolId}__${termId}__${classId}`);
exports.CLASS_AVERAGES = CLASS_AVERAGES;
const CLASS_SERIES_PROFILES = (schoolId, termId, classId, store = defaultDb) => store.collection('classSeriesProfiles').doc(`${schoolId}__${termId}__${classId}`);
exports.CLASS_SERIES_PROFILES = CLASS_SERIES_PROFILES;
function isMockMarkRecord(a) {
    if (!a)
        return false;
    if (a.reportScope === 'mid_term' || a.mockSeries === 'mid_term' || a.standaloneMidTerm === true)
        return false;
    if (typeof a.mockSeries === 'string' && a.mockSeries.trim().startsWith('mock_'))
        return true;
    const typeLower = String(a.assessmentType || '').trim().toLowerCase();
    const cleanName = String(a.assessmentName || '').replace(/\(\s*100\s*%?\s*\)/gi, '').replace(/\b100\s*%/gi, '').trim();
    if (typeLower.includes('mock'))
        return true;
    return /^(?:(?:\d+(?:st|nd|rd|th)|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s+)?mock(?:\s+exam(?:ination)?s?)?(?:\s*#?\s*\d+)?$/i.test(cleanName);
}
function isDedicatedMidTermRecord(a) {
    if (!a || isMockMarkRecord(a))
        return false;
    if (a.reportScope === 'mid_term' || a.standaloneMidTerm === true || a.mockSeries === 'mid_term')
        return true;
    const typeLower = String(a.assessmentType || '').toLowerCase();
    const nameLower = String(a.assessmentName || '').toLowerCase();
    const combined = `${typeLower} ${nameLower}`;
    const hasMid = combined.includes('mid-term') || combined.includes('mid term') || combined.includes('midterm') || combined.includes('mid-sem') || combined.includes('mid sem') || combined.includes('midsemester');
    if (!hasMid)
        return false;
    return combined.includes('standalone') || combined.includes('100%') || typeLower === 'mid-term exam';
}
function isAnyMidTermRecord(a) {
    if (!a || isMockMarkRecord(a))
        return false;
    if (isDedicatedMidTermRecord(a))
        return true;
    const combined = `${a.assessmentType || ''} ${a.assessmentName || ''}`.toLowerCase();
    return combined.includes('mid-term') || combined.includes('mid term') || combined.includes('midterm') || combined.includes('mid-sem') || combined.includes('mid sem') || combined.includes('midsemester');
}
function isServerGradedQuizRecord(r) {
    return Boolean(r && (r.gradedOnServer === true || r.quizId));
}
const safeKey = (v) => String(v || '').replace(/[.\/\[\]#$*`~]/g, '_').slice(0, 120);
/**
 * Returns true if an update did NOT alter any score, component, class, subject, year, term, or termId
 * (or is purely a term-close / term-unlock archival flag toggle).
 */
function isNoOpForProfileAndVersion(rawBefore, rawAfter) {
    var _a, _b;
    if (!rawBefore || !rawAfter)
        return false;
    const contentSame = rawBefore.score === rawAfter.score &&
        rawBefore.maxScore === rawAfter.maxScore &&
        rawBefore.assessmentType === rawAfter.assessmentType &&
        rawBefore.assessmentName === rawAfter.assessmentName &&
        rawBefore.reportScope === rawAfter.reportScope &&
        rawBefore.midTermSlot === rawAfter.midTermSlot &&
        rawBefore.mockSeries === rawAfter.mockSeries &&
        rawBefore.standaloneMidTerm === rawAfter.standaloneMidTerm &&
        safeKey(rawBefore.classId) === safeKey(rawAfter.classId) &&
        safeKey(rawBefore.subjectId || rawBefore.subjectName || 'general') === safeKey(rawAfter.subjectId || rawAfter.subjectName || 'general');
    if (!contentSame)
        return false;
    // Term close / unlock rewrites `isArchived` (and stamps `closedInTermId` / `termId` / `unlockedForCorrection`)
    // without changing marks or subjects — must produce 0 scans.
    if (Boolean(rawBefore.isArchived) !== Boolean(rawAfter.isArchived)) {
        return true;
    }
    return (String(rawBefore.classId || '') === String(rawAfter.classId || '') &&
        String(rawBefore.subjectId || '') === String(rawAfter.subjectId || '') &&
        String(rawBefore.academicYear || '') === String(rawAfter.academicYear || '') &&
        String(rawBefore.term || '') === String(rawAfter.term || '') &&
        String(rawBefore.termId || '') === String(rawAfter.termId || '') &&
        (((_a = (0, term_utils_1.termStampOfRecord)(rawBefore)) === null || _a === void 0 ? void 0 : _a.termId) || '') === (((_b = (0, term_utils_1.termStampOfRecord)(rawAfter)) === null || _b === void 0 ? void 0 : _b.termId) || '') &&
        (0, term_utils_1.normalizeYear)(rawBefore.academicYear) === (0, term_utils_1.normalizeYear)(rawAfter.academicYear) &&
        (0, term_utils_1.termNumber)(rawBefore.term) === (0, term_utils_1.termNumber)(rawAfter.term));
}
/**
 * Computes anonymous class-subject CA structure (no student IDs, scores, or free-text names)
 * for End-of-Term and Mid-Term from all assessment docs of one (schoolId, termId, classId, subjectId).
 */
function computeCaProfilesForClassSubject(docs) {
    const eotTests = new Map();
    const mtTests = new Map();
    const eot = { testCount: 0, testMaxAvg: 0, hwMax: 0, projMax: 0, midMax: 0, examMax: 0, hasDedicatedMidTerm: false };
    const mt = { testCount: 0, testMaxAvg: 0, hwMax: 0, projMax: 0, midMax: 0, examMax: 0, hasDedicatedMidTerm: false };
    const num = (v, d) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : d; };
    const validDocs = (docs || []).filter(a => a && Number.isFinite(Number(a.score)));
    // 1. End of Term
    validDocs.forEach(a => {
        if (isMockMarkRecord(a) || isDedicatedMidTermRecord(a))
            return;
        if (isAnyMidTermRecord(a)) {
            const m = num(a.maxScore, 20);
            if (m > eot.midMax)
                eot.midMax = m;
            return;
        }
        const typeLower = String(a.assessmentType || '').toLowerCase();
        const nameLower = String(a.assessmentName || '').toLowerCase();
        const combined = `${typeLower} ${nameLower}`;
        if ((typeLower.includes('exam') && !typeLower.includes('ca')) || ((nameLower.includes('end of term') || nameLower.includes('terminal exam') || nameLower === 'exam') && !typeLower.includes('ca'))) {
            const m = num(a.maxScore, 100);
            if (m > eot.examMax)
                eot.examMax = m;
            return;
        }
        if (combined.includes('proj') || combined.includes('group') || combined.includes('practical')) {
            const m = num(a.maxScore, 10);
            if (m > eot.projMax)
                eot.projMax = m;
            return;
        }
        if (combined.includes('home') || combined.includes('hw') || combined.includes('assign')) {
            const m = num(a.maxScore, 10);
            if (m > eot.hwMax)
                eot.hwMax = m;
            return;
        }
        const key = String(a.assessmentName || 'test 1').trim().toLowerCase() || 'test 1';
        const m = num(a.maxScore, 20);
        if (m > (eotTests.get(key) || 0))
            eotTests.set(key, m);
    });
    const eotVals = Array.from(eotTests.values());
    eot.testCount = eotVals.length;
    eot.testMaxAvg = eotVals.length > 0 ? Math.round((eotVals.reduce((s, v) => s + v, 0) / eotVals.length) * 100) / 100 : 0;
    // 2. Mid-Term
    const dedicatedMidDocs = validDocs.filter(a => isDedicatedMidTermRecord(a));
    const midSource = dedicatedMidDocs.length > 0 ? dedicatedMidDocs : validDocs.filter(a => isAnyMidTermRecord(a));
    mt.hasDedicatedMidTerm = dedicatedMidDocs.length > 0;
    midSource.forEach(a => {
        const explicit = String(a.midTermSlot || '').toLowerCase();
        const stripped = `${a.assessmentType || ''} ${a.assessmentName || ''}`.toLowerCase().replace(/mid[\s-]*term|mid[\s-]*sem(?:ester)?/g, ' ').trim();
        const slot = (explicit === 'test' || explicit === 'hw' || explicit === 'project' || explicit === 'exam')
            ? explicit
            : (a.standaloneMidTerm === true && !a.midTermSlot)
                ? 'exam'
                : (stripped.includes('exam') || stripped === '' || stripped === '(ca)' || stripped === '(100%)')
                    ? 'exam'
                    : (stripped.includes('proj') || stripped.includes('group') || stripped.includes('practical'))
                        ? 'project'
                        : (stripped.includes('home') || stripped.includes('hw') || stripped.includes('assignment'))
                            ? 'hw'
                            : 'test';
        if (slot === 'exam') {
            const m = num(a.maxScore, 100);
            if (m > mt.examMax)
                mt.examMax = m;
        }
        else if (slot === 'hw') {
            const m = num(a.maxScore, 20);
            if (m > mt.hwMax)
                mt.hwMax = m;
        }
        else if (slot === 'project') {
            const m = num(a.maxScore, 20);
            if (m > mt.projMax)
                mt.projMax = m;
        }
        else {
            const key = String(a.assessmentName || 'test 1').trim().toLowerCase() || 'test 1';
            const m = num(a.maxScore, 20);
            if (m > (mtTests.get(key) || 0))
                mtTests.set(key, m);
        }
    });
    const mtVals = Array.from(mtTests.values());
    mt.testCount = mtVals.length;
    mt.testMaxAvg = mtVals.length > 0 ? Math.round((mtVals.reduce((s, v) => s + v, 0) / mtVals.length) * 100) / 100 : 0;
    return { end_of_term: eot, mid_term: mt };
}
function classContribution(m, sign, inc) {
    const sp = inc(sign * m.pct), c1 = inc(sign);
    return {
        schoolId: m.schoolId,
        termId: m.termId,
        classId: m.classId,
        totals: { s: sp, c: c1 },
        subjects: { [m.subjectId]: Object.assign({ s: sp, c: c1 }, (sign > 0 && m.subjectName ? { name: m.subjectName } : {})) },
    };
}
function isNonTerminalSeriesMark(a) {
    return isMockMarkRecord(a) || isDedicatedMidTermRecord(a);
}
/** What one mark contributes, or null if it is not an End-of-Term usable mark. */
function markPart(a) {
    if (!a || !a.schoolId || !a.studentId)
        return null;
    if (isNonTerminalSeriesMark(a))
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
const billedQueryReads = (docCount) => (docCount > 0 ? docCount : 1);
/**
 * Scans all marks for one `(schoolId, termId, classId, subjectId)` scoped first by stamped `termId`
 * (single query, immune to year/term spelling differences), with a spelling-tolerant fallback to
 * `academicYearVariants` x `termVariants` when unstamped legacy marks exist.
 */
async function scanSubjectTermAssessments(store, t, forceVariantScan) {
    let reads = 0;
    const byId = new Map();
    const buildBase = () => {
        let q = store.collection('assessments')
            .where('schoolId', '==', t.schoolId)
            .where('classId', '==', t.rawClassId);
        if (t.rawSubjectId) {
            q = q.where('subjectId', '==', t.rawSubjectId);
        }
        return q;
    };
    if (t.hasExplicitTermId && !forceVariantScan) {
        const stampedSnap = await buildBase().where('termId', '==', t.termId).get();
        reads += billedQueryReads(stampedSnap.docs.length);
        stampedSnap.docs.forEach(d => byId.set(d.id, d.data()));
    }
    if (byId.size === 0 || forceVariantScan || !t.hasExplicitTermId) {
        const canonical = (0, term_utils_1.stampFromTermId)(t.termId);
        const ySet = new Set([
            ...(0, term_utils_1.academicYearVariantsForStamp)((canonical === null || canonical === void 0 ? void 0 : canonical.academicYear) || ''),
            ...(0, term_utils_1.academicYearVariantsForStamp)(t.rawYear),
        ]);
        const tSet = new Set([
            ...(0, term_utils_1.termVariantsForStamp)((canonical === null || canonical === void 0 ? void 0 : canonical.term) || ''),
            ...(0, term_utils_1.termVariantsForStamp)(t.rawTerm),
        ]);
        const yv = Array.from(ySet).filter(Boolean).slice(0, 10);
        const tv = Array.from(tSet).filter(Boolean).slice(0, 10);
        if (yv.length > 0 && tv.length > 0) {
            const maxYv = Math.max(1, Math.floor(30 / Math.max(1, tv.length)));
            for (let i = 0; i < yv.length; i += maxYv) {
                const yvChunk = yv.slice(i, i + maxYv);
                const snap = await buildBase()
                    .where('academicYear', 'in', yvChunk)
                    .where('term', 'in', tv)
                    .get();
                reads += billedQueryReads(snap.docs.length);
                snap.docs.forEach(d => byId.set(d.id, d.data()));
            }
        }
        if (t.hasExplicitTermId && forceVariantScan) {
            const stampedSnap = await buildBase().where('termId', '==', t.termId).get();
            reads += billedQueryReads(stampedSnap.docs.length);
            stampedSnap.docs.forEach(d => byId.set(d.id, d.data()));
        }
        if (byId.size === 0) {
            const fallbackSnap = await buildBase().get();
            reads += billedQueryReads(fallbackSnap.docs.length);
            fallbackSnap.docs.forEach(d => byId.set(d.id, d.data()));
        }
    }
    let sawUnstamped = false;
    const termDocs = [];
    byId.forEach(d => {
        var _a;
        if ((((_a = (0, term_utils_1.termStampOfRecord)(d)) === null || _a === void 0 ? void 0 : _a.termId) || 'unknown') === t.termId) {
            termDocs.push(d);
            if (!d.termId)
                sawUnstamped = true;
        }
    });
    return { termDocs, reads, sawUnstamped };
}
async function recomputeAndPersistSubjectCaProfile(store, t, hasLegacyUnstamped) {
    const { termDocs, reads, sawUnstamped } = await scanSubjectTermAssessments(store, t, hasLegacyUnstamped);
    const profiles = computeCaProfilesForClassSubject(termDocs);
    const eotKey = `end_of_term__${t.safeSubId}`;
    const mtKey = `mid_term__${t.safeSubId}`;
    const profRef = (0, exports.CLASS_SERIES_PROFILES)(t.schoolId, t.termId, t.safeClassId, store);
    const avgRef = (0, exports.CLASS_AVERAGES)(t.schoolId, t.termId, t.safeClassId, store);
    const upsertExactProfiles = async (ref, topField, isProfileCollection) => {
        const baseMeta = {
            schoolId: t.schoolId,
            termId: t.termId,
            classId: t.safeClassId,
        };
        if (isProfileCollection && sawUnstamped) {
            baseMeta.hasLegacyUnstamped = true;
        }
        await ref.set(baseMeta, { merge: true });
        const args = [
            new firestore_2.FieldPath(topField, eotKey), profiles.end_of_term,
            new firestore_2.FieldPath(topField, mtKey), profiles.mid_term,
            'updatedAt', firestore_2.FieldValue.serverTimestamp(),
        ];
        if (t.subjectName) {
            const safeSubName = safeKey(t.subjectName.toLowerCase().trim());
            args.push(new firestore_2.FieldPath(topField, `end_of_term__name__${safeSubName}`), profiles.end_of_term, new firestore_2.FieldPath(topField, `mid_term__name__${safeSubName}`), profiles.mid_term);
        }
        if (isProfileCollection) {
            // R5-2: reset retry counter on successful recompute (R5-5: `dirty.<subId>` is cleared BEFORE scan starts!)
            args.push(new firestore_2.FieldPath('dirtyAttempts', t.safeSubId), firestore_2.FieldValue.delete());
        }
        await ref.update(...args);
    };
    await Promise.all([
        upsertExactProfiles(profRef, 'profiles', true),
        upsertExactProfiles(avgRef, 'caProfiles', false),
    ]);
    return { reads };
}
async function markSubjectDirtyNoRead(store, t) {
    const profRef = (0, exports.CLASS_SERIES_PROFILES)(t.schoolId, t.termId, t.safeClassId, store);
    await profRef.set({
        schoolId: t.schoolId,
        termId: t.termId,
        classId: t.safeClassId,
        hasDirtyProfiles: true,
        dirty: { [t.safeSubId]: true },
        dirtyTargets: {
            [t.safeSubId]: {
                rawClassId: t.rawClassId,
                rawSubjectId: t.rawSubjectId,
                rawYear: t.rawYear,
                rawTerm: t.rawTerm,
                subjectName: t.subjectName,
                hasExplicitTermId: t.hasExplicitTermId,
            },
        },
    }, { merge: true });
}
async function processAssessmentWriteEvent(store, params) {
    var _a;
    const { rawBefore, rawAfter } = params;
    const nowMs = (_a = params.nowMs) !== null && _a !== void 0 ? _a : Date.now();
    const eventTimeMs = params.eventTimeMs || nowMs;
    const schoolId = String((rawAfter === null || rawAfter === void 0 ? void 0 : rawAfter.schoolId) || (rawBefore === null || rawBefore === void 0 ? void 0 : rawBefore.schoolId) || 'unknown');
    let reads = 0;
    let scans = 0;
    // Early exit for archival-only rewrites (term close / unlock) or identical writes
    const noOp = isNoOpForProfileAndVersion(rawBefore, rawAfter);
    const before = markPart(rawBefore);
    const after = markPart(rawAfter);
    const inc = (n) => firestore_2.FieldValue.increment(n);
    const writes = [];
    const versionStampedClassTerms = new Set();
    if (before || after) {
        if (!(before && after && JSON.stringify(before) === JSON.stringify(after))) {
            if (before) {
                writes.push((0, exports.ACADEMIC_SUMMARY)(before.schoolId, before.termId, store).set(Object.assign(Object.assign({}, contribution(before, -1, inc)), { updatedAt: firestore_2.FieldValue.serverTimestamp() }), { merge: true }));
            }
            if (after) {
                writes.push((0, exports.ACADEMIC_SUMMARY)(after.schoolId, after.termId, store).set(Object.assign(Object.assign({}, contribution(after, 1, inc)), { updatedAt: firestore_2.FieldValue.serverTimestamp() }), { merge: true }));
            }
            if ((before === null || before === void 0 ? void 0 : before.classId) && before.subjectId) {
                versionStampedClassTerms.add(`${before.schoolId}__${before.termId}__${before.classId}`);
                writes.push((0, exports.CLASS_AVERAGES)(before.schoolId, before.termId, before.classId, store).set(Object.assign(Object.assign({}, classContribution(before, -1, inc)), { lastMarkWriteAt: firestore_2.FieldValue.serverTimestamp(), markVersion: inc(1), updatedAt: firestore_2.FieldValue.serverTimestamp() }), { merge: true }));
            }
            if ((after === null || after === void 0 ? void 0 : after.classId) && after.subjectId) {
                const sameClassTermAsBefore = (before === null || before === void 0 ? void 0 : before.schoolId) === after.schoolId &&
                    (before === null || before === void 0 ? void 0 : before.termId) === after.termId &&
                    (before === null || before === void 0 ? void 0 : before.classId) === after.classId &&
                    Boolean(before === null || before === void 0 ? void 0 : before.subjectId);
                versionStampedClassTerms.add(`${after.schoolId}__${after.termId}__${after.classId}`);
                writes.push((0, exports.CLASS_AVERAGES)(after.schoolId, after.termId, after.classId, store).set(Object.assign(Object.assign(Object.assign({}, classContribution(after, 1, inc)), (sameClassTermAsBefore
                    ? {}
                    : { lastMarkWriteAt: firestore_2.FieldValue.serverTimestamp(), markVersion: inc(1) })), { updatedAt: firestore_2.FieldValue.serverTimestamp() }), { merge: true }));
            }
        }
    }
    // Also bump `lastMarkWriteAt` & `markVersion` on `classAverages` for non-End-of-Term mark writes
    // (Dedicated Mid-Term & Mock marks) so active-term Master List snapshots invalidate immediately!
    if (!noOp) {
        [rawBefore, rawAfter].forEach((r) => {
            var _a;
            if (!r || !r.schoolId || !r.classId)
                return;
            const termId = ((_a = (0, term_utils_1.termStampOfRecord)(r)) === null || _a === void 0 ? void 0 : _a.termId) || 'unknown';
            if (termId === 'unknown')
                return;
            const safeClassId = safeKey(r.classId);
            const ctKey = `${r.schoolId}__${termId}__${safeClassId}`;
            if (versionStampedClassTerms.has(ctKey))
                return;
            versionStampedClassTerms.add(ctKey);
            writes.push((0, exports.CLASS_AVERAGES)(String(r.schoolId), termId, safeClassId, store).set({
                schoolId: String(r.schoolId),
                termId,
                classId: safeClassId,
                lastMarkWriteAt: firestore_2.FieldValue.serverTimestamp(),
                markVersion: inc(1),
                updatedAt: firestore_2.FieldValue.serverTimestamp(),
            }, { merge: true }));
        });
    }
    // Build CA profile recompute targets
    const targets = new Map();
    if (!noOp) {
        [rawBefore, rawAfter].forEach((r) => {
            var _a;
            if (!r || !r.schoolId || !r.classId || !(r.subjectId || r.subjectName))
                return;
            // 1a) Server-graded quiz records never define CA structure -> skip profile recompute entirely
            if (isServerGradedQuizRecord(r) || isMockMarkRecord(r))
                return;
            const termId = ((_a = (0, term_utils_1.termStampOfRecord)(r)) === null || _a === void 0 ? void 0 : _a.termId) || 'unknown';
            if (termId === 'unknown')
                return;
            const safeClassId = safeKey(r.classId);
            const safeSubId = safeKey(r.subjectId || r.subjectName || 'general');
            const k = `${r.schoolId}__${termId}__${safeClassId}__${safeSubId}`;
            const existing = targets.get(k);
            targets.set(k, {
                schoolId: String(r.schoolId),
                termId,
                rawClassId: String(r.classId),
                rawSubjectId: String(r.subjectId || (existing === null || existing === void 0 ? void 0 : existing.rawSubjectId) || ''),
                rawYear: String(r.academicYear || (existing === null || existing === void 0 ? void 0 : existing.rawYear) || ''),
                rawTerm: String(r.term || (existing === null || existing === void 0 ? void 0 : existing.rawTerm) || ''),
                safeClassId,
                safeSubId,
                subjectName: String(r.subjectName || (existing === null || existing === void 0 ? void 0 : existing.subjectName) || ''),
                hasExplicitTermId: existing ? (existing.hasExplicitTermId && Boolean(r.termId)) : Boolean(r.termId),
            });
        });
    }
    if (writes.length > 0) {
        await Promise.all(writes).catch(e => console.warn('[academicSummary] update failed:', e === null || e === void 0 ? void 0 : e.message));
    }
    for (const [targetKey, t] of targets.entries()) {
        // 1b) Per-instance 60s cooldown BEFORE the lease transaction (0 reads during bursts)
        const mem = instanceCooldowns.get(targetKey);
        if (mem && nowMs < mem.cooldownUntil) {
            // Same batch commit timestamp already covered by Invocation #1 -> 0 reads, 0 dirty writes
            if (eventTimeMs > 0 && eventTimeMs <= mem.coveredEventTimeMs) {
                continue;
            }
            // Newer trickle write arrived inside cooldown -> mark dirty once (merge write, 0 reads)
            if (nowMs >= mem.dirtyMarkedUntil) {
                mem.dirtyMarkedUntil = mem.cooldownUntil;
                await markSubjectDirtyNoRead(store, t).catch(err => console.warn('[academicSummary] dirty marker write warning:', err === null || err === void 0 ? void 0 : err.message));
            }
            continue;
        }
        // Reserve in-memory cooldown immediately for concurrent invocations on this instance
        instanceCooldowns.set(targetKey, {
            cooldownUntil: nowMs + exports.INSTANCE_COOLDOWN_MS,
            coveredEventTimeMs: eventTimeMs,
            dirtyMarkedUntil: 0,
        });
        try {
            const profRef = (0, exports.CLASS_SERIES_PROFILES)(t.schoolId, t.termId, t.safeClassId, store);
            const leaseOutcome = await store.runTransaction(async (tx) => {
                var _a, _b, _c;
                const profSnap = await tx.get(profRef);
                reads += 1;
                const profData = profSnap.data() || {};
                const lastScannedEventMs = Number(((_a = profData.scanLease) === null || _a === void 0 ? void 0 : _a[t.safeSubId]) || 0);
                const leaseUntilMs = Number(((_b = profData.scanLeaseUntil) === null || _b === void 0 ? void 0 : _b[t.safeSubId]) || 0);
                const hasLegacyUnstamped = profData.hasLegacyUnstamped === true;
                if (eventTimeMs > 0 && lastScannedEventMs >= eventTimeMs) {
                    return { action: 'already_covered', lastScannedEventMs, leaseUntilMs, hasLegacyUnstamped };
                }
                // 1c) Lease says "too soon": mark dirty instead of scanning on every subsequent write
                if (leaseUntilMs > nowMs) {
                    tx.set(profRef, {
                        schoolId: t.schoolId,
                        termId: t.termId,
                        classId: t.safeClassId,
                        hasDirtyProfiles: true,
                        dirty: { [t.safeSubId]: true },
                        dirtyTargets: {
                            [t.safeSubId]: {
                                rawClassId: t.rawClassId,
                                rawSubjectId: t.rawSubjectId,
                                rawYear: t.rawYear,
                                rawTerm: t.rawTerm,
                                subjectName: t.subjectName,
                                hasExplicitTermId: t.hasExplicitTermId,
                            },
                        },
                    }, { merge: true });
                    return { action: 'marked_dirty', lastScannedEventMs, leaseUntilMs, hasLegacyUnstamped };
                }
                const nextLeaseEventMs = Math.max(nowMs, eventTimeMs);
                tx.set(profRef, {
                    schoolId: t.schoolId,
                    termId: t.termId,
                    classId: t.safeClassId,
                    scanLease: { [t.safeSubId]: nextLeaseEventMs },
                    scanLeaseUntil: { [t.safeSubId]: nowMs + exports.LEASE_WINDOW_MS },
                }, { merge: true });
                if (profSnap.exists && ((_c = profData.dirty) === null || _c === void 0 ? void 0 : _c[t.safeSubId])) {
                    // R5-5: Clear `dirty.<subId>` BEFORE scanning so any write arriving *during* the scan survives!
                    tx.update(profRef, new firestore_2.FieldPath('dirty', t.safeSubId), firestore_2.FieldValue.delete());
                }
                return { action: 'scan_now', lastScannedEventMs: nextLeaseEventMs, leaseUntilMs: nowMs + exports.LEASE_WINDOW_MS, hasLegacyUnstamped };
            });
            if (leaseOutcome.action === 'already_covered') {
                instanceCooldowns.set(targetKey, {
                    cooldownUntil: nowMs + exports.INSTANCE_COOLDOWN_MS,
                    coveredEventTimeMs: Math.max(eventTimeMs, leaseOutcome.lastScannedEventMs),
                    dirtyMarkedUntil: 0,
                });
                continue;
            }
            if (leaseOutcome.action === 'marked_dirty') {
                const until = Math.min(leaseOutcome.leaseUntilMs, nowMs + exports.INSTANCE_COOLDOWN_MS);
                instanceCooldowns.set(targetKey, {
                    cooldownUntil: until,
                    coveredEventTimeMs: leaseOutcome.lastScannedEventMs,
                    dirtyMarkedUntil: until,
                });
                continue;
            }
            const scanRes = await recomputeAndPersistSubjectCaProfile(store, t, leaseOutcome.hasLegacyUnstamped);
            reads += scanRes.reads;
            scans += 1;
        }
        catch (profErr) {
            // R4-3 self-heal: release in-memory cooldown and flag dirty so the 5-min scheduler retries cleanly
            instanceCooldowns.delete(targetKey);
            await markSubjectDirtyNoRead(store, t).catch(() => { });
            console.warn('[academicSummary] caProfile update warning:', profErr === null || profErr === void 0 ? void 0 : profErr.message);
        }
    }
    console.log('[readBudget]', { fn: 'onAssessmentWriteForSummary', schoolId, reads, scans });
    return { reads, scans };
}
async function runFlushDirtyProfiles(store = defaultDb, maxRecomputes = exports.MAX_SCHEDULED_RECOMPUTES) {
    let totalReads = 0;
    let recomputed = 0;
    const readsBySchool = new Map();
    const addSchoolReads = (sid, n) => {
        totalReads += n;
        readsBySchool.set(sid, (readsBySchool.get(sid) || 0) + n);
    };
    const dirtySnap = await store
        .collection('classSeriesProfiles')
        .where('hasDirtyProfiles', '==', true)
        .limit(maxRecomputes)
        .get();
    if (dirtySnap.empty) {
        totalReads += 1;
        console.log('[readBudget]', { fn: 'flushDirtyClassSeriesProfiles', schoolId: 'all', reads: totalReads, recomputed: 0 });
        return { reads: totalReads, recomputed: 0 };
    }
    for (const profDoc of dirtySnap.docs) {
        const data = profDoc.data() || {};
        const schoolId = String(data.schoolId || 'unknown');
        addSchoolReads(schoolId, 1);
        const termId = String(data.termId || '');
        const safeClassId = String(data.classId || '');
        const dirtyMap = (data.dirty && typeof data.dirty === 'object') ? data.dirty : {};
        const dirtyTargets = (data.dirtyTargets && typeof data.dirtyTargets === 'object') ? data.dirtyTargets : {};
        const dirtyAttempts = (data.dirtyAttempts && typeof data.dirtyAttempts === 'object') ? data.dirtyAttempts : {};
        const dirtySubIds = Object.keys(dirtyMap).filter(k => Boolean(dirtyMap[k]));
        if (!termId || !safeClassId || dirtySubIds.length === 0) {
            await store.runTransaction(async (tx) => {
                var _a;
                const freshSnap = await tx.get(profDoc.ref);
                addSchoolReads(schoolId, 1);
                const freshDirty = ((_a = freshSnap.data()) === null || _a === void 0 ? void 0 : _a.dirty) || {};
                if (!Object.values(freshDirty).some(Boolean)) {
                    tx.set(profDoc.ref, { hasDirtyProfiles: false }, { merge: true });
                }
            });
            continue;
        }
        for (const safeSubId of dirtySubIds) {
            if (recomputed >= maxRecomputes)
                break;
            const meta = dirtyTargets[safeSubId] || {};
            const target = {
                schoolId,
                termId,
                rawClassId: String(meta.rawClassId || safeClassId),
                rawSubjectId: String(meta.rawSubjectId || (safeSubId !== 'general' ? safeSubId : '')),
                rawYear: String(meta.rawYear || ''),
                rawTerm: String(meta.rawTerm || ''),
                safeClassId,
                safeSubId,
                subjectName: String(meta.subjectName || ''),
                hasExplicitTermId: meta.hasExplicitTermId !== false,
            };
            try {
                // R5-5: Clear `dirty.<safeSubId>` BEFORE running `q.get()` so a concurrent mark saved during the scan survives!
                await profDoc.ref.update(new firestore_2.FieldPath('dirty', safeSubId), firestore_2.FieldValue.delete(), new firestore_2.FieldPath('dirtyTargets', safeSubId), firestore_2.FieldValue.delete());
                const res = await recomputeAndPersistSubjectCaProfile(store, target, data.hasLegacyUnstamped === true);
                addSchoolReads(schoolId, res.reads);
                recomputed += 1;
            }
            catch (err) {
                // R5-2: Cap retries at MAX_DIRTY_ATTEMPTS (5) so a broken subject never retries 288 times/day!
                const nextAttempts = (Number(dirtyAttempts[safeSubId]) || 0) + 1;
                if (nextAttempts >= exports.MAX_DIRTY_ATTEMPTS) {
                    console.warn(`[flushDirtyClassSeriesProfiles] Giving up after ${nextAttempts} attempts:`, schoolId, termId, safeClassId, safeSubId, err === null || err === void 0 ? void 0 : err.message);
                    await profDoc.ref.set({
                        dirtyAttempts: { [safeSubId]: nextAttempts },
                        dirtyGaveUpAt: { [safeSubId]: Date.now() },
                    }, { merge: true }).catch(() => { });
                }
                else {
                    console.warn(`[flushDirtyClassSeriesProfiles] Retry ${nextAttempts}/${exports.MAX_DIRTY_ATTEMPTS} scheduled:`, schoolId, termId, safeClassId, safeSubId, err === null || err === void 0 ? void 0 : err.message);
                    await profDoc.ref.set({
                        hasDirtyProfiles: true,
                        dirty: { [safeSubId]: true },
                        dirtyTargets: { [safeSubId]: meta },
                        dirtyAttempts: { [safeSubId]: nextAttempts },
                    }, { merge: true }).catch(() => { });
                }
            }
        }
        // R5-5: Only clear `hasDirtyProfiles` if NO dirty keys remain (including any added concurrently during scans)
        await store.runTransaction(async (tx) => {
            var _a;
            const freshSnap = await tx.get(profDoc.ref);
            addSchoolReads(schoolId, 1);
            const freshDirty = ((_a = freshSnap.data()) === null || _a === void 0 ? void 0 : _a.dirty) || {};
            if (!Object.values(freshDirty).some(Boolean)) {
                tx.set(profDoc.ref, { hasDirtyProfiles: false }, { merge: true });
            }
        });
    }
    readsBySchool.forEach((schoolReads, sid) => {
        console.log('[readBudget]', { fn: 'flushDirtyClassSeriesProfiles', schoolId: sid, reads: schoolReads, recomputed });
    });
    return { reads: totalReads, recomputed };
}
exports.onAssessmentWriteForSummary = (0, firestore_1.onDocumentWritten)('assessments/{assessmentId}', async (event) => {
    var _a, _b, _c, _d;
    const rawBefore = ((_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before) === null || _b === void 0 ? void 0 : _b.exists) ? event.data.before.data() : null;
    const rawAfter = ((_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.after) === null || _d === void 0 ? void 0 : _d.exists) ? event.data.after.data() : null;
    const eventTimeMs = (event.time ? Date.parse(event.time) : 0) || Date.now();
    await processAssessmentWriteEvent(defaultDb, { rawBefore, rawAfter, eventTimeMs });
});
// R5-6: Explicit 300s timeout and 256MiB memory so up to 200 recomputes complete comfortably within schedule budget
exports.flushDirtyClassSeriesProfiles = (0, scheduler_1.onSchedule)({ schedule: 'every 5 minutes', timeoutSeconds: 300, memory: '256MiB' }, async () => {
    await runFlushDirtyProfiles(defaultDb, exports.MAX_SCHEDULED_RECOMPUTES);
});
//# sourceMappingURL=academic-summary.js.map