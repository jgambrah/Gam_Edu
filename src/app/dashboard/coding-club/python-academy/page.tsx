
'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { 
  Loader2, Play, Save, CheckCircle2, ChevronRight, 
  Code2, Terminal, Info, Target, BarChart3, Calendar, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Editor from '@monaco-editor/react'; // UPGRADE 1: MONACO
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';

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
  const [activeLesson, setActiveLesson] = useState({ id: "p1-2-2", title: "Variables", task: "Create a variable named 'year' and set it to 2025.", startingCode: "year = " });
  const [code, setCode] = useState(activeLesson.startingCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isLoadingPy, setIsLoadingPy] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isPassed, setIsPassed] = useState(false); // UPGRADE 2: VALIDATION
  const pyodide = useRef<any>(null);
  const {toast} = useToast();

  useEffect(() => {
    async function initPyodide() {
      // @ts-ignore
      pyodide.current = await window.loadPyodide();
      // Load Matplotlib/NumPy for Phase 4
      await pyodide.current.loadPackage(['numpy', 'matplotlib']);
      setIsLoadingPy(false);
    }
    if (!pyodide.current) initPyodide();
  }, []);

  const runAndValidate = async () => {
    if (!pyodide.current) return;
    setIsRunning(true);
    setOutput([]);
    setIsPassed(false);

    // Redirect stdout to console state
    pyodide.current.setStdout({ batched: (str: string) => setOutput(prev => [...prev, str]) });

    try {
      // 1. Clear previous Matplotlib plots
      pyodide.current.runPython(`
        import matplotlib.pyplot as plt
        plt.clf()
      `);

      // 2. Run Student Code
      await pyodide.current.runPythonAsync(code);

      // 3. UPGRADE 2: AUTO-VALIDATION LOGIC
      let success = false;
      if (activeLesson.id === "p1-2-2") {
        // Check if variable 'year' exists in Python memory and is 2025
        success = pyodide.current.runPython("globals().get('year') == 2025");
      }
      
      if (activeLesson.id === "p1-2-1") { // Print lesson
            success = output.join("").includes("Hello World");
      }

      if (success) {
        setIsPassed(true);
        confetti({ particleCount: 100, spread: 70 });
        // Save progress to Firebase automatically
        if (user && firestore) {
            await setDoc(doc(firestore, 'student_coding_progress', `${user.uid}_${activeLesson.id}`), {
                userId: user.uid, completed: true, timestamp: serverTimestamp()
            });
        }
      }

      // 4. UPGRADE 3: RENDER MATPLOTLIB TO CANVAS
      const hasPlot = code.includes("plt.show()") || code.includes("plt.plot");
      if (hasPlot) {
        // This targets an HTML div with id="plot-target"
        pyodide.current.runPython(`
            import io, base64
            buf = io.BytesIO()
            plt.savefig(buf, format='png')
            buf.seek(0)
            img_str = 'data:image/png;base64,' + base64.b64encode(buf.read()).decode('UTF-8')
            from js import document
            document.getElementById('plot-output').src = img_str
        `);
      }

    } catch (err: any) {
      setOutput(prev => [...prev, `❌ Error: ${err.message}`]);
    }
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIDEBAR: NAVIGATION & STREAK */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-yellow-500 p-2 rounded-xl shadow-lg shadow-yellow-500/20"><Code2 className="text-slate-900" /></div>
            <h2 className="text-xl font-black text-white">Python Pro</h2>
          </div>

          <ContributionHeatmap /> {/* UPGRADE 4: HEATMAP */}

          <div className="bg-slate-900/50 rounded-3xl p-4 border border-slate-800">
             <p className="text-[10px] font-black text-slate-500 uppercase mb-4">Phase 1: Basics</p>
             <button className="w-full text-left p-3 rounded-xl bg-yellow-500 text-slate-950 font-bold text-xs">
                Current: Variables
             </button>
          </div>
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

            {/* EDITOR (UPGRADE 1: MONACO) */}
            <div className="flex-1 relative">
              <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v || "")}
                options={{ fontSize: 16, minimap: { enabled: false }, padding: { top: 20 }, automaticLayout: true }}
              />
              
              {/* TASK OVERLAY */}
              <div className="absolute bottom-6 left-6 right-6">
                 <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl flex items-center gap-4 shadow-2xl">
                    <div className="bg-indigo-500/20 p-2 rounded-lg"><Target className="text-indigo-400 w-4 h-4" /></div>
                    <p className="text-sm font-medium text-slate-200">{activeLesson.task}</p>
                 </div>
              </div>

              {/* MISSION PASSED OVERLAY */}
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

            {/* OUTPUT AREA (UPGRADE 3: TABS FOR VISUALS) */}
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
                    <img id="plot-output" className="max-h-full rounded-lg" alt="Science plot will appear here" src="/placeholder-plot.png" />
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </main>

        {/* RIGHT SIDEBAR (AI TUTOR) */}
        <aside className="lg:col-span-3 space-y-6">
            <Card className="bg-indigo-600 rounded-[32px] p-6 text-white shadow-xl">
                <Sparkles className="w-8 h-8 mb-4 text-yellow-300" />
                <h3 className="text-xl font-black mb-2">AI Coding Tutor</h3>
                <p className="text-sm text-indigo-100 mb-6 leading-relaxed">I can see your code and guide you if you get stuck on the variables lesson.</p>
                <Button className="w-full bg-white text-indigo-600 font-black rounded-xl">Ask for a Hint</Button>
            </Card>
        </aside>

      </div>
    </div>
  );
}

