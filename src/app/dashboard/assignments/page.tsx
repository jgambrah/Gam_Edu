'use client';

import { Suspense } from 'react';
import { useRole } from '@/context/role-context';
import { Loader2 } from 'lucide-react';
import TeacherAssignmentsView from './teacher-view';
import StudentAssignmentsView from './student-view';
import AdminAssignmentsView from './admin-view';

function AssignmentsPageContent() {
  const { role } = useRole();

  const renderView = () => {
    switch (role) {
      case 'Teacher':
        return <TeacherAssignmentsView />;
      case 'Student':
        return <StudentAssignmentsView />;
      case 'Administrator':
      case 'Director':
        return <AdminAssignmentsView />;
      default:
        return (
          <div className="text-center py-10">
            <p className="text-muted-foreground">This module is not available for your role.</p>
          </div>
        );
    }
  };

  return <div>{renderView()}</div>;
}

export default function AssignmentsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <AssignmentsPageContent />
    </Suspense>
  );
}
    