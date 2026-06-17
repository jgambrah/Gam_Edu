'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, serverTimestamp, updateDoc, writeBatch, query, where, addDoc, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, PlusCircle, CalendarIcon, Truck, Search, Plus, Trash2, 
  Eye, FileText, CheckCircle2, AlertCircle, Printer, Landmark, Sparkles, Receipt, HelpCircle, Save, ShieldAlert
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Vendor, AccountsPayableRecord, payableSchema, vendorSchema } from '@/lib/types';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentSchool } from '@/hooks/use-current-school';

// --- ZOD SCHEMAS FOR PURCHASE ORDERS ---
const poItemSchema = z.object({
    description: z.string().min(1, 'Item description is required.'),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
    unitPrice: z.coerce.number().min(0.01, 'Unit price must be positive.'),
});

const purchaseOrderSchema = z.object({
    vendorId: z.string().min(1, 'Supplier selection is required.'),
    deliveryDate: z.date({ required_error: 'Delivery date is required.' }),
    taxRate: z.coerce.number().min(0).max(100).default(0),
    notes: z.string().optional(),
    items: z.array(poItemSchema).min(1, 'At least one item is required.'),
});

type POFormValues = z.infer<typeof purchaseOrderSchema>;

interface PurchaseOrderItem {
    description: string;
    quantity: number;
    unitPrice: number;
}

interface PurchaseOrder {
    id: string;
    poNumber: string;
    vendorId: string;
    vendorName: string;
    items: PurchaseOrderItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    totalAmount: number;
    deliveryDate: any;
    notes?: string;
    status: 'Draft' | 'Sent' | 'Approved' | 'Delivered' | 'Cancelled';
    convertedToBill?: boolean;
    billId?: string;
    schoolId: string;
    createdAt: any;
    createdBy: string;
}

// --- HELPER: DATE FORMATTING ---
const formatDateSafe = (date: any) => {
    if (!date) return 'N/A';
    if (typeof date.toDate === 'function') return format(date.toDate(), 'PPP');
    return format(new Date(date), 'PPP');
};

// --- HELPER: CALCULATE PAYSLIP ---
function calculatePayslip(staff: any, config: any) {
    const basic = parseFloat(staff.basicSalary) || 0;
    const totalAllowances = (staff.allowances || []).reduce((sum: number, a: any) => sum + (parseFloat(a.amount) || 0), 0);
    const grossSalary = basic + totalAllowances;
    const ssnitEmployeeRate = config?.ssnitEmployeeContributionRate ?? 0.055;
    const ssnitEmployee = basic * ssnitEmployeeRate;
    const taxableIncome = grossSalary - ssnitEmployee;

    let taxPayable = 0;
    let remainingIncome = taxableIncome;
    const brackets = config?.payeeBrackets || DEFAULT_TAX_BRACKETS;

    for (const bracket of brackets) {
        if (remainingIncome <= 0) break;
        const width = bracket.to - bracket.from;
        const amountInBracket = Math.min(remainingIncome, width);
        if (amountInBracket > 0) {
            taxPayable += amountInBracket * bracket.rate;
            remainingIncome -= amountInBracket;
        }
    }

    const manualDeductions = (staff.deductions || []).reduce((sum: number, d: any) => sum + (parseFloat(d.amount) || 0), 0);
    const totalDeductions = ssnitEmployee + taxPayable + manualDeductions;
    const netSalary = grossSalary - totalDeductions;
    const ssnitEmployerRate = config?.ssnitEmployerContributionRate ?? 0.13;
    const employerSSNIT = basic * ssnitEmployerRate;

    return {
        basicSalary: basic,
        totalAllowances,
        grossSalary,
        taxableIncome,
        netSalary,
        totalDeductions,
        allowances: staff.allowances || [],
        deductions: staff.deductions || [],
        ssnitNumber: staff.ssnitNumber || '',
        tinNumber: staff.tinNumber || '',
        bankName: staff.bankName || '',
        accountNumber: staff.accountNumber || '',
        statutory: {
            ssnitEmployee,
            ssnitEmployer: employerSSNIT,
            paye: taxPayable
        }
    };
}

const DEFAULT_TAX_BRACKETS = [
    { from: 0, to: 490, rate: 0 },
    { from: 490, to: 600, rate: 0.05 },
    { from: 600, to: 730, rate: 0.10 },
    { from: 730, to: 3896.67, rate: 0.175 },
    { from: 3896.67, to: 19896.67, rate: 0.25 },
    { from: 19896.67, to: 50416.67, rate: 0.30 },
    { from: 50416.67, to: 99999999, rate: 0.35 }
];

// --- SUB-COMPONENT: SUPPLIER FORM ---
function SupplierForm({ setOpen, onSupplierAdded, schoolId }: { setOpen: (open: boolean) => void; onSupplierAdded: () => void; schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof vendorSchema>>({
        resolver: zodResolver(vendorSchema),
        defaultValues: {
            name: '',
            category: 'Office Supplies',
            email: '',
            phone: '',
        }
    });

    async function onSubmit(values: z.infer<typeof vendorSchema>) {
        if (!firestore || !schoolId) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(firestore, 'vendors'), {
                ...values,
                schoolId: schoolId,
                createdAt: serverTimestamp(),
            });
            toast({ title: 'Supplier Added', description: `${values.name} has been added to the directory.` });
            onSupplierAdded();
            form.reset();
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to add supplier.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase">Supplier / Vendor Name</FormLabel>
                        <FormControl><Input placeholder="e.g. Acme Stationery Ltd" className="h-10 bg-slate-50 rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase">Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="h-10 bg-slate-50 rounded-xl">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {['Office Supplies', 'Maintenance', 'IT Services', 'Catering', 'Transportation', 'Utilities', 'Other'].map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-500 uppercase">Phone Number</FormLabel>
                            <FormControl><Input placeholder="+233..." className="h-10 bg-slate-50 rounded-xl" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-500 uppercase">Email Address</FormLabel>
                            <FormControl><Input placeholder="info@supplier.com" className="h-10 bg-slate-50 rounded-xl" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl mt-2">
                    {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                    Add Supplier
                </Button>
            </form>
        </Form>
    );
}

// --- SUB-COMPONENT: BILL (ACCOUNTS PAYABLE) FORM ---
function PayableForm({ setOpen, onBillAdded, schoolId, vendors }: { setOpen: (open: boolean) => void; onBillAdded: () => void; schoolId: string; vendors: Vendor[] }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof payableSchema>>({
        resolver: zodResolver(payableSchema),
        defaultValues: {
            description: '',
            amount: 0,
            invoiceNumber: '',
            vendorId: '',
            expenseAccountId: '',
        }
    });

    async function onSubmit(values: z.infer<typeof payableSchema>) {
        if (!firestore || !schoolId) return;
        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(collection(firestore, 'accountsPayable'), {
                ...values,
                status: 'Unpaid',
                createdAt: serverTimestamp(),
                schoolId: schoolId,
            });
            toast({ title: 'Success', description: 'Bill has been recorded.' });
            onBillAdded();
            form.reset();
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to record bill.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="vendorId" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase">Supplier / Vendor</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="h-10 bg-slate-50 rounded-xl">
                                    <SelectValue placeholder="Select a vendor" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {vendors?.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase">Particulars Description</FormLabel>
                        <FormControl><Textarea placeholder="e.g., Procurement of printer toner cartridges" className="bg-slate-50 rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="amount" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-500 uppercase">Amount (GH₵)</FormLabel>
                            <FormControl><Input type="number" step="0.01" className="h-10 bg-slate-50 rounded-xl font-mono font-bold" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="dueDate" render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-xs font-bold text-slate-500 uppercase mb-1">Due Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={'outline'} className={cn('h-10 pl-3 text-left font-normal bg-slate-50 rounded-xl border-slate-200', !field.value && 'text-muted-foreground')}>
                                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>
                <FormField control={form.control} name="invoiceNumber" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase">Invoice Number (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g. INV-10029" className="h-10 bg-slate-50 rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="expenseAccountId" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-500 uppercase">Expense Mapping Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="h-10 bg-slate-50 rounded-xl">
                                    <SelectValue placeholder="Select category..." />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="office-supplies">Office Supplies</SelectItem>
                                <SelectItem value="maintenance">Maintenance & Repairs</SelectItem>
                                <SelectItem value="utilities">Utilities & Bills</SelectItem>
                                <SelectItem value="other">Other Operating Expenses</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl mt-2">
                    {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                    Record Vendor Bill
                </Button>
            </form>
        </Form>
    );
}

// --- SUB-COMPONENT: BILL PAYMENT DIALOG ---
function PayBillDialog({ bill, setOpen, onBillPaid }: { bill: AccountsPayableRecord; setOpen: (open: boolean) => void; onBillPaid: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentAccountId, setPaymentAccountId] = useState('');

    async function handlePayment() {
        if (!firestore || !paymentAccountId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a payment account.' });
            return;
        }
        setIsSubmitting(true);
        try {
            await updateDoc(doc(firestore, 'accountsPayable', bill.id), {
                status: 'Paid',
                paidAt: serverTimestamp(),
                paymentAccountId,
            });
            toast({ title: 'Bill Paid', description: `Paid amount of GH₵${bill.amount.toFixed(2)}.` });
            onBillPaid();
            setOpen(false);
        } catch(error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to process payment.' });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return (
        <DialogContent className="rounded-2xl max-w-md">
            <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-800">Confirm Payment Settlement</DialogTitle>
                <DialogDescription>Mark bill of GH₵{bill.amount.toFixed(2)} as paid to settlement ledger.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
                <Label className="text-xs font-bold text-slate-500 uppercase">Payment Account</Label>
                <Select onValueChange={setPaymentAccountId}>
                    <SelectTrigger className="h-11 bg-slate-50 rounded-xl"><SelectValue placeholder="Select disbursement account..."/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bank-main">Main Operating Bank Account</SelectItem>
                        <SelectItem value="petty-cash">Petty Cash</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button onClick={handlePayment} disabled={isSubmitting} className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md border-0">
                    {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                    Mark Paid & Disbursed
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}

// --- SUB-COMPONENT: PURCHASE ORDER BUILDER FORM ---
interface POFormProps {
    setOpen: (open: boolean) => void;
    onPOCreated: () => void;
    schoolId: string;
    vendors: Vendor[];
}
function PurchaseOrderForm({ setOpen, onPOCreated, schoolId, vendors }: POFormProps) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<POFormValues>({
        resolver: zodResolver(purchaseOrderSchema),
        defaultValues: {
            vendorId: '',
            taxRate: 0,
            notes: '',
            items: [{ description: '', quantity: 1, unitPrice: 0 }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    });

    const watchItems = form.watch('items') || [];
    const watchTax = form.watch('taxRate') || 0;

    const summary = useMemo(() => {
        const subtotal = watchItems.reduce((acc, curr) => acc + ((curr.quantity || 0) * (curr.unitPrice || 0)), 0);
        const taxAmount = subtotal * (watchTax / 100);
        const totalAmount = subtotal + taxAmount;
        return { subtotal, taxAmount, totalAmount };
    }, [watchItems, watchTax]);

    async function onSubmit(values: POFormValues) {
        if (!firestore || !schoolId || !user) return;
        setIsSubmitting(true);
        try {
            const poNumber = `PO-${format(new Date(), 'yyyyMM')}-${Math.floor(1000 + Math.random() * 9000)}`;
            const selectedVendor = vendors.find(v => v.id === values.vendorId);
            
            await addDoc(collection(firestore, 'purchase_orders'), {
                poNumber,
                vendorId: values.vendorId,
                vendorName: selectedVendor?.name || 'Unknown Supplier',
                items: values.items,
                subtotal: summary.subtotal,
                taxRate: values.taxRate,
                taxAmount: summary.taxAmount,
                totalAmount: summary.totalAmount,
                deliveryDate: values.deliveryDate,
                notes: values.notes || '',
                status: 'Draft',
                schoolId: schoolId,
                createdAt: serverTimestamp(),
                createdBy: user.uid,
                convertedToBill: false
            });

            toast({ title: 'Purchase Order Saved', description: `${poNumber} has been successfully logged.` });
            onPOCreated();
            form.reset();
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to create Purchase Order.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="vendorId" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-500 uppercase">Supplier Target</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-10 bg-slate-50 rounded-xl">
                                        <SelectValue placeholder="Select a Supplier..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {vendors.map(v => <SelectItem key={v.id} value={v.id}>{v.name} ({v.category})</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>

                    <FormField control={form.control} name="deliveryDate" render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-xs font-bold text-slate-500 uppercase mb-1">Target Delivery Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant="outline" className={cn('h-10 pl-3 text-left font-normal bg-slate-50 rounded-xl border-slate-200', !field.value && 'text-muted-foreground')}>
                                            {field.value ? format(field.value, 'PPP') : <span>Choose Date...</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-1.5">
                        <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Purchase Items Grid</Label>
                        <Button type="button" size="sm" variant="outline" className="h-8 rounded-lg border-emerald-200 text-emerald-700 font-bold hover:bg-emerald-50 text-xs" onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}>
                            <Plus className="h-3.5 w-3.5 mr-1"/> Add Item Line
                        </Button>
                    </div>

                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-end gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100 animate-in fade-in duration-200">
                                <FormField control={form.control} name={`items.${index}.description`} render={({ field }) => (
                                    <FormItem className="flex-grow">
                                        <FormLabel className="text-[10px] font-bold text-slate-400 uppercase">Item particulars / description</FormLabel>
                                        <FormControl><Input placeholder="e.g. Office desk double drawer" className="h-9 bg-white text-xs" {...field} /></FormControl>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name={`items.${index}.quantity`} render={({ field }) => (
                                    <FormItem className="w-20">
                                        <FormLabel className="text-[10px] font-bold text-slate-400 uppercase">Quantity</FormLabel>
                                        <FormControl><Input type="number" className="h-9 bg-white text-xs font-mono text-center font-bold" {...field} /></FormControl>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name={`items.${index}.unitPrice`} render={({ field }) => (
                                    <FormItem className="w-24">
                                        <FormLabel className="text-[10px] font-bold text-slate-400 uppercase">Unit Price</FormLabel>
                                        <FormControl><Input type="number" step="0.01" className="h-9 bg-white text-xs font-mono font-bold" {...field} /></FormControl>
                                    </FormItem>
                                )}/>
                                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg shrink-0" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-t pt-4">
                    <div className="md:col-span-7">
                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold text-slate-500 uppercase">Purchase Terms & Conditions / Special Notes</FormLabel>
                                <FormControl><Textarea placeholder="e.g. Payment due within 30 days of delivery. Ship to Main Office block." className="bg-slate-50 rounded-xl text-xs h-24" {...field} /></FormControl>
                            </FormItem>
                        )}/>
                    </div>

                    <div className="md:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Subtotal Amount:</span>
                            <span className="font-mono font-bold text-slate-800">GH₵{summary.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-3">
                            <span className="text-slate-500 font-medium">VAT / Tax Rate (%):</span>
                            <FormField control={form.control} name="taxRate" render={({ field }) => (
                                <FormControl><Input type="number" className="h-7 w-16 text-right font-mono p-1 text-xs" {...field} /></FormControl>
                            )}/>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Tax Calculated:</span>
                            <span className="font-mono text-rose-600 font-bold">GH₵{summary.taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center border-t pt-2 font-black text-slate-900">
                            <span className="text-xs uppercase">Grand Total Cost:</span>
                            <span className="font-mono text-sm text-emerald-700">GH₵{summary.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t pt-4">
                    <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl">
                        {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                        Generate Purchase Order Document
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}

// --- SUB-COMPONENT: PURCHASE ORDER VIEW DOCUMENT & PRINT ---
interface POViewProps {
    po: PurchaseOrder;
    vendors: Vendor[];
    schoolProfile: any;
    onStatusUpdate: () => void;
}
function PurchaseOrderView({ po, vendors, schoolProfile, onStatusUpdate }: POViewProps) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [updating, setUpdating] = useState(false);
    const [showBillConvert, setShowBillConvert] = useState(false);

    // Bill conversion local form states
    const [convExpenseAccount, setConvExpenseAccount] = useState('office-supplies');
    const [convDueDate, setConvDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [convInvoiceNumber, setConvInvoiceNumber] = useState(po.poNumber);

    const vendor = vendors.find(v => v.id === po.vendorId);

    const handleUpdateStatus = async (newStatus: string) => {
        if (!firestore) return;
        setUpdating(true);
        try {
            await updateDoc(doc(firestore, 'purchase_orders', po.id), {
                status: newStatus
            });
            toast({ title: 'Status Updated', description: `PO is now marked as ${newStatus}.` });
            onStatusUpdate();
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update status.' });
        } finally {
            setUpdating(false);
        }
    };

    const [isConverting, setIsConverting] = useState(false);
    const handleConvertToBill = async () => {
        if (!firestore) return;
        setIsConverting(true);
        try {
            const billRef = await addDoc(collection(firestore, 'accountsPayable'), {
                vendorId: po.vendorId,
                description: `PO Conversion ref: ${po.poNumber} - ${po.notes || 'Procured items delivery'}`,
                amount: po.totalAmount,
                dueDate: new Date(convDueDate),
                invoiceNumber: convInvoiceNumber || po.poNumber,
                expenseAccountId: convExpenseAccount,
                status: 'Unpaid',
                createdAt: serverTimestamp(),
                schoolId: po.schoolId,
            });

            await updateDoc(doc(firestore, 'purchase_orders', po.id), {
                convertedToBill: true,
                billId: billRef.id,
                status: 'Delivered'
            });

            toast({ title: 'Converted to Bill', description: 'Successfully posted PO to Accounts Payable ledger.' });
            onStatusUpdate();
            setShowBillConvert(false);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to convert PO.' });
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <DialogContent className="max-w-3xl print:max-w-full print:border-none print:shadow-none bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden p-0 flex flex-col h-[90vh]">
            <div className="overflow-y-auto flex-grow p-6 md:p-8" id="printable-po">
                <div className="absolute inset-0 opacity-[0.015] pointer-events-none flex items-center justify-center select-none z-0">
                    <Truck className="h-96 w-96 text-slate-900" />
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-start border-b-4 border-slate-800 pb-6">
                        <div className="flex items-center gap-4">
                            {schoolProfile?.logoUrl ? (
                                <img src={schoolProfile.logoUrl} className="h-16 w-16 object-contain" alt="Logo" />
                            ) : (
                                <div className="h-16 w-16 bg-slate-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold border border-slate-200">
                                    <Landmark className="h-8 w-8 text-indigo-600" />
                                </div>
                            )}
                            <div>
                                <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">{schoolProfile?.name || 'SCHOOL NAME'}</h1>
                                <p className="text-xs text-slate-500 font-semibold tracking-wide">{schoolProfile?.address || 'ADDRESS DETAILS'}</p>
                                {schoolProfile?.phone && <p className="text-[10px] text-slate-400 font-bold mt-0.5">Tel: {schoolProfile.phone}</p>}
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider border border-emerald-100">Purchase Order</span>
                            <h2 className="text-xl font-extrabold text-slate-800 mt-2 font-mono">{po.poNumber}</h2>
                            <div className="mt-1">
                                <Badge className={cn(
                                    "text-[9px] uppercase font-bold px-2 py-0.5",
                                    po.status === 'Draft' ? 'bg-slate-100 text-slate-800' :
                                    po.status === 'Approved' ? 'bg-indigo-50 text-indigo-700' :
                                    po.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                                    'bg-rose-50 text-rose-700'
                                )}>{po.status}</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 border-b pb-6 text-sm">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issued To Supplier:</p>
                            <div>
                                <p className="text-lg font-bold text-slate-900">{vendor?.name || po.vendorName}</p>
                                <p className="text-xs text-slate-500 font-medium">Category: {vendor?.category || 'Vendor'}</p>
                                {vendor?.phone && <p className="text-xs text-slate-500 mt-1 font-mono">Ph: {vendor.phone}</p>}
                                {vendor?.email && <p className="text-xs text-slate-500 font-mono">Email: {vendor.email}</p>}
                            </div>
                        </div>
                        <div className="text-right space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Schedule Dates:</p>
                            <div className="text-xs space-y-1 font-medium">
                                <p className="text-slate-600">PO Date: <span className="font-bold text-slate-800">{formatDateSafe(po.createdAt)}</span></p>
                                <p className="text-slate-600">Expected Delivery: <span className="font-bold text-slate-800">{formatDateSafe(po.deliveryDate)}</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Procured items list:</p>
                        <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden shadow-sm border-collapse">
                            <thead className="bg-slate-900 text-white font-bold text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="text-left p-3">Item particulars / description</th>
                                    <th className="text-center p-3 w-[100px]">Qty</th>
                                    <th className="text-right p-3 w-[140px]">Unit Cost</th>
                                    <th className="text-right p-3 w-[150px]">Line Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {po.items.map((it, idx) => (
                                    <tr key={idx} className="border-b bg-white text-slate-700">
                                        <td className="p-3 font-medium">{it.description}</td>
                                        <td className="p-3 text-center font-mono font-semibold">{it.quantity}</td>
                                        <td className="p-3 text-right font-mono">GH₵{(it.unitPrice || 0).toFixed(2)}</td>
                                        <td className="p-3 text-right font-mono font-bold text-slate-900">GH₵{((it.quantity || 0) * (it.unitPrice || 0)).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        <div className="md:col-span-7 space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supplier Terms / Deliver Instructions:</p>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 text-xs leading-relaxed italic">
                                {po.notes || 'No custom instructions provided for this purchase order.'}
                            </div>
                        </div>

                        <div className="md:col-span-5 bg-slate-905 text-white bg-slate-900 p-4.5 rounded-2xl shadow-md space-y-2 font-medium">
                            <div className="flex justify-between items-center text-xs text-slate-400">
                                <span>Subtotal:</span>
                                <span className="font-mono">GH₵{po.subtotal?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-400">
                                <span>Tax Rate:</span>
                                <span className="font-mono">({po.taxRate || 0}%)</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-400">
                                <span>Tax Calculated:</span>
                                <span className="font-mono">GH₵{po.taxAmount?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-805 pt-2 text-sm font-black uppercase text-emerald-450 border-slate-800 text-emerald-400">
                                <span>Total Committed:</span>
                                <span className="font-mono text-base">GH₵{po.totalAmount?.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mt-16 pt-8 border-t border-slate-200 text-center">
                        <div>
                            <div className="border-b border-slate-400 h-8 max-w-[220px] mx-auto"></div>
                            <p className="text-[9px] font-black uppercase text-slate-400 mt-2">Vetted & Prepared By (Auditor)</p>
                        </div>
                        <div>
                            <div className="border-b border-slate-400 h-8 max-w-[220px] mx-auto"></div>
                            <p className="text-[9px] font-black uppercase text-slate-400 mt-2">Authorized Official (Director)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Convert PO to Bill modal form */}
            {showBillConvert && (
                <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-in slide-in-from-bottom duration-300">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">Post Purchase Order to Accounts Payable</h4>
                        <Button variant="ghost" size="sm" onClick={() => setShowBillConvert(false)} className="rounded-lg text-slate-400 text-xs">Cancel</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                        <div className="space-y-1 text-xs">
                            <Label className="font-bold text-slate-500 uppercase">Expense Mapping Category</Label>
                            <Select value={convExpenseAccount} onValueChange={setConvExpenseAccount}>
                                <SelectTrigger className="h-9 bg-white rounded-lg text-xs"><SelectValue placeholder="Select account..."/></SelectTrigger>
                                <SelectContent className="text-xs">
                                    <SelectItem value="office-supplies">Office Supplies</SelectItem>
                                    <SelectItem value="maintenance">Maintenance & Repairs</SelectItem>
                                    <SelectItem value="utilities">Utilities & Bills</SelectItem>
                                    <SelectItem value="other">Other Operating Expenses</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1 text-xs">
                            <Label className="font-bold text-slate-500 uppercase">Bill Due Date</Label>
                            <Input 
                                type="date" 
                                value={convDueDate} 
                                onChange={e => setConvDueDate(e.target.value)} 
                                className="h-9 bg-white text-xs font-mono rounded-lg" 
                            />
                        </div>
                        <Button 
                            disabled={isConverting}
                            onClick={handleConvertToBill} 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 text-xs rounded-lg shadow-sm border-0"
                        >
                            {isConverting ? <Loader2 className="animate-spin mr-1.5 h-3 w-3" /> : <Plus className="h-3.5 w-3.5 mr-1.5" />}
                            Confirm Ledger Post
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-t border-slate-100 print:hidden shrink-0">
                <div className="flex gap-2">
                    {po.status === 'Draft' && (
                        <Button onClick={() => handleUpdateStatus('Approved')} disabled={updating} className="bg-indigo-600 hover:bg-indigo-700 font-bold text-xs h-9.5 rounded-xl border-0">
                            {updating ? <Loader2 className="animate-spin mr-1 h-3.5 w-3.5"/> : <CheckCircle2 className="mr-1.5 h-4 w-4"/>}
                            Approve Order
                        </Button>
                    )}
                    {po.status === 'Approved' && (
                        <>
                            <Button onClick={() => handleUpdateStatus('Delivered')} disabled={updating} className="bg-emerald-650 hover:bg-emerald-755 font-bold text-xs h-9.5 rounded-xl border-0">
                                {updating ? <Loader2 className="animate-spin mr-1 h-3.5 w-3.5"/> : <Truck className="mr-1.5 h-4 w-4"/>}
                                Mark Delivered
                            </Button>
                            {!po.convertedToBill && (
                                <Button onClick={() => setShowBillConvert(true)} className="bg-amber-600 hover:bg-amber-700 font-bold text-xs h-9.5 rounded-xl border-0 text-white shadow-sm">
                                    <Receipt className="mr-1.5 h-4 w-4"/> Convert to Bill
                                </Button>
                            )}
                        </>
                    )}
                    {po.status === 'Delivered' && !po.convertedToBill && (
                        <Button onClick={() => setShowBillConvert(true)} className="bg-amber-600 hover:bg-amber-700 font-bold text-xs h-9.5 rounded-xl border-0 text-white shadow-sm">
                            <Receipt className="mr-1.5 h-4 w-4"/> Convert to Bill
                        </Button>
                    )}
                    {po.status !== 'Cancelled' && po.status !== 'Delivered' && (
                        <Button onClick={() => handleUpdateStatus('Cancelled')} disabled={updating} variant="ghost" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold text-xs h-9.5 rounded-xl border border-slate-200">
                            Cancel Order
                        </Button>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button onClick={() => window.print()} className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-9.5 rounded-xl border-0 shadow-sm">
                        <Printer className="mr-1.5 h-4 w-4"/> Print Order Sheet
                    </Button>
                </div>
            </div>
             <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden !important;
                    }
                    #printable-po, #printable-po * {
                        visibility: visible !important;
                    }
                    #printable-po {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        padding: 0 !important;
                        border: none !important;
                    }
                }
             `}</style>
        </DialogContent>
    );
}

// --- MAIN PAGE ---
export default function AccountsPayablePage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    
    const [activeTab, setActiveTab] = useState<'purchase-orders' | 'accounts-payable' | 'suppliers'>('purchase-orders');
    const [supplierSearch, setSupplierSearch] = useState('');
    const [poSearch, setPoSearch] = useState('');
    
    const [isBillFormOpen, setBillFormOpen] = useState(false);
    const [isSupplierFormOpen, setSupplierFormOpen] = useState(false);
    const [isPOFormOpen, setPOFormOpen] = useState(false);
    const [payingBill, setPayingBill] = useState<AccountsPayableRecord | null>(null);
    const [viewingPO, setViewingPO] = useState<PurchaseOrder | null>(null);

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role || '');

    const schoolRef = useMemoFirebase(() => (firestore && schoolId ? doc(firestore, 'schools', schoolId) : null), [firestore, schoolId]);
    const { data: schoolProfile } = useDoc(schoolRef);

    const payablesQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'accountsPayable'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, 
    [firestore, schoolId]);
    const { data: payables, isLoading: isLoadingPayables, forceRefetch: refetchPayables } = useCollection<AccountsPayableRecord>(payablesQuery);
    
    const vendorsQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'vendors'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, 
    [firestore, schoolId]);
    const { data: vendors, forceRefetch: refetchVendors } = useCollection<Vendor>(vendorsQuery);

    const poQuery = useMemoFirebase(() =>
        (firestore && schoolId) ? query(collection(firestore, 'purchase_orders'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null,
    [firestore, schoolId]);
    const { data: purchaseOrders, isLoading: isLoadingPOs, forceRefetch: refetchPOs } = useCollection<any>(poQuery);
    
    const unpaidBills = useMemo(() => payables?.filter(p => p.status === 'Unpaid') || [], [payables]);
    const paidBills = useMemo(() => payables?.filter(p => p.status === 'Paid') || [], [payables]);

    const getVendorName = (vendorId: string) => vendors?.find(v => v.id === vendorId)?.name || 'Unknown Vendor';

    const filteredSuppliers = useMemo(() => {
        if (!vendors) return [];
        if (!supplierSearch.trim()) return vendors;
        const queryStr = supplierSearch.toLowerCase();
        return vendors.filter(v => 
            v.name.toLowerCase().includes(queryStr) || 
            v.category.toLowerCase().includes(queryStr) ||
            (v.email || '').toLowerCase().includes(queryStr) ||
            (v.phone || '').includes(queryStr)
        );
    }, [vendors, supplierSearch]);

    const filteredPOs = useMemo(() => {
        if (!purchaseOrders) return [];
        if (!poSearch.trim()) return purchaseOrders;
        const queryStr = poSearch.toLowerCase();
        return purchaseOrders.filter((po: any) => 
            po.poNumber.toLowerCase().includes(queryStr) ||
            po.vendorName.toLowerCase().includes(queryStr) ||
            po.status.toLowerCase().includes(queryStr)
        );
    }, [purchaseOrders, poSearch]);

    const totals = useMemo(() => {
        const unpaidSum = unpaidBills.reduce((s, b) => s + (b.amount || 0), 0);
        const paidSum = paidBills.reduce((s, b) => s + (b.amount || 0), 0);
        const activePOs = purchaseOrders?.filter((po: any) => po.status === 'Draft' || po.status === 'Approved') || [];
        const committedPOAmount = activePOs.reduce((s: number, po: any) => s + (po.totalAmount || 0), 0);
        
        return {
            unpaidSum,
            paidSum,
            activePOCount: activePOs.length,
            committedPOAmount,
            suppliersCount: vendors?.length || 0
        };
    }, [unpaidBills, paidBills, purchaseOrders, vendors]);

    const isLoading = schoolLoading || isLoadingPayables || isLoadingPOs;

    if (!canAccess) {
        return <Card className="m-6"><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This module is restricted to financial staff.</CardDescription></CardHeader></Card>;
    }

    return (
        <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen">
            {/* Executive Glowing Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 md:p-8 text-white shadow-xl border border-emerald-500/20">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/25 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-teal-500/25 blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[11px] font-bold tracking-wide backdrop-blur-md border border-white/10">
                            <Sparkles className="h-3.5 w-3.5 text-teal-300 animate-pulse" />
                            <span>Procurement, Invoicing & Suppliers Suite</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                            Procurement Portal
                        </h1>
                        <p className="text-sm text-teal-100 font-medium max-w-xl">
                            Register corporate suppliers, prepare itemized purchase orders, approve delivery fulfillments, map ledger expenses, and verify accounts payable histories.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 bg-black/15 backdrop-blur-lg rounded-2xl p-4 border border-white/5 text-left text-xs">
                        <div>
                            <p className="text-[10px] uppercase text-teal-300 font-bold tracking-wider">Active POs</p>
                            <p className="text-xl font-black font-mono text-white mt-0.5">{totals.activePOCount}</p>
                        </div>
                        <div className="border-l border-white/15 pl-4">
                            <p className="text-[10px] uppercase text-teal-300 font-bold tracking-wider">Pending Bills</p>
                            <p className="text-xl font-black font-mono text-white mt-0.5">{unpaidBills.length}</p>
                        </div>
                        <div className="border-l border-white/15 pl-4">
                            <p className="text-[10px] uppercase text-teal-300 font-bold tracking-wider">Suppliers</p>
                            <p className="text-xl font-black font-mono text-white mt-0.5">{totals.suppliersCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick KPI Financial Stats Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
                <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white hover:shadow-md transition-all">
                    <CardContent className="p-4.5 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Accounts Payable (Unpaid)</p>
                            <p className="text-2xl font-black font-mono text-rose-600">GH₵{totals.unpaidSum.toFixed(2)}</p>
                        </div>
                        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl"><Receipt className="h-5 w-5" /></div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white hover:shadow-md transition-all">
                    <CardContent className="p-4.5 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Committed PO Obligations</p>
                            <p className="text-2xl font-black font-mono text-indigo-755 text-indigo-700">GH₵{totals.committedPOAmount.toFixed(2)}</p>
                        </div>
                        <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl"><Truck className="h-5 w-5" /></div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white hover:shadow-md transition-all">
                    <CardContent className="p-4.5 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Settled Payments (Paid)</p>
                            <p className="text-2xl font-black font-mono text-emerald-600">GH₵{totals.paidSum.toFixed(2)}</p>
                        </div>
                        <div className="p-2.5 bg-emerald-50 text-emerald-650 rounded-xl"><CheckCircle2 className="h-5 w-5" /></div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="purchase-orders" onValueChange={val => setActiveTab(val as any)} className="w-full space-y-6">
                <TabsList className="bg-slate-100 p-1.5 rounded-2xl inline-flex w-auto border border-slate-200/50 print:hidden">
                    <TabsTrigger value="purchase-orders" className="rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Truck className="h-4 w-4 mr-2 text-emerald-650" /> Purchase Orders
                    </TabsTrigger>
                    <TabsTrigger value="accounts-payable" className="rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Receipt className="h-4 w-4 mr-2 text-emerald-650" /> Accounts Payable (Bills)
                    </TabsTrigger>
                    <TabsTrigger value="suppliers" className="rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Landmark className="h-4 w-4 mr-2 text-emerald-650" /> Suppliers Directory
                    </TabsTrigger>
                </TabsList>

                {/* --- 1. PURCHASE ORDERS TAB CONTENT --- */}
                <TabsContent value="purchase-orders" className="mt-0 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4.5 shadow-sm print:hidden">
                        <div className="relative flex-grow max-w-md w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                placeholder="Search purchase orders..." 
                                value={poSearch}
                                onChange={e => setPoSearch(e.target.value)}
                                className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-emerald-500" 
                            />
                        </div>
                        <Dialog open={isPOFormOpen} onOpenChange={setPOFormOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold text-sm h-10 px-5 rounded-xl shrink-0 text-white shadow-md border-0">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Create Purchase Order
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl rounded-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-lg font-bold text-slate-800">Generate Purchase Order</DialogTitle>
                                    <DialogDescription>Input purchase order items, supplier target details, and tax variables.</DialogDescription>
                                </DialogHeader>
                                {schoolId && <PurchaseOrderForm setOpen={setPOFormOpen} onPOCreated={refetchPOs} schoolId={schoolId} vendors={vendors || []} />}
                            </DialogContent>
                        </Dialog>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-600 h-8 w-8" /></div>
                    ) : (
                        <Card className="border border-slate-100 shadow-md rounded-2xl overflow-hidden bg-white">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-50 text-slate-655">
                                        <TableRow>
                                            <TableHead className="pl-6 font-bold">PO Number</TableHead>
                                            <TableHead className="font-bold">Supplier</TableHead>
                                            <TableHead className="font-bold text-center">Items Count</TableHead>
                                            <TableHead className="font-bold">Delivery Date</TableHead>
                                            <TableHead className="font-bold">Status</TableHead>
                                            <TableHead className="text-right font-bold">Total Cost</TableHead>
                                            <TableHead className="text-right pr-6 font-bold">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPOs.length > 0 ? filteredPOs.map((po: any) => (
                                            <TableRow key={po.id} className="hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="pl-6 font-mono font-bold text-slate-800 text-sm">{po.poNumber}</TableCell>
                                                <TableCell className="font-semibold text-slate-700">{po.vendorName}</TableCell>
                                                <TableCell className="text-center font-mono text-slate-650">{(po.items || []).length} items</TableCell>
                                                <TableCell className="text-xs text-slate-500 font-medium">{formatDateSafe(po.deliveryDate)}</TableCell>
                                                <TableCell>
                                                    <Badge className={cn(
                                                        "text-[9px] uppercase font-bold px-2 py-0.5",
                                                        po.status === 'Draft' ? 'bg-slate-100 text-slate-800' :
                                                        po.status === 'Approved' ? 'bg-indigo-50 text-indigo-700' :
                                                        po.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                                                        'bg-rose-50 text-rose-700'
                                                    )}>{po.status}</Badge>
                                                    {po.convertedToBill && (
                                                        <span className="block text-[8px] text-amber-600 font-bold uppercase mt-1">Converts: Billed</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-mono font-black text-slate-700">GH₵{po.totalAmount?.toFixed(2)}</TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" onClick={() => setViewingPO(po)} className="rounded-xl hover:bg-slate-100 hover:text-emerald-705 font-semibold text-xs h-9">
                                                                <Eye className="h-4 w-4 mr-1.5"/> View PO
                                                            </Button>
                                                        </DialogTrigger>
                                                        {viewingPO && viewingPO.id === po.id && (
                                                            <PurchaseOrderView 
                                                                po={viewingPO} 
                                                                vendors={vendors || []} 
                                                                schoolProfile={schoolProfile} 
                                                                onStatusUpdate={() => {
                                                                    refetchPOs();
                                                                    refetchPayables();
                                                                }} 
                                                            />
                                                        )}
                                                    </Dialog>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                                                    <Truck className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                                    <p className="text-xs font-bold uppercase tracking-wider">No Purchase Orders Found</p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* --- 2. ACCOUNTS PAYABLE (BILLS) TAB CONTENT --- */}
                <TabsContent value="accounts-payable" className="mt-0 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4.5 shadow-sm print:hidden">
                        <div>
                            <h3 className="text-base font-bold text-slate-800">Accounts Payable Ledger</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Pay supplier invoices or generate historical audit reports.</p>
                        </div>
                        <Dialog open={isBillFormOpen} onOpenChange={setBillFormOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold text-sm h-10 px-5 rounded-xl text-white shadow-md border-0">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Record Manual Bill
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-lg font-bold text-slate-800">Record a New Bill</DialogTitle>
                                    <DialogDescription>Enter the details from the vendor's invoice.</DialogDescription>
                                </DialogHeader>
                                {schoolId && <PayableForm setOpen={setBillFormOpen} onBillAdded={refetchPayables} schoolId={schoolId} vendors={vendors || []} />}
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card className="border border-slate-100 shadow-md rounded-2xl overflow-hidden bg-white">
                        <CardContent className="p-5">
                            <Tabs defaultValue="unpaid">
                                <TabsList className="bg-slate-100 p-1 rounded-xl mb-4 print:hidden">
                                    <TabsTrigger value="unpaid" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Unpaid Bills ({unpaidBills.length})</TabsTrigger>
                                    <TabsTrigger value="paid" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Paid Bills ({paidBills.length})</TabsTrigger>
                                </TabsList>
                                <TabsContent value="unpaid" className="mt-0">
                                    {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div> : (
                                        <div className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                                            <Table>
                                                <TableHeader className="bg-slate-50 text-slate-600">
                                                    <TableRow>
                                                        <TableHead className="pl-6 font-bold">Supplier / Vendor</TableHead>
                                                        <TableHead className="font-bold">Description</TableHead>
                                                        <TableHead className="font-bold text-right">Invoice #</TableHead>
                                                        <TableHead className="font-bold">Due Date</TableHead>
                                                        <TableHead className="text-right font-bold">Amount Due</TableHead>
                                                        <TableHead className="text-right pr-6 font-bold">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {unpaidBills.length > 0 ? unpaidBills.map(bill => (
                                                        <TableRow key={bill.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <TableCell className="pl-6 font-bold text-slate-800">{getVendorName(bill.vendorId)}</TableCell>
                                                            <TableCell className="max-w-xs truncate text-slate-500 font-medium text-xs">{bill.description}</TableCell>
                                                            <TableCell className="text-right font-mono text-xs text-slate-500 font-semibold">{bill.invoiceNumber || 'N/A'}</TableCell>
                                                            <TableCell className="text-xs text-slate-555 font-medium">{formatDateSafe(bill.dueDate)}</TableCell>
                                                            <TableCell className="text-right font-mono font-black text-rose-600">GH₵{bill.amount.toFixed(2)}</TableCell>
                                                            <TableCell className="text-right pr-6">
                                                                <Button size="sm" onClick={() => setPayingBill(bill)} className="h-8 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold shadow-sm">
                                                                    Process Payment
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    )) : (
                                                        <TableRow>
                                                            <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                                                                <HelpCircle className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                                                <p className="text-xs font-bold uppercase tracking-wider">No unpaid bills found</p>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </TabsContent>
                                <TabsContent value="paid" className="mt-0">
                                    {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div> : (
                                        <div className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                                            <Table>
                                                <TableHeader className="bg-slate-50">
                                                    <TableRow>
                                                        <TableHead className="pl-6 font-bold">Supplier / Vendor</TableHead>
                                                        <TableHead className="font-bold">Description</TableHead>
                                                        <TableHead className="font-bold text-right">Invoice #</TableHead>
                                                        <TableHead className="font-bold">Paid Date</TableHead>
                                                        <TableHead className="text-right pr-6 font-bold">Settled Amount</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {paidBills.length > 0 ? paidBills.map(bill => (
                                                        <TableRow key={bill.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <TableCell className="pl-6 font-bold text-slate-800">{getVendorName(bill.vendorId)}</TableCell>
                                                            <TableCell className="max-w-xs truncate text-slate-500 font-medium text-xs">{bill.description}</TableCell>
                                                            <TableCell className="text-right font-mono text-xs text-slate-500 font-semibold">{bill.invoiceNumber || 'N/A'}</TableCell>
                                                            <TableCell className="text-xs text-slate-500 font-medium">{formatDateSafe(bill.paidAt)}</TableCell>
                                                            <TableCell className="text-right pr-6 font-mono font-black text-emerald-700">GH₵{bill.amount.toFixed(2)}</TableCell>
                                                        </TableRow>
                                                    )) : (
                                                        <TableRow>
                                                            <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                                                                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                                                <p className="text-xs font-bold uppercase tracking-wider">No paid bills history found</p>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    <Dialog open={!!payingBill} onOpenChange={(open) => !open && setPayingBill(null)}>
                        {payingBill && <PayBillDialog bill={payingBill} setOpen={() => setPayingBill(null)} onBillPaid={refetchPayables} />}
                    </Dialog>
                </TabsContent>

                {/* --- 3. SUPPLIERS TAB CONTENT --- */}
                <TabsContent value="suppliers" className="mt-0 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4.5 shadow-sm print:hidden">
                        <div className="relative flex-grow max-w-md w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                placeholder="Search suppliers by name, email, or category..." 
                                value={supplierSearch}
                                onChange={e => setSupplierSearch(e.target.value)}
                                className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-emerald-500" 
                            />
                        </div>
                        <Dialog open={isSupplierFormOpen} onOpenChange={setSupplierFormOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold text-sm h-10 px-5 rounded-xl text-white shadow-md border-0">
                                    <Plus className="mr-1.5 h-4 w-4" /> Add New Supplier
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-lg font-bold text-slate-800">Add Supplier Profile</DialogTitle>
                                    <DialogDescription>Create a profile for a vendor or supplier to begin purchase orders.</DialogDescription>
                                </DialogHeader>
                                {schoolId && <SupplierForm setOpen={setSupplierFormOpen} onSupplierAdded={refetchVendors} schoolId={schoolId} />}
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card className="border border-slate-100 shadow-md rounded-2xl overflow-hidden bg-white">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="pl-6 font-bold">Supplier Name</TableHead>
                                        <TableHead className="font-bold">Category</TableHead>
                                        <TableHead className="font-bold">Phone Number</TableHead>
                                        <TableHead className="font-bold pr-6">Email Address</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSuppliers.length > 0 ? filteredSuppliers.map((vendor) => (
                                        <TableRow key={vendor.id} className="hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="pl-6 py-4 font-bold text-slate-800 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs border border-emerald-100">
                                                        {(vendor.name || '')[0]}
                                                    </div>
                                                    <span>{vendor.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge variant="secondary" className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                                                    {vendor.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4 font-mono text-xs text-slate-500 font-semibold">{vendor.phone || '-'}</TableCell>
                                            <TableCell className="py-4 pr-6 text-xs font-mono text-slate-500">{vendor.email || '-'}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-12 text-slate-400">
                                                <Landmark className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                                <p className="text-xs font-bold uppercase tracking-wider">No suppliers found</p>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}