
'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import the main calendar component. 
// This prevents it from being bundled with the main app, improving load times.
const SchoolCalendarPageContent = dynamic(
  () => import('@/components/dashboard/calendar/calendar-client'),
  { 
    // Show a loading spinner while the main calendar component is being fetched.
    loading: () => (
      <div className="flex min-h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading Calendar...</p>
      </div>
    ),
    // This component will only be rendered on the client-side.
    ssr: false, 
  }
);

export default function CalendarPage() {
  // Render the dynamically imported component directly.
  return <SchoolCalendarPageContent />;
}
