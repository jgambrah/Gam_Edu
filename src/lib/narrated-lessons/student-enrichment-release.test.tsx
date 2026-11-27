import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  evaluateStudentEnrichmentAccess,
  getStudentEnrichmentReleaseStatus,
} from '@/lib/student-enrichment-release';

let mockUser: { uid?: string } | null = null;
let mockUserLoading = false;
let mockRole: string | null = null;
let mockRoleLoading = false;

vi.mock('@/firebase', () => ({
  useUser: () => ({ user: mockUser, isUserLoading: mockUserLoading }),
}));

vi.mock('@/context/role-context', () => ({
  useRole: () => ({ role: mockRole, loading: mockRoleLoading }),
}));

import { StudentEnrichmentGate } from '@/components/student-enrichment/StudentEnrichmentGate';

describe('Student Enrichment Under-Construction Access Gate', () => {
  it('defaults to under-construction when NEXT_PUBLIC_STUDENT_ENRICHMENT_RELEASED is unset', () => {
    expect(getStudentEnrichmentReleaseStatus()).toBe('under-construction');
  });

  it('fails closed while auth or role loading is in progress, and rejects unauthenticated stale roles', () => {
    expect(
      evaluateStudentEnrichmentAccess({
        role: 'Director',
        isAuthenticated: true,
        isLoading: true,
        releaseStatusOverride: 'under-construction',
      }),
    ).toEqual({
      allowed: false,
      status: 'under-construction',
      reason: 'loading-fail-closed',
    });

    // Stale role without active authenticated user MUST be denied
    expect(
      evaluateStudentEnrichmentAccess({
        role: 'Director',
        isAuthenticated: false,
        isLoading: false,
        releaseStatusOverride: 'under-construction',
      }),
    ).toEqual({
      allowed: false,
      status: 'under-construction',
      reason: 'restricted-under-construction',
    });
  });

  it('restricts Student, Parent, Accountant, and unauthenticated users during under-construction', () => {
    for (const role of ['Student', 'Parent', 'Accountant', null]) {
      expect(
        evaluateStudentEnrichmentAccess({
          role,
          isAuthenticated: role !== null,
          releaseStatusOverride: 'under-construction',
        }),
      ).toEqual({
        allowed: false,
        status: 'under-construction',
        reason: 'restricted-under-construction',
      });
    }
  });

  it('allows trusted Director (including Super Admin), Administrator, and Teacher roles during under-construction', () => {
    for (const role of ['Director', 'Administrator', 'Teacher']) {
      expect(
        evaluateStudentEnrichmentAccess({
          role,
          isAuthenticated: true,
          releaseStatusOverride: 'under-construction',
        }),
      ).toMatchObject({ allowed: true, reason: 'authorized-role' });
    }
  });

  it('grants unrestricted access to students when owner sets release status to released', () => {
    expect(
      evaluateStudentEnrichmentAccess({
        role: 'Student',
        isAuthenticated: true,
        releaseStatusOverride: 'released',
      }),
    ).toEqual({
      allowed: true,
      status: 'released',
      reason: 'released',
    });
  });

  it('fails closed on loading, switches cleanly across Director -> Student -> unauthenticated without stale permissions, and opens when released', () => {
    // 1. Loading state -> fails closed, child NOT rendered
    mockUser = { uid: 'dir-1' };
    mockRole = 'Director';
    mockUserLoading = true;
    mockRoleLoading = false;
    const { rerender } = render(
      <StudentEnrichmentGate releaseStatusOverride="under-construction">
        <div>Enrichment Lesson Content</div>
      </StudentEnrichmentGate>,
    );
    expect(screen.getByText(/Checking Student Enrichment access/i)).toBeTruthy();
    expect(screen.queryByText('Enrichment Lesson Content')).toBeNull();

    // 2. Director loaded -> authorised preview banner + child rendered
    mockUserLoading = false;
    rerender(
      <StudentEnrichmentGate releaseStatusOverride="under-construction">
        <div>Enrichment Lesson Content</div>
      </StudentEnrichmentGate>,
    );
    expect(screen.getByText(/Authorised Staff \/ Reviewer access active/i)).toBeTruthy();
    expect(screen.getByText('Enrichment Lesson Content')).toBeTruthy();

    // 3. Switch account to Student -> immediately restricted (zero stale Director permission)
    mockUser = { uid: 'stu-1' };
    mockRole = 'Student';
    rerender(
      <StudentEnrichmentGate releaseStatusOverride="under-construction">
        <div>Enrichment Lesson Content</div>
      </StudentEnrichmentGate>,
    );
    expect(screen.getByText(/Currently Under Construction/i)).toBeTruthy();
    expect(screen.queryByText('Enrichment Lesson Content')).toBeNull();

    // 4. Sign out with stale role string -> still restricted
    mockUser = null;
    mockRole = 'Director';
    rerender(
      <StudentEnrichmentGate releaseStatusOverride="under-construction">
        <div>Enrichment Lesson Content</div>
      </StudentEnrichmentGate>,
    );
    expect(screen.getByText(/Sign in \(Authorised Staff \/ Reviewer\)/i)).toBeTruthy();
    expect(screen.queryByText('Enrichment Lesson Content')).toBeNull();

    // 5. Released -> Student sees child with zero under-construction banner
    mockUser = { uid: 'stu-1' };
    mockRole = 'Student';
    rerender(
      <StudentEnrichmentGate releaseStatusOverride="released">
        <div>Enrichment Lesson Content</div>
      </StudentEnrichmentGate>,
    );
    expect(screen.queryByText(/Under Construction/i)).toBeNull();
    expect(screen.getByText('Enrichment Lesson Content')).toBeTruthy();
  });
});
