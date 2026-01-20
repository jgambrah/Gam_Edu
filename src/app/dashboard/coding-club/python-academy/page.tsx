

'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, serverTimestamp, setDoc, doc, getDoc, onSnapshot, addDoc, increment } from 'firebase/firestore';
import { 
  Play, RotateCcw, HelpCircle, CheckCircle2, Lock, 
  Code2, Bot, Trash2, BookOpen, CornerDownLeft, ArrowRight, Loader2, Eraser, AlertCircle, FlaskConical, Trophy, Info, Sparkles, Github, Sigma as SigmaIcon, Languages as LanguagesIcon, Atom as AtomIcon, Rocket, Terminal, BarChart3, Target, PenTool, ChevronRight, RefreshCw
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import AdminBlockManager from './AdminBlockManager';
import AdminMissionCreator from '@/components/AdminMissionCreator';
import confetti from 'canvas-confetti';
import { getPythonTutorHelp } from '@/ai/flows/senior-actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center bg-slate-900 text-slate-400">Loading Editor...</div>,
});


const PYTHON_ACADEMY_CURRICULUM = [
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
          { 
            id: "p1-2-2", 
            title: "Variables", 
            task: "Create a variable named 'year' and set it to 2025.", 
            startingCode: "year = ",
            validation: "globals().get('year') == 2025" 
          },
          { id: "p1-2-3", title: "Input/Output (I/O)", task: "Use input() to ask for a color and print it.", startingCode: "color = input('Favorite color? ')\nprint('You chose: ' + color)" },
          {
            id: "p1-2-4",
            title: "Arithmetic",
            task: "Calculate 5 times 5 and name the variable 'result'.",
            startingCode: "result = ",
            validation: "globals().get('result') == 25"
          },
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

interface Mission {
  id: string;
  title: string;
  task: string;
  startingCode: string;
  phase: string;
  mainTopicTitle: string;
  validation?: string;
}

// --- SECTION: CONTRIBUTION HEATMAP ---
function ContributionHeatmap({ progressData }: { progressData: any[] }) {
    // Generates 28 days (4 weeks) of activity
    const days = Array.from({ length: 28 }); 
    
    return (
        <div className="space-y-3 bg-slate-900/50 p-5 rounded-[24px] border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Coding Consistency</p>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm bg-slate-800" />
                    <div className="w-2 h-2 rounded-sm bg-emerald-500" />
                </div>
            </div>
            {/* GitHub style grid */}
            <div className="grid grid-flow-col grid-rows-7 gap-1 w-fit">
                {days.map((_, i) => {
                    // Logic to highlight squares based on progress (simulated here)
                    const isActive = i > 15 && i < 22 || i === 27; 
                    return (
                        <div 
                            key={i} 
                            className={`w-3 h-3 rounded-sm transition-colors ${
                                isActive 
                                ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
                                : 'bg-slate-800'
                            }`} 
                        />
                    );
                })}
            </div>
            <p className="text-[9px] text-slate-500 font-bold italic">Keep the streak alive to master Python! 🔥</p>
        </div>
    );
}


// --- REFERENCE GUIDE DATA ---
const REFERENCE_DATA = [
  { title: "Variables", desc: "Containers for storing data values.", example: "score = 10" },
  { title: "print()", desc: "Outputs text or numbers to the console.", example: "print('Hello')" },
  { title: "if / else", desc: "Decides which code to run based on a condition.", example: "if x > 5: print('Big')" },
  { title: "for loop", desc: "Repeats code for each item in a sequence.", example: "for i in range(3):" },
  { title: "while loop", desc: "Repeats code as long as a condition is true.", example: "while x < 10:" },
  { title: "input()", desc: "Pauses the program to get text from the user.", example: "name = input()" },
];

function PythonAcademy() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  // --- STATE ---
  const [allMissions, setAllMissions] = useState<Mission[]>([]);
  const [currentMissionId, setCurrentMissionId] = useState("p1-2-1");
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isLoadingPy, setIsLoadingPy] = useState(true);
  const [pyodideError, setPyodideError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  const pyodide = useRef<any>(null);
  
  // AI Tutor State
  const [aiQuestion, setAiQuestion] = useState("");
  const [tutorResponse, setTutorResponse] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  
  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; 
    window.speechSynthesis.speak(u);
  };

  const handleScriptLoad = async () => {
    if (pyodide.current) return;
    try {
      // @ts-ignore - loadPyodide is available on window after script loads
      pyodide.current = await window.loadPyodide();
      await pyodide.current.loadPackage(['numpy', 'matplotlib', 'pandas']);
      setIsLoadingPy(false);
      console.log('Pyodide loaded successfully.');
    } catch (error) {
      console.error('Failed to load Pyodide:', error);
      setIsLoadingPy(false);
      setPyodideError("Failed to initialize the Python environment after loading.");
    }
  };
  
  const handleScriptError = () => {
    console.error("Pyodide script failed to load from CDN.");
    setPyodideError("Could not load the Python environment. Please check your network connection and try refreshing the page. If the problem persists, the CDN might be down.");
    setIsLoadingPy(false); // Stop the main loader
  };

  // --- LOAD & FLATTEN MISSIONS ---
  useEffect(() => {
    if (!firestore) return;
    const q = query(collection(firestore, 'logic_lab_curriculum'), orderBy('id'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const dbMissions: any[] = [];
        snapshot.forEach((doc) => dbMissions.push(doc.data()));
        
        const flattenedSyllabus = PYTHON_ACADEMY_CURRICULUM.flatMap(phase => 
            phase.mainTopics.flatMap(mainTopic => 
                mainTopic.lessons.map(lesson => ({
                    ...lesson,
                    phase: phase.title,
                    mainTopicTitle: mainTopic.title
                }))
            )
        );
        
        // Combine static and DB missions, ensuring unique IDs
        const combined = [...flattenedSyllabus, ...dbMissions];
        const uniqueMissions = Array.from(new Map(combined.map(m => [m.id, m])).values());

        setAllMissions(uniqueMissions.sort((a,b) => a.id.localeCompare(b.id)));
        setIsDataLoading(false); // Data is ready
    });
    return () => unsubscribe();
  }, [firestore]);


  const activeLesson = useMemo(() => {
    if (allMissions.length === 0) return null;
    return allMissions.find(m => m.id === currentMissionId) || allMissions[0];
  }, [allMissions, currentMissionId]);

  // Reset code when mission changes
  useEffect(() => {
    if (activeLesson) {
        setCode(activeLesson.startingCode || '');
    }
    setIsPassed(false);
    setOutput([]);
    setTutorResponse(null);
  }, [activeLesson]);

    // --- SECTION: RUN & VALIDATE ENGINE ---
    const runAndValidate = async () => {
        if (!pyodide.current || !activeLesson) return;
        setIsRunning(true);
        setOutput([]);
        setIsPassed(false);
    
        // Set output handling
        pyodide.current.setStdout({ 
            batched: (str: string) => setOutput(prev => [...prev, str]) 
        });
    
        try {
            // 1. Reset Matplotlib and run code
            pyodide.current.runPython(`import matplotlib.pyplot as plt; plt.clf(); plt.close('all')`);
            await pyodide.current.runPythonAsync(code);
    
            // 2. AUTO-VALIDATION: Check if goal was met
            let isCorrect = false;
            
            if (activeLesson.validation) {
                // Run the specific hidden validation script for this lesson
                isCorrect = pyodide.current.runPython(activeLesson.validation);
            } else {
                // Fallback: If no script, check if the console has any output
                isCorrect = output.length > 0 || code.length > 10;
            }
    
            if (isCorrect) {
                // THE CELEBRATION
                setIsPassed(true);
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#fbbf24', '#34d399', '#60a5fa', '#f87171'] // Vibrant coding colors
                });
                speak("Mission accomplished! Well done.");
            }
    
            // 3. VISUAL LAB: Capture Matplotlib output
            const hasPlotting = code.includes("plt.plot") || code.includes("plt.show");
            if (hasPlotting) {
                pyodide.current.runPython(`
                    import io, base64
                    buf = io.BytesIO()
                    plt.savefig(buf, format='png', bbox_inches='tight')
                    buf.seek(0)
                    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
                    from js import document
                    // Push image data to our Visual Lab tab
                    if (document.getElementById('plot-output')) {
                        document.getElementById('plot-output').src = 'data:image/png;base64,' + img_base64;
                    }
                `);
            }
    
        } catch (err: any) {
            setOutput(prev => [...prev, `❌ Python Error: ${err.message}`]);
        }
        setIsRunning(false);
    };
  
  const askTutor = async () => {
    if (!aiQuestion.trim() || !activeLesson) return;
    setIsAiLoading(true);
    try {
      const res = await getPythonTutorHelp({
        phase: activeLesson.phase || "Fundamentals",
        lesson: activeLesson.title,
        task: activeLesson.task,
        userCode: code,
        question: aiQuestion
      });
      if (res.success) {
        setTutorResponse(res.data);
        speak(res.data.explanation); 
      }
    } finally {
      setIsAiLoading(false);
      setAiQuestion("");
    }
  };

  const goToNextLesson = () => {
    // 1. Hide the celebration immediately
    setIsPassed(false); 
    
    // 2. Map out the entire curriculum into a flat list for easy navigation
    const allLessonsFlat = allMissions;
    
    // 3. Find where we are currently
    const currentIndex = allLessonsFlat.findIndex(l => l.id === activeLesson?.id);
    
    // 4. If there is a next lesson, move to it
    if (currentIndex < allLessonsFlat.length - 1) {
      const next = allLessonsFlat[currentIndex + 1];
      setCurrentMissionId(next.id);
      setCode(next.startingCode); // Load fresh code for the new task
      setOutput([]);              // Clear the old console
      toast({ title: `Next Mission: ${next.title}` });
    } else {
      // 5. If they finished the very last lesson of Phase 4
      confetti({ particleCount: 300, spread: 120, origin: { y: 0.5 } });
      toast({ 
          title: "ACADEMY GRADUATE!", 
          description: "You have completed the entire Python pathway!",
          variant: "default"
      });
    }
  };


  if (pyodideError) {
    return (
        <div className="flex h-screen w-screen items-center justify-center p-8">
            <Card className="max-w-lg border-red-500 border-2">
                <CardHeader>
                    <CardTitle className="text-red-600">Environment Error</CardTitle>
                    <CardDescription>
                       The Python interpreter required for this module failed to load.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-700">{pyodideError}</p>
                    <Button onClick={() => window.location.reload()} className="mt-4 w-full">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reload Page
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (isDataLoading || isLoadingPy || !activeLesson) {
      return (
          <div className="flex h-screen w-screen items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="ml-4">
                {isLoadingPy ? "Loading Python Environment..." : "Loading Curriculum..."}
              </p>
          </div>
      );
  }
  
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 font-sans">
      <Script 
          src="https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js" 
          strategy="lazyOnload"
          onLoad={handleScriptLoad}
          onError={handleScriptError}
        />
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <aside className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-yellow-500 p-2 rounded-xl shadow-lg shadow-yellow-500/20"><Code2 className="text-slate-900" /></div>
            <h2 className="text-xl font-black text-white">Python Pro Academy</h2>
          </div>
          
          <ContributionHeatmap progressData={userProgress} />
          
          <ScrollArea className="h-[70vh] rounded-3xl border-2 border-slate-800 bg-slate-900/50 p-2">
            <div className="p-2 space-y-2">
              {PYTHON_ACADEMY_CURRICULUM.map((phase) => (
                <Accordion key={phase.phase} type="single" collapsible className="w-full" defaultValue={activeLesson.phase === phase.title ? phase.phase : ''}>
                  <AccordionItem value={phase.phase} className="border-none">
                    <AccordionTrigger className="hover:no-underline p-3 bg-slate-800/50 rounded-2xl mb-1 group">
                      <span className="font-black text-slate-300 text-xs uppercase tracking-tight">{phase.title}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pl-4 space-y-1">
                      {phase.mainTopics.map((mainTopic: any) => (
                        <Accordion key={mainTopic.title} type="single" collapsible>
                          <AccordionItem value={mainTopic.title} className="border-none">
                            <AccordionTrigger className="text-[11px] font-bold text-slate-500 py-2 hover:text-emerald-400">
                                {mainTopic.title}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-1">
                                {mainTopic.lessons.map((lesson: any) => (
                                    <button
                                        key={lesson.id}
                                        onClick={() => setCurrentMissionId(lesson.id)}
                                        className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all ${activeLesson?.id === lesson.id ? 'bg-yellow-500 text-slate-950 shadow-md' : 'hover:bg-slate-800 text-slate-400'}`}
                                    >
                                        {lesson.title}
                                    </button>
                                ))}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </ScrollArea>
        </aside>

        <main className="lg:col-span-6 flex flex-col gap-4">
          <Card className="bg-slate-900 border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col h-[800px]">
            <div className="bg-slate-800/50 px-8 py-4 flex justify-between items-center border-b border-slate-700">
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">● System Online</Badge>
              <Button onClick={runAndValidate} disabled={isLoadingPy || isRunning} className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl px-8 h-10 transition-all active:scale-95">
                {isRunning ? <Loader2 className="animate-spin" /> : <><Play className="mr-2 h-4 w-4 fill-current" /> Execute Code</>}
              </Button>
            </div>

            <div className="flex-1 relative border-b border-slate-800 bg-[#1e1e1e]">
                <Editor
                    height="100%"
                    defaultLanguage="python"
                    theme="vs-dark"
                    value={code}
                    onChange={(v) => setCode(v || "")}
                    options={{
                        fontSize: 16,
                        minimap: { enabled: false },
                        padding: { top: 20 },
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        lineNumbers: 'on',
                        fontFamily: 'JetBrains Mono, monospace'
                    }}
                />

                {/* THE CELEBRATION OVERLAY */}
                {isPassed && (
                    <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center animate-in zoom-in duration-300">
                        <div className="bg-slate-900 border-2 border-yellow-500 p-10 rounded-[48px] shadow-[0_0_60px_rgba(251,191,36,0.3)] text-center space-y-8 max-w-md">
                            
                            {/* Animated Icon */}
                            <div className="relative mx-auto w-24 h-24">
                                <div className="absolute inset-0 bg-yellow-500 rounded-full animate-ping opacity-20" />
                                <div className="relative bg-yellow-500 w-24 h-24 rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle2 className="h-14 w-14 text-slate-900" />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="text-4xl font-black text-white tracking-tight italic">MISSION PASSED!</h3>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    Logic validation successful. You've mastered the <span className="text-yellow-500 font-bold">{activeLesson.title}</span> task!
                                </p>
                            </div>

                            {/* CHOICE BUTTONS */}
                            <div className="grid grid-cols-1 gap-3 pt-4">
                                <Button 
                                    onClick={goToNextLesson}
                                    className="h-16 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black text-xl rounded-2xl shadow-[0_6px_0_#b45309] active:translate-y-1 active:shadow-none transition-all"
                                >
                                    GO TO NEXT LESSON <ArrowRight className="ml-2 h-6 w-6" />
                                </Button>

                                <Button 
                                    variant="ghost" 
                                    onClick={() => {
                                        setIsPassed(false);
                                        toast({ description: "Free practice mode active. Keep experimenting!" });
                                    }}
                                    className="h-12 text-slate-400 hover:text-white hover:bg-white/5 font-bold rounded-xl"
                                >
                                    Stay & Practice More
                                </Button>
                            </div>

                            <div className="flex items-center justify-center gap-2 opacity-40">
                                <Trophy className="h-3 w-3 text-yellow-500" />
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">+50 ACADEMY XP EARNED</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="h-64 bg-black">
                <Tabs defaultValue="console" className="h-full flex flex-col">
                    <div className="px-6 py-2 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                        <TabsList className="bg-slate-950 p-1">
                            <TabsTrigger value="console" className="text-[10px] font-black uppercase">
                                <Terminal className="w-3 h-3 mr-2"/> Console
                            </TabsTrigger>
                            <TabsTrigger value="visuals" className="text-[10px] font-black uppercase">
                                <BarChart3 className="w-3 h-3 mr-2"/> Visual Lab
                            </TabsTrigger>
                        </TabsList>
                        <p className="text-[9px] font-mono text-slate-500">Python 3.11 (WASM)</p>
                    </div>
                    
                    <TabsContent value="console" className="flex-1 p-6 font-mono text-sm overflow-y-auto">
                        {output.map((line, i) => <div key={i} className="text-emerald-400/90 mb-1">{`>>> ${line}`}</div>)}
                        {output.length === 0 && <span className="text-slate-700 italic">Terminal ready...</span>}
                    </TabsContent>

                    <TabsContent value="visuals" className="flex-1 flex items-center justify-center p-4 bg-slate-50 relative">
                        <img 
                            id="plot-output" 
                            className="max-h-full rounded shadow-lg border border-slate-200" 
                            alt="Matplotlib plots will appear here"
                            src="https://placehold.co/600x400/0f172a/10b981?text=Awaiting+Plot+Data"
                        />
                        <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="text-[8px]">Matplotlib Render</Badge>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
          </Card>
        </main>
        
        <aside className="lg:col-span-3 space-y-6">
          {/* 1. NEURAL TUTOR CARD */}
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

          {/* 2. PRO TIPS (Moved below) */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-[32px] space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="text-yellow-500 h-4 w-4" />
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Professional Tips</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex gap-2 text-[11px] font-bold text-slate-300">
                <span className="text-yellow-500">★</span> Consistency is key.
              </li>
              <li className="flex gap-2 text-[11px] font-bold text-slate-300">
                <span className="text-yellow-500">★</span> Build projects to apply logic.
              </li>
            </ul>
          </div>

          {/* 3. LEARNING PORTALS */}
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

// Separate component for the main page logic to avoid client/server component issues
function Page() {
    const { user, isUserLoading } = useUser();
    const { role, isRoleLoading } = useRole();

    if (isUserLoading || isRoleLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return <PythonAcademy />;
}

export default Page;
