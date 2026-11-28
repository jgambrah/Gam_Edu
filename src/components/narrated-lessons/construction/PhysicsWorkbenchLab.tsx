'use client';

import React, { useMemo, useState } from 'react';
import { ConstructionLabShell, type ConstructionFeedbackState } from './ConstructionLabShell';
import type { PhysicsWorkbenchConstructionConfig } from '@/lib/narrated-lessons/interactive-schema';
import {
  APPROVED_OPTICAL_MEDIA,
  PHYSICS_LIMITS,
  computeMomentsEquilibrium,
  computeOpticalImage,
  computePlaneReflection,
  computeRefraction,
  computeSimpleMachine,
  evaluatePhysicsGoal,
  type BeamForceDef,
  type OpticalElementKind,
  type SimpleMachineKind,
} from '@/lib/construction-lab/physics-workbench-engine';

const MAX_UNDO = 25;

interface PhysicsSnapshot {
  incidentAngleDeg: number;
  n1: number;
  n2: number;
  elementKind: OpticalElementKind;
  focalLengthCm: number;
  objectDistanceCm: number;
  objectHeightCm: number;
  pivotPositionM: number;
  forces: BeamForceDef[];
  machineKind: SimpleMachineKind;
  loadN: number;
  loadDistanceM: number;
  efficiencyPct: number;
  effortArmM: number;
  loadArmM: number;
  supportingStrands: number;
  planeLengthM: number;
  planeHeightM: number;
}

function resolveEffectiveConfig(
  config: PhysicsWorkbenchConstructionConfig,
  exampleIdx: number,
): PhysicsWorkbenchConstructionConfig {
  if (!config.examples || config.examples.length === 0) return config;
  const ex = config.examples[Math.min(exampleIdx, config.examples.length - 1)];
  if (!ex) return config;
  return {
    ...config,
    ...(ex as Partial<PhysicsWorkbenchConstructionConfig>),
    modelNote: ex.modelNote ?? config.modelNote,
    successExplanation: ex.successExplanation ?? config.successExplanation,
    goal: ex.goal ?? config.goal,
  };
}

function makeInitialSnapshot(cfg: PhysicsWorkbenchConstructionConfig): PhysicsSnapshot {
  return {
    incidentAngleDeg: cfg.initialIncidentAngleDeg ?? 30,
    n1: cfg.initialN1 ?? 1.0,
    n2: cfg.initialN2 ?? 1.52,
    elementKind:
      cfg.elementKind ??
      (cfg.mode === 'spherical-mirror' ? 'concave-mirror' : 'converging-lens'),
    focalLengthCm: cfg.initialFocalLengthCm ?? 12,
    objectDistanceCm: cfg.initialObjectDistanceCm ?? 24,
    objectHeightCm: cfg.initialObjectHeightCm ?? 6,
    pivotPositionM: cfg.initialPivotPositionM ?? 0,
    forces: (cfg.initialForces ?? [
      { id: 'f1', label: 'Left load', forceN: 40, positionM: -2, direction: 'down' },
      { id: 'f2', label: 'Right load', forceN: 20, positionM: 4, direction: 'down' },
    ]).map((f) => ({ ...f })),
    machineKind: cfg.machineKind ?? 'lever',
    loadN: cfg.initialLoadN ?? 120,
    loadDistanceM: cfg.initialLoadDistanceM ?? 1,
    efficiencyPct: cfg.initialEfficiencyPct ?? 100,
    effortArmM: cfg.initialEffortArmM ?? 3,
    loadArmM: cfg.initialLoadArmM ?? 1,
    supportingStrands: cfg.initialSupportingStrands ?? 2,
    planeLengthM: cfg.initialPlaneLengthM ?? 4,
    planeHeightM: cfg.initialPlaneHeightM ?? 1,
  };
}

export function PhysicsWorkbenchLab({
  config,
  isSandbox = false,
}: {
  config: PhysicsWorkbenchConstructionConfig;
  isSandbox?: boolean;
}) {
  const examples = !config.isAssessment && config.examples && config.examples.length > 0 ? config.examples : null;
  const [exampleIdx, setExampleIdx] = useState(0);
  const [completedExamples, setCompletedExamples] = useState<Record<number, boolean>>({});
  const effectiveConfig = useMemo(() => resolveEffectiveConfig(config, exampleIdx), [config, exampleIdx]);
  const activeExample = examples ? examples[Math.min(exampleIdx, examples.length - 1)] : null;

  const [state, setState] = useState<PhysicsSnapshot>(() => makeInitialSnapshot(effectiveConfig));
  const [history, setHistory] = useState<PhysicsSnapshot[]>([]);
  const [feedback, setFeedback] = useState<ConstructionFeedbackState | null>(null);

  const commit = (updater: (prev: PhysicsSnapshot) => PhysicsSnapshot) => {
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
    setState(makeInitialSnapshot(effectiveConfig));
    setFeedback(null);
  };

  const switchExample = (idx: number) => {
    const nextCfg = resolveEffectiveConfig(config, idx);
    setExampleIdx(idx);
    setHistory([]);
    setState(makeInitialSnapshot(nextCfg));
    setFeedback(null);
  };

  const reflectionRes = useMemo(
    () => (effectiveConfig.mode === 'reflection' ? computePlaneReflection({ incidentAngleDeg: state.incidentAngleDeg }) : null),
    [effectiveConfig.mode, state.incidentAngleDeg],
  );

  const refractionRes = useMemo(
    () =>
      effectiveConfig.mode === 'refraction'
        ? computeRefraction({ incidentAngleDeg: state.incidentAngleDeg, n1: state.n1, n2: state.n2 })
        : null,
    [effectiveConfig.mode, state.incidentAngleDeg, state.n1, state.n2],
  );

  const opticsRes = useMemo(
    () =>
      effectiveConfig.mode === 'thin-lens' || effectiveConfig.mode === 'spherical-mirror'
        ? computeOpticalImage({
            elementKind: state.elementKind,
            focalLengthMagCm: state.focalLengthCm,
            objectDistanceCm: state.objectDistanceCm,
            objectHeightCm: state.objectHeightCm,
          })
        : null,
    [effectiveConfig.mode, state.elementKind, state.focalLengthCm, state.objectDistanceCm, state.objectHeightCm],
  );

  const momentsRes = useMemo(
    () =>
      effectiveConfig.mode === 'moments'
        ? computeMomentsEquilibrium({
            pivotPositionM: state.pivotPositionM,
            forces: state.forces,
            equilibriumToleranceNm: effectiveConfig.equilibriumToleranceNm,
          })
        : null,
    [effectiveConfig.mode, effectiveConfig.equilibriumToleranceNm, state.forces, state.pivotPositionM],
  );

  const machineRes = useMemo(
    () =>
      effectiveConfig.mode === 'simple-machines'
        ? computeSimpleMachine({
            machineKind: state.machineKind,
            loadN: state.loadN,
            loadDistanceM: state.loadDistanceM,
            efficiencyPct: state.efficiencyPct,
            effortArmM: state.effortArmM,
            loadArmM: state.loadArmM,
            supportingStrands: state.supportingStrands,
            planeLengthM: state.planeLengthM,
            planeHeightM: state.planeHeightM,
          })
        : null,
    [
      effectiveConfig.mode,
      state.efficiencyPct,
      state.effortArmM,
      state.loadArmM,
      state.loadDistanceM,
      state.loadN,
      state.machineKind,
      state.planeHeightM,
      state.planeLengthM,
      state.supportingStrands,
    ],
  );

  const activeResult = reflectionRes ?? refractionRes ?? opticsRes ?? momentsRes ?? machineRes;

  const handleCheck = () => {
    if (!activeResult) return;
    if (effectiveConfig.goal) {
      const ev = evaluatePhysicsGoal(effectiveConfig.goal, activeResult);
      if (ev.passed && examples) {
        setCompletedExamples((prev) => ({ ...prev, [exampleIdx]: true }));
      }
      setFeedback({
        passed: ev.passed,
        tone: ev.passed ? 'verified' : 'error',
        message: ev.passed && effectiveConfig.successExplanation ? `${ev.feedback} ${effectiveConfig.successExplanation}` : ev.feedback,
      });
      return;
    }
    setFeedback({
      passed: activeResult.ok,
      tone: activeResult.ok ? 'verified' : 'error',
      message: activeResult.summary,
    });
  };

  const defaultModelNote =
    effectiveConfig.mode === 'reflection'
      ? 'Angles of incidence and reflection are always measured from the normal line (perpendicular to the mirror), never from the mirror surface.'
      : effectiveConfig.mode === 'refraction'
        ? 'Monochromatic ray model: ignores chromatic dispersion and Fresnel intensity variation. Below the critical angle, partial reflection and refraction occur simultaneously.'
        : effectiveConfig.mode === 'thin-lens' || effectiveConfig.mode === 'spherical-mirror'
          ? 'Paraxial thin-lens / spherical-mirror model using the real-is-positive sign convention (1/u + 1/v = 1/f; m = −v/u). Ignores spherical and chromatic aberrations.'
          : effectiveConfig.mode === 'moments'
            ? 'Assumes a rigid uniform light beam. Rotational equilibrium (Στ = 0) is distinct from complete static equilibrium (Στ = 0 and ΣF = 0 including the pivot reaction).'
            : 'Ideal model assumes 100% efficiency (MA = VR). Real machines lose energy to friction and moving-part weight so MA < VR and efficiency < 100%.';

  return (
    <ConstructionLabShell
      id={isSandbox ? `${config.id}-sandbox` : config.id}
      labKind={config.labKind}
      title={isSandbox ? `${config.title} (Explore Further)` : config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Physics'}
      modelNote={effectiveConfig.modelNote ?? defaultModelNote}
      hints={config.hints}
      prediction={isSandbox ? undefined : config.prediction}
      canUndo={history.length > 0}
      onUndo={handleUndo}
      onReset={handleReset}
      onCheck={handleCheck}
      checkLabel={effectiveConfig.goal ? 'Check physics challenge' : 'Verify observation'}
      feedback={feedback}
      isAssessment={Boolean(config.isAssessment)}
      disableExploreFurther={isSandbox || Boolean(config.isAssessment) || !config.exploreFurther}
      renderExploreFurther={
        !isSandbox && config.exploreFurther && !config.isAssessment
          ? () => <PhysicsWorkbenchLab config={{ ...config, goal: undefined, exploreFurther: false }} isSandbox />
          : undefined
      }
    >
      {/* Shared Selectable Examples Bank */}
      {examples && (
        <div className="mb-3 space-y-2 rounded-xl border border-indigo-200 bg-indigo-50/70 p-3">
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Select physics example">
            {examples.map((ex, idx) => (
              <button
                key={ex.id}
                type="button"
                role="tab"
                aria-selected={exampleIdx === idx}
                onClick={() => switchExample(idx)}
                className={`min-h-[44px] rounded-lg px-3 text-xs font-bold transition ${
                  exampleIdx === idx
                    ? 'bg-indigo-700 text-white'
                    : completedExamples[idx]
                      ? 'border border-emerald-400 bg-emerald-50 text-emerald-900'
                      : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
                }`}
              >
                {ex.label} {completedExamples[idx] ? '✓' : ''}
              </button>
            ))}
          </div>
          {activeExample?.prompt && <p className="text-xs font-bold text-indigo-950">{activeExample.prompt}</p>}
        </div>
      )}

      {effectiveConfig.goal && (
        <div className="mb-3 rounded-xl border border-sky-200 bg-sky-50/70 px-3 py-2 text-xs font-bold text-sky-950">
          Target: {effectiveConfig.goal.description}
        </div>
      )}

      {/* DOMAIN A: REFLECTION */}
      {effectiveConfig.mode === 'reflection' && reflectionRes && (() => {
        const rad = (reflectionRes.incidentAngleDeg * Math.PI) / 180;
        const len = 115;
        const cx = 180;
        const cy = 150;
        const ix = cx - len * Math.sin(rad);
        const iy = cy - len * Math.cos(rad);
        const rx = cx + len * Math.sin(rad);
        const ry = cy - len * Math.cos(rad);
        return (
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
              <svg
                role="img"
                aria-label={`Plane mirror reflection diagram: incident angle ${reflectionRes.incidentAngleDeg} degrees, reflected angle ${reflectionRes.reflectedAngleDeg} degrees from normal`}
                viewBox="0 0 360 190"
                className="mx-auto h-44 w-full max-w-md"
              >
                {/* Mirror surface */}
                <line x1="30" y1={cy} x2="330" y2={cy} stroke="#0f172a" strokeWidth="4" />
                {/* Normal */}
                <line x1={cx} y1="20" x2={cx} y2={cy} stroke="#64748b" strokeDasharray="5 4" strokeWidth="1.5" />
                <text x={cx + 6} y="30" fontSize="10" fontWeight="700" fill="#475569">Normal</text>
                {/* Incident ray */}
                <line x1={ix} y1={iy} x2={cx} y2={cy} stroke="#2563eb" strokeWidth="2.5" />
                {/* Reflected ray */}
                <line x1={cx} y1={cy} x2={rx} y2={ry} stroke="#dc2626" strokeWidth="2.5" />
                <circle cx={cx} cy={cy} r="3.5" fill="#0f172a" />
                <text x="40" y="172" fontSize="10" fontWeight="700" fill="#334155">Plane Mirror</text>
              </svg>
            </div>
            <label className="block rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-800">
              Angle of incidence θᵢ (from normal): <span className="font-mono text-indigo-700">{state.incidentAngleDeg}°</span>
              <input
                type="range"
                aria-label="Angle of incidence in degrees"
                min={PHYSICS_LIMITS.minIncidenceDeg}
                max={PHYSICS_LIMITS.maxIncidenceDeg}
                step={1}
                value={state.incidentAngleDeg}
                onChange={(e) => commit((p) => ({ ...p, incidentAngleDeg: Number(e.target.value) }))}
                className="mt-2 w-full accent-indigo-600"
              />
            </label>
            <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:grid-cols-3">
              <div>θᵢ = <strong className="font-mono">{reflectionRes.incidentAngleDeg}°</strong></div>
              <div>θᵣ = <strong className="font-mono">{reflectionRes.reflectedAngleDeg}°</strong></div>
              <div>Between rays = <strong className="font-mono">{reflectionRes.angleBetweenRaysDeg}°</strong></div>
            </div>
          </div>
        );
      })()}

      {/* DOMAIN B: REFRACTION & TOTAL INTERNAL REFLECTION */}
      {effectiveConfig.mode === 'refraction' && refractionRes && (() => {
        const cx = 180;
        const cy = 110;
        const len = 95;
        const radI = (refractionRes.incidentAngleDeg * Math.PI) / 180;
        const ix = cx - len * Math.sin(radI);
        const iy = cy - len * Math.cos(radI);
        const reflX = cx + len * Math.sin(radI);
        const reflY = cy - len * Math.cos(radI);
        const hasRefracted = refractionRes.refractedAngleDeg !== null;
        const radR = hasRefracted ? (refractionRes.refractedAngleDeg! * Math.PI) / 180 : 0;
        const tx = cx + len * Math.sin(radR);
        const ty = cy + len * Math.cos(radR);
        return (
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
              <svg
                role="img"
                aria-label={`Refraction diagram: n1=${refractionRes.n1}, n2=${refractionRes.n2}, incident ${refractionRes.incidentAngleDeg} degrees, ${refractionRes.isTotalInternalReflection ? 'total internal reflection' : `refracted ${refractionRes.refractedAngleDeg} degrees`}`}
                viewBox="0 0 360 220"
                className="mx-auto h-48 w-full max-w-md"
              >
                <rect x="10" y="10" width="340" height={cy - 10} fill="#f8fafc" />
                <rect x="10" y={cy} width="340" height={210 - cy} fill="#e0f2fe" />
                <line x1="10" y1={cy} x2="350" y2={cy} stroke="#0f172a" strokeWidth="2" />
                <line x1={cx} y1="15" x2={cx} y2="205" stroke="#64748b" strokeDasharray="5 4" strokeWidth="1.5" />
                <text x="18" y="26" fontSize="10" fontWeight="700" fill="#334155">Medium 1 (n₁ = {refractionRes.n1})</text>
                <text x="18" y="200" fontSize="10" fontWeight="700" fill="#0369a1">Medium 2 (n₂ = {refractionRes.n2})</text>
                <line x1={ix} y1={iy} x2={cx} y2={cy} stroke="#2563eb" strokeWidth="2.5" />
                {/* Partial or Total Internal Reflection ray */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={reflX}
                  y2={reflY}
                  stroke="#dc2626"
                  strokeWidth={refractionRes.isTotalInternalReflection ? '2.8' : '1.4'}
                  strokeDasharray={refractionRes.isTotalInternalReflection ? undefined : '4 3'}
                />
                {hasRefracted && (
                  <line x1={cx} y1={cy} x2={tx} y2={ty} stroke="#059669" strokeWidth="2.5" />
                )}
              </svg>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <label className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800">
                Medium 1 (n₁)
                <select
                  aria-label="Medium 1 refractive index"
                  value={String(state.n1)}
                  onChange={(e) => commit((p) => ({ ...p, n1: Number(e.target.value) }))}
                  className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-2 text-xs font-semibold"
                >
                  {APPROVED_OPTICAL_MEDIA.map((m) => (
                    <option key={m.id} value={m.n}>
                      {m.name} ({m.n})
                    </option>
                  ))}
                </select>
              </label>
              <label className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800">
                Medium 2 (n₂)
                <select
                  aria-label="Medium 2 refractive index"
                  value={String(state.n2)}
                  onChange={(e) => commit((p) => ({ ...p, n2: Number(e.target.value) }))}
                  className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-2 text-xs font-semibold"
                >
                  {APPROVED_OPTICAL_MEDIA.map((m) => (
                    <option key={m.id} value={m.n}>
                      {m.name} ({m.n})
                    </option>
                  ))}
                </select>
              </label>
              <label className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800">
                Incidence θᵢ: <span className="font-mono text-indigo-700">{state.incidentAngleDeg}°</span>
                <input
                  type="range"
                  aria-label="Angle of incidence in degrees"
                  min={0}
                  max={85}
                  step={1}
                  value={state.incidentAngleDeg}
                  onChange={(e) => commit((p) => ({ ...p, incidentAngleDeg: Number(e.target.value) }))}
                  className="mt-2 w-full accent-indigo-600"
                />
              </label>
            </div>
            <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:grid-cols-3">
              <div>θᵣ = <strong className="font-mono">{refractionRes.refractedAngleDeg === null ? 'None (TIR)' : `${refractionRes.refractedAngleDeg}°`}</strong></div>
              <div>Critical θc = <strong className="font-mono">{refractionRes.criticalAngleDeg === null ? 'N/A (n₁ ≤ n₂)' : `${refractionRes.criticalAngleDeg}°`}</strong></div>
              <div>Regime: <strong className="font-mono">{refractionRes.isTotalInternalReflection ? 'Total Internal Reflection' : refractionRes.bendDirection}</strong></div>
            </div>
          </div>
        );
      })()}

      {/* DOMAINS C & D: THIN LENSES & SPHERICAL MIRRORS */}
      {(effectiveConfig.mode === 'thin-lens' || effectiveConfig.mode === 'spherical-mirror') && opticsRes && (() => {
        const cx = 200;
        const axisY = 110;
        const pxPerCm = 2.6;
        const objX = cx - Math.min(state.objectDistanceCm * pxPerCm, 175);
        const objTopY = axisY - Math.min(state.objectHeightCm * 4.5, 75);
        const fPx = state.focalLengthCm * pxPerCm;
        const isMirror = effectiveConfig.mode === 'spherical-mirror';
        const imgX =
          opticsRes.imageDistanceCm === null
            ? null
            : isMirror
              ? cx - Math.max(-175, Math.min(175, opticsRes.imageDistanceCm * pxPerCm))
              : cx + Math.max(-175, Math.min(175, opticsRes.imageDistanceCm * pxPerCm));
        const imgTopY =
          opticsRes.imageHeightCm === null
            ? null
            : axisY - Math.max(-85, Math.min(85, opticsRes.imageHeightCm * 4.5));

        return (
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
              <svg
                role="img"
                aria-label={`${state.elementKind} ray diagram: focal length ${opticsRes.signedFocalLengthCm} cm, object at ${state.objectDistanceCm} cm, ${opticsRes.imageAtInfinity ? 'image at infinity' : `${opticsRes.imageNature} ${opticsRes.orientation} image at ${opticsRes.imageDistanceCm} cm`}`}
                viewBox="0 0 400 220"
                className="mx-auto h-48 w-full max-w-lg"
              >
                {/* Principal axis */}
                <line x1="15" y1={axisY} x2="385" y2={axisY} stroke="#64748b" strokeDasharray="4 4" strokeWidth="1.2" />
                {/* Optical element */}
                <line x1={cx} y1="20" x2={cx} y2="200" stroke="#0f172a" strokeWidth="3" />
                {/* Focal points */}
                <circle cx={cx - fPx} cy={axisY} r="3" fill="#b45309" />
                <text x={cx - fPx - 4} y={axisY + 14} fontSize="10" fontWeight="700" fill="#b45309">F</text>
                {!isMirror && (
                  <>
                    <circle cx={cx + fPx} cy={axisY} r="3" fill="#b45309" />
                    <text x={cx + fPx - 4} y={axisY + 14} fontSize="10" fontWeight="700" fill="#b45309">F&apos;</text>
                  </>
                )}
                {/* Object arrow */}
                <line x1={objX} y1={axisY} x2={objX} y2={objTopY} stroke="#2563eb" strokeWidth="3" />
                <text x={objX - 10} y={objTopY - 5} fontSize="10" fontWeight="700" fill="#1d4ed8">Obj</text>
                {/* Principal Ray 1: Parallel to axis */}
                <line x1={objX} y1={objTopY} x2={cx} y2={objTopY} stroke="#0284c7" strokeWidth="1.6" />
                {/* Principal Ray 2: Through optical centre / vertex */}
                <line x1={objX} y1={objTopY} x2={cx} y2={axisY} stroke="#7c3aed" strokeWidth="1.6" />
                {imgX !== null && imgTopY !== null && (
                  <>
                    <line
                      x1={cx}
                      y1={objTopY}
                      x2={imgX}
                      y2={imgTopY}
                      stroke="#0284c7"
                      strokeWidth="1.6"
                      strokeDasharray={opticsRes.imageNature === 'virtual' ? '4 3' : undefined}
                    />
                    <line
                      x1={cx}
                      y1={axisY}
                      x2={imgX}
                      y2={imgTopY}
                      stroke="#7c3aed"
                      strokeWidth="1.6"
                      strokeDasharray={opticsRes.imageNature === 'virtual' ? '4 3' : undefined}
                    />
                    <line
                      x1={imgX}
                      y1={axisY}
                      x2={imgX}
                      y2={imgTopY}
                      stroke="#dc2626"
                      strokeWidth="3"
                      strokeDasharray={opticsRes.imageNature === 'virtual' ? '4 2' : undefined}
                    />
                    <text x={imgX - 10} y={imgTopY + (imgTopY < axisY ? -5 : 13)} fontSize="10" fontWeight="700" fill="#b91c1c">
                      Img
                    </text>
                  </>
                )}
              </svg>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <label className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800">
                Object distance u: <span className="font-mono text-indigo-700">{state.objectDistanceCm} cm</span>
                <input
                  type="range"
                  aria-label="Object distance u in cm"
                  min={PHYSICS_LIMITS.minObjectDistCm}
                  max={PHYSICS_LIMITS.maxObjectDistCm}
                  step={1}
                  value={state.objectDistanceCm}
                  onChange={(e) => commit((p) => ({ ...p, objectDistanceCm: Number(e.target.value) }))}
                  className="mt-2 w-full accent-indigo-600"
                />
              </label>
              <label className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800">
                Focal length |f|: <span className="font-mono text-indigo-700">{state.focalLengthCm} cm</span>
                <input
                  type="range"
                  aria-label="Focal length magnitude in cm"
                  min={PHYSICS_LIMITS.minFocalLengthCm}
                  max={PHYSICS_LIMITS.maxFocalLengthCm}
                  step={1}
                  value={state.focalLengthCm}
                  onChange={(e) => commit((p) => ({ ...p, focalLengthCm: Number(e.target.value) }))}
                  className="mt-2 w-full accent-indigo-600"
                />
              </label>
              <label className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800">
                Object height hₒ: <span className="font-mono text-indigo-700">{state.objectHeightCm} cm</span>
                <input
                  type="range"
                  aria-label="Object height in cm"
                  min={PHYSICS_LIMITS.minObjectHeightCm}
                  max={PHYSICS_LIMITS.maxObjectHeightCm}
                  step={1}
                  value={state.objectHeightCm}
                  onChange={(e) => commit((p) => ({ ...p, objectHeightCm: Number(e.target.value) }))}
                  className="mt-2 w-full accent-indigo-600"
                />
              </label>
            </div>

            <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:grid-cols-3">
              <div>Image v = <strong className="font-mono">{opticsRes.imageAtInfinity ? '∞ (parallel rays)' : `${opticsRes.imageDistanceCm} cm`}</strong></div>
              <div>Magnification m = <strong className="font-mono">{opticsRes.magnification ?? 'Undefined'}</strong></div>
              <div>Nature: <strong className="font-mono">{opticsRes.imageAtInfinity ? 'At infinity' : `${opticsRes.imageNature}, ${opticsRes.orientation}, ${opticsRes.sizeRelation}`}</strong></div>
            </div>
          </div>
        );
      })()}

      {/* DOMAIN E: MOMENTS & EQUILIBRIUM */}
      {effectiveConfig.mode === 'moments' && momentsRes && (() => {
        const toX = (m: number) => 200 + m * 32;
        const pivotX = toX(state.pivotPositionM);
        const tiltDeg = momentsRes.isRotationalEquilibrium ? 0 : Math.max(-12, Math.min(12, momentsRes.netMomentNm * 0.12));
        return (
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
              <svg
                role="img"
                aria-label={`Uniform beam moments diagram: pivot at ${state.pivotPositionM} m, clockwise moment ${momentsRes.totalClockwiseNm} N m, anticlockwise moment ${momentsRes.totalAnticlockwiseNm} N m`}
                viewBox="0 0 400 170"
                className="mx-auto h-40 w-full max-w-lg"
              >
                <g transform={`rotate(${tiltDeg}, ${pivotX}, 95)`}>
                  <rect x="40" y="90" width="320" height="10" rx="4" fill="#334155" />
                  {state.forces.map((f) => {
                    const fx = toX(f.positionM);
                    const yStart = f.direction === 'down' ? 45 : 145;
                    const yEnd = f.direction === 'down' ? 88 : 102;
                    return (
                      <g key={f.id}>
                        <line x1={fx} y1={yStart} x2={fx} y2={yEnd} stroke={f.direction === 'down' ? '#dc2626' : '#059669'} strokeWidth="2.5" />
                        <text x={fx} y={f.direction === 'down' ? 38 : 160} textAnchor="middle" fontSize="9" fontWeight="700" fill="#0f172a">
                          {f.forceN}N ({f.positionM}m)
                        </text>
                      </g>
                    );
                  })}
                </g>
                {/* Pivot triangle */}
                <polygon points={`${pivotX},100 ${pivotX - 12},125 ${pivotX + 12},125`} fill="#4338ca" />
              </svg>
            </div>

            <label className="block rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800">
              Pivot position: <span className="font-mono text-indigo-700">{state.pivotPositionM} m</span>
              <input
                type="range"
                aria-label="Pivot position in metres"
                min={PHYSICS_LIMITS.minBeamPosM}
                max={PHYSICS_LIMITS.maxBeamPosM}
                step={0.5}
                value={state.pivotPositionM}
                onChange={(e) => commit((p) => ({ ...p, pivotPositionM: Number(e.target.value) }))}
                className="mt-1.5 w-full accent-indigo-600"
              />
            </label>

            <div className="grid gap-2 sm:grid-cols-2">
              {state.forces.map((f, idx) => (
                <div key={f.id} className="space-y-1.5 rounded-xl border border-slate-200 bg-white p-2.5 text-xs">
                  <div className="font-bold text-slate-900">{f.label} ({f.direction})</div>
                  <label className="block text-slate-700">
                    Force: <span className="font-mono font-bold">{f.forceN} N</span>
                    <input
                      type="range"
                      aria-label={`${f.label} force in Newtons`}
                      min={0}
                      max={PHYSICS_LIMITS.maxForceN}
                      step={5}
                      value={f.forceN}
                      onChange={(e) =>
                        commit((p) => ({
                          ...p,
                          forces: p.forces.map((item, i) => (i === idx ? { ...item, forceN: Number(e.target.value) } : item)),
                        }))
                      }
                      className="mt-1 w-full accent-indigo-600"
                    />
                  </label>
                  <label className="block text-slate-700">
                    Position: <span className="font-mono font-bold">{f.positionM} m</span>
                    <input
                      type="range"
                      aria-label={`${f.label} position in metres`}
                      min={PHYSICS_LIMITS.minBeamPosM}
                      max={PHYSICS_LIMITS.maxBeamPosM}
                      step={0.5}
                      value={f.positionM}
                      onChange={(e) =>
                        commit((p) => ({
                          ...p,
                          forces: p.forces.map((item, i) => (i === idx ? { ...item, positionM: Number(e.target.value) } : item)),
                        }))
                      }
                      className="mt-1 w-full accent-indigo-600"
                    />
                  </label>
                </div>
              ))}
            </div>

            <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:grid-cols-3">
              <div>CW / ACW: <strong className="font-mono">{momentsRes.totalClockwiseNm} / {momentsRes.totalAnticlockwiseNm} N·m</strong></div>
              <div>Net moment: <strong className="font-mono">{momentsRes.netMomentNm} N·m</strong></div>
              <div>Pivot reaction (static eq.): <strong className="font-mono">{momentsRes.requiredPivotReactionN} N</strong></div>
            </div>
          </div>
        );
      })()}

      {/* DOMAIN F: SIMPLE MACHINES */}
      {effectiveConfig.mode === 'simple-machines' && machineRes && (
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <label className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800">
              Load L: <span className="font-mono text-indigo-700">{state.loadN} N</span>
              <input
                type="range"
                aria-label="Load force in Newtons"
                min={20}
                max={1000}
                step={20}
                value={state.loadN}
                onChange={(e) => commit((p) => ({ ...p, loadN: Number(e.target.value) }))}
                className="mt-1.5 w-full accent-indigo-600"
              />
            </label>
            <label className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800">
              Efficiency η: <span className="font-mono text-indigo-700">{state.efficiencyPct}%</span>
              <input
                type="range"
                aria-label="Machine efficiency percentage"
                min={20}
                max={100}
                step={5}
                value={state.efficiencyPct}
                onChange={(e) => commit((p) => ({ ...p, efficiencyPct: Number(e.target.value) }))}
                className="mt-1.5 w-full accent-indigo-600"
              />
            </label>
            {state.machineKind === 'lever' && (
              <label className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800">
                Effort arm dₑ: <span className="font-mono text-indigo-700">{state.effortArmM} m</span> (dₗ = {state.loadArmM} m)
                <input
                  type="range"
                  aria-label="Lever effort arm in metres"
                  min={0.5}
                  max={6}
                  step={0.5}
                  value={state.effortArmM}
                  onChange={(e) => commit((p) => ({ ...p, effortArmM: Number(e.target.value) }))}
                  className="mt-1.5 w-full accent-indigo-600"
                />
              </label>
            )}
            {state.machineKind === 'pulley' && (
              <label className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800">
                Supporting strands: <span className="font-mono text-indigo-700">{state.supportingStrands}</span>
                <input
                  type="range"
                  aria-label="Pulley supporting rope strands"
                  min={1}
                  max={PHYSICS_LIMITS.maxPulleyStrands}
                  step={1}
                  value={state.supportingStrands}
                  onChange={(e) => commit((p) => ({ ...p, supportingStrands: Number(e.target.value) }))}
                  className="mt-1.5 w-full accent-indigo-600"
                />
              </label>
            )}
            {state.machineKind === 'inclined-plane' && (
              <label className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800">
                Plane length L: <span className="font-mono text-indigo-700">{state.planeLengthM} m</span> (h = {state.planeHeightM} m)
                <input
                  type="range"
                  aria-label="Inclined plane length in metres"
                  min={Math.max(1, state.planeHeightM)}
                  max={12}
                  step={0.5}
                  value={state.planeLengthM}
                  onChange={(e) => commit((p) => ({ ...p, planeLengthM: Number(e.target.value) }))}
                  className="mt-1.5 w-full accent-indigo-600"
                />
              </label>
            )}
          </div>

          <div className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:grid-cols-4">
            <div>VR = <strong className="font-mono">{machineRes.velocityRatio}</strong></div>
            <div>MA = <strong className="font-mono">{machineRes.mechanicalAdvantage}</strong></div>
            <div>Actual Effort = <strong className="font-mono">{machineRes.actualEffortN} N</strong> (Ideal: {machineRes.idealEffortN} N)</div>
            <div>Work Out / In = <strong className="font-mono">{machineRes.workOutputJ} / {machineRes.workInputJ} J</strong></div>
          </div>
        </div>
      )}
    </ConstructionLabShell>
  );
}
