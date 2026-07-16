'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, writeBatch, serverTimestamp, collection, runTransaction } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { InventoryItem } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCurrentSchool } from '@/hooks/use-current-school';

const restockSchema = z.object({
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  notes: z.string().optional(),
});

interface RestockDialogProps {
    item: InventoryItem;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRestockComplete: () => void;
}

export function RestockDialog({ item, open, onOpenChange, onRestockComplete }: RestockDialogProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { schoolId } = useCurrentSchool();

  const form = useForm<z.infer<typeof restockSchema>>({
    resolver: zodResolver(restockSchema),
    defaultValues: { quantity: 1, notes: '' }
  });

  async function onSubmit(values: z.infer<typeof restockSchema>) {
    if (!firestore) {
        toast({ variant: "destructive", title: "Database Connection Error" });
        return;
    }
    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error" });
        return;
    }
    if (!schoolId) {
        toast({ variant: "destructive", title: "School context error" });
        return;
    }
    setIsSubmitting(true);

    try {
        const itemRef = doc(firestore, 'inventory', item.id);
        const invTransactionRef = doc(collection(firestore, `inventory/${item.id}/transactions`));

        await runTransaction(firestore, async (transaction) => {
            const freshItemDoc = await transaction.get(itemRef);
            if (!freshItemDoc.exists) {
                throw new Error("Inventory item not found.");
            }
            
            const freshItemData = freshItemDoc.data();
            const currentQuantity = freshItemData?.quantity || 0;
            const newQuantity = currentQuantity + values.quantity;
            const newStatus = (freshItemData?.status === 'Out of Stock') ? 'Available' : freshItemData?.status;

            transaction.update(itemRef, {
                quantity: newQuantity,
                status: newStatus
            });

            transaction.set(invTransactionRef, {
                itemId: item.id,
                transactionType: 'Restock',
                quantityChange: values.quantity,
                staffId: user.uid,
                timestamp: serverTimestamp(),
                notes: values.notes?.trim() || `Restocked ${values.quantity} unit(s).`,
                schoolId,
            });
        });

        toast({ title: 'Stock Updated', description: `Successfully restocked ${values.quantity} x ${item.name}.` });
        onRestockComplete();
        onOpenChange(false);
        form.reset({ quantity: 1, notes: '' });
    } catch (error: any) {
      console.error('Error processing restock:', error);
      toast({ variant: 'destructive', title: 'Restock Failed', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase text-slate-800 tracking-tight">Restock Asset</DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
            {item.name} (Current Stock: {item.quantity})
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="quantity" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase text-slate-400">Quantity to Add</FormLabel>
                <FormControl><Input type="number" {...field} className="h-11 rounded-xl border-2" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase text-slate-400">Notes (Optional)</FormLabel>
                <FormControl><Input placeholder="e.g. Received new shipment from supplier" {...field} className="h-11 rounded-xl border-2" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-2xl font-black uppercase tracking-tight shadow-md">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Restock
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
