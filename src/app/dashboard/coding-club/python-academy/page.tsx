
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, query, orderBy, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { 
  Loader2, Play, Save, CheckCircle2, ChevronRight, 
  BookOpen, Code2, Terminal, Info, Layout, Cpu, 
  Globe, Database, Github, HelpCircle, FileJson, Layers, Monitor, Target, Trophy, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { getPythonTutorHelp } from '@/ai/flows/senior-actions';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center bg-slate-800"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>,
});


// --- FULL CURRICULUM DATA STRUCTURE ---
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


export default function PythonAcademy() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [activeLesson, setActiveLesson] = useState(PYTHON_SYLLABUS[0].mainTopics[0].lessons[0]);
  const [code, setCode] = useState(activeLesson.startingCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isLoadingPy, setIsLoadingPy] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const pyodide = useRef<any>(null);

  const [aiQuestion, setAiQuestion] = useState("");
  const [tutorResponse, setTutorResponse] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  
  const askTutor = async () => {
    if (!aiQuestion.trim()) return;
    setIsAiLoading(true);
    
    // Find the current phase based on the active lesson
    const currentPhase = PYTHON_SYLLABUS.find(phase => 
      phase.mainTopics.some(topic => 
        topic.lessons.some(lesson => lesson.id === activeLesson.id)
      )
    );

    try {
      const res = await getPythonTutorHelp({
        phase: currentPhase?.title || "Fundamentals",
        lesson: activeLesson.title,
        task: activeLesson.task,
        userCode: code,
        question: aiQuestion
      });
      if (res.success) {
        setTutorResponse(res.data);
      } else {
        toast({ variant: 'destructive', title: 'AI Error', description: res.error });
      }
    } finally {
      setIsAiLoading(false);
      setAiQuestion("");
    }
  };


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

  const runAndValidate = async () => {
    if (!pyodide.current) return;
    setIsRunning(true);
    setOutput([]);
    setIsPassed(false);

    pyodide.current.setStdout({
        batched: (str: string) => setOutput(prev => [...prev, str])
    });

    try {
        if (code.includes("import numpy")) {
            await pyodide.current.loadPackage("numpy");
        }
        if (code.includes("import pandas")) {
            await pyodide.current.loadPackage("pandas");
        }
        await pyodide.current.runPythonAsync(code);

        let validationCheck = false;
        
        if (activeLesson.id === "p1-2-2") {
            validationCheck = pyodide.current.runPython("isinstance(year, int) and year == 2025");
        } else if (activeLesson.id === "p1-2-1") {
            validationCheck = output.join("").includes("Hello World");
        }
        
        if (validationCheck) {
            setIsPassed(true);
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }

    } catch (err: any) {
        setOutput(prev => [...prev, `❌ Syntax Error: ${err.message}`]);
    }
    setIsRunning(false);
};

  const saveProgress = async () => {
    if (!user || !firestore) {
        toast({title: "Please log in to save."});
        return;
    };
    await setDoc(doc(firestore, 'student_coding_progress', `${user.uid}_${activeLesson.id}`), {
      userId: user.uid,
      lessonId: activeLesson.id,
      code: code,
      completed: true,
      updatedAt: serverTimestamp()
    });
    toast({title: "Progress Saved!"});
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <aside className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="bg-yellow-500 p-2 rounded-xl"><Monitor className="text-slate-900" /></div>
            <div>
              <h2 className="text-xl font-black text-white">Python Path</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Curriculum Explorer</p>
            </div>
          </div>

          <ScrollArea className="h-[80vh] pr-4">
            <Accordion type="multiple" defaultValue={['Phase 1']} className="space-y-4">
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
                      <Accordion key={topic.title} type="single" collapsible className="w-full">
                        <AccordionItem value={topic.title} className="border-none">
                            <AccordionTrigger className="text-[11px] font-bold text-slate-500 py-2 hover:text-indigo-400">
                                {topic.title}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-1 pl-4 border-l border-slate-700/50">
                                {topic.lessons.map((lesson) => (
                                    <button
                                    key={lesson.id}
                                    onClick={() => { setActiveLesson(lesson); setCode(lesson.startingCode); setOutput([]); }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between group ${activeLesson.id === lesson.id ? 'bg-yellow-500 text-slate-900' : 'hover:bg-slate-800 text-slate-400'}`}
                                    >
                                    {lesson.title}
                                    <ChevronRight className={`h-3 w-3 ${activeLesson.id === lesson.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                    </button>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </aside>

        <main className="lg:col-span-6 space-y-6">
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
                  onClick={runAndValidate} 
                  disabled={isLoadingPy || isRunning}
                  className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black px-8 rounded-xl shadow-lg shadow-yellow-900/20"
                >
                  {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Play className="h-4 w-4 mr-2 fill-current" /> Run</>}
                </Button>
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-[#0d1117]">
              <div className="flex-1 border-b border-slate-800 relative">
                  <Editor
                      height="100%"
                      defaultLanguage="python"
                      theme="vs-dark"
                      value={code}
                      onChange={(val) => setCode(val || "")}
                      options={{
                          fontSize: 16,
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          padding: { top: 20 }
                      }}
                  />
                  
                  {isPassed && (
                      <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm flex items-center justify-center animate-in zoom-in">
                          <div className="bg-slate-900 border-2 border-emerald-500 p-6 rounded-[32px] shadow-2xl text-center">
                              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
                              <h3 className="text-xl font-black text-white">Mission Passed!</h3>
                              <p className="text-xs text-slate-400 mb-4">+50 Python XP Earned</p>
                              <Button onClick={() => setIsPassed(false)} className="bg-emerald-600 rounded-xl">Continue Exploring</Button>
                          </div>
                      </div>
                  )}
              </div>
              <div className="h-60 bg-black border-t border-slate-800 p-6 font-mono text-sm shadow-inner">
                <div className="flex items-center gap-2 mb-4 text-slate-600">
                  <Terminal className="h-3 w-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">System Console</span>
                </div>
                <ScrollArea className="h-40">
                  {output.map((line, i) => (
                    <div key={i} className="text-emerald-500/80 mb-1">{`>>> ${line}`}</div>
                  ))}
                  {output.length === 0 && <div className="text-slate-800 italic">No output yet. Run your code to see results.</div>}
                </ScrollArea>
              </div>
            </div>
          </Card>
        </main>
        
        <aside className="lg:col-span-3 space-y-6">
          <Card className="bg-slate-900 border-indigo-500/30 rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-indigo-500/20">
            <CardHeader className="bg-indigo-600 p-6">
              <CardTitle className="text-sm font-black text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-300" /> Neural Coding Tutor
              </CardTitle>
              <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest opacity-70">Context-Aware AI Helper</p>
            </CardHeader>
            
            <CardContent className="p-6 space-y-4">
              {tutorResponse ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                     <p className="text-xs text-indigo-300 font-bold mb-2">Professor says:</p>
                     <p className="text-xs leading-relaxed text-slate-300">{tutorResponse.explanation}</p>
                  </div>
                  <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20">
                     <p className="text-[10px] text-indigo-400 font-black uppercase mb-1">Lightbulb Hint</p>
                     <p className="text-xs italic text-indigo-200">{tutorResponse.hint}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => setTutorResponse(null)} 
                    className="w-full text-[10px] font-bold text-slate-500 hover:text-white"
                  >
                    Ask another question
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Stuck on <span className="text-indigo-400 font-bold">{activeLesson.title}</span>? 
                    Describe your problem below and I'll guide you through the logic.
                  </p>
                  <Textarea 
                    placeholder="e.g. Why am I getting a SyntaxError?" 
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    className="bg-slate-950 border-slate-800 rounded-2xl text-xs min-h-[80px] focus:ring-indigo-500"
                  />
                  <Button 
                    onClick={askTutor} 
                    disabled={isAiLoading || !aiQuestion}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl h-12"
                  >
                    {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get AI Guidance"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-[32px] space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="text-yellow-500 h-5 w-5" />
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-tight">Pro Mindsets</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">Practice Daily</p>
                  <p className="text-[10px] text-slate-400 mt-1">Consistency is the key to mastering logic.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="h-5 w-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">Build Projects</p>
                  <p className="text-[10px] text-slate-400 mt-1">Apply what you learn in the editor immediately.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <Card className="bg-slate-900 border-slate-800 rounded-[32px] overflow-hidden">
            <CardHeader>
              <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Learning Portals</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-2">
              <a 
                href="https://docs.python.org/3/tutorial/" 
                target="_blank" 
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-colors group"
              >
                <span className="text-xs font-bold text-slate-300 group-hover:text-yellow-500">Official Python Docs</span>
                <ChevronRight className="h-3 w-3 text-slate-600" />
              </a>
              <a 
                href="https://www.w3schools.com/python/" 
                target="_blank" 
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-colors group"
              >
                <span className="text-xs font-bold text-slate-300 group-hover:text-blue-400">W3Schools Tutorial</span>
                <ChevronRight className="h-3 w-3 text-slate-600" />
              </a>
              <a 
                href="https://www.geeksforgeeks.org/python-programming-language/" 
                target="_blank" 
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-colors group"
              >
                <span className="text-xs font-bold text-slate-300 group-hover:text-emerald-400">GeeksforGeeks</span>
                <ChevronRight className="h-3 w-3 text-slate-600" />
              </a>
              <a 
                href="https://github.com/" 
                target="_blank" 
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Github className="h-3 w-3 text-white" />
                  <span className="text-xs font-bold text-slate-300 group-hover:text-white">GitHub Community</span>
                </div>
                <ChevronRight className="h-3 w-3 text-slate-600" />
              </a>
            </CardContent>
          </Card>

        </aside>
      </div>
    </div>
  );
}
