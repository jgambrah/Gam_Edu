'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import ReportCardTemplate from './components/ReportCardTemplate';

type Student = { uid: string; firstName: string; lastName: string; classId: string; id: string; };

export function StudentReportCard({ student, term, year, savedReport }: { student: Student, term: string, year: string, savedReport?: any }) {
    const firestore = useFirestore();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

    const schoolProfileRef = useMemoFirebase(
      () => (firestore && schoolId ? doc(firestore, 'schoolSettings', schoolId) : null),
      [firestore, schoolId]
    );
    const { data: schoolProfile, isLoading: isLoadingProfile } = useDoc(schoolProfileRef);
    
    const isLoading = isLoadingSchool || isLoadingProfile;

    // Merge snap details with current school settings to handle missing properties gracefully
    const mergedReport = useMemo(() => {
        if (!savedReport) return null;
        return {
            ...savedReport,
            logoUrl: savedReport.logoUrl || schoolProfile?.logoUrl || null,
            headmasterSignatureUrl: savedReport.headmasterSignatureUrl || schoolProfile?.headmasterSignatureUrl || null,
            brandColor: savedReport.brandColor || schoolProfile?.brandColor || '#1e293b',
        };
    }, [savedReport, schoolProfile]);

    if (isLoading) {
        return (
            <div className="space-y-4 p-6">
                <Skeleton className="h-24 w-full rounded-2xl animate-pulse" />
                <Skeleton className="h-64 w-full rounded-2xl animate-pulse" />
                <Skeleton className="h-32 w-full rounded-2xl animate-pulse" />
            </div>
        );
    }

    if (mergedReport) {
        return (
            <div className="w-full bg-white flex flex-col items-center">
                <div className="shadow-lg border border-slate-100 rounded-3xl overflow-hidden mb-6 scale-[0.9] origin-top md:scale-100 max-w-full bg-white">
                    <ReportCardTemplate
                        data={mergedReport}
                        classTeacherComment={mergedReport.classTeacherComment}
                        headmasterComment={mergedReport.headmasterComment}
                        caWeight={mergedReport.caWeight ?? 30}
                        examWeight={mergedReport.examWeight ?? 70}
                    />
                </div>
                <div className="flex justify-end w-full max-w-[794px] px-6 pb-6 print:hidden">
                    <Button 
                        onClick={() => window.print()} 
                        variant="outline" 
                        className="rounded-xl font-bold border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
                    >
                        <Printer className="mr-2 h-4 w-4 text-indigo-600" /> Print Official Transcript
                    </Button>
                </div>
            </div>
        );
    }
  
    return (
      <div className="p-10 text-center text-slate-400 italic border border-dashed rounded-3xl bg-slate-50 m-4">
          Select a released report card from the history to display details.
      </div>
    );
}
