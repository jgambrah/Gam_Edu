
'use client';

import { useState, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { sendSMSAction } from '@/app/actions/sms';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Loader2, Send, Users, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BulkSMSPage() {
  const { schoolId } = useCurrentSchool();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [message, setMessage] = useState('');
  const [targetGroup, setTargetGroup] = useState('all'); // all, grade1, debtors
  const [sending, setSending] = useState(false);

  // 1. Fetch All Parents
  const parentsQuery = useMemoFirebase(
    () => (firestore && schoolId) ? query(collection(firestore, 'parents'), where('schoolId', '==', schoolId)) : null,
    [firestore, schoolId]
  );
  const { data: parents } = useCollection(parentsQuery);

  // 2. Fetch All Students (Needed for Class filtering)
  const studentsQuery = useMemoFirebase(
    () => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null,
    [firestore, schoolId]
  );
  const { data: students } = useCollection(studentsQuery);

  // 3. Filter Logic
  const targetedParents = useMemo(() => {
    if (!parents || !students) return [];

    if (targetGroup === 'all') return parents;

    // Filter by Class (Example: Grade 1)
    if (targetGroup.startsWith('class_')) {
        const className = targetGroup.replace('class_', '');
        // Find students in this class
        const studentIdsInClass = students
            .filter(s => s.grade === className)
            .map(s => s.uid);
        
        // Find parents linked to these students
        return parents.filter(p => 
            p.studentIds?.some(sid => studentIdsInClass.includes(sid))
        );
    }
    
    return [];
  }, [parents, students, targetGroup]);


  const handleSendBulk = async () => {
    if (targetedParents.length === 0) return;
    setSending(true);

    let count = 0;
    // In production, send this array to backend for bulk processing
    for (const parent of targetedParents) {
        if (parent.phone) {
            // Mock send for now
            console.log(`Sending to ${parent.phone}: ${message}`);
            // await sendSMSAction(parent.phone, message);
            count++;
        }
    }

    // Simulate delay
    await new Promise(r => setTimeout(r, 1000));

    setSending(false);
    toast({ title: "Broadcast Sent", description: `Message sent to ${count} parents.` });
    setMessage('');
  };

  // Extract unique grades for dropdown
  const grades = Array.from(new Set(students?.map(s => s.grade).filter(Boolean))).sort();

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <Send className="h-8 w-8 text-blue-600" /> SMS Broadcast
            </h1>
            <p className="text-slate-600">Send announcements, reminders, and alerts to parents instantly.</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Compose Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                
                {/* TARGET SELECTOR */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Filter className="h-4 w-4"/> Target Audience
                    </label>
                    <Select value={targetGroup} onValueChange={setTargetGroup}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Group" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Parents ({parents?.length || 0})</SelectItem>
                            <SelectItem value="debtors" disabled>Parents Owing Fees (Coming Soon)</SelectItem>
                            {grades.map(g => (
                                <SelectItem key={g} value={`class_${g}`}>Parents of {g}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* COUNT INDICATOR */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-center gap-3">
                    <div className="bg-blue-200 p-2 rounded-full">
                        <Users className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-blue-900">Recipient Count</p>
                        <p className="text-xs text-blue-700">
                            This message will be sent to <strong>{targetedParents.length}</strong> numbers.
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Message Body</label>
                    <Textarea 
                        placeholder="Dear Parent, please be informed that..." 
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={5}
                        className="resize-none"
                    />
                    <p className="text-xs text-right text-muted-foreground">
                        {message.length} characters ({(Math.ceil(message.length / 160))} SMS units)
                    </p>
                </div>

                <Button 
                    onClick={handleSendBulk} 
                    disabled={sending || !message || targetedParents.length === 0} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                >
                    {sending ? <Loader2 className="animate-spin mr-2"/> : <Send className="mr-2 h-4 w-4"/>}
                    Send to {targetedParents.length} Parents
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
