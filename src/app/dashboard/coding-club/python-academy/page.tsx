'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, serverTimestamp, doc, getDoc, onSnapshot, addDoc, limit, setDoc } from 'firebase/firestore';
import { 
  Play, CheckCircle2, Code2, BookOpen, ArrowRight, Loader2, Eraser, Trophy, Info, Sparkles, Github, Terminal, BarChart3, ChevronRight, RefreshCw, XCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { getPythonTutorHelp } from '@/ai/flows/senior-actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { useCurrentSchool } from '@/hooks/use-current-school';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="flex h-64 items-center justify-center bg-slate-950 text-slate-400">Loading editor compiler...</div>,
});

const PYTHON_ACADEMY_CURRICULUM = [
  {
    phase: "Phase 1",
    title: "Python Fundamentals",
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
      }
    ]
  },
  {
    phase: "Phase 2",
    title: "Decision Making & Loops",
    mainTopics: [
      {
        title: "1. If/Else Conditions",
        lessons: [
          {
            id: "p2-1-1",
            title: "If Statements",
            task: "Check if 'num' is positive and print 'Positive'.",
            startingCode: "num = 10\nif num > 0:\n    print('Positive')",
            validation: "True"
          },
          {
            id: "p2-1-2",
            title: "If-Else Blocks",
            task: "Create a variable 'x' equal to 4. If x is even, print 'Even', else print 'Odd'.",
            startingCode: "x = 4\nif x % 2 == 0:\n    print('Even')\nelse:\n    print('Odd')",
            validation: "globals().get('x') == 4"
          },
          {
            id: "p2-1-3",
            title: "Elif Ladder",
            task: "Set 'score' to 85. If score >= 90 print 'A', elif score >= 80 print 'B', else print 'C'.",
            startingCode: "score = 85\nif score >= 90:\n    print('A')\nelif score >= 80:\n    print('B')\nelse:\n    print('C')",
            validation: "globals().get('score') == 85"
          }
        ]
      },
      {
        title: "2. Loops",
        lessons: [
          {
            id: "p2-2-1",
            title: "While Loops",
            task: "Print numbers from 1 to 3 using a while loop.",
            startingCode: "count = 1\nwhile count <= 3:\n    print(count)\n    count += 1",
            validation: "globals().get('count') == 4"
          },
          {
            id: "p2-2-2",
            title: "For Loops",
            task: "Print numbers 0, 1, 2 using range().",
            startingCode: "for i in range(3):\n    print(i)",
            validation: "True"
          },
          {
            id: "p2-2-3",
            title: "Break & Continue",
            task: "Loop through range(5). If the number is 3, break. Otherwise print it.",
            startingCode: "for i in range(5):\n    if i == 3:\n        break\n    print(i)",
            validation: "True"
          }
        ]
      }
    ]
  },
  {
    phase: "Phase 3",
    title: "Data Structures",
    mainTopics: [
      {
        title: "1. Lists",
        lessons: [
          {
            id: "p3-1-1",
            title: "List Basics",
            task: "Create a list named 'fruits' with 'apple' and 'banana'.",
            startingCode: "fruits = ['apple', 'banana']\nprint(fruits)",
            validation: "'fruits' in globals() and isinstance(globals()['fruits'], list) and 'apple' in globals()['fruits'] and 'banana' in globals()['fruits']"
          },
          {
            id: "p3-1-2",
            title: "List Operations",
            task: "Create an empty list 'colors' and append 'red'.",
            startingCode: "colors = []\ncolors.append('red')\nprint(colors)",
            validation: "'colors' in globals() and globals()['colors'] == ['red']"
          }
        ]
      },
      {
        title: "2. Tuples & Sets",
        lessons: [
          {
            id: "p3-2-1",
            title: "Tuples",
            task: "Create a tuple named 'coords' with values 10 and 20.",
            startingCode: "coords = (10, 20)\nprint(coords)",
            validation: "'coords' in globals() and isinstance(globals()['coords'], tuple) and globals()['coords'] == (10, 20)"
          },
          {
            id: "p3-2-2",
            title: "Sets",
            task: "Create a set named 'unique_nums' with values 1, 2, and 2 (note duplicate removal).",
            startingCode: "unique_nums = {1, 2, 2}\nprint(unique_nums)",
            validation: "'unique_nums' in globals() and isinstance(globals()['unique_nums'], set) and globals()['unique_nums'] == {1, 2}"
          }
        ]
      },
      {
        title: "3. Dictionaries",
        lessons: [
          {
            id: "p3-3-1",
            title: "Dictionaries",
            task: "Create a dict 'grades' mapping 'Alice' to 95.",
            startingCode: "grades = {'Alice': 95}\nprint(grades)",
            validation: "'grades' in globals() and isinstance(globals()['grades'], dict) and globals()['grades'].get('Alice') == 95"
          }
        ]
      }
    ]
  },
  {
    phase: "Phase 4",
    title: "Functions & Modules",
    mainTopics: [
      {
        title: "1. Functions",
        lessons: [
          {
            id: "p4-1-1",
            title: "Defining Functions",
            task: "Define a function 'greet(name)' that returns 'Hello ' + name.",
            startingCode: "def greet(name):\n    return 'Hello ' + name\n\nprint(greet('Sam'))",
            validation: "'greet' in globals() and callable(globals()['greet']) and globals()['greet']('Sam') == 'Hello Sam'"
          },
          {
            id: "p4-1-2",
            title: "Return Values",
            task: "Define a function 'square(x)' that returns x times x.",
            startingCode: "def square(x):\n    return x * x\n\nprint(square(4))",
            validation: "'square' in globals() and callable(globals()['square']) and globals()['square'](4) == 16"
          }
        ]
      },
      {
        title: "2. Modules",
        lessons: [
          {
            id: "p4-2-1",
            title: "Math Module",
            task: "Import the 'math' module and calculate square root of 64 as 'ans'.",
            startingCode: "import math\nans = math.sqrt(64)\nprint(ans)",
            validation: "'ans' in globals() and globals()['ans'] == 8.0"
          },
          {
            id: "p4-2-2",
            title: "Random Module",
            task: "Import 'random' and use randint(1, 100) to get a number 'num'.",
            startingCode: "import random\nnum = random.randint(1, 100)\nprint(num)",
            validation: "'num' in globals() and isinstance(globals()['num'], int) and 1 <= globals()['num'] <= 100"
          }
        ]
      }
    ]
  },
  {
    phase: "Phase 5",
    title: "Object-Oriented Python",
    mainTopics: [
      {
        title: "1. Classes & Objects",
        lessons: [
          {
            id: "p5-1-1",
            title: "Defining Classes",
            task: "Define a class 'Robot' with attribute 'name'. Set 'r = Robot(\"Dexter\")'.",
            startingCode: "class Robot:\n    def __init__(self, name):\n        self.name = name\n\nr = Robot('Dexter')",
            validation: "'r' in globals() and 'Robot' in globals() and isinstance(globals()['r'], globals()['Robot']) and globals()['r'].name == 'Dexter'"
          },
          {
            id: "p5-1-2",
            title: "Methods",
            task: "Add a method 'greet(self)' to 'Robot' returning 'I am ' + self.name. Call it on 'r'.",
            startingCode: "class Robot:\n    def __init__(self, name):\n        self.name = name\n    def greet(self):\n        return 'I am ' + self.name\n\nr = Robot('Dexter')\nmsg = r.greet()",
            validation: "'msg' in globals() and globals()['msg'] == 'I am Dexter'"
          },
          {
            id: "p5-1-3",
            title: "Inheritance",
            task: "Create class 'MedicalRobot' that inherits from 'Robot' and has a method 'heal()'.",
            startingCode: "class Robot:\n    def __init__(self, name):\n        self.name = name\n\nclass MedicalRobot(Robot):\n    def heal(self):\n        return 'Healed!'\n\nmr = MedicalRobot('Helper')",
            validation: "'mr' in globals() and 'MedicalRobot' in globals() and isinstance(globals()['mr'], globals()['MedicalRobot']) and globals()['mr'].heal() == 'Healed!' and globals()['mr'].name == 'Helper'"
          }
        ]
      }
    ]
  },
  {
    phase: "Phase 6",
    title: "Data Visualization & Libraries",
    mainTopics: [
      {
        title: "1. NumPy Arrays",
        lessons: [
          {
            id: "p6-1-1",
            title: "NumPy Basics",
            task: "Import numpy as np. Create a 1D array 'arr' with values [10, 20, 30].",
            startingCode: "import numpy as np\narr = np.array([10, 20, 30])\nprint(arr)",
            validation: "import numpy as np; 'arr' in globals() and isinstance(globals()['arr'], np.ndarray) and list(globals()['arr']) == [10, 20, 30]"
          }
        ]
      },
      {
        title: "2. Matplotlib Plots",
        lessons: [
          {
            id: "p6-2-1",
            title: "Line Plots",
            task: "Import matplotlib.pyplot as plt and numpy as np. Plot y = sin(x) for x from 0 to 10.",
            startingCode: "import matplotlib.pyplot as plt\nimport numpy as np\n\nx = np.linspace(0, 10, 100)\ny = np.sin(x)\nplt.plot(x, y)\nplt.title('Sine Wave')\nplt.show()",
            validation: "True"
          },
          {
            id: "p6-2-2",
            title: "Bar Charts",
            task: "Create a bar chart showing category values. labels = ['Apples', 'Bananas'], values = [12, 18].",
            startingCode: "import matplotlib.pyplot as plt\nlabels = ['Apples', 'Bananas']\nvalues = [12, 18]\nplt.bar(labels, values)\nplt.title('Fruit Count')\nplt.show()",
            validation: "True"
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
    const days = Array.from({ length: 28 }); 
    
    return (
        <div className="space-y-3 bg-slate-950/80 p-5 rounded-[24px] border border-slate-900 shadow-inner">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Consistency Streak</p>
                <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-sm bg-slate-900 border border-slate-800" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.35)]" />
                </div>
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1 w-fit">
                {days.map((_, i) => {
                    const isActive = (i > 15 && i < 22) || i === 27; 
                    return (
                        <div 
                            key={i} 
                            className={`w-3.5 h-3.5 rounded-sm transition-all border border-slate-900/50 ${
                                isActive 
                                ? 'bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.3)]' 
                                : 'bg-slate-900 hover:bg-slate-850'
                            }`} 
                        />
                    );
                })}
            </div>
            <p className="text-[9px] text-slate-500 font-bold italic">Practice daily to unlock rewards! 🔥</p>
        </div>
    );
}

function PythonAcademy() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();

  // --- STATE ---
  const [allMissions, setAllMissions] = useState<Mission[]>([]);
  const [currentMissionId, setCurrentMissionId] = useState("p1-1-1");
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isLoadingPy, setIsLoadingPy] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  const pyodide = useRef<any>(null);
  
  const [aiQuestion, setAiQuestion] = useState("");
  const [tutorResponse, setTutorResponse] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; 
    window.speechSynthesis.speak(u);
  };

  const handleScriptLoad = async () => {
    if (pyodide.current) {
      setIsLoadingPy(false);
      return;
    }
    
    try {
      // @ts-ignore 
      if (!window.loadPyodide) return;
      
      // @ts-ignore 
      pyodide.current = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/"
      });
      
      await pyodide.current.loadPackage(['numpy', 'matplotlib']);
      
    } catch (error: any) {
      console.error('Pyodide error:', error);
    } finally {
      setIsLoadingPy(false);
    }
  };
  
  useEffect(() => {
    const flattenedSyllabus = PYTHON_ACADEMY_CURRICULUM.flatMap(phase => 
        phase.mainTopics.flatMap(mainTopic => 
            mainTopic.lessons.map(lesson => ({
                ...lesson,
                phase: phase.title,
                mainTopicTitle: mainTopic.title
            }))
        )
    );
    setAllMissions(flattenedSyllabus);
  }, []);

  // --- LOAD PROGRESS ---
  useEffect(() => {
    if (!user || !firestore) return;
    const fetchProgress = async () => {
        try {
            const ref = doc(firestore, 'student_progress', user.uid);
            const snap = await getDoc(ref);
            if (snap.exists() && snap.data().pythonAcademyCompleted) {
                setCompletedMissions(snap.data().pythonAcademyCompleted);
            }
        } catch (e) {
            console.error("Error loading progress:", e);
        }
    };
    fetchProgress();
  }, [user, firestore]);

  const activeLesson = useMemo(() => {
    if (allMissions.length === 0) return null;
    return allMissions.find(m => m.id === currentMissionId) || allMissions[0];
  }, [allMissions, currentMissionId]);

  useEffect(() => {
    if (activeLesson) {
        setCode(activeLesson.startingCode || '');
    }
    setIsPassed(false);
    setOutput([]);
    setTutorResponse(null);
  }, [activeLesson]);

  const runAndValidate = async () => {
        if (!pyodide.current || !activeLesson) return;
        setIsRunning(true);
        setOutput([]);
        setIsPassed(false);
    
        const localOutput: string[] = [];
        pyodide.current.setStdout({ 
            batched: (str: string) => {
                localOutput.push(str);
                setOutput(prev => [...prev, str]);
            } 
        });
    
        try {
            pyodide.current.runPython(`import matplotlib.pyplot as plt; plt.clf(); plt.close('all')`);
            await pyodide.current.runPythonAsync(code);
    
            let isCorrect = false;
            if (activeLesson.validation) {
                isCorrect = pyodide.current.runPython(activeLesson.validation);
            } else {
                isCorrect = localOutput.length > 0 || code.length > 10;
            }
    
            if (isCorrect) {
                setIsPassed(true);
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#d946ef', '#4f46e5'] });
                speak("Great job!");

                if (user && firestore) {
                    const nextMissions = Array.from(new Set([...completedMissions, activeLesson.id]));
                    setCompletedMissions(nextMissions);
                    try {
                        const progressRef = doc(firestore, 'student_progress', user.uid);
                        await setDoc(progressRef, { pythonAcademyCompleted: nextMissions }, { merge: true });
                    } catch (e) {
                        console.error("Failed to save progress:", e);
                    }
                }
            }
    
            const hasPlotting = code.includes("plt.plot") || code.includes("plt.show") || code.includes("plt.bar");
            if (hasPlotting) {
                pyodide.current.runPython(`
                    import io, base64
                    buf = io.BytesIO()
                    plt.savefig(buf, format='png', bbox_inches='tight')
                    buf.seek(0)
                    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
                    from js import document
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
    if (!aiQuestion.trim() || !activeLesson || !schoolId) {
        toast({ variant: 'destructive', title: "Missing details", description: "Verify your question and school ID." });
        return;
    }
    setIsAiLoading(true);
    try {
      const res = await getPythonTutorHelp({
        phase: activeLesson.phase || "Fundamentals",
        lesson: activeLesson.title,
        task: activeLesson.task,
        userCode: code,
        question: aiQuestion,
        schoolId: schoolId
      });
      if (res.success && res.data) {
        setTutorResponse(res.data);
        speak(res.data.explanation);
      } else {
        toast({ variant: 'destructive', title: "Tutor Busy", description: res.error || "AI credit spent limit hit." });
      }
    } catch (e: any) {
        toast({ variant: 'destructive', title: "AI Error", description: e.message || "Failed to contact coach." });
    } finally {
      setIsAiLoading(false);
      setAiQuestion("");
    }
  };

  const goToNextLesson = () => {
    setIsPassed(false); 
    const currentIndex = allMissions.findIndex(l => l.id === activeLesson?.id);
    if (currentIndex < allMissions.length - 1) {
      const next = allMissions[currentIndex + 1];
      setCurrentMissionId(next.id);
    }
  };

  const progressPercentage = Math.round((completedMissions.length / allMissions.length) * 100) || 0;
  const studentRank = completedMissions.length < 5 
    ? "Python Novice 🐍" 
    : completedMissions.length < 12 
      ? "Logic Explorer 🔍" 
      : completedMissions.length < 20 
        ? "Data Apprentice 📊" 
        : "AI Architect 🤖";

  if (!activeLesson) {
      return (
          <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-fuchsia-500" />
          </div>
      );
  }
  
  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 text-slate-350 p-1 font-sans rounded-3xl overflow-hidden flex flex-col min-h-[600px] shadow-2xl relative">
      <Script 
          src="https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js" 
          strategy="lazyOnload"
          onLoad={handleScriptLoad}
        />

      {/* --- TOP BAR: GAMIFICATION --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-900 shadow-xl gap-4 mb-4 shrink-0 mx-4 mt-4">
        <div className="flex items-center gap-3">
             <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 p-2.5 rounded-full"><Trophy className="h-5 w-5 text-fuchsia-400" /></div>
             <div>
                 <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Student Rank</div>
                 <div className="text-sm font-bold text-white flex items-center gap-2">
                     {studentRank}
                     <Badge className="bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 text-[9px] py-0.5 font-mono">{completedMissions.length} / {allMissions.length} Solved</Badge>
                 </div>
             </div>
        </div>
        <div className="flex-1 mx-8 w-full sm:w-auto">
             <div className="flex justify-between text-[10px] mb-1">
                 <span className="font-bold uppercase tracking-wider text-slate-400">Academy Completion</span>
                 <span className="font-bold text-fuchsia-400">{progressPercentage}%</span>
             </div>
             <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-950">
                 <div className="bg-gradient-to-r from-fuchsia-500 to-violet-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 flex-grow items-stretch">
        
        <aside className="lg:col-span-3 space-y-6 flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 p-2.5 rounded-xl shadow-lg"><Code2 className="text-fuchsia-400" /></div>
            <h2 className="text-lg font-black text-white">Academy Index</h2>
          </div>
          
          <ContributionHeatmap progressData={[]} />
          
          <ScrollArea className="flex-grow rounded-3xl border border-slate-900 bg-slate-950/60 p-3 shadow-inner">
            <div className="p-1 space-y-2">
              {PYTHON_ACADEMY_CURRICULUM.map((phase) => (
                <Accordion key={phase.phase} type="single" collapsible className="w-full">
                  <AccordionItem value={phase.phase} className="border-none">
                    <AccordionTrigger className="hover:no-underline p-3 bg-slate-900/50 rounded-2xl mb-1 group border border-slate-950 hover:bg-slate-900">
                      <span className="font-black text-slate-350 text-[10px] uppercase tracking-widest text-slate-300">{phase.title}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pl-3 space-y-1">
                      {phase.mainTopics.map((mainTopic: any) => (
                        <Accordion key={mainTopic.title} type="single" collapsible>
                          <AccordionItem value={mainTopic.title} className="border-none">
                            <AccordionTrigger className="text-[11px] font-extrabold text-slate-500 py-2.5 hover:text-fuchsia-400 hover:no-underline px-2 transition-all">
                                {mainTopic.title}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-1 pl-2">
                                {mainTopic.lessons.map((lesson: any) => {
                                    const isCompleted = completedMissions.includes(lesson.id);
                                    const isActive = activeLesson?.id === lesson.id;
                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setCurrentMissionId(lesson.id)}
                                            className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${isActive ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/20' : 'hover:bg-slate-900/40 text-slate-400 hover:text-slate-200'}`}
                                        >
                                            <span className="truncate">{lesson.title}</span>
                                            {isCompleted && <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ml-2 ${isActive ? 'text-white' : 'text-emerald-400'}`} />}
                                        </button>
                                    );
                                })}
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

        <main className="lg:col-span-6 flex flex-col gap-4 overflow-hidden min-h-[500px]">
          <Card className="bg-slate-955 bg-slate-950 border border-slate-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-full">
            <div className="bg-slate-900/80 px-6 py-3.5 flex flex-col gap-2 border-b border-slate-950 shrink-0">
              <div className="text-xs text-slate-400 font-bold bg-slate-950/40 border border-slate-900/80 p-3 rounded-xl">
                Goal: <span className="text-fuchsia-400 font-extrabold">{activeLesson.task}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-emerald-500/25 animate-pulse text-[10px] py-0.5 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Interpreter Connected
                </Badge>
                <Button onClick={runAndValidate} disabled={isLoadingPy || isRunning} className="bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 text-white font-bold rounded-xl px-6 h-10 shadow-lg shadow-fuchsia-500/20 transition-all active:scale-95 text-xs flex items-center gap-1.5">
                  {isRunning ? <Loader2 className="animate-spin h-4 w-4" /> : <><Play className="h-4 w-4 fill-current text-white" /> Execute Script</>}
                </Button>
              </div>
            </div>

            <div className="flex-grow relative bg-[#1e1e1e] min-h-[300px] border-b border-slate-955 border-slate-950">
                {isLoadingPy ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-950">
                        <Loader2 className="w-8 h-8 animate-spin mb-4 text-fuchsia-500" />
                        <p className="text-xs">Preparing Web Python Sandbox...</p>
                    </div>
                ) : (
                    <Editor
                        height="100%"
                        defaultLanguage="python"
                        theme="vs-dark"
                        value={code}
                        onChange={(v) => setCode(v || "")}
                        options={{
                            fontSize: 15,
                            minimap: { enabled: false },
                            padding: { top: 15 },
                            automaticLayout: true,
                            scrollBeyondLastLine: false,
                            lineNumbers: 'on',
                            fontFamily: 'monospace'
                        }}
                    />
                )}

                {isPassed && (
                    <div className="absolute inset-0 z-50 bg-slate-955/85 bg-slate-950/85 backdrop-blur-md flex items-center justify-center animate-in zoom-in duration-300">
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-center space-y-6 max-w-sm shadow-2xl">
                            <div className="relative mx-auto w-16 h-16">
                                <div className="absolute inset-0 bg-fuchsia-500 rounded-full animate-ping opacity-20" />
                                <div className="relative bg-gradient-to-tr from-fuchsia-500 to-violet-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle2 className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-white tracking-tight">MISSION COMPLETED</h3>
                                <p className="text-xs text-slate-400">Great work! The output validation passed.</p>
                            </div>
                            <Button onClick={goToNextLesson} className="w-full h-12 bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 text-white font-bold rounded-xl shadow-xl shadow-fuchsia-500/20 active:scale-95 transition-all text-xs">
                                NEXT LESSON <ArrowRight className="ml-1.5 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="h-44 bg-slate-950 shrink-0 flex flex-col border-t border-slate-900">
                <Tabs defaultValue="console" className="h-full flex flex-col">
                    <div className="px-6 py-2 bg-slate-950 border-b border-slate-900 flex justify-between items-center shrink-0">
                        <TabsList className="bg-slate-900/60 p-0.5 border border-slate-850 rounded-lg">
                            <TabsTrigger value="console" className="text-[10px] font-bold uppercase py-1 px-3 data-[state=active]:bg-fuchsia-500/10 data-[state=active]:text-fuchsia-400">Terminal Output</TabsTrigger>
                            <TabsTrigger value="visuals" className="text-[10px] font-bold uppercase py-1 px-3 data-[state=active]:bg-fuchsia-500/10 data-[state=active]:text-fuchsia-400">Matplotlib Graph</TabsTrigger>
                        </TabsList>
                    </div>
                    
                    <TabsContent value="console" className="flex-1 p-4 font-mono text-xs overflow-y-auto leading-relaxed">
                        {output.map((line, i) => <div key={i} className="text-emerald-400/90 mb-1">{`>>> ${line}`}</div>)}
                        {output.length === 0 && <span className="text-slate-700 italic">No output received yet. Click Run Script above.</span>}
                    </TabsContent>
 
                    <TabsContent value="visuals" className="flex-1 flex items-center justify-center p-3 bg-slate-900/30 relative">
                        <img id="plot-output" className="max-h-full max-w-[280px] rounded-lg shadow-md border border-slate-850 bg-slate-950" alt="Plot output" src="https://placehold.co/400x300/0f172a/d946ef?text=No+Plot+Data"/>
                    </TabsContent>
                </Tabs>
            </div>
          </Card>
        </main>
        
        <aside className="lg:col-span-3 space-y-6 flex flex-col overflow-y-auto">
          <Card className="bg-slate-950/80 border border-slate-900 rounded-[2rem] overflow-hidden shadow-2xl shrink-0">
            <div className="bg-gradient-to-r from-fuchsia-955/20 to-indigo-955/20 bg-slate-900/50 p-4 border-b border-slate-900 flex items-center justify-between">
              <CardTitle className="text-xs font-black text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-fuchsia-400" /> Dr. Gam AI Coach
              </CardTitle>
              <Badge className="bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/25 text-[9px] py-0.5">1 credit / tutor hint</Badge>
            </div>
            <CardContent className="p-4 space-y-4">
              {tutorResponse ? (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl shadow-inner space-y-2">
                     <p className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-wider">Tutor Explanation</p>
                     <p className="text-xs leading-relaxed text-slate-300">{tutorResponse.explanation}</p>
                     {tutorResponse.hint && (
                          <div className="pt-2 border-t border-slate-800/80">
                              <p className="text-[10px] text-violet-400 font-bold uppercase tracking-wider">Hint</p>
                              <p className="text-xs leading-relaxed text-slate-400 italic">"{tutorResponse.hint}"</p>
                          </div>
                     )}
                  </div>
                  <Button variant="ghost" onClick={() => setTutorResponse(null)} className="w-full text-[10px] font-bold text-slate-500 hover:text-white rounded-xl hover:bg-slate-900">Ask another question</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Type a coding question or explain your script error..." 
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl text-xs min-h-[90px] focus:ring-1 focus:ring-fuchsia-500 focus:outline-none p-3 text-slate-200"
                  />
                  <Button onClick={askTutor} disabled={isAiLoading || !aiQuestion.trim()} className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-xl h-10 text-xs shadow-lg shadow-fuchsia-500/10">
                    {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : "Request AI Assistance"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-950 border border-slate-900 rounded-[2rem] overflow-hidden shrink-0">
            <CardHeader className="p-4 border-b border-slate-900">
              <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Developer Resources</CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              <a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-900 transition-colors group">
                <span className="text-[11px] font-bold text-slate-350 group-hover:text-fuchsia-400 text-slate-300">Official Python Docs</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              </a>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-900 transition-colors group">
                <div className="flex items-center gap-2">
                  <Github className="h-3.5 w-3.5 text-white" />
                  <span className="text-[11px] font-bold text-slate-350 group-hover:text-white text-slate-300">GitHub Portal</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              </a>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

export default function PythonAcademyPage() {
    return <PythonAcademy />;
}
