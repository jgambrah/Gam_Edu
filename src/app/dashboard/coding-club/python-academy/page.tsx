
'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Input } from '@/components/ui/input';

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
          { id: "p2-1-4", title: "Lambda Expressions", task: "Write a lambda function to square a number.", startingCode: "square = lambda x: x * x\nprint(square(5))" },
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
  },
  {
    phase: "Phase 3",
    title: "Object-Oriented Programming (OOP) & Beyond (Weeks 5-6)",
    mainTopics: [
      {
        title: "1. OOP Concepts",
        lessons: [
          { id: "p3-1-1", title: "Classes & Objects", task: "Define a 'Robot' class and create an instance of it.", startingCode: "class Robot:\n    pass\n\nmy_bot = Robot()\nprint('Robot created!')" },
          { id: "p3-1-2", title: "Attributes & Methods", task: "Add a 'greet' method to the Robot class.", startingCode: "class Robot:\n    def __init__(self, name):\n        self.name = name\n    \n    def greet(self):\n        print(f'Hello, I am {self.name}')\n\nbot = Robot('Dexter')\nbot.greet()" },
          { id: "p3-1-3", title: "Inheritance", task: "Create a 'BattleBot' that inherits from 'Robot'.", startingCode: "class Robot:\n    def info(self): print('I am a robot')\n\nclass BattleBot(Robot):\n    def attack(self): print('Firing lasers!')\n\nhero = BattleBot()\nhero.info()\nhero.attack()" },
          { id: "p3-1-4", title: "Encapsulation", task: "Use a double underscore (__) to make an attribute private.", startingCode: "class Bank:\n    def __init__(self):\n        self.__balance = 1000 # Private\n\n    def get_val(self): return self.__balance\n\nacc = Bank()\nprint(acc.get_val())" },
          { id: "p3-1-5", title: "Polymorphism", task: "Override a parent method in a child class.", startingCode: "class Animal:\n    def speak(self): pass\n\nclass Dog(Animal):\n    def speak(self): print('Woof!')\n\nclass Cat(Animal):\n    def speak(self): print('Meow!')\n\nfor a in [Dog(), Cat()]: a.speak()" }
        ]
      },
      {
        title: "2. Advanced Topics",
        lessons: [
          { id: "p3-2-1", title: "Regular Expressions (RegEx)", task: "Use the 're' module to find all numbers in a string.", startingCode: "import re\ntext = 'Price is 100 dollars'\nnums = re.findall(r'\\d+', text)\nprint(nums)" },
          { id: "p3-2-2", title: "Decorators", task: "Create a decorator that prints a message before a function runs.", startingCode: "def my_decorator(func):\n    def wrapper():\n        print('Starting...')\n        func()\n    return wrapper\n\n@my_decorator\ndef say_hi(): print('Hi!')\n\nsay_hi()" },
          { id: "p3-2-3", title: "Generators", task: "Use 'yield' to create a simple number generator.", startingCode: "def count_up():\n    yield 1\n    yield 2\n\nfor n in count_up(): print(n)" },
          { id: "p3-2-4", title: "Context Managers", task: "Use the 'with' statement for safe operations.", startingCode: "# Simulated context manager\nclass MySafeOpen:\n    def __enter__(self): print('Opened'); return self\n    def __exit__(self, *args): print('Closed')\n\nwith MySafeOpen():\n    print('Working...')" }
        ]
      },
      {
        title: "3. Standard Library Deep Dive",
        lessons: [
          { id: "p3-3-1", title: "JSON & Data", task: "Convert a Python dictionary into a JSON string.", startingCode: "import json\nuser = {'id': 1, 'active': True}\njson_data = json.dumps(user)\nprint(json_data)" },
          { id: "p3-3-2", title: "CSV Handling", task: "Simulate reading spreadsheet data using split.", startingCode: "csv_data = 'Name,Age\\nKojo,15\\nAbena,14'\nfor row in csv_data.split('\\n'):\n    print(row.split(','))" },
          { id: "p3-3-3", title: "OS & Datetime", task: "Print the current date and time.", startingCode: "from datetime import datetime\nnow = datetime.now()\nprint('Current Time:', now.strftime('%H:%M:%S'))" }
        ]
      }
    ]
  },
  {
    phase: "Phase 4",
    title: "Specialization (Weeks 7-8)",
    mainTopics: []
  }
];

// --- COMPONENT: PYTHON ACADEMY ---
export default function PythonAcademy() {
  const [activeLesson, setActiveLesson] = useState(PYTHON_SYLLABUS[0].mainTopics[0].lessons[0]);
  const [code, setCode] = useState(activeLesson.startingCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isLoadingPy, setIsLoadingPy] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
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
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 font-sans">
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
              <div className="bg-slate-800/50 px-8 py-4 flex justify-between items-center border-b border-slate-700">
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
                  className="w-full h-full bg-transparent text-emerald-400 font-mono text-lg outline-none resize-none"
                  spellCheck={false}
                  placeholder="# Write your Python code here..."
                />
                
                {/* FLOATING MISSION BOX */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-2xl flex items-center justify-between">
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

              {/* TERMINAL / OUTPUT */}
              <div className="h-60 bg-black border-t border-slate-800 p-6 font-mono text-sm shadow-inner">
                <div className="flex items-center gap-2 mb-4 text-slate-600">
                  <Terminal className="h-3 w-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Python Console Output</span>
                </div>
                <ScrollArea className="h-40">
                  {output.map((line, i) => (
                    <div key={i} className="text-emerald-500/80 mb-1">{`>>> ${line}`}</div>
                  ))}
                  {output.length === 0 && <div className="text-slate-800 italic">No output yet. Run your code to see results.</div>}
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

    