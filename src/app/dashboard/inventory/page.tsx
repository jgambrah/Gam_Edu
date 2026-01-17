
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school'; // Use the hook we trust
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

export default function InventoryPage() {
  const firestore = useFirestore();
  const { schoolId, loading: schoolLoading } = useCurrentSchool();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
        // 1. SAFETY GATE: Don't run query if schoolId is missing
        if (!firestore || !schoolId) return;

        setLoading(true);
        try {
            console.log("Fetching Inventory for:", schoolId); // Debug Log

            // 2. SIMPLE QUERY: Match schoolId, Sort by Date
            const q = query(
                collection(firestore, 'inventory'),
                where('schoolId', '==', schoolId),
                orderBy('createdAt', 'desc')
            );
            
            const snap = await getDocs(q);
            setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err: any) {
            console.error("Inventory Fetch Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (!schoolLoading) fetchData();
  }, [firestore, schoolId, schoolLoading]);

  if (loading || schoolLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        
        {error && <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>}

        <Card>
            <CardHeader><CardTitle>Current Stock</CardTitle></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Quantity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
