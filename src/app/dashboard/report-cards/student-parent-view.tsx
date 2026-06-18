'use client';

import { useState, useMemo } from 'react';
import { useUser, useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where, orderBy } from 'firebase/firestore';
import { ReportCard, Student } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertTriangle, ShieldAlert, Users, Award, GraduationCap, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudentReportCard } from './student-report-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Suspense } from 'react';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

function ReportListForStudent({ student }: { student: Student }) {
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const studentIdentifier = student.id || student.uid;

    const reportsQuery = useMemoFirebase(
      () => (studentIdentifier && firestore && schoolId) ? query(
          collection(firestore, 'report-cards'), 
          where('schoolId', '==', schoolId),
          where('studentId', '==', studentIdentifier), 
          where('status', '==', 'Published'),
          orderBy('publishedAt', 'desc')
      ) : null,
      [firestore, studentIdentifier, schoolId]
    );
    const { data: reports, isLoading } = useCollection<ReportCard>(reportsQuery);

    if (isLoading) {
        return <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-650" /></div>;
    }

    if (!reports || reports.length === 0) {
        return (
            <div className="p-12 text-center border-2 border-dashed rounded-3xl bg-white/50 m-2">
                <AlertTriangle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500 italic font-medium">No published report cards available for this child yet.</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {reports.map(report => {
                const average = (report as any).overallAverage || report.finalPercentage || 0;
                
                // Color mapping for averages
                const getAverageColor = (avg: number) => {
                    if (avg >= 80) return 'from-emerald-500 to-teal-500 text-white';
                    if (avg >= 70) return 'from-indigo-500 to-indigo-650 text-white';
                    if (avg >= 50) return 'from-amber-500 to-orange-500 text-white';
                    return 'from-rose-500 to-red-500 text-white';
                };

                return (
                    <div 
                        key={report.id} 
                        className="group flex flex-col md:flex-row justify-between items-start md:items-center p-6 border border-slate-100 rounded-3xl bg-white shadow-sm hover:shadow-md hover:border-indigo-500/20 transition-all duration-300 gap-4"
                    >
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                                    {report.academicYear}
                                </span>
                                <span className="h-1 w-1 bg-slate-350 rounded-full" />
                                <span className="text-[10px] font-bold text-slate-400">
                                    Released {report.publishedAt ? format((report.publishedAt as any).toDate(), 'dd MMM yyyy') : ''}
                                </span>
                            </div>
                            <h3 className="font-black text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                                {report.term}
                            </h3>
                            
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mt-2">
                                <div className="flex items-center gap-1">
                                    <span className="text-slate-400">Rank:</span>
                                    <span className="font-extrabold text-slate-700">{report.classPosition || '-'}</span>
                                </div>
                                <span className="h-3 w-px bg-slate-200" />
                                <div className="flex items-center gap-1">
                                    <span className="text-slate-400">Class Avg:</span>
                                    <span className="font-extrabold text-slate-700">{(report as any).classAverage || '-'}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 justify-between md:justify-end">
                            <div className={`px-4 py-2 rounded-2xl bg-gradient-to-r ${getAverageColor(average)} font-black text-center text-sm shadow-sm flex flex-col items-center justify-center min-w-[70px]`}>
                                <span className="text-[9px] opacity-80 uppercase tracking-widest font-black leading-none mb-0.5">AVG</span>
                                <span className="text-sm font-black leading-none">{average}%</span>
                            </div>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button 
                                        variant="outline" 
                                        className="rounded-2xl font-black text-xs uppercase border-indigo-100 text-indigo-700 hover:bg-indigo-50/50 hover:border-indigo-200 shadow-sm shrink-0 px-4 py-2.5 h-auto transition-all"
                                    >
                                        View Transcript
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto rounded-[2.5rem] border border-slate-800 bg-slate-950/95 p-6 shadow-2xl">
                                    <DialogHeader className="mb-4">
                                        <div className="flex justify-between items-center pr-6">
                                            <DialogTitle className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                                                <Award className="text-indigo-400 h-5 w-5" /> Academic Transcript Review
                                            </DialogTitle>
                                        </div>
                                    </DialogHeader>
                                    <Suspense fallback={
                                        <div className="flex flex-col items-center justify-center p-24 text-slate-400 gap-3">
                                            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                                            <p className="text-sm font-medium animate-pulse">Rendering official document...</p>
                                        </div>
                                    }>
                                        <div className="bg-slate-900/40 p-1 md:p-6 rounded-[2rem] flex justify-center border border-white/5 overflow-auto">
                                            <div className="shadow-2xl border border-slate-900 rounded-3xl overflow-hidden bg-white">
                                                <StudentReportCard student={student} term={report.term} year={report.academicYear} savedReport={report} />
                                            </div>
                                        </div>
                                    </Suspense>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ChildProfileCard({ 
    studentUid, 
    isActive, 
    onClick 
}: { 
    studentUid: string; 
    isActive: boolean; 
    onClick: () => void;
}) {
    const firestore = useFirestore();
    const studentDocRef = useMemoFirebase(
        () => firestore ? doc(firestore, 'students', studentUid) : null,
        [firestore, studentUid]
    );
    const { data: student, isLoading } = useDoc<Student>(studentDocRef);

    const classDocRef = useMemoFirebase(
        () => (firestore && student?.classId) ? doc(firestore, 'classes', student.classId) : null,
        [firestore, student?.classId]
    );
    const { data: classDoc } = useDoc<any>(classDocRef);

    if (isLoading) {
        return (
            <div className="h-24 w-full animate-pulse bg-slate-100 rounded-3xl border border-slate-200/50" />
        );
    }

    if (!student) return (
        <div className="p-4 border border-dashed rounded-3xl text-red-500 bg-red-50 flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span className="text-xs font-semibold">Record not found</span>
        </div>
    );

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all duration-300 text-left w-full relative overflow-hidden ${
                isActive 
                    ? 'border-indigo-650 bg-indigo-50/40 shadow-md shadow-indigo-100/50' 
                    : 'border-slate-100 bg-white hover:border-slate-250 hover:bg-slate-50/50 shadow-sm'
            }`}
        >
            <div className="relative">
                <Avatar className={`h-12 w-12 border-2 transition-transform duration-300 ${isActive ? 'scale-105 border-indigo-650' : 'border-slate-200'}`}>
                    {student.photoURL && <AvatarImage src={student.photoURL} alt={student.firstName} className="object-cover" />}
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-base">
                        {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                {isActive && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
                    </span>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-slate-800 truncate text-base leading-snug">
                    {student.firstName} {student.lastName}
                </h3>
                <p className="text-xs font-semibold text-indigo-600/80 font-mono mt-0.5">
                    {student.studentId || 'ID Pending'}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    {classDoc?.name || 'No Class Assigned'}
                </p>
            </div>
            
            {isActive && (
                <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl" />
            )}
        </button>
    );
}

function ReportListForStudentWrapper({ studentUid }: { studentUid: string }) {
    const firestore = useFirestore();
    const studentDocRef = useMemoFirebase(
        () => firestore ? doc(firestore, 'students', studentUid) : null,
        [firestore, studentUid]
    );
    const { data: student, isLoading } = useDoc<Student>(studentDocRef);

    if (isLoading) {
        return <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
    }

    if (!student) {
        return (
            <div className="p-8 text-center text-red-500">
                <p>Student record not found.</p>
            </div>
        );
    }

    return <ReportListForStudent student={student} />;
}

export default function StudentParentReportCardView() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { role, profile, loading: isRoleLoading } = useRole();
    const { schoolId } = useCurrentSchool();

    // Robust field mapping for linked students
    const studentIds = useMemo(() => {
        return profile?.studentIds || profile?.student_ids || profile?.students || profile?.childrenIds || profile?.linkedStudentIds || [];
    }, [profile]);

    const { data: studentForStudentRole, isLoading: isStudentLoading } = useCollection<Student>(
        useMemoFirebase(() => (role === 'Student' && user && firestore && schoolId) ? query(collection(firestore, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId)) : null, [firestore, user?.uid, role, schoolId])
    );

    const [activeChildId, setActiveChildId] = useState<string | null>(null);

    // Sync active child state once studentIds are available
    useMemo(() => {
        if (studentIds.length > 0 && !activeChildId) {
            setActiveChildId(studentIds[0]);
        }
    }, [studentIds, activeChildId]);
    
    const isLoading = isUserLoading || isRoleLoading || isStudentLoading;

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }
    
    // --- View for Students ---
    if (role === 'Student') {
        const student = studentForStudentRole?.[0];
        if (!student) return (
            <div className="p-12 text-center border-2 border-dashed rounded-[2rem] bg-slate-50/50 max-w-2xl mx-auto mt-10">
                <p className="text-slate-500 font-medium italic">Student profile not found. Please contact school administration.</p>
            </div>
        );
        
        return (
            <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-6">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-8 md:p-10 shadow-xl border border-indigo-950/20 text-white">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[80px]" />

                    <div className="relative z-10 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-indigo-200 text-xs font-black uppercase tracking-wider">
                            <GraduationCap className="h-3.5 w-3.5" /> Academic Transcript Hub
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                                My Report Cards
                            </h1>
                            <p className="text-indigo-200/85 text-sm md:text-base max-w-xl font-medium leading-relaxed font-sans">
                                Review your official terminal achievements, performance tracking, teacher remarks, and authorized signatures.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Academic Transcript History
                    </h2>
                    <div className="bg-slate-50/30 rounded-[2rem] border border-slate-100 p-2">
                        <ReportListForStudent student={student} />
                    </div>
                </div>
            </div>
        );
    }

    // --- View for Parents ---
    if (role === 'Parent') {
        if (!studentIds || studentIds.length === 0) {
            return (
                <div className="p-12 text-center border-2 border-dashed rounded-[2rem] bg-slate-50/50 max-w-2xl mx-auto mt-10">
                    <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-slate-800">No Reports Available</h3>
                    <p className="text-slate-500 mt-2">We couldn't find any children linked to your account.</p>
                </div>
            );
        }
        
        return (
            <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-6">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-8 md:p-10 shadow-xl border border-indigo-950/20 text-white">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[80px]" />

                    <div className="relative z-10 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-indigo-200 text-xs font-black uppercase tracking-wider">
                            <GraduationCap className="h-3.5 w-3.5" /> Academic Transcript Hub
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                                Children's Report Cards
                            </h1>
                            <p className="text-indigo-200/85 text-sm md:text-base max-w-xl font-medium leading-relaxed font-sans">
                                Review official terminal achievements, performance tracking, teacher remarks, and authorized signatures.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <Users className="h-4 w-4" /> Select Student Profile
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {studentIds.map((uid: string) => (
                            <ChildProfileCard 
                                key={uid} 
                                studentUid={uid} 
                                isActive={activeChildId === uid}
                                onClick={() => setActiveChildId(uid)}
                            />
                        ))}
                    </div>
                </div>

                {activeChildId && (
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <FileText className="h-4 w-4" /> Academic Transcript History
                        </h2>
                        <div className="bg-slate-50/30 rounded-[2rem] border border-slate-100 p-2">
                            <ReportListForStudentWrapper studentUid={activeChildId} />
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
    return null;
}
