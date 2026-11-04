import { buildRows, computeStudentFlags, dailyRates, dateStrOf, windowStartStr } from '../attendance-flags';

/** Run with: npx tsx --tsconfig tsconfig.json src/lib/__tests__/test-attendance-flags.ts */
let failures = 0;
const check = (label: string, ok: boolean, detail = '') => { if (ok) console.log(`  ok   ${label}`); else { failures++; console.error(`  FAIL ${label} ${detail}`); } };

const students = [
  { uid: 'kofi', firstName: 'Kofi', lastName: 'Mensah', classId: 'c1', enrollmentStatus: 'Active' },
  { uid: 'ama', firstName: 'Ama', lastName: 'Owusu', classId: 'c1', enrollmentStatus: 'Active' },
  { uid: 'esi', firstName: 'Esi', lastName: 'Boateng', classId: 'c2' },
  { uid: 'old', firstName: 'Old', lastName: 'Pupil', classId: 'c1', enrollmentStatus: 'Withdrawn' },
  { uid: 'new', firstName: 'New', lastName: 'Joiner', classId: 'c2', enrollmentStatus: 'Active' },
];
const classes = [{ id: 'c1', name: 'Basic 5A' }, { id: 'c2', name: 'Basic 6B' }];

// 10 school days of class registers (the shape the teacher's attendance sheet saves).
const dates = ['2026-10-19','2026-10-20','2026-10-21','2026-10-22','2026-10-23','2026-10-26','2026-10-27','2026-10-28','2026-10-29','2026-10-30'];
const kofi = ['Present','Absent','Present','Absent','Present','Absent','Present','Present','Absent','Absent'];   // 5/10 absent = 50%, last 2 absent
const ama  = ['Present','Late','Late','Present','Late','Present','Late','Present','Late','Present'];            // 5 late, never absent
const esi  = ['Present','Present','Present','Present','Present','Present','Present','Present','Present','Present']; // perfect
const old  = ['Absent','Absent','Absent','Absent','Absent','Absent','Absent','Absent','Absent','Absent'];         // withdrawn: must not flag
const joiner = ['Absent','Absent','Absent'].concat(Array(7).fill('Excused'));                                    // 3 real days only: all absent
const docs = dates.map((dateStr, i) => ({
  id: `sch_c1_${dateStr}`, schoolId: 'sch', classId: 'c1', className: 'Basic 5A', dateStr,
  date: { toDate: () => new Date(`${dateStr}T00:00:00`) },
  studentsMap: {
    kofi: { studentId: 'kofi', studentName: 'Kofi Mensah', status: kofi[i] },
    ama: { studentId: 'ama', studentName: 'Ama Owusu', status: ama[i] },
    esi: { studentId: 'esi', studentName: 'Esi Boateng', status: esi[i] },
    old: { studentId: 'old', studentName: 'Old Pupil', status: old[i] },
    new: { studentId: 'new', studentName: 'New Joiner', status: joiner[i] },
  },
}));

console.log('=== rows ===');
const rows = buildRows(docs);
check('one row per student per day (5 × 10)', rows.length === 50, String(rows.length));
check('dateStr is read from the register', dateStrOf(docs[0]) === '2026-10-19');
check('dateStr falls back to the date field', dateStrOf({ date: { toDate: () => new Date('2026-10-05T09:00:00') } }) === '2026-10-05');

console.log('=== flags ===');
const f = computeStudentFlags(rows, { students, classes });
const kf = f.absence.find(a => a.id === 'kofi');
check('Kofi (50% attendance) is flagged for chronic absence', !!kf && kf.rate === 50 && kf.absences === 5 && kf.total === 10, JSON.stringify(kf));
check('Kofi is critical (<70%) and shows the 2-day current streak', kf?.severity === 'critical' && kf?.streak === 2, JSON.stringify(kf));
check('Kofi class name comes from the class list', kf?.className === 'Basic 5A');
check('Kofi lastAbsent is the latest absent date', kf?.lastAbsent === '2026-10-30');
check('Ama (never absent, 5 late) is NOT an absence flag', !f.absence.some(a => a.id === 'ama'));
const al = f.late.find(l => l.id === 'ama');
check('Ama is flagged for punctuality: 5 late, 50% of days attended', !!al && al.lateCount === 5 && al.lateRate === 50, JSON.stringify(al));
check('Ama severity is high (>=40% of days late)', al?.severity === 'high');
check('Ama lastLate is her latest late day', al?.lastLate === '2026-10-29');
check('Esi (perfect) is flagged for nothing', !f.absence.some(a => a.id === 'esi') && !f.late.some(l => l.id === 'esi'));
check('withdrawn student is never flagged', !f.absence.some(a => a.id === 'old'));
check('Excused days are ignored: joiner has 3 real days, all absent → flagged', f.absence.some(a => a.id === 'new' && a.total === 3 && a.rate === 0));
check('students not in the school list (e.g. other school) are ignored', computeStudentFlags(buildRows([{ ...docs[0], studentsMap: { zzz: { studentId: 'zzz', status: 'Absent' } } }]), { students, classes }).absence.length === 0);
check('days covered = 10 school days', f.daysCovered === 10);

console.log('=== thresholds ===');
const few = buildRows(docs.slice(0, 2));
check('fewer than 3 recorded days → not rated (no false alarm after 2 days)', computeStudentFlags(few, { students, classes }).absence.length === 0);
const streakOnly = buildRows(dates.map((dateStr, i) => ({ classId: 'c1', dateStr, studentsMap: { ama: { studentId: 'ama', status: i >= 7 ? 'Absent' : 'Present' } } })));
const so = computeStudentFlags(streakOnly, { students, classes }).absence[0];
check('3 absent days in a row flags a student even when the overall rate is 70%', !!so && so.reasons.includes('streak') && so.streak === 3 && so.rate === 70, JSON.stringify(so));
const twoLate = buildRows(dates.slice(0, 5).map((dateStr, i) => ({ classId: 'c1', dateStr, studentsMap: { ama: { studentId: 'ama', status: i < 2 ? 'Late' : 'Present' } } })));
check('2 late arrivals is below the punctuality threshold', computeStudentFlags(twoLate, { students, classes }).late.length === 0);

console.log('=== today\'s per-student records layer on top of the register ===');
const today = '2026-10-30';
const withToday = buildRows([...docs, { studentId: 'kofi', status: 'Present', date: { toDate: () => new Date(`${today}T00:00:00`) }, classId: 'c1' }]);
const kRow = withToday.filter(r => r.studentId === 'kofi' && r.dateStr === today);
check('a per-student record replaces the register entry for the same day (no double count)', kRow.length === 1 && kRow[0].status === 'Present');
check('per-student record order does not matter', buildRows([{ studentId: 'kofi', status: 'Present', dateStr: today }, ...docs]).filter(r => r.studentId === 'kofi' && r.dateStr === today)[0].status === 'Present');

console.log('=== misc ===');
check('window starts 30 days back', windowStartStr(new Date('2026-11-04T12:00:00'), 30) === '2026-10-05', windowStartStr(new Date('2026-11-04T12:00:00'), 30));
check('daily rates: last-N days, oldest first', (() => { const r = dailyRates(rows, 3); return r.length === 3 && r[2].dateStr === '2026-10-30' && r[0].dateStr === '2026-10-28'; })());
check('bad / empty input never throws', computeStudentFlags(buildRows([null as any, {}, { studentsMap: null }]), {}).absence.length === 0);

if (failures) { console.error(`\n${failures} FAILED`); process.exit(1); }
console.log('\nAll checks passed.');
