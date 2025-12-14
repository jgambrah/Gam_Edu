
'use client';

import { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CURRICULUM, Mission } from '@/lib/logic-lab-data';
import { interpretBlockCodeAction, getCodeCoachResponseAction, explainCodingConceptAction } from '@/ai/flows/logic-lab-actions';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { 
  Play, RotateCcw, HelpCircle, CheckCircle2, Lock, 
  Code2, Bot, Trash2, BookOpen, CornerDownLeft, ArrowRight, Loader2, Eraser 
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import AdminBlockManager from './AdminBlockManager'; 

export default function LogicLabPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  // --- STATE ---
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [workspaceBlocks, setWorkspaceBlocks] = useState<string[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  
  // Dynamic Blocks
  const [dynamicBlocks, setDynamicBlocks] = useState<string[]>([]);

  // Chat State
  const [coachChat, setCoachChat] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [isCoachThinking, setIsCoachThinking] = useState(false);

  const activeMission = CURRICULUM[currentMissionIndex];

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

  // 2. Load Real-Time Blocks
  useEffect(() => {
    setDynamicBlocks(activeMission.availableBlocks); 
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
  };

  const handleRemoveBlock = (index: number) => {
    setWorkspaceBlocks(workspaceBlocks.filter((_, i) => i !== index));
  };

  // --- NEW: HARD RESET FUNCTION ---
  // This completely wipes the state to avoid "stuck" errors
  const handleHardReset = () => {
    setWorkspaceBlocks([]);         // Clear the blocks
    setConsoleOutput('');           // Clear the error message
    setCoachChat([]);               // Clear the chat history
    setIsRunning(false);            // Stop any running process
    setIsCoachThinking(false);
    
    toast({ 
      title: "Workspace Reset", 
      description: "All blocks and errors have been cleared.",
    });
  };

  const handleRun = async () => {
    if (workspaceBlocks.length === 0) return;
    
    // 1. Clear console immediately so old errors don't linger visually
    setConsoleOutput(''); 
    setIsRunning(true);
    
    // Small delay to show "Running" state
    setTimeout(() => setConsoleOutput('Running code...'), 50);

    const result = await interpretBlockCodeAction(workspaceBlocks);
    
    if (result.success) {
        setConsoleOutput(result.output);

        // Check Success
        const normOutput = result.output.replace(/\s+/g, '').toLowerCase();
        const normExpected = activeMission.expectedOutput.replace(/\s+/g, '').toLowerCase();

        if (normOutput === normExpected || result.output.includes(activeMission.expectedOutput)) {
            toast({ title: "Mission Accomplished!", description: "Output matches!", className: "bg-green-600 text-white" });
            
            // --- "CELEBRATION MODE" TRIGGER ---
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
            // ------------------------------------

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
            toast({ variant: 'destructive', title: "Try Again", description: `Expected: ${activeMission.expectedOutput}` });
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
    const groups: Record<string, Mission[]> = {};
    CURRICULUM.forEach(m => {
        if(!groups[m.section]) groups[m.section] = [];
        groups[m.section].push(m);
    });
    return groups;
  }, []);

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
                                    onClick={() => { setCurrentMissionIndex(m.id); handleHardReset(); }}
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

      {/* WORKSPACE */}
      <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
          
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
                  <div className="mt-2 p-3 bg-indigo-50 rounded text-sm text-indigo-900 prose prose-sm max-w-none max-h-32 overflow-y-auto">
                      <ReactMarkdown>{activeMission.theory}</ReactMarkdown>
                  </div>
              </CardHeader>
          </Card>

          <div className="flex-1 flex gap-4 min-h-0">
              
              {/* TOOLBOX */}
              <div className="w-1/3 bg-slate-100 rounded-lg p-4 flex flex-col gap-2 overflow-y-auto border">
                  
                  {/* STRUCTURE BUTTONS */}
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
                  
                  {/* DYNAMIC BLOCKS */}
                  {dynamicBlocks.map((block, i) => (
                      <Button 
                        key={`${block}-${i}`} 
                        variant="secondary" 
                        className="justify-start font-mono text-xs h-auto py-2 bg-white border shadow-sm hover:border-indigo-400 text-left whitespace-normal break-all"
                        onClick={() => handleAddBlock(block)}
                      >
                          {block}
                      </Button>
                  ))}

                  {/* ADMIN FEATURE */}
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
                              // NEW LINE
                              if (block === '[NEWLINE]') {
                                  return (
                                    <div key={i} className="w-full h-6 border-b border-slate-200 mb-2 relative group flex items-end">
                                        <span className="absolute right-0 top-1 text-xs text-slate-300 select-none">↵</span>
                                        <button onClick={() => handleRemoveBlock(i)} className="absolute left-0 top-1 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100">
                                            <Trash2 className="h-3 w-3"/>
                                        </button>
                                    </div>
                                  );
                              }
                              // INDENT
                              if (block === '    ') {
                                  return (
                                    <div key={i} className="w-8 h-8 bg-slate-50 border border-slate-200 rounded flex items-center justify-center text-slate-300 group relative">
                                        <span className="text-xs">→</span>
                                        <button onClick={() => handleRemoveBlock(i)} className="absolute -top-1 -right-1 bg-white rounded-full text-red-500 opacity-0 group-hover:opacity-100 border shadow-sm z-10">
                                            <Trash2 className="h-3 w-3"/>
                                        </button>
                                    </div>
                                  );
                              }
                              // STANDARD BLOCK
                              return (
                                  <div key={i} className="group relative bg-indigo-600 text-white px-3 py-2 rounded shadow-md cursor-grab active:cursor-grabbing hover:bg-indigo-700 transition-all">
                                      {block}
                                      <button 
                                        onClick={() => handleRemoveBlock(i)} 
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                                      >
                                          <Trash2 className="h-3 w-3"/>
                                      </button>
                                  </div>
                              );
                          })}
                      </div>
                  </div>

                  {/* ACTIONS BAR */}
                  <div className="flex gap-2">
                      <Button onClick={handleRun} disabled={isRunning} className="flex-1 bg-green-600 hover:bg-green-700 shadow-sm">
                          {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Play className="mr-2 h-4 w-4"/>}
                          Run Code
                      </Button>
                      
                      {/* NEW: RESET ALL BUTTON */}
                      <Button 
                        variant="outline" 
                        onClick={handleHardReset} 
                        className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                        title="Clear blocks and console"
                      >
                          <Eraser className="h-4 w-4 mr-2"/> Reset Workspace
                      </Button>
                      
                      <Button variant="outline" onClick={() => setIsCoachOpen(true)} className="text-purple-600 border-purple-200 bg-purple-50">
                          <Bot className="mr-2 h-4 w-4"/> Ask Coach
                      </Button>
                  </div>

                  {/* CONSOLE OUTPUT */}
                  <div className="h-32 bg-black rounded-lg p-3 font-mono text-sm text-green-400 overflow-y-auto shadow-inner relative group">
                      <div className="flex justify-between items-center opacity-50 border-b border-green-900 mb-2 pb-1 text-xs">
                         <span>TERMINAL OUTPUT</span>
                         {/* Mini Clear Console Button */}
                         <button onClick={() => setConsoleOutput('')} className="hover:text-white cursor-pointer" title="Clear Text">
                            Clear
                         </button>
                      </div>
                      <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
                  </div>

              </div>
          </div>
      </div>

      {/* COACH MODAL */}
      <Dialog open={isCoachOpen} onOpenChange={setIsCoachOpen}>
          <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                  <DialogTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-purple-600"/> Code Coach</DialogTitle>
              </DialogHeader>
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
    </div>
  );
}
