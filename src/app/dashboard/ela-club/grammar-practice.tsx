
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRole } from '@/context/role-context';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp, doc, setDoc, increment } from 'firebase/firestore';
import { ElaGrammarDrill, Student } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useCurrentSchool } from '@/hooks/use-current-school';

// --- SUB-COMPONENT: The Actual Drill Modal ---
function ActiveDrillDialog({ drill, open, setOpen }: { drill: ElaGrammarDrill | null, open: boolean, setOpen: (o: boolean) => void }) {
    const [selectedOption, setSelectedOption] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const { user } = useUser();
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();

    if (!drill) return null;

    const handleSubmit = async () => {
        if (!selectedOption || !schoolId) return;
        
        const correct = selectedOption === drill.correct_answer;
        setIsCorrect(correct);
        setIsSubmitted(true);

        // Save the result to Firestore if user is logged in
        if (user && firestore) {
            try {
                 addDocumentNonBlocking(collection(firestore, 'ela_user_submissions'), {
                    userId: user.uid,
                    challenge_id: drill.id,
                    challenge_title: drill.topic + " Drill",
                    type: 'Grammar Drill',
                    question: drill.question_prompt,
                    user_answer: selectedOption,
                    is_correct: correct,
                    date_submitted: serverTimestamp(),
                    status: 'Graded',
                    teacher_score: correct ? 100 : 0,
                    schoolId: schoolId, // SAAS Compliance
                });

                if (correct) {
                    const leaderboardRef = doc(firestore, 'ela_leaderboard', user.uid);
                    setDoc(leaderboardRef, {
                        userId: user.uid,
                        userName: user.displayName || user.email,
                        profilePictureUrl: user.photoURL || '',
                        total_correct_answers: increment(1),
                        schoolId: schoolId
                    }, { merge: true });
                }
            } catch (e) {
                console.error("Failed to save progress", e);
            }
        }
    };

    const handleReset = () => {
        setIsSubmitted(false);
        setSelectedOption('');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleReset}>
            <DialogContent className="sm:max-w-[500px] bg-slate-950 border border-slate-800 text-slate-100 shadow-2xl rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        <span>✨</span> {drill.topic} Practice
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Read the prompt and select the correct answer.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="py-4 space-y-4">
                    <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl text-lg font-medium text-slate-200 shadow-inner">
                        {drill.question_prompt}
                    </div>

                    <RadioGroup value={selectedOption} onValueChange={setSelectedOption} disabled={isSubmitted} className="space-y-2">
                        {drill.options?.map((option, idx) => {
                            const isCorrectAnswer = option === drill.correct_answer;
                            const isUserSelection = option === selectedOption;
                            
                            let optionClass = "flex items-center space-x-3 border p-3.5 rounded-xl transition-all duration-200 cursor-pointer ";
                            if (isSubmitted) {
                                if (isCorrectAnswer) {
                                    optionClass += "border-emerald-500/50 bg-emerald-950/20 text-emerald-200";
                                } else if (isUserSelection && !isCorrect) {
                                    optionClass += "border-rose-500/50 bg-rose-950/20 text-rose-200";
                                } else {
                                    optionClass += "border-slate-850 bg-slate-900/20 text-slate-500 opacity-60";
                                }
                            } else {
                                if (isUserSelection) {
                                    optionClass += "border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_12px_rgba(99,102,241,0.15)]";
                                } else {
                                    optionClass += "border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700/80 hover:bg-slate-900/60";
                                }
                            }

                            return (
                                <label key={idx} className={optionClass}>
                                    <RadioGroupItem value={option} id={`opt-${idx}`} className="text-indigo-500 focus:ring-indigo-500 border-slate-700 bg-slate-900" />
                                    <span className="flex-grow text-sm font-medium cursor-pointer">{option}</span>
                                    {isSubmitted && isCorrectAnswer && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
                                    {isSubmitted && isUserSelection && !isCorrect && <XCircle className="h-5 w-5 text-rose-400 shrink-0" />}
                                </label>
                            );
                        })}
                    </RadioGroup>

                    {isSubmitted && (
                        <div className={`p-4 rounded-xl text-center text-sm font-semibold border ${
                            isCorrect 
                                ? "bg-emerald-950/30 border-emerald-800/50 text-emerald-300 shadow-sm" 
                                : "bg-rose-950/30 border-rose-800/50 text-rose-300 shadow-sm"
                        }`}>
                            {isCorrect ? "🎉 Correct! Great job." : `❌ Incorrect. The correct answer is: ${drill.correct_answer}`}
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    {!isSubmitted ? (
                        <Button 
                            onClick={handleSubmit} 
                            disabled={!selectedOption}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/20 rounded-xl px-5 py-2 transition-all w-full sm:w-auto"
                        >
                            Check Answer
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleReset}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50 rounded-xl px-5 py-2 transition-all w-full sm:w-auto"
                        >
                            Close & Continue
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- MAIN COMPONENT ---
export function GrammarPractice() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { role } = useRole();
  const { schoolId } = useCurrentSchool();
  
  const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role || '');

  // State for Dropdowns
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedDrillId, setSelectedDrillId] = useState<string>('');
  const [isDrillOpen, setIsDrillOpen] = useState(false);

  // 1. Get Student Data
  const { data: studentData, isLoading: isLoadingStudent } = useCollection<Student>(
    useMemoFirebase(() => {
      if (!user || !firestore || isStaff || !schoolId) return null;
      return query(collection(firestore, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId));
    }, [firestore, user, isStaff, schoolId])
  );
  
  const studentClassId = studentData?.[0]?.classId;

  // 2. Query Drills
  const drillsQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    let q = query(collection(firestore, 'ela_grammar_drills'), where('schoolId', '==', schoolId));
    
    if (isStaff) return q;
    
    if (studentClassId) {
      return query(q, where('classId', '==', studentClassId));
    }
    return null;
  }, [firestore, studentClassId, isStaff, schoolId]);

  const { data: drills, isLoading: isLoadingDrills } = useCollection<ElaGrammarDrill>(drillsQuery);

  const isLoading = isUserLoading || (isLoadingStudent && !isStaff) || isLoadingDrills;

  // 3. Derived Data for Dropdowns
  const uniqueTopics = useMemo(() => {
      if (!drills) return [];
      return Array.from(new Set(drills.map(d => d.topic))).sort();
  }, [drills]);

  const filteredDrills = useMemo(() => {
      if (!drills || !selectedTopic) return [];
      return drills.filter(d => d.topic === selectedTopic);
  }, [drills, selectedTopic]);

  const activeDrill = useMemo(() => {
      return drills?.find(d => d.id === selectedDrillId) || null;
  }, [drills, selectedDrillId]);

  const handleStart = () => {
      if (selectedDrillId) {
          setIsDrillOpen(true);
      }
  };

  return (
    <>
        <Card className="border border-slate-800/80 bg-slate-900/40 backdrop-blur-md text-white rounded-3xl shadow-2xl relative overflow-hidden">
            <CardHeader>
                <CardTitle className="text-2xl font-black text-white flex items-center gap-2">
                    🎯 Grammar & Mechanics Practice
                </CardTitle>
                <CardDescription className="text-slate-400">
                    Select a topic and a question to test your skills.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex flex-col space-y-4 max-w-xl mx-auto">
                        <Skeleton className="h-12 w-full bg-slate-800/60 animate-pulse rounded-xl" />
                        <Skeleton className="h-12 w-full bg-slate-800/60 animate-pulse rounded-xl" />
                        <div className="flex justify-center text-slate-400 text-sm gap-2 py-4">
                            <Loader2 className="h-4 w-4 animate-spin text-indigo-400" /> Loading grammar drills...
                        </div>
                    </div>
                ) : (!isStaff && !studentClassId) ? (
                    <div className="text-center py-12">
                        <p className="text-slate-400">You are not assigned to a class.</p>
                    </div>
                ) : drills && drills.length > 0 ? (
                    <div className="space-y-6 max-w-xl mx-auto py-4">
                        
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-300 ml-1">1. Choose a Topic</Label>
                            <Select value={selectedTopic} onValueChange={(val) => { setSelectedTopic(val); setSelectedDrillId(''); }}>
                                <SelectTrigger className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:ring-indigo-500 rounded-xl h-12">
                                    <SelectValue placeholder="Select Grammar Topic" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                                    {uniqueTopics.map(topic => (
                                        <SelectItem key={topic} value={topic} className="focus:bg-indigo-600 focus:text-white">{topic}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-300 ml-1">2. Choose a Question</Label>
                            <Select value={selectedDrillId} onValueChange={setSelectedDrillId} disabled={!selectedTopic}>
                                <SelectTrigger className="bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:ring-indigo-500 rounded-xl h-12">
                                    <SelectValue placeholder={!selectedTopic ? "Select a topic first" : "Select a specific question"} />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                                    {filteredDrills.map((drill, index) => (
                                        <SelectItem key={drill.id} value={drill.id} className="focus:bg-indigo-600 focus:text-white">
                                            Q{index + 1}: {drill.question_prompt.substring(0, 60)}{drill.question_prompt.length > 60 ? "..." : ""}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button 
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-6 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25 h-12 flex items-center justify-center gap-2" 
                            onClick={handleStart} 
                            disabled={!selectedDrillId}
                        >
                            🚀 Start Practice Drill
                        </Button>
                    </div>
                ) : (
                    <p className="text-center text-slate-400 py-12">
                        {isStaff ? "No grammar drills found. Please add drills via the Manage Problems tab." : "No grammar drills found for your class."}
                    </p>
                )}
            </CardContent>
        </Card>

        <ActiveDrillDialog 
            drill={activeDrill} 
            open={isDrillOpen} 
            setOpen={setIsDrillOpen} 
        />
    </>
  );
}
