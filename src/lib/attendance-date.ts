/**
 * Canonical school-calendar date helpers.
 *
 * Why this exists:
 *   `startOfDay(selectedDate)` from `date-fns` uses the *device's local timezone*. When a teacher marks
 *   attendance on a phone set to `UTC-8`, "Nov 19, 2026" becomes `2026-11-19T08:00:00.000Z`, whereas on a
 *   Ghana (`UTC+0`) phone it becomes `2026-11-19T00:00:00.000Z` (and on a `UTC+1` phone it becomes
 *   `2026-11-18T23:00:00.000Z`!). Any exact-match query `where('date', '==', startOfDay(date))` then drops
 *   entire classrooms whose teacher's phone has a non-UTC timezone.
 *
 *   Anchoring calendar selections to UTC midnight (`YYYY-MM-DDT00:00:00.000Z` — Ghana time) on write and
 *   querying `[schoolDayStartUtc(date) .. schoolDayEndUtc(date)]` on read guarantees consistent headcounts
 *   across Attendance Insights, Bulk Daily Receipts, Manual Billing Reconciliation, and Dashboards.
 */

export function schoolDayDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Canonical UTC midnight (`YYYY-MM-DDT00:00:00.000Z`) for the local calendar date picked by the user. */
export function schoolDayStartUtc(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
}

/** Canonical UTC end-of-day (`YYYY-MM-DDT23:59:59.999Z`) for the local calendar date picked by the user. */
export function schoolDayEndUtc(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999));
}

/**
 * Wide query window (`-12h` to `+35h59m59s` around UTC midnight) paired with calendar-day filtering when
 * historical records may have been saved using `startOfDay(localDate)` in any timezone (`UTC-12` .. `UTC+14`).
 */
export function schoolDayQueryBoundsUtc(date: Date): {
  queryStart: Date;
  queryEnd: Date;
  targetDateStr: string;
} {
  const targetDateStr = schoolDayDateStr(date);
  const startUtcMs = schoolDayStartUtc(date).getTime();
  return {
    queryStart: new Date(startUtcMs - 12 * 3600_000),
    queryEnd: new Date(startUtcMs + 36 * 3600_000 - 1),
    targetDateStr,
  };
}

/** Parses `'YYYY-MM-DD'` into canonical UTC midnight without local-timezone day shifting. */
export function schoolDayFromDateStr(dateStr: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!m) {
    const parsed = new Date(dateStr);
    return schoolDayStartUtc(parsed);
  }
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 0, 0, 0, 0));
}

export interface NormalizedAttendanceStudentRow {
  studentId: string;
  studentName?: string;
  classId: string;
  status: string;
  canteenMode?: string;
  transportMode?: string;
  usesCanteen?: string | boolean;
  usesBusService?: string | boolean;
}

function resolveDocCalendarDateStr(raw: Record<string, any>, docId?: string): string | null {
  if (typeof raw.dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.dateStr)) {
    return raw.dateStr;
  }
  if (docId) {
    const tail = /(\d{4}-\d{2}-\d{2})$/.exec(docId);
    if (tail) return tail[1];
  }
  const d = raw.date;
  let jsDate: Date | null = null;
  if (d?.toDate && typeof d.toDate === 'function') jsDate = d.toDate();
  else if (d instanceof Date) jsDate = d;
  else if (typeof d?.seconds === 'number') jsDate = new Date(d.seconds * 1000);
  else if (typeof d?._seconds === 'number') jsDate = new Date(d._seconds * 1000);
  else if (typeof d === 'string' || typeof d === 'number') jsDate = new Date(d);
  if (!jsDate || Number.isNaN(jsDate.getTime())) return null;
  return jsDate.toISOString().slice(0, 10);
}

/**
 * Deduplicates a day's attendance documents (supporting both individual `att-*` docs and aggregated
 * `studentsMap` / `records` class-sheet docs, regardless of device timezone offset when saved) into one
 * canonical status row per `studentId` for `targetDateStr`.
 */
export function deduplicateAttendanceForDate(
  rawDocs: ReadonlyArray<{ id?: string; data: Record<string, any> }>,
  targetDateStr: string,
  selectedClassId = 'all',
): NormalizedAttendanceStudentRow[] {
  // Store sheet entries first, then let explicit individual `att-*` docs override so single-student edits win
  const byStudent = new Map<string, NormalizedAttendanceStudentRow>();

  for (const item of rawDocs) {
    const data = item.data;
    if (!data || data.isArchived === true) continue;
    const docDateStr = resolveDocCalendarDateStr(data, item.id);
    if (docDateStr !== targetDateStr) continue;

    const sheetMap = data.studentsMap || data.records;
    if (sheetMap && typeof sheetMap === 'object' && !Array.isArray(sheetMap)) {
      const classId = String(data.classId || '');
      if (selectedClassId !== 'all' && classId !== selectedClassId) continue;
      for (const [stKey, stVal] of Object.entries(sheetMap as Record<string, any>)) {
        if (!stVal) continue;
        const studentId = String((typeof stVal === 'object' ? stVal.studentId : '') || stKey || '');
        if (!studentId) continue;
        const status = typeof stVal === 'string' ? stVal : String(stVal.status || 'Present');
        if (!byStudent.has(studentId)) {
          byStudent.set(studentId, {
            studentId,
            studentName: typeof stVal === 'object' ? stVal.studentName : undefined,
            classId,
            status,
            usesCanteen: typeof stVal === 'object' ? stVal.usesCanteen : undefined,
            usesBusService: typeof stVal === 'object' ? stVal.usesBusService : undefined,
          });
        }
      }
    }
  }

  for (const item of rawDocs) {
    const data = item.data;
    if (!data || data.isArchived === true) continue;
    if (data.studentsMap || (data.records && typeof data.records === 'object' && !Array.isArray(data.records))) {
      continue;
    }
    const docDateStr = resolveDocCalendarDateStr(data, item.id);
    if (docDateStr !== targetDateStr) continue;
    const classId = String(data.classId || '');
    if (selectedClassId !== 'all' && classId !== selectedClassId) continue;
    const studentId = String(data.studentId || '');
    if (!studentId) continue;
    byStudent.set(studentId, {
      studentId,
      studentName: data.studentName,
      classId,
      status: String(data.status || 'Present'),
      canteenMode: data.canteenMode,
      transportMode: data.transportMode,
      usesCanteen: data.usesCanteen,
      usesBusService: data.usesBusService,
    });
  }

  return [...byStudent.values()];
}

