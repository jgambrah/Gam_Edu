import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  GEOMETRY_LIMITS,
  computeCircleTheoremGeometry,
  evaluateCircleTheoremAnswer,
  evaluateCompassConstruction,
  evaluateCoordinateGeometry,
  evaluateTransformation,
  formatGradientLabel,
  intersectCircleCircle,
  intersectLineCircle,
  intersectLineLine,
  isValidTriangleASA,
  isValidTriangleSSS,
  lineFromTwoPoints,
  type GeoArc,
  type GeoPoint,
  type GeoSegment,
} from './geometry-engine';
import {
  SUPPORTED_INTERACTIVE_ENGINES,
  assertValidLessonInteractives,
  validateSlideInteractiveConfig,
  type GeometryCoordinateConfig,
  type GeometryTransformationConfig,
} from '@/lib/narrated-lessons/interactive-schema';
import { GeometryConstructorLab } from '@/components/narrated-lessons/construction/GeometryConstructorLab';
import { InteractiveEngineRegistry } from '@/components/narrated-lessons/InteractiveEngineRegistry';

describe('Step 4F — Geometry Construction Laboratory (geometry-constructor 1.3.0)', () => {
  it('confirms construction-lab engineVersion 1.5.0 (data-stats-lab integrated) and productionVersion 1.3.0 (LIVE)', () => {
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].engineVersion).toBe('1.5.0');
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].productionVersion).toBe('1.3.0');
  });

  describe('1. Analytical Primitives & Intersections', () => {
    it('solves line-line intersections including vertical, parallel, and coincident lines', () => {
      const vert = lineFromTwoPoints({ x: 3, y: 0 }, { x: 3, y: 5 })!;
      const horiz = lineFromTwoPoints({ x: -2, y: 4 }, { x: 8, y: 4 })!;
      const hit = intersectLineLine(vert, horiz);
      expect(hit.status).toBe('point');
      if (hit.status === 'point') {
        expect(hit.point.x).toBeCloseTo(3, 6);
        expect(hit.point.y).toBeCloseTo(4, 6);
      }

      const par1 = lineFromTwoPoints({ x: 0, y: 1 }, { x: 4, y: 1 })!;
      const par2 = lineFromTwoPoints({ x: 0, y: 5 }, { x: 4, y: 5 })!;
      expect(intersectLineLine(par1, par2).status).toBe('parallel');

      const coin = lineFromTwoPoints({ x: -5, y: 1 }, { x: 10, y: 1 })!;
      expect(intersectLineLine(par1, coin).status).toBe('coincident');
    });

    it('solves circle-circle and line-circle intersections (two, tangent, disjoint)', () => {
      const two = intersectCircleCircle({ x: -4, y: 0 }, 5, { x: 4, y: 0 }, 5);
      expect(two.status).toBe('two');
      if (two.status === 'two') {
        const ys = two.points.map((p) => p.y).sort((a, b) => a - b);
        expect(ys[0]).toBeCloseTo(-3, 6);
        expect(ys[1]).toBeCloseTo(3, 6);
      }

      const tangent = intersectCircleCircle({ x: 0, y: 0 }, 3, { x: 5, y: 0 }, 2);
      expect(tangent.status).toBe('tangent');

      const none = intersectCircleCircle({ x: 0, y: 0 }, 1, { x: 10, y: 0 }, 1);
      expect(none.status).toBe('none');

      const lc = intersectLineCircle(lineFromTwoPoints({ x: 0, y: 0 }, { x: 5, y: 0 })!, { x: 0, y: 0 }, 4);
      expect(lc.status).toBe('two');
    });

    it('validates triangle feasibility (SSS and ASA)', () => {
      expect(isValidTriangleSSS(5, 4, 3)).toBe(true);
      expect(isValidTriangleSSS(10, 2, 3)).toBe(false);
      expect(isValidTriangleASA(45, 6, 45)).toBe(true);
      expect(isValidTriangleASA(100, 6, 90)).toBe(false);
    });
  });

  describe('2. Compass & Straightedge Provenance & Loci', () => {
    it('enforces genuine arc provenance on perpendicular bisector (rejects guessed line or unrelated arcs)', () => {
      const basePoints: GeoPoint[] = [
        { id: 'A', label: 'A', x: -4, y: 0, locked: true },
        { id: 'B', label: 'B', x: 4, y: 0, locked: true },
        { id: 'I1', label: 'I1', x: 0, y: 3 },
        { id: 'I2', label: 'I2', x: 0, y: -3 },
      ];
      const segs: GeoSegment[] = [
        { id: 'AB', from: 'A', to: 'B', locked: true },
        { id: 'PB', from: 'I1', to: 'I2' },
      ];
      const goal = {
        kind: 'perpendicular-bisector' as const,
        referencePointIds: ['A', 'B'],
        requireConstructionArcs: true,
      };

      expect(evaluateCompassConstruction({ goal, points: basePoints, segments: segs, arcs: [] }).passed).toBe(false);

      const tinyArcs: GeoArc[] = [
        { id: 'C1', centreId: 'A', radius: 2 },
        { id: 'C2', centreId: 'B', radius: 2 },
      ];
      expect(evaluateCompassConstruction({ goal, points: basePoints, segments: segs, arcs: tinyArcs }).passed).toBe(false);

      const validArcs: GeoArc[] = [
        { id: 'C1', centreId: 'A', radius: 5 },
        { id: 'C2', centreId: 'B', radius: 5 },
      ];
      const res = evaluateCompassConstruction({ goal, points: basePoints, segments: segs, arcs: validArcs });
      expect(res.passed).toBe(true);
      expect(res.hasValidProvenanceArcs).toBe(true);
    });

    it('accepts BOTH mirrored orientations for SSS triangle and verifies ASA/locus/parallel', () => {
      const goalSSS = {
        kind: 'triangle-sss' as const,
        referencePointIds: ['A', 'B'],
        targetMeasures: [4, 3],
        requireConstructionArcs: true,
      };
      const arcs: GeoArc[] = [
        { id: 'C1', centreId: 'A', radius: 4 },
        { id: 'C2', centreId: 'B', radius: 3 },
      ];

      for (const cy of [2.4, -2.4]) {
        const res = evaluateCompassConstruction({
          goal: goalSSS,
          points: [
            { id: 'A', label: 'A', x: 0, y: 0, locked: true },
            { id: 'B', label: 'B', x: 5, y: 0, locked: true },
            { id: 'C', label: 'C', x: 3.2, y: cy },
          ],
          segments: [
            { id: 'AB', from: 'A', to: 'B', locked: true },
            { id: 'AC', from: 'A', to: 'C' },
            { id: 'BC', from: 'B', to: 'C' },
          ],
          arcs,
        });
        expect(res.passed).toBe(true);
      }

      const asaRes = evaluateCompassConstruction({
        goal: { kind: 'triangle-asa', referencePointIds: ['A', 'B'], targetMeasures: [45, 45] },
        points: [
          { id: 'A', label: 'A', x: 0, y: 0, locked: true },
          { id: 'B', label: 'B', x: 6, y: 0, locked: true },
          { id: 'C', label: 'C', x: 3, y: -3 },
        ],
        segments: [],
        arcs: [],
      });
      expect(asaRes.passed).toBe(true);

      const coinParallel = evaluateCompassConstruction({
        goal: { kind: 'parallel-line', referencePointIds: ['A', 'B', 'P'] },
        points: [
          { id: 'A', label: 'A', x: 0, y: 0, locked: true },
          { id: 'B', label: 'B', x: 4, y: 0, locked: true },
          { id: 'P', label: 'P', x: 2, y: 0, locked: true },
          { id: 'Q', label: 'Q', x: 6, y: 0 },
        ],
        segments: [
          { id: 'AB', from: 'A', to: 'B', locked: true },
          { id: 'PQ', from: 'P', to: 'Q' },
        ],
        arcs: [],
      });
      expect(coinParallel.passed).toBe(false);
    });
  });

  describe('3. Transformations & Coordinate Geometry', () => {
    it('evaluates reflection in y=-x, non-origin rotation, fractional & negative enlargement', () => {
      const tri = [
        { x: 1, y: 2 },
        { x: 4, y: 2 },
        { x: 1, y: 4 },
      ];
      expect(
        evaluateTransformation({
          preImageVertices: tri,
          transformation: { kind: 'reflection', axis: 'y=-x' },
          learnerVertices: [
            { x: -2, y: -1 },
            { x: -2, y: -4 },
            { x: -4, y: -1 },
          ],
          requireLabelledCorrespondence: true,
        }).passed,
      ).toBe(true);

      expect(
        evaluateTransformation({
          preImageVertices: [
            { x: 4, y: 1 },
            { x: 6, y: 1 },
            { x: 4, y: 3 },
          ],
          transformation: { kind: 'rotation', cx: 2, cy: 1, angleDeg: 90 },
          learnerVertices: [
            { x: 2, y: 3 },
            { x: 2, y: 5 },
            { x: 0, y: 3 },
          ],
          requireLabelledCorrespondence: true,
        }).passed,
      ).toBe(true);

      expect(
        evaluateTransformation({
          preImageVertices: [
            { x: 1, y: 1 },
            { x: 3, y: 1 },
            { x: 1, y: 2 },
          ],
          transformation: { kind: 'enlargement', cx: 0, cy: 0, scaleFactor: -2 },
          learnerVertices: [
            { x: -2, y: -2 },
            { x: -6, y: -2 },
            { x: -2, y: -4 },
          ],
          requireLabelledCorrespondence: true,
        }).passed,
      ).toBe(true);
    });

    it('handles horizontal/vertical perpendicular lines without Infinity/NaN', () => {
      expect(formatGradientLabel({ x: 1, y: -3 }, { x: 1, y: 4 })).toBe('undefined (vertical)');
      const res = evaluateCoordinateGeometry({
        goal: {
          kind: 'perpendicular-through-point',
          givenPoints: [
            { x: -4, y: 2 },
            { x: 4, y: 2 },
            { x: 1, y: -3 },
          ],
        },
        learnerPoints: [
          { x: 1, y: -3 },
          { x: 1, y: 4 },
        ],
      });
      expect(res.passed).toBe(true);
      expect(res.gradientLabel).toBe('undefined (vertical)');
    });
  });

  describe('4. Circle Theorems & Domain Guards', () => {
    it('distinguishes major vs reflex arc for angle-at-centre and guards cyclic quadrilateral crossings', () => {
      const major = computeCircleTheoremGeometry('angle-at-centre', [210, 330], 90);
      expect(major.validDomain).toBe(true);
      expect(major.isReflexCentral).toBe(false);
      expect(major.measuredAngleDeg).toBeCloseTo(60, 1);

      // On the minor arc (270°), intercepted central angle is reflex (240°) and circumference angle is 120°
      const minor = computeCircleTheoremGeometry('angle-at-centre', [210, 330], 270);
      expect(minor.validDomain).toBe(true);
      expect(minor.isReflexCentral).toBe(true);
      expect(minor.measuredAngleDeg).toBeCloseTo(120, 1);

      // Cyclic quadrilateral valid vs same-segment crossing
      expect(
        evaluateCircleTheoremAnswer({
          theorem: 'cyclic-quadrilateral',
          fixedAnglesDeg: [210, 330, 90],
          movableAngleDeg: 270,
          learnerAnswerDeg: 120,
        }).passed,
      ).toBe(true);
      expect(computeCircleTheoremGeometry('cyclic-quadrilateral', [210, 330, 90], 130).validDomain).toBe(false);

      // Tangent-radius always 90°
      expect(
        evaluateCircleTheoremAnswer({
          theorem: 'tangent-radius',
          fixedAnglesDeg: [45],
          movableAngleDeg: 45,
          learnerAnswerDeg: 90,
        }).passed,
      ).toBe(true);
    });
  });

  describe('5. Strict Schema Validation, Version Gate & Pilot Fixture Integrity', () => {
    it('blocks version-gate bypasses, impossible triangles, and unreachable fractional grids', () => {
      const baseMidpoint = {
        id: 'test-geo-gate',
        engine: 'construction-lab',
        schemaVersion: 1,
        minEngineVersion: '1.2.0',
        labKind: 'geometry-constructor',
        mode: 'coordinate-geometry',
        curriculumLevel: 'introductory',
        title: 'Test',
        instructions: 'Test instructions',
        accessibilityLabel: 'Test label',
        fallbackText: 'Test fallback text',
        gridBounds: { xMin: -5, xMax: 5, yMin: -5, yMax: 5, step: 1 },
        coordGoal: { kind: 'midpoint', givenPoints: [{ x: 0, y: 0 }, { x: 4, y: 4 }] },
      };

      const lowVer = validateSlideInteractiveConfig(baseMidpoint, { requireProduction: false });
      expect(lowVer.ok).toBe(false);
      expect(lowVer.errors.some((e) => /1\.3\.0/.test(e))).toBe(true);

      const prodPassed = validateSlideInteractiveConfig(
        { ...baseMidpoint, minEngineVersion: '1.3.0' },
        { requireProduction: true },
      );
      expect(prodPassed.ok).toBe(true);

      const futureBlocked = validateSlideInteractiveConfig(
        { ...baseMidpoint, minEngineVersion: '1.4.0' },
        { requireProduction: true },
      );
      expect(futureBlocked.ok).toBe(false);
      expect(futureBlocked.errors.some((e) => /exceeds productionVersion/i.test(e))).toBe(true);

      const unreachable = validateSlideInteractiveConfig(
        {
          id: 'test-unreach',
          engine: 'construction-lab',
          schemaVersion: 1,
          minEngineVersion: '1.3.0',
          labKind: 'geometry-constructor',
          mode: 'transformations',
          curriculumLevel: 'igcse',
          title: 'Test',
          instructions: 'Test instructions',
          accessibilityLabel: 'Test label',
          fallbackText: 'Test fallback text',
          gridBounds: { xMin: -5, xMax: 5, yMin: -5, yMax: 5, step: 1 },
          preImageVertices: [
            { x: 1, y: 1 },
            { x: 3, y: 1 },
            { x: 1, y: 3 },
          ],
          transformation: { kind: 'enlargement', cx: 0, cy: 0, scaleFactor: 0.5 },
        },
        { requireProduction: false },
      );
      expect(unreachable.ok).toBe(false);
      expect(unreachable.errors.some((e) => /NOT reachable/i.test(e))).toBe(true);
    });

    it('validates all 17 activities in public/preview-fixtures/step4f-geometry-pilot.json', () => {
      const fixturePath = path.resolve(process.cwd(), 'public/preview-fixtures/step4f-geometry-pilot.json');
      const lesson = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as {
        lessonId: string;
        slides: Array<{ id: string; interactive?: unknown[] }>;
      };
      expect(lesson.slides).toHaveLength(13);

      // Passes strict production validation now that productionVersion is 1.3.0 LIVE
      expect(() => assertValidLessonInteractives(lesson, { allowDevOnlyEngines: false })).not.toThrow();

      const totalActivities = lesson.slides.reduce((acc, s) => acc + (s.interactive?.length ?? 0), 0);
      expect(totalActivities).toBe(17);
    });
  });

  describe('6. UI Rendering, Undo/Reset, Multi-Activity Isolation & Low-Data Mode', () => {
    const midConfigA: GeometryCoordinateConfig = {
      id: 'ui-mid-a',
      engine: 'construction-lab',
      schemaVersion: 1,
      minEngineVersion: '1.3.0',
      labKind: 'geometry-constructor',
      mode: 'coordinate-geometry',
      curriculumLevel: 'introductory',
      title: 'Midpoint Lab A',
      instructions: 'Plot midpoint of (0,0) and (4,2).',
      accessibilityLabel: 'Midpoint Lab A',
      fallbackText: 'Midpoint is (2, 1).',
      gridBounds: { xMin: -5, xMax: 5, yMin: -5, yMax: 5, step: 1 },
      coordGoal: { kind: 'midpoint', givenPoints: [{ x: 0, y: 0 }, { x: 4, y: 2 }] },
    };

    const transConfigB: GeometryTransformationConfig = {
      id: 'ui-trans-b',
      engine: 'construction-lab',
      schemaVersion: 1,
      minEngineVersion: '1.3.0',
      labKind: 'geometry-constructor',
      mode: 'transformations',
      curriculumLevel: 'introductory',
      title: 'Translation Lab B',
      instructions: 'Translate by (2, 0).',
      accessibilityLabel: 'Translation Lab B',
      fallbackText: 'Shift x by +2.',
      gridBounds: { xMin: -5, xMax: 8, yMin: -5, yMax: 8, step: 1 },
      preImageVertices: [
        { x: 0, y: 0, label: 'A' },
        { x: 2, y: 0, label: 'B' },
        { x: 0, y: 2, label: 'C' },
      ],
      transformation: { kind: 'translation', dx: 2, dy: 0 },
    };

    it('supports keyboard coordinate input, Check, Undo, Reset, and multi-activity state isolation', () => {
      render(
        <div>
          <GeometryConstructorLab config={midConfigA} />
          <GeometryConstructorLab config={transConfigB} />
        </div>,
      );

      const xInput = screen.getByLabelText('Midpoint M x coordinate') as HTMLInputElement;
      const yInput = screen.getByLabelText('Midpoint M y coordinate') as HTMLInputElement;

      fireEvent.change(xInput, { target: { value: '2' } });
      fireEvent.change(yInput, { target: { value: '1' } });

      const checkBtns = screen.getAllByRole('button', { name: 'Check construction' });
      fireEvent.click(checkBtns[0]);
      expect(screen.getByText(/Verified: midpoint M = \(2, 1\)/i)).toBeTruthy();

      // Lab B remains untouched
      const axInput = screen.getByLabelText("A' x coordinate") as HTMLInputElement;
      expect(axInput.value).toBe('0');

      // Undo reverts yInput back to 0
      const undoBtns = screen.getAllByRole('button', { name: 'Undo last change' });
      fireEvent.click(undoBtns[0]);
      expect(yInput.value).toBe('0');

      // Reset returns xInput to 0
      const resetBtns = screen.getAllByRole('button', { name: 'Reset construction' });
      fireEvent.click(resetBtns[0]);
      expect(xInput.value).toBe('0');
    });

    it('renders fallbackText cleanly in Low-Data Mode via InteractiveEngineRegistry', () => {
      render(
        <InteractiveEngineRegistry
          lesson={{ lessonId: 'step4f-test' } as never}
          slide={{ id: 'geo-s09', interactive: midConfigA } as never}
          lowDataMode={true}
        />,
      );
      expect(screen.getByText('Midpoint is (2, 1).')).toBeTruthy();
    });
  });

  describe('7. Measured Performance Benchmark (Representative & Maximum Bounds)', () => {
    it('evaluates representative and maximum-bound configurations well under budget (< 50 ms)', () => {
      const t0 = performance.now();
      for (let i = 0; i < 50; i++) {
        evaluateCompassConstruction({
          goal: { kind: 'perpendicular-bisector', referencePointIds: ['A', 'B'], requireConstructionArcs: true },
          points: [
            { id: 'A', label: 'A', x: -4, y: 0, locked: true },
            { id: 'B', label: 'B', x: 4, y: 0, locked: true },
            { id: 'I1', label: 'I1', x: 0, y: 3 },
            { id: 'I2', label: 'I2', x: 0, y: -3 },
          ],
          segments: [
            { id: 'AB', from: 'A', to: 'B', locked: true },
            { id: 'PB', from: 'I1', to: 'I2' },
          ],
          arcs: [
            { id: 'C1', centreId: 'A', radius: 5 },
            { id: 'C2', centreId: 'B', radius: 5 },
          ],
        });
      }
      const repAvgMs = (performance.now() - t0) / 50;

      const maxPts: GeoPoint[] = Array.from({ length: GEOMETRY_LIMITS.maxPoints }, (_, i) => ({
        id: i === 0 ? 'A' : i === 1 ? 'B' : `P${i}`,
        label: i === 0 ? 'A' : i === 1 ? 'B' : `P${i}`,
        x: i === 0 ? -4 : i === 1 ? 4 : (i % 6) - 3,
        y: i === 0 || i === 1 ? 0 : Math.floor(i / 6) - 1,
      }));
      const maxSegs: GeoSegment[] = Array.from({ length: GEOMETRY_LIMITS.maxSegments }, (_, i) => ({
        id: `S${i}`,
        from: maxPts[i % maxPts.length].id,
        to: maxPts[(i + 5) % maxPts.length].id,
      }));
      const maxArcs: GeoArc[] = Array.from({ length: GEOMETRY_LIMITS.maxArcs }, (_, i) => ({
        id: `C${i}`,
        centreId: i % 2 === 0 ? 'A' : 'B',
        radius: 5 + (i % 3),
      }));

      const t1 = performance.now();
      for (let i = 0; i < 50; i++) {
        evaluateCompassConstruction({
          goal: { kind: 'perpendicular-bisector', referencePointIds: ['A', 'B'], requireConstructionArcs: true },
          points: maxPts,
          segments: maxSegs,
          arcs: maxArcs,
        });
      }
      const maxAvgMs = (performance.now() - t1) / 50;
      console.log(`PERF_BENCHMARK: representative=${repAvgMs.toFixed(4)}ms, max_bounds=${maxAvgMs.toFixed(4)}ms`);

      expect(repAvgMs).toBeLessThan(15);
      expect(maxAvgMs).toBeLessThan(50);
    });
  });
});
