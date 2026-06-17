'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { 
  collection, query, orderBy, where, doc, setDoc, writeBatch, serverTimestamp, deleteDoc, getDocs, updateDoc 
} from 'firebase/firestore';
import { 
  Loader2, Plus, Calculator, Save, FileText, Download, Printer, Trash2, 
  Eye, TrendingUp, TrendingDown, RefreshCw, Scale, AlertCircle, Percent,
  Sparkles, ThumbsUp, ThumbsDown, CheckCircle2, XCircle, AlertTriangle, Edit, Copy, Check
} from 'lucide-react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReactMarkdown from 'react-markdown';
import { generateBudgetInsightsAction } from '@/app/actions/insights-ai';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn, getCostCenters } from '@/lib/utils';
import { AppLogo } from '@/components/icons/app-logo';
import { SearchableAccountSelect } from '@/components/ui/account-select';
import Papa from 'papaparse';

import { Account, JournalEntry, Budget, BudgetItem, budgetFormSchema } from '@/lib/types';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';

// Schema for individual budget items in the form
const budgetItemSchema = z.object({
  accountId: z.string().min(1, "Select an account"),
  budgetedAmount: z.coerce.number().min(0.01, "Amount must be positive"),
});

// Helper to get base64
async function getBase64ImageFromUrl(imageUrl: string): Promise<string> {
  try {
    const fetchUrl = imageUrl.startsWith('https://firebasestorage.googleapis.com')
      ? `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`
      : imageUrl;

    const res = await fetch(fetchUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error: any) {
    console.error("❌ getBase64ImageFromUrl failed:", error.message);
    return "";
  }
}

export default function BudgetPage() {
  const { role } = useRole();
  const firestore = useFirestore();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
  const { user } = useUser();
  const { toast } = useToast();

  const schoolProfileRef = useMemoFirebase(
    () => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null,
    [firestore, schoolId]
  );
  const { data: schoolProfile, isLoading: isLoadingProfile } = useDoc<any>(schoolProfileRef);
  const [logoBase64, setLogoBase64] = useState<string>('');

  useEffect(() => {
    if (schoolProfile?.logoUrl) {
      getBase64ImageFromUrl(schoolProfile.logoUrl).then(setLogoBase64);
    }
  }, [schoolProfile]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>('');
  const [selectedCostCenter, setSelectedCostCenter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // Rejection Dialog state
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Budget items creation state
  const [tempItems, setTempItems] = useState<Omit<BudgetItem, 'id' | 'budgetId' | 'schoolId' | 'createdAt'>[]>([]);
  const [tempAccountId, setTempAccountId] = useState<string>('');
  const [tempAmount, setTempAmount] = useState<string>('');
  const [tempCostCenter, setTempCostCenter] = useState<string>('General');

  // Budget items editing state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTempItems, setEditTempItems] = useState<Omit<BudgetItem, 'id' | 'budgetId' | 'schoolId' | 'createdAt'>[]>([]);
  const [editTempAccountId, setEditTempAccountId] = useState<string>('');
  const [editTempAmount, setEditTempAmount] = useState<string>('');
  const [editTempCostCenter, setEditTempCostCenter] = useState<string>('General');

  // 1. Fetch ledger accounts for budget configuration
  const accountsQuery = useMemoFirebase(
    () => (firestore && schoolId) ? query(collection(firestore, 'accounts'), where('schoolId', '==', schoolId)) : null,
    [firestore, schoolId]
  );
  const { data: accounts, isLoading: accLoading } = useCollection<Account>(accountsQuery);

  // 2. Fetch all budgets
  const budgetsQuery = useMemoFirebase(
    () => (firestore && schoolId) ? query(collection(firestore, 'budgets'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null,
    [firestore, schoolId]
  );
  const { data: budgets, isLoading: budgetsLoading, forceRefetch: forceRefetchBudgets } = useCollection<Budget>(budgetsQuery);

  // 3. Fetch budget items for the currently selected budget
  const budgetItemsQuery = useMemoFirebase(
    () => (firestore && schoolId && selectedBudgetId) ? query(collection(firestore, 'budget_items'), where('budgetId', '==', selectedBudgetId)) : null,
    [firestore, schoolId, selectedBudgetId]
  );
  const { data: currentBudgetItems, isLoading: itemsLoading } = useCollection<BudgetItem>(budgetItemsQuery);

  // 4. Fetch journal entries to aggregate actual expenditures/revenues
  const journalsQuery = useMemoFirebase(
    () => (firestore && schoolId) ? query(collection(firestore, 'journal_entries'), where('schoolId', '==', schoolId), orderBy('date', 'asc')) : null,
    [firestore, schoolId]
  );
  const { data: journals, isLoading: journalsLoading } = useCollection<JournalEntry>(journalsQuery);

  const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role || '');

  // Main Form hooks
  const form = useForm<z.infer<typeof budgetFormSchema>>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      name: '',
      fiscalYear: '',
      term: '',
    }
  });

  const editForm = useForm<z.infer<typeof budgetFormSchema>>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      name: '',
      fiscalYear: '',
      term: '',
    }
  });

  // Filter accounts down to Revenue and Expense types
  const budgetedAccounts = useMemo(() => {
    if (!accounts) return [];
    return accounts.filter(acc => ['Revenue', 'Expense'].includes(acc.type));
  }, [accounts]);

  // Handle selected budget object
  const activeBudget = useMemo(() => {
    if (!budgets || !selectedBudgetId) return null;
    return budgets.find(b => b.id === selectedBudgetId) || null;
  }, [budgets, selectedBudgetId]);

  // --- CALCULATION ENGINE: Budget vs Actual Variance ---
  const budgetAnalysis = useMemo(() => {
    if (!activeBudget || !currentBudgetItems || !journals) {
      return {
        items: [],
        totalBudgetedRev: 0,
        totalActualRev: 0,
        totalBudgetedExp: 0,
        totalActualExp: 0,
      };
    }

    const start = startOfDay(activeBudget.startDate.toDate());
    const end = endOfDay(activeBudget.endDate.toDate());

    // Filter journal entries for the current budget's timeline
    const activeJournals = journals.filter(j => {
      const d = j.date.toDate();
      return d >= start && d <= end;
    });

    let totalBudgetedRev = 0;
    let totalActualRev = 0;
    let totalBudgetedExp = 0;
    let totalActualExp = 0;

    // Filter currentBudgetItems by selectedCostCenter if not 'all'
    const filteredBudgetItems = selectedCostCenter === 'all'
      ? currentBudgetItems
      : currentBudgetItems.filter(item => (item.costCenter || 'General') === selectedCostCenter);

    const items = filteredBudgetItems.map(item => {
      let actual = 0;

      activeJournals.forEach(j => {
        j.lines.forEach(l => {
          if (l.accountId === item.accountId && (l.costCenter || 'General') === (item.costCenter || 'General')) {
            if (item.accountType === 'Expense') {
              actual += (l.debit - l.credit);
            } else {
              actual += (l.credit - l.debit);
            }
          }
        });
      });

      // Avoid negative actual balances (represented as zero if fully reversed)
      actual = Math.max(0, actual);

      let variance = 0;
      let percent = 0;
      let isFavorable = true;

      if (item.accountType === 'Expense') {
        variance = item.budgetedAmount - actual; // Positive = Spent less (Favorable)
        isFavorable = variance >= 0;
        totalBudgetedExp += item.budgetedAmount;
        totalActualExp += actual;
      } else {
        variance = actual - item.budgetedAmount; // Positive = Earned more (Favorable)
        isFavorable = variance >= 0;
        totalBudgetedRev += item.budgetedAmount;
        totalActualRev += actual;
      }

      if (item.budgetedAmount > 0) {
        percent = (actual / item.budgetedAmount) * 100;
      }

      return {
        ...item,
        actual,
        variance,
        percent,
        isFavorable,
      };
    });

    return {
      items,
      totalBudgetedRev,
      totalActualRev,
      totalBudgetedExp,
      totalActualExp,
    };
  }, [activeBudget, currentBudgetItems, journals, selectedCostCenter]);

  // Download CSV Template for Bulk Upload
  const handleDownloadTemplate = () => {
    if (!budgetedAccounts) return;
    let csvContent = "AccountCode,AccountName,CostCenter,Amount\n";
    budgetedAccounts.forEach(acc => {
      csvContent += `"${acc.code}","${acc.name.replace(/"/g, '""')}","General",0.00\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `budget_template_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse CSV file and load to budget list
  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedRows = results.data as any[];
        let addedCount = 0;
        let errors: string[] = [];
        const newItems: any[] = [];

        parsedRows.forEach((row, i) => {
          const code = (row.AccountCode || row.accountcode || '').trim();
          const amountStr = (row.Amount || row.amount || '').trim();
          const costCenterRaw = (row.CostCenter || row.costcenter || 'General').trim();
          
          if (!code) return; // skip if code is empty

          const amount = parseFloat(amountStr);
          if (isNaN(amount) || amount <= 0) {
            errors.push(`Row ${i + 2}: Invalid or non-positive amount (${amountStr})`);
            return;
          }

          const acc = budgetedAccounts.find(a => a.code === code);
          if (!acc) {
            errors.push(`Row ${i + 2}: Account code "${code}" not found or not a Revenue/Expense account.`);
            return;
          }

          const ccList = getCostCenters(schoolProfile);
          const matchedCC = ccList.find(cc => 
            cc.id.toLowerCase() === costCenterRaw.toLowerCase() || 
            cc.name.toLowerCase() === costCenterRaw.toLowerCase()
          );
          const resolvedCostCenter = matchedCC ? matchedCC.id : 'General';

          newItems.push({
            accountId: acc.id,
            accountCode: acc.code,
            accountName: acc.name,
            accountType: acc.type as 'Revenue' | 'Expense',
            budgetedAmount: amount,
            costCenter: resolvedCostCenter,
          });
          addedCount++;
        });

        if (errors.length > 0) {
          toast({
            variant: 'destructive',
            title: "Bulk Upload Warnings",
            description: `${errors.length} rows failed to upload. Check console for details.`,
          });
          console.warn("Bulk Upload Errors:", errors);
        }

        if (newItems.length > 0) {
          if (isEdit) {
            setEditTempItems(prev => {
              const filtered = prev.filter(item => !newItems.some(n => n.accountId === item.accountId && (n.costCenter || 'General') === (item.costCenter || 'General')));
              return [...filtered, ...newItems];
            });
          } else {
            setTempItems(prev => {
              const filtered = prev.filter(item => !newItems.some(n => n.accountId === item.accountId && (n.costCenter || 'General') === (item.costCenter || 'General')));
              return [...filtered, ...newItems];
            });
          }
          toast({
            title: "Bulk Upload Complete",
            description: `Successfully loaded ${addedCount} budget line items.`,
          });
        } else {
          toast({
            variant: 'destructive',
            title: "Bulk Upload Failed",
            description: "No valid budget line items were found in the uploaded file.",
          });
        }
        
        e.target.value = '';
      },
      error: (error) => {
        toast({
          variant: 'destructive',
          title: "CSV Parse Error",
          description: error.message,
        });
      }
    });
  };

  // Add line item to temporary list in form
  const addTempItem = () => {
    if (!tempAccountId || !tempAmount || parseFloat(tempAmount) <= 0) {
      toast({ variant: 'destructive', title: "Validation Error", description: "Select an account and enter a positive budget amount." });
      return;
    }

    const selectedAcc = accounts?.find(a => a.id === tempAccountId);
    if (!selectedAcc) return;

    if (tempItems.some(item => item.accountId === tempAccountId && (item.costCenter || 'General') === (tempCostCenter || 'General'))) {
      toast({ variant: 'destructive', title: "Validation Error", description: "Account already added to this budget under the selected cost center." });
      return;
    }

    setTempItems(prev => [
      ...prev,
      {
        accountId: tempAccountId,
        accountCode: selectedAcc.code,
        accountName: selectedAcc.name,
        accountType: selectedAcc.type as 'Revenue' | 'Expense',
        budgetedAmount: parseFloat(tempAmount),
        costCenter: tempCostCenter || 'General',
      }
    ]);

    setTempAccountId('');
    setTempAmount('');
    setTempCostCenter('General');
  };

  // Remove item from temporary list
  const removeTempItem = (index: number) => {
    setTempItems(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Budget creation
  const handleCreateBudget = async (values: z.infer<typeof budgetFormSchema>) => {
    if (!firestore || !user || !schoolId) return;
    if (tempItems.length === 0) {
      toast({ variant: 'destructive', title: "Validation Error", description: "You must add at least one line item to the budget." });
      return;
    }

    setIsSubmitting(true);

    try {
      const batch = writeBatch(firestore);
      const budgetRef = doc(collection(firestore, 'budgets'));
      const budgetId = budgetRef.id;

      const totalRevenue = tempItems
          .filter(item => item.accountType === 'Revenue')
          .reduce((sum, item) => sum + item.budgetedAmount, 0);

      const totalExpenses = tempItems
          .filter(item => item.accountType === 'Expense')
          .reduce((sum, item) => sum + item.budgetedAmount, 0);

      // Save main budget details
      batch.set(budgetRef, {
        id: budgetId,
        schoolId,
        name: values.name,
        fiscalYear: values.fiscalYear,
        term: values.term,
        startDate: values.startDate,
        endDate: values.endDate,
        totalBudgetedRevenue: totalRevenue,
        totalBudgetedExpenses: totalExpenses,
        status: 'Awaiting Review',
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      });

      // Save sub-items
      tempItems.forEach(item => {
        const itemRef = doc(collection(firestore, 'budget_items'));
        batch.set(itemRef, {
          id: itemRef.id,
          budgetId,
          schoolId,
          accountId: item.accountId,
          accountCode: item.accountCode,
          accountName: item.accountName,
          accountType: item.accountType,
          budgetedAmount: item.budgetedAmount,
          costCenter: item.costCenter || 'General',
          createdAt: serverTimestamp(),
        });
      });

      await batch.commit();
      
      toast({ title: "Success", description: "Budget created and submitted for review successfully." });
      setIsCreateOpen(false);
      form.reset();
      setTempItems([]);
      forceRefetchBudgets();
      setSelectedBudgetId(budgetId);
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Execution Error", description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- BUDGET REVISION / EDITING LOGIC ---
  const handleOpenEdit = () => {
    if (!activeBudget || !currentBudgetItems) return;
    editForm.reset({
      name: activeBudget.name,
      fiscalYear: activeBudget.fiscalYear,
      term: activeBudget.term,
      startDate: activeBudget.startDate?.toDate ? activeBudget.startDate.toDate() : new Date(activeBudget.startDate),
      endDate: activeBudget.endDate?.toDate ? activeBudget.endDate.toDate() : new Date(activeBudget.endDate),
    });
    setEditTempItems(currentBudgetItems.map(item => ({
      accountId: item.accountId,
      accountCode: item.accountCode,
      accountName: item.accountName,
      accountType: item.accountType,
      budgetedAmount: item.budgetedAmount,
      costCenter: item.costCenter || 'General',
    })));
    setIsEditOpen(true);
  };

  const addEditTempItem = () => {
    if (!editTempAccountId || !editTempAmount || parseFloat(editTempAmount) <= 0) {
      toast({ variant: 'destructive', title: "Validation Error", description: "Select an account and enter a positive budget amount." });
      return;
    }

    const selectedAcc = accounts?.find(a => a.id === editTempAccountId);
    if (!selectedAcc) return;

    if (editTempItems.some(item => item.accountId === editTempAccountId && (item.costCenter || 'General') === (editTempCostCenter || 'General'))) {
      toast({ variant: 'destructive', title: "Validation Error", description: "Account already added to this budget under the selected cost center." });
      return;
    }

    setEditTempItems(prev => [
      ...prev,
      {
        accountId: editTempAccountId,
        accountCode: selectedAcc.code,
        accountName: selectedAcc.name,
        accountType: selectedAcc.type as 'Revenue' | 'Expense',
        budgetedAmount: parseFloat(editTempAmount),
        costCenter: editTempCostCenter || 'General',
      }
    ]);

    setEditTempAccountId('');
    setEditTempAmount('');
    setEditTempCostCenter('General');
  };

  const removeEditTempItem = (index: number) => {
    setEditTempItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateBudget = async (values: z.infer<typeof budgetFormSchema>) => {
    if (!firestore || !user || !schoolId || !selectedBudgetId) return;
    if (editTempItems.length === 0) {
      toast({ variant: 'destructive', title: "Validation Error", description: "You must add at least one line item to the budget." });
      return;
    }

    setIsSubmitting(true);

    try {
      const batch = writeBatch(firestore);
      const budgetRef = doc(firestore, 'budgets', selectedBudgetId);

      const totalRevenue = editTempItems
          .filter(item => item.accountType === 'Revenue')
          .reduce((sum, item) => sum + item.budgetedAmount, 0);

      const totalExpenses = editTempItems
          .filter(item => item.accountType === 'Expense')
          .reduce((sum, item) => sum + item.budgetedAmount, 0);

      // Save main budget details
      batch.update(budgetRef, {
        name: values.name,
        fiscalYear: values.fiscalYear,
        term: values.term,
        startDate: values.startDate,
        endDate: values.endDate,
        totalBudgetedRevenue: totalRevenue,
        totalBudgetedExpenses: totalExpenses,
        updatedAt: serverTimestamp(),
      });

      // Fetch and delete old lines
      const itemsRef = collection(firestore, 'budget_items');
      const q = query(itemsRef, where('budgetId', '==', selectedBudgetId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(docSnapshot => {
        batch.delete(docSnapshot.ref);
      });

      // Save revised sub-items
      editTempItems.forEach(item => {
        const itemRef = doc(collection(firestore, 'budget_items'));
        batch.set(itemRef, {
          id: itemRef.id,
          budgetId: selectedBudgetId,
          schoolId,
          accountId: item.accountId,
          accountCode: item.accountCode,
          accountName: item.accountName,
          accountType: item.accountType,
          budgetedAmount: item.budgetedAmount,
          costCenter: item.costCenter || 'General',
          createdAt: serverTimestamp(),
        });
      });

      await batch.commit();
      
      toast({ title: "Success", description: "Budget revised and updated successfully." });
      setIsEditOpen(false);
      forceRefetchBudgets();
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Execution Error", description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete budget
  const handleDeleteBudget = async (id: string) => {
    if (!firestore) return;
    if (!confirm("Are you sure you want to delete this budget and all its associated lines? This cannot be undone.")) return;

    try {
      // 1. Fetch budget items to delete
      const itemsRef = collection(firestore, 'budget_items');
      const q = query(itemsRef, where('budgetId', '==', id));
      const querySnapshot = await getDocs(q);

      const batch = writeBatch(firestore);
      
      // Delete budget doc
      batch.delete(doc(firestore, 'budgets', id));

      // Delete lines
      querySnapshot.forEach((docSnapshot: any) => {
        batch.delete(docSnapshot.ref);
      });

      await batch.commit();
      toast({ title: "Deleted", description: "Budget has been deleted." });
      
      if (selectedBudgetId === id) {
        setSelectedBudgetId('');
      }
      forceRefetchBudgets();
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Delete Failed", description: err.message });
    }
  };

  // Update budget approval status
  const handleUpdateStatus = async (newStatus: 'Approved' | 'Rejected', reason?: string) => {
    if (!firestore || !selectedBudgetId) return;
    setIsUpdatingStatus(true);
    try {
      await updateDoc(doc(firestore, 'budgets', selectedBudgetId), {
        status: newStatus,
        rejectionReason: reason || '',
        updatedAt: serverTimestamp(),
      });
      toast({
        title: `Budget ${newStatus}`,
        description: `The budget status has been updated to ${newStatus}.`,
      });
      setIsRejectOpen(false);
      setRejectionReasonInput('');
      forceRefetchBudgets();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: "Status Update Failed",
        description: err.message,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Generate AI variance insights
  const handleGenerateAIAnalysis = async () => {
    if (!firestore || !schoolId || !activeBudget || !budgetAnalysis.items) return;
    setIsGeneratingAI(true);
    try {
      const budgetItemsData = budgetAnalysis.items.map(item => ({
        accountCode: item.accountCode,
        accountName: item.accountName,
        accountType: item.accountType,
        budgetedAmount: item.budgetedAmount,
        actual: item.actual,
        variance: item.variance,
        percent: item.percent,
      }));

      const res = await generateBudgetInsightsAction(
        schoolId,
        activeBudget.name,
        activeBudget.fiscalYear,
        activeBudget.term,
        budgetItemsData
      );

      if (res.success && res.text) {
        await updateDoc(doc(firestore, 'budgets', selectedBudgetId), {
          aiInsight: res.text,
          updatedAt: serverTimestamp(),
        });
        toast({
          title: "AI Analysis Complete",
          description: "Variance insights generated and saved successfully.",
        });
        forceRefetchBudgets();
      } else {
        toast({
          variant: 'destructive',
          title: "AI Analysis Failed",
          description: res.error || "An unknown error occurred.",
        });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: "AI Generation Error",
        description: err.message,
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Copy AI Analysis text
  const handleCopyAIAnalysis = () => {
    if (!activeBudget?.aiInsight) return;
    navigator.clipboard.writeText(activeBudget.aiInsight);
    toast({
      title: "Copied to Clipboard",
      description: "AI budget variance audit insights copied."
    });
  };

  // PDF Export logic
  const handleDownloadPDF = async () => {
    const element = document.getElementById('printable-variance-report');
    if (!element) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      pdf.save(`Budget_Variance_Report_${activeBudget?.name.replace(/\s+/g, '_') || 'Report'}.pdf`);
      toast({ title: "Variance Report Exported" });
    } catch (e) {
      toast({ variant: 'destructive', title: "Export Failed" });
    } finally {
      setIsExporting(false);
    }
  };

  if (!canAccess) return <div className="p-8 text-center text-red-500 font-bold">Access Denied</div>;

  const isLoading = isLoadingSchool || accLoading || budgetsLoading || itemsLoading || journalsLoading;

  // Split budget analysis items
  const revenueAnalysisItems = budgetAnalysis.items.filter(item => item.accountType === 'Revenue');
  const expenseAnalysisItems = budgetAnalysis.items.filter(item => item.accountType === 'Expense');

  // Overall calculations
  const netBudgetedSurplus = budgetAnalysis.totalBudgetedRev - budgetAnalysis.totalBudgetedExp;
  const netActualSurplus = budgetAnalysis.totalActualRev - budgetAnalysis.totalActualExp;
  const netVariance = netActualSurplus - netBudgetedSurplus;
  const totalRevPercent = budgetAnalysis.totalBudgetedRev > 0 ? (budgetAnalysis.totalActualRev / budgetAnalysis.totalBudgetedRev) * 100 : 0;
  const totalExpPercent = budgetAnalysis.totalBudgetedExp > 0 ? (budgetAnalysis.totalActualExp / budgetAnalysis.totalBudgetedExp) * 100 : 0;

  // Dynamic progress colors helper
  const getExpenseProgressClass = (pct: number) => {
    if (pct < 80) return "bg-emerald-500";
    if (pct <= 100) return "bg-amber-500";
    return "bg-red-500 animate-pulse";
  }

  const getRevenueProgressClass = (pct: number) => {
    if (pct < 50) return "bg-red-500";
    if (pct <= 90) return "bg-amber-500";
    return "bg-emerald-500";
  }

  // Large deviation flag indicator (dev >15% and amount >500)
  const isHighDeviation = (budgeted: number, actual: number) => {
    const diff = Math.abs(budgeted - actual);
    if (budgeted === 0) return false;
    const pctDiff = (diff / budgeted) * 100;
    return pctDiff > 15 && diff > 500;
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      
      {/* Premium Gradient Auditing Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-lg border border-indigo-900/50">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
          <Calculator className="w-64 h-64" />
        </div>
        <div className="flex justify-between items-start flex-wrap gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-500 text-white font-bold px-2 py-0.5 text-[10px]">FISCAL PLANNER & AUDITS</Badge>
              {activeBudget && (
                <Badge className={cn(
                  "text-[10px] font-bold uppercase",
                  activeBudget.status === 'Approved' ? "bg-emerald-500 text-white" :
                  activeBudget.status === 'Awaiting Review' ? "bg-amber-500 text-white animate-pulse" :
                  "bg-red-500 text-white"
                )}>
                  {activeBudget.status}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-black tracking-tight">Budgets & Variance Analysis</h1>
            <p className="text-indigo-100/70 text-sm max-w-md">Reconcile academic year operational allocations, monitor cost overruns, and generate performance reports.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {budgets && budgets.length > 0 && (
              <Select value={selectedBudgetId} onValueChange={setSelectedBudgetId}>
                <SelectTrigger className="w-[240px] bg-white text-slate-800 border-slate-200 rounded-xl font-bold shadow-sm h-9">
                  <SelectValue placeholder="Select Active Budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map(b => (
                    <SelectItem key={b.id} value={b.id} className="font-bold">
                      {b.name} ({b.fiscalYear})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Cost Center Filter Selection */}
            <Select value={selectedCostCenter} onValueChange={setSelectedCostCenter}>
              <SelectTrigger className="w-[180px] bg-white text-slate-800 border-slate-200 rounded-xl font-bold shadow-sm h-9">
                <SelectValue placeholder="Filter Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-bold">All Departments</SelectItem>
                {getCostCenters(schoolProfile).map(cc => (
                  <SelectItem key={cc.id} value={cc.id} className="font-bold">
                    {cc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* CREATE BUDGET MODAL */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 shadow-md text-xs">
                  <Plus className="mr-1.5 h-4 w-4" /> New Budget
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black text-slate-900">Create Operational Budget</DialogTitle>
                  <DialogDescription className="font-medium">Define your academic year's financial allocations per ledger account.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateBudget)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700">Budget Name</FormLabel>
                          <FormControl><Input placeholder="e.g. 2026 Q3 Operating Budget" className="rounded-xl font-medium" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <div className="grid grid-cols-2 gap-2">
                        <FormField control={form.control} name="fiscalYear" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-slate-700">Academic Year</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger className="rounded-xl font-semibold"><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                              <SelectContent>{MOCK_ACADEMIC_YEARS.map((y: string) => <SelectItem key={y} value={y} className="font-bold">{y}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="term" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-slate-700">Term</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger className="rounded-xl font-semibold"><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="Full Year" className="font-bold">Full Year</SelectItem>
                                {MOCK_TERMS.map((t: string) => <SelectItem key={t} value={t} className="font-bold">{t}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="startDate" render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-bold text-slate-700">Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" className={cn("w-full pl-3 text-left font-bold rounded-xl", !field.value && "text-muted-foreground")}>
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
                      )} />

                      <FormField control={form.control} name="endDate" render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-bold text-slate-700">End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" className={cn("w-full pl-3 text-left font-bold rounded-xl", !field.value && "text-muted-foreground")}>
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
                      )} />
                    </div>

                    <div className="border-t border-dashed pt-4">
                      <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">Budget Line Items</h3>
                      <div className="grid md:grid-cols-4 gap-2 items-end bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
                        <div className="space-y-1 flex flex-col justify-end">
                          <Label className="font-bold text-xs text-slate-500 mb-1">Ledger Account (GL)</Label>
                          <SearchableAccountSelect
                            accounts={budgetedAccounts || []}
                            value={tempAccountId}
                            onChange={setTempAccountId}
                            placeholder="Choose account..."
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="font-bold text-xs text-slate-500 mb-1">Cost Center</Label>
                          <Select value={tempCostCenter} onValueChange={setTempCostCenter}>
                            <SelectTrigger className="rounded-xl font-bold bg-white">
                              <SelectValue placeholder="Select Cost Center" />
                            </SelectTrigger>
                            <SelectContent>
                              {getCostCenters(schoolProfile).map(cc => (
                                <SelectItem key={cc.id} value={cc.id} className="font-bold">
                                  {cc.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="font-bold text-xs text-slate-500">{"Allocated Amount (GH₵)"}</Label>
                          <Input type="number" step="0.01" value={tempAmount} onChange={e => setTempAmount(e.target.value)} placeholder="0.00" className="bg-white rounded-xl font-bold" />
                        </div>

                        <Button type="button" onClick={addTempItem} variant="secondary" className="w-full bg-slate-800 text-white font-bold hover:bg-slate-900 rounded-xl h-10">
                          <Plus className="mr-1 h-4 w-4" /> Add Line
                        </Button>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4 text-xs font-bold text-slate-700">
                        <div className="space-y-1 w-full md:w-auto flex-grow">
                          <Label className="font-black text-xs text-slate-650 flex items-center gap-1.5"><Plus className="h-4 w-4 text-indigo-600"/> Bulk Upload Lines (CSV)</Label>
                          <Input 
                            type="file" 
                            accept=".csv" 
                            onChange={(e) => handleBulkUpload(e, false)} 
                            className="bg-white rounded-xl cursor-pointer text-xs font-bold py-1.5 h-10 border border-slate-200 file:mr-2 file:py-0.5 file:px-2 file:rounded-md file:border-0 file:bg-slate-100 file:text-slate-800 file:font-bold hover:file:bg-slate-200"
                          />
                        </div>
                        <div className="text-slate-400 font-semibold md:max-w-[320px] text-left leading-relaxed">
                          Upload CSV: <code className="font-mono text-indigo-600 bg-white px-1 py-0.5 rounded border border-slate-200">AccountCode,CostCenter,Amount</code>
                        </div>
                        <Button 
                          type="button" 
                          variant="link" 
                          onClick={handleDownloadTemplate} 
                          className="text-xs text-indigo-650 hover:text-indigo-850 font-bold p-0 h-auto shrink-0 flex items-center gap-1"
                        >
                          <Download className="h-3.5 w-3.5"/> Template CSV
                        </Button>
                      </div>

                      <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-[250px] overflow-y-auto bg-white shadow-inner">
                        <Table>
                          <TableHeader className="bg-slate-50">
                            <TableRow>
                              <TableHead className="font-bold">Code</TableHead>
                              <TableHead className="font-bold">Account</TableHead>
                              <TableHead className="font-bold">Cost Center</TableHead>
                              <TableHead className="font-bold">Type</TableHead>
                              <TableHead className="text-right font-bold">Budgeted (GH₵)</TableHead>
                              <TableHead className="text-center font-bold">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tempItems.length === 0 ? (
                              <TableRow><TableCell colSpan={6} className="text-center text-slate-400 py-10 font-bold">No budget lines configured yet.</TableCell></TableRow>
                            ) : (
                              tempItems.map((item, index) => (
                                <TableRow key={index} className="hover:bg-slate-50">
                                  <TableCell className="font-mono font-semibold text-xs">{item.accountCode}</TableCell>
                                  <TableCell className="font-bold text-slate-800">{item.accountName}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="font-bold bg-slate-100 text-slate-700">
                                      {getCostCenters(schoolProfile).find(cc => cc.id === item.costCenter)?.name || item.costCenter || 'General'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell><Badge className={cn("text-[9px] uppercase font-black", item.accountType === 'Revenue' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>{item.accountType}</Badge></TableCell>
                                  <TableCell className="text-right font-mono font-bold">GH₵{item.budgetedAmount.toFixed(2)}</TableCell>
                                  <TableCell className="text-center">
                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeTempItem(index)} className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                      <Trash2 className="h-4 w-4"/>
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-indigo-600 font-bold text-white hover:bg-indigo-700 rounded-xl mt-4">
                        {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
                        Activate & Publish Budget
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
          <div>
            <span className="text-[10px] text-indigo-200/60 uppercase font-black tracking-wider block">Targeted Revenue Streams</span>
            <span className="text-lg font-bold block text-emerald-400">GH₵{budgetAnalysis.totalBudgetedRev.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div>
            <span className="text-[10px] text-indigo-200/60 uppercase font-black tracking-wider block">Targeted Expenditures</span>
            <span className="text-lg font-bold block text-rose-450">GH₵{budgetAnalysis.totalBudgetedExp.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div>
            <span className="text-[10px] text-indigo-200/60 uppercase font-black tracking-wider block">Budgeted surplus / (deficit)</span>
            <span className="text-lg font-bold block">GH₵{netBudgetedSurplus.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div>
            <span className="text-[10px] text-indigo-200/60 uppercase font-black tracking-wider block">Active Filter Level</span>
            <Badge variant="secondary" className="uppercase font-bold text-[9px] mt-1 bg-white/15 text-white hover:bg-white/20">
              {selectedCostCenter === 'all' ? 'All cost centers' : getCostCenters(schoolProfile).find(c => c.id === selectedCostCenter)?.name || selectedCostCenter}
            </Badge>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600 h-10 w-10" /></div>
      ) : !activeBudget ? (
        <Card className="border-none bg-slate-50 text-center py-24 rounded-3xl shadow-inner border border-slate-200">
          <CardContent>
            <Scale className="h-16 w-16 mx-auto mb-4 text-indigo-300 opacity-60"/>
            <h3 className="text-xl font-black text-slate-700 mb-1">No Active Budget Selected</h3>
            <p className="text-slate-400 font-medium max-w-md mx-auto mb-6">Create a new budget using the button at the top right to start tracking operational performance.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* APPROVAL STATUS BANNER WITH REJECTION COMMENT DETAILS */}
          {activeBudget.status === 'Awaiting Review' && (
            <Card className="border-amber-200 bg-amber-50/40 rounded-3xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border shadow-sm">
              <div className="flex gap-3 items-center">
                <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
                  <AlertCircle className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-black text-slate-950 text-base">Awaiting Official Review</h4>
                  <p className="text-xs text-slate-500 font-semibold">This budget is currently pending approval by a Director or School Administrator.</p>
                </div>
              </div>
              {['Director', 'Administrator'].includes(role || '') && (
                <div className="flex gap-2 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                  <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsRejectOpen(true)}
                      className="bg-white border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl px-4 py-4 h-9 text-xs"
                    >
                      <XCircle className="h-4 w-4 mr-1.5" /> Reject Budget
                    </Button>
                    <DialogContent className="sm:max-w-[400px]">
                      <DialogHeader>
                        <DialogTitle>Reject Budget Allocation</DialogTitle>
                        <DialogDescription>Input remarks explaining discrepancies or changes required.</DialogDescription>
                      </DialogHeader>
                      <div className="py-2">
                        <Label>Auditor Rejection Comments</Label>
                        <Textarea 
                          value={rejectionReasonInput}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRejectionReasonInput(e.target.value)}
                          placeholder="Stationery lines are overestimated..."
                          className="mt-1"
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
                        <Button 
                          variant="destructive"
                          onClick={() => handleUpdateStatus('Rejected', rejectionReasonInput)}
                          disabled={isUpdatingStatus || !rejectionReasonInput.trim()}
                        >
                          Confirm Rejection
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus('Approved')} 
                    className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-xl px-4 py-4 h-9 text-xs shadow-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1.5" /> Approve Budget
                  </Button>
                </div>
              )}
            </Card>
          )}

          {activeBudget.status === 'Rejected' && (
            <Card className="border-red-200 bg-red-50/30 rounded-3xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border shadow-sm">
              <div className="flex gap-3 items-center">
                <div className="p-3 bg-red-100 text-red-750 rounded-2xl">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-950 text-base">Budget Allocation Rejected</h4>
                  <p className="text-xs text-red-800 font-extrabold">
                    Comment: <span className="font-semibold text-slate-600 italic">"{activeBudget.rejectionReason || 'No notes left by director.'}"</span>
                  </p>
                </div>
              </div>
              {['Director', 'Administrator'].includes(role || '') && (
                <Button 
                  disabled={isUpdatingStatus}
                  onClick={() => handleUpdateStatus('Approved')} 
                  className="bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl px-4 py-4 h-9 text-xs shadow-md"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1.5" /> Force Approve
                </Button>
              )}
            </Card>
          )}

          {/* STATS HIGHLIGHTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* REVENUE STATS */}
            <Card className="border-none shadow-md bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl overflow-hidden relative group">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Revenues Target</p>
                  <TrendingUp className="h-5 w-5 opacity-80" />
                </div>
                <div>
                  <h3 className="text-3xl font-black font-mono">GH₵{budgetAnalysis.totalActualRev.toFixed(2)}</h3>
                  <p className="text-xs font-semibold opacity-90 mt-1">Budgeted: GH₵{budgetAnalysis.totalBudgetedRev.toFixed(2)}</p>
                </div>
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Target Achieved</span>
                    <span>{totalRevPercent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, totalRevPercent)}%` }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* EXPENSE STATS */}
            <Card className="border-none shadow-md bg-gradient-to-br from-rose-500 to-red-650 text-white rounded-3xl overflow-hidden relative group">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Expenditures Consumed</p>
                  <TrendingDown className="h-5 w-5 opacity-80" />
                </div>
                <div>
                  <h3 className="text-3xl font-black font-mono">GH₵{budgetAnalysis.totalActualExp.toFixed(2)}</h3>
                  <p className="text-xs font-semibold opacity-90 mt-1">Budgeted Limit: GH₵{budgetAnalysis.totalBudgetedExp.toFixed(2)}</p>
                </div>
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Budget Consumed</span>
                    <span>{totalExpPercent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-500", totalExpPercent >= 100 ? "bg-amber-300" : "bg-white")} style={{ width: `${Math.min(100, totalExpPercent)}%` }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NET SURPLUS STATS */}
            <Card className={cn(
              "border-none shadow-md text-white rounded-3xl overflow-hidden relative group bg-gradient-to-br",
              netActualSurplus >= 0 ? "from-slate-900 to-indigo-950" : "from-amber-600 to-orange-700"
            )}>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Actual Surplus / (Deficit)</p>
                  <Scale className="h-5 w-5 opacity-80" />
                </div>
                <div>
                  <h3 className="text-3xl font-black font-mono">GH₵{netActualSurplus.toFixed(2)}</h3>
                  <p className="text-xs font-semibold opacity-90 mt-1">Budgeted Target: GH₵{netBudgetedSurplus.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center pt-2 text-xs font-black bg-white/10 p-2 rounded-xl">
                  <span>NET VARIANCE:</span>
                  <span className={cn(netVariance >= 0 ? "text-green-300" : "text-amber-300")}>
                    {netVariance >= 0 ? "+" : ""}GH₵{netVariance.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* REPORT AND VARIANCE TABS */}
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="flex justify-between items-center bg-white border border-slate-100 p-2.5 rounded-2xl shadow-sm flex-wrap gap-4">
              <TabsList className="bg-slate-100 rounded-xl p-1 shrink-0 flex-wrap">
                <TabsTrigger value="overview" className="rounded-lg font-bold">Variance Dashboard</TabsTrigger>
                <TabsTrigger value="revenue" className="rounded-lg font-bold">Revenue Variance</TabsTrigger>
                <TabsTrigger value="expense" className="rounded-lg font-bold">Expense Variance</TabsTrigger>
                <TabsTrigger value="report" className="rounded-lg font-bold">Variance Report</TabsTrigger>
                <TabsTrigger value="ai-analysis" className="rounded-lg font-bold flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" /> AI Performance Audit
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-1.5 print:hidden">
                {['Administrator', 'Director'].includes(role || '') && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleOpenEdit} 
                    className="border-indigo-200 text-indigo-650 bg-indigo-50 hover:bg-indigo-100 font-bold rounded-lg h-8 text-xs"
                  >
                    <Edit className="h-4 w-4 mr-1"/> Edit Budget
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => handleDeleteBudget(selectedBudgetId)} className="text-red-500 hover:text-red-650 border-red-100 bg-red-50/20 font-bold rounded-lg h-8 text-xs">
                  <Trash2 className="h-4 w-4 mr-1"/> Delete Budget
                </Button>
              </div>
            </div>

            {/* TAB: DASHBOARD OVERVIEW */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Revenue progress gauge */}
                <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden">
                  <CardHeader className="bg-slate-50/30 border-b pb-3"><CardTitle className="text-slate-800 text-sm font-extrabold flex items-center gap-1.5 uppercase tracking-wider"><TrendingUp className="text-green-500 h-4 w-4"/> Revenue Target Breakdown</CardTitle></CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    {revenueAnalysisItems.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-10 font-bold">No revenue items mapped under active filter.</p>
                    ) : (
                      revenueAnalysisItems.map(item => {
                        const costCenterName = getCostCenters(schoolProfile).find(cc => cc.id === item.costCenter)?.name || item.costCenter || 'General';
                        const isSevere = isHighDeviation(item.budgetedAmount, item.actual);
                        return (
                          <div key={item.id} className="space-y-1.5 bg-slate-50/40 p-3 rounded-2xl border border-slate-200">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-700 flex items-center gap-1">
                                {item.accountName} 
                                <span className="text-slate-400 font-semibold text-[10px]">({costCenterName})</span>
                                {isSevere && <span title="High Deviation Alert"><AlertTriangle className="h-3.5 w-3.5 text-amber-500" /></span>}
                              </span>
                              <span className="font-semibold text-slate-500 font-mono text-[11px]">GH₵{item.actual.toFixed(0)} / GH₵{item.budgetedAmount.toFixed(0)}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full transition-all duration-300", getRevenueProgressClass(item.percent))} style={{ width: `${Math.min(100, item.percent)}%` }}></div>
                              </div>
                              <span className="text-[10px] font-black w-10 text-right text-slate-650">{item.percent.toFixed(0)}%</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </CardContent>
                </Card>

                {/* Expense progress gauge */}
                <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden">
                  <CardHeader className="bg-slate-50/30 border-b pb-3"><CardTitle className="text-slate-800 text-sm font-extrabold flex items-center gap-1.5 uppercase tracking-wider"><TrendingDown className="text-red-500 h-4 w-4"/> Expense Allocation Breakdown</CardTitle></CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    {expenseAnalysisItems.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-10 font-bold">No expense items mapped under active filter.</p>
                    ) : (
                      expenseAnalysisItems.map(item => {
                        const costCenterName = getCostCenters(schoolProfile).find(cc => cc.id === item.costCenter)?.name || item.costCenter || 'General';
                        const isSevere = isHighDeviation(item.budgetedAmount, item.actual);
                        return (
                          <div key={item.id} className="space-y-1.5 bg-slate-50/40 p-3 rounded-2xl border border-slate-200">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-700 flex items-center gap-1">
                                {item.accountName} 
                                <span className="text-slate-400 font-semibold text-[10px]">({costCenterName})</span>
                                {isSevere && <span title="Budget Overrun Warning"><AlertTriangle className="h-3.5 w-3.5 text-rose-500 animate-bounce" /></span>}
                              </span>
                              <span className="font-semibold text-slate-500 font-mono text-[11px]">GH₵{item.actual.toFixed(0)} / GH₵{item.budgetedAmount.toFixed(0)}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                                <div className={cn("h-full rounded-full transition-all duration-300", getExpenseProgressClass(item.percent))} style={{ width: `${Math.min(100, item.percent)}%` }}></div>
                              </div>
                              <span className="text-[10px] font-black w-10 text-right text-slate-650">{item.percent.toFixed(0)}%</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TAB: REVENUE TABLE */}
            <TabsContent value="revenue">
              <Card className="border border-slate-250 shadow-md bg-white rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="pl-6 font-bold text-xs">Code</TableHead>
                        <TableHead className="font-bold text-xs">Account Name</TableHead>
                        <TableHead className="font-bold text-xs">Cost Center</TableHead>
                        <TableHead className="text-right font-bold text-xs">Budgeted (GH₵)</TableHead>
                        <TableHead className="text-right font-bold text-xs">Actual (GH₵)</TableHead>
                        <TableHead className="text-right font-bold text-xs">Variance (GH₵)</TableHead>
                        <TableHead className="text-center font-bold text-xs">% Achieved</TableHead>
                        <TableHead className="text-right pr-6 font-bold text-xs">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revenueAnalysisItems.length === 0 ? (
                        <TableRow><TableCell colSpan={8} className="text-center py-20 text-slate-400 font-bold">No revenue items added or matching active filters.</TableCell></TableRow>
                      ) : (
                        revenueAnalysisItems.map(item => {
                          const isSevere = isHighDeviation(item.budgetedAmount, item.actual);
                          return (
                            <TableRow key={item.id} className={cn("hover:bg-slate-50/50", isSevere ? "bg-amber-50/30" : "")}>
                              <TableCell className="font-mono text-xs font-semibold pl-6">{item.accountCode}</TableCell>
                              <TableCell className="font-bold text-slate-800 text-xs flex items-center gap-1.5 py-3">
                                {item.accountName}
                                {isSevere && <span title="Large discrepancy variance (>15% and >GH₵500)"><AlertTriangle className="h-4 w-4 text-amber-500" /></span>}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-bold bg-slate-100 text-slate-700 text-[10px]">
                                  {getCostCenters(schoolProfile).find(cc => cc.id === item.costCenter)?.name || item.costCenter || 'General'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs font-semibold text-slate-700">GH₵{item.budgetedAmount.toFixed(2)}</TableCell>
                              <TableCell className="text-right font-mono text-xs font-semibold text-slate-650">GH₵{item.actual.toFixed(2)}</TableCell>
                              <TableCell className={cn("text-right font-mono font-bold text-xs", item.variance >= 0 ? "text-emerald-700" : "text-rose-700")}>
                                {item.variance >= 0 ? "+" : ""}GH₵{item.variance.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-center font-bold text-xs font-mono">{item.percent.toFixed(1)}%</TableCell>
                              <TableCell className="text-right pr-6">
                                <Badge className={cn("text-[9px] font-black uppercase rounded-lg border", item.isFavorable ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100")}>
                                  {item.isFavorable ? "Favorable" : "Deficit"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: EXPENSE TABLE */}
            <TabsContent value="expense">
              <Card className="border border-slate-250 shadow-md bg-white rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="pl-6 font-bold text-xs">Code</TableHead>
                        <TableHead className="font-bold text-xs">Account Name</TableHead>
                        <TableHead className="font-bold text-xs">Cost Center</TableHead>
                        <TableHead className="text-right font-bold text-xs">Budgeted (GH₵)</TableHead>
                        <TableHead className="text-right font-bold text-xs">Actual (GH₵)</TableHead>
                        <TableHead className="text-right font-bold text-xs">Variance (GH₵)</TableHead>
                        <TableHead className="text-center font-bold text-xs">% Consumed</TableHead>
                        <TableHead className="text-right pr-6 font-bold text-xs">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenseAnalysisItems.length === 0 ? (
                        <TableRow><TableCell colSpan={8} className="text-center py-20 text-slate-400 font-bold">No expense items added or matching active filters.</TableCell></TableRow>
                      ) : (
                        expenseAnalysisItems.map(item => {
                          const isSevere = isHighDeviation(item.budgetedAmount, item.actual);
                          return (
                            <TableRow key={item.id} className={cn("hover:bg-slate-50/50", isSevere ? "bg-rose-50/20" : "")}>
                              <TableCell className="font-mono text-xs font-semibold pl-6">{item.accountCode}</TableCell>
                              <TableCell className="font-bold text-slate-800 text-xs flex items-center gap-1.5 py-3">
                                {item.accountName}
                                {isSevere && <span title="Large spending overrun (>15% and >GH₵500)"><AlertTriangle className="h-4 w-4 text-rose-500 animate-bounce" /></span>}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-bold bg-slate-100 text-slate-700 text-[10px]">
                                  {getCostCenters(schoolProfile).find(cc => cc.id === item.costCenter)?.name || item.costCenter || 'General'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs font-semibold text-slate-700">GH₵{item.budgetedAmount.toFixed(2)}</TableCell>
                              <TableCell className="text-right font-mono text-xs font-semibold text-slate-650">GH₵{item.actual.toFixed(2)}</TableCell>
                              <TableCell className={cn("text-right font-mono font-bold text-xs", item.variance >= 0 ? "text-emerald-700" : "text-rose-705")}>
                                {item.variance >= 0 ? "+" : ""}GH₵{item.variance.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-center font-bold text-xs font-mono">{item.percent.toFixed(1)}%</TableCell>
                              <TableCell className="text-right pr-6">
                                <Badge className={cn("text-[9px] font-black uppercase rounded-lg border", item.isFavorable ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100 animate-pulse")}>
                                  {item.isFavorable ? "Favorable" : "Over Budget"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: VARIANCE REPORT (PRINT & PDF VIEW) */}
            <TabsContent value="report" className="space-y-4">
              <div className="flex justify-end gap-2 print:hidden">
                <Button variant="outline" onClick={() => window.print()} className="rounded-xl font-bold h-9 text-xs border-slate-300"><Printer className="mr-1.5 h-4 w-4"/> Print Report</Button>
                <Button onClick={handleDownloadPDF} disabled={isExporting} className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl text-white h-9 text-xs">
                  {isExporting ? <Loader2 className="animate-spin mr-1.5 h-4 w-4"/> : <Download className="mr-1.5 h-4 w-4"/>}
                  Export PDF
                </Button>
              </div>

              {/* REPORT DOCUMENT CONTAINER */}
              <div className="bg-white text-black p-8 border border-slate-200 shadow-lg rounded-3xl font-sans max-w-4xl mx-auto" id="printable-variance-report">
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
                  <div className="flex items-center gap-4">
                    {logoBase64 ? (
                      <img src={logoBase64} alt={schoolProfile?.name || 'School Logo'} className="h-16 w-16 object-contain" />
                    ) : schoolProfile?.logoUrl ? (
                      <img src={schoolProfile.logoUrl} alt={schoolProfile?.name || 'School Logo'} className="h-16 w-16 object-contain" />
                    ) : (
                      <AppLogo className="h-16 w-16 text-indigo-600" />
                    )}
                    <div>
                      <h1 className="text-2xl font-black uppercase tracking-tight">{schoolProfile?.name || 'GAM EDU SCHOOL SYSTEM'}</h1>
                      <p className="text-xs text-slate-500 font-semibold">FINANCIAL PERFORMANCE & VARIANCE STATEMENT</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-black text-slate-300 uppercase tracking-widest text-right">Performance Report</h2>
                    <p className="text-sm font-bold text-slate-900 mt-1">{activeBudget.name}</p>
                    <p className="text-[10px] font-bold text-slate-450 uppercase tracking-tighter">Academic Year: {activeBudget.fiscalYear}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reporting Period:</p>
                    <p className="text-sm font-bold text-slate-900">
                      {format(activeBudget.startDate.toDate(), 'PPP')} — {format(activeBudget.endDate.toDate(), 'PPP')}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Cost Center Filter:</p>
                    <p className="text-sm font-bold text-slate-900 uppercase">
                      {selectedCostCenter === 'all' ? 'All cost centers' : getCostCenters(schoolProfile).find(c => c.id === selectedCostCenter)?.name || selectedCostCenter}
                    </p>
                  </div>
                </div>

                {/* Financial Summary Breakdown */}
                <table className="w-full text-sm mb-8">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="text-left p-3 rounded-tl-xl">Financial Category</th>
                      <th className="text-right p-3">Budgeted (GH₵)</th>
                      <th className="text-right p-3">Actual (GH₵)</th>
                      <th className="text-right p-3 rounded-tr-xl">Variance (GH₵)</th>
                    </tr>
                  </thead>
                  <tbody className="border-x border-b rounded-b-xl overflow-hidden font-bold">
                    <tr className="border-b text-emerald-700">
                      <td className="p-3">Total Operational Revenue</td>
                      <td className="p-3 text-right font-mono">GH₵{budgetAnalysis.totalBudgetedRev.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono">GH₵{budgetAnalysis.totalActualRev.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono">
                        {(budgetAnalysis.totalActualRev - budgetAnalysis.totalBudgetedRev) >= 0 ? "+" : ""}
                        GH₵{(budgetAnalysis.totalActualRev - budgetAnalysis.totalBudgetedRev).toFixed(2)}
                      </td>
                    </tr>
                    <tr className="border-b text-rose-650">
                      <td className="p-3">Total Operational Expenses</td>
                      <td className="p-3 text-right font-mono">GH₵{budgetAnalysis.totalBudgetedExp.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono">GH₵{budgetAnalysis.totalActualExp.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono">
                        GH₵{(budgetAnalysis.totalBudgetedExp - budgetAnalysis.totalActualExp).toFixed(2)}
                      </td>
                    </tr>
                    <tr className="bg-indigo-50 font-black text-indigo-900">
                      <td className="p-3 text-base uppercase">Net Operational Surplus / (Deficit)</td>
                      <td className="p-3 text-right font-mono text-base">GH₵{netBudgetedSurplus.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono text-base">GH₵{netActualSurplus.toFixed(2)}</td>
                      <td className={cn("p-3 text-right font-mono text-lg", netVariance >= 0 ? "text-emerald-750" : "text-rose-750")}>
                        {netVariance >= 0 ? "+" : ""}GH₵{netVariance.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Subsections of Detailed Variance */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 border-b pb-1">Detailed Revenue Breakdown</h3>
                    <Table className="text-xs">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Account Name</TableHead>
                          <TableHead>Cost Center</TableHead>
                          <TableHead className="text-right">Budgeted (GH₵)</TableHead>
                          <TableHead className="text-right">Actual (GH₵)</TableHead>
                          <TableHead className="text-right">Variance (GH₵)</TableHead>
                          <TableHead className="text-right">Variance %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {revenueAnalysisItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono">{item.accountCode}</TableCell>
                            <TableCell className="font-bold">{item.accountName}</TableCell>
                            <TableCell className="font-semibold text-slate-500">
                              {getCostCenters(schoolProfile).find(cc => cc.id === item.costCenter)?.name || item.costCenter || 'General'}
                            </TableCell>
                            <TableCell className="text-right font-mono">GH₵{item.budgetedAmount.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-mono">GH₵{item.actual.toFixed(2)}</TableCell>
                            <TableCell className={cn("text-right font-mono font-bold", item.variance >= 0 ? "text-emerald-700" : "text-rose-700")}>
                              {item.variance >= 0 ? "+" : ""}GH₵{item.variance.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-bold">{item.percent.toFixed(0)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 border-b pb-1">Detailed Expense Breakdown</h3>
                    <Table className="text-xs">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Account Name</TableHead>
                          <TableHead>Cost Center</TableHead>
                          <TableHead className="text-right">Budgeted (GH₵)</TableHead>
                          <TableHead className="text-right">Actual (GH₵)</TableHead>
                          <TableHead className="text-right">Variance (GH₵)</TableHead>
                          <TableHead className="text-right">Variance %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expenseAnalysisItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono">{item.accountCode}</TableCell>
                            <TableCell className="font-bold">{item.accountName}</TableCell>
                            <TableCell className="font-semibold text-slate-500">
                              {getCostCenters(schoolProfile).find(cc => cc.id === item.costCenter)?.name || item.costCenter || 'General'}
                            </TableCell>
                            <TableCell className="text-right font-mono">GH₵{item.budgetedAmount.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-mono">GH₵{item.actual.toFixed(2)}</TableCell>
                            <TableCell className={cn("text-right font-mono font-bold", item.variance >= 0 ? "text-emerald-700" : "text-rose-700")}>
                              {item.variance >= 0 ? "+" : ""}GH₵{item.variance.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-bold">{item.percent.toFixed(0)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-12 mt-16 pt-8 border-t border-dashed">
                  <div className="text-center">
                    <div className="border-b border-black h-8 mb-2"></div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Finance Director / Bursar</p>
                    <p className="text-[8px] font-semibold text-slate-500">Prepared By</p>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-black h-8 mb-2"></div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">School Administrator / Director</p>
                    <p className="text-[8px] font-semibold text-slate-500">Authorized Official Approval</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB: AI VARIANCE ANALYSIS */}
            <TabsContent value="ai-analysis" className="space-y-4">
              <Card className="rounded-3xl border border-slate-200 shadow-md overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b flex flex-col md:flex-row items-start md:items-center justify-between py-5 px-6 gap-4">
                  <div>
                    <CardTitle className="text-slate-900 font-black flex items-center gap-2 text-lg">
                      <Sparkles className="h-5 w-5 text-indigo-600 animate-pulse" />
                      AI Budget & Variance Auditor
                    </CardTitle>
                    <CardDescription className="font-semibold text-slate-500">
                      Automated analysis of actual spending vs budgeted targets using Genkit.
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {activeBudget.aiInsight && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyAIAnalysis}
                          className="border-slate-350 text-slate-700 hover:bg-slate-50 font-bold rounded-xl h-10 px-4 flex items-center gap-1.5"
                        >
                          <Copy className="h-4 w-4"/> Copy Text
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleGenerateAIAnalysis}
                          disabled={isGeneratingAI}
                          className="border-indigo-200 text-indigo-650 hover:bg-indigo-50 font-bold rounded-xl shadow-sm flex items-center gap-1.5 h-10 px-4 shrink-0"
                        >
                          {isGeneratingAI ? <Loader2 className="h-4 w-4 animate-spin"/> : <RefreshCw className="h-4 w-4"/>}
                          {isGeneratingAI ? 'Recalculating...' : 'Regenerate Audit'}
                        </Button>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {isGeneratingAI ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                      <div className="relative flex items-center justify-center">
                        <div className="h-14 w-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <Sparkles className="h-5 w-5 text-indigo-600 absolute animate-pulse" />
                      </div>
                      <p className="font-bold text-slate-800 text-base">Running Financial Variance Audit...</p>
                      <p className="text-xs font-semibold text-slate-400 max-w-sm text-center">Gemini is compiling your revenues, calculating expense deviations, and preparing actionable suggestions. (Deducts 5 AI credits)</p>
                    </div>
                  ) : activeBudget.aiInsight ? (
                    <div className="prose prose-indigo max-w-none text-slate-700 leading-relaxed font-medium">
                      <ReactMarkdown className="space-y-4 text-sm font-medium">
                        {activeBudget.aiInsight}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-center py-16 px-4 max-w-md mx-auto flex flex-col items-center gap-5">
                      <div className="bg-indigo-50 p-5 rounded-full text-indigo-600 shadow-inner">
                        <Sparkles className="h-12 w-12 animate-bounce" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900">Run AI Performance Audit</h4>
                        <p className="text-sm font-semibold text-slate-500 mt-1">
                          Analyze operational budget variances, pinpoint structural deviations, and get custom guidance for fee collection or expense trimming.
                        </p>
                      </div>
                      <Button
                        onClick={handleGenerateAIAnalysis}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-6 rounded-xl shadow-md w-full animate-pulse"
                      >
                        <Sparkles className="h-4 w-4 mr-2" /> Start AI Audit
                      </Button>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Costs 5 AI Credits</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Global CSS for report printing */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden !important; }
          #printable-variance-report, #printable-variance-report * { visibility: visible !important; }
          #printable-variance-report { 
            position: fixed !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 210mm !important; 
            height: auto !important; 
            margin: 0 !important; 
            padding: 40px !important; 
            border: none !important; 
            box-shadow: none !important; 
          }
        }
        .prose-indigo h1, .prose-indigo h2, .prose-indigo h3 {
          font-weight: 800;
          color: #0f172a;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .prose-indigo h1 { font-size: 1.25rem; }
        .prose-indigo h2 { font-size: 1.15rem; }
        .prose-indigo h3 { font-size: 1.05rem; }
        .prose-indigo p {
          margin-bottom: 0.875rem;
          line-height: 1.6;
          color: #334155;
        }
        .prose-indigo ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin-bottom: 1rem;
        }
        .prose-indigo li {
          margin-bottom: 0.375rem;
          color: #334155;
        }
        .prose-indigo strong {
          font-weight: 700;
          color: #0f172a;
        }
      `}</style>
    </div>
  );
}
