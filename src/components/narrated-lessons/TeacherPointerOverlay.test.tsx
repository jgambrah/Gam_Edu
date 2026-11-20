import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import lessonData from '@/lib/narrated-lessons/bs7-sci-t1-water-cycle.json';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';
import { NarratedLessonPlayer } from './NarratedLessonPlayer';

const lesson = lessonData as unknown as NarratedLesson;

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, '', '/narrated-lessons/water-cycle');
});

describe('Teacher Pointer acceptance tests', () => {
  it('1. s03 moves spotlight pointer to Evaporation, Condensation, Precipitation, Collection at exact cue times', () => {
    window.history.replaceState({}, '', '/narrated-lessons/water-cycle?slide=s03');
    const { container } = render(<NarratedLessonPlayer lesson={lesson} />);
    const slider = screen.getByLabelText('Audio progress') as HTMLInputElement;

    const checks = [
      { t: 14.6, id: 's03.c1', label: '1. Evaporation' },
      { t: 23.0, id: 's03.c2', label: '2. Condensation' },
      { t: 29.5, id: 's03.c3', label: '3. Precipitation' },
      { t: 37.3, id: 's03.c4', label: '4. Collection' },
    ];

    for (const c of checks) {
      fireEvent.change(slider, { target: { value: String(c.t) } });
      const overlay = container.querySelector('[data-testid="teacher-pointer-overlay"]');
      expect(overlay).not.toBeNull();
      expect(overlay?.getAttribute('data-cue-id')).toBe(c.id);
      expect(overlay?.getAttribute('data-cue-style')).toBe('spotlight');
      expect(overlay?.textContent).toContain(c.label);
    }
  });

  it('2. Pause, seek backwards 10s, resume: pointer tracks audio time with zero drift', () => {
    window.history.replaceState({}, '', '/narrated-lessons/water-cycle?slide=s03');
    const { container } = render(<NarratedLessonPlayer lesson={lesson} />);
    const slider = screen.getByLabelText('Audio progress') as HTMLInputElement;

    // At 31.0s -> Precipitation (s03.c3)
    fireEvent.change(slider, { target: { value: '31.0' } });
    expect(container.querySelector('[data-testid="teacher-pointer-overlay"]')?.getAttribute('data-cue-id')).toBe(
      's03.c3',
    );

    // Seek backwards 10s -> 21.0s -> Evaporation (s03.c1)
    fireEvent.change(slider, { target: { value: '21.0' } });
    expect(container.querySelector('[data-testid="teacher-pointer-overlay"]')?.getAttribute('data-cue-id')).toBe(
      's03.c1',
    );
  });

  it('3. Speed toggle supports 1.25x and 0.75x while pointer remains synced to audio time', () => {
    window.history.replaceState({}, '', '/narrated-lessons/water-cycle?slide=s03');
    const { container } = render(<NarratedLessonPlayer lesson={lesson} />);
    const speedBtn = screen.getByTitle('Change voice speed');
    expect(speedBtn.textContent).toBe('1x');

    fireEvent.click(speedBtn);
    expect(speedBtn.textContent).toBe('1.25x');

    fireEvent.click(speedBtn);
    expect(speedBtn.textContent).toBe('0.75x');

    const slider = screen.getByLabelText('Audio progress') as HTMLInputElement;
    fireEvent.change(slider, { target: { value: '24.0' } });
    expect(container.querySelector('[data-testid="teacher-pointer-overlay"]')?.getAttribute('data-cue-id')).toBe(
      's03.c2',
    );
  });

  it('4. Pointer: Off hides the pointer and persists preference without breaking playback controls', () => {
    window.history.replaceState({}, '', '/narrated-lessons/water-cycle?slide=s03');
    const { container } = render(<NarratedLessonPlayer lesson={lesson} />);
    const slider = screen.getByLabelText('Audio progress') as HTMLInputElement;
    fireEvent.change(slider, { target: { value: '16.0' } });
    expect(container.querySelector('[data-testid="teacher-pointer-overlay"]')).not.toBeNull();

    const toggle = screen.getByRole('button', { name: /Pointer: On/i });
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: /Pointer: Off/i })).toBeTruthy();
    expect(container.querySelector('[data-testid="teacher-pointer-overlay"]')).toBeNull();
    expect(localStorage.getItem('gamedu_narrated_lesson_pointer_enabled_v1')).toBe('false');
  });

  it('5. Reduced motion CSS rule disables pulse and bounce animations, and pulse is <= 1 Hz (1.4s)', () => {
    window.history.replaceState({}, '', '/narrated-lessons/water-cycle?slide=s02');
    const { container } = render(<NarratedLessonPlayer lesson={lesson} />);
    const slider = screen.getByLabelText('Audio progress') as HTMLInputElement;
    fireEvent.change(slider, { target: { value: '35.0' } });
    const styleEl = container.querySelector('[data-testid="teacher-pointer-overlay"] style');
    expect(styleEl?.textContent).toContain('prefers-reduced-motion: reduce');
    expect(styleEl?.textContent).toContain('animation: none !important');
    expect(styleEl?.textContent).toContain('1.4s');
  });

  it('6. Slides with no cues play normally with no pointer overlay', () => {
    const noCueLesson: NarratedLesson = {
      ...lesson,
      slides: lesson.slides.map((s) => (s.id === 's01' ? { ...s, cues: [] } : s)),
    };
    window.history.replaceState({}, '', '/narrated-lessons/water-cycle?slide=s01');
    const { container } = render(<NarratedLessonPlayer lesson={noCueLesson} />);
    expect(container.querySelector('[data-testid="teacher-pointer-overlay"]')).toBeNull();
    expect(screen.getByText(noCueLesson.slides[0].title)).toBeTruthy();
  });

  it('7. Low-Data mode makes zero network requests for the pointer', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    window.history.replaceState({}, '', '/narrated-lessons/water-cycle?slide=s03');
    render(<NarratedLessonPlayer lesson={lesson} />);
    fireEvent.click(screen.getByRole('button', { name: /Low-Data/i }));
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
