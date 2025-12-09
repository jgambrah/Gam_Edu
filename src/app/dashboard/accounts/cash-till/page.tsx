
'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, doc, setDoc, updateDoc, writeBatch, serverTimestamp, getDoc, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, DollarSign, Check, X, Building, User, History } from 'lucide-react';
import { Till, TillTransaction, Staff, Class } from '@/lib/types';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// --- Accountant's Till View ---
function AccountantTillView() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const tillQuery = useMemoFirebase(() => user ? query(collection(firestore, 'tills'), where('accountantId', '==', user.uid), where('status', '==', 'Open')) : null, [firestore, user]);
    const { data: openTills, isLoading: isLoadingTills, forceRefetch } = useCollection<Till>(tillQuery);
    const activeTill = openTills?.[0];

    const transactionsQuery = useMemoFirebase(() => activeTill ? query(collection(firestore, `tills/${activeTill.id}/transactions`), orderBy('timestamp', 'desc')) : null, [firestore, activeTill]);
    const { data: transactions, isLoading: isLoadingTransactions } = useCollection<TillTransaction>(transactionsQuery);

    const handleOpenTill = async () => {
        if (!user) return;
        setIsSubmitting(true);
        try {
            const newTillRef = doc(collection(firestore, 'tills'));
            await setDoc(newTillRef, {
                accountantId: user.uid,
                accountantName: user.displayName || user.email,
                openingBalance: 0, // Assuming tills start empty
                closingBalance: null,
                dateOpened: serverTimestamp(),
                dateClosed: null,
                status: 'Open',
                directorApproval: { directorId: null, directorName: null, approvedAt: null },
            });
            toast({ title: 'Success', description: 'New till opened for the day.' });
            forceRefetch();
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to open till.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitForApproval = async () => {
        if (!activeTill) return;
        setIsSubmitting(true);
        const totalCash = transactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0;
        try {
            await updateDoc(doc(firestore, 'tills', activeTill.id), {
                status: 'PendingApproval',
                closingBalance: totalCash,
            });
            toast({ title: 'Submitted', description: 'Till has been submitted to the Director for approval.' });
            forceRefetch();
        } catch(e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to submit till.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (isLoadingTills) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin"/></div>
    }

    if (!activeTill) {
        return (
            <Card className="text-center">
                <CardHeader><CardTitle>No Open Till</CardTitle><CardDescription>You do not have an active till. Open one to start collecting cash payments.</CardDescription></CardHeader>
                <CardContent><Button onClick={handleOpenTill} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null} Open Today's Till</Button></CardContent>
            </Card>
        );
    }
    
    const totalCollected = transactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Active Till</CardTitle>
                        <CardDescription>Opened on {activeTill.dateOpened ? format(activeTill.dateOpened.toDate(), 'PPP p') : 'N/A'}</CardDescription>
                    </div>
                     <Card className="p-4 bg-primary text-primary-foreground">
                        <p className="text-sm font-medium">Total Cash Collected</p>
                        <p className="text-3xl font-bold">GH₵{totalCollected.toFixed(2)}</p>
                    </Card>
                </div>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Student</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {isLoadingTransactions ? <TableRow><TableCell colSpan={3} className="text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin"/></TableCell></TableRow> 
                        : transactions?.map(tx => (
                            <TableRow key={tx.id}>
                                <TableCell>{tx.timestamp ? format(tx.timestamp.toDate(), 'p') : 'N/A'}</TableCell>
                                <TableCell>{tx.studentName}</TableCell>
                                <TableCell className="text-right">GH₵{tx.amount.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full" disabled={isSubmitting}>Submit Till for Approval</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will lock your till and send a closing report to the Director for approval. You cannot record more cash payments until it's approved and a new till is opened.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSubmitForApproval}>Yes, Submit</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}

// --- Director's View: Approve/Reject Tills ---
function DirectorTillView() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    // Query for pending tills
    const pendingTillsQuery = useMemoFirebase(() => user ? query(collection(firestore, 'tills'), where('status', '==', 'PendingApproval')) : null, [firestore, user]);
    const { data: pendingTills, isLoading: isLoadingPending, forceRefetch: forceRefetchPending } = useCollection<Till>(pendingTillsQuery);
    
    // Query for closed/approved tills
    const closedTillsQuery = useMemoFirebase(() => user ? query(collection(firestore, 'tills'), where('status', '==', 'Closed'), orderBy('dateClosed', 'desc')) : null, [firestore, user]);
    const { data: closedTills, isLoading: isLoadingClosed } = useCollection<Till>(closedTillsQuery);

    const [selectedTill, setSelectedTill] = useState<Till | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const isLoading = isLoadingPending || isLoadingClosed;

    const handleDecision = async (till: Till, action: 'Approve' | 'Reject') => {
        if (action === 'Reject' && !rejectionReason) {
            toast({ variant: 'destructive', title: 'Reason required', description: 'Please provide a reason for rejection.' });
            return;
        }
        if (!user) return;

        setIsProcessing(true);
        try {
            const tillRef = doc(firestore, 'tills', till.id);
            if (action === 'Approve') {
                await updateDoc(tillRef, {
                    status: 'Closed',
                    'directorApproval.directorId': user.uid,
                    'directorApproval.directorName': user.displayName || user.email,
                    'directorApproval.approvedAt': serverTimestamp(),
                    dateClosed: serverTimestamp(),
                });
            } else { // Reject
                await updateDoc(tillRef, {
                    status: 'Open', // Re-open the till
                    'directorApproval.rejectionReason': rejectionReason,
                });
            }
            toast({ title: 'Success', description: `Till has been ${action.toLowerCase()}d.` });
            setSelectedTill(null);
            setRejectionReason('');
            forceRefetchPending();
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not process decision.' });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Till Submissions</CardTitle>
                <CardDescription>Review and approve or reject end-of-day till submissions from accountants.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="pending">
                    <TabsList>
                        <TabsTrigger value="pending">Pending Approval</TabsTrigger>
                        <TabsTrigger value="history">Approval History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending" className="mt-4">
                        <Table>
                            <TableHeader><TableRow><TableHead>Accountant</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Closing Balance</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {isLoadingPending ? <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></TableCell></TableRow> 
                                : pendingTills?.map(till => (
                                    <TableRow key={till.id}>
                                        <TableCell>{till.accountantName}</TableCell>
                                        <TableCell>{till.dateOpened ? format(till.dateOpened.toDate(), 'PPP') : 'N/A'}</TableCell>
                                        <TableCell className="text-right font-bold">GH₵{till.closingBalance?.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button variant="destructive" size="sm" onClick={() => setSelectedTill(till)}>Reject</Button></AlertDialogTrigger>
                                                {selectedTill?.id === till.id && (
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader><AlertDialogTitle>Reject Till?</AlertDialogTitle><AlertDialogDescription>This will reopen the till for the accountant to make corrections. Please provide a reason.</AlertDialogDescription></AlertDialogHeader>
                                                        <Textarea placeholder="Reason for rejection..." value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDecision(till, 'Reject')} disabled={isProcessing}>{isProcessing && <Loader2 className="mr-2 h-4"/>}Confirm Rejection</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                )}
                                            </AlertDialog>
                                            <Button size="sm" className="ml-2" onClick={() => handleDecision(till, 'Approve')} disabled={isProcessing}>
                                                {isProcessing && selectedTill?.id === till.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Check className="mr-2 h-4 w-4"/>} Approve
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {!isLoadingPending && pendingTills?.length === 0 && <p className="text-center text-muted-foreground p-8">No tills are currently pending approval.</p>}
                    </TabsContent>
                    <TabsContent value="history" className="mt-4">
                         <Table>
                            <TableHeader><TableRow><TableHead>Accountant</TableHead><TableHead>Date Closed</TableHead><TableHead>Balance</TableHead><TableHead>Approved By</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {isLoadingClosed ? <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></TableCell></TableRow> 
                                : closedTills?.map(till => (
                                    <TableRow key={till.id}>
                                        <TableCell>{till.accountantName}</TableCell>
                                        <TableCell>{till.dateClosed ? format(till.dateClosed.toDate(), 'PPP p') : 'N/A'}</TableCell>
                                        <TableCell className="font-medium">GH₵{till.closingBalance?.toFixed(2)}</TableCell>
                                        <TableCell>{till.directorApproval?.directorName}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {!isLoadingClosed && closedTills?.length === 0 && <p className="text-center text-muted-foreground p-8">No approved tills in history.</p>}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

export default function CashTillPage() {
    const { role } = useRole();
    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role);

    if (!canAccess) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>This module is restricted to financial staff.</CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
    const isDirector = role === 'Administrator' || role === 'Director';
    const isAccountant = role === 'Accountant';

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Cash Till Management</h1>
            {isDirector && <DirectorTillView />}
            {isAccountant && <AccountantTillView />}
        </div>
    );
}
