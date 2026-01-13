
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { Loader2, CalendarIcon } from 'lucide-react';
import { inventoryItemSchema } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function InventoryItemForm({ setOpen, onAdded, schoolId }: { setOpen: () => void; onAdded: () => void; schoolId: string; }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof inventoryItemSchema>>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
        category: 'Office Supplies',
        condition: 'New',
        quantity: 1,
    }
  });

  async function onSubmit(values: z.infer<typeof inventoryItemSchema>) {
    setIsSubmitting(true);
    try {
      const batch = writeBatch(firestore);

      const newItemRef = doc(collection(firestore, 'inventory'));
      const dataToSave = {
        ...values,
        status: 'Available',
        schoolId: schoolId, // SAAS STAMP
      };
      batch.set(newItemRef, dataToSave);
      
      const transactionRef = doc(collection(firestore, `inventory/${newItemRef.id}/transactions`));
      batch.set(transactionRef, {
        itemId: newItemRef.id,
        transactionType: 'Creation',
        timestamp: serverTimestamp(),
        notes: `Item created with quantity ${values.quantity}.`,
        schoolId: schoolId, // SAAS STAMP
      });

      await batch.commit();

      toast({
        title: 'Item Added',
        description: `"${values.name}" has been added to the inventory.`,
      });
      form.reset();
      onAdded();
      setOpen();
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while adding the item.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Item Name</FormLabel><FormControl><Input placeholder="e.g., Dell Latitude 5420 Laptop" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{['IT Equipment', 'Furniture', 'Office Supplies', 'Lab Equipment', 'Sports Gear', 'Other'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="condition" render={({ field }) => (
                <FormItem><FormLabel>Condition</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{['New', 'Good', 'Fair', 'Poor', 'For Repair'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )}/>
             <FormField control={form.control} name="quantity" render={({ field }) => (
                <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))}/></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
         <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem><FormLabel>Storage Location</FormLabel><FormControl><Input placeholder="e.g., IT Office, Storage Room B" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <FormField control={form.control} name="supplier" render={({ field }) => (
                <FormItem><FormLabel>Supplier (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="purchaseDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Purchase Date (Optional)</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                <Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="unitPrice" render={({ field }) => (
                <FormItem><FormLabel>Unit Price (Optional)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))}/></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Item
        </Button>
      </form>
    </Form>
  );
}
