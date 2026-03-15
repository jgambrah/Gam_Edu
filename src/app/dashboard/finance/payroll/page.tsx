
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, doc, setDoc, writeBatch, where, getDocs, runTransaction, increment } from 'firebase/firestore';
import { 
  Banknote, Calculator, Settings, UserCog, CheckCircle2, 
  FileText, Loader2, Save, Printer, DollarSign, Landmark, History, Eye, Search
} from 'lucide-react';
import { format } from 'date-fns';
import { useCurrentSchool } from '@/hooks/use-current-school';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Staff, StaffPayrollConfig, PayrollSettings, PayrollRecord } from '@/lib/types';
import { PayslipDialog } from '../../payroll/payslip-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


// --- CONSTANTS: GHANA 2024 TAX TABLE (Default) ---
const DEFAULT_TAX_BRACKETS = [
    { from: 0, to: 5880, rate: 0 },
    { from: 5880, to: 7200, rate: 0.05 },
    { from: 7200, to: 8760, rate: 0.10 },
    { from: 8760, to: 46760, rate: 0.175 },
    { from: 46760, to: 238760, rate: 0.25 },
    { from: 238760, to: 605000, rate: 0.30 },
    { from: 605000, to: Infinity, rate: 0.35 }
];

// --- HELPER: CALCULATE PAYSLIP ---
function calculatePayslip(staff: any, config: any) {
    const basic = parseFloat(staff.basicSalary) || 0;
    
    // 1. Allowances
    const totalAllowances = (staff.allowances || []).reduce((sum: number, a: any) => sum + (parseFloat(a.amount) || 0), 0);
    const grossSalary = basic + totalAllowances;

    // 2. SSNIT (Tier 1 & 2 Employee Share - 5.5%)
    const ssnitEmployee = basic * ((config?.ssnitEmployeeContributionRate || 0.055));

    // 3. Provident Fund (Tier 3 - Tax Deductible up to 16.5%)
    const tier3 = basic * ((staff.tier3Contribution || 0) / 100);

    // 4. Taxable Income (Basic + Taxable Allowances - Reliefs)
    const taxableIncome = (basic + totalAllowances) - ssnitEmployee - tier3;

    // 5. PAYE Calculation (Progressive)
    let taxRemaining = taxableIncome * 12; // Annualize for calculation
    let payeTaxAnnual = 0;
    const brackets = config?.payeeBrackets || DEFAULT_TAX_BRACKETS;

    for (const bracket of brackets) {
        if (taxRemaining <= 0) break;
        const taxableInBracket = Math.min(taxRemaining, (bracket.to || Infinity) - bracket.from);
        if (taxableInBracket > 0) {
            payeTaxAnnual += taxableInBracket * bracket.rate;
            taxRemaining -= taxableInBracket;
        }
    }
    const payeTax = payeTaxAnnual / 12;

    // 6. Net Salary
    const manualDeductions = (staff.deductions || []).reduce((sum: number, d: any) => sum + (parseFloat(d.amount) || 0), 0);
    const totalDeductions = ssnitEmployee + tier3 + payeTax + manualDeductions;
    const netSalary = grossSalary - totalDeductions;

    // 7. Employer Costs
    const employerSSNIT = basic * ((config?.ssnitEmployerContributionRate || 0.13));

    return {
        basicSalary: basic,
        totalAllowances,
        grossSalary,
        ssnitDeduction: ssnitEmployee,
        tier3Deduction: tier3,
        taxableIncome,
        payeTax,
        netSalary,
        employerSSNIT,
        totalCostToCompany: grossSalary + employerSSNIT,
        allowances: staff.allowances || [],
        deductions: staff.deductions || [],
    };
}

// --- COMPONENT: Payroll History ---
function PayrollHistory({ schoolId }: { schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [period, setPeriod] = useState(format(new Date(), 'yyyy-MM'));
    const [records, setRecords] = useState<PayrollRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlip, setSelectedSlip] = useState<PayrollRecord | null>(null);

    const fetchHistory = async () => {
        if (!firestore || !schoolId) return;
        setLoading(true);
        try {
            const q = query(
                collection(firestore, 'payrollRecords'),
                where('schoolId', '==', schoolId),
                where('period', '==', period)
            );
            const snap = await getDocs(q);
            setRecords(snap.docs.map(d => ({ id: d.id, ...d.data() } as PayrollRecord)));
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: "Error", description: "Failed to load history." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (schoolId) fetchHistory();
    }, [period, schoolId]);

    const totals = useMemo(() => {
        return records.reduce((acc, r) => ({
            gross: acc.gross + r.grossSalary,
            net: acc.net + r.netSalary,
            tax: acc.tax + (r.statutory?.paye || 0)
        }), { gross: 0, net: 0, tax: 0 });
    }, [records]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="bg-slate-50 border-slate-200">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg">Reference Past Runs</CardTitle>
                            <CardDescription>Select a period to view saved payroll data.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label className="text-xs uppercase font-bold text-slate-500">Month</Label>
                            <Input 
                                type="month" 
                                value={period} 
                                onChange={e => setPeriod(e.target.value)} 
                                className="bg-white w-[200px]"
                            />
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-indigo-600"/></div>
            ) : records.length === 0 ? (
                <div className="text-center py-20 bg-white border-2 border-dashed rounded-3xl">
                    <History className="mx-auto h-12 w-12 text-slate-200 mb-2"/>
                    <p className="text-slate-500">No payroll records found for {period}.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-indigo-50 border-indigo-100">
                            <CardContent className="p-4"><p className="text-xs font-bold text-indigo-600 uppercase">Gross Payout</p><p className="text-2xl font-black">GH₵{totals.gross.toLocaleString()}</p></CardContent>
                        </Card>
                        <Card className="bg-rose-50 border-rose-100">
                            <CardContent className="p-4"><p className="text-xs font-bold text-rose-600 uppercase">Total PAYE Tax</p><p className="text-2xl font-black">GH₵{totals.tax.toLocaleString()}</p></CardContent>
                        </Card>
                        <Card className="bg-emerald-50 border-emerald-100">
                            <CardContent className="p-4"><p className="text-xs font-bold text-emerald-600 uppercase">Total Net Paid</p><p className="text-2xl font-black">GH₵{totals.net.toLocaleString()}</p></CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Staff Member</TableHead>
                                        <TableHead className="text-right">Gross</TableHead>
                                        <TableHead className="text-right">Net Salary</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {records.map(r => (
                                        <TableRow key={r.id}>
                                            <TableCell className="font-bold">{r.staffName}</TableCell>
                                            <TableCell className="text-right text-slate-500">GH₵{r.grossSalary.toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-black text-emerald-700">GH₵{r.netSalary.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" onClick={() => setSelectedSlip(r)}>
                                                            <Eye className="h-4 w-4 mr-2"/> View Slip
                                                        </Button>
                                                    </DialogTrigger>
                                                    {selectedSlip && selectedSlip.id === r.id && (
                                                        <PayslipDialog payslip={selectedSlip} />
                                                    )}
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}

// --- COMPONENT: Run Payroll ---
function RunPayroll({ staff, config }: { staff: any[], config: any }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    const [isProcessing, setIsProcessing] = useState(false);
    const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
    const [previewData, setPreviewData] = useState<any[]>([]);

    // Generate Preview
    const handlePreview = async () => {
        if (!firestore || !schoolId) return;
        setIsProcessing(true);
        const existingRecordsQuery = query(collection(firestore, 'payrollRecords'), where('period', '==', month), where('schoolId', '==', schoolId));
        const existingRecordsSnapshot = await getDocs(existingRecordsQuery);
        if (!existingRecordsSnapshot.empty) {
            toast({ variant: 'destructive', title: 'Payroll Already Run', description: `Payroll for ${month} has already been processed. View in "History" tab.`});
            setIsProcessing(false);
            return;
        }

        const staffWithConfig = [];
        for (const emp of staff) {
            const configSnap = await getDocs(query(collection(firestore, `staff/${emp.uid}/payroll`)));
            if (!configSnap.empty) {
                staffWithConfig.push({ ...emp, salaryInfo: configSnap.docs[0].data() });
            }
        }

        const generated = staffWithConfig.map(emp => {
            const salaryInfo = emp.salaryInfo || {};
            const calc = calculatePayslip(salaryInfo, config);
            return { staffId: emp.uid, staffName: `${emp.firstName} ${emp.lastName}`, ...calc };
        });
        setPreviewData(generated);
        setIsProcessing(false);
    };

    const handleCommit = async () => {
        if (!firestore || !user || !schoolId || previewData.length === 0) return;
        setIsProcessing(true);
        const batch = writeBatch(firestore);

        try {
            previewData.forEach(p => {
                const ref = doc(collection(firestore, 'payrollRecords'));
                const { staffId, staffName, ...payslipData } = p;
                batch.set(ref, {
                    staffId, staffName,
                    period: month,
                    ...payslipData,
                    createdAt: serverTimestamp(),
                    generatedBy: user.uid,
                    schoolId: schoolId,
                });
            });

            await batch.commit();

            toast({ title: "Payroll Processed", description: `Paid ${previewData.length} employees for ${month}. Data is now archived in History.` });
            setPreviewData([]);
        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-l-4 border-l-indigo-600">
                <CardHeader>
                    <CardTitle>Calculate Monthly Payroll</CardTitle>
                    <CardDescription>Generate salaries for all staff based on their individual configurations.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4 items-end bg-slate-50/50 p-6 border-t border-b">
                    <div className="space-y-2 flex-1">
                        <Label className="text-xs font-black text-slate-500 uppercase">Payout Month</Label>
                        <Input type="month" value={month} onChange={e => setMonth(e.target.value)} className="bg-white h-12" />
                    </div>
                    <Button onClick={handlePreview} className="bg-indigo-600 h-12 px-8 font-bold" disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="animate-spin mr-2"/> : <Calculator className="mr-2 h-4 w-4"/>} 
                        Generate Preview
                    </Button>
                </CardContent>
            </Card>

            {previewData.length > 0 && (
                <Card className="animate-in slide-in-from-bottom-2 duration-500">
                    <CardHeader className="flex flex-row justify-between items-center bg-slate-50 border-b">
                        <div>
                            <CardTitle>Approval Required: {month}</CardTitle>
                            <CardDescription>Review the net payouts before committing to the ledger.</CardDescription>
                        </div>
                        <Button onClick={handleCommit} disabled={isProcessing} className="bg-green-600 hover:bg-green-700 h-12 px-10 font-black shadow-lg shadow-green-900/10">
                            {isProcessing ? <Loader2 className="animate-spin"/> : <CheckCircle2 className="mr-2 h-5 w-5"/>}
                            Approve & Save Payroll
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50">
                                    <TableHead>Staff Member</TableHead>
                                    <TableHead className="text-right">Gross</TableHead>
                                    <TableHead className="text-right">SSNIT (5.5%)</TableHead>
                                    <TableHead className="text-right">PAYE Tax</TableHead>
                                    <TableHead className="text-right font-bold">Net Pay</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {previewData.map((p) => (
                                    <TableRow key={p.staffId}>
                                        <TableCell className="font-bold">{p.staffName}</TableCell>
                                        <TableCell className="text-right text-slate-500">GH₵{p.grossSalary.toFixed(2)}</TableCell>
                                        <TableCell className="text-right text-rose-500">-{p.ssnitDeduction.toFixed(2)}</TableCell>
                                        <TableCell className="text-right text-rose-500">-{p.payeTax.toFixed(2)}</TableCell>
                                        <TableCell className="text-right font-black text-emerald-700">GH₵{p.netSalary.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// --- COMPONENT: Payroll Settings ---
function PayrollSettingsForm() {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'payrollSettings', 'global') : null, [firestore]);
    const { data: config, isLoading } = useDoc(settingsRef);

    if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>;

    const displayBrackets = config?.payeeBrackets || DEFAULT_TAX_BRACKETS;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-indigo-600"/> Global Statutory Rates</CardTitle>
                    <CardDescription>Standard rates used for SSNIT calculations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl border">
                            <Label className="text-[10px] uppercase font-black text-slate-400">Employee SSNIT</Label>
                            <p className="text-2xl font-black text-indigo-700">{((config?.ssnitEmployeeContributionRate || 0.055) * 100).toFixed(1)}%</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border">
                            <Label className="text-[10px] uppercase font-black text-slate-400">Employer SSNIT</Label>
                            <p className="text-2xl font-black text-indigo-700">{((config?.ssnitEmployerContributionRate || 0.13) * 100).toFixed(1)}%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Landmark className="h-5 w-5 text-indigo-600"/> PAYE Tax Brackets</CardTitle>
                    <CardDescription>Annual income ranges according to the latest tax laws.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-xl overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead>Annual Income Range (GH₵)</TableHead>
                                    <TableHead className="text-right">Rate</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayBrackets.map((b: any, i: number) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-mono text-xs">{b.from.toLocaleString()} - {(b.to === Infinity || !b.to) ? 'Above' : b.to.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-bold">{(b.rate * 100).toFixed(1)}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// --- MAIN PAGE ---
export default function PayrollPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();

    const staffQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: staff, isLoading: isLoadingStaff } = useCollection<any>(staffQuery);

    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'payrollSettings', 'global') : null, [firestore]);
    const { data: config, isLoading: isLoadingSettings } = useDoc(settingsRef);

    const canManage = ['Administrator', 'Director', 'Accountant'].includes(role || '');

    const isLoading = schoolLoading || isLoadingStaff || isLoadingSettings;

    if (!canManage) return <div className="p-8 text-center text-red-500">Access Denied. Financial staff only.</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200">
                        <Banknote className="h-8 w-8 text-white"/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Payroll Hub</h1>
                        <p className="text-muted-foreground font-medium italic">Generate salaries and track payment history.</p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="run" className="w-full">
                <TabsList className="w-full md:w-auto bg-slate-100 p-1 rounded-xl mb-6">
                    <TabsTrigger value="run" className="rounded-lg px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Calculator className="h-4 w-4 mr-2"/> Run Payroll
                    </TabsTrigger>
                    <TabsTrigger value="history" className="rounded-lg px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <History className="h-4 w-4 mr-2"/> History
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-lg px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Settings className="h-4 w-4 mr-2"/> Tax Config
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="run">
                    {isLoading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div>
                    ) : (
                        <RunPayroll staff={staff || []} config={config} />
                    )}
                </TabsContent>

                <TabsContent value="history">
                    {schoolId && <PayrollHistory schoolId={schoolId} />}
                </TabsContent>

                <TabsContent value="settings">
                    <PayrollSettingsForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}

    