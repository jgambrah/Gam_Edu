
'use client';

import { useState, useMemo, useEffect } from 'react';
import { CURRICULUM, Mission } from '@/lib/logic-lab-data';
import { interpretBlockCodeAction, getCodeCoachResponseAction, explainCodingConceptAction } from '@/ai/flows/logic-lab-actions';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, setDoc, getDoc, onSnapshot, query } from 'firebase/firestore';
import { 
  Play, RotateCcw, HelpCircle, CheckCircle2, Lock, 
  Code2, Bot, Trash2, BookOpen, CornerDownLeft, ArrowRight, Loader2, Eraser, AlertCircle, FlaskConical 
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import AdminBlockManager from './AdminBlockManager';
import AdminMissionCreator from '@/components/AdminMissionCreator';
import confetti from 'canvas-confetti';

export default function LogicLabPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  // --- STATE ---
  const [allMissions, setAllMissions] = useState<Mission[]>(CURRICULUM);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [workspaceBlocks, setWorkspaceBlocks] = useState<string[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  
  // Feedback State
  const [lastResult, setLastResult] = useState<{ success: boolean; actual: string; expected: string } | null>(null);

  // Dynamic Blocks
  const [dynamicBlocks, setDynamicBlocks] = useState<string[]>([]);

  // Chat State
  const [coachChat, setCoachChat] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [isCoachThinking, setIsCoachThinking] = useState(false);

  // --- 2. EFFECT: LOAD EXTRA MISSIONS FROM DB ---
  useEffect(() => {
    if (!firestore) return;

    // Listen to the new 'logic_lab_curriculum' collection
    const q = query(collection(firestore, 'logic_lab_curriculum'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const dbMissions: Mission[] = [];
        snapshot.forEach((doc) => {
            dbMissions.push(doc.data() as Mission);
        });

        // Merge Static CURRICULUM + Database Missions
        // We sort by ID to keep them in order
        const merged = [...CURRICULUM, ...dbMissions].sort((a, b) => a.id - b.id);
        setAllMissions(merged);
    });

    return () => unsubscribe();
  }, [firestore]);
  
  const activeMission = allMissions[currentMissionIndex] || allMissions[0];

  // Helper: Get Color based on Block Type
  const getBlockColor = (text: string) => {
    if (text.startsWith('if') || text.startsWith('else') || text.includes('==') || text.includes('>')) return 'bg-purple-600 border-purple-700';
    if (text.startsWith('for') || text.startsWith('while')) return 'bg-amber-600 border-amber-700';
    if (text.startsWith('print') || text.startsWith('input')) return 'bg-blue-600 border-blue-700';
    if (text.includes('=') && !text.includes('==')) return 'bg-orange-600 border-orange-700'; 
    return 'bg-indigo-600 border-indigo-700'; 
  };

  // 1. Load Progress
  useEffect(() => {
    if(!user || !firestore) return;
    const fetchProgress = async () => {
        try {
            const ref = doc(firestore, 'student_progress', user.uid);
            const snap = await getDoc(ref);
            if (snap.exists() && snap.data().logicLabCompleted) {
                setCompletedMissions(snap.data().logicLabCompleted);
            }
        } catch(e) { console.error(e); }
    };
    fetchProgress();
  }, [user, firestore]);

  // 2. Load Real-Time Blocks & Reset on Mission Change
  useEffect(() => {
    if (!activeMission) return;
    setDynamicBlocks(activeMission.availableBlocks); 
    setWorkspaceBlocks([]);
    setConsoleOutput('');
    setLastResult(null);

    if (!firestore) return;

    const missionRef = doc(firestore, "logic_lab_missions", activeMission.id.toString());
    const unsubscribe = onSnapshot(missionRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.availableBlocks && Array.isArray(data.availableBlocks)) {
                const merged = Array.from(new Set([
                    ...activeMission.availableBlocks, 
                    ...data.availableBlocks
                ]));
                setDynamicBlocks(merged);
            }
        }
    });
    return () => unsubscribe();
  }, [activeMission, firestore]);

  // --- ACTIONS ---

  const handleAddBlock = (block: string) => {
    setWorkspaceBlocks([...workspaceBlocks, block]);
    setLastResult(null); // Clear the red box
  };

  const handleRemoveBlock = (index: number) => {
    setWorkspaceBlocks(workspaceBlocks.filter((_, i) => i !== index));
    setLastResult(null); // Clear the red box
  };

  const handleHardReset = () => {
    setWorkspaceBlocks([]);         
    setConsoleOutput('');           
    setCoachChat([]);               
    setIsRunning(false);            
    setIsCoachThinking(false);
    setLastResult(null); // Ensure feedback is wiped
    
    toast({ 
        description: "Workspace cleared ready for next attempt.",
        duration: 2000
    });
  };

  // --- RUN LOGIC (UPDATED WITH MODES) ---
  const handleRun = async (mode: 'test' | 'submit') => {
    if (workspaceBlocks.length === 0) return;
    
    setConsoleOutput(''); 
    setLastResult(null);
    setIsRunning(true);
    
    setTimeout(() => setConsoleOutput('Running code...'), 50);

    const result = await interpretBlockCodeAction(workspaceBlocks);
    
    if (result.success) {
        setConsoleOutput(result.output);

        // CHECK SUCCESS (For BOTH modes now)
        const normOutput = result.output.replace(/\s+/g, '').toLowerCase();
        const normExpected = activeMission.expectedOutput.replace(/\s+/g, '').toLowerCase();
        const isSuccess = normOutput === normExpected || result.output.includes(activeMission.expectedOutput);

        // COMMON: CELEBRATION (Trigger confetti in ANY mode if correct)
        if (isSuccess) {
             confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#4f46e5', '#16a34a', '#db2777']
            });
        }

        // MODE 1: TEST RUN (Sandbox)
        if (mode === 'test') {
            setIsRunning(false);
            
            // If correct, give them a hint to submit
            if (isSuccess) {
                toast({ 
                    title: "Correct Code!", 
                    description: "Great job! Click 'Submit Mission' to save your progress.", 
                    className: "bg-green-600 text-white" 
                });
            }
            return; 
        }

        // MODE 2: SUBMIT (Strict Check with Grading)
        if (isSuccess) {
            setLastResult({ success: true, actual: result.output, expected: activeMission.expectedOutput });
            toast({ title: "Mission Accomplished!", description: "Progress saved.", className: "bg-green-600 text-white" });
            
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
            setLastResult({ success: false, actual: result.output, expected: activeMission.expectedOutput });
            toast({ variant: 'destructive', title: "Incorrect Output", description: "The answer is wrong. Check the red box below." });
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
          availableBlocks: dynamicBlocks,
          missionTitle: activeMission.title,
          userQuestion: userQuestion
      });
      if (response.success) setCoachChat([...newChat, { role: 'model', text: response.text }]);
      setIsCoachThinking(false);
  };

  const explainTheory = async () => {
      setIsCoachOpen(true);
      setIsCoachThinking(true);
      const response = await explainCodingConceptAction(activeMission.title);
      if(response.success) setCoachChat(prev => [...prev, { role: 'model', text: response.text }]);
      setIsCoachThinking(false);
  };

  const groupedMissions = useMemo(() => {
    const groups: Record<string, Mission[]> = {};
    allMissions.forEach(m => {
        if(!groups[m.section]) groups[m.section] = [];
        groups[m.section].push(m);
    });
    return groups;
  }, [allMissions]);

  if (!activeMission) {
    return <div className="flex h-screen w-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-4 p-4">
      
      {/* SIDEBAR */}
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
                                    onClick={() => setCurrentMissionIndex(m.id)}
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
              <AdminMissionCreator />
         </ScrollArea>
      </Card>

      {/* WORKSPACE */}
      <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
          
          <Card className="shrink-0 bg-white border-l-4 border-l-indigo-500">
              <CardHeader className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{activeMission.title}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">Task: <span className="font-bold text-indigo-700">{activeMission.task}</span></p>
                    </div>
                    <Button variant="outline" size="sm" onClick={explainTheory}>
                        <BookOpen className="h-4 w-4 mr-2"/> Explain Concept
                    </Button>
                  </div>
                  <div className="mt-2 p-3 bg-indigo-50 rounded text-sm text-indigo-900 prose prose-sm max-w-none max-h-32 overflow-y-auto">
                      <ReactMarkdown>{activeMission.theory}</ReactMarkdown>
                  </div>
              </CardHeader>
          </Card>

          <div className="flex-1 flex gap-4 min-h-0">
              
              {/* TOOLBOX */}
              <div className="w-1/3 bg-slate-100 rounded-lg p-4 flex flex-col gap-2 overflow-y-auto border">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Structure</h4>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                      <Button variant="outline" className="border-slate-300 bg-white hover:bg-slate-100" onClick={() => handleAddBlock('[NEWLINE]')}>
                          <CornerDownLeft className="h-3 w-3 mr-1"/> Enter
                      </Button>
                      <Button variant="outline" className="border-slate-300 bg-white hover:bg-slate-100" onClick={() => handleAddBlock('    ')}>
                          <ArrowRight className="h-3 w-3 mr-1"/> Indent
                      </Button>
                  </div>

                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Available Blocks</h4>
                  {dynamicBlocks.map((block, i) => (
                      <Button 
                        key={`${block}-${i}`} 
                        variant="secondary" 
                        className={`justify-start font-mono text-xs h-auto py-2 bg-white border shadow-sm hover:border-indigo-400 text-left whitespace-normal break-all
                           ${block.startsWith('print') ? 'border-l-4 border-l-blue-500' : ''}
                           ${block.includes('=') ? 'border-l-4 border-l-orange-500' : ''}
                        `}
                        onClick={() => handleAddBlock(block)}
                      >
                          {block}
                      </Button>
                  ))}
                  <AdminBlockManager missionId={activeMission.id} />
              </div>

              {/* CANVAS & CONSOLE */}
              <div className="flex-1 flex flex-col gap-4">
                  
                  {/* CANVAS */}
                  <div className="flex-1 bg-white rounded-lg border-2 border-dashed border-slate-300 p-4 overflow-y-auto relative font-mono text-sm">
                      {workspaceBlocks.length === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center text-slate-400 pointer-events-none">
                              Click blocks to build your code here
                          </div>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-2 content-start">
                          {workspaceBlocks.map((block, i) => {
                              if (block === '[NEWLINE]') {
                                  return (
                                    <div key={i} className="w-full h-6 border-b border-slate-200 mb-2 relative group flex items-end">
                                        <span className="absolute right-0 top-1 text-xs text-slate-300 select-none">↵</span>
                                        <button onClick={() => handleRemoveBlock(i)} className="absolute left-0 top-1 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="h-3 w-3"/></button>
                                    </div>
                                  );
                              }
                              if (block === '    ') {
                                  return (
                                    <div key={i} className="w-8 h-8 bg-slate-50 border border-slate-200 rounded flex items-center justify-center text-slate-300 group relative">
                                        <span className="text-xs">→</span>
                                        <button onClick={() => handleRemoveBlock(i)} className="absolute -top-1 -right-1 bg-white rounded-full text-red-500 opacity-0 group-hover:opacity-100 border shadow-sm z-10"><Trash2 className="h-3 w-3"/></button>
                                    </div>
                                  );
                              }
                              return (
                                  <div key={i} className={`group relative text-white px-3 py-2 rounded shadow-md cursor-grab active:cursor-grabbing hover:opacity-90 transition-all ${getBlockColor(block)}`}>
                                      {block}
                                      <button onClick={() => handleRemoveBlock(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10">
                                          <Trash2 className="h-3 w-3"/>
                                      </button>
                                  </div>
                              );
                          })}
                      </div>
                  </div>

                  {/* ACTIONS BAR - UPDATED */}
                  <div className="flex gap-2">
                      
                      {/* 1. TEST RUN (SANDBOX) */}
                      <Button onClick={() => handleRun('test')} disabled={isRunning} className="bg-blue-600 hover:bg-blue-700 shadow-sm" title="Just run code without grading">
                          <FlaskConical className="mr-2 h-4 w-4"/> Test Run
                      </Button>

                      {/* 2. SUBMIT MISSION (STRICT) */}
                      <Button onClick={() => handleRun('submit')} disabled={isRunning} className="flex-1 bg-green-600 hover:bg-green-700 shadow-sm" title="Check answer against mission">
                          {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Play className="mr-2 h-4 w-4"/>}
                          Submit Mission
                      </Button>

                      <Button variant="outline" onClick={handleHardReset} className="text-red-600 hover:bg-red-50" title="Reset Workspace">
                          <Eraser className="h-4 w-4"/>
                      </Button>
                      <Button variant="outline" onClick={() => setIsCoachOpen(true)} className="text-purple-600 border-purple-200 bg-purple-50">
                          <Bot className="mr-2 h-4 w-4"/> Coach
                      </Button>
                  </div>

                  {/* CONSOLE */}
                  <div className="flex flex-col gap-2">
                      <div className="h-32 bg-black rounded-lg p-3 font-mono text-sm text-green-400 overflow-y-auto shadow-inner relative">
                          <div className="flex justify-between items-center opacity-50 border-b border-green-900 mb-2 pb-1 text-xs">
                             <span>TERMINAL OUTPUT</span>
                             <button onClick={() => setConsoleOutput('')} className="hover:text-white cursor-pointer">Clear</button>
                          </div>
                          <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
                      </div>

                      {/* ERROR PANEL (Only shows on Submit failure) */}
                      {lastResult && !lastResult.success && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-in slide-in-from-bottom-2 fade-in">
                              <div className="flex items-center gap-2 text-red-700 font-bold text-sm mb-2">
                                  <AlertCircle className="h-4 w-4"/> Mission Failed
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                                  <div>
                                      <span className="text-slate-500 block mb-1">Expected:</span>
                                      <div className="bg-green-100 text-green-800 p-2 rounded border border-green-200">
                                          {lastResult.expected}
                                      </div>
                                  </div>
                                  <div>
                                      <span className="text-slate-500 block mb-1">Your Output:</span>
                                      <div className="bg-red-100 text-red-800 p-2 rounded border border-red-200 break-words">
                                          {lastResult.actual || "(Nothing)"}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>

              </div>
          </div>
      </div>

      {/* COACH MODAL */}
      <Dialog open={isCoachOpen} onOpenChange={setIsCoachOpen}>
          {/* ... (Same as before) ... */}
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
    </div>
  );
}

    