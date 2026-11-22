import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { LessonNotesAndQuestions } from './LessonNotesAndQuestions';
import type { LessonNotesPackage } from '@/lib/narrated-lessons/notes-types';

const sampleNotes: LessonNotesPackage = {
  lessonId: 'b7-sci-t3-systems-ecosystem',
  schemaVersion: '0.1-notes-pilot',
  title: 'Notes and Question Series: Ecosystem',
  indicatorIds: ['B7.3.3.1.1'],
  sectionSummaries: [
    {
      sectionId: 'secA',
      title: 'What Is an Ecosystem?',
      points: ['An ecosystem has living and non-living parts.'],
    },
  ],
  comprehensiveNotes: [
    {
      id: 'n7',
      sectionId: 'secA',
      heading: 'Studying an ecosystem safely',
      paragraphs: ['Compare two safe places with your teacher.'],
      keyTerms: [{ term: 'ecosystem', meaning: 'Living and non-living parts interacting.' }],
      exampleTable: {
        caption: 'Example only.',
        columns: ['', 'Place 1', 'Place 2'],
        rows: [['Location', 'Under tree', 'Sunny field']],
      },
    },
  ],
  questionSeries: [
    {
      exemplarId: 'E1',
      exemplarText: 'An ecosystem is a self-sustaining unit.',
      slideIds: ['s02'],
      questions: [
        {
          id: 'E1.1',
          type: 'trap',
          prompt: 'What is an ecosystem?',
          tryFirstHint: 'Think of living and non-living things.',
          answer: 'Living things and non-living surroundings interacting.',
          teacherExplanation: ['Mention both living and non-living parts.'],
          memoryAid: 'Living + non-living + interact.',
          commonConfusion: 'Pupils forget non-living parts.',
          misconceptionRef: 's02',
          verify: '[VERIFY] INTERNAL_ONLY_DO_NOT_SHOW',
        },
      ],
    },
  ],
  strandSummary: null,
  verifyFlags: [{ claim: 'INTERNAL_CLAIM_HIDDEN', reason: '[VERIFY] hidden' }],
};

describe('LessonNotesAndQuestions', () => {
  it('renders section summaries, comprehensive notes table, and never exposes verifyFlags', () => {
    const onChangeStage = vi.fn();
    render(
      <LessonNotesAndQuestions
        notes={sampleNotes}
        stage="notes"
        onChangeStage={onChangeStage}
      />,
    );

    expect(screen.getByText('What Is an Ecosystem?')).toBeTruthy();
    expect(screen.getByText('An ecosystem has living and non-living parts.')).toBeTruthy();
    expect(screen.queryByText(/INTERNAL_CLAIM_HIDDEN/i)).toBeNull();

    // Switch to Comprehensive Notes tab and verify exampleTable renders
    fireEvent.click(screen.getByRole('button', { name: /Comprehensive Notes/i }));
    expect(screen.getByText('Studying an ecosystem safely')).toBeTruthy();
    expect(screen.getByText('Sunny field')).toBeTruthy();
    expect(screen.getByText('Example only.')).toBeTruthy();
  });

  it('reveals hints, answers, slide jump, and hides internal verify strings', () => {
    const onChangeStage = vi.fn();
    const onJumpToSlide = vi.fn();
    render(
      <LessonNotesAndQuestions
        notes={sampleNotes}
        stage="questions"
        onChangeStage={onChangeStage}
        onJumpToSlide={onJumpToSlide}
        validSlideIds={new Set(['s02'])}
      />,
    );

    expect(screen.getByText('What is an ecosystem?')).toBeTruthy();
    expect(screen.queryByText(/Model Answer/i)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Try-First Hint/i }));
    expect(screen.getByText(/Think of living and non-living things/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Show Answer/i }));
    expect(screen.getByText(/Living things and non-living surroundings interacting/i)).toBeTruthy();
    expect(screen.getByText(/Living \+ non-living \+ interact/i)).toBeTruthy();
    expect(screen.queryByText(/INTERNAL_ONLY_DO_NOT_SHOW/i)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Review Slide S02/i }));
    expect(onJumpToSlide).toHaveBeenCalledWith('s02');
  });
});
