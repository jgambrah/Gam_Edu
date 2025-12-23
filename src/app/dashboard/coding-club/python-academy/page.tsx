
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, orderBy, serverTimestamp, setDoc, doc, getDoc } from 'firebase/firestore';
import { 
  Loader2, Play, Save, CheckCircle2, ChevronRight, 
  Code2, Terminal, Info, Target, BarChart3, Calendar, Sparkles, Trophy, HelpCircle, Github, BookOpen, Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPythonTutorHelp } from '@/ai/flows/senior-actions';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';


const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center bg-slate-900 text-slate-400">Loading Editor...</div>,
});


// --- THE CORRECT, PHASED CURRICULUM ---
const PYTHON_ACADEMY_CURRICULUM = [
    // Phase 1
    { id: "p1-1", phase: "Phase 1: Python Fundamentals", title: "Print 'Hello'", task: "Print the exact text: Hello, Python Pro!", expectedOutput: "Hello, Python Pro!", startingCode: "print(\"...\")" },
    { id: "p1-2", phase: "Phase 1: Python Fundamentals", title: "Variables", task: "Create a variable named 'school_name' and assign it the value 'Sunnyside'. Print the variable.", expectedOutput: "Sunnyside", startingCode: "school_name = \"...\"\nprint(school_name)" },
    { id: "p1-3", phase: "Phase 1: Python Fundamentals", title: "Basic Math", task: "Add the numbers 25 and 17. Print the result.", expectedOutput: "42", startingCode: "result = ...\nprint(result)" },
    // Phase 2
    { id: "p2-1", phase: "Phase 2: Intermediate Python", title: "If/Else Statements", task: "Given `score = 85`, if the score is greater than 80, print 'Pass'. Otherwise, print 'Fail'.", expectedOutput: "Pass", startingCode: "score = 85\nif score > ...:\n  print(...)\nelse:\n  print(...)" },
    { id: "p2-2", phase: "Phase 2: Intermediate Python", title: "Lists", task: "Create a list called `subjects` containing 'Math', 'Science', 'English'. Print the second item in the list.", expectedOutput: "Science", startingCode: "subjects = [...]\nprint(subjects[...])" },
    { id: "p2-3", phase: "Phase 2: Intermediate Python", title: "For Loops", task: "Loop through the `subjects` list and print each one on a new line.", expectedOutput: "Math\nScience\nEnglish", startingCode: "subjects = ['Math', 'Science', 'English']\nfor s in ...:\n  print(s)" },
    // Phase 3
    { id: "p3-1", phase: "Phase 3: OOP & Beyond", title: "Functions", task: "Define a function called `greet` that takes a `name` and prints 'Welcome, ' followed by the name. Call it with 'Admin'.", expectedOutput: "Welcome, Admin", startingCode: "def greet(name):\n  ...\ngreet(...)" },
    { id: "p3-2", phase: "Phase 3: OOP & Beyond", title: "Classes and Objects", task: "Create a `Student` class. Inside, create an `__init__` method that sets `self.name = 'Alex'`. Then, create an object and print its name.", expectedOutput: "Alex", startingCode: "class Student:\n  def __init__(self):\n    ...\n\nstudent1 = ...\nprint(student1.name)" },
    // Phase 4
    { id: "p4-1", phase: "Phase 4: Specialization", title: "Data Plotting", task: "Import matplotlib.pyplot as plt. Plot the data x=[1, 2, 3] and y=[2, 4, 1]. Then show the plot.", expectedOutput: "", startingCode: "import matplotlib.pyplot as plt\n\nx = [1, 2, 3]\ny = [2, 4, 1]\n\nplt.plot(x, y)\nplt.show()" },
];

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
  const [activeLesson, setActiveLesson] = useState(PYTHON_ACADEMY_CURRICULUM[0]);
  const [code, setCode] = useState(activeLesson.startingCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isLoadingPy, setIsLoadingPy] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  const pyodide = useRef<any>(null);

  // AI Tutor State
  const [aiQuestion, setAiQuestion] = useState("");
  const [tutorResponse, setTutorResponse] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // --- HOOKS ---
  useEffect(() => {
    async function initPyodide() {
      // @ts-ignore
      pyodide.current = await window.loadPyodide();
      await pyodide.current.loadPackage(['numpy', 'matplotlib']);
      setIsLoadingPy(false);
    }
    if (typeof window !== 'undefined' && !pyodide.current) initPyodide();
  }, []);
  
  useEffect(() => {
    setCode(activeLesson.startingCode);
    setIsPassed(false);
    setOutput([]);
    setTutorResponse(null);
  }, [activeLesson]);

  const groupedMissions = useMemo(() => {
    const groups: Record<string, any[]> = {};
    PYTHON_ACADEMY_CURRICULUM.forEach(m => {
      if (!groups[m.phase]) groups[m.phase] = [];
      groups[m.phase].push(m);
    });
    return groups;
  }, []);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.9;
        window.speechSynthesis.speak(u);
    }
  };
  
  // --- ACTIONS ---
  const runAndValidate = async () => {
    if (!pyodide.current) return;
    setIsRunning(true);
    setOutput([]);
    setIsPassed(false);

    pyodide.current.setStdout({ batched: (str: string) => setOutput(prev => [...prev, str]) });

    try {
      pyodide.current.runPython(`import matplotlib.pyplot as plt\nplt.clf()`);
      await pyodide.current.runPythonAsync(code);

      let validationCheck = false;
      
      const normalizedOutput = output.join("\n").trim();
      if (normalizedOutput === activeLesson.expectedOutput) {
          validationCheck = true;
      }
      
      if (activeLesson.id === "p1-2") { // More robust variable check
        validationCheck = pyodide.current.runPython("globals().get('school_name') == 'Sunnyside'");
      }

      if (validationCheck) {
        setIsPassed(true);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        speak("Mission accomplished! Great coding.");
        if (user && firestore) {
            await setDoc(doc(firestore, 'student_coding_progress', `${user.uid}_${activeLesson.id}`), {
                userId: user.uid, completed: true, timestamp: serverTimestamp()
            });
        }
      } else {
        toast({ variant: 'destructive', title: "Try Again", description: "The output doesn't match the mission goal."})
      }

      const hasPlot = code.includes("plt.show()") || code.includes("plt.plot");
      if (hasPlot) {
        pyodide.current.runPython(`
            import io, base64
            buf = io.BytesIO()
            plt.savefig(buf, format='png')
            buf.seek(0)
            img_str = 'data:image/png;base64,' + base64.b64encode(buf.read()).decode('UTF-8')
            from js import document
            img_element = document.getElementById('plot-output')
            if img_element:
                img_element.src = img_str
        `);
      }

    } catch (err: any) {
      setOutput(prev => [...prev, `❌ Error: ${err.message}`]);
    }
    setIsRunning(false);
  };
  
  const askTutor = async () => {
    if (!aiQuestion.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await getPythonTutorHelp({
        phase: activeLesson.phase,
        lesson: activeLesson.title,
        task: activeLesson.task,
        userCode: code,
        question: aiQuestion
      });
      if (res.success && res.data) {
        setTutorResponse(res.data);
        speak(res.data.explanation);
      } else {
        throw new Error(res.error || "AI failed to respond.");
      }
    } catch(e) {
        toast({ title: "AI Tutor Error", description: "Could not get a response.", variant: "destructive"});
    } finally {
      setIsAiLoading(false);
      setAiQuestion("");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIDEBAR: NAVIGATION & STREAK */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-yellow-500 p-2 rounded-xl shadow-lg shadow-yellow-500/20"><Code2 className="text-slate-900" /></div>
            <h2 className="text-xl font-black text-white">Python Pro Academy</h2>
          </div>
          <ContributionHeatmap />
          <ScrollArea className="h-[70vh] rounded-3xl border-2 border-slate-800 bg-slate-900/50 p-2">
            <div className="p-2 space-y-2">
              {Object.entries(groupedMissions).map(([phase, lessons]) => (
                <Accordion key={phase} type="single" collapsible className="w-full" defaultValue={activeLesson.phase === phase ? phase : ''}>
                  <AccordionItem value={phase} className="border-none">
                    <AccordionTrigger className="hover:no-underline p-3 bg-slate-800/50 rounded-2xl mb-1 group">
                      <span className="font-black text-slate-300 text-xs uppercase tracking-tight">{phase}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pl-4 space-y-1">
                      {lessons.map(lesson => (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all ${activeLesson.id === lesson.id ? 'bg-yellow-500 text-slate-950 shadow-md' : 'hover:bg-slate-800 text-slate-400'}`}
                        >
                          {lesson.title}
                        </button>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* MAIN WORKSTATION */}
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
                        <h3 className="text-3xl font-black text-white">Mission Passed!</h3>
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
                    <img id="plot-output" className="max-h-full rounded-lg bg-white" alt="Matplotlib plot will appear here" src="https://picsum.photos/seed/plot/400/200?blur=10" />
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </main>
        
        {/* RIGHT SIDEBAR (AI TUTOR) */}
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
                  <Button variant="ghost" onClick={() => setTutorResponse(null)} className="w-full text-[10px] font-bold text-slate-500 hover:text-white">
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
                  <Button onClick={askTutor} disabled={isAiLoading || !aiQuestion} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl h-12">
                    {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get AI Guidance"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
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
          <Card className="bg-slate-900 border-slate-800 rounded-[32px] overflow-hidden">
            <CardHeader>
              <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Learning Portals</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-6 space-y-2">
              <a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-colors group">
                <span className="text-xs font-bold text-slate-300 group-hover:text-yellow-500">Official Python Docs</span>
                <ChevronRight className="h-3 w-3 text-slate-600" />
              </a>
              <a href="https://www.w3schools.com/python/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-colors group">
                <span className="text-xs font-bold text-slate-300 group-hover:text-blue-400">W3Schools Tutorial</span>
                <ChevronRight className="h-3 w-3 text-slate-600" />
              </a>
              <a href="https://www.geeksforgeeks.org/python-programming-language/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-colors group">
                <span className="text-xs font-bold text-slate-300 group-hover:text-emerald-400">GeeksforGeeks</span>
                <ChevronRight className="h-3 w-3 text-slate-600" />
              </a>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-colors group">
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
