
'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { DailyAttendanceSheet } from './daily-attendance-sheet';

export default function AttendancePage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
        <DailyAttendanceSheet />
    </Suspense>
  );
}
