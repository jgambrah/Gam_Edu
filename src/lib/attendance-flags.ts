/**
 * Student attendance flags for the Director / Administrator dashboard:
 *   - chronic absence  (attendance rate below 85% over the recent window)
 *   - absence streak   (absent 3+ school days in a row, right up to the latest register)
 *   - punctuality      (late 3+ times in the window)
 *
 * Reads the class registers (attendance/{schoolId}_{classId}_{yyyy-MM-dd}, which hold every student's status in
 * `studentsMap`) so a month of history is one document per class per day, not one per student per day. Today's
 * per-student records (e.g. biometric scans before a register is saved) are layered on top.
 */
export const HISTORY_DAYS = 30;
export const CHRONIC_RATE = 85;      // below this % → flagged
export const CRITICAL_RATE = 70;     // below this % → "critical"
export const MIN_SESSIONS = 3;       // a student needs at least this many recorded days to be rated
export const ABSENT_STREAK_MIN = 3;  // consecutive absent days
export const LATE_MIN_COUNT = 3;     // late this many times → punctuality flag
export const LATE_HIGH_COUNT = 6;    // ... or this many → high

export type Status = 'Present' | 'Late' | 'Absent' | 'Excused';
export interface DayRow { studentId: string; dateStr: string; status: Status; classId?: string; className?: string; name?: string }

const normStatus = (s: any): Status | null => {
  const v = String(s ?? '').trim().toLowerCase();
  if (v === 'present') return 'Present';
  if (v === 'late') return 'Late';
  if (v === 'absent') return 'Absent';
  if (v === 'excused') return 'Excused';
  return null;
};

const pad = (n: number) => String(n).padStart(2, '0');
export const toDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** yyyy-MM-dd of a Firestore Timestamp / Date / ISO string; '' when unknown. */
export function dateStrOf(rec: any): string {
  if (typeof rec?.dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rec.dateStr)) return rec.dateStr;
  const v = rec?.date;
  if (!v) return '';
  const d = typeof v.toDate === 'function' ? v.toDate() : (typeof v.seconds === 'number' ? new Date(v.seconds * 1000) : new Date(v));
  return d instanceof Date && !isNaN(d.getTime()) ? toDateStr(d) : '';
}

/** First day of the window (today minus HISTORY_DAYS), as yyyy-MM-dd. */
export function windowStartStr(now: Date = new Date(), days: number = HISTORY_DAYS): string {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  d.setDate(d.getDate() - days);
  return toDateStr(d);
}

/**
 * Turns attendance documents into one row per student per day.
 *  - class registers (have `studentsMap`) → one row per student in the map
 *  - per-student records (have `studentId` + `status`) → one row
 * A per-student record wins over a register entry for the same student and day (it is the more recent save).
 */
export function buildRows(docs: any[]): DayRow[] {
  const byKey = new Map<string, DayRow & { fromStudentDoc: boolean }>();
  for (const doc of docs || []) {
    if (!doc) continue;
    const dateStr = dateStrOf(doc);
    if (!dateStr) continue;
    if (doc.studentsMap && typeof doc.studentsMap === 'object') {
      for (const [sid, entry] of Object.entries<any>(doc.studentsMap)) {
        const status = normStatus(entry?.status);
        const studentId = String(entry?.studentId || sid);
        if (!status || !studentId) continue;
        const key = `${studentId}|${dateStr}`;
        const prev = byKey.get(key);
        if (prev?.fromStudentDoc) continue;
        byKey.set(key, { studentId, dateStr, status, classId: doc.classId, className: doc.className, name: entry?.studentName, fromStudentDoc: false });
      }
    } else if (doc.studentId) {
      const status = normStatus(doc.status);
      if (!status) continue;
      byKey.set(`${doc.studentId}|${dateStr}`, { studentId: String(doc.studentId), dateStr, status, classId: doc.classId, className: doc.className, name: doc.studentName, fromStudentDoc: true });
    }
  }
  return Array.from(byKey.values()).map(({ fromStudentDoc, ...r }) => r);
}

export interface AbsenceFlag { id: string; name: string; className: string; rate: number; absences: number; total: number; streak: number; severity: 'critical' | 'high'; reasons: ('rate' | 'streak')[]; lastAbsent: string }
export interface LateFlag { id: string; name: string; className: string; lateCount: number; attended: number; lateRate: number; lastLate: string; severity: 'high' | 'watch' }
export interface FlagResult { absence: AbsenceFlag[]; late: LateFlag[]; daysCovered: number; studentsRated: number }

interface Ctx { students?: any[]; classes?: any[] }

/** Computes the flags. Excused days are ignored (a justified absence is not held against the student). */
export function computeStudentFlags(rows: DayRow[], ctx: Ctx = {}): FlagResult {
  const students = ctx.students || [];
  const classes = ctx.classes || [];
  const studentById = new Map<string, any>();
  students.forEach(s => { [s.uid, s.id, s.studentId].filter(Boolean).forEach((k: string) => studentById.set(String(k), s)); });
  const activeOnly = students.length > 0;
  const isActive = (s: any) => !s || s.enrollmentStatus === 'Active' || !s.enrollmentStatus;

  const perStudent = new Map<string, DayRow[]>();
  const days = new Set<string>();
  for (const r of rows || []) {
    if (r.status === 'Excused') continue;
    days.add(r.dateStr);
    if (!perStudent.has(r.studentId)) perStudent.set(r.studentId, []);
    perStudent.get(r.studentId)!.push(r);
  }

  const absence: AbsenceFlag[] = [];
  const late: LateFlag[] = [];
  let studentsRated = 0;

  perStudent.forEach((list, studentId) => {
    const stu = studentById.get(studentId);
    if (activeOnly && !stu) return;               // not one of this school's current students
    if (stu && !isActive(stu)) return;            // withdrawn / graduated
    list.sort((a, b) => (a.dateStr < b.dateStr ? 1 : a.dateStr > b.dateStr ? -1 : 0)); // newest first

    const total = list.length;
    const lateCount = list.filter(r => r.status === 'Late').length;
    const absences = list.filter(r => r.status === 'Absent').length;
    const attended = total - absences;
    const rate = total > 0 ? (attended / total) * 100 : 100;

    let streak = 0;
    for (const r of list) { if (r.status === 'Absent') streak++; else break; }

    const cls = classes.find((c: any) => c.id === (stu?.classId || list[0].classId));
    const name = stu ? `${stu.firstName || ''} ${stu.lastName || ''}`.trim() : (list.find(r => r.name)?.name || 'Student');
    const className = cls?.name || list[0].className || 'Unassigned';

    if (total >= MIN_SESSIONS) {
      studentsRated++;
      const reasons: ('rate' | 'streak')[] = [];
      if (rate < CHRONIC_RATE) reasons.push('rate');
      if (streak >= ABSENT_STREAK_MIN) reasons.push('streak');
      if (reasons.length) {
        absence.push({
          id: studentId, name: name || 'Student', className, rate: Math.round(rate), absences, total, streak, reasons,
          severity: rate < CRITICAL_RATE || streak >= 5 ? 'critical' : 'high',
          lastAbsent: list.find(r => r.status === 'Absent')?.dateStr || '',
        });
      }
    }

    if (lateCount >= LATE_MIN_COUNT) {
      const lateRate = attended > 0 ? Math.round((lateCount / attended) * 100) : 100;
      late.push({
        id: studentId, name: name || 'Student', className, lateCount, attended, lateRate,
        lastLate: list.find(r => r.status === 'Late')?.dateStr || '',
        severity: lateCount >= LATE_HIGH_COUNT || lateRate >= 40 ? 'high' : 'watch',
      });
    }
  });

  // Worst first.
  absence.sort((a, b) => (a.severity === b.severity ? a.rate - b.rate : a.severity === 'critical' ? -1 : 1) || b.streak - a.streak);
  late.sort((a, b) => b.lateCount - a.lateCount || b.lateRate - a.lateRate);
  return { absence, late, daysCovered: days.size, studentsRated };
}

/** School-wide participation per day for the last `n` recorded days (Excused counts as not present, as before). */
export function dailyRates(rows: DayRow[], n = 7): { dateStr: string; rate: number }[] {
  const m = new Map<string, { present: number; total: number }>();
  for (const r of rows || []) {
    const e = m.get(r.dateStr) || { present: 0, total: 0 };
    e.total++; if (r.status === 'Present' || r.status === 'Late') e.present++;
    m.set(r.dateStr, e);
  }
  return Array.from(m.entries()).sort(([a], [b]) => (a < b ? -1 : 1)).slice(-n)
    .map(([dateStr, e]) => ({ dateStr, rate: e.total ? Math.round((e.present / e.total) * 100) : 0 }));
}
