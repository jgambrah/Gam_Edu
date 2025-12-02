

'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpenCheck, Edit, FileText, ChevronRight, PlusCircle, PenSquare, Wand2, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/context/role-context';
import { GrammarPractice } from './grammar-practice';
import { cn } from '@/lib/utils';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, addDoc, where, serverTimestamp, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ElaGrammarDrill, elaGrammarDrillSchema, ElaReadingPassage, elaReadingPassageSchema, ElaWritingChallenge, elaWritingChallengeSchema, ElaUserSubmission, Class, Student } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableRow, TableHeader, TableCell, TableBody, TableHead } from '@/components/ui/table';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AiProblemGenerator } from '../ai-problem-generator';
import { generateReadingPassage } from '@/ai/flows/generate-reading-passage-flow';
import { generateWritingChallenge } from '@/ai/flows/generate-writing-challenge-flow';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { getAuth } from 'firebase/auth';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


// --- SUB-COMPONENT: The Reading Reader Modal ---
function ActivePassageDialog({ passage, open, setOpen }: { passage: ElaReadingPassage | null, open: boolean, setOpen: (o: boolean) => void }) {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);
    const firestore = useFirestore();
    const { user } = useUser();

    if (!passage) return null;

    // Calculate score
    const calculateScore = () => {
        let correct = 0;
        let total = passage.question_set.length;
        passage.question_set.forEach((q, idx) => {
            // Simple case-insensitive match for short answers, exact match for MCQ
            if (answers[idx]?.trim().toLowerCase() === q.correct_answer_key.trim().toLowerCase()) {
                correct++;
            }
        });
        return { correct, total, percentage: (correct / total) * 100 };
    };

    const handleSubmit = async () => {
        setShowResults(true);
        const { percentage } = calculateScore();

        // Save progress to Firestore
        if (user && firestore) {
            try {
                await addDocumentNonBlocking(collection(firestore, 'ela_user_submissions'), {
                    userId: user.uid,
                    challenge_id: passage.id,
                    challenge_title: passage.title,
                    type: 'Reading Comprehension',
                    answers: answers,
                    teacher_score: percentage,
                    date_submitted: serverTimestamp(),
                    status: 'Graded'
                });
            } catch (e) {
                console.error("Failed to save reading progress", e);
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setShowResults(false);
            setAnswers({});
        }, 300);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{passage.title}</DialogTitle>
                    <DialogDescription>Read the passage on the left and answer the questions on the right.</DialogDescription>
                </DialogHeader>
                
                <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
                    {/* LEFT SIDE: PASSAGE TEXT */}
                    <div className="w-1/2 flex flex-col border-r pr-6">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4"/> Passage Text 
                            <Badge variant="outline">{passage.reading_level}</Badge>
                        </h4>
                        <ScrollArea className="flex-1 bg-muted/30 p-4 rounded-md border">
                            <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                                {passage.passage_text}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* RIGHT SIDE: QUESTIONS */}
                    <div className="w-1/2 flex flex-col">
                        <h4 className="font-semibold mb-2">Comprehension Questions</h4>
                        <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-6">
                                {passage.question_set.map((q, idx) => {
                                    const isCorrect = answers[idx]?.trim().toLowerCase() === q.correct_answer_key.trim().toLowerCase();
                                    return (
                                        <div key={idx} className={cn("p-4 border rounded-lg", 
                                            showResults && isCorrect ? "bg-green-50 border-green-200" : "",
                                            showResults && !isCorrect ? "bg-red-50 border-red-200" : ""
                                        )}>
                                            <p className="font-medium mb-3">{idx + 1}. {q.question}</p>
                                            
                                            {/* RENDER OPTIONS OR INPUT */}
                                            {q.options && q.options.length > 0 ? (
                                                <RadioGroup 
                                                    value={answers[idx] || ''} 
                                                    onValueChange={(val) => setAnswers(prev => ({...prev, [idx]: val}))}
                                                    disabled={showResults}
                                                >
                                                    {q.options.map((opt, i) => (
                                                        <div key={`${q.question}-${i}`} className="flex items-center space-x-2">
                                                            <RadioGroupItem value={opt} id={`q${idx}-opt${i}`} />
                                                            <Label htmlFor={`q${idx}-opt${i}`} className="font-normal cursor-pointer">{opt}</Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            ) : (
                                                <Input 
                                                    placeholder="Type your answer..." 
                                                    value={answers[idx] || ''}
                                                    onChange={(e) => setAnswers(prev => ({...prev, [idx]: e.target.value}))}
                                                    disabled={showResults}
                                                />
                                            )}

                                            {/* SHOW FEEDBACK */}
                                            {showResults && (
                                                <div className="mt-2 text-xs font-semibold">
                                                    {isCorrect ? (
                                                        <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Correct</span>
                                                    ) : (
                                                        <span className="text-red-600">Correct Answer: {q.correct_answer_key}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                <DialogFooter className="pt-4 border-t mt-4">
                    {!showResults ? (
                        <Button onClick={handleSubmit} className="w-full md:w-auto">Submit Answers</Button>
                    ) : (
                        <div className="flex justify-between w-full items-center">
                            <div className="font-bold">
                                Score: {calculateScore().correct} / {passage.question_set.length}
                            </div>
                            <Button onClick={handleClose}>Finish Practice</Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- Reading Practice Tab ---
function ReadingPracticeTab() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { role } = useRole(); 
  
  const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role);

  // State for UI
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedPassageId, setSelectedPassageId] = useState<string>('');
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  // 1. Fetch Student Data
  const { data: studentData, isLoading: isLoadingStudent } = useCollection<Student>(
    useMemoFirebase(() => 
      (user && firestore && !isStaff) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, 
    [firestore, user, isStaff])
  );
  const studentClassId = studentData?.[0]?.classId;

  // 2. Fetch Passages
  const passagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    if (isStaff) return query(collection(firestore, 'ela_reading_passages'));
    if (studentClassId) return query(collection(firestore, 'ela_reading_passages'), where('classId', '==', studentClassId));
    return null;
  }, [firestore, studentClassId, isStaff]);

  const { data: passages, isLoading: isLoadingPassages } = useCollection<ElaReadingPassage>(passagesQuery);

  const isLoading = isUserLoading || (isLoadingStudent && !isStaff) || isLoadingPassages;

  // 3. Derived Lists
  const uniqueLevels = useMemo(() => {
      if (!passages) return [];
      return Array.from(new Set(passages.map(p => p.reading_level))).sort();
  }, [passages]);

  const filteredPassages = useMemo(() => {
      if (!passages) return [];
      if (!selectedLevel) return []; // Show none until level selected
      return passages.filter(p => p.reading_level === selectedLevel);
  }, [passages, selectedLevel]);

  const activePassage = useMemo(() => {
      return passages?.find(p => p.id === selectedPassageId) || null;
  }, [passages, selectedPassageId]);

  const handleStart = () => {
      if (selectedPassageId) setIsReaderOpen(true);
  };

  return (
    <>
        <Card>
        <CardHeader>
            <CardTitle>Reading Comprehension Practice</CardTitle>
            <CardDescription>{isStaff ? "Viewing ALL passages" : "Select a reading level and a title to begin."}</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="flex flex-col space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <div className="flex justify-center text-muted-foreground text-sm gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading library...
                    </div>
                </div>
            ) :
            (!isStaff && !studentClassId) ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">You are not assigned to a class.</p>
                </div>
            ) :
            passages && passages.length > 0 ? (
                <div className="space-y-6 max-w-xl mx-auto py-4">
                     {/* DROP DOWN 1: READING LEVEL */}
                     <div className="space-y-2">
                        <Label>1. Choose Reading Level</Label>
                        <Select value={selectedLevel} onValueChange={(val) => { setSelectedLevel(val); setSelectedPassageId(''); }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Level (e.g., Grade 9)" />
                            </SelectTrigger>
                            <SelectContent>
                                {uniqueLevels.map(lvl => (
                                    <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                     {/* DROP DOWN 2: PASSAGE TITLE */}
                     <div className="space-y-2">
                        <Label>2. Choose Passage Title</Label>
                        <Select value={selectedPassageId} onValueChange={setSelectedPassageId} disabled={!selectedLevel}>
                            <SelectTrigger>
                                <SelectValue placeholder={!selectedLevel ? "Select a level first" : "Select a Title"} />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredPassages.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button className="w-full" size="lg" onClick={handleStart} disabled={!selectedPassageId}>
                        Open Reader <BookOpenCheck className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <p className="text-center text-muted-foreground py-12">
                    {isStaff ? "No passages found." : "No reading passages available for your class."}
                </p>
            )}
        </CardContent>
        </Card>

        {/* THE READER MODAL */}
        <ActivePassageDialog 
            passage={activePassage} 
            open={isReaderOpen} 
            setOpen={setIsReaderOpen} 
        />
    </>
  );
}

// --- SUB-COMPONENT: Writing Workspace Modal ---
function ActiveChallengeDialog({ 
    challenge, 
    existingSubmission, 
    open, 
    setOpen 
}: { 
    challenge: ElaWritingChallenge | null, 
    existingSubmission: ElaUserSubmission | undefined,
    open: boolean, 
    setOpen: (o: boolean) => void 
}) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!challenge) return null;

    const handleSubmit = async () => {
        if (!user || !text.trim()) return;
        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(collection(firestore, 'ela_user_submissions'), {
                userId: user.uid,
                challenge_id: challenge.id,
                challenge_title: challenge.title,
                type: 'Writing Challenge',
                submission_text: text,
                date_submitted: serverTimestamp(),
                status: 'Submitted',
                teacher_score: null,
                teacher_feedback: ''
            });
            toast({ title: 'Success', description: 'Your work has been submitted for review.' });
            setOpen(false);
        } catch (error) {
            console.error('Error submitting work:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not submit your work.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{challenge.challengeType}</Badge>
                        {existingSubmission && <Badge variant={existingSubmission.status === 'Graded' ? 'default' : 'secondary'}>{existingSubmission.status}</Badge>}
                    </div>
                    <DialogTitle className="text-xl">{challenge.title}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-1 gap-6 overflow-hidden min-h-0 pt-2">
                    {/* LEFT SIDE: PROMPT */}
                    <div className="w-1/3 flex flex-col border-r pr-6">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-yellow-500"/> The Prompt
                        </h4>
                        <ScrollArea className="flex-1 bg-yellow-50/50 p-4 rounded-md border border-yellow-100">
                            <p className="text-sm whitespace-pre-wrap leading-relaxed text-slate-800">
                                {challenge.prompt}
                            </p>
                        </ScrollArea>
                    </div>

                    {/* RIGHT SIDE: EDITOR / STATUS */}
                    <div className="w-2/3 flex flex-col">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <PenSquare className="h-4 w-4"/> Your Response
                        </h4>
                        
                        {existingSubmission ? (
                            <ScrollArea className="flex-1 bg-muted/20 p-4 rounded-md border">
                                <div className="prose prose-sm max-w-none whitespace-pre-wrap font-serif">
                                    {existingSubmission.submission_text}
                                </div>
                                {existingSubmission.status === 'Graded' && (
                                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                                        <p className="font-bold text-green-800 mb-1">Teacher Feedback (Score: {existingSubmission.teacher_score}/100)</p>
                                        <p className="text-sm text-green-700">{existingSubmission.teacher_feedback || "Great job!"}</p>
                                    </div>
                                )}
                            </ScrollArea>
                        ) : (
                            <Textarea 
                                className="flex-1 resize-none font-serif text-lg p-4 leading-relaxed bg-white" 
                                placeholder="Start writing here..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        )}
                    </div>
                </div>

                <DialogFooter className="pt-4 border-t mt-4">
                    {existingSubmission ? (
                        <Button onClick={() => setOpen(false)} variant="secondary">Close View</Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting || !text.trim()}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit Work
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function WritingSubmissionTab() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { role } = useRole();
    
    // UI State
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedChallengeId, setSelectedChallengeId] = useState<string>('');
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

    const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role);

    // 1. Fetch Student Data (to get Class ID)
    const { data: studentData, isLoading: isLoadingStudent } = useCollection<Student>(
        useMemoFirebase(() => (user && firestore && !isStaff) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [firestore, user, isStaff])
    );
    const studentClassId = studentData?.[0]?.classId;

    // 2. Fetch Challenges
    const { data: challenges, isLoading: isLoadingChallenges } = useCollection<ElaWritingChallenge>(
        useMemoFirebase(() => {
            if(!firestore) return null;
            if (isStaff) return query(collection(firestore, 'ela_writing_challenges'));
            if (studentClassId) return query(collection(firestore, 'ela_writing_challenges'), where('classId', '==', studentClassId));
            return null;
        }, [firestore, studentClassId, isStaff])
    );

    // 3. Fetch My Submissions (to see if I already did it)
    const { data: submissions, isLoading: isLoadingSubmissions } = useCollection<ElaUserSubmission>(
        useMemoFirebase(() => (user && firestore) ? query(collection(firestore, 'ela_user_submissions'), where('userId', '==', user.uid)) : null, [firestore, user])
    );

    const isLoading = isUserLoading || isLoadingChallenges || isLoadingSubmissions || (isLoadingStudent && !isStaff);

    // 4. Filtering Logic
    const uniqueTypes = useMemo(() => {
        if (!challenges) return [];
        return Array.from(new Set(challenges.map(c => c.challengeType))).sort();
    }, [challenges]);

    const filteredChallenges = useMemo(() => {
        if (!challenges || !selectedType) return [];
        return challenges.filter(c => c.challengeType === selectedType);
    }, [challenges, selectedType]);

    const activeChallenge = useMemo(() => {
        return challenges?.find(c => c.id === selectedChallengeId) || null;
    }, [challenges, selectedChallengeId]);

    const existingSubmission = useMemo(() => {
        if (!activeChallenge || !submissions) return undefined;
        return submissions.find(s => s.challenge_id === activeChallenge.id);
    }, [activeChallenge, submissions]);

    const handleStart = () => {
        if (selectedChallengeId) setIsWorkspaceOpen(true);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Writing & Summarizing Challenges</CardTitle>
                    <CardDescription>{isStaff ? "Viewing ALL Challenges" : "Select a challenge type to begin writing."}</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex flex-col space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <div className="flex justify-center text-muted-foreground text-sm gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" /> Loading challenges...
                            </div>
                        </div>
                    ) : 
                    (!isStaff && !studentClassId) ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">You are not assigned to a class.</p>
                            <p className="text-xs text-red-400 mt-1">Debug: UID {user?.uid}</p>
                        </div>
                    ) :
                    challenges && challenges.length > 0 ? (
                        <div className="space-y-6 max-w-xl mx-auto py-4">
                            
                            {/* DROPDOWN 1: TYPE */}
                            <div className="space-y-2">
                                <Label>1. Choose Challenge Type</Label>
                                <Select value={selectedType} onValueChange={(val) => { setSelectedType(val); setSelectedChallengeId(''); }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type (e.g., Essay, Creative Writing)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {uniqueTypes.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* DROPDOWN 2: TITLE */}
                            <div className="space-y-2">
                                <Label>2. Choose Challenge</Label>
                                <Select value={selectedChallengeId} onValueChange={setSelectedChallengeId} disabled={!selectedType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={!selectedType ? "Select a type first" : "Select a Title"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredChallenges.map(c => {
                                            const isDone = submissions?.some(s => s.challenge_id === c.id);
                                            return (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.title} {isDone ? "✅" : ""}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button className="w-full" size="lg" onClick={handleStart} disabled={!selectedChallengeId}>
                                {existingSubmission ? "View My Submission" : "Open Writing Workspace"}
                                {existingSubmission ? <BookOpenCheck className="ml-2 h-4 w-4"/> : <PenSquare className="ml-2 h-4 w-4" />}
                            </Button>
                        </div>
                    ) : (
                         <p className="text-center text-muted-foreground py-12">{isStaff ? "No challenges found." : "No writing challenges available for your class."}</p>
                    )}
                </CardContent>
            </Card>

            {/* THE WORKSPACE MODAL */}
            <ActiveChallengeDialog 
                challenge={activeChallenge} 
                existingSubmission={existingSubmission}
                open={isWorkspaceOpen} 
                setOpen={setIsWorkspaceOpen} 
            />
        </>
    );
}

// --- Teacher/Admin Management Components ---
function AiPassageGenerator({ setOpen }: { setOpen: (open: boolean) => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [topic, setTopic] = useState('');
  const [readingLevel, setReadingLevel] = useState('Grade 9');
  const [numQuestions, setNumQuestions] = useState(3);
  const [selectedClassId, setSelectedClassId] = useState<string>(''); // New state for class selection

  const [generatedPassage, setGeneratedPassage] = useState<z.infer<typeof elaReadingPassageSchema> | null>(null);

  const { data: classes } = useCollection<Class>(useMemoFirebase(() => firestore ? collection(firestore, 'classes') : null, [firestore]));

  async function onGenerate() {
    if (!topic) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please enter a topic.' });
        return;
    }
    setIsGenerating(true);
    setGeneratedPassage(null);
    toast({ title: 'Generating Passage...', description: 'Please wait while the AI writes your passage and questions.' });

    try {
      const result = await generateReadingPassage({
        topic: topic,
        reading_level: readingLevel,
        numQuestions: numQuestions,
      });
      
      const passageData = { ...result, passage_text: result.passage_text, question_set: result.question_set.map(q => ({...q, options: [], type: 'Short Answer' as const})), classId: '' };
      setGeneratedPassage(passageData);

      toast({ title: 'Passage Generated!', description: 'Review the content and select a class to save.' });
    } catch (error) {
      console.error('Error generating passage:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'An AI error occurred while creating the passage.' });
    } finally {
      setIsGenerating(false);
    }
  }

  async function onSave() {
    if (!generatedPassage || !selectedClassId) { // Check for selected class
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a class before saving.' });
      return;
    }
    setIsSaving(true);
    try {
      await addDocumentNonBlocking(collection(firestore, 'ela_reading_passages'), {
        ...generatedPassage,
        classId: selectedClassId, // Save with the selected classId
      });
      toast({ title: 'Success!', description: 'The new reading passage has been saved.' });
      setOpen(false);
    } catch (e) {
      console.error("Error saving passage:", e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save the generated passage.' });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 p-4 border rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Topic</Label>
            <Input placeholder="e.g., The Amazon Rainforest" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Reading Level</Label>
            <Input placeholder="e.g., Grade 9" value={readingLevel} onChange={(e) => setReadingLevel(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label># of Questions</Label>
            <Input type="number" min={1} max={5} value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} />
          </div>
        </div>
        <Button type="button" onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          Generate Passage
        </Button>
      </div>
      {generatedPassage && (
        <Card className="bg-muted/50">
          <CardHeader><CardTitle>{generatedPassage.title}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-60 w-full pr-4">
              <div className="prose prose-sm max-w-none">
                <p>{generatedPassage.passage_text}</p>
                <h4>Comprehension Questions</h4>
                <ol>
                  {generatedPassage.question_set.map((q, i) => <li key={i}>{q.question} (Answer: {q.correct_answer_key})</li>)}
                </ol>
              </div>
            </ScrollArea>
            <div className="space-y-2">
              <Label>Assign to Class</Label>
              <Select onValueChange={setSelectedClassId} value={selectedClassId}>
                <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button onClick={onSave} disabled={isSaving || !selectedClassId}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save Passage
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PassageCreationForm({ setOpen, initialData, classes, onSuccess }: { setOpen: (open: boolean) => void; initialData?: ElaReadingPassage; classes: Class[] | undefined; onSuccess: () => void; }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<z.infer<typeof elaReadingPassageSchema>>({
        resolver: zodResolver(elaReadingPassageSchema),
        defaultValues: initialData || { title: '', passage_text: '', reading_level: '', classId: '', question_set: [{ question: '', type: 'Short Answer', options: [], correct_answer_key: '' }] }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "question_set"
    });

    async function onSubmit(values: z.infer<typeof elaReadingPassageSchema>) {
        setIsSubmitting(true);
        try {
            if (initialData) {
                await updateDocumentNonBlocking(doc(firestore, 'ela_reading_passages', initialData.id), values);
                toast({ title: 'Success', description: 'Passage updated.' });
            } else {
                await addDocumentNonBlocking(collection(firestore, 'ela_reading_passages'), values);
                toast({ title: 'Success', description: 'New reading passage has been added.' });
            }
            onSuccess();
            form.reset();
            setOpen(false);
        } catch (error) {
            console.error('Error saving passage:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not save the passage.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <ScrollArea className="h-[60vh] w-full pr-4">
                    <div className="space-y-4">
                         <FormField control={form.control} name="classId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assign to Class</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a class"/></SelectTrigger></FormControl>
                                <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                                </Select><FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Passage Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="reading_level" render={({ field }) => (
                            <FormItem><FormLabel>Reading Level</FormLabel><FormControl><Input placeholder="e.g., Grade 9" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="passage_text" render={({ field }) => (
                            <FormItem><FormLabel>Passage Text</FormLabel><FormControl><Textarea rows={8} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <div className="space-y-4">
                            <h4 className="font-semibold">Comprehension Questions</h4>
                            {fields.map((field, index) => (
                                <div key={field.id} className="p-4 border rounded-md space-y-3 bg-muted/50">
                                    <FormField control={form.control} name={`question_set.${index}.question`} render={({ field }) => (
                                        <FormItem><FormLabel>Question {index + 1}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name={`question_set.${index}.correct_answer_key`} render={({ field }) => (
                                        <FormItem><FormLabel>Correct Answer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>Remove Question</Button>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ question: '', type: 'Short Answer', options: [], correct_answer_key: '' })}>Add Question</Button>
                    </div>
                </ScrollArea>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {initialData ? 'Save Changes' : 'Add Passage'}</Button>
            </form>
        </Form>
    );
}

function ManagePassages() {
    const firestore = useFirestore();
    const { data: passages, isLoading, forceRefetch } = useCollection<ElaReadingPassage>(useMemoFirebase(() => firestore ? query(collection(firestore, 'ela_reading_passages')) : null, [firestore]));
    const { data: classes } = useCollection<Class>(useMemoFirebase(() => firestore ? collection(firestore, 'classes') : null, [firestore]));
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAiFormOpen, setIsAiFormOpen] = useState(false);
    const [editingPassage, setEditingPassage] = useState<ElaReadingPassage | undefined>(undefined);

    const handleEdit = (passage: ElaReadingPassage) => {
        setEditingPassage(passage);
        setIsFormOpen(true);
    };
    
    const handleCreate = () => {
        setEditingPassage(undefined);
        setIsFormOpen(true);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Reading Passage Bank</CardTitle>
                    <CardDescription>Manage reading passages and their comprehension questions.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isAiFormOpen} onOpenChange={setIsAiFormOpen}>
                        <DialogTrigger asChild><Button variant="outline"><Wand2 className="mr-2 h-4" />Generate with AI</Button></DialogTrigger>
                        <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>AI Passage Generator</DialogTitle><DialogDescription>Generate a complete reading passage with comprehension questions.</DialogDescription></DialogHeader><AiPassageGenerator setOpen={setIsAiFormOpen} /></DialogContent>
                    </Dialog>
                    <Button onClick={handleCreate}><PlusCircle className="mr-2 h-4" />New Passage</Button>
                </div>
            </CardHeader>
            <CardContent>
                 {isLoading ? <Skeleton className="h-40 w-full" /> : (
                <Table>
                    <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Reading Level</TableHead><TableHead>Class</TableHead><TableHead># Qs</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {passages?.map(p => (
                            <TableRow key={p.id}>
                                <TableCell>{p.title}</TableCell>
                                <TableCell>{p.reading_level}</TableCell>
                                <TableCell>{classes?.find(c => c.id === p.classId)?.name || 'N/A'}</TableCell>
                                <TableCell>{p.question_set.length}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(p)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </CardContent>

             <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader><DialogTitle>{editingPassage ? 'Edit Passage' : 'Create New Passage'}</DialogTitle></DialogHeader>
                    <PassageCreationForm setOpen={setIsFormOpen} initialData={editingPassage} classes={classes} onSuccess={forceRefetch}/>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

function ManageWritingChallenges() {
    const firestore = useFirestore();
    const { data: challenges, isLoading: isLoadingChallenges } = useCollection<ElaWritingChallenge>(useMemoFirebase(() => firestore ? query(collection(firestore, 'ela_writing_challenges')) : null, [firestore]));
    const { data: submissions, isLoading: isLoadingSubmissions } = useCollection<ElaUserSubmission>(useMemoFirebase(() => firestore ? query(collection(firestore, 'ela_user_submissions')) : null, [firestore]));
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAiFormOpen, setIsAiFormOpen] = useState(false);
    
    const submissionsByChallenge = useMemo(() => {
        if (!submissions) return {};
        return submissions.reduce((acc, sub) => {
            (acc[sub.challenge_id] = acc[sub.challenge_id] || []).push(sub);
            return acc;
        }, {} as Record<string, ElaUserSubmission[]>);
    }, [submissions]);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Manage Writing Challenges</CardTitle>
                    <CardDescription>Create challenges and review student submissions.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isAiFormOpen} onOpenChange={setIsAiFormOpen}>
                        <DialogTrigger asChild><Button variant="outline"><Wand2 className="mr-2 h-4" />Generate with AI</Button></DialogTrigger>
                        <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>AI Writing Challenge Generator</DialogTitle><DialogDescription>Generate a writing prompt for any topic.</DialogDescription></DialogHeader><AiChallengeGenerator setOpen={setIsAiFormOpen} /></DialogContent>
                    </Dialog>
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4" />New Challenge</Button></DialogTrigger>
                        <DialogContent><DialogHeader><DialogTitle>Create New Writing Challenge</DialogTitle></DialogHeader><ChallengeCreationForm setOpen={setIsFormOpen} /></DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible>
                    {challenges?.map(challenge => (
                        <AccordionItem key={challenge.id} value={challenge.id}>
                            <AccordionTrigger>
                                <div className="flex justify-between w-full pr-4">
                                    <span>{challenge.title}</span>
                                    <span className="text-sm text-muted-foreground">{submissionsByChallenge[challenge.id]?.length || 0} Submissions</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                               {/* Submission grading table would go here */}
                               <p className="text-muted-foreground p-4 text-center">Submission review UI coming soon.</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}

// --- Main ELA Club Page Component ---
export default function ElaClubPage() {
  const { role } = useRole();
  const isTeacherOrAdmin =
    role === 'Teacher' || role === 'Administrator' || role === 'Director';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpenCheck />
            ELA Club
          </CardTitle>
          <CardDescription>
            Improve your reading, writing, and grammar skills.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="grammar" className="w-full">
        <TabsList className={cn("grid w-full", isTeacherOrAdmin ? "grid-cols-6" : "grid-cols-3")}>
          <TabsTrigger value="grammar">
            <Edit className="mr-2 h-4 w-4" />
            Grammar Practice
          </TabsTrigger>
          <TabsTrigger value="reading">
            <FileText className="mr-2 h-4 w-4" />
            Reading Practice
          </TabsTrigger>
          <TabsTrigger value="writing">
            <PenSquare className="mr-2 h-4 w-4" />
            Writing Challenges
          </TabsTrigger>
          {isTeacherOrAdmin && <TabsTrigger value="manage-drills">Manage Drills</TabsTrigger>}
          {isTeacherOrAdmin && <TabsTrigger value="manage-passages">Manage Passages</TabsTrigger>}
          {isTeacherOrAdmin && <TabsTrigger value="manage-writing">Manage Writing</TabsTrigger>}
        </TabsList>
        <TabsContent value="grammar">
          <GrammarPractice />
        </TabsContent>
        <TabsContent value="reading">
          <ReadingPracticeTab />
        </TabsContent>
        <TabsContent value="writing">
          <WritingSubmissionTab />
        </TabsContent>
        {isTeacherOrAdmin && (
            <TabsContent value="manage-drills">
                <ManageDrills />
            </TabsContent>
        )}
         {isTeacherOrAdmin && (
            <TabsContent value="manage-passages">
                <ManagePassages />
            </TabsContent>
        )}
        {isTeacherOrAdmin && (
            <TabsContent value="manage-writing">
                <ManageWritingChallenges />
            </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function ManageDrills() {
    const firestore = useFirestore();
    const { data: drills, isLoading } = useCollection<ElaGrammarDrill>(useMemoFirebase(() => firestore ? query(collection(firestore, 'ela_grammar_drills')) : null, [firestore]));
    const [isAiFormOpen, setIsAiFormOpen] = useState(false);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Grammar Drill Bank</CardTitle>
                    <CardDescription>Manage the collection of grammar problems for student practice sessions.</CardDescription>
                </div>
                 <div className="flex gap-2">
                    <Dialog open={isAiFormOpen} onOpenChange={setIsAiFormOpen}>
                        <DialogTrigger asChild><Button variant="outline"><Wand2 className="mr-2 h-4"/>Generate with AI</Button></DialogTrigger>
                        <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>AI Problem Generator</DialogTitle><DialogDescription>Generate multiple-choice grammar questions for any topic.</DialogDescription></DialogHeader><AiProblemGenerator subject="ELA Grammar" setOpen={setIsAiFormOpen} /></DialogContent>
                    </Dialog>
                    {/* Placeholder for manual creation if needed */}
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-40 w-full" /> : (
                <Table>
                    <TableHeader><TableRow><TableHead>Topic</TableHead><TableHead>Type</TableHead><TableHead>Question</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {drills?.map(d => (
                            <TableRow key={d.id}>
                                <TableCell>{d.topic}</TableCell>
                                <TableCell><Badge variant="secondary">{d.type}</Badge></TableCell>
                                <TableCell className="max-w-md truncate">{d.question_prompt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>
    )
}

function AiChallengeGenerator({ setOpen }: { setOpen: (open: boolean) => void }) {
    const firestore = useFirestore();
    const { user: hookUser } = useAuth();
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState<string>("");

    const [generatedChallenge, setGeneratedChallenge] = useState<{
        title: string;
        prompt: string;
        challengeType: 'Creative Writing' | 'Summarization' | 'Essay';
    } | null>(null);

    const { data: classes } = useCollection<Class>(
        useMemoFirebase(() => firestore ? collection(firestore, 'classes') : null, [firestore])
    );

    const form = useForm({
        defaultValues: { topic: '', challengeType: 'Creative Writing' as const }
    });

    async function onGenerate(values: { topic: string; challengeType: 'Creative Writing' | 'Summarization' | 'Essay' }) {
        setIsGenerating(true);
        setGeneratedChallenge(null);
        toast({ title: 'Generating Challenge...', description: 'Please wait...' });

        try {
            const result = await generateWritingChallenge(values);
            setGeneratedChallenge(result);
            toast({ title: 'Challenge Generated!', description: 'Review the prompt below.' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'AI Error.' });
        } finally {
            setIsGenerating(false);
        }
    }

    async function onSave() {
        const auth = getAuth();
        const currentUser = auth.currentUser || hookUser;

        if (!generatedChallenge) {
            toast({ variant: 'destructive', title: 'Error', description: 'No challenge generated.' });
            return;
        }

        if (!selectedClassId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a class to assign this challenge.' });
            return;
        }

        if (!currentUser) {
            toast({ variant: 'destructive', title: 'Critical Auth Error', description: 'Browser has no session. Try Hard Refresh (Ctrl+F5).' });
            return;
        }

        setIsSaving(true);
        try {
            await addDocumentNonBlocking(collection(firestore, 'ela_writing_challenges'), {
                title: generatedChallenge.title,
                prompt: generatedChallenge.prompt,
                challengeType: generatedChallenge.challengeType,
                classId: selectedClassId,
                createdBy: currentUser.uid,
                createdAt: serverTimestamp(),
            });
            toast({ title: 'Success!', description: 'Challenge saved and assigned to the class.' });
            setOpen(false);
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: 'Save failed.' });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onGenerate)} className="space-y-4 p-4 border rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="topic" render={({ field }) => (
                            <FormItem><FormLabel>Topic/Theme</FormLabel><FormControl><Input placeholder="e.g., A Journey to Mars" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        
                        <FormField control={form.control} name="challengeType" render={({ field }) => (
                            <FormItem><FormLabel>Challenge Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                                <SelectItem value="Creative Writing">Creative Writing</SelectItem>
                                <SelectItem value="Summarization">Summarization</SelectItem>
                                <SelectItem value="Essay">Essay</SelectItem>
                            </SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                    </div>
                    <Button type="submit" disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Generate Challenge
                    </Button>
                </form>
            </Form>

            {generatedChallenge && (
                <Card className="bg-muted/50">
                    <CardHeader><CardTitle>{generatedChallenge.title}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <p className="italic">{generatedChallenge.prompt}</p>
                        
                        <div className="space-y-2">
                            <Label>Assign to Class *</Label>
                            <Select onValueChange={setSelectedClassId} value={selectedClassId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <Button onClick={onSave} disabled={isSaving || !selectedClassId}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save Challenge
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function ChallengeCreationForm({ setOpen }: { setOpen: (open: boolean) => void }) {
    const firestore = useFirestore();
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: classes } = useCollection<Class>(useMemoFirebase(() => firestore ? collection(firestore, 'classes') : null, [firestore]));

    const form = useForm<z.infer<typeof elaWritingChallengeSchema>>({
        resolver: zodResolver(elaWritingChallengeSchema),
        defaultValues: {
            title: '',
            prompt: '',
            challengeType: 'Creative Writing',
            classId: '',
        }
    });

    async function onSubmit(values: z.infer<typeof elaWritingChallengeSchema>) {
        if (!user) return;
        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(collection(firestore, 'ela_writing_challenges'), {
                ...values,
                createdBy: user.uid,
                createdAt: serverTimestamp(),
            });
            toast({ title: 'Success', description: 'New writing challenge has been created.' });
            form.reset();
            setOpen(false);
        } catch (error) {
            console.error('Error adding challenge:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not add the challenge.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Challenge Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                 <FormField control={form.control} name="prompt" render={({ field }) => (
                    <FormItem><FormLabel>Prompt</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="challengeType" render={({ field }) => (
                    <FormItem><FormLabel>Challenge Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                            <SelectItem value="Creative Writing">Creative Writing</SelectItem>
                            <SelectItem value="Summarization">Summarization</SelectItem>
                            <SelectItem value="Essay">Essay</SelectItem>
                        </SelectContent></Select>
                    <FormMessage/></FormItem>
                )}/>
                 <FormField control={form.control} name="classId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Assign to Class</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a class"/></SelectTrigger></FormControl>
                        <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select><FormMessage/>
                    </FormItem>
                )}/>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Add Challenge</Button>
            </form>
        </Form>
    );
}
