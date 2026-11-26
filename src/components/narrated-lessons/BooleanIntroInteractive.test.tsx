import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BooleanIntroInteractive } from './BooleanIntroInteractive';

describe('BooleanIntroInteractive (Chapter 10A Intro Slides)', () => {
  it('verifies all 4 computer laboratory access combinations on intro01', () => {
    render(<BooleanIntroInteractive lessonId="igcse-cs-boolean-logic-a" slideId="intro01" />);

    const idSwitch = screen.getByRole('switch', { name: /Valid student ID card/i });
    const permSwitch = screen.getByRole('switch', { name: /Teacher's permission/i });
    const badge = () => screen.getByTestId('lab-output-badge').textContent || '';

    // Initial: ID=Yes, Perm=No -> Denied (0)
    expect(badge()).toContain('Access denied');
    expect(badge()).toContain('Output: 0');

    // ID=Yes, Perm=Yes -> Granted (1)
    fireEvent.click(permSwitch);
    expect(badge()).toContain('Access granted');
    expect(badge()).toContain('Output: 1');

    // ID=No, Perm=Yes -> Denied (0)
    fireEvent.click(idSwitch);
    expect(badge()).toContain('Access denied');
    expect(badge()).toContain('Output: 0');

    // ID=No, Perm=No -> Denied (0)
    fireEvent.click(permSwitch);
    expect(badge()).toContain('Access denied');
    expect(badge()).toContain('Output: 0');
  });

  it('toggles electrical circuit switch and digital signal bits on intro02', () => {
    render(<BooleanIntroInteractive lessonId="igcse-cs-boolean-logic-a" slideId="intro02" />);

    const circuitBtn = screen.getByRole('switch', { name: /Toggle circuit switch/i });
    expect(circuitBtn.textContent).toContain('State 0');
    fireEvent.click(circuitBtn);
    expect(circuitBtn.textContent).toContain('State 1');

    expect(screen.getByText(/Sequence: 0 1 1 0 1 0/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Toggle signal bit 1/i }));
    expect(screen.getByText(/Sequence: 1 1 1 0 1 0/)).toBeTruthy();
  });

  it('verifies both logical rules across all 4 binary combinations on intro03', () => {
    render(<BooleanIntroInteractive lessonId="igcse-cs-boolean-logic-a" slideId="intro03" />);

    const btnA = screen.getByRole('button', { name: /Toggle Input A/i });
    const btnB = screen.getByRole('button', { name: /Toggle Input B/i });
    const ruleBoth = screen.getByRole('button', { name: /Rule 1: Both inputs must be 1/i });
    const ruleEither = screen.getByRole('button', { name: /Rule 2: At least one input must be 1/i });
    const out = () => screen.getByTestId('rules-output-card').textContent || '';

    // Initial: A=1, B=0, Rule=both -> 0
    expect(out()).toContain('Lamp OFF (0)');

    // Rule=either with A=1, B=0 -> 1
    fireEvent.click(ruleEither);
    expect(out()).toContain('Lamp ON (1)');

    // A=0, B=0 with Rule=either -> 0
    fireEvent.click(btnA);
    expect(out()).toContain('Lamp OFF (0)');

    // A=0, B=1 with Rule=either -> 1; with Rule=both -> 0
    fireEvent.click(btnB);
    expect(out()).toContain('Lamp ON (1)');
    fireEvent.click(ruleBoth);
    expect(out()).toContain('Lamp OFF (0)');

    // A=1, B=1 with Rule=both -> 1
    fireEvent.click(btnA);
    expect(out()).toContain('Lamp ON (1)');
  });
});
