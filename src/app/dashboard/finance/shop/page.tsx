'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, where, doc, writeBatch, increment, updateDoc, getDocs, getDoc, deleteDoc } from 'firebase/firestore';
import { 
  ShoppingBag, Package, PlusCircle, ShoppingCart, 
  Search, TrendingUp, AlertTriangle, Shirt, Book, PenTool, Trash2, ArchiveRestore, Edit, Loader2,
  Check, Printer, RefreshCw, BarChart2, DollarSign, ArrowRight, History, Wallet, CreditCard, Coins, X, Plus, Minus,
  Sparkles, Layers, CheckCircle2
} from 'lucide-react';
import { ParentStorefront } from '@/components/shop/parent-storefront';
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
    buyerName?: string;
    date: Date;
    items: { name: string; quantity: number; price: number; total: number }[];
    total: number;
    paymentMethod: string;
    soldBy: string;
}

function ReceiptModal({ data, open, onClose, schoolProfile }: { data: ReceiptData | null; open: boolean; onClose: () => void; schoolProfile: any }) {
    if (!data) return null;

    const schoolName = schoolProfile?.name || 'GAM SCHOOLS SHOP';
    const schoolAddress = schoolProfile?.address || '';
    const schoolPhone = schoolProfile?.phone ? `Tel: ${schoolProfile.phone}` : (schoolProfile?.telephone ? `Tel: ${schoolProfile.telephone}` : '');
    const schoolEmail = schoolProfile?.email ? `Email: ${schoolProfile.email}` : '';

    const handlePrint = (format: 'thermal' | 'a5') => {
        const printWindow = window.open('', '_blank', 'width=700,height=800');
        if (!printWindow) return;
        
        const htmlContent = format === 'a5' ? `
            <html>
            <head>
                <title>Receipt ${data.receiptNo}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                    body {
                        font-family: 'Inter', sans-serif;
                        font-size: 13px;
                        color: #1e293b;
                        padding: 30px;
                        margin: 0;
                        background: #fff;
                        max-width: 650px;
                        margin: 0 auto;
                    }
                    .header-grid {
                        display: grid;
                        grid-template-cols: 1fr 1fr;
                        gap: 20px;
                        border-bottom: 2px solid #cbd5e1;
                        padding-bottom: 20px;
                        margin-bottom: 25px;
                    }
                    .school-info {
                        display: flex;
                        flex-direction: column;
                    }
                    .school-name {
                        font-size: 20px;
                        font-weight: 800;
                        color: #0f172a;
                        margin-bottom: 5px;
                        letter-spacing: -0.025em;
                        text-transform: uppercase;
                    }
                    .school-details {
                        font-size: 12px;
                        color: #64748b;
                        line-height: 1.5;
                    }
                    .receipt-info {
                        text-align: right;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }
                    .receipt-title {
                        font-size: 22px;
                        font-weight: 900;
                        color: #059669;
                        letter-spacing: 0.05em;
                        margin-bottom: 10px;
                    }
                    .meta-item {
                        font-size: 12px;
                        color: #334155;
                        margin-bottom: 4px;
                    }
                    .meta-item strong {
                        color: #0f172a;
                    }
                    .items-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                        margin-bottom: 25px;
                    }
                    .items-table th {
                        background-color: #f8fafc;
                        color: #475569;
                        font-weight: 700;
                        text-align: left;
                        padding: 12px 14px;
                        font-size: 11px;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        border-bottom: 2px solid #e2e8f0;
                    }
                    .items-table td {
                        padding: 14px 14px;
                        border-bottom: 1px solid #e2e8f0;
                        color: #334155;
                    }
                    .items-table tr:last-child td {
                        border-bottom: none;
                    }
                    .text-right { text-align: right; }
                    .total-box {
                        display: flex;
                        justify-content: flex-end;
                        margin-top: 15px;
                    }
                    .total-card {
                        background-color: #ecfdf5;
                        border: 1px solid #a7f3d0;
                        border-radius: 8px;
                        padding: 15px 20px;
                        width: 250px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .total-label {
                        font-size: 12px;
                        font-weight: 700;
                        color: #065f46;
                    }
                    .total-val {
                        font-size: 18px;
                        font-weight: 900;
                        color: #047857;
                    }
                    .footer-notes {
                        margin-top: 50px;
                        border-top: 1px solid #e2e8f0;
                        padding-top: 15px;
                        text-align: center;
                        font-size: 11px;
                        color: #94a3b8;
                    }
                    .stamp-container {
                        position: relative;
                    }
                    .paid-stamp {
                        position: absolute;
                        right: 30px;
                        bottom: 80px;
                        border: 3px double #059669;
                        color: #059669;
                        font-size: 14px;
                        font-weight: 900;
                        text-transform: uppercase;
                        padding: 5px 15px;
                        border-radius: 6px;
                        transform: rotate(-12deg);
                        opacity: 0.85;
                        letter-spacing: 0.1em;
                    }
                    @media print {
                        body { padding: 0; margin: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="header-grid">
                    <div class="school-info">
                        <div class="school-name">${schoolName}</div>
                        <div class="school-details">
                            ${schoolAddress ? `<div>${schoolAddress}</div>` : ''}
                            ${schoolPhone ? `<div>${schoolPhone}</div>` : ''}
                            ${schoolEmail ? `<div>${schoolEmail}</div>` : ''}
                        </div>
                    </div>
                    <div class="receipt-info">
                        <div class="receipt-title">SALES RECEIPT</div>
                        <div>
                            <div class="meta-item"><strong>Receipt No:</strong> #${data.receiptNo}</div>
                            <div class="meta-item"><strong>Date:</strong> ${data.date.toLocaleString()}</div>
                            <div class="meta-item"><strong>Payment Method:</strong> ${data.paymentMethod}</div>
                            <div class="meta-item"><strong>Issued By:</strong> ${data.soldBy.substring(0, 8)}</div>
                        </div>
                    </div>
                </div>

                <div class="meta-item" style="margin-bottom: 15px; font-size: 13px;">
                    <strong>Bill To / Buyer:</strong> ${data.buyerName || 'Guest Buyer'}
                </div>

                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th class="text-right">Unit Price</th>
                            <th class="text-right">Qty</th>
                            <th class="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.items.map(item => `
                            <tr>
                                <td style="font-weight: 600; color: #0f172a;">${item.name}</td>
                                <td class="text-right">GH₵${item.price.toFixed(2)}</td>
                                <td class="text-right">${item.quantity}</td>
                                <td class="text-right" style="font-weight: 700;">GH₵${item.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="stamp-container">
                    <div class="paid-stamp">PAID</div>
                </div>

                <div class="total-box">
                    <div class="total-card">
                        <span class="total-label">TOTAL PAID</span>
                        <span class="total-val">GH₵${data.total.toFixed(2)}</span>
                    </div>
                </div>

                <div class="footer-notes">
                    <p>Thank you for your business!</p>
                    <p>Items purchased cannot be refunded after 7 days.</p>
                </div>

                <script>
                    window.onload = function() { 
                        window.print(); 
                    };
                    window.onafterprint = function() {
                        window.close();
                    };
                </script>
            </body>
            </html>
        ` : `
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
                    <div class="title">${schoolName.toUpperCase()}</div>
                    ${schoolAddress ? `<div>${schoolAddress}</div>` : ''}
                    ${schoolPhone || schoolEmail ? `<div>${[schoolPhone, schoolEmail].filter(Boolean).join(' | ')}</div>` : ''}
                    <div style="font-size: 11px; margin-top: 5px; text-decoration: underline;">Official Sales Receipt</div>
                </div>
                <div class="divider"></div>
                <div><strong>Receipt No:</strong> ${data.receiptNo}</div>
                <div><strong>Buyer:</strong> ${data.buyerName || 'Guest Buyer'}</div>
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
                    window.onload = function() { 
                        window.print(); 
                    };
                    window.onafterprint = function() {
                        window.close();
                    };
                </script>
            </body>
            </html>
        `;
        printWindow.document.write(htmlContent);
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
                        <span className="font-bold text-sm block tracking-wider uppercase text-slate-900">{schoolName}</span>
                        {schoolAddress && <span className="block text-[11px] text-slate-500">{schoolAddress}</span>}
                        {(schoolPhone || schoolEmail) && <span className="block text-[10px] text-slate-500">{[schoolPhone, schoolEmail].filter(Boolean).join(' | ')}</span>}
                        <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wide pt-1">Official Transaction Record</span>
                    </div>
                    <div className="border-b border-dashed border-slate-300 pb-2 space-y-1">
                        <div><strong>Receipt No:</strong> <span className="text-slate-900">{data.receiptNo}</span></div>
                        <div><strong>Buyer:</strong> <span className="text-slate-950 font-bold">{data.buyerName || 'Guest Buyer'}</span></div>
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

                <DialogFooter className="grid grid-cols-3 gap-2 mt-2">
                    <Button variant="outline" onClick={onClose} className="w-full text-xs font-bold">Dismiss</Button>
                    <Button onClick={() => handlePrint('thermal')} className="w-full bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold"><Printer className="mr-1 h-3.5 w-3.5" /> Thermal</Button>
                    <Button onClick={() => handlePrint('a5')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"><Printer className="mr-1 h-3.5 w-3.5" /> A5 Sheet</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- COMPONENT: Point of Sale (POS) ---
function PointOfSale({ items, schoolId, activeTill, onSaleSuccess, onShowReceipt, students, staff, schoolProfile }: { items: ShopItem[], schoolId: string, activeTill: any, onSaleSuccess: () => void, onShowReceipt: (data: ReceiptData) => void, students: any[] | null, staff: any[] | null, schoolProfile: any }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('All');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [isProcessing, setIsProcessing] = useState(false);
    const [buyerName, setBuyerName] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const suggestions = useMemo(() => {
        if (!buyerName.trim()) return [];
        const searchLower = buyerName.toLowerCase();
        
        const matches: any[] = [];
        
        if (students) {
            students.forEach((s: any) => {
                const fullName = `${s.firstName || ''} ${s.lastName || ''} ${s.otherNames || ''}`.trim();
                if (fullName.toLowerCase().includes(searchLower) || (s.studentId && s.studentId.toLowerCase().includes(searchLower))) {
                    matches.push({
                        id: s.id,
                        name: fullName,
                        type: 'Student',
                        detail: s.className || 'Student'
                    });
                }
            });
        }
        
        if (staff) {
            staff.forEach((s: any) => {
                const fullName = `${s.firstName || ''} ${s.lastName || ''}`.trim();
                if (fullName.toLowerCase().includes(searchLower) || (s.email && s.email.toLowerCase().includes(searchLower))) {
                    matches.push({
                        id: s.id,
                        name: fullName,
                        type: 'Staff',
                        detail: s.role || 'Staff'
                    });
                }
            });
        }
        
        return matches.slice(0, 5); // Limit to top 5 suggestions
    }, [buyerName, students, staff]);

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
        
        const tillMode = schoolProfile?.shopTillMode || 'cashier';
        if (paymentMethod === 'Cash' && tillMode !== 'disabled' && tillMode !== 'shop_drawer' && !activeTill) {
            toast({ variant: 'destructive', title: "Till Closed", description: "Please OPEN YOUR TILL before making cash sales." });
            return;
        }

        setIsProcessing(true);
        try {
            const batch = writeBatch(firestore!);
            const transactionId = doc(collection(firestore!, 'school_shop_transactions')).id;
            const logRef = doc(firestore!, 'school_shop_transactions', transactionId);
            
            if (paymentMethod === 'Cash' && tillMode === 'shop_drawer' && !activeTill) {
                const newDrawerRef = doc(collection(firestore!, 'tills'));
                batch.set(newDrawerRef, {
                    id: newDrawerRef.id,
                    tillName: "School Shop Cash Drawer",
                    accountantId: "shop_drawer",
                    accountantName: "School Shop",
                    status: "Open",
                    currentBalance: totalAmount,
                    isShopDrawer: true,
                    schoolId: schoolId,
                    createdAt: serverTimestamp()
                });
                
                const transRef = doc(collection(firestore!, `tills/${newDrawerRef.id}/transactions`));
                batch.set(transRef, {
                    tillId: newDrawerRef.id,
                    amount: totalAmount,
                    type: 'Inflow',
                    description: `Shop Sales (Receipt: #${transactionId.substring(0, 8).toUpperCase()})`,
                    timestamp: serverTimestamp(),
                    schoolId: schoolId,
                });
            } else if (paymentMethod === 'Cash' && tillMode !== 'disabled' && activeTill) {
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
            });

            const receiptItems = cart.map(i => ({
                itemId: i.id,
                name: i.name,
                quantity: i.quantity,
                price: i.price,
                total: i.price * i.quantity
            }));

            const finalBuyerName = buyerName.trim() || 'Guest Buyer';

            batch.set(logRef, {
                receiptNo: transactionId.substring(0, 8).toUpperCase(),
                buyerName: finalBuyerName,
                paymentMethod: paymentMethod,
                soldBy: user.uid,
                soldByName: user.displayName || user.email || 'Cashier',
                date: serverTimestamp(),
                schoolId: schoolId,
                total: totalAmount,
                items: receiptItems
            });

            await batch.commit();

            // Prepare Receipt Data
            const receiptData: ReceiptData = {
                receiptNo: transactionId.substring(0, 8).toUpperCase(),
                buyerName: finalBuyerName,
                date: new Date(),
                items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, total: i.price * i.quantity })),
                total: totalAmount,
                paymentMethod: paymentMethod,
                soldBy: user.displayName || user.email || user.uid,
            };

            toast({ title: "Sale Complete", description: `Received GH₵${totalAmount.toFixed(2)} via ${paymentMethod}` });
            setCart([]);
            setBuyerName('');
            onSaleSuccess();
            onShowReceipt(receiptData);

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

                    <div className="space-y-2 relative">
                        <Label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Buyer Name / Student (Optional)</Label>
                        <Input 
                            placeholder="Search student/staff or type name..." 
                            value={buyerName} 
                            onChange={e => {
                                setBuyerName(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            className="h-9 mt-0.5 border-slate-200 text-xs bg-white"
                        />
                        {showSuggestions && buyerName.trim() && (
                            <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto font-sans text-xs">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowSuggestions(false);
                                    }}
                                    className="w-full text-left px-3 py-2 bg-slate-55/60 hover:bg-slate-100 hover:text-slate-900 transition-colors border-b border-slate-200 flex justify-between items-center text-slate-500 font-semibold"
                                >
                                    <span>Use custom name: "{buyerName}"</span>
                                    <Badge variant="outline" className="text-[9px] font-bold border-slate-300 text-slate-500">Custom Option</Badge>
                                </button>
                                {suggestions.map((s: any) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => {
                                            setBuyerName(`${s.name} (${s.detail})`);
                                            setShowSuggestions(false);
                                        }}
                                        className="w-full text-left px-3 py-2 hover:bg-emerald-50 hover:text-emerald-800 transition-colors border-b last:border-b-0 border-slate-100 flex justify-between items-center"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-800">{s.name}</span>
                                            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">{s.type}</span>
                                        </div>
                                        <Badge variant="secondary" className="text-[9px] font-bold bg-slate-100 text-slate-600">{s.detail}</Badge>
                                    </button>
                                ))}
                            </div>
                        )}
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
        </div>
    );
}

// --- COMPONENT: Sales Reports & Analytics ---
function SalesAnalyticsTab({ sales, items, schoolId, onShowReceipt }: { sales: SaleTransaction[] | null; items: ShopItem[]; schoolId: string; onShowReceipt: (data: ReceiptData) => void }) {
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

        const flattenedSales: any[] = [];
        sales.forEach(sale => {
            // Check if sale has nested items (our new format)
            if (Array.isArray((sale as any).items)) {
                (sale as any).items.forEach((item: any) => {
                    flattenedSales.push({
                        id: `${sale.id}-${item.itemId || item.id}`,
                        receiptNo: (sale as any).receiptNo || sale.id.substring(0, 8).toUpperCase(),
                        buyerName: (sale as any).buyerName || 'Guest Buyer',
                        date: sale.date,
                        itemId: item.itemId || item.id,
                        itemName: item.name || item.itemName,
                        quantity: item.quantity,
                        priceAtSale: item.price || item.priceAtSale,
                        total: item.total || (item.price * item.quantity),
                        paymentMethod: sale.paymentMethod,
                        soldBy: sale.soldBy,
                        rawSale: sale // reference to original sale for re-printing
                    });
                });
            } else {
                // Backward compatibility for old format
                flattenedSales.push({
                    id: sale.id,
                    receiptNo: sale.id.substring(0, 8).toUpperCase(),
                    buyerName: 'Guest Buyer',
                    date: sale.date,
                    itemId: sale.itemId,
                    itemName: sale.itemName,
                    quantity: sale.quantity,
                    priceAtSale: sale.priceAtSale,
                    total: sale.total,
                    paymentMethod: sale.paymentMethod,
                    soldBy: sale.soldBy,
                    rawSale: {
                        receiptNo: sale.id.substring(0, 8).toUpperCase(),
                        buyerName: 'Guest Buyer',
                        date: sale.date,
                        items: [{ name: sale.itemName, quantity: sale.quantity, price: sale.priceAtSale, total: sale.total }],
                        total: sale.total,
                        paymentMethod: sale.paymentMethod,
                        soldBy: sale.soldBy
                    }
                });
            }
        });

        const filteredList = flattenedSales.filter(sale => {
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

    const handlePrintPastReceipt = (rawSale: any) => {
        let saleDate = new Date();
        if (rawSale.date) {
            if (rawSale.date.toDate) {
                saleDate = rawSale.date.toDate();
            } else if (rawSale.date.seconds) {
                saleDate = new Date(rawSale.date.seconds * 1000);
            } else {
                saleDate = new Date(rawSale.date);
            }
        }

        // Map Firebase record attributes to ReceiptData structure
        onShowReceipt({
            receiptNo: rawSale.receiptNo || rawSale.id?.substring(0, 8).toUpperCase() || 'SHOP',
            buyerName: rawSale.buyerName || 'Guest Buyer',
            date: saleDate,
            items: Array.isArray(rawSale.items) 
                ? rawSale.items.map((i: any) => ({ name: i.name, quantity: i.quantity, price: i.price, total: i.total }))
                : [{ name: rawSale.itemName, quantity: rawSale.quantity, price: rawSale.priceAtSale, total: rawSale.total }],
            total: rawSale.total,
            paymentMethod: rawSale.paymentMethod || 'Cash',
            soldBy: rawSale.soldByName || rawSale.soldBy || 'Cashier'
        });
    };

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
                                    <TableHead className="text-xs pl-4">Receipt #</TableHead>
                                    <TableHead className="text-xs">Buyer</TableHead>
                                    <TableHead className="text-xs">Product</TableHead>
                                    <TableHead className="text-xs text-right">Qty</TableHead>
                                    <TableHead className="text-xs text-right">Price</TableHead>
                                    <TableHead className="text-xs text-right">Total</TableHead>
                                    <TableHead className="text-xs text-center font-bold">Print</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {analyticsData.list.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">No records found matching filters.</TableCell>
                                    </TableRow>
                                ) : (
                                    analyticsData.list.slice(0, 50).map((sale) => (
                                        <TableRow key={sale.id} className="hover:bg-slate-50/50">
                                            <TableCell className="text-xs font-mono font-bold text-slate-500 pl-4">#{sale.receiptNo}</TableCell>
                                            <TableCell className="text-xs font-semibold text-slate-700">{sale.buyerName}</TableCell>
                                            <TableCell className="text-xs font-semibold text-slate-800">{sale.itemName}</TableCell>
                                            <TableCell className="text-xs text-right font-medium">{sale.quantity}</TableCell>
                                            <TableCell className="text-xs text-right">GH₵{sale.priceAtSale.toFixed(2)}</TableCell>
                                            <TableCell className="text-xs text-right font-bold text-slate-700">GH₵{sale.total.toFixed(2)}</TableCell>
                                            <TableCell className="text-xs text-center">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handlePrintPastReceipt(sale.rawSale)} 
                                                    className="h-8 w-8 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-full"
                                                >
                                                    <Printer size={14} />
                                                </Button>
                                            </TableCell>
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

// --- COMPONENT: Academic Bundles & Term Kits Manager ---
interface AcademicBundleItem {
    itemId: string;
    name: string;
    category: 'Uniform' | 'Book' | 'Clothing' | 'Stationery' | 'Other';
    price: number;
    quantity: number;
    defaultSize?: string;
}

interface AcademicBundle {
    id: string;
    name: string;
    gradeLevel: string;
    term: string;
    description?: string;
    bundlePrice: number;
    originalPrice: number;
    badgeText?: string;
    items: AcademicBundleItem[];
    schoolId: string;
    createdAt?: any;
}

function AcademicBundlesTab({ items, schoolId, onRefresh }: { items: ShopItem[]; schoolId: string; onRefresh: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch existing school classes from Firestore
    const classesQuery = useMemoFirebase(
        () => (firestore && schoolId ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null),
        [firestore, schoolId]
    );
    const { data: schoolClasses } = useCollection<any>(classesQuery);

    // Form state
    const [name, setName] = useState('');
    const [gradeLevel, setGradeLevel] = useState('Grade 4');
    const [term, setTerm] = useState('Term 1');
    const [desc, setDesc] = useState('');
    const [bundlePrice, setBundlePrice] = useState('');
    const [badgeText, setBadgeText] = useState('Save 10%');

    // Selection map: itemId -> { selected: boolean, quantity: number, defaultSize: string }
    const [selectedItemsMap, setSelectedItemsMap] = useState<Record<string, { selected: boolean; quantity: number; defaultSize: string }>>({});

    const bundlesQuery = useMemoFirebase(
        () => (firestore && schoolId ? query(collection(firestore, 'school_academic_bundles'), where('schoolId', '==', schoolId)) : null),
        [firestore, schoolId]
    );
    const { data: rawBundles, isLoading, forceRefetch } = useCollection<AcademicBundle>(bundlesQuery);

    const bundles = useMemo(() => {
        if (!rawBundles) return [];
        return [...rawBundles].sort((a, b) => (a.gradeLevel || '').localeCompare(b.gradeLevel || ''));
    }, [rawBundles]);

    const availableGradeLevels = useMemo(() => {
        if (schoolClasses && schoolClasses.length > 0) {
            const customList: string[] = [];
            schoolClasses.forEach((c: any) => {
                const name = c.name || c.gradeLevel;
                if (name && !customList.includes(name)) {
                    customList.push(name);
                }
            });
            if (customList.length > 0) {
                return customList.sort((a, b) => a.localeCompare(b));
            }
        }
        // Fallback default grade levels only if no system classes are created yet
        return [
            'Creche / Nursery', 'Kindergarten 1', 'Kindergarten 2',
            'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
            'JHS 1', 'JHS 2', 'JHS 3', 'SHS 1', 'SHS 2', 'SHS 3'
        ];
    }, [schoolClasses]);

    // Ensure selected gradeLevel defaults to first valid option when modal opens or classes load
    useEffect(() => {
        if (availableGradeLevels.length > 0 && !availableGradeLevels.includes(gradeLevel)) {
            setGradeLevel(availableGradeLevels[0]);
        }
    }, [availableGradeLevels]);

    const toggleItemSelection = (itemId: string) => {
        setSelectedItemsMap(prev => {
            const current = prev[itemId] || { selected: false, quantity: 1, defaultSize: 'Medium' };
            return {
                ...prev,
                [itemId]: { ...current, selected: !current.selected }
            };
        });
    };

    const updateItemQuantity = (itemId: string, quantity: number) => {
        if (quantity < 1) return;
        setSelectedItemsMap(prev => {
            const current = prev[itemId] || { selected: true, quantity: 1, defaultSize: 'Medium' };
            return {
                ...prev,
                [itemId]: { ...current, quantity }
            };
        });
    };

    const updateItemSize = (itemId: string, defaultSize: string) => {
        setSelectedItemsMap(prev => {
            const current = prev[itemId] || { selected: true, quantity: 1, defaultSize: 'Medium' };
            return {
                ...prev,
                [itemId]: { ...current, defaultSize }
            };
        });
    };

    const calculatedOriginalPrice = useMemo(() => {
        let sum = 0;
        Object.entries(selectedItemsMap).forEach(([itemId, conf]) => {
            if (conf.selected) {
                const shopItem = items.find(i => i.id === itemId);
                if (shopItem) {
                    sum += shopItem.price * conf.quantity;
                }
            }
        });
        return sum;
    }, [selectedItemsMap, items]);

    const handleCreateBundle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !schoolId) return;

        const bundleItems: AcademicBundleItem[] = [];
        Object.entries(selectedItemsMap).forEach(([itemId, conf]) => {
            if (conf.selected) {
                const shopItem = items.find(i => i.id === itemId);
                if (shopItem) {
                    const itemData: any = {
                        itemId: shopItem.id,
                        name: shopItem.name,
                        category: shopItem.category,
                        price: Number(shopItem.price || 0),
                        quantity: Number(conf.quantity || 1),
                    };
                    if (shopItem.category === 'Uniform' || shopItem.category === 'Clothing') {
                        itemData.defaultSize = conf.defaultSize || 'Medium';
                    }
                    bundleItems.push(itemData);
                }
            }
        });

        if (bundleItems.length === 0) {
            toast({ variant: 'destructive', title: 'No Items Selected', description: 'Please select at least 1 inventory product to include in the bundle.' });
            return;
        }

        const matchedClass = schoolClasses?.find((c: any) => c.name === gradeLevel || c.gradeLevel === gradeLevel);
        const bPrice = parseFloat(bundlePrice) || calculatedOriginalPrice;

        setIsSubmitting(true);
        try {
            const bundlePayload: any = {
                name: name.trim() || `${gradeLevel} ${term} Starter Pack`,
                gradeLevel: gradeLevel || 'Grade 4',
                classId: matchedClass?.id || null,
                term: term || 'Term 1',
                description: desc.trim() || `Complete textbook, uniform, and stationery pack for ${gradeLevel} ${term}.`,
                bundlePrice: Number(bPrice || 0),
                originalPrice: Number(calculatedOriginalPrice || 0),
                badgeText: badgeText ? badgeText.trim() : 'Save 10%',
                items: bundleItems,
                schoolId: schoolId,
                createdAt: serverTimestamp()
            };

            await addDoc(collection(firestore, 'school_academic_bundles'), bundlePayload);

            toast({ title: 'Bundle Created', description: `${name || gradeLevel} starter kit is now active for parents.` });
            forceRefetch();
            setIsCreateOpen(false);
            setName(''); setDesc(''); setBundlePrice(''); setSelectedItemsMap({});
        } catch (err) {
            console.error('Error creating bundle:', err);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to create academic bundle.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteBundle = async (bundleId: string, bundleName: string) => {
        if (!firestore) return;
        if (!confirm(`Are you sure you want to delete "${bundleName}"?`)) return;
        try {
            await deleteDoc(doc(firestore, 'school_academic_bundles', bundleId));
            toast({ title: 'Bundle Removed', description: `${bundleName} has been deleted.` });
            forceRefetch();
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not delete bundle.' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-row justify-between items-center flex-wrap gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-emerald-600"/>
                        Grade Academic Bundles & Term Starter Kits
                    </h3>
                    <p className="text-xs text-slate-500">Create one-click bundles combining required textbooks, uniforms, and stationery per grade level.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold shadow-md">
                            <Plus className="mr-2 h-4 w-4"/> Create Starter Kit Bundle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-emerald-700">
                                <Sparkles className="h-5 w-5"/> Create Term Starter Kit Bundle
                            </DialogTitle>
                            <DialogDescription>Bundle required textbooks, uniforms, and stationery for a specific grade level into a 1-click pack.</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleCreateBundle} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Grade Level / Class</Label>
                                    <Select value={gradeLevel} onValueChange={setGradeLevel}>
                                        <SelectTrigger className="mt-1"><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {schoolClasses && schoolClasses.length > 0 && (
                                                <div className="px-2 py-1 text-[10px] font-black text-emerald-700 uppercase tracking-wider bg-emerald-50">
                                                    School Active Classes ({schoolClasses.length})
                                                </div>
                                            )}
                                            {availableGradeLevels.map(g => (
                                                <SelectItem key={g} value={g}>{g}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Academic Term</Label>
                                    <Select value={term} onValueChange={setTerm}>
                                        <SelectTrigger className="mt-1"><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Term 1">Term 1</SelectItem>
                                            <SelectItem value="Term 2">Term 2</SelectItem>
                                            <SelectItem value="Term 3">Term 3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label>Bundle Name</Label>
                                <Input 
                                    value={name} 
                                    onChange={e => setName(e.target.value)} 
                                    placeholder={`e.g. ${gradeLevel} ${term} Complete Starter Kit`} 
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label>Description (Optional)</Label>
                                <Textarea 
                                    value={desc} 
                                    onChange={e => setDesc(e.target.value)} 
                                    placeholder="e.g. Includes all compulsory textbooks, exercise books, sportswear, and daily uniform set." 
                                    className="mt-1 h-16 text-xs"
                                />
                            </div>

                            <div>
                                <Label className="font-bold text-slate-800 block mb-2">Select Products to Include in Kit:</Label>
                                <div className="border rounded-xl p-3 max-h-56 overflow-y-auto space-y-2.5 bg-slate-50">
                                    {items.length === 0 ? (
                                        <p className="text-xs text-slate-400 text-center py-4">No shop products available. Add items in Stock Inventory tab first.</p>
                                    ) : (
                                        items.map(item => {
                                            const conf = selectedItemsMap[item.id] || { selected: false, quantity: 1, defaultSize: 'Medium' };
                                            return (
                                                <div key={item.id} className={`p-2.5 rounded-lg border transition-all flex items-center justify-between gap-3 text-xs ${conf.selected ? 'bg-emerald-50/80 border-emerald-300' : 'bg-white border-slate-200'}`}>
                                                    <div className="flex items-center gap-2.5 cursor-pointer flex-1" onClick={() => toggleItemSelection(item.id)}>
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${conf.selected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                                                            {conf.selected && <Check className="w-3 h-3 stroke-[3]" />}
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-slate-800">{item.name}</span>
                                                            <span className="text-[10px] text-slate-500 block">GH₵{item.price.toFixed(2)} • Stock: {item.stock} • <span className="uppercase">{item.category}</span></span>
                                                        </div>
                                                    </div>

                                                    {conf.selected && (
                                                        <div className="flex items-center gap-2">
                                                            {(item.category === 'Uniform' || item.category === 'Clothing') && (
                                                                <Select value={conf.defaultSize} onValueChange={(sz) => updateItemSize(item.id, sz)}>
                                                                    <SelectTrigger className="h-7 text-[10px] w-24 bg-white"><SelectValue/></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Small">Small</SelectItem>
                                                                        <SelectItem value="Medium">Medium</SelectItem>
                                                                        <SelectItem value="Large">Large</SelectItem>
                                                                        <SelectItem value="X-Large">X-Large</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                            <div className="flex items-center border rounded bg-white">
                                                                <button type="button" className="px-1.5 py-0.5 hover:bg-slate-100" onClick={() => updateItemQuantity(item.id, conf.quantity - 1)}>-</button>
                                                                <span className="px-2 font-bold">{conf.quantity}</span>
                                                                <button type="button" className="px-1.5 py-0.5 hover:bg-slate-100" onClick={() => updateItemQuantity(item.id, conf.quantity + 1)}>+</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-600 font-medium">Calculated Individual Items Total:</span>
                                    <span className="font-bold text-slate-800">GH₵{calculatedOriginalPrice.toFixed(2)}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-emerald-200/60">
                                    <div>
                                        <Label className="text-xs">Bundled Pack Price (GH₵)</Label>
                                        <Input 
                                            type="number" 
                                            step="0.01" 
                                            value={bundlePrice} 
                                            onChange={e => setBundlePrice(e.target.value)} 
                                            placeholder={`GH₵${calculatedOriginalPrice.toFixed(2)}`} 
                                            className="mt-1 h-8 text-xs bg-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Discount Badge Text</Label>
                                        <Input 
                                            value={badgeText} 
                                            onChange={e => setBadgeText(e.target.value)} 
                                            placeholder="e.g. Save 10% or Recommended" 
                                            className="mt-1 h-8 text-xs bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Save & Publish Academic Starter Kit
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* List of active bundles */}
            {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-emerald-600 h-8 w-8"/></div>
            ) : !bundles || bundles.length === 0 ? (
                <Card className="border-dashed border-2 p-8 text-center bg-slate-50/50">
                    <Sparkles className="h-10 w-10 text-emerald-500 mx-auto mb-3 opacity-60"/>
                    <h4 className="font-bold text-slate-700">No Academic Starter Kits Created Yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Create grade-level bundles to enable 1-click MoMo purchases for parents during term registration.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bundles.map(bundle => (
                        <Card key={bundle.id} className="shadow-sm border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
                            <CardHeader className="pb-3 border-b bg-slate-50/60">
                                <div className="flex justify-between items-start">
                                    <Badge className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase">{bundle.gradeLevel} • {bundle.term}</Badge>
                                    {bundle.badgeText && <Badge variant="outline" className="border-amber-400 text-amber-800 bg-amber-50 text-[10px] font-bold">{bundle.badgeText}</Badge>}
                                </div>
                                <CardTitle className="text-base font-bold text-slate-800 mt-2">{bundle.name}</CardTitle>
                                {bundle.description && <CardDescription className="text-xs text-slate-500 line-clamp-2">{bundle.description}</CardDescription>}
                            </CardHeader>
                            <CardContent className="py-3 text-xs space-y-2">
                                <span className="font-bold text-slate-700 block">Bundled Items ({bundle.items?.length || 0}):</span>
                                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                    {bundle.items?.map((it, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-[11px] bg-slate-100/70 p-1.5 rounded">
                                            <span className="font-medium text-slate-800">{it.name} {it.defaultSize ? `(${it.defaultSize})` : ''} x{it.quantity}</span>
                                            <span className="font-bold text-slate-600">GH₵{(it.price * it.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="pt-3 border-t flex justify-between items-center bg-slate-50/30">
                                <div>
                                    <span className="text-[10px] text-slate-400 block line-through">GH₵{(bundle.originalPrice || 0).toFixed(2)}</span>
                                    <span className="text-lg font-black text-emerald-700">GH₵{(bundle.bundlePrice || 0).toFixed(2)}</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteBundle(bundle.id, bundle.name)} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8">
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- MAIN PAGE ---
export default function SchoolShopPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { user } = useUser();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

    if (role === 'Parent') {
        return (
            <div className="p-4 sm:p-6 md:p-8">
                <ParentStorefront />
            </div>
        );
    }
    
    const [restockItem, setRestockItem] = useState<ShopItem | null>(null);
    const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
    const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
    const [isClearDrawerOpen, setIsClearDrawerOpen] = useState(false);

    // Queries
    const schoolRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]);
    const { data: schoolProfile } = useDoc<any>(schoolRef);

    const itemsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'school_shop_items'), where('schoolId', '==', schoolId), orderBy('name')) : null, [firestore, schoolId]);
    const { data: items, isLoading, forceRefetch } = useCollection<ShopItem>(itemsQuery);

    const salesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'school_shop_transactions'), where('schoolId', '==', schoolId), orderBy('date', 'desc')) : null, [firestore, schoolId]);
    const { data: sales, isLoading: isLoadingSales, forceRefetch: forceRefetchSales } = useCollection<SaleTransaction>(salesQuery);

    const tillQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !user) return null;
        const mode = schoolProfile?.shopTillMode || 'cashier';
        if (mode === 'disabled' || mode === 'shop_drawer') return null;
        if (mode === 'main') {
            return query(
                collection(firestore, 'tills'),
                where('status', '==', 'Open'),
                where('schoolId', '==', schoolId)
            );
        }
        return query(
            collection(firestore, 'tills'),
            where('accountantId', '==', user.uid),
            where('status', '==', 'Open'),
            where('schoolId', '==', schoolId)
        );
    }, [firestore, schoolId, user, schoolProfile?.shopTillMode]);
    const { data: tills, isLoading: isLoadingTills, forceRefetch: forceRefetchTills } = useCollection<any>(tillQuery);

    // Dedicated Shop Drawer Query
    const shopDrawerQuery = useMemoFirebase(() => (firestore && schoolId) ? query(
        collection(firestore, 'tills'),
        where('isShopDrawer', '==', true),
        where('schoolId', '==', schoolId)
    ) : null, [firestore, schoolId]);
    const { data: shopDrawers, forceRefetch: forceRefetchShopDrawer } = useCollection<any>(shopDrawerQuery);
    const shopDrawer = shopDrawers && shopDrawers.length > 0 ? shopDrawers[0] : null;

    // All Open Accountant Tills Query (for cash drops)
    const allOpenTillsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(
        collection(firestore, 'tills'),
        where('status', '==', 'Open'),
        where('schoolId', '==', schoolId)
    ) : null, [firestore, schoolId]);
    const { data: allOpenTills, forceRefetch: forceRefetchAllOpenTills } = useCollection<any>(allOpenTillsQuery);

    // School Community Queries
    const studentsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: students } = useCollection<any>(studentsQuery);

    const staffQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: staff } = useCollection<any>(staffQuery);

    const activeTill = schoolProfile?.shopTillMode === 'shop_drawer' ? shopDrawer : (tills && tills.length > 0 ? tills[0] : null);
    const canManage = role ? ['Administrator', 'Director', 'Accountant'].includes(role) : false;
    const isLoadingPage = isLoadingSchool || isLoading || isLoadingTills;

    if (!canManage) return <div className="p-8 text-center text-red-500">Access Denied. Finance Staff Only.</div>;

    const lowStockItems = items?.filter(i => i.stock <= i.minStock) || [];
    const totalInventoryValue = items?.reduce((sum, item) => sum + (item.price * item.stock), 0) || 0;

    const refreshDashboard = () => {
        forceRefetch();
        forceRefetchSales();
        forceRefetchTills();
        forceRefetchShopDrawer();
        forceRefetchAllOpenTills();
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
                                {schoolProfile?.shopTillMode === 'disabled' ? (
                                    <Badge className="bg-slate-500 text-white text-[10px] font-bold">Till Tracking: Bypass</Badge>
                                ) : schoolProfile?.shopTillMode === 'shop_drawer' ? (
                                    <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                                        <Check className="h-3 w-3 mr-1"/> 
                                        Shop Drawer Cash: GH₵{Number(shopDrawer?.currentBalance || 0).toFixed(2)}
                                    </Badge>
                                ) : activeTill ? (
                                    <Badge className="bg-green-500 text-white hover:bg-green-600 text-[10px] font-bold">
                                        <Check className="h-3 w-3 mr-1"/> 
                                        {schoolProfile?.shopTillMode === 'main' ? 'Main Till Open' : 'Personal Till Open'}
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" className="text-[10px] font-bold animate-pulse">
                                        <AlertTriangle className="h-3 w-3 mr-1"/> 
                                        {schoolProfile?.shopTillMode === 'main' ? 'No Active School Till' : 'Personal Till Closed'}
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-3xl font-black tracking-tight">Merchandise & School Shop</h1>
                            <p className="text-emerald-100/70 text-sm max-w-md">Process receipts for student uniforms, books, stationery, and check real-time stock ledger logs.</p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <Button size="icon" variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10" onClick={refreshDashboard}>
                                <RefreshCw className="h-4 w-4"/>
                            </Button>
                            {schoolProfile?.shopTillMode === 'shop_drawer' && shopDrawer && (
                                <Button 
                                    onClick={() => setIsClearDrawerOpen(true)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9.5 rounded-xl border-0 shadow-sm flex items-center gap-1.5"
                                >
                                    <Coins className="h-4 w-4"/> Clear Drawer
                                </Button>
                            )}
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
                    <TabsList className="w-full sm:w-auto bg-slate-100 p-1 rounded-xl flex-wrap">
                        <TabsTrigger value="pos" className="rounded-lg font-bold"><ShoppingCart className="h-4 w-4 mr-2"/> POS Cashier</TabsTrigger>
                        <TabsTrigger value="list" className="rounded-lg font-bold"><Package className="h-4 w-4 mr-2"/> Stock Inventory</TabsTrigger>
                        <TabsTrigger value="bundles" className="rounded-lg font-bold"><Sparkles className="h-4 w-4 mr-2 text-amber-500"/> Academic Bundles</TabsTrigger>
                        <TabsTrigger value="analytics" className="rounded-lg font-bold"><BarChart2 className="h-4 w-4 mr-2"/> Sales & Reports</TabsTrigger>
                    </TabsList>

                    <TabsContent value="bundles" className="flex-1 mt-4">
                        {isLoadingPage ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600 h-10 w-10"/></div>
                        ) : (
                            <AcademicBundlesTab 
                                items={items || []} 
                                schoolId={schoolId!} 
                                onRefresh={refreshDashboard} 
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="pos" className="flex-1 mt-4">
                        {isLoadingPage ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600 h-10 w-10"/></div>
                        ) : (
                            <PointOfSale 
                                items={items || []} 
                                schoolId={schoolId!} 
                                activeTill={activeTill} 
                                onSaleSuccess={refreshDashboard}
                                onShowReceipt={setReceiptData}
                                students={students || []}
                                staff={staff || []}
                                schoolProfile={schoolProfile}
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
                                onShowReceipt={setReceiptData}
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

            <ReceiptModal 
                data={receiptData} 
                open={!!receiptData} 
                onClose={() => setReceiptData(null)} 
                schoolProfile={schoolProfile}
            />

            {isClearDrawerOpen && (
                <ClearShopDrawerDialog
                    open={isClearDrawerOpen}
                    onOpenChange={setIsClearDrawerOpen}
                    shopDrawer={shopDrawer}
                    receivingTills={allOpenTills?.filter((t: any) => !t.isShopDrawer) || []}
                    schoolId={schoolId!}
                    onClearSuccess={refreshDashboard}
                />
            )}
        </>
    );
}

// --- COMPONENT: ClearShopDrawerDialog ---
function ClearShopDrawerDialog({ 
    open, 
    onOpenChange, 
    shopDrawer, 
    receivingTills, 
    schoolId, 
    onClearSuccess 
}: { 
    open: boolean; 
    onOpenChange: (val: boolean) => void; 
    shopDrawer: any; 
    receivingTills: any[]; 
    schoolId: string; 
    onClearSuccess: () => void; 
}) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [amount, setAmount] = useState('');
    const [targetTillId, setTargetTillId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Set initial amount to drawer balance
    useEffect(() => {
        if (shopDrawer) {
            setAmount(shopDrawer.currentBalance?.toString() || '0');
        }
    }, [shopDrawer, open]);

    const handleClearance = async () => {
        const transferAmount = parseFloat(amount);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            toast({ variant: 'destructive', title: "Invalid Amount", description: "Please enter a valid amount greater than zero." });
            return;
        }
        if (shopDrawer && transferAmount > (shopDrawer.currentBalance || 0)) {
            toast({ variant: 'destructive', title: "Insufficient Funds", description: "You cannot transfer more than the drawer's current balance." });
            return;
        }
        if (!targetTillId) {
            toast({ variant: 'destructive', title: "Select Target Till", description: "Please select an open accountant till to receive the cash." });
            return;
        }

        const targetTill = receivingTills.find(t => t.id === targetTillId);
        if (!targetTill) return;

        setIsSubmitting(true);
        try {
            const batch = writeBatch(firestore!);

            // 1. Decrement Shop Drawer Balance
            const shopDrawerRef = doc(firestore!, 'tills', shopDrawer.id);
            batch.update(shopDrawerRef, {
                currentBalance: increment(-transferAmount)
            });

            // 2. Log Outflow Transaction in Shop Drawer
            const shopTransRef = doc(collection(firestore!, `tills/${shopDrawer.id}/transactions`));
            batch.set(shopTransRef, {
                tillId: shopDrawer.id,
                amount: transferAmount,
                type: 'Outflow',
                description: `Cash Drop: Transferred to Accountant Till (Owner: ${targetTill.accountantName || 'Accountant'})`,
                timestamp: serverTimestamp(),
                schoolId: schoolId
            });

            // 3. Increment Target Till Balance
            const targetTillRef = doc(firestore!, 'tills', targetTillId);
            batch.update(targetTillRef, {
                currentBalance: increment(transferAmount)
            });

            // 4. Log Inflow Transaction in Target Till
            const targetTransRef = doc(collection(firestore!, `tills/${targetTillId}/transactions`));
            batch.set(targetTransRef, {
                tillId: targetTillId,
                amount: transferAmount,
                type: 'Inflow',
                description: `Shop Cash Drop: Received from School Shop Cash Drawer`,
                timestamp: serverTimestamp(),
                schoolId: schoolId
            });

            await batch.commit();

            toast({ title: "Clearance Complete", description: `Successfully dropped GH₵${transferAmount.toFixed(2)} to ${targetTill.accountantName || 'Accountant'}'s till.` });
            onClearSuccess();
            onOpenChange(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Clearance Failed", description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-slate-800 font-bold">
                        <Coins className="h-5 w-5 text-emerald-600"/> Cash Drawer Clearance
                    </DialogTitle>
                    <DialogDescription>
                        Transfer collected shop cash to the main accountant till to clear your balance.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex justify-between items-center">
                        <div>
                            <span className="text-[10px] text-emerald-800 uppercase font-black block tracking-wider">Drawer Balance</span>
                            <span className="text-2xl font-black text-emerald-900">GH₵{Number(shopDrawer?.currentBalance || 0).toFixed(2)}</span>
                        </div>
                        <Badge className="bg-emerald-600 text-white font-bold">Always Open</Badge>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Amount to Transfer (GH₵)</Label>
                        <Input 
                            type="number" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            placeholder="0.00"
                            className="h-10 border-2 rounded-xl font-bold font-mono text-base"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Select Receiving Accountant Till</Label>
                        <Select value={targetTillId} onValueChange={targetTillId => setTargetTillId(targetTillId)}>
                            <SelectTrigger className="border-2 h-10 rounded-xl font-semibold bg-white">
                                <SelectValue placeholder="Choose an active open till..." />
                            </SelectTrigger>
                            <SelectContent>
                                {receivingTills.map(t => (
                                    <SelectItem key={t.id} value={t.id} className="font-semibold">
                                        {t.tillName} ({t.accountantName || 'Accountant'}) - GH₵{Number(t.currentBalance || 0).toFixed(2)}
                                    </SelectItem>
                                ))}
                                {receivingTills.length === 0 && (
                                    <div className="p-2 text-center text-xs text-red-500 font-bold">No active open tills found. Ask the accountant to open their till.</div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="grid grid-cols-2 gap-2 mt-2">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">Cancel</Button>
                    <Button 
                        type="button" 
                        onClick={handleClearance} 
                        disabled={isSubmitting || receivingTills.length === 0} 
                        className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Confirm Cash Drop'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
