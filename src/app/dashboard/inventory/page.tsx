
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { 
  Boxes, PlusCircle, Search, Loader2, Edit, Trash2, 
  History, ArrowUpRight, ArrowDownLeft, Package, 
  Warehouse, UserCheck, AlertTriangle, CheckCircle2,
  MoreVertical
} from 'lucide-react';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

// Shared Components
import { InventoryItemForm } from './inventory-item-form';
import { CheckoutForm } from './checkout-form';
import { TransactionHistoryDialog } from './transaction-history-dialog';
import { SaleDialog } from './sale-dialog'; // Using sale dialog for "Usage/Restock" simulation
import type { InventoryItem, Staff, Class } from '@/lib/types';

export default function InventoryPage() {
  const firestore = useFirestore();
  const { role } = useRole();
  const { toast } = useToast();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);

  const canManage = ['Administrator', 'Director', 'Accountant'].includes(role || '');

  // 1. Fetch Inventory (Real-time & School-Aware)
  const inventoryQuery = useMemoFirebase(() => 
    (firestore && schoolId) ? query(collection(firestore, 'inventory'), where('schoolId', '==', schoolId), orderBy('name')) : null, 
  [firestore, schoolId]);
  const { data: inventory, isLoading: isLoadingInventory, forceRefetch } = useCollection<InventoryItem>(inventoryQuery);

  // 2. Fetch Staff (For Checkout mapping)
  const staffQuery = useMemoFirebase(() => 
    (firestore && schoolId && canManage) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId)) : null, 
  [firestore, schoolId, canManage]);
  const { data: staffList } = useCollection<Staff>(staffQuery);

  // Filter Logic
  const filteredInventory = useMemo(() => {
    if (!inventory) return [];
    return inventory.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventory, searchTerm]);

  const stats = useMemo(() => {
    if (!inventory) return { total: 0, available: 0, inUse: 0, lowStock: 0 };
    return {
        total: inventory.length,
        available: inventory.filter(i => i.status === 'Available').length,
        inUse: inventory.filter(i => i.status === 'In Use').length,
        lowStock: inventory.filter(i => i.quantity < 5).length
    };
  }, [inventory]);

  const handleDeleteItem = async (id: string) => {
      if (!firestore) return;
      try {
          await deleteDoc(doc(firestore, 'inventory', id));
          toast({ title: "Item Removed", description: "The asset has been deleted from inventory." });
      } catch (e: any) {
          toast({ variant: 'destructive', title: "Error", description: e.message });
      }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available': return <Badge className="bg-green-100 text-green-700 border-green-200">Available</Badge>;
      case 'In Use': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">In Use</Badge>;
      case 'Under Maintenance': return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Maintenance</Badge>;
      case 'Out of Stock': return <Badge variant="destructive">Out of Stock</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const isLoading = isLoadingSchool || isLoadingInventory;

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2 italic uppercase">
                    <Boxes className="h-8 w-8 text-indigo-600" /> Inventory <span className="text-indigo-600">Vault</span>
                </h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Asset tracking and resource allocation</p>
            </div>
            
            {canManage && schoolId && (
                <div className="flex gap-2">
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 h-12 px-6 rounded-2xl font-black uppercase tracking-tight">
                                <PlusCircle className="mr-2 h-5 w-5" /> Add New Asset
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Add to Inventory</DialogTitle>
                                <DialogDescription>Register a new piece of equipment or supply batch.</DialogDescription>
                            </DialogHeader>
                            <InventoryItemForm 
                                setOpen={() => setIsAddOpen(false)} 
                                onAdded={forceRefetch} 
                                schoolId={schoolId} 
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Assets</p>
                    <p className="text-2xl font-black text-slate-900">{stats.total}</p>
                </CardContent>
            </Card>
            <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Available</p>
                    <p className="text-2xl font-black text-emerald-600">{stats.available}</p>
                </CardContent>
            </Card>
            <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">In Use</p>
                    <p className="text-2xl font-black text-blue-600">{stats.inUse}</p>
                </CardContent>
            </Card>
            <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Low Stock</p>
                    <p className="text-2xl font-black text-rose-600">{stats.lowStock}</p>
                </CardContent>
            </Card>
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <CardTitle className="text-lg font-black uppercase tracking-tight">Current Stock</CardTitle>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Filter by name or category..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-11 bg-white border-2 rounded-xl"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center gap-3">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Scanning Vault...</p>
                    </div>
                ) : filteredInventory.length === 0 ? (
                    <div className="py-20 text-center text-slate-400">
                        <Warehouse className="h-16 w-16 mx-auto mb-4 opacity-10" />
                        <p className="font-bold text-sm uppercase tracking-widest">No items found</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50">
                                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Asset Details</TableHead>
                                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Classification</TableHead>
                                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Quantity</TableHead>
                                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Location</TableHead>
                                <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInventory.map(item => (
                                <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <div className="font-black text-slate-800 uppercase tracking-tight">{item.name}</div>
                                        <div className="text-[10px] text-slate-400 font-medium">Condition: {item.condition}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 font-bold uppercase text-[9px]">
                                            {item.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(item.status)}
                                        {item.status === 'In Use' && (
                                            <div className="text-[10px] font-bold text-blue-600 mt-1 uppercase flex items-center gap-1">
                                                <UserCheck className="h-3 w-3" /> {item.currentHolderName}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className={cn("font-mono font-bold", item.quantity < 5 ? "text-rose-600" : "text-slate-600")}>
                                        {item.quantity}
                                    </TableCell>
                                    <TableCell className="text-xs font-medium text-slate-500 italic">
                                        {item.location || 'Not Specified'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-xl border-2">
                                                <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-slate-400">Inventory Tools</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                
                                                <DropdownMenuItem onClick={() => { setSelectedItem(item); setIsCheckoutOpen(true); }} className="cursor-pointer font-bold gap-2">
                                                    <ArrowRight className="h-4 w-4 text-blue-600" /> {item.status === 'In Use' ? 'Update Holder' : 'Check Out'}
                                                </DropdownMenuItem>
                                                
                                                <DropdownMenuItem onClick={() => { setSelectedItem(item); setIsRestockOpen(true); }} className="cursor-pointer font-bold gap-2">
                                                    <PlusCircle className="h-4 w-4 text-emerald-600" /> Restock Items
                                                </DropdownMenuItem>

                                                <DropdownMenuItem onClick={() => { setSelectedItem(item); setIsHistoryOpen(true); }} className="cursor-pointer font-bold gap-2">
                                                    <History className="h-4 w-4 text-slate-500" /> Audit History
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />
                                                
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-rose-600 font-bold gap-2">
                                                            <Trash2 className="h-4 w-4" /> Decommission
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-3xl border-4 border-slate-900">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-2xl font-black uppercase italic">Permanent Removal</AlertDialogTitle>
                                                            <AlertDialogDescription className="font-bold text-slate-600">
                                                                Are you sure you want to remove <strong>{item.name}</strong> from the system? This will delete all historical records for this asset.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteItem(item.id)} className="bg-red-600 hover:bg-black rounded-xl font-black uppercase tracking-widest">
                                                                Confirm Purge
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>

        {/* --- MODALS --- */}
        
        {selectedItem && (
            <>
                <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Asset Checkout: {selectedItem.name}</DialogTitle>
                            <DialogDescription>Assign this item to a staff member.</DialogDescription>
                        </DialogHeader>
                        <CheckoutForm 
                            item={selectedItem} 
                            staffList={staffList || []} 
                            setOpen={() => setIsCheckoutOpen(false)} 
                            onCheckedOut={forceRefetch} 
                        />
                    </DialogContent>
                </Dialog>

                <TransactionHistoryDialog 
                    item={selectedItem} 
                    open={isHistoryOpen} 
                    setOpen={() => setIsHistoryOpen(false)} 
                />

                <SaleDialog 
                    item={selectedItem} 
                    open={isRestockOpen} 
                    onOpenChange={setIsRestockOpen} 
                    onSaleComplete={forceRefetch} 
                />
            </>
        )}
    </div>
  );
}
