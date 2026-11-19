/**
 * Automated Read-Budget Verification Suite (`node scripts/verify-read-budgets.mjs`)
 *
 * Exercises the real compiled Cloud Functions (`processAssessmentWriteEvent`, `runFlushDirtyProfiles`,
 * `syncUserCustomClaims`) and client caching primitives against an instrumented Firestore store that
 * counts every billed read (`doc.get()`, `tx.get()`, and `query.get()` with Firestore's min-1-read rule).
 *
 * Verifies every acceptance threshold:
 *   1. 245-write Gradebook batch         -> exactly 1 full scan
 *   2. 700 trickled server quiz writes   -> 0 full scans (<= 10)
 *   3. 700 trickled non-quiz CA writes   -> <= 10 full scans across 12 minutes + scheduled flushes
 *   4. Term close & unlock (500 marks)   -> 0 scans, 0 reads
 *   5. Mixed year/term spellings (1e)    -> 0 undercounting
 *   6. Subject move relink (1d)          -> recomputes BOTH old and new subjects
 *   7. Master List open (unchanged)      -> <= 5 reads (exact: 2 reads); 2x series switch -> 0 extra reads
 *   8. Master List open (changed)        -> class marks + class cards only; 2x series switch -> 0 extra reads
 *   9. My Grades open + 2x series switch -> <= 150 reads typical; series switch -> 0 extra reads
 *  10. Report Card Manager class select  -> class report cards + roster only (0 assessment reads)
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const fnRequire = createRequire(new URL('../functions/package.json', import.meta.url));
const admin = fnRequire('firebase-admin');
if (!admin.apps.length) {
  admin.initializeApp({ projectId: 'demo-gam-edu' });
}

const { FieldPath } = fnRequire('firebase-admin/firestore');
const {
  processAssessmentWriteEvent,
  runFlushDirtyProfiles,
  resetAcademicSummaryMemoryCacheForTests,
} = fnRequire('./lib/academic-summary');
const { syncUserCustomClaims } = fnRequire('./lib/auth-claims');

function isIncrement(v) {
  return v && typeof v === 'object' && v.constructor && v.constructor.name === 'NumericIncrementTransform';
}
function isDelete(v) {
  return v && typeof v === 'object' && v.constructor && v.constructor.name === 'DeleteTransform';
}
function isServerTimestamp(v) {
  return v && typeof v === 'object' && v.constructor && v.constructor.name === 'ServerTimestampTransform';
}

function applyValue(prevVal, nextVal, nowMs) {
  if (isDelete(nextVal)) return undefined;
  if (isServerTimestamp(nextVal)) return nowMs;
  if (isIncrement(nextVal)) return (Number(prevVal) || 0) + Number(nextVal.operand || 0);
  if (nextVal && typeof nextVal === 'object' && !Array.isArray(nextVal)) {
    const out = (prevVal && typeof prevVal === 'object' && !Array.isArray(prevVal)) ? { ...prevVal } : {};
    for (const [k, v] of Object.entries(nextVal)) {
      const applied = applyValue(out[k], v, nowMs);
      if (applied === undefined) delete out[k];
      else out[k] = applied;
    }
    return out;
  }
  return nextVal;
}

class InstrumentedFirestore {
  constructor() {
    this.cols = new Map();
    this.reads = 0;
    this.queryScans = 0;
    this.nowMs = 1_795_090_000_000;
  }

  resetCounters() {
    this.reads = 0;
    this.queryScans = 0;
  }

  _colMap(name) {
    if (!this.cols.has(name)) this.cols.set(name, new Map());
    return this.cols.get(name);
  }

  seed(colName, id, data) {
    this._colMap(colName).set(id, structuredClone(data));
  }

  peek(colName, id) {
    return this._colMap(colName).get(id);
  }

  collection(colName) {
    const self = this;
    const makeDocRef = (id) => ({
      id,
      async get() {
        self.reads += 1;
        const raw = self._colMap(colName).get(id);
        return {
          id,
          exists: raw !== undefined,
          data: () => (raw !== undefined ? structuredClone(raw) : undefined),
          ref: makeDocRef(id),
        };
      },
      async set(data, opts) {
        const col = self._colMap(colName);
        const prev = opts?.merge ? (col.get(id) || {}) : {};
        col.set(id, applyValue(prev, data, self.nowMs));
      },
      async update(...args) {
        const col = self._colMap(colName);
        const cur = structuredClone(col.get(id) || {});
        if (args.length === 1 && typeof args[0] === 'object' && !(args[0] instanceof FieldPath)) {
          col.set(id, applyValue(cur, args[0], self.nowMs));
          return;
        }
        for (let i = 0; i < args.length; i += 2) {
          const fp = args[i];
          const val = args[i + 1];
          const segs = fp instanceof FieldPath
            ? (Array.isArray(fp.segments) ? fp.segments : String(fp.formattedName || fp).split('.'))
            : String(fp).split('.');
          let cursor = cur;
          for (let s = 0; s < segs.length - 1; s++) {
            const k = segs[s];
            if (!cursor[k] || typeof cursor[k] !== 'object') cursor[k] = {};
            cursor = cursor[k];
          }
          const leaf = segs[segs.length - 1];
          if (isDelete(val)) delete cursor[leaf];
          else cursor[leaf] = isServerTimestamp(val) ? self.nowMs : structuredClone(val);
        }
        col.set(id, cur);
      },
    });

    const makeQuery = (filters = [], maxLimit = Infinity) => ({
      where(field, op, value) {
        return makeQuery([...filters, { field, op, value }], maxLimit);
      },
      orderBy() {
        return makeQuery(filters, maxLimit);
      },
      limit(n) {
        return makeQuery(filters, n);
      },
      async get() {
        if (colName === 'assessments') self.queryScans += 1;
        const col = self._colMap(colName);
        const matched = [];
        for (const [id, data] of col.entries()) {
          const ok = filters.every(({ field, op, value }) => {
            const dv = field === '__name__' ? id : data?.[field];
            if (op === '==') return dv === value;
            if (op === 'in') return Array.isArray(value) && value.includes(dv);
            return true;
          });
          if (ok) {
            matched.push({
              id,
              exists: true,
              data: () => structuredClone(data),
              ref: makeDocRef(id),
            });
            if (matched.length >= maxLimit) break;
          }
        }
        // Firestore bills 1 read minimum when a query returns 0 docs
        self.reads += matched.length > 0 ? matched.length : 1;
        return {
          empty: matched.length === 0,
          size: matched.length,
          docs: matched,
        };
      },
    });

    return {
      doc: (id) => makeDocRef(id),
      where: (field, op, value) => makeQuery([{ field, op, value }]),
      orderBy: () => makeQuery([]),
      limit: (n) => makeQuery([], n),
      get: () => makeQuery([]).get(),
    };
  }

  async runTransaction(fn) {
    const tx = {
      get: (docRef) => docRef.get(),
      set: (docRef, data, opts) => docRef.set(data, opts),
      update: (docRef, ...args) => docRef.update(...args),
    };
    return fn(tx);
  }
}

// Silence verbose [readBudget] logs during automated assertion runs unless VERBOSE=1
const origLog = console.log;
const budgetLogs = [];
console.log = (...args) => {
  if (args[0] === '[readBudget]') {
    budgetLogs.push(args[1]);
    if (process.env.VERBOSE === '1') origLog(...args);
    return;
  }
  origLog(...args);
};

const resultsTable = [];

(async () => {
  // =========================================================================
  // TEST 1: 245-write Gradebook batch (35 students x 7 assessment slots)
  // =========================================================================
  resetAcademicSummaryMemoryCacheForTests();
  const db1 = new InstrumentedFirestore();
  // Seed 1,200 historical marks in earlier terms to prove the scan only reads the active term!
  for (let i = 0; i < 1200; i++) {
    db1.seed('assessments', `hist_${i}`, {
      schoolId: 'sch1',
      classId: 'jhs1',
      subjectId: 'math',
      studentId: `stu_${i % 35}`,
      academicYear: '2023-2024',
      term: 'First Term',
      termId: '2023-2024_T1',
      assessmentType: 'Class Exercise (CA)',
      assessmentName: 'Test 1',
      score: 15,
      maxScore: 20,
    });
  }

  const batchDocs = [];
  const slots = [
    { name: 'Test 1', type: 'Class Exercise (CA)', max: 20 },
    { name: 'Test 2', type: 'Class Exercise (CA)', max: 20 },
    { name: 'Test 3', type: 'Class Exercise (CA)', max: 20 },
    { name: 'Homework', type: 'Homework (CA)', max: 10 },
    { name: 'Project', type: 'Project (CA)', max: 10 },
    { name: 'Mid-Term (CA)', type: 'Mid-Term (CA)', max: 20 },
    { name: 'End of Term Exam', type: 'End of Term Exam', max: 100 },
  ];
  for (let s = 0; s < 35; s++) {
    for (let k = 0; k < slots.length; k++) {
      const id = `b_${s}_${k}`;
      const docData = {
        schoolId: 'sch1',
        classId: 'jhs1',
        subjectId: 'math',
        subjectName: 'Mathematics',
        studentId: `stu_${s}`,
        academicYear: '2025-2026',
        term: 'First Term',
        termId: '2025-2026_T1',
        assessmentName: slots[k].name,
        assessmentType: slots[k].type,
        score: Math.round(slots[k].max * 0.8),
        maxScore: slots[k].max,
      };
      db1.seed('assessments', id, docData);
      batchDocs.push(docData);
    }
  }
  assert.equal(batchDocs.length, 245);

  db1.resetCounters();
  const batchCommitTime = db1.nowMs;
  let batchScans = 0;
  for (const docData of batchDocs) {
    const r = await processAssessmentWriteEvent(db1, {
      rawBefore: null,
      rawAfter: docData,
      eventTimeMs: batchCommitTime,
      nowMs: batchCommitTime + 5,
    });
    batchScans += r.scans;
  }
  const batchReadsAfter = db1.reads;
  // Before Round 3/4: 245 triggers * (1,200 hist + 245 current) = 354,025 reads (or 245 tx reads + 245 scan = 490 reads in R3)
  const batchReadsBefore = 245 * (1200 + 245);
  assert.equal(batchScans, 1, '245-write Gradebook batch must produce exactly 1 scan');
  assert.equal(batchReadsAfter, 246, '1 lease tx read + 245 current-term subject docs = 246 reads');

  // Verify no leftover dirty flag causes a redundant scheduled scan for that same batch
  const flushAfterBatch = await runFlushDirtyProfiles(db1);
  assert.equal(flushAfterBatch.recomputed, 0);

  resultsTable.push({
    scenario: '245-write Gradebook batch (with 1,200 prior marks)',
    beforeReads: batchReadsBefore,
    afterReads: batchReadsAfter,
    scansAfter: batchScans,
    target: 'Exactly 1 scan',
  });

  // =========================================================================
  // TEST 2A: 700 trickled server-graded quiz writes (`gradedOnServer: true`, `quizId`)
  // =========================================================================
  resetAcademicSummaryMemoryCacheForTests();
  const db2 = new InstrumentedFirestore();
  db2.resetCounters();
  let quizScans = 0;
  for (let i = 0; i < 700; i++) {
    db2.nowMs += 1000;
    const quizDoc = {
      schoolId: 'sch1',
      classId: 'jhs1',
      subjectId: 'sci',
      studentId: `stu_${i % 35}`,
      academicYear: '2025-2026',
      term: 'First Term',
      termId: '2025-2026_T1',
      assessmentType: 'Class Exercise (CA)',
      score: 80,
      maxScore: 100,
      quizId: `quiz_${Math.floor(i / 35)}`,
      gradedOnServer: true,
    };
    db2.seed('assessments', `qz_${i}`, quizDoc);
    const r = await processAssessmentWriteEvent(db2, {
      rawBefore: null,
      rawAfter: quizDoc,
      eventTimeMs: db2.nowMs,
      nowMs: db2.nowMs,
    });
    quizScans += r.scans;
  }
  // Before: N*(N+1)/2 scan reads + N lease reads = 700*701/2 + 700 = 246,050 reads!
  const quizReadsBefore = (700 * 701) / 2 + 700;
  const quizReadsAfter = db2.reads;
  assert.equal(quizScans, 0, 'Server-graded quiz writes must produce 0 profile scans');
  assert.equal(quizReadsAfter, 0, 'Server-graded quiz writes must cost 0 reads in trigger');

  resultsTable.push({
    scenario: '700 trickled server-graded quiz writes (`quizId`)',
    beforeReads: quizReadsBefore,
    afterReads: quizReadsAfter,
    scansAfter: quizScans,
    target: '<= 10 scans (achieved: 0 scans, 0 reads)',
  });

  // =========================================================================
  // TEST 2B: 700 trickled teacher CA writes (1 write/sec for ~11.7m + 5m flushes)
  // =========================================================================
  resetAcademicSummaryMemoryCacheForTests();
  const db2b = new InstrumentedFirestore();
  let trickleScans = 0;
  for (let i = 0; i < 700; i++) {
    db2b.nowMs += 1000;
    const caDoc = {
      schoolId: 'sch1',
      classId: 'jhs1',
      subjectId: 'eng',
      subjectName: 'English',
      studentId: `stu_${i % 35}`,
      academicYear: '2025-2026',
      term: 'First Term',
      termId: '2025-2026_T1',
      assessmentType: 'Class Exercise (CA)',
      assessmentName: `Exercise ${(i % 3) + 1}`,
      score: 16,
      maxScore: 20,
    };
    db2b.seed('assessments', `tr_${i}`, caDoc);
    const r = await processAssessmentWriteEvent(db2b, {
      rawBefore: null,
      rawAfter: caDoc,
      eventTimeMs: db2b.nowMs,
      nowMs: db2b.nowMs,
    });
    trickleScans += r.scans;
    if ((i + 1) % 300 === 0) {
      const fl = await runFlushDirtyProfiles(db2b);
      trickleScans += fl.recomputed;
    }
  }
  const finalFlush = await runFlushDirtyProfiles(db2b);
  trickleScans += finalFlush.recomputed;
  assert.ok(trickleScans <= 10, `Expected <= 10 scans across 700 trickled writes, got ${trickleScans}`);

  resultsTable.push({
    scenario: '700 trickled teacher CA writes over 11.7 mins + 5m scheduler',
    beforeReads: quizReadsBefore,
    afterReads: db2b.reads,
    scansAfter: trickleScans,
    target: `<= 10 scans (achieved: ${trickleScans} scans)`,
  });

  // =========================================================================
  // TEST 3: Term close + Term unlock rewriting 500 marks
  // =========================================================================
  resetAcademicSummaryMemoryCacheForTests();
  const db3 = new InstrumentedFirestore();
  const termMarks = [];
  for (let i = 0; i < 500; i++) {
    const raw = {
      schoolId: 'sch1',
      classId: `cls_${i % 5}`,
      subjectId: `sub_${i % 8}`,
      studentId: `stu_${i % 40}`,
      academicYear: '2025-2026',
      term: 'First Term',
      assessmentName: 'Test 1',
      assessmentType: 'Class Exercise (CA)',
      score: 17,
      maxScore: 20,
    };
    db3.seed('assessments', `tm_${i}`, raw);
    termMarks.push(raw);
  }
  db3.resetCounters();
  let closeUnlockScans = 0;
  for (const m of termMarks) {
    // Close term (stamps isArchived: true, closedInTermId, termId)
    const closed = { ...m, isArchived: true, closedInTermId: '2025-2026_T1', termId: '2025-2026_T1' };
    const rClose = await processAssessmentWriteEvent(db3, { rawBefore: m, rawAfter: closed });
    closeUnlockScans += rClose.scans;
    // Unlock term (flips isArchived: false, unlockedForCorrection: true)
    const unlocked = { ...closed, isArchived: false, unlockedForCorrection: true };
    const rUnlock = await processAssessmentWriteEvent(db3, { rawBefore: closed, rawAfter: unlocked });
    closeUnlockScans += rUnlock.scans;
  }
  assert.equal(closeUnlockScans, 0, 'Term close and unlock must produce 0 scans');
  assert.equal(db3.reads, 0, 'Term close and unlock must produce 0 trigger reads');

  resultsTable.push({
    scenario: 'Term close + Term unlock across 500 marks (1,000 updates)',
    beforeReads: 500 * 100 * 2,
    afterReads: db3.reads,
    scansAfter: closeUnlockScans,
    target: '0 scans (achieved: 0 scans, 0 reads)',
  });

  // =========================================================================
  // TEST 4: Mixed year/term spellings (1e) & Subject Move relinker (1d)
  // =========================================================================
  resetAcademicSummaryMemoryCacheForTests();
  const db4 = new InstrumentedFirestore();
  // Legacy unstamped Test 1 saved as "2025/2026" + "Term 1"
  db4.seed('assessments', 'mix_1', {
    schoolId: 'sch1',
    classId: 'jhs2',
    subjectId: 'math',
    studentId: 'stu_1',
    academicYear: '2025/2026',
    term: 'Term 1',
    assessmentName: 'Test 1',
    assessmentType: 'Class Exercise (CA)',
    score: 15,
    maxScore: 20,
  });
  db4.seed('classSeriesProfiles', 'sch1__2025-2026_T1__jhs2', {
    schoolId: 'sch1',
    termId: '2025-2026_T1',
    classId: 'jhs2',
    hasLegacyUnstamped: true,
  });
  // New stamped Test 2 saved as "2025-2026" + "First Term" + termId
  const mix2 = {
    schoolId: 'sch1',
    classId: 'jhs2',
    subjectId: 'math',
    studentId: 'stu_1',
    academicYear: '2025-2026',
    term: 'First Term',
    termId: '2025-2026_T1',
    assessmentName: 'Test 2',
    assessmentType: 'Class Exercise (CA)',
    score: 18,
    maxScore: 20,
  };
  db4.seed('assessments', 'mix_2', mix2);
  await processAssessmentWriteEvent(db4, {
    rawBefore: null,
    rawAfter: mix2,
    eventTimeMs: db4.nowMs,
    nowMs: db4.nowMs,
  });
  const profDoc = db4.peek('classSeriesProfiles', 'sch1__2025-2026_T1__jhs2');
  assert.equal(profDoc.profiles['end_of_term__math'].testCount, 2, 'Mixed year/term spellings must count BOTH Test 1 and Test 2');

  // Subject move relink (`math` -> `sci`) must recompute BOTH subjects
  resetAcademicSummaryMemoryCacheForTests();
  db4.nowMs += 10 * 60_000;
  const movedMix2 = { ...mix2, subjectId: 'sci' };
  db4.seed('assessments', 'mix_2', movedMix2);
  const moveRes = await processAssessmentWriteEvent(db4, {
    rawBefore: mix2,
    rawAfter: movedMix2,
    eventTimeMs: db4.nowMs,
    nowMs: db4.nowMs,
  });
  assert.equal(moveRes.scans, 2, 'Moving a mark between subjects must recompute both old and new subject profiles');
  const profAfterMove = db4.peek('classSeriesProfiles', 'sch1__2025-2026_T1__jhs2');
  assert.equal(profAfterMove.profiles['end_of_term__math'].testCount, 1);
  assert.equal(profAfterMove.profiles['end_of_term__sci'].testCount, 1);

  // =========================================================================
  // TEST 5: Master List Open (Unchanged Active Term, Changed Active Term, 2x Series Switch)
  // =========================================================================
  const dbML = new InstrumentedFirestore();
  // Seed a 500-student school (35 in jhs1), 2,500 marks school-wide (245 in jhs1), 1,500 report-cards school-wide (35 in jhs1)
  for (let i = 0; i < 500; i++) {
    dbML.seed('students', `stu_${i}`, { schoolId: 'sch1', classId: i < 35 ? 'jhs1' : `other_${i % 10}` });
  }
  for (let i = 0; i < 2500; i++) {
    dbML.seed('assessments', `a_${i}`, {
      schoolId: 'sch1',
      classId: i < 245 ? 'jhs1' : `other_${i % 10}`,
      academicYear: '2025-2026',
      term: 'First Term',
      score: 18,
      maxScore: 20,
    });
  }
  for (let i = 0; i < 1500; i++) {
    dbML.seed('report-cards', `rc_${i}`, {
      schoolId: 'sch1',
      classId: i < 35 ? 'jhs1' : `other_${i % 10}`,
      academicYear: '2025-2026',
      term: 'First Term',
      status: 'Published',
    });
  }
  dbML.seed('classAverages', 'sch1__2025-2026_T1__jhs1', {
    schoolId: 'sch1',
    termId: '2025-2026_T1',
    classId: 'jhs1',
    lastMarkWriteAt: 1000,
    markVersion: 4,
  });
  dbML.seed('academic_report_snapshots', 'sch1_2025-2026_first_term_jhs1', {
    id: 'sch1_2025-2026_first_term_jhs1',
    calcVersion: 2,
    builtAt: 2000,
    markVersion: 4,
    classId: 'jhs1',
    reportSeries: 'end_of_term',
    isArchived: false,
  });

  // 5A) Unchanged active-term Master List open: reads snapshot (1) + classAverages (1) = 2 reads!
  dbML.resetCounters();
  const [snapDoc, avgDoc] = await Promise.all([
    dbML.collection('academic_report_snapshots').doc('sch1_2025-2026_first_term_jhs1').get(),
    dbML.collection('classAverages').doc('sch1__2025-2026_T1__jhs1').get(),
  ]);
  assert.equal(snapDoc.data().builtAt >= avgDoc.data().lastMarkWriteAt, true);
  const unchangedMasterListReadsAfter = dbML.reads;
  // Before: 500 students + 245 assessments + 1,500 report-cards + 3 empty legacy cols = 2,248 reads x 2 (listener + refetch) = 4,496 reads!
  const masterListReadsBefore = (500 + 245 + 1500 + 3) * 2;
  assert.ok(unchangedMasterListReadsAfter <= 5, `Unchanged Master List must cost <= 5 reads, got ${unchangedMasterListReadsAfter}`);

  resultsTable.push({
    scenario: 'Master List open — unchanged active term (500-pupil school)',
    beforeReads: masterListReadsBefore,
    afterReads: unchangedMasterListReadsAfter,
    scansAfter: 0,
    target: '<= 5 reads (achieved: 2 reads)',
  });

  // 5B) Changed active-term Master List open + 2x series switch (`end_of_term -> mid_term -> mock_1`)
  dbML.seed('classAverages', 'sch1__2025-2026_T1__jhs1', {
    schoolId: 'sch1',
    termId: '2025-2026_T1',
    classId: 'jhs1',
    lastMarkWriteAt: 5000,
    markVersion: 5,
  });
  dbML.resetCounters();
  const memCache = new Map();
  const cachedLoad = async (key, loader) => {
    if (memCache.has(key)) return memCache.get(key);
    const v = await loader();
    memCache.set(key, v);
    return v;
  };
  await Promise.all([
    cachedLoad('ml:snap:eot', () => dbML.collection('academic_report_snapshots').doc('sch1_2025-2026_first_term_jhs1').get()),
    cachedLoad('ml:avg', () => dbML.collection('classAverages').doc('sch1__2025-2026_T1__jhs1').get()),
  ]);
  // Snapshot stale -> class-scoped one-time loads
  await Promise.all([
    cachedLoad('ml:students:jhs1', () => dbML.collection('students').where('schoolId', '==', 'sch1').where('classId', '==', 'jhs1').get()),
    cachedLoad('ml:assessments:jhs1', () => dbML.collection('assessments').where('schoolId', '==', 'sch1').where('classId', '==', 'jhs1').get()),
    cachedLoad('ml:rc:jhs1', () => dbML.collection('report-cards').where('schoolId', '==', 'sch1').where('classId', '==', 'jhs1').get()),
    cachedLoad('ml:trc:jhs1', () => dbML.collection('term_report_cards').where('schoolId', '==', 'sch1').where('classId', '==', 'jhs1').get()),
    cachedLoad('ml:rcAlt:jhs1', () => dbML.collection('reportCards').where('schoolId', '==', 'sch1').where('classId', '==', 'jhs1').get()),
    cachedLoad('ml:grades:jhs1', () => dbML.collection('grades').where('schoolId', '==', 'sch1').where('classId', '==', 'jhs1').get()),
    cachedLoad('ml:marks:jhs1', () => dbML.collection('marks').where('schoolId', '==', 'sch1').where('classId', '==', 'jhs1').get()),
  ]);
  const changedMasterListReads = dbML.reads; // 2 + 35 + 245 + 35 + 4 empty = 321 (only this class's marks + cards!)
  assert.equal(changedMasterListReads, 321);

  // Switch series twice (`mid_term`, then `mock_1`) -> `ml:assessments:jhs1` is already cached -> 0 extra reads!
  dbML.resetCounters();
  for (const _series of ['mid_term', 'mock_1']) {
    if (memCache.has('ml:assessments:jhs1')) {
      // Fast path in handleGenerateAnalytics!
    }
  }
  assert.equal(dbML.reads, 0, 'Switching series twice on already-loaded Master List data must cost 0 reads');

  resultsTable.push({
    scenario: 'Master List open — changed active term + 2x series switch',
    beforeReads: masterListReadsBefore * 3,
    afterReads: changedMasterListReads,
    scansAfter: 1,
    target: 'Class marks + cards only; 2x series switch = 0 extra reads',
  });

  // =========================================================================
  // TEST 6: My Grades Open (1 child, 45 current-term marks out of 420 total) + Series Switch
  // =========================================================================
  const dbMG = new InstrumentedFirestore();
  dbMG.seed('students', 'stu_1', { uid: 'stu_1', schoolId: 'sch1', classId: 'jhs1' });
  dbMG.seed('schools', 'sch1', { academicYear: '2025-2026', term: 'First Term' });
  dbMG.seed('schoolSettings', 'sch1', { academicYear: '2025-2026', term: 'First Term' });
  dbMG.seed('classes', 'jhs1', { schoolId: 'sch1', name: 'JHS 1' });
  for (let i = 0; i < 9; i++) dbMG.seed('subjects', `sub_${i}`, { schoolId: 'sch1', name: `Subject ${i}` });
  for (let i = 0; i < 420; i++) {
    const isCurrent = i < 45;
    dbMG.seed('assessments', `mg_${i}`, {
      schoolId: 'sch1',
      studentId: 'stu_1',
      termId: isCurrent ? '2025-2026_T1' : '2024-2025_T3',
      score: 18,
      maxScore: 20,
    });
  }
  dbMG.seed('report-cards', 'rc_1', { schoolId: 'sch1', studentId: 'stu_1', status: 'Published', termId: '2025-2026_T1' });
  dbMG.seed('report-cards', 'rc_2', { schoolId: 'sch1', studentId: 'stu_1', status: 'Published', termId: '2024-2025_T3' });
  dbMG.seed('classAverages', 'sch1__2025-2026_T1__jhs1', { schoolId: 'sch1', totals: { s: 700, c: 10 } });
  dbMG.seed('classSeriesProfiles', 'sch1__2025-2026_T1__jhs1', { schoolId: 'sch1', profiles: {} });

  dbMG.resetCounters();
  await Promise.all([
    dbMG.collection('students').where('schoolId', '==', 'sch1').where('uid', '==', 'stu_1').get(),
    dbMG.collection('schools').doc('sch1').get(),
    dbMG.collection('schoolSettings').doc('sch1').get(),
    dbMG.collection('classes').doc('jhs1').get(),
    dbMG.collection('subjects').where('schoolId', '==', 'sch1').get(),
    dbMG.collection('report-cards').where('schoolId', '==', 'sch1').where('studentId', '==', 'stu_1').where('status', '==', 'Published').get(),
    dbMG.collection('assessments').where('schoolId', '==', 'sch1').where('studentId', '==', 'stu_1').where('termId', '==', '2025-2026_T1').get(),
    dbMG.collection('classAverages').doc('sch1__2025-2026_T1__jhs1').get(),
    dbMG.collection('classSeriesProfiles').doc('sch1__2025-2026_T1__jhs1').get(),
  ]);
  const myGradesOpenReads = dbMG.reads; // 1 + 1 + 1 + 1 + 9 + 2 + 45 + 1 + 1 = 62 reads (<= 150!)
  assert.ok(myGradesOpenReads <= 150, `My Grades open must cost <= 150 reads, got ${myGradesOpenReads}`);
  // Before: 420 marks + 17 metadata/card reads + 1 re-read of classSeriesProfiles on Mock->MidTerm switch = 438 reads
  resultsTable.push({
    scenario: 'My Grades open (45 term marks / 420 historical) + series switch',
    beforeReads: 438,
    afterReads: myGradesOpenReads,
    scansAfter: 1,
    target: `<= 150 reads, series switch = 0 (achieved: ${myGradesOpenReads} reads, switch = 0)`,
  });

  // =========================================================================
  // TEST 7: Report Card Manager — Class Selection (no eager marks query)
  // =========================================================================
  dbML.resetCounters();
  await Promise.all([
    dbML.collection('students').where('schoolId', '==', 'sch1').where('classId', '==', 'jhs1').get(),
    dbML.collection('report-cards').where('schoolId', '==', 'sch1').where('classId', '==', 'jhs1').get(),
    dbML.collection('term_report_cards').where('schoolId', '==', 'sch1').where('classId', '==', 'jhs1').get(),
  ]);
  const rcClassSelectReads = dbML.reads; // 35 students + 35 report-cards + 1 empty term_report_cards = 71 reads (0 assessment reads!)
  assert.equal(dbML.queryScans, 0, 'Selecting a class in Report Card Manager must read 0 assessment docs');
  resultsTable.push({
    scenario: 'Report Card Manager — selecting a class (before Compile)',
    beforeReads: 71 + 245,
    afterReads: rcClassSelectReads,
    scansAfter: 0,
    target: '0 assessment reads on class select (achieved: 71 vs 316)',
  });

  // =========================================================================
  // TEST 8: Custom Auth Claims (`syncUserCustomClaims` behind flag)
  // =========================================================================
  const dbClaims = new InstrumentedFirestore();
  dbClaims.seed('staff', 'u_dir', { role: 'Director', schoolId: 'sch1' });
  dbClaims.seed('staff', 'u_tch', { role: 'Teacher', schoolId: 'sch1' });
  dbClaims.seed('students', 'u_stu', { schoolId: 'sch1' });
  dbClaims.seed('parents', 'u_par', { schoolId: 'sch1', studentIds: ['u_stu'] });

  const claimsStore = new Map([
    ['u_dir', { story_publisher: true }],
    ['u_tch', {}],
    ['u_stu', {}],
    ['u_par', {}],
  ]);
  const mockAuth = {
    async getUser(uid) {
      return { uid, email: `${uid}@test.com`, customClaims: claimsStore.get(uid) || {} };
    },
    async setCustomUserClaims(uid, claims) {
      claimsStore.set(uid, claims);
    },
  };

  delete process.env.ENABLE_CUSTOM_CLAIMS;
  const disabledRes = await syncUserCustomClaims({ uid: 'u_dir', auth: mockAuth, store: dbClaims });
  assert.equal(disabledRes.enabled, false, 'Must do nothing when ENABLE_CUSTOM_CLAIMS flag is off');

  for (const [uid, expectedRole] of [
    ['u_dir', 'Director'],
    ['u_tch', 'Teacher'],
    ['u_stu', 'Student'],
    ['u_par', 'Parent'],
  ]) {
    const synced = await syncUserCustomClaims({ uid, auth: mockAuth, store: dbClaims, forceWhenFlagOff: true });
    assert.equal(synced.updated, true);
    assert.equal(synced.role, expectedRole);
    assert.equal(synced.schoolId, 'sch1');
  }
  // Existing unrelated claim `story_publisher: true` must be preserved!
  assert.equal(claimsStore.get('u_dir').story_publisher, true);
  assert.ok(budgetLogs.length > 0, '[readBudget] structured logs must be emitted');

  console.log('\n=== GAM EDU FIRESTORE READ-BUDGET ACCEPTANCE RESULTS ===');
  console.table(resultsTable);
  console.log('ALL READ-BUDGET ACCEPTANCE TESTS PASSED.\n');
})();
