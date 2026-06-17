'use client';

import { useState, useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
    Clock, Loader2, Calendar as CalendarIcon, 
    Printer, MapPin, ShieldAlert, ArrowDownLeft, ArrowUpRight, Camera, 
    XCircle, ShieldCheck, Search, Users, ShieldX, UserCheck, CheckCircle2, AlertTriangle, FileText, ExternalLink
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hudLog, setHudLog] = useState<StaffAttendance | null>(null);

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
      if (searchQuery) {
        const queryLower = searchQuery.toLowerCase();
        const nameMatch = log.staffName?.toLowerCase().includes(queryLower);
        const idMatch = log.staffId?.toLowerCase().includes(queryLower);
        if (!nameMatch && !idMatch) return false;
      }
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
  }, [attendanceLogs, dateRange, selectedStaffId, searchQuery]);

  const getInitials = (name?: string) => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getAvatarGradient = (name?: string) => {
    if (!name) return 'from-slate-500 to-slate-600';
    const code = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-teal-400 to-emerald-600',
      'from-violet-500 to-purple-600',
      'from-rose-500 to-pink-650',
      'from-amber-450 to-orange-600',
      'from-indigo-500 to-cyan-600'
    ];
    return gradients[code % gradients.length];
  };

  const isLoading = isSchoolLoading || isLoadingStaff || isLoadingLogs;

  if (!canAccess && !isSchoolLoading) {
    return (
        <div className="p-8 flex justify-center">
            <Card className="max-w-md w-full border-red-100 bg-red-50/50 rounded-[2.5rem] shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95">
                <CardHeader className="text-center p-8">
                    <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4 animate-pulse">
                        <ShieldAlert className="h-8 w-8 text-red-650" />
                    </div>
                    <CardTitle className="text-xl font-extrabold text-slate-900">Access Restricted</CardTitle>
                    <CardDescription className="text-slate-500 mt-2">
                        Attendance logs and security records are restricted to administrative personnel.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto flex flex-col h-full">
      
      {/* Premium Dark Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white p-6 md:p-8 shadow-xl border border-slate-955/40">
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform translate-x-12 -translate-y-12">
          <ShieldCheck className="w-96 h-96" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-indigo-500 text-white font-extrabold px-2.5 py-0.5 text-[10px] uppercase tracking-wider">ADMIN CONTROL CENTER</Badge>
              <Badge className="bg-white/10 text-indigo-200 border border-white/10 font-bold px-2.5 py-0.5 text-[10px] uppercase">SECURITY AUDITING</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white animate-in slide-in-from-left-4 duration-300">Institutional Staff Audit</h1>
            <p className="text-indigo-100/70 text-sm max-w-xl">Monitor real-time shift check-ins, campus proximity records, and biometrics validation results across your teaching and support personnel.</p>
          </div>
          
          <div className="flex gap-3 shrink-0 print:hidden w-full md:w-auto">
            <Button 
              onClick={() => window.print()} 
              variant="outline" 
              className="w-full md:w-auto h-12 bg-white/5 border border-white/15 rounded-xl font-extrabold text-xs text-white hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Printer className="h-4 w-4 text-indigo-300"/> PRINT ATTENDANCE LOG
            </Button>
          </div>
        </div>
      </div>

      {/* Dynamic Statistics Display Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border border-slate-200/50 shadow-md bg-white rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 group">
              <div className="h-1 bg-slate-500"></div>
              <CardHeader className="pb-1 pt-5 px-5 flex flex-row items-center justify-between">
                <CardTitle className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Logs</CardTitle>
                <FileText className="h-4 w-4 text-slate-400 group-hover:text-slate-650 transition-colors" />
              </CardHeader>
              <CardContent className="pb-5 px-5">
                <p className="text-3xl font-black text-slate-900">{stats.total}</p>
                <p className="text-[10px] font-bold text-slate-450 mt-1 uppercase">within chosen range</p>
              </CardContent>
          </Card>
          
          <Card className="border border-orange-100 shadow-md bg-white rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 group">
              <div className="h-1 bg-orange-500"></div>
              <CardHeader className="pb-1 pt-5 px-5 flex flex-row items-center justify-between">
                <CardTitle className="text-[10px] font-black uppercase text-orange-500 tracking-wider">Identity Flags</CardTitle>
                <ShieldAlert className="h-4 w-4 text-orange-400 group-hover:text-orange-655 transition-colors" />
              </CardHeader>
              <CardContent className="pb-5 px-5">
                <p className="text-3xl font-black text-orange-600">{stats.identityIssues}</p>
                <p className={cn("text-[10px] font-bold mt-1 uppercase", stats.identityIssues > 0 ? "text-orange-500 animate-pulse" : "text-slate-400")}>
                  {stats.identityIssues > 0 ? 'Verification issues' : 'All clear'}
                </p>
              </CardContent>
          </Card>

          <Card className="border border-rose-100 shadow-md bg-white rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 group">
              <div className="h-1 bg-rose-500"></div>
              <CardHeader className="pb-1 pt-5 px-5 flex flex-row items-center justify-between">
                <CardTitle className="text-[10px] font-black uppercase text-rose-500 tracking-wider">GPS Off-Site</CardTitle>
                <MapPin className="h-4 w-4 text-rose-450 group-hover:text-rose-600 transition-colors" />
              </CardHeader>
              <CardContent className="pb-5 px-5">
                <p className="text-3xl font-black text-rose-600">{stats.flagged}</p>
                <p className={cn("text-[10px] font-bold mt-1 uppercase", stats.flagged > 0 ? "text-rose-500 animate-pulse" : "text-slate-400")}>
                  {stats.flagged > 0 ? 'Out of boundary' : 'On-campus verified'}
                </p>
              </CardContent>
          </Card>

          <Card className="border border-amber-100 shadow-md bg-white rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 group">
              <div className="h-1 bg-amber-500"></div>
              <CardHeader className="pb-1 pt-5 px-5 flex flex-row items-center justify-between">
                <CardTitle className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Late Arrivals</CardTitle>
                <Clock className="h-4 w-4 text-amber-450 group-hover:text-amber-600 transition-colors" />
              </CardHeader>
              <CardContent className="pb-5 px-5">
                <p className="text-3xl font-black text-amber-600">{stats.late}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">past allowed time</p>
              </CardContent>
          </Card>

          <Card className="border border-indigo-100 shadow-md bg-white rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 group">
              <div className="h-1 bg-indigo-500"></div>
              <CardHeader className="pb-1 pt-5 px-5 flex flex-row items-center justify-between">
                <CardTitle className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Early Exits</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-indigo-455 group-hover:text-indigo-650 transition-colors" />
              </CardHeader>
              <CardContent className="pb-5 px-5">
                <p className="text-3xl font-black text-indigo-600">{stats.early}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">left before close</p>
              </CardContent>
          </Card>
      </div>

      {/* Audit Table & Filters Card */}
      <Card className="rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b p-6 md:p-8">
            <div className="flex flex-col gap-6">
              
              {/* Row 1: Period and Staff Select */}
              <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Audit Period</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-bold border rounded-xl h-11 bg-white shadow-sm hover:border-indigo-300 transition-all text-xs")}>
                            <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                            {dateRange?.from ? (dateRange.to ? <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</> : format(dateRange.from, "LLL dd, y")) : <span>Select Range</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                        </PopoverContent>
                      </Popover>
                  </div>
                  
                  <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Staff Member Filter</Label>
                      <Select onValueChange={setSelectedStaffId} value={selectedStaffId}>
                        <SelectTrigger className="w-full border rounded-xl h-11 bg-white shadow-sm font-bold text-xs"><SelectValue placeholder="All Personnel" /></SelectTrigger>
                        <SelectContent className="max-h-60">
                            <SelectItem value="all">All Personnel</SelectItem>
                            {staffList?.map(s => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}
                        </SelectContent>
                      </Select>
                  </div>

                  {/* Search input field */}
                  <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Quick Name Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search name or ID..."
                          className="pl-9 h-11 border rounded-xl shadow-sm bg-white text-xs font-semibold placeholder:text-slate-400 focus-visible:ring-indigo-500"
                        />
                      </div>
                  </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
          {isLoading ? (
              <div className="flex justify-center p-32 flex-col items-center gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-indigo-500 opacity-30" />
                  <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-350">Fetching Verification Logs...</p>
              </div>
          ) : (
              <div className="overflow-x-auto">
                <Table>
                <TableHeader className="bg-slate-50/70 border-b">
                    <TableRow>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest pl-8 py-5">Staff Member</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-5">Timestamp</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-center py-5">Shift Outcome</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-5">Identity Status</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-8 py-5">GPS Audit Proximity</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredLogs.map(log => {
                        const logDate = log.timestamp?.toDate ? log.timestamp.toDate() : new Date();
                        const initials = getInitials(log.staffName);
                        const grad = getAvatarGradient(log.staffName);
                        
                        return (
                            <TableRow 
                              key={log.id} 
                              className={cn(
                                "hover:bg-slate-50/40 transition-all h-20 border-b border-slate-100", 
                                log.isIdentityFlagged && "border-l-4 border-l-orange-500 bg-orange-50/5",
                                !log.isIdentityFlagged && log.isFlagged && "border-l-4 border-l-rose-500 bg-rose-50/5"
                              )}
                            >
                                <TableCell className="pl-8">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-9 w-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-extrabold text-xs shadow-sm", grad)}>
                                          {initials}
                                        </div>
                                        <div>
                                          <div className="font-extrabold text-slate-805 text-sm">{log.staffName}</div>
                                          <div className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-tighter">UID: {log.staffId.slice(0, 8)}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs font-bold text-slate-705">{format(logDate, 'PPP')}</div>
                                    <div className="text-[9px] text-slate-450 font-black uppercase font-mono tracking-wider mt-0.5">{format(logDate, 'h:mm:ss a')}</div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex justify-center items-center gap-2 flex-wrap">
                                        {log.type === 'In' ? (
                                            <>
                                                <Badge className="bg-slate-900 hover:bg-slate-850 text-white font-black uppercase text-[8px] tracking-wider px-2 py-0.5 rounded-lg flex items-center gap-1"><ArrowDownLeft size={11} /> ARRIVAL</Badge>
                                                {log.status === 'Late' && (
                                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-black text-[8px] uppercase tracking-wide">LATE ARRIVAL</Badge>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Badge variant="secondary" className="bg-slate-100 font-black uppercase text-[8px] tracking-wider px-2 py-0.5 rounded-lg flex items-center gap-1"><ArrowUpRight size={11} /> DEPARTURE</Badge>
                                                {log.leftEarly && (
                                                    <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-250 font-black text-[8px] uppercase tracking-wide">EARLY EXIT</Badge>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1.5 items-start">
                                        {log.isIdentityFlagged ? (
                                            <Badge variant="destructive" className="text-[8px] font-black uppercase tracking-tight py-0.5 px-2 rounded-md">⚠️ FACE MISMATCH</Badge>
                                        ) : log.identityNotes?.includes('missing') ? (
                                            <Badge variant="secondary" className="bg-yellow-105 text-yellow-800 border-yellow-200 text-[8px] font-black uppercase tracking-tight py-0.5 px-2 rounded-md">NO MASTER PHOTO</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[8px] font-black uppercase tracking-wide py-0.5 px-2 rounded-md">AI VERIFIED</Badge>
                                        )}
                                        {log.verificationPhotoUrl && (
                                          <button 
                                              onClick={() => setHudLog(log)}
                                              className="text-[9px] font-black text-indigo-650 hover:text-indigo-800 uppercase hover:underline flex items-center gap-1 mt-0.5 transition-colors"
                                          >
                                              <Camera size={11} className="text-indigo-500"/> View Proof Scan
                                          </button>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <div className="flex flex-col items-end gap-1.5">
                                        {log.isFlagged ? (
                                            <Badge variant="destructive" className="text-[8px] font-black uppercase py-0.5 px-2 rounded-md">⚠️ OFF-CAMPUS ({log.distanceMeters ?? 0}m)</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-250 text-[8px] font-black uppercase tracking-wide py-0.5 px-2 rounded-md">ON-CAMPUS</Badge>
                                        )}
                                        {log.latitude && (
                                            <a 
                                              href={`https://www.google.com/maps?q=${log.latitude},${log.longitude}`} 
                                              target="_blank" 
                                              rel="noopener noreferrer" 
                                              className="text-[9px] font-bold text-indigo-505 hover:text-indigo-700 hover:underline uppercase tracking-wider flex items-center gap-1"
                                            >
                                                <MapPin size={11}/> GPS Location <ExternalLink size={9} />
                                            </a>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {filteredLogs.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-32 text-slate-450 italic font-black uppercase tracking-[0.2em] text-xs bg-slate-50/10">No matching attendance records found</TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
              </div>
          )}
          </CardContent>
      </Card>
      
      {/* ── FUTURISTIC HUD BIOMETRIC PROOF SCAN MODAL ── */}
      <Dialog open={!!hudLog} onOpenChange={() => setHudLog(null)}>
        <DialogContent className="rounded-3xl border-0 p-0 overflow-hidden bg-slate-950 text-white max-w-lg shadow-2xl animate-in fade-in-50 zoom-in-95">
            <DialogHeader className="sr-only">
                <DialogTitle>Biometric Scanner HUD Proof</DialogTitle>
                <DialogDescription>Verification details, coordinates, and photo captured during staff sign-in.</DialogDescription>
            </DialogHeader>
            <div className="relative aspect-square w-full bg-slate-900 flex items-center justify-center">
                
                {/* HUD Camera Frame Guidelines */}
                <div className="absolute inset-6 border border-white/10 pointer-events-none rounded-2xl z-20"></div>
                <div className="absolute inset-8 border border-dashed border-emerald-400/20 pointer-events-none rounded-xl z-20"></div>
                
                {/* Corner crop guidelines */}
                <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-emerald-450 pointer-events-none z-25"></div>
                <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-emerald-450 pointer-events-none z-25"></div>
                <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-emerald-450 pointer-events-none z-25"></div>
                <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-emerald-450 pointer-events-none z-25"></div>
                
                {/* Simulated Scanning Beam */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-455 to-transparent opacity-75 shadow-[0_0_8px_rgba(52,211,153,0.8)] pointer-events-none z-30 animate-pulse"></div>

                {hudLog?.verificationPhotoUrl ? (
                  <img src={hudLog.verificationPhotoUrl} alt="Staff Scan" className="w-full h-full object-cover z-10 opacity-85" />
                ) : (
                  <div className="text-center py-20 text-slate-400 flex flex-col items-center gap-3">
                     <Camera className="h-12 w-12 text-slate-655 animate-pulse"/>
                     <p className="text-xs italic font-bold">Image payload empty or corrupt.</p>
                  </div>
                )}
                
                {/* Top Overlay HUD Badge */}
                <div className="absolute top-10 left-10 flex items-center gap-2.5 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-2xl z-20">
                    <ShieldCheck className={cn("h-5 w-5", hudLog?.isIdentityFlagged ? "text-orange-400" : "text-emerald-400")} />
                    <span className="text-white font-extrabold uppercase text-[10px] tracking-wider font-mono">
                      {hudLog?.isIdentityFlagged ? 'SECURE_AUDIT_FLAG' : 'IDENTITY_VERIFIED'}
                    </span>
                </div>
                
                {/* Close modal circle */}
                <button 
                  onClick={() => setHudLog(null)}
                  className="absolute top-10 right-10 bg-slate-950/80 hover:bg-red-500 hover:scale-105 p-2 rounded-xl text-white transition-all backdrop-blur-md shadow-2xl z-20 border border-white/10"
                >
                  <XCircle size={18}/>
                </button>

                {/* Bottom Overlay HUD Data Badges */}
                <div className="absolute bottom-10 left-10 right-10 bg-slate-950/90 backdrop-blur-lg p-4 rounded-xl border border-white/15 shadow-2xl z-20 font-mono text-[10px] space-y-2">
                    <div className="flex justify-between items-center text-slate-400 border-b border-white/5 pb-1.5">
                       <span>PERSONNEL:</span>
                       <span className="text-white font-black">{hudLog?.staffName}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400 border-b border-white/5 pb-1.5">
                       <span>TIMESTAMP:</span>
                       <span className="text-indigo-350 font-bold uppercase">{hudLog?.timestamp ? format(hudLog.timestamp.toDate(), 'PPP p') : 'Processing'}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400 border-b border-white/5 pb-1.5">
                       <span>PROXIMITY STATUS:</span>
                       {hudLog?.isFlagged ? (
                          <span className="text-rose-400 font-extrabold">FLAGGED OFF-CAMPUS ({hudLog.distanceMeters ?? 0}M)</span>
                       ) : (
                          <span className="text-emerald-405 font-extrabold">VERIFIED ON-CAMPUS ({hudLog?.distanceMeters ?? 0}M)</span>
                       )}
                    </div>
                    {hudLog?.latitude !== undefined && hudLog?.longitude !== undefined && (
                      <div className="flex justify-between items-center text-slate-400">
                         <span>GPS COORDS:</span>
                         <span className="text-white font-semibold">{hudLog.latitude.toFixed(5)}, {hudLog.longitude.toFixed(5)}</span>
                      </div>
                    )}
                </div>
            </div>
            <div className="bg-slate-950 p-5 border-t border-white/5 text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono">Biometric HUD engine v1.0.4 · CampusConnect</p>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
