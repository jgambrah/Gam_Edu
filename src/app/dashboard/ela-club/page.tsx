

'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpenCheck, Edit, FileText, ChevronRight, PlusCircle, PenSquare, Wand2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/context/role-context';
import { GrammarPractice } from './grammar-practice';
import { cn } from '@/lib/utils';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, addDoc, where, serverTimestamp, getDocs, doc } from 'firebase/firestore';
import { ElaGrammarDrill, elaGrammarDrillSchema, ElaReadingPassage, elaReadingPassageSchema, ElaWritingChallenge, elaWritingChallengeSchema, ElaUserSubmission, Class, Student } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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

// --- Reading Practice Tab ---
function ReadingPracticeTab() {
  const firestore = useFirestore();
  const { user } = useAuth();
  const { data: studentData } = useCollection<Student>(
    useMemoFirebase(() => user ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [firestore, user])
  );
  const studentClassId = studentData?.[0]?.classId;

  const passagesQuery = useMemoFirebase(() => 
    studentClassId ? query(collection(firestore, 'ela_reading_passages'), where('classId', '==', studentClassId)) : null, 
    [firestore, studentClassId]
  );
  const { data: passages, isLoading } = useCollection<ElaReadingPassage>(passagesQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading Comprehension Practice</CardTitle>
        <CardDescription>Select a passage to read and answer comprehension questions.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-40 w-full" /> :
          passages && passages.length > 0 ? (
            <div className="space-y-4">
              {passages.map(passage => (
                <Card key={passage.id}>
                  <CardHeader>
                    <CardTitle>{passage.title}</CardTitle>
                    <CardDescription>Reading Level: {passage.reading_level}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link href={`/dashboard/ela-club/reading/${passage.id}`}>Start Reading</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No reading passages are available for your class yet.</p>
          )}
      </CardContent>
    </Card>
  );
}

// --- Writing Submission Tab ---

function StudentSubmissionForm({ challenge, setOpen }: { challenge: ElaWritingChallenge, setOpen: (open: boolean) => void }) {
    const firestore = useFirestore();
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<{ submission_text: string }>({
        defaultValues: { submission_text: '' },
        resolver: zodResolver(z.object({ submission_text: z.string().min(1, "Submission cannot be empty.") }))
    });

    async function onSubmit(values: { submission_text: string }) {
        if (!user) return;
        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(collection(firestore, 'ela_user_submissions'), {
                ...values,
                userId: user.uid,
                challenge_id: challenge.id,
                challenge_title: challenge.title,
                date_submitted: serverTimestamp(),
                status: 'Submitted',
            });
            toast({ title: 'Success', description: 'Your submission has been received.' });
            setOpen(false);
        } catch (error) {
            console.error('Error submitting work:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not submit your work.' });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="submission_text" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Response</FormLabel>
                        <FormControl><Textarea {...field} rows={10} placeholder="Type your response here..." /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit</Button>
            </form>
        </Form>
    );
}

function WritingSubmissionTab() {
    const firestore = useFirestore();
    const { user } = useAuth();
    const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});
    
    const { data: studentData, isLoading: isLoadingStudent } = useCollection<Student>(
        useMemoFirebase(() => user ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [firestore, user])
    );
    const studentClassId = studentData?.[0]?.classId;

    const { data: challenges, isLoading: isLoadingChallenges } = useCollection<ElaWritingChallenge>(
        useMemoFirebase(() => studentClassId ? query(collection(firestore, 'ela_writing_challenges'), where('classId', '==', studentClassId)) : null, [firestore, studentClassId])
    );
    const { data: submissions, isLoading: isLoadingSubmissions } = useCollection<ElaUserSubmission>(
        useMemoFirebase(() => user ? query(collection(firestore, 'ela_user_submissions'), where('userId', '==', user.uid)) : null, [firestore, user])
    );

    const isLoading = isLoadingChallenges || isLoadingSubmissions || isLoadingStudent;
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Writing & Summarizing Challenges</CardTitle>
                <CardDescription>Submit your written work for feedback and improvement.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-40 w-full"/> : (
                    <div className="space-y-4">
                        {challenges?.map(challenge => {
                            const submission = submissions?.find(s => s.challenge_id === challenge.id);
                            return (
                                <Card key={challenge.id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold">{challenge.title}</h4>
                                        <p className="text-sm text-muted-foreground">{challenge.prompt}</p>
                                        {submission && (
                                            <div className="text-xs mt-2">
                                                <Badge variant={submission.status === 'Graded' ? 'default' : 'secondary'}>{submission.status}</Badge>
                                                {submission.status === 'Graded' && <span className="ml-2">Score: {submission.teacher_score}</span>}
                                            </div>
                                        )}
                                    </div>
                                    <Dialog open={openDialogs[challenge.id] || false} onOpenChange={(isOpen) => setOpenDialogs(prev => ({ ...prev, [challenge.id]: isOpen }))}>
                                        <DialogTrigger asChild>
                                            <Button disabled={!!submission}>{submission ? 'Submitted' : 'Submit Work'}</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>{challenge.title}</DialogTitle>
                                                <DialogDescription>{challenge.prompt}</DialogDescription>
                                            </DialogHeader>
                                            <StudentSubmissionForm challenge={challenge} setOpen={() => setOpenDialogs(prev => ({ ...prev, [challenge.id]: false }))}/>
                                        </DialogContent>
                                    </Dialog>
                                </Card>
                            );
                        })}
                         {challenges?.length === 0 && <p className="text-center py-8 text-muted-foreground">No writing challenges have been assigned to your class yet.</p>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// --- Teacher/Admin Management Components ---
function AiPassageGenerator({ setOpen }: { setOpen: (open: boolean) => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedPassage, setGeneratedPassage] = useState<z.infer<typeof elaReadingPassageSchema> | null>(null);
  
  const [topic, setTopic] = useState('');
  const [readingLevel, setReadingLevel] = useState('Grade 9');
  const [numQuestions, setNumQuestions] = useState(3);
  const [classId, setClassId] = useState('');

  const { data: classes } = useCollection<Class>(useMemoFirebase(() => collection(firestore, 'classes'), [firestore]));

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
    if (!generatedPassage || !classId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a class before saving.' });
      return;
    }
    setIsSaving(true);
    try {
      await addDocumentNonBlocking(collection(firestore, 'ela_reading_passages'), {
        ...generatedPassage,
        classId: classId,
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <Select onValueChange={setClassId} value={classId}>
                <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button onClick={onSave} disabled={isSaving || !classId}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save Passage
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PassageCreationForm({ setOpen }: { setOpen: (open: boolean) => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { data: classes } = useCollection<Class>(useMemoFirebase(() => collection(firestore, 'classes'), [firestore]));

    const form = useForm<z.infer<typeof elaReadingPassageSchema>>({
        resolver: zodResolver(elaReadingPassageSchema),
        defaultValues: { title: '', passage_text: '', reading_level: '', classId: '', question_set: [{ question: '', type: 'Short Answer', options: [], correct_answer_key: '' }] }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "question_set"
    });

    async function onSubmit(values: z.infer<typeof elaReadingPassageSchema>) {
        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(collection(firestore, 'ela_reading_passages'), values);
            toast({ title: 'Success', description: 'New reading passage has been added.' });
            form.reset();
            setOpen(false);
        } catch (error) {
            console.error('Error adding passage:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not add the passage.' });
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
                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Passage</Button>
            </form>
        </Form>
    );
}

function ManagePassages() {
    const firestore = useFirestore();
    const { data: passages, isLoading } = useCollection<ElaReadingPassage>(useMemoFirebase(() => query(collection(firestore, 'ela_reading_passages')), [firestore]));
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAiFormOpen, setIsAiFormOpen] = useState(false);

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
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4" />New Passage</Button></DialogTrigger>
                        <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>Create New Reading Passage</DialogTitle></DialogHeader><PassageCreationForm setOpen={setIsFormOpen} /></DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                 {isLoading ? <Skeleton className="h-40 w-full" /> : (
                <Table>
                    <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Reading Level</TableHead><TableHead># of Questions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {passages?.map(p => (
                            <TableRow key={p.id}>
                                <TableCell>{p.title}</TableCell>
                                <TableCell>{p.reading_level}</TableCell>
                                <TableCell>{p.question_set.length}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>
    );
}

function AiChallengeGenerator({ setOpen }: { setOpen: (open: boolean) => void }) {
    const firestore = useFirestore();
    const { user: hookUser } = useAuth(); // Renamed to hookUser to avoid confusion
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // --- 1. NEW: Dedicated State for Class ID (Bypassing Form Logic) ---
    const [selectedClassId, setSelectedClassId] = useState<string>("");

    const [generatedChallenge, setGeneratedChallenge] = useState<{
        title: string;
        prompt: string;
        challengeType: 'Creative Writing' | 'Summarization' | 'Essay';
    } | null>(null);

    const { data: classes } = useCollection<Class>(
        useMemoFirebase(() => collection(firestore, 'classes'), [firestore])
    );

    const form = useForm({
        defaultValues: { topic: '', challengeType: 'Creative Writing' as const }
    });

    // Generate Function
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

    // Save Function
    async function onSave() {
        // --- 2. THE DIRECT AUTH FIX ---
        // Instead of relying on the hook, we ask Firebase directly: "Who is logged in right now?"
        const auth = getAuth();
        const currentUser = auth.currentUser || hookUser; 

        // 3. DEBUGGING
        console.log("--- SAVE ATTEMPT ---");
        console.log("Class ID:", selectedClassId);
        console.log("Direct Firebase User:", auth.currentUser);
        console.log("React Hook User:", hookUser);

        if (!generatedChallenge) {
             toast({ variant: 'destructive', title: 'Error', description: 'No challenge generated.' });
             return;
        }

        if (!selectedClassId) {
             toast({ variant: 'destructive', title: 'Error', description: 'Please select a class.' });
             return;
        }

        if (!currentUser) {
             // If THIS hits, then the browser truly has no session token.
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
                createdBy: currentUser.uid, // <--- Use the Direct User UID
                createdAt: serverTimestamp(),
            });
            toast({ title: 'Success!', description: 'Challenge saved.' });
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
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        
                        <div className="space-y-2">
                            <Label>Assign to Class</Label>
                            <Select 
                                value={selectedClassId} 
                                onValueChange={(val) => setSelectedClassId(val)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes?.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedClassId && <p className="text-xs text-green-600 font-bold">Selected: {classes?.find(c => c.id === selectedClassId)?.name}</p>}
                        </div>

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
                        
                        <Button onClick={onSave} disabled={isSaving}>
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

    const { data: classes } = useCollection<Class>(useMemoFirebase(() => collection(firestore, 'classes'), [firestore]));

    const form = useForm<z.infer<typeof elaWritingChallengeSchema>>({
        resolver: zodResolver(elaWritingChallengeSchema),
        defaultValues: {
            title: '',
            prompt: '',
            challengeType: 'Creative Writing',
            classId: '',
        },
    });

    async function onSubmit(values: z.infer<typeof elaWritingChallengeSchema>) {
        if (!user) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(firestore, 'ela_writing_challenges'), {
                ...values,
                createdBy: user.uid,
                createdAt: serverTimestamp(),
            });
            toast({ title: 'Success', description: 'New writing challenge has been created.' });
            form.reset();
            setOpen(false);
        } catch (error) {
            console.error('Error creating challenge:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not create the challenge.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="prompt" render={({ field }) => (
                    <FormItem><FormLabel>Prompt</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="challengeType" render={({ field }) => (
                    <FormItem><FormLabel>Challenge Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="Creative Writing">Creative Writing</SelectItem>
                        <SelectItem value="Summarization">Summarization</SelectItem>
                        <SelectItem value="Essay">Essay</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="classId" render={({ field }) => (
                    <FormItem><FormLabel>Assign to Class</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger></FormControl>
                        <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select><FormMessage /></FormItem>
                )}/>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Challenge</Button>
            </form>
        </Form>
    );
}

function ManageWritingChallenges() {
    const firestore = useFirestore();
    const { data: challenges, isLoading: isLoadingChallenges } = useCollection<ElaWritingChallenge>(useMemoFirebase(() => query(collection(firestore, 'ela_writing_challenges')), [firestore]));
    const { data: submissions, isLoading: isLoadingSubmissions } = useCollection<ElaUserSubmission>(useMemoFirebase(() => query(collection(firestore, 'ela_user_submissions')), [firestore]));
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

function DrillCreationForm({ setOpen }: { setOpen: (open: boolean) => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: classes } = useCollection<Class>(useMemoFirebase(() => collection(firestore, 'classes'), [firestore]));

    const form = useForm<z.infer<typeof elaGrammarDrillSchema>>({
        resolver: zodResolver(elaGrammarDrillSchema),
        defaultValues: {
            topic: '',
            type: 'MCQ',
            question_prompt: '',
            options: ['', '', '', ''],
            classId: '',
        }
    });

    async function onSubmit(values: z.infer<typeof elaGrammarDrillSchema>) {
        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(collection(firestore, 'ela_grammar_drills'), values);
            toast({ title: 'Success', description: 'New grammar drill has been added.' });
            form.reset();
            setOpen(false);
        } catch (error) {
            console.error('Error adding drill:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not add the drill.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField control={form.control} name="classId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Assign to Class</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a class"/></SelectTrigger></FormControl>
                        <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select><FormMessage/>
                    </FormItem>
                )}/>
                <FormField control={form.control} name="topic" render={({ field }) => (
                    <FormItem><FormLabel>Topic</FormLabel><FormControl><Input placeholder="e.g. Punctuation" {...field}/></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="question_prompt" render={({ field }) => (
                    <FormItem><FormLabel>Question Prompt</FormLabel><FormControl><Textarea {...field}/></FormControl><FormMessage/></FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                    {form.getValues('options')?.map((_, index) => (
                        <FormField key={index} control={form.control} name={`options.${index}`} render={({ field }) => (
                            <FormItem><FormLabel>Option {index + 1}</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
                        )}/>
                    ))}
                </div>
                 <FormField control={form.control} name="correct_answer" render={({ field }) => (
                    <FormItem><FormLabel>Correct Answer</FormLabel><FormControl><Input {...field}/></FormControl><FormDescription>Must exactly match one of the options.</FormDescription><FormMessage/></FormItem>
                )}/>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Add Drill</Button>
            </form>
        </Form>
    );
}

function ManageDrills() {
    const firestore = useFirestore();
    const { data: drills, isLoading } = useCollection<ElaGrammarDrill>(useMemoFirebase(() => query(collection(firestore, 'ela_grammar_drills')), [firestore]));
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAiFormOpen, setIsAiFormOpen] = useState(false);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Grammar Drill Bank</CardTitle>
                    <CardDescription>Manage grammar and mechanics practice questions.</CardDescription>
                </div>
                 <div className="flex gap-2">
                    <Dialog open={isAiFormOpen} onOpenChange={setIsAiFormOpen}>
                        <DialogTrigger asChild><Button variant="outline"><Wand2 className="mr-2 h-4"/>Generate with AI</Button></DialogTrigger>
                        <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>AI Problem Generator</DialogTitle><DialogDescription>Generate multiple-choice questions for any grammar topic.</DialogDescription></DialogHeader><AiProblemGenerator subject="ELA Grammar" setOpen={setIsAiFormOpen} /></DialogContent>
                    </Dialog>
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4"/>New Drill</Button></DialogTrigger>
                        <DialogContent><DialogHeader><DialogTitle>Create New Grammar Drill</DialogTitle></DialogHeader><DrillCreationForm setOpen={setIsFormOpen}/></DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-40 w-full" /> : (
                <Table>
                    <TableHeader><TableRow><TableHead>Topic</TableHead><TableHead>Type</TableHead><TableHead>Question</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {drills?.map(p => (
                            <TableRow key={p.id}>
                                <TableCell>{p.topic}</TableCell>
                                <TableCell>{p.type}</TableCell>
                                <TableCell className="max-w-md truncate">{p.question_prompt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
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
