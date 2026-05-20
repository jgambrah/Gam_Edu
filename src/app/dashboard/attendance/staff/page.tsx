'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, query, where, orderBy, addDoc, serverTimestamp, limit, getDocs, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, UserCheck, History, LogIn, LogOut, MapPin, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { WebcamCapture } from '@/components/dashboard/attendance/WebcamCapture';
import { useCurrentSchool } from '@/hooks/use-current-school';
import type { StaffAttendance } from '@/lib/types';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRole } from '@/context/role-context';

/**
 * Calculates the great-circle distance between two points (Haversine formula).
 * @returns Distance in meters.
 */
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const dp = (lat2 - lat1) * Math.PI / 180;
  const dl = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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
    <div className="grid md:grid-cols-3 gap-6 p-4 md:p-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Camera/> Staff Attendance</CardTitle>
            <CardDescription>Use your device's camera to clock in and out. Your location is verified against the school's geofence.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <WebcamCapture 
                imageDataUri={imageDataUri} 
                setImageDataUri={setImageDataUri}
            />
             <div className="w-full text-center p-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                {location ? (
                    <span className="flex items-center justify-center gap-1 text-green-600"><CheckCircle2 className="h-4 w-4"/> Location Acquired</span>
                ) : locationError ? (
                    <span className="text-red-600">{locationError}</span>
                ) : (
                    <span className="flex items-center justify-center gap-1"><Loader2 className="h-4 w-4 animate-spin"/> Acquiring location...</span>
                )}
            </div>
            <div className="flex w-full gap-4 mt-4">
              <Button 
                onClick={() => handleClockAction('In')} 
                disabled={isSubmitting || !imageDataUri || hasClockedInToday || !location}
                className="flex-1 bg-green-600 hover:bg-green-700 h-12 text-lg"
              >
                {isSubmitting ? <Loader2 className="animate-spin"/> : <LogIn className="mr-2"/>} Clock In
              </Button>
              <Button 
                onClick={() => handleClockAction('Out')}
                disabled={isSubmitting || !imageDataUri || !hasClockedInToday || hasClockedOutToday || !location}
                className="flex-1 bg-red-500 hover:bg-red-600 h-12 text-lg"
              >
                {isSubmitting ? <Loader2 className="animate-spin"/> : <LogOut className="mr-2"/>} Clock Out
              </Button>
            </div>
            {hasClockedInToday && !hasClockedOutToday && (
                <p className="text-sm text-green-600 font-medium">You have clocked in for today.</p>
            )}
             {hasClockedOutToday && (
                <p className="text-sm text-blue-600 font-medium">You have already clocked out for today.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><History/> Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLogsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin h-6 w-6 text-slate-400"/>
              </div>
            ) : (
              <ul className="space-y-4">
                {attendanceLogs && attendanceLogs.length > 0 ? (
                  attendanceLogs.map((log, index) => {
                    const uniqueKey = log.id || `${log.staffId}-${log.type}-${log.timestamp?.toMillis()}-${index}`;
                    return (
                      <li key={uniqueKey} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-full ${log.type === 'In' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {log.type === 'In' ? <LogIn className="h-4 w-4"/> : <LogOut className="h-4 w-4"/>}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm">{log.type === 'In' ? (log.status === 'Late' ? 'Clocked In (Late)' : 'Clocked In') : (log.leftEarly ? 'Clocked Out (Early)' : 'Clocked Out')}</p>
                                {(log as any).isFlagged && <Badge variant="destructive" className="h-4 text-[8px] uppercase px-1">Off Campus</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {log.timestamp ? format(log.timestamp.toDate(), 'p') : 'Processing...'}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No records found.</p>
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
