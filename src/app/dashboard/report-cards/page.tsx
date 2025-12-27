
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRole } from '@/context/role-context';
import { Loader2 } from 'lucide-react';

const ReportCardManager = dynamic(
  () => import('./report-card-manager'),
  { loading: () => <Loader2 className="mx-auto h-8 w-8 animate-spin" /> }
);

const StudentParentReportCardView = dynamic(
  () => import('./student-parent-view'),
  { loading: () => <Loader2 className="mx-auto h-8 w-8 animate-spin" /> }
);


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
