'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, where, doc, writeBatch, increment, updateDoc, getDocs } from 'firebase/firestore';
import { 
  ShoppingBag, Package, PlusCircle, ShoppingCart, 
  Search, TrendingUp, AlertTriangle, Shirt, Book, PenTool, Trash2, ArchiveRestore, Edit, Loader2,
  Check, Printer, RefreshCw, BarChart2, DollarSign, ArrowRight, History, Wallet, CreditCard, Coins, X, Plus, Minus
} from 'lucide-react';
import { useCurrentSchool } from '@/hooks/use-current-school';

// UI
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

// --- TYPES ---
interface ShopItem {
    id: string;
    name: string;
    category: 'Uniform' | 'Book' | 'Clothing' | 'Stationery' | 'Other';
    price: number;
    stock: number;
    minStock: number;
    description?: string;
    schoolId?: string;
}

interface CartItem extends ShopItem {
    quantity: number;
}

interface SaleTransaction {
    id: string;
    type: 'SALE';
    itemId: string;
    itemName: string;
    quantity: number;
    priceAtSale: number;
    total: number;
    soldBy: string;
    paymentMethod: string;
    date: any;
    schoolId: string;
}

const restockSchema = z.object({
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
});

const editItemSchema = z.object({
    name: z.string().min(1, "Name is required."),
    category: z.enum(['Uniform', 'Book', 'Clothing', 'Stationery', 'Other']),
    price: z.coerce.number().min(0.01, "Price must be at least 0.01."),
    minStock: z.coerce.number().int().min(0, "Min stock cannot be negative."),
    description: z.string().optional(),
});

// Helper for formatting timestamp safely
function formatDateSafe(timestamp: any) {
    if (!timestamp) return '-';
    if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    if (timestamp instanceof Date) {
        return timestamp.toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
}

// --- COMPONENT: Edit Item Dialog ---
function EditItemDialog({ item, open, onOpenChange, onUpdateComplete }: { item: ShopItem; open: boolean; onOpenChange: (open: boolean) => void; onUpdateComplete: () => void; }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof editItemSchema>>({
        resolver: zodResolver(editItemSchema),
        defaultValues: {
            name: item.name,
            category: item.category,
            price: item.price,
            minStock: item.minStock || 10,
            description: item.description || '',
        },
    });

    async function onSubmit(values: z.infer<typeof editItemSchema>) {
        if (!firestore) return;
        setIsSubmitting(true);
        try {
            const itemRef = doc(firestore!, 'school_shop_items', item.id);
            await updateDoc(itemRef, {
                ...values,
                updatedAt: serverTimestamp()
            });

            toast({ title: 'Success', description: `${values.name} has been updated.` });
            onUpdateComplete();
            onOpenChange(false);
        } catch (error) {
            console.error('Error updating item:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not update the item.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Item: {item.name}</DialogTitle>
                    <DialogDescription>Update product details and pricing.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Item Name</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Book">Book</SelectItem>
                                            <SelectItem value="Uniform">Uniform</SelectItem>
                                            <SelectItem value="Clothing">Sports/Friday Wear</SelectItem>
                                            <SelectItem value="Stationery">Stationery</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Price (GH₵)"}</FormLabel>
                                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="minStock" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Minimum Stock Alert Level</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea {...field} /></FormControl>
                            </FormItem>
                        )} />
                        <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

// --- COMPONENT: Restock Dialog ---
function RestockDialog({ item, open, onOpenChange, onRestockComplete }: { item: ShopItem; open: boolean; onOpenChange: (open: boolean) => void; onRestockComplete: () => void; }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof restockSchema>>({
        resolver: zodResolver(restockSchema),
        defaultValues: { quantity: 1 },
    });

    async function onSubmit(values: z.infer<typeof restockSchema>) {
        if (!firestore || !schoolId) return;
        setIsSubmitting(true);
        try {
            const batch = writeBatch(firestore!);

            const itemRef = doc(firestore!, 'school_shop_items', item.id);
            batch.update(itemRef, { stock: increment(values.quantity) });

            const transactionRef = doc(collection(firestore!, `school_shop_items/${item.id}/transactions`));
            batch.set(transactionRef, {
                itemId: item.id,
                transactionType: 'RESTOCK',
                quantityChange: values.quantity,
                date: serverTimestamp(),
                notes: `Added ${values.quantity} unit(s).`,
                schoolId: schoolId,
            });

            await batch.commit();
            toast({ title: 'Success', description: `${values.quantity} units of ${item.name} have been added to stock.` });
            onRestockComplete();
            onOpenChange(false);
        } catch (error) {
            console.error('Error restocking item:', error);
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
                    <DialogDescription>Current stock: {item.stock}. Add more quantity below.</DialogDescription>
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
                        <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add to Stock
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

// --- COMPONENT: Add Shop Item ---
function ShopManager({ schoolId, onAddItem }: { schoolId: string; onAddItem: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [name, setName] = useState('');
    const [category, setCategory] = useState('Book');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [minStock, setMinStock] = useState('10');
    const [desc, setDesc] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(firestore!, 'school_shop_items'), {
                name,
                category,
                price: parseFloat(price) || 0,
                stock: parseInt(stock) || 0,
                minStock: parseInt(minStock) || 10, 
                description: desc,
                createdAt: serverTimestamp(),
                schoolId: schoolId,
            });
            
            toast({ title: "Product Added", description: `${name} is now available for sale.` });
            onAddItem();
            setIsFormOpen(false);
            setName(''); setPrice(''); setStock(''); setMinStock('10'); setDesc('');
        } catch (e) {
            toast({ variant: 'destructive', title: "Error", description: "Failed to add item." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all hover:scale-105"><PlusCircle className="mr-2 h-4 w-4"/> Add Shop Item</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Merchandise Product</DialogTitle>
                    <DialogDescription>Create a new item in the school shop inventory catalog.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="mt-1"><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Book">Book</SelectItem>
                                    <SelectItem value="Uniform">Uniform</SelectItem>
                                    <SelectItem value="Clothing">Sports/Friday Wear</SelectItem>
                                    <SelectItem value="Stationery">Stationery</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Minimum Alert Stock</Label>
                            <Input type="number" value={minStock} onChange={e => setMinStock(e.target.value)} className="mt-1" required/>
                        </div>
                    </div>
                    <div><Label>Item Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Lacoste Shirt (Large)" className="mt-1" required/></div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>{"Price (GH₵)"}</Label><Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="mt-1" required/></div>
                        <div><Label>Initial Stock</Label><Input type="number" value={stock} onChange={e => setStock(e.target.value)} className="mt-1" required/></div>
                    </div>

                    <div><Label>Details (Optional)</Label><Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Size, Subject, etc." className="mt-1"/></div>

                    <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 mt-2">
                        {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : null}
                        Save Product
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// --- COMPONENT: Receipt Dialog ---
interface ReceiptData {
    receiptNo: string;
    date: Date;
    items: { name: string; quantity: number; price: number; total: number }[];
    total: number;
    paymentMethod: string;
    soldBy: string;
}

function ReceiptModal({ data, open, onClose }: { data: ReceiptData | null; open: boolean; onClose: () => void }) {
    if (!data) return null;

    const handlePrint = () => {
        const printWindow = window.open('', '_blank', 'width=600,height=800');
        if (!printWindow) return;
        
        printWindow.document.write(`
            <html>
            <head>
                <title>Receipt ${data.receiptNo}</title>
                <style>
                    body {
                        font-family: 'Courier New', Courier, monospace;
                        font-size: 14px;
                        padding: 20px;
                        color: #000;
                        max-width: 400px;
                        margin: 0 auto;
                    }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .header { margin-bottom: 20px; }
                    .title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
                    .divider { border-bottom: 1px dashed #000; margin: 10px 0; }
                    .item-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
                    .footer { margin-top: 30px; font-size: 12px; }
                    @media print {
                        body { padding: 0; margin: 0; width: 100%; }
                    }
                </style>
            </head>
            <body>
                <div class="text-center header">
                    <div class="title">GAM SCHOOLS SHOP</div>
                    <div>Official Sales Receipt</div>
                    <div>Tel: +233 (0) 24 123 4567</div>
                </div>
                <div class="divider"></div>
                <div><strong>Receipt No:</strong> ${data.receiptNo}</div>
                <div><strong>Date:</strong> ${data.date.toLocaleString()}</div>
                <div><strong>Cashier ID:</strong> ${data.soldBy.substring(0, 8)}</div>
                <div><strong>Payment:</strong> ${data.paymentMethod}</div>
                <div class="divider"></div>
                
                <div style="font-weight: bold; display: flex; justify-content: space-between;">
                    <span>Item Description</span>
                    <span>Total</span>
                </div>
                <div class="divider"></div>
                ${data.items.map(item => `
                    <div class="item-row">
                        <div>
                            <div>${item.name}</div>
                            <div style="font-size: 12px; color: #555;">${item.quantity} x GH₵${item.price.toFixed(2)}</div>
                        </div>
                        <div class="text-right">GH₵${item.total.toFixed(2)}</div>
                    </div>
                `).join('')}
                
                <div class="divider"></div>
                <div class="item-row" style="font-size: 16px; font-weight: bold;">
                    <span>TOTAL PAID</span>
                    <span>GH₵${data.total.toFixed(2)}</span>
                </div>
                <div class="divider"></div>
                
                <div class="text-center footer">
                    <p>Thank you for your purchase!</p>
                    <p>Items purchased cannot be refunded after 7 days.</p>
                </div>
                <script>
                    window.onload = function() { window.print(); window.close(); }
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <div className="mx-auto bg-emerald-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                        <Check className="h-6 w-6 text-emerald-600" />
                    </div>
                    <DialogTitle className="text-center text-xl text-slate-800">Sale Confirmed</DialogTitle>
                    <DialogDescription className="text-center">The sale was processed successfully.</DialogDescription>
                </DialogHeader>

                <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 font-mono text-xs text-slate-700 space-y-3">
                    <div className="text-center space-y-1">
                        <span className="font-bold text-sm block tracking-wider">GAM SCHOOL SHOP</span>
                        <span>Official Transaction Record</span>
                    </div>
                    <div className="border-b border-dashed border-slate-300 pb-2 space-y-1">
                        <div><strong>Receipt No:</strong> <span className="text-slate-900">{data.receiptNo}</span></div>
                        <div><strong>Date:</strong> {data.date.toLocaleString()}</div>
                        <div><strong>Payment:</strong> <Badge variant="secondary" className="font-sans text-[10px]">{data.paymentMethod}</Badge></div>
                    </div>

                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {data.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start">
                                <div>
                                    <div className="font-semibold text-slate-900">{item.name}</div>
                                    <div className="text-[10px] text-slate-500">{item.quantity} x GH₵{item.price.toFixed(2)}</div>
                                </div>
                                <span className="font-bold text-slate-800">GH₵{item.total.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed border-slate-300 pt-2 flex justify-between items-center text-sm font-bold text-slate-900">
                        <span>TOTAL</span>
                        <span>GH₵{data.total.toFixed(2)}</span>
                    </div>
                </div>

                <DialogFooter className="grid grid-cols-2 gap-3 sm:gap-0 mt-2">
                    <Button variant="outline" onClick={onClose} className="w-full">Dismiss</Button>
                    <Button onClick={handlePrint} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"><Printer className="mr-2 h-4 w-4" /> Print Receipt</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- COMPONENT: Point of Sale (POS) ---
function PointOfSale({ items, schoolId, activeTill, onSaleSuccess }: { items: ShopItem[], schoolId: string, activeTill: any, onSaleSuccess: () => void }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('All');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const addToCart = (item: ShopItem) => {
        if (item.stock <= 0) {
            toast({ variant: 'destructive', title: "Out of Stock", description: "Cannot sell this item." });
            return;
        }

        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                if (existing.quantity >= item.stock) {
                    toast({ variant: 'destructive', title: "Stock Exceeded", description: `Only ${item.stock} units available.` });
                    return prev;
                }
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, amount: number) => {
        setCart(prev => {
            const item = prev.find(i => i.id === id);
            if (!item) return prev;
            
            const newQty = item.quantity + amount;
            if (newQty <= 0) {
                return prev.filter(i => i.id !== id);
            }
            
            // Validate stock
            if (newQty > item.stock) {
                toast({ variant: 'destructive', title: "Limit Reached", description: `Cannot add more. Only ${item.stock} left in stock.` });
                return prev;
            }
            
            return prev.map(i => i.id === id ? { ...i, quantity: newQty } : i);
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(i => i.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    const handleCheckout = async () => {
        if (cart.length === 0 || !user || !schoolId || !firestore) return;
        
        if (paymentMethod === 'Cash' && !activeTill) {
            toast({ variant: 'destructive', title: "Till Closed", description: "Please OPEN YOUR TILL before making cash sales." });
            return;
        }

        setIsProcessing(true);
        try {
            const batch = writeBatch(firestore!);
            const transactionId = doc(collection(firestore!, 'school_shop_transactions')).id;
            
            if (paymentMethod === 'Cash' && activeTill) {
                const transRef = doc(collection(firestore!, `tills/${activeTill.id}/transactions`));
                batch.set(transRef, {
                    tillId: activeTill.id,
                    amount: totalAmount,
                    type: 'Inflow',
                    description: `Shop Sales (Receipt: #${transactionId.substring(0, 8).toUpperCase()})`,
                    timestamp: serverTimestamp(),
                    schoolId: schoolId,
                });
                
                batch.update(doc(firestore!, 'tills', activeTill.id), {
                    currentBalance: increment(totalAmount)
                });
            }

            cart.forEach(item => {
                const itemRef = doc(firestore!, 'school_shop_items', item.id);
                batch.update(itemRef, { stock: increment(-item.quantity) });

                const logRef = doc(firestore!, 'school_shop_transactions', transactionId);
                batch.set(logRef, {
                    type: 'SALE',
                    itemId: item.id,
                    itemName: item.name,
                    quantity: item.quantity,
                    priceAtSale: item.price,
                    total: item.price * item.quantity,
                    soldBy: user.uid,
                    paymentMethod: paymentMethod,
                    date: serverTimestamp(),
                    schoolId: schoolId,
                });
            });

            await batch.commit();

            // Prepare Receipt Data
            setReceiptData({
                receiptNo: transactionId.substring(0, 8).toUpperCase(),
                date: new Date(),
                items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, total: i.price * i.quantity })),
                total: totalAmount,
                paymentMethod: paymentMethod,
                soldBy: user.email || user.uid,
            });

            toast({ title: "Sale Complete", description: `Received GH₵${totalAmount.toFixed(2)} via ${paymentMethod}` });
            setCart([]);
            onSaleSuccess();

        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: "Checkout Failed", description: e.message });
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredItems = items.filter(i => {
        const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || i.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const getIcon = (cat: string) => {
        if (cat === 'Book') return <Book className="h-8 w-8 text-blue-500"/>;
        if (cat === 'Uniform' || cat === 'Clothing') return <Shirt className="h-8 w-8 text-purple-500"/>;
        if (cat === 'Stationery') return <PenTool className="h-8 w-8 text-emerald-500"/>;
        return <Package className="h-8 w-8 text-slate-500"/>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
            
            <Card className="lg:col-span-2 flex flex-col overflow-hidden border-emerald-100 shadow-md">
                <CardHeader className="pb-3 bg-emerald-50/40 border-b flex flex-row items-center justify-between gap-4 flex-wrap">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search products by name..." className="pl-9 bg-white" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Book', 'Uniform', 'Clothing', 'Stationery', 'Other'].map(cat => (
                            <Button
                                key={cat}
                                size="sm"
                                variant={categoryFilter === cat ? 'default' : 'outline'}
                                className={categoryFilter === cat ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                                onClick={() => setCategoryFilter(cat)}
                            >
                                {cat === 'Clothing' ? 'Wear' : cat}
                            </Button>
                        ))}
                    </div>
                </CardHeader>
                <ScrollArea className="flex-1 p-4 bg-slate-50/10">
                    {filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground opacity-60">
                            <Package className="h-16 w-16 mb-2 stroke-1"/>
                            <p>No products found matching filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredItems.map(item => (
                                <button 
                                    key={item.id} 
                                    onClick={() => addToCart(item)}
                                    disabled={item.stock === 0}
                                    className={`p-4 rounded-xl border text-left transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between h-40 ${item.stock === 0 ? 'opacity-60 bg-slate-50 border-slate-200 cursor-not-allowed' : 'bg-white hover:border-emerald-500 shadow-sm'}`}
                                >
                                    <div className="flex justify-between items-start w-full">
                                        <div className="bg-slate-100/80 p-2 rounded-xl">{getIcon(item.category)}</div>
                                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">{item.category}</Badge>
                                    </div>
                                    
                                    <div className="space-y-1 mt-2">
                                        <h4 className="font-semibold text-sm line-clamp-2 text-slate-800 leading-tight">{item.name}</h4>
                                        <div className="flex justify-between items-end pt-1">
                                            <span className="font-extrabold text-emerald-700 text-lg">GH₵{Number(item.price || 0).toFixed(2)}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.stock === 0 ? 'bg-red-100 text-red-700' : item.stock <= item.minStock ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-emerald-50 text-emerald-700'}`}>
                                                {item.stock === 0 ? 'Sold Out' : `${item.stock} left`}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </Card>

            <Card className="flex flex-col h-full border-l-4 border-l-emerald-600 shadow-xl bg-white overflow-hidden">
                <CardHeader className="pb-4 bg-emerald-50/60 border-b border-emerald-100/80 flex flex-row justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-emerald-800 font-bold"><ShoppingCart className="h-5 w-5"/> Active Cart</CardTitle>
                    {cart.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-500 hover:text-red-700 hover:bg-red-50 font-bold">Clear Cart</Button>
                    )}
                </CardHeader>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 py-16">
                            <ShoppingBag className="h-16 w-16 mb-2 stroke-1 opacity-50"/>
                            <p className="text-sm">Your shopping cart is empty.</p>
                            <p className="text-xs text-muted-foreground mt-1">Click products on the left to add.</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-slate-50/60 p-3 rounded-xl border border-slate-200 shadow-sm">
                                <div className="space-y-1 pr-2 max-w-[50%]">
                                    <p className="font-semibold text-sm text-slate-800 truncate">{item.name}</p>
                                    <p className="text-xs text-slate-500">GH₵{Number(item.price || 0).toFixed(2)} each</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                                        <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, -1)} className="h-8 w-8 rounded-none border-r"><Minus className="h-3 w-3"/></Button>
                                        <span className="w-8 text-center text-xs font-bold text-slate-700">{item.quantity}</span>
                                        <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, 1)} className="h-8 w-8 rounded-none border-l"><Plus className="h-3 w-3"/></Button>
                                    </div>
                                    <div className="text-right pl-2 min-w-[70px]">
                                        <p className="font-extrabold text-sm text-slate-700">GH₵{(item.quantity * Number(item.price || 0)).toFixed(2)}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"><X className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-5 bg-slate-50 border-t border-slate-200/80 space-y-4">
                    <div className="flex justify-between items-center text-xl font-black text-slate-800">
                        <span>TOTAL</span>
                        <span className="text-emerald-700">GH₵{totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Method</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger className="bg-white border-slate-200 mt-1 h-9"><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cash">Cash (Till)</SelectItem>
                                    <SelectItem value="MoMo">Mobile Money</SelectItem>
                                    <SelectItem value="Card">Bank Card</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col justify-end">
                            {paymentMethod === 'Cash' && (
                                <div className="text-[10px] text-right mb-1">
                                    Till Balance: <span className="font-bold text-emerald-700">GH₵{activeTill?.currentBalance?.toFixed(2) || '0.00'}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md text-md font-bold h-11" 
                        onClick={handleCheckout} 
                        disabled={isProcessing || cart.length === 0}
                    >
                        {isProcessing ? <Loader2 className="mr-2 animate-spin h-5 w-5"/> : <TrendingUp className="mr-2 h-5 w-5"/>}
                        Confirm Sale
                    </Button>
                </div>
            </Card>

            <ReceiptModal data={receiptData} open={!!receiptData} onClose={() => setReceiptData(null)} />
        </div>
    );
}

// --- COMPONENT: Sales Reports & Analytics ---
function SalesAnalyticsTab({ sales, items, schoolId }: { sales: SaleTransaction[] | null; items: ShopItem[]; schoolId: string }) {
    const [search, setSearch] = useState('');
    const [methodFilter, setMethodFilter] = useState('All');

    const analyticsData = useMemo(() => {
        if (!sales) return { totalRevenue: 0, salesCount: 0, categoryRevenue: {} as Record<string, number>, list: [] };
        
        let revenue = 0;
        let count = 0;
        const categoryMap: Record<string, number> = {
            Book: 0,
            Uniform: 0,
            Clothing: 0,
            Stationery: 0,
            Other: 0
        };

        const itemCategories = new Map<string, string>();
        items.forEach(i => itemCategories.set(i.id, i.category));

        const filteredList = sales.filter(sale => {
            const matchesSearch = sale.itemName.toLowerCase().includes(search.toLowerCase());
            const matchesMethod = methodFilter === 'All' || sale.paymentMethod === methodFilter;
            
            if (matchesSearch && matchesMethod) {
                revenue += sale.total;
                count += sale.quantity;
                const cat = itemCategories.get(sale.itemId) || 'Other';
                categoryMap[cat] = (categoryMap[cat] || 0) + sale.total;
                return true;
            }
            return false;
        });

        return {
            totalRevenue: revenue,
            salesCount: filteredList.length,
            categoryRevenue: categoryMap,
            list: filteredList
        };
    }, [sales, items, search, methodFilter]);

    const maxCategoryVal = Math.max(...Object.values(analyticsData.categoryRevenue), 1);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-emerald-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold text-slate-400">Gross Sales Revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-emerald-800">GH₵{analyticsData.totalRevenue.toFixed(2)}</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Accumulated across filtered items</p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold text-slate-400">Total Items Processed</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-slate-800">{analyticsData.list.reduce((sum, s) => sum + s.quantity, 0)} Units</div>
                        <p className="text-[10px] text-muted-foreground mt-1">From {analyticsData.salesCount} sale events</p>
                    </CardContent>
                </Card>

                <Card className="border-emerald-100 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs uppercase font-bold text-slate-400">Top Sale Category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold text-slate-700 capitalize">
                            {Object.entries(analyticsData.categoryRevenue).reduce((a, b) => b[1] > a[1] ? b : a, ['None', 0])[0]}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Highest gross revenue stream</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 shadow-sm border-slate-200">
                    <CardHeader className="pb-3 border-b flex flex-row justify-between items-center gap-4 flex-wrap">
                        <div>
                            <CardTitle className="text-slate-800 text-md font-bold">Transaction Ledger</CardTitle>
                            <CardDescription className="text-xs">Historical log of shop sale receipts.</CardDescription>
                        </div>
                        <div className="flex gap-2 items-center flex-wrap">
                            <div className="relative w-40">
                                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                <Input placeholder="Find item..." size={10} className="pl-8 text-xs h-8" value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                            <Select value={methodFilter} onValueChange={setMethodFilter}>
                                <SelectTrigger className="w-28 text-xs h-8"><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Methods</SelectItem>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="MoMo">MoMo</SelectItem>
                                    <SelectItem value="Card">Card</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs pl-4">Date</TableHead>
                                    <TableHead className="text-xs">Product</TableHead>
                                    <TableHead className="text-xs text-right">Qty</TableHead>
                                    <TableHead className="text-xs text-right">Price</TableHead>
                                    <TableHead className="text-xs text-right">Total</TableHead>
                                    <TableHead className="text-xs text-center">Method</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {analyticsData.list.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-xs">No records found matching filters.</TableCell>
                                    </TableRow>
                                ) : (
                                    analyticsData.list.slice(0, 50).map((sale) => (
                                        <TableRow key={sale.id} className="hover:bg-slate-50/50">
                                            <TableCell className="text-xs text-slate-500 pl-4">{formatDateSafe(sale.date)}</TableCell>
                                            <TableCell className="text-xs font-semibold text-slate-800">{sale.itemName}</TableCell>
                                            <TableCell className="text-xs text-right font-medium">{sale.quantity}</TableCell>
                                            <TableCell className="text-xs text-right">GH₵{sale.priceAtSale.toFixed(2)}</TableCell>
                                            <TableCell className="text-xs text-right font-bold text-slate-700">GH₵{sale.total.toFixed(2)}</TableCell>
                                            <TableCell className="text-xs text-center"><Badge variant="outline" className="text-[9px] uppercase font-bold">{sale.paymentMethod || 'Cash'}</Badge></TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-slate-800 text-md font-bold">Revenue by Category</CardTitle>
                        <CardDescription className="text-xs">Revenue distribution across categories.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                        {Object.entries(analyticsData.categoryRevenue).map(([cat, val]) => {
                            const pct = Math.round((val / maxCategoryVal) * 100);
                            return (
                                <div key={cat} className="space-y-1.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-slate-700">{cat === 'Clothing' ? 'Sports/Friday Wear' : cat}</span>
                                        <span className="font-bold text-slate-800">GH₵{val.toFixed(2)}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div 
                                            className="bg-emerald-600 h-2 rounded-full transition-all duration-500" 
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// --- MAIN PAGE ---
export default function SchoolShopPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { user } = useUser();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
    
    const [restockItem, setRestockItem] = useState<ShopItem | null>(null);
    const [editingItem, setEditingItem] = useState<ShopItem | null>(null);

    // Queries
    const itemsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'school_shop_items'), where('schoolId', '==', schoolId), orderBy('name')) : null, [firestore, schoolId]);
    const { data: items, isLoading, forceRefetch } = useCollection<ShopItem>(itemsQuery);

    const salesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'school_shop_transactions'), where('schoolId', '==', schoolId), orderBy('date', 'desc')) : null, [firestore, schoolId]);
    const { data: sales, isLoading: isLoadingSales, forceRefetch: forceRefetchSales } = useCollection<SaleTransaction>(salesQuery);

    const tillQuery = useMemoFirebase(() => (firestore && schoolId && user) ? query(
        collection(firestore, 'tills'), 
        where('accountantId', '==', user.uid), 
        where('status', '==', 'Open'),
        where('schoolId', '==', schoolId)
    ) : null, [firestore, schoolId, user]);
    const { data: tills, isLoading: isLoadingTills, forceRefetch: forceRefetchTills } = useCollection<any>(tillQuery);

    const activeTill = tills && tills.length > 0 ? tills[0] : null;
    const canManage = role ? ['Administrator', 'Director', 'Accountant'].includes(role) : false;
    const isLoadingPage = isLoadingSchool || isLoading || isLoadingTills;

    if (!canManage) return <div className="p-8 text-center text-red-500">Access Denied. Finance Staff Only.</div>;

    const lowStockItems = items?.filter(i => i.stock <= i.minStock) || [];
    const totalInventoryValue = items?.reduce((sum, item) => sum + (item.price * item.stock), 0) || 0;

    const refreshDashboard = () => {
        forceRefetch();
        forceRefetchSales();
        forceRefetchTills();
    };

    return (
        <>
            <div className="space-y-6 h-full flex flex-col">
                
                {/* Emerald Gradient Banner Header */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 shadow-lg border border-emerald-900/50">
                    <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
                        <ShoppingBag className="w-64 h-64" />
                    </div>
                    <div className="flex justify-between items-start flex-wrap gap-4 relative z-10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2 py-0.5 text-[10px]">POINT OF SALE & INVENTORY</Badge>
                                {activeTill ? (
                                    <Badge className="bg-green-500 text-white hover:bg-green-600 text-[10px] font-bold"><Check className="h-3 w-3 mr-1"/> Till Open</Badge>
                                ) : (
                                    <Badge variant="destructive" className="text-[10px] font-bold animate-pulse"><AlertTriangle className="h-3 w-3 mr-1"/> Till Closed</Badge>
                                )}
                            </div>
                            <h1 className="text-3xl font-black tracking-tight">Merchandise & School Shop</h1>
                            <p className="text-emerald-100/70 text-sm max-w-md">Process receipts for student uniforms, books, stationery, and check real-time stock ledger logs.</p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <Button size="icon" variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10" onClick={refreshDashboard}>
                                <RefreshCw className="h-4 w-4"/>
                            </Button>
                            {schoolId && <ShopManager schoolId={schoolId} onAddItem={forceRefetch}/>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                        <div>
                            <span className="text-[10px] text-emerald-200/60 uppercase font-black tracking-wider block">Total Catalog Items</span>
                            <span className="text-xl font-bold block">{items?.length || 0} Products</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-emerald-200/60 uppercase font-black tracking-wider block">Inventory Asset Value</span>
                            <span className="text-xl font-bold block">GH₵{totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-emerald-200/60 uppercase font-black tracking-wider block">Low Stock Alert</span>
                            <span className={`text-xl font-bold block ${lowStockItems.length > 0 ? 'text-amber-300' : ''}`}>
                                {lowStockItems.length} Products
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] text-emerald-200/60 uppercase font-black tracking-wider block">Staff Inflow Register</span>
                            <span className="text-xl font-bold block text-emerald-300">
                                {activeTill ? `GH₵${activeTill.currentBalance?.toFixed(2)}` : 'No Active Till'}
                            </span>
                        </div>
                    </div>
                </div>

                {lowStockItems.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-center gap-3 text-amber-800 text-xs shadow-sm">
                        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 animate-bounce"/>
                        <div>
                            <span className="font-extrabold mr-1">Alert: Low stock item warning!</span>
                            The following inventory lines need immediate replenishment: <span className="font-semibold">{lowStockItems.map(i => i.name).join(', ')}</span>.
                        </div>
                    </div>
                )}

                <Tabs defaultValue="pos" className="flex-1 flex flex-col">
                    <TabsList className="w-[450px] bg-slate-100 p-1 rounded-xl">
                        <TabsTrigger value="pos" className="rounded-lg font-bold"><ShoppingCart className="h-4 w-4 mr-2"/> POS Cashier</TabsTrigger>
                        <TabsTrigger value="list" className="rounded-lg font-bold"><Package className="h-4 w-4 mr-2"/> Stock Inventory</TabsTrigger>
                        <TabsTrigger value="analytics" className="rounded-lg font-bold"><BarChart2 className="h-4 w-4 mr-2"/> Sales & Reports</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pos" className="flex-1 mt-4">
                        {isLoadingPage ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600 h-10 w-10"/></div>
                        ) : (
                            <PointOfSale 
                                items={items || []} 
                                schoolId={schoolId!} 
                                activeTill={activeTill} 
                                onSaleSuccess={refreshDashboard}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="list" className="flex-1 mt-4">
                        <Card className="shadow-md border-slate-200">
                            <CardHeader className="pb-3 border-b flex flex-row justify-between items-center flex-wrap gap-4">
                                <div>
                                    <CardTitle className="text-slate-800 font-bold text-lg">Merchandise Stock Ledger</CardTitle>
                                    <CardDescription className="text-xs">Adjust product characteristics and replenish inventory status records.</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-50/75">
                                        <TableRow>
                                            <TableHead className="pl-6 font-bold text-xs">Item Name</TableHead>
                                            <TableHead className="font-bold text-xs">Category</TableHead>
                                            <TableHead className="font-bold text-xs">Details Description</TableHead>
                                            <TableHead className="text-right font-bold text-xs">Price (GH₵)</TableHead>
                                            <TableHead className="text-right font-bold text-xs">Current Stock</TableHead>
                                            <TableHead className="text-right pr-6 font-bold text-xs">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items && items.length > 0 ? items.map(item => (
                                            <TableRow key={item.id} className="hover:bg-slate-50/50">
                                                <TableCell className="font-bold text-slate-850 pl-6 text-sm">{item.name}</TableCell>
                                                <TableCell><Badge variant="outline" className="text-[9px] uppercase font-bold">{item.category}</Badge></TableCell>
                                                <TableCell className="text-xs text-slate-500 max-w-xs truncate">{item.description || '-'}</TableCell>
                                                <TableCell className="text-right font-extrabold text-slate-700">GH₵{Number(item.price || 0).toFixed(2)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge className={`font-extrabold rounded-full ${item.stock === 0 ? "bg-red-100 text-red-800" : item.stock <= item.minStock ? "bg-amber-100 text-amber-800" : "bg-green-50 text-green-700"}`} variant="outline">
                                                        {item.stock} units
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right space-x-2 pr-6">
                                                    <Button variant="outline" size="sm" onClick={() => setEditingItem(item)} className="border-slate-350 hover:bg-slate-100 h-8">
                                                        <Edit className="h-3.5 w-3.5 mr-1 text-slate-500"/>
                                                        Edit
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => setRestockItem(item)} className="border-slate-350 hover:bg-slate-100 h-8 text-emerald-700 hover:text-emerald-800">
                                                        <ArchiveRestore className="h-3.5 w-3.5 mr-1"/>
                                                        Restock
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-12 text-slate-400 text-sm">No products found in the database. Click "Add Shop Item" to get started.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="flex-1 mt-4">
                        {isLoadingSales || isLoadingPage ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600 h-10 w-10"/></div>
                        ) : (
                            <SalesAnalyticsTab 
                                sales={sales || []} 
                                items={items || []} 
                                schoolId={schoolId!} 
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
            
            {editingItem && (
                <EditItemDialog
                    item={editingItem}
                    open={!!editingItem}
                    onOpenChange={(val) => !val && setEditingItem(null)}
                    onUpdateComplete={refreshDashboard}
                />
            )}

            {restockItem && (
                <RestockDialog
                    item={restockItem}
                    open={!!restockItem}
                    onOpenChange={() => setRestockItem(null)}
                    onRestockComplete={refreshDashboard}
                />
            )}
        </>
    );
}
