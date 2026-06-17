'use client';

import { useState, useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LibraryItem, libraryItemSchema } from '@/lib/types';
import { 
  Loader2, PlusCircle, BookCheck, AlertTriangle, Library as LibraryIcon, 
  Book, CheckCircle, BookOpen, Newspaper, 
  Film, FileText, Calendar, User, Clock, Search
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
import { useCurrentSchool } from '@/hooks/use-current-school';
import { cn } from '@/lib/utils';

// --- Form for adding new library items ---
function LibraryItemForm({ setOpen, schoolId }: { setOpen: (open: boolean) => void, schoolId: string }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof libraryItemSchema>>({
    resolver: zodResolver(libraryItemSchema),
    defaultValues: {
      name: '',
      category: 'Book',
      quantity: 1,
      location: '',
      author: '',
      isbn: '',
    },
  });

  async function onSubmit(values: z.infer<typeof libraryItemSchema>) {
    setIsSubmitting(true);
    try {
      const newItemRef = doc(collection(firestore!, 'library'));
      const dataToSave = {
        ...values,
        status: 'Available',
        createdAt: new Date(),
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
        <FormField control={form.control} name="isbn" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-black uppercase text-slate-400">ISBN</FormLabel>
            <FormControl><Input placeholder="e.g., 978-3-16-148410-0" {...field} className="h-11 rounded-xl border-2" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
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
              <FormLabel className="text-xs font-black uppercase text-slate-400">Location</FormLabel>
              <FormControl><Input placeholder="Shelf A-3" {...field} className="h-11 rounded-xl border-2" /></FormControl>
              <FormMessage />
            </FormItem>
            )} />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-2xl font-black uppercase tracking-tight shadow-md">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Item
        </Button>
      </form>
    </Form>
  );
}

// --- Stat Card Component ---
function StatCard({ title, value, icon: Icon, gradientClass }: { title: string; value: string | number; icon: React.ElementType; gradientClass: string }) {
    return (
      <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden relative group hover:shadow-lg transition-all duration-300">
        <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${gradientClass}`} />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</CardTitle>
          <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-slate-100 transition-colors">
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0">
          <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
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
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  const canManage = ['Librarian', 'Administrator', 'Director'].includes(role || '');
  const canBorrow = ['Student', 'Teacher'].includes(role || '');

  const libraryQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'library'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: libraryItems, isLoading: isLoadingItems } = useCollection<LibraryItem>(libraryQuery);

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

    if (!canManage) {
        items = items.filter(item => item.status === 'Available');
    }

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
  }, [libraryItems, filter, categoryFilter, canManage]);
  
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
      case 'Available': return <Badge className="bg-green-50 text-green-700 border-green-200 font-bold uppercase text-[9px]">Available</Badge>;
      case 'Requested': return <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold uppercase text-[9px]">Requested</Badge>;
      case 'Pending Return': return <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-bold uppercase text-[9px]">Pending Return</Badge>;
      case 'Borrowed': return <Badge className="bg-rose-50 text-rose-700 border-rose-200 font-bold uppercase text-[9px]">Borrowed</Badge>;
      default: return <Badge variant="secondary" className="font-bold uppercase text-[9px]">{status}</Badge>;
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
  }
  
  const handleMarkForReturn = (item: LibraryItem) => {
    if (!firestore) return;
    updateDocumentNonBlocking(doc(firestore, 'library', item.id), {
        status: 'Pending Return',
    });
    toast({ title: 'Return Initiated', description: `"${item.name}" is now pending return confirmation from the librarian.`});
  }
  
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
        await updateDocumentNonBlocking(doc(firestore, 'library', item.id), {
            status: 'Available',
            currentHolderId: '',
            currentHolderName: '',
            dueDate: null,
        });
        toast({ title: 'Return Confirmed', description: `"${item.name}" is now available in the catalog.` });
    } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to confirm return.' });
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2 italic uppercase">
                    <LibraryIcon className="h-8 w-8 text-indigo-600 animate-pulse" /> Library <span className="text-indigo-600">Portal</span>
                </h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Catalog, borrow, and manage library resources</p>
            </div>
            
            {canManage && schoolId && (
                <div className="flex gap-2">
                    <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={!schoolId} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 h-12 px-6 rounded-2xl font-black uppercase tracking-tight">
                                <PlusCircle className="mr-2 h-5 w-5" /> Add New Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-3xl border-0 shadow-2xl sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black uppercase text-slate-800 tracking-tight">Add to Catalog</DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Register a new library resource.</DialogDescription>
                            </DialogHeader>
                            {schoolId && <LibraryItemForm setOpen={setFormOpen} schoolId={schoolId} />}
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
        
        {canManage && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Items" value={libraryStats.total} icon={Book} gradientClass="from-blue-500 to-indigo-500" />
                <StatCard title="Available" value={libraryStats.available} icon={CheckCircle} gradientClass="from-emerald-500 to-teal-500" />
                <StatCard title="Borrowed" value={libraryStats.borrowed} icon={BookCheck} gradientClass="from-purple-500 to-indigo-500" />
                <StatCard title="Overdue" value={libraryStats.overdue} icon={AlertTriangle} gradientClass="from-rose-500 to-red-500" />
            </div>
        )}

        {canBorrow && myBorrowedItems.length > 0 && (
            <div className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">My Borrowed Items</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {myBorrowedItems.map(item => {
                        const daysLeft = getDaysRemaining(item.dueDate);
                        const isOverdue = daysLeft < 0;
                        const itemIcon = getItemIcon(item.category);
                        return (
                            <Card key={item.id} className="border-none shadow-md bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-all relative">
                                {isOverdue && <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider animate-pulse">Overdue</div>}
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className={cn("p-3 rounded-2xl", isOverdue ? "bg-rose-50 text-rose-500" : "bg-indigo-50 text-indigo-500")}>
                                            {itemIcon}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 uppercase tracking-tight line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-slate-400 font-bold uppercase">{item.author || 'Unknown Author'}</p>
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Due Date</p>
                                            <p className="font-bold text-slate-700 flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                {item.dueDate ? format(item.dueDate.toDate(), 'PP') : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Time Left</p>
                                            {isOverdue ? (
                                                <span className="text-xs font-black text-rose-600 uppercase">{Math.abs(daysLeft)} days overdue</span>
                                            ) : (
                                                <span className="text-xs font-black text-emerald-600 uppercase">{daysLeft} days left</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        {item.status === 'Borrowed' ? (
                                            <Button onClick={() => handleMarkForReturn(item)} className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black uppercase text-xs tracking-wider rounded-2xl h-10 transition-colors">
                                                Mark for Return
                                            </Button>
                                        ) : (
                                            <Badge className="w-full justify-center bg-amber-50 text-amber-700 border-amber-200 py-2 rounded-2xl font-black uppercase text-[10px] tracking-wider">
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
      
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
            <div className="bg-slate-50/50 border-b p-8">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <Tabs defaultValue="catalog" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                            <TabsList className="bg-slate-100 p-1 rounded-2xl h-12">
                                <TabsTrigger value="catalog" className="rounded-xl font-bold uppercase text-[11px] tracking-wider px-5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                                    Library Catalog
                                </TabsTrigger>
                                {canManage && (
                                    <TabsTrigger value="requests" className="rounded-xl font-bold uppercase text-[11px] tracking-wider px-5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                                        Pending Requests <Badge className="ml-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none font-black">{pendingRequests.length}</Badge>
                                    </TabsTrigger>
                                )}
                                {canManage && (
                                    <TabsTrigger value="borrowed" className="rounded-xl font-bold uppercase text-[11px] tracking-wider px-5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">
                                        Outstanding Checkouts <Badge className="ml-2 bg-violet-100 text-violet-700 hover:bg-violet-100 border-none font-black">{outstandingCheckouts.length}</Badge>
                                    </TabsTrigger>
                                )}
                            </TabsList>
                        </Tabs>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                placeholder="Search by title or author..." 
                                value={filter} 
                                onChange={e => setFilter(e.target.value)}
                                className="pl-9 h-11 bg-white border-2 rounded-xl"
                            />
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
                                                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
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
                {isLoading ? <div className='flex justify-center p-20'><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /></div> : 
                activeTab === 'catalog' ? (
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
                           {filteredItems.map(item => (
                               <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                   <TableCell>
                                       <div className="flex items-center gap-3">
                                           <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center">
                                               {getItemIcon(item.category)}
                                           </div>
                                           <div>
                                               <div className="font-black text-slate-800 uppercase tracking-tight">{item.name}</div>
                                               <div className="text-[10px] text-slate-400 font-bold uppercase">By {item.author || 'Unknown author'}</div>
                                           </div>
                                       </div>
                                   </TableCell>
                                   <TableCell>
                                       <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 font-bold uppercase text-[9px]">
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
                                       {canBorrow && item.status === 'Available' && (
                                           <Button size="sm" onClick={() => handleRequestBorrow(item)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider">
                                               Request Borrow
                                           </Button>
                                       )}
                                       {canManage && item.status === 'Pending Return' && (
                                           <Button size="sm" onClick={() => handleConfirmReturn(item)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider">
                                               Confirm Return
                                           </Button>
                                       )}
                                   </TableCell>
                               </TableRow>
                           ))}
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
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                                {getItemIcon(item.category)}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-800 uppercase tracking-tight">{item.name}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase">By {item.author || 'Unknown author'}</div>
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
                ) : (
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
                                                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", isOverdue ? "bg-rose-50 text-rose-500" : "bg-slate-50 text-slate-500")}>
                                                    {getItemIcon(item.category)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-800 uppercase tracking-tight">{item.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase">By {item.author || 'Unknown author'}</div>
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
                                                {item.dueDate ? format(item.dueDate.toDate(), 'PP') : 'N/A'}
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
                                            <Button 
                                                size="sm" 
                                                onClick={() => handleConfirmReturn(item)} 
                                                className="bg-indigo-600 hover:bg-emerald-600 text-white rounded-xl font-black uppercase text-[9px] tracking-widest h-9 px-4 transition-all"
                                            >
                                                {item.status === 'Pending Return' ? 'Confirm Return' : 'Return Book'}
                                            </Button>
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
                )}
            </CardContent>
        </Card>
    </div>
  );
}

