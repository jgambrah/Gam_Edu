'use client';

import { useAuth, useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Assignment, StudentSubmission, Quiz, QuizAttempt, Student } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { AssignmentSubmissionDialog } from './assignment-submission-dialog';
import { setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { BookText, FileUp, Type, Loader2, ClipboardCheck, ArrowRight, Clock, HelpCircle, Layers, GraduationCap, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRole } from '@/context/role-context';
import { StudentDisplay } from '@/components/student-display';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { cn } from '@/lib/utils';
import { StudentSubjectRoadmap } from '@/components/curriculum/StudentSubjectRoadmap';

const toDateSafe = (dateVal: any): Date => {
  if (!dateVal) return new Date();
  if (typeof dateVal.toDate === 'function') return dateVal.toDate();
  return new Date(dateVal);
};

export default function StudentAssignmentsView() {
  const { user, isUserLoading } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();

  const [isSubmissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // 1. Get the student's data
  const studentQuery = useMemoFirebase(() => 
    (user && firestore && schoolId) ? query(collection(firestore, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId)) : null, 
    [user, firestore, schoolId]
  );
  const { data: studentData, isLoading: isStudentLoading } = useCollection<Student>(studentQuery);
  const student = studentData?.[0];
  const studentClassId = student?.classId;

  // 2. Fetch assignments for the student's class
  const assignmentsQuery = useMemoFirebase(() => 
    (studentClassId && firestore && schoolId) ? query(collection(firestore, 'assignments'), where('classId', '==', studentClassId), where('schoolId', '==', schoolId)) : null,
    [studentClassId, firestore, schoolId]
  );
  const { data: assignments, isLoading: areAssignmentsLoading } = useCollection<Assignment>(assignmentsQuery);

  // 3. Fetch quizzes for the student's class
  const quizzesQuery = useMemoFirebase(() => 
    (studentClassId && firestore && schoolId) ? query(collection(firestore, 'quizzes'), where('classId', '==', studentClassId), where('schoolId', '==', schoolId)) : null,
    [studentClassId, firestore, schoolId]
  );
  const { data: quizzes, isLoading: areQuizzesLoading } = useCollection<Quiz>(quizzesQuery);
  
  // 4. Fetch all submissions by this student
  const submissionsQuery = useMemoFirebase(() => 
    (user && firestore && schoolId) ? query(collection(firestore, 'submissions'), where('studentId', '==', user.uid), where('schoolId', '==', schoolId)) : null, 
    [user, firestore, schoolId]
  );
  const { data: submissions } = useCollection<StudentSubmission>(submissionsQuery);

  // 5. Fetch all quiz attempts by this student
  const quizAttemptsQuery = useMemoFirebase(() => 
    (user && firestore && schoolId) ? query(collection(firestore, 'quizAttempts'), where('studentId', '==', user.uid), where('schoolId', '==', schoolId)) : null, 
    [user, firestore, schoolId]
  );
  const { data: quizAttempts } = useCollection<QuizAttempt>(quizAttemptsQuery);

  // Combined loading state
  const isLoading = isUserLoading || isStudentLoading || areAssignmentsLoading || areQuizzesLoading;

  const handleFileUpload = async (assignment: Assignment) => {
    if (!user || !student || !firestore || !schoolId) return;
    
    const submission: Omit<StudentSubmission, 'id'> = {
      assignmentId: assignment.id,
      studentId: user.uid,
      studentName: `${student.firstName} ${student.lastName}`,
      submissionType: 'file',
      content: 'placeholder-file.pdf',
      submittedAt: new Date(),
      status: new Date() > toDateSafe(assignment.dueDate) ? 'Late' : 'Submitted',
      // @ts-ignore
      schoolId: schoolId,
    };
    try {
        const newDocRef = doc(collection(firestore, 'submissions'));
        await setDoc(newDocRef, submission);
        toast({ title: 'Success', description: 'Your file has been successfully submitted.' });
    } catch(error) {
        console.error("File submission error:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not submit file.' });
    }
  };

  const openTextSubmission = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionDialogOpen(true);
  };
  
  const combinedList = useMemo(() => {
    const allItems = [
        ...(assignments || []).map(item => ({ ...item, type: 'assignment' as const })),
        ...(quizzes || []).map(item => ({...item, type: 'quiz' as const }))
    ];
    return allItems.sort((a,b) => (b.createdAt?.toDate?.() ?? 0) - (a.createdAt?.toDate?.() ?? 0));
  }, [assignments, quizzes]);

  const submissionsMap = useMemo(() => {
    if (!submissions) return new Map();
    return new Map(submissions.map(s => [s.assignmentId, s]));
  }, [submissions]);

  const attemptsMap = useMemo(() => {
    if (!quizAttempts) return new Map();
    return new Map(quizAttempts.map(a => [a.quizId, a]));
  }, [quizAttempts]);

  // Dynamic Statistics
  const totalTasks = combinedList.length;
  const completedCount = (submissions?.length || 0) + (quizAttempts?.length || 0);
  const pendingCount = Math.max(0, totalTasks - completedCount);
  
  const quizAvg = useMemo(() => {
    if (!quizAttempts || quizAttempts.length === 0) return 0;
    const totalPercentage = quizAttempts.reduce((acc, attempt) => acc + (attempt.score / (attempt.total || 5)) * 100, 0);
    return Math.round(totalPercentage / quizAttempts.length);
  }, [quizAttempts]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6">
      
      {/* Premium Student Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-650 via-indigo-600 to-violet-750 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 text-indigo-200 shrink-0">
              <ClipboardCheck className="h-6 w-6 text-white" />
            </span>
            <Badge className="bg-white/15 text-white font-extrabold uppercase text-[10px] border-none px-2.5 py-0.5 rounded-full tracking-widest">
              Student Workspace
            </Badge>
          </div>
          <h1 className="text-3xl font-black tracking-tight uppercase italic">Assignments & Quizzes</h1>
          <p className="text-slate-200 text-sm font-medium mt-1 max-w-xl">
            Keep track of due dates, submit your coursework, and review evaluation feedback from your teachers.
          </p>
        </div>
      </div>

      {/* Student Metrics Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm rounded-2xl p-5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Tasks</span>
            <div className="p-2 bg-slate-50 text-slate-500 rounded-xl"><BookText className="h-4 w-4" /></div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-800 font-mono leading-none">{totalTasks}</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Assigned course tasks</p>
          </div>
        </Card>

        <Card className="border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm rounded-2xl p-5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle className="h-4 w-4" /></div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-800 font-mono leading-none">{completedCount}</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Submitted tasks</p>
          </div>
        </Card>

        <Card className={cn(
          "border transition-all duration-300 rounded-2xl p-5 hover:shadow-md backdrop-blur-sm shadow-sm",
          pendingCount > 0 
            ? "border-rose-100 bg-rose-50/20 text-rose-700" 
            : "border-slate-100 bg-white/70 text-slate-700"
        )}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-extrabold">Pending Tasks</span>
            <div className={cn(
              "p-2 rounded-xl",
              pendingCount > 0 ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-600"
            )}><Clock className="h-4 w-4" /></div>
          </div>
          <div className="mt-3">
            <h3 className={cn("text-2xl font-black font-mono leading-none", pendingCount > 0 ? "text-rose-600" : "text-slate-800")}>{pendingCount}</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Unfinished assessments</p>
          </div>
        </Card>

        <Card className="border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm rounded-2xl p-5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Performance</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><GraduationCap className="h-4 w-4" /></div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-800 font-mono leading-none">{quizAvg > 0 ? `${quizAvg}%` : '—'}</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Average quiz grade</p>
          </div>
        </Card>
      </div>

      {/* Curriculum Level-Up & Skill Roadmap */}
      <StudentSubjectRoadmap 
        assignments={assignments || []} 
        quizzes={quizzes || []} 
        submissions={submissions || []} 
        quizAttempts={quizAttempts || []} 
        studentName={student ? `${student.firstName} ${student.lastName}` : undefined} 
      />

      {/* Main Roster List */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : combinedList && combinedList.length > 0 ? (
          <div className="space-y-4">
            {combinedList.map((item) => {
              const isAssignment = item.type === 'assignment';
              const isLocked = (item as any).startDate ? new Date() < new Date((item as any).startDate) : false;
              let submission, quizAttempt;

              if (isAssignment) {
                  submission = submissionsMap.get(item.id);
              } else {
                  quizAttempt = attemptsMap.get(item.id);
              }

              return (
                <Card 
                  key={item.id} 
                  className={cn(
                    "overflow-hidden border border-slate-100 bg-white hover:shadow-md transition-all duration-300 rounded-2xl border-l-4", 
                    isAssignment ? "border-l-blue-500" : "border-l-purple-500"
                  )}
                >
                  <CardHeader className="pb-3 px-6 pt-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                           <Badge variant={isAssignment ? 'secondary' : 'default'} className={cn("uppercase text-[9px] tracking-widest px-2.5 py-0.5 rounded-lg font-extrabold", isAssignment ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-50")}>
                               {item.type}
                           </Badge>
                           {isLocked && (
                              <Badge className="bg-amber-50 border border-amber-250 text-amber-700 hover:bg-amber-100 uppercase text-[9px] font-bold rounded-lg px-2 py-0.5 flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> Scheduled
                              </Badge>
                           )}
                           {isAssignment && submission && (
                              <Badge variant="outline" className={cn("text-[9px] font-bold rounded-lg px-2 py-0.5", submission.status === 'Graded' ? 'border-emerald-250 text-emerald-700 bg-emerald-50' : 'border-blue-250 text-blue-700 bg-blue-50')}>
                                  {submission.status}
                              </Badge>
                           )}
                           {!isAssignment && quizAttempt && (
                              <Badge variant="outline" className="border-emerald-250 text-emerald-700 bg-emerald-50 text-[9px] font-bold rounded-lg px-2 py-0.5">
                                  Score: {quizAttempt.score}/{quizAttempt.total}
                              </Badge>
                           )}
                        </div>
                        <h3 className="text-lg text-slate-800 font-extrabold leading-snug uppercase tracking-tight">{item.title}</h3>
                        <CardDescription className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                           {isAssignment ? (
                               <>Due Date: <span className="font-bold text-slate-600">{item.dueDate ? format(toDateSafe(item.dueDate), 'PPP') : 'No due date'}</span></>
                           ) : (
                               <>Topic Name: <span className="font-bold text-slate-650">{(item as any).topic || 'General Knowledge'}</span></>
                           )}
                         </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pb-5 px-6">
                     {isAssignment ? (
                        <>
                          <p className="text-xs text-slate-500 line-clamp-3 bg-slate-50 border border-slate-100 rounded-xl p-3.5 italic">
                              "{item.description}"
                          </p>

                          {(item as any).questionsFile && (
                            <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                                  <FileUp className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">{(item as any).questionsFile.fileName}</p>
                                  <p className="text-[10px] text-slate-400 font-bold font-mono">{(item as any).questionsFile.fileSize}</p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const file = (item as any).questionsFile;
                                  if (file.fileData === 'simulated-storage-url-placeholder') {
                                    toast({
                                      title: 'Downloading File (Simulated)',
                                      description: `Downloading ${file.fileName} from simulated cloud storage.`,
                                    });
                                    toast({
                                      title: 'Download Successful',
                                      description: `${file.fileName} has been downloaded.`,
                                    });
                                  } else {
                                    const link = document.createElement('a');
                                    link.href = file.fileData;
                                    link.setAttribute('download', file.fileName);
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }
                                }}
                                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-xs h-9 px-3 rounded-xl transition shadow-sm"
                              >
                                Download Questions
                              </Button>
                            </div>
                          )}
                          
                          {submission ? (
                              <div className="pt-1">
                                  {submission.status === 'Graded' && (
                                      <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner">
                                          <div className="space-y-1 flex-1">
                                              <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Grading Feedback</h4>
                                              <p className="text-xs text-slate-600 italic">
                                                  "{submission.teacherFeedback || 'No feedback left.'}"
                                              </p>
                                          </div>
                                          <div className="text-right shrink-0">
                                              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Evaluation Score</span>
                                              <span className="text-2xl font-black text-emerald-700 font-mono">{submission.grade}</span>
                                          </div>
                                      </div>
                                  )}
                                  {submission.status !== 'Graded' && (
                                      <div className="p-3.5 bg-blue-50/30 border border-blue-100 rounded-2xl flex items-center justify-between text-xs text-slate-500">
                                          <span>Response submitted successfully.</span>
                                          <Badge className="bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-[9px] font-bold rounded-lg px-2">Waiting for Grade</Badge>
                                      </div>
                                  )}
                              </div>
                          ) : (
                              <div className="flex flex-wrap gap-2.5 pt-1">
                                  {isLocked ? (
                                      <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-center gap-2 text-xs text-amber-700 font-semibold leading-relaxed shadow-sm w-full">
                                          <Clock className="h-4 w-4 shrink-0 text-amber-600 animate-pulse" />
                                          <span>Available starting: {format(new Date((item as any).startDate!), 'PPp')}</span>
                                      </div>
                                  ) : (
                                      <>
                                          <Button 
                                            size="sm" 
                                            onClick={() => handleFileUpload(item as Assignment)} 
                                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold h-10 px-4 text-xs transition shadow-md shadow-blue-500/10 active:scale-98"
                                          >
                                              <FileUp className="mr-2 h-4 w-4" /> Upload Work File
                                          </Button>
                                          <Button 
                                            size="sm" 
                                            variant="outline" 
                                            onClick={() => openTextSubmission(item as Assignment)}
                                            className="border-slate-200 text-slate-650 hover:bg-slate-50 rounded-xl font-bold h-10 px-4 text-xs transition"
                                          >
                                              <Type className="mr-2 h-4 w-4" /> Write Response
                                          </Button>
                                      </>
                                  )}
                              </div>
                          )}
                        </>
                     ) : (
                         <div className="pt-1">
                          {quizAttempt ? (
                              <div className="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between gap-3 shadow-inner text-xs">
                                  <div>
                                      <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5">Quiz Finished</p>
                                      <p className="text-xs text-slate-500">Self check completed successfully.</p>
                                  </div>
                                  <span className="text-2xl font-black text-indigo-600 font-mono">
                                    {quizAttempt.score} <span className="text-xs font-normal text-indigo-400">/ {quizAttempt.total}</span>
                                  </span>
                              </div>
                          ) : (
                              isLocked ? (
                                  <Button 
                                    disabled 
                                    className="w-full bg-slate-100 border border-slate-200 text-slate-400 h-11 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                                  >
                                      <Clock className="h-4 w-4 text-slate-350" /> Locked until {format(new Date((item as any).startDate!), 'PPp')}
                                  </Button>
                              ) : (
                                  <Button 
                                    asChild 
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 text-xs font-bold rounded-xl shadow-md transition active:scale-[0.98]"
                                  >
                                      <Link href={`/dashboard/assignments/quiz/${item.id}`}>
                                          Start Assessment Quiz <ArrowRight className="ml-2 h-4 w-4" />
                                      </Link>
                                  </Button>
                              )
                          )}
                         </div>
                     )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed rounded-3xl bg-slate-50/50">
            <HelpCircle className="mx-auto h-12 w-12 text-slate-350 mb-3 stroke-[1.2]" />
            <p className="text-xs font-bold uppercase text-slate-400">No tasks currently assigned</p>
          </div>
        )}
      </div>
      
      {selectedAssignment && student && (
        <AssignmentSubmissionDialog
          isOpen={isSubmissionDialogOpen}
          setOpen={setSubmissionDialogOpen}
          assignment={selectedAssignment}
          student={student}
        />
      )}
    </div>
  );
}
