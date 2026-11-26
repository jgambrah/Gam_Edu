/**
 * GAM EDU — Step 4D Domain 2: Pure TypeScript Bounded DC Electrical Circuit Engine
 *
 * Deterministic Kirchhoff & Ohm's Law solver for bounded slot-and-branch DC topologies:
 * - 'series': single closed loop (2..5 main slots)
 * - 'parallel-2-branch': main loop segment (1..3 slots) feeding two parallel branches (1..2 slots each)
 * - 'series-parallel': identical explicit main + Branch A + Branch B topology with series load emphasis
 *
 * Scientific & Safety Guarantees:
 * - Never represents infinite resistance with unsafe JSON numbers (open switches & voltmeters
 *   are explicit discrete component kinds).
 * - Distinguishes an open main switch (I_total = 0) from an open individual branch (other branch conducts).
 * - Never computes finite normal current through a short-circuited ideal supply (0 Ohm closed loop);
 *   emits an explicit short-circuit safety diagnostic.
 * - Explains voltmeter-in-series and ammeter-in-parallel misconnections.
 * - Validates BOTH structural goals (required component counts/positions) AND numerical goals.
 * - Fixed-resistance lamps are explicitly modelled as simplified ohmic loads with qualitative brightness.
 */

export type DcCircuitTopology = 'series' | 'parallel-2-branch' | 'series-parallel';

export type DcComponentKind =
  | 'wire'
  | 'switch-open'
  | 'switch-closed'
  | 'resistor'
  | 'lamp'
  | 'ammeter'
  | 'voltmeter';

export interface DcComponentOption {
  id: string;
  kind: DcComponentKind;
  label: string;
  /** Required for 'resistor' and 'lamp' (finite positive Ohms 1..1000). Omitted for wire/switch/meters. */
  resistanceOhm?: number;
}

export type DcSlotPosition = 'main' | 'branch-a' | 'branch-b' | 'voltmeter-probe';

export interface DcCircuitSlotDef {
  id: string;
  label: string;
  position: DcSlotPosition;
  initialComponentId: string;
  /** When position === 'voltmeter-probe', indicates which slot ID this parallel probe measures across. */
  targetSlotId?: string;
  locked?: boolean;
}

export interface DcCircuitGoalDef {
  description: string;
  targetTotalCurrentA?: number;
  toleranceA?: number;
  targetBranchACurrentA?: number;
  targetBranchBCurrentA?: number;
  targetVoltmeterV?: number;
  toleranceV?: number;
  requiredComponents?: Array<{ kind: DcComponentKind; minCount: number; position?: DcSlotPosition }>;
  requireNoShortCircuit?: boolean;
  requireNoMeterMisconnection?: boolean;
}

export type LampBrightness = 'off' | 'dim' | 'normal' | 'bright';

export interface DcSlotReading {
  slotId: string;
  label: string;
  position: DcSlotPosition;
  component: DcComponentOption;
  currentA: number | null;
  voltageV: number | null;
  powerW: number | null;
  lampBrightness?: LampBrightness;
}

export interface DcCircuitSolveResult {
  status: 'normal' | 'open-main' | 'short-circuit';
  supplyVoltageV: number;
  equivalentResistanceOhm: number | null;
  totalCurrentA: number | null;
  branchACurrentA: number | null;
  branchBCurrentA: number | null;
  branchAOpen: boolean;
  branchBOpen: boolean;
  voltmeterProbeV: number | null;
  ammeterReadingA: number | null;
  diagnostics: string[];
  hasShortCircuit: boolean;
  hasMeterMisconnection: boolean;
  slotReadings: DcSlotReading[];
  kclResidualA: number;
  kvlResidualV: number;
}

export interface DcCircuitGoalEvaluation {
  passed: boolean;
  reasons: string[];
  feedback: string;
}

function classifyLampBrightness(powerW: number | null): LampBrightness {
  if (powerW === null || powerW <= 0.05) return 'off';
  if (powerW < 1.5) return 'dim';
  if (powerW < 6.0) return 'normal';
  return 'bright';
}

function evaluateSegment(slots: Array<{ def: DcCircuitSlotDef; comp: DcComponentOption }>): {
  isOpen: boolean;
  resistanceOhm: number;
  hasVoltmeterInSeries: boolean;
  hasAmmeter: boolean;
} {
  let isOpen = false;
  let resistanceOhm = 0;
  let hasVoltmeterInSeries = false;
  let hasAmmeter = false;

  for (const { comp } of slots) {
    if (comp.kind === 'switch-open') {
      isOpen = true;
    } else if (comp.kind === 'voltmeter') {
      isOpen = true;
      hasVoltmeterInSeries = true;
    } else if (comp.kind === 'resistor' || comp.kind === 'lamp') {
      resistanceOhm += comp.resistanceOhm ?? 0;
    } else if (comp.kind === 'ammeter') {
      hasAmmeter = true;
    }
  }

  return { isOpen, resistanceOhm, hasVoltmeterInSeries, hasAmmeter };
}

/**
 * Pure deterministic DC circuit solver enforcing Kirchhoff's Current Law (KCL),
 * Kirchhoff's Voltage Law (KVL), Ohm's Law (V = IR), and short-circuit safety.
 */
export function solveDcCircuit(
  topology: DcCircuitTopology,
  supplyVoltageV: number,
  slots: readonly DcCircuitSlotDef[],
  palette: readonly DcComponentOption[],
  slotSelection: Readonly<Record<string, string>>,
): DcCircuitSolveResult {
  const paletteMap = new Map<string, DcComponentOption>(palette.map((c) => [c.id, c]));
  const fallbackWire: DcComponentOption = { id: '__wire', kind: 'wire', label: 'Wire' };

  const resolvedSlots = slots.map((def) => {
    const cid = slotSelection[def.id] ?? def.initialComponentId;
    const comp = paletteMap.get(cid) ?? paletteMap.get(def.initialComponentId) ?? fallbackWire;
    return { def, comp };
  });

  const mainSlots = resolvedSlots.filter((s) => s.def.position === 'main');
  const branchASlots = resolvedSlots.filter((s) => s.def.position === 'branch-a');
  const branchBSlots = resolvedSlots.filter((s) => s.def.position === 'branch-b');
  const probeSlots = resolvedSlots.filter((s) => s.def.position === 'voltmeter-probe');

  const mainSeg = evaluateSegment(mainSlots);
  const diagnostics: string[] = [];
  let hasMeterMisconnection = false;

  if (mainSeg.hasVoltmeterInSeries) {
    hasMeterMisconnection = true;
    diagnostics.push(
      'Voltmeter connected in series in the main loop: an idealised voltmeter has very high internal resistance and blocks current. Connect voltmeters in parallel across a component.',
    );
  }

  for (const probe of probeSlots) {
    if (probe.comp.kind === 'ammeter') {
      hasMeterMisconnection = true;
      diagnostics.push(
        'Ammeter connected in a parallel probe slot: an ammeter has very low internal resistance and must be connected in series, not in parallel across a component.',
      );
    }
  }

  // Case 1: Series topology
  if (topology === 'series') {
    const probeShortsComponent = probeSlots.some((p) => p.comp.kind === 'ammeter' || p.comp.kind === 'wire' || p.comp.kind === 'switch-closed');
    // Check if probe shorts the only load across the whole supply
    const shortedTargetIds = new Set(
      probeSlots
        .filter((p) => p.comp.kind === 'ammeter' || p.comp.kind === 'wire' || p.comp.kind === 'switch-closed')
        .map((p) => p.def.targetSlotId)
        .filter((id): id is string => Boolean(id)),
    );

    const effectiveMainR = mainSlots.reduce((acc, s) => {
      if (shortedTargetIds.has(s.def.id)) return acc;
      if (s.comp.kind === 'resistor' || s.comp.kind === 'lamp') return acc + (s.comp.resistanceOhm ?? 0);
      return acc;
    }, 0);

    if (mainSeg.isOpen) {
      diagnostics.push('Main circuit loop is open: current cannot flow (I = 0 A).');
      const slotReadings: DcSlotReading[] = resolvedSlots.map(({ def, comp }) => ({
        slotId: def.id,
        label: def.label,
        position: def.position,
        component: comp,
        currentA: 0,
        voltageV: 0,
        powerW: 0,
        lampBrightness: comp.kind === 'lamp' ? 'off' : undefined,
      }));
      return {
        status: 'open-main',
        supplyVoltageV,
        equivalentResistanceOhm: null,
        totalCurrentA: 0,
        branchACurrentA: null,
        branchBCurrentA: null,
        branchAOpen: false,
        branchBOpen: false,
        voltmeterProbeV: 0,
        ammeterReadingA: mainSeg.hasAmmeter ? 0 : null,
        diagnostics,
        hasShortCircuit: false,
        hasMeterMisconnection,
        slotReadings,
        kclResidualA: 0,
        kvlResidualV: 0,
      };
    }

    if (effectiveMainR <= 0) {
      diagnostics.push(
        probeShortsComponent
          ? 'Short circuit detected: a low-resistance component (such as an ammeter or wire) in the parallel probe slot bypassed the load. Virtual supply protection engaged.'
          : 'Short circuit detected: negligible resistance in the closed loop would draw dangerously high current. Virtual supply protection engaged—add a resistor or lamp.',
      );
      const slotReadings: DcSlotReading[] = resolvedSlots.map(({ def, comp }) => ({
        slotId: def.id,
        label: def.label,
        position: def.position,
        component: comp,
        currentA: null,
        voltageV: null,
        powerW: null,
        lampBrightness: comp.kind === 'lamp' ? 'off' : undefined,
      }));
      return {
        status: 'short-circuit',
        supplyVoltageV,
        equivalentResistanceOhm: 0,
        totalCurrentA: null,
        branchACurrentA: null,
        branchBCurrentA: null,
        branchAOpen: false,
        branchBOpen: false,
        voltmeterProbeV: null,
        ammeterReadingA: null,
        diagnostics,
        hasShortCircuit: true,
        hasMeterMisconnection,
        slotReadings,
        kclResidualA: 0,
        kvlResidualV: 0,
      };
    }

    const totalI = supplyVoltageV / effectiveMainR;
    let sumV = 0;
    const voltageBySlot = new Map<string, number>();

    const slotReadings: DcSlotReading[] = resolvedSlots.map(({ def, comp }) => {
      if (def.position === 'voltmeter-probe') {
        return {
          slotId: def.id,
          label: def.label,
          position: def.position,
          component: comp,
          currentA: 0,
          voltageV: null,
          powerW: 0,
        };
      }
      const r = shortedTargetIds.has(def.id)
        ? 0
        : comp.kind === 'resistor' || comp.kind === 'lamp'
          ? comp.resistanceOhm ?? 0
          : 0;
      const v = totalI * r;
      const p = v * totalI;
      sumV += v;
      voltageBySlot.set(def.id, v);
      return {
        slotId: def.id,
        label: def.label,
        position: def.position,
        component: comp,
        currentA: totalI,
        voltageV: v,
        powerW: p,
        lampBrightness: comp.kind === 'lamp' ? classifyLampBrightness(p) : undefined,
      };
    });

    let voltmeterProbeV: number | null = null;
    for (const sr of slotReadings) {
      if (sr.position === 'voltmeter-probe' && sr.component.kind === 'voltmeter') {
        const targetId = slots.find((s) => s.id === sr.slotId)?.targetSlotId;
        const measured = targetId ? voltageBySlot.get(targetId) ?? 0 : supplyVoltageV;
        sr.voltageV = measured;
        voltmeterProbeV = measured;
      }
    }

    return {
      status: 'normal',
      supplyVoltageV,
      equivalentResistanceOhm: effectiveMainR,
      totalCurrentA: totalI,
      branchACurrentA: null,
      branchBCurrentA: null,
      branchAOpen: false,
      branchBOpen: false,
      voltmeterProbeV,
      ammeterReadingA: mainSeg.hasAmmeter ? totalI : null,
      diagnostics,
      hasShortCircuit: false,
      hasMeterMisconnection,
      slotReadings,
      kclResidualA: 0,
      kvlResidualV: Math.abs(supplyVoltageV - sumV),
    };
  }

  // Case 2: Parallel / Series-Parallel topology (main segment + Branch A || Branch B)
  const segA = evaluateSegment(branchASlots);
  const segB = evaluateSegment(branchBSlots);

  if (segA.hasVoltmeterInSeries) {
    hasMeterMisconnection = true;
    diagnostics.push('Voltmeter connected in series inside Branch A: blocks current in Branch A.');
  }
  if (segB.hasVoltmeterInSeries) {
    hasMeterMisconnection = true;
    diagnostics.push('Voltmeter connected in series inside Branch B: blocks current in Branch B.');
  }

  // Main loop open or BOTH parallel branches open -> no total current
  if (mainSeg.isOpen || (segA.isOpen && segB.isOpen)) {
    diagnostics.push(
      mainSeg.isOpen
        ? 'Main loop is open: current is 0 A across all branches.'
        : 'Both parallel branches are open: no closed path exists (I = 0 A).',
    );
    const slotReadings: DcSlotReading[] = resolvedSlots.map(({ def, comp }) => ({
      slotId: def.id,
      label: def.label,
      position: def.position,
      component: comp,
      currentA: 0,
      voltageV: 0,
      powerW: 0,
      lampBrightness: comp.kind === 'lamp' ? 'off' : undefined,
    }));
    return {
      status: 'open-main',
      supplyVoltageV,
      equivalentResistanceOhm: null,
      totalCurrentA: 0,
      branchACurrentA: 0,
      branchBCurrentA: 0,
      branchAOpen: segA.isOpen,
      branchBOpen: segB.isOpen,
      voltmeterProbeV: 0,
      ammeterReadingA: mainSeg.hasAmmeter ? 0 : null,
      diagnostics,
      hasShortCircuit: false,
      hasMeterMisconnection,
      slotReadings,
      kclResidualA: 0,
      kvlResidualV: 0,
    };
  }

  // Check if either active parallel branch has 0 Ohm resistance (shorting the parallel block)
  const branchAShorts = !segA.isOpen && segA.resistanceOhm <= 0;
  const branchBShorts = !segB.isOpen && segB.resistanceOhm <= 0;
  const parallelR =
    branchAShorts || branchBShorts
      ? 0
      : segA.isOpen
        ? segB.resistanceOhm
        : segB.isOpen
          ? segA.resistanceOhm
          : 1 / (1 / segA.resistanceOhm + 1 / segB.resistanceOhm);

  const totalR = mainSeg.resistanceOhm + parallelR;

  // Short circuit across the ideal supply (totalR === 0)
  if (totalR <= 0) {
    const shortedByAmmeter = (branchAShorts && segA.hasAmmeter) || (branchBShorts && segB.hasAmmeter);
    diagnostics.push(
      shortedByAmmeter
        ? 'Short circuit detected: an ammeter was placed directly in a parallel branch with zero load resistance. Ammeters must be wired in series with a load.'
        : 'Short circuit detected: a closed branch with negligible resistance (plain wire / closed switch with no load) shorts the supply. Virtual supply protection engaged.',
    );
    const slotReadings: DcSlotReading[] = resolvedSlots.map(({ def, comp }) => ({
      slotId: def.id,
      label: def.label,
      position: def.position,
      component: comp,
      currentA: null,
      voltageV: null,
      powerW: null,
      lampBrightness: comp.kind === 'lamp' ? 'off' : undefined,
    }));
    return {
      status: 'short-circuit',
      supplyVoltageV,
      equivalentResistanceOhm: 0,
      totalCurrentA: null,
      branchACurrentA: null,
      branchBCurrentA: null,
      branchAOpen: segA.isOpen,
      branchBOpen: segB.isOpen,
      voltmeterProbeV: null,
      ammeterReadingA: null,
      diagnostics,
      hasShortCircuit: true,
      hasMeterMisconnection: hasMeterMisconnection || shortedByAmmeter,
      slotReadings,
      kclResidualA: 0,
      kvlResidualV: 0,
    };
  }

  if (segA.isOpen && !segB.isOpen) {
    diagnostics.push('Branch A is open (0 A), while Branch B remains closed and conducting.');
  } else if (segB.isOpen && !segA.isOpen) {
    diagnostics.push('Branch B is open (0 A), while Branch A remains closed and conducting.');
  }

  const totalI = supplyVoltageV / totalR;
  const vMain = totalI * mainSeg.resistanceOhm;
  const vParallel = supplyVoltageV - vMain;

  let iA = 0;
  let iB = 0;
  if (branchAShorts && branchBShorts) {
    iA = totalI / 2;
    iB = totalI / 2;
  } else if (branchAShorts) {
    iA = totalI;
    iB = 0;
    diagnostics.push('Branch A has zero load resistance, bypassing Branch B.');
  } else if (branchBShorts) {
    iA = 0;
    iB = totalI;
    diagnostics.push('Branch B has zero load resistance, bypassing Branch A.');
  } else {
    iA = segA.isOpen ? 0 : vParallel / segA.resistanceOhm;
    iB = segB.isOpen ? 0 : vParallel / segB.resistanceOhm;
  }

  const voltageBySlot = new Map<string, number>();
  const slotReadings: DcSlotReading[] = resolvedSlots.map(({ def, comp }) => {
    if (def.position === 'voltmeter-probe') {
      return {
        slotId: def.id,
        label: def.label,
        position: def.position,
        component: comp,
        currentA: 0,
        voltageV: null,
        powerW: 0,
      };
    }
    const segI = def.position === 'main' ? totalI : def.position === 'branch-a' ? iA : iB;
    const r = comp.kind === 'resistor' || comp.kind === 'lamp' ? comp.resistanceOhm ?? 0 : 0;
    const v = segI * r;
    const p = v * segI;
    voltageBySlot.set(def.id, v);
    return {
      slotId: def.id,
      label: def.label,
      position: def.position,
      component: comp,
      currentA: segI,
      voltageV: v,
      powerW: p,
      lampBrightness: comp.kind === 'lamp' ? classifyLampBrightness(p) : undefined,
    };
  });

  let voltmeterProbeV: number | null = null;
  for (const sr of slotReadings) {
    if (sr.position === 'voltmeter-probe' && sr.component.kind === 'voltmeter') {
      const targetId = slots.find((s) => s.id === sr.slotId)?.targetSlotId;
      const measured = targetId ? voltageBySlot.get(targetId) ?? 0 : vParallel;
      sr.voltageV = measured;
      voltmeterProbeV = measured;
    }
  }

  const kclResidualA = Math.abs(totalI - (iA + iB));
  const kvlResidualV = Math.abs(supplyVoltageV - (vMain + vParallel));

  return {
    status: 'normal',
    supplyVoltageV,
    equivalentResistanceOhm: totalR,
    totalCurrentA: totalI,
    branchACurrentA: iA,
    branchBCurrentA: iB,
    branchAOpen: segA.isOpen,
    branchBOpen: segB.isOpen,
    voltmeterProbeV,
    ammeterReadingA: mainSeg.hasAmmeter ? totalI : null,
    diagnostics,
    hasShortCircuit: false,
    hasMeterMisconnection,
    slotReadings,
    kclResidualA,
    kvlResidualV,
  };
}

/**
 * Evaluates BOTH structural requirements (required component kinds/counts) AND numerical goals.
 */
export function evaluateDcCircuitGoal(
  solve: DcCircuitSolveResult,
  goal: DcCircuitGoalDef,
): DcCircuitGoalEvaluation {
  const reasons: string[] = [];

  if (goal.requireNoShortCircuit !== false && solve.hasShortCircuit) {
    reasons.push('Resolve the short circuit before checking the target.');
  }
  if (goal.requireNoMeterMisconnection && solve.hasMeterMisconnection) {
    reasons.push('Fix the meter placement (ammeters belong in series; voltmeters belong in parallel).');
  }

  if (goal.requiredComponents) {
    for (const req of goal.requiredComponents) {
      const matching = solve.slotReadings.filter(
        (sr) => sr.component.kind === req.kind && (!req.position || sr.position === req.position),
      ).length;
      if (matching < req.minCount) {
        reasons.push(
          `Structural requirement not met: expected at least ${req.minCount} ${req.kind}(s)${req.position ? ` in ${req.position}` : ''}, currently ${matching}.`,
        );
      }
    }
  }

  const tolA = goal.toleranceA ?? 0.05;
  const tolV = goal.toleranceV ?? 0.1;

  if (goal.targetTotalCurrentA !== undefined) {
    if (solve.totalCurrentA === null || Math.abs(solve.totalCurrentA - goal.targetTotalCurrentA) > tolA) {
      reasons.push(
        `Main-line current is ${solve.totalCurrentA === null ? 'undefined (short circuit)' : `${solve.totalCurrentA.toFixed(2)} A`}; target is ${goal.targetTotalCurrentA.toFixed(2)} A (±${tolA} A).`,
      );
    }
  }
  if (goal.targetBranchACurrentA !== undefined) {
    if (solve.branchACurrentA === null || Math.abs(solve.branchACurrentA - goal.targetBranchACurrentA) > tolA) {
      reasons.push(
        `Branch A current is ${solve.branchACurrentA === null ? 'undefined' : `${solve.branchACurrentA.toFixed(2)} A`}; target is ${goal.targetBranchACurrentA.toFixed(2)} A.`,
      );
    }
  }
  if (goal.targetBranchBCurrentA !== undefined) {
    if (solve.branchBCurrentA === null || Math.abs(solve.branchBCurrentA - goal.targetBranchBCurrentA) > tolA) {
      reasons.push(
        `Branch B current is ${solve.branchBCurrentA === null ? 'undefined' : `${solve.branchBCurrentA.toFixed(2)} A`}; target is ${goal.targetBranchBCurrentA.toFixed(2)} A.`,
      );
    }
  }
  if (goal.targetVoltmeterV !== undefined) {
    if (solve.voltmeterProbeV === null || Math.abs(solve.voltmeterProbeV - goal.targetVoltmeterV) > tolV) {
      reasons.push(
        `Voltmeter reading is ${solve.voltmeterProbeV === null ? 'not connected' : `${solve.voltmeterProbeV.toFixed(2)} V`}; target is ${goal.targetVoltmeterV.toFixed(2)} V.`,
      );
    }
  }

  const passed = reasons.length === 0;
  return {
    passed,
    reasons,
    feedback: passed
      ? 'Circuit goal achieved! Both the required component structure and electrical measurements match Kirchhoff and Ohm’s Law.'
      : reasons.join(' '),
  };
}
