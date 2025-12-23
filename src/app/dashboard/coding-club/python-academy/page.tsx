
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { 
  Loader2, Play, Save, CheckCircle2, ChevronRight, 
  BookOpen, Code2, Terminal, Info, Layout, Cpu, 
  Globe, Database, Github, HelpCircle, FileJson, Layers, Monitor, Target, Sparkles, Trophy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import confetti from 'canvas-confetti';
import { Badge } from '@/components/ui/badge';

const PYTHON_SYLLABUS = [
  {
    phase: "Phase 1",
    title: "Python Fundamentals (Weeks 1-2)",
    mainTopics: [
      {
        title: "Environment Setup",
        lessons: [
          { id: "p1-1-1", title: "Python & VS Code Install", task: "Print 'Ready to code' to confirm setup.", startingCode: "print('Ready to code')" },
          { id: "p1-1-2", title: "Adding to PATH", task: "Run a simple calculation to check environment.", startingCode: "print(5 + 5)" }
        ]
      },
      {
        title: "The Basics",
        lessons: [
          { id: "p1-2-1", title: "Print & Comments", task: "Write a comment and print 'Hello World'.", startingCode: "# This is a comment\nprint('Hello World')" },
          { id: "p1-2-2", title: "Variables & I/O", task: "Ask for user name using input() and print it.", startingCode: "name = input('What is your name? ')\nprint('Hi ' + name)" },
          { id: "p1-2-3", title: "Operators", task: "Calculate 10 modulo 3.", startingCode: "print(10 % 3)" }
        ]
      },
      {
        title: "Data Structures (Basic)",
        lessons: [
          { id: "p1-3-1", title: "Lists", task: "Create a list of 3 fruits and print the second one.", startingCode: "fruits = ['Apple', 'Banana', 'Cherry']\nprint(fruits[1])" },
          { id: "p1-3-2", title: "Dictionaries", task: "Create a dict for a car with 'brand' and 'year'.", startingCode: "car = {\n  'brand': 'Ford',\n  'year': 2020\n}\nprint(car)" }
        ]
      }
    ]
  },
  {
    phase: "Phase 2",
    title: "Intermediate Python (Weeks 3-4)",
    mainTopics: [
      {
        title: "Functions",
        lessons: [
          { id: "p2-1-1", title: "Defining Functions", task: "Create a function that adds two numbers.", startingCode: "def add(a, b):\n    return a + b\n\nprint(add(5, 5))" },
          { id: "p2-1-2", title: "Lambda Expressions", task: "Write a lambda that doubles a number.", startingCode: "double = lambda x: x * 2\nprint(double(10))" }
        ]
      },
      {
        title: "File Handling",
        lessons: [
          { id: "p2-2-1", title: "Reading Files", task: "Try to open a hypothetical file (simulated).", startingCode: "# In browser we simulate file text\nfile_content = 'Sample Data'\nprint(file_content)" }
        ]
      }
    ]
  },
  {
    phase: "Phase 3",
    title: "OOP & Beyond (Weeks 5-6)",
    mainTopics: [
      {
        title: "OOP Concepts",
        lessons: [
          { id: "p3-1-1", title: "Classes & Objects", task: "Create a Dog class with a bark method.", startingCode: "class Dog:\n    def bark(self):\n        print('Woof!')\n\nmy_dog = Dog()\nmy_dog.bark()" }
        ]
      }
    ]
  }
];


// --- COMPONENT: PYTHON ACADEMY ---
export default function PythonAcademy() {
  const [activeLesson, setActiveLesson] = useState(PYTHON_SYLLABUS[0].mainTopics[0].lessons[0]);
  const [code, setCode] = useState(activeLesson.startingCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isLoadingPy, setIsLoadingPy] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const pyodide = useRef<any>(null);

  // Initialize Python in Browser
  useEffect(() => {
    async function initPyodide() {
      // @ts-ignore
      if (window.loadPyodide) {
        // @ts-ignore
        pyodide.current = await window.loadPyodide();
        setIsLoadingPy(false);
      } else {
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
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch (err: any) {
      setOutput(prev => [...prev, `❌ Error: ${err.message}`]);
    }
    setIsRunning(false);
  };
  
  const saveProgress = async () => {
    if (!user || !firestore) return;
    await setDoc(doc(firestore, 'student_coding_progress', `${user.uid}_${activeLesson.id}`), {
      userId: user.uid,
      lessonId: activeLesson.id,
      code: code,
      completed: true,
      updatedAt: serverTimestamp()
    });
  };
  
  const user = {}; // Placeholder
  const firestore = {}; // Placeholder

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
                  {PYTHON_SYLLABUS.map((phase, idx) => (
                    <AccordionItem key={phase.phase} value={phase.phase} className="border-none px-2">
                      <AccordionTrigger className="hover:no-underline hover:bg-slate-800 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-yellow-500 font-bold border border-slate-700">{idx + 1}</span>
                          <span className="text-xs font-bold text-slate-200">{phase.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 space-y-4">
                        {phase.mainTopics.map((topic) => (
                          <div key={topic.title} className="space-y-2">
                            <p className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-tighter">{topic.title}</p>
                            <div className="space-y-1">
                              {topic.lessons.map((lesson) => (
                                <button
                                  key={lesson.id}
                                  onClick={() => { setActiveLesson(lesson); setCode(lesson.startingCode); setOutput([]); }}
                                  className={`w-full text-left px-4 py-2 rounded-xl text-xs transition-all flex items-center justify-between group ${activeLesson.id === lesson.id ? 'bg-yellow-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}
                                >
                                  {lesson.title}
                                  <ChevronRight className={`h-3 w-3 ${activeLesson.id === lesson.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                </button>
                              ))}
                            </div>
                          </div>
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
            <Card className="bg-slate-900 border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col h-[750px]">
              <div className="bg-slate-800/50 px-8 py-4 flex justify-between items-center border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5 mr-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
                  </div>
                  <Badge variant="outline" className="bg-slate-950 text-slate-500 border-slate-800 font-mono text-[10px]">main.py</Badge>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveProgress} variant="ghost" className="text-slate-400 hover:text-white"><Save className="h-4 w-4 mr-2" /> Save</Button>
                  <Button 
                    onClick={runCode} 
                    disabled={isLoadingPy || isRunning}
                    className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black px-8 rounded-xl shadow-lg shadow-yellow-900/20"
                  >
                    {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Play className="h-4 w-4 mr-2 fill-current" /> Run</>}
                  </Button>
                </div>
              </div>

              {/* EDITOR AREA */}
              <div className="flex-1 flex flex-col bg-[#0d1117]">
                <div className="flex-1 p-6 relative">
                   <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full bg-transparent text-emerald-400 font-mono text-lg outline-none resize-none"
                    spellCheck={false}
                    placeholder="# Write your Python code here..."
                  />
                  
                  {/* FLOATING MISSION BOX */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-500/20 p-2 rounded-lg"><Target className="h-4 w-4 text-indigo-400" /></div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Mission</p>
                          <p className="text-sm font-bold text-white">{activeLesson.task}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TERMINAL */}
                <div className="h-60 bg-black border-t border-slate-800 p-6 font-mono text-sm shadow-inner">
                  <div className="flex items-center gap-2 mb-4 text-slate-600">
                    <Terminal className="h-3 w-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">System Console Output</span>
                  </div>
                  <ScrollArea className="h-40">
                    {output.map((line, i) => (
                      <div key={i} className="text-emerald-500/80 mb-1">{`> ${line}`}</div>
                    ))}
                    {output.length === 0 && <div className="text-slate-800 italic">Console idle... Press "Run Script" to execute.</div>}
                  </ScrollArea>
                </div>
              </div>
            </Card>
          </main>

          {/* RIGHT: CHEAT SHEET & TIPS */}
          <aside className="lg:col-span-3 space-y-6">
            <Card className="bg-slate-900 border-slate-800 rounded-[32px] overflow-hidden">
              <CardHeader className="bg-slate-800/50">
                <CardTitle className="text-xs font-black text-indigo-400 uppercase flex items-center gap-2">
                  <FileJson className="h-4 w-4" /> Python Cheat Sheet
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-white">Variables</p>
                      <code className="block bg-black p-3 rounded-xl text-emerald-500 text-[10px] border border-slate-800">
                        name = "Kojo" <br/>
                        age = 15 <br/>
                        is_coding = True
                      </code>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-white">Control Flow</p>
                      <code className="block bg-black p-3 rounded-xl text-blue-400 text-[10px] border border-slate-800">
                        if age {'>'} 10: <br/>
                        &nbsp;&nbsp;print("Big kid") <br/>
                        else: <br/>
                        &nbsp;&nbsp;print("Junior")
                      </code>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-white">Loops</p>
                      <code className="block bg-black p-3 rounded-xl text-purple-400 text-[10px] border border-slate-800">
                        for i in range(5): <br/>
                        &nbsp;&nbsp;print(i)
                      </code>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* LEARNING TIPS */}
            <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[32px] text-white shadow-xl">
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

    