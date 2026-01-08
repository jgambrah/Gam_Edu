
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Building2, GraduationCap, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirebase, useUser } from '@/firebase'; 
import { useRole } from '@/context/role-context'; 
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/client-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { navItems } from '@/lib/data';
import type { NavItem, UserRole } from '@/lib/types';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarFooter } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';

function isNavItemVisible(item: NavItem, role: UserRole | null) {
  if (item.roles === 'all') return true;
  if (!role) return false;
  // Handle Admin alias
  const effectiveRole = (role === 'Administrator' || role === 'Director') ? 'Admin' : role;
  return item.roles.includes(effectiveRole) || item.roles.includes(role);
}

function NavLink({ item, isSubItem = false }: { item: NavItem, isSubItem?: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === item.path;
  
  return (
    <Link
      href={item.path}
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

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { auth } = useFirebase();
  const { role, profile, loading } = useRole(); 

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
       // Add a small delay to ensure state clears, then redirect
      setTimeout(() => {
        router.push('/');
      }, 100);
    }
  };

  const isSubItemActive = (item: NavItem) => {
    return item.subItems?.some(sub => pathname === sub.path) ?? false;
  };

  const filteredNav = navItems.filter(item => isNavItemVisible(item, role));
  
  const getInitials = (email?: string | null) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold text-primary">CampusConnect</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {loading ? (
            <div className="space-y-2 px-2">
             {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded animate-pulse"/>)}
           </div>
          ) : filteredNav.map((item) =>
            isNavItemVisible(item, role) ? (
              <SidebarMenuItem key={item.path}>
                {item.subItems && item.subItems.filter(sub => isNavItemVisible(sub, role)).length > 0 ? (
                  <Collapsible defaultOpen={isSubItemActive(item)}>
                    <CollapsibleTrigger asChild>
                      <button 
                        className={cn(
                          'flex w-full items-center justify-between gap-2 rounded-md p-2 text-left text-sm',
                          'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors h-8'
                        )}
                      >
                        <div className='flex items-center gap-2'>
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <ul className="mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5">
                            {item.subItems.map(subItem => isNavItemVisible(subItem, role) && (
                            <li key={subItem.path} className="list-none">
                                <NavLink item={subItem} isSubItem />
                            </li>
                            ))}
                        </ul>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <NavLink item={item} />
                )}
              </SidebarMenuItem>
            ) : null
          )}
          {/* ONLY SHOW FOR THE CEO */}
          {user?.email === 'jamesgambrah@gmail.com' && (
            <SidebarMenuItem>
                 <Link href="/dashboard/super-admin" className="text-purple-600 font-bold flex items-center gap-2 p-2 bg-purple-50 rounded mt-4">
                    <Building2 className="h-5 w-5"/> CEO Portal
                </Link>
            </SidebarMenuItem>
            )}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user?.photoURL || ''}
              alt="User Avatar"
            />
            <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium truncate">
              {profile?.firstName || user?.displayName || user?.email || "User"}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {loading ? 'Loading...' : role || 'No Role'}
            </span>
          </div>
        </div>
         <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-9"
            onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
