
'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, where, doc, writeBatch, increment, getDocs } from 'firebase/firestore';
import { 
  ShoppingBag, Package, PlusCircle, ShoppingCart, 
  Search, TrendingUp, AlertTriangle, Shirt, Book, PenTool, Trash2
} from 'lucide-react';

// UI
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// --- TYPES ---
interface ShopItem {
    id: string;
    name: string;
    category: 'Uniform' | 'Book' | 'Clothing' | 'Stationery' | 'Other';
    price: number;
    stock: number;
    minStock: number;
    description?: string;
}

interface CartItem extends ShopItem {
    quantity: number;
}

// --- COMPONENT: Add/Restock Shop Item ---
function ShopManager() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Book');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [desc, setDesc] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDoc(collection(firestore, 'school_shop_items'), {
                name,
                category,
                price: parseFloat(price),
                stock: parseInt(stock),
                minStock: 10, 
                description: desc,
                createdAt: serverTimestamp()
            });
            
            // Log transaction
            await addDoc(collection(firestore, 'school_shop_transactions'), {
                type: 'RESTOCK',
                itemName: name,
                quantity: parseInt(stock),
                date: serverTimestamp(),
                notes: 'Initial Stock'
            });

            toast({ title: "Product Added", description: `${name} is now available for sale.` });
            setIsFormOpen(false);
            // Reset
            setName(''); setPrice(''); setStock(''); setDesc('');
        } catch (e) {
            toast({ variant: 'destructive', title: "Error", description: "Failed to add item." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700"><PlusCircle className="mr-2 h-4 w-4"/> Add Shop Item</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Add Merchandise</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Book">Book</SelectItem>
                                <SelectItem value="Uniform">Uniform</SelectItem>
                                <SelectItem value="Clothing">Sports/Friday Wear</SelectItem>
                                <SelectItem value="Stationery">Stationery</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div><Label>Item Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Lacoste Shirt (Large)" required/></div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Price (GH₵)</Label><Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required/></div>
                        <div><Label>Initial Stock</Label><Input type="number" value={stock} onChange={e => setStock(e.target.value)} required/></div>
                    </div>

                    <div><Label>Details (Optional)</Label><Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Size, Subject, etc."/></div>

                    <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700">
                        {isSubmitting ? <Loader2 className="animate-spin"/> : "Save Product"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// --- COMPONENT: Point of Sale (POS) ---
function PointOfSale({ items }: { items: ShopItem[] }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculate Total
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const addToCart = (item: ShopItem) => {
        if (item.stock <= 0) {
            toast({ variant: 'destructive', title: "Out of Stock", description: "Cannot sell this item." });
            return;
        }

        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                if (existing.quantity >= item.stock) return prev; 
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(i => i.id !== id));
    };

    const handleCheckout = async () => {
        if (cart.length === 0 || !user) return;
        setIsProcessing(true);

        try {
            const batch = writeBatch(firestore);
            
            // 1. Handle Till (If Cash)
            if (paymentMethod === 'Cash') {
                const tillQ = query(
                    collection(firestore, 'tills'), 
                    where('accountantId', '==', user.uid), 
                    where('status', '==', 'Open')
                );
                const tillSnap = await getDocs(tillQ);
                
                if (tillSnap.empty) {
                    throw new Error("Please OPEN YOUR TILL before making cash sales.");
                }

                const activeTill = tillSnap.docs[0];
                const transRef = doc(collection(firestore, `tills/${activeTill.id}/transactions`));
                
                batch.set(transRef, {
                    tillId: activeTill.id,
                    amount: totalAmount,
                    type: 'Inflow',
                    description: `Shop Sales: ${cart.length} items`,
                    timestamp: serverTimestamp()
                });
                
                batch.update(doc(firestore, 'tills', activeTill.id), {
                    currentBalance: increment(totalAmount)
                });
            }

            // 2. Decrement Stock & Log
            cart.forEach(item => {
                const itemRef = doc(firestore, 'school_shop_items', item.id);
                batch.update(itemRef, { stock: increment(-item.quantity) });

                const logRef = doc(collection(firestore, 'school_shop_transactions'));
                batch.set(logRef, {
                    type: 'SALE',
                    itemId: item.id,
                    itemName: item.name,
                    quantity: item.quantity,
                    priceAtSale: item.price,
                    total: item.price * item.quantity,
                    soldBy: user.uid,
                    date: serverTimestamp()
                });
            });

            await batch.commit();
            toast({ title: "Sale Complete", description: `Received GH₵${totalAmount.toFixed(2)}` });
            setCart([]);

        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: "Failed", description: e.message });
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredItems = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

    const getIcon = (cat: string) => {
        if (cat === 'Book') return <Book className="h-8 w-8 text-blue-500"/>;
        if (cat === 'Uniform' || cat === 'Clothing') return <Shirt className="h-8 w-8 text-purple-500"/>;
        return <Package className="h-8 w-8 text-slate-500"/>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            
            {/* LEFT: Item Selector */}
            <Card className="lg:col-span-2 flex flex-col overflow-hidden border-emerald-100">
                <CardHeader className="pb-3 bg-emerald-50/50">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search products..." className="pl-8 bg-white" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </CardHeader>
                <ScrollArea className="flex-1 p-4 bg-slate-50/30">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredItems.map(item => (
                            <button 
                                key={item.id} 
                                onClick={() => addToCart(item)}
                                disabled={item.stock === 0}
                                className={`p-4 rounded-xl border text-left transition-all hover:shadow-lg flex flex-col justify-between h-36 ${item.stock === 0 ? 'opacity-60 bg-gray-50' : 'bg-white hover:border-emerald-400'}`}
                            >
                                <div className="flex justify-between items-start w-full">
                                    <div className="bg-slate-50 p-2 rounded-lg">{getIcon(item.category)}</div>
                                    <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-sm line-clamp-2 text-slate-700">{item.name}</h4>
                                    <div className="flex justify-between items-end mt-1">
                                        <span className="font-bold text-emerald-700 text-lg">₵{item.price.toFixed(2)}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${item.stock < item.minStock ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {item.stock} left
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

            {/* RIGHT: Cart & Checkout */}
            <Card className="flex flex-col h-full border-l-4 border-l-emerald-500 shadow-xl bg-white">
                <CardHeader className="pb-4 bg-emerald-50 border-b border-emerald-100">
                    <CardTitle className="flex items-center gap-2 text-emerald-800"><ShoppingCart className="h-5 w-5"/> Sale Cart</CardTitle>
                </CardHeader>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                            <ShoppingBag className="h-12 w-12 mb-2"/>
                            <p>Select items to sell</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div>
                                    <p className="font-medium text-sm text-slate-800">{item.name}</p>
                                    <p className="text-xs text-slate-500">{item.quantity} x ₵{item.price}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="font-bold text-slate-700">₵{(item.quantity * item.price).toFixed(2)}</p>
                                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-6 bg-slate-50 border-t space-y-4">
                    <div className="flex justify-between items-center text-xl font-bold text-slate-800">
                        <span>Total</span>
                        <span>GH₵{totalAmount.toFixed(2)}</span>
                    </div>
                    <div>
                        <Label className="text-xs uppercase text-slate-400 font-bold">Payment Method</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger className="bg-white border-slate-300 mt-1"><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cash">Cash (To Till)</SelectItem>
                                <SelectItem value="MoMo">Mobile Money</SelectItem>
                                <SelectItem value="Card">Card</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 size-lg shadow-lg text-lg font-bold" onClick={handleCheckout} disabled={isProcessing || cart.length === 0}>
                        {isProcessing ? <Loader2 className="mr-2 animate-spin"/> : <TrendingUp className="mr-2 h-5 w-5"/>}
                        Confirm Sale
                    </Button>
                </div>
            </Card>
        </div>
    );
}

// --- MAIN PAGE ---
export default function SchoolShopPage() {
    const { role } = useRole();
    const firestore = useFirestore();

    const itemsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'school_shop_items'), orderBy('name')) : null, [firestore]);
    const { data: items, isLoading } = useCollection<ShopItem>(itemsQuery);

    const canManage = ['Administrator', 'Director', 'Accountant'].includes(role);

    if (!canManage) return <div className="p-8 text-center text-red-500">Access Denied. Finance Staff Only.</div>;

    const lowStockItems = items?.filter(i => i.stock <= i.minStock) || [];

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800"><ShoppingBag className="text-emerald-600"/> School Shop</h1>
                    <p className="text-muted-foreground">Sell uniforms, books, and supplies.</p>
                </div>
                <ShopManager />
            </div>

            {lowStockItems.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 p-3 rounded-md flex items-center gap-3 text-orange-800 text-sm animate-pulse">
                    <AlertTriangle className="h-5 w-5"/>
                    <span className="font-semibold">Low Stock Alert:</span>
                    {lowStockItems.map(i => i.name).join(', ')} need restocking.
                </div>
            )}

            <Tabs defaultValue="pos" className="flex-1 flex flex-col">
                <TabsList className="w-[300px]">
                    <TabsTrigger value="pos">Point of Sale</TabsTrigger>
                    <TabsTrigger value="list">Inventory List</TabsTrigger>
                </TabsList>

                <TabsContent value="pos" className="flex-1 mt-4">
                    {isLoading ? <Loader2 className="mx-auto mt-20 animate-spin text-emerald-600"/> : <PointOfSale items={items || []} />}
                </TabsContent>

                <TabsContent value="list">
                    <Card>
                        <CardHeader><CardTitle>Merchandise Inventory</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Details</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Stock</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items?.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{item.description || '-'}</TableCell>
                                            <TableCell className="text-right">₵{item.price.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">
                                                <span className={`font-bold ${item.stock <= item.minStock ? "text-red-600" : "text-green-600"}`}>
                                                    {item.stock}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
