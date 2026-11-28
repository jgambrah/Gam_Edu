// @vitest-environment node
/** Independent hand-calculated checks of the DC circuit solver (audit checkpoint 2). */
import { describe, expect, it } from 'vitest';
import { solveDcCircuit, type DcCircuitSlotDef, type DcComponentOption } from './dc-circuit-engine';

const palette: DcComponentOption[] = [
  { id: 'r2', kind: 'resistor', label: '2 ohm', resistanceOhm: 2 },
  { id: 'r4', kind: 'resistor', label: '4 ohm', resistanceOhm: 4 },
  { id: 'r6', kind: 'resistor', label: '6 ohm', resistanceOhm: 6 },
  { id: 'r3', kind: 'resistor', label: '3 ohm', resistanceOhm: 3 },
  { id: 'w', kind: 'wire', label: 'wire' },
  { id: 'sw-open', kind: 'switch-open', label: 'open switch' },
  { id: 'sw-closed', kind: 'switch-closed', label: 'closed switch' },
  { id: 'amm', kind: 'ammeter', label: 'ammeter' },
  { id: 'volt', kind: 'voltmeter', label: 'voltmeter' },
];
const slot = (id: string, position: DcCircuitSlotDef['position'], initialComponentId: string, extra: Partial<DcCircuitSlotDef> = {}): DcCircuitSlotDef => ({
  id, label: id, position, initialComponentId, ...extra,
});

describe('DC circuit solver vs hand calculations', () => {
  it('series: 6 V across 2 ohm + 4 ohm gives R=6, I=1 A, V2 = 4 V (Ohm + KVL)', () => {
    const slots = [slot('a', 'main', 'r2'), slot('b', 'main', 'r4'), slot('m', 'main', 'amm')];
    const r = solveDcCircuit('series', 6, slots, palette, {});
    expect(r.status).toBe('normal');
    expect(r.equivalentResistanceOhm).toBeCloseTo(6, 9);
    expect(r.totalCurrentA).toBeCloseTo(1, 9);
    expect(r.ammeterReadingA).toBeCloseTo(1, 9);
    const rb = r.slotReadings.find((s) => s.slotId === 'b')!;
    expect(rb.voltageV).toBeCloseTo(4, 9);
    expect(Math.abs(r.kvlResidualV)).toBeLessThan(1e-9);
  });

  it('parallel: 6 V across 6 ohm || 3 ohm gives 1 A + 2 A = 3 A, Req = 2 ohm (KCL)', () => {
    const slots = [slot('a', 'branch-a', 'r6'), slot('b', 'branch-b', 'r3')];
    const r = solveDcCircuit('parallel-2-branch', 6, slots, palette, {});
    expect(r.branchACurrentA).toBeCloseTo(1, 9);
    expect(r.branchBCurrentA).toBeCloseTo(2, 9);
    expect(r.totalCurrentA).toBeCloseTo(3, 9);
    expect(r.equivalentResistanceOhm).toBeCloseTo(2, 9);
    expect(Math.abs(r.kclResidualA)).toBeLessThan(1e-9);
  });

  it('an open switch in the main line gives zero current (open circuit), not a computed current', () => {
    const slots = [slot('a', 'main', 'r2'), slot('s', 'main', 'sw-open')];
    const r = solveDcCircuit('series', 6, slots, palette, {});
    expect(r.status).toBe('open-main');
    expect(r.totalCurrentA === null || r.totalCurrentA === 0).toBe(true);
  });

  it('a closed loop with no resistance is a SHORT CIRCUIT and never reports a finite/infinite current', () => {
    const slots = [slot('w1', 'main', 'w'), slot('w2', 'main', 'sw-closed')];
    const r = solveDcCircuit('series', 6, slots, palette, {});
    expect(r.status).toBe('short-circuit');
    expect(r.hasShortCircuit).toBe(true);
    expect(r.totalCurrentA).toBeNull();
    expect(JSON.stringify(r)).not.toContain('Infinity');
  });

  it('a voltmeter placed in series is flagged as a misconnection and blocks current', () => {
    const slots = [slot('a', 'main', 'r2'), slot('v', 'main', 'volt')];
    const r = solveDcCircuit('series', 6, slots, palette, {});
    expect(r.hasMeterMisconnection).toBe(true);
    expect(r.totalCurrentA === null || r.totalCurrentA === 0).toBe(true);
  });

  it('swapping a slot component changes the answer consistently (6 V, 2 ohm + 6 ohm -> 0.75 A)', () => {
    const slots = [slot('a', 'main', 'r2'), slot('b', 'main', 'r4')];
    const r = solveDcCircuit('series', 6, slots, palette, { b: 'r6' });
    expect(r.totalCurrentA).toBeCloseTo(0.75, 9);
  });
});
