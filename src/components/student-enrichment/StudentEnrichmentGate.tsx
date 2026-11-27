'use client';

import React from 'react';
import Link from 'next/link';
import { Construction, Lock, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import {
  evaluateStudentEnrichmentAccess,
  type StudentEnrichmentReleaseStatus,
} from '@/lib/student-enrichment-release';

export interface StudentEnrichmentGateProps {
  children: React.ReactNode;
  sectionName?: string;
  /** Optional override for deterministic UI testing. */
  releaseStatusOverride?: StudentEnrichmentReleaseStatus;
}

export function StudentEnrichmentGate({
  children,
  sectionName = 'Student Enrichment',
  releaseStatusOverride,
}: StudentEnrichmentGateProps) {
  const { user, isUserLoading } = useUser();
  const { role, loading: isRoleLoading } = useRole();

  const decision = evaluateStudentEnrichmentAccess({
    role,
    email: user?.email,
    uid: user?.uid,
    releaseStatusOverride,
  });

  if (decision.status === 'released') {
    return <>{children}</>;
  }

  if (isUserLoading || isRoleLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-[50vh] items-center justify-center p-6 text-slate-600"
      >
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          <span>Checking Student Enrichment access…</span>
        </div>
      </div>
    );
  }

  if (!decision.allowed) {
    return (
      <div className="mx-auto flex min-h-[65vh] max-w-xl items-center justify-center px-4 py-12">
        <section
          aria-labelledby="enrichment-under-construction-title"
          data-student-enrichment-gate="restricted"
          className="w-full rounded-2xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Construction className="h-6 w-6" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-900">
                <Lock className="h-3 w-3" />
                Under Construction
              </span>
              <h1
                id="enrichment-under-construction-title"
                className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl"
              >
                {sectionName} is Currently Under Construction
              </h1>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            The GAM EDU Student Enrichment programme (Narrated Lessons, Interactive Labs, and Coding
            Club) is actively being developed and reviewed. Student access is temporarily restricted
            until official release approval is granted by the school administration.
          </p>

          <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
            All core school management services (classes, attendance, fees, timetable, and reports)
            remain fully available as normal.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
              >
                Sign in (Authorised Reviewer / Staff)
              </Link>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div data-student-enrichment-gate="authorized-preview">
      <div
        role="note"
        className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-950"
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-amber-700" />
            <span>
              <strong>{sectionName} · Under Construction:</strong> Authorised Admin / Reviewer
              access active. Ordinary student access remains restricted until official release.
            </span>
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}
