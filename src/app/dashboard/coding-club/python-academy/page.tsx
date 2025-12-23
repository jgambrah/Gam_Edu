
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
          { id: "p1-2-2", title: "Variables", task: "Assign the number 2025 to a variable named 'year'.", startingCode: "year = 2025\nprint(year)" },
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
          { id: "p1-3-3", title: "Booleans", task: "Set a variable to True.", startingCode: "is_sunny = True\nprint(is_sunny)" }
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
    title: "Specialization & Projects (Weeks 7+)",
    mainTopics: [
      {
        title: "1. Choose a Path",
        lessons: [
          { 
            id: "p4-1-1", 
            title: "Data Science (NumPy)", 
            task: "Create a 1D array and calculate the mean (average).", 
            startingCode: "import numpy as np\n\ndata = np.array([10, 20, 30, 40, 50])\nprint('Average:', np.mean(data))" 
          },
          { 
            id: "p4-1-2", 
            title: "Web Dev Logic (Routing)", 
            task: "Simulate a web router using a dictionary of functions.", 
            startingCode: "def home(): return 'Home Page'\ndef about(): return 'About Page'\n\nroutes = {'/': home, '/about': about}\n\n# Simulate a user visiting '/about'\npath = '/about'\nprint(routes[path]())" 
          },
          { 
            id: "p4-1-3", 
            title: "Automation (Requests)", 
            task: "Simulate an API request to fetch user data.", 
            startingCode: "# In browser we simulate the request result\napi_response = {'id': 1, 'status': 'online'}\nif api_response['status'] == 'online':\n    print('Server is active!')" 
          }
        ]
      },
      {
        title: "2. Project-Based Learning",
        lessons: [
          { 
            id: "p4-2-1", 
            title: "Project: Smart Calculator", 
            task: "Build a function that performs +, -, *, or / based on input.", 
            startingCode: "def calc(a, b, op):\n    if op == '+': return a + b\n    # Add other operators here\n\nprint(calc(10, 5, '+'))" 
          },
          { 
            id: "p4-2-2", 
            title: "Project: Text-Based Game", 
            task: "Create a simple 'Choose your Adventure' logic.", 
            startingCode: "print('You are in a dark room.')\nchoice = 'left' # Simulated input\nif choice == 'left':\n    print('You found a treasure!')\nelse:\n    print('A monster caught you!')" 
          }
        ]
      },
      {
        title: "3. Version Control (Git)",
        lessons: [
          { 
            id: "p4-3-1", 
            title: "Git Fundamentals", 
            task: "Practice the string commands for a standard Git workflow.", 
            startingCode: "commands = [\n    'git init',\n    'git add .',\n    'git commit -m \"First commit\"',\n    'git push origin main'\n]\nfor cmd in commands:\n    print('Executing:', cmd)" 
          },
          { 
            id: "p4-3-2", 
            title: "Collaboration on GitHub", 
            task: "Simulate a code 'Pull Request' logic.", 
            startingCode: "repo = {'main': 'Code V1', 'branch': 'New Feature'}\ndef merge():\n    repo['main'] = repo['branch']\n    print('Merged successfully!')\n\nmerge()\nprint(repo['main'])" 
          }
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
    
    pyodide.current.setStdout({
      batched: (str: string) => setOutput(prev => [...prev, str])
    });

    try {
      // Add this inside your runCode function before running pyodide.runPythonAsync
      if (code.includes("import numpy")) {
          await pyodide.current.loadPackage("numpy");
      }
      if (code.includes("import pandas")) {
          await pyodide.current.loadPackage("pandas");
      }
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
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIDEBAR: NAVIGATION */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="bg-yellow-500 p-2 rounded-xl"><Monitor className="text-slate-900" /></div>
            <div>
              <h2 className="text-xl font-black text-white">Python Path</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Curriculum Explorer</p>
            </div>
          </div>

          <ScrollArea className="h-[80vh] pr-4">
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
          </ScrollArea>
        </aside>

        {/* MAIN: EDITOR & WORKSTATION */}
        <main className="lg:col-span-6 space-y-6">
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
                    <div key={i} className="text-emerald-500/80 mb-1">{`>>> ${line}`}</div>
                  ))}
                  {output.length === 0 && <div className="text-slate-700 italic">No output yet. Run your code to see results.</div>}
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

          <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[32px] text-white shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="text-yellow-400 h-5 w-5" />
              <h3 className="text-lg font-black tracking-tight">Pro Tips</h3>
            </div>
            <ul className="space-y-3">
              {["Practice Daily: Consistency is key.", "Build Projects: Apply what you learn.", "Read the Docs.", "GitHub is your friend."].map((tip, i) => (
                <li key={i} className="flex gap-2 text-xs font-medium opacity-80">
                  <span className="text-yellow-400">★</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </aside>

      </div>
    </div>
  );
}

```
- src/app/dashboard/reports/financials/page.tsx:
```tsx
'use client';

import { useState, useMemo, useRef } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { 
  Printer, Filter, TrendingUp, TrendingDown, Scale, 
  BookOpen, FileBarChart, DollarSign, CalendarIcon, Loader2, Landmark 
} from 'lucide-react';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Account, JournalEntry } from '@/lib/types';


// --- HELPER: Report Logic ---
type AccountBalance = {
    id: string;
    code: string;
    name: string;
    type: string;
    debit: number;
    credit: number;
    net: number; // Positive = Debit Balance, Negative = Credit Balance
};

// --- COMPONENT: Detailed Ledger ---
function GeneralLedger({ 
    accounts, 
    journals 
}: { 
    accounts: Account[], 
    journals: JournalEntry[] 
}) {
    const [selectedAccountId, setSelectedAccountId] = useState<string>('all');

    // Filter journals to find lines affecting specific account
    const ledgerData = useMemo(() => {
        if (!journals || !accounts) return [];
        
        if (selectedAccountId === 'all') return [];

        const account = accounts.find(a => a.id === selectedAccountId);
        if (!account) return [];

        const lines: any[] = [];
        let runningBalance = 0;

        const sortedJournals = [...journals].sort((a,b) => a.date.seconds - b.date.seconds);

        sortedJournals.forEach(journal => {
            const line = journal.lines.find(l => l.accountId === selectedAccountId);
            if (line) {
                let change = 0;
                if (['Asset', 'Expense'].includes(account.type)) {
                    change = line.debit - line.credit;
                } else {
                    change = line.credit - line.debit;
                }
                runningBalance += change;

                lines.push({
                    id: journal.id,
                    date: journal.date,
                    description: journal.description,
                    debit: line.debit,
                    credit: line.credit,
                    balance: runningBalance,
                    ref: journal.reference || '-'
                });
            }
        });

        return lines;
    }, [journals, selectedAccountId, accounts]);

    const selectedAccount = accounts.find(a => a.id === selectedAccountId);

    return (
        <div className="space-y-4">
            <div className="flex gap-4 items-center print:hidden">
                <div className="w-[300px]">
                    <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                        <SelectTrigger><SelectValue placeholder="Select Account to View" /></SelectTrigger>
                        <SelectContent>
                            {accounts.sort((a,b) => a.code.localeCompare(b.code)).map(a => (
                                <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4"/> Print Ledger</Button>
            </div>

            {selectedAccountId !== 'all' && selectedAccount ? (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>Ledger: {selectedAccount.code} - {selectedAccount.name}</CardTitle>
                        <CardDescription>Type: {selectedAccount.type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Debit</TableHead>
                                    <TableHead className="text-right">Credit</TableHead>
                                    <TableHead className="text-right">Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ledgerData.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No transactions in this period.</TableCell></TableRow>
                                ) : (
                                    ledgerData.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{format(row.date.toDate(), 'dd/MM/yyyy')}</TableCell>
                                            <TableCell>{row.description}</TableCell>
                                            <TableCell className="text-right text-slate-600">{row.debit > 0 ? row.debit.toFixed(2) : '-'}</TableCell>
                                            <TableCell className="text-right text-slate-600">{row.credit > 0 ? row.credit.toFixed(2) : '-'}</TableCell>
                                            <TableCell className="text-right font-bold">GH₵{row.balance.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Select an account above to view its transaction history.</p>
                </div>
            )}
        </div>
    );
}

// --- COMPONENT: Trial Balance ---
function TrialBalance({ data }: { data: AccountBalance[] }) {
    const totalDebit = data.reduce((sum, a) => sum + a.debit, 0);
    const totalCredit = data.reduce((sum, a) => sum + a.credit, 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.1;

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div><CardTitle>Trial Balance</CardTitle><CardDescription>As of {new Date().toLocaleDateString()}</CardDescription></div>
                <Button variant="outline" onClick={() => window.print()} className="print:hidden"><Printer className="mr-2 h-4 w-4"/> Print</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead className="text-right">Debit</TableHead>
                            <TableHead className="text-right">Credit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.sort((a,b) => a.code.localeCompare(b.code)).map(account => {
                            const balance = account.net;
                            const isDebitNature = ['Asset', 'Expense'].includes(account.type);
                            
                            let debit = 0;
                            let credit = 0;

                            if (isDebitNature) {
                                debit = balance;
                            } else {
                                credit = -balance;
                            }

                            return (
                                <TableRow key={account.id}>
                                    <TableCell className="font-mono text-xs">{account.code}</TableCell>
                                    <TableCell>{account.name}</TableCell>
                                    <TableCell className="text-right">{debit > 0 ? `GH₵${debit.toFixed(2)}` : '-'}</TableCell>
                                    <TableCell className="text-right">{credit > 0 ? `GH₵${credit.toFixed(2)}` : '-'}</TableCell>
                                </TableRow>
                            );
                        })}
                        <TableRow className="bg-slate-100 font-bold border-t-2 border-slate-300">
                            <TableCell colSpan={2}>Totals</TableCell>
                            <TableCell className="text-right">GH₵{totalDebit.toFixed(2)}</TableCell>
                            <TableCell className="text-right">GH₵{totalCredit.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                {!isBalanced && (
                    <div className="mt-4 p-2 bg-red-100 text-red-700 text-center rounded font-bold">
                        ⚠️ TRIAL BALANCE NOT BALANCED
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// --- COMPONENT: Income Statement (P&L) ---
function IncomeStatement({ data }: { data: AccountBalance[] }) {
    const revenue = data.filter(a => a.type === 'Revenue');
    const expenses = data.filter(a => a.type === 'Expense');

    const totalRevenue = Math.abs(revenue.reduce((sum, a) => sum + (a.net < 0 ? a.net : 0), 0));
    const totalExpense = expenses.reduce((sum, a) => sum + (a.net > 0 ? a.net : 0), 0);
    
    const netIncome = totalRevenue - totalExpense;

    return (
        <Card>
            <CardHeader><CardTitle>Income Statement (P&L)</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                
                {/* Revenue Section */}
                <div>
                    <h3 className="font-bold text-lg text-green-700 border-b pb-2 mb-2">Revenue</h3>
                    <Table>
                        <TableBody>
                            {revenue.map(r => (
                                <TableRow key={r.id}>
                                    <TableCell>{r.name}</TableCell>
                                    <TableCell className="text-right">GH₵{Math.abs(r.net).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="font-bold bg-green-50">
                                <TableCell>Total Revenue</TableCell>
                                <TableCell className="text-right">GH₵{totalRevenue.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Expense Section */}
                <div>
                    <h3 className="font-bold text-lg text-red-700 border-b pb-2 mb-2">Expenses</h3>
                    <Table>
                        <TableBody>
                            {expenses.map(e => (
                                <TableRow key={e.id}>
                                    <TableCell>{e.name}</TableCell>
                                    <TableCell className="text-right">GH₵{Math.abs(e.net).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="font-bold bg-red-50">
                                <TableCell>Total Expenses</TableCell>
                                <TableCell className="text-right">GH₵{totalExpense.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Net Income */}
                <div className={`p-4 rounded-lg flex justify-between items-center text-xl font-bold border ${netIncome >= 0 ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                    <span>Net Income / (Loss)</span>
                    <span>GH₵{netIncome.toFixed(2)}</span>
                </div>

            </CardContent>
        </Card>
    );
}

// --- COMPONENT: Balance Sheet ---
function BalanceSheet({ data, netIncome }: { data: AccountBalance[], netIncome: number }) {
    const assets = data.filter(a => a.type === 'Asset');
    const liabilities = data.filter(a => a.type === 'Liability');
    const equity = data.filter(a => a.type === 'Equity');

    const totalAssets = assets.reduce((sum, a) => sum + a.net, 0);
    const totalLiabilities = Math.abs(liabilities.reduce((sum, a) => sum + a.net, 0));
    const totalEquity = Math.abs(equity.reduce((sum, a) => sum + a.net, 0));
    
    const totalEquityAndLiabilities = totalLiabilities + totalEquity + netIncome;

    return (
        <Card>
            <CardHeader><CardTitle>Statement of Financial Position</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
                
                {/* Assets */}
                <div>
                    <h3 className="font-bold text-lg text-blue-700 border-b pb-2 mb-2">Assets</h3>
                     <Table>
                        <TableBody>
                            {assets.map(a => (
                                <TableRow key={a.id}>
                                    <TableCell>{a.name}</TableCell>
                                    <TableCell className="text-right">GH₵{a.net.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                             <TableRow className="font-bold bg-blue-50">
                                <TableCell>Total Assets</TableCell>
                                <TableCell className="text-right">GH₵{totalAssets.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Liabilities & Equity */}
                <div>
                    <h3 className="font-bold text-lg text-slate-700 border-b pb-2 mb-2">Liabilities</h3>
                     <Table>
                        <TableHeader><TableRow><TableHead colSpan={2}>Liabilities</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {liabilities.map(l => (
                                <TableRow key={l.id}>
                                    <TableCell>{l.name}</TableCell>
                                    <TableCell className="text-right">GH₵{Math.abs(l.net).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                             <TableRow className="font-semibold bg-slate-100">
                                <TableCell>Total Liabilities</TableCell>
                                <TableCell className="text-right">GH₵{totalLiabilities.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                        <TableHeader><TableRow><TableHead colSpan={2}>Equity</TableHead></TableRow></TableHeader>
                        <TableBody>
                             {equity.map(e => (
                                <TableRow key={e.id}>
                                    <TableCell>{e.name}</TableCell>
                                    <TableCell className="text-right">GH₵{Math.abs(e.net).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                             <TableRow>
                                <TableCell className="italic text-green-700">Retained Earnings (Net Income)</TableCell>
                                <TableCell className="text-right font-bold text-green-700">GH₵{netIncome.toFixed(2)}</TableCell>
                            </TableRow>
                             <TableRow className="font-semibold bg-slate-100">
                                <TableCell>Total Equity</TableCell>
                                <TableCell className="text-right">GH₵{(totalEquity + netIncome).toFixed(2)}</TableCell>
                            </TableRow>
                             <TableRow className="font-bold bg-slate-200">
                                <TableCell>Total Liabilities & Equity</TableCell>
                                <TableCell className="text-right">GH₵{(totalLiabilities + totalEquity).toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

            </CardContent>
        </Card>
    );
}

// --- MAIN PAGE ---
export default function FinancialReportsPage() {
    const firestore = useFirestore();
    const { role } = useRole();
    const { user } = useUser();
    
    // Date Filtering
    const [fromDate, setFromDate] = useState<Date>(startOfMonth(new Date()));
    const [toDate, setToDate] = useState<Date>(endOfMonth(new Date()));

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role);

    // 1. Fetch ALL Accounts
    const accountsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'accounts')) : null, [firestore]);
    const { data: accounts, isLoading: accLoading } = useCollection<Account>(accountsQuery);

    // 2. Fetch ALL Journals
    const journalsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'journal_entries'), orderBy('date', 'asc')) : null, [firestore]);
    const { data: allJournals, isLoading: jLoading } = useCollection<JournalEntry>(journalsQuery);

    // 3. Process Data
    const { calculatedBalances, netIncome } = useMemo(() => {
        if (!accounts || !allJournals) return { calculatedBalances: [], netIncome: 0 };

        const filteredJournals = allJournals.filter(j => {
            const d = j.date.toDate();
            return d >= fromDate && d <= toDate;
        });

        const balances: AccountBalance[] = accounts.map(acc => {
            let debit = 0;
            let credit = 0;

            filteredJournals.forEach(j => {
                const line = j.lines.find(l => l.accountId === acc.id);
                if (line) {
                    debit += line.debit;
                    credit += line.credit;
                }
            });

            let net = 0;
            if (['Asset', 'Expense'].includes(acc.type)) {
                net = debit - credit;
            } else {
                net = -(credit - debit); 
            }

            return { ...acc, debit, credit, net };
        });

        const revenue = Math.abs(balances.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + (a.net < 0 ? a.net : 0), 0));
        const expense = balances.filter(a => a.type === 'Expense').reduce((sum, a) => sum + (a.net > 0 ? a.net : 0), 0);

        return { calculatedBalances: balances, netIncome: revenue - expense };

    }, [accounts, allJournals, fromDate, toDate]);

    if (!canAccess) return <div className="p-8 text-center text-red-500">Access Denied</div>;

    const isLoading = accLoading || jLoading;

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><FileBarChart className="text-indigo-600"/> Financial Reports</h1>
                    <p className="text-muted-foreground">Generate standard accounting statements.</p>
                </div>
                
                {/* Date Filter */}
                <div className="flex items-center gap-2 bg-white p-2 rounded-md border shadow-sm">
                    <Popover>
                        <PopoverTrigger asChild><Button variant="outline" className="w-[140px] justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{format(fromDate, "PP")}</Button></PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} initialFocus/></PopoverContent>
                    </Popover>
                    <span className="text-slate-400">to</span>
                    <Popover>
                        <PopoverTrigger asChild><Button variant="outline" className="w-[140px] justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{format(toDate, "PP")}</Button></PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={toDate} onSelect={(d) => d && setToDate(d)} initialFocus/></PopoverContent>
                    </Popover>
                </div>
            </div>

            {isLoading ? <Loader2 className="mx-auto mt-20 animate-spin"/> : (
                <Tabs defaultValue="ledger">
                    <TabsList className="print:hidden">
                        <TabsTrigger value="ledger"><BookOpen className="h-4 w-4 mr-2"/> General Ledger</TabsTrigger>
                        <TabsTrigger value="tb"><Scale className="h-4 w-4 mr-2"/> Trial Balance</TabsTrigger>
                        <TabsTrigger value="pl"><TrendingUp className="h-4 w-4 mr-2"/> Income Statement</TabsTrigger>
                        <TabsTrigger value="bs"><Landmark className="h-4 w-4 mr-2"/> Balance Sheet</TabsTrigger>
                    </TabsList>

                    <TabsContent value="ledger" className="mt-4">
                        <GeneralLedger accounts={accounts || []} journals={allJournals || []} />
                    </TabsContent>

                    <TabsContent value="tb" className="mt-4">
                        <TrialBalance data={calculatedBalances} />
                    </TabsContent>

                    <TabsContent value="pl" className="mt-4">
                        <IncomeStatement data={calculatedBalances} />
                    </TabsContent>

                    <TabsContent value="bs" className="mt-4">
                        <BalanceSheet data={calculatedBalances} netIncome={netIncome} />
                    </TabsContent>
                </Tabs>
            )}

            <style jsx global>{`
                @media print {
                    .print\\:hidden { display: none !important; }
                    nav, header, aside { display: none !important; }
                    body { background: white; }
                    .card { border: none; shadow: none; }
                }
            `}</style>
        </div>
    );
}

```
- src/firebase/firestore/use-doc.tsx:
```tsx
'use client';
    
import { useState, useEffect, useCallback } from 'react';
import {
  DocumentReference,
  onSnapshot,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useDoc hook.
 * @template T Type of the document data.
 */
export interface UseDocResult<T> {
  data: WithId<T> | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
  forceRefetch: () => void;
}

/**
 * React hook to subscribe to a single Firestore document in real-time.
 * Handles nullable references.
 * 
 * IMPORTANT! YOU MUST MEMOIZE the inputted memoizedTargetRefOrQuery or BAD THINGS WILL HAPPEN
 * use useMemo to memoize it per React guidence.  Also make sure that it's dependencies are stable
 * references
 *
 *
 * @template T Optional type for document data. Defaults to any.
 * @param {DocumentReference<DocumentData> | null | undefined} docRef -
 * The Firestore DocumentReference. Waits if null/undefined.
 * @returns {UseDocResult<T>} Object with data, isLoading, error.
 */
export function useDoc<T = any>(
  memoizedDocRef: (DocumentReference<DocumentData> & {__memo?: boolean}) | null | undefined,
): UseDocResult<T> {
  type StateDataType = WithId<T> | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading true
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  const forceRefetch = useCallback(() => setRefetchKey(prev => prev + 1), []);

  useEffect(() => {
    if (!memoizedDocRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    // Optional: setData(null); // Clear previous data instantly

    const unsubscribe = onSnapshot(
      memoizedDocRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          setData({ ...(snapshot.data() as T), id: snapshot.id });
        } else {
          // Document does not exist
          setData(null);
        }
        setError(null); // Clear any previous error on successful snapshot (even if doc doesn't exist)
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: memoizedDocRef.path,
        })

        setError(contextualError)
        setData(null)
        setIsLoading(false)

        // trigger global error propagation
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [memoizedDocRef, refetchKey]); 
  
  if(memoizedDocRef && !memoizedDocRef.__memo) {
    throw new Error(memoizedDocRef + ' was not properly memoized using useMemoFirebase');
  }

  return { data, isLoading, error, forceRefetch };
}

```
- src/firebase/provider.tsx:
```tsx

'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

// This interface defines the shape of the context's value.
export interface FirebaseContextState {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Create the context with an undefined initial value.
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode, firebaseApp: FirebaseApp | null, firestore: Firestore | null, auth: Auth | null }> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  // Subscribe to Firebase auth state changes.
  useEffect(() => {
    if (!auth) {
        setIsUserLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setIsUserLoading(false);
      },
      (error) => {
        console.error("FirebaseProvider: Auth state error:", error);
        setUserError(error);
        setIsUserLoading(false);
      }
    );
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  // Memoize the context value to prevent unnecessary re-renders.
  const contextValue = useMemo(() => ({
    firebaseApp,
    firestore,
    auth,
    user,
    isUserLoading,
    userError,
  }), [firebaseApp, firestore, auth, user, isUserLoading, userError]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};


// Custom hook to easily access the Firebase context.
function useFirebaseContext() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebaseContext must be used within a FirebaseProvider.');
  }
  return context;
}

export const useFirebase = () => useFirebaseContext();
export const useAuth = (): Auth | null => useFirebaseContext().auth;
export const useFirestore = (): Firestore | null => useFirebaseContext().firestore;
export const useFirebaseApp = (): FirebaseApp | null => useFirebaseContext().firebaseApp;
export const useUser = () => {
    const { user, isUserLoading, userError } = useFirebaseContext();
    return { user, isUserLoading, userError };
};

export function useMemoFirebase<T>(factory: () => T, deps: React.DependencyList): T {
    const memoized = React.useMemo(factory, deps);
    if (typeof memoized === 'object' && memoized !== null && !(memoized as any).__memo) {
        Object.defineProperty(memoized, '__memo', {
            value: true,
            writable: false,
            enumerable: false,
        });
    }
    return memoized;
}

```
- src/lib/data.ts:
```ts


import type { NavItem, UserRole, ChartOfAccount, GeneralLedgerTransaction, Bus, Route, MathProblem, GlobalLeaderboardEntry, ElaGrammarDrill } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  MessageSquare,
  MessageCircle,
  GraduationCap,
  Library,
  Banknote,
  UserPlus,
  HeartHandshake,
  BookMarked,
  ClipboardCheck,
  FileText,
  CalendarDays,
  ClipboardList,
  FilePen,
  UserCheck as UserCheckIcon,
  Plane,
  Star,
  Landmark,
  Boxes,
  Route as RouteIcon,
  BookCopy,
  BarChart,
  CalendarCheck,
  UserCog,
  Shield,
  Code,
  Sigma,
  FlaskConical,
  BookOpenCheck,
  Activity,
  FolderKanban,
  PenSquare,
  TrendingUp,
  Gamepad2,
  AlertCircle,
  Atom,
  Wallet,
  Settings,
  Megaphone,
  BrainCircuit,
  Clapperboard,
  Book,
  ShoppingBag,
  Wrench,
  Truck,
  Calculator,
  Building2,
  ListOrdered,
  RefreshCcw,
  Rabbit,
  Rocket
} from 'lucide-react';

export const navItems: NavItem[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    roles: 'all',
  },
  {
    path: '/dashboard/announcements',
    title: 'Announcements',
    icon: Megaphone,
    roles: 'all',
  },
  {
    path: '/dashboard/my-bills',
    title: 'My Bills',
    icon: Banknote,
    roles: ['Student', 'Parent'],
  },
  {
    path: '/dashboard/people',
    title: 'People Management',
    icon: Users,
    roles: ['Director', 'Administrator', 'Teacher', 'Parent'],
    subItems: [
        {
            path: '/dashboard/admissions',
            title: 'Admissions',
            icon: FilePen,
            roles: ['Director', 'Administrator'],
        },
        {
            path: '/dashboard/staff-management-v2',
            title: 'Staff Management',
            icon: UserCog,
            roles: ['Director', 'Administrator', 'Teacher'],
        },
        {
            path: '/dashboard/students-v3',
            title: 'Students',
            icon: GraduationCap,
            roles: ['Director', 'Administrator', 'Teacher'],
        },
        {
            path: '/dashboard/parents-v2',
            title: 'Parents',
            icon: HeartHandshake,
            roles: ['Director', 'Administrator'],
        },
        {
            path: '/dashboard/alumni',
            title: 'Alumni',
            icon: UserCheckIcon,
            roles: ['Director', 'Administrator'],
        },
        {
            path: '/dashboard/student-registration',
            title: 'Apply for Admission',
            icon: FilePen,
            roles: ['Parent'],
        },
    ]
  },
  {
    path: '/dashboard/academics',
    title: 'Academics',
    icon: BookOpen,
    roles: ['Director', 'Administrator', 'Teacher', 'Student', 'Parent'],
    subItems: [
        {
            path: '/dashboard/academics',
            title: 'Classes',
            icon: Users,
            roles: ['Director', 'Administrator', 'Teacher'],
        },
        {
            path: '/dashboard/my-children',
            title: 'My Children',
            icon: ListOrdered,
            roles: ['Parent', 'Student'],
        },
        {
            path: '/dashboard/academics/subjects',
            title: 'Subjects',
            icon: BookCopy,
            roles: ['Director', 'Administrator'],
        },
        {
            path: '/dashboard/assignments',
            title: 'Assignments & Quizzes',
            icon: BookMarked,
            roles: ['Director', 'Administrator', 'Teacher', 'Student'],
        },
        {
            path: '/dashboard/lesson-planning',
            title: 'Lesson Planning',
            icon: ClipboardList,
            roles: ['Director', 'Administrator', 'Teacher'],
        },
         {
            path: '/dashboard/academics/learning-materials',
            title: 'Learning Materials',
            icon: FolderKanban,
            roles: ['Director', 'Administrator', 'Teacher', 'Student'],
        },
        {
            path: '/dashboard/assessments',
            title: 'Assessments',
            icon: ClipboardCheck,
            roles: ['Director', 'Administrator', 'Teacher'],
        },
        {
            path: '/dashboard/academics/gradebook',
            title: 'Gradebook',
            icon: TrendingUp,
            roles: ['Teacher', 'Administrator', 'Director', 'Student', 'Parent'],
        },
        {
            path: '/dashboard/academics/analytics',
            title: 'Learning Analytics',
            icon: BrainCircuit,
            roles: ['Director', 'Administrator', 'Teacher'],
        },
        {
            path: '/dashboard/report-cards',
            title: 'Report Cards',
            icon: FileText,
            roles: ['Teacher', 'Administrator', 'Director', 'Student', 'Parent'],
        },
        {
            path: '/dashboard/timetable',
            title: 'Timetable',
            icon: CalendarDays,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/smart-schedule',
            title: 'Smart Schedule',
            icon: CalendarCheck,
            roles: ['Student', 'Teacher'],
        },
        {
            path: '/dashboard/calendar',
            title: 'School Calendar',
            icon: CalendarDays,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
    ]
  },
  {
    path: '/dashboard/clubs',
    title: 'Clubs & Activities',
    icon: Activity,
    roles: ['Student', 'Teacher', 'Administrator', 'Director', 'Parent'],
    subItems: [
        {
            path: '/dashboard/early-years',
            title: 'Junior Campus',
            icon: Rabbit,
            roles: ['Student', 'Parent', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/senior-academy',
            title: 'Senior Academy',
            icon: Rocket,
            roles: ['Student', 'Parent', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/study-club',
            title: 'Study Club (AI Tutor)',
            icon: BrainCircuit,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/maths-club-v2',
            title: 'Maths Club',
            icon: Sigma,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/science-club-v2',
            title: 'Science Club',
            icon: FlaskConical,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/ela-club',
            title: 'ELA Club',
            icon: BookOpenCheck,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/coding-club',
            title: 'Coding Club',
            icon: Code,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/think-tank',
            title: 'Think Tank',
            icon: BrainCircuit,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/game-zone',
            title: 'Game Zone',
            icon: Gamepad2,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/live-classroom',
            title: 'Live Classroom',
            icon: Clapperboard,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
    ]
  },
  {
    path: '/dashboard/communication',
    title: 'Communication',
    icon: MessageSquare,
    roles: 'all',
    subItems: [
        {
            path: '/dashboard/forum',
            title: 'Forum',
            icon: MessageSquare,
            roles: ['Director', 'Administrator', 'Teacher', 'Student', 'Librarian', 'Cook', 'Transport Staff'],
        },
        {
            path: '/dashboard/messages',
            title: 'Direct Messages',
            icon: MessageCircle,
            roles: 'all',
        },
    ]
  },
   {
    path: '/dashboard/hr',
    title: 'Human Resources',
    icon: UserCog,
    roles: ['Director', 'Administrator', 'Teacher', 'Accountant', 'Librarian', 'Cook'],
    subItems: [
        {
            path: '/dashboard/leave-management',
            title: 'Leave Management',
            icon: Plane,
            roles: ['Director', 'Administrator', 'Teacher', 'Accountant', 'Librarian', 'Cook'],
        },
        {
            path: '/dashboard/staff/performance',
            title: 'Performance',
            icon: Star,
            roles: ['Director', 'Administrator'],
        },
    ]
  },
  {
    path: '/dashboard/financials',
    title: 'Financials',
    icon: Banknote,
    roles: ['Director', 'Administrator', 'Accountant'],
     subItems: [
      {
        path: '/dashboard/accounts',
        title: 'Student Billing',
        icon: Banknote,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/finance/accounting',
        title: 'Accounting / GL',
        icon: Book,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
       {
        path: '/dashboard/payroll/staff-config',
        title: 'Staff Payroll Config',
        icon: Settings,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/finance/payroll',
        title: 'Payroll',
        icon: Calculator,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/finance/procurement',
        title: 'Procurement',
        icon: Truck,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/finance/shop',
        title: 'School Shop',
        icon: ShoppingBag,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/accounts/cash-till',
        title: 'Cash Till',
        icon: Wallet,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
       {
        path: '/dashboard/finance/reconciliation',
        title: 'Reconciliation',
        icon: RefreshCcw,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/reports/financials',
        title: 'Financial Reports',
        icon: BarChart,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
       {
        path: '/dashboard/payroll/settings',
        title: 'Settings',
        icon: Settings,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
    ]
  },
   {
    path: '/dashboard/operations',
    title: 'Operations',
    icon: Boxes,
    roles: ['Director', 'Administrator', 'Librarian', 'Transport Staff', 'Student', 'Teacher', 'Accountant'],
     subItems: [
        {
            path: '/dashboard/library',
            title: 'Library',
            icon: Library,
            roles: ['Librarian', 'Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/inventory',
            title: 'Inventory',
            icon: Boxes,
            roles: ['Administrator', 'Director', 'Accountant'],
        },
        {
            path: '/dashboard/transport',
            title: 'Transport',
            icon: RouteIcon,
            roles: ['Administrator', 'Director', 'Transport Staff'],
        },
    ]
  },
  {
    path: '/dashboard/reports',
    title: 'Reporting & Analytics',
    icon: BarChart,
    roles: ['Director', 'Administrator', 'Teacher', 'Accountant'],
     subItems: [
      {
        path: '/dashboard/reports/academics',
        title: 'Academic',
        icon: GraduationCap,
        roles: ['Director', 'Administrator', 'Teacher'],
      },
      {
        path: '/dashboard/reports/attendance',
        title: 'Attendance',
        icon: CalendarCheck,
        roles: ['Director', 'Administrator', 'Teacher'],
      },
      {
        path: '/dashboard/reports/enrollment',
        title: 'Enrollment',
        icon: Users,
        roles: ['Director', 'Administrator'],
      },
      {
        path: '/dashboard/reports/inventory',
        title: 'Inventory',
        icon: Boxes,
        roles: ['Director', 'Administrator'],
      },
    ]
  },
  {
    path: '/dashboard/system',
    title: 'System & Administration',
    icon: Shield,
    roles: ['Director', 'Administrator'],
    subItems: [
        {
            path: '/dashboard/admin/school-profile',
            title: 'School Profile',
            icon: Building2,
            roles: ['Director', 'Administrator'],
        },
        {
            path: '/dashboard/audit-log',
            title: 'Audit Log',
            icon: FileText,
            roles: ['Director', 'Administrator'],
        },
    ]
  },
];

export const sampleAnnouncements = [
  {
    id: 1,
    title: 'Annual Sports Day Postponed',
    date: '2024-10-15',
    content: `Dear Parents and Students,\nPlease note that the Annual Sports Day, originally scheduled for October 20th, has been postponed due to forecasted heavy rain. The new date will be November 5th. All event timings and venues remain the same. We apologize for any inconvenience this may cause and appreciate your understanding. Field trip permission slips for the science museum are due by this Friday, October 18th. Also, the parent-teacher conference is scheduled for next month.`,
  },
  {
    id: 2,
    title: 'Parent-Teacher Conference Schedule',
    date: '2024-10-12',
    content: `We are pleased to announce the schedule for the upcoming Parent-Teacher Conferences on November 10th and 11th. Please log in to the portal to book your slots with the respective teachers. Bookings will be open from October 15th to November 5th. This is a valuable opportunity to discuss your child's progress.`,
  },
  {
    id: 3,
    title: 'School Policy Update: Mobile Phones',
    date: '2024-10-10',
    content: `Effective immediately, there is an update to the school's mobile phone policy. Students are no longer permitted to use mobile phones during lunch breaks to encourage more social interaction. Phones must be kept in lockers during school hours. This policy change will be strictly enforced by all staff. Teachers are required to attend a brief meeting on this policy change this Friday after school in the staff room.`,
  },
];


export const MOCK_SUBJECTS = [
    { id: 'math-01', name: 'Mathematics' },
    { id: 'sci-01', name: 'Science' },
    { id: 'eng-01', name: 'English Language Arts' },
    { id: 'hist-01', name: 'History' },
    { id: 'art-01', name: 'Art' },
];

export const MOCK_ACADEMIC_YEARS = ['2023-2024', '2024-2025'];
export const MOCK_TERMS = ['First Term', 'Second Term', 'Third Term'];

export const LEAVE_TYPES = ['Sick Leave', 'Vacation', 'Personal', 'Study Leave', 'Unpaid Leave'] as const;

export const MOCK_PUBLIC_HOLIDAYS = [
    { name: "New Year's Day", date: new Date('2024-01-01') },
    { name: 'Memorial Day', date: new Date('2024-05-27') },
    { name: 'Independence Day', date: new Date('2024-07-04') },
    { name: 'Labor Day', date: new Date('2024-09-02') },
    { name: 'Thanksgiving Day', date: new Date('2024-11-28') },
    { name: 'Christmas Day', date: new Date('2024-12-25') },
];

export const MOCK_CHART_OF_ACCOUNTS: ChartOfAccount[] = [
    { accountId: '1010', name: 'Cash at Bank', type: 'Asset', isControlAccount: false, parentAccountId: '1000' },
    { accountId: '1200', name: 'Accounts Receivable', type: 'Asset', isControlAccount: true, parentAccountId: '1000' },
    { accountId: '2100', name: 'Accounts Payable', type: 'Liability', isControlAccount: true, parentAccountId: '2000' },
    { accountId: '4000', name: 'Operating Revenue', type: 'Revenue', isControlAccount: true },
    { accountId: '4010', name: 'Tuition Fees', type: 'Revenue', isControlAccount: false, parentAccountId: '4000' },
    { accountId: '4020', name: 'Library Fines', type: 'Revenue', isControlAccount: false, parentAccountId: '4000' },
    { accountId: '5000', name: 'Operating Expenses', type: 'Expense', isControlAccount: true },
    { accountId: '5010', name: 'Salaries Expense', type: 'Expense', isControlAccount: false, parentAccountId: '5000' },
    { accountId: '5020', name: 'Utilities Expense', type: 'Expense', isControlAccount: false, parentAccountId: '5000' },
    { accountId: '5030', name: 'Maintenance Expense', type: 'Expense', isControlAccount: false, parentAccountId: '5000' },
    { accountId: '1000', name: 'Current Assets', type: 'Asset', isControlAccount: true },
    { accountId: '2000', name: 'Current Liabilities', type: 'Liability', isControlAccount: true },
    { accountId: '3000', name: 'Equity', type: 'Equity', isControlAccount: true },
    { accountId: '3010', name: 'Retained Earnings', type: 'Equity', isControlAccount: false, parentAccountId: '3000' },

];

export const MOCK_JOURNAL_ENTRIES: GeneralLedgerTransaction[] = [
    { id: 1, ref: 'INV-001', date: '2024-07-15', description: 'Billed John Doe for Fall Term', debits: [{ accountId: '1200', amount: 5000 }], credits: [{ accountId: '4010', amount: 5000 }] },
    { id: 2, ref: 'PAY-001', date: '2024-08-01', description: 'Received tuition payment from John Doe', debits: [{ accountId: '1010', amount: 5000 }], credits: [{ accountId: '1200', amount: 5000 }] },
    { id: 3, ref: 'BILL-001', date: '2024-08-05', description: 'Electricity bill for July', debits: [{ accountId: '5020', amount: 800 }], credits: [{ accountId: '2100', amount: 800 }] },
    { id: 4, ref: 'PAY-002', date: '2024-08-10', description: 'Paid electricity bill', debits: [{ accountId: '2100', amount: 800 }], credits: [{ accountId: '1010', amount: 800 }] },
    { id: 5, ref: 'SAL-01', date: '2024-08-31', description: 'August salaries', debits: [{ accountId: '5010', amount: 15000 }], credits: [{ accountId: '1010', amount: 15000 }] },
];

export const MOCK_BUSES: Bus[] = [
    { id: 'bus-01', name: 'Yellow Eagle', capacity: 48, assignedDriverId: 'driver-01' },
    { id: 'bus-02', name: 'Blue Sparrow', capacity: 36, assignedDriverId: 'driver-02' },
];

export let MOCK_ROUTES: Route[] = [
    {
        id: 'route-A',
        name: 'Morning Route A - North',
        busId: 'bus-01',
        driverId: 'driver-01',
        stops: [
            { id: 'stop-A1', name: 'Oak Street & 1st', address: '100 Oak St', order: 1, assignedStudentIds: ['student-01'] },
            { id: 'stop-A2', name: 'Maple Avenue', address: '250 Maple Ave', order: 2, assignedStudentIds: ['student-02', 'student-03'] },
        ]
    },
    {
        id: 'route-B',
        name: 'Afternoon Route B - South',
        busId: 'bus-02',
        driverId: 'driver-02',
        stops: [
            { id: 'stop-B1', name: 'Pine & Main', address: '300 Pine St', order: 1, assignedStudentIds: [] },
            { id: 'stop-B2', name: 'Elm Street Plaza', address: '450 Elm St', order: 2, assignedStudentIds: ['student-04'] },
        ]
    }
];

export const MOCK_STUDENTS_FOR_TRANSPORT = [
    { uid: 'student-01', firstName: 'Alice', lastName: 'Smith', classId: 'g5', transportStopId: 'stop-A1' },
    { uid: 'student-02', firstName: 'Bob', lastName: 'Johnson', classId: 'g5', transportStopId: 'stop-A2' },
    { uid: 'student-03', firstName: 'Charlie', lastName: 'Brown', classId: 'g6', transportStopId: 'stop-A2' },
    { uid: 'student-04', firstName: 'Diana', lastName: 'Prince', classId: 'g6', transportStopId: 'stop-B2' },
    { uid: 'student-05', firstName: 'Eve', lastName: 'Adams', classId: 'g7', transportStopId: undefined },
    { uid: 'student-06', firstName: 'Frank', lastName: 'White', classId: 'g7', transportStopId: undefined },
];

export const mockAttendanceRecords = [
  { id: '1', studentId: 'student-01', studentName: 'Alice Smith', classId: 'grade-10-a', date: new Date('2024-05-20'), status: 'Present', notes: '' },
  { id: '2', studentId: 'student-02', studentName: 'Bob Johnson', classId: 'grade-10-a', date: new Date('2024-05-20'), status: 'Absent', notes: 'Feeling unwell' },
  { id: '3', studentId: 'student-03', studentName: 'Charlie Brown', classId: 'grade-10-a', date: new Date('2024-05-20'), status: 'Late', notes: 'Traffic' },
  { id: '4', studentId: 'student-04', studentName: 'grade-10-b', date: new Date('2024-05-20'), status: 'Present', notes: '' },
  { id: '5', studentId: 'student-01', studentName: 'Alice Smith', classId: 'grade-10-a', date: new Date('2024-05-21'), status: 'Present', notes: '' },
  { id: '6', studentId: 'student-02', studentName: 'Bob Johnson', classId: 'grade-10-a', date: new Date('2024-05-21'), status: 'Present', notes: '' },
  { id: '7', studentId: 'student-03', studentName: 'Charlie Brown', classId: 'grade-10-a', date: new Date('2024-05-21'), status: 'Excused', notes: "Doctor's appointment" },
  { id: '8', studentId: 'student-04', studentName: 'Diana Prince', classId: 'grade-10-b', date: new Date('2024-05-21'), status: 'Absent', notes: '' },
  { id: '9', studentId: 'student-01', studentName: 'Alice Smith', classId: 'grade-10-a', date: new Date('2024-05-19'), status: 'Late', notes: 'Missed bus' },
];

export const MOCK_MATH_PROBLEMS: MathProblem[] = [
    { id: 'alg-e-01', topic: 'Algebra', difficulty: 'Easy', question_text: 'If x + 5 = 12, what is x?', correct_answer: 7, options: [5, 6, 7, 8], classId: 'class-1' },
    { id: 'alg-e-02', topic: 'Algebra', difficulty: 'Easy', question_text: 'Solve for y: 3y = 21', correct_answer: 7, options: [3, 6, 7, 9], classId: 'class-1' },
    { id: 'geo-m-01', topic: 'Geometry', difficulty: 'Medium', question_text: 'What is the area of a circle with a radius of 5?', correct_answer: '78.54', options: ['31.42', '50.00', '78.54', '100.00'], classId: 'class-2' },
];

export const MOCK_LEADERBOARD: GlobalLeaderboardEntry[] = [
    { userId: 'student-01', userName: 'Alice', total_correct_answers: 150, total_quizzes_completed: 20, profilePictureUrl: 'https://i.pravatar.cc/150?u=student-01' },
    { userId: 'student-02', userName: 'Bob', total_correct_answers: 135, total_quizzes_completed: 18, profilePictureUrl: 'https://i.pravatar.cc/150?u=student-02' },
    { userId: 'student-03', userName: 'Charlie', total_correct_answers: 120, total_quizzes_completed: 22, profilePictureUrl: 'https://i.pravatar.cc/150?u=student-03' },
];

export const MOCK_ELA_DRILLS: ElaGrammarDrill[] = [
    { id: 'ela-g-01', topic: 'Punctuation', type: 'MCQ', question_prompt: 'Which sentence is correctly punctuated?', correct_answer: "The quick, brown fox jumps over the lazy dog.", options: ["The quick, brown fox jumps over the lazy dog.", "The quick brown fox, jumps over the lazy dog.", "The quick brown fox jumps over, the lazy dog."], classId: 'class-1' },
    { id: 'ela-g-02', topic: 'Verbs', type: 'MCQ', question_prompt: "The children ______ playing in the park.", correct_answer: "are", options: ["is", "are", "am", "be"], classId: 'class-1' },
];

```
- src/lib/types.ts:
```ts


import type { LucideIcon } from 'lucide-react';
import { z } from 'zod';

export type UserRole =
  | 'Director'
  | 'Administrator'
  | 'Teacher'
  | 'Accountant'
  | 'Student'
  | 'Parent'
  | 'Librarian'
  | 'Cook'
  | 'Transport Staff'
  | 'Admin'
  | 'Staff'
  | null;

export const ALL_ROLES: Exclude<UserRole, null | 'Admin' | 'Staff'>[] = [
  'Director',
  'Administrator',
  'Teacher',
  'Accountant',
  'Student',
  'Parent',
  'Librarian',
  'Cook',
  'Transport Staff',
];

export type NavItem = {
  path: string;
  title: string;
  icon: LucideIcon;
  roles: UserRole[] | 'all';
  subItems?: NavItem[];
};

export const assignmentSchema = z.object({
    classId: z.string().min(1, 'Class is required.'),
    title: z.string().min(1, 'Title is required.'),
    description: z.string().min(1, 'Description is required.'),
    dueDate: z.date(),
    gradingType: z.enum(['points', 'letter', 'pass_fail', 'standards']),
    attachments: z.string().optional(),
});

export type Assignment = z.infer<typeof assignmentSchema> & {
    id: string;
    teacherId: string;
    createdAt: any;
};

export const studentSubmissionSchema = z.object({
    content: z.string().min(1, 'Content is required.'),
});

export type StudentSubmission = {
    id: string;
    assignmentId: string;
    studentId: string;
    studentName: string;
    submissionType: 'file' | 'text';
    content: string;
    submittedAt: any;
    status: 'Submitted' | 'Late' | 'Graded';
    grade?: string;
    teacherFeedback?: string;
};

export const gradeSubmissionSchema = z.object({
    grade: z.string().min(1, 'Grade is required.'),
    teacherFeedback: z.string().optional(),
});

export const quizSchema = z.object({
    topic: z.string().min(3, "Topic must be at least 3 characters long."),
    numQuestions: z.coerce.number().min(1).max(10),
    classId: z.string().min(1, "Please select a class."),
});

export type QuizQuestion = {
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
}

export type Quiz = {
    id: string;
    classId: string;
    teacherId: string;
    title: string;
    topic: string;
    questions: QuizQuestion[];
    createdAt: any;
    forGradeLevel?: string;
}

export type QuizAttempt = {
    id: string;
    quizId: string;
    studentId: string;
    score: number;
    total: number;
    completedAt: any;
}


// Assessment & Gradebook Schemas
export const assessmentFeedbackSchema = z.object({
  academicYear: z.string().min(1, "Academic year is required."),
  term: z.string().min(1, "Term is required."),
  classId: z.string().min(1, "Class is required."),
  studentId: z.string().min(1, "Student is required."),
  subjectId: z.string().min(1, "Subject is required."),
  assessmentName: z.string().min(1, "Assessment name is required."),
  assessmentType: z.enum(['Quiz', 'Assignment', 'Activity', 'Exam']),
  assessmentDate: z.date(),
  score: z.coerce.number().optional(),
  maxScore: z.coerce.number().optional(),
  teacherId: z.string().optional(),
}).refine(data => !data.score || !data.maxScore || data.score <= data.maxScore, {
  message: "Score cannot exceed max score",
  path: ["score"],
});


export type Assessment = z.infer<typeof assessmentFeedbackSchema> & {
    id: string;
    createdAt: any;
};

export const behavioralRecordSchema = z.object({
    studentId: z.string().min(1, "Student is required."),
    incidentType: z.enum(['Infraction', 'Positive Behavior', 'Counseling Note', 'Disciplinary Action', 'Teacher Note']),
    date: z.date(),
    description: z.string().min(1, "Description is required."),
    actionTaken: z.string().optional(),
    recordedById: z.string(),
});

export type BehavioralRecord = z.infer<typeof behavioralRecordSchema> & {
    id: string;
    createdAt: any;
};

export const reportCardCommentSchema = z.object({
    comment: z.string().min(1, "Comment cannot be empty."),
    subjectId: z.string().min(1, "Subject is required."),
});

export type ReportCardComment = {
    id: string;
    studentId: string;
    subjectId: string;
    comment: string;
    teacherId: string;
    term: string;
    academicYear: string;
    createdAt: any;
    updatedAt: any;
}

export type ReportCardStatus = 'Draft' | 'AwaitingFinalApproval' | 'Published';

export type SubjectGradeSummary = {
    subjectId: string;
    subjectName: string;
    assessments: Assessment[];
    finalGrade: string;
    percentage: number;
    teacherComment: string;
};

export type ReportCard = {
    id: string; 
    studentId: string;
    classId: string;
    academicYear: string;
    term: string;
    status: ReportCardStatus;
    generalComment?: string;
    publishedAt?: any;
    finalGrade?: string;
    finalPercentage?: number;
    classPosition?: string; // e.g. "1st", "2nd"
    subjectSummaries?: SubjectGradeSummary[]; // New structured field
}

// Timetable Schemas
export type Subject = { id: string; name: string; teacherIds: string[] };
export type Room = { id: string; name: string; capacity: number };
export type TimeSlot = { id: string; day: string; startTime: string; endTime: string };
export type TimetableEntry = {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  roomId: string;
  day: string;
  timeSlotId: string;
};

// Resource Schemas
export const resourceSchema = z.object({
    title: z.string().min(1, 'Title is required.'),
    courseName: z.string().min(1, 'Course is required.'),
    resourceType: z.enum(['Document', 'Video', 'Presentation', 'Link']),
    url: z.string().url('Must be a valid URL.'),
});

export type Resource = z.infer<typeof resourceSchema> & {
    id: string;
};

// Lesson Planning Schemas
export const lessonPlanSchema = z.object({
    classId: z.string().min(1, 'Class is required.'),
    date: z.date({ required_error: 'A date for the lesson is required.'}),
    topic: z.string().min(1, 'Topic is required.'),
    objectives: z.string().min(1, 'Learning objectives are required.'),
    activities: z.string().min(1, 'Activities are required.'),
    materials: z.string().min(1, 'Materials and resources are required.'),
    notes: z.string().optional(),
});

export type LessonPlan = z.infer<typeof lessonPlanSchema> & {
    id: string;
    teacherId: string;
    createdAt: any;
};

// Library Schemas
export const libraryItemSchema = z.object({
    name: z.string().min(1, "Item name is required."),
    category: z.enum(['Book', 'Magazine', 'DVD', 'Other']),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
    location: z.string().min(1, "Location is required."),
    author: z.string().optional(),
    isbn: z.string().optional(),
    publisher: z.string().optional(),
    unitPrice: z.coerce.number().optional(),
    purchaseDate: z.date().optional(),
});

export type LibraryItem = z.infer<typeof libraryItemSchema> & {
    id: string;
    status: 'Available' | 'Requested' | 'Borrowed' | 'Pending Return';
    currentHolderId?: string;
    currentHolderName?: string;
    dueDate?: any;
    createdAt: any;
};

// Admission Schemas
const parentGuardianSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    relationship: z.string().min(1, 'Relationship is required.'),
    phone: z.string().min(1, 'Phone number is required.'),
    email: z.string().email('Invalid email address.'),
    addressSameAsStudent: z.boolean().default(false),
    address: z.string().optional(),
});
  
export const studentRegistrationSchema = z.object({
    // Student Information
    student: z.object({
        fullName: z.string().min(1, 'Full name is required.'),
        dateOfBirth: z.date({ required_error: 'Date of birth is required.' }),
        gender: z.string().min(1, 'Gender is required.'),
        phone: z.string().optional(),
        email: z.string().email('Invalid email address.').optional(),
        address: z.string().min(1, 'Address is required.'),
        previousSchool: z.string().optional(),
        desiredGrade: z.string().min(1, 'Desired grade is required.'),
    }),
    
    // Parent/Guardian Information
    parent1: parentGuardianSchema,
    addParent2: z.boolean().default(false),
    parent2: parentGuardianSchema.optional(),

    // Emergency Contact
    emergencyContact: z.object({
        name: z.string().min(1, 'Emergency contact name is required.'),
        relationship: z.string().min(1, 'Relationship is required.'),
        phone: z.string().min(1, 'Phone number is required.'),
    }),

    // Medical Information
    addMedicalInfo: z.boolean().default(false),
    medical: z.object({
        allergies: z.string().optional(),
        conditions: z.string().optional(),
        physicianName: z.string().optional(),
        physicianPhone: z.string().optional(),
    }).optional(),

}).superRefine((data, ctx) => {
    // Conditional validation for Parent 1's address
    if (!data.parent1.addressSameAsStudent && !data.parent1.address) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Address is required.',
            path: ['parent1', 'address'],
        });
    }
    // Conditional validation for Parent 2
    if (data.addParent2 && data.parent2) {
        if (!data.parent2.addressSameAsStudent && !data.parent2.address) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Address is required.',
                path: ['parent2', 'address'],
            });
        }
    }
    // Conditional validation for medical info
    if (data.addMedicalInfo && data.medical) {
        if (!data.medical.allergies && !data.medical.conditions && !data.medical.physicianName) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Please provide at least one piece of medical information.',
                path: ['medical', 'allergies'],
            });
        }
    }
});
  
export type StudentRegistrationData = z.infer<typeof studentRegistrationSchema>;

export type AdmissionApplication = StudentRegistrationData & {
    id: string;
    applicationId: string; // A user-friendly, unique ID
    status: 'Pending Review' | 'Admitted' | 'Rejected';
    submittedByParentId: string;
    submittedAt: any;
    rejectionReason?: string;
    challengeNotes?: string;
    assessmentTestScore?: number;
    assessmentInterviewNotes?: string;
    adminFeedback?: string;
};

// Alumni Schemas
export const graduateStudentSchema = z.object({
    studentId: z.string().min(1, "You must select a student."),
    graduationYear: z.coerce.number().min(new Date().getFullYear() - 10).max(new Date().getFullYear() + 1),
});

export const editAlumniSchema = z.object({
    currentOccupation: z.string().optional(),
    employer: z.string().optional(),
    mentorshipWillingness: z.boolean().default(false),
});

export type AlumniDetails = z.infer<typeof editAlumniSchema>;

// This extends the existing Student type for alumni management
export type Student = {
    id: string;
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    classId: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    enrollmentStatus?: 'Active' | 'Graduated';
    graduationYear?: number;
    alumniDetails?: AlumniDetails;
    transportStopId?: string;
    usesBusService?: boolean;
    usesCanteen?: boolean;
};

export type Class = {
    id: string;
    name: string;
    description?: string;
    teacherId?: string;
    studentIds?: string[];
    capacity?: number;
};

// Leave Management Schemas
export const LEAVE_TYPES = ['Sick Leave', 'Vacation', 'Personal', 'Study Leave', 'Unpaid Leave'] as const;
export type LeaveType = typeof LEAVE_TYPES[number];
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export const leaveApplicationSchema = z.object({
  leaveType: z.enum(LEAVE_TYPES),
  startDate: z.date({ required_error: 'Start date is required.' }),
  endDate: z.date({ required_error: 'End date is required.' }),
  reason: z.string().min(10, 'Please provide a brief reason for your leave.'),
}).refine(data => data.endDate >= data.startDate, {
  message: 'End date cannot be before the start date.',
  path: ['endDate'],
});

export type LeaveRequest = {
  id: string;
  staffId: string;
  staffName: string;
  leaveType: LeaveType;
  startDate: any;
  endDate: any;
  reason: string;
  status: LeaveStatus;
  approverId?: string;
  approverName?: string;
  approverNotes?: string;
  createdAt: any;
};

export const managerApprovalSchema = z.object({
    notes: z.string().optional(),
});

export const managerRejectionSchema = z.object({
    notes: z.string().min(1, "A reason for rejection is required."),
});


export type PublicHoliday = {
    id: string;
    name: string;
    date: any;
};

// Performance Review Schemas
export const performanceReviewSchema = z.object({
  staffId: z.string().min(1, 'You must select a staff member.'),
  reviewDate: z.date({ required_error: 'Review date is required.' }),
  rating: z.number().min(1, 'Rating is required.').max(5),
  strengths: z.string().min(1, 'Strengths section cannot be empty.'),
  improvementAreas: z.string().min(1, 'Areas for Improvement cannot be empty.'),
  goals: z.string().min(1, 'Goals for next period cannot be empty.'),
  staffComments: z.string().optional(),
});

export type PerformanceReview = z.infer<typeof performanceReviewSchema> & {
  id: string;
  reviewerId: string;
  reviewerName: string;
  createdAt: any;
  metrics?: {
    teaching: number;
    punctuality: number;
    engagement: number;
    professionalism: number;
  };
};


// Financial Schemas
export const financialRecordSchema = z.object({
  studentId: z.string().min(1, "A student must be selected."),
  type: z.enum(['Tuition Fee', 'Library Fine', 'Lab Fee', 'Sports Fee', 'Canteen Fee', 'Transport Fee', 'Other']),
  description: z.string().min(1, "Description is required."),
  billedAmount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
  dueDate: z.date({ required_error: "Due date is required." }),
});

export const bulkBillingSchema = z.object({
  classId: z.string().min(1, "A class must be selected."),
  type: z.enum(['Tuition Fee', 'Lab Fee', 'Sports Fee', 'Canteen Fee', 'Transport Fee', 'Other']),
  description: z.string().min(1, "Description is required."),
  billedAmount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
  dueDate: z.date({ required_error: "Due date is required." }),
});

export const recordPaymentSchema = z.object({
    amount: z.coerce.number().min(0.01, "Payment amount must be positive."),
    method: z.enum(['Cash', 'Card', 'Bank Transfer', 'Other']),
    notes: z.string().optional(),
});

export const applyWaiverSchema = z.object({
    amount: z.coerce.number().min(0.01, "Waiver amount must be positive."),
    reason: z.string().min(1, "A reason for the waiver is required."),
});

export type FinancialRecord = {
    id: string;
    studentId: string;
    studentName: string;
    classId: string;
    type: 'Tuition Fee' | 'Library Fine' | 'Lab Fee' | 'Sports Fee' | 'Canteen Fee' | 'Transport Fee' | 'Other';
    description: string;
    billedAmount: number;
    amountPaid: number;
    waiverAmount?: number;
    waiverReason?: string;
    status: 'Paid' | 'Unpaid' | 'Overdue';
    dueDate: any;
    createdAt: any;
};

export type Staff = {
    id: string;
    uid: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    email: string;
};

// Payroll Schemas
export const payrollSettingsFormSchema = z.object({
    ssnitEmployeeContributionRate: z.coerce.number().min(0).max(1),
    ssnitEmployerContributionRate: z.coerce.number().min(0).max(1),
    payeeBrackets: z.array(z.object({
        from: z.coerce.number().min(0),
        to: z.coerce.number().min(0).nullable(),
        rate: z.coerce.number().min(0).max(1)
    }))
});

export type PayrollSettings = z.infer<typeof payrollSettingsFormSchema> & { id: string };

const allowanceSchema = z.object({ name: z.string().min(1), amount: z.coerce.number().min(0) });
const deductionSchema = z.object({ name: z.string().min(1), amount: z.coerce.number().min(0) });

export const staffPayrollConfigSchema = z.object({
    basicSalary: z.coerce.number().min(0),
    allowances: z.array(allowanceSchema).optional(),
    deductions: z.array(deductionSchema).optional(),
    ssnitNumber: z.string().min(1),
    tinNumber: z.string().min(1),
    bankName: z.string().min(1),
    accountNumber: z.string().min(1),
});

export type StaffPayrollConfig = z.infer<typeof staffPayrollConfigSchema> & {
    id?: string;
    staffId: string;
}

export type PayrollRecord = {
    id: string;
    staffId: string;
    staffName: string;
    period: string; // "YYYY-MM"
    grossSalary: number;
    netSalary: number;
    basicSalary: number;
    totalAllowances: number;
    totalDeductions: number;
    allowances: Array<{name: string, amount: number}>;
    deductions: Array<{name: string, amount: number}>;
    statutory: {
        ssnitEmployee: number;
        ssnitEmployer: number;
        paye: number;
    },
    createdAt: any;
}

// Accounts Payable Schemas
export const vendorSchema = z.object({
    name: z.string().min(1, 'Vendor name is required.'),
    category: z.string().min(1, 'Category is required.'),
    email: z.string().email('Invalid email address.'),
    phone: z.string().min(1, 'Phone number is required.'),
});

export type Vendor = z.infer<typeof vendorSchema> & { id: string };

export const payableSchema = z.object({
    vendorId: z.string().min(1, 'A vendor must be selected.'),
    expenseAccountId: z.string().min(1, 'An expense account must be selected.'),
    description: z.string().min(1, 'A description is required.'),
    invoiceNumber: z.string().optional(),
    amount: z.coerce.number().min(0.01, 'Amount must be greater than zero.'),
    dueDate: z.date({ required_error: 'A due date is required.'}),
});

export type AccountsPayableRecord = z.infer<typeof payableSchema> & {
    id: string;
    status: 'Unpaid' | 'Paid';
    createdAt: any;
    paidAt?: any;
    paymentAccountId?: string;
};

// General Ledger Schemas
export const ACCOUNT_TYPES = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'] as const;
export type AccountType = typeof ACCOUNT_TYPES[number];

export const accountSchema = z.object({
    name: z.string().min(1, 'Account name is required.'),
    type: z.enum(ACCOUNT_TYPES),
    parentAccountId: z.string().optional(),
    description: z.string().optional(),
});

export type ChartOfAccount = {
    accountId: string;
    name: string;
    type: AccountType;
    isControlAccount: boolean;
    parentAccountId?: string;
    description?: string;
};

export type JournalEntryItem = {
    accountId: string;
    amount: number;
};

export type GeneralLedgerTransaction = {
    id: number;
    ref: string;
    date: string;
    description: string;
    debits: JournalEntryItem[];
    credits: JournalEntryItem[];
};

export const journalEntrySchema = z.object({
    description: z.string().min(1, 'Description is required.'),
    amount: z.coerce.number().positive('Amount must be positive.'),
    debitAccountId: z.string().min(1, 'Debit account is required.'),
    creditAccountId: z.string().min(1, 'Credit account is required.'),
}).refine(data => data.debitAccountId !== data.creditAccountId, {
    message: 'Debit and Credit accounts cannot be the same.',
    path: ['creditAccountId'],
});
    
// Inventory Schemas
export const inventoryItemSchema = z.object({
    name: z.string().min(1, "Item name is required."),
    category: z.enum(['Uniform', 'Book', 'Stationery', 'Other']),
    quantity: z.coerce.number().int().min(0),
    location: z.string().min(1, "Location is required."),
    supplier: z.string().optional(),
    purchaseDate: z.date().optional(),
    unitPrice: z.coerce.number().min(0).optional(),
    condition: z.enum(['New', 'Good', 'Fair', 'Poor', 'For Repair']),
});

export type InventoryItem = z.infer<typeof inventoryItemSchema> & {
    id: string;
    status: 'Available' | 'In Use' | 'Under Maintenance' | 'Out of Stock';
    currentHolderId?: string;
    currentHolderName?: string;
    lastCheckedOut?: any;
};

export const checkoutSchema = z.object({
  staffId: z.string().min(1, "You must select a staff member."),
});

export type InventoryTransaction = {
    id: string;
    itemId: string;
    transactionType: 'Creation' | 'Check-Out' | 'Check-In' | 'Sale' | 'Adjustment' | 'Audit' | 'Restock';
    timestamp: any;
    staffId?: string; // Who performed the action
    quantityChange?: number;
    notes?: string;
};

// Transport Schemas
export type Bus = {
    id: string;
    name: string;
    capacity: number;
    assignedDriverId?: string;
};
  
export type Stop = {
    id: string;
    name: string;
    address: string;
    order: number;
    assignedStudentIds: string[];
};
  
export type Route = {
    id: string;
    name: string;
    busId: string;
    driverId: string;
    stops: Stop[];
};

export const studentAssignmentSchema = z.object({
    studentId: z.string().min(1, "You must select a student."),
    stopId: z.string().min(1, "You must select a stop."),
});

// Attendance Schemas
export const attendanceRecordSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  studentName: z.string().optional(), // For display only, not stored
  classId: z.string(),
  date: z.date(),
  status: z.enum(['Present', 'Absent', 'Late', 'Excused']),
  notes: z.string().optional(),
  usesBusService: z.boolean().optional(),
});

export type AttendanceRecord = z.infer<typeof attendanceRecordSchema> & {
    id: string;
};


// Audit Log Schema
export const auditLogSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  action: z.string(), // e.g., 'CREATE_STUDENT', 'UPDATE_GRADE'
  details: z.string(), // e.g., 'Created student John Doe'
  targetId: z.string().optional(), // ID of the entity that was affected
  timestamp: z.date(),
});

export type AuditLog = z.infer<typeof auditLogSchema> & {
  id: string;
};

// Maths Club Schemas
export const mathProblemSchema = z.object({
    topic: z.string().min(1, "Topic is required."),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    question_text: z.string().min(1, "Question text is required."),
    correct_answer: z.string().min(1, "Correct answer is required."),
    options: z.array(z.string().min(1, "Option cannot be empty.")).length(4, "You must provide 4 options."),
    metadata: z.object({
        source: z.string().optional(),
        gradeLevel: z.string().optional(),
    }).optional(),
    classId: z.string().min(1, "Please select a class."),
});

export type MathProblem = z.infer<typeof mathProblemSchema> & {
    id: string;
    explanation?: string;
};

export type UserResult = {
    id: string;
    userId: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    score: number;
    time_taken_seconds: number;
    date_completed: any;
    correct_count: number;
};

export type GlobalLeaderboardEntry = {
    userId: string;
    userName: string;
    profilePictureUrl?: string;
    total_correct_answers: number;
    total_quizzes_completed: number;
};

// Science Club Schemas
export const scienceProblemSchema = z.object({
    topic: z.string().min(1, "Topic is required."),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    question_text: z.string().min(1, "Question text is required."),
    correct_answer: z.string().min(1, "Correct answer is required."),
    options: z.array(z.string().min(1, "Option cannot be empty.")).length(4, "You must provide 4 options."),
    metadata: z.object({
        source: z.string().optional(),
        gradeLevel: z.string().optional(),
    }).optional(),
    classId: z.string().min(1, "Please select a class."),
});

export type ScienceProblem = z.infer<typeof scienceProblemSchema> & {
    id: string;
    explanation?: string;
};

export type ScienceResult = {
    id: string;
    userId: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    score: number;
    time_taken_seconds: number;
    date_completed: any;
    correct_count: number;
};

export type ScienceLeaderboardEntry = {
    id?: string;
    userId: string;
    userName: string;
    profilePictureUrl?: string;
    total_correct_answers: number;
    points?: number;
    quizzesPlayed?: number;
};

export type DailyFact = {
    id: string;
    factText: string;
    text?: string;
    createdAt: any;
    postedBy: string;
};

// ELA Club Schemas
export const elaGrammarDrillSchema = z.object({
    topic: z.string().min(1, "Topic is required."),
    type: z.enum(["MCQ", "Drag and Drop"]),
    question_prompt: z.string().min(1, "Question prompt is required."),
    options: z.array(z.string()).optional(),
    correct_answer: z.union([z.string(), z.array(z.string())]).refine(val => (Array.isArray(val) ? val.length > 0 : String(val).length > 0), { message: "Correct answer cannot be empty." }),
    classId: z.string().min(1, "Please select a class."),
});

export type ElaGrammarDrill = z.infer<typeof elaGrammarDrillSchema> & {
    id: string;
    explanation?: string;
};

const elaQuestionSchema = z.object({
    question: z.string().min(1, "Question cannot be empty"),
    type: z.enum(["MCQ", "Short Answer"]),
    options: z.array(z.string()).optional(),
    correct_answer_key: z.string().min(1, "Correct answer is required"),
    explanation: z.string().optional(),
});

export const elaReadingPassageSchema = z.object({
    title: z.string().min(1, "Title is required."),
    passage_text: z.string().min(1, "Passage text is required."),
    reading_level: z.string().min(1, "Reading level is required."),
    classId: z.string().min(1, "Please select a class."),
    question_set: z.array(elaQuestionSchema).min(1, "At least one question is required."),
});


export type ElaReadingPassage = z.infer<typeof elaReadingPassageSchema> & {
    id: string;
};

export const elaWritingChallengeSchema = z.object({
    title: z.string().min(1, "Title is required."),
    prompt: z.string().min(10, "Prompt must be at least 10 characters."),
    challengeType: z.enum(['Creative Writing', 'Summarization', 'Essay']),
    classId: z.string().min(1, "Please select a class for this challenge."),
});

export type ElaWritingChallenge = z.infer<typeof elaWritingChallengeSchema> & {
    id: string;
    createdBy: string;
    createdAt: any;
};

export type ElaUserSubmission = {
    id: string;
    userId: string;
    challenge_id: string;
    challenge_title: string;
    submission_text: string;
    date_submitted: any;
    status: 'Submitted' | 'Graded';
    teacher_score?: number | null;
    teacher_feedback?: string | null;
};

export type ElaLeaderboardEntry = {
    userId: string;
    userName: string;
    profilePictureUrl?: string;
    total_correct_answers: number;
    total_challenges_completed: number;
};


// --- RICH LEARNING MATERIAL ---

// Attachment for a Topic
export interface Attachment {
    name: string;
    url: string;
    type: 'PDF' | 'DOC' | 'IMAGE';
}

// Video Link for a Topic
export interface VideoLink {
    title: string;
    url: string;
}

// Question for a Topic
export interface RichQuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

// The Main "Topic" Container
export interface LearningMaterial {
    id: string;
    courseId: string; // e.g. "bs7-integrated-science"
    strand: string;
    subStrand: string;
    topicTitle: string;
    content: string; // This is for rich text / html content
    attachments: Attachment[];
    videoLinks: VideoLink[];
    practiceQuestions: RichQuizQuestion[];
    createdAt: any;
    updatedAt?: any;
    classId?: string; // Optional: To assign to a specific class
    subject?: string;  // Optional: To assign to a specific subject
}

// --- CASH TILL MANAGEMENT ---
export type TillStatus = 'Open' | 'PendingApproval' | 'Closed';

export type Till = {
    id: string;
    accountantId: string;
    accountantName: string;
    openingBalance: number;
    closingBalance: number | null;
    dateOpened: any;
    dateClosed: any | null;
    status: TillStatus;
    directorApproval: {
        directorId: string | null;
        directorName: string | null;
        approvedAt: any | null;
        rejectionReason?: string;
    };
};

export type TillTransaction = {
    id: string;
    tillId: string;
    financialRecordId: string; // For POS, this could be the item ID
    studentId?: string; // For fees
    studentName?: string; // For fees
    amount: number;
    timestamp: any;
    description: string; // For POS, "Sale of: Book"
};

// --- THINK TANK MODULE ---
export interface Paradox {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdAt: any;
  targetGroup: string;
}

export interface DebateTopic {
  id: string;
  topic: string;
  context: string; // Background info
  createdAt: any;
  targetGroup: string;
}

export interface DebateMessage {
  role: 'user' | 'ai';
  content: string;
}

// --- FORUM ---
export interface ForumThread {
    id: string;
    title: string;
    content: string;
    createdBy: {
        uid: string;
        name: string;
    };
    createdAt: any;
    aiModeratorEnabled: boolean;
    lastReplyAt?: any;
    replyCount?: number;
}

export interface ForumReply {
    id: string;
    threadId: string;
    author: {
        uid: string;
        name: string;
    };
    content: string;
    createdAt: any;
    isAIMessage?: boolean; // True if the reply is from the AI moderator
}

// --- ELA Explorer ---
export type ElaLesson = {
    id?: string;
    userId: string;
    timestamp: any;
    title: string;
    explanation: string;
    example: string;
    keyTerms: string[];
    quizQuestion: string;
    quizAnswer: string;
}
    
// --- Science Explorer ---
export type ScienceLesson = {
    id?: string;
    userId: string;
    timestamp: any;
    title: string;
    explanation: string;
    analogy: string;
    keyTerms: string[];
    quizQuestion: string;
    quizAnswer: string;
}

// --- Direct Messages ---
export interface ChatMetadata {
    id: string;
    participants: string[];
    participantDetails: Record<string, { name: string; role: string }>;
    lastMessage: string;
    lastMessageTime: any;
    unreadCount: Record<string, number>;
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    createdAt: any;
}

export interface Lecture {
  id: string;
  title: string;
  description?: string;
  classId?: string; // Changed from targetGroup
  scheduledFor?: any;
  teacherName: string;
  teacherId: string;
  status: 'scheduled' | 'live' | 'ended';
  createdAt: any;
  slides?: string[];
  currentSlide?: number;
  isPresentationMode?: boolean;
  breakoutActive?: boolean;
  breakoutDuration?: number;
  breakoutEndTime?: any;
}

// --- ACCOUNTING TYPES ---
export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

export interface Account {
  id: string;
  code: string; // e.g., "1001"
  name: string; // e.g., "Cash on Hand"
  type: AccountType;
  balance: number; // Current running balance
  parentId?: string | null;
}

export interface JournalLine {
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: any; // Timestamp
  reference?: string; // e.g., "INV-001" or "PV-502"
  description: string;
  lines: JournalLine[];
  totalAmount: number;
  createdBy: string;
  createdAt: any;
}

export interface PaymentVoucher {
  id: string;
  payee: string;
  description: string;
  grossAmount: number;
  whtAmount: number;
  netAmount: number;
  paymentMethod: string;
  referenceNumber?: string;
  expenseAccountId: string;
  paymentAccountId: string;
  whtLiabilityAccountId?: string;
  status: 'Paid' | 'Cancelled';
  date: any;
  createdBy: string;
  linkedBillId?: string;
}

// --- PROCUREMENT & AP ---
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  balance: number; // Amount we owe them
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  date: any;
  status: 'Draft' | 'Sent' | 'Received' | 'Cancelled';
  items: { 
    itemId: string; // From Inventory/Shop items
    name: string; 
    quantity: number; 
    unitCost: number; 
    total: number;
  }[];
  totalAmount: number;
  expectedDate?: any;
}

export interface VendorBill {
  id: string;
  supplierId: string;
  supplierName: string;
  poId: string; // Link to PO
  date: any;
  dueDate: any;
  totalAmount: number;
  amountPaid: number;
  status: 'Unpaid' | 'Partial' | 'Paid';
  items: any[];
}


// --- PAYROLL ---
export interface TaxBracket {
  limit: number; 
  rate: number;  
}

export interface PayrollConfig {
  ssnitEmployeeRate: number;
  ssnitEmployerRate: number;
  tier3Rate: number;
  taxBrackets: TaxBracket[];
}

export interface StaffSalaryDetails {
  uid: string;
  name: string;
  role: string;
  basicSalary: number;
  allowances: { name: string; amount: number; isTaxable: boolean }[];
  tier3Contribution: number;
  bankName: string;
  accountNumber: string;
  tin: string;
  ssnitNumber: string;
}

export interface Payslip {
  id: string;
  month: string;
  staffId: string;
  staffName: string;
  basicSalary: number;
  totalAllowances: number;
  grossSalary: number;
  ssnitDeduction: number;
  tier3Deduction: number;
  taxableIncome: number;
  payeTax: number;
  netSalary: number;
  employerSSNIT: number;
  totalCostToCompany: number;
  status: 'Draft' | 'Paid';
  date: any;
}

export interface StudentPerformance {
  studentId: string;
  studentName: string;
  attendanceRate: number; // 0-100
  averageGrade: number;   // 0-100
  missedAssessments: number;
  participationScore: number; // Calculated based on behavior records or consistency
}

export interface AiInsight {
  atRiskStudents: {
    studentName: string;
    reason: string; // e.g. "High grades but dropping attendance"
    intervention: string; // e.g. "Schedule parent meeting"
  }[];
  classTrends: string; // General observation
  teachingStrategy: string; // Advice for the teacher
}


    
```
- tailwind.config.ts:
```ts

import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        body: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

```
- tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "src/components/dashboard/finance/procurement/page.tsx"],
  "exclude": ["node_modules"]
}
```