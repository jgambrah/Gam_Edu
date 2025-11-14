"use client";

import { createContext, useState, useContext, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import { useSearchParams } from 'next/navigation';
import type { UserRole } from '@/lib/types';

type RoleContextType = {
  role: UserRole;
  setRole: Dispatch<SetStateAction<UserRole>>;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const params = useSearchParams();
  const initialRole = (params.get('role') as UserRole) || 'Parent';
  const [role, setRole] = useState<UserRole>(initialRole);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
