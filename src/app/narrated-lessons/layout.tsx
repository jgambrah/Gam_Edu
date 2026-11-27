import React from 'react';
import { StudentEnrichmentGate } from '@/components/student-enrichment/StudentEnrichmentGate';

export default function PublicNarratedLessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentEnrichmentGate sectionName="Student Enrichment · Interactive Lessons">
      {children}
    </StudentEnrichmentGate>
  );
}
