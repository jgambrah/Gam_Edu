import React from 'react';
import { StudentEnrichmentGate } from '@/components/student-enrichment/StudentEnrichmentGate';

export default function EnrichmentSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentEnrichmentGate sectionName="Student Enrichment · Maths Club">
      {children}
    </StudentEnrichmentGate>
  );
}