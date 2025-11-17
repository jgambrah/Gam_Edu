'use client';

import { usePathname, useRouter } from 'next/navigation';
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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import React from 'react';

function isNavItemVisible(item: NavItem, role: UserRole) {
  return item.roles === 'all' || item.roles.includes(role);
}

function NavLink({ item, role, isSubItem = false }: { item: NavItem, role: UserRole, isSubItem?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile, isMobile } = useSidebar();
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`🔴 CLICK event fired for: ${item.path}`);
    
    if (isMobile) {
      setOpenMobile(false);
    }
    
    router.push(`${item.path}?role=${role}`);
  };

  React.useEffect(() => {
    console.log(`🔵 NavLink for "${item.title}" rendered.`);
  }, [item.title]);
  
  return (
    <button
      onClick={handleClick}
      onMouseDown={() => console.log(`🟡 MOUSEDOWN on ${item.path}`)}
      onMouseUp={() => console.log(`🟢 MOUSEUP on ${item.path}`)}
      className={cn(
        'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2',
        isSubItem ? 'h-7 text-xs' : 'h-8 text-sm',
        pathname === item.path && 'bg-sidebar-accent text-sidebar-accent-foreground'
      )}
      style={{ pointerEvents: 'auto', zIndex: 100 }}
    >
      <item.icon />
      <span>{item.title}</span>
    </button>
  );
}

export default function AppSidebar() {
  const pathname = usePathname();
  const { role } = useRole();
  const { user } = useUser();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-1');

  const isSubItemActive = (item: NavItem) => {
    return item.subItems?.some(sub => pathname === sub.path) ?? false;
  };
  
  React.useEffect(() => {
    console.log(`🔵 AppSidebar rendered.`);
  }, []);

  return (
    <>
      <SidebarHeader style={{ pointerEvents: 'auto', zIndex: 100 }}>
        <div className="flex items-center gap-2">
          <AppLogo className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold text-primary">CampusConnect</span>
        </div>
      </SidebarHeader>
      <SidebarContent style={{ pointerEvents: 'auto', zIndex: 100 }}>
        <SidebarMenu>
          {navItems.map((item) =>
            isNavItemVisible(item, role) ? (
              <SidebarMenuItem key={item.path}>
                {item.subItems ? (
                  <Collapsible defaultOpen={isSubItemActive(item)}>
                    <CollapsibleTrigger asChild>
                       <button 
                        className={cn(
                          'flex w-full items-center justify-between gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2',
                          'h-8 text-sm'
                          )}
                        style={{ pointerEvents: 'auto', zIndex: 100 }}
                        onMouseDown={() => console.log(`🟡 MOUSEDOWN on Collapsible: ${item.title}`)}
                       >
                         <div className='flex items-center gap-2' style={{ pointerEvents: 'none' }}>
                          <item.icon />
                          <span>{item.title}</span>
                         </div>
                         <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" style={{ pointerEvents: 'none' }} />
                       </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subItems.map(subItem => isNavItemVisible(subItem, role) && (
                          <SidebarMenuItem key={subItem.path}>
                            <NavLink item={subItem} role={role} isSubItem />
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <NavLink item={item} role={role} />
                )}
              </SidebarMenuItem>
            ) : null
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter style={{ pointerEvents: 'auto', zIndex: 100 }}>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={userAvatar?.imageUrl}
              alt="User Avatar"
              data-ai-hint={userAvatar?.imageHint}
            />
            <AvatarFallback>U</AvatarFallback>
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
