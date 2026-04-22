'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc, serverTimestamp, Timestamp, increment } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { format, startOfDay } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, CheckCircle2, CalendarIcon, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateNextReceiptId } from '@/lib/student-utils';

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
    
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

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

    // 2. Load the REAL unpaid bills for this date
    const handleLoadBills = async () => {
        if (!firestore || !schoolId) return;
        setIsLoading(true);
        setPendingBills([]);
        setPaymentData({});

        try {
            const searchDate = startOfDay(date);
            
            // Fetch financial records matching the exact due date and schoolId
            const billsQuery = query(
                collection(firestore, 'financialRecords'),
                where('schoolId', '==', schoolId),
                where('dueDate', '==', Timestamp.fromDate(searchDate))
            );
            
            const snap = await getDocs(billsQuery);
            
            const relevantBills: BillRecord[] = [];
            const newPaymentData: Record<string, number> = {};

            snap.docs.forEach(d => {
                const data = d.data();
                const balance = data.billedAmount - (data.amountPaid || 0) - (data.waiverAmount || 0);

                // Filter in memory: Match service type, check if unpaid, check class filter
                if (
                    data.type.includes(serviceType) && 
                    balance > 0 && 
                    (selectedClassId === 'all' || data.classId === selectedClassId)
                ) {
                    relevantBills.push({ id: d.id, ...data } as BillRecord);
                    newPaymentData[d.id] = parseFloat(balance.toFixed(2)); // Pre-fill with the exact amount owed
                }
            });

            if (relevantBills.length === 0) {
                toast({ title: "No Bills Found", description: "All clear! Either attendance hasn't been taken, or everyone is already paid up." });
            }

            setPendingBills(relevantBills);
            setPaymentData(newPaymentData);

        } catch (error: any) {
            console.error("Load Bills Error:", error);
            toast({ variant: 'destructive', title: "Error", description: "Could not load bills." });
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Process the Payments
    const handleProcessPayments = async () => {
        if (!firestore || !schoolId || !user) return;
        
        // Find bills that actually have an amount typed in > 0
        const billsToPay = pendingBills.filter(bill => (paymentData[bill.id] || 0) > 0);
        
        if (billsToPay.length === 0) {
            return toast({ variant: 'destructive', title: "No Payments", description: "All payment amounts are 0." });
        }

        setIsProcessing(true);

        try {
            // A. Check for Open Till
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

            for (const bill of billsToPay) {
                const payAmount = Number(paymentData[bill.id]);
                
                // B. Generate Receipt ID
                const receiptId = await generateNextReceiptId(firestore, schoolId);
                
                const recordRef = doc(firestore, 'financialRecords', bill.id);
                const paymentRef = doc(firestore, 'financialRecords', bill.id, 'payments', receiptId);
                const tillTransRef = doc(collection(firestore, `tills/${activeTill.id}/transactions`));

                const newAmountPaid = (bill.amountPaid || 0) + payAmount;
                const isFullyPaid = (bill.billedAmount - newAmountPaid - (bill.waiverAmount || 0)) <= 0.01;

                // 1. Update the Main Bill Document (This fixes the Overview & Student Accounts)
                batch.update(recordRef, {
                    amountPaid: newAmountPaid,
                    lastPaymentDate: serverTimestamp(),
                    status: isFullyPaid ? 'Paid' : 'Unpaid'
                });

                // 2. Log the Receipt in the Student's Bill
                batch.set(paymentRef, {
                    id: receiptId,
                    amount: payAmount,
                    method: 'Cash',
                    paidAt: serverTimestamp(),
                    processedById: user.uid,
                    processedByName: user.displayName || user.email || 'Accountant',
                    schoolId: schoolId,
                    studentId: bill.studentId,
                    description: bill.description,
                    notes: 'Bulk Daily Receipting'
                });

                // 3. Log the Individual Till Transaction (This fixes the Missing Names in Till)
                batch.set(tillTransRef, {
                    amount: payAmount,
                    studentName: bill.studentName,
                    timestamp: serverTimestamp(),
                    type: 'Payment',
                    description: `${serviceType} Payment - ${bill.description} (Receipt: ${receiptId})`,
                    status: 'Completed',
                    schoolId: schoolId
                });

                totalCollected += payAmount;
                processedCount++;
            }

            // 4. Update the Till Balance
            batch.update(doc(firestore, 'tills', activeTill.id), {
                currentBalance: increment(totalCollected)
            });

            // COMMIT EVERYTHING
            await batch.commit();

            toast({ title: "Payments Processed! 🎉", description: `Successfully received GH₵${totalCollected.toFixed(2)} from ${processedCount} students.` });
            
            // Clear the list
            setPendingBills([]);
            setPaymentData({});

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
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <Coins className="h-8 w-8 text-green-600" /> Bulk Daily Receipts
                    </h1>
                    <p className="text-muted-foreground font-medium italic">Quickly process cash payments for daily Canteen or Transport bills.</p>
                </div>
                {pendingBills.length > 0 && (
                    <div className="bg-emerald-50 border-2 border-emerald-100 p-4 rounded-2xl shadow-sm text-center min-w-[200px] animate-in zoom-in">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Selected Cash</p>
                        <p className="text-3xl font-black text-emerald-900">
                            GH₵{pendingBills.reduce((sum, b) => sum + (Number(paymentData[b.id]) || 0), 0).toFixed(2)}
                        </p>
                    </div>
                )}
            </div>

            <Card className="border-t-4 border-t-green-500 shadow-sm rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-lg">1. Load Pending Bills</CardTitle>
                    <CardDescription>Fetch unpaid daily bills generated by the attendance system.</CardDescription>
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

                    <Button onClick={handleLoadBills} disabled={isLoading} className="bg-green-600 hover:bg-green-700 w-full md:w-auto h-12 px-8 font-black uppercase tracking-widest">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4"/>}
                        Find Bills
                    </Button>
                </CardContent>
            </Card>

            {pendingBills.length > 0 && (
                <Card className="border-t-4 border-t-indigo-600 shadow-xl rounded-[2rem] overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="bg-slate-50 border-b pb-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-xl">2. Review & Process Payments</CardTitle>
                                <CardDescription>Review amounts and click Process. Amounts are pre-filled based on the bill balance.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="max-h-[50vh] overflow-y-auto">
                            <Table>
                                <TableHeader className="bg-white sticky top-0 shadow-sm z-10">
                                    <TableRow>
                                        <TableHead className="font-black text-[10px] uppercase tracking-widest">Student Name</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase tracking-widest">Description</TableHead>
                                        <TableHead className="text-right font-black text-[10px] uppercase tracking-widest">Due (GH₵)</TableHead>
                                        <TableHead className="w-[180px] font-black text-[10px] uppercase tracking-widest">Cash Received</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingBills.map(bill => {
                                        const balance = bill.billedAmount - (bill.amountPaid || 0) - (bill.waiverAmount || 0);
                                        const currentPayment = paymentData[bill.id] || 0;
                                        
                                        return (
                                            <TableRow key={bill.id} className={cn("transition-colors", currentPayment > balance ? "bg-purple-50/30" : currentPayment > 0 ? "bg-emerald-50/30" : "")}>
                                                <TableCell className="font-bold text-slate-700">{bill.studentName}</TableCell>
                                                <TableCell className="text-xs text-slate-500">{bill.description}</TableCell>
                                                <TableCell className="font-mono text-red-600 font-bold text-right">GH₵{balance.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <div className="relative group">
                                                        <Input 
                                                            type="number" 
                                                            min="0" step="0.01"
                                                            value={paymentData[bill.id] ?? ''}
                                                            onChange={e => setPaymentData(prev => ({ 
                                                                ...prev, 
                                                                [bill.id]: e.target.value === '' ? 0 : Number(e.target.value) 
                                                            }))}
                                                            className={cn(
                                                                "font-black text-right pr-4 border-2 transition-all",
                                                                currentPayment > balance 
                                                                    ? "border-purple-300 bg-white text-purple-700 ring-2 ring-purple-50" 
                                                                    : currentPayment > 0 
                                                                        ? "border-emerald-400 bg-white text-emerald-700 ring-2 ring-emerald-50" 
                                                                        : "bg-slate-50 border-slate-200 text-slate-400"
                                                            )}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50 border-t p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <Button variant="ghost" className="font-bold text-slate-400" onClick={() => {setPendingBills([]); setPaymentData({});}}>Discard List</Button>
                        <Button onClick={handleProcessPayments} disabled={isProcessing} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 h-16 px-12 text-xl font-black rounded-2xl shadow-xl shadow-indigo-200 uppercase tracking-tighter">
                            {isProcessing ? <Loader2 className="mr-2 h-6 w-6 animate-spin"/> : <CheckCircle2 className="mr-2 h-6 w-6"/>}
                            Post GH₵{pendingBills.reduce((sum, b) => sum + (Number(paymentData[b.id]) || 0), 0).toFixed(2)} to Till
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
