

'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, doc, setDoc, updateDoc, writeBatch, serverTimestamp, getDoc, orderBy, increment, addDoc, runTransaction } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, DollarSign, Check, X, Building, User, History, Banknote, Edit, Search } from 'lucide-react';
import { Till, TillTransaction, Staff, Class, BankTransaction } from '@/lib/types';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// --- DIALOG: Manual Till Adjustment ---
function TillAdjustmentDialog({ activeTill, open, setOpen, onUpdate }: { activeTill: Till; open: boolean; setOpen: (open: boolean) => void; onUpdate: () => void; }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [amount, setAmount] = useState(0);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!amount || !reason.trim()) {
            toast({ variant: 'destructive', title: "Missing fields" });
            return;
        }
        setIsSubmitting(true);
        try {
            const transactionRef = collection(firestore, `tills/${activeTill.id}/transactions`);
            await addDoc(transactionRef, {
                tillId: activeTill.id,
                amount: Number(amount),
                description: `Manual Adjustment: ${reason}`,
                type: 'Adjustment',
                status: 'Pending Adjustment',
                timestamp: serverTimestamp(),
            });
            toast({ title: 'Adjustment Submitted', description: 'Your request has been sent for director approval.' });
            onUpdate();
            setOpen(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manual Till Adjustment</DialogTitle>
                    <DialogDescription>Request a manual change to the till's balance. This requires director approval.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Adjustment Amount (GH₵)</Label>
                        <Input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} placeholder="e.g., -630 for over-recording" />
                        <p className="text-xs text-muted-foreground">Use a negative number to remove cash, positive to add.</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Reason for Adjustment</Label>
                        <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g., Corrected over-recorded payment for INV-123" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Submit for Approval</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- Accountant's Till View ---
function AccountantTillView() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { schoolId } = useCurrentSchool();
    const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);

    const tillQuery = useMemoFirebase(() => (user && schoolId) ? query(collection(firestore, 'tills'), where('schoolId', '==', schoolId), where('accountantId', '==', user.uid), where('status', '==', 'Open')) : null, [firestore, user, schoolId]);
    const { data: openTills, isLoading: isLoadingTills, forceRefetch } = useCollection<Till>(tillQuery);
    const activeTill = openTills?.[0];

    const transactionsQuery = useMemoFirebase(() => activeTill ? query(collection(firestore, `tills/${activeTill.id}/transactions`), orderBy('timestamp', 'desc')) : null, [firestore, activeTill]);
    const { data: transactions, isLoading: isLoadingTransactions, forceRefetch: refetchTransactions } = useCollection<TillTransaction>(transactionsQuery);

    const handleOpenTill = async () => {
        if (!user || !schoolId) return;
        setIsSubmitting(true);
        try {
            const newTillRef = doc(collection(firestore, 'tills'));
            await setDoc(newTillRef, {
                accountantId: user.uid,
                accountantName: user.displayName || user.email,
                openingBalance: 0,
                closingBalance: null,
                dateOpened: serverTimestamp(),
                dateClosed: null,
                status: 'Open',
                directorApproval: { directorId: null, directorName: null, approvedAt: null },
                schoolId: schoolId,
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
        if (!activeTill || !transactions) return;
        setIsSubmitting(true);
        const totalCash = transactions.filter(tx => tx.status === 'Completed').reduce((sum, tx) => sum + tx.amount, 0);
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
    
    const totalCollected = transactions?.filter(tx => tx.status === 'Completed').reduce((sum, tx) => sum + tx.amount, 0) || 0;

    return (
        <>
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
                        <TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {isLoadingTransactions ? <TableRow><TableCell colSpan={3} className="text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin"/></TableCell></TableRow> 
                            : transactions?.map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell>{tx.timestamp ? format(tx.timestamp.toDate(), 'p') : 'N/A'}</TableCell>
                                    <TableCell>{tx.description}</TableCell>
                                    <TableCell className="text-right">GH₵{tx.amount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsAdjustmentOpen(true)} className="flex-1">Manual Adjustment</Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="flex-1" disabled={isSubmitting}>Submit Till for Approval</Button>
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
            {isAdjustmentOpen && <TillAdjustmentDialog activeTill={activeTill} open={isAdjustmentOpen} setOpen={setIsAdjustmentOpen} onUpdate={refetchTransactions} />}
        </>
    );
}

// --- Director's View: Bank Transactions Approval ---
function DirectorBankTransactionsView() {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    
    const pendingBankTxQuery = useMemoFirebase(() => (schoolId && firestore) ? query(collection(firestore, 'bank_transactions'), where('schoolId', '==', schoolId), where('status', '==', 'Pending'), orderBy('recordedAt', 'desc')) : null, [firestore, schoolId]);
    const { data: pendingTxs, isLoading, forceRefetch } = useCollection<BankTransaction>(pendingBankTxQuery);

    const handleApprove = async (txId: string) => {
        if (!user) return;
        await updateDoc(doc(firestore, 'bank_transactions', txId), {
            status: 'Approved',
            approverId: user.uid,
            approverName: user.displayName || user.email,
            approvedAt: serverTimestamp(),
        });
        toast({ title: 'Approved', description: 'Transaction has been approved.' });
        forceRefetch();
    };

    // Placeholder for reject logic
    const handleReject = (txId: string) => {
        toast({ title: 'Rejected (Not Implemented)', description: 'Rejection logic needs to be built.' });
    };

    return (
        <div className="mt-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date Recorded</TableHead>
                        <TableHead>Recorded By</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && <TableRow><TableCell colSpan={6} className="text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></TableCell></TableRow>}
                    {!isLoading && pendingTxs?.map(tx => (
                        <TableRow key={tx.id}>
                            <TableCell>{tx.recordedAt ? format(tx.recordedAt.toDate(), 'PPP p') : 'N/A'}</TableCell>
                            <TableCell>{tx.recordedByName}</TableCell>
                            <TableCell>{tx.studentName}</TableCell>
                            <TableCell><Badge variant="outline">{tx.paymentMethod}</Badge></TableCell>
                            <TableCell className="text-right font-bold">GH₵{tx.amount.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" onClick={() => handleApprove(tx.id)}>Approve</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {!isLoading && pendingTxs?.length === 0 && <p className="text-center text-muted-foreground p-8">No pending bank or mobile money payments to review.</p>}
        </div>
    );
}

// --- Director's View: Till Detail Dialog ---
function TillDetailDialog({ till, open, setOpen, onUpdate }: { till: Till, open: boolean, setOpen: (open: boolean) => void, onUpdate: () => void }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const transactionsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, `tills/${till.id}/transactions`), orderBy('timestamp', 'desc')) : null, [firestore, till.id]);
    const { data: transactions, isLoading, forceRefetch } = useCollection<TillTransaction>(transactionsQuery);

    const pendingAdjustments = transactions?.filter(t => t.status === 'Pending Adjustment') || [];

    const handleAdjustmentDecision = async (tx: TillTransaction, decision: 'approve' | 'reject') => {
        setIsProcessing(true);
        try {
            await runTransaction(firestore, async (transaction) => {
                const tillRef = doc(firestore, 'tills', till.id);
                const txRef = doc(firestore, `tills/${till.id}/transactions`, tx.id);

                if (decision === 'approve') {
                    transaction.update(txRef, { status: 'Completed' });
                    transaction.update(tillRef, { closingBalance: increment(tx.amount) });
                } else {
                    transaction.update(txRef, { status: 'Rejected' });
                }
            });
            toast({ title: "Success", description: `Adjustment ${decision}d.` });
            forceRefetch(); // Re-fetch transactions for this till
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleApproveTill = async () => {
        if (!user) return;
        setIsProcessing(true);
        try {
            await updateDoc(doc(firestore, 'tills', till.id), {
                status: 'Closed',
                'directorApproval.directorId': user.uid,
                'directorApproval.directorName': user.displayName || user.email,
                'directorApproval.approvedAt': serverTimestamp(),
                dateClosed: serverTimestamp(),
            });
            toast({ title: "Till Approved!", description: "The till has been closed successfully." });
            onUpdate();
            setOpen(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Review Till Submission</DialogTitle>
                    <DialogDescription>
                        For: {till.accountantName} | Date: {till.dateOpened ? format(till.dateOpened.toDate(), 'PPP') : 'N/A'}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                    <p>Reported Closing Balance: <strong>GH₵{till.closingBalance?.toFixed(2)}</strong></p>
                    <Table>
                        <TableHeader><TableRow><TableHead>Description</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {isLoading && <TableRow><TableCell colSpan={5} className="text-center"><Loader2 className="animate-spin"/></TableCell></TableRow>}
                            {transactions?.map(tx => (
                                <TableRow key={tx.id} className={tx.status === 'Pending Adjustment' ? 'bg-yellow-50' : ''}>
                                    <TableCell>{tx.description}</TableCell>
                                    <TableCell><Badge variant={tx.type === 'Adjustment' ? 'secondary' : 'outline'}>{tx.type}</Badge></TableCell>
                                    <TableCell><Badge variant={tx.status === 'Completed' ? 'default' : tx.status === 'Pending Adjustment' ? 'destructive' : 'secondary'}>{tx.status}</Badge></TableCell>
                                    <TableCell className="text-right font-mono">{tx.amount.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        {tx.status === 'Pending Adjustment' && (
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" variant="destructive" onClick={() => handleAdjustmentDecision(tx, 'reject')} disabled={isProcessing}>Reject</Button>
                                                <Button size="sm" onClick={() => handleAdjustmentDecision(tx, 'approve')} disabled={isProcessing}>Approve</Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
                    <Button onClick={handleApproveTill} disabled={pendingAdjustments.length > 0 || isProcessing}>
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                        Approve Final Till
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// --- Director's View: Approve/Reject Tills ---
function DirectorTillView() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();

    const pendingTillsQuery = useMemoFirebase(() => (schoolId && firestore) ? query(collection(firestore, 'tills'), where('schoolId', '==', schoolId), where('status', '==', 'PendingApproval')) : null, [firestore, schoolId]);
    const { data: pendingTills, isLoading: isLoadingPending, forceRefetch: forceRefetchPending } = useCollection<Till>(pendingTillsQuery);
    
    const closedTillsQuery = useMemoFirebase(() => (schoolId && firestore) ? query(collection(firestore, 'tills'), where('schoolId', '==', schoolId), where('status', '==', 'Closed')) : null, [firestore, schoolId]);
    const { data: closedTills, isLoading: isLoadingClosed } = useCollection<Till>(closedTillsQuery);

    const [reviewingTill, setReviewingTill] = useState<Till | null>(null);

    const isLoading = isLoadingPending || isLoadingClosed;

    const sortedPending = useMemo(() => {
        if (!pendingTills) return [];
        return [...pendingTills].sort((a,b) => (b.dateOpened?.seconds || 0) - (a.dateOpened?.seconds || 0));
    }, [pendingTills]);

    const sortedClosed = useMemo(() => {
        if (!closedTills) return [];
        return [...closedTills].sort((a,b) => (b.dateClosed?.seconds || 0) - (a.dateClosed?.seconds || 0));
    }, [closedTills]);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Financial Approvals</CardTitle>
                    <CardDescription>Review and approve end-of-day till submissions and other digital payments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="tills">
                        <TabsList>
                            <TabsTrigger value="tills">Till Submissions</TabsTrigger>
                            <TabsTrigger value="bank">Bank & MoMo Transactions</TabsTrigger>
                        </TabsList>
                        <TabsContent value="tills" className="mt-4">
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
                                            : sortedPending?.map(till => (
                                                <TableRow key={till.id}>
                                                    <TableCell>{till.accountantName}</TableCell>
                                                    <TableCell>{till.dateOpened ? format(till.dateOpened.toDate(), 'PPP') : 'N/A'}</TableCell>
                                                    <TableCell className="text-right font-bold">GH₵{till.closingBalance?.toFixed(2)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button size="sm" onClick={() => setReviewingTill(till)}>Review</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {!isLoadingPending && sortedPending?.length === 0 && <p className="text-center text-muted-foreground p-8">No tills are currently pending approval.</p>}
                                </TabsContent>
                                <TabsContent value="history" className="mt-4">
                                    <Table>
                                        <TableHeader><TableRow><TableHead>Accountant</TableHead><TableHead>Date Closed</TableHead><TableHead>Balance</TableHead><TableHead>Approved By</TableHead></TableRow></TableHeader>
                                        <TableBody>
                                            {isLoadingClosed ? <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></TableCell></TableRow> 
                                            : sortedClosed?.map(till => (
                                                <TableRow key={till.id}>
                                                    <TableCell>{till.accountantName}</TableCell>
                                                    <TableCell>{till.dateClosed ? format(till.dateClosed.toDate(), 'PPP p') : 'N/A'}</TableCell>
                                                    <TableCell className="font-medium">GH₵{till.closingBalance?.toFixed(2)}</TableCell>
                                                    <TableCell>{till.directorApproval?.directorName}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {!isLoadingClosed && sortedClosed?.length === 0 && <p className="text-center text-muted-foreground p-8">No approved tills in history.</p>}
                                </TabsContent>
                            </Tabs>
                        </TabsContent>
                        <TabsContent value="bank">
                            <DirectorBankTransactionsView />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            {reviewingTill && <TillDetailDialog till={reviewingTill} open={!!reviewingTill} setOpen={() => setReviewingTill(null)} onUpdate={forceRefetchPending} />}
        </>
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
            <h1 className="text-3xl font-bold">Financial Submissions</h1>
            {isDirector && <DirectorTillView />}
            {isAccountant && <AccountantTillView />}
        </div>
    );
}
