
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import confetti from 'canvas-confetti';

// --- DATA: THE STRUCTURED LEARNING PATH ---
const PYTHON_SYLLABUS = [
  {
    phase: "Phase 1",
    title: "Python Fundamentals (Weeks 1-2)",
    mainTopics: [
      {
        title: "1. Environment Setup",
        lessons: [
          { id: "p1-1-1", title: "Install Python & VS Code", task: "Run your first script to confirm Python is in your PATH.", startingCode: "import sys\nprint('Python Version:', sys.version)\nprint('Environment Ready!')" },
        ]
      },
      {
        title: "2. The Basics",
        lessons: [
          { id: "p1-2-1", title: "Print & Comments", task: "Use a # to write a comment and print a message.", startingCode: "# This is a secret note\nprint('Hello World')" },
          { id: "p1-2-2", title: "Variables", task: "Assign the number 2025 to a variable named 'year'.", startingCode: "year = \nprint(year)" },
          { id: "p1-2-3", title: "Input/Output (I/O)", task: "Use input() to ask for a color and print it.", startingCode: "color = input('Favorite color? ')\nprint('You chose: ' + color)" },
          { id: "p1-2-4", title: "Arithmetic Operators", task: "Multiply 5 by 5 using the * operator.", startingCode: "print(5 * 5)" },
          { id: "p1-2-5", title: "Comparison Operators", task: "Check if 10 is greater than 5 using >.", startingCode: "print(10 > 5)" }
        ]
      },
      {
        title: "3. Data Types",
        lessons: [
          { id: "p1-3-1", title: "Numbers (Int & Float)", task: "Create an integer and a decimal (float).", startingCode: "my_int = 10\nmy_float = 10.5\nprint(type(my_float))" },
          { id: "p1-3-2", title: "Strings", task: "Create a string with double quotes.", startingCode: "msg = \"Python is fun\"\nprint(msg)" },
          { id: "p1-3-3", title: "Booleans", task: "Set a variable to True.", startingCode: "is_sunny = \nprint(is_sunny)" }
        ]
      },
      {
        title: "4. Data Structures (Basic)",
        lessons: [
          { id: "p1-4-1", title: "Lists (Create & Access)", task: "Change the first item in the list to 'Apple'.", startingCode: "fruits = ['Orange', 'Banana']\nfruits[0] = 'Apple'\nprint(fruits)" },
          { id: "p1-4-2", title: "Tuples", task: "Create an unchangeable tuple (a, b).", startingCode: "coords = (10, 20)\nprint(coords)" },
          { id: "p1-4-3", title: "Dictionaries", task: "Access the 'age' value from the dictionary.", startingCode: "user = {'name': 'Kojo', 'age': 15}\nprint(user['age'])" },
          { id: "p1-4-4", title: "Sets", task: "Create a set with unique numbers.", startingCode: "my_set = {1, 2, 2, 3} # 2 will only appear once\nprint(my_set)" }
        ]
      },
      {
        title: "5. Control Flow",
        lessons: [
          { id: "p1-5-1", title: "If, Elif, Else", task: "Write an if statement to check if x is 10.", startingCode: "x = 10\nif x == 10:\n    print('Correct!')" },
          { id: "p1-5-2", title: "For Loops & Range()", task: "Print numbers 0 to 4 using range(5).", startingCode: "for i in range(5):\n    print(i)" },
          { id: "p1-5-3", title: "While Loops", task: "Create a loop that runs while count < 3.", startingCode: "count = 0\nwhile count < 3:\n    print(count)\n    count += 1" },
          { id: "p1-5-4", title: "Break & Continue", task: "Use 'break' to stop a loop early.", startingCode: "for i in range(10):\n    if i == 3:\n        break\n    print(i)" }
        ]
      }
    ]
  },
  {
    phase: "Phase 2",
    title: "Intermediate Python (Weeks 3-4)",
    mainTopics: [
      {
        title: "1. Functions",
        lessons: [
          { id: "p2-1-1", title: "Defining & Calling", task: "Create a function named 'welcome' that prints a greeting.", startingCode: "def welcome():\n    print('Welcome to Phase 2!')\n\nwelcome()" },
          { id: "p2-1-2", title: "Arguments (Default & Keyword)", task: "Create a function with a default 'city' argument.", startingCode: "def travel(city='Accra'):\n    print('Visiting ' + city)\n\ntravel()\ntravel(city='Kumasi')" },
          { id: "p2-1-3", title: "Advanced Args (*args, **kwargs)", task: "Use *args to accept multiple numbers and sum them.", startingCode: "def sum_all(*args):\n    return sum(args)\n\nprint(sum_all(1, 2, 3, 4))" },
          { id: "p2-1-4", title: "Lambda Expressions", task: "Write a lambda function to square a number.", startingCode: "square = lambda x: x * 2\nprint(square(5))" },
          { id: "p2-1-5", title: "Docstrings", task: "Add a description to your function using triple quotes.", startingCode: "def power(a, b):\n    \"\"\"Calculates a to the power of b.\"\"\"\n    return a ** b\n\nprint(power.__doc__)" }
        ]
      },
      {
        title: "2. Data Structures (Advanced)",
        lessons: [
          { id: "p2-2-1", title: "List Comprehensions", task: "Create a list of squares for numbers 0-4 in one line.", startingCode: "squares = [x**2 for x in range(5)]\nprint(squares)" },
          { id: "p2-2-2", title: "Dictionary Methods", task: "Use .keys() and .values() to explore the dictionary.", startingCode: "stats = {'HP': 100, 'MP': 50}\nprint(stats.keys())\nprint(stats.values())" },
          { id: "p2-2-3", title: "Set Operations", task: "Find the intersection (common items) of two sets.", startingCode: "set_a = {1, 2, 3}\nset_b = {3, 4, 5}\nprint(set_a.intersection(set_b))" }
        ]
      },
      {
        title: "3. Modules & Packages",
        lessons: [
          { id: "p2-3-1", title: "Importing (math, random)", task: "Use the math module to find the square root of 16.", startingCode: "import math\nprint(math.sqrt(16))" },
          { id: "p2-3-2", title: "The 'sys' Module", task: "Print the current Python platform using sys.", startingCode: "import sys\nprint(sys.platform)" }
        ]
      },
      {
        title: "4. File Handling",
        lessons: [
          { id: "p2-4-1", title: "Writing & Appending", task: "Simulate writing text to a virtual file.", startingCode: "# In browser, we use strings to simulate files\nfile_buffer = 'Line 1\\n'\nfile_buffer += 'Line 2 (Appended)'\nprint(file_buffer)" },
          { id: "p2-4-2", title: "Reading Files", task: "Process a multi-line string as if reading a file.", startingCode: "data = 'User: Kojo\\nRole: Admin'\nfor line in data.split('\\n'):\n    print('Reading:', line)" }
        ]
      },
      {
        title: "5. Error Handling",
        lessons: [
          { id: "p2-5-1", title: "Try, Except Blocks", task: "Catch a ValueError when converting a string to int.", startingCode: "try:\n    num = int('abc')\nexcept ValueError:\n    print('That is not a number!')" },
          { id: "p2-5-2", title: "Finally Block", task: "Use 'finally' to print a cleanup message.", startingCode: "try:\n    print(10 / 2)\nexcept:\n    print('Error')\nfinally:\n    print('Process Complete.')" }
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
    const { user } = useUser();
    const firestore = useFirestore();
    if (!user || !firestore) return;
    await setDoc(doc(firestore, 'student_coding_progress', `${user.uid}_${activeLesson.id}`), {
      userId: user.uid,
      lessonId: activeLesson.id,
      code: code,
      completed: true,
      updatedAt: serverTimestamp()
    });
  };
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
        
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
                <Accordion type="multiple" defaultValue={['phase1']} className="space-y-4">
                  {PYTHON_SYLLABUS.map((phase) => (
                    <AccordionItem key={phase.phase} value={phase.phase} className="border-none bg-slate-900/50 rounded-3xl overflow-hidden px-4">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-3">
                          <Layers className="h-4 w-4 text-yellow-500" />
                          <div className="text-left">
                            <p className="text-[10px] font-black text-yellow-500/50 uppercase">{phase.phase}</p>
                            <p className="text-sm font-bold text-white">{phase.title}</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 space-y-4">
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
          </aside>

          {/* CENTER: THE CODE WORKSTATION */}
          <main className="lg:col-span-6 space-y-4">
            <Card className="bg-slate-900 border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col h-[750px]">
              <div className="bg-slate-800/50 px-8 py-4 flex justify-between items-center border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
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

              <div className="flex-1 flex flex-col bg-[#0d1117]">
                {/* CODE EDITOR */}
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
                    <span className="text-[10px] font-black uppercase tracking-widest">System Console</span>
                  </div>
                  <ScrollArea className="h-40">
                    {output.map((line, i) => (
                      <div key={i} className="text-emerald-500/80 mb-1">{`> ${line}`}</div>
                    ))}
                    {output.length === 0 && <div className="text-slate-700 italic">Console idle... Press "Run Script" to execute.</div>}
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
