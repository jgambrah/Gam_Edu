import { describe, it, expect } from 'vitest';
import { findPauseForDate, isServicePausedOnDate, parseBillingPauses } from '@/lib/billing-pause';
import {
  isServicePausedOnDate as fnIsServicePausedOnDate,
  parseBillingPauses as fnParseBillingPauses,
  planDailyBillsForStudents,
  type BillableStudentRecord,
} from '../../functions/src/daily-billing';

const stored = {
  pauses: [
    { id: 'a', fromDate: '2026-11-24', toDate: '2026-11-26', canteen: true, transport: false, reason: 'Kitchen closed' },
    { id: 'b', fromDate: '2026-12-01', toDate: '2026-12-01', canteen: true, transport: true, reason: '' },
    { fromDate: 'garbage', toDate: '2026-12-01', canteen: true, transport: true }, // dropped
  ],
};

describe('billing pause rules', () => {
  const pauses = parseBillingPauses(stored);

  it('drops malformed entries and keeps valid ones', () => {
    expect(pauses).toHaveLength(2);
    expect(parseBillingPauses(null)).toEqual([]);
    expect(parseBillingPauses({ pauses: 'nope' })).toEqual([]);
  });

  it('pauses only the chosen service, inclusive of both end dates', () => {
    expect(isServicePausedOnDate(pauses, '2026-11-24', 'canteen')).toBe(true);
    expect(isServicePausedOnDate(pauses, '2026-11-26', 'canteen')).toBe(true);
    expect(isServicePausedOnDate(pauses, '2026-11-25', 'transport')).toBe(false);
    expect(isServicePausedOnDate(pauses, '2026-11-23', 'canteen')).toBe(false);
    expect(isServicePausedOnDate(pauses, '2026-11-27', 'canteen')).toBe(false);
  });

  it('single-day pause covers both services that day only', () => {
    expect(isServicePausedOnDate(pauses, '2026-12-01', 'canteen')).toBe(true);
    expect(isServicePausedOnDate(pauses, '2026-12-01', 'transport')).toBe(true);
    expect(isServicePausedOnDate(pauses, '2026-12-02', 'transport')).toBe(false);
  });

  it('no pauses / bad date never pauses billing', () => {
    expect(isServicePausedOnDate([], '2026-11-24', 'canteen')).toBe(false);
    expect(isServicePausedOnDate(undefined, '2026-11-24', 'canteen')).toBe(false);
    expect(isServicePausedOnDate(pauses, 'not-a-date', 'canteen')).toBe(false);
  });

  it('findPauseForDate returns the covering pause for notices', () => {
    expect(findPauseForDate(pauses, '2026-11-25')?.reason).toBe('Kitchen closed');
    expect(findPauseForDate(pauses, '2026-11-30')).toBeUndefined();
  });

  it('Cloud Function copy agrees with the web app copy (parity)', () => {
    const fnPauses = fnParseBillingPauses(stored);
    expect(fnPauses).toHaveLength(pauses.length);
    for (const d of ['2026-11-23', '2026-11-24', '2026-11-25', '2026-11-26', '2026-11-27', '2026-12-01', '2026-12-02']) {
      for (const s of ['canteen', 'transport'] as const) {
        expect(fnIsServicePausedOnDate(fnPauses, d, s)).toBe(isServicePausedOnDate(pauses, d, s));
      }
    }
  });
});

describe('server planner honours billing pauses', () => {
  const student: BillableStudentRecord = {
    uid: 's1', firstName: 'A', lastName: 'B', classId: 'c1',
    usesCanteen: true, canteenBillingMode: 'Daily',
    usesBusService: true, transportBillingModel: 'Daily',
  };
  const base = {
    students: [student],
    schoolId: 'school',
    canteenConfig: { pricingModel: 'Flat', dailyRate: 10, classRates: {} },
    transportRateMap: new Map([['s1', 5]]),
    existingBills: new Map(),
    termStamp: null,
    dueDateValue: 'due',
    createdAtValue: 'now',
  };
  const pauses = fnParseBillingPauses(stored);

  it('bills both services when no pause covers the date', () => {
    const plan = planDailyBillsForStudents({ ...base, dateStr: '2026-11-23', pauses });
    expect(plan.ops.map(o => o.service).sort()).toEqual(['Canteen', 'Transport']);
  });

  it('skips only the paused service (canteen paused, transport still billed)', () => {
    const plan = planDailyBillsForStudents({ ...base, dateStr: '2026-11-25', pauses });
    expect(plan.ops.map(o => o.service)).toEqual(['Transport']);
    expect(plan.expectedCanteenCount).toBe(0);
  });

  it('creates nothing when everything is paused, and does not restore voided bills', () => {
    const plan = planDailyBillsForStudents({
      ...base,
      dateStr: '2026-12-01',
      pauses,
      existingBills: new Map([['canteen-s1-2026-12-01', { id: 'canteen-s1-2026-12-01', voided: true }]]),
    });
    expect(plan.ops).toHaveLength(0);
    expect(plan.expectedBillCount).toBe(0);
  });
});
