
'use client';

import { useState, useMemo, useEffect } from 'react';
// Imports for data and types
import { CURRICULUM, Mission } from '@/lib/logic-lab-data'; // Point to your data file
import { interpretBlockCodeAction, getCodeCoachResponseAction, explainCodingConceptAction } from '@/ai/flows/logic-lab-actions'; // Point to your AI actions
// Firebase Imports
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase'; // Adjust to your hooks
import { doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';
// UI Imports
import { 
  Play, RotateCcw, Lock, Code2, Trash2, BookOpen, Loader2, CheckCircle2, HelpCircle, Bot 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
// IMPORT THE ADMIN COMPONENT
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
  
  // Chat State
  const [coachChat, setCoachChat] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [isCoachThinking, setIsCoachThinking] = useState(false);

  // This state holds the merged list (Static Blocks + Admin Blocks)
  const [dynamicBlocks, setDynamicBlocks] = useState<string[]>([]);

  // Current Active Mission Data
  const activeMission = CURRICULUM[currentMissionIndex];

  // --- 1. LOAD STUDENT PROGRESS ---
  useEffect(() => {
    if(!user || !firestore) return;
    const fetchProgress = async () => {
      try {
        const ref = doc(firestore, 'student_progress', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().logicLabCompleted) {
            setCompletedMissions(snap.data().logicLabCompleted);
        }
      } catch (e) { console.error("Error loading progress", e); }
    };
    fetchProgress();
  }, [user, firestore]);

  // --- 2. LISTEN FOR EXTRA BLOCKS (THE KEY FEATURE) ---
  useEffect(() => {
    // A. Start with the static blocks from your file
    setDynamicBlocks(activeMission.availableBlocks);

    if (!firestore) return;

    // B. Subscribe to Firestore for updates to THIS specific mission
    const missionRef = doc(firestore, "logic_lab_missions", activeMission.id.toString());
    
    const unsubscribe = onSnapshot(missionRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.availableBlocks && Array.isArray(data.availableBlocks)) {
          // C. Merge Static + Dynamic, removing duplicates
          const merged = Array.from(new Set([
            ...activeMission.availableBlocks, 
            ...data.availableBlocks
          ]));
          setDynamicBlocks(merged);
        }
      }
    });

    // Cleanup listener when mission changes
    return () => unsubscribe();
  }, [activeMission, firestore]);

  // --- HANDLERS ---

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

    // Call AI Interpreter
    const result = await interpretBlockCodeAction(workspaceBlocks);
    
    if (result.success) {
        setConsoleOutput(result.output);
        
        // Normalize for comparison
        const normOutput = result.output.replace(/\s+/g, '').toLowerCase();
        const normExpected = activeMission.expectedOutput.replace(/\s+/g, '').toLowerCase();

        if (normOutput === normExpected || result.output.includes(activeMission.expectedOutput)) {
            toast({ title: "Success!", description: "Output matches expected result.", className: "bg-green-600 text-white" });
            
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

  // Helper to group missions for sidebar
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
      
      {/* SIDEBAR: NAVIGATION */}
      <Card className="w-1/4 flex flex-col h-full bg-slate-50 border-r-0 rounded-r-none">
         <div className="p-4 border-b bg-white">
             <h2 className="font-bold text-xl flex items-center gap-2 text-indigo-700">
                 <Code2 className="h-6 w-6"/> Logic Lab
             </h2>
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

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
          
          {/* HEADER: THEORY & TASK */}
          <Card className="shrink-0 bg-white border-l-4 border-l-indigo-500">
              <CardHeader className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{activeMission.title}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1 font-medium">Task: {activeMission.task}</p>
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
              
              {/* LEFT COLUMN: AVAILABLE BLOCKS */}
              <div className="w-1/3 bg-slate-100 rounded-lg p-4 flex flex-col gap-2 overflow-y-auto border">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Available Blocks</h4>
                  
                  {/* --- RENDER DYNAMIC BLOCKS HERE --- */}
                  <div className="flex flex-col gap-2">
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
                  </div>

                  {/* --- ADMIN ONLY ADDER --- */}
                  <AdminBlockManager missionId={activeMission.id} />
                  
              </div>

              {/* RIGHT COLUMN: WORKSPACE & CONSOLE */}
              <div className="flex-1 flex flex-col gap-4">
                  
                  {/* DRAG/DROP WORKSPACE AREA */}
                  <div className="flex-1 bg-white rounded-lg border-2 border-dashed border-slate-300 p-4 overflow-y-auto relative">
                      {workspaceBlocks.length === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center text-slate-400 pointer-events-none">
                              Click blocks on the left to add code here
                          </div>
                      )}
                      <div className="space-y-2">
                          {workspaceBlocks.map((block, i) => (
                              <div key={i} className="flex items-center gap-2 animate-in slide-in-from-left-2 fade-in duration-200">
                                  <div className="bg-indigo-600 text-white px-3 py-2 rounded shadow-md font-mono text-sm flex-1 break-all">
                                      {block}
                                  </div>
                                  <button onClick={() => handleRemoveBlock(i)} className="text-red-400 hover:text-red-600">
                                      <Trash2 className="h-4 w-4"/>
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* CONTROLS */}
                  <div className="flex gap-2">
                      <Button onClick={handleRun} disabled={isRunning} className="flex-1 bg-green-600 hover:bg-green-700">
                          {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Play className="mr-2 h-4 w-4"/>}
                          Run Code
                      </Button>
                      <Button variant="outline" onClick={handleClear}><RotateCcw className="h-4 w-4"/></Button>
                  </div>

                  {/* CONSOLE OUTPUT */}
                  <div className="h-32 bg-black rounded-lg p-3 font-mono text-sm text-green-400 overflow-y-auto shadow-inner">
                      <div className="opacity-50 border-b border-green-900 mb-2 pb-1 text-xs">TERMINAL OUTPUT</div>
                      <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
                  </div>

              </div>
          </div>
      </div>
    </div>
  );
}

