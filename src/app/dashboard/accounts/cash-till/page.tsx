
'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, doc, setDoc, updateDoc, writeBatch, serverTimestamp, getDoc, orderBy, increment, addDoc, runTransaction } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, DollarSign, Check, X, Building, User, History, CheckCheck } from 'lucide-react';
import { Till, TillTransaction, Staff, Class, BankTransaction, Student } from '@/lib/types';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { StudentDisplay } from '@/components/student-display';
import { useCurrentSchool } from '@/hooks/use-current-school';


// --- SUB-COMPONENT: Till Adjustment Dialog ---
function TillAdjustmentDialog({ open, onOpenChange, tillId, onSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, tillId: string, onSuccess: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const adjustmentSchema = z.object({
        amount: z.coerce.number().refine(val => val !== 0, "Amount cannot be zero."),
        reason: z.string().min(5, "A reason of at least 5 characters is required.")
    });

    const form = useForm<z.infer<typeof adjustmentSchema>>({
        resolver: zodResolver(adjustmentSchema),
        defaultValues: { reason: '' }
    });

    async function onSubmit(values: z.infer<typeof adjustmentSchema>) {
        if (!firestore || !schoolId) return;
        setIsSubmitting(true);
        try {
            const transactionRef = collection(firestore, `tills/${tillId}/transactions`);
            await addDoc(transactionRef, {
                tillId: tillId,
                amount: values.amount,
                description: `Manual Adjustment: ${values.reason}`,
                timestamp: serverTimestamp(),
                type: 'Adjustment',
                status: 'Pending Adjustment',
                schoolId: schoolId,
            });

            toast({ title: "Adjustment Submitted", description: `Your request for GH₵${values.amount.toFixed(2)} is pending approval.` });
            onSuccess();
            onOpenChange(false);
            form.reset();
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request Manual Till Adjustment</DialogTitle>
                    <DialogDescription>Record a cash adjustment for this till. This will require approval from a Director.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="amount" render={({ field }) => (
                            <FormItem><FormLabel>Adjustment Amount (GH₵)</FormLabel><FormControl><Input type="number" step="0.01" {...field} placeholder="-630.00 for deductions" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="reason" render={({ field }) => (
                            <FormItem><FormLabel>Reason</FormLabel><FormControl><Textarea placeholder="e.g., Correction for data entry error on receipt #123" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Submit for Approval
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

// --- Accountant's Till View ---
function AccountantTillView({ students, classes, setSelectedTill }: { students: Student[] | null, classes: Class[] | null, setSelectedTill: (till: Till) => void }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);

    const studentMap = useMemo(() => new Map(students?.map(s => [s.uid, s])), [students]);
    const classMap = useMemo(() => new Map(classes?.map(c => [c.id, c.name])), [classes]);

    const tillQuery = useMemoFirebase(() => (user && schoolId) ? query(collection(firestore, 'tills'), where('schoolId', '==', schoolId), where('accountantId', '==', user.uid), where('status', '==', 'Open')) : null, [firestore, user, schoolId]);
    const { data: openTills, isLoading: isLoadingTills, forceRefetch } = useCollection<Till>(tillQuery);
    const activeTill = openTills?.[0];

    const transactionsQuery = useMemoFirebase(() => activeTill ? query(collection(firestore, `tills/${activeTill.id}/transactions`), orderBy('timestamp', 'desc')) : null, [firestore, activeTill]);
    const { data: transactions, isLoading: isLoadingTransactions } = useCollection<TillTransaction>(transactionsQuery);

    const historyQuery = useMemoFirebase(() => (user && schoolId) ? query(collection(firestore, 'tills'), where('schoolId', '==', schoolId), where('accountantId', '==', user.uid), where('status', '!=', 'Open'), orderBy('status'), orderBy('dateClosed', 'desc')) : null, [firestore, user, schoolId]);
    const { data: historyTills, isLoading: isLoadingHistory } = useCollection<Till>(historyQuery);

    const totalCollected = useMemo(() => {
        if (!transactions) return 0;
        return transactions
            .filter(tx => tx.status === 'Completed' || !tx.status) 
            .reduce((sum, tx) => sum + tx.amount, 0);
    }, [transactions]);

    const handleOpenTill = async () => {
        if (!user || !schoolId) return;
        setIsSubmitting(true);
        try {
            const newTillRef = doc(collection(firestore, 'tills'));
            await setDoc(newTillRef, {
                accountantId: user.uid,
                accountantName: user.displayName || user.email,
                openingBalance: 0,
                currentBalance: 0,
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
        if (!activeTill) return;
        setIsSubmitting(true);
        try {
            await updateDoc(doc(firestore, 'tills', activeTill.id), {
                status: 'PendingApproval',
                closingBalance: totalCollected,
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

    return (
        <Tabs defaultValue="active">
            <TabsList>
                <TabsTrigger value="active">Active Till</TabsTrigger>
                <TabsTrigger value="history">My Till History</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
                 {!activeTill ? (
                    <Card className="text-center">
                        <CardHeader><CardTitle>No Open Till</CardTitle><CardDescription>You do not have an active till. Open one to start collecting cash payments.</CardDescription></CardHeader>
                        <CardContent><Button onClick={handleOpenTill} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null} Open Today's Till</Button></CardContent>
                    </Card>
                ) : (
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
                                <TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Student</TableHead><TableHead>Details</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount (GH₵)</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {isLoadingTransactions ? <TableRow><TableCell colSpan={5} className="text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin"/></TableCell></TableRow> 
                                    : transactions?.map(tx => {
                                        const student = tx.studentId ? studentMap.get(tx.studentId) : null;
                                        const className = student ? classMap.get(student.classId) : null;
                                        return (
                                        <TableRow key={tx.id}>
                                            <TableCell>{tx.timestamp ? format(tx.timestamp.toDate(), 'p') : 'N/A'}</TableCell>
                                            <TableCell>
                                                {student ? (
                                                    <div>
                                                        <div className="font-medium">{student.firstName} {student.lastName}</div>
                                                        <div className="text-xs text-muted-foreground">{className}</div>
                                                    </div>
                                                ) : tx.studentName || '-'}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{tx.description}</TableCell>
                                            <TableCell><Badge variant={(tx.status === 'Completed' || !tx.status) ? 'default' : 'secondary'}>{tx.status || 'Completed'}</Badge></TableCell>
                                            <TableCell className={`text-right font-mono ${tx.amount < 0 ? 'text-red-500' : ''}`}>{tx.amount.toFixed(2)}</TableCell>
                                        </TableRow>
                                        )}
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsAdjustmentOpen(true)} disabled={isSubmitting}>
                                Manual Adjustment
                            </Button>
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
                    <TillAdjustmentDialog 
                        open={isAdjustmentOpen} 
                        onOpenChange={setIsAdjustmentOpen} 
                        tillId={activeTill.id} 
                        onSuccess={forceRefetch} 
                    />
                    </>
                )}
            </TabsContent>
            <TabsContent value="history" className="mt-4">
                 <Card>
                    <CardHeader><CardTitle>My Till History</CardTitle><CardDescription>Your previous till submissions and their status.</CardDescription></CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader><TableRow><TableHead>Date Closed</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Closing Balance</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {isLoadingHistory ? <TableRow><TableCell colSpan={3}><Loader2 className="mx-auto animate-spin"/></TableCell></TableRow>
                                : historyTills?.map(till => (
                                    <TableRow key={till.id} onClick={() => setSelectedTill(till)} className="cursor-pointer hover:bg-muted/50">
                                        <TableCell>{till.dateClosed ? format(till.dateClosed.toDate(), 'PPP') : (till.dateOpened ? format(till.dateOpened.toDate(), 'PPP') : 'N/A')}</TableCell>
                                        <TableCell><Badge variant={till.status === 'Closed' ? 'default' : 'secondary'}>{till.status}</Badge></TableCell>
                                        <TableCell className="text-right font-bold">GH₵{till.closingBalance?.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                         </Table>
                         {!isLoadingHistory && historyTills?.length === 0 && <p className="p-8 text-center text-muted-foreground">No historical records found.</p>}
                    </CardContent>
                 </Card>
            </TabsContent>
        </Tabs>
    );
}

// --- Director's View: Approve/Reject Tills ---
function DirectorTillView({ setSelectedTill }: { setSelectedTill: (till: Till) => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();

    const [reviewingTill, setReviewingTill] = useState<Till | null>(null);

    const pendingTillsQuery = useMemoFirebase(() => (schoolId && firestore) ? query(collection(firestore, 'tills'), where('schoolId', '==', schoolId), where('status', '==', 'PendingApproval')) : null, [firestore, schoolId]);
    const { data: pendingTills, isLoading: isLoadingPending, forceRefetch: forceRefetchPending } = useCollection<Till>(pendingTillsQuery);
    
    const closedTillsQuery = useMemoFirebase(() => (schoolId && firestore) ? query(collection(firestore, 'tills'), where('schoolId', '==', schoolId), where('status', '==', 'Closed')) : null, [firestore, schoolId]);
    const { data: closedTills, isLoading: isLoadingClosed } = useCollection<Till>(closedTillsQuery);

    const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(
        useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId])
    );
    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(
        useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId])
    );

    const isLoading = isLoadingPending || isLoadingClosed || isLoadingStudents || isLoadingClasses;

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
                    <CardTitle>Till Submissions</CardTitle>
                    <CardDescription>Review and approve end-of-day till submissions from accountants.</CardDescription>
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
                                    {isLoading ? <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></TableCell></TableRow> 
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
                            {!isLoading && sortedPending?.length === 0 && <p className="text-center text-muted-foreground p-8">No tills are currently pending approval.</p>}
                        </TabsContent>
                        <TabsContent value="history" className="mt-4">
                            <Table>
                                <TableHeader><TableRow><TableHead>Accountant</TableHead><TableHead>Date Closed</TableHead><TableHead>Balance</TableHead><TableHead>Approved By</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {isLoading ? <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></TableCell></TableRow> 
                                    : sortedClosed?.map(till => (
                                        <TableRow key={till.id} onClick={() => setReviewingTill(till)} className="cursor-pointer hover:bg-muted/50">
                                            <TableCell>{till.accountantName}</TableCell>
                                            <TableCell>{till.dateClosed ? format(till.dateClosed.toDate(), 'PPp') : 'N/A'}</TableCell>
                                            <TableCell className="font-medium">GH₵{till.closingBalance?.toFixed(2)}</TableCell>
                                            <TableCell>{till.directorApproval?.directorName}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {!isLoading && sortedClosed?.length === 0 && <p className="text-center text-muted-foreground p-8">No approved tills in history.</p>}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            {reviewingTill && (
                <TillDetailDialog 
                    till={reviewingTill} 
                    open={!!reviewingTill} 
                    onOpenChange={() => setReviewingTill(null)} 
                    onUpdate={forceRefetchPending}
                    students={students}
                    classes={classes}
                />
            )}
        </>
    )
}

export default function CashTillPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();

    const [selectedTill, setSelectedTill] = useState<Till | null>(null);

    // Call all hooks unconditionally at the top
    const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(
        useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId])
    );
    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(
        useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId])
    );
    const { forceRefetch: forceRefetchPending } = useCollection<Till>(
        useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'tills'), where('schoolId', '==', schoolId), where('status', '==', 'PendingApproval')) : null, [firestore, schoolId])
    );

    const isLoading = isLoadingStudents || isLoadingClasses;
    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role);
    const isDirector = role === 'Administrator' || role === 'Director';
    const isAccountant = role === 'Accountant';

    // Conditional return *after* all hooks
    if (!canAccess) {
        return (
            <Card>
                <CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This module is restricted to financial staff.</CardDescription></CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Financial Submissions</h1>
            {isLoading && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin"/></div>}
            
            {!isLoading && isDirector && <DirectorTillView setSelectedTill={setSelectedTill} />}
            {!isLoading && isAccountant && <AccountantTillView students={students} classes={classes} setSelectedTill={setSelectedTill} />}
            
            <TillDetailDialog
                till={selectedTill}
                open={!!selectedTill}
                onOpenChange={() => setSelectedTill(null)}
                onUpdate={forceRefetchPending}
                students={students}
                classes={classes}
            />
        </div>
    );
}

      