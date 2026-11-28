'use client';

import React, { useMemo, useState } from 'react';
import { ConstructionLabShell } from './ConstructionLabShell';
import type { AtomBondBuilderConstructionConfig } from '@/lib/narrated-lessons/interactive-schema';
import {
  INTRO_SHELL_FILL_CAPS,
  SUBSHELL_MAX_CAPACITY,
  SUBSHELL_ORDER,
  computeExpectedValenceElectrons,
  evaluateAtomicConstruction,
  evaluateCovalentBonding,
  evaluateFreeAtomicExploration,
  evaluateIonicBonding,
  evaluateVseprConstruction,
  formatEmpiricalFormula,
  formatIntroShellArrangement,
  formatSubshellNotation,
  getApprovedElementsUpToZ,
  getElementBySymbol,
  getElementByZ,
  getExpectedIntroShells,
  getExpectedSubshells,
  lookupVseprEntry,
  type CovalentBondDef,
  type ElementRecord,
  type SubshellId,
  type VseprShapeId,
} from '@/lib/construction-lab/atom-bond-engine';

const MAX_UNDO = 25;

const ALL_VSEPR_SHAPES: Array<{ id: VseprShapeId; label: string }> = [
  { id: 'linear', label: 'Linear' },
  { id: 'bent', label: 'Bent (V-shaped)' },
  { id: 'trigonal-planar', label: 'Trigonal planar' },
  { id: 'trigonal-pyramidal', label: 'Trigonal pyramidal' },
  { id: 'tetrahedral', label: 'Tetrahedral' },
  { id: 'trigonal-bipyramidal', label: 'Trigonal bipyramidal' },
  { id: 'seesaw', label: 'Seesaw' },
  { id: 't-shaped', label: 'T-shaped' },
  { id: 'octahedral', label: 'Octahedral' },
  { id: 'square-pyramidal', label: 'Square pyramidal' },
  { id: 'square-planar', label: 'Square planar' },
];

const ELECTRON_GEOMETRIES: Array<{ id: VseprShapeId; label: string }> = [
  { id: 'linear', label: 'Linear (2 domains)' },
  { id: 'trigonal-planar', label: 'Trigonal planar (3 domains)' },
  { id: 'tetrahedral', label: 'Tetrahedral (4 domains)' },
  { id: 'trigonal-bipyramidal', label: 'Trigonal bipyramidal (5 domains)' },
  { id: 'octahedral', label: 'Octahedral (6 domains)' },
];

function emptySubshells(): Record<SubshellId, number> {
  return { '1s': 0, '2s': 0, '2p': 0, '3s': 0, '3p': 0, '4s': 0, '3d': 0 };
}

function initialSubshellsFromCount(count: number): Record<SubshellId, number> {
  const res = emptySubshells();
  let rem = Math.max(0, count);
  for (const s of SUBSHELL_ORDER) {
    const put = Math.min(rem, SUBSHELL_MAX_CAPACITY[s]);
    res[s] = put;
    rem -= put;
  }
  return res;
}

function initialShellsFromCount(count: number): number[] {
  const shells = [0, 0, 0, 0];
  let rem = Math.max(0, Math.min(20, count));
  for (let i = 0; i < 4; i++) {
    const put = Math.min(rem, INTRO_SHELL_FILL_CAPS[i]);
    shells[i] = put;
    rem -= put;
  }
  return shells;
}

interface LabSnapshot {
  // atomic
  protons: number;
  neutrons: number;
  shells: number[];
  subshells: Record<SubshellId, number>;
  // ionic
  cationCount: number;
  anionCount: number;
  electronsTransferred: number;
  // covalent
  bonds: CovalentBondDef[];
  lonePairs: Record<string, number>;
  // vsepr
  bondingDomains: number;
  lonePairsCount: number;
  electronGeometry: VseprShapeId;
  molecularShape: VseprShapeId;
  polarity: 'polar' | 'non-polar' | null;
}

function makeInitialSnapshot(
  config: AtomBondBuilderConstructionConfig,
  challengeIdx = 0,
): LabSnapshot {
  const iMode = config.interactionMode ?? 'guided';
  const activeChallenge =
    iMode === 'independent-challenge' && config.challengeTargets?.length
      ? config.challengeTargets[Math.min(challengeIdx, config.challengeTargets.length - 1)]
      : null;

  const effTargetSymbol = activeChallenge?.targetElement ?? config.targetElement;
  const effTargetMass = activeChallenge?.targetMassNumber ?? config.targetMassNumber;
  const effLock = activeChallenge?.lockNucleus ?? config.lockNucleus;
  const targetEl = effTargetSymbol ? getElementBySymbol(effTargetSymbol) : null;

  let initP: number;
  let initN: number;
  let initE: number;
  if (config.startEmpty && iMode === 'free-exploration') {
    initP = 0;
    initN = 0;
    initE = 0;
  } else {
    initP =
      activeChallenge?.initialProtons ??
      config.initialProtons ??
      (effLock && targetEl ? targetEl.z : targetEl?.z ?? (iMode === 'free-exploration' ? 0 : 1));
    initN =
      activeChallenge?.initialNeutrons ??
      config.initialNeutrons ??
      (effLock && targetEl && effTargetMass
        ? Math.max(0, effTargetMass - targetEl.z)
        : targetEl
          ? Math.max(0, (targetEl.isotopes[0]?.massNumber ?? targetEl.z * 2) - targetEl.z)
          : 0);
    initE = activeChallenge?.initialElectrons ?? config.initialElectrons ?? 0;
  }

  const initLone: Record<string, number> = {};
  for (const a of config.atoms ?? []) {
    initLone[a.id] = config.initialLonePairs?.[a.id] ?? 0;
  }

  return {
    protons: initP,
    neutrons: initN,
    shells: initialShellsFromCount(initE),
    subshells: initialSubshellsFromCount(initE),
    cationCount: 1,
    anionCount: 1,
    electronsTransferred: 0,
    bonds: (config.initialBonds ?? []).map((b) => ({ ...b })),
    lonePairs: initLone,
    bondingDomains: 2,
    lonePairsCount: 0,
    electronGeometry: 'linear',
    molecularShape: 'linear',
    polarity: null,
  };
}

export function AtomBondLab({ config }: { config: AtomBondBuilderConstructionConfig }) {
  const interactionMode = config.interactionMode ?? 'guided';
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [completedChallenges, setCompletedChallenges] = useState<Record<number, boolean>>({});
  const [state, setState] = useState<LabSnapshot>(() => makeInitialSnapshot(config, 0));
  const [history, setHistory] = useState<LabSnapshot[]>([]);
  const [feedback, setFeedback] = useState<{ passed: boolean; message: string } | null>(null);

  const activeChallenge =
    interactionMode === 'independent-challenge' && config.challengeTargets?.length
      ? config.challengeTargets[Math.min(challengeIdx, config.challengeTargets.length - 1)]
      : null;

  const maxZ = config.maxElementZ ?? (config.representation === 'subshells' ? 30 : 20);
  const selectableElements = useMemo(
    () => (config.mode === 'atomic-structure' ? getApprovedElementsUpToZ(maxZ) : []),
    [config.mode, maxZ],
  );
  const showElementSelector =
    config.mode === 'atomic-structure' &&
    (config.allowElementSelector === true || interactionMode === 'free-exploration');

  const selectElementPreset = (el: ElementRecord) => {
    const primaryIso = el.isotopes[0];
    const massNum = primaryIso ? primaryIso.massNumber : el.z * 2;
    const nCount = Math.max(0, massNum - el.z);
    const eCount = el.z;
    const subCfg = getExpectedSubshells(el.symbol, 0) ?? initialSubshellsFromCount(eCount);
    commit((prev) => ({
      ...prev,
      protons: el.z,
      neutrons: nCount,
      shells: getExpectedIntroShells(Math.min(20, eCount)),
      subshells: subCfg,
    }));
  };

  const clearToEmptyAtom = () => {
    commit((prev) => ({
      ...prev,
      protons: 0,
      neutrons: 0,
      shells: [0, 0, 0, 0],
      subshells: emptySubshells(),
    }));
  };

  const switchChallenge = (idx: number) => {
    setChallengeIdx(idx);
    setHistory([]);
    setState(makeInitialSnapshot(config, idx));
    setFeedback(null);
  };

  // Covalent bond-editor pair selectors (keyboard & touch friendly on 360px mobile)
  const atoms = config.atoms ?? [];
  const [bondFrom, setBondFrom] = useState<string>(atoms[0]?.id ?? '');
  const [bondTo, setBondTo] = useState<string>(atoms[1]?.id ?? '');

  const commit = (updater: (prev: LabSnapshot) => LabSnapshot) => {
    setHistory((h) => [...h.slice(-(MAX_UNDO - 1)), state]);
    setState(updater);
    setFeedback(null);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setState(prev);
    setFeedback(null);
  };

  const handleReset = () => {
    setHistory([]);
    setState(makeInitialSnapshot(config, challengeIdx));
    setFeedback(null);
  };

  const handleCheck = () => {
    if (config.mode === 'atomic-structure') {
      if (interactionMode === 'free-exploration') {
        const res = evaluateFreeAtomicExploration({
          protons: state.protons,
          neutrons: state.neutrons,
          representation: config.representation ?? 'shells',
          shells: state.shells,
          subshells: state.subshells,
          maxZ,
        });
        setFeedback({ passed: res.passed, message: res.feedback });
        return;
      }

      const tEl = activeChallenge?.targetElement ?? config.targetElement ?? 'H';
      const tMass = activeChallenge?.targetMassNumber ?? config.targetMassNumber ?? 1;
      const tCharge = activeChallenge?.targetCharge ?? config.targetCharge ?? 0;

      const res = evaluateAtomicConstruction({
        targetElement: tEl,
        targetMassNumber: tMass,
        targetCharge: tCharge,
        representation: config.representation ?? 'shells',
        protons: state.protons,
        neutrons: state.neutrons,
        shells: state.shells,
        subshells: state.subshells,
        allowHypotheticalIsotope: config.allowHypotheticalIsotope,
      });
      if (res.passed && interactionMode === 'independent-challenge') {
        setCompletedChallenges((prev) => ({ ...prev, [challengeIdx]: true }));
      }
      setFeedback({
        passed: res.passed,
        message: res.passed && config.successExplanation ? `${res.feedback} ${config.successExplanation}` : res.feedback,
      });
      return;
    }

    if (config.mode === 'ionic-bonding') {
      const res = evaluateIonicBonding({
        cationElement: config.cationElement ?? 'Na',
        anionElement: config.anionElement ?? 'Cl',
        targetCationCount: config.targetCationCount ?? 1,
        targetAnionCount: config.targetAnionCount ?? 1,
        targetCationCharge: config.targetCationCharge ?? 1,
        targetAnionCharge: config.targetAnionCharge ?? -1,
        cationCount: state.cationCount,
        anionCount: state.anionCount,
        electronsTransferred: state.electronsTransferred,
        requireSimplestRatio: config.requireSimplestRatio,
      });
      setFeedback({
        passed: res.passed,
        message: res.passed && config.successExplanation ? `${res.feedback} ${config.successExplanation}` : res.feedback,
      });
      return;
    }

    if (config.mode === 'covalent-bonding') {
      const res = evaluateCovalentBonding({
        atoms,
        bonds: state.bonds,
        lonePairsByAtom: state.lonePairs,
        netCharge: config.netCharge ?? 0,
        octetPolicy: config.octetPolicy ?? 'strict-duet-octet',
        expectedDativeCount: config.expectedDativeCount,
        referenceBonds: config.referenceBonds,
      });
      setFeedback({
        passed: res.passed,
        message: res.passed && config.successExplanation ? `${res.feedback} ${config.successExplanation}` : res.feedback,
      });
      return;
    }

    const res = evaluateVseprConstruction({
      moleculeFormula: config.moleculeFormula ?? 'H₂O',
      centralElement: config.centralElement ?? 'O',
      surroundingElements: config.surroundingElements ?? ['H', 'H'],
      targetBondingDomains: config.targetBondingDomains ?? 2,
      targetLonePairs: config.targetLonePairs ?? 2,
      targetElectronGeometry: config.targetElectronGeometry ?? 'tetrahedral',
      targetMolecularShape: config.targetMolecularShape ?? 'bent',
      checkPolarity: Boolean(config.checkPolarity),
      expectedPolar: config.expectedPolar,
      selectedBondingDomains: state.bondingDomains,
      selectedLonePairs: state.lonePairsCount,
      selectedElectronGeometry: state.electronGeometry,
      selectedMolecularShape: state.molecularShape,
      selectedPolarity: state.polarity,
    });
    setFeedback({
      passed: res.passed,
      message: res.passed && config.successExplanation ? `${res.feedback} ${config.successExplanation}` : res.feedback,
    });
  };

  // Helper for covalent bond cycling between two atoms
  const cycleBondBetween = (aId: string, bId: string, asDative = false) => {
    if (!aId || !bId || aId === bId) return;
    const allowed = config.allowedBondOrders ?? [1, 2, 3];
    commit((prev) => {
      const idx = prev.bonds.findIndex(
        (b) => (b.from === aId && b.to === bId) || (b.from === bId && b.to === aId),
      );
      if (asDative) {
        if (idx === -1) {
          return { ...prev, bonds: [...prev.bonds, { from: aId, to: bId, order: 1, isDative: true }] };
        }
        const cur = prev.bonds[idx];
        const nextBonds = [...prev.bonds];
        if (cur.isDative && cur.from === aId) {
          // Toggle off dative
          nextBonds[idx] = { from: aId, to: bId, order: cur.order, isDative: false };
        } else {
          nextBonds[idx] = { from: aId, to: bId, order: 1, isDative: true };
        }
        return { ...prev, bonds: nextBonds };
      }

      if (idx === -1) {
        return { ...prev, bonds: [...prev.bonds, { from: aId, to: bId, order: allowed[0] ?? 1 }] };
      }
      const cur = prev.bonds[idx];
      const pos = allowed.indexOf(cur.order);
      if (pos === -1 || pos === allowed.length - 1) {
        return { ...prev, bonds: prev.bonds.filter((_, i) => i !== idx) };
      }
      const nextBonds = [...prev.bonds];
      nextBonds[idx] = { from: cur.from, to: cur.to, order: allowed[pos + 1], isDative: false };
      return { ...prev, bonds: nextBonds };
    });
  };

  const expectedValenceTotal = useMemo(
    () => (config.mode === 'covalent-bonding' ? computeExpectedValenceElectrons(atoms, config.netCharge ?? 0) ?? 0 : 0),
    [config.mode, atoms, config.netCharge],
  );

  const placedValenceTotal = useMemo(() => {
    const bE = state.bonds.reduce((s, b) => s + b.order * 2, 0);
    const lE = Object.values(state.lonePairs).reduce((s, lp) => s + lp * 2, 0);
    return bE + lE;
  }, [state.bonds, state.lonePairs]);

  const checkLabel =
    config.mode === 'atomic-structure'
      ? 'Check atomic structure'
      : config.mode === 'ionic-bonding'
        ? 'Check ionic bonding'
        : config.mode === 'covalent-bonding'
          ? 'Check covalent structure'
          : 'Check geometry & polarity';

  const currentAtomicEl = getElementByZ(state.protons);
  const currentTotalE =
    config.representation === 'subshells'
      ? SUBSHELL_ORDER.reduce((a, s) => a + state.subshells[s], 0)
      : state.shells.reduce((a, b) => a + b, 0);
  const currentCharge = state.protons - currentTotalE;

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Chemistry'}
      modelNote={config.modelNote}
      hints={config.hints}
      prediction={config.prediction}
      canUndo={history.length > 0}
      onUndo={handleUndo}
      onReset={handleReset}
      onCheck={handleCheck}
      checkLabel={checkLabel}
      feedback={feedback}
    >
      {/* MODE 1: ATOMIC STRUCTURE */}
      {config.mode === 'atomic-structure' && (() => {
        const liveEval = evaluateFreeAtomicExploration({
          protons: state.protons,
          neutrons: state.neutrons,
          representation: config.representation ?? 'shells',
          shells: state.shells,
          subshells: state.subshells,
          maxZ,
        });
        const lockNuc = Boolean(activeChallenge?.lockNucleus ?? config.lockNucleus);
        const minProtons = interactionMode === 'free-exploration' ? 0 : 1;
        const periods = maxZ <= 20 ? [1, 2, 3, 4] : [1, 2, 3, 4];
        const useCompactMainGroupGrid = maxZ <= 20;
        const gridCols = useCompactMainGroupGrid ? [1, 2, 13, 14, 15, 16, 17, 18] : Array.from({ length: 18 }, (_, i) => i + 1);

        return (
        <div className="space-y-4">
          {/* Independent Challenge Selector (Multi-target mode) */}
          {interactionMode === 'independent-challenge' && config.challengeTargets && config.challengeTargets.length > 0 && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 space-y-2">
              <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Atomic structure challenges">
                {config.challengeTargets.map((ch, idx) => (
                  <button
                    key={ch.id ?? idx}
                    type="button"
                    role="tab"
                    aria-selected={challengeIdx === idx}
                    onClick={() => switchChallenge(idx)}
                    className={`min-h-[44px] rounded-lg px-3 text-xs font-bold transition ${
                      challengeIdx === idx
                        ? 'bg-indigo-700 text-white'
                        : completedChallenges[idx]
                          ? 'border border-emerald-400 bg-emerald-50 text-emerald-900'
                          : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    Challenge {idx + 1} {completedChallenges[idx] ? '✓' : ''}
                  </button>
                ))}
              </div>
              {activeChallenge && (
                <p className="text-xs font-bold text-indigo-950">{activeChallenge.prompt}</p>
              )}
            </div>
          )}

          {/* Reusable Periodic-Table Element Selector (touch, mouse, keyboard + list alternative) */}
          {showElementSelector && (
            <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-3 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-extrabold text-sky-950">
                  Periodic Table Element Selector (Z = 1–{maxZ})
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <span>List:</span>
                    <select
                      aria-label="Select element from list"
                      value={currentAtomicEl ? String(currentAtomicEl.z) : ''}
                      onChange={(e) => {
                        const zNum = Number(e.target.value);
                        const found = selectableElements.find((el) => el.z === zNum);
                        if (found) selectElementPreset(found);
                      }}
                      className="min-h-[44px] rounded-lg border border-slate-300 bg-white px-2 text-xs font-bold text-slate-800"
                    >
                      <option value="">Empty atom (Z = 0)</option>
                      {selectableElements.map((el) => (
                        <option key={el.z} value={el.z}>
                          {el.z}. {el.name} ({el.symbol}) — Group {el.group}, Period {el.period}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={clearToEmptyAtom}
                    className="min-h-[44px] rounded-lg border border-slate-300 bg-white px-3 text-xs font-bold text-slate-800 hover:bg-slate-100"
                  >
                    Empty Atom
                  </button>
                </div>
              </div>
              <div
                tabIndex={0}
                role="region"
                aria-label={`Interactive periodic table for elements 1 to ${maxZ}`}
                className="overflow-x-auto pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded-lg"
              >
                <div
                  className="grid gap-1"
                  style={{ gridTemplateColumns: `repeat(${gridCols.length}, minmax(44px, 1fr))` }}
                >
                  {gridCols.map((g) => (
                    <div key={`gh-${g}`} className="text-center text-[10px] font-bold text-slate-600">
                      G{g}
                    </div>
                  ))}
                  {periods.flatMap((per) =>
                    gridCols.map((grp) => {
                      const el = selectableElements.find((e) => e.period === per && e.group === grp);
                      if (!el) return <div key={`empty-${per}-${grp}`} aria-hidden="true" className="h-11" />;
                      const selected = currentAtomicEl?.z === el.z;
                      return (
                        <button
                          key={el.symbol}
                          type="button"
                          aria-pressed={selected}
                          aria-label={`Select ${el.name}, symbol ${el.symbol}, atomic number ${el.z}, Group ${el.group}, Period ${el.period}`}
                          onClick={() => selectElementPreset(el)}
                          className={`flex min-h-[44px] flex-col items-center justify-center rounded-lg border text-center transition ${
                            selected
                              ? 'border-sky-700 bg-sky-700 text-white'
                              : el.isMetal
                                ? 'border-amber-200 bg-amber-50/70 text-slate-900 hover:bg-amber-100'
                                : 'border-indigo-200 bg-white text-slate-900 hover:bg-indigo-50'
                          }`}
                        >
                          <span className="text-[9px] font-bold leading-none opacity-80">{el.z}</span>
                          <span className="text-xs font-extrabold leading-tight">{el.symbol}</span>
                        </button>
                      );
                    }),
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Live Element Identity, Isotope, Charge & Electron Arrangement Banner */}
          <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-800">
                Built Species:{' '}
                <span className="font-mono text-indigo-800">
                  {state.protons === 0
                    ? 'Empty atom (add protons)'
                    : currentAtomicEl
                      ? `${currentAtomicEl.name} (${currentAtomicEl.symbol}-${state.protons + state.neutrons})`
                      : `Z=${state.protons}`}
                  {state.protons > 0 && currentCharge !== 0
                    ? currentCharge > 0
                      ? ` · ${currentCharge}+ ion`
                      : ` · ${Math.abs(currentCharge)}− ion`
                    : state.protons > 0
                      ? ' · Neutral'
                      : ''}
                </span>
              </span>
              <span className="font-mono text-slate-700">
                p⁺={state.protons} · n⁰={state.neutrons} · e⁻={currentTotalE} · A={state.protons + state.neutrons} · Charge={currentCharge > 0 ? `+${currentCharge}` : currentCharge}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-700">
              <span>
                <strong>Arrangement:</strong>{' '}
                {config.representation === 'subshells'
                  ? formatSubshellNotation(state.subshells)
                  : formatIntroShellArrangement(state.shells)}
              </span>
              {liveEval.groupPeriodNote && <span>{liveEval.groupPeriodNote}</span>}
            </div>
          </div>

          {/* Nucleus Controls */}
          {!lockNuc && (
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                <span className="text-xs font-bold text-slate-700">Protons (Z)</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Decrease protons"
                    onClick={() => commit((p) => ({ ...p, protons: Math.max(minProtons, p.protons - 1) }))}
                    className="min-h-[44px] min-w-[44px] rounded-lg border border-slate-300 bg-slate-50 text-sm font-extrabold text-slate-800 hover:bg-slate-100"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-mono text-sm font-extrabold">{state.protons}</span>
                  <button
                    type="button"
                    aria-label="Increase protons"
                    onClick={() =>
                      commit((p) => ({
                        ...p,
                        protons: Math.min(maxZ, p.protons + 1),
                      }))
                    }
                    className="min-h-[44px] min-w-[44px] rounded-lg border border-slate-300 bg-slate-50 text-sm font-extrabold text-slate-800 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                <span className="text-xs font-bold text-slate-700">Neutrons (N)</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Decrease neutrons"
                    onClick={() => commit((p) => ({ ...p, neutrons: Math.max(0, p.neutrons - 1) }))}
                    className="min-h-[44px] min-w-[44px] rounded-lg border border-slate-300 bg-slate-50 text-sm font-extrabold text-slate-800 hover:bg-slate-100"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-mono text-sm font-extrabold">{state.neutrons}</span>
                  <button
                    type="button"
                    aria-label="Increase neutrons"
                    onClick={() => commit((p) => ({ ...p, neutrons: Math.min(45, p.neutrons + 1) }))}
                    className="min-h-[44px] min-w-[44px] rounded-lg border border-slate-300 bg-slate-50 text-sm font-extrabold text-slate-800 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Shell vs Subshell Controls */}
          {config.representation === 'subshells' ? (
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Subshell Occupancy ({formatSubshellNotation(state.subshells)})
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                {SUBSHELL_ORDER.map((sub) => (
                  <div key={sub} className="rounded-xl border border-slate-200 bg-white p-2 text-center">
                    <div className="text-xs font-extrabold text-indigo-700">{sub}</div>
                    <div className="text-[10px] text-slate-500">max {SUBSHELL_MAX_CAPACITY[sub]}</div>
                    <div className="mt-1.5 flex items-center justify-center gap-1">
                      <button
                        type="button"
                        aria-label={`Decrease ${sub} electrons`}
                        onClick={() =>
                          commit((p) => ({
                            ...p,
                            subshells: { ...p.subshells, [sub]: Math.max(0, p.subshells[sub] - 1) },
                          }))
                        }
                        className="min-h-[36px] min-w-[32px] rounded-md border border-slate-300 bg-slate-50 text-xs font-extrabold hover:bg-slate-100"
                      >
                        −
                      </button>
                      <span className="w-6 font-mono text-xs font-extrabold">{state.subshells[sub]}</span>
                      <button
                        type="button"
                        aria-label={`Increase ${sub} electrons`}
                        onClick={() =>
                          commit((p) => ({
                            ...p,
                            subshells: {
                              ...p.subshells,
                              [sub]: Math.min(SUBSHELL_MAX_CAPACITY[sub], p.subshells[sub] + 1),
                            },
                          }))
                        }
                        className="min-h-[36px] min-w-[32px] rounded-md border border-slate-300 bg-slate-50 text-xs font-extrabold hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Static Energy-Level Diagram (explicitly non-orbital) */}
              <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                <svg
                  role="img"
                  aria-label={`Energy-level diagram for ${currentAtomicEl?.name ?? 'atom'}: ${state.protons} protons, ${state.neutrons} neutrons, shell occupancy ${state.shells.join(', ')}`}
                  viewBox="0 0 220 220"
                  className="h-44 w-44"
                >
                  {[4, 3, 2, 1].map((lvl) => (
                    <circle
                      key={lvl}
                      cx={110}
                      cy={110}
                      r={24 + lvl * 19}
                      fill="none"
                      stroke={state.shells[lvl - 1] > 0 ? '#6366f1' : '#cbd5e1'}
                      strokeDasharray={state.shells[lvl - 1] > 0 ? undefined : '4 4'}
                      strokeWidth={1.6}
                    />
                  ))}
                  <circle cx={110} cy={110} r={22} fill="#eef2ff" stroke="#4338ca" strokeWidth={2} />
                  <text x={110} y={108} textAnchor="middle" fontSize={12} fontWeight={800} fill="#1e1b4b">
                    {currentAtomicEl?.symbol ?? '?'}
                  </text>
                  <text x={110} y={121} textAnchor="middle" fontSize={8} fontWeight={700} fill="#4338ca">
                    {state.protons}p {state.neutrons}n
                  </text>
                  {state.shells.map((count, sIdx) => {
                    const r = 24 + (sIdx + 1) * 19;
                    return Array.from({ length: count }).map((_, eIdx) => {
                      const angle = (2 * Math.PI * eIdx) / Math.max(count, 1) - Math.PI / 2;
                      return (
                        <circle
                          key={`${sIdx}-${eIdx}`}
                          cx={110 + r * Math.cos(angle)}
                          cy={110 + r * Math.sin(angle)}
                          r={4}
                          fill="#0284c7"
                          stroke="#ffffff"
                          strokeWidth={1}
                        />
                      );
                    });
                  })}
                </svg>
                <p className="mt-1 text-center text-[10px] text-slate-500">
                  Rings represent quantised energy levels (not circular paths).
                </p>
              </div>

              <div className="space-y-2">
                {state.shells.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-1.5"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800">Energy Level {idx + 1}</span>
                      <span className="ml-1.5 text-[10px] text-slate-500">
                        (first-20 fill: {INTRO_SHELL_FILL_CAPS[idx]})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label={`Decrease Energy Level ${idx + 1} electrons`}
                        onClick={() =>
                          commit((p) => {
                            const next = [...p.shells];
                            next[idx] = Math.max(0, next[idx] - 1);
                            return { ...p, shells: next };
                          })
                        }
                        className="min-h-[40px] min-w-[40px] rounded-lg border border-slate-300 bg-slate-50 text-xs font-extrabold hover:bg-slate-100"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-mono text-xs font-extrabold">{val}</span>
                      <button
                        type="button"
                        aria-label={`Increase Energy Level ${idx + 1} electrons`}
                        onClick={() =>
                          commit((p) => {
                            const next = [...p.shells];
                            next[idx] = Math.min(INTRO_SHELL_FILL_CAPS[idx], next[idx] + 1);
                            return { ...p, shells: next };
                          })
                        }
                        className="min-h-[40px] min-w-[40px] rounded-lg border border-slate-300 bg-slate-50 text-xs font-extrabold hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        );
      })()}

      {/* MODE 2: IONIC BONDING */}
      {config.mode === 'ionic-bonding' && (
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
              <span className="text-xs font-bold text-slate-700">{config.cationElement} atoms</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label={`Decrease ${config.cationElement} count`}
                  onClick={() => commit((p) => ({ ...p, cationCount: Math.max(1, p.cationCount - 1) }))}
                  className="min-h-[44px] min-w-[44px] rounded-lg border border-slate-300 bg-slate-50 font-extrabold"
                >
                  −
                </button>
                <span className="w-6 text-center font-mono text-sm font-extrabold">{state.cationCount}</span>
                <button
                  type="button"
                  aria-label={`Increase ${config.cationElement} count`}
                  onClick={() =>
                    commit((p) => ({
                      ...p,
                      cationCount: Math.min(3, 6 - p.anionCount, p.cationCount + 1),
                    }))
                  }
                  className="min-h-[44px] min-w-[44px] rounded-lg border border-slate-300 bg-slate-50 font-extrabold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
              <span className="text-xs font-bold text-slate-700">{config.anionElement} atoms</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label={`Decrease ${config.anionElement} count`}
                  onClick={() => commit((p) => ({ ...p, anionCount: Math.max(1, p.anionCount - 1) }))}
                  className="min-h-[44px] min-w-[44px] rounded-lg border border-slate-300 bg-slate-50 font-extrabold"
                >
                  −
                </button>
                <span className="w-6 text-center font-mono text-sm font-extrabold">{state.anionCount}</span>
                <button
                  type="button"
                  aria-label={`Increase ${config.anionElement} count`}
                  onClick={() =>
                    commit((p) => ({
                      ...p,
                      anionCount: Math.min(3, 6 - p.cationCount, p.anionCount + 1),
                    }))
                  }
                  className="min-h-[44px] min-w-[44px] rounded-lg border border-slate-300 bg-slate-50 font-extrabold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/50 px-3 py-2">
              <span className="text-xs font-bold text-indigo-900">e⁻ transferred</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Decrease transferred electrons"
                  onClick={() =>
                    commit((p) => ({ ...p, electronsTransferred: Math.max(0, p.electronsTransferred - 1) }))
                  }
                  className="min-h-[44px] min-w-[44px] rounded-lg border border-indigo-300 bg-white font-extrabold"
                >
                  −
                </button>
                <span className="w-6 text-center font-mono text-sm font-extrabold">{state.electronsTransferred}</span>
                <button
                  type="button"
                  aria-label="Increase transferred electrons"
                  onClick={() =>
                    commit((p) => ({ ...p, electronsTransferred: Math.min(12, p.electronsTransferred + 1) }))
                  }
                  className="min-h-[44px] min-w-[44px] rounded-lg border border-indigo-300 bg-white font-extrabold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Bracketed Dot-and-Cross Ion Ratio Display (never an isolated covalent molecule) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {Array.from({ length: state.cationCount }).map((_, i) => (
                <div
                  key={`cat-${i}`}
                  className="inline-flex items-center gap-1 rounded-xl border-2 border-indigo-400 bg-white px-3 py-2 font-mono text-sm font-extrabold text-indigo-900"
                >
                  <span>[{config.cationElement}]</span>
                  <sup className="text-xs text-indigo-700">
                    {state.electronsTransferred > 0 ? `${config.targetCationCharge ?? 1}+` : '0'}
                  </sup>
                </div>
              ))}
              <span className="text-xs font-bold text-slate-400">electrostatic attraction</span>
              {Array.from({ length: state.anionCount }).map((_, i) => (
                <div
                  key={`an-${i}`}
                  className="inline-flex items-center gap-1 rounded-xl border-2 border-teal-500 bg-white px-3 py-2 font-mono text-sm font-extrabold text-teal-900"
                >
                  <span>[{config.anionElement} ●×]</span>
                  <sup className="text-xs text-teal-700">
                    {state.electronsTransferred > 0 ? `${Math.abs(config.targetAnionCharge ?? -1)}−` : '0'}
                  </sup>
                </div>
              ))}
            </div>
            <p className="mt-2 text-center text-xs font-semibold text-slate-600">
              Empirical formula ratio:{' '}
              <span className="font-mono font-extrabold text-slate-900">
                {formatEmpiricalFormula(
                  config.cationElement ?? 'Na',
                  state.cationCount,
                  config.anionElement ?? 'Cl',
                  state.anionCount,
                )}
              </span>{' '}
              (extended ionic lattice unit, not an isolated molecule)
            </p>
          </div>
        </div>
      )}

      {/* MODE 3: COVALENT & COORDINATE BONDING */}
      {config.mode === 'covalent-bonding' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
            <span className="font-bold text-slate-800">
              Species: <span className="font-mono text-indigo-700">{config.formulaDisplay}</span>
            </span>
            <span className="font-mono font-bold text-slate-700">
              Valence e⁻ placed: {placedValenceTotal} / {expectedValenceTotal}
            </span>
          </div>

          {/* 2D Covalent SVG */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-2">
            <svg
              role="img"
              aria-label={`Covalent structure builder for ${config.formulaDisplay} with ${state.bonds.length} bond(s) and ${placedValenceTotal} of ${expectedValenceTotal} valence electrons placed`}
              viewBox="0 0 400 220"
              className="mx-auto h-48 w-full max-w-md"
            >
              {state.bonds.map((b, idx) => {
                const a1 = atoms.find((a) => a.id === b.from);
                const a2 = atoms.find((a) => a.id === b.to);
                if (!a1 || !a2) return null;
                const x1 = (a1.xPct / 100) * 400;
                const y1 = (a1.yPct / 100) * 220;
                const x2 = (a2.xPct / 100) * 400;
                const y2 = (a2.yPct / 100) * 220;
                const dx = x2 - x1;
                const dy = y2 - y1;
                const len = Math.hypot(dx, dy) || 1;
                const nx = -dy / len;
                const ny = dx / len;
                const offsets = b.order === 1 ? [0] : b.order === 2 ? [-4, 4] : [-6, 0, 6];
                return (
                  <g key={`${b.from}-${b.to}-${idx}`}>
                    {offsets.map((off, oi) => (
                      <line
                        key={oi}
                        x1={x1 + nx * off}
                        y1={y1 + ny * off}
                        x2={x2 + nx * off}
                        y2={y2 + ny * off}
                        stroke={b.isDative ? '#d97706' : '#1e293b'}
                        strokeWidth={2.4}
                      />
                    ))}
                    {b.isDative && (
                      <text
                        x={(x1 + x2) / 2}
                        y={(y1 + y2) / 2 - 8}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight={800}
                        fill="#b45309"
                      >
                        dative →
                      </text>
                    )}
                  </g>
                );
              })}

              {atoms.map((a) => {
                const cx = (a.xPct / 100) * 400;
                const cy = (a.yPct / 100) * 220;
                const lp = state.lonePairs[a.id] ?? 0;
                return (
                  <g key={a.id}>
                    <circle cx={cx} cy={cy} r={20} fill="#ffffff" stroke="#334155" strokeWidth={2} />
                    <text x={cx} y={cy + 4} textAnchor="middle" fontSize={13} fontWeight={800} fill="#0f172a">
                      {a.element}
                    </text>
                    <text x={cx} y={cy + 31} textAnchor="middle" fontSize={9} fontWeight={700} fill="#64748b">
                      {a.id} ({lp} LP)
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bond Editor Controls */}
          <div className="flex flex-wrap items-end gap-2 rounded-xl border border-slate-200 bg-white p-3">
            <label className="text-[11px] font-bold text-slate-700">
              From Atom
              <select
                aria-label="Bond from atom"
                value={bondFrom}
                onChange={(e) => setBondFrom(e.target.value)}
                className="mt-1 block min-h-[40px] rounded-lg border border-slate-300 bg-white px-2 text-xs font-mono font-bold"
              >
                {atoms.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.element} ({a.id})
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[11px] font-bold text-slate-700">
              To Atom
              <select
                aria-label="Bond to atom"
                value={bondTo}
                onChange={(e) => setBondTo(e.target.value)}
                className="mt-1 block min-h-[40px] rounded-lg border border-slate-300 bg-white px-2 text-xs font-mono font-bold"
              >
                {atoms.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.element} ({a.id})
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => cycleBondBetween(bondFrom, bondTo, false)}
              className="min-h-[44px] rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
            >
              Cycle Bond (1/2/3/Off)
            </button>
            {config.allowDativeBonds && (
              <button
                type="button"
                onClick={() => cycleBondBetween(bondFrom, bondTo, true)}
                className="min-h-[44px] rounded-lg border border-amber-400 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
              >
                Toggle Dative (→)
              </button>
            )}
          </div>

          {/* Per-Atom Lone Pair Steppers */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {atoms.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-2.5 py-1.5"
              >
                <span className="font-mono text-xs font-bold text-slate-800">
                  {a.element} ({a.id}) LP
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Decrease lone pairs on ${a.id}`}
                    onClick={() =>
                      commit((p) => ({
                        ...p,
                        lonePairs: { ...p.lonePairs, [a.id]: Math.max(0, (p.lonePairs[a.id] ?? 0) - 1) },
                      }))
                    }
                    className="min-h-[36px] min-w-[32px] rounded-md border border-slate-300 bg-slate-50 font-extrabold"
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-mono text-xs font-extrabold">{state.lonePairs[a.id] ?? 0}</span>
                  <button
                    type="button"
                    aria-label={`Increase lone pairs on ${a.id}`}
                    onClick={() =>
                      commit((p) => ({
                        ...p,
                        lonePairs: { ...p.lonePairs, [a.id]: Math.min(4, (p.lonePairs[a.id] ?? 0) + 1) },
                      }))
                    }
                    className="min-h-[36px] min-w-[32px] rounded-md border border-slate-300 bg-slate-50 font-extrabold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 4: MOLECULAR GEOMETRY & POLARITY (VSEPR) */}
      {config.mode === 'molecular-geometry' && (
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
              <div>
                <div className="text-xs font-bold text-slate-800">Bonding Domains</div>
                <div className="text-[10px] text-slate-500">Double/triple bond = 1 domain</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Decrease bonding domains"
                  onClick={() => commit((p) => ({ ...p, bondingDomains: Math.max(2, p.bondingDomains - 1) }))}
                  className="min-h-[44px] min-w-[44px] rounded-lg border border-slate-300 bg-slate-50 font-extrabold"
                >
                  −
                </button>
                <span className="w-6 text-center font-mono text-sm font-extrabold">{state.bondingDomains}</span>
                <button
                  type="button"
                  aria-label="Increase bonding domains"
                  onClick={() =>
                    commit((p) => ({
                      ...p,
                      bondingDomains: Math.min(6 - p.lonePairsCount, p.bondingDomains + 1),
                    }))
                  }
                  className="min-h-[44px] min-w-[44px] rounded-lg border border-slate-300 bg-slate-50 font-extrabold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
              <div>
                <div className="text-xs font-bold text-slate-800">Central Lone Pairs</div>
                <div className="text-[10px] text-slate-500">Steric total: {state.bondingDomains + state.lonePairsCount}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Decrease central lone pairs"
                  onClick={() => commit((p) => ({ ...p, lonePairsCount: Math.max(0, p.lonePairsCount - 1) }))}
                  className="min-h-[44px] min-w-[44px] rounded-lg border border-slate-300 bg-slate-50 font-extrabold"
                >
                  −
                </button>
                <span className="w-6 text-center font-mono text-sm font-extrabold">{state.lonePairsCount}</span>
                <button
                  type="button"
                  aria-label="Increase central lone pairs"
                  onClick={() =>
                    commit((p) => ({
                      ...p,
                      lonePairsCount: Math.min(3, 6 - p.bondingDomains, p.lonePairsCount + 1),
                    }))
                  }
                  className="min-h-[44px] min-w-[44px] rounded-lg border border-slate-300 bg-slate-50 font-extrabold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-xs font-bold text-slate-700">
              Electron-Domain Geometry
              <select
                aria-label="Electron-domain geometry"
                value={state.electronGeometry}
                onChange={(e) => commit((p) => ({ ...p, electronGeometry: e.target.value as VseprShapeId }))}
                className="mt-1 w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-semibold"
              >
                {ELECTRON_GEOMETRIES.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-bold text-slate-700">
              Molecular Shape
              <select
                aria-label="Molecular shape"
                value={state.molecularShape}
                onChange={(e) => commit((p) => ({ ...p, molecularShape: e.target.value as VseprShapeId }))}
                className="mt-1 w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-semibold"
              >
                {ALL_VSEPR_SHAPES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {config.checkPolarity && (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-xs font-bold text-slate-700">Overall Molecular Polarity:</span>
              {(['polar', 'non-polar'] as const).map((pol) => (
                <button
                  key={pol}
                  type="button"
                  onClick={() => commit((p) => ({ ...p, polarity: pol }))}
                  className={`min-h-[40px] rounded-lg border px-3 py-1 text-xs font-bold capitalize transition ${
                    state.polarity === pol
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pol}
                </button>
              ))}
            </div>
          )}

          {/* Lightweight 2D VSEPR Projection Summary Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs text-slate-700">
            <span className="font-bold text-slate-900">{config.moleculeFormula}</span> · Central:{' '}
            <span className="font-mono font-bold">{config.centralElement}</span> · Surrounding:{' '}
            <span className="font-mono font-bold">{(config.surroundingElements ?? []).join(', ')}</span> · Reference
            angle for AX{state.bondingDomains}E{state.lonePairsCount}:{' '}
            <span className="font-mono font-bold text-indigo-700">
              {lookupVseprEntry(state.bondingDomains, state.lonePairsCount)?.referenceAngleLabel ?? 'Unsupported AXmEn'}
            </span>
          </div>
        </div>
      )}
    </ConstructionLabShell>
  );
}
