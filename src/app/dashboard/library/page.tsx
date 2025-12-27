
'use client';

import { useState, useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, writeBatch, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LibraryItem, libraryItemSchema } from '@/lib/types';
import { Loader2, PlusCircle, BookCheck, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, addDays } from 'date-fns';
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';


// --- Form for adding new library items ---
function LibraryItemForm({ setOpen }: { setOpen: (open: boolean) => void }) {
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
      const newItemRef = doc(collection(firestore, 'library'));
      const dataToSave = {
        ...values,
        status: 'Available',
        createdAt: new Date(),
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
          <FormItem><FormLabel>Name/Title</FormLabel><FormControl><Input placeholder="e.g., The Great Gatsby" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="author" render={({ field }) => (
          <FormItem><FormLabel>Author</FormLabel><FormControl><Input placeholder="e.g., F. Scott Fitzgerald" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
         <FormField control={form.control} name="isbn" render={({ field }) => (
          <FormItem><FormLabel>ISBN</FormLabel><FormControl><Input placeholder="e.g., 978-3-16-148410-0" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-3 gap-4">
            <FormField control={form.control} name="category" render={({ field }) => (
            <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Book">Book</SelectItem><SelectItem value="Magazine">Magazine</SelectItem><SelectItem value="DVD">DVD</SelectItem></SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="quantity" render={({ field }) => (
            <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Shelf A-3" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Add Item
        </Button>
      </form>
    </Form>
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
  const [activeTab, setActiveTab] = useState('catalog');

  const canManage = ['Librarian', 'Administrator', 'Director'].includes(role || '');
  const canBorrow = ['Student', 'Teacher'].includes(role || '');

  const libraryQuery = useMemoFirebase(() => firestore ? collection(firestore, 'library') : null, [firestore]);
  const { data: libraryItems, isLoading } = useCollection<LibraryItem>(libraryQuery);

  const filteredItems = useMemo(() => {
    if (!libraryItems) return [];
    let items = libraryItems;

    if (!canManage) {
        items = items.filter(item => item.status === 'Available');
    }

    if (filter) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.author?.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return items;
  }, [libraryItems, filter, canManage]);
  
  const myBorrowedItems = useMemo(() => {
      if (!user || !libraryItems) return [];
      return libraryItems.filter(item => item.currentHolderId === user.uid);
  }, [libraryItems, user]);
  
  const pendingRequests = useMemo(() => {
      if (!libraryItems) return [];
      return libraryItems.filter(item => item.status === 'Requested');
  }, [libraryItems]);

  const handleRequestBorrow = (item: LibraryItem) => {
    if (!user) return;
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
    updateDocumentNonBlocking(doc(firestore, 'library', item.id), {
        status: 'Pending Return',
    });
    toast({ title: 'Return Initiated', description: `"${item.name}" is now pending return confirmation from the librarian.`});
  }
  
  const handleApproveRequest = async (item: LibraryItem) => {
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


  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">Library</h1>
                <p className="text-muted-foreground">Catalog, borrow, and manage library resources.</p>
            </div>
            {canManage && (
                <div className='flex gap-2'>
                    <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                        <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Item</Button></DialogTrigger>
                        <DialogContent><DialogHeader><DialogTitle>Add New Item to Catalog</DialogTitle><DialogDescription>Fill out the form to add a new item.</DialogDescription></DialogHeader><LibraryItemForm setOpen={setFormOpen} /></DialogContent>
                    </Dialog>
                </div>
            )}
        </div>

        {canBorrow && myBorrowedItems.length > 0 && (
            <Card>
                <CardHeader><CardTitle>My Borrowed Items</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Due Date</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
                        <TableBody>
                            {myBorrowedItems.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.dueDate ? format(item.dueDate.toDate(), 'PPP') : 'N/A'}</TableCell>
                                    <TableCell><Badge variant={item.status === 'Borrowed' ? 'destructive' : 'default'}>{item.status}</Badge></TableCell>
                                    <TableCell>
                                        {item.status === 'Borrowed' && <Button size="sm" onClick={() => handleMarkForReturn(item)}>Mark for Return</Button>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )}
      
        <Card>
            <CardHeader>
                <Tabs defaultValue="catalog" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="catalog">Library Catalog</TabsTrigger>
                        {canManage && <TabsTrigger value="requests">Pending Requests <Badge className="ml-2">{pendingRequests.length}</Badge></TabsTrigger>}
                    </TabsList>
                </Tabs>
                <div className='mt-4'>
                    <Input placeholder="Search by title or author..." value={filter} onChange={e => setFilter(e.target.value)} />
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? <div className='flex justify-center p-8'><Loader2 className="h-8 w-8 animate-spin" /></div> : 
                activeTab === 'catalog' ? (
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead><TableHead>Author</TableHead><TableHead>Category</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {filteredItems.map(item => (
                               <TableRow key={item.id}>
                                   <TableCell className="font-medium">{item.name}</TableCell>
                                   <TableCell>{item.author}</TableCell>
                                   <TableCell>{item.category}</TableCell>
                                   <TableCell>{item.location}</TableCell>
                                   <TableCell><Badge variant={item.status === 'Available' ? 'secondary' : 'outline'}>{item.status}</Badge></TableCell>
                                   <TableCell className="text-right">
                                       {canBorrow && item.status === 'Available' && <Button size="sm" onClick={() => handleRequestBorrow(item)}>Request Borrow</Button>}
                                        {canManage && item.status === 'Pending Return' && <Button size="sm" variant="destructive">Confirm Return</Button>}
                                   </TableCell>
                               </TableRow>
                           ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Table>
                        <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Requested By</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {pendingRequests.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.currentHolderName || 'N/A'}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button size="sm" variant="default" onClick={() => handleApproveRequest(item)}>Approve</Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleRejectRequest(item)}>Reject</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {pendingRequests.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No pending requests.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
