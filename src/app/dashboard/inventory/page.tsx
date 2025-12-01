
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, writeBatch, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, History, ArrowLeftRight, Check, Boxes, FileText } from 'lucide-react';
import { InventoryItem, InventoryTransaction, Staff } from '@/lib/types';
import Link from 'next/link';
import { InventoryItemForm } from './inventory-item-form';
import { CheckoutForm } from './checkout-form';
import { TransactionHistoryDialog } from './transaction-history-dialog';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function InventoryPage() {
    const { role } = useRole();
    const { user } = useAuth();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [refetchKey, setRefetchKey] = useState(0);

    const [activeDialog, setActiveDialog] = useState<
        'addItem' | 'checkOut' | 'history' | null
    >(null);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    const forceRefetch = useCallback(() => setRefetchKey(prev => prev + 1), []);

    const inventoryQuery = useMemoFirebase(() => user ? query(collection(firestore, 'inventory'), orderBy('name')) : null, [firestore, user, refetchKey]);
    const { data: inventory, isLoading } = useCollection<InventoryItem>(inventoryQuery);

    const staffListQuery = useMemoFirebase(() => (user && firestore) ? collection(firestore, 'staff') : null, [firestore, user]);
    const { data: staffList } = useCollection<Staff>(staffListQuery);

    const canAccess = role === 'Administrator' || role === 'Director';

    const handleOpenDialog = (dialog: 'addItem' | 'checkOut' | 'history', item?: InventoryItem) => {
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
            const batch = writeBatch(firestore);

            const itemRef = doc(firestore, 'inventory', item.id);
            batch.update(itemRef, {
                status: 'Available',
                currentHolderId: '',
                currentHolderName: ''
            });

            const transactionRef = doc(collection(firestore, `inventory/${item.id}/transactions`));
            batch.set(transactionRef, {
                itemId: item.id,
                transactionType: 'Check-In',
                timestamp: serverTimestamp(),
                staffId: item.currentHolderId,
                notes: `Returned by ${item.currentHolderName}`
            });

            await batch.commit();
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
            case 'Under Maintenance': return 'destructive';
            default: return 'outline';
        }
    }

    if (!canAccess) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>This module is restricted to Administrators and Directors.</CardDescription>
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
                            <CardTitle className="flex items-center gap-2"><Boxes /> Inventory Management</CardTitle>
                            <CardDescription>Track and manage all physical assets owned by the school.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button asChild variant="outline"><Link href="#"><FileText className="mr-2"/> View Reports</Link></Button>
                            <Button onClick={() => handleOpenDialog('addItem')}><PlusCircle className="mr-2"/> Add New Item</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Condition</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Current Holder</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inventory?.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell>{item.condition}</TableCell>
                                        <TableCell><Badge variant={getStatusVariant(item.status)}>{item.status}</Badge></TableCell>
                                        <TableCell>{item.currentHolderName || 'N/A'}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => handleOpenDialog('history', item)}><History className="mr-1 h-4 w-4"/> History</Button>
                                            {item.status === 'Available' && <Button size="sm" onClick={() => handleOpenDialog('checkOut', item)}><ArrowLeftRight className="mr-1 h-4 w-4"/> Check Out</Button>}
                                            {item.status === 'In Use' && <Button size="sm" variant="secondary" onClick={() => handleCheckIn(item)}><Check className="mr-1 h-4 w-4"/> Check In</Button>}
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
                {activeDialog === 'history' && selectedItem && (
                    <TransactionHistoryDialog item={selectedItem} open={true} setOpen={handleCloseDialog} />
                )}
            </Dialog>
        </div>
    );
}
