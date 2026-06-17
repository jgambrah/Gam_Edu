'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { 
    Boxes, Printer, Loader2, ShieldAlert, FileText, Search, Info, 
    TrendingUp, AlertTriangle, AlertCircle, Wrench, PackagePlus, 
    CheckCircle2, Hammer, ShieldCheck, BarChart2 
} from 'lucide-react';
import { InventoryItem } from '@/lib/types';
import Link from 'next/link';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS = {
    'IT Equipment': '#3b82f6', // blue-500
    'Furniture': '#84cc16', // lime-500
    'Office Supplies': '#f97316', // orange-500
    'Lab Equipment': '#14b8a6', // teal-500
    'Sports Gear': '#ec4899', // pink-500
    'Other': '#a855f7', // purple-500
};

const STATUS_COLORS = {
    'Available': '#10b981', // green-500
    'In Use': '#6366f1', // indigo-500
    'Under Maintenance': '#f43f5e', // rose-500
    'Out of Stock': '#94a3b8', // slate-400
};

const CONDITION_COLORS = {
    'New': '#10b981', // green-500
    'Good': '#3b82f6', // blue-500
    'Fair': '#eab308', // yellow-500
    'Poor': '#f97316', // orange-500
    'For Repair': '#ef4444', // red-500
};

export default function InventoryReportsPage() {
    const { role, loading: isRoleLoading } = useRole();
    const router = useRouter();
    const firestore = useFirestore();
    const { schoolId, loading: isSchoolLoading } = useCurrentSchool();

    // States
    const [activeTab, setActiveTab] = useState<string>('overview');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const canAccess = ['Administrator', 'Director', 'Secretary'].includes(role || '');

    useEffect(() => {
        if (!isRoleLoading && (role === 'Student' || role === 'Parent')) {
            router.replace('/dashboard');
        }
    }, [role, isRoleLoading, router]);

    // Data Fetching
    const inventoryQuery = useMemoFirebase(() => (firestore && schoolId && canAccess) ? query(collection(firestore, 'inventory'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, canAccess]);
    const { data: inventory, isLoading: isLoadingInventory } = useCollection<InventoryItem>(inventoryQuery);

    const schoolProfileRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
    const { data: schoolProfile } = useDoc<any>(schoolProfileRef);

    // Aggregations and Calculations
    const reportData = useMemo(() => {
        if (!inventory || inventory.length === 0) return null;

        const totalItems = inventory.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const totalValue = inventory.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0);
        const itemsInUse = inventory.filter(item => item.status === 'In Use').reduce((sum, item) => sum + (item.quantity || 0), 0);
        const itemsUnderMaintenance = inventory.filter(item => item.status === 'Under Maintenance' || item.condition === 'For Repair').reduce((sum, item) => sum + (item.quantity || 0), 0);
        
        // Alerts triggers
        const lowStockCount = inventory.filter(item => item.quantity <= 3 || item.status === 'Out of Stock').length;
        const poorConditionCount = inventory.filter(item => item.condition === 'Poor' || item.condition === 'For Repair').length;

        // Categories distribution
        const categoryDistribution = inventory.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + (item.quantity || 0);
            return acc;
        }, {} as Record<string, number>);
        const categoryPieData = Object.entries(categoryDistribution).map(([name, value]) => ({ name, value }));

        // Status distribution
        const statusDistribution = inventory.reduce((acc, item) => {
            const s = item.status || 'Available';
            acc[s] = (acc[s] || 0) + (item.quantity || 0);
            return acc;
        }, {} as Record<string, number>);
        const statusChartData = Object.entries(statusDistribution).map(([name, count]) => ({ name, count }));

        // Condition distribution
        const conditionDistribution = inventory.reduce((acc, item) => {
            const c = item.condition || 'Good';
            acc[c] = (acc[c] || 0) + (item.quantity || 0);
            return acc;
        }, {} as Record<string, number>);
        const conditionPieData = Object.entries(conditionDistribution).map(([name, value]) => ({ name, value }));

        // Quality ratio (New + Good condition items vs total items)
        const goodConditionCount = inventory.filter(item => item.condition === 'New' || item.condition === 'Good').reduce((sum, item) => sum + (item.quantity || 0), 0);
        const healthyAssetRatio = totalItems > 0 ? (goodConditionCount / totalItems) * 100 : 0;

        // Items requiring immediate replacement or repair
        const actionableAssets = inventory.filter(item => item.condition === 'Poor' || item.condition === 'For Repair' || item.status === 'Under Maintenance')
            .map(item => ({
                id: item.id,
                name: item.name,
                location: item.location,
                quantity: item.quantity,
                condition: item.condition,
                status: item.status,
                supplier: item.supplier || 'Not Listed'
            }));

        return {
            totalItems,
            totalValue,
            itemsInUse,
            itemsUnderMaintenance,
            lowStockCount,
            poorConditionCount,
            categoryPieData,
            statusChartData,
            conditionPieData,
            healthyAssetRatio: parseFloat(healthyAssetRatio.toFixed(1)),
            actionableAssets
        };
    }, [inventory]);

    // Directory list filter
    const filteredInventory = useMemo(() => {
        if (!inventory) return [];
        return inventory.filter(item => {
            const name = (item.name || '').toLowerCase();
            const category = (item.category || '').toLowerCase();
            const location = (item.location || '').toLowerCase();
            const holder = (item.currentHolderName || '').toLowerCase();
            const queryText = searchQuery.toLowerCase();
            return name.includes(queryText) || 
                   category.includes(queryText) || 
                   location.includes(queryText) ||
                   holder.includes(queryText);
        });
    }, [inventory, searchQuery]);

    const getStatusVariant = (status: InventoryItem['status']) => {
        switch(status) {
            case 'Available': return 'default';
            case 'In Use': return 'secondary';
            case 'Under Maintenance': return 'destructive';
            default: return 'outline';
        }
    }

    const isLoading = isSchoolLoading || isRoleLoading || isLoadingInventory;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                <p className="text-sm font-medium">Loading asset vault parameters...</p>
            </div>
        );
    }

    if (!canAccess) {
        return (
            <div className="p-8 flex justify-center">
                <Card className="max-w-md w-full border-red-100 bg-red-50/50 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                            <ShieldAlert className="h-8 w-8 text-red-600" />
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-800">Access Restricted</CardTitle>
                        <CardDescription>Asset reports are restricted to authorized operational staff.</CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Button asChild variant="outline" className="border-slate-200 shadow-sm">
                            <Link href="/dashboard">Return to Dashboard</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12" id="report-content">

            {/* PRINT COMPATIBLE LETTERHEAD */}
            <div className="hidden print:flex flex-col items-center border-b border-slate-300 pb-4 mb-6 text-center">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{schoolProfile?.schoolName || 'ASSET LEDGER'}</h1>
                <p className="text-xs text-slate-500 mt-1">
                    {schoolProfile?.address || ''} 
                    {schoolProfile?.phone ? ` | Tel: ${schoolProfile.phone}` : ''} 
                    {schoolProfile?.email ? ` | Email: ${schoolProfile.email}` : ''}
                </p>
                <div className="mt-4 border-t pt-4 w-full flex justify-between text-xs font-semibold text-slate-600">
                    <span>REPORT: CAPITAL ASSETS & INVENTORY SUMMARY</span>
                    <span>TOTAL HOLDINGS: {reportData?.totalItems} | VALUATION: GH₵{reportData?.totalValue.toFixed(2)}</span>
                </div>
            </div>

            {/* SCREEN-ONLY TOP HEADER */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-slate-700 p-6 rounded-2xl text-white shadow-xl">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                        <Boxes className="h-8 w-8 text-indigo-200 animate-pulse" /> 
                        Capital Asset Analytics
                    </h1>
                    <p className="text-indigo-100 text-sm font-medium">
                        Analyze equipment conditions, depreciation ratios, and procurement planning options.
                    </p>
                </div>
                <div className="flex gap-2 self-stretch md:self-auto justify-end">
                    <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Link href="/dashboard/reports/academics">Academics</Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Link href="/dashboard/reports/attendance">Attendance</Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Link href="/dashboard/reports/enrollment">Enrollment</Link>
                    </Button>
                    <Button onClick={() => window.print()} className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md border-0">
                        <Printer className="mr-2 h-4 w-4"/>Print Record
                    </Button>
                </div>
            </div>

            {reportData ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <div className="flex justify-between items-center print:hidden border-b pb-2">
                        <TabsList className="bg-slate-100 p-1 rounded-xl">
                            <TabsTrigger value="overview" className="rounded-lg font-bold text-xs uppercase px-4 py-2">Holdings Summary</TabsTrigger>
                            <TabsTrigger value="health" className="rounded-lg font-bold text-xs uppercase px-4 py-2 flex items-center gap-1">
                                <Hammer className="h-3.5 w-3.5 text-indigo-500" /> Depreciation & Health
                            </TabsTrigger>
                            <TabsTrigger value="directory" className="rounded-lg font-bold text-xs uppercase px-4 py-2">Asset Directory</TabsTrigger>
                        </TabsList>
                        <Badge className="bg-indigo-600 font-bold hidden md:inline-flex">
                            Holdings: {reportData.totalItems} Items / GH₵{reportData.totalValue.toLocaleString()} Estimated Value
                        </Badge>
                    </div>

                    {/* ========================================================================= */}
                    {/* OVERVIEW TAB                                                              */}
                    {/* ========================================================================= */}
                    <TabsContent value="overview" className="space-y-6 outline-none">
                        
                        {/* STATS STRIP */}
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                            <Card className="border border-slate-200/80 bg-gradient-to-br from-indigo-50 to-indigo-100/30 shadow-sm relative overflow-hidden group">
                                <CardContent className="pt-6 relative">
                                    <Boxes className="absolute -right-2 -bottom-2 h-16 w-16 text-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Total asset items</p>
                                            <p className="text-3xl font-black text-indigo-700">{reportData.totalItems}</p>
                                        </div>
                                        <Boxes className="h-8 w-8 text-indigo-300" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-slate-200/80 bg-gradient-to-br from-blue-50 to-blue-100/30 shadow-sm overflow-hidden group">
                                <CardContent className="pt-6 relative">
                                    <TrendingUp className="absolute -right-2 -bottom-2 h-16 w-16 text-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Estimated Value</p>
                                            <p className="text-3xl font-black text-blue-700">GH₵{reportData.totalValue.toLocaleString()}</p>
                                        </div>
                                        <TrendingUp className="h-8 w-8 text-blue-300" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-slate-200/80 bg-gradient-to-br from-rose-50 to-rose-100/30 shadow-sm overflow-hidden group">
                                <CardContent className="pt-6 relative">
                                    <Wrench className="absolute -right-2 -bottom-2 h-16 w-16 text-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Under Maintenance</p>
                                            <p className="text-3xl font-black text-rose-700">{reportData.itemsUnderMaintenance}</p>
                                        </div>
                                        <Wrench className="h-8 w-8 text-rose-300" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-slate-200/80 bg-gradient-to-br from-amber-50 to-amber-100/30 shadow-sm overflow-hidden group">
                                <CardContent className="pt-6 relative">
                                    <PackagePlus className="absolute -right-2 -bottom-2 h-16 w-16 text-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Stock Alerts</p>
                                            <p className="text-3xl font-black text-amber-700">{reportData.lowStockCount}</p>
                                        </div>
                                        <PackagePlus className="h-8 w-8 text-amber-300" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* CHARTS CONTAINER */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            
                            {/* CATEGORY DISTRIBUTION */}
                            <Card className="lg:col-span-2 border border-slate-200/80 shadow-sm">
                                <CardHeader className="pb-0 bg-slate-50/50 border-b">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                                        <Boxes className="h-4 w-4 text-indigo-500" /> Holdings by Category
                                    </CardTitle>
                                    <CardDescription>Estimated quantities grouped by category.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[260px] flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie 
                                                data={reportData.categoryPieData} 
                                                dataKey="value" 
                                                nameKey="name" 
                                                cx="50%" 
                                                cy="50%" 
                                                innerRadius={50}
                                                outerRadius={75} 
                                                paddingAngle={4}
                                            >
                                                {reportData.categoryPieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || '#a855f7'} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(v) => [`${v} Units`, 'Quantity']} />
                                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* STATUS DISTRIBUTION */}
                            <Card className="lg:col-span-3 border border-slate-200/80 shadow-sm">
                                <CardHeader className="pb-0 bg-slate-50/50 border-b">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                                        <BarChart2 className="h-4 w-4 text-indigo-500" /> Asset Status Breakdown
                                    </CardTitle>
                                    <CardDescription>Deployment status indicators for holdings.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[260px] pt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={reportData.statusChartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                                            <Tooltip formatter={(v) => [`${v} Units`, 'Count']} />
                                            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Quantity">
                                                {reportData.statusChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || '#6366f1'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* ========================================================================= */}
                    {/* DEPRECIATION & HEALTH TAB                                                 */}
                    {/* ========================================================================= */}
                    <TabsContent value="health" className="space-y-6 outline-none">
                        
                        {/* DEPRECIATION STATS STRIP */}
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                            <Card className="border border-slate-200/80 bg-gradient-to-br from-emerald-50 to-emerald-100/30 shadow-sm overflow-hidden group">
                                <CardContent className="pt-6 relative">
                                    <ShieldCheck className="absolute -right-2 -bottom-2 h-16 w-16 text-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Asset Health Ratio</p>
                                            <p className="text-3xl font-black text-emerald-700">{reportData.healthyAssetRatio}%</p>
                                        </div>
                                        <ShieldCheck className="h-8 w-8 text-emerald-300" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-slate-200/80 bg-gradient-to-br from-rose-50 to-rose-100/30 shadow-sm overflow-hidden group">
                                <CardContent className="pt-6 relative">
                                    <AlertCircle className="absolute -right-2 -bottom-2 h-16 w-16 text-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Critical Repair Priority</p>
                                            <p className="text-3xl font-black text-rose-700">{reportData.poorConditionCount}</p>
                                        </div>
                                        <AlertCircle className="h-8 w-8 text-rose-300" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-slate-200/80 bg-gradient-to-br from-indigo-50 to-indigo-100/30 shadow-sm overflow-hidden group">
                                <CardContent className="pt-6 relative">
                                    <Wrench className="absolute -right-2 -bottom-2 h-16 w-16 text-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Total out of commission</p>
                                            <p className="text-3xl font-black text-indigo-700">{reportData.itemsUnderMaintenance}</p>
                                        </div>
                                        <Wrench className="h-8 w-8 text-indigo-300" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* SUB-SECTIONS */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            
                            {/* CONDITION PIE */}
                            <Card className="lg:col-span-2 border border-slate-200/80 shadow-sm">
                                <CardHeader className="pb-0 bg-slate-50/50 border-b">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                                        <Hammer className="h-4 w-4 text-indigo-500" /> Physical Condition Index
                                    </CardTitle>
                                    <CardDescription>Qualitative health analysis of school assets.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[260px] flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie 
                                                data={reportData.conditionPieData} 
                                                dataKey="value" 
                                                nameKey="name" 
                                                cx="50%" 
                                                cy="50%" 
                                                innerRadius={50}
                                                outerRadius={75} 
                                                paddingAngle={4}
                                            >
                                                {reportData.conditionPieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={CONDITION_COLORS[entry.name as keyof typeof CONDITION_COLORS] || '#a855f7'} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(v) => [`${v} Units`, 'Quantity']} />
                                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* CRITICAL ACTIONS CHECKLIST */}
                            <Card className="lg:col-span-3 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                                <CardHeader className="bg-rose-50/50 border-b border-rose-100 pb-3">
                                    <CardTitle className="text-sm font-bold text-rose-700 flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-rose-500" /> Maintenance & Replacement Priority
                                    </CardTitle>
                                    <CardDescription className="text-rose-600">Assets flagged as poor, for repair, or under maintenance.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0 overflow-y-auto max-h-[200px] divide-y">
                                    {reportData.actionableAssets.map(asset => (
                                        <div key={asset.id} className="p-3 hover:bg-slate-50 transition-colors flex justify-between items-center gap-3">
                                            <div>
                                                <p className="font-bold text-xs text-slate-800">{asset.name} (Qty: {asset.quantity})</p>
                                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                                    Location: <strong>{asset.location}</strong> | Supplier: <strong>{asset.supplier}</strong>
                                                </p>
                                            </div>
                                            <div className="flex gap-1">
                                                <Badge className="text-[9px] font-bold" style={{ backgroundColor: CONDITION_COLORS[asset.condition as keyof typeof CONDITION_COLORS] }}>
                                                    {asset.condition}
                                                </Badge>
                                                <Badge variant="outline" className="text-[9px] font-semibold">
                                                    {asset.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                    {reportData.actionableAssets.length === 0 && (
                                        <div className="text-center py-16 text-slate-400 text-xs font-semibold">
                                            🎉 All assets are reported in Good or New condition.
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="py-2.5 px-4 border-t bg-slate-50/50 text-[10px] font-semibold text-slate-500 flex items-center gap-1.5">
                                    <Info className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> Action: Queue highlighted items for repair services or submit budget for replacement.
                                </CardFooter>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* ========================================================================= */}
                    {/* ASSET DIRECTORY TAB                                                       */}
                    {/* ========================================================================= */}
                    <TabsContent value="directory" className="space-y-6 outline-none">
                        
                        {/* SEARCH AND TABLE CONTAINER */}
                        <Card className="border border-slate-200/80 shadow-sm">
                            <CardHeader className="pb-3 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-slate-50/50">
                                <div>
                                    <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-700">
                                        <FileText className="h-5 w-5 text-indigo-500" /> Capital Asset Directory
                                    </CardTitle>
                                    <CardDescription>Searchable inventory registry including quantity and condition states.</CardDescription>
                                </div>
                                <div className="relative w-full sm:w-60 print:hidden">
                                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                    <Input
                                        placeholder="Search name, holder, location..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-8 h-9 text-xs bg-white border-2"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Asset Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Condition</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-center">Qty</TableHead>
                                            <TableHead className="text-right font-black">Holdings value</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredInventory.map(item => (
                                            <TableRow key={item.id} className="hover:bg-slate-50 transition-colors">
                                                <TableCell className="font-bold text-slate-700">
                                                    <div>{item.name}</div>
                                                    {item.currentHolderName && (
                                                        <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                                                            Holder: {item.currentHolderName}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-xs text-slate-500 font-semibold">{item.category}</TableCell>
                                                <TableCell className="text-xs text-slate-600 font-semibold">{item.location}</TableCell>
                                                <TableCell>
                                                    <Badge className="text-[10px] font-bold" style={{ backgroundColor: CONDITION_COLORS[item.condition as keyof typeof CONDITION_COLORS] || '#6b7280' }}>
                                                        {item.condition}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(item.status)} className="text-[10px] font-bold">
                                                        {item.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center font-bold text-slate-700">{item.quantity}</TableCell>
                                                <TableCell className="text-right font-black text-indigo-600">
                                                    GH₵{((item.unitPrice || 0) * item.quantity).toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredInventory.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-10 text-slate-400 italic text-sm">
                                                    No assets found matching the search criteria.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            ) : (
                <div className="text-center py-20 bg-slate-100 rounded-xl border border-slate-200">
                    <p className="text-slate-500 font-medium">No inventory or physical assets registered in the school ledger.</p>
                </div>
            )}
        </div>
    );
}
