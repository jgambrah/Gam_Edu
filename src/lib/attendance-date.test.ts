// @vitest-environment node
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  deduplicateAttendanceForDate,
  schoolDayDateStr,
  schoolDayDateStrUtc,
  schoolDayEndUtc,
  schoolDayFromDateStr,
  schoolDayQueryBoundsUtc,
  schoolDayStartUtc,
  schoolDayStartUtcFromInstant,
  schoolTodayDateStr,
  schoolTodayLocalDate,
} from './attendance-date';
import { isDailyTransportSubscriber, shouldBillDailyCanteen } from './billing-predicates';

describe('attendance-date timezone normalization & deduplication', () => {
  it('anchors local calendar dates and YYYY-MM-DD strings to UTC midnight and rejects malformed strings', () => {
    const localPick = new Date(2026, 10, 19, 15, 30, 0); // Nov 19, 2026
    expect(schoolDayDateStr(localPick)).toBe('2026-11-19');
    expect(schoolDayStartUtc(localPick).toISOString()).toBe('2026-11-19T00:00:00.000Z');
    expect(schoolDayEndUtc(localPick).toISOString()).toBe('2026-11-19T23:59:59.999Z');
    expect(schoolDayFromDateStr('2026-11-19')?.toISOString()).toBe('2026-11-19T00:00:00.000Z');
    expect(schoolDayFromDateStr('not-a-date')).toBeNull();
    expect(schoolDayFromDateStr('2026-02-30')).toBeNull();
  });

  it('derives school "today" from Ghana UTC+0 even before 08:00 UTC (when UTC-8 devices still show yesterday)', () => {
    const earlyGhanaMorning = new Date('2026-11-20T07:30:00.000Z');
    expect(schoolTodayDateStr(earlyGhanaMorning)).toBe('2026-11-20');
    const localToday = schoolTodayLocalDate(earlyGhanaMorning);
    expect(schoolDayDateStr(localToday)).toBe('2026-11-20');
    expect(schoolDayStartUtc(localToday).toISOString()).toBe('2026-11-20T00:00:00.000Z');
  });

  it('spans UTC+14 (-14h) through UTC-12 (+12h) while strictly excluding D+1 00:00:00Z docs', () => {
    const nov19 = new Date(2026, 10, 19);
    const { queryStart, queryEnd, targetDateStr } = schoolDayQueryBoundsUtc(nov19);
    expect(targetDateStr).toBe('2026-11-19');
    expect(queryStart.toISOString()).toBe('2026-11-18T10:00:00.000Z');
    expect(queryEnd.toISOString()).toBe('2026-11-19T12:00:00.000Z');

    // Legacy UTC+1 (2026-11-18T23:00Z) and UTC-8 (2026-11-19T08:00Z) are INSIDE the window
    expect(Date.parse('2026-11-18T23:00:00.000Z')).toBeGreaterThanOrEqual(queryStart.getTime());
    expect(Date.parse('2026-11-19T08:00:00.000Z')).toBeLessThanOrEqual(queryEnd.getTime());

    // Next day's canonical 2026-11-20T00:00:00Z is STRICTLY OUTSIDE the window (zero D+1 read waste)
    expect(Date.parse('2026-11-20T00:00:00.000Z')).toBeGreaterThan(queryEnd.getTime());
  });

  it('captures UTC+0 (00:00Z), UTC-8 (08:00Z), and legacy UTC+1 (23:00Z prev day) docs and resolves conflicts by latest updatedAt', () => {
    const rawDocs = [
      // Aggregated sheet for Grade 1 Orchid saved from a UTC-8 phone at 08:00Z
      {
        id: 'school_grade-1-orchid_2026-11-19',
        data: {
          classId: 'grade-1-orchid',
          date: { seconds: Math.floor(Date.parse('2026-11-19T08:00:00Z') / 1000) },
          dateStr: '2026-11-19',
          updatedAt: Date.parse('2026-11-19T09:00:00Z'),
          studentsMap: {
            stu1: { studentId: 'stu1', studentName: 'Felicity', status: 'Present' },
            stu2: { studentId: 'stu2', studentName: 'Fauzan', status: 'Present' },
          },
        },
      },
      // Later single-student toggle marking stu1 Absent at 10:00Z -> must win over 09:00Z sheet
      {
        id: 'att-school-grade-1-orchid-stu1-2026-11-19',
        data: {
          studentId: 'stu1',
          studentName: 'Felicity',
          classId: 'grade-1-orchid',
          date: { seconds: Math.floor(Date.parse('2026-11-19T00:00:00Z') / 1000) },
          updatedAt: Date.parse('2026-11-19T10:00:00Z'),
          status: 'Absent',
        },
      },
      // Legacy UTC+1 doc (2026-11-18T23:00:00Z) with deterministic ID ending 2026-11-19
      {
        id: 'att-school-grade-2-lilly-stu3-2026-11-19',
        data: {
          studentId: 'stu3',
          studentName: 'Ama',
          classId: 'grade-2-lilly',
          date: { seconds: Math.floor(Date.parse('2026-11-18T23:00:00Z') / 1000) },
          updatedAt: Date.parse('2026-11-19T08:15:00Z'),
          status: 'Present',
        },
      },
      // Stale older individual doc for stu2 (08:30Z) must NOT override newer 09:00Z sheet
      {
        id: 'att-school-grade-1-orchid-stu2-2026-11-19',
        data: {
          studentId: 'stu2',
          studentName: 'Fauzan',
          classId: 'grade-1-orchid',
          date: { seconds: Math.floor(Date.parse('2026-11-19T08:00:00Z') / 1000) },
          updatedAt: Date.parse('2026-11-19T08:30:00Z'),
          status: 'Absent',
        },
      },
    ];

    const allNov19 = deduplicateAttendanceForDate(rawDocs, '2026-11-19', 'all');
    const byId = Object.fromEntries(allNov19.map((r) => [r.studentId, r.status]));
    expect(byId).toEqual({
      stu1: 'Absent',  // 10:00Z toggle beat 09:00Z sheet
      stu2: 'Present', // 09:00Z sheet beat 08:30Z stale doc
      stu3: 'Present', // UTC+1 23:00Z legacy doc matched via ID suffix
    });
  });

  it('uses consistent daily Canteen and Transport billing predicates across billing and reconciliation', () => {
    expect(shouldBillDailyCanteen({ usesCanteen: true, canteenBillingMode: 'Daily' })).toBe(true);
    expect(shouldBillDailyCanteen({ usesCanteen: undefined, canteenBillingMode: undefined })).toBe(true);
    // Crucial M4 edge case: usesCanteen=false must NOT be billed even if canteenBillingMode defaulted to 'Daily'
    expect(shouldBillDailyCanteen({ usesCanteen: false, canteenBillingMode: 'Daily' })).toBe(false);
    expect(shouldBillDailyCanteen({ usesCanteen: false, canteenBillingMode: 'None' })).toBe(false);
    expect(shouldBillDailyCanteen({ usesCanteen: true, canteenBillingMode: 'Termly' })).toBe(false);

    expect(isDailyTransportSubscriber({ usesBusService: true, transportBillingModel: 'Daily' })).toBe(true);
    expect(isDailyTransportSubscriber({ usesBusService: true, transportBillingModel: 'Termly' })).toBe(false);
    expect(isDailyTransportSubscriber({ usesBusService: false, transportBillingModel: 'Daily' })).toBe(false);
  });

  it('breaks updatedAt ties in favour of individual att-* docs and falls back to createdAt when updatedAt is absent', () => {
    const tieTime = Date.parse('2026-11-19T09:00:00Z');
    const docsSheetFirst = [
      {
        id: 'school_c1_2026-11-19',
        data: {
          classId: 'c1',
          dateStr: '2026-11-19',
          updatedAt: tieTime,
          studentsMap: {
            stu1: { studentId: 'stu1', status: 'Present' },
            stu2: { studentId: 'stu2', status: 'Present' },
          },
        },
      },
      {
        id: 'att-school-c1-stu1-2026-11-19',
        data: {
          studentId: 'stu1',
          classId: 'c1',
          dateStr: '2026-11-19',
          updatedAt: tieTime,
          status: 'Absent',
        },
      },
      // Legacy doc with only createdAt (no updatedAt), newer than 09:00Z sheet -> must win
      {
        id: 'att-school-c1-stu2-2026-11-19',
        data: {
          studentId: 'stu2',
          classId: 'c1',
          dateStr: '2026-11-19',
          createdAt: Date.parse('2026-11-19T10:30:00Z'),
          status: 'Late',
        },
      },
    ];
    const res1 = Object.fromEntries(deduplicateAttendanceForDate(docsSheetFirst, '2026-11-19').map((r) => [r.studentId, r.status]));
    expect(res1).toEqual({ stu1: 'Absent', stu2: 'Late' });

    // Same tie with individual doc listed first -> individual doc still wins
    const res2 = Object.fromEntries(deduplicateAttendanceForDate([...docsSheetFirst].reverse(), '2026-11-19').map((r) => [r.studentId, r.status]));
    expect(res2).toEqual({ stu1: 'Absent', stu2: 'Late' });
  });

  it('honours per-student updatedAt inside studentsMap so a later sheet bump does not overwrite a newer manual att-* edit', () => {
    const rawDocs = [
      {
        id: 'school_c1_2026-11-19',
        data: {
          classId: 'c1',
          dateStr: '2026-11-19',
          // Sheet was bumped at 11:00Z when stu2 scanned in, but stu1's entry stayed at 08:00Z
          updatedAt: Date.parse('2026-11-19T11:00:00Z'),
          studentsMap: {
            stu1: { studentId: 'stu1', status: 'Present', updatedAt: Date.parse('2026-11-19T08:00:00Z') },
            stu2: { studentId: 'stu2', status: 'Late', updatedAt: Date.parse('2026-11-19T11:00:00Z') },
          },
        },
      },
      // Teacher manually marked stu1 Absent at 09:30Z -> newer than stu1's 08:00Z sheet entry!
      {
        id: 'att-school-c1-stu1-2026-11-19',
        data: {
          studentId: 'stu1',
          classId: 'c1',
          dateStr: '2026-11-19',
          updatedAt: Date.parse('2026-11-19T09:30:00Z'),
          status: 'Absent',
        },
      },
    ];
    const byId = Object.fromEntries(deduplicateAttendanceForDate(rawDocs, '2026-11-19').map((r) => [r.studentId, r.status]));
    expect(byId).toEqual({ stu1: 'Absent', stu2: 'Late' });
  });

  it('derives server-safe UTC date strings and midnight instants independent of host timezone', () => {
    const instant = new Date('2026-11-20T01:15:00.000Z');
    expect(schoolDayDateStrUtc(instant)).toBe('2026-11-20');
    expect(schoolDayStartUtcFromInstant(instant).toISOString()).toBe('2026-11-20T00:00:00.000Z');
  });

  it('keeps billing-server.ts and billing-predicates.ts free of "use client" imports (NG1 regression guard)', () => {
    const predicatesSrc = fs.readFileSync(path.resolve(__dirname, 'billing-predicates.ts'), 'utf8');
    const serverSrc = fs.readFileSync(path.resolve(__dirname, 'billing-server.ts'), 'utf8');
    expect(predicatesSrc).not.toMatch(/^\s*['"]use client['"]/m);
    expect(serverSrc).not.toMatch(/from\s+['"]@\/lib\/billing['"]/);
    expect(serverSrc).toMatch(/from\s+['"]@\/lib\/billing-predicates['"]/);
  });
});
