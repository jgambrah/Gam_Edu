
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, where, setDoc, increment, limit } from 'firebase/firestore';
import { 
  FlaskConical, Trophy, PencilRuler, Plus, Loader2, 
  Trash2, Lightbulb, CheckCircle2, Wand2, XCircle, FolderOpen, Play, BookOpen, Microscope, Sparkles 
} from 'lucide-react';
import { format } from 'date-fns';
import { generateScienceLessonAction } from '@/ai/flows/generate-science-lesson';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Class, Student, ScienceLeaderboardEntry, DailyFact } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// --- TYPES ---
interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuestionSet {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  grade: string;
  questions: Question[];
  classId: string;
  createdAt: any;
}

interface LessonCard {
    id?: string;
    title: string;
    explanation: string;
    analogy: string;
    keyTerms: string[];
    quizQuestion: string;
    quizAnswer: string;
    timestamp?: any;
}

// --- NEW COMPONENT: SCIENCE EXPLORER (Self-Paced) ---
function ScienceExplorerTab() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [topic, setTopic] = useState('');
    const [isLearning, setIsLearning] = useState(false);
    const [currentLesson, setCurrentLesson] = useState<LessonCard | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    // Fetch History
    const historyQuery = useMemoFirebase(() => 
        (user && firestore) ? query(collection(firestore, 'science_learning_history'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'), limit(10)) : null,
    [user, firestore]);
    const { data: history, isLoading: historyLoading } = useCollection<LessonCard>(historyQuery);

    const handleLearn = async () => {
        if (!topic.trim()) return;
        setIsLearning(true);
        setShowAnswer(false);
        setCurrentLesson(null);

        try {
            // Default grade to JHS 1 if not specified, could be dynamic
            const result = await generateScienceLessonAction({ topic, grade: 'JHS 1' });
            
            if (result.success && result.data) {
                setCurrentLesson(result.data);
                // Save to history
                if(user && firestore) {
                    await addDoc(collection(firestore, 'science_learning_history'), {
                        ...result.data,
                        userId: user.uid,
                        timestamp: serverTimestamp()
                    });
                }
            } else {
                toast({ variant: 'destructive', title: "AI Error", description: "Could not generate lesson." });
            }
        } catch (e) {
             toast({ variant: 'destructive', title: "Error", description: "Something went wrong." });
        } finally {
            setIsLearning(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Input & Active Lesson */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                    <CardHeader>
                        <CardTitle className="text-blue-800 flex items-center gap-2"><Microscope className="h-5 w-5"/> What do you want to learn today?</CardTitle>
                        <CardDescription>Type any science topic (e.g. "Volcanoes", "Atoms", "The Heart")</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input 
                                value={topic} 
                                onChange={(e) => setTopic(e.target.value)} 
                                placeholder="Enter a topic..." 
                                className="bg-white"
                                onKeyDown={(e) => e.key === 'Enter' && handleLearn()}
                            />
                            <Button onClick={handleLearn} disabled={isLearning || !topic} className="bg-blue-600 hover:bg-blue-700 w-32">
                                {isLearning ? <Loader2 className="h-4 w-4 animate-spin"/> : <><Sparkles className="h-4 w-4 mr-2"/> Learn</>}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {currentLesson && (
                    <Card className="border-t-4 border-t-blue-500 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardHeader>
                            <CardTitle className="text-2xl">{currentLesson.title}</CardTitle>
                            <CardDescription>Micro-Lesson</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-blue-700 mb-1">The Concept</h4>
                                <p className="text-slate-700 leading-relaxed">{currentLesson.explanation}</p>
                            </div>
                            
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                <h4 className="font-semibold text-amber-800 mb-1 flex items-center gap-2"><Lightbulb className="h-4 w-4"/> Think of it like...</h4>
                                <p className="text-slate-700 italic">"{currentLesson.analogy}"</p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-slate-700 mb-2">Key Terms</h4>
                                <div className="flex flex-wrap gap-2">
                                    {currentLesson.keyTerms.map((term, i) => (
                                        <Badge key={i} variant="secondary" className="bg-slate-100">{term}</Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <h4 className="font-semibold text-slate-700 mb-2">Quick Check</h4>
                                <p className="mb-3">{currentLesson.quizQuestion}</p>
                                {showAnswer ? (
                                    <div className="p-3 bg-green-50 text-green-800 rounded border border-green-200">
                                        <strong>Answer:</strong> {currentLesson.quizAnswer}
                                    </div>
                                ) : (
                                    <Button variant="outline" onClick={() => setShowAnswer(true)}>Reveal Answer</Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Right: History */}
            <div>
                 <Card className="h-full max-h-[600px] flex flex-col">
                    <CardHeader className="pb-3"><CardTitle className="text-md">Your Learning History</CardTitle></CardHeader>
                    <CardContent className="p-0 flex-1 min-h-0 overflow-hidden">
                        <div className="h-full overflow-y-auto p-4 space-y-3">
                            {historyLoading && <Skeleton className="h-20 w-full"/>}
                            {!historyLoading && history?.length === 0 && <p className="text-sm text-muted-foreground text-center">No lessons yet.</p>}
                            {history?.map((item) => (
                                <div key={item.id} onClick={() => { setCurrentLesson(item); setShowAnswer(false); }} className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors text-sm">
                                    <p className="font-semibold text-slate-800">{item.title}</p>
                                    <p className="text-xs text-muted-foreground truncate">{item.analogy}</p>
                                    <p className="text-[10px] text-slate-400 mt-1 text-right">
                                        {item.timestamp?.toDate ? format(item.timestamp.toDate(), 'MMM d, h:mm a') : 'Just now'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}

// --- MAIN PAGE COMPONENT ---
export default function ScienceClubPageFresh() {
  const router = useRouter();
  const firestore = useFirestore();
  const { role, isRoleLoading } = useRole();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [isAiFormOpen, setIsAiFormOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState('learn'); // Default to the new tab

  const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role);

  return (
    <div className="space-y-6 p-6 min-h-screen bg-slate-50/50">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                <Atom className="h-8 w-8 text-emerald-600"/> Science Lab
            </h1>
            <p className="text-slate-500">Learn, practice, and compete.</p>
        </div>
        <div className="flex gap-2">
            {isStaff && (
                <Button variant="outline" onClick={() => setIsAiOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white shadow-md">
                    <Wand2 className="mr-2 h-4 w-4"/> AI Generate Quiz
                </Button>
            )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="learn">Science Explorer</TabsTrigger>
            <TabsTrigger value="practice">Quiz Library</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="learn" className="mt-6">
            <ScienceExplorerTab />
        </TabsContent>
        
        <TabsContent value="practice" className="mt-6">
            <p className="text-center text-muted-foreground p-8">Practice Quiz functionality will be here.</p>
        </TabsContent>
        
        <TabsContent value="leaderboard" className="mt-6">
            <p className="text-center text-muted-foreground p-8">Leaderboard will be here.</p>
        </TabsContent>

      </Tabs>
    </div>
  );
}
