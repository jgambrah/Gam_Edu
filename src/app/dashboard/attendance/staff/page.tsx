'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, query, where, orderBy, addDoc, serverTimestamp, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, UserCheck, History, LogIn, LogOut, MapPin, CheckCircle2, AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { WebcamCapture } from '@/components/dashboard/attendance/WebcamCapture';
import { useCurrentSchool } from '@/hooks/use-current-school';
import type { StaffAttendance } from '@/lib/types';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRole } from '@/context/role-context';
import { verifyStaffIdentityAction } from '@/app/actions/verify-identity';
import { getDistanceInMeters } from '@/lib/geo';
import { cn } from '@/lib/utils';

/**
 * Converts HH:mm time string to a Date object for today.
 */
const getTodayTimeFromStr = (timeStr: string) => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
};

export default function StaffAttendancePage() {
  const { user, isUserLoading } = useUser();
  const { role, loading: isRoleLoading } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId, loading: isSchoolLoading } = useCurrentSchool();

  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const isStaff = role && !['Student', 'Parent'].includes(role);

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

  useEffect(() => {
    if (isStaff && "geolocation" in navigator) {
      // Use high accuracy settings to prevent false off-campus flags
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError(error.message);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Could not get your location. Please enable location services to verify your campus proximity.",
          });
        },
        { 
            enableHighAccuracy: true, 
            timeout: 15000, 
            maximumAge: 0 
        }
      );
    }
  }, [toast, isStaff]);

  const lastAction = useMemo(() => attendanceLogs?.[0], [attendanceLogs]);

  const hasClockedInToday = useMemo(() => {
    if (!lastAction || !lastAction.timestamp) return false;
    const today = new Date();
    const lastActionDate = lastAction.timestamp.toDate();
    return lastAction.type === 'In' && lastActionDate.getDate() === today.getDate() && lastActionDate.getMonth() === today.getMonth();
  }, [lastAction]);
  
  const hasClockedOutToday = useMemo(() => {
      if(!lastAction || !hasClockedInToday) return false;
      return lastAction.type === 'Out';
  }, [lastAction, hasClockedInToday]);


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

    // 1. AI IDENTITY VERIFICATION
    let isIdentityFlagged = false;
    let identityNotes = "";
    
    try {
        const staffDoc = await getDoc(doc(firestore!, 'staff', user.uid));
        const profilePic = staffDoc.data()?.photoURL;

        if (profilePic && imageDataUri) {
            toast({ title: "Verifying Identity...", description: "AI is checking facial match." });
            const verifyRes = await verifyStaffIdentityAction(profilePic, imageDataUri);
            
            if (verifyRes.success && verifyRes.data) {
                if (verifyRes.data.isMatch === false) {
                    isIdentityFlagged = true;
                    identityNotes = verifyRes.data.confidence;
                    toast({ variant: 'destructive', title: "Identity Flag", description: "Your photo does not match our records. Logged for review." });
                } else {
                    identityNotes = "Identity Verified by AI.";
                }
            } else {
                identityNotes = "AI Comparison Failed. Manual review required.";
            }
        } else {
            identityNotes = "Profile picture missing. Could not perform AI verification.";
        }
    } catch (err) {
        console.error("Identity verification error:", err);
        identityNotes = "System error during identity check.";
    }

    // Geofencing logic
    let isFlagged = false;
    let distance = 0;
    
    if (schoolSettings?.schoolLat && schoolSettings?.schoolLng) {
        distance = getDistanceInMeters(
            schoolSettings.schoolLat, 
            schoolSettings.schoolLng, 
            location.latitude, 
            location.longitude
        );
        if (distance > (schoolSettings.allowedRadius || 200)) {
            isFlagged = true;
        }
    }

    // Time Tracking Logic
    const now = new Date();
    let calculatedStatus = 'Present';
    let leftEarly = false;

    if (type === 'In') {
        const expectedStart = getTodayTimeFromStr(schoolSettings?.schoolStartTime);
        if (expectedStart && now.getTime() > expectedStart.getTime() + (5 * 60 * 1000)) {
            calculatedStatus = 'Late';
        }
    } else {
        const expectedClose = getTodayTimeFromStr(schoolSettings?.schoolCloseTime);
        if (expectedClose && now.getTime() < expectedClose.getTime()) {
            leftEarly = true;
        }
    }

    try {
      await addDocumentNonBlocking(collection(firestore!, 'staff_attendance'), {
        staffId: user.uid,
        staffName: user.displayName || 'N/A',
        type,
        status: calculatedStatus,
        leftEarly,
        timestamp: serverTimestamp(),
        verificationPhotoUrl: imageDataUri,
        schoolId: schoolId,
        latitude: location.latitude,
        longitude: location.longitude,
        isFlagged,
        distanceMeters: Math.round(distance),
        isIdentityFlagged,
        identityNotes,
      });

      toast({ 
          title: `Clocked ${type}!`, 
          description: isFlagged 
            ? `Your record has been flagged because you are ${Math.round(distance)}m from campus.` 
            : `Your ${type === 'In' ? 'arrival' : 'departure'} has been recorded.` 
      });

      setImageDataUri(null);
      forceRefetch();
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: `Failed to clock ${type}.` });
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
                   {schoolSettings?.schoolStartTime || '08:00'} - {schoolSettings?.schoolCloseTime || '16:00'}
                </span>
             </div>
             <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
             <div className="text-xs space-y-1">
                <span className="text-indigo-200/60 block uppercase font-extrabold tracking-wider text-[9px]">Allowed Radius</span>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/20 uppercase font-black text-[9px] px-2 py-0.5 block w-fit">
                   {schoolSettings?.allowedRadius || 200}m Proximity
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
                       {schoolSettings?.schoolLat && schoolSettings?.schoolLng && (
                         <div className="col-span-2 border-t pt-2 mt-1 flex justify-between items-center text-xs font-sans font-bold">
                            <span>Campus Distance:</span>
                            <Badge variant="outline" className={cn(
                               "font-black text-[10px] border-none shadow-none px-0",
                               getDistanceInMeters(schoolSettings.schoolLat, schoolSettings.schoolLng, location.latitude, location.longitude) > (schoolSettings.allowedRadius || 200)
                                ? "text-rose-600"
                                : "text-emerald-600"
                            )}>
                               {Math.round(getDistanceInMeters(schoolSettings.schoolLat, schoolSettings.schoolLng, location.latitude, location.longitude))}m away 
                               ({getDistanceInMeters(schoolSettings.schoolLat, schoolSettings.schoolLng, location.latitude, location.longitude) > (schoolSettings.allowedRadius || 200) ? 'Off-Site' : 'On-Site'})
                            </Badge>
                         </div>
                       )}
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
                      const logDate = log.timestamp ? log.timestamp.toDate() : new Date();
                      
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
                                {log.type === 'In' ? (log.status === 'Late' ? 'Clocked In (Late)' : 'Clocked In') : (log.leftEarly ? 'Clocked Out (Early)' : 'Clocked Out')}
                              </p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase font-mono mt-0.5">
                                {format(logDate, 'PPPP')} @ {format(logDate, 'p')}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {/* Proximity / Off-site Indicator */}
                            {log.isFlagged ? (
                               <Badge variant="outline" className="h-4.5 text-[8px] font-extrabold uppercase px-1.5 border-rose-250 text-rose-600 bg-rose-50/50 rounded-md">
                                  Off-Site ({log.distanceMeters ?? 0}m)
                               </Badge>
                            ) : (
                               <Badge variant="outline" className="h-4.5 text-[8px] font-extrabold uppercase px-1.5 border-emerald-250 text-emerald-600 bg-emerald-50/40 rounded-md">
                                  On-Campus
                               </Badge>
                            )}

                            {/* Identity Flag */}
                            {log.isIdentityFlagged ? (
                               <Badge variant="destructive" className="h-4.5 text-[8px] font-black uppercase px-1.5 tracking-wider rounded-md">
                                  Face Mismatch
                               </Badge>
                            ) : (
                               <Badge variant="outline" className="h-4.5 text-[8px] font-extrabold uppercase px-1.5 border-indigo-200 text-indigo-600 bg-indigo-50/50 rounded-md">
                                  AI Verified
                               </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-3">
                       <History className="h-10 w-10 text-slate-300"/>
                       <p className="text-xs font-semibold italic">No clocking activities registered in this term.</p>
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
