'use client';

import { useState, useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { logAuditEvent } from '@/lib/audit';
import { collection, query, orderBy, where, doc, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { 
  Loader2, Plus, Landmark, Save, History, TrendingUp, PlusCircle, Calendar, Banknote, Eye, Trash2, ShieldCheck, Scale, FileText, Settings, Coins, Calculator
} from 'lucide-react';
import { format } from 'date-fns';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// --- ZOD SCHEMAS ---
const fixedAssetSchema = z.object({
  assetCode: z.string().min(1, "Asset code is required."),
  name: z.string().min(1, "Asset name is required."),
  category: z.enum(['Land & Buildings', 'Motor Vehicles', 'Furniture & Fittings', 'IT & Equipment']),
  description: z.string().optional(),
  purchaseDate: z.string().min(1, "Purchase date is required."),
  purchaseCost: z.coerce.number().min(0.01, "Cost must be positive."),
  salvageValue: z.coerce.number().min(0, "Salvage value cannot be negative."),
  usefulLifeYears: z.coerce.number().min(1, "Useful life must be at least 1 year."),
  depreciationMethod: z.enum(['Straight Line', 'Declining Balance']),
  depreciationRate: z.coerce.number().min(0).max(100).optional(),
}).refine(data => data.purchaseCost >= data.salvageValue, {
  message: "Salvage value cannot exceed purchase cost.",
  path: ["salvageValue"]
}).refine(data => data.depreciationMethod !== 'Declining Balance' || (data.depreciationRate && data.depreciationRate > 0), {
  message: "Depreciation rate is required for Declining Balance.",
  path: ["depreciationRate"]
});

type FixedAssetFormValues = z.infer<typeof fixedAssetSchema>;

const runDepreciationSchema = z.object({
  period: z.string().min(1, "Depreciation period name is required (e.g. FY 2026, Q2-2026)."),
  debitAccountId: z.string().min(1, "Depreciation expense account is required."),
  creditAccountId: z.string().min(1, "Accumulated depreciation account is required."),
});

const disposalSchema = z.object({
  disposalDate: z.string().min(1, "Disposal date is required."),
  proceeds: z.coerce.number().min(0, "Proceeds cannot be negative."),
  debitAccountId: z.string().min(1, "Select bank or cash account for proceeds."),
  gainLossAccountId: z.string().min(1, "Select gain/loss account."),
});

// --- HELPER FUNCTION: PRE-CALCULATE DEPRECIATION SCHEDULE ---
function calculateDepreciationSchedule(
  cost: number,
  salvage: number,
  usefulLife: number,
  method: 'Straight Line' | 'Declining Balance',
  rate: number = 0
) {
  const schedule = [];
  let currentBookValue = cost;
  let accumulatedDep = 0;

  if (method === 'Straight Line') {
    const annualDep = (cost - salvage) / usefulLife;
    for (let year = 1; year <= usefulLife; year++) {
      let depExpense = annualDep;
      // Cap at salvage value
      if (currentBookValue - depExpense < salvage) {
        depExpense = currentBookValue - salvage;
      }
      if (depExpense < 0) depExpense = 0;

      const begBook = currentBookValue;
      currentBookValue -= depExpense;
      accumulatedDep += depExpense;

      schedule.push({
        year,
        beginningBookValue: begBook,
        depreciationExpense: depExpense,
        accumulatedDepreciation: accumulatedDep,
        endingBookValue: currentBookValue,
      });
    }
  } else {
    // Declining Balance
    const decRate = rate / 100;
    for (let year = 1; year <= usefulLife * 2; year++) { // Extend in case useful life is longer
      let depExpense = currentBookValue * decRate;
      if (currentBookValue - depExpense < salvage) {
        depExpense = currentBookValue - salvage;
      }
      if (depExpense < 0) depExpense = 0;

      const begBook = currentBookValue;
      currentBookValue -= depExpense;
      accumulatedDep += depExpense;

      schedule.push({
        year,
        beginningBookValue: begBook,
        depreciationExpense: depExpense,
        accumulatedDepreciation: accumulatedDep,
        endingBookValue: currentBookValue,
      });

      if (currentBookValue <= salvage) break;
    }
  }

  return schedule;
}

// --- SUB-COMPONENT: ADD ASSET FORM ---
function AddAssetForm({ setOpen, schoolId, onSuccess }: { setOpen: (o: boolean) => void; schoolId: string; onSuccess: () => void }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { profile } = useRole();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FixedAssetFormValues>({
    resolver: zodResolver(fixedAssetSchema),
    defaultValues: {
      depreciationMethod: 'Straight Line',
      salvageValue: 0,
      usefulLifeYears: 5,
      purchaseCost: 0,
    }
  });

  const method = form.watch('depreciationMethod');

  async function onSubmit(values: FixedAssetFormValues) {
    if (!firestore || !schoolId) return;
    setIsSubmitting(true);

    try {
      const newAssetRef = doc(collection(firestore, 'fixed_assets'));
      await setDoc(newAssetRef, {
        schoolId,
        assetCode: values.assetCode,
        name: values.name,
        category: values.category,
        description: values.description || '',
        purchaseDate: new Date(values.purchaseDate),
        purchaseCost: values.purchaseCost,
        salvageValue: values.salvageValue,
        usefulLifeYears: values.usefulLifeYears,
        depreciationMethod: values.depreciationMethod,
        depreciationRate: values.depreciationMethod === 'Declining Balance' ? values.depreciationRate : null,
        accumulatedDepreciation: 0,
        currentBookValue: values.purchaseCost,
        status: 'Active',
        createdAt: serverTimestamp(),
      });

      await logAuditEvent({
        firestore,
        schoolId,
        userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
        action: 'CREATE_FIXED_ASSET',
        details: `Registered fixed asset ${values.name} (${values.assetCode}) with cost of GH₵${values.purchaseCost.toFixed(2)}`
      });

      toast({ title: "Asset Added", description: `${values.name} has been recorded in the fixed asset register.` });
      onSuccess();
      form.reset();
      setOpen(false);
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Error", description: e.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="assetCode" render={({ field }) => (
            <FormItem><FormLabel>Asset Code</FormLabel><FormControl><Input placeholder="e.g. FA-VEH-001" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Asset Name</FormLabel><FormControl><Input placeholder="e.g. Toyota School Bus" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Land & Buildings">Land & Buildings</SelectItem>
                  <SelectItem value="Motor Vehicles">Motor Vehicles</SelectItem>
                  <SelectItem value="Furniture & Fittings">Furniture & Fittings</SelectItem>
                  <SelectItem value="IT & Equipment">IT & Equipment</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="purchaseDate" render={({ field }) => (
            <FormItem><FormLabel>Purchase Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <FormField control={form.control} name="purchaseCost" render={({ field }) => (
            <FormItem><FormLabel>Cost (GH₵)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="salvageValue" render={({ field }) => (
            <FormItem><FormLabel>Salvage (GH₵)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="usefulLifeYears" render={({ field }) => (
            <FormItem><FormLabel>Useful Life (Yrs)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="depreciationMethod" render={({ field }) => (
            <FormItem>
              <FormLabel>Depreciation Method</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Straight Line">Straight Line</SelectItem>
                  <SelectItem value="Declining Balance">Declining Balance</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          {method === 'Declining Balance' && (
            <FormField control={form.control} name="depreciationRate" render={({ field }) => (
              <FormItem><FormLabel>Depreciation Rate (%)</FormLabel><FormControl><Input type="number" step="0.1" placeholder="e.g. 20" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          )}
        </div>

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>Description / Specifications</FormLabel><FormControl><Textarea placeholder="Enter asset condition or tracking numbers" {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Register Fixed Asset
        </Button>
      </form>
    </Form>
  );
}

// --- MAIN PORTAL COMPONENT ---
export default function FixedAssetPage() {
  const { role, profile } = useRole();
  const firestore = useFirestore();
  const { user } = useUser();
  const { schoolId, loading: schoolLoading } = useCurrentSchool();
  const { toast } = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [isDepreciationOpen, setIsDepreciationOpen] = useState(false);
  const [isDisposalOpen, setIsDisposalOpen] = useState(false);
  const [disposalAsset, setDisposalAsset] = useState<any>(null);

  const [isSubmittingDep, setIsSubmittingDep] = useState(false);
  const [isSubmittingDisp, setIsSubmittingDisp] = useState(false);

  // Firestore Queries
  const assetsQuery = useMemoFirebase(() => 
    (firestore && schoolId) ? query(collection(firestore, 'fixed_assets'), where('schoolId', '==', schoolId)) : null, 
    [firestore, schoolId]
  );
  const { data: assets, isLoading: assetsLoading, forceRefetch: refetchAssets } = useCollection<any>(assetsQuery);

  const accountsQuery = useMemoFirebase(() => 
    (firestore && schoolId) ? query(collection(firestore, 'accounts'), where('schoolId', '==', schoolId)) : null, 
    [firestore, schoolId]
  );
  const { data: accounts } = useCollection<any>(accountsQuery);

  const logsQuery = useMemoFirebase(() => 
    (firestore && schoolId) ? query(collection(firestore, 'depreciation_logs'), where('schoolId', '==', schoolId), orderBy('runDate', 'desc')) : null, 
    [firestore, schoolId]
  );
  const { data: logs, forceRefetch: refetchLogs } = useCollection<any>(logsQuery);

  const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role || '');

  // Forms
  const depForm = useForm<z.infer<typeof runDepreciationSchema>>({
    resolver: zodResolver(runDepreciationSchema),
    defaultValues: {
      period: `FY ${new Date().getFullYear()}`,
    }
  });

  const dispForm = useForm<z.infer<typeof disposalSchema>>({
    resolver: zodResolver(disposalSchema),
    defaultValues: {
      proceeds: 0,
      disposalDate: format(new Date(), 'yyyy-MM-dd'),
    }
  });

  // Derived Summary Totals
  const summary = useMemo(() => {
    if (!assets) return { totalCost: 0, totalAccDep: 0, netBookValue: 0 };
    return assets.reduce((acc, curr) => {
      if (curr.status === 'Active') {
        acc.totalCost += curr.purchaseCost || 0;
        acc.totalAccDep += curr.accumulatedDepreciation || 0;
        acc.netBookValue += curr.currentBookValue || 0;
      }
      return acc;
    }, { totalCost: 0, totalAccDep: 0, netBookValue: 0 });
  }, [assets]);

  // Active Assets computed for depreciation previews
  const activeAssets = useMemo(() => {
    if (!assets) return [];
    return assets.filter(a => a.status === 'Active' && a.currentBookValue > a.salvageValue);
  }, [assets]);

  const previewDepreciation = useMemo(() => {
    return activeAssets.map(asset => {
      let amount = 0;
      if (asset.depreciationMethod === 'Straight Line') {
        amount = (asset.purchaseCost - asset.salvageValue) / asset.usefulLifeYears;
      } else {
        const rate = (asset.depreciationRate || 0) / 100;
        amount = asset.currentBookValue * rate;
      }
      // Cap at salvage value
      if (asset.currentBookValue - amount < asset.salvageValue) {
        amount = asset.currentBookValue - asset.salvageValue;
      }
      return {
        id: asset.id,
        name: asset.name,
        code: asset.assetCode,
        currentBook: asset.currentBookValue,
        depAmount: amount,
        endingBook: asset.currentBookValue - amount,
      };
    });
  }, [activeAssets]);

  const totalPreviewDepreciation = useMemo(() => {
    return previewDepreciation.reduce((sum, item) => sum + item.depAmount, 0);
  }, [previewDepreciation]);

  if (!canAccess) return <div className="p-8 text-center text-red-500">Access Denied</div>;

  const isLoading = schoolLoading || assetsLoading;

  // --- RUN DEPRECIATION ACTIONS ---
  async function handleRunDepreciation(values: z.infer<typeof runDepreciationSchema>) {
    if (!firestore || !user || !schoolId || activeAssets.length === 0) return;
    setIsSubmittingDep(true);

    try {
      const batch = writeBatch(firestore);
      const timestamp = serverTimestamp();
      const journalRef = doc(collection(firestore, 'journal_entries'));
      const journalEntryId = journalRef.id;

      // Track logs and updates
      previewDepreciation.forEach(p => {
        const assetRef = doc(firestore, 'fixed_assets', p.id);
        const logRef = doc(collection(firestore, 'depreciation_logs'));

        // Update asset balances
        const matchedAsset = activeAssets.find(a => a.id === p.id);
        const newAccDep = (matchedAsset.accumulatedDepreciation || 0) + p.depAmount;
        const newBookVal = matchedAsset.purchaseCost - newAccDep;

        batch.update(assetRef, {
          accumulatedDepreciation: newAccDep,
          currentBookValue: newBookVal,
        });

        // Write audit log
        batch.set(logRef, {
          schoolId,
          assetId: p.id,
          assetCode: p.code,
          assetName: p.name,
          runDate: timestamp,
          period: values.period,
          depreciationAmount: p.depAmount,
          accumulatedDepreciationAfter: newAccDep,
          bookValueAfter: newBookVal,
          journalEntryId,
          createdAt: timestamp,
        });
      });

      // Write matching general ledger journal entry
      const debitAcc = accounts?.find(a => a.id === values.debitAccountId);
      const creditAcc = accounts?.find(a => a.id === values.creditAccountId);

      batch.set(journalRef, {
        date: timestamp,
        description: `Depreciation Run for ${values.period} (${previewDepreciation.length} assets)`,
        reference: 'DEPRECIATION',
        totalAmount: totalPreviewDepreciation,
        createdBy: user.uid,
        createdAt: timestamp,
        schoolId,
        lines: [
          { accountId: values.debitAccountId, accountName: debitAcc?.name || 'Depreciation Expense', debit: totalPreviewDepreciation, credit: 0 },
          { accountId: values.creditAccountId, accountName: creditAcc?.name || 'Accumulated Depreciation', debit: 0, credit: totalPreviewDepreciation }
        ]
      });

      await batch.commit();

      await logAuditEvent({
        firestore,
        schoolId,
        userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user.displayName || user.email || 'Anonymous'),
        action: 'RUN_DEPRECIATION',
        details: `Processed depreciation run for period ${values.period} on ${previewDepreciation.length} assets totaling GH₵${totalPreviewDepreciation.toFixed(2)}`
      });

      toast({ title: "Depreciation Completed", description: `Processed depreciation batch for ${previewDepreciation.length} assets.` });
      refetchAssets();
      refetchLogs();
      setIsDepreciationOpen(false);
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Execution Failed", description: e.message });
    } finally {
      setIsSubmittingDep(false);
    }
  }

  // --- DISPOSE FIXED ASSET ACTION ---
  async function handleDisposeAsset(values: z.infer<typeof disposalSchema>) {
    if (!firestore || !user || !schoolId || !disposalAsset) return;
    setIsSubmittingDisp(true);

    try {
      const batch = writeBatch(firestore);
      const timestamp = serverTimestamp();
      const assetRef = doc(firestore, 'fixed_assets', disposalAsset.id);
      
      const proceeds = values.proceeds;
      const netBookValue = disposalAsset.currentBookValue;
      const gainLoss = proceeds - netBookValue;
      
      // Update asset record
      batch.update(assetRef, {
        status: 'Disposed',
        currentBookValue: 0,
      });

      // Set up double entry journal log
      const journalRef = doc(collection(firestore, 'journal_entries'));
      const cashAcc = accounts?.find(a => a.id === values.debitAccountId);
      const gainLossAcc = accounts?.find(a => a.id === values.gainLossAccountId);

      const lines = [
        // Debit Accumulated Depreciation to write it off
        { accountId: 'ACCUM-DEP-CLOSING', accountName: `Accum. Depr (Written Off) - ${disposalAsset.name}`, debit: disposalAsset.accumulatedDepreciation, credit: 0 },
        // Credit the original asset account to remove cost
        { accountId: 'ASSET-COST-CLOSING', accountName: `Asset Cost (Written Off) - ${disposalAsset.name}`, debit: 0, credit: disposalAsset.purchaseCost }
      ];

      // Debit proceeds if cash/bank received
      if (proceeds > 0) {
        lines.push({ accountId: values.debitAccountId, accountName: cashAcc?.name || 'Cash/Bank', debit: proceeds, credit: 0 });
      }

      // Record gain or loss
      if (gainLoss > 0) {
        // Gain on sale (Credit revenue)
        lines.push({ accountId: values.gainLossAccountId, accountName: gainLossAcc?.name || 'Gain on Disposal', debit: 0, credit: gainLoss });
      } else if (gainLoss < 0) {
        // Loss on sale (Debit expense)
        lines.push({ accountId: values.gainLossAccountId, accountName: gainLossAcc?.name || 'Loss on Disposal', debit: Math.abs(gainLoss), credit: 0 });
      }

      batch.set(journalRef, {
        date: timestamp,
        description: `Disposal of Fixed Asset: ${disposalAsset.name} (${disposalAsset.assetCode})`,
        reference: 'DISPOSAL',
        totalAmount: disposalAsset.purchaseCost,
        createdBy: user.uid,
        createdAt: timestamp,
        schoolId,
        lines
      });

      await batch.commit();

      await logAuditEvent({
        firestore,
        schoolId,
        userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user.displayName || user.email || 'Anonymous'),
        action: 'DISPOSE_ASSET',
        details: `Disposed asset ${disposalAsset.name} (${disposalAsset.assetCode}) for proceeds of GH₵${values.proceeds.toFixed(2)}`
      });

      toast({ title: "Asset Disposed", description: `${disposalAsset.name} disposed. Realized gain/loss recorded.` });
      refetchAssets();
      setIsDisposalOpen(false);
      setDisposalAsset(null);
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Disposal Failed", description: e.message });
    } finally {
      setIsSubmittingDisp(false);
    }
  }

  // Categories filter for accounts list
  const expenseAccounts = accounts?.filter(a => a.type === 'Expense' && !a.isControlAccount) || [];
  const assetAccounts = accounts?.filter(a => a.type === 'Asset' && !a.isControlAccount) || [];
  const revenueAccounts = accounts?.filter(a => a.type === 'Revenue' && !a.isControlAccount) || [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Landmark className="h-8 w-8 text-indigo-700" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Fixed Asset Register</h1>
            <p className="text-muted-foreground">Manage school assets, projected schedules, and ledger depreciation batches.</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Action to Run Depreciation */}
          <Dialog open={isDepreciationOpen} onOpenChange={setIsDepreciationOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50" disabled={activeAssets.length === 0}>
                <Calculator className="h-4 w-4 mr-2" /> Run Depreciation Batch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Run Depreciation Batch</DialogTitle>
                <DialogDescription>This will calculate and post depreciation logs and matching ledger entries for all active assets.</DialogDescription>
              </DialogHeader>

              {activeAssets.length === 0 ? (
                <p className="p-4 text-center text-sm text-slate-500">No active assets require depreciation at this time.</p>
              ) : (
                <Form {...depForm}>
                  <form onSubmit={depForm.handleSubmit(handleRunDepreciation)} className="space-y-6">
                    <div className="space-y-2">
                      <Label>Depreciation Period</Label>
                      <Input {...depForm.register('period')} placeholder="e.g. FY 2026, Q3 2026" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={depForm.control} name="debitAccountId" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Depreciation Expense Account (Debit)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Choose account..." /></SelectTrigger></FormControl>
                            <SelectContent>{expenseAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={depForm.control} name="creditAccountId" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accumulated Depreciation Account (Credit)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Choose account..." /></SelectTrigger></FormControl>
                            <SelectContent>{assetAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="border border-indigo-100 rounded-xl overflow-hidden">
                      <div className="bg-indigo-50/50 p-3 border-b border-indigo-100 font-bold text-xs uppercase text-indigo-700">Depreciation Preview ({previewDepreciation.length} Assets)</div>
                      <div className="max-h-40 overflow-y-auto p-2 space-y-1 text-xs">
                        {previewDepreciation.map(p => (
                          <div key={p.id} className="flex justify-between p-1 hover:bg-slate-50">
                            <span>{p.code} - {p.name}</span>
                            <span className="font-mono font-bold text-rose-600">-GH₵{p.depAmount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-indigo-50/80 p-3 border-t border-indigo-100 flex justify-between font-black text-indigo-900 text-sm">
                        <span>Total Batch Depreciation Amount</span>
                        <span className="font-mono text-base">GH₵{totalPreviewDepreciation.toFixed(2)}</span>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="submit" disabled={isSubmittingDep} className="bg-indigo-600 hover:bg-indigo-700">
                        {isSubmittingDep ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                        Post Depreciation Batch
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              )}
            </DialogContent>
          </Dialog>

          {/* Action to Add New Asset */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" /> Register New Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Register New Fixed Asset</DialogTitle>
                <DialogDescription>Add a new tangible asset to the school register.</DialogDescription>
              </DialogHeader>
              {schoolId && <AddAssetForm setOpen={setIsAddOpen} schoolId={schoolId} onSuccess={refetchAssets} />}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-slate-400 shadow-sm bg-white">
          <CardContent className="pt-6">
            <p className="text-xs uppercase font-bold text-slate-400">Total Fixed Assets Cost</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">GH₵{summary.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-rose-500 shadow-sm bg-white">
          <CardContent className="pt-6">
            <p className="text-xs uppercase font-bold text-rose-400">Total Accumulated Depreciation</p>
            <h3 className="text-2xl font-black text-rose-800 mt-1">GH₵{summary.totalAccDep.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-indigo-600 shadow-sm bg-white">
          <CardContent className="pt-6">
            <p className="text-xs uppercase font-bold text-indigo-400">Net Book Value</p>
            <h3 className="text-2xl font-black text-indigo-900 mt-1">GH₵{summary.netBookValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="register">
        <TabsList className="w-full justify-start border-b">
          <TabsTrigger value="register">Asset Register</TabsTrigger>
          <TabsTrigger value="schedules">Depreciation Schedules</TabsTrigger>
          <TabsTrigger value="history">Depreciation Log History</TabsTrigger>
        </TabsList>

        {/* REGISTER TAB */}
        <TabsContent value="register" className="mt-4">
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" /></div>
              ) : !assets || assets.length === 0 ? (
                <div className="text-center py-24 text-slate-400">
                  <Landmark className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-xs">No assets registered yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Asset Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Original Cost</TableHead>
                      <TableHead className="text-right">Accum. Depr.</TableHead>
                      <TableHead className="text-right">Book Value</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((asset: any) => (
                      <TableRow key={asset.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="font-mono font-bold text-xs">{asset.assetCode}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm">{asset.name}</span>
                            <span className="text-[10px] text-slate-400">Purchased: {asset.purchaseDate?.toDate ? format(asset.purchaseDate.toDate(), 'dd MMM yyyy') : 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{asset.category}</Badge></TableCell>
                        <TableCell className="text-right font-bold text-slate-600">GH₵{asset.purchaseCost?.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium text-rose-600">-GH₵{asset.accumulatedDepreciation?.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-black text-indigo-700">GH₵{asset.currentBookValue?.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={
                            asset.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-700 border-slate-200'
                          }>
                            {asset.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedAsset(asset)}>
                                <Eye className="h-4 w-4 mr-1" /> Plan
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Depreciation Projection for {asset.name}</DialogTitle>
                                <DialogDescription>Projected calculations for useful life of {asset.usefulLifeYears} years ({asset.depreciationMethod}).</DialogDescription>
                              </DialogHeader>
                              <div className="mt-4">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Year</TableHead>
                                      <TableHead className="text-right">Beginning Book Value</TableHead>
                                      <TableHead className="text-right">Depreciation Expense</TableHead>
                                      <TableHead className="text-right">Accumulated Depreciation</TableHead>
                                      <TableHead className="text-right">Ending Book Value</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {calculateDepreciationSchedule(
                                      asset.purchaseCost,
                                      asset.salvageValue,
                                      asset.usefulLifeYears,
                                      asset.depreciationMethod,
                                      asset.depreciationRate
                                    ).map(row => (
                                      <TableRow key={row.year} className={row.endingBookValue === asset.currentBookValue ? 'bg-indigo-50/50 font-bold' : ''}>
                                        <TableCell>Year {row.year}</TableCell>
                                        <TableCell className="text-right">GH₵{row.beginningBookValue.toFixed(2)}</TableCell>
                                        <TableCell className="text-right text-rose-600">-GH₵{row.depreciationExpense.toFixed(2)}</TableCell>
                                        <TableCell className="text-right text-slate-500">GH₵{row.accumulatedDepreciation.toFixed(2)}</TableCell>
                                        <TableCell className="text-right font-bold text-indigo-700">GH₵{row.endingBookValue.toFixed(2)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {asset.status === 'Active' && (
                            <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-800" onClick={() => { setDisposalAsset(asset); setIsDisposalOpen(true); }}>
                              <Trash2 className="h-4 w-4 mr-1" /> Dispose
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DEPRECIATION SCHEDULES TAB */}
        <TabsContent value="schedules" className="mt-4">
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-indigo-900">Life-Cycle Depreciation Projections</CardTitle>
            </CardHeader>
            <CardContent>
              {assets?.filter(a => a.status === 'Active').map(asset => {
                const rows = calculateDepreciationSchedule(asset.purchaseCost, asset.salvageValue, asset.usefulLifeYears, asset.depreciationMethod, asset.depreciationRate);
                return (
                  <div key={asset.id} className="mb-8 border-b pb-6 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-bold text-slate-800 text-base">{asset.name} ({asset.assetCode})</h4>
                        <p className="text-xs text-muted-foreground">{asset.depreciationMethod} • Useful Life: {asset.usefulLifeYears} Years • Salvage: GH₵{asset.salvageValue}</p>
                      </div>
                      <Badge variant="secondary" className="font-black text-indigo-700">Cost: GH₵{asset.purchaseCost}</Badge>
                    </div>
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow>
                          <TableHead className="py-2">Year</TableHead>
                          <TableHead className="py-2 text-right">Beginning Book Value</TableHead>
                          <TableHead className="py-2 text-right">Depreciation Amount</TableHead>
                          <TableHead className="py-2 text-right">Accumulated Depreciation</TableHead>
                          <TableHead className="py-2 text-right">Net Book Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.map(row => (
                          <TableRow key={row.year} className="hover:bg-slate-50/30 text-xs">
                            <TableCell className="py-2">Year {row.year}</TableCell>
                            <TableCell className="py-2 text-right font-mono">GH₵{row.beginningBookValue.toFixed(2)}</TableCell>
                            <TableCell className="py-2 text-right font-mono text-rose-600">-GH₵{row.depreciationExpense.toFixed(2)}</TableCell>
                            <TableCell className="py-2 text-right font-mono text-slate-500">GH₵{row.accumulatedDepreciation.toFixed(2)}</TableCell>
                            <TableCell className="py-2 text-right font-mono font-bold text-indigo-700">GH₵{row.endingBookValue.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history" className="mt-4">
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <CardContent className="p-0">
              {!logs || logs.length === 0 ? (
                <div className="text-center py-24 text-slate-400">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-xs">No depreciation batches run yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Asset Code</TableHead>
                      <TableHead>Asset Name</TableHead>
                      <TableHead>Period Run</TableHead>
                      <TableHead>Run Date</TableHead>
                      <TableHead className="text-right">Depreciation Amount</TableHead>
                      <TableHead className="text-right">Closing Book Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log: any) => (
                      <TableRow key={log.id} className="hover:bg-slate-50">
                        <TableCell className="font-mono text-xs">{log.assetCode}</TableCell>
                        <TableCell className="font-bold text-slate-800 text-sm">{log.assetName}</TableCell>
                        <TableCell><Badge variant="outline" className="bg-indigo-50/50 text-indigo-700 border-indigo-100">{log.period}</Badge></TableCell>
                        <TableCell className="text-xs text-slate-500">{log.runDate?.toDate ? format(log.runDate.toDate(), 'dd MMM yyyy p') : 'Pending'}</TableCell>
                        <TableCell className="text-right font-mono text-rose-600 font-bold">-GH₵{log.depreciationAmount?.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono text-indigo-700 font-bold">GH₵{log.bookValueAfter?.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DISPOSAL DIALOG */}
      <Dialog open={isDisposalOpen} onOpenChange={setIsDisposalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispose Fixed Asset</DialogTitle>
            <DialogDescription>
              Mark <strong>{disposalAsset?.name} ({disposalAsset?.assetCode})</strong> as disposed. This will offset the asset accounts and compute gain/loss calculations.
            </DialogDescription>
          </DialogHeader>

          {disposalAsset && (
            <Form {...dispForm}>
              <form onSubmit={dispForm.handleSubmit(handleDisposeAsset)} className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-lg border text-sm space-y-1">
                  <div className="flex justify-between"><span>Original Cost:</span><span className="font-mono font-bold">GH₵{disposalAsset.purchaseCost.toFixed(2)}</span></div>
                  <div className="flex justify-between text-rose-600"><span>Accumulated Depreciation:</span><span className="font-mono">-GH₵{disposalAsset.accumulatedDepreciation.toFixed(2)}</span></div>
                  <div className="flex justify-between border-t pt-2 font-black text-indigo-700"><span>Net Book Value:</span><span className="font-mono">GH₵{disposalAsset.currentBookValue.toFixed(2)}</span></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={dispForm.control} name="disposalDate" render={({ field }) => (
                    <FormItem><FormLabel>Disposal Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={dispForm.control} name="proceeds" render={({ field }) => (
                    <FormItem><FormLabel>Sale / Scrap Proceeds (GH₵)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={dispForm.control} name="debitAccountId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cash/Bank Account (Debit)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select account..." /></SelectTrigger></FormControl>
                        <SelectContent>{assetAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={dispForm.control} name="gainLossAccountId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gain/Loss Account (Revenue/Expense)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select account..." /></SelectTrigger></FormControl>
                        <SelectContent>
                          {revenueAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>)}
                          {expenseAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <DialogFooter>
                  <Button type="submit" variant="destructive" disabled={isSubmittingDisp} className="w-full">
                    {isSubmittingDisp ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Confirm Disposal & Post Journal Log
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
