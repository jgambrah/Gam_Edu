import React, { useState, useMemo } from 'react';
import { FeeChangeReviewPanel } from '@/components/finance/FeeChangeReviewPanel';
import { UnbilledStudentsPanel } from '@/components/finance/UnbilledStudentsPanel';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  AlertCircle, AlertTriangle, ArrowUpRight, Award, Banknote, Bell, 
  BookOpen, BrainCircuit, CheckCircle2, ChevronRight, Clock, 
  Download, FileText, Megaphone, RefreshCw, Send, ShieldAlert, 
  Sparkles, TrendingUp, UserCheck, Users, X, XCircle, ChevronDown,
  Building2, Globe, Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { computeFinancialMetrics, safeParseDate } from '@/lib/financial-analytics';
import { buildExecutiveTelemetry } from '@/hooks/use-executive-telemetry';
import { ExecutiveAIAuditorDrawer } from './ExecutiveAIAuditorDrawer';
import { answerExecutiveQuestionAction } from '@/app/actions/insights-ai';
import { summaryYearPerformance, summaryDebtSplit } from '@/lib/finance-summary';
import { currentTermFromProfile } from '@/lib/term';

export function ExecutiveDirectorCockpit({
  profile,
  students = [],
  staff = [],
  classes = [],
  campuses = [],
  subjects = [],
  schoolProfile = {},
  financials = {},
  financialRecords = [],
  payments = [],
  debtAgingStats = {},
  dashboardSummary,
  attendanceRate = 83,
  attendance = [],
  todayPresentCount,
  activeStudentsCount,
  studentTeacherRatio,
  academicTidbits = {},
  todayTeacherAttendance = { present: [], absent: [], late: [] },
  behaviorStats = { positive: 0, infractions: 0, recent: [] },
  behavioralRecords = [],
  recentAssessments = [],
  onNavigateTab,
  hasFinanceAccess,
  selectedCampus: externalSelectedCampus,
  onSelectCampus: externalOnSelectCampus,
  openTillsCash = 0,
  openTillsTransactionsCount = 0,
  financialsMode = 'on-demand',
  onLoadFinancials,
  onSwitchOnDemand,
  isLoadingFinancials = false,
  aiCreditBalance = 0,
}: any) {
  const { toast } = useToast();
  const router = useRouter();

  const isAdministrator = profile?.role === 'Administrator' || profile?.role === 'Admin';
  const isDirectorOrSuper = profile?.role === 'Director' || profile?.email?.toLowerCase() === 'jamesgambrah@gmail.com';
  const showFinancials = isDirectorOrSuper ? true : (hasFinanceAccess !== undefined ? hasFinanceAccess : !isAdministrator);

  // Drawers & Drilldown States
  const [activeDrawer, setActiveDrawer] = useState<'staff' | 'arrears' | 'pantry' | null>(null);
  const [activeHeroModal, setActiveHeroModal] = useState<'financial' | 'academic' | 'attendance' | 'faculty' | null>(null);
  const [selectedAgingCategory, setSelectedAgingCategory] = useState<string | null>(null);

  // Dynamic Campus / Branch Resolution (Hooked to school data, non-hardcoded)
  const availableCampuses = useMemo(() => {
    const raw = (campuses && campuses.length > 0)
      ? campuses
      : (schoolProfile?.campuses || schoolProfile?.branches || profile?.campuses || profile?.branches || []);

    if (Array.isArray(raw) && raw.length > 0) {
      const list = raw.map((c: any, idx: number) => ({
        id: c.id || c.code || `campus-${idx}`,
        name: typeof c === 'string' ? c : (c.name || c.title || `Campus ${idx + 1}`),
        code: c.code || (typeof c === 'string' ? c.substring(0, 3).toUpperCase() : `C${idx + 1}`),
        badge: c.isMain || idx === 0 ? 'Main Campus' : 'Branch'
      }));

      if (list.length > 1) {
        list.push({
          id: 'all',
          name: 'All Campuses (Consolidated Group View)',
          code: 'ALL',
          badge: 'Group View'
        });
      }
      return list;
    }

    const schoolName = profile?.schoolName || schoolProfile?.name || "Main Campus";
    return [
      {
        id: 'main',
        name: schoolName.toLowerCase().includes('campus') ? schoolName : `${schoolName} (Main Campus)`,
        code: schoolName.substring(0, 3).toUpperCase(),
        badge: 'Main Campus'
      }
    ];
  }, [campuses, schoolProfile, profile]);

  // Multi-Campus Selection State (Controlled by parent header or internal)
  const [internalSelectedCampus, setInternalSelectedCampus] = useState<string>(availableCampuses[0]?.name || 'Main Campus');
  const selectedCampus = externalSelectedCampus || internalSelectedCampus;
  const setSelectedCampus = (name: string) => {
    setInternalSelectedCampus(name);
    externalOnSelectCampus?.(name);
  };

  // Synchronize initial selected campus when availableCampuses resolves
  React.useEffect(() => {
    if (availableCampuses.length > 0 && !externalSelectedCampus) {
      setInternalSelectedCampus(availableCampuses[0].name);
    }
  }, [availableCampuses, externalSelectedCampus]);

  // Direct Action Inline Resolution Modal State
  const [activeActionModal, setActiveActionModal] = useState<'arrears_action' | 'staff_action' | 'pantry_action' | 'announcement_modal' | null>(null);

  // Editable AI Draft Action Template State for Direct Execution
  const [aiDraftTemplate, setAiDraftTemplate] = useState<{ title: string; recipient: string; subject: string; body: string } | null>(null);

  const handleSelectCampus = (campusName: string) => {
    setSelectedCampus(campusName);
    toast({
      title: "Campus Context Switched",
      description: `Loaded operational & financial metrics for ${campusName}.`,
    });
  };

  // Active midnight rollover detection (re-evaluates every 15s to catch the 00:00:00 midnight cut-off)
  const [todayMidnight, setTodayMidnight] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      setTodayMidnight(prev => (now.getTime() !== prev.getTime() ? now : prev));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Unified Financial Analytics Engine (Single Source of Truth)
  const unifiedMetrics = useMemo(() => {
    return computeFinancialMetrics({
      financialRecords,
      payments,
      students,
      classes,
      campusId: selectedCampus,
      schoolSettings: schoolProfile,
    });
  }, [financialRecords, payments, students, classes, selectedCampus, schoolProfile, todayMidnight]);

  // Executive Financial Metrics Sourcing
  const financialSummary = useMemo(() => {
    // Validate whether dashboardSummary.financials last payment actually belongs to today (>= todayMidnight)
    const isSummaryPaymentFromToday = (() => {
      const lastPayment = dashboardSummary?.financials?.lastPaymentAt ||
                          (dashboardSummary?.financials as any)?.lastPaymentDate;
      if (!lastPayment) return false;
      const d = safeParseDate(lastPayment);
      return !!(d && d >= todayMidnight);
    })();

    const rawSummaryCollectedToday = Number(dashboardSummary?.financials?.totalCollectedToday || 0);
    // Never fall back to dashboardSummary.lastUpdated, as that is updated by non-financial events (attendance, sync, etc.)
    const validSummaryCollectedToday = isSummaryPaymentFromToday ? rawSummaryCollectedToday : 0;

    if (dashboardSummary?.financials) {
      const f = dashboardSummary.financials;
      // This academic year's bills, the same basis as Accounts > Student Billing and the Accountant dashboard.
      const yp = summaryYearPerformance(dashboardSummary, currentTermFromProfile(schoolProfile)?.academicYear);
      const totalBilled = yp ? yp.billed : (f.totalBilled || unifiedMetrics.totalBilled || 0);
      const totalRevenue = yp ? yp.paid : (f.totalRevenue || f.totalCollectedThisTerm || unifiedMetrics.collectedThisTerm || unifiedMetrics.totalRevenue || 0);
      const collectionRate = yp ? yp.rate : (f.collectionRate !== undefined ? f.collectionRate : (totalBilled > 0 ? Math.round((totalRevenue / totalBilled) * 100) : 0));
      return {
        totalBilled,
        totalRevenue,
        collectionRate,
        collectedToday: validSummaryCollectedToday > 0 ? validSummaryCollectedToday : (unifiedMetrics.collectedToday || 0),
      };
    }
    return {
      totalBilled: unifiedMetrics.totalBilled,
      totalRevenue: unifiedMetrics.collectedThisTerm || unifiedMetrics.totalRevenue,
      collectionRate: unifiedMetrics.collectionRate,
      collectedToday: unifiedMetrics.collectedToday,
    };
  }, [dashboardSummary, unifiedMetrics, todayMidnight, schoolProfile]);

  const todayCashCollected = useMemo(() => {
    const tillCash = Number(openTillsCash) || 0;
    const directPaymentsCash = Number(unifiedMetrics.collectedToday) || 0;
    const summaryCash = Number(financialSummary.collectedToday) || 0;
    const passedFinancialsCash = Number(financials?.collectedToday) || 0;

    // Use Math.max across all validated live revenue channels so active cash till collections are never suppressed
    const total = Math.max(
      tillCash,
      directPaymentsCash,
      summaryCash,
      passedFinancialsCash
    );

    // Count reflects verified transactions logged today across till and direct receipts
    const count = Math.max(
      Number(unifiedMetrics.todayCount) || 0,
      Number(openTillsTransactionsCount) || 0
    );

    return {
      total,
      count,
    };
  }, [openTillsCash, openTillsTransactionsCount, financials?.collectedToday, financialSummary.collectedToday, unifiedMetrics.collectedToday, unifiedMetrics.todayCount]);

  // Calculate student fee arrears dynamically from real student records
  const allArrearsList = useMemo(() => {
    return unifiedMetrics.arrearsRoster;
  }, [unifiedMetrics]);

  const highArrearsList = useMemo(() => {
    return allArrearsList.filter(item => item.daysOverdue > 60);
  }, [allArrearsList]);

  const displayedArrearsList = useMemo(() => {
    const rawRoster = unifiedMetrics.arrearsRoster || [];
    const targetItems = rawRoster.filter((item: any) => {
      const days = Number(item.daysOverdue ?? 0);
      if (!selectedAgingCategory) return days > 60;
      if (selectedAgingCategory === 'Not yet due') return days <= 0;
      if (selectedAgingCategory === '1 - 30 Days') return days > 0 && days <= 30;
      if (selectedAgingCategory === '31 - 60 Days') return days > 30 && days <= 60;
      if (selectedAgingCategory === 'Over 60 Days') return days > 60;
      return true;
    });

    const accountMap = new Map<string, {
      studentId: string;
      studentName: string;
      className: string;
      amount: number;
      daysOverdue: number;
      maxDaysOverdue: number;
      feeType: string;
      invoiceCount: number;
    }>();

    targetItems.forEach((item: any) => {
      const accId = String(item.studentId || item.studentName || item.id || 'std').trim();
      if (!accountMap.has(accId)) {
        accountMap.set(accId, {
          studentId: item.studentId,
          studentName: item.studentName || 'Student',
          className: item.className || 'Class Stream',
          amount: 0,
          daysOverdue: Number(item.daysOverdue) || 0,
          maxDaysOverdue: Number(item.daysOverdue) || 0,
          feeType: item.feeType || 'Tuition',
          invoiceCount: 0,
        });
      }
      const entry = accountMap.get(accId)!;
      entry.amount += Number(item.amount) || 0;
      entry.daysOverdue = Math.max(entry.daysOverdue, Number(item.daysOverdue) || 0);
      entry.maxDaysOverdue = Math.max(entry.maxDaysOverdue, Number(item.daysOverdue) || 0);
      entry.invoiceCount++;
    });

    return Array.from(accountMap.values()).sort((a, b) => b.amount - a.amount);
  }, [unifiedMetrics.arrearsRoster, selectedAgingCategory]);

  const totalHighArrearsSum = useMemo(() => {
    return highArrearsList.reduce((acc, curr) => acc + curr.amount, 0);
  }, [highArrearsList]);

  // Effective Debt Aging Resolution (server summary document or fallback to unifiedMetrics)
  const resolvedAging = useMemo(() => {
    if (dashboardSummary?.debtAging) {
      const da = dashboardSummary.debtAging;
      const grossTotal = (da.current || 0) + (da.age30 || 0) + (da.age60 || 0) + (da.age90 || 0) + (da.over90 || 0);
      if (grossTotal > 0 || (da.overpayments || 0) > 0) {
        const advancePayments = da.overpayments || 0;
        const netTotal = Math.max(0, grossTotal - advancePayments);

        const uCounts = unifiedMetrics.debtAgingStats?.accountCounts;
        const hasUnifiedCounts = uCounts && (
          uCounts.current > 0 || uCounts.age30 > 0 || uCounts.age60 > 0 || uCounts.age90 > 0 || uCounts.over90 > 0
        );

        const daCounts = (da as any).accountCounts;
        const hasDaCounts = daCounts && (
          daCounts.current > 0 || daCounts.age30 > 0 || daCounts.age60 > 0 || daCounts.age90 > 0 || daCounts.over90 > 0
        );

        let finalAccountCounts = hasDaCounts ? daCounts : (hasUnifiedCounts ? uCounts : null);

        if (!finalAccountCounts && unifiedMetrics.arrearsRoster && unifiedMetrics.arrearsRoster.length > 0) {
          const currentAcc = new Set<string>();
          const age30Acc = new Set<string>();
          const age60Acc = new Set<string>();
          const age90Acc = new Set<string>();
          const over90Acc = new Set<string>();

          unifiedMetrics.arrearsRoster.forEach((r: any) => {
            const accId = String(r.studentId || r.studentName || '').trim();
            if (!accId) return;
            const days = Number(r.daysOverdue || 0);
            if (days <= 0) currentAcc.add(accId);
            else if (days <= 30) age30Acc.add(accId);
            else if (days <= 60) age60Acc.add(accId);
            else if (days <= 90) age90Acc.add(accId);
            else over90Acc.add(accId);
          });

          finalAccountCounts = {
            current: currentAcc.size,
            age30: age30Acc.size,
            lessThan30: new Set([...currentAcc, ...age30Acc]).size,
            age60: age60Acc.size,
            age90: age90Acc.size,
            over90: over90Acc.size,
            totalOverdue: new Set([...age30Acc, ...age60Acc, ...age90Acc, ...over90Acc]).size,
            overdue60Plus: new Set([...age60Acc, ...age90Acc, ...over90Acc]).size,
          };
        }

        if (!finalAccountCounts || (finalAccountCounts.current === 0 && finalAccountCounts.age60 === 0 && finalAccountCounts.age90 === 0 && grossTotal > 0)) {
          const totalArrearsCount = dashboardSummary?.financials?.arrearsCount || 0;
          if (totalArrearsCount > 0) {
            const positiveBuckets = [
              { key: 'current', val: da.current || 0 },
              { key: 'age30', val: da.age30 || 0 },
              { key: 'age60', val: da.age60 || 0 },
              { key: 'age90', val: da.age90 || 0 },
              { key: 'over90', val: da.over90 || 0 },
            ].filter(b => b.val > 0);

            // Rough split of the number of unpaid BILLS (not students) — only used for the arrears drawer
            // heading; flagged so the aging tiers never show it as a student count.
            const estCounts: any = { __estimated: true, current: 0, age30: 0, lessThan30: 0, age60: 0, age90: 0, over90: 0, totalOverdue: 0, overdue60Plus: 0 };
            let assigned = 0;
            positiveBuckets.forEach((b, i) => {
              if (i === positiveBuckets.length - 1) {
                estCounts[b.key] = Math.max(1, totalArrearsCount - assigned);
              } else {
                const share = Math.max(1, Math.round((b.val / grossTotal) * totalArrearsCount));
                estCounts[b.key] = share;
                assigned += share;
              }
            });
            estCounts.lessThan30 = estCounts.current + estCounts.age30;
            estCounts.overdue60Plus = (estCounts.age60 || 0) + (estCounts.age90 || 0) + (estCounts.over90 || 0);
            estCounts.totalOverdue = (estCounts.age30 || 0) + estCounts.overdue60Plus;
            finalAccountCounts = estCounts;
          }
        }

        return {
          current: da.current || 0,
          age30: da.age30 || 0,
          age60: da.age60 || 0,
          age90: da.age90 || 0,
          over90: da.over90 || 0,
          grossTotal,
          netTotal,
          advancePayments,
          accountCounts: finalAccountCounts || { current: 0, age30: 0, lessThan30: 0, age60: 0, age90: 0, over90: 0, totalOverdue: 0, overdue60Plus: 0 }
        };
      }
    }
    return unifiedMetrics.debtAgingStats;
  }, [dashboardSummary, unifiedMetrics.debtAgingStats, unifiedMetrics.arrearsRoster]);

  const age60Bucket = resolvedAging.age60;
  const age90Bucket = resolvedAging.age90;
  const over90Bucket = resolvedAging.over90;
  // "More than 60 days" = the age90 bucket (61+ days); age60 is 31–60 days and is not included.
  const overdue60PlusSum = age90Bucket + over90Bucket;
  const overdue60PlusCount = (resolvedAging.accountCounts as any)?.__estimated ? null : (resolvedAging.accountCounts?.overdue60Plus ?? null);

  // Reconciled Student Academic Risk Computation (Synchronized with Academic Performance Dashboard)
  const atRiskStudentsList = useMemo(() => {
    if (!recentAssessments || recentAssessments.length === 0) return [];
    const studentGroup: Record<string, { totalPct: number; count: number; failingSubjects: Set<string> }> = {};

    recentAssessments.forEach((a: any) => {
      const sId = a.studentId || a.studentUid || a.studentName;
      if (!sId) return;
      const score = Number(a.score) || 0;
      const max = Number(a.maxScore) || 100;
      const pct = max > 0 ? Math.round((score / max) * 100) : 0;
      const matchedSubject = subjects?.find((s: any) => s.id === a.subjectId);
      const subjectName = matchedSubject?.name || a.subjectName || a.subjectId || "Subject";

      if (!studentGroup[sId]) {
        studentGroup[sId] = { totalPct: 0, count: 0, failingSubjects: new Set() };
      }
      studentGroup[sId].totalPct += pct;
      studentGroup[sId].count++;
      if (pct < 50) {
        studentGroup[sId].failingSubjects.add(subjectName);
      }
    });

    const list: any[] = [];
    Object.entries(studentGroup).forEach(([sId, data]) => {
      const avg = Math.round(data.totalPct / data.count);
      if (avg < 50) {
        const stud = students?.find((s: any) => 
          s.uid === sId || 
          s.id === sId || 
          (`${s.firstName || "" } ${s.lastName || "" }`.trim().toLowerCase() === sId.trim().toLowerCase())
        );
        const sClass = stud?.classId ? classes?.find((c: any) => c.id === stud.classId) : null;
        const status = avg < 40 ? "Critical" : avg < 45 ? "High Risk" : "Warning";
        const fullName = stud 
          ? `${stud.firstName || "" } ${stud.lastName || "" }`.trim() || stud.name || sId
          : sId;
        const className = sClass?.name || stud?.className || "Class Stream";

        list.push({
          id: sId,
          name: fullName,
          class: className,
          average: `${avg}%`,
          rawAvg: avg,
          subjects: Array.from(data.failingSubjects).slice(0, 3).join(", ") || "General Academics",
          status
        });
      }
    });

    list.sort((a, b) => a.rawAvg - b.rawAvg);
    return list;
  }, [recentAssessments, students, classes, subjects]);

  // Centralized Executive Telemetry Store (Single Authoritative Source of Truth)
  const telemetry = useMemo(() => {
    const rawTelemetry = buildExecutiveTelemetry({
      schoolProfile,
      profile,
      selectedCampus,
      financialSummary,
      unifiedMetrics,
      financials,
      resolvedAging,
      staff,
      todayTeacherAttendance,
      students,
      activeStudentsCount,
      todayPresentCount,
      attendanceRate,
      academicTidbits,
      atRiskStudentsList,
    });

    return {
      ...rawTelemetry,
      pendingStaffCheckins: rawTelemetry.staff.pendingCheckins,
      highArrearsCount: rawTelemetry.financials.highArrearsCount,
      highArrearsOverdueSum: rawTelemetry.financials.highArrearsOverdueSum,
      currentBucket: rawTelemetry.financials.lessThan30Bucket,
      age30Bucket: (rawTelemetry.financials as any).age30Bucket ?? rawTelemetry.financials.lessThan30Bucket,
      lessThan30Bucket: rawTelemetry.financials.lessThan30Bucket,
      age60Bucket: rawTelemetry.financials.age60Bucket,
      age90Bucket: rawTelemetry.financials.age90Bucket,
      over90Bucket: rawTelemetry.financials.over90Bucket,
      grossTotalDebt: rawTelemetry.financials.grossOutstandingDebt,
      advancePaymentsCredit: rawTelemetry.financials.advancePaymentsCredit,
      netOutstandingDebt: rawTelemetry.financials.netOutstandingDebt,
      attendancePunctuality: rawTelemetry.staff.punctualityRate,
      highestAcademicGapGrade: rawTelemetry.academics.highestAcademicGapGrade,
      highestAcademicGapValue: rawTelemetry.academics.highestAcademicGapValue,
      topPerformingSubject: rawTelemetry.academics.topPerformingSubject,
      topPerformingScore: rawTelemetry.academics.topPerformingScore,
    };
  }, [
    schoolProfile,
    profile,
    selectedCampus,
    financialSummary,
    unifiedMetrics,
    financials,
    resolvedAging,
    staff,
    todayTeacherAttendance,
    students,
    activeStudentsCount,
    todayPresentCount,
    attendanceRate,
    academicTidbits,
    atRiskStudentsList,
  ]);

  // Dynamic Student Attendance Resolution
  const totalActiveStudents = useMemo(() => {
    if (activeStudentsCount !== undefined && activeStudentsCount > 0) return activeStudentsCount;
    if (dashboardSummary?.studentCount?.active !== undefined && dashboardSummary.studentCount.active > 0) {
      return dashboardSummary.studentCount.active;
    }
    const fromRoster = students?.filter((s: any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus).length;
    return fromRoster || students?.length || 0;
  }, [activeStudentsCount, dashboardSummary?.studentCount?.active, students]);

  const studentsPresentCount = useMemo(() => {
    if (todayPresentCount !== undefined && todayPresentCount !== null) return todayPresentCount;
    if (dashboardSummary?.attendance?.totalPresent !== undefined) {
      return dashboardSummary.attendance.totalPresent;
    }
    if (attendanceRate !== undefined && totalActiveStudents > 0) {
      return Math.round((Number(attendanceRate) / 100) * totalActiveStudents);
    }
    return 0;
  }, [todayPresentCount, dashboardSummary?.attendance?.totalPresent, attendanceRate, totalActiveStudents]);

  const dynamicAttendancePct = useMemo(() => {
    if (totalActiveStudents > 0 && studentsPresentCount >= 0) {
      return ((studentsPresentCount / totalActiveStudents) * 100).toFixed(1);
    }
    if (attendanceRate !== undefined && attendanceRate !== null) {
      return Number(attendanceRate).toFixed(1);
    }
    return "0.0"; // no data yet (was an invented 96.4)
  }, [totalActiveStudents, studentsPresentCount, attendanceRate]);

  // Dynamic Class Register Compliance (Which classes took attendance today vs pending)
  const classRegisterStats = useMemo(() => {
    if (!classes || classes.length === 0) {
      return { total: 0, submittedCount: 0, pendingCount: 0, submittedClasses: [], pendingClasses: [], hasData: false };
    }

    const submittedIds = new Set<string>();
    
    if (Array.isArray(attendance)) {
      for (const r of attendance) {
        if (r.classId) submittedIds.add(r.classId);
      }
    }

    if (Array.isArray((dashboardSummary?.attendance as any)?.submittedClassIds)) {
      (dashboardSummary?.attendance as any).submittedClassIds.forEach((id: string) => submittedIds.add(id));
    }

    // Count active enrolled students per class from roster
    const activeRosterByClass = new Map<string, number>();
    if (Array.isArray(students) && students.length > 0) {
      students.forEach((s: any) => {
        if (s.enrollmentStatus === 'Active' || !s.enrollmentStatus) {
          if (s.classId) {
            activeRosterByClass.set(s.classId, (activeRosterByClass.get(s.classId) || 0) + 1);
          }
        }
      });
    }

    // A class only expects attendance if it has at least 1 active student enrolled
    const activeClassesWithStudents = classes.filter((c: any) => {
      if (activeRosterByClass.size === 0) return true;
      return (activeRosterByClass.get(c.id) || 0) > 0;
    });

    const submittedClasses = activeClassesWithStudents.filter((c: any) => submittedIds.has(c.id));
    const pendingClasses = activeClassesWithStudents.filter((c: any) => !submittedIds.has(c.id));

    return {
      total: activeClassesWithStudents.length,
      submittedCount: submittedClasses.length,
      pendingCount: pendingClasses.length,
      submittedClasses,
      pendingClasses,
      hasData: submittedClasses.length > 0
    };
  }, [classes, attendance, students, dashboardSummary?.attendance]);

  // Dynamic Student-to-Faculty Ratio Calculation
  const activeFacultyCount = staff?.length || dashboardSummary?.staff?.total || (dashboardSummary?.staff?.presentToday ? Number(dashboardSummary.staff.presentToday) : 0);
  const enrolledStudentCount = totalActiveStudents || dashboardSummary?.studentCount?.active || dashboardSummary?.studentCount?.total || students?.length || 0;
  const dynamicStudentTeacherRatio = (activeFacultyCount > 0 && enrolledStudentCount > 0)
    ? `${(enrolledStudentCount / activeFacultyCount).toFixed(1)}:1`
    : (studentTeacherRatio ? `${studentTeacherRatio}:1` : '—');

  const lessThan30Bucket = telemetry.lessThan30Bucket;
  const summaryOutstanding = Number(dashboardSummary?.financials?.totalOutstanding || unifiedMetrics?.grossReceivables || 0);
  const rawGrossTotalDebt = telemetry.grossTotalDebt;
  const grossTotalDebt = rawGrossTotalDebt > 0 ? rawGrossTotalDebt : summaryOutstanding;
  const advancePaymentsCredit = telemetry.advancePaymentsCredit;
  const netOutstandingDebt = rawGrossTotalDebt > 0 ? telemetry.netOutstandingDebt : Math.max(0, grossTotalDebt - (advancePaymentsCredit || 0));
  // When the aging figures were last rebuilt from every bill (nightly, or by the rebuild script).
  const agingAsOf = (() => {
    const t: any = (dashboardSummary as any)?.debtAging?.rebuiltAt;
    const ms = t?.toMillis?.() ?? (t?.seconds ? t.seconds * 1000 : 0);
    return ms ? new Date(ms).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
  })();

  const grossDebtForPct = grossTotalDebt > 0 ? grossTotalDebt : 1;
  // Same four tiers as Accounts > Student Billing > Debt Aging, from the same bills:
  // not yet due · 1–30 days overdue · 31–60 days · more than 60 days.
  // (The old tiers relabelled the "more than 60 days" bucket as "60 - 90 Days" and showed "> 90 Days" as 0.)
  const agingCounts: any = resolvedAging.accountCounts || null;
  const realCount = (n: any) => (agingCounts && agingCounts.__estimated !== true && typeof n === 'number' ? n : null);
  const agingData = [
    { range: 'Not yet due', amount: resolvedAging.current || 0, color: '#3b82f6', label: 'Not yet due', accountCount: realCount(agingCounts?.current) },
    { range: '1 - 30 Days', amount: resolvedAging.age30 || 0, color: '#f59e0b', label: '1 - 30 Days Overdue', accountCount: realCount(agingCounts?.age30) },
    { range: '31 - 60 Days', amount: resolvedAging.age60 || 0, color: '#f97316', label: '31 - 60 Days Overdue', accountCount: realCount(agingCounts?.age60) },
    { range: 'Over 60 Days', amount: (resolvedAging.age90 || 0) + (resolvedAging.over90 || 0), color: '#ef4444', label: 'More than 60 Days Overdue',
      accountCount: realCount(agingCounts?.age90) },
  ].map(t => ({ ...t, percentage: Math.round((t.amount / grossDebtForPct) * 100) }));

  // Inline Micro Sparkline SVG Component for KPI cards
  const Sparkline = ({ points, color = '#10b981' }: { points: number[]; color?: string }) => {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 60;
    const height = 16;

    const pathData = points
      .map((p, i) => {
        const x = (i / (points.length - 1)) * width;
        const y = height - ((p - min) / range) * (height - 4) - 2;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible inline-block">
        <path d={pathData} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  // Dynamic Macro Executive Academic & Governance Feed (Calculated directly from real database props)
  const macroAcademicConductFeed = useMemo(() => {
    // 1. Calculate Academic Outliers from reconciled atRiskStudentsList (<50% threshold)
    let outlierTitle = "Critical Academic Outliers";
    let outlierDesc = "";
    let outlierTag = "";
    let outlierColor = "bg-emerald-50 text-emerald-700 border-emerald-200";

    if (atRiskStudentsList.length > 0) {
      const studentNames = atRiskStudentsList.slice(0, 3).map((s: any) => s.name);
      const uniqueClasses = Array.from(new Set(atRiskStudentsList.map((s: any) => s.class).filter(Boolean)));
      const streamText = uniqueClasses.length === 1
        ? uniqueClasses[0]
        : uniqueClasses.length <= 3
          ? uniqueClasses.join(", ")
          : `${uniqueClasses.slice(0, 2).join(", ")} and ${uniqueClasses.length - 2} other streams`;

      outlierDesc = `${atRiskStudentsList.length} student account${atRiskStudentsList.length === 1 ? "" : "s"} across ${streamText} performing below 50% target benchmark (${studentNames.join(", ")}). Intervention plan assigned.`;
      outlierTag = `${atRiskStudentsList.length} Student${atRiskStudentsList.length === 1 ? "" : "s"} Pending Intervention`;
      outlierColor = "bg-rose-50 text-rose-700 border-rose-200";
    } else if (recentAssessments && recentAssessments.length > 0) {
      outlierDesc = `No pupil averages below 50% in the ${recentAssessments.length} marks loaded.`;
      outlierTag = `0 Academic Outliers`;
      outlierColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else {
      // Marks are not loaded on the overview (to save reads): say so instead of claiming "0 outliers".
      outlierDesc = `Not checked here — marks are not loaded on the overview. Open Academic Affairs to see pupils averaging below 50%.`;
      outlierTag = `Open Academic Affairs`;
      outlierColor = "bg-slate-50 text-slate-600 border-slate-200";
    }

    // 2. Class registers taken TODAY (real: from today's attendance records). This card used to show an
    //    invented "gradebook SLA" (e.g. 13/13) worked out from the number of marks loaded.
    const regTotal = classRegisterStats.total;
    const regDone = classRegisterStats.submittedCount;
    const slaPercentage = regTotal > 0 ? Math.round((regDone / regTotal) * 100) : 0;
    let slaDesc = "";
    let slaTag = regTotal > 0 ? `${regDone} of ${regTotal} registers today` : 'No classes';
    let slaColor = regTotal > 0 && slaPercentage >= 90 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200";
    if (regTotal > 0) {
      const pendingNames = (classRegisterStats.pendingClasses || []).map((c: any) => c.name).filter(Boolean);
      slaDesc = regDone === regTotal
        ? `Every class (${regTotal}) has taken today's register.`
        : `${regDone} of ${regTotal} classes have taken today's register.${pendingNames.length ? ` Still to submit: ${pendingNames.slice(0, 4).join(', ')}${pendingNames.length > 4 ? ` and ${pendingNames.length - 4} more` : ''}.` : ''}`;
    } else {
      slaDesc = `No classes with pupils found.`;
    }

    // 3. Calculate Safeguarding & Incident Audit from real behavioralRecords
    const infractions = (behavioralRecords || []).filter((r: any) => r.incidentType === 'Infraction' || r.severity === 'High');
    const positiveMerits = (behavioralRecords || []).filter((r: any) => r.incidentType === 'Positive Behavior' || r.type === 'Merit').length;

    let safetyDesc = "";
    let safetyTag = "";
    let safetyColor = "bg-emerald-50 text-emerald-700 border-emerald-200";

    if (infractions.length > 0) {
      safetyDesc = `${infractions.length} high-priority behavioral infraction${infractions.length === 1 ? '' : 's'} logged in school records. ${positiveMerits} positive commendations awarded this month.`;
      safetyTag = `Safeguarding: ${infractions.length} Active Incident${infractions.length === 1 ? '' : 's'}`;
      safetyColor = "bg-amber-50 text-amber-700 border-amber-200";
    } else if (behavioralRecords && behavioralRecords.length > 0) {
      safetyDesc = `0 critical safety breaches reported. ${positiveMerits} positive commendations awarded across all school divisions.`;
      safetyTag = `Safeguarding: 100% Clear`;
      safetyColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else if ((dashboardSummary as any)?.behavioral?.days) {
      // Records are not loaded on the overview; the server keeps per-day counts (0 extra reads).
      const since = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10);
      let inc = 0, pos = 0;
      Object.entries((dashboardSummary as any).behavioral.days as Record<string, any>).forEach(([d, v]) => {
        if (d >= since) { inc += Number(v?.inc) || 0; pos += Number(v?.pos) || 0; }
      });
      safetyDesc = `This week: ${inc} incident${inc === 1 ? '' : 's'} and ${pos} commendation${pos === 1 ? '' : 's'} recorded.`;
      safetyTag = inc > 0 ? `Safeguarding: ${inc} this week` : `Safeguarding: none this week`;
      safetyColor = inc > 0 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200";
    } else {
      safetyDesc = `Not loaded here. Open the Behaviour tab to review incidents.`;
      safetyTag = `Open Behaviour`;
      safetyColor = "bg-slate-50 text-slate-600 border-slate-200";
    }

    return [
      {
        id: 'outlier-1',
        type: 'academic_outlier',
        title: outlierTitle,
        desc: outlierDesc,
        tag: outlierTag,
        color: outlierColor,
        actionLabel: 'View Intervention Plan',
        time: 'Active Outlier'
      },
      {
        id: 'sla-1',
        type: 'department_sla',
        title: 'Class Registers Today',
        desc: slaDesc,
        tag: slaTag,
        color: slaColor,
        actionLabel: 'View Registers',
        time: 'Today'
      },
      {
        id: 'safeguarding-1',
        type: 'safeguarding',
        title: 'Critical Safeguarding & Incident Audit',
        desc: safetyDesc,
        tag: safetyTag,
        color: safetyColor,
        actionLabel: 'View Safety Audit',
        time: 'Safety Audit'
      }
    ];
  }, [recentAssessments, students, classes, behavioralRecords, classRegisterStats, dashboardSummary]);

  // Command Bar State
  const [commandSuccess, setCommandSuccess] = useState<string | null>(null);
  const [announcementText, setAnnouncementText] = useState('');
  const [isSendingAnnouncement, setIsSendingAnnouncement] = useState(false);
  const [showDebtDetailsToggle, setShowDebtDetailsToggle] = useState<'net' | 'gross'>('net');

  // Assistant state. The credit figure is the school's real balance (passed in from the school record).
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isAiDrawerPinned, setIsAiDrawerPinned] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [creditsSpentHere, setCreditsSpentHere] = useState(0);
  const aiCredits = Math.max(0, (Number(aiCreditBalance) || 0) - creditsSpentHere);
  const [isAiAuditing, setIsAiAuditing] = useState(false);

  // Dynamic AI Auditor Initial Greeting (Synchronized with Unified Telemetry)
  const initialAiGreeting = useMemo(() => {
    const revK = (telemetry.financials.totalRevenue / 1000).toFixed(1);
    const pendingStaff = telemetry.staff.pendingCheckins;
    const rate = telemetry.financials.collectionRate;
    const school = telemetry.schoolName || "Our School";
    return `Good day Director. I have audited ${school}’s active records today. Fee collection stands at GH₵ ${revK}k (${rate}%), academic performance is at ${telemetry.academics.avgScore}% (${telemetry.academics.atRiskCount} at-risk students flagged), and ${pendingStaff} staff check-ins are currently pending. How can I assist your executive overview?`;
  }, [telemetry]);

  const [aiChatHistory, setAiChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);

  // Keep the initial greeting synchronized with live telemetry whenever the chat is fresh
  React.useEffect(() => {
    setAiChatHistory(prev => {
      if (prev.length === 0 || (prev.length === 1 && prev[0].role === 'assistant')) {
        return [{ role: 'assistant', text: initialAiGreeting }];
      }
      return prev;
    });
  }, [initialAiGreeting]);

  // Enrollment Dynamics: built from the students' own admission/creation dates (end-of-month head count for
  // the last six months). Students without a date are counted from the start. No invented targets.
  const enrollmentData = useMemo(() => {
    const list: any[] = Array.isArray(students) ? students : [];
    const toMs = (v: any): number => {
      if (!v) return 0;
      if (typeof v?.toMillis === 'function') return v.toMillis();
      if (typeof v?.seconds === 'number') return v.seconds * 1000;
      const t = new Date(v).getTime();
      return isNaN(t) ? 0 : t;
    };
    const dates = list.map(st => toMs(st?.admissionDate || st?.dateOfAdmission || st?.enrollmentDate || st?.createdAt));
    const now = new Date();
    const rows: { month: string; enrolled: number }[] = [];
    for (let k = 5; k >= 0; k--) {
      const end = new Date(now.getFullYear(), now.getMonth() - k + 1, 1).getTime();
      const label = new Date(now.getFullYear(), now.getMonth() - k, 1).toLocaleString('en-GB', { month: 'short' });
      rows.push({ month: label, enrolled: dates.filter(d => d === 0 || d < end).length });
    }
    if (rows.length && enrolledStudentCount && rows[rows.length - 1].enrolled === 0) rows[rows.length - 1].enrolled = Number(enrolledStudentCount) || 0;
    return rows;
  }, [students, enrolledStudentCount]);

  // Quick Action Handlers
  // Quick actions open the page where the message is actually sent. (They used to show "sent" messages
  // without sending anything.)
  const handleSendStaffReminders = () => {
    setActiveDrawer(null);
    toast({ title: 'Opening SMS', description: `Choose the ${telemetry.pendingStaffCheckins} staff members who have not checked in and send the reminder.` });
    router.push('/dashboard/communication/sms');
  };

  const handleIssueArrearsNotice = () => {
    setActiveDrawer(null);
    toast({ title: 'Opening SMS', description: `Select the parents with overdue balances (${telemetry.highArrearsCount} accounts) and send the reminder.` });
    router.push('/dashboard/communication/sms');
  };

  const handleReorderStock = () => {
    setActiveDrawer(null);
    toast({ title: 'Opening Inventory', description: 'Restock the low items from the inventory page.' });
    router.push('/dashboard/inventory');
  };

  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    try { sessionStorage.setItem('gam_announcement_draft', announcementText.trim()); } catch { /* ignore */ }
    try { navigator.clipboard?.writeText(announcementText.trim()); } catch { /* ignore */ }
    setAnnouncementText('');
    toast({ title: 'Opening Announcements', description: 'Your text is copied — paste it and publish it to staff and parents.' });
    router.push('/dashboard/announcements');
  };

  const handleOpenDraftTemplate = (type: 'arrears' | 'staff' | 'academic') => {
    if (type === 'arrears') {
      setAiDraftTemplate({
        title: "Executive Fee Arrears Collection Notice",
        recipient: `All Parents with Arrears > 60 Days (${telemetry.highArrearsCount} Accounts)`,
        subject: "URGENT: GAM Edu Tuition Fee Balance Settlement Notice",
        body: `Dear Parent/Guardian,\n\nOur financial records indicate an outstanding tuition balance of GH₵ ${Math.round(telemetry.highArrearsOverdueSum).toLocaleString()} across overdue student accounts. We kindly request that you settle all overdue tuition fees on or before Friday to prevent academic portal restriction.\n\nPayments can be made securely via the GAM Edu Parent Portal or Mobile Money Gateway.\n\nThank you for your prompt cooperation.\n\nExecutive Director's Office\n${telemetry.schoolName || ''}`
      });
    } else if (type === 'staff') {
      setAiDraftTemplate({
        title: "Executive Staff Punctuality & Check-in Memo",
        recipient: "All Faculty & Academic Staff Members",
        subject: "MEMORANDUM: Morning Assembly Check-In Protocol Compliance",
        body: "Dear Faculty Members,\n\nThis is a friendly reminder to record your morning assembly biometric/mobile check-in prior to 07:45 AM daily. Unverified check-ins affect our daily attendance audit pulse.\n\nPlease ensure your attendance is logged promptly.\n\nOffice of the Executive Director"
      });
    } else {
      setAiDraftTemplate({
        title: "Academic Excellence Commendation Letter",
        recipient: telemetry.topPerformingSubject ? `${telemetry.topPerformingSubject} Teachers` : "[Department] Teachers",
        subject: "COMMENDATION: Outstanding Academic Achievement",
        body: `Dear ${telemetry.topPerformingSubject || '[Department]'} Team,\n\nWe congratulate you on achieving ${telemetry.topPerformingScore ? `an average score of ${telemetry.topPerformingScore}%` : 'excellent results'} in the recent assessments.\n\nYour dedication to academic excellence sets a benchmark for the entire institution.\n\nWarm regards,\nExecutive Director`
      });
    }
  };

  const handleAiAuditQuery = async (queryText?: string) => {
    const textToQuery = queryText || aiPrompt;
    if (!textToQuery.trim() || isAiAuditing) return;

    setAiChatHistory(prev => [...prev, { role: 'user', text: textToQuery }]);
    setAiPrompt('');
    setIsAiAuditing(true);

    // Quick summary built from the school's live records on this page (used when the AI is unavailable).
    const instantSummary = (): string => {

      const queryLower = textToQuery.toLowerCase();
      let reply = "";

      if (queryLower.includes('academic') || queryLower.includes('gap') || queryLower.includes('grade') || queryLower.includes('score')) {
        reply = `Academic Audit Analysis: ${telemetry.highestAcademicGapGrade} currently has the highest academic gap at ${telemetry.highestAcademicGapValue} below the 92% benchmark. ${telemetry.topPerformingSubject} leads with a ${telemetry.topPerformingScore}% average score.`;
      } else if (queryLower.includes('notice') || queryLower.includes('draft') || queryLower.includes('arrears') || queryLower.includes('remind')) {
        reply = `I have drafted an official executive fee collection notice for ${telemetry.highArrearsCount} parent accounts with overdue balances > 60 days (GH₵ ${Math.round(telemetry.highArrearsOverdueSum / 1000)}k total). You can open and edit the template directly below for instant WhatsApp/SMS dispatch.`;
        handleOpenDraftTemplate('arrears');
      } else if (queryLower.includes('cash flow') || queryLower.includes('financial') || queryLower.includes('revenue') || queryLower.includes('inflow')) {
        reply = `Financial collection rate currently stands at ${telemetry.financials.collectionRate}%. Total collected revenue this term is GH₵ ${Math.round(telemetry.financials.totalRevenue).toLocaleString()} against a billed target of GH₵ ${Math.round(telemetry.financials.totalBilled).toLocaleString()}.`;
      } else if (queryLower.includes('staff') || queryLower.includes('attendance') || queryLower.includes('check-in') || queryLower.includes('punctuality')) {
        reply = `Faculty attendance analysis: Punctuality rate is at ${telemetry.attendancePunctuality}% over the last 30 days. Today ${telemetry.pendingStaffCheckins} staff check-ins are pending morning assembly verification.`;
      } else if (queryLower.includes('enrollment') || queryLower.includes('student')) {
        reply = `Enrollment: ${students.length} students across ${classes.length} classes, with a student-to-teacher ratio of ${dynamicStudentTeacherRatio}.`;
      } else {
        reply = `From today's records: fee collection is at ${telemetry.financials.collectionRate}%, ${telemetry.highArrearsCount} parent accounts are more than 60 days overdue, and ${telemetry.pendingStaffCheckins} staff check-ins are pending. Ask about academics, fees, staff attendance or enrolment for details.`;
      }

      return reply;
    };

    // Drafting a notice or memo opens the editable template straight away (free, no AI needed).
    const lower = textToQuery.toLowerCase();
    if (/\b(draft|notice|memo|letter)\b/.test(lower)) {
      const kind: 'arrears' | 'staff' | 'academic' =
        /staff|punctual|check-in|memo/.test(lower) ? 'staff' : /commend|academic|subject|teacher/.test(lower) ? 'academic' : 'arrears';
      handleOpenDraftTemplate(kind);
      setIsAiAuditing(false);
      setAiChatHistory(prev => [...prev, { role: 'assistant', text: 'I have opened the template with your school\'s figures filled in. Edit it, then copy it to the SMS page to send.' }]);
      return;
    }

    // The real AI answer (1 credit). Falls back to the quick summary, clearly labelled, if it cannot run.
    const schoolIdForAi = profile?.schoolId || schoolProfile?.id || schoolProfile?.schoolId || '';
    let reply = '';
    try {
      const snapshot = {
        studentsOnRoll: enrolledStudentCount,
        classes: Array.isArray(classes) ? classes.length : 0,
        staff: activeFacultyCount,
        studentTeacherRatio: dynamicStudentTeacherRatio,
        financials: showFinancials ? {
          collectedThisTerm: Math.round(Number(telemetry.financials?.totalRevenue) || 0),
          billedThisTerm: Math.round(Number(telemetry.financials?.totalBilled) || 0),
          collectionRatePercent: telemetry.financials?.collectionRate,
          accountsOver60DaysOverdue: telemetry.highArrearsCount,
          amountOver60DaysOverdue: Math.round(Number(telemetry.highArrearsOverdueSum) || 0),
        } : 'not available to this user',
        academics: {
          averageScorePercent: telemetry.academics?.avgScore,
          studentsAtRisk: telemetry.academics?.atRiskCount,
          topSubject: telemetry.topPerformingSubject,
          topSubjectScore: telemetry.topPerformingScore,
          classWithLargestGap: telemetry.highestAcademicGapGrade,
        },
        staffAttendance: { pendingCheckInsToday: telemetry.pendingStaffCheckins, punctualityPercent30Days: telemetry.attendancePunctuality },
      };
      const res: any = schoolIdForAi
        ? await answerExecutiveQuestionAction(schoolIdForAi, telemetry.schoolName || '', textToQuery, snapshot)
        : { success: false, error: 'School not found.' };
      if (res?.success && res.text) {
        reply = res.text;
        setCreditsSpentHere(n => n + 1);
      } else {
        reply = `${instantSummary()}\n\n(Quick summary from today's records — the AI could not answer: ${res?.error || 'unavailable'}.)`;
      }
    } catch {
      reply = `${instantSummary()}\n\n(Quick summary from today's records — the AI is unavailable right now.)`;
    }
    setIsAiAuditing(false);
    setAiChatHistory(prev => [...prev, { role: 'assistant', text: reply }]);
  };

  const handleAgingClick = (range: string) => {
    setSelectedAgingCategory(range);
    setActiveDrawer('arrears');
    // Clicking a tier only filters; it no longer downloads the whole ledger (that is in Student Billing).
  };

  return (
    <div className={cn("space-y-4 mt-6 pb-6 transition-[margin] duration-300 ease-in-out", isAiDrawerOpen && isAiDrawerPinned ? "xl:mr-[480px] 2xl:mr-[500px]" : "")}>
      
      {/* Bill changes made by staff, recorded by the server, for the Director to review (1 read). */}
      {isDirectorOrSuper && (
        <FeeChangeReviewPanel schoolId={profile?.schoolId || schoolProfile?.id || schoolProfile?.schoolId} mode="director" />
      )}
      {/* Active pupils with no school-fee bill this term (Director; ~3 reads). */}
      {isDirectorOrSuper && (
        <UnbilledStudentsPanel schoolId={profile?.schoolId || schoolProfile?.id || schoolProfile?.schoolId} />
      )}

      {/* ─────────────────────────────────────────────────────────────
          ZONE 1: EXECUTIVE ALERT DESK (High-Density Action Center & Ribbon)
          ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
              Action Center
            </h3>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-100">
              {[telemetry.pendingStaffCheckins > 0, showFinancials && (Number(telemetry.highArrearsOverdueSum) || 0) > 0].filter(Boolean).length} Urgent
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Executive AI Auditor Drawer Trigger */}
            <Button
              size="sm"
              onClick={() => setIsAiDrawerOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl h-8 px-3 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <BrainCircuit className="h-3.5 w-3.5 text-indigo-400" />
              <span>AI Auditor</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {aiCredits}
              </span>
            </Button>

            {/* Compact Header Broadcast Announcement Button */}
            <Button
              size="sm"
              onClick={() => setActiveActionModal('announcement_modal')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl h-8 px-3"
            >
              <Megaphone className="h-3.5 w-3.5 mr-1.5" />
              Broadcast
            </Button>
          </div>
        </div>

        {/* Enterprise Alert Ribbon (High-Density Urgent Action List) */}
        <div className="divide-y divide-slate-100">
          
          {/* Alert 1: Staff Attendance (Critical Severity) */}
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 bg-rose-50 text-rose-700">
                Staff Attendance
              </span>
              <p className="text-xs text-slate-700 font-medium truncate">
                {telemetry.pendingStaffCheckins} faculty check-ins pending assembly verification
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <span>Send Reminder</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white rounded-xl border border-slate-200 shadow-xl p-1 text-xs z-50">
                <DropdownMenuItem 
                  onClick={() => {
                    handleSendStaffReminders();
                    setActiveActionModal(null);
                  }}
                  className="font-medium text-slate-700 hover:bg-slate-50 rounded-lg p-2 cursor-pointer flex items-center gap-2"
                >
                  <Send className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>Send SMS to All Unchecked Staff ({telemetry.pendingStaffCheckins})</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    handleSendStaffReminders();
                    setActiveActionModal(null);
                  }}
                  className="font-medium text-slate-700 hover:bg-slate-50 rounded-lg p-2 cursor-pointer flex items-center gap-2"
                >
                  <UserCheck className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  <span>Target Class Lead Teachers Only</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    handleSendStaffReminders();
                  }}
                  className="font-medium text-rose-600 hover:bg-rose-50 rounded-lg p-2 cursor-pointer flex items-center gap-2"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <span>Escalate to Vice Principal</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Alert 2: Arrears older than 60 days — ALL fee types (it is the "Over 60 Days" aging tier; it was
              labelled "Tuition Arrears", which made it look like it should equal Student Billing's Tuition Debt). */}
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 bg-amber-50 text-amber-700">
                Arrears &gt;60 Days
              </span>
              <p className="text-xs text-slate-700 font-medium truncate">
                GH₵ {Math.round(overdue60PlusSum).toLocaleString()} owed for over 60 days (all fees){overdue60PlusCount !== null ? ` by ${overdue60PlusCount} students` : ''}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <span>Dispatch Notices</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white rounded-xl border border-slate-200 shadow-xl p-1 text-xs z-50">
                <DropdownMenuItem 
                  onClick={() => setActiveActionModal('arrears_action')}
                  className="font-medium text-slate-700 hover:bg-slate-50 rounded-lg p-2 cursor-pointer flex items-center gap-2"
                >
                  <Send className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  <span>Dispatch All Notices{overdue60PlusCount !== null ? ` (${overdue60PlusCount} students)` : ''}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    handleAgingClick('Over 60 Days');
                    setActiveActionModal('arrears_action');
                  }}
                  className="font-medium text-red-600 hover:bg-red-50 rounded-lg p-2 cursor-pointer flex items-center gap-2"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-red-600 shrink-0" />
                  <span>Target Most Overdue Only (&gt;60 days)</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    handleIssueArrearsNotice();
                    setActiveActionModal(null);
                  }}
                  className="font-medium text-slate-700 hover:bg-slate-50 rounded-lg p-2 cursor-pointer flex items-center gap-2"
                >
                  <Megaphone className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>Send SMS Reminder First</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </div>

        {/* Operational Health Ticker Sub-bar (Non-urgent Operational Statuses) */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs bg-slate-50/80 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3 sm:px-5 rounded-b-2xl">
          <div className="flex items-center gap-2 min-w-0">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold shrink-0">
              Operational Health
            </Badge>
            <span className="text-slate-600 font-medium truncate">
              Pantry & Stores: open the audit to see current stock levels
            </span>
          </div>
          <button 
            onClick={() => setActiveActionModal('pantry_action')}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 underline shrink-0 cursor-pointer"
          >
            View Audit
          </button>
        </div>
      </div>

      {/* ─── SLIDE-OVER ACTION DRAWERS ─── */}
      {activeDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end transition-opacity">
          <div className="w-full max-w-md bg-white min-h-full shadow-2xl border-l border-slate-200 p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  {activeDrawer === 'staff' && <UserCheck className="h-5 w-5 text-amber-600" />}
                  {activeDrawer === 'arrears' && <Banknote className="h-5 w-5 text-red-600" />}
                  {activeDrawer === 'pantry' && <AlertTriangle className="h-5 w-5 text-orange-600" />}
                  <h3 className="font-bold text-slate-900 text-lg">
                    {activeDrawer === 'staff' && 'Pending Staff Check-ins'}
                    {activeDrawer === 'arrears' && (selectedAgingCategory ? `Arrears (${selectedAgingCategory})` : 'Combined High Arrears (>60 Days)')}
                    {activeDrawer === 'pantry' && 'Low Canteen Inventory'}
                  </h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { setActiveDrawer(null); setSelectedAgingCategory(null); }} className="rounded-full h-8 w-8">
                  <X className="h-4 w-4 text-slate-500" />
                </Button>
              </div>

              {/* Drawer Content Views */}
              {activeDrawer === 'staff' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The following {telemetry.pendingStaffCheckins} staff members have not completed morning attendance inspection check-in:
                  </p>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {todayTeacherAttendance.absent && todayTeacherAttendance.absent.length > 0 ? (
                      todayTeacherAttendance.absent.map((s: any, idx: number) => (
                        <div key={s.id || idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{s.name}</p>
                            <p className="text-[10px] text-slate-500">{s.email || s.role || 'Staff Member'}</p>
                          </div>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                            Not Checked In
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500 font-bold bg-slate-50 rounded-xl">
                        All active staff members are present and checked in today.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeDrawer === 'arrears' && (
                <div className="space-y-4">
                  {/* On-Demand Financial Ledger Controls */}
                  {financialsMode === 'on-demand' && (!financialRecords || financialRecords.length === 0) ? (
                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-3">
                      <div className="flex items-start gap-2.5">
                        <Zap className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-amber-900">Arrears Records On-Demand</p>
                          <p className="text-[11px] text-amber-800/90 leading-relaxed mt-0.5">
                            Detailed student balances and aging rosters are paused to keep the director overview loading instantly. Real-time daily cash collections remain active.
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); onLoadFinancials?.(); }}
                        disabled={isLoadingFinancials}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl h-9 gap-1.5 shadow-sm cursor-pointer"
                      >
                        {isLoadingFinancials ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>Loading School Records...</span>
                          </>
                        ) : (
                          <>
                            <Banknote className="h-3.5 w-3.5" />
                            <span>Open Student Billing (full ledger)</span>
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    financialsMode === 'full' && (
                      <div className="flex items-center justify-between p-2.5 bg-indigo-50/70 border border-indigo-200/70 rounded-xl text-xs">
                        <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                          Full Ledger Active ({financialRecords?.length || 0} records)
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => { e.stopPropagation(); onSwitchOnDemand?.(); }} 
                          className="h-6 px-2 text-[10px] text-indigo-800 hover:bg-indigo-100 font-bold cursor-pointer"
                        >
                          ⚡ Switch to On-Demand
                        </Button>
                      </div>
                    )
                  )}

                  {selectedAgingCategory && (
                    <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs">
                      <span className="font-bold text-amber-900">Filtered Tier: {selectedAgingCategory}</span>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedAgingCategory(null)} className="h-6 px-2 text-[10px] text-amber-800 hover:bg-amber-100 font-bold cursor-pointer">
                        Reset Filter
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedAgingCategory ? `Displaying student accounts in aging category ${selectedAgingCategory}:` : 'Total combined unpaid fees (tuition, transport, canteen, PTA & auxiliaries) exceeding 60 days overdue stands at '}{' '}
                    {!selectedAgingCategory && (
                      <span className="font-bold text-red-600">
                        GH₵ {Math.round(totalHighArrearsSum || (debtAgingStats.age60 || 0) + (debtAgingStats.age90 || 0) || dashboardSummary?.financials?.totalOutstanding || 0).toLocaleString()}
                      </span>
                    )}{' '}
                    across {displayedArrearsList.length} student account{displayedArrearsList.length === 1 ? '' : 's'}.
                  </p>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {displayedArrearsList && displayedArrearsList.length > 0 ? (
                      displayedArrearsList.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{item.studentName}</p>
                            <p className="text-[10px] text-slate-500">{item.className || "Class Stream"} • {item.daysOverdue ?? item.maxDaysOverdue ?? 0} Days Overdue{item.invoiceCount > 1 ? ` (${item.invoiceCount} invoices)` : ""}</p>
                          </div>
                          <span className="font-bold text-red-600">GH₵ {Math.round(item.amount).toLocaleString()}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500 font-bold bg-slate-50 rounded-xl">
                        {financialsMode === 'on-demand' ? 'Open Student Billing to see each student\'s account.' : `No active student fee arrears matching ${selectedAgingCategory || '60 days overdue'} in school records.`}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeDrawer === 'pantry' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Kitchen pantry stock monitoring status:
                  </p>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    <div className="p-4 text-center text-xs text-slate-500 font-bold bg-slate-50 rounded-xl">
                      Pantry inventory records operating within normal limits.
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-100 space-y-2">
              {activeDrawer === 'staff' && (
                <Button onClick={handleSendStaffReminders} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs py-2.5">
                  <Send className="h-4 w-4 mr-2" /> Send Check-in Reminder SMS
                </Button>
              )}
              {activeDrawer === 'arrears' && (
                <Button onClick={handleIssueArrearsNotice} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs py-2.5">
                  <Send className="h-4 w-4 mr-2" /> Issue Combined Fee Arrears Reminders
                </Button>
              )}
              {activeDrawer === 'pantry' && (
                <Button onClick={handleReorderStock} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl text-xs py-2.5">
                  <RefreshCw className="h-4 w-4 mr-2" /> Generate Requisition Order
                </Button>
              )}
              <Button variant="ghost" onClick={() => { setActiveDrawer(null); setSelectedAgingCategory(null); }} className="w-full text-slate-500 text-xs">
                Close Drawer
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* ─── COLLAPSIBLE EXECUTIVE AI DRAWER (Persistent Dock & Split View Support) ─── */}
      <ExecutiveAIAuditorDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        isPinned={isAiDrawerPinned}
        onTogglePin={() => setIsAiDrawerPinned(prev => !prev)}
        aiCredits={aiCredits}
        aiChatHistory={aiChatHistory}
        isAiAuditing={isAiAuditing}
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        onSendQuery={handleAiAuditQuery}
        onOpenDraftTemplate={handleOpenDraftTemplate}
        telemetry={telemetry}
      />
      {/* ─────────────────────────────────────────────────────────────
          ZONE 2: TIER 1 HERO METRIC BAR (5 Core Vital Signs)
          ───────────────────────────────────────────────────────────── */}
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3", showFinancials ? "lg:grid-cols-5" : "lg:grid-cols-3")}>
        
        {showFinancials && (
          <>
            {/* Metric 1: Financial Collection Rate */}
            <Card 
              onClick={() => setActiveHeroModal('financial')}
              className="h-full flex flex-col justify-between hover:shadow-md transition-all cursor-pointer border border-slate-200/80 hover:border-slate-300 rounded-2xl bg-white shadow-sm overflow-hidden relative group"
            >
              <CardContent className="p-4 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Collection Rate</span>
                    {financialsMode === 'on-demand' ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60">
                        ⚡ On-Demand
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        📊 Full Ledger
                      </span>
                    )}
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-100 text-slate-700 group-hover:scale-105 transition-transform">
                    <Banknote className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="text-2xl font-bold text-slate-900">{financialSummary.collectionRate}%</h3>
                    <Sparkline points={[68, 70, 71, 72, financialSummary.collectionRate]} color="#10b981" />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-emerald-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-0.5" /> Collection Target Status
                    </span>
                  </div>
                  <div className="border-t border-slate-100 pt-1.5 space-y-0.5 text-[10px]">
                    <div className="flex items-center justify-between font-medium text-slate-600">
                      <span>Billed Target:</span>
                      <span className="font-semibold text-slate-800">GH₵ {Math.round(financialSummary.totalBilled).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between font-medium text-slate-600">
                      <span>Collected Revenue:</span>
                      <span className="font-semibold text-emerald-700">GH₵ {Math.round(financialSummary.totalRevenue).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metric 2: Daily Cash Collections */}
            <Card 
              onClick={() => setActiveHeroModal('financial')}
              className="h-full flex flex-col justify-between hover:shadow-md transition-all cursor-pointer border border-slate-200/80 hover:border-slate-300 rounded-2xl bg-white shadow-sm overflow-hidden relative group"
            >
              <CardContent className="p-4 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Collected Today</span>
                    <span className={cn(
                      "flex h-2 w-2 rounded-full",
                      todayCashCollected.total > 0 ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                    )} />
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-md border",
                      todayCashCollected.total > 0 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                        : "bg-amber-50 text-amber-700 border-amber-200/60"
                    )}>
                      {todayCashCollected.total > 0 ? "Live Register" : "Session Open"}
                    </span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-100 text-slate-700 group-hover:scale-105 transition-transform">
                    <Banknote className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className={cn(
                      "text-xl font-bold truncate",
                      todayCashCollected.total > 0 ? "text-slate-900" : "text-slate-700"
                    )}>
                      GH₵ {todayCashCollected.total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </h3>
                    <Sparkline 
                      points={todayCashCollected.total > 0 
                        ? [Math.round(todayCashCollected.total * 0.25), Math.round(todayCashCollected.total * 0.5), Math.round(todayCashCollected.total * 0.8), todayCashCollected.total] 
                        : [0, 0, 0, 0, 0]
                      } 
                      color={todayCashCollected.total > 0 ? "#059669" : "#94a3b8"} 
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    {todayCashCollected.total > 0 ? (
                      <span className="font-semibold text-emerald-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-0.5" /> Live Collections Active
                      </span>
                    ) : (
                      <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                        <span>New Day Session Open</span>
                      </span>
                    )}
                  </div>
                  <div className="border-t border-slate-100 pt-1.5 text-[10px] font-medium leading-snug">
                    {todayCashCollected.total > 0 ? (
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Logged Receipts Today:</span>
                        <span className="font-semibold text-slate-800">
                          {todayCashCollected.count > 0
                            ? `${todayCashCollected.count} transaction${todayCashCollected.count === 1 ? '' : 's'}`
                            : 'Syncing…'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Today's Cashier Status:</span>
                        <span className="font-semibold text-slate-700">Awaiting first receipt</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Metric 3: Academic Health Index */}
        <Card 
          onClick={() => setActiveHeroModal('academic')}
          className="h-full flex flex-col justify-between hover:shadow-md transition-all cursor-pointer border border-slate-200/80 hover:border-slate-300 rounded-2xl bg-white shadow-sm overflow-hidden relative group"
        >
          <CardContent className="p-4 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Academic Health</span>
              <div className="p-1.5 rounded-xl bg-slate-100 text-slate-700 group-hover:scale-105 transition-transform">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-baseline justify-between gap-1">
                <h3 className="text-2xl font-bold text-slate-900">{academicTidbits.avgScore ? `${academicTidbits.avgScore}%` : '—'}</h3>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-indigo-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" /> {academicTidbits.syncedAt ? `Marks as of ${new Date(academicTidbits.syncedAt).toLocaleDateString()}` : 'From recent assessments'}
                </span>
                {academicTidbits.avgScore ? (
                  <Badge variant="outline" className="text-[9px] bg-slate-50 text-slate-700 border-slate-200 font-semibold px-1.5 py-0">
                    Gap: {Math.round(Number(academicTidbits.avgScore) - 92)}%
                  </Badge>
                ) : null}
              </div>
              <div className="border-t border-slate-100 pt-1.5 space-y-0.5 text-[10px]">
                <div className="flex items-center justify-between font-medium text-slate-600">
                  <span>Target:</span>
                  <span className="font-semibold text-slate-800">92% average</span>
                </div>
                <div className="flex items-center justify-between font-medium text-slate-600">
                  <span>Lead Subject:</span>
                  <span className="font-semibold text-indigo-700">{(() => {
                    const subj = telemetry.topPerformingSubject || academicTidbits.topSubject;
                    const sc = Number(telemetry.topPerformingScore) || Number(academicTidbits.topSubjectScore) || 0;
                    return subj && sc > 0 ? `${subj} (${sc}%)` : (subj || '—');
                  })()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Attendance Pulse */}
        <Card 
          onClick={() => setActiveHeroModal('attendance')}
          className="h-full flex flex-col justify-between hover:shadow-md transition-all cursor-pointer border border-slate-200/80 hover:border-slate-300 rounded-2xl bg-white shadow-sm overflow-hidden relative group"
        >
          <CardContent className="p-4 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Attendance & Staff</span>
              <div className="p-1.5 rounded-xl bg-slate-100 text-slate-700 group-hover:scale-105 transition-transform">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-baseline justify-between gap-1">
                <div className="flex items-baseline gap-1.5">
                  <h3 className="text-2xl font-bold text-slate-900">{dynamicAttendancePct}%</h3>
                  <span className="text-[10px] font-semibold text-slate-500">Student Pulse</span>
                </div>

              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700 flex items-center">
                  <Users className="h-3 w-3 mr-1 text-slate-500" />
                  <span className="text-emerald-700 font-bold mr-1">{studentsPresentCount}</span> / {totalActiveStudents} Present
                </span>
                <Badge variant="outline" className="text-[9px] bg-slate-50 text-slate-700 border-slate-200 font-semibold px-1.5 py-0">
                  Daily Verification
                </Badge>
              </div>
              <div className="border-t border-slate-100 pt-1.5 space-y-0.5 text-[10px]">
                <div className="flex items-center justify-between font-medium text-slate-600">
                  <span>Student Attendance:</span>
                  <span className="font-bold text-slate-800">{studentsPresentCount} of {totalActiveStudents} Active Students</span>
                </div>
                <div className="flex items-center justify-between font-medium text-slate-600">
                  <span>Class Registers:</span>
                  {classRegisterStats.hasData ? (
                    <span className={`font-bold flex items-center gap-1.5 ${classRegisterStats.pendingCount > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      <span>{classRegisterStats.submittedCount} of {classRegisterStats.total} Submitted</span>
                      {classRegisterStats.pendingCount > 0 && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                          {classRegisterStats.pendingCount} Pending
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-800">{classes?.length || 14} Active Classes</span>
                  )}
                </div>
                <div className="flex items-center justify-between font-medium text-slate-600">
                  <span>Staff Verification:</span>
                  <span className="font-semibold text-amber-700">{telemetry.pendingStaffCheckins} Members Pending</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metric 5: Faculty Ratio & Safety */}
        <Card 
          onClick={() => setActiveHeroModal('faculty')}
          className="h-full flex flex-col justify-between hover:shadow-md transition-all cursor-pointer border border-slate-200/80 hover:border-slate-300 rounded-2xl bg-white shadow-sm overflow-hidden relative group"
        >
          <CardContent className="p-4 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty & Safety</span>
              <div className="p-1.5 rounded-xl bg-slate-100 text-slate-700 group-hover:scale-105 transition-transform">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-baseline justify-between gap-1">
                <h3 className="text-2xl font-bold text-slate-900">{dynamicStudentTeacherRatio}</h3>
                <Sparkline points={[24, 24, 24, 24, 24]} color="#0284c7" />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700 flex items-center">
                  100% Compliant Ratio
                </span>
                <Badge variant="outline" className="text-[9px] bg-slate-50 text-slate-700 border-slate-200 font-semibold px-1.5 py-0">
                  0 Alerts
                </Badge>
              </div>
              <div className="border-t border-slate-100 pt-1.5 space-y-0.5 text-[10px]">
                <div className="flex items-center justify-between font-medium text-slate-600">
                  <span>Active Faculty:</span>
                  <span className="font-semibold text-slate-800">{activeFacultyCount} Staff Members</span>
                </div>
                <div className="flex items-center justify-between font-medium text-slate-600">
                  <span>Enrolled Roster:</span>
                  <span className="font-semibold text-slate-800">{enrolledStudentCount} Students</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ─── TIER 1 HERO MODALS (Full Drill-down Popups) ─── */}
      {activeHeroModal && (
        <Dialog open={!!activeHeroModal} onOpenChange={() => setActiveHeroModal(null)}>
          <DialogContent className="max-w-md bg-white rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {activeHeroModal === 'financial' && showFinancials && 'Financial Health & Collections Detail'}
                {activeHeroModal === 'academic' && 'Academic Performance Index (API) Breakdown'}
                {activeHeroModal === 'attendance' && 'Daily Attendance Submissions Inspection'}
                {activeHeroModal === 'faculty' && 'Faculty & Student Operations Ratio'}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Executive summary and key operational indicators
              </DialogDescription>
            </DialogHeader>

            <div className="pt-4 space-y-4">
              {activeHeroModal === 'financial' && showFinancials && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-500">Total Billed</p>
                      <p className="font-black text-sm text-slate-800">GH₵ {Math.round(financialSummary.totalBilled || unifiedMetrics.totalBilled).toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl">
                      <p className="text-[10px] text-emerald-700">Collected</p>
                      <p className="font-black text-sm text-emerald-700">GH₵ {Math.round(financialSummary.totalRevenue || unifiedMetrics.totalRevenue).toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-xl">
                      <p className="text-[10px] text-red-700">Total Arrears</p>
                      <p className="font-black text-sm text-red-700">GH₵ {Math.round((financialSummary.totalBilled - financialSummary.totalRevenue > 0 ? financialSummary.totalBilled - financialSummary.totalRevenue : (dashboardSummary?.financials?.totalOutstanding || unifiedMetrics.grossReceivables || 0))).toLocaleString()}</p>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-11 text-xs shadow-sm gap-2 cursor-pointer">
                    <Link href="/dashboard/accounts">
                      <Banknote className="h-4 w-4" />
                      <span>Open Student Billing & Live Receivables Ledger &rarr;</span>
                    </Link>
                  </Button>
                </div>
              )}

              {activeHeroModal === 'academic' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl text-indigo-900 font-medium">
                    <span>Overall Average API Score</span>
                    <span className="font-black text-lg">{academicTidbits.avgScore ? `${academicTidbits.avgScore}%` : '—'}</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">Top Performing Subject</span>
                      <span className="font-bold text-emerald-600">{academicTidbits.topSubject || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">Passing Rate Benchmark</span>
                      <span className="font-bold text-indigo-600">{academicTidbits.passingRate ? `${academicTidbits.passingRate}%` : '—'}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">Students at Academic Risk (&lt;50%)</span>
                      <Badge variant="outline" className={cn("text-[10px] font-bold", atRiskStudentsList.length > 0 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200")}>
                        {atRiskStudentsList.length} Flagged
                      </Badge>
                    </div>
                  </div>
                  <Button onClick={() => { setActiveHeroModal(null); onNavigateTab?.('academics'); }} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs py-2.5 cursor-pointer">
                    Open Academic Reports & Remediation Desk
                  </Button>
                </div>
              )}

              {activeHeroModal === 'attendance' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-500">Students Present</p>
                      <p className="font-black text-base text-slate-900">{studentsPresentCount} / {totalActiveStudents}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl">
                      <p className="text-[10px] text-emerald-700">Attendance Rate</p>
                      <p className="font-black text-base text-emerald-700">{dynamicAttendancePct}%</p>
                    </div>
                  </div>
                  {/* Register Submission Compliance */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">Daily Register Compliance:</span>
                      <span className={`font-bold ${classRegisterStats.pendingCount === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {classRegisterStats.submittedCount} of {classRegisterStats.total} Classes Submitted
                      </span>
                    </div>

                    {classRegisterStats.pendingClasses.length > 0 ? (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-amber-800">
                          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                          <span>{classRegisterStats.pendingClasses.length} Classroom Register{classRegisterStats.pendingClasses.length > 1 ? 's' : ''} Still Pending Today:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {classRegisterStats.pendingClasses.map((cls: any) => (
                            <span key={cls.id} className="inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px] bg-amber-100 text-amber-900 border border-amber-300">
                              ⚠️ {cls.name}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-amber-700 italic">
                          Teachers for these classrooms have not yet taken or submitted morning roll-call.
                        </p>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold">All {classRegisterStats.total} active classes have submitted morning attendance!</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs space-y-1">
                    <p className="font-semibold text-slate-800">Staff Verification</p>
                    <p className="text-[11px] text-amber-700">{telemetry.pendingStaffCheckins} Staff check-ins pending</p>
                  </div>

                  <Button onClick={() => { setActiveHeroModal(null); onNavigateTab?.('attendance'); }} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-sm">
                    Open Attendance Management Desk
                  </Button>
                </div>
              )}

              {activeHeroModal === 'faculty' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-500">Active Faculty & Staff</p>
                      <p className="font-black text-base text-slate-900">{activeFacultyCount}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-500">Enrolled Students</p>
                      <p className="font-black text-base text-slate-900">{enrolledStudentCount}</p>
                    </div>
                  </div>
                  <Button onClick={() => { setActiveHeroModal(null); onNavigateTab?.('staff'); }} className="w-full bg-slate-900 text-white font-bold rounded-xl">
                    Manage Faculty Directory
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ZONE 3: STRATEGIC PERFORMANCE MODULES & ANALYTICS GRID
          ───────────────────────────────────────────────────────────── */}
      <div className={cn("grid grid-cols-1 gap-5", showFinancials ? "lg:grid-cols-3" : "lg:grid-cols-1")}>
        
        {/* MODULE 1: Financial Receivables Aging Breakdown & Advance Payment Reconciliation */}
        {showFinancials && (
          <Card className="lg:col-span-2 shadow-sm border border-slate-200 rounded-2xl bg-white">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-semibold text-slate-900">Financial Receivables Aging & Credit Balance Reconciliation</CardTitle>
                    <Badge variant="outline" className="text-[9px] font-bold text-slate-600 bg-slate-50 border-slate-200">All-Time Cumulative</Badge>
                  </div>
                  <CardDescription className="text-xs text-slate-500 font-medium">All-time student ledger debt breakdown (all terms) vs parent advance tuition deposits & credit balances</CardDescription>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Button asChild variant="outline" size="sm" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 text-xs font-semibold text-indigo-700 transition cursor-pointer shadow-xs h-auto">
                    <Link href="/dashboard/accounts">
                      <Banknote className="h-3.5 w-3.5" />
                      <span>Student Billing & Aging &rarr;</span>
                    </Link>
                  </Button>
                  <button
                    onClick={() => setShowDebtDetailsToggle(prev => prev === 'net' ? 'gross' : 'net')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-xs"
                  >
                    <span>{showDebtDetailsToggle === 'net' ? 'Inspect Gross vs Deposits' : 'View Net Arrears Only'}</span>
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3 space-y-4">
              
              {/* Accounting Reconciliation Header Bar */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Gross Debt (Tiers 1-4)</span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">GH₵ {grossTotalDebt.toLocaleString()}</p>
                  <span className="text-[10px] text-slate-500 font-medium">All unpaid bills, all terms{agingAsOf ? ` · as of ${agingAsOf}` : ''}</span>
                  {(() => {
                    const split = summaryDebtSplit(dashboardSummary, currentTermFromProfile(schoolProfile)?.academicYear);
                    if (!split || split.earlier + split.unfiled < 0.01) return null;
                    return (
                      <span className="block text-[10px] text-amber-700 font-semibold">
                        GH₵ {Math.round(split.thisYear).toLocaleString()} this year · GH₵ {Math.round(split.earlier + split.unfiled).toLocaleString()} earlier years / no year
                      </span>
                    );
                  })()}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Less: Advance Payments / Credits</span>
                  <p className="font-bold text-emerald-600 text-sm mt-0.5">− GH₵ {advancePaymentsCredit.toLocaleString()}</p>
                  <span className="text-[10px] text-emerald-700 font-medium">Overpayments & advance deposits</span>
                </div>
                <div className="sm:border-l sm:border-slate-200 sm:pl-3">
                  <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">Net Outstanding Arrears</span>
                  <p className="font-bold text-red-600 text-sm mt-0.5">GH₵ {netOutstandingDebt.toLocaleString()}</p>
                  <span className="text-[10px] text-slate-500 font-medium">Actual net collectible fees</span>
                </div>
              </div>

              {/* Multi-segment Stacked Horizontal Distribution Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Aging Tier Distribution (% of Gross Debt)</span>
                  <span className="text-indigo-600 text-[11px] font-medium flex items-center gap-1">
                    <Zap className="h-3 w-3" /> Click tier bar to filter list
                  </span>
                </div>
                <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-100 p-0.5 border border-slate-200 shadow-inner">
                  {agingData.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleAgingClick(item.range)}
                      className={cn(
                        "h-full transition-all cursor-pointer hover:opacity-90 relative group border-r-2 border-white/90 last:border-r-0",
                        selectedAgingCategory === item.range ? "brightness-110 ring-2 ring-indigo-500 z-10" : ""
                      )}
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      title={`${item.range}: GH₵ ${item.amount.toLocaleString()} (${item.percentage}%)${item.accountCount !== null ? ` • ${item.accountCount} students` : ''}`}
                    />
                  ))}
                </div>
              </div>

              {/* Interactive Legend Grid with Percentage Distribution & Account Counts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {agingData.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleAgingClick(item.range)} 
                    className={cn(
                      "p-2.5 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] flex flex-col justify-between",
                      selectedAgingCategory === item.range
                        ? "bg-indigo-50/70 border-indigo-500 shadow-xs ring-2 ring-indigo-500/20"
                        : "bg-slate-50 border-slate-200/70 hover:border-slate-300 hover:bg-slate-100/80"
                    )}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[11px] font-bold text-slate-700 truncate">{item.range}</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-700 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md shadow-2xs shrink-0">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="border-t border-slate-200/60 my-1.5" />
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-slate-900">GH₵ {item.amount.toLocaleString()}</p>
                      {item.accountCount !== null && (
                        <span className="text-[9px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md shrink-0">
                          {item.accountCount} {item.accountCount === 1 ? 'student' : 'students'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick-Action Link to Student Accounts & Billing */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium">Complete debtor rosters, fee schedules, waiver approvals, and aging tiers are managed in Student Billing.</span>
                </div>
                <Button asChild size="sm" className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer">
                  <Link href="/dashboard/accounts">
                    Open Full Accounts & Billing &rarr;
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* MODULE 2: Macro Academic & Governance Desk */}
        <Card className={cn("shadow-sm border border-slate-200 rounded-2xl bg-white", showFinancials ? "" : "w-full")}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900">Macro Academic & Governance Desk</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium">Critical academic outliers, department gradebook SLAs & safeguarding audits</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigateTab?.('academics')} 
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-7 px-2 cursor-pointer"
              >
                Drill Down <ChevronRight className="h-3 w-3 ml-0.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-2 space-y-2.5">
            {macroAcademicConductFeed.map((feed, idx) => (
              <div key={feed.id || idx} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{feed.title}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{feed.time}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{feed.desc}</p>
                <div className="flex items-center justify-between pt-1">
                  <Badge variant="outline" className={cn("text-[10px] font-semibold", feed.color)}>
                    {feed.tag}
                  </Badge>
                  <button 
                    onClick={() => {
                      if (feed.type === 'safeguarding') {
                        onNavigateTab?.('students', 'discipline');
                      } else {
                        onNavigateTab?.('academics');
                      }
                    }}
                    className="text-[10px] font-semibold text-indigo-600 hover:underline cursor-pointer"
                  >
                    {feed.actionLabel} →
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODULE 3 & 4: ENROLLMENT DYNAMICS & DIRECTOR COMMAND BAR
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Enrollment Dynamics Chart */}
        <Card className="shadow-sm border border-slate-200 rounded-2xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">Enrollment Dynamics</CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium">Students on roll at the end of each month (from admission dates)</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-48 min-h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="enrollmentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} domain={[0, 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }} />
                  <Area type="monotone" dataKey="enrolled" name="Enrolled Students" stroke="#4f46e5" fill="url(#enrollmentGrad)" strokeWidth={2.5} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Students on roll now</span>
              <span className="font-bold text-emerald-600">{(enrolledStudentCount || (Array.isArray(students) ? students.length : 0)).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Director Quick Command Bar */}
        <Card className="lg:col-span-2 shadow-sm border border-slate-200 rounded-2xl bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">
              {showFinancials ? 'Director Command Bar' : 'Administrator Command Bar'}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium">
              {showFinancials ? 'Instant executive actions & portal communications' : 'Instant operational actions & portal communications'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            
            <form onSubmit={handleBroadcastAnnouncement} className="flex gap-2">
              <Input
                placeholder="Type an announcement to broadcast to all teachers & parents..."
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="text-xs rounded-xl bg-slate-50 border-slate-200"
              />
              <Button 
                type="submit" 
                disabled={isSendingAnnouncement}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs px-4"
              >
                {isSendingAnnouncement ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Megaphone className="h-4 w-4 mr-1.5" />}
                Broadcast
              </Button>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {showFinancials ? (
                <>
                  <Button 
                    variant="outline"
                    onClick={() => { toast({ title: 'Opening Accounts', description: 'Use the export button on the Accounts page to download the ledger.' }); router.push('/dashboard/accounts'); }}
                    className="bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-semibold text-xs rounded-xl justify-start"
                  >
                    <Download className="h-4 w-4 text-emerald-600 mr-2" /> Export Ledger Summary
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={handleIssueArrearsNotice}
                    className="bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-semibold text-xs rounded-xl justify-start"
                  >
                    <Send className="h-4 w-4 text-red-600 mr-2" /> Issue Fee Reminders
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={() => { toast({ title: 'Opening SMS', description: 'Choose the staff to call and send the message.' }); router.push('/dashboard/communication/sms'); }}
                    className="bg-rose-50 hover:bg-rose-100/90 border-rose-200 text-rose-700 font-semibold text-xs rounded-xl justify-start shadow-2xs transition-colors hover:border-rose-300"
                  >
                    <AlertTriangle className="h-4 w-4 text-rose-600 mr-2 shrink-0" /> Emergency Staff Call
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    onClick={() => onNavigateTab?.('students')}
                    className="bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-semibold text-xs rounded-xl justify-start"
                  >
                    <Users className="h-4 w-4 text-indigo-600 mr-2" /> Student Registry
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={() => onNavigateTab?.('attendance')}
                    className="bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-semibold text-xs rounded-xl justify-start"
                  >
                    <Clock className="h-4 w-4 text-amber-600 mr-2" /> Attendance Analytics
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={() => { toast({ title: 'Opening SMS', description: 'Choose the staff to call and send the message.' }); router.push('/dashboard/communication/sms'); }}
                    className="bg-rose-50 hover:bg-rose-100/90 border-rose-200 text-rose-700 font-semibold text-xs rounded-xl justify-start shadow-2xs transition-colors hover:border-rose-300"
                  >
                    <AlertTriangle className="h-4 w-4 text-rose-600 mr-2 shrink-0" /> Emergency Staff Call
                  </Button>
                </>
              )}
            </div>

          </CardContent>
        </Card>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODULE 5: EXECUTIVE AI AUDITOR TRIGGER BANNER
          ───────────────────────────────────────────────────────────── */}
      <Card className="shadow-sm border border-slate-200/80 bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">Executive AI Auditor & Operational Intelligence</h3>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] font-semibold px-2 py-0.5">
                  <Sparkles className="h-3 w-3 text-amber-500 mr-1" /> {aiCredits} Credits
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Instant operational audits, financial forecasting, and 1-click memo dispatches via slide-over drawer.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsAiDrawerOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl h-10 px-5 shrink-0 flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <BrainCircuit className="h-4 w-4 text-indigo-400" />
            Open Executive AI Drawer
          </Button>
        </CardContent>
      </Card>

      {/* ─── DIRECT-ACTION RESOLUTION MODALS ─── */}
      {activeActionModal && (
        <Dialog open={!!activeActionModal} onOpenChange={() => setActiveActionModal(null)}>
          <DialogContent className="max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            
            {activeActionModal === 'arrears_action' && (
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-red-600" />
                    Automate Fee Arrears Reminders
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 font-medium">
                    1-Click automated dispatch for accounts with fee arrears &gt; 60 days
                  </DialogDescription>
                </DialogHeader>
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-1 text-xs text-red-900">
                  <p className="font-bold">Total Overdue Target: GH₵ {Math.round(totalHighArrearsSum || 94538).toLocaleString()}</p>
                  <p className="text-[11px] font-medium text-red-700">Recipient Accounts: 14 Parents with high arrears (&gt;60 days overdue)</p>
                </div>
                <Button 
                  onClick={() => {
                    handleIssueArrearsNotice();
                    setActiveActionModal(null);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs py-2.5"
                >
                  <Send className="h-4 w-4 mr-2" /> Automate WhatsApp & SMS Reminders to 14 Parents
                </Button>
              </div>
            )}

            {activeActionModal === 'staff_action' && (
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-600" />
                    Resolve Staff Check-in Inspection
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 font-medium">
                    1-Click SMS dispatch to unchecked staff members
                  </DialogDescription>
                </DialogHeader>
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-900">
                  <p className="font-bold">Pending Staff Check-ins: {telemetry.pendingStaffCheckins} Members</p>
                  <p className="text-[11px] font-medium text-amber-700">Channel: Direct SMS Punctuality Notification</p>
                </div>
                <Button 
                  onClick={() => {
                    handleSendStaffReminders();
                    setActiveActionModal(null);
                  }}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs py-2.5"
                >
                  <Send className="h-4 w-4 mr-2" /> Send Instant Check-in SMS to {telemetry.pendingStaffCheckins} Staff
                </Button>
              </div>
            )}

            {activeActionModal === 'pantry_action' && (
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-emerald-600" />
                    Inventory & Canteen Requisition
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 font-medium">
                    Generate instant stock reorder requisition
                  </DialogDescription>
                </DialogHeader>
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs text-emerald-900">
                  <p className="font-bold">Pantry Inventory Status: Operating Normally</p>
                  <p className="text-[11px] font-medium text-emerald-700">Pre-emptively reorder low stock kitchen & stationery items</p>
                </div>
                <Button 
                  onClick={() => {
                    handleReorderStock();
                    setActiveActionModal(null);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs py-2.5"
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Generate Requisition Order
                </Button>
              </div>
            )}

            {activeActionModal === 'announcement_modal' && (
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-indigo-600" />
                    Executive Broadcast Announcement
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 font-medium">
                    Publish an executive update to parents, teachers & staff across all active portals
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => { handleBroadcastAnnouncement(e); setActiveActionModal(null); }} className="space-y-3">
                  <Input
                    placeholder="Type announcement message body..."
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="text-xs rounded-xl bg-slate-50 border-slate-200"
                  />
                  <Button 
                    type="submit"
                    disabled={isSendingAnnouncement}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs py-2.5"
                  >
                    <Megaphone className="h-4 w-4 mr-2" /> Broadcast Announcement Now
                  </Button>
                </form>
              </div>
            )}

          </DialogContent>
        </Dialog>
      )}

      {/* ─── CONTEXTUAL MEMO EXECUTION SLIDE-OVER SHEET ─── */}
      {aiDraftTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end transition-opacity">
          <div className="w-full max-w-lg bg-white min-h-full shadow-2xl border-l border-slate-200 p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
            
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{aiDraftTemplate.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">Contextual memo ready for 1-click execution</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setAiDraftTemplate(null)} className="rounded-full h-8 w-8 text-slate-500 hover:text-slate-900">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Target Recipients</label>
                  <Input
                    value={aiDraftTemplate.recipient}
                    onChange={(e) => setAiDraftTemplate({ ...aiDraftTemplate, recipient: e.target.value })}
                    className="text-xs rounded-xl bg-slate-50 border-slate-200 mt-1 font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Subject Line</label>
                  <Input
                    value={aiDraftTemplate.subject}
                    onChange={(e) => setAiDraftTemplate({ ...aiDraftTemplate, subject: e.target.value })}
                    className="text-xs rounded-xl bg-slate-50 border-slate-200 mt-1 font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Notice Message Content</label>
                  <textarea
                    rows={9}
                    value={aiDraftTemplate.body}
                    onChange={(e) => setAiDraftTemplate({ ...aiDraftTemplate, body: e.target.value })}
                    className="w-full p-3 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-indigo-500 mt-1 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 1-Click Execution Buttons */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <Button 
                onClick={() => {
                  // Nothing is sent from here: the text is copied and the SMS page opens, where the director
                  // picks the recipients and sends it for real.
                  const text = aiDraftTemplate.body || '';
                  try { navigator.clipboard?.writeText(text); } catch { /* ignore */ }
                  try { sessionStorage.setItem('gam_sms_draft', text); } catch { /* ignore */ }
                  toast({ title: 'Notice copied', description: `Paste it on the SMS page and choose: ${aiDraftTemplate.recipient}.` });
                  setAiDraftTemplate(null);
                  router.push('/dashboard/communication/sms');
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs py-3 cursor-pointer"
              >
                <Send className="h-4 w-4 mr-2" /> Copy & Open SMS to Send
              </Button>

              <Button 
                variant="outline"
                onClick={() => {
                  const text = `${aiDraftTemplate.subject || ''}\n\n${aiDraftTemplate.body || ''}`;
                  try { navigator.clipboard?.writeText(text); } catch { /* ignore */ }
                  toast({ title: 'Notice copied', description: 'Paste it into your letterhead document.' });
                }}
                className="w-full border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 rounded-xl text-xs py-2.5 cursor-pointer"
              >
                <Download className="h-4 w-4 mr-2" /> Copy Text for Letterhead
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
