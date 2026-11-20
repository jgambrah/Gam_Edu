/**
 * Canonical school-calendar date helpers (anchored to Ghana `Africa/Accra` / `UTC+0`).
 *
 * Why this exists:
 *   `startOfDay(selectedDate)` from `date-fns` uses the *device's local timezone*. When a teacher marks
 *   attendance on a phone set to `UTC-8`, "Nov 19, 2026" becomes `2026-11-19T08:00:00.000Z`, whereas on a
 *   Ghana (`UTC+0`) phone it becomes `2026-11-19T00:00:00.000Z` and on a `UTC+1` phone it becomes
 *   `2026-11-18T23:00:00.000Z`. Any exact-match query `where('date', '==', startOfDay(date))` then drops
 *   entire classrooms whose teacher's phone has a non-UTC timezone.
 *
 *   Anchoring calendar selections to UTC midnight (`YYYY-MM-DDT00:00:00.000Z` — Ghana time) on write and
 *   querying `[D - 14h .. D + 12h]` on read guarantees consistent headcounts across all timezones
 *   (`UTC-12` .. `UTC+14`) without pulling in `D+1`'s canonical `00:00Z` documents.
 */

/** Today's calendar date string (`YYYY-MM-DD`) in Ghana Time (`UTC+0`), independent of the device clock's timezone. */
export function schoolTodayDateStr(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/**
 * A local `Date` object whose `.getFullYear() / .getMonth() / .getDate()` match *today in Ghana (`UTC+0`)*.
 * Prevents a `UTC-8` phone opened at `07:30 AM` Ghana time from defaulting date pickers to yesterday.
 */
export function schoolTodayLocalDate(now: Date = new Date()): Date {
  return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0);
}

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

/**
 * Server-safe calendar date string (`YYYY-MM-DD`) in Ghana Time (`UTC+0`) derived strictly from UTC getters,
 * independent of the host machine's local timezone.
 */
export function schoolDayDateStrUtc(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Server-safe canonical UTC midnight (`YYYY-MM-DDT00:00:00.000Z`) derived strictly from UTC getters,
 * independent of the host machine's local timezone.
 */
export function schoolDayStartUtcFromInstant(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
}

/** Canonical UTC end-of-day (`YYYY-MM-DDT23:59:59.999Z`) for the local calendar date picked by the user. */
export function schoolDayEndUtc(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999));
}

/**
 * Exact timezone-spanning query window for legacy local-midnight docs across all IANA offsets (`UTC+14` -> `D-14h`
 * through `UTC-12` -> `D+12h`), while strictly excluding `D+1`'s canonical `00:00:00Z` documents so past-date
 * queries do not double-read the next day.
 */
export function schoolDayQueryBoundsUtc(date: Date): {
  queryStart: Date;
  queryEnd: Date;
  targetDateStr: string;
} {
  const targetDateStr = schoolDayDateStr(date);
  const startUtcMs = schoolDayStartUtc(date).getTime();
  return {
    queryStart: new Date(startUtcMs - 14 * 3600_000),
    queryEnd: new Date(startUtcMs + 12 * 3600_000),
    targetDateStr,
  };
}

/** Parses `'YYYY-MM-DD'` strictly into canonical UTC midnight, returning `null` for malformed input. */
export function schoolDayFromDateStr(dateStr: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateStr || '').trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const dt = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  if (dt.getUTCFullYear() !== year || dt.getUTCMonth() !== month - 1 || dt.getUTCDate() !== day) {
    return null;
  }
  return dt;
}

export interface NormalizedAttendanceStudentRow {
  studentId: string;
  studentName?: string;
  classId: string;
  status: string;
  updatedAtMs?: number;
  canteenMode?: string;
  transportMode?: string;
  usesCanteen?: string | boolean;
  usesBusService?: string | boolean;
}

function toEpochMs(val: any): number {
  if (!val) return 0;
  if (typeof val === 'number') return Number.isFinite(val) ? val : 0;
  if (val instanceof Date) return Number.isNaN(val.getTime()) ? 0 : val.getTime();
  if (typeof val?.toMillis === 'function') return val.toMillis();
  if (typeof val?.toDate === 'function') {
    const d = val.toDate();
    return d && !Number.isNaN(d.getTime()) ? d.getTime() : 0;
  }
  if (typeof val?.seconds === 'number') return val.seconds * 1000;
  if (typeof val?._seconds === 'number') return val._seconds * 1000;
  const parsed = Date.parse(String(val));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function resolveDocCalendarDateStr(raw: Record<string, any>, docId?: string): string | null {
  if (typeof raw.dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.dateStr)) {
    return raw.dateStr;
  }
  if (docId) {
    const tail = /(\d{4}-\d{2}-\d{2})$/.exec(docId);
    if (tail) return tail[1];
  }
  const ms = toEpochMs(raw.date);
  if (!ms) return null;
  return new Date(ms).toISOString().slice(0, 10);
}

/**
 * Deduplicates a day's attendance documents (supporting both individual `att-*` docs and aggregated
 * `studentsMap` / `records` class-sheet docs, regardless of device timezone offset when saved) into one
 * canonical status row per `studentId` for `targetDateStr`.
 *
 * Conflict resolution: newest `updatedAt` wins; on ties, an explicit individual `att-*` record overrides a
 * sheet entry (e.g. a single-student toggle).
 */
export function deduplicateAttendanceForDate(
  rawDocs: ReadonlyArray<{ id?: string; data: Record<string, any> }>,
  targetDateStr: string,
  selectedClassId = 'all',
): NormalizedAttendanceStudentRow[] {
  const byStudent = new Map<string, { row: NormalizedAttendanceStudentRow; isIndiv: boolean; updatedAtMs: number }>();

  const consider = (row: NormalizedAttendanceStudentRow, isIndiv: boolean, updatedAtMs: number) => {
    const prev = byStudent.get(row.studentId);
    if (!prev) {
      byStudent.set(row.studentId, { row, isIndiv, updatedAtMs });
      return;
    }
    if (updatedAtMs > prev.updatedAtMs) {
      byStudent.set(row.studentId, { row, isIndiv, updatedAtMs });
      return;
    }
    if (updatedAtMs === prev.updatedAtMs && isIndiv && !prev.isIndiv) {
      byStudent.set(row.studentId, { row, isIndiv, updatedAtMs });
    }
  };

  for (const item of rawDocs) {
    const data = item.data;
    if (!data || data.isArchived === true) continue;
    const docDateStr = resolveDocCalendarDateStr(data, item.id);
    if (docDateStr !== targetDateStr) continue;

    const sheetUpdatedAtMs = toEpochMs(data.updatedAt) || toEpochMs(data.createdAt);
    const sheetMap = data.studentsMap || data.records;
    if (sheetMap && typeof sheetMap === 'object' && !Array.isArray(sheetMap)) {
      const classId = String(data.classId || '');
      if (selectedClassId !== 'all' && classId !== selectedClassId) continue;
      for (const [stKey, stVal] of Object.entries(sheetMap as Record<string, any>)) {
        if (!stVal) continue;
        const studentId = String((typeof stVal === 'object' ? stVal.studentId : '') || stKey || '');
        if (!studentId) continue;
        const status = typeof stVal === 'string' ? stVal : String(stVal.status || 'Present');
        const entryUpdatedAtMs = (typeof stVal === 'object' ? toEpochMs(stVal.updatedAt) : 0) || sheetUpdatedAtMs;
        consider(
          {
            studentId,
            studentName: typeof stVal === 'object' ? stVal.studentName : undefined,
            classId,
            status,
            updatedAtMs: entryUpdatedAtMs,
            usesCanteen: typeof stVal === 'object' ? stVal.usesCanteen : undefined,
            usesBusService: typeof stVal === 'object' ? stVal.usesBusService : undefined,
          },
          false,
          entryUpdatedAtMs,
        );
      }
    } else {
      const classId = String(data.classId || '');
      if (selectedClassId !== 'all' && classId !== selectedClassId) continue;
      const studentId = String(data.studentId || '');
      if (!studentId) continue;
      consider(
        {
          studentId,
          studentName: data.studentName,
          classId,
          status: String(data.status || 'Present'),
          updatedAtMs: sheetUpdatedAtMs,
          canteenMode: data.canteenMode,
          transportMode: data.transportMode,
          usesCanteen: data.usesCanteen,
          usesBusService: data.usesBusService,
        },
        true,
        sheetUpdatedAtMs,
      );
    }
  }

  return [...byStudent.values()].map((v) => v.row);
}
