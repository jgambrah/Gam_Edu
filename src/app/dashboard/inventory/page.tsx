
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, writeBatch, serverTimestamp, query, orderBy, increment } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, History, ArrowLeftRight, Check, Boxes, FileText, ShoppingCart, ArchiveRestore } from 'lucide-react';
import { InventoryItem, InventoryTransaction, Staff } from '@/lib/types';
import Link from 'next/link';
import { InventoryItemForm } from './inventory-item-form';
import { CheckoutForm } from './checkout-form';
import { TransactionHistoryDialog } from './transaction-history-dialog';
import { SaleDialog } from './sale-dialog';
import { updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const restockSchema = z.object({
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
});

function RestockDialog({ item, open, onOpenChange, onRestockComplete }: { item: InventoryItem; open: boolean; onOpenChange: (open: boolean) => void; onRestockComplete: () => void; }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof restockSchema>>({
        resolver: zodResolver(restockSchema),
        defaultValues: { quantity: 1 },
    });

    async function onSubmit(values: z.infer<typeof restockSchema>) {
        if (!firestore) return;
        setIsSubmitting(true);
        try {
            const batch = writeBatch(firestore);

            const itemRef = doc(firestore, 'inventory', item.id);
            batch.update(itemRef, { quantity: increment(values.quantity) });

            const transactionRef = doc(collection(firestore, `inventory/${item.id}/transactions`));
            batch.set(transactionRef, {
                itemId: item.id,
                transactionType: 'Restock',
                quantityChange: values.quantity,
                timestamp: serverTimestamp(),
                notes: `Added ${values.quantity} unit(s).`
            });

            await batch.commit();
            toast({ title: 'Success', description: `${values.quantity} units of ${item.name} have been added to stock.` });
            onRestockComplete();
            onOpenChange(false);
        } catch (error) {
            console.error('Error restock item:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not process the restock.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Restock: {item.name}</DialogTitle>
                    <DialogDescription>Current stock: {item.quantity}. Add more quantity below.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="quantity" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity to Add</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add to Stock
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default function InventoryPage() {
    const { role } = useRole();
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [refetchKey, setRefetchKey] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const [activeDialog, setActiveDialog] = useState<
        'addItem' | 'checkOut' | 'history' | 'sellItem' | 'restockItem' | null
    >(null);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    const forceRefetch = useCallback(() => setRefetchKey(prev => prev + 1), []);

    const inventoryQuery = useMemoFirebase(() => user ? query(collection(firestore, 'inventory'), orderBy('name')) : null, [firestore, user, refetchKey]);
    const { data: inventory, isLoading } = useCollection<InventoryItem>(inventoryQuery);

    const staffListQuery = useMemoFirebase(() => (user && firestore) ? collection(firestore, 'staff') : null, [firestore, user]);
    const { data: staffList } = useCollection<Staff>(staffListQuery);

    const canManage = role === 'Administrator' || role === 'Director';
    const canSell = role === 'Accountant';

    const handleOpenDialog = (dialog: 'addItem' | 'checkOut' | 'history' | 'sellItem' | 'restockItem', item?: InventoryItem) => {
        setSelectedItem(item || null);
        setActiveDialog(dialog);
    };

    const handleCloseDialog = () => {
        setActiveDialog(null);
        setSelectedItem(null);
    };

    const handleCheckIn = async (item: InventoryItem) => {
        if (!item.currentHolderId) return;
        try {
            await updateDocumentNonBlocking(doc(firestore, 'inventory', item.id), {
                status: 'Available',
                currentHolderId: '',
                currentHolderName: ''
            });
            toast({ title: 'Success', description: `${item.name} has been checked in.` });
            forceRefetch();
        } catch (error) {
            console.error('Error checking in item:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not process the check-in.' });
        }
    };
    
    const getStatusVariant = (status: InventoryItem['status']) => {
        switch(status) {
            case 'Available': return 'default';
            case 'In Use': return 'secondary';
            case 'Out of Stock': return 'destructive';
            case 'Under Maintenance': return 'destructive';
            default: return 'outline';
        }
    }
    
    const filteredInventory = useMemo(() => {
        if (!inventory) return [];
        return inventory.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [inventory, searchTerm]);


    if (!canManage && !canSell) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>This module is restricted to Administrators, Directors, and Accountants.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center gap-2"><Boxes /> Inventory & Sales</CardTitle>
                            <CardDescription>Track and manage all physical assets and items for sale.</CardDescription>
                        </div>
                        {canManage && (
                        <div className="flex gap-2">
                            <Button onClick={() => handleOpenDialog('addItem')}><PlusCircle className="mr-2"/> Add New Item</Button>
                        </div>
                        )}
                    </div>
                     <div className="pt-4">
                        <Input 
                            placeholder="Search inventory..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead>Unit Price</TableHead>
                                    <TableHead>Current Holder</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInventory?.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell><Badge variant={getStatusVariant(item.status)}>{item.status}</Badge></TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>GH₵{(item.unitPrice || 0).toFixed(2)}</TableCell>
                                        <TableCell>{item.currentHolderName || 'N/A'}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            {canManage && <Button variant="outline" size="sm" onClick={() => handleOpenDialog('restockItem', item)}><ArchiveRestore className="mr-1 h-4 w-4"/> Restock</Button>}
                                            <Button variant="outline" size="sm" onClick={() => handleOpenDialog('history', item)}><History className="mr-1 h-4 w-4"/> History</Button>
                                            {canManage && item.status === 'Available' && <Button size="sm" onClick={() => handleOpenDialog('checkOut', item)}><ArrowLeftRight className="mr-1 h-4 w-4"/> Check Out</Button>}
                                            {canManage && item.status === 'In Use' && <Button size="sm" variant="secondary" onClick={() => handleCheckIn(item)}><Check className="mr-1 h-4 w-4"/> Check In</Button>}
                                            {canSell && item.status === 'Available' && item.quantity > 0 && <Button size="sm" variant="destructive" onClick={() => handleOpenDialog('sellItem', item)}><ShoppingCart className="mr-1 h-4 w-4" /> Sell</Button>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={activeDialog !== null} onOpenChange={(open) => !open && handleCloseDialog()}>
                {activeDialog === 'addItem' && (
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader><DialogTitle>Add New Inventory Item</DialogTitle><DialogDescription>Enter the details for the new asset.</DialogDescription></DialogHeader>
                        <InventoryItemForm setOpen={handleCloseDialog} onAdded={forceRefetch} />
                    </DialogContent>
                )}
                {activeDialog === 'checkOut' && selectedItem && (
                    <DialogContent>
                        <DialogHeader><DialogTitle>Check Out: {selectedItem.name}</DialogTitle><DialogDescription>Assign this item to a staff member.</DialogDescription></DialogHeader>
                        <CheckoutForm item={selectedItem} staffList={staffList || []} setOpen={handleCloseDialog} onCheckedOut={forceRefetch} />
                    </DialogContent>
                )}
                 {activeDialog === 'sellItem' && selectedItem && (
                   <SaleDialog item={selectedItem} open={true} onOpenChange={handleCloseDialog} onSaleComplete={forceRefetch} />
                )}
                {activeDialog === 'history' && selectedItem && (
                    <TransactionHistoryDialog item={selectedItem} open={true} setOpen={handleCloseDialog} />
                )}
                 {activeDialog === 'restockItem' && selectedItem && (
                    <RestockDialog item={selectedItem} open={true} onOpenChange={handleCloseDialog} onRestockComplete={forceRefetch} />
                )}
            </Dialog>
        </div>
    );
}
