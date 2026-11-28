'use client';

import React, { useMemo, useState } from 'react';
import type {
  GeometryCircleTheoremConfig,
  GeometryCompassConfig,
  GeometryConstructorConstructionConfig,
  GeometryCoordinateConfig,
  GeometryCubeNetConfig,
  GeometryLociRegionConfig,
  GeometryTransformationConfig,
} from '@/lib/narrated-lessons/interactive-schema';
import {
  GEOMETRY_LIMITS,
  computeCircleTheoremGeometry,
  computeCuboidMetrics,
  distance2D,
  evaluateCircleTheoremAnswer,
  evaluateCombinedLocus,
  evaluateCompassConstruction,
  evaluateCoordinateGeometry,
  evaluateCubeNet,
  evaluateTransformation,
  formatGradientLabel,
  intersectCircleCircle,
  intersectLineCircle,
  lineFromTwoPoints,
  midpoint2D,
  type GeoArc,
  type GeoPoint,
  type GeoSegment,
} from '@/lib/construction-lab/geometry-engine';
import { ConstructionLabShell } from './ConstructionLabShell';

type Point2D = { x: number; y: number };

const SVG_SIZE = 360;
const SVG_PAD = 32;
const PLOT_SIZE = SVG_SIZE - SVG_PAD * 2;

function snapToStep(val: number, step: number): number {
  const s = step > 0 ? step : 1;
  return Number((Math.round(val / s) * s).toFixed(4));
}

function createProjection(bounds: { xMin: number; xMax: number; yMin: number; yMax: number }) {
  const xSpan = Math.max(1, bounds.xMax - bounds.xMin);
  const ySpan = Math.max(1, bounds.yMax - bounds.yMin);
  const span = Math.max(xSpan, ySpan);
  const xMid = (bounds.xMin + bounds.xMax) / 2;
  const yMid = (bounds.yMin + bounds.yMax) / 2;
  const effXMin = xMid - span / 2;
  const effYMin = yMid - span / 2;
  const scale = PLOT_SIZE / span;

  return {
    scale,
    toSvgX: (x: number) => SVG_PAD + (x - effXMin) * scale,
    // Cartesian y-up -> SVG y-down
    toSvgY: (y: number) => SVG_SIZE - SVG_PAD - (y - effYMin) * scale,
    fromSvg: (svgX: number, svgY: number, step: number): Point2D => ({
      x: Math.max(bounds.xMin, Math.min(bounds.xMax, snapToStep(effXMin + (svgX - SVG_PAD) / scale, step))),
      y: Math.max(bounds.yMin, Math.min(bounds.yMax, snapToStep(effYMin + (SVG_SIZE - SVG_PAD - svgY) / scale, step))),
    }),
  };
}

function GridAxesSvg({
  bounds,
  proj,
}: {
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number; step?: number };
  proj: ReturnType<typeof createProjection>;
}) {
  const xTicks: number[] = [];
  const yTicks: number[] = [];
  const tickStep = Math.max(1, Math.ceil((bounds.xMax - bounds.xMin) / 10));
  for (let x = Math.ceil(bounds.xMin); x <= Math.floor(bounds.xMax); x += tickStep) xTicks.push(x);
  for (let y = Math.ceil(bounds.yMin); y <= Math.floor(bounds.yMax); y += tickStep) yTicks.push(y);

  const showXAxis = bounds.yMin <= 0 && bounds.yMax >= 0;
  const showYAxis = bounds.xMin <= 0 && bounds.xMax >= 0;

  return (
    <g aria-hidden="true">
      <rect x={SVG_PAD} y={SVG_PAD} width={PLOT_SIZE} height={PLOT_SIZE} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1} />
      {xTicks.map((x) => {
        const sx = proj.toSvgX(x);
        return (
          <g key={`gx-${x}`}>
            <line x1={sx} y1={SVG_PAD} x2={sx} y2={SVG_SIZE - SVG_PAD} stroke="#e2e8f0" strokeWidth={1} />
            <text x={sx} y={SVG_SIZE - SVG_PAD + 14} textAnchor="middle" fontSize="9" fill="#64748b">
              {x}
            </text>
          </g>
        );
      })}
      {yTicks.map((y) => {
        const sy = proj.toSvgY(y);
        return (
          <g key={`gy-${y}`}>
            <line x1={SVG_PAD} y1={sy} x2={SVG_SIZE - SVG_PAD} y2={sy} stroke="#e2e8f0" strokeWidth={1} />
            <text x={SVG_PAD - 8} y={sy + 3} textAnchor="end" fontSize="9" fill="#64748b">
              {y}
            </text>
          </g>
        );
      })}
      {showXAxis && (
        <line
          x1={SVG_PAD}
          y1={proj.toSvgY(0)}
          x2={SVG_SIZE - SVG_PAD}
          y2={proj.toSvgY(0)}
          stroke="#475569"
          strokeWidth={1.5}
        />
      )}
      {showYAxis && (
        <line
          x1={proj.toSvgX(0)}
          y1={SVG_PAD}
          x2={proj.toSvgX(0)}
          y2={SVG_SIZE - SVG_PAD}
          stroke="#475569"
          strokeWidth={1.5}
        />
      )}
    </g>
  );
}

/* ========================================================================== */
/* MODE 1: COMPASS & STRAIGHTEDGE                                             */
/* ========================================================================== */

interface CompassState {
  points: GeoPoint[];
  segments: GeoSegment[];
  arcs: GeoArc[];
}

function CompassWorkbench({ config }: { config: GeometryCompassConfig }) {
  const step = config.gridBounds.step ?? 1;
  const proj = useMemo(() => createProjection(config.gridBounds), [config.gridBounds]);
  const initialState: CompassState = useMemo(
    () => ({
      points: config.initialPoints.map((p) => ({ ...p, locked: true })),
      segments: (config.initialSegments ?? []).map((s) => ({ ...s, locked: true })),
      arcs: [],
    }),
    [config.initialPoints, config.initialSegments],
  );

  const [state, setState] = useState<CompassState>(initialState);
  const [history, setHistory] = useState<CompassState[]>([]);
  const [feedback, setFeedback] = useState<{ passed: boolean; message: string } | null>(null);

  const [newX, setNewX] = useState<string>('0');
  const [newY, setNewY] = useState<string>('0');
  const [segFrom, setSegFrom] = useState<string>(initialState.points[0]?.id ?? '');
  const [segTo, setSegTo] = useState<string>(initialState.points[1]?.id ?? initialState.points[0]?.id ?? '');
  const [arcCentre, setArcCentre] = useState<string>(initialState.points[0]?.id ?? '');
  const [arcRadius, setArcRadius] = useState<string>('4');

  // Step 5E-B: Interactive Virtual Protractor tool (distinct from pure compass construction)
  const [showProtractor, setShowProtractor] = useState<boolean>(config.constructionGoal.kind === 'protractor-angle');
  const [protVertex, setProtVertex] = useState<string>(initialState.points[0]?.id ?? '');
  const [protBase, setProtBase] = useState<string>(initialState.points[1]?.id ?? initialState.points[0]?.id ?? '');
  const [protAngleDeg, setProtAngleDeg] = useState<number>(
    config.constructionGoal.kind === 'protractor-angle' && config.constructionGoal.targetMeasures?.[0]
      ? Math.max(1, Math.min(179, Math.round(config.constructionGoal.targetMeasures[0])))
      : 60,
  );
  const [protDirection, setProtDirection] = useState<'ccw' | 'cw'>('ccw');
  const [protLength, setProtLength] = useState<string>('4');

  const commit = (next: CompassState) => {
    setHistory((h) => [...h.slice(-24), state]);
    setState(next);
    setFeedback(null);
  };

  const addPoint = (x: number, y: number) => {
    if (state.points.length >= GEOMETRY_LIMITS.maxPoints) return;
    const idx = state.points.length + 1;
    const id = `P${idx}`;
    commit({
      ...state,
      points: [...state.points, { id, label: id, x, y }],
    });
  };

  const addSegment = () => {
    if (!segFrom || !segTo || segFrom === segTo || state.segments.length >= GEOMETRY_LIMITS.maxSegments) return;
    commit({
      ...state,
      segments: [...state.segments, { id: `S${state.segments.length + 1}`, from: segFrom, to: segTo }],
    });
  };

  const addArc = () => {
    const r = Number(arcRadius);
    if (!arcCentre || !Number.isFinite(r) || r <= 0 || state.arcs.length >= GEOMETRY_LIMITS.maxArcs) return;
    commit({
      ...state,
      arcs: [...state.arcs, { id: `C${state.arcs.length + 1}`, centreId: arcCentre, radius: r }],
    });
  };

  const plotProtractorRay = () => {
    const ptLookup = new Map(state.points.map((p) => [p.id, p]));
    const vPt = ptLookup.get(protVertex);
    const bPt = ptLookup.get(protBase);
    const len = Number(protLength);
    if (!vPt || !bPt || vPt.id === bPt.id || !Number.isFinite(len) || len <= 0) return;
    if (state.points.length >= GEOMETRY_LIMITS.maxPoints || state.segments.length >= GEOMETRY_LIMITS.maxSegments) return;
    const baseAngleRad = Math.atan2(bPt.y - vPt.y, bPt.x - vPt.x);
    const deltaRad = ((protDirection === 'ccw' ? 1 : -1) * protAngleDeg * Math.PI) / 180;
    const rx = Number((vPt.x + len * Math.cos(baseAngleRad + deltaRad)).toFixed(3));
    const ry = Number((vPt.y + len * Math.sin(baseAngleRad + deltaRad)).toFixed(3));
    const newId = `R${state.points.length + 1}`;
    commit({
      ...state,
      points: [...state.points, { id: newId, label: newId, x: rx, y: ry }],
      segments: [...state.segments, { id: `S${state.segments.length + 1}`, from: vPt.id, to: newId }],
    });
  };

  const markIntersections = () => {
    const ptMap = new Map(state.points.map((p) => [p.id, p]));
    const discovered: Point2D[] = [];
    for (let i = 0; i < state.arcs.length; i++) {
      for (let j = i + 1; j < state.arcs.length; j++) {
        const c1 = ptMap.get(state.arcs[i].centreId);
        const c2 = ptMap.get(state.arcs[j].centreId);
        if (!c1 || !c2) continue;
        const inter = intersectCircleCircle(c1, state.arcs[i].radius, c2, state.arcs[j].radius);
        if (inter.status === 'two' || inter.status === 'tangent') {
          discovered.push(...inter.points);
        }
      }
    }
    for (const seg of state.segments) {
      const p1 = ptMap.get(seg.from);
      const p2 = ptMap.get(seg.to);
      if (!p1 || !p2) continue;
      const line = lineFromTwoPoints(p1, p2);
      if (!line) continue;
      for (const arc of state.arcs) {
        const c = ptMap.get(arc.centreId);
        if (!c) continue;
        const inter = intersectLineCircle(line, c, arc.radius);
        if (inter.status === 'two' || inter.status === 'tangent') {
          discovered.push(...inter.points);
        }
      }
    }
    const nextPoints = [...state.points];
    for (const dp of discovered) {
      if (nextPoints.length >= GEOMETRY_LIMITS.maxPoints) break;
      const exists = nextPoints.some((p) => distance2D(p, dp) < 0.05);
      if (!exists) {
        const id = `I${nextPoints.length + 1}`;
        nextPoints.push({
          id,
          label: id,
          x: Number(dp.x.toFixed(3)),
          y: Number(dp.y.toFixed(3)),
        });
      }
    }
    if (nextPoints.length > state.points.length) {
      commit({ ...state, points: nextPoints });
    }
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const svgX = ((e.clientX - rect.left) / rect.width) * SVG_SIZE;
    const svgY = ((e.clientY - rect.top) / rect.height) * SVG_SIZE;
    const pt = proj.fromSvg(svgX, svgY, step);
    addPoint(pt.x, pt.y);
  };

  const ptMap = new Map(state.points.map((p) => [p.id, p]));

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Geometry · Compass & Straightedge'}
      modelNote={config.modelNote}
      hints={config.hints}
      prediction={config.prediction}
      canUndo={history.length > 0}
      onUndo={() => {
        const prev = history[history.length - 1];
        if (prev) {
          setState(prev);
          setHistory((h) => h.slice(0, -1));
          setFeedback(null);
        }
      }}
      onReset={() => {
        setState(initialState);
        setHistory([]);
        setFeedback(null);
      }}
      onCheck={() => {
        const res = evaluateCompassConstruction({
          goal: config.constructionGoal,
          points: state.points,
          segments: state.segments,
          arcs: state.arcs,
        });
        setFeedback({
          passed: res.passed,
          message: res.passed && config.successExplanation ? `${res.feedback} ${config.successExplanation}` : res.feedback,
        });
      }}
      feedback={feedback}
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,360px)_1fr]">
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`${config.title} geometric canvas`}
          onClick={handleSvgClick}
          className="w-full max-w-[360px] cursor-crosshair rounded-xl border border-slate-200 bg-white"
        >
          <GridAxesSvg bounds={config.gridBounds} proj={proj} />
          {state.arcs.map((arc, idx) => {
            const c = ptMap.get(arc.centreId);
            if (!c) return null;
            return (
              <circle
                key={arc.id ?? `arc-${idx}`}
                cx={proj.toSvgX(c.x)}
                cy={proj.toSvgY(c.y)}
                r={arc.radius * proj.scale}
                fill="none"
                stroke="#6366f1"
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
            );
          })}
          {state.segments.map((seg, idx) => {
            const p1 = ptMap.get(seg.from);
            const p2 = ptMap.get(seg.to);
            if (!p1 || !p2) return null;
            return (
              <line
                key={seg.id ?? `seg-${idx}`}
                x1={proj.toSvgX(p1.x)}
                y1={proj.toSvgY(p1.y)}
                x2={proj.toSvgX(p2.x)}
                y2={proj.toSvgY(p2.y)}
                stroke={seg.locked ? '#0f172a' : '#059669'}
                strokeWidth={seg.locked ? 2.5 : 2}
              />
            );
          })}
          {state.points.map((pt) => (
            <g key={pt.id}>
              <circle
                cx={proj.toSvgX(pt.x)}
                cy={proj.toSvgY(pt.y)}
                r={4.5}
                fill={pt.locked ? '#1e293b' : '#059669'}
                stroke="#ffffff"
                strokeWidth={1.5}
              />
              <text
                x={proj.toSvgX(pt.x) + 7}
                y={proj.toSvgY(pt.y) - 6}
                fontSize="11"
                fontWeight="bold"
                fill="#0f172a"
              >
                {pt.label}
              </text>
            </g>
          ))}
          {showProtractor && (() => {
            const vPt = ptMap.get(protVertex);
            const bPt = ptMap.get(protBase);
            if (!vPt || !bPt || vPt.id === bPt.id) return null;
            const vx = proj.toSvgX(vPt.x);
            const vy = proj.toSvgY(vPt.y);
            const baseRad = Math.atan2(bPt.y - vPt.y, bPt.x - vPt.x);
            const prR = 64;
            const dir = protDirection === 'ccw' ? 1 : -1;
            const rayRad = baseRad + (dir * protAngleDeg * Math.PI) / 180;
            const arcPts: string[] = [];
            for (let deg = 0; deg <= 180; deg += 10) {
              const a = baseRad + (dir * deg * Math.PI) / 180;
              arcPts.push(`${(vx + prR * Math.cos(a)).toFixed(1)},${(vy - prR * Math.sin(a)).toFixed(1)}`);
            }
            return (
              <g aria-label="Virtual protractor overlay" opacity={0.9}>
                <polyline
                  points={arcPts.join(' ')}
                  fill="rgba(245,158,11,0.12)"
                  stroke="#d97706"
                  strokeWidth={1.5}
                />
                <line
                  x1={vx}
                  y1={vy}
                  x2={vx + prR * Math.cos(baseRad)}
                  y2={vy - prR * Math.sin(baseRad)}
                  stroke="#b45309"
                  strokeWidth={1.2}
                  strokeDasharray="3 2"
                />
                <line
                  x1={vx}
                  y1={vy}
                  x2={vx + (prR + 12) * Math.cos(rayRad)}
                  y2={vy - (prR + 12) * Math.sin(rayRad)}
                  stroke="#b45309"
                  strokeWidth={2}
                />
                <text
                  x={vx + (prR + 16) * Math.cos(rayRad)}
                  y={vy - (prR + 16) * Math.sin(rayRad)}
                  fontSize="10"
                  fontWeight="bold"
                  fill="#92400e"
                >
                  {protAngleDeg}°
                </text>
              </g>
            );
          })()}
        </svg>

        <div className="space-y-3 text-xs">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="font-bold text-slate-800">1. Compass Arc / Circle Tool</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1">
                <span>Centre:</span>
                <select
                  aria-label="Compass centre point"
                  value={arcCentre}
                  onChange={(e) => setArcCentre(e.target.value)}
                  className="min-h-[44px] rounded-lg border border-slate-300 bg-white px-2"
                >
                  {state.points.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} ({p.x}, {p.y})
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-1">
                <span>Radius:</span>
                <input
                  type="number"
                  step={step}
                  aria-label="Compass radius"
                  value={arcRadius}
                  onChange={(e) => setArcRadius(e.target.value)}
                  className="min-h-[44px] w-20 rounded-lg border border-slate-300 bg-white px-2"
                />
              </label>
              <button
                type="button"
                onClick={addArc}
                className="min-h-[44px] rounded-lg bg-indigo-600 px-3 font-bold text-white hover:bg-indigo-700"
              >
                Draw Arc
              </button>
              <button
                type="button"
                onClick={markIntersections}
                className="min-h-[44px] rounded-lg border border-indigo-300 bg-indigo-50 px-3 font-bold text-indigo-800 hover:bg-indigo-100"
              >
                Mark Intersections
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="font-bold text-slate-800">2. Straightedge Segment Tool</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <select
                aria-label="Segment start point"
                value={segFrom}
                onChange={(e) => setSegFrom(e.target.value)}
                className="min-h-[44px] rounded-lg border border-slate-300 bg-white px-2"
              >
                {state.points.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <span>to</span>
              <select
                aria-label="Segment end point"
                value={segTo}
                onChange={(e) => setSegTo(e.target.value)}
                className="min-h-[44px] rounded-lg border border-slate-300 bg-white px-2"
              >
                {state.points.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addSegment}
                className="min-h-[44px] rounded-lg bg-emerald-600 px-3 font-bold text-white hover:bg-emerald-700"
              >
                Connect Segment
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="font-bold text-slate-800">3. Place Point (click canvas or enter coordinates)</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1">
                <span>x:</span>
                <input
                  type="number"
                  step={step}
                  aria-label="New point x coordinate"
                  value={newX}
                  onChange={(e) => setNewX(e.target.value)}
                  className="min-h-[44px] w-20 rounded-lg border border-slate-300 bg-white px-2"
                />
              </label>
              <label className="flex items-center gap-1">
                <span>y:</span>
                <input
                  type="number"
                  step={step}
                  aria-label="New point y coordinate"
                  value={newY}
                  onChange={(e) => setNewY(e.target.value)}
                  className="min-h-[44px] w-20 rounded-lg border border-slate-300 bg-white px-2"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  const x = Number(newX);
                  const y = Number(newY);
                  if (Number.isFinite(x) && Number.isFinite(y)) addPoint(x, y);
                }}
                className="min-h-[44px] rounded-lg border border-slate-300 bg-white px-3 font-bold text-slate-800 hover:bg-slate-100"
              >
                Add Point
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-amber-950">4. Virtual Protractor Tool (Measurement Mode)</p>
              <button
                type="button"
                onClick={() => setShowProtractor((s) => !s)}
                aria-pressed={showProtractor}
                className="min-h-[44px] rounded-lg border border-amber-300 bg-white px-3 font-bold text-amber-900 hover:bg-amber-100"
              >
                {showProtractor ? 'Hide Protractor' : 'Show Protractor'}
              </button>
            </div>
            {showProtractor && (
              <div className="mt-2 space-y-2">
                <p className="text-[11px] text-amber-900">
                  Virtual protractor measurement is distinct from pure straightedge-and-compass construction.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-1">
                    <span>Vertex:</span>
                    <select
                      aria-label="Protractor vertex point"
                      value={protVertex}
                      onChange={(e) => setProtVertex(e.target.value)}
                      className="min-h-[44px] rounded-lg border border-amber-300 bg-white px-2"
                    >
                      {state.points.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-1">
                    <span>Baseline:</span>
                    <select
                      aria-label="Protractor baseline point"
                      value={protBase}
                      onChange={(e) => setProtBase(e.target.value)}
                      className="min-h-[44px] rounded-lg border border-amber-300 bg-white px-2"
                    >
                      {state.points.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-1">
                    <span>Angle (°):</span>
                    <input
                      type="number"
                      min={1}
                      max={179}
                      aria-label="Protractor angle in degrees"
                      value={protAngleDeg}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (Number.isFinite(v)) setProtAngleDeg(Math.max(1, Math.min(179, v)));
                      }}
                      className="min-h-[44px] w-20 rounded-lg border border-amber-300 bg-white px-2"
                    />
                  </label>
                  <label className="flex items-center gap-1">
                    <span>Ray len:</span>
                    <input
                      type="number"
                      step={step}
                      aria-label="Protractor ray length"
                      value={protLength}
                      onChange={(e) => setProtLength(e.target.value)}
                      className="min-h-[44px] w-16 rounded-lg border border-amber-300 bg-white px-2"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setProtDirection((d) => (d === 'ccw' ? 'cw' : 'ccw'))}
                    className="min-h-[44px] rounded-lg border border-amber-300 bg-white px-2.5 font-bold text-amber-900 hover:bg-amber-100"
                  >
                    {protDirection === 'ccw' ? 'Anticlockwise (+)' : 'Clockwise (−)'}
                  </button>
                  <button
                    type="button"
                    onClick={plotProtractorRay}
                    className="min-h-[44px] rounded-lg bg-amber-800 px-3 font-bold text-white hover:bg-amber-900"
                  >
                    Plot Protractor Ray
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConstructionLabShell>
  );
}

/* ========================================================================== */
/* MODE 2: TRANSFORMATIONS                                                    */
/* ========================================================================== */

function TransformationsWorkbench({ config }: { config: GeometryTransformationConfig }) {
  const step = config.gridBounds.step ?? 1;
  const proj = useMemo(() => createProjection(config.gridBounds), [config.gridBounds]);
  const initialImage = useMemo<Point2D[]>(
    () => config.preImageVertices.map((v) => ({ x: v.x, y: v.y })),
    [config.preImageVertices],
  );

  const [imageVertices, setImageVertices] = useState<Point2D[]>(initialImage);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [history, setHistory] = useState<Point2D[][]>([]);
  const [feedback, setFeedback] = useState<{ passed: boolean; message: string } | null>(null);

  const updateVertex = (idx: number, pt: Point2D) => {
    setHistory((h) => [...h.slice(-24), imageVertices]);
    setImageVertices((prev) => prev.map((v, i) => (i === idx ? pt : v)));
    setFeedback(null);
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const svgX = ((e.clientX - rect.left) / rect.width) * SVG_SIZE;
    const svgY = ((e.clientY - rect.top) / rect.height) * SVG_SIZE;
    const pt = proj.fromSvg(svgX, svgY, step);
    updateVertex(selectedIdx, pt);
    setSelectedIdx((i) => (i + 1) % imageVertices.length);
  };

  const prePointsStr = config.preImageVertices.map((v) => `${proj.toSvgX(v.x)},${proj.toSvgY(v.y)}`).join(' ');
  const imgPointsStr = imageVertices.map((v) => `${proj.toSvgX(v.x)},${proj.toSvgY(v.y)}`).join(' ');

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Geometry · Transformations'}
      modelNote={config.modelNote}
      hints={config.hints}
      prediction={config.prediction}
      canUndo={history.length > 0}
      onUndo={() => {
        const prev = history[history.length - 1];
        if (prev) {
          setImageVertices(prev);
          setHistory((h) => h.slice(0, -1));
          setFeedback(null);
        }
      }}
      onReset={() => {
        setImageVertices(initialImage);
        setHistory([]);
        setSelectedIdx(0);
        setFeedback(null);
      }}
      onCheck={() => {
        const res = evaluateTransformation({
          preImageVertices: config.preImageVertices,
          transformation: config.transformation,
          learnerVertices: imageVertices,
          requireLabelledCorrespondence: config.requireLabelledCorrespondence ?? true,
        });
        setFeedback({
          passed: res.passed,
          message: res.passed && config.successExplanation ? `${res.feedback} ${config.successExplanation}` : res.feedback,
        });
      }}
      feedback={feedback}
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,360px)_1fr]">
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`${config.title} transformation grid`}
          onClick={handleSvgClick}
          className="w-full max-w-[360px] cursor-crosshair rounded-xl border border-slate-200 bg-white"
        >
          <GridAxesSvg bounds={config.gridBounds} proj={proj} />
          <polygon points={prePointsStr} fill="rgba(99,102,241,0.15)" stroke="#4f46e5" strokeWidth={2} />
          <polygon points={imgPointsStr} fill="rgba(16,185,129,0.2)" stroke="#059669" strokeWidth={2} strokeDasharray="5 3" />
          {(config.transformation.kind === 'rotation' || config.transformation.kind === 'enlargement') && (
            <circle
              cx={proj.toSvgX(config.transformation.cx)}
              cy={proj.toSvgY(config.transformation.cy)}
              r={5}
              fill="#e11d48"
              stroke="#fff"
              strokeWidth={1.5}
            />
          )}
          {config.preImageVertices.map((v, i) => (
            <text
              key={`pre-${i}`}
              x={proj.toSvgX(v.x) + 6}
              y={proj.toSvgY(v.y) - 5}
              fontSize="10"
              fontWeight="bold"
              fill="#4338ca"
            >
              {v.label ?? String.fromCharCode(65 + i)}
            </text>
          ))}
          {imageVertices.map((v, i) => (
            <g key={`img-${i}`}>
              <circle
                cx={proj.toSvgX(v.x)}
                cy={proj.toSvgY(v.y)}
                r={i === selectedIdx ? 6 : 4.5}
                fill={i === selectedIdx ? '#047857' : '#10b981'}
                stroke="#fff"
                strokeWidth={1.5}
              />
              <text
                x={proj.toSvgX(v.x) + 6}
                y={proj.toSvgY(v.y) + 12}
                fontSize="10"
                fontWeight="bold"
                fill="#047857"
              >
                {(config.preImageVertices[i]?.label ?? String.fromCharCode(65 + i)) + "'"}
              </text>
            </g>
          ))}
        </svg>

        <div className="space-y-2 text-xs">
          <p className="font-bold text-slate-800">
            Set image vertices (click canvas or adjust coordinates, step = {step}):
          </p>
          {imageVertices.map((v, i) => {
            const label = `${config.preImageVertices[i]?.label ?? String.fromCharCode(65 + i)}'`;
            return (
              <div
                key={label}
                className={`flex flex-wrap items-center gap-2 rounded-xl border p-2 ${
                  selectedIdx === i ? 'border-emerald-400 bg-emerald-50/70' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedIdx(i)}
                  className="min-h-[44px] rounded-lg border border-emerald-200 bg-white px-2.5 font-extrabold text-emerald-800"
                >
                  {label}
                </button>
                <label className="flex items-center gap-1">
                  <span>x:</span>
                  <input
                    type="number"
                    step={step}
                    aria-label={`${label} x coordinate`}
                    value={v.x}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (Number.isFinite(val)) updateVertex(i, { ...v, x: val });
                    }}
                    className="min-h-[44px] w-20 rounded-lg border border-slate-300 bg-white px-2"
                  />
                </label>
                <label className="flex items-center gap-1">
                  <span>y:</span>
                  <input
                    type="number"
                    step={step}
                    aria-label={`${label} y coordinate`}
                    value={v.y}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (Number.isFinite(val)) updateVertex(i, { ...v, y: val });
                    }}
                    className="min-h-[44px] w-20 rounded-lg border border-slate-300 bg-white px-2"
                  />
                </label>
              </div>
            );
          })}
          {(() => {
            const perim = (pts: ReadonlyArray<Point2D>) =>
              pts.reduce((acc, p, i) => acc + distance2D(p, pts[(i + 1) % pts.length]), 0);
            const preP = perim(config.preImageVertices);
            const imgP = perim(imageVertices);
            const ratio = preP > 1e-6 ? imgP / preP : 1;
            const isIsometry = config.transformation.kind !== 'enlargement';
            return (
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-2.5 text-[11px] text-indigo-950">
                <p className="font-bold">Congruence &amp; Similarity Readout</p>
                <p>
                  Pre-image perimeter: {preP.toFixed(2)} · Image perimeter: {imgP.toFixed(2)} · Ratio: {ratio.toFixed(2)}×
                </p>
                <p>
                  {isIsometry
                    ? 'Rigid isometry (congruent image: side lengths and angles preserved, ratio = 1.00×).'
                    : `Similarity enlargement (scale factor k = ${config.transformation.scaleFactor}; side lengths scale by |k| = ${Math.abs(config.transformation.scaleFactor)}×).`}
                </p>
              </div>
            );
          })()}
        </div>
      </div>
    </ConstructionLabShell>
  );
}

/* ========================================================================== */
/* MODE 3: COORDINATE GEOMETRY                                                */
/* ========================================================================== */

function CoordinateWorkbench({ config }: { config: GeometryCoordinateConfig }) {
  const step = config.gridBounds.step ?? 1;
  const proj = useMemo(() => createProjection(config.gridBounds), [config.gridBounds]);
  const isSinglePoint = config.coordGoal.kind === 'midpoint';
  const initialPts: Point2D[] = isSinglePoint
    ? [{ x: 0, y: 0 }]
    : [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
      ];

  const [pts, setPts] = useState<Point2D[]>(initialPts);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [history, setHistory] = useState<Point2D[][]>([]);
  const [feedback, setFeedback] = useState<{ passed: boolean; message: string } | null>(null);

  const updatePt = (idx: number, nextPt: Point2D) => {
    setHistory((h) => [...h.slice(-24), pts]);
    setPts((prev) => prev.map((p, i) => (i === idx ? nextPt : p)));
    setFeedback(null);
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const svgX = ((e.clientX - rect.left) / rect.width) * SVG_SIZE;
    const svgY = ((e.clientY - rect.top) / rect.height) * SVG_SIZE;
    const pt = proj.fromSvg(svgX, svgY, step);
    updatePt(selectedIdx, pt);
    if (!isSinglePoint) setSelectedIdx((i) => (i + 1) % 2);
  };

  const given = config.coordGoal.givenPoints;
  const liveMid = pts.length >= 2 ? midpoint2D(pts[0], pts[1]) : null;
  const liveGrad = pts.length >= 2 ? formatGradientLabel(pts[0], pts[1]) : null;

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Geometry · Coordinate Plane'}
      modelNote={config.modelNote}
      hints={config.hints}
      prediction={config.prediction}
      canUndo={history.length > 0}
      onUndo={() => {
        const prev = history[history.length - 1];
        if (prev) {
          setPts(prev);
          setHistory((h) => h.slice(0, -1));
          setFeedback(null);
        }
      }}
      onReset={() => {
        setPts(initialPts);
        setHistory([]);
        setSelectedIdx(0);
        setFeedback(null);
      }}
      onCheck={() => {
        const res = evaluateCoordinateGeometry({ goal: config.coordGoal, learnerPoints: pts });
        setFeedback({
          passed: res.passed,
          message: res.passed && config.successExplanation ? `${res.feedback} ${config.successExplanation}` : res.feedback,
        });
      }}
      feedback={feedback}
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,360px)_1fr]">
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`${config.title} coordinate plane`}
          onClick={handleSvgClick}
          className="w-full max-w-[360px] cursor-crosshair rounded-xl border border-slate-200 bg-white"
        >
          <GridAxesSvg bounds={config.gridBounds} proj={proj} />
          {given.length >= 2 && (
            <line
              x1={proj.toSvgX(given[0].x)}
              y1={proj.toSvgY(given[0].y)}
              x2={proj.toSvgX(given[1].x)}
              y2={proj.toSvgY(given[1].y)}
              stroke="#4f46e5"
              strokeWidth={2.5}
            />
          )}
          {given.map((p, i) => (
            <g key={`given-${i}`}>
              <circle cx={proj.toSvgX(p.x)} cy={proj.toSvgY(p.y)} r={5} fill="#4f46e5" stroke="#fff" strokeWidth={1.5} />
              <text x={proj.toSvgX(p.x) + 7} y={proj.toSvgY(p.y) - 6} fontSize="10" fontWeight="bold" fill="#312e81">
                {p.label ?? `G${i + 1}`}({p.x},{p.y})
              </text>
            </g>
          ))}
          {!isSinglePoint && pts.length >= 2 && (
            <line
              x1={proj.toSvgX(pts[0].x)}
              y1={proj.toSvgY(pts[0].y)}
              x2={proj.toSvgX(pts[1].x)}
              y2={proj.toSvgY(pts[1].y)}
              stroke="#059669"
              strokeWidth={2.5}
            />
          )}
          {pts.map((p, i) => (
            <g key={`user-${i}`}>
              <circle
                cx={proj.toSvgX(p.x)}
                cy={proj.toSvgY(p.y)}
                r={5.5}
                fill="#059669"
                stroke="#fff"
                strokeWidth={1.5}
              />
              <text x={proj.toSvgX(p.x) + 7} y={proj.toSvgY(p.y) + 12} fontSize="10" fontWeight="bold" fill="#065f46">
                {isSinglePoint ? 'M' : `P${i + 1}`}({p.x},{p.y})
              </text>
            </g>
          ))}
        </svg>

        <div className="space-y-3 text-xs">
          {pts.map((p, i) => {
            const lbl = isSinglePoint ? 'Midpoint M' : `Line Point P${i + 1}`;
            return (
              <div key={lbl} className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedIdx(i)}
                  className="min-h-[44px] rounded-lg border border-emerald-300 bg-white px-2.5 font-bold text-emerald-800"
                >
                  {lbl}
                </button>
                <label className="flex items-center gap-1">
                  <span>x:</span>
                  <input
                    type="number"
                    step={step}
                    aria-label={`${lbl} x coordinate`}
                    value={p.x}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (Number.isFinite(val)) updatePt(i, { ...p, x: val });
                    }}
                    className="min-h-[44px] w-20 rounded-lg border border-slate-300 bg-white px-2"
                  />
                </label>
                <label className="flex items-center gap-1">
                  <span>y:</span>
                  <input
                    type="number"
                    step={step}
                    aria-label={`${lbl} y coordinate`}
                    value={p.y}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (Number.isFinite(val)) updatePt(i, { ...p, y: val });
                    }}
                    className="min-h-[44px] w-20 rounded-lg border border-slate-300 bg-white px-2"
                  />
                </label>
              </div>
            );
          })}
          {liveGrad && liveMid && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 text-indigo-950">
              <p>
                <strong>Live line gradient:</strong> {liveGrad}
              </p>
              <p>
                <strong>Midpoint of P1P2:</strong> ({liveMid.x.toFixed(2)}, {liveMid.y.toFixed(2)})
              </p>
            </div>
          )}
        </div>
      </div>
    </ConstructionLabShell>
  );
}

/* ========================================================================== */
/* MODE 4: CIRCLE THEOREMS                                                    */
/* ========================================================================== */

function CircleTheoremWorkbench({ config }: { config: GeometryCircleTheoremConfig }) {
  const ct = config.circleTheorem;
  const [angleDeg, setAngleDeg] = useState<number>(ct.movablePointAngleDeg);
  const [answerInput, setAnswerInput] = useState<string>(
    ct.expectedAngleDeg !== undefined ? String(ct.expectedAngleDeg) : '',
  );
  const [history, setHistory] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ passed: boolean; message: string } | null>(null);

  const computed = useMemo(
    () => computeCircleTheoremGeometry(ct.theorem, ct.fixedAnglesDeg, angleDeg),
    [ct.theorem, ct.fixedAnglesDeg, angleDeg],
  );

  const setMovableAngle = (next: number) => {
    const norm = ((next % 360) + 360) % 360;
    setHistory((h) => [...h.slice(-24), angleDeg]);
    setAngleDeg(norm);
    setFeedback(null);
  };

  const cx = SVG_SIZE / 2;
  const cy = SVG_SIZE / 2;
  const maxNorm = Math.max(
    1,
    ...Object.values(computed.points).map((p) => Math.hypot(p.x, p.y)),
  );
  const R = maxNorm > 1.05 ? Math.floor(136 / maxNorm) : 122;
  const toSvg = (p: Point2D) => ({ x: cx + p.x * R, y: cy - p.y * R });

  const ptA = computed.points.A ? toSvg(computed.points.A) : null;
  const ptB = computed.points.B ? toSvg(computed.points.B) : null;
  const ptC = computed.points.C ? toSvg(computed.points.C) : null;
  const ptP = computed.points.P ? toSvg(computed.points.P) : null;
  const ptT = computed.points.T ? toSvg(computed.points.T) : null;
  const ptE = computed.points.E ? toSvg(computed.points.E) : null;
  const ptT1 = computed.points.T1 ? toSvg(computed.points.T1) : null;
  const ptT2 = computed.points.T2 ? toSvg(computed.points.T2) : null;
  const ptM = computed.points.M ? toSvg(computed.points.M) : null;

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Geometry · Circle Theorems'}
      modelNote={config.modelNote}
      hints={config.hints}
      prediction={config.prediction}
      canUndo={history.length > 0}
      onUndo={() => {
        const prev = history[history.length - 1];
        if (prev !== undefined) {
          setAngleDeg(prev);
          setHistory((h) => h.slice(0, -1));
          setFeedback(null);
        }
      }}
      onReset={() => {
        setAngleDeg(ct.movablePointAngleDeg);
        setHistory([]);
        setFeedback(null);
      }}
      onCheck={() => {
        const userAns = Number(answerInput);
        if (!Number.isFinite(userAns)) {
          setFeedback({ passed: false, message: 'Enter a numeric angle in degrees before checking.' });
          return;
        }
        const res = evaluateCircleTheoremAnswer({
          theorem: ct.theorem,
          fixedAnglesDeg: ct.fixedAnglesDeg,
          movableAngleDeg: angleDeg,
          learnerAnswerDeg: userAns,
          angleToleranceDeg: ct.angleToleranceDeg ?? 1.5,
        });
        setFeedback({
          passed: res.passed,
          message: res.passed && config.successExplanation ? `${res.feedback} ${config.successExplanation}` : res.feedback,
        });
      }}
      feedback={feedback}
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,360px)_1fr]">
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`${config.title} circle theorem diagram`}
          className="w-full max-w-[360px] rounded-xl border border-slate-200 bg-white"
        >
          <circle cx={cx} cy={cy} r={R} fill="#f8fafc" stroke="#334155" strokeWidth={2} />
          <circle cx={cx} cy={cy} r={4} fill="#0f172a" />
          <text x={cx + 7} y={cy - 6} fontSize="11" fontWeight="bold" fill="#0f172a">
            O
          </text>

          {ct.theorem === 'angle-at-centre' && ptA && ptB && ptP && (
            <>
              <line x1={cx} y1={cy} x2={ptA.x} y2={ptA.y} stroke="#4f46e5" strokeWidth={2} />
              <line x1={cx} y1={cy} x2={ptB.x} y2={ptB.y} stroke="#4f46e5" strokeWidth={2} />
              <line x1={ptP.x} y1={ptP.y} x2={ptA.x} y2={ptA.y} stroke="#059669" strokeWidth={2} />
              <line x1={ptP.x} y1={ptP.y} x2={ptB.x} y2={ptB.y} stroke="#059669" strokeWidth={2} />
            </>
          )}
          {(ct.theorem === 'semicircle-90' || ct.theorem === 'same-segment') && ptA && ptB && ptP && (
            <>
              <line x1={ptA.x} y1={ptA.y} x2={ptB.x} y2={ptB.y} stroke="#4f46e5" strokeWidth={2} />
              <line x1={ptP.x} y1={ptP.y} x2={ptA.x} y2={ptA.y} stroke="#059669" strokeWidth={2} />
              <line x1={ptP.x} y1={ptP.y} x2={ptB.x} y2={ptB.y} stroke="#059669" strokeWidth={2} />
            </>
          )}
          {ct.theorem === 'cyclic-quadrilateral' && ptA && ptB && ptC && ptP && (
            <polygon
              points={[ptA, ptC, ptB, ptP].map((p) => `${p.x},${p.y}`).join(' ')}
              fill="rgba(16,185,129,0.12)"
              stroke="#059669"
              strokeWidth={2}
            />
          )}
          {ct.theorem === 'tangent-radius' && ptA && ptT && (
            <>
              <line x1={cx} y1={cy} x2={ptA.x} y2={ptA.y} stroke="#4f46e5" strokeWidth={2.5} />
              <line x1={ptA.x} y1={ptA.y} x2={ptT.x} y2={ptT.y} stroke="#059669" strokeWidth={2.5} />
            </>
          )}
          {ct.theorem === 'alternate-segment' && ptA && ptB && ptP && ptT && (
            <g aria-label="Alternate segment theorem geometry">
              <line x1={cx} y1={cy} x2={ptA.x} y2={ptA.y} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" />
              <line
                x1={ptA.x - (ptT.x - ptA.x) * 0.75}
                y1={ptA.y - (ptT.y - ptA.y) * 0.75}
                x2={ptT.x}
                y2={ptT.y}
                stroke="#d97706"
                strokeWidth={2.5}
              />
              <line x1={ptA.x} y1={ptA.y} x2={ptB.x} y2={ptB.y} stroke="#4f46e5" strokeWidth={2.5} />
              <line x1={ptP.x} y1={ptP.y} x2={ptA.x} y2={ptA.y} stroke="#059669" strokeWidth={2} />
              <line x1={ptP.x} y1={ptP.y} x2={ptB.x} y2={ptB.y} stroke="#059669" strokeWidth={2} />
            </g>
          )}
          {ct.theorem === 'equal-tangents' && ptE && ptT1 && ptT2 && (
            <g aria-label="Equal tangents from external point geometry">
              <line x1={cx} y1={cy} x2={ptE.x} y2={ptE.y} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" />
              <line x1={cx} y1={cy} x2={ptT1.x} y2={ptT1.y} stroke="#4f46e5" strokeWidth={2} />
              <line x1={cx} y1={cy} x2={ptT2.x} y2={ptT2.y} stroke="#4f46e5" strokeWidth={2} />
              <line x1={ptE.x} y1={ptE.y} x2={ptT1.x} y2={ptT1.y} stroke="#059669" strokeWidth={2.5} />
              <line x1={ptE.x} y1={ptE.y} x2={ptT2.x} y2={ptT2.y} stroke="#059669" strokeWidth={2.5} />
            </g>
          )}
          {ct.theorem === 'chord-perp-bisector' && ptA && ptB && ptM && (
            <g aria-label="Chord perpendicular bisector geometry">
              <line x1={cx} y1={cy} x2={ptA.x} y2={ptA.y} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" />
              <line x1={cx} y1={cy} x2={ptB.x} y2={ptB.y} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" />
              <line x1={ptA.x} y1={ptA.y} x2={ptB.x} y2={ptB.y} stroke="#4f46e5" strokeWidth={2.5} />
              <line x1={cx} y1={cy} x2={ptM.x} y2={ptM.y} stroke="#059669" strokeWidth={2.5} />
              <rect x={ptM.x - 4} y={ptM.y - 4} width={8} height={8} fill="none" stroke="#059669" strokeWidth={1.5} />
            </g>
          )}

          {Object.entries(computed.points)
            .filter(([k]) => k !== 'O')
            .map(([k, p]) => {
              const sp = toSvg(p);
              const isMovable = k === 'P';
              return (
                <g key={`cp-${k}`}>
                  <circle
                    cx={sp.x}
                    cy={sp.y}
                    r={isMovable ? 6 : 5}
                    fill={isMovable ? '#059669' : '#4f46e5'}
                    stroke="#fff"
                    strokeWidth={1.5}
                  />
                  <text
                    x={sp.x + 8}
                    y={sp.y - 5}
                    fontSize="11"
                    fontWeight="bold"
                    fill={isMovable ? '#065f46' : '#312e81'}
                  >
                    {k}
                  </text>
                </g>
              );
            })}
        </svg>

        <div className="space-y-3 text-xs">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <label className="block font-bold text-slate-800">
              Move point P around circumference: {angleDeg}°
              <input
                type="range"
                min={0}
                max={359}
                step={1}
                value={angleDeg}
                onChange={(e) => setMovableAngle(Number(e.target.value))}
                className="mt-2 min-h-[44px] w-full"
              />
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[-15, -5, 5, 15].map((delta) => (
                <button
                  key={delta}
                  type="button"
                  onClick={() => setMovableAngle(angleDeg + delta)}
                  className="min-h-[44px] rounded-lg border border-slate-300 bg-white px-3 font-bold text-slate-700 hover:bg-slate-100"
                >
                  {delta > 0 ? `+${delta}°` : `${delta}°`}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`rounded-xl border p-3 ${
              computed.validDomain
                ? 'border-indigo-200 bg-indigo-50/70 text-indigo-950'
                : 'border-amber-300 bg-amber-50 text-amber-950'
            }`}
          >
            <p>
              <strong>Live derived angle:</strong> {computed.measuredAngleDeg}° (Paired{' '}
              {computed.isReflexCentral ? 'reflex ' : ''}angle: {computed.relatedAngleDeg}°)
            </p>
            {!computed.validDomain && computed.domainWarning && (
              <p className="mt-1 font-bold text-amber-900">{computed.domainWarning}</p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="font-bold text-slate-800">{ct.targetPrompt}</p>
            <label className="mt-2 flex items-center gap-2">
              <span>Your angle (°):</span>
              <input
                type="number"
                step="0.5"
                aria-label="Deduced angle in degrees"
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                className="min-h-[44px] w-24 rounded-lg border border-slate-300 bg-white px-2"
              />
            </label>
          </div>
        </div>
      </div>
    </ConstructionLabShell>
  );
}

/* ========================================================================== */
/* MODE 5 (Step 5E): CUBE NETS & 3D GEOMETRY                                  */
/* ========================================================================== */

function CubeNetWorkbench({ config }: { config: GeometryCubeNetConfig }) {
  const [cells, setCells] = useState<Array<{ r: number; c: number }>>(config.initialCells ?? []);
  const [history, setHistory] = useState<Array<Array<{ r: number; c: number }>>>([]);
  const [status, setStatus] = useState<{ passed: boolean; feedback: string; faceMap?: Record<string, string> } | null>(null);

  const toggleCell = (r: number, c: number) => {
    setStatus(null);
    setHistory((h) => [...h.slice(-24), cells]);
    setCells((prev) => {
      const exists = prev.some((p) => p.r === r && p.c === c);
      if (exists) return prev.filter((p) => !(p.r === r && p.c === c));
      if (prev.length >= 12) return prev;
      return [...prev, { r, c }];
    });
  };

  const handleCheck = () => {
    const res = evaluateCubeNet(cells);
    setStatus({ passed: res.valid, feedback: res.reason, faceMap: res.foldedFaceMap });
  };

  const handleReset = () => {
    setCells(config.initialCells ?? []);
    setHistory([]);
    setStatus(null);
  };

  const metrics = config.cuboidDimensions
    ? computeCuboidMetrics(
        config.cuboidDimensions.length,
        config.cuboidDimensions.width,
        config.cuboidDimensions.height,
      )
    : null;

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag}
      hints={config.hints}
      canUndo={history.length > 0}
      onUndo={() => {
        const prev = history[history.length - 1];
        if (prev) {
          setCells(prev);
          setHistory((h) => h.slice(0, -1));
          setStatus(null);
        }
      }}
      onReset={handleReset}
      onCheck={handleCheck}
      checkLabel="Test 3D Foldability"
      feedback={status ? { passed: status.passed, message: status.feedback } : null}
    >
      <div className="space-y-3 text-xs">
        <p className="font-semibold text-slate-700">
          Select exactly 6 edge-connected squares ({cells.length}/6 selected) to form a valid cube net:
        </p>
        <div className="grid w-fit grid-cols-6 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-2">
          {Array.from({ length: 36 }).map((_, idx) => {
            const r = Math.floor(idx / 6);
            const c = idx % 6;
            const active = cells.some((p) => p.r === r && p.c === c);
            const faceTag = status?.faceMap?.[`${r},${c}`];
            const shortFace = faceTag ? faceTag.slice(0, 1).toUpperCase() : '■';
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                aria-pressed={active}
                aria-label={`Grid cell row ${r + 1} col ${c + 1}${faceTag ? ` (${faceTag} face)` : ''}`}
                onClick={() => toggleCell(r, c)}
                className={`h-11 w-11 rounded-lg border text-[11px] font-bold transition ${
                  active
                    ? 'border-indigo-700 bg-indigo-700 text-white'
                    : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {active ? shortFace : ''}
              </button>
            );
          })}
        </div>
        {status?.passed && (
          <p className="text-[11px] font-medium text-indigo-800">
            Folded face labels: B = bottom, T = top, N = north, S = south, E = east, W = west.
          </p>
        )}
        {metrics && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-[11px] text-slate-700">
            <strong>Cuboid Reference ({config.cuboidDimensions!.length} × {config.cuboidDimensions!.width} × {config.cuboidDimensions!.height}):</strong>{' '}
            {metrics.faces} faces, {metrics.edges} edges, {metrics.vertices} vertices · Surface Area = {metrics.surfaceArea} · Volume = {metrics.volume}.
          </div>
        )}
      </div>
    </ConstructionLabShell>
  );
}

/* ========================================================================== */
/* MODE 6 (Step 5E): LOCI & FEASIBLE REGIONS                                  */
/* ========================================================================== */

function LociRegionWorkbench({ config }: { config: GeometryLociRegionConfig }) {
  const step = config.gridBounds.step ?? 0.5;
  const proj = useMemo(() => createProjection(config.gridBounds), [config.gridBounds]);
  const [px, setPx] = useState<string>('0');
  const [py, setPy] = useState<string>('0');
  const [history, setHistory] = useState<Array<{ x: string; y: string }>>([]);
  const [status, setStatus] = useState<{ passed: boolean; feedback: string } | null>(null);

  const hasInequality = useMemo(
    () =>
      config.locusConstraints.some(
        (c) =>
          ('relation' in c && c.relation !== 'eq'),
      ),
    [config.locusConstraints],
  );

  // Sample a deterministic 22x22 grid to shade feasible regions when inequality constraints exist
  const shadedCells = useMemo(() => {
    if (!hasInequality) return [];
    const N = 22;
    const dx = (config.gridBounds.xMax - config.gridBounds.xMin) / N;
    const dy = (config.gridBounds.yMax - config.gridBounds.yMin) / N;
    const cells: Array<{ sx: number; sy: number; w: number; h: number }> = [];
    const cellW = Math.abs(proj.toSvgX(config.gridBounds.xMin + dx) - proj.toSvgX(config.gridBounds.xMin));
    const cellH = Math.abs(proj.toSvgY(config.gridBounds.yMin) - proj.toSvgY(config.gridBounds.yMin + dy));
    for (let ix = 0; ix < N; ix++) {
      const cxVal = config.gridBounds.xMin + (ix + 0.5) * dx;
      for (let iy = 0; iy < N; iy++) {
        const cyVal = config.gridBounds.yMin + (iy + 0.5) * dy;
        if (evaluateCombinedLocus(config.locusConstraints, { x: cxVal, y: cyVal }, 0.05).passed) {
          cells.push({
            sx: proj.toSvgX(config.gridBounds.xMin + ix * dx),
            sy: proj.toSvgY(config.gridBounds.yMin + (iy + 1) * dy),
            w: cellW + 0.6,
            h: cellH + 0.6,
          });
        }
      }
    }
    return cells;
  }, [config.gridBounds, config.locusConstraints, hasInequality, proj]);

  const setPoint = (nx: string, ny: string) => {
    setHistory((h) => [...h.slice(-24), { x: px, y: py }]);
    setPx(nx);
    setPy(ny);
    setStatus(null);
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const svgX = ((e.clientX - rect.left) / rect.width) * SVG_SIZE;
    const svgY = ((e.clientY - rect.top) / rect.height) * SVG_SIZE;
    const pt = proj.fromSvg(svgX, svgY, step);
    setPoint(String(pt.x), String(pt.y));
  };

  const handleCheck = () => {
    const x = Number(px);
    const y = Number(py);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      setStatus({ passed: false, feedback: 'Enter finite x and y coordinates.' });
      return;
    }
    const res = evaluateCombinedLocus(config.locusConstraints, { x, y }, config.tolerance ?? 0.25);
    setStatus({ passed: res.passed, feedback: res.feedback });
  };

  const numX = Number(px);
  const numY = Number(py);
  const hasValidNum = Number.isFinite(numX) && Number.isFinite(numY);

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag}
      hints={config.hints}
      canUndo={history.length > 0}
      onUndo={() => {
        const prev = history[history.length - 1];
        if (prev) {
          setPx(prev.x);
          setPy(prev.y);
          setHistory((h) => h.slice(0, -1));
          setStatus(null);
        }
      }}
      onReset={() => {
        setPx('0');
        setPy('0');
        setHistory([]);
        setStatus(null);
      }}
      onCheck={handleCheck}
      checkLabel="Test Locus Point"
      feedback={status ? { passed: status.passed, message: status.feedback } : null}
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,360px)_1fr]">
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`${config.title} loci and feasible region plane`}
          onClick={handleSvgClick}
          className="w-full max-w-[360px] cursor-crosshair rounded-xl border border-slate-200 bg-white"
        >
          <GridAxesSvg bounds={config.gridBounds} proj={proj} />
          {/* Shaded feasible region cells (for inequality constraints) */}
          {shadedCells.length > 0 && (
            <g aria-label="Shaded feasible region">
              {shadedCells.map((cell, idx) => (
                <rect
                  key={`fr-${idx}`}
                  x={cell.sx}
                  y={cell.sy}
                  width={cell.w}
                  height={cell.h}
                  fill="rgba(16,185,129,0.22)"
                />
              ))}
            </g>
          )}
          {/* Analytical locus boundaries & reference geometry */}
          {config.locusConstraints.map((c, idx) => {
            if (c.kind === 'fixed-distance-point') {
              return (
                <g key={`lc-${idx}`}>
                  <circle
                    cx={proj.toSvgX(c.center.x)}
                    cy={proj.toSvgY(c.center.y)}
                    r={c.distance * proj.scale}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    strokeDasharray={c.relation === 'eq' ? undefined : '5 3'}
                  />
                  <circle cx={proj.toSvgX(c.center.x)} cy={proj.toSvgY(c.center.y)} r={4} fill="#312e81" />
                </g>
              );
            }
            if (c.kind === 'fixed-distance-line') {
              const vx = c.p2.x - c.p1.x;
              const vy = c.p2.y - c.p1.y;
              const len = Math.hypot(vx, vy) || 1;
              const nx = (-vy / len) * c.distance;
              const ny = (vx / len) * c.distance;
              return (
                <g key={`lc-${idx}`}>
                  <line x1={proj.toSvgX(c.p1.x)} y1={proj.toSvgY(c.p1.y)} x2={proj.toSvgX(c.p2.x)} y2={proj.toSvgY(c.p2.y)} stroke="#0f172a" strokeWidth={2} />
                  <line x1={proj.toSvgX(c.p1.x + nx)} y1={proj.toSvgY(c.p1.y + ny)} x2={proj.toSvgX(c.p2.x + nx)} y2={proj.toSvgY(c.p2.y + ny)} stroke="#4f46e5" strokeWidth={2} strokeDasharray="5 3" />
                  <line x1={proj.toSvgX(c.p1.x - nx)} y1={proj.toSvgY(c.p1.y - ny)} x2={proj.toSvgX(c.p2.x - nx)} y2={proj.toSvgY(c.p2.y - ny)} stroke="#4f46e5" strokeWidth={2} strokeDasharray="5 3" />
                </g>
              );
            }
            if (c.kind === 'fixed-distance-segment') {
              const vx = c.p2.x - c.p1.x;
              const vy = c.p2.y - c.p1.y;
              const len = Math.hypot(vx, vy) || 1;
              const nx = (-vy / len) * c.distance;
              const ny = (vx / len) * c.distance;
              const rSvg = c.distance * proj.scale;
              const a1x = proj.toSvgX(c.p1.x + nx);
              const a1y = proj.toSvgY(c.p1.y + ny);
              const b1x = proj.toSvgX(c.p2.x + nx);
              const b1y = proj.toSvgY(c.p2.y + ny);
              const b2x = proj.toSvgX(c.p2.x - nx);
              const b2y = proj.toSvgY(c.p2.y - ny);
              const a2x = proj.toSvgX(c.p1.x - nx);
              const a2y = proj.toSvgY(c.p1.y - ny);
              const stadiumD = `M ${a1x} ${a1y} L ${b1x} ${b1y} A ${rSvg} ${rSvg} 0 0 1 ${b2x} ${b2y} L ${a2x} ${a2y} A ${rSvg} ${rSvg} 0 0 1 ${a1x} ${a1y} Z`;
              return (
                <g key={`lc-${idx}`} aria-label="Finite segment stadium locus with semicircular endpoint arcs">
                  <path d={stadiumD} fill="rgba(79,70,229,0.08)" stroke="#4f46e5" strokeWidth={2} strokeDasharray="5 3" />
                  <line x1={proj.toSvgX(c.p1.x)} y1={proj.toSvgY(c.p1.y)} x2={proj.toSvgX(c.p2.x)} y2={proj.toSvgY(c.p2.y)} stroke="#0f172a" strokeWidth={3} />
                  <circle cx={proj.toSvgX(c.p1.x)} cy={proj.toSvgY(c.p1.y)} r={4} fill="#0f172a" />
                  <circle cx={proj.toSvgX(c.p2.x)} cy={proj.toSvgY(c.p2.y)} r={4} fill="#0f172a" />
                </g>
              );
            }
            if (c.kind === 'equidistant-two-points') {
              const mx = (c.p1.x + c.p2.x) / 2;
              const my = (c.p1.y + c.p2.y) / 2;
              const vx = c.p2.x - c.p1.x;
              const vy = c.p2.y - c.p1.y;
              const len = Math.hypot(vx, vy) || 1;
              const span = Math.max(config.gridBounds.xMax - config.gridBounds.xMin, config.gridBounds.yMax - config.gridBounds.yMin);
              const pxDir = (-vy / len) * span;
              const pyDir = (vx / len) * span;
              return (
                <g key={`lc-${idx}`}>
                  <line
                    x1={proj.toSvgX(mx - pxDir)}
                    y1={proj.toSvgY(my - pyDir)}
                    x2={proj.toSvgX(mx + pxDir)}
                    y2={proj.toSvgY(my + pyDir)}
                    stroke="#4f46e5"
                    strokeWidth={2}
                    strokeDasharray="5 3"
                  />
                  <circle cx={proj.toSvgX(c.p1.x)} cy={proj.toSvgY(c.p1.y)} r={4.5} fill="#312e81" />
                  <circle cx={proj.toSvgX(c.p2.x)} cy={proj.toSvgY(c.p2.y)} r={4.5} fill="#312e81" />
                </g>
              );
            }
            if (c.kind === 'equidistant-parallel-lines') {
              const mid1 = { x: (c.l1p1.x + c.l2p1.x) / 2, y: (c.l1p1.y + c.l2p1.y) / 2 };
              const mid2 = { x: (c.l1p2.x + c.l2p2.x) / 2, y: (c.l1p2.y + c.l2p2.y) / 2 };
              return (
                <g key={`lc-${idx}`}>
                  <line x1={proj.toSvgX(c.l1p1.x)} y1={proj.toSvgY(c.l1p1.y)} x2={proj.toSvgX(c.l1p2.x)} y2={proj.toSvgY(c.l1p2.y)} stroke="#0f172a" strokeWidth={2} />
                  <line x1={proj.toSvgX(c.l2p1.x)} y1={proj.toSvgY(c.l2p1.y)} x2={proj.toSvgX(c.l2p2.x)} y2={proj.toSvgY(c.l2p2.y)} stroke="#0f172a" strokeWidth={2} />
                  <line x1={proj.toSvgX(mid1.x)} y1={proj.toSvgY(mid1.y)} x2={proj.toSvgX(mid2.x)} y2={proj.toSvgY(mid2.y)} stroke="#4f46e5" strokeWidth={2} strokeDasharray="5 3" />
                </g>
              );
            }
            // equidistant-intersecting-lines
            return (
              <g key={`lc-${idx}`}>
                <line x1={proj.toSvgX(c.l1p1.x)} y1={proj.toSvgY(c.l1p1.y)} x2={proj.toSvgX(c.l1p2.x)} y2={proj.toSvgY(c.l1p2.y)} stroke="#0f172a" strokeWidth={2} />
                <line x1={proj.toSvgX(c.l2p1.x)} y1={proj.toSvgY(c.l2p1.y)} x2={proj.toSvgX(c.l2p2.x)} y2={proj.toSvgY(c.l2p2.y)} stroke="#0f172a" strokeWidth={2} />
              </g>
            );
          })}
          {/* Learner's live test point */}
          {hasValidNum && (
            <g>
              <circle
                cx={proj.toSvgX(numX)}
                cy={proj.toSvgY(numY)}
                r={6}
                fill={status ? (status.passed ? '#059669' : '#e11d48') : '#0369a1'}
                stroke="#ffffff"
                strokeWidth={2}
              />
              <text x={proj.toSvgX(numX) + 8} y={proj.toSvgY(numY) - 6} fontSize="11" fontWeight="bold" fill="#0f172a">
                P({numX},{numY})
              </text>
            </g>
          )}
        </svg>

        <div className="space-y-3 text-xs">
          <p className="font-bold text-slate-800">{config.targetPrompt}</p>
          <p className="text-[11px] text-slate-600">
            Click anywhere on the coordinate plane or type coordinates below.{' '}
            {hasInequality
              ? 'Green shading indicates the feasible region; dashed curves show boundary loci.'
              : 'Dashed curves show the exact boundary locus.'}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 font-semibold text-slate-700">
              x:
              <input
                type="number"
                step="0.5"
                aria-label="Locus test point x"
                value={px}
                onChange={(e) => setPoint(e.target.value, py)}
                className="min-h-[44px] w-24 rounded-lg border border-slate-300 px-2 font-mono"
              />
            </label>
            <label className="flex items-center gap-1.5 font-semibold text-slate-700">
              y:
              <input
                type="number"
                step="0.5"
                aria-label="Locus test point y"
                value={py}
                onChange={(e) => setPoint(px, e.target.value)}
                className="min-h-[44px] w-24 rounded-lg border border-slate-300 px-2 font-mono"
              />
            </label>
          </div>
        </div>
      </div>
    </ConstructionLabShell>
  );
}

/* ========================================================================== */
/* MAIN EXPORT                                                                */
/* ========================================================================== */

export function GeometryConstructorLab({ config }: { config: GeometryConstructorConstructionConfig }) {
  switch (config.mode) {
    case 'compass-straightedge':
      return <CompassWorkbench config={config} />;
    case 'transformations':
      return <TransformationsWorkbench config={config} />;
    case 'coordinate-geometry':
      return <CoordinateWorkbench config={config} />;
    case 'circle-theorems':
      return <CircleTheoremWorkbench config={config} />;
    case 'cube-nets':
      return <CubeNetWorkbench config={config} />;
    case 'loci-regions':
      return <LociRegionWorkbench config={config} />;
  }
}
