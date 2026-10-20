"use strict";
/**
 * term-utils — the ONE definition of "which term is this?" for the whole app.
 *
 * Pure functions only (no Firebase imports), so the Next.js app (client + server) and the Cloud
 * Functions share exactly the same logic. The web app re-exports this file from `src/lib/term.ts`.
 *
 * The school profile (Admin → School Profile) is the source of truth. It stores, on both
 * `schools/{schoolId}` and `schoolSettings/{schoolId}`:
 *   academicYear: "2025-2026"          term: "First Term" | "Second Term" | "Third Term"
 *   termStartDate / termEndDate / nextTermDate: "yyyy-MM-dd"
 *
 * Every bill and payment is stamped with:
 *   termId:       "2025-2026_T1"   (canonical, used for queries and the rollover)
 *   academicYear: "2025-2026"
 *   term:         "First Term"
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeYear = normalizeYear;
exports.termNumber = termNumber;
exports.termLabel = termLabel;
exports.buildTermId = buildTermId;
exports.parseTermId = parseTermId;
exports.makeTermStamp = makeTermStamp;
exports.stampFromTermId = stampFromTermId;
exports.currentTermFromProfile = currentTermFromProfile;
exports.nextTermStamp = nextTermStamp;
exports.termStampOfRecord = termStampOfRecord;
exports.compareTermIds = compareTermIds;
const TERM_LABELS = {
    1: 'First Term',
    2: 'Second Term',
    3: 'Third Term',
};
/** "2025/2026", "2025 - 2026", "2025" → "2025-2026". Returns '' when it cannot be read. */
function normalizeYear(value) {
    if (value === null || value === undefined)
        return '';
    const s = String(value).trim();
    if (!s)
        return '';
    const pair = s.match(/(\d{4})\s*[\/-]\s*(\d{4})/);
    if (pair)
        return `${pair[1]}-${pair[2]}`;
    const single = s.match(/^(\d{4})$/);
    if (single) {
        const y = parseInt(single[1], 10);
        return `${y}-${y + 1}`;
    }
    return '';
}
/** "First Term", "Term 1", "1st term", "T1", "term-1" → 1. Returns null when it cannot be read. */
function termNumber(value) {
    if (value === null || value === undefined)
        return null;
    const s = String(value).trim().toLowerCase();
    if (!s)
        return null;
    // A canonical id such as "2025-2026_T2": read the part after the underscore.
    const canon = s.match(/_t([123])$/);
    if (canon)
        return Number(canon[1]);
    if (/\bfirst\b|\b1st\b/.test(s))
        return 1;
    if (/\bsecond\b|\b2nd\b/.test(s))
        return 2;
    if (/\bthird\b|\b3rd\b/.test(s))
        return 3;
    const digit = s.replace(/\d{4}\s*[\/-]\s*\d{4}/g, '').match(/[123]/);
    return digit ? Number(digit[0]) : null;
}
function termLabel(n) {
    return TERM_LABELS[n];
}
function buildTermId(academicYear, term) {
    const year = normalizeYear(academicYear);
    const n = termNumber(term);
    if (!year || !n)
        return '';
    return `${year}_T${n}`;
}
function parseTermId(termId) {
    const m = String(termId || '').match(/^(\d{4}-\d{4})_T([123])$/);
    if (!m)
        return null;
    return { academicYear: m[1], termNumber: Number(m[2]) };
}
/** Full stamp from a year + term. Returns null when either part is missing/unreadable. */
function makeTermStamp(academicYear, term) {
    const year = normalizeYear(academicYear);
    const n = termNumber(term);
    if (!year || !n)
        return null;
    return { termId: `${year}_T${n}`, academicYear: year, term: TERM_LABELS[n] };
}
function stampFromTermId(termId) {
    const p = parseTermId(termId);
    return p ? { termId: `${p.academicYear}_T${p.termNumber}`, academicYear: p.academicYear, term: TERM_LABELS[p.termNumber] } : null;
}
/**
 * The school's CURRENT term, read from the school profile document (`schools/{id}`) or its mirror
 * (`schoolSettings/{id}`). The human-entered `term` field wins over legacy `currentTermId` values
 * (some of which are free text such as "Term 1-next").
 */
function currentTermFromProfile(profile) {
    if (!profile)
        return null;
    const year = profile.academicYear || profile.activeAcademicYear;
    const term = profile.term || profile.currentTerm || profile.activeTerm;
    return makeTermStamp(year, term) || stampFromTermId(profile.currentTermId);
}
/** First → Second → Third → First of the following academic year. */
function nextTermStamp(current) {
    const n = termNumber(current.term) || 1;
    if (n < 3)
        return makeTermStamp(current.academicYear, n + 1);
    const start = parseInt(current.academicYear.slice(0, 4), 10) + 1;
    return makeTermStamp(`${start}-${start + 1}`, 1);
}
/**
 * The term a single bill/payment belongs to: its own stamp when it has one, otherwise its legacy
 * `academicYear` + `term` fields. Returns null when the record carries no usable term information
 * (e.g. daily canteen bills created before stamping existed).
 */
function termStampOfRecord(r) {
    if (!r)
        return null;
    return stampFromTermId(r.termId) || makeTermStamp(r.academicYear, r.term);
}
/** Order two canonical term ids. Negative when a is earlier. Unparseable ids sort first. */
function compareTermIds(a, b) {
    const pa = parseTermId(a);
    const pb = parseTermId(b);
    if (!pa && !pb)
        return 0;
    if (!pa)
        return -1;
    if (!pb)
        return 1;
    if (pa.academicYear !== pb.academicYear)
        return pa.academicYear < pb.academicYear ? -1 : 1;
    return pa.termNumber - pb.termNumber;
}
//# sourceMappingURL=term-utils.js.map