
'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { CURRICULUM as CURRICULUM_FALLBACK_DATA, Mission } from '@/lib/logic-lab-data';
import { interpretBlockCodeAction, getCodeCoachResponseAction, explainCodingConceptAction } from '@/ai/flows/logic-lab-actions';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, setDoc, getDoc, arrayUnion, collection, updateDoc, query } from 'firebase/firestore';
import { 
  Play, RotateCcw, HelpCircle, CheckCircle2, Lock, 
  Code2, Bot, Trash2, BookOpen, CornerDownLeft, ArrowRight, Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRole } from '@/context/role-context';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

// --- Admin: Manage Mission Dialog ---
function ManageMissionDialog({ mission, open, onOpenChange, onMissionUpdate }: { mission: Mission, open: boolean, onOpenChange: (open: boolean) => void, onMissionUpdate: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [newBlock, setNewBlock] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleAddBlock = async () => {
        if (!newBlock.trim() || !mission.id) return;
        setIsSaving(true);
        try {
            const missionRef = doc(firestore, 'logic_lab_missions', mission.id.toString());
            await updateDoc(missionRef, {
                availableBlocks: arrayUnion(newBlock.trim())
            });
            toast({ title: 'Block Added!', description: `"${newBlock.trim()}" is now available for this mission.` });
            setNewBlock('');
            onMissionUpdate(); // Tell parent to refetch data
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not add block.' });
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage: {mission.title}</DialogTitle>
                    <DialogDescription>Add or remove available blocks for this mission.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <h4 className="font-semibold">Add New Block</h4>
                    <div className="flex gap-2">
                        <Input 
                            value={newBlock}
                            onChange={(e) => setNewBlock(e.target.value)}
                            placeholder="e.g., 'my_variable' or for i in range(10):"
                        />
                        <Button onClick={handleAddBlock} disabled={isSaving || !newBlock.trim()}>
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                        </Button>
                    </div>
                    <h4 className="font-semibold">Current Blocks</h4>
                    <ScrollArea className="h-64 border rounded-md p-2 bg-slate-50">
                        <div className="space-y-1">
                            {mission.availableBlocks.map((block, i) => (
                                <div key={i} className="text-xs p-2 bg-white rounded font-mono border flex justify-between items-center">
                                    <span>{block}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-600" disabled>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export default function LogicLabPage() {
  const { user } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const CURRICULUM_FALLBACK = CURRICULUM_FALLBACK_DATA;

  const isAdmin = role === 'Administrator' || role === 'Director';
  
  // --- STATE ---
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [workspaceBlocks, setWorkspaceBlocks] = useState<string[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  
  // Chat State
  const [coachChat, setCoachChat] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [isCoachThinking, setIsCoachThinking] = useState(false);

  // --- DATA FETCHING ---
  const { data: CURRICULUM, isLoading: isLoadingMissions, forceRefetch: refetchMissions } = useCollection<Mission>(
    useMemoFirebase(() => firestore ? collection(firestore, 'logic_lab_missions') : null, [firestore])
  );
  
  const activeMission = useMemo(() => {
    const curriculumData = CURRICULUM || CURRICULUM_FALLBACK;
    const sortedCurriculum = [...curriculumData].sort((a,b) => a.id - b.id);
    return sortedCurriculum[currentMissionIndex];
  }, [CURRICULUM, currentMissionIndex, CURRICULUM_FALLBACK]);

  // Load Progress
  useEffect(() => {
    if(!user || !firestore) return;
    const fetchProgress = async () => {
        try {
            const ref = doc(firestore, 'student_progress', user.uid);
            const snap = await getDoc(ref);
            if (snap.exists() && snap.data().logicLabCompleted) {
                setCompletedMissions(snap.data().logicLabCompleted);
            }
        } catch (e) { console.error("Progress Load Error", e); }
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
    if (workspaceBlocks.length === 0 || !activeMission) return;
    setIsRunning(true);
    setConsoleOutput('Running...');

    const result = await interpretBlockCodeAction(workspaceBlocks);
    
    if (result.success) {
        setConsoleOutput(result.output);

        const normalizedOutput = result.output.replace(/\s+/g, '').toLowerCase();
        const normalizedExpected = activeMission.expectedOutput.replace(/\s+/g, '').toLowerCase();

        if (normalizedOutput.includes(normalizedExpected) || normalizedOutput === normalizedExpected) {
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
      if(!userQuestion.trim() || !activeMission) return;
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
      if(!activeMission) return;
      setIsCoachOpen(true);
      setIsCoachThinking(true);
      const response = await explainCodingConceptAction(activeMission.title);
      if(response.success) {
          setCoachChat(prev => [...prev, { role: 'model', text: response.text }]);
      }
      setIsCoachThinking(false);
  };

  const groupedMissions = useMemo(() => {
    const curriculumData = CURRICULUM || CURRICULUM_FALLBACK_DATA;
    const sortedCurriculum = [...curriculumData].sort((a,b) => a.id - b.id);
    const groups: Record<string, Mission[]> = {};
    sortedCurriculum.forEach(m => {
        if(!groups[m.section]) groups[m.section] = [];
        groups[m.section].push(m);
    });
    return groups;
  }, [CURRICULUM, CURRICULUM_FALLBACK_DATA]);
  

  return (
    <>
      <div className="flex h-[calc(100vh-2rem)] gap-4 p-4">
        
        <Card className="w-1/4 flex flex-col h-full bg-slate-50 border-r-0 rounded-r-none">
           <div className="p-4 border-b bg-white">
               <h2 className="font-bold text-xl flex items-center gap-2 text-indigo-700">
                   <Code2 className="h-6 w-6"/> Logic Lab
               </h2>
               <p className="text-xs text-muted-foreground">Master Python Logic</p>
           </div>
           <ScrollArea className="flex-1 p-4">
               {isLoadingMissions ? <Loader2 className="mx-auto animate-spin" /> : Object.entries(groupedMissions).map(([section, missions]) => (
                   <div key={section} className="mb-6">
                       <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">{section}</h3>
                       <div className="space-y-1">
                           {missions.map(m => {
                               const isLocked = m.id > 0 && !completedMissions.includes(m.id - 1);
                               const isCompleted = completedMissions.includes(m.id);
                               const isActive = m.id === currentMissionIndex;
                               
                               return (
                                   <button
                                      key={m.id}
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
                               )
                           })}
                       </div>
                   </div>
               ))}
           </ScrollArea>
        </Card>

        <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
            
            <Card className="shrink-0 bg-white border-l-4 border-l-indigo-500">
                 {activeMission ? (
                    <CardHeader className="py-4">
                        <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">{activeMission.title}</CardTitle>
                            <p className="text-sm text-slate-600 mt-1">{activeMission.task}</p>
                        </div>
                        <div className="flex gap-2">
                            {isAdmin && (
                                <Button variant="destructive" size="sm" onClick={() => setIsManageOpen(true)}>
                                    <Settings className="h-4 w-4 mr-2"/> Manage
                                </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={explainTheory}>
                                <BookOpen className="h-4 w-4 mr-2"/> Explain Concept
                            </Button>
                        </div>
                        </div>
                        <div className="mt-2 p-3 bg-indigo-50 rounded text-sm text-indigo-900 prose prose-sm max-w-none">
                            <ReactMarkdown>{activeMission.theory}</ReactMarkdown>
                        </div>
                    </CardHeader>
                ) : (
                     <CardHeader className="py-4">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-3/4 mt-1" />
                        <Skeleton className="h-20 w-full mt-2" />
                    </CardHeader>
                )}
            </Card>

            <div className="flex-1 flex gap-4 min-h-0">
                
                <div className="w-1/3 bg-slate-100 rounded-lg p-4 flex flex-col gap-2 overflow-y-auto border">
                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Structure</h4>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <Button variant="outline" className="border-slate-300 bg-white" onClick={() => handleAddBlock('[NEWLINE]')}>
                            <CornerDownLeft className="h-3 w-3 mr-1"/> Enter
                        </Button>
                        <Button variant="outline" className="border-slate-300 bg-white" onClick={() => handleAddBlock('    ')}>
                            <ArrowRight className="h-3 w-3 mr-1"/> Indent
                        </Button>
                    </div>

                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Available Blocks</h4>
                    {activeMission?.availableBlocks.map((block, i) => (
                        <Button key={i} variant="secondary" className="justify-start font-mono text-xs h-auto py-2 bg-white border shadow-sm hover:border-indigo-400" onClick={() => handleAddBlock(block)}>
                            {block}
                        </Button>
                    ))}
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    
                    <div className="flex-1 bg-white rounded-lg border-2 border-dashed border-slate-300 p-4 overflow-y-auto relative font-mono text-sm">
                        {workspaceBlocks.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-slate-400 pointer-events-none">Click blocks to build your code here</div>}
                        <div className="flex flex-wrap items-center gap-2 content-start">
                            {workspaceBlocks.map((block, i) => {
                                if (block === '[NEWLINE]') {
                                    return <div key={i} className="w-full h-4 border-b border-slate-100 mb-2 relative group"><span className="absolute right-0 top-0 text-xs text-slate-300 select-none">↵</span><button onClick={() => handleRemoveBlock(i)} className="absolute left-0 top-0 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="h-3 w-3"/></button></div>;
                                }
                                if (block === '    ') {
                                    return <div key={i} className="w-8 h-8 bg-slate-50 border border-slate-200 rounded flex items-center justify-center text-slate-300 group relative"><span>→</span><button onClick={() => handleRemoveBlock(i)} className="absolute -top-1 -right-1 bg-white rounded-full text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="h-3 w-3"/></button></div>
                                }
                                return (
                                    <div key={i} className="group relative bg-indigo-600 text-white px-3 py-2 rounded shadow-md cursor-grab active:cursor-grabbing hover:bg-indigo-700 transition-all">
                                        {block}
                                        <button onClick={() => handleRemoveBlock(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"><Trash2 className="h-3 w-3"/></button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={handleRun} disabled={isRunning} className="flex-1 bg-green-600 hover:bg-green-700">
                            {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Play className="mr-2 h-4 w-4"/>}
                            Run Code
                        </Button>
                        <Button variant="outline" onClick={handleClear}><RotateCcw className="h-4 w-4"/></Button>
                        <Button variant="outline" onClick={() => setIsCoachOpen(true)} className="text-purple-600 border-purple-200 bg-purple-50"><Bot className="mr-2 h-4 w-4"/> Ask Coach</Button>
                    </div>

                    <div className="h-32 bg-black rounded-lg p-3 font-mono text-sm text-green-400 overflow-y-auto shadow-inner">
                        <div className="opacity-50 border-b border-green-900 mb-2 pb-1 text-xs">TERMINAL OUTPUT</div>
                        <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
                    </div>

                </div>
            </div>
        </div>

        {/* CODE COACH MODAL */}
        <Dialog open={isCoachOpen} onOpenChange={setIsCoachOpen}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader><DialogTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-purple-600"/> Code Coach</DialogTitle></DialogHeader>
                <div className="h-[300px] bg-slate-50 rounded border p-3 overflow-y-auto space-y-3">
                    {coachChat.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-2 rounded text-xs ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white border text-slate-700'}`}>{msg.text}</div>
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
        
        {/* ADMIN MANAGE DIALOG */}
        {activeMission && <ManageMissionDialog mission={activeMission} open={isManageOpen} onOpenChange={setIsManageOpen} onMissionUpdate={refetchMissions} />}
      </div>
    </>
  );
}
