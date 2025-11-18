
"use client";

import { 
  createContext, 
  useState, 
  useContext, 
  type ReactNode, 
  type Dispatch, 
  type SetStateAction, 
  useEffect,
  Suspense 
} from 'react';
import { useSearchParams } from 'next/navigation';
import type { UserRole } from '@/lib/types';
import { useDoc, useFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

type RoleContextType = {
  role: UserRole;
  setRole: Dispatch<SetStateAction<UserRole>>;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

function RoleProviderContent({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('Parent'); // Default role
  const { user } = useUser();
  const { firestore } = useFirebase();

  // Fetch staff role
  const staffDocRef = useMemoFirebase(() => user ? doc(firestore, 'staff', user.uid) : null, [firestore, user]);
  const { data: staffData, isLoading: isStaffLoading } = useDoc<{ role: UserRole }>(staffDocRef);

  // Fetch parent role
  const parentDocRef = useMemoFirebase(() => user ? doc(firestore, 'parents', user.uid) : null, [firestore, user]);
  const { data: parentData, isLoading: isParentLoading } = useDoc(parentDocRef);

  // Fetch student role
  const studentDocRef = useMemoFirebase(() => user ? doc(firestore, 'students', user.uid) : null, [firestore, user]);
  const { data: studentData, isLoading: isStudentLoading } = useDoc(studentDocRef);


  useEffect(() => {
    if (user) {
      if (staffData) {
        setRole(staffData.role);
      } else if (parentData) {
        setRole('Parent');
      } else if (studentData) {
        setRole('Student');
      }
    }
  }, [user, staffData, parentData, studentData]);
  
  const isLoading = isStaffLoading || isParentLoading || isStudentLoading;

  return (
    <RoleContext.Provider value={{ role, setRole }}>
       {isLoading ? <div className="flex min-h-screen w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div> : children}
    </RoleContext.Provider>
  );
}

export function RoleProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="flex min-h-screen w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
      <RoleProviderContent>{children}</RoleProviderContent>
    </Suspense>
  )
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
