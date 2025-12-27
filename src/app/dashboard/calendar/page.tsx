
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import the main calendar component
const SchoolCalendarPageContent = dynamic(
  () => import('@/components/dashboard/calendar/calendar-client'),
  { 
    ssr: false, // This component is client-side only, no need for server-side rendering
    loading: () => (
      <div className="flex min-h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading Calendar...</p>
      </div>
    )
  }
);

export default function CalendarPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    }>
      <SchoolCalendarPageContent />
    </Suspense>
  );
}
