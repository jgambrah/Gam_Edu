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
import { Loader2, Send, Users, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

  // Data Fetching
  const parentsQuery = useMemoFirebase(
    () => (firestore && schoolId) ? query(collection(firestore, 'parents'), where('schoolId', '==', schoolId)) : null,
    [firestore, schoolId]
  );
  const { data: parents } = useCollection(parentsQuery);

  const studentsQuery = useMemoFirebase(
    () => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null,
    [firestore, schoolId]
  );
  const { data: students } = useCollection<Student>(studentsQuery);
  
  const classesQuery = useMemoFirebase(
    () => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null,
    [firestore, schoolId]
  );
  const { data: classes } = useCollection<Class>(classesQuery);

  const financialRecordsQuery = useMemoFirebase(
    () => (firestore && schoolId) ? query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId), where('status', 'in', ['Unpaid', 'Overdue'])) : null,
    [firestore, schoolId]
  );
  const { data: financialRecords } = useCollection<FinancialRecord>(financialRecordsQuery);

  // Filter Logic (Bulk)
  const bulkTargets = useMemo(() => {
    if (!parents || !students) return [];
    
    if (targetGroup === 'all') return parents;
    
    if (targetGroup === 'debtors') {
        if (!financialRecords) return [];
        const debtorStudentIds = new Set(financialRecords.map(r => r.studentId));
        return parents.filter(p => 
            (p as any).studentIds?.some((sid: string) => debtorStudentIds.has(sid))
        );
    }
    
    if (targetGroup.startsWith('class_')) {
        const classId = targetGroup.replace('class_', '');
        const studentIdsInClass = students
            .filter(s => s.classId === classId)
            .map(s => s.uid);
        
        return parents.filter(p => 
            (p as any).studentIds?.some((sid: string) => studentIdsInClass.includes(sid))
        );
    }
    
    return [];
  }, [parents, students, financialRecords, targetGroup]);

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
                                <label className="text-sm font-medium flex items-center gap-2"><Filter className="h-4 w-4"/> Filter By</label>
                                <Select value={targetGroup} onValueChange={setTargetGroup}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Parents</SelectItem>
                                        <SelectItem value="debtors">Parents Owing Fees</SelectItem>
                                        {classes?.map(c => (
                                            <SelectItem key={c.id} value={`class_${c.id}`}>Parents of {c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>

                        <TabsContent value="manual" className="space-y-4">
                            <div className="border rounded-md h-[300px] overflow-y-auto p-2 space-y-1">
                                {parents?.map(p => (
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
                    
                    <Textarea 
                        placeholder="Type message..." 
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={6}
                        className="resize-none"
                    />
                    
                    <Button onClick={handleSend} disabled={sending || !message || finalRecipients.length === 0} className="w-full bg-blue-600">
                        {sending ? <Loader2 className="animate-spin mr-2"/> : <Send className="mr-2 h-4 w-4"/>}
                        Send SMS
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
