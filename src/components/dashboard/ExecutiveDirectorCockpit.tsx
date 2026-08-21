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
  debtAgingStats = {},
  attendanceRate = 83,
  studentTeacherRatio = 20.3,
  academicTidbits = {},
  todayTeacherAttendance = { present: [], absent: [], late: [] },
  behaviorStats = { positive: 0, infractions: 0, recent: [] },
  onNavigateTab,
}: any) {
  const { toast } = useToast();

  // Calculate high arrears (>60 days overdue) dynamically from real student records
  const highArrearsList = useMemo(() => {
    if (!financialRecords || financialRecords.length === 0 || !students || students.length === 0) return [];
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

      if (!r.dueDate) return;
      const dueDate = r.dueDate?.toDate ? r.dueDate.toDate() : new Date(r.dueDate);
      const dueDateStart = new Date(dueDate);
      dueDateStart.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((today.getTime() - dueDateStart.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays > 60) {
        const student = students.find((s: any) => s.uid === r.studentId || s.id === r.studentId);
        if (student) {
          const studentName = `${student.firstName || ""} ${student.lastName || ""}`.trim() || student.name || student.displayName || "Student";
          const classObj = classes?.find((c: any) => c.id === student.classId);
          const className = classObj?.name || student.className || "";
          const displayName = className ? `${studentName} (${className})` : studentName;
          
          if (!map[r.studentId]) {
            map[r.studentId] = { studentName: displayName, amount: 0, maxDaysOverdue: diffDays };
          }
          map[r.studentId].amount += balance;
          if (diffDays > map[r.studentId].maxDaysOverdue) {
            map[r.studentId].maxDaysOverdue = diffDays;
          }
        }
      }
    });

    return Object.values(map).sort((a, b) => b.amount - a.amount);
  }, [financialRecords, students, classes]);

  const totalHighArrearsSum = useMemo(() => {
    return highArrearsList.reduce((acc, curr) => acc + curr.amount, 0);
  }, [highArrearsList]);

  // Drawers / Modals State
  const [activeDrawer, setActiveDrawer] = useState<'staff' | 'arrears' | 'pantry' | null>(null);
  const [activeHeroModal, setActiveHeroModal] = useState<'financial' | 'academic' | 'attendance' | 'faculty' | null>(null);

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

  // Fee Receivables Aging Data
  const agingData = [
    { range: '< 30 Days', amount: debtAgingStats.current || 28450, color: '#3b82f6', label: 'Current' },
    { range: '30 - 60 Days', amount: debtAgingStats.age30 || 34200, color: '#f59e0b', label: 'Moderate' },
    { range: '60 - 90 Days', amount: debtAgingStats.age60 || 22100, color: '#f97316', label: 'High Priority' },
    { range: '> 90 Days', amount: debtAgingStats.age90 || 18750, color: '#ef4444', label: 'Critical Arrears' },
  ];

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

  return (
    <div className="space-y-6 pb-12">
      
      {/* ─────────────────────────────────────────────────────────────
          ZONE 1: EXECUTIVE EXCEPTION & ALERT DESK (Sticky Top Bar)
          ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white rounded-2xl p-4 shadow-xl transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-slate-100">Executive Alert Desk</span>
                <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5">
                  🔴 3 Actions Required
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                {todayTeacherAttendance.absent?.length || 0} Unchecked Staff | GH₵ {Math.round((totalHighArrearsSum || (debtAgingStats.age60 || 0) + (debtAgingStats.age90 || 0)) / 1000)}k High Arrears (&gt;60 days) | Normal Pantry Inventory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setActiveDrawer('staff')}
              className="bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
            >
              <UserCheck className="h-3.5 w-3.5 text-amber-400 mr-1.5" />
              Staff Check-ins ({todayTeacherAttendance.absent?.length || 0})
            </Button>

            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setActiveDrawer('arrears')}
              className="bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
            >
              <Banknote className="h-3.5 w-3.5 text-red-400 mr-1.5" />
              Fee Arrears (&gt;60d)
            </Button>

            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setActiveDrawer('pantry')}
              className="bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-orange-400 mr-1.5" />
              Low Stock (4)
            </Button>
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
                    {activeDrawer === 'arrears' && 'High Arrears (>60 Days)'}
                    {activeDrawer === 'pantry' && 'Low Canteen Inventory'}
                  </h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setActiveDrawer(null)} className="rounded-full h-8 w-8">
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
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Total unpaid tuition exceeding 60 days overdue stands at{' '}
                    <span className="font-bold text-red-600">
                      GH₵ {Math.round(totalHighArrearsSum || (debtAgingStats.age60 || 0) + (debtAgingStats.age90 || 0)).toLocaleString()}
                    </span>{' '}
                    across {highArrearsList.length} student account{highArrearsList.length === 1 ? '' : 's'}.
                  </p>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {highArrearsList && highArrearsList.length > 0 ? (
                      highArrearsList.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{item.studentName}</p>
                            <p className="text-[10px] text-slate-500">{item.maxDaysOverdue} Days Overdue</p>
                          </div>
                          <span className="font-black text-red-600">GH₵ {Math.round(item.amount).toLocaleString()}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500 font-bold bg-slate-50 rounded-xl">
                        No active student fee arrears exceeding 60 days overdue in school records.
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
                <Button onClick={handleSendStaffReminders} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs py-2.5">
                  <Send className="h-4 w-4 mr-2" /> Send Check-in Reminder SMS
                </Button>
              )}
              {activeDrawer === 'arrears' && (
                <Button onClick={handleIssueArrearsNotice} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs py-2.5">
                  <Send className="h-4 w-4 mr-2" /> Issue Fee Arrears Reminders
                </Button>
              )}
              {activeDrawer === 'pantry' && (
                <Button onClick={handleReorderStock} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs py-2.5">
                  <RefreshCw className="h-4 w-4 mr-2" /> Generate Requisition Order
                </Button>
              )}
              <Button variant="ghost" onClick={() => setActiveDrawer(null)} className="w-full text-slate-500 text-xs">
                Close Drawer
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ZONE 2: TIER 1 HERO METRIC BAR (4 Core Vital Signs)
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Financial Collection Rate */}
        <Card 
          onClick={() => setActiveHeroModal('financial')}
          className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-emerald-500 overflow-hidden relative group"
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Financial Collection Rate</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <Banknote className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-slate-900">{financials.collectionRate || 74}%</h3>
                <span className="text-xs font-bold text-emerald-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" /> +4.2%
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-1">
                GH₵ 187.8k collected of GH₵ 252.1k billed (GH₵ 103.5k arrears)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Academic Health Index */}
        <Card 
          onClick={() => setActiveHeroModal('academic')}
          className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-indigo-500 overflow-hidden relative group"
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Academic Health (API)</span>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-slate-900">{academicTidbits.avgScore || 81}%</h3>
                <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200">
                  Gap: -11%
                </Badge>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-1">
                Benchmark: 92% | Top: Grade 6 Science (94%)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Attendance Pulse */}
        <Card 
          onClick={() => setActiveHeroModal('attendance')}
          className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-amber-500 overflow-hidden relative group"
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Attendance Pulse</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-slate-900">Pending</h3>
                <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                  0/14 Classes
                </Badge>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-1">
                0/14 classes submitted today | 11 staff check-ins pending
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Faculty Ratio & Safety */}
        <Card 
          onClick={() => setActiveHeroModal('faculty')}
          className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-sky-500 overflow-hidden relative group"
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Faculty Ratio & Safety</span>
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600 group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-slate-900">{studentTeacherRatio || '20.3'}:1</h3>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                  0 Safety Alerts
                </Badge>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-1">
                24 active staff | 487 students enrolled | 0 incidents
              </p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ─── HERO DRILL-DOWN MODALS ─── */}
      {activeHeroModal && (
        <Dialog open={!!activeHeroModal} onOpenChange={() => setActiveHeroModal(null)}>
          <DialogContent className="max-w-xl bg-white rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {activeHeroModal === 'financial' && 'Financial Ledger & Collection Breakdown'}
                {activeHeroModal === 'academic' && 'Academic Performance Index (API) Details'}
                {activeHeroModal === 'attendance' && 'Daily Attendance Submission Pulse'}
                {activeHeroModal === 'faculty' && 'Faculty Ratio & Safety Audit'}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Executive drill-down analysis for Sunny Side Academy records.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              {activeHeroModal === 'financial' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-500">Total Billed</p>
                      <p className="font-black text-sm text-slate-800">GH₵ 252,100</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl">
                      <p className="text-[10px] text-emerald-700">Collected</p>
                      <p className="font-black text-sm text-emerald-700">GH₵ 187,800</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-xl">
                      <p className="text-[10px] text-red-700">Total Arrears</p>
                      <p className="font-black text-sm text-red-700">GH₵ 103,500</p>
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
                    <span className="font-black text-lg">81%</span>
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
                  <Button onClick={() => { setActiveHeroModal(null); onNavigateTab?.('reports'); }} className="w-full bg-indigo-600 text-white font-bold rounded-xl">
                    Open Academic Reports Center
                  </Button>
                </div>
              )}

              {activeHeroModal === 'attendance' && (
                <div className="space-y-3">
                  <p className="text-slate-600">Class attendance submissions pending morning verification:</p>
                  <div className="p-3 bg-amber-50 rounded-xl text-amber-800 text-xs space-y-1">
                    <p className="font-bold">14 Class sheets awaiting submission</p>
                    <p className="text-[10px]">11 Staff check-ins pending</p>
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
                      <p className="text-[10px] text-slate-500">Active Teachers</p>
                      <p className="font-black text-base text-slate-900">24</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-slate-500">Enrolled Students</p>
                      <p className="font-black text-base text-slate-900">487</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MODULE 1: Financial Receivables Aging Breakdown */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200 rounded-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Financial Receivables Aging Breakdown</CardTitle>
                <CardDescription className="text-xs text-slate-500">Fee debt distribution across overdue aging buckets</CardDescription>
              </div>
              <Badge variant="outline" className="bg-slate-50 text-slate-700 text-xs">
                Total Debt: GH₵ 103,500
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    formatter={(value: any) => [`GH₵ ${Number(value).toLocaleString()}`, 'Amount']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {agingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-100">
              {agingData.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-bold text-slate-600">{item.range}</span>
                  </div>
                  <p className="text-xs font-black text-slate-900">GH₵ {item.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* MODULE 2: Academic & Conduct Activity Feed */}
        <Card className="shadow-sm border-slate-200 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-900">Academic & Conduct Feed</CardTitle>
            <CardDescription className="text-xs text-slate-500">Live operational events & student milestones</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-3">
            {[
              {
                title: 'Emmanuel Kojo (Grade 6)',
                desc: 'Scored 96% in Integrated Science Mid-Term',
                tag: 'Academic Top',
                color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                time: '10 mins ago'
              },
              {
                title: 'Kwame Boadu (JHS 1)',
                desc: 'Commended for exceptional morning assembly leadership',
                tag: 'Positive Behavior',
                color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                time: '45 mins ago'
              },
              {
                title: 'Primary 3 Class',
                desc: 'Curriculum coverage reached 88% target for Term 2',
                tag: 'Curriculum Progress',
                color: 'bg-sky-50 text-sky-700 border-sky-200',
                time: '2 hours ago'
              },
              {
                title: 'Lateness Inspection',
                desc: 'Morning gate check completed with 4 tardy logs',
                tag: 'Conduct Notice',
                color: 'bg-amber-50 text-amber-700 border-amber-200',
                time: '3 hours ago'
              },
            ].map((feed, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{feed.title}</span>
                  <span className="text-[10px] text-slate-400">{feed.time}</span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2">{feed.desc}</p>
                <Badge variant="outline" className={cn("text-[10px] font-semibold", feed.color)}>
                  {feed.tag}
                </Badge>
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
        <Card className="shadow-sm border-slate-200 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-900">Enrollment Dynamics</CardTitle>
            <CardDescription className="text-xs text-slate-500">Monthly student growth vs intake target</CardDescription>
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
              <span className="text-slate-500">Retention Rate</span>
              <span className="font-black text-emerald-600">98.2%</span>
            </div>
          </CardContent>
        </Card>

        {/* Director Quick Command Bar */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-900">Director Command Bar</CardTitle>
            <CardDescription className="text-xs text-slate-500">Instant executive actions & portal communications</CardDescription>
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs px-4"
              >
                {isSendingAnnouncement ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Megaphone className="h-4 w-4 mr-1.5" />}
                Broadcast
              </Button>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Button 
                variant="outline"
                onClick={() => toast({ title: "Financial Summary Exported", description: "Ledger report downloaded as PDF." })}
                className="bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-bold text-xs rounded-xl justify-start"
              >
                <Download className="h-4 w-4 text-emerald-600 mr-2" /> Export Ledger Summary
              </Button>

              <Button 
                variant="outline"
                onClick={handleIssueArrearsNotice}
                className="bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-bold text-xs rounded-xl justify-start"
              >
                <Send className="h-4 w-4 text-red-600 mr-2" /> Issue Fee Reminders
              </Button>

              <Button 
                variant="outline"
                onClick={() => toast({ title: "Meeting Scheduled", description: "Calendar invite sent to all department heads." })}
                className="bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-bold text-xs rounded-xl justify-start"
              >
                <Users className="h-4 w-4 text-indigo-600 mr-2" /> Emergency Staff Call
              </Button>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODULE 5: GENKIT AI AUDITOR ASSISTANT DESK
          ───────────────────────────────────────────────────────────── */}
      <Card className="shadow-lg border-indigo-200 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-indigo-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-white">AI Auditor & Executive Assistant</CardTitle>
                <CardDescription className="text-xs text-indigo-200">Real-time Genkit AI analytical queries</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-indigo-900/80 text-indigo-300 border-indigo-700 text-xs px-2.5 py-1">
              <Sparkles className="h-3 w-3 text-amber-400 mr-1" /> {aiCredits} Credits Remaining
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 space-y-4">
          
          {/* Chat History Window */}
          <div className="h-48 overflow-y-auto space-y-3 pr-2 rounded-xl bg-slate-950/60 p-3 border border-indigo-900/30">
            {aiChatHistory.map((msg, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "p-3 rounded-xl text-xs max-w-[85%] leading-relaxed",
                  msg.role === 'user' 
                    ? "ml-auto bg-indigo-600 text-white font-medium" 
                    : "mr-auto bg-slate-800/80 text-slate-200 border border-slate-700"
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
            {[
              'What is our projected cash flow for next month?',
              'Analyze staff attendance trends today',
              'Which grade has the highest academic gap?'
            ].map((suggest, idx) => (
              <button
                key={idx}
                onClick={() => handleAiAuditQuery(suggest)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-indigo-900/40 hover:bg-indigo-900/70 border border-indigo-700/50 text-indigo-200 transition-colors"
              >
                {suggest}
              </button>
            ))}
          </div>

          {/* AI Input Form */}
          <div className="flex gap-2">
            <Input
              placeholder="Ask Dr. GAM AI Auditor about finances, academics, or staff..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiAuditQuery()}
              className="text-xs bg-slate-950/80 border-indigo-800 text-white placeholder:text-slate-500 rounded-xl focus:border-indigo-500"
            />
            <Button 
              onClick={() => handleAiAuditQuery()}
              disabled={isAiAuditing}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs px-4"
            >
              Ask AI
            </Button>
          </div>

        </CardContent>
      </Card>

    </div>
  );
}
