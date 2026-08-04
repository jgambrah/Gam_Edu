'use client';

import React from 'react';
import ParentForum from '@/components/community/parent-forum';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { Loader2 } from 'lucide-react';

export default function ForumPage() {
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
  const { user, isUserLoading } = useUser();
  const { role } = useRole();

  if (isLoadingSchool || isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        <p className="text-xs font-black uppercase text-slate-400 font-mono">Loading Community Forum & AI Guard...</p>
      </div>
    );
  }

  const currentUserRole: 'parent' | 'teacher' | 'admin' = 
    role === 'admin' || role === 'super_admin' ? 'admin' : role === 'teacher' ? 'teacher' : 'parent';

  return (
    <div className="p-6">
      <ParentForum 
        schoolId={schoolId || 'default-school'}
        currentUser={{
          id: user?.uid || 'guest-user',
          name: user?.displayName || user?.email?.split('@')[0] || 'School Member',
          role: currentUserRole
        }}
      />
    </div>
  );
}
