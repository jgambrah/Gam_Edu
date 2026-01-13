
'use client';

import { useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FileText, Printer, Boxes } from 'lucide-react';
import { InventoryItem } from '@/lib/types';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useCurrentSchool } from '@/hooks/use-current-school';

const CATEGORY_COLORS = {
    'IT Equipment': '#3b82f6', // blue-500
    'Furniture': '#84cc16', // lime-500
    'Office Supplies': '#f97316', // orange-500
    'Lab Equipment': '#14b8a6', // teal-500
    'Sports Gear': '#ec4899', // pink-500
    'Other': '#a855f7', // purple-500
};

const STATUS_COLORS = {
    'Available': '#22c55e', // green-500
    'In Use': '#eab308', // yellow-500
    'Under Maintenance': '#f43f5e', // rose-500
};


export default function InventoryReportsPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

    const canAccess = ['Administrator', 'Director'].includes(role);

    const { data: inventory, isLoading: isLoadingInventory } = useCollection<InventoryItem>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'inventory'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));

    const reportData = useMemo(() => {
        if (!inventory) {
            return null;
        }

        const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
        const totalValue = inventory.reduce((sum, item) => sum + (item.unitPrice || 0) * item.quantity, 0);
        const itemsInUse = inventory.filter(item => item.status === 'In Use').reduce((sum, item) => sum + item.quantity, 0);
        
        const categoryDistribution = inventory.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + item.quantity;
            return acc;
        }, {} as Record<string, number>);

        const categoryPieData = Object.entries(categoryDistribution).map(([name, value]) => ({ name, value }));

        const statusDistribution = inventory.reduce((acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + item.quantity;
            return acc;
        }, {} as Record<string, number>);
        
        const statusChartData = Object.entries(statusDistribution).map(([name, value]) => ({ name, count: value }));

        return {
            totalItems,
            totalValue,
            itemsInUse,
            categoryPieData,
            statusChartData,
        };

    }, [inventory]);

    const getStatusVariant = (status: InventoryItem['status']) => {
        switch(status) {
            case 'Available': return 'default';
            case 'In Use': return 'secondary';
            case 'Under Maintenance': return 'destructive';
            default: return 'outline';
        }
    }
    
    const isLoading = isLoadingSchool || isLoadingInventory;

    if (!canAccess) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>This module is restricted to Administrators and Directors.</CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
    return (
        <div className="space-y-6" id="report-content">
            <div className="flex items-center justify-between print:hidden">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2"><Boxes /> Inventory Reports</h1>
                    <p className="text-muted-foreground">Analyze the school's physical assets.</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline"><Link href="/dashboard/reports/academics">Academics</Link></Button>
                    <Button asChild variant="outline"><Link href="/dashboard/reports/attendance">Attendance</Link></Button>
                    <Button asChild variant="outline"><Link href="/dashboard/reports/enrollment">Enrollment</Link></Button>
                    <Button asChild variant="outline"><Link href="/dashboard/reports/financials">Financials</Link></Button>
                    <Button onClick={() => window.print()}><Printer className="mr-2"/>Print</Button>
                </div>
            </div>

            {isLoading ? <p>Loading report data...</p> : reportData ? (
                <>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card><CardHeader><CardTitle>Total Items</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{reportData.totalItems}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle>Total Estimated Value</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">GH₵{reportData.totalValue.toFixed(2)}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle>Items Currently In Use</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{reportData.itemsInUse}</p></CardContent></Card>
                    </div>

                    <div className="grid md:grid-cols-5 gap-6">
                        <Card className="md:col-span-2">
                            <CardHeader><CardTitle>Items by Category</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={reportData.categoryPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                            {reportData.categoryPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                         <Card className="md:col-span-3">
                            <CardHeader><CardTitle>Items by Status</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                     <BarChart data={reportData.statusChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="count" name="Number of Items">
                                            {reportData.statusChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} />
                                            ))}
                                        </Bar>
                                     </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                     <Card>
                        <CardHeader><CardTitle>Full Inventory List</CardTitle></CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead>Current Holder</TableHead><TableHead>Location</TableHead><TableHead className="text-right">Value</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {inventory?.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell><Badge variant={getStatusVariant(item.status)}>{item.status}</Badge></TableCell>
                                            <TableCell>{item.currentHolderName || 'N/A'}</TableCell>
                                            <TableCell>{item.location}</TableCell>
                                            <TableCell className="text-right">GH₵{((item.unitPrice || 0) * item.quantity).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                     </Card>
                </>
            ) : <p>No data available to generate reports.</p>}

            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print\\:hidden {
                        display: none;
                    }
                    #report-content, #report-content * {
                        visibility: visible;
                    }
                    #report-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}
