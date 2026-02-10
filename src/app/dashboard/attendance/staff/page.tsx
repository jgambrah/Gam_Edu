
      
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, orderBy, addDoc, serverTimestamp, limit, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, UserCheck, History, LogIn, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { WebcamCapture } from '@/components/dashboard/attendance/WebcamCapture';
import { useCurrentSchool } from '@/hooks/use-current-school';
import type { StaffAttendance } from '@/lib/types';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function StaffAttendancePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();

  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch recent attendance logs for the current user
  const attendanceQuery = useMemoFirebase(() => {
    if (!user || !schoolId || !firestore) return null;
    return query(
      collection(firestore, 'staff_attendance'),
      where('schoolId', '==', schoolId),
      where('staffId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
  }, [user, schoolId, firestore]);
  const { data: attendanceLogs, isLoading } = useCollection<StaffAttendance>(attendanceQuery);

  const lastAction = useMemo(() => attendanceLogs?.[0], [attendanceLogs]);
  const hasClockedInToday = useMemo(() => {
    if (!lastAction) return false;
    const today = new Date();
    const lastActionDate = lastAction.timestamp.toDate();
    return lastAction.type === 'In' && lastActionDate.getDate() === today.getDate() && lastActionDate.getMonth() === today.getMonth();
  }, [lastAction]);
  
  const hasClockedOutToday = useMemo(() => {
      if(!lastAction || !hasClockedInToday) return false;
      return lastAction.type === 'Out';
  }, [lastAction, hasClockedInToday]);


  const handleClockIn = async () => {
    if (!user || !imageDataUri || !schoolId) return;
    setIsSubmitting(true);
    try {
      await addDocumentNonBlocking(collection(firestore, 'staff_attendance'), {
        staffId: user.uid,
        staffName: user.displayName || 'N/A',
        type: 'In',
        timestamp: serverTimestamp(),
        verificationPhotoUrl: imageDataUri,
        schoolId: schoolId,
      });
      toast({ title: 'Clocked In!', description: 'Your arrival has been recorded.' });
      setImageDataUri(null);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to clock in.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClockOut = async () => {
    if (!user || !imageDataUri || !schoolId) return;
    setIsSubmitting(true);
    try {
        await addDocumentNonBlocking(collection(firestore, 'staff_attendance'), {
            staffId: user.uid,
            staffName: user.displayName || 'N/A',
            type: 'Out',
            timestamp: serverTimestamp(),
            verificationPhotoUrl: imageDataUri,
            schoolId: schoolId,
        });
        toast({ title: 'Clocked Out!', description: 'Your departure has been recorded.' });
        setImageDataUri(null);
    } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to clock out.'});
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 p-4 md:p-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Camera/> Staff Attendance</CardTitle>
            <CardDescription>Use your device's camera to clock in and out for the day.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <WebcamCapture 
                imageDataUri={imageDataUri} 
                setImageDataUri={setImageDataUri}
            />
            <div className="flex w-full gap-4 mt-4">
              <Button 
                onClick={handleClockIn} 
                disabled={isSubmitting || !imageDataUri || hasClockedInToday}
                className="flex-1 bg-green-600 hover:bg-green-700 h-12 text-lg"
              >
                {isSubmitting ? <Loader2 className="animate-spin"/> : <LogIn className="mr-2"/>} Clock In
              </Button>
              <Button 
                onClick={handleClockOut}
                disabled={isSubmitting || !imageDataUri || !hasClockedInToday || hasClockedOutToday}
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
            {isLoading ? <Loader2 className="animate-spin"/> : (
              <ul className="space-y-4">
                {attendanceLogs?.map(log => (
                  <li key={log.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full ${log.type === 'In' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {log.type === 'In' ? <LogIn className="h-4 w-4"/> : <LogOut className="h-4 w-4"/>}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{log.type}</p>
                        <p className="text-xs text-muted-foreground">{format(log.timestamp.toDate(), 'PPP p')}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {attendanceLogs?.length === 0 && !isLoading && <p className="text-sm text-muted-foreground text-center">No records found.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
      
    