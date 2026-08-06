'use client';

import { useState, useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LibraryItem, libraryItemSchema, BookReview, ReadingLog } from '@/lib/types';
import { 
  Loader2, PlusCircle, BookCheck, AlertTriangle, Library as LibraryIcon, 
  Book, CheckCircle, BookOpen, Newspaper, 
  Film, FileText, Calendar, User, Clock, Search,
  LayoutGrid, List as ListIcon, Info, Sparkles, BookOpenCheck, ShieldAlert,
  QrCode, Scan, Star, MessageCircle, FileDown, Send, DollarSign
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, addDays, isPast } from 'date-fns';
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { triggerStudentBadgeEvent } from '@/lib/achievement-utils';
import { useCurrentSchool } from '@/hooks/use-current-school';

// --- Form Zod schema supporting HTML5 standard controls ---
const libraryFormSchema = z.object({
  name: z.string().min(1, "Item name is required."),
  category: z.enum(['Book', 'Magazine', 'DVD', 'Other']),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  location: z.string().min(1, "Location is required."),
  author: z.string().optional(),
  isbn: z.string().optional(),
  barcode: z.string().optional(),
  publisher: z.string().optional(),
  unitPrice: z.coerce.number().optional(),
  purchaseDate: z.string().optional(),
  dailyFineRate: z.coerce.number().optional(),
  digitalFileUrl: z.string().optional(),
  description: z.string().optional(),
});

// --- Form for adding new library items ---
function LibraryItemForm({ setOpen, schoolId }: { setOpen: (open: boolean) => void, schoolId: string }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof libraryFormSchema>>({
    resolver: zodResolver(libraryFormSchema),
    defaultValues: {
      name: '',
      category: 'Book',
      quantity: 1,
      location: '',
      author: '',
      isbn: '',
      publisher: '',
      unitPrice: undefined,
      purchaseDate: '',
    },
  });

  async function onSubmit(values: z.infer<typeof libraryFormSchema>) {
    setIsSubmitting(true);
    try {
      const newItemRef = doc(collection(firestore!, 'library'));
      const dataToSave = {
        ...values,
        status: 'Available',
        createdAt: new Date(),
        purchaseDate: values.purchaseDate ? new Date(values.purchaseDate) : null,
        unitPrice: values.unitPrice ? Number(values.unitPrice) : null,
        schoolId: schoolId, // SAAS STAMP
      };
      await setDocumentNonBlocking(newItemRef, dataToSave, {});
      toast({
        title: 'Item Added',
        description: `"${values.name}" has been added to the library catalog.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error adding library item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while adding the item.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-black uppercase text-slate-400">Name / Title</FormLabel>
            <FormControl><Input placeholder="e.g., The Great Gatsby" {...field} className="h-11 rounded-xl border-2" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="author" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-black uppercase text-slate-400">Author</FormLabel>
            <FormControl><Input placeholder="e.g., F. Scott Fitzgerald" {...field} className="h-11 rounded-xl border-2" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-3 gap-4">
          <FormField control={form.control} name="publisher" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase text-slate-400">Publisher</FormLabel>
              <FormControl><Input placeholder="e.g., Penguin Books" {...field} className="h-11 rounded-xl border-2" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="isbn" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase text-slate-400">ISBN</FormLabel>
              <FormControl><Input placeholder="e.g., 978-..." {...field} className="h-11 rounded-xl border-2" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="barcode" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase text-slate-400">Barcode / SKU</FormLabel>
              <FormControl><Input placeholder="e.g., BK-1002" {...field} className="h-11 rounded-xl border-2" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase text-slate-400">Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger className="h-11 rounded-xl border-2"><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Book">Book</SelectItem>
                  <SelectItem value="Magazine">Magazine</SelectItem>
                  <SelectItem value="DVD">DVD</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="quantity" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase text-slate-400">Quantity</FormLabel>
              <FormControl><Input type="number" {...field} className="h-11 rounded-xl border-2" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase text-slate-400">Location / Shelf</FormLabel>
              <FormControl><Input placeholder="e.g., Shelf A-3" {...field} className="h-11 rounded-xl border-2" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
          <FormField control={form.control} name="unitPrice" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase text-slate-400">Unit Price (GH₵)</FormLabel>
              <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} className="h-11 rounded-xl border-2" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="dailyFineRate" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase text-slate-400">Late Fine / Day (GH₵)</FormLabel>
              <FormControl><Input type="number" step="0.50" placeholder="1.00" {...field} className="h-11 rounded-xl border-2" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="purchaseDate" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase text-slate-400">Purchase Date</FormLabel>
              <FormControl><Input type="date" {...field} className="h-11 rounded-xl border-2" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="digitalFileUrl" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-black uppercase text-slate-400">Digital PDF / E-Book URL (Optional)</FormLabel>
            <FormControl><Input placeholder="e.g., https://.../guide.pdf" {...field} className="h-11 rounded-xl border-2" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-650 hover:bg-indigo-750 text-white h-12 rounded-xl font-black uppercase tracking-wider shadow-md shadow-indigo-100/50 mt-2">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Item to Catalog
        </Button>
      </form>
    </Form>
  );
}

// --- Stat Card Component ---
function StatCard({ title, value, icon: Icon, gradientClass, subtitle }: { title: string; value: string | number; icon: React.ElementType; gradientClass: string; subtitle?: string }) {
  return (
    <Card className="border border-slate-100 shadow-[0_10px_35px_-12px_rgba(0,0,0,0.02)] bg-white rounded-3xl overflow-hidden relative group hover:shadow-md transition-all duration-300 hover:scale-[1.02] border-b-4 border-b-slate-100/80">
      <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${gradientClass}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
        <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</CardTitle>
        <div className="p-2.5 rounded-xl bg-slate-50 text-slate-655 group-hover:scale-115 transition-transform shadow-inner border border-slate-100">
          <Icon className="h-4 w-4 text-indigo-600" />
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        <div className="text-3xl font-black text-slate-900 tracking-tight leading-none">{value}</div>
        {subtitle && <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider truncate">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

// --- Main Library Page ---
export default function LibraryPage() {
  const { role } = useRole();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isFormOpen, setFormOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('catalog');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [barcodeInput, setBarcodeInput] = useState('');
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  const canManage = ['Librarian', 'Administrator', 'Director'].includes(role || '');
  const canBorrow = ['Student', 'Teacher'].includes(role || '');

  const libraryQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'library'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: libraryItems, isLoading: isLoadingItems } = useCollection<LibraryItem>(libraryQuery);

  const reviewsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'book_reviews'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: bookReviews } = useCollection<BookReview>(reviewsQuery);

  const [isReviewOpen, setReviewOpen] = useState(false);
  const [selectedBookForReview, setSelectedBookForReview] = useState<LibraryItem | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !schoolId || !selectedBookForReview || !user || !reviewComment.trim()) return;
    setIsSubmittingReview(true);

    try {
      const reviewRef = doc(collection(firestore, 'book_reviews'));
      await setDocumentNonBlocking(reviewRef, {
        schoolId,
        bookId: selectedBookForReview.id,
        bookTitle: selectedBookForReview.name,
        studentId: user.uid,
        studentName: user.displayName || user.email || 'Student',
        rating: reviewRating,
        comment: reviewComment.trim(),
        createdAt: new Date()
      }, {});

      toast({
        title: 'Review Submitted',
        description: `Thank you for reviewing "${selectedBookForReview.name}"!`,
      });

      setReviewOpen(false);
      setReviewComment('');
      setSelectedBookForReview(null);
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to submit review.' });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const isLoading = isLoadingItems || isLoadingSchool;

  const libraryStats = useMemo(() => {
    if (!libraryItems) {
      return { total: 0, available: 0, borrowed: 0, overdue: 0 };
    }
    const total = libraryItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const available = libraryItems
      .filter(item => item.status === 'Available')
      .reduce((sum, item) => sum + (item.quantity || 0), 0);
    const borrowed = libraryItems
      .filter(item => item.status === 'Borrowed' || item.status === 'Pending Return')
      .reduce((sum, item) => sum + (item.quantity || 0), 0);
    const overdue = libraryItems.filter(item => item.status === 'Borrowed' && item.dueDate && isPast(item.dueDate.toDate())).length;

    return { total, available, borrowed, overdue };
  }, [libraryItems]);

  const categories = ['All', 'Book', 'Magazine', 'DVD', 'Other'];

  const filteredItems = useMemo(() => {
    if (!libraryItems) return [];
    let items = libraryItems;

    if (categoryFilter !== 'All') {
        items = items.filter(item => item.category === categoryFilter);
    }

    if (filter) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.author?.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return items;
  }, [libraryItems, filter, categoryFilter]);
  
  const myBorrowedItems = useMemo(() => {
      if (!user || !libraryItems) return [];
      return libraryItems.filter(item => item.currentHolderId === user.uid);
  }, [libraryItems, user]);
  
  const pendingRequests = useMemo(() => {
      if (!libraryItems) return [];
      return libraryItems.filter(item => item.status === 'Requested');
  }, [libraryItems]);

  const outstandingCheckouts = useMemo(() => {
      if (!libraryItems) return [];
      return libraryItems.filter(item => item.status === 'Borrowed' || item.status === 'Pending Return');
  }, [libraryItems]);

  const getDaysRemaining = (dueDate: any) => {
    if (!dueDate) return 0;
    const due = dueDate.toDate();
    const diffTime = due.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getItemIcon = (category: string) => {
    switch (category) {
      case 'Book': return <BookOpen className="h-4 w-4" />;
      case 'Magazine': return <Newspaper className="h-4 w-4" />;
      case 'DVD': return <Film className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available': return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-lg">Available</Badge>;
      case 'Requested': return <Badge className="bg-blue-50 text-blue-755 border border-blue-200/50 font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-lg">Requested</Badge>;
      case 'Pending Return': return <Badge className="bg-amber-50 text-amber-705 border border-amber-200/50 font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-lg">Pending Return</Badge>;
      case 'Borrowed': return <Badge className="bg-rose-55 text-rose-755 border border-rose-200/50 font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-lg">Borrowed</Badge>;
      default: return <Badge variant="secondary" className="font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-lg">{status}</Badge>;
    }
  };

  const handleRequestBorrow = (item: LibraryItem) => {
    if (!user || !firestore) return;
    if (myBorrowedItems.some(i => i.dueDate && new Date(i.dueDate.toDate()) < new Date())) {
        toast({ variant: 'destructive', title: 'Overdue Item', description: 'You cannot borrow new items while you have an overdue item.' });
        return;
    }
    updateDocumentNonBlocking(doc(firestore, 'library', item.id), {
        status: 'Requested',
        currentHolderId: user.uid,
        currentHolderName: user.displayName || user.email,
    });
    toast({ title: 'Request Sent', description: `Your request to borrow "${item.name}" has been sent for approval.`});
  };
  
  const handleMarkForReturn = (item: LibraryItem) => {
    if (!firestore) return;
    updateDocumentNonBlocking(doc(firestore, 'library', item.id), {
        status: 'Pending Return',
    });
    toast({ title: 'Return Initiated', description: `"${item.name}" is now pending return confirmation from the librarian.`});
  };
  
  const handleApproveRequest = async (item: LibraryItem) => {
    if (!firestore) return;
    const dueDate = addDays(new Date(), 14); // Set due date to 14 days from now
    try {
        await updateDocumentNonBlocking(doc(firestore, 'library', item.id), {
            status: 'Borrowed',
            dueDate: dueDate,
        });
        toast({ title: "Approved", description: `${item.name} has been issued.`});
    } catch(e) {
        toast({ variant: 'destructive', title: "Error", description: "Failed to approve request." });
    }
  };

  const handleRejectRequest = async (item: LibraryItem) => {
    if (!firestore) return;
    try {
        await updateDocumentNonBlocking(doc(firestore, 'library', item.id), {
            status: 'Available',
            currentHolderId: '',
            currentHolderName: ''
        });
        toast({ title: "Rejected", description: `Request for ${item.name} has been rejected.`});
    } catch(e) {
        toast({ variant: 'destructive', title: "Error", description: "Failed to reject request." });
    }
  };

  const handleConfirmReturn = async (item: LibraryItem) => {
    if (!firestore) return;
    try {
        const studentHolderId = item.currentHolderId;
        await updateDocumentNonBlocking(doc(firestore, 'library', item.id), {
            status: 'Available',
            currentHolderId: '',
            currentHolderName: '',
            dueDate: null,
        });

        if (studentHolderId) {
            triggerStudentBadgeEvent(firestore, studentHolderId, { type: 'LIBRARY_BOOK_RETURNED' });
        }

        toast({ title: 'Return Confirmed', description: `"${item.name}" is now available in the catalog.` });
    } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to confirm return.' });
    }
  };

  const handleSyncOverdueFineToLedger = async (item: LibraryItem) => {
    if (!firestore || !schoolId || !item.currentHolderId) return;
    const daysOverdue = Math.max(1, Math.abs(getDaysRemaining(item.dueDate)));
    const fineRate = item.dailyFineRate || 1.00;
    const fineAmount = Number((daysOverdue * fineRate).toFixed(2));

    try {
      const fineRef = doc(collection(firestore, 'financialRecords'));
      await setDocumentNonBlocking(fineRef, {
        schoolId,
        studentId: item.currentHolderId,
        studentName: item.currentHolderName || 'Student',
        feeType: 'Library Overdue Fine',
        description: `Overdue Library Fine (${daysOverdue} days) - ${item.name}`,
        billedAmount: fineAmount,
        amountPaid: 0,
        waiverAmount: 0,
        dueDate: new Date(),
        status: 'Unpaid',
        createdAt: new Date()
      }, {});

      toast({
        title: 'Overdue Fine Posted',
        description: `GH₵ ${fineAmount.toFixed(2)} fine posted to ${item.currentHolderName || 'student'}'s ledger.`,
      });
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to post fine to billing ledger.' });
    }
  };

  const handleSendOverdueReminderWhatsApp = (item: LibraryItem) => {
    const daysOverdue = Math.max(1, Math.abs(getDaysRemaining(item.dueDate)));
    const fineRate = item.dailyFineRate || 1.00;
    const fineAmount = (daysOverdue * fineRate).toFixed(2);
    
    const message = `Hello Parent/Guardian, this is an overdue library notice. The book "${item.name}" borrowed by ${item.currentHolderName || 'your ward'} is ${daysOverdue} days overdue. Current fine accumulator: GH₵ ${fineAmount}. Please return the book to the library promptly. Thank you!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
        {/* Premium Gradient Header Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-indigo-955 to-purple-955 p-8 md:p-12 text-white shadow-2xl border border-white/10 group">
            <div className="absolute right-[-40px] bottom-[-40px] opacity-10 text-white transition-transform duration-700 group-hover:scale-110 pointer-events-none">
                <LibraryIcon className="h-60 w-60 animate-pulse" />
            </div>
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-indigo-300 backdrop-blur-md border border-white/5">
                        <BookOpenCheck className="h-3 w-3 text-indigo-400" /> Catalog Indexer
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 uppercase italic leading-none">
                        Library <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">Portal</span> Hub 📚
                    </h1>
                    <p className="text-slate-300 text-sm font-medium max-w-xl">
                        Search the entire school resource index, request book issues, check shelf catalog locations, and manage pending returns.
                    </p>
                </div>

                {canManage && schoolId && (
                    <div className="shrink-0">
                        <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                            <DialogTrigger asChild>
                                <Button disabled={!schoolId} className="bg-gradient-to-r from-indigo-500 to-purple-650 hover:from-indigo-600 hover:to-purple-750 text-white font-black rounded-xl text-xs uppercase h-12 px-6 shadow-lg shadow-indigo-500/10 transition-all border border-indigo-400/20">
                                    <PlusCircle className="mr-2 h-5 w-5" /> Add New Item
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-[2.2rem] border-0 shadow-2xl p-6 sm:max-w-lg bg-white">
                                <DialogHeader className="mb-4">
                                    <DialogTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
                                        <Book className="h-5 w-5 text-indigo-600 animate-bounce" /> Add catalog item
                                    </DialogTitle>
                                    <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Register a new library resource in the school index.</DialogDescription>
                                </DialogHeader>
                                {schoolId && <LibraryItemForm setOpen={setFormOpen} schoolId={schoolId} />}
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>
        </div>
        
        {/* KPI Stats Grid */}
        {canManage && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Items" value={libraryStats.total} icon={Book} gradientClass="from-blue-500 to-indigo-500" subtitle="Total stock quantity" />
                <StatCard title="Available" value={libraryStats.available} icon={CheckCircle} gradientClass="from-emerald-500 to-teal-500" subtitle="Ready for checkouts" />
                <StatCard title="Borrowed" value={libraryStats.borrowed} icon={BookCheck} gradientClass="from-purple-500 to-indigo-500" subtitle="Issued to readers" />
                <StatCard title="Overdue" value={libraryStats.overdue} icon={AlertTriangle} gradientClass="from-rose-500 to-red-500" subtitle="Overdue return dates" />
            </div>
        )}

        {/* Borrower Personal Deck */}
        {canBorrow && myBorrowedItems.length > 0 && (
            <div className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <BookCheck className="h-4 w-4 text-indigo-600" /> My Borrowed Items
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {myBorrowedItems.map(item => {
                        const daysLeft = getDaysRemaining(item.dueDate);
                        const isOverdue = daysLeft < 0;
                        const itemIcon = getItemIcon(item.category);
                        return (
                            <Card key={item.id} className="border border-slate-100 shadow-md bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-all relative">
                                {isOverdue && (
                                    <div className="absolute top-0 right-0 bg-rose-600 text-white text-[8px] font-black uppercase px-3.5 py-1.5 rounded-bl-2xl tracking-wider animate-pulse">
                                        Overdue
                                    </div>
                                )}
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className={cn("p-3 rounded-2xl shrink-0 shadow-inner border", isOverdue ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-indigo-50 text-indigo-600 border-indigo-100")}>
                                            {itemIcon}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-black text-slate-800 uppercase tracking-tight line-clamp-1 text-sm">{item.name}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">By {item.author || 'Unknown Author'}</p>
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-50 pt-3.5 flex items-center justify-between text-xs">
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Due Date</p>
                                            <p className="font-bold text-slate-750 flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                {item.dueDate ? format(item.dueDate.toDate(), 'dd MMM yyyy') : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-right space-y-0.5">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Time Left</p>
                                            {isOverdue ? (
                                                <span className="text-xs font-black text-rose-600 uppercase flex items-center gap-0.5 justify-end">
                                                    <ShieldAlert className="h-3.5 w-3.5" /> {Math.abs(daysLeft)} days late
                                                </span>
                                            ) : (
                                                <span className="text-xs font-black text-emerald-600 uppercase">{daysLeft} days left</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-1">
                                        {item.status === 'Borrowed' ? (
                                            <Button onClick={() => handleMarkForReturn(item)} className="w-full bg-slate-800 hover:bg-indigo-600 text-white font-black uppercase text-xs tracking-wider rounded-xl h-11 transition-all">
                                                Mark for Return
                                            </Button>
                                        ) : (
                                            <Badge className="w-full justify-center bg-amber-50 text-amber-705 border border-amber-250 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest animate-pulse">
                                                Pending Librarian Check-In
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        )}
      
        {/* Main Tabbed Operations Panel */}
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden border-b-8 border-b-slate-100">
            <div className="bg-slate-50/50 border-b p-8">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <Tabs defaultValue="catalog" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                            <TabsList className="bg-slate-100 p-1 rounded-2xl h-12">
                                <TabsTrigger value="catalog" className="rounded-xl font-bold uppercase text-[11px] tracking-wider px-5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                                    Library Catalog
                                </TabsTrigger>
                                {canManage && (
                                    <TabsTrigger value="requests" className="rounded-xl font-bold uppercase text-[11px] tracking-wider px-5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                                        Pending Requests <Badge className="ml-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none font-black">{pendingRequests.length}</Badge>
                                    </TabsTrigger>
                                )}
                                {canManage && (
                                    <TabsTrigger value="borrowed" className="rounded-xl font-bold uppercase text-[11px] tracking-wider px-5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                                        Outstanding Checkouts <Badge className="ml-2 bg-purple-105 text-purple-700 hover:bg-purple-105 border-none font-black">{outstandingCheckouts.length}</Badge>
                                    </TabsTrigger>
                                )}
                                {canManage && (
                                    <TabsTrigger value="scanner" className="rounded-xl font-bold uppercase text-[11px] tracking-wider px-5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm flex items-center gap-1.5">
                                        <QrCode className="h-3.5 w-3.5 text-indigo-600" /> Barcode Station
                                    </TabsTrigger>
                                )}
                                <TabsTrigger value="digital" className="rounded-xl font-bold uppercase text-[11px] tracking-wider px-5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm flex items-center gap-1.5">
                                    <FileDown className="h-3.5 w-3.5 text-emerald-600" /> Digital E-Books
                                </TabsTrigger>
                                <TabsTrigger value="reviews" className="rounded-xl font-bold uppercase text-[11px] tracking-wider px-5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm flex items-center gap-1.5">
                                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> Reading Hub & Reviews
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* Search & Layout Toggles */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80 md:flex-initial">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input 
                                    placeholder="Search by title or author..." 
                                    value={filter} 
                                    onChange={e => setFilter(e.target.value)}
                                    className="pl-9 h-11 bg-white border-2 rounded-xl focus-visible:ring-indigo-500 shadow-sm"
                                />
                            </div>
                            
                            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-2xl h-11 border border-slate-200/50">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        "h-9 px-3 rounded-xl transition-all flex items-center gap-1.5 text-xs font-black uppercase tracking-wider",
                                        viewMode === 'grid' 
                                            ? "bg-white text-slate-900 shadow-sm border border-slate-200/30" 
                                            : "text-slate-400 hover:text-slate-655"
                                    )}
                                    title="Bookshelf Grid"
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={cn(
                                        "h-9 px-3 rounded-xl transition-all flex items-center gap-1.5 text-xs font-black uppercase tracking-wider",
                                        viewMode === 'table' 
                                            ? "bg-white text-slate-900 shadow-sm border border-slate-200/30" 
                                            : "text-slate-400 hover:text-slate-655"
                                    )}
                                    title="Table View"
                                >
                                    <ListIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {activeTab === 'catalog' && (
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => {
                                const active = categoryFilter === cat;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setCategoryFilter(cat)}
                                        className={cn(
                                            "h-9 px-4 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all flex items-center gap-1.5",
                                            active 
                                                ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                                                : "bg-white border-slate-200 text-slate-500 hover:border-slate-350"
                                        )}
                                    >
                                        {cat === 'All' && <LibraryIcon className="h-3.5 w-3.5" />}
                                        {cat === 'Book' && <BookOpen className="h-3.5 w-3.5" />}
                                        {cat === 'Magazine' && <Newspaper className="h-3.5 w-3.5" />}
                                        {cat === 'DVD' && <Film className="h-3.5 w-3.5" />}
                                        {cat === 'Other' && <FileText className="h-3.5 w-3.5" />}
                                        {cat === 'All' ? 'All Resources' : `${cat}s`}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <CardContent className="p-0">
                {isLoading ? (
                    <div className='flex justify-center p-24'><Loader2 className="h-10 w-10 animate-spin text-indigo-650" /></div>
                ) : activeTab === 'catalog' ? (
                     viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                            {filteredItems.map(item => {
                                const isAvailable = item.status === 'Available';
                                const isRequested = item.status === 'Requested';
                                const isBorrowed = item.status === 'Borrowed';
                                const isPendingReturn = item.status === 'Pending Return';
                                
                                const getCoverGradient = (category: string) => {
                                    switch (category) {
                                        case 'Book': return 'from-indigo-950 via-slate-900 to-indigo-900 text-indigo-50';
                                        case 'Magazine': return 'from-teal-955 via-slate-900 to-teal-900 text-teal-50';
                                        case 'DVD': return 'from-amber-955 via-slate-900 to-amber-900 text-amber-50';
                                        default: return 'from-slate-800 to-slate-950 text-slate-50';
                                    }
                                };

                                const getCoverAccent = (category: string) => {
                                    switch (category) {
                                        case 'Book': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
                                        case 'Magazine': return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
                                        case 'DVD': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                                        default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
                                    }
                                };

                                return (
                                    <Card key={item.id} className="rounded-[2.2rem] border border-slate-100 shadow-md overflow-hidden bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group flex flex-col h-full border-b-[6px] border-b-slate-105">
                                        <div className={cn("h-36 bg-gradient-to-br flex flex-col justify-between p-6 relative overflow-hidden shrink-0", getCoverGradient(item.category))}>
                                            <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.04] pointer-events-none group-hover:scale-110 transition-transform duration-500">
                                                <BookOpen className="h-36 w-36" />
                                            </div>
                                            <div className="absolute top-[-10%] left-[-10%] w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                                            <div className="flex justify-between items-start gap-2 relative z-10">
                                                <span className={cn("text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border", getCoverAccent(item.category))}>
                                                    {item.category}
                                                </span>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                                                    {item.location || 'Shelf N/A'}
                                                </span>
                                            </div>

                                            <div className="space-y-1 relative z-10">
                                                <h4 className="font-black text-sm uppercase tracking-tight line-clamp-2 leading-none uppercase italic text-white group-hover:text-indigo-200 transition-colors">{item.name}</h4>
                                                <p className="text-[10px] opacity-70 font-bold uppercase tracking-wider truncate">By {item.author || 'Unknown Author'}</p>
                                            </div>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                                            <div className="space-y-3.5 text-xs">
                                                <div className="flex justify-between items-center text-[9px] text-slate-400 font-black uppercase tracking-widest">
                                                    <span>Availability Status</span>
                                                    <span>Copies</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div>{getStatusBadge(item.status)}</div>
                                                    <Badge className="font-extrabold bg-slate-100 hover:bg-slate-100 text-slate-700 border-none px-2.5 py-0.5 rounded-lg text-xs">{item.quantity || 1}</Badge>
                                                </div>

                                                <div className="border-t border-slate-100 pt-3.5 space-y-2.5">
                                                    {item.isbn && (
                                                        <div className="flex justify-between items-center text-slate-500">
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">ISBN:</span>
                                                            <span className="font-mono text-[10px] font-semibold text-slate-655">{item.isbn}</span>
                                                        </div>
                                                    )}
                                                    {item.publisher && (
                                                        <div className="flex justify-between items-center text-slate-500">
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Publisher:</span>
                                                            <span className="text-[11px] font-bold text-slate-600 truncate max-w-[150px]">{item.publisher}</span>
                                                        </div>
                                                    )}
                                                    {item.unitPrice !== undefined && item.unitPrice > 0 && (
                                                        <div className="flex justify-between items-center text-slate-500">
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Value:</span>
                                                            <span className="text-[11px] font-extrabold text-slate-800">GH₵ {Number(item.unitPrice).toFixed(2)}</span>
                                                        </div>
                                                    )}
                                                    {!isAvailable && item.currentHolderName && (
                                                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 mt-1 flex flex-col gap-1 text-[9px]">
                                                            <div className="flex items-center gap-1 text-slate-400 font-black uppercase tracking-wider">
                                                                <User className="h-3 w-3" /> Holder
                                                            </div>
                                                            <div className="font-black text-slate-700 uppercase tracking-tight truncate">{item.currentHolderName}</div>
                                                            {item.dueDate && (
                                                                <div className="text-slate-450 font-bold flex items-center gap-1 uppercase tracking-wider text-[8px] pt-0.5">
                                                                    <Calendar className="h-2.5 w-2.5" /> Due: {format(item.dueDate.toDate(), 'dd MMM yyyy')}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-slate-100/50">
                                                {canBorrow && isAvailable && (
                                                    <Button size="sm" onClick={() => handleRequestBorrow(item)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider h-10 transition-all shadow-sm">
                                                        Request Borrow
                                                    </Button>
                                                )}
                                                {canBorrow && !isAvailable && (
                                                    <Button size="sm" disabled className="w-full bg-slate-150 text-slate-450 border border-slate-200/55 rounded-xl font-black uppercase text-[10px] tracking-wider h-10 pointer-events-none">
                                                        {isRequested ? 'Requested' : 'Checked Out'}
                                                    </Button>
                                                )}
                                                {canManage && isPendingReturn && (
                                                    <Button size="sm" onClick={() => handleConfirmReturn(item)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider h-10 transition-all shadow-sm">
                                                        Confirm Return
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                            {filteredItems.length === 0 && (
                                <div className="col-span-full py-20 text-center text-slate-400 bg-white border border-dashed border-slate-200 rounded-[2.2rem]">
                                    <Book className="h-16 w-16 mx-auto mb-4 opacity-10" />
                                    <p className="font-bold text-xs uppercase tracking-widest">No matching catalog items</p>
                                </div>
                            )}
                        </div>
                     ) : (
                        <Table className="border-t border-slate-100">
                            <TableHeader>
                                <TableRow className="bg-slate-50/50">
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">Resource Details</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">Classification</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">Location</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                                    <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                               {filteredItems.map(item => {
                                   const isAvailable = item.status === 'Available';
                                   const isRequested = item.status === 'Requested';
                                   
                                   return (
                                       <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                           <TableCell>
                                               <div className="flex items-center gap-3">
                                                   <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-505 flex items-center justify-center border border-slate-100">
                                                       {getItemIcon(item.category)}
                                                   </div>
                                                   <div>
                                                       <div className="font-black text-slate-800 uppercase tracking-tight">{item.name}</div>
                                                       <div className="text-[10px] text-slate-400 font-bold uppercase">By {item.author || 'Unknown Author'}</div>
                                                   </div>
                                               </div>
                                           </TableCell>
                                           <TableCell>
                                               <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 font-bold uppercase text-[9px] rounded-lg px-2.5">
                                                   {item.category}
                                               </Badge>
                                           </TableCell>
                                           <TableCell className="text-xs font-medium text-slate-500 italic">
                                               {item.location || 'Not Specified'}
                                           </TableCell>
                                           <TableCell>
                                               {getStatusBadge(item.status)}
                                               {item.status !== 'Available' && item.currentHolderName && (
                                                   <div className="text-[9px] font-bold text-slate-500 mt-1 uppercase flex items-center gap-1">
                                                       <User className="h-2.5 w-2.5" /> {item.currentHolderName}
                                                   </div>
                                               )}
                                           </TableCell>
                                           <TableCell className="text-right">
                                               {canBorrow && isAvailable && (
                                                   <Button size="sm" onClick={() => handleRequestBorrow(item)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider">
                                                       Request Borrow
                                                   </Button>
                                               )}
                                               {canBorrow && !isAvailable && (
                                                   <Badge variant="outline" className="text-slate-450 border-slate-200 font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-lg">
                                                       {isRequested ? 'Requested' : 'Checked Out'}
                                                   </Badge>
                                               )}
                                               {canManage && item.status === 'Pending Return' && (
                                                   <Button size="sm" onClick={() => handleConfirmReturn(item)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider">
                                                       Confirm Return
                                                   </Button>
                                               )}
                                           </TableCell>
                                       </TableRow>
                                   );
                               })}
                               {filteredItems.length === 0 && (
                                   <TableRow>
                                       <TableCell colSpan={5} className="py-20 text-center text-slate-400">
                                           <Book className="h-16 w-16 mx-auto mb-4 opacity-10" />
                                           <p className="font-bold text-xs uppercase tracking-widest">No matching catalog items</p>
                                       </TableCell>
                                   </TableRow>
                               )}
                            </TableBody>
                        </Table>
                     )
                ) : activeTab === 'requests' ? (
                    <Table className="border-t border-slate-100">
                        <TableHeader>
                            <TableRow className="bg-slate-50/50">
                                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Resource</TableHead>
                                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Requested By</TableHead>
                                <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingRequests.map(item => (
                                <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                                {getItemIcon(item.category)}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-800 uppercase tracking-tight">{item.name}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase">By {item.author || 'Unknown Author'}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5 text-slate-400" />
                                            {item.currentHolderName || 'N/A'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="sm" onClick={() => handleApproveRequest(item)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider">
                                            Approve
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleRejectRequest(item)} className="rounded-xl font-bold uppercase text-[10px] tracking-wider">
                                            Reject
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {pendingRequests.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="py-20 text-center text-slate-400">
                                        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-emerald-500 opacity-20" />
                                        <p className="font-bold text-xs uppercase tracking-widest">No pending borrow requests</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                ) : activeTab === 'borrowed' ? (
                    <Table className="border-t border-slate-100">
                        <TableHeader>
                            <TableRow className="bg-slate-50/50">
                                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Resource Details</TableHead>
                                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Borrowed By</TableHead>
                                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Due Date</TableHead>
                                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Status / Remaining</TableHead>
                                <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {outstandingCheckouts.map(item => {
                                const daysLeft = getDaysRemaining(item.dueDate);
                                const isOverdue = daysLeft < 0;
                                return (
                                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border", isOverdue ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-500 border-slate-100")}>
                                                    {getItemIcon(item.category)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-800 uppercase tracking-tight">{item.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">By {item.author || 'Unknown Author'}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                                                <User className="h-3.5 w-3.5 text-slate-400" />
                                                {item.currentHolderName || 'N/A'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs font-bold text-slate-600 flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                {item.dueDate ? format(item.dueDate.toDate(), 'dd MMM yyyy') : 'N/A'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                {getStatusBadge(item.status)}
                                                {isOverdue ? (
                                                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-wide flex items-center gap-1 animate-pulse">
                                                        <AlertTriangle className="h-3 w-3" /> {Math.abs(daysLeft)} Days Overdue
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wide flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> {daysLeft} Days Remaining
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {isOverdue && canManage && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleSyncOverdueFineToLedger(item)}
                                                            className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 rounded-xl font-bold uppercase text-[9px] h-9 px-3 gap-1"
                                                            title="Post Overdue Fine to Student Billing Ledger"
                                                        >
                                                            <DollarSign className="h-3 w-3" /> Post Fine
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleSendOverdueReminderWhatsApp(item)}
                                                            className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 rounded-xl font-bold uppercase text-[9px] h-9 px-3 gap-1"
                                                            title="Send Parent WhatsApp Overdue Reminder"
                                                        >
                                                            <Send className="h-3 w-3" /> Remind Parent
                                                        </Button>
                                                    </>
                                                )}
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => handleConfirmReturn(item)} 
                                                    className="bg-slate-800 hover:bg-emerald-600 text-white rounded-xl font-black uppercase text-[9px] tracking-widest h-9 px-4 transition-all"
                                                >
                                                    {item.status === 'Pending Return' ? 'Confirm Return' : 'Return Book'}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {outstandingCheckouts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-20 text-center text-slate-400">
                                        <BookCheck className="h-16 w-16 mx-auto mb-4 text-emerald-500 opacity-20" />
                                        <p className="font-bold text-xs uppercase tracking-widest">No outstanding checkouts</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                ) : activeTab === 'scanner' ? (
                    <div className="p-8 space-y-6 max-w-3xl mx-auto">
                        <div className="text-center space-y-2">
                            <div className="inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-3xl mb-2">
                                <Scan className="h-10 w-10 animate-pulse" />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Barcode & QR Circulation Station</h3>
                            <p className="text-xs text-slate-500 font-medium">Scan or type ISBN / Barcode SKU to perform instant 2-second book checkouts and stock returns.</p>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-3xl space-y-4">
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <QrCode className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input 
                                        placeholder="Scan or type barcode (e.g. BK-1002 or 978-3-16...)..." 
                                        value={barcodeInput}
                                        onChange={e => setBarcodeInput(e.target.value)}
                                        className="pl-11 h-12 rounded-2xl border-2 text-sm font-bold bg-white focus-visible:ring-indigo-600"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {barcodeInput.trim() && (
                                <div className="space-y-3 pt-2">
                                    {(() => {
                                        const matchedItem = libraryItems?.find(item => 
                                            item.barcode?.toLowerCase() === barcodeInput.trim().toLowerCase() ||
                                            item.isbn?.toLowerCase() === barcodeInput.trim().toLowerCase() ||
                                            item.name.toLowerCase().includes(barcodeInput.trim().toLowerCase())
                                        );

                                        if (!matchedItem) {
                                            return (
                                                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center text-xs font-bold text-amber-800 uppercase">
                                                    No item matching barcode "{barcodeInput}" found in catalog.
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                                                <div className="space-y-1">
                                                    <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold uppercase text-[9px] px-2.5 py-0.5">
                                                        {matchedItem.category} • {matchedItem.location}
                                                    </Badge>
                                                    <h4 className="font-black text-slate-900 text-base">{matchedItem.name}</h4>
                                                    <p className="text-xs text-slate-500 font-bold">Author: {matchedItem.author || 'N/A'} | Status: {matchedItem.status}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {matchedItem.status === 'Available' ? (
                                                        <Button 
                                                            onClick={() => {
                                                                handleRequestBorrow(matchedItem);
                                                                setBarcodeInput('');
                                                            }}
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs rounded-xl h-11 px-5"
                                                        >
                                                            Instant Borrow Issue
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            onClick={() => {
                                                                handleConfirmReturn(matchedItem);
                                                                setBarcodeInput('');
                                                            }}
                                                            className="bg-slate-900 hover:bg-emerald-600 text-white font-black uppercase text-xs rounded-xl h-11 px-5"
                                                        >
                                                            Instant Restock Return
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeTab === 'digital' ? (
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between border-b pb-4">
                            <div>
                                <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                    <FileDown className="h-5 w-5 text-emerald-600" /> Digital E-Books & Study Repository
                                </h3>
                                <p className="text-xs text-slate-500 font-medium">Access PDF study guides, revision past papers, and digital e-books 24/7.</p>
                            </div>
                            <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 font-black text-xs px-3 py-1">
                                {libraryItems?.filter(i => i.digitalFileUrl).length || 0} Digital Resources
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {libraryItems?.filter(i => i.digitalFileUrl).map(item => (
                                <Card key={item.id} className="border border-slate-100 shadow-md bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-all p-6 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0 border border-emerald-100">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <Badge className="bg-slate-100 text-slate-700 font-bold uppercase text-[9px] mb-1">
                                                {item.category}
                                            </Badge>
                                            <h4 className="font-black text-slate-900 text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">By {item.author || 'School Faculty'}</p>
                                        </div>
                                    </div>
                                    <Button 
                                        asChild
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs rounded-xl h-11 gap-2"
                                    >
                                        <a href={item.digitalFileUrl} target="_blank" rel="noopener noreferrer">
                                            <FileDown className="h-4 w-4" /> Download / Open PDF
                                        </a>
                                    </Button>
                                </Card>
                            ))}

                            {(libraryItems?.filter(i => i.digitalFileUrl).length === 0) && (
                                <div className="col-span-full py-16 text-center text-slate-400 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-30 text-slate-400" />
                                    <p className="font-extrabold text-xs uppercase tracking-widest">No digital PDF e-books uploaded yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : activeTab === 'reviews' ? (
                    <div className="p-8 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                            <div>
                                <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" /> Student Reading Hub & Peer Book Reviews
                                </h3>
                                <p className="text-xs text-slate-500 font-medium">Discover top-rated books, read peer reviews, and track school-wide reading streaks.</p>
                            </div>
                            <Badge className="bg-amber-50 text-amber-800 border-amber-200 font-black text-xs px-3 py-1.5 self-start md:self-auto rounded-xl">
                                ⭐ 4.8 / 5.0 Average School Book Rating
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Student Reading Streak Spotlight */}
                            <Card className="p-6 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl space-y-4 shadow-xl border border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                                        <Sparkles className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase text-indigo-300 tracking-wider">Reading Habit Streak</span>
                                        <h4 className="text-lg font-black uppercase tracking-tight">Active Scholar Readers</h4>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-indigo-200">Term Reading Goal:</span>
                                        <span className="text-amber-400 font-mono">150 / 200 Books</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                        <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full w-[75%]" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-indigo-200 font-medium">Returning books unlocks XP, levels up your avatar, and earns reading badges on the student leaderboard!</p>
                            </Card>

                            {/* Book Ratings List */}
                            <div className="md:col-span-2 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Recent Peer Book Reviews</h4>
                                    {canBorrow && libraryItems && libraryItems.length > 0 && (
                                        <Dialog open={isReviewOpen} onOpenChange={setReviewOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl h-8 px-3 gap-1">
                                                    <Star className="h-3.5 w-3.5 fill-white" /> Submit Book Review
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[450px]">
                                                <DialogHeader>
                                                    <DialogTitle className="text-base font-black uppercase">Submit Book Review</DialogTitle>
                                                    <DialogDescription className="text-xs">Share your thoughts on a book you read to inspire your peers.</DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-black uppercase text-slate-400">Select Book</label>
                                                        <Select onValueChange={(val) => {
                                                            const found = libraryItems?.find(i => i.id === val);
                                                            if (found) setSelectedBookForReview(found);
                                                        }}>
                                                            <SelectTrigger className="h-11 rounded-xl border-2">
                                                                <SelectValue placeholder="Choose a book..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {libraryItems?.map(b => (
                                                                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="text-xs font-black uppercase text-slate-400">Rating (1 - 5 Stars)</label>
                                                        <div className="flex items-center gap-2">
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <button
                                                                    key={star}
                                                                    type="button"
                                                                    onClick={() => setReviewRating(star)}
                                                                    className="p-1 text-amber-500 hover:scale-110 transition-transform"
                                                                >
                                                                    <Star className={cn("h-6 w-6", star <= reviewRating ? "fill-amber-500" : "text-slate-300")} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="text-xs font-black uppercase text-slate-400">Your Review / Summary</label>
                                                        <Input 
                                                            placeholder="What did you learn or enjoy about this book?"
                                                            value={reviewComment}
                                                            onChange={e => setReviewComment(e.target.value)}
                                                            className="h-12 rounded-xl border-2"
                                                        />
                                                    </div>

                                                    <Button type="submit" disabled={isSubmittingReview || !selectedBookForReview || !reviewComment.trim()} className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black uppercase h-11 rounded-xl">
                                                        {isSubmittingReview ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Post Review
                                                    </Button>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>

                                {bookReviews && bookReviews.length > 0 ? (
                                    <div className="space-y-3">
                                        {bookReviews.map(rev => (
                                            <div key={rev.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 hover:bg-slate-50 transition-colors">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-extrabold text-slate-900 text-sm">{rev.bookTitle}</span>
                                                    <div className="flex items-center gap-1">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star key={i} className={cn("h-3.5 w-3.5", i < rev.rating ? "text-amber-500 fill-amber-500" : "text-slate-300")} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                                                <span className="text-[10px] font-bold text-indigo-600 block uppercase">— {rev.studentName}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl space-y-2">
                                        <Star className="h-10 w-10 mx-auto text-amber-400 opacity-40" />
                                        <h5 className="font-black text-slate-800 text-sm uppercase">No Peer Book Reviews Submitted Yet</h5>
                                        <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">Encourage your enrolled students to review their borrowed books upon return to build the school's reading culture!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    </div>
  );
}
