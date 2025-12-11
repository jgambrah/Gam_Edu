
'use client';

import { useState, useMemo } from 'react';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, doc, updateDoc, increment, runTransaction, where } from 'firebase/firestore';
import { 
  Truck, ShoppingCart, Package, Plus, FileCheck, AlertCircle, Calendar, ChevronRight, User, Phone, MapPin 
} from 'lucide-react';
import { format } from 'date-fns';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Supplier, PurchaseOrder, InventoryItem } from '@/lib/types';

// --- COMPONENT: Supplier Manager ---
function SupplierManager() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    
    // Form
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async () => {
        if (!name) return;
        try {
            await addDoc(collection(firestore, 'suppliers'), {
                name, contactPerson: contact, phone, email, 
                balance: 0, createdAt: serverTimestamp()
            });
            toast({ title: "Supplier Added" });
            setIsOpen(false); setName('');
        } catch (e) { toast({ variant: 'destructive', title: "Error" }); }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4"/> Add Supplier</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>New Supplier</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <div><Label>Company Name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
                    <div><Label>Contact Person</Label><Input value={contact} onChange={e => setContact(e.target.value)} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
                        <div><Label>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} /></div>
                    </div>
                    <Button onClick={handleSubmit} className="w-full">Save Supplier</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- COMPONENT: Purchase Order Form ---
function PurchaseOrderForm({ suppliers, items, onClose }: { suppliers: Supplier[], items: any[], onClose: () => void }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    
    const [supplierId, setSupplierId] = useState('');
    const [poLines, setPoLines] = useState([{ itemId: '', qty: 1, cost: 0 }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const total = poLines.reduce((sum, line) => sum + (line.qty * line.cost), 0);

    const handleAddLine = () => setPoLines([...poLines, { itemId: '', qty: 1, cost: 0 }]);
    
    const updateLine = (index: number, field: string, value: any) => {
        const newLines = [...poLines];
        (newLines[index] as any)[field] = value;
        // Auto-fill cost if item selected
        if (field === 'itemId') {
            const item = items.find(i => i.id === value);
            if (item) newLines[index].cost = item.price || 0; // Default to selling price, user can edit
        }
        setPoLines(newLines);
    };

    const handleSubmit = async () => {
        if (!firestore || !user || !supplierId) return;
        setIsSubmitting(true);
        try {
            const supplier = suppliers.find(s => s.id === supplierId);
            
            // Resolve Item Names
            const finalItems = poLines.map(line => ({
                ...line,
                name: items.find(i => i.id === line.itemId)?.name || 'Unknown Item'
            }));

            await addDoc(collection(firestore, 'purchase_orders'), {
                supplierId,
                supplierName: supplier?.name,
                items: finalItems,
                totalAmount: total,
                status: 'Sent', // PO Sent to vendor
                date: serverTimestamp(),
                createdBy: user.uid
            });
            
            toast({ title: "PO Created", description: `Order for GH₵${total} sent.` });
            onClose();
        } catch (e) {
            toast({ variant: 'destructive', title: "Error" });
        } finally { setIsSubmitting(false); }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Select Supplier</Label>
                <Select value={supplierId} onValueChange={setSupplierId}>
                    <SelectTrigger><SelectValue placeholder="Choose Vendor"/></SelectTrigger>
                    <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
            </div>

            <div className="border rounded-md p-2 bg-slate-50 space-y-2 max-h-[300px] overflow-y-auto">
                {poLines.map((line, idx) => (
                    <div key={idx} className="flex gap-2 items-end">
                        <div className="flex-1 space-y-1">
                            <Label className="text-xs">Item</Label>
                            <Select value={line.itemId} onValueChange={v => updateLine(idx, 'itemId', v)}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>{items.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="w-20 space-y-1"><Label className="text-xs">Qty</Label><Input type="number" value={line.qty} onChange={e => updateLine(idx, 'qty', parseInt(e.target.value))}/></div>
                        <div className="w-24 space-y-1"><Label className="text-xs">Cost</Label><Input type="number" value={line.cost} onChange={e => updateLine(idx, 'cost', parseFloat(e.target.value))}/></div>
                    </div>
                ))}
                <Button variant="ghost" size="sm" onClick={handleAddLine}><Plus className="h-4 w-4 mr-2"/> Add Item</Button>
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-bold text-lg">Total: GH₵{total.toFixed(2)}</span>
                <Button onClick={handleSubmit} disabled={isSubmitting || total === 0}>{isSubmitting ? <Loader2 className="animate-spin"/> : "Create PO"}</Button>
            </div>
        </div>
    );
}

// --- MAIN PAGE ---
export default function ProcurementPage() {
    const firestore = useFirestore();
    const { user } = useUser();
    const { role } = useRole();
    const { toast } = useToast();
    const [isPoOpen, setIsPoOpen] = useState(false);

    // Fetch Data
    const suppliersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'suppliers')) : null, [firestore]);
    const { data: suppliers } = useCollection<Supplier>(suppliersQuery);

    const poQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'purchase_orders'), orderBy('date', 'desc')) : null, [firestore]);
    const { data: pos } = useCollection<PurchaseOrder>(poQuery);

    // Fetch Inventory Items for PO dropdown
    const itemsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'school_shop_items')) : null, [firestore]);
    const { data: inventoryItems } = useCollection<InventoryItem>(itemsQuery);

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role);
    if (!canAccess) return <div className="p-8 text-center text-red-500">Access Denied</div>;

    // --- GRN LOGIC (Receive Goods) ---
    const handleReceiveGoods = async (po: PurchaseOrder) => {
        if (!confirm("Confirm receipt of goods? This will update inventory and create a Bill.")) return;
        
        try {
            await runTransaction(firestore!, async (transaction) => {
                // 1. Update PO Status
                const poRef = doc(firestore!, 'purchase_orders', po.id);
                transaction.update(poRef, { status: 'Received' });

                // 2. Update Inventory Stock
                po.items.forEach(item => {
                    const itemRef = doc(firestore!, 'school_shop_items', item.itemId);
                    transaction.update(itemRef, { stock: increment(item.quantity) });
                });

                // 3. Create Vendor Bill (Accounts Payable)
                const billRef = doc(collection(firestore!, 'vendor_bills'));
                transaction.set(billRef, {
                    supplierId: po.supplierId,
                    supplierName: po.supplierName,
                    poId: po.id,
                    description: `Bill for PO #${po.id.slice(0,6)}`,
                    totalAmount: po.totalAmount,
                    amountPaid: 0,
                    status: 'Unpaid',
                    date: serverTimestamp(),
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Net 30 default
                });

                // 4. Update Supplier Balance
                const suppRef = doc(firestore!, 'suppliers', po.supplierId);
                transaction.update(suppRef, { balance: increment(po.totalAmount) });
                
                // (Optional) Create Journal Entry: Dr Inventory / Cr Accounts Payable
                // This would be added here if you want full double-entry automation
            });

            toast({ title: "Goods Received", description: "Inventory updated and Bill created." });
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: "Error receiving goods." });
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2"><Truck className="text-blue-600"/> Procurement</h1>
                    <p className="text-muted-foreground">Manage Suppliers, Orders, and Goods Receipt.</p>
                </div>
                <div className="flex gap-2">
                    <SupplierManager />
                    <Dialog open={isPoOpen} onOpenChange={setIsPoOpen}>
                        <DialogTrigger asChild><Button className="bg-blue-600"><ShoppingCart className="mr-2 h-4 w-4"/> Create PO</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader><DialogTitle>New Purchase Order</DialogTitle></DialogHeader>
                            <PurchaseOrderForm suppliers={suppliers || []} items={inventoryItems || []} onClose={() => setIsPoOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* SUPPLIER LIST */}
                <Card className="lg:col-span-1">
                    <CardHeader><CardTitle>Suppliers</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead className="text-right">Balance</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {suppliers?.map(s => (
                                    <TableRow key={s.id}>
                                        <TableCell>
                                            <div className="font-medium">{s.name}</div>
                                            <div className="text-xs text-muted-foreground">{s.phone}</div>
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-red-600">GH₵{s.balance.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* PO LIST */}
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Purchase Orders</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Supplier</TableHead><TableHead>Items</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
                            <TableBody>
                                {pos?.map(po => (
                                    <TableRow key={po.id}>
                                        <TableCell className="text-xs">{po.date ? format(po.date.toDate(), 'PP') : '-'}</TableCell>
                                        <TableCell>{po.supplierName}</TableCell>
                                        <TableCell className="text-xs">{po.items.length} items</TableCell>
                                        <TableCell>GH₵{po.totalAmount.toFixed(2)}</TableCell>
                                        <TableCell><Badge variant={po.status === 'Received' ? 'default' : 'secondary'}>{po.status}</Badge></TableCell>
                                        <TableCell>
                                            {po.status === 'Sent' && (
                                                <Button size="sm" variant="outline" onClick={() => handleReceiveGoods(po)}>
                                                    <FileCheck className="mr-2 h-3 w-3"/> Receive
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
