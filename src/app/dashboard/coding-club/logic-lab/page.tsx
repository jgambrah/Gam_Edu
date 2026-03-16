'use client';

import { useState, useMemo, useEffect } from 'react';
import { CURRICULUM, Mission } from '@/lib/logic-lab-data';
import { interpretBlockCodeAction, getCodeCoachResponseAction, explainCodingConceptAction } from '@/ai/flows/logic-lab-actions';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, getDoc, onSnapshot, collection, query } from 'firebase/firestore';
import { 
  Play, RotateCcw, HelpCircle, CheckCircle2, Lock, 
  Code2, Bot, Trash2, BookOpen, CornerDownLeft, ArrowRight, Loader2, Eraser, AlertCircle, FlaskConical, Trophy, Info, FolderOpen 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import AdminBlockManager from './AdminBlockManager';
import AdminMissionCreator from '@/components/AdminMissionCreator';
import confetti from 'canvas-confetti';
import { useCurrentSchool } from '@/hooks/use-current-school';

// --- REFERENCE GUIDE DATA ---
const REFERENCE_DATA = [
  { title: "Variables", desc: "Containers for storing data values.", example: "score = 10" },
  { title: "print()", desc: "Outputs text or numbers to the console.", example: "print('Hello')" },
  { title: "if / else", desc: "Decides which code to run based on a condition.", example: "if x > 5: print('Big')" },
  { title: "for loop", desc: "Repeats code for each item in a sequence.", example: "for i in range(3):" },
  { title: "while loop", desc: "Repeats code as long as a condition is true.", example: "while x < 10:" },
  { title: "input()", desc: "Pauses the program to get text from the user.", example: "name = input()" },
];

export default function LogicLabPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();

  // --- STATE ---
  const [allMissions, setAllMissions] = useState<Mission[]>(CURRICULUM);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [workspaceBlocks, setWorkspaceBlocks] = useState<string[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  
  const [lastResult, setLastResult] = useState<{ success: boolean; actual: string; expected: string } | null>(null);
  const [dynamicBlocks, setDynamicBlocks] = useState<string[]>([]);

  // Chat State
  const [coachChat, setCoachChat] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [isCoachThinking, setIsCoachThinking] = useState(false);

  // --- 1. LOAD MISSIONS FROM DB ---
  useEffect(() => {
    if (!firestore) return;
    const q = query(collection(firestore, 'logic_lab_curriculum'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const dbMissions: Mission[] = [];
        snapshot.forEach((doc) => dbMissions.push(doc.data() as Mission));
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

  // --- 2. LOAD PROGRESS ---
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

  // --- 3. DYNAMIC BLOCKS ---
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
                const merged = Array.from(new Set([...activeMission.availableBlocks, ...data.availableBlocks]));
                setDynamicBlocks(merged);
            }
        }
    });
    return () => unsubscribe();
  }, [activeMission, firestore]);

  // Actions
  const handleAddBlock = (block: string) => { setWorkspaceBlocks([...workspaceBlocks, block]); setLastResult(null); };
  const handleRemoveBlock = (index: number) => { setWorkspaceBlocks(workspaceBlocks.filter((_, i) => i !== index)); setLastResult(null); };
  const handleHardReset = () => { setWorkspaceBlocks([]); setConsoleOutput(''); setCoachChat([]); setIsRunning(false); setIsCoachThinking(false); setLastResult(null); toast({ description: "Workspace cleared." }); };

  // --- RUN LOGIC ---
  const handleRun = async (mode: 'test' | 'submit') => {
    if (workspaceBlocks.length === 0 || !schoolId) return;
    setConsoleOutput(''); setLastResult(null); setIsRunning(true);
    setTimeout(() => setConsoleOutput('Running code...'), 50);

    const result = await interpretBlockCodeAction(workspaceBlocks, schoolId);
    
    if (result.success) {
        setConsoleOutput(result.output);
        const normOutput = result.output.replace(/\s+/g, '').toLowerCase();
        const normExpected = activeMission.expectedOutput.replace(/\s+/g, '').toLowerCase();
        const isSuccess = normOutput === normExpected || result.output.includes(activeMission.expectedOutput);

        if (isSuccess) {
             confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#4f46e5', '#16a34a', '#db2777'] });
        }

        if (mode === 'test') {
            setIsRunning(false);
            if (isSuccess) toast({ title: "Correct Code!", description: "Great job! Click 'Submit Mission' to save.", className: "bg-green-600 text-white" });
            return; 
        }

        if (isSuccess) {
            setLastResult({ success: true, actual: result.output, expected: activeMission.expectedOutput });
            toast({ title: "Mission Accomplished!", description: "Progress saved.", className: "bg-green-600 text-white" });
            
            if (!completedMissions.includes(currentMissionIndex)) {
                const newCompleted = [...completedMissions, currentMissionIndex];
                setCompletedMissions(newCompleted);
                if (user && firestore) {
                    await setDoc(doc(firestore, 'student_progress', user.uid), { logicLabCompleted: newCompleted }, { merge: true });
                }
            }
        } else {
            setLastResult({ success: false, actual: result.output, expected: activeMission.expectedOutput });
            toast({ variant: 'destructive', title: "Incorrect Output", description: "The code ran, but didn't match the mission goal." });
        }
    } else {
        setConsoleOutput(`Error: ${result.output}`);
    }
    setIsRunning(false);
  };

  // AI Actions
  const handleAskCoach = async () => {
      if(!userQuestion.trim() || !schoolId) return;
      setIsCoachThinking(true);
      const newChat = [...coachChat, { role: 'user' as const, text: userQuestion }];
      setCoachChat(newChat);
      setUserQuestion('');
      const response = await getCodeCoachResponseAction({ 
          currentBlocks: workspaceBlocks, 
          availableBlocks: dynamicBlocks, 
          missionTitle: activeMission.title, 
          userQuestion: userQuestion,
          schoolId: schoolId
      });
      if (response.success) setCoachChat([...newChat, { role: 'model', text: response.text }]);
      setIsCoachThinking(false);
  };

  const explainTheory = async () => {
      if (!schoolId) return;
      setIsCoachOpen(true); setIsCoachThinking(true);
      const response = await explainCodingConceptAction(activeMission.title, schoolId);
      if(response.success) setCoachChat(prev => [...prev, { role: 'model', text: response.text }]);
      setIsCoachThinking(false);
  };

  const groupedMissions = useMemo(() => {
    const groups: Record<string, Mission[]> = {};
    allMissions.forEach(m => { if(!groups[m.section]) groups[m.section] = []; groups[m.section].push(m); });
    return groups;
  }, [allMissions]);

  const progressPercentage = Math.round((completedMissions.length / allMissions.length) * 100) || 0;

  if (!activeMission) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  return (
    <div className="flex flex-col flex-1 gap-4 p-1">
      
      {/* --- TOP BAR: GAMIFICATION --- */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border shadow-sm shrink-0">
        <div className="flex items-center gap-3">
             <div className="bg-yellow-100 p-2 rounded-full"><Trophy className="h-5 w-5 text-yellow-600" /></div>
             <div>
                 <div className="text-[10px] text-slate-500 font-bold uppercase">Student Level</div>
                 <div className="text-sm font-bold text-slate-800">
                     {completedMissions.length < 5 ? "Novice Coder" : completedMissions.length < 15 ? "Python Apprentice" : "Code Wizard"}
                 </div>
             </div>
        </div>
        <div className="flex-1 mx-8 hidden sm:block">
             <div className="flex justify-between text-[10px] mb-1">
                 <span className="font-bold uppercase text-slate-400">Mission Progress</span>
                 <span className="font-bold text-slate-600">{progressPercentage}%</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2">
                 <div className="bg-green-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
             </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsReferenceOpen(true)}>
            <Info className="h-4 w-4 mr-2 text-blue-600"/> Cheat Sheet
        </Button>
      </div>

      <div className="flex flex-1 gap-4 min-h-[600px]">
        {/* SIDEBAR */}
        <Card className="w-1/4 flex flex-col h-full bg-slate-50 border-r-0 rounded-r-none overflow-hidden">
            <div className="p-4 border-b bg-white">
                <h2 className="font-bold text-lg flex items-center gap-2 text-indigo-700"><Code2 className="h-5 w-5"/> Missions</h2>
            </div>
            <ScrollArea className="flex-1 p-4">
                {Object.entries(groupedMissions).map(([section, missions]) => (
                    <div key={section} className="mb-6">
                        <h3 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">{section}</h3>
                        <div className="space-y-1">
                            {missions.map(m => {
                                const isLocked = m.id > 0 && !completedMissions.includes(m.id - 1) && !completedMissions.includes(m.id);
                                const isCompleted = completedMissions.includes(m.id);
                                const isActive = m.id === activeMission.id;
                                return (
                                    <button
                                        key={m.id}
                                        disabled={isLocked}
                                        onClick={() => setCurrentMissionIndex(allMissions.findIndex(am => am.id === m.id))}
                                        className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors
                                            ${isActive ? 'bg-indigo-100 text-indigo-800 font-bold' : 'hover:bg-slate-200'}
                                            ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <span className="flex items-center gap-2 truncate">
                                            {isLocked ? <Lock className="h-3 w-3"/> : <span className="opacity-40">{allMissions.findIndex(am => am.id === m.id) + 1}.</span>}
                                            {m.title}
                                        </span>
                                        {isCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0"/>}
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
        <div className="flex-1 flex flex-col gap-4 h-full">
            <Card className="shrink-0 bg-white border-l-4 border-l-indigo-500 shadow-sm">
                <CardHeader className="py-3 px-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">{activeMission.title}</CardTitle>
                            <p className="text-xs text-slate-600 mt-1">Goal: <span className="font-bold text-indigo-700">{activeMission.task}</span></p>
                        </div>
                        <Button variant="outline" size="sm" onClick={explainTheory} className="h-8 text-xs"><BookOpen className="h-3.5 w-3.5 mr-2"/> Concept</Button>
                    </div>
                    <div className="mt-2 p-3 bg-indigo-50/50 rounded-lg text-xs text-indigo-900 prose prose-sm max-w-none max-h-24 overflow-y-auto">
                        <ReactMarkdown>{activeMission.theory}</ReactMarkdown>
                    </div>
                </CardHeader>
            </Card>

            <div className="flex-1 flex gap-4 min-h-0">
                <div className="w-1/3 bg-slate-100 rounded-xl p-4 flex flex-col gap-2 overflow-y-auto border shadow-inner">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Logic Tools</h4>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <Button variant="outline" size="sm" className="border-slate-300 bg-white hover:bg-slate-100 text-xs" onClick={() => handleAddBlock('[NEWLINE]')}><CornerDownLeft className="h-3 w-3 mr-1"/> Enter</Button>
                        <Button variant="outline" size="sm" className="border-slate-300 bg-white hover:bg-slate-100 text-xs" onClick={() => handleAddBlock('    ')}><ArrowRight className="h-3 w-3 mr-1"/> Tab</Button>
                    </div>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Code Blocks</h4>
                    {dynamicBlocks.map((block, i) => (
                        <Button key={`${block}-${i}`} variant="secondary" onClick={() => handleAddBlock(block)}
                            className={`justify-start font-mono text-[10px] h-auto py-2 bg-white border shadow-sm hover:border-indigo-400 text-left whitespace-normal break-all rounded-lg
                            ${block.startsWith('print') ? 'border-l-4 border-l-blue-500' : ''}
                            ${block.includes('=') ? 'border-l-4 border-l-orange-500' : ''}`}
                        >
                            {block}
                        </Button>
                    ))}
                    <AdminBlockManager missionId={activeMission.id} />
                </div>

                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 bg-white rounded-xl border-2 border-dashed border-slate-200 p-4 overflow-y-auto relative font-mono text-sm shadow-inner min-h-[300px]">
                        {workspaceBlocks.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 pointer-events-none text-xs italic">Drag and drop blocks here to build your logic</div>
                        )}
                        <div className="flex flex-wrap items-center gap-2 content-start">
                            {workspaceBlocks.map((block, i) => {
                                if (block === '[NEWLINE]') return <div key={i} className="w-full h-6 border-b border-slate-100 mb-2 relative group flex items-end"><span className="absolute right-0 top-1 text-[10px] text-slate-200 select-none">↵</span><button onClick={() => handleRemoveBlock(i)} className="absolute left-0 top-1 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="h-3 w-3"/></button></div>;
                                if (block === '    ') return <div key={i} className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-200 group relative"><span className="text-xs">→</span><button onClick={() => handleRemoveBlock(i)} className="absolute -top-1 -right-1 bg-white rounded-full text-red-500 opacity-0 group-hover:opacity-100 border shadow-sm z-10"><Trash2 className="h-3 w-3"/></button></div>;
                                return (
                                    <div key={i} className={`group relative text-white px-3 py-2 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:opacity-90 transition-all text-xs font-bold ${getBlockColor(block)}`}>
                                        {block}
                                        <button onClick={() => handleRemoveBlock(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"><Trash2 className="h-2 w-2"/></button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="flex gap-2 shrink-0">
                        <Button size="sm" onClick={() => handleRun('test')} disabled={isRunning} className="bg-blue-600 hover:bg-blue-700 shadow-sm text-xs"><FlaskConical className="mr-2 h-3.5 w-3.5"/> Test</Button>
                        <Button size="sm" onClick={() => handleRun('submit')} disabled={isRunning} className="flex-1 bg-green-600 hover:bg-green-700 shadow-sm text-xs font-bold">{isRunning ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin"/> : <Play className="mr-2 h-3.5 w-3.5"/>} Submit Mission</Button>
                        <Button size="sm" variant="outline" onClick={handleHardReset} className="text-red-600 hover:bg-red-50 h-9 w-9 p-0"><Eraser className="h-4 w-4"/></Button>
                        <Button size="sm" variant="outline" onClick={() => setIsCoachOpen(true)} className="text-purple-600 border-purple-200 bg-purple-50 h-9 w-9 p-0"><Bot className="h-4 w-4"/></Button>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                        <div className="h-24 bg-black rounded-xl p-3 font-mono text-[11px] text-green-400 overflow-y-auto shadow-inner relative">
                            <div className="flex justify-between items-center opacity-50 border-b border-green-900/30 mb-2 pb-1 text-[9px]"><span>TERMINAL</span><button onClick={() => setConsoleOutput('')} className="hover:text-white cursor-pointer uppercase">Clear</button></div>
                            <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
                        </div>
                        {lastResult && !lastResult.success && (
                            <div className="bg-red-50 border border-red-100 rounded-xl p-3 animate-in slide-in-from-bottom-2 fade-in">
                                <div className="flex items-center gap-2 text-red-700 font-bold text-xs mb-2 uppercase tracking-tight"><AlertCircle className="h-3.5 w-3.5"/> Analysis Error</div>
                                <div className="grid grid-cols-2 gap-4 text-[10px] font-mono">
                                    <div><span className="text-slate-400 block mb-1 uppercase tracking-tighter">Goal:</span><div className="bg-green-100/50 text-green-800 p-2 rounded border border-green-200">{lastResult.expected}</div></div>
                                    <div><span className="text-slate-400 block mb-1 uppercase tracking-tighter">Actual:</span><div className="bg-red-100/50 text-red-800 p-2 rounded border border-red-200 break-words">{lastResult.actual || "(Nothing)"}</div></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* COACH MODAL */}
      <Dialog open={isCoachOpen} onOpenChange={setIsCoachOpen}>
          <DialogContent className="sm:max-w-[400px] rounded-3xl">
              <DialogHeader><DialogTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-purple-600"/> Code Coach</DialogTitle></DialogHeader>
              <div className="h-[300px] bg-slate-50 rounded-2xl border p-3 overflow-y-auto space-y-3">
                  {coachChat.map((msg, i) => (<div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-3 rounded-xl text-xs ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border text-slate-700 shadow-sm'}`}>{msg.text}</div></div>))}
                  {isCoachThinking && <div className="text-[10px] text-slate-400 animate-pulse italic ml-2">Coach is thinking...</div>}
              </div>
              <DialogFooter>
                  <div className="flex w-full gap-2 pt-2 border-t mt-2">
                      <Input value={userQuestion} onChange={e => setUserQuestion(e.target.value)} placeholder="Ask for a hint..." className="text-xs h-10 rounded-xl" onKeyDown={(e) => e.key === 'Enter' && handleAskCoach()} />
                      <Button onClick={handleAskCoach} size="sm" disabled={isCoachThinking || !userQuestion.trim()} className="bg-indigo-600 rounded-xl h-10 w-10 p-0"><HelpCircle className="h-4 w-4"/></Button>
                  </div>
              </DialogFooter>
          </DialogContent>
      </Dialog>

      {/* REFERENCE SHEET MODAL */}
      <Dialog open={isReferenceOpen} onOpenChange={setIsReferenceOpen}>
          <DialogContent className="max-w-2xl rounded-3xl">
              <DialogHeader><DialogTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-blue-600"/> Python Cheat Sheet</DialogTitle></DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {REFERENCE_DATA.map((item, i) => (
                      <div key={i} className="p-3 border rounded-2xl bg-slate-50">
                          <h4 className="font-bold text-sm text-indigo-700 font-mono mb-1">{item.title}</h4>
                          <p className="text-[11px] text-slate-600 mb-2 leading-tight">{item.desc}</p>
                          <code className="block bg-slate-900 text-green-400 text-[10px] p-2 rounded-xl font-mono">{item.example}</code>
                      </div>
                  ))}
              </div>
          </DialogContent>
      </Dialog>
    </div>
  );
}
