
'use client';

import { AppLogo } from '@/components/icons/app-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { Assessment, ReportCardComment, ReportCard, Subject } from '@/lib/types';
import { collection, query, where, doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Printer, Lock } from 'lucide-react';
import SignatureStamp from '@/components/shared/SignatureStamp';

type Student = { uid: string; firstName: string; lastName: string; classId: string; id: string; };

export function StudentReportCard({ student, term, year, savedReport }: { student: Student, term: string, year: string, savedReport?: any }) {
    const firestore = useFirestore();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

    const schoolProfileRef = useMemoFirebase(
      () => (firestore && schoolId ? doc(firestore, 'schools', schoolId) : null),
      [firestore, schoolId]
    );
    const { data: schoolProfile, isLoading: isLoadingProfile } = useDoc(schoolProfileRef);
    
    const isLoading = isLoadingSchool || isLoadingProfile;

    if (isLoading) {
        return (
            <div className="space-y-4 p-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        );
    }

    // Use the saved report snapshot if provided
    if (savedReport) {
        return (
            <Card className="w-full border-none shadow-none print:shadow-none print:border-none bg-white">
                <CardHeader className="text-center">
                    <div className='flex items-center justify-center gap-4'>
                        {savedReport.logoBase64 ? (
                            <img src={savedReport.logoBase64} alt="Logo" className="h-16 w-16 object-contain" />
                        ) : (
                            <AppLogo className="h-12 w-12 text-primary" />
                        )}
                        <div>
                            <CardTitle className="text-2xl uppercase font-black">{savedReport.schoolName}</CardTitle>
                            <p className="text-xs italic text-muted-foreground">{savedReport.schoolMotto}</p>
                        </div>
                    </div>
                    <Separator className="my-4"/>
                    <div className="flex justify-between items-end text-sm text-left">
                        <div className="space-y-1">
                            <p><span className="font-bold">Student:</span> {student.firstName} {student.lastName}</p>
                            <p><span className="font-bold">Class:</span> {savedReport.className}</p>
                            <p><span className="font-bold">Term:</span> {savedReport.term} ({savedReport.academicYear})</p>
                        </div>
                        <div className="text-right space-y-1">
                            <p><span className="font-bold">Position:</span> {savedReport.classPosition} of {savedReport.totalStudents}</p>
                            <p><span className="font-bold">Average:</span> {savedReport.overallAverage}%</p>
                            <p><span className="font-bold">Attendance:</span> {savedReport.studentPresentDays} / {savedReport.totalClassDays}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table className="text-[11px]">
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead className="font-bold">Subject</TableHead>
                                <TableHead className="text-center">CA</TableHead>
                                <TableHead className="text-center">Exam</TableHead>
                                <TableHead className="text-center">Total</TableHead>
                                <TableHead className="text-center">Grade</TableHead>
                                <TableHead>Remark</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {savedReport.rows?.map((row: any, i: number) => (
                                <TableRow key={i}>
                                    <TableCell className="font-semibold">{row.subjectName}</TableCell>
                                    <TableCell className="text-center">{row.ca}</TableCell>
                                    <TableCell className="text-center">{row.exam}</TableCell>
                                    <TableCell className="text-center font-bold">{row.total}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={row.grade === 'F' ? 'destructive' : 'outline'} className="text-[10px]">{row.grade}</Badge>
                                    </TableCell>
                                    <TableCell className="italic text-muted-foreground">{row.autoRemark}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="p-4 border rounded-lg bg-slate-50">
                            <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-2">Class Teacher's Remark</h4>
                            <p className="text-xs italic text-slate-700">{savedReport.classTeacherComment || "No comment."}</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-slate-50">
                            <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-2">Headmaster's Remark</h4>
                            <p className="text-xs italic text-slate-700">{savedReport.headmasterComment || "No comment."}</p>
                        </div>
                    </div>

                    {/* SIGNATURE SECTION */}
                    <div className="grid grid-cols-2 gap-12 mt-10 pt-6 border-t border-dashed">
                        <SignatureStamp 
                            url={savedReport.classTeacherSignatureUrl} 
                            name={savedReport.classTeacherName || 'Class Teacher'} 
                            role="Class Teacher"
                            date={savedReport.updatedAt}
                        />
                        <SignatureStamp 
                            url={savedReport.headmasterSignatureUrl} 
                            name={savedReport.headmasterName || 'Headmaster'} 
                            role="Headmaster"
                            date={savedReport.headmasterSignedAt}
                        />
                    </div>

                    {/* AUDIT FOOTER */}
                    <div className="mt-8 p-3 bg-slate-50 rounded-xl flex justify-between items-center opacity-60">
                        <div className="flex items-center gap-2">
                            <Lock size={10} className="text-slate-400" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                                Secured Digital Transcript: {savedReport.digitalFingerprint || 'VERIFIED'}
                            </span>
                        </div>
                        <p className="text-[8px] font-bold italic text-slate-400 uppercase">Verified by GAM Edu Cloud</p>
                    </div>
                </CardContent>
                <CardFooter className="print:hidden justify-end pt-4">
                    <Button onClick={() => window.print()} variant="outline" className="rounded-xl font-bold">
                        <Printer className="mr-2 h-4 w-4" /> Print PDF
                    </Button>
                </CardFooter>
            </Card>
        );
    }
  
    return (
      <div className="p-10 text-center text-muted-foreground italic border rounded-xl bg-slate-50">
          Select a published report card from the list to view details.
      </div>
    );
  }
