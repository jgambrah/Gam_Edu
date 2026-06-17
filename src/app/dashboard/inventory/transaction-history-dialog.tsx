'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { InventoryItem, InventoryTransaction, Staff } from '@/lib/types';
import { format } from 'date-fns';
import { useCurrentSchool } from '@/hooks/use-current-school';

interface TransactionHistoryDialogProps {
  item: InventoryItem;
  open: boolean;
  setOpen: () => void;
  staffList?: Staff[];
}

export function TransactionHistoryDialog({ item, open, setOpen, staffList }: TransactionHistoryDialogProps) {
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();

  // SAAS-aware query for transactions of a specific item
  const transactionsQuery = useMemoFirebase(
    () => (firestore && schoolId) 
        ? query(
            collection(firestore, 'inventory', item.id, 'transactions'),
            where('schoolId', '==', schoolId), // Ensure transactions belong to the school
            orderBy('timestamp', 'desc')
          )
        : null,
    [firestore, item.id, schoolId]
  );
  const { data: transactions, isLoading } = useCollection<InventoryTransaction>(transactionsQuery);

  const getStaffName = (staffId?: string) => {
    if (!staffId) return 'System / Unknown';
    const staff = staffList?.find(s => s.uid === staffId);
    return staff ? `${staff.firstName} ${staff.lastName}` : `Staff ID: ${staffId.substring(0, 6)}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl">
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
                  <TableHead>Performed By</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell className="whitespace-nowrap">{tx.timestamp ? format(tx.timestamp.toDate(), 'PPP p') : 'N/A'}</TableCell>
                    <TableCell className="font-semibold">{tx.transactionType}</TableCell>
                    <TableCell className="whitespace-nowrap">{getStaffName(tx.staffId)}</TableCell>
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

