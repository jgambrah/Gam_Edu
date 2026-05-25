'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, PanelLeft, RefreshCw, User as UserIcon } from 'lucide-react';
import { navItems } from '@/lib/data';
import { useFirebase, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import NotificationBell from './notifications';
import CreditBalance from '@/components/CreditBalance';
import { AppSidebarContent } from './sidebar';
import { GlobalSearch } from './global-search';
import { useRole } from '@/context/role-context';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { auth: authInstance } = useFirebase();
  const { user } = useUser();
  const { role, profile } = useRole();
  
  const pageTitle = useMemo(() => {
    // Find item with correct role
    const item = navItems.find((item) => 
        item.path === pathname && 
        (item.roles === 'all' || item.roles.includes(role as any))
    );
    if (item) return item.title;

    const subItem = navItems
      .flatMap((i) => i.subItems || [])
      .find((s) => 
          s.path === pathname && 
          (s.roles === 'all' || s.roles.includes(role as any))
      );
    
    return subItem?.title || 'Dashboard';
  }, [pathname, role]);

  const handleLogout = async () => {
    if (authInstance) {
      await signOut(authInstance);
      setTimeout(() => {
        router.push('/');
      }, 100);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  const getInitials = (email?: string | null) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-slate-200/50 bg-white/70 backdrop-blur-lg px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <PanelLeft />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 border-r p-0 bg-indigo-950">
            <div className="flex h-full flex-col">
              <AppSidebarContent />
            </div>
          </SheetContent>
        </Sheet>
        
        <h1 className="text-lg font-black text-slate-900 tracking-tight uppercase italic md:text-xl hidden lg:block">
            {pageTitle}
        </h1>
      </div>

      {/* QUICK SEARCH INTEGRATION */}
      <div className="flex-1 max-w-md mx-4">
          <GlobalSearch />
      </div>

      <div className="flex items-center gap-2">
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            title="Refresh Application"
            className="text-slate-400 hover:text-slate-900 rounded-xl"
        >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin text-indigo-600")} />
            <span className="sr-only">Refresh</span>
        </Button>
        
        <div className="hidden sm:block">
            <CreditBalance />
        </div>
        
        <NotificationBell />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-slate-100 shadow-sm overflow-hidden p-0">
              <Avatar className="h-full w-full rounded-none">
                <AvatarImage src={profile?.photoURL || user?.photoURL || ''} alt="User Avatar" className="object-cover" />
                <AvatarFallback className="bg-slate-50 text-indigo-600 font-bold">{getInitials(user?.email)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-slate-200 shadow-2xl">
            <DropdownMenuLabel className="px-2 py-1.5 font-bold text-slate-900">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-2" />
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/dashboard/profile" className="flex items-center w-full">
                <UserIcon className="mr-2 h-4 w-4 text-slate-500" />
                <span className="font-medium text-sm">My Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
              <Link href="/dashboard/help" className="flex items-center w-full">
                <Settings className="mr-2 h-4 w-4 text-slate-500" />
                <span className="font-medium text-sm">Help Center</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mx-2" />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer rounded-xl font-bold">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
