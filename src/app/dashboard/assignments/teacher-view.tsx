'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Assignment, Quiz } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, BookOpen, Layers, GraduationCap, CheckCircle, HelpCircle, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AssignmentCreationForm } from './assignment-creation-form';
import { AssignmentSubmissionsList } from './assignment-submissions-list';
import { QuizCreationForm } from './quiz-creation-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuizListProps {
  quizzes?: Quiz[] | null;
  isLoading: boolean;
}

function QuizList({ quizzes, isLoading }: QuizListProps) {
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();

  const { data: classes } = useCollection<{id: string, name: string}>(
    useMemoFirebase(
      () => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null,
      [firestore, schoolId]
    )
  );

  const getClassName = (classId: string) => {
    return classes?.find(c => c.id === classId)?.name || classId;
  };

  const sortedQuizzes = useMemo(() => {
    if (!quizzes) return [];
    return [...quizzes].sort((a, b) => (b.createdAt?.toDate?.()?.getTime() || 0) - (a.createdAt?.toDate?.()?.getTime() || 0));
  }, [quizzes]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedQuizzes && sortedQuizzes.length > 0 ? (
        sortedQuizzes.map((quiz) => (
          <Card key={quiz.id} className="border border-slate-100 bg-white hover:shadow-md transition-all duration-300 rounded-2xl p-5 group">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wide bg-purple-50 border-purple-100 text-purple-700 rounded-lg px-2">
                    Topic: {quiz.topic}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wide bg-slate-50 border-slate-200 text-slate-600 rounded-lg px-2">
                    {getClassName(quiz.classId)}
                  </Badge>
                </div>
                <h3 className="font-extrabold text-slate-800 text-base leading-snug uppercase tracking-tight group-hover:text-purple-700 transition-colors">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Created on {quiz.createdAt?.toDate ? format(quiz.createdAt.toDate(), 'PPP') : 'Unknown'}
                </p>
              </div>
              <div className="h-10 w-10 bg-purple-50 text-purple-600 border border-purple-100/50 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                {quiz.questions.length}Q
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center py-12 bg-slate-50/50 border border-dashed rounded-2xl">
          <HelpCircle className="h-12 w-12 text-slate-300 mx-auto mb-3 stroke-[1.2]" />
          <p className="text-xs font-bold uppercase text-slate-400">No quizzes registered yet</p>
        </div>
      )}
    </div>
  );
}

export default function TeacherAssignmentsView() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { schoolId } = useCurrentSchool();
  const [isAssignmentFormOpen, setAssignmentFormOpen] = useState(false);
  const [isQuizFormOpen, setQuizFormOpen] = useState(false);

  const assignmentsQuery = useMemoFirebase(
    () => (user && schoolId && firestore) ? query(collection(firestore, 'assignments'), where('teacherId', '==', user.uid), where('schoolId', '==', schoolId)) : null,
    [user, firestore, schoolId]
  );
  const { data: assignments, isLoading: isLoadingAssignments } = useCollection<Assignment>(assignmentsQuery);

  const quizzesQuery = useMemoFirebase(
    () => (user && schoolId && firestore) ? query(collection(firestore, 'quizzes'), where('teacherId', '==', user.uid), where('schoolId', '==', schoolId)) : null,
    [firestore, user, schoolId]
  );
  const { data: quizzes, isLoading: isLoadingQuizzes } = useCollection<Quiz>(quizzesQuery);

  const sortedAssignments = useMemo(() => {
    if (!assignments) return [];
    return [...assignments].sort((a, b) => (b.createdAt?.toDate()?.getTime() || 0) - (a.createdAt?.toDate()?.getTime() || 0));
  }, [assignments]);

  const activeAssignmentsCount = assignments?.length || 0;
  const activeQuizzesCount = quizzes?.length || 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6">
      
      {/* Premium Gradient Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-750 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 text-indigo-200 shrink-0">
                <GraduationCap className="h-6 w-6 text-white" />
              </span>
              <Badge className="bg-white/15 text-white font-extrabold uppercase text-[10px] border-none px-2.5 py-0.5 rounded-full tracking-widest">
                Academic Tasks Manager
              </Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase italic">Assignments & Quizzes Console</h1>
            <p className="text-slate-200 text-sm font-medium mt-1 max-w-xl">
              Create and dispatch assignments, design AI-powered student quizzes, and review grades from a centralized command center.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 shrink-0 w-full md:w-auto">
            <Button 
              onClick={() => {
                setAssignmentFormOpen(!isAssignmentFormOpen);
                setQuizFormOpen(false);
              }}
              className={cn(
                "h-12 px-5 rounded-2xl font-bold transition-all shadow-lg text-xs w-full md:w-auto",
                isAssignmentFormOpen 
                  ? "bg-white text-indigo-950 hover:bg-slate-50" 
                  : "bg-white/10 text-white border border-white/10 hover:bg-white/20"
              )}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {isAssignmentFormOpen ? 'Close Editor' : 'Create Assignment'}
            </Button>
            <Button 
              onClick={() => {
                setQuizFormOpen(!isQuizFormOpen);
                setAssignmentFormOpen(false);
              }}
              className={cn(
                "h-12 px-5 rounded-2xl font-bold transition-all shadow-lg text-xs w-full md:w-auto",
                isQuizFormOpen 
                  ? "bg-white text-violet-950 hover:bg-slate-50" 
                  : "bg-white/10 text-white border border-white/10 hover:bg-white/20"
              )}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isQuizFormOpen ? 'Close Editor' : 'Create AI Quiz'}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm rounded-2xl p-5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Tasks</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Layers className="h-4 w-4" /></div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-800 font-mono leading-none">{activeAssignmentsCount}</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Assigned assignments</p>
          </div>
        </Card>

        <Card className="border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm rounded-2xl p-5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Quizzes</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Sparkles className="h-4 w-4" /></div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-800 font-mono leading-none">{activeQuizzesCount}</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Active AI-generated checks</p>
          </div>
        </Card>

        <Card className="border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm rounded-2xl p-5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Completion</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle className="h-4 w-4" /></div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-800 font-mono leading-none">92%</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Class submission rate</p>
          </div>
        </Card>

        <Card className="border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm rounded-2xl p-5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Evaluation Accuracy</span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><GraduationCap className="h-4 w-4" /></div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-800 font-mono leading-none">84%</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Quiz performance average</p>
          </div>
        </Card>
      </div>

      {/* Editor Toggles */}
      {isAssignmentFormOpen && (
        <Card className="border border-indigo-150 bg-indigo-50/5/30 backdrop-blur-sm rounded-[2rem] overflow-hidden shadow-md animate-in fade-in slide-in-from-top-4">
          <CardHeader className="bg-slate-50 border-b py-5 px-6">
            <CardTitle className="text-base font-extrabold text-indigo-950 flex items-center gap-2">
              <PlusCircle className="h-4 w-4 text-indigo-650" />
              Register New Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <AssignmentCreationForm setOpen={setAssignmentFormOpen} />
          </CardContent>
        </Card>
      )}

      {isQuizFormOpen && (
        <Card className="border border-purple-150 bg-purple-50/5/30 backdrop-blur-sm rounded-[2rem] overflow-hidden shadow-md animate-in fade-in slide-in-from-top-4">
          <CardHeader className="bg-slate-50 border-b py-5 px-6">
            <CardTitle className="text-base font-extrabold text-purple-950 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-650" />
              AI Quiz blueprint generator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <QuizCreationForm setOpen={setQuizFormOpen} />
          </CardContent>
        </Card>
      )}

      {/* Main Content Area */}
      <Tabs defaultValue="assignments" className="space-y-6">
        <TabsList className="bg-slate-100/80 p-1 rounded-2xl inline-flex border border-slate-200/50 shadow-inner h-12">
          <TabsTrigger value="assignments" className="rounded-xl font-bold px-6 text-xs data-[state=active]:bg-white data-[state=active]:text-indigo-950 data-[state=active]:shadow-sm transition-all h-10">
            Assignments Feed
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="rounded-xl font-bold px-6 text-xs data-[state=active]:bg-white data-[state=active]:text-purple-950 data-[state=active]:shadow-sm transition-all h-10">
            Quizzes Feed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <Card className="border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm rounded-2xl overflow-hidden p-6">
            <div className="mb-4">
              <h2 className="text-lg font-black text-slate-800 uppercase flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Active Class Assignments
              </h2>
              <p className="text-slate-400 text-xs font-medium">Verify submissions and assign grades to student responses.</p>
            </div>
            
            {isLoadingAssignments ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
            ) : sortedAssignments && sortedAssignments.length > 0 ? (
              <div className="space-y-4">
                {sortedAssignments.map((assignment) => (
                  <AssignmentSubmissionsList key={assignment.id} assignment={assignment} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50/50 border border-dashed rounded-2xl">
                <HelpCircle className="h-12 w-12 text-slate-350 mx-auto mb-3 stroke-[1.2]" />
                <p className="text-xs font-bold uppercase text-slate-400">No assignments created yet</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="quizzes">
          <Card className="border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm rounded-2xl overflow-hidden p-6">
            <div className="mb-4">
              <h2 className="text-lg font-black text-slate-800 uppercase flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
                Active Knowledge Checks
              </h2>
              <p className="text-slate-400 text-xs font-medium">Assess students using automated AI-generated quizzes.</p>
            </div>
            
            <QuizList quizzes={quizzes} isLoading={isLoadingQuizzes} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
