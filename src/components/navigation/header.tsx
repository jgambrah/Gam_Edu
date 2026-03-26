'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
import { LogOut, Settings, PanelLeft, RefreshCw } from 'lucide-react';
import { navItems } from '@/lib/data';
import { useFirebase, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRole } from '@/context/role-context';
import NotificationBell from './notifications';
import CreditBalance from '@/components/CreditBalance';
import { AppSidebarContent } from './sidebar';

export default function Header() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { auth } = useFirebase();
  const { user } = useUser();
  const pageTitle =
    navItems.find((item) => item.path === pathname)?.title ||
    navItems
      .flatMap((i) => i.subItems || [])
      .find((s) => s.path === pathname)?.title ||
    'Dashboard';

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      setTimeout(() => {
        router.push('/');
      }, 100);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Force a hard reload of the current URL
    window.location.reload();
  };

  const getInitials = (email?: string | null) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <PanelLeft />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 border-r p-0">
            <div className="flex h-full flex-col">
              <AppSidebarContent />
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold md:text-xl">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            title="Refresh Application"
            className="text-slate-500 hover:text-slate-900"
        >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            <span className="sr-only">Refresh</span>
        </Button>
        <CreditBalance />
        <NotificationBell />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.photoURL || ''} alt="User Avatar" />
                <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
