'use client';

import { useMemo } from 'react';
import { useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Loader2, CalendarCheck, Info } from 'lucide-react';
import { StudentDisplay } from '@/components/student-display';

/**
 * @fileOverview Personal attendance history for Students and Parents.
 * Features real-time sync and color-coded status indicators.
 */
export default function MyAttendancePage() {
    const { user } = useAuth();
    const { role, profile } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();

    // Robust field mapping for linked students
    const parentStudentIds = useMemo(() => {
        return profile?.studentIds || profile?.student_ids || profile?.students || [];
    }, [profile]);

    // 1. Fetch relevant students for naming/mapping
    const studentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !role) return null;
        if (role === 'Student' && user) return query(collection(firestore, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId));
        if (role === 'Parent' && parentStudentIds.length > 0) return query(collection(firestore, 'students'), where('uid', 'in', parentStudentIds), where('schoolId', '==', schoolId));
        return null;
    }, [firestore, schoolId, role, user?.uid, parentStudentIds]);
    const { data: students } = useCollection<any>(studentsQuery);

    // 2. Fetch Attendance Records
    const attendanceQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !user || !role) return null;
        
        const baseQuery = collection(firestore, 'attendance');

        if (role === 'Student') {
            return query(
                baseQuery, 
                where('schoolId', '==', schoolId), 
                where('studentId', '==', user.uid), 
                orderBy('date', 'desc'), 
                limit(30)
            );
        }
        if (role === 'Parent') {
            if (parentStudentIds.length === 0) return null;
            return query(
                baseQuery, 
                where('schoolId', '==', schoolId), 
                where('studentId', 'in', parentStudentIds), 
                orderBy('date', 'desc'), 
                limit(50)
            );
        }
        return null;
    }, [firestore, schoolId, role, user?.uid, parentStudentIds]);
    const { data: attendance, isLoading } = useCollection<any>(attendanceQuery);

    if (isLoading || schoolLoading) {
        return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-600 h-8 w-8"/></div>;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Present': return 'bg-green-500 hover:bg-green-600';
            case 'Absent': return 'bg-red-500 hover:bg-red-600';
            case 'Late': return 'bg-orange-500 hover:bg-orange-600';
            default: return 'bg-slate-500 hover:bg-slate-600';
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
                    <CalendarCheck className="text-indigo-600 h-8 w-8"/> Attendance <span className="text-indigo-600">History</span>
                </h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Your official participation log</p>
            </div>
            
            <Card className="rounded-[2rem] border-none shadow-xl bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Recent Records</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50">
                                <TableHead className="font-bold">Date</TableHead>
                                {role === 'Parent' && <TableHead className="font-bold">Student</TableHead>}
                                <TableHead className="font-bold">Status</TableHead>
                                <TableHead className="font-bold">Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(!attendance || attendance.length === 0) ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-2 opacity-20">
                                            <CalendarCheck size={48} />
                                            <p className="font-black uppercase tracking-widest text-xs">No records found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                attendance.map(record => {
                                    const student = students?.find(s => s.uid === record.studentId);
                                    
                                    return (
                                        <TableRow key={record.id} className="hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="font-bold text-slate-700">
                                                {record.date?.toDate ? format(record.date.toDate(), 'PPP') : 'Unknown Date'}
                                            </TableCell>
                                            {role === 'Parent' && (
                                                <TableCell>
                                                    {student ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600 uppercase">
                                                                {student.firstName?.[0]}{student.lastName?.[0]}
                                                            </div>
                                                            <span className="font-medium">{student.firstName} {student.lastName}</span>
                                                        </div>
                                                    ) : 'Unknown'}
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <Badge className={`${getStatusColor(record.status)} text-white font-black uppercase text-[10px] tracking-widest rounded-lg px-3 py-1`}>
                                                    {record.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-500 italic">
                                                {record.notes ? `"${record.notes}"` : '-'}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="bg-slate-50/50 py-3 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Info className="h-3 w-3" />
                    <span>Attendance is updated daily by class teachers</span>
                </CardFooter>
            </Card>
        </div>
    );
}
