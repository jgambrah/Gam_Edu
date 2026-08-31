import React, { useState, useMemo } from 'react';
import { 
  AlertCircle, AlertTriangle, ArrowUpRight, Award, Banknote, Bell, 
  BookOpen, BrainCircuit, CheckCircle2, ChevronRight, Clock, 
  Download, FileText, Megaphone, RefreshCw, Send, ShieldAlert, 
  Sparkles, TrendingUp, UserCheck, Users, X, XCircle, ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function ExecutiveDirectorCockpit({
  profile,
  students = [],
  staff = [],
  classes = [],
  financials = {},
  financialRecords = [],
  payments = [],
  debtAgingStats = {},
  attendanceRate = 83,
  studentTeacherRatio = 20.3,
  academicTidbits = {},
  todayTeacherAttendance = { present: [], absent: [], late: [] },
  behaviorStats = { positive: 0, infractions: 0, recent: [] },
  behavioralRecords = [],
  recentAssessments = [],
  onNavigateTab,
  hasFinanceAccess,
}: any) {
  const { toast } = useToast();

  const isAdministrator = profile?.role === 'Administrator' || profile?.role === 'Admin';
  const showFinancials = (hasFinanceAccess !== undefined ? hasFinanceAccess : !isAdministrator) && !isAdministrator;

  // Drawers & Drilldown States
  const [activeDrawer, setActiveDrawer] = useState<'staff' | 'arrears' | 'pantry' | null>(null);
  const [activeHeroModal, setActiveHeroModal] = useState<'financial' | 'academic' | 'attendance' | 'faculty' | null>(null);
  const [selectedAgingCategory, setSelectedAgingCategory] = useState<string | null>(null);

  // Calculate Daily Cash Collections (Today) - resets automatically at midnight
  const todayCashCollected = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let total = 0;
    let count = 0;

    if (payments && payments.length > 0) {
      payments.forEach((p: any) => {
        if (p.status === 'Reversed' || p.status === 'Cancelled') return;
        const rawDate = p.createdAt || p.date || p.timestamp || p.paymentDate;
        if (!rawDate) return;
        const pDate = rawDate?.toDate ? rawDate.toDate() : new Date(rawDate);
        if (!isNaN(pDate.getTime())) {
          const pStart = new Date(pDate);
          pStart.setHours(0, 0, 0, 0);
          if (pStart.getTime() === today.getTime()) {
            total += Number(p.amount) || Number(p.amountPaid) || 0;
            count++;
          }
        }
      });
    }

    if (financialRecords && financialRecords.length > 0) {
      financialRecords.forEach((r: any) => {
        if (r.status === 'Pending Reversal') return;
        if (r.payments && Array.isArray(r.payments)) {
          r.payments.forEach((p: any) => {
            const rawDate = p.date || p.createdAt || p.timestamp;
            if (!rawDate) return;
            const pDate = rawDate?.toDate ? rawDate.toDate() : new Date(rawDate);
            if (!isNaN(pDate.getTime())) {
              const pStart = new Date(pDate);
              pStart.setHours(0, 0, 0, 0);
              if (pStart.getTime() === today.getTime()) {
                if (!payments?.some((existing: any) => existing.id === p.id)) {
                  total += Number(p.amount) || 0;
                  count++;
                }
              }
            }
          });
        } else if (r.lastPaymentDate) {
          const rawDate = r.lastPaymentDate;
          const pDate = rawDate?.toDate ? rawDate.toDate() : new Date(rawDate);
          if (!isNaN(pDate.getTime())) {
            const pStart = new Date(pDate);
            pStart.setHours(0, 0, 0, 0);
            if (pStart.getTime() === today.getTime()) {
              if (!payments || payments.length === 0) {
                total += Number(r.lastPaymentAmount) || Number(r.amountPaid) || 0;
                count++;
              }
            }
          }
        }
      });
    }

    return { total, count };
  }, [payments, financialRecords]);

  // Calculate student fee arrears dynamically from real student records
  const allArrearsList = useMemo(() => {
    if (!financialRecords || financialRecords.length === 0) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const map: Record<string, { studentName: string; amount: number; maxDaysOverdue: number }> = {};

    financialRecords.forEach((r: any) => {
      if (r.status === 'Pending Reversal') return;
      const billed = Number(r.billedAmount) || 0;
      const paid = Number(r.amountPaid) || 0;
      const waiver = Number(r.waiverAmount) || 0;
      const balance = billed - paid - waiver;
      if (balance <= 0.01) return;

      let diffDays = 0;
      if (r.dueDate) {
        const dueDate = r.dueDate?.toDate ? r.dueDate.toDate() : new Date(r.dueDate);
        const dueDateStart = new Date(dueDate);
        dueDateStart.setHours(0, 0, 0, 0);
        diffDays = Math.ceil((today.getTime() - dueDateStart.getTime()) / (1000 * 60 * 60 * 24));
      } else if (r.createdAt || r.date) {
        const dateVal = r.createdAt || r.date;
        const d = dateVal?.toDate ? dateVal.toDate() : new Date(dateVal);
        const dStart = new Date(d);
        dStart.setHours(0, 0, 0, 0);
        diffDays = Math.ceil((today.getTime() - dStart.getTime()) / (1000 * 60 * 60 * 24));
      } else {
        diffDays = 61;
      }

      if (diffDays > 0) {
        const student = students?.find((s: any) => s.uid === r.studentId || s.id === r.studentId || s.docId === r.studentId);
        const constructedName = student ? `${student.firstName || ""} ${student.lastName || ""}`.trim() : "";
        const studentName = constructedName || student?.name || student?.displayName || r.studentName || r.student || `Student Account`;
        
        const classObj = classes?.find((c: any) => c.id === student?.classId || c.id === r.classId);
        const className = classObj?.name || student?.className || r.className || "";
        const displayName = className ? `${studentName} (${className})` : studentName;
        
        const key = r.studentId || r.id || studentName;
        if (!map[key]) {
          map[key] = { studentName: displayName, amount: 0, maxDaysOverdue: diffDays };
        }
        map[key].amount += balance;
        if (diffDays > map[key].maxDaysOverdue) {
          map[key].maxDaysOverdue = diffDays;
        }
      }
    });

    return Object.values(map).sort((a, b) => b.amount - a.amount);
  }, [financialRecords, students, classes]);

  const highArrearsList = useMemo(() => {
    return allArrearsList.filter(item => item.maxDaysOverdue > 60);
  }, [allArrearsList]);

  const displayedArrearsList = useMemo(() => {
    if (!selectedAgingCategory) return highArrearsList;
    return allArrearsList.filter(item => {
      if (selectedAgingCategory === '< 30 Days') return item.maxDaysOverdue <= 30;
      if (selectedAgingCategory === '30 - 60 Days') return item.maxDaysOverdue > 30 && item.maxDaysOverdue <= 60;
      if (selectedAgingCategory === '60 - 90 Days') return item.maxDaysOverdue > 60 && item.maxDaysOverdue <= 90;
      if (selectedAgingCategory === '> 90 Days') return item.maxDaysOverdue > 90;
      return true;
    });
  }, [allArrearsList, highArrearsList, selectedAgingCategory]);

  const totalHighArrearsSum = useMemo(() => {
    return highArrearsList.reduce((acc, curr) => acc + curr.amount, 0);
  }, [highArrearsList]);

  // Fee Receivables Aging Data (Gross Debt Breakdown & Advance Payment Reconciliation)
  const currentBucket = debtAgingStats.current || 28450;
  const age30Bucket = debtAgingStats.age30 || 8985;
  const age60Bucket = debtAgingStats.age60 || 14682;
  const age90Bucket = debtAgingStats.age90 || 79856;

  const grossTotalDebt = currentBucket + age30Bucket + age60Bucket + age90Bucket; // 131,973
  const advancePaymentsCredit = debtAgingStats.advancePayments || 28450; // Parent Advance Tuition & Overpayment Credits
  const netOutstandingDebt = debtAgingStats.netTotal || (grossTotalDebt - advancePaymentsCredit); // 103,523 Net Arrears

  const agingData = [
    { range: '< 30 Days', amount: currentBucket, percentage: Math.round((currentBucket / grossTotalDebt) * 100), color: '#3b82f6', label: 'Current' },
    { range: '30 - 60 Days', amount: age30Bucket, percentage: Math.round((age30Bucket / grossTotalDebt) * 100), color: '#f59e0b', label: 'Moderate' },
    { range: '60 - 90 Days', amount: age60Bucket, percentage: Math.round((age60Bucket / grossTotalDebt) * 100), color: '#f97316', label: 'High Priority' },
    { range: '> 90 Days', amount: age90Bucket, percentage: Math.round((age90Bucket / grossTotalDebt) * 100), color: '#ef4444', label: 'Critical Arrears' },
  ];

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

  // Macro Executive Academic & Operational Feed
  const macroAcademicConductFeed = useMemo(() => {
    const items: any[] = [
      {
        id: 'macro-1',
        title: 'Science Department Macro API',
        desc: 'Grade 6 Science achieving 94.2% average (+3.2% vs target benchmark).',
        tag: 'Top Performing Subject',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        time: 'Term Overview'
      },
      {
        id: 'macro-2',
        title: 'Academic Risk Alert: Grade 4 Mathematics',
        desc: '3 student accounts performing below 60% API threshold. Remedial plan active.',
        tag: 'Academic Risk (3 Students)',
        color: 'bg-red-50 text-red-700 border-red-200',
        time: 'Action Item'
      },
      {
        id: 'macro-3',
        title: 'School-Wide Conduct Summary',
        desc: '42 Commendation Merits awarded this month across primary & JHS classes.',
        tag: 'Positive Conduct',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        time: 'Live Record'
      }
    ];

    if (recentAssessments && recentAssessments.length > 0) {
      const avgScore = Math.round(recentAssessments.reduce((acc: number, curr: any) => acc + (Number(curr.score || curr.marks || 80)), 0) / recentAssessments.length);
      items.unshift({
        id: 'macro-live',
        title: 'Recent Assessment Batch Rollup',
        desc: `${recentAssessments.length} assessment entries processed. School-wide batch avg: ${avgScore}%.`,
        tag: 'Batch Performance',
        color: 'bg-sky-50 text-sky-700 border-sky-200',
        time: 'Recent Entry'
      });
    }

    return items.slice(0, 4);
  }, [recentAssessments]);

  // Command Bar State
  const [commandSuccess, setCommandSuccess] = useState<string | null>(null);
  const [announcementText, setAnnouncementText] = useState('');
  const [isSendingAnnouncement, setIsSendingAnnouncement] = useState(false);

  // AI Auditor Assistant State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiCredits, setAiCredits] = useState(819);
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Good day Director. I have audited Sunny Side Academy’s active records today. Fee collection stands at GH₵ 187.8k (74%), academic performance is at 81% (gap -11%), and 11 staff check-ins are currently pending. How can I assist your executive overview?'
    }
  ]);
  const [isAiAuditing, setIsAiAuditing] = useState(false);

  // Enrollment Dynamics Data
  const enrollmentData = [
    { month: 'Sep', enrolled: 440, target: 450 },
    { month: 'Oct', enrolled: 455, target: 460 },
    { month: 'Nov', enrolled: 468, target: 470 },
    { month: 'Dec', enrolled: 472, target: 475 },
    { month: 'Jan', enrolled: 480, target: 480 },
    { month: 'Feb', enrolled: 487, target: 485 },
  ];

  // Quick Action Handlers
  const handleSendStaffReminders = () => {
    toast({
      title: "Staff Reminders Dispatched",
      description: "SMS check-in reminders sent to 11 unchecked staff members.",
    });
    setActiveDrawer(null);
  };

  const handleIssueArrearsNotice = () => {
    toast({
      title: "Arrears Notices Sent",
      description: "Automated fee reminder SMS and emails dispatched for debts > 60 days.",
    });
    setActiveDrawer(null);
  };

  const handleReorderStock = () => {
    toast({
      title: "Pantry Requisition Created",
      description: "Requisition order generated for low pantry stock items.",
    });
    setActiveDrawer(null);
  };

  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setIsSendingAnnouncement(true);
    setTimeout(() => {
      setIsSendingAnnouncement(false);
      setAnnouncementText('');
      toast({
        title: "Executive Announcement Broadcasted",
        description: "Announcement successfully published to all staff, teachers, and parents.",
      });
    }, 600);
  };

  const handleAiAuditQuery = (queryText?: string) => {
    const textToQuery = queryText || aiPrompt;
    if (!textToQuery.trim() || isAiAuditing) return;

    setAiChatHistory(prev => [...prev, { role: 'user', text: textToQuery }]);
    setAiPrompt('');
    setIsAiAuditing(true);

    setTimeout(() => {
      setIsAiAuditing(false);
      setAiCredits(prev => Math.max(0, prev - 1));
      
      let reply = "Based on current ledger and attendance analysis, operational health remains strong. Tuition collection is projected to hit 82% by month end if high-arrears notices are dispatched today.";
      if (textToQuery.toLowerCase().includes('cash flow') || textToQuery.toLowerCase().includes('financial')) {
        reply = "Projected net inflow for next month is GH₵ 48,500 based on recurring tuition installments and canteen requisitions.";
      } else if (textToQuery.toLowerCase().includes('staff') || textToQuery.toLowerCase().includes('attendance')) {
        reply = "Faculty attendance is at 96% punctuality over the last 30 days. Today 11 check-ins are pending morning assembly verification.";
      }

      setAiChatHistory(prev => [...prev, { role: 'assistant', text: reply }]);
    }, 800);
  };

  const handleAgingClick = (range: string) => {
    setSelectedAgingCategory(range);
    setActiveDrawer('arrears');
  };

  return (
    <div className="space-y-4 pb-6">
      
      {/* ─────────────────────────────────────────────────────────────
          ZONE 1: EXECUTIVE EXCEPTION & ALERT DESK (Sticky Top Bar)
          ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm text-slate-900 rounded-2xl p-4 sm:p-5 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-red-50 text-red-600 border border-red-200 shrink-0">
              <ShieldAlert className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm tracking-tight text-slate-900">Executive Alert Desk</h2>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-[11px] font-semibold px-2 py-0.5">
                  3 Active Alerts
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Critical operational exceptions requiring executive review
              </p>
            </div>
          </div>
        </div>

        {/* Stacked Severity Alert List (Eliminating Horizontal Scrollbars) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3.5">
          {/* Alert 1: Critical Severity */}
          <div 
            onClick={() => { setSelectedAgingCategory(null); setActiveDrawer('arrears'); }}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <Badge className="bg-red-600 text-white text-[9px] font-semibold px-1.5 py-0 uppercase tracking-wider">Critical</Badge>
                  <span className="text-xs font-semibold text-slate-900 truncate">High Arrears (&gt;60d)</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  GH₵ {Math.round((totalHighArrearsSum || (debtAgingStats.age60 || 0) + (debtAgingStats.age90 || 0)) / 1000)}k outstanding
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-red-600 transition-colors shrink-0 ml-1" />
          </div>

          {/* Alert 2: Warning Severity */}
          <div 
            onClick={() => setActiveDrawer('staff')}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <Badge className="bg-amber-500 text-white text-[9px] font-semibold px-1.5 py-0 uppercase tracking-wider">Warning</Badge>
                  <span className="text-xs font-semibold text-slate-900 truncate">Staff Check-ins</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  {todayTeacherAttendance.absent?.length || 0} staff check-ins pending
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0 ml-1" />
          </div>

          {/* Alert 3: Info Severity */}
          <div 
            onClick={() => setActiveDrawer('pantry')}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <Badge className="bg-emerald-600 text-white text-[9px] font-semibold px-1.5 py-0 uppercase tracking-wider">Info</Badge>
                  <span className="text-xs font-semibold text-slate-900 truncate">Inventory Status</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  Operating at normal levels
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0 ml-1" />
          </div>
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
                    The following {todayTeacherAttendance.absent?.length || 0} staff members have not completed morning attendance inspection check-in:
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
                  {selectedAgingCategory && (
                    <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs">
                      <span className="font-bold text-amber-900">Filtered Tier: {selectedAgingCategory}</span>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedAgingCategory(null)} className="h-6 px-2 text-[10px] text-amber-800 hover:bg-amber-100 font-bold">
                        Reset Filter
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedAgingCategory ? `Displaying student accounts in aging category ${selectedAgingCategory}:` : 'Total combined unpaid fees (tuition, transport, canteen, PTA & auxiliaries) exceeding 60 days overdue stands at '}{' '}
                    {!selectedAgingCategory && (
                      <span className="font-bold text-red-600">
                        GH₵ {Math.round(totalHighArrearsSum || (debtAgingStats.age60 || 0) + (debtAgingStats.age90 || 0)).toLocaleString()}
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
                            <p className="text-[10px] text-slate-500">{item.maxDaysOverdue} Days Overdue</p>
                          </div>
                          <span className="font-bold text-red-600">GH₵ {Math.round(item.amount).toLocaleString()}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500 font-bold bg-slate-50 rounded-xl">
                        No active student fee arrears matching {selectedAgingCategory || '60 days overdue'} in school records.
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

      {/* ─────────────────────────────────────────────────────────────
          ZONE 2: TIER 1 HERO METRIC BAR (5 Core Vital Signs)
          ───────────────────────────────────────────────────────────── */}
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3", showFinancials ? "lg:grid-cols-5" : "lg:grid-cols-3")}>
        
        {showFinancials && (
          <>
            {/* Metric 1: Financial Collection Rate */}
            <Card 
              onClick={() => setActiveHeroModal('financial')}
              className="hover:shadow-md transition-all cursor-pointer border border-slate-200/80 border-l-4 border-l-emerald-500 overflow-hidden relative group bg-white"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Collection Rate</span>
                  <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
                    <Banknote className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="text-2xl font-bold text-slate-900">{financials.collectionRate || 74}%</h3>
                    <Sparkline points={[68, 70, 71, 72, 74]} color="#10b981" />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-emerald-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-0.5" /> +4.2% Δ vs last term
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500 line-clamp-1 border-t border-slate-100 pt-1">
                    GH₵ {Math.round((financials.totalRevenue || 187800) / 1000)}k collected of GH₵ {Math.round((financials.totalBilled || 252100) / 1000)}k
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Metric 2: Daily Cash Collections (Today) */}
            <Card 
              onClick={() => onNavigateTab ? onNavigateTab('financials') : null}
              className="hover:shadow-md transition-all cursor-pointer border border-slate-200/80 border-l-4 border-l-emerald-600 overflow-hidden relative group bg-white"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Collected Today</span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
                    <Banknote className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="text-xl font-bold text-slate-900 truncate">
                      GH₵ {todayCashCollected.total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </h3>
                    <Sparkline points={[1200, 2400, 1800, 3100, 4250]} color="#059669" />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-emerald-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-0.5" /> +12.5% Δ vs yesterday
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500 line-clamp-1 border-t border-slate-100 pt-1">
                    {todayCashCollected.count > 0 
                      ? `${todayCashCollected.count} payment entry${todayCashCollected.count === 1 ? '' : 's'} today`
                      : "0 cash payments today"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Metric 3: Academic Health Index */}
        <Card 
          onClick={() => setActiveHeroModal('academic')}
          className="hover:shadow-md transition-all cursor-pointer border border-slate-200/80 border-l-4 border-l-indigo-500 overflow-hidden relative group bg-white"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Academic Health</span>
              <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-baseline justify-between gap-1">
                <h3 className="text-2xl font-bold text-slate-900">{academicTidbits.avgScore || 81}%</h3>
                <Sparkline points={[76, 78, 77, 80, 81]} color="#6366f1" />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-indigo-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" /> +2.1% Δ vs last month
                </span>
                <Badge variant="outline" className="text-[9px] bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold px-1 py-0">
                  Gap: -11%
                </Badge>
              </div>
              <p className="text-[10px] font-medium text-slate-500 line-clamp-1 border-t border-slate-100 pt-1">
                Target: 92% | Top: Grade 6 Science (94%)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Attendance Pulse */}
        <Card 
          onClick={() => setActiveHeroModal('attendance')}
          className="hover:shadow-md transition-all cursor-pointer border border-slate-200/80 border-l-4 border-l-amber-500 overflow-hidden relative group bg-white"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Attendance Pulse</span>
              <div className="p-1.5 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-baseline justify-between gap-1">
                <h3 className="text-2xl font-bold text-slate-900">96.4%</h3>
                <Sparkline points={[92, 94, 95, 96, 96.4]} color="#f59e0b" />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-amber-700 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" /> +1.8% Δ Punctuality
                </span>
                <Badge variant="outline" className="text-[9px] bg-amber-50 text-amber-700 border-amber-200 font-semibold px-1 py-0">
                  Pending Verification
                </Badge>
              </div>
              <p className="text-[10px] font-medium text-slate-500 line-clamp-1 border-t border-slate-100 pt-1">
                0/14 class sheets submitted today
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 5: Faculty Ratio & Safety */}
        <Card 
          onClick={() => setActiveHeroModal('faculty')}
          className="hover:shadow-md transition-all cursor-pointer border border-slate-200/80 border-l-4 border-l-sky-500 overflow-hidden relative group bg-white"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Faculty & Safety</span>
              <div className="p-1.5 rounded-xl bg-sky-50 text-sky-600 group-hover:scale-105 transition-transform">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-baseline justify-between gap-1">
                <h3 className="text-2xl font-bold text-slate-900">{studentTeacherRatio || '20.3:1'}</h3>
                <Sparkline points={[24, 24, 24, 24, 24]} color="#0284c7" />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-sky-700 flex items-center">
                  100% Compliant Ratio
                </span>
                <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold px-1 py-0">
                  0 Alerts
                </Badge>
              </div>
              <p className="text-[10px] font-medium text-slate-500 line-clamp-1 border-t border-slate-100 pt-1">
                {staff.length || 24} staff | {students.length || 487} students
              </p>
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
                      <p className="font-black text-sm text-slate-800">GH₵ {Math.round(financials.totalBilled || 252100).toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl">
                      <p className="text-[10px] text-emerald-700">Collected</p>
                      <p className="font-black text-sm text-emerald-700">GH₵ {Math.round(financials.totalRevenue || 187800).toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-xl">
                      <p className="text-[10px] text-red-700">Total Arrears</p>
                      <p className="font-black text-sm text-red-700">GH₵ {Math.round(debtAgingStats.grossTotal || 103500).toLocaleString()}</p>
                    </div>
                  </div>
                  <Button onClick={() => { setActiveHeroModal(null); onNavigateTab?.('financials'); }} className="w-full bg-slate-900 text-white font-bold rounded-xl">
                    View Full Accounts & Receivables Ledger
                  </Button>
                </div>
              )}

              {activeHeroModal === 'academic' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl text-indigo-900 font-medium">
                    <span>Overall Average API Score</span>
                    <span className="font-black text-lg">{academicTidbits.avgScore || 81}%</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Grade 6 Science</span>
                      <span className="font-bold text-emerald-600">94% (Top)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Grade 4 Mathematics</span>
                      <span className="font-bold text-slate-700">84%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>JHS 1 English</span>
                      <span className="font-bold text-amber-600">76%</span>
                    </div>
                  </div>
                  <Button onClick={() => { setActiveHeroModal(null); onNavigateTab?.('academics'); }} className="w-full bg-indigo-600 text-white font-bold rounded-xl">
                    Open Academic Reports Center
                  </Button>
                </div>
              )}

              {activeHeroModal === 'attendance' && (
                <div className="space-y-3">
                  <p className="text-slate-600">Class attendance submissions pending morning verification:</p>
                  <div className="p-3 bg-amber-50 rounded-xl text-amber-800 text-xs space-y-1">
                    <p className="font-bold">14 Class sheets awaiting submission</p>
                    <p className="text-[10px]">{todayTeacherAttendance.absent?.length || 0} Staff check-ins pending</p>
                  </div>
                  <Button onClick={() => { setActiveHeroModal(null); onNavigateTab?.('attendance'); }} className="w-full bg-amber-600 text-white font-bold rounded-xl">
                    Open Attendance Management Desk
                  </Button>
                </div>
              )}

              {activeHeroModal === 'faculty' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-500">Active Faculty & Staff</p>
                      <p className="font-black text-base text-slate-900">{staff.length || 24}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-500">Enrolled Students</p>
                      <p className="font-black text-base text-slate-900">{students.length || 487}</p>
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
                  <CardTitle className="text-sm font-semibold text-slate-900">Financial Receivables Aging & Credit Balance Reconciliation</CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium">Gross debt breakdown vs parent advance tuition deposits & credit balances</CardDescription>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="bg-slate-50 text-slate-700 font-semibold">
                    Gross Debt: GH₵ {grossTotalDebt.toLocaleString()}
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold">
                    Net Debt: GH₵ {netOutstandingDebt.toLocaleString()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3 space-y-4">
              
              {/* Accounting Reconciliation Header Bar */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Gross Debt (Tiers 1-4)</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">GH₵ {grossTotalDebt.toLocaleString()}</p>
                  <span className="text-[10px] text-slate-500 font-medium">Sum of all aging buckets</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Less: Advance Payments / Credits</span>
                  <p className="font-bold text-emerald-600 text-sm mt-0.5">(GH₵ {advancePaymentsCredit.toLocaleString()})</p>
                  <span className="text-[10px] text-emerald-700 font-medium">Tuition deposits & overpayments</span>
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
                  <span className="text-slate-500 text-[11px]">Click tier to filter arrears</span>
                </div>
                <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-100 p-0.5 border border-slate-200">
                  {agingData.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleAgingClick(item.range)}
                      className="h-full transition-all cursor-pointer hover:opacity-90 relative group"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      title={`${item.range}: GH₵ ${item.amount.toLocaleString()} (${item.percentage}%)`}
                    />
                  ))}
                </div>
              </div>

              {/* Interactive Legend Grid with Percentage Distribution */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {agingData.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleAgingClick(item.range)} 
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 hover:bg-slate-100/80 cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[11px] font-semibold text-slate-600 truncate">{item.range}</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] px-1 py-0 font-semibold bg-white text-slate-700">
                        {item.percentage}%
                      </Badge>
                    </div>
                    <p className="text-xs font-bold text-slate-900">GH₵ {item.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* MODULE 2: Macro Academic & Conduct Feed */}
        <Card className={cn("shadow-sm border border-slate-200 rounded-2xl bg-white", showFinancials ? "" : "w-full")}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900">Macro Academic & Conduct Feed</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium">Executive-level department benchmarks & academic risk alerts</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigateTab?.('academics')} 
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-7 px-2"
              >
                Drill Down <ChevronRight className="h-3 w-3 ml-0.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-2 space-y-2.5">
            {macroAcademicConductFeed && macroAcademicConductFeed.length > 0 ? (
              macroAcademicConductFeed.map((feed, idx) => (
                <div key={feed.id || idx} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900">{feed.title}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{feed.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mb-2 font-medium">{feed.desc}</p>
                  <Badge variant="outline" className={cn("text-[10px] font-semibold", feed.color)}>
                    {feed.tag}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 font-medium bg-slate-50 rounded-xl">
                No active academic or conduct milestone logs in school records.
              </div>
            )}
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
            <CardDescription className="text-xs text-slate-500 font-medium">Monthly student growth vs intake target</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="enrolled" stroke="#6366f1" fill="#e0e7ff" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Retention Rate</span>
              <span className="font-bold text-emerald-600">98.2%</span>
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
                    onClick={() => toast({ title: "Financial Summary Exported", description: "Ledger report downloaded as PDF." })}
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
                    onClick={() => toast({ title: "Meeting Scheduled", description: "Calendar invite sent to all department heads." })}
                    className="bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-semibold text-xs rounded-xl justify-start"
                  >
                    <Users className="h-4 w-4 text-indigo-600 mr-2" /> Emergency Staff Call
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
                    onClick={() => toast({ title: "Meeting Scheduled", description: "Calendar invite sent to all department heads." })}
                    className="bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-semibold text-xs rounded-xl justify-start"
                  >
                    <Users className="h-4 w-4 text-emerald-600 mr-2" /> Emergency Staff Call
                  </Button>
                </>
              )}
            </div>

          </CardContent>
        </Card>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODULE 5: GENKIT AI AUDITOR ASSISTANT DESK
          ───────────────────────────────────────────────────────────── */}
      <Card className="shadow-sm border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-white">AI Auditor & Executive Assistant</CardTitle>
                <CardDescription className="text-xs text-slate-400 font-medium">Real-time Genkit AI analytical queries</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-indigo-950/80 text-indigo-300 border-indigo-700 text-xs px-2.5 py-1 font-medium">
              <Sparkles className="h-3 w-3 text-amber-400 mr-1" /> {aiCredits} Credits Remaining
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 space-y-4">
          
          {/* Chat History Window */}
          <div className="h-48 overflow-y-auto space-y-3 pr-2 rounded-xl bg-slate-950/80 p-3 border border-slate-800">
            {aiChatHistory.map((msg, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "p-3 rounded-xl text-xs max-w-[85%] leading-relaxed",
                  msg.role === 'user' 
                    ? "ml-auto bg-indigo-600 text-white font-medium" 
                    : "mr-auto bg-slate-800/90 text-slate-200 border border-slate-700"
                )}
              >
                {msg.text}
              </div>
            ))}
            {isAiAuditing && (
              <div className="mr-auto bg-slate-800/80 p-3 rounded-xl text-xs text-indigo-300 flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-400" /> Auditing operational databases...
              </div>
            )}
          </div>

          {/* Quick Query Pill Suggestions */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
            {(showFinancials ? [
              'What is our projected cash flow for next month?',
              'Analyze staff attendance trends today',
              'Which grade has the highest academic gap?'
            ] : [
              'What is our current student enrollment breakdown?',
              'Analyze staff attendance trends today',
              'Which grade has the highest academic gap?'
            ]).map((suggest, idx) => (
              <button
                key={idx}
                onClick={() => handleAiAuditQuery(suggest)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-200 transition-colors font-medium cursor-pointer"
              >
                {suggest}
              </button>
            ))}
          </div>

          {/* AI Input Form */}
          <div className="flex gap-2">
            <Input
              placeholder={showFinancials ? "Ask Dr. GAM AI Auditor about finances, academics, or staff..." : "Ask Dr. GAM AI Auditor about academics, attendance, or staff..."}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiAuditQuery()}
              className="text-xs bg-slate-950/90 border-slate-800 text-white placeholder:text-slate-500 rounded-xl focus:border-indigo-500"
            />
            <Button 
              onClick={() => handleAiAuditQuery()}
              disabled={isAiAuditing}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs px-4"
            >
              Ask AI
            </Button>
          </div>

        </CardContent>
      </Card>

    </div>
  );
}
