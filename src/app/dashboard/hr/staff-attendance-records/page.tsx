'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase, useDoc, useUser } from '@/firebase';
import { collection, query, where, orderBy, doc, addDoc, serverTimestamp, Timestamp, getDocs, setDoc, limit, writeBatch } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { 
    History, Clock, AlertTriangle, UserCheck, Loader2, Calendar as CalendarIcon, 
    Printer, MapPin, ShieldAlert, ArrowDownLeft, ArrowUpRight, Camera, Zap, 
    CheckCircle2, Info, Search, XCircle, Activity, LayoutDashboard
} from 'lucide-react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { useCurrentSchool } from '@/hooks/use-current-school';
import type { Staff, StaffAttendance } from '@/lib/types';
import { notifyStaffByUidAction } from '@/app/actions/notifications';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @fileOverview Spot Check Result Component
 * Renders the results of a specific random check session.
 */
function SpotCheckResultView({ checkData, allStaff }: { checkData: any, allStaff: any[] }) {
    const responses = checkData.responses || [];
    
    // 1. Identify who was expected to respond
    // For now we assume all staff except directors/admins are targetable
    const expectedStaff = allStaff.filter(s => !['Director', 'Administrator', 'Admin'].includes(s.role));
    const respondedIds = responses.map((r: any) => r.staffId);
    const ignoredStaff = expectedStaff.filter(s => !respondedIds.includes(s.uid));

    const totalExpected = expectedStaff.length;
    const responseRate = totalExpected > 0 ? Math.round((responses.length / totalExpected) * 100) : 0;
    const isExpired = checkData.status === 'expired' || checkData.status === 'completed';

    return (
        <Card className="border-l-4 border-l-red-500 mb-6 overflow-hidden rounded-[2rem] shadow-lg">
            <CardHeader className="pb-4 flex flex-row items-center justify-between bg-slate-50/50 p-8 border-b">
                <div>
                    <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-800">
                        Check Session: {checkData.initiatedAt?.toDate ? format(checkData.initiatedAt.toDate(), 'PPP p') : 'Just now'}
                    </CardTitle>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        Response Rate: {responseRate}% ({responses.length} / {totalExpected} Personnel)
                    </p>
                </div>
                <Badge 
                    variant={checkData.status === 'active' ? 'default' : 'secondary'} 
                    className={cn(
                        "rounded-xl h-8 px-4 font-black uppercase tracking-widest text-[9px] shadow-sm", 
                        checkData.status === 'active' ? 'bg-red-600 animate-pulse' : 'bg-slate-200 text-slate-500'
                    )}
                >
                    {checkData.status?.toUpperCase()}
                </Badge>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                {/* --- 1. SECURITY BREACHES (OFF CAMPUS) --- */}
                {responses.filter((r: any) => r.isOffCampus).length > 0 && (
                    <div className="space-y-4">
                        <h4 className="font-black text-red-600 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                            <ShieldAlert size={14}/> Security Breach (Location Mismatch)
                        </h4>
                        <div className="grid gap-3">
                            {responses.filter((r: any) => r.isOffCampus).map((r: any) => (
                                <div key={r.staffId} className="flex justify-between items-center p-4 bg-red-50 border-2 border-red-100 rounded-2xl shadow-sm transition-all hover:bg-red-100/50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-red-200">
                                            {r.photoUrl ? <img src={r.photoUrl} className="h-full w-full object-cover" /> : <Loader2 size={12}/>}
                                        </div>
                                        <div>
                                            <span className="font-black text-red-900 uppercase text-sm tracking-tight">{r.staffName || 'Personnel'}</span>
                                            <p className="text-[10px] font-bold text-red-600 uppercase flex items-center gap-1">
                                                <MapPin size={10}/> Distance: {r.distanceMeters} meters from campus
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="destructive" className="font-black text-[9px] uppercase px-3 py-1">Flagged</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- 2. NO RESPONSE (Only visible after expiry) --- */}
                {isExpired && ignoredStaff.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="font-black text-orange-600 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                            <XCircle size={14}/> Verification Ignored (Failed to Respond)
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {ignoredStaff.map(s => (
                                <Badge key={s.uid} variant="outline" className="text-orange-700 border-orange-200 bg-orange-50 font-black uppercase text-[10px] tracking-widest py-2 px-4 rounded-xl shadow-sm">
                                    {s.firstName} {s.lastName}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- 3. PASSED (ACCORDION) --- */}
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="passed" className="border-none">
                        <AccordionTrigger className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] hover:no-underline py-4 bg-emerald-50/50 px-6 rounded-2xl border-2 border-emerald-100/50 shadow-inner group">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-emerald-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                                    <CheckCircle2 size={14} />
                                </div>
                                <span>Verified On-Campus ({responses.filter((r: any) => !r.isOffCampus).length})</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-6">
                                {responses.filter((r: any) => !r.isOffCampus).map((r: any) => (
                                    <div key={r.staffId} className="flex justify-between items-center p-4 bg-white border-2 border-slate-50 rounded-2xl text-sm transition-all hover:border-emerald-200 group">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 group-hover:scale-110 transition-transform">
                                                {r.photoUrl ? <img src={r.photoUrl} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-slate-200"/>}
                                            </div>
                                            <span className="font-bold text-slate-700">{r.staffName || 'Staff Member'}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-emerald-600 font-black text-[10px] uppercase">Verified</span>
                                            <span className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">{r.distanceMeters}m proximity</span>
                                        </div>
                                    </div>
                                ))}
                                {responses.filter((r: any) => !r.isOffCampus).length === 0 && (
                                    <div className="col-span-full py-8 text-center text-slate-400 italic text-sm">No successful verifications recorded.</div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
            <CardFooter className="bg-slate-50/50 py-4 px-8 border-t">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                    * Automated GPS + Vision audit by GAM IT Solutions
                </p>
            </CardFooter>
        </Card>
    );
}

export default function StaffAttendanceRecordsPage() {
  const { role } = useRole();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(new Date(new Date().setDate(new Date().getDate() - 7))),
    to: endOfDay(new Date()),
  });
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [photoToView, setPhotoToView] = useState<string | null>(null);
  const [isInitiating, setIsInitiating] = useState(false);

  const canAccess = role === 'Director' || role === 'Administrator';

  // --- DATA FETCHING ---
  
  // 1. Staff List
  const staffQuery = useMemoFirebase(() =>
    (firestore && schoolId) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId), orderBy('firstName')) : null
  , [firestore, schoolId]);
  const { data: staffList, isLoading: isLoadingStaff } = useCollection<Staff>(staffQuery);

  // 2. Attendance Logs
  const attendanceQuery = useMemoFirebase(() =>
    (firestore && schoolId) ? query(collection(firestore, 'staff_attendance'), where('schoolId', '==', schoolId), orderBy('timestamp', 'desc')) : null
  , [firestore, schoolId]);
  const { data: attendanceLogs, isLoading: isLoadingLogs } = useCollection<StaffAttendance>(attendanceQuery);

  // 3. Spot Check History
  const spotChecksQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    return query(
        collection(firestore, 'spot_checks'),
        where('schoolId', '==', schoolId),
        orderBy('initiatedAt', 'desc'),
        limit(20)
    );
  }, [firestore, schoolId]);
  const { data: spotChecks, isLoading: isLoadingSpotChecks } = useCollection<any>(spotChecksQuery);

  // --- AUTO-COMPLETE EXPIRED CHECKS ---
  useEffect(() => {
    if (!spotChecks || !firestore) return;
    
    const now = new Date();
    const expiredActiveChecks = spotChecks.filter(c => c.status === 'active' && c.expiresAt.toDate() < now);
    
    if (expiredActiveChecks.length > 0) {
      const batch = writeBatch(firestore);
      expiredActiveChecks.forEach(c => {
        batch.update(doc(firestore, 'spot_checks', c.id), { status: 'expired' });
      });
      batch.commit().catch(console.error);
    }
  }, [spotChecks, firestore]);

  // --- ACTIONS ---

  const handleInitiateSpotCheck = async () => {
    if (!firestore || !schoolId || !user) return;
    setIsInitiating(true);
    try {
        const checkRef = doc(collection(firestore, 'spot_checks'));
        const expiresAt = new Date(Date.now() + 15 * 60000);
        
        await setDoc(checkRef, {
            id: checkRef.id,
            schoolId,
            initiatedAt: serverTimestamp(),
            initiatedBy: user.uid,
            expiresAt: Timestamp.fromDate(expiresAt),
            status: 'active',
            responses: []
        });
        
        // Find active staff (those who clocked in today but haven't clocked out)
        const todayStart = startOfDay(new Date());
        
        const qIn = query(
            collection(firestore, 'staff_attendance'),
            where('schoolId', '==', schoolId),
            where('type', '==', 'In'),
            where('timestamp', '>=', Timestamp.fromDate(todayStart))
        );
        const inSnap = await getDocs(qIn);
        
        const qOut = query(
            collection(firestore, 'staff_attendance'),
            where('schoolId', '==', schoolId),
            where('type', '==', 'Out'),
            where('timestamp', '>=', Timestamp.fromDate(todayStart))
        );
        const outSnap = await getDocs(qOut);
        const clockedOutIds = new Set(outSnap.docs.map(d => d.data().staffId));
        
        const activeStaffIds = Array.from(new Set(
            inSnap.docs
                .map(d => d.data().staffId)
                .filter(id => !clockedOutIds.has(id))
        ));
        
        if (activeStaffIds.length > 0) {
            await notifyStaffByUidAction(activeStaffIds, "🚨 Security Spot Check", "Please verify your location immediately. You have 15 minutes.", "/dashboard");
        }
        
        toast({ title: "Spot Check Active", description: `Notified ${activeStaffIds.length} currently clocked-in staff.` });
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Error", description: e.message });
    } finally {
        setIsInitiating(false);
    }
  };

  // --- FILTERING & STATS ---
  const { filteredLogs, stats } = useMemo(() => {
    if (!attendanceLogs) return { filteredLogs: [], stats: { total: 0, late: 0, flagged: 0, early: 0, identityIssues: 0 } };

    const filtered = attendanceLogs.filter(log => {
      if (!log.timestamp) return false;
      const logDate = log.timestamp.toDate();
      if (dateRange?.from && logDate < startOfDay(dateRange.from)) return false;
      if (dateRange?.to && logDate > endOfDay(dateRange.to)) return false;
      if (selectedStaffId !== 'all' && log.staffId !== selectedStaffId) return false;
      return true;
    });

    const lateArrivals = filtered.filter(log => log.type === 'In' && log.status === 'Late').length;
    const earlyDepartures = filtered.filter(log => log.type === 'Out' && log.leftEarly === true).length;
    const flaggedCount = filtered.filter(log => log.isFlagged === true).length;
    const identityIssues = filtered.filter(log => log.isIdentityFlagged === true).length;

    return { 
        filteredLogs: filtered,
        stats: { total: filtered.length, late: lateArrivals, flagged: flaggedCount, early: earlyDepartures, identityIssues }
    };
  }, [attendanceLogs, dateRange, selectedStaffId]);
  
  const isLoading = isLoadingSchool || isLoadingStaff || isLoadingLogs;

  if (!canAccess && !isLoadingSchool) {
    return <Card className="p-8 text-center text-red-600 font-black uppercase tracking-widest"><ShieldAlert size={48} className="mx-auto mb-4"/> Access Denied</Card>;
  }

  return (
    <div className="space-y-6 p-1">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Institutional <span className="text-indigo-600">Audit</span></h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Attendance verification and real-time security tracking.</p>
        </div>
        <div className="flex gap-2 print:hidden">
            <Button 
                onClick={handleInitiateSpotCheck} 
                disabled={isInitiating} 
                className="bg-red-600 hover:bg-black h-12 px-8 font-black uppercase tracking-tighter rounded-2xl shadow-xl shadow-red-200 active:scale-95 transition-all"
            >
                {isInitiating ? <Loader2 className="animate-spin h-5 w-5 mr-2"/> : <Zap className="h-5 w-5 mr-2"/>}
                PULSE CHECK
            </Button>
            <Button onClick={() => window.print()} variant="outline" className="h-12 border-4 border-slate-100 rounded-2xl font-black px-6 hover:bg-slate-50">
                <Printer className="mr-2 h-4 w-4"/> PRINT AUDIT
            </Button>
        </div>
      </div>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-2xl mb-8 flex w-fit gap-1">
            <TabsTrigger value="logs" className="rounded-xl px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-md h-10">
                <History className="mr-2 h-4 w-4"/> Attendance Logs
            </TabsTrigger>
            <TabsTrigger value="spot-checks" className="rounded-xl px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-md h-10">
                <Activity className="mr-2 h-4 w-4"/> Spot Check History
                {spotChecks?.filter((c: any) => c.status === 'active').length > 0 && (
                    <span className="ml-2 h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                )}
            </TabsTrigger>
        </TabsList>

        {/* ── TAB CONTENT: LOGS ── */}
        <TabsContent value="logs" className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="border-none shadow-md bg-white rounded-3xl">
                    <CardHeader className="pb-2 pt-6 px-6 text-center"><CardTitle className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Logs</CardTitle></CardHeader>
                    <CardContent className="pb-6 px-6 text-center"><p className="text-3xl font-black text-slate-900">{stats.total}</p></CardContent>
                </Card>
                <Card className="border-none shadow-md bg-white rounded-3xl">
                    <CardHeader className="pb-2 pt-6 px-6 text-center"><CardTitle className="text-[10px] font-black uppercase text-orange-400 tracking-widest">Identity Flags</CardTitle></CardHeader>
                    <CardContent className="pb-6 px-6 text-center"><p className="text-3xl font-black text-orange-600">{stats.identityIssues}</p></CardContent>
                </Card>
                <Card className="border-none shadow-md bg-white rounded-3xl">
                    <CardHeader className="pb-2 pt-6 px-6 text-center"><CardTitle className="text-[10px] font-black uppercase text-rose-400 tracking-widest">GPS Flags</CardTitle></CardHeader>
                    <CardContent className="pb-6 px-6 text-center"><p className="text-3xl font-black text-rose-600">{stats.flagged}</p></CardContent>
                </Card>
                <Card className="border-none shadow-md bg-white rounded-3xl">
                    <CardHeader className="pb-2 pt-6 px-6 text-center"><CardTitle className="text-[10px] font-black uppercase text-amber-400 tracking-widest">Late Arrivals</CardTitle></CardHeader>
                    <CardContent className="pb-6 px-6 text-center"><p className="text-3xl font-black text-amber-600">{stats.late}</p></CardContent>
                </Card>
                <Card className="border-none shadow-md bg-white rounded-3xl">
                    <CardHeader className="pb-2 pt-6 px-6 text-center"><CardTitle className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Early Leavers</CardTitle></CardHeader>
                    <CardContent className="pb-6 px-6 text-center"><p className="text-3xl font-black text-indigo-600">{stats.early}</p></CardContent>
                </Card>
            </div>

            <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b p-8">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Audit Period</Label>
                        <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full sm:w-[320px] justify-start text-left font-bold border-2 rounded-2xl h-12 bg-white shadow-sm hover:border-indigo-300 transition-all")}>
                            <CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
                            {dateRange?.from ? (dateRange.to ? <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</> : format(dateRange.from, "LLL dd, y")) : <span>Select Range</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                        </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2 flex-grow max-sm">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Staff Filter</Label>
                        <Select onValueChange={setSelectedStaffId} value={selectedStaffId}>
                        <SelectTrigger className="w-full border-2 rounded-2xl h-12 bg-white shadow-sm font-bold"><SelectValue placeholder="All Personnel" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Personnel</SelectItem>
                            {staffList?.map(s => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}
                        </SelectContent>
                        </Select>
                    </div>
                </div>
                </CardHeader>
                <CardContent className="p-0">
                {isLoading ? (
                    <div className="flex justify-center p-32 flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 opacity-20" />
                        <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-300">Synchronizing Ledger...</p>
                    </div>
                ) : (
                    <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest pl-8 py-6">Staff Member</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest">Timestamp</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest text-center">Outcome</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest">Identity Match</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-8">Proximity Audit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLogs.map(log => {
                            const logDate = log.timestamp?.toDate ? log.timestamp.toDate() : new Date();
                            
                            return (
                                <TableRow key={log.id} className={cn("hover:bg-slate-50 transition-colors h-20", (log.isIdentityFlagged || log.isFlagged) && "bg-red-50/10")}>
                                    <TableCell className="pl-8">
                                        <div className="font-black text-slate-800 uppercase tracking-tight">{log.staffName}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {log.staffId.slice(0, 8)}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-bold text-slate-600">{format(logDate, 'PPP')}</div>
                                        <div className="text-[10px] text-slate-400 font-black uppercase">{format(logDate, 'h:mm a')}</div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            {log.type === 'In' ? (
                                                <>
                                                    <Badge className="bg-slate-900 font-black uppercase text-[9px] tracking-widest rounded-xl"><ArrowDownLeft size={10} className="mr-1"/> Arrival</Badge>
                                                    {log.status === 'Late' && (
                                                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 font-black text-[9px] uppercase italic">Punctuality Alert</Badge>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <Badge variant="secondary" className="font-black uppercase text-[9px] tracking-widest rounded-xl"><ArrowUpRight size={10} className="mr-1"/> Departure</Badge>
                                                    {log.leftEarly && (
                                                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-black text-[9px] uppercase italic">Early Exit</Badge>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {log.isIdentityFlagged ? (
                                                <Badge variant="destructive" className="w-fit text-[9px] font-black uppercase italic tracking-tighter">⚠️ Persona Mismatch</Badge>
                                            ) : log.identityNotes?.includes('missing') ? (
                                                <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 text-[9px] font-black uppercase italic">No Master Photo</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-black uppercase italic tracking-widest">Authenticated</Badge>
                                            )}
                                            <button 
                                                onClick={() => setPhotoToView(log.verificationPhotoUrl)}
                                                className="text-[9px] font-black text-indigo-600 uppercase hover:underline flex items-center gap-1 mt-1 transition-all"
                                            >
                                                <Camera size={10}/> View Image Proof
                                            </button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex flex-col items-end gap-1">
                                            {log.isFlagged ? (
                                                <Badge variant="destructive" className="text-[9px] font-black uppercase italic">⚠️ OFF-CAMPUS ({log.distanceMeters}m)</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-black uppercase italic tracking-widest">ON-CAMPUS</Badge>
                                            )}
                                            {log.latitude && (
                                                <a href={`https://www.google.com/maps?q=${log.latitude},${log.longitude}`} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black text-indigo-400 hover:text-indigo-800 uppercase tracking-widest transition-colors flex items-center gap-1">
                                                    <MapPin size={10}/> Map Coordinates
                                                </a>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {filteredLogs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-32 text-slate-300 italic font-black uppercase tracking-[0.3em] text-[10px]">No matches found for your filter</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    </Table>
                )}
                </CardContent>
            </Card>
        </TabsContent>

        {/* ── TAB CONTENT: SPOT CHECKS ── */}
        <TabsContent value="spot-checks" className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6 px-2">
                <div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-800 flex items-center gap-3">
                        <Activity className="text-red-500 h-7 w-7" /> Real-Time <span className="text-red-500">Verification</span>
                    </h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Audit of random presence confirmations.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {isLoadingSpotChecks ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
                        <Loader2 className="h-10 w-10 animate-spin text-red-600" />
                        <p className="font-black text-[10px] uppercase tracking-[0.3em]">Accessing History...</p>
                    </div>
                ) : !spotChecks || spotChecks.length === 0 ? (
                    <div className="text-center py-32 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[40px]">
                        <div className="bg-white p-6 rounded-full w-fit mx-auto mb-6 shadow-sm border-2 border-slate-100">
                            <Activity className="h-16 w-16 text-slate-100" />
                        </div>
                        <p className="text-xl font-black text-slate-300 uppercase tracking-tighter italic">Vault Empty: No Checks Logged</p>
                    </div>
                ) : (
                    spotChecks.map(check => (
                        <SpotCheckResultView key={check.id} checkData={check} allStaff={staffList || []} />
                    ))
                )}
            </div>
        </TabsContent>
      </Tabs>
      
      {/* ── IMAGE PROOF MODAL ── */}
      <Dialog open={!!photoToView} onOpenChange={() => setPhotoToView(null)}>
        <DialogContent className="rounded-[3rem] border-[12px] border-slate-900 p-0 overflow-hidden bg-black max-w-2xl">
            <div className="relative aspect-video">
                <img src={photoToView || ''} alt="Verification" className="w-full h-full object-cover" />
                <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-2xl">
                    <ShieldCheck className="text-emerald-400 h-6 w-6" />
                    <span className="text-white font-black uppercase text-sm tracking-tight italic">Verified Identity Proof</span>
                </div>
                <button 
                  onClick={() => setPhotoToView(null)}
                  className="absolute top-6 right-6 bg-white/10 hover:bg-red-500 hover:scale-110 p-3 rounded-2xl text-white transition-all backdrop-blur-md shadow-2xl"
                >
                  <XCircle size={24}/>
                </button>
            </div>
            <div className="bg-slate-900 p-6 border-t border-white/10 text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Institutional Verification Engine · 2025</p>
            </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
