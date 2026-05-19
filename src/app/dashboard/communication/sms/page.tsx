'use client';

import { useState, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { sendSMSAction } from '@/app/actions/sms';
import { sendSchoolWhatsApp } from '@/app/actions/whatsapp';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Send, Users, Filter, Search, AlertCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSMSDraftAction } from '@/app/actions/sms-ai';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FinancialRecord, Student, Class } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function BulkSMSPage() {
  const { schoolId } = useCurrentSchool();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [message, setMessage] = useState('');
  const [targetGroup, setTargetGroup] = useState('all'); 
  const [selectedParents, setSelectedParents] = useState<string[]>([]); // Array of Parent IDs
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState('bulk'); // 'bulk' or 'manual'
  const [channel, setChannel] = useState<'sms' | 'whatsapp'>('sms');

  // AI Dialog State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState<'formal' | 'urgent' | 'friendly'>('formal');
  const [isGenerating, setIsGenerating] = useState(false);

  // Manual Selection Search State
  const [manualSearch, setManualSearch] = useState('');

  // School Settings for WhatsApp
  const schoolSettingsRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
  const { data: schoolSettings } = useDoc<any>(schoolSettingsRef as any);

  // Data Fetching
  const parentsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'parents'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: parents } = useCollection(parentsQuery);

  const studentsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: students } = useCollection<Student>(studentsQuery);
  
  const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: classes } = useCollection<Class>(classesQuery);

  const financialRecordsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId), where('status', 'in', ['Unpaid', 'Overdue'])) : null, [firestore, schoolId]);
  const { data: financialRecords } = useCollection<FinancialRecord>(financialRecordsQuery);

  // Filter Logic (Bulk)
  const bulkTargets = useMemo(() => {
    if (!parents || !students) return [];

    if (targetGroup === 'all') return parents;
    
    if (targetGroup === 'debtors') {
        if (!financialRecords) return [];
        
        const debtorStudentIds = new Set(financialRecords
            .filter(r => r.status === 'Unpaid' || r.status === 'Overdue')
            .map(r => r.studentId));
            
        return parents.filter(p => 
            (p as any).studentIds?.some((sid: string) => debtorStudentIds.has(sid))
        );
    }
    
    if (targetGroup.startsWith('class_')) {
        const classId = targetGroup.replace('class_', '');
        const studentIdsInClass = students.filter(s => s.classId === classId).map(s => s.uid);
        return parents.filter(p => (p as any).studentIds?.some((sid: string) => studentIdsInClass.includes(sid)));
    }
    
    return [];
  }, [parents, students, targetGroup, financialRecords]);

  const filteredManualParents = useMemo(() => {
    if (!parents) return [];
    if (!manualSearch.trim()) return parents;
    const searchTerm = manualSearch.toLowerCase();
    return parents.filter(p =>
      ((p as any).firstName?.toLowerCase() || '').includes(searchTerm) ||
      ((p as any).lastName?.toLowerCase() || '').includes(searchTerm) ||
      ((p as any).phone || '').includes(searchTerm)
    );
  }, [parents, manualSearch]);

  // Final Recipient List
  const finalRecipients = mode === 'bulk' ? bulkTargets : parents?.filter(p => selectedParents.includes((p as any).id)) || [];

  const handleSend = async () => {
    if (finalRecipients.length === 0 || !schoolId) return;
    setSending(true);
    let count = 0;
    let failCount = 0;

    for (const parent of finalRecipients) {
        if ((parent as any).phone) {
            if (channel === 'whatsapp') {
                const res = await sendSchoolWhatsApp(schoolId, (parent as any).phone, message);
                if (res.success) count++; else failCount++;
            } else {
                await sendSMSAction((parent as any).phone, message);
                count++;
            }
        }
    }

    setSending(false);
    toast({ 
        title: "Broadcast Complete", 
        description: `Successfully sent ${count} messages via ${channel.toUpperCase()}. ${failCount > 0 ? `Failed: ${failCount}` : ''}` 
    });
    setMessage('');
    setSelectedParents([]);
  };

  const toggleParent = (id: string) => {
      setSelectedParents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    const res = await generateSMSDraftAction(aiTopic, aiTone);
    if (res.success && res.text) {
        setMessage(res.text);
        setIsAiOpen(false);
    } else {
        toast({ variant: 'destructive', title: 'AI Error', description: 'Could not generate draft.' });
    }
    setIsGenerating(false);
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <Send className="h-8 w-8 text-blue-600" /> Communication Hub
            </h1>
            <p className="text-muted-foreground mt-1">Send bulk alerts via SMS or WhatsApp.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LEFT: SELECTION */}
            <Card className="md:col-span-2">
                <CardHeader><CardTitle>Recipients & Channel</CardTitle></CardHeader>
                <CardContent>
                    {/* CHANNEL SELECTOR */}
                    <div className="space-y-4 mb-6">
                        <label className="text-sm font-medium">Communication Channel</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div 
                                onClick={() => setChannel('sms')}
                                className={cn(
                                    "p-4 border-2 rounded-xl cursor-pointer text-center flex flex-col items-center transition-all",
                                    channel === 'sms' ? 'border-blue-50 bg-blue-50 ring-2 ring-blue-500' : 'border-slate-200 hover:border-blue-200'
                                )}
                            >
                                <Send className={cn("h-6 w-6 mb-2", channel === 'sms' ? 'text-blue-600' : 'text-slate-400')}/>
                                <h3 className="font-bold text-slate-700">Standard SMS</h3>
                                <p className="text-xs text-slate-500">Traditional text message</p>
                            </div>

                            <div 
                                onClick={() => setChannel('whatsapp')}
                                className={cn(
                                    "p-4 border-2 rounded-xl cursor-pointer text-center flex flex-col items-center transition-all",
                                    channel === 'whatsapp' ? 'border-green-50 bg-green-50 ring-2 ring-green-500' : 'border-slate-200 hover:border-green-200'
                                )}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("mb-2", channel === 'whatsapp' ? 'text-green-600' : 'text-slate-400')}><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                                <h3 className="font-bold text-slate-700">WhatsApp</h3>
                                <p className="text-xs text-slate-500">Rich text & alerts</p>
                            </div>
                        </div>

                        {/* WARNING IF WHATSAPP NOT CONFIGURED */}
                        {channel === 'whatsapp' && !schoolSettings?.enableWhatsApp && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm flex items-start gap-3 animate-in slide-in-from-top-2">
                                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                <div>
                                    <strong>WhatsApp API Not Configured.</strong>
                                    <p className="mt-1">Your school has not linked an UltraMsg API account. Please contact the Platform Administrator to purchase an API key and configure it in your School Profile settings.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <Tabs value={mode} onValueChange={(value) => setMode(value as 'bulk' | 'manual')} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="bulk">Bulk Groups</TabsTrigger>
                            <TabsTrigger value="manual">Select Individuals</TabsTrigger>
                        </TabsList>

                        <TabsContent value="bulk" className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2"><Filter className="h-4 w-4"/> Target Audience</label>
                                <Select value={targetGroup} onValueChange={setTargetGroup}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Parents ({parents?.length || 0})</SelectItem>
                                        <SelectItem value="debtors">Parents Owing Fees</SelectItem>
                                        {classes?.map(c => <SelectItem key={c.id} value={`class_${c.id}`}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>

                        <TabsContent value="manual" className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or phone..."
                                    value={manualSearch}
                                    onChange={(e) => setManualSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <div className="border rounded-md h-[300px] overflow-y-auto p-2 space-y-1">
                                {filteredManualParents.map(p => (
                                    <div key={(p as any).id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded cursor-pointer" onClick={() => toggleParent((p as any).id)}>
                                        <Checkbox checked={selectedParents.includes((p as any).id)} />
                                        <div>
                                            <p className="text-sm font-medium">{(p as any).firstName} {(p as any).lastName}</p>
                                            <p className="text-xs text-muted-foreground">{(p as any).phone}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-right text-muted-foreground">{selectedParents.length} selected</p>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* RIGHT: MESSAGE */}
            <Card className="h-fit">
                <CardHeader><CardTitle>Message</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className={cn("p-3 rounded text-xs font-medium flex justify-between", channel === 'sms' ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700")}>
                        <span>Channel:</span>
                        <span className="font-bold uppercase">{channel}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded text-xs text-slate-700 font-medium flex justify-between">
                        <span>Recipients:</span>
                        <span className="font-bold">{finalRecipients.length}</span>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium">Message Body</label>
                            <Button variant="ghost" size="sm" className="text-purple-600 h-6 gap-1" onClick={() => setIsAiOpen(true)}>
                                <Sparkles className="h-3 w-3"/> AI Draft
                            </Button>
                        </div>
                        <Textarea 
                            placeholder="Type message..." 
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={6}
                            className="resize-none"
                        />
                         <p className="text-xs text-right text-muted-foreground">
                            {message.length} characters ({(Math.ceil(message.length / 160))} SMS units)
                        </p>
                    </div>
                    
                    <Button 
                        onClick={handleSend} 
                        disabled={sending || !message || finalRecipients.length === 0 || (channel === 'whatsapp' && !schoolSettings?.enableWhatsApp)} 
                        className={cn("w-full transition-all active:scale-95", channel === 'whatsapp' ? "bg-green-600 hover:bg-green-700 shadow-green-900/10" : "bg-blue-600 hover:bg-blue-700 shadow-blue-900/10")}
                    >
                        {sending ? <Loader2 className="animate-spin mr-2"/> : <Send className="mr-2 h-4 w-4"/>}
                        Send {channel.toUpperCase()}
                    </Button>
                </CardContent>
            </Card>
        </div>
        <Dialog open={isAiOpen} onOpenChange={setIsAiOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>AI Message Writer</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label>What is this message about?</Label>
                    <Input placeholder="e.g. School closed due to heavy rain" value={aiTopic} onChange={e => setAiTopic(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Tone</Label>
                    <RadioGroup value={aiTone} onValueChange={(v: any) => setAiTone(v)} className="flex gap-4">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="formal" id="r1" /><Label htmlFor="r1">Formal</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="friendly" id="r2" /><Label htmlFor="r2">Friendly</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="urgent" id="r3" /><Label htmlFor="r3">Urgent</Label></div>
                    </RadioGroup>
                </div>
            </div>
            <DialogFooter>
                <Button onClick={handleAiGenerate} disabled={isGenerating || !aiTopic} className="bg-purple-600">
                    {isGenerating ? <Loader2 className="animate-spin mr-2"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                    Generate
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}
