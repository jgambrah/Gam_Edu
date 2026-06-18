'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, doc, query, where, orderBy, getDocs, documentId } from 'firebase/firestore';
import { Student, FinancialRecord, PaymentTransaction } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { GenerateStatement } from '@/components/dashboard/finance/GenerateStatement';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { PaystackButton } from 'react-paystack';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Users, Coins, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, Award, Info, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GenerateReceipt } from '../accounts/generate-receipt';

function BillPaymentsList({ record }: { record: FinancialRecord }) {
    const firestore = useFirestore();
    const paymentsQuery = useMemoFirebase(() => {
        if (!firestore || !record?.id) return null;
        return query(
            collection(firestore, 'financialRecords', record.id, 'payments'),
            orderBy('paidAt', 'desc')
        );
    }, [firestore, record?.id]);
    const { data: payments, isLoading } = useCollection<PaymentTransaction>(paymentsQuery);

    if (isLoading) {
        return <div className="text-[10px] text-slate-400 p-2 animate-pulse font-bold uppercase">Loading transactions...</div>;
    }

    if (!payments || payments.length === 0) {
        return <div className="text-[10px] text-slate-400 p-2 italic">No transactions recorded for this invoice.</div>;
    }

    return (
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100 space-y-2 mt-2">
            <p className="text-[9px] font-black uppercase text-indigo-500 tracking-wider">Payment Transaction History</p>
            <div className="space-y-1.5">
                {payments.map((p: any) => {
                    const dateStr = p.paidAt?.toDate ? format(p.paidAt.toDate(), 'PPP p') : 'Unknown Date';
                    return (
                        <div key={p.id} className="flex justify-between items-center text-xs p-2.5 bg-white rounded-lg border border-slate-150 shadow-sm hover:border-indigo-100 transition-colors">
                            <div className="space-y-0.5">
                                <p className="font-black text-slate-700">GH₵ {p.amount.toFixed(2)}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">{p.method} • Processed by: {p.processedByName || 'System'}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] text-slate-450 font-bold uppercase">{dateStr}</span>
                                <GenerateReceipt transaction={record} payment={p} variant="icon" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function StudentBillView({ studentId }: { studentId: string }) {
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const { user } = useUser();
    const { role } = useRole();
    const { toast } = useToast();
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [expandedPayments, setExpandedPayments] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const recordsQuery = useMemoFirebase(() => {
        if (!firestore || !studentId || !schoolId) return null;
        return query(
            collection(firestore, 'financialRecords'), 
            where('schoolId', '==', schoolId),
            where('studentId', '==', studentId),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, studentId, schoolId]);
    const { data: records, isLoading } = useCollection<FinancialRecord>(recordsQuery);

    const { data: student } = useDoc<Student>(useMemoFirebase(() => firestore && studentId ? doc(firestore, 'students', studentId) : null, [firestore, studentId]));

    const schoolSettingsQuery = useMemoFirebase(
      () => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, 
      [firestore, schoolId]
    );
    const { data: schoolSettings } = useDoc<any>(schoolSettingsQuery as any);

    // Fetch and aggregate all payments across all records
    const [allPayments, setAllPayments] = useState<(PaymentTransaction & { recordDescription: string; record: FinancialRecord })[]>([]);
    const [loadingPayments, setLoadingPayments] = useState(true);

    useEffect(() => {
        let active = true;
        if (!firestore || !records || records.length === 0) {
            setAllPayments([]);
            setLoadingPayments(false);
            return;
        }

        const fetchAllPayments = async () => {
            setLoadingPayments(true);
            try {
                const paymentPromises = records.map(async (rec) => {
                    const q = query(
                        collection(firestore, 'financialRecords', rec.id, 'payments'),
                        orderBy('paidAt', 'desc')
                    );
                    const snap = await getDocs(q);
                    return snap.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        recordDescription: rec.description,
                        recordId: rec.id,
                        record: rec
                    })) as any[];
                });

                const results = await Promise.all(paymentPromises);
                if (!active) return;
                
                const aggregated = results.flat();
                aggregated.sort((a, b) => {
                    const tA = a.paidAt?.toDate ? a.paidAt.toDate().getTime() : 0;
                    const tB = b.paidAt?.toDate ? b.paidAt.toDate().getTime() : 0;
                    return tB - tA;
                });
                
                setAllPayments(aggregated);
            } catch (err) {
                console.error("Error fetching all payments:", err);
            } finally {
                if (active) {
                    setLoadingPayments(false);
                }
            }
        };

        fetchAllPayments();

        return () => {
            active = false;
        };
    }, [firestore, records]);

    const overallSummary = useMemo(() => {
        if (!records) return { totalBilled: 0, totalPaid: 0, totalWaivers: 0, balance: 0 };
        const totalBilled = records.reduce((acc, r) => acc + (r.billedAmount || 0), 0);
        const totalPaid = records.reduce((acc, r) => acc + (r.amountPaid || 0), 0);
        const totalWaivers = records.reduce((acc, r) => acc + (r.waiverAmount || 0), 0);
        const balance = totalBilled - totalPaid - totalWaivers;
        return { totalBilled, totalPaid, totalWaivers, balance };
    }, [records]);

    const percentPaid = useMemo(() => {
        const total = overallSummary.totalBilled - overallSummary.totalWaivers;
        if (total <= 0) return 100;
        return Math.min(100, Math.round((overallSummary.totalPaid / total) * 100));
    }, [overallSummary]);

    const categoryInsights = useMemo(() => {
        if (!records) return [];
        const categories: Record<string, { billed: number; paid: number; waivers: number; balance: number }> = {};
        
        records.forEach(r => {
            const catType = r.type || 'Other';
            if (!categories[catType]) {
                categories[catType] = { billed: 0, paid: 0, waivers: 0, balance: 0 };
            }
            categories[catType].billed += r.billedAmount || 0;
            categories[catType].paid += r.amountPaid || 0;
            categories[catType].waivers += r.waiverAmount || 0;
            categories[catType].balance += (r.billedAmount || 0) - (r.amountPaid || 0) - (r.waiverAmount || 0);
        });
        
        return Object.entries(categories).map(([name, data]) => {
            const totalToPay = data.billed - data.waivers;
            const pct = totalToPay <= 0 ? 100 : Math.min(100, Math.round((data.paid / totalToPay) * 100));
            return {
                name,
                ...data,
                pct
            };
        }).sort((a, b) => b.billed - a.billed);
    }, [records]);

    const accountStanding = useMemo(() => {
        if (!records || records.length === 0) return { status: 'good', title: 'No active charges', message: 'No financial records found.' };
        
        const balance = overallSummary.balance;
        if (balance <= 0.01) {
            return {
                status: 'good',
                title: 'Account in Good Standing',
                message: 'All bills have been fully settled. Thank you for your support!',
                variant: 'success'
            };
        }
        
        const now = new Date();
        const overdueRecords = records.filter(r => {
            const billed = r.billedAmount || 0;
            const paid = r.amountPaid || 0;
            const waiver = r.waiverAmount || 0;
            const due = billed - paid - waiver;
            if (due <= 0.01) return false;
            
            if (r.dueDate?.toDate) {
                return r.dueDate.toDate() < now;
            }
            return false;
        });
        
        if (overdueRecords.length > 0) {
            return {
                status: 'overdue',
                title: 'Overdue Balance Warning',
                message: `You have ${overdueRecords.length} overdue bill(s). Outstanding amount: GH₵ ${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}. Please clear immediately.`,
                variant: 'destructive'
            };
        }
        
        const unpaidWithDueDate = records
            .filter(r => (r.billedAmount - (r.amountPaid || 0) - (r.waiverAmount || 0)) > 0.01 && r.dueDate?.toDate)
            .sort((a, b) => a.dueDate.toDate().getTime() - b.dueDate.toDate().getTime());
            
        const nextDueStr = unpaidWithDueDate.length > 0 && unpaidWithDueDate[0].dueDate?.toDate
            ? format(unpaidWithDueDate[0].dueDate.toDate(), 'PPP')
            : 'N/A';
            
        return {
            status: 'outstanding',
            title: 'Outstanding Balance Pending',
            message: `A balance of GH₵ ${balance.toLocaleString(undefined, {minimumFractionDigits: 2})} is outstanding. Next payment due date: ${nextDueStr}.`,
            variant: 'warning',
            nextDueDate: nextDueStr
        };
    }, [records, overallSummary]);

    const filteredRecords = useMemo(() => {
        if (!records) return [];
        
        return records.filter(rec => {
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const descMatch = rec.description?.toLowerCase().includes(searchLower);
                const typeMatch = rec.type?.toLowerCase().includes(searchLower);
                if (!descMatch && !typeMatch) return false;
            }
            
            const billed = Number(rec.billedAmount) || 0;
            const paid = Number(rec.amountPaid) || 0;
            const waiver = Number(rec.waiverAmount) || 0;
            const balance = billed - paid - waiver;
            const status = rec.status || (balance <= 0 ? 'Paid' : 'Unpaid');
            
            if (statusFilter !== 'all') {
                if (statusFilter === 'paid' && status !== 'Paid') return false;
                if (statusFilter === 'unpaid' && status !== 'Unpaid' && status !== 'Overdue') return false;
                if (statusFilter === 'overdue' && status !== 'Overdue') return false;
            }
            
            if (dateRange && dateRange.from) {
                if (!rec.dueDate?.toDate) return false;
                const recDate = rec.dueDate.toDate();
                const from = startOfDay(dateRange.from);
                const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
                if (recDate < from || recDate > to) return false;
            }
            
            return true;
        });
    }, [records, searchTerm, statusFilter, dateRange]);

    const togglePayments = (id: string) => {
        setExpandedPayments(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-emerald-500 hover:bg-emerald-600';
            case 'Unpaid': return 'bg-amber-500 hover:bg-amber-600';
            case 'Overdue': return 'bg-rose-500 hover:bg-rose-650';
            case 'Pending Reversal': return 'bg-blue-500 hover:bg-blue-600';
            default: return 'bg-slate-500 hover:bg-slate-600';
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-indigo-650" /></div>;
    }
    
    if (!records || records.length === 0) {
        return <p className="text-center text-slate-400 p-8 italic font-black uppercase tracking-widest text-xs">No billing history found.</p>;
    }

    return (
        <Tabs defaultValue="insights" className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/50 backdrop-blur-sm max-w-lg mx-auto">
                <TabsTrigger value="insights" className="rounded-xl font-black text-xs uppercase tracking-wider py-2.5">
                    Insights
                </TabsTrigger>
                <TabsTrigger value="ledger" className="rounded-xl font-black text-xs uppercase tracking-wider py-2.5">
                    Ledger Statement
                </TabsTrigger>
                <TabsTrigger value="payments" className="rounded-xl font-black text-xs uppercase tracking-wider py-2.5">
                    Payment History
                </TabsTrigger>
            </TabsList>

            {/* INSIGHTS TAB */}
            <TabsContent value="insights" className="space-y-6 outline-none">
                {/* Account standing status banner */}
                <div className={cn(
                    "p-6 rounded-3xl border shadow-sm flex items-center gap-4 transition-all",
                    accountStanding.status === 'good' && "bg-emerald-50/50 border-emerald-200 text-emerald-950",
                    accountStanding.status === 'outstanding' && "bg-amber-50/50 border-amber-200 text-amber-950",
                    accountStanding.status === 'overdue' && "bg-rose-50/50 border-rose-200 text-rose-950"
                )}>
                    <div className={cn(
                        "p-3 rounded-2xl shadow-inner",
                        accountStanding.status === 'good' && "bg-emerald-100 text-emerald-600",
                        accountStanding.status === 'outstanding' && "bg-amber-100 text-amber-600",
                        accountStanding.status === 'overdue' && "bg-rose-100 text-rose-600"
                    )}>
                        {accountStanding.status === 'good' ? <CheckCircle2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-black uppercase tracking-wider">{accountStanding.title}</h4>
                        <p className="text-xs font-semibold leading-relaxed opacity-90">{accountStanding.message}</p>
                    </div>
                </div>

                {/* Grid for Gauge and Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Gauge Card */}
                    <Card className="rounded-3xl border border-slate-100 bg-white shadow-sm flex flex-col justify-center p-6">
                        <CardHeader className="p-0 pb-4 text-center">
                            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex flex-col items-center justify-center">
                            <div className="relative w-40 h-40">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="68"
                                        className="stroke-slate-100"
                                        strokeWidth="12"
                                        fill="transparent"
                                    />
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="68"
                                        className="stroke-indigo-650 transition-all duration-1000 ease-out"
                                        strokeWidth="12"
                                        fill="transparent"
                                        strokeDasharray={2 * Math.PI * 68}
                                        strokeDashoffset={2 * Math.PI * 68 * (1 - percentPaid / 100)}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-slate-800">{percentPaid}%</span>
                                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-0.5">Paid</span>
                                </div>
                            </div>
                            <div className="text-center mt-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                    {percentPaid === 100 ? 'All charges fully settled!' : 'Remaining balance pending'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Breakdown Card */}
                    <Card className="md:col-span-2 rounded-3xl border border-slate-100 bg-white shadow-sm p-6 flex flex-col justify-between">
                        <CardHeader className="p-0 pb-4">
                            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Category Breakdown</CardTitle>
                            <CardDescription className="text-xs text-slate-450 mt-1 font-bold">Itemized summary by service/type</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 overflow-y-auto max-h-[190px] space-y-4 pr-1">
                            {categoryInsights.map((item) => (
                                <div key={item.name} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-black">
                                        <span className="text-slate-700">{item.name}</span>
                                        <span className="text-slate-500 font-mono">
                                            GH₵ {item.paid.toFixed(2)} / {(item.billed - item.waivers).toFixed(2)} ({item.pct}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div 
                                            className={cn(
                                                "h-2 rounded-full transition-all duration-500",
                                                item.pct >= 100 ? "bg-emerald-500" : item.pct >= 50 ? "bg-indigo-500" : "bg-rose-400"
                                            )}
                                            style={{ width: `${item.pct}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-l-4 border-l-slate-400 rounded-2xl shadow-sm bg-white overflow-hidden">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Billed</p>
                                <h4 className="text-lg font-black text-slate-800 mt-1">GH₵ {overallSummary.totalBilled.toLocaleString(undefined, {minimumFractionDigits: 2})}</h4>
                            </div>
                            <div className="p-2.5 bg-slate-50 text-slate-500 rounded-xl"><FileText className="h-4 w-4"/></div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-emerald-500 rounded-2xl shadow-sm bg-white overflow-hidden">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Total Paid</p>
                                <h4 className="text-lg font-black text-slate-800 mt-1">GH₵ {overallSummary.totalPaid.toLocaleString(undefined, {minimumFractionDigits: 2})}</h4>
                            </div>
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="h-4 w-4"/></div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-indigo-500 rounded-2xl shadow-sm bg-white overflow-hidden">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Waivers</p>
                                <h4 className="text-lg font-black text-slate-800 mt-1">GH₵ {overallSummary.totalWaivers.toLocaleString(undefined, {minimumFractionDigits: 2})}</h4>
                            </div>
                            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><Award className="h-4 w-4"/></div>
                        </CardContent>
                    </Card>
                    <Card className={cn(
                        "border-l-4 rounded-2xl shadow-sm bg-white overflow-hidden",
                        overallSummary.balance > 0.01 ? "border-l-rose-500" : "border-l-emerald-500"
                    )}>
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className={cn("text-[9px] font-black uppercase tracking-widest", overallSummary.balance > 0.01 ? "text-rose-600" : "text-emerald-600")}>Outstanding</p>
                                <h4 className="text-lg font-black text-slate-800 mt-1">GH₵ {Math.max(0, overallSummary.balance).toLocaleString(undefined, {minimumFractionDigits: 2})}</h4>
                            </div>
                            <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl"><Coins className="h-4 w-4"/></div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            {/* LEDGER TAB */}
            <TabsContent value="ledger" className="space-y-6 outline-none">
                {/* Filter Toolbar */}
                <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center bg-slate-50 p-4 rounded-2xl border border-slate-150">
                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center flex-1">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search invoices by type or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-xl text-xs font-bold bg-white text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 transition-colors"
                            />
                        </div>

                        {/* Status Select Toggle */}
                        <div className="flex gap-1.5 p-1 bg-white rounded-xl border border-slate-200">
                            {['all', 'paid', 'unpaid', 'overdue'].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setStatusFilter(status)}
                                    className={cn(
                                        "px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all",
                                        statusFilter === status
                                            ? "bg-indigo-650 text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-900"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Date Range Picker */}
                    <div className="shrink-0">
                        <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
                    </div>
                </div>

                {/* Invoices List Table */}
                <Card className="rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b p-6">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Ledger Statement</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/30">
                                <TableRow>
                                    <TableHead className="font-black text-[9px] uppercase pl-6 py-4 tracking-widest">Description</TableHead>
                                    <TableHead className="font-black text-[9px] uppercase tracking-widest text-right">Amount Billed</TableHead>
                                    <TableHead className="font-black text-[9px] uppercase tracking-widest text-right">Paid</TableHead>
                                    <TableHead className="font-black text-[9px] uppercase tracking-widest text-right">Waiver</TableHead>
                                    <TableHead className="font-black text-[9px] uppercase tracking-widest text-right">Balance Due</TableHead>
                                    <TableHead className="font-black text-[9px] uppercase tracking-widest">Due Date</TableHead>
                                    <TableHead className="font-black text-[9px] uppercase tracking-widest">Status</TableHead>
                                    <TableHead className="font-black text-[9px] uppercase tracking-widest pr-6 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRecords.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-10 font-bold text-xs text-slate-400 uppercase tracking-widest">
                                            No ledger items match the filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRecords.map(rec => {
                                        const billed = Number(rec.billedAmount) || 0;
                                        const paid = Number(rec.amountPaid) || 0;
                                        const waiver = Number(rec.waiverAmount) || 0;
                                        const balance = billed - paid - waiver;
                                        const status = rec.status || (balance <= 0 ? 'Paid' : 'Unpaid');
                                        const hasPaymentHistory = paid > 0;

                                        return (
                                            <Suspense key={rec.id} fallback={<TableRow><TableCell colSpan={8} className="h-20 animate-pulse bg-slate-50/50" /></TableRow>}>
                                                <TableRow className="hover:bg-slate-50/50 transition-colors h-16">
                                                    <TableCell className="font-black text-slate-700 text-xs pl-6">
                                                        <div className="flex flex-col">
                                                            <span>{rec.description}</span>
                                                            {rec.type && <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-wider mt-0.5">{rec.type}</span>}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-black text-slate-700 text-xs font-mono">
                                                        GH₵ {billed.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-emerald-600 text-xs font-mono">
                                                        GH₵ {paid.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-indigo-650 text-xs font-mono">
                                                        GH₵ {waiver > 0 ? waiver.toLocaleString(undefined, {minimumFractionDigits: 2}) : '—'}
                                                    </TableCell>
                                                    <TableCell className={cn(
                                                        "text-right font-black text-xs font-mono",
                                                        balance > 0.01 ? "text-rose-600" : "text-slate-500"
                                                    )}>
                                                        GH₵ {Math.max(0, balance).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                                    </TableCell>
                                                    <TableCell className="text-[10px] font-semibold text-slate-500">
                                                        {rec.dueDate?.toDate ? format(rec.dueDate.toDate(), 'PPP') : 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={cn(
                                                            "border-none font-black text-[8px] tracking-wider px-2.5 py-0.5 rounded-full uppercase text-white shadow-sm shrink-0",
                                                            getStatusColor(status)
                                                        )}>
                                                            {status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="pr-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {/* Payments Expander */}
                                                            {hasPaymentHistory && (
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="sm" 
                                                                    onClick={() => togglePayments(rec.id)}
                                                                    className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-700 flex items-center gap-1 h-8 px-2.5 rounded-lg hover:bg-slate-100 transition-colors"
                                                                >
                                                                    {expandedPayments[rec.id] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                                                    <span>History</span>
                                                                </Button>
                                                            )}

                                                            {/* Paystack Online Payment */}
                                                            {role === 'Parent' && schoolSettings?.enablePaystack && schoolSettings?.paystackPubKey && balance > 0.01 && (
                                                                <PaystackButton
                                                                    className="bg-emerald-500 hover:bg-emerald-605 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-emerald-100/50 flex items-center gap-1 h-8 cursor-pointer"
                                                                    email={user?.email || 'parent@school.com'}
                                                                    amount={Math.round(balance * 100)} // Convert GHS to Pesewas
                                                                    currency="GHS"
                                                                    publicKey={schoolSettings.paystackPubKey}
                                                                    text="Pay Online"
                                                                    metadata={{
                                                                        type: 'school_fee_payment',
                                                                        schoolId: schoolId,
                                                                        studentId: studentId,
                                                                        recordId: rec.id
                                                                    } as any}
                                                                    onSuccess={() => toast({ title: "Payment Successful", description: "Your transaction has been received and is processing." })}
                                                                    onClose={() => {}}
                                                                />
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>

                                                {/* Expandable Payments Ledger */}
                                                {expandedPayments[rec.id] && (
                                                    <TableRow className="bg-slate-50/20 hover:bg-slate-50/20">
                                                        <TableCell colSpan={8} className="p-3 pl-8 bg-slate-50/10 border-t border-b border-slate-150">
                                                            <BillPaymentsList record={rec} />
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </Suspense>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="bg-slate-50/50 p-5 border-t flex items-center gap-3">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-100">
                            <Info className="h-3.5 w-3.5 text-indigo-500" />
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                            Online payments are securely processed. Balances automatically update upon payment gateway confirmation.
                        </p>
                    </CardFooter>
                </Card>

                {/* Statement Generation */}
                {student && (
                    <div className="flex justify-end pt-2">
                        <GenerateStatement 
                            student={student as any}
                            records={filteredRecords}
                            dateRange={dateRange}
                            summary={overallSummary}
                        />
                    </div>
                )}
            </TabsContent>

            {/* PAYMENTS HISTORY TAB */}
            <TabsContent value="payments" className="space-y-6 outline-none">
                <Card className="rounded-[2rem] border border-slate-100 bg-white shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b p-6">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Payment History Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {loadingPayments ? (
                            <div className="flex flex-col items-center justify-center py-10 space-y-2">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-650" />
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Loading chronological history...</p>
                            </div>
                        ) : allPayments.length === 0 ? (
                            <div className="text-center py-12 text-slate-450">
                                <Clock className="h-10 w-10 mx-auto mb-3 opacity-30 text-slate-500" />
                                <p className="text-xs font-black uppercase tracking-wider">No payments recorded yet</p>
                                <p className="text-[10px] text-slate-400 font-bold mt-1">Transactions will appear here once billing payments are processed.</p>
                            </div>
                        ) : (
                            <div className="relative border-l-2 border-slate-100 pl-6 space-y-6 ml-3 my-2">
                                {allPayments.map((p) => {
                                    const dateStr = p.paidAt?.toDate ? format(p.paidAt.toDate(), 'PPP p') : 'Unknown Date';
                                    return (
                                        <div key={p.id} className="relative group">
                                            {/* Timeline dot */}
                                            <div className="absolute -left-[31px] top-1.5 bg-emerald-500 border-4 border-white h-4 w-4 rounded-full shadow-md group-hover:scale-125 transition-transform" />
                                            
                                            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors shadow-sm">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-black text-emerald-600 font-mono">
                                                            + GH₵ {p.amount.toFixed(2)}
                                                        </span>
                                                        <Badge variant="outline" className="border-slate-200 bg-white font-black text-[8px] uppercase tracking-wider py-0.5 px-2">
                                                            {p.method}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-755">
                                                        Applied to: <span className="text-indigo-600">{p.recordDescription}</span>
                                                    </p>
                                                    <div className="flex items-center gap-1.5 text-[9px] text-slate-450 font-bold uppercase tracking-wider">
                                                        <span>Ref ID: #{p.id.slice(0, 8)}</span>
                                                        <span>•</span>
                                                        <span>Processed by: {p.processedByName || 'System'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">
                                                        {dateStr}
                                                    </span>
                                                    {p.record && (
                                                        <GenerateReceipt 
                                                            transaction={p.record} 
                                                            payment={p} 
                                                            variant="full" 
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}

function MyBillsPageContent() {
    const { user } = useUser();
    const { role, profile } = useRole();
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const [selectedChildId, setSelectedChildId] = useState<string>('');

    // Robust field mapping for linked students
    const studentIds = useMemo(() => {
        return profile?.studentIds || profile?.student_ids || profile?.students || profile?.childrenIds || profile?.linkedStudentIds || profile?.linked_students || profile?.studentIDs || [];
    }, [profile]);
    
    const { data: studentForStudentRole } = useCollection<Student>(
        useMemoFirebase(() => (role === 'Student' && user && firestore) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [firestore, user?.uid, role])
    );
    
    const activeChildId = useMemo(() => {
        if (role === 'Student') return studentForStudentRole?.[0]?.uid || '';
        return selectedChildId || studentIds[0] || '';
    }, [role, studentForStudentRole, selectedChildId, studentIds]);

    const { data: students } = useCollection<Student>(
        useMemoFirebase(() => {
            if (!firestore || !schoolId || role !== 'Parent' || studentIds.length === 0) return null;
            return query(
                collection(firestore, 'students'),
                where('schoolId', '==', schoolId),
                where(documentId(), 'in', studentIds.slice(0, 10))
            );
        }, [firestore, schoolId, studentIds, role])
    );

    if (role === 'Student') {
        const student = studentForStudentRole?.[0];
        if (!student) {
            return (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        Your student profile could not be loaded.
                    </CardContent>
                </Card>
            );
        }
        return (
            <div className="space-y-6">
                <Card className="border-t-4 border-t-indigo-650 shadow-xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b p-8">
                        <CardTitle className="text-lg font-black flex items-center gap-2 uppercase italic tracking-tight"><FileText className="text-indigo-650 h-5 w-5" /> My Bills</CardTitle>
                        <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-450 mt-1">A detailed summary of your bills and fees ledger</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <StudentBillView studentId={student.uid} />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (role === 'Parent') {
        if (!studentIds || studentIds.length === 0) {
            return (
                <Card className="border-2 border-dashed bg-slate-50 max-w-2xl mx-auto rounded-[2rem] p-8">
                    <CardHeader className="text-center">
                        <Users className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                        <CardTitle className="text-lg font-black uppercase text-slate-800">No Children Linked</CardTitle>
                        <CardDescription className="text-xs font-bold uppercase tracking-wider text-slate-400">We couldn't find any children linked to your parent account.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center pb-4">
                        <p className="text-sm text-slate-500 font-medium">Please contact the school administration office to establish your family account association.</p>
                    </CardContent>
                </Card>
            );
        }
        
        return (
            <div className="space-y-8">
                {/* Header Banner */}
                <div className="relative p-8 xl:p-10 rounded-[2rem] text-white border-b-8 border-black/10 overflow-hidden shadow-2xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-emerald-500/20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.06),_rgba(255,255,255,0))] pointer-events-none" />
                    <div className="space-y-3 relative z-10 max-w-xl">
                        <span className="text-[9px] font-black tracking-[0.25em] px-3.5 py-1.5 rounded-full uppercase bg-emerald-500/20 text-emerald-300">
                            Family Finance Control
                        </span>
                        <h2 className="text-2.5xl xl:text-3.5xl font-black tracking-tight uppercase italic mt-2">
                            Tuition & Fees Ledger
                        </h2>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                            Review detailed invoice ledgers, view itemized payment histories, and make secure online fee payments.
                        </p>
                    </div>
                    <div className="hidden xl:flex p-5 bg-white/5 border border-white/10 rounded-[1.5rem] relative z-10 shrink-0">
                        <Coins className="h-10 w-10 text-white opacity-80" />
                    </div>
                </div>

                {/* Child Switcher Tabs (Parents with multiple students) */}
                {students && students.length > 1 && (
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Child</Label>
                        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl border w-fit">
                            {students.map((st: any) => {
                                const targetId = st.id || st.uid;
                                return (
                                    <button
                                        key={targetId}
                                        onClick={() => setSelectedChildId(targetId)}
                                        className={cn(
                                            "px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300",
                                            activeChildId === targetId
                                                ? "bg-white text-indigo-600 shadow-md scale-[1.02]"
                                                : "text-slate-500 hover:text-slate-900"
                                        )}
                                    >
                                        {st.firstName} {st.lastName}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeChildId && (
                    <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-slate-100 shadow-xl p-8 animate-in fade-in duration-300">
                        <StudentBillView studentId={activeChildId} />
                    </div>
                )}
            </div>
        );
    }

    // Fallback for other roles
    return (
        <Card>
            <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>This page is for parents and students only.</CardDescription>
            </CardHeader>
        </Card>
    );
}

export default function MyBillsPage() {
    const { isUserLoading } = useUser();
    const { loading: isRoleLoading } = useRole();

    const isLoading = isUserLoading || isRoleLoading;
    
    return (
      <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
        {isLoading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="p-4 md:p-6 max-w-6xl mx-auto">
            <MyBillsPageContent />
          </div>
        )}
      </Suspense>
    );
}
