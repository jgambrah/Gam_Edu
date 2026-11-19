// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  deduplicateAttendanceForDate,
  schoolDayDateStr,
  schoolDayEndUtc,
  schoolDayFromDateStr,
  schoolDayStartUtc,
} from './attendance-date';

describe('attendance-date timezone normalization & deduplication', () => {
  it('anchors local calendar dates and YYYY-MM-DD strings to UTC midnight', () => {
    const localPick = new Date(2026, 10, 19, 15, 30, 0); // Nov 19, 2026
    expect(schoolDayDateStr(localPick)).toBe('2026-11-19');
    expect(schoolDayStartUtc(localPick).toISOString()).toBe('2026-11-19T00:00:00.000Z');
    expect(schoolDayEndUtc(localPick).toISOString()).toBe('2026-11-19T23:59:59.999Z');
    expect(schoolDayFromDateStr('2026-11-19').toISOString()).toBe('2026-11-19T00:00:00.000Z');
  });

  it('captures both UTC+0 (00:00Z) and UTC-8 (08:00Z) classrooms without double-counting dual-written sheet + individual docs', () => {
    const rawDocs = [
      // Aggregated sheet for Grade 1 Orchid saved from a UTC-8 teacher phone (08:00:00Z)
      {
        id: 'school_grade-1-orchid_2026-11-19',
        data: {
          classId: 'grade-1-orchid',
          date: { seconds: Math.floor(Date.parse('2026-11-19T08:00:00Z') / 1000) },
          dateStr: '2026-11-19',
          studentsMap: {
            stu1: { studentId: 'stu1', studentName: 'Felicity', status: 'Present' },
            stu2: { studentId: 'stu2', studentName: 'Fauzan', status: 'Present' },
          },
        },
      },
      // Dual-written individual doc for stu1 (also 08:00:00Z)
      {
        id: 'att-school-grade-1-orchid-stu1-2026-11-19',
        data: {
          studentId: 'stu1',
          studentName: 'Felicity',
          classId: 'grade-1-orchid',
          date: { seconds: Math.floor(Date.parse('2026-11-19T08:00:00Z') / 1000) },
          status: 'Present',
        },
      },
      // UTC+0 classroom individual doc (00:00:00Z)
      {
        id: 'att-school-grade-2-lilly-stu3-2026-11-19',
        data: {
          studentId: 'stu3',
          studentName: 'Ama',
          classId: 'grade-2-lilly',
          date: { seconds: Math.floor(Date.parse('2026-11-19T00:00:00Z') / 1000) },
          status: 'Present',
        },
      },
      // Absent student on 2026-11-19
      {
        id: 'att-school-grade-2-lilly-stu4-2026-11-19',
        data: {
          studentId: 'stu4',
          studentName: 'Kojo',
          classId: 'grade-2-lilly',
          date: { seconds: Math.floor(Date.parse('2026-11-19T00:00:00Z') / 1000) },
          status: 'Absent',
        },
      },
      // Previous day record inside wide query window — must be excluded
      {
        id: 'att-school-grade-2-lilly-stu5-2026-11-18',
        data: {
          studentId: 'stu5',
          studentName: 'Yaw',
          classId: 'grade-2-lilly',
          date: { seconds: Math.floor(Date.parse('2026-11-18T20:00:00Z') / 1000) },
          status: 'Present',
        },
      },
    ];

    const allNov19 = deduplicateAttendanceForDate(rawDocs, '2026-11-19', 'all');
    expect(allNov19).toHaveLength(4);
    const presentOrLate = allNov19.filter((r) => r.status === 'Present' || r.status === 'Late');
    expect(presentOrLate.map((r) => r.studentId).sort()).toEqual(['stu1', 'stu2', 'stu3']);

    const orchidOnly = deduplicateAttendanceForDate(rawDocs, '2026-11-19', 'grade-1-orchid');
    expect(orchidOnly.map((r) => r.studentId).sort()).toEqual(['stu1', 'stu2']);
  });
});

