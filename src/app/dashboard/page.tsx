"use client";

import { Loader2 } from "lucide-react";

export default function DashboardLandingPage() {
  // This page intentionally displays NOTHING except a loader.
  // The RoleGuard (in layout.tsx) handles the redirection to:
  // - /dashboard/students
  // - /dashboard/parents
  // - /dashboard/staff
  
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-muted-foreground">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p>Redirecting to your portal...</p>
    </div>
  );
}
