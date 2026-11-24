import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NarratedLessonPlayer } from './NarratedLessonPlayer';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';

function makeMinimalLesson(curriculum: 'ges' | 'cambridge', visualType: 'svg' | 'illustration'): NarratedLesson {
  return {
    lessonId: `test-${curriculum}-zoom`,
    schemaVersion: '0.3-pilot',
    meta: {
      title: curriculum === 'cambridge' ? 'Cell Structure (Cambridge)' : 'Living Cells (GES)',
      topic: 'Cells',
      strand: 'Diversity of Matter',
      subStrand: 'Living Cells',
      class: curriculum === 'cambridge' ? 'Year 7' : 'Basic 8',
      subject: 'Science',
      term: 1,
      contentStandard: 'CS1',
      indicators: ['IND1'],
      curriculum,
      narrationWordCount: 50,
      estimatedNarrationMinutes: 1,
      estimatedTotalMinutes: 5,
    } as any,
    learningOutcomes: ['Identify cell parts'],
    slides: [
      {
        id: 's01',
        order: 1,
        title: 'Plant Cell Diagram',
        indicatorIds: ['IND1'],
        visual:
          visualType === 'svg'
            ? {
                type: 'svg',
                altText: 'Labelled plant cell diagram',
                svgCode: '<svg viewBox="0 0 1280 720"><rect width="1280" height="720" fill="#eef" /></svg>',
              }
            : {
                type: 'illustration',
                altText: 'Illustration of a microscope in a lab',
                imageUrl: 'https://example.com/s01.webp',
              },
        onScreenText: ['Nucleus controls the cell'],
        narration: { script: 'Look at the plant cell.', wordCount: 5 },
      },
    ],
    checkpoints: [],
    masteryCheck: { items: [], passPercent: 80 },
    summary: { keyTakeaways: ['Cells are the basic unit of life.'], recapScript: 'Well done.' },
    extensionActivity: {
      title: 'Explore',
      materials: ['Notebook'],
      steps: ['Draw a cell'],
      safetyNote: 'Be careful.',
      expectedObservation: 'Clear drawing.',
    },
    vocabulary: [],
  } as unknown as NarratedLesson;
}

describe('NarratedLessonPlayer Enlarged Visual Lightbox (GES / NaCCA & Cambridge)', () => {
  it('opens, zooms (100% -> 125% -> 150% -> reset), and closes on Escape for a GES / NaCCA SVG slide', () => {
    render(<NarratedLessonPlayer lesson={makeMinimalLesson('ges', 'svg')} />);

    // Move from intro step to slide s01
    fireEvent.click(screen.getByRole('button', { name: /Start Narrated Lesson/i }));

    const enlargeBtn = screen.getByRole('button', { name: /Enlarge visual/i });
    fireEvent.click(enlargeBtn);

    const dialog = screen.getByRole('dialog', { name: /Enlarged visual: Plant Cell Diagram/i });
    expect(dialog).toBeTruthy();
    expect(dialog.textContent).toContain('GES / NaCCA');
    expect(screen.getByRole('button', { name: /Reset zoom/i }).textContent).toBe('100%');

    fireEvent.click(screen.getByRole('button', { name: /Zoom in/i }));
    expect(screen.getByRole('button', { name: /Reset zoom/i }).textContent).toBe('125%');

    fireEvent.click(screen.getByRole('button', { name: /Zoom in/i }));
    expect(screen.getByRole('button', { name: /Reset zoom/i }).textContent).toBe('150%');

    fireEvent.click(screen.getByRole('button', { name: /Reset zoom/i }));
    expect(screen.getByRole('button', { name: /Reset zoom/i }).textContent).toBe('100%');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens and closes enlarged illustration view for a Cambridge lesson slide', () => {
    render(<NarratedLessonPlayer lesson={makeMinimalLesson('cambridge', 'illustration')} />);

    fireEvent.click(screen.getByRole('button', { name: /Start Narrated Lesson/i }));
    fireEvent.click(screen.getByRole('button', { name: /Enlarge visual/i }));

    const dialog = screen.getByRole('dialog', { name: /Enlarged visual: Plant Cell Diagram/i });
    expect(dialog.textContent).toContain('Cambridge');
    expect(dialog.querySelector('img')?.getAttribute('src')).toContain('s01.webp');

    fireEvent.click(screen.getByRole('button', { name: /Close enlarged view/i }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
