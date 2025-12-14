
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { CURRICULUM as CURRICULUM_FALLBACK, type Mission } from '@/lib/logic-lab-data';
import { interpretBlockCodeAction, getCodeCoachResponseAction, explainCodingConceptAction } from '@/ai/flows/logic-lab-actions';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, setDoc, getDoc, collection, query, updateDoc, addDoc } from 'firebase/firestore';
import { 
  Play, RotateCcw, HelpCircle, Terminal, CheckCircle2, Lock, 
  ChevronRight, Code2, Bot, Trash2, BookOpen, Wand2, PlusCircle, Edit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRole } from '@/context/role-context';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const TARGET_GROUPS = ['Novice (Basic 1-3)', 'Apprentice (Basic 4-6)', 'Scholar (JHS)', 'Master (SHS)'];

// Helper to map student class
const getStudentGroup = (className: string = '') => {
    const name = className.toLowerCase();
    if (name.includes('bs1') || name.includes('bs2') || name.includes('bs3')) return 'Novice (Basic 1-3)';
    if (name.includes('bs4') || name.includes('bs5') || name.includes('bs6')) return 'Apprentice (Basic 4-6)';
    if (name.includes('jhs')) return 'Scholar (JHS)';
    if (name.includes('shs')) return 'Master (SHS)';
    return 'Scholar (JHS)'; 
};

export default function LogicLabPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { role } = useRole();
  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role || '');

  // State
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [workspaceBlocks, setWorkspaceBlocks] = useState<string[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  
  // Chat State
  const [coachChat, setCoachChat] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [isCoachThinking, setIsCoachThinking] = useState(false);
  
  // Admin states
  const [adminSelectedGroup, setAdminSelectedGroup] = useState(TARGET_GROUPS[2]);
  const [isMissionFormOpen, setIsMissionFormOpen] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);

  // Now fetching curriculum from Firestore
  const missionsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'logic_lab_missions') : null, [firestore]);
  const { data: CURRICULUM, isLoading: isLoadingMissions, forceRefetch: refetchMissions } = useCollection<Mission>(missionsQuery);
  
  const activeMission = useMemo(() => {
    const curriculumData = (CURRICULUM && CURRICULUM.length > 0) ? CURRICULUM : CURRICULUM_FALLBACK;
    const sortedCurriculum = [...curriculumData].sort((a,b) => a.id - b.id);
    return sortedCurriculum.find(m => m.id === currentMissionIndex) || sortedCurriculum[0];
  }, [CURRICULUM, currentMissionIndex]);

  // Load Progress from Firestore
  useEffect(() => {
    if(!user || !firestore) return;
    const fetchProgress = async () => {
        const ref = doc(firestore, 'student_progress', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().logicLabCompleted) {
            setCompletedMissions(snap.data().logicLabCompleted);
        }
    };
    fetchProgress();
  }, [user, firestore]);

  // --- ACTIONS ---

  const handleAddBlock = (block: string) => {
    setWorkspaceBlocks([...workspaceBlocks, block]);
  };

  const handleRemoveBlock = (index: number) => {
    setWorkspaceBlocks(workspaceBlocks.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    setWorkspaceBlocks([]);
    setConsoleOutput('');
  };

  const handleRun = async () => {
    if (workspaceBlocks.length === 0) return;
    setIsRunning(true);
    setConsoleOutput('Running...');

    const result = await interpretBlockCodeAction(workspaceBlocks);
    
    if (result.success) {
        setConsoleOutput(result.output);

        const normalizedOutput = result.output.replace(/\s+/g, '').toLowerCase();
        const normalizedExpected = activeMission.expectedOutput.replace(/\s+/g, '').toLowerCase();

        if (normalizedOutput === normalizedExpected || result.output.includes(activeMission.expectedOutput)) {
            toast({ title: "Mission Accomplished!", description: "Code output matches expectation.", className: "bg-green-600 text-white" });
            
            if (!completedMissions.includes(currentMissionIndex)) {
                const newCompleted = [...completedMissions, currentMissionIndex];
                setCompletedMissions(newCompleted);
                
                if (user && firestore) {
                    await setDoc(doc(firestore, 'student_progress', user.uid), {
                        logicLabCompleted: newCompleted
                    }, { merge: true });
                }
            }
        } else {
            toast({ variant: 'destructive', title: "Incorrect Output", description: `Expected: ${activeMission.expectedOutput}` });
        }
    } else {
        setConsoleOutput(`Error: ${result.output}`);
    }
    setIsRunning(false);
  };

  const handleAskCoach = async () => {
      if(!userQuestion.trim()) return;
      setIsCoachThinking(true);
      
      const newChat = [...coachChat, { role: 'user' as const, text: userQuestion }];
      setCoachChat(newChat);
      setUserQuestion('');

      const response = await getCodeCoachResponseAction({
          currentBlocks: workspaceBlocks,
          availableBlocks: activeMission.availableBlocks,
          missionTitle: activeMission.title,
          userQuestion: userQuestion
      });

      if (response.success) {
          setCoachChat([...newChat, { role: 'model', text: response.text }]);
      }
      setIsCoachThinking(false);
  };

  const explainTheory = async () => {
      setIsCoachOpen(true);
      setIsCoachThinking(true);
      const response = await explainCodingConceptAction(activeMission.title);
      if(response.success) {
          setCoachChat(prev => [...prev, { role: 'model', text: response.text }]);
      }
      setIsCoachThinking(false);
  };

  const groupedMissions = useMemo(() => {
    const curriculumData = (CURRICULUM && CURRICULUM.length > 0) ? CURRICULUM : CURRICULUM_FALLBACK;
    const groups: Record<string, Mission[]> = {};
    [...curriculumData].sort((a,b) => a.id - b.id).forEach(m => {
        if(!groups[m.section]) groups[m.section] = [];
        groups[m.section].push(m);
    });
    return groups;
  }, [CURRICULUM]);
  
  const openMissionForm = (mission?: Mission) => {
    setEditingMission(mission || null);
    setIsMissionFormOpen(true);
  };

  if (isLoadingMissions && !CURRICULUM) {
    return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!activeMission) {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <Card className="text-center">
                <CardHeader>
                    <CardTitle>Mission Not Found</CardTitle>
                    <CardContent>
                        <p>The selected mission could not be loaded.</p>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-4 p-4">
      
      {/* --- SIDEBAR: MISSION LOG --- */}
      <Card className="w-1/4 flex flex-col h-full bg-slate-50 border-r-0 rounded-r-none">
         <div className="p-4 border-b bg-white">
             <h2 className="font-bold text-xl flex items-center gap-2 text-indigo-700">
                 <Code2 className="h-6 w-6"/> Logic Lab
             </h2>
             <p className="text-xs text-muted-foreground">Master Python Logic</p>
         </div>
         <ScrollArea className="flex-1 p-4">
             {Object.entries(groupedMissions).map(([section, missions]) => (
                 <div key={section} className="mb-6">
                     <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-bold uppercase text-slate-500">{section}</h3>
                        {canManage && <Button variant="ghost" size="sm" className="h-6" onClick={() => openMissionForm()}><PlusCircle className="h-3 w-3"/></Button>}
                     </div>
                     <div className="space-y-1">
                         {missions.map(m => {
                             const isLocked = m.id > 0 && !completedMissions.includes(m.id - 1);
                             const isCompleted = completedMissions.includes(m.id);
                             const isActive = m.id === currentMissionIndex;
                             
                             return (
                                 <div key={m.id} className="group flex items-center gap-1">
                                    <button
                                        disabled={isLocked}
                                        onClick={() => { setCurrentMissionIndex(m.id); handleClear(); }}
                                        className={`w-full text-left p-2 rounded text-sm flex items-center justify-between transition-colors
                                            ${isActive ? 'bg-indigo-100 text-indigo-800 font-medium' : 'hover:bg-slate-200'}
                                            ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <span className="flex items-center gap-2">
                                            {isLocked ? <Lock className="h-3 w-3"/> : <span>{m.id + 1}.</span>}
                                            {m.title}
                                        </span>
                                        {isCompleted && <CheckCircle2 className="h-4 w-4 text-green-600"/>}
                                    </button>
                                    {canManage && <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => openMissionForm(m)}><Edit className="h-3 w-3"/></Button>}
                                 </div>
                             )
                         })}
                     </div>
                 </div>
             ))}
         </ScrollArea>
      </Card>

      {/* --- MAIN WORKSPACE --- */}
      <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
          
          {/* Theory & Task Header */}
          <Card className="shrink-0 bg-white border-l-4 border-l-indigo-500">
              <CardHeader className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{activeMission.title}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">{activeMission.task}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={explainTheory}>
                        <BookOpen className="h-4 w-4 mr-2"/> Explain Concept
                    </Button>
                  </div>
                  <div className="mt-2 p-3 bg-indigo-50 rounded text-sm text-indigo-900 prose prose-sm max-w-none">
                      <ReactMarkdown>{activeMission.theory}</ReactMarkdown>
                  </div>
              </CardHeader>
          </Card>

          <div className="flex-1 flex gap-4 min-h-0">
              
              <div className="w-1/3 bg-slate-100 rounded-lg p-4 flex flex-col gap-2 overflow-y-auto border">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Available Blocks</h4>
                  {activeMission.availableBlocks.map((block, i) => (
                      <Button key={i} variant="secondary" className="justify-start font-mono text-xs h-auto py-2 bg-white border shadow-sm hover:border-indigo-400" onClick={() => handleAddBlock(block)}>
                          {block}
                      </Button>
                  ))}
              </div>

              <div className="flex-1 flex flex-col gap-4">
                  
                  <div className="flex-1 bg-white rounded-lg border-2 border-dashed border-slate-300 p-4 overflow-y-auto relative">
                      {workspaceBlocks.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-slate-400 pointer-events-none">Click blocks to add them here</div>}
                      <div className="space-y-2">
                          {workspaceBlocks.map((block, i) => (
                              <div key={i} className="flex items-center gap-2 animate-in slide-in-from-left-2 fade-in duration-200">
                                  <div className="bg-indigo-600 text-white px-3 py-2 rounded shadow-md font-mono text-sm flex-1">{block}</div>
                                  <button onClick={() => handleRemoveBlock(i)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4"/></button>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className="flex gap-2">
                      <Button onClick={handleRun} disabled={isRunning} className="flex-1 bg-green-600 hover:bg-green-700">
                          {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Play className="mr-2 h-4 w-4"/>}
                          Run Code
                      </Button>
                      <Button variant="outline" onClick={handleClear}><RotateCcw className="h-4 w-4"/></Button>
                      <Button variant="outline" onClick={() => setIsCoachOpen(true)} className="text-purple-600 border-purple-200 bg-purple-50">
                          <Bot className="mr-2 h-4 w-4"/> Ask Coach
                      </Button>
                  </div>

                  <div className="h-32 bg-black rounded-lg p-3 font-mono text-sm text-green-400 overflow-y-auto shadow-inner">
                      <div className="opacity-50 border-b border-green-900 mb-2 pb-1 text-xs">TERMINAL OUTPUT</div>
                      <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
                  </div>

              </div>
          </div>
      </div>

      <Dialog open={isCoachOpen} onOpenChange={setIsCoachOpen}>
          <DialogContent className="sm:max-w-[400px]">
              <DialogHeader><DialogTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-purple-600"/> Code Coach</DialogTitle></DialogHeader>
              <div className="h-[300px] bg-slate-50 rounded border p-3 overflow-y-auto space-y-3">
                  {coachChat.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-2 rounded text-xs ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white border text-slate-700'}`}>
                              {msg.text}
                          </div>
                      </div>
                  ))}
                  {isCoachThinking && <div className="text-xs text-slate-400 animate-pulse">Coach is typing...</div>}
              </div>
              <DialogFooter>
                  <div className="flex w-full gap-2">
                      <Input value={userQuestion} onChange={e => setUserQuestion(e.target.value)} placeholder="Ask for a hint..." className="text-xs"/>
                      <Button onClick={handleAskCoach} size="sm" disabled={isCoachThinking}><HelpCircle className="h-4 w-4"/></Button>
                  </div>
              </DialogFooter>
          </DialogContent>
      </Dialog>
      
      {canManage && <Dialog open={isMissionFormOpen} onOpenChange={setIsMissionFormOpen}><MissionForm mission={editingMission} setOpen={setIsMissionFormOpen} onSuccess={refetchMissions} /></Dialog>}
    </div>
  );
}

function MissionForm({ mission, setOpen, onSuccess }: { mission: Mission | null; setOpen: (open: boolean) => void; onSuccess: () => void; }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<Mission>({
    defaultValues: mission || {
      id: 0,
      section: '',
      title: '',
      category: 'Basics',
      theory: '',
      task: '',
      expectedOutput: '',
      hint: '',
      availableBlocks: [],
    },
  });

  const onSubmit = async (data: Mission) => {
    setIsSubmitting(true);
    try {
        if(mission) { // Editing
            await updateDoc(doc(firestore, 'logic_lab_missions', mission.id.toString()), data);
            toast({ title: "Mission Updated" });
        } else { // Creating
            const newDocRef = doc(firestore, 'logic_lab_missions', data.id.toString());
            await setDoc(newDocRef, data);
            toast({ title: "Mission Created" });
        }
        onSuccess();
        setOpen(false);
    } catch(e: any) {
        toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>{mission ? 'Edit Mission' : 'Create New Mission'}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="task"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Task" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="theory"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Theory (Markdown)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expectedOutput"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Expected Output" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hint"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Hint" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availableBlocks"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Blocks, comma, separated" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Mission'}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}

    