'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LogOut,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirebase, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { navItems } from '@/lib/data';
import type { NavItem, UserRole } from '@/lib/types';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent as UiSidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import RoleSwitcher from './role-switcher';
import { AppLogo } from '@/components/icons/app-logo';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { doc } from 'firebase/firestore';

function isNavItemVisible(item: NavItem, role: UserRole | null, hasFinanceAccess: boolean) {
  if (item.roles === 'all') return true;
  if (!role) return false;

  // SUPPORT STAFF RESTRICTIONS (Excluding Secretary/Receptionist who are Desk-based)
  const isLaborStaff = role === 'Cleaner' || role === 'Security Officer' || role === 'Cook';
  const isRestrictedPath = 
    item.path.includes('/dashboard/academics') || 
    item.path.includes('/dashboard/financials') || 
    item.path.includes('/dashboard/accounts') ||
    item.path.includes('/dashboard/people') ||
    item.path.includes('/dashboard/reports') ||
    item.path.includes('/dashboard/system');

  if (isLaborStaff && isRestrictedPath) {
    return false;
  }

  // FINANCE ACCESS CHECK
  const isFinanceTab = 
    item.path.includes('/dashboard/financials') || 
    item.path.includes('/dashboard/accounts') ||
    item.title.toLowerCase().includes('finance') ||
    item.title.toLowerCase().includes('billing') ||
    item.title.toLowerCase().includes('payroll');

  if (isFinanceTab && !hasFinanceAccess) {
    return false;
  }

  // Handle Admin alias
  const effectiveRole =
    role === 'Administrator' || role === 'Director' ? 'Admin' : role;
  return item.roles.includes(effectiveRole) || item.roles.includes(role);
}

export function AppSidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { auth } = useFirebase();
  const firestore = useFirestore();
  const { role, profile, loading } = useRole();
  const { schoolId } = useCurrentSchool();

  // Dynamic Setting Fetch
  const schoolSettingsRef = useMemoFirebase(
    () => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null,
    [firestore, schoolId]
  );
  const { data: schoolSettings } = useDoc<any>(schoolSettingsRef);

  // Permission Logic
  const hasFinanceAccess = 
    role === 'Director' || 
    role === 'Accountant' || 
    (role === 'Administrator' && schoolSettings?.allowAdminFinanceAccess !== false) ||
    user?.email === 'jamesgambrah@gmail.com';

  const isSubItemActive = (item: NavItem) => {
    return item.subItems?.some((sub) => pathname === sub.path) ?? false;
  };

  const filteredNav = navItems.filter((item) => isNavItemVisible(item, role, hasFinanceAccess));

  const handleSignOut = async () => {
    if (auth) {
      try {
        await signOut(auth);
        router.push('/');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  const getInitials = (email?: string | null) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <SidebarHeader className="border-indigo-900/30">
        <Link href="/dashboard" className="flex items-center gap-3 p-2 group transition-all">
          <AppLogo className="h-9 w-9 shadow-lg shadow-indigo-50/20 rounded-xl group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="text-lg font-black text-white leading-none tracking-tighter">GAM EDU</span>
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">Management</span>
          </div>
        </Link>
      </SidebarHeader>

      <UiSidebarContent>
        <SidebarMenu className="px-2">
          {loading ? (
            <div className="space-y-2 px-2 mt-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`sidebar-skeleton-${i}`}
                  className="h-10 animate-pulse rounded-xl bg-white/5"
                />
              ))}
            </div>
          ) : (
            filteredNav.map((item, index) =>
              isNavItemVisible(item, role, hasFinanceAccess) ? (
                <SidebarMenuItem key={`nav-${item.path}-${index}`} className="my-0.5">
                  {item.subItems &&
                  item.subItems.filter((sub) => isNavItemVisible(sub, role, hasFinanceAccess))
                    .length > 0 ? (
                    <Collapsible defaultOpen={isSubItemActive(item)}>
                      <CollapsibleTrigger asChild>
                        <button
                          className={cn(
                            'flex h-10 w-full items-center justify-between gap-2 rounded-xl p-2.5 text-left text-sm transition-all duration-200',
                            isSubItemActive(item) 
                              ? 'text-white bg-white/5' 
                              : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className={cn('h-4 w-4 shrink-0', isSubItemActive(item) ? 'text-indigo-400' : 'text-slate-500')} />
                            <span className="truncate">{item.title}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <ul className="mx-4 mt-1 flex min-w-0 translate-x-px flex-col gap-1 border-l border-indigo-900/30 px-3 py-1">
                          {item.subItems.map(
                            (subItem, subIndex) =>
                              isNavItemVisible(subItem, role, hasFinanceAccess) && (
                                <li key={`subnav-${subItem.path}-${subIndex}`} className="list-none">
                                  <NavLink item={subItem} isSubItem />
                                </li>
                              )
                          )}
                        </ul>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <NavLink item={item} />
                  )}
                </SidebarMenuItem>
              ) : null
            )
          )}
        </SidebarMenu>
        {user &&
          ((user.email?.toLowerCase() === 'jamesgambrah@gmail.com') ||
            (user.uid === 'L4oE5XWweKRYrhtIXn6hB8IDHBC2')) && (
            <div className="p-4">
              <Link
                href="/dashboard/super-admin"
                className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 px-4 py-3 font-black text-white text-xs uppercase tracking-widest transition-all hover:scale-[1.03] shadow-lg shadow-purple-500/20"
              >
                <Building2 className="h-4 w-4" />
                <span>CEO Portal</span>
              </Link>
            </div>
          )}
      </UiSidebarContent>

      <SidebarFooter className="p-4 gap-4 border-t border-indigo-900/30">
        {process.env.NODE_ENV === 'development' && <RoleSwitcher />}
        <div className="flex items-center gap-3 p-1">
          <Avatar className="h-10 w-10 border-2 border-indigo-900/50 shadow-inner">
            <AvatarImage src={user?.photoURL || ''} alt="User Avatar" className="object-cover" />
            <AvatarFallback className="bg-indigo-900 text-indigo-200 font-bold">{getInitials(user?.email)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-bold text-white leading-none mb-1">
              {profile?.firstName || user?.displayName || user?.email?.split('@')[0] || 'User'}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
              {loading ? '---' : role || 'User'}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          className="h-10 w-full justify-start text-red-400 hover:text-red-100 hover:bg-red-50/20 rounded-xl transition-all"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-bold uppercase text-[10px] tracking-widest">Sign Out</span>
        </Button>
      </SidebarFooter>
    </>
  );
}

export default function AppSidebar() {
  return (
    <Sidebar className="bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 border-r border-indigo-900/50 shadow-2xl">
      <AppSidebarContent />
    </Sidebar>
  );
}
