// @vitest-environment jsdom
/**
 * D-017: the Clubs & Activities page is a navigation hub, not a restricted feature. It must stay reachable for everyone,
 * keep general links (Live Classroom) unmarked, and tell users which entries are Under Construction.
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

let mockUser: any = { uid: 'u1' };
let mockRole: string | null = 'Student';
let mockLoading = false;
vi.mock('@/firebase', () => ({ useUser: () => ({ user: mockUser, isUserLoading: false }) }));
vi.mock('@/context/role-context', () => ({ useRole: () => ({ role: mockRole, loading: mockLoading }) }));
vi.mock('next/link', () => ({ default: ({ href, children }: any) => <a href={href}>{children}</a> }));

import ClubsPage from './page';

afterEach(() => { cleanup(); mockUser = { uid: 'u1' }; mockRole = 'Student'; mockLoading = false; });

describe('Clubs & Activities hub', () => {
  it('is not restricted: it always renders its links, including for students', () => {
    render(<ClubsPage />);
    expect(screen.getByText('Clubs & Activities')).toBeTruthy();
    const hrefs = [...document.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/dashboard/maths-club-v2');
    expect(hrefs).toContain('/dashboard/live-classroom');
  });

  it('marks every Student Enrichment card "Under construction" for students but never Live Classroom', () => {
    render(<ClubsPage />);
    const badges = screen.getAllByTestId('under-construction-badge');
    expect(badges.length).toBe(9); // 9 enrichment clubs
    expect(badges[0].textContent).toBe('Under construction');
    const live = document.querySelector('a[href="/dashboard/live-classroom"]')!;
    expect(live.querySelector('[data-testid="under-construction-badge"]')).toBeNull();
  });

  it('staff preview roles see the "staff preview" wording', () => {
    mockRole = 'Teacher';
    render(<ClubsPage />);
    expect(screen.getAllByTestId('under-construction-badge')[0].textContent).toContain('staff preview');
  });

  it('shows no badges once Student Enrichment is released', async () => {
    vi.stubEnv('NEXT_PUBLIC_STUDENT_ENRICHMENT_RELEASED', 'true');
    render(<ClubsPage />);
    expect(screen.queryAllByTestId('under-construction-badge')).toHaveLength(0);
    vi.unstubAllEnvs();
  });
});
