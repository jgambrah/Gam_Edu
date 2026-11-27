import React from 'react';
import { StudentEnrichmentGate } from '@/components/student-enrichment/StudentEnrichmentGate';

export default function DashboardCodingClubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentEnrichmentGate sectionName="Student Enrichment · Coding & Logic Hub">
      {children}
    </StudentEnrichmentGate>
  );
}
