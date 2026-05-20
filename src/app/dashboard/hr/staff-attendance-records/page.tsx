'use client';

import { useState, useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { History, Clock, AlertTriangle, UserCheck, Loader2, Calendar as CalendarIcon, Printer, MapPin, ShieldAlert, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { format, startOfDay, endOfDay, setHours, setMinutes } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { useCurrentSchool } from '@/hooks/use-current-school';
import type { Staff, StaffAttendance } from '@/lib/types';

export default function StaffAttendanceRecordsPage() {
  const { role } = useRole();
  const firestore = useFirestore();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(new Date(new Date().setDate(new Date().getDate() - 7))),
    to: endOfDay(new Date()),
  });
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [photoToView, setPhotoToView] = useState<string | null>(null);

  const canAccess = role === 'Director' || role === 'Administrator';

  // 1. Fetch Staff (for the filter dropdown)
  const staffQuery = useMemoFirebase(() =>
    (firestore && schoolId) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId), orderBy('firstName')) : null
  , [firestore, schoolId]);
  const { data: staffList, isLoading: isLoadingStaff } = useCollection<Staff>(staffQuery);

  // 2. Fetch Attendance Logs
  const attendanceQuery = useMemoFirebase(() =>
    (firestore && schoolId) ? query(collection(firestore, 'staff_attendance'), where('schoolId', '==', schoolId), orderBy('timestamp', 'desc')) : null
  , [firestore, schoolId]);
  const { data: attendanceLogs, isLoading: isLoadingLogs } = useCollection<StaffAttendance>(attendanceQuery);

  // 3. Filter and process data
  const { filteredLogs, stats } = useMemo(() => {
    if (!attendanceLogs) return { filteredLogs: [], stats: { total: 0, late: 0, flagged: 0, early: 0 } };

    const filtered = attendanceLogs.filter(log => {
      if (!log.timestamp) return false;
      const logDate = log.timestamp.toDate();

      // Date range filter
      if (dateRange?.from && logDate < startOfDay(dateRange.from)) return false;
      if (dateRange?.to && logDate > endOfDay(dateRange.to)) return false;

      // Staff filter
      if (selectedStaffId !== 'all' && log.staffId !== selectedStaffId) return false;

      return true;
    });

    const lateArrivals = filtered.filter(log => log.type === 'In' && log.status === 'Late').length;
    const earlyDepartures = filtered.filter(log => log.type === 'Out' && log.leftEarly === true).length;
    const flaggedCount = filtered.filter(log => (log as any).isFlagged === true).length;

    return { 
        filteredLogs: filtered,
        stats: { total: filtered.length, late: lateArrivals, flagged: flaggedCount, early: earlyDepartures }
    };
  }, [attendanceLogs, dateRange, selectedStaffId]);
  
  const isLoading = isLoadingSchool || isLoadingStaff || isLoadingLogs;

  if (!canAccess) {
    return <Card><CardHeader><CardTitle>Access Denied</CardTitle></CardHeader></Card>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-slate-800"><UserCheck className="text-indigo-600"/> Staff Attendance Audit</h1>
          <p className="text-muted-foreground">Monitor proximity verification, arrival punctuality, and working hours.</p>
        </div>
        <Button onClick={() => window.print()} variant="outline"><Printer className="mr-2 h-4 w-4"/> Print Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-black uppercase text-slate-400 tracking-widest">Total Logs</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-black">{stats.total}</p></CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-black uppercase text-slate-400 tracking-widest">Off-Campus Flags</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-black text-red-600">{stats.flagged}</p></CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-black uppercase text-slate-400 tracking-widest">Late Arrivals</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-black text-amber-600">{stats.late}</p></CardContent>
        </Card>
        <Card className="border-l-4 border-l-rose-500">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-black uppercase text-slate-400 tracking-widest">Early Departures</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-black text-rose-600">{stats.early}</p></CardContent>
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
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Activity & Punctuality</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Proximity</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Identity</TableHead>
                    <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest">Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map(log => {
                    const logDate = log.timestamp.toDate();
                    const isFlagged = (log as any).isFlagged === true;
                    
                    return (
                        <TableRow key={log.id} className={cn("hover:bg-slate-50 transition-colors", isFlagged && "bg-red-50/30")}>
                            <TableCell>
                                <div className="font-bold text-slate-800">{log.staffName}</div>
                                <div className="text-[10px] font-medium text-slate-400 uppercase">{log.staffId.slice(0, 8)}</div>
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
                                            {log.status === 'Late' ? (
                                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">LATE</Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">ON TIME</Badge>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Badge variant="secondary" className="gap-1"><ArrowUpRight className="h-3 w-3"/> Out</Badge>
                                            {log.leftEarly && (
                                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">LEFT EARLY</Badge>
                                            )}
                                        </>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                {isFlagged ? (
                                    <div className="flex flex-col gap-1">
                                        <Badge variant="destructive" className="w-fit text-[10px] font-black uppercase tracking-tighter">⚠️ Off Campus</Badge>
                                        <span className="text-[10px] text-red-600 font-black">{(log as any).distanceMeters}m Away</span>
                                    </div>
                                ) : (
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-black uppercase tracking-tighter">Verified On-Site</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => setPhotoToView(log.verificationPhotoUrl)} className="text-xs font-bold text-indigo-600 hover:bg-indigo-50">View Selfie</Button>
                            </TableCell>
                             <TableCell className="text-right">
                                {log.latitude && log.longitude ? (
                                    <a href={`https://www.google.com/maps?q=${log.latitude},${log.longitude}`} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm" className="h-8 text-xs font-bold gap-1 rounded-xl">
                                            <MapPin className="h-3 w-3" /> Map
                                        </Button>
                                    </a>
                                ) : (
                                    <span className="text-xs text-slate-300">N/A</span>
                                )}
                            </TableCell>
                        </TableRow>
                    );
                })}
                {filteredLogs.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-20 text-slate-400 italic">No attendance records match your active filters.</TableCell>
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
            <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest mt-2">Captured via secure browser terminal</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
