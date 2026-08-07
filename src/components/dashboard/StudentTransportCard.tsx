'use client';

import { useMemo } from 'react';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Route, Stop, Bus, Student } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bus as BusIcon, MapPin, Clock, Phone, User, ShieldCheck, Activity, CheckCircle, UserCheck, XCircle } from 'lucide-react';

interface StudentTransportCardProps {
  student: Student;
}

export function StudentTransportCard({ student }: StudentTransportCardProps) {
  const firestore = useFirestore();

  const studentIdVal = student.uid || student.id;

  const logsQuery = useMemoFirebase(
    () => (firestore && studentIdVal ? query(collection(firestore, 'vehicle_logs'), where('studentId', '==', studentIdVal)) : null),
    [firestore, studentIdVal]
  );
  const { data: latestLogs } = useCollection<any>(logsQuery);
  const latestCheckIn = useMemo(() => {
    if (!latestLogs || latestLogs.length === 0) return null;
    return [...latestLogs].sort((a: any, b: any) => {
      const timeA = a.timestamp?.seconds ? a.timestamp.seconds * 1000 : (a.timestamp?.toDate ? a.timestamp.toDate().getTime() : 0);
      const timeB = b.timestamp?.seconds ? b.timestamp.seconds * 1000 : (b.timestamp?.toDate ? b.timestamp.toDate().getTime() : 0);
      return timeB - timeA;
    })[0];
  }, [latestLogs]);

  const checkInTimeString = useMemo(() => {
    if (!latestCheckIn) return '';
    if (latestCheckIn.checkInTime) return latestCheckIn.checkInTime;
    let dt: Date | null = null;
    if (latestCheckIn.timestamp?.seconds) {
      dt = new Date(latestCheckIn.timestamp.seconds * 1000);
    } else if (latestCheckIn.timestamp?.toDate) {
      dt = latestCheckIn.timestamp.toDate();
    } else if (latestCheckIn.timestamp instanceof Date) {
      dt = latestCheckIn.timestamp;
    }
    if (dt) {
      return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    return '';
  }, [latestCheckIn]);

  const routesQuery = useMemoFirebase(
    () => (firestore && student.schoolId ? query(collection(firestore, 'routes'), where('schoolId', '==', student.schoolId)) : null),
    [firestore, student.schoolId]
  );
  const { data: routes } = useCollection<Route>(routesQuery);

  const busesQuery = useMemoFirebase(
    () => (firestore && student.schoolId ? query(collection(firestore, 'buses'), where('schoolId', '==', student.schoolId)) : null),
    [firestore, student.schoolId]
  );
  const { data: buses } = useCollection<Bus>(busesQuery);

  const staffQuery = useMemoFirebase(
    () => (firestore && student.schoolId ? query(collection(firestore, 'staff'), where('schoolId', '==', student.schoolId), where('role', '==', 'Transport Staff')) : null),
    [firestore, student.schoolId]
  );
  const { data: drivers } = useCollection<any>(staffQuery);

  const routeAndStop = useMemo(() => {
    if (!routes || !student.uid) return null;
    for (const route of routes) {
      if (route.stops) {
        for (const stop of route.stops) {
          if (stop.assignedStudentIds && stop.assignedStudentIds.includes(student.uid)) {
            return { route, stop };
          }
        }
      }
    }
    return null;
  }, [routes, student.uid]);

  const assignedBus = useMemo(() => {
    if (!routeAndStop || !buses) return null;
    return buses.find((b) => b.id === routeAndStop.route.busId);
  }, [routeAndStop, buses]);

  const assignedDriver = useMemo(() => {
    if (!routeAndStop || !drivers) return null;
    return drivers.find((d) => d.uid === routeAndStop.route.driverId);
  }, [routeAndStop, drivers]);

  if (!student.usesBusService) {
    return null;
  }

  if (!routeAndStop) {
    return (
      <Card className="rounded-3xl border border-slate-100 shadow-md bg-white p-6">
        <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-4 rounded-2xl border border-amber-100">
          <BusIcon className="h-6 w-6 shrink-0" />
          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-900">Transport Bus Subscribed</h4>
            <p className="text-xs text-amber-700 font-medium mt-0.5">Route & stop assignment pending verification by school transport manager.</p>
          </div>
        </div>
      </Card>
    );
  }

  const { route, stop } = routeAndStop;

  return (
    <Card className="rounded-[2.5rem] border border-slate-100 shadow-xl bg-gradient-to-br from-white via-slate-50/40 to-indigo-50/20 overflow-hidden">
      <CardHeader className="bg-slate-900 text-white p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-400/30">
              <BusIcon className="h-6 w-6 text-indigo-300" />
            </div>
            <div>
              <CardTitle className="text-base font-black uppercase tracking-tight text-white">{route.name}</CardTitle>
              <CardDescription className="text-xs text-slate-300 font-medium">Official School Transport Fleet</CardDescription>
            </div>
          </div>
          <Badge className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full">
            Active Subscribed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Stop & Time Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-150 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <MapPin className="h-4 w-4" />
              <span>Designated Stop</span>
            </div>
            <p className="font-black text-slate-800 text-sm">{stop.name}</p>
            <p className="text-xs text-slate-400 font-medium">{stop.address}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-150 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <Clock className="h-4 w-4" />
              <span>Scheduled Timing</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-slate-500 font-medium">Pickup: <strong className="text-slate-800 font-bold">{stop.pickupTime || '07:15 AM'}</strong></span>
              <span className="text-slate-500 font-medium">Dropoff: <strong className="text-slate-800 font-bold">{stop.dropoffTime || '04:00 PM'}</strong></span>
            </div>
          </div>
        </div>

        {/* Bus & Driver Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Assigned Driver</p>
              <p className="text-xs font-extrabold text-slate-800">{assignedDriver ? `${assignedDriver.firstName} ${assignedDriver.lastName}` : (route.driverName || 'School Driver')}</p>
              {assignedDriver?.phoneNumber && (
                <p className="text-[11px] text-indigo-600 font-bold flex items-center gap-1 mt-0.5">
                  <Phone className="h-3 w-3" /> {assignedDriver.phoneNumber}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Vehicle Details</p>
              <p className="text-xs font-extrabold text-slate-800">{assignedBus ? assignedBus.name : 'School Bus'}</p>
              {assignedBus?.licensePlate && (
                <p className="text-[11px] text-slate-500 font-bold">Plate: {assignedBus.licensePlate}</p>
              )}
            </div>
          </div>
        </div>

        {/* Live Bus Status / Last Check-In Log */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-300 border border-indigo-500/30">
              <Activity className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Live Bus Status & Check-In Log</p>
              <p className="text-xs font-extrabold text-slate-200">
                {latestCheckIn
                  ? `Marked as ${latestCheckIn.status}${checkInTimeString ? ` at ${checkInTimeString}` : ''} (${latestCheckIn.shift || 'Transit'})`
                  : 'Bus in Service - Scheduled Stops Operating Normal'}
              </p>
            </div>
          </div>
          {latestCheckIn && (
            <Badge className={
              latestCheckIn.status === 'Boarded' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
              latestCheckIn.status === 'Dropped Off' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
              'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }>
              {latestCheckIn.status}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
