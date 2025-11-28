
'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, addDoc, serverTimestamp, deleteDoc, doc, where } from 'firebase/firestore'; // Removed orderBy
import { 
  Atom, Trophy, BrainCircuit, Plus, Loader2, 
  Trash2, Lightbulb, CheckCircle, Database 
} from 'lucide-react';
import { format } from 'date-fns';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Student, Class } from '@/lib/types';

// --- TYPES ---
interface LabQuestion {
  id: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctAnswer: string;
  classId: string;
}

interface LabFact {
  id: string;
  text: string;
  createdAt: any;
}

// --- COMPONENT: Admin Seed Button ---
function SetupButton({ isStaff }: { isStaff: boolean }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    if (!isStaff) return null;

    const initialize = async () => {
        setLoading(true);
        try {
            // Create a dummy question to initialize collection
            await addDoc(collection(firestore, 'science_lab_questions'), {
                topic: 'General',
                difficulty: 'Beginner',
                question: 'What planet do we live on?',
                options: ['Mars', 'Earth', 'Venus', 'Jupiter'],
                correctAnswer: 'Earth',
                classId: 'global',
                createdAt: serverTimestamp()
            });
            // Create a dummy fact
            await addDoc(collection(firestore, 'science_lab_facts'), {
                text: 'Water expands when it freezes.',
                createdAt: serverTimestamp()
            });
            toast({ title: "System Initialized", description: "Collections created successfully." });
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="outline" size="sm" onClick={initialize} disabled={loading} className="border-indigo-200 text-indigo-700 bg-indigo-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Database className="h-4 w-4 mr-2"/>}
            Initialize New Database
        </Button>
    );
}

// --- COMPONENT: Add Question Form ---
function AddQuestionForm({ open, setOpen, classes }: { open: boolean, setOpen: (o: boolean) => void, classes: Class[] | undefined }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Beginner');
    const [classId, setClassId] = useState('global');
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDoc(collection(firestore, 'science_lab_questions'), {
                topic, difficulty, classId, question, options, correctAnswer, createdAt: serverTimestamp()
            });
            toast({ title: 'Saved', description: 'Question added to the Lab.' });
            setOpen(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Add Lab Question</DialogTitle></DialogHeader>
                <form onSubmit={handleSave} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Topic</Label>
                            <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Physics" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Difficulty</Label>
                            <Select value={difficulty} onValueChange={setDifficulty}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Target Class</Label>
                        <Select value={classId} onValueChange={setClassId}>
                            <SelectTrigger><SelectValue placeholder="All Classes" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="global">All Classes (Global)</SelectItem>
                                {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Question</Label>
                        <Textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="Enter question..." required />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {options.map((opt, i) => (
                            <Input key={i} value={opt} onChange={e => {
                                const newOpts = [...options]; newOpts[i] = e.target.value; setOptions(newOpts);
                            }} placeholder={`Option ${i+1}`} required />
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label>Correct Answer (Exact Match)</Label>
                        <Input value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} placeholder="Paste correct option here" required />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700">Save Question</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// --- MAIN PAGE ---
export default function ScienceLabPage() {
  const { user, isUserLoading } = useUser();
  const { role, isRoleLoading } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('explore');
  
  // Filters
  const [filterTopic, setFilterTopic] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');

  const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role);

  // 1. Fetch Questions (SAFE MODE: No orderBy)
  const questionsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'science_lab_questions')) : null, [firestore]);
  const { data: rawQuestions, isLoading: qLoading } = useCollection<LabQuestion>(questionsQuery);

  // 2. Fetch Facts (SAFE MODE: No orderBy)
  const factsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'science_lab_facts')) : null, [firestore]);
  const { data: rawFacts } = useCollection<LabFact>(factsQuery);

  // 3. Fetch Classes
  const { data: classes } = useCollection<Class>(
    useMemoFirebase(() => (isStaff && firestore) ? query(collection(firestore, 'classes')) : null, [isStaff, firestore])
  );

  // Get Student Class ID
  const { data: studentData, isLoading: sLoading } = useCollection<Student>(
    useMemoFirebase(() => (role === 'Student' && user) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [role, user])
  );
  const studentClassId = studentData?.[0]?.classId;

  // 2. Data Processing (Client-Side)
  const latestFact = useMemo(() => {
      if(!rawFacts || rawFacts.length === 0) return null;
      // Sort by date manually to avoid index errors
      return rawFacts.sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0))[0];
  }, [rawFacts]);

  const filteredQuestions = useMemo(() => {
      if(!rawQuestions) return [];
      let list = rawQuestions;

      // Filter by Class (If Student)
      if (role === 'Student') {
          list = list.filter(q => q.classId === 'global' || q.classId === studentClassId);
      }

      // Filter by UI
      if(filterTopic !== 'All') list = list.filter(q => q.topic === filterTopic);
      if(filterDiff !== 'All') list = list.filter(q => q.difficulty === filterDiff);

      return list;
  }, [rawQuestions, role, studentClassId, filterTopic, filterDiff]);

  const uniqueTopics = useMemo(() => {
      if(!rawQuestions) return [];
      return Array.from(new Set(rawQuestions.map(q => q.topic))).sort();
  }, [rawQuestions]);

  const handleDelete = async (id: string) => {
      if(confirm('Delete this question?')) {
          await deleteDoc(doc(firestore, 'science_lab_questions', id));
          toast({ title: 'Deleted' });
      }
  };

  const isLoading = isUserLoading || isRoleLoading || qLoading;

  return (
    <div className="space-y-6 p-6 min-h-screen bg-slate-50/50">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                <Atom className="h-8 w-8 text-indigo-600"/> The Science Lab
            </h1>
            <p className="text-slate-500">Explore, Experiment, and Excel.</p>
        </div>
        <div className="flex gap-2">
            <SetupButton isStaff={isStaff} />
            {isStaff && (
                <Button onClick={() => setIsFormOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="mr-2 h-4 w-4"/> Add Question
                </Button>
            )}
        </div>
      </div>

      {/* FACT CARD */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6 flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                  <Lightbulb className="h-6 w-6 text-yellow-300" />
              </div>
              <div>
                  <h3 className="font-bold text-indigo-100 uppercase text-xs tracking-wider mb-1">Did you know?</h3>
                  <p className="text-lg font-medium leading-relaxed">
                      {latestFact ? latestFact.text : "Science is the poetry of reality."}
                  </p>
              </div>
          </CardContent>
      </Card>

      {/* TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="explore">Question Bank</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="mt-6 space-y-6">
            
            {/* FILTERS */}
            <div className="flex gap-4">
                <Select value={filterTopic} onValueChange={setFilterTopic}>
                    <SelectTrigger className="w-[180px] bg-white"><SelectValue placeholder="Topic" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Topics</SelectItem>
                        {uniqueTopics.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={filterDiff} onValueChange={setFilterDiff}>
                    <SelectTrigger className="w-[180px] bg-white"><SelectValue placeholder="Difficulty" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Levels</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* LOADING / EMPTY STATES */}
            {isLoading ? (
                <div className="text-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mx-auto mb-4"/>
                    <p className="text-slate-500">Loading the Lab...</p>
                </div>
            ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-xl">
                    <BrainCircuit className="h-12 w-12 text-slate-300 mx-auto mb-4"/>
                    <p className="text-slate-500">No questions found matching your filters.</p>
                    {isStaff && <Button variant="link" onClick={() => setIsFormOpen(true)}>Create the first one</Button>}
                </div>
            ) : (
                /* QUESTION GRID */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredQuestions.map((q) => (
                        <Card key={q.id} className="hover:shadow-md transition-shadow border-t-4 border-t-indigo-400">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="text-xs">{q.topic}</Badge>
                                    {isStaff && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDelete(q.id)}><Trash2 className="h-4 w-4 text-red-400"/></Button>}
                                </div>
                                <CardTitle className="text-base mt-2 line-clamp-2 leading-snug">{q.question}</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <p className="text-xs text-slate-400 mb-4">{q.difficulty} • {q.classId === 'global' ? 'Global' : 'Class Specific'}</p>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Button className="w-full bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200">
                                    Attempt Question
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </TabsContent>

        <TabsContent value="leaderboard">
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-400"/>
                    <p>Leaderboard coming soon to Science Lab 2.0!</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

      {/* MODAL */}
      <AddQuestionForm 
        open={isFormOpen} 
        setOpen={setIsFormOpen} 
        classes={classes} 
      />
    </div>
  );
}
