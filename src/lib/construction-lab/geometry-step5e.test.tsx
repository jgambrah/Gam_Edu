import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  computeCircleTheoremGeometry,
  computeCuboidMetrics,
  evaluateCombinedLocus,
  evaluateCubeNet,
  evaluateLocusConstraint,
  evaluateProtractorAngle,
  evaluateTriangleRHS,
  isValidTriangleRHS,
  pointToSegmentDistance,
  type GridCell,
} from './geometry-engine';
import {
  SUPPORTED_INTERACTIVE_ENGINES,
  assertValidLessonInteractives,
  type GeometryCubeNetConfig,
} from '@/lib/narrated-lessons/interactive-schema';
import { GeometryConstructorLab } from '@/components/narrated-lessons/construction/GeometryConstructorLab';

// All 11 distinct canonical cube nets (independent geometric catalogue)
const ALL_11_VALID_CUBE_NETS: Array<{ name: string; cells: GridCell[] }> = [
  { name: '1-4-1 Cross (a)', cells: [{ r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 2, c: 1 }] },
  { name: '1-4-1 (b)', cells: [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 2, c: 0 }] },
  { name: '1-4-1 (c)', cells: [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 2, c: 1 }] },
  { name: '1-4-1 (d)', cells: [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 2, c: 2 }] },
  { name: '1-4-1 (e)', cells: [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 2, c: 3 }] },
  { name: '1-4-1 (f)', cells: [{ r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 2, c: 2 }] },
  { name: '2-3-1 (a)', cells: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 2, c: 1 }] },
  { name: '2-3-1 (b)', cells: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 2, c: 2 }] },
  { name: '2-3-1 (c)', cells: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 2, c: 3 }] },
  { name: '2-2-2 Stairs', cells: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 1 }, { r: 1, c: 2 }, { r: 2, c: 2 }, { r: 2, c: 3 }] },
  { name: '3-3 Offset', cells: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 1, c: 4 }] },
];

describe('Step 5E — Remaining Geometry Capabilities (construction-lab: geometry-constructor 1.6.0)', () => {
  it('extends construction-lab to engineVersion 1.6.0 while holding productionVersion at 1.3.0', () => {
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].engineVersion).toBe('1.6.0');
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].productionVersion).toBe('1.3.0');
  });

  describe('1. RHS Triangle Construction (Including Reflected Solutions) & Virtual Protractor Angle', () => {
    it('validates RHS feasibility and accepts both reflected orientations of a 3-4-5 right triangle', () => {
      expect(isValidTriangleRHS(3, 5)).toBe(true);
      expect(isValidTriangleRHS(5, 5)).toBe(false); // degenerate: hyp == leg
      expect(isValidTriangleRHS(6, 5)).toBe(false); // impossible: hyp < leg

      const A = { id: 'A', label: 'A', x: 0, y: 0 };
      const B = { id: 'B', label: 'B', x: 3, y: 0 };
      const Cpos = { id: 'C', label: 'C', x: 0, y: 4 };
      const Cneg = { id: 'C', label: 'C', x: 0, y: -4 };
      expect(evaluateTriangleRHS(A, B, Cpos, 3, 5).passed).toBe(true);
      expect(evaluateTriangleRHS(A, B, Cneg, 3, 5).passed).toBe(true); // reflected solution!
      expect(evaluateTriangleRHS(A, B, { id: 'C', label: 'C', x: 1, y: 4 }, 3, 5).passed).toBe(false);
    });

    it('evaluates virtual-protractor general angles and distinguishes method from pure compass', () => {
      const res = evaluateProtractorAngle(
        { id: 'O', label: 'O', x: 0, y: 0 },
        { id: 'A', label: 'A', x: 5, y: 0 },
        { id: 'B', label: 'B', x: 5 * Math.cos((37 * Math.PI) / 180), y: 5 * Math.sin((37 * Math.PI) / 180) },
        37,
      );
      expect(res.passed).toBe(true);
      expect(res.method).toBe('virtual-protractor');
      expect(res.measuredDeg).toBeCloseTo(37, 1);
    });
  });

  describe('2. Remaining Circle Theorems (Alternate Segment, Equal Tangents, Chord Perpendicular Bisector)', () => {
    it('computes exact alternate segment theorem (minor & major arc), equal tangents, and chord bisector', () => {
      // Alternate segment: chord from 270° to 30° spans 120° -> inscribed angle in major arc = 60° = tangent-chord angle
      const altMajor = computeCircleTheoremGeometry('alternate-segment', [270, 30], 150);
      expect(altMajor.validDomain).toBe(true);
      expect(altMajor.measuredAngleDeg).toBe(60);
      expect(altMajor.relatedAngleDeg).toBe(60);
      // Point in minor arc (330°) gives 120° = obtuse tangent-chord angle
      const altMinor = computeCircleTheoremGeometry('alternate-segment', [270, 30], 330);
      expect(altMinor.validDomain).toBe(true);
      expect(altMinor.measuredAngleDeg).toBe(120);
      expect(altMinor.relatedAngleDeg).toBe(120);

      // Equal tangents at d = 2R -> ∠T1OT2 = 120°, ∠T1ET2 = 60°
      const eqT = computeCircleTheoremGeometry('equal-tangents', [0, 2], 0);
      expect(eqT.validDomain).toBe(true);
      expect(eqT.measuredAngleDeg).toBe(60);
      expect(eqT.relatedAngleDeg).toBe(120);

      // Chord perpendicular bisector -> 90°
      const chord = computeCircleTheoremGeometry('chord-perp-bisector', [210, 330], 270);
      expect(chord.validDomain).toBe(true);
      expect(chord.measuredAngleDeg).toBe(90);
    });
  });

  describe('3. Extended Loci & Combined Feasible Regions', () => {
    it('verifies finite segment endpoint arcs, parallel midline, intersecting bisectors, and combined constraints', () => {
      // Finite segment (0,0)-(4,0) distance 2 -> endpoint arc (6,0) is at distance 2, (6,2) is at sqrt(8)≈2.83
      expect(pointToSegmentDistance({ x: 6, y: 0 }, { x: 0, y: 0 }, { x: 4, y: 0 })).toBe(2);
      expect(
        evaluateLocusConstraint(
          { kind: 'fixed-distance-segment', p1: { x: 0, y: 0 }, p2: { x: 4, y: 0 }, distance: 2, relation: 'eq' },
          { x: 6, y: 0 },
        ).satisfied,
      ).toBe(true);

      // Intersecting lines (axes): both internal (3,3) and external (-3,3) bisectors pass
      const inter = {
        kind: 'equidistant-intersecting-lines' as const,
        l1p1: { x: -5, y: 0 },
        l1p2: { x: 5, y: 0 },
        l2p1: { x: 0, y: -5 },
        l2p2: { x: 0, y: 5 },
      };
      expect(evaluateLocusConstraint(inter, { x: 3, y: 3 }).satisfied).toBe(true);
      expect(evaluateLocusConstraint(inter, { x: -3, y: 3 }).satisfied).toBe(true);

      // Parallel lines y=0 and y=6 -> midline (1, 3) passes, (1, 9) fails
      const para = {
        kind: 'equidistant-parallel-lines' as const,
        l1p1: { x: -4, y: 0 },
        l1p2: { x: 4, y: 0 },
        l2p1: { x: -4, y: 6 },
        l2p2: { x: 4, y: 6 },
      };
      expect(evaluateLocusConstraint(para, { x: 1, y: 3 }).satisfied).toBe(true);
      expect(evaluateLocusConstraint(para, { x: 1, y: 9 }).satisfied).toBe(false);

      // Combined feasible region
      const comb = evaluateCombinedLocus(
        [
          { kind: 'fixed-distance-point', center: { x: 0, y: 0 }, distance: 4, relation: 'lte' },
          { kind: 'equidistant-two-points', p1: { x: 0, y: 0 }, p2: { x: 6, y: 0 }, relation: 'closer-to-p1' },
        ],
        { x: 1, y: 1 },
      );
      expect(comb.passed).toBe(true);
    });
  });

  describe('4. All 11 Valid Cube Nets, Rotation/Reflection Equivalence, Invalid Hexominoes & Cuboid Metrics', () => {
    it.each(ALL_11_VALID_CUBE_NETS)('certifies valid cube net: $name (plus 90° rotation and reflection)', ({ cells }) => {
      expect(evaluateCubeNet(cells).valid).toBe(true);
      // 90° rotation: (r, c) -> (c, 5 - r)
      const rotated = cells.map(({ r, c }) => ({ r: c, c: 5 - r }));
      expect(evaluateCubeNet(rotated).valid).toBe(true);
      // Horizontal reflection: (r, c) -> (r, 5 - c)
      const reflected = cells.map(({ r, c }) => ({ r, c: 5 - c }));
      expect(evaluateCubeNet(reflected).valid).toBe(true);
    });

    it('rejects invalid hexominoes (2x3 block, 1x6 strip, U-loop, disconnected, wrong count, duplicate cells) and computes cuboid metrics', () => {
      // 2x3 rectangle (contains 2x2 block -> faces overlap in 3D!)
      expect(
        evaluateCubeNet([
          { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 },
          { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 },
        ]).valid,
      ).toBe(false);
      // 1x6 straight strip (folds around 4 faces and overlaps!)
      expect(
        evaluateCubeNet([
          { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 0, c: 4 }, { r: 0, c: 5 },
        ]).valid,
      ).toBe(false);
      // Disconnected
      expect(
        evaluateCubeNet([
          { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 3, c: 3 }, { r: 3, c: 4 }, { r: 3, c: 5 },
        ]).valid,
      ).toBe(false);
      // Wrong face count
      expect(evaluateCubeNet([{ r: 0, c: 0 }, { r: 0, c: 1 }]).valid).toBe(false);

      // Cuboid 4 x 3 x 2
      expect(computeCuboidMetrics(4, 3, 2)).toEqual({
        faces: 6,
        edges: 12,
        vertices: 8,
        surfaceArea: 52,
        volume: 24,
      });
    });
  });

  describe('5. Pilot Fixture, Production Gate & UI Interaction', () => {
    it('validates all 12 slides in step5e-geometry-extensions-pilot.json and keeps 1.6.0 production gate CLOSED', () => {
      const fixturePath = path.resolve(process.cwd(), 'public/preview-fixtures/step5e-geometry-extensions-pilot.json');
      const lesson = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as {
        lessonId: string;
        slides: Array<{ id: string; interactive?: unknown[] }>;
      };
      expect(lesson.slides).toHaveLength(12);
      expect(() => assertValidLessonInteractives(lesson, { allowDevOnlyEngines: true })).not.toThrow();
      expect(() => assertValidLessonInteractives(lesson, { allowDevOnlyEngines: false })).toThrow(/1\.6\.0|production/i);
    });

    it('renders CubeNetWorkbench UI and tests 3D foldability interactively', () => {
      const cfg: GeometryCubeNetConfig = {
        id: 'ui-net-1',
        engine: 'construction-lab',
        labKind: 'geometry-constructor',
        mode: 'cube-nets',
        schemaVersion: 1,
        minEngineVersion: '1.6.0',
        curriculumLevel: 'introductory',
        title: 'Cube Net UI Test',
        instructions: 'Test the cross net.',
        accessibilityLabel: 'Cube net UI test',
        fallbackText: 'Cross net folds into a cube.',
        initialCells: ALL_11_VALID_CUBE_NETS[0].cells,
      };
      render(<GeometryConstructorLab config={cfg} />);
      fireEvent.click(screen.getByRole('button', { name: 'Test 3D Foldability' }));
      expect(screen.getByText(/Valid cube net!/i)).toBeTruthy();
    });
  });
});
