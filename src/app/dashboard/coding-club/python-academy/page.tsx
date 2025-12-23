
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { 
  Loader2, Play, Save, CheckCircle2, ChevronRight, 
  BookOpen, Code2, Terminal, Info, Layout, Cpu, 
  Globe, Database, Github, HelpCircle, FileJson, Trophy, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import confetti from 'canvas-confetti';

// --- DATA: THE STRUCTURED LEARNING PATH ---
const CODING_PHASES = [
  {
    id: "phase1",
    title: "Phase 1: Python Fundamentals",
    lessons: [
      { id: "setup", title: "Environment Setup", task: "Print your name to the terminal.", startingCode: "print('Hello, Python!')" },
      { id: "vars", title: "Variables & I/O", task: "Create a variable named 'age' and set it to 10.", startingCode: "# Type your code here\nage = " },
      { id: "logic", title: "Control Flow (If/Else)", task: "Write an if statement to check if age is > 5.", startingCode: "age = 10\nif age > 5:\n    print('Older than 5')" }
    ]
  },
  {
    id: "phase2",
    title: "Phase 2: Intermediate Python",
    lessons: [
      { id: "funcs", title: "Functions & Args", task: "Define a function that returns a greeting.", startingCode: "def greet(name):\n    return f'Hello {name}'" },
      { id: "errors", title: "Error Handling", task: "Use try/except for a division by zero.", startingCode: "try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print('Cannot divide by zero')" }
    ]
  },
  { id: "phase3", title: "Phase 3: OOP & Beyond", lessons: [] },
  { id: "phase4", title: "Phase 4: Specialization", lessons: [] }
];

// --- COMPONENT: PYTHON ACADEMY ---
export default function PythonAcademy() {
  const [activeLesson, setActiveLesson] = useState(CODING_PHASES[0].lessons[0]);
  const [code, setCode] = useState(activeLesson.startingCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isLoadingPy, setIsLoadingPy] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const pyodide = useRef<any>(null);

  // Initialize Python in Browser
  useEffect(() => {
    async function initPyodide() {
      // @ts-ignore
      if (!window.loadPyodide) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
        script.onload = async () => {
          // @ts-ignore
          pyodide.current = await window.loadPyodide();
          setIsLoadingPy(false);
        };
        document.head.appendChild(script);
      }
    }
    initPyodide();
  }, []);

  const runCode = async () => {
    if (!pyodide.current) return;
    setIsRunning(true);
    setOutput([]);
    
    // Redirect Python print() to our state
    pyodide.current.setStdout({
      batched: (str: string) => setOutput(prev => [...prev, str])
    });

    try {
      await pyodide.current.runPythonAsync(code);
    } catch (err: any) {
      setOutput(prev => [...prev, `❌ Error: ${err.message}`]);
    }
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-screen-2xl mx-auto flex flex-col gap-6">
        
        {/* HEADER */}
        <header className="flex justify-between items-center bg-slate-900 p-6 rounded-[32px] border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500 p-3 rounded-2xl shadow-lg shadow-yellow-500/20">
              <Code2 className="text-slate-900 h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">Python Pro Academy</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">From Blocks to Real-World Code</p>
            </div>
          </div>
          {isLoadingPy ? (
            <Badge variant="outline" className="bg-slate-800 border-slate-700 text-yellow-500 animate-pulse">Initializing Python Core...</Badge>
          ) : (
            <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400">● Python Engine Ready</Badge>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: CURRICULUM NAVIGATION (The Path) */}
          <aside className="lg:col-span-3 space-y-4">
            <Card className="bg-slate-900 border-slate-800 rounded-[32px]">
              <CardHeader>
                <CardTitle className="text-sm font-black text-slate-400 uppercase tracking-widest">Learning Pathway</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <Accordion type="single" collapsible className="w-full">
                  {CODING_PHASES.map((phase, idx) => (
                    <AccordionItem key={phase.id} value={phase.id} className="border-none px-2">
                      <AccordionTrigger className="hover:no-underline hover:bg-slate-800 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-yellow-500 font-bold border border-slate-700">{idx + 1}</span>
                          <span className="text-xs font-bold text-slate-200">{phase.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 space-y-1">
                        {phase.lessons.map(lesson => (
                          <button
                            key={lesson.id}
                            onClick={() => { setActiveLesson(lesson); setCode(lesson.startingCode); setOutput([]); }}
                            className={`w-full text-left px-12 py-2 text-xs font-medium rounded-lg transition-colors ${activeLesson.id === lesson.id ? 'text-yellow-500 bg-yellow-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            {lesson.title}
                          </button>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* CHEAT SHEET SECTION */}
            <Card className="bg-indigo-900/20 border-indigo-500/20 rounded-[32px]">
              <CardHeader className="flex flex-row items-center gap-2">
                <FileJson className="h-4 w-4 text-indigo-400" />
                <CardTitle className="text-xs font-black text-indigo-300 uppercase">Python Cheat Sheet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-[11px]">
                <div className="space-y-1">
                  <p className="text-indigo-400 font-bold">Print Message</p>
                  <code className="bg-slate-950 p-2 rounded block text-pink-400 font-mono">print("Hello")</code>
                </div>
                <div className="space-y-1">
                  <p className="text-indigo-400 font-bold">Variables</p>
                  <code className="bg-slate-950 p-2 rounded block text-emerald-400 font-mono">x = 10</code>
                </div>
                <div className="space-y-1">
                  <p className="text-indigo-400 font-bold">Loops (Repeat)</p>
                  <code className="bg-slate-950 p-2 rounded block text-blue-400 font-mono">for i in range(5):</code>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* CENTER: THE CODE WORKSTATION */}
          <main className="lg:col-span-6 space-y-4">
            <Card className="bg-slate-900 border-slate-800 rounded-[40px] overflow-hidden flex flex-col h-[700px] shadow-2xl">
              <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 mr-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <Badge variant="secondary" className="bg-slate-950 text-slate-400 text-[10px] border-slate-800">main.py</Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={runCode} 
                    disabled={isLoadingPy || isRunning}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 rounded-xl shadow-lg shadow-emerald-900/20"
                  >
                    {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Play className="h-4 w-4 mr-2" /> Run Script</>}
                  </Button>
                </div>
              </div>

              {/* EDITOR AREA */}
              <div className="flex-1 relative bg-[#0d1117] p-4">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full bg-transparent text-emerald-400 font-mono text-lg outline-none resize-none spellcheck-false"
                  spellCheck={false}
                  placeholder="# Write your Python code here..."
                />
                
                {/* Task Overlay */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg"><Info className="h-4 w-4 text-blue-400" /></div>
                    <p className="text-sm font-medium text-slate-300">Goal: {activeLesson.task}</p>
                  </div>
                </div>
              </div>

              {/* TERMINAL / OUTPUT */}
              <div className="h-48 bg-slate-950 border-t border-slate-800 p-4 font-mono text-sm">
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <Terminal className="h-3 w-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Python Console Output</span>
                </div>
                <ScrollArea className="h-32">
                  {output.map((line, i) => (
                    <div key={i} className="text-emerald-500/90 py-0.5">{`> ${line}`}</div>
                  ))}
                  {output.length === 0 && <div className="text-slate-700 italic">Console idle... Press "Run Script" to execute.</div>}
                </ScrollArea>
              </div>
            </Card>
          </main>

          {/* RIGHT: PROGRESS & CHALLENGES */}
          <aside className="lg:col-span-3 space-y-6">
            <Card className="bg-slate-900 border-slate-800 rounded-[32px] overflow-hidden">
              <CardHeader className="bg-slate-800/50">
                <CardTitle className="text-sm font-black flex items-center gap-2">
                  <Trophy className="text-yellow-500 h-4 w-4" /> Mastery Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Phase 1 Progress</span>
                    <span className="text-white">33%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-yellow-500 h-full w-1/3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 text-center">
                    <p className="text-2xl font-black text-white">0</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Lessons</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 text-center">
                    <p className="text-2xl font-black text-white">0</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Commits</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[32px] text-white shadow-xl">
              <Sparkles className="h-8 w-8 mb-4 text-yellow-300" />
              <h3 className="text-xl font-black mb-2">Ready for a challenge?</h3>
              <p className="text-sm opacity-80 mb-6">Build a simple calculator using the variables and input logic we just learned.</p>
              <Button className="w-full bg-white text-indigo-600 font-black rounded-xl">Start Project</Button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS (Simplified for standard UI) ---
function Badge({ children, variant, className }: any) {
  return <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${className}`}>{children}</span>;
}
