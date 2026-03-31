'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, doc, getDoc, writeBatch, increment, serverTimestamp, Timestamp } from 'firebase/firestore';
import { format, startOfDay } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar as CalendarIcon, Search, DollarSign, Bus, Utensils, CheckCircle2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useRole } from '@/context/role-context';
import { StudentDisplay } from '@/components/student-display';
import { searchStudent, generateNextReceiptId } from '@/lib/student-utils';

// Types
import { Student, Class, Route, FinancialRecord } from '@/lib/types';

interface PaymentRow {
    student: Student;
    currentBalance: number;
    paymentAmount: number;
    recordId: string | null; 
}

export default function BulkPaymentsPage() {
    const { user } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();

    // Filters
    const [date, setDate] = useState<Date>(new Date());
    const [serviceType, setServiceType] = useState<'Canteen' | 'Transport'>('Canteen');
    const [classId, setClassId] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Grid State
    const [rows, setRows] = useState<PaymentRow[]>([]);
    const [isLoadingGrid, setIsLoadingGrid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Data Dependencies
    const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: classes } = useCollection<Class>(classesQuery);

    const routesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'routes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: routes } = useCollection<Route>(routesQuery);

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role || '');

    // --- GRID LOADING LOGIC ---
    const loadGrid = useCallback(async () => {
        if (!firestore || !schoolId) return;
        
        setIsLoadingGrid(true);
        try {
            const dateStr = format(startOfDay(date), 'yyyy-MM-dd');
            
            // 1. Fetch Canteen Rates
            let canteenModel = 'Flat';
            let globalCanteenRate = 0;
            let classCanteenRates: Record<string, number> = {};
            
            if (serviceType === 'Canteen') {
                const canteenSnap = await getDoc(doc(firestore, 'schoolSettings', schoolId, 'rates', 'canteen'));
                if (canteenSnap.exists()) {
                    const data = canteenSnap.data();
                    canteenModel = data.pricingModel || 'Flat';
                    globalCanteenRate = data.dailyRate || 0;
                    classCanteenRates = data.classRates || {};
                }
            }

            // 2. Fetch Routes Map
            const routeRatesMap = new Map<string, number>();
            if (serviceType === 'Transport' && routes) {
                routes.forEach(r => routeRatesMap.set(r.id, r.dailyRate || 0));
            }

            // 3. Query Students
            let studentQ = query(collection(firestore, 'students'), where('schoolId', '==', schoolId));
            if (classId !== 'all') {
                studentQ = query(studentQ, where('classId', '==', classId));
            }
            const studentSnap = await getDocs(studentQ);
            const allStudents = studentSnap.docs.map(d => ({ ...d.data(), uid: d.id }) as Student);

            // 4. Filter by subscription (Daily only)
            const subscribedStudents = allStudents.filter(s => {
                if (serviceType === 'Canteen') {
                    return s.usesCanteen !== false && (s.canteenBillingMode === 'Daily' || !s.canteenBillingMode);
                } else {
                    return s.usesBusService === true && s.transportBillingModel === 'Daily';
                }
            });

            // 5. Fetch relevant bills for these students on this date
            const billType = serviceType === 'Canteen' ? 'Canteen Fee (Daily)' : 'Transport Fee (Daily)';
            const billsQuery = query(
                collection(firestore, 'financialRecords'),
                where('schoolId', '==', schoolId),
                where('type', '==', billType),
                where('dueDate', '==', Timestamp.fromDate(startOfDay(date)))
            );
            const billsSnap = await getDocs(billsQuery);
            const billsMap = new Map<string, FinancialRecord>();
            billsSnap.docs.forEach(d => billsMap.set(d.data().studentId, { id: d.id, ...d.data() } as FinancialRecord));

            // 6. Construct Rows
            const newRows: PaymentRow[] = subscribedStudents.map(student => {
                const existingBill = billsMap.get(student.uid);
                
                let prefill = 0;
                if (serviceType === 'Canteen') {
                    prefill = canteenModel === 'Flat' ? globalCanteenRate : (classCanteenRates[student.classId] || 0);
                } else {
                    prefill = student.routeId ? (routeRatesMap.get(student.routeId) || 0) : 0;
                }

                const currentBalance = existingBill 
                    ? (existingBill.billedAmount - (existingBill.amountPaid || 0) - (existingBill.waiverAmount || 0))
                    : prefill; 

                return {
                    student,
                    currentBalance: Math.max(0, currentBalance),
                    paymentAmount: prefill, 
                    recordId: existingBill?.id || null
                };
            });

            setRows(newRows);
        } catch (error: any) {
            console.error("Load Grid Error:", error);
            toast({ variant: 'destructive', title: "Error", description: "Failed to load student payments." });
        } finally {
            setIsLoadingGrid(false);
        }
    }, [firestore, schoolId, date, serviceType, classId, routes, toast]);

    useEffect(() => {
        if (!schoolLoading && schoolId) {
            loadGrid();
        }
    }, [loadGrid, schoolLoading, schoolId]);

    const handleAmountChange = (uid: string, amount: string) => {
        const val = amount === '' ? 0 : parseFloat(amount);
        setRows(prev => prev.map(r => r.student.uid === uid ? { ...r, paymentAmount: val } : r));
    };

    const filteredRows = useMemo(() => {
        return rows.filter(r => searchStudent(r.student, searchTerm));
    }, [rows, searchTerm]);

    const totalAmount = useMemo(() => {
        return rows.reduce((sum, r) => sum + r.paymentAmount, 0);
    }, [rows]);

    const handleSubmitAll = async () => {
        if (!firestore || !user || !schoolId || totalAmount <= 0) return;
        
        setIsSubmitting(true);
        const batch = writeBatch(firestore);
        const dateStr = format(startOfDay(date), 'yyyy-MM-dd');
        const validPayments = rows.filter(r => r.paymentAmount > 0);

        try {
            const tillQ = query(
                collection(firestore, 'tills'), 
                where('accountantId', '==', user.uid), 
                where('status', '==', 'Open'),
                where('schoolId', '==', schoolId)
            );
            const tillSnap = await getDocs(tillQ);
            if (tillSnap.empty) {
                throw new Error("Please OPEN YOUR TILL before processing cash payments.");
            }
            const activeTill = tillSnap.docs[0];

            let processedCount = 0;

            for (const row of validPayments) {
                const recordId = row.recordId || `${serviceType.toLowerCase()}-${row.student.uid}-${dateStr}`;
                const recordRef = doc(firestore, 'financialRecords', recordId);
                const receiptId = await generateNextReceiptId(firestore, schoolId);
                const paymentRef = doc(firestore, 'financialRecords', recordId, 'payments', receiptId);

                const isFullyPaid = row.paymentAmount >= row.currentBalance;
                
                // If the record doesn't exist (student marked present but not billed), we create it
                if (!row.recordId) {
                    batch.set(recordRef, {
                        studentId: row.student.uid,
                        studentName: `${row.student.firstName} ${row.student.lastName}`,
                        classId: row.student.classId || '',
                        type: serviceType === 'Canteen' ? 'Canteen Fee (Daily)' : 'Transport Fee (Daily)',
                        description: `${serviceType} Fee - ${format(date, 'PPP')}`,
                        billedAmount: row.paymentAmount,
                        amountPaid: row.paymentAmount,
                        status: 'Paid',
                        dueDate: Timestamp.fromDate(startOfDay(date)),
                        createdAt: serverTimestamp(),
                        schoolId: schoolId,
                        lastPaymentDate: serverTimestamp(),
                    });
                } else {
                    batch.update(recordRef, {
                        amountPaid: increment(row.paymentAmount),
                        status: isFullyPaid ? 'Paid' : 'Unpaid',
                        lastPaymentDate: serverTimestamp(),
                    });
                }

                batch.set(paymentRef, {
                    id: receiptId,
                    amount: row.paymentAmount,
                    method: 'Cash',
                    paidAt: serverTimestamp(),
                    processedById: user.uid,
                    processedByName: user.displayName || user.email,
                    studentId: row.student.uid,
                    description: `${serviceType} Fee - ${format(date, 'PPP')}`,
                    schoolId: schoolId,
                    notes: 'Bulk Daily Entry'
                });

                processedCount++;
            }

            batch.update(doc(firestore, 'tills', activeTill.id), {
                currentBalance: increment(totalAmount)
            });

            const tillTransRef = doc(collection(firestore, `tills/${activeTill.id}/transactions`));
            batch.set(tillTransRef, {
                amount: totalAmount,
                timestamp: serverTimestamp(),
                type: 'Payment',
                description: `Bulk ${serviceType} Collection - ${processedCount} Students`,
                status: 'Completed',
                schoolId: schoolId,
            });

            await batch.commit();
            toast({ title: "Success!", description: `Recorded ${processedCount} payments totaling GH₵${totalAmount.toFixed(2)}.` });
            loadGrid();

        } catch (error: any) {
            console.error("Batch Submission Error:", error);
            toast({ variant: 'destructive', title: "Processing Failed", description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!canAccess) {
        return <div className="p-8 text-center text-red-500">Access Denied. Financial staff only.</div>;
    }

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto pb-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <DollarSign className="h-8 w-8 text-emerald-600"/> Bulk Daily Payments
                    </h1>
                    <p className="text-muted-foreground font-medium italic">Rapid entry for Canteen and Transport fees.</p>
                </div>
                <Card className="bg-emerald-50 border-emerald-100 p-4 shadow-sm">
                    <div className="text-xs font-black text-emerald-600 uppercase tracking-widest">Session Total</div>
                    <div className="text-3xl font-black text-emerald-900">GH₵{totalAmount.toFixed(2)}</div>
                </Card>
            </div>

            <Card className="shadow-sm border-2">
                <CardHeader className="pb-3 border-b bg-slate-50/50">
                    <CardTitle className="text-sm font-bold uppercase text-slate-500">Filter Records</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6">
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal bg-white h-11 border-2">
                                    <CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
                                    {format(date, "PPP")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label>Service Type</Label>
                        <Select value={serviceType} onValueChange={(v: any) => setServiceType(v)}>
                            <SelectTrigger className="bg-white border-2 h-11">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Canteen"><div className="flex items-center gap-2"><Utensils className="h-4 w-4 text-orange-500"/> Canteen</div></SelectItem>
                                <SelectItem value="Transport"><div className="flex items-center gap-2"><Bus className="h-4 w-4 text-blue-500"/> Transport</div></SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Target Class</Label>
                        <Select value={classId} onValueChange={setClassId}>
                            <SelectTrigger className="bg-white border-2 h-11">
                                <SelectValue placeholder="All Classes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Find Student</Label>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Name or ID..." 
                                className="pl-8 h-11 border-2 bg-white" 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg border-none overflow-hidden rounded-2xl bg-white min-h-[400px]">
                <CardContent className="p-0">
                    {isLoadingGrid ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400">
                            <Loader2 className="h-12 w-12 animate-spin text-emerald-500"/>
                            <p className="font-bold uppercase tracking-widest text-xs">Syncing Subscriptions...</p>
                        </div>
                    ) : filteredRows.length === 0 ? (
                        <div className="text-center py-32 text-muted-foreground bg-slate-50 italic">
                            No daily {serviceType.toLowerCase()} subscribers found for this selection.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="w-[350px]">Student Details</TableHead>
                                        <TableHead className="text-right">Unpaid Balance</TableHead>
                                        <TableHead className="text-center w-[220px]">Payment Amount (GH₵)</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRows.map((row) => (
                                        <TableRow key={row.student.uid} className={cn(row.paymentAmount > 0 ? "bg-emerald-50/20" : "")}>
                                            <TableCell>
                                                <StudentDisplay student={row.student} variant="list" showAvatar />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className={cn("font-bold font-mono", row.currentBalance > 0 ? "text-red-600" : "text-green-600")}>
                                                        GH₵{row.currentBalance.toFixed(2)}
                                                    </span>
                                                    {!row.recordId && <span className="text-[10px] text-orange-500 font-bold uppercase">Bill Missing</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="relative group">
                                                    <Input 
                                                        type="number" 
                                                        step="0.01"
                                                        value={row.paymentAmount || ''}
                                                        onChange={(e) => handleAmountChange(row.student.uid, e.target.value)}
                                                        className="text-right font-black text-xl h-14 pr-12 border-2 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl"
                                                    />
                                                    {row.paymentAmount > 0 && (
                                                        <div className="absolute right-3 top-4 text-emerald-500 animate-in zoom-in">
                                                            <CheckCircle2 className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => handleAmountChange(row.student.uid, '0')}
                                                    className="text-slate-400 hover:text-red-500 font-bold"
                                                >
                                                    RESET
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {!isLoadingGrid && filteredRows.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t-4 border-t-slate-900 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom-full duration-500">
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="flex gap-8">
                            <div className="text-center px-4 border-r">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payments to Log</p>
                                <p className="text-2xl font-black text-slate-900">{rows.filter(r => r.paymentAmount > 0).length}</p>
                            </div>
                            <div className="text-center px-4">
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Total Batch Value</p>
                                <p className="text-2xl font-black text-emerald-600">GH₵{totalAmount.toFixed(2)}</p>
                            </div>
                        </div>
                        <Button 
                            onClick={handleSubmitAll} 
                            disabled={isSubmitting || totalAmount === 0} 
                            className="w-full sm:w-auto h-16 px-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xl shadow-xl shadow-emerald-900/20 active:scale-95 transition-all uppercase tracking-tighter"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin mr-3 h-6 w-6"/> : <Save className="mr-3 h-6 w-6"/>}
                            Commit Batch Payments
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
