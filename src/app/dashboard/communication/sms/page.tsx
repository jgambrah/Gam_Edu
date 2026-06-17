'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { sendSchoolSMSAction } from '@/app/actions/sms'; 
import { sendSchoolWhatsApp } from '@/app/actions/whatsapp';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Loader2, Send, Users, Filter, Search, AlertCircle, Sparkles, 
  CheckCircle2, MessageSquare, Check, X, ShieldAlert, BadgeInfo,
  Layers, Settings, Sparkle, AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSMSDraftAction } from '@/app/actions/sms-ai';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FinancialRecord, Student, Class } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ParentRecipient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  studentIds?: string[];
}

const QUICK_SMS_TEMPLATES = [
  {
    title: "Fees Reminder",
    topic: "Outstanding Fee Statement Notice",
    text: "Dear Parent, this is a friendly reminder that school fees for this term are overdue. Please visit the accounts dashboard to view statement details and settle outstanding arrears. Thank you.",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200/50 hover:bg-amber-100/40"
  },
  {
    title: "Weather Alert",
    topic: "School Operations Suspended due to Inclement Weather",
    text: "Dear Parent, due to heavy rainfall and active flood warnings, school operations will be suspended tomorrow. Classes will run online via the student portal. Stay safe.",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200/50 hover:bg-blue-100/40"
  },
  {
    title: "PTA Meeting",
    topic: "General PTA Assembly Invitation",
    text: "Dear Parent, you are cordially invited to our General PTA Assembly this Saturday at 10:00 AM in the school hall. We will align on administrative schedules. Warm regards.",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200/50 hover:bg-indigo-100/40"
  },
  {
    title: "Urgent Notice",
    topic: "General School Operations Update",
    text: "Dear Parent, please review the urgent administrative notice posted on the general dashboard regarding calendar adjustments and event dates. School Management.",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200/50 hover:bg-rose-100/40"
  }
];

export default function BulkSMSPage() {
  const { schoolId } = useCurrentSchool();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [message, setMessage] = useState('');
  const [targetGroup, setTargetGroup] = useState('all'); 
  const [selectedParents, setSelectedParents] = useState<string[]>([]); 
  const [channel, setChannel] = useState<'sms' | 'whatsapp'>('sms');
  const [mode, setMode] = useState<'bulk' | 'manual'>('bulk'); 

  // AI Prompt Drawer State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState<'formal' | 'urgent' | 'friendly'>('formal');
  const [isGenerating, setIsGenerating] = useState(false);

  // Manual Selection Search State
  const [manualSearch, setManualSearch] = useState('');

  // Transmission Progress Console States
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastTotal, setBroadcastTotal] = useState(0);
  const [broadcastCurrent, setBroadcastCurrent] = useState(0);
  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [broadcastStatusText, setBroadcastStatusText] = useState('');
  const [broadcastLogs, setBroadcastLogs] = useState<string[]>([]);
  const [isBroadcastCompleted, setIsBroadcastCompleted] = useState(false);

  // School Settings for API Keys Verification
  const schoolSettingsRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
  const { data: schoolSettings } = useDoc<any>(schoolSettingsRef as any);

  // Data Fetching
  const parentsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'parents'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: parents } = useCollection<ParentRecipient>(parentsQuery);

  const studentsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: students } = useCollection<Student>(studentsQuery);
  
  const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: classes } = useCollection<Class>(classesQuery);

  const financialRecordsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId), where('status', 'in', ['Unpaid', 'Overdue'])) : null, [firestore, schoolId]);
  const { data: financialRecords } = useCollection<FinancialRecord>(financialRecordsQuery);

  // Filter Logic (Bulk Targets)
  const bulkTargets = useMemo(() => {
    if (!parents || !students) return [];

    if (targetGroup === 'all') return parents;
    
    if (targetGroup === 'debtors') {
        if (!financialRecords) return [];
        
        const debtorStudentIds = new Set(financialRecords
            .filter(r => r.status === 'Unpaid' || r.status === 'Overdue')
            .map(r => r.studentId));
            
        return parents.filter(p => 
            p.studentIds?.some((sid: string) => debtorStudentIds.has(sid))
        );
    }
    
    if (targetGroup.startsWith('class_')) {
        const classId = targetGroup.replace('class_', '');
        const studentIdsInClass = students.filter(s => s.classId === classId).map(s => s.uid);
        return parents.filter(p => p.studentIds?.some((sid: string) => studentIdsInClass.includes(sid)));
    }
    
    return [];
  }, [parents, students, targetGroup, financialRecords]);

  // Filter Logic (Manual Selection)
  const filteredManualParents = useMemo(() => {
    if (!parents) return [];
    if (!manualSearch.trim()) return parents;
    const searchTerm = manualSearch.toLowerCase();
    return parents.filter(p =>
      (p.firstName?.toLowerCase() || '').includes(searchTerm) ||
      (p.lastName?.toLowerCase() || '').includes(searchTerm) ||
      (p.phone || '').includes(searchTerm)
    );
  }, [parents, manualSearch]);

  // Final Selected Recipient List
  const finalRecipients = mode === 'bulk' ? bulkTargets : parents?.filter(p => selectedParents.includes(p.id)) || [];

  const handleSend = async () => {
    if (finalRecipients.length === 0 || !schoolId) return;

    setIsBroadcasting(true);
    setBroadcastTotal(finalRecipients.length);
    setBroadcastCurrent(0);
    setBroadcastProgress(0);
    setIsBroadcastCompleted(false);
    setBroadcastStatusText("Initiating institutional gateway dispatches...");
    setBroadcastLogs([
      `[INFO] Starting bulk campaign dispatches via ${channel.toUpperCase()}...`,
      `[INFO] Targeting ${finalRecipients.length} parental numbers.`
    ]);

    let count = 0;
    let failCount = 0;

    for (let i = 0; i < finalRecipients.length; i++) {
        const parent = finalRecipients[i];
        const phone = parent.phone;
        const parentName = `${parent.firstName} ${parent.lastName}`;

        setBroadcastCurrent(i + 1);
        setBroadcastProgress(Math.round(((i + 1) / finalRecipients.length) * 100));
        setBroadcastStatusText(`Delivering message to ${parentName}...`);

        if (phone) {
            try {
                if (channel === 'whatsapp') {
                    const res = await sendSchoolWhatsApp(schoolId, phone, message);
                    if (res.success) {
                        count++;
                        setBroadcastLogs(prev => [...prev, `[SUCCESS] WhatsApp delivered to ${parentName} (${phone})`]);
                    } else {
                        failCount++;
                        setBroadcastLogs(prev => [...prev, `[ERROR] WhatsApp failed for ${parentName}: ${res.error || 'Gateway Timeout'}`]);
                    }
                } else {
                    const res = await sendSchoolSMSAction(schoolId, phone, message);
                    if (res.success) {
                        count++;
                        setBroadcastLogs(prev => [...prev, `[SUCCESS] SMS delivered to ${parentName} (${phone})`]);
                    } else {
                        failCount++;
                        setBroadcastLogs(prev => [...prev, `[ERROR] SMS failed for ${parentName}: ${res.error || 'Gateway Reject'}`]);
                    }
                }
            } catch (err: any) {
                failCount++;
                setBroadcastLogs(prev => [...prev, `[FATAL] Gateway Error for ${parentName}: ${err.message}`]);
            }
        } else {
            failCount++;
            setBroadcastLogs(prev => [...prev, `[SKIP] Parent ${parentName} has no registered phone number.`]);
        }
    }

    setIsBroadcastCompleted(true);
    setBroadcastStatusText("Campaign dispatches completed.");
    setBroadcastLogs(prev => [
      ...prev,
      `[INFO] Transmission sequence finished. Delivered: ${count}, Failed: ${failCount}`
    ]);
    
    toast({ 
        title: "Broadcast Complete", 
        description: `Successfully sent ${count} messages via ${channel.toUpperCase()}.` 
    });
    setMessage('');
    setSelectedParents([]);
  };

  const toggleParent = (id: string) => {
      setSelectedParents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateSMSDraftAction(aiTopic, aiTone);
      if (res.success && res.text) {
          setMessage(res.text);
          setIsAiOpen(false);
          toast({ title: 'AI Assistant', description: 'Draft copywriter alert generated!' });
      } else {
          toast({ variant: 'destructive', title: 'AI Error', description: 'Could not generate draft.' });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'AI Error', description: err.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const isConfigured = channel === 'sms' 
    ? schoolSettings?.enableSms 
    : schoolSettings?.enableWhatsApp;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 font-sans">
        
        {/* Dynamic Executive Banner */}
        <div className={cn(
          "p-8 text-white relative overflow-hidden rounded-[2.5rem] shadow-xl border border-white/10 transition-all duration-750 ease-in-out",
          channel === 'sms'
            ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 shadow-blue-100/40"
            : "bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 shadow-emerald-100/40"
        )}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_rgba(255,255,255,0))] pointer-events-none" />
            <h1 className="text-3xl font-black uppercase italic tracking-tight flex items-center gap-3">
              <Send className="h-8 w-8 animate-pulse shrink-0" />
              Communication Gateway Hub
            </h1>
            <p className="text-white/85 text-xs font-semibold mt-1.5 max-w-xl leading-relaxed">
              Dispatch bulk text alerts or rich instant messages directly to your student body's parent base. Instantly target specific classes, overdue debtors, or search individual custom recipient tags.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: Target Configuration */}
            <div className="lg:col-span-7 space-y-6">
                
                {/* 1. CHANNEL SELECTOR */}
                <Card className="rounded-[2rem] border border-slate-150 shadow-md bg-white overflow-hidden">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-slate-800 text-base font-black uppercase tracking-tight flex items-center gap-2">
                        <Layers className="h-4.5 w-4.5 text-indigo-500" />
                        Step 1: Choose Output Gateway
                      </CardTitle>
                      <CardDescription className="text-xs font-semibold text-slate-400">
                        Select the transmission medium for this notification.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                          {/* Standard SMS Card */}
                          <button
                              type="button"
                              onClick={() => setChannel('sms')}
                              className={cn(
                                  "p-5 border rounded-2xl cursor-pointer text-left flex flex-col justify-between h-[120px] transition-all hover:scale-102 active:scale-98 relative overflow-hidden",
                                  channel === 'sms' 
                                      ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/15 shadow-md shadow-blue-100/40" 
                                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40"
                              )}
                          >
                              <div className="flex justify-between items-start w-full">
                                  <div className={cn("p-2 rounded-xl", channel === 'sms' ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-400")}>
                                      <MessageSquare className="h-5 w-5" />
                                  </div>
                                  {channel === 'sms' && (
                                      <span className="h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center animate-in zoom-in-50">
                                          <Check className="h-3.5 w-3.5" />
                                      </span>
                                  )}
                              </div>
                              <div>
                                  <h3 className="font-bold text-xs text-slate-800 uppercase tracking-tight">Standard SMS Gateway</h3>
                                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Direct telecom cellular text delivery.</p>
                              </div>
                          </button>

                          {/* WhatsApp Card */}
                          <button
                              type="button"
                              onClick={() => setChannel('whatsapp')}
                              className={cn(
                                  "p-5 border rounded-2xl cursor-pointer text-left flex flex-col justify-between h-[120px] transition-all hover:scale-102 active:scale-98 relative overflow-hidden",
                                  channel === 'whatsapp' 
                                      ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/15 shadow-md shadow-emerald-100/40" 
                                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40"
                              )}
                          >
                              <div className="flex justify-between items-start w-full">
                                  <div className={cn("p-2 rounded-xl", channel === 'whatsapp' ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400")}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                                  </div>
                                  {channel === 'whatsapp' && (
                                      <span className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center animate-in zoom-in-50">
                                          <Check className="h-3.5 w-3.5" />
                                      </span>
                                  )}
                              </div>
                              <div>
                                  <h3 className="font-bold text-xs text-slate-800 uppercase tracking-tight">WhatsApp Business</h3>
                                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Rich text instant message alerts.</p>
                              </div>
                          </button>
                      </div>
                    </CardContent>
                </Card>

                {/* 2. RECIPIENTS TARGET PANEL */}
                <Card className="rounded-[2rem] border border-slate-150 shadow-md bg-white overflow-hidden">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-slate-800 text-base font-black uppercase tracking-tight flex items-center gap-2">
                        <Users className="h-4.5 w-4.5 text-indigo-500" />
                        Step 2: Choose Target Audience
                      </CardTitle>
                      <CardDescription className="text-xs font-semibold text-slate-400">
                        Filter parents by academic groups or search individually.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs value={mode} onValueChange={(v) => setMode(v as 'bulk' | 'manual')} className="w-full">
                          <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-50 border border-slate-150 rounded-xl mb-5">
                              <TabsTrigger value="bulk" className="rounded-lg py-2 text-xs font-black uppercase tracking-wider">Bulk Segments</TabsTrigger>
                              <TabsTrigger value="manual" className="rounded-lg py-2 text-xs font-black uppercase tracking-wider">Individual Selection</TabsTrigger>
                          </TabsList>

                          <TabsContent value="bulk" className="space-y-4 outline-none">
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <Filter className="h-3.5 w-3.5 text-slate-500" /> 
                                    Target Group Selection
                                  </label>
                                  <Select value={targetGroup} onValueChange={setTargetGroup}>
                                      <SelectTrigger className="h-11 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50/50">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="rounded-xl">
                                          <SelectItem value="all" className="text-xs">All Registered Parents ({parents?.length || 0})</SelectItem>
                                          <SelectItem value="debtors" className="text-xs">Outstanding Debtors ({financialRecords?.length || 0} bills pending)</SelectItem>
                                          {classes?.map(c => (
                                            <SelectItem key={c.id} value={`class_${c.id}`} className="text-xs">
                                              Class: {c.name}
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                              </div>

                              {/* Target estimation card */}
                              <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100 flex items-center gap-4.5">
                                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-650 flex items-center justify-center shrink-0">
                                    <BadgeInfo className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-black uppercase tracking-tight text-slate-700">Estimated Target Size</h4>
                                    <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                                      This segment targets approximately <span className="text-indigo-600 font-extrabold">{bulkTargets.length} parents</span>.
                                    </p>
                                  </div>
                              </div>
                          </TabsContent>

                          <TabsContent value="manual" className="space-y-4 outline-none">
                              <div className="relative">
                                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                  <Input
                                      placeholder="Search parents by name or phone..."
                                      value={manualSearch}
                                      onChange={(e) => setManualSearch(e.target.value)}
                                      className="pl-10 h-10 rounded-xl text-xs font-semibold border-slate-200"
                                  />
                              </div>

                              <div className="border border-slate-150 rounded-2xl h-[260px] overflow-y-auto p-2.5 space-y-1.5 bg-slate-50/20">
                                  {filteredManualParents.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 gap-2">
                                      <Search className="h-8 w-8 opacity-30" />
                                      <p className="text-xs font-bold text-slate-450">No parents match search criteria.</p>
                                    </div>
                                  ) : (
                                    filteredManualParents.map(p => {
                                        const isSelected = selectedParents.includes(p.id);
                                        const avatarChar = p.firstName?.[0] || 'P';
                                        return (
                                            <div 
                                                key={p.id} 
                                                className={cn(
                                                  "flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl cursor-pointer border transition-all duration-200",
                                                  isSelected ? "bg-white border-indigo-200 shadow-sm" : "bg-transparent border-transparent"
                                                )}
                                                onClick={() => toggleParent(p.id)}
                                            >
                                                <div className="flex items-center space-x-3 min-w-0">
                                                    <Checkbox checked={isSelected} className="rounded-md" />
                                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-650 shrink-0 uppercase">
                                                      {avatarChar}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-slate-700 truncate">{p.firstName} {p.lastName}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.phone}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded border">
                                                  Parent
                                                </span>
                                            </div>
                                        );
                                    })
                                  )}
                              </div>
                              
                              <div className="flex justify-between items-center bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 text-xs shrink-0">
                                  <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Manual Target Total</span>
                                  <span className="font-extrabold text-indigo-650">{selectedParents.length} parent{selectedParents.length !== 1 ? 's' : ''} selected</span>
                              </div>
                          </TabsContent>
                      </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT COLUMN: Message Composer & Settings */}
            <div className="lg:col-span-5 space-y-6">
                
                {/* 3. MESSAGE COMPOSER */}
                <Card className="rounded-[2rem] border border-slate-150 shadow-md bg-white overflow-hidden h-fit">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-slate-800 text-base font-black uppercase tracking-tight flex items-center gap-2">
                        <MessageSquare className="h-4.5 w-4.5 text-indigo-500" />
                        Step 3: Composer Console
                      </CardTitle>
                      <CardDescription className="text-xs font-semibold text-slate-400">
                        Draft your broadcast announcement text.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {/* Selected channel stats */}
                        <div className="grid grid-cols-2 gap-3.5">
                            <div className={cn(
                              "p-3 rounded-2xl border text-center relative",
                              channel === 'sms' ? "bg-blue-50/40 border-blue-100 text-blue-700" : "bg-emerald-50/40 border-emerald-100 text-emerald-700"
                            )}>
                              <p className="text-[9px] font-black uppercase opacity-75 tracking-wider leading-none">Gateway</p>
                              <p className="text-xs font-extrabold mt-1.5 uppercase tracking-wide leading-none">{channel}</p>
                            </div>
                            <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/30 text-center">
                              <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider leading-none">Total Recipients</p>
                              <p className="text-xs font-extrabold text-slate-800 mt-1.5 leading-none">{finalRecipients.length}</p>
                            </div>
                        </div>

                        {/* Templates Chips */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Quick Presets</label>
                            <div className="flex flex-wrap gap-1.5">
                                {QUICK_SMS_TEMPLATES.map(tpl => (
                                    <button
                                        key={tpl.title}
                                        type="button"
                                        onClick={() => setMessage(tpl.text)}
                                        className={cn(
                                            "px-2.5 py-1 rounded-lg border text-[8px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95",
                                            tpl.badgeColor
                                        )}
                                    >
                                        {tpl.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Message Content</label>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 h-7 gap-1 font-bold text-[10px] uppercase tracking-wider rounded-lg px-2" 
                                  onClick={() => setIsAiOpen(true)}
                                >
                                    <Sparkles className="h-3 w-3 animate-pulse"/> AI Draft Copier
                                </Button>
                            </div>
                            <Textarea 
                                placeholder="Dear Parent, we would like to notify you that..." 
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows={6}
                                className="resize-none rounded-xl border border-slate-200 text-xs font-semibold p-3.5 bg-slate-50/20 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all leading-relaxed"
                            />
                            {channel === 'sms' && (
                              <p className="text-[9px] text-right font-black uppercase text-slate-400 mt-1">
                                  {message.length} chars · <span className="text-slate-700">{Math.ceil(message.length / 160)} SMS units</span>
                              </p>
                            )}
                        </div>

                        {/* WARNING IF CHANNEL NOT CONFIGURED */}
                        {!isConfigured && (
                            <div className="bg-amber-50 text-amber-800 p-4 rounded-2xl border border-amber-200 text-xs flex items-start gap-3 animate-in fade-in">
                                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                                <div>
                                    <strong className="font-extrabold uppercase tracking-tight text-[10px]">Gateway API Keys Missing</strong>
                                    <p className="mt-1 font-semibold leading-relaxed text-amber-700">
                                      {channel === 'sms' 
                                        ? "Configure your Arkesel or Hubtel SMS keys in School settings to enable dispatch."
                                        : "Configure your WhatsApp UltraMsg credentials in settings to enable dispatch."
                                      }
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        <Button 
                            onClick={handleSend} 
                            disabled={!isConfigured || !message.trim() || finalRecipients.length === 0} 
                            className={cn(
                              "w-full transition-all active:scale-97 hover:scale-102 py-5 font-black text-xs uppercase tracking-widest border-none rounded-xl shadow-md", 
                              channel === 'whatsapp' 
                                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-green-100" 
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-100"
                            )}
                        >
                            <Send className="mr-2 h-4 w-4 shrink-0"/>
                            Send Campaign via {channel}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* --- AI message generator dialog --- */}
        <Dialog open={isAiOpen} onOpenChange={setIsAiOpen}>
          <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 pb-8 text-white relative">
                <DialogHeader>
                  <DialogTitle className="text-white text-xl font-black uppercase italic tracking-tight flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-white animate-pulse" />
                    AI SMS Message Copier
                  </DialogTitle>
                </DialogHeader>
                <p className="text-purple-200 text-xs font-semibold mt-1">Generate polished messages matching school guidelines.</p>
            </div>

            <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-slate-450">Announcements Prompt Topic</Label>
                    <Input 
                      placeholder="e.g. Closure next Monday due to regional assembly assembly..." 
                      value={aiTopic} 
                      onChange={e => setAiTopic(e.target.value)} 
                      className="h-10 rounded-xl text-xs font-semibold border-slate-200"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-slate-455">Tone of Copywriting</Label>
                    <RadioGroup value={aiTone} onValueChange={(v: any) => setAiTone(v)} className="grid grid-cols-3 gap-2">
                        <div className="flex items-center space-x-2 border border-slate-150 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
                          <RadioGroupItem value="formal" id="tone-formal" />
                          <Label htmlFor="tone-formal" className="text-xs cursor-pointer font-bold">Formal</Label>
                        </div>
                        <div className="flex items-center space-x-2 border border-slate-150 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
                          <RadioGroupItem value="friendly" id="tone-friendly" />
                          <Label htmlFor="tone-friendly" className="text-xs cursor-pointer font-bold">Friendly</Label>
                        </div>
                        <div className="flex items-center space-x-2 border border-slate-150 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
                          <RadioGroupItem value="urgent" id="tone-urgent" />
                          <Label htmlFor="tone-urgent" className="text-xs cursor-pointer font-bold text-rose-650">Urgent</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-2 border-t shrink-0">
                <Button variant="outline" onClick={() => setIsAiOpen(false)} disabled={isGenerating} className="rounded-xl h-10 px-4 text-xs font-bold text-slate-500">
                    Cancel
                </Button>
                <Button onClick={handleAiGenerate} disabled={isGenerating || !aiTopic.trim()} className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-xl h-10 px-5 font-black text-xs uppercase tracking-wider shadow-md shadow-purple-100 flex items-center gap-1.5 border-none">
                    {isGenerating ? <Loader2 className="animate-spin h-3.5 w-3.5"/> : <Sparkle className="h-3.5 w-3.5"/>}
                    Generate Copy
                </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* --- DYNAMIC TRANSMISSION CONSOLE LOG DIALOG --- */}
        <Dialog open={isBroadcasting} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-[460px] p-6 rounded-3xl border-0 shadow-2xl bg-slate-950 text-white text-center font-sans">
                
                {/* SVG circular progress ring */}
                <div className="relative h-28 w-28 mx-auto flex items-center justify-center mt-3">
                    <svg className="h-full w-full rotate-270 transform">
                        <circle
                            cx="56"
                            cy="56"
                            r="36"
                            stroke="currentColor"
                            strokeWidth="6"
                            className="text-slate-800"
                            fill="transparent"
                        />
                        <circle
                            cx="56"
                            cy="56"
                            r="36"
                            stroke={channel === 'whatsapp' ? 'url(#whatsapp-progress-gradient)' : 'url(#sms-progress-gradient)'}
                            strokeWidth="6"
                            className="transition-all duration-300"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 36}
                            strokeDashoffset={(2 * Math.PI * 36) - (broadcastProgress / 100) * (2 * Math.PI * 36)}
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id="sms-progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                            <linearGradient id="whatsapp-progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                        </defs>
                    </svg>
                    
                    <div className="absolute flex flex-col items-center justify-center">
                        {isBroadcastCompleted ? (
                            <CheckCircle2 className="h-8 w-8 text-emerald-400 animate-in zoom-in-50 duration-300" />
                        ) : (
                            <span className="text-lg font-black text-white font-mono leading-none">{broadcastProgress}%</span>
                        )}
                    </div>
                </div>

                <div className="space-y-1.5 mt-2">
                    <DialogTitle className="text-white text-base font-black uppercase tracking-tight">
                        {isBroadcastCompleted ? 'Campaign Completed' : 'Transmitting Alerts'}
                    </DialogTitle>
                    <p className="text-slate-450 text-[10px] font-black uppercase tracking-widest font-mono">
                        Recipient {broadcastCurrent} of {broadcastTotal}
                    </p>
                </div>

                {/* Real-time Logger Console */}
                <div className="bg-black/60 border border-slate-900 rounded-2xl p-4 h-[150px] overflow-y-auto text-left font-mono text-[9px] leading-relaxed text-slate-300 space-y-1 shadow-inner select-none mt-2">
                    {broadcastLogs.map((log, index) => {
                        const isError = log.includes('[ERROR]') || log.includes('[FATAL]');
                        const isSuccess = log.includes('[SUCCESS]');
                        const isSkip = log.includes('[SKIP]');
                        return (
                            <div key={index} className={cn(
                                "flex items-start gap-1.5",
                                isError ? "text-rose-400" : isSuccess ? "text-emerald-400" : isSkip ? "text-amber-400" : "text-slate-400"
                            )}>
                                <span className="opacity-70">[{index + 1}]</span>
                                <span className="break-all">{log}</span>
                            </div>
                        );
                    })}
                </div>

                <p className={cn(
                    "text-xs font-bold italic mt-3 animate-pulse uppercase tracking-wider leading-none",
                    isBroadcastCompleted ? "text-emerald-400" : "text-slate-450"
                )}>
                    {broadcastStatusText}
                </p>

                {/* Bottom Trigger button on complete */}
                {isBroadcastCompleted && (
                    <div className="pt-2">
                        <Button 
                            onClick={() => {
                              setIsBroadcasting(false);
                              setIsBroadcastCompleted(false);
                            }}
                            className={cn(
                              "w-full text-white font-black text-xs uppercase tracking-widest rounded-xl py-3 active:scale-97 hover:scale-102 transition-all duration-200 border-none h-11 shadow-md",
                              channel === 'whatsapp' 
                                ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            )}
                        >
                            Dismiss Console
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    </div>
  );
}
