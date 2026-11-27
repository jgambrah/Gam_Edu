import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_UID,
  evaluateStudentEnrichmentAccess,
  getStudentEnrichmentReleaseStatus,
} from '@/lib/student-enrichment-release';

let mockUser: { email?: string | null; uid?: string } | null = null;
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

  it('restricts Student, Parent, Accountant, and unauthenticated users during under-construction', () => {
    for (const role of ['Student', 'Parent', 'Accountant', null]) {
      expect(
        evaluateStudentEnrichmentAccess({
          role,
          email: 'learner@school.edu.gh',
          uid: 'u-1',
          releaseStatusOverride: 'under-construction',
        }),
      ).toEqual({
        allowed: false,
        status: 'under-construction',
        reason: 'restricted-under-construction',
      });
    }
  });

  it('allows Super Admin, Director, Administrator, Teacher, and designated reviewer emails during under-construction', () => {
    expect(
      evaluateStudentEnrichmentAccess({
        role: null,
        email: SUPER_ADMIN_EMAIL,
        releaseStatusOverride: 'under-construction',
      }),
    ).toMatchObject({ allowed: true, reason: 'super-admin' });

    expect(
      evaluateStudentEnrichmentAccess({
        role: null,
        uid: SUPER_ADMIN_UID,
        releaseStatusOverride: 'under-construction',
      }),
    ).toMatchObject({ allowed: true, reason: 'super-admin' });

    for (const role of ['Director', 'Administrator', 'Teacher']) {
      expect(
        evaluateStudentEnrichmentAccess({
          role,
          email: 'staff@school.edu.gh',
          releaseStatusOverride: 'under-construction',
        }),
      ).toMatchObject({ allowed: true, reason: 'authorized-role' });
    }

    expect(
      evaluateStudentEnrichmentAccess({
        role: null,
        email: 'Reviewer@External.Org',
        releaseStatusOverride: 'under-construction',
        reviewerEmailsOverride: 'reviewer@external.org, qa@gam-it-service.app',
      }),
    ).toMatchObject({ allowed: true, reason: 'designated-reviewer' });
  });

  it('grants unrestricted access to students when owner sets release status to released', () => {
    expect(
      evaluateStudentEnrichmentAccess({
        role: 'Student',
        email: 'student@school.edu.gh',
        releaseStatusOverride: 'released',
      }),
    ).toEqual({
      allowed: true,
      status: 'released',
      reason: 'released',
    });
  });

  it('renders under-construction notice for Student, reviewer banner + content for Director, and clean content when released', () => {
    // 1. Ordinary Student -> restricted notice, child NOT rendered
    mockUser = { email: 'student@school.edu.gh', uid: 'stu-1' };
    mockRole = 'Student';
    mockUserLoading = false;
    mockRoleLoading = false;
    const { rerender } = render(
      <StudentEnrichmentGate releaseStatusOverride="under-construction">
        <div>Secret Enrichment Lesson</div>
      </StudentEnrichmentGate>,
    );
    expect(screen.getByText(/Currently Under Construction/i)).toBeTruthy();
    expect(screen.queryByText('Secret Enrichment Lesson')).toBeNull();

    // 2. Director -> authorised preview banner + child rendered
    mockUser = { email: 'director@school.edu.gh', uid: 'dir-1' };
    mockRole = 'Director';
    rerender(
      <StudentEnrichmentGate releaseStatusOverride="under-construction">
        <div>Secret Enrichment Lesson</div>
      </StudentEnrichmentGate>,
    );
    expect(screen.getByText(/Authorised Admin \/ Reviewer access active/i)).toBeTruthy();
    expect(screen.getByText('Secret Enrichment Lesson')).toBeTruthy();

    // 3. Released -> Student sees child with zero under-construction banner
    mockUser = { email: 'student@school.edu.gh', uid: 'stu-1' };
    mockRole = 'Student';
    rerender(
      <StudentEnrichmentGate releaseStatusOverride="released">
        <div>Secret Enrichment Lesson</div>
      </StudentEnrichmentGate>,
    );
    expect(screen.queryByText(/Under Construction/i)).toBeNull();
    expect(screen.getByText('Secret Enrichment Lesson')).toBeTruthy();
  });
});
