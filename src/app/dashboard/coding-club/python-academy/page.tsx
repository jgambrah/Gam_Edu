'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, serverTimestamp, doc, getDoc, onSnapshot, addDoc, limit } from 'firebase/firestore';
import { 
  Play, CheckCircle2, Code2, BookOpen, ArrowRight, Loader2, Eraser, Trophy, Info, Sparkles, Github, Terminal, BarChart3, ChevronRight, RefreshCw
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
  loading: () => <div className="flex h-64 items-center justify-center bg-slate-900 text-slate-400">Loading Editor...</div>,
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
        <div className="space-y-3 bg-slate-900/50 p-5 rounded-[24px] border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Consistency Streak</p>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm bg-slate-800" />
                    <div className="w-2 h-2 rounded-sm bg-emerald-500" />
                </div>
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1 w-fit">
                {days.map((_, i) => {
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
            <p className="text-[9px] text-slate-500 font-bold italic">Practice daily to unlock rewards! 🔥</p>
        </div>
    );
}


// --- REFERENCE GUIDE DATA ---
const REFERENCE_DATA = [
  { title: "Variables", desc: "Containers for storing data values.", example: "score = 10" },
  { title: "print()", desc: "Outputs text or numbers to the console.", example: "print('Hello')" },
];

function PythonAcademy() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();

  // --- STATE ---
  const [allMissions, setAllMissions] = useState<Mission[]>([]);
  const [currentMissionId, setCurrentMissionId] = useState("p1-2-1");
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
      
      await pyodide.current.loadPackage(['numpy']);
      
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
    
        pyodide.current.setStdout({ 
            batched: (str: string) => setOutput(prev => [...prev, str]) 
        });
    
        try {
            pyodide.current.runPython(`import matplotlib.pyplot as plt; plt.clf(); plt.close('all')`);
            await pyodide.current.runPythonAsync(code);
    
            let isCorrect = false;
            if (activeLesson.validation) {
                isCorrect = pyodide.current.runPython(activeLesson.validation);
            } else {
                isCorrect = output.length > 0 || code.length > 10;
            }
    
            if (isCorrect) {
                setIsPassed(true);
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                speak("Great job!");
            }
    
            const hasPlotting = code.includes("plt.plot") || code.includes("plt.show");
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
      if (res.success && res.data) {
        setTutorResponse(res.data);
        speak(res.data.explanation);
      }
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

  if (!activeLesson) {
      return (
          <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      );
  }
  
  return (
    <div className="bg-[#020617] text-slate-300 p-1 font-sans rounded-3xl overflow-hidden flex flex-col min-h-[600px]">
      <Script 
          src="https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js" 
          strategy="lazyOnload"
          onLoad={handleScriptLoad}
        />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 flex-1">
        
        <aside className="lg:col-span-3 space-y-6 flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-yellow-500 p-2 rounded-xl shadow-lg shadow-yellow-500/20"><Code2 className="text-slate-900" /></div>
            <h2 className="text-xl font-black text-white">Academy</h2>
          </div>
          
          <ContributionHeatmap progressData={[]} />
          
          <ScrollArea className="flex-1 rounded-[2rem] border-2 border-slate-800 bg-slate-900/50 p-2">
            <div className="p-2 space-y-2">
              {PYTHON_ACADEMY_CURRICULUM.map((phase) => (
                <Accordion key={phase.phase} type="single" collapsible className="w-full">
                  <AccordionItem value={phase.phase} className="border-none">
                    <AccordionTrigger className="hover:no-underline p-3 bg-slate-800/50 rounded-2xl mb-1 group">
                      <span className="font-black text-slate-300 text-[10px] uppercase tracking-widest">{phase.title}</span>
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

        <main className="lg:col-span-6 flex flex-col gap-4 overflow-hidden">
          <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
            <div className="bg-slate-800/50 px-8 py-4 flex justify-between items-center border-b border-slate-700">
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">● Interpreter Ready</Badge>
              <Button onClick={runAndValidate} disabled={isLoadingPy || isRunning} className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black rounded-xl px-8 h-10 transition-all active:scale-95">
                {isRunning ? <Loader2 className="animate-spin" /> : <><Play className="mr-2 h-4 w-4 fill-current" /> Run Script</>}
              </Button>
            </div>

            <div className="flex-1 relative border-b border-slate-800 bg-[#1e1e1e] min-h-[300px]">
                {isLoadingPy ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                        <p>Loading Interpreter...</p>
                    </div>
                ) : (
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
                            fontFamily: 'monospace'
                        }}
                    />
                )}

                {isPassed && (
                    <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center animate-in zoom-in duration-300">
                        <div className="bg-slate-900 border-2 border-yellow-500 p-8 rounded-[3rem] text-center space-y-6 max-w-sm">
                            <div className="relative mx-auto w-20 h-20">
                                <div className="absolute inset-0 bg-yellow-500 rounded-full animate-ping opacity-20" />
                                <div className="relative bg-yellow-500 w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle2 className="h-10 w-10 text-slate-900" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-white italic">SUCCESS!</h3>
                            <Button onClick={goToNextLesson} className="w-full h-14 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-2xl shadow-xl">
                                NEXT LESSON <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="h-48 bg-black shrink-0">
                <Tabs defaultValue="console" className="h-full flex flex-col">
                    <div className="px-6 py-2 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                        <TabsList className="bg-slate-950 p-1">
                            <TabsTrigger value="console" className="text-[10px] font-black uppercase">Console</TabsTrigger>
                            <TabsTrigger value="visuals" className="text-[10px] font-black uppercase">Graph</TabsTrigger>
                        </TabsList>
                    </div>
                    
                    <TabsContent value="console" className="flex-1 p-4 font-mono text-sm overflow-y-auto">
                        {output.map((line, i) => <div key={i} className="text-emerald-400/90 mb-1">{`>>> ${line}`}</div>)}
                        {output.length === 0 && <span className="text-slate-700 italic">...</span>}
                    </TabsContent>

                    <TabsContent value="visuals" className="flex-1 flex items-center justify-center p-4 bg-slate-50 relative">
                        <img id="plot-output" className="max-h-full rounded shadow-sm border" alt="Plot output" src="https://placehold.co/400x300/0f172a/10b981?text=No+Plot+Data"/>
                    </TabsContent>
                </Tabs>
            </div>
          </Card>
        </main>
        
        <aside className="lg:col-span-3 space-y-6 overflow-y-auto">
          <Card className="bg-slate-900 border-indigo-500/30 rounded-[2rem] overflow-hidden shadow-2xl">
            <CardHeader className="bg-indigo-600 p-4">
              <CardTitle className="text-xs font-black text-white flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-yellow-300" /> AI Coach
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {tutorResponse ? (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                     <p className="text-[10px] text-indigo-300 font-bold mb-1">Coach Tip:</p>
                     <p className="text-xs leading-relaxed text-slate-300">{tutorResponse.explanation}</p>
                  </div>
                  <Button variant="ghost" onClick={() => setTutorResponse(null)} className="w-full text-[10px] font-bold text-slate-500 hover:text-white">Ask Again</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Textarea 
                    placeholder="Ask a question..." 
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    className="bg-slate-950 border-slate-800 rounded-xl text-xs min-h-[80px]"
                  />
                  <Button onClick={askTutor} disabled={isAiLoading || !aiQuestion} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl h-10">
                    {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Help"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 rounded-[2rem] overflow-hidden">
            <CardHeader className="p-4 border-b border-slate-800">
              <CardTitle className="text-[10px] font-black text-slate-500 uppercase">Resources</CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              <a href="https://docs.python.org/3/tutorial/" target="_blank" className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 transition-colors group">
                <span className="text-[11px] font-bold text-slate-300 group-hover:text-yellow-500">Python Docs</span>
                <ChevronRight className="h-3 w-3 text-slate-600" />
              </a>
              <a href="https://github.com/" target="_blank" className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 transition-colors group">
                <div className="flex items-center gap-2">
                  <Github className="h-3 w-3 text-white" />
                  <span className="text-[11px] font-bold text-slate-300 group-hover:text-white">GitHub</span>
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

export default function PythonAcademyPage() {
    return <PythonAcademy />;
}
