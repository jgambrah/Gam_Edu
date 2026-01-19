'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { sendSMSAction } from '@/app/actions/sms';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BulkSMSPage() {
  const { schoolId } = useCurrentSchool();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Fetch all parents to get phone numbers
  const parentsQuery = useMemoFirebase(
    () => (firestore && schoolId) ? query(collection(firestore, 'parents'), where('schoolId', '==', schoolId)) : null,
    [firestore, schoolId]
  );
  const { data: parents } = useCollection(parentsQuery);

  const handleSendBulk = async () => {
    if (!parents || parents.length === 0) return alert("No parents found.");
    setSending(true);

    let count = 0;
    // Iterate and send (In production, use a Bulk API endpoint instead of loop)
    for (const parent of parents) {
        if (parent.phone) {
            await sendSMSAction(parent.phone, message);
            count++;
        }
    }

    setSending(false);
    toast({ title: "Bulk SMS Complete", description: `Sent to ${count} parents.` });
    setMessage('');
  };

  return (
    <div className="p-6">
        <Card className="max-w-2xl mx-auto">
            <CardHeader><CardTitle>Send Bulk SMS Broadcast</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded text-sm text-blue-700">
                    Target: <strong>{parents?.length || 0} Parents</strong>
                </div>
                <Textarea 
                    placeholder="Type your message here (e.g. PTA Meeting on Friday...)" 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={5}
                />
                <Button onClick={handleSendBulk} disabled={sending || !message} className="w-full">
                    {sending ? <Loader2 className="animate-spin mr-2"/> : <Send className="mr-2 h-4 w-4"/>}
                    Send Broadcast
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
