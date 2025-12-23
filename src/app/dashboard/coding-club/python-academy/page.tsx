
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, serverTimestamp, setDoc, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { 
  Play, RotateCcw, HelpCircle, CheckCircle2, Lock, 
  Code2, Bot, Trash2, BookOpen, CornerDownLeft, ArrowRight, Loader2, Eraser, AlertCircle, FlaskConical, Trophy, Info, Sparkles, Github, Sigma as SigmaIcon, Languages as LanguagesIcon, Atom as AtomIcon, Rocket, Terminal, BarChart3, Target, BookCopy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
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

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center bg-slate-900 text-slate-400">Loading Editor...</div>,
});


// --- UPDATED FULL PHASE 1 SYLLABUS ---
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
    mainTopics: []
  },
  {
    phase: "Phase 4",
    title: "Specialization & Projects (Weeks 7+)",
    mainTopics: []
  }
];


// --- UPGRADE 4: STREAK COMPONENT ---
function ContributionHeatmap() {
    const days = Array.from({ length: 28 }); // Mocking 4 weeks
    return (
        <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Coding Activity</p>
            <div className="grid grid-flow-col grid-rows-7 gap-1 w-fit">
                {days.map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-3 h-3 rounded-sm ${i > 20 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : i > 10 ? 'bg-emerald-800' : 'bg-slate-900'}`} 
                    />
                ))}
            </div>
            <p className="text-[9px] text-slate-600 font-bold">12 day streak! 🔥</p>
        </div>
    );
}

export default function PythonAcademy() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  // --- STATE ---
  const [allMissions, setAllMissions] = useState<any[]>(PYTHON_ACADEMY_CURRICULUM);
  const [currentMissionId, setCurrentMissionId] = useState("p1-1-1");
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isLoadingPy, setIsLoadingPy] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  const pyodide = useRef<any>(null);

  // AI Tutor State
  const [aiQuestion, setAiQuestion] = useState("");
  const [tutorResponse, setTutorResponse] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // --- PYODIDE INITIALIZATION ---
  useEffect(() => {
    async function initPyodide() {
      if (!pyodide.current) {
        // @ts-ignore
        pyodide.current = await window.loadPyodide();
        
        // PRE-LOAD PROFESSIONAL PACKAGES
        // This ensures Phase 4 (Data Science) works instantly
        await pyodide.current.loadPackage(['numpy', 'matplotlib', 'pandas']);
        
        setIsLoadingPy(false);
      }
    }
    initPyodide();
  }, []);

  const activeLesson = useMemo(() => {
      for (const phase of allMissions) {
          for (const topic of phase.mainTopics) {
              const lesson = topic.lessons.find((l: any) => l.id === currentMissionId);
              if (lesson) return lesson;
          }
      }
      return null;
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

  const runAndValidate = async () => {
    if (!pyodide.current) return;
    setIsRunning(true);
    setOutput([]);
    setIsPassed(false);

    pyodide.current.setStdout({ batched: (str: string) => setOutput(prev => [...prev, str]) });

    // --- PART A: RUN PYTHON ---
    try {
      await pyodide.current.runPythonAsync(code);
      
      // Validation Logic
      let success = false;
      if (activeLesson?.id === "p1-2-2") {
        success = pyodide.current.runPython("globals().get('year') == 2025");
      }
      
      if (success) {
        setIsPassed(true);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

        // --- PART B: SAVE TO DATABASE (Isolated Try/Catch) ---
        if (user && firestore && activeLesson) {
            try {
                await setDoc(doc(firestore, 'student_coding_progress', `${user.uid}_${activeLesson.id}`), {
                    userId: user.uid, 
                    completed: true, 
                    timestamp: serverTimestamp(),
                });
            } catch (dbError) {
                console.error("Database save failed:", dbError);
                toast({ title: "Progress not saved", description: "Check your internet or database permissions." });
            }
        }
      }

      // 4. UPGRADE 3: RENDER MATPLOTLIB TO CANVAS
      const hasPlot = code.includes("plt.show()") || code.includes("plt.plot");
      if (hasPlot) {
        // This targets an HTML div with id="plot-target"
        pyodide.current.runPython(`
            import io, base64
            import matplotlib.pyplot as plt
            buf = io.BytesIO()
            plt.savefig(buf, format='png')
            buf.seek(0)
            img_str = 'data:image/png;base64,' + base64.b64encode(buf.read()).decode('UTF-8')
            from js import document
            document.getElementById('plot-output').src = img_str
        `);
      }

    } catch (pythonErr: any) {
      setOutput(prev => [...prev, `❌ Python Error: ${pythonErr.message}`]);
    }
    setIsRunning(false);
  };
  
   if (!activeLesson) {
    return <div className="flex h-screen w-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <aside className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-yellow-500 p-2 rounded-xl shadow-lg shadow-yellow-500/20"><Code2 className="text-slate-900" /></div>
            <h2 className="text-xl font-black text-white">Python Pro Academy</h2>
          </div>
          <ContributionHeatmap />
          <ScrollArea className="h-[70vh] rounded-3xl border-2 border-slate-800 bg-slate-900/50 p-2">
            <div className="p-2 space-y-2">
              {allMissions.map((phase) => (
                <Accordion key={phase.phase} type="single" collapsible className="w-full" defaultValue={activeLesson && activeLesson.id.startsWith(phase.phase.replace(/\s+/g, '-').toLowerCase().slice(0, 4)) ? phase.phase : ''}>
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
            <div className="bg-slate-800/50 px-8 py-4 flex justify-between items-center border-b border-slate-800">
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">● System Online</Badge>
              <Button onClick={runAndValidate} disabled={isLoadingPy || isRunning} className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl px-8 h-10 transition-all active:scale-95">
                {isRunning ? <Loader2 className="animate-spin" /> : <><Play className="mr-2 h-4 w-4 fill-current" /> Execute Code</>}
              </Button>
            </div>

            <div className="flex-1 relative">
              <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v || "")}
                options={{ fontSize: 16, minimap: { enabled: false }, padding: { top: 20 }, automaticLayout: true }}
              />
              <div className="absolute bottom-6 left-6 right-6">
                 <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl flex items-center gap-4 shadow-2xl">
                    <div className="bg-indigo-500/20 p-2 rounded-lg"><Target className="text-indigo-400 w-4 h-4" /></div>
                    <p className="text-sm font-medium text-slate-200">{activeLesson.task}</p>
                 </div>
              </div>
              {isPassed && (
                <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm flex items-center justify-center animate-in zoom-in">
                    <div className="bg-slate-900 border-2 border-emerald-500 p-10 rounded-[48px] shadow-2xl text-center space-y-4">
                        <CheckCircle2 className="h-20 w-20 text-emerald-500 mx-auto" />
                        <h3 className="text-3xl font-black text-white">Mission Complete!</h3>
                        <Button onClick={() => setIsPassed(false)} className="bg-emerald-600 rounded-2xl px-10 h-12 font-bold">Next Lesson</Button>
                    </div>
                </div>
              )}
            </div>

            <div className="h-64 bg-black border-t border-slate-800">
              <Tabs defaultValue="console" className="h-full flex flex-col">
                <TabsList className="bg-slate-900 w-fit mx-6 mt-4 rounded-lg">
                  <TabsTrigger value="console" className="text-[10px] uppercase font-bold"><Terminal className="w-3 h-3 mr-2"/> Console</TabsTrigger>
                  <TabsTrigger value="visuals" className="text-[10px] uppercase font-bold"><BarChart3 className="w-3 h-3 mr-2"/> Visual Lab</TabsTrigger>
                </TabsList>
                
                <TabsContent value="console" className="flex-1 p-6 font-mono text-sm overflow-y-auto">
                    {output.map((line, i) => <div key={i} className="text-emerald-400/80 mb-1">{`>>> ${line}`}</div>)}
                    {output.length === 0 && <p className="text-slate-700 italic">Awaiting execution...</p>}
                </TabsContent>

                <TabsContent value="visuals" className="flex-1 flex items-center justify-center p-4">
                    <img id="plot-output" className="max-h-full rounded-lg" alt="Science plot will appear here" src="https://placehold.co/400x200/000000/FFFFFF/png?text=Plot+Output" />
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </main>
        
        <aside className="lg:col-span-3 space-y-6">
            <Card className="bg-indigo-600 border-indigo-500/30 rounded-[32px] overflow-hidden shadow-2xl ring-1 ring-indigo-500/20">
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
                    onClick={async () => {
                      if (!aiQuestion.trim()) return;
                      setIsAiLoading(true);
                      const res = await getPythonTutorHelp({
                        phase: "Phase 1",
                        lesson: activeLesson.title,
                        task: activeLesson.task,
                        userCode: code,
                        question: aiQuestion
                      });
                      if (res.success) setTutorResponse(res.data);
                      setIsAiLoading(false);
                      setAiQuestion("");
                    }} 
                    disabled={isAiLoading || !aiQuestion}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl h-12"
                  >
                    {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get AI Guidance"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
