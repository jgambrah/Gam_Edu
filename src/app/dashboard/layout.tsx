
'use client';

import React from 'react';
import AppSidebar from '@/components/navigation/sidebar';
import { SidebarInset } from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    // The AppSidebar component now correctly wraps the main content area.
    // It provides the consistent sidebar structure.
    <AppSidebar>
      {/* The SidebarInset handles the main content area, creating the correct
          visual separation from the sidebar itself. */}
      <SidebarInset>
        {/* The children, which is the actual page content for each route,
            is rendered inside the inset. */}
        {children}
      </SidebarInset>
    </AppSidebar>
  );
}
