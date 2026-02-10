
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
import { History, Clock, AlertTriangle, UserCheck, Loader2, Calendar as CalendarIcon, Printer } from 'lucide-react';
import { format, startOfDay, endOfDay, setHours, setMinutes } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { useCurrentSchool } from '@/hooks/use-current-school';
import type { Staff, StaffAttendance } from '@/lib/types';

// Define school start time (8:00 AM)
const START_HOUR = 8;
const START_MINUTE = 0;

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
    if (!attendanceLogs) return { filteredLogs: [], stats: { total: 0, late: 0 } };

    const schoolStartTime = setMinutes(setHours(new Date(), START_HOUR), START_MINUTE);

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

    const lateArrivals = filtered.filter(log => {
        if (log.type !== 'In') return false;
        const clockInTime = log.timestamp.toDate();
        const schoolStartForDay = setMinutes(setHours(clockInTime, START_HOUR), START_MINUTE);
        return clockInTime > schoolStartForDay;
    }).length;

    return { 
        filteredLogs: filtered,
        stats: { total: filtered.length, late: lateArrivals }
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
          <h1 className="text-3xl font-bold flex items-center gap-2"><UserCheck /> Staff Attendance Audit</h1>
          <p className="text-muted-foreground">Monitor and verify staff check-ins and check-outs.</p>
        </div>
        <Button onClick={() => window.print()}><Printer className="mr-2 h-4 w-4"/> Print Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Logs</CardTitle><CardDescription>In selected period</CardDescription></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.total}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Late Arrivals</CardTitle><CardDescription>Clock-ins after {START_HOUR}:{String(START_MINUTE).padStart(2, '0')} AM</CardDescription></CardHeader>
          <CardContent><p className="text-3xl font-bold text-red-600">{stats.late}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full sm:w-[300px] justify-start text-left font-normal")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (dateRange.to ? <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</> : format(dateRange.from, "LLL dd, y")) : <span>Pick a date range</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
              </PopoverContent>
            </Popover>
            <Select onValueChange={setSelectedStaffId} value={selectedStaffId}>
              <SelectTrigger className="w-full sm:w-[250px]"><SelectValue placeholder="All Staff" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Staff</SelectItem>
                {staffList?.map(s => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Staff Name</TableHead><TableHead>Date</TableHead><TableHead>Time</TableHead><TableHead>Type</TableHead><TableHead>Punctuality</TableHead><TableHead>Verification</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredLogs.map(log => {
                    const logDate = log.timestamp.toDate();
                    const schoolStartForDay = setMinutes(setHours(logDate, START_HOUR), START_MINUTE);
                    const isLate = log.type === 'In' && logDate > schoolStartForDay;
                    
                    return (
                        <TableRow key={log.id}>
                            <TableCell className="font-medium">{log.staffName}</TableCell>
                            <TableCell>{format(logDate, 'PPP')}</TableCell>
                            <TableCell>{format(logDate, 'p')}</TableCell>
                            <TableCell><Badge variant={log.type === 'In' ? 'default' : 'secondary'}>{log.type}</Badge></TableCell>
                            <TableCell>
                                {log.type === 'In' && (
                                    <Badge variant={isLate ? 'destructive' : 'default'}>{isLate ? 'Late' : 'On Time'}</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm" onClick={() => setPhotoToView(log.verificationPhotoUrl)}>View Photo</Button>
                            </TableCell>
                        </TableRow>
                    );
                })}
                 {filteredLogs.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No records match the selected filters.</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={!!photoToView} onOpenChange={() => setPhotoToView(null)}>
        <DialogContent>
            <DialogHeader><DialogTitle>Verification Photo</DialogTitle></DialogHeader>
            {photoToView && <img src={photoToView} alt="Verification" className="w-full aspect-video object-cover rounded-md" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
