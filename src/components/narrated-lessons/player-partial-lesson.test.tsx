// @vitest-environment jsdom
/**
 * Found by the real-browser sweep: 8 of 13 pilot fixtures have no masteryCheck (and 4f no checkpoints), and the player
 * crashed to a blank page for them. Partial/legacy lesson JSON must render, not throw.
 */
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import { NarratedLessonPlayer } from './NarratedLessonPlayer';
import { normalizeFixtureForPlayer } from '../../../tests/e2e/harness/normalize';

vi.mock('next/link', () => ({ default: ({ href, children }: any) => <a href={href}>{children}</a> }));

// The fixtures are partial lessons (no meta/askTeacherContext etc.). The harness normaliser fills the structural fields the
// player legitimately requires; the player itself must tolerate the absent masteryCheck/checkpoints (the defect found).
const fixture = (name: string) => normalizeFixtureForPlayer(JSON.parse(fs.readFileSync(path.resolve('public/preview-fixtures', name), 'utf8')));

describe('player with partial lesson JSON', () => {
  for (const name of ['step4e-atom-bond-pilot.json', 'step4f-geometry-pilot.json', 'step5c-measurement-lab-pilot.json', 'step5e-geometry-extensions-pilot.json']) {
    it(`renders ${name} (no masteryCheck${name.startsWith('step4f') ? ', no checkpoints' : ''}) without throwing`, () => {
      const lesson = fixture(name);
      window.history.replaceState({}, '', `/?slide=${lesson.slides[0].id}`);
      expect(() => render(<NarratedLessonPlayer lesson={lesson} />)).not.toThrow();
      expect(screen.getAllByText(lesson.slides[0].title).length).toBeGreaterThan(0);
    });
  }

  it('a lesson with no mastery items has no Mastery step in the navigation', () => {
    const lesson = fixture('step5c-measurement-lab-pilot.json');
    window.history.replaceState({}, '', `/?slide=${lesson.slides[0].id}`);
    const { container } = render(<NarratedLessonPlayer lesson={lesson} />);
    expect(container.textContent).not.toMatch(/0-Item Mastery/);
  });
});
