'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, doc, setDoc, updateDoc, writeBatch, serverTimestamp, getDoc, orderBy, increment, addDoc, runTransaction } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, DollarSign, Check, X, Building, User, History, CheckCheck, 
  Printer, RefreshCw, BarChart2, Calendar, AlertTriangle, ArrowUpRight, ArrowDownLeft, Search, Filter, Coins, Wallet
} from 'lucide-react';
import { Till, TillTransaction, Staff, Class, BankTransaction, Student } from '@/lib/types';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { StudentDisplay } from '@/components/student-display';
import { useCurrentSchool } from '@/hooks/use-current-school';

// Helper for formatting timestamp safely
function formatDateSafe(timestamp: any) {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
        return format(timestamp.toDate(), 'PPP p');
    }
    if (timestamp instanceof Date) {
        return format(timestamp, 'PPP p');
    }
    return format(new Date(timestamp), 'PPP p');
}

// Helper to format date only
function formatDateOnlySafe(timestamp: any) {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
        return format(timestamp.toDate(), 'PPP');
    }
    if (timestamp instanceof Date) {
        return format(timestamp, 'PPP');
    }
    return format(new Date(timestamp), 'PPP');
}

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
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Request Manual Till Adjustment</DialogTitle>
                    <DialogDescription>Record a cash adjustment for this till. This will require approval from a Director.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="amount" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Adjustment Amount (GH₵)</FormLabel>
                                <FormControl><Input type="number" step="0.01" {...field} placeholder="-630.00 for deductions, 100.00 for additions" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="reason" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reason</FormLabel>
                                <FormControl><Textarea placeholder="e.g., Correction for data entry error on receipt #123" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Submit for Approval
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

// --- SUB-COMPONENT: Close Till & Cash Count Dialog ---
const closeTillSchema = z.object({
    actualCashCounted: z.coerce.number().min(0, "Cash counted cannot be negative."),
    discrepancyNote: z.string().optional()
}).refine(data => {
    // We validate discrepancyNote is populated if there is any discrepancy
    return true; // The conditional rule is checked manually below to show customized field errors
}, {
    message: "Variance explanation is required when physical cash does not match collections.",
    path: ["discrepancyNote"]
});

function CloseTillDialog({ open, onOpenChange, expectedBalance, activeTill, onSubmitComplete }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    expectedBalance: number;
    activeTill: Till;
    onSubmitComplete: () => void;
}) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [noteError, setNoteError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof closeTillSchema>>({
        resolver: zodResolver(closeTillSchema),
        defaultValues: {
            actualCashCounted: expectedBalance,
            discrepancyNote: ''
        }
    });

    const actualCount = form.watch('actualCashCounted') || 0;
    const discrepancy = actualCount - expectedBalance;

    async function onSubmit(values: z.infer<typeof closeTillSchema>) {
        if (!firestore) return;
        
        // Manual validation for discrepancy explanation notes
        if (discrepancy !== 0 && (!values.discrepancyNote || values.discrepancyNote.trim().length < 5)) {
            setNoteError("Explanation note of at least 5 characters is required when discrepancy is non-zero.");
            return;
        } else {
            setNoteError(null);
        }

        setIsSubmitting(true);
        try {
            await updateDoc(doc(firestore!, 'tills', activeTill.id), {
                status: 'PendingApproval',
                expectedBalance: expectedBalance,
                actualCashCounted: values.actualCashCounted,
                discrepancy: discrepancy,
                discrepancyNote: values.discrepancyNote || '',
                closingBalance: values.actualCashCounted,
            });

            toast({ title: "Till Submitted", description: "Till closing report has been submitted for approval." });
            onSubmitComplete();
            onOpenChange(false);
            form.reset();
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Submission Failed", description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Close Cash Till & Audit Count</DialogTitle>
                    <DialogDescription>Submit physical cash verification values to close today's register desk.</DialogDescription>
                </DialogHeader>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Expected Digital Balance:</span>
                        <span className="font-bold text-slate-800">GH₵{expectedBalance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Physical Cash Counted:</span>
                        <span className="font-bold text-emerald-700">GH₵{actualCount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-1">
                        <span className="font-semibold text-slate-600">Discrepancy (Variance):</span>
                        <span className={`font-black ${discrepancy === 0 ? 'text-green-600' : 'text-red-650'}`}>
                            GH₵{discrepancy.toFixed(2)}
                        </span>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="actualCashCounted" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Physical Cash Counted (GH₵)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {discrepancy !== 0 && (
                            <FormField control={form.control} name="discrepancyNote" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-amber-800 font-bold">Variance Explanation Notes</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Please describe reasons for discrepancy (e.g. rounded change shortages)..." {...field} />
                                    </FormControl>
                                    {noteError && <p className="text-xs text-red-500 font-medium mt-1">{noteError}</p>}
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )}

                        <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Complete Closing Submission
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
    const [isCloseTillOpen, setIsCloseTillOpen] = useState(false);
    
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const studentMap = useMemo(() => new Map(students?.map(s => [s.uid, s])), [students]);
    const classMap = useMemo(() => new Map(classes?.map(c => [c.id, c.name])), [classes]);

    const tillQuery = useMemoFirebase(() => (user && schoolId && firestore) ? query(collection(firestore!, 'tills'), where('schoolId', '==', schoolId), where('accountantId', '==', user.uid), where('status', '==', 'Open')) : null, [firestore, user, schoolId]);
    const { data: openTills, isLoading: isLoadingTills, forceRefetch } = useCollection<Till>(tillQuery);
    const activeTill = openTills?.[0];

    const transactionsQuery = useMemoFirebase(() => (activeTill && firestore) ? query(collection(firestore!, `tills/${activeTill.id}/transactions`), orderBy('timestamp', 'desc')) : null, [firestore, activeTill]);
    const { data: transactions, isLoading: isLoadingTransactions } = useCollection<TillTransaction>(transactionsQuery);

    const historyQuery = useMemoFirebase(() => (user && schoolId && firestore) ? query(collection(firestore!, 'tills'), where('schoolId', '==', schoolId), where('accountantId', '==', user.uid), where('status', '!=', 'Open'), orderBy('status'), orderBy('dateClosed', 'desc')) : null, [firestore, user, schoolId]);
    const { data: historyTills, isLoading: isLoadingHistory } = useCollection<Till>(historyQuery);

    const totalCollected = useMemo(() => {
        if (!transactions) return 0;
        return transactions
            .filter(tx => tx.status === 'Completed' || !tx.status) 
            .reduce((sum, tx) => sum + tx.amount, 0);
    }, [transactions]);

    const handleOpenTill = async () => {
        if (!user || !schoolId || !firestore) return;
        setIsSubmitting(true);
        try {
            const newTillRef = doc(collection(firestore!, 'tills'));
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

    const handlePrintReport = (till: Till, txs: TillTransaction[]) => {
        const printWindow = window.open('', '_blank', 'width=800,height=1000');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
            <head>
                <title>Till Closure Report - ${till.accountantName}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 13px;
                        padding: 40px;
                        color: #1e293b;
                        line-height: 1.5;
                    }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .bold { font-weight: bold; }
                    .header-title { font-size: 20px; font-weight: 900; color: #0f172a; margin-bottom: 5px; }
                    .header-subtitle { font-size: 13px; color: #64748b; margin-bottom: 25px; }
                    .divider { border-bottom: 1px dashed #000; margin: 15px 0; }
                    .summary-table, .tx-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    .summary-table td, .summary-table th, .tx-table td, .tx-table th { padding: 8px 12px; text-align: left; }
                    .tx-table th { background-color: #f1f5f9; border-bottom: 2px solid #e2e8f0; font-weight: bold; }
                    .tx-table td { border-bottom: 1px solid #e2e8f0; }
                    .signature-section { display: flex; justify-content: space-between; margin-top: 60px; }
                    .sig-box { width: 220px; text-align: center; }
                    .sig-line { border-top: 1px solid #475569; margin-top: 40px; font-size: 12px; color: #64748b; }
                </style>
            </head>
            <body>
                <div class="text-center">
                    <div class="header-title">GAM SCHOOLS CASH DESK</div>
                    <div class="header-subtitle">Till Closure Audit Report Summary</div>
                </div>
                
                <table style="width: 100%; margin-bottom: 20px;">
                    <tr>
                        <td><strong>Cashier Name:</strong> ${till.accountantName}</td>
                        <td class="text-right"><strong>Till Status:</strong> ${till.status}</td>
                    </tr>
                    <tr>
                        <td><strong>Date Opened:</strong> ${formatDateSafe(till.dateOpened)}</td>
                        <td class="text-right"><strong>Date Closed:</strong> ${formatDateSafe(till.dateClosed)}</td>
                    </tr>
                </table>

                <div class="divider"></div>
                
                <div class="bold" style="font-size: 14px;">FINANCIAL METRICS SUMMARY</div>
                <table class="summary-table" style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px;">
                    <tr>
                        <td>Expected Digital Balance:</td>
                        <td class="text-right">GH₵${(till.expectedBalance ?? till.currentBalance ?? 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Actual Physical Cash Counted:</td>
                        <td class="text-right">GH₵${(till.actualCashCounted ?? till.closingBalance ?? 0).toFixed(2)}</td>
                    </tr>
                    <tr style="font-weight: bold;">
                        <td>Discrepancy (Variance):</td>
                        <td class="text-right">GH₵${(till.discrepancy ?? 0).toFixed(2)}</td>
                    </tr>
                </table>

                ${till.discrepancyNote ? `
                    <div style="margin-top: 15px; border: 1px solid #fde68a; background-color: #fffbeb; padding: 10px; border-radius: 6px;">
                        <strong>Explanation Note:</strong> ${till.discrepancyNote}
                    </div>
                ` : ''}

                <div class="divider" style="margin-top: 30px;"></div>
                
                <div class="bold" style="font-size: 14px;">TILL LOG RECORD SHEET</div>
                <table class="tx-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th class="text-right">Amount (GH₵)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${txs.map(tx => `
                            <tr>
                                <td>${formatDateSafe(tx.timestamp)}</td>
                                <td>${tx.description}</td>
                                <td>${tx.status || 'Completed'}</td>
                                class="text-right" <td class="text-right">${tx.amount.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="signature-section">
                    <div class="sig-box">
                        <div class="sig-line">Cashier Signature</div>
                    </div>
                    <div class="sig-box">
                        <div class="sig-line">Auditor/Director Signature</div>
                    </div>
                </div>

                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    const filteredTransactions = useMemo(() => {
        if (!transactions) return [];
        return transactions.filter(tx => {
            const matchesSearch = tx.description.toLowerCase().includes(search.toLowerCase()) || 
                                 (tx.studentName && tx.studentName.toLowerCase().includes(search.toLowerCase()));
            const matchesStatus = statusFilter === 'All' || 
                                 (statusFilter === 'Pending' && tx.status === 'Pending Adjustment') ||
                                 (statusFilter === 'Completed' && (tx.status === 'Completed' || !tx.status));
            return matchesSearch && matchesStatus;
        });
    }, [transactions, search, statusFilter]);

    if (isLoadingTills) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin"/></div>
    }

    return (
        <Tabs defaultValue="active">
            <TabsList className="bg-slate-100 p-1 rounded-xl">
                <TabsTrigger value="active" className="rounded-lg font-bold">Active Working Register</TabsTrigger>
                <TabsTrigger value="history" className="rounded-lg font-bold">My Till Submissions</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
                 {!activeTill ? (
                    <Card className="text-center border-emerald-100/80 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-slate-800 text-lg">No Active Register Opened</CardTitle>
                            <CardDescription>You do not have a currently active cash till session. Click open below to start.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button 
                                onClick={handleOpenTill} 
                                disabled={isSubmitting}
                                className="bg-emerald-600 hover:bg-emerald-700 font-bold transition-all hover:scale-105"
                            >
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Coins className="mr-2 h-4 w-4"/>} 
                                Open Active Till Register
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                    {/* Active Till Details */}
                    {activeTill.directorApproval?.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 text-red-800 text-xs shadow-sm mb-4">
                            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 animate-pulse mt-0.5"/>
                            <div>
                                <span className="font-extrabold block text-sm mb-0.5">Till Closing Rejected by Auditor</span>
                                <span className="text-slate-600 font-semibold">{activeTill.directorApproval.rejectionReason}</span>
                                <span className="block text-slate-500 text-[10px] mt-1">Please review the logs, adjust cash balances, and re-submit.</span>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card className="md:col-span-2 border-emerald-100 shadow-sm flex flex-col justify-between p-5 bg-gradient-to-r from-slate-900 to-slate-850 text-white">
                            <div>
                                <Badge className="bg-emerald-500 text-white font-bold mb-2">ACTIVE CASH DESK</Badge>
                                <h3 className="text-lg font-bold text-slate-100">Till Registry: #{activeTill.id.substring(0, 8).toUpperCase()}</h3>
                                <p className="text-xs text-slate-400 mt-1">Session opened: {activeTill.dateOpened ? formatDateSafe(activeTill.dateOpened) : 'N/A'}</p>
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Button variant="ghost" onClick={() => setIsAdjustmentOpen(true)} className="border border-white/20 text-white hover:bg-white/10 hover:text-white h-9 text-xs font-bold bg-transparent">
                                    Manual Cash Adjustment
                                </Button>
                                <Button 
                                    onClick={() => handlePrintReport(activeTill, transactions || [])}
                                    variant="ghost"
                                    className="border border-white/20 text-white hover:bg-white/10 hover:text-white h-9 text-xs font-bold bg-transparent"
                                >
                                    <Printer className="h-3.5 w-3.5 mr-1"/> Print Audit
                                </Button>
                                <Button 
                                    onClick={() => setIsCloseTillOpen(true)} 
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex-1 h-9 text-xs"
                                >
                                    Submit Till Audit Reports
                                </Button>
                            </div>
                        </Card>

                        <Card className="border-emerald-100 shadow-md bg-emerald-50/50 flex flex-col justify-center items-center p-6 text-center border-l-4 border-l-emerald-600">
                            <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Estimated Cash In Till</span>
                            <span className="text-4xl font-black text-emerald-800 mt-2">GH₵{totalCollected.toFixed(2)}</span>
                            <p className="text-[10px] text-muted-foreground mt-2 font-medium">Accumulating {transactions?.length || 0} financial events today</p>
                        </Card>
                    </div>

                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between gap-4 flex-wrap">
                            <div>
                                <CardTitle className="text-slate-850 font-bold text-md">Daily Ledger History</CardTitle>
                                <CardDescription className="text-xs">Individual inflows, outflows, and adjustments for this session.</CardDescription>
                            </div>
                            <div className="flex gap-2 items-center flex-wrap">
                                <div className="relative w-48">
                                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                    <Input placeholder="Find transaction..." size={10} className="pl-8 text-xs h-8 bg-white" value={search} onChange={e => setSearch(e.target.value)} />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-28 text-xs h-8"><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Transactions</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Pending">Pending Audit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="w-full overflow-x-auto">
                                <Table className="min-w-[650px]">
                                    <TableHeader className="bg-slate-50/75">
                                    <TableRow>
                                        <TableHead className="text-xs pl-6 font-bold">Time</TableHead>
                                        <TableHead className="text-xs font-bold">Payer details</TableHead>
                                        <TableHead className="text-xs font-bold">Description Reference</TableHead>
                                        <TableHead className="text-xs font-bold">Status</TableHead>
                                        <TableHead className="text-xs text-right pr-6 font-bold">Amount (GH₵)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoadingTransactions ? (
                                        <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-600"/></TableCell></TableRow>
                                    ) : filteredTransactions.length === 0 ? (
                                        <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground text-xs">No transactions logged matching filters.</TableCell></TableRow>
                                    ) : (
                                        filteredTransactions.map(tx => {
                                            const student = tx.studentId ? studentMap.get(tx.studentId) : null;
                                            const className = student ? classMap.get(student.classId) : null;
                                            const isAdjustment = tx.type === 'Adjustment';
                                            const isOutflow = tx.amount < 0;
                                            return (
                                                <TableRow key={tx.id} className="hover:bg-slate-50/50">
                                                    <TableCell className="text-xs text-slate-500 pl-6">{tx.timestamp ? format(tx.timestamp.toDate(), 'p') : 'N/A'}</TableCell>
                                                    <TableCell>
                                                        {student ? (
                                                            <div>
                                                                <div className="font-semibold text-slate-800 text-xs">{student.firstName} {student.lastName}</div>
                                                                <div className="text-[10px] text-slate-400">{className}</div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-xs font-semibold text-slate-800">{tx.studentName || '-'}</div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-xs text-slate-500 max-w-xs truncate">{tx.description}</TableCell>
                                                    <TableCell>
                                                        <Badge 
                                                            variant={(tx.status === 'Completed' || !tx.status) ? 'default' : 'outline'}
                                                            className={`text-[9px] uppercase font-black ${tx.status === 'Pending Adjustment' ? 'bg-amber-100 text-amber-800 border-amber-300' : ''}`}
                                                        >
                                                            {tx.status || 'Completed'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className={`text-right font-extrabold pr-6 text-sm ${isOutflow ? 'text-red-600' : 'text-slate-800'}`}>
                                                        {isOutflow ? '-' : ''}GH₵{Math.abs(tx.amount).toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <TillAdjustmentDialog 
                        open={isAdjustmentOpen} 
                        onOpenChange={setIsAdjustmentOpen} 
                        tillId={activeTill.id} 
                        onSuccess={forceRefetch} 
                    />

                    {isCloseTillOpen && (
                        <CloseTillDialog
                            open={isCloseTillOpen}
                            onOpenChange={setIsCloseTillOpen}
                            expectedBalance={totalCollected}
                            activeTill={activeTill}
                            onSubmitComplete={forceRefetch}
                        />
                    )}
                    </>
                )}
            </TabsContent>

            <TabsContent value="history" className="mt-4">
                 <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-slate-800 text-md font-bold">Till Submission Audit Logs</CardTitle>
                        <CardDescription className="text-xs">Summary of your historical submissions and cash desk closure sheets.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="w-full overflow-x-auto">
                            <Table className="min-w-[650px]">
                                <TableHeader className="bg-slate-50/75">
                                    <TableRow>
                                        <TableHead className="pl-6 font-bold text-xs">Date Opened</TableHead>
                                        <TableHead className="font-bold text-xs">Date Closed</TableHead>
                                        <TableHead className="font-bold text-xs">Approval Status</TableHead>
                                        <TableHead className="text-right font-bold text-xs">Expected Cash</TableHead>
                                        <TableHead className="text-right font-bold text-xs">Counted Cash</TableHead>
                                        <TableHead className="text-right pr-6 font-bold text-xs">Variance (GH₵)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoadingHistory ? (
                                        <TableRow><TableCell colSpan={6} className="text-center py-10"><Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-600"/></TableCell></TableRow>
                                    ) : historyTills && historyTills.length > 0 ? (
                                        historyTills.map(till => {
                                            const hasVariance = (till.discrepancy || 0) !== 0;
                                            return (
                                                <TableRow key={till.id} onClick={() => setSelectedTill(till)} className="cursor-pointer hover:bg-slate-50/50">
                                                    <TableCell className="pl-6 text-xs text-slate-700">{till.dateOpened ? formatDateOnlySafe(till.dateOpened) : 'N/A'}</TableCell>
                                                    <TableCell className="text-xs text-slate-500">{till.dateClosed ? formatDateOnlySafe(till.dateClosed) : 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <Badge 
                                                            variant={till.status === 'Closed' ? 'default' : 'outline'}
                                                            className={till.status === 'PendingApproval' ? 'bg-amber-105 text-amber-800 border-amber-300' : ''}
                                                        >
                                                            {till.status === 'PendingApproval' ? 'Pending Approval' : till.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold text-slate-600 text-xs">GH₵{(till.expectedBalance ?? till.currentBalance ?? 0).toFixed(2)}</TableCell>
                                                    <TableCell className="text-right font-extrabold text-slate-800 text-xs">GH₵{(till.actualCashCounted ?? till.closingBalance ?? 0).toFixed(2)}</TableCell>
                                                    <TableCell className={`text-right font-black pr-6 text-xs ${hasVariance ? 'text-amber-600' : 'text-green-600'}`}>
                                                        GH₵{(till.discrepancy ?? 0).toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-12 text-slate-400 text-sm">No historical closed registers found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                 </Card>
            </TabsContent>
        </Tabs>
    );
}

// --- Detail Audit Review Dialog ---
function TillDetailDialog({ till, open, onOpenChange, onUpdate, students, classes }: { 
    till: Till | null, 
    open: boolean, 
    onOpenChange: (open: boolean) => void, 
    onUpdate: () => void,
    students: Student[] | null,
    classes: Class[] | null
}) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { role } = useRole();
    const { toast } = useToast();
    
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [rejectionNote, setRejectionNote] = useState('');
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const studentMap = useMemo(() => new Map(students?.map(s => [s.uid, s])), [students]);
    const classMap = useMemo(() => new Map(classes?.map(c => [c.id, c.name])), [classes]);

    const transactionsQuery = useMemoFirebase(() => ((till && firestore) ? query(collection(firestore!, `tills/${till.id}/transactions`), orderBy('timestamp', 'desc')) : null), [firestore, till]);
    const { data: transactions, isLoading: isLoadingTransactions, forceRefetch } = useCollection<TillTransaction>(transactionsQuery);

    if (!till) return null;

    const canApprove = role === 'Director' || role === 'Administrator';
    const pendingAdjustments = transactions?.filter(tx => tx.status === 'Pending Adjustment') || [];

    const handleAdjustmentDecision = async (tx: TillTransaction, decision: 'Approve' | 'Reject') => {
        if (!user || !firestore) return;
        setIsProcessing(tx.id);
        try {
            await runTransaction(firestore, async (transaction) => {
                const tillRef = doc(firestore, 'tills', till.id);
                const txRef = doc(firestore, `tills/${till.id}/transactions`, tx.id);

                const tillDoc = await transaction.get(tillRef);
                if (!tillDoc.exists()) throw new Error("Till does not exist.");

                if (decision === 'Approve') {
                    transaction.update(txRef, { status: 'Completed', approverId: user.uid, approverName: user.displayName, decisionAt: serverTimestamp() });
                    // Increment both currentBalance and expectedBalance of the till
                    const currentBalance = (tillDoc.data().currentBalance || 0) + tx.amount;
                    const expectedBalance = (tillDoc.data().expectedBalance || 0) + tx.amount;
                    const discrepancy = (tillDoc.data().actualCashCounted || 0) - expectedBalance;
                    
                    transaction.update(tillRef, { 
                        currentBalance: currentBalance,
                        expectedBalance: expectedBalance,
                        discrepancy: discrepancy
                    });
                } else { 
                    transaction.update(txRef, { status: 'Rejected', approverId: user.uid, approverName: user.displayName, decisionAt: serverTimestamp() });
                }
            });
            toast({ title: `Adjustment ${decision.toLowerCase()}d` });
            forceRefetch();
            onUpdate();
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsProcessing(null);
        }
    };
    
    const handleTillDecision = async (action: 'Approve' | 'Reject') => {
        if (!user || !firestore) return;
        setIsProcessing('main_till');
        const tillRef = doc(firestore, 'tills', till.id);
        
        try {
            if (action === 'Approve') {
                await updateDoc(tillRef, {
                    status: 'Closed',
                    'directorApproval.directorId': user.uid,
                    'directorApproval.directorName': user.displayName || user.email,
                    'directorApproval.approvedAt': serverTimestamp(),
                    dateClosed: serverTimestamp(),
                });
                toast({ title: 'Approved', description: `Till has been approved and closed.` });
            } else { 
                await updateDoc(tillRef, {
                    status: 'Open', 
                    'directorApproval.rejectionReason': rejectionNote || 'Rejected by Director. Please verify manual transaction adjustments.',
                });
                toast({ title: 'Rejected', description: `Till has been returned to Accountant.` });
                setIsRejectOpen(false);
            }
             onOpenChange(false);
             onUpdate();
        } catch(e: any) {
             toast({ variant: 'destructive', title: 'Error', description: e.message });
        } finally {
            setIsProcessing(null);
        }
    };

    const handlePrintReport = () => {
        const printWindow = window.open('', '_blank', 'width=800,height=1000');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
            <head>
                <title>Till Closure Audit - ${till.accountantName}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 13px;
                        padding: 40px;
                        color: #1e293b;
                        line-height: 1.5;
                    }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .bold { font-weight: bold; }
                    .header-title { font-size: 20px; font-weight: 900; color: #0f172a; margin-bottom: 5px; }
                    .header-subtitle { font-size: 13px; color: #64748b; margin-bottom: 25px; }
                    .divider { border-bottom: 1px dashed #000; margin: 15px 0; }
                    .summary-table, .tx-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    .summary-table td, .summary-table th, .tx-table td, .tx-table th { padding: 8px 12px; text-align: left; }
                    .tx-table th { background-color: #f1f5f9; border-bottom: 2px solid #e2e8f0; font-weight: bold; }
                    .tx-table td { border-bottom: 1px solid #e2e8f0; }
                    .signature-section { display: flex; justify-content: space-between; margin-top: 60px; }
                    .sig-box { width: 220px; text-align: center; }
                    .sig-line { border-top: 1px solid #475569; margin-top: 40px; font-size: 12px; color: #64748b; }
                </style>
            </head>
            <body>
                <div class="text-center">
                    <div class="header-title">GAM SCHOOLS CASH DESK</div>
                    <div class="header-subtitle">Till Closure Audit Report Summary</div>
                </div>
                
                <table style="width: 100%; margin-bottom: 20px;">
                    <tr>
                        <td><strong>Cashier Name:</strong> ${till.accountantName}</td>
                        <td class="text-right"><strong>Till Status:</strong> ${till.status}</td>
                    </tr>
                    <tr>
                        <td><strong>Date Opened:</strong> ${formatDateSafe(till.dateOpened)}</td>
                        <td class="text-right"><strong>Date Closed:</strong> ${formatDateSafe(till.dateClosed)}</td>
                    </tr>
                </table>

                <div class="divider"></div>
                
                <div class="bold" style="font-size: 14px;">FINANCIAL METRICS SUMMARY</div>
                <table class="summary-table" style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px;">
                    <tr>
                        <td>Expected Digital Balance:</td>
                        <td class="text-right">GH₵${(till.expectedBalance ?? till.currentBalance ?? 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Actual Physical Cash Counted:</td>
                        <td class="text-right">GH₵${(till.actualCashCounted ?? till.closingBalance ?? 0).toFixed(2)}</td>
                    </tr>
                    <tr style="font-weight: bold;">
                        <td>Discrepancy (Variance):</td>
                        <td class="text-right">GH₵${(till.discrepancy ?? 0).toFixed(2)}</td>
                    </tr>
                </table>

                ${till.discrepancyNote ? `
                    <div style="margin-top: 15px; border: 1px solid #fde68a; background-color: #fffbeb; padding: 10px; border-radius: 6px;">
                        <strong>Explanation Note:</strong> ${till.discrepancyNote}
                    </div>
                ` : ''}

                <div class="divider" style="margin-top: 30px;"></div>
                
                <div class="bold" style="font-size: 14px;">TILL LOG RECORD SHEET</div>
                <table class="tx-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th class="text-right">Amount (GH₵)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(transactions || []).map(tx => `
                            <tr>
                                <td>${formatDateSafe(tx.timestamp)}</td>
                                <td>${tx.description}</td>
                                <td>${tx.status || 'Completed'}</td>
                                <td class="text-right">${tx.amount.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="signature-section">
                    <div class="sig-box">
                        <div class="sig-line">Cashier Signature</div>
                    </div>
                    <div class="sig-box">
                        <div class="sig-line">Auditor/Director Signature</div>
                    </div>
                </div>

                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    const filteredTransactions = (transactions || []).filter(tx => {
        const matchesSearch = tx.description.toLowerCase().includes(search.toLowerCase()) || 
                             (tx.studentName && tx.studentName.toLowerCase().includes(search.toLowerCase()));
        const matchesStatus = statusFilter === 'All' || 
                             (statusFilter === 'Pending' && tx.status === 'Pending Adjustment') ||
                             (statusFilter === 'Completed' && (tx.status === 'Completed' || !tx.status));
        return matchesSearch && matchesStatus;
    });

    const isPendingApproval = till.status === 'PendingApproval';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
                <DialogHeader className="flex flex-row justify-between items-center gap-4 border-b pb-4">
                    <div>
                        <DialogTitle className="text-slate-800 font-bold">Till Submission Audit Review</DialogTitle>
                        <DialogDescription className="text-xs">
                            Submitted by {till.accountantName} for cash desk session.
                        </DialogDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handlePrintReport} className="h-8 border-slate-300">
                        <Printer className="h-4 w-4 mr-1 text-slate-500" />
                        Print Closing Report
                    </Button>
                </DialogHeader>

                {/* Audit variance summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Expected Balance</span>
                        <span className="text-md font-bold text-slate-700">GH₵{(till.expectedBalance ?? till.currentBalance ?? 0).toFixed(2)}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Cash Counted</span>
                        <span className="text-md font-bold text-emerald-800">GH₵{(till.actualCashCounted ?? till.closingBalance ?? 0).toFixed(2)}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Discrepancy Variance</span>
                        <span className={`text-md font-black ${(till.discrepancy || 0) === 0 ? 'text-green-600' : 'text-red-650'}`}>
                            GH₵{(till.discrepancy || 0).toFixed(2)}
                        </span>
                    </div>
                    <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Audit Explanation</span>
                        <span className="text-xs text-slate-500 block truncate font-medium italic" title={till.discrepancyNote}>
                            {till.discrepancyNote || 'No explanation needed'}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center gap-4 mt-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Registered Desk Receipts Log</span>
                    <div className="flex gap-2 items-center">
                        <div className="relative w-40">
                            <Search className="absolute left-2.5 top-2 h-3 w-3 text-slate-400" />
                            <Input placeholder="Search logs..." className="pl-8 text-[11px] h-7 w-40" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-28 text-[11px] h-7"><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Logs</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Pending">Pending Audit</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="max-h-[350px] overflow-y-auto overflow-x-auto pr-2 border rounded-xl shadow-inner">
                    <Table className="min-w-[650px]">
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="text-[11px] font-bold py-2">Time</TableHead>
                                <TableHead className="text-[11px] font-bold py-2">Payer name</TableHead>
                                <TableHead className="text-[11px] font-bold py-2">Details Description</TableHead>
                                <TableHead className="text-[11px] font-bold py-2">Status</TableHead>
                                <TableHead className="text-[11px] text-right font-bold py-2">Amount</TableHead>
                                <TableHead className="text-[11px] text-right font-bold py-2 pr-4">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoadingTransactions ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-10"><Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-600"/></TableCell></TableRow> 
                            ) : filteredTransactions.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-xs">No transaction records found matching filters.</TableCell></TableRow>
                            ) : (
                                filteredTransactions.map(tx => {
                                    const student = tx.studentId ? studentMap.get(tx.studentId) : null;
                                    const className = student ? classMap.get(student.classId) : null;
                                    return (
                                        <TableRow key={tx.id} className={tx.status === 'Pending Adjustment' ? 'bg-amber-50/70' : 'hover:bg-slate-50/50'}>
                                            <TableCell className="text-xs text-slate-500">{tx.timestamp ? format(tx.timestamp.toDate(), 'p') : 'N/A'}</TableCell>
                                            <TableCell>
                                                {student ? (
                                                    <div>
                                                        <div className="font-semibold text-slate-800 text-xs">{student.firstName} {student.lastName}</div>
                                                        <div className="text-[10px] text-slate-400">{className}</div>
                                                    </div>
                                                ) : (
                                                    <div className="text-xs font-semibold text-slate-800">{tx.studentName || '-'}</div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-500 max-w-xs truncate">{tx.description}</TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant={(tx.status === 'Completed' || !tx.status) ? 'default' : 'outline'}
                                                    className={tx.status === 'Pending Adjustment' ? 'bg-amber-100 text-amber-800 border-amber-300' : ''}
                                                >
                                                    {tx.status || 'Completed'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className={`text-right font-extrabold text-xs ${tx.amount < 0 ? 'text-red-500' : ''}`}>GH₵{tx.amount.toFixed(2)}</TableCell>
                                            <TableCell className="text-right pr-4">
                                                {tx.status === 'Pending Adjustment' && canApprove && (
                                                    <div className="flex gap-1.5 justify-end">
                                                        <Button size="sm" variant="outline" className="border-red-300 text-red-650 hover:bg-red-50 h-7 text-[10px] px-2 font-bold" onClick={() => handleAdjustmentDecision(tx, 'Reject')} disabled={isProcessing === tx.id}>Reject</Button>
                                                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-7 text-[10px] px-2 text-white font-bold" onClick={() => handleAdjustmentDecision(tx, 'Approve')} disabled={isProcessing === tx.id}>Approve</Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {till.status !== 'Closed' && (
                    <DialogFooter className="border-t pt-4 mt-2">
                        <div className="w-full flex justify-end gap-2">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>Close Review</Button>
                            {canApprove && isPendingApproval && (
                                <>
                                    <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                                        <Button variant="destructive" onClick={() => setIsRejectOpen(true)}>Reject Till Submission</Button>
                                        <DialogContent className="sm:max-w-[400px]">
                                            <DialogHeader>
                                                <DialogTitle>Rejection Notes</DialogTitle>
                                                <DialogDescription>Describe the discrepancy or issues for the accountant to review.</DialogDescription>
                                            </DialogHeader>
                                            <div className="py-2">
                                                <Label>Explanation / Auditor Comments</Label>
                                                <Textarea 
                                                    value={rejectionNote} 
                                                    onChange={e => setRejectionNote(e.target.value)} 
                                                    placeholder="Specify what balances need alignment..."
                                                    className="mt-1"
                                                    required
                                                />
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
                                                <Button 
                                                    variant="destructive"
                                                    onClick={() => handleTillDecision('Reject')} 
                                                    disabled={isProcessing === 'main_till' || !rejectionNote.trim()}
                                                >
                                                    Confirm Rejection
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button disabled={pendingAdjustments.length > 0 || isProcessing === 'main_till'} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                                                Approve & Close Session
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Approve & Close Register Desk?</AlertDialogTitle>
                                                <AlertDialogDescription>This will reconcile and close the cashier register session. All transactions will be archived permanently.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleTillDecision('Approve')} className="bg-emerald-600 hover:bg-emerald-700">Confirm Approve</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </>
                            )}
                        </div>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}

// --- Director's View: Approve/Reject Tills ---
function DirectorTillView({ setSelectedTill }: { setSelectedTill: (till: Till) => void }) {
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();

    const pendingTillsQuery = useMemoFirebase(() => (schoolId && firestore) ? query(collection(firestore, 'tills'), where('schoolId', '==', schoolId), where('status', '==', 'PendingApproval')) : null, [firestore, schoolId]);
    const { data: pendingTills, isLoading: isLoadingPending, forceRefetch: forceRefetchPending } = useCollection<Till>(pendingTillsQuery);
    
    const closedTillsQuery = useMemoFirebase(() => (schoolId && firestore) ? query(collection(firestore, 'tills'), where('schoolId', '==', schoolId), where('status', '==', 'Closed'), orderBy('dateClosed', 'desc')) : null, [firestore, schoolId]);
    const { data: closedTills, isLoading: isLoadingClosed } = useCollection<Till>(closedTillsQuery);

    const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(
        useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId])
    );
    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(
        useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId])
    );

    const [reviewingTill, setReviewingTill] = useState<Till | null>(null);

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
            <Card className="border-slate-200 shadow-md">
                <CardHeader className="pb-3 border-b bg-slate-50/50">
                    <CardTitle className="text-slate-800 font-bold text-lg">Cash Desk Submissions</CardTitle>
                    <CardDescription className="text-xs">Reconcile accountant cash logs and authorize closed registry reports.</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <Tabs defaultValue="pending">
                        <TabsList className="bg-slate-100 p-1 rounded-xl">
                            <TabsTrigger value="pending" className="rounded-lg font-bold">Pending Review ({sortedPending.length})</TabsTrigger>
                            <TabsTrigger value="history" className="rounded-lg font-bold">Closed Desk History</TabsTrigger>
                        </TabsList>
                        <TabsContent value="pending" className="mt-4">
                            <div className="w-full overflow-x-auto border rounded-xl">
                                <Table className="min-w-[650px]">
                                    <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-bold text-xs pl-4">Accountant Cashier</TableHead>
                                        <TableHead className="font-bold text-xs">Date Opened</TableHead>
                                        <TableHead className="text-right font-bold text-xs">Expected Cash</TableHead>
                                        <TableHead className="text-right font-bold text-xs">Physical Count</TableHead>
                                        <TableHead className="text-right font-bold text-xs">Discrepancy</TableHead>
                                        <TableHead className="text-right pr-4 font-bold text-xs">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={6} className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin mx-auto text-emerald-600"/></TableCell></TableRow>
                                    ) : sortedPending.length === 0 ? (
                                        <TableRow><TableCell colSpan={6} className="text-center py-12 text-slate-400 text-sm">No cash tills are currently pending approval.</TableCell></TableRow>
                                    ) : (
                                        sortedPending.map(till => {
                                            const variance = till.discrepancy || 0;
                                            return (
                                                <TableRow key={till.id} className="hover:bg-slate-50/50">
                                                    <TableCell className="font-semibold text-slate-800 text-xs pl-4">{till.accountantName}</TableCell>
                                                    <TableCell className="text-xs text-slate-500">{till.dateOpened ? formatDateOnlySafe(till.dateOpened) : 'N/A'}</TableCell>
                                                    <TableCell className="text-right font-semibold text-slate-650 text-xs">GH₵{(till.expectedBalance ?? till.currentBalance ?? 0).toFixed(2)}</TableCell>
                                                    <TableCell className="text-right font-extrabold text-slate-800 text-xs">GH₵{(till.actualCashCounted ?? till.closingBalance ?? 0).toFixed(2)}</TableCell>
                                                    <TableCell className={`text-right font-black text-xs ${variance === 0 ? 'text-green-600' : 'text-red-650'}`}>
                                                        GH₵{variance.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-4">
                                                        <Button size="sm" onClick={() => setReviewingTill(till)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 text-xs">Review Report</Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                            </div>
                        </TabsContent>
                        <TabsContent value="history" className="mt-4">
                            <div className="w-full overflow-x-auto border rounded-xl">
                                <Table className="min-w-[650px]">
                                    <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-bold text-xs pl-4">Accountant Cashier</TableHead>
                                        <TableHead className="font-bold text-xs">Date Closed</TableHead>
                                        <TableHead className="text-right font-bold text-xs">Closing Cash Balance</TableHead>
                                        <TableHead className="text-right font-bold text-xs">Variance Discrepancy</TableHead>
                                        <TableHead className="pr-4 font-bold text-xs text-right">Authorized Auditor</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin mx-auto text-emerald-600"/></TableCell></TableRow>
                                    ) : sortedClosed.length === 0 ? (
                                        <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-400 text-sm">No approved tills in history logs.</TableCell></TableRow>
                                    ) : (
                                        sortedClosed.map(till => (
                                            <TableRow key={till.id} onClick={() => setReviewingTill(till)} className="cursor-pointer hover:bg-slate-50/50">
                                                <TableCell className="font-semibold text-slate-800 text-xs pl-4">{till.accountantName}</TableCell>
                                                <TableCell className="text-xs text-slate-500">{till.dateClosed ? formatDateSafe(till.dateClosed) : 'N/A'}</TableCell>
                                                <TableCell className="text-right font-extrabold text-slate-850 text-xs">GH₵{(till.actualCashCounted ?? till.closingBalance ?? 0).toFixed(2)}</TableCell>
                                                <TableCell className={`text-right font-black text-xs ${(till.discrepancy || 0) === 0 ? 'text-green-600' : 'text-amber-600'}`}>
                                                    GH₵{(till.discrepancy || 0).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="pr-4 text-xs font-medium text-slate-600 text-right">{till.directorApproval?.directorName || 'Director Admin'}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            </div>
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

// --- MAIN CASH TILL PAGE ---
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
    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role || '');
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
            
            {/* Emerald Gradient Banner Header */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 shadow-lg border border-emerald-900/50">
                <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
                    <Wallet className="w-64 h-64" />
                </div>
                <div className="relative z-10 space-y-2">
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2 py-0.5 text-[10px]">RECONCILIATION & AUDITS</Badge>
                    <h1 className="text-3xl font-black tracking-tight">Cash Desk Registers & Till Reconciliations</h1>
                    <p className="text-emerald-100/70 text-sm max-w-xl">Monitor active accountant registers, audit physical cash discrepancy variance reports, and authorize end-of-day closure summaries.</p>
                </div>
            </div>

            {isLoading && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-emerald-650"/></div>}
            
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
