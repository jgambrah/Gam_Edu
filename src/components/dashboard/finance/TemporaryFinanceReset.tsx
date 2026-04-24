'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, limit } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Loader2 } from 'lucide-react';

export function TemporaryFinanceReset({ onComplete }: { onComplete: () => void }) {
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();
    
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleNuclearReset = async () => {
        if (!firestore || !schoolId) return;
        if (confirmText !== 'RESET') return;
        
        if (!confirm("FINAL WARNING: This will permanently delete all student bills and financial records for this school. Proceed?")) return;

        setIsDeleting(true);
        try {
            let totalDeleted = 0;
            let hasMore = true;

            while (hasMore) {
                const q = query(
                    collection(firestore, 'financialRecords'),
                    where('schoolId', '==', schoolId),
                    limit(500)
                );
                
                const snapshot = await getDocs(q);
                
                if (snapshot.empty) {
                    hasMore = false;
                    break;
                }

                const batch = writeBatch(firestore);
                snapshot.docs.forEach((doc) => {
                    batch.delete(doc.ref);
                });

                await batch.commit();
                totalDeleted += snapshot.size;
                
                toast({ title: "Deleting...", description: `Removed ${totalDeleted} records so far.` });
            }

            toast({ title: "Reset Complete", description: `Successfully deleted ${totalDeleted} financial records.` });
            setConfirmText('');
            onComplete();

        } catch (error: any) {
            console.error("Reset Failed:", error);
            toast({ variant: 'destructive', title: "Error", description: error.message });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className="border-red-500 bg-red-50 mb-8 animate-in slide-in-from-top-4">
            <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" /> DANGER: Wipe All Financial Records
                </CardTitle>
                <CardDescription className="text-red-600">
                    This tool is temporary. It will delete every single student bill and payment record for your school. Type <strong>RESET</strong> below to confirm.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
                <Input 
                    value={confirmText} 
                    onChange={(e) => setConfirmText(e.target.value)} 
                    placeholder="Type RESET" 
                    className="bg-white border-red-300 focus-visible:ring-red-500 max-w-[200px]"
                />
                <Button 
                    variant="destructive" 
                    onClick={handleNuclearReset} 
                    disabled={confirmText !== 'RESET' || isDeleting}
                >
                    {isDeleting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <AlertTriangle className="mr-2 h-4 w-4"/>}
                    Delete All Records
                </Button>
            </CardContent>
        </Card>
    );
}
