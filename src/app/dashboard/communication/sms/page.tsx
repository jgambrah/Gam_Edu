'use client';

import { useState, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { sendSMSAction } from '@/app/actions/sms';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Send, Users, Filter, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSMSDraftAction } from '@/app/actions/sms-ai';
import { Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FinancialRecord, Student, Class } from '@/lib/types';

export default function BulkSMSPage() {
  const { schoolId } = useCurrentSchool();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [message, setMessage] = useState('');
  const [targetGroup, setTargetGroup] = useState('all'); 
  const [selectedParents, setSelectedParents] = useState<string[]>([]); // Array of Parent IDs
  const [sending, setSending] = useState(false);
  const [mode, setMode] = useState('bulk'); // 'bulk' or 'manual'

  // AI Dialog State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState<'formal' | 'urgent' | 'friendly'>('formal');
  const [isGenerating, setIsGenerating] = useState(false);

  // Manual Selection Search State
  const [manualSearch, setManualSearch] = useState('');

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
    if (finalRecipients.length === 0) return;
    setSending(true);
    let count = 0;
    for (const parent of finalRecipients) {
        if ((parent as any).phone) {
            await sendSMSAction((parent as any).phone, message);
            count++;
        }
    }
    setSending(false);
    toast({ title: "Broadcast Sent", description: `Message sent to ${count} parents.` });
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
                <Send className="h-8 w-8 text-blue-600" /> SMS Center
            </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LEFT: SELECTION */}
            <Card className="md:col-span-2">
                <CardHeader><CardTitle>Recipients</CardTitle></CardHeader>
                <CardContent>
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
                    <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 font-medium flex justify-between">
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
                    
                    <Button onClick={handleSend} disabled={sending || !message || finalRecipients.length === 0} className="w-full bg-blue-600">
                        {sending ? <Loader2 className="animate-spin mr-2"/> : <Send className="mr-2 h-4 w-4"/>}
                        Send SMS
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
