'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc, serverTimestamp, Timestamp, increment } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, CheckCircle2, CalendarIcon, Coins, AlertCircle, RefreshCw, Users, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateNextReceiptId, sendPaymentNotificationToParent } from '@/lib/student-utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

type BillRecord = {
    id: string;
    studentId: string;
    studentName: string;
    classId: string;
    description: string;
    billedAmount: number;
    amountPaid: number;
    waiverAmount?: number;
    type: string;
};

interface AuditSummary {
    totalPresent: number;
    billsFound: number;
    missingInvoices: number;
    alreadyPaid: number;
    missingStudents: { id: string, name: string }[];
}

export default function BulkDailyReceiptsPage() {
    const firestore = useFirestore();
    const { user } = useUser();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();

    const [date, setDate] = useState<Date>(new Date());
    const [serviceType, setServiceType] = useState<'Canteen' | 'Transport'>('Canteen');
    const [selectedClassId, setSelectedClassId] = useState<string>('all');
    
    const [classes, setClasses] = useState<any[]>([]);
    const [pendingBills, setPendingBills] = useState<BillRecord[]>([]);
    const [paymentData, setPaymentData] = useState<Record<string, number>>({});
    const [searchTerm, setSearchTerm] = useState('');
    
    const [batchNarration, setBatchNarration] = useState('');
    const [rowNarrations, setRowNarrations] = useState<Record<string, string>>({});
    
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [auditSummary, setAuditSummary] = useState<AuditSummary | null>(null);
    const [showMissingNames, setShowMissingNames] = useState(false);

    // 1. Load Classes for Dropdown
    useEffect(() => {
        if (!firestore || !schoolId) return;
        const fetchClasses = async () => {
            const q = query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
            const snap = await getDocs(q);
            setClasses(snap.docs.map(d => ({ id: d.id, name: d.data().name })));
        };
        fetchClasses();
    }, [firestore, schoolId]);

    // 2. Load the REAL unpaid bills for this date + Cross-reference Attendance
    const handleLoadBills = async () => {
        if (!firestore || !schoolId) {
            toast({ variant: 'destructive', title: "System Error", description: "School ID not found. Please refresh." });
            return;
        }

        setIsLoading(true);
        setPendingBills([]);
        setPaymentData({});
        setAuditSummary(null);
        setSearchTerm('');
        setShowMissingNames(false);
        setBatchNarration('');
        setRowNarrations({});

        try {
            const dayStart = startOfDay(date);
            const dayEnd = endOfDay(date);
            
            // A. FETCH ATTENDANCE (To see who should have been billed)
            const attQuery = query(
                collection(firestore, 'attendance'),
                where('schoolId', '==', schoolId),
                where('date', '==', Timestamp.fromDate(dayStart)),
                where('status', 'in', ['Present', 'Late'])
            );
            const attSnap = await getDocs(attQuery);
            const studentsPresent = attSnap.docs
                .map(d => d.data())
                .filter(d => selectedClassId === 'all' || d.classId === selectedClassId);

            // B. FETCH EXISTING BILLS
            const billsQuery = query(
                collection(firestore, 'financialRecords'),
                where('schoolId', '==', schoolId),
                where('dueDate', '>=', Timestamp.fromDate(dayStart)),
                where('dueDate', '<=', Timestamp.fromDate(dayEnd))
            );
            const billsSnap = await getDocs(billsQuery);
            
            const relevantBills: BillRecord[] = [];
            const newPaymentData: Record<string, number> = {};
            
            // Map of studentId -> existing bill for this service
            const existingBillsMap = new Map<string, any>();

            billsSnap.docs.forEach(d => {
                const data = d.data();
                const type = (data.type || '').toLowerCase();
                const isCorrectService = type.includes(serviceType.toLowerCase());
                
                if (isCorrectService) {
                    existingBillsMap.set(data.studentId, { id: d.id, ...data });

                    const billed = Number(data.billedAmount) || 0;
                    const paid = Number(data.amountPaid) || 0;
                    const waiver = Number(data.waiverAmount) || 0;
                    const balance = billed - paid - waiver;

                    const matchesClass = selectedClassId === 'all' || data.classId === selectedClassId;

                    if (balance > 0.01 && matchesClass) {
                        relevantBills.push({ id: d.id, ...data } as BillRecord);
                        newPaymentData[d.id] = parseFloat(balance.toFixed(2));
                    }
                }
            });

            // C. CALCULATE AUDIT & COLLECT NAMES
            let missingCount = 0;
            let alreadyPaidCount = 0;
            const missingList: { id: string, name: string }[] = [];

            // Get student metadata to ensure we have the names if attendance record is incomplete
            const stuSnap = await getDocs(query(collection(firestore, 'students'), where('schoolId', '==', schoolId)));
            const stuMetaMap = new Map(stuSnap.docs.map(d => [d.id, d.data()]));

            studentsPresent.forEach(att => {
                const bill = existingBillsMap.get(att.studentId);
                if (!bill) {
                    if (att.canteenMode !== 'Termly' && att.transportMode !== 'Termly') {
                        missingCount++;
                        const meta: any = stuMetaMap.get(att.studentId);
                        missingList.push({
                            id: att.studentId,
                            name: att.studentName || (meta ? `${meta.firstName} ${meta.lastName}` : 'Unknown')
                        });
                    }
                } else {
                    const balance = bill.billedAmount - (bill.amountPaid || 0) - (bill.waiverAmount || 0);
                    if (balance <= 0.01) alreadyPaidCount++;
                }
            });

            setAuditSummary({
                totalPresent: studentsPresent.length,
                billsFound: relevantBills.length,
                missingInvoices: missingCount,
                alreadyPaid: alreadyPaidCount,
                missingStudents: missingList
            });

            if (relevantBills.length === 0 && missingCount === 0) {
                toast({ 
                    title: "No Action Needed", 
                    description: "No pending bills found. Everyone present is either billed & paid or not required to pay today." 
                });
            } else {
                toast({ title: "Scanning Complete", description: `Located ${relevantBills.length} pending receipts.` });
            }

            setPendingBills(relevantBills);
            setPaymentData(newPaymentData);

        } catch (error: any) {
            console.error("Load Bills Error:", error);
            toast({ variant: 'destructive', title: "Error", description: "Could not load bills. Check your connection." });
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPendingBills = useMemo(() => {
        if (!searchTerm.trim()) return pendingBills;
        const term = searchTerm.toLowerCase().trim();
        return pendingBills.filter(bill => 
            bill.studentName.toLowerCase().includes(term) ||
            bill.description.toLowerCase().includes(term)
        );
    }, [pendingBills, searchTerm]);

    const handleProcessPayments = async () => {
        if (!firestore || !schoolId || !user) return;
        
        const billsToPay = pendingBills.filter(bill => (paymentData[bill.id] || 0) > 0);
        
        if (billsToPay.length === 0) {
            return toast({ variant: 'destructive', title: "No Payments", description: "All payment amounts are 0." });
        }

        setIsProcessing(true);

        try {
            const tillSnap = await getDocs(query(
                collection(firestore, 'tills'), 
                where('accountantId', '==', user.uid), 
                where('status', '==', 'Open'), 
                where('schoolId', '==', schoolId)
            ));

            if (tillSnap.empty) {
                toast({ variant: 'destructive', title: "No Open Till", description: "You must open a Cash Till before accepting payments." });
                setIsProcessing(false);
                return;
            }
            
            const activeTill = tillSnap.docs[0];
            const batch = writeBatch(firestore);
            let totalCollected = 0;
            let processedCount = 0;

            // Keep track of the generated payments to notify parents after batch commit
            const paymentsToNotify: {
                studentId: string;
                studentName: string;
                payAmount: number;
                description: string;
                receiptId: string;
            }[] = [];

            for (const bill of billsToPay) {
                const payAmount = Number(paymentData[bill.id]);
                const receiptId = await generateNextReceiptId(firestore, schoolId);
                
                const recordRef = doc(firestore, 'financialRecords', bill.id);
                const paymentRef = doc(firestore, 'financialRecords', bill.id, 'payments', receiptId);
                const tillTransRef = doc(collection(firestore, `tills/${activeTill.id}/transactions`));

                const newAmountPaid = (bill.amountPaid || 0) + payAmount;
                const isFullyPaid = (bill.billedAmount - newAmountPaid - (bill.waiverAmount || 0)) <= 0.01;

                const finalDescription = rowNarrations[bill.id]?.trim() || batchNarration.trim() || bill.description;

                batch.update(recordRef, {
                    amountPaid: newAmountPaid,
                    lastPaymentDate: serverTimestamp(),
                    status: isFullyPaid ? 'Paid' : 'Unpaid'
                });

                batch.set(paymentRef, {
                    id: receiptId,
                    amount: payAmount,
                    method: 'Cash',
                    paidAt: serverTimestamp(),
                    processedById: user.uid,
                    processedByName: user.displayName || user.email || 'Accountant',
                    schoolId: schoolId,
                    studentId: bill.studentId,
                    description: finalDescription,
                    notes: 'Bulk Daily Receipting'
                });

                batch.set(tillTransRef, {
                    amount: payAmount,
                    studentName: bill.studentName,
                    timestamp: serverTimestamp(),
                    type: 'Payment',
                    description: `Cash: ${finalDescription} (Receipt: ${receiptId})`,
                    status: 'Completed',
                    schoolId: schoolId
                });

                totalCollected += payAmount;
                processedCount++;

                paymentsToNotify.push({
                    studentId: bill.studentId,
                    studentName: bill.studentName,
                    payAmount,
                    description: finalDescription,
                    receiptId
                });
            }

            batch.update(doc(firestore, 'tills', activeTill.id), {
                currentBalance: increment(totalCollected)
            });

            await batch.commit();

            // Notify parents for each processed payment asynchronously
            paymentsToNotify.forEach(p => {
                sendPaymentNotificationToParent({
                    firestore,
                    schoolId,
                    studentId: p.studentId,
                    studentName: p.studentName,
                    paymentAmount: p.payAmount,
                    feeType: p.description,
                    receiptId: p.receiptId,
                    paymentMethod: 'Cash',
                    senderUid: user.uid,
                    senderName: user.displayName || user.email || 'Accountant',
                    senderRole: 'Accountant'
                }).catch(err => {
                    console.error(`Failed to send parent notification for student ${p.studentName}:`, err);
                });
            });

            toast({ title: "Payments Processed! 🎉", description: `Successfully received GH₵${totalCollected.toFixed(2)} from ${processedCount} students.` });
            
            setPendingBills([]);
            setPaymentData({});
            setAuditSummary(null);
            setSearchTerm('');
            setBatchNarration('');
            setRowNarrations({});

        } catch (error: any) {
            console.error("Process Error:", error);
            toast({ variant: 'destructive', title: "Processing Failed", description: error.message });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2 italic uppercase">
                        <Coins className="h-8 w-8 text-green-600" /> Bulk Daily Receipts
                    </h1>
                    <p className="text-muted-foreground font-medium italic">Quickly process cash payments for daily Canteen or Transport bills.</p>
                </div>
                {pendingBills.length > 0 && (
                    <div className="bg-emerald-50 border-2 border-emerald-100 p-4 rounded-2xl shadow-sm text-center min-w-[200px] animate-in zoom-in">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total Batch Cash</p>
                        <p className="text-3xl font-black text-emerald-900">
                            {"GH₵" + pendingBills.reduce((sum, b) => sum + (Number(paymentData[b.id]) || 0), 0).toFixed(2)}
                        </p>
                    </div>
                )}
            </div>

            <Card className="border-t-4 border-t-green-500 shadow-sm rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-lg">1. Load Records for Reconciliation</CardTitle>
                    <CardDescription>Fetch attendance logs and unpaid bills to generate the receipting roster.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2 w-full">
                        <Label className="text-xs font-bold uppercase text-slate-500">Service Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal border-2 h-12 bg-white', !date && 'text-muted-foreground')}>
                                    <CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
                                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus /></PopoverContent>
                        </Popover>
                    </div>
                    
                    <div className="flex-1 space-y-2 w-full">
                        <Label className="text-xs font-bold uppercase text-slate-500">Service Type</Label>
                        <Select value={serviceType} onValueChange={(v: any) => setServiceType(v)}>
                            <SelectTrigger className="bg-white border-2 h-12 font-bold"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Canteen" className="font-bold">Canteen Fees</SelectItem>
                                <SelectItem value="Transport" className="font-bold">Transport Fees</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                        <Label className="text-xs font-bold uppercase text-slate-500">Class Filter</Label>
                        <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                            <SelectTrigger className="bg-white border-2 h-12"><SelectValue placeholder="All Classes" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleLoadBills} disabled={isLoading} className="bg-green-600 hover:bg-green-700 w-full md:w-auto h-12 px-8 font-black uppercase tracking-widest text-white transition-all active:scale-95">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4"/>}
                        Scan & Find
                    </Button>
                </CardContent>
            </Card>

            {auditSummary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in duration-500">
                    <Card className="bg-blue-50 border-blue-100">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Users size={20}/></div>
                            <div>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Present Today</p>
                                <p className="text-xl font-black text-blue-900">{auditSummary.totalPresent}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-emerald-50 border-emerald-100">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Coins size={20}/></div>
                            <div>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Bills for Receipting</p>
                                <p className="text-xl font-black text-emerald-900">{auditSummary.billsFound}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-50 border-slate-200 opacity-60">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-slate-200 rounded-lg text-slate-500"><CheckCircle2 size={20}/></div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Already Paid</p>
                                <p className="text-xl font-black text-slate-800">{auditSummary.alreadyPaid}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className={cn("border-2 transition-all", auditSummary.missingInvoices > 0 ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-100 opacity-60")}>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg", auditSummary.missingInvoices > 0 ? "bg-amber-100 text-amber-600" : "bg-slate-200 text-slate-500")}><AlertCircle size={20}/></div>
                            <div>
                                <p className={cn("text-[10px] font-black uppercase tracking-widest", auditSummary.missingInvoices > 0 ? "text-amber-600" : "text-slate-500")}>Missing Invoices</p>
                                <p className={cn("text-xl font-black", auditSummary.missingInvoices > 0 ? "text-amber-900" : "text-slate-800")}>{auditSummary.missingInvoices}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {auditSummary && auditSummary.missingInvoices > 0 && (
                <Alert className="bg-amber-50 border-amber-200 border-2 rounded-2xl animate-in slide-in-from-top-2">
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <AlertTitle className="font-black text-amber-900 uppercase text-xs tracking-tight">Audit Warning: Bill/Attendance Mismatch</AlertTitle>
                                <AlertDescription className="text-amber-800 text-xs font-medium mt-1">
                                    We found {auditSummary.missingInvoices} students who were marked present but have no daily bill for {serviceType}.
                                </AlertDescription>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setShowMissingNames(!showMissingNames)}
                                className="text-amber-700 hover:bg-amber-100 font-bold text-[10px] uppercase tracking-widest h-8 px-3"
                            >
                                {showMissingNames ? <ChevronUp className="mr-1 h-3 w-3"/> : <ChevronDown className="mr-1 h-3 w-3"/>}
                                {showMissingNames ? "Hide Names" : "View Affected Students"}
                            </Button>
                        </div>

                        {showMissingNames && (
                            <div className="bg-white/50 border border-amber-200 rounded-xl p-3 animate-in fade-in slide-in-from-top-1">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    {auditSummary.missingStudents.map((s) => (
                                        <div key={s.id} className="flex flex-col p-2 bg-white rounded-lg border border-amber-100 shadow-sm">
                                            <span className="font-bold text-slate-800 text-[11px] truncate">{s.name}</span>
                                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter">ID: {s.id.slice(0,8)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <Button asChild size="sm" variant="outline" className="border-amber-300 text-amber-700 bg-white hover:bg-amber-100 font-bold rounded-xl h-9">
                                        <Link href="/dashboard/finance/settings">
                                            <RefreshCw className="mr-2 h-3 w-3" /> Sync Missing Invoices
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Alert>
            )}

            {pendingBills.length > 0 && (
                <Card className="border-t-4 border-t-indigo-600 shadow-xl rounded-[2rem] overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="bg-slate-50 border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                            <CardTitle className="text-xl">2. Review & Process Payments</CardTitle>
                            <CardDescription>Verify cash received for the found invoices.</CardDescription>
                            
                            <div className="mt-3 max-w-md">
                                <Label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Batch-wide Narration Override (Optional)</Label>
                                <Input 
                                    placeholder="Type to apply same narration to all receipts..."
                                    value={batchNarration}
                                    onChange={e => setBatchNarration(e.target.value)}
                                    className="h-9 mt-1 border-2 rounded-lg bg-white text-xs"
                                />
                            </div>
                        </div>
                        <div className="relative w-full md:w-[250px] self-end md:self-center">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                placeholder="Search by student name..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-9 h-10 border-2 rounded-xl bg-white"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="max-h-[50vh] overflow-y-auto">
                            <Table>
                                <TableHeader className="bg-white sticky top-0 shadow-sm z-10">
                                    <TableRow>
                                        <TableHead className="font-black text-[10px] uppercase tracking-widest">Student Name</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase tracking-widest w-[300px]">Description & Custom Narration</TableHead>
                                        <TableHead className="text-right font-black text-[10px] uppercase tracking-widest">{"Due (GH₵)"}</TableHead>
                                        <TableHead className="w-[180px] font-black text-[10px] uppercase tracking-widest">Cash Received</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPendingBills.map(bill => {
                                        const balance = bill.billedAmount - (bill.amountPaid || 0) - (bill.waiverAmount || 0);
                                        const currentPayment = paymentData[bill.id] || 0;
                                        
                                        return (
                                            <TableRow key={bill.id} className={cn("transition-colors", currentPayment > balance ? "bg-purple-50/30" : currentPayment > 0 ? "bg-emerald-50/30" : "")}>
                                                <TableCell className="font-bold text-slate-700">{bill.studentName}</TableCell>
                                                <TableCell className="text-xs text-slate-500">
                                                    <span className="font-medium text-slate-750">{bill.description}</span>
                                                    <Input 
                                                        placeholder="Custom override narration..."
                                                        value={rowNarrations[bill.id] ?? ''}
                                                        onChange={e => setRowNarrations(prev => ({ 
                                                            ...prev, 
                                                            [bill.id]: e.target.value 
                                                        }))}
                                                        className="h-8 mt-1 text-xs border rounded-lg bg-white"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-mono text-red-600 font-bold text-right">GH₵{balance.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <div className="relative group">
                                                        <Input 
                                                            type="number" 
                                                            min="0" step="0.01"
                                                            value={paymentData[bill.id] ?? ''}
                                                            onChange={e => setPaymentData(prev => ({ 
                                                                ...prev, 
                                                                [bill.id]: e.target.value === '' ? 0 : (parseFloat(e.target.value) || 0) 
                                                            }))}
                                                            className={cn(
                                                                "font-black text-right pr-4 border-2 transition-all",
                                                                currentPayment > balance 
                                                                    ? "border-purple-300 bg-white text-purple-700 ring-2 ring-purple-50" 
                                                                    : currentPayment > 0 
                                                                        ? "border-emerald-400 bg-white text-emerald-700 ring-2 emerald-50" 
                                                                        : "bg-slate-50 border-slate-200 text-slate-400"
                                                            )}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {filteredPendingBills.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-20 text-center text-muted-foreground italic">
                                                No records match your search.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50 border-t p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <Button variant="ghost" className="font-bold text-slate-400" onClick={() => {setPendingBills([]); setPaymentData({}); setAuditSummary(null); setSearchTerm(''); setBatchNarration(''); setRowNarrations({});}}>Clear Batch</Button>
                        <Button onClick={handleProcessPayments} disabled={isProcessing} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 h-16 px-12 text-xl font-black rounded-2xl shadow-xl shadow-indigo-200 uppercase tracking-tighter text-white">
                            {isProcessing ? <Loader2 className="mr-2 h-6 w-6 animate-spin"/> : <CheckCircle2 className="mr-2 h-6 w-6"/>}
                            {"Receive GH₵" + pendingBills.reduce((sum, b) => sum + (Number(paymentData[b.id]) || 0), 0).toFixed(2)}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
