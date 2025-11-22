
'use client';

import { useRole } from '@/context/role-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyAttendanceSheet } from './daily-attendance-sheet';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Daily Attendance</h1>
        <Button asChild variant="outline">
            <Link href="/dashboard/attendance/sign-in-out">Switch to Sign-In/Out Console</Link>
        </Button>
       </div>
      <DailyAttendanceSheet />
    </div>
  );
}

export default function AttendancePage() {
  return (
      <AttendancePageContent />
  );
}

    