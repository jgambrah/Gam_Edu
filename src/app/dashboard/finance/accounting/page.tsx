
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, doc, updateDoc, increment, runTransaction } from 'firebase/firestore';
import { 
  Book, Scale, CreditCard, FileText, Plus, Landmark, 
  Save, Loader2, CornerDownRight, Trash2, Receipt
} from 'lucide-react';
import { format } from 'date-fns';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

// --- TYPES ---
export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

export interface Account {
  id: string;
  code: string; 
  name: string; 
  type: AccountType;
  description?: string;
  balance: number;
  parentId?: string | null;
}

export interface JournalLine {
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: any;
  description: string;
  lines: JournalLine[];
  totalAmount: number;
  createdBy: string;
  createdAt: any;
}

// --- COMPONENT: Chart of Accounts Manager ---
function ChartOfAccounts({ accounts }: { accounts: Account[] | undefined }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState<AccountType>('Expense');
    const [isSubAccount, setIsSubAccount] = useState(false);
    const [parentId, setParentId] = useState<string>('');

    useEffect(() => {
        if (isSubAccount && parentId && accounts) {
            const parent = accounts.find(a => a.id === parentId);
            if (parent) setType(parent.type);
        }
    }, [parentId, isSubAccount, accounts]);

    const handleCreate = async () => {
        if (!code || !name) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(firestore, 'accounts'), {
                code, name, type, balance: 0, 
                parentId: isSubAccount ? parentId : null,
                createdAt: serverTimestamp()
            });
            toast({ title: "Account Created" });
            setIsFormOpen(false);
            setCode(''); setName(''); setIsSubAccount(false); setParentId('');
        } catch (e) {
            toast({ variant: 'destructive', title: "Error", description: "Could not create account." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const organizedAccounts = useMemo(() => {
        if (!accounts) return [];
        const parents = accounts.filter(a => !a.parentId).sort((a,b) => a.code.localeCompare(b.code));
        let displayList: (Account & { depth: number })[] = [];
        parents.forEach(parent => {
            displayList.push({ ...parent, depth: 0 });
            const children = accounts.filter(a => a.parentId === parent.id).sort((a,b) => a.code.localeCompare(b.code));
            children.forEach(child => displayList.push({ ...child, depth: 1 }));
        });
        return displayList;
    }, [accounts]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">General Ledger Accounts</h3>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4"/> New Account</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Add Ledger Account</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="flex items-center space-x-2 border p-3 rounded bg-slate-50">
                                <Checkbox id="subLedger" checked={isSubAccount} onCheckedChange={(c) => { setIsSubAccount(!!c); if(!c) setParentId(''); }}/>
                                <label htmlFor="subLedger" className="text-sm font-medium cursor-pointer">Make this a Sub-Ledger</label>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Code</Label><Input value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. 1001" /></div>
                                <div className="space-y-2"><Label>Type</Label>
                                    <Select value={type} onValueChange={(v: AccountType) => setType(v)} disabled={isSubAccount}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Asset">Asset</SelectItem><SelectItem value="Liability">Liability</SelectItem><SelectItem value="Equity">Equity</SelectItem><SelectItem value="Revenue">Revenue</SelectItem><SelectItem value="Expense">Expense</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {isSubAccount && (
                                <div className="space-y-2">
                                    <Label>Parent Account</Label>
                                    <Select value={parentId} onValueChange={setParentId}>
                                        <SelectTrigger><SelectValue placeholder="Select Main Ledger" /></SelectTrigger>
                                        <SelectContent>{accounts?.filter(a => !a.parentId).map(a => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            )}
                            <div className="space-y-2"><Label>Account Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. GCB Bank" /></div>
                            <Button onClick={handleCreate} disabled={isSubmitting} className="w-full">Save Account</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="border rounded-md bg-white">
                <Table>
                    <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Account Name</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Balance (GH₵)</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {organizedAccounts.map(acc => (
                            <TableRow key={acc.id} className={acc.depth > 0 ? "bg-slate-50" : ""}>
                                <TableCell className="font-mono text-xs text-slate-500">{acc.code}</TableCell>
                                <TableCell className="font-medium"><div className="flex items-center">{acc.depth > 0 && <CornerDownRight className="h-4 w-4 mr-2 text-slate-400" />}<span className={acc.depth > 0 ? "text-slate-700" : "font-bold text-slate-900"}>{acc.name}</span></div></TableCell>
                                <TableCell><Badge variant="outline">{acc.type}</Badge></TableCell>
                                <TableCell className="text-right font-bold">{acc.balance.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// --- COMPONENT: Payment Voucher (Ghana Tax Compliance) ---
function PaymentVoucherForm({ accounts }: { accounts: Account[] | undefined }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    
    // Form State
    const [payee, setPayee] = useState('');
    const [desc, setDesc] = useState('');
    const [grossAmount, setGrossAmount] = useState(''); // Total Invoice Amount
    
    // Accounts
    const [expenseAcc, setExpenseAcc] = useState('');
    const [paymentAcc, setPaymentAcc] = useState('');
    const [whtLiabilityAcc, setWhtLiabilityAcc] = useState('');

    // Payment Details
    const [method, setMethod] = useState('Bank Transfer');
    const [refNumber, setRefNumber] = useState('');

    // Tax Configuration
    const [whtRate, setWhtRate] = useState('0'); 
    const [vatScheme, setVatScheme] = useState('Exempt'); // Default to None/Exempt

    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- GHANA TAX CALCULATOR ---
    const { baseAmount, whtAmount, netPayable, vatAmount } = useMemo(() => {
        const gross = parseFloat(grossAmount) || 0;
        const whtPercent = parseFloat(whtRate) / 100;
        
        let taxableBase = gross;
        let taxes = 0;

        // 1. Strip VAT to find Taxable Base for WHT
        // Standard: 2.5(NHIL)+2.5(GET)+1(COVID) + 15(VAT on subtotal) ~= 21.925% effective
        if (vatScheme === 'Standard Rated') {
            taxableBase = gross / 1.21925; 
            taxes = gross - taxableBase;
        } 
        // Flat Rate (Retailers): 3% or 4%. Using 3% as common flat rate (VFRS)
        else if (vatScheme === 'Flat Rate (3%)') {
            taxableBase = gross / 1.03;
            taxes = gross - taxableBase;
        }
        else if (vatScheme === 'Flat Rate (4%)') {
            taxableBase = gross / 1.04;
            taxes = gross - taxableBase;
        }
        // Zero Rated / Exempt: Base = Gross

        // 2. Calculate WHT on the BASE amount (Not the gross)
        const calculatedWht = taxableBase * whtPercent;

        // 3. Net Payable to Vendor
        const payable = gross - calculatedWht;

        return {
            baseAmount: taxableBase,
            vatAmount: taxes,
            whtAmount: calculatedWht,
            netPayable: payable
        };
    }, [grossAmount, whtRate, vatScheme]);

    // Filter accounts
    const expenseAccounts = accounts?.filter(a => a.type === 'Expense' || a.type === 'Asset' || a.type === 'Liability').sort((a,b) => a.code.localeCompare(b.code));
    const paymentAccounts = accounts?.filter(a => a.type === 'Asset').sort((a,b) => a.code.localeCompare(b.code));
    const liabilityAccounts = accounts?.filter(a => a.type === 'Liability').sort((a,b) => a.code.localeCompare(b.code));

    const handleCreatePV = async () => {
        if (!firestore || !user) return;
        
        if (!payee || !grossAmount || !expenseAcc || !paymentAcc) {
            toast({ variant: 'destructive', title: "Missing Fields", description: "Please fill all required fields." });
            return;
        }
        if (whtAmount > 0 && !whtLiabilityAcc) {
            toast({ variant: 'destructive', title: "Missing Account", description: "Select a WHT Liability account to record the tax." });
            return;
        }

        setIsSubmitting(true);
        try {
            await runTransaction(firestore, async (transaction) => {
                // 1. Create PV Record
                const pvRef = doc(collection(firestore, 'payment_vouchers'));
                transaction.set(pvRef, {
                    payee, 
                    description: desc, 
                    grossAmount: parseFloat(grossAmount),
                    vatScheme,
                    whtRate: parseFloat(whtRate),
                    whtAmount,
                    netAmount: netPayable,
                    paymentMethod: method,
                    referenceNumber: refNumber,
                    expenseAccountId: expenseAcc, 
                    paymentAccountId: paymentAcc,
                    whtLiabilityAccountId: whtLiabilityAcc || null,
                    status: 'Paid', 
                    date: serverTimestamp(), 
                    createdBy: user.uid
                });

                // 2. Create Journal Entry
                const journalRef = doc(collection(firestore, 'journal_entries'));
                const expName = accounts?.find(a => a.id === expenseAcc)?.name || '';
                const bankName = accounts?.find(a => a.id === paymentAcc)?.name || '';
                const whtName = accounts?.find(a => a.id === whtLiabilityAcc)?.name || '';

                // Logic: 
                // Dr Expense (Gross Amount - Assuming VAT is a cost to the school)
                // Cr Bank (Net Payable)
                // Cr WHT Payable (Tax withheld)
                
                const lines = [
                    { accountId: expenseAcc, accountName: expName, debit: parseFloat(grossAmount), credit: 0 },
                    { accountId: paymentAcc, accountName: bankName, debit: 0, credit: netPayable }
                ];

                if (whtAmount > 0) {
                    lines.push({ accountId: whtLiabilityAcc, accountName: whtName, debit: 0, credit: whtAmount });
                }

                transaction.set(journalRef, {
                    date: new Date(),
                    description: `PV: ${desc} - ${payee}`,
                    totalAmount: parseFloat(grossAmount),
                    createdBy: user.uid,
                    createdAt: serverTimestamp(),
                    lines: lines
                });

                // 3. Update Balances
                transaction.update(doc(firestore, 'accounts', expenseAcc), { balance: increment(parseFloat(grossAmount)) });
                transaction.update(doc(firestore, 'accounts', paymentAcc), { balance: increment(-netPayable) });
                if (whtAmount > 0) {
                    transaction.update(doc(firestore, 'accounts', whtLiabilityAcc), { balance: increment(whtAmount) });
                }
            });

            toast({ title: "Voucher Processed", description: `Paid GH₵${netPayable.toFixed(2)}` });
            setPayee(''); setGrossAmount(''); setDesc(''); setRefNumber('');
        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="border-t-4 border-t-indigo-500">
            <CardHeader>
                <CardTitle>Payment Voucher</CardTitle>
                <CardDescription>Expenditure with WHT & VAT computation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                
                {/* 1. PAYEE & METHOD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Payee / Vendor</Label><Input value={payee} onChange={e => setPayee(e.target.value)} placeholder="e.g. Service Provider Ltd" /></div>
                    <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <div className="flex gap-2">
                            <Select value={method} onValueChange={setMethod}>
                                <SelectTrigger className="w-[140px]"><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="Cheque">Cheque</SelectItem>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="MoMo">Mobile Money</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input value={refNumber} onChange={e => setRefNumber(e.target.value)} placeholder={method === 'Cheque' ? "Cheque No." : "Ref ID"} className="flex-1" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2"><Label>Description</Label><Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. Repair of School Bus" /></div>

                {/* 2. TAX CONFIGURATION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded border">
                    <div className="space-y-2">
                        <Label>Invoice Total (Gross)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-500">GH₵</span>
                            <Input type="number" value={grossAmount} onChange={e => setGrossAmount(e.target.value)} className="pl-12 font-bold" placeholder="0.00"/>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Vendor VAT Type</Label>
                        <Select value={vatScheme} onValueChange={setVatScheme}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Exempt">Exempt / None</SelectItem>
                                <SelectItem value="Standard Rated">Standard Rated (15% + Levies)</SelectItem>
                                <SelectItem value="Flat Rate (3%)">Flat Rate (3%)</SelectItem>
                                <SelectItem value="Flat Rate (4%)">Flat Rate (4%)</SelectItem>
                                <SelectItem value="Zero Rated">Zero Rated (0%)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-[10px] text-slate-500">Used to calculate Taxable Base for WHT.</p>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>WHT Rate (%)</Label>
                        <Select value={whtRate} onValueChange={setWhtRate}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">0% (None)</SelectItem>
                                <SelectItem value="3">3% (Supply of Goods)</SelectItem>
                                <SelectItem value="5">5% (Works/Construction)</SelectItem>
                                <SelectItem value="7.5">7.5% (Services/Consultancy)</SelectItem>
                                <SelectItem value="15">15% (Rent/Director Fees)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* 3. CALCULATION PREVIEW */}
                {parseFloat(grossAmount) > 0 && (
                    <div className="bg-slate-100 p-4 rounded-lg text-sm space-y-2 border border-slate-200">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Gross Invoice:</span>
                            <span className="font-medium">GH₵ {parseFloat(grossAmount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Less VAT/Levies ({vatScheme}):</span>
                            <span>- GH₵ {vatAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500">Taxable Base Amount:</span>
                            <span className="font-medium">GH₵ {baseAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                            <span>Withholding Tax ({whtRate}% on Base):</span>
                            <span>- GH₵ {whtAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 text-indigo-700">
                            <span>Net Payable to Vendor:</span>
                            <span>GH₵ {netPayable.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                {/* 4. ACCOUNTS MAPPING */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Expense Account (Debit)</Label>
                        <Select value={expenseAcc} onValueChange={setExpenseAcc}>
                            <SelectTrigger><SelectValue placeholder="Select Expense Category"/></SelectTrigger>
                            <SelectContent>{expenseAccounts?.map(a => <SelectItem key={a.id} value={a.id}>{a.parentId ? '↳ ' : ''}{a.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Bank/Cash Account (Credit)</Label>
                        <Select value={paymentAcc} onValueChange={setPaymentAcc}>
                            <SelectTrigger><SelectValue placeholder="Select Source of Funds"/></SelectTrigger>
                            <SelectContent>{paymentAccounts?.map(a => <SelectItem key={a.id} value={a.id}>{a.parentId ? '↳ ' : ''}{a.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>

                {whtAmount > 0 && (
                    <div className="space-y-2 bg-yellow-50 p-3 rounded border border-yellow-200">
                        <Label className="text-yellow-800">WHT Liability Account (Credit)</Label>
                        <Select value={whtLiabilityAcc} onValueChange={setWhtLiabilityAcc}>
                            <SelectTrigger className="bg-white"><SelectValue placeholder="Select Tax Payable Account"/></SelectTrigger>
                            <SelectContent>{liabilityAccounts?.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                )}

                <Button onClick={handleCreatePV} disabled={isSubmitting} className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700">
                    {isSubmitting ? <Loader2 className="animate-spin"/> : <FileText className="mr-2 h-5 w-5"/>} 
                    Process Payment
                </Button>
            </CardContent>
        </Card>
    );
}

// --- JOURNAL ENTRY COMPONENT (Unchanged but included for completeness) ---
function JournalEntryForm({ accounts }: { accounts: Account[] | undefined }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [desc, setDesc] = useState('');
    const [lines, setLines] = useState([{ accountId: '', debit: 0, credit: 0 }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalDebit = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + (line.credit || 0), 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

    const addLine = () => setLines([...lines, { accountId: '', debit: 0, credit: 0 }]);
    const removeLine = (idx: number) => setLines(lines.filter((_, i) => i !== idx));

    const updateLine = (idx: number, field: string, value: any) => {
        const newLines = [...lines];
        (newLines[idx] as any)[field] = value;
        if(field === 'debit' && value > 0) newLines[idx].credit = 0;
        if(field === 'credit' && value > 0) newLines[idx].debit = 0;
        setLines(newLines);
    };

    const handlePost = async () => {
        if (!firestore || !user) return;
        if (!isBalanced) {
            toast({ variant: 'destructive', title: "Unbalanced", description: "Debits must equal Credits." });
            return;
        }
        setIsSubmitting(true);
        try {
            await runTransaction(firestore, async (transaction) => {
                const journalRef = doc(collection(firestore, 'journal_entries'));
                const finalLines = lines.map(line => ({
                    ...line,
                    accountName: accounts?.find(a => a.id === line.accountId)?.name || 'Unknown'
                }));
                transaction.set(journalRef, {
                    date: new Date(date), description: desc, lines: finalLines,
                    totalAmount: totalDebit, createdBy: user.uid, createdAt: serverTimestamp()
                });
                for (const line of lines) {
                    const accRef = doc(firestore, 'accounts', line.accountId);
                    const accDoc = await transaction.get(accRef);
                    if (!accDoc.exists()) throw "Account not found";
                    const accData = accDoc.data() as Account;
                    let change = 0;
                    if (['Asset', 'Expense'].includes(accData.type)) change = line.debit - line.credit;
                    else change = line.credit - line.debit;
                    transaction.update(accRef, { balance: increment(change) });
                }
            });
            toast({ title: "Posted", description: "Journal Entry successful." });
            setDesc(''); setLines([{ accountId: '', debit: 0, credit: 0 }, { accountId: '', debit: 0, credit: 0 }]);
        } catch (e) {
            toast({ variant: 'destructive', title: "Error", description: "Transaction failed." });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Sort accounts helper
    const sortedAccounts = useMemo(() => {
        return accounts?.sort((a,b) => a.code.localeCompare(b.code)) || [];
    }, [accounts]);

    return (
        <Card>
            <CardHeader><CardTitle>Manual Journal Entry</CardTitle><CardDescription>Record complex adjustments or transfers.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div><Label>Date</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
                    <div className="col-span-2"><Label>Narration</Label><Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. Opening Balance" /></div>
                </div>
                <div className="border rounded-md p-2 bg-slate-50 space-y-2">
                    {lines.map((line, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <Select value={line.accountId} onValueChange={(v) => updateLine(idx, 'accountId', v)}>
                                <SelectTrigger className="flex-1"><SelectValue placeholder="Select Account" /></SelectTrigger>
                                <SelectContent>{sortedAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.parentId ? `↳ ${a.name}` : a.name} ({a.code})</SelectItem>)}</SelectContent>
                            </Select>
                            <div className="w-24"><Input type="number" placeholder="Dr" value={line.debit || ''} onChange={e => updateLine(idx, 'debit', parseFloat(e.target.value))} /></div>
                            <div className="w-24"><Input type="number" placeholder="Cr" value={line.credit || ''} onChange={e => updateLine(idx, 'credit', parseFloat(e.target.value))} /></div>
                            <Button variant="ghost" size="icon" onClick={() => removeLine(idx)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addLine}><Plus className="mr-2 h-4 w-4"/> Add Line</Button>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                    <div className="text-sm">Total Dr: <b>₵{totalDebit.toFixed(2)}</b> | Total Cr: <b>₵{totalCredit.toFixed(2)}</b></div>
                    <Button onClick={handlePost} disabled={!isBalanced || isSubmitting || totalDebit === 0}>{isSubmitting ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>} Post Entry</Button>
                </div>
            </CardContent>
        </Card>
    );
}

// --- MAIN PAGE ---
export default function AccountingPage() {
    const { role } = useRole();
    const firestore = useFirestore();

    const accountsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'accounts')) : null, [firestore]);
    const { data: accounts, isLoading } = useCollection<Account>(accountsQuery);

    const journalQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'journal_entries'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: journals } = useCollection<JournalEntry>(journalQuery);

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role);
    if (!canAccess) return <div className="p-8 text-center text-red-500">Access Denied</div>;

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Landmark className="h-8 w-8 text-indigo-700"/>
                <div><h1 className="text-2xl font-bold text-slate-800">Accounting & General Ledger</h1><p className="text-muted-foreground">Manage chart of accounts and expenditures.</p></div>
            </div>
            <Tabs defaultValue="overview">
                <TabsList className="w-full justify-start"><TabsTrigger value="overview">Chart of Accounts</TabsTrigger><TabsTrigger value="journal">Journal Entry</TabsTrigger><TabsTrigger value="pv">Payment Voucher</TabsTrigger><TabsTrigger value="report">General Ledger</TabsTrigger></TabsList>
                <TabsContent value="overview" className="mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">{isLoading ? <Loader2 className="mx-auto animate-spin"/> : <ChartOfAccounts accounts={accounts || []} />}</div>
                        <div className="space-y-4">
                            <Card className="bg-blue-50 border-blue-100"><CardHeader><CardTitle className="text-sm">Total Assets</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-blue-700">GH₵{accounts?.filter(a => a.type === 'Asset').reduce((sum, a) => sum + a.balance, 0).toFixed(2)}</CardContent></Card>
                            <Card className="bg-green-50 border-green-100"><CardHeader><CardTitle className="text-sm">Total Revenue</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-green-700">GH₵{accounts?.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + a.balance, 0).toFixed(2)}</CardContent></Card>
                            <Card className="bg-red-50 border-red-100"><CardHeader><CardTitle className="text-sm">Total Expenses</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-red-700">GH₵{accounts?.filter(a => a.type === 'Expense').reduce((sum, a) => sum + a.balance, 0).toFixed(2)}</CardContent></Card>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="journal" className="mt-4"><JournalEntryForm accounts={accounts || []} /></TabsContent>
                <TabsContent value="pv" className="mt-4"><PaymentVoucherForm accounts={accounts || []} /></TabsContent>
                <TabsContent value="report" className="mt-4">
                    <Card><CardHeader><CardTitle>General Ledger Transactions</CardTitle></CardHeader><CardContent>
                            <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Details (Dr/Cr)</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                                <TableBody>{journals?.map(j => (
                                        <TableRow key={j.id}><TableCell className="text-xs">{j.date ? format(j.date.toDate(), 'PPP') : 'N/A'}</TableCell><TableCell className="font-medium">{j.description}</TableCell>
                                            <TableCell><div className="text-xs space-y-1">{j.lines.map((line, i) => (<div key={i} className="flex justify-between w-[200px]"><span>{line.accountName}</span><span>{line.debit > 0 ? <span className="text-slate-600">Dr {line.debit}</span> : <span className="text-slate-400">Cr {line.credit}</span>}</span></div>))}</div></TableCell>
                                            <TableCell className="text-right font-bold">GH₵{j.totalAmount.toFixed(2)}</TableCell></TableRow>
                                    ))}</TableBody>
                            </Table>
                        </CardContent></Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

