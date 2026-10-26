'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, query, where, orderBy, limit, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, UserCheck, History, LogIn, LogOut, MapPin, CheckCircle2, AlertTriangle, ShieldAlert, RefreshCw, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { WebcamCapture } from '@/components/dashboard/attendance/WebcamCapture';
import { useCurrentSchool } from '@/hooks/use-current-school';
import type { StaffAttendance } from '@/lib/types';
import { useRole } from '@/context/role-context';
import { clockStaffAction } from '@/app/actions/staff-clock';
import { getDistanceInMeters } from '@/lib/geo';
import { cn } from '@/lib/utils';

const DEFAULT_RADIUS = 200;
const ADMIN_ROLES = ['director', 'administrator', 'admin', 'principal', 'headmaster', 'headmistress', 'head teacher', 'owner'];

const num = (v: unknown) => {
  const n = typeof v === 'string' ? parseFloat(v) : (v as number);
  return typeof n === 'number' && Number.isFinite(n) ? n : null;
};

/** 850m, or 196.6 km once it is over a kilometre. */
const fmtDistance = (m: number) => (m >= 1000 ? `${(m / 1000).toFixed(m >= 10000 ? 0 : 1)} km` : `${Math.round(m)} m`);

const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Make the selfie small before sending (about 60-120 KB instead of 1 MB+). */
function shrinkSelfie(dataUri: string, maxSide = 640): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      const ctx = c.getContext('2d');
      if (!ctx) return resolve(dataUri);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL('image/jpeg', 0.75));
    };
    img.onerror = () => resolve(dataUri);
    img.src = dataUri;
  });
}

export default function StaffAttendancePage() {
  const { user, isUserLoading } = useUser();
  const { role, loading: isRoleLoading } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId, loading: isSchoolLoading } = useCurrentSchool();

  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy: number | null; at: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const isStaff = role && !['student', 'parent'].includes(role.toLowerCase());

  // Fetch School Settings for Geofencing and Time Tracking
  const schoolSettingsRef = useMemoFirebase(
    () => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null,
    [firestore, schoolId]
  );
  const { data: schoolSettings } = useDoc<any>(schoolSettingsRef as any);

  // Fetch recent attendance logs for the current user
  const attendanceQuery = useMemoFirebase(() => {
    if (!user || !schoolId || !firestore || !isStaff) return null;
    return query(
      collection(firestore, 'staff_attendance'),
      where('schoolId', '==', schoolId),
      where('staffId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
  }, [user, schoolId, firestore, isStaff]);
  const { data: attendanceLogs, isLoading: isLogsLoading, forceRefetch } = useCollection<StaffAttendance>(attendanceQuery);

  const locate = useCallback(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setLocationError('This device cannot share its location.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Number.isFinite(position.coords.accuracy) ? position.coords.accuracy : null,
          at: Date.now(),
        });
        setLocationError(null);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        setLocationError(error.code === error.PERMISSION_DENIED ? 'Location permission was refused. Allow location for this site, then press Refresh.' : error.message);
        toast({
          variant: "destructive",
          title: "Location Error",
          description: "Could not get your location. Please enable location services to verify your campus proximity.",
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [toast]);

  useEffect(() => {
    if (isStaff) locate();
  }, [isStaff, locate]);

  // --- Campus distance (shown before clocking; the server works it out again when saving) ---
  const campus = useMemo(() => {
    const lat = num(schoolSettings?.schoolLat), lng = num(schoolSettings?.schoolLng);
    const radius = num(schoolSettings?.allowedRadius) && num(schoolSettings?.allowedRadius)! > 0 ? num(schoolSettings?.allowedRadius)! : DEFAULT_RADIUS;
    const isSet = lat !== null && lng !== null && !(lat === 0 && lng === 0);
    return { lat, lng, radius, isSet };
  }, [schoolSettings]);
  const distance = useMemo(() => (
    location && campus.isSet ? getDistanceInMeters(campus.lat!, campus.lng!, location.latitude, location.longitude) : null
  ), [location, campus]);
  const isOffSite = distance !== null && distance > campus.radius;
  const isAdminUser = ADMIN_ROLES.includes(String(role || '').toLowerCase());

  // Today's records (the feed holds the last 10, newest first).
  const todayLogs = useMemo(() => {
    const now = new Date();
    return (attendanceLogs || []).filter(l => l.timestamp?.toDate && sameDay(l.timestamp.toDate(), now));
  }, [attendanceLogs]);
  const hasClockedInToday = todayLogs.some(l => l.type === 'In');
  const hasClockedOutToday = todayLogs.some(l => l.type === 'Out');

  const handleClockAction = async (type: 'In' | 'Out') => {
    if (!user || !imageDataUri || !schoolId || !location) {
        toast({
            variant: 'destructive',
            title: `Cannot Clock ${type}`,
            description: 'Please ensure photo is taken and location services are active.'
        });
        return;
    }

    setIsSubmitting(true);
    try {
      toast({ title: type === 'In' ? 'Clocking in...' : 'Clocking out...', description: 'Checking your photo and location.' });
      const photo = await shrinkSelfie(imageDataUri);
      const res = await clockStaffAction({
        schoolId,
        type,
        photo,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
      });

      if (!res.success) {
        toast({ variant: 'destructive', title: `Could not clock ${type.toLowerCase()}`, description: res.error });
        return;
      }

      const notes: string[] = [];
      if (res.isFlagged && res.distanceMeters !== null) notes.push(`Flagged: you are ${fmtDistance(res.distanceMeters)} from campus (allowed ${res.allowedRadius} m).`);
      if (res.geofence === 'not_set') notes.push('Campus location is not set, so distance was not checked.');
      if (res.identityStatus === 'mismatch') notes.push('Your photo did not match your profile photo. Logged for review.');
      if (res.identityStatus === 'unchecked') notes.push(res.identityNotes);
      if (res.status === 'Late') notes.push('Marked late.');
      if (res.leftEarly) notes.push('Marked as leaving early.');

      toast({
          variant: res.isFlagged || res.identityStatus === 'mismatch' ? 'destructive' : undefined,
          title: `Clocked ${type}!`,
          description: notes.length ? notes.join(' ') : `Your ${type === 'In' ? 'arrival' : 'departure'} has been recorded.`,
      });

      setImageDataUri(null);
      forceRefetch();
    } catch (e) {
      console.error('Clock action failed', e);
      toast({ variant: 'destructive', title: 'Error', description: `Failed to clock ${type}. Check your connection and try again.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isUserLoading || isRoleLoading || isSchoolLoading;

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>;
  }

  if (!isStaff) {
    return (
      <div className="flex justify-center p-8">
        <Card className="max-w-md w-full border-red-100 bg-red-50/50">
          <CardHeader className="text-center">
            <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
              <ShieldAlert className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle>Staff Only Area</CardTitle>
            <CardDescription>
              This feature is reserved for school staff and administrators.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild variant="outline">
              <a href="/dashboard">Return to Dashboard</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto flex flex-col h-full">
      
      {/* Premium Gradient Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-xl border border-indigo-950/40">
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform translate-x-8 -translate-y-8">
          <UserCheck className="w-80 h-80" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-500 text-white font-extrabold px-2 py-0.5 text-[10px] uppercase tracking-wider">BIOMETRIC VERIFICATION</Badge>
              <Badge className="bg-white/10 text-indigo-200 border border-white/10 font-bold px-2 py-0.5 text-[10px] uppercase">GEOFENCED CAMPUS</Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Staff Attendance & Clock-In</h1>
            <p className="text-indigo-100/70 text-sm max-w-md">Verify your identity using AI facial comparison and confirm your on-campus geolocated proximity to register shifts.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 shrink-0 bg-white/5 border border-white/10 rounded-2xl p-4">
             <div className="text-xs space-y-1">
                <span className="text-indigo-200/60 block uppercase font-extrabold tracking-wider text-[9px]">Shift Hours</span>
                <span className="font-extrabold block text-xs text-indigo-150">
                   {schoolSettings?.schoolStartTime && schoolSettings?.schoolCloseTime ? `${schoolSettings.schoolStartTime} - ${schoolSettings.schoolCloseTime}` : 'Not set'}
                </span>
             </div>
             <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
             <div className="text-xs space-y-1">
                <span className="text-indigo-200/60 block uppercase font-extrabold tracking-wider text-[9px]">Allowed Radius</span>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/20 uppercase font-black text-[9px] px-2 py-0.5 block w-fit">
                   {campus.isSet ? `${campus.radius}m Proximity` : 'Campus not set'}
                </Badge>
             </div>
             <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
             <div className="text-xs space-y-1">
                <span className="text-indigo-200/60 block uppercase font-extrabold tracking-wider text-[9px]">Active Location</span>
                {location ? (
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-450 border border-emerald-500/20 uppercase font-black text-[9px] px-2 py-0.5 block w-fit">
                     GPS Connected
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-red-500/20 text-red-400 border border-red-500/20 uppercase font-black text-[9px] px-2 py-0.5 block w-fit animate-pulse">
                     Awaiting GPS
                  </Badge>
                )}
             </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <Card className="border border-slate-200 shadow-lg rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row items-center gap-4">
              <div className="bg-indigo-500/10 text-indigo-600 rounded-2xl p-3 shadow-inner shrink-0">
                <Camera className="h-6 w-6"/>
              </div>
              <div>
                <CardTitle className="text-slate-900 font-black tracking-tight text-lg">AI Biometric Scanner</CardTitle>
                <CardDescription className="font-semibold text-slate-500 text-xs mt-0.5">Capture a live photo to clock in. Your identity will be verified by AI facial check.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center gap-6">
              
              {/* Custom styled camera viewfinder frame */}
              <div className="relative group rounded-2xl overflow-hidden border border-slate-200 shadow-inner p-1 bg-slate-950/5 w-full flex justify-center">
                {/* Camera photo guidelines overlay */}
                <div className="absolute inset-4 border-2 border-dashed border-indigo-500/10 pointer-events-none rounded-xl z-20"></div>
                {/* Photographic crop focus indicators (corner frames) */}
                <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 border-indigo-500/60 pointer-events-none z-20"></div>
                <div className="absolute top-6 right-6 w-5 h-5 border-t-2 border-r-2 border-indigo-500/60 pointer-events-none z-20"></div>
                <div className="absolute bottom-6 left-6 w-5 h-5 border-b-2 border-l-2 border-indigo-500/60 pointer-events-none z-20"></div>
                <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 border-indigo-500/60 pointer-events-none z-20"></div>
                
                <WebcamCapture 
                  imageDataUri={imageDataUri} 
                  setImageDataUri={setImageDataUri}
                />
              </div>

               {/* Live location, geofencing & biometrics check center */}
               <div className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-650">
                      <span className="flex items-center gap-1.5 font-bold text-slate-800">
                        <MapPin className="h-4 w-4 text-indigo-500" /> Geolocation Status:
                      </span>
                      {location ? (
                          <span className="flex items-center gap-1 text-emerald-600 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100"><CheckCircle2 className="h-3.5 w-3.5"/> GPS Logged</span>
                      ) : locationError ? (
                          <span className="text-red-650 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5"/> {locationError}</span>
                      ) : (
                          <span className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg border border-indigo-100"><Loader2 className="h-3.5 w-3.5 animate-spin"/> Acquiring Location...</span>
                      )}
                  </div>

                  {location && (
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-bold bg-white p-3 rounded-xl border border-slate-150 shadow-inner font-mono">
                       <div>LATITUDE: <span className="text-slate-800 font-extrabold">{location.latitude.toFixed(6)}</span></div>
                       <div>LONGITUDE: <span className="text-slate-800 font-extrabold">{location.longitude.toFixed(6)}</span></div>
                       {location.accuracy !== null && (
                         <div className="col-span-2">GPS ACCURACY: <span className={cn("font-extrabold", location.accuracy > campus.radius ? 'text-amber-600' : 'text-slate-800')}>±{Math.round(location.accuracy)} m</span>
                           {location.accuracy > campus.radius && <span className="font-sans text-amber-600"> — weak signal; step outside or wait a moment, then Refresh.</span>}
                         </div>
                       )}
                       <div className="col-span-2 border-t pt-2 mt-1 flex justify-between items-center text-xs font-sans font-bold">
                          <span>Campus Distance:</span>
                          {distance !== null ? (
                            <span className={cn("font-black text-[11px]", isOffSite ? "text-rose-600" : "text-emerald-600")}>
                               {fmtDistance(distance)} away ({isOffSite ? 'Off-Site' : 'On-Site'})
                            </span>
                          ) : (
                            <span className="font-black text-[11px] text-slate-500">Campus location not set</span>
                          )}
                       </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={locate} disabled={isLocating} className="h-8 rounded-lg text-[11px] font-bold">
                      {isLocating ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5 mr-1" />} Refresh location
                    </Button>
                    {location && (
                      <a href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-indigo-600 hover:underline inline-flex items-center gap-1">
                        My position on map <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {campus.isSet && (
                      <a href={`https://www.google.com/maps?q=${campus.lat},${campus.lng}`} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-indigo-600 hover:underline inline-flex items-center gap-1">
                        Saved campus location <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  {/* Very far away usually means the saved campus location is wrong, not that the person is 200 km off. */}
                  {distance !== null && distance > 20000 && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] font-semibold text-amber-800 leading-relaxed">
                      You appear to be {fmtDistance(distance)} from the saved campus location. If you are on campus right now, the school's saved location is probably wrong
                      {isAdminUser ? <> — fix it in <a href="/dashboard/admin/school-profile" className="underline font-bold">School Profile → Geofencing</a> (stand on campus and press “Get Current Location”).</> : <> — please tell your administrator.</>}
                    </div>
                  )}
                  {!campus.isSet && schoolSettings && (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-[11px] font-semibold text-slate-600">
                      The campus location has not been set, so clock-ins cannot be checked against it.
                      {isAdminUser && <> Set it in <a href="/dashboard/admin/school-profile" className="underline font-bold text-indigo-600">School Profile</a>.</>}
                    </div>
                  )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row w-full gap-4">
                <Button 
                  onClick={() => handleClockAction('In')} 
                  disabled={isSubmitting || !imageDataUri || hasClockedInToday || !location}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 h-12 text-sm font-bold text-white rounded-xl shadow-md transition-all active:scale-[0.98] disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400"
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-1.5 h-4 w-4"/> : <LogIn className="mr-1.5 h-4 w-4"/>} Clock In Shift
                </Button>
                <Button 
                  onClick={() => handleClockAction('Out')}
                  disabled={isSubmitting || !imageDataUri || !hasClockedInToday || hasClockedOutToday || !location}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-red-650 hover:from-rose-600 hover:to-red-750 h-12 text-sm font-bold text-white rounded-xl shadow-md transition-all active:scale-[0.98] disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400"
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-1.5 h-4 w-4"/> : <LogOut className="mr-1.5 h-4 w-4"/>} Clock Out Shift
                </Button>
              </div>
              
              <div className="w-full text-center">
                {hasClockedInToday && !hasClockedOutToday && (
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold text-[10px] uppercase py-1 px-3">
                       Active Shift Running
                    </Badge>
                )}
                 {hasClockedOutToday && (
                    <Badge className="bg-blue-50 text-blue-700 border border-blue-100 font-extrabold text-[10px] uppercase py-1 px-3">
                       Shift Completed for Today
                    </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="border border-slate-200 shadow-lg rounded-3xl overflow-hidden bg-white h-full">
            <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row items-center gap-4">
              <div className="bg-slate-700/10 text-slate-800 rounded-2xl p-3 shadow-inner shrink-0">
                <History className="h-6 w-6"/>
              </div>
              <div>
                <CardTitle className="text-slate-900 font-black tracking-tight text-lg">Shift Logs Feed</CardTitle>
                <CardDescription className="font-semibold text-slate-500 text-xs mt-0.5">Your recent clock-in / clock-out activity.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isLogsLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="animate-spin h-8 w-8 text-indigo-500"/>
                </div>
              ) : (
                <div className="relative pl-6 space-y-6">
                  {/* Timeline axis line */}
                  <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-100"></div>

                  {attendanceLogs && attendanceLogs.length > 0 ? (
                    attendanceLogs.map((log, index) => {
                      const uniqueKey = log.id || `${log.staffId}-${log.type}-${log.timestamp?.toMillis()}-${index}`;
                      const logDate = log.timestamp?.toDate ? log.timestamp.toDate() : new Date();
                      
                      return (
                        <div key={uniqueKey} className="relative group flex flex-col gap-1.5 transition-all">
                          {/* Timeline node */}
                          <div className={cn(
                             "absolute -left-[27.5px] top-1.5 rounded-full p-1 border-4 border-white shadow-md z-10 text-white",
                             log.type === 'In' ? 'bg-emerald-500' : 'bg-rose-500'
                          )}>
                             {log.type === 'In' ? <LogIn className="h-3 w-3"/> : <LogOut className="h-3 w-3"/>}
                          </div>

                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="font-bold text-slate-850 text-xs">
                                {log.type === 'In'
                                  ? ((log as any).afterHours ? 'Clocked In (After hours)' : log.status === 'Late' ? 'Clocked In (Late)' : 'Clocked In')
                                  : (log.leftEarly ? 'Clocked Out (Early)' : 'Clocked Out')}
                              </p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase font-mono mt-0.5">
                                {format(logDate, 'PPPP')} @ {format(logDate, 'p')}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {/* Proximity: older records have distance 0 when the campus location was not set, so they say "not checked" */}
                            {log.isFlagged ? (
                               <Badge variant="outline" className="h-4.5 text-[8px] font-extrabold uppercase px-1.5 border-rose-200 text-rose-600 bg-rose-50/50 rounded-md">
                                  Off-Site ({fmtDistance(log.distanceMeters ?? 0)})
                               </Badge>
                            ) : (log as any).geofence === 'not_set' || !log.distanceMeters ? (
                               <Badge variant="outline" className="h-4.5 text-[8px] font-extrabold uppercase px-1.5 border-slate-200 text-slate-500 bg-slate-50 rounded-md">
                                  Location not checked
                               </Badge>
                            ) : (
                               <Badge variant="outline" className="h-4.5 text-[8px] font-extrabold uppercase px-1.5 border-emerald-200 text-emerald-600 bg-emerald-50/40 rounded-md">
                                  On-Campus ({fmtDistance(log.distanceMeters)})
                               </Badge>
                            )}

                            {/* Identity: only "AI Verified" when the face check really passed */}
                            {log.isIdentityFlagged ? (
                               <Badge variant="destructive" className="h-4.5 text-[8px] font-black uppercase px-1.5 tracking-wider rounded-md" title={log.identityNotes}>
                                  Face Mismatch
                               </Badge>
                            ) : ((log as any).identityStatus === 'verified' || log.identityNotes === 'Identity Verified by AI.') ? (
                               <Badge variant="outline" className="h-4.5 text-[8px] font-extrabold uppercase px-1.5 border-indigo-200 text-indigo-600 bg-indigo-50/50 rounded-md">
                                  AI Verified
                               </Badge>
                            ) : (
                               <Badge variant="outline" className="h-4.5 text-[8px] font-extrabold uppercase px-1.5 border-slate-200 text-slate-500 bg-slate-50 rounded-md" title={log.identityNotes || ''}>
                                  Face not checked
                               </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-3">
                       <History className="h-10 w-10 text-slate-300"/>
                       <p className="text-xs font-semibold italic">No clock-ins yet.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
