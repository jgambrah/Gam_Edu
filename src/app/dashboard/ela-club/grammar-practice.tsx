
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRole } from '@/context/role-context';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
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

// --- SUB-COMPONENT: The Actual Drill Modal ---
function ActiveDrillDialog({ drill, open, setOpen }: { drill: ElaGrammarDrill | null, open: boolean, setOpen: (o: boolean) => void }) {
    const [selectedOption, setSelectedOption] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const { user } = useUser();
    const firestore = useFirestore();

    if (!drill) return null;

    const handleSubmit = async () => {
        if (!selectedOption) return;
        
        const correct = selectedOption === drill.correct_answer;
        setIsCorrect(correct);
        setIsSubmitted(true);

        // Optional: Save the result to Firestore if user is logged in
        if (user && firestore) {
            try {
                // We fire and forget this save (don't await it to block UI)
                 addDocumentNonBlocking(collection(firestore, 'ela_user_submissions'), {
                    userId: user.uid,
                    challenge_id: drill.id, // Using drill ID as challenge ID
                    challenge_title: drill.topic + " Drill",
                    type: 'Grammar Drill',
                    question: drill.question_prompt,
                    user_answer: selectedOption,
                    is_correct: correct,
                    date_submitted: serverTimestamp(),
                    status: 'Graded',
                    teacher_score: correct ? 100 : 0
                });
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

    // Helper utility for classnames
    function cn(...classes: (string | undefined | null | false)[]) {
        return classes.filter(Boolean).join(' ');
    }

    return (
        <Dialog open={open} onOpenChange={handleReset}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{drill.topic} Practice</DialogTitle>
                    <DialogDescription>Read the prompt and select the correct answer.</DialogDescription>
                </DialogHeader>
                
                <div className="py-4 space-y-4">
                    <div className="bg-muted p-4 rounded-md text-lg font-medium">
                        {drill.question_prompt}
                    </div>

                    <RadioGroup value={selectedOption} onValueChange={setSelectedOption} disabled={isSubmitted}>
                        {drill.options.map((option, idx) => (
                            <div key={idx} className={cn("flex items-center space-x-2 border p-3 rounded-md transition-colors", 
                                isSubmitted && option === drill.correct_answer ? "border-green-500 bg-green-50" : "",
                                isSubmitted && option === selectedOption && !isCorrect ? "border-red-500 bg-red-50" : ""
                            )}>
                                <RadioGroupItem value={option} id={`opt-${idx}`} />
                                <Label htmlFor={`opt-${idx}`} className="flex-grow cursor-pointer">{option}</Label>
                                {isSubmitted && option === drill.correct_answer && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                                {isSubmitted && option === selectedOption && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                            </div>
                        ))}
                    </RadioGroup>

                    {isSubmitted && (
                        <div className={cn("p-4 rounded-md text-center font-bold", isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
                            {isCorrect ? "Correct! Great job." : `Incorrect. The correct answer was: ${drill.correct_answer}`}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {!isSubmitted ? (
                        <Button onClick={handleSubmit} disabled={!selectedOption}>Check Answer</Button>
                    ) : (
                        <Button onClick={handleReset}>Close & Continue</Button>
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
  
  const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role);

  // State for Dropdowns
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedDrillId, setSelectedDrillId] = useState<string>('');
  const [isDrillOpen, setIsDrillOpen] = useState(false);

  // 1. Get Student Data
  const { data: studentData, isLoading: isLoadingStudent } = useCollection<Student>(
    useMemoFirebase(() => {
      if (!user || !firestore || isStaff) return null;
      return query(collection(firestore, 'students'), where('uid', '==', user.uid));
    }, [firestore, user, isStaff])
  );
  
  const studentClassId = studentData?.[0]?.classId;

  // 2. Query Drills
  const drillsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    if (isStaff) return query(collection(firestore, 'ela_grammar_drills'));
    if (studentClassId) {
      return query(collection(firestore, 'ela_grammar_drills'), where('classId', '==', studentClassId));
    }
    return null;
  }, [firestore, studentClassId, isStaff]);

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

  // Helper utility for classnames
  function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <>
        <Card>
        <CardHeader>
            <CardTitle>Grammar & Mechanics Practice</CardTitle>
            <CardDescription>Select a topic and a question to test your skills.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
            <div className="flex flex-col space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <div className="flex justify-center text-muted-foreground text-sm gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading drills...
                </div>
            </div>
            ) : (!isStaff && !studentClassId) ? (
            <div className="text-center py-8">
                <p className="text-muted-foreground">You are not assigned to a class.</p>
                <p className="text-xs text-red-400 mt-2">Debug: User ID: {user?.uid || 'Not Found'}</p>
            </div>
            ) : drills && drills.length > 0 ? (
                <div className="space-y-6 max-w-xl mx-auto py-4">
                    
                    {/* DROP DOWN 1: TOPIC */}
                    <div className="space-y-2">
                        <Label>1. Choose a Topic</Label>
                        <Select value={selectedTopic} onValueChange={(val) => { setSelectedTopic(val); setSelectedDrillId(''); }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Grammar Topic" />
                            </SelectTrigger>
                            <SelectContent>
                                {uniqueTopics.map(topic => (
                                    <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* DROP DOWN 2: QUESTION */}
                    <div className="space-y-2">
                        <Label>2. Choose a Question</Label>
                        <Select value={selectedDrillId} onValueChange={setSelectedDrillId} disabled={!selectedTopic}>
                            <SelectTrigger>
                                <SelectValue placeholder={!selectedTopic ? "Select a topic first" : "Select a specific question"} />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredDrills.map((drill, index) => (
                                    <SelectItem key={drill.id} value={drill.id}>
                                        {/* We truncate long questions for the dropdown */}
                                        Q{index + 1}: {drill.question_prompt.substring(0, 50)}{drill.question_prompt.length > 50 ? "..." : ""}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button className="w-full" size="lg" onClick={handleStart} disabled={!selectedDrillId}>
                        Start Practice Drill
                    </Button>
                </div>
            ) : (
            <p className="text-center text-muted-foreground py-10">
                {isStaff ? "No grammar drills found." : "No grammar drills found for your class."}
            </p>
            )}
        </CardContent>
        </Card>

        {/* THE MODAL THAT OPENS THE DRILL */}
        <ActiveDrillDialog 
            drill={activeDrill} 
            open={isDrillOpen} 
            setOpen={setIsDrillOpen} 
        />
    </>
  );
}
