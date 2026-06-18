'use client';

import { useState, useMemo, useEffect } from 'react';
import { CURRICULUM, Mission } from '@/lib/logic-lab-data';
import { interpretBlockCodeAction, getCodeCoachResponseAction, explainCodingConceptAction } from '@/ai/flows/logic-lab-actions';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, getDoc, onSnapshot, collection, query } from 'firebase/firestore';
import { 
  Play, RotateCcw, HelpCircle, CheckCircle2, Lock, 
  Code2, Bot, Trash2, BookOpen, CornerDownLeft, ArrowRight, Loader2, Eraser, AlertCircle, FlaskConical, Trophy, Info, FolderOpen, Puzzle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { Badge } from '@/components/ui/badge';

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

  // Helper: Get Color based on Block Type (Fuchsia & Violet cyber theme palette)
  const getBlockColor = (text: string) => {
    if (text.startsWith('if') || text.startsWith('else') || text.includes('==') || text.includes('>')) return 'bg-violet-650 hover:bg-violet-600 border-violet-750 text-white';
    if (text.startsWith('for') || text.startsWith('while')) return 'bg-amber-600 hover:bg-amber-500 border-amber-700 text-white';
    if (text.startsWith('print') || text.startsWith('input')) return 'bg-fuchsia-600 hover:bg-fuchsia-500 border-fuchsia-700 text-white shadow-[0_0_8px_rgba(217,70,239,0.25)]';
    if (text.includes('=') && !text.includes('==')) return 'bg-indigo-600 hover:bg-indigo-500 border-indigo-700 text-white'; 
    return 'bg-blue-600 hover:bg-blue-500 border-blue-700 text-white'; 
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
    setTimeout(() => setConsoleOutput('Compiling blocks & executing script...'), 50);

    const result = await interpretBlockCodeAction(workspaceBlocks, schoolId);
    
    if (result.success) {
        setConsoleOutput(result.output);
        const normOutput = result.output.replace(/\s+/g, '').toLowerCase();
        const normExpected = activeMission.expectedOutput.replace(/\s+/g, '').toLowerCase();
        const isSuccess = normOutput === normExpected || result.output.includes(activeMission.expectedOutput);

        if (isSuccess) {
             confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#d946ef', '#4f46e5', '#10b981'] });
        }

        if (mode === 'test') {
            setIsRunning(false);
            if (isSuccess) toast({ title: "Correct Code!", description: "Great job! Click 'Submit Mission' to save.", className: "bg-emerald-600 text-white" });
            return; 
        }

        if (isSuccess) {
            setLastResult({ success: true, actual: result.output, expected: activeMission.expectedOutput });
            toast({ title: "Mission Accomplished!", description: "Progress saved to your profile.", className: "bg-emerald-600 text-white" });
            
            if (!completedMissions.includes(currentMissionIndex)) {
                const newCompleted = [...completedMissions, currentMissionIndex];
                setCompletedMissions(newCompleted);
                if (user && firestore) {
                    await setDoc(doc(firestore, 'student_progress', user.uid), { logicLabCompleted: newCompleted }, { merge: true });
                }
            }
        } else {
            setLastResult({ success: false, actual: result.output, expected: activeMission.expectedOutput });
            toast({ variant: 'destructive', title: "Incorrect Output", description: "The code ran, but did not match the expected goal." });
        }
    } else {
        setConsoleOutput(`Compilation Error: ${result.output}`);
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
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-fuchsia-500" /></div>;
  }
  
  return (
    <div className="flex flex-col flex-1 gap-6 p-1 text-slate-100">
      
      {/* --- TOP BAR: GAMIFICATION --- */}
      <div className="flex items-center justify-between bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl shrink-0">
        <div className="flex items-center gap-3">
             <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 p-2.5 rounded-full"><Trophy className="h-5 w-5 text-fuchsia-400" /></div>
             <div>
                 <div className="text-[10px] text-slate-455 font-bold uppercase tracking-wider text-slate-400">Student Rank</div>
                 <div className="text-sm font-bold text-white flex items-center gap-2">
                     {completedMissions.length < 5 ? "Novice Coder 👶" : completedMissions.length < 15 ? "Python Apprentice 🐍" : "Code Wizard 🧙"}
                     <Badge className="bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 text-[9px] py-0.5">{completedMissions.length} Stars</Badge>
                 </div>
             </div>
        </div>
        <div className="flex-1 mx-8 hidden sm:block">
             <div className="flex justify-between text-[10px] mb-1">
                 <span className="font-bold uppercase tracking-wider text-slate-400">Syllabus Completion</span>
                 <span className="font-bold text-fuchsia-400">{progressPercentage}%</span>
             </div>
             <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-900">
                 <div className="bg-gradient-to-r from-fuchsia-500 to-violet-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
             </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsReferenceOpen(true)} className="bg-slate-900 border-slate-800 text-fuchsia-400 hover:text-white rounded-xl h-10 hover:bg-slate-850 px-4 transition-all flex items-center gap-1.5 text-xs font-semibold">
            <Info className="h-4.5 w-4.5 mr-0.5 text-fuchsia-400"/> Cheat Sheet
        </Button>
      </div>

      <div className="flex flex-1 gap-6 min-h-[600px] items-stretch">
        {/* SIDEBAR */}
        <Card className="w-1/4 flex flex-col h-full bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-900 bg-slate-950 flex items-center justify-between shrink-0">
                <h2 className="text-white font-extrabold flex items-center gap-2 text-md tracking-tight">
                  <Code2 className="h-5 w-5 text-fuchsia-400"/> Curriculum
                </h2>
                <span className="text-[10px] text-slate-500 font-mono">{allMissions.length} chapters</span>
            </div>
            <ScrollArea className="flex-grow p-4">
                {Object.entries(groupedMissions).map(([section, missions]) => (
                    <div key={section} className="mb-6">
                        <h3 className="text-[10px] font-black uppercase text-slate-550 mb-2 tracking-widest text-slate-500">{section}</h3>
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
                                        className={`w-full text-left p-3 rounded-xl text-xs font-medium flex items-center justify-between transition-all
                                            ${isActive ? 'bg-fuchsia-600 text-white font-bold shadow-md shadow-fuchsia-500/20' : 'hover:bg-slate-900 text-slate-400 hover:text-slate-100'}
                                            ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <span className="flex items-center gap-2 truncate">
                                            {isLocked ? <Lock className="h-3.5 w-3.5 text-slate-600"/> : <span className="opacity-40 font-mono">{allMissions.findIndex(am => am.id === m.id) + 1}.</span>}
                                            {m.title}
                                        </span>
                                        {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0"/>}
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
        <div className="flex-1 flex flex-col gap-6 h-full min-w-0">
            <Card className="shrink-0 bg-slate-900/30 border border-slate-900 rounded-3xl shadow-lg relative overflow-hidden">
                <CardHeader className="py-4 px-6 relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg font-black text-white">{activeMission.title}</CardTitle>
                            <p className="text-xs text-slate-450 mt-1 text-slate-400 leading-relaxed">Goal: <span className="font-bold text-fuchsia-400">{activeMission.task}</span></p>
                        </div>
                        <Button variant="outline" size="sm" onClick={explainTheory} className="h-8 text-xs border-slate-800 hover:bg-slate-850 hover:text-white rounded-xl"><BookOpen className="h-3.5 w-3.5 mr-1.5 text-fuchsia-400"/> Concepts</Button>
                    </div>
                    <div className="mt-3 p-4 bg-slate-950 border border-slate-900 rounded-xl text-xs text-slate-300 overflow-y-auto leading-relaxed max-h-24 shadow-inner">
                        <ReactMarkdown>{activeMission.theory}</ReactMarkdown>
                    </div>
                </CardHeader>
            </Card>

            <div className="flex-grow flex gap-4 min-h-0 items-stretch">
                {/* TOOLBOX */}
                <div className="w-1/3 bg-slate-900/30 border border-slate-900 rounded-3xl p-5 flex flex-col gap-3 overflow-y-auto shadow-inner">
                    <h4 className="text-[10px] font-black uppercase text-slate-550 tracking-widest text-slate-555 text-slate-500">Editor inputs</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                        <Button variant="outline" size="sm" className="border-slate-800 bg-slate-950 hover:bg-slate-900 text-xs text-slate-300 rounded-xl h-10 transition-all" onClick={() => handleAddBlock('[NEWLINE]')}><CornerDownLeft className="h-3.5 w-3.5 mr-1 text-fuchsia-400"/> Enter</Button>
                        <Button variant="outline" size="sm" className="border-slate-800 bg-slate-950 hover:bg-slate-900 text-xs text-slate-300 rounded-xl h-10 transition-all" onClick={() => handleAddBlock('    ')}><ArrowRight className="h-3.5 w-3.5 mr-1 text-fuchsia-400"/> Tab</Button>
                    </div>
                    <h4 className="text-[10px] font-black uppercase text-slate-550 tracking-widest mt-2 text-slate-500">Available Logic Blocks</h4>
                    <div className="space-y-2.5">
                        {dynamicBlocks.map((block, i) => (
                            <Button 
                                key={`${block}-${i}`} 
                                variant="secondary" 
                                onClick={() => handleAddBlock(block)}
                                className={cn(
                                    "justify-start font-mono text-[10.5px] h-auto py-2.5 px-3 bg-slate-950 border border-slate-850 shadow-sm hover:border-fuchsia-500/40 text-left whitespace-normal break-all rounded-xl text-slate-200 w-full transition-all duration-200",
                                    block.startsWith('print') && 'border-l-4 border-l-fuchsia-500 bg-fuchsia-500/5',
                                    block.includes('=') && !block.includes('==') && 'border-l-4 border-l-indigo-500 bg-indigo-500/5',
                                    (block.startsWith('if') || block.startsWith('else')) && 'border-l-4 border-l-violet-500 bg-violet-500/5'
                                )}
                            >
                                {block}
                            </Button>
                        ))}
                    </div>
                    <AdminBlockManager missionId={activeMission.id} />
                </div>

                {/* WORKSPACE & TERMINAL */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0">
                    <div className="flex-1 bg-slate-950 border border-slate-900 rounded-3xl p-5 overflow-y-auto relative font-mono text-sm shadow-inner min-h-[280px]">
                        {workspaceBlocks.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-550 text-slate-500 pointer-events-none text-center p-6 space-y-2">
                                <Puzzle className="h-10 w-10 text-slate-700 animate-pulse"/>
                                <p className="text-xs font-semibold">Workspace Empty</p>
                                <p className="text-[10px] italic">Select blocks from the toolbox to build your logic structure here.</p>
                            </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2 content-start">
                            {workspaceBlocks.map((block, i) => {
                                if (block === '[NEWLINE]') return <div key={i} className="w-full h-8 border-b border-slate-900 relative group flex items-end mb-2"><span className="absolute right-2 bottom-1.5 text-[10px] text-slate-600 select-none">↵ Enter</span><button onClick={() => handleRemoveBlock(i)} className="absolute left-2 top-0.5 text-rose-500/60 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="h-3.5 w-3.5"/></button></div>;
                                if (block === '    ') return <div key={i} className="w-8 h-8 bg-slate-900/60 border border-slate-850 rounded-lg flex items-center justify-center text-slate-500 group relative shadow-inner"><span className="text-xs font-bold">→</span><button onClick={() => handleRemoveBlock(i)} className="absolute -top-1.5 -right-1.5 bg-slate-950 rounded-full text-rose-500 p-0.5 opacity-0 group-hover:opacity-100 border border-slate-800 shadow-sm z-10 hover:text-rose-400 transition-all"><Trash2 className="h-3 w-3"/></button></div>;
                                return (
                                    <div key={i} className={`group relative px-3.5 py-2.5 rounded-xl shadow-md cursor-grab active:cursor-grabbing hover:opacity-90 transition-all text-xs font-bold ${getBlockColor(block)}`}>
                                        {block}
                                        <button onClick={() => handleRemoveBlock(i)} className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"><Trash2 className="h-3 w-3"/></button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="flex gap-2.5 shrink-0">
                        <Button size="sm" onClick={() => handleRun('test')} disabled={isRunning || workspaceBlocks.length === 0} className="bg-slate-900 hover:bg-slate-850 text-blue-400 hover:text-white border border-slate-800 font-bold h-11 rounded-xl shadow-lg px-4 flex items-center gap-1.5 transition-all text-xs">
                            <FlaskConical className="h-4 w-4"/> Test Run
                        </Button>
                        <Button size="sm" onClick={() => handleRun('submit')} disabled={isRunning || workspaceBlocks.length === 0} className="flex-1 bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 text-white font-black h-11 rounded-xl shadow-lg shadow-fuchsia-500/25 flex items-center justify-center gap-2 transition-all text-xs">
                            {isRunning ? <Loader2 className="animate-spin h-4 w-4"/> : <Play className="h-4 w-4 fill-current"/>} 
                            Submit Mission
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleHardReset} className="text-slate-400 border border-slate-800 hover:bg-rose-500/10 hover:text-rose-455 h-11 w-11 rounded-xl shrink-0 transition-all flex items-center justify-center text-rose-400"><Eraser className="h-4.5 w-4.5"/></Button>
                        <Button size="sm" variant="outline" onClick={() => setIsCoachOpen(true)} className="text-purple-400 border border-slate-800 hover:bg-purple-500/10 hover:text-purple-355 h-11 w-11 rounded-xl shrink-0 transition-all flex items-center justify-center bg-purple-950/20"><Bot className="h-4.5 w-4.5"/></Button>
                    </div>

                    <div className="flex flex-col gap-3 shrink-0">
                        <div className="h-28 bg-slate-950 border border-slate-900 rounded-2xl p-4 font-mono text-[11px] text-emerald-400 overflow-y-auto shadow-inner relative">
                            <div className="flex justify-between items-center opacity-60 border-b border-slate-900/60 mb-2 pb-1.5 text-[9px] text-slate-500 font-mono"><span>SIMULATION TERMINAL</span><button onClick={() => setConsoleOutput('')} className="hover:text-white cursor-pointer uppercase font-bold text-[8px]">Clear</button></div>
                            <pre className="whitespace-pre-wrap leading-relaxed">{consoleOutput}</pre>
                        </div>
                        {lastResult && !lastResult.success && (
                            <div className="bg-rose-950/20 border border-rose-900/30 rounded-2xl p-4 animate-in slide-in-from-bottom-2 fade-in">
                                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-3 uppercase tracking-wider"><AlertCircle className="h-4.5 w-4.5"/> Logic Validation Error</div>
                                <div className="grid grid-cols-2 gap-4 text-[10.5px] font-mono">
                                    <div><span className="text-slate-500 block mb-1 uppercase tracking-wider font-bold text-[9px]">Expected Goal Output:</span><div className="bg-emerald-950/20 text-emerald-300 p-2.5 rounded-xl border border-emerald-900/30 whitespace-pre">{lastResult.expected}</div></div>
                                    <div><span className="text-slate-500 block mb-1 uppercase tracking-wider font-bold text-[9px]">Actual Received:</span><div className="bg-rose-950/20 text-rose-300 p-2.5 rounded-xl border border-rose-900/30 break-words whitespace-pre">{lastResult.actual || "(Terminal Empty)"}</div></div>
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
          <DialogContent className="sm:max-w-[420px] bg-slate-950 border border-slate-900 text-slate-100 rounded-3xl shadow-2xl p-6">
              <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-white font-extrabold text-lg"><Bot className="h-5.5 w-5.5 text-fuchsia-400"/> Code Coach Guidance</DialogTitle>
              </DialogHeader>
              <div className="h-[300px] bg-slate-900/40 rounded-2xl border border-slate-900 p-4 overflow-y-auto space-y-3 shadow-inner mt-2">
                  {coachChat.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={cn(
                              "max-w-[85%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed",
                              msg.role === 'user' ? 'bg-fuchsia-600 text-white font-medium rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                          )}>
                              {msg.text}
                          </div>
                      </div>
                  ))}
                  {isCoachThinking && <div className="text-[10px] text-slate-500 animate-pulse italic ml-2">Coach is thinking...</div>}
              </div>
              <DialogFooter className="mt-4 border-t border-slate-900 pt-3">
                  <div className="flex w-full gap-2 items-center">
                      <Input value={userQuestion} onChange={e => setUserQuestion(e.target.value)} placeholder="Ask for a concept hint..." className="bg-slate-900 border-slate-800 text-white rounded-xl h-10 text-xs" onKeyDown={(e) => e.key === 'Enter' && handleAskCoach()} />
                      <Button onClick={handleAskCoach} size="sm" disabled={isCoachThinking || !userQuestion.trim()} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl h-10 w-10 p-0 shrink-0"><HelpCircle className="h-4.5 w-4.5"/></Button>
                  </div>
              </DialogFooter>
          </DialogContent>
      </Dialog>

      {/* REFERENCE SHEET MODAL */}
      <Dialog open={isReferenceOpen} onOpenChange={setIsReferenceOpen}>
          <DialogContent className="max-w-2xl bg-slate-950 border border-slate-900 text-slate-100 rounded-3xl shadow-2xl p-6">
              <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-white font-extrabold text-lg"><Info className="h-5.5 w-5.5 text-fuchsia-400"/> Python Cheat Sheet & Reference</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 overflow-y-auto max-h-[70vh] p-1">
                  {REFERENCE_DATA.map((item, i) => (
                      <div key={i} className="p-4 border border-slate-900 rounded-2xl bg-slate-900/40 backdrop-blur-sm">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-fuchsia-400 font-mono mb-1">{item.title}</h4>
                          <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">{item.desc}</p>
                          <code className="block bg-slate-950 text-emerald-400 text-[10px] p-2.5 rounded-xl border border-slate-900/80 font-mono whitespace-pre">{item.example}</code>
                      </div>
                  ))}
              </div>
          </DialogContent>
      </Dialog>
    </div>
  );
}
