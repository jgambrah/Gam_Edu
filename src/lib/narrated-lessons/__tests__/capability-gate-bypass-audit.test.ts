/**
 * Audit CP3 (item 8): scoped capability activation must not be bypassable by omitting or understating `minEngineVersion`,
 * and a dev-only capability must never become publishable because a sibling capability was activated.
 * Uses genuine, valid pilot fixtures (they pass the dev gate) and mutates ONLY the version declaration.
 */
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { assertValidLessonInteractives, SUPPORTED_INTERACTIVE_ENGINES } from '../interactive-schema';

const load = (f: string) => JSON.parse(fs.readFileSync(path.resolve('public/preview-fixtures', f), 'utf8'));
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
const strict = { allowDevOnlyEngines: false };

function mutate(lesson: any, fn: (act: any) => void) {
  const l = clone(lesson);
  for (const s of l.slides) {
    if (!s.interactive) continue;
    for (const a of Array.isArray(s.interactive) ? s.interactive : [s.interactive]) fn(a);
  }
  return l;
}

// capability -> (fixture, labKind) for the four DEV-ONLY construction-lab capabilities and their introducing version
const GATED: Array<[string, string, string]> = [
  ['measurement-lab 1.4.0', 'step5c-measurement-lab-pilot.json', 'measurement-lab'],
  ['data-stats-lab 1.5.0', 'step5d-data-stats-pilot.json', 'data-stats-lab'],
  ['geometry-constructor 5E 1.6.0', 'step5e-geometry-extensions-pilot.json', 'geometry-constructor'],
  ['number-manipulative 1.7.0', 'step5f-number-manipulatives-pilot.json', 'number-manipulative'],
  ['physics-workbench 1.10.0 (Step 5G, dev-only)', 'step5g-physics-workbench-pilot.json', 'physics-workbench'],
];

describe('scoped capability gate: version-declaration bypass attempts', () => {
  for (const [name, file, kind] of GATED) {
    describe(name, () => {
      const base = load(file);
      it('genuine fixture is valid under the dev gate but blocked under the production gate', () => {
        expect(() => assertValidLessonInteractives(base, { allowDevOnlyEngines: true })).not.toThrow();
        expect(() => assertValidLessonInteractives(base, strict)).toThrow();
      });
      it('BYPASS 1: deleting minEngineVersion from every activity must not make it publishable', () => {
        const l = mutate(base, (a) => { if (a.labKind === kind || a.engine === 'construction-lab') delete a.minEngineVersion; });
        expect(() => assertValidLessonInteractives(l, strict), 'minEngineVersion omitted').toThrow();
      });
      it('BYPASS 2: understating minEngineVersion as 1.0.0 must not make it publishable', () => {
        const l = mutate(base, (a) => { if (a.engine === 'construction-lab') a.minEngineVersion = '1.0.0'; });
        expect(() => assertValidLessonInteractives(l, strict), 'minEngineVersion 1.0.0').toThrow();
      });
      it('BYPASS 3: declaring the production version (1.3.0) must not make it publishable', () => {
        const l = mutate(base, (a) => { if (a.engine === 'construction-lab') a.minEngineVersion = '1.3.0'; });
        expect(() => assertValidLessonInteractives(l, strict), 'minEngineVersion 1.3.0').toThrow();
      });
    });
  }

  it('the two ACTIVATED chemistry capabilities remain publishable (no over-blocking) and legacy 1.x lessons still validate', () => {
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].productionCapabilities).toEqual({
      'construction-lab:atom-bond-builder': '1.9.0',
      'construction-lab:equation-balancer': '1.9.0',
    });
    for (const f of ['step4d-construction-lab-pilot.json', 'step4e-atom-bond-pilot.json']) {
      expect(() => assertValidLessonInteractives(load(f), strict), f).not.toThrow();
    }
  });
});
