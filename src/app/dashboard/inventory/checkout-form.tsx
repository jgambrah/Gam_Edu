
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { doc, writeBatch, serverTimestamp, collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { InventoryItem, Staff, checkoutSchema } from '@/lib/types';
import { useCurrentSchool } from '@/hooks/use-current-school';

interface CheckoutFormProps {
    item: InventoryItem;
    staffList: Staff[];
    setOpen: () => void;
    onCheckedOut: () => void;
}

export function CheckoutForm({ item, staffList, setOpen, onCheckedOut }: CheckoutFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { schoolId } = useCurrentSchool();

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
  });

  async function onSubmit(values: z.infer<typeof checkoutSchema>) {
    if (!schoolId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Cannot determine school context.' });
        return;
    }
    setIsSubmitting(true);
    const selectedStaff = staffList.find(s => s.uid === values.staffId);
    if (!selectedStaff) {
        toast({ variant: 'destructive', title: 'Error', description: 'Selected staff member not found.' });
        setIsSubmitting(false);
        return;
    }

    try {
        const batch = writeBatch(firestore);

        const itemRef = doc(firestore, 'inventory', item.id);
        batch.update(itemRef, {
            status: 'In Use',
            currentHolderId: selectedStaff.uid,
            currentHolderName: `${selectedStaff.firstName} ${selectedStaff.lastName}`,
            lastCheckedOut: serverTimestamp(),
        });

        const transactionRef = doc(collection(firestore, `inventory/${item.id}/transactions`));
        batch.set(transactionRef, {
            itemId: item.id,
            transactionType: 'Check-Out',
            timestamp: serverTimestamp(),
            staffId: selectedStaff.uid,
            notes: `Checked out to ${selectedStaff.firstName} ${selectedStaff.lastName}`,
            schoolId: schoolId,
        });

        await batch.commit();
        toast({ title: 'Success', description: `${item.name} checked out to ${selectedStaff.firstName}.` });
        onCheckedOut();
        setOpen();
    } catch (error) {
      console.error('Error checking out item:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not process the checkout.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="staffId" render={({ field }) => (
          <FormItem>
            <FormLabel>Assign To</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select a staff member" /></SelectTrigger></FormControl>
                <SelectContent>{staffList.map(s => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}</SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm Check Out
        </Button>
      </form>
    </Form>
  );
}
