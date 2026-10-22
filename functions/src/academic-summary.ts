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
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { termStampOfRecord } from './term-utils';

if (!getApps().length) initializeApp();
const db = getFirestore();

export const ACADEMIC_SUMMARY = (schoolId: string, termId: string) =>
  db.collection('academicSummary').doc(`${schoolId}__${termId}`);

/**
 * Parent-safe class averages: classAverages/{schoolId}__{termId}__{classId} = { schoolId, termId, classId,
 * totals: { s, c }, subjects: { <subjectId>: { s, c, name } } }. No pupil names or ids, so parents of the
 * class may read it (the parent portal used to download 250 of the classmates' marks to work this out).
 */
export const CLASS_AVERAGES = (schoolId: string, termId: string, classId: string) =>
  db.collection('classAverages').doc(`${schoolId}__${termId}__${classId}`);

export function classContribution(m: MarkPart, sign: 1 | -1, inc: (n: number) => any) {
  const sp = inc(sign * m.pct), c1 = inc(sign);
  return {
    schoolId: m.schoolId,
    termId: m.termId,
    classId: m.classId,
    totals: { s: sp, c: c1 },
    subjects: { [m.subjectId]: { s: sp, c: c1, ...(sign > 0 && m.subjectName ? { name: m.subjectName } : {}) } },
  };
}

const safeKey = (v: any) => String(v || '').replace(/[.\/\[\]#$*`~]/g, '_').slice(0, 120);

export type MarkPart = {
  schoolId: string; termId: string; pct: number; pass: number;
  classId: string; subjectId: string; subjectName: string; teacherId: string;
  studentId: string; studentName: string;
};

/** What one mark contributes, or null if it is not a usable mark. */
export function markPart(a: any): MarkPart | null {
  if (!a || !a.schoolId || !a.studentId) return null;
  const score = Number(a.score);
  const max = Number(a.maxScore);
  if (!Number.isFinite(score) || !(max > 0)) return null;
  const pct = Math.max(0, Math.min(100, (score / max) * 100));
  const st = termStampOfRecord(a);
  return {
    schoolId: String(a.schoolId),
    termId: st?.termId || 'unknown',
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
export function contribution(m: MarkPart, sign: 1 | -1, inc: (n: number) => any) {
  const sp = inc(sign * m.pct), c1 = inc(sign), p1 = inc(sign * m.pass);
  const out: any = {
    schoolId: m.schoolId,
    termId: m.termId,
    totals: { s: sp, c: c1, p: p1 },
    students: {
      [m.studentId]: {
        s: sp, c: c1,
        ...(sign > 0 && m.studentName ? { name: m.studentName } : {}),
        ...(sign > 0 && m.classId ? { classId: m.classId } : {}),
        ...(m.pass ? {} : { f: { [m.subjectId]: c1 } }),
      },
    },
  };
  if (m.classId) out.classes = { [m.classId]: { s: sp, c: c1, p: p1 } };
  if (m.subjectId) out.subjects = { [m.subjectId]: { s: sp, c: c1, p: p1, ...(sign > 0 && m.subjectName ? { name: m.subjectName } : {}) } };
  if (m.teacherId) out.teachers = { [m.teacherId]: { s: sp, c: c1, p: p1 } };
  return out;
}

export const onAssessmentWriteForSummary = onDocumentWritten('assessments/{assessmentId}', async (event) => {
  const before = markPart(event.data?.before?.exists ? event.data.before.data() : null);
  const after = markPart(event.data?.after?.exists ? event.data.after.data() : null);
  if (!before && !after) return;
  // Nothing that matters changed (e.g. only a remark was edited).
  if (before && after && JSON.stringify(before) === JSON.stringify(after)) return;
  const inc = (n: number) => FieldValue.increment(n);
  const writes: Promise<any>[] = [];
  if (before) writes.push(ACADEMIC_SUMMARY(before.schoolId, before.termId).set({ ...contribution(before, -1, inc), updatedAt: FieldValue.serverTimestamp() }, { merge: true }));
  if (after) writes.push(ACADEMIC_SUMMARY(after.schoolId, after.termId).set({ ...contribution(after, 1, inc), updatedAt: FieldValue.serverTimestamp() }, { merge: true }));
  if (before?.classId && before.subjectId) writes.push(CLASS_AVERAGES(before.schoolId, before.termId, before.classId).set({ ...classContribution(before, -1, inc), updatedAt: FieldValue.serverTimestamp() }, { merge: true }));
  if (after?.classId && after.subjectId) writes.push(CLASS_AVERAGES(after.schoolId, after.termId, after.classId).set({ ...classContribution(after, 1, inc), updatedAt: FieldValue.serverTimestamp() }, { merge: true }));
  await Promise.all(writes).catch(e => console.warn('[academicSummary] update failed:', e?.message));
});
