'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  sidebarMenuButtonVariants,
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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent default link behavior
    const href = `${item.path}?role=${role}`;
    console.log(`Navigating to: ${href}`);
    router.push(href);
  };
  
  return (
    <Link
      href={`${item.path}?role=${role}`}
      onClick={handleClick}
      className={cn(
        sidebarMenuButtonVariants({ variant: 'default', size: isSubItem ? 'sm' : 'default' }),
        'w-full',
        pathname === item.path && 'bg-sidebar-accent text-sidebar-accent-foreground'
      )}
    >
      <item.icon />
      <span>{item.title}</span>
    </Link>
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

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
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
                       <div className={cn(
                        sidebarMenuButtonVariants({ variant: 'default' }), 'w-full justify-between'
                      )}>
                       <div className='flex items-center gap-2'>
                        <item.icon />
                        <span>{item.title}</span>
                       </div>
                       <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 [&[data-state=open]]:rotate-90" />
                       </div>
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
      <SidebarFooter>
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
