'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { collection, query, orderBy } from 'firebase/firestore';
import { InventoryItem, InventoryTransaction } from '@/lib/types';
import { format } from 'date-fns';

interface TransactionHistoryDialogProps {
  item: InventoryItem;
  open: boolean;
  setOpen: () => void;
}

export function TransactionHistoryDialog({ item, open, setOpen }: TransactionHistoryDialogProps) {
  const firestore = useFirestore();
  const transactionsQuery = useMemoFirebase(
    () => query(collection(firestore, `inventory/${item.id}/transactions`), orderBy('timestamp', 'desc')),
    [firestore, item.id]
  );
  const { data: transactions, isLoading } = useCollection<InventoryTransaction>(transactionsQuery);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction History: {item.name}</DialogTitle>
          <DialogDescription>A log of all activities for this item.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.timestamp ? format(tx.timestamp.toDate(), 'PPP p') : 'N/A'}</TableCell>
                    <TableCell>{tx.transactionType}</TableCell>
                    <TableCell>{tx.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
