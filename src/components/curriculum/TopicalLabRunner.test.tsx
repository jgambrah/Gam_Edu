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

describe('MathRenderer', () => {
  it('renders $$\\begin{aligned}…$$ as display maths', () => {
    const { container } = render(<MathRenderer content={'$$\\begin{aligned} x &= 1 \\\\ y &= 2 \\end{aligned}$$'} />);
    expect(container.querySelector('.katex-display')).not.toBeNull();
    expect(container.querySelector('.katex-error')).toBeNull();
  });
});
