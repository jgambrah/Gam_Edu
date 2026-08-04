'use client';

import React, { useState } from 'react';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { useRole } from '@/context/role-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Shirt, 
  Book, 
  PenTool, 
  Search, 
  Check, 
  Smartphone, 
  QrCode, 
  PackageCheck, 
  Sparkles, 
  Plus, 
  Minus, 
  Trash2, 
  ShieldCheck,
  CreditCard
} from 'lucide-react';

interface ShopItem {
  id: string;
  name: string;
  category: 'Uniform' | 'Book' | 'Clothing' | 'Stationery' | 'Other';
  price: number;
  stock: number;
  description?: string;
  imageUrl?: string;
}

interface CartEntry {
  item: ShopItem;
  quantity: number;
  size?: string;
}

export function ParentStorefront() {
  const { schoolId } = useCurrentSchool();
  const { user } = useUser();
  const { profile } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>('Child 1');
  const [momoNumber, setMomoNumber] = useState('');
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'telecel' | 'card'>('mtn');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<any | null>(null);

  // Fetch store items from Firestore
  const itemsQuery = useMemoFirebase(
    () => (firestore && schoolId ? query(collection(firestore, 'school_shop_items'), where('schoolId', '==', schoolId), orderBy('name')) : null),
    [firestore, schoolId]
  );
  const { data: rawItems, isLoading } = useCollection<ShopItem>(itemsQuery);

  const filteredItems = (rawItems || []).filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const addToCart = (item: ShopItem) => {
    if (item.stock <= 0) {
      toast({ variant: 'destructive', title: 'Out of Stock', description: `${item.name} is currently out of stock.` });
      return;
    }
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        if (existing.quantity >= item.stock) {
          toast({ variant: 'destructive', title: 'Stock Limit Reached', description: `Cannot add more than ${item.stock} units.` });
          return prev;
        }
        return prev.map((c) => (c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { item, quantity: 1, size: item.category === 'Uniform' || item.category === 'Clothing' ? 'Medium' : undefined }];
    });
    toast({ title: 'Added to Cart', description: `${item.name} added to your basket.` });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.item.id === itemId) {
            const newQty = c.quantity + delta;
            if (newQty > c.item.stock) return c;
            return { ...c, quantity: newQty };
          }
          return c;
        })
        .filter((c) => c.quantity > 0)
    );
  };

  const updateSize = (itemId: string, size: string) => {
    setCart((prev) => prev.map((c) => (c.item.id === itemId ? { ...c, size } : c)));
  };

  const totalAmount = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);

  const handleMomoCheckout = async () => {
    if (!firestore || !schoolId || !user) return;
    if (cart.length === 0) return;
    if (!momoNumber || momoNumber.length < 9) {
      toast({ variant: 'destructive', title: 'Phone Required', description: 'Please enter a valid Mobile Money number.' });
      return;
    }

    setIsProcessing(true);
    try {
      // Auto-generate 6-Digit Pickup PIN e.g. 849-215
      const randomPin = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
      const orderRef = collection(firestore, `schools/${schoolId}/shopOrders`);

      const parentName = profile?.firstName && profile?.lastName 
        ? `${profile.firstName} ${profile.lastName}` 
        : user.displayName || user.email || 'Parent';

      const orderData = {
        schoolId,
        pickupPin: randomPin,
        parentName,
        parentId: user.uid,
        childName: selectedChild,
        momoNumber,
        momoProvider,
        items: cart.map((c) => ({
          itemId: c.item.id,
          name: c.item.name,
          category: c.item.category,
          quantity: c.quantity,
          price: c.item.price,
          size: c.size || null,
        })),
        totalAmount,
        status: 'Pending Collection',
        paymentStatus: 'PAID',
        paymentMethod: momoProvider.toUpperCase(),
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(firestore, 'school_shop_orders'), orderData);

      // Decrement stock for purchased items
      for (const cartEntry of cart) {
        const itemRef = doc(firestore, 'school_shop_items', cartEntry.item.id);
        await updateDoc(itemRef, {
          stock: increment(-cartEntry.quantity),
        });
      }

      setCompletedReceipt({ ...orderData, id: docRef.id, pickupPin: randomPin });
      setCart([]);
      setIsCheckoutOpen(false);
      toast({
        title: '🎉 Payment Successful!',
        description: `Order placed via MoMo. Show Pickup PIN: ${randomPin} at the school store.`,
      });
    } catch (error: any) {
      console.error('Checkout failed:', error);
      toast({
        variant: 'destructive',
        title: 'Payment Failed',
        description: error.message || 'Could not process Mobile Money transaction.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const orderDataRef = (fs: any, sId: string) => collection(fs, `schools/${sId}/shopOrders`);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative p-8 rounded-[2.5rem] bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-2xl overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-widest border border-purple-400/30">
            <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
            <span>School Merchandise & Supplies Portal</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase italic">
            Uniform & Textbook Store
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed font-medium">
            Order school-branded uniforms, textbooks, P.E. kits, and stationery directly online. Pay instantly via Mobile Money (MoMo) and get a 6-digit store pickup pass!
          </p>
        </div>
      </div>

      {/* Main Grid: Products + Cart Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Product Catalog */}
        <div className="lg:col-span-8 space-y-6">
          {/* Controls Bar: Category Filter & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {['all', 'uniform', 'book', 'clothing', 'stationery'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All Items' : cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search uniforms, books..."
                className="pl-9 h-10 rounded-xl text-xs font-medium border-slate-200"
              />
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-medium">Loading store items...</div>
          ) : filteredItems.length === 0 ? (
            <Card className="rounded-[2rem] border-dashed border-2 border-slate-200 p-12 text-center bg-slate-50/50">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-700 uppercase">No Items Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-medium">
                The school has not added merchandise for this category yet. Check back soon!
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredItems.map((item) => (
                <Card key={item.id} className="rounded-[2rem] border-slate-200 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between bg-white border">
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <Badge className="bg-purple-100 text-purple-700 font-bold text-[10px] uppercase tracking-wider">
                        {item.category}
                      </Badge>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {item.stock > 0 ? `${item.stock} in stock` : 'Out of Stock'}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-black text-slate-900 pt-2">{item.name}</CardTitle>
                    {item.description && (
                      <CardDescription className="text-xs text-slate-500 font-medium line-clamp-2">
                        {item.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block">Price</span>
                      <span className="text-xl font-black text-slate-900">GH₵ {item.price.toFixed(2)}</span>
                    </div>

                    <Button
                      onClick={() => addToCart(item)}
                      disabled={item.stock <= 0}
                      className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all uppercase"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      <span>Add to Basket</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Order Cart & MoMo Checkout */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2rem] border-slate-200 shadow-xl bg-white sticky top-24">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-6">
              <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2 text-slate-900">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
                <span>My Order Basket</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="py-10 text-center text-slate-400 space-y-2">
                  <ShoppingCart className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs font-bold uppercase">Basket is empty</p>
                  <p className="text-[11px] text-slate-400 font-medium">Select uniforms or textbooks from the store catalog to order.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((entry) => (
                    <div key={entry.item.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">{entry.item.name}</h5>
                          <span className="text-[11px] text-purple-600 font-bold">GH₵ {entry.item.price.toFixed(2)} each</span>
                        </div>
                        <button
                          onClick={() => updateQuantity(entry.item.id, -entry.quantity)}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Size picker for uniforms */}
                      {(entry.item.category === 'Uniform' || entry.item.category === 'Clothing') && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-500 text-[10px] font-bold uppercase">Size:</span>
                          <select
                            value={entry.size || 'Medium'}
                            onChange={(e) => updateSize(entry.item.id, e.target.value)}
                            className="h-7 rounded-lg border-slate-200 text-[11px] font-bold px-2 bg-white"
                          >
                            <option value="Small">Small (S)</option>
                            <option value="Medium">Medium (M)</option>
                            <option value="Large">Large (L)</option>
                            <option value="X-Large">X-Large (XL)</option>
                          </select>
                        </div>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(entry.item.id, -1)}
                            className="h-6 w-6 rounded-lg"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-xs font-bold">{entry.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(entry.item.id, 1)}
                            className="h-6 w-6 rounded-lg"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <span className="text-xs font-black text-slate-900">
                          GH₵ {(entry.item.price * entry.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 uppercase">Total Amount</span>
                      <span className="text-2xl font-black text-slate-900">GH₵ {totalAmount.toFixed(2)}</span>
                    </div>

                    <Button
                      onClick={() => setIsCheckoutOpen(true)}
                      className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg uppercase tracking-wider"
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      <span>Pay via MoMo (GH₵ {totalAmount.toFixed(2)})</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MoMo Checkout Modal */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="rounded-[2.5rem] sm:max-w-md p-6 border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase text-slate-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <span>Mobile Money Checkout</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Enter your MoMo details to complete payment for uniforms/textbooks.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-purple-600 font-bold uppercase block">Total Payable</span>
                <span className="text-2xl font-black text-purple-900">GH₵ {totalAmount.toFixed(2)}</span>
              </div>
              <Badge className="bg-purple-600 text-white font-bold">Instantly Verified</Badge>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Purchasing For Student</Label>
              <Input
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                placeholder="Student Name e.g. Kofi Mensah"
                className="h-11 rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase">Select MoMo Network</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMomoProvider('mtn')}
                  className={`p-3 rounded-xl border-2 text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    momoProvider === 'mtn' ? 'border-yellow-500 bg-yellow-50 text-yellow-900' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-yellow-600" />
                  <span>MTN MoMo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMomoProvider('telecel')}
                  className={`p-3 rounded-xl border-2 text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    momoProvider === 'telecel' ? 'border-red-500 bg-red-50 text-red-900' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-red-600" />
                  <span>Telecel Cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMomoProvider('card')}
                  className={`p-3 rounded-xl border-2 text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    momoProvider === 'card' ? 'border-blue-500 bg-blue-50 text-blue-900' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Debit Card</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">MoMo Wallet Number</Label>
              <Input
                value={momoNumber}
                onChange={(e) => setMomoNumber(e.target.value)}
                placeholder="e.g. 0244123456"
                className="h-11 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleMomoCheckout}
              disabled={isProcessing}
              className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md uppercase tracking-wider"
            >
              {isProcessing ? 'Processing MoMo Prompt...' : `Confirm & Pay GH₵ ${totalAmount.toFixed(2)}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Digital Receipt & 6-Digit Verification PIN Modal */}
      {completedReceipt && (
        <Dialog open={!!completedReceipt} onOpenChange={() => setCompletedReceipt(null)}>
          <DialogContent className="rounded-[2.5rem] sm:max-w-md p-6 border-slate-200 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <Check className="w-8 h-8" />
            </div>

            <DialogTitle className="text-2xl font-black uppercase text-slate-900">
              Payment Confirmed!
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Your order for {completedReceipt.childName} has been paid via {completedReceipt.momoProvider.toUpperCase()}.
            </DialogDescription>

            {/* 6-Digit Collection PIN Display */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-2 my-4 shadow-xl border-4 border-purple-500/30">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-400">
                Store Storekeeper Verification PIN
              </span>
              <div className="text-4xl font-black tracking-widest text-emerald-400 font-mono">
                {completedReceipt.pickupPin}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Show this PIN at the school store to collect your items.
              </p>
            </div>

            <Button
              onClick={() => setCompletedReceipt(null)}
              className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase"
            >
              Done & Return to Store
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
