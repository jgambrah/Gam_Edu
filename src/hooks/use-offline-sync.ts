'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, doc, Timestamp } from 'firebase/firestore';
import { startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export interface OfflineAttendanceBatch {
  id: string;
  type: 'attendance';
  timestamp: number;
  schoolId: string;
  classId: string;
  dateStr: string;
  records: Array<{
    studentId: string;
    studentName?: string;
    status: 'Present' | 'Absent' | 'Late' | 'Excused';
    notes?: string;
    usesBusService?: string;
    usesCanteen?: string;
  }>;
}

export interface OfflineGradeBatch {
  id: string;
  type: 'grade';
  timestamp: number;
  schoolId: string;
  classId: string;
  subjectId: string;
  assessmentName: string;
  maxScore: number;
  grades: Array<{
    studentId: string;
    studentName?: string;
    score: number;
    remarks?: string;
  }>;
}

export type OfflineQueueItem = OfflineAttendanceBatch | OfflineGradeBatch;

const ATTENDANCE_QUEUE_KEY = 'gam_offline_attendance_queue_v1';
const GRADES_QUEUE_KEY = 'gam_offline_grades_queue_v1';

export function useOfflineSync() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);

  // Read stored queue count
  const updatePendingCount = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const attendanceQueue: OfflineAttendanceBatch[] = JSON.parse(localStorage.getItem(ATTENDANCE_QUEUE_KEY) || '[]');
      const gradesQueue: OfflineGradeBatch[] = JSON.parse(localStorage.getItem(GRADES_QUEUE_KEY) || '[]');
      setPendingCount(attendanceQueue.length + gradesQueue.length);
    } catch (e) {
      console.warn('Failed to parse offline queues from localStorage:', e);
    }
  }, []);

  // Save Offline Attendance Batch
  const saveOfflineAttendance = useCallback((data: Omit<OfflineAttendanceBatch, 'id' | 'type' | 'timestamp'>) => {
    if (typeof window === 'undefined') return;
    try {
      const queue: OfflineAttendanceBatch[] = JSON.parse(localStorage.getItem(ATTENDANCE_QUEUE_KEY) || '[]');
      const newItem: OfflineAttendanceBatch = {
        ...data,
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: 'attendance',
        timestamp: Date.now()
      };
      queue.push(newItem);
      localStorage.setItem(ATTENDANCE_QUEUE_KEY, JSON.stringify(queue));
      updatePendingCount();

      toast({
        title: 'Saved Offline 📡',
        description: `Saved attendance for ${data.records.length} students locally. Will auto-sync when internet reconnects.`,
      });
    } catch (e) {
      console.error('Failed to save offline attendance batch:', e);
    }
  }, [toast, updatePendingCount]);

  // Save Offline Grade Batch
  const saveOfflineGrade = useCallback((data: Omit<OfflineGradeBatch, 'id' | 'type' | 'timestamp'>) => {
    if (typeof window === 'undefined') return;
    try {
      const queue: OfflineGradeBatch[] = JSON.parse(localStorage.getItem(GRADES_QUEUE_KEY) || '[]');
      const newItem: OfflineGradeBatch = {
        ...data,
        id: `grd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: 'grade',
        timestamp: Date.now()
      };
      queue.push(newItem);
      localStorage.setItem(GRADES_QUEUE_KEY, JSON.stringify(queue));
      updatePendingCount();

      toast({
        title: 'Saved Offline 📡',
        description: `Saved ${data.assessmentName} grades for ${data.grades.length} students locally. Will auto-sync when internet reconnects.`,
      });
    } catch (e) {
      console.error('Failed to save offline grade batch:', e);
    }
  }, [toast, updatePendingCount]);

  // Sync function to process offline items when online
  const syncOfflineData = useCallback(async () => {
    if (typeof window === 'undefined' || !firestore || isSyncing) return;

    try {
      const attendanceQueue: OfflineAttendanceBatch[] = JSON.parse(localStorage.getItem(ATTENDANCE_QUEUE_KEY) || '[]');
      const gradesQueue: OfflineGradeBatch[] = JSON.parse(localStorage.getItem(GRADES_QUEUE_KEY) || '[]');

      const totalItems = attendanceQueue.length + gradesQueue.length;
      if (totalItems === 0) return;

      setIsSyncing(true);
      console.log(`Starting offline sync for ${totalItems} batch items...`);

      // 1. Sync Attendance Batches
      if (attendanceQueue.length > 0) {
        const remainingAttendance: OfflineAttendanceBatch[] = [];

        for (const batchItem of attendanceQueue) {
          try {
            const batch = writeBatch(firestore);
            const attDate = startOfDay(new Date(batchItem.dateStr));

            for (const rec of batchItem.records) {
              const newRef = doc(collection(firestore, 'attendance'));
              batch.set(newRef, {
                schoolId: batchItem.schoolId,
                classId: batchItem.classId,
                studentId: rec.studentId,
                studentName: rec.studentName || 'Student',
                status: rec.status,
                notes: rec.notes || '',
                date: Timestamp.fromDate(attDate),
                syncedFromOffline: true,
                createdAt: Timestamp.now()
              });
            }
            await batch.commit();
          } catch (err) {
            console.error('Failed to sync attendance batch:', batchItem, err);
            remainingAttendance.push(batchItem);
          }
        }
        localStorage.setItem(ATTENDANCE_QUEUE_KEY, JSON.stringify(remainingAttendance));
      }

      // 2. Sync Grade Batches
      if (gradesQueue.length > 0) {
        const remainingGrades: OfflineGradeBatch[] = [];

        for (const batchItem of gradesQueue) {
          try {
            const batch = writeBatch(firestore);

            for (const g of batchItem.grades) {
              const newRef = doc(collection(firestore, 'grades'));
              batch.set(newRef, {
                schoolId: batchItem.schoolId,
                classId: batchItem.classId,
                subjectId: batchItem.subjectId,
                assessmentName: batchItem.assessmentName,
                maxScore: batchItem.maxScore,
                studentId: g.studentId,
                score: g.score,
                remarks: g.remarks || '',
                syncedFromOffline: true,
                createdAt: Timestamp.now()
              });
            }
            await batch.commit();
          } catch (err) {
            console.error('Failed to sync grade batch:', batchItem, err);
            remainingGrades.push(batchItem);
          }
        }
        localStorage.setItem(GRADES_QUEUE_KEY, JSON.stringify(remainingGrades));
      }

      updatePendingCount();
      toast({
        title: 'Offline Sync Complete 🔄',
        description: `Successfully uploaded ${totalItems} offline attendance/grade entries to database.`,
      });
    } catch (e) {
      console.error('Error during offline sync process:', e);
    } finally {
      setIsSyncing(false);
    }
  }, [firestore, isSyncing, toast, updatePendingCount]);

  // Network Online/Offline Listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);
    updatePendingCount();

    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: 'Internet Reconnected 🌐',
        description: 'Connection restored. Checking for offline items to sync...',
      });
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        variant: 'destructive',
        title: 'Offline Mode Active 📡',
        description: 'Internet connection lost. You can continue marking attendance and grades; changes will save locally.',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial sync check if online
    if (navigator.onLine) {
      syncOfflineData();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncOfflineData, toast, updatePendingCount]);

  return {
    isOnline,
    isSyncing,
    pendingCount,
    saveOfflineAttendance,
    saveOfflineGrade,
    syncOfflineData
  };
}
