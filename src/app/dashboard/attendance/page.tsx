'use client';

import { Suspense } from 'react';
import { useRole } from '@/context/role-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { DailyAttendanceSheet } from './daily-attendance-sheet';

function AttendancePageContent() {
  const { role } = useRole();
  const canAccess = ['Teacher', 'Administrator', 'Director'].includes(role);

  if (!canAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>This module is only available to Teachers, Administrators, and Directors.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <DailyAttendanceSheet />
    </div>
  );
}

export default function AttendancePage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
        <AttendancePageContent />
    </Suspense>
  );
}
