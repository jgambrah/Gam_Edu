import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { render } from '@testing-library/react';

vi.mock('@/firebase', () => ({ useFirestore: () => null }));
vi.mock('@/lib/firebase', () => ({ db: {} }));
vi.mock('@/lib/achievement-utils', () => ({ awardActivityXP: vi.fn(), triggerStudentBadgeEvent: vi.fn() }));
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

import { TopicalLabRunner } from './TopicalLabRunner';
import { MathRenderer } from './MathRenderer';
import { normalizeTopicalLabDoc } from '@/lib/services/topicalLabService';

// The shared question bank lives in Firestore; these payloads are what the seeders write there.
const payloadDir = path.join(process.cwd(), 'scripts', 'payloads', 'topics');
const payloadFiles = fs.readdirSync(payloadDir).filter((f) => f.endsWith('.json'));

describe('TopicalLabRunner', () => {
  it.each(payloadFiles)('opens %s exactly as stored (no crash on any document shape)', (file) => {
    const topicDoc = JSON.parse(fs.readFileSync(path.join(payloadDir, file), 'utf-8'));
    const { container } = render(<TopicalLabRunner topicDoc={topicDoc} onBack={() => {}} />);
    expect(container.textContent).toContain('All Topical Labs');
    if (topicDoc.title) expect(container.textContent).toContain(topicDoc.title);
  });

  it('accepts strand and sub-strand stored as { code, name } objects', () => {
    const topicDoc: any = {
      id: 'topic_x', topicId: 'topic_x', title: 'Sample Topic', subject: 'Mathematics',
      strand: { code: 'S1', name: 'STRAND 1: NUMBER' }, subStrand: { code: 'SS1', name: 'Number Operations' },
      levels: {}
    };
    const { container } = render(<TopicalLabRunner topicDoc={topicDoc} onBack={() => {}} />);
    expect(container.textContent).toContain('Sample Topic');
  });
});

describe('normalizeTopicalLabDoc', () => {
  it('turns object strands into text and keeps the code', () => {
    const out: any = normalizeTopicalLabDoc({
      strand: { code: 'S2', name: 'STRAND 2: ALGEBRA' }, subStrand: { code: 'SS3', name: 'Linear Equations' }
    } as any);
    expect(out.strand).toBe('STRAND 2: ALGEBRA');
    expect(out.strandCode).toBe('S2');
    expect(out.subStrand).toBe('Linear Equations');
  });

  it('leaves text strands and null untouched', () => {
    expect((normalizeTopicalLabDoc({ strand: 'STRAND 1: NUMBER' } as any) as any).strand).toBe('STRAND 1: NUMBER');
    expect(normalizeTopicalLabDoc(null)).toBeNull();
  });
});

/** Text a pupil would see, with the hidden formula source removed. Raw markup here means broken rendering. */
function visibleText(container: HTMLElement): string {
  container.querySelectorAll('annotation, .katex-mathml, svg').forEach((n) => n.remove());
  return container.textContent || '';
}
const RAW_MARKUP = /\$\$|\*\*|\\begin\{|\\text\{|\\frac|<\/?(details|summary)\b/;

describe('MathRenderer', () => {
  it('renders multi-line $$\\begin{aligned}…$$ as display maths', () => {
    const { container } = render(<MathRenderer content={'$$\\begin{aligned} x &= 1 \\\\\n y &= 2 \\end{aligned}$$'} />);
    expect(container.querySelector('.katex-display')).not.toBeNull();
    expect(container.querySelector('.katex-error')).toBeNull();
    expect(visibleText(container)).not.toMatch(RAW_MARKUP);
  });

  it('leaves a one-line $$…\\begin{cases}…$$ inside a list intact, and keeps rendering what follows', () => {
    const content = '* **Round Off:** look at $r$:\n  $$\\text{Action} = \\begin{cases} a, & r < 5 \\\\ b, & r \\ge 5 \\end{cases}$$\n* **Round Up:** next value.\n\n### Next Section';
    const { container } = render(<MathRenderer content={content} />);
    expect(container.querySelector('.katex-error')).toBeNull();
    expect(container.querySelectorAll('li').length).toBe(2);
    expect(container.querySelector('h3')).not.toBeNull();
    expect(visibleText(container)).not.toMatch(RAW_MARKUP);
  });

  it('shows no raw markup anywhere in the seeded study notes and worked examples', () => {
    const offenders: string[] = [];
    for (const file of payloadFiles.filter((f) => f.startsWith('topic_'))) {
      const topicDoc = JSON.parse(fs.readFileSync(path.join(payloadDir, file), 'utf-8'));
      for (const [levelKey, level] of Object.entries<any>(topicDoc.levels || {})) {
        const texts: string[] = [level.notes];
        for (const ex of level.workedExamples || []) texts.push(ex.problem, ...(ex.steps || []), ex.finalAnswer);
        texts.filter((t) => typeof t === 'string' && t).forEach((t, i) => {
          const { container, unmount } = render(<MathRenderer content={t} />);
          if (container.querySelector('.katex-error') || RAW_MARKUP.test(visibleText(container))) offenders.push(`${file}:${levelKey}#${i}`);
          unmount();
        });
      }
    }
    expect(offenders).toEqual([]);
  }, 120000);
});
