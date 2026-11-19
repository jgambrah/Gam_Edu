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
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue, FieldPath } from 'firebase-admin/firestore';
import {
  termStampOfRecord,
  stampFromTermId,
  normalizeYear,
  termNumber,
  academicYearVariantsForStamp,
  termVariantsForStamp,
} from './term-utils';

if (!getApps().length) initializeApp();
const defaultDb = getFirestore();

export const INSTANCE_COOLDOWN_MS = 60_000;
export const LEASE_WINDOW_MS = 5 * 60_000;
export const MAX_SCHEDULED_RECOMPUTES = 200;
export const MAX_DIRTY_ATTEMPTS = 5;

interface CooldownEntry {
  cooldownUntil: number;
  coveredEventTimeMs: number;
  dirtyMarkedUntil: number;
}

const instanceCooldowns = new Map<string, CooldownEntry>();

export function resetAcademicSummaryMemoryCacheForTests(): void {
  instanceCooldowns.clear();
}

export const ACADEMIC_SUMMARY = (schoolId: string, termId: string, store: FirebaseFirestore.Firestore = defaultDb) =>
  store.collection('academicSummary').doc(`${schoolId}__${termId}`);

export const CLASS_AVERAGES = (schoolId: string, termId: string, classId: string, store: FirebaseFirestore.Firestore = defaultDb) =>
  store.collection('classAverages').doc(`${schoolId}__${termId}__${classId}`);

export const CLASS_SERIES_PROFILES = (schoolId: string, termId: string, classId: string, store: FirebaseFirestore.Firestore = defaultDb) =>
  store.collection('classSeriesProfiles').doc(`${schoolId}__${termId}__${classId}`);

export interface SubjectCaProfileDoc {
  testCount: number;
  testMaxAvg: number;
  hwMax: number;
  projMax: number;
  midMax: number;
  examMax: number;
  hasDedicatedMidTerm: boolean;
}

export interface ProfileRecomputeTarget {
  schoolId: string;
  termId: string;
  rawClassId: string;
  rawSubjectId: string;
  rawYear: string;
  rawTerm: string;
  safeClassId: string;
  safeSubId: string;
  subjectName: string;
  hasExplicitTermId: boolean;
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

export function isServerGradedQuizRecord(r: any): boolean {
  return Boolean(r && (r.gradedOnServer === true || r.quizId));
}

const safeKey = (v: any) => String(v || '').replace(/[.\/\[\]#$*`~]/g, '_').slice(0, 120);

/**
 * Returns true if an update did NOT alter any score, component, class, subject, year, term, or termId
 * (or is purely a term-close / term-unlock archival flag toggle).
 */
export function isNoOpForProfileAndVersion(rawBefore: any, rawAfter: any): boolean {
  if (!rawBefore || !rawAfter) return false;
  const contentSame =
    rawBefore.score === rawAfter.score &&
    rawBefore.maxScore === rawAfter.maxScore &&
    rawBefore.assessmentType === rawAfter.assessmentType &&
    rawBefore.assessmentName === rawAfter.assessmentName &&
    rawBefore.reportScope === rawAfter.reportScope &&
    rawBefore.midTermSlot === rawAfter.midTermSlot &&
    rawBefore.mockSeries === rawAfter.mockSeries &&
    rawBefore.standaloneMidTerm === rawAfter.standaloneMidTerm &&
    safeKey(rawBefore.classId) === safeKey(rawAfter.classId) &&
    safeKey(rawBefore.subjectId || rawBefore.subjectName || 'general') === safeKey(rawAfter.subjectId || rawAfter.subjectName || 'general');

  if (!contentSame) return false;

  // Term close / unlock rewrites `isArchived` (and stamps `closedInTermId` / `termId` / `unlockedForCorrection`)
  // without changing marks or subjects — must produce 0 scans.
  if (Boolean(rawBefore.isArchived) !== Boolean(rawAfter.isArchived)) {
    return true;
  }

  return (
    String(rawBefore.classId || '') === String(rawAfter.classId || '') &&
    String(rawBefore.subjectId || '') === String(rawAfter.subjectId || '') &&
    String(rawBefore.academicYear || '') === String(rawAfter.academicYear || '') &&
    String(rawBefore.term || '') === String(rawAfter.term || '') &&
    String(rawBefore.termId || '') === String(rawAfter.termId || '') &&
    (termStampOfRecord(rawBefore)?.termId || '') === (termStampOfRecord(rawAfter)?.termId || '') &&
    normalizeYear(rawBefore.academicYear) === normalizeYear(rawAfter.academicYear) &&
    termNumber(rawBefore.term) === termNumber(rawAfter.term)
  );
}

/**
 * Computes anonymous class-subject CA structure (no student IDs, scores, or free-text names)
 * for End-of-Term and Mid-Term from all assessment docs of one (schoolId, termId, classId, subjectId).
 */
export function computeCaProfilesForClassSubject(docs: any[]): {
  end_of_term: SubjectCaProfileDoc;
  mid_term: SubjectCaProfileDoc;
} {
  const eotTests = new Map<string, number>();
  const mtTests = new Map<string, number>();
  const eot: SubjectCaProfileDoc = { testCount: 0, testMaxAvg: 0, hwMax: 0, projMax: 0, midMax: 0, examMax: 0, hasDedicatedMidTerm: false };
  const mt: SubjectCaProfileDoc = { testCount: 0, testMaxAvg: 0, hwMax: 0, projMax: 0, midMax: 0, examMax: 0, hasDedicatedMidTerm: false };
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
    const key = String(a.assessmentName || 'test 1').trim().toLowerCase() || 'test 1';
    const m = num(a.maxScore, 20);
    if (m > (eotTests.get(key) || 0)) eotTests.set(key, m);
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
      if (m > mt.examMax) mt.examMax = m;
    } else if (slot === 'hw') {
      const m = num(a.maxScore, 20);
      if (m > mt.hwMax) mt.hwMax = m;
    } else if (slot === 'project') {
      const m = num(a.maxScore, 20);
      if (m > mt.projMax) mt.projMax = m;
    } else {
      const key = String(a.assessmentName || 'test 1').trim().toLowerCase() || 'test 1';
      const m = num(a.maxScore, 20);
      if (m > (mtTests.get(key) || 0)) mtTests.set(key, m);
    }
  });
  const mtVals = Array.from(mtTests.values());
  mt.testCount = mtVals.length;
  mt.testMaxAvg = mtVals.length > 0 ? Math.round((mtVals.reduce((s, v) => s + v, 0) / mtVals.length) * 100) / 100 : 0;

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

const billedQueryReads = (docCount: number): number => (docCount > 0 ? docCount : 1);

/**
 * Scans all marks for one `(schoolId, termId, classId, subjectId)` scoped first by stamped `termId`
 * (single query, immune to year/term spelling differences), with a spelling-tolerant fallback to
 * `academicYearVariants` x `termVariants` when unstamped legacy marks exist.
 */
async function scanSubjectTermAssessments(
  store: FirebaseFirestore.Firestore,
  t: ProfileRecomputeTarget,
  forceVariantScan: boolean
): Promise<{ termDocs: any[]; reads: number; sawUnstamped: boolean }> {
  let reads = 0;
  const byId = new Map<string, any>();

  const buildBase = () => {
    let q: FirebaseFirestore.Query = store.collection('assessments')
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
    const canonical = stampFromTermId(t.termId);
    const ySet = new Set<string>([
      ...academicYearVariantsForStamp(canonical?.academicYear || ''),
      ...academicYearVariantsForStamp(t.rawYear),
    ]);
    const tSet = new Set<string>([
      ...termVariantsForStamp(canonical?.term || ''),
      ...termVariantsForStamp(t.rawTerm),
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
  const termDocs: any[] = [];
  byId.forEach(d => {
    if ((termStampOfRecord(d)?.termId || 'unknown') === t.termId) {
      termDocs.push(d);
      if (!d.termId) sawUnstamped = true;
    }
  });

  return { termDocs, reads, sawUnstamped };
}

async function recomputeAndPersistSubjectCaProfile(
  store: FirebaseFirestore.Firestore,
  t: ProfileRecomputeTarget,
  hasLegacyUnstamped: boolean
): Promise<{ reads: number }> {
  const { termDocs, reads, sawUnstamped } = await scanSubjectTermAssessments(store, t, hasLegacyUnstamped);
  const profiles = computeCaProfilesForClassSubject(termDocs);
  const eotKey = `end_of_term__${t.safeSubId}`;
  const mtKey = `mid_term__${t.safeSubId}`;
  const profRef = CLASS_SERIES_PROFILES(t.schoolId, t.termId, t.safeClassId, store);
  const avgRef = CLASS_AVERAGES(t.schoolId, t.termId, t.safeClassId, store);

  const upsertExactProfiles = async (
    ref: FirebaseFirestore.DocumentReference,
    topField: 'profiles' | 'caProfiles',
    isProfileCollection: boolean
  ) => {
    const baseMeta: Record<string, any> = {
      schoolId: t.schoolId,
      termId: t.termId,
      classId: t.safeClassId,
    };
    if (isProfileCollection && sawUnstamped) {
      baseMeta.hasLegacyUnstamped = true;
    }
    await ref.set(baseMeta, { merge: true });

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
    if (isProfileCollection) {
      // R5-2: reset retry counter on successful recompute (R5-5: `dirty.<subId>` is cleared BEFORE scan starts!)
      args.push(new FieldPath('dirtyAttempts', t.safeSubId), FieldValue.delete());
    }
    await (ref as any).update(...args);
  };

  await Promise.all([
    upsertExactProfiles(profRef, 'profiles', true),
    upsertExactProfiles(avgRef, 'caProfiles', false),
  ]);

  return { reads };
}

async function markSubjectDirtyNoRead(
  store: FirebaseFirestore.Firestore,
  t: ProfileRecomputeTarget
): Promise<void> {
  const profRef = CLASS_SERIES_PROFILES(t.schoolId, t.termId, t.safeClassId, store);
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

export async function processAssessmentWriteEvent(
  store: FirebaseFirestore.Firestore,
  params: {
    rawBefore: any | null;
    rawAfter: any | null;
    eventTimeMs?: number;
    nowMs?: number;
  }
): Promise<{ reads: number; scans: number }> {
  const { rawBefore, rawAfter } = params;
  const nowMs = params.nowMs ?? Date.now();
  const eventTimeMs = params.eventTimeMs || nowMs;
  const schoolId = String(rawAfter?.schoolId || rawBefore?.schoolId || 'unknown');

  let reads = 0;
  let scans = 0;

  // Early exit for archival-only rewrites (term close / unlock) or identical writes
  const noOp = isNoOpForProfileAndVersion(rawBefore, rawAfter);

  const before = markPart(rawBefore);
  const after = markPart(rawAfter);
  const inc = (n: number) => FieldValue.increment(n);
  const writes: Promise<any>[] = [];
  const versionStampedClassTerms = new Set<string>();

  if (before || after) {
    if (!(before && after && JSON.stringify(before) === JSON.stringify(after))) {
      if (before) {
        writes.push(
          ACADEMIC_SUMMARY(before.schoolId, before.termId, store).set(
            { ...contribution(before, -1, inc), updatedAt: FieldValue.serverTimestamp() },
            { merge: true }
          )
        );
      }
      if (after) {
        writes.push(
          ACADEMIC_SUMMARY(after.schoolId, after.termId, store).set(
            { ...contribution(after, 1, inc), updatedAt: FieldValue.serverTimestamp() },
            { merge: true }
          )
        );
      }
      if (before?.classId && before.subjectId) {
        versionStampedClassTerms.add(`${before.schoolId}__${before.termId}__${before.classId}`);
        writes.push(
          CLASS_AVERAGES(before.schoolId, before.termId, before.classId, store).set(
            {
              ...classContribution(before, -1, inc),
              lastMarkWriteAt: FieldValue.serverTimestamp(),
              markVersion: inc(1),
              updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
          )
        );
      }
      if (after?.classId && after.subjectId) {
        const sameClassTermAsBefore =
          before?.schoolId === after.schoolId &&
          before?.termId === after.termId &&
          before?.classId === after.classId &&
          Boolean(before?.subjectId);
        versionStampedClassTerms.add(`${after.schoolId}__${after.termId}__${after.classId}`);
        writes.push(
          CLASS_AVERAGES(after.schoolId, after.termId, after.classId, store).set(
            {
              ...classContribution(after, 1, inc),
              ...(sameClassTermAsBefore
                ? {}
                : { lastMarkWriteAt: FieldValue.serverTimestamp(), markVersion: inc(1) }),
              updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
          )
        );
      }
    }
  }

  // Also bump `lastMarkWriteAt` & `markVersion` on `classAverages` for non-End-of-Term mark writes
  // (Dedicated Mid-Term & Mock marks) so active-term Master List snapshots invalidate immediately!
  if (!noOp) {
    [rawBefore, rawAfter].forEach((r: any) => {
      if (!r || !r.schoolId || !r.classId) return;
      const termId = termStampOfRecord(r)?.termId || 'unknown';
      if (termId === 'unknown') return;
      const safeClassId = safeKey(r.classId);
      const ctKey = `${r.schoolId}__${termId}__${safeClassId}`;
      if (versionStampedClassTerms.has(ctKey)) return;
      versionStampedClassTerms.add(ctKey);
      writes.push(
        CLASS_AVERAGES(String(r.schoolId), termId, safeClassId, store).set(
          {
            schoolId: String(r.schoolId),
            termId,
            classId: safeClassId,
            lastMarkWriteAt: FieldValue.serverTimestamp(),
            markVersion: inc(1),
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        )
      );
    });
  }

  // Build CA profile recompute targets
  const targets = new Map<string, ProfileRecomputeTarget>();
  if (!noOp) {
    [rawBefore, rawAfter].forEach((r: any) => {
      if (!r || !r.schoolId || !r.classId || !(r.subjectId || r.subjectName)) return;
      // 1a) Server-graded quiz records never define CA structure -> skip profile recompute entirely
      if (isServerGradedQuizRecord(r) || isMockMarkRecord(r)) return;
      const termId = termStampOfRecord(r)?.termId || 'unknown';
      if (termId === 'unknown') return;
      const safeClassId = safeKey(r.classId);
      const safeSubId = safeKey(r.subjectId || r.subjectName || 'general');
      const k = `${r.schoolId}__${termId}__${safeClassId}__${safeSubId}`;
      const existing = targets.get(k);
      targets.set(k, {
        schoolId: String(r.schoolId),
        termId,
        rawClassId: String(r.classId),
        rawSubjectId: String(r.subjectId || existing?.rawSubjectId || ''),
        rawYear: String(r.academicYear || existing?.rawYear || ''),
        rawTerm: String(r.term || existing?.rawTerm || ''),
        safeClassId,
        safeSubId,
        subjectName: String(r.subjectName || existing?.subjectName || ''),
        hasExplicitTermId: existing ? (existing.hasExplicitTermId && Boolean(r.termId)) : Boolean(r.termId),
      });
    });
  }

  if (writes.length > 0) {
    await Promise.all(writes).catch(e => console.warn('[academicSummary] update failed:', e?.message));
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
        await markSubjectDirtyNoRead(store, t).catch(err =>
          console.warn('[academicSummary] dirty marker write warning:', err?.message)
        );
      }
      continue;
    }

    // Reserve in-memory cooldown immediately for concurrent invocations on this instance
    instanceCooldowns.set(targetKey, {
      cooldownUntil: nowMs + INSTANCE_COOLDOWN_MS,
      coveredEventTimeMs: eventTimeMs,
      dirtyMarkedUntil: 0,
    });

    try {
      const profRef = CLASS_SERIES_PROFILES(t.schoolId, t.termId, t.safeClassId, store);

      const leaseOutcome = await store.runTransaction(async (tx) => {
        const profSnap = await tx.get(profRef);
        reads += 1;
        const profData = profSnap.data() || {};
        const lastScannedEventMs = Number(profData.scanLease?.[t.safeSubId] || 0);
        const leaseUntilMs = Number(profData.scanLeaseUntil?.[t.safeSubId] || 0);
        const hasLegacyUnstamped = profData.hasLegacyUnstamped === true;

        if (eventTimeMs > 0 && lastScannedEventMs >= eventTimeMs) {
          return { action: 'already_covered' as const, lastScannedEventMs, leaseUntilMs, hasLegacyUnstamped };
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
          return { action: 'marked_dirty' as const, lastScannedEventMs, leaseUntilMs, hasLegacyUnstamped };
        }

        const nextLeaseEventMs = Math.max(nowMs, eventTimeMs);
        tx.set(profRef, {
          schoolId: t.schoolId,
          termId: t.termId,
          classId: t.safeClassId,
          scanLease: { [t.safeSubId]: nextLeaseEventMs },
          scanLeaseUntil: { [t.safeSubId]: nowMs + LEASE_WINDOW_MS },
        }, { merge: true });
        if (profSnap.exists && profData.dirty?.[t.safeSubId]) {
          // R5-5: Clear `dirty.<subId>` BEFORE scanning so any write arriving *during* the scan survives!
          (tx as any).update(profRef, new FieldPath('dirty', t.safeSubId), FieldValue.delete());
        }
        return { action: 'scan_now' as const, lastScannedEventMs: nextLeaseEventMs, leaseUntilMs: nowMs + LEASE_WINDOW_MS, hasLegacyUnstamped };
      });

      if (leaseOutcome.action === 'already_covered') {
        instanceCooldowns.set(targetKey, {
          cooldownUntil: nowMs + INSTANCE_COOLDOWN_MS,
          coveredEventTimeMs: Math.max(eventTimeMs, leaseOutcome.lastScannedEventMs),
          dirtyMarkedUntil: 0,
        });
        continue;
      }

      if (leaseOutcome.action === 'marked_dirty') {
        const until = Math.min(leaseOutcome.leaseUntilMs, nowMs + INSTANCE_COOLDOWN_MS);
        instanceCooldowns.set(targetKey, {
          cooldownUntil: until,
          coveredEventTimeMs: leaseOutcome.lastScannedEventMs,
          dirtyMarkedUntil: until,
        });
        continue;
      }

      const scanRes = await recomputeAndPersistSubjectCaProfile(
        store,
        t,
        leaseOutcome.hasLegacyUnstamped
      );
      reads += scanRes.reads;
      scans += 1;
    } catch (profErr: any) {
      // R4-3 self-heal: release in-memory cooldown and flag dirty so the 5-min scheduler retries cleanly
      instanceCooldowns.delete(targetKey);
      await markSubjectDirtyNoRead(store, t).catch(() => {});
      console.warn('[academicSummary] caProfile update warning:', profErr?.message);
    }
  }

  console.log('[readBudget]', { fn: 'onAssessmentWriteForSummary', schoolId, reads, scans });
  return { reads, scans };
}

export async function runFlushDirtyProfiles(
  store: FirebaseFirestore.Firestore = defaultDb,
  maxRecomputes: number = MAX_SCHEDULED_RECOMPUTES
): Promise<{ reads: number; recomputed: number }> {
  let totalReads = 0;
  let recomputed = 0;
  const readsBySchool = new Map<string, number>();
  const addSchoolReads = (sid: string, n: number) => {
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
        const freshSnap = await tx.get(profDoc.ref);
        addSchoolReads(schoolId, 1);
        const freshDirty = freshSnap.data()?.dirty || {};
        if (!Object.values(freshDirty).some(Boolean)) {
          tx.set(profDoc.ref, { hasDirtyProfiles: false }, { merge: true });
        }
      });
      continue;
    }

    for (const safeSubId of dirtySubIds) {
      if (recomputed >= maxRecomputes) break;
      const meta = dirtyTargets[safeSubId] || {};
      const target: ProfileRecomputeTarget = {
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
        await (profDoc.ref as any).update(
          new FieldPath('dirty', safeSubId), FieldValue.delete(),
          new FieldPath('dirtyTargets', safeSubId), FieldValue.delete()
        );
        const res = await recomputeAndPersistSubjectCaProfile(
          store,
          target,
          data.hasLegacyUnstamped === true
        );
        addSchoolReads(schoolId, res.reads);
        recomputed += 1;
      } catch (err: any) {
        // R5-2: Cap retries at MAX_DIRTY_ATTEMPTS (5) so a broken subject never retries 288 times/day!
        const nextAttempts = (Number(dirtyAttempts[safeSubId]) || 0) + 1;
        if (nextAttempts >= MAX_DIRTY_ATTEMPTS) {
          console.warn(
            `[flushDirtyClassSeriesProfiles] Giving up after ${nextAttempts} attempts:`,
            schoolId, termId, safeClassId, safeSubId, err?.message
          );
          await profDoc.ref.set({
            dirtyAttempts: { [safeSubId]: nextAttempts },
            dirtyGaveUpAt: { [safeSubId]: Date.now() },
          }, { merge: true }).catch(() => {});
        } else {
          console.warn(
            `[flushDirtyClassSeriesProfiles] Retry ${nextAttempts}/${MAX_DIRTY_ATTEMPTS} scheduled:`,
            schoolId, termId, safeClassId, safeSubId, err?.message
          );
          await profDoc.ref.set({
            hasDirtyProfiles: true,
            dirty: { [safeSubId]: true },
            dirtyTargets: { [safeSubId]: meta },
            dirtyAttempts: { [safeSubId]: nextAttempts },
          }, { merge: true }).catch(() => {});
        }
      }
    }

    // R5-5: Only clear `hasDirtyProfiles` if NO dirty keys remain (including any added concurrently during scans)
    await store.runTransaction(async (tx) => {
      const freshSnap = await tx.get(profDoc.ref);
      addSchoolReads(schoolId, 1);
      const freshDirty = freshSnap.data()?.dirty || {};
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

export const onAssessmentWriteForSummary = onDocumentWritten('assessments/{assessmentId}', async (event) => {
  const rawBefore = event.data?.before?.exists ? event.data.before.data() : null;
  const rawAfter = event.data?.after?.exists ? event.data.after.data() : null;
  const eventTimeMs = (event.time ? Date.parse(event.time) : 0) || Date.now();
  await processAssessmentWriteEvent(defaultDb, { rawBefore, rawAfter, eventTimeMs });
});

// R5-6: Explicit 300s timeout and 256MiB memory so up to 200 recomputes complete comfortably within schedule budget
export const flushDirtyClassSeriesProfiles = onSchedule(
  { schedule: 'every 5 minutes', timeoutSeconds: 300, memory: '256MiB' },
  async () => {
    await runFlushDirtyProfiles(defaultDb, MAX_SCHEDULED_RECOMPUTES);
  }
);
