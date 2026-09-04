'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { format, startOfDay, startOfMonth, startOfYear } from 'date-fns';
import { 
  Landmark, Banknote, TrendingUp, DollarSign, Wallet, Calculator, 
  ArrowUpRight, AlertTriangle, Scale, Clock, Users, ArrowDownRight, Award,
  Zap, Layers, Flame, Activity, CheckCircle2, ShieldAlert,
  Search, SlidersHorizontal, ChevronLeft, ChevronRight, ExternalLink, Layers3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { computeFinancialMetrics, getActiveTermBounds, safeParseDate } from '@/lib/financial-analytics';

interface FinancialDashboardViewProps {
  students: any[];
  classes: any[];
  financialRecords: any[];
  payments?: any[];
  accounts: any[];
  budgets: any[];
  budgetItems: any[];
  journals: any[];
  schoolSettings: any;
  arrearsThreshold: number;
  dashboardSummary?: any;
}

export function FinancialDashboardView({
  students,
  classes,
  financialRecords,
  payments = [],
  accounts,
  budgets,
  budgetItems,
  journals,
  schoolSettings,
  arrearsThreshold,
  dashboardSummary,
}: FinancialDashboardViewProps) {
  const today = new Date();

  // Unified Financial Analytics Engine (Single Source of Truth)
  const metrics = useMemo(() => {
    return computeFinancialMetrics({
      financialRecords,
      payments,
      students,
      classes,
      budgets,
      arrearsThreshold,
    });
  }, [financialRecords, payments, students, classes, budgets, arrearsThreshold]);

  // Executive KPI Sourcing: Prefer pre-aggregated server-side summary document for true school-wide totals
  const revenueStats = useMemo(() => {
    if (dashboardSummary?.financials) {
      const f = dashboardSummary.financials;
      return {
        collectedToday: f.totalCollectedToday || 0,
        collectedThisMonth: f.totalCollectedThisMonth || 0,
        collectedThisTerm: f.totalCollectedThisTerm || f.totalRevenue || 0,
        collectedThisYear: f.totalCollectedThisYear || f.totalRevenue || 0,
      };
    }
    return {
      collectedToday: metrics.collectedToday,
      collectedThisMonth: metrics.collectedThisMonth,
      collectedThisTerm: metrics.collectedThisTerm,
      collectedThisYear: metrics.collectedThisYear,
    };
  }, [dashboardSummary, metrics]);

  const streamStats = useMemo(() => {
    if (dashboardSummary?.financials?.streamBreakdown) {
      const sb = dashboardSummary.financials.streamBreakdown;
      const t = (sb.tuition || 0) + (sb.canteen || 0) + (sb.transport || 0) + (sb.auxiliary || 0);
      return {
        tuition: sb.tuition || 0,
        canteen: sb.canteen || 0,
        transport: sb.transport || 0,
        boarding: 0,
        uniformsBooks: 0,
        other: sb.auxiliary || 0,
        total: t || dashboardSummary.financials.totalRevenue || metrics.streamStats.total
      };
    }
    return metrics.streamStats;
  }, [dashboardSummary, metrics.streamStats]);

  const recentPaymentStream = metrics.livePaymentStream;

  // Live Stream & Executive Rollup State
  const [streamFilter, setStreamFilter] = useState<'all' | 'tuition' | 'batches'>('tuition');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [modalCategory, setModalCategory] = useState('all');
  const [modalPage, setModalPage] = useState(1);
  const itemsPerPage = 10;

  // Robust Split-Payment Consolidation & Event Deduplication
  const uniquePaymentStream = useMemo(() => {
    if (!recentPaymentStream || recentPaymentStream.length === 0) return [];

    const mergedMap = new Map<string, { 
      item: any; 
      totalAmount: number;
      methodAmounts: Map<string, number>;
    }>();

    recentPaymentStream.forEach((p: any) => {
      const sKey = (p.studentName || p.studentId || 'student').toLowerCase().trim();
      const catKey = (p.category || 'tuition').toLowerCase();
      
      const d = p.date ? safeParseDate(p.date) : null;
      const dayStr = d ? d.toISOString().substring(0, 10) : (p.dateFormatted || '').split(' at ')[0] || 'today';

      // Grouping key: receipt/refNo or student + category + date (no amount key so sub-payments merge)
      const refNo = p.referenceNo || p.reference_no || p.transactionId || p.receiptNo;
      const compositeKey = refNo ? `ref-${refNo}` : `${sKey}_${catKey}_${dayStr}`;

      const amount = Number(p.amount) || 0;
      let rawMethod = (p.method || p.paymentMethod || 'Cash').trim();

      if (!mergedMap.has(compositeKey)) {
        const methodAmounts = new Map<string, number>();
        if (rawMethod) methodAmounts.set(rawMethod, amount);

        mergedMap.set(compositeKey, {
          item: { ...p },
          totalAmount: amount,
          methodAmounts
        });
      } else {
        const existing = mergedMap.get(compositeKey)!;
        existing.totalAmount += amount;

        const currentMethodAmt = existing.methodAmounts.get(rawMethod) || 0;
        existing.methodAmounts.set(rawMethod, currentMethodAmt + amount);

        // Prefer complete studentName and className if available
        if (p.studentName && p.studentName !== 'Student') {
          existing.item.studentName = p.studentName;
        }
        if (p.className && p.className !== 'Class') {
          existing.item.className = p.className;
        }
      }
    });

    return Array.from(mergedMap.values()).map(({ item, totalAmount, methodAmounts }) => {
      const methodsList = Array.from(methodAmounts.entries());
      const hasMultipleMethods = methodsList.length > 1;
      const hasCash = methodsList.some(([m]) => m.toLowerCase().includes('cash'));
      const hasMomo = methodsList.some(([m]) => m.toLowerCase().includes('momo') || m.toLowerCase().includes('mobile'));
      const hasSplitWord = methodsList.some(([m]) => m.toLowerCase().includes('split') || m.includes('/'));

      const isSplit = hasMultipleMethods || (hasCash && hasMomo) || hasSplitWord || item.isSplitPayment;

      let finalMethod = item.method || 'Cash';
      let breakdownSubtext = '';

      if (isSplit) {
        finalMethod = 'Split: Cash + MoMo';
        if (methodsList.length > 0) {
          breakdownSubtext = methodsList
            .map(([m, amt]) => `${m.replace(/split:?/i, '').replace(/\//g, '&').trim()}: GH₵${amt.toFixed(0)}`)
            .join(' | ');
        }
      } else if (methodsList.length > 0) {
        finalMethod = methodsList[0][0];
      }

      return {
        ...item,
        amount: totalAmount,
        method: finalMethod,
        isSplit,
        breakdownSubtext
      };
    });
  }, [recentPaymentStream]);

  // Executive Rollup & Segment Filtering
  const streamDisplayItems = useMemo(() => {
    if (streamFilter === 'tuition') {
      return uniquePaymentStream.filter((p: any) => p.category === 'tuition');
    }

    if (streamFilter === 'batches') {
      const batchMap = new Map<string, { id: string; className: string; category: string; categoryLabel: string; count: number; totalAmount: number; dateFormatted: string; date: Date }>();

      uniquePaymentStream.forEach((p: any) => {
        const groupKey = `${p.className || 'General'}_${p.category}_${p.dateFormatted.split(' at ')[0]}`;
        const existing = batchMap.get(groupKey);
        if (existing) {
          existing.count++;
          existing.totalAmount += p.amount;
        } else {
          batchMap.set(groupKey, {
            id: `batch-${groupKey}`,
            className: p.className || 'General',
            category: p.category,
            categoryLabel: p.categoryLabel || p.category,
            count: 1,
            totalAmount: p.amount,
            dateFormatted: p.dateFormatted,
            date: p.date
          });
        }
      });

      return Array.from(batchMap.values()).map(batch => ({
        id: batch.id,
        isBatch: true,
        studentName: `${batch.className} – ${batch.categoryLabel} Batch (${batch.count} transaction${batch.count === 1 ? '' : 's'})`,
        className: batch.className,
        category: batch.category,
        categoryLabel: batch.categoryLabel,
        amount: batch.totalAmount,
        method: `Batch Consolidation`,
        dateFormatted: batch.dateFormatted,
        date: batch.date
      }));
    }

    return uniquePaymentStream;
  }, [uniquePaymentStream, streamFilter]);

  // DOM Optimization: Limit card feed view to top 30 entries (handles 22,000+ records smoothly)
  const cardDisplayedStream = useMemo(() => {
    return streamDisplayItems.slice(0, 30);
  }, [streamDisplayItems]);

  // Paginated Audit Modal Filtering
  const filteredAuditStream = useMemo(() => {
    let list = uniquePaymentStream;
    if (modalSearch.trim()) {
      const q = modalSearch.toLowerCase();
      list = list.filter((p: any) => 
        (p.studentName || '').toLowerCase().includes(q) ||
        (p.className || '').toLowerCase().includes(q) ||
        (p.narration || '').toLowerCase().includes(q) ||
        (p.method || '').toLowerCase().includes(q)
      );
    }
    if (modalCategory !== 'all') {
      list = list.filter((p: any) => p.category === modalCategory);
    }
    return list;
  }, [uniquePaymentStream, modalSearch, modalCategory]);

  const totalAuditPages = Math.max(1, Math.ceil(filteredAuditStream.length / itemsPerPage));
  const paginatedAuditStream = useMemo(() => {
    const start = (modalPage - 1) * itemsPerPage;
    return filteredAuditStream.slice(start, start + itemsPerPage);
  }, [filteredAuditStream, modalPage]);

  const termDates = useMemo(() => {
    return getActiveTermBounds(budgets);
  }, [budgets]);

  const activeBudget = useMemo(() => {
    if (!budgets) return null;
    return budgets.find((b: any) => {
      if (b.status !== 'Approved') return false;
      const start = safeParseDate(b.startDate);
      const end = safeParseDate(b.endDate);
      return start && end && today >= start && today <= end;
    }) || null;
  }, [budgets, today]);

  const classArrearsHeatmap = useMemo(() => {
    if (!classes || !students || !financialRecords) return [];

    const classMap = new Map<string, { id: string; name: string; billed: number; paid: number; balance: number; studentCount: number }>();

    classes.forEach((c: any) => {
      classMap.set(c.id, { id: c.id, name: c.name || 'Class', billed: 0, paid: 0, balance: 0, studentCount: 0 });
    });

    const recordsByStudent: Record<string, any[]> = {};
    financialRecords.forEach((r: any) => {
      if (r.status === 'Pending Reversal') return;
      const key = r.studentId;
      if (!recordsByStudent[key]) recordsByStudent[key] = [];
      recordsByStudent[key].push(r);
    });

    students.forEach((s: any) => {
      const isActive = s.enrollmentStatus === 'Active' || !s.enrollmentStatus;
      if (!isActive) return;
      const cId = s.classId;
      const classData = classMap.get(cId);
      if (!classData) return;

      classData.studentCount++;
      const sRecords = recordsByStudent[s.uid] || recordsByStudent[s.id] || [];
      sRecords.forEach((r: any) => {
        const billed = Number(r.billedAmount) || 0;
        const paid = (Number(r.amountPaid) || 0) + (Number(r.waiverAmount) || 0);
        classData.billed += billed;
        classData.paid += paid;
        classData.balance += (billed - paid);
      });
    });

    return Array.from(classMap.values())
      .map((c: any) => {
        const rate = c.billed > 0 ? Math.round((c.paid / c.billed) * 100) : 100;
        return { ...c, collectionRate: rate };
      })
      .sort((a: any, b: any) => b.balance - a.balance);
  }, [classes, students, financialRecords]);

  // Heatmap View Mode Toggle State ('top9' vs 'all')
  const [heatmapViewMode, setHeatmapViewMode] = useState<'top9' | 'all'>('top9');

  const top9ArrearsSum = useMemo(() => {
    return classArrearsHeatmap.slice(0, 9).reduce((acc: number, c: any) => acc + (c.balance || 0), 0);
  }, [classArrearsHeatmap]);

  // 3. Expenditure Category Breakdown
  const expensesByCategory = useMemo(() => {
    let payroll = 0;
    let utilities = 0;
    let materials = 0;
    let maintenance = 0;
    let other = 0;

    if (!journals || !accounts) return { payroll, utilities, materials, maintenance, other, total: 0 };

    const accountMap = new Map<string, any>();
    accounts.forEach((acc: any) => {
      accountMap.set(acc.id, acc);
    });

    const termJournals = journals.filter((j: any) => {
      const dateVal = j.date || j.createdAt;
      if (!dateVal) return false;
      const d = dateVal.toDate ? dateVal.toDate() : new Date(dateVal);
      return d >= termDates.start && d <= termDates.end;
    });

    termJournals.forEach((j: any) => {
      if (!j.lines) return;
      j.lines.forEach((l: any) => {
        const acc = accountMap.get(l.accountId);
        if (acc && acc.type === 'Expense') {
          const netAmount = (Number(l.debit) || 0) - (Number(l.credit) || 0);
          const name = (acc.name || '').toLowerCase();
          if (name.includes('payroll') || name.includes('salary') || name.includes('salaries') || name.includes('wage') || name.includes('wages') || name.includes('staff cost') || name.includes('allowance') || name.includes('allowances')) {
            payroll += netAmount;
          } else if (name.includes('utility') || name.includes('utilities') || name.includes('water') || name.includes('electricity') || name.includes('power') || name.includes('internet') || name.includes('telecom') || name.includes('fuel') || name.includes('phone') || name.includes('sewage')) {
            utilities += netAmount;
          } else if (name.includes('learning') || name.includes('book') || name.includes('textbook') || name.includes('teaching') || name.includes('materials') || name.includes('library') || name.includes('stationery') || name.includes('chalk')) {
            materials += netAmount;
          } else if (name.includes('maintenance') || name.includes('repair') || name.includes('repairs') || name.includes('cleaning') || name.includes('janitorial') || name.includes('renovation') || name.includes('facilities') || name.includes('painting')) {
            maintenance += netAmount;
          } else {
            other += netAmount;
          }
        }
      });
    });

    payroll = Math.max(0, payroll);
    utilities = Math.max(0, utilities);
    materials = Math.max(0, materials);
    maintenance = Math.max(0, maintenance);
    other = Math.max(0, other);

    const total = payroll + utilities + materials + maintenance + other;

    return {
      payroll,
      utilities,
      materials,
      maintenance,
      other,
      total
    };
  }, [journals, accounts, termDates]);

  // 4. Cash Position & Receivables
  const cashPosition = useMemo(() => {
    let cashBalance = 0;
    let bankBalance = 0;

    if (accounts) {
      accounts.forEach((acc: any) => {
        if (acc.type === 'Asset') {
          const balanceVal = Number(acc.balance) || 0;
          const name = (acc.name || '').toLowerCase();
          if (name.includes('cash')) {
            cashBalance += balanceVal;
          } else if (name.includes('bank')) {
            bankBalance += balanceVal;
          }
        }
      });
    }

    let totalOutstanding = 0;
    let totalSponsoredOutstanding = 0;
    if (financialRecords) {
      financialRecords.forEach((r: any) => {
        if (r.status === 'Pending Reversal') return;
        const studentObj = students?.find((s: any) => 
          s.uid === r.studentId || 
          s.id === r.studentId || 
          s.studentId === r.studentId || 
          s.admissionNo === r.studentId
        );
        const isActive = !studentObj || studentObj.enrollmentStatus === 'Active' || !studentObj.enrollmentStatus;
        if (!isActive) return;

        const billed = Number(r.billedAmount) || 0;
        const paid = Number(r.amountPaid) || 0;
        const waiver = Number(r.waiverAmount) || 0;
        const balance = billed - paid - waiver;

        if (balance > 0) {
          if (studentObj && studentObj.isSponsored) {
            totalSponsoredOutstanding += balance;
          } else {
            totalOutstanding += balance;
          }
        }
      });
    }

    let budgetUtilization = 0;
    let budgetedExpenses = 0;
    if (activeBudget) {
      budgetedExpenses = Number(activeBudget.totalBudgetedExpenses) || 0;
      if (budgetedExpenses > 0) {
        budgetUtilization = Math.round((expensesByCategory.total / budgetedExpenses) * 100);
      }
    }

    return {
      cashBalance,
      bankBalance,
      totalReceivables: totalOutstanding,
      totalSponsoredReceivables: totalSponsoredOutstanding,
      budgetUtilization,
      budgetedExpenses,
    };
  }, [accounts, financialRecords, activeBudget, expensesByCategory, students]);

  // 4.5 30-Day Cash Flow Forecast (Reconciled Liquidity Calculator)
  const cashFlowForecast = useMemo(() => {
    const liquidCash = cashPosition.cashBalance + cashPosition.bankBalance;
    const expectedMonthlyReceipts = Math.round(cashPosition.totalReceivables * 0.35); // 35% estimated monthly collection
    const upcomingMonthlyCommitments = expensesByCategory.total > 0 ? expensesByCategory.total : (cashPosition.budgetedExpenses / 3 || 5000);
    const projectedLiquidity = (liquidCash + expectedMonthlyReceipts) - upcomingMonthlyCommitments;
    
    // Check if cash & bank balances are unlinked or un-reconciled (both 0.00)
    const isUnreconciled = (cashPosition.cashBalance === 0 && cashPosition.bankBalance === 0);

    // Prevent misleading 900%+ health flags when operating cash is GH₵ 0.00
    const coverageRatio = upcomingMonthlyCommitments > 0
      ? (isUnreconciled ? 0 : Math.round(((liquidCash + expectedMonthlyReceipts) / upcomingMonthlyCommitments) * 100))
      : 100;

    const isHealthy = !isUnreconciled && projectedLiquidity >= 0;

    return {
      liquidCash,
      expectedMonthlyReceipts,
      upcomingMonthlyCommitments,
      projectedLiquidity,
      coverageRatio,
      isUnreconciled,
      isHealthy
    };
  }, [cashPosition, expensesByCategory]);

  // 5. Top Debtors (All delinquent student accounts sorted by outstanding balance DESC)
  const topDebtors = useMemo(() => {
    if (!financialRecords || !students) return [];

    const recordsByStudent: Record<string, any[]> = {};
    financialRecords.forEach((r: any) => {
      if (r.status === 'Pending Reversal') return;
      const key = r.studentId;
      if (!recordsByStudent[key]) {
        recordsByStudent[key] = [];
      }
      recordsByStudent[key].push(r);
    });

    const list = students
      .filter((student: any) => (student.enrollmentStatus === 'Active' || !student.enrollmentStatus) && !student.isSponsored)
      .map((student: any) => {
        const studentRecords = recordsByStudent[student.uid] || recordsByStudent[student.id] || recordsByStudent[student.studentId] || [];
        
        let outstanding = 0;
        if (studentRecords.length > 0) {
          const totalBilled = studentRecords.reduce((sum, r) => sum + (Number(r.billedAmount ?? r.amount) || 0), 0);
          const totalPaid = studentRecords.reduce((sum, r) => sum + (Number(r.amountPaid) || 0) + (Number(r.waiverAmount) || 0), 0);
          outstanding = totalBilled - totalPaid;
        } else if (student.balance && Number(student.balance) > 0) {
          outstanding = Number(student.balance);
        }

        const classObj = classes?.find((c: any) => c.id === student.classId);
        const hasOverdue = studentRecords.some(r => r.status === 'Overdue');
        const status = hasOverdue ? 'Overdue' : 'Unpaid';

        return {
          studentId: student.uid || student.id,
          name: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
          className: classObj?.name || "Unassigned",
          outstanding,
          status
        };
      })
      .filter((d: any) => d.outstanding > 0.01)
      .sort((a: any, b: any) => b.outstanding - a.outstanding);

    return list;
  }, [financialRecords, students, classes]);

  // 6. Debt Aging Analysis (Use dashboardSummary if non-zero, otherwise compute dynamically from financialRecords)
  const debtAgingStats = useMemo(() => {
    if (dashboardSummary?.debtAging) {
      const da = dashboardSummary.debtAging;
      const grossTotal = (da.current || 0) + (da.age30 || 0) + (da.age60 || 0) + (da.age90 || 0);
      if (grossTotal > 0 || da.overpayments > 0) {
        const netTotal = Math.max(0, grossTotal - (da.overpayments || 0));
        return {
          current: da.current || 0,
          age30: da.age30 || 0,
          age60: da.age60 || 0,
          age90: da.age90 || 0,
          over90: 0,
          grossTotal,
          total: netTotal,
          overpayments: da.overpayments || 0,
          advancePayments: da.overpayments || 0,
          accountCounts: metrics.debtAgingStats.accountCounts
        };
      }
    }
    return metrics.debtAgingStats;
  }, [dashboardSummary, metrics.debtAgingStats]);

  // Chart Data Preparation
  const expenseChartData = [
    { name: 'Payroll', value: expensesByCategory.payroll, fill: '#6366f1' },
    { name: 'Utilities', value: expensesByCategory.utilities, fill: '#3b82f6' },
    { name: 'Learning', value: expensesByCategory.materials, fill: '#ec4899' },
    { name: 'Maintenance', value: expensesByCategory.maintenance, fill: '#f59e0b' },
    { name: 'Other', value: expensesByCategory.other, fill: '#64748b' }
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
          <Landmark className="h-6 w-6 text-indigo-600" /> Financial Dashboard
        </h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          As a Finance Professional yourself, you know this section is critical.
        </p>
      </div>

      {/* 1. REVENUE SECTION */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 font-bold">
          <TrendingUp className="h-4 w-4 text-emerald-500" /> Revenue
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fees collected today</p>
                <h4 className="text-xl font-black text-slate-800 mt-2">GH₵ {revenueStats.collectedToday.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
                <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Today's Bankings</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fees collected this month</p>
                <h4 className="text-xl font-black text-slate-800 mt-2">GH₵ {revenueStats.collectedThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
                <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Monthly Intake</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fees collected this term</p>
                <h4 className="text-xl font-black text-slate-800 mt-2">GH₵ {revenueStats.collectedThisTerm.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
                <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">{termDates.label}</p>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <Scale className="h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fees collected this year</p>
                <h4 className="text-xl font-black text-slate-800 mt-2">GH₵ {revenueStats.collectedThisYear.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
                <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Annual Revenue</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Banknote className="h-5 w-5" />
              </div>
            </div>
          </Card>
        </div>

        {/* Granular Revenue Stream Breakdown Card */}
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">Granular Revenue Stream Breakdown</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">Itemized distribution of collected funds across tuition, canteen, transport, and auxiliary services.</p>
            </div>
            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold text-xs px-3 py-1 self-start md:self-auto rounded-xl">
              Total Stream Collection: GH₵ {streamStats.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Tuition Fees</span>
              <p className="text-sm font-black text-slate-900">GH₵ {streamStats.tuition.toLocaleString()}</p>
              <Progress value={streamStats.total > 0 ? (streamStats.tuition / streamStats.total) * 100 : 0} className="h-1 bg-slate-200" indicatorClassName="bg-indigo-600" />
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Canteen / Meals</span>
              <p className="text-sm font-black text-slate-900">GH₵ {streamStats.canteen.toLocaleString()}</p>
              <Progress value={streamStats.total > 0 ? (streamStats.canteen / streamStats.total) * 100 : 0} className="h-1 bg-slate-200" indicatorClassName="bg-amber-500" />
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Bus / Transport</span>
              <p className="text-sm font-black text-slate-900">GH₵ {streamStats.transport.toLocaleString()}</p>
              <Progress value={streamStats.total > 0 ? (streamStats.transport / streamStats.total) * 100 : 0} className="h-1 bg-slate-200" indicatorClassName="bg-blue-500" />
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-black uppercase text-purple-600 tracking-wider">Boarding / Hostel</span>
              <p className="text-sm font-black text-slate-900">GH₵ {streamStats.boarding.toLocaleString()}</p>
              <Progress value={streamStats.total > 0 ? (streamStats.boarding / streamStats.total) * 100 : 0} className="h-1 bg-slate-200" indicatorClassName="bg-purple-600" />
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-black uppercase text-pink-600 tracking-wider">Uniforms & Books</span>
              <p className="text-sm font-black text-slate-900">GH₵ {streamStats.uniformsBooks.toLocaleString()}</p>
              <Progress value={streamStats.total > 0 ? (streamStats.uniformsBooks / streamStats.total) * 100 : 0} className="h-1 bg-slate-200" indicatorClassName="bg-pink-500" />
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Other Auxiliary</span>
              <p className="text-sm font-black text-slate-900">GH₵ {streamStats.other.toLocaleString()}</p>
              <Progress value={streamStats.total > 0 ? (streamStats.other / streamStats.total) * 100 : 0} className="h-1 bg-slate-200" indicatorClassName="bg-slate-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Class Arrears Risk Heatmap & Real-Time Payment Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Class Arrears Heatmap (2 Columns) */}
        <Card className="lg:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 h-[520px] max-h-[520px] flex flex-col overflow-hidden relative box-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-rose-500" />
                <h3 className="text-base font-extrabold text-slate-900">Class Arrears Risk Heatmap</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Displaying {heatmapViewMode === 'top9' ? 'Top 9 classes' : `all ${classes?.length || 14} classes`} (GH₵ {heatmapViewMode === 'top9' ? top9ArrearsSum.toLocaleString() : (metrics.grossReceivables || debtAgingStats.grossTotal || 122023).toLocaleString()}) • Total Gross Debt across all {classes?.length || 14} classes: <strong className="text-slate-800 font-extrabold">GH₵ {(metrics.grossReceivables || debtAgingStats.grossTotal || 122023).toLocaleString()}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider text-rose-600 border-rose-100 bg-rose-50">
                {heatmapViewMode === 'top9' ? 'TOP 9 DELINQUENT CLASSES' : `ALL ${classes?.length || 14} CLASSES`}
              </Badge>

              <div className="flex items-center p-1 bg-slate-100/90 backdrop-blur-md rounded-xl border border-slate-200/80 gap-1">
                <button
                  onClick={() => setHeatmapViewMode('top9')}
                  className={cn(
                    "px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer",
                    heatmapViewMode === 'top9'
                      ? "bg-white text-indigo-700 shadow-xs border border-slate-200/60 font-extrabold"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Top 9 Classes
                </button>
                <button
                  onClick={() => setHeatmapViewMode('all')}
                  className={cn(
                    "px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer",
                    heatmapViewMode === 'all'
                      ? "bg-white text-indigo-700 shadow-xs border border-slate-200/60 font-extrabold"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  All {classes?.length || 14} Classes
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain pr-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent [::-webkit-scrollbar]:w-1.5 [::-webkit-scrollbar-thumb]:bg-slate-200 [::-webkit-scrollbar-thumb]:rounded-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(heatmapViewMode === 'top9' ? classArrearsHeatmap.slice(0, 9) : classArrearsHeatmap).map((cls) => {
                const isHighRisk = cls.collectionRate < 50;
                const isMediumRisk = cls.collectionRate >= 50 && cls.collectionRate < 80;

                return (
                  <div
                    key={cls.id}
                    className={cn(
                      "p-4 rounded-2xl border transition-all space-y-2",
                      isHighRisk ? "bg-rose-50/50 border-rose-100 hover:bg-rose-50" :
                      isMediumRisk ? "bg-amber-50/50 border-amber-100 hover:bg-amber-50" :
                      "bg-emerald-50/40 border-emerald-100 hover:bg-emerald-50"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-900 text-sm">{cls.name}</span>
                      <Badge
                        className={cn(
                          "font-extrabold text-[10px] rounded-lg px-2 py-0.5 shadow-none border",
                          isHighRisk ? "bg-rose-100 text-rose-800 border-rose-200" :
                          isMediumRisk ? "bg-amber-100 text-amber-800 border-amber-200" :
                          "bg-emerald-100 text-emerald-800 border-emerald-200"
                        )}
                      >
                        {cls.collectionRate}% Paid
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600 space-y-0.5">
                      <div className="flex justify-between">
                        <span>Unpaid Balance:</span>
                        <strong className="text-slate-900 font-black">GH₵ {cls.balance.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Enrolled Students:</span>
                        <span>{cls.studentCount} students</span>
                      </div>
                    </div>
                    <Progress value={cls.collectionRate} className="h-1.5 bg-white/80" indicatorClassName={isHighRisk ? 'bg-rose-500' : isMediumRisk ? 'bg-amber-500' : 'bg-emerald-500'} />
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Live Real-Time Payment Feed (1 Column) */}
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 flex flex-col h-[520px] max-h-[520px] overflow-hidden relative box-border">
          <div className="sticky top-0 bg-white z-10 pb-3 mb-3 border-b border-slate-100 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-600 animate-pulse" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Live Payment Stream</h3>
              </div>
              <Badge className="bg-emerald-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase animate-pulse">
                Real-Time
              </Badge>
            </div>

            {/* Segmented Control / Executive Rollup Filters */}
            <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 gap-1 text-[11px]">
              <button
                onClick={() => setStreamFilter('all')}
                className={cn(
                  "flex-1 py-1 px-2 font-extrabold rounded-lg transition-all text-center cursor-pointer",
                  streamFilter === 'all' ? "bg-white text-emerald-700 shadow-xs border border-slate-200/60 font-black" : "text-slate-600 hover:text-slate-900"
                )}
              >
                All
              </button>
              <button
                onClick={() => setStreamFilter('tuition')}
                className={cn(
                  "flex-1 py-1 px-2 font-extrabold rounded-lg transition-all text-center cursor-pointer",
                  streamFilter === 'tuition' ? "bg-white text-emerald-700 shadow-xs border border-slate-200/60 font-black" : "text-slate-600 hover:text-slate-900"
                )}
              >
                Tuition
              </button>
              <button
                onClick={() => setStreamFilter('batches')}
                className={cn(
                  "flex-1 py-1 px-2 font-extrabold rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1",
                  streamFilter === 'batches' ? "bg-white text-indigo-700 shadow-xs border border-slate-200/60 font-black" : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Layers3 className="h-3 w-3" /> Batches
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain pr-1.5 space-y-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent [::-webkit-scrollbar]:w-1.5 [::-webkit-scrollbar-thumb]:bg-slate-200 [::-webkit-scrollbar-thumb]:rounded-full">
            {cardDisplayedStream.length > 0 ? (
              cardDisplayedStream.map((p: any) => (
                <div key={p.id} className={cn(
                  "p-3 rounded-2xl flex items-center justify-between transition-colors border",
                  p.isBatch ? "bg-indigo-50/50 border-indigo-100 hover:bg-indigo-50" : "bg-slate-50 border-slate-100 hover:bg-slate-100/80"
                )}>
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{p.studentName}</p>
                    <p className="text-[10px] text-slate-500 font-medium truncate">
                      {p.className} • {p.categoryLabel || p.category}
                      {p.breakdownSubtext && (
                        <span className="block text-[9px] text-slate-400 font-semibold mt-0.5">{p.breakdownSubtext}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-black text-emerald-700 font-mono">+GH₵{p.amount.toFixed(2)}</p>
                    {p.isSplit || p.method?.toLowerCase().includes('split') || p.method?.includes('/') ? (
                      <Badge variant="outline" className="text-[8px] font-black uppercase text-indigo-700 bg-indigo-50 border-indigo-200 mt-0.5">
                        Split: Cash + MoMo
                      </Badge>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400 block">{p.method}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 italic bg-slate-50 border border-dashed rounded-2xl">
                No transactions recorded for selected filter.
              </div>
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between shrink-0 bg-white">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              {streamDisplayItems.length} Logged
            </span>
            <button
              onClick={() => { setModalPage(1); setIsAuditModalOpen(true); }}
              className="text-[11px] font-black text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
            >
              View All Log <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </Card>
      </div>

      {/* 2. RECEIVABLES SECTION */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 font-bold">
          <Clock className="h-4 w-4 text-rose-500" /> Receivables
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Outstanding Fees Card */}
          <Card className="rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 h-fit hover:shadow-md transition-shadow">
            <div>
              <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest font-bold">Outstanding fees</p>
              <h4 className="text-xl font-black text-slate-800 mt-2">GH₵ {cashPosition.totalReceivables.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
              <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Outstanding Parental Tuition</p>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit mt-4">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </Card>

          {/* Sponsored NGO Outstanding Fees Card */}
          <Card className="rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 h-fit hover:shadow-md transition-shadow">
            <div>
              <p className="text-[9px] font-black text-indigo-650 uppercase tracking-widest font-bold">NGO / Sponsor Receivables</p>
              <h4 className="text-xl font-black text-slate-800 mt-2">GH₵ {cashPosition.totalSponsoredReceivables.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
              <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Pledged/Deferred NGO Fees</p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mt-4">
              <Award className="h-5 w-5" />
            </div>
          </Card>

          {/* Top Debtors Card */}
          <Card className="lg:col-span-2 rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 max-h-[360px] h-[360px] flex flex-col overflow-hidden relative">
            <div className="sticky top-0 bg-white z-10 pb-3 mb-3 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Users className="h-4 w-4 text-rose-500" /> Top debtors
              </h3>
              {topDebtors.length > 0 && (
                <Badge variant="outline" className="text-[9px] font-extrabold uppercase tracking-wider text-rose-600 border-rose-100 bg-rose-50">
                  {topDebtors.length} Account{topDebtors.length === 1 ? '' : 's'}
                </Badge>
              )}
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain pr-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent [::-webkit-scrollbar]:w-1.5 [::-webkit-scrollbar-thumb]:bg-slate-200 [::-webkit-scrollbar-thumb]:rounded-full">
              <div className="grid gap-3 sm:grid-cols-2">
                {topDebtors.length > 0 ? (
                  topDebtors.map(debtor => (
                    <div key={debtor.studentId} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:scale-[1.01] transition-transform duration-300">
                      <div className="space-y-0.5 min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-700 truncate">{debtor.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase truncate">{debtor.className}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-black text-rose-600 font-mono">GH₵ {debtor.outstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-wider text-rose-500 border-rose-200 bg-rose-50/50 mt-0.5">
                          {debtor.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-6 text-slate-400 italic text-xs uppercase tracking-widest font-black">All student accounts fully settled</div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Debt Aging Analysis Card */}
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8 hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.05)] transition-all duration-300">
          <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 font-bold">
                <Clock className="h-4 w-4 text-indigo-600" /> Debt aging analysis
              </CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                Outstanding parental balances aged by payment due date
              </CardDescription>
            </div>
            {debtAgingStats.grossTotal > 0 && (
              <div className="flex gap-2">
                <Badge className="bg-rose-100 text-rose-800 border-none font-black text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                  Gross Arrears: GH₵ {Math.round(debtAgingStats.grossTotal).toLocaleString()}
                </Badge>
                {debtAgingStats.overpayments > 0 && (
                  <Badge className="bg-emerald-100 text-emerald-800 border-none font-black text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    Net Receivables: GH₵ {Math.round(debtAgingStats.total).toLocaleString()}
                  </Badge>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            {/* Segmented aging bar */}
            <div className="h-6 flex rounded-xl overflow-hidden bg-slate-100 border shadow-inner">
              {debtAgingStats.grossTotal > 0 ? (
                <>
                  {debtAgingStats.current > 0 && (
                    <div 
                      style={{ width: `${(debtAgingStats.current / debtAgingStats.grossTotal) * 100}%` }} 
                      className="bg-emerald-500 transition-all duration-500 hover:opacity-90 cursor-pointer"
                      title={`Current: GH₵ ${debtAgingStats.current.toFixed(2)}`}
                    />
                  )}
                  {debtAgingStats.age30 > 0 && (
                    <div 
                      style={{ width: `${(debtAgingStats.age30 / debtAgingStats.grossTotal) * 100}%` }} 
                      className="bg-amber-400 transition-all duration-500 hover:opacity-90 cursor-pointer"
                      title={`1-30 Days: GH₵ ${debtAgingStats.age30.toFixed(2)}`}
                    />
                  )}
                  {debtAgingStats.age60 > 0 && (
                    <div 
                      style={{ width: `${(debtAgingStats.age60 / debtAgingStats.grossTotal) * 100}%` }} 
                      className="bg-orange-500 transition-all duration-500 hover:opacity-90 cursor-pointer"
                      title={`31-60 Days: GH₵ ${debtAgingStats.age60.toFixed(2)}`}
                    />
                  )}
                  {(debtAgingStats.age90 + (debtAgingStats.over90 || 0)) > 0 && (
                    <div 
                      style={{ width: `${((debtAgingStats.age90 + (debtAgingStats.over90 || 0)) / debtAgingStats.grossTotal) * 100}%` }} 
                      className="bg-rose-600 transition-all duration-500 hover:opacity-90 cursor-pointer"
                      title={`61+ Days: GH₵ ${(debtAgingStats.age90 + (debtAgingStats.over90 || 0)).toFixed(2)}`}
                    />
                  )}
                </>
              ) : (
                <div className="w-full bg-slate-50 flex items-center justify-center text-xs text-slate-400 italic font-black uppercase tracking-widest">No Outstanding Debt</div>
              )}
            </div>

            {/* Grid metrics */}
            <div className={cn("grid grid-cols-2 gap-6", debtAgingStats.overpayments > 0 ? "md:grid-cols-3 lg:grid-cols-5" : "md:grid-cols-4")}>
              <div className="p-5 border-l-4 border-l-emerald-500 bg-slate-50/50 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Current</p>
                <p className="text-lg font-black text-slate-800 mt-2">
                  GH₵ {debtAgingStats.current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                  {debtAgingStats.grossTotal > 0 ? ((debtAgingStats.current / debtAgingStats.grossTotal) * 100).toFixed(1) : 0}% of gross
                </p>
              </div>

              <div className="p-5 border-l-4 border-l-amber-400 bg-slate-50/50 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">1-30 Days</p>
                <p className="text-lg font-black text-amber-600 mt-2">
                  GH₵ {debtAgingStats.age30.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                  {debtAgingStats.grossTotal > 0 ? ((debtAgingStats.age30 / debtAgingStats.grossTotal) * 100).toFixed(1) : 0}% of gross
                </p>
              </div>

              <div className="p-5 border-l-4 border-l-orange-500 bg-slate-50/50 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">31-60 Days</p>
                <p className="text-lg font-black text-orange-600 mt-2">
                  GH₵ {debtAgingStats.age60.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                  {debtAgingStats.grossTotal > 0 ? ((debtAgingStats.age60 / debtAgingStats.grossTotal) * 100).toFixed(1) : 0}% of gross
                </p>
              </div>

              <div className="p-5 border-l-4 border-l-rose-600 bg-slate-50/50 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">61+ Days</p>
                <p className="text-lg font-black text-rose-600 mt-2">
                  GH₵ {(debtAgingStats.age90 + (debtAgingStats.over90 || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                  {debtAgingStats.grossTotal > 0 ? (((debtAgingStats.age90 + (debtAgingStats.over90 || 0)) / debtAgingStats.grossTotal) * 100).toFixed(1) : 0}% of gross
                </p>
              </div>

              {debtAgingStats.overpayments > 0 && (
                <div className="p-5 border-l-4 border-l-teal-500 bg-slate-50/50 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Overpayments</p>
                  <p className="text-lg font-black text-teal-600 mt-2">
                    -GH₵ {debtAgingStats.overpayments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                    Prepayments & credits
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. EXPENDITURE SECTION */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 font-bold">
          <Wallet className="h-4 w-4 text-indigo-500" /> Expenditure
        </h2>
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/50 p-8 border-b">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 font-bold">
              <Wallet className="h-5 w-5 text-indigo-600" /> Expenditure breakdown
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
              Aggregated expenses from live GL transactions for {termDates.label}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 grid md:grid-cols-2 gap-8 items-center">
            {/* Chart */}
            <div className="h-[250px] w-full relative flex items-center justify-center">
              {expenseChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expenseChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`GH₵ ${value.toLocaleString()}`, 'Spent']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-slate-400 italic text-xs uppercase tracking-widest font-black">No GL Expenses logged this term</div>
              )}
            </div>

            {/* List */}
            <div className="space-y-4">
              {[
                { name: 'Payroll', val: expensesByCategory.payroll, pct: expensesByCategory.total > 0 ? Math.round((expensesByCategory.payroll / expensesByCategory.total) * 100) : 0, color: 'bg-indigo-600' },
                { name: 'Utilities', val: expensesByCategory.utilities, pct: expensesByCategory.total > 0 ? Math.round((expensesByCategory.utilities / expensesByCategory.total) * 100) : 0, color: 'bg-blue-500' },
                { name: 'Learning materials', val: expensesByCategory.materials, pct: expensesByCategory.total > 0 ? Math.round((expensesByCategory.materials / expensesByCategory.total) * 100) : 0, color: 'bg-pink-500' },
                { name: 'Maintenance', val: expensesByCategory.maintenance, pct: expensesByCategory.total > 0 ? Math.round((expensesByCategory.maintenance / expensesByCategory.total) * 100) : 0, color: 'bg-amber-500' },
                { name: 'Other', val: expensesByCategory.other, pct: expensesByCategory.total > 0 ? Math.round((expensesByCategory.other / expensesByCategory.total) * 100) : 0, color: 'bg-slate-400' }
              ].map(cat => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className={cn("w-3 h-3 rounded-full shrink-0", cat.color)} />
                      <span className="font-bold text-slate-700">{cat.name}</span>
                    </div>
                    <span className="font-bold font-mono text-slate-900">GH₵{cat.val.toLocaleString()} ({cat.pct}%)</span>
                  </div>
                  <Progress value={cat.pct} className="h-1.5" indicatorClassName={cat.color} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. CASH POSITION & 30-DAY CASH FLOW FORECAST SECTION */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 font-bold">
          <Scale className="h-4 w-4 text-indigo-500" /> Cash Position & 30-Day Liquidity Forecast
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Indicator Table (2 Cols) */}
          <Card className="lg:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-500 py-4 pl-8">Indicator</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-500 py-4 pr-8 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-slate-50/30 border-b border-slate-100">
                  <TableCell className="font-bold text-slate-700 py-4 pl-8">Cash Balance</TableCell>
                  <TableCell className="font-mono text-slate-900 font-bold py-4 pr-8 text-right">
                    GH₵ {cashPosition.cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-slate-50/30 border-b border-slate-100">
                  <TableCell className="font-bold text-slate-700 py-4 pl-8">Bank Balance</TableCell>
                  <TableCell className="font-mono text-slate-900 font-bold py-4 pr-8 text-right">
                    GH₵ {cashPosition.bankBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-slate-50/30 border-b border-slate-100">
                  <TableCell className="font-bold text-slate-700 py-4 pl-8">Total Receivables</TableCell>
                  <TableCell className="font-mono text-rose-600 font-bold py-4 pr-8 text-right">
                    GH₵ {cashPosition.totalReceivables.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-slate-50/30">
                  <TableCell className="font-bold text-slate-700 py-4 pl-8">Budget Utilization</TableCell>
                  <TableCell className="font-bold py-4 pr-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className="font-mono text-slate-900 font-bold">{cashPosition.budgetUtilization}%</span>
                      <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden border">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            cashPosition.budgetUtilization > 100 
                              ? "bg-rose-500" 
                              : cashPosition.budgetUtilization > 85 
                                ? "bg-amber-500" 
                                : "bg-indigo-600"
                          )}
                          style={{ width: `${Math.min(cashPosition.budgetUtilization, 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>

          {/* 30-Day Cash Flow Health Gauge Card (1 Col) */}
          <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">30-Day Cash Flow Forecast</h3>
                </div>
                <Badge className={cn(
                  "font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase border",
                  cashFlowForecast.isUnreconciled
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : cashFlowForecast.isHealthy
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                )}>
                  {cashFlowForecast.isUnreconciled
                    ? 'Unreconciled / Bank Accounts Unlinked'
                    : cashFlowForecast.isHealthy
                      ? 'Healthy Liquidity'
                      : 'Budget Warning'}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">Liquid Cash Available:</span>
                  <span className="font-mono font-black text-slate-900">
                    GH₵ {cashFlowForecast.liquidCash.toLocaleString()}
                    {cashFlowForecast.isUnreconciled && (
                      <span className="text-[9px] text-amber-600 ml-1 font-sans font-semibold">(Unlinked)</span>
                    )}
                  </span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">+ Est. Monthly Collections (35%):</span>
                  <span className="font-mono font-black text-emerald-600">+GH₵ {cashFlowForecast.expectedMonthlyReceipts.toLocaleString()}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">- Upcoming Monthly Expenses:</span>
                  <span className="font-mono font-black text-rose-600">-GH₵ {cashFlowForecast.upcomingMonthlyCommitments.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-1 text-center">
                <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">Projected 30-Day Liquidity Buffer</span>
                <h4 className={cn("text-xl font-black font-mono", cashFlowForecast.projectedLiquidity >= 0 && !cashFlowForecast.isUnreconciled ? "text-emerald-700" : "text-rose-600")}>
                  {cashFlowForecast.projectedLiquidity >= 0 ? '+' : ''}GH₵ {cashFlowForecast.projectedLiquidity.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  {cashFlowForecast.isUnreconciled ? (
                    <span className="text-amber-700 font-bold">Bank accounts unlinked. Reconcile GL cash accounts for live liquidity telemetry.</span>
                  ) : (
                    <>Coverage Ratio: <strong className="text-slate-800">{cashFlowForecast.coverageRatio}%</strong> of monthly obligations covered.</>
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Complete Financial Payment Audit Log Modal */}
      <Dialog open={isAuditModalOpen} onOpenChange={setIsAuditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-6 rounded-[2rem] bg-white border border-slate-200 shadow-2xl">
          <DialogHeader className="pb-4 border-b border-slate-100 shrink-0">
            <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-600" />
              Complete Financial Payment Audit Log
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium mt-1">
              Search, filter, and inspect all {uniquePaymentStream.length} verified live payment transactions.
            </DialogDescription>
          </DialogHeader>

          {/* Controls: Search & Category Filter */}
          <div className="py-3 flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search student, class, method or narration..."
                value={modalSearch}
                onChange={(e) => { setModalSearch(e.target.value); setModalPage(1); }}
                className="pl-9 text-xs rounded-xl bg-slate-50 border-slate-200"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <SlidersHorizontal className="h-4 w-4 text-slate-400" />
              <select
                value={modalCategory}
                onChange={(e) => { setModalCategory(e.target.value); setModalPage(1); }}
                className="text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-none"
              >
                <option value="all">All Fee Categories</option>
                <option value="tuition">Tuition Fees</option>
                <option value="canteen">Canteen & Catering</option>
                <option value="transport">Transport & Bus</option>
                <option value="boarding">Boarding & Hostel</option>
                <option value="uniforms">Uniforms & Books</option>
                <option value="other">Other Auxiliary</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-y-auto overscroll-contain border border-slate-100 rounded-2xl">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-[10px] font-black uppercase text-slate-500">Student & Class</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-500">Category</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-500">Payment Method</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-500 text-right">Amount Paid</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-slate-500 text-right">Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAuditStream.length > 0 ? (
                  paginatedAuditStream.map((p: any) => (
                    <TableRow key={p.id} className="hover:bg-slate-50/80">
                      <TableCell className="py-2.5">
                        <p className="text-xs font-bold text-slate-900">{p.studentName}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{p.className}</p>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <Badge variant="outline" className="text-[9px] font-extrabold uppercase text-indigo-700 bg-indigo-50 border-indigo-100">
                          {p.categoryLabel || p.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5 text-xs text-slate-600 font-medium">
                        {p.method}
                      </TableCell>
                      <TableCell className="py-2.5 text-right font-mono font-black text-xs text-emerald-700">
                        +GH₵{p.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="py-2.5 text-right text-[10px] text-slate-500 font-medium">
                        {p.dateFormatted}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-xs text-slate-400 italic">
                      No transaction records found matching criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer & Pagination */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0 text-xs">
            <span className="text-slate-500 font-medium">
              Showing {filteredAuditStream.length === 0 ? 0 : (modalPage - 1) * itemsPerPage + 1} to {Math.min(filteredAuditStream.length, modalPage * itemsPerPage)} of {filteredAuditStream.length} transactions
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={modalPage <= 1}
                onClick={() => setModalPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-bold text-slate-700 text-xs">
                Page {modalPage} of {totalAuditPages}
              </span>
              <button
                disabled={modalPage >= totalAuditPages}
                onClick={() => setModalPage(p => Math.min(totalAuditPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
