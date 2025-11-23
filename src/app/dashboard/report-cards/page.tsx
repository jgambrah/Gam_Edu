'use client';

import { Suspense } from 'react';
import { useRole } from '@/context/role-context';
import ReportCardManager from './report-card-manager';
import StudentParentReportCardView from './student-parent-view';
import { Loader2 } from 'lucide-react';

function ReportCardPageContent() {
  const { role, isRoleLoading } = useRole();

  if (isRoleLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (role === 'Student' || role === 'Parent') {
    return <StudentParentReportCardView />;
  }

  return <ReportCardManager />;
}

export default function ReportCardsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
        <ReportCardPageContent />
    </Suspense>
  )
}
