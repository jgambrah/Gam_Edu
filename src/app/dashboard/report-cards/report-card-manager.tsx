'use client';

import { Suspense, useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportCardCommentSchema, ReportCard, ReportCardComment, ReportCardStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { MOCK_SUBJECTS, MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { Loader2, Send, CheckCircle, ShieldCheck, Printer } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { StudentReportCard } from './student-report-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Student = { uid: string; firstName: string; lastName: string; classId: string; id: string; };

function CommentForm({ student, reportCard, disabled }: { student: Student; reportCard: ReportCard | undefined; disabled: boolean; }) {
  const { user } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  const commentsQuery = useMemoFirebase(
    () => reportCard ? query(collection(firestore, `report-cards/${reportCard.id}/comments`)) : null,
    [firestore, reportCard]
  );
  const { data: comments } = useCollection<ReportCardComment>(commentsQuery);
  
  const form = useForm({
    resolver: zodResolver(reportCardCommentSchema),
    defaultValues: { subjectId: '', comment: '' },
  });

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    const existingComment = comments?.find(c => c.subjectId === subjectId);
    form.setValue('comment', existingComment?.comment || '');
    form.setValue('subjectId', subjectId);
  };

  async function onSubmit(values: { subjectId: string, comment: string }) {
    if (!user || !reportCard) return;
    setIsSubmitting(true);
    try {
        const commentRef = doc(firestore, `report-cards/${reportCard.id}/comments`, `${values.subjectId}_${user.uid}`);
        await setDoc(commentRef, {
            ...values,
            studentId: student.uid,
            teacherId: user.uid,
            term: reportCard.term,
            academicYear: reportCard.academicYear,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp(),
        }, { merge: true });

        toast({ title: "Success", description: "Comment saved." });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save comment.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className='flex gap-4 items-end'>
            <div className='flex-grow'>
                <label className='text-sm font-medium'>Subject</label>
                <Select onValueChange={handleSubjectChange} disabled={disabled}>
                    <SelectTrigger><SelectValue placeholder="Select a subject"/></SelectTrigger>
                    <SelectContent>{MOCK_SUBJECTS.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
            </div>
            <Button type="submit" disabled={isSubmitting || disabled || !selectedSubjectId}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Comment
            </Button>
        </div>
      <Controller name="comment" control={form.control} render={({ field }) => (
        <Textarea {...field} placeholder="Enter teacher's comment for the selected subject..." rows={4} disabled={disabled || !selectedSubjectId} />
      )}/>
    </form>
  );
}

export default function ReportCardManager() {
  const { user } = useAuth();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(MOCK_TERMS[0]);
  const [selectedYear, setSelectedYear] = useState(MOCK_ACADEMIC_YEARS[0]);
  const [processingStudentId, setProcessingStudentId] = useState<string | null>(null);

  const teacherClassesQuery = useMemoFirebase(
    () => user && (role === 'Administrator' || role === 'Director') ? collection(firestore, 'classes') : query(collection(firestore, 'classes'), where('teacherId', '==', user?.uid || '')),
    [firestore, user, role]
  );
  const { data: teacherClasses } = useCollection(teacherClassesQuery);

  const studentsQuery = useMemoFirebase(
    () => selectedClassId ? query(collection(firestore, 'students'), where('classId', '==', selectedClassId)) : null,
    [firestore, selectedClassId]
  );
  const { data: students } = useCollection<Student>(studentsQuery);
  
  const reportCardsQuery = useMemoFirebase(() => {
    if (!selectedClassId || !selectedYear || !selectedTerm) return null;
    return query(
        collection(firestore, 'report-cards'),
        where('classId', '==', selectedClassId),
        where('academicYear', '==', selectedYear),
        where('term', '==', selectedTerm)
    );
  }, [firestore, selectedClassId, selectedYear, selectedTerm]);
  const { data: reportCards } = useCollection<ReportCard>(reportCardsQuery);

  const getStudentReportCard = (studentId: string) => reportCards?.find(rc => rc.studentId === studentId);

  const handleStatusUpdate = async (student: Student, newStatus: ReportCardStatus) => {
    setProcessingStudentId(student.uid);
    const reportCardId = `${student.uid}-${selectedYear}-${selectedTerm}`;
    const reportCardRef = doc(firestore, 'report-cards', reportCardId);

    try {
        const dataToSet: Partial<ReportCard> = { status: newStatus };
        if (newStatus === 'Published') {
            dataToSet.publishedAt = serverTimestamp();
            // Simulate notifications
            console.log(`Notification Sent to Parents of ${student.firstName} ${student.lastName}`);
            toast({ title: 'Parent Notified', description: 'An in-app and email notification has been sent.' });
        }
        
        await setDoc(reportCardRef, dataToSet, { merge: true });

        // Ensure a report card document exists
        const reportCardData: ReportCard = getStudentReportCard(student.uid) || {
            id: reportCardId,
            studentId: student.uid,
            classId: selectedClassId,
            academicYear: selectedYear,
            term: selectedTerm,
            status: newStatus
        };
        await setDoc(reportCardRef, { ...reportCardData, status: newStatus}, { merge: true });

        toast({ title: 'Success', description: `Report card for ${student.firstName} is now ${newStatus}.` });
    } catch(error) {
        console.error("Error updating status:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update status.' });
    } finally {
        setProcessingStudentId(null);
    }
  }

  const getStatusBadgeVariant = (status: ReportCardStatus) => {
    switch(status) {
        case 'Draft': return 'secondary';
        case 'AwaitingFinalApproval': return 'default';
        case 'Published': return 'destructive';
        default: return 'outline';
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Card Management</CardTitle>
          <CardDescription>Select a class and term to manage student report card comments and approvals.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select onValueChange={setSelectedYear} defaultValue={selectedYear}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{MOCK_ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
          </Select>
          <Select onValueChange={setSelectedTerm} defaultValue={selectedTerm}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{MOCK_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
          <Select onValueChange={setSelectedClassId}>
            <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
            <SelectContent>{teacherClasses?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      {selectedClassId && (
        <Card>
            <CardHeader>
                <CardTitle>Students in Class</CardTitle>
            </CardHeader>
            <CardContent>
                {students && students.length > 0 ? (
                <Accordion type="single" collapsible>
                    {students.map(student => {
                        const reportCard = getStudentReportCard(student.uid);
                        const status = reportCard?.status || 'Draft';
                        const isProcessing = processingStudentId === student.uid;
                        const isLocked = status === 'AwaitingFinalApproval' || status === 'Published';
                        
                        return (
                            <AccordionItem value={student.uid} key={student.uid}>
                                <AccordionTrigger>
                                    <div className='flex justify-between items-center w-full pr-4'>
                                        <span>{student.firstName} {student.lastName}</span>
                                        <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 p-4 bg-muted/50 rounded-md">
                                    <CommentForm student={student} reportCard={reportCard} disabled={isLocked && role === 'Teacher'} />
                                    <div className="flex justify-end gap-2 pt-4 border-t">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline"><Printer className="mr-2 h-4 w-4" /> View/Print</Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl">
                                                <DialogHeader><DialogTitle>Student Report Card</DialogTitle></DialogHeader>
                                                <Suspense fallback={<Loader2 />}>
                                                  <StudentReportCard student={student} term={selectedTerm} year={selectedYear} />
                                                </Suspense>
                                            </DialogContent>
                                        </Dialog>

                                        {role === 'Teacher' && status === 'Draft' && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button disabled={isProcessing}>
                                                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                                        Submit for Final Approval
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will lock the report and send it for final approval.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleStatusUpdate(student, 'AwaitingFinalApproval')}>Confirm</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                        {(role === 'Administrator' || role === 'Director') && status === 'AwaitingFinalApproval' && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button disabled={isProcessing} variant="destructive">
                                                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                                                        Publish Report Card
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Publish Report Card?</AlertDialogTitle><AlertDialogDescription>This will publish the report card and notify parents. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleStatusUpdate(student, 'Published')}>Confirm and Publish</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
                ) : (
                    <p className="text-muted-foreground text-center">No students in this class.</p>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}