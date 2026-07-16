'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, writeBatch, serverTimestamp, collection, runTransaction } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { InventoryItem } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCurrentSchool } from '@/hooks/use-current-school';

const adjustmentSchema = z.object({
  type: z.enum(['Add', 'Subtract']),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  reason: z.enum(['Damage', 'Loss', 'Correction', 'Other']),
  notes: z.string().optional(),
});

interface AdjustmentDialogProps {
    item: InventoryItem;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdjustmentComplete: () => void;
}

export function AdjustmentDialog({ item, open, onOpenChange, onAdjustmentComplete }: AdjustmentDialogProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { schoolId } = useCurrentSchool();

  const form = useForm<z.infer<typeof adjustmentSchema>>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: { type: 'Subtract', quantity: 1, reason: 'Damage', notes: '' }
  });

  async function onSubmit(values: z.infer<typeof adjustmentSchema>) {
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

    const multiplier = values.type === 'Add' ? 1 : -1;
    const quantityChange = values.quantity * multiplier;

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
            const newQuantity = currentQuantity + quantityChange;

            if (newQuantity < 0) {
                throw new Error(`Cannot subtract more than current quantity (${currentQuantity}).`);
            }

            const newStatus = newQuantity > 0 ? (freshItemData?.status === 'Out of Stock' ? 'Available' : freshItemData?.status) : 'Out of Stock';

            transaction.update(itemRef, {
                quantity: newQuantity,
                status: newStatus
            });

            transaction.set(invTransactionRef, {
                itemId: item.id,
                transactionType: 'Adjustment',
                quantityChange,
                staffId: user.uid,
                timestamp: serverTimestamp(),
                notes: `${values.reason} adjustment: ${values.type === 'Add' ? '+' : '-'}${values.quantity} units. Notes: ${values.notes?.trim() || 'None'}`,
                schoolId,
            });
        });

        toast({ title: 'Stock Adjusted', description: `Successfully adjusted stock for ${item.name}.` });
        onAdjustmentComplete();
        onOpenChange(false);
        form.reset({ type: 'Subtract', quantity: 1, reason: 'Damage', notes: '' });
    } catch (error: any) {
      console.error('Error processing adjustment:', error);
      toast({ variant: 'destructive', title: 'Adjustment Failed', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase text-slate-800 tracking-tight">Manual Stock Adjustment</DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
            {item.name} (Current Stock: {item.quantity})
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase text-slate-400">Adjustment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="h-11 rounded-xl border-2"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Add">Add (+) / Found</SelectItem>
                            <SelectItem value="Subtract">Subtract (-) / Lost / Damaged</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="quantity" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase text-slate-400">Quantity</FormLabel>
                    <FormControl><Input type="number" {...field} className="h-11 rounded-xl border-2" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
            </div>
            
            <FormField control={form.control} name="reason" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase text-slate-400">Reason</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger className="h-11 rounded-xl border-2"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="Damage">Damaged / Broken</SelectItem>
                        <SelectItem value="Loss">Loss / Theft / Expired</SelectItem>
                        <SelectItem value="Correction">Data Entry Correction</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase text-slate-400">Notes (Optional)</FormLabel>
                <FormControl><Input placeholder="Provide specific details about the adjustment" {...field} className="h-11 rounded-xl border-2" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-2xl font-black uppercase tracking-tight shadow-md">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Adjustment
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
