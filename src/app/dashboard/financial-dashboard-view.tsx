'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { format, startOfDay, startOfMonth, startOfYear } from 'date-fns';
import { 
  Landmark, Banknote, TrendingUp, DollarSign, Wallet, Calculator, 
  ArrowUpRight, AlertTriangle, Scale, Clock, Users, ArrowDownRight, Award
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

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
}: FinancialDashboardViewProps) {
  const today = new Date();

  // 1. Resolve Active Term Bounds
  const activeBudget = useMemo(() => {
    if (!budgets) return null;
    return budgets.find((b: any) => {
      if (b.status !== 'Approved') return false;
      const start = b.startDate?.toDate ? b.startDate.toDate() : new Date(b.startDate);
      const end = b.endDate?.toDate ? b.endDate.toDate() : new Date(b.endDate);
      return today >= start && today <= end;
    }) || null;
  }, [budgets, today]);

  const termDates = useMemo(() => {
    if (activeBudget) {
      const start = activeBudget.startDate?.toDate ? activeBudget.startDate.toDate() : new Date(activeBudget.startDate);
      const end = activeBudget.endDate?.toDate ? activeBudget.endDate.toDate() : new Date(activeBudget.endDate);
      return { start, end, label: activeBudget.name || activeBudget.term || "Current Term" };
    }
    // Fallback standard basic school terms in Ghana:
    // Term 1: Jan 1 - Apr 30
    // Term 2: May 1 - Aug 31
    // Term 3: Sep 1 - Dec 31
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed
    if (currentMonth <= 3) {
      return { start: new Date(currentYear, 0, 1), end: new Date(currentYear, 3, 30, 23, 59, 59), label: "First Term" };
    } else if (currentMonth <= 7) {
      return { start: new Date(currentYear, 4, 1), end: new Date(currentYear, 7, 31, 23, 59, 59), label: "Second Term" };
    } else {
      return { start: new Date(currentYear, 8, 1), end: new Date(currentYear, 11, 31, 23, 59, 59), label: "Third Term" };
    }
  }, [activeBudget, today]);

  // 2. Revenue Aggregates
  const revenueStats = useMemo(() => {
    const startOfToday = startOfDay(today);
    const startOfThisMonth = startOfMonth(today);
    const startOfThisYear = startOfYear(today);

    let collectedToday = 0;
    let collectedThisMonth = 0;
    let collectedThisTerm = 0;
    let collectedThisYear = 0;

    if (payments) {
      payments.forEach((p: any) => {
        const studentObj = students?.find((s: any) => s.uid === p.studentId || s.id === p.studentId);
        if (!studentObj) return;
        const isActive = studentObj.enrollmentStatus === 'Active' || !studentObj.enrollmentStatus;
        if (!isActive) return;

        const amount = Number(p.amount) || 0;
        if (amount <= 0) return;

        const dateVal = p.paidAt || p.createdAt || p.date;
        if (!dateVal) return;
        const d = dateVal.toDate ? dateVal.toDate() : new Date(dateVal);
        if (isNaN(d.getTime())) return;

        if (d >= startOfToday) {
          collectedToday += amount;
        }
        if (d >= startOfThisMonth) {
          collectedThisMonth += amount;
        }
        if (d >= termDates.start && d <= termDates.end) {
          collectedThisTerm += amount;
        }
        if (d >= startOfThisYear) {
          collectedThisYear += amount;
        }
      });
    }

    return {
      collectedToday,
      collectedThisMonth,
      collectedThisTerm,
      collectedThisYear,
    };
  }, [payments, termDates, today, students]);

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
    if (financialRecords) {
      financialRecords.forEach((r: any) => {
        const studentObj = students?.find((s: any) => s.uid === r.studentId || s.id === r.studentId);
        if (!studentObj) return;
        const isActive = studentObj.enrollmentStatus === 'Active' || !studentObj.enrollmentStatus;
        if (!isActive) return;

        const billed = Number(r.billedAmount) || 0;
        const paid = Number(r.amountPaid) || 0;
        const waiver = Number(r.waiverAmount) || 0;
        const balance = billed - paid - waiver;
        if (balance > 0 && r.status !== 'Pending Reversal') {
          totalOutstanding += balance;
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
      budgetUtilization,
      budgetedExpenses,
    };
  }, [accounts, financialRecords, activeBudget, expensesByCategory, students]);

  // 5. Top Debtors
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

    return students
      .filter((student: any) => student.enrollmentStatus === 'Active' || !student.enrollmentStatus)
      .map((student: any) => {
        const studentRecords = recordsByStudent[student.uid] || recordsByStudent[student.id] || [];
        const totalBilled = studentRecords.reduce((sum, r) => sum + (Number(r.billedAmount) || 0), 0);
        const totalPaid = studentRecords.reduce((sum, r) => sum + (Number(r.amountPaid) || 0) + (Number(r.waiverAmount) || 0), 0);
        const outstanding = totalBilled - totalPaid;

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
      .sort((a: any, b: any) => b.outstanding - a.outstanding)
      .slice(0, 5);
  }, [financialRecords, students, classes]);

  // 6. Debt Aging Analysis
  const debtAgingStats = useMemo(() => {
    let current = 0;
    let age30 = 0;
    let age60 = 0;
    let age90 = 0;
    let overpayments = 0;
    
    if (!financialRecords) return { current: 0, age30: 0, age60: 0, age90: 0, total: 0, overpayments: 0, grossTotal: 0 };
    
    const todayVal = startOfDay(new Date());

    financialRecords.forEach((r: any) => {
      if (r.status === 'Pending Reversal') return;
      
      const studentObj = students?.find((s: any) => s.uid === r.studentId || s.id === r.studentId);
      if (!studentObj) return;
      const isActive = studentObj.enrollmentStatus === 'Active' || !studentObj.enrollmentStatus;
      if (!isActive) return;
      
      const billed = Number(r.billedAmount) || 0;
      const paid = Number(r.amountPaid) || 0;
      const waiver = Number(r.waiverAmount) || 0;
      const balance = billed - paid - waiver;

      if (balance < 0) {
        overpayments += Math.abs(balance);
        return;
      }
      if (balance <= 0.01) return;

      const dueDate = r.dueDate?.toDate ? r.dueDate.toDate() : new Date(r.dueDate);
      const diffTime = todayVal.getTime() - startOfDay(dueDate).getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        current += balance;
      } else if (diffDays <= 30) {
        age30 += balance;
      } else if (diffDays <= 60) {
        age60 += balance;
      } else {
        age90 += balance;
      }
    });

    const total = current + age30 + age60 + age90 - overpayments;
    const grossTotal = current + age30 + age60 + age90;
    return { current, age30, age60, age90, total, overpayments, grossTotal };
  }, [financialRecords, students]);

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
      </div>

      {/* 2. RECEIVABLES SECTION */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 font-bold">
          <Clock className="h-4 w-4 text-rose-500" /> Receivables
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Outstanding Fees Card */}
          <Card className="rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest font-bold">Outstanding fees</p>
              <h4 className="text-xl font-black text-slate-800 mt-2">GH₵ {cashPosition.totalReceivables.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
              <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Outstanding Parental Tuition</p>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit mt-4">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </Card>

          {/* Top Debtors Card */}
          <Card className="lg:col-span-2 rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-rose-500" /> Top debtors
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {topDebtors.length > 0 ? (
                topDebtors.map(debtor => (
                  <div key={debtor.studentId} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:scale-[1.01] transition-transform duration-300">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-700">{debtor.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{debtor.className}</p>
                    </div>
                    <div className="text-right">
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
                  {debtAgingStats.age90 > 0 && (
                    <div 
                      style={{ width: `${(debtAgingStats.age90 / debtAgingStats.grossTotal) * 100}%` }} 
                      className="bg-rose-600 transition-all duration-500 hover:opacity-90 cursor-pointer"
                      title={`61+ Days: GH₵ ${debtAgingStats.age90.toFixed(2)}`}
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
                  GH₵ {debtAgingStats.age90.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                  {debtAgingStats.grossTotal > 0 ? ((debtAgingStats.age90 / debtAgingStats.grossTotal) * 100).toFixed(1) : 0}% of gross
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

      {/* 4. CASH POSITION SECTION */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 font-bold">
          <Scale className="h-4 w-4 text-indigo-500" /> Cash Position
        </h2>
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
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
      </div>

    </div>
  );
}
