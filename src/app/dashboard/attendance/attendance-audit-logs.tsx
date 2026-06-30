'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, doc, getDocs, writeBatch, serverTimestamp, limit } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Loader2, RefreshCw, Sparkles, Calendar, Search, History, ShieldAlert } from 'lucide-react';
import { format, startOfDay } from 'date-fns';
import { Input } from '@/components/ui/input';

export function AttendanceAuditLogs() {
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();
    const { user } = useUser();
    const { role } = useRole();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);

    const [rawLogs, setRawLogs] = useState<any[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadLogs = useCallback(async () => {
        if (!firestore || !schoolId || !user || !role) return;
        setIsLoading(true);
        setError(null);
        try {
            const isManager = role === 'Director' || role === 'Administrator';
            let q;
            if (isManager) {
                q = query(
                    collection(firestore, 'auditLogs'),
                    where('schoolId', '==', schoolId),
                    where('action', '==', 'STUDENT_ATTENDANCE_TAKEN'),
                    orderBy('timestamp', 'desc'),
                    limit(150)
                );
            } else {
                q = query(
                    collection(firestore, 'auditLogs'),
                    where('schoolId', '==', schoolId),
                    where('action', '==', 'STUDENT_ATTENDANCE_TAKEN'),
                    where('userId', '==', user.uid),
                    limit(150)
                );
            }
            const snap = await getDocs(q);
            const items = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setRawLogs(items);
        } catch (e: any) {
            console.error("Error loading audit logs:", e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }, [firestore, schoolId, user, role]);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    const forceRefetch = () => {
        loadLogs();
    };

    // Queries to resolve IDs
    const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: classes } = useCollection<any>(classesQuery);

    const staffQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: staff } = useCollection<any>(staffQuery);

    // Filter logs by search term and sort client-side
    const logs = useMemo(() => {
        if (!rawLogs) return [];
        
        // Sort chronologically desc (critical if fetched without server-side orderBy index constraints)
        const sorted = [...rawLogs].sort((a, b) => {
            const tA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
            const tB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
            return tB.getTime() - tA.getTime();
        });

        if (!searchTerm.trim()) return sorted;
        
        const term = searchTerm.toLowerCase();
        return sorted.filter((log: any) => 
            log.userName?.toLowerCase().includes(term) ||
            log.details?.toLowerCase().includes(term)
        );
    }, [rawLogs, searchTerm]);

    // Retrospective sync function (restores logs from last week)
    const handleSyncHistory = async () => {
        if (!firestore || !schoolId) return;
        setIsSyncing(true);
        try {
            // 1. Calculate threshold for "last week" (10 days ago)
            const thresholdDate = new Date();
            thresholdDate.setDate(thresholdDate.getDate() - 10);
            const startThreshold = startOfDay(thresholdDate);

            // 2. Fetch all student attendance records from threshold
            const attendanceSnap = await getDocs(query(
                collection(firestore, 'attendance'),
                where('schoolId', '==', schoolId),
                where('date', '>=', startThreshold)
            ));

            if (attendanceSnap.empty) {
                toast({ title: "No Historical Records", description: "No student attendance records were found from last week to sync." });
                setIsSyncing(false);
                return;
            }

            // 3. Group by classId and date (represented as YYYY-MM-DD)
            const groupedRecords: { [key: string]: any[] } = {};
            attendanceSnap.docs.forEach(docSnap => {
                const data = docSnap.data();
                const classId = data.classId;
                const timestampDate = data.date;
                let dateStr = '';
                if (timestampDate?.toDate) {
                    dateStr = format(timestampDate.toDate(), 'yyyy-MM-dd');
                } else if (timestampDate instanceof Date) {
                    dateStr = format(timestampDate, 'yyyy-MM-dd');
                } else if (timestampDate) {
                    dateStr = format(new Date(timestampDate), 'yyyy-MM-dd');
                }

                if (classId && dateStr) {
                    const key = `${classId}_${dateStr}`;
                    if (!groupedRecords[key]) groupedRecords[key] = [];
                    groupedRecords[key].push({ id: docSnap.id, ...data });
                }
            });

            // 4. Build write batch to set deterministic audit log documents
            const batch = writeBatch(firestore);
            let syncCount = 0;

            Object.entries(groupedRecords).forEach(([key, records]) => {
                const [classId, dateStr] = key.split('_');
                
                // Calculate counts
                const presentCount = records.filter(r => r.status === 'Present').length;
                const absentCount = records.filter(r => r.status === 'Absent').length;
                const lateCount = records.filter(r => r.status === 'Late').length;
                const excusedCount = records.filter(r => r.status === 'Excused').length;

                // Find the latest updatedAt and updatedBy
                let latestUpdatedAt: any = null;
                let latestUpdatedBy = '';

                records.forEach(r => {
                    if (r.updatedAt) {
                        const t = r.updatedAt.toDate ? r.updatedAt.toDate() : new Date(r.updatedAt);
                        if (!latestUpdatedAt || t > latestUpdatedAt) {
                            latestUpdatedAt = t;
                            latestUpdatedBy = r.updatedBy || '';
                        }
                    }
                });

                // Resolve class name
                const targetClass = classes?.find((c: any) => c.id === classId);
                const className = targetClass?.name || `Class ${classId}`;

                // Resolve username
                let staffName = 'Staff Member';
                if (latestUpdatedBy) {
                    const targetStaff = staff?.find((s: any) => s.uid === latestUpdatedBy || s.id === latestUpdatedBy);
                    if (targetStaff) {
                        staffName = `${targetStaff.firstName || ''} ${targetStaff.lastName || ''}`.trim();
                    } else {
                        staffName = `Staff ID: ${latestUpdatedBy.substring(0, 6)}`;
                    }
                }

                // Deterministic doc ID to avoid duplicates
                const logDocId = `retro-att-${schoolId}-${classId}-${dateStr}`;
                const logDocRef = doc(firestore, 'auditLogs', logDocId);

                batch.set(logDocRef, {
                    schoolId,
                    userName: staffName,
                    action: 'STUDENT_ATTENDANCE_TAKEN',
                    details: `Class: ${className} | Date: ${dateStr} | Summary - Present: ${presentCount}, Absent: ${absentCount}, Late: ${lateCount}, Excused: ${excusedCount} (Historical Sync)`,
                    timestamp: latestUpdatedAt ? latestUpdatedAt : serverTimestamp()
                }, { merge: true });

                syncCount++;
            });

            await batch.commit();
            toast({ title: "Historical Sync Complete", description: `Reconstructed ${syncCount} class attendance logs from last week successfully!` });
            forceRefetch();
        } catch (e: any) {
            console.error("Sync error:", e);
            toast({ variant: 'destructive', title: "Sync Failed", description: e.message });
        } finally {
            setIsSyncing(false);
        }
    };

    const formatDateSafe = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return format(d, 'PPP p');
    };

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 flex flex-row items-center justify-between gap-4 flex-wrap pb-6">
                <div>
                    <CardTitle className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                        <History className="h-5 w-5 text-indigo-600" />
                        Attendance Audit Trail
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                        Detailed trail showing when attendance was submitted, who marked it, and the student presence details.
                    </CardDescription>
                </div>
                
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={forceRefetch}
                        disabled={isLoading}
                        className="h-9 rounded-xl font-bold bg-white border-slate-200"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button 
                        onClick={handleSyncHistory}
                        disabled={isSyncing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 rounded-xl border-0 shadow-md flex items-center gap-1.5"
                    >
                        {isSyncing ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Syncing Last Week...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-3.5 w-3.5" />
                                Sync Historical Logs
                            </>
                        )}
                    </Button>
                </div>
            </CardHeader>
            
            <CardContent className="px-0 space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 text-sm font-semibold flex items-start gap-2.5">
                        <ShieldAlert className="h-5 w-5 text-red-650 flex-shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold block">Firestore Permission Restrained</span>
                            <span className="text-xs text-slate-500 font-medium block mt-1">
                                The database denied this query. Ensure the latest firestore security rules are deployed:
                            </span>
                            <code className="inline-block bg-red-100/80 text-red-900 border border-red-200 px-2 py-0.5 rounded font-mono text-[10px] font-bold mt-2">
                                firebase deploy --only firestore:rules
                            </code>
                        </div>
                    </div>
                )}
                <div className="flex bg-white/60 backdrop-blur-sm p-3 rounded-2xl border border-slate-100 shadow-sm max-w-md">
                    <Search className="h-4 w-4 text-slate-400 m-2" />
                    <Input 
                        placeholder="Search logs by staff name or class..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="h-8 border-0 bg-transparent focus-visible:ring-0 shadow-none text-xs pl-1 placeholder:text-slate-400"
                    />
                </div>

                <div className="border border-slate-150 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-50/75">
                            <TableRow>
                                <TableHead className="pl-6 font-bold text-xs">Roster Date / Details</TableHead>
                                <TableHead className="font-bold text-xs">Action Timestamp</TableHead>
                                <TableHead className="font-bold text-xs">Logged By</TableHead>
                                <TableHead className="pr-6 text-right font-bold text-xs">Roster Summary</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-20">
                                        <Loader2 className="animate-spin text-indigo-600 h-10 w-10 mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : logs.length > 0 ? (
                                logs.map((log: any) => {
                                    const detailsStr = log.details || '';
                                    const classPart = detailsStr.split(' | ')[0] || '';
                                    const datePart = detailsStr.split(' | ')[1] || '';
                                    const summaryPart = detailsStr.split('Summary - ')[1] || '';
                                    
                                    return (
                                        <TableRow key={log.id} className="hover:bg-slate-50/50">
                                            <TableCell className="pl-6 py-4">
                                                <div className="font-bold text-slate-800 text-sm">
                                                    {classPart.replace('Class: ', '')}
                                                </div>
                                                <div className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {datePart.replace('Date: ', '') || 'Roster Sheet'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-500 font-medium">
                                                {formatDateSafe(log.timestamp)}
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                <span className="font-bold text-slate-700">{log.userName}</span>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right font-mono text-[11px] font-bold text-slate-600">
                                                {summaryPart || detailsStr}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-16 text-slate-400 text-sm">
                                        <ShieldAlert className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                                        No attendance logs found in this period.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
