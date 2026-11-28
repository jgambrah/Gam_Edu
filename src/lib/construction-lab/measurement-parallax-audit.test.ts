// @vitest-environment node
/** D-030 regression: a correct number must not be credited while the eye is off-level (invalid instrument configuration). */
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { evaluateMeasurementSubmission } from './measurement-engine';

const fixture = JSON.parse(fs.readFileSync(path.resolve('public/preview-fixtures/step5c-measurement-lab-pilot.json'), 'utf8'));
const spec = (id: string) => { const a = fixture.slides.find((s: any) => s.id === id).interactive; return (Array.isArray(a) ? a[0] : a) as any; };

describe('parallax state is part of a valid measurement', () => {
  const cyl = spec('ml-s03'); // measuring cylinder, eye starts 15 degrees off-level
  const answer = { valueText: String(cyl.trueValue), unitText: cyl.unit };

  it('true value with the eye 15 degrees off-level is refused with a parallax message', () => {
    const r = evaluateMeasurementSubmission(cyl, answer, { eyeOffsetDeg: 15 });
    expect(r.passed).toBe(false);
    expect(r.feedback).toMatch(/parallax/i);
    expect(r.diagnostics.stateValid).toBe(false);
  });

  it('negative off-level angles are refused too, and 1 degree or less counts as level', () => {
    expect(evaluateMeasurementSubmission(cyl, answer, { eyeOffsetDeg: -20 }).passed).toBe(false);
    expect(evaluateMeasurementSubmission(cyl, answer, { eyeOffsetDeg: 1 }).passed).toBe(true);
  });

  it('level eye (0 degrees) with the true value is accepted; a wrong value is still refused', () => {
    expect(evaluateMeasurementSubmission(cyl, answer, { eyeOffsetDeg: 0 }).passed).toBe(true);
    expect(evaluateMeasurementSubmission(cyl, { valueText: String(cyl.trueValue + 3), unitText: cyl.unit }, { eyeOffsetDeg: 0 }).passed).toBe(false);
  });

  // these activities also ask for the measurement uncertainty; take the expected value from the engine's own reply
  const withUncertainty = (s: any, eye: number) => {
    // some activities require significant figures / decimal places: record the value to 3 s.f. ("10.0") where asked
    const valueText = s.requiredSigFigs === 3 ? Number(s.trueValue).toPrecision(3) : String(s.trueValue);
    const probe = evaluateMeasurementSubmission(s, { valueText, unitText: s.unit }, { eyeOffsetDeg: eye });
    return { valueText, unitText: s.unit, uncertaintyText: String(probe.expectedUncertainty) };
  };

  it('the ruler with parallax enabled (ml-s15) behaves the same way', () => {
    const ruler = spec('ml-s15');
    expect(evaluateMeasurementSubmission(ruler, withUncertainty(ruler, 15), { eyeOffsetDeg: 15 }).passed).toBe(false);
    expect(evaluateMeasurementSubmission(ruler, withUncertainty(ruler, 0), { eyeOffsetDeg: 0 }).passed).toBe(true);
  });

  it('instruments without parallax are unaffected by the eye state', () => {
    const bal = spec('ml-s06');
    expect(evaluateMeasurementSubmission(bal, withUncertainty(bal, 20), { eyeOffsetDeg: 20 }).passed).toBe(true);
  });
});
