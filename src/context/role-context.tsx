
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
import type { UserRole } from '@/lib/types';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type RoleContextType = {
  role: UserRole;
  setRole: Dispatch<SetStateAction<UserRole>>;
  isRoleLoading: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

function RoleProviderContent({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<UserRole>('Parent');
    const { isUserLoading } = useUser();
    const searchParams = useSearchParams();

    useEffect(() => {
        const roleFromURL = searchParams.get('role');
        if (roleFromURL) {
            setRole(roleFromURL as UserRole);
        }
    }, [searchParams]);

    if (isUserLoading) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      )
    }

    return (
        <RoleContext.Provider value={{ role, setRole, isRoleLoading: isUserLoading }}>
            {children}
        </RoleContext.Provider>
    );
}

export function RoleProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense>
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

export function RoleGuard({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
      if (!isUserLoading && !user && pathname !== '/') {
        router.push('/');
      }
  }, [isUserLoading, user, pathname, router]);

  if (isUserLoading && pathname !== '/') {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    )
  }
  
  return <>{children}</>;
}
