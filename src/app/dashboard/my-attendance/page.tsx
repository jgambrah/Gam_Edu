'use client';

import { useMemo } from 'react';
import { useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, limit, documentId } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Loader2, CalendarCheck, Info } from 'lucide-react';

/**
 * @fileOverview Personal attendance history for Students and Parents.
 *
 * KEY FIX — Parent flow had a two-level ID mismatch:
 *
 * 1. parentStudentIds contains Firestore *document IDs* of student docs
 *    (the `id` field set by Firestore, e.g. "abc123").
 *    The old code passed these directly to `where('studentId', 'in', ...)` on
 *    the attendance collection, but attendance records store the student's
 *    Firebase Auth *uid*, not the document ID — so no records were ever found.
 *
 * 2. The student name-lookup query used `where('uid', 'in', slice)` with the
 *    same document-ID values, so it also returned nothing, causing every
 *    matched attendance row to show "Unlinked Student".
 *
 * Fix:
 *  - Step 1: Fetch student docs by their Firestore document IDs using
 *            `where(documentId(), 'in', slice)`.
 *  - Step 2: Extract the `uid` field from those docs.
 *  - Step 3: Query attendance using those uid values.
 *  - Step 4: Match attendance rows to student names via uid — correctly.
 */
export default function MyAttendancePage() {
    const { user } = useAuth();
    const { role, profile, loading: roleLoading } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();

    // ── Collect the parent's linked student *document IDs* ──────────────────
    const parentStudentDocIds = useMemo(() => {
        if (!profile) return [];
        return (
            profile.studentIds ||
            profile.student_ids ||
            profile.students ||
            profile.linkedStudentIds ||
            profile.childrenIds ||
            []
        );
    }, [profile]);

    // ── Step 1: Fetch student documents by Firestore document ID ────────────
    // For Students: match by their own uid field.
    // For Parents : match by document ID (the IDs stored on the parent profile).
    const studentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !role) return null;

        if (role === 'Student' && user) {
            return query(
                collection(firestore, 'students'),
                where('uid', '==', user.uid),
                where('schoolId', '==', schoolId)
            );
        }

        if (role === 'Parent' && parentStudentDocIds.length > 0) {
            // documentId() matches against the Firestore auto-generated doc ID,
            // which is what parent profiles store in their studentIds array.
            const slice = parentStudentDocIds.slice(0, 30);
            return query(
                collection(firestore, 'students'),
                where(documentId(), 'in', slice),
                where('schoolId', '==', schoolId)
            );
        }

        return null;
    }, [firestore, schoolId, role, user?.uid, parentStudentDocIds]);

    const { data: students, isLoading: studentsLoading } = useCollection<any>(studentsQuery);

    // ── Step 2: Derive the uid values from fetched student docs ─────────────
    // Attendance records store `studentId` as the Firebase Auth uid, so we
    // need the uid field — not the Firestore document id.
    const parentStudentUids = useMemo(() => {
        if (role !== 'Parent' || !students) return [];
        return students.map((s: any) => s.uid).filter(Boolean);
    }, [role, students]);

    // ── Step 3: Fetch attendance using the correct uid values ────────────────
    const attendanceQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !user || !role) return null;

        const baseQuery = collection(firestore, 'attendance');

        if (role === 'Student') {
            // Student's own uid is already correct for this field.
            return query(
                baseQuery,
                where('schoolId', '==', schoolId),
                where('studentId', '==', user.uid),
                limit(50)
            );
        }

        if (role === 'Parent' && parentStudentUids.length > 0) {
            // Now correctly using Auth uids, not document IDs.
            const slice = parentStudentUids.slice(0, 30);
            return query(
                baseQuery,
                where('schoolId', '==', schoolId),
                where('studentId', 'in', slice),
                limit(100)
            );
        }

        return null;
    }, [firestore, schoolId, role, user?.uid, parentStudentUids]);

    const { data: attendance, isLoading: attendanceLoading } = useCollection<any>(attendanceQuery);

    // ── Step 4: Sort newest-first in memory ──────────────────────────────────
    const sortedAttendance = useMemo(() => {
        if (!attendance) return [];
        return [...attendance].sort((a, b) => {
            const dateA = a.date?.toDate ? a.date.toDate().getTime() : 0;
            const dateB = b.date?.toDate ? b.date.toDate().getTime() : 0;
            return dateB - dateA;
        });
    }, [attendance]);

    // Show loader while any essential data is still resolving.
    // For parents we wait for students to load first so that the
    // uid-based attendance query can be constructed correctly.
    const isLoading =
        attendanceLoading ||
        studentsLoading ||
        schoolLoading ||
        roleLoading ||
        (role === 'Parent' && parentStudentDocIds.length > 0 && !students);

    if (isLoading) {
        return (
            <div className="p-10 flex justify-center">
                <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Present': return 'bg-green-500 hover:bg-green-600';
            case 'Absent':  return 'bg-red-500 hover:bg-red-600';
            case 'Late':    return 'bg-orange-500 hover:bg-orange-600';
            default:        return 'bg-slate-500 hover:bg-slate-600';
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
                    <CalendarCheck className="text-indigo-600 h-8 w-8" />
                    Attendance <span className="text-indigo-600">History</span>
                </h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                    Your official participation log
                </p>
            </div>

            <Card className="rounded-[2rem] border-none shadow-xl bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">
                        Recent Records
                    </CardTitle>
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
                            {sortedAttendance.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={role === 'Parent' ? 4 : 3}
                                        className="text-center py-20"
                                    >
                                        <div className="flex flex-col items-center gap-2 opacity-20">
                                            <CalendarCheck size={48} />
                                            <p className="font-black uppercase tracking-widest text-xs">
                                                No records found
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedAttendance.map(record => {
                                    // Match by uid — now consistent with how attendance is stored.
                                    const student = students?.find(
                                        (s: any) => s.uid === record.studentId
                                    );

                                    return (
                                        <TableRow
                                            key={record.id}
                                            className="hover:bg-slate-50/50 transition-colors"
                                        >
                                            <TableCell className="font-bold text-slate-700">
                                                {record.date?.toDate
                                                    ? format(record.date.toDate(), 'PPP')
                                                    : 'Unknown Date'}
                                            </TableCell>

                                            {role === 'Parent' && (
                                                <TableCell>
                                                    {student ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600 uppercase">
                                                                {student.firstName?.[0]}{student.lastName?.[0]}
                                                            </div>
                                                            <span className="font-medium">
                                                                {student.firstName} {student.lastName}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">
                                                            Unlinked Student
                                                        </span>
                                                    )}
                                                </TableCell>
                                            )}

                                            <TableCell>
                                                <Badge
                                                    className={`${getStatusColor(record.status)} text-white font-black uppercase text-[10px] tracking-widest rounded-lg px-3 py-1`}
                                                >
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
