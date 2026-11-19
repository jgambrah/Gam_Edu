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
import { getFirestore, FieldValue, FieldPath } from 'firebase-admin/firestore';
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

export const CLASS_SERIES_PROFILES = (schoolId: string, termId: string, classId: string) =>
  db.collection('classSeriesProfiles').doc(`${schoolId}__${termId}__${classId}`);

export interface SubjectCaProfileDoc {
  tests: Record<string, number>;
  hwMax: number;
  projMax: number;
  midMax: number;
  examMax: number;
  hasDedicatedMidTerm: boolean;
}

function isMockMarkRecord(a: any): boolean {
  if (!a) return false;
  if (a.reportScope === 'mid_term' || a.mockSeries === 'mid_term' || a.standaloneMidTerm === true) return false;
  if (typeof a.mockSeries === 'string' && a.mockSeries.trim().startsWith('mock_')) return true;
  const typeLower = String(a.assessmentType || '').trim().toLowerCase();
  const cleanName = String(a.assessmentName || '').replace(/\(\s*100\s*%?\s*\)/gi, '').replace(/\b100\s*%/gi, '').trim();
  if (typeLower.includes('mock')) return true;
  return /^(?:(?:\d+(?:st|nd|rd|th)|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s+)?mock(?:\s+exam(?:ination)?s?)?(?:\s*#?\s*\d+)?$/i.test(cleanName);
}

function isDedicatedMidTermRecord(a: any): boolean {
  if (!a || isMockMarkRecord(a)) return false;
  if (a.reportScope === 'mid_term' || a.standaloneMidTerm === true || a.mockSeries === 'mid_term') return true;
  const typeLower = String(a.assessmentType || '').toLowerCase();
  const nameLower = String(a.assessmentName || '').toLowerCase();
  const combined = `${typeLower} ${nameLower}`;
  const hasMid = combined.includes('mid-term') || combined.includes('mid term') || combined.includes('midterm') || combined.includes('mid-sem') || combined.includes('mid sem') || combined.includes('midsemester');
  if (!hasMid) return false;
  return combined.includes('standalone') || combined.includes('100%') || typeLower === 'mid-term exam';
}

function isAnyMidTermRecord(a: any): boolean {
  if (!a || isMockMarkRecord(a)) return false;
  if (isDedicatedMidTermRecord(a)) return true;
  const combined = `${a.assessmentType || ''} ${a.assessmentName || ''}`.toLowerCase();
  return combined.includes('mid-term') || combined.includes('mid term') || combined.includes('midterm') || combined.includes('mid-sem') || combined.includes('mid sem') || combined.includes('midsemester');
}

/**
 * Computes anonymous class-subject CA structure (no student IDs or scores) for End-of-Term and Mid-Term
 * from all assessment docs of one (schoolId, termId, classId, subjectId).
 */
export function computeCaProfilesForClassSubject(docs: any[]): {
  end_of_term: SubjectCaProfileDoc;
  mid_term: SubjectCaProfileDoc;
} {
  const eot: SubjectCaProfileDoc = { tests: {}, hwMax: 0, projMax: 0, midMax: 0, examMax: 0, hasDedicatedMidTerm: false };
  const mt: SubjectCaProfileDoc = { tests: {}, hwMax: 0, projMax: 0, midMax: 0, examMax: 0, hasDedicatedMidTerm: false };
  const num = (v: any, d: number) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : d; };

  const validDocs = (docs || []).filter(a => a && Number.isFinite(Number(a.score)));

  // 1. End of Term
  validDocs.forEach(a => {
    if (isMockMarkRecord(a) || isDedicatedMidTermRecord(a)) return;
    if (isAnyMidTermRecord(a)) {
      const m = num(a.maxScore, 20);
      if (m > eot.midMax) eot.midMax = m;
      return;
    }
    const typeLower = String(a.assessmentType || '').toLowerCase();
    const nameLower = String(a.assessmentName || '').toLowerCase();
    const combined = `${typeLower} ${nameLower}`;
    if ((typeLower.includes('exam') && !typeLower.includes('ca')) || ((nameLower.includes('end of term') || nameLower.includes('terminal exam') || nameLower === 'exam') && !typeLower.includes('ca'))) {
      const m = num(a.maxScore, 100);
      if (m > eot.examMax) eot.examMax = m;
      return;
    }
    if (combined.includes('proj') || combined.includes('group') || combined.includes('practical')) {
      const m = num(a.maxScore, 10);
      if (m > eot.projMax) eot.projMax = m;
      return;
    }
    if (combined.includes('home') || combined.includes('hw') || combined.includes('assign')) {
      const m = num(a.maxScore, 10);
      if (m > eot.hwMax) eot.hwMax = m;
      return;
    }
    const key = safeKey(String(a.assessmentName || 'test 1').trim().toLowerCase() || 'test 1');
    const m = num(a.maxScore, 20);
    if (m > (eot.tests[key] || 0)) eot.tests[key] = m;
  });

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
      if (m > mt.examMax) mt.examMax = m;
    } else if (slot === 'hw') {
      const m = num(a.maxScore, 20);
      if (m > mt.hwMax) mt.hwMax = m;
    } else if (slot === 'project') {
      const m = num(a.maxScore, 20);
      if (m > mt.projMax) mt.projMax = m;
    } else {
      const key = safeKey(String(a.assessmentName || 'test 1').trim().toLowerCase() || 'test 1');
      const m = num(a.maxScore, 20);
      if (m > (mt.tests[key] || 0)) mt.tests[key] = m;
    }
  });

  return { end_of_term: eot, mid_term: mt };
}

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

function isNonTerminalSeriesMark(a: any): boolean {
  return isMockMarkRecord(a) || isDedicatedMidTermRecord(a);
}

/** What one mark contributes, or null if it is not an End-of-Term usable mark. */
export function markPart(a: any): MarkPart | null {
  if (!a || !a.schoolId || !a.studentId) return null;
  // Exclude Mock exams and Dedicated Mid-Term workspace marks so End-of-Term classAverages & academicSummary stay uncontaminated.
  if (isNonTerminalSeriesMark(a)) return null;
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
  const rawBefore = event.data?.before?.exists ? event.data.before.data() : null;
  const rawAfter = event.data?.after?.exists ? event.data.after.data() : null;
  const before = markPart(rawBefore);
  const after = markPart(rawAfter);

  const inc = (n: number) => FieldValue.increment(n);
  const writes: Promise<any>[] = [];

  if (before || after) {
    if (!(before && after && JSON.stringify(before) === JSON.stringify(after))) {
      if (before) writes.push(ACADEMIC_SUMMARY(before.schoolId, before.termId).set({ ...contribution(before, -1, inc), updatedAt: FieldValue.serverTimestamp() }, { merge: true }));
      if (after) writes.push(ACADEMIC_SUMMARY(after.schoolId, after.termId).set({ ...contribution(after, 1, inc), updatedAt: FieldValue.serverTimestamp() }, { merge: true }));
      if (before?.classId && before.subjectId) writes.push(CLASS_AVERAGES(before.schoolId, before.termId, before.classId).set({ ...classContribution(before, -1, inc), updatedAt: FieldValue.serverTimestamp() }, { merge: true }));
      if (after?.classId && after.subjectId) writes.push(CLASS_AVERAGES(after.schoolId, after.termId, after.classId).set({ ...classContribution(after, 1, inc), updatedAt: FieldValue.serverTimestamp() }, { merge: true }));
    }
  }

  // Recompute exact anonymous CA profile for affected (schoolId, termId, classId, subjectId) so Ward Grades
  // always matches Report Card / Gradebook denominators even when a student missed Test 2 or Homework!
  const targets = new Map<string, { schoolId: string; termId: string; rawClassId: string; rawSubjectId: string; safeClassId: string; safeSubId: string; subjectName: string }>();
  [rawBefore, rawAfter].forEach((r: any) => {
    if (!r || !r.schoolId || !r.classId || !(r.subjectId || r.subjectName) || isMockMarkRecord(r)) return;
    const termId = termStampOfRecord(r)?.termId || 'unknown';
    if (termId === 'unknown') return;
    const safeClassId = safeKey(r.classId);
    const safeSubId = safeKey(r.subjectId || r.subjectName || 'general');
    const k = `${r.schoolId}__${termId}__${safeClassId}__${safeSubId}`;
    targets.set(k, {
      schoolId: String(r.schoolId),
      termId,
      rawClassId: String(r.classId),
      rawSubjectId: String(r.subjectId || ''),
      safeClassId,
      safeSubId,
      subjectName: String(r.subjectName || ''),
    });
  });

  for (const t of targets.values()) {
    try {
      let q: FirebaseFirestore.Query = db.collection('assessments')
        .where('schoolId', '==', t.schoolId)
        .where('classId', '==', t.rawClassId);
      if (t.rawSubjectId) {
        q = q.where('subjectId', '==', t.rawSubjectId);
      }
      const snap = await q.get();
      const termDocs = snap.docs.map(d => d.data()).filter(d => (termStampOfRecord(d)?.termId || 'unknown') === t.termId);
      const profiles = computeCaProfilesForClassSubject(termDocs);
      const eotKey = `end_of_term__${t.safeSubId}`;
      const mtKey = `mid_term__${t.safeSubId}`;
      const upsertExactProfiles = async (ref: FirebaseFirestore.DocumentReference, topField: 'profiles' | 'caProfiles') => {
        const snapDoc = await ref.get();
        if (!snapDoc.exists) {
          await ref.set({
            schoolId: t.schoolId,
            termId: t.termId,
            classId: t.safeClassId,
            [topField]: {
              [eotKey]: profiles.end_of_term,
              [mtKey]: profiles.mid_term,
              ...(t.subjectName ? {
                [`end_of_term__name__${safeKey(t.subjectName.toLowerCase().trim())}`]: profiles.end_of_term,
                [`mid_term__name__${safeKey(t.subjectName.toLowerCase().trim())}`]: profiles.mid_term,
              } : {}),
            },
            updatedAt: FieldValue.serverTimestamp(),
          });
        } else {
          const args: any[] = [
            new FieldPath(topField, eotKey), profiles.end_of_term,
            new FieldPath(topField, mtKey), profiles.mid_term,
            'updatedAt', FieldValue.serverTimestamp(),
          ];
          if (t.subjectName) {
            const safeSubName = safeKey(t.subjectName.toLowerCase().trim());
            args.push(
              new FieldPath(topField, `end_of_term__name__${safeSubName}`), profiles.end_of_term,
              new FieldPath(topField, `mid_term__name__${safeSubName}`), profiles.mid_term,
            );
          }
          await (ref as any).update(...args);
        }
      };
      writes.push(upsertExactProfiles(CLASS_SERIES_PROFILES(t.schoolId, t.termId, t.safeClassId), 'profiles'));
      writes.push(upsertExactProfiles(CLASS_AVERAGES(t.schoolId, t.termId, t.safeClassId), 'caProfiles'));
    } catch (profErr: any) {
      console.warn('[academicSummary] caProfile update warning:', profErr?.message);
    }
  }

  if (writes.length > 0) {
    await Promise.all(writes).catch(e => console.warn('[academicSummary] update failed:', e?.message));
  }
});
