
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, doc, setDoc, writeBatch, where, getDocs, runTransaction, increment } from 'firebase/firestore';
import { 
  Banknote, Calculator, Settings, UserCog, CheckCircle2, 
  FileText, Loader2, Save, Printer, DollarSign, Landmark 
} from 'lucide-react';
import { format } from 'date-fns';
import { useCurrentSchool } from '@/hooks/use-current-school';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Staff, StaffPayrollConfig, PayrollSettings, PayrollRecord } from '@/lib/types';
import { PayslipDialog } from './payslip-dialog';
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


// --- COMPONENT: Payroll Settings ---
function PayrollSettingsForm() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    
    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'payrollSettings', 'global') : null, [firestore]);
    const { data: config } = useDoc(settingsRef);

    const handleSaveDefault = async () => {
        if (!firestore) return;
        setLoading(true);
        try {
            await setDoc(doc(firestore, 'payrollSettings', 'global'), {
                ssnitEmployeeContributionRate: 0.055,
                ssnitEmployerContributionRate: 0.13,
                payeeBrackets: DEFAULT_TAX_BRACKETS,
                updatedAt: serverTimestamp()
            }, { merge: true });
            toast({ title: "Updated", description: "Tax tables updated to Ghana 2024 defaults." });
        } catch (e) {
            toast({ variant: 'destructive', title: "Error" });
        } finally {
            setLoading(false);
        }
    };
    
    const displayBrackets = config?.payeeBrackets || DEFAULT_TAX_BRACKETS;

    return (
        <Card>
            <CardHeader><CardTitle>Tax & SSNIT Configuration</CardTitle><CardDescription>Current statutory rates for Ghana.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>SSNIT Employee Rate</Label>
                        <Input value={`${((config?.ssnitEmployeeContributionRate || 0.055) * 100).toFixed(1)}%`} disabled className="bg-slate-100" />
                    </div>
                    <div>
                        <Label>SSNIT Employer Rate</Label>
                        <Input value={`${((config?.ssnitEmployerContributionRate || 0.13) * 100).toFixed(1)}%`} disabled className="bg-slate-100" />
                    </div>
                </div>
                
                <div>
                    <Label className="mb-2 block">PAYE Tax Brackets (Annual Chargeable Income)</Label>
                    <div className="border rounded-md overflow-hidden">
                        <Table>
                            <TableHeader><TableRow><TableHead>Annual Income Range (GH₵)</TableHead><TableHead>Rate</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {displayBrackets.map((b: any, i: number) => (
                                    <TableRow key={i}>
                                        <TableCell>{b.from.toLocaleString()} - {(b.to === Infinity || !b.to) ? 'Above' : b.to.toLocaleString()}</TableCell>
                                        <TableCell>{b.rate * 100}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// --- COMPONENT: Run Payroll ---
function RunPayroll({ staff, config }: { staff: any[], config: any }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
    const [previewData, setPreviewData] = useState<any[]>([]);
    const { schoolId } = useCurrentSchool();

    // Generate Preview
    const handlePreview = async () => {
        if (!firestore || !schoolId) return;
        setIsProcessing(true);
        const existingRecordsQuery = query(collection(firestore, 'payrollRecords'), where('period', '==', month), where('schoolId', '==', schoolId));
        const existingRecordsSnapshot = await getDocs(existingRecordsQuery);
        if (!existingRecordsSnapshot.empty) {
            toast({ variant: 'destructive', title: 'Payroll Already Run', description: `Payroll for ${month} has already been processed. View in "Reports".`});
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

            toast({ title: "Payroll Processed", description: `Paid ${previewData.length} employees for ${month}.` });
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
            <Card>
                <CardHeader><CardTitle>Run Monthly Payroll</CardTitle></CardHeader>
                <CardContent className="flex gap-4 items-end">
                    <div className="space-y-2 flex-1">
                        <Label>Select Month</Label>
                        <Input type="month" value={month} onChange={e => setMonth(e.target.value)} />
                    </div>
                    <Button onClick={handlePreview} className="bg-indigo-600" disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="animate-spin mr-2"/> : <Calculator className="mr-2 h-4 w-4"/>} 
                        Calculate Payroll
                    </Button>
                </CardContent>
            </Card>

            {previewData.length > 0 && (
                <Card>
                    <CardHeader className="flex flex-row justify-between">
                        <CardTitle>Payroll Preview: {month}</CardTitle>
                        <Button onClick={handleCommit} disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
                            {isProcessing ? <Loader2 className="animate-spin"/> : <CheckCircle2 className="mr-2 h-4 w-4"/>}
                            Approve & Save Payroll
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-md overflow-hidden">
                        <Table>
                            <TableHeader><TableRow><TableHead>Staff</TableHead><TableHead className="text-right">Gross</TableHead><TableHead className="text-right">SSNIT</TableHead><TableHead className="text-right">Tax (PAYE)</TableHead><TableHead className="text-right font-bold">Net Pay</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {previewData.map((p) => (
                                    <TableRow key={p.staffId}>
                                        <TableCell>{p.staffName}</TableCell>
                                        <TableCell className="text-right">{p.grossSalary.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">-{p.ssnitDeduction.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">-{p.payeTax.toFixed(2)}</TableCell>
                                        <TableCell className="text-right font-bold text-green-700">GH₵{p.netSalary.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// --- MAIN PAGE ---
export default function PayrollPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();

    const staffQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: staff, isLoading: isLoadingStaff } = useCollection<any>(staffQuery);

    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'payrollSettings', 'global') : null, [firestore]);
    const { data: config, isLoading: isLoadingSettings } = useDoc(settingsRef);

    const canManage = ['Administrator', 'Director', 'Accountant'].includes(role);

    const isLoading = isLoadingStaff || isLoadingSettings;

    if (!canManage) return <div className="p-8 text-center text-red-500">Access Denied</div>;

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Banknote className="h-8 w-8 text-indigo-700"/>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Payroll Management</h1>
                    <p className="text-muted-foreground">Manage salaries, taxes (PAYE), and SSNIT.</p>
                </div>
            </div>

            {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                <RunPayroll staff={staff || []} config={config} />
            )}
        </div>
    );
}
