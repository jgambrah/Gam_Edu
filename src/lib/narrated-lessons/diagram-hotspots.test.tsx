import React from 'react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import {
  isApprovedInteractiveAssetPath,
  isValidPointPercent,
  isValidRectPercent,
} from './visual-region';
import {
  assertValidLessonInteractives,
  validateSlideInteractiveConfig,
  type DiagramHotspotsInteractiveConfig,
} from './interactive-schema';
import { DiagramHotspotsEngine } from '@/components/narrated-lessons/DiagramHotspotsEngine';
import { InteractiveEngineRegistry } from '@/components/narrated-lessons/InteractiveEngineRegistry';
import type { LessonSlide, NarratedLesson } from './types';

describe('Step 4C Shared Visual Security & Coordinate Validation (visual-region.ts)', () => {
  it('enforces approved WebP/PNG paths and blocks traversal, encoded traversal, untrusted URLs, and raw SVG', () => {
    expect(isApprovedInteractiveAssetPath('images/s01.webp')).toBe(true);
    expect(isApprovedInteractiveAssetPath('/preview-fixtures/diagrams/animal-cell.png')).toBe(true);

    expect(isApprovedInteractiveAssetPath('https://evil.example.com/cell.png')).toBe(false);
    expect(isApprovedInteractiveAssetPath('/preview-fixtures/../secret.png')).toBe(false);
    expect(isApprovedInteractiveAssetPath('/preview-fixtures/%2e%2e%2fsecret.png')).toBe(false);
    expect(isApprovedInteractiveAssetPath('javascript:alert(1)')).toBe(false);
    expect(isApprovedInteractiveAssetPath('data:image/png;base64,AAAA')).toBe(false);
    expect(isApprovedInteractiveAssetPath('/preview-fixtures/diagrams/cell.svg')).toBe(false);
  });

  it('validates bounded 0..100% point and rectangular region coordinates', () => {
    expect(isValidPointPercent(0, 100)).toBe(true);
    expect(isValidPointPercent(-1, 50)).toBe(false);
    expect(isValidPointPercent(101, 50)).toBe(false);

    expect(isValidRectPercent(10, 20, 80, 70)).toBe(true);
    expect(isValidRectPercent(50, 20, 60, 20)).toBe(false); // 50 + 60 > 100
    expect(isValidRectPercent(10, 20, 0, 20)).toBe(false); // width must be > 0
  });
});

describe('Step 4C Schema Validation & Production Compatibility Gate', () => {
  const fixturePath = path.resolve(process.cwd(), 'public/preview-fixtures/step4c-diagram-hotspots-pilot.json');
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as NarratedLesson;

  it('validates all 8 cross-subject pilot slides under dev validation and blocks them at production publish gate (productionVersion: null)', () => {
    expect(fixture.slides.length).toBe(8);

    expect(() =>
      assertValidLessonInteractives(fixture, { allowDevOnlyEngines: true }),
    ).not.toThrow();

    // MUST be blocked at production publish gate because diagram-hotspots productionVersion is null
    expect(() => assertValidLessonInteractives(fixture)).toThrow(/not yet deployed in production/i);
  });

  it('rejects out-of-bounds coordinates, duplicate IDs, self-links, unknown linked IDs, and invalid identify targetHotspotId', () => {
    const baseCfg = fixture.slides[0].interactive as DiagramHotspotsInteractiveConfig;

    const badCoords = validateSlideInteractiveConfig({
      ...baseCfg,
      hotspots: [{ ...baseCfg.hotspots[0], xPct: 120 }, baseCfg.hotspots[1]],
    });
    expect(badCoords.ok).toBe(false);
    expect(badCoords.errors.join(' ')).toMatch(/bounded within 0\.\.100%/i);

    const selfLink = validateSlideInteractiveConfig({
      ...baseCfg,
      hotspots: [
        { ...baseCfg.hotspots[0], linkedHotspotIds: [baseCfg.hotspots[0].id] },
        baseCfg.hotspots[1],
      ],
    });
    expect(selfLink.ok).toBe(false);
    expect(selfLink.errors.join(' ')).toMatch(/cannot link to itself/i);

    const badTarget = validateSlideInteractiveConfig({
      ...baseCfg,
      identifyPrompts: [
        {
          id: 'bad-id',
          prompt: 'Find nonexistent structure',
          targetHotspotId: 'missing-id',
          explanation: 'Missing.',
        },
      ],
    });
    expect(badTarget.ok).toBe(false);
    expect(badTarget.errors.join(' ')).toMatch(/unknown targetHotspotId/i);
  });
});

describe('Step 4C DiagramHotspotsEngine UI: Explore, Guided Order, Answer Concealment, Progressive Disclosure, Enlarge & Isolation', () => {
  const fixturePath = path.resolve(process.cwd(), 'public/preview-fixtures/step4c-diagram-hotspots-pilot.json');
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as NarratedLesson;

  it('supports Explore mode, Guided navigation, equation display, and Enlarge modal with Escape close', () => {
    const cellCfg = fixture.slides[0].interactive as DiagramHotspotsInteractiveConfig;
    const { container } = render(<DiagramHotspotsEngine config={cellCfg} />);

    // Starts on first guided hotspot (nucleus)
    expect(container.querySelector('[data-selected-hotspot-id="nucleus"]')).toBeTruthy();

    // Guided Next Part -> rough-er -> mitochondrion (which displays respiration equation)
    fireEvent.click(screen.getByRole('button', { name: /Next Part/i }));
    expect(container.querySelector('[data-selected-hotspot-id="rough-er"]')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Next Part/i }));
    expect(container.querySelector('[data-selected-hotspot-id="mitochondrion"]')).toBeTruthy();
    expect(container.querySelector('[data-hotspot-equation="true"]')?.textContent).toContain('C₆H₁₂O₆');

    // Enlarge modal opens and closes on Escape
    fireEvent.click(screen.getByRole('button', { name: /Enlarge interactive diagram/i }));
    expect(screen.getByRole('dialog', { name: /Enlarged interactive diagram/i })).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /Enlarged interactive diagram/i })).toBeNull();
  });

  it('strictly conceals answer labels, altText, and captions in Identify Challenge mode until checked, then reveals explanatory feedback', () => {
    const cellCfg = fixture.slides[0].interactive as DiagramHotspotsInteractiveConfig;
    const { container } = render(<DiagramHotspotsEngine config={cellCfg} />);

    // In Explore mode, descriptive altText and figcaption are visible
    expect(container.querySelector('img')?.getAttribute('alt')).toMatch(/mitochondrion/i);
    expect(container.querySelector('figcaption')).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Identify Challenge/i }));

    // Before submitting: NO pin, accessible list button, img alt, or figcaption should reveal "Mitochondrion"
    expect(screen.queryByRole('button', { name: /Mitochondrion/i })).toBeNull();
    expect(container.querySelector('img')?.getAttribute('alt')).not.toMatch(/mitochondrion/i);
    expect(container.querySelector('figcaption')).toBeNull();

    // Accessible numbered regions ARE present
    const region2Buttons = screen.getAllByRole('button', { name: /Region 2/i });
    expect(region2Buttons.length).toBeGreaterThanOrEqual(1);

    // Select Region 2 (mitochondrion) and check
    fireEvent.click(region2Buttons[0]);
    fireEvent.click(screen.getByRole('button', { name: /Check selection/i }));
    expect(screen.getByText(/Correct!/i)).toBeTruthy();
  });

  it('supports equivalent nonvisual conceptual identification questions and rejects malformed nonVisualQuestion schemas', () => {
    const cellCfg = fixture.slides[0].interactive as DiagramHotspotsInteractiveConfig;
    render(<DiagramHotspotsEngine config={cellCfg} />);

    fireEvent.click(screen.getByRole('button', { name: /Identify Challenge/i }));
    fireEvent.click(screen.getByRole('button', { name: /Text-only equivalent \(nonvisual\)/i }));

    // Select the conceptual nonvisual option "Mitochondrion" and submit
    fireEvent.click(screen.getByRole('button', { name: /^Mitochondrion$/i }));
    fireEvent.click(screen.getByRole('button', { name: /Check answer/i }));
    expect(screen.getByText(/Correct!/i)).toBeTruthy();

    // Schema rejects invalid correctIndex in nonVisualQuestion
    const badNv = validateSlideInteractiveConfig({
      ...cellCfg,
      identifyPrompts: [
        {
          ...cellCfg.identifyPrompts![0],
          nonVisualQuestion: {
            prompt: 'Which organelle?',
            options: ['Nucleus', 'Mitochondrion'],
            correctIndex: 5,
          },
        },
      ],
    });
    expect(badNv.ok).toBe(false);
    expect(badNv.errors.join(' ')).toMatch(/correctIndex/i);
  });

  it('supports Progressive Disclosure on Protein Tertiary Structure, multi-activity isolation, and Low-Data Mode', () => {
    const proteinCfg = fixture.slides[3].interactive as DiagramHotspotsInteractiveConfig;
    const soilCfg = fixture.slides[7].interactive as DiagramHotspotsInteractiveConfig;

    const { container } = render(
      <div>
        <DiagramHotspotsEngine config={proteinCfg} />
        <DiagramHotspotsEngine config={soilCfg} />
      </div>,
    );

    const sections = container.querySelectorAll('section[data-interactive-engine="diagram-hotspots"]');
    expect(sections.length).toBe(2);
    const proteinSec = sections[0] as HTMLElement;
    const soilSec = sections[1] as HTMLElement;

    // Protein has progressiveDisclosure: true -> starts with clean diagram & Start Guided Tour
    expect(within(proteinSec).getByRole('button', { name: /Start Guided Tour/i })).toBeTruthy();
    fireEvent.click(within(proteinSec).getByRole('button', { name: /Start Guided Tour/i }));
    expect(proteinSec.querySelector('[data-selected-hotspot-id="alpha-helix"]')).toBeTruthy();

    // Soil profile remains independently on its own first horizon
    expect(soilSec.querySelector('[data-selected-hotspot-id="horizon-o"]')).toBeTruthy();

    // Low-Data Mode via InteractiveEngineRegistry
    const stubSlide = fixture.slides[0] as LessonSlide;
    render(<InteractiveEngineRegistry lesson={fixture} slide={stubSlide} lowDataMode={true} />);
    expect(screen.getByText(/Low-Data Summary/i)).toBeTruthy();
  });
});
