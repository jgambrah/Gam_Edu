
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuSub,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { navItems } from '@/lib/data';
import { AppLogo } from '@/components/icons/app-logo';
import { useRole } from '@/context/role-context';
import type { NavItem, UserRole } from '@/lib/types';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

function isNavItemVisible(item: NavItem, role: UserRole | null) {
  if (item.roles === 'all') {
    return true;
  }
  if (!role) {
    return false;
  }
  return item.roles.includes(role);
}

function NavLink({ item, isSubItem = false }: { item: NavItem, isSubItem?: boolean }) {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  
  const isActive = pathname === item.path;
  
  return (
    <Link
      href={item.path}
      onClick={handleClick}
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
  const { role } = useRole();
  const { user } = useUser();

  const isSubItemActive = (item: NavItem) => {
    return item.subItems?.some(sub => pathname === sub.path) ?? false;
  };
  
  const getInitials = (email?: string | null) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  }


  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <AppLogo className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold text-primary">CampusConnect</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) =>
            isNavItemVisible(item, role) ? (
              <SidebarMenuItem key={item.path}>
                {item.subItems ? (
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
                      <SidebarMenuSub>
                        {item.subItems.map(subItem => isNavItemVisible(subItem, role) && (
                          <li key={subItem.path} className="list-none">
                            <NavLink item={subItem} isSubItem />
                          </li>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <NavLink item={item} />
                )}
              </SidebarMenuItem>
            ) : null
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
              {user?.email ?? 'Demo User'}
            </span>
            <span className="text-xs text-muted-foreground">{role}</span>
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}
