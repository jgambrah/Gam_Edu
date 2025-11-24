

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpenCheck, Edit, FileText, ChevronRight, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/context/role-context';
import { GrammarPractice } from './grammar-practice';
import { cn } from '@/lib/utils';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, addDoc } from 'firebase/firestore';
import { ElaGrammarDrill, elaGrammarDrillSchema, ElaReadingPassage, elaReadingPassageSchema } from '@/lib/types';
import { useState } from 'react';
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
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

function ReadingPracticeTab() {
  const firestore = useFirestore();
  const passagesQuery = useMemoFirebase(() => query(collection(firestore, 'ela_reading_passages')), [firestore]);
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
            <p className="text-center text-muted-foreground py-12">No reading passages are available yet.</p>
          )}
      </CardContent>
    </Card>
  );
}

function WritingSubmissionTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Writing & Summarizing Challenges</CardTitle>
        <CardDescription>
          Submit your written work for feedback and improvement. (Coming Soon)
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground py-12">
        <p>Writing prompts and submission forms will be available here.</p>
      </CardContent>
    </Card>
  );
}

function PassageCreationForm({ setOpen }: { setOpen: (open: boolean) => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof elaReadingPassageSchema>>({
        resolver: zodResolver(elaReadingPassageSchema),
        defaultValues: { title: '', passage_text: '', reading_level: '', question_set: [{ question: '', type: 'MCQ', options: ['', '', ''], correct_answer_key: '' }] }
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
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ question: '', type: 'MCQ', options: [], correct_answer_key: '' })}>Add Question</Button>
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

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Reading Passage Bank</CardTitle>
                    <CardDescription>Manage reading passages and their comprehension questions.</CardDescription>
                </div>
                 <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4"/>New Passage</Button></DialogTrigger>
                    <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>Create New Reading Passage</DialogTitle></DialogHeader><PassageCreationForm setOpen={setIsFormOpen}/></DialogContent>
                </Dialog>
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

function DrillCreationForm({ setOpen }: { setOpen: (open: boolean) => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof elaGrammarDrillSchema>>({
        resolver: zodResolver(elaGrammarDrillSchema),
        defaultValues: {
            type: 'MCQ',
            options: ['', '', '', ''],
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
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="topic" render={({ field }) => (
                        <FormItem><FormLabel>Topic</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a Topic"/></SelectTrigger></FormControl><SelectContent><SelectItem value="Punctuation">Punctuation</SelectItem><SelectItem value="Verbs">Verbs</SelectItem><SelectItem value="Nouns">Nouns</SelectItem><SelectItem value="Adjectives">Adjectives</SelectItem></SelectContent></Select><FormMessage/></FormItem>
                    )}/>
                    <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="MCQ">Multiple Choice</SelectItem><SelectItem value="Drag and Drop" disabled>Drag and Drop (soon)</SelectItem></SelectContent></Select><FormMessage/></FormItem>
                    )}/>
                </div>
                <FormField control={form.control} name="question_prompt" render={({ field }) => (
                    <FormItem><FormLabel>Question Prompt/Text</FormLabel><FormControl><Textarea {...field}/></FormControl><FormMessage/></FormItem>
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

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Grammar Drill Bank</CardTitle>
                    <CardDescription>Manage the collection of grammar drills.</CardDescription>
                </div>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4"/>New Drill</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Create New Grammar Drill</DialogTitle><DialogDescription>Add a new question to the drill bank.</DialogDescription></DialogHeader>
                        <DrillCreationForm setOpen={setIsFormOpen}/>
                    </DialogContent>
                </Dialog>
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
    )
}

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
        <TabsList className={cn("grid w-full", isTeacherOrAdmin ? "grid-cols-5" : "grid-cols-3")}>
          <TabsTrigger value="grammar">
            <Edit className="mr-2 h-4 w-4" />
            Grammar Practice
          </TabsTrigger>
          <TabsTrigger value="reading">
            <FileText className="mr-2 h-4 w-4" />
            Reading Practice
          </TabsTrigger>
          <TabsTrigger value="writing">
            <ChevronRight className="mr-2 h-4 w-4" />
            Writing Submissions
          </TabsTrigger>
          {isTeacherOrAdmin && <TabsTrigger value="manage-drills">Manage Drills</TabsTrigger>}
          {isTeacherOrAdmin && <TabsTrigger value="manage-passages">Manage Passages</TabsTrigger>}
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
      </Tabs>
    </div>
  );
}
