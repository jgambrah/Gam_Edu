'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import ReportCardManager from './report-card-manager';
import StudentParentReportCardView from './student-parent-view';
import { useRole } from '@/context/role-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function ReportCardsPageContent() {
  const { role, loading } = useRole();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (role === 'Student' || role === 'Parent') {
    return <StudentParentReportCardView />;
  }

  const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role || '');

  if (!isStaff) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              You do not have permission to access the report card management portal.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <ReportCardManager />;
}

export default function ReportCardsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <ReportCardsPageContent />
    </Suspense>
  );
}
