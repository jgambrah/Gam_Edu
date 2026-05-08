'use client';

import { useState, useEffect } from 'react';
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
import { LogOut, Settings, PanelLeft, RefreshCw, User as UserIcon, Search, Command } from 'lucide-react';
import { navItems } from '@/lib/data';
import { useFirebase, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import NotificationBell from './notifications';
import CreditBalance from '@/components/CreditBalance';
import { AppSidebarContent } from './sidebar';
import { Input } from '@/components/ui/input';

export default function Header() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { auth: authInstance } = useFirebase();
  const { user } = useUser();
  
  const pageTitle =
    navItems.find((item) => item.path === pathname)?.title ||
    navItems
      .flatMap((i) => i.subItems || [])
      .find((s) => s.path === pathname)?.title ||
    'Dashboard';

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

  // Shortcut listener for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const searchInput = document.getElementById("global-search");
        searchInput?.focus();
      }
    }
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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
        
        {/* Page Title - Hidden when search is focused on mobile */}
        <h1 className={cn(
            "text-lg font-black text-slate-900 tracking-tight uppercase italic md:text-xl transition-all duration-300",
            searchFocused ? "hidden md:block opacity-0 lg:opacity-100" : "block opacity-100"
        )}>
            {pageTitle}
        </h1>
      </div>

      {/* GLOBAL SEARCH / COMMAND BAR */}
      <div className={cn(
          "flex-1 max-w-md transition-all duration-300 mx-4",
          searchFocused ? "max-w-xl scale-[1.02]" : "max-w-md"
      )}>
          <div className="relative group">
              <Search className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                  searchFocused ? "text-indigo-600" : "text-slate-400"
              )} />
              <Input 
                  id="global-search"
                  placeholder="Quick search (⌘+K)" 
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full pl-10 pr-12 h-10 bg-slate-100/50 border-transparent focus:bg-white focus:border-indigo-300 transition-all rounded-xl text-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 opacity-40 pointer-events-none">
                  <Command className="h-3 w-3" />
                  <span className="text-[10px] font-bold">K</span>
              </div>
          </div>
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
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
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
                <AvatarImage src={user?.photoURL || ''} alt="User Avatar" className="object-cover" />
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

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
