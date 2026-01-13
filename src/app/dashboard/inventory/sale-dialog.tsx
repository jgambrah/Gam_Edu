
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { doc, writeBatch, serverTimestamp, query, collection, where, getDocs } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { InventoryItem } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCurrentSchool } from '@/hooks/use-current-school';

const saleSchema = z.object({
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
});

interface SaleDialogProps {
    item: InventoryItem;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaleComplete: () => void;
}

export function SaleDialog({ item, open, onOpenChange, onSaleComplete }: SaleDialogProps) {
  const firestore = useFirestore();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { schoolId } = useCurrentSchool();

  const form = useForm<z.infer<typeof saleSchema>>({
    resolver: zodResolver(saleSchema),
    defaultValues: { quantity: 1 }
  });

  async function onSubmit(values: z.infer<typeof saleSchema>) {
    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error" });
        return;
    }
    if (!schoolId) {
        toast({ variant: "destructive", title: "School context error" });
        return;
    }
    if (values.quantity > item.quantity) {
        form.setError("quantity", { message: "Cannot sell more than available quantity." });
        return;
    }
    setIsSubmitting(true);

    try {
        const tillQuery = query(collection(firestore, 'tills'), where('accountantId', '==', user.uid), where('status', '==', 'Open'), where('schoolId', '==', schoolId));
        const tillSnapshot = await getDocs(tillQuery);
        if (tillSnapshot.empty) {
            throw new Error("You do not have an open till. Please open one before making sales.");
        }
        const activeTill = tillSnapshot.docs[0];

        const batch = writeBatch(firestore);

        const itemRef = doc(firestore, 'inventory', item.id);
        const newQuantity = item.quantity - values.quantity;
        batch.update(itemRef, {
            quantity: newQuantity,
            status: newQuantity > 0 ? 'Available' : 'Out of Stock'
        });

        const invTransactionRef = doc(collection(firestore, `inventory/${item.id}/transactions`));
        batch.set(invTransactionRef, {
            itemId: item.id,
            transactionType: 'Sale',
            quantityChange: -values.quantity,
            staffId: user.uid,
            timestamp: serverTimestamp(),
            notes: `Sold ${values.quantity} unit(s).`,
            schoolId,
        });

        const tillTransactionRef = doc(collection(firestore, `tills/${activeTill.id}/transactions`));
        batch.set(tillTransactionRef, {
            tillId: activeTill.id,
            financialRecordId: item.id,
            amount: (item.unitPrice || 0) * values.quantity,
            description: `Sale: ${values.quantity} x ${item.name}`,
            timestamp: serverTimestamp(),
            schoolId,
        });

        await batch.commit();

        toast({ title: 'Sale Recorded', description: `${values.quantity} x ${item.name} sold. Till updated.` });
        onSaleComplete();
        onOpenChange(false);
    } catch (error: any) {
      console.error('Error processing sale:', error);
      toast({ variant: 'destructive', title: 'Sale Failed', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  const total = (item.unitPrice || 0) * (form.watch('quantity') || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sell Item: {item.name}</DialogTitle>
          <DialogDescription>
            Available Quantity: {item.quantity} | Unit Price: GH₵{(item.unitPrice || 0).toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="quantity" render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity to Sell</FormLabel>
                <FormControl><Input type="number" {...field} max={item.quantity} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="p-4 bg-muted rounded-md text-center">
                <p className="text-sm text-muted-foreground">Total Sale Amount</p>
                <p className="text-2xl font-bold">GH₵{total.toFixed(2)}</p>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Sale & Add to Till
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
