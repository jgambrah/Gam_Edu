'use client';

import { useState, useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase, useDoc, useUser } from '@/firebase';
import { collection, query, where, orderBy, doc, addDoc, serverTimestamp, Timestamp, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { History, Clock, AlertTriangle, UserCheck, Loader2, Calendar as CalendarIcon, Printer, MapPin, ShieldAlert, ArrowDownLeft, ArrowUpRight, Camera, Zap } from 'lucide-react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { useCurrentSchool } from '@/hooks/use-current-school';
import type { Staff, StaffAttendance } from '@/lib/types';
import { notifyStaffByUidAction } from '@/app/actions/notifications';
import { useToast } from '@/hooks/use-toast';

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

  // 1. Fetch Staff
  const staffQuery = useMemoFirebase(() =>
    (firestore && schoolId) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId), orderBy('firstName')) : null
  , [firestore, schoolId]);
  const { data: staffList, isLoading: isLoadingStaff } = useCollection<Staff>(staffQuery);

  // 2. Fetch Attendance Logs
  const attendanceQuery = useMemoFirebase(() =>
    (firestore && schoolId) ? query(collection(firestore, 'staff_attendance'), where('schoolId', '==', schoolId), orderBy('timestamp', 'desc')) : null
  , [firestore, schoolId]);
  const { data: attendanceLogs, isLoading: isLoadingLogs } = useCollection<StaffAttendance>(attendanceQuery);

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

  // 3. Filter and process data
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

  if (!canAccess) {
    return <Card><CardHeader><CardTitle>Access Denied</CardTitle></CardHeader></Card>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-slate-800"><UserCheck className="text-indigo-600"/> Staff Attendance Audit</h1>
          <p className="text-muted-foreground">Monitor proximity verification, identity matching, and working hours.</p>
        </div>
        <div className="flex gap-2">
            <Button 
                onClick={handleInitiateSpotCheck} 
                disabled={isInitiating} 
                variant="destructive" 
                className="bg-red-600 hover:bg-red-700 h-11 px-6 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-200"
            >
                {isInitiating ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <Zap className="h-4 w-4 mr-2"/>}
                Trigger Liveness Check
            </Button>
            <Button onClick={() => window.print()} variant="outline" className="h-11 border-2 font-bold"><Printer className="mr-2 h-4 w-4"/> Print Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2"><CardTitle className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Logs</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-black">{stats.total}</p></CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2"><CardTitle className="text-[10px] font-black uppercase text-orange-400 tracking-widest">Identity Flags</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-black text-orange-600">{stats.identityIssues}</p></CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2"><CardTitle className="text-[10px] font-black uppercase text-red-400 tracking-widest">GPS Flags</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-black text-red-600">{stats.flagged}</p></CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2"><CardTitle className="text-[10px] font-black uppercase text-amber-400 tracking-widest">Late Arrivals</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-black text-amber-600">{stats.late}</p></CardContent>
        </Card>
        <Card className="border-l-4 border-l-rose-500">
          <CardHeader className="pb-2"><CardTitle className="text-[10px] font-black uppercase text-rose-400 tracking-widest">Early Leavers</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-black text-rose-600">{stats.early}</p></CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full sm:w-[300px] justify-start text-left font-normal border-2 h-11 bg-white")}>
                  <CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
                  {dateRange?.from ? (dateRange.to ? <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</> : format(dateRange.from, "LLL dd, y")) : <span>Pick a date range</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
              </PopoverContent>
            </Popover>
            <Select onValueChange={setSelectedStaffId} value={selectedStaffId}>
              <SelectTrigger className="w-full sm:w-[250px] border-2 h-11 bg-white"><SelectValue placeholder="All Staff" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Staff</SelectItem>
                {staffList?.map(s => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Staff Member</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Timestamp</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Timing</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Identity</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest text-right">Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map(log => {
                    const logDate = log.timestamp.toDate();
                    
                    return (
                        <TableRow key={log.id} className={cn("hover:bg-slate-50 transition-colors", (log.isIdentityFlagged || log.isFlagged) && "bg-red-50/20")}>
                            <TableCell>
                                <div className="font-bold text-slate-800">{log.staffName}</div>
                                <div className="text-[10px] text-slate-400 font-medium uppercase">{log.staffId.slice(0, 8)}</div>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm font-medium">{format(logDate, 'PPP')}</div>
                                <div className="text-xs text-slate-500 font-bold">{format(logDate, 'h:mm a')}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {log.type === 'In' ? (
                                        <>
                                            <Badge className="bg-indigo-600 gap-1"><ArrowDownLeft className="h-3 w-3"/> In</Badge>
                                            {log.status === 'Late' && (
                                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">LATE</Badge>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Badge variant="secondary" className="gap-1"><ArrowUpRight className="h-3 w-3"/> Out</Badge>
                                            {log.leftEarly && (
                                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">EARLY</Badge>
                                            )}
                                        </>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                {log.isIdentityFlagged ? (
                                    <div className="flex flex-col gap-1">
                                        <Badge variant="destructive" className="w-fit text-[10px] uppercase font-black">⚠️ Identity Mismatch</Badge>
                                        <span className="text-[9px] text-red-600 max-w-[150px] leading-tight truncate font-bold" title={log.identityNotes}>
                                            {log.identityNotes}
                                        </span>
                                    </div>
                                ) : log.identityNotes?.includes('missing') ? (
                                    <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 text-[9px] font-black uppercase">No Profile Pic</Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[9px] font-black uppercase">Verified ID</Badge>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => setPhotoToView(log.verificationPhotoUrl)} 
                                  className="text-[10px] font-black text-indigo-600 h-6 px-1 mt-1 block"
                                >
                                  <Camera className="h-3 w-3 inline mr-1"/> View Proof
                                </Button>
                            </TableCell>
                             <TableCell className="text-right">
                                <div className="flex flex-col items-end gap-1">
                                    {log.isFlagged ? (
                                        <Badge variant="destructive" className="text-[9px] font-black uppercase">⚠️ Off-Site ({log.distanceMeters}m)</Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-black uppercase">On-Site</Badge>
                                    )}
                                    {log.latitude && log.longitude && (
                                        <a href={`https://www.google.com/maps?q=${log.latitude},${log.longitude}`} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-blue-600 hover:underline">
                                            Map View
                                        </a>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
                {filteredLogs.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-20 text-slate-400 italic">No records match the current filters.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={!!photoToView} onOpenChange={() => setPhotoToView(null)}>
        <DialogContent className="rounded-[2.5rem] border-8 border-slate-100">
            <DialogHeader><DialogTitle className="text-xl font-black uppercase tracking-tight">Identity Verification Photo</DialogTitle></DialogHeader>
            {photoToView && <img src={photoToView} alt="Verification" className="w-full aspect-video object-cover rounded-2xl shadow-inner" />}
            <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest mt-2">Captured during clock-in event</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
