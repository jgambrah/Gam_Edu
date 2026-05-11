'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useRole } from '@/context/role-context';
import { 
  Users, 
  GraduationCap, 
  Search, 
  Loader2, 
  User, 
  School,
  Megaphone,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [queryText, setQueryText] = React.useState('');
  const [results, setResults] = React.useState<{
    students: any[];
    staff: any[];
    classes: any[];
  }>({ students: [], staff: [], classes: [] });
  const [loading, setLoading] = React.useState(false);
  
  const router = useRouter();
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();
  const { role } = useRole();

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Search execution logic
  React.useEffect(() => {
    if (!queryText.trim() || !firestore || !schoolId) {
      setResults({ students: [], staff: [], classes: [] });
      return;
    }

    const executeSearch = async () => {
      setLoading(true);
      try {
        const term = queryText.toLowerCase();
        
        // 1. Search Students
        const studentSnap = await getDocs(
          query(collection(firestore, 'students'), where('schoolId', '==', schoolId), limit(50))
        );
        const filteredStudents = studentSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter((s: any) => 
            s.firstName?.toLowerCase().includes(term) || 
            s.lastName?.toLowerCase().includes(term) ||
            s.studentId?.toLowerCase().includes(term) ||
            s.email?.toLowerCase().includes(term)
          )
          .slice(0, 5);

        // 2. Search Staff (Admins/Directors/Teachers see this)
        let filteredStaff: any[] = [];
        const isStaff = ['Administrator', 'Director', 'Teacher'].includes(role || '');
        
        if (isStaff) {
          const staffSnap = await getDocs(
            query(collection(firestore, 'staff'), where('schoolId', '==', schoolId), limit(50))
          );
          filteredStaff = staffSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter((s: any) => 
              s.firstName?.toLowerCase().includes(term) || 
              s.lastName?.toLowerCase().includes(term) ||
              s.email?.toLowerCase().includes(term)
            )
            .slice(0, 5);
        }

        // 3. Search Classes
        const classSnap = await getDocs(
          query(collection(firestore, 'classes'), where('schoolId', '==', schoolId), limit(20))
        );
        const filteredClasses = classSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter((c: any) => c.name?.toLowerCase().includes(term))
          .slice(0, 5);

        setResults({
          students: filteredStudents,
          staff: filteredStaff,
          classes: filteredClasses
        });
      } catch (e) {
        console.error("Quick Search Error:", e);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(executeSearch, 300);
    return () => clearTimeout(debounce);
  }, [queryText, firestore, schoolId, role]);

  const onSelect = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 bg-slate-100/50 hover:bg-white hover:border-indigo-300 border border-transparent transition-all rounded-xl group shadow-inner"
      >
        <Search className="h-4 w-4 group-hover:text-indigo-600 transition-colors" />
        <span className="font-medium">Quick search...</span>
        <div className="ml-auto hidden md:flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-bold text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search students, staff or classes..." 
          onValueChange={setQueryText}
        />
        <CommandList className="max-h-[450px]">
          <CommandEmpty>
            {loading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scanning School Silo...</span>
                </div>
            ) : "No matching records found."}
          </CommandEmpty>
          
          {results.students.length > 0 && (
            <CommandGroup heading="Students">
              {results.students.map(s => (
                <CommandItem key={s.id} onSelect={() => onSelect(`/dashboard/students-v3?search=${s.firstName}`)}>
                  <GraduationCap className="mr-2 h-4 w-4 text-indigo-500" />
                  <div className="flex flex-col">
                    <span className="font-bold">{s.firstName} {s.lastName}</span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">ID: {s.studentId || s.id.slice(0,8)}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {results.staff.length > 0 && (
            <CommandGroup heading="Staff & Teachers">
              {results.staff.map(s => (
                <CommandItem key={s.id} onSelect={() => onSelect(`/dashboard/staff-management-v2`)}>
                  <User className="mr-2 h-4 w-4 text-purple-500" />
                  <div className="flex flex-col">
                    <span className="font-bold">{s.firstName} {s.lastName}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{s.role}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {results.classes.length > 0 && (
            <CommandGroup heading="Classrooms">
              {results.classes.map(c => (
                <CommandItem key={c.id} onSelect={() => onSelect(`/dashboard/academics`)}>
                  <School className="mr-2 h-4 w-4 text-emerald-500" />
                  <span className="font-bold">{c.name}</span>
                  <Badge variant="outline" className="ml-auto text-[10px] uppercase font-black tracking-widest opacity-50">View Dashboard</Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />
          
          <CommandGroup heading="System Shortcuts">
            <CommandItem onSelect={() => onSelect('/dashboard/announcements')}>
              <Megaphone className="mr-2 h-4 w-4 text-orange-500" />
              <span>Post Announcement</span>
              <ArrowRight className="ml-auto h-3 w-3 opacity-30" />
            </CommandItem>
            <CommandItem onSelect={() => onSelect('/dashboard/accounts')}>
              <CreditCard className="mr-2 h-4 w-4 text-blue-500" />
              <span>Billing Center</span>
              <ArrowRight className="ml-auto h-3 w-3 opacity-30" />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
