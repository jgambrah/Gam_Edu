'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, writeBatch, doc, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { generatePracticeProblems, GeneratePracticeProblemsOutput } from '@/ai/flows/generate-practice-problems-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Class } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { getAuth } from 'firebase/auth';
import { checkAndSpendCredits } from '@/app/actions/credits';
import { useCurrentSchool } from '@/hooks/use-current-school';

type Subject = 'Math' | 'Science' | 'ELA Grammar';

export function AiProblemGenerator({ subject, setOpen }: { subject: Subject; setOpen: (open: boolean) => void }) {
  const { user: hookUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedProblems, setGeneratedProblems] = useState<GeneratePracticeProblemsOutput | null>(null);
  
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [numQuestions, setNumQuestions] = useState(5);
  const [classId, setClassId] = useState('');

  const { data: classes } = useCollection<Class>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));

  async function onGenerate() {
    if (!topic) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please enter a topic.' });
        return;
    }
     if (!schoolId) {
      toast({ variant: 'destructive', title: 'Error', description: 'School ID not found.' });
      return;
    }

    // --- CREDIT CHECK ---
    const creditResult = await checkAndSpendCredits(schoolId, 5); // Cost: 5 credits
    if (!creditResult.success) {
      toast({ variant: 'destructive', title: 'Insufficient AI Credits', description: creditResult.error || 'Please upgrade your plan.' });
      return;
    }
    // --- END CREDIT CHECK ---

    setIsGenerating(true);
    setGeneratedProblems(null);
    toast({ title: 'Generating Problems...', description: 'Please wait while the AI creates questions.' });

    try {
      const result = await generatePracticeProblems({
        subject,
        topic,
        numQuestions,
        difficulty,
      });
      setGeneratedProblems(result);
      toast({ title: 'Problems Generated!', description: 'Review the questions and select a class to save.' });
    } catch (error) {
      console.error('Error generating problems:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'An AI error occurred while creating the problems.' });
    } finally {
      setIsGenerating(false);
    }
  }

  async function onSave() {
    const auth = getAuth();
    const currentUser = auth.currentUser || hookUser;

    if (!generatedProblems) {
        toast({ variant: 'destructive', title: 'Error', description: 'No problems have been generated.' });
        return;
    }
    if (!classId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a class before saving.'});
        return;
    }
    if (!currentUser || !schoolId || !firestore) {
        toast({ variant: 'destructive', title: 'Logged Out', description: 'You seem to be logged out or missing school data. Please refresh the page.' });
        return;
    }
    setIsSaving(true);
    
    const collectionNameMap = {
        'Math': 'math_problems',
        'Science': 'science_problems',
        'ELA Grammar': 'ela_grammar_drills',
    };
    const collectionName = collectionNameMap[subject];
    const problemsCollection = collection(firestore!, collectionName);

    const batch = writeBatch(firestore!);

    generatedProblems.problems.forEach(problem => {
        const problemRef = doc(problemsCollection);
        let data: any = {
            ...problem,
            topic,
            difficulty,
            classId: classId,
            schoolId: schoolId, // SAAS FIX
        };
        if (subject === 'ELA Grammar') {
            data.type = 'MCQ';
            data.question_prompt = problem.question_text;
        }
        batch.set(problemRef, data);
    });
    
    batch.commit()
      .then(() => {
        toast({ title: 'Success!', description: `${generatedProblems.problems.length} problems have been saved.`});
        setOpen(false);
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: problemsCollection.path,
            operation: 'create', // Batch write is a 'write' operation which includes create
            requestResourceData: generatedProblems.problems,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSaving(false);
      });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-5 p-5 bg-slate-950/40 border border-slate-900 rounded-2xl text-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-wider text-slate-400">Topic Area</Label>
              <Input 
                placeholder="e.g., Algebra" 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                className="bg-slate-950 border-slate-900 text-slate-100 placeholder:text-slate-600 focus-visible:ring-indigo-500 rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-wider text-slate-400">Difficulty Scale</Label>
              <Select onValueChange={(val: 'Easy' | 'Medium' | 'Hard') => setDifficulty(val)} value={difficulty}>
                <SelectTrigger className="bg-slate-950 border-slate-900 text-slate-100 focus-visible:ring-indigo-500 rounded-xl h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-slate-900 text-slate-200">
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-wider text-slate-400"># of Questions</Label>
              <Input 
                type="number" 
                min={1} 
                max={10} 
                value={numQuestions} 
                onChange={(e) => setNumQuestions(Number(e.target.value))} 
                className="bg-slate-950 border-slate-900 text-slate-100 focus-visible:ring-indigo-500 rounded-xl h-11"
              />
            </div>
             <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-wider text-slate-400">Assign to Class Matrix</Label>
              <Select onValueChange={setClassId} value={classId}>
                  <SelectTrigger className="bg-slate-950 border-slate-900 text-slate-100 focus-visible:ring-indigo-500 rounded-xl h-11">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950 border-slate-900 text-slate-200">{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            type="button" 
            onClick={onGenerate} 
            disabled={isGenerating}
            className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold h-11 w-full rounded-xl mt-2 shadow-lg shadow-indigo-500/20 transition-all duration-300"
          >
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate Problems (-5 Credits)
          </Button>
      </div>

        {generatedProblems && generatedProblems.problems.length > 0 && (
            <Card className="bg-slate-950 border border-slate-900 text-slate-100 rounded-2xl overflow-hidden mt-4 shadow-xl">
            <CardHeader className="border-b border-slate-900/60 p-5">
                <CardTitle className="text-lg font-black text-white">Generated Problems</CardTitle>
                <CardDescription className="text-slate-400 text-xs mt-1">Review the generated questions. Select a class and click "Save Problems" to add them to the problem bank.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
                <ScrollArea className="h-60 w-full pr-4">
                    <Accordion type="single" collapsible className="w-full">
                        {generatedProblems.problems.map((p, index) => (
                        <AccordionItem value={`item-${index}`} key={index} className="border-b border-slate-900/60">
                            <AccordionTrigger className="text-sm font-bold text-slate-350 hover:text-white transition-colors py-3 text-left">Question {index + 1}: {p.question_text}</AccordionTrigger>
                            <AccordionContent className="text-slate-300 py-2">
                              <ul className="space-y-2 list-disc pl-5">
                                  {p.options.map((opt, i) => (
                                  <li key={i} className={opt === p.correct_answer ? 'font-bold text-emerald-400' : 'text-slate-400'}>
                                      {opt}
                                  </li>
                                  ))}
                              </ul>
                            </AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                </ScrollArea>
                <Button 
                  onClick={onSave} 
                  disabled={isSaving || !classId}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold h-11 w-full rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                >
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Problems
                </Button>
            </CardContent>
            </Card>
        )}
    </div>
  );
}
