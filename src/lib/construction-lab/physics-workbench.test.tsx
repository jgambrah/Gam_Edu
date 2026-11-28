/**
 * @jest-environment jsdom
 */

import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import {
  computeMomentsEquilibrium,
  computeOpticalImage,
  computePlaneReflection,
  computeRefraction,
  computeSimpleMachine,
  evaluatePhysicsGoal,
} from './physics-workbench-engine';
import {
  SUPPORTED_INTERACTIVE_ENGINES,
  assertValidLessonInteractives,
  validateSlideInteractiveConfig,
  type PhysicsWorkbenchConstructionConfig,
} from '@/lib/narrated-lessons/interactive-schema';
import { PhysicsWorkbenchLab } from '@/components/narrated-lessons/construction/PhysicsWorkbenchLab';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';

const PILOT_PATH = path.resolve(process.cwd(), 'public/preview-fixtures/step5g-physics-workbench-pilot.json');
const PILOT_LESSON = JSON.parse(fs.readFileSync(PILOT_PATH, 'utf8')) as NarratedLesson;

describe('Step 5G — Dynamic Physics Workbench (construction-lab: physics-workbench 1.10.0)', () => {
  it('advances construction-lab engineVersion to 1.10.0 while keeping shared productionVersion at 1.3.0 and physics-workbench inactive', () => {
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].engineVersion).toBe('1.10.0');
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].productionVersion).toBe('1.3.0');
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].productionCapabilities?.['construction-lab:physics-workbench']).toBeUndefined();
  });

  describe('1. Independent Scientific Model Verification (Domains A–F + Boundaries & Singularities)', () => {
    it('Domain A: verifies law of reflection, normal incidence, glancing angle, and periscope 90° turn', () => {
      const normal = computePlaneReflection({ incidentAngleDeg: 0 });
      expect(normal.ok && normal.isNormalIncidence).toBe(true);
      expect(normal.reflectedAngleDeg).toBe(0);
      expect(normal.glancingAngleDeg).toBe(90);

      const periscope = computePlaneReflection({ incidentAngleDeg: 45 });
      expect(periscope.ok).toBe(true);
      expect(periscope.reflectedAngleDeg).toBe(45);
      expect(periscope.angleBetweenRaysDeg).toBe(90);
      expect(periscope.deviationAngleDeg).toBe(90);

      // Invalid/non-finite rejected
      expect(computePlaneReflection({ incidentAngleDeg: -5 }).ok).toBe(false);
      expect(computePlaneReflection({ incidentAngleDeg: 90 }).ok).toBe(false);
      expect(computePlaneReflection({ incidentAngleDeg: Number.NaN }).ok).toBe(false);
    });

    it('Domain B: verifies Snell law, critical angles, normal incidence, equal indices, grazing critical, and TIR', () => {
      // Air (1.0) -> Crown Glass (1.52) at 30°: arcsin(0.5/1.52) = 19.205° -> 19.21°
      const airGlass = computeRefraction({ incidentAngleDeg: 30, n1: 1.0, n2: 1.52 });
      expect(airGlass.ok).toBe(true);
      expect(airGlass.refractedAngleDeg).toBeCloseTo(19.21, 1);
      expect(airGlass.criticalAngleDeg).toBeNull();
      expect(airGlass.bendDirection).toBe('towards-normal');

      // Normal incidence: no bending even when n1 != n2
      const norm = computeRefraction({ incidentAngleDeg: 0, n1: 1.0, n2: 1.52 });
      expect(norm.ok && norm.isNormalIncidence && norm.refractedAngleDeg === 0).toBe(true);

      // Equal refractive indices: straight through, no TIR
      const eqN = computeRefraction({ incidentAngleDeg: 45, n1: 1.5, n2: 1.5 });
      expect(eqN.ok && eqN.isEqualIndex && eqN.refractedAngleDeg === 45 && !eqN.isTotalInternalReflection).toBe(true);

      // Crown Glass (1.52) -> Air (1.0): critical angle = arcsin(1/1.52) = 41.14°
      const atCrit = computeRefraction({ incidentAngleDeg: 41.14, n1: 1.52, n2: 1.0 });
      expect(atCrit.ok && atCrit.isAtCriticalAngle && atCrit.refractedAngleDeg === 90).toBe(true);

      const tir = computeRefraction({ incidentAngleDeg: 45, n1: 1.52, n2: 1.0 });
      expect(tir.ok && tir.isTotalInternalReflection && tir.refractedAngleDeg === null).toBe(true);
      expect(tir.criticalAngleDeg).toBeCloseTo(41.14, 1);

      // Water (1.33) -> Air (1.0): critical angle = 48.75°; Diamond (2.42) -> Air (1.0): 24.41°
      expect(computeRefraction({ incidentAngleDeg: 20, n1: 1.33, n2: 1.0 }).criticalAngleDeg).toBeCloseTo(48.75, 1);
      expect(computeRefraction({ incidentAngleDeg: 20, n1: 2.42, n2: 1.0 }).criticalAngleDeg).toBeCloseTo(24.41, 1);

      // Out-of-bounds rejected
      expect(computeRefraction({ incidentAngleDeg: 30, n1: 0.5, n2: 1.5 }).ok).toBe(false);
    });

    it('Domains C & D: verifies thin lens & spherical mirror equations, magnification, and u = f infinity singularity', () => {
      // Converging lens u = 2f (f = 12, u = 24) -> v = +24, m = -1 (real, inverted, same-size)
      const lens2f = computeOpticalImage({
        elementKind: 'converging-lens',
        focalLengthMagCm: 12,
        objectDistanceCm: 24,
        objectHeightCm: 6,
      });
      expect(lens2f.ok && !lens2f.imageAtInfinity).toBe(true);
      expect(lens2f.imageDistanceCm).toBe(24);
      expect(lens2f.magnification).toBe(-1);
      expect(lens2f.imageNature).toBe('real');
      expect(lens2f.orientation).toBe('inverted');
      expect(lens2f.sizeRelation).toBe('same-size');

      // Object at focal point (u = f = 12) -> image at infinity!
      const lensInf = computeOpticalImage({
        elementKind: 'converging-lens',
        focalLengthMagCm: 12,
        objectDistanceCm: 12,
        objectHeightCm: 6,
      });
      expect(lensInf.ok && lensInf.imageAtInfinity).toBe(true);
      expect(lensInf.imageDistanceCm).toBeNull();
      expect(lensInf.magnification).toBeNull();

      // Magnifying glass (u = 8 < f = 12) -> v = (8*12)/(8-12) = -24 cm, m = +3 (virtual, upright, magnified)
      const mag = computeOpticalImage({
        elementKind: 'converging-lens',
        focalLengthMagCm: 12,
        objectDistanceCm: 8,
        objectHeightCm: 5,
      });
      expect(mag.imageDistanceCm).toBe(-24);
      expect(mag.magnification).toBe(3);
      expect(mag.imageNature).toBe('virtual');
      expect(mag.orientation).toBe('upright');

      // Diverging lens & Convex mirror always form virtual, upright, diminished images
      const divLens = computeOpticalImage({
        elementKind: 'diverging-lens',
        focalLengthMagCm: 12,
        objectDistanceCm: 24,
        objectHeightCm: 6,
      });
      expect(divLens.imageDistanceCm).toBe(-8);
      expect(divLens.imageNature).toBe('virtual');
      expect(divLens.orientation).toBe('upright');
      expect(divLens.sizeRelation).toBe('diminished');

      const convexMirror = computeOpticalImage({
        elementKind: 'convex-mirror',
        focalLengthMagCm: 10,
        objectDistanceCm: 20,
        objectHeightCm: 6,
      });
      expect(convexMirror.imageDistanceCm).toBeCloseTo(-6.67, 1);
      expect(convexMirror.imageNature).toBe('virtual');
      expect(convexMirror.orientation).toBe('upright');
      expect(convexMirror.sizeRelation).toBe('diminished');
    });

    it('Domain E: verifies moments, rotational equilibrium, and required pivot reaction for complete static equilibrium', () => {
      // 60 N down at -2 m (120 N·m ACW) + 40 N down at +3 m (120 N·m CW) -> balanced rotationally, pivot reaction = +100 N up
      const bal = computeMomentsEquilibrium({
        pivotPositionM: 0,
        forces: [
          { id: 'a', label: 'A', forceN: 60, positionM: -2, direction: 'down' },
          { id: 'b', label: 'B', forceN: 40, positionM: 3, direction: 'down' },
        ],
      });
      expect(bal.ok && bal.isRotationalEquilibrium).toBe(true);
      expect(bal.totalClockwiseNm).toBe(120);
      expect(bal.totalAnticlockwiseNm).toBe(120);
      expect(bal.netExternalVerticalForceN).toBe(-100);
      expect(bal.requiredPivotReactionN).toBe(100);

      // Unbalanced
      const unbal = computeMomentsEquilibrium({
        pivotPositionM: 0,
        forces: [
          { id: 'a', label: 'A', forceN: 60, positionM: -2, direction: 'down' },
          { id: 'b', label: 'B', forceN: 40, positionM: 2, direction: 'down' },
        ],
      });
      expect(unbal.ok && !unbal.isRotationalEquilibrium).toBe(true);
      expect(unbal.netMomentNm).toBe(-40);
    });

    it('Domain F: verifies levers, pulleys, inclined planes, ideal vs non-ideal efficiency, and rejects impossible >100% efficiency or h > L', () => {
      // 4-strand pulley, 400 N load, 80% efficiency -> VR=4, MA=3.2, idealEffort=100 N, actualEffort=125 N, Wout=400 J, Win=500 J, loss=100 J
      const pulley = computeSimpleMachine({
        machineKind: 'pulley',
        loadN: 400,
        loadDistanceM: 1,
        efficiencyPct: 80,
        supportingStrands: 4,
      });
      expect(pulley.ok).toBe(true);
      expect(pulley.velocityRatio).toBe(4);
      expect(pulley.mechanicalAdvantage).toBe(3.2);
      expect(pulley.idealEffortN).toBe(100);
      expect(pulley.actualEffortN).toBe(125);
      expect(pulley.workOutputJ).toBe(400);
      expect(pulley.workInputJ).toBe(500);
      expect(pulley.energyLostToFrictionJ).toBe(100);
      expect(pulley.isIdealModel).toBe(false);

      // Inclined plane: L = 4 m, h = 2 m -> VR = 2, angle = 30°
      const ramp = computeSimpleMachine({
        machineKind: 'inclined-plane',
        loadN: 200,
        efficiencyPct: 100,
        planeLengthM: 4,
        planeHeightM: 2,
      });
      expect(ramp.ok && ramp.isIdealModel).toBe(true);
      expect(ramp.velocityRatio).toBe(2);
      expect(ramp.inclineAngleDeg).toBe(30);
      expect(ramp.energyLostToFrictionJ).toBe(0);

      // Impossible efficiency > 100% and h > L rejected
      expect(computeSimpleMachine({ machineKind: 'pulley', loadN: 100, efficiencyPct: 120, supportingStrands: 2 }).ok).toBe(false);
      expect(computeSimpleMachine({ machineKind: 'inclined-plane', loadN: 100, efficiencyPct: 80, planeLengthM: 2, planeHeightM: 3 }).ok).toBe(false);
    });
  });

  describe('2. Pilot Fixture Validation, Production Gate & UI Interaction', () => {
    it('validates all 10 slides in step5g-physics-workbench-pilot.json under dev gate while keeping production gate blocked', () => {
      expect(PILOT_LESSON.slides.length).toBe(10);
      expect(() => assertValidLessonInteractives(PILOT_LESSON, { allowDevOnlyEngines: true })).not.toThrow();
      expect(() => assertValidLessonInteractives(PILOT_LESSON, { allowDevOnlyEngines: false })).toThrow(/exceeds productionVersion/i);

      // Version-omission bypass rejected
      const p01 = (PILOT_LESSON.slides[0].interactive as PhysicsWorkbenchConstructionConfig[])[0];
      expect(validateSlideInteractiveConfig({ ...p01, minEngineVersion: '1.3.0' }, { requireProduction: false }).ok).toBe(false);
    });

    it('renders Refraction & TIR playground, switches examples, isolates Explore Further, and blocks hints/exploration in formal assessment', () => {
      const p03 = (PILOT_LESSON.slides[2].interactive as PhysicsWorkbenchConstructionConfig[])[0];
      render(<PhysicsWorkbenchLab config={p03} />);
      fireEvent.click(screen.getByRole('tab', { name: /Glass → Air/i }));
      fireEvent.click(screen.getByRole('button', { name: /Explore Further/i }));
      const panel = screen.getByRole('region', { name: /Explore Further sandbox/i });
      fireEvent.click(within(panel).getByRole('tab', { name: /Diamond/i }));
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByRole('region', { name: /Explore Further sandbox/i })).toBeNull();
      expect(screen.getByRole('tab', { name: /Glass → Air/i }).getAttribute('aria-selected')).toBe('true');

      // Formal assessment (p10) hides Explore Further & hints
      const p10 = (PILOT_LESSON.slides[9].interactive as PhysicsWorkbenchConstructionConfig[])[0];
      const view = render(<PhysicsWorkbenchLab config={p10} />);
      expect(within(view.container).queryByRole('button', { name: /Explore Further/i })).toBeNull();
      expect(within(view.container).queryByRole('button', { name: /Need a hint/i })).toBeNull();

      // Goal evaluation sanity
      const goalPass = evaluatePhysicsGoal(
        p10.goal!,
        computeSimpleMachine({ machineKind: 'pulley', loadN: 400, efficiencyPct: 80, supportingStrands: 4 }),
      );
      expect(goalPass.passed).toBe(true);
    });
  });
});
