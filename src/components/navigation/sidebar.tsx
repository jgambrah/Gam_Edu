
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  GraduationCap,
  LogOut,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/client-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { navItems } from '@/lib/data';
import type { NavItem, UserRole } from '@/lib/types';
import {
  Sidebar,
  SidebarContent as UiSidebarContent,
  SidebarHeader,
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

function isNavItemVisible(item: NavItem, role: UserRole | null) {
  if (item.roles === 'all') return true;
  if (!role) return false;
  // Handle Admin alias
  const effectiveRole =
    role === 'Administrator' || role === 'Director' ? 'Admin' : role;
  return item.roles.includes(effectiveRole) || item.roles.includes(role);
}

function NavLink({
  item,
  isSubItem = false,
}: {
  item: NavItem;
  isSubItem?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.path;

  return (
    <Link
      href={item.path}
      target={item.path.startsWith('http') ? '_blank' : undefined}
      rel={item.path.startsWith('http') ? 'noopener noreferrer' : undefined}
      className={cn(
        'flex w-full items-center gap-2 rounded-md p-2 text-left text-sm outline-none transition-colors',
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        'focus-visible:ring-2 focus-visible:ring-sidebar-ring',
        isSubItem ? 'h-7 text-xs' : 'h-8 text-sm',
        isActive && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{item.title}</span>
    </Link>
  );
}

// This is the new reusable content component
export function AppSidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { auth } = useFirebase();
  const { role, profile, loading } = useRole();

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      setTimeout(() => {
        router.push('/');
      }, 100);
    }
  };

  const isSubItemActive = (item: NavItem) => {
    return item.subItems?.some((sub) => pathname === sub.path) ?? false;
  };

  const filteredNav = navItems.filter((item) => isNavItemVisible(item, role));

  const getInitials = (email?: string | null) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold text-primary">GAM Edu</span>
        </div>
      </SidebarHeader>

      <UiSidebarContent>
        <SidebarMenu>
          {loading ? (
            <div className="space-y-2 px-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`sidebar-skeleton-${i}`}
                  className="h-8 animate-pulse rounded bg-slate-100"
                />
              ))}
            </div>
          ) : (
            filteredNav.map((item, index) =>
              isNavItemVisible(item, role) ? (
                <SidebarMenuItem key={`nav-${item.path}-${index}`}>
                  {item.subItems &&
                  item.subItems.filter((sub) => isNavItemVisible(sub, role))
                    .length > 0 ? (
                    <Collapsible defaultOpen={isSubItemActive(item)}>
                      <CollapsibleTrigger asChild>
                        <button
                          className={cn(
                            'flex h-8 w-full items-center justify-between gap-2 rounded-md p-2 text-left text-sm',
                            'transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <ul className="mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5">
                          {item.subItems.map(
                            (subItem, subIndex) =>
                              isNavItemVisible(subItem, role) && (
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
            <div className="p-2">
              <Link
                href="/dashboard/super-admin"
                className="mt-6 mb-2 flex items-center gap-3 rounded-lg bg-purple-100 px-3 py-2 font-bold text-purple-700 transition-all hover:bg-purple-200 border border-purple-300"
              >
                <Building2 className="h-5 w-5" />
                <span>CEO Portal</span>
              </Link>
            </div>
          )}
      </UiSidebarContent>

      <SidebarFooter>
        {process.env.NODE_ENV === 'development' && <RoleSwitcher />}
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.photoURL || ''} alt="User Avatar" />
            <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="truncate text-sm font-medium">
              {profile?.firstName || user?.displayName || user?.email || 'User'}
            </span>
            <span className="text-xs capitalize text-muted-foreground">
              {loading ? 'Loading...' : role || 'No Role'}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          className="h-9 w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </>
  );
}

// The default export is now the static desktop sidebar
export default function AppSidebar() {
  return (
    <Sidebar>
      <AppSidebarContent />
    </Sidebar>
  );
}
