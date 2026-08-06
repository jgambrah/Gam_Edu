'use client';

import { useState, useMemo } from 'react';
import { 
  calculateAllSubjectsProgress, 
  buildSubjectRoadmapNodes, 
  SubjectProgressSummary, 
  RoadmapNode 
} from '@/lib/curriculum-progress-utils';
import { Assignment, Quiz, StudentSubmission, QuizAttempt } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, Lock, Sparkles, Trophy, Flag, Play, 
  BookOpen, HelpCircle, ArrowRight, Star, Flame, Zap
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where } from 'firebase/firestore';

interface StudentSubjectRoadmapProps {
  assignments?: Assignment[];
  quizzes?: Quiz[];
  submissions?: StudentSubmission[];
  quizAttempts?: QuizAttempt[];
  subjects?: any[];
  studentName?: string;
  compact?: boolean;
}

export function StudentSubjectRoadmap({
  assignments = [],
  quizzes = [],
  submissions = [],
  quizAttempts = [],
  subjects: propSubjects,
  studentName,
  compact = false
}: StudentSubjectRoadmapProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();

  const subjectsQuery = useMemoFirebase(
    () => (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null,
    [firestore, schoolId]
  );
  const { data: fetchedSubjects } = useCollection<any>(subjectsQuery);

  const effectiveSubjects = propSubjects || fetchedSubjects || [];

  const subjectProgressList: SubjectProgressSummary[] = useMemo(() => {
    return calculateAllSubjectsProgress(assignments, quizzes, submissions, quizAttempts, effectiveSubjects);
  }, [assignments, quizzes, submissions, quizAttempts, effectiveSubjects]);

  const roadmapNodes: RoadmapNode[] = useMemo(() => {
    return buildSubjectRoadmapNodes(assignments, quizzes, submissions, quizAttempts, selectedSubject);
  }, [assignments, quizzes, submissions, quizAttempts, selectedSubject]);

  const overallPercent = useMemo(() => {
    if (subjectProgressList.length === 0) return 0;
    const sum = subjectProgressList.reduce((acc, curr) => acc + curr.percent, 0);
    return Math.round(sum / subjectProgressList.length);
  }, [subjectProgressList]);

  if (compact) {
    return (
      <Card className="border border-indigo-100 shadow-md bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-2xl overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400 animate-bounce" />
              <CardTitle className="text-sm font-extrabold tracking-wide">
                {studentName ? `${studentName}'s Term Goal Progress` : 'Term Curriculum Level'}
              </CardTitle>
            </div>
            <Badge className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full">
              {overallPercent}% Term Mastery
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-indigo-200">
              <span>Term Completion Goal</span>
              <span className="font-mono">{overallPercent} / 100%</span>
            </div>
            <Progress value={overallPercent} className="h-2.5 bg-indigo-950/80" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {subjectProgressList.slice(0, 4).map(sub => (
              <div key={sub.subjectId} className="bg-white/10 p-2 rounded-xl border border-white/10 text-xs">
                <div className="flex justify-between font-extrabold text-slate-100 mb-1">
                  <span className="truncate max-w-[90px]">{sub.subjectName}</span>
                  <span className="text-amber-300 font-mono">{sub.percent}%</span>
                </div>
                <Progress value={sub.percent} className="h-1.5 bg-slate-800" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200 shadow-md rounded-2xl bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-amber-400" />
              <CardTitle className="text-xl font-black tracking-tight">
                {studentName ? `${studentName}'s Curriculum Roadmap` : 'Curriculum Level-Up & Skill Roadmap'}
              </CardTitle>
            </div>
            <CardDescription className="text-indigo-200 text-xs mt-1">
              Visual quest path tracking term milestones, quizzes, and subject completion levels.
            </CardDescription>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-right">
            <span className="text-[10px] font-black uppercase text-indigo-300 block tracking-widest">Overall Term Mastery</span>
            <span className="text-2xl font-black text-amber-400 font-mono">{overallPercent}%</span>
          </div>
        </div>

        {/* Subject Filter Tabs */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <Tabs value={selectedSubject} onValueChange={setSelectedSubject} className="w-full">
            <TabsList className="bg-white/10 p-1 rounded-xl flex flex-wrap gap-1 border border-white/10">
              <TabsTrigger value="All" className="rounded-lg text-xs font-bold text-white data-[state=active]:bg-amber-400 data-[state=active]:text-slate-950">
                🌟 All Subjects
              </TabsTrigger>
              {subjectProgressList.map(sub => (
                <TabsTrigger 
                  key={sub.subjectId} 
                  value={sub.subjectId}
                  className="rounded-lg text-xs font-bold text-white data-[state=active]:bg-amber-400 data-[state=active]:text-slate-950"
                >
                  {sub.subjectName} ({sub.percent}%)
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-8">
        {/* Subject Level-Up Overview Cards */}
        <div>
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" /> Subject Level-Up Progress
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {subjectProgressList.map(sub => (
              <div 
                key={sub.subjectId} 
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-extrabold text-slate-900 text-sm truncate max-w-[140px]">
                      {sub.subjectName}
                    </span>
                    <Badge className="bg-indigo-900 text-amber-300 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                      Lvl {sub.level}: {sub.levelTitle}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Completed {sub.completedCount} of {sub.totalCount} curriculum units
                  </p>
                </div>

                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-600">Completion</span>
                    <span className="text-indigo-900 font-mono">{sub.percent}%</span>
                  </div>
                  <Progress value={sub.percent} className="h-2.5 bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Quest Roadmap Line */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Flag className="h-4 w-4 text-indigo-600" /> Interactive Term Quest Roadmap
              </h4>
              <p className="text-xs text-slate-500">Step-by-step topic milestones to complete your term goals.</p>
            </div>
            <Badge variant="outline" className="text-slate-600 border-slate-300 text-xs font-bold">
              {roadmapNodes.filter(n => n.status === 'completed').length} / {roadmapNodes.length} Milestones Cleared
            </Badge>
          </div>

          {roadmapNodes.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
              <BookOpen className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600">No active curriculum roadmap nodes found.</p>
              <p className="text-xs text-slate-400">Assignments and quizzes assigned by teachers will appear here automatically.</p>
            </div>
          ) : (
            <div className="relative pl-6 md:pl-8 border-l-4 border-indigo-100 space-y-6 my-4">
              {roadmapNodes.map((node, index) => {
                const isCompleted = node.status === 'completed';
                const isInProgress = node.status === 'in_progress';
                const isLocked = node.status === 'locked';

                return (
                  <div key={node.id} className="relative group">
                    {/* Node Dot / Status Icon */}
                    <div className={`absolute -left-[31px] md:-left-[39px] top-1.5 h-8 w-8 rounded-full flex items-center justify-center text-sm font-black shadow-sm transition-all ${
                      isCompleted 
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' 
                        : isInProgress 
                        ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-100 animate-pulse' 
                        : 'bg-slate-200 text-slate-400 ring-4 ring-slate-100'
                    }`}>
                      {isCompleted && <CheckCircle2 className="h-5 w-5" />}
                      {isInProgress && <Play className="h-4 w-4 fill-slate-950" />}
                      {isLocked && <Lock className="h-4 w-4" />}
                    </div>

                    {/* Node Card */}
                    <div className={`p-4 rounded-2xl border transition-all ${
                      isCompleted 
                        ? 'bg-emerald-50/40 border-emerald-200/80 shadow-xs' 
                        : isInProgress 
                        ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-400/20 shadow-md' 
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={`text-[10px] font-extrabold uppercase ${
                              node.type === 'quiz' ? 'border-purple-300 text-purple-700 bg-purple-50' : 'border-blue-300 text-blue-700 bg-blue-50'
                            }`}>
                              {node.type === 'quiz' ? '🎯 Quiz Challenge' : '📝 Assignment Task'}
                            </Badge>
                            {node.subjectName && (
                              <span className="text-xs font-bold text-slate-500">
                                • {node.subjectName}
                              </span>
                            )}
                          </div>
                          <h5 className="font-extrabold text-slate-900 text-base">{node.title}</h5>
                          {node.dueDate && (
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Due Date: {node.dueDate}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 self-end md:self-auto">
                          <span className="font-mono text-xs font-black text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                            +{node.xpReward} XP
                          </span>

                          {isCompleted && (
                            <Badge className="bg-emerald-600 text-white font-extrabold text-xs px-3 py-1 rounded-lg">
                              {typeof node.scorePercent === 'number' ? `Score: ${node.scorePercent}%` : 'Cleared'}
                            </Badge>
                          )}

                          {isInProgress && node.url && (
                            <Button asChild className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs h-9 px-4 rounded-xl shadow-sm border-0">
                              <Link href={node.url} className="flex items-center gap-1.5">
                                Start Milestone <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          )}

                          {isLocked && (
                            <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                              <Lock className="h-3.5 w-3.5" /> Locked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
