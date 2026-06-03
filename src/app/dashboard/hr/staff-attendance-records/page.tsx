
'use client';

import { useState, useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { 
    Clock, Loader2, Calendar as CalendarIcon, 
    Printer, MapPin, ShieldAlert, ArrowDownLeft, ArrowUpRight, Camera, 
    XCircle, ShieldCheck
} from 'lucide-react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { useCurrentSchool } from '@/hooks/use-current-school';
import type { Staff, StaffAttendance } from '@/lib/types';

export default function StaffAttendanceRecordsPage() {
  const { role } = useRole();
  const firestore = useFirestore();
  const { schoolId, loading: isSchoolLoading } = useCurrentSchool();

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(new Date(new Date().setDate(new Date().getDate() - 7))),
    to: endOfDay(new Date()),
  });
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [photoToView, setPhotoToView] = useState<string | null>(null);

  const canAccess = role === 'Director' || role === 'Administrator' || role === 'Secretary';

  // --- DATA FETCHING (Guarded by canAccess) ---
  const staffQuery = useMemoFirebase(() =>
    (firestore && schoolId && canAccess) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId), orderBy('firstName')) : null
  , [firestore, schoolId, canAccess]);
  const { data: staffList, isLoading: isLoadingStaff } = useCollection<Staff>(staffQuery);

  const attendanceQuery = useMemoFirebase(() =>
    (firestore && schoolId && canAccess) ? query(collection(firestore, 'staff_attendance'), where('schoolId', '==', schoolId), orderBy('timestamp', 'desc')) : null
  , [firestore, schoolId, canAccess]);
  const { data: attendanceLogs, isLoading: isLoadingLogs } = useCollection<StaffAttendance>(attendanceQuery);

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
  
  const isLoading = isSchoolLoading || isLoadingStaff || isLoadingLogs;

  if (!canAccess && !isSchoolLoading) {
    return (
        <div className="p-8 flex justify-center">
            <Card className="max-w-md w-full border-red-100 bg-red-50/50">
                <CardHeader className="text-center">
                    <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                        <ShieldAlert className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle>Access Restricted</CardTitle>
                    <CardDescription>
                        Attendance logs and security records are restricted to administrative personnel.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Institutional <span className="text-indigo-600">Audit</span></h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Attendance verification and real-time security tracking.</p>
        </div>
        <div className="flex gap-2 print:hidden">
            <Button onClick={() => window.print()} variant="outline" className="h-12 border-4 border-slate-100 rounded-2xl font-black px-6 hover:bg-slate-50">
                <Printer className="mr-2 h-4 w-4"/> PRINT AUDIT
            </Button>
        </div>
      </div>

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
              <div className="space-y-2 flex-grow">
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
                          <TableRow key={log.id} className={cn("hover:bg-slate-50/50 transition-colors h-20", (log.isIdentityFlagged || log.isFlagged) && "bg-red-50/10")}>
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
      
      {/* ── IMAGE PROOF MODAL ── */}
      <Dialog open={!!photoToView} onOpenChange={() => setPhotoToView(null)}>
        <DialogContent className="rounded-[3rem] border-[12px] border-slate-900 p-0 overflow-hidden bg-black max-w-2xl">
            <DialogHeader className="sr-only">
                <DialogTitle>Staff Verification Photo</DialogTitle>
                <DialogDescription>Viewing the verification photo captured during staff clock-in/out.</DialogDescription>
            </DialogHeader>
            <div className="relative aspect-video">
                {photoToView && (
                  <img src={photoToView} alt="Verification" className="w-full h-full object-cover" />
                )}
                <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-2xl">
                    <ShieldCheck className="text-emerald-400 h-6 w-6" />
                    <span className="text-white font-black uppercase text-sm tracking-tight italic">Verified Identity Proof</span>
                </div>
                <button 
                  onClick={() => setPhotoToView(null)}
                  className="absolute top-6 right-6 bg-white/10 hover:bg-red-50 hover:scale-110 p-3 rounded-2xl text-white transition-all backdrop-blur-md shadow-2xl"
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
