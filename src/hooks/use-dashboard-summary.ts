'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export interface AttendanceSummary {
  date: string;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  attendanceRate: number;
  absentStudentIds: string[];
}

export interface FinancialSummary {
  totalCollectedToday: number;
  totalCollectedThisMonth: number;
  totalCollectedThisTerm: number;
  totalCollectedThisYear?: number;
  totalBilled?: number;
  totalRevenue?: number;
  collectionRate?: number;
  totalOutstanding: number;
  arrearsCount: number;
  lastPaymentAt: { toDate?: () => Date; seconds?: number } | null;
  lastPaymentAmount: number;
  streamBreakdown?: {
    tuition: number;
    canteen: number;
    transport: number;
    auxiliary: number;
  };
}

export interface StudentCountSummary {
  total: number;
  active: number;
  withdrawn: number;
  new_this_month: number;
}

export interface StaffSummary {
  total: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
}

export interface AcademicsSummary {
  avgScorePercent: number;
  passingRatePercent: number;
  activeAlerts: number;
  pendingAssessments: number;
}

export interface AdmissionsSummary {
  pendingCount: number;
  approvedThisMonth: number;
}

export interface BehavioralSummary {
  incidentsThisWeek: number;
  positiveThisWeek: number;
}

export interface SystemSummary {
  parentEngagementScore: number;
  lessonPlanComplianceRate: number;
}

export interface DashboardSummary {
  schoolId?: string;
  studentCount?: StudentCountSummary;
  attendance?: AttendanceSummary;
  financials?: FinancialSummary;
  staff?: StaffSummary;
  academics?: AcademicsSummary;
  admissions?: AdmissionsSummary;
  behavioral?: BehavioralSummary;
  system?: SystemSummary;
  lastUpdated?: { toDate?: () => Date; seconds?: number };
}

/**
 * useDashboardSummary
 *
 * Attaches a single Firestore onSnapshot listener to
 * `dashboard_summaries/{schoolId}` — one document read instead of
 * 18 raw collection sweeps.
 *
 * The document is kept up-to-date server-side by Cloud Functions
 * that use FieldValue.increment on every relevant write.
 */
export function useDashboardSummary(schoolId: string | null | undefined) {
  const firestore = useFirestore();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStale, setIsStale] = useState(false); // true if document doesn't exist yet

  useEffect(() => {
    if (!firestore || !schoolId) {
      setIsLoading(false);
      return;
    }

    const summaryRef = doc(firestore, 'dashboard_summaries', schoolId);

    const unsubscribe = onSnapshot(
      summaryRef,
      (snap) => {
        if (snap.exists()) {
          setSummary(snap.data() as DashboardSummary);
          setIsStale(false);
        } else {
          // Cloud Functions haven't seeded this yet — return empty shell
          // so UI renders gracefully with fallback values
          setSummary({});
          setIsStale(true);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('[useDashboardSummary] Listener error:', error.code, error.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, schoolId]);

  return { summary, isLoading, isStale };
}
