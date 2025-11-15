'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { navItems } from '@/lib/data';
import { AppLogo } from '@/components/icons/app-logo';
import { useRole } from '@/context/role-context';
import type { NavItem, UserRole } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

function isNavItemVisible(item: NavItem, role: UserRole) {
  return item.roles === 'all' || item.roles.includes(role);
}

export default function AppSidebar() {
  const pathname = usePathname();
  const { role } = useRole();
  const { user } = useUser();
  const { state } = useSidebar();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-1');

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
                 <Link
                    href={`${item.path}?role=${role}`}
                    className={cn(
                        "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
                        pathname === item.path && 'bg-sidebar-accent text-sidebar-accent-foreground'
                    )}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
